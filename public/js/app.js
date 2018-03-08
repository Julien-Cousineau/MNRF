/*global $,Base,Header,Dashboard,Api,Card,extend,Station,Chart*/
$(document).ready( function () {
  new App();
});
 // {"title":"Albany (04HA001)","active":["Q.DayRunoff","Q.15","Q.DayMin","Q.DayMax","Q.DayMean","LVL.15.P","LVL.DayMax","LVL.15.O","LVL.DayMean","LVL.DayMin","LVL.1.O"]}
 // {"title":"Albany (04HA002)","active":["LVL.1.O","LVL.15.P","LVL.15.O","LVL.DayMax","LVL.DayMin","LVL.DayMean","Q.15","Q.DayMax","Q.DayMean","Q.DayRunoff","Q.DayMin"]}
 // {"title":"Albany (04HA003)","active":["Q.15","Q.DayRunoff","Q.DayMax","Q.DayMean","Q.DayMin","LVL.15.O","LVL.DayMin","LVL.15.P","LVL.DayMax","LVL.1.O","LVL.DayMean"]}
 // {"title":"Attawapiskat (04FC001)","active":["Q.DayMax","Q.DayMin","Q.15","Q.DayMean","Q.DayRunoff","LVL.1.O","LVL.DayMin","LVL.15.P","LVL.15.O","LVL.DayMax","LVL.DayMean"]}
 // {"title":"Moose (04LG004)","active":["Q.15","Q.DayMax","Q.DayRunoff","Q.DayMean","Q.DayMin","LVL.15.O","LVL.DayMax","LVL.1.O","LVL.DayMean","LVL.15.P","LVL.DayMin"]}
 // {"title":"Winisk (04DC001)","active":["Q.DayMax","Q.15","Q.DayRunoff","Q.DayMin","Q.DayMean","LVL.DayMean","LVL.15.O","LVL.15.P","LVL.DayMax","LVL.1.O","LVL.DayMin"]}
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
          {title:'Albany River near Hat Island (04HA001)',id:"146399",
          cards:[
            {title:'Camera',type:'webcam',photoid:'04HA001_ALBANY_RV'},
            {title:'Time-Series',type:'ts',charttype:'ts_2',ts_select:['LVL.1.O','Q.15']},
            // {title:'Gauge',type:'gauge'}
            ]},
          {title:'Albany River above Fishing Creek Island (04HA002)',id:"146412",thresholds:[{name:'low',LVL:3.3,Q:1500,color:'#c0ca33'}, {name:'mid',LVL:4.29,Q:3000,color:'#fdd835'}, {name:'high',LVL:5.14,Q:4500,color:'#ff9800'}, {name:'ext',LVL:5.9,Q:6000,color:'#f44336'}],
          cards:[
            {title:'Camera @ Fishing',type:'webcam',photoid:'04HA002_Albany_Rv_@Fishing'},
            {title:'Time-Series',type:'ts',charttype:'ts_2',ts_select:['LVL.1.O','Q.15']},
            // {title:'Gauge',type:'gauge'}
            ]},
          {title:'Stooping River above the Mouth (04HA003)',id:"481782",
          cards:[
            {title:'Camera @ Stooping',type:'webcam',photoid:'04HA003_STOOPING_RV'},
            {title:'Time-Series',type:'ts',charttype:'ts_2',ts_select:['LVL.1.O','Q.15']},
            // {title:'Gauge',type:'gauge'}
            ]},
          {title:'Albany above Nottick Island (04GD001)',id:"146386",
          cards:[
            {title:'Time-Series',type:'ts',charttype:'ts_2',ts_select:['LVL.1.O','Q.15']},
            // {title:'Gauge',type:'gauge'}
            ]},
          {title:'Kenagami River near Mammamattawa (04JG001)',id:"146478",thresholds:[{name:'low',LVL:23.5,Q:0,color:'#c0ca33'}, {name:'mid',LVL:25.0,Q:0,color:'#fdd835'}, {name:'high',LVL:26.5,Q:0,color:'#ff9800'}, {name:'ext',LVL:28.0,Q:0,color:'#f44336'}],
          cards:[
            {title:'Time-Series',type:'ts',charttype:'ts_2',ts_select:['LVL.1.O','Q.15']},
            // {title:'Gauge',type:'gauge'}
            ]},
          {title:'Pagwachuan River at Hwy 11 (04JD005)',id:"146439",thresholds:[{name:'low',LVL:10.98,Q:101.5,color:'#c0ca33'}, {name:'mid',LVL:12.65,Q:203,color:'#fdd835'}, {name:'high',LVL:14.33,Q:304,color:'#ff9800'}, {name:'ext',LVL:16.0,Q:406,color:'#f44336'}],
          cards:[
            {title:'Time-Series',type:'ts',charttype:'ts_2',ts_select:['LVL.1.O','Q.15']},
            // {title:'Gauge',type:'gauge'}
            ]},
          {title:'Nagagami River at Hwy 11 (04JC002)',id:"146426",thresholds:[{name:'low',LVL:3.15,Q:40,color:'#c0ca33'}, {name:'mid',LVL:3.45,Q:135,color:'#fdd835'}, {name:'high',LVL:3.7,Q:200,color:'#ff9800'}, {name:'ext',LVL:3.99,Q:250,color:'#f44336'}],
          cards:[
            {title:'Time-Series',type:'ts',charttype:'ts_2',ts_select:['LVL.1.O','Q.15']},
            // {title:'Gauge',type:'gauge'}
            ]},
          {title:'Little Current River at Percy Lake (04JF001)',id:"146465",
          cards:[
            {title:'Time-Series',type:'ts',charttype:'ts_2',ts_select:['LVL.1.O','Q.15']},
            // {title:'Gauge',type:'gauge'}
            ]},            
          ]},
        {id:'attawapiskatriver',title:'Attawapiskat River',active:false,stations:[
            {title:'Attawapiskat (04FC001)',id:"146273",cards:[
              {title:'Camera',type:'webcam',photoid:'04FC001_Attawapiskat_Rv'},
              {title:'Time-Series',type:'ts',charttype:'ts_2',ts_select:['LVL.1.O','Q.15']},
              ]},
            ]},
        {id:'mooseriver',title:'Moose River',active:false,stations:[
            {title:'Moose (04LG004)',id:"146658",cards:[
              {title:'Camera',type:'webcam',photoid:'04LG004_Moose_Rv'},
              {title:'Time-Series',type:'ts',charttype:'ts_2',ts_select:['LVL.1.O','Q.15']},
              ]}
            ]},
        {id:'winiskriver',title:'Winisk River',active:false,stations:[
            {title:'Winisk (04DC001)',id:"146172",cards:[
              {title:'Camera',type:'webcam',photoid:'04DC001_Winisk_Rv'},
              {title:'Time-Series',type:'ts',charttype:'ts_2',ts_select:['LVL.1.O','Q.15']},
              ]},
            ]},
      ]
  };
  
  Base.call(this,this.properties);
  const self=this;
  const pointer = this.pointer = function(){return self;};
  this.stations = this.createStations();
  // this.cards=this.createCards();
  
  this.api=new Api({parent:pointer});
  this.header=new Header({parent:pointer});
  this.dashboard=new Dashboard({parent:pointer,rivers:this.rivers});
  this.map=new Map({parent:pointer});
  
  this.update();

  // this.getActiveTS();
  
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
  getActiveTS:function(){
    this.stations.forEach(station=>station.testTSValues(()=>{console.log("Done!")}));
  },
  update:async function(){
    $('.dashboard .card-body').addClass("chart-loading-overlay");
    $('.dashboard .card-body').append(`<div class="loading-widget-dc"><div class="main-loading-icon"></div></div>`);
    
    const data = await this.api.getPhotos();
    this.updatePhotos(data.photos.photo);
    this.updateTimeseries();
  },
  createStations:function(){
    const stations = [];
    
    this.rivers.forEach(river=>{river.stations.forEach(station=>{
        const ncards = station.cards.length;
        station.cards=station.cards.map((card,i)=>new Card(extend(card,{parent:this.pointer,riverid:river.id,stationid:station.id,cols:(i==0)?4:8/(ncards-1)})),this);
      stations.push(new Station(extend(station,{parent:this.pointer})));
    },this);},this);
    return stations;
  },
  updateTimeseries:function(){
    this.stations.forEach(station=>{
      station.cards.filter(card=>card.type=='ts').forEach(card=>card.updatetss());
    });
    
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
    this.stations.forEach(station=>{
      station.cards.filter(card=>card.type=='webcam').forEach(card=>{
        const photosbyname = photos.reduce((acc,photo)=>{if(photo.title.includes(card.photoid))acc.push(photo);return acc;},[]);
        card.updatewebcam(photosbyname[0]);
      },this);
    });
    
  },
};
Object.assign(App.prototype,Base.prototype);
App.prototype.constructor = App;
