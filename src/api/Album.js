import {get,post} from "../util/axios";

function getAlbumDetail(id) {
   return get("/album",{id});
}

function getAlbumInfo(id) {
  return get("/album/detail/dynamic",{id});
}


export {
    getAlbumDetail,
    getAlbumInfo
}



