/* eslint-disable no-undef */
import React, {Fragment} from "react";
import {injectIntl} from "react-intl";
import {NavLink, Route, Switch} from "react-router-dom";
import {connect} from "react-redux";
import {FormattedNumber} from "react-intl";
import {TronLoader} from "../../common/loaders";
import { Radio, Button } from 'antd'
import MonacoEditor from 'react-monaco-editor';
import {tu} from "../../../utils/i18n";
import CompilerConsole from "./CompilerConsole";
import VerifyContractCode from "./VerifyContractCode";
import CompilerModal from "./CompilerCompileModal";
import DeployModal from "./CompilerDeployModal";
import { Base64 } from 'js-base64';
import xhr from "axios/index";
import SweetAlert from "react-bootstrap-sweetalert";
import _, {find, round, filter } from "lodash";
import {toThousands} from "../../../utils/number";
import Lockr from "lockr";

@connect(
    state => ({
        account: state.app.account,
        wallet: state.wallet.current,
    })
)
class ContractCompiler extends React.Component {
    constructor({match}) {
        super();

        this.state = {
            loading: false,
            compileLoading:false,
            deployLoading:false,
            compilerVersion:'',
            optimizer:'',
            code:'// type your code...',
            filter: {
                direction:'compile'
            },
            CompileStatus:[],
            modal: null,
            showModal:false,
            contractNameList:[],
            compileInfo:[],
        }
        this.onChange = this.onChange.bind(this)
    }
    initCompile = () =>{
        if(Lockr.get("CompileCode")){
            let solidity = Base64.encode(Lockr.get("CompileCode"));
            this.setState({
                solidity,
                code:Lockr.get("CompileCode")

            })
        }
        if(Lockr.get("CompileStatus")){
            this.setState({
                CompileStatus:Lockr.get("CompileStatus")
            })
        }
        if(Lockr.get("contractNameList")){
            this.setState({
                contractNameList:Lockr.get("contractNameList")
            })
        }
        if(Lockr.get("compileInfo")){
            this.setState({
                compileInfo:Lockr.get("compileInfo")
            })
        }
    }

    editorDidMount(editor, monaco) {
        editor.focus();
    }

    onChange(newValue, e) {
        let solidity = Base64.encode(newValue);
        this.setState({
            solidity,
            code:newValue
        })

    }

    componentDidMount() {
       let {match} = this.props;
       if(match.params && match.params.type == 'verify'){
        this.setState({
            filter: { direction: 'verify'}
        })
       }else{
            this.initCompile();
       }
    }

    componentWillUnmount() {
        let { code, CompileStatus, compileInfo, contractNameList } = this.state;
        if(CompileStatus && code !== '// type your code...'){
            Lockr.set("CompileCode",code);
            Lockr.set("CompileStatus",CompileStatus);
            Lockr.set("compileInfo",compileInfo);
            Lockr.set("contractNameList",contractNameList);
        }
    }

    onRadioChange = (val) => {
        if(val == 'verify'){
            location.href = '/#/contracts/contract-Compiler/verify'
        }else{
            location.href = '/#/contracts/contract-Compiler'
        }
        this.setState({
            filter: {
                direction: val,
            }
        })
    };

    enterIconLoading = () => {
        this.setState({ deployLoading: true });
    };

    isLoggedIn = () => {
        let {account, intl} = this.props;
        if(!account.isLoggedIn){
            this.setState({
                modal: <SweetAlert
                    warning
                    title={tu("not_signed_in")}
                    confirmBtnText={intl.formatMessage({id: 'confirm'})}
                    confirmBtnBsStyle="danger"
                    onConfirm={() => this.setState({modal: null})}
                    style={{marginLeft: '-240px', marginTop: '-195px'}}
                >
                </SweetAlert>
            })
        }
        return account.isLoggedIn;
    };
    isCompile = () => {
        let { contractNameList } = this.state;
        let { intl } = this.props;
        if(contractNameList.length == 0){
            this.setState({
                modal: <SweetAlert
                    warning
                    title={tu("请先编译")}
                    confirmBtnText={intl.formatMessage({id: 'confirm'})}
                    confirmBtnBsStyle="danger"
                    onConfirm={() => this.setState({modal: null})}
                    style={{marginLeft: '-240px', marginTop: '-195px'}}
                >
                </SweetAlert>
            })
            return false;
        }
        return true;
    };
    hideModal = () => {
        this.setState({
            modal: null,
        });
    };

    compileModal = () => {
        if(!this.isLoggedIn()) return;
        this.setState({
            modal: (
                <CompilerModal
                    onHide={this.hideModal}
                    onConfirm={(version, optimizer, runs) => this.compile(version,optimizer,runs)}

                />
            )
        });
    }

