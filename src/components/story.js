import React, { useEffect, useState } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { selectStory } from '../slices/storyslice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

const Story = () => {
  const [story, setStory] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [users, setUsers] = useState();
  const displayedUserIds = new Set();
  const userId = useSelector((state)=>state.auth.userId)
  const [profileUser,setProfileUser] = useState();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedMode);
  }, []);

  const responsive = {
    0: { items: 2 },
    600: { items: 1 },
    1024: { items: 1 },
    1600: { items: 1 },
  };

  const renderNextButton = ({ isDisabled, onClick }) => (
    <button
      className={`absolute p-2 flex hover:bg-cta text-cta hover:text-white items-center justify-center  bg-gray-100 rounded-full top-44 right-4 ${story?.length === 0 ? 'hidden' : ''}`}
      onClick={onClick}
      disabled={isDisabled}
    >
      <Icon icon="grommet-icons:next" />
    </button>
  );

  const fetchUsers = async () => {
    const token =  localStorage.getItem('token')
    try {
      const response = await axios.get('http://localhost:8080/api/auth/users/descending',{
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });
      const usersData = response.data?.map(user => ({
        id: user.id,
        UserName: user.name,
      }));
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderBackButton = ({ isDisabled, onClick }) => (
    <button
      className={`absolute p-2 hover:bg-cta text-cta hover:text-white bg-gray-100 rounded-full ${story?.length === 0 ? 'hidden' : ''} top-44 left-4`}
      onClick={onClick}
      disabled={isDisabled}
    >
      <Icon icon="ic:twotone-arrow-back-ios" />
    </button>
  );

  const FetchStories = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8080/statuses/user/status', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setStory(data);
      }
    } catch (error) {
      console.log('Error fetching stories:', error);
    }
  };

  useEffect(() => {
    FetchStories();
  }, []);

  const handleClick = (story) => {
    dispatch(selectStory(story)); // Dispatch selected story to Redux store
  };

  const openStory = () => {
    navigate('/storypage');
  };

  const addStory = () => {
    navigate('/uploadstory');
  };

  const fetchProfileUser = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}`,{
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });
      const data = await response.json()
      setProfileUser(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchProfileUser();
  }, []);

  return (
    <div className={`max-w-[30rem] ${isDarkMode? 'gray-bg' :'white-bg'}  w-full px-4 py-3 shadow-lg rounded-md`}>

      <div className='flex items-center gap-4 max-w-[30rem] overflow-x-auto whitespace-nowrap scrollbar-hidden'>
 {   profileUser &&   <NavLink to='/uploadStory'> <div className='flex flex-col gap-1'>
  <div className='relative'>
          <img className='w-16 h-16 rounded-full' src={`http://localhost:8080${profileUser.profileImagePath}`} />
          <span className='absolute bottom-0 right-0 w-4 flex items-center justify-center h-4 bg-cta rounded-full text-white'><Icon icon="ic:sharp-add" /></span>
          </div>
          {/* <span className='text-xs'>Add to Story</span> */}
        </div></NavLink>}
        {story?.map((story) => {
          const userId = story.userId;
          if (displayedUserIds.has(userId)) return null; // Skip if user has already been displayed
          displayedUserIds.add(userId); // Add user ID to the set

          return (
            <div key={story.id} className='flex flex-col'>
              <div onClick={() => { handleClick(story); openStory(); }} className='flex flex-col '>
                <img className='w-16 h-16 rounded-full border-4 border-cta' src={`http://localhost:8080${story.profileImagePath}`} alt={`Profile of ${story.userId}`} />
                {users?.map(user => user.id === userId ? (
                  <div key={user.id} className=' flex justify-center text-xs items-center'>
                    {user.UserName}
                  </div>
                ) : null)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Story;
