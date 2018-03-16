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
      radarsat:{'en':"Radarsat",fr:"Radarsat"},
      basemap:{'en':"Basemap",fr:"Carte de base"},
      precipitation:{'en':"Precipitation",fr:"Précipitation"},
      icechart:{'en':"Ice Chart",fr:"Carte de glace"},
      stations:{'en':"Stations",fr:"Stations"},
      weatherstations:{'en':"Weather Stations",fr:"Stations météorologiques"},
      gaugestations:{'en':"Gauge Stations",fr:"Stations marégraphiques"},
      opacity:{'en':"Opacity",fr:"Opacité"},
      recherche:{'en':"Search",fr:"Recherche"},
      search:{'en':"Search",fr:"Recherche"},
      camera:{'en':"Camera",fr:"Caméra"},
      timeseries:{'en':"Time-series",fr:"Séries chronologique"},
      
      about:{'en':"Disclaimer",fr:"Avertissement"},
      abouttitle:{'en':"Disclaimer for the Far North Dashboard from the Ministry of Natural Resources and Forestry",fr:"Avertissement du tableau de bord du Grand Nord du Ministère des Richesses naturelles et des Forêts"},
      accept:{'en':"I Agree",fr:"J'accepte"},
      aboutcontent:{'en':`
      <p>Please Read Before Proceeding:<br><br>
         Users should use the information on this website with caution and do so at their own risk. The Government of Ontario accepts no liability for the accuracy, availability, suitability, reliability, usability, completeness or timeliness of the data or graphical depictions rendered from the data.<br><br>
         The near real-time information presented on this website is received via satellite or land-line transmissions from hydrometric gauging stations operated by the Ministry of Natural Resources and Forestry and its Partners. These data are normally posted within six hours of observation. The data are preliminary and have been transmitted automatically with limited verification and review for quality assurance. Subsequent quality assurance and verification procedures may result in differences between what is currently displayed and what will become the official record.<br><br>
         It is the responsibility of all persons who use this site to independently confirm the accuracy of the data, information, or results obtained through its use.<br><br>
         The Government of Ontario does not warrant the quality, accuracy, or completeness of any information, data or product from these web pages. It is provided 'AS IS' without warranty or condition of any nature. The Government of Ontario disclaims all other warranties, expressed or implied, including but not limited to implied warranties of merchantability and fitness for a particular purpose, with respect to the information, data, product or accompanying materials retrieved from this web site. In no event will the Government of Ontario or its employees, servants or agents have any obligation to the user for any reason including claims arising from contract or tort, or for loss of revenue or profit, or for indirect, special, incidental or consequential damages arising from the use of this information.<br><br>
         Information presented on this web site is considered public information and may be distributed or copied. No agency or individual can bundle the raw information and resell the raw information. However, agencies and individuals may add value to the data and charge for the value added options. An appropriate byline acknowledging the Ministry of Natural Resources and Forestry is required.<br><br>
         Your proceeding beyond this Disclaimer will constitute your acceptance of the terms and conditions outlined above.
      </p>      
      `, fr:`
        <p>Veuillez lire ceci avant de procéder :<br><br>
          Les utilisateurs devraient utiliser l'information présentée sur ce site Web avec prudence, et ce, à leurs risques. Le gouvernement de l'Ontario n'est pas responsable de l'exactitude, de la disponibilité, de la qualité, de la fiabilité, de la convivialité, de l'exhaustivité ou de l'actualité des données ou des représentations graphiques qui en découlent.<br><br>
          L'information en temps quasi réel présentée sur ce site Web provient des stations hydrométriques exploitées par le Ministère des Richesses naturelles et des Forêts et/ou à ses partenaires, qui les transmettent via satellite ou en ligne. Les données sont habituellement affichées (en format graphique) dans les six heures suivant l'observation.<br><br>
          Les données sont préliminaires et ont été transmises automatiquement sans être vérifiées ou examinées pour en garantir la qualité. Une assurance de la qualité et des vérifications ultérieures pourrait entraîner des différences entre l'information affichée et celle qui paraîtra dans le dossier officiel.<br><br>
          Il incombe aux utilisateurs de confirmer indépendamment l'exactitude des données, de l'information ou des résultats obtenus lors de leur utilisation.<br><br>
          Le gouvernement de l'Ontario ne garantit pas la qualité, l'exactitude ou l'exhaustivité de l'ensemble de l'information, des données ou des produits de ces pages Web. Les renseignements sont fournis « TELS QUELS » sans garantie ou condition que ce soit. Le gouvernement de l'Ontario décline toute autre garantie, expresse ou tacite, y compris sans s'y limiter, les garanties implicites de qualité marchande et la pertinence à une fin particulière de l'information, des données, des produits ou des documents à l'appui contenus sur ce site Web. En aucun cas le gouvernement de l'Ontario ou ses employés, fonctionnaires ou agents n'auront d'obligation envers l'utilisateur pour toute raison que ce soit, y compris les allégations découlant d'un contrat ou d'une responsabilité délictuelle, ou pour perte de revenus ou de bénéfices, ou pour des dommages spéciaux, accessoires, indirects ou consécutifs découlant de l'utilisation de cette information.<br><br>
          L'information présentée sur ce site Web est considérée comme publique et peut être distribuée ou reproduite. Aucun organisme ni individu ne peut regrouper les données brutes afin de les revendre. Toutefois, des organismes ou des individus peuvent réclamer pour toutes valeurs ajoutées aux données. Une note doit toutefois mentionner la contribution initiale du Ministère des Richesses naturelles et des Forêts. Pour plus de détails, veuillez consulter les modalités et conditions concernant le droit d'auteur.<br><br>
          Si vous décidez de continuer, vous vous trouvez à accepter les conditions susmentionnées.<br><br>
        </p> 
      `},
    },
    cards:[],
    wstations:[
        {id:"131136",ts_select:['Precip.1.O'],cards:[]},
    ],
    rivers:[
        {id:'albanyriver',title:'Albany River',active:true,stations:[
          {title:'Albany River near Hat Island (04HA001)',id:"146399",thresholds:[{name:'low',LVL:3.3,Q:1500,color:'#c0ca33'}, {name:'mid',LVL:4.29,Q:3000,color:'#fdd835'}, {name:'high',LVL:5.14,Q:4500,color:'#ff9800'}, {name:'ext',LVL:5.9,Q:6000,color:'#f44336'}],
          cards:[
            {title:'camera',type:'webcam',photoid:'04HA001_ALBANY_RV'},
            {title:'timeseries',type:'ts',charttype:'ts_2',ts_select:['LVL.1.O','Q.15'],precipid:'131136'},
            // {title:'Gauge',type:'gauge'}
            ]},
          {title:'Albany River above Fishing Creek Island (04HA002)',id:"146412",
          cards:[
            {title:'camera',type:'webcam',photoid:'04HA002_Albany_Rv_@Fishing'},
            {title:'timeseries',type:'ts',charttype:'ts_2',ts_select:['LVL.1.O','Q.15'],precipid:'131136'},
            // {title:'Gauge',type:'gauge'}
            ]},
          {title:'Stooping River above the Mouth (04HA003)',id:"481782",
          cards:[
            {title:'camera',type:'webcam',photoid:'04HA003_STOOPING_RV'},
            {title:'timeseries',type:'ts',charttype:'ts_2',ts_select:['LVL.1.O','Q.15'],precipid:'131136'},
            // {title:'Gauge',type:'gauge'}
            ]},
          {title:'Albany above Nottick Island (04GD001)',id:"146386",
          cards:[
            {title:'timeseries',type:'ts',charttype:'ts_2',ts_select:['LVL.1.O','Q.15'],precipid:'131136'},
            // {title:'Gauge',type:'gauge'}
            ]},
          {title:'Kenagami River near Mammamattawa (04JG001)',id:"146478",thresholds:[{name:'low',LVL:23.5,Q:0,color:'#c0ca33'}, {name:'mid',LVL:25.0,Q:0,color:'#fdd835'}, {name:'high',LVL:26.5,Q:0,color:'#ff9800'}, {name:'ext',LVL:28.0,Q:0,color:'#f44336'}],
          cards:[
            {title:'timeseries',type:'ts',charttype:'ts_2',ts_select:['LVL.1.O','Q.15'],precipid:'131136'},
            // {title:'Gauge',type:'gauge'}
            ]},
          {title:'Pagwachuan River at Hwy 11 (04JD005)',id:"146439",thresholds:[{name:'low',LVL:10.98,Q:101.5,color:'#c0ca33'}, {name:'mid',LVL:12.65,Q:203,color:'#fdd835'}, {name:'high',LVL:14.33,Q:304,color:'#ff9800'}, {name:'ext',LVL:16.0,Q:406,color:'#f44336'}],
          cards:[
            {title:'timeseries',type:'ts',charttype:'ts_2',ts_select:['LVL.1.O','Q.15'],precipid:'131136'},
            // {title:'Gauge',type:'gauge'}
            ]},
          {title:'Nagagami River at Hwy 11 (04JC002)',id:"146426",thresholds:[{name:'low',LVL:3.15,Q:40,color:'#c0ca33'}, {name:'mid',LVL:3.45,Q:135,color:'#fdd835'}, {name:'high',LVL:3.7,Q:200,color:'#ff9800'}, {name:'ext',LVL:3.99,Q:250,color:'#f44336'}],
          cards:[
            {title:'timeseries',type:'ts',charttype:'ts_2',ts_select:['LVL.1.O','Q.15'],precipid:'131136'},
            // {title:'Gauge',type:'gauge'}
            ]},
          {title:'Little Current River at Percy Lake (04JF001)',id:"146465",
          cards:[
            {title:'timeseries',type:'ts',charttype:'ts_2',ts_select:['LVL.1.O','Q.15'],precipid:'131136'},
            // {title:'Gauge',type:'gauge'}
            ]},            
          ]},
        {id:'attawapiskatriver',title:'Attawapiskat River',active:false,stations:[
            {title:'Attawapiskat (04FC001)',id:"146273",cards:[
              {title:'camera',type:'webcam',photoid:'04FC001_Attawapiskat_Rv'},
              {title:'timeseries',type:'ts',charttype:'ts_2',ts_select:['LVL.1.O','Q.15'],precipid:'131136'},
              ]},
            ]},
        {id:'mooseriver',title:'Moose River',active:false,stations:[
            {title:'Moose (04LG004)',id:"146658",cards:[
              {title:'camera',type:'webcam',photoid:'04LG004_Moose_Rv'},
              {title:'timeseries',type:'ts',charttype:'ts_2',ts_select:['LVL.1.O','Q.15'],precipid:'131136'},
              ]}
            ]},
        {id:'winiskriver',title:'Winisk River',active:false,stations:[
            {title:'Winisk (04DC001)',id:"146172",cards:[
              {title:'camera',type:'webcam',photoid:'04DC001_Winisk_Rv'},
              {title:'timeseries',type:'ts',charttype:'ts_2',ts_select:['LVL.1.O','Q.15'],precipid:'131136'},
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
      // console.log(keyword)
      // console.log(keywordType)
      if(keywordType==="text")return $(this).text(self.keywords[keyword][self.language]);
      if(keywordType==="html")return $(this).html(self.keywords[keyword][self.language]);
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
    this.wstations.forEach(station=>{
      stations.push(new Station(extend(station,{parent:this.pointer})));
    },this);
    
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
      const year=datestr.substr(0,4),month=datestr.substr(4,2),day=datestr.substr(6,2),hour=datestr.substr(8,2),min=datestr.substr(10,2),sec=datestr.substr(12,2);
      photo.date = new Date(parseInt(year),parseInt(month-1),parseInt(day),parseInt(hour));
      photo.datelabel = '{0}-{1}-{2} {3}:{4}:{5}'.format(year,month,day,hour,min,sec)
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
