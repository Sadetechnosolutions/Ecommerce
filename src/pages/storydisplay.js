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
  const [liked, setLiked] = useState(false);
  const [animationPostId, setAnimationPostId] = useState(null);
  const [likeCount,setLikeCount] = useState({});
  const [like,setLike] = useState(false);
  const [statusReply,setStatusReply] = useState('')
  const [aggregateData, setAggregateData] = useState({}); // Store aggregate data for each story

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
      className="absolute p-2 flex hover:bg-cta text-cta hover:text-white items-center justify-center bg-gray-100 rounded-full right-4 top-[28rem]"
      onClick={onClick}
      disabled={isDisabled}>
    <Icon icon="grommet-icons:next" />    
    </button>
  );

  const renderBackButton = ({ isDisabled, onClick }) => (
    <button
      className="absolute p-2 hover:bg-cta hover:text-white text-cta bg-gray-100 rounded-full left-4 top-[28rem]"
      onClick={onClick}
      disabled={isDisabled}
    >
      <Icon icon="ic:twotone-arrow-back-ios" />
    </button>
  );

  const handleStoryLike = async (statusId) => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`http://localhost:8080/likes/toggle-status?statusId=${statusId}&userId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${token}`
        }
      });

      if (response.ok) {
        setLiked(prev => ({
          ...prev,
          [statusId]: !prev[statusId]
        }));
        setAnimationPostId(statusId);
        // Re-fetch like count or update locally
        const countResponse = await fetch(`http://localhost:8080/likes/status/${statusId}/count`,{
          headers:{
            'Authorization':`Bearer ${token}`
          }
        });
        const countData = await countResponse.json();
        setLikeCount(prev => ({
          ...prev,
          [statusId]: countData
        }));
        setTimeout(() => setAnimationPostId(null), 300); // Reset animation class
      } else {
        console.log('An error occurred. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleComment = async (e,statusId) => {

    e.preventDefault();
    if (!statusReply.trim()) {
      console.log('Comment cannot be empty.');
      return;
    }
    // const parentComment = displayComments[selectedPostId]?.find(comment => comment.id === replyId);
    const jsonData = {
     statusId:statusId,
      userId: userId,
      textContent: statusReply
    };
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`http://localhost:8080/comments/comment-status?statusId=${statusId}&userId=${userId}&textContent=${statusReply}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jsonData),
      });
  
      if (response.ok) {
       setStatusReply('')
      } else {
        console.log('An error occurred. Please try again later.');

      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const fetchAggregateData = async (statusId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8080/aggregate-media/status/${statusId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();

      // Extract like and comment counts
      const likeCount = data.likeStatusDTO.length; // Number of likes
      const commentCount = data.commentStatusDTO.length; // Number of comments

      // Check if the current user has liked this post
      const userHasLiked = data.likeStatusDTO.some(like => like.userId === parseInt(userId));

      // Update the state with the counts and like status
      setLikeCount((prev) => ({
        ...prev,
        [statusId]: likeCount,
      }));
      setLiked((prev) => ({
        ...prev,
        [statusId]: userHasLiked,
      }));
    } catch (error) {
      console.error('Error fetching aggregate data:', error);
    }
  };

  const fetchStory = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8080/statuses/user/status', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setStory(data);
        // Fetch aggregate data for each story after fetching the list of stories
        data.forEach((post) => {
          fetchAggregateData(post.id); // Make an API call for each story ID
        });
        console.log(data,'data')
      } else {
        console.error('Failed to fetch stories:', response.status);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };
  const fetchUsers = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('http://localhost:8080/api/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json()
      setUsers(data);

    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchStory();
    fetchUsers();
  }, []);  // Ensure the API is called on mount

  const deleteStory = async(storyId)=>{
    const token = localStorage.getItem('token')
    try{
      const response = await fetch(`http://localhost:8080/statuses/delete/${userId}/${storyId}`,{
        method:'DELETE',
        headers:{
        'Authorization':`Bearer ${token}`
        }
      })
      if(response.ok){
        console.log('')
        navigate('/newsfeed')
      }
      else{
        console.log('Failed to delete story')
      }
    }
    catch(error){
      console.error('Error in deleting', error)
    }
  }

  const filteredStories = story?.filter(item => item.id !== selectedStory?.id);

  // Combine the filtered stories with the selected story
  const combinedStories = selectedStory ? [selectedStory, ...filteredStories] : filteredStories;

  useEffect(() => {
    if (story.length > 0) {
      story.forEach(post => {
        if (post.postId) {
          // Fetch comments for each post
             // Fetch likes for each post
          // Fetch like counts for each post
        }
      });
    }
  }, [story]);
  
  console.log(story);
  console.log(selectedStory);
  console.log(aggregateData);

  return (
    <div className='max-w-[30rem] w-full flex '>
      <div className="relative shadow-lg w-full  rounded-md">
        <AliceCarousel
          mouseTracking
          touchTracking={false}
          responsive={responsive}
          infinite // Optionally disable the dots navigation
          disableButtonsControls
          disableDotsControls={true}
          dragEnabled={true}

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
            <div key={item.id} className="relative flex items-center bg-black h-screen border border-0">
              {userId === item.userId ? (
  <div className="flex flewx-col items-center">
    <Icon 
      onClick={handleOptions}
      className="absolute text-white top-8 right-4 w-4 h-4 cursor-pointer"
      icon="iconamoon:menu-kebab-vertical-bold"
    />
    
    {options && (
      <div onClick={() => deleteStory(item.id)} className="">
        <span className="absolute top-16 right-2 flex items-center justify-center cursor-pointer rounded-full shadow-md bg-white w-9 h-9 hover:text-red">
          <Icon className="w-5 h-5" icon="mdi:delete-outline" />
        </span>
      </div>
    )}
  </div>
) : null}
              {item.type === 'IMAGE' ?              
               <img src={`http://localhost:8080${item.content}`}
                className="max-w-[30rem] w-full opacity-90  h-72"
                alt={`http://localhost:8080${item.content}`}
              /> : <div className='flex bg-black h-screen justify-center'><ReactPlayer
              url={`http://localhost:8080${item.content}`}  // Replace with your video URL
              playing={true}  // Autoplay the video
              controls={false} // Hide controls if desired
              width='100%'
              height='100%'
              loop={true} 
            /></div>}


{userId !== item.userId ?(
  <div className='absolute bottom-4 px-4 w-full flex items-center gap-1'>
                  <Icon
                    onClick={() => {
                      handleStoryLike(item.id);
                    }}
                    className={`cursor-pointer h-9 w-9 ${liked[item.id] ? 'text-pink' : 'text-gray-700'} ${animationPostId === item.id ? 'like-animate' : ''}`}
                    icon={liked[item.id] ? 'material-symbols-light:favorite' : 'material-symbols-light:favorite-outline'}
                    width="1.2em"
                    height="1.2em"
                  />

<InputEmoji value={statusReply} onChange={(text) => setStatusReply(text)} placeholder="Reply to the story.." />
    </div>
) : null}


{users?.map(user=>user.id === item.userId ? 
                <div className='top-4 flex items-center gap-2 p-2 absolute'><img className='w-11 h-11 rounded-full border-2 border-cta' src={`http://localhost:8080${item.profileImagePath}`}/><div className='flex flex-col'><span className='text-white font-semibold  text-sm'>{user.name}</span><span className='text-white text-sm font-semibold'>{timeDifference}</span></div></div>
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
