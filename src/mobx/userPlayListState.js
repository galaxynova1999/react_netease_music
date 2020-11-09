import {observable, action} from "mobx";
import { setUserPlayList } from "../api/localPlayRecord"
class userPlayListState {
    @observable userLikePlayListID =
        localStorage.getItem("userLikePlayListID");
    @observable playList =
        JSON.parse(localStorage.getItem("playList"));
    @observable subscribedPlayList =
        JSON.parse(localStorage.getItem("subscribedPlayList"));

    @action.bound
    updatePlayList(id, list){

        if(!list) {
            setUserPlayList(null,null,null);
            this.playList = null;
            this.subscribedPlayList = null;
            this.userLikePlayListID = null;
            return;
        }
        let playList = [];
        let subscribedPlayList = [];
        list.forEach((item) => {
            if(item.subscribed) {
                subscribedPlayList.push(item);
            }
            else {
                playList.push(item);
            }
        })
        setUserPlayList(id,playList,subscribedPlayList);
        this.playList = playList;
        this.subscribedPlayList = subscribedPlayList;
        this.userLikePlayListID = id;
    }


}

export default new userPlayListState();
