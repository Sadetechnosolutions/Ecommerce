import React,{useState,useEffect, useCallback} from 'react';
import { Icon } from '@iconify/react';
import {useSelector} from 'react-redux'
import { NavLink } from 'react-router-dom';
import moment from 'moment';

const Notifications = () => {
  const userId = useSelector((state)=>state.auth.userId)
  const [notification,setNotifications] = useState();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedMode);
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found in localStorage');
            return;
        }
      
        const followApi = await fetch(`http://localhost:8080/follows/notifications/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
      
        const requestApi = await fetch(`http://localhost:8080/friend-requests/notifications/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
      
        const likeApi = await fetch(`http://localhost:8080/likes/notification/${userId}`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`,
          },
      });
      
      const commentApi = await fetch(` http://localhost:8080/comments/notification-comment/post-reply/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
      });
  
        const followData = await followApi.json();
        const requestData = await requestApi.json();
        const likeData = await likeApi.json();
        const commentData = await commentApi.json();
  
        // Log the responses to check their structure
        console.log('Follow Notifications:', followData);
        console.log('Friend Request Notifications:', requestData);
  
        const combinedNotifications = [
            ...(Array.isArray(followData.notification) ? followData.notification : []),
            ...(Array.isArray(requestData.notification) ? requestData.notification : []),
            ...(Array.isArray(likeData.notification) ? likeData.notification : []),
            ...(Array.isArray(commentData.notification) ? commentData.notification : [])
        ];
  
        setNotifications(combinedNotifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
    }
  },[userId]);
  
  const deleteNotifications = async (id,type)=>{
    const token = localStorage.getItem('token')
    try{
      const response = await fetch(`http://localhost:8080/notification/${id}/${type}`,{
        method: 'DELETE',
        headers:{
          'Authorization':`Bearer ${token}`
        }
      })
      if(response.ok){
        console.log(`deleted ${type}, ${id}`)
        fetchNotifications()
      }
      }
    catch(error){
     console.error('could not delete',error)
    }
  }



  
  useEffect(() => {
    fetchNotifications()
  },[fetchNotifications])
  
  return (
    <>
    <div className={`flex ${isDarkMode? 'gray-bg' : 'white-bg'} h-[calc(100vh-101px)] overflow-y-auto flex-col`}>
  <div className='flex px-6 drop  rounded-md h-auto flex-col'>
    <div className='flex gap-2 items-center py-4 border-b border-gray-170 '>
      <Icon icon="ion:notifications-outline" width="1.4em" height="1.4em" />
      <span className='font-semibold'>All Notifications</span>
    </div>
    <div>
      {notification?.map((notify) =>{
                  const notifytime = () => {
                    const pastDate = moment(notify.createdAt);
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
              
                  const time = notifytime();
        return(
          <>
    <div key={notify.id} className={`flex cursor-pointer px-2 text-sm ${isDarkMode? 'gray-bg hover:bg-gray-200 hover:text-black' : 'white-bg hover:bg-gray-50'}  notification-item border-b justify-between border-gray-170 py-4 items-center`}>
    <NavLink to={`${notify.postId? `/post/${userId}/${notify.postId}`:``}`}>  
    <div className='flex items-center gap-3'>
              <div>
                <img className='h-9 w-9 rounded-full' alt='' src={`http://localhost:8080${notify.profileImagePath}`} />
              </div>
              <div className='flex flex-col'>
                <p>
                  <span className=' cursor-pointer hover:text-cta'>{notify.name}</span> {notify.message}
                </p>
                <div className='flex items-center'>
                  <div></div>
                  <div className='text-xs'>{time}</div>
                </div>
              </div>
            </div></NavLink>
            <div className='flex items-center gap-4'>
              <div onClick={()=>deleteNotifications(notify.id,notify.type)} className='p-2 cursor-pointer rounded-full hover:bg-gray-400 hover:text-white 500-duration ease-in-ease-out'>
                <Icon icon="carbon:close" width="1.2em" height="1.2em" style={{ color: 'gray-200' }} />
              </div>
            </div>
          </div>
          </>
        )
      })}
    </div>
  </div>
</div>
</>

  )
}

export default Notifications;