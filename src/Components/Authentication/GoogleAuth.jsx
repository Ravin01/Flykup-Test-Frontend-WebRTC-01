// src/Components/Authentication/GoogleAuth.js
import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useToast } from "../Resources/Toast";
import { jwtDecode } from "jwt-decode";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_LOGIN_GOOGLE } from "../../api/ApiDetails";
import { useTheme } from "../Store/ThemeContext";
import '../../Styles/Auth.css'

const GoogleAuth = () => {
  const showToast = useToast();
  let navigate = useNavigate();
  const {setTheme} = useTheme()

  const onSuccess = async (response) => {
    const decoded = jwtDecode(response?.credential);

    let data = {
      userName: decoded.name,
      userEmail: decoded.email,
      profile: decoded.picture,
      password: decoded.name,
      mobile_number : 0
    }

    await axios
      .post(USER_LOGIN_GOOGLE, data)
      .then((res) => {
        if (res.data.status) {
          localStorage.setItem("user", JSON.stringify(res.data.data));
          setTheme(res.data.data.configuration.theme)
          showToast("Login Successful", "success");
          navigate('/dashboard')
        }
      })
      .catch((err) => {
        console.log(err);
        showToast("error", err.data)
      });
  };

  const onError = (error) => {
    console.error(error);
    showToast("Login Failed", "error");
  };

  // if (
  //   localStorage.getItem("user") &&
  //   JSON.parse(localStorage.getItem("user"))
  // ) {
  //   return <Navigate to="/dashboard" replace />;
  // }

  return <GoogleLogin onSuccess={onSuccess} onError={onError} className='google-login-button'  />;
};

export default GoogleAuth;
