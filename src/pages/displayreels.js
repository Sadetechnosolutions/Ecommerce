import React, { useState, useEffect, useCallback } from "react";
import ReactPlayer from "react-player";
import { useParams } from "react-router";
import axios from "axios";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate } from 'react-router-dom';
import InputEmoji from "react-input-emoji";
import moment from "moment";
import { useDispatch } from "react-redux";
import { selectPhotoComment, } from "../slices/photoslice";
import Modal from "react-modal";

const DisplayReels = () => {
 const navigate = useNavigate()
  const { userID } = useParams();
  const [option,setOption] = useState(false);
  const userId = useSelector((state)=>state.auth.userId)
  const [selectedReel, setSelectedReel] = useState(null);
  const [users,setUsers] = useState();
  const [liked,setLiked] = useState({});
  const [like,setLike] = useState(false);
  const [likeCount,setLikeCount] = useState({});
  const [animationPostId,setAnimationPostId] = useState();
  const [userData,setUserData] = useState();
  const [likedUser,setLikeduser] = useState();
  const [comment, setComment] = useState(null);
  const [postComment, setPostComment] = useState('');
  const [post, setPost] = useState([]);
  const [displayComments,setDisplayComments] = useState({});
  const [commentdropdown, setCommentDropdown] = useState(null);
  const [visibleReplies, setVisibleReplies] = useState({});
  const {selectedphotocomment} = useSelector((state)=>state.photo)
  const [replyInputVisible, setReplyInputVisible] = useState({}); 
  const [replyId,setReplyId] = useState('');
  const [nestedVisibleReplies, setNestedVisibleReplies] = useState({});
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedPhotoComments, setSelectedPhotoComments] = useState({}); 
  // const [type,setType] = useState('')
  const [permission,setPermission] = useState();
  // const [permissionPopup,setPermissionPopup] = useState(false)
  const dispatch = useDispatch()
  const [file,setFile] = useState()
  // const {postID} = useParams();
  const [deletePopup,setDeletePopup] = useState(false)
  const [replylike,setReplyLike] = useState(false);
  const [replyLikeCount,setReplyLikeCount] = useState({})
  const [commentLike,setCommentLike] = useState(false)
  const [commentLikeCount,setLikeCommentCount] = useState({})
  const [sharePostId, setsharePostId] = useState(); 
  const [sharePopup,setSharePopup] = useState(false)
  const [shareCaption,setShareCaption] = useState('')
  const [shareprivacydropdown,setSharePrivacydropdown] = useState(false)
  const [privacy,setPrivacy] =useState('PUBLIC')
  const [myFriends,setMyFriends] = useState();
  const [selectedImageId,setSelectedImageId] = useState();
  const [friendlistPopup,ShowFriendlistPopup] = useState(false);

  const openShare = (id)=>{
    setSharePopup(true)
    setsharePostId(id)
    console.log(id)
  }

  const closeShare = (id)=>{
    setSharePopup(false)
    setsharePostId(null)
  }

  const handleDropdown = ()=>{
    setSharePrivacydropdown(true)
}

const displayFriends = ()=>{
  ShowFriendlistPopup(true)
}

const closeFriends = ()=>{
  ShowFriendlistPopup(false)
}

