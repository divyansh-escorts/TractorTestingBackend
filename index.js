// Import statements remain the same
// Initialize Express app
const express = require("express");
const app = express();
const fs= require('fs')
require('./iotConnection/dataLogger.js')
const dotenv = require('dotenv');
dotenv.config();


// Import other modules
require("./middlewares/dbConnection");
const fetchSecrets = require("./middlewares/fetchSecrets");
// const { IpFilter, IpDeniedError } = require('express-ipfilter');
// const ipArray = require("./middlewares/blockedIPs");

// CORS Middleware
// var cors = require("cors");
// app.use(cors());
var https = require('https')

// const allowedOrigins = ['https://www.eklfdc.com', 'http://localhost:3000']; // Add localhost for testing

// app.use(cors({
//   origin: function (origin, callback) {
//     if (origin || allowedOrigins.includes(origin)) {
//       console.log(origin)
//       callback(null, true);
//     } else {  
//       console.log(origin)
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true
// }));

// IP Filtering Middleware (place early)
// app.use(IpFilter(ipArray, { log: false }));

// Error-handling middleware for IpDeniedError (after IpFilter but before routes)
// app.use((err, req, res, next) => {
//   if (err instanceof IpDeniedError) {
//     // Log a simple warning without the stack trace
//     console.warn(`Access denied to IP address: ${req.ip}`);
//     // Send a generic error response
//     res.status(403).send('Access Denied');
//   } else {
//     // Pass other errors to the next error handler
//     next(err);
//   }
// });

// Serve static files before other middleware
const serveIndex = require('serve-index');
app.use('/ftp', express.static('public/ftp'), serveIndex('public/ftp', { icons: true }));

// Body parsers and other middleware
const bodyParser = require('body-parser');
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '2gb' }));
app.use(bodyParser.json({ limit: '150mb' }));
app.use(bodyParser.urlencoded({
  limit: '150mb',
  extended: true
}));

// File upload middleware
const fileUpload = require('express-fileupload');
const { getTripData } = require("./dbQueries/dataGet.js");
app.use(fileUpload());

// Rate limiting middleware (optional)
// const rateLimitMiddleware = require("./middlewares/rateLimiter");
// app.use(rateLimitMiddleware);

// Routes
app.post('/upload', function (req, res) {
  console.log('POST /upload request');
  if (!req.files || Object.keys(req.files).length === 0) return res.status(400).send('No files were uploaded.');

  let sampleFile = req.files.file;
  let uploadPath = __dirname + '/public/ftp/' + sampleFile.name;

  sampleFile.mv(uploadPath, function (err) {wss://demo.piesocket.com/v3/channel_123?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    res.send('File uploaded!');
  });
});

// Use other routes
// app.use('/', require('./routes'));

// Error-handling middleware for other errors (optional)
app.use((err, req, res, next) => {
  console.error(err); // You can customize this
  res.status(500).send('Internal Server Error');
});

// Disable 'x-powered-by' header
// app.disable('x-powered-by');

app.listen(3307, async () => {
  // console.log(process.env);
  let secrets = process.env;
  console.log("App listening at port " + secrets.PORT_TTP);
});
// var options = {
//   key: fs.readFileSync('privatekey.pem'),
//   cert: fs.readFileSync('certificate.pem')
// };
// https.createServer(options, app).listen(3302)

app.get('/getData',async(req,res)=>{
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