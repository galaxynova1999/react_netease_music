import React from "react";
import style from "./style.module.css"
import {getSongByTrackID} from "../../api/Music"
import * as moment from "moment";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {changeRouteToUser, formatSongDuration} from "../../util/convenience";
import TableContainer from "@material-ui/core/TableContainer";
import {observer} from "mobx-react";
import Button from "@material-ui/core/Button";
import {ThemeProvider} from "@material-ui/styles";
import Divider from "@material-ui/core/Divider";
import PlayCircleFilledSharpIcon from '@material-ui/icons/PlayCircleFilledSharp';
import LibraryAddOutlinedIcon from '@material-ui/icons/LibraryAddOutlined';
import { createError, createSuccess } from "../../component/notification/Notification";
import {changeRouteToAlbum, changeRouteToSinger, changeSong, checkLogin} from "../../util/convenience";
import {css} from "@emotion/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {getComment} from "../../api/Comment";
import Comment from "../../component/comment/Comment";
import {getAlbumDetail, getAlbumInfo} from "../../api/Album";
import {withRouter} from "react-router-dom";
import {getPlayListDetail, getPlayListSubscribers} from "../../api/PlayList";
import {subScribeAlbum, subScribePlayList} from "../../api/Resouces";
import theme from "../../util/Theme";
import withStyles from "@material-ui/core/styles/withStyles";
import {getUserID} from "../../api/Me";
import {MoonLoader} from "react-spinners";
import LazyLoad from 'react-lazyload';
const override = css`
  display: block;
  margin-left: 500px;
  margin-top:100px;
`;
const PlayAllButton = withStyles({
    root: {
        backgroundColor: '#c62f2f',
        color:"white"
    },
})(Button);
const CollectedButton = withStyles({
    root: {
        backgroundColor: '#c62f2f',
        color:"white"
    },
})(Button);
const UnCollectedButton = withStyles({
    root: {
        backgroundColor:"white",
        color:"black"
    },
})(Button);
@observer
class PlayList extends React.Component{

