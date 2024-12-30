import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import PersonalInfo from "../userview/perinfo";
import GeneralInfo from '../userview/geninfo'
import { setFormData } from "../slices/formslice";

const Formbar = () => {
  const [activesection, setActiveSection] = useState('personal');
  const formData = useSelector((state) => state.form);
  const dispatch = useDispatch();

  const handleActive = (section) => {
    setActiveSection(section);
  };

  const updateFormData = (newData) => {
    dispatch(setFormData(newData));
  };

  const handleNext = () => {
    if (activesection === 'personal') {
      setActiveSection('general');
    }
    // Add other section transitions here if needed
  };

  return (
    <div className="max-w-[30rem] w-full bg-gradient-to-tr from-span-start to-span-end flex flex-col">
      <div className="w-full bg-white top-0 h-10 flex items-center justify-between">
        <div
          onClick={() => handleActive('personal')}
          className={`h-9 px-2 w-full flex font-semibold border rounded-br-full cursor-pointer items-center justify-center ${activesection === "personal" ? "bg-cta text-white font-semibold" : ""}`}
        >
          <span>Personal details</span>
        </div>
        {/* <div
          onClick={() => handleActive('profession')}
          className={`h-9 px-2 w-full flex rounded-tl-full text-lg font-semibold border cursor-pointer items-center justify-center ${activesection === "profession" ? "bg-cta text-white font-semibold" : ""}`}
        >
          <span>Profession details</span>
        </div> */}
        <div
          onClick={() => handleActive('general')}
          className={`h-9 px-2 w-full flex rounded-tl-full font-semibold border cursor-pointer items-center justify-center ${activesection === "general" ? "bg-cta text-white font-semibold" : ""}`}
        >
          <span>General details</span>
        </div>
      </div>
      {activesection === 'personal' && <PersonalInfo onNext={handleNext} formData={formData} updateFormData={updateFormData} />}
      {/* {activesection === 'profession' && <ProfessionalInfo formData={formData} updateFormData={updateFormData} />} */}
      {activesection === 'general' && <GeneralInfo formData={formData} updateFormData={updateFormData} />}
    </div>
  );
};

export default Formbar;
