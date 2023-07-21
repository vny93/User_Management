import React from "react";
import axios from "./customie-axios";

const fetchAllUser = (page) => {
  return (
    axios.get(`/api/users?page=${page}`)
  );
};

export { fetchAllUser };
