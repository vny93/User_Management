import React from 'react'
import logo from "../assets/images/logo.svg";
import "./Home.scss";

const Home = () => {
  return (
    <div className="home-body">
        <div className="text">Hello world from Homepage</div>
        <div>
        <img src={logo} className="App-logo" alt="logo" />
        </div>
    </div>
  )
}

export default Home