var mysql = require('mysql')
var config = require('./config')

var connection

class Database {
  constructor() {
    this.connection = mysql.createPool(
      {
        ...config.get('database'),
      },
      (err) => {
        if (err) {
          console.log('yikes, database is not operating')
        }
      },
    )
  }

  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, args, (err, results) => {
        if (err) {
          return reject(err)
        }
        resolve(results)
      })
    })
  }
}

module.exports = {
  getConnection: () => {
    if (connection) {
      return connection
    } else {
      connection = new Database()
      return connection
    }
  },
}
