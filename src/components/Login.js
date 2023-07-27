import React, { useEffect, useState, useContext } from "react";
import { loginApi } from "../services/UserService";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

import {handleLoginRedux} from "../redux/actions/userAction";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  //const [loadingApi, setLoadingApi] = useState(false);
  const navigate = useNavigate();

  // const {loginContext} = useContext(UserContext);
  const dispatch = useDispatch();
  const isLoading = useSelector((state)=> state.user.isLoading);
  const account = useSelector((state)=> state.user.account);
 
  useEffect(()=> {
   let token = localStorage.getItem("token");
   if(token){
    navigate("/")
   }
  },[])

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Email and password are required!");
      return;
    }
   

    dispatch(handleLoginRedux(email.trim(), password));
    /*setLoadingApi(true);
   let res = await loginApi(email.trim(), password);
    if (res && res.token) {
      loginContext(email.trim(),res.token);
      navigate("/")
    } else {
      if (res && res.status === 400) {
        toast.error(res.data.error);
      }
    }
    setLoadingApi(false);*/


  };

  const handleGoBack = () => {
    navigate("/")
  }

  const handlePressEnter = (event) => {
    if(event && event.key === "Enter"){
        handleLogin();
    }
  }

  useEffect(() => {
    if(account && account.auth === true){
      navigate("/")
    }
  },[account])

  return (
    <div className="login-container col-12 col-sm-4">
      <div className="title">Login</div>
      <div className="text">Email or username</div>

      <input
        type="text"
        placeholder="Email or username..."
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        onKeyDown={(event) => handlePressEnter(event)}
      />

      <div className="input-2">
        <input
          type={isShowPassword === true ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onKeyDown={(event) => handlePressEnter(event) }
        />
        <i
          className={
            isShowPassword === true
              ? "fa-solid fa-eye"
              : "fa-solid fa-eye-slash"
          }
          onClick={() => setIsShowPassword(!isShowPassword)}
        ></i>
      </div>

      <button
        className={email && password ? "active" : ""}
        disabled={email && password ? false : true}
        onClick={() => handleLogin()}
      >
        {isLoading && <i className="fa-solid fa-sync fa-spin"></i>}&nbsp;Login
      </button>

      <div className="back">
        <i className="fa-solid fa-angles-left"></i>
        <span onClick={()=> handleGoBack()}>&nbsp;Go back</span>
      </div>
    </div>
  );
};

export default Login;
