import { get } from "../util/axios";
import { formatSongDuration } from "../util/convenience";
import { createError } from "../component/notification/Notification";

function checkMusic(id) {
  return get("/check/music", {
    id,
  });
}
function getSongDetailData(ids) {
  return get("/song/detail", {
    ids,
  });
}
function getSongURL(id) {
  return get("/song/url", {
    id,
  });
}

function getSongLyric(id) {
  return get("/lyric", {
    id,
  });
}

function getSimiSong(id) {
  return get("/simi/song", {
    id,
  });
}

async function getSong(id) {
  let song = {};

  let response = await checkMusic(id);
  if (!response.data.success) {
    createError(response.data.message);
    return null;
  }

  let res = await getSongDetailData(id);
  let data = res.data.songs[0];
  song.id = data.id;
  song.name = data.name;
  song.author = data.ar[0].name;
  song.totaltime = formatSongDuration(data.dt);
  song.pic = data.al.picUrl;
  let res_url = await getSongURL(id);
  song.src = res_url.data.data[0].url;

  return song;
}
async function getSongDetail(id) {
  let song = {};
  let lyric = await getSongLyric(id);
  if (lyric.data.nolyric) {
    song.lyric = null;
    song.tlyric = null;
  } else {
    song.lyric = lyric.data.lrc.lyric;
    if (lyric.data.tlyric.lyric) {
      song.tlyric = lyric.data.tlyric.lyric;
    } else {
      song.tlyric = null;
    }
  }
  let simi = await getSimiSong(id);
  song.simi = simi.data.songs;
  return song;
}

function getSongByTrackID(tracks) {
  return getSongDetailData(tracks.join(","));
}

export { getSong, getSongByTrackID, getSongDetail };
