import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";
import InputEmoji from 'react-input-emoji';

import { useSelector } from "react-redux";
import DropdownMenu from '../components/dropdownmenu';
import moment from "moment";
import Modal from 'react-modal';

import { useParams } from 'react-router';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

const Post = () => {
  const [comment, setComment] = useState(null);

  const [edit, setEdit] = useState(false);
  const [saved, setSaved] = useState({});
  const [postComment, setPostComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);
  const [userData, setUserData] = useState([]);
  const userId = useSelector((state) => state.auth.userId);
  const [user, setUser] = useState();
  const [deletePopup,setDeletePopup] = useState(false)
  const [deleteId,setDeleteId] = useState('')
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [displayComments,setDisplayComments] = useState({});
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [visibleReplies, setVisibleReplies] = useState({});
  const [replyInputVisible, setReplyInputVisible] = useState({}); 
  const [replyId,setReplyId] = useState('');
  const [nestedVisibleReplies, setNestedVisibleReplies] = useState({});
  const {userID} = useParams()
  const [like,setLike] = useState(false);
  const [likeCount,setLikeCount] = useState({});
  const [users, setUsers] = useState([]);
  const [privacy,setPrivacy] =useState('PUBLIC')
  const [selectedPrivacy, setSelectedPrivacy] = useState('PUBLIC'); // Default value
  const [activeId, setActiveId] = useState(null);
  const [dropdown,setDropdown] = useState(false);
  const [postId,setPostId] = useState();
  const [myFriends,setMyFriends] = useState()
  const [friends,setFriends] = useState()
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedMode);
  }, []);


  const isCurrentUser = parseInt(userID) === userId;

  const [animationPostId, setAnimationPostId] = useState(null);
  const handlePrivacySelect = (selectedPrivacy) => {
    setSelectedPrivacy(selectedPrivacy.toUpperCase());
  };
  
  const handlePrivacySubmit = () => {
    setPrivacy(selectedPrivacy); // Update the actual privacy state
    handleclosePrivacydropdown(); // Close the modal
    console.log(privacy)
  };

  const handleprivacyDropdown = (postId)=>{
    setDropdown(!dropdown)
    setPostId(postId)
  }

  const handleDropdown = (id) => {
    setActiveId(id === activeId ? null : id);
  };

  const handleclosePrivacydropdown = ()=>{
    setDropdown(false)
    setPostId(null)
  }

  const openDelete = ()=>{
    setDeletePopup(true)
  }                   

  const closeDelete = ()=>{
    setDeletePopup(false)
  }


  const toggleReplies = (commentId) => {
    setVisibleReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    })); 
  };

  const renderReplies = (replies, postId, parentCommentId = null) => {
    return replies.slice().reverse().map(reply =>{
      const commentTime = () => {
        const pastDate = moment(reply.createdAt);
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
  
      const commenttime = commentTime();
     return(
      <div key={reply.id} className='flex border py-2 px-4 bg-white rounded-3xl flex-col shadow-md w-full gap-2'>
        <div className='flex gap-1'>
          <img className='w-8 h-8 rounded-full' src={`http://localhost:8080${reply.profileImagePath}`} alt={reply.profilePic} />
          <div className='flex flex-col'>
          <span className='text-sm font-semibold'>{reply?.name}</span>
          <span className='text-xs'>{commenttime}</span>
          </div>
        </div>
        <div className='flex gap-1'>
          <span  className='text-cta font-semibold text-sm'>{reply.parentIdName}</span>
        <span className='text-sm'>{reply.textContent}</span>
        </div>
        <div className='flex w-auto justify-between'>
        <Icon 
          onClick={() => toggleReplyInput(reply.id, postId)} 
          className="cursor-pointer h-6 w-6 text-gray-600" 
          icon="iconamoon:comment-light" 
        />

        {replyInputVisible[reply.id] && (
          <div className="flex items-center w-full gap-2 mt-2">
            <InputEmoji
              value={postComment}
              onChange={(text) => setPostComment(text)}
              placeholder="Write a reply..."
            />
            <Icon 
              onClick={() => handleComment(reply.id, postId)} 
              className='text-cta cursor-pointer' 
              icon="majesticons:send" 
              width="1.5em" 
              height="1.6em" 
              strokeWidth='2' 
            />
          </div>
        )}
    
        {/* Toggle visibility of nested replies */}
        <span 
          onClick={() => setNestedVisibleReplies(prev => ({
            ...prev,
            [reply.id]: !prev[reply.id]
          }))}
          className='cursor-pointer'
        >
          {reply.replies && reply.replies.length > 0 && (
            <span className='text-xs'>{nestedVisibleReplies[reply.id] ? 'Hide replies' : 'View replies'} ({reply.replies.length})</span>
          )}
        </span>
        </div>
        {/* Recursively render nested replies */}
        {nestedVisibleReplies[reply.id] && reply.replies && reply.replies.length > 0 && (
          <div>
            {renderReplies(reply.replies, postId, reply.id)}
          </div>
        )}
      </div>
    )});
  };
  
  const fetchLikes = useCallback(async (postId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }
      const response = await fetch(`http://localhost:8080/likes/post/${postId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        // Check if the logged-in user is in the list of users who liked the post
        const userHasLiked = data.some(like => like.userId === parseInt(userId));
        setLike(prev => ({
          ...prev,
          [postId]: userHasLiked
        }));
        console.log(liked)
      } else {
        console.error('Failed to fetch likes:', response.status);
      }
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  },[userId,liked]);

  const toggleReplyInput = (commentId) => {
    setReplyInputVisible(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
    setReplyId(commentId)
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
  
  // Fetch user data
  const fetchUserName = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }

      const response = await fetch(`http://localhost:8080/api/users/${userID}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.error('Failed to fetch user data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  },[userID]);


  useEffect(() => {
      fetchUserName();
  }, [fetchUserName]);
  const userIDObject = userID;

  const fetchUserDetails = useCallback(async () => {
    const userIdValue = parseInt(userIDObject.userID, 10);
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`http://localhost:8080/api/users/${userIdValue}`, {
        method: 'GET',
        headers: {
        'Authorization':`Bearer ${token}`
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  },[userIDObject.userID]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get('http://localhost:8080/api/users',{
        'Authorization':`Bearer ${token}`
      });
      const usersData = response.data.map(user => ({
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

  // Extract the userID property and convert to number
  const userIdValue = parseInt(userIDObject.userID, 10);
  // Fetch posts
  const fetchUserData =  useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }

      // Convert userID to an integer and validate
      // Make the API request with the integer userID

      const response = await fetch(`http://localhost:8080/posts/getPost-visibility/${userID}/PERSONAL`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch user data:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error fetching user data:', userID);
    }
  },[userID,userId]);
  useEffect(() => {
    if (shouldRefetch) {
      fetchUserData(); // Refetch data
      setShouldRefetch(false); // Reset flag
    }
  }, [fetchUserData,shouldRefetch]);

  useEffect(() => {
      fetchUserData();
  }, [fetchUserData]);

  // Handle saved posts
  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem('savedPosts'));
    if (savedPosts) {
      setSaved(savedPosts);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('savedPosts', JSON.stringify(saved));
  }, [saved]);

  const changePrivacy = async(privacy)=>{
    const payload={
     id:userId,
     visibility:selectedPrivacy
    }
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`http://localhost:8080/posts/update-privacy/${postId}?privacy=${privacy}`, {
        method: 'PATCH',
        body:JSON.stringify(payload),
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });
  
      if (response.ok) {
        setPostId(null)
        fetchUserData()
      } else {
        console.error('Failed to fetch user data:', response.status);
        // Optionally handle different status codes (e.g., unauthorized, not found)
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
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
        
      } else {
        console.error('Failed to fetch user data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    },[isCurrentUser,userID,userId]);

  // Handle dropdown menu actions
  const handleEdit = (postId) => {
    console.log('Edit post with ID:', postId);
    setEdit(postId);
    console.log(edit)
  };

  const handleDelete = (postId) => {
    console.log('Delete post with ID:', postId);
    setDeleteId(postId)
  };

  const toggleDropdown = (postId) => {
    setShowDropdown(prev => (prev === postId ? null : postId)); // Toggle visibility
  };

  // const handleSave = (id) => {
  //   setSaved(prevSaved => ({
  //     ...prevSaved,
  //     [id]: !prevSaved[id]
  //   }));
  // };

  const toggleComment = (postId) => {
    setComment(prev => {
      if (prev === postId) {
        return null;
      } else {
        setSelectedPostId(postId)
        fetchComments(postId);  // Ensure postId is valid and passed correctly
        return postId;
      }
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`http://localhost:8080/posts/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
  
      if (response.ok) {
        setShouldRefetch(true);
        closeDelete();
        setDeleteId('');
      } else {
        alert('An error occurred. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while attempting to submit.');
    }
  };
  // const handleLikes = async (postId) => {
  //   const jsonData = {
  //     postId:postId,
  //     userId:userId
  //   };
  //   try {
  //     const response = await fetch(`http://localhost:8080/likes/toggle?postId=${postId}&userId=${userId}`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(jsonData),
  //     });
  
  //     if (response.ok) {
  //       setSelectedPostId('') // Close the reply input
  //     } else {
  //       console.log('An error occurred. Please try again later.');
  //       setSelectedPostId('');
  //     }
  //   } catch (error) {
  //     console.error('Error submitting form:', error);
  //     setSelectedPostId('');
  //   }
  // };
  const likesCount = async (postId) => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`http://localhost:8080/likes/post/${postId}/count`,{
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setLikeCount(prevCounts => ({
          ...prevCounts,
          [postId]: data
        }));
      }
    } catch (error) {
      console.error('Error fetching like count:', error);
    }
  };

  useEffect(() => {
    if (userData.length > 0) {
      userData.forEach(post => {
        if (post.postId) {
          fetchComments(post.postId); // Fetch comments for each post
          fetchLikes(post.postId); // Fetch likes for each post
          likesCount(post.postId); // Fetch like counts for each post
        }
      });
    }
  }, [fetchLikes,userData]);

  const handleLike = async (postId) => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`http://localhost:8080/likes/toggle?postId=${postId}&userId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : `Bearer ${token}`
        },
      });

      if (response.ok) {
        setLiked(prev => ({
          ...prev,
          [postId]: !prev[postId]
        }));
        setAnimationPostId(postId);
        // Re-fetch like count or update locally
        const countResponse = await fetch(`http://localhost:8080/likes/post/${postId}/count`,{
          headers:{
            'Authorization' : `Bearer ${token}`
          }
        });
        const countData = await countResponse.json();
        setLikeCount(prev => ({
          ...prev,
          [postId]: countData
        }));
        setTimeout(() => setAnimationPostId(null), 300); // Reset animation class
      } else {
        console.log('An error occurred. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    const parentComment = displayComments[selectedPostId]?.find(comment => comment.id === replyId);
    const jsonData = {
      postId:selectedPostId,
      parentId:replyId ? replyId : null,
     repliedToUserId: parentComment?parentComment.userId : null,
      userId: userId,
      textContent: postComment
    };
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('http://localhost:8080/comments/comment-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token} `
        },
        body: JSON.stringify(jsonData),
      });
  
      if (response.ok) {
      setPostComment('')
      setSelectedPostId('')
      setReplyId('')
      toggleReplies()
      } else {
        console.log('An error occurred. Please try again later.');
        setPostComment('')
        setSelectedPostId('')
        setReplyId('')
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setPostComment('');
      setSelectedPostId('');
      setReplyId('')
    }
  };

  const fetchComments = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }
      const url = `http://localhost:8080/comments/post/${postId}`;
      console.log(`Fetching comments from URL: ${url}`); // Debug log
  
      const response = await fetch(url, {
        method: 'GET',
        headers:{
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch comments:', response.status, errorText);
        return;
      }
  
      const data = await response.json();
      console.log(`Fetched comments for postId ${postId}:`, data); // Debug log
      setDisplayComments(prevComments => ({
        ...prevComments,
        [postId]: data
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  
  useEffect(() => {
    if (userData.length > 0) {
      userData.forEach(post => {
        if (post.postId) {
          fetchComments(post.postId); // Fetch comments for each post
        }
      });
    }
  },[userData]);

  console.log(postComment)

  useEffect(()=>{
    fetchMyfriends();
    fetchfriends();
  },[])

  return (
    <form onSubmit={handleSubmit} className={` flex ${isDarkMode ? 'dark-bg' : 'white-bg'} flex-col gap-4 items-center shadow-lg max-w-[30rem] w-full px-4`}>
        <div className='w-full'>
      {userData?.map((post) =>{
     const calculateTimeDifference = () => {
      const pastDate = moment(post.createdAt);
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
console.log(user?.profileImagePath)
console.log(typeof(comment))
    const timeDifference = calculateTimeDifference();
        return(
          <>
{post?.privacySetting === 'PUBLIC' || 
  (post?.privacySetting === 'FRIENDS' && 
    (isCurrentUser ||
     friends?.friends?.find(f => f.id === userId)
    )
  ) 
  ?       <div className={`flex flex-col gap-4 ${isDarkMode ? 'gray-bg' : 'white-bg'} shadow-lg mt-4 py-4 px-4 relative`} key={post.postId}>
          <div className="flex justify-between items-center">

            <div className="flex gap-2 items-center">
              <img className="rounded-full w-11 h-11" src={`http://localhost:8080${user?.profileImagePath}`} alt={`http://localhost:8080${user?.profileImagePath}`}/>
              <div className="flex flex-col"> 
                <span className="font-semibold">
            <span key={users.id} className="font-semibold">{post.name}</span>
          
        </span>
        <div className='flex gap-1 items-center'>
              <span className={`text-xs ${isDarkMode ? 'text-white' : 'text-black'}  text-gray-600`}>{timeDifference}</span><span onClick={()=>handleprivacyDropdown(post.postId)}>{post.privacySetting =="PUBLIC" &&<Icon className="w-4 h-4" icon="material-symbols-light:public" /> }{post.privacySetting =="FRIENDS" &&<Icon className='w-3 h-3' icon="bi:people" />}</span>
                </div>
              </div>
            </div>
       
            {userID=== userId && (<div className="flex flex-col items-center relative"> {/* Ensure dropdown menu is positioned correctly */}
              <Icon className="w-5 h-5 cursor-pointer"
                icon="carbon:overflow-menu-vertical"
                onClick={() => toggleDropdown(post.postId)} // Toggle dropdown for specific post
              />
              {showDropdown === post.postId && (
                <DropdownMenu
                  onEdit={() => handleEdit(post.postId)}
                  onDelete={() => {handleDelete(post.postId);openDelete()}}
                  onClose={() => setShowDropdown(null)} // Close dropdown
                />
              )}
            </div>)}
          </div>
          <span>{post.description}</span>
          {post.postType === 'IMAGE' ? (
                 <NavLink to={`/post/${post.userId}/${post.postId}`}><img className='w-full h-80' src={`http://localhost:8080${post.imageUrl}`} alt={`http://localhost:8080${post.imageUrl}`} /></NavLink>
          ) : post.postType === 'VIDEO' ? (
            <video className='w-full' controls>
              <source src={`http://localhost:8080${post.videoUrl}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : null}
          <div className='flex gap-6 items-center'>
            <div className='flex items-center'>
          <Icon
            onClick={() => handleLike(post.postId)}
            className={`cursor-pointer h-7 w-7 ${like[post.postId] ? 'text-pink' : isDarkMode ? 'text-white' : 'text-gray-600'} ${animationPostId === post.postId ? 'like-animate' : ''}`}
            icon={like[post.postId] ? "material-symbols-light:favorite" : "material-symbols-light:favorite-outline"}
            width='1.2em'
            height='1.2em'
          /> {likeCount[post.postId] || 0}</div>
          <div className='flex items-center gap-1'><Icon onClick={() => toggleComment(post.postId)} className={`cursor-pointer ${isDarkMode ? 'text-white' : 'text-gray-600'} h-6 w-6`} icon="iconamoon:comment-light" />{ <span>{displayComments[post.postId]?.length}</span> || 0 }</div>
          </div>
          {comment === post.postId && (   <div className="flex items-center gap-2"><label className="cursor-pointer"><Icon className="w-7 h-7 text-gray-500" icon="mdi:camera-outline" /><input  className="absolute opacity-0" type="file" /></label><InputEmoji onChange={(text) => setPostComment(text)} placeholder="Add a comment" /><Icon onClick={handleComment} className='text-cta cursor-pointer' icon="majesticons:send" width="1.5em" height="1.6em" strokeWidth='2' /></div>)}
          {comment && displayComments[post.postId] &&(
  displayComments[post.postId].map((comment) => {
    const commentUser = users.find(user => user.id === comment.userId);
    const commentTime = () => {
      const pastDate = moment(comment.createdAt);
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

    const commenttime = commentTime();
    return(
    <div>
<div key={comment.id} className='flex border py-2 px-4 bg-black rounded-3xl flex-col shadow-md w-full gap-2'>
<div className='flex justify-between'>
<div className='flex gap-2 items-center'>
<img className='rounded-full h-8 w-8' src={`http://localhost:8080${comment.profileImagePath}`} alt={post.profilepic} />
<div className='flex flex-col'>
<p className='font-semibold text-sm'>{comment?.name}</p>
<span className='text-xs'>{commenttime}</span>
</div>
</div>
<div className='relative'>
</div>          
</div>
<span className='text-sm'>{comment.textContent}</span>
{/* {edit ===post.commentId ? <div className='flex items-center'><InputEmoji value={post.comment} onChange={(text)=>setPostComment(text)} /><Icon  onClick={() => handleEditComment(image.id, post.commentId, postComment)} className='text-cta cursor-pointer' icon="majesticons:send" width="1.5em" height="1.6em" strokeWidth='2' /></div> : <span>{post.comment}</span>} */}
<div className='flex items-end gap-2'>
{/* <Icon onClick={handleLike} className={`cursor-pointer h-5 w-5 text-pink`}
icon={isClicked ? "material-symbols-light:favorite" : "material-symbols-light:favorite-outline"} width='1.2em' height='1.2em'/>  */}
<div className='flex items-center w-full justify-between'>
<Icon onClick={() => toggleReplyInput(comment.id)} className="cursor-pointer h-6 w-6 text-gray-600" icon="iconamoon:comment-light" /><span onClick={() => toggleReplies(comment.id)} className='cursor-pointer'>{comment.replies.length>0?<span className='text-xs'>{visibleReplies[comment.id] ? 'Hide replies' : 'View replies'} ({comment.replies.length})</span>:<span></span>}</span>
</div>
<span className='text-gray-500 text-sm'></span>
</div>
{/* {visibleReplies[comment.id] && comment.replies  ?.slice().reverse().map((reply) => (
        <div key={reply.id} className='flex border ml-8 py-2 px-4 rounded-3xl flex-col shadow-md w-auto gap-2'>
          <div className='flex gap-1'>
            <img className='w-9 h-9 rounded-full' src={reply.profilePic} alt={reply.profilePic} />
            <span>{user?.name}</span>
          </div>
          <span>{reply.textContent}</span>
          <Icon onClick={() => toggleReplyInput(comment.id,reply.id)} className="cursor-pointer h-6 w-6 text-gray-600" icon="iconamoon:comment-light" />
        </div>
      ))} */}

{visibleReplies[comment.id] && renderReplies(comment.replies, post.postId)}
{replyInputVisible[comment.id] && (
                  <div className="flex items-center gap-2 mt-2">
                    <InputEmoji
                      value={postComment}
                      onChange={(text) => setPostComment(text)}
                      placeholder="Write a reply..."
                    />
                    <Icon onClick={handleComment} className='text-cta cursor-pointer' icon="majesticons:send" width="1.5em" height="1.6em" strokeWidth='2' />
                  </div>
                )}       
</div>

</div>
  )})
)}

        </div> : ''}
        </>)})}
      </div>
              <Modal  appElement={document.getElementById('root')}
style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          backgroundColor:'transparent',
          transform: 'translate(-40%, -20%)',
          width: '80%',
          height: '60%',
          overflowY: 'auto',
          border:'none'
        },}}
        isOpen={deletePopup} onRequestClose={closeDelete}>
      <div className='relative bg-white h-36 ml-72 w-1/3 rounded-md flex rounded-lg shadow-lg flex-col items-center justify-center gap-4'>
      <span className='text-lg font-semibold'>Are you sure you want to delete</span>
      <div className='flex w-full justify-center gap-4'><button onClick={closeDelete} className='w-16 px-2 rounded-md hover:bg-gray-100 bg-gray-200 py-1'>Cancel</button><button onClick={handleSubmit} className='w-16 px-2 bg-red text-white hover:opacity-85 rounded-md py-1'>Yes</button></div>
      <Icon onClick={closeDelete} className='absolute cursor-pointer top-2 right-2' icon="mdi:remove" />
    </div>
 </Modal>
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
        <div className=' flex items-center justify-center'>
        <form className='border items-center justify-center px-2 text-center bg-white border-gray rounded-md w-1/2 h-1/2' >
        <div className='py-2 flex justify-center w-full border-b border-gray-300 '> Edit Privacy</div>
        <div>
          {Privacy.map((privacy)=>(
            <div    onClick={() => handlePrivacySelect(privacy.name)}
            className={`flex items-center gap-2 cursor-pointer py-2 px-4 border-b border-gray-100 ${
              selectedPrivacy === privacy.name.toUpperCase() ? 'bg-gray-200 font-semibold' : ''
            }`}
          >
             <span>{privacy.icon}</span>
             <div className='flex items-start flex-col'>
              <span className='text-lg font-semibold'>
                {privacy.name}
              </span>
              <span>
                {privacy.description}
              </span>
              </div>
              </div>
          ))}
        </div>
        <div className='flex gap-4 py-4 justify-end'>
          <button onClick={handleclosePrivacydropdown} className='px-3 py-2 bg-gray-200 hover:opacity-80 rounded-md'>Cancel</button>
          <button onClick={()=>{handlePrivacySubmit();changePrivacy(selectedPrivacy)}} className='px-3 py-2 bg-cta hover:opacity-80 text-white rounded-md'>Done</button>
        </div>
        </form>
        </div>
        </Modal>
    </form>
  );
};

export default Post;