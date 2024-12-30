import React, { useCallback, useEffect, useState, useRef } from 'react';
import 'tailwindcss/tailwind.css';
import { Icon } from '@iconify/react/dist/iconify.js';
import Modal from 'react-modal';
import InputEmoji from 'react-input-emoji';
import { useSelector } from 'react-redux';

const Reels = () => {
  const [reels, setReels] = useState([]);
  const carouselRef = useRef(null);
  const [sharePostId, setsharePostId] = useState(); 
  const [sharePopup,setSharePopup] = useState(false)
  const [shareCaption,setShareCaption] = useState('')
  const [shareprivacydropdown,setSharePrivacydropdown] = useState(false)
  const [privacy,setPrivacy] =useState('PUBLIC')
  const [myFriends,setMyFriends] = useState();
  const [selectedImageId,setSelectedImageId] = useState();
  const [selectedReel,setSelectedReel] = useState();
  const [selectedReelId,setSelectedReelId] = useState();
  const [activeVideo, setActiveVideo] = useState(null); // To track the active video
  const userId = useSelector((state)=>state.auth.userId)
  const [profile,setProfile] = useState()
  const [friendlistPopup,ShowFriendlistPopup] = useState(false);

  const openShare = (id,content)=> {
    setSharePopup(true);
    setSelectedReelId(id)
    setSelectedReel(content);
    console.log(id);
  }

  const renderPrivacyIcon = () => {
    switch (privacy) {
        case 'PUBLIC':
            return <Icon className='w-4 h-4' icon="material-symbols-light:public" />;
        case 'FRIENDS':
            return <Icon className='w-4 h-4' icon="fa-solid:user-friends" />;
        default:
            return null;
    }
  };

  const handleImageSelect = (id) => {
    setSelectedImageId((prevSelectedId) => (prevSelectedId === id ? null : id));
  };
 
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

    useEffect(()=>{
      fetchMyfriends();
    },[])

    const displayFriends = ()=>{
      ShowFriendlistPopup(true)
      setSharePopup(false)
    }
    
    const closeFriends = ()=>{
      ShowFriendlistPopup(false)
    }
    

  const shareReel = async (id) => {
    const jsonData = {
      senderId: parseInt(userId),
      recipientId:selectedImageId ? selectedImageId : id,
      mediaId: selectedReelId,
      content: selectedReel
    };
  
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('http://localhost:8080/web-socket/chat', {
        method: 'POST',
        body:JSON.stringify(jsonData),
        headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
       setSelectedImageId(null)
       setSelectedReelId(null)
       setSelectedReel(null)
       closeShare()
      } else {
        console.log('An error occurred. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const closeShare = (id)=> {
    setSharePopup(false);
    setsharePostId(null);
  }

  const handleDropdown = ()=> {
    setSharePrivacydropdown(true);
  }

  const fetchReels = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8080/reels/getAll/reel', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReels(data);
      } else {
        console.error('Failed to fetch reels:', response.status);
      }
    } catch (error) {
      console.error('Error fetching reels:', error);
    }
  }, []);

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
        console.error('Failed to fetch reels:', response.status);
      }
    } catch (error) {
      console.error('Error fetching reels:', error);
    }
  }, []);

  useEffect(() => {
    fetchReels();
    fetchProfile();
  }, [fetchReels,fetchProfile]);

  // Function to handle scrolling
  const handleScroll = () => {
    const reelItems = carouselRef.current.querySelectorAll('.video-item');
    const visibleReel = [...reelItems].find((item) => {
      const rect = item.getBoundingClientRect();
      return rect.top >= 0 && rect.top < window.innerHeight; // Check if the reel is in the viewport
    });

    if (visibleReel) {
      const video = visibleReel.querySelector('video');
      if (video && activeVideo !== video) {
        // Pause previously active video
        if (activeVideo) activeVideo.pause();
        video.play();
        setActiveVideo(video);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeVideo]);

  // Mapping through the reels to create video items
  const items = reels?.map((reel, index) => (
    <div key={index} className="relative flex justify-center items-center w-full bg-highlight h-screen snap-start video-item">
      <video
        className="w-full"
        src={`http://localhost:8080${reel?.content}`}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      />
      <div className='absolute bottom-0 left-0 px-4 py-4 text-white gap-2 flex flex-col'>
       <div className='flex items-center gap-2'>
        <img className='rounded-full h-9 w-9' src={`http://localhost:8080${reel?.profileImagePath}`} alt='' />
        <span className='font-semibold'>{reel.name}</span>
       </div>
       <div>{reel.caption}</div>
       <div className='flex items-center gap-4'>
       <Icon className='w-7 h-7' icon="tabler:heart" />
       <Icon className='w-7 h-6' icon="meteor-icons:comment" />
       <Icon onClick={()=>openShare(reel.id,reel.content)} className="w-6 h-7" icon="ph:share-fat" /> 
       </div>
      </div>
    </div>
  ));

  return (
    <div
      ref={carouselRef}
      className="relative w-full h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth"
    >
      <div className="w-full flex flex-col">
        {items}
      </div>
      <Modal appElement={document.getElementById('root')} style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          backgroundColor:'transparent',
          transform: 'translate(-50%, -35%)',
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          border:'none'
        },
      }} isOpen={sharePopup} onRequestClose={closeShare}>
        <>
          <div className="w-full flex flex-col bg-white gap-2 rounded-md shadow-lg px-4 py-4 relative" key={sharePostId}>
            <button onClick={closeShare} className="absolute top-2 right-2"><Icon onClick={closeShare} icon="ic:round-close" /></button>
            <div className='flex items-center gap-2'><img className='w-7 h-7 rounded-full' src={`http://localhost:8080${profile?.profileImagePath}`} />{profile?.name} <div onClick={handleDropdown} className="rounded-full bg-gray-300">{renderPrivacyIcon()}</div></div>
            <InputEmoji value={shareCaption} onChange={(text)=>setShareCaption(text)} className='' placeholder='Add description..' />
            <button className="bg-cta hover:bg-opacity-90 text-white font-semibold rounded-md px-3 py-2">Share now</button>
            Send to
            <div className='relative rounded-lg flex border gap-4 p-2 border-gray-200'>
              <div onClick={displayFriends} className="flex flex-col items-center">
                <Icon className="w-12 h-12" icon="ant-design:message-outlined" />
                <span className="text-sm">Chat</span>
              </div>
              {myFriends?.friends.map((friend)=>( 
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1 items-center">
                    <img onClick={() => handleImageSelect(friend.id)} className={`w-11 h-11 rounded-full ${selectedImageId === friend.id ? ' border-4 border-cta' : ''}`} src={`http://localhost:8080${friend.profileImagePath}`} />
                    <span className="text-sm">{friend.name}</span>
                  </div>
                </div>
              ))}
              <button onClick={shareReel} className={`bg-cta absolute right-0 w-max hover:bg-opacity-90 py-1 px-2 ${selectedImageId ? '' : 'hidden'} rounded-md text-white font-semibold`}>Send</button>
            </div>
          </div>
        </>
      </Modal>
      <Modal  appElement={document.getElementById('root')}
