function setCookie(cookie) {
  localStorage.setItem("cookie",cookie);
}


function clearCookie() {
  localStorage.setItem("cookie",null);
}

export {
    setCookie,
    clearCookie
}
