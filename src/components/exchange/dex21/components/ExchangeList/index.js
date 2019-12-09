import React, { Fragment } from "react";
import { injectIntl } from "react-intl";
import { Client } from "../../../../../services/api";
// import {Client20} from "../../../api";
import { Link } from "react-router-dom";
import { tu } from "../../../../../utils/i18n";
import xhr from "axios/index";
import { map, concat } from "lodash";
import ExchangeTable from "./Table";
import SearchTable from "./SearchTable";
import { Explain } from "./Explain";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import { filter, cloneDeep } from "lodash";
import _ from "lodash";
import { withRouter } from "react-router-dom";
import {
  getSelectData,
  getExchanges20,
  getExchanges,
  getExchangesAllList
} from "../../../../../actions/exchange";
import { connect } from "react-redux";
import Lockr from "lockr";
import { QuestionMark } from "../../../../common/QuestionMark";
import { Input, Radio } from "antd";
import queryString from "query-string";
import { Tooltip } from "reactstrap";
import { alpha } from "../../../../../utils/str";
const Search = Input.Search;

class ExchangeList extends React.Component {
  constructor() {
    super();
    this.date = "2019-04-18T15:00:00.000Z";
    this.state = {
      dataSource: [],
      time: null,
      tokenAudited: true,
      exchangesList: [],
      optional: Lockr.get("optional") ? Lockr.get("optional") : [],
      optionalBok: true,
      search: "",
      searchExchangesList: [],
      showSearch: false,
      activeIndex: "",
      optionalDisable: false,
      searchAddId: false,
      listGrount: {
        dex: [],
        dex20: [],
        favorites: []
      },
      tagLock: true,
      open: false,
      id: alpha(24),
      day: "",
      hr: "",
      min: "",
      sec: "",
      AdClose: true,
      adURL: "https://poloniex.org/launchBase?utm_source=TS2",
      adchURL: "https://poloniex.org/zh/launchBase?utm_source=TS2"
    };
  }

  componentDidMount() {
    const { getExchanges20, getExchangesAllList } = this.props;
    getExchanges20();
    getExchangesAllList();
    const getDataTime = setInterval(() => {
      getExchanges20();
      getExchangesAllList();
    }, 10000);
    this.setState({ time: getDataTime });
    const dex = Lockr.get("DEX");
    if (!dex) {
      Lockr.set("DEX", "Main");
    }
    if (dex == "GEM") {
      this.setState({ tokenAudited: false });
    }
    //this.countdown();
  }

  componentWillUnmount() {
    const { time } = this.state;
    clearInterval(time);
  }

  componentDidUpdate(prevProps) {
    let { exchange20List } = this.props;
    let { tokenAudited } = this.state;
    if (exchange20List != prevProps.exchange20List) {
      this.setData(tokenAudited);
    }
  }

  //活动倒计时
  countdown() {
    // 目标日期时间戳
    const end = Date.parse(new Date(this.date));
    // 当前时间戳
    const now = Date.parse(new Date());
    // 相差的毫秒数
    const msec = end - now;

    // 计算时分秒数
    let day = parseInt(msec / 1000 / 60 / 60 / 24);
    let hr = parseInt((msec / 1000 / 60 / 60) % 24);
    let min = parseInt((msec / 1000 / 60) % 60);
    let sec = parseInt((msec / 1000) % 60);

    // 个位数前补零
    if (day < 10 && day > 0) {
      day = "0" + day;
    } else if (day <= 0) {
      day = "00";
    }
    if (hr < 10 && hr > 0) {
      hr = "0" + hr;
    } else if (hr <= 0) {
      hr = "00";
    }
    if (min < 10 && min > 0) {
      min = "0" + min;
    } else if (min <= 0) {
      min = "00";
    }
    if (sec < 10 && sec > 0) {
      sec = "0" + sec;
    } else if (sec <= 0) {
      sec = "00";
    }
    this.setState({
      day: day,
      hr: hr,
      min: min,
      sec: sec
    });

    // 一秒后递归
    setTimeout(() => {
      this.countdown();
    }, 1000);
  }

  marketAdClose = e => {
    window.event.returnValue = false;
    this.setState({
      AdClose: true
    });
  };
  setData(type) {
    let { exchange20List, exchangeallList } = this.props;
    if (type) {
      this.setState({ dataSource: exchange20List });
    } else {
      let new20List = exchange20List.filter(item => item.isChecked);
      let newallList = exchangeallList
        ? exchangeallList.filter(item => item.isChecked)
        : [];
      let unreviewedTokenList = _(new20List)
        .concat(newallList)
        .value();
      this.setState({ dataSource: unreviewedTokenList });
    }
  }
  handleSelectData = type => {
    const { tagLock } = this.state;
    try {
      const { klineLock } = this.props;
      if (klineLock && tagLock) {
        this.setState({ tokenAudited: type, tagLock: false });
        if (!type) {
          Lockr.set("DEX", "GEM");
        } else {
          Lockr.set("DEX", "Main");
        }
        this.setData(type);
        setTimeout(() => {
          this.setState({ tagLock: true });
        }, 500);
      }
    } catch (err) {
      console.log(err);
    }
  };

