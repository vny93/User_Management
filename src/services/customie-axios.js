import axios from "axios";

const instance = axios.create({
  baseURL: "https://reqres.in",
});

// custom cai res tra ve theo y' cua minh
//vi du th axios tra ve res.data.data ma` minh` chi muon lay res.data
//thi` minh se custom lai ham nay` return ve response.data o dong 13
instance.interceptors.response.use(
  function (response) {
    //custom lai response.data cho nay
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;
