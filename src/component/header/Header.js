import * as React from "react";
import logo from "../../assets/image/logo.png"
import {fade, makeStyles, ThemeProvider} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import style from "./style.module.css"
import InputBase from '@material-ui/core/InputBase';
import loginState from "../../mobx/loginState"
import {addNewSearchHistory, delSearchHistory, getSearchHistory} from "../../api/local/searchHistory"
import {getHotSearch, searchSuggest} from "../../api/Search"
import SearchIcon from '@material-ui/icons/Search';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ArrowBackSharpIcon from '@material-ui/icons/ArrowBackSharp';
import ArrowForwardSharpIcon from '@material-ui/icons/ArrowForwardSharp';
import {Divider, Popover} from "@material-ui/core";
import {withRouter} from "react-router-dom";
import Button from "@material-ui/core/Button";
import Login from "../login";
import {getAvatar, getNickName, getUserID} from "../../api/Me"
import {observer} from "mobx-react";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import {LogOut} from "../../api/Login"
import {createError, createInfo} from "../notification/Notification";
import theme from "../../util/Theme";
import debounce from 'lodash/debounce'
import Chip from "@material-ui/core/Chip";
import {
    changeRouteToAlbum, changeRouteToMV, changeRouteToPlayList,
    changeRouteToSinger,
    changeRouteToUser,
    changeSong,
    createPicURL
} from "../../util/convenience";
import {useState} from "react";

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 20,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width:"300px"
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: "250px",
    },
}));




