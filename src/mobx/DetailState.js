import {observable, action, runInAction} from "mobx";
import {getSong, getSongDetail} from "../api/Music";
import {getRelatedPlayList} from "../api/PlayList";
import {getComment} from "../api/Comment";


class DetailState {
    @observable show = false;
    @observable data = {
        id:"",
        lyric:null,
        tlyric:null,
        pic: "",
        author: "",
        name:"",
        comments: [],
        hotComments: [],
        simiSong:[],
        simiPlayList:[],
        currentPage:1,
        totalCount:0,
        count:0,
        loading:true,
    };
    @observable loading_comment = true;


    @action.bound
    toggle(s){
        this.show = s;
    }

    @action
    async changeSong(id) {
        if(id === null ||id === "")
            return;
        this.data.loading = true;
        this.loading_comment = true;
        let [res1,res2,res3,res4] = await Promise.all([
            getSongDetail(id),
            getRelatedPlayList(id),
            getSong(id),
            getComment(id,0,1,6),
            //getHotComment(id,0)
        ]);

        runInAction(() => {

            let _t = res1.tlyric !== null ? res1.tlyric : null;
            this.data = {
                id:id,
                lyric:res1.lyric,
                tlyric: _t,
                simiSong:res1.simi,

                simiPlayList:res2.data.playlists,

                pic:res3.pic,
                author:res3.author,
                name:res3.name,


                comments: res4.data.data.comments,
                //todo
                hotComments: [],

                count:Math.ceil(res4.data.data.totalCount / 6),
                totalCount:res4.data.data.totalCount,
                currentPage:1,

                loading:false,
            }
            this.loading_comment = false;
        })
    }

    @action
    async changeComment(pageNo) {
        this.loading_comment = true;
        let res = await getComment(this.data.id,0,pageNo);
        runInAction(() => {
            this.data.comments = res.data.data.comments;
            this.data.currentPage = pageNo;
            this.loading_comment = false;
        })
    }
}

export default new DetailState();
