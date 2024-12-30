import React,{useEffect} from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'

const Weather = () => {
    const options = { month: 'long', day: 'numeric' };
    const date = new Date();
    const filterdate = (date.toLocaleDateString('en-US', options)).toUpperCase();
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('https://api.weatherbit.io/v2.0/current?lat=35.7796&lon=-78.6382&key=01a376e4dbd249ceae244d42328ca657&include=minutely');
          if (!response.ok) {
            throw new Error('Network response was not ok.');
          }
          const data = await response.json();
          console.log(data)
        } catch (error) {
          console.error(error.message);
        }
      };
      fetchData();
    }, []);
    const weather=[{
      id:1,
      date:'29/04',
      day:'SUN',
      degree:'40 °C'
    },
    {
      id:2,
      date:'30/04',
      day:'MON',
      degree:'39 °C'
    },
    {
      id:3,
      date:'01/05',
      day:'TUE',
      degree:'43 °C'
    },
    {
      id:4,
      date:'02/05',
      day:'WED',
      degree:'32 °C'
    },
    {
      id:5,
      date:'03/05',
      day:'THU',
      degree:'37 °C'
    },
    {
      id:6,
      date:'04/05',
      day:'FRI',
      degree:'41 °C'
    },
    {
      id:7,
      date:'05/05',
      day:'SAT',
      degree:'39 °C'
    }]

    const today = weather.filter((climate =>climate.day==='MON'))

  return (
      <div style={{  backgroundImage:"url('weatherb.png')"}} className='w-full flex flex-col justify-center px-4 border bg-cover rounded-lg h-[calc(99vh-100px)]'>
        <div className=' flex flex-col bg-black justify-between bg-opacity-50 rounded-md h-96'>
        <div className='flex items-center justify-between'>
        <div className='p-2 bg-cta rounded-tl text-white flex font-semibold h-11 text-center items-center justify-center'><span>{filterdate}</span></div><span className='px-3 flex items-end text-white font-semibold'><span>San Francisco </span><Icon className='w-5 h-5' icon="uil:angle-down" /></span>
        </div>
        <div className='w-full flex flex-col items-center justify-center h-36'>
            <div className='flex flex-col'>
           {today.map((climate)=>(
            <div>
              <div className='flex gap-4 items-center'>
                          <div className='flex relative'>
                          <Icon className='w-28 sunrot h-16 ml-8 text-sun' icon="ph:sun" /></div>
                        <Icon className='w-28 text-white h-16 absolute' icon="ion:cloud-sharp"/>           
                        <div className='flex flex-col'> <span className='text-white font-bold text-xl'>{climate.degree}</span>
                        <span className='text-sun font-semibold'>Sunny</span>
</div>
</div>
            </div>
           ))}
            </div>
        </div>

        <div className='bg-black bg-opacity-40 flex gap-1 h-20'>
          {weather.map((climate)=>(
            <div key={climate.id} className='flex items-center py-4 justify-center text-white flex-col gap-2 w-1/6 text-center'>
              <span className='text-xs font-semibold text-yellow'>{climate.degree}</span>
              <div className='flex items-center justify-center relative'>
              <Icon className=' text-yellow' icon="ph:sun" /></div>
              <span className='text-xs '>{climate.day}</span>
            </div>
          ))}
        </div>
        </div>
      </div>
  )
}

export default Weather
