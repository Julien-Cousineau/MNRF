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
  getTSValues:async function(ts){
    const id = ts.ts_id;
    const name = ts.ts_name;
    // const from =(name.includes('15.P') || name.includes('15.O') || name.includes('1.P') ||name.includes('15.O'))? new Date().addHours(-24*1*1).yyyymmdd():new Date().addHours(-24*7*4*8).yyyymmdd();
    const from = new Date().addHours(-24*7*4*6).yyyymmdd();
    // const from = new Date().addHours(-24*7).yyyymmdd();
    const to = new Date().yyyymmdd();
    // console.log(from,to)
    // &metadata=true&md_returnfields=ts_unitname
    const url = '/KiWIS?service=kisters&type=queryServices&request=getTimeseriesValues&datasource=0&metadata=true&md_returnfields=ts_unitname&format=dajson&ts_id={0}&from={1}&to={2}'.format(id,from,to);
    // const url='data/{0}.json'.format(id)
    
    const data = await this.json(url);
    // const offset=new Date().getTimezoneOffset()/60;
    data[0].data=data[0].data.map(row=>[new Date(row[0]),row[1]])
    return data;
  },  
  getPhotoInfo:async function(id){
    const url = 'https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=87920266b5ecd6a632f152ec4873533d&photo_id={0}&format=json&nojsoncallback=1'.format(id);
    return await this.json(url);
  },
  getPhotos:async function(){
    const date = new Date().addHours(-48*1*1).yyyymmdd(); // 24hours x 1 days x 1 week 
    const url ='https://api.flickr.com/services/rest/?method=flickr.people.getPhotos&api_key=87920266b5ecd6a632f152ec4873533d&user_id=145447898%40N03&min_upload_date={0}&per_page=500&format=json&nojsoncallback=1'.format(date) ;
    // const url='data/getphotos.json'
    return await this.json(url);
  },
  getTimeseriesList:async function(id){
    const url =`/KiWIS?service=kisters&type=queryServices&request=getTimeseriesList&datasource=0&format=objson&station_id={0}`.format(id);
    // const url='data/gettimeserieslist.json'
    return await this.json(url);
  },
  getRadarList:async function(){
    const url ='/getradarlist';
    return await this.json(url);
  },
  getGeoMet:async function(){
     const url =`https://geo.weather.gc.ca/geomet-beta?service=WMS&version=1.3.0&request=GetCapabilities`;
     return await this.xml(url);
  },
  json:async function(url){
    try {
      const result = await $.ajax(url,{
        dataType:'json',
      });
        return result;
    } catch (error) {
        console.error(error);
    }
  },
  xml:async function(url){
    try {
      const result = await $.ajax(url,{
        dataType:'xml',
      });
        return result;
    } catch (error) {
        console.error(error);
    }
  },  
    
// (async function getData(url) {
//   const dataset = await $.ajax(url);
//   // document.querySelector('.joke').innerHTML = dataset.value.joke;
// })    

  
};
Object.assign(Api.prototype,Base.prototype);
Api.prototype.constructor = Api;