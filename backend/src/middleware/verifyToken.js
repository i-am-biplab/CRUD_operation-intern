const jwt = require("jsonwebtoken");
const sqldb = require("../db/conn");

// Middleware to verify JWT token from the cookie

// for getting token from postman
const verifyToken = (req, res, next) => {
    let token;
    const {authorization} = req.headers;

    try{
        if(authorization && authorization.startsWith('Bearer')){
            token=authorization.split(' ')[1];
            jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
                if (err) {
                    return res.status(403).json({ error: "Unauthorized" });
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
        
                    req.uid = decoded.uid;
                    next();
                });
            });
        }
    }
    catch (error) {
        console.log(error);
    }
};

// for getting token from browser cookie
// const verifyToken = (req, res, next) => {
    // const token = req.cookies.jwt;

    // if (!token) {
    //     return res.status(403).json({ error: "Unauthorized" });
    // }

    // jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    //     if (err) {
    //         return res.status(403).json({ error: "Unauthorized" });
    //     }

    //     const uid = decoded.uid;

    //     const fetchDataQuery = "SELECT uid FROM users WHERE uid = ?";
    //     const value = [uid];
    //     sqldb.query(fetchDataQuery, value, (err, results) => {
    //         if (err) {
    //             console.error("Error while querying the data:", err);
    //             return res.status(500).json({ error: "Internal Server Error" });
    //         }
        
    //         if (results.length === 0) {
    //             return res.status(500).json({ error: "User not found in the database" });
    //         }

    //         req.uid = decoded.uid;
    //         next();
    //     });
    // });
// };

module.exports = verifyToken;