    deployModal = () => {
        if(!this.isLoggedIn()) return;
        if(!this.isCompile()) return;
        this.setState({
            modal: (
                <DeployModal
                    onHide={this.hideModal}
                    onConfirm={(options) => this.deploy(options)}
                    contractNameList={this.state.contractNameList}
                    compileInfo={this.state.compileInfo}
                />
            )
        });
    }
    onDeployParams (form) {
        this.setState({
            ...form
        })
    }
    compilerVersionMsg(version) {
        this.setState({
            compilerVersion:version
        });
    }
    optimizerMsg(value) {
        this.setState({
            optimizer:value
        });
    }



    compile = async (compilerVersion,optimizer, runs) => {
        this.setState({
            compileLoading: true,
            modal: null,
            CompileStatus:[],
            optimizer,
            compilerVersion,
        });
        let { CompileStatus, solidity } = this.state;
        let error;
        let {data} = await xhr.post(`http://18.219.114.60:9016/v1/api/contract/compile`, {
            "compiler": compilerVersion,
            "optimizer": optimizer,
            "solidity":solidity,
            "runs":runs
        }).catch(function (e) {
            let errorData = [{
                type: "error",
                content: `Compiled error: ${e.toString()}`
            }]
            error = errorData.concat(CompileStatus)

        });
        if(!data){
            this.setState({
                CompileStatus:error,
                compileLoading: false
            });
            return;
        }
        if(data.code == 200){
            this.setState({
                compileLoading: false
            });
            if(data.errmsg == null && data.data !=={}){
                let successData = [];
                let contractNameList = [];
                let mapArr = _.keyBy(data.data.byteCodeArr, "contractName");
                let compileInfo = _(data.data.abiArr).map(m => _.merge({}, m, mapArr[m.contractName]))
                    .concat(_.differenceBy(data.data.abiArr, data.data.byteCodeArr, "contractName"))
                    .value();
                for (let i in compileInfo) {
                    let contract = compileInfo[i];
                    let contractName = contract.contractName
                    contractNameList.push(contractName)
                    successData.push({
                        type: "success",
                        class:"compile",
                        content: `Compiled success: Contract '${contractName}' <span>Show ABI</span> <span>Show Bytecode</span>`,
                        contract:contract
                    })
                }
                this.setState({
                    compileInfo,
                    contractNameList,
                    CompileStatus:successData,
                })
            }
        }else{
            if(data.errmsg){
                if(typeof data.errmsg === 'string'){
                    let errorData = [{
                        type: "error",
                        content: `Compiled error: ${data.errmsg}`
                    }]
                    let error = errorData.concat(CompileStatus)
                    this.setState({
                        CompileStatus:error,
                        compileLoading: false
                    });
                }
            }
        }

    };
    deploy = async (options) => {
        let currentContractName = options.name;
        let { CompileStatus } = this.state;
        const {tronWeb} = this.props.account;

        this.setState({
            modal:null,
            deployLoading: true,
        });
        try {
            let infoData =  [{
                type: "info",
                content: "Deploy " + options.name + "\n"
            }]
            CompileStatus.push.apply(CompileStatus,infoData)
            this.setState({
                CompileStatus,
                compileLoading: false
            });

            const unsigned = await tronWeb.transactionBuilder.createSmartContract(
                options
            );
            infoData = [{
                type: "info",
                class:"unsigned",
                content:`Transaction unsigned.`,
                contract:unsigned
            }];
            CompileStatus.push.apply(CompileStatus,infoData)
            await this.setState({
                CompileStatus,
            });

            const signed = await tronWeb.trx.sign(unsigned);
            infoData = [{
                type: "info",
                class:"signed",
                content:`Transaction signed!`,
                contract:signed
            }];
            CompileStatus.push.apply(CompileStatus,infoData)
            await this.setState({
                CompileStatus,
            });

            const broadcastResult = await tronWeb.trx.sendRawTransaction(
                signed
            );
            if (broadcastResult.result === true) {

                infoData = [{
                    type: "info",
                    class:"broadcast",
                    content:`Broadcast transaction success!`,
                    contract:broadcastResult
                }];
                CompileStatus.push.apply(CompileStatus,infoData)
                await this.setState({
                    CompileStatus,
                });


                let transactionInfo = {};
                do {
                    transactionInfo = await tronWeb.trx.getTransactionInfo(
                        signed.txID
                    );

                    if (transactionInfo.id) {
                        if (transactionInfo.receipt.result == "SUCCESS") {
                            infoData = [{
                                type: "success",
                                class:"deploy",
                                content: `Successful deployed contract '${currentContractName}'. Cost: ${
                                    transactionInfo.receipt.energy_fee
                                        ? toThousands(
                                        transactionInfo.receipt.energy_fee / 1000000
                                        )
                                        : 0
                                    } TRX, ${
                                    transactionInfo.receipt.energy_usage
                                        ? toThousands(transactionInfo.receipt.energy_usage)
                                        : 0
                                    } energy. Transaction confirm here <a href="/#/transaction/${transactionInfo.id}" target='_blank' class="info_link">${transactionInfo.id}</a>`
                            }];

                            CompileStatus.push.apply(CompileStatus,infoData);

                            let base58Adress = tronWeb.address.fromHex(
                                signed.contract_address
                            );
                            infoData = [{
                                type: "success",
                                class:"deploy",
                                content: `Contract address: <a href="/#/contract/${base58Adress}/code" target='_blank' class="info_link"> ${base58Adress}</a>`
                            }];
                            CompileStatus.push.apply(CompileStatus,infoData)


                            let {data} = await xhr.post(`http://18.219.114.60:9016/v1/api/contract/deploy`, {
                                "contractAddress":base58Adress,
                                "contractName":options.name,
                                "optimizer":this.state.optimizer,
                                "runs":'0',
                                "compiler":this.state.compilerVersion,
                                "encodedSolidity":this.state.solidity,
                                "byteCode":options.bytecode,
                                "abi":JSON.stringify(options.abi)

                            })

                            if(data.code == 200){
                                this.setState({
                                    CompileStatus,
                                    deployLoading: false,
                                });
                            }
                        } else if (transactionInfo.receipt.result == "OUT_OF_ENERGY") {
                            infoData = [{
                                type: "error",
                                class:"deploy",
                                content: `FAILED deploying ${currentContractName}. You lost: ${
                                    transactionInfo.receipt.energy_fee
                                        ? toThousands(
                                        transactionInfo.receipt.energy_fee / 1000000
                                        )
                                        : 0
                                    } TRX\nReason: ${tronWeb.toUtf8(
                                    transactionInfo.resMessage
                                )}. Transaction here <a href="/#/transaction/${transactionInfo.id}" class="info_link">${transactionInfo.id}</a>`
                            }];
                            CompileStatus.push.apply(CompileStatus,infoData);
                            this.setState({
                                CompileStatus,
                                deployLoading: false,
                            });

                        } else {
                            infoData = [{
                                type: "error",
                                content: `FAILED deploying ${currentContractName}.\nView transaction here <a href="/#/transaction/${transactionInfo.id}" class="info_link">${transactionInfo.id}</a>`
                            }];
                            CompileStatus.push.apply(CompileStatus,infoData);
                            this.setState({
                                CompileStatus,
                                deployLoading: false,
                            });
                        }
                    }
                } while (!transactionInfo.id);
            } else {
                infoData = [{
                    type: "error",
                    content: `FAILED to broadcast ${currentContractName} deploy transaction \n${broadcastResult.code}\n${tronWeb.toUtf8(broadcastResult.message)}./>`
                }];
                CompileStatus.push.apply(CompileStatus,infoData);
                this.setState({
                    CompileStatus,
                    deployLoading: false,
                });
            }

        } catch (e) {

            let errorData = [{
                type: "error",
                content: `Deploy fail! Error: ${e.toString()}`
            }]

            CompileStatus.push.apply(CompileStatus,errorData)
            this.setState({
                CompileStatus,
                deployLoading: false,
            });
        }
        this.setState({
            deployLoading: false,
        });
    }

