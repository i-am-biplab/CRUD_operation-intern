require('dotenv').config();
const sqldb = require("./db/conn");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const port = process.env.PORT || 8000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.post("/signup", async (req, res) => {
    try {
        let password = req.body.password;
        const confrimPassword = req.body.confirmpassword;

        if (password === confrimPassword)
        {
            const firstname = req.body.firstname;
            const lastname = req.body.lastname;
            const email = req.body.email;
            password = await bcrypt.hash(password, 12);
            console.log(password);

            const insertDataQuery = "INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)";
            const values = [firstname, lastname, email, password];
            sqldb.query(insertDataQuery, values, (err, results) => {
                if (err) {
                    console.log("Error while inserting the data: ", err);
                    return;
                }
                console.log(results);
                
                // sqldb.end();
            });

            const fetchDataQuery = "SELECT uid FROM users WHERE email = ?";
            const value = [email];
            sqldb.query(fetchDataQuery, value, (err, results) => {
                if (err) {
                    console.log("Error while quering the data: ", err);
                    return;
                }
                // console.log(results);
                userUid = results[0].uid;

                const token = jwt.sign({uid: userUid}, process.env.SECRET_KEY, {expiresIn: "1d"});
                console.log(token);

                res.send("Signed Up Successfully");

                sqldb.end();
            });
        }
        else
        {
            res.send("Password not matching");
        }
    } catch(err) {
        res.send(err);
    }
});

app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        let userPassword;

        const fetchDataQuery = "SELECT uid, password FROM users WHERE email = ?";
        const value = [email];
        sqldb.query(fetchDataQuery, value, (err, results) => {
            if (err) {
                console.log("Error while quering the data: ", err);
                return;
            }
            // console.log(results);
            userPassword = results[0].password;
            userUid = results[0].uid;

            if (bcrypt.compare(password, userPassword))
            {
                const token = jwt.sign({uid: userUid}, process.env.SECRET_KEY, {expiresIn: "1d"});
                console.log(token);
                res.send("Logged In successfully");
            }
            else
            {
                res.send("Invalid Credentials");
            }
            sqldb.end();
        });
    } catch (error) {
        res.send(error);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});