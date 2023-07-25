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
    let res = [];
    if(error.response){
      res.data = error.response.data;
      res.status = error.response.status;
      res.headers = error.response.headers;
    }
    else if(error.request){
      console.log(error.request);
    }else{
      console.log("Error", error.message);
    }
    return res;
  }
);

export default instance;
