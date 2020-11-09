import React from "react";
import {Route, Switch} from "react-router-dom";
import Recommend from "./Recommend/Recommend"
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Leaderboard from "./LeaderBoard/Leaderboard";
import theme from "../../util/Theme";
import {ThemeProvider} from "@material-ui/styles";
import style from "./style.module.css"
import DiscoverSinger from "./Singer/DiscoverSinger";
import Latest from "./Latest/Latest";

class Discovery extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            currentIndex:"0"
        }
    }

    handleRoute(route,index){
      this.props.history.push("/discovery"+route);
      this.setState({currentIndex:index});
    }


    render() {
        return(
                <div className={style.main}>
                    <div>
                        <ThemeProvider theme={theme}>
                        <Tabs
                            indicatorColor="primary"
                            textColor="secondary"
                            centered
                            value={this.state.currentIndex}
                        >
                            <Tab label="个性推荐" value="0" onClick={this.handleRoute.bind(this,"/recommend","0")} />
                            <Tab label="歌单" value="1" onClick={this.handleRoute.bind(this,"/musicmenu","1")}/>
                            <Tab label="排行榜" value="2" onClick={this.handleRoute.bind(this,"/leaderboard","2")} />
                            <Tab label="歌手" value="3" onClick={this.handleRoute.bind(this,"/singer","3")}/>
                            <Tab label="最新音乐" value="4" onClick={this.handleRoute.bind(this,"/latest","4")}/>
                        </Tabs>
                        </ThemeProvider>
                    </div>
                    <div>
                        <Route>
                            <Switch>
                                <Route exact path="/discovery/recommend" component={Recommend}/>
                                <Route exact path="/discovery/leaderboard" component={Leaderboard}/>
                                <Route exact path="/discovery" component={Recommend}/>
                                <Route exact path="/discovery/singer" component={DiscoverSinger}/>
                                <Route exact path="/discovery/latest" component={Latest}/>
                                <Route path="/" component={Recommend}/>
                            </Switch>
                        </Route>
                    </div>
                </div>


        )
    }
}

export default Discovery
