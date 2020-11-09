import React from "react";
import classnames from 'classnames'
import {withRouter} from "react-router-dom"
import SendIcon from '@material-ui/icons/Send';
import RadioIcon from '@material-ui/icons/Radio';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import MusicVideoIcon from '@material-ui/icons/MusicVideo';
import {NavLink} from "react-router-dom";
import style from "./style.module.css";
import Divider from "@material-ui/core/Divider";
import userPlayListState from "../../mobx/userPlayListState";
import {observer} from "mobx-react";
import { changeRouteTo } from "../../util/convenience"
import StarsIcon from '@material-ui/icons/Stars';
import CloudQueueIcon from '@material-ui/icons/CloudQueue';


@observer
class MySide extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            currentIndex:""
        }
    }

    handleMeLike(){
        changeRouteTo(this.props,"/playlist/songlist/"+userPlayListState.userLikePlayListID,true);
    }
    handleMeCloud(){
        changeRouteTo(this.props,"/cloud",true)
    }

    handlePersonalFM(){
        changeRouteTo(this.props,'/fm',true)
    }
    handleMeCollect(){
        changeRouteTo(this.props,"/collect",true);
    }

    render() {
        let that=this;
        return(
            <div style={{width:"100%"}} className={style.main} >
                    <p style={{fontSize:"15px"}}>推荐</p>
                    <Divider/>
                <NavLink className={style.NavLink} to="/discovery" >
                    <div className={classnames(style.ListItem,(this.props.location.pathname.indexOf("/discovery") === 0)?style.active:style.deactive)}>
                        <SendIcon style={{marginLeft:"10px",fontSize:"18px"}}/>
                        <span>发现音乐</span>
                    </div>
                </NavLink>
                    <div onClick={this.handlePersonalFM.bind(this)} className={classnames(style.ListItem,this.props.location.pathname==="/fm"?style.active:style.deactive)}>
                        <RadioIcon style={{marginLeft:"10px",fontSize:"18px"}}/>
                        <span>私人FM</span>
                    </div>
                <NavLink className={style.NavLink} to="/video" >
                    <div className={classnames(style.ListItem,this.props.location.pathname==="/video"?style.active:style.deactive)}>
                        <VideoLibraryIcon style={{marginLeft:"10px",fontSize:"18px"}}/>
                        <span >视频</span>
                    </div>
                </NavLink>
                <p style={{fontSize:"15px"}}>我的音乐</p>
                <Divider/>
                <div className={classnames(style.ListItem,this.props.location.pathname==="/cloud"?style.active:style.deactive)} onClick={this.handleMeCloud.bind(this)}>
                    <CloudQueueIcon style={{marginLeft:"10px",fontSize:"18px"}}/>
                    <span>我的音乐云盘</span>
                </div>
                <div className={classnames(style.ListItem,(this.props.location.pathname==="/collect")?style.active:style.deactive)} onClick={this.handleMeCollect.bind(this)} >
                    <StarsIcon style={{marginLeft:"10px",fontSize:"18px"}}/>
                    <span>我的收藏</span>
                </div>

                <p style={{fontSize:"15px"}}>创建的歌单 <AddCircleOutlineIcon style={{float:"right",fontSize:"23px"}} /></p>
                <Divider/>
                <div className={classnames(style.ListItem,this.props.location.pathname==="/playlist/songlist/"+userPlayListState.userLikePlayListID?style.active:style.deactive)} onClick={this.handleMeLike.bind(this)}>
                    <FavoriteBorderIcon style={{marginLeft:"10px",fontSize:"18px"}}/>
                    <span>我喜欢的音乐</span>
                </div>

                {

                    userPlayListState.playList && userPlayListState.playList.map(function (item,index) {
                            return(
                                <NavLink className={style.NavLink} to={"/playlist/songlist/"+item.id} key={index}>
                                    <div className={classnames(style.ListItem,that.props.location.pathname==="/playlist/songlist/"+item.id?style.active:style.deactive)} >
                                        <MusicVideoIcon style={{marginLeft:"10px",fontSize:"18px"}}/>
                                        <span>{item.name}</span>
                                    </div>
                                </NavLink>
                            )
                    })
                }

                <p style={{fontSize:"15px"}}>收藏的歌单</p>
                <Divider/>
                {
                    userPlayListState.subscribedPlayList && userPlayListState.subscribedPlayList.map(function (item, index) {
                        return (
                            <NavLink className={style.NavLink} to={"/playlist/songlist/" + item.id} key={index}>
                                <div
                                    className={classnames(style.ListItem, that.props.location.pathname === "/playlist/songlist/" + item.id ? style.active : style.deactive)}>
                                    <MusicVideoIcon style={{marginLeft: "10px", fontSize: "18px"}}/>
                                    <span>{item.name}</span>
                                </div>
                            </NavLink>
                        )
                    })
                }

            </div>
        )
    }


}

export default withRouter(MySide)