  gotoTrc10 = () => {
    const { tagLock } = this.state;
    const { klineLock } = this.props;
    if (klineLock && tagLock) {
      Lockr.set("DEX", "Main");
      this.props.history.push("trc10");
    }
  };

  // https://debug.tronscan.org/#/exchange/trc20?token=TRONdice/TRX&id=30

  render() {
    const {
      dataSource,
      tokenAudited,
      search,
      showSearch,
      searchExchangesList,
      activeIndex,
      searchAddId,
      id,
      open,
      day,
      hr,
      min,
      sec,
      AdClose,
      adURL,
      adchURL
    } = this.state;
    let { intl } = this.props;
    return (
      <div className="exchange-list mr-2">
        {/* 市场 */}

        <div className="exchange-list-mark p-3 mb-2">
          {/* 标题 */}
          {!AdClose && (
            <a
              href={intl.locale == "zh" ? adchURL : adURL}
              target="_blank"
              className="market-ad"
            >
              <img
                src={
                  intl.locale == "zh"
                    ? require("../../../../../images/market/ieo_zh.png")
                    : require("../../../../../images/market/ieo_en.png")
                }
                alt="ieo"
              />
              <ul>
                <li>{day}</li>
                <li>{hr}</li>
                <li>{min}</li>
                <li>{sec}</li>
              </ul>
              <i
                className="market-ad-close"
                onClick={e => {
                  this.marketAdClose(e);
                }}
              >
                ×
              </i>
            </a>
          )}
          <div className="d-flex  justify-content-between align-items-center w-100 mb-3">
            <h6 className="m-0">
              {/* {tu("marks")} */}
              <a href="https://poloniex.org" target="_blank" className="">
                Poloni DEX
              </a>
            </h6>

            <div className="d-flex f-12">
              <a
                href={
                  intl.locale == "zh"
                    ? "	https://support.poloniex.org/hc/zh-cn/requests/new"
                    : "	https://support.poloniex.org/hc/en-us/requests/new"
                }
                target="_bank"
                className="pr-1 border-right border-light"
              >
                {tu("Submit_a_bug")}
              </a>
              <a
                href={
                  intl.locale == "zh"
                    ? "https://support.poloniex.org/hc/zh-cn/categories/360001517211-%E5%B8%B8%E8%A7%81%E9%97%AE%E9%A2%98"
                    : "https://support.poloniex.org/hc/en-us/categories/360001517211-FAQ"
                }
                target="_blank"
                className="px-1 border-right  border-light"
              >
                {tu("beginners_guide")}
              </a>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSeoD6LrVpSdtcb0fJEnkck90IpJ1LTyWKkVd3kQGOKw8rtYhA/viewform"
                target="_blank"
                className="pl-1"
              >
                {tu("token_application_instructions_title")}
              </a>
            </div>
          </div>

          {/* filter 筛选 */}
          <div className="dex-tab">
            {/*<div*/}
            {/*className={"btn-sm disabled dex-tab-TRC20"}*/}
            {/*//className={"btn btn-sm" + (tokenAudited? ' active' : '')}*/}
            {/*//onClick={() => this.handleSelectData(true)}*/}
            {/*id={this.state.id}*/}
            {/*onMouseOver={() => this.setState({open: true})}*/}
            {/*onMouseOut={() => this.setState({open: false})}*/}
            {/*>*/}

            {/*<i></i>*/}
            <div
              className={"btn btn-sm" + (tokenAudited ? " active" : "")}
              onClick={() => this.handleSelectData(true)}
            >
              Market
            </div>
            {/*<Tooltip placement="top" isOpen={open} target={id}>*/}
            {/*<span className="text-capitalize">{tu("TRC20_under_maintenance")}</span>*/}
            {/*</Tooltip>*/}
            <div className={"btn btn-sm"} onClick={() => this.gotoTrc10()}>
              Bancor
            </div>
            <div
              className={"btn btn-sm" + (tokenAudited ? " " : " active")}
              onClick={() => this.handleSelectData(false)}
            >
              <i>
                <i className="fas fa-star" /> {tu("Favorites")}
              </i>
            </div>
          </div>
          <div className="dex-search" />
          {
            <PerfectScrollbar>
              <div
                className="exchange-list__table"
                style={AdClose ? styles.list : styles.adlist}
              >
                <ExchangeTable dataSource={dataSource} />
              </div>
            </PerfectScrollbar>
          }
        </div>

        {/* 说明 */}
        <Explain />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    activeLanguage: state.app.activeLanguage,
    exchange20List: state.exchange.list_20,
    exchange10List: state.exchange.list_10,
    exchangeallList: state.exchange.list_all,
    klineLock: state.exchange.klineLock
  };
}

const mapDispatchToProps = {
  getSelectData,
  getExchanges20,
  getExchangesAllList,
  getExchanges
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(injectIntl(ExchangeList)));

const styles = {
  list: {
    height: 350
  },
  adlist: {
    height: 106
  }
};
