require('rootpath')();
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('./config.json');
var mongoose = require('mongoose');
var session = require('express-session');
var fs = require('fs');
var path = require('path')
//const csv = require('csv-parser')
const XLSX = require('xlsx');
var tagData = require('../server/controllers/tag/tag.model');// get our mongoose model
var TrainingLineItem = require('./controllers/trainingitem/trainingitem.model');


const multer = require('multer');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({ uploadDir: '../dist/assets/uploads' });
//const multipartMiddleware = multipart({ uploadDir: '../src/assets/uploads' });
var mongodbUrl = 'mongodb://' + config.DB_User + ':' + encodeURIComponent(config.DB_Pass) + '@' + config.DB_HOST + ':' + config.DB_PORT + '/' + config.DB_NAME;
//var mongodbUrl = 'mongodb://' + config.DB_HOST + ':' + config.DB_PORT + '/' + config.DB_NAME;


function randomString() {
  var chars = "0123456789";
  var string_length = 3;
  var randomstring = '';
  for (var i = 0; i < string_length; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum, rnum + 1);
  }
  return randomstring;
}

// Database options
// Option auto_reconnect is defaulted to true
var dbOptions = {
  server: {
    reconnectTries: -1, // always attempt to reconnect
    socketOptions: {
      keepAlive: 120
    }
  }
};

// Events on db connection
mongoose.connection.on('error', function (err) {
  console.error('MongoDB connection error. Please make sure MongoDB is running. -> ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.error('MongoDB connection disconnected.')
});

mongoose.connection.on('reconnected', function () {
  console.error('MongoDB connection reconnected.')
});

// Connect to db
var connectWithRetry = function () {
  return mongoose.connect(mongodbUrl, dbOptions, function (err) {
    if (err) {
      console.error('Failed to connect to mongo on startup - retrying in 5 sec. -> ' + err);
      setTimeout(connectWithRetry, 5000);
    }
  });
};
var path = require("path");

connectWithRetry();
var http = require('https');
var https = require('https');
var options = {
  key: fs.readFileSync('./ssl/privkey.pem'),
  cert: fs.readFileSync('./ssl/fullchain.pem')
};
var app = express();
//app.use(forceSsl);
//var server = https.createServer(options,app).listen(3000);
var server = http.createServer(app);
//var io = ios.listen(server);
var routes = require('./routes');
//app.set('socketio', io);
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));
app.use(session({ secret: 'secret', resave: 'false', saveUninitialized: 'false' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
// Enable CORS

app.use(cors());
app.use(function (req, res, next) { //allow cross origin requests
  //res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  res.header("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// Bootstrap routes
var serveIndex = require('serve-index')
// app.use('/', express.static(__dirname + '/../public'), serveIndex(__dirname + '/../public', {'icons': true}))


// Static files
app.use('/', express.static(__dirname + '/../public'));


// use JWT auth to secure the api, the token can be passed in the authorization header or querystring
app.use(expressJwt({
  secret: config.secret,
  getToken: function (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }
}).unless({
  path: ['/users/authenticate',
    '/users/getqrcode',
    '/users/updatetagData',
    '/users/getCableInfo',

  ]
}));

// routes
app.use(routes);
app.use('/users', require('./controllers/Users/users.controller'));


// var storage = multer.diskStorage({
//   // destination
//   destination: function (req, file, cb) {

//     cb(null, './uploads');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   }

// });

// var storage = multer.diskStorage({
//   // destination
//   destination: function (req, file, cb) {

//     cb(null,'../src/assets/uploads/')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   }

// });

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //cb(null, '../src/assets/uploads')
    cb(null, '../dist/assets/uploads')
    //cb(null,'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, randomString() + '-' + Date.now() + path.extname(file.originalname));
  }
});
var upload = multer({ storage: storage });
app.post('/addmaintrainingProgram', multipartMiddleware, (req, res) => {
  res.send({ filename: path.basename(req.files.uploads.path) });
})
app.post('/addtrainingProgram', multipartMiddleware, (req, res) => {
  // console.log(req.files.uploads)
  // app.post('/addtrainingProgram', upload.any('uploads'), function (req, res) {

  var lineitemdata = JSON.parse(req.body.traininglineitems);
  var trainingdata = JSON.parse(req.body.trainingdata);

  var lineimage = [];
  for (let j = 0; j < req.body.uploadscheck.length; j++) {

    if (req.body.uploadscheck[j]) {
      lineimage[j] = req.files.uploads[req.body.uploadscheck[j]];
    }
    else {
      lineimage[j] = '';
    }
  }

  var lineitems = [];
  let k = 1;
  for (let i = 0; i < lineitemdata.length; i++) {


    lineitems.push({ 'image': (req.body.uploadscheck[i]) ? path.basename(lineimage[i].path) : '', 'name': lineitemdata[i].itemname, 'gifurl': lineitemdata[i].gifurl, 'filetype': lineitemdata[i].fileradiotype, 'order': k });
    k++;
  }

  var lineitem = new TrainingLineItem({
    productId: new mongoose.Types.ObjectId(req.body.productid),
    title: trainingdata.title,
    order: parseInt(req.body.datalength) + 1,
    image: trainingdata.mainImage,
    vimeolink: trainingdata.vimeolink,
    filetype: (trainingdata.filetyperadio) ? trainingdata.filetyperadio : 'Image',
    status: true,
    traininglineitem: lineitems
  });

  lineitem.save(function (err, lineitemdata) {
    if (!err) {
      res.send(lineitemdata);

    } else {
      res.send(err.name + ': ' + err.message);
    }
  });



});

app.post('/updatetrainingProgram', upload.any('uploads'), function (req, res) {

  var lineitemdata = JSON.parse(req.body.traininglineitems);
  var trainingdata = JSON.parse(req.body.trainingdata);

  var lineimage = [];

  for (let j = 0; j < req.body.uploadscheck.length; j++) {

    if (req.body.uploadscheck[j]) {
      lineimage[j] = req.files[req.body.uploadscheck[j]];
    }
    else {
      lineimage[j] = '';
    }
  }
//console.log(lineimage);
  var lineitems = [];
  let k = 1;
  for (let i = 0; i < lineitemdata.length; i++) {
    var imageone;
    //console.log(path.basename(lineimage[i].path));
    //console.log(req.body.uploadscheck[i]);
    if (req.body.uploadscheck[i]) {
      imageone = lineimage[i].filename;
    }
    else if (lineitemdata[i].itemexistimage) {
      imageone = lineitemdata[i].itemexistimage;
    }
    else {
      imageone = '';
    }

    //console.log(imageone);

    lineitems.push({ 'image': imageone, 'name': lineitemdata[i].itemname, 'gifurl': lineitemdata[i].gifurl, 'filetype': lineitemdata[i].fileradiotype, 'order': k });
    k++;
  }

  
  TrainingLineItem.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(req.body.itemid) }, {
    title: trainingdata.title,
    image: (trainingdata.filetyperadio == 'Image') ? trainingdata.mainImage : '',
    vimeolink: trainingdata.vimeolink,
    filetype: (trainingdata.filetyperadio) ? trainingdata.filetyperadio : 'Image',
    traininglineitem: lineitems,
    datemodified: Date.now(),
  },
    function (err, lineitemdata) {
      if (!err) {
        res.send(lineitemdata);

      } else {
        res.send(err.name + ': ' + err.message);
      }
    });

});

