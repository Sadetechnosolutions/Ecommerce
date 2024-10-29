import React,{useState,useEffect, useCallback} from 'react';
import { Icon } from '@iconify/react';
import {useSelector} from 'react-redux'

const Notifications = () => {
  const userId = useSelector((state)=>state.auth.userId)
  const [notification,setNotifications] = useState();

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
  
        const followData = await followApi.json();
        const requestData = await requestApi.json();
        const likeData = await likeApi.json();
  
        // Log the responses to check their structure
        console.log('Follow Notifications:', followData);
        console.log('Friend Request Notifications:', requestData);
  
        const combinedNotifications = [
            ...(Array.isArray(followData.notification) ? followData.notification : []),
            ...(Array.isArray(requestData.notification) ? requestData.notification : []),
            ...(Array.isArray(likeData.notification) ? likeData.notification : [])
        ];
  
        setNotifications(combinedNotifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
    }
  },[userId]);
  
  const deleteNotifications = async (id,type)=>{
    try{
      const response = await fetch(`http://localhost:8080/notification/${id}/${type}`,{
        method: 'DELETE'
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
    <div className='flex flex-col'>
  <div className='flex px-6 drop bg-white  rounded-md h-auto flex-col'>
    <div className='flex gap-2 items-center py-4 border-b border-gray-170 '>
      <Icon icon="ion:notifications-outline" width="1.4em" height="1.4em" />
      <span className='font-semibold'>All Notifications</span>
    </div>
    <div>
      {notification?.map((notify) => (
        <div key={notify.id} className='flex cursor-pointer text-sm hover:bg-gray-50 notification-item border-b justify-between border-gray-170 py-4 items-center'>
          <div className='flex items-center gap-3'>
            <div>
              <img className='h-9 w-9 rounded-full' alt='' src={`http://localhost:8080/posts${notify.profileImagePath}`} />
            </div>
            <div className='flex flex-col'>
              <p>
                <span className=' cursor-pointer hover:text-cta'>{notify.name}</span> {notify.message}
              </p>
              <div className='flex items-center'>
                <div></div>
                <div>{notify.time}</div>
              </div>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            {/* <div><img className='w-14 h-14' alt='' src={notify.target} /></div> */}
            <div onClick={()=>deleteNotifications(notify.id,notify.type)} className='p-2 cursor-pointer rounded-full hover:bg-gray-400 hover:text-white 500-duration ease-in-ease-out'>
              <Icon icon="carbon:close" width="1.2em" height="1.2em" style={{ color: 'gray-200' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
</>

  )
}

export default Notifications;


// const notifications = response.notification; 


// const groupedLikes = notifications.reduce((acc, curr) => {
//     const { postId, name } = curr;
//     if (!acc[postId]) {
//         acc[postId] = [];
//     }
//     acc[postId].push(name);
//     return acc;
// }, {});

// const displayMessages = Object.entries(groupedLikes).map(([postId, names]) => {
//     const totalLikes = names.length - 1;
//     const recentLiker = names[0];
//     return `${recentLiker} and ${totalLikes} others liked your post.`;
// });
