const extend = function (dest, src) {
    for (var i in src) dest[i] = src[i];
    return dest;
};
// String formatter
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

Date.prototype.addHourss = function(h) {    
   this.setTime(this.getTime() + (h*60*60*1000)); 
   return this;   
};
String.prototype.padZero= function(len, c){
    var s= '', c= c || '0', len= (len || 2)-this.length;
    while(s.length<len) s+= c;
    return s+this;
};
Number.prototype.padZero= function(len, c){
    return String(this).padZero(len,c);
};

Date.prototype.flickr = function() {
   var yyyy = this.getFullYear();
   var mm = this.getMonth();
   var dd  = this.getDate(); 
   return "{0}-{1}-{2}".format(yyyy,mm.padZero(2),dd.padZero(2));
};
	