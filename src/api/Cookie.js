function setCookie(cookie) {
  localStorage.setItem("cookie",cookie);
}

function getCookie() {
    if(!localStorage.getItem("cookie")){
        return "";
    }
    else return localStorage.getItem("cookie")

}

function clearCookie() {
  localStorage.setItem("cookie",null);
}

export {
    getCookie,
    setCookie,
    clearCookie
}
