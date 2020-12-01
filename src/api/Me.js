import { get, post } from "../util/axios";

function setUserDetail(data) {
  localStorage.setItem("userid", data.account.id);
  localStorage.setItem("username", data.account.userName);
  localStorage.setItem("nickname", data.profile.nickname);
  localStorage.setItem("avatar", data.profile.avatarUrl);
  localStorage.setItem("login", "1");
}

function getLoginState() {
  return localStorage.getItem("login") === "1";
}

function setLoginState(state) {
  localStorage.setItem("login", state ? "1" : "0");
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
  localStorage.setItem("userid", null);
  localStorage.setItem("username", null);
  localStorage.setItem("nickname", null);
  localStorage.setItem("avatar", null);
}

function signIn() {
  return post("/daily_signin", {
    type: 1,
  });
}

function getMeCloud() {
  return get("/user/cloud");
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
  getMeCloud,
};