const closeDropdown = ()=>{
    setSharePrivacydropdown(false)
}

  const toggleReplies = (commentId) => {
    setVisibleReplies(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    })); 
  };

  const renderPrivacyIcon = () => {
    switch (privacy) {
        case 'PUBLIC':
            return <Icon className='w-5 h-5' icon="material-symbols-light:public" />;
        case 'FRIENDS':
            return <Icon className='w-4 h-4' icon="fa-solid:user-friends" />;
        default:
            return null;
    }
};
const handleImageSelect = (id) => {
  // Toggle the selected image ID: if the same image is clicked, unselect it, else select the new one
  setSelectedImageId((prevSelectedId) => (prevSelectedId === id ? null : id));
};
  const fetchReels = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }
  
      const response = await fetch(`http://localhost:8080/aggregate-media/reel/${userID}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setSelectedReel(data);
  
        const userHasLiked = data?.reelDTO.likedReels.some(like => like.userId === parseInt(userId));
        setLike(prev => ({
          ...prev,
          [data?.reelResponse.id]: userHasLiked,
        }));
  
        // Initialize objects for likes and like counts
        const updatedCommentLike = {};
        const updatedCommentLikeCount = {};
        const updatedReplyLike = {};
        const updatedreplyLikeCount = {};
  
        // Check if user has liked each comment and their replies
        const checkRepliesLike = (replies) => {
          replies.forEach(reply => {
            const userHasLikedReply = reply.likes.some(like => like.userId === parseInt(userId));
            updatedReplyLike[reply.id] = userHasLikedReply;
            updatedreplyLikeCount[reply.id] = reply.likeCount || 0;
  
            // If the reply has further nested replies, call the function recursively
            if (reply.replies && reply.replies.length > 0) {
              checkRepliesLike(reply.replies);
            }
          });
        };
  
        // Process comments and replies
        data.commentReelsResponse.forEach(comment => {
          const userHasLikedComment = comment.likes.some(like => like.userId === parseInt(userId));
          updatedCommentLike[comment.id] = userHasLikedComment;
          updatedCommentLikeCount[comment.id] = comment.likeCount || 0;
  
          // Check replies for likes recursively
          checkRepliesLike(comment.replies);
        });
  
        // Set the state with the updated like data
        setReplyLike(updatedReplyLike);
        setCommentLike(updatedCommentLike);
        setLikeCommentCount(updatedCommentLikeCount);
        setReplyLikeCount(updatedreplyLikeCount);
        // Set like count for the post
        setLikeCount(prev => ({
          ...prev,
          [data?.reelResponse.id]: data?.reelDTO.likeCount || 0,
        }));
      } else {
        console.error('Failed to fetch user data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
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
        <div key={reply.id} className='flex border py-2 px-4 rounded-3xl flex-col shadow-md w-full gap-2'>
          <div className='flex gap-1'>
            <img className='w-7 h-7 rounded-full' src={`http://localhost:8080${reply.profileImagePath}`} alt={reply.profilePic} />
            <div className='flex flex-col'>
            <span className='text-sm font-semibold'>{reply?.name}</span>
            <span className='text-xs'>{commenttime}</span>
            </div>
          </div>
          <div className='flex gap-1'>
            <span className='text-cta font-semibold'>{reply.parentIdName}</span>
   
            <span>{reply.textContent}</span>
          </div>
          <div className='flex w-full justify-between'>
          <div className='flex gap-2 items-center'>
            <div className='flex items-center '>
<Icon onClick={() => handleLikes(reply?.id)}
        className={`cursor-pointer h-7 w-7 ${like[reply?.id] ? 'text-red' : 'text-gray-700'} ${animationPostId === reply?.id ? 'like-animate' : ''}`}
        icon={like[reply?.id] ? "material-symbols-light:favorite" : "material-symbols-light:favorite-outline"}
        width='1.2em'
        height='1.2em'
      />       
<span className='cursor-pointer'>{likeCount[reply?.id] || ''}</span> 
</div>
          <Icon 
            onClick={() => toggleReplyInput(reply.id, postId)} 
            className="cursor-pointer h-5 w-5 text-gray-600" 
            icon="icomoon-free:reply" 
          />
      </div>
          {replyInputVisible[reply.id] && (
            <div className="flex items-center bg-black gap-2 mt-2">
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
          {nestedVisibleReplies[reply.id] && reply.replies && reply.replies.length > 0 && (
            <div className="ml-4">
              {renderReplies(reply.replies, postId, reply.id)}
            </div>
          )}
        </div>
      )
    } );
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

  const toggleReplyInput = (commentId,replyid) => {
    setReplyInputVisible(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
    setReplyId(commentId)
    setSelectedPostId(replyid)
  };

  const toggleCommentDropdown = (commentId)=>{
    setCommentDropdown(prev => (prev === commentId? null : commentId))
  }

  const closeDelete = ()=>{
    setDeletePopup(false)
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

    useEffect(()=>{
      fetchMyfriends();
    },[])
  const deleteComment = async (deletecommentId) => {
    // e.preventDefault();
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`http://localhost:8080/comments/${deletecommentId}?userId=${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
  
      if (response.ok) {
      closeDelete()
      } else {
        alert('An error occurred. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while attempting to submit.');
    }
  };

  const handleImageChange = (event,type) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) { 
        const fileObject = { name: selectedFile };
            setFile(fileObject.name.name); 
            dispatch(selectPhotoComment(fileObject))
            console.log(fileObject)
    }
};

  const handleComment = async (e) => {
    const parentComment = displayComments[selectedPostId]?.find(comment => comment.id === replyId);
    const formdata = new FormData();
    formdata.append('file',selectedphotocomment?.name)
    // const userIDObject = userID;
    // const userIdValue = parseInt(userIDObject.userID, 10);
    const jsonData = {
      parentId: replyId ? replyId :null,
      repliedToUserId: parentComment ? parentComment.userId : null,
      userId: userId,
      reelsId: userID,
      textContent: postComment
    };
    formdata.append('request', JSON.stringify(jsonData));
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('http://localhost:8080/comments/comment-reels', {
        method: 'POST',
        body:formdata,
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });
  
      if (response.ok) {
        setPostComment('');
        setSelectedPostId('');
        setReplyId('');
        toggleReplies(replyId); 
        fetchComments() // Close the reply input
        dispatch(selectPhotoComment(null))
      } else {
        console.log('An error occurred. Please try again later.');
        setPostComment('');
        setSelectedPostId('');
        setReplyId('');
        dispatch(selectPhotoComment(null))
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setPostComment('');
      setSelectedPostId('');
      setReplyId('');
      dispatch(selectPhotoComment(null))
    }
  };

  const shareReel = async (id) => {
    const jsonData = {
      senderId: parseInt(userId),
      recipientId:selectedImageId? selectedImageId : id,
      mediaId: selectedReel?.reelResponse.id,
      content: selectedReel?.reelResponse.content
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
       closeShare()
      } else {
        console.log('An error occurred. Please try again later.');
        setPostComment('');
        setSelectedPostId('');
        setReplyId('');
        dispatch(selectPhotoComment(null))
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setPostComment('');
      setSelectedPostId('');
      setReplyId('');
      dispatch(selectPhotoComment(null))
    }
  };

  console.log(typeof(selectedReel?.reelResponse.content));
  

  const fetchComments = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found in localStorage');
      }
  
      const response = await fetch(`http://localhost:8080/comments/comment-reels/${postId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
 
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch comments: ${response.status} ${errorText}`);
      }
  
      const data = await response.json();
      setDisplayComments(prevComments => ({
        ...prevComments,
        [postId]: data
      }));
    } catch (error) {
      console.error('Error fetching comments:', error.message);
    }
  };

  useEffect(() => {
    if (userID){
   
          fetchComments(userID); // Fetch comments for each post
        
    }
  }, [post]);

const handleOption = ()=>{
  setOption(!option)
}
const handleCommentLikes = async (postId) => {
  const token = localStorage.getItem('token')
  try {
    const response = await fetch(`http://localhost:8080/likes/toggle-comment?commentId=${postId}&userId=${userId}&commentLikeType=REELS_COMMENT_LIKE`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':`Bearer ${token}`
      },
    });

    if (response.ok) {
      fetchReels();

      setAnimationPostId(postId);
      // Re-fetch like count or update locally
      setTimeout(() => setAnimationPostId(null), 300); // Reset animation class
    } else {
      console.log('An error occurred. Please try again later.');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};


