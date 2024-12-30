import React, { useEffect, useState, useRef } from 'react';
// import SockJS from 'sockjs-client';
// import { Client } from '@stomp/stompjs';
import { Icon } from "@iconify/react/dist/iconify.js";
import { useParams } from "react-router";

import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { NavLink} from 'react-router-dom';

const MessageList = () => {
   const userId = useSelector((state) => state.auth.userId);
   const { messagesId } = useParams();
   const [chat, setChat] = useState({ messages: [] });
   const [users, setUsers] = useState([]);
   const [isDarkMode, setIsDarkMode] = useState(false);

   useEffect(() => {
     const savedMode = localStorage.getItem("darkMode") === "true";
     setIsDarkMode(savedMode);
   }, []);

   const location = useLocation();
   const fetchUsers = async () => {
      const token = localStorage.getItem('token')
      try {
          const response = await fetch('http://localhost:8080/api/users',{
            headers:{
               'Authorization' : `Bearer ${token}`
            }
          });
         const data = await response.json();
         setUsers(data);
      } catch (error) {
         console.error("Error fetching user data:", error);
      }
   };

   const fetchMessage = async () => {
      setChat({ messages: [] }); // Reset chat state initially

      const token = localStorage.getItem('token')
      try {
         const response = await fetch(`http://localhost:8080/web-socket/getAll`, {
            method: 'GET',
            headers:{
               'Authorization': `Bearer ${token}`
            }
         });
         const data = await response.json();
   
         if (response.ok) {
            // Update chat state with fetched messages
            setChat(data);
         }
      } catch (error) {
         console.error(error);
      }
   };
 
   useEffect(() => {
      fetchUsers();
   }, []);

   useEffect(() => {
      fetchMessage(); // Fetch messages whenever messagesId changes
   }, [messagesId]);

   return (
      <div className={`max-w-[30rem] ${isDarkMode ? 'dark-bg' : 'white-bg'} w-full h-auto flex flex-col`}>
         <div className="flex  h-[56rem]">
            <div className="overflow-scroll w-full flex flex-col h-inherit shadow-lg h-full">
               <div className="px-4 flex flex-col gap-2">
                  <div className="flex sticky top-0 py-4 items-center justify-between">
                     <span className="font-semibold">Chats</span>
                     <Icon className="w-5 h-5" icon="bx:edit" />
                  </div>
                  <div className={`relative text-black flex sticky top-14 items-center`}>
                     <input className="w-full px-2 rounded-md h-11 border-none outline-none " type="text" placeholder="Search Friend" />
                     <div className="absolute right-0 w-9 h-11 flex items-center justify-center "><Icon icon="ooui:search" /></div>
                  </div>
                  <div className="flex w-auto flex-col">
                  {users.filter(user => user.id !== userId).map((item) => {
    // Ensure chat is an array
    const userConversations = Array.isArray(chat) ? chat.map(conversation => {
        const { messages, participantOneId, participantTwoId } = conversation;
        // Get the last message from the messages array
        const lastMessage = messages[messages.length - 1]; 

        // Check if the last message exists
        if (lastMessage) {
            // Determine if the current user or the item is one of the participants
            const isParticipantOne = participantOneId === userId || participantOneId === item.id;
            const isParticipantTwo = participantTwoId === userId || participantTwoId === item.id;

            // If either participant is involved, return the last message
            if (isParticipantOne && isParticipantTwo) {
                return {
                    conversationId: conversation.id,
                    lastMessage: lastMessage.content,
                    sentAt: lastMessage.sentAt,
                };
            }
        }
        return null; // Handle cases where no relevant message
    }).filter(message => message !== null) : []; // Filter out null values

    // Find the last message for the current user
    const userLastMessage = userConversations.length > 0 ? userConversations[0].lastMessage : "No messages";

    return (
        <NavLink to={`/messages/${item.id}`}><div key={item.id} className={`text-sm text-gray-800 ${isDarkMode ? 'dark-bg hover:lightgray-bg hover:text-black ' : 'white-bg hover:bg-gray-50 '}  flex flex-col hover:bg-gray-50 justify-between cursor-pointer`}>
            <div className='flex flex-col px-4 justify-center w-full border:gray-300 py-3 border-b text-sm'>
                <div className='flex justify-between items-center'>
                    <div className='flex gap-2 w-full items-center'>
                        <div>
                            <img className='rounded-full w-9 h-9' alt='alt' src={item.profileImagePath} />
                        </div>
                        <div className='flex w-full flex-col'>
                            <div className={`hover:text-cta  ${isDarkMode ? 'text-white' : 'text-black'} w-max`}>{item.name}</div>
                            <div className='flex w-full items-center justify-between'>
                                <div className='text-gray-400 truncate-text text-[12px]'>{userLastMessage}</div>
                                <div className='text-gray-400 text-xs'>{item.time}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div></NavLink>
    );
})}


                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default MessageList;
