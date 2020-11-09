import {get,post} from "../util/axios";

function getUserCollectSinger() {
  return get("/artist/sublist");

}
function getUserCollectVideo() {
  return get("/mv/sublist");
}

function getUserCollectAlbum() {
  return get("/album/sublist");
}

export {
   getUserCollectAlbum,
    getUserCollectSinger,
    getUserCollectVideo
}
