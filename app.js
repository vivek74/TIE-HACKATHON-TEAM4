'use strict';
const express=require("express");
const bodyParser=require("body-parser");
const app=express();
const request=require("request");
const vision = require('node-cloud-vision-api');
const Vision = require('@google-cloud/vision');
const rgbHex = require('rgb-hex');
var Parse = require('parse');
app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));
app.use(express.static("api"));
app.get("/",function(req,res){
  res.render("search");
});


vision.init({auth: 'AIzaSyAKuIdRdWcg8yg1tTdpf-hnwzzhwpR4mJY'});


app.post("/results",function(reqq,ress){
const img=reqq.body.search;
//console.log(img);

const req = new vision.Request({
  image: new vision.Image({
    path: 'img'+'.jpg'
  }),
  features: [
    new vision.Feature('TEXT_DETECTION', 1),
    new vision.Feature('WEB_DETECTION', 20),
    new vision.Feature('IMAGE_PROPERTIES', 1),
  ]
})

vision.annotate(req).then((res) => {
  var data= JSON.stringify(res.responses)
  var results= JSON.parse(data)

    var plate=(results[0]["textAnnotations"][0]["description"]);
    var color=(results[0]["imagePropertiesAnnotation"]["dominantColors"]["colors"][0]["color"]);
    var model=(results[0]["webDetection"]["webEntities"][1]["description"]);
    var model1=(results[0]["webDetection"]["webEntities"][2]["description"]);
    var model2=(results[0]["webDetection"]["webEntities"][3]["description"]);
    var model3=(results[0]["webDetection"]["webEntities"][4]["description"]);
    var red=color.red;
    var green=color.green;
    var blue=color.blue;
    var col=rgbHex(red, green, blue);
    ress.render("results",{plate:plate, model:model, model1:model1, model2:model2, model3:model3, red:color.red, green:color.green, blue:color.blue, image:img,col:col});
}, (e) => {
  console.log('Error: ', e)

})
})


app.listen(3000,function(){
console.log("server started on 3000");
});