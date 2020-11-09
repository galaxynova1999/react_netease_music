import request from "../util/axios";
import {getCookie} from "./Cookie";

function setUserDetail(data) {
   localStorage.setItem("userid",data.account.id);
   localStorage.setItem("username",data.account.userName);
   localStorage.setItem("nickname",data.profile.nickname);
   localStorage.setItem("avatar",data.profile.avatarUrl);
   localStorage.setItem("login","1");
}

function getLoginState() {
  let state=localStorage.getItem("login");
  return state === "1"
}

function setLoginState(state) {
  localStorage.setItem("login",state===true?"1":"0")
}
function getUserID() {
  return parseInt(localStorage.getItem("userid"));
}

function getUserName() {
  return localStorage.getItem("username");
}

function getNickName() {
 return localStorage.getItem("nickname");
}

function getAvatar() {
 return localStorage.getItem("avatar");
}

function clearUser() {
    localStorage.setItem("userid",null);
    localStorage.setItem("username",null);
    localStorage.setItem("nickname",null);
    localStorage.setItem("avatar",null);
}

function signIn() {
   return request.post("/daily_signin?type=1&cookie="+getCookie());
}

function getMeCloud() {
  return request.get("/user/cloud?cookie="+getCookie());
}

export {
    getAvatar,
    getNickName,
    getUserID,
    getUserName,
    clearUser,
    setUserDetail,
    getLoginState,
    setLoginState,
    signIn,
    getMeCloud
}
