import React, { useState, useEffect } from "react";
import { QRCodeSVG } from 'qrcode.react';

const ShowQRCode = () => {
  const [data, setData] = useState({});
  const [refreshed, setRefreshed] = useState(false);
  const BACKEND_SERVER = process.env.REACT_APP_BACKEND_SERVER;

  
  useEffect(() => {
    // const checkToken = sessionStorage.getItem('token');
    const checkToken = localStorage.getItem('token');
    if (checkToken) {
      window.location.href = '/';
    }
  }, []);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BACKEND_SERVER}rac`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call fetchData once when component mounts
    fetchData();

  }, [BACKEND_SERVER]); // Only run this effect once on mount

  useEffect(() => {
    const verifyData = async () => {
      try {
        const response2 = await fetch(`${BACKEND_SERVER}verifyrac`, {
          method: 'POST',
          headers: {
            'RAC': data.data // Assuming data.data is the value for the RAC header
          }
        });
        if (!response2.ok) {
          throw new Error(`HTTP error! Status: ${response2.status}`);
        }

        const jsonData2 = await response2.json();
        console.log(jsonData2);
        if (jsonData2.msg === 'Successfully') {
          // Save token to session storage
          // sessionStorage.setItem('token', jsonData2.token);
          localStorage.setItem('token', jsonData2.token);

          // Redirect to '/'
          window.location.href = '/';
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Fetch verifyrac every 5 seconds after the initial fetch
    const interval = setInterval(() => {
      verifyData();
    }, 5000);

    // Cleanup function to clear interval
    return () => clearInterval(interval);

  }, [BACKEND_SERVER, data.data]); // Run this effect whenever BACKEND_SERVER or data.data changes

  useEffect(() => {
    if (refreshed) {
      window.location.reload(); // Reload the page when refreshed state changes
    }
  }, [refreshed]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300, width: 300, margin: 'auto' }}>
        {data.msg ? (
          <QRCodeSVG
            size={300}
            style={{ width: '100%', height: '100%' }}
            value={data.data}
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <h5>{data.data}</h5>
    </div>
  );
};

export default ShowQRCode;