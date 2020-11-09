import React from "react";
import {Search} from "../../api/Search"
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import {formatSongDuration} from "../../util/convenience"
import TableBody from "@material-ui/core/TableBody";
import {withRouter} from "react-router-dom";
import {observer} from "mobx-react";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import {createMuiTheme} from "@material-ui/core/styles";
import {ThemeProvider} from "@material-ui/styles";
import {css} from "@emotion/core";
import {
    changeRouteToAlbum,
    changeRouteToMV,
    changeRouteToPlayList,
    changeRouteToSinger,
    changeRouteToUser,
    changeRouteToVideo,
    changeSong,
    createPicURL
} from "../../util/convenience";
import {MoonLoader} from "react-spinners";
import LazyLoad from 'react-lazyload';

const override = css`
  display: block;
  margin-left:500px;
  margin-top:300px
`;

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

@observer
class SearchResult extends React.Component{
    constructor(props) {
        super(props);
        this.state= {
            currentIndex:0,
            keywords:"",
            table1: [],
            table2:[],
            table3:[],
            table4:[],
            table5:[],
            table6:[],
            count:"",
            des:"",
            loading:true
        }

    }

    componentDidMount() {
        this.searchSingleSong();
        this.setState({
            keywords:this.props.match.params.content
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if(this.props.match.params.content !== nextProps.match.params.content) {
            Search(nextProps.match.params.content,1,30).then( (res) => {
                this.setState(
                    {
                        keywords:nextProps.match.params.content,
                        table1:res.data.result.songs,
                        count:res.data.result.songCount,
                        currentIndex:0,
                        table2:[],
                        table3:[],
                        table4:[],
                        table5:[],
                        table6:[],
                        des:"首单曲"
                    }
                );
            })

        }
    }

    handleSelectVideoOrMV(type,id){
        if(type === 1) {
           changeRouteToVideo(this.props,id);
        }
        else {
            changeRouteToMV(this.props,id);
        }

    }


    searchSingleSong(){
        console.log("1");
        Search(this.props.match.params.content,1,30).then( (res) => {
            console.log(res);
            this.setState({
                table1:res.data.result.songs,
                count:res.data.result.songCount,
                des:"首单曲",
                loading:false
            });
        })

    }
    async searchSinger(){
        return await Search(this.props.match.params.content, 100, 30);
    }
    async searchAlbum(){
        return await Search(this.props.match.params.content,10,30);
    }
    async searchPlayList(){
        return await Search(this.props.match.params.content,1000,30);
    }
    async searchVideo(){
        return await Search(this.props.match.params.content,1014,50);
    }
    async searchUser(){
        return await Search(this.props.match.params.content,1002,30)
    }

    tableForSingleSong(){
        return (
            <TableContainer >
                <Table style={{width:"70vw"}}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">序号</TableCell>
                            <TableCell align="left">音乐标题</TableCell>
                            <TableCell align="center">歌手</TableCell>
                            <TableCell align="right">专辑</TableCell>
                            <TableCell align="right">时长</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            this.state.table1.map((row,index) => (
                            <TableRow key={row.id} onDoubleClick={() => {changeSong(row.id)}} hover={true} >
                                <TableCell>
                                    {index < 9 ? "0" + (index + 1) : index + 1}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell align="center">{
                                    row.artists.length > 1 ? row.artists[0].name +"/" +row.artists[1].name : row.artists[0].name
                                }</TableCell>
                                <TableCell align="right">{row.album.name}</TableCell>
                                <TableCell align="right">{formatSongDuration(row.duration)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )

    }
    tableForSinger(){
            return(
                <TableContainer >
                    <Table style={{width:"70vw"}}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">序号</TableCell>
                                <TableCell align="left">图片</TableCell>
                                <TableCell align="center">歌手</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.state.table2.map((item,index) => {
                                let pic = null;
                                if (item.picUrl !== null) {
                                    pic = createPicURL(item.picUrl,50,50);
                                } else {
                                    pic = createPicURL(item.img1v1Url,50,50);
                                }
                                let alias = null;
                                if(item.alias.length !== 0){
                                    alias = item.alias[0];
                                }
                              return(
                                  <TableRow key={item.id}
                                            onDoubleClick={() => {changeRouteToSinger(this.props,item.id)}}
                                            hover={true}>
                                      <TableCell>
                                          {index < 9 ? "0" + (index + 1) : index + 1}
                                      </TableCell>
                                      <TableCell component="th" scope="row">
                                          <img src={pic} alt="pic" style={{borderRadius:'5px'}}/>
                                      </TableCell>
                                      <TableCell align="center">
                                          <span>
                                              {item.name}{alias}</span>
                                      </TableCell>
                                  </TableRow>
                              )
                            })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            )
    }
    tableForAlbum(){
        return(
            <TableContainer >
                <Table style={{width:"70vw"}}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">序号</TableCell>
                            <TableCell align="left">封面</TableCell>
                            <TableCell align="center">专辑名</TableCell>
                            <TableCell align="center">歌手</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.table3.map((item,index) => {
                            let pic = null;
                            if (item.picUrl !== null) {
                                pic = createPicURL(item.picUrl,50,50);
                            } else {
                                pic = createPicURL(item.blurPicUrl,50,50)
                            }
                            let alias = null;
                            if(item.artist.alias.length !== 0){
                                alias = item.artist.alias[0];
                            }
                            return(
                                <TableRow key={item.id} onDoubleClick={() => {changeRouteToAlbum(this.props,item.id)}}
                                          hover={true}>
                                    <TableCell>
                                        {index < 9 ? "0" + (index + 1) : index + 1}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <img src={pic} alt="pic" style={{borderRadius:'5px'}}/>
                                    </TableCell>
                                    <TableCell align="center">
                                        <span>{item.name}</span>
                                    </TableCell>
                                    <TableCell align="center">
                                        <span>{item.artist.name}{alias}</span>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                        }
                    </TableBody>
                </Table>
            </TableContainer>

        )

    }
    tableForVideo(){
        if(this.state.table4.length === 0){
            return(
                <div style={{width:"70vw",height:"200px",textAlign:"center",lineHeight:"200px"}}>
                抱歉,暂无数据
                </div>
            )
        }
        return (
            <div style={{width:"70vw",display:"flex",flexWrap:"wrap"}}>
                {
                    this.state.table4.map( (item,index) => {
                        return(
                            <LazyLoad height={250} once={true}>
                                <div
                                    style={{width:"200px",marginTop:"20px",cursor:"pointer"}}
                                    key={index}
                                    onClick={this.handleSelectVideoOrMV.bind(this,item.type,item.vid)}
                                >
                                    <img src={createPicURL(item.coverUrl,180,160)} alt="" style={{borderRadius:"10px"}}/>
                                    <p style={{fontSize:"14px",overflowWrap:"break-word"}}>{item.title}</p>
                                    <p style={{fontSize:"12px",overflowWrap:"break-word"}}>
                                        {item.type === 0 ? "" : "by "}{item.creator[0].userName}
                                    </p>
                                </div>
                            </LazyLoad>
                        )
                    })
                }
            </div>
        )

    }
    tableForPlayList(){
        return(
            <TableContainer >
                <Table style={{width:"70vw"}}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">序号</TableCell>
                            <TableCell align="left">封面</TableCell>
                            <TableCell align="center">名称</TableCell>
                            <TableCell align="right">歌曲数量</TableCell>
                            <TableCell align="right">创作者</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.table5.map((item,index) => (

                            <TableRow key={item.id} hover={true} onDoubleClick={() => {changeRouteToPlayList(this.props,item.id)}} >
                                <TableCell align = "left">
                                    {index < 9 ? "0" + (index + 1) : index + 1}
                                </TableCell>
                                <TableCell component="th" scope="row" align="left">
                                    <img src={createPicURL(item.coverImgUrl,50,50)} alt="pic" style={{borderRadius:'5px'}}/>
                                </TableCell>
                                <TableCell align="center">
                                    {item.name}
                                </TableCell>
                                <TableCell align="right">{item.trackCount}首</TableCell>
                                <TableCell align="right">{item.creator.nickname}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }
    tableForUser(){
        return(
            <TableContainer >
                <Table style={{width:"70vw"}}>
                    <TableHead>
                        <TableRow>
                            <TableCell >序号</TableCell>
                            <TableCell >头像</TableCell>
                            <TableCell >名称</TableCell>
                            <TableCell>座右铭</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            this.state.table6.map((item,index) => {
                            return(
                                <TableRow key={item.userId}
                                          onDoubleClick={() => {changeRouteToUser(this.props,item.userId)}}
                                          hover={true}
                                >
                                    <TableCell>
                                        {index < 9 ? "0" + (index + 1) : index + 1}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        <img src={createPicURL(item.avatarUrl,60,60)} alt="pic" style={{borderRadius:'5px'}}/>
                                    </TableCell>
                                    <TableCell>
                                        <span>{item.nickname}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span>{item.signature}</span>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    async handleStateChange(index){
        this.setState({
            loading:true
        });

        /*if(this.state[`table${index}`].length !== 0) {
            this.setState({
                currentIndex:index,
                loading:false
            });
            return ;
        }*/
        switch (index) {
            case "1":{
                await this.searchSingleSong();
                this.setState({
                    currentIndex:index - 1,
                });
                break;
            }
            case "2":{

                let res = await this.searchSinger();
                this.setState({
                    table2:res.data.result.artists,
                    count:res.data.result.artistCount,
                    currentIndex:index - 1,
                    loading:false,
                    des:"位歌手"
                });
                break;
            }
            case "3":{

                let res = await this.searchAlbum();
                this.state.table3 = res.data.result.albums;
                this.state.count = res.data.result.albumCount;
                this.state.des = "张专辑"
                this.setState({
                    table3 : res.data.result.albums,
                    count : res.data.result.albumCount,
                    des : "张专辑",
                    currentIndex:index - 1,
                    loading:false
                });
                break;
            }
            case "4":{
                let res = await this.searchVideo();
                if(res.data.result.videos){
                    this.state.table4 = res.data.result.videos;
                    this.state.count = res.data.result.videoCount;
                }
                else {
                    this.state.table4 = [];
                    this.state.count = 0;
                }
                this.setState({
                    des:"个视频",
                    currentIndex:index - 1,
                    loading:false
                });
                break;
            }
            case "5":{
                let res = await this.searchPlayList();
                this.setState({
                    des:"份歌单",
                    table5 : res.data.result.playlists,
                    count : res.data.result.playlistCount,
                    currentIndex:index - 1,
                    loading:false
                });
                break;
            }
            case "6":{
                let res = await this.searchUser();
                this.setState({
                    des:'个用户',
                    table6 : res.data.result.userprofiles,
                    count : res.data.result.userprofileCount,
                    currentIndex:index - 1,
                    loading:false
                });
                return ;
            }
            default:return null;
        }

    }
    searchResult(){
        switch (this.state.currentIndex) {
            case 0:return this.tableForSingleSong()
            case 1:{
                return this.tableForSinger();
            }
            case 2:{return this.tableForAlbum()}
            case 3:{return this.tableForVideo()}
            case 4:{return this.tableForPlayList()}
            case 5:{return this.tableForUser()}
            default:return null;
        }
    }


    render() {
        return(
            <div style={{marginLeft:"80px",marginTop:"30px"}}>
                    <span style={{fontSize:"30px",fontWeight:"bold"}}>{this.props.match.params.content}</span>
                    <span style={{fontSize:"15px",marginLeft:"20px"}}>{"共找到"+this.state.count+this.state.des}</span>
                <ThemeProvider theme={theme}>
                    <Tabs
                        indicatorColor="primary"
                        textColor="secondary"
                        value={this.state.currentIndex}
                    >
                        <Tab label="单曲" value={0} onClick={this.handleStateChange.bind(this,"1")}/>
                        <Tab label="歌手" value={1} onClick={this.handleStateChange.bind(this,"2")}/>
                        <Tab label="专辑" value={2} onClick={this.handleStateChange.bind(this,"3")}/>
                        <Tab label="视频" value={3} onClick={this.handleStateChange.bind(this,"4")}/>
                        <Tab label="歌单" value={4} onClick={this.handleStateChange.bind(this,"5")}/>
                        <Tab label="用户" value={5} onClick={this.handleStateChange.bind(this,"6")}/>
                    </Tabs>
                </ThemeProvider>
                {this.state.loading?
                    (<MoonLoader
                        size={50}
                        css={override}
                        color={"#123abc"}
                        loading={this.state.loading}
                    />): this.searchResult.bind(this)()}
            </div>
        )
    }



}

export default withRouter(SearchResult)

