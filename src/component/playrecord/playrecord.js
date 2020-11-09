import React, {useState} from "react";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {ThemeProvider} from "@material-ui/styles";
import style from "./style.module.css"
import {getUserPlayList} from "../../api/local/userPlayRecord";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {formatSongDuration} from "../../util/convenience";
import {getPlayRecord} from "../../api/local/localPlayRecord";
import theme from "../../util/Theme";
import {changeSong} from "../../util/convenience";
function UserPlayRecordAndPlayHistory() {

    const [currentIndex,setCurrentIndex] = useState("0")
    function handleStateChange(state) {
      setCurrentIndex(state);
    }

    function listView() {
     switch (currentIndex) {
         case "0":return playList();
         case "1":return playHistory();
         default:return null;
     }
    }

    function handleSelect(id) {
      changeSong(id);
    }

    function playList() {

        let user_list = getUserPlayList() || [];
        if(user_list.length === 0){
            return (
                <div className={style.no_list}>
                    暂无播放列表
                </div>
            )
        }
        else {
            return (
                <TableContainer >
                    <Table style={{width:"500px"}} size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>序号</TableCell>
                                <TableCell>音乐标题</TableCell>
                                <TableCell>歌手</TableCell>
                                <TableCell>时长</TableCell>
                                <TableCell>播放次数</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                user_list.map((row,index) => (
                                <TableRow key={row.song.id} onDoubleClick={()=>handleSelect(row.song.id)} hover={true}  >
                                    <TableCell>
                                        {index<9?"0"+(index+1):index+1}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.song.name}
                                    </TableCell>
                                    <TableCell align="right">
                                        {
                                            row.song.ar.length > 1 ? row.song.ar[0].name +"/"  + row.song.ar[1].name : row.song.ar[0].name
                                        }
                                    </TableCell>
                                    <TableCell>{formatSongDuration(row.song.dt)}</TableCell>
                                    <TableCell>{row.playCount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )
        }
    }
    function playHistory() {
        let user_hs = getPlayRecord();
        if(user_hs === null) {
            return (
            <div className={style.no_list}>
                暂无播放历史
            </div>
            )
        }
        else {
            return (
                <TableContainer>
                    <Table style={{width: "500px"}} size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>序号</TableCell>
                                <TableCell>音乐标题</TableCell>
                                <TableCell>添加时间</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                user_hs.map((row, index) => (
                                <TableRow
                                    key={index}
                                    onDoubleClick={() => handleSelect(row.id)}
                                    hover={true}
                                >
                                    <TableCell>
                                        {index < 9 ? "0" + (index + 1) : index + 1}
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell>{row.time}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )
        }

    }

    return (
       <div className={style.main}>
           <ThemeProvider theme={theme}>
               <Tabs
                   indicatorColor="primary"
                   textColor="secondary"
                   value={currentIndex}
                   centered
               >
                   <Tab label="播放列表" value="0" onClick={()=>handleStateChange("0")}/>
                   <Tab label="播放历史" value="1" onClick={()=>handleStateChange("1")}/>
               </Tabs>
           </ThemeProvider>
           {listView()}
       </div>
   )
}


export default UserPlayRecordAndPlayHistory
