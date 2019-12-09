import React from "react";
import xhr from "axios/index";
import {Client} from "../../../services/api";
import {ONE_TRX} from "../../../constants";
import {connect} from "react-redux";
import {injectIntl} from "react-intl";
import {filter, flatten} from "lodash";
import {tronAddresses} from "../../../utils/tron";
import {TronLoader} from "../../common/loaders";
import LineReact from "../../common/LineChart";
import {cloneDeep} from "lodash";
import {tu} from "../../../utils/i18n";
import CountUp from 'react-countup';
import {Link} from "react-router-dom"
import {API_URL} from "../../../constants";
import {
    SupplyAreaHighChart
} from "../../common/LineCharts";


import {loadPriceData} from "../../../actions/markets";
import {t} from "../../../utils/i18n";

class BTTSupply extends React.Component {

    constructor() {
        super();

        this.state = {
            accounts: null,
            transactionStats: null,
            blockStats: null,
            transactionValueStats: null,
            txOverviewStats: null,
            txOverviewStatsFull: null,
            addressesStats: null,
            blockSizeStats: null,
            blockchainSizeStats: null,
            priceStats: null,
            volumeStats: null,
            summit: null,
            pieChart: null,
            supplyTypesChart: null,
            genesisNum:null,
            blockProduceRewardsNum:null,
            nodeRewardsNum:null,
            independenceDayBurned:null,
            feeBurnedNum:null,
            currentTotalSupply:null,
            priceUSD:null,
            priceBTC:null,
            marketCapitalization:null,
            foundationFreeze:null,
            circulatingNum:null
        };
    }

    componentDidMount() {
        this.loadTotalTRXSupply();
        setInterval(() => {
            this.loadTotalTRXSupply();
        }, 60000);
    }

    compare (property) {
        return function (obj1, obj2) {
            if (obj1[property] > obj2[property]) {
                return 1;
            } else if (obj1[property] < obj2[property]) {
                return -1;
            } else {
                return 0;
            }
        }
    }

    loadTotalTRXSupply = async() =>{
        let {intl} = this.props;
        const {funds} = await Client.getBttFundsSupply('wink');
        // const {data: funds} = await xhr.get('https://api.shasta.tronscan.org/api/wink/fund')
        let total = 999000000000;
        let result=await xhr.get(`${API_URL}/api/wink/graphic`);

      let supplyTypesChartData = result.data;
        let eurWinkTronbetURL = encodeURI(`http://api.coinmarketcap.com/v1/ticker/wink-tronbet/?convert=EUR`);
        let trxPriceData = await xhr.get(`${API_URL}/api/system/proxy?url=${eurWinkTronbetURL}`);
        let priceUSD = ((parseFloat(trxPriceData.data[0].price_usd))*1000).toFixed(3);
        let priceBTC = ((parseFloat(trxPriceData.data[0].price_btc))*1000).toFixed(5);
        let marketCapitalization = ((parseFloat(trxPriceData.data[0].price_usd)*(funds.totalTurnOver))).toFixed(2);
        this.setState({
            supplyTypesChart: supplyTypesChartData,
             genesisNum:intl.formatNumber(total),
            // blockProduceRewardsNum:intl.formatNumber(funds.totalBlockPay),
            // nodeRewardsNum:intl.formatNumber(funds.totalNodePay),
            // independenceDayBurned:intl.formatNumber(funds.burnPerDay),
            // feeBurnedNum:intl.formatNumber(funds.burnByCharge),
            currentTotalSupply:parseInt(funds.totalTurnOver),
            priceUSD:priceUSD,
            priceBTC:priceBTC,
            marketCapitalization:marketCapitalization,
            //foundationFreeze:intl.formatNumber(funds.fundTrx),
            //circulatingNum:intl.formatNumber(funds.turnOver)
        });
    }


    async loadPieChart(){
        let {intl} = this.props;
        let {statisticData} = await Client.getStatisticData()
        let pieChartData = [];
        if (statisticData.length > 0) {
            statisticData.map((val, i) => {
                pieChartData.push({
                    key: i + 1,
                    name: val.name ? val.name : val.url,
                    volumeValue: intl.formatNumber(val.blockProduced),
                    volumePercentage: intl.formatNumber(val.percentage * 100, {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2
                    }) + '%',
                });

            })
        }
        this.setState({
            pieChart: pieChartData
        });
    }
    getDateByYear(yearArr, initMonth){
        var newdata = yearArr.map((yaer, index) => {
            let startMonth = 1
            let endMonth = 12
            let date = []
            if(index === 0){
                startMonth = initMonth
            }else if(index === yaer.length-1){
                endMonth = initMonth
            }
            for (let month = startMonth; month <= endMonth; month++) {
                date.push(`${yaer}-${month}`) 
            }
            return date
        })
        return flatten(newdata)
    }

