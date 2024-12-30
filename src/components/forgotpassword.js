import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

import { NavLink } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Forgotpassword = () => {
  const [user,setUser] = useState( {email: '',password:'',confirmPassword:''});
  const [otp,setOtp] = useState(Array(6).fill(''))
  const [emailotp,showemailotp] = useState(true);
  const [verifyotp,showVerifyotp] = useState(false)
  const [error,setError] = useState('')
  const navigate= useNavigate();
  const gotoSignin = ()=>{
  navigate("/");
  }

function isValidMobileNumber(input) {
  const mobileRegex = /^[0-9]{10}$/;
  return mobileRegex.test(input);
}

const handleClosemail = ()=>{
  showemailotp(false);
  navigate('/')
}

const handleInputChange = (e) => {
  const { name, value } = e.target;
    setUser({ ...user, [name]: value });
};

const handleshowotp = ()=>{
  showVerifyotp(true);
}

const handlecloseotp = ()=>{
  showVerifyotp(false)
}

const isValidEmail = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};
const handleSendOtp = async (e) => {
  e.preventDefault();

  const { email } = user;
  if (!email) {
    setError('Please enter your Email/ Phone number');
    return;
  }

  if (!isValidEmail(email) && !isValidMobileNumber(email)) {
    setError('Invalid Email/ Phone number');
    return;
  }
  setError(''); // Clear previous errors if any

  const payload = { email };
  const token = localStorage.getItem('token')
  try {
    console.log('Sending payload:', JSON.stringify(payload));
    const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':`Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    if (response.ok) {
      const data = await response.json();
      console.log('Sent code for email reset');
      handleClosemail()
      handleVerifyOtp()
      // Handle success based on your backend response
      if (data.ok) {
        // Backend success handling
      } else {
        // Handle unexpected successful responses
      }
    } else {
      const errorText = await response.text();
      setError(`Error: ${errorText}`);
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    setError('An error occurred while sending OTP.');
  }
};
const handleVerifyOtp = async (e) => {
  e.preventDefault();
  if (otp.some(field => field === '')) {
    toast.error('Please enter the complete OTP.');
    return;
  }
  const payload = {
      email:user.email,
      otp: otp.join(''),
      newPassword:user.password,
      confirmPassword:user.confirmPassword,
    };
  const token = localStorage.getItem('token')
  try {
    console.log('Sending data:', JSON.stringify(payload));
    const response = await fetch('http://localhost:8080/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      body: JSON.stringify(payload),
      credentials: 'include'
    });
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    if (response.ok) {
      const { token } = await response.json();
      localStorage.setItem('token', token);
      console.log('Form data submitted successfully');
      toast.success('Password has been changed successfully');
      setTimeout(() => navigate('/'), 5000);
      setOtp(Array(6).fill(''));
      setUser({email:'', password:'',confirmPassword:''})
      // navigate('/resetpassword');
    } 
    else {
      console.error('Failed to submit data:', await response.text());
      toast.error('OTP is invalid!');
      setOtp(Array(6).fill(''));
      setUser({password:'',confirmPassword:''})
    }
  } catch (error){
    console.error('Error submitting data:', error);
  }
};
const handleChange = (e, index) => {
  const { value } = e.target;
  if (/^[0-9]?$/.test(value)) { // Ensure value is a digit or empty
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // Move focus to the next input if there is a value
      if (value && index < otp.length - 1) {
          document.getElementById(`otp-${index + 1}`).focus();
      }
  }
};

const handleKeyDown = (e, index) => {
  if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move focus to the previous input if the current input is empty and backspace is pressed
      document.getElementById(`otp-${index - 1}`).focus();
  }
};

  return (
    <>
      <div className='min-h-screen bg-gradient-to-tr from-span-start to-span-end items-center justify-center'>
        <Modal  style={{
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      backgroundColor: 'transparent',
      transform: 'translate(-50%, -30%)',
      height: '80%',
      overflow: 'hidden', // Ensure content does not overflow
      border: 'none',
    },
  }}
  isOpen={emailotp}
  onRequestClose={handleClosemail}>
   
        <form onSubmit={handleSendOtp} className='border py-2 items-center justify-center text-center bg-white border-gray rounded-md ' >
        <div className='mb-2 py-2 border-b'>Forgot password</div>
        <div className='flex flex-col px-4'>
        <p className='mb-4'>Reset your password in two quick steps</p>
        <div className='flex flex-col items-center gap-2'>
        <div className='flex flex-col gap-1 mb-2'>
          <p>Email/ Phone number</p>
          <input id='email' name='email' className='px-3 py-2 text-sm border w-full  border-gray rounded-md focus:border-gray' type='text' value={user.email} onChange={(e)=>setUser({ email: e.target.value })}placeholder='Enter your Email/ Phone number' />
          </div>
          <div className='flex  gap-3'><button onClick={gotoSignin} className='border border-gray hover:border-gray-400 bg-gray-100 py-2 px-4 text-black rounded-md' >Back</button><button type='submit' className='bg-gradient-to-tr from-span-start to-span-end text-white py-2 px-4 rounded-md'>Send code</button></div>
          <div className='text-red'>{error}</div>
          </div>
        </div>
        </form>

        </Modal>
        <Modal style={{
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      backgroundColor: 'transparent',
      transform: 'translate(-30%, -30%)',
      width: '80%',
      height: '80%',
      overflow: 'hidden', // Ensure content does not overflow
      border: 'none',
    },
  }}
  isOpen={verifyotp}
  onRequestClose={handlecloseotp}>
          <form onSubmit={handleVerifyOtp} className='border border-gray bg-white w-1/2 rounded-md'>
      <div className='mb-2 p-4 border-b'>Reset password</div>
      <div className='w-full flex flex-col gap-2 items-center justify-center'>
      <p>OTP</p>
          <div className='flex gap-2'>
          {otp.map((value, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            className='px-3 py-2 text-sm border w-12 border-gray rounded-md focus:border-gray text-center'
                                            type='text'
                                            maxLength='1'
                                            onChange={(e) => handleChange(e, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                            value={value}
                                            placeholder='0'
                                        />
                                    ))}
          </div>
          </div>
      <div className='flex items-center flex-col p-6'>
      <div className='flex mb-6 w-1/2 items-center flex-col gap-4'>
        <input id='password' name='password' onChange={handleInputChange} value={user.password} className='px-3 py-2 text-sm border w-full border-gray rounded-md' type='password' placeholder='Enter your password'/>
        <input id='confirmPassword' name='confirmPassword' onChange={handleInputChange} value={user.confirmPassword}  className='px-3 py-2 text-sm border w-full border-gray rounded-md' type='password' placeholder='Confirm your password'/>
      </div>
      <div className='flex gap-3'>
        <NavLink to='/'><button className='bg-gray border border-gray text-black hover:border-gray-400 py-2 px-4 rounded-md'>Cancel</button></NavLink>
        <button type='submit' className='bg-gradient-to-tr from-span-start to-span-end text-white py-2 px-4 rounded-md'>Confirm</button>
      </div>
      </div>
      </form>
        </Modal>
      </div>
    </>
  )
}

export default Forgotpassword;
