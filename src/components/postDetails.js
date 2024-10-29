import React,{useState} from "react";
import InputEmoji from 'react-input-emoji';
import { Icon } from "@iconify/react/dist/iconify.js";
import { useSelector,useDispatch } from "react-redux";
import { selectPost,removeSelected } from '../slices/postslice';
import Modal from 'react-modal'
const Postinfo = ()=>{
    const dispatch = useDispatch()
    const { selected } = useSelector((state) => state.post);
    const [file, setFile] = useState(null);
    const [postType, setPostType] = useState('');
    const [showMap, setShowMap] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [user,setUser] = useState()
    const [description,setDescription] = useState('')
    const userId = useSelector((state) => state.auth.userId);
    const [visibility, setVisibility] = useState('PERSONAL');
    const [privacy,setPrivacy] =useState('PUBLIC')
    const [privacydropdown,setPrivacydropdown] = useState(false)
    // Handle the change event
    const handleChange = (event) => {
      setVisibility(event.target.value);
    };

    const handleDropdown = ()=>{
        setPrivacydropdown(true)
    }

    const closeDropdown = ()=>{
        setPrivacydropdown(false)
    }

    const handlePrivacySelect = (selectedPrivacy) => {
        setPrivacy(selectedPrivacy);
        closeDropdown();
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
        formDataObj.append('privacySetting', privacy);
        formDataObj.append('postVisibility', visibility);
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

    const img = <Icon className='w-6 h-5' icon="ph:image" />;
    const video = <Icon className='w-6 h-5' icon="bx:video" />;
    const files = <Icon className='w-6 h-5' icon="ic:baseline-attach-file" />;
    const reels = <Icon className='w-6 h-5' icon="icon-park-outline:video-two" />;
    const handleImageChange = (event, type) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
          const reader = new FileReader();
          reader.onload = () => {
            const selectedData = {
              url: reader.result,
              type: selectedFile.type,
            };
            dispatch(selectPost(selectedData)); // Dispatch action with the selected file data
            setFile(selectedFile); // Store the file object
            setPostType(type); // Set postType based on the selected type
          };
          reader.readAsDataURL(selectedFile); // Read the file as a data URL
        }
      };
      const renderMedia = () => {
        if (!selected) return null;
        if (selected.type && selected.type.startsWith('image')) {
          return <div className='relative w-max'><img className='w-48 h-48' src={selected.url} alt='Selected Image' /><Icon onClick={()=>dispatch(removeSelected())} className='absolute right-0 top-0' icon="ic:round-close" /></div>;
        } else if (selected.type && selected.type.startsWith('video')) {
          return <video className='w-36 h-32' controls><source src={selected.url} type={selected.type} /></video>;
        }
        return null;
      };
    const icons = [
      {
        id: 1,
        icon: img,
        allowed: 'image/*',
        type: 'IMAGE',  // Use a human-readable type
      },
      {
        id: 2,
        icon: video,
        allowed: 'video/*',
        type: 'VIDEO',  // Use a human-readable type
      },
      {
        id: 3,
        icon: reels,
        allowed: 'video/*',
        type: 'REELS',  // Use a human-readable type
      },
      {
        id: 4,
        icon: files,
        allowed: '',
        type: 'FILE',  // Generic file type
      },
    ];
    return(
    <>
    <div className="flex flex-col p-4 max-w-[30rem] w-full gap-4">
        <div className="flex items-center gap-2">
    <div >
      <select className="border border-black rounded-md"
        id="visibility-select"
        value={visibility}
        onChange={handleChange}
      >
        <option value="PERSONAL">Personal</option>
        <option value="PROFESSIONAL">Professional</option>
      </select>
    </div>
    <div onClick={handleDropdown} className="rounded-full p-1 bg-gray-300">{renderPrivacyIcon()}</div>
    </div>
    <InputEmoji />
          <div className='flex gap-3'>
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
      </div>
      <div>{renderMedia()}</div>
            <button onClick={handleSubmit} className='bg-cta p-2 cursor-pointer text-white text-sm font-semibold rounded-md'>
        Post
      </button>
      <Modal appElement={document.getElementById('root')}
style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          backgroundColor:'white',
          transform: 'translate(-45%, -20%)',
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          border:'none'
        },}}
        isOpen={privacydropdown} onRequestClose={closeDropdown} >
        <div className="flex flex-col p-2 gap-2 shadow-lg max-w-[20rem] w-full">
            <div onClick={() => handlePrivacySelect('PUBLIC')} className="flex items-center gap-2"><Icon className="w-5 h-5" icon="material-symbols-light:public" /><span>Public</span></div>
            <div onClick={() => handlePrivacySelect('FRIENDS')} className="flex items-center gap-2"><Icon className='w-4 h-4' icon="fa-solid:user-friends" /><span>Friends</span></div>
        </div>

      </Modal>
    </div>
    </>
    )
}

export default Postinfo