import React from 'react';
import './App.css';
import TotalUsers from '../components/TotalUsers';
import ActiveUsers from '../components/ActiveUsers';

function App() {
  return (
    <>
      <div className="auth-window">

      </div>

      <div className="user-circle bottom-left" data-note="Total Users">
        <TotalUsers />
      </div>

      <div className="user-circle bottom-right" data-note="Active Users">
        <ActiveUsers />
      </div>
    </>
  );
}

export default App;