const fetchLikes = useCallback(async (postId) => {

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }
    const response = await fetch(`http://localhost:8080/likes/reels/${postId}`, {
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
      console.log(liked)
      console.log(likeCount)
    } else {
      console.error('Failed to fetch likes:', response.status);
    }
  } catch (error) {
    console.error('Error fetching likes:', error);
  }
},[userId,liked,likeCount]);


const likesCount = async (postId) => {
  const token = localStorage.getItem('token')
  try {
    const response = await fetch(`http://localhost:8080/likes/reels/${userID}/count`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      // setLikeCount(prevCounts => ({
      //   ...prevCounts,
      //   [postId]: data 
      // }));
    }
  } catch (error) {
    console.error('Error fetching like count:', error);
  }
};

const userIDObject = userID;
const userIdValue = parseInt(userIDObject.userID, 10);
const fetchUserData =  useCallback(async () => {
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
},[userID,userIdValue]);

useEffect(() => {
  fetchUserData();
}, [fetchUserData]);

useEffect(() => {
  if (userData?.length > 0) {
    userData.forEach(post => {
      if (post.postId) {
        fetchLikes(userID); // Fetch likes for each post
        likesCount(userID); // Fetch like counts for each post
      }
    });
  }
}, [fetchLikes,userData]);

const handleLikes = async (reelsId) => {
  const token = localStorage.getItem('token')
  try {
    const response = await fetch(`http://localhost:8080/likes/toggle-reels?reelsId=${userID}&userId=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' :`Bearer ${token}`
      },
    });

    if (response.ok) {
     fetchReels()
      setAnimationPostId(reelsId);
      // Re-fetch like count or update locally
      const countResponse = await fetch(`http://localhost:8080/likes/reels/${userID}/count`,{
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });
      // const countData = await countResponse.json();
      // setLikeCount(prev => ({
      //   ...prev,
      //   [reelsId]: countData
      // }));
      setTimeout(() => setAnimationPostId(null), 300); // Reset animation class
    } else {
      console.log('An error occurred. Please try again later.');
    }
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};

