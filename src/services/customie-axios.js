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
    //se co TH response.data kh tra ve data nen minh se them if else nhe'
    return response.data ? response.data : {statusCode: response.status};
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default instance;
