import React, { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

const Search = ()=>{
    const [activeSection,setActiveSection] = useState('People');

    const handleActiveState = (section)=>{
        setActiveSection(section)
    }
    return(
        <div>
        <div className="max-w-[30rem] p-4 w-full">
            <div className="relative w-full flex border border-gray-400 rounded-full p-2 items-center"><input className="px-2 w-5/6 focus:outline-none " placeholder="Search.." />
            <div className="absolute right-0 p-3 rounded-full bg-cta text-white"><Icon icon="stash:search-solid" /></div></div>
        </div>
        <div className="flex justify-center items-center gap-4">
            <span onClick={()=>{handleActiveState('People')}} className={`w-16 flex items-center justify-center ${activeSection==='People'&& 'border-b-2 text-cta font-semibold border-cta'}`}>People</span>
            <span onClick={()=>{handleActiveState('Posts')}} className={`w-16 flex items-center ${activeSection==='Posts'&& 'border-b-2 text-cta font-semibold border-cta'} justify-center`}>Posts</span>
            <span onClick={()=>{handleActiveState('Reels')}} className={`w-16 flex items-center  ${activeSection==='Reels'&& 'border-b-2 text-cta font-semibold border-cta'} justify-center`}>Reels</span>
        </div>
        </div>
    )
}

export default Search;