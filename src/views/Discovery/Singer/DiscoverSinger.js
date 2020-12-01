import React from "react";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Divider from "@material-ui/core/Divider";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import { withRouter } from "react-router-dom";
import { getSingerList } from "../../../api/Main";
import theme from "../../../util/Theme";
import { ThemeProvider } from "@material-ui/core/styles";
import { changeRouteToSinger, createPicURL } from "../../../util/convenience";
import LazyLoad from "react-lazyload";

class DiscoverSinger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      value1: "-1",
      value2: "-1",
      value3: "-1",
      loading: true,
    };
  }
  componentDidMount() {
    this.requestForData(
      this.state.value1,
      this.state.value2,
      this.state.value3
    );
  }

  handleChangeLan(e) {
    this.setState({
      value1: e.target.value,
    });
    this.requestForData(e.target.value, this.state.value2, this.state.value3);
  }
  handleChangeCat(e) {
    this.setState({
      value2: e.target.value,
    });
    this.requestForData(this.state.value1, e.target.value, this.state.value3);
  }
  handleChangeAlp(e) {
    this.setState({
      value3: e.target.value,
    });
    this.requestForData(this.state.value1, this.state.value2, e.target.value);
  }

  requestForData(a, b, c) {
    this.setState({
      loading: true,
    });
    getSingerList(a, b, c).then((res) => {
      this.setState({
        result: res.data.artists,
        loading: false,
      });
    });
  }
  renderOption() {
    const alpha = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "X",
      "Y",
      "Z",
    ];
    return alpha.map((item) => {
      return (
        <FormControlLabel
          value={item.toLowerCase()}
          control={<Radio color="primary" />}
          label={item}
          key={item}
        />
      );
    });
  }
  render() {
    return (
      <div>
        <ThemeProvider theme={theme}>
          <div style={{ width: "70vw", marginLeft: "150px" }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">语种</FormLabel>
              <RadioGroup
                row
                value={this.state.value1}
                onChange={this.handleChangeLan.bind(this)}
              >
                <FormControlLabel
                  value="-1"
                  control={<Radio color="primary" />}
                  label="全部"
                />
                <FormControlLabel
                  value="7"
                  control={<Radio color="primary" />}
                  label="华语"
                />
                <FormControlLabel
                  value="96"
                  control={<Radio color="primary" />}
                  label="欧美"
                />
                <FormControlLabel
                  value="8"
                  control={<Radio color="primary" />}
                  label="日本"
                />
                <FormControlLabel
                  value="16"
                  control={<Radio color="primary" />}
                  label="韩国"
                />
                <FormControlLabel
                  value="0"
                  control={<Radio color="primary" />}
                  label="其他"
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div style={{ width: "70vw", marginLeft: "150px" }}>
            <FormControl component="fieldset">
              <FormLabel component="legend">分类</FormLabel>
              <RadioGroup
                row
                value={this.state.value2}
                onChange={this.handleChangeCat.bind(this)}
              >
                <FormControlLabel
                  value="-1"
                  control={<Radio color="primary" />}
                  label="全部"
                />
                <FormControlLabel
                  value="1"
                  control={<Radio color="primary" />}
                  label="男歌手"
                />
                <FormControlLabel
                  value="2"
                  control={<Radio color="primary" />}
                  label="女歌手"
                />
                <FormControlLabel
                  value="3"
                  control={<Radio color="primary" />}
                  label="乐队组合"
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div style={{ width: "70vw", marginLeft: "150px" }}>
            <FormControl component="fieldset" color="primary">
              <FormLabel component="legend">筛选</FormLabel>
              <RadioGroup
                row
                value={this.state.value3}
                onChange={this.handleChangeAlp.bind(this)}
              >
                <FormControlLabel
                  value="-1"
                  control={<Radio color="primary" />}
                  label="热门"
                />
                {this.renderOption()}
              </RadioGroup>
            </FormControl>
          </div>
        </ThemeProvider>

        <Divider />
        <div>
          {!this.state.loading && (
            <div
              style={{
                width: "70vw",
                display: "flex",
                flexWrap: "wrap",
                marginTop: "20px",
                marginLeft: "150px",
              }}
            >
              {this.state.result.map(function (item, index) {
                let alias = null;
                if (item.alias.length !== 0) alias = item.alias[0];
                return (
                  <LazyLoad height={180}>
                    <div
                      key={index}
                      style={{
                        width: "180px",
                        height: "180px",
                        cursor: "pointer",
                        marginRight: "20px",
                        marginBottom: "20px",
                      }}
                      onClick={() => {
                        changeRouteToSinger(this.props, item.id);
                      }}
                    >
                      <img
                        src={createPicURL(item.picUrl, 150, 150)}
                        alt=""
                        style={{ borderRadius: "10px" }}
                      />
                      <div>
                        <span style={{ fontSize: "16px" }}>
                          {item.name}
                          {alias}
                        </span>
                      </div>
                    </div>
                  </LazyLoad>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default withRouter(DiscoverSinger);
