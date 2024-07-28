const PORT: number = +(process.env.PORT || 8087);
process.env.TZ = "Asia/Bangkok";

import { login, register, loginQRCode } from "./controllers/auth";
import { generateAccessCode, verifyQRCode } from "./controllers/qrcode";
import { dataEmployee } from "./controllers/data";
import { dataHistory } from "./controllers/dataHistory";
import { verifyTokenAuthorized } from "./utils/jwt";



function handleCors(req: Request, response: Response): Response {
  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", "*");
  headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, RAC, Agent");
  return new Response(response.body, {
    ...response,
    headers,
  });
}


Bun.serve({
  port: PORT,
  fetch: async (req) => {
    const url = new URL(req.url);

    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, RAC, Agent",
        },
      });
    }

    let response;
    switch (url.pathname) {
      case "/api/login":
        if (req.method === "POST") {
          response = await login(req);
        } else {
          response = new Response("Method Not Allowed", { status: 405 });
        }
        break;
      case "/api/loginqr":
        if (req.method === "POST") {
          response = await loginQRCode(req);
        } else {
          response = new Response("Method Not Allowed", { status: 405 });
        }
        break;
      case "/api/register":
        if (req.method === "POST") {
          response = await register(req);
        } else {
          response = new Response("Method Not Allowed", { status: 405 });
        }
        break;
      case "/api/rac":
        if (req.method === "GET") {
          response = await generateAccessCode(req);
        } else {
          response = new Response("Method Not Allowed", { status: 405 });
        }
        break;
      case "/api/verifyrac":
        if (req.method === "POST") {
          response = await verifyQRCode(req);
        } else {
          response = new Response("Method Not Allowed", { status: 405 });
        }
        break;
      case "/api/getdata":
        if (req.method === "GET") {
          const authorization = req.headers.get('Authorization');
          const verifyToken = verifyTokenAuthorized(authorization);
          if(!verifyToken){
            return new Response(JSON.stringify({ 
              message: 'Unauthorized'
            }), {
              status: 401,
              headers: { 
                "Content-Type": "application/json; charset=UTF-8",
                "Access-Control-Allow-Origin": "*"
              },

            });
          }else {
            response = await dataEmployee(req);
          }
        } else {
          response = new Response("Method Not Allowed", { status: 405 });
        }
        break;
      case "/api/gethistory":
        if (req.method === "GET") {
          const authorization = req.headers.get('Authorization');
          const verifyToken = verifyTokenAuthorized(authorization);
          if(!verifyToken){
            return new Response(JSON.stringify({ 
              message: 'Unauthorized'
            }), {
              status: 401,
              headers: { 
                "Content-Type": "application/json; charset=UTF-8",
                "Access-Control-Allow-Origin": "*"
              },

            });
          }else {
            response = await dataHistory(req);
          }
        } else {
          response = new Response("Method Not Allowed", { status: 405 });
        }
        break;
      default:
        response = new Response("Not Found", { status: 404 });
        break;
    }
    // return response;
    return handleCors(req, response);
  },
  error(error) {
    return new Response(`<pre>${error}\n${error.stack}</pre>`, {
      headers: {
        "Content-Type": "text/html",
        "Access-Control-Allow-Origin": "*"
      },
    });
  },
});