function addNewSearchHistory(name) {

    let history = getSearchHistory();
    if(history.includes(name)){
        return;
    }
    history.push(name);
    localStorage.setItem("searchhistory",JSON.stringify(history));
}
function clearSearchHistory() {
   initSearchHistory();
}

function initSearchHistory() {
    let array = [];
    localStorage.setItem("searchhistory",JSON.stringify(array));
}

function delSearchHistory(name) {
    let history = getSearchHistory();
    history.forEach(function (item,index,arr) {
      if(item === name) {
          arr.splice(index,1);
      }
    })
    localStorage.setItem("searchhistory",JSON.stringify(history));
    return getSearchHistory();
}

function getSearchHistory() {
    if(!localStorage.getItem("searchhistory")) {
        initSearchHistory();
    }
   return JSON.parse(localStorage.getItem("searchhistory"));
}


export {
    initSearchHistory,
    addNewSearchHistory,
    getSearchHistory,
    delSearchHistory,
    clearSearchHistory
}