var upload = multer({ storage: storage });
app.post('/addcsvfile', upload.any('uploads[]'), function (req, res) {

  var file = req.files[0];
  var userid = req.body.uploads

  var originalFileName = file.originalname;

  var workbook = XLSX.readFile('uploads/' + originalFileName);// ./assets is where your relative path directory where excel file is, if your excuting js file and excel file in same directory just igore that part
  var sheet_name_list = workbook.SheetNames;
  // SheetNames is an ordered list of the sheets in the workbook

  var data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], { blankRows: false, defval: '', header: 1 });
  var arr1 = ['id', 'description',
    'radius_curvature_a', 'apex_offset_a', 'fibre_height_a', 'apc_angle_a', 'key_error_a',
    'radius_curvature_b', 'apex_offset_b', 'fibre_height_b', 'apc_angle_b', 'key_error_b',
    'insertion_loss_a', 'insertion_loss_b', 'return_loss_a', 'return_loss_b'];
  var arr2 = data[0];;

  if (arr1.length == arr2.length && arr1.every(function (u, i) {
    return u === arr2[i];
  })) {
    var array = [];
    var errorDisplay = [];
    for (let i = 1; i < data.length; i++) {
      var obj = {};

      if (data[i][0]) {

        // tagData.findOne({ "qr_code": data[i][0] }, function (err, tagResult) {

        //   if (err) {
        //     var errorMsg = {}
        //     errorMsg.msg = err.message;
        //     res.send(errorMsg);
        //   } else {
        //     if (tagResult) {
        //       errorDisplay.push(data[i][0]);
        //     } else {
        obj.qr_code = data[i][0];
        obj.product_type = 'Cable';
        obj.userId = userid;
        obj.description = data[i][1];
        obj.radius_curvature_a = data[i][2];
        obj.apex_offset_a = data[i][3];
        obj.fibre_height_a = data[i][4];
        obj.apc_angle_a = data[i][5];
        obj.key_error_a = data[i][6];
        obj.radius_curvature_b = data[i][7];
        obj.apex_offset_b = data[i][8];
        obj.fibre_height_b = data[i][9];
        obj.apc_angle_b = data[i][10];
        obj.key_error_b = data[i][11];
        obj.insertion_loss_a = data[i][12];
        obj.insertion_loss_b = data[i][13];
        obj.return_loss_a = data[i][14];
        obj.return_loss_b = data[i][15];
        obj.dateadded = Date.now();
        obj.datemodified = Date.now();
        obj.sourcePortNo = [];
        obj.destinationPortNo = [];
        obj.productName = [];
        obj.odfPortCount = 0;
        array.push(obj)
      }
    }
    //});

    //}
    // }

    tagData.insertMany(array, function (err, tagResult) {
      if (!err) {
        fs.unlink('uploads/' + originalFileName, function (err, responce) {
          if (err) {

            console.log(err);
          } else {
            var data = {};

            // if (errorDisplay) {
            //   data.response='error';
            //   data.status = 'Qr Code Already Exist';
            // } else {
            data.response = 'success';
            data.status = 'Csv import success fully';
            //  }
            res.send(data);
          }
        })
      } else {
        console.log(err);
      }
    });
  } else {

    fs.unlink('uploads/' + originalFileName, function (err, responce) {
      if (err) {

        console.log(err);
      } else {

        var data = {};
        data.string = 'error';
        res.send(data);
      }
    })
  }
  // });


})


// start server
var port = process.env.NODE_ENV === 'production' ? 80 : 3000;
// Once database open, start server
mongoose.connection.once('open', function callback() {
  console.log('Connection with database succeeded.');

  var server = app.listen(port, function () {

    console.log('Server listening on port ' + port);
  });
});
