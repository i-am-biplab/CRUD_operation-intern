// App.js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import UserList from "./UserList";
import Sdata from "./Sdata";
import './index.css';


const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/userlist" element={<UserList/>}/>
          
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
