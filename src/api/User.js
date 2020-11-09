import request from "../util/axios";


function getUserDetail(id) {
   return request.get("/user/detail?uid="+id)
}

function getUserPlayList(id) {
    return request.get("/user/playlist?uid="+id);
}
export {
    getUserDetail,
    getUserPlayList
}
