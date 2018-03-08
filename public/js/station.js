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
  get tslAll(){
    const self=this;
    if(!(this._tslAll))this._tslAll = (async function(){return await self.parent.api.getTimeseriesList(self.id)})();
    return this._tslAll;
  },
  get tsl(){
    const self=this;
    if(!(this._tsl))this._tsl = (async function(){const tslAll= await self.tslAll;return  self.ts_select.map(select=>tslAll.find(ts=>ts.ts_name==select))})();
    return this._tsl;
  },
  getTSValues:async function(ts_name){
    const tsl=await this.tsl;
    const ts=tsl.find(ts=>ts.ts_name==ts_name);
    if(!(ts.data))ts.data=await this.parent.api.getTSValues(ts);
    return ts;
  },
  getCurrentValue:async function(ts_name){//'LVL.1.O'
    const tsl=await this.tsl;
    const ts = tsl.find(ts=>ts.ts_name==ts_name);
    const x=ts.data.data[0].data.map(row=>row[0]);
    const y=ts.data.data[0].data.map(row=>row[1]);
    return y[0];
  },
  testTSValues:async function(){
    // TODO: TEST this...
    const tslAll = await this.tslAll;
    const tss=tslAll.filter(ts=>ts.ts_name.includes('Precip.')||ts.ts_name.includes('LVL.')||ts.ts_name.includes('Q.'));
       
    const array=[];  
    tss.forEach(async ts=>{
      const data=await this.parent.api.getTSValues(ts);
       if(data[0].data.length>0){array.push(ts.ts_name);console.log('active station {0} - {1} '.format(this.id, ts.ts_name));}
       else{console.log('NOT station {0} - {1} '.format(this.id, ts.ts_name));}
    },this);
    console.log(JSON.stringify({title:this.title,active:array}));  
  }
  
  
  
};
Object.assign(Station.prototype,Base.prototype);
Station.prototype.constructor = Station;