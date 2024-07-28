import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const ShowResearch = () => {
  const checkToken = localStorage.getItem('token');
  if (!checkToken) {
    window.location.href = '/login';
  }

  return (
    <div>
      <Card>
        <CardContent>
          <Typography variant="h6" component="div">
            หัวข้องานวิจัย : การพัฒนาระบบตรวจจับวัตถุสำหรับคลังเครื่องมือและอุปกรณ์โดยใช้ YOLOv8
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ความคืบหน้างานวิจัย : ความคืบหน้าถึงบทที่ -3 YOLOv8 สามารถ Run Prediction Object Prediction ผ่านกล้อง IP Camera RTSP protocolนับจำนวนอุปกรณ์ได้
          </Typography>
          <Typography variant="body2" color="text.secondary">
            รายละเอียดงานวิจัย : <br/>
          บทคัดย่อ

ในโลกปัจจุบันเทคโนโลยีเข้ามามีบทบาทในชีวิตประจำวันของคนเรามากขึ้น และในภาคธุรกิจเอง จึงไม่หยุดนิ่งในการพัฒนา ระบบการจัดการจัดเก็บและเบิกจ่ายเครื่องมือและอุปกรณ์ สำหรับ Warehouse ซึ่งก่อนหน้านี้ เราได้พบปัญหาของ ระบบการจัดการจัดเก็บและเบิกจ่ายเครื่องมือและอุปกรณ์ การรับของเบิกของ การจดบันทึกตกหล่น ของสูญหาย เมื่อเบิกของไปแล้วมีการยืมส่งต่อ โดยไม่มีการจดบันทึก และไม่สามารถยืนยันตัวตน ผู้เบิกจ่ายผู้ยืมได้ ทั้งหมดที่กล่าวมาจึงเป็นปัจจัยที่สำคัญ ที่ทำให้ผู้พัฒนาจึงได้ มีแนวคิดเพื่อที่จะแก้ปัญหานี้ ด้วยการประมวลผลภาพและ การวิเคราะห์ภาพเพื่อการจัดการข้อมูลตโนมัติ ในสารนิพนธ์นี้จะออกแบบและพัฒนาระบบประมวลผลภาพของคอมพิวเตอร์เทคโนโลยีปัญญาประดิษฐ์ ที่สามารถคำนวณวิเคราะห์ภาพได้ ในคำนวณวิเคราะห์ภาพของวัตถุจะใช้กล้อง IP Cameras, software YOLOv8 และเซนเซอร์ต่างๆ
คำสำคัญ : IP Cameras, deep learning, object detection, Machine learning   
	  </Typography>
        </CardContent>
        <a href="/">Home</a>
      </Card>
    </div>
  );
};

export default ShowResearch;
