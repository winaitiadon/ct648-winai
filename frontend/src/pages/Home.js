import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button  } from "@mui/material"; 

const Home = () => {
  const [data, setData] = useState([]);
  const BACKEND_SERVER = process.env.REACT_APP_BACKEND_SERVER;
  // const token = sessionStorage.getItem('token');
  const token = localStorage.getItem('token');
  const navigate = useNavigate(); 

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(BACKEND_SERVER + "getdata", {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          navigate('/login'); 
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonData = await response.json();
        setData(jsonData.data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [BACKEND_SERVER, token, navigate]); 

  return (
    <div>
      
      {data.length > 0 ? (
        data.map((item) => (
          <Card key={item.studentid} style={{ marginBottom: 20 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Student ID: {item.studentid}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Name (Thai): {item.nameth}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Name (English): {item.nameen}
              </Typography>
            </CardContent>
            <a href="/research">Research</a>
            <br/>
            <a href="/history">History Login</a>
          </Card>
        ))
      ) : (
        <p>Loading...</p>
      )}
      <Button onClick={logout} variant="contained" color="secondary" style={{ marginBottom: 10, width: '120px' }}>
        Logout
      </Button>
    </div>
  );
};

export default Home;
