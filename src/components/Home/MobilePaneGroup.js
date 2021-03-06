import React, { Component } from "react";
import { connect } from "react-redux";
import xhr from "axios/index";
import { injectIntl } from "react-intl";
import { doSearch, getSearchType } from "../../services/search";
import CountUp from "react-countup";
import { Client, Client20 } from "../../services/api";
import { Link } from "react-router-dom";
import { TRXPrice } from "../common/Price";
import RecentBlocks from "./RecentBlocks";
import { KEY_ENTER } from "../../utils/constants";
import { withTimers } from "../../utils/timing";
import isMobile from "../../utils/isMobile";
import RecentTransfers from "./RecentTransfers";
import { tu } from "../../utils/i18n";
import { toastr } from "react-redux-toastr";
import { HrefLink } from "../common/Links";
import { TronLoader } from "../common/loaders";
import {
  LineReactHighChartAdd,
  LineReactHighChartTx
} from "../common/LineCharts";
import { API_URL, IS_MAINNET } from "../../constants";
import { setWebsocket, setWebsocketSun } from "../../actions/account";
import Lockr from "lockr";
import { Icon, Divider, Tooltip, Tag, Carousel } from "antd";
import ApiHome from "../../services/homeApi";

@connect(
  state => {
    return {
      blocks: state.blockchain.blocks,
      account: state.app.account,
      theme: state.app.theme,
      activeLanguage: state.app.activeLanguage,
      wsdata: state.account.wsdata,
      websocket: state.account.websocket,
      wsdataSun: state.account.wsdataSun,
      websocketSun: state.account.websocketSun
    };
  },
  {
    setWebsocket,
    setWebsocketSun
  }
)
@withTimers
@injectIntl
export default class MobilePanelGroup extends Component {
  constructor(props) {
    super(props);
    this.listener = null;
    this.state = {};
  }

  async componentDidMount() {}

  async componentDidUpdate(prevProps) {}

  componentWillUnmount() {
    let { websocketSun } = this.props;
    if (websocketSun) {
      websocketSun.close();
      Lockr.set("websocketSun", "close");
    }
  }

