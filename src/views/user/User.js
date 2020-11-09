import React from "react";
import {withRouter} from "react-router-dom";
import style from "./style.module.css"
import {getUserDetail, getUserPlayList} from "../../api/User";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import {getUserID} from "../../api/Me";
import { changeRouteToPlayList, createPicURL} from "../../util/convenience";


class User extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            loading_top:true,
            loading:true,
            detail:{},
            playlist:[]
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
         if(this.props.match.params.id!==nextProps.match.params.id){
             this.requestForData(nextProps.match.params.id);
         }
    }

    componentDidMount() {
        this.requestForData(this.props.match.params.id);
    }

    requestForData(id){

        this.setState({
            loading:true,
            loading_top:true
        });
        getUserDetail(id).then( (res) => {
             this.setState({
                 detail:res.data,
                 loading_top:false
             });
            getUserPlayList(id).then( (res) => {
                 this.setState({
                     playlist:res.data.playlist,
                     loading:false
                 })
            })
        })
    }



    render() {
       return(
           <div style={{marginLeft:'5vw'}}>
               {
                   !this.state.loading_top && <div className={style.top}>
                       <div>
                           <img
                               src={createPicURL(this.state.detail.profile.avatarUrl,200,200)}
                               alt="pic"
                               style={{borderRadius:"50%"}}
                           />
                       </div>
                       <div style={{height:"200px",marginLeft:"20px"}}>
                           <div className={style.name}>
                               <span style={{fontSize:"20px"}}>{this.state.detail.profile.nickname}</span>
                               {
                                   parseInt(this.props.match.params.id) !== getUserID() ?
                                       <div style={{marginLeft:"50px"}}>
                                       {
                                           this.state.detail.profile.followed ?
                                               <Button variant="outlined">
                                                 取消关注
                                               </Button> :
                                               <Button variant="outlined">
                                                   关注
                                               </Button>
                                       }
                                      </div>:
                                       <div style={{marginLeft:"120px"}}>
                                       <Button variant="outlined" >
                                           编辑个人资料
                                       </Button>
                                       </div>
                               }

                           </div>
                           <Divider style={{marginTop:"10px",marginBottom:"10px"}}/>
                           <div className={style.count}>
                               <div style={{width:"100px"}}>
                                   <span>{this.state.detail.profile.eventCount}</span>
                                   <span>动态</span>
                               </div>
                               <Divider orientation="vertical"/>
                               <div style={{width:"100px"}}>
                                   <span>{this.state.detail.profile.follows}</span>
                                   <span>关注</span>
                               </div>
                               <Divider orientation="vertical"/>
                               <div style={{width:"100px"}}>
                                   <span>{this.state.detail.profile.followeds}</span>
                                   <span>粉丝</span>
                               </div>
                           </div>
                           <div style={{marginTop:"20px"}}>
                               <p>个人简介:{this.state.detail.profile.signature ? "暂无简介" : this.state.detail.profile.signature}</p>
                           </div>
                       </div>
                   </div>
               }
               <div style={{marginTop:"20px",marginBottom:"10px",fontSize:"20px"}}>
                   <p>歌单</p>
                   <Divider/>
               </div>

               {
                   !this.state.loading && <div style={{display:"flex",flexWrap:"wrap",width:"70vw",marginTop:"20px"}} >
                       {
                           this.state.playlist.map( (item,index) => {
                               if(item.userId === parseInt(this.props.match.params.id)) {
                                   return (
                                       <div
                                           style={{fontSize:"15px",marginRight:"20px",width:"180px",marginBottom:"15px",cursor:"pointer" }}
                                           onClick={() => {changeRouteToPlayList(this.props,item.id)}}
                                           key={index}>
                                           <img
                                               src={createPicURL(item.coverImgUrl,150,150)}
                                               alt="pic"
                                               style={{borderRadius:"10px"}}
                                           />
                                           <p>{item.name}</p>
                                           <p style={{fontSize:"0.9em"}}>{item.trackCount}首</p>
                                       </div>
                                   )
                               }
                              return null;
                       })}
                   </div>
               }
               <div style={{marginTop:"20px",marginBottom:"10px",fontSize:"20px"}}>
                   <p>收藏</p>
                   <Divider/>
               </div>
               {
                   !this.state.loading && <div style={{display:"flex",flexWrap:"wrap",width:"70vw",marginTop:"20px"}}>
                       {this.state.playlist.map( (item,index) => {
                           if(item.userId !== parseInt(this.props.match.params.id)) {
                               return (
                                   <div
                                       style={{fontSize:"15px",marginRight:"20px",width:"180px",marginBottom:"15px",cursor:"pointer"}}
                                       onClick={() => {changeRouteToPlayList(this.props,item.id)}}
                                       key={index}>
                                       <img
                                           src={createPicURL(item.coverImgUrl,150,150)}
                                           alt="pic"
                                           style={{borderRadius:"10px"}}
                                       />
                                       <p>{item.name}</p>
                                       <p style={{fontSize:"0.9em"}}>{item.trackCount}首</p>
                                   </div>
                               )
                           }
                           return null;
                       })}
                   </div>
               }
           </div>
       )
   }
}

export default withRouter(User)
