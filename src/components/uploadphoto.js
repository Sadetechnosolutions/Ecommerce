import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addPhoto, selectPhoto,  } from '../slices/photoslice';
import { IoClose } from "react-icons/io5";
import { removeSelected } from '../slices/photoslice';
import { Icon } from '@iconify/react/dist/iconify.js';
import { v4 as uuidv4 } from 'uuid';
import InputEmoji from "react-input-emoji";
import moment from 'moment';
import { selectPost } from '../slices/postslice';

const Postphoto = ({ close,file }) => {
  const [caption, setCaption] = useState('');
  const [postedTime, setPostedTime] = useState(moment().fromNow());
  const dispatch = useDispatch();
  const { selected } = useSelector((state) => state.post);
  const postedTimeRef = useRef(null);
  const [userData,setUserData] = useState()
  const userId = useSelector((state) => state.auth.userId);

  // const fetchUserName = async () => {
  //   try {
  //     const token = localStorage.getItem('token');

  //     if (!token) {
  //       console.error('No token found in localStorage');
  //       return;
  //     }

  //     const response = await fetch(`http://localhost:8080/posts/${userId}`, {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //       },
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log('Fetched user data:', data); // Log fetched data
  //       setUserData(data);
  //     } else {
  //       console.error('Failed to fetch user data:', response.status);
  //       // Optionally handle different status codes (e.g., unauthorized, not found)
  //     }
  //   } catch (error) {
  //     console.error('Error fetching user data:', error);
  //   }
  // };
  // useEffect(() => {
  //   if (userId) {
  //     fetchUserName();
  //   }
  // }, [userId]);

  useEffect(() => {
    postedTimeRef.current = setInterval(() => {
      setPostedTime(moment().fromNow()); // Update postedTime every minute
    }, 60000);

    return () => clearInterval(postedTimeRef.current); // Clean up the interval on unmount
  }, []);

  const selectedPhoto = (event) => {
    const file = event.target.files[0];
    const fileObject = { name: file.name };
    console.log(fileObject);
    dispatch(selectPhoto(fileObject));
  };

  const handleRemove = ()=>{
    dispatch(removeSelected())
  }

  const photoInfo = {
    id: uuidv4(),
    desc: caption,
    name: selected? selected.url : '',
    postedTime: postedTime,
  };

  const handlePostPhoto = () => {
    console.log(dispatch(addPhoto(photoInfo)));
  };
  const handleSubmit = async (event) => {
    // Create a FormData object for the file uploads and form data
    const formDataObj = new FormData();

    // Append userId and postType to FormData
    formDataObj.append('userId', userId);
    formDataObj.append('postType', 'IMAGE');
    formDataObj.append('imageFile', file);
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
    return (
    <div className='flex w-full h-full items-center justify-center'>
      <div className='w-1/2 h-auto flex flex-col px-4 py-6 gap-4 shadow-lg rounded-md bg-white'>
      <div className='flex items-center justify-between'>
      <p className='font-semibold'>Post Photo</p>
      <div onClick={close} className='cursor-pointer bg-gray-200 p-1 hover:bg-red flex justify-end hover:text-white rounded-full'><IoClose className='h-5 w-5 cursor-pointer'/></div>
      </div>
      <InputEmoji
      onChange={(text)=>setCaption(text)}
      placeholder="Write Something..."
    />
      <div className=''>
        <div className='h-full flex justify-end' >
            {selected?<div className='flex w-full justify-end'><IoClose onClick={handleRemove} className='absolute cursor-pointer p-1 rounded-full bg-black bg-opacity-60 text-white w-6 h-6 ' />
      <img className='w-full h-96' src={`${selected.url}`} alt={`${selected.url}`}/></div> : <div className='flex w-full justify-center'><div className='p-2 cursor-pointer border flex items-center justify-center gap-1 w-1/2 rounded-md border-cta text-cta hover:bg-cta hover:text-white'>
            <label className='cursor-pointer'>
            <span className='flex items-center gap-1'><Icon icon="material-symbols:image-outline" width="1.2em" height="1.2em" />Upload Image</span>
            <input id='uploadphoto' onChange={selectedPhoto} type='file' accept='image/jpeg, image/png' className='absolute  opacity-0 cursor-pointer' />
            </label>
          </div>
          </div> }
        </div>
      </div>
      <div className='flex justify-end items-center gap-4'><button onClick={close} className='px-3 py-2 border border-gray-200 bg-gray-50 text-black rounded-md'>Cancel</button><button onClick={()=>{handleSubmit();close()}} className='px-3 py-2 border border-cta text-cta hover:bg-cta hover:text-white rounded-md'>Post</button></div>
      </div>
      </div>
  )
}

export default Postphoto;
