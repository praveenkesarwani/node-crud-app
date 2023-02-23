const express = require('express');
const router = express.Router();

const itemRoutes = require('./itemRoutes');

router.use('/items', itemRoutes);

module.exports = router;
