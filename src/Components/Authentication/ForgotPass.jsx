// src/Components/Authentication/Login.js
import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";

// Styles
import { tailPrimaryBackgroundColor, tailPrimaryColor } from "../../Styles/Color";
import "../../Styles/Auth.css";

import { useToast } from "../Resources/Toast";
import axios from "axios";
import { USER_FORGOT_PASSWORD } from "../../api/ApiDetails";

const ForgotPass = () => {
  const showToast = useToast();
  const [loading, setLoading] = useState(false);

  const [userEmail, setUserEmail] = useState()

  const handleAuthLoginButton = async (e) => {
    setLoading(true);
    e.preventDefault();
    let data = {
        userEmail
    }
    await axios
      .post(USER_FORGOT_PASSWORD, data)
      .then((res) => {
        if (res.data.status) {
          setLoading(false);
          showToast("We are sent email to you", "success");
          setInputData('');
        } else {
          setLoading(false);
          showToast(res.data.data, "error");
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        showToast(err.response.data.data, "error");
      });
  };

  return (
    <div className="flex justify-center items-center absolute right-[10vw] top-[20vh] z-3">
      <div className="lg:h-[55vh] lg:w-[33vw] md:h-[65vh] md:w-[55vw] h-[55vh] w-[85vw] py-12 bg-white rounded-3xl px-10 shadow-lg flex flex-col justify-between items-start border">
        <h2 className="text-black lg:text-4xl md:text-wl text-lg font-medium text-center m-0">
          Forget Password ?
        </h2>
        <p className="text-xs m-0">
          Don't Have An Account ?{" "}
          <Link to="/auth/register" className={`${tailPrimaryColor}`}>
            sign up
          </Link>
        </p>

        <form
          action=""
          onSubmit={handleAuthLoginButton}
          className="flex flex-col justify-between items-start h-[60%] w-full "
        >
          <input
            type="email"
            placeholder="Enter your Email"
            className="border-2 lg:w-[100%] w-[95%] shadow-lg px-3 rounded-lg py-3 text-sm lg:text-md font-semibold login-input"
            name="mobile_number"
              id="mobile_number"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
          />
            <p className={`text-xs text-left`} >Wil send you a password reset link. Check mail</p>
          {loading ? (
            <button
              type="submit"
              className={`w-[100%] ${tailPrimaryBackgroundColor} py-3 shadow-lg rounded-lg text-lg font-semibold text-white flex justify-center items-center`}
            >
              <div className="login-loader"></div>
            </button>
          ) : (
            <button
              type="submit"
              className={`w-[100%] ${tailPrimaryBackgroundColor} py-3 shadow-lg rounded-lg text-lg font-semibold text-white`}
            >
              Send mail
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPass;
