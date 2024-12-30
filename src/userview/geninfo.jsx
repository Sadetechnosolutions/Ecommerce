import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setFormData,resetFormData } from "../slices/formslice";
import moment from 'moment';
import { useNavigate } from "react-router";
import axios from "axios";

const GeneralInfo = ({section}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const formData = useSelector((state) => state.form);
    const { coverpic } = useSelector((state) => state.photo);
    const { profilepic } = useSelector((state) => state.photo);
    const interests = formData.interests;
    const { countryCode } = useSelector((state) => state.form);
    const userId = useSelector((state) => state.auth.userId); // Adjust based on your store's structure
    const token = localStorage.getItem('token'); 
    const [interest, setInterest] = useState('');
    const [showAdditionalExperience, setshowAdditionalExperience] = useState(false);
    const [user,SetUser] = useState()


    const deleteInterest = (id) => {
        const updatedInterests = interests.filter((i) => i.id !== id);
        dispatch(setFormData({ ...formData, interests: updatedInterests }));
    };
    const addInterest = () => {
        if (interest.trim() === '' || interest.length <= 1) {
            toast.error('Interest must be at least 2 characters long');
        } else if (interests.find((i) => i.activity === interest.trim())) {
            toast.warn('This interest is already added');
        } else if (interests.length >= 10) {
            toast.error('You can only add up to 10 interests');
        } else {
            const newInterest = { id: Date.now(), activity: interest.trim() }; // Unique ID
            const updatedInterests = [...interests, newInterest];
            dispatch(setFormData({ interests: updatedInterests }));
            setInterest('');
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
    
    if (name.startsWith("workExperience")) {
            const [_, index, field] = name.split('-');
            const updatedworkExperience = formData.workExperience.map((exp, idx) => 
                idx === parseInt(index) ? { ...exp, [field]: value } : exp
            );
            dispatch(setFormData({ workExperience: updatedworkExperience }));
        }
        else if (name.startsWith("socialMediaLinks-")) {
            const key = name.split('-')[1];
            dispatch(setFormData({
              socialMediaLinks: {
                ...formData.socialMediaLinks,
                [key]: value
              }
            }));
          }
        else {
            dispatch(setFormData({ [name]: value }));
        }
    };
    
    const addWorkExperience = () => {
        setshowAdditionalExperience(true);
        const updatedExperience = [...formData.workExperience, { work: '', exerience: '' }];
        dispatch(setFormData({ workExperience: updatedExperience }));
    }
    const removeIds = (arr) => arr.map(({ id, ...rest }) => rest);


    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // Format the current date using moment
        const currentDate = moment().toISOString();
    
        // Create a FormData object for the file uploads and form data
        const formDataObj = new FormData();
    
        // Create userJson as a JSON string
        const userJson = {
            name: formData.displayName || '',
            aboutMe: formData.aboutYourself || '',
            birthday: formData.birthday 
                ? moment(formData.birthday).format('YYYY-MM-DD') 
                : '',
                // `${formData.countryCode || '+91'}
            phno: formData.phno || '',
            bloodGroup: formData.bloodGroup || '',
            gender: formData.gender || '',
            country: formData.country || '',
            occupation: formData.profession || '',
            joined: currentDate,
            // userid: null,    
            email: formData.gmail || '',
            hobbies: formData.hobbies || '',
            education: formData.education || '',
            interests: removeIds(formData.interests || []),
            workExperience: formData.workExperience || [],
            socialMediaLinks: formData.socialMediaLinks || {}
        };
    
        // Append userJson as a JSON string
        formDataObj.append('userJson', JSON.stringify(userJson));
    
        // Append profile and banner images if available
        if (profilepic) {
            formDataObj.append('profileImage', profilepic);
        }
    
        if (coverpic) {
            formDataObj.append('bannerImage', coverpic);
        }
    
        // Note: You can't log FormData object directly; instead, use this method:
        for (let [key, value] of formDataObj.entries()) {
            console.log(`${key}:`, value);
        }
    
        const token = localStorage.getItem('token');
    
        try {
            const response = await axios.post('http://localhost:8080/api/users/createUserWithImages', formDataObj, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data', // This ensures the server knows you're sending FormData
                }
            });
    
            dispatch(resetFormData());
            
            // If the response is successful, navigate and return the users data
            if (response.status === 200) {
                console.log('API Response Data:', response.data); // Log the response for debugging
                navigate('/newsfeed');
                return response.data.ourUsers;
            } else {
                // Handle errors if response is not OK
                console.error('Error:', response.status, response.data);
                return null;
            }
        } catch (error) {
            console.error('Error:', error);
            console.error('Error details:', JSON.stringify(error, null, 2));
            return null;
        }
    };

    const maxLengthCheck = (object) => {
        if (object.target.value.length > object.target.maxLength) {
         object.target.value = object.target.value.slice(0, object.target.maxLength)
          }
        }
            

        http://localhost:8080/api/auth/adminuser/get-profile
    return (
        <div className="items-center flex justify-center">
            <form onSubmit={handleSubmit} className="relative w-full px-8 py-4  flex bg-formbg flex-col gap-4">
                <div className="flex flex-col w-full justify-content gap-4">

                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">Hobbies</label>
                        <input
                            id='hobbies'
                            type="text"
                            onChange={handleChange}
                            className="placeholder:text-sm text-sm focus:outline-cta bg-white border p-2 rounded-md"
                            name="hobbies"
                            placeholder="Enter your Hobbies"
                            value={formData.hobbies}
                        />
                    </div>
                    <div className='flex flex-col h-max gap-2'>
                        <label className="font-semibold">Interests</label>
                        <div className='flex items-center gap-4'>
                            <input
                                name='interest'
                                id='interest'
                                value={interest}
                                onChange={(e) => { setInterest(e.target.value) }}
                                className='px-3 py-2 text-sm placeholder:text-sm text-sm focus:outline-cta bg-white border border-b w-full rounded-md'
                                type='text'
                                placeholder='What are your interests'
                            />
                            <button
                                type='button'
                                className='border rounded-md text-cta flex items-center bg-cta text-white px-2 py-2 border-cta'
                                onClick={(e) => {
                                    e.preventDefault();
                                    addInterest();
                                }}
                            > <Icon icon="ic:baseline-add" />
                                Add
                            </button>
                        </div>
                        <div className='flex flex-wrap gap-4 w-full'>
                            {interests.map((interest, index) => (
                                <div
                                    className='flex justify-center items-center w-min py-2 px-3 rounded-md gap-2 bg-cta text-white'
                                    key={index}
                                >
                                    {interest.activity}
                                    <Icon icon="ic:baseline-close" className='cursor-pointer' onClick={() => { deleteInterest(interest.id) }} />
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Additional fields can be uncommented and updated similarly */}
                    <div className="flex flex-col w-full justify-content gap-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between">
                            <label className="font-semibold">Education</label>
                        </div>
                        <input required
                                    id='education'
                                    value={formData.education}
                                    onChange={handleChange}
                                    className="border placeholder:text-sm text-sm focus:outline-cta bg-white p-2 rounded-md"
                                    name='education'
                                    placeholder="University"
                                />
                    </div>
                    <div className="flex flex-col gap-4">
                    <div className="flex justify-between">
                            <label className="font-semibold">Experience</label>
                            {!showAdditionalExperience && (
                               <div className="flex items-center"><Icon icon="material-symbols:add" /> <button type="button" onClick={addWorkExperience}>Add Experience</button></div>
                            )}
                        </div>
                        {formData.workExperience.map((work, index) => (
                            <div key={index} className="flex gap-6">
                                <input
                                    id={`workExperience-${index}-work`}
                                    value={work.work}
                                    onChange={handleChange}
                                    className="borderplaceholder:text-sm border text-sm focus:outline-cta bg-white w-1/2 p-2 rounded-md"
                                    name={`workExperience-${index}-work`}
                                    placeholder="Profession"
                                />
                                <input
                                    id={`workExperience-${index}-experience`}
                                    type="number"
                                    maxLength={2}
                                    onInput={maxLengthCheck}
                                    value={work.experience}
                                    onChange={handleChange}
                                    className="border placeholder:text-sm text-sm focus:outline-cta bg-white  w-1/2 p-2 rounded-md"
                                    name={`workExperience-${index}-experience`}
                                    placeholder="Years of Experience"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-4">
  <label className="font-semibold">Social media</label>
  <div className="relative flex items-center">
    <input
      id='facebook'
      onChange={handleChange}
      className="border w-full placeholder:text-sm text-sm focus:outline-cta bg-white py-2 px-9 rounded-md"
      name="socialMediaLinks-facebook"
      placeholder="Facebook"
      value={formData.socialMediaLinks.facebook}
    />
    <Icon className="absolute w-6 h-6 left-2" icon="logos:facebook" />
  </div>
  <div className="relative flex items-center">
    <input
      id='instagram'
      onChange={handleChange}
      className="border w-full placeholder:text-sm text-sm focus:outline-cta bg-white  py-2 px-9 rounded-md"
      name="socialMediaLinks-instagram"
      placeholder="Instagram"
      value={formData.socialMediaLinks.instagram}
    />
    <Icon className="absolute w-6 h-6 left-2" icon="skill-icons:instagram" />
  </div>
  <div className="relative flex items-center">
    <input
      id='twitter'
      onChange={handleChange}
      className="border w-full py-2 px-9 placeholder:text-sm text-sm focus:outline-cta bg-white rounded-md"
      name="socialMediaLinks-twitter"
      placeholder="Twitter"
      value={formData.socialMediaLinks.twitter}
    />
    <Icon className="absolute w-6 h-6 left-2" icon="fa6-brands:square-x-twitter" />
  </div>
  <div className="relative flex items-center">
    <input
      id='youtube'
      onChange={handleChange}
      className="border w-full  py-2 px-9 placeholder:text-sm text-sm focus:outline-cta bg-white rounded-md "
      name="socialMediaLinks-youtube"
      placeholder="Youtube"
      value={formData.socialMediaLinks.youtube}
    />
    <Icon className="absolute w-6 h-6 left-2" icon="logos:youtube-icon" />
  </div>
  <div className="relative flex items-center">
    <input
      id='linkedin'
      onChange={handleChange}
      className="border w-full placeholder:text-sm text-sm focus:outline-cta bg-white py-2 px-9 rounded-md "
      name="socialMediaLinks-linkedin"
      placeholder="linkedin"
      value={formData.socialMediaLinks.linkedin}
    />
<Icon className="absolute w-6 h-6 left-2"  icon="logos:linkedin-icon" />
  </div>
</div>
                </div>
                <ToastContainer />

                    <button type="submit" className="fixed bottom-6 right-6 px-3 py-3 border rounded-full border-cta text-lg bg-cta hover:opacity-75 text-white cursor-pointer"><Icon icon="charm:tick" /></button>
             
            </form>
        </div>
    );
}

export default GeneralInfo;