import moment from "moment"


export function getData(nameCoin, interval) {
    // Documentation
    // https://binance-docs.github.io/apidocs/spot/en/#kline-candlestick-data
    return fetch(`https://api.binance.com/api/v3/klines?symbol=${nameCoin}&interval=${interval}&limit=500`)
        .then(response => response.json())
        .then(data => {
            return data.map(d => {
                return {date: moment(d[0]).toDate(), open: parseFloat(d[1]), high: parseFloat(d[2]), low: parseFloat(d[3]), close: parseFloat(d[4]),volume: parseFloat(d[5])}
            })
        })
}
