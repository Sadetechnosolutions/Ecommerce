import React,{useState, useEffect} from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "react-router-dom";
import Checkbox from "../components/checkbox";

const Menu = ()=>{
    const [user,setUser] = useState()
const userId = useSelector((state)=>state.auth.userId)

const menu=[
    { id: 1, title: 'Edit Profile',icon:<Icon style={{color: '#585656'}} className='w-6 h-7' icon="material-symbols:person-edit-outline" />, path: '/editprofile' },
    { id: 2, title: 'Settings',icon:<Icon style={{color: '#585656'}} className='w-6 h-7'  icon="carbon:settings" />, path: '/settings' },
    { id: 3, title: 'Privacy & data',icon:<Icon style={{color: '#585656'}} className='w-6 h-7' icon="carbon:security" />, path: '/Privacydata' },
    { id: 4, title: 'Security',icon:<Icon style={{color: '#585656'}} className='w-6 h-7' icon="material-symbols:lock-outline" />, path: '/security' },
]

const terms = [
    {id:1, title:'Help', icon:<Icon className="w-6 h-7" icon="material-symbols:help-outline"  style={{color: '#585656'}} />, path:'/help'},
    {id:2, title:'About', icon:<Icon className="w-6 h-7" icon="ph:address-book" style={{color: '#585656'}} />},
    {id:3, title:'Invite Friends', icon:<Icon className="w-6 h-7" icon="ph:share-fat" style={{color: '#585656'}} />}
]

const [isChecked, setIsChecked] = useState(false);

const handleCheckboxChange = (state) => {
    setIsChecked(state);
  };
    
const fetchUserName = async () => {
    try {
      const token = localStorage.getItem('token');
  
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }
  
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched user data:', data); // Log fetched data
        setUser(data);
      } else {
        console.error('Failed to fetch user data:', response.status);
        // Optionally handle different status codes (e.g., unauthorized, not found)
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(()=>{
    fetchUserName()
  },[])
    return(
        <div className="w-max-[30rem] w-full flex h-screen flex-col gap-2 bg-gray-200  p-4">
        <NavLink to={ `/user/${userId}`}><div className='flex items-center p-4 bg-white rounded-md gap-4'>
        <img src={`http://localhost:8086${user?.profileImagePath}`} data-tooltip-id="my-tooltip" data-tooltip-content="Profile" alt='' className='cursor-pointer rounded-full h-11 w-11 bg-gray-300'/>
      <p data-tip="Profile" className=' w-28 truncate font-semibold'>{user?.name}</p> 
      </div></NavLink>

      {menu.map((setting)=>(
          <Link to={setting.path}><div className={`bg-white block  w-full flex items-center px-4 py-3 gap-4 font-semibold `}>{setting.icon} {setting.title}</div></Link>
        ))}
        <div className={`bg-white block  w-full flex items-center px-4 py-3 justify-between font-semibold `}>
        <div className="flex items-center gap-4">
        <Icon icon="material-symbols-light:dark-mode" className="w-7 h-7"  style={{color: '#b0b0b0'}} />    
        <span>Dark Mode</span>
        </div>
        <Checkbox initialItemState={!isChecked} onCheckboxChange={handleCheckboxChange} />
        </div>
        {terms.map((setting)=>(
          <Link to={setting.path}><div className={`bg-white block  w-full flex items-center px-4 py-3 gap-4 font-semibold `}>{setting.icon} {setting.title}</div></Link>
        ))}
        <div  className={`bg-white block  w-full flex items-center px-4 py-3 gap-4 font-semibold `}>
        <Icon className='w-6 h-7' style={{color:'#585656'}} icon="fe:logout" />
        <span>Logout</span>
        </div>
        </div>
    )
}

export default Menu;