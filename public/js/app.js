/*global $,Base,Header,Dashboard,Api*/
$(document).ready( function () {
  new App();
});
function App(){
  this.properties ={
    language:'en',
    keywords:{
      titles:{'en':"Ministry of",'fr':"Ministère des"},
      titlel:{'en':" Natural Resources and Forestry",'fr':" Richesses naturelles et des Forêts"},
      titlec:{'en':"Far North Dashboard",'fr':"Tableau de bord du Grand Nord"},
      language:{'en':"Français",'fr':"English"},
      about:{'en':"About",fr:"Info"},
      abouttitle:{'en':"About the Far North Dashboard",fr:"À propos du tableau de bord du Grand Nord"},
    },
    rivers:[
        {id:'albanyriver',title:'Albany River',active:true,stations:[
                                                                    {title:'Station 1',id:"1",cards:[{title:'WebCam',type:'webcam',photoid:'04HA001_ALBANY_RV'},{title:'Time-Series',type:'ts'},{title:'Gauge',type:'gauge'}]},
                                                                    {title:'Station 2',id:"2",cards:[{title:'WebCam',type:'webcam',photoid:'04HA002_Albany_Rv_@Fishing'},{title:'Time-Series',type:'ts'},{title:'Gauge',type:'gauge'}]}
                                                                    ]},
        {id:'attawapiskatriver',title:'Attawapiskat River',active:false,stations:[
                                                                    {title:'Station 1',id:"1",cards:[{title:'WebCam',type:'webcam',photoid:'04HA001_ALBANY_RV'},{title:'Time-Series',type:'ts'}]},
                                                                    ]},
        {id:'mooseriver',title:'Moose River',active:false,stations:[
                                                                   {title:'Station 1',id:"1",cards:[{title:'WebCam',type:'webcam',photoid:'04HA001_ALBANY_RV'}]}
                                                                   ]},
        {id:'winiskriver',title:'Winisk River',active:false,stations:[
                                                                   {title:'Station 1',id:"1",cards:[{title:'WebCam',type:'webcam',photoid:'04HA001_ALBANY_RV'}]},
                                                                   {title:'Station 2',id:"2",cards:[{title:'WebCam',type:'webcam',photoid:'04HA002_Albany_Rv_@Fishing'}]}
                                                                   ]},
      ]
  };
  Base.call(this,this.properties);
  const self=this;
  const pointer = function(){return self;}
  const header=this.header=new Header({parent:pointer});
  const dashboard=this.dashboard=new Dashboard({parent:pointer,rivers:this.rivers});
  const map=this.map=new Map({parent:pointer});
  const api=this.api=new Api({parent:pointer});
  // this.getPhotos();
  this.update();
  
}
App.prototype = {
  changeLanguageToggle:function() {
    if(this.debug)console.log('Change Language Toggle');
    this.language= (this.language==='en') ? 'fr':'en';
    this.changeLabels();
  },
  changeLabels:function() {
    const self=this;
    $("*[keyword]").each(function(){
      const keyword=$(this).attr("keyword");
      const keywordType=$(this).attr("keywordtype");
      if(keywordType==="text")return $(this).text(self.keywords[keyword][self.language]);
    });
  },
  

  update:function(callback){
    $('.card-body').addClass("chart-loading-overlay");
    $('.card-body').append(`<div class="loading-widget-dc"><div class="main-loading-icon"></div></div>`);
    
    const self=this;
    self.api.getPhotos(function(err,data){
      if(err)return console.log(data);
      self.updatePhotos(data.photos.photo);
    });
  },
  updatePhotos:function(_photos){
    this.rivers.forEach(river=>{
      river.stations.forEach(station=>{
        if(station.cards.find(card=>card.type=='webcam')){
         const card = station.cards.find(card=>card.type=='webcam');
         const photosbyname = _photos.reduce((acc,photo)=>{if(photo.title.includes(card.photoid))acc.push(photo);return acc;},[]);
         photosbyname.forEach(photo=>{
           const datestr = photo.title.split("_").pop().split(".")[0];
           const year=datestr.substr(0,4),month=datestr.substr(4,2),day=datestr.substr(6,2),hour=datestr.substr(8,2);
           photo.date = new Date(parseInt(year),parseInt(month-1),parseInt(day),parseInt(hour));
         });
         const photosbydate =photosbyname.sort(function(a,b){return b.date - a.date;});
         const latestphoto = photosbydate[0];
         const src = `https://c1.staticflickr.com/{0}/{1}/{2}_{3}_b.jpg`.format(latestphoto.farm,latestphoto.server,latestphoto.id,latestphoto.secret)
         console.log($('[_riverid="{0}"] [_stationid="{1}"] [_type="{2}"] img'.format(river.id, station.id,'webcam')))
         $('[_riverid="{0}"] [_stationid="{1}"] [_type="{2}"] img'.format(river.id, station.id,'webcam')).attr("src", src)
         $('[_riverid="{0}"] [_stationid="{1}"] [_type="{2}"]'.format(river.id, station.id,'webcam')).removeClass("chart-loading-overlay");
         $('[_riverid="{0}"] [_stationid="{1}"] [_type="{2}"] .loading-widget-dc'.format(river.id, station.id,'webcam')).remove();
        }
      },this)
    },this)  
  },
  
  getPhoto:function(id){
    const self=this;
    self.api.getPhotos(function(err,data){
      if(err)return console.log(data);
      self.parent.photos=data.photos.photo;
    });
  }
  
    
};
Object.assign(App.prototype,Base.prototype);
App.prototype.constructor = App;
