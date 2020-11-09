import {get,post} from "../util/axios";

function getBanner(){
    return get("/banner");
}
function getDailyRecommendPlayList() {
    return get("/personalized",{
        limit:10
    });
}

function getDailyRecommendNewMusic() {
    return get("/personalized/newsong");
}
function getDailyRecommendNewMV() {
    return get("/personalized/mv");
}
function getPrivateContent() {
   return get("/personalized/privatecontent");
}

function getLeaderBoard() {
    return get("/toplist");
}

function getSingerList(area,type,init) {
   return get("/artist/list",{
       type,
       area,
       initial:init,
       limit:30
   });
}

function topSong(type) {
  return get("/top/song",{
      type
  });
}
function topAlbum() {
  return get("/top/album",{
      limit:30
  });
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
