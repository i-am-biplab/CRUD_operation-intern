// productRoutes.js
const express = require('express');
const router = express.Router();
const sqldb = require('../db/conn');
const verifyToken = require('../middleware/verifyToken');
const upload = require("../middleware/uploadFile");

// Route to get products based on user's uid
router.post("/products", verifyToken, (req, res) => {
    const uid = req.uid;

    const fetchDataQuery = "SELECT pid, product, filepath FROM products WHERE uid = ? AND isactive = 'y'";
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
router.post("/products/addnew", verifyToken, upload.single("pic"), (req, res) => {
    const uid = req.uid;
    const product = req.body.product;
    const filepath = req.file.path;

    if (!product) {
        return res.status(400).json({ error: "Product is required in the request body" });
    }

    const insertProductQuery = "INSERT INTO products (uid, product, filepath) VALUES (?, ?, ?)";
    const values = [uid, product, filepath];

    sqldb.query(insertProductQuery, values, (err, results) => {
        if (err) {
            console.error("Error executing MySQL query:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.status(201).json({"isadded": true, "message": "Product added successfully" });
    });
});

// Route to update a product for a user
router.post("/products/update/:productId", verifyToken, upload.single("pic"), (req, res) => {
    const uid = req.uid;
    const productId = req.params.productId;
    const updatedProduct = req.body.product;
    const filepath = req.file.path;

    if (!updatedProduct) {
        return res.status(400).json({ error: "Product is required in the request body" });
    }

    const updateProductQuery = "UPDATE products SET product = ?, filepath = ? WHERE uid = ? AND pid = ?";
    const values = [updatedProduct, filepath, uid, productId];

    sqldb.query(updateProductQuery, values, (err, results) => {
        if (err) {
            console.error("Error executing MySQL query:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.status(200).json({"isupdated": true, "message": "Product updated successfully" });
    });
});

// Route to "soft delete" a product (set isactive to 'n')
router.post("/products/delete/:productId", verifyToken, (req, res) => {
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

module.exports = router;