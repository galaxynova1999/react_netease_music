import React from "react";
import Player from 'griffith'
import {
    getMVDetails,
    getMVVideoRealSrc,
    getMVInfo,
    getSimiMV,
    getVideoDetails,
    getVideoRealSrc, getVideoInfo, getSimiVideo
} from "../../api/MV"
import 'moment/locale/zh-cn'
import Comment from "../../component/comment/Comment";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ShareIcon from '@material-ui/icons/Share';
import LibraryAddOutlinedIcon from '@material-ui/icons/LibraryAddOutlined';
import {formatSongDuration} from "../../util/convenience"
import {getComment, getHotComment} from "../../api/Comment";
import {withRouter} from "react-router-dom";
import {css} from "@emotion/core";
import MoonLoader from 'react-spinners/MoonLoader'
import Divider from "@material-ui/core/Divider";
import * as moment from "moment";
import Button from "@material-ui/core/Button";
import {createError, createSuccess} from "../../component/notification/Notification";
import {likeResources} from "../../api/Resouces";
import withStyles from "@material-ui/core/styles/withStyles";
import { changeRouteToMV, changeRouteToVideo, checkLogin} from "../../util/convenience";
import Pagination from "@material-ui/lab/Pagination";
let source = {
    hd:{
            play_url:"",
            format:"video/mp4",
            width:750,
            height:500,
            size:0,
            bitrate:1000,
            duration:1000
    }
}
let cover = "";
const override1 = css`
  margin-left:450px;
`;
const override2 = css`
  margin-top:70px;
  margin-left:290px
`;
const override3 = css`
  margin-left:1200px;
  margin-top:0
`;
const LikedButton = withStyles({
    root: {
        backgroundColor: '#c62f2f',
        color:"white"
    },
})(Button);
const UnlikedButton = withStyles({
    root: {
        color: 'black',
    },
})(Button);
class Video extends React.Component{

