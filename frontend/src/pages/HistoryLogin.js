import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Typography } from "@mui/material"; 

const ShowHistoryLogin = () => {
  const [data, setData] = useState([]);
  const BACKEND_SERVER = process.env.REACT_APP_BACKEND_SERVER;
  // const token = sessionStorage.getItem('token');
  const token = localStorage.getItem('token');
  const navigate = useNavigate(); 

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(BACKEND_SERVER + "gethistory", {
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
          <Card key={item.row_id} style={{ marginBottom: 20 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Username: 65130130
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Name (Thai): วินัย เทียดอน
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Name (English): Winai Tiandon
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Time login log: {formatDate(item.created_at)}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Login type: {item.login_type}
              </Typography>
            </CardContent>
            
          </Card>
        ))
        
      ) : (
        <p>Loading...</p>
      )}
      <a href="/">Home</a>
    </div>
  );
};

export default ShowHistoryLogin;
