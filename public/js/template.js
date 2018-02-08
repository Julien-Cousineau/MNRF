/*global $,Base,extend*/
function Template(options){
  this.properties ={
    
  };
  this.properties=extend(this.properties,options);
  Base.call(this,this.properties);
}
Template.prototype = {
  
};
Object.assign(Template.prototype,Base.prototype);
Template.prototype.constructor = Template;