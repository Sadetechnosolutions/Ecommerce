import React, { useState, useEffect } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";
import InputEmoji from 'react-input-emoji';
import { editComment, addToSaved } from "../slices/photoslice";
import { useDispatch, useSelector } from "react-redux";
import DropdownMenu from '../components/dropdownmenu';
import moment from "moment";
import Modal from 'react-modal';

import { useParams } from 'react-router';
import axios from 'axios';

const Post = () => {
  const [comment, setComment] = useState(null);
  const [share, showShare] = useState(false);
  const [edit, setEdit] = useState(false);
  const [saved, setSaved] = useState({});
  const [postComment, setPostComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);

  const dispatch = useDispatch();
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
  const userID = useParams()
  const [like,setLike] = useState(false);
  const [likeCount,setLikeCount] = useState({});
  const [users, setUsers] = useState([]);
  const [animationPostId, setAnimationPostId] = useState(null);
  const [likedBy,setLikedBy] = useState(null);


  const openDelete = ()=>{
    setDeletePopup(true)
  }                   

  const closeDelete = ()=>{
    setDeletePopup(false)
  }

  const showLikedBy = (id)=>{
    setLikedBy(id)
  }

  const toggleReplies = (commentId) => {
    setVisibleReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));

    
  };
  const renderReplies = (replies, postId, parentCommentId = null) => {
    return replies.slice().reverse().map(reply => (
      <div key={reply.id} className='flex border py-2 px-4 rounded-3xl flex-col shadow-md w-full gap-1'>
        <div className='flex gap-1'>
          <img className='w-9 h-9 rounded-full' src={reply.profilePic} alt={reply.profilePic} />
          <span>{user?.name}</span>
        </div>
        <span>{reply.textContent}</span>
        <div className='flex w-auto justify-between'>
        <Icon 
          onClick={() => toggleReplyInput(reply.id, postId)} 
          className="cursor-pointer h-6 w-6 text-gray-600" 
          icon="iconamoon:comment-light" 
        />
    
        {replyInputVisible[reply.id] && (
          <div className="flex items-center bg-black gap-1 mt-2">
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
            <span>{nestedVisibleReplies[reply.id] ? 'Hide replies' : 'View replies'} ({reply.replies.length})</span>
          )}
        </span>
        </div>
        {/* Recursively render nested replies */}
        {nestedVisibleReplies[reply.id] && reply.replies && reply.replies.length > 0 && (
          <div className="ml-4">
            {renderReplies(reply.replies, postId, reply.id)}
          </div>
        )}
      </div>
    ));
  };
  
  const fetchLikes = async (postId) => {
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
        const userHasLiked = data.some(like => like.userId === userId);
        setLike(prev => ({
          ...prev,
          [postId]: userHasLiked
        }));
      } else {
        console.error('Failed to fetch likes:', response.status);
      }
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const toggleReplyInput = (commentId) => {
    setReplyInputVisible(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
    setReplyId(commentId)
  };
  
  // Fetch user data
  const fetchUserName = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }
      const userIdValue = parseInt(userID, 10);
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
  };
  useEffect(() => {
    if (shouldRefetch) {
      fetchUserData(); // Refetch data
      setShouldRefetch(false); // Reset flag
    }
  }, [shouldRefetch]);
  
  useEffect(() => {
    if (userId) {
      fetchUserName();
    }
  }, [userId]);
  const userIDObject = userID;

  const fetchUserDetails = async () => {
    const userIdValue = parseInt(userIDObject.userID, 10);
    try {
      const response = await axios.get(`http://localhost:8080/api/users/${userIdValue}`, {
        method: 'GET',
        headers: {
    
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/auth/users/descending');
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
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }

      // Convert userID to an integer and validate
      // Make the API request with the integer userID

      const response = await fetch(`http://localhost:8080/posts/user/${userIdValue}`, {
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
  };

  useEffect(() => {
    if (userID) {
      fetchUserData();
    }
  }, [userID]);

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

  // Handle dropdown menu actions
  const handleEdit = (postId) => {
    console.log('Edit post with ID:', postId);
    setEdit(postId);
  };

  const handleDelete = (postId) => {
    console.log('Delete post with ID:', postId);
    setDeleteId(postId)
  };

  const toggleDropdown = (postId) => {
    setShowDropdown(prev => (prev === postId ? null : postId)); // Toggle visibility
  };

  const handleSave = (id) => {
    setSaved(prevSaved => ({
      ...prevSaved,
      [id]: !prevSaved[id]
    }));
  };

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
  

  const handleShowShare = (post) => {
    showShare(post);
  };

  const closeShare = () => {
    showShare(false);
  };

  const handleSaved = (id) => {
    console.log(dispatch(addToSaved(id)));
  };

  const handleEditComment = (imageId, commentId, newComment) => {
    console.log(dispatch(editComment({ imageId, commentId, newComment })));
    setEdit(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`http://localhost:8080/posts/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
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
  const handleLikes = async (postId) => {
    const jsonData = {
      postId:postId,
      userId:userId
    };
    try {
      const response = await fetch(`http://localhost:8080/likes/toggle?postId=${postId}&userId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData),
      });
  
      if (response.ok) {
        setSelectedPostId('') // Close the reply input
      } else {
        console.log('An error occurred. Please try again later.');
        setSelectedPostId('');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSelectedPostId('');
    }
  };
  const likesCount = async (postId) => {
    try {
      const response = await fetch(`http://localhost:8080/likes/post/${postId}/count`);
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
  }, [userData]);

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`http://localhost:8080/likes/toggle?postId=${postId}&userId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setLiked(prev => ({
          ...prev,
          [postId]: !prev[postId]
        }));
        setAnimationPostId(postId);
        // Re-fetch like count or update locally
        const countResponse = await fetch(`http://localhost:8080/likes/post/${postId}/count`);
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
      parentId:replyId,
     repliedToUserId: parentComment?parentComment.userId:'',
      userId: userId,
      textContent: postComment
    };
    try {
      const response = await fetch('http://localhost:8080/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      const url = `http://localhost:8085/comments/post/${postId}`;
      console.log(`Fetching comments from URL: ${url}`); // Debug log
  
      const response = await fetch(url, {
        method: 'GET',
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
  },[]);

  console.log(postComment)
  const calculateTimeDifference = (date) => {
    const pastDate = moment(date);
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

  // State to store the time differences
  const [timeDifferences, setTimeDifferences] = useState({});

  // Function to update the time differences every minute
  const updateTimeDifferences = () => {
    setTimeDifferences(prev => {
      const newDifferences = {};
      userData.forEach(post => {
        newDifferences[post.postId] = calculateTimeDifference(post.createdAt);
      });
      return newDifferences;
    });
  };

  // Set up interval to update time differences every minute
  useEffect(() => {
    updateTimeDifferences(); // Initial update
    const intervalId = setInterval(updateTimeDifferences, 60000); // Update every minute

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [userData]);
  const isLiked = (postId) => like[postId] || false;
  return (
    <form onSubmit={handleSubmit} className="rounded-md flex flex-col max-w-[30rem] w-full items-center gap-16 shadow-lg w-full py-2 px-4">
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
        <div className='w-full flex flex-col gap-4 shadow-lg py-4 px-4 relative' key={post.postId}>
          <div className="flex justify-between items-center">
            <div className="flex gap-1 items-center">
              <img className="rounded-full w-9 h-9" src={`http://localhost:8080/posts${user?.profileImagePath}`} alt={`http://localhost:8080/posts${user?.profileImagePath}`}/>
              <div className="flex flex-col"> 
                <span className="font-semibold">
            <span key={users.id} className="font-semibold text-sm">{post.name}</span>
        </span>
                <span className="text-xs text-gray-600">{timeDifference}</span>
              </div>
            </div>
       
            {userIdValue === userId && (<div className="flex flex-col items-center relative"> {/* Ensure dropdown menu is positioned correctly */}
              <Icon
                className="w-4 h-4 cursor-pointer"
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
            <img className='w-full h-64' src={`http://localhost:8080/posts${post.imageUrl}`} alt='' />
          ) : post.postType === 'VIDEO' ? (
            <video className='w-full bg-black h-64' controls>
              <source src={`http://localhost:8080/posts${post.videoUrl}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : null}
          <div className='flex gap-6 items-center'>
            <div className='flex items-center'>
          <Icon
            onClick={() => handleLike(post.postId)}
            className={`cursor-pointer h-7 w-7 ${like[post.postId] ? 'text-pink' : 'text-gray-700'} ${animationPostId === post.postId ? 'like-animate' : ''}`}
            icon={like[post.postId] ? "material-symbols-light:favorite" : "material-symbols-light:favorite-outline"}
            width='1.2em'
            height='1.2em'
          /> {likeCount[post.postId] || ''}</div>
          <div className='flex items-center gap-1'><Icon onClick={() => toggleComment(post.postId)} className="cursor-pointer h-6 w-6 text-gray-600" icon="iconamoon:comment-light" />{ <span>{displayComments[post.postId]?.length}</span> || 0 }</div>
          </div>
          {comment == post.postId && (   <div className="flex items-center gap-1"><label className="cursor-pointer"><Icon className="w-7 h-7 text-gray-500" icon="mdi:camera-outline" /><input  className="absolute opacity-0" type="file" /></label><InputEmoji onChange={(text) => setPostComment(text)} placeholder="Add a comment" /><Icon onClick={handleComment} className='text-cta cursor-pointer' icon="majesticons:send" width="1.5em" height="1.6em" strokeWidth='2' /></div>)}
          {comment == post.PostId && displayComments[post.postId] &&(
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
<div key={comment.id} className='flex border py-2 px-4 rounded-3xl flex-col shadow-md w-full gap-1'>
<div className='flex justify-between'>
<div className='flex gap-1 items-center'>
<img className='rounded-full h-9 w-9' src={post.profilepic} alt={post.profilepic} />
<div className='flex flex-col'>
<p className='font-semibold text-sm'>{commentUser?.UserName}</p>
<span className='text-xxs'>{commenttime}</span>
</div>
</div>
<div className='relative'>
</div>          
</div>
<span className='text-sm'>{comment.textContent}</span>
{/* {edit ===post.commentId ? <div className='flex items-center'><InputEmoji value={post.comment} onChange={(text)=>setPostComment(text)} /><Icon  onClick={() => handleEditComment(image.id, post.commentId, postComment)} className='text-cta cursor-pointer' icon="majesticons:send" width="1.5em" height="1.6em" strokeWidth='2' /></div> : <span>{post.comment}</span>} */}
<div className='flex items-end gap-1'>
{/* <Icon onClick={handleLike} className={`cursor-pointer h-5 w-5 text-pink`}
icon={isClicked ? "material-symbols-light:favorite" : "material-symbols-light:favorite-outline"} width='1.2em' height='1.2em'/>  */}
<div className='flex items-center w-full justify-between'>
<Icon onClick={() => toggleReplyInput(comment.id)} className="cursor-pointer h-6 w-6 text-gray-600" icon="iconamoon:comment-light" /><span onClick={() => toggleReplies(comment.id)} className='cursor-pointer'>{comment.replies.length>0?<span>{visibleReplies[comment.id] ? 'Hide replies' : 'View replies'} ({comment.replies.length})</span>:<span></span>}</span>
</div>
<span className='text-gray-500 text-sm'></span>
</div>
{/* {visibleReplies[comment.id] && comment.replies  ?.slice().reverse().map((reply) => (
        <div key={reply.id} className='flex border ml-8 py-2 px-4 rounded-3xl flex-col shadow-md w-auto gap-1'>
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
                  <div className="flex items-center gap-1 mt-2">
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

        </div>
      )})}
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
      <div className='relative bg-white h-32 w-5/6 rounded-md flex rounded-lg shadow-lg flex-col items-center justify-center gap-4'>
      <span className='text-sm font-semibold'>Are you sure you want to delete</span>
      <div className='flex text-sm w-full justify-center gap-4'><button onClick={closeDelete} className='w-16 px-1 rounded-md hover:bg-gray-100 bg-gray-200 py-1'>Cancel</button><button onClick={handleSubmit} className='w-16 px-1 bg-red text-white hover:opacity-85 rounded-md py-1'>Yes</button></div>
      <Icon onClick={closeDelete} className='absolute cursor-pointer top-2 right-2' icon="mdi:remove" />
    </div>
 </Modal>
    </form>
  );
};

export default Post;

