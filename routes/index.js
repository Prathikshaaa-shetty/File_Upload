var express = require('express');
var multer = require('multer');
var path = require('path');
var jwt = require('jsonwebtoken');
var empModel = require('../modules/employee');
var uploadModel = require('../modules/upload');

var router = express.Router();
var employee =empModel.find({});
var imageData =uploadModel.find({});

router.use(express.static(__dirname+"./public/"));

if (typeof localStorage === "undefined" || localStorage === null) {
  const LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

var Storage= multer.diskStorage({
  destination:"./public/uploads/",
  filename:(req,file,cb)=>{
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
});

var upload = multer({
  storage:Storage
}).single('file');


/* GET home page. */
router.post('/upload', upload,function(req, res, next) {
  var imageFile=req.file.filename;
 var success =req.file.filename+ " uploaded successfully";

 var imageDetails= new uploadModel({
  imagename:imageFile
 });
 imageDetails.save(function(err,doc){
if(err) throw err;

imageData.exec(function(err,data){
if(err) throw err;
res.render('upload-file', { title: 'Upload File', records:data,   success:success });
});

 });

  });


router.get('/upload',function(req, res, next) {
  imageData.exec(function(err,data){
    if(err) throw err;
res.render('upload-file', { title: 'Upload File', records:data, success:'' });
  });
});

router.get('/',function(req, res, next) {
  employee.exec(function(err,data){
if(err) throw err;
res.render('index', { title: 'Image Records', records:data, success:'' });
  });
  
});




router.post('/', upload, function(req, res, next) {
  var empDetails = new empModel({
    name: req.body.uname,
    email: req.body.email,
    image:req.file.filename,
  });

  empDetails.save(function(err,req1){
    if(err) throw err;
    employee.exec(function(err,data){
      if(err) throw err;
      res.render('index', { title: 'Image Records', records:data, success:'Record Inserted Successfully' });
        });
  })
  
  
});


module.exports = router;
