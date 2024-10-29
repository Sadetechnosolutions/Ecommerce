import React from "react";

export const fetchUserProfile = async (token) => {
    try {
      const response = await fetch('http://localhost:8081/api/auth/adminuser/get-profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      if (response.ok) {
        const data = await response.json();
        // Check if `ourUsers` exists in the response
        if (data.statusCode === 200 && data.ourUsers) {
          return data.ourUsers; // Return `ourUsers` object
        } else {
          console.error('Invalid data format:', data);
          return null;
        }
      } else {
        console.error('Failed to fetch user profile:', response.status);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };
  