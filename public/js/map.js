/*global $,Base,extend,mapboxgl,MapboxGeocoder,debounce,xml2json,range*/
function Map(options){
  this.properties ={
      id:'map',
      radarlist:false,
      accessToken:'pk.eyJ1Ijoic2ZlcmciLCJhIjoiY2l6OHF4eG85MDBwcTMybXB5dTY0MzlhNCJ9.Mt1hpCCddMlSvDiCtOQiUA',
      center:[-85.00,50.0],
      zoom:5,
      basemaps:[{id:'streets',active:false},{id:'light',active:true},{id:'dark',active:false},{id:'satellite',active:false},{id:'basic',active:false},{id:'outdoors',active:false}],
      container:'body',
      navigationcontrol:true,
      geocoder:true,
      style:'mapbox://styles/mapbox/light-v9',
      weatherOpacity:0.25,
      paint:{ // Default paint values for Mapbox
        ice:{
    		  'raster-opacity': 1,
        },
      },
      
      sources:[//All data sources
        {id:"stations",options:{type:"geojson",data:'data/stations.geojson'}},
        {id:"wstations",options:{type:"geojson",data:'data/weatherstations.geojson'}},
        // {id:"weather",options:{type:"raster", tileSize: 256,tiles:[ 'https://geo.weather.gc.ca/geomet/?LANG=E&SERVICE=WMS&VERSION=1.1.1&request=GetMap&LAYERS=RDPA.24F_PR&STYLE=PRECIPMM&format=image/png&bbox={bbox-epsg-3857}&srs=EPSG:3857&width=256&height=256&TRANSPARENT=true']}},
        // {id:"weather",options:{type:"raster", tileSize: 256,tiles:[ 'https://geo.weather.gc.ca/geomet-beta/?LANG=E&SERVICE=WMS&VERSION=1.1.1&request=GetMap&LAYERS=RDPA.24P_PR&STYLEPRECIPMM&format=image/png&bbox={bbox-epsg-3857}&srs=EPSG:3857&width=256&height=256&TRANSPARENT=true&time=2018-02-26T12:00:00Z']}},
        // {id:"ice",options:{type:"raster", tileSize: 256,scheme: "tms",tiles:['gis/RiverIceBreakupClassification_ON_AlbanyRiver_20170509_114458/{z}/{x}/{y}.png']}},
        // {id:"ice",options:{type:"geojson",data:'data/ice.geojson'}},
        // {id:"radarsat",options:{type:"image", url:'data/river.png',coordinates:[[-83.5458730875107,53.1986526149143],[-80.9045446620555,53.1986526149143],[-80.9045446620555,51.5953806566912],[-83.5458730875107,51.5953806566912]]}},
      ],
      layers:{//All layers - paint and filter are default values. This can change depending on the developer and client selection
        // weather:{id: 'weather',type: 'raster',source: {type:"raster", tileSize: 256,tiles:[ 'https://geo.weather.gc.ca/geomet-beta/?LANG=E&SERVICE=WMS&VERSION=1.1.1&request=GetMap&LAYERS=RDPA.24P_PR&STYLEPRECIPMM&format=image/png&bbox={bbox-epsg-3857}&srs=EPSG:3857&width=256&height=256&TRANSPARENT=true&time=2018-02-26T12:00:00Z']},paint:{'raster-opacity': 0.25}},
        stations:{id:'stations',type: 'circle',source: 'stations',paint:{'circle-radius':5,'circle-color': 'white','circle-stroke-width':3,'circle-stroke-color':{property:'condition',stops:[[-1,'black'],[0,'green'],[1,'#c0ca33'],[2,'#fdd835'],[3,'#ff9800'],[4,'#f44336']]}}},
        stationsl:{id:'stationsl',type: 'symbol',source: 'stations',paint:{'text-color': 'black'},layout:{'text-size':12,'text-field': '{station_name}','text-anchor':'top-left','text-offset':[0,0.5],"text-allow-overlap":true,"text-ignore-placement":false,"text-optional":false,"text-max-width":32,}},
        // wstations:{id:'wstations',type: 'circle',source: 'wstations',paint:{'circle-radius':5,'circle-color': 'white','circle-stroke-width':3,'circle-stroke-color':{property:'condition',stops:[[-1,'black'],[0,'green'],[1,'#c0ca33'],[2,'#fdd835'],[3,'#ff9800'],[4,'#f44336']]}}},
        wstationsl:{id:'wstationsl',type: 'symbol',source: 'wstations',paint:{'text-color': 'black'},layout:{"icon-image": "stadium-15",'text-size':12,'text-field': '{station_name}','text-anchor':'top-left','text-offset':[0,0.5],"text-allow-overlap":true,"text-ignore-placement":false,"text-optional":false,"text-max-width":32,}},
        // ice:{id: 'ice',type: 'raster',source: 'ice'},
        // ice:{id: 'ice',type: 'fill',source: 'ice'},
        // radarsat:{id: 'radarsat',type: 'raster',source: 'radarsat'},
      },
    
  };
  this.properties=extend(options,this.properties);
  Base.call(this,this.properties);
  
 
  // this.layers.stationsl.layout=this.layouts.stationsl;
  // this.layers.stationsl.paint=this.paint.stationsl; // Set paint  
  // this.layers.weather.paint=this.paint.weather;
  // Set paint
  // this.layers.ice.paint=this.paint.ice; // Set paint
  
  $(this.container).append(this.html());
  $(this.container).append(this.layerGUIhtml());
  
  
  
  this.geocoderHeader();
  
  this.createMap();
  
}
Map.prototype = {
  html:function(){
    return `
        <div id="{0}"></div>
    `.format(this.id);
   },
  geocoderHeader:function(){
    const self=this;
    $('#radio-1').on("change",()=>{
      if($('#radio-1').prop('checked')){
        $(".layers").addClass("checked");
        $(".geocoder").addClass("checked");
      } else{
        $(".layers").removeClass("checked");
         $(".geocoder").removeClass("checked");
      }
    });
    $('.collapse').on('show.bs.collapse', function () {
      $(this).prev().find('i').toggleClass("fa-chevron-down fa-chevron-up")
    });
    $('.collapse').on('hide.bs.collapse', function () {
     $(this).prev().find('i').toggleClass("fa-chevron-down fa-chevron-up")
    });
    $('#precip_slider').on('change', function () {self.changePrecipOpacity($(this ).val());});
    $('#ice_slider').on('change', function () {self.changeIceOpacity($(this ).val());});
    
    $('.layers input[name="basemapradio"]').on("click",function(){self.setStyle($(this).attr("_value"))});
  },
  setStyle:function(id){
    this.map.setStyle('mapbox://styles/mapbox/' + id + '-v9');
  },
  createRadarList:async function(){
    if(!this.radarlist){
      const self=this;
      const rivername = 'AlbanyRiver';
      const _list = await this.getRadarList()
        const list = _list.filter(item=>item.river==rivername);
        const html = `<div class="row"><div class="col-sm-12">{0}</div></div>`.format(self.dropdownMenu('dradar',list,"Select",'radar'));
        $('#collapseRadar').prepend(html);  
        self.dropdownMenuFunc('dradar');
        self.changeIceLayer(list[0].name);
        self.radarlist=true;
    }
    
  },
  getRadarList:async function(){
    const list = await this.parent.api.getRadarList()
    const newlist = list.map(name=>{
      const array = name.split("_");
      const river = array[2],
            datestr =array[3],
            timestr = array[4];
      const year=datestr.substr(0,4),month=datestr.substr(4,2),day=datestr.substr(6,2),
            hour=timestr.substr(0,2),
            date = new Date(parseInt(year),parseInt(month-1),parseInt(day),parseInt(hour));
      return {name:name,river:river,date:date,id:river+"_"+datestr+"_"+timestr,keyword:"radarsat",active:false};
    }).sort(function(a,b){return b.date - a.date;});
    return newlist;
  },

  changePrecipOpacity:function(value){
    const opacity = value*0.01;
    this.weatherOpacity = opacity;
    // this.paint.weather['raster-opacity']=opacity;
    $("#precip_img").css('opacity', opacity);
    
    const olddate =  this.activedate || this.dates[value];
    const olddatestr=olddate.toISOString().replace(/\.[0-9]{3}/, '');
    const oldlayer = 'weather_{0}'.format(olddatestr);
    this.map.setPaintProperty(oldlayer,'raster-opacity',opacity);
  },
  changeIceLayer:function(id){
    if(!this.sources.find(item=>item.id=='ice')){this.sources.push({id:"ice",options:{type:"raster", tileSize: 256,scheme: "tms",tiles:['gis/' + id +'/{z}/{x}/{y}.png']}},);}
    else {const ice=this.sources.find(item=>item.id=='ice');ice.options.tiles=['gis/' + id +'/{z}/{x}/{y}.png'];}
    if(!this.layers.ice)this.layers['ice']={id: 'ice',type: 'raster',source: 'ice',paint:this.paint.ice};
    
    if(this.map.getLayer('ice'))this.map.removeLayer('ice');
    if(this.map.getSource('ice'))this.map.removeSource('ice');
    
    this.map.addSource('ice',this.sources.find(item=>item.id=='ice').options);
    this.map.addLayer(this.layers['ice']);
  },
  changeIceOpacity:function(value){
    const opacity = value*0.01;
    this.paint.ice['raster-opacity']=opacity;
    $("#ice_img").css('opacity', opacity);
    this.map.setPaintProperty('ice','raster-opacity',opacity);    
  },
  createMap:function(){
    const self=this;
    mapboxgl.accessToken = this.accessToken;
    const map =this.map = new mapboxgl.Map({
      container: this.id, // container id
      style: this.style,
      center: this.center,
      zoom: this.zoom, 
      // pitchWithRotate:false,
    //   dragRotate:false,
    //   touchZoomRotate:false,
    });
    if(this.navigationcontrol)map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    if(this.geocoder){const geocoder = new MapboxGeocoder({accessToken: mapboxgl.accessToken});$('.geocoder').append(geocoder.onAdd(map))}
    // map.on('load', function() {self.loadMap()});
    map.on('style.load', function() {self.loadMap()});
    map.on('mousemove',debounce(function(e){self.mouseMove(e)}, 10));
    map.on('touchmove',debounce(function(e){self.mouseMove(e)}, 10));
    map.on("click",debounce(function(e){self.onClick(e)}, 100));
    
   },
  loadMap:async function(){
    const self=this;
    // this.sources.forEach(function(source){this.map.addSource(source.id, source.options);},this);
    this.sources=await Promise.all(this.sources.map(async (source)=>{
      if(source.options.type=="geojson" && typeof source.options.data=="string"){
        const data = await self.parent.api.json(source.options.data);
        source.options.data = data;
      }
      self.map.addSource(source.id, source.options);
      return source;
    }));
    for(let i in self.layers){
      const layer = (typeof self.map.getLayer('aeroway-taxiway')!=='undefined' && i=='weather')?'aeroway-taxiway':'';
      self.map.addLayer(self.layers[i], layer);
    }
    // self.createRadarList();
    this.parent.createRadarTable((id)=>{return this.changeIceLayer(id);})
    
    
    
    self.getGeoMet();
  },
  mouseMove:function(e){
  // if(this.map.getLayer('wstationsl'))this.hoverWeatherStations(e);
  },
  onClick:function(e){
    // if(this.map.getLayer('wstationsl'))this.clickWeatherStations(e);
  },
  clickWeatherStations:function(e){
    const features = this.map.queryRenderedFeatures(e.point, { layers: ['wstationsl']});
    if (!features.length)return;
    
    console.log(features[0]);
  },
  getGeoMet:async function(){
    const xml= await this.parent.api.getGeoMet();
    const json=xml2json(xml);
    // TODO: Hardcode RDPA - > 24P_PR
    // console.log(json);
    const rdpa = json.WMS_Capabilities.Capability.Layer.Layer.find(layer=>layer.Title['#text']==="Regional Deterministic Precipitation Analysis (RDPA)");
    if(!(rdpa))console.log("Error in finding rdpa layer");
    if(rdpa)this.createTimeSlider(rdpa.Layer[3].Dimension['#text']);

  },
  createTimeSlider:function(str){
    const self=this;
    const [_start,_end,_interval] = str.split("/");
    const start=new Date(_start),end=new Date(_end)
    const ndays = (end-start)/1000/60/60/24;
    this.dates=range(ndays).map(function(i){return new Date(start.addHours(24));});

    // 2018-03-1412:00:00Z --> 2018-03-15T12:00:00Z
    const html= `
    <div class="row">
      <div class="col-sm-12">
        <div class="timeslidercontainertext">
          <p id="timelabel_0" keyword="quantityofprecip" keywordtype="text">{1}</p>
          <p id="timelabel_1"></p>
          <p id="timelabel_2" keyword="quantityofprecip2" keywordtype="text">{2}</p>
          <p id="timelabel_3"></p>
          <p id="timelabel_4"><br></p>
        </div>
      </div>
      <div class="col-sm-5">
        <p>Date</p>
      </div>
      <div class="col-sm-7">
        <div class="timeslidercontainerr">
          <input type="range" min="0" max="{0}" value="{0}" class="slider" id="time_slider">
        </div>
      </div>
      </div>`.format(ndays-1,this.parent.keywords['quantityofprecip'][this.parent.language],this.parent.keywords['quantityofprecip2'][this.parent.language])
  
    $('#collapsePrecip').prepend(html);  
  
    $('#time_slider').on('change', function () {self.changeTime($(this).val());});
    // this.dates.forEach(date=>this.createWeatherLayers(date),this);
    this.changeTime(ndays-1);
    
  },
  // createWeatherLayers:function(date){
  //   const datetime = date.toISOString().replace(/\.[0-9]{3}/, '');
  //   const layername = 'weather_{0}'.format(datetime)
  //   if(this.map.getLayer(layername))this.map.removeLayer(layername);
  //   if(this.map.getSource(layername))this.map.removeSource(layername);
  //   const url = 'https://geo.weather.gc.ca/geomet-beta/?LANG=E&SERVICE=WMS&VERSION=1.1.1&request=GetMap&LAYERS=RDPA.24P_PR&STYLEPRECIPMM&format=image/png&bbox={bbox-epsg-3857}&srs=EPSG:3857&width=256&height=256&TRANSPARENT=true&time={0}'.format(datetime);
  //   // const layer={id: layername,type: 'raster',source: {type:"raster", tileSize: 256,tiles:[url]},paint:{'raster-opacity': this.weatherOpacity},layout:{'visibility': 'none'}};
  //   const layer={id: layername,type: 'raster',source: {type:"raster", tileSize: 256,tiles:[url]},paint:{'raster-opacity': 0}};
  //   this.map.addLayer(layer);
  // },
  changeTime:function(value){
    const olddate =  this.activedate || this.dates[value];
    const newdate = this.activedate = this.dates[value]
    const olddatestr=olddate.toISOString().replace(/\.[0-9]{3}/, '');
    const newdatestr=newdate.toISOString().replace(/\.[0-9]{3}/, '');
    
    $('#timelabel_1').text(`{0}`.format(newdate.addHours(-24).toISOString().replace(/\.[0-9]{3}/, '')));
    $('#timelabel_3').text(`{0}`.format(newdate.addHours(24).toISOString().replace(/\.[0-9]{3}/, '')));
    const oldlayer = 'weather_{0}'.format(olddatestr)    
    const newlayer = 'weather_{0}'.format(newdatestr)
    // this.map.setLayoutProperty(oldlayer, 'visibility', 'none');
    // this.map.setLayoutProperty(newlayer, 'visibility', 'visible');
    if(this.map.getLayer(oldlayer))this.map.setPaintProperty(oldlayer,'raster-opacity',0);
    if(this.map.getLayer(newlayer)){this.map.setPaintProperty(newlayer,'raster-opacity',this.weatherOpacity)}
    else{
      const url = 'https://geo.weather.gc.ca/geomet-beta/?LANG=E&SERVICE=WMS&VERSION=1.1.1&request=GetMap&LAYERS=RDPA.24P_PR&STYLEPRECIPMM&format=image/png&bbox={bbox-epsg-3857}&srs=EPSG:3857&width=256&height=256&TRANSPARENT=true&time={0}'.format(newdatestr);
      // const layer={id: layername,type: 'raster',source: {type:"raster", tileSize: 256,tiles:[url]},paint:{'raster-opacity': this.weatherOpacity},layout:{'visibility': 'none'}};
      const layer={id: newlayer,type: 'raster',source: {type:"raster", tileSize: 256,tiles:[url]},paint:{'raster-opacity': this.weatherOpacity}};
      this.map.addLayer(layer,'stations');
    }
    
  },
  hoverWeatherStations:function(e){
    const features = this.map.queryRenderedFeatures(e.point, { layers: ['wstationsl']});
    this.map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
  },
  changeStationColor:function(station_id,condition){
    const features=this.sources.find(item=>item.id='stations').options.data.features;
    const station = features.find(feature=>feature.properties.stationid==station_id);
    station.properties.condition=condition;
    this.map.getSource('stations').setData(this.sources);
  },
  basemaphtml:function(){
    const basemaps=this.basemaps;
    return basemaps.map(basemap=>`<div class="radio"><label><input type="radio" name="basemapradio" _value={0} {1}>{0}</label></div>`.format(basemap.id,(basemap.active)?'checked':'')).join("");
  },
  dropdownMenu:function(name,_list,title,tooltip){
    _list[0].active=true;
    let list=_list.map(item=>`<li class="{2}"><a href="#" _id="{0}">{0}</a></li>`.format(item.name,item.keyword,item.active?'active':'')).join("");
    let ul = `<ul class="dropdown-menu dropdown-menu-side" id="ul_{0}">{1}</ul>`.format(name,list);
    let html =`<div class="btn-group dropright float-right">
                <button type="button" class="btn btn-secondary dropdown-toggle radarbtn" data-toggle="dropdown" data-offset="0px,22px" aria-haspopup="true" aria-expanded="false">
                  {1}
                </button>
                  {0}
               </div>`.format(ul,title,tooltip);               
    return html;
  },
 dropdownMenuFunc:function(name){
    const self=this;
    $("#ul_{0} li a".format(name)).on("click",function(){
      $("#ul_{0} li".format(name)).removeClass("active");
      $(this).parent().addClass("active");
      var _id = $(this).attr('_id');
      
      self.changeIceLayer(_id);
    });
  },  
  layerGUIhtml:function(){
    return `
    <div class="geocoder"></div>
    <div class="layers">
      <div class="lcontainer">
        <div class="containe">
        <div id="accordion" class="accordion">
          <div class="card mb-0">
            <div class="card-header collapsed" data-toggle="collapse" href="#collapseOne"><a class="card-title" keyword="basemap" keywordtype="text">{3}</a><span class="right"><i class="fas fa-chevron-down"></i></span></div>
              <div id="collapseOne" class="card-body collapse" data-parent="#accordion" >{0}</div>
              <div class="card-header collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapsePrecip"><a class="card-title" keyword="precipitation" keywordtype="text">{4}</a><span class="right"><i class="fas fa-chevron-down"></i></span></div>
              <div id="collapsePrecip" class="card-body collapse" data-parent="#accordion0" >{1}</div>
              <div class="card-header collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseRadar"><a class="card-title" keyword="radarsat" keywordtype="text">{5}</a><span class="right"><i class="fas fa-chevron-down"></i></span></div>
              <div id="collapseRadar" class="card-body collapse" data-parent="#accordion0" >{2}</div>
              <div class="card-header collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseThree"><a class="card-title" keyword="stations" keywordtype="text">{6}</a><span class="right"><i class="fas fa-chevron-down"></i></span></div>
              <div id="collapseThree" class="card-body collapse" data-parent="#accordion0" ><img height="30" src="img/stadium-15.svg" alt="{7}"><p class="stations"  keyword="weatherstations" keywordtype="text">{7}</p><img src="img/circle.svg" alt="{8}"><p class="stations"  keyword="gaugestations" keywordtype="text">{8}</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--<div class="timeslidercontainer"></div>-->
    `.format(this.basemaphtml(),
             this.opacitylegendhtml2('precip','RDPA.24F_PR'),
             this.opacitylegendhtml1('ice','icelegend'),
             this.parent.keywords['basemap'][this.parent.language],
             this.parent.keywords['precipitation'][this.parent.language],
             this.parent.keywords['radarsat'][this.parent.language],
             this.parent.keywords['stations'][this.parent.language],
             this.parent.keywords['weatherstations'][this.parent.language],
             this.parent.keywords['gaugestations'][this.parent.language],
             );
  },
  opacitylegendhtml1:function(name,img){
    return `
    <div class="row">
      <div class="col-sm-5">
        <p keyword="opacity" keywordtype="text">{2}</p>
      </div>
      <div class="col-sm-7">
        <input type="range" min="1" max="100" value="25" class="slider" id="{0}_slider">
      </div>
      <div class="col-sm-12">
        <img src="img/{1}.png" id="{0}_img">
      </div>
    </div>
    `.format(name,img, this.parent.keywords['opacity'][this.parent.language])
  },
  opacitylegendhtml2:function(name,img){
    return `
    <div class="row">
      <div class="col-sm-5">
        <p keyword="opacity" keywordtype="text">{2}</p>
      </div>
      <div class="col-sm-7">
        <input type="range" min="1" max="100" value="25" class="slider" id="{0}_slider">
      </div>
      <div class="col-sm-8" style="display:inline;">
        <a href="https://weather.gc.ca/grib/grib2_RDPA_ps10km_e.html">source</a>
      </div>
      <div class="col-sm-4">
        <img src="img/{1}.png" id="{0}_img">
      </div>
    </div>
    `.format(name,img, this.parent.keywords['opacity'][this.parent.language])
  }  
   
};
Object.assign(Map.prototype,Base.prototype);
Map.prototype.constructor = Map;