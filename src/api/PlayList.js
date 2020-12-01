import { get, post } from "../util/axios";

function getRelatedPlayList(id) {
  return get("/simi/playlist", {
    id,
  });
}

function getPlayListDetail(id) {
  return get("/playlist/detail", {
    id,
    s: 8,
  });
}

function getPlayListSubscribers(id) {
  return get("/playlist/subscribers", {
    id,
    limit: 20,
  });
}

function addNewSongToPlayList(pid, id) {
  return post("/playlist/tracks", {
    op: "add",
    pid,
    tracks: id,
  });
}

export {
  getPlayListSubscribers,
  getPlayListDetail,
  getRelatedPlayList,
  addNewSongToPlayList,
};
