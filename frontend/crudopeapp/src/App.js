// App.js
import React, { useState , useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import UserList from "./UserList";
import Cookies from 'js-cookie';
import './index.css';


const App = () => {
   const [loggedIn, setLoggedIn ] = useState(false);
    

   useEffect(() => {
    
    const fetchData = async () => {
      try {
        // Check if the user is logged in
        const authToken = Cookies.get('authToken');
        console.log("login authToken--",authToken);
  
        const response = await fetch('http://127.0.0.1:8000/tokenvalidate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ authToken }),
        });
  
        if (response.ok) {
          console.log(authToken);
          const responseData = await response.json();
          console.log("response is----",responseData.isvalid);
          
         
          if (responseData.isvalid === true) {
            setLoggedIn(true);
            console.log("login state", loggedIn);
          } else {
            setLoggedIn(false);
          }
        } else {
          console.error('Token validation request failed:', response.status);
          setLoggedIn(false);
        }
      } catch (error) {
        console.error('Error during token validation:', error);
        setLoggedIn(false);
      }
    };
  
    fetchData();
  }, []);

  
  return (
    <>
      <BrowserRouter>
        <Routes>
          
          {/* <Route path="/" element={<Login />} /> */}
          <Route path="/signup" element={<Signup />} />
           <Route path="/userlist" element={<UserList/>}/> 
          <Route
          path="/"
          element={loggedIn ? <UserList /> : <Login />}
        />
          
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;


