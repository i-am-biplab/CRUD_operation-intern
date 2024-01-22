import React, { useEffect, useState } from 'react';
import Sdata from './Sdata';


const UserList = () => {
    const [data , setData]= useState([]);
    const [product, setProductName]= useState('');
    const [id, setId] = useState(0);
    const [isUpdate, setIsUpdate]= useState(false);
    

    useEffect(()=>{
        setData(Sdata)
    },[]);

    const handleEdit= (userId) => {
        const dt = data.filter(user => user.id === userId);
        if(dt !== undefined)
        {
            setIsUpdate(true);
            setId(userId);
            setProductName(dt[0].product);
        }
    };

    const handleDelete = (userId) => {
        if(userId > 0)
        {
        const dt = data.filter(user => user.id !== userId);
        setData(dt);
        }
      };

// edit
       
    const handleSave = (e) =>{
        e.preventDefault();
        const dt = [...data];
        const newObject ={
            id: Sdata.length + 1,
            product: product,
        }
        dt.push( newObject);
        setData(dt);
    };

    const handleUpdate = () =>{
        const index = data.map((user)=>{
            return user.id
        }).indexOf(id);
        
        
        const dt = [...data];
        dt[index].product = product;

        setData(dt);
        handleClear();
      };

    const handleClear = () =>{
        setId(0);
        setProductName('');
        setIsUpdate(false);

    };

  return (
   <>
{/* edit */}
<div className='edit_data'>
      <div>
        <label>Edit product:
          <input type='text' placeholder='enter the product name' value={product} onChange={(e) => setProductName(e.target.value)}/>
        </label>
      </div>
    <div>
    {
        !isUpdate ? 
        <button className="edit-button" onClick={(e)=>handleSave(e)}>Save</button>
        :
        <button className="edit-button" onClick={()=>handleUpdate()}>Update</button>

    }
      <button className="delete-button" onClick={() => handleClear()}>Clear</button>
      </div>

</div>
     
  
  {/* userlist */}
      <div className='user_table'>
      <h2>Product List</h2>
        <table>
            <thead>
                <tr>
                  <th className="serial-no">Serial No</th>
                  <th className="user-name">Product</th>
                  
                  <th className="edit-delete-buttons">Actions</th>
                </tr>
            </thead>
            <tbody>
             {data.map((user, index) => (
               <tr key={user.id}>
                <td>{index + 1}</td>
                 <td>{user.product}</td>
                
              <td>
                  <div className="edit-delete-buttons">
                    <button className="edit-button" onClick={()=>handleEdit(user.id)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(user.id)}>
                      Delete
                    </button>
                  </div>
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
