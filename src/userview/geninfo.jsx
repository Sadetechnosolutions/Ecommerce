import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setFormData,resetFormData } from "../slices/formslice";
import moment from 'moment';
import { useNavigate } from "react-router";

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
    const currentDate = moment().format('YYYY-MM-DD');

    // Create a FormData object for the file uploads and form data
    const formDataObj = new FormData();

    // Create userJson as a JSON string
    const userJson = {
        name: formData.displayName || '',
        aboutMe: formData.aboutYourself || '',
        birthday: formData.birthday 
            ? moment(formData.birthday).format('YYYY-MM-DD') 
            : '',
        phno: `${formData.countryCode || '+91'}${formData.phno || ''}`,
        bloodGroup: formData.bloodGroup || '',
        gender: formData.gender || '',
        country: formData.country || '',
        occupation: formData.profession || '',
        joined: currentDate,
        userid: userId,
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

    // Log the FormData object for debugging
    // Note: You can't log FormData object directly; instead, use this method:
    for (let [key, value] of formDataObj.entries()) {
        console.log(`${key}:`, value);
    }

    try {
        const response = await fetch('http://localhost:8082/api/users/createUserWithImages', {
            method: 'POST',
            body: formDataObj,
        });
        dispatch(resetFormData());
        if (response.ok) {
            dispatch(resetFormData());
            const data = await response.json();
            console.log('API Response Data:', data); // Log the response for debugging
            navigate('/newsfeed')
            return data.ourUsers;
        } else {
            // Log detailed error message
            const errorText = await response.text();
            console.error('Error:', response.status, errorText);
            return null;
            navigate('/newsfeed')
        }
    } catch (error) {
        console.error('Error:', error);
        navigate('/newsfeed')
        return null;
    }
};

    const maxLengthCheck = (object) => {
        if (object.target.value.length > object.target.maxLength) {
         object.target.value = object.target.value.slice(0, object.target.maxLength)
          }
        }


    return (
        <div className="h-[58rem] items-center flex justify-center">
            <form onSubmit={handleSubmit} className="relative w-1/2 h-[55rem] px-8 py-4 rounded-lg flex bg-white flex-col gap-4">
                <div className="flex flex-col w-full justify-content gap-4">

                    <div className="flex flex-col gap-2">
                        <label className="font-semibold">Hobbies</label>
                        <input
                            id='hobbies'
                            type="text"
                            onChange={handleChange}
                            className="border border-gray-600 border-b p-2 rounded-md"
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
                                className='px-3 py-2 text-sm border-gray-600 border border-b w-full rounded-md'
                                type='text'
                                placeholder='What are your interests'
                            />
                            <button
                                type='button'
                                className='border rounded-md text-cta hover:bg-cta hover:text-white px-6 py-2 border-cta'
                                onClick={(e) => {
                                    e.preventDefault();
                                    addInterest();
                                }}
                            >
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
                                    className="border border-b border-gray-600 p-2 rounded-md"
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
                                    className="border border-b w-1/2 border-gray-600 p-2 rounded-md"
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
                                    className="border border-b w-1/2 border-gray-600 p-2 rounded-md"
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
      className="border w-full border-b border-gray-600 py-2 px-9 rounded-md focus:outline-none"
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
      className="border w-full border-b py-2 px-9 border-gray-600 rounded-md focus:outline-none"
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
      className="border w-full border-b py-2 px-9 border-gray-600 rounded-md focus:outline-none"
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
      className="border w-full border-b py-2 px-9 border-gray-600 rounded-md focus:outline-none"
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
      className="border w-full border-b py-2 px-9 border-gray-600 rounded-md focus:outline-none"
      name="socialMediaLinks-linkedin"
      placeholder="linkedin"
      value={formData.socialMediaLinks.linkedin}
    />
<Icon className="absolute w-6 h-6 left-2"  icon="logos:linkedin-icon" />
  </div>
</div>
                </div>
                <ToastContainer />
                <div className="relative px-8 py-6 w-full flex bottom-0 right-0 items-center justify-between">
                    <button type="submit" className="absolute right-0 px-3 py-1.5 border rounded-md border-cta text-lg bg-cta hover:opacity-75 text-white cursor-pointer">Submit</button>
                </div>
            </form>
        </div>
    );
}

export default GeneralInfo;

// // {
//     "name": "Sreeman R",
//    "aboutMe": "Lives in chennai",
//    "birthday": "18-06-2001",
//    "phno": "+919785462102",
//    "bloodGroup": "A+ve",
//    "gender": "Male",
//    "country": "India",
// //     "occupation": "Cinematographer",
// //     "joined": "2021-12-20",
// // "userid":3,
// //     "email": "peterparker07@design.com",
// //     "hobbies": "I like to ride the bicycle, swimming, and working out. I also like reading design magazines, and searching on internet, and also binge watching a good hollywood Movies while it’s raining outside.",
// //     "education": "Master of computer science, sixteen years degree From Oxford Uniersity, London",
// //     "interests": [
// //         {"activity": "Swimming"},
// //         {"activity": "Photography"},
// //         {"activity": "Street Art"},
// //         {"activity": "Anime"},
// //         {"activity": "Music"}
// //     ],
// //     "workExperience": [
// //         {"work": "Assistant Cinematographer", "experience": "Assisted in camera setup and various operations"},
// //         {"work": "Cinematographer", "experience": "Camera operations for production, shot division decisions and ensuring high quality visuals"}
// //     ],
// //  "socialMediaLinks": {
           
// //             "twitter": "@john_doe",
// //             "instagram": "@john_doe",
// //             "facebook": "john.doe",
// //             "youtube": "john.doe",
// //             "linkedin": "john-doe"
// //         }
// // }

// {
// "name": "Sreeman R",
// "aboutMe": "Lives in chennai",
// "birthday": "2001-06-18",
// "phno": "+919785462102",
// "bloodGroup": "A+ve",
// "gender": "Male",
// "country": "India",
// "occupation": "Developer",
// "joined": "2024-08-07",
// "userid": 4,
// "email": "sreemanvk@gmail.com",
// "hobbies": "i play cricket",
// "education": "Bsc Computer Science, SNMV, 2021",
// "interests": [{"activity":"football"},{"activity":"anime"}],
// "workExperience": [{"work":"developer","experience":"1"}],
// "socialMediaLinks": {"facebook":"https://www.facebook.com/","instagram":"https://www.instagram.com/","twitter":"https://www.x.com/","youtube":"https://www.youtube.com/","linkedin":"https://www.linkedin.com/"}
// }