import React ,{useState, useEffect, useCallback} from 'react'
import { Icon } from '@iconify/react';
import Modal from 'react-modal';
import {Tooltip } from 'react-tooltip';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const [editprofile, showEditprofile] = useState(false);
  const [editPersonal,showEditpersonal] = useState(false);
  const [user,setUserdetail] = useState('');
  const userId = useSelector((state) => state.auth.userId);
  const {userID} = useParams();
  const navigate = useNavigate()
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedMode);
  }, []);

  
  const fetchUserName = useCallback(async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get(`http://localhost:8080/api/users/${userID}`, {
        method: 'GET',
        headers:{
          'Authorization':`Bearer ${token}`
        }
      });
      setUserdetail(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  },[userID]);
  useEffect(() => {
    if (userId) {
      fetchUserName();
    }
  }, [userId]);

  const openPhotos = ()=>{
    navigate('/photos',window.scrollTo(0, 0))
  }
  const openEditprofile = () => {
    showEditprofile(true);
  };
  const closeEditprofile = () => {
    showEditprofile(false);
  };

  const openEditpersonal = ()=>{
    showEditpersonal(true);
  }

  const closeEditpersonal = ()=>{
    showEditpersonal(false);
  }
  
  const personal = {
      profile: [
        { id: 1,name:'Peter Parker',aboutme:'Hi, I’m Peter Parker, I’m 36 and I work as a Professional Cinematographer from Ontario, Canada, my proclaimed works are “dewwater” and "Sunbeast"',birthday:'December 17, 1985', phno: '+1-989-232435234', bloodgroup: 'B+',gender:'Male',country:'San Francisco, US',occupation:'Cinematographer',joined:'December 20,2021', email:'peterparker07@design.com' },
      ]
    }
    
    const general = {
      profile: [
        { id: 1,hobbies:'I like to ride the bicycle, swimming, and working out. I also like reading design magazines, and searching on internet, and also binge watching a good hollywood Movies while it’s raining outside.',Education:'Master of computer science, sixteen years degree From Oxford Uniersity, London ',Interests:[{id:'1',activity:'Swimming'},{id:'2',activity:'Photography'},{id:'3',activity:'Street Art'},{id:'4',activity:'Anime'},{id:'4',activity:'Anime'},{id:'4',activity:'Anime'},],  Workexperience: [{id:1,work:'Assistant Cinematographer,',experience:'Assisted in camera setup and various operations'},{id:2,work:'Cinematographer,', experience:'Camera operations for production, shot division decisions and ensuring high quality visuals'}],}
      ]
    }

    const social = {
      media:[{
        id:1,
        icon:<Icon icon="mage:facebook" width="1.2em" height="1.2em" />,
        // link:user.socialMediaLinks.facebook 
      },
    {
      id:2,
      icon:<Icon icon="prime:twitter" width="1.2em" height="1em" />,
      // link:user.socialMediaLinks.twitter
    },
  {
    id:3,
    icon:<Icon icon="ri:instagram-fill" width="1.2em" height="1.2em" />,
    // link:user.socialMediaLinks.instagram
  },
{
  id:4,
  icon:<Icon icon="mdi:youtube" width="1.2em" height="1.2em" />,
  // link:user.socialMediaLinks.youtube
}]
    }
  return (
    <div className={`flex max-w-[30rem] w-full ${isDarkMode ? 'dark-bg':'white-bg'} gap-2 flex-col`}>
    <div className='flex flex-col gap-4 items-center justify-center'>
  <div className={`flex py-2 px-6  ${isDarkMode ? 'gray-bg':'white-bg'} drop shadow-lg w-full flex-col`}>
    <div className='flex gap-1 items-center justify-between py-4 border-b border-gray-170 '>
      <span className='font-semibold text-md'>Personal Info</span><span data-tooltip-id="my-tooltip" data-tooltip-content="Edit Personal info" className='flex cursor-pointer gap-1'><Icon onClick={openEditprofile} icon="bx:edit" width="1.3em" height="1.3em" style={{color:'gray'}} /></span>
    </div>
    {/* <Modal style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          backgroundColor:'transparent',
          transform: 'translate(-50%, -50%)',
          width: '100%', // Adjust width as needed
          height: '100%', // Limit height to 80% of viewport height
          overflowY: 'auto',
          border:'none'
        },}}
 isOpen={editprofile} onRequestClose={closeEditprofile}>
    <Editprofile close={closeEditprofile} />
    </Modal> */}
    <div>
      {personal.profile.map((profile) => (
        <div key={profile.id} className='flex flex-col text-sm cursor-pointer justify-between gap-4 py-4'>
          <div className='flex flex-col gap-1'>
            <div className='flex font-semibold items-center gap-1.5'>
            <Icon icon="ic:round-person" width="1.2em" height="1.2em"  /> <span>About Me:</span>
            </div>
            <div className='flex flex-col'>
              <div className='px-6 text-md '>
                <span className='text-sm cursor-pointer'>{user.aboutMe}</span>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-1'>
            <div className='flex font-semibold items-center gap-1.5'>
            <Icon icon="heroicons:cake-16-solid" width="1.2em" height="1.2em" /> <span>Birthday:</span>
            </div>
            <div className='flex flex-col'>
              <div className='px-6 text-md '>
                <span className='text-sm cursor-pointer'>{formatDate(user.birthday)}</span>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-1'>
            <div className='flex font-semibold items-center gap-1.5'>
            <Icon icon="solar:phone-bold" width="1.2em" height="1.2em"  /> <span>Phone Number:</span>
            </div>
            <div className='flex flex-col'>
              <div className='px-6 text-md '>
                <span className='text-sm cursor-pointer '>{user.phno}</span>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-1'>
            <div className='flex font-semibold items-center gap-1.5'>
            <Icon icon="fontisto:blood-drop" width="1em" height="1em" /> <span>Blood Group:</span>
            </div>
            <div className='flex flex-col'>
              <div className='px-6 text-md '>
                <span className=' cursor-pointer'>{user.bloodGroup}</span>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-1'>
            <div className='flex font-semibold items-center gap-1.5'>
            <Icon icon="el:person" width="1.2em" height="1.2em" /> <span>Gender:</span>
            </div>
            <div className='flex flex-col'>
              <div className='px-6 text-md '>
                <span className=' cursor-pointer'>{user.gender}</span>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-1'>
            <div className='flex font-semibold items-center gap-1.5'>
            <Icon icon="entypo:globe" width="1em" height="1em" /> <span>Country:</span>
            </div>
            <div className='flex flex-col'>
              <div className='px-6 text-md '>
                <span className=' cursor-pointer'>{user.country}</span>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-1'>
            <div className='flex font-semibold items-center gap-1.5'>
            <Icon icon="ion:briefcase" width="1.2em" height="1.2em"  /> <span>Occupation:</span>
            </div>
            <div className='flex flex-col'>
              <div className='px-6 text-md '>
                <span className=' cursor-pointer '>{user.occupation}</span>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-1'>
            <div className='flex font-semibold items-center gap-1.5'>
            <Icon icon="fa6-solid:handshake" width="1.2em" height="1.2em" /> <span>Joined:</span>
            </div>
            <div className='flex flex-col'>
              <div className='px-6 text-md '>
                <span className=' cursor-pointer '>{formatDate(user.joined)}</span>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-1'>
            <div className='flex font-semibold items-center gap-1.5'>
            <Icon icon="ic:round-email" width="1.2em" height="1.2em" /> <span>Email:</span>
            </div>
            <div className='flex flex-col'>
              <div className='px-6 text-md '>
                <span className=' cursor-pointer'>{user.email}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
  <div style={{ scrollbarWidth: 'none', '-ms-overflow-style': 'none' }} className='flex xs:flex-col text-sm flex-col overflow-auto overflow-x-hidden w-full gap-8'>
  <div className={`flex  px-6 drop py-4  ${isDarkMode ? 'gray-bg':'white-bg'} shadow-lg h-auto flex-col`}>
  <div className='flex gap-1 items-center justify-between py-4 border-b border-gray-170 '>
      <span className='font-semibold text-[1rem]'>General Info</span> <span data-tooltip-id='my-tooltip' data-tooltip-content='Edit General info' onClick={openEditpersonal} className='flex cursor-pointer gap-1'><Icon icon="bx:edit" width="1.6em" height="1.6em" style={{color:'gray'}} /></span>
    </div>
    {/* <Modal style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          backgroundColor:'transparent',
          transform: 'translate(-50%, -50%)',
          width: '100%', // Adjust width as needed
          height: '100%', // Limit height to 80% of viewport height
          overflowY: 'auto',
          border:'none'
        },}}
 isOpen={editPersonal} onRequestClose={closeEditpersonal}>
    <  Personalinfo close={closeEditpersonal} />
    </Modal> */}
    <div className='flex py-6 gap-8'>
    {general.profile.map((profile)=>(
      <div key={profile.id} className='flex flex-col w-[800px] gap-6'>

          <div className='flex flex-col gap-1'>
          <div className='flex font-semibold items-center gap-1.5'>
          <Icon icon="tabler:puzzle-filled" width="1.2em" height="1.2em" /><span>Hobbies</span>
          </div>
          <div className='flex flex-col'>
            <div className=' text-md '>
              <span className=' cursor-pointer'>{user.hobbies}</span>
            </div>
          </div>
        </div>
        <div className='flex flex-col w-full gap-1'>
          <div className='flex font-semibold items-center gap-1.5'>
          <Icon icon="fluent:calendar-work-week-28-filled" width="1.2em" height="1.2em"/> <span>Interests</span>
          </div>
          <div className='flex w-full flex-col'>
            <div className='w-full flex-wrap flex gap-4 text-md '>
            {user.interests?.map((interest) => (
      <div key={interest.id} className='flex  px-2 py-1 w-auto justify-center items-center rounded-md border border-cta cursor-pointer text-cta'>
        {interest.activity}
      </div>
    ))}
            </div>
          </div>
        </div>


        <div className='flex flex-col gap-1'>
          <div className='flex font-semibold items-center gap-1.5'>
          <Icon icon="zondicons:education" width="1.2em" height="1.2em" /> <span>Education</span>
          </div>
          <div className='flex flex-col'>
            <div className=' text-md '>
              <span className=' cursor-pointer'>{user.education}</span>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-1'>
          <div className='flex font-semibold items-center gap-1.5'>
          <Icon icon="ic:round-email" width="1.2em" height="1.2em" /> <span>Work Experience</span>
          </div>
          <div className='flex flex-col'>
            <div className='flex flex-col text-md gap-6 '>
            {user && user.workExperience && user.workExperience.length > 0 ? (
  user.workExperience.map((profession) => (
    <div key={profession.id} className='flex flex-col'>
      <span className='text-cta cursor-pointer'>{profession.work}</span>
      <span>{profession.experience}</span>
    </div>
  ))
) : (
  <div>No work experience available</div>
)}
            </div>
          </div>
        </div>
   
        </div>
    ))}
    </div>
   <div className='flex items-start gap-8'>
   <div className='flex w-[800px] flex-col gap-4 '>
    <div className='flex gap-1 items-center'>
   <Icon icon="teenyicons:share-solid" width="1em" height="1em" /><span className='font-semibold'>Social Media</span>
   </div>
   <div className='flex gap-4'>
{social.media.map((socialmedia)=>(
<Link to={socialmedia.link}><div className={`bg-gray-200 text-cta p-2 hover:bg-cta hover:text-white cursor-pointer items-center duration-500 ease-in-ease-out rounded-full`}>{socialmedia.icon}</div></Link>
)
)}
   </div>
   </div>
      {/* <div className='flex w-[800px] flex-col gap-1 '>
    <div className='flex gap-1 items-center'>
   <Icon icon="teenyicons:share-solid" width="1em" height="1em" /><span className='font-semibold'>Badges</span>
   </div>
   <div className='flex gap-4'>
<span className=''>{}</span>
   </div>
   </div> */}
   </div>
  </div>
  {/* <Friendscomp />
  <Photoscomp seeallPhotos={openPhotos}/>
  <Videocomp /> */}
  </div>
  <Tooltip id="my-tooltip "  />
</div>
</div>
  )
}

export default Profile;





