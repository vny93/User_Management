import React from "react";
import { Routes, Route } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import Alert from 'react-bootstrap/Alert';

const PrivateRoute = (props) => {
  const { user } = useContext(UserContext);

  if (user && !user.auth) {
    return (
      <>
      <Alert variant="danger" className="mt-3">
        <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
        <p>
          You don't have permission to access this page. Please login first!
        </p>
      </Alert>
      </>
    );
  }

  return (
    <>
      {props.children}
        {/* cham children la vi th cha PrivateRoute truyen vao th con TableUsers */}
    </>
  );
};

export default PrivateRoute;
