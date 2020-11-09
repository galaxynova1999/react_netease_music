import request from "../util/axios";
import {getCookie} from "./Cookie";
function getMVDetails(id){
    return request.get("/mv/detail?mvid="+id+"&cookie="+getCookie());
}
function getMVVideoRealSrc(id) {
    return request.get("/mv/url?id="+id+"&cookie="+getCookie());
}

function getMVInfo(id) {
    return request.get("/mv/detail/info?mvid="+id+"&cookie="+getCookie());
}


function getSimiMV(id) {
    return request.get("/simi/mv?mvid="+id+"&cookie="+getCookie());
}

function getVideoDetails(id) {
   return request.get("/video/detail/?id="+id+"&cookie="+getCookie());
}
function getVideoInfo(id) {
   return request.get("/video/detail/info?vid="+id+"&cookie="+getCookie());
}

function getVideoRealSrc(id) {
   return request.get("/video/url?id="+id+"&cookie="+getCookie());
}
function getSimiVideo(id) {
   return request.get("/related/allvideo?id="+id+"&cookie="+getCookie());
}

function getVideoTag() {
    return request.get("/video/group/list");
}
function getVideoCat() {
   return request.get("/video/category/list");
}

export  {
    getMVDetails,
    getMVVideoRealSrc,
    getMVInfo,
    getSimiMV,
    getSimiVideo,
    getVideoDetails,
    getVideoInfo,
    getVideoRealSrc,
    getVideoCat,
    getVideoTag
}
