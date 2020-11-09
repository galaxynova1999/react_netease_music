import React from "react";
import {getLeaderBoard} from "../../../api/Main";
import {createError} from "../../../component/notification/Notification";
import {withRouter} from "react-router-dom";
import {changeRouteToPlayList, createPicURL} from "../../../util/convenience";
import LazyLoad from 'react-lazyload';

class Leaderboard extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            boards:[]
        }
    }
    componentDidMount() {
        getLeaderBoard().then( (res) => {
           this.setState({
               boards:res.data.list
           })
       }).catch(function (result) {
          createError(result)
        })
    }


    render() {

        const LeaderBoardData = this.state.boards.map( (item,index) => {
            return(
                <div
                    style={{float:"left",marginLeft:"30px",paddingTop:"10px",cursor:"pointer"}}
                    key={index}
                    onClick={() => {changeRouteToPlayList(this.props,item.id)}}
                >
                    <LazyLoad height={150}>
                        <img
                            src={createPicURL(item.coverImgUrl,150,150)}
                            alt="leaderboard"
                            style={{borderRadius:'10px'}}
                        />
                    </LazyLoad>
                    <p style={{fontSize:"14px"}}>{item.name}</p>
                </div>
            )

        })
        return(
            <div >
                <p style={{fontSize:"30px",marginLeft:"230px",marginBottom:"0"}}>全球榜</p>
                <div style={{overflow:"hidden",width:"1100px",margin:"0 auto",borderTop:"1px solid grey"}}>
                    {LeaderBoardData}
                </div>
            </div>

        )
    }

}

export default withRouter(Leaderboard)
