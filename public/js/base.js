/*global extend */
function Base(options){
    const _options={
      debug:true,
    };
    this.options=extend(_options, options);
    this._defineProperties();
}
Base.prototype = {
  _defineProperties(){
    Object.keys(this.options).forEach(key=>{
      Object.defineProperty(this, key,{
           configurable: true,
           get:function() {return (key=='parent')?this.options[key]():this.options[key];},
           set:function(value) {this.options[key]=value;}
           });      
    });  
  },
};