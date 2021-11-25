const express = require('express');
const router = express.Router();

/* ===== 홈페이지 =====
 *
*/
router.get('/', function (req, res, next) {
    res.send("home");
});

module.exports = router;
