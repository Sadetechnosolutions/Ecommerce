import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import CountUp from 'react-countup';
import { Icon } from "@iconify/react/dist/iconify.js";
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import ProgressBar from "@ramonak/react-progress-bar";
import '../progressstyle.css'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Chrono } from "react-chrono";
import '../styles.css'

const Aboutus = () => {
  const userId = useSelector((state) => state.auth.userId);
  const [profile, setProfile] = useState();
  const { userID } = useParams();
  // const [shortcut, showShortcut] = useState(false);
  const [hover, setHover] = useState(null);
  const [activeSection,setActiveSection] = useState(2);
  // const [activeTitle,setActiveTitle] = useState()
  const [menu,setMenu] = useState(false)
  const [testimonialsVisible, setTestimonialsVisible] = useState(false);
  const [clientsVisible, setClientsVisible] = useState(false);
  const [countVisible, setCountVisible] = useState(false);
  const countRef = useRef(null)
  const clientsRef = useRef(null);
  const [formVisible,setFormVisible] = useState(false)
  const [file,setFile] = useState()
  const [interest,setInterest] = useState()
  const [interests,setinterests] = useState()
  const call=<Icon icon="fa6-solid:phone" />
  const address= <Icon icon="mdi:address-marker" width='1.4em' height='1.4em'  />
  const mail = <Icon icon="material-symbols:mail" width='1.4em' height='1.4em' />
  const linkedin = <Icon className='md:w-5 sm:w-4 md:h-5' icon="bi:linkedin"  />
  const [experienceVisible,setExperienceVisible] = useState(false)
  const [languageVisible,setLanguageVisible] = useState(false)
  const [contactVisible,setContactVisible] = useState(false)
  const [resumeVisible,setResumeVisible] = useState(false)
  const ResumeRef = useRef(null)
  const LanguageRef = useRef(null)
  const experienceRef = useRef(null)
  const contactRef = useRef(null)

//   useEffect(() => {
//     const handleScroll = () => {
//     };
//     window.addEventListener("scroll", handleScroll);

//     return () => {
//         window.removeEventListener("scroll", handleScroll);
//     };
// }, []);
useEffect(() => {
        setResumeVisible(true);  // Set clientsVisible to true when the section is in view
}, []);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setContactVisible(true);  // Set clientsVisible to true when the section is in view
      }
    },
    { threshold: 0.3 }  // Trigger when 50% of the section is visible
  );
  
  if (contactRef.current) {
    observer.observe(contactRef.current);
  }

  return () => {
    if (contactRef.current) {
      observer.unobserve(contactRef.current);
    }
  };
}, []);


useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setLanguageVisible(true);  // Set clientsVisible to true when the section is in view
      }
    },
    { threshold: 0.3 }  // Trigger when 50% of the section is visible
  );
  
  if (LanguageRef.current) {
    observer.observe(LanguageRef.current);
  }

  return () => {
    if (LanguageRef.current) {
      observer.unobserve(LanguageRef.current);
    }
  };
}, []);

  useEffect(() => {
    const handleScroll = () => {
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
        window.removeEventListener("scroll", handleScroll);
    };
}, []);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setExperienceVisible(true);  // Set clientsVisible to true when the section is in view
      }
    },
    { threshold: 0.3 }  // Trigger when 50% of the section is visible
  );
  
  if (experienceRef.current) {
    observer.observe(experienceRef.current);
  }

  return () => {
    if (experienceRef.current) {
      observer.unobserve(experienceRef.current);
    }
  };
}, []);


  const footer=[{
    id:1,
    icon: call,
    text:'Call me!',
    value:'(+81) 946 159 90'
  },{
    id:2,
    icon: mail,
    text:'Mail!',
    value:'Peterparker_07@gmail.com'
  },{
    id:3,
    icon: address,
    text:'Reach out!',
    value:'AVE 11, NEW YORK, USA'
  },{
    id:3,
    icon: linkedin,
    text:'Connect!',
    value:'@PeterP07'
  }]

  const item=[{
    // id: 1,
    // cardSubtitle: 'Senior Cinematographer',
    cardTitle: 'Senior Cinematographer',
    title: '2016',    },
  {
    id: 2,
    cardDetailedText: '',
    cardTitle: 'Assistant Cinematographer',
    // cardSubtitle:"University of Texas",
    title: '2012',
      },]

      const tems=[{
        id: 1,
        cardSubtitle: 'Camera operations for production, shot division decisions and ensuring high quality visuals',
        cardTitle: 'Huemen collar',
        title: '2019',    
      },
      {
        id: 2,
        cardDetailedText: '',
        cardTitle: 'cta',
        cardSubtitle:"Assisted in camera setup and various operations B",
        title: '2017',
          },
          {
            id: 3,
            cardDetailedText: '',
            cardTitle: 'Fero FT',
            cardSubtitle:"Senior Cinematographer worked in the planning of shot divisions and visual aesthetics based on landscape",
            title: '2017',
              }]

  // State to store progress for animation
  const language = [
    { id: 1, name: 'English', percentage: 90 },
    { id: 2, name: 'Spanish', percentage: 60 },
    { id: 3, name: 'French', percentage: 20 },
    { id: 4, name: 'German', percentage: 40 },
];

