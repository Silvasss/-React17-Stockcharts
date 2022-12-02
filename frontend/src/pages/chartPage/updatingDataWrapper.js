import React from "react"
import moment from "moment"

import {getData} from "./utils"
import {socket2} from "../../context/socket"

import FormRowSelect from "../../components/FormRowSelect"


function getDisplayName(ChartComponent) {
    return ChartComponent.displayName || ChartComponent.name || "ChartComponent"
}


export default function updatingDataWrapper(ChartComponent) {
    // WebSocket variables
    let socket, uniqueConnection

    class UpdatingComponentHOC extends React.Component {
        constructor(props) {
            super(props)

            this.state = {
                data: this.props.data,
                optionTimeCoin: '',
                optionNameCoin: 'BTCUSDT'
            }
        }

        componentDidMount() {
            document.addEventListener("keyup", this.onKeyPress)

            uniqueConnection = false
        }

        componentWillUnmount() {
            if (this.interval) clearInterval(this.interval)
            document.removeEventListener("keyup", this.onKeyPress)
        }

        // Save selected currency
        changeOptionNameCoin = (e) => {
            if (e.target.value !== this.state.optionNameCoin) {
                this.newHistoryData(e.target.value, '1d')
            }
        }

        // Get new historical data
        newHistoryData(nameCoin, interval) {
            getData(nameCoin, interval).then(data => {
                this.setState({
                    data: data,
                    optionNameCoin: nameCoin
                })
            })
        }

        // Websocket status check
        connectionStatusWithWebsocket() {
            socket = socket2

            if (uniqueConnection) {
                socket.emit("exit", (''))

                uniqueConnection = false
            }
        }

        // Adding new values in real time
        updateHistoryData(nameCoin, interval) {
            socket.emit("changeCurrencyCoin", ([nameCoin, interval]))

            socket.on('KLINE', (d) => {
                const { data } = this.state

                if(!d['final']) {
                    // new Candlestick
                    data[data.length - 1] = {date: moment(d[0]).toDate(), open: d['open'], high: d['high'], low: d['low'], close: d['close'], volume: d['volume']}

                    this.setState({ data })
                } else {
                    const newCandlestick = {date: moment(d[0]).toDate(), open: d['open'], high: d['high'], low: d['low'], close: d['close'], volume: d['volume']}

                    if (moment(data[data.length - 1]['date']).format('h:mm:ss') !== moment(newCandlestick.date).format('h:mm:ss')) {
                        data.push(newCandlestick)

                        this.setState({ data })
                    }
                }
            })

            if (socket.connected) {
                uniqueConnection = true
            }
        }

        updateIntervalHistoryData = (e) => {
            const { optionNameCoin } = this.state

            switch (e.target.value) {
                case "0":
                    this.newHistoryData(optionNameCoin, '1m')

                    this.connectionStatusWithWebsocket()

                    setTimeout(() => {
                        this.updateHistoryData(optionNameCoin, '1m')
                    }, 1000)

                    break
                case "1":
                    this.newHistoryData(optionNameCoin, '5m')

                    this.connectionStatusWithWebsocket()

                    setTimeout(() => {
                        this.updateHistoryData(optionNameCoin, '5m')
                    }, 1000)

                    break
                case "2":
                    this.newHistoryData(optionNameCoin, '15m')

                    this.connectionStatusWithWebsocket()

                    setTimeout(() => {
                        this.updateHistoryData(optionNameCoin, '15m')
                    }, 1000)

                    break
                case "3":
                    this.newHistoryData(optionNameCoin, '1h')

                    this.connectionStatusWithWebsocket()

                    setTimeout(() => {
                        this.updateHistoryData(optionNameCoin, '1h')
                    }, 1000)

                    break
                case "4":
                    this.newHistoryData(optionNameCoin, '4h')

                    this.connectionStatusWithWebsocket()

                    setTimeout(() => {
                        this.updateHistoryData(optionNameCoin, '4h')
                    }, 1000)

                    break
                case "5":
                    this.newHistoryData(optionNameCoin, '1d')

                    this.connectionStatusWithWebsocket()

                    setTimeout(() => {
                        this.updateHistoryData(optionNameCoin, '1d')
                    }, 1000)

                    break
                default :
            }

            this.setState({
                optionTimeCoin: e.target.value
            })
        }

        render() {
            const { type } = this.props

            const { data } = this.state

            return (
                    <div>
                        <FormRowSelect name='selectCoin' handleChange={this.changeOptionNameCoin.bind(this)} list={['BTCUSDT', 'ETHUSDT']}/>

                        <FormRowSelect name='selectTime' handleChange={this.updateIntervalHistoryData.bind(this)} list={['X', 0, 1, 2, 3, 4, 5]} />

                        <ChartComponent ref="component" data={data} type={type} />
                    </div>
                )
        }
    }
    UpdatingComponentHOC.defaultProps = {
        type: "svg",
    };
    UpdatingComponentHOC.displayName = `updatingDataWrapper(${ getDisplayName(ChartComponent) })`;

    return UpdatingComponentHOC;
}