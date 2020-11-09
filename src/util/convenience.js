import {createError, createWarn} from "../component/notification/Notification";
import loginState from "../mobx/loginState";
import songState from "../mobx/songState";
import {getSong} from "../api/Music";
import moment from "moment";

function checkLogin() {
    if(loginState.isLogin !== true){
        createWarn("还未登录哦!");
        return false;
    }
    return true;
}
function changeRouteTo(ctx,route,needLogin = false) {
    if(needLogin) {
        if(!checkLogin()) {
            return;
        }
    }
    ctx.history.push(route);
}

function changeSong(id) {
    getSong(id).then((res) => {
        songState.changeSong(res);
    }).catch(function (err) {
        createError(err)
    })
}

function createPicURL(src,x,y) {
    return `${src}?param=${x}y${y}`;
}

function changeRouteToMV(ctx,id) {
    ctx.history.push({pathname:"/playvideo/mv/"+id});
}

function changeRouteToVideo(ctx,id) {
    ctx.history.push({pathname:"/playvideo/video/"+id});
}

function changeRouteToSinger(ctx,id) {
    ctx.history.push({pathname:'/singer/'+id});
}

function changeRouteToAlbum(ctx,id) {
    ctx.history.push({pathname:"/playlist/album/"+id});
}

function changeRouteToPlayList(ctx,id) {
    ctx.history.push({pathname:"/playlist/songlist/"+id});
}

function changeRouteToUser(ctx,id) {
    ctx.history.push({pathname:"/user/"+id});
}

function bytesToSize(bytes) {
    if (bytes === 0)
        return '0 B';
    let k = 1024;
    const sizes = ['B','KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let i = Math.floor(Math.log(bytes) / Math.log(k));
    let num = bytes / Math.pow(k, i);
    return num.toPrecision(3) + ' ' + sizes[i];
}

function formatSongDuration(duration) {
    let moments = moment.duration(duration);
    let result = "";
    if(moments.minutes()<10){
        result += "0" + moments.minutes();
    }
    else {
        result += moments.minutes()
    }
    if(moments.seconds() < 10){
        result += ":0" + moments.seconds()
    }
    else
        result += ":"+moments.seconds();

    return result;
}


function calcSecond(time) {
    let array = time.split(":");
    let minute = parseInt(array[0]);
    let second = parseInt(array[1]);
    return minute * 60 + second;
}

export {
    changeRouteTo,
    checkLogin,
    changeSong,
    createPicURL,
    changeRouteToSinger,
    changeRouteToMV,
    changeRouteToVideo,
    changeRouteToAlbum,
    changeRouteToPlayList,
    changeRouteToUser,
    bytesToSize,
    formatSongDuration,
    calcSecond
}
