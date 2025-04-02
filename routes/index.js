const router = require('express').Router()
router.get("/", (req, res) => {
    console.log("GET / request");
    res.status(200).json({ success: true, message: "Welcome to the backend." });
});

router.use('/tripData', require("./tripData.js"))

module.exports = router