import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import ReactPlayer from 'react-player';
import axios from 'axios';
import moment from 'moment';

import { Icon } from '@iconify/react/dist/iconify.js';
import { useNavigate } from 'react-router';
import InputEmoji from 'react-input-emoji';

const StoryPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state)=>state.auth.userId)
  const [options,setOptions] = useState(false);
  const [storyReply,setStoryReply] = useState('');


  const handleOptions = ()=>{
    setOptions(!options)
  }

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setLoading(false), 3000); // 3 seconds loader
    return () => clearTimeout(timer);
  }, []);
  
  const selectedStory = useSelector((state) => state.story.selectedStory);
  const [story, setStory] = useState([]);
  const [users,setUsers] = useState()
  const responsive = {
    0: { items: 1 },
    600: { items: 1 },
    1024: { items: 1 },

    1600: { items: 1 },
  };

  const renderNextButton = ({ isDisabled, onClick }) => (
    <button
      className="absolute p-2 flex hover:bg-cta text-cta hover:text-white items-center justify-center bg-gray-100 rounded-full right-4 top-[22rem]"
      onClick={onClick}
      disabled={isDisabled}>
    <Icon icon="grommet-icons:next" />    
    </button>
  );

  const renderBackButton = ({ isDisabled, onClick }) => (
    <button
      className="absolute p-2 hover:bg-cta hover:text-white text-cta bg-gray-100 rounded-full left-4 top-[22rem]"
      onClick={onClick}
      disabled={isDisabled}
    >
 <Icon icon="ic:twotone-arrow-back-ios" />
    </button>
  );

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/auth/users/descending');
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

  const fetchStory = async () => {
    const token = localStorage.getItem('token'); // Fixed typo
    try {
      const response = await fetch('http://localhost:8080/statuses/user/status', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}` // Added space after "bearer"
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStory(data);
        console.log(data,'data')
      } else {
        console.error('Failed to fetch stories:', response.status);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  useEffect(() => {
    fetchStory();
  }, []);

  const deleteStory = async(storyId)=>{
    try{
      const response = await fetch(`http://localhost:8080/statuses/delete/${userId}/${storyId}`,{
        method:'DELETE'
      })
      if(response.ok){
        console.log('')
        navigate('/newsfeed')
      }
      else{

      }
    }
    catch(error){
      console.error('error in deleting',error)
    }
  }

  const filteredStories = story.filter(item => item.id !== selectedStory?.id);

  // Combine the filtered stories with the selected story
  const combinedStories = selectedStory ? [selectedStory, ...filteredStories] : filteredStories;
  console.log(story);
  console.log(selectedStory)

  return (
    <div className='max-w-[30rem] w-full flex '>
      <div className="relative shadow-lg w-full  rounded-md">
        <AliceCarousel
          mouseTracking
          touchTracking={false}
          responsive={responsive}
          infinite
          disableDotsControls={true}
          renderNextButton={renderNextButton}
          renderPrevButton={renderBackButton}
        >
          {combinedStories?.map((item) =>{ 

const calculateTimeDifference = () => {
  const pastDate = moment(item.createdAt);
  const now = moment();
  const diffInDays = now.diff(pastDate, 'days');
  const diffInHours = now.diff(pastDate, 'hours');
  const diffInMinutes = now.diff(pastDate, 'minutes');
  let displayText = '';

  if (diffInDays > 0) {
    displayText = `${diffInDays}d${diffInDays > 1 ? ' ago' : ''}`;
  } else if (diffInHours > 0) {
    displayText = `${diffInHours}h${diffInHours > 1 ? ' ago' : ''}`;
  } else if (diffInMinutes > 0) {
    displayText = `${diffInMinutes}m${diffInMinutes > 1 ? ' ago' : ''}`;
  } else {
    displayText = 'Just now';
  }

  return displayText;
};

const timeDifference = calculateTimeDifference();
            return(
            <div key={item.id} className="relative flex border border-0">
              {item.type === 'IMAGE' ?              
               <img src={`http://localhost:8080/statuses${item.content}`}
                className="max-w-[30rem] w-full opacity-90  h-screen"
                alt={`http://localhost:8080/statuses${item.content}`}
              /> : <div className='flex bg-black h-screen justify-center'><ReactPlayer
              url={`http://localhost:8080/statuses${item.content}`}  // Replace with your video URL
              playing={true}  // Autoplay the video
              controls={false} // Hide controls if desired
              width='100%'
              height='100%'
              loop={true} 
            /></div>}
{userId === item.userId ? (
  <div className="flex flewx-col items-center relative">
    <Icon
      onClick={handleOptions}
      className="absolute top-2 right-4 w-4 h-4 cursor-pointer"
      icon="iconamoon:menu-kebab-vertical-bold"
    />
    
    {options && (
      <div onClick={() => deleteStory(item.id)} className="">
        <span className="absolute top-8 right-2 flex items-center justify-center cursor-pointer rounded-full shadow-md bg-white w-9 h-9 hover:text-red">
          <Icon className="w-5 h-5" icon="mdi:delete-outline" />
        </span>
      </div>
    )}
  </div>
) : null}

{userId !== item.userId ?(
  <div className='absolute bottom-4 px-4 w-full flex items-center gap-1'>
       <Icon
        className={`cursor-pointer h-9 w-9 text-pink like-animate `}
        icon={ "material-symbols-light:favorite-outline"}
        width='1.6em'
        height='1.6em'
      />

    <InputEmoji onChange={(text)=>setStoryReply(text)} />
    </div>
) : null}



{users?.map(user=>user.id === item.userId ? 
                <div className='top-4 flex items-center gap-2 p-2 absolute'><img className='w-11 h-11 rounded-full border-2 border-cta' src={`http://localhost:8080/posts${item.profileImagePath}`}/><div className='flex flex-col'><span className='text-white font-semibold  text-sm'>{user.UserName}</span><span className='text-white text-sm font-semibold'>{timeDifference}</span></div></div>
                :null
    )}
            </div>
          ) })}
        </AliceCarousel>
      </div>
    </div>
  );
};

export default StoryPage;
