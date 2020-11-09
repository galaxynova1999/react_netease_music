import React from "react";
import {withRouter} from "react-router-dom";
import {ThemeProvider} from "@material-ui/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {createMuiTheme} from "@material-ui/core/styles";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {getUserCollectAlbum, getUserCollectSinger, getUserCollectVideo} from "../../api/Collect";
import {
    changeRouteToAlbum,
    changeRouteToMV, changeRouteToSinger,
    changeRouteToVideo,
    createPicURL
} from '../../util/convenience'
const theme = createMuiTheme({
    palette: {
        primary:{
            main:"#c62f2f"
        },
        secondary:{
            main:"#000000"
        }
    },
});
class Collect extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            singer:[],
            album:[],
            video:[],
            currentIndex:"0",
            loading:true
        }
    }

    componentDidMount() {
       this.requestForData();
    }
    requestForData(){
        this.setState({
            loading:true
        });
        getUserCollectAlbum().then( (res) => {
              this.setState({
                  album:res.data.data,
                  loading:false
              });
        });
    }
    handleStateChange(index){
        this.setState({
            loading:true
        });
        switch (index) {
            case "0":{
                this.setState({
                    currentIndex:"0",
                    loading:false
                });
                return;
            }
            case "1":{
                this.setState({
                    currentIndex:"1"
                })
                if(this.state.singer.length === 0){
                    getUserCollectSinger().then( (res) => {
                        this.setState({
                            singer:res.data.data,
                            loading:false
                        });
                    })
                    return;
                }
                this.setState({
                    loading:false
                })
                return;
            }
            case "2":{
                this.setState({
                    currentIndex:"2"
                })
                if(this.state.video.length === 0){
                    getUserCollectVideo().then( (res) => {
                        this.setState({
                            video:res.data.data,
                            loading:false
                        })
                    })
                    return;
                }
                this.setState({
                    loading:false
                });
                return;
            }
            default:return null;
        }
    }
    listview(){
        switch (this.state.currentIndex) {
            case "0":return this.tableForAlbum();
            case "1":return this.tableForSinger();
            case "2":return this.tableForVideo();
            default:return null;
        }
    }
    tableForAlbum(){
        return(
            <>
                <p>收藏的歌单({this.state.album.length})</p>
                <TableContainer >
                    <Table style={{width:"1200px"}}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">序号</TableCell>
                                <TableCell align="left">封面</TableCell>
                                <TableCell align="center">专辑名</TableCell>
                                <TableCell align="center">歌手</TableCell>
                                <TableCell>数量</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.state.album.map((item,index) => {
                                let alias = null;
                                if(item.artists[0].alias.length !== 0){
                                    alias = item.artist.alias[0];
                                }
                                return(
                                    <TableRow key={item.id}
                                              onDoubleClick={() => {changeRouteToAlbum(this.props,item.id)}}
                                              hover={true}
                                    >
                                        <TableCell>
                                            {index < 9 ? "0" + (index + 1) : index + 1}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <img src={item.picUrl+ "?param=60y60"} alt="pic" style={{borderRadius:'5px'}}/>
                                        </TableCell>
                                        <TableCell align="center">
                                            <span>{item.name}</span>
                                        </TableCell>
                                        <TableCell align="center">
                                            <span>{item.artists[0].name}({alias})</span>
                                        </TableCell>
                                        <TableCell>{item.size}首</TableCell>
                                    </TableRow>
                                )
                            })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </>


        )

    }
    tableForVideo(){
        return (
            <>
                <p>收藏的视频({this.state.video.length})</p>
                <div style={{width:"70vw",display:"flex",flexWrap:"wrap"}}>
                    {
                        this.state.video.map( (item,index) => {
                            return(
                                <div
                                    style={{width:"200px",marginTop:"20px",cursor:"pointer"}}
                                    key={index}
                                    onClick={this.handleSelectVideoOrMV.bind(this,item.type,item.vid)}
                                >
                                    <img src={createPicURL(item.coverUrl,180,100)} alt="pic" style={{borderRadius:"10px"}}/>
                                    <p style={{fontSize:"14px",overflowWrap:"break-word"}}>{item.title}</p>
                                    <p style={{fontSize:"12px",overflowWrap:"break-word"}}>{item.type === 0 ? "" : "by "}{item.creator[0].userName}</p>
                                </div>
                            )
                        })
                    }
                </div>
            </>
        )

    }
    tableForSinger(){
        return(
            <>
                <p>收藏的歌手({this.state.singer.length})</p>
                <TableContainer >
                    <Table style={{width:"70vw"}}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">序号</TableCell>
                                <TableCell align="left">图片</TableCell>
                                <TableCell align="center">歌手</TableCell>
                                <TableCell>专辑数</TableCell>
                                <TableCell>MV数</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.singer.map((item,index) => {
                                let pic = null;
                                if (item.picUrl !== null) {
                                    pic = createPicURL(item.picUrl,60,60);
                                } else
                                    pic = createPicURL(item.img1v1Url,60,60);
                                let alias = null;
                                if(item.alias.length !== 0){
                                    alias = item.alias[0];
                                }
                                return(
                                    <TableRow key={item.id}
                                              onDoubleClick={() => {changeRouteToSinger(this.props,item.id)}}
                                              hover={true}
                                    >
                                        <TableCell>
                                            {index < 9 ? "0" + (index + 1) : index + 1}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            <img src={pic} alt="pic" style={{borderRadius:'5px'}}/>
                                        </TableCell>
                                        <TableCell align="center">
                                            <span>{item.name}({alias})</span>
                                        </TableCell>
                                        <TableCell>{item.albumSize}</TableCell>
                                        <TableCell>{item.mvSize}</TableCell>
                                    </TableRow>
                                )
                            })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </>

        )
    }
    handleSelectVideoOrMV(type,id) {
        if(type === 1){
            changeRouteToVideo(this.props,id);
        }//视频
        else {
            changeRouteToMV(this.props,id);
        }

    }


    render() {
        return(
            <div>
                <ThemeProvider theme={theme}>
                    <Tabs
                        indicatorColor="primary"
                        textColor="secondary"
                        value={this.state.currentIndex}
                        centered
                    >
                        <Tab label="专辑" value="0" onClick={this.handleStateChange.bind(this,"0")}/>
                        <Tab label="歌手" value="1" onClick={this.handleStateChange.bind(this,"1")}/>
                        <Tab label="视频" value="2" onClick={this.handleStateChange.bind(this,"2")}/>
                    </Tabs>
                </ThemeProvider>
                <div style={{marginTop:"30px",marginLeft:"150px"}}>
                    {
                        !this.state.loading && this.listview.bind(this)()
                    }
                </div>
            </div>
        )
    }
}


export default withRouter(Collect);
