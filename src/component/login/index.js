import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { withRouter } from "react-router-dom";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import { LoginByPhone, getUserRecentWeekPlayRecord } from "../../api/Login";
import { getUserPlayList } from "../../api/User";
import { setCookie } from "../../api/local/Cookie";
import { getUserID, setUserDetail } from "../../api/Me";
import userPlayList from "../../mobx/userPlayListState";
import loginState from "../../mobx/loginState";
import { setUserPlayList } from "../../api/local/userPlayRecord";
import { createError, createSuccess } from "../notification/Notification";
import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    alignItems: "center",
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },

  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));

function Login(props) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(props.open);
  const [phone, setPhone] = useState("");
  const [pwd, setPwd] = useState("");
  const classes = useStyles();

  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  function handleOK() {
    //Todo 手机号验证 输入验证

    setLoading(true);
    LoginByPhone(phone, pwd)
      .then((success) => {
        debugger;
        if (success.data.cookie) {
          setCookie(success.data.cookie);
          setUserDetail(success.data);
          Promise.all([
            getUserPlayList(getUserID()),
            getUserRecentWeekPlayRecord(),
          ]).then(([playListData, playRecordData]) => {
            userPlayList.updatePlayList(
              playListData.data.playlist[0].id,
              playListData.data.playlist.slice(1)
            );
            loginState.changeState(true);
            setUserPlayList(playRecordData.data.weekData);
            setOpen(false);
            createSuccess("登录成功!");
          });
        }
      })
      .catch((err) => {
        setLoading(false);
        createError("登录失败" + err);
      });
  }

  return (
    <Dialog open={open} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">登录</DialogTitle>
      <DialogContent>
        <FormControl>
          <InputLabel>手机号</InputLabel>
          <Input
            id="phone"
            type="text"
            required={true}
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
            }}
          />
        </FormControl>
        <br />
        <FormControl>
          <InputLabel>密码</InputLabel>
          <Input
            id="password"
            type="password"
            required={true}
            value={pwd}
            onChange={(e) => {
              setPwd(e.target.value);
            }}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            props.close();
          }}
          color="primary"
        >
          取消
        </Button>
        <div className={classes.wrapper}>
          <Button onClick={handleOK} color="primary" disabled={loading}>
            确定
          </Button>
          {loading && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </div>
      </DialogActions>
    </Dialog>
  );
}

export default withRouter(Login);
