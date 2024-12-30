import React,{useState} from 'react'
import { useSelector,useDispatch } from 'react-redux';
import { addVideo} from '../slices/videoslice'
import { IoClose } from "react-icons/io5";
import { Player,BigPlayButton } from 'video-react';
import InputEmoji from "react-input-emoji";
import { v4 as uuidv4 } from 'uuid';
import { selectPost } from '../slices/postslice';

const PostVideo = ({close, file}) => {
  const [caption,setCaption] = useState('');
    const dispatch = useDispatch();
    const {selected} = useSelector((state)=>state.post)
    const {videos} = useSelector((state)=>state.video)
    const userId = useSelector((state) => state.auth.userId);

    const videoInfo = {
      id:uuidv4(),
      name:selected? selected.url : '',
      desc:caption,
      postedTime:'1 sec ago'
    }

    const handlePostVideo = ()=>{
      console.log(dispatch(addVideo(videoInfo)))
      console.log(videos);
    }
    const handleSubmit = async (event) => {
      // Create a FormData object for the file uploads and form data
      const formDataObj = new FormData();
  
      // Append userId and postType to FormData
      formDataObj.append('userId', userId);
      formDataObj.append('postType', 'VIDEO');
      formDataObj.append('videoFile', file);
      // Append the selected file with the correct key
        // Add other conditions if needed
        if (caption) {
          formDataObj.append('description', caption); // Append description to FormData
        }
  
      // Log the FormData object for debugging
      for (let [key, value] of formDataObj.entries()) {
        console.log(`${key}:`, value);
      }
      const token = localStorage.getItem('token')
      try {
        const response = await fetch('http://localhost:8080/posts', {
          method: 'POST',
          body: formDataObj,
          headers:{
            'Authorization':`Bearer ${token}`
          }
        });
  
        if (response.ok) {
          setCaption('');
          dispatch(selectPost(null));
          const data = await response.json();
          console.log('API Response Data:', data); // Log the response for debugging
        } else {
          // Log detailed error message
          const errorText = await response.text();
          console.error('Error:', response.status, errorText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  return(
    <div className='flex w-full h-full items-center justify-center'>
      <div className='w-1/2 h-auto flex flex-col px-4 py-6 gap-4 shadow-lg rounded-md bg-white'>
      <div className='flex items-center justify-between'>
      <p className='font-semibold'>Post Video</p>
      <div onClick={close} className='cursor-pointer bg-gray-200 p-1 hover:bg-red flex justify-end hover:text-white rounded-full'><IoClose className='h-5 w-5 cursor-pointer'/></div>
      </div>
      < InputEmoji onChange={(text)=>setCaption(text)} placeholder='Write Something...' />
      <div className='bg-black'>
        <div className='h-full bg-black'>
        <Player controls className='w-full h-full' ><source src={`${selected.url}`} /><BigPlayButton position='center'/></Player>
        </div>
      </div>
      <div className='flex justify-end items-center gap-4'><button onClick={close} className='px-3 py-2 border border-gray-200 bg-gray-50 text-black rounded-md'>Cancel</button><button onClick={()=>{handleSubmit();close()}} className='px-3 py-2 border border-cta text-cta hover:bg-cta hover:text-white rounded-md'>Post</button></div>
      </div>
      </div>
  )
}

export default PostVideo;
