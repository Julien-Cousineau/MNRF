/*global $,Base,extend,Chart*/
function Card(options){
  this.properties ={
    riverid:'',
    stationid:'',
    type:'',
    title:'',
    cols:'',
    photoid:'',
    ts_select:'',
    charted:false,
  };
  this.properties=extend(this.properties,options);
  Base.call(this,this.properties);
}
Card.prototype = {
  html:function(){
    const content=(this.type=="webcam") ? this.htmlwebcam():this.htmlts();
    return `
    <div class="col-sm-12 col-md-12 col-lg-12 col-xl-{0}">
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
  updatetss:function(){
    const self=this;
    self.getData(function(data){
      // console.log(data)
      if(!(self.charted)){self.chart=new Chart(extend(self.properties,{data:data}))}
      else{self.chart.update(data)};
    });
  },
  getData:function(callback){
    const self=this;
    const station=this.parent.stations.find(station=>station.id==self.stationid);
    const data=[];
    const _getTS = function(ts_select,_callback){
      station.getTSValues(ts_select,function(err,ts){
        if(err)console.log(ts);
        data.push(ts);
        _callback();
      });
    }
    async.eachSeries(this.ts_select,_getTS,function(err){
      if(err)console.log("Error in async each")
      callback(data);  
    })
  },

  
};
Object.assign(Card.prototype,Base.prototype);
Card.prototype.constructor = Card;




  // get_ts:function(callback){
  //   const self=this;
  //   self.get_tss(function(){
  //     const getTSValues = function(ts,_callback){
  //       // console.log(ts.ts_id)
  //       // console.time(ts.ts_id)
  //       self.parent.api.getTSValues(ts.ts_id,function(err,data){
  //         // console.timeEnd(ts.ts_id)
  //         if(err)console.log(data);
  //         ts.data=data;
  //         _callback();
  //       });
  //     }
  //     async.eachSeries(self.tss,getTSValues,function(err){
  //       if(err)console.log("Error in async each")
  //       callback();  
  //     })
  //   });
  // },
  // updateTimeseries:function(){
  //   const self=this;
  //   const station=this.parent.stations.find(station=>station.id==self.stationid);
    
    
    
    
  // },
  // get_tss:function(callback){
  //   const self=this;
  //   if(!(self.tss)){
      
  //     // const ts_select = self.ts_select = [{ts_name:'LVL.15.P',"parametertype_name": "Stage"},{ts_name:'LVL.15.O',"parametertype_name": "Stage"},{ts_name:'Q.15',"parametertype_name": "Q"}];
  //     self.parent.api.getTimeseriesList(self.stationid,function(err,data){
  //       if(err)console.log(data);
  //       // console.log(data)
  //       // const data = JSON.parse(_data)
  //       // console.log(
  //       self.tss=self.ts_select.map(select=>data.find(ts=>ts.ts_name==select));
  //       // console.log(self.tss)
  //       callback();
  //     });  
  //   } else{
  //     callback();
  //   }
  // },