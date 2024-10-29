import React, { useState } from "react";
import { Icon } from "@iconify/react";
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from "react-router";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from "react-redux";
import { updatePhoto, changePhoto, updateCover, changecoverPhoto } from '../slices/photoslice';
import Phonecode from "../components/phonecode";
import moment from 'moment';

const UserForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showAdditionalEducation, setShowAdditionalEducation] = useState(false);
    const [interest, setInterest] = useState('');
    const [interestList, setInterestList] = useState([]);
    const [file, setFile] = useState(null);
    const [value, onChange] = useState(new Date());
    const [countriesVisible, setCountriesVisible] = useState(false);
    const [country, setCountry] = useState('');
    const [countryCode,setCountryCode] = useState('');
    const [name, setName] = useState('');
    const [aboutMe, setAboutMe] = useState('');
    const [bloodGroup, setBloodGroup] = useState('');
    const [gender, setGender] = useState('');
    const [phoneCode,showPhoneCode] = useState(false)
    const [profession, setProfession] = useState('');
    const [website, setWebsite] = useState('');
    const [hobbies, setHobbies] = useState('');
    const [phonenumber,setPhoneNumber] = useState('');
    const [email,setEMail] = useState('');
    const [workExperience, setWorkExperience] = useState('');
    const [education, setEducation] = useState([ {field: '',
        university: ''}]);
    const [socialMediaLinks, setSocialMediaLinks] = useState({
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: ''
    });

    const { selectedprofilepic } = useSelector((state) => state.photo);
    const { profilepic } = useSelector((state) => state.photo);
    const { selectedcoverpic } = useSelector((state) => state.photo);
    const { coverpic } = useSelector((state) => state.photo);

    const handleShowCountry = () => {
        setCountriesVisible(!countriesVisible);
    };
    const handleShowPhoneCode = ()=>{
        showPhoneCode(!phoneCode);
      }
        
    const handleSelectPhoneCode = (code) => {
        setCountryCode(code)
        showPhoneCode(false);
    };
    
    const open = () => {
        navigate('/');
    };

    const handleSetCountry = (selectedCountry) => {
        setCountry(selectedCountry.name);
        setCountriesVisible(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const currentDate = moment().format('DD-MM-YYYY');
        const formData = new FormData();
        formData.append('name', name);
        formData.append('aboutMe', aboutMe);
        formData.append('birthday', value.toISOString());
        formData.append('phno', `${countryCode.code}${phonenumber}`);
        formData.append('bloodGroup', bloodGroup);
        formData.append('gender', gender);
        formData.append('country', country);
        formData.append('occupation', profession);
        formData.append('joined',currentDate);
        formData.append('email', email);
        formData.append('hobbies', hobbies);
        formData.append('education', JSON.stringify(education));
        formData.append('interests', JSON.stringify(interestList));
        formData.append('workExperience', workExperience);
        formData.append('website', website);
        formData.append('socialMediaLinks', JSON.stringify(socialMediaLinks));

        if (file) {
            formData.append('profilePic', file);
        }
        if (coverpic) {
            formData.append('coverPic', coverpic);
        }
        try {
            const response = await fetch('http://localhost:3001/users', {
                method: 'POST',
                body: formData,
            });
            console.log('FormData being sent:');
            formData.forEach((value, key) => {
                console.log(`${key}:`, value);
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Success:', data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = () => {
                dispatch(changePhoto(reader.result)); 
                setFile(selectedFile);
                dispatch(updatePhoto(reader.result))
            };
            reader.readAsDataURL(selectedFile); 
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
    

    const handleEducationChange = (index, field, value) => {
        const updatedEducation = [...education];
        updatedEducation[index][field] = value;
        setEducation(updatedEducation);
    };

    const deleteInterest = (interestToDelete) => {
        const newInterests = interestList.filter((i) => i !== interestToDelete);
        setInterestList(newInterests);
    };

    const addInterest = () => {
        if (interest === '' || interest.length <= 1) {
            console.log('empty');
        } else if (interestList.length >= 10) {
            toast.error('You can only add 10 Interests');
        } else if (interestList.includes(interest)) {
            toast.warn('This interest is already added');
        } else {
            setInterestList([...interestList, interest]);
            setInterest('');
        }
    };

    const addEducationField = () => {
        setEducation([...education, { field: '', university: '' }]);
        setShowAdditionalEducation(true);
    };

    const handleSocialMediaChange = (platform, value) => {
        setSocialMediaLinks({ ...socialMediaLinks, [platform]: value });
    };

    const data = [{ id: '1', name: 'India' }, { id: '2', name: 'Afghanistan' }];
    return (
        <div className="flex flex-col min-h-screen justify-center items-center gap-2">
            <div  style={{ backgroundImage: `url(${coverpic?.name})` }}  className={`flex flex-col relative w-full h-48 bg-cover bg-center bg-no-repeat gap-4 justify-end ${coverpic ? '' : 'bg-gray-700'}`} >
                <div className='absolute right-0 top-0 p-2'>
                    <div className='flex gap-2 items-center rounded-md cursor-pointer px-2 py-1 bg-white bg-opacity-40'>
                        <input type="file" accept="image/*" onChange={handlechangeCover} style={{ display: 'none' }} id="cover-photo-input" />
                        <label htmlFor="cover-photo-input" className='flex items-center gap-2 cursor-pointer'>
                            <span className='font-semibold'>Change cover photo</span>
                            <Icon icon="mdi:camera" width="1.2em" height="1.2em" />
                        </label>
                    </div>
                </div>
                <div className='flex relative ml-6 mb-6 w-max items-center'>
                    <div>
                        <img className='w-28  border-4 border-white h-28 rounded-full' alt='' src={profilepic} />
                    </div>
                    <div className='absolute justify-end bottom-0 right-0 flex text-cta hover:bg-cta hover:text-white border border-cta cursor-pointer items-center justify-center py-1.5 w-min px-1.5 rounded-full bg-white'>
                        <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} id="profile-photo-input" />
                        <label htmlFor="profile-photo-input" className='cursor-pointer'>
                            <Icon icon="mdi:camera" width="1.2em" height="1.2em" />
                        </label>
                    </div>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="flex mt-6 min-h-screen gap-8 justify-center w-full">
                <div className="w-1/2 px-8">
                    <div className="flex justify-center">
                        <div className="w-full gap-6 flex flex-col">
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold">Display Name</label>
                                <input value={name} onChange={(e) => setName(e.target.value)} className="p-2 rounded-md w-full border border-gray-400" placeholder="Enter your Name to display" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold">About Yourself</label>
                                <textarea value={aboutMe} onChange={(e) => setAboutMe(e.target.value)} className="px-2 border" placeholder="write about yourself" />
                            </div>
                            <div className="flex justify-between">
                                <div className='flex flex-col w-1/2 gap-3'>
                                    <label className="font-semibold">Birthday</label>
                                    <DatePicker className='' onChange={onChange} value={value} />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className="w-full font-semibold">Blood Group <span className='text-red'>*</span></label>
                                    <input value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="px-3 py-2 w-full text-sm border border-gray-300 rounded-md focus:outline-none focus:border-gray" type="text" required placeholder="Enter your blood group" />
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <div className='flex flex-col gap-2'>
                                    <label className="font-semibold">Gender <span className='text-red'>*</span></label>
                                    <div className='flex items-center gap-4'>
                                        <div className="flex items-center gap-2">
                                            <input type="radio" name="gender" value="Male" checked={gender === 'Male'} onChange={() => setGender('Male')} />
                                            <label>Male</label>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <input type="radio" name="gender" value="Female" checked={gender === 'Female'} onChange={() => setGender('Female')} />
                                            <label>Female</label>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <input type="radio" name="gender" value="Other" checked={gender === 'Other'} onChange={() => setGender('Other')} />
                                            <label>Other</label>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <label className="font-semibold">Country <span className='text-red'>*</span></label>
                                    <div className='flex items-center'>
                                        <input className='w-72 px-3 py-2 border border-gray-300' value={country} type="text" required placeholder="Select your Country" readOnly />
                                        <div className='absolute ml-64'>
                                            {countriesVisible ? <FaCaretUp onClick={handleShowCountry} /> : <FaCaretDown onClick={handleShowCountry} />}
                                        </div>
                                    </div>
                                    {countriesVisible && (
                                        <div className='mt-20 absolute duration-500 ease-in-ease-out slide-in-down w-80 flex flex-col bg-white'>
                                            {data.map((country) => (
                                                <div key={country.id}>
                                                    <div className='w-full'>
                                                        <div className='cursor-pointer p-2 border border-gray-50 hover:bg-gray-100 w-72' onClick={() => handleSetCountry(country)}>{country.name}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold">Your Profession</label>
                                <input value={profession} onChange={(e) => setProfession(e.target.value)} className="p-2 rounded-md w-full border border-gray-400" placeholder="Enter your Profession" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold">Your Website</label>
                                <input value={website} onChange={(e) => setWebsite(e.target.value)} className="p-2 rounded-md w-full border border-gray-400" placeholder="Enter your Website" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold">Hobbies</label>
                                <input id='hobbies' type="text" value={hobbies} onChange={(e) => setHobbies(e.target.value)} className="border border-b p-2 rounded-md" name="hobbies" placeholder="Enter your Hobbies" />
                            </div>
                            <div className="flex gap-2 flex-col w-3/4">
            <label className="text-md">Phone Number <span className='text-red'>*</span></label>
            <div className='flex items-center gap-2'>
            <div onClick={handleShowPhoneCode} className='border cursor-pointer border-gray-300 rounded-md px-2 py-2.5'><img className='w-6 h-4' src={countryCode ? countryCode.flag : 'india.jpg'} alt=''/></div>
            <input id='phoneNumber' name='phoneNumber' onChange={(e)=> setPhoneNumber(e.target.value)} value={phonenumber} className="px-3 py-2 text-sm w-full border border-gray-300 appearance-none rounded-md focus:outline-none focus:border-gray" type="text" required placeholder="Enter your mobile number" />
            </div>
            {phoneCode && <Phonecode setFlag = {handleSelectPhoneCode} />}
          </div>
                        </div>
                    </div>
                </div>
                <div className="w-1/2 px-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col w-full justify-content gap-4">
                        <div className="flex flex-col gap-2">
                                <label className="font-semibold">Gmail</label>
                                <input id='hobbies' type="mail" value={email} onChange={(e) => setEMail(e.target.value)} className="border border-b p-2 rounded-md" name="hobbies" placeholder="Enter your Mail" />
                            </div>
                            <div className='flex flex-col h-max gap-2'>
                                <label className="font-semibold">Interests</label>
                                <div className='flex items-center gap-4'>
                                    <input name='interest' id='interest' value={interest} onChange={(e) => setInterest(e.target.value)} className='px-3 py-2 text-sm border border-b w-full rounded-md' type='text' placeholder='What are your interests' />
                                    <button type='button' className='border rounded-md text-cta hover:bg-cta hover:text-white px-6 py-2 border-cta' onClick={(e) => {
                                        e.preventDefault();
                                        addInterest();
                                    }}>Add</button>
                                </div>
                                <div className='flex flex-wrap gap-4 w-full'>
                                    {interestList.map((interest, index) => (
                                        <div className='flex justify-center items-center w-min py-2 px-3 rounded-md gap-2 bg-cta text-white' key={index}>
                                            {interest} <Icon icon="ic:baseline-close" className='cursor-pointer' onClick={() => deleteInterest(interest)} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between">
                                    <label className="font-semibold">Education</label>
                                    {!showAdditionalEducation && (
                                       <div className="flex items-center">
                                           <Icon icon="material-symbols:add" /> 
                                           <button type="button" onClick={addEducationField}>Add Education</button>
                                       </div>
                                    )}
                                </div>
                                {education.map((edu, index) => (
                                    <div key={index} className="flex flex-col gap-2">
                                        <input id={`field-${index}`} value={edu.field} onChange={(e) => handleEducationChange(index, 'field', e.target.value)} className="border border-b p-2 rounded-md" name={`education-${index}-field`} placeholder="Field of Study" />
                                        <input id={`university-${index}`} value={edu.university} onChange={(e) => handleEducationChange(index, 'university', e.target.value)} className="border border-b p-2 rounded-md" name={`education-${index}-university`} placeholder="University" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col gap-4">
                                <label className="font-semibold">Work Experience</label>
                                <input id='experience' onChange={(e) => setWorkExperience(e.target.value)} className="border border-b p-2 rounded-md" name="workExperience" placeholder="Enter your Experience" />
                            </div>
                            <div className="flex flex-col gap-4">
                                <label className="font-semibold">Social media</label>
                                <div className="relative flex items-center">
                                    <input className="border w-full border-b py-2 px-9 rounded-md focus:outline-none" value={socialMediaLinks.facebook} onChange={(e) => handleSocialMediaChange('facebook', e.target.value)} placeholder="Facebook URL" />
                                    <Icon className="absolute w-6 h-6 left-2" icon="logos:facebook" />
                                </div>
                                <div className="relative flex items-center">
                                    <input className="border w-full border-b py-2 px-9 rounded-md focus:outline-none" value={socialMediaLinks.instagram} onChange={(e) => handleSocialMediaChange('instagram', e.target.value)} placeholder="Instagram URL" />
                                    <Icon className="absolute w-6 h-6 left-2" icon="skill-icons:instagram" />
                                </div>
                                <div className="relative flex items-center">
                                    <input className="border w-full border-b py-2 px-9 rounded-md focus:outline-none" value={socialMediaLinks.twitter} onChange={(e) => handleSocialMediaChange('twitter', e.target.value)} placeholder="Twitter URL" />
                                    <Icon className="absolute w-6 h-6 left-2" icon="fa6-brands:square-x-twitter" />
                                </div>
                                <div className="relative flex items-center">
                                    <input className="border w-full border-b py-2 px-9 rounded-md focus:outline-none" value={socialMediaLinks.youtube} onChange={(e) => handleSocialMediaChange('youtube', e.target.value)} placeholder="YouTube URL" />
                                    <Icon className="absolute w-6 h-6 left-2" icon="logos:youtube-icon" />
                                </div>
                            </div>
                        </div>
                        <ToastContainer />
                        <div className="w-full flex items-center justify-end">
                            <button type="submit" className="px-3 py-2 border rounded-md border-cta text-cta text-lg hover:bg-cta hover:text-white cursor-pointer">Continue</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default UserForm;
