/*global $,Base,Header,Dashboard,Api,Card,extend*/
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
    cards:[],
    rivers:[
        {id:'albanyriver',title:'Albany River',active:true,stations:[
                                                                    {title:'Albany (04HA001)',id:"146399",cards:[{title:'Camera',type:'webcam',photoid:'04HA001_ALBANY_RV'},{title:'Time-Series',type:'ts'},{title:'Gauge',type:'gauge'}]},
                                                                    {title:'Albany (04HA002)',id:"146412",cards:[{title:'Camera @ Fishing',type:'webcam',photoid:'04HA002_Albany_Rv_@Fishing'},{title:'Time-Series',type:'ts'},{title:'Gauge',type:'gauge'}]},
                                                                    {title:'Albany (04HA003)',id:"481782",cards:[{title:'Camera @ Stooping',type:'webcam',photoid:'04HA003_STOOPING_RV'},{title:'Time-Series',type:'ts'},{title:'Gauge',type:'gauge'}]}
                                                                    ]},
        {id:'attawapiskatriver',title:'Attawapiskat River',active:false,stations:[
                                                                    {title:'Attawapiskat (04FC001)',id:"146273",cards:[{title:'Camera',type:'webcam',photoid:'04FC001_Attawapiskat_Rv'},{title:'Time-Series',type:'ts'}]},
                                                                    ]},
        {id:'mooseriver',title:'Moose River',active:false,stations:[
                                                                  {title:'Moose (04LG004)',id:"146658",cards:[{title:'Camera',type:'webcam',photoid:'04LG004_Moose_Rv'}]}
                                                                  ]},
        {id:'winiskriver',title:'Winisk River',active:false,stations:[
                                                                  {title:'Winisk (04DC001)',id:"146172",cards:[{title:'Camera',type:'webcam',photoid:'04DC001_Winisk_Rv'}]},
                                                                  ]},
      ]
  };
  
  Base.call(this,this.properties);
  const self=this;
  const pointer = this.pointer = function(){return self;};
  this.cards=this.createCards();
  
  
  this.header=new Header({parent:pointer});
  this.dashboard=new Dashboard({parent:pointer,rivers:this.rivers});
  this.map=new Map({parent:pointer});
  this.api=new Api({parent:pointer});
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
    self.updateTimeseries();
    
    
  },
  createCards:function(){
    const self=this;
    const cards = [];
    this.rivers.forEach(river=>{
      river.stations.forEach(station=>{
        const ncards = station.cards.length;
        station.cards.forEach((card,i)=>cards.push(new Card(extend(card,{parent:self.pointer,riverid:river.id,stationid:station.id,cols:(i==0)?4:8/(ncards-1)}))),this);
      },this);
    },this);
    return cards;
  },
  updateTimeseries:function(){
    this.cards.filter(card=>card.type=='ts').forEach(card=>{
      card.updatetss();
    },this);
    
    // this.api.getTSValues('967808042',function(err,data){
    //   if(err)return console.log(data);
    //   const x=data[0].data.map(row=>row[0]);
    //   const y=data[0].data.map(row=>row[1]);
    //   console.log(x,y);
    //   var data = [
    //     {
    //       x: x,
    //       y: y,
    //       type: 'scatter'
    //     }
    //   ];
    //   var layout = {
    //     autosize: true,
    //     // width: 500,
    //     height: 200,
    //     margin: {
    //       l: 30,
    //       r: 30,
    //       b: 30,
    //       t: 10,
    //       pad: 0
    //     },
    //     // paper_bgcolor: '#7f7f7f',
    //     // plot_bgcolor: '#c7c7c7'
    //   };
      
    //   Plotly.newPlot('ts_id_967808042', data,layout);
    //   // self.updatePhotos(data.photos.photo);      
    // });
  },
  parseData:function(){
    
  },
  parseDate:function(photos){
    return photos.map(photo=>{
      const datestr = photo.title.split("_").pop().split(".")[0];
      const year=datestr.substr(0,4),month=datestr.substr(4,2),day=datestr.substr(6,2),hour=datestr.substr(8,2);
      photo.date = new Date(parseInt(year),parseInt(month-1),parseInt(day),parseInt(hour));
      return photo;
    });
  },
  updatePhotos:function(_photos){
    const photos =this.parseDate(_photos).sort(function(a,b){return b.date - a.date;});
    this.cards.filter(card=>card.type=='webcam').forEach(card=>{
      const photosbyname = photos.reduce((acc,photo)=>{if(photo.title.includes(card.photoid))acc.push(photo);return acc;},[]);
      card.updatewebcam(photosbyname[0]);
    },this);
  },

    
};
Object.assign(App.prototype,Base.prototype);
App.prototype.constructor = App;
