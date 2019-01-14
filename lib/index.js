"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
app.get('/', (req, res) => {
    res.send('OK');
});
app.listen(3000, () => {
    console.log('Listening on Port 3000');
});
