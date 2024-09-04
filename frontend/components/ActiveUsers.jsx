import React, { useEffect, useState, useRef } from 'react';
import '../src/App.css';
import { IoReload } from "react-icons/io5";

const ActiveUsers = () => {
  const [activeUsers, setActiveUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prevActiveUsers, setPrevActiveUsers] = useState(null);
  const spanRef = useRef(null);

  const fetchActiveUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/user-auth/active-users');
      const data = await response.json();
      setPrevActiveUsers(activeUsers);
      setActiveUsers(data.activeUsers);
    } catch (error) {
      console.error('Error fetching active users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveUsers();
    const intervalId = setInterval(fetchActiveUsers, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (spanRef.current) {
      spanRef.current.classList.add('hidden');
      const timer = setTimeout(() => {
        spanRef.current.classList.remove('hidden');
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [activeUsers]);

  return (
    <div className='total'>
      {loading ? (
        <IoReload className='loading-icon' />
      ) : (
        <>
          <span ref={spanRef}>{activeUsers}</span>
        </>
      )}
    </div>
  );
};

export default ActiveUsers;
