import {get,post} from "../util/axios";

function getHotSearch() {
   return get("/search/hot/detail");
}

function Search(keyword,type,limit=30) {
   return get("/search",{
       keyword,
       type,
       limit
   });
}
function searchSuggest(keyword) {
  return get("/search/suggest",{
      keyword
  });
}

export {
    getHotSearch,
    Search,
    searchSuggest
}
