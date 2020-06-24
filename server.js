'use strict';

var express = require('express');
var cors = require('cors');
const multer = require('multer');

// require and use "multer"...

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads')
  }, filename : (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now());
  } 
})

let upload = multer({storage : storage});

var app = express();

app.use(cors());
app.use((req, res, done) => {
  console.log(`${req.method} ${req.path} ${req.ip} `);
  done();

})
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

app.get('/hello', function(req, res){
  res.json({greetings: "Hello, API"});
});

app.post('/api/fileanalyse', upload.single('upfile'), (req, res, next) => {
  const file = req.file;
  if(!file) {
    const error = new Error('Please upload a file');
    error.httpStatusCode = 400;
    return next(error);
  } else {
    res.send(file);
  }
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});
