// const {webkit} = require('playwright')
// const influxLog = require('./influx')

// function computeValues(reward, income) {
//   const parts = income.split('\n')
//   return {
//     eth: parseFloat(reward.replace(" ETH","")),
//     usd: parseFloat(parts[0].replace(" USD","")),
//     btc: parseFloat(parts[1].replace(" BTC",""))
//   }
// }

// async function generateLogs(context, name, url) {
//   const page = await context.newPage()
//   await page.goto(url)
//   await page.waitForLoadState('networkidle');

//   const logs = {}
//   let rewards = {}
//   let one = await (await page.$("#last1hReward")).innerText()
//   let two = await (await page.$("#last1hIncome")).innerText()
//   rewards["1h"] = computeValues(one, two)
//   logs[`${name}1hEth`] = rewards["1h"]['eth']
//   logs[`${name}1hUsd`] = rewards["1h"]['usd']
//   logs[`${name}1hBtc`] = rewards["1h"]['btc']
  
//   one = await (await page.$("#last24hReward")).innerText()
//   two = await (await page.$("#last24hIncome")).innerText()
//   rewards["24h"] = computeValues(one, two)
//   logs[`${name}24hEth`] = rewards["24h"]['eth']
//   logs[`${name}24hUsd`] = rewards["24h"]['usd']
//   logs[`${name}24hBtc`] = rewards["24h"]['btc']
  
//   one = await (await page.$("#last7dReward")).innerText()
//   two = await (await page.$("#last7dIncome")).innerText()
//   rewards["7d"] = computeValues(one, two)
//   logs[`${name}7dEth`] = rewards["7d"]['eth']
//   logs[`${name}7dUsd`] = rewards["7d"]['usd']
//   logs[`${name}7dBtc`] = rewards["7d"]['btc']
  
//   console.log({[name]:rewards})
//   return logs
// }

// ;(async () => {
//   const browser = await webkit.launch({headless: true})
//   const context = await browser.newContext()
  
//   const flexLogs = await generateLogs(context, 'flexPool', 'https://minerstat.com/coin/FLEXPOOL-ETH')
//   const ezilLogs = await generateLogs(context, 'ezil', 'https://minerstat.com/coin/EZIL-ETH')
//   const hiveonLogs = await generateLogs(context, 'hiveon', 'https://minerstat.com/coin/HIVEON-ETH')
//   const f2poolLogs = await generateLogs(context, 'f2pool', 'https://minerstat.com/coin/F2POOL-ETH')
  
//   const allLogs = {
//     ...flexLogs,
//     ...ezilLogs,
//     ...hiveonLogs,
//     ...f2poolLogs,
//   }
//   console.log(allLogs)
//   // influxLog(allLogs)

//   await browser.close() 
// })()
