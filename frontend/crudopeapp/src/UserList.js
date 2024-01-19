import React, { useEffect, useState } from 'react';
import Sdata from './Sdata';

const UserList = () => {
    const [data , setData]= useState([]);

    useEffect(()=>{
        setData(Sdata)
    },[]);

    const handleDelete = (userId) => {
        setData(data.filter(user => user.id !== userId));
      };


  return (
    <>
      <div className='user_table'>
      <h2>User List</h2>
        <table>
            <thead>
                <tr>
                  <th className="serial-no">Serial No</th>
                  <th className="user-name">Name</th>
                  <th className="user-photo">Photo</th>
                  <th className="edit-button">Edit</th>
                  <th className="delete-button">Delete</th>
                </tr>
            </thead>
            <tbody>
            {data.map((user, index) => (
             <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.fullname}</td>
              <td>
                <img src={user.imgsrc} alt={user.fullname} className="user-photo" />
              </td>
              <td>
                
                <button className="edit-button">Edit</button>
              </td>
              <td>
                <button className="delete-button" onClick={() => handleDelete(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
            </tbody>
        </table>

      </div>
    </>
  );
};

export default UserList;