const [progresses, setProgresses] = useState(
    language.map((lang) => ({ ...lang, currentProgress: 0 })) // Initialize progress at 0
);

  const [progress, setProgressValues] = useState([
    { id: 1, name: 'CREATIVITY', percentage: 0 },
    { id: 2, name: 'PHOTOGRAPHY', percentage: 0 },
    { id: 3, name: 'EDITING', percentage: 0 },
    { id: 4, name: 'LEADERSHIP', percentage: 0 },
  ]);

  useEffect(() => {
    // Simulate updating progress after component mount
    setProgressValues([
      { id: 1, name: 'CREATIVITY', percentage: 70 },
      { id: 2, name: 'PHOTOGRAPHY', percentage: 85 },
      { id: 3, name: 'EDITING', percentage: 60 },
      { id: 4, name: 'LEADERSHIP', percentage: 70 },
    ]);
  }, []); 
  const customTheme = {
    primary: '#5CBE8F', // Main timeline color
    secondary: '#fff', // Secondary timeline color
    cardBgColor: '#fff', // Background color of timeline cards
    cardForeColor: '#fff', // Text color of timeline cards
    cardTitleStyle: {
      color: '#fff', // Text color of timeline card titles
    },
    cardSubtitleStyle: {
      color: '#5CBE8F', // Text color of timeline card subtitles
    },
  };
  
  const details = [{
    id:1,
    icon:<Icon icon="icon-park-outline:birthday-cake" />,
    name:'BIRTHDAY',
    value:'18-07-1994'
  },
  {
    id:2,
    icon:<Icon icon="icon-park-outline:birthday-cake" />,
    name:'STUDY',
    value:'MASTERS IN FILM STUDIES'
  },
  {
    id:3,
    icon:<Icon icon="icon-park-outline:birthday-cake" />,
    name:'AGE',
    value:'36'
  },
  {
    id:4,
    icon:<Icon icon="icon-park-outline:birthday-cake" />,
    name:'INTERESTS',
    value:'SWIMMING, COOKING, FOOTBALL'
  },
  {
    id:5,
    icon:<Icon icon="icon-park-outline:birthday-cake" />,
    name:'PHONE',
    value:'(+81) 946 159 90'
  },
  {
    id:6,
    icon:<Icon icon="icon-park-outline:birthday-cake" />,
    name:'MAIL',
    value:'PETERPARKER_07@GMAIL.COM'
  },{
    id:7,
    icon:<Icon icon="icon-park-outline:birthday-cake" />,
    name:'LOCATION',
    value:'AVE 11, NEW YORK, USA'
  }]
  const fontSizes = {
    title: '1em', // Font size for title text
    cardTitle: '1rem', // Font size for subtitle text
    cardSubtitle:'1em'
  };


  const deleteInterest = (id) => {
    const updatedInterests = interests.filter((i) => i.id !== id);
   setFormData({ ...formData, interests: updatedInterests });
};
const addInterest = () => {
    if (interest.trim() === '' || interest.length <= 1) {
      
    } else if (interests.find((i) => i.activity === interest.trim())) {

    } else if (interests.length >= 10) {
 
    } else {
        const newInterest = { id: Date.now(), activity: interest.trim() }; // Unique ID
        const updatedInterests = [...interests, newInterest];
        setFormData({ interests: updatedInterests });
        setInterest('');
    }
};
  const openForm = ()=>{
    setFormVisible(true)
  }
  const handleActiveTitle=()=>{

  }
  const closeForm=()=>{
    setFormVisible(false)
      }
  const handleActive=()=>{

  }
  const handleMenu = ()=>{
   setMenu(!menu)
  }
  // Shortcut options


  const option = [
    {
      id: 1,
      name: "Queries",
      icon: <Icon className="w-8 h-8" icon="material-symbols:help" />,
      path: `/user/${userId}`,
    },
  ];

  const options = [
    {
      id: 1,
      name: "Queries",
      icon: <Icon className="w-16 h-16" icon="healthicons:ui-user-profile" />,
      path: `/profession`,
    },
    {
      id: 2,
      name: "Queries",
      icon:<Icon className="w-16 h-16" icon="material-symbols-light:info-outline" />,
      path: `/about/${userId}`,
    },
  ];
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [product] = useState({
    title: "Sample Product",
    description: "This is a detailed description of the sample product. It has many features that you will love!",
    price: "$99.99",
    image: "https://via.placeholder.com/300",
  });

  const handleHover = (id) => {
    setHover(id);
  };

  const closeHover = () => {
    setHover(null);
  };

  // Ref for storing the element to observe
  const countUpRef = useRef(null);
  const [inView, setInView] = useState(false);

  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8080/home/api/aggregate/${userID}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [userId]);
  const handlechangeCover = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
            setFile(selectedFile); 
            console.log(file)
          
    }
};

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Intersection Observer for lazy loading the count-up animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);  // Set inView to true when the section is in the viewport
        }
      },
      { threshold: 0.5 }  // The section should be 50% visible to trigger
    );
    
    if (countUpRef.current) {
      observer.observe(countUpRef.current);
    }

    return () => {
      if (countUpRef.current) {
        observer.unobserve(countUpRef.current); // Clean up observer on unmount
      }
    };
  }, []);
  const testimonialsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setClientsVisible(true);  // Set clientsVisible to true when the section is in view
        }
      },
      { threshold: 0.5 }  // Trigger when 50% of the section is visible
    );
    
    if (clientsRef.current) {
      observer.observe(clientsRef.current);
    }

    return () => {
      if (clientsRef.current) {
        observer.unobserve(clientsRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCountVisible(true);  // Set clientsVisible to true when the section is in view
        }
      },
      { threshold: 0.9 }  // Trigger when 50% of the section is visible
    );
    
    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTestimonialsVisible(true);  // Set clientsVisible to true when the section is in view
        }
      },
      { threshold: 0.9 }  // Trigger when 50% of the section is visible
    );

    if (testimonialsRef.current) {
      observer.observe(testimonialsRef.current);
    }

    return () => {
      if (testimonialsRef.current) {
        observer.unobserve(testimonialsRef.current);
      }
    };
  }, []);
  
  const items =[
    {id:1,name:'Angela',profileImagePath:'wills.jpg',content:'It is a long established fact that a reader will be distracted by the readable content of a page when'},{id:1,name:'John',profileImagePath:'dp.jpg',content:'It is a long established fact that a reader will be distracted by the readable content of a page when'},
    {id:1,name:'Stephen',profileImagePath:'dp.jpg',content:'It is a long established fact that a reader will be distracted by the readable content of a page when'},{id:1,name:'Maddy',profileImagePath:'dp.jpg',content:'It is a long established fact that a reader will be distracted by the readable content of a page when'},
 
  ]

  const carousel = items.map((review)=>(
  <div className="testimonial-item  relative p-4 h-60 border rounded-md bg-shade flex flex-col gap-4 w-full">
    <div>

    <Icon className="w-16 text-cta h-16" icon="ri:double-quotes-l" />
    <p className="text-lg">{review.content}</p>
    </div>
    <div className="absolute right-4 bottom-4 flex items-center gap-4">
    <img className="w-11 h-11 rounded-full" src={`/profile.jpg`}/>
    <span className="flex  flex-col">
    <span className="text-cta font-semibold">{review.name.toUpperCase()}</span>
    <span>Photographer</span>
  </span>
    </div>

  </div>
 ))
 

  const data = [
    {
      id: 1,
      name: 'PORTRAIT',
      service: 'You can drag and drop an image from your computer onto the editing screen. After all, if a customer has.',
    },
    {
      id: 2,
      name: 'ENGAGEMENT',
      service: 'You can drag and drop an image from your computer onto the editing screen. After all, if a customer has.',
    },
    {
      id: 3,
      name: 'COMMERCIAL',
      service: 'You can drag and drop an image from your computer onto the editing screen. After all, if a customer has.',
    },
    {
      id: 4,
      name: 'PERSONAL',
      service: 'You can drag and drop an image from your computer onto the editing screen. After all, if a customer has.',
    },
  ];

  
  const work = [
    {
      id: 1,
      name: 'HAPPY CLIENTS',
      service: 'You can drag and drop an image from your computer onto the editing screen. After all, if a customer has.',
    },
    {
      id: 2,
      name: 'WORKING HOURS',
      service: 'You can drag and drop an image from your computer onto the editing screen. After all, if a customer has.',
    },
    {
      id: 3,
      name: 'AWARDS WON',
      service: 'You can drag and drop an image from your computer onto the editing screen. After all, if a customer has.',
    },
    {
      id: 4,
      name: 'PROJECTS COMPLETED',
      service: 'You can drag and drop an image from your computer onto the editing screen. After all, if a customer has.',
    },
  ];

  const logo = [{
    id:1,
    img:'comp.png'
  },
  {
    id:2,
    img:'wills.jpg'
  },
  {
    id:3,
    img:'random.webp'
  },
  {
    id:4,
    img:'logo5.png'
  },
  {
    id:5,
    img:'greenlogo.png'
  },
  {
    id:6,
    img:'comp.webp'
  },
  {
    id:7,
    img:'comp.png'
  },
  {
    id:8,
    img:'comp.jpg'
  }]
  const [activeItems, setActiveItems] = useState([]);

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       if (entry.isIntersecting) {
  //         setActiveItems((prev) => [...prev, entry.target]);
  //       }
  //     },
  //     { threshold: 0.5 }
  //   );

  //   const elements = document.querySelectorAll('.testimonial-item');
  //   elements.forEach((element) => observer.observe(element));

  //   return () => {
  //     elements.forEach((element) => observer.unobserve(element));
  //   };
  // }, []);


  const startValues = [1, 10, 100, 1000]; // Starting values for the 4 slots
  const endValues = [550, 825, 45, 348]; // End values for the 4 slots

  return (
    <div className="flex h-screen">

    <div className=" flex w-full p-5 h-screen scrollbar-hidden overflow-y-auto flex-col gap-16 ">
    <div className='flex flex-col font-lato w-full gap-16'>
                {/* <nav className='flex top-0 sticky justify-between bg-black items-center w-full md:h-11 sm:h-9 py-2 '>
      <div className='flex flex-col items-center'>
      <button onClick={handleMenu} className='md:h-11 sm:h-9 md:w-24 sm:w-16 flex items-center md:text-lg sm:text-sm md:gap-2 sm:gap-0 bg-white text-black font-semibold'>
      <Icon icon="mage:dots-menu"height='1.4em' width='1.4em' />
      <span>Menu</span>
      </button>
      {menu && (
        <div className='bg-white md:mt-11 sm:mt-9 sm:w-16 absolute md:w-24 slide-in-down flex items-center flex-col'>
        {options.map((option)=>(
            <div onClick={() => {handleActive(option.id);handleActiveTitle(option.title);}} className={`flex items-center justify-center w-full md:h-28 sm:h-16 cursor-pointer md:text-lg sm:text-md ${
    activeSection === option.id ? 'bg-gradient-to-tr from-span-start to-span-end text-white' : ''}`}>
  <div>{option.icon}</div>
</div>
))}
  </div>
      )}
      </div>
      <div className='flex items-center'>
      <span className='text-white md:text-3xl sm:text-xl relative font-semibold'>{activeTitle}</span>
</div>
      <div className='md:h-11 md:w-32 sm:h-9 sm:w-20 flex items-center justify-center cursor-pointer text-lg md:text-lg sm:text-xs font-semibold bg-cta text-white'>
      Contact Us?
      </div>
      </nav>
        <div style={{backgroundImage:'url(prof-bg.png)'}} className='md:min-h-screen sm:h-96 w-full flex justify-between flex-col bg-cover bg-no-repeat bg-coverImg.jpg'>
            <div>

      </div>
      <div className='w-full flex flex-col text-white md:gap-5 sm:gap-3 md:text-3xl sm:text-xl font-bold items-center '>
        <div className='text-center'>
        <p>I' AM <span className='text-ctao'>PETER PARKER</span>  </p>
        <span className='md:text-6xl sm:text-4xl'>PHOTOGRAPHER</span>
        </div>
        <div className='flex justify-center gap-8'>
       {socialmedia.map((sm)=>(
        <div key={sm.id} className='flex md:w-11 sm:w-7 md:h-11 sm:h-7 cursor-pointer hover:bg-cta hover:text-white  items-center justify-center rounded-full bg-transparent text-black'>
            <span className=''>{sm.icon}</span>
        </div>
       ))}
      </div>
      </div>
      <div>
      </div>
        </div> */}
        <div ref={ResumeRef} className={`md:h-auto w-full sm:h-auto flex gap-8 flex-col py-2`}>
        <div className='text-cta  font-bold text-2xl'>| ABOUT</div>
        <div className='flex flex-col'>
        <div className={`flex flex-col ${resumeVisible ? 'slide-in-up' : 'opacity-0'}  items-start justify-between gap-10`}>
          <div className=' md:h-[35rem] w-full inline-block overflow-hidden'>
            <img className='w-full h-[26rem] transition transition-transform cursor-pointer hover:scale-110' src={`/dp.jpg`} alt='' />
          </div>
          <div className='flex gap-8 flex-col'>
          <div className=' flex-col flex'>
          <span className=' text-3xl font-bold'>I’ AM</span>
          <span className='text-cta text-3xl font-bold'>PETER PARKER</span>
            <p className='text-sm whitespace-wrap'><br />As a Cinematographer with over 7 years of professional experience, I am deeply passionate about my craft and committed to creating visually stunning and impactful cinematic experiences. Throughout my career, I have honed my skills in both the artistic and technical aspects of cinematography, from composition and lighting to camera movement and color grading. This extensive experience has allowed me to develop a keen eye for detail and a strong understanding of how to visually tell a story that resonates with the audience.
I thrive in collaborative environments, working closely with directors, producers, and the entire creative team to bring a shared vision to life. Every step of the process, from initial discussions and concept development to shooting and post-production, is an opportunity for me to express my creativity and contribute to the overall success of the project.</p>
          </div>
          </div>
          <div className='w-full flex flex-col gap-8'>
          <div className=' flex flex-col gap-6 sm:w-full'>
            {progress.map((prog)=>(
            <div key={prog.id} className='flex flex-col gap-4'>
            <div className='flex font-semibold justify-between'><label>{prog.name}</label> <span>{prog.percentage}%</span></div>
        <ProgressBar bgColor="#5CBE8F"
  baseBgColor="#EAEAEA" 
  height="20px"
  borderRadius="5px"
  borderColor='#000'
  borderSize='2px'
  labelColor='#5CBE8F'
  transitionDuration="0.5s" 
  completed={prog.percentage}
/>
</div>
            ))}
          </div>
          {/* <div className='text-cta font-bold text-4xl'>| LANGUAGES</div> */}
        <div className='flex flex-wrap gap-4 items-center justify-between '>
          {progresses.map((languages)=>(
              <div className='flex flex-col items-center gap-4'>
        <CircularProgressbar className='w-28 h-28'
        value={languages.percentage}
        text={`${languages.percentage}%`}
        strokeWidth={10}
        styles={{
          path: { stroke: '#5CBE8F' },
          text: { fill: '#000', fontSize: '20px' },
        }}
      />
      <span className='text-xl'>{languages.name}</span>
              </div>
          ))}
        </div>
        </div>
        </div>

        </div>
        <div className='  flex gap-4 flex-wrap'>
          {details.map((info)=>(
          <div key={info.id} className='p-1 flex items-center bg-cta bg-opacity-10 rounded-md text-cta gap-2 text-sm border border-cta'><span className='font-semibold flex items-center gap-2'>{info.icon} {info.name}:</span><span className='text-black text-xs'>{info.value}</span></div>
          ))}
        </div>
        </div>
        <div ref={experienceRef} className={`flex ${experienceVisible ? 'slide-in-up' : 'opacity-0'} flex-col w-full gap-16`}>
        <div className='flex w-full flex-col gap-12'>
      <div className='text-cta font-bold text-2xl'>| EXPERIENCE</div>
      <div className=''>
        <Chrono theme={customTheme} fontSizes={fontSizes}
 items={tems} enableQuickJump={false} cardHeight={100} cardWidth={200} disableToolbar={true} enableLayoutSwitch={false} mode='VERTICAL' />
 </div>
      </div>
        <div className='flex flex-col gap-12'>
        <div className='text-cta font-bold text-2xl'>| CAREER</div>

        <Chrono theme={customTheme} fontSizes={fontSizes}
 items={item} enableQuickJump={false} cardHeight={100} cardWidth={200} borderLessCards={true} disableToolbar={true} enableLayoutSwitch={false} mode='VERTICAL' />
      </div>
      </div>

      </div>
            <img className="w-full h-36 object-cover" src={`/job.jpg`} />
      <div className="flex flex-col items-center gap-10">
        <div className="flex flex-col gap-4">
          <span className="text-2xl font-semibold">WHAT I DO</span>
          <span className="line-clamp-4 overflow-hidden display-webkit-box">
            You can drag and drop an image from your computer onto the editing screen. After all, if a customer has to go
            through a million of steps to send you money, they will probably just give up. Motion design is one of the most
            powerful tools designers have.
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-sm w-28">AGE</span> <span className="w-1/2 text-xs">23</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-sm w-28">COUNTRY</span> <span className="w-1/2 text-xs">{profile?.user.country}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-sm w-28">ADDRESS</span> <span className="w-1/2 text-xs">No:29, 1st street, kenathukidavu, Coimbatore</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-sm w-28">E-MAIL</span> <span className="w-1/2 text-xs"> {profile?.user.email}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-sm w-28">PHONE</span> <span className="w-1/2 text-xs">{profile?.user.phno}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <span className="text-2xl font-semibold">MY SERVICES</span>
        <div className="flex flex-col gap-10">
          {data.map((info) => (
            <div key={info.id} className="relative overflow-hidden bg-shade p-10 border border-cta gap-2 rounded-lg flex flex-col">
              <span className="font-semibold text-cta text-2xl">{info.name}</span>
              <span>{info.service}</span>
              <span className="absolute -bottom-2 -left-2 bg-cta rounded-full p-5"></span>
            </div>
            
          ))}
        </div>
      </div>
      <div ref={countRef} className={`flex flex-col ${countVisible ? 'slide-in-up' : 'opacity-0'} gap-8`}>
        <span className="text-2xl font-semibold">FUN FACTS</span>
        <div  className="flex items-center">
          <div className="flex flex-wrap gap-4 justify-between">
            {startValues.map((start, index) => (
              <div key={index} className="flex flex-col gap-2 items-center" ref={countUpRef}>
                {/* Display the corresponding service name and its countup */}
                {inView && (
                  <CountUp start={start} end={endValues[index]} duration={3} delay={0}>
                    {({ countUpRef }) => <div className="text-6xl font-semibold text-cta" ref={countUpRef}></div>}
                  </CountUp>
                )}
                <div className="font-semibold text-">{work[index].name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8">
      <span className="text-2xl font-semibold">TESTIMONIALS</span>
<div className={` ${testimonialsVisible ? 'slide-in-up' : 'opacity-0'}`} ref={testimonialsRef}>
<AliceCarousel className='testimonialsRef'
  mouseTracking
  items={carousel} // Pass the items you want to display
  responsive={{
    0: { items: 1 },       // 1 item at a time for very small screens
    600: { items: 2 },     // 2 items at a time for medium-sized screens (600px and up)
    1024: { items: 2 },    // 2 items at a time for larger screens (1024px and up)
  }}
  autoPlay
  autoPlayInterval={3000}
  disableDotsControls // Optionally disable the dots navigation
  disableButtonsControls // Optionally disable the next/prev buttons
  dragEnabled={true} // Enable dragging
  infinite={true} 
  style={{ display: 'flex', gap: '16px' }}  // Infinite loop
/>
</div>

      </div>
      <div className="flex flex-col gap-8">
      <span className="text-2xl font-semibold">CLIENTS</span>
      <div
            ref={clientsRef}
            className={`flex flex-wrap gap-6 ${clientsVisible ? 'slide-in-up' : 'opacity-0'}`}
            style={{ transition: 'opacity 1s ease-out' }}
          >
            {logo.map((image) => (
              <div key={image.id} className="w-1/6 h-28 bg-shade rounded-md flex items-center justify-center">
                <img className="w-24 h-16" src={`/${image.img}`} alt="client logo" />
              </div>
            ))}
          </div>
      </div>
      <div ref={contactRef} className={`flex ${contactVisible ? 'slide-in-up' : 'opacity-0'} flex-col gap-12`}>
        <div className='text-cta font-bold text-2xl'>| CONTACT ME</div>
        <div className='flex  flex-wrap gap-4'>
        {footer.map((items)=>(
         <div key={items.id} className='w-72 cursor-pointer parent h-52 bg-cta hover:bg-white rounded-lg border-4 border-cta flex flex-col gap-2 items-center justify-center'>
         <div className='bg-white h-11 child w-11 rounded-full flex items-center justify-center text-black'><span className='text-cta child-i'>{items.icon}</span></div>
         <span className='text-white child-t  font-bold text-lg'>{items.text}</span>
         <p className="child-t text-white">{items.value}</p>
         </div>
        ))}
        </div>
          </div>
        {/* <div className=' fixed flex flex-col gap-4 bottom-4 right-4 h-auto'>
          {option.map((option) => (
            option.name === "Logout" ? (
              <div
                key={option.id}
                onClick={option.onClick}  // Trigger the handleLogout function directly
                onMouseEnter={() => handleHover(option.id)}
                onMouseLeave={closeHover}
                className={`relative flex items-center rounded-full bg-gradient-to-tr from-span-start to-span-end ${hover === option.id ? 'w-40' : 'w-11'} transition-all duration-300`}
              >
                <div className='w-11 h-11 slide-in-down duration-500 flex items-center cursor-pointer justify-center border bg-cta rounded-full'>
                  <span data-tooltip-content={option.name} data-tooltip-id="mytooltip" className='flex items-center justify-center text-white'>
                    {option.icon}
                  </span>
                </div>
                {hover === option.id && <div className='text-white ml-4 flex'>{option.name}</div>}
              </div>
            ) : (
              <NavLink to={option.path} key={option.id}>
                <div
                  onMouseEnter={() => handleHover(option.id)}
                  onMouseLeave={closeHover}
                  className={`relative flex items-center rounded-full bg-gradient-to-tr from-span-start to-span-end ${hover === option.id ? 'w-40' : 'w-11'} transition-all duration-300`}
                >
                  <div className='w-11 h-11 slide-in-down duration-500 flex items-center cursor-pointer justify-center border bg-cta rounded-full'>
                    <span data-tooltip-content={option.name} data-tooltip-id="mytooltip" className='flex items-center justify-center text-white'>
                      {option.icon}
                    </span>
                  </div>
                  {hover === option.id && <div className='text-white ml-4 flex'>{option.name}</div>}
                </div>
              </NavLink>
            )
          ))}
        </div> */}

    </div>
          {/* <nav className='flex top-0 sticky justify-between items-center md:h-11 sm:h-9 py-2 '>
            <div onClick={openForm} className="py-2 px-4 flex gap-1 cursor-pointer items-center bg-gradient-to-tr from-span-start to-span-end text-white">
            <Icon className="w-5 h-5" icon="material-symbols:edit" />
             Edit
            </div>

      </nav> */}

      </div>
  );
};

export default Aboutus;
