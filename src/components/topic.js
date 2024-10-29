import React,{useState} from "react";


const Topic = ()=>{
    const [activesection, setActiveSection] = useState('personal');
    const handleActive = (section) => {
      setActiveSection(section);
    };
    
    return(
    <div>
          <div className=" max-w-[30rem] w-full top-0 flex items-center justify-between">
        <div
          onClick={() => handleActive('personal')}
          className={`py-1 px-2 w-full flex text-sm font-semibold border rounded-br cursor-pointer items-center justify-center ${activesection === "personal" ? "bg-cta text-white font-semibold" : ""}`}
        >
          <span>personal</span>
        </div>
        <div
          onClick={() => handleActive('profession')}
          className={`py-1 px-2 w-full flex rounded-tl text-sm font-semibold border cursor-pointer items-center justify-center ${activesection === "profession" ? "bg-cta text-white font-semibold" : ""}`}
        >
          <span>Professional</span>
        </div>
      </div>
    </div>
    )
}

export default Topic;