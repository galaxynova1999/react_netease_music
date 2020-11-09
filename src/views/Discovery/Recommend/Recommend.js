import React from "react";
import {
    getBanner,
    getDailyRecommendPlayList,
    getDailyRecommendNewMusic,
    getDailyRecommendNewMV,
    getPrivateContent
} from "../../../api/Main";
import style from "./style.module.css"
import {Link, withRouter} from "react-router-dom";
import {observer} from "mobx-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import {createError} from "../../../component/notification/Notification";
import MoonLoader from "react-spinners/MoonLoader"
import {css} from "@emotion/core"
import {changeSong} from "../../../util/convenience";
const override = css`
  display: block;
  margin: 0 auto;
`;


@observer
class Recommend extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            banner:[],
            playlist:[],
            newmusic:[],
            mv:[],
            private:[],
            loading:true
        }
    }
    componentDidMount() {

        let that=this;
        getBanner().then(function (res) {
            that.setState({banner:res.data.banners});
            getDailyRecommendPlayList().then(function (res) {
                that.setState({playlist:res.data.result});
                getPrivateContent().then(function (res) {
                  that.setState({private:res.data.result});
                    getDailyRecommendNewMusic().then(function (res) {
                        that.setState({newmusic:res.data.result});
                        getDailyRecommendNewMV().then(function (res) {
                            that.setState({mv:res.data.result});
                            that.setState({loading:false});
                        })
                    })
                })

            })

        }).catch(function (result) {
           createError(`错误 ${result}`)
        })

    };

    handleNewMusic(id){
      changeSong(id);
    }

    handleNewPlayList(id){
        this.props.history.push({pathname:"/playlist/songlist/"+id});
    }

    handlePrivate(id){
        this.props.history.push({pathname:"/playvideo/mv/"+id});
    }

    render() {

        const BannerData=this.state.banner.map((item,index)=>{
            return(
                <div key={index} className={style.banner} >
                    <img src={item.imageUrl+"?param=900y270"} alt="1" style={{borderRadius:"10px", maxWidth:"100%", maxHeight:"100%", width:"auto", height:"auto"}}/>
                </div>
            )
        })

        const DailyRecommendPlayListData=this.state.playlist.map((item,index)=>{
            return(
                <div
                    key={index}
                    style={{ flexBasis:"12vw",height:"220px",marginLeft:"40px",marginBottom:"40px",cursor:"pointer"}}
                    onClick={this.handleNewPlayList.bind(this,item.id)}
                >
                    <img
                        src={item.picUrl+"?param=200y200"}
                        alt="1"
                        style={{borderRadius:"10px", maxWidth:"100%", maxHeight:"100%", width:"auto", height:"auto"}}
                    />
                    <p style={{fontSize:"15px"}}>{item.name}</p>
                </div>
            )
        })
        const PrivateContent = this.state.private.map( (item,index) => {
            return(
                <div
                    key = {index}
                    style = {{ flexBasis:"20vw",height:"200px",marginLeft:"40px",cursor:"pointer"}}
                    onClick = {this.handlePrivate.bind(this,item.id)}
                >
                  <img
                      src={item.picUrl + `?param=380y180`}
                      alt="pic"
                      style={{borderRadius:"10px", maxWidth:"100%", maxHeight:"100%", width:"auto", height:"auto"}}
                  />
                  <p style={{fontSize:"15px"}}>{item.name}</p>
                </div>
        )
        })



        const DailyRecommendNewMVData=this.state.mv.map( (item,index) => {
            return (
                <div  className={style.mv} key={index}>
                    <Link to={"/playvideo/mv/"+item.id} style={{textDecoration:"none"}}>
                        <img
                            src={item.picUrl+"?param=280y150"}
                            alt="1"
                            style={{borderRadius:"10px", maxWidth:"100%", maxHeight:"100%", width:"auto", height:"auto"}}
                        />
                    </Link>
                    <div style={{fontSize:"15x"}}>
                        <p >{item.name}</p>
                        <p style={{color:"rgb(186,186,186)",fontSize:"0.9em"}}>{item.artistName}</p>
                        <span style={{position:"absolute",right:"0",top:"0",zIndex:"1",color:"white"}}>{item.playCount}</span>
                    </div>
                </div>
            )
        })

        let bannersettings = {
            dots: true,
            autoplay:true,
            pauseOnDotsHover:true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
        };

        return (
            <div className={style.main}>
                <div>
                    {
                        this.state.loading?
                            (<MoonLoader
                                size={40}
                                css={override}
                                color={"#123abc"}
                                loading={this.state.loading}
                            />): <Slider {...bannersettings} style={{width:"100%",height:"270px",marginTop:"20px"}}>
                                {BannerData}
                            </Slider>
                    }

                </div>
                <p style={{fontSize:"18px",marginLeft:"11%",marginBottom:"10px",marginTop:"50px"}}>推荐歌单 ></p>
                <div className={style.playlist}>
                    {this.state.loading?
                        (<MoonLoader
                        size={40}
                        css={override}
                        color={"#123abc"}
                        loading={this.state.loading}
                    />):DailyRecommendPlayListData}
                </div>
                <p style={{fontSize:"18px",marginLeft:"11%",marginBottom:"10px",marginTop:"50px"}}>独家放送 ></p>
                <div className={style.private}>
                    {this.state.loading?
                        (<MoonLoader
                            size={40}
                            css={override}
                            color={"#123abc"}
                            loading={this.state.loading}
                        />):PrivateContent}
                </div>
                <p style={{fontSize:"18px",marginLeft:"11%",marginBottom:"10px",marginTop:"50px"}}>最新音乐 ></p>
                <div className={style.musicdiv}>

                    {
                        this.state.loading?
                            (<MoonLoader
                                size={40}
                                css={override}
                                color={"#123abc"}
                                loading={this.state.loading}
                            />):
                        this.state.newmusic.map((item,index)=>{
                        return(
                            <div  key={index} className={style.music}>
                                <img src={item.picUrl+"?param=60y60"} style={{float:"left",borderRadius:"5px"}} alt="1" onClick={this.handleNewMusic.bind(this,item.id)} />
                                <span style={{float:"left",marginTop:"20px",marginLeft:"15px",color:"#bababa"}}>{index===9?"10":"0"+(index+1)}</span>
                                <div style={{float:"left",marginLeft:"10px",marginTop:"10px",fontSize:"15px"}}>
                                    <p style={{ whiteSpace:"nowrap", textOverflow:"ellipsis",overflow:"hidden", width:"25vw"}} >{item.song.name}</p>
                                    <p style={{color:"rgb(186,186,186)",fontSize:"0.9em"}}>{item.song.artists[0].name}</p>
                                </div>
                            </div>
                        )

                    })}
                </div>
                <p style={{fontSize:"18px",marginLeft:"11%",marginBottom:"10px",marginTop:"50px"}}>推荐MV ></p>
                <div className={style.mvdiv}>
                    {this.state.loading?
                        (<MoonLoader
                            size={40}
                            css={override}
                            color={"#123abc"}
                            loading={this.state.loading}
                        />):DailyRecommendNewMVData}
                </div>
            </div>
        )


    }


}

export default withRouter(Recommend)
