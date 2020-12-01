import { get } from "../util/axios";

function getUserDetail(id) {
  return get("/user/detail", {
    uid: id,
  });
}

function getUserPlayList(id) {
  return get("/user/playlist", {
    uid: id,
  });
}
export { getUserDetail, getUserPlayList };