    render() {
        let {modal, loading, code, filter, compileLoading, deployLoading, CompileStatus } = this.state;
        const options = {
            selectOnLineNumbers: true
        };
        return (
            <main className="container header-overlap ">
                {modal}
                <div className="row">
                    <div className="col-sm-12">
                        <div className="compile-button-box">
                            <div className={filter.direction == 'compile'?'compile-button active':'compile-button'} onClick={() => this.onRadioChange('compile')}> {tu('contract_deployment')}</div>
                            <div className={filter.direction == 'verify'?'compile-button active ml-4':'compile-button ml-4'} onClick={() => this.onRadioChange('verify')}>{tu('contract_verification')}</div>
                        </div>
                       
                        {
                            filter.direction == 'compile' ?
                        <div>
                            <div className="compile-text mt-4">
                                {tu('contract_deploy_info')}
                            </div>
                        <div className="card mt-4">
                            <div className="card-body">
                                <div className="d-flex contract-compiler">
                                            <div className="pt-3">
                                                <MonacoEditor
                                                    width="1110"
                                                    height="760"
                                                    language="sol"
                                                    theme="vs-dark"
                                                    value={code}
                                                    options={options}
                                                    onChange={this.onChange}
                                                    editorDidMount={this.editorDidMount}
                                                />
                                                <div>
                                                    <CompilerConsole  CompileStatus={CompileStatus}/>
                                                </div>
                                                <div className="contract-compiler-button">
                                                    <Button
                                                        loading={compileLoading}
                                                        onClick={this.compileModal}
                                                        className="compile-button compile"
                                                    >
                                                        {tu('contract_deployment_btn_compile')}
                                                    </Button>
                                                    <Button
                                                        loading={deployLoading}
                                                        onClick={this.deployModal}
                                                        className="compile-button active ml-4"
                                                    >
                                                        {tu('contract_deployment_btn_deploy')}
                                                    </Button>
                                                </div>
                                            </div>
                                </div>
                            </div>
                        </div>
                        </div>
                        :
                                            <VerifyContractCode/>
                                    }
                    </div>
                </div>
            </main>
        )
    }
}

function mapStateToProps(state) {


    return {

    };
}

const mapDispatchToProps = {
};

export default injectIntl(ContractCompiler);