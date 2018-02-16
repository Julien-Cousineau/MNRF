/*global $,Base,extend*/
function River(options){
  this.properties ={
      id:'',
      title:'',
      active:'',
      stations:[],
  };
  this.properties=extend(this.properties,options);
  Base.call(this,this.properties);
}
River.prototype = {
  
};
Object.assign(River.prototype,Base.prototype);
River.prototype.constructor = River;