import { get } from "../util/axios";

/**
 * 获取MV详情
 * @param {string | number} id
 * @returns {Promise}
 */
function getMVDetails(id) {
  return get("/mv/detail", {
    mvid: id,
  });
}

/**
 * 获取MV的播放地址
 * @param {string | number} id
 * @returns {Promise}
 */
function getMVVideoRealSrc(id) {
  return get("/mv/url", {
    id,
  });
}

function getMVInfo(id) {
  return get("/mv/detail/info", {
    mvid: id,
  });
}

function getSimiMV(id) {
  return get("/simi/mv", {
    mvid: id,
  });
}

function getVideoDetails(id) {
  return get("/video/detail", {
    id,
  });
}

function getVideoInfo(id) {
  return get("/video/detail/info", {
    vid: id,
  });
}

function getVideoRealSrc(id) {
  return get("/video/url", {
    id,
  });
}
function getSimiVideo(id) {
  return get("/related/allvideo", {
    id,
  });
}

function getVideoTag() {
  return get("/video/group/list");
}
function getVideoCat() {
  return get("/video/category/list");
}

export {
  getMVDetails,
  getMVVideoRealSrc,
  getMVInfo,
  getSimiMV,
  getSimiVideo,
  getVideoDetails,
  getVideoInfo,
  getVideoRealSrc,
  getVideoCat,
  getVideoTag,
};
