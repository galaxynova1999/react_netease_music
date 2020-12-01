import { action, observable } from "mobx";
import { getLoginState, setLoginState } from "../api/Me";

class LoginState {
  @observable isLogin = getLoginState();

  @action.bound
  changeState(state) {
    setLoginState(state);
    this.isLogin = state;
  }
}

export default new LoginState();
