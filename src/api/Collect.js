import request from "../util/axios";
import {getCookie} from "./Cookie";

function getUserCollectSinger() {
  return request.get("/artist/sublist?cookie="+getCookie());

}
function getUserCollectVideo() {
  return request.get("/mv/sublist?cookie="+getCookie());
}

function getUserCollectAlbum() {
  return request.get("/album/sublist?cookie="+getCookie());
}

export {
   getUserCollectAlbum,
    getUserCollectSinger,
    getUserCollectVideo
}
