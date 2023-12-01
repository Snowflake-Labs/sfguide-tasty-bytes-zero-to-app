/**************************************
 * 
 * app.js
 * 
 * Main Node Express app file that sets
 * up the server, defines the routes and
 * adds additional routes defined in files
 * from /routes folder
 * 
 **************************************/
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 4.2.1 Set up the connection to Snowflake
var connection = require('./connect.js')
// 4.2.4 Definition of sql queries to execute
var sql_queries = require('./sql')

// Helpers for parsing dates and loggin requests
var utils = require('./utils')

const login = require('./routes/login.js')

// Create a new Express app
const app = express();

// Enable environment variables in .env file
dotenv.config()

// 4.5.1 add CORS to the app

// Start the server
const port = 3000
app.listen(port, () => {
    console.log("Server running on port " + port);
});

// Add additional middleware (json response output, request logging )
app.use(express.json())
app.use(utils.logRequest);

// 4.4.2 Add helpers for authenetication and tokens
var auth = require('./auth')
// 4.4.3 Add routes for login
app.use("/", login);

app.post("/login", async (req, res) => {
    if(!req.body.name || !req.body.password ) {
        res.status(422).send("Incorrect data")
        return
    }

    const login_user = req.body.name
    const login_password = req.body.password
    connection.execute({
        sqlText: sql_queries.verify_user,
        binds: [login_user],
        complete: (err, stmt, rows) => {
            if (err) {
                console.error('Unable to validate user', err);
                res.status(500).json({ error: 'Unable to validate user' })
                return
            } else {
                if (rows.length == 0){
                    console.log('User does not exist: ' + login_user)
                    res.status(401).json('Invalid user or password')
                    return
                } else {
                    user_row = rows[0]
                    user_name = user_row.USER_NAME
                    hashed_password = user_row.HASHED_PASSWORD
                    franchise_id = user_row.FRANCHISE_ID                    
                    bcrypt.compare(login_password, hashed_password, function(err, result) {
                        if (err){
                            console.log('Failed to check password for: ' + login_user + ' - ' + err.message)
                            res.status(401).json('Invalid user or password')
                            return
                        }
                        if (result){
                            console.log('Successful login, generating token for: ' + user_name + ', franchise: ' + franchise_id)
                            const accessToken = auth.generateAccessToken({ user: req.body.name, franchise: franchise_id })
                            const refreshToken = auth.generateRefreshToken({ user: req.body.name, franchise: franchise_id })
                            res.json({ accessToken: accessToken, refreshToken: refreshToken })
                            return
                        }
                        console.log('Incorrect password for user: ' + login_user)
                        res.status(401).json('Invalid user or password')
                        return
                    });
                }
            }
        },
    });
});

app.post("/refresh", (req, res) => {
    if (!req.body.token)
        res.status(422).send("Incorrect data")
    if (!auth.refreshTokens.includes(req.body.token))
        res.status(400).send("Refresh Token Invalid")
    auth.refreshTokens = auth.refreshTokens.filter((c) => c != req.body.token)
    //remove the old refreshToken from the refreshTokens list
    const accessToken = auth.generateAccessToken({ user: req.body.token.user, franchise: req.body.token.franchise })
    const refreshToken = auth.generateRefreshToken({ user: req.body.token.user, franchise: req.body.token.franchise })
    //generate new accessToken and refreshTokens
    res.json({ accessToken: accessToken, refreshToken: refreshToken })
});

// 4.4.4 Add validation of tokens to each route
app.use(auth.validateToken);

// Definition of first route
app.get("/", (req, res, next) => {
    console.log(req.method + ': ' + req.path);
    // 4.2.3 Connect to Snowflake and return query result
    connection.execute({
        sqlText: sql_queries.all_franchise_names,
        complete: (err, stmt, rows) => {
            if (err) {
                console.error('Unable to retrieve franchises', err);
                res.status(500).json({ error: 'Unable to retrieve franchises' });
            } else {
                res.status(200).json(rows);
            }
        },
    });
});

// 4.3.1 Add franchise routes
// 4.3.6 Add remaining franchise routes
