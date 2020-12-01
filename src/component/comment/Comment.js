import React from "react";
import style from "./style.module.css";
import moment from "moment";
import "moment/locale/zh-cn";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import { likeComment } from "../../api/Comment";

import {
  createError,
  createInfo,
  createSuccess,
} from "../notification/Notification";
import { changeRouteToUser, checkLogin } from "../../util/convenience";
import { styled } from "@material-ui/styles";
import { IconButton } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import LazyLoad from "react-lazyload";
moment.locale("zh-cn");

const LikedButton = styled(IconButton)({
  color: "#c62f2f",
});
const UnLikedButton = styled(IconButton)({
  color: "rgb(124,124,124)",
});
class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      liked: this.props.data.liked,
      count: this.props.data.likedCount,
    };
  }

  handleLikeComment() {
    if (!checkLogin()) return;
    if (!this.state.liked) {
      likeComment(this.props.id, this.props.data.commentId, 1, this.props.type)
        .then((res) => {
          this.setState(
            {
              liked: true,
              count: this.state.count + 1,
            },
            () => {
              createSuccess("点赞收到!");
            }
          );
        })
        .catch(function (err) {
          createError(err);
        });
    } //取消点赞
    else {
      likeComment(this.props.id, this.props.data.commentId, 0, this.props.type)
        .then((res) => {
          this.setState(
            {
              liked: false,
              count: this.state.count - 1,
            },
            () => {
              createInfo("已经取消点赞啦");
            }
          );
        })
        .catch(function (err) {
          createError(err);
        });
    }
  }

  handleSelectUser() {
    changeRouteToUser(this.props, this.props.data.user.userId);
  }

  render() {
    return (
      <div className={style.main} style={this.props.style}>
        <div className={style.avatar}>
          <img
            style={{ borderRadius: "50%", maxWidth: "40px", cursor: "pointer" }}
            alt=""
            src={this.props.data.user.avatarUrl + "?param=50y50"}
            onClick={this.handleSelectUser.bind(this)}
          />
        </div>
        <div className={style.right} style={{ fontSize: "15px" }}>
          <div style={{ width: "100%" }}>
            <span
              style={{ color: "rgb(12,115,194)", cursor: "pointer" }}
              onClick={this.handleSelectUser.bind(this)}
            >
              {this.props.data.user.nickname}:
            </span>
            <span>{this.props.data.content}</span>
          </div>
          <div>
            <span style={{ fontSize: "0.9em" }}>
              {moment(this.props.data.time).fromNow()}
            </span>
            {this.state.liked ? (
              <LikedButton onClick={this.handleLikeComment.bind(this)}>
                <ThumbUpIcon style={{ fontSize: "14px" }} />
                <span style={{ fontSize: "14px" }}> ({this.state.count}) </span>
              </LikedButton>
            ) : (
              <UnLikedButton onClick={this.handleLikeComment.bind(this)}>
                <ThumbUpIcon style={{ fontSize: "14px" }} />
                <span style={{ fontSize: "14px" }}> ({this.state.count}) </span>
              </UnLikedButton>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Comment);