style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          backgroundColor:'transparent',
          transform: 'translate(-50%, -35%)',
          width: '80%',
          height: '100%',
          overflowY: 'auto',
          border:'none'
        },}}
        isOpen={friendlistPopup} onRequestClose={closeFriends}>
          <>
{
  <div className="w-full flex flex-col bg-white gap-2 rounded-md shadow-lg px-4 py-4 relative" key={sharePostId}>
    <button onClick={closeFriends} className="absolute top-2 right-2"><Icon onClick={closeFriends} icon="ic:round-close" /></button>
    <div className='flex items-center gap-2'><img className='w-11 h-11 rounded-full' src={selectedReel?.reelResponse?.profileImagePath} />{selectedReel?.reelResponse?.name}    <div onClick={handleDropdown} className="rounded-full p-1 bg-gray-300">{renderPrivacyIcon()}</div></div>
    <InputEmoji value={shareCaption} onChange={(text)=>setShareCaption(text)} className='' placeholder='Search Friends..' />
    Send to
    <div className='relative rounded-lg flex flex-col border gap-4 p-2 border-gray-200'>
      {myFriends?.friends.map((friend)=>(
        <div className="flex items-center gap-4">

<div className="flex gap-1 items-center">
<img  onClick={() => handleImageSelect(friend.id)}  className={`w-11 h-11 rounded-full ${
                      selectedImageId === friend.id ? ' border-4 border-cta' : ''
                    }`} src={`http://localhost:8080${friend?.profileImagePath}`} />
<span className="text-sm">{friend.name}</span>
<button onClick={()=>{shareReel(friend.id);}} className={`bg-cta absolute right-0 w-max hover:bg-opacity-90 py-2 px-3 rounded-md text-white font-semibold`}>Send</button>
</div>
</div>
      ))}

    {/* <span className='text-sm'>{sharePostId?.postResponseDTO?.description}</span> */}
    </div>

  </div>
}
   </>

 </Modal>
    </div>
  );
};

export default Reels;
