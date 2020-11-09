import request from "../util/axios";
import {getCookie} from "./Cookie";

function sendComment(type,t,id,content,commentID) {
    let url="/comment?t="+t+"&type="+type+"&id="+id+"&content="+content;
    if(t===2){
        url+="&commentId="+commentID;
    }
    url+="&cookie="+getCookie();
    return request.post(url)
}


function likeComment(id,cid,t,type) {
  let url="/comment/like?id="+id+"&cid="+cid+"&t="+t+"&type="+type;
    url+="&cookie="+getCookie();
  return request.post(url);
}

function getComment(id,type,pageNo = 1,pageSize = 6,sortType = 2) {
    let url = `/comment/new?type=${type}&id=${id}&sortType=${sortType}&pageSize=${pageSize}&pageNo=${pageNo}&cookie=${getCookie()}`;
    return request.get(url);
}

function getHotComment(id,type) {
  let url="/comment/hot?id="+id+"&type="+type;
    url+="&cookie="+getCookie();
  return request.get(url);
}


export {
    sendComment,
    likeComment,
    getComment,
    getHotComment
}
