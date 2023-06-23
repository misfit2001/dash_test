import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/login.css"
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  const handleLogin = (e) => {
    e.preventDefault();



    {/*Posting the data to snap4city. If everything's fine goes to Questionnaire else error*/}
 

    const postData = () => {
      const formData = new URLSearchParams();
      formData.append('client_id', 'panacea-tool');
      formData.append('grant_type', 'password');
      formData.append('username', username);
      formData.append('password', password);
      axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';

      axios.post('https://www.snap4city.org/auth/realms/master/protocol/openid-connect/token/', formData.toString(), { headers: {
        'Access-Control-Allow-Origin': 'http://localhost:3000/',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
      })
        .then((response) => {
          console.log("Aaaa");
          const data = response.data;
          console.log(data);
          if (data.error) {
            console.log('Error:', data.error);
            window.location.reload();
            alert("Invalid username or password");
          } else {
            console.log('OK');
     
            // If login is successful, set isLoggedIn to true and store in localStorage
            const isLoggedIn = true;
            localStorage.setItem("isLoggedIn", isLoggedIn);
            // Redirect to admin site
       
            console.log(data.access_token)
            navigate("/admin/dashboard", { state: { token: data.access_token } });

          }
        })
        .catch((error) => {
          window.location.reload();
          alert("Invalid username or password");
          console.error(error);
        });
    };
    
    // Call the function to initiate the operation
    postData();
  };
  return (
    <div class="full-screen-container">
        <div class="login-container">
            <h3 class="login-title">Login to Dashboard</h3>
            <form onSubmit={handleLogin}>
                <div class="input-group">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div class="input-group">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit"  class="login-button">Login</button>
            </form>
        </div>
    </div>
 
  );
};

export default Login;
