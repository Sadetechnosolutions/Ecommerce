import React,{useState, useEffect} from 'react'
import ReactPlayer from "react-player";
import 'video-react/dist/video-react.css';
import '../styles.css'
import { Icon } from '@iconify/react/dist/iconify.js';
import { useSelector,useDispatch } from 'react-redux';
import Modal from 'react-modal';
import PostVideo from '../components/uploadvideo';
import Uploadvideofolder from '../components/uploadvideofolder';
import { IoClose } from 'react-icons/io5';
import Createvideoalbum from '../components/createvideoalbum';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { selectPost } from '../slices/postslice';

const Videos = () => {
  const [uploadVideo, showuploadVideo] = useState(false);
  const [video,showVideo] = useState(false);
  const [Folder,showUploadFolder] = useState(false);
  const [createAlbum,showCreateAlbum] = useState(false);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);
  const { userID } = useParams();
  const [videos,setVideos] = useState();
  const [file,setFile] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedMode);
  }, []);

  const openCreateAlbum = ()=>{
    showCreateAlbum(true);
    closeuploadVideo()
  }
  const openPostVideo = ()=>{
    showVideo(true);
    closeuploadVideo();
  }
  const openUploadFolder = ()=>{
    showUploadFolder(true);
    closeuploadVideo();
  }
  
  const openuploadVideo = () => {
    showuploadVideo(true);
  };

  const closeuploadVideo = () => {
    showuploadVideo(false);
  };

  const closePopups = () => {
    showuploadVideo(false);
    showVideo(false);
    showUploadFolder(false);
    showCreateAlbum(false);
  };

  const fetchVideos = async () => {
    try {
            const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
                }
                const response = await fetch(`http://localhost:8080/posts/user/${userID}/videos`, {
        method: 'GET',
      headers: {
    'Authorization': `Bearer ${token}`,
      },
        });
        if (response.ok) {
        const data = await response.json();
      setVideos(data);
      } else {
              console.error('Failed to fetch user Image:', response.status);
      }
              } catch (error) {
        console.error('Error fetching user Image:', error);
      }
            };


      useEffect(() => {
        if (userId) {
          fetchVideos();
      }
            }, [userId]);

const handleImageChange = (event) => {
              const selectedFile = event.target.files[0];
              if (selectedFile) {
                const reader = new FileReader();
                reader.onload = () => {
                  const selectedData = {
                    url: reader.result,
                    type: 'VIDEO',
                  };
                  dispatch(selectPost(selectedData)); // Dispatch action with the selected file data
                  setFile(selectedFile); 
                  openPostVideo();// Store the file object
                // Set postType based on the selected type
                };
                reader.readAsDataURL(selectedFile); // Read the file as a data URL
              }
            };
  return (
    <div className={`flex max-w-[30rem] ${isDarkMode? 'gray-bg' : 'white-bg'} w-full`}>
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
          height: '60%',
          overflowY: 'auto',
          border:'none'
          },}}
 isOpen={uploadVideo} onRequestClose={closeuploadVideo}>
        <div className='flex  w-full items-center justify-center'>
      <div className='w-1/2 h-96 flex flex-col p-4 gap-4 shadow-lg rounded-md bg-white'>
        <div className='flex justify-between p-2 items-center justify-center'><span className='font-semibold text-lg'>Upload </span><div onClick={closeuploadVideo} className='cursor-pointer bg-gray-200 p-1 hover:bg-red hover:text-white rounded-full'><IoClose className='h-5 w-5 cursor-pointer'/></div></div>
        <div className='w-full h-full flex flex-col items-center gap-6 justify-center'>
        <div className='p-2 cursor-pointer border flex items-center justify-center gap-1 w-1/2 rounded-md border-cta text-cta hover:bg-cta hover:text-white'>
            <label className='cursor-pointer'>
              <span className='flex items-center gap-1'><Icon icon="material-symbols:image-outline" width="1.2em" height="1.2em" />Upload Video</span>
              <input id='uploadVideo' onChange={(e) => handleImageChange(e)} type='file' accept='video/*' className='absolute  opacity-0 cursor-pointer' />
            </label>
          </div>
      <button onClick={openUploadFolder} className='p-2 border flex items-center justify-center gap-1 w-1/2 rounded-md border-cta text-cta hover:bg-cta hover:text-white'><Icon icon="ph:folder-duotone" width="1.2em" height="1.2em" /><span>Upload Folder</span></button>
      <button onClick={openCreateAlbum} className='p-2 border flex items-center justify-center gap-1 w-1/2 rounded-md border-cta text-cta hover:bg-cta hover:text-white'><Icon icon="ic:twotone-add" width="1.2em" height="1.2em"/><span>Create Album</span></button>
      </div>
      </div>
    </div>
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
          width: '80%', // Adjust width as needed
          height: '80%', // Limit height to 80% of viewport height
          overflowY: 'auto',
          border:'none'
        },}}
 isOpen={video} onRequestClose={closePopups}>
  <PostVideo  file={file} close={closePopups} />
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
          width: '80%', // Adjust width as needed
          height: '80%', // Limit height to 80% of viewport height
          overflowY: 'auto',
          border:'none'
        },}}
 isOpen={Folder} onRequestClose={closePopups}>
  <Uploadvideofolder close={closePopups} />
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
          width: '80%', // Adjust width as needed
          height: '80%', // Limit height to 80% of viewport height
          overflowY: 'auto',
          border:'none'
        },}}
 isOpen={createAlbum} onRequestClose={closePopups}>
  <Createvideoalbum close={closePopups} />
  </Modal>
      <div className=' p-2 w-full px-6 h-[57vh] rounded-md shadow-lg'>
        <div className='p-2'>
        <p className='text-sm font-semibold'>Videos ({videos?.length})</p>
        </div>
        {/* <div className='flex flex-wrap gap-8 p-2'>
          <div className='w-52 h-[120px] cursor-pointer flex items-center justify-center border rounded-md bg-gray-50'>
            <label className='cursor-pointer' ><span className='flex flex-col items-center'><Icon className='text-cta' icon="zondicons:add-solid" width="1.2em" height="1.2em"   />Upload</span>
              <input className=' absolute opacity-0' accept='video/*' type='file'/>
            </label>
          </div> */}
          <div className='flex flex-wrap gap-2 p-2'>
            { parseInt(userID)=== userId && <div onClick={openuploadVideo} className={`w-28 h-28 flex ${isDarkMode ? 'dark-bg ' :' bg-gray-200 '} rounded-md cursor-pointer items-center justify-center`}>
            <label className='cursor-pointer'>
              <span className='flex flex-col text-sm items-center gap-2'><Icon className='text-cta' icon="zondicons:add-solid" width="1.2em" height="1.2em"   />Upload</span>
            </label>
          </div> }
           {videos?.slice().reverse().map((video)=>(
            <div key={video.postId}>
                <Link to={`/post/${userID}/${video.postId}`}>
                <div className='w-28 h-28 bg-black rounded-md overflow-hidden'>
    <ReactPlayer
              url={video.videoUrl} // Replace with your video URL
              playing={true}  // Autoplay the video
              controls={false} // Hide controls if desired
              width='100%'
              height='80%'
              loop={true} 
            />
</div>

            </Link>
            </div>
           ))}
           </div>
           </div>
    </div>
  )
}

export default Videos
