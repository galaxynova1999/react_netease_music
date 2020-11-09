import request from "../util/axios";
import {formatSongDuration} from "../util/convenience"
import {getCookie} from "./Cookie";
import {createError} from "../component/notification/Notification";


async function getSong(id) {
        let song={};

        let response = await request.get("/check/music?id="+id);
        if(!response.data.success){
            createError(response.data.message);
            return null;
        }

        let res = await request.get("/song/detail?ids="+id+"&cookie="+getCookie());
        let data = res.data.songs[0];
        song.id = data.id;
        song.name = data.name;
        song.author = data.ar[0].name;
        song.totaltime = formatSongDuration(data.dt);
        song.pic = data.al.picUrl;
        let res_url = await request.get("/song/url?id="+id+"&cookie="+getCookie());
        song.src = res_url.data.data[0].url;

        return song;
}
async function getSongDetail(id) {
    let song = {};
    let lyric = await request.get("/lyric?id="+id+"&cookie="+getCookie());
    if(lyric.data.nolyric){
        song.lyric = null;
        song.tlyric = null;
    }
    else {
        song.lyric = lyric.data.lrc.lyric;
        if(lyric.data.tlyric.lyric){
            song.tlyric = lyric.data.tlyric.lyric
        }
        else {
            song.tlyric = null;
        }

    }
    let simi = await request.get("/simi/song?id="+id);
    song.simi = simi.data.songs;
    return song;
}

function getSongByTrackID(tracks) {
     let url = "/song/detail?ids=";
     for(let i = 0;i < tracks.length - 1; i++) {
         url += tracks[i] + ",";
     }
     url += tracks[tracks.length - 1];
     url += "&cookie="+getCookie();
     return request.get(url);
}





export {
    getSong,
    getSongByTrackID,
    getSongDetail
}
