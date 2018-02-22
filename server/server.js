const path = require('path');
const fs = require('fs');
const express = require('express');
// const http = require('http');
const cors = require('cors');
const compress = require('compression');
const bodyParser = require('body-parser');
// const request = require("request");

// const  reqq = require('req-fast');

const tilestrata = require('tilestrata');
const strata = tilestrata();
const disk = require('tilestrata-disk');


const fileUpload = require('express-fileupload');
const { exec } = require('child_process');

const ICEUPLOAD = path.resolve(__dirname,'../clouddrive/ice/upload');
const ICEPROCESS = path.resolve(__dirname,'../clouddrive/ice/process');
const ICETILES = path.resolve(__dirname,'../clouddrive/ice/tiles');

const http=require('http');
require('dotenv').config();
const KEY=process.env.KEY;

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
      
      console.time(req.originalUrl)
      http.get(url, (_res) => {
        
        let rawData = '';
        _res.on('data', (chunk) => { rawData += chunk; });
        _res.on('end', () => {
            // res.setHeader('Content-Type', 'application/csv');
            res.send(rawData);
            console.timeEnd(req.originalUrl)
        });
      }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
      });
      // reqq({url:url,dataType:'json'}).pipe(res)
      
      // request.get(url,function(error,response,body){
      //   console.log('error:', error); // Print the error if one occurred
      //   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      //   console.log('body:', body); // Print the HTML for the Google homepage.
      // })
      
      
      // request.get(url, (error, response, body) => {
      //   res.send
      // })
      
    });
    // this.server = http.createServer(this.app);
    // this.socketserver = new Socket({parent:this.pointer});
    this.appgetList();
    this.uploadIce();
    this.getLayers();
    
    this.app.use(tilestrata.middleware({
        server: strata,
        prefix: '/gis'
    }));
    
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
    this.app.get('/getList', (req, res) => {
      if(!req.query.key)return res.status(400).send('Access key is required');
      if(req.query.key !=KEY)return res.status(400).send('Incorrect access key');
      const list = self.getList();
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(JSON.stringify(list));
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
    
    exec('gdalwarp -overwrite -srcnodata 0 -dstnodata 0 {0} {1}'.format(filepath,processfilepath), (error, stdout, stderr) => {
      if (error) {console.error(`exec error: ${error}`);return;  }
      // console.log(`stdout: ${stdout}`);
      // console.log(`stderr: ${stderr}`);
      exec('gdal_translate -of vrt -expand rgba {0} {1}'.format(processfilepath,vrtfilepath), (error, stdout, stderr) => {
        if (error) {console.error(`exec error: ${error}`);return;  }
        // console.log(`stdout: ${stdout}`);
        // console.log(`stderr: ${stderr}`);
        exec('gdal2tiles.py --profile=mercator -z 1-14 -a 0 {0} {1}'.format(vrtfilepath,tilespath), (error, stdout, stderr) => {
          if (error) {console.error(`exec error: ${error}`);return;  }
            // console.log(`stdout: ${stdout}`);
            // console.log(`stderr: ${stderr}`);
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
    strata.layer(name)
          .route('tile.png')
        //   .use(disk.provider('./tiles/{z}/{x}/{y}.png'))
        .use(disk.cache({path: function(tile) {
            // console.log(tile)
        // console.log(path.resolve(ICETILES,'{0}/{1}/{2}/{3}.png'.format(name,tile.z,tile.x,tile.y)))
        return path.resolve(ICETILES,'{0}/{1}/{2}/{3}.png'.format(name,tile.z,tile.x,tile.y)); 
        // return './tiles/RiverIceBreakupClassification_ON_AlbanyRiver_20170502_231318/' + tile.z + '/' + tile.x + '/' + tile.y + ".png";
    }}));
  }  
};
// String formatter
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}
new Webserver();