    render() {
        let {match, intl,activeLanguage} = this.props;
        let {supplyTypesChart,genesisNum,blockProduceRewardsNum,nodeRewardsNum,independenceDayBurned,feeBurnedNum,currentTotalSupply,priceUSD,priceBTC,marketCapitalization,foundationFreeze,circulatingNum} = this.state;
        let supplyURL = "https://ex.bnbstatic.com/images/20190128/c015d0e0-f442-4245-a963-b3e2ad50617b.jpg";
        const chartData = {
            title: intl.formatMessage({id: 'WIN_Token_Release_Schedule'}),
            subtitle: intl.formatMessage({id: 'source_WIN_team'}),
            exporting: intl.formatMessage({id: 'WIN_Token_Release_Schedule'}),
            xAxis: this.getDateByYear(['2019', '2020', '2021', '2022'], 8)
        }
        
        return (

                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body p-5 btt-supply-body">
                                {
                                    <div>
                                        {
                                            !currentTotalSupply?
                                                <TronLoader/> :
                                                <div className="row" style={{fontSize : 12,marginRight:0}}>
                                                    <div className="col-md-12">
                                                        <div className="table-responsive">
                                                            <table className="table" style={{marginTop : 10}}>
                                                                <thead>
                                                                <tr>
                                                                    <th style={{border:0}}>
                                                                        <i className="fa fa-puzzle-piece" ></i>
                                                                        <span style={{marginTop:2}}>{tu('WIN_distribution_overview')}</span>
                                                                    </th>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                <tr>
                                                                    <td style={{  width: '20%'}}>
                                                                        {tu('genesis')}:
                                                                    </td>
                                                                    <td className="text-nowrap">
                                                                        {genesisNum} WIN
                                                                    </td>
                                                                </tr>

                                                                <tr>
                                                                    <td><b>{tu('current_total_supply')}:</b><br/>
                                                                    </td>
                                                                    <td className="text-nowrap">
                                                                        <b>{intl.formatNumber(currentTotalSupply)} WIN</b>
                                                                    </td>
                                                                </tr>

                                                                </tbody>
                                                            </table>
                                                        </div>
                                                        <br/>
                                                        <div className="table-responsive">
                                                            <table className="table" style={{marginBottom:0}}>
                                                                <thead>
                                                                <tr>
                                                                    <th style={{border:0}}><br/><i className="fa fa-coins" ></i> {tu('price_per_1000_WIN')}</th>
                                                                </tr>
                                                                </thead>
                                                                <tbody><tr>
                                                                    <td style={{  width: '20%'}}>{tu('in_USD')}:
                                                                    </td>
                                                                    <td>
                                                                        ${priceUSD}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>{tu('in_BTC')}:
                                                                    </td>
                                                                    <td>
                                                                        {priceBTC}
                                                                    </td>
                                                                </tr>
                                                                </tbody></table>
                                                            <div style={{fontSize:12,color:'#999',whiteSpace: 'nowrap',textAlign:'left', padding: '0.75rem',borderTop: '1px solid #DFD7CA',verticalAlign: 'top'}}>
                                                                <div style={{transform:'scale(.9)',marginLeft: '-1.3rem'}}>
                                                                    {/**{tu('supply_notes')}*/}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12" style={{backgroundColor: '#F5F5F5',marginTop:0,paddingBottom:15}}>
                                                        <div className="main-counters row" style={{marginBottom:'0px'}}>
                                                            <div className="counters col-md-6 col-sm-6">
                                                                <span className="counter">
                                                                    <CountUp start={0} end={currentTotalSupply} duration={2}  separator="," decimals={0} />
                                                                    &nbsp; WIN
                                                                </span>
                                                                <h4>{tu('circulating_supply')}</h4>
                                                            </div>
                                                            <div className="counters col-md-6 col-sm-6">
                                                                <span className="counter">
                                                                    $<CountUp start={0} end={marketCapitalization} duration={2}  separator="," decimals={2}/>
                                                                </span>
                                                                <h4>{tu('market_capitalization')}</h4>
                                                            </div>
                                                        </div>
                                                      {
                                                        <div className="card">
                                                          <div className="card-body">
                                                            <SupplyAreaHighChart
                                                                intl={intl}
                                                                data={supplyTypesChart}
                                                                chartData={chartData}
                                                                style={{height: 400, marginTop: 10}}
                                                            />
                                                          </div>
                                                        </div>
                                                      }
                                                    </div>
                                                    <a href='https://info.binance.com/en/research/WIN-2019-07-22.html'>Binance Launchpad Public Sale</a>
                                                </div>
                                        }
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
}


function

mapStateToProps(state) {
    return {
        priceGraph: state.markets.price,
        activeLanguage: state.app.activeLanguage,
    };
}

const
    mapDispatchToProps = {
        loadPriceData,
    };

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(BTTSupply))
