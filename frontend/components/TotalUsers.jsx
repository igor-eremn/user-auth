import React, { useEffect, useState, useRef } from 'react';
import '../src/App.css';
import { IoReload } from "react-icons/io5";

const TotalUsers = () => {
  const [totalUsers, setTotalUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prevTotalUsers, setPrevTotalUsers] = useState(null);
  const spanRef = useRef(null);

  const fetchTotalUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/user-auth/total-users');
      const data = await response.json();
      setPrevTotalUsers(totalUsers);
      setTotalUsers(data.totalUsers);
    } catch (error) {
      console.error('Error fetching total users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTotalUsers();
    const intervalId = setInterval(fetchTotalUsers, 1000);

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
  }, [totalUsers]);

  return (
    <div className='total'>
      {loading ? (
        <IoReload className='loading-icon' />
      ) : (
        <>
          <span ref={spanRef}>{totalUsers}</span>
        </>
      )}
    </div>
  );
};

export default TotalUsers;
