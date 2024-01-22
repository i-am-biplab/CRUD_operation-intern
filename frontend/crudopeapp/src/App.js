// App.js
import React, { useState , useEffect } from "react";
import { BrowserRouter, Routes, Route , Navigate} from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import UserList from "./UserList";
import Cookies from 'js-cookie';
import './index.css';


const App = () => {
   const [loggedIn, setLoggedIn ] = useState(false)

   useEffect(() => {
    // Check if the user is logged in
    const authToken = Cookies.get('authToken');
    console.log("login get cookie");
    console.log(authToken);

    // setLoggjedIn(!!authToken);
  }, []);

  // islogin state true or false 
  // get token value
  //check log in ?
  return (
    <>
      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/userlist" element={<UserList/>}/>
          <Route
          path="/userlist"
          element={loggedIn ? <UserList /> : <Navigate to="/" />}
        />
          
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
