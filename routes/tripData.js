const router = require('express').Router()
const fs=require('fs');
const { json } = require('sequelize');
const { getTripData } = require('../dbQueries/dataGet');
router.get('/historic',async(req,res)=>{
    console.log("GET /getData")
    const {date}= req.query;
    console.log(date);
    try{
      const result = await getTripData(date);
      return res.json({success:true, result});
    }
    catch(err)
    {
      return res.json({success:false})
    }
  })

  // API endpoint to get the data from data.json
router.get('/live', (req, res) => {
    // const deviceId = req.params.deviceId;
    // const fileName = `${deviceId}.json`;
    const fileName='EKL_02 .json';
    fs.readFile(fileName, 'utf8', (err, data_) => {
      if (err) {
        return res.status(500).json({ error: `${"Failed to read file"}` });
      }
  
      // Parse the data and return the 'data' array for the device
      const jsonData = JSON.parse(data_);
      console.log(typeof jsonData);
    //   console.log(jsonData["EKL_02 "].data);
      res.json(jsonData["EKL_02 "].data || []);
    });
  });

  module.exports = router;