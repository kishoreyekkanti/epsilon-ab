var mysql = require('mysql');
var logger = require(global._ROOT + '/log/logger');
module.exports = {
    "executeQuery": function (connectionPool, sql, paramValue, callback) {
        connectionPool.getConnection(function (err, connection) {
            if (err) {
                console.log("Mysql Connection Pool Error: ", err);
                callback(err, null);
                return;
            }
            connection.query(sql, paramValue, function (err, rows, fields) {
                try {
                    if (err) {
                        console.log("Mysql Query Error: ", err);
                        callback(err, rows);
                        return;
                    }
                    callback(err, rows);
                } catch (e) {
                    console.log("Mysql Query Error: ", e);
                    callback(err, rows);
                } finally {
                    connection.release();
                }
            });
        });
    },
    "executeQueryWithPromise": function(mysqlConnectionPool, sql, paramValue, reject, resolve){
        this.executeQuery(mysqlConnectionPool, sql, paramValue, function (err, rows) {
            if (err) {
                logger.error("Error in fetching details: ", sql, paramValue, err);
                reject();
            }
            resolve(rows);
        });
    }
};