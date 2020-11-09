import request from "../util/axios";
import {getCookie} from "./Cookie";

function getAlbumDetail(id) {
   return request.get("/album?id="+id);
}

function getAlbumInfo(id) {
  return request.get("/album/detail/dynamic?id="+id+"&cookie="+getCookie());
}


export {
    getAlbumDetail,
    getAlbumInfo
}



