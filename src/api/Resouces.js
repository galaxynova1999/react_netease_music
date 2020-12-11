import { post } from "../util/axios";

/**
 * 点赞资源
 * @param {string} id
 * @param {number | string} type 1-mv 4-电台 5-视频 6-动态
 * @param {number | string} t 1-点赞 0-取消
 * @returns {Promise}
 */
function likeResources(id, type, t) {
  return post("/resource/like", {
    t,
    type,
    id,
  });
}
//t:1点赞 t=0取消
function subScribeMV(id, t) {
  return post("/mv/sub", {
    t,
    mvid: id,
  });
}
//t:1点赞 t=0取消
function subScribeVideo(id, t) {
  return post("/video/sub", {
    t,
    id,
  });
}

//t=1 收藏 t=2取消
function subScribePlayList(id, t) {
  return post("/playlist/subscribe", {
    t,
    id,
  });
}
//t:1收藏 t=0取消
function subScribeAlbum(id, t) {
  return post("/album/sub", {
    t,
    id,
  });
}

function likeSong(id) {
  return post("/like", {
    id,
  });
}

export {
  likeResources,
  likeSong,
  subScribeMV,
  subScribePlayList,
  subScribeVideo,
  subScribeAlbum,
};
