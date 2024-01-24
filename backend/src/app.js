require('dotenv').config();
const sqldb = require("./db/conn");
const express = require("express");
const cors = require('cors');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const verifyToken = require("./middleware/verifyToken");

const port = process.env.PORT || 8000;

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.post("/tokenvalidate", (req, res) => {
    const token = req.body.authToken;

    if (!token) {
        return res.status(403).json({"isvalid": false, error: "No Token Found" });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({"isvalid": false, error: "Token Verification Error" });
        }

        const uid = decoded.uid;

        const fetchDataQuery = "SELECT uid FROM users WHERE uid = ?";
        const value = [uid];
        sqldb.query(fetchDataQuery, value, (err, results) => {
            if (err) {
                console.error("Error while querying the data:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
        
            if (results.length === 0) {
                return res.status(500).json({ error: "User not found in the database" });
            }
            res.status(200).json({"isvalid": true, "message": "Authorized User"});
        });
    });
});

// Route to signup the user
app.post("/signup", async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        const email = req.body.email;

        const checkEmailQuery = "SELECT uid, email FROM users WHERE email = ?";
        const checkEmailValues = [email];

        sqldb.query(checkEmailQuery, checkEmailValues, async (err, result) => {
            if (err) {
                console.log("Error while querying the data: ", err);
                res.status(500).json({"error": "Internal Server Error"});
                return;
            }

            if (result.length > 0) {
                res.send("Email already registered");
                res.status(409).json({"message": "Email already registered"});
            } else {
                if (password === cpassword) {
                    const firstname = req.body.firstname;
                    const lastname = req.body.lastname;
                    const hashedPassword = await bcrypt.hash(password, 12);

                    const insertDataQuery = "INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)";
                    const insertDataValues = [firstname, lastname, email, hashedPassword];

                    sqldb.query(insertDataQuery, insertDataValues, (err, result) => {
                        if (err) {
                            console.log("Error while inserting the data: ", err);
                            res.status(500).json({"error": "Internal Server Error"});
                            return;
                        }

                        const getUserUidQuery = "SELECT uid FROM users WHERE email = ?";
                        const getUserUidValues = [email];

                        sqldb.query(getUserUidQuery, getUserUidValues, (err, result) => {
                            if (err) {
                                console.log("Error while querying the data: ", err);
                                res.status(500).json({"error": "Internal Server Error"});
                                return;
                            }

                            const userUid = result[0].uid;
                            const token = jwt.sign({ uid: userUid }, process.env.SECRET_KEY, { expiresIn: "1d" });
                            console.log(token);

                            res.status(201).json({"issignedup": true, 
                                                    "message": "Signed Up Successfully",
                                                    "token": token});
                        });
                    });
                } else {
                    res.status(401).json({"message": "Password not matching"});
                }
            }
        });
    } catch (err) {
        console.log("Unexpected error: ", err);
        res.status(500).json({"error": "Internal Server Error"});
    }
});

// Route to login the user
app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const fetchDataQuery = "SELECT uid, password FROM users WHERE email = ?";
        const value = [email];
        sqldb.query(fetchDataQuery, value, async (err, results) => {
            if (err) {
                console.log("Error while quering the data: ", err);
                res.status(500).json({"error": "Internal Server Error"});
                return;
            }

            if (results.length === 0) {
                res.status(404).json({"message": "User not found"});
                return;
            }

            // console.log(results);
            const userUid = results[0].uid;
            const userPassword = results[0].password;

            try {
                const isMatch = await bcrypt.compare(password, userPassword);

                if (isMatch) {
                    const token = jwt.sign({ uid: userUid }, process.env.SECRET_KEY, { expiresIn: "1d" });
                    console.log(token);
                    // res.send("Logged In successfully");
                    res.status(200).json({"isloggedin": true, 
                                            "message": "Logged In successfully",
                                            "token": token});
                } else {
                    res.status(401).json({"message": "Invalid Credentials"});
                }
            } catch (bcryptError) {
                console.log("Error comparing passwords: ", bcryptError);
                res.status(500).json({"error": "Internal Server Error"});
            }
        });
    } catch (error) {
        console.log("Unexpected error: ", error);
        res.status(500).json({"error": "Internal Server Error"});
    }
});

// Route to get products based on user's uid
app.post("/products", verifyToken, (req, res) => {
    const uid = req.uid;

    const fetchDataQuery = "SELECT pid, product FROM products WHERE uid = ? AND isactive = 'y'";
    const value = [uid];
    sqldb.query(fetchDataQuery, value, (err, results) => {
        if (err) {
            console.error("Error executing MySQL query:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.json({"isvalid": req.isvalid, "message": req.message, "products": results });
    });
});

// Route to add products for a user
app.post("/products/addnew", verifyToken, (req, res) => {
    const uid = req.uid;
    const product = req.body.product;

    if (!product) {
        return res.status(400).json({ error: "Product is required in the request body" });
    }

    const insertProductQuery = "INSERT INTO products (uid, product) VALUES (?, ?)";
    const values = [uid, product];

    sqldb.query(insertProductQuery, values, (err, results) => {
        if (err) {
            console.error("Error executing MySQL query:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.status(201).json({"isadded": true, "message": "Product added successfully" });
    });
});

// Route to update a product for a user
app.post("/products/update/:productId", verifyToken, (req, res) => {
    const uid = req.uid;
    const productId = req.params.productId;
    const updatedProduct = req.body.product;

    if (!updatedProduct) {
        return res.status(400).json({ error: "Product is required in the request body" });
    }

    const updateProductQuery = "UPDATE products SET product = ? WHERE uid = ? AND pid = ?";
    const values = [updatedProduct, uid, productId];

    sqldb.query(updateProductQuery, values, (err, results) => {
        if (err) {
            console.error("Error executing MySQL query:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.status(200).json({"isupdated": true, "message": "Product updated successfully" });
    });
});

// Route to "soft delete" a product (set isactive to 'n')
app.post("/products/delete/:productId", verifyToken, (req, res) => {
    const uid = req.uid;
    const productId = req.params.productId;

    const softDeleteQuery = "UPDATE products SET isactive = 'n' WHERE uid = ? AND pid = ?";
    const values = [uid, productId];

    sqldb.query(softDeleteQuery, values, (err, results) => {
        if (err) {
            console.error("Error executing MySQL query:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.status(200).json({"isdeleted": true, "message": "Product deleted successfully" });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});