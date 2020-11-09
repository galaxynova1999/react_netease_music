import React from "react";
import style from "./style.module.css"
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {changeRouteToMV, changeRouteToSinger, createPicURL, formatSongDuration} from "../../util/convenience";
import TableContainer from "@material-ui/core/TableContainer";
import {observer} from "mobx-react";
import {ThemeProvider} from "@material-ui/styles";
import RotateLoader from "react-spinners/RotateLoader"
import {createError} from "../../component/notification/Notification";
import CircleLoader from "react-spinners/CircleLoader"
import {css} from "@emotion/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {withRouter} from "react-router-dom";
import {getSimiSinger, getSingerAlbum, getSingerDes, getSingerInfo, getSingerMV} from "../../api/Singer";
import theme from "../../util/Theme";
import {changeSong} from "../../util/convenience";
import LazyLoad from 'react-lazyload';
const override = css`
  display: block;
  margin-left: 500px;
  margin-top:100px;
`;
const override1 = css`
  display: block;
  margin-left: 500px;
  margin-top:50px;
`;

@observer
class Singer extends React.Component{

    constructor(props) {
        super(props);
        this.state={
            detail: {
                artist: {
                    picUrl:"",
                    musicSize:0,
                    name:"",
                    briefDesc:"",
                    albumSize:"",
                    mvSize:""
                },
                hotSongs: []
            },
            albums:[],
            mvs:[],
            comment:[],
            info:[],
            simi:[],
            loading:true,
            loading_top:true,
            currentIndex:"0"
        }
    }
    handleSelect(id){
        changeSong(id);
    }
    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(this.props.match.params.id!==nextProps.match.params.id ){
            this.setState({
                detail: {
                    artist: {
                        picUrl:"",
                        musicSize:0,
                        name:"",
                        briefDesc:"",
                        albumSize:"",
                        mvSize:""
                    },
                    hotSongs: []
                },
                albums:[],
                mvs:[],
                comment:[],
                info:[],
                simi:[],})
            this.requestForData(nextProps);
        }
    }

    requestForData(props){
        this.setState({loading:true,loading_top:true});
        let that=this;
        let id=props.match.params.id;

        getSingerInfo(id).then(function (res) {
            that.setState({detail:res.data,loading:false,loading_top:false})
        }).catch(function (err) {
            createError("网络错误")
        })

    }

    componentDidMount() {
        this.requestForData(this.props);
    }



    async handleStateChange(index) {
        let id=this.props.match.params.id;
        this.setState({loading: true});
        switch (index) {
            case "0": {
                this.setState({currentIndex: "0", loading: false})
                return;
            }
            case "1": {
                this.setState({currentIndex: "1"})
                if (this.state.albums.length === 0) {
                    let res = await getSingerAlbum(id);
                    this.setState({loading: false, albums: res.data.hotAlbums});
                    return;
                }
                this.setState({loading:false});
                return;
            }
            case "2": {
                this.setState({currentIndex: "2"})
                if(this.state.mvs.length===0){
                      let res=await getSingerMV(id);
                      this.setState({loading:false,mvs:res.data.mvs});
                      return ;
                }
                this.setState({loading:false});
                return;
            }
            case "3":{
                this.setState({currentIndex: "3"})
                if(this.state.info.length===0){
                    let res=await getSingerDes(id);
                    this.setState({info:res.data,loading:false});
                    return ;
                }
                this.setState({loading:false});
                return ;
            }
            case "4":{
                this.setState({currentIndex: "4"});
                if(this.state.simi.length===0){
                    try{
                        let res=await getSimiSinger(id);
                        this.setState({simi:res.data.artists,loading:false});
                    }catch (e) {
                        createError("网络错误")
                    }

                    return ;
                }
                this.setState({loading:false});
                return ;
            }
            default:
                return null;
        }
    }
    handleSelectAlbum(id){
        this.props.history.push({pathname:"/playlist/album/"+id});
    }
    songList(){
        return(
            <div className={style.songlist}>
                <TableContainer >
                    <Table style={{width:"70vw"}}>
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
                            { this.state.detail.hotSongs.map((row,index) => (

                                <TableRow key={row.id} onDoubleClick={this.handleSelect.bind(this,row.id)} hover={true} >
                                    <TableCell >
                                        {index<9?"0"+(index+1):index+1}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell >{
                                        row.ar.length>1? row.ar[0].name +"/" +row.ar[1].name:row.ar[0].name
                                    }</TableCell>
                                    <TableCell  onClick={this.handleSelectAlbum.bind(this,row.al.id)} className={style.album}>{row.al.name}</TableCell>
                                    <TableCell >{formatSongDuration(row.dt)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        )
    }
    singerAlbum(){
        if(this.state.albums.length === 0){
            return (
                <div style={{width:"600px",marginLeft:"200px",lineHeight:"200px",textAlign:"center",fontSize:"18px"}}>
                    暂无数据
                </div>
            )
        }
        return(
            <div className={style.songlist}>
                <TableContainer >
                    <Table style={{width:"95%"}}>
                        <TableHead>
                            <TableRow>
                                <TableCell>序号</TableCell>
                                <TableCell >封面</TableCell>
                                <TableCell>专辑名</TableCell>
                                <TableCell >歌手</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.albums.map((item,index) => {
                                let pic = null;
                                if (item.picUrl !== null) {
                                    pic = item.picUrl + "?param=100y100";
                                } else
                                    pic = item.blurPicUrl + "?param=100y100";
                                let alias=null;
                                if(item.artist.alias.length!==0){
                                    alias=item.artist.alias[0];
                                }
                                return(
                                    <TableRow key={item.id} onDoubleClick={this.handleSelectAlbum.bind(this, item.id)}
                                              hover={true}>
                                        <TableCell>
                                            {index < 9 ? "0" + (index + 1) : index + 1}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <img src={pic} alt="pic" style={{borderRadius:'10px'}}/>
                                        </TableCell>
                                        <TableCell >
                                            <span>{item.name}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span>{item.artist.name}{alias===null?null:(alias)}</span>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>


        )

    }

    singerMV(){
        if(this.state.mvs.length===0){
            return (
                <div style={{width:"70vw",marginLeft:"200px",lineHeight:"200px",textAlign:"center",fontSize:"18px"}}>
                    暂无数据
                </div>
            )
        }
        let that=this;
        return (
            <div style={{width:"70vw",display:"flex",flexWrap:"wrap", paddingLeft:"40px"}}>
                {
                    this.state.mvs.map(function (item,index) {
                        return(
                            <div style={{width:"200px",marginTop:"20px",cursor:"pointer"}} key={index} onClick={that.handleSelectMV.bind(that,item.id)}>
                                <img src={item.imgurl+"?param=180y100"} alt="pic" style={{borderRadius:"10px"}}/>
                                <p style={{fontSize:"14px",overflowWrap:"break-word"}}>{item.name}</p>
                                <p style={{fontSize:"12px",overflowWrap:"break-word"}}>{item.artistName}</p>
                            </div>
                        )
                    })
                }
            </div>
        )

    }
    singerInfo(){
        if(this.state.info.introduction.length===0 ){
            if(this.state.info.briefDesc!==""){
                return <div>
                    <p style={{fontSize:"16px"}} >{this.state.info.briefDesc}</p>
                </div>
            }
            else {
                return <div style={{width:"600px",marginLeft:"200px",lineHeight:"200px",textAlign:"center",fontSize:"18px"}}>
                    暂无数据
                </div>
            }

        }
        else if(this.state.info.introduction[0].ti===""){
            return <div>
                <p style={{fontSize:"16px"}} >{this.state.info.briefDesc}</p>
            </div>
        }
        return(
            <div style={{width:"70vw",paddingLeft:"40px"}}>
                {this.state.info.introduction.map(function (item,index) {
                   return(
                       <div key={index}>
                       <p  style={{fontSize:"20px",marginTop:"20px" }}>{item.ti}</p>
                       <p  style={{fontSize:"16px",marginTop:"10px"}}>{item.txt}</p>
                       </div>
                   )
                })}

            </div>
        )
    }


    simiSinger(){
        if(this.state.simi.length===0){
            return (
                <div style={{width:"600px",marginLeft:"200px",lineHeight:"200px",textAlign:"center",fontSize:"18px"}}>
                    暂无数据
                </div>
            )
        }
        return(
            <div
                style={{display:"flex",alignItems:"center",width:"1000px",flexWrap:"wrap",marginLeft:"50px",marginTop:"20px"}}
                className='scroll_container'
            >
                {
                    this.state.simi.map( (item,index) => {
                        return(
                            <LazyLoad height={150} once={true}>
                                <div
                                    style={{width:"150px",height:"150px",padding:"20px 20px",cursor:"pointer"}}
                                    key={ index }
                                    onClick={ this.handleSelectSinger.bind(this,item.id) }
                                >
                                    <img
                                        alt=""
                                        src={createPicURL(item.picUrl,150,150)}
                                        style={{borderRadius:"50%"}}
                                    />
                                    <p style={{fontSize:"12px",textAlign:"center"}}>{item.name}</p>
                                </div>
                            </LazyLoad>
                        )
                    })
                }
            </div>
        )
    }
    listview(){
        switch (this.state.currentIndex) {
            case "0":return this.songList();
            case "1":return this.singerAlbum();
            case "2":return this.singerMV();
            case "3":return this.singerInfo();
            case "4":return this.simiSinger();
            default:return null;
        }

    }
    handleSelectMV(id){
        changeRouteToMV(this.props,id);
    }
    handleSelectSinger(id){
        changeRouteToSinger(this.props,id);
    }
    describe(){
        let des;
        if(this.state.detail.artist.briefDesc === "") {
            des = "暂无简介"
        }
        else if(this.state.detail.artist.briefDesc.length > 200) {
            des = this.state.detail.artist.briefDesc.substring(0,200) + "...";
        }
        else
            des = this.state.detail.artist.briefDesc;
        return des;
    }


    render() {

        return(

            <div className={style.main}>
                {
                    this.state.loading_top?
                        <RotateLoader
                            size={70}
                            css={override1}
                            color={"#123abc"}
                            loading={this.state.loading_top}/>

                        :<div className={style.top}>
                        <div>
                            <LazyLoad height={225}>
                                <img
                                    src={createPicURL(this.state.detail.artist.picUrl,225,225)}
                                    alt=""
                                    style={{borderRadius:"10px"}}
                                />
                            </LazyLoad>

                        </div>
                        <div>
                            <div style={{marginLeft:"20px",width:"700px",height:"225px"}}>
                                <div>
                                    <div style={{width:"45px",height:"30px",backgroundColor:"rgb(198,47,47)",display:"inline-block",textAlign:"center",lineHeight:"30px",borderRadius:"5px",color:"white"}}>歌手</div>
                                    <span style={{fontSize:"25px",fontWeight:"bold",marginLeft:"5px"}}>{this.state.detail.artist.name}</span>
                                </div>
                                <div style={{marginTop:"20px"}}>
                                    <p style={{}}>单曲数:{this.state.detail.artist.musicSize}</p>
                                    <p style={{}}>专辑数:{this.state.detail.artist.albumSize}</p>
                                    <p style={{}}>MV数:{this.state.detail.artist.mvSize}</p>
                                    <p>简介:{this.describe()}</p>
                                </div>

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
                            <Tab label="热门50首" value="0" onClick={this.handleStateChange.bind(this,"0")}/>
                            <Tab label="专辑" value="1" onClick={this.handleStateChange.bind(this,"1")}/>
                            <Tab label="MV" value="2" onClick={this.handleStateChange.bind(this,"2")}/>
                            <Tab label="歌手详情" value="3" onClick={this.handleStateChange.bind(this,"3")}/>
                            <Tab label="相似歌手" value="4" onClick={this.handleStateChange.bind(this,"4")}/>
                        </Tabs>
                    </ThemeProvider>
                </div>
                {
                    this.state.loading?
                        (<CircleLoader
                            size={90}
                            css={override}
                            color={"#123abc"}
                            loading={this.state.loading}
                        />):this.listview.bind(this)()

                }
            </div>
        )
    }
}


export default withRouter(Singer)
