import React, { useState,useEffect, useCallback } from 'react'
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';
import Modal from 'react-modal'
import {Tooltip } from 'react-tooltip';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';

const Friends = () => {
  const [activeId, setActiveId] = useState(null);
  const [dropdown,setDropdown] = useState(false);
  const userId = useSelector((state)=>state.auth.userId)
  const {userID} = useParams()
  const [friends,setFriends] = useState();
  const [isFriends,setIsFriends] = useState();
  const [myFriends,setMyFriends] = useState();
  const [privacy,setPrivacy] =useState('PUBLIC')
  const [selectedPrivacy, setSelectedPrivacy] = useState('PUBLIC'); // Default value
  const [profile,setProfile] = useState()
  const [privacydata,setPrivacyData] = useState()
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedMode);
  }, []);


  const fetchProfile = useCallback(async()=>{
    try{
      const response = await fetch(`https://localhost:8080/home/api/aggregate/${userID}`, {
        method: 'GET',
      });
      if(response.ok){
        const data = await response.json()
        setProfile(data)
      }
    }
    catch(error){
    console.error('Error fetching user data:', error);
    }
  },[userID])



  const fetchdata = useCallback(async()=>{
    const token = localStorage.getItem('token')
    try{
      const response = await fetch(`http://localhost:8080/api/users/${userID}`, {
        method: 'GET',
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });
      if(response.ok){
        const data = await response.json()
        setPrivacyData(data)
      }
    }
    catch(error){
    console.error('Error fetching user data:', error);
    }
  },[userID])

  useEffect(()=>{
    fetchdata()
  },[])


//   const options = [{
//     id:1,
//     name: blocked? 'Unblock':'Block',
//     task:block
//   },
//   {
//     id:2,
//     name:'Unfriend',
//     task:removefromlist
//   },
//   {
//     id:3,
//     name:'Mute'
//   },
//   {
//     id:4,
//     name:'Hide'
//   }
// ]

const renderPrivacyIcon = () => {
  switch (privacydata?.visibility) {
      case 'PUBLIC':
          return <Icon className='w-5 h-5' icon="material-symbols-light:public" />;
      case 'FRIENDS':
          return <Icon className='w-4 h-4' icon="fa-solid:user-friends" />;
      case 'ONLY ME':
          return <Icon className='w-5 h-5' icon="material-symbols:lock-outline" />;
      default:
          return <span></span>; // Default case
  }
};

