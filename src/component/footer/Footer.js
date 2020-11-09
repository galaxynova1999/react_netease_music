import React from "react";
import style from "./style.module.css"
import PlayCircleFilledSharpIcon from '@material-ui/icons/PlayCircleFilledSharp';
import SkipNextSharpIcon from '@material-ui/icons/SkipNextSharp';
import SkipPreviousSharpIcon from '@material-ui/icons/SkipPreviousSharp';
import IconButton from "@material-ui/core/IconButton";
import {createMuiTheme} from "@material-ui/core/styles";
import {ThemeProvider} from "@material-ui/styles";
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import VolumeMuteIcon from '@material-ui/icons/VolumeMute';
import QueueMusicIcon from '@material-ui/icons/QueueMusic';
import {observer} from "mobx-react";
import songState from "../../mobx/songState";
import MusicDetailState from "../../mobx/DetailState";
import Slider from '@material-ui/core/Slider';
import {getLastSong,getNextSong,getPrevSong} from "../../api/local/localPlayRecord"
import {Popover} from "@material-ui/core";
import UserPlayRecordAndPlayHistory from "../playrecord/playrecord";
import withStyles from "@material-ui/core/styles/withStyles";
import {changeSong, createPicURL} from "../../util/convenience";
import throttle  from 'lodash/throttle';
import MusicDetail from "../../views/musicDetail/MusicDetail";
import { CSSTransition } from "react-transition-group";
import detailState from '../../mobx/DetailState';
import {PAUSE,WAITING} from "../../util/constant";
import './style.css';

const MyButton = withStyles({
    root: {
        color: '#c62f2f',
    },
})(IconButton);
const PrettoSlider = withStyles({
    root: {
        color: '#c62f2f',
        height: 8,
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        marginTop: -8,
        marginLeft: -12,
        '&:focus, &:hover, &$active': {
            boxShadow: 'inherit',
        },
    },
    active: {},
    valueLabel: {
        left: 'calc(-50% + 4px)',
    },
    track: {
        height: 8,
        borderRadius: 4,
    },
    rail: {
        height: 8,
        borderRadius: 4,
    },
})(Slider);
const theme = createMuiTheme({
    palette: {
        primary:{
            main:"#c62f2f"
        },
        secondary:{
            main:"rgb(84,84,86)"
        }
    },
});


@observer
class MyFooter extends React.Component{
    constructor(props) {
        super(props);
        this.player = null;
        this.state={
                currentTime:"00:00",
                currentValue:0,
                mute:false,
                volume:50,
                playListOpen:false,
        }
    }

    handlePlay(){

        if(!this.player)
            return;
        if(songState.playStatus === WAITING || songState.playStatus === PAUSE) {
            this.player.play();
            songState.changePlayStatusToPlaying();
        }
        else{
            this.player.pause();
            songState.changePlayStatusToPause();
        }
    }
    componentWillUnmount() {
        if(!this.player)
            return;
        this.player.removeEventListener("timeupdate",this.timeUpdateListener.bind(this));
        this.player.removeEventListener("durationchange",this.songChange.bind(this));
    }
    timeUpdateListener() {
        let timeDisplay;
        //用秒数来显示当前播放进度
        timeDisplay = Math.floor(this.player.currentTime);//获取实时时间
        //处理时间
        //分钟
        let minute = timeDisplay / 60;
        let minutes = parseInt(minute);
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        //秒
        let second = timeDisplay % 60;
        let seconds = Math.round(second);
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        let result = minutes + ":" + seconds;

        this.setState({
            currentValue:Math.round(this.player.currentTime),
            currentTime:result
        });

    }
    initPlayer(){
        let player = document.getElementById("music");
        if(player){
            this.player = player;
            player.addEventListener("timeupdate",throttle(this.timeUpdateListener.bind(this),1000));
            player.addEventListener("durationchange",this.songChange.bind(this));
            player.addEventListener("ended",this.songEnded.bind(this));
        }
    }
    songEnded(){
        //切换下一首
        if(!this.nextSong()) {
            //没有下一首则暂停
            songState.changePlayStatusToPause();
            this.setState({
                currentValue:0,
                currentTime:"00:00"
            });
        }
    }

    nextSong(){
      // changeSong(getNextSong());
        console.log(getNextSong());
        return false;
    }
    prevSong(){
       // changeSong(getPrevSong());
        console.log(getPrevSong());
    }

    songChange(){
        this.setState({
            currentValue:0
        })
    }
    componentDidMount() {
        this.initSong();
        this.initPlayer();
    }
    handleMute() {
        if(!this.player)
            return;
        if(this.state.mute) {
            this.player.muted = false;
            this.setState({
                mute:false,
                volume:50
            });
        }
        else {
            this.player.muted = true;
            this.setState({
                    mute: true,
                    volume:0
                });
        }
    }

