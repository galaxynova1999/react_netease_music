import request from "../util/axios";
import {clearCookie, getCookie} from "./Cookie";
import {clearUser, getUserID} from "./Me"
import LoginState from "../mobx/loginState"
import userPlayList from "../mobx/userPlayListState";
import { clearUserPlayList } from "./userPlayRecord";

function LoginByPhone(phone,pwd) {
   return  request.post("/login/cellphone",{
        phone:phone,
        password:pwd,
        timestamp:new Date().getTime()
    })
}

function LoginByMail(email,pwd) {
    return request.post("/login",{
        email:email,
        password:pwd
    })
}


function LogOut() {
    return request.post("/logout").then(function () {
        clearCookie();
        clearUser();
        clearUserPlayList();
        LoginState.changeState(false);
        userPlayList.updatePlayList(null,null);
    })


}

function getUserDetailCount() {
   return request.get("/user/subcount?cookie="+getCookie());
}



function getUserRecentWeekPlayRecord() {
  return request.get("/user/record?uid="+getUserID()+"&type=1&cookie="+getCookie());
}




export {
    LoginByMail,
    LoginByPhone,
    LogOut,
    getUserDetailCount,
    getUserRecentWeekPlayRecord
}
