import React, { useState } from "react";
import '../src/App.css';

const AuthWindow = () => {
    const [user, setUser] = useState(null);
    const [currentView, setCurrentView] = useState("signIn");

    const handleSignedInClick = async () => {
        const email = document.querySelector('input[type="email"]').value;
        const password = document.querySelector('input[type="password"]').value;

        try {
            if((email == '') || (password == '')){
                alert("Enter your information");
                return;
            }

            const response = await fetch(`http://localhost:3000/user-auth/search-by-email/${email}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            });

            if (response.status === 404) {
                alert("No user found");
                return;
            }

            const user = await response.json();
            
            if (user.password !== password) {
                alert("Wrong password");
                return;
            }
            setUser(user);
            setCurrentView("account");

        } catch (error) {
        alert("An error occurred during sign-in");
        console.error(error);
        }
    };

    const handleSignedUpClick = async () => {
        const email = document.querySelector('input[type="sup-email"]').value;
        const username = document.querySelector('input[type="sup-user"]').value;
        const password = document.querySelector('input[type="sup-password-1"]').value;
        const confirmPassword = document.querySelector('input[type="sup-password-2"]').value;
  
        // Basic validation
        if (!email || !username || !password || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
        }
    
        if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
        }
    
        try {
        const response = await fetch('http://localhost:3000/user-auth/sign-up', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, password }),
        });
    
        if (response.status === 201) {
            const newUser = JSON.stringify({ email, username, password });
            setUser(newUser);
            handleAccountClick();
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
        } catch (error) {
        alert("An error occurred during sign-up.");
        console.error(error);
        }
    };
    

    const handleAccountClick = () => setCurrentView("account");
    const handleSignUpClick = () => setCurrentView("signUp");
    const handleSignInClick = () => setCurrentView("signIn");
    const handleDeleteAccount = async () => {
        if (!user) return;
      
        const email = user.email; // Directly use user.email if it is a string
      
        try {
          const response = await fetch(`http://localhost:3000/user-auth/delete/${encodeURIComponent(email)}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
          });
      
          if (response.status === 200) {
            alert("Account deleted successfully.");
            setUser(null); // Clear user state
            setCurrentView("signIn"); // Redirect to sign-in view
          } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
          }
        } catch (error) {
          alert("An error occurred during account deletion.");
          console.error(error);
        }
      };      
    const handleSignOutClick = () => {
        setUser(null);
        setCurrentView("signIn");
    }

    return (
        <>
            {currentView === "signIn" && (
                <div className="auth-box">
                <h2 className="header">Login</h2>
                <div className="auth-container">
                    <p>Welcome to the website</p>
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                </div>
                <p className="switch-option" onClick={handleSignUpClick}>Don't have an account?</p>
                <div className="button-container-l">
                    <button onClick={handleSignedInClick}>Sign In</button>
                </div>
                </div>
            )}

            {currentView === "signUp" && (
                <div className="auth-box">
                    <h2 className="header">Sign Up</h2>
                    <input type="sup-email" placeholder="Email" />
                    <input type="sup-user" placeholder="Username" />
                    <input type="sup-password-1" placeholder="Password" />
                    <input type="sup-password-2" placeholder="Confirm Password" />
                    <div className="button-container-d">
                    <button onClick={handleSignedUpClick}>Submit</button>
                    <button onClick={handleSignInClick}>Back</button>
                    </div>
                </div>
            )}

            {currentView === "account" && user && (
                <div className="auth-box">
                    <h2 className="header">Your Account</h2>
                    <img src="../src/assets/user-icon.png" className="userIcon" />
                    <p>Username: {user.username}</p>
                    <p>Email: {user.email}</p>
                    <div className="button-container-d">
                    <button onClick={handleDeleteAccount}>Delete Account</button>
                    <button onClick={handleSignOutClick}>Log Out</button>
                    </div>
                </div>
            )}

        </>
    );
};

export default AuthWindow;
