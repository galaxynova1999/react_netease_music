import request from "../util/axios";
import {getCookie} from "./Cookie";
function getBanner(){
    return request.get("/banner");
}
function getDailyRecommendPlayList() {
    return request.get("/personalized?limit=10");
}

function getDailyRecommendNewMusic() {
    return request.get("/personalized/newsong");
}
function getDailyRecommendNewMV() {
    return request.get("/personalized/mv");
}
function getPrivateContent() {
   return request.get("/personalized/privatecontent");
}

function getLeaderBoard() {
    return request.get("/toplist");
}

function getSingerList(area,type,init) {
   return request.get("/artist/list?type="+type+"&area="+area+"&initial="+init+"&cookie="+getCookie()+"&limit=30")
}

function topSong(type) {
  return request.get("/top/song?type="+type);
}
function topAlbum() {
  return request.get("/top/album?limit=30")
}

export {
    getBanner,
    getDailyRecommendPlayList,
    getDailyRecommendNewMusic,
    getDailyRecommendNewMV,
    getLeaderBoard,
    getSingerList,
    getPrivateContent,
    topAlbum,
    topSong
}