    constructor(props) {
        super(props);
        this.state={
            detailForPlayList:{
                tags:[],
                creator:{
                    avatarUrl:"",
                    birthday:"",
                    nickname:"",
                },
                name:""
            },
            detailForAlbum:{
                description:"",
                picUrl:"",
                name:"",
                alias:[],
                publishTime:"",
                artist:{
                    name:""
                }
            },
            commentCount:0,
            shareCount:0,
            subCount:0,
            songdetail:[],
            comment:[],
            collector:[],
            loading_top:true,
            loading_bottom:true,
            currentIndex:"0",
            isSub:false,
            subscribed:false
        }
    }
    handleSelect(id){
       changeSong(id);
    }
    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if( this.props.match.params.id !== nextProps.match.params.id ||
            this.props.match.params.type !== nextProps.match.params.type
        ){
            this.setState({
                detailForPlayList:{
                    tags:[],
                    creator:{
                        avatarUrl:"",
                        birthday:"",
                        nickname:"",
                        userId:""
                    },
                    description:""
                },
                detailForAlbum:{
                    description:"",
                    picUrl:"",
                    name:"",
                    alias:[],
                    publishTime:"",
                    artist:{
                        name:""
                    }
                },
                songdetail:[],
                comment:[],
                collector:[]
                })
            this.requestForData(nextProps);
        }
    }

    requestForData(props){
        this.setState({
            loading_bottom:true,
            loading_top:true
        });

        let id = props.match.params.id;
        let type = props.match.params.type;
        if(type === "songlist"){
            getPlayListDetail(id).then( (res) => {
                this.setState({
                    detailForPlayList:res.playlist,
                    subscribed:res.playlist.subscribed
                });
                let tracksid = [];
                for(let i = 0;i < res.playlist.tracks.length; i++){
                    tracksid.push(res.playlist.tracks[i].id);
                }
                getSongByTrackID(tracksid).then( (res) => {
                    this.setState({
                        songdetail:res.songs,
                        loading_bottom:false,
                        loading_top:false
                    });
                })
            }).catch(function (result) {
                createError(result);
            })
        }
        else{
            getAlbumDetail(id).then( (res) => {
                this.setState({
                    detailForAlbum:res.album,
                    songdetail:res.songs
                })
                getAlbumInfo(id).then( (res) => {
                  this.setState({
                      isSub:res.isSub,
                      likedCount:res.likedCount,
                      shareCount:res.shareCount,
                      commentCount:res.commentCount,
                      loading_bottom:false,
                      loading_top:false
                  });
                })
            }).catch(function (err) {
                createError(err);
            })
        }

    }

    componentDidMount() {
       this.requestForData(this.props);
    }


    async handleStateChange(index) {
        this.setState({
            loading_bottom: true
        });
        switch (index) {
            case "0": {
                this.setState({
                    currentIndex: "0",
                    loading_bottom: false
                });
                break;
            }
            case "1": {
                this.setState({
                    currentIndex: "1"
                });
                let type = this.props.match.params.type === "songlist" ? "2" : "3";
                if (this.state.comment.length === 0) {
                    let res = await getComment(this.props.match.params.id, type);
                    this.setState({
                        loading_bottom: false,
                        comment: res.data.comments || []
                    });
                }
                else {
                    this.setState({
                        loading_bottom:false
                    });
                }
                break;
            }
            case "2": {
                this.setState({
                    currentIndex: "2"
                })
                if(this.props.match.params.type === "songlist"){
                    if (this.state.collector.length === 0) {
                        let res = await getPlayListSubscribers(this.props.match.params.id);
                        this.setState({
                            loading_bottom: false,
                            collector: res.subscribers || []
                        });
                    }
                    else {
                        this.setState({
                            loading_bottom:false
                        });
                        break;
                    }
                }
            }
            default:
                return null;
        }
    }
    handleSelectAlbum(id){
        changeRouteToAlbum(this.props,id);
    }
    handleCollect(){
        if(!checkLogin())
            return;
        let id = this.props.match.params.id;
        if(this.props.match.params.type === "songlist"){
         if(this.state.subscribed===true){
             subScribePlayList(id,2).then( (res) => {
                     createSuccess("取消收藏成功");
                     this.setState({
                         subscribed:false
                     });
             }).catch(function (err) {
                     createError(err);
             })
         }
         else {
             subScribePlayList(id,1).then( (res) => {
                 createSuccess("收藏成功");
                 this.setState({
                     subscribed:true
                 });
             }).catch(function (err) {
                 createError(err)
             })
         }
     }
        else {
            if(this.state.isSub === true){
                subScribeAlbum(id,0).then( (res) => {
                    createSuccess("取消收藏成功");
                    this.setState({
                        isSub:false
                    });
                }).catch(function (err) {
                    createError(err)
                })
            }
            else {
                subScribeAlbum(id,1).then( (res) => {
                    createSuccess("收藏成功");
                    this.setState({
                        isSub:true
                    });
                }).catch(function (err) {
                    createError(err);
                })
            }
        }
    }

    songList() {
        return(
            <div className={style.songlist}>
                <TableContainer >
                    <Table style={{ width:"70vw" }}>
                        <TableHead>
                            <TableRow>
                                <TableCell >序号</TableCell>
                                <TableCell >音乐标题</TableCell>
                                <TableCell >歌手</TableCell>
                                <TableCell >专辑</TableCell>
                                <TableCell >时长</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { this.state.songdetail.map((row,index) => (

                                <TableRow key={row.id} onDoubleClick={this.handleSelect.bind(this,row.id)} hover={true} >
                                    <TableCell >
                                        {
                                            index < 9 ? "0"+(index+1) : index+1
                                        }
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <span>{row.name}</span>
                                        {
                                            row.alia.length !== 0 && <span style={{color:"#bababa"}}>({row.alia[0]})</span>
                                        }
                                    </TableCell>
                                    <TableCell  >
                                        {
                                          row.ar.map( (item,index,array) => {
                                                if(index === array.length - 1){
                                                    return <span
                                                        key={index}
                                                        className={style.singer}
                                                        onClick={() => {changeRouteToSinger(this.props,item.id)}}
                                                    >
                                                        {item.name}
                                                    </span>;
                                                }
                                                else {
                                                    return <span
                                                        key={index}
                                                        className={style.singer}
                                                        onClick={() => {changeRouteToSinger(this.props,item.id)}}
                                                    >
                                                        {item.name+"/"}
                                                    </span>
                                                }
                                            })
                                        }
                                    </TableCell>
                                    <TableCell
                                        onClick={() => {changeRouteToAlbum(this.props,row.al.id)}}
                                        className={style.album}
                                    >
                                        {row.al.name}
                                    </TableCell>
                                    <TableCell >{formatSongDuration(row.dt)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        )
    }
    songComment(){
        if(this.state.comment.length === 0){
            return (
                <div style={{width:"600px",marginLeft:"200px",lineHeight:"200px",textAlign:"center",fontSize:"18px"}}>
                    暂无数据
                </div>
            )
        }

        return (
            <div style={{marginLeft:"50px",marginTop:"20px"}}>
                {
                    this.state.comment.map( (item,index) => {
                        return <Comment
                            data={item}
                            key={index}
                            style={{marginLeft:"40px",marginTop:"10px"}}
                            type={this.props.match.params === "songlist" ? 2 : 3}
                            id={this.props.match.params.id}/>
                    })
                }
            </div>
        )
    }
    songCollector() {
        if(this.state.collector.length === 0){
            return (
                <div style={{width:"600px",marginLeft:"200px",lineHeight:"200px",textAlign:"center",fontSize:"18px"}}>
                    暂无数据
                </div>
            )
        }
      return(
          <div style={{display:"flex",alignItems:"center",width:"1000px",flexWrap:"wrap",marginLeft:"50px",marginTop:"20px"}}>
              {
                  this.state.collector.map( (item,index) => {
                  return(
                      <div style={{width:"100px",height:"100px",margin:"20px 20px 20px 20px"}} key={index}>
                          <div>
                              <LazyLoad height={60}>
                                  <img
                                      alt="avatar"
                                      src={item.avatarUrl+"?param=60y60"}
                                      style={{borderRadius:"50%",cursor:'pointer'}}
                                      onClick={() => {
                                          changeRouteToUser(this.props,item.userId)
                                      }}
                                  />
                              </LazyLoad>
                          </div>
                          <p style={{fontSize:"12px"}}>{item.nickname}</p>
                      </div>
                  )
              })
              }
          </div>
      )
    }

    listview(){
       switch (this.state.currentIndex) {
           case "0":return this.songList();
           case "1":return this.songComment();
           case "2":{
               if(this.props.match.params.type === "songlist")
                   return this.songCollector();
               else {
                   if(this.state.detailForAlbum.description === null || this.state.detailForAlbum.description === ""){
                       return  <div style={{width:"600px",marginLeft:"200px",lineHeight:"200px",textAlign:"center",fontSize:"18px"}}>
                           暂无数据
                       </div>
                   }
                   return (
                       <div style={{width:"1000px",fontSize:"18px",marginLeft:"50px",marginTop:"20px",textAlign:"center"}}>
                       {this.state.detailForAlbum.description}
                     </div>)
               }
           }
           default:return null;
       }

}
    des(){
        let des;
        if(this.state.detailForPlayList.description===null || this.state.detailForPlayList.description===""){
            des = "暂无简介"
        }
        else if(this.state.detailForPlayList.description.length>120){
            des = this.state.detailForPlayList.description.substring(0,120)+"...";
        }
        else
            des = this.state.detailForPlayList.description;
        return des;
    }


    render() {
        const tags = () => {
            if(this.state.detailForPlayList.tags.length === 0){
                return "暂无标签"
            }
            else return (
                this.state.detailForPlayList.tags.map(function (item,index,array) {
                    if(index === array.length -1)
                        return item;
                    return item+"/";
                })
            )
        }

        const info = () => {
            if(this.props.match.params.type === "songlist") {
                let describe;
                if(this.state.loading_top){
                    describe = null
                }
                else {
                    describe = (<p style={{fontSize:"14px",marginTop:"8px"}}>简介:{this.des()}</p>)
                }

                return(
                    <>
                    <p style={{fontSize:"14px"}}>标签:{tags()}</p>
                        {describe}
                    </>
                )
            }
            else {
                return (
                    <>
                    <p>歌手: {this.state.detailForAlbum.artist.name}</p>
                    <p>时间: {moment(this.state.detailForAlbum.publishTime).format("YYYY-MM-DD")}</p>
                    </>
                )
            }
        }
        let img;
        let name;
        if(this.props.match.params.type === "songlist") {
            img = (
                <img
                    src={this.state.detailForPlayList.coverImgUrl+"?param=225y225"}
                    alt="111"
                    style={{borderRadius:"10px"}}
                />);
            name = (
                <span
                    style={{fontSize:"25px",fontWeight:"bold",marginLeft:"5px"}}
                >
                    {this.state.detailForPlayList.name}
                </span>);
        }
        else {
            img = <img
                src={this.state.detailForAlbum.picUrl+"?param=225y225" }
                alt="111"
                style={{borderRadius:"10px"}}
            />
            name = <span
                style={{fontSize:"25px",fontWeight:"bold",marginLeft:"5px"}}
            >
                {this.state.detailForAlbum.name}
            </span>;
        }

        return(
            <div className={style.main}>
                {
                    this.state.loading_top?
                        <MoonLoader
                            size={40}
                            css={override}
                            color={"#123abc"}
                            loading={this.state.loading_top}
                        />
                        :
                        <div className={style.top}>
                        <div className={style.image}>
                            <LazyLoad height={225} once={true}>
                                {img}
                            </LazyLoad>
                        </div>
                        <div className={style.info}>
                            <div style={{height:"60px"}}>
                                <div style={{float:"left"}}>
                                    <div style={{
                                        width:"45px",
                                        height:"30px",
                                        backgroundColor:"rgb(198,47,47)",
                                        display:"inline-block",
                                        textAlign:"center",
                                        lineHeight:"30px",
                                        borderRadius:"5px",
                                        color:"white"
                                    }}
                                    >
                                        {this.props.match.params.type === "songlist" ? "歌单" : "专辑"}
                                    </div>
                                    {name}
                                </div>
                                {
                                    this.props.match.params.type === "songlist" && (
                                        <div style={{float:"right",height:"30px",marginTop:"5px"}}>
                                          <span style={{float:"left"}}>歌曲数 {this.state.detailForPlayList.trackCount}</span>
                                          <Divider orientation="vertical" style={{float:"left",marginLeft:"5px",marginRight:"5px"}}/>
                                          <span style={{float:"left"}}>播放数 {this.state.detailForPlayList.playCount}</span>
                                        </div>
                                    )
                                }

                            </div>
                            {
                                this.props.match.params.type === "songlist" &&
                                <div style={{display:"flex",alignItems:"center"}}>
                                    <img src={this.state.detailForPlayList.creator.avatarUrl+"?param=40y40"} alt="" style={{borderRadius:"50%"}}/>
                                    <span style={{marginLeft:"10px"}}>{this.state.detailForPlayList.creator.nickname}</span>
                                    <span style={{marginLeft:"20px"}}>{moment(this.state.detailForPlayList.createTime).format("YYYY-MM-DD")}创建</span>
                                </div>
                            }

                            <div style={{marginTop:"20px"}}>
                                    <PlayAllButton
                                        variant="contained"
                                        startIcon={<PlayCircleFilledSharpIcon />}
                                    >
                                        播放全部
                                    </PlayAllButton>
                                {
                                    (this.state.subscribed || this.state.isSub) ?
                                        <CollectedButton
                                           variant="contained"
                                           style={{marginLeft:"10px"}}
                                           startIcon={<LibraryAddOutlinedIcon/>}
                                           onClick={this.handleCollect.bind(this)}
                                    >
                                        已收藏(
                                            {
                                                this.props.match.params.type === "songlist" ?
                                                    this.state.detailForPlayList.subscribedCount:this.state.subCount
                                            }
                                            )
                                        </CollectedButton>
                                        :
                                        <UnCollectedButton
                                            variant = "outlined"
                                            style = {{marginLeft:"10px"}}
                                            startIcon = {<LibraryAddOutlinedIcon/>}
                                            onClick = {this.handleCollect.bind(this)}
                                            disabled = {this.state.detailForPlayList.creator.userId === getUserID()}
                                        >

                                            收藏(
                                            {
                                                this.props.match.params.type === "songlist" ?
                                                this.state.detailForPlayList.subscribedCount : this.state.subCount
                                            }
                                            )
                                        </UnCollectedButton>
                                }
                            </div>

                            <div style={{marginTop:"20px"}}>
                                {
                                    info()
                                }
                            </div>
                        </div>
                    </div>
                }
                <div>
                    <ThemeProvider theme={theme}>
                        <Tabs
                            indicatorColor="primary"
                            textColor="secondary"
                            value={this.state.currentIndex}
                            style={{marginLeft:"40px",marginTop:"20px"}}
                        >
                            <Tab label="歌曲列表" value="0" onClick={this.handleStateChange.bind(this,"0")}/>
                            <Tab label="评论" value="1" onClick={this.handleStateChange.bind(this,"1")}/>
                            <Tab
                                label={ this.props.match.params.type === "songlist" ? "收藏者" : "专辑详情"}
                                value="2"
                                onClick={this.handleStateChange.bind(this,"2")}
                            />
                        </Tabs>
                    </ThemeProvider>
                </div>
                {
                    this.state.loading?
                        (<MoonLoader
                            size={40}
                            css={override}
                            color={"#123abc"}
                            loading={this.state.loading_bottom}
                        />):this.listview.bind(this)()

                }
            </div>
        )
    }
}

export default withRouter(PlayList)