    handleInto() {
        MusicDetailState.toggle(!MusicDetailState.show);
    }

    handleVolumeChange(event,newVal){

        if(newVal === 0){
            this.setState({
                mute:true
            });
        }
        else {
            this.setState({
                mute:false
            });
        }
        this.setState({
            volume:newVal
        });
        this.player.volume = newVal * 0.01;

    }

     initSong(){
        changeSong(getLastSong().id);
    }



    handlePlayProgressChange(e,newVal){
        this.setState({
            currentValue: newVal
        })
    }
    handlePlayProgressChangeCommitted(e,newVal){
        this.player.currentTime = newVal;
        if(songState.playStatus === WAITING || songState.playStatus === PAUSE) {
            this.player.play();
            songState.changePlayStatusToPlaying();
        }
    }



    render() {
        let playButton = null;
        if(songState.playStatus === WAITING || songState.playStatus === PAUSE) {
            playButton = <PlayCircleFilledSharpIcon style={{ fontSize: 50 }}/>
        }
        else
            playButton = <PauseCircleFilledIcon style={{fontSize:50}}/>
        let volumeButton = null;
        if(!this.state.mute){
            volumeButton = <VolumeUpIcon style={{fontSize: 30}}/>
        }
        else {
            volumeButton = <VolumeMuteIcon style={{fontSize: 30}}/>
        }

        return (
            <>
                <CSSTransition
                    in = {detailState.show}
                    timeout = {1000}
                    classNames = 'musicDetail'
                    mountOnEnter
                    unmountOnExit
                >
                    <MusicDetail id={songState.id}/>
                </CSSTransition>
                <div>
                    <div className={style.main}>
                        <div className={style.left}>
                            <img
                                src={createPicURL(songState.pic,60,60)}
                                style={{borderRadius:"5px",maxWidth:"60px"}}
                                onClick={this.handleInto.bind(this)}
                                alt="pic"/>
                            <div>
                                <span style={{fontSize: "14px",maxHeight:"40px",display:"block",overflow:"hidden",wordBreak:"break-all"}}>{songState.name}</span>
                                <span style={{fontSize:"12px",color:"rgb(186,186,186)",height:"24px"}}>{songState.author}</span>
                            </div>

                        </div>
                        <div className={style.middle}>
                            <MyButton  onClick={this.prevSong.bind(this)}>
                                <SkipPreviousSharpIcon style={{fontSize: 38}}/>
                            </MyButton>
                            <MyButton  style={{marginLeft: "20px"}} onClick={this.handlePlay.bind(this)}>
                                {playButton}
                            </MyButton>
                            <MyButton  style={{marginLeft: "20px"}} onClick={this.nextSong.bind(this)}>
                                <SkipNextSharpIcon style={{fontSize: 38}}/>
                            </MyButton>
                        </div>
                        <div className={style.progress}>
                            <span style={{fontSize: "16px"}}>{this.state.currentTime}</span>
                            <PrettoSlider
                                value={this.state.currentValue}
                                min={0}
                                max={songState.totalSecond}
                                onChange={this.handlePlayProgressChange.bind(this)}
                                onChangeCommitted={this.handlePlayProgressChangeCommitted.bind(this)}
                                style={{ marginLeft: "20px"}}
                            />
                            <span style={{paddingLeft: "15px", fontSize: "16px"}}>{songState.totalTime}</span>
                        </div>
                        <div className={style.right}>
                            <ThemeProvider theme={theme}>
                                <IconButton  onClick={this.handleMute.bind(this)}>
                                    {volumeButton}
                                </IconButton>
                                <Slider value={this.state.volume} onChange={this.handleVolumeChange.bind(this)}  style={{width:"150px"}}/>
                                <IconButton  id="playlist" onClick={() => {
                                    this.setState({
                                        playListOpen:true
                                    })
                                }}>
                                    <QueueMusicIcon style={{fontSize:30}}/>
                                </IconButton>
                            </ThemeProvider>
                        </div>
                    </div>
                    <audio src={songState.src} id="music" style={{ display:"none" }}  />
                    <Popover
                        open={ this.state.playListOpen }
                        onClose={() => {this.setState({
                            playListOpen:false
                        })}}
                        anchorEl={document.getElementById("playlist")}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'center',
                            horizontal: 'center',
                        }}
                        disableAutoFocus={true}
                        disableEnforceFocus={true}
                    >
                        <UserPlayRecordAndPlayHistory/>
                    </Popover>
                </div>

            </>
        )

    }
}

export default MyFooter
