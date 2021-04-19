require('dotenv').config()

const Influx = require('influx')
const database = 'mining'
const measurement = 'stats'
const influx = new Influx.InfluxDB({
  host: process.env.INFLUX_HOST,
  database,
  username: process.env.INFLUX_USER,
  password: process.env.INFLUX_PASS,
  schema: [
    {
      measurement,
      fields: {
        flexPool1hEth: Influx.FieldType.FLOAT,
        flexPool1hUsd: Influx.FieldType.FLOAT,
        flexPool24hEth: Influx.FieldType.FLOAT,
        flexPool24hUsd: Influx.FieldType.FLOAT,
        flexPool7dEth: Influx.FieldType.FLOAT,
        flexPool7dUsd: Influx.FieldType.FLOAT,
        
        ezil1hEth: Influx.FieldType.FLOAT,
        ezil1hUsd: Influx.FieldType.FLOAT,
        ezil24hEth: Influx.FieldType.FLOAT,
        ezil24hUsd: Influx.FieldType.FLOAT,
        ezil7dEth: Influx.FieldType.FLOAT,
        ezil7dUsd: Influx.FieldType.FLOAT,
        
        hiveon1hEth: Influx.FieldType.FLOAT,
        hiveon1hUsd: Influx.FieldType.FLOAT,
        hiveon24hEth: Influx.FieldType.FLOAT,
        hiveon24hUsd: Influx.FieldType.FLOAT,
        hiveon7dEth: Influx.FieldType.FLOAT,
        hiveon7dUsd: Influx.FieldType.FLOAT,
        
        f2pool1hEth: Influx.FieldType.FLOAT,
        f2pool1hUsd: Influx.FieldType.FLOAT,
        f2pool24hEth: Influx.FieldType.FLOAT,
        f2pool24hUsd: Influx.FieldType.FLOAT,
        f2pool7dEth: Influx.FieldType.FLOAT,
        f2pool7dUsd: Influx.FieldType.FLOAT,
      },
      tags: [],
    },
  ],
})
influx
  .getDatabaseNames()
  .then((names) => {
    if (!names.includes(database)) {
      return influx.createDatabase(database)
    }
  })
  .catch((err) => {
    console.error(`Error creating Influx database!`)
  })

function influxLog(logs) {
  console.log("toInflux", logs)
  Object.keys(logs).forEach((name) => {
    const value = logs[name]
    // console.log({name, value})
    influx
      .writePoints([
        {
          measurement,
          // tags: {},
          fields: {[name]: value},
        },
      ])
      .catch((err) => {
        console.log(`Error saving data to InfluxDB! ${err.stack}`)
      })
  })
}

module.exports = influxLog
