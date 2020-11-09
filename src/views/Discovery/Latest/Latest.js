import React, {useEffect, useState} from "react";
import { withRouter } from "react-router-dom";
import theme from "../../../util/Theme";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {ThemeProvider} from "@material-ui/styles";
import {topAlbum, topSong} from "../../../api/Main";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {formatSongDuration} from "../../../util/convenience";
import {changeSong, createPicURL} from "../../../util/convenience";

function TopSong() {
    const [cat,setCat] = useState("0");
    const [data,setData] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        getData(cat);
    },[cat]);

    function getData(category) {
        topSong(category).then(function (res) {
            setData(res.data.data);
            setLoading(false);
        })
    }


    function handleRoute(cat) {
        setCat(cat);
        setLoading(true);
    }

    return(
        <div>
            <ThemeProvider theme={theme}>
                <Tabs
                    indicatorColor="secondary"
                    textColor="secondary"
                    value={cat}
                >
                    <Tab label="全部" value="0" onClick={()=>handleRoute("0")}   />
                    <Tab label="华语" value="7" onClick={()=>handleRoute("7")}/>
                    <Tab label="欧美" value="96" onClick={()=>handleRoute("96")}/>
                    <Tab label="韩国" value="16" onClick={()=>handleRoute("16")}/>
                    <Tab label="日本" value="8" onClick={()=>handleRoute("8")}/>
                </Tabs>
            </ThemeProvider>
            <div>
                <TableContainer >
                    <Table style={{width:"70vw"}}>
                        <TableHead>
                            <TableRow>
                                <TableCell>序号</TableCell>
                                <TableCell>封面</TableCell>
                                <TableCell>歌名</TableCell>
                                <TableCell>歌手</TableCell>
                                <TableCell>专辑</TableCell>
                                <TableCell>时长</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                !loading && data.map((item,index) => {

                                    return(
                                        <TableRow key={item.id}
                                                  onDoubleClick={()=>changeSong(item.id)}
                                                  hover={true}
                                        >
                                            <TableCell>
                                                {index < 9 ? "0" + (index + 1) : index + 1}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                                <img src={createPicURL(item.album.picUrl,80,80)} alt="pic" style={{borderRadius:'5px'}}/>
                                            </TableCell>
                                            <TableCell>
                                                <span>{item.name}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span>{item.artists[0].name}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span>{item.album.name}</span>
                                            </TableCell>
                                            <TableCell>
                                                <span>{formatSongDuration(item.duration)}</span>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}

const TopAlbum = withRouter(function (props){

    const [loading,setLoading] = useState(true);
    const [data,setData] = useState([]);
    useEffect(()=>{
        setLoading(true);
        topAlbum().then(function (res) {
            setData(res.data.albums);
            setLoading(false);
        })
    },[])
    function handleSelectAlbum(id) {
        props.history.push({pathname:"/playlist/album/"+id});
    }
    return(
        <div style={{width:"70vw",display:"flex",flexWrap:"wrap"}}>
            {
                !loading && data.map(function (item,index) {
                     return(
                         <div key={index} style={{width:"120px",height:"150px",margin:"20px",cursor:"pointer"}} onClick={()=>handleSelectAlbum(item.id)}>
                             <div>
                                 <img src={createPicURL(item.picUrl,120,120)} style={{borderRadius:"10px"}} alt="pic"/>
                             </div>
                             <div style={{fontSize:"15px"}}>
                                 <p>{item.name}</p>
                                 <p style={{fontSize:"0.9em"}}>{item.artist.name}</p>
                             </div>
                         </div>
                     )
                })
            }
        </div>
    )
})



class Latest extends React.Component{

    constructor(props) {
        super(props);
        this.state={
            selected:"song",
            loading:true,
        }
    }


    listview(){
        switch (this.state.selected) {
            case "song":return <TopSong/>;
            case "album":return <TopAlbum/>;
            default:return null;
        }
    }
    setCat(cat){
         this.setState({
             selected:cat,
             loading:false
         });
    }
    render() {
        return(
            <div>
                <div style={{marginLeft:"40%",marginTop:"20px",marginBottom:"20px"}}>
                    <ThemeProvider theme={theme}>
                        <ButtonGroup >
                            <Button
                                variant={this.state.selected==="song"?"contained":"outlined"}
                                onClick={this.setCat.bind(this,"song")}
                            >
                                新歌速递
                            </Button>
                            <Button
                                variant={this.state.selected==="album"?"contained":"outlined"}
                                onClick={this.setCat.bind(this,"album")}
                            >
                                新碟上架
                            </Button>
                        </ButtonGroup>
                    </ThemeProvider>
                </div>

                <div style={{marginLeft:"10%"}}>
                    {this.listview()}
                </div>

            </div>
        )
    }
}


export default withRouter(Latest);
