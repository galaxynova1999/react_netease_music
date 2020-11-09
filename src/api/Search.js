import request from "../util/axios";
import {getCookie} from "./Cookie";
function getHotSearch() {
   return request.get("/search/hot/detail");
}

function Search(keyword,type,limit=30) {
   return request.get("/search?keywords="+keyword+"&type="+type+"&limit="+limit);
}
function searchSuggest(keyword) {
  return request.get("/search/suggest?keywords="+keyword+"&cookie="+getCookie());
}

export {
    getHotSearch,
    Search,
    searchSuggest
}
