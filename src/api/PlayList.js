import request from "../util/axios";
import {getCookie} from "./Cookie";

function getRelatedPlayList(id) {
  return request.get("/simi/playlist?id="+id+"&cookie=" + getCookie());
}

function getPlayListDetail(id) {
    return request.get("/playlist/detail?id=" + id + "&s=5&cookie=" + getCookie());
}

function getPlayListSubscribers(id) {
    return request.get("/playlist/subscribers?id=" + id + "&limit=20");
}

function addNewSongToPlayList(pid,id) {
   return request.post("/playlist/tracks?op=add&pid="+pid+"&tracks="+id+"&cookie="+getCookie());
}

export {
    getPlayListSubscribers,
    getPlayListDetail,
    getRelatedPlayList,
    addNewSongToPlayList
}