    constructor(props) {
        super(props);
        this.state={
            video:{},
            commentCount:"",
            comments:[],
            hotComments:[],
            simi:[],
            shareCount:0,
            likedCount:0,
            loadingVideo:true,
            loadingSimi:true,
            loadingCom:true,
            liked:false,
            pageNo:1,
            pageCount:0
        }
    }
    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(this.props.match.params.id !== nextProps.match.params.id){
            this.requestData(nextProps.match);
        }
    }

    componentWillUnmount() {
        if (this.player) {
            this.player.dispose()
        }
    }

    componentDidMount() {
      this.requestData(this.props.match);
    }

    async requestData(match){
        this.setState({
            loadingVideo:true,
            loadingSimi:true,
            loadingCom:true
        });
        let id = match.params.id;

        if(match.params.type === "mv") {
            let detailData = await getMVDetails(id);
            cover = detailData.data.data.cover;
            let realSRC = await getMVVideoRealSrc(id);
            source.hd.play_url = realSRC.data.data.url;
            source.hd.size = realSRC.data.data.size
            let info = await getMVInfo(id);

            let comment = await getComment(id,"1",1,10);
            let hotComment = [];//await getHotComment(id,1);
            let simi = await getSimiMV(id);

            this.setState({
                video:detailData.data.data,
                commentCount:info.data.commentCount,
                shareCount:info.data.shareCount,
                likedCount:info.data.likedCount,
                liked:info.data.liked,
                comments:comment.data.data.comments,
                pageCount:Math.ceil(comment.data.data.totalCount / 10),
                //hotComments: hotComment.data.hotComments,
                simi:simi.data.mvs,
                loadingVideo:false,
                loadingCom:false,
                loadingSimi:false
            })

        }
        else if(match.params.type === "video"){
            let detailData = await getVideoDetails(id);
            source.hd.height=detailData.data.data.height;
            source.hd.width=detailData.data.data.width;
            cover=detailData.data.data.coverUrl;
            let realSRC = await getVideoRealSrc(id);
            source.hd.play_url=realSRC.data.urls[0].url;
            source.hd.size=realSRC.data.urls[0].size
            let info = await getVideoInfo(id);
            let comment = await getComment(id,"5");
            let hotComment = [];//await getHotComment(id,5);
            let simi = await getSimiVideo(id);
            this.setState({
                video:detailData.data.data,
                commentCount:info.data.commentCount,
                shareCount:info.data.shareCount,
                likedCount:info.data.likedCount,
                comments:comment.data.data.comments,
                //hotComments:hotComment.data.hotComments,
                simi:simi.data.data,
                loadingVideo:false,
                loadingCom:false,
                loadingSimi:false
            })

        }
    }

    fetchCommentData(pageNo) {
        let type = this.props.match.params.type === "video" ? '5' : '1';

        getComment(this.props.match.params.id,type,pageNo,10).then((res) => {
                this.setState({
                    comments:res.data.data.comments
                })
        });
    }

    handleSimi(id) {
        if(this.props.match.params.type === "video"){
            changeRouteToVideo(this.props,id);
        }
        else {
            changeRouteToMV(this.props,id);
        }
    }

    handleLike(){
        if(!checkLogin()){
            return;
        }
        let type = this.props.match.params.type === "video" ? 5 : 1;
        let id = this.props.match.params.id;

        if(this.state.liked){
            likeResources(id,type,0).then( (res) => {
              createSuccess("取消点赞成功");
              this.setState({
                  liked:false,
                  likedCount:parseInt(this.state.likedCount) - 1
              });
            }).catch(function (err) {
              createError(err)
            })
        }
        else {
            likeResources(id,type,1).then( (res) => {
                createSuccess("点赞收到");
                this.setState({
                    liked:true,
                    likedCount:parseInt(this.state.likedCount) + 1
                });
            }).catch(function (err) {
                createError(err);
            })
        }

    }

    render() {
        const CommentsData=this.state.comments.map((item) => {
            return(
                <Comment
                    data={item}
                    type={this.props.match.params.type === "video" ? 5 : 1}
                    id={this.props.match.params.id}
                    key={item.commentId}/>)
        });
        let hotComments = null;
        if(this.state.hotComments.length !== 0){
            hotComments = this.state.hotComments.map((item,index) => {
                return(
                    <Comment
                        data={item}
                        key={index}
                        type={this.props.match.params.type === "video" ? 5 : 1}
                        id={this.props.match.params.id}/>)
            })
        }
        const Simi = this.state.simi.map((item,index) => {
            let author = () => {
                if(this.props.match.params.type === "video"){
                    return "by " + item.creator.map(function (item,index,arr) {
                        if(index === arr.length-1) {
                            return item.name || item.userName;
                        }
                        else {
                            return item.name + "/"
                        }

                    })
                }
                else {
                    return "by " + item.artists.map(function (item,index,arr) {
                        if(index === arr.length-1) {
                            return item.name;
                        }
                        else {
                            return item.name + "/";
                        }
                    })
                }
            };
               return(
                   <div style={{minHeight:"100px",Width:"200px",display:"flex",cursor:"pointer",marginTop:"5px"}} key={index} onClick={this.handleSimi.bind(this,item.id || item.vid)}>
                       <div>
                           <img  alt="avatar" src={this.props.match.params.type === "video" ?
                               item.coverUrl+"?param=150y90" : item.cover+"?param=150y90"}/>
                       </div>
                       <div style={{marginLeft:"10px",fontSize:"16px"}}>
                           <span >{this.props.match.params.type === "video" ? item.title : item.name}</span>
                           <br/>
                           <span style={{fontSize:"0.9em",color:"rgb(136,136,136)"}}>{formatSongDuration(this.props.match.params.type === "video" ?
                               item.durationms : item.duration)}</span>
                           <br/>
                           <span style={{fontSize:"0.9em",color:"rgb(136,136,136)"}}>{author()}</span>
                       </div>

                   </div>
               )
        })

        return(
            <div style={{ display:"flex"}}>
                <div style={{ flexShrink:"1"}}>
                    {
                        this.state.loadingVideo ?
                            <MoonLoader
                                size={40}
                                css={override1}
                                color={"#123abc"}
                                loading={this.state.loadingVideo}
                            /> :
                                <div style={{width: "45vw", paddingTop:"20px", paddingLeft:"40px"}}>
                                    <span
                                        style={{
                                        fontSize: "20px",
                                        fontWeight: "bold"
                                    }}>
                                        {this.state.video.name || this.state.video.title}
                                    </span>
                                    <span
                                        style={{
                                        fontSize: "14px",
                                        color: "#bababa"
                                    }}>
                                        {this.state.video.artistName || "by " + this.state.video.creator.nickname}
                                    </span>
                                    <div style={{marginTop: "10px"}}>
                                        <Player id="video-player" duration={100} cover={cover} sources={source} />
                                    </div>
                                </div>
                    }
                                <div style={{marginTop:"20px",paddingLeft:"40px"}}>
                                    {
                                        this.state.liked ?
                                            <LikedButton
                                            variant={"contained"}
                                            style={{fontSize:"15px"}}
                                            startIcon={<ThumbUpIcon />}
                                            onClick={this.handleLike.bind(this)}
                                        >
                                            已点赞({this.state.likedCount})
                                        </LikedButton> :
                                            <UnlikedButton
                                                variant={"outlined"}
                                                style={{fontSize:"15px"}}
                                                startIcon={<ThumbUpIcon />}
                                                onClick={this.handleLike.bind(this)}
                                        >
                                            赞({this.state.likedCount})
                                        </UnlikedButton>
                                    }
                                        <Button
                                            variant="outlined"
                                            style={{marginLeft:"10px",fontSize:"15px"}}
                                            startIcon={<ShareIcon/>}
                                        >
                                            分享({this.state.shareCount})
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            style={{marginLeft:"10px",fontSize:"15px"}}
                                            startIcon={<LibraryAddOutlinedIcon/>}
                                        >
                                            收藏
                                        </Button>
                                </div>

                    <div style={{marginTop:"70px",paddingLeft:"40px",width:"45vw"}}>
                        <p style={{fontSize:"20px",marginTop:"10px",marginBottom:"10px",marginLeft:"20px"}}>精彩评论</p>
                        <Divider/>
                    {
                        this.state.loadingCom ?
                            <MoonLoader
                            size={40}
                            css={override2}
                            color={"#123abc"}
                            loading={this.state.loadingCom}
                        /> :
                            <>
                            { hotComments === null ?
                                (<div style={{height:"150px",textAlign:"center",lineHeight:"150px",fontSize:"25px"}}>暂无热门评论</div>)
                                :hotComments
                            }
                            <p style={{fontSize:"20px",marginTop:"10px",marginBottom:"10px",marginLeft:"20px"}}>全部评论</p>
                            <Divider/>
                            {CommentsData}
                                <Pagination
                                    page = {this.state.pageNo}
                                    count = {this.state.pageCount}
                                    style = {{padding:"20px 100px"}}
                                    onChange = {(e,value) => {
                                        this.setState({
                                            pageNo:value
                                        },() => {
                                            this.fetchCommentData(value);
                                        })

                                    }}
                                />
                           </>
                    }
                        </div>
                </div>
                        <div style={{ flexBasis:"15vw", flexGrow:"1", padding:"40px" }}>
                            <div style={{ paddingLeft:"20px" }}>
                                <p style={{fontSize:"20px"}}>{this.props.match.params.type === "video" ? "视频" : "MV"}介绍</p>
                                <Divider/>
                                <p style={{color:"#bababa",marginTop:"5px"}}>
                                    <span style={{fontSize:"15px"}}>
                                        发布时间:{moment(this.state.video.publishTime).format("YYYY-MM-DD")}
                                    </span>
                                    <span style={{marginLeft:"15px",fontSize:"15px"}}>
                                        播放量:{this.state.video.playTime || this.state.video.playCount}
                                    </span>
                                </p>
                                <p style={{fontSize:"15px",color:"rgb(102,102,102)",marginTop:"5px"}}>
                                    简介:{this.state.video.description || this.state.video.desc}
                                </p>
                            </div>
                            <div style={{marginTop:"180px",paddingLeft:"20px"}}>
                                <p style={{fontSize:"20px"}}>
                                    相似{this.props.match.params.type ==="video" ? "视频" : "MV"}
                                </p>
                                <Divider/>

                                {
                                    this.state.loadingSimi ?
                                        <MoonLoader
                                            size={40}
                                            css={override3}
                                            color={"#123abc"}
                                            loading={this.state.loadingSimi}
                                        /> :Simi
                                }
                            </div>
                        </div>

            </div>
        )
    }
}

export default withRouter(Video)
