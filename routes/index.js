const express = require('express');
const router = express.Router();

// Home page route
router.get('/', (req, res) => {
    res.render('index', { 
        title: 'Anti classifier prompt - Safe Prompt Generator',
        creator: 'Abdelilah ELAZIRI'
    });
});

module.exports = router;