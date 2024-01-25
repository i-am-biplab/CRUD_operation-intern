import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const UserList = () => {
    const [data, setData] = useState([]);
    const [product, setProductName] = useState('');
    const [image , setImage] =useState(null);
    const [id, setId] = useState(0);
    const [isUpdate, setIsUpdate] = useState(false);
    const [isReload, setIsReload] = useState(false);

    
    const handleEdit = (userId) => {
        console.log('====================================');
        console.log("userId ",userId);
        console.log('====================================');
        const dt = data.find(user => user.pid === userId);
        if (dt !== undefined) {
            setIsUpdate(true);
            setId(userId);
            setProductName(dt.product);
            setImage(null);
        }
    };

    
    
    const handleDelete = async (userId) => {
        try {
            if (userId > 0) {
                // Make API call to delete data
                const authToken = Cookies.get('authToken');
                const response = await fetch(`http://127.0.0.1:8000/user/products/delete/${userId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({
                        
                    }),
                });
    
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
    
                // Assuming the API returns some data after deletion
                const apiData = await response.json();
    
                console.log('API Data:', apiData);
    
                // Assuming apiData.delete is the correct property, adjust accordingly
                setData(apiData || apiData); 
                setIsReload(!isReload)
            }
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };
    
    const handleSave = (e) => {
        e.preventDefault();
        
        const authToken = Cookies.get('authToken');
        const apiUrl = 'http://127.0.0.1:8000/user/products/addnew';
    
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({
                product: product,
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(apiData => {
            setData(apiData.product);
            setIsReload(!isReload)
            // Additional logic if needed
        })
        .catch(error => console.error('Error saving data:', error));
    };
        
    const handleUpdate = () => {
        // Make API call to update data
        const authToken = Cookies.get('authToken');
        
        fetch(`http://127.0.0.1:8000/user/products/update/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,

            },
            body: JSON.stringify({
                
                product: product,
            }),
        })
        .then(response => response.json())
        .then(apiData => {
            console.log('====================================');
            console.log(apiData);
            console.log('====================================');
            setData(apiData);
            setIsReload(!isReload)
        })
        .catch(error => console.error('Error updating data:', error));
    
        handleClear();
    };
    const handleClear = () => {
        setId(0);
        setProductName('');
        setIsUpdate(false);
    };



    useEffect(() => {

        // const authToken = Cookies.get('authToken');
        // console.log("authToken",authToken);


        const fetchData = async () => {
            try {
                const authToken = Cookies.get('authToken');
                 
                const response = await fetch('http://127.0.0.1:8000/user/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,

                    },
                    body: JSON.stringify({
                       
                    }),
                });
                
              console.log(response);
                

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const apiData = await response.json();
                setData(apiData.products);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [isReload]);
    

    
    
    return (
        <>
            {/* edit */}
            <div className='edit_data'>
                <div>
                    <label>Edit Product:
                        <input type='text' placeholder='Enter the Product Name' value={product} onChange={(e) => setProductName(e.target.value)} />
                    </label>

                    <label>Upload Image:
                         <input type='file' onChange={(e) => setImage(e.target.files[0])} />
                    </label>
                </div>
                <div>
                    {
                        !isUpdate ?
                            <button className="edit-button" onClick={(e) => handleSave(e)}>Save</button>
                            :
                            <button className="edit-button" onClick={() => handleUpdate()}>Update</button>
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
                            <th className="user-image">Image</th>
                            <th className="edit-delete-buttons">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(data) && data.length > 0 ? (
                            data.map((user, index) => (
                                <tr key={user.pid}>
                                    <td>{index + 1}</td>
                                    <td>{user.product}</td>
                                    <td>
                                     {user.image && (
                                    <img src={""} alt={user.image} style={{ width: '50px', height: '50px' }} />
                                     )}
                                    </td>
                                    <td>
                                        <div className="edit-delete-buttons">
                                            <button className="edit-button" onClick={() => handleEdit(user.pid)}>Edit</button>
                                            <button className="delete-button" onClick={() => handleDelete(user.pid)}>Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">Loading...</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default UserList;


