import request from "../util/axios";
import {getCookie} from "./Cookie";
function getSingerInfo(id) {
   return request.get("/artists?id="+id);
}

function getSingerMV(id) {
  return request.get("/artist/mv?id="+id);
}

function getSingerAlbum(id) {
 return request.get("/artist/album?id="+id+"&limit=8");
}

function getSingerDes(id) {
 return request.get("/artist/desc?id="+id);
}

function getSimiSinger(id) {
 return request.get("/simi/artist?id="+id+"&cookie="+getCookie());
}

export {
    getSimiSinger,
    getSingerAlbum,
    getSingerDes,
    getSingerInfo,
    getSingerMV
}
