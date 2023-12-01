/**************************************
 * 
 * connect.js
 * 
 * This file set's up the connection to
 * Snowflake using the environment var-
 * iables from the .env file
 * 
 **************************************/
const snowflake = require('snowflake-sdk');
const dotenv = require('dotenv');

// Enable environment variables in .env file
dotenv.config()

var crypto = require('crypto');
var fs = require('fs');

// 4.2.2 get connection details from environment variables
// TODO move this into QS
const options = {
    account: process.env.SNOWFLAKE_ACCOUNT,
    database: process.env.SNOWFLAKE_DATABASE,
    schema: process.env.SNOWFLAKE_SCHEMA,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE,
};

if (process.env.AUTH === 'CONTAINER') {
    options.authenticator = "OAUTH";
    options.host = process.env.SNOWFLAKE_HOST;
    options.accessUrl = 'https://' + process.env.SNOWFLAKE_HOST;
    options.token = fs.readFileSync('/snowflake/session/token', 'ascii');
} else {
    var privateKeyObject = crypto.createPrivateKey({
        key: fs.readFileSync('/mnt/private.p8'),
        format: 'pem'
    });
    var privateKey = privateKeyObject.export({
        format: 'pem',
        type: 'pkcs8'
    });
    options.authenticator = "SNOWFLAKE_JWT";
    options.privateKey = privateKey;
    options.username = process.env.SNOWFLAKE_USERNAME
}

console.log(options);
// 4.2.3 create the connection to the Snowflake account
// TODO move this into QS

const connection = snowflake.createConnection(options);
connection.connect((err, conn) => {
    if (err) {
        console.error('Unable to connect to Snowflake', err);
    } else {
        console.log('Connected to Snowflake account ' + options.account);
    }
});

module.exports = connection;