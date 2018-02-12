/*global $,Base,extend*/
function Card(options){
  this.properties ={
    riverid:'',
    stationid:'',
    type:'',
    title:'',
    cols:'',
    photoid:'',
    charted:false,
  };
  this.properties=extend(this.properties,options);
  Base.call(this,this.properties);
}
Card.prototype = {
  html:function(){
    const content=(this.type=="webcam") ? this.htmlwebcam():this.htmlts();
    return `
    <div class="col-sm-12 col-md-{0}">
      <div class="card">
        <h5 class="card-header">{1}</h5>
        <div class="card-body" _type="{3}">
          <!--<h5 class="card-title">Special title treatment</h5>-->
          {2}
        </div>
      </div>
    </div>
    `.format(this.cols,this.title,content,this.type)
  },
  htmlwebcam:function(){return `<img src="https://c1.staticflickr.com/5/4616/40027637332_d5027f8efe_b.jpg" class="card-image">`},
  htmlts:function(){return `<div id="ts_{0}"></div>`.format(this.stationid);},
  // update:function(){
  //   if(this.type=='webcam')this.updatewebcam();
  //   if(this.type=='ts')this.updatets();
  // },
  updatewebcam:function(photo){
    const src = `https://c1.staticflickr.com/{0}/{1}/{2}_{3}_b.jpg`.format(photo.farm,photo.server,photo.id,photo.secret);
    $('[_riverid="{0}"] [_stationid="{1}"] [_type="{2}"] img'.format(this.riverid, this.stationid,'webcam')).attr("src", src);
    $('[_riverid="{0}"] [_stationid="{1}"] [_type="{2}"]'.format(this.riverid, this.stationid,'webcam')).removeClass("chart-loading-overlay");
    $('[_riverid="{0}"] [_stationid="{1}"] [_type="{2}"] .loading-widget-dc'.format(this.riverid, this.stationid,'webcam')).remove();
  },
  updatetss:function(callback){
    const self=this;
    self.get_ts(function(){
      (self.charted) ?self.updatewlchart():self.createwlchart();
    });
  },
  get_ts:function(callback){
    const self=this;
    self.get_tss(function(){
      const getTSValues = function(ts,_callback){
        self.parent.api.getTSValues(ts.ts_id,function(err,data){
          if(err)console.log(data);
          ts.data=data;
          _callback();
        });
      }
      async.each(self.tss,getTSValues,function(err){
        if(err)console.log("Error in async each")
        callback();  
      })
    });
  },
  get_tss:function(callback){
    const self=this;
    if(!(self.tss)){
      
      const ts_select = self.ts_select = [{ts_name:'Q.15',"parametertype_name": "Q"},{ts_name:'LVL.15.P',"parametertype_name": "Stage"},{ts_name:'LVL.15.O',"parametertype_name": "Stage"}];
      self.parent.api.getTimeseriesList(self.stationid,function(err,data){
        if(err)console.log(data);
        
        self.tss=ts_select.map(select=>data.find(ts=>ts.ts_name==select.ts_name && ts.parametertype_name==select.parametertype_name));
        console.log(self.tss)
        callback();
      });  
    } else{
      callback();
    }
  },
  createwlchart:function(){
    console.log(this.tss);
    var data = [
      // {
      //   x: this.tss.find(ts=>ts.ts_name=='WWP_AlarmLevel_High Limit').data[0].data.map(row=>row[0]),
      //   y: this.tss.find(ts=>ts.ts_name=='WWP_AlarmLevel_High Limit').data[0].data.map(row=>row[1]),
      //   type: 'scatter'
      // },
      {
        x: this.tss.find(ts=>ts.ts_name=='LVL.15.P').data[0].data.map(row=>row[0]),
        y: this.tss.find(ts=>ts.ts_name=='LVL.15.P').data[0].data.map(row=>row[1]),
        type: 'scatter'
      }
      ,
            {
        x: this.tss.find(ts=>ts.ts_name=='LVL.15.O').data[0].data.map(row=>row[0]),
        y: this.tss.find(ts=>ts.ts_name=='LVL.15.O').data[0].data.map(row=>row[1]),
        type: 'scatter'
      }
    ];
    var layout = {
      autosize: true,
      // width: 500,
      height: 200,
      margin: {
        l: 30,
        r: 30,
        b: 30,
        t: 10,
        pad: 0
      },
       yaxis: {
    // domain: [0, 0.75],
    // range:[0,4],
    showline:true,
    mirror:true,
    title:'Water Level (m)',
    // nticks:12,
  },
      // paper_bgcolor: '#7f7f7f',
      // plot_bgcolor: '#c7c7c7'
    };
    
    Plotly.newPlot('ts_{0}'.format(this.stationid), data,layout);
    $('[_riverid="{0}"] [_stationid="{1}"] [_type="{2}"]'.format(this.riverid, this.stationid,'ts')).removeClass("chart-loading-overlay");
    $('[_riverid="{0}"] [_stationid="{1}"] [_type="{2}"] .loading-widget-dc'.format(this.riverid, this.stationid,'ts')).remove();
    this.charted=true
  },
  updatewlchart:function(){
    
  }
  
  
};
Object.assign(Card.prototype,Base.prototype);
Card.prototype.constructor = Card;