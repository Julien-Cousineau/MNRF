const path = require('path');
const fs = require('fs');
const express = require('express');
// const http = require('http');
const cors = require('cors');
const compress = require('compression');
const bodyParser = require('body-parser');
const util = require('./util');

const rastertiles = require('./rastertiles')

const fileUpload = require('express-fileupload');
const { exec } = require('child_process');



const http=require('http');
require('dotenv').config();
const KEY=process.env.KEY;
const CLOUD=process.env.CLOUD;
const ICEUPLOAD = path.resolve(CLOUD,'ice/upload');
const ICEPROCESS = path.resolve(CLOUD,'ice/process');
const ICETILES = path.resolve(CLOUD,'ice/tiles');

const gdalwarp=process.env.gdalwarp;
const gdal_translate=process.env.gdal_translate;
const gdal2tiles=process.env.gdal2tiles;


function Webserver(){this.construct();}
Webserver.prototype = {
    construct:function(){
    const app = this.app = express();
    app.use(cors());
    app.use(compress()); 
    app.use(bodyParser.json() );       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
      extended: true
    })); 
    
    app.use(express.static(path.join(__dirname, '../public')));
    app.get('/', (req, res) => {
      res.sendFile(path.resolve(__dirname, '../public/index.html'));
    });
   
    app.get('/KiWIS', (req, res) => {
      const url=`http://204.41.16.133/KiWIS/` + req.originalUrl;
      
      console.time(req.originalUrl);
      http.get(url, (_res) => {
        let rawData = '';
        _res.on('data', (chunk) => { rawData += chunk; });
        _res.on('end', () => {
            // res.setHeader('Content-Type', 'application/csv');
            res.send(rawData);
            console.timeEnd(req.originalUrl);
        });
      }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
      });
    });
    // this.server = http.createServer(this.app);
    // this.socketserver = new Socket({parent:this.pointer});
    this.appgetList();
    this.uploadIce();
    this.getLayers();
    this.startServer();  
  },
  startServer(){
    const PORT = 8080;
    this.app.listen(PORT,'0.0.0.0', function() {
      console.log('Webserver is listening on port %d!',PORT);
    });
  },
  appgetList:function(){
    const self=this;
    this.app.get('/getradarlist', (req, res) => {
      // if(!req.query.key)return res.status(400).send('Access key is required');
      // if(req.query.key !=KEY)return res.status(400).send('Incorrect access key');
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(JSON.stringify(self.getList()));
    });
  },
  uploadIce:function(){
    const self=this;
    this.app.use(fileUpload());
    this.app.post('/upload', function(req, res) {
      if(!req.query.key)return res.status(400).send('Access key is required');
      if(req.query.key !=KEY)return res.status(400).send('Incorrect access key');
     
      if (!req.files) return res.status(400).send('No files were uploaded.');
      // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
      let iceFile = req.files.iceFile;
      let name = iceFile.name;
      let filepath = path.resolve(ICEUPLOAD, name);
      if(fs.existsSync(filepath)) return res.status(400).send('Name of file already exist');
      
      // Use the mv() method to place the file somewhere on your server
      iceFile.mv(filepath, function(err) {
        if (err) return res.status(500).send(err);
        res.status(200).send('File uploaded!');
        self.processIce(filepath);
      });
    });
  },
  processIce:function(filepath){
    const self=this;
    let name = path.basename(filepath,'.tif');
    let processfilepath = path.resolve(ICEPROCESS,name +".m.tif");
    let vrtfilepath = path.resolve(ICEPROCESS,name +".m.vrt");
    let tilespath = path.resolve(ICETILES,name);
    
    exec('{0} -overwrite -srcnodata 0 -dstnodata 0 {1} {2}'.format(gdalwarp,filepath,processfilepath), (error, stdout, stderr) => {
      if (error) {console.error(`exec error: ${error}`);return;  }
      exec('{0} -of vrt -expand rgba {1} {2}'.format(gdal_translate,processfilepath,vrtfilepath), (error, stdout, stderr) => {
        if (error) {console.error(`exec error: ${error}`);return;  }
        exec('{0} --profile=mercator -z 1-14 -a 0 {1} {2}'.format(gdal2tiles,vrtfilepath,tilespath), (error, stdout, stderr) => {
          if (error) {console.error(`exec error: ${error}`);return;  }
          console.log("TIF2Tiles complete ({0})".format(name));
          fs.unlinkSync(processfilepath);
          fs.unlinkSync(vrtfilepath);
          self.addLayer(name);
        });
      });
    });
  },
  getList:function(){
    return fs.readdirSync(ICEUPLOAD).reduce((acc,file) =>{if(path.extname(file)=='.tif')acc.push(path.basename(file,'.tif'));return acc;},[]);
  },
  getLayers:function(){
    this.getList().forEach(layer=>this.addLayer(layer),this);
  },
  addLayer:function(name){
    this.app.use('/gis/', rastertiles(name));
  }  
};
new Webserver();