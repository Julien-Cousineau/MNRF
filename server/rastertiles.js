const util = require('./util');
const fs = require('fs');
const path = require('path');
const express = require('express');
require('dotenv').config();
const CLOUD=process.env.CLOUD;
const ICETILES = path.resolve(CLOUD,'ice/tiles');

module.exports = function(name) {
  const tilePattern = '/:name/:z(\\d+)/:x(\\d+)/:y(\\d+).:format([\\w.]+)';
  let app = express().disable('x-powered-by');
  
  app.get(tilePattern, function(req, res, next) {
    let z = req.params.z || 0,
        x = req.params.x || 0,
        y = req.params.y || 0,
        name = req.params.name || 'dummy',
        format = req.params.format || 'format';
    
    let filepath = path.join(ICETILES,'{0}/{1}/{2}/{3}.{4}'.format(name,z,x,y,format));
    if(!fs.existsSync(filepath)) return res.status(204).send('Not found');
    return res.status(200).sendFile(filepath);
  });
  
  return app;
};