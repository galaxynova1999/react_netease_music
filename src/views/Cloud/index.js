import React, {useEffect, useState} from "react";
import {bytesToSize} from "../../util/convenience"
import withStyles from "@material-ui/core/styles/withStyles";
import LinearProgress from "@material-ui/core/LinearProgress";
import {getMeCloud} from "../../api/Me";
import Divider from "@material-ui/core/Divider";
import PlayCircleFilledSharpIcon from "@material-ui/icons/PlayCircleFilledSharp";
import Button from "@material-ui/core/Button";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import * as moment from "moment";

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: 10,
        borderRadius: 5,
    },
    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
        borderRadius: 5,
        backgroundColor: '#1a90ff',
    },
}))(LinearProgress);
const PlayAllButton = withStyles({
    root: {
        backgroundColor: '#c62f2f',
        color:"white"
    },
})(Button);
function Cloud() {

    const [data,setData] = useState({});
    const [progress,setProgress] = useState(0);
    useEffect(() => {
        getMeCloud().then(function (res) {
               setData(res.data);
               setProgress(res.data.size/res.data.maxSize < 0.05 ?
                   (res.data.size / res.data.maxSize) * 100 + 10 : (res.data.size / res.data.maxSize) * 100
               )
        })
    },[])

    return(
        <div style={{width:"100%",paddingLeft:"3vw",marginTop:"40px"}}>
            <div style={{fontSize:"20px",marginBottom:"20px"}}>
                <span>我的音乐云盘</span>
                <span style={{fontSize:"0.8em",marginLeft:"20px"}}>云盘容量</span>
                <BorderLinearProgress variant="determinate" value={progress} style={{width:"200px",display:"inline-block"}}/>
                <span style={{fontSize:"0.8em"}}>{bytesToSize(data.size)}/{bytesToSize(data.maxSize)}</span>
                <span style={{fontSize:"0.8em",marginLeft:"20px"}}>歌曲永久保存，随时随地多端畅听</span>
            </div>
            <Divider/>
            <div style={{display:"flex",alignItems:"center",height:"80px"}}>
                <PlayAllButton
                    variant="contained"
                    startIcon={<PlayCircleFilledSharpIcon />}
                >
                    播放全部
                </PlayAllButton>
                <Button variant="outlined" startIcon={ <AddCircleOutlineIcon/>} style={{marginLeft:"20px"}}>
                    上传音乐
                </Button>
            </div>
            <Divider/>
            <div>
                <TableContainer >
                    <Table style={{width:"95%"}}>
                        <TableHead>
                            <TableRow>
                                <TableCell>序号</TableCell>
                                <TableCell>音乐标题</TableCell>
                                <TableCell>歌手</TableCell>
                                <TableCell>专辑</TableCell>
                                <TableCell>大小</TableCell>
                                <TableCell>上传时间</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { data.data && data.data.map((row,index) => (

                                <TableRow key={index}  hover={true} >
                                    <TableCell>
                                        {index<9?"0"+(index+1):index+1}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.songName}
                                    </TableCell>
                                    <TableCell  >
                                        {row.artist}
                                    </TableCell>
                                    <TableCell >{row.album}</TableCell>
                                    <TableCell>{bytesToSize(row.fileSize)}</TableCell>
                                    <TableCell>{moment(row.addTime).format("YYYY-MM-DD")}</TableCell>
                                </TableRow>
                            ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}


export default Cloud
