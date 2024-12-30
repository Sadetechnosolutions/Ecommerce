import React,{useState, useEffect} from "react";
import Createpost from "../components/createpost";
import Post from "../components/post";
import Story from "../components/story";
import Profession from "../components/profession";

const Home = ()=>{
    const [activesection, setActiveSection] = useState('personal');
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
      const savedMode = localStorage.getItem("darkMode") === "true";
      setIsDarkMode(savedMode);
    }, []);

    const handleActive = (section) => {
      setActiveSection(section);
    };
    
    return(
        <div className={`max-w-[30rem] w-full h-screen ${isDarkMode? 'dark-bg' : 'white-bg'} px-4  flex flex-col overflow-y-auto scrollbar-hidden gap-2`}>
                <div className={`max-w-[30rem] ${isDarkMode? 'gray-bg' : 'white-bg'} w-full top-0 flex items-center justify-between`}>
        <div
          onClick={() => handleActive('personal')}
          className={`py-1 px-2 w-full flex rounded-tl text-sm font-semibold cursor-pointer items-center justify-center 
            ${activesection === "personal" 
              ? "bg-cta text-white font-semibold" 
              : ''}`}
        >
          <span>personal</span>
        </div>
        <div
          onClick={() => handleActive('profession')}
          className={`py-1 px-2 w-full flex rounded-tl text-sm font-semibold  cursor-pointer items-center justify-center 
            ${activesection === "profession" 
              ? "bg-cta text-white font-semibold" 
              : ''}`}
          
        >
          <span>Professional</span>
        </div>
      </div>
        <Story />
        <Createpost />
      {activesection ==='personal'?  <Post />:<Profession />}
        </div>
    )
}

export default Home;