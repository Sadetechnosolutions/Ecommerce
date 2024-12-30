import React, { useState, useEffect,useCallback } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";
import InputEmoji from 'react-input-emoji';
import { selectPhotoComment, } from "../slices/photoslice";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Modal from 'react-modal';
import { NavLink } from 'react-router-dom';

const Profession = () => {
  const [comment, setComment] = useState(null);
  const [edit, setEdit] = useState(false);
  const [saved, setSaved] = useState({});
  const [postComment, setPostComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null); // Manage dropdown visibility
  const [commentdropdown,setCommentDropdown] = useState(null);
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
  const [like,setLike] = useState(false);
  const [replylike,setReplyLike] = useState(false);
  const [replyLikeCount,setReplyLikeCount] = useState({})
  const [commentLike,setCommentLike] = useState(false)
  const [commentLikeCount,setCommentLikeCount] = useState({})
  const [likeCount,setLikeCount] = useState({});
  const [postsWithUsernames, setPostsWithUsernames] = useState([]);
  const [users,setUsers] = useState()
  const [animationPostId, setAnimationPostId] = useState(null);
  const [isTooltipVisible, setTooltipVisible] = useState(null);
  const [likeduser,setLikeduser] = useState();
  const [userList,setUserList] = useState();
  const [likedBy,setLikedBy] = useState(null);
  const [file,setFile] = useState()
  const {selectedphotocomment} = useSelector((state)=>state.photo)
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [page, setPage] = useState(0);  // Track page number for pagination
  const [loading, setLoading] = useState(false);  // Track loading state
  const [hasMore, setHasMore] = useState(true);  // Track if more posts are available
  const [intervalId, setIntervalId] = useState(null); 

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedMode);
  }, []);

  const showLikedBy = (id)=>{
    setLikedBy(id)
    fetchLikedBy(id)
    setTooltipVisible(null)
  }

  const closeLikedBy = ()=>{
    setLikedBy(false)
  }

  const handleHoverlike = useCallback((id)=>{
    setTooltipVisible(id)

  },[])
  
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
    return replies.slice().reverse().map(reply => (
      <div key={reply.id} className='flex border py-2 px-4 rounded-3xl flex-col shadow-md w-full gap-2'>
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
    ));
  };


  // const fetchUserList = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await fetch('http://localhost:8080/api/auth/users/descending', {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //       },
  //     });
  //     if (response.ok) {
  //       const data = await response.json();
  //       setUserList(data)
  //     } else {
  //       console.error('Failed to fetch user data:', response.status);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user details:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchUserList();
  // }, []);

  const toggleReplyInput = (commentId,replyid) => {
    setReplyInputVisible(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
    setReplyId(commentId)
    setSelectedPostId(replyid)
  };

  // Fetch user data
  const fetchUserName = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
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
      // fetchUserData(); // Refetch data
      setShouldRefetch(false); // Reset flag
    }
  }, [shouldRefetch]);
  
  useEffect(() => {
    if (userId) {
      fetchUserName();
    }
  }, [userId]);
  // Fetch posts
  useEffect(() => {
    const handleScroll = () => {
      // Check if user has scrolled to the bottom of the page
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        // Trigger fetching more data if not loading and there are more pages
        if (!loading && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    };

    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, hasMore]); 

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found in localStorage');
          return;
        }

        setLoading(true); // Start loading
        const response = await fetch(`http://localhost:8080/aggregate-media/all-posts?page=${page}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();

          if (data.length > 0) {
            // Merge the new posts with the existing posts
            setUserData((prevData) => [...prevData, ...data]);
            // setPage((prevPage) => prevPage + 1);
          }

          // Prepare the updated like states
          const updatedLike = { ...like }; // Copy the previous state to avoid overwriting
          const updatedLikeCount = { ...likeCount };
          const updatedCommentLike = { ...commentLike };
          const updatedCommentLikeCount = { ...commentLikeCount };
          const updatedReplyLike = { ...replylike };
          const updatedReplyLikeCount = { ...replyLikeCount };

          data.forEach((post) => {
            // Track if the user liked the post
            const userHasLikedPost = post.likeDTO.likes.some((like) => like.userId === parseInt(userId));
            updatedLike[post.postResponseDTO.postId] = userHasLikedPost;
            updatedLikeCount[post.postResponseDTO.postId] = post.likeDTO.likesCount || 0;

            // Track comments and their likes
            post.commentResponses.forEach((comment) => {
              const userHasLikedComment = comment.likes.some((like) => like.userId === parseInt(userId));
              updatedCommentLike[comment.id] = userHasLikedComment;
              updatedCommentLikeCount[comment.id] = comment.likeCount || 0;

              // Track replies and their likes
              comment.replies.forEach((reply) => {
                const userHasLikedReply = reply.likes.some((like) => like.userId === parseInt(userId));
                updatedReplyLike[reply.id] = userHasLikedReply;
                updatedReplyLikeCount[reply.id] = reply.likeCount || 0;
              });
            });
          });

          // Update the state with the updated like data
          setLike(updatedLike);
          setLikeCount(updatedLikeCount);
          setCommentLike(updatedCommentLike);
          setCommentLikeCount(updatedCommentLikeCount);
          setReplyLike(updatedReplyLike);
          setReplyLikeCount(updatedReplyLikeCount);

          // If there's no data, there are no more pages
          if (data.length < 2) {
            setHasMore(false);
          }

        } else {
          console.error('Failed to fetch user data:', response.status);
          setHasMore(false); // No more data
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchUserData();
  }, [page, userId]); // Refetch when `page` or `userId` changes // Refetch when `page` or `userId` changes


  // Trigger fetching posts on page load

  const loadMorePosts = () => {
    setPage(prevPage => prevPage + 1); // Increment page to load next batch of posts
  };

  // Infinite scroll logic using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        loadMorePosts(); // Load more posts when the user reaches the bottom
      }
    }, { threshold: 1.0 });

    const sentinel = document.getElementById('sentinel');
    if (sentinel) {
      observer.observe(sentinel); // Observe the sentinel element
    }

    // Cleanup observer on component unmount
    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
    };
  }, []);
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }

      const response = await fetch(`http://localhost:8080/aggregate-media/all-posts?page=0`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.slice().reverse()); // Reverse for chronological order

        const updatedLike = {}; // Store likes for posts
        const updatedLikeCount = {}; // Store like counts for posts

        const updatedCommentLike = {}; // Store likes for comments
        const updatedCommentLikeCount = {}; // Store like counts for comments

        const updatedReplyLike = {}; // Store likes for replies
        const updatedReplyLikeCount = {}; // Store like counts for replies

        data.forEach(post => {
          // Track if the user liked the post
          const userHasLikedPost = post.likeDTO.likes.some(like => like.userId === parseInt(userId));
          updatedLike[post.postResponseDTO.postId] = userHasLikedPost;
          updatedLikeCount[post.postResponseDTO.postId] = post.likeDTO.likesCount || 0;

          // Track comments and their likes
          post.commentResponses.forEach(comment => {
            const userHasLikedComment = comment.likes.some(like => like.userId === parseInt(userId));
            updatedCommentLike[comment.id] = userHasLikedComment;
            updatedCommentLikeCount[comment.id] = comment.likeCount || 0;

            // Track replies and their likes
            comment.replies.forEach(reply => {
              const userHasLikedReply = reply.likes.some(like => like.userId === parseInt(userId));
              updatedReplyLike[reply.id] = userHasLikedReply;
              updatedReplyLikeCount[reply.id] = reply.likeCount || 0;
            });
          });
        });

        // Set state with the updated like data
        setLike(updatedLike);
        setLikeCount(updatedLikeCount);
        setCommentLike(updatedCommentLike);
        setCommentLikeCount(updatedCommentLikeCount);
        setReplyLike(updatedReplyLike);
        setReplyLikeCount(updatedReplyLikeCount);

      } else {
        console.error('Failed to fetch user data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };   

  useEffect(() => {
    if (userData.length && user.length) {
        const userMap = {};
        user.forEach(user => {
            userMap[user.userid] = user.name;
        });

        const updatedPosts = userData.map(post => ({
            ...post,
            userName: userMap[post?.userId] || 'Unknown User' // Fallback if userId not found
        }));

        setPostsWithUsernames(updatedPosts);
    }
}, [userData, user]);

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
        fetchComments(postId);  // Ensure postId is valid and passed correctly
        return postId;
      }
    });
  };
  
  const fetchLikes = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }
      const response = await fetch(`http://localhost:8080/likes/post/like/${postId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        // Check if the logged-in user is in the list of users who liked the post
        const userHasLiked = data?.some(like => like.userId === userId);
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

  const fetchCommentLikes = useCallback(async (commentId) => {

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }
      const response = await fetch(`http://localhost:8080/likes/comments/${commentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        // Check if the logged-in user is in the list of users who liked the post
        const userHasLiked = data?.some(like => like.userId === userId);
        setLike(prev => ({
          ...prev,
          [commentId]: userHasLiked
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
  



  const fetchLikedBy = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }
      const response = await fetch(`http://localhost:8080/likes/post/like/${postId}`, {
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

  const fetchcommentLikedBy = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }
      const response = await fetch(`http://localhost:8080/likes/post/${commentId}`, {
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
          'Authorization' : `Bearer ${token}`
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

  const handleImageChange = (event) => {
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
    const jsonData = {
      postId: selectedPostId,
      parentId: replyId,
      repliedToUserId: parentComment ? parentComment.userId : '',
      userId: userId,
      textContent: postComment
    };
    formdata.append('request', JSON.stringify(jsonData));
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('http://localhost:8080/comments', {
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
      userId();
      setSelectedPostId('');
      setReplyId('');
      dispatch(selectPhotoComment(null))
    }
  };

  useEffect(() => {
    if (userData.length > 0) {
      userData.forEach(post => {
        if (post?.postId) {
          fetchComments(post?.postId); // Fetch comments for each post
          fetchLikes(post?.postId); // Fetch likes for each post
          likesCount(post?.postId);
          fetchLikedBy(post?.postId); // Fetch like counts for each post
        }
      });
    }
  }, [userData]);

  const fetchComments = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found in localStorage');
      }
  
      const response = await fetch(`http://localhost:8080/comments/post/${postId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
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

  // const fetchUsers = async () => {
  //   const token = localStorage.getItem('token')
  //   try {
  //     const response = await axios.get('http://localhost:8080/api/auth/users/descending',{
  //       headers:{
  //         'Authorization':`Bearer ${token}`
  //       }
  //     });
  //     const usersData = response.data.map(user => ({
  //       id: user.id,
  //       UserName: user.name,
  //     }));
  //     setUsers(usersData);
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchUsers();
  // }, []);
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
        // setLiked(prev => ({
        //   ...prev,
        //   [postId]: !prev[postId]
        // }));
        fetchUserData();
        setAnimationPostId(postId);
        // Re-fetch like count or update locally
        // const countResponse = await fetch(`http://localhost:8080/likes/post/${postId}/count`,{
        //   headers:{
        //     'Authorization':`Bearer ${token}`
        //   }
        // });
        // const countData = await countResponse.json();
        // setLikeCount(prev => ({
        //   ...prev,
        //   [postId]: countData
        // }));
        setTimeout(() => setAnimationPostId(null), 1000); // Reset animation class
      } else {
        console.log('An error occurred. Please try again later.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

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

  const likesCommentCount = async (commentId) => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch(`http://localhost:8080/likes/post/${commentId}/count`,{
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setLikeCount(prevCounts => ({
          ...prevCounts,
          [commentId]: data
        }));
      }
    } catch (error) {
      console.error('Error fetching like count:', error);
    }
  };

  useEffect(() => {
    if (userData.length > 0) {
      userData.forEach(post => {
        if (post?.postId) {
          fetchComments(post?.postId); // Fetch comments for each post
          likesCount(post?.postId); // Fetch like counts for each post
        }
      });
    }
  }, [userData]);
  const handleLike = async (postId) => {
    await handleLikes(postId);
 // Re-fetch to update like state
 // Fetch and set like count for the specific post
  };

  const handlecommentLike = async (commentId) => {
    await handlecommentLike(commentId)
    await fetchCommentLikes(commentId) // Re-fetch to update like state
    await likesCommentCount(commentId);
    await fetchcommentLikedBy(commentId) // Fetch and set like count for the specific post
  };

  useEffect(() => {
    if (userData) {
      userData.forEach(post => {
        if (post?.postId) {
          fetchComments(post?.postId); // Fetch comments for each post
        }
      });
    }
  }, [userData]);
  return (
    <form onSubmit={handleSubmit} className={`rounded-md flex flex-col gap-4 ${isDarkMode? 'dark-bg' : 'white-bg'} shadow-lg max-w-[30rem] w-full py-1 `}>
      {userData.filter(post=>post?.postResponseDTO?.postVisibility==='PROFESSIONAL')?.map((post) =>{ 
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
        return(
       <div className={`w-5/3 flex flex-col ${isDarkMode? 'gray-bg' : 'white-bg'} gap-2 rounded-md shadow-lg px-4 py-4 relative`} key={post?.postResponseDTO.postId}>
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
            <NavLink to={`/user/${post?.postResponseDTO.userId}`}><img className="rounded-full w-9 h-9" src={`http://localhost:8080${post?.postResponseDTO.profileImagePath}`} alt="Profile" /></NavLink>
              <div className="flex flex-col">
                <span className="font-semibold">
                <NavLink to={`/user/${post?.postResponseDTO.userId}`}><span key={user.id} className="font-semibold text-sm">{post?.postResponseDTO.name}</span></NavLink>
       </span>
       <div className='flex gap-1 items-center'>
              <span className={`text-xs ${isDarkMode ? 'dark-bg' : 'text-gray-600'} `}>{timeDifference}</span><span>{post?.postResponseDTO.privacySetting ==="PUBLIC" &&<Icon className="w-4 h-4" icon="material-symbols-light:public" /> }{post?.postResponseDTO.privacySetting ==="FRIENDS" &&<Icon className='w-3 h-3' icon="bi:people" />}</span>
                </div>
              </div>
            </div>
{/*       <div className="flex flex-col items-center relative">
                          <Icon
                            className="w-6 h-6 cursor-pointer"
                            icon="carbon:overflow-menu-vertical"
                            onClick={() => toggleDropdown(post?.postId)} 
                          />
                          {showDropdown === post?.postId && (
                            <DropdownMenu
                              onEdit={() => handleEdit(post?.postId)}
                              onDelete={() => {handleDelete(post?.postId);openDelete()}}
                              onClose={() => setShowDropdown(null)} 
                            />
                          )}
                        </div>
                        */}
          </div>
          <span className='text-sm'>{post?.postResponseDTO.description}</span>
          {post?.postResponseDTO.postType === 'IMAGE' ? (
            <img className='w-full h-64' src={`http://localhost:8080${post?.postResponseDTO.imageUrl}`} alt='' />
          ) : post?.postResponseDTO.postType === 'VIDEO' ? (
            <video className='w-full bg-black h-64' controls>
              <source src={`http://localhost:8080${post?.postResponseDTO.videoUrl}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : null}
          <div className='flex items-center'>
          <div className='relative flex items-center'>
      <Icon
        onClick={() => handleLike(post?.postResponseDTO.postId)}
        className={`cursor-pointer h-7 w-7 ${like[post?.postResponseDTO.postId] ? 'text-red' : 'text-gray-700'}  ${!like[post?.postResponseDTO.postId] && isDarkMode? 'text-white':''} ${animationPostId === post?.postResponseDTO.postId ? 'like-animate' : ''}`}
        icon={like[post?.postResponseDTO.postId] ? "material-symbols-light:favorite" : "material-symbols-light:favorite-outline"}
        width='1.2em'
        height='1.2em'
      />       <span className='cursor-pointer' onClick={()=>showLikedBy(post?.postResponseDTO.postId)}>{likeCount[post?.postResponseDTO.postId] || ''}</span> 
      
      <div>
        <p className='w-full text-xl p-4'>
          <span>{handleComment}</span>
        </p>
      </div>
      <div 
        className='cursor-pointer tooltip-container' 

 
      >

       <Modal appElement={document.getElementById('root')}
style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          backgroundColor:'white',
          transform: 'translate(-50%, -20%)',
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          border:'none'
        },}}
        isOpen={likedBy === post?.postResponseDTO.postId} >
          <div className='relative w-96 shadow-lg'>
          <div className=' tooltip text-black p-2  rounded'>
            <ul>
                <li>            {userList
                ?.filter((client) => 
                  likeduser?.some((userlikes) => client.id === userlikes.userId)
                )
                .map((client) => (
                  <div className='flex items-center justify-between'>
                  <span className='flex items-center gap-4 mb-4' key={client.id}>
                    <div className='relative p-1'><img className='w-9 h-9 rounded-full' src={ `http://localhost:8080${client.profileImagePath}` } alt={client.profileImagePath}  />      <Icon   className='text-red absolute bottom-0' 
        icon="material-symbols-light:favorite"
        width='1em'
        height='1em'

      /></div><span>{client.name} </span>

                  </span>
                  <NavLink to={`/user/${client.id}`}><span className='p-2 bg-cta text-white font-semibold rounded-md cursor-pointer'>View Profile</span></NavLink>
                  </div>
                ))
              }</li>
            </ul>
          </div>
          <Icon onClick={closeLikedBy} className='absolute  cursor-pointer top-0 right-2' icon="mdi:remove" />
          </div>
       </Modal>
        {isTooltipVisible === post?.postResponseDTO.postId && likeCount[post?.postResponseDTO.postId] !== 0 && (
          <div className='absolute ml-2 tooltip w-20  bg-white text-black p-2 border border-gray-300 rounded shadow-lg'>
            <ul>
                <li>{userList
                ?.filter((client) => 
                  likeduser?.some((userlikes) => client.id === userlikes.userId)
                )
                .map((client) => (
                  <span key={client.id} style={{ display: 'block' }}>
                    {client.name}
                  </span>
                ))
              }</li>
            </ul>
          </div>
        )}
      </div>  
    </div>
    <div className='flex items-center gap-1'><Icon onClick={() => toggleComment(post?.postResponseDTO.postId)} className={`cursor-pointer h-6 w-6 ${isDarkMode? 'text-white':'white-bg'} `} icon="iconamoon:comment-light" /> { <span>{post.commentResponses?.length}</span> || 0 }</div>
          </div>

          {comment === post?.postResponseDTO.postId && (   <div className="flex items-center gap-2"><label className="cursor-pointer"><Icon className="w-6 h-5 text-gray-500" icon="mdi:camera-outline" /><input onChange={(e)=>{handleImageChange(e)}}  className="absolute opacity-0" type="file" /></label><InputEmoji onChange={(text) => setPostComment(text)} placeholder="Add a comment" /><Icon onClick={handleComment} className='text-cta cursor-pointer' icon="majesticons:send" width="1.5em" height="1.6em" strokeWidth='2' /></div>)}
{selectedphotocomment && <img className='w-28 h-28' src={selectedphotocomment?.name.name} alt={`http://localhost:8080${selectedphotocomment.name}`} />}
          {comment === post?.postResponseDTO.postId && post.commentResponses?(
  post.commentResponses.map((comment) => {
    // const commentUser = users.find(user => user.id === comment.userId);
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
<div key={comment.id} className='flex border px-4 rounded-3xl flex-col shadow-md w-full gap-2'>
<div className='flex justify-between'>
<div className='flex justify-between w-full items-center'>
  <div className='flex gap-2 items-center' >
<img className='rounded-full h-7 w-7' src={`http://localhost:8080${comment?.profileImagePath}`} alt={post?.profilepic} />
<div className='flex flex-col'>
<p className='font-semibold text-xs'>{comment?.name}</p>
<span className='text-xxs'>{commenttime}</span>
{comment.imagePath && <img className='w-52 h-44' src={`http://localhost:8080${comment.imagePath}`} />}
</div>
</div>
<div className="flex flex-col items-center relative"> {/* Ensure dropdown menu is positioned correctly */}
              <Icon className="w-6 h-6 cursor-pointer"
                icon="carbon:overflow-menu-vertical"
                onClick={() => toggleCommentDropdown(comment.id)} // Toggle dropdown for specific post
              />
              {commentdropdown === comment.id && (
        <div className="absolute right-0 bg-white border border-gray-300 shadow-lg rounded-md mt-6">
        <button  className="block flex items-center px-3 w-full py-2 text-gray-700 hover:bg-gray-100"><Icon icon="tdesign:edit" />Edit</button>
        <button onClick={()=> {deleteComment(comment.id)}}  className="block flex items-center w-full px-3 py-2 text-gray-700 hover:bg-gray-100"><Icon icon="mdi:delete-outline" />Delete</button>
      </div>
              )}
            </div>
</div>         
</div>

<span className='text-sm'>{comment.textContent}</span>
{/* {edit ===post?.commentId ? <div className='flex items-center'><InputEmoji value={post?.comment} onChange={(text)=>setPostComment(text)} /><Icon  onClick={() => handleEditComment(image.id, post?.commentId, postComment)} className='text-cta cursor-pointer' icon="majesticons:send" width="1.5em" height="1.6em" strokeWidth='2' /></div> : <span>{post?.comment}</span>} */}
<div className='flex items-end gap-2'>
{/* <Icon onClick={handleLike} className={cursor-pointer h-5 w-5 text-pink}
icon={isClicked ? "material-symbols-light:favorite" : "material-symbols-light:favorite-outline"} width='1.2em' height='1.2em'/>  */}
<div className='flex items-center w-full justify-between'>
<Icon onClick={() => toggleReplyInput(comment.id,post?.postId)} className="cursor-pointer h-5 w-5 text-gray-600" icon="iconamoon:comment-light" /><span onClick={() => toggleReplies(comment.id)} className='cursor-pointer'>{comment.replies.length>0?<span>{visibleReplies[comment.id] ? 'Hide replies' : 'View replies'} ({comment.replies.length})</span>:<span></span>}</span>
</div>
<span className='text-gray-500 text-sm'></span>
</div>

{visibleReplies[comment.id] && renderReplies(comment.replies, post?.postId)}
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
)}

        </div>
      )})}
            {loading && (
        <div className='spinnerContainerStyle'>
          <div className="spinner"></div>
        </div>
      )}
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
    </form>

  );
};

export default Profession;

