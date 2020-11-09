import {get,post} from "../util/axios";


function sendComment(type,t,id,content,commentID) {

    return post("/comment",{
        t,
        type,
        id,
        content,
        commentId:t === 2 ? commentID : null
    });
}


function likeComment(id,cid,t,type) {

  return post("/comment/like",{
      id,
      cid,
      t,
      type
  });
}

function getComment(id,type,pageNo = 1,pageSize = 6,sortType = 2) {
    return get('/comment/new',{
        type,
        id,
        sortType,
        pageSize,
        pageNo
    });
}

function getHotComment(id,type) {

  return get('/comment/hot',{
      id,
      type
  });
}


export {
    sendComment,
    likeComment,
    getComment,
    getHotComment
}
