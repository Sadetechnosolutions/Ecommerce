import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setFormData } from "../slices/formslice";

const ProfessionalInfo = () => {
    const dispatch = useDispatch();
    const formData = useSelector((state) => state.form);
    const [showAdditionalExperience, setshowAdditionalExperience] = useState(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
    
    if (name.startsWith("workExperience")) {
            const [_, index, field] = name.split('-');
            const updatedworkExperience = formData.workExperience.map((exp, idx) => 
                idx === parseInt(index) ? { ...exp, [field]: value } : exp
            );
            dispatch(setFormData({ workExperience: updatedworkExperience }));
        }
        else {
            dispatch(setFormData({ [name]: value }));
        }
    };
    
    const addWorkExperience = () => {
        setshowAdditionalExperience(true);
        const updatedExperience = [...formData.workExperience, { field: '', university: '' }];
        dispatch(setFormData({ workExperience: updatedExperience }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(formData);
            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                console.log('Form data submitted successfully');
            } else {
                console.error('Failed to submit form data');
            }
        } catch (error) {
            console.error('Error submitting form data:', error);
        }
    }

    return (
        <div className="h-[58rem] items-center flex justify-center">
            <form onSubmit={handleSubmit} className="relative w-1/2 h-[55rem] px-8 py-4 rounded-lg flex bg-white flex-col gap-4">
            <div className="flex flex-col gap-2">
    <label className=" font-semibold">Your Profession</label>
    <input name="profession" value={formData.profession} onChange={handleChange} className="p-2 rounded-md w-full border border-gray-600" placeholder="Enter your Profession" />
</div>
            </form>
        </div>
    )
}

export default ProfessionalInfo;
