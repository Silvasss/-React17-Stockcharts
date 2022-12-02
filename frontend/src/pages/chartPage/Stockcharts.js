import React from 'react'
import moment from "moment"

import Chart from "./Chart";


export default class Stockcharts extends React.Component {
    componentDidMount() {
        fetch("https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=500").then(res => res.json())
            .then(data => {
                const cdata = data.map(d => {
                    return {date: moment(d[0]).toDate(), open: parseFloat(d[1]), high: parseFloat(d[2]), low: parseFloat(d[3]), close: parseFloat(d[4]), volume: parseFloat(d[5]), }
                })

                this.setState({
                    data: cdata
                })
            })
    }

    render() {
        if (this.state == null) {
            return <div>Loading...</div>
        }

        return (
            <Chart type={"hybrid"} data={this.state.data} />
        )
    }
}