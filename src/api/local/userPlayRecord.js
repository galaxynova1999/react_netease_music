function setUserPlayList(weekdata) {
  localStorage.setItem("userplayrecord",JSON.stringify(weekdata));
}

function getUserPlayList() {
  return JSON.parse(localStorage.getItem("userplayrecord"));
}

function clearUserPlayList() {
    localStorage.setItem("userplayrecord",null);
}


export {
    getUserPlayList,
    setUserPlayList,
    clearUserPlayList
}
