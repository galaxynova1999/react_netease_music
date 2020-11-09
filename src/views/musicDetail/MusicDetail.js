import React from "react";
import styles from "./style.module.css"
import Comment from "../../component/comment/Comment";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import classnames from "classnames"
import {ThemeProvider} from "@material-ui/styles";
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from "@material-ui/icons/Share";
import LibraryAddOutlinedIcon from "@material-ui/icons/LibraryAddOutlined";
import Lyric from "../../component/Lyric/Lyric"
import {addNewSongToPlayList} from "../../api/PlayList";
import {createError, createSuccess} from "../../component/notification/Notification";
import {changeRouteToPlayList, changeSong, checkLogin, createPicURL} from "../../util/convenience";
import {sendComment} from "../../api/Comment";
import {Popover} from "@material-ui/core";
import userPlayList from "../../mobx/userPlayListState";
import theme from "../../util/Theme";
import { withRouter } from "react-router-dom";
import { observer } from "mobx-react";
import MusicDetailState from "../../mobx/DetailState";
import detailState from '../../mobx/DetailState'
import Pagination from '@material-ui/lab/Pagination';
import songState from "../../mobx/songState";
import {PLAYING} from "../../util/constant";
import LazyLoad from 'react-lazyload'

@observer
class MusicDetail extends React.Component{
   constructor(props) {
       super(props);
       this.state = {
           currentLine:0,
           openCollect:false,
           myComment:"",
       }
   }
    componentDidMount() {
       detailState.changeSong(this.props.id);
    }

   UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
       if(this.props.id !== nextProps.id) {
           detailState.changeSong(nextProps.id);
       }
   }


    handleCommentChange(e) {
       this.setState({
           myComment:e.target.value
       })
    }
    handleComment(){
      if(!checkLogin()){
          return;
      }
      sendComment("0",1,this.props.id,this.state.myComment).then(function (res) {
          createSuccess("评论成功!")
      }).catch(function (err) {
         createError(err);
      })
    }

    handleSelectSimiPlayList(id){
        changeRouteToPlayList(this.props,id);
        MusicDetailState.toggle(false);
    }



    SimiSong(){
      return(
          <div >
              <p
                  style={{fontSize:"18px" ,margin:"10px 0 10px 20px"}}
              >相似歌曲
              </p>
              <Divider/>
              {
                  detailState.data.simiSong.map( (item,index) => {
                  return(
                     <div
                         onClick = {() => {
                             changeSong(item.id);
                         }}
                         style={{padding:"10px 0",height:"70px", paddingLeft:"10px"}}
                         key={index}
                         className={styles.simi}
                     >
                          <div style={{float:"left"}}>
                            <img
                                src={createPicURL(item.album.picUrl,60,60)}
                                alt="pic"
                                style={{ borderRadius:"5px" }}/>
                          </div>
                          <div style={{float:"left",marginLeft:"15px", fontSize:"16px", marginTop:"10px"}}>
                              <p className={styles.describe_overflow}>{item.album.name}</p>
                              <p style={{fontSize:"0.8em"}}>
                                  {
                                      item.album.artists.map(function (item,index,array) {
                                      if(index === array.length - 1){
                                          return item.name;
                                      }
                                      else {
                                          return (item.name) + "/";
                                      }
                              })}
                              </p>
                          </div>
                     </div>
                  )
              })}
          </div>
      )
   }
    SimiPlayList(){
        return(
            <div style={{marginTop:"15px"}} >
                <p
                    style={{fontSize:"18px",margin:"10px 0 10px 20px"}}
                >
                    包含这首歌的歌单
                </p>
                <Divider/>
                {
                    detailState.data.simiPlayList.map( (item,index) => {
                    return(
                        <div
                            onClick={this.handleSelectSimiPlayList.bind(this,item.id)}
                            style={{padding:"10px 0",height:"70px",paddingLeft:"10px"}}
                            key={index}
                            className={styles.simi}
                        >
                            <div style={{float:"left"}}>
                                <img
                                    src={createPicURL(item.coverImgUrl,60,60)}
                                    alt="pic"
                                    style={{borderRadius:"5px"}}
                                />
                            </div>
                            <div style={{float:"left",marginLeft:"15px", fontSize:"16px", marginTop:"10px"}}>
                                <p className={styles.describe_overflow}>{item.name}</p>
                                <p style={{ fontSize:"0.8em"}}>
                                   播放: {item.playCount}
                                </p>
                            </div>
                        </div>

                    )
                })}
            </div>
        )
    }

    handleCollect(id){
       if(!checkLogin()) {
           return ;
       }
       addNewSongToPlayList(id,this.state.id).then( (res) => {
               createSuccess("收藏成功!");
       }).catch(function (err) {
               createError("收藏失败，可能歌单中已存在这首歌" + err);
       })
       this.setState({
           openCollect:false
       })

    }


    render() {
        const CommentsData = detailState.data.comments.map( (item) => {
            return(
                <Comment
                       data={item}
                       key={item.commentId}
                       type={0}
                       id={detailState.data.id}
                />)
        });
        let hotComments = null;
        if(detailState.data.hotComments.length !== 0){
            hotComments = detailState.data.hotComments.map(function (item,index) {
                 return(
                     <Comment
                           data={ item }
                           key={ index }
                           style={{marginLeft:"40px",marginTop:"10px"}}
                           type={ 0 }
                           id={detailState.data.id}
                     />)
            })
        }
        return (
            <div className={styles.musicDetail}>
                <div className={styles.top}>
                        <div className={styles.topLeft}>
                            <img
                                src={createPicURL(detailState.data.pic,350,350)}
                                style={{ borderRadius:"50%",marginTop:"20%" }}
                                alt=""
                                className={classnames(styles.pic,songState.playStatus === PLAYING ? styles.pic_ani : styles.pic_no_ani)}
                            />
                            <div style={{ marginTop:"100px",marginLeft:"20px" }}>
                                <ThemeProvider theme={theme}>
                                    <Button
                                        variant={"outlined"}
                                        style={{fontSize:"15px"}}
                                        startIcon={<FavoriteIcon />}
                                    >
                                        喜欢
                                    </Button>
                                </ThemeProvider>
                                <Button
                                    variant="outlined"
                                    style={{marginLeft:"15px",fontSize:"15px"}}
                                    startIcon={<ShareIcon/>}
                                >
                                    分享
                                </Button>
                                <Button
                                    variant="outlined"
                                    style={{marginLeft:"15px",fontSize:"15px"}}
                                    startIcon={<LibraryAddOutlinedIcon/>}
                                    id="collect"
                                    onClick={ () => {
                                        this.setState({
                                            myCollect:true
                                        })
                                    }}
                                >
                                    收藏
                                </Button>

                                <Popover
                                    open={this.state.openCollect}
                                    onClose={() => {
                                        this.setState({
                                            openCollect : false
                                        })
                                    }}
                                    anchorEl={document.getElementById("collect")}
                                    anchorOrigin={{
                                        vertical: 'center',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    disableEnforceFocus={true}
                                >
                                    <div style={{width:"300px",height:"250px",overflowY:"scroll"}} className={styles.collect}>
                                        {
                                            userPlayList.playList && userPlayList.playList.map( (item,index) => {
                                                return(
                                                    <div
                                                        style={{display:"flex",height:"80px"}}
                                                        key={index}
                                                        className={styles.collect_item}
                                                        onClick={this.handleCollect.bind(this,item.id)}
                                                    >
                                                        <div style={{margin:"15px"}}>
                                                            <img src={item.coverImgUrl+"?param=50y50"} alt="pic"/>
                                                        </div>
                                                        <div style={{marginTop:"15px"}}>
                                                            <p>{item.name}</p>
                                                            <p>{item.trackCount}首音乐</p>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </Popover>
                            </div>
                        </div>

                    <div className={styles.topRight}>
                        <p style={{fontWeight:"bold"}}>{detailState.data.name}</p>
                        <p style={{fontSize:"0.45em"}}>
                            <span>作者:{detailState.data.author}</span>
                        </p>
                        {
                            !detailState.data.loading && <Lyric lyric={detailState.data.lyric} tlyric={detailState.data.tlyric}/>
                        }

                    </div>
                </div>
                <div>
                    <div className={styles.writeComment}>
                        <p style={{marginLeft:"20px"}}>
                            <span style={{fontSize:"22px",fontWeight:"bold"}}>听友评论</span>
                            <span style={{marginLeft:"10px"}}>已有{detailState.data.totalCount}条评论</span>
                        </p>
                        <TextField
                            label="评论"
                            multiline
                            value={this.state.myComment}
                            onChange={this.handleCommentChange.bind(this)}
                            style={{ margin: 16,width:"700px" }}
                            placeholder="期待你的评论"
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <div>
                            <Button
                                variant="contained"
                                style={{marginLeft:"650px",fontSize:"15px",marginBottom:"5px"}}
                                onClick={this.handleComment.bind(this)}
                            >
                                提交
                            </Button>
                        </div>
                    </div>
                    {
                        !detailState.loading_comment &&
                        <div className={styles.comment}>
                            <p style={{fontSize:"16px",marginTop:"10px",marginBottom:"10px",marginLeft:"20px"}}>精彩评论</p>
                            <Divider/>
                            {
                                hotComments === null ?
                                    (<div
                                        style={{height:"150px",textAlign:"center",lineHeight:"150px",fontSize:"20px"}}
                                    >暂无热门评论
                                    </div>)
                                    :hotComments
                            }
                            <p style={{fontSize:"16px",marginTop:"10px",marginBottom:"10px",marginLeft:"20px"}}>全部评论</p>
                            <Divider/>
                            {CommentsData}
                            <Pagination
                                page = {detailState.data.currentPage}
                                count = {detailState.data.count}
                                style = {{padding:"20px 100px"}}
                                onChange = {(e,value) => {
                                    detailState.changeComment(value);
                                }}
                            />
                        </div>
                    }
                    <div className={styles.recommend}>
                        {
                            !detailState.data.loading &&
                            <>
                                {this.SimiSong()}
                                {this.SimiPlayList()}
                            </>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(MusicDetail)
