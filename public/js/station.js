/*global $,Base,extend*/
function Station(options){
  this.properties ={
      id:'',
      title:'',
      webcams:[],
      // ts_select:[],
      // tsl:[],
  };
  this.properties=extend(this.properties,options);
  Base.call(this,this.properties);
}
Station.prototype = {
  get ts_select(){
    if(!(this._ts_select)){
      let temp=[];
      this.cards.filter(card=>card.type=='ts').forEach(card=>{temp=temp.concat(card.ts_select)});
      this._ts_select=temp.filter((x, i, a) => a.indexOf(x) == i);
    }
    return this._ts_select;
  },
  getTimeseriesList:function(callback){
    if(!(this.tsl)){
      const self=this;
      self.parent.api.getTimeseriesList(self.id,function(err,data){
        if(err)console.log(data);
  
        self.tslAll=data;
        self.tsl=self.ts_select.map(select=>data.find(ts=>ts.ts_name==select));
        callback();
      });  
    } else{callback();}
  },
  // getTSValuesAll:function(callback){
  //   const self=this;
  //   this.getTimeseriesList(function(){
  //     const getTSValues = function(ts,_callback){
  //       self.parent.api.getTSValues(ts.ts_id,function(err,data){
  //         if(err)console.log(data);
  //         ts.data=data;
  //         _callback();
  //       });
  //     }
  //     async.eachSeries(self.tsl,getTSValues,function(err){
  //       if(err)console.log("Error in async each")
  //       callback();  
  //     })
  //   })
  // },
  getTSValues:function(ts_name,callback){
    const self=this;
    this.getTimeseriesList(function(){
      const ts=self.tsl.find(ts=>ts.ts_name==ts_name);
      if(!(ts.data)){
      self.parent.api.getTSValues(ts,function(err,data){
        if(err)console.log(data);
        ts.data=data;
        callback(false,ts);
      });
      } else { callback(false,ts);}
    });
 
  },
  getCurrentValue:function(ts_name){//'LVL.1.O'
    const ts = this.tsl.find(ts=>ts.ts_name==ts_name);
    const x=ts.data.data[0].data.map(row=>row[0]);
    const y=ts.data.data[0].data.map(row=>row[1]);
    return y[0];
  },
  testTSValues:function(callback){
    const self=this;
    this.getTimeseriesList(function(){
       const tss=self.tslAll.filter(ts=>ts.ts_name.includes('Precip.')||ts.ts_name.includes('LVL.')||ts.ts_name.includes('Q.'));
       
       const array=[]
       const _getTSValues = function(ts,_callback){
           self.parent.api.getTSValues(ts,function(err,data){
           if(err)return console.log(data);
           if(data[0].data.length>0){array.push(ts.ts_name);console.log('active station {0} - {1} '.format(self.id, ts.ts_name));}
           else{console.log('NOT station {0} - {1} '.format(self.id, ts.ts_name));}
           _callback();
         });
       }
       async.eachSeries(tss,_getTSValues,function(err){
        if(err)console.log("Error in async each")
        console.log(JSON.stringify({title:self.title,active:array}))
        callback();  
      })
    })
   
    
    
  }
  
  
  
};
Object.assign(Station.prototype,Base.prototype);
Station.prototype.constructor = Station;