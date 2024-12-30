import React, { useState, useEffect,useCallback } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";
import InputEmoji from 'react-input-emoji';
import { selectPhotoComment, } from "../slices/photoslice";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { useParams } from 'react-router-dom';

const Displaypost = () => {
  const [comment, setComment] = useState(null);
  const [postComment, setPostComment] = useState('');
  const [edit, setEdit] = useState(false);
  const [saved, setSaved] = useState({});
  const [post, setPost] = useState();
  const [commentdropdown, setCommentDropdown] = useState(null);
  const [visibleReplies, setVisibleReplies] = useState({});
  const {selectedphotocomment} = useSelector((state)=>state.photo)
  const [showDropdown, setShowDropdown] = useState(null); // Manage dropdown visibility
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);
  const [deletePopup,setDeletePopup] = useState(false)
  const [deleteId,setDeleteId] = useState('')
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [replyInputVisible, setReplyInputVisible] = useState({}); 
  const [replyId,setReplyId] = useState('');
  const [nestedVisibleReplies, setNestedVisibleReplies] = useState({});
  const [like,setLike] = useState(false);
  const [replylike,setReplyLike] = useState(false);
  const [replyLikeCount,setReplyLikeCount] = useState({})
  const [commentLike,setCommentLike] = useState(false)
  const [commentLikeCount,setLikeCommentCount] = useState({})
  const [likeCount,setLikeCount] = useState({});
  const [animationPostId, setAnimationPostId] = useState(null);
  const [isTooltipVisible, setTooltipVisible] = useState(null);
  const [likeduser,setLikeduser] = useState();
  const [likedBy,setLikedBy] = useState(null);
  const [file,setFile] = useState()
  const {postID} = useParams();
  const [option,setOption] = useState(false)
  const [selectedPhotoComments, setSelectedPhotoComments] = useState({}); 
  const [type,setType] = useState('')
  const [permission,setPermission] = useState();
  const [permissionPopup,setPermissionPopup] = useState(false)

  const handleOption = ()=>{
    setOption(!option)
  }

  const showLikedBy = (id)=>{
    fetchLikedBy(id)
    setTooltipVisible(null)
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
          <div className='flex w-auto justify-between'>
          <div className='flex items-center'>
<Icon onClick={() => handleCommentLikes(reply?.id)}
        className={`cursor-pointer h-7 w-7 ${replylike[reply?.id] ? 'text-red' : 'text-gray-700'} ${animationPostId === reply?.id ? 'like-animate' : ''}`}
        icon={replylike[reply?.id] ? "material-symbols-light:favorite" : "material-symbols-light:favorite-outline"}
        width='1.2em'
        height='1.2em'
      />       
<span className='cursor-pointer' onClick={()=>showLikedBy(post?.postId)}>{replyLikeCount[reply?.id] || ''}</span> 
</div>
          <Icon 
            onClick={() => toggleReplyInput(reply.id, postId)} 
            className="cursor-pointer h-6 w-6 text-gray-600" 
            icon="iconamoon:comment-light" 
          />
      
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
            className='cursor-pointer text-sm'
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


  const toggleReplyInput = (commentId,replyid) => {
    setReplyInputVisible(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
    setReplyId(commentId)
    setSelectedPostId(replyid)
  };

  useEffect(() => {
    if (shouldRefetch) {
      fetchUserData(); // Refetch data
      setShouldRefetch(false); // Reset flag
    }
  }, [shouldRefetch]);
  
  // Fetch posts
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }
  
      const response = await fetch(`http://localhost:8080/aggregate-media/post/${postID}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setPost(data);
  
        const userHasLiked = data?.likeDTO.likes.some(like => like.userId === parseInt(userId));
        setLike(prev => ({
          ...prev,
          [data?.postResponseDTO.postId]: userHasLiked,
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
        data.commentResponses.forEach(comment => {
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
          [data?.postResponseDTO.postId]: data?.likeDTO.likes.length || 0,
        }));
      } else {
        console.error('Failed to fetch user data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  

  
  useEffect(() => {
      fetchUserData();
  }, []);

//   useEffect(() => {
//     if (post?.length && user.length) {
//         const userMap = {};
//         user.forEach(user => {
//             userMap[user.userid] = user.name;
//         });

//         const updatedPosts = post?.map(post => ({
//             ...post,
//             userName: userMap[post?.userId] || 'Unknown User' // Fallback if userId not found
//         }));

//         setPostsWithUsernames(updatedPosts);
//     }
// }, [post, user]);

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

  const toggleCommentDropdown = (commentId)=>{
    setCommentDropdown(prev => (prev === commentId? null : commentId))
  }


  const toggleComment = (postId) => {
    setComment(prev => {
      if (prev === postId) {
        return null;
      } else {
        setSelectedPostId(postId)
        // fetchComments(postId);
        return postId;
      }
    });
  };
  const fetchLikedBy = async (postId) => {
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
        setLikeduser(data)
      } else {
        console.error('Failed to fetch likes:', response.status);
      }
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   const token = localStorage.getItem('token')
    try {
      const response = await fetch(`http://localhost:8080/posts/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${token}`
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
    const parentComment = post?.commentResponses[selectedPostId]?.find(comment => comment.id === replyId);
    const formdata = new FormData();
    formdata.append('file',selectedphotocomment?.name)
    const jsonData = {
      postId: postID,
      parentId: replyId,
      repliedToUserId: parentComment ? parentComment.userId : '',
      userId: userId,
      textContent: postComment
    };
    formdata.append('request', JSON.stringify(jsonData));
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('http://localhost:8080/comments/comment-post', {
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
        // fetchComments() // Close the reply input
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

  useEffect(() => {
    if (post?.length > 0) {

        if (post?.postId) {
          // fetchComments(post?.postId); // Fetch comments for each post
          // fetchLikes(post?.postId); // Fetch likes for each post
          // likesCount(post?.postId);
          fetchLikedBy(post?.postId); // Fetch like counts for each post
        }
    }
  }, [post]);

  // const fetchComments = async (postId) => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     if (!token) {
  //       throw new Error('No token found in localStorage');
  //     }
  
  //     const response = await fetch(`http://localhost:8080/comments/post/${postId}`, {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //     });
  
  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       throw new Error(`Failed to fetch comments: ${response.status} ${errorText}`);
  //     }
  
  //     const data = await response.json();
  //     setDisplayComments(prevComments => ({
  //       ...prevComments,
  //       [postId]: data
  //     }));
  //   } catch (error) {
  //     console.error('Error fetching comments:', error.message);
  //   }
  // };

  const closePermission = ()=>{
    setPermissionPopup(false)
 }


  const fetchPermission = useCallback(async ()=>{
    const token = localStorage.getItem('token')
    try{
         const response = await fetch(` http://localhost:8080/permissions/get-status/${userId}`,{
         method:'GET',
         headers:{
            'Authorization':`Bearer ${token}`,
         }
        })
        if(response.ok){
        const data = await response.json()
        setPermission(data)
        }
        else{
          console.log('failed to post')
          setType('')
        }  
    }
    catch(error){
        console.log(error);
        setType('')
    }
},[userId])

useEffect(()=>{
    fetchPermission();
},[fetchPermission])

const handlePermission =async ()=>{
  const token = localStorage.getItem('token')
  const payload={
      userId:1,
      permission:"CAMERA",
      status:true
  }
  try{
       const response = await fetch(`http://localhost:8080/permissions/grant`,{
       method:'POST',
       body: JSON.stringify(payload),
       headers:{
          'Authorization':`Bearer ${token}`,
          'Content-Type': 'application/json',
       }
      })
      if(response.ok){
       fetchPermission();
       closePermission()
      }
      else{
        console.log('failed to post')
        setType('')
      }  
  }
  catch(error){
      console.log(error);
      setType('')
  }
}
  const handleLikes = async (postId) => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`http://localhost:8080/likes/toggle?postId=${postId}&userId=${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${token}`
        },
      });

      if (response.ok) {
        fetchUserData();

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

  const handleCommentLikes = async (postId) => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`http://localhost:8080/likes/toggle-comment?commentId=${postId}&userId=${userId}&commentLikeType=POST_COMMENT_LIKE`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${token}`
        },
      });

      if (response.ok) {
        fetchUserData();

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

  console.log(post?.postResponseDTO.postType);
console.log(post?.postResponseDTO.imageUrl);
console.log(post?.postResponseDTO.videoUrl);

  useEffect(() => {
    if (post?.length > 0) {
  
        if (post?.postId) {
          // fetchComments(post?.postId); // Fetch comments for each post
          // likesCount(post?.postId); // Fetch like counts for each post
        }

    }
  }, [post]);
  const handleLike = async (postId) => {
    await handleLikes(postId);
    // await fetchLikes(postId); // Re-fetch to update like state
    // await likesCount(postId);
    await fetchLikedBy(postId) // Fetch and set like count for the specific post
  };


  // useEffect(() => {
  //   if (post){
   
  //       if (post?.postId) {
  //         // fetchComments(post?.postId); // Fetch comments for each post
  //       }

  //   }
  // }, [post]);

  
  const calculateTimeDifference = () => {
    const pastDate = moment(post?.postResponseDTO.createdAt);
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



  return (
    <div className='max-w-[30rem] w-full h-auto flex flex-col'>

            <div className="">
          {post?.postResponseDTO.postType === 'IMAGE' ? (
            <img className='w-full h-48' src={`http://localhost:8080${post?.postResponseDTO.imageUrl}`} alt={`http://localhost:8080${post?.postResponseDTO.imageUrl}`} />
          ) : post?.postResponseDTO.postType === 'VIDEO' ? (
            <video className='w-full h-48 bg-black' controls>
              <source src={`http://localhost:8080${post?.postResponseDTO.videoUrl}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : null}
</div>
<div className="relative flex flex-col gap-2 p-4">
          <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    <img className="border w-9 h-9 rounded-full bg-gray-400" src={`http://localhost:8080${post?.postResponseDTO.profileImagePath}`} alt={`http://localhost:8080${post?.postResponseDTO.profileImagePath}`}  />
                    <p className="font-semibold ">{post?.postResponseDTO.name}</p>
                  </div>{post?.postResponseDTO.userId === userId && <span className="flex flex-col"><Icon onClick={handleOption}  icon="iconamoon:menu-kebab-vertical-bold" />
 
                  </span>}</div>
                         {option &&(
                    <div className="absolute right-4 flex flex-col">
                      <span className="flex gap-1 cursor-pointer items-center"><Icon icon="mdi:edit-outline" /> Edit</span>
                      <span className="flex gap-1 cursor-pointer hover:text-red items-center"><Icon icon="mdi:delete-outline" />Delete</span>
                    </div>
                  )}
            <p>{post?.postResponseDTO.description}</p>
  <div className='flex items-center gap-6'>
          <div className='relative flex  items-center'>
      <Icon
        onClick={() => handleLike(post?.postResponseDTO.postId)}
        className={`cursor-pointer h-7 w-7 ${like[post?.postResponseDTO.postId] ? 'text-red' : 'text-gray-700'} ${animationPostId === post?.postResponseDTO.postId ? 'like-animate' : ''}`}
        icon={like[post?.postResponseDTO.postId] ? "material-symbols-light:favorite" : "material-symbols-light:favorite-outline"}
        width='1.2em'
        height='1.2em'
      />       <span className='cursor-pointer' onClick={()=>showLikedBy(post?.postResponseDTO.postId)}>{likeCount[post?.postResponseDTO.postId] || ''}</span> 
      
    </div>
    <Icon onClick={() => toggleComment(post?.postResponseDTO.postId)} className="cursor-pointer h-6 w-6 text-gray-600" icon="iconamoon:comment-light" />
    </div>
{selectedPhotoComments[post?.postResponseDTO.postId] && <img className='w-28 h-28' src={selectedphotocomment?.name.name} alt={`http://localhost:8080${selectedphotocomment.name}`} />}
<div className='flex flex-col w-full gap-4'>
  {/* Apply a height or max-height to the scrollable content container */}
  <div className='flex-1 overflow-y-auto max-h-[calc(100vh-480px)]'> {/* Example max height */}
    {post?.commentResponses ? (
      post?.commentResponses.map((comment) => {
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
        return (
          <div key={comment.id} className='flex flex-col w-full gap-2'>
            <div className='flex flex-col gap-2 justify-between py-2 px-4 shadow-md rounded-3xl'>
              <div className=''>
                <div className='flex justify-between w-full items-center'>
                  <div className='flex gap-2 items-center'>
                    <img className='rounded-full h-7 w-7' src={`http://localhost:8080${comment.profileImagePath}`} alt={post?.profilepic} />
                    <div className='flex flex-col'>
                      <p className='font-semibold text-sm'>{comment?.name}</p>
                      <span className='text-xs'>{commenttime}</span>
                      {comment.imagePath && <img className='w-52 h-44 object-cover' src={`http://localhost:8080${comment.imagePath}`} />}
                    </div>
                  </div>
                  <div className="flex flex-col items-center relative">
                    <Icon className="w-4 h-4 cursor-pointer" icon="carbon:overflow-menu-vertical" onClick={() => toggleCommentDropdown(comment.id)} />
                    {commentdropdown === comment.id && (
                      <div className="absolute right-0 bg-white text-xxs border border-gray-300 shadow-lg rounded-md mt-6">
                        <button className="block flex items-center px-3 w-full py-2 text-gray-700 hover:bg-gray-100"><Icon icon="tdesign:edit" />Edit</button>
                        <button onClick={() => { deleteComment(comment.id) }} className="block flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-100"><Icon icon="mdi:delete-outline" />Delete</button>
                      </div>
                    )}
                  </div>
                </div>
                <span className='text-sm'>{comment.textContent}</span>
              </div>

              <div className='flex items-end px-4 gap-2'>
                <div className='flex items-center w-full gap-2'>
                  <div className='flex items-center'>
                    <Icon onClick={() => handleCommentLikes(comment?.id)} className={`cursor-pointer h-7 w-7 ${commentLike[comment?.id] ? 'text-red' : 'text-gray-700'} ${animationPostId === comment?.id ? 'like-animate' : ''}`} icon={commentLike[comment?.id] ? "material-symbols-light:favorite" : "material-symbols-light:favorite-outline"} width="1.2em" height="1.2em" />
                    <span className='cursor-pointer' onClick={() => showLikedBy(post?.postId)}>{commentLikeCount[comment?.id] || ''}</span>
                  </div>
                  <Icon onClick={() => toggleReplyInput(comment.id, post?.postId)} className="cursor-pointer h-6 w-6 text-gray-600" icon="bi:reply" />
                </div>
                <span onClick={() => toggleReplies(comment.id)} className='cursor-pointer text-sm w-40'>
                  {comment.replies.length > 0 ? <span>{visibleReplies[comment.id] ? 'Hide replies' : 'View replies'} ({comment.replies.length})</span> : <span></span>}
                </span>
                <span className='text-gray-500 text-sm'></span>
              </div>

              {visibleReplies[comment.id] && renderReplies(comment.replies, post?.postId)}
              {replyInputVisible[comment.id] && (
                <div className="flex items-center gap-2 mt-2">
                  <InputEmoji value={postComment} onChange={(text) => setPostComment(text)} placeholder="Write a reply..." />
                  <Icon onClick={handleComment} className='text-cta cursor-pointer' icon="majesticons:send" width="1.5em" height="1.6em" strokeWidth="2" />
                </div>
              )}
            </div>
          </div>
        );
      })
    ) : (
      <div className="text-gray-500">No comments yet...</div>
    )}
  </div>
</div>

  <div className="fixed flex bg-white bottom-0 w-96 items-center">{permission?.some(p => p.permission === "CAMERA" && p.status === true) ? <label className="cursor-pointer"><Icon className="w-7 h-7 text-gray-500" icon="mdi:camera-outline" /><input onChange={(e)=>{handleImageChange(e,post?.postResponseDTO.postId)}}  className="absolute opacity-0" type="file" /></label> : <label className="cursor-pointer"><Icon className="w-7 h-7 text-gray-500" icon="mdi:camera-outline" /> </label> }<InputEmoji value={postComment[post?.postResponseDTO.postId]} onChange={(text) => setPostComment(text)} placeholder="Add a comment" /><Icon onClick={handleComment} className='text-cta cursor-pointer' icon="majesticons:send" width="1.5em" height="1.6em" strokeWidth='2' /></div>

    </div>

    </div>
  );
};

export default Displaypost;
