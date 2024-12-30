import React, { useState, useEffect } from 'react';
import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useSelector } from 'react-redux';
import axios from 'axios';
import 'primereact/resources/themes/saga-blue/theme.css';  // Theme
import 'primereact/resources/primereact.min.css';           // Core styles
import { Calendar } from 'primereact';

const Birthday = () => {
  const options = { month: 'long', day: 'numeric' };
  const today = new Date();
  const currentDate = today.toLocaleDateString('en-US', options);

  const userId = useSelector((state) => state.auth.userId);

  const [selectedDate, setSelectedDate] = useState(null); // State to hold selected date
  const [showCalendar, setShowCalendar] = useState(false); // State to control calendar visibility
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setIsDarkMode(savedMode);
  }, []);

  const responsive = {
    0: { items: 1 },
    600: { items: 1 },
    1024: { items: 1 },
    1600: { items: 1 },
  };

  const renderNextButton = ({ isDisabled, onClick }) => (
    <button
      className="absolute p-2 flex hover:bg-pink hover:text-white items-center justify-center bg-gray-100 rounded-full -mt-32 ml-32"
      onClick={onClick}
      disabled={isDisabled}
    >
      <Icon icon="grommet-icons:next" />
    </button>
  );

  const renderBackButton = ({ isDisabled, onClick }) => (
    <button
      className="absolute p-2 hover:bg-pink hover:text-white bg-gray-100 rounded-full -mt-32 -ml-40"
      onClick={onClick}
      disabled={isDisabled}
    >
      <Icon icon="ic:twotone-arrow-back-ios" />
    </button>
  );

  const fetchFriends = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get('http://localhost:8080/friend-requests/2/friends', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setFriends(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchUserDetails = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await axios.get('http://localhost:8080/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(response.data);
      fetchFriends();
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const handleDateClick = () => {
    setShowCalendar(!showCalendar); // Toggle calendar visibility
  };

  const handleDateChange = (e) => {
    const date = e.value;
    setSelectedDate(date);
    setShowCalendar(false); // Hide calendar after selecting date
  };

  // Ensure selectedDate is a Date object for correct comparison
  const selectedDateString = selectedDate ? selectedDate.toLocaleDateString('en-US', options) : currentDate;

  const filteredUsers = users.filter((user) => {
    const date = new Date(user.birthday);
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    return formattedDate === selectedDateString;
  });

  // Helper function to calculate the number of months until the birthday
  const calculateMonthsUntilBirthday = (birthday) => {
    const currentYear = today.getFullYear();
    let birthdayDate = new Date(birthday);
    birthdayDate.setFullYear(currentYear);

    // If the birthday has already passed this year, adjust to next year
    if (birthdayDate < today) {
      birthdayDate.setFullYear(currentYear + 1);
    }

    const diffTime = birthdayDate - today;
    const diffDays = diffTime / (1000 * 3600 * 24);
    const diffMonths = Math.floor(diffDays / 30);
    return diffMonths;
  };

  // Filter upcoming birthdays
  const upcomingBirthdays = users
    .filter((user) => {
      const isFriend = friends?.friends?.some((friend) => friend.id === user.userid);
      return !isFriend; // Filter out friends
    })
    .map((user) => {
      return {
        ...user,
        monthsUntilBirthday: calculateMonthsUntilBirthday(user.birthday),
      };
    })
    .filter((user) => user.monthsUntilBirthday >= 0) // Only show future birthdays
    .sort((a, b) => a.monthsUntilBirthday - b.monthsUntilBirthday); // Sort by closest birthday

  return (
    <div className={`max-w-[30rem] w-full ${isDarkMode ? 'gray-bg' : 'white-bg'} h-[calc(99vh-100px)] flex flex-col gap-6 rounded-md`}>
      <div className="w-full px-4 py-2 flex justify-between items-center bg-pink text-lg font-semibold ">
        <span className="text-white">Birthdays</span>
        <span className="bg-pink text-center w-1/2" onClick={handleDateClick}>
          <Calendar
            value={selectedDate}
            onChange={handleDateChange}
            placeholder={currentDate}
            showButtonBar
            dateFormat="dd/MM"
            className=" px-2 "
          />
        </span>
      </div>
      {showCalendar && (
        <div className="px-4"></div>
      )}
      {filteredUsers.length > 0 ? (
        <AliceCarousel
          disableDotsControls
          responsive={responsive}
          autoPlay
          infinite
          autoPlayInterval={4000}
          renderNextButton={renderNextButton}
          renderPrevButton={renderBackButton}
        >
          {filteredUsers.map((user) => (
            <div key={user.id} className={`flex flex-col gap-2 items-center justify-center`}>
              <div className="flex items-center gap-2">
                <img className="w-16 h-16 rounded-full" src={user.profileImagePath} alt={`Profile of ${user.name}`} />
              </div>
              <span className="relative text-lg flex items-end font-semibold w-64">
                {user.name} celebrating their birthday today <span className="absolute bottom-0 text-center left-32 items-center gap-1 flex">
                  <Icon className="w-6 h-6" icon="noto:party-popper" />
                </span>
              </span>
              <div>
                <img className="w-36 h-36" src="birthday.gif" alt="Birthday celebration" />
              </div>
            </div>
          ))}
        </AliceCarousel>
      ) : (
        <div className="text-center py-4 text-lg font-semibold">
          <span>No birthdays today</span>
          <div className="w-full flex justify-center">
            <img className="w-36 h-36" src="birthday.gif" alt="No birthdays" />
          </div>
        </div>
      )}
      <span className="px-4 font-semibold">Upcoming Birthdays</span>
      <div className="px-4 flex flex-col gap-4">
        {upcomingBirthdays.map((user) => (
          <div key={user.userid} className={`flex ${isDarkMode ? 'lightgray-bg' : 'white-bg'} rounded-md py-4 px-4 flex-col`}>
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-2">
                <img className="w-9 h-9 rounded-full" src={user.profileImagePath} alt={user.name} />
                {user.name}
              </div>
              <span>
                {new Date(user.birthday).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'long',
                })} ({user.monthsUntilBirthday} months away)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Birthday;