const changePrivacy = async(privacy)=>{
  const payload={
   id:userId,
   visibility:selectedPrivacy
  }
  const token = localStorage.getItem('token')
  try {
    const response = await fetch(`http://localhost:8080/api/users/${userId}/visibility?visibility=${privacy}`, {
      method: 'PATCH',
      body:JSON.stringify(payload),
      headers:{
        'Authorization':`Bearer ${token}`
      }
    });

    if (response.ok) {

    } else {
      console.error('Failed to fetch user data:', response.status);
      // Optionally handle different status codes (e.g., unauthorized, not found)
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
}

const handlePrivacySelect = (selectedPrivacy) => {
  setSelectedPrivacy(selectedPrivacy.toUpperCase());
};

const handleSubmit = () => {
  setPrivacy(selectedPrivacy); // Update the actual privacy state
  handleclosePrivacydropdown(); // Close the modal
  console.log(privacy)
};


const Privacy = [{
  id:1,
  name:'Public',
  description:'Your friendlist is visible to everyone',
  icon:<Icon className='w-6 h-6' icon="material-symbols-light:public" />
},
{
  id:2,
  name:'Friends',
  description:'Your friendlist is visible to your friends',
  icon:<Icon className='w-5 h-5' icon="bi:people" />
},
{
  id:3,
  name:'Only me',
  description:'Your friendlist is visible only to you',
  icon:<Icon className='w-5 h-5' icon="material-symbols:lock-outline" />
}]
const isCurrentUser = parseInt(userID) === userId;

  const handleprivacyDropdown = ()=>{
    setDropdown(!dropdown)
  }

  const handleDropdown = (id) => {
    setActiveId(id === activeId ? null : id);
  };

  const handleclosePrivacydropdown = ()=>{
    setDropdown(false)
  }

  const fetchMyfriends = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }
      const response = await fetch(`http://localhost:8080/friend-requests/${userId}/friends`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    
      if (response.ok) {
        const data = await response.json();
        setMyFriends(data);
        // Check if the user is followed
      } else {
        console.error('Failed to fetch user data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    },[userId]);

  const fetchfriends = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }
      const response = await fetch(`http://localhost:8080/friend-requests/${isCurrentUser ? userId:userID}/friends`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    
      if (response.ok) {
        const data = await response.json();
        setFriends(data);
        // Check if the user is followed
        setIsFriends(
          myFriends.friends.some(friend => friend.id === friends?.friends.some((follower)=>follower.id))
        );
        
      } else {
        console.error('Failed to fetch user data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    },[isCurrentUser,userID,userId,friends?.friends]);
  
    useEffect(()=>{
      fetchProfile()
    },[])

    useEffect(()=>{
      fetchfriends()
    },[])

    useEffect(()=>{
      fetchMyfriends()
    },[])
 return (
    <div className={`flex max-w-[30rem]  ${isDarkMode ? 'gray-bg' : 'white-bg'} w-full items-center justify-center`}>
      <div className='w-full drop h-auto px-2 flex-col '>
      <div className="flex items-center p-4 justify-between">
        <div className='flex gap-2 items-center'>
      <span className='text-md font-semibold'>Friends ({friends?.friendCount})</span>
      {parseInt(userID)===userId && <div>
        <span onClick={handleprivacyDropdown}>{renderPrivacyIcon()}</span>
          {/* {dropdown &&(
            <div className='absolute flex w-24 shadow-lg flex-col bg-white border'>
            <span onClick={()=>{handleclosePrivacydropdown();handleDropdownActive('public')}} className={`h-8 flex border-b border-gray-200  items-center px-1 gap-1 cursor-pointer ${activeDropdown === 'public' ? 'text-cta' : ''}`}
            ><Icon icon="material-symbols:public" />Public</span>
              <span onClick={()=>{handleclosePrivacydropdown();handleDropdownActive('onlyme')}} className={`h-8 flex items-center px-1 gap-1 cursor-pointer ${activeDropdown === 'Friends' ? 'text-cta' : ''}`}><Icon icon="bi:people" />Friends</span>
              <span onClick={()=>{handleclosePrivacydropdown();handleDropdownActive('onlyme')}} className={`h-8 flex items-center px-1 gap-1 cursor-pointer ${activeDropdown === 'onlyme' ? 'text-cta' : ''}`}><Icon icon="material-symbols:lock-outline" />Only me</span>
            </div>
          )} */}
          </div>}

          </div>
      <div className='flex items-center gap-2'>
          <div className="relative text-sm">
            <input
              type="text"
              placeholder="Search"
              className=" w-40 h-9 p-2  rounded-md border border-gray-300 focus:outline-none focus:border-green"/>
            <button type="submit" className="absolute right-0 top-0 bottom-0 px-2 text-gray-400 rounded-r-md focus:outline-none">
              <Icon icon="ooui:search" width="1.2em" height="1.2em" className='text-gray-400' />
            </button>
          </div>
          {/* 
          <div className='flex flex-col justify-start '>
          <Icon icon="ion:settings-outline" className='cursor-pointer' onClick={handleprivacyDropdown} width="1.2em" height="1.2em" />
          {dropdown &&(
            <div className='absolute flex w-24 shadow-lg flex-col bg-white border'>
            <span onClick={()=>{handleclosePrivacydropdown();handleDropdownActive('public')}} className={`h-8 flex items-center gap-1 cursor-pointer ${activeDropdown === 'public' ? 'text-cta' : ''}`}><Icon icon="material-symbols:public" />Public</span>
            <span onClick={()=>{handleclosePrivacydropdown();handleDropdownActive('onlyme')}} className={`h-8 flex items-center gap-1 cursor-pointer ${activeDropdown === 'onlyme' ? 'text-cta' : ''}`}><Icon icon="material-symbols:lock-outline" />Only me</span>
            </div>
          )}
          </div> */}
          </div>
        </div>
        <div className='flex flex-wrap gap-8 w-full items-center p-4'>
        {(privacydata?.visibility === 'PUBLIC' || 
  (privacydata?.visibility === 'FRIENDS' && 
  (friends?.friends?.some(f => f.id === userId) || isFriends || friends?.userId === userId))) && 
  friends?.friends?.map((friend) => {
    const date = new Date(friend.requestTime);  
    const options = { year: 'numeric', month: 'long' };
    const formattedDate = date.toLocaleDateString('en-US', options);

    return (
      <div className='w-full' key={friend.id}>
        <div className={`flex flex-col h-72 ${isDarkMode ? 'gray-bg' : 'white-bg'} rounded-md border border-gray-200 rounded-md `}>
          <div className="relative">
            <img className="w-full h-28" src={`http://localhost:8080${friend.bannerImagePath}`} alt="" />
            <div className="absolute -mt-10 ml-2 flex items-center">
              <img className="rounded-full w-16 h-16 border-2 border-white" alt="" src={`http://localhost:8080${friend.profileImagePath}`} />
            </div>
          </div>
          <div className='flex px-4 flex-col mt-5 gap-3 py-4'>
            <div className='flex justify-between items-start'>
              <div className='flex items-start w-full flex-col'>
                <span className='text-md font-semibold'>{friend.name} <span className='text-xs font-normal py-0.5 rounded-lg '>Since <span className='px-1 bg-cta rounded-md'> {formattedDate}</span> </span></span>
                <div className='w-full items-center justify-between'>
                  <span className='text-xs'>{friend.place}</span>
                  <span> </span>
                </div>
              </div>
              {parseInt(userID) === userId && (
                <div>
                  <Icon className='cursor-pointer' onClick={() => handleDropdown(friend.id)} icon="carbon:overflow-menu-vertical" width="1.2em" height="1.2em" />
                  {activeId === friend.id && (
                    <div className="absolute slide-in-down flex flex-col bg-white items-center mt-6 w-28 h-auto">
                      {options.map((option) => (
                        <div onClick={() => option.task(friend.id)} className='flex hover:bg-gray-100 hover:text-red justify-start right-0 p-1 text-sm w-full cursor-pointer' key={option.id}>
                          {option.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className='flex flex-col gap-1.5'>
              <div className='flex justify-between'>
                <div className='flex flex-col'>
                  <span className=''>Friends: {friend.friends}</span>{profile?.visibility}
                  <span><span className='inline-block w-14'>Posts:</span> {friend.post}</span>
                </div>
                <div className='flex flex-col'>
                  <span><span className='inline-block w-14'>Photos:</span> {friend.photos}</span>
                  <span><span className='inline-block w-14'>Videos:</span> {friend.videos}</span>
                </div>
              </div>
            </div>
            {friend.id === userId ? "" : (
              <div className='px-2 py-1 text-cta border hover:bg-cta hover:text-white flex justify-center rounded-md cursor-pointer border-cta'>
                {parseInt(userID) === userId ? (
                  <span className=''>Message</span>
                ) : isFriends ? (
                  <span className=''>Friends</span>
                ) : (
                  <span className=''>Add Friend</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  })
}
        </div>
      </div>
      <Modal  style={{
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      backgroundColor: 'transparent',
      transform: 'translate(-50%, -20%)',
      width: '80%',
      height: '80%',
      overflow: 'hidden', // Ensure content does not overflow
      border: 'none',
    },
  }}
  isOpen={dropdown}
  onRequestClose={handleclosePrivacydropdown}>
        <div className=' flex max-w-[30rem] w-full bg-black items-center justify-center'>
        <form className='border items-center justify-center px-2 text-center bg-white border-gray rounded-md w-full h-1/2' >
        <div className='py-2 flex justify-center w-full border-b border-gray-300 '> Edit Privacy</div>
        <div>
          {Privacy.map((privacy)=>(
            <div    onClick={() => handlePrivacySelect(privacy.name)}
            className={`flex items-center gap-2 cursor-pointer py-2 px-4 border-b border-gray-100 ${
              selectedPrivacy === privacy.name.toUpperCase() ? 'bg-gray-200 font-semibold' : ''
            }`}
          >
             <span className='w-4 h-4'>{privacy.icon}</span>
             <div className='flex items-start flex-col'>
              <span className='text-sm font-semibold'>
                {privacy.name}
              </span>
              <span className='text-xs '>
                {privacy.description}
              </span>
              </div>
              </div>
          ))}
        </div>
        <div className='flex gap-4 py-4 justify-end'>
          <button onClick={handleclosePrivacydropdown} className='px-3 py-2 bg-gray-200 hover:opacity-80 rounded-md'>Cancel</button>
          <button onClick={()=>{handleSubmit();changePrivacy(selectedPrivacy)}} className='px-3 py-2 bg-cta hover:opacity-80 text-white rounded-md'>Done</button>
        </div>
        </form>
        </div>
        </Modal>
      <Tooltip id="mytooltip" />
    </div>
  )
}

export default Friends;
