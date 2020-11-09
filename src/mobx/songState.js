import { observable, action } from "mobx";
import { addNewSong } from "../api/localPlayRecord"
import { calcSecond } from "../util/convenience";


import {PAUSE,PLAYING,WAITING} from "../util/constant";


class songStateStore {

    @observable id = "431085465";
    @observable name = "Graduate";
    @observable author = "";
    @observable pic = "";
    @observable totalTime = "";
    @observable src = "";
    @observable playStatus = WAITING;
    @observable lyric = "";
    @observable comments = {
        hotComments:[],
        comments:[]
    };
    @observable totalSecond=0;
    @observable currentIndexInPlayList=0;

    @action.bound
    changeSong(newSong) {
        if(newSong === null)
            return;
        this.id = newSong.id;
        this.name = newSong.name;
        this.author = newSong.author;
        this.pic = newSong.pic;
        this.totalTime = newSong.totaltime;
        this.src = newSong.src;
        this.playStatus = WAITING;
        this.totalSecond = calcSecond(newSong.totaltime);
        let song = {
            id:newSong.id,
            name:newSong.name
        }
        this.currentIndexInPlayList = addNewSong(song);
    }

    @action.bound
    changeStatus(status) {
        this.playStatus = status;
    }

    @action
    changePlayStatusToPause() {
        this.playStatus = PAUSE;
    }
    @action
    changePlayStatusToPlaying() {
        this.playStatus = PLAYING;
    }
    @action
    changePlayStatusToWaiting() {
        this.playStatus = WAITING;
    }

}




export default new songStateStore()