export default withRouter(observer(function BasicHeader(props){

    const classes = useStyles();
    const [popover, setPopover] = useState(false);
    const [hotSearch, setHotSearch] = useState([]);
    const [history,setHistory] = useState(getSearchHistory());
    const [login,setLogin] = useState(false);
    const [logout,setLogout] = useState(false);
    const [profile,setProfile] = useState(false);
    const [keyword,setKeyword] = useState("");
    const [suggest,setSuggest] = useState({});



    function handleForward() {
        props.history.goForward();
    }
    function handleBack(){
        props.history.goBack();
    }

    function handleClick() {
        getHotSearch().then(function (res) {
            setHotSearch(res.data.data);
            setPopover(true);
        })
    }
    function handleOpenProfile() {
        changeRouteToUser(props,getUserID());
    }

    function handleKeyDown(e) {
        let keyCode = 0;

        if(e.which)
            keyCode = e.which;

        else if(e.keyCode)
            keyCode = e.keyCode;

        if(keyCode === 13) {
            addNewSearchHistory(keyword);
            setHistory(getSearchHistory());
            setPopover(false);
            props.history.push({pathname:"/search/"+keyword});
        }

    }
    function hotSearchContent() {

        return hotSearch.map(function (item,index) {
            let left;
            if(index < 3)
                left = <div style={{float:"left",color:"rgb(255,58,58)",height:"75px",textAlign:"center",fontSize:"18px",marginTop:"15px",marginLeft:"10px"}}>
                           {index + 1}
                       </div>
            else {
                left = <div style={{float:"left",height:"75px",textAlign:"center",fontSize:"18px",marginTop:"15px",marginLeft:"10px"}}>
                           {index + 1}
                       </div>
            }

            return(
                <div
                    key={index}
                    style={{width:"100%",height:"75px"}}
                    className={style.item}
                    onClick={() => handleSearchOK(item.searchWord)}
                >
                    {left}
                    <div style={{float:"left",height:"70px",marginLeft:"10px"}}>
                        <span style={{fontSize:"19px"}}>{item.searchWord}</span>
                        <span style={{fontSize:"13px",marginLeft:"10px"}}>{item.score}</span>
                        <br/>
                        <p style={{marginTop:"8px",fontSize:"13px"}}>{item.content}</p>
                    </div>

                </div>
            )
        })

    }
    function deleteHistory(item) {
        let array = delSearchHistory(item);
        setHistory(array);
    }

    function searchHistory() {
        if(history.length === 0){
            return(
                <div style={{width:"100%",height:"5vw",display:"flex",alignItems:"center"}}>
                    <p style={{marginLeft:"180px"}}>暂无搜索记录</p>
                </div>
            )
        }
        else{
            return history.map(function (item,index) {
                return(
                    <Chip
                        variant="outlined"
                        onDelete={() => deleteHistory(item)}
                        onClick={() => handleSearchOK(item)}
                        label={item}
                        style={{margin:"5px 5px"}}
                        key={index}
                    />
                )
            })
        }
    }
    function handleSearchOK(keyword) {
        setPopover(false);
        props.history.push("/search/"+keyword);
    }
    function handleInputChange(event) {
        setKeyword(event.target.value);
        getSuggests();
    }
    const getSuggests = debounce(()=> {
        if(!keyword){
            return;
        }
       searchSuggest(keyword).then(function (res) {
             setSuggest(res.data.result);
       })
    },1500)

    function doLogout() {
      LogOut().then(() => {
          setLogout(false);
          createInfo("退出成功");
      }).catch((err) => {
          createError(err);
      })

    }
    async function handleChooseSuggestion(id,type) {
     switch (type) {
         case "song":{
             changeSong(id);
             setPopover(false);
             break;
         }
         case "album":{
             changeRouteToAlbum(props,id);
             setPopover(false);
             break;
         }
         case "artist":{
             changeRouteToSinger(props,id);
             setPopover(false);
             break;
         }
         case "mv":{
             changeRouteToMV(props,id);
             setPopover(false);
             break;
         }
         case "playlist":{
             changeRouteToPlayList(props,id);
             setPopover(false);
             break;
         }
         default:return
     }
    }
    function SearchSuggest() {
      let { songs,albums,artists,playlists,mvs } = suggest;

      return(
          <div>
              {
                  songs &&
                      <>
                      <div style={{backgroundColor:"rgb(245,245,247)",height:"30px",lineHeight:"30px"}}>
                          <p style={{marginLeft:"10px",marginBottom:"5px"}}>单曲</p>
                      </div>
                  <div>
                  {
                      songs.map(function (item,index) {
                          return(
                              <div
                                  key={index}
                                  className={style.suggest}
                                  onClick={()=>handleChooseSuggestion(item.id,"song")}
                              >
                                  {item.name} - {item.artists[0].name}
                              </div>
                          )
                      })
                  }
                  </div>
                  </>
              }

              {
                  albums && <>
                      <div style={{backgroundColor:"rgb(245,245,247)",height:"30px",lineHeight:"30px"}}>
                          <p style={{marginLeft:"10px",marginBottom:"5px"}}>专辑</p>
                      </div>
                  <div>
                  {
                      albums.map(function (item,index) {
                          return(
                              <div
                                  key={index}
                                  className={style.suggest}
                                  onClick={()=>handleChooseSuggestion(item.id,"album")}
                              >
                                  {item.name} - {item.artist.name}
                              </div>
                          )
                      })
                  }
                  </div>
                  </>
              }

              {
                  artists && <>
                      <div style={{backgroundColor:"rgb(245,245,247)",height:"30px",lineHeight:"30px"}}>
                          <p style={{marginLeft:"10px",marginBottom:"5px"}}>歌手</p>
                      </div>
                  <div>
                  {
                      artists.map(function (item,index) {
                          return(
                              <div
                                  key={index}
                                  className={style.suggest}
                                  onClick={()=>handleChooseSuggestion(item.id,"artist")}
                              >
                                  {item.name}
                              </div>
                          )
                      })
                  }
                  </div>
                  </>
              }

              {
                  mvs &&
                  <>
                      <div style={{backgroundColor:"rgb(245,245,247)",height:"30px",lineHeight:"30px"}}>
                          <p style={{marginLeft:"10px",marginBottom:"5px"}}>视频</p>
                      </div>
                      <div>
                  {
                      mvs.map(function (item,index) {
                          return(
                              <div
                                  key={index}
                                  className={style.suggest}
                                  onClick={() => handleChooseSuggestion(item.id,"mv")}
                              >
                                  {item.name} - {item.artistName}
                              </div>
                          )
                      })
                  }
                      </div>
                  </>
              }


              {
                  playlists &&
                      <>
                      <div style={{backgroundColor:"rgb(245,245,247)",height:"30px",lineHeight:"30px"}}>
                          <p style={{marginLeft:"10px",marginBottom:"5px"}}>歌单</p>
                      </div>
                  <div>
                  {
                      playlists.map(function (item,index) {
                          return(
                              <div
                                  key={index}
                                  className={style.suggest}
                                  onClick={()=>handleChooseSuggestion(item.id,"playlist")}
                              >
                                  {item.name}
                              </div>
                          )
                      })
                  }
                  </div>
                  </>
              }

          </div>
      )
    }

    return (
        <ThemeProvider theme={theme}>
            <div className={classes.grow}>
                <AppBar color="primary">
                    <Toolbar>
                        <img src={logo} style={{maxWidth:"120px"}}  alt="logo"/>
                        <IconButton  color="inherit" style={{marginLeft:"20px"}} onClick={() => handleBack() }>
                            <ArrowBackSharpIcon/>
                        </IconButton>
                        <IconButton  color="inherit" onClick={handleForward}>
                            <ArrowForwardSharpIcon/>
                        </IconButton>
                        <div className={classes.search}>
                            <Popover
                                open={popover}
                                onClose={() => {
                                    setPopover(false)
                                }}
                                anchorEl={document.getElementById("search")}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                disableAutoFocus={true}
                                disableEnforceFocus={true}
                            >
                                {
                                    keyword.length === 0 ?
                                        <div
                                            style={{width:"30vw",height:"550px",overflowY:"scroll",overflowX:"hidden"}}
                                            className={style.popover}
                                        >
                                           <p style={{marginTop:"10px",marginLeft:"10px",marginBottom:"5px"}}>搜索历史</p>
                                           <Divider/>
                                        <div style={{display:"flex",flexWrap:"wrap",width:"25vw"}}>
                                            {searchHistory()}
                                        </div>
                                           <Divider/>
                                        <p style={{marginTop:"10px",marginLeft:"10px",marginBottom:"5px"}}>热门搜索</p>
                                        <div style={{width:"30vw",display:"flex",flexDirection:"column"}}>
                                            {hotSearchContent()}
                                        </div>
                                    </div>
                                        :
                                        <div
                                            style={{width:"30vw",overflowY:"scroll",overflowX:"hidden",fontSize:"15px"}}
                                            className={style.popover}
                                        >
                                        <p
                                            style={{marginTop:"10px",marginLeft:"10px",marginBottom:"5px"}}
                                        >
                                            搜索"{<span style={{color:"rgb(12,115,194)"}}>{keyword}</span>}"相关的结果>
                                        </p>
                                        <Divider/>
                                        {SearchSuggest()}
                                    </div>
                                }
                            </Popover>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>

                            <InputBase
                                id="search"
                                value={keyword}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyDown}
                                placeholder="搜索音乐，视频，歌词，电台"
                                onClick={handleClick}
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                            />

                        </div>
                        <div className={classes.grow} />
                        {
                            loginState.isLogin ?
                                (
                                    <div style={{display:"flex",alignItems:"center"}}>
                                    <img
                                        src={createPicURL(getAvatar(),50,50)}
                                        style={{borderRadius:"50%",cursor:"pointer"}}
                                        alt="pic"
                                        id="meavatar"
                                        onClick={() => handleOpenProfile()}
                                    />
                                      <span style={{marginLeft:"10px"}}>{getNickName()}</span>
                                      <IconButton  color="inherit">
                                          <NotificationsIcon />
                                       </IconButton>
                                        <Button
                                            variant="outlined"
                                            style={{color:"white"}}
                                            startIcon={<ExitToAppIcon/>}
                                            onClick={() => {
                                                setLogout(true)
                                            }}
                                        >
                                            登出
                                        </Button>
                                        <Dialog
                                            open={logout}
                                        >
                                            <DialogTitle>{"退出登录"}</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText id="alert-dialog-description">
                                                   确定要退出登录吗？这将清空当前用户数据
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={() => {
                                                    setLogout(false)
                                                }} color="primary">
                                                    取消
                                                </Button>
                                                <Button onClick={doLogout} color="primary" autoFocus>
                                                    确定
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                        <Popover
                                            open={profile}
                                            onClose={() => {
                                                setProfile(false)
                                            }}
                                            anchorEl={document.getElementById("meavatar")}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                            disableEnforceFocus={true}
                                        >
                                            <div style={{height:"300px",width:"150px"}}>
                                                <div>

                                                </div>
                                            </div>
                                        </Popover>
                                    </div>
                                )
                                :
                                (
                                    <div>
                                       <Button  onClick={() => {
                                           setLogin(true);
                                       }} style={{color:"white"}}>
                                          登录
                                       </Button>
                                       <Login open={login} close={() => {
                                           setLogin(false)
                                       }}/>
                                    </div>
                                )
                        }
                    </Toolbar>
                </AppBar>
            </div>
        </ThemeProvider>
    );

}))
