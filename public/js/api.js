/*global $,Base,extend*/
function Api(options){
  this.properties ={
    
  };
  this.properties=extend(this.properties,options);
  Base.call(this,this.properties);
  // this.getPhotos();
}
Api.prototype = {
  // getWebcam:function(){
  //   this.rivers.forEach(river=>{
  //     river.stations.forEach(station=>{
  //       if(station.cards.find(card=>card.type=='webcam')){
  //         const date= Date.now().addHours(-24*7*1).flickr(); // 24hours x 7 days x 1 week 
  //         const url ='https://api.flickr.com/services/rest/?method=flickr.people.getPhotos&api_key=87920266b5ecd6a632f152ec4873533d&user_id=145447898%40N03&min_upload_date={0}&per_page=500&format=json'.format(date) 
  //         $.ajax(url,{
  //           dataType:'json',
  //           success:function(data){console.log(data)},
  //           error:function(err,text){console.log(text)}
  //         })
  //       }
  //     },this)
  //   },this)  
  // },
  getTSValues(ts, callback){
    const id = ts.ts_id;
    const name = ts.ts_name;
    const from =(name.includes('15.P') || name.includes('15.O') || name.includes('1.P') ||name.includes('15.O'))? new Date().addHours(-24*1*1).yyyymmdd():new Date().addHours(-24*7*4*8).yyyymmdd();
    const to = new Date().yyyymmdd();
    // console.log(from,to)
    const url = '/KiWIS?service=kisters&type=queryServices&request=getTimeseriesValues&datasource=0&format=dajson&ts_id={0}&from={1}&to={2}'.format(id,from,to);
    // const url='data/{0}.json'.format(id)
    this.json(url,callback)
  },  
  getPhotoInfo(id, callback){
    const url = 'https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=87920266b5ecd6a632f152ec4873533d&photo_id={0}&format=json&nojsoncallback=1'.format(id);
    this.json(url,callback)
  },
  getPhotos(callback){
    const date = new Date().addHours(-24*1*1).yyyymmdd(); // 24hours x 1 days x 1 week 
    const url ='https://api.flickr.com/services/rest/?method=flickr.people.getPhotos&api_key=87920266b5ecd6a632f152ec4873533d&user_id=145447898%40N03&min_upload_date={0}&per_page=500&format=json&nojsoncallback=1'.format(date) 
    // const url='data/getphotos.json'
    this.json(url,callback)
  },
  getTimeseriesList(id,callback){
    const url =`/KiWIS?service=kisters&type=queryServices&request=getTimeseriesList&datasource=0&format=objson&station_id={0}`.format(id);
    // const url='data/gettimeserieslist.json'
    this.json(url,callback)
  },
  json:function(url,callback){
    $.ajax(url,{
      dataType:'json',
      success:function(data){
        callback(false,data)
      },
      error:callback
    })
  }
    
  
};
Object.assign(Api.prototype,Base.prototype);
Api.prototype.constructor = Api;