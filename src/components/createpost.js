import React, { useState,useEffect } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { selectPost,removeSelected } from '../slices/postslice';
import { useDispatch, useSelector } from 'react-redux';
import InputEmoji from 'react-input-emoji';
import MapSelector from './mapselector';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Createpost = () => {
  const Navigate = useNavigate()
  const dispatch = useDispatch();
  const { selected } = useSelector((state) => state.post);
  const [file, setFile] = useState(null);
  const [postType, setPostType] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [user,setUser] = useState()
  const [description,setDescription] = useState('')
  const userId = useSelector((state) => state.auth.userId);




  const renderMedia = () => {
    if (!selected) return null;
    if (selected.type && selected.type.startsWith('image')) {
      return <div className='relative w-max'><img className='w-48 h-48' src={selected.url} alt='Selected Image' /><Icon onClick={()=>dispatch(removeSelected())} className='absolute right-0 top-0' icon="ic:round-close" /></div>;
    } else if (selected.type && selected.type.startsWith('video')) {
      return <video className='w-36 h-32' controls><source src={selected.url} type={selected.type} /></video>;
    }
    return null;
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    setShowMap(false); // Close the map after selecting the location
  };

  const handleSubmit = async (event) => {
    if (!file && !description) {
        alert("Please provide either a text description or a photo/video.");
        return; // Exit early if neither is present
      }
    event.preventDefault();
    const finalPostType = file ? postType : 'TEXT';
    // Create a FormData object for the file uploads and form data
    const formDataObj = new FormData();

    // Append userId and postType to FormData
    formDataObj.append('userId', userId);
    formDataObj.append('postType', finalPostType);

    // Append the selected file with the correct key
    if (file) {
      if (postType === 'IMAGE') {
        formDataObj.append('imageFile', file); // Append image file
      } else if (postType === 'VIDEO') {
        formDataObj.append('videoFile', file); // Append video file
      }
      // Add other conditions if needed
    }
    if (description) {
      formDataObj.append('description', description); // Append description to FormData
    }
    // Append location if selected
    if (selectedLocation) {
      formDataObj.append('location', JSON.stringify(selectedLocation)); // Convert location object to JSON string
    }

    // Log the FormData object for debugging
    for (let [key, value] of formDataObj.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await fetch('http://localhost:8080/posts', {
        method: 'POST',
        body: formDataObj,
      });

      if (response.ok) {
        setFile(null);
        setPostType('');
        setDescription('');
        setSelectedLocation(null);
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

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/${userId}`, {
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

  const handlePost = ()=>{
    Navigate('/postinfo')
  }

  return (
    <form onSubmit={handleSubmit} className='max-w-[30rem] w-full bg-white rounded-md px-6 flex gap-2 flex-col shadow-lg'>
      <div className='w-full flex items-center gap-2'>
      <img className='w-9 h-9 rounded-full' src={`http://localhost:8080/posts${user?.profileImagePath}`} alt='' />
      <textarea onClick={handlePost} className='w-full p-2 border border-gray-600 rounded-md'
        value={description}
        onChange={setDescription} // Update description state
        placeholder='Write something..'
      />
    </div>
      {/* <div className='flex gap-3'>
        <Icon
          className='w-5 h-5 cursor-pointer'
          icon="carbon:location"
          onClick={() => setShowMap(true)}
        />
        {icons.map((item) => (
          <div className='relative cursor-pointer' key={item.id}>
            <label className='flex cursor-pointer'>
              {item.icon}
              <input
                type='file'
                onChange={(e) => handleImageChange(e, item.type)} // Pass the type here
                accept={item.allowed}
                className='opacity-0 w-0 h-0 bg-black'
              />
            </label>
          </div>
        ))}
      </div> */}
      <div>{renderMedia()}</div>
      {showMap && (
        <MapSelector
          onSelectLocation={handleSelectLocation}
          onClose={() => setShowMap(false)}
        />
      )}
      {/* <button type='submit' className='bg-cta p-2 cursor-pointer text-white text-sm font-semibold rounded-md'>
        Post
      </button> */}
    </form>
  );
};

export default Createpost;
