import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react/dist/iconify.js";

const Friendrequest = ()=>{
    const [request,setRequest] =useState()
    const userId = useSelector((state)=>state.auth.userId)
    const [requestCount,setRequestCount] = useState()
    
    const fetchRequest = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            console.error('No token found in localStorage');
            return;
          }
          const response = await fetch(`http://localhost:8080/friend-requests/${userId}/pending-requests`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
        
          if (response.ok) {
            const data = await response.json();
            setRequest(data);
            setRequestCount(data.pendingCount)
    
          } else {
            console.error('Failed to fetch user data:', response.status);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
        };
    
    
        const acceptRequest = async (acceptID)=>{
          const token = localStorage.getItem('token')
          const payload={
            senderId:userId,
            recipientId:acceptID
          }
          try{
            const response = await fetch(`http://localhost:8080/friend-requests/accept?senderId=${acceptID}&recipientId=${userId}`,{
              method:'POST',
              headers:{
                'Authorization':`bearer${token}`
              },
              body:JSON.stringify(payload)
            })
            if(response.ok){
              console.log('')
              fetchRequest()
            }
            else{
              console.log('error in posting data')
            }
          }
          catch(error){
            console.error(error)
          }
        }
    
        const cancelRequest = async (cancelID)=>{
          const token = localStorage.getItem('token')
          const payload={
            senderId:userId,
            recipientId:cancelID
          }
          try{
            const response = await fetch(`http://localhost:8080/friend-requests/decline?senderId=${cancelID}&recipientId=${userId}`,{
              method:'POST',
              headers:{
                'Authorization':`bearer${token}`
              },
              body:JSON.stringify(payload)
            })
            if(response.ok){
              console.log('')
              fetchRequest()
            }
            else{
              console.log('error in posting data')
            }
          }
          catch(error){
            console.error(error)
          }
        }
        useEffect(()=>{
            fetchRequest()
        },[fetchRequest])
    return(
<>
<div className="max-w-[30rem] flex flex-col w-full bg-white">

  <div className='flex absolute sticky top-0 bg-white justify-between items-center text-sm py-2 px-4'><p>Requests</p></div>
  {request?.pendingCount===0 && (
    <>
    <div className='flex items-center justify-center'>
      <p>No Requests</p></div></>
  )}
{request?.pendingRequests.map((item) => (
                        <div key={item.id} className=" text-sm notification-item text-gray-800 flex flex-col hover:bg-gray-50 justify-between cursor-pointer">
                          <div className='flex flex-col px-4 h-20 border:gray-300 py-4  border-b text-sm '>
                          <div className='flex justify-between items-center justify-center'>
                            <div className='flex gap-2 items-center'>
                          <img className='rounded-full w-8 h-8' alt='alt' src='profile.jpg' />
                          <div className='flex flex-col '><div className='hover:text-cta'>{item.senderName}</div> <div className='text-gray-400 text-[12px]'>{}</div></div>
                          </div>
                          <div className='flex items-end flex-col '>
                         <div className='flex gap-5'>
                          <button onClick={()=>{acceptRequest(item.senderId)}} className=" text-sm">
                          <Icon className='hover:text-cta text-gray-500' icon="mdi:people-tick" width="1.4em" height="1.4em" /></button>                
                           <button onClick={()=>{cancelRequest(item.senderId)}} className='text-sm hover:text-red'><Icon icon="material-symbols-light:delete" width="1.2em" height="1.2em" /></button>
                          </div>
                          <div className=' text-gray-400 text-time'>{item.time}</div>
                          </div>
                          </div>
                          </div>
                        </div>
                      ))}
           
                    <div className='flex  justify-center items-center'>
                    {/* {request?.pendingCount >=5 && (
  <button className="flex w-full items-center justify-center text-cta hover:bg-gray-100 text-sm py-1.5 px-4">
  </button>
)} */}
                    </div>
                  </div>
</>
    )
}

export default Friendrequest