useEffect(()=>{
fetchLikes(userID)
likesCount(userID)
},[])

const fetchLikedBy = async (postId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }
    const response = await fetch(`http://localhost:8080/likes/reels/${postId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setLikeduser(data)
    } else {
      console.error('Failed to fetch likes:', response.status);
    }
  } catch (error) {
    console.error('Error fetching likes:', error);
  }
};

const handleLike = async (postId) => {
  await handleLikes(postId);
 // Fetch and set like count for the specific post
};

  useEffect(() => {
    fetchReels();
  }, [
  ]);
  
  const fetchUsers = async () => {
    const token = localStorage.getItem('token')
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

  const DeleteReels = async () => {
    const token = localStorage.getItem('token'); // Fixed typo
    try {
      const response = await fetch(`http://localhost:8080/reels//deleteReel/${userId}/${userID}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}` // Added space after "bearer"
        }
      });
      if (response.ok) {
        navigate('/newsfeed')
      } else {
        console.error('Failed to fetch stories:', response.status);
      }
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  return (
    <div>
      {selectedReel &&
        <div className="min-h-screen flex">
          <div className="w-1/2 bg-black min-screen">
            <ReactPlayer
              url={`http://localhost:8080${selectedReel?.reelResponse.content}`}
              controls={true}
              playing={true}
              loop={true}
              width='100%' // Adjust width as needed
              height='100%'
            />
          </div>
          <div className="w-1/2 flex flex-col gap-2 min-screen p-2">
          <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    <img className="border w-9 h-9 rounded-full bg-gray-400" src={`http://localhost:8080${selectedReel?.reelResponse.profileImagePath}`} alt="" />
                    <p className="font-semibold ">{selectedReel?.reelResponse.name}</p>
                  </div>{selectedReel?.reelResponse.userId === userId && <span className="flex flex-col"><Icon onClick={handleOption}  icon="iconamoon:menu-kebab-vertical-bold" />
                  </span>}</div>
                         {option &&(
                    <div className="absolute right-4 flex flex-col">
                      <span className="flex gap-1 cursor-pointer items-center"><Icon icon="mdi:edit-outline" />Edit</span>
                      <span className="flex gap-1 cursor-pointer hover:text-red items-center" onClick={DeleteReels}><Icon icon="mdi:delete-outline" />Delete</span>
                    </div>
                  )}

            <p>{selectedReel?.reelResponse.caption}</p>
            <div className="flex gap-4 items-center"> 
            <div className='flex items-center'>
          <Icon
            onClick={() => handleLike(selectedReel?.id)}
            className={`cursor-pointer h-7 w-7 ${like[selectedReel?.reelResponse.id] ? 'text-pink' : 'text-gray-700'} ${animationPostId === selectedReel?.reelResponse.id ? 'like-animate' : ''}`}
            icon={like[selectedReel?.reelResponse.id] ? "material-symbols-light:favorite" : "material-symbols-light:favorite-outline"}
            width='1.2em'
            height='1.2em'
          /> <span className='cursor-pointer'>{selectedReel?.reelDTO.likeCount || ''}</span>  </div>
      <Icon onClick={() => toggleComment(selectedReel?.reelResponse.id)} className="cursor-pointer h-6 w-6 text-gray-600" icon="iconamoon:comment-light" />
      <Icon onClick={()=>openShare(post)} className='w-6 h-6' icon="ph:share-fat" />
    </div>
    <div className="flex items-center gap-2">{permission?.some(p => p.permission === "CAMERA" && p.status === true) ? <label className="cursor-pointer"><Icon className="w-7 h-7 text-gray-500" icon="mdi:camera-outline" /><input onChange={(e)=>{handleImageChange(e,post.postId)}}  className="absolute opacity-0" type="file" /></label> : <label className="cursor-pointer"><Icon className="w-7 h-7 text-gray-500" icon="mdi:camera-outline" /> </label> }<InputEmoji value={postComment[post.postId]} onChange={(text) => setPostComment(text)} placeholder="Add a comment" /><Icon onClick={handleComment} className='text-cta cursor-pointer' icon="majesticons:send" width="1.5em" height="1.6em" strokeWidth='2' /></div>
{selectedPhotoComments[selectedReel?.id] && <img className='w-28 h-28' src={selectedphotocomment?.name.name} alt={`http://localhost:8080${selectedphotocomment.name}`} />}
<div className='flex flex-col max-h-screen h-full w-full gap-4 overflow-y-auto'>
          {selectedReel?.commentReelsResponse?(
  selectedReel?.commentReelsResponse.map((comment) => {
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
    <div className="">
<div key={comment.id} className='flex  flex-col w-full gap-2'>
<div className='flex flex-col gap-2 justify-between py-2 px-4 shadow-md rounded-3xl'>
<div className=''>
<div className='flex justify-between  w-full items-center'>
  <div className='flex gap-2 items-center' >
<img className='rounded-full h-7 w-7' src={`http://localhost:8082${comment?.profileImagePath}`} alt={post.profilepic} />
<div className='flex flex-col'>
<p className='font-semibold text-sm'>{comment?.name}</p>
<span className='text-xs'>{commenttime}</span>
{comment.imagePath && <img className='w-52 h-44' src={`http://localhost:8080${comment.imagePath}`} />}
</div>
</div>
<div className="flex flex-col items-center relative"> {/* Ensure dropdown menu is positioned correctly */}
              <Icon className="w-4 h-4 cursor-pointer"
                icon="carbon:overflow-menu-vertical"
                onClick={() => toggleCommentDropdown(comment.id)} // Toggle dropdown for specific post
              />
              {commentdropdown === comment.id && (
        <div className="absolute right-0 bg-white text-xxs border border-gray-300 shadow-lg rounded-md mt-6">
        <button  className="block flex items-center px-3 w-full py-2 text-gray-700 hover:bg-gray-100"><Icon icon="tdesign:edit" />Edit</button>
        <button onClick={()=> {deleteComment(comment.id)}}  className="block flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-100"><Icon icon="mdi:delete-outline" />Delete</button>
      </div>
              )}
            </div>
</div>         
</div>
<span className='text-sm'>{comment.textContent}</span>
</div>
{/* {edit ===post.commentId ? <div className='flex items-center'><InputEmoji value={post.comment} onChange={(text)=>setPostComment(text)} /><Icon  onClick={() => handleEditComment(image.id, post.commentId, postComment)} className='text-cta cursor-pointer' icon="majesticons:send" width="1.5em" height="1.6em" strokeWidth='2' /></div> : <span>{post.comment}</span>} */}
<div className='flex items-end px-4 gap-2'>
{/* <Icon onClick={handleLike} className={cursor-pointer h-5 w-5 text-pink}
icon={isClicked ? "material-symbols-light:favorite" : "material-symbols-light:favorite-outline"} width='1.2em' height='1.2em'/>  */}
<div className='flex items-center w-full gap-4 items-center'>
  <div className="flex items-center gap-1">
<Icon onClick={() => handleCommentLikes(comment?.id)}
        className={`cursor-pointer h-7 w-7 ${commentLike[comment.id] ? 'text-red' : 'text-gray-700'} ${animationPostId === post.postId ? 'like-animate' : ''}`}
        icon={commentLike[comment.id] ? "material-symbols-light:favorite" : "material-symbols-light:favorite-outline"}
        width='1.2em'
        height='1.2em'
      />       
<span className='cursor-pointer' onClick={()=>fetchLikedBy(post.postId)}>{commentLikeCount[comment.id] || ''}</span> 
</div>
<Icon onClick={() => toggleReplyInput(comment.id,post.postId)} className="cursor-pointer h-6 w-6 text-gray-600" icon="iconamoon:comment-light" /><span onClick={() => toggleReplies(comment.id)} className='cursor-pointer'>{comment.replies.length>0?<span>{visibleReplies[comment.id] ? 'Hide replies' : 'View replies'} ({comment.replies.length})</span>:<span></span>}</span>
</div>
<span className='text-gray-500 text-sm'></span>
</div>
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
) : (
  <div className="text-gray-500"></div>
)}</div>
          </div>
        </div>
      }
             <Modal  appElement={document.getElementById('root')}
style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          backgroundColor:'transparent',
          transform: 'translate(-30%, -35%)',
          width: '80%',
          height: '100%',
          overflowY: 'auto',
          border:'none'
        },}}
        isOpen={sharePopup} onRequestClose={closeShare}>
          <>
{
  <div className="w-1/2 flex flex-col bg-white gap-2 rounded-md shadow-lg px-4 py-4 relative" key={sharePostId}>
    <button onClick={closeShare} className="absolute top-2 right-2"><Icon onClick={closeShare} icon="ic:round-close" /></button>
    <div className='flex items-center gap-2'><img className='w-11 h-11 rounded-full' src={selectedReel?.reelResponse.profileImagePath} />{selectedReel?.reelResponse.name}    <div onClick={handleDropdown} className="rounded-full p-1 bg-gray-300">{renderPrivacyIcon()}</div></div>
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
<img  onClick={() => handleImageSelect(friend.id)}  className={`w-11 h-11 rounded-full ${
                      selectedImageId === friend.id ? ' border-4 border-cta' : ''
                    }`} src={`http://localhost:8080${friend.profileImagePath}`} />
<span className="text-sm">{friend.name}</span>
</div>
</div>
      ))}

    {/* <span className='text-sm'>{sharePostId?.postResponseDTO?.description}</span> */}
    <button onClick={shareReel} className={`bg-cta absolute right-0 w-max hover:bg-opacity-90 py-2 px-3 ${
                      selectedImageId? '' : 'hidden'
                    } rounded-md text-white font-semibold`}>Send</button>
    </div>

  </div>
}
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
          transform: 'translate(-30%, -35%)',
          width: '80%',
          height: '100%',
          overflowY: 'auto',
          border:'none'
        },}}
        isOpen={friendlistPopup} onRequestClose={closeFriends}>
          <>
{
  <div className="w-1/2 flex flex-col bg-white gap-2 rounded-md shadow-lg px-4 py-4 relative" key={sharePostId}>
    <button onClick={closeFriends} className="absolute top-2 right-2"><Icon onClick={closeFriends} icon="ic:round-close" /></button>
    <div className='flex items-center gap-2'><img className='w-11 h-11 rounded-full' src={selectedReel?.reelResponse.profileImagePath} />{selectedReel?.reelResponse.name}    <div onClick={handleDropdown} className="rounded-full p-1 bg-gray-300">{renderPrivacyIcon()}</div></div>
    <InputEmoji value={shareCaption} onChange={(text)=>setShareCaption(text)} className='' placeholder='Search Friends..' />
    Send to
    <div className='relative rounded-lg flex flex-col border gap-4 p-2 border-gray-200'>
      {myFriends?.friends.map((friend)=>(
        <div className="flex items-center gap-4">

<div className="flex gap-1 items-center">
<img  onClick={() => handleImageSelect(friend.id)}  className={`w-11 h-11 rounded-full ${
                      selectedImageId === friend.id ? ' border-4 border-cta' : ''
                    }`} src={`http://localhost:8080${friend.profileImagePath}`} />
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

export default DisplayReels;
