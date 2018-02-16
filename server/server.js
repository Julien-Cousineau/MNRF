const path = require('path');
const express = require('express');
// const http = require('http');
const cors = require('cors');
const compress = require('compression');
const bodyParser = require('body-parser');
// const request = require("request");

// const  reqq = require('req-fast');
const http=require('http')

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
    
    this.startServer();  
  },
  startServer(){
    const PORT = 8080;
    this.app.listen(PORT,'0.0.0.0', function() {
      console.log('Webserver is listening on port %d!',PORT);
    });
  }
};
new Webserver();