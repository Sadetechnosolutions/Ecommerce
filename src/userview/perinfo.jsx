import React, { useEffect } from "react";
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-calendar/dist/Calendar.css';
import { FaCaretDown } from "react-icons/fa";
import { FaCaretUp } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useSelector,useDispatch } from "react-redux";
import { Icon } from "@iconify/react/dist/iconify.js";
import { updatePhoto,changecoverPhoto,updateCover,changePhoto } from '../slices/photoslice';
import { setFormData } from "../slices/formslice";
import Phonecode from "../components/phonecode";
import { Calendar } from 'primereact/calendar';

const PersonalInfo = ({ GetInfo, formData, updateFormData,onNext   })=>{
    const dispatch = useDispatch()
    const [file, setFile] = useState(null);

    const [phoneCode,showPhoneCode] = useState(false)
    const [countryCode,setCountryCode] = useState('');
    const [countries,ShowCountries] = useState(false);
    const [active,SetActive] = useState(false);
    const [user,SetUser] = useState()
    const {profilepic} = useSelector((state)=>state.photo)

    const {coverpic} = useSelector((state)=>state.photo)
    const Navigate = useNavigate()
    const handleShowCountry = ()=>{
        ShowCountries(!countries);
    }

    const handleShowPhoneCode = ()=>{
        showPhoneCode(!phoneCode);
      }
        
    const handleSelectPhoneCode = (code) => {
        setCountryCode(code)
        dispatch(setFormData({ countryCode: code.code }));
        showPhoneCode(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        updateFormData({ [name]: value });
      };
      const handleSetCountry = (country) => {
        updateFormData({ country: country.name });
        ShowCountries(false);
        SetActive(!active)
    };
    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
                dispatch(changePhoto(selectedFile)); 
                setFile(selectedFile);
                dispatch(updatePhoto(selectedFile))
        }
    };

    const handlechangeCover = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
   
                dispatch(changecoverPhoto(selectedFile)); 
                setFile(selectedFile); 
                dispatch(updateCover(selectedFile))
        
        }
    };
    const handleDateChange = (e) => {
        updateFormData({ birthday: e.value })
      };
    
      // Handle radio button change
      const handleRadioChange = (e) => {
        updateFormData({ gender: e.target.value });
      };
      const fetchUserProfile = async () => {
        const token = localStorage.getItem('token');
          try {
            const response = await fetch('http://localhost:8080/api/auth/adminuser/get-profile', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
        
            if (response.ok) {
              const data = await response.json();
              SetUser(data)
              dispatch(setFormData({
                gmail: data.ourUsers.email,
                phno: data.ourUsers.phoneNumber}))
                console.log(data.ourUsers.email)
              // Check if `ourUsers` exists in the response
              if (data.statusCode === 200 && data.ourUsers) {
                return data.ourUsers; // Return `ourUsers` object
              } else {
                console.error('Invalid data format:', data);
                return null;
              }
            } else {
              console.error('Failed to fetch user profile:', response.status);
              return null;
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
          }
        };

        useEffect(()=>{
          fetchUserProfile()
        },[])


    const data = [{id:'1',name:'India'},{id:'2',name:'Afganisthan'}]
    return(
<div className=" flex  items-center justify-center">
    <div className="w-full px-8 py-6  bg-formbg gap-3 flex flex-col">
    <div style={{ backgroundImage: `url(${coverpic?.name})` }} className={`flex flex-col relative w-full h-28 bg-cover bg-center bg-no-repeat gap-4 items-center justify-end ${coverpic?'':'bg-gray-200'}`}>
                    <div className='absolute right-0 top-0 p-2'>
                        <div className='flex gap-2 items-center rounded-md cursor-pointer px-2 py-1 bg-white bg-opacity-40'>                     
                            <input type="file" accept="image/*" onChange={handlechangeCover} style={{ display: 'none' }} id="cover-photo-input" />
                            <label htmlFor="cover-photo-input" className='flex items-center gap-2 cursor-pointer'>
                            <span className='font-semibold text-xs'>Upload cover photo</span> <Icon icon="mdi:camera" width="0.8em" height="0.8em" />
                            </label>
                        </div>
                    </div>
                    <div className='flex relative  w-max items-center'>
                        <div>
                            <img className={`w-16 border-4 border-white ${profilepic?'':'bg-gray-200'} h-16 rounded-full`} alt='' src={profilepic?.name} />
                        </div>
                        <div className='absolute justify-end bottom-0 right-0 flex text-cta hover:bg-cta hover:text-white border border-cta cursor-pointer items-center justify-center py-1 w-min px-1 rounded-full bg-white'>
                            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} id="profile-photo-input" />
                            <label htmlFor="profile-photo-input" className='cursor-pointer'>
                                <Icon icon="mdi:camera" width="0.8em" height="0.8em" />
                            </label>
                        </div>
                    </div>
                </div>
<div className="flex flex-col gap-2">
    <label className="text-sm font-semibold">Display Name</label>
    <input required  name="displayName" value={formData.displayName} onChange={handleChange} className="p-2 border placeholder:text-sm rounded-md w-full focus:outline-cta bg-white" placeholder="Enter your Name to display" />
</div>
<div className="flex flex-col gap-2">
    <label className="text-sm font-semibold">About Yourself</label>
<textarea name="aboutYourself" value={formData.aboutYourself} onChange={handleChange} className="px-2 border placeholder:text-sm focus:outline-cta bg-white  rounded-md h-20" placeholder="Write about yourself" />
</div>

    <div className='flex flex-col w-1/2 gap-3'>
        <label className="text-sm font-semibold">Birthday</label>
      <Calendar value={formData.birthday} className="border rounded-md" style={{ height: '35px'}} onChange={handleDateChange} />
    </div>
    <div className='flex flex-col gap-2'>
    <label className="text-sm w-full font-semibold"> Blood Group <span className='text-red'>*</span></label>
            <input name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}  className="px-3 border placeholder:text-sm py-2 w-full text-sm focus:outline-cta bg-white rounded-md focus:outline-none focus:border-gray" type="text" required placeholder="Enter your blood group" />
    </div>
   
<div className='flex flex-col gap-2'>
    <label className="text-sm font-semibold"> Gender <span className='text-red'>*</span></label>
    <div className='flex items-center gap-4'>
    <div className="flex items-center gap-2">
    <input className="custom-radio"  type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleRadioChange} />
    <label className="text-sm">Male</label>
    </div>
    <div className='flex items-center gap-2'>
    <input className="custom-radio"   type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleRadioChange}  /><label className="text-sm">Female</label>
    </div>
    <div className='flex items-center gap-2'>
    <input className="custom-radio" type="radio" name="gender" value="Other" checked={formData.gender === 'Other'} onChange={handleRadioChange}  /><label className="text-sm">Other</label>
    </div>
    </div>
    </div>
    <div className='flex w-full flex-col gap-2'>
  <label className="text-sm font-semibold"> Country <span className='text-red'>*</span></label>
  <div className='relative flex items-center rounded-md'>
    <input
      required
      name="country"
      onChange={handleChange}
      className='w-full px-3 py-2 placeholder:text-sm border rounded-md focus:outline-cta bg-white'
      value={formData.country}
      type="text"
      placeholder="Select your country"
    />
    <div className='absolute right-6'>
      {active ? (
        <FaCaretUp onClick={() => { SetActive(false); handleShowCountry(); }} />
      ) : (
        <FaCaretDown onClick={() => { SetActive(true); handleShowCountry(); }} />
      )}
    </div>
  </div>

  {countries && (
    <>
      <div className='mt-16 absolute duration-500 ease-in-ease-out slide-in-down w-96 flex flex-col bg-white'>
        {data.map((country) => (
          <div key={country.id}>
            <div className='w-full'>
              <div
                className='cursor-pointer p-2 focus:outline-cta bg-white hover:bg-gray-100 w-full'
                onClick={() => { handleSetCountry(country); }}
              >
                {country.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )}
</div>

    <div className="flex gap-2 flex-col">
    <label className="text-sm">Phone Number <span className='text-red'>*</span></label>
    <div className='flex items-center gap-2'>
        <div onClick={handleShowPhoneCode} className='border cursor-pointer bg-white border-gray-300 rounded-md px-2 py-2.5'>
            <img className='w-6 h-4' src={countryCode ? countryCode.flag : 'india.jpg'} alt='' />
        </div>
        <input 
            id='phno' 
            name='phno' 
            onChange={(e) => {
                // Enforce max length and numeric value
                const value = e.target.value;
                if (/^\d{0,10}$/.test(value)) {
                    handleChange(e);
                }
            }} 
            value={user?.ourUsers.phoneNumber} 
            className="px-3 py-2 border placeholder:text-sm text-sm focus:outline-cta bg-white w-full appearance-none rounded-md focus:outline-none focus:border-gray" 
            type="text" 
            inputMode="numeric" // Use numeric keyboard on mobile
            required 
            placeholder="Enter your mobile number" 
            maxLength="10" // Limit the input to 10 characters
        />
    </div>
    {phoneCode && <Phonecode setFlag={handleSelectPhoneCode} />}
</div>

    <div className="flex flex-col gap-2">
    <label className="text-sm font-semibold">Your Gmail</label>
    <input name="gmail" type="email" value={user?.ourUsers.email} onChange={handleChange} className="p-2 border placeholder:text-sm rounded-md w-full focus:outline-cta bg-white " placeholder="Enter your mail" />
</div>



<button onClick={onNext} className="px-3 py-3 fixed bottom-6 right-6 border rounded-full border-cta text-lg bg-cta hover:bg-cta hover:opacity-75 text-white cursor-pointer"><Icon icon="ic:baseline-arrow-forward" /></button></div>
  
</div>
    )
}

export default PersonalInfo;
