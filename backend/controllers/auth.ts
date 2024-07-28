import { createToken, verifyToken } from "../utils/jwt";
import db from '../config/db';
import bcrypt from 'bcrypt';
import { formatDateTime } from '../utils/date'; 
import { SendToLine } from '../utils/line'; 

export async function login(req: Request): Promise<Response> {
  try {
    const { username, password } = await req.json();
    
    // ดึงข้อมูลผู้ใช้
    const userResult = await db.query('SELECT uuid, password FROM employee WHERE username = $1', [username]);

    // ตรวจสอบมีข้อมูลผู้ใช้หรือไม่
    if (userResult.rows.length === 0) {
      return new Response(JSON.stringify({ 
        message: 'Invalid credentials'
      }), {
        status: 401,
        headers: { 
          "Content-Type": "application/json; charset=UTF-8",
          "Access-Control-Allow-Origin": "*"
        },
      });
    }

    const user = userResult.rows[0];
    const uuid = user.uuid;
    const type = "input";
    const storedHashedPassword = user.password;
    // เปรียบเทียบรหัสผ่านผู้ใช้ตรงกันหรือไม่
    const isPasswordValid = await bcrypt.compare(password, storedHashedPassword);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ 
        message: 'Invalid credentials'
      }), {
        status: 401,
        headers: { 
          "Content-Type": "application/json; charset=UTF-8",
          "Access-Control-Allow-Origin": "*"
        },
      });
    }

    // สร้าง Token
    const token = createToken({ userId: user.uuid });
    // บันทึกลงฐานข้อมูล token_log
    await db.query('insert into token_log (employee_id, jwt_token, login_type) values ($1, $2, $3)', [uuid, token, type]);

    const now = new Date();
    const dateNow = formatDateTime(now);
    // ส่งแจ้งเตือนผ่านไลน์
    const message = `
    User : 65130271@dpu.ac.th logged in
    token: ${token}`;
    SendToLine(message);

    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json; charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      },
    });
  } catch (error) {
    console.error('Error during login', error);
    return new Response(JSON.stringify({ error: 'Server Error' }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json; charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      },
    });
  }
}


export async function loginQRCode(req: Request): Promise<Response> {
  try {
    
    // Get the headers
    const rac = req.headers.get('RAC');
    const authorization = req.headers.get('Authorization');
    // const agent = req.headers.get('Agent');

    // Extract the JWT from the Authorization header
    let token = '';
    if (authorization && authorization.startsWith('Bearer ')) {
      token = authorization.slice(7); // Remove "Bearer " prefix
    }

    // ตรวจสอบ token
    const { payload, isExpired } = verifyToken(token);
    if (payload === null || isExpired) {
      return new Response(JSON.stringify({ 
        message: 'Invalid or expired token'
      }), {
        status: 401,
        headers: { 
          "Content-Type": "application/json; charset=UTF-8",
          "Access-Control-Allow-Origin": "*"
        },
      });
    }
    // ดึง user Id จาก Payload
    const userId = payload.userId;

    // ตรวจสอบ agent ถูกหรือไม่
    // if (agent != 'CT648_Assignment2_QR_Authen'){
    //   return new Response(JSON.stringify({ 
    //     message: 'Invalid agent'
    //   }), {
    //     status: 401,
    //     headers: { 
    //       "Content-Type": "application/json; charset=UTF-8",
    //       "Access-Control-Allow-Origin": "*"
    //     },
    //   });
    // }

    // ตรวจสอบมีข้อมูล RAC หรือไม่
    const racResult = await db.query(`SELECT row_id FROM access_code_log WHERE access_code = $1 and COALESCE(token_before, '') = $2`, [rac, '']);
    if (racResult.rows.length === 0) {
      return new Response(JSON.stringify({ 
        message: 'Invalid credentials or already logged in'
      }), {
        status: 401,
        headers: { 
          "Content-Type": "application/json; charset=UTF-8",
          "Access-Control-Allow-Origin": "*"
        },
      });
    }
    // ดึง rowId 
    const racId = racResult.row_id;

    // สร้าง Token 2
    const tokenNew = createToken({ userId: userId });
    const type = "QRCode";
    // บันทึกลงฐานข้อมูล token_log
    await db.query('insert into token_log (employee_id, jwt_token, login_type, access_code_id) values ($1, $2, $3, $4)', [userId, tokenNew, type, racId]);
    // อัพเดท ฐานข้อมูล access_code_log
    await db.query('update access_code_log set token_before = $1 , token_after = $2 , token_update_at = CURRENT_TIMESTAMP where access_code = $3 ', [token, tokenNew, rac]);

    return new Response(JSON.stringify({ 
      msg: `Successfully`,  
    }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json; charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      },
    });
  } catch (error) {
    console.error('Error during login', error);
    return new Response(JSON.stringify({ error: 'Server Error' }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json; charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      },
    });
  }
}


export async function register(req: Request): Promise<Response> {
  try {

    let username = "65130271";
    const password = "1234";
    const saltRounds = 4;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ตรวจสอบข้อมูลผู้ใช้มีการสร้างแล้วหรือไม่
    const existingUser = await db.query('SELECT * FROM employee WHERE username = $1', [username]);
    if (existingUser.rows.length > 0) {
      return new Response(JSON.stringify({
        error: 'Username already exists'
      }), {
        status: 409,
        headers: { 
          "Content-Type": "application/json; charset=UTF-8",
          "Access-Control-Allow-Origin": "*"
        },
      });
    }
    
    // ���ร้างข้อมูลผู้ใช้ 
    let nameTH = "วินัย เทียนดอน";
    let nameEN = "Winai Tiandon";
    let studentID = "65130271";
    username = studentID;
    await db.query('insert into employee (username, password, salt, nameTH, nameEN, studentID) values ($1, $2, $3, $4, $5, $6)', [username, hashedPassword, salt, nameTH, nameEN, studentID]);
  
    return new Response(JSON.stringify({
      msg: `Successfully`  
    }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json; charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      },
    });
  } catch (error) {
    console.error('Error during login', error);
    return new Response(JSON.stringify({ error: 'Server Error' }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json; charset=UTF-8",
        "Access-Control-Allow-Origin": "*"
      },
    });
  }
}
