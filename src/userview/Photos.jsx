import React, { useState,useEffect, useCallback } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useDispatch,useSelector } from 'react-redux'
import Postphoto from '../components/uploadphoto'
import { IoClose } from "react-icons/io5";
import Modal from 'react-modal';
import Uploadfolder from '../components/uploadfolder'
import Createalbum from '../components/createalbum'
import { NavLink } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { selectPost } from '../slices/postslice';

const Photos = () => {
  const [uploadPhoto, showuploadPhoto] = useState(false);
  const [postPhoto,showPost] = useState(false);
  const [Folder,showUploadFolder] = useState(false);
  const [createAlbum,showCreateAlbum] = useState(false);
  const [images,setImages] = useState()
  const [file, setFile] = useState(null);
  const [likeCount,setLikeCount] = useState({});
  const [like,setLike] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedMode);
  }, []);

  const openCreateAlbum = ()=>{
    showCreateAlbum(true);
    closeuploadPhoto()
  }
  
  const userId = useSelector((state) => state.auth.userId);
  const { userID } = useParams();

  const dispatch = useDispatch();

  const openPostPhoto = ()=>{
    showPost(true);
    closeuploadPhoto();
  }

  const openUploadFolder = ()=>{
    showUploadFolder(true);
    closeuploadPhoto()
  }

  const fetchLikes = useCallback(async (postId) => {
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
        // Check if the logged-in user is in the list of users who liked the post
        const userHasLiked = data.some(like => like.userId === userId);
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
  },[like,userId]);

  const likesCount = useCallback(async (postId) => {
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
  },[likeCount]);

  const openuploadPhoto = () => {
    showuploadPhoto(true);
  };

  const closePopups = ()=>{
    showUploadFolder(false);
    showPost(false);
    showuploadPhoto(false);
    showCreateAlbum(false);
  }

  const closeuploadPhoto = () => {
    showuploadPhoto(false);
  };

  const fetchImage = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }
      const response = await fetch(`http://localhost:8080/posts/user/${userID}/images`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setImages(data);  // This should trigger a re-render
      } else {
        console.error('Failed to fetch user Image:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user Image:', error);
    }
  },[userID]);

  useEffect(() => {
    if (images?.length > 0) {
      images.forEach(post => {
        if (post.postId) {
          fetchLikes(post.postId);  // Fetch if user has liked the post
          likesCount(post.postId);  // Fetch total likes count for the post
        }
      });
    }
  }, []);
  
  
  useEffect(() => {
      fetchImage();
  },[]);
  
            const handleImageChange = (event) => {
              const selectedFile = event.target.files[0];
              if (selectedFile) {
                const reader = new FileReader();
                reader.onload = () => {
                  const selectedData = {
                    url: reader.result,
                    type: 'IMAGE',
                  };
                  dispatch(selectPost(selectedData)); // Dispatch action with the selected file data
                  setFile(selectedFile); 
                  openPostPhoto();// Store the file object
                // Set postType based on the selected type
                };
                reader.readAsDataURL(selectedFile); // Read the file as a data URL
              }
            };
  return (
    <>
    <div className={`max-w-[30rem] ${isDarkMode? 'gray-bg' : 'white-bg'} w-full`}>
    <Modal appElement={document.getElementById('root')}
    style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          backgroundColor:'transparent',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          height: '60%',
          overflowY: 'auto',
          border:'none'
        },}}
  isOpen={uploadPhoto} onRequestClose={closeuploadPhoto}>
        <div className='flex max-w-[28rem] w-full rounded-md items-center justify-center'>
      <div className=' w-full flex flex-col p-4 gap-4 shadow-lg rounded-md'>
        <div className='flex justify-between px-6 py-2 items-center justify-center'><span className='font-semibold text-lg'>Upload</span><div onClick={closeuploadPhoto} className='cursor-pointer bg-gray-200 p-1 hover:bg-red hover:text-white rounded-full'><IoClose className='h-5 w-5 cursor-pointer'/></div></div>
        <div className='w-full h-full flex flex-col items-center gap-6 justify-center'>
        <div className='p-2 cursor-pointer border flex items-center justify-center gap-1 w-5/6 rounded-md border-cta text-cta hover:bg-cta hover:text-white'>
            <label className='cursor-pointer'>
              <span className='flex items-center gap-1'><Icon icon="material-symbols:image-outline" width="1.2em" height="1.2em" />Upload Image</span>
              <input id='uploadphoto'  onChange={(e) => handleImageChange(e)} type='file' accept='image/jpeg, image/png' className='absolute  opacity-0 cursor-pointer' />
            </label>
          </div>
      <button onClick={openUploadFolder} className='p-2 border flex items-center justify-center gap-1 w-5/6 rounded-md border-cta text-cta hover:bg-cta hover:text-white'><Icon icon="ph:folder-duotone" width="1.2em" height="1.2em" /><span>Upload Folder</span></button>
      <button onClick={openCreateAlbum} className='p-2 border flex items-center justify-center gap-1 w-5/6 rounded-md border-cta text-cta hover:bg-cta hover:text-white'><Icon icon="ic:twotone-add" width="1.2em" height="1.2em"/><span>Create Album</span></button>
      </div>
      </div>
    </div>
    </Modal>
    <Modal appElement={document.getElementById('root')}
    style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          backgroundColor:'transparent',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '80%',
          overflowY: 'auto',
          border:'none'
        },}}
 isOpen={postPhoto} onRequestClose={closePopups}>
  <Postphoto file={file} close={closePopups} />
  </Modal>
  <Modal appElement={document.getElementById('root')} style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          backgroundColor:'transparent',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '80%', 
          overflowY: 'auto',
          border:'none'
        },}}
 isOpen={Folder} onRequestClose={closePopups}>
  <Uploadfolder close={closePopups} />
  </Modal>
  <Modal appElement={document.getElementById('root')} style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          backgroundColor:'transparent',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '80%', 
          overflowY: 'auto',
          border:'none'
        }}}
 isOpen={createAlbum} onRequestClose={closePopups} >
  <Createalbum close={closePopups} />
  </Modal>
        <div className='flex flex-col px-3 py-2 drop '>
        <div className='font-semibold text-lg p-4'>Photos ({images?.length})</div>
        <div className='flex flex-wrap p-2 gap-2'>
          {parseInt(userID) === userId && <div onClick={openuploadPhoto} className={`w-28 h-28 flex rounded-lg ${isDarkMode? 'lightgray-bg' : 'bg-gray-50'}  cursor-pointer items-center justify-center`}>
          <label className='cursor-pointer'>
          <span className='flex flex-col items-center gap-2'><Icon className='text-cta' icon="zondicons:add-solid" width="1.2em" height="1.2em"   />Upload</span>
          </label>
          </div>}
        {images?.map((photo)=>{
          return(
          <div key={photo.postId} className='inline-block cursor-pointer relative overflow-hidden'>
  <NavLink to={`/post/${userID}/${photo.postId}`}>
  <div className='relative cursor-pointer'>
  <img className='w-28 h-28 rounded-lg' src={`http://localhost:8080${photo.imageUrl}`} alt={`http://localhost:8080${photo.imageUrl}`} />
    <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 hover:opacity-80 rounded-lg flex items-center justify-center">
    <p className="text-white flex items-center justify-center gap-2 md:w-full i know an assassin when i see one unmaiyana miso kellam free pass kudutharrathu namma hypocrisy ah question panna label ottidrathu paaka azhaga irukka nu tha mannichu vidren avan varamaatan di yaaru pa athu crowd uh enakku therinjavangala achum yarna maati tholaingalen da ithu mattu enga meera ka ku therinjuthu rocket raja oru thirudan ah whats a crocodile doing in perungalathur ethayachum sollu ya w-40 md:text-lg font-semibold"> <Icon className='text-cta' icon="ph:heart-fill" width="1.4em" height="1.4em" />{likeCount[photo.postId] || 0} </p>
    </div>
    </div>
</NavLink>
</div>
)})}

        </div>
        </div>
    </div>
    </>
  )
}

export default Photos;
