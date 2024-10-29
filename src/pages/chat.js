import React, { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { Icon } from "@iconify/react/dist/iconify.js";
import InputEmoji from "react-input-emoji";
import { useParams } from "react-router";
import { useSelector } from 'react-redux';

const Chat = () => {
   const chatContainerRef = useRef(null);
   const userId = useSelector((state) => state.auth.userId);
   const { messageID } = useParams();
   const stompClientRef = useRef(null);
   const [chat, setChat] = useState({ messages: [] });
   const [messageInput, setMessageInput] = useState('');
   const [users, setUsers] = useState([]);
   const [replyToMessageId, setReplyToMessageId] = useState(null);

   const fetchUsers = async () => {
      try {
         const response = await fetch('http://localhost:8080/api/users');
         const data = await response.json();
         setUsers(data);
      } catch (error) {
         console.error("Error fetching user data:", error);
      }
   };

   const fetchMessages = async () => {
       try {
           const response = await fetch(`http://localhost:8091/web-socket/conversation?participantOneId=${userId}&participantTwoId=${messageID}`);
           const data = await response.json();
           if (response.ok) {
               setChat(data);
           }
       } catch (error) {
           console.error(error);
       }
   };

   useEffect(() => {
      fetchUsers();
      fetchMessages();
   }, []);

   useEffect(() => {
      fetchMessages(); // Fetch messages whenever messageID changes
   }, [messageID]);

   useEffect(() => {
       const socket = new SockJS('http://localhost:8091/ws');
       const client = new Client({
           webSocketFactory: () => socket,
           onConnect: (frame) => {
               console.log('Connected: ' + frame);
               client.subscribe('/topic/messages', (messageOutput) => {
                   fetchMessages(); // Fetch updated messages
               });
           },
           onStompError: (frame) => {
               console.error('Broker reported error: ' + frame.headers['message']);
               console.error('Additional details: ' + frame.body);
           },
       });

       client.activate();
       stompClientRef.current = client;

       return () => {
           if (client) {
               client.deactivate();
           }
       };
   }, [messageID]);

   useEffect(() => {
       if (chatContainerRef.current) {
           chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
       }
   }, [chat.messages]); // Scroll to bottom whenever messages change

   const sendMessage = async () => {
       if (messageInput && stompClientRef.current && stompClientRef.current.connected) {
           const message = {
               senderId: userId,
               recipientId: Number(messageID),
               content: messageInput,
               replyTo: replyToMessageId,
           };

           stompClientRef.current.publish({
               destination: '/app/chat',
               body: JSON.stringify(message),
           });

           setMessageInput('');
           setReplyToMessageId(null);
           await fetchMessages(); // Optional: fetch messages to see the new one immediately
       }
   };

   const message = users.find(user => user.id === parseInt(messageID));

   return (
       <div className="flex flex-col max-w-[30rem] w-full">
           <div className="flex h-16 items-center bg-cta sticky text-white px-7 justify-between">
               <div className="flex items-center gap-2">
                   <img className="w-6 h-6 rounded-full" src={message?.profileImagePath} alt={message?.profileImagePath} />
                   <span className="font-semibold">{message?.name}</span>
               </div>
               <div className="flex items-center gap-4">
                   <Icon className="w-5 h-5" icon="ion:call-sharp" />
                   <Icon className="w-6 h-6" icon="mdi:video" />
               </div>
           </div>
           <hr />
           <div className="flex">
               <div className="h-auto w-full relative flex flex-col shadow-lg">
                   <div ref={chatContainerRef} className="p-4 overflow-y-auto h-[30rem] flex flex-col gap-2">
                       {replyToMessageId && (
                           <div className="bg-gray-200 p-2 rounded-md">
                               <span>Replying to:</span>
                               <span>{chat.messages.find(msg => msg.id === replyToMessageId)?.content}</span>
                           </div>
                       )}
                       {chat.messages.length > 0 ? (
                           chat.messages.map((msg) => (
                               <div className='py-2' key={msg.id}>
                                   <div className={`w-full ${msg.senderId === userId ? 'flex justify-end' : 'flex justify-start'} h-auto`}>
                                       <div className={`rounded-lg cursor-pointer p-2 w-max-[20rem] ${msg.senderId === userId ? 'bg-cta text-white' : 'bg-gray-100'}`}>
                                           <span onClick={() => setReplyToMessageId(msg.id)}>{msg.content}</span>
                                       </div>
                                   </div>
                                   {msg.replyTo && (
                                       <div className="ml-4 mt-2">
                                           <span className="text-gray-500">Replying to:</span>
                                           <div className={`rounded-lg p-2 ${msg.senderId === userId ? 'bg-cta text-white' : 'bg-gray-100'}`}>
                                               {chat.messages.find(reply => reply.id === msg.replyTo)?.content}
                                           </div>
                                       </div>
                                   )}
                               </div>
                           ))
                       ) : (
                           <div className="text-gray-500 text-center py-4">No messages to display.</div>
                       )}
                   </div>

                   <div className="bottom-0 sticky w-full bg-white absolute p-3 flex items-center">
                       <InputEmoji
                           value={messageInput}
                           onChange={(text) => setMessageInput(text)}
                           placeholder="Type your message..."
                           className="border h-9 rounded-md border-gray-400 flex-1 mr-2"
                       />
                       <Icon className="text-cta cursor-pointer" icon="majesticons:send" width="1.5em" height="1.6em" strokeWidth="2" onClick={sendMessage} />
                   </div>
               </div>
           </div>
       </div>
   );
};

export default Chat;
