import request from "../util/axios";
import {getCookie} from "./Cookie";

//type:
// 1: mv
//
// 4: 电台
//
// 5: 视频
//
// 6: 动态
//t:1点赞 t=0取消
function likeResources(id,type,t) {
    return request.post("/resource/like?t="+t+"&type="+type+"&id="+id+"&cookie="+getCookie());
}
//t:1点赞 t=0取消
function subScribeMV(id,t) {
  return request.post("/mv/sub?t="+t+"&mvid="+id+"&cookie="+getCookie());
}
//t:1点赞 t=0取消
function subScribeVideo(id,t) {
    return request.post("/video/sub?t="+t+"&id="+id+"&cookie="+getCookie());
}

//t=1 收藏 t=2取消
function subScribePlayList(id,t) {
    return request.post("/playlist/subscribe?t="+t+"&id="+id+"&cookie="+getCookie());
}
//t:1收藏 t=0取消
function subScribeAlbum(id,t) {
    return request.post("/album/sub?t="+t+"&id="+id+"&cookie="+getCookie())
}

function likeSong(id) {
   return request.post("/like?id="+id+"&cookie="+getCookie());
}

export {
    likeResources,
    likeSong,
    subScribeMV,
    subScribePlayList,
    subScribeVideo,
    subScribeAlbum

}



