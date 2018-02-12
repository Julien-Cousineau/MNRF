const path = require('path');
const express = require('express');
// const http = require('http');
const cors = require('cors');
const compress = require('compression');
const bodyParser = require('body-parser');


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
    app.get('/(.*)', (req, res) => {
      console.log(req.pat)
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