  render() {
    let {
      intl,
      activeLanguage,
      mainnetData,
      sunnetData,
      complexData
    } = this.props;

    return (
      <div className="mobile-card">
        {/* mobile main net */}
        {IS_MAINNET && (
          <Carousel autoplay>
            <div className="row text-center mr-0 ml-0 mobile-home-state">
              <div
                className="col-12  card  pt-1 mb-0"
                style={{ border: "none", borderRadius: 0 }}
              >
                <p className="mb-0 mobile-title">TRON</p>
                <div className="row pt-3">
                  <div className="col-6 ">
                    <img src={require("../../images/home/node.png")} />
                    <p className="text-muted mb-0 mt-2">{tu("online_nodes")}</p>
                    {complexData.onlineNodes != 0 ? (
                      <h2>
                        <CountUp
                          start={0}
                          end={complexData.onlineNodes}
                          duration={1}
                        />
                      </h2>
                    ) : (
                      <h2>-</h2>
                    )}
                  </div>

                  <div className="col-6">
                    <img src={require("../../images/home/block.png")} />
                    <p className="text-muted mb-0 mt-2">{tu("block_height")}</p>

                    {mainnetData.blockHeight != 0 ? (
                      <h2>
                        <CountUp
                          start={mainnetData.startblockHeight}
                          end={mainnetData.blockHeight}
                          duration={1}
                        />
                      </h2>
                    ) : (
                      <h2>-</h2>
                    )}
                  </div>
                  <div className="col-6">
                    <div
                      href="javascript:;"
                      className="hvr-underline-from-center hvr-underline-white text-muted"
                    >
                      <img src={require("../../images/home/tps.png")} />
                      <p className="text-muted mb-0 mt-2">
                        {tu("current_MaxTPS")}
                      </p>

                      {complexData.tps ? (
                        <h2>
                          <CountUp
                            start={complexData.startTps}
                            end={complexData.tps}
                            duration={1}
                          />
                          /
                          <CountUp
                            start={0}
                            end={mainnetData.maxTps}
                            duration={1}
                          />
                        </h2>
                      ) : (
                        <h2>-</h2>
                      )}
                    </div>
                  </div>

                  <div className="col-6">
                    <img src={require("../../images/home/transctions.png")} />
                    <p className="text-muted mb-0 mt-2">
                      {tu("transactions_last_day")}
                    </p>
                    {complexData.transactionPerDay != 0 ? (
                      <h2>
                        <CountUp
                          start={0}
                          end={complexData.transactionPerDay}
                          duration={1}
                        />
                      </h2>
                    ) : (
                      <h2>-</h2>
                    )}
                  </div>
                  <div className="col-6">
                    <img src={require("../../images/home/account.png")} />
                    <p className="text-muted mb-0 mt-2">
                      {tu("total_accounts")}
                    </p>

                    {complexData.totalAccounts != 0 ? (
                      <h2>
                        <CountUp
                          start={0}
                          end={complexData.totalAccounts}
                          duration={1}
                        />
                      </h2>
                    ) : (
                      <h2>-</h2>
                    )}
                  </div>
                  <div className="col-6">
                    <HrefLink
                      href="https://coinmarketcap.com/currencies/tron/"
                      target="_blank"
                      className="hvr-underline-from-center hvr-underline-white text-muted"
                    >
                      <img src={require("../../images/home/price.png")} />
                      <p className="text-muted mb-0 mt-2">
                        {tu("pice_per_1trx")}
                      </p>

                      <h2>
                        <TRXPrice amount={1} currency="USD" source="home" />
                      </h2>
                    </HrefLink>
                  </div>
                </div>
              </div>
            </div>

            <div className="row text-center mr-0 ml-0 mobile-home-state">
              <div
                className="col-12  card  pt-1 mb-0"
                style={{ border: "none", borderRadius: 0 }}
              >
                <p className="mb-0 mobile-title">{tu("main_chain")}</p>
                <div className="row pt-3">
                  <div className="col-6 ">
                    <Link
                      to="/blockchain/nodes"
                      className="hvr-underline-from-center hvr-underline-white text-muted"
                    >
                      <img src={require("../../images/home/node.png")} />
                      <p className="text-muted mb-0 mt-2">
                        {tu("online_nodes")}
                      </p>

                      {mainnetData.onlineNodes != 0 ? (
                        <h2>
                          <CountUp
                            start={0}
                            end={mainnetData.onlineNodes}
                            duration={1}
                          />
                        </h2>
                      ) : (
                        <h2>-</h2>
                      )}
                    </Link>
                  </div>

                  <div className="col-6">
                    <Link
                      to="/blockchain/blocks"
                      className="hvr-underline-from-center hvr-underline-white text-muted"
                    >
                      <img src={require("../../images/home/block.png")} />
                      <p className="text-muted mb-0 mt-2">
                        {tu("block_height")}
                      </p>

                      {mainnetData.blockHeight != 0 ? (
                        <h2>
                          <CountUp
                            start={mainnetData.startblockHeight}
                            end={mainnetData.blockHeight}
                            duration={1}
                          />
                        </h2>
                      ) : (
                        <h2>-</h2>
                      )}
                    </Link>
                  </div>
                  <div className="col-6">
                    <div
                      href="javascript:;"
                      className="hvr-underline-from-center hvr-underline-white text-muted"
                    >
                      <img src={require("../../images/home/tps.png")} />
                      <p className="text-muted mb-0 mt-2">
                        {tu("current_MaxTPS")}
                      </p>

                      {mainnetData.maxTps ? (
                        <h2>
                          <CountUp
                            start={0}
                            end={mainnetData.tps}
                            duration={1}
                          />
                          /
                          <CountUp
                            start={0}
                            end={mainnetData.maxTps}
                            duration={1}
                          />
                        </h2>
                      ) : (
                        <h2>-</h2>
                      )}
                    </div>
                  </div>

                  <div className="col-6">
                    <Link
                      to="/blockchain/transactions"
                      className="hvr-underline-from-center hvr-underline-white text-muted"
                    >
                      <img src={require("../../images/home/transctions.png")} />
                      <p className="text-muted mb-0 mt-2">
                        {tu("transactions_last_day")}
                      </p>
                      {mainnetData.transactionPerDay != 0 ? (
                        <h2>
                          <CountUp
                            start={0}
                            end={mainnetData.transactionPerDay}
                            duration={1}
                          />
                        </h2>
                      ) : (
                        <h2>-</h2>
                      )}
                    </Link>
                  </div>
                  <div className="col-6">
                    <Link
                      to="/blockchain/accounts"
                      className="hvr-underline-from-center hvr-underline-white text-muted"
                    >
                      <img src={require("../../images/home/account.png")} />
                      <p className="text-muted mb-0 mt-2">
                        {tu("total_accounts")}
                      </p>

                      {mainnetData.totalAccounts != 0 ? (
                        <h2>
                          <CountUp
                            start={0}
                            end={mainnetData.totalAccounts}
                            duration={1}
                          />
                        </h2>
                      ) : (
                        <h2>-</h2>
                      )}
                    </Link>
                  </div>
                  <div className="col-6">
                    <HrefLink
                      href="https://coinmarketcap.com/currencies/tron/"
                      target="_blank"
                      className="hvr-underline-from-center hvr-underline-white text-muted"
                    >
                      <img src={require("../../images/home/price.png")} />
                      <p className="text-muted mb-0 mt-2">
                        {tu("pice_per_1trx")}
                      </p>

                      <h2>
                        <TRXPrice amount={1} currency="USD" source="home" />
                      </h2>
                    </HrefLink>
                  </div>
                </div>
              </div>
            </div>

            <div className="row text-center mr-0 ml-0 mobile-home-state">
              <div
                className="col-12  card  pt-1 mb-0"
                style={{ border: "none", borderRadius: 0 }}
              >
                <p className="mb-0 mobile-title">{tu("sun_network")}</p>
                <div className="row pt-3">
                  <div className="col-6 ">
                    <img src={require("../../images/home/node.png")} />
                    <p className="text-muted mb-0 mt-2">{tu("online_nodes")}</p>

                    {sunnetData.onlineNodes != 0 ? (
                      <h2>
                        <CountUp
                          start={0}
                          end={sunnetData.onlineNodes}
                          duration={1}
                        />
                      </h2>
                    ) : (
                      <h2>-</h2>
                    )}
                  </div>

                  <div className="col-6">
                    <img src={require("../../images/home/block.png")} />
                    <p className="text-muted mb-0 mt-2">{tu("block_height")}</p>

                    {sunnetData.blockHeight != 0 ? (
                      <h2>
                        <CountUp
                          start={sunnetData.startblockHeight}
                          end={sunnetData.blockHeight}
                          duration={1}
                        />
                      </h2>
                    ) : (
                      <h2>-</h2>
                    )}
                  </div>
                  <div className="col-6">
                    <div
                      href="javascript:;"
                      className="hvr-underline-from-center hvr-underline-white text-muted"
                    >
                      <img src={require("../../images/home/tps.png")} />
                      <p className="text-muted mb-0 mt-2">
                        {tu("current_MaxTPS")}
                      </p>

                      {sunnetData.maxTps ? (
                        <h2>
                          <CountUp
                            start={0}
                            end={sunnetData.tps}
                            duration={1}
                          />
                          /
                          <CountUp
                            start={0}
                            end={sunnetData.maxTps}
                            duration={1}
                          />
                        </h2>
                      ) : (
                        <h2>-</h2>
                      )}
                    </div>
                  </div>

                  <div className="col-6">
                    <img src={require("../../images/home/transctions.png")} />
                    <p className="text-muted mb-0 mt-2">
                      {tu("transactions_last_day")}
                    </p>
                    {sunnetData.transactionPerDay != 0 ? (
                      <h2>
                        <CountUp
                          start={0}
                          end={sunnetData.transactionPerDay}
                          duration={1}
                        />
                      </h2>
                    ) : (
                      <h2>-</h2>
                    )}
                  </div>
                  <div className="col-6">
                    <img src={require("../../images/home/account.png")} />
                    <p className="text-muted mb-0 mt-2">
                      {tu("total_accounts")}
                    </p>

                    {sunnetData.totalAccounts != 0 ? (
                      <h2>
                        <CountUp
                          start={0}
                          end={sunnetData.totalAccounts}
                          duration={1}
                        />
                      </h2>
                    ) : (
                      <h2>-</h2>
                    )}
                  </div>
                  <div className="col-6">
                    <HrefLink
                      href="https://coinmarketcap.com/currencies/tron/"
                      target="_blank"
                      className="hvr-underline-from-center hvr-underline-white text-muted"
                    >
                      <img src={require("../../images/home/price.png")} />
                      <p className="text-muted mb-0 mt-2">
                        {tu("pice_per_1trx")}
                      </p>

                      <h2>
                        <TRXPrice amount={1} currency="USD" source="home" />
                      </h2>
                    </HrefLink>
                  </div>
                </div>
              </div>
            </div>
          </Carousel>
        )}
        {/* mobile sun net */}
        {!IS_MAINNET && (
          <div className="row text-center mr-0 ml-0 mobile-home-state">
            <div
              className="col-12  card  pt-1 mb-0"
              style={{ border: "none", borderRadius: 0 }}
            >
              <div className="row pt-3">
                <div className="col-6 ">
                  <Link
                    to="/blockchain/nodes"
                    className="hvr-underline-from-center hvr-underline-white text-muted"
                  >
                    <img src={require("../../images/home/node.png")} />
                    <p className="text-muted mb-0 mt-2">{tu("online_nodes")}</p>

                    {sunnetData.onlineNodes != 0 ? (
                      <h2>
                        <CountUp
                          start={0}
                          end={sunnetData.onlineNodes}
                          duration={1}
                        />
                      </h2>
                    ) : (
                      <h2>-</h2>
                    )}
                  </Link>
                </div>

                <div className="col-6">
                  <Link
                    to="/blockchain/blocks"
                    className="hvr-underline-from-center hvr-underline-white text-muted"
                  >
                    <img src={require("../../images/home/block.png")} />
                    <p className="text-muted mb-0 mt-2">{tu("block_height")}</p>

                    {sunnetData.blockHeight != 0 ? (
                      <h2>
                        <CountUp
                          start={sunnetData.startblockHeight}
                          end={sunnetData.blockHeight}
                          duration={1}
                        />
                      </h2>
                    ) : (
                      <h2>-</h2>
                    )}
                  </Link>
                </div>
                <div className="col-6">
                  <div
                    href="javascript:;"
                    className="hvr-underline-from-center hvr-underline-white text-muted"
                  >
                    <img src={require("../../images/home/tps.png")} />
                    <p className="text-muted mb-0 mt-2">
                      {tu("current_MaxTPS")}
                    </p>

                    {sunnetData.maxTps ? (
                      <h2>
                        <CountUp start={0} end={sunnetData.tps} duration={1} />/
                        <CountUp
                          start={0}
                          end={sunnetData.maxTps}
                          duration={1}
                        />
                      </h2>
                    ) : (
                      <h2>-</h2>
                    )}
                  </div>
                </div>

                <div className="col-6">
                  <Link
                    to="/blockchain/transactions"
                    className="hvr-underline-from-center hvr-underline-white text-muted"
                  >
                    <img src={require("../../images/home/transctions.png")} />
                    <p className="text-muted mb-0 mt-2">
                      {tu("transactions_last_day")}
                    </p>
                    {sunnetData.transactionPerDay != 0 ? (
                      <h2>
                        <CountUp
                          start={0}
                          end={sunnetData.transactionPerDay}
                          duration={1}
                        />
                      </h2>
                    ) : (
                      <h2>-</h2>
                    )}
                  </Link>
                </div>
                <div className="col-6">
                  <Link
                    to="/blockchain/accounts"
                    className="hvr-underline-from-center hvr-underline-white text-muted"
                  >
                    <img src={require("../../images/home/account.png")} />
                    <p className="text-muted mb-0 mt-2">
                      {tu("total_accounts")}
                    </p>

                    {sunnetData.totalAccounts != 0 ? (
                      <h2>
                        <CountUp
                          start={0}
                          end={sunnetData.totalAccounts}
                          duration={1}
                        />
                      </h2>
                    ) : (
                      <h2>-</h2>
                    )}
                  </Link>
                </div>
                <div className="col-6">
                  <HrefLink
                    href="https://coinmarketcap.com/currencies/tron/"
                    target="_blank"
                    className="hvr-underline-from-center hvr-underline-white text-muted"
                  >
                    <img src={require("../../images/home/price.png")} />
                    <p className="text-muted mb-0 mt-2">
                      {tu("pice_per_1trx")}
                    </p>

                    <h2>
                      <TRXPrice amount={1} currency="USD" source="home" />
                    </h2>
                  </HrefLink>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const styles = {
  list: {
    fontSize: 18
  },
  card: {
    border: "none",
    borderRadius: 0
  }
};

function mapStateToProps(state) {
  return {
    blocks: state.blockchain.blocks,
    account: state.app.account,
    theme: state.app.theme,
    activeLanguage: state.app.activeLanguage,
    wsdata: state.account.wsdata
  };
}

const mapDispatchToProps = {
  setWebsocket
};
