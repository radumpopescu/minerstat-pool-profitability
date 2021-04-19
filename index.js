const axios = require('axios')
const schedule = require('node-schedule')
const influxLog = require('./influx')

async function makeRequest({url, method, headers, data}) {
  let response = {}
  try {
    response = await axios({
      method: method || 'get',
      url,
      headers,
      data,
      responseType: 'json',
    })
  } catch (e) {
    console.error("error",e)
  }
  return response
}

function processShit(data) {
    var jsonData = {};
    const hashrateVal = 100000000
    const poolFee = 0
    const exchangeRate = 1
    const elVal = 0.16
    const powerVal = 700

    var previouslyAdjusted = 0;
    var oldReward = 0;
    var oldIncome = 0;
    var oldExchange = 0;
    var last1hRewardSum = 0;
    var last24hRewardSum = 0;
    var last7dRewardSum = 0;
    var last1hRewardCount = 0;
    var last24hRewardCount = 0;
    var last7dRewardCount = 0;
    var last1hIncomeSum = 0;
    var last24hIncomeSum = 0;
    var last7dIncomeSum = 0;
    var last1hIncomeCount = 0;
    var last24hIncomeCount = 0;
    var last7dIncomeCount = 0;
    var now = Math.round((new Date()).getTime() / 1000);
    // $.each(data[coinTag], function(timestamp, values) {
    Object.keys(data).forEach(timestamp => {
        let values = data[timestamp]
        // console.log([timestamp,values])

        if (values[0] == '' || values[0] == 'INF') {
            values[0] = 0;
        }
        if (values[1] == '' || values[1] == 'INF') {
            values[1] = 0;
        }
        if (values[2] == '' || values[2] == 'INF') {
            values[2] = 0;
        }
        var rewardTemp = (values[2] * hashrateVal) * (1 - poolFee / 100);
        var incomeTemp = (values[2] * hashrateVal * values[3] * exchangeRate) * (1 - poolFee / 100);
        var exchangeTemp = values[3] * exchangeRate;
        if (rewardTemp > 1000 * oldReward && oldReward != 0 && previouslyAdjusted == 0) {
            rewardTemp = oldReward;
            incomeTemp = oldIncome;
            exchangeTemp = oldExchange;
            previouslyAdjusted = 1;
        } else {
            previouslyAdjusted = 0;
        }
        if (timestamp > now - 1 * 60 * 60) {
            last1hRewardSum += rewardTemp;
            last1hRewardCount += 1;
            last1hIncomeSum += incomeTemp;
            last1hIncomeCount += 1;
        }
        if (timestamp > now - 24 * 60 * 60) {
            last24hRewardSum += rewardTemp;
            last24hRewardCount += 1;
            last24hIncomeSum += incomeTemp;
            last24hIncomeCount += 1;
        }
        if (timestamp > now - 7 * 24 * 60 * 60) {
            last7dRewardSum += rewardTemp;
            last7dRewardCount += 1;
            last7dIncomeSum += incomeTemp;
            last7dIncomeCount += 1;
        }
        oldReward = rewardTemp;
        oldIncome = incomeTemp;
        oldExchange = exchangeTemp;
    });
    
    if (last1hRewardCount > 0) {
        jsonData['last1hReward'] = last1hRewardSum / last1hRewardCount;
    } else {
        jsonData['last1hReward'] = 0;
    }
    if (last1hIncomeCount > 0) {
        jsonData['last1hIncome'] = last1hIncomeSum / last1hIncomeCount;
    } else {
        jsonData['last1hIncome'] = 0;
    }
    jsonData['last1hCosts'] = (elVal * powerVal / 1000);
    jsonData['last1hProfit'] = jsonData['last1hIncome'] - jsonData['last1hCosts'];
    if (last24hRewardCount > 0) {
        jsonData['last24hReward'] = 24 * last24hRewardSum / last24hRewardCount;
    } else {
        jsonData['last24hReward'] = 0;
    }
    if (last24hIncomeCount > 0) {
        jsonData['last24hIncome'] = 24 * last24hIncomeSum / last24hIncomeCount;
    } else {
        jsonData['last24hIncome'] = 0;
    }
    jsonData['last24hCosts'] = 24 * (elVal * powerVal / 1000);
    jsonData['last24hProfit'] = jsonData['last24hIncome'] - jsonData['last24hCosts'];
    if (last7dRewardCount > 0) {
        jsonData['last7dReward'] = 7 * 24 * last7dRewardSum / last7dRewardCount;
    } else {
        jsonData['last7dReward'] = 0;
    }
    if (last7dIncomeCount > 0) {
        jsonData['last7dIncome'] = 7 * 24 * last7dIncomeSum / last7dIncomeCount;
    } else {
        jsonData['last7dIncome'] = 0;
    }
    jsonData['last7dCosts'] = 7 * 24 * (elVal * powerVal / 1000);
    jsonData['last7dProfit'] = jsonData['last7dIncome'] - jsonData['last7dCosts'];
    jsonData['currentReward'] = 24 * oldReward;
    jsonData['currentIncome'] = 24 * oldIncome;
    jsonData['currentCosts'] = 24 * (elVal * powerVal / 1000);
    jsonData['currentProfit'] = jsonData['currentIncome'] - jsonData['currentCosts'];
    
    return jsonData
    // console.log(jsonData)
    /**
        last1hReward: 0.00021224861398243085, // ETH
        last1hIncome: 0.4725560254679617, // USD
        last1hCosts: 0.112,
        last1hProfit: 0.3605560254679617,
        last24hReward: 0.0050743935834483425, // ETH
        last24hIncome: 11.352938158641267, // USD
        last24hCosts: 2.688,
        last24hProfit: 8.664938158641267,
        last7dReward: 0.03423364554343821,  // ETH
        last7dIncome: 80.59533634293923, // USD
        last7dCosts: 18.816,
        last7dProfit: 61.77933634293923,
        currentReward: 0.0051121616793376795, // ETH
        currentIncome: 11.370201098378887, // USD
        currentCosts: 2.688,
        currentProfit: 8.682201098378886
     */
}


async function getStats(coin, name) {
  const response = await makeRequest({
    url: `https://api.minerstat.com/v2/coins-history?coin=${coin.replace(' ','%20')}&algo=Ethash`
  })
  const data = processShit(response.data[coin])
  let logs = []
  logs[`${name}1hEth`] = data.last1hReward
  logs[`${name}1hUsd`] = data.last1hIncome
  logs[`${name}24hEth`] = data.last24hReward
  logs[`${name}24hUsd`] = data.last24hIncome
  logs[`${name}7dEth`] = data.last7dReward
  logs[`${name}7dUsd`] = data.last7dIncome

  return logs
//   console.log(response.data)
}

async function update() {
    let toLog = {}

    try {
        const rates = await getStats('FLEXPOOL ETH', 'flexPool')
        toLog = {...toLog, ...rates}
    } catch (e) {console.log(e.error)}
    try {
        const rates = await getStats('EZIL ETH', 'ezil')
        toLog = {...toLog, ...rates}
    } catch (e) {console.log(e.error)}
    try {
        const rates = await getStats('HIVEON ETH', 'hiveon')
        toLog = {...toLog, ...rates}
    } catch (e) {console.log(e.error)}
    try {
        const rates = await getStats('F2POOL ETH', 'f2pool')
        toLog = {...toLog, ...rates}
    } catch (e) {console.log(e.error)}
//   console.log(toLog)
    influxLog(toLog)
}

;(async () => {
// update()
  schedule.scheduleJob(`0 * * * * *`, update)
})()
