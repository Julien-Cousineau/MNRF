'use strict'
const util = require('./util');
const path = require('path');
const fs   = require('fs');

const readChunk = require('read-chunk');
const isTif     = require('is-tif');

const express    = require('express');
const cors       = require('cors');
const compress   = require('compression');
const bodyParser = require('body-parser');
const helmet     = require('helmet');
const csp        = require('helmet-csp');
const cookieSes  = require('cookie-session');

const rastertiles = require('./rastertiles');
const fileUpload  = require('express-fileupload');
const { exec }    = require('child_process');

// const http=require('http');
const https=require('https');

require('dotenv').config();
const KEY=process.env.KEY;
const CLOUD=process.env.CLOUD;
const COOKIE_KEY1=process.env.COOKIE_KEY1;
const COOKIE_KEY2=process.env.COOKIE_KEY2;
const DOMAIN=process.env.DOMAIN;
const gdalwarp=process.env.gdalwarp;
const gdal_translate=process.env.gdal_translate;
const gdal2tiles=process.env.gdal2tiles;

const ICEUPLOAD = path.resolve(CLOUD,'ice/upload');
const ICEPROCESS = path.resolve(CLOUD,'ice/process');
const ICETILES = path.resolve(CLOUD,'ice/tiles');

function Webserver(){this.construct();}
Webserver.prototype = {
    construct:function(){
    const app = this.app = express();
    app.use(cors());
    app.use(compress()); 
    app.use(bodyParser.json());// to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(helmet());
    app.use(this.appuseCSP());
    app.use(this.appuseCookie());
    
    
    app.use(express.static(path.join(__dirname, '../public')));
    app.get('/', (req, res) => {res.sendFile(path.resolve(__dirname, '../public/index.html'));});

    this.appgetKiwis();
    this.appgetList();
    this.apppostUploadIce();
    this.getTiles();
    this.startServer();  
  },
  startServer(){
    const PORT = 8080;
    this.app.listen(PORT,'0.0.0.0', function() {
      console.log('Webserver is listening on port %d!',PORT);
    });
  },
  appuseCSP:function(){
    return csp({
      // Specify directives as normal.
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", 'https://*.tiles.mapbox.com','https://api.mapbox.com','https://api.flickr.com','https://geo.weather.gc.ca'],
        scriptSrc: ["'self'","'unsafe-eval'"],
        styleSrc: ["'self'","'unsafe-inline'"],
        fontSrc: ["'self'"],
        childSrc: ["'self'",'blob:'],
        imgSrc: ["'self'",'data:','blob:','https://c1.staticflickr.com','https://api.flickr.com'],
        //sandbox: ['allow-forms', 'allow-scripts'],
        reportUri: '/report-violation',
        objectSrc: ["'self'"],
        upgradeInsecureRequests: true,
        workerSrc: ["'self'",'blob:'],  // This is not set. 
      },
    
      // This module will detect common mistakes in your directives and throw errors
      // if it finds any. To disable this, enable "loose mode".
      loose: false,
    
      // Set to true if you only want browsers to report errors, not block them.
      // You may also set this to a function(req, res) in order to decide dynamically
      // whether to use reportOnly mode, e.g., to allow for a dynamic kill switch.
      reportOnly: false,
    
      // Set to true if you want to blindly set all headers: Content-Security-Policy,
      // X-WebKit-CSP, and X-Content-Security-Policy.
      setAllHeaders: false,
    
      // Set to true if you want to disable CSP on Android where it can be buggy.
      disableAndroid: false,
    
      // Set to false if you want to completely disable any user-agent sniffing.
      // This may make the headers less compatible but it will be much faster.
      // This defaults to `true`.
      browserSniff: true
    });
  },
  appuseCookie:function(){
    return cookieSes(
      { name: 'session',
        keys: [COOKIE_KEY1,COOKIE_KEY2],
        maxAge: 1 * 60 * 60 * 1000, // 24 hours
        cookie: {
          secure: true,
          httpOnly: true,
          domain: DOMAIN,
          // path: 'foo/bar',
        }
    });
  },
  appgetKiwis:function(){
    this.app.get('/KiWIS', (req, res) => {
      const url=`https://www.swmc.mnr.gov.on.ca/KiWIS/` + req.originalUrl;
      // console.time(req.originalUrl);
      https.get(url, (_res) => {
        let rawData = '';
        _res.on('data', (chunk) => { rawData += chunk; });
        _res.on('end', () => {res.send(rawData);});
      }).on('error', (e) => { console.error(`KIWIS Error: ${e.message}`);});
    });
  },
  appgetList:function(){
    const self=this;
    this.app.get('/getradarlist', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(JSON.stringify(self.getList()));
    });
  },
  apppostUploadIce:function(){
    const self=this;
    this.app.use(fileUpload());
    this.app.post('/upload', function(req, res) {
      if(!req.query.key)return res.status(400).send('Error Upload 1');
      if(req.query.key !=KEY)return res.status(400).send('Error Upload 2');
      if (!req.files || !req.files.iceFile) return res.status(400).send('Error Upload 3');
    
      const iceFile = req.files.iceFile;
      const name = iceFile.name;
      const filepath = path.resolve(ICEUPLOAD, name);
      if(fs.existsSync(filepath)) return res.status(400).send('Error Upload 4');
    
      iceFile.mv(filepath, function(err) {
        if (err) return res.status(500).send('Error Upload 5');
        if (!isTif(readChunk.sync(filepath, 0, 4)))return res.status(400).send('Error Upload 6');
        res.status(200).send('File uploaded!');
        self.processIce(filepath);
      });
    });
  },
  processIce:function(filepath){
    const self=this;
    const name = path.basename(filepath,'.tif');
    const processfilepath = path.resolve(ICEPROCESS,name +".m.tif");
    const vrtfilepath = path.resolve(ICEPROCESS,name +".m.vrt");
    const tilespath = path.resolve(ICETILES,name);
    
    exec('{0} -overwrite -srcnodata 0 -dstnodata 0 {1} {2}'.format(gdalwarp,filepath,processfilepath), (error, stdout, stderr) => {
      if (error) return console.error(`Exec error: ${error}`);
      exec('{0} -of vrt -expand rgba {1} {2}'.format(gdal_translate,processfilepath,vrtfilepath), (error, stdout, stderr) => {
        if (error) return console.error(`Exec error: ${error}`);
        exec('{0} --profile=mercator -z 1-14 -a 0 {1} {2}'.format(gdal2tiles,vrtfilepath,tilespath), (error, stdout, stderr) => {
          if (error) return console.error(`Exec error: ${error}`);
          // console.log("TIF2Tiles complete ({0})".format(name));
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
  getTiles:function(){
    this.getList().forEach(name=>this.addLayer(name),this);
  },
  addLayer:function(name){
    this.app.use('/gis/', rastertiles(name));
  }  
};
new Webserver();