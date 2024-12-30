import React, { useEffect, useState, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { Icon } from "@iconify/react/dist/iconify.js";
import InputEmoji from "react-input-emoji";
import { useParams } from "react-router";
import { useSelector } from 'react-redux';
import Modal from 'react-modal';
import axios from 'axios';
import { Link } from 'react-alice-carousel';
import ReactPlayer from 'react-player';

const Chat = () => {
  const chatContainerRef = useRef(null);
  const userId = useSelector((state) => state.auth.userId);
  const { messageID } = useParams();
  const stompClientRef = useRef(null);
  const [chat, setChat] = useState({ messages: [] });
  const [messageInput, setMessageInput] = useState('');
  const [users, setUsers] = useState([]);
  const [replyToMessageId, setReplyToMessageId] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [pressTimer, setPressTimer] = useState(null);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState()
  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const [hoverMsg,setHoverMsg] = useState(null);


  const openDeletePopup = (id) => {
    setDeletePopup(true)
    setDeleteId(id)
  }
 
  const closeDeletePopup = () => {
    setDeletePopup(false)
  }

  // Set duration in milliseconds to consider as a long press (e.g., 500ms)
  const LONG_PRESS_DURATION = 500;

  const handleMouseDown = (id) => {
    // Start the timer on mouse down
    const timer = setTimeout(() => {
      openDeletePopup(id) // Trigger long press function
    }, LONG_PRESS_DURATION);
    setPressTimer(timer);
  };

  const handleMouseUp = () => {
    // Clear the timer if the mouse is released before the duration
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleMouseLeave = () => {
    // Also clear the timer if the mouse leaves the element before the duration
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedMode);
  }, []);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('http://localhost:8080/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchMessages = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`http://localhost:8080/web-socket/conversation?participantOneId=${userId}&participantTwoId=${messageID}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setChat(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  
  const handleMenuClick = () => {
    setShowDeleteOption(prev => !prev);
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

  const deleteMessageForSelf = async (messageId) => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.delete(`http://localhost:8080/web-socket/delete-for-self/${messageId}`, {
        params: { userId },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        fetchMessages();
        closeDeletePopup();
      }
      else {
        console.log('error');
      }
      // Message deleted for everyone
    } catch (error) {
      console.error("Error deleting message for self", error);
    }
  };

  const deleteMessageForEveryone = async (messageId) => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.delete(`http://localhost:8080/web-socket/delete-for-everyone/${messageId}`, {
        params: { userId },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        fetchMessages();
        closeDeletePopup();
      }
      else {
        console.log('error');
      }
      // Message deleted for everyone
    } catch (error) {
      console.error("Error deleting message for everyone", error);
    }
  };
  const message = users.find(user => user.id === parseInt(messageID));

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'gray-bg' : 'white-bg'} max-w-[30rem] w-full`}>
      <div className="flex h-16 items-center bg-cta sticky text-white px-7 justify-between">
        <div className="flex items-center gap-2">
          <img className="w-9 h-9 rounded-full" src={message?.profileImagePath} alt={message?.profileImagePath} />
          <span className="font-semibold">{message?.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <Icon className="w-5 h-5" icon="ion:call-sharp" />
          <Icon className="w-6 h-6" icon="mdi:video" />
        </div>
      </div>
      <hr />
      <div className="flex">
        <div className=" w-full relative flex flex-col shadow-lg">
          <div ref={chatContainerRef} className="p-4 overflow-y-auto h-[37rem] flex flex-col gap-2">
            {replyToMessageId && (
              <div className="bg-gray-200 p-2 rounded-md">
                <span>Replying to:</span>
                <span>{chat.messages.find(msg => msg.id === replyToMessageId)?.content}</span>
              </div>
            )}
            {chat.messages.length > 0 ? (
              chat.messages.map((msg) => (
                <div className='py-2' key={msg.id}>
       <div className={`w-full ${msg.senderId === parseInt(userId) ? 'flex justify-end' : 'flex justify-start'} h-auto`}>
  {/* Show the message if it's not deleted by the sender or if it's not sent by the user */}
  {(msg.senderId !== parseInt(userId) || msg.deletedBySender === false) && (
    <div 
      className={`rounded-lg cursor-pointer h-max w-auto max-w-48 relative 
        ${msg.content.startsWith('/uploads') ? '' : (msg.senderId === parseInt(userId) ? 'bg-cta text-white' : 'bg-gray-100')}
      `}
    >
      {msg.content.startsWith('/uploads') ? (
        // If the message content starts with "/uploads", render a video (Reels)
        <Link key={msg.id} to={`/reels/${msg.mediaId}`}>
          <div className="relative contain-r w-44 rounded-md group inline-block cursor-pointer h-[16rem] overflow-hidden">
            <div key={msg.id} style={{backgroundImage:`url(${msg.content})`}} className="inline-block cursor-pointer rounded-lg w-56 h-[16rem]">
              <ReactPlayer 
                url={`http://localhost:8080${msg.content}`}  // Replace with your video URL
                controls={false} // Hide controls if desired
                width='200%'
                height='100%'
              />
            </div>
          </div>
        </Link>
      ) : (
        // Otherwise, render the message content as text
        <div className='p-2'>
        <span className="break-words" onClick={() => setReplyToMessageId(msg.id)}>{msg.content}</span>
        </div>
      )}

      {hoverMsg === msg.id && (
        <div className="flex items-center absolute">
          <Icon
            onClick={handleMenuClick} // Toggle delete option on menu icon click
            className={`absolute text-cta w-9 h-9 ${msg.senderId === parseInt(userId) ? 'right-12' : 'left-56'}`} // 2rem gap from the right or left of the message (2rem = 32px)
            icon="majesticons:more-menu"
          />
          <Icon
            onClick={() => setReplyToMessageId(msg.id)}
            icon="mdi:reply"
            className={`absolute text-cta w-6 h-6 ${msg.senderId === parseInt(userId) ? 'right-20' : 'left-48'}`} // 2rem gap from the right or left of the message and between icons
          />
          
          {/* {showDeleteOption && (
            <div className={`absolute ${msg.senderId === parseInt(userId) ? 'right-8 mt-20' : 'left-48 mt-20'} bg-white border rounded p-2`}>
              {msg.senderId === userId ? (
                <button className="text-sm text-black" onClick={() => openDeletePopup(msg.id)}>
                  Delete
                </button>
              ) : (
                <button className="text-sm text-black" onClick={() => openDeletePopup(msg.id)}>
                  Remove
                </button>
              )}
            </div>
          )} */}
        </div>
      )}
    </div>
  )}
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
          <div className="bottom-0 sticky w-full  absolute p-3 flex items-center">
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
      <Modal appElement={document.getElementById('root')}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            backgroundColor: 'transparent',
            transform: 'translate(-50%, 0%)',
            width: '60%',
            height: '100%',
            overflowY: 'auto',
            border: 'none'
          },
        }}
        isOpen={deletePopup} onRequestClose={closeDeletePopup}>
        <div className={`relative max-w-[30rem] w-full bg-white flex rounded-lg shadow-lg flex-col`}>
          <div className=' p-4 w-full flex flex-col'>
            <button onClick={() => { deleteMessageForEveryone(deleteId) }} className='p-2 flex border-gray-100 border-b justify-start cursor-pointer w-full t  text-md font-semibold rounded-md'>
              Delete for everyone
            </button>
            <button onClick={() => { deleteMessageForSelf(deleteId) }} className='p-2 flex justify-start cursor-pointer w-full  text-md font-semibold rounded-md'>
              Delete for myself
            </button>
          </div>
        </div>
      </Modal>
      
    </div>
  );
};

export default Chat;
