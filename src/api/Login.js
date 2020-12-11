import { get, post } from "../util/axios";
import { clearCookie } from "./local/Cookie";
import { clearUser, getUserID } from "./Me";
import LoginState from "../mobx/loginState";
import userPlayList from "../mobx/userPlayListState";
import { clearUserPlayList } from "./local/userPlayRecord";

/**
 * 通过手机号登录
 * @param {string} phone - 手机号
 * @param {string} pwd - 密码
 * @returns {Promise}
 */
function LoginByPhone(phone, pwd) {
  return post("/login/cellphone", {
    phone: phone,
    password: pwd,
    timestamp: new Date().getTime(),
  });
}

function LoginByMail(email, pwd) {
  return post("/login", {
    email: email,
    password: pwd,
  });
}

function LogOut() {
  post("/logout").then(function () {
    clearCookie();
    clearUser();
    clearUserPlayList();
    LoginState.changeState(false);
    userPlayList.updatePlayList(null, null);
  });
}

function getUserDetailCount() {
  return get("/user/subcount");
}

function getUserRecentWeekPlayRecord() {
  return get("/user/record", {
    uid: getUserID(),
    type: 1,
  });
}

export {
  LoginByMail,
  LoginByPhone,
  LogOut,
  getUserDetailCount,
  getUserRecentWeekPlayRecord,
};
