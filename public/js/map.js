/*global $,Base,extend,mapboxgl,MapboxGeocoder*/
function Map(options){
  this.properties ={
      id:'map',
      accessToken:'pk.eyJ1Ijoic2ZlcmciLCJhIjoiY2l6OHF4eG85MDBwcTMybXB5dTY0MzlhNCJ9.Mt1hpCCddMlSvDiCtOQiUA',
      center:[-85.00,50.0],
      zoom:5,
      basemaps:[{id:'streets',active:false},{id:'light',active:true},{id:'dark',active:false},{id:'satellite',active:false},{id:'basic',active:false},{id:'outdoors',active:false}],
      container:'body',
      navigationcontrol:true,
      geocoder:true,
      style:'mapbox://styles/mapbox/light-v9',
      paint:{ // Default paint values for Mapbox
        stations:{
    		  'circle-color': 'blue',
        },
        weather:{
    		  'raster-opacity': 0.25,
        },
        ice:{
    		  'raster-opacity': 1,
        },
        // ice:{
        //   'fill-color':{
        //     property: 'raster_val',
        //     stops: [
        //     [0.0, 'rgba(0,0,0,0)'],
        //     [1.0, 'red'],
        //     [2.0, 'blue'],
        //     [3.0, 'green'],
        //     [4.0, 'yellow'],
        //     [5.0, 'orange'],
        //     [6.0, 'white'],
        //     [7.0, '#e55e5e']
        //     ]
        //   }
        // },
      },
      sources:[//All data sources
        {id:"stations",options:{type:"geojson",data:'data/stations.geojson'}},
        {id:"weather",options:{type:"raster", tileSize: 256,tiles:[ 'https://geo.weather.gc.ca/geomet/?LANG=E&SERVICE=WMS&VERSION=1.1.1&request=GetMap&LAYERS=RDPS.ETA_RN&format=image/png&bbox={bbox-epsg-3857}&srs=EPSG:3857&width=256&height=256&TRANSPARENT=true']}},
        {id:"ice",options:{type:"raster", tileSize: 256,scheme: "tms",tiles:['gis/RiverIceBreakupClassification_ON_AlbanyRiver_20170509_114458/{z}/{x}/{y}.png']}},
        // {id:"ice",options:{type:"geojson",data:'data/ice.geojson'}},
        // {id:"radarsat",options:{type:"image", url:'data/river.png',coordinates:[[-83.5458730875107,53.1986526149143],[-80.9045446620555,53.1986526149143],[-80.9045446620555,51.5953806566912],[-83.5458730875107,51.5953806566912]]}},
      ],
      layers:{//All layers - paint and filter are default values. This can change depending on the developer and client selection
        weather:{id: 'weather',type: 'raster',source: 'weather'},
        stations:{id: 'stations',type: 'circle',source: 'stations'},
        ice:{id: 'ice',type: 'raster',source: 'ice'},
        // ice:{id: 'ice',type: 'fill',source: 'ice'},
        // radarsat:{id: 'radarsat',type: 'raster',source: 'radarsat'},
      },
    
  };
  this.properties=extend(options,this.properties);
  Base.call(this,this.properties);
  
  this.layers.stations.paint=this.paint.stations; // Set paint
  this.layers.weather.paint=this.paint.weather; // Set paint
  this.layers.ice.paint=this.paint.ice; // Set paint
  
  $(this.container).append(this.html());
  $(this.container).append(this.layerGUIhtml());
  this.createRadarList();
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
  createRadarList:function(){
    const self=this;
    const rivername = 'AlbanyRiver';
    this.getRadarList(function(_list){
      const list = _list.filter(item=>item.river==rivername);
      const html = `<div class="row"><div class="col-sm-12">{0}</div></div>`.format(self.dropdownMenu('dradar',list,"Select",'radar'))
      $('#collapseRadar').prepend(html);  
    });
    
  },
  getRadarList:function(callback){
    console.log(this.parent)
    this.parent.api.getRadarList(function(err,list){
      if(err)console.log(list);
      
      const newlist = list.map(name=>{
        const array = name.split("_");
        const river = array[2],
              datestr =array[3],
              timestr = array[4];
        const year=datestr.substr(0,4),month=datestr.substr(4,2),day=datestr.substr(6,2),
              hour=timestr.substr(0,2),
              date = new Date(parseInt(year),parseInt(month-1),parseInt(day),parseInt(hour));
        return {river:river,date:date,id:river+"_"+datestr+"_"+timestr,keyword:"radarsat",active:false};
      }).sort(function(a,b){return b.date - a.date;});
      callback(newlist);
    });
  },
  changePrecipOpacity:function(value){
    const opacity = value*0.01;
    this.paint.weather['raster-opacity']=opacity;
    $("#precip_img").css('opacity', opacity);
    this.map.setPaintProperty('weather','raster-opacity',opacity);
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
    if(this.navigationcontrol)map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    if(this.geocoder){const geocoder = new MapboxGeocoder({accessToken: mapboxgl.accessToken});$('.geocoder').append(geocoder.onAdd(map))}
    // map.on('load', function() {self.loadMap()});
    map.on('style.load', function() {self.loadMap()});
    
    
   },
  loadMap:function(){
    this.sources.forEach(function(source){this.map.addSource(source.id, source.options);},this);
   for(let i in this.layers){
      const layer = (this.map.getLayer('aeroway-taxiway'))?'aeroway-taxiway':'';
      this.map.addLayer(this.layers[i], layer);
      console.log(this.layers[i])
        
    }
    // this.loadLayers();
   },
  // loadLayers:function(){
   
  // },
  basemaphtml:function(){
    const basemaps=this.basemaps;
    return basemaps.map(basemap=>`<div class="radio"><label><input type="radio" name="basemapradio" _value={0} {1}>{0}</label></div>`.format(basemap.id,(basemap.active)?'checked':'')).join("");
  },
  dropdownMenu:function(name,_list,title,tooltip){
    _list[0].active=true;
    let list=_list.map(item=>`<li class="{2}"><a href="#" _id="{0}" keyword="{1}" keywordType="text">{0}</a></li>`.format(item.id,item.keyword,item.active?'active':'')).join("");
    let ul = `<ul class="dropdown-menu dropdown-menu-side" id="ul_{0}">{1}</ul>`.format(name,list);
    let html =`<div class="btn-group dropright float-right">
                <button type="button" class="btn btn-secondary dropdown-toggle radarbtn" data-toggle="dropdown" data-offset="0px,22px" aria-haspopup="true" aria-expanded="false">
                  {1}
                </button>
                  {0}
               </div>`.format(ul,title,tooltip);               
    return html;
  },
  layerGUIhtml:function(){
    return `
    <div class="geocoder"></div>
    <div class="layers">
      <div class="lcontainer">
        <div class="containe">
        <div id="accordion" class="accordion">
          <div class="card mb-0">
            <div class="card-header collapsed" data-toggle="collapse" href="#collapseOne"><a class="card-title">Basemap</a><span class="right"><i class="fas fa-chevron-down"></i></span></div>
              <div id="collapseOne" class="card-body collapse" data-parent="#accordion" >{0}</div>
              <div class="card-header collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo"><a class="card-title">Precipitation</a><span class="right"><i class="fas fa-chevron-down"></i></span></div>
              <div id="collapseTwo" class="card-body collapse" data-parent="#accordion0" >{1}</div>
              <div class="card-header collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseRadar"><a class="card-title">RadarSat</a><span class="right"><i class="fas fa-chevron-down"></i></span></div>
              <div id="collapseRadar" class="card-body collapse" data-parent="#accordion0" >{2}</div>
              <div class="card-header collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseThree"><a class="card-title">Weather Stations</a><span class="right"><i class="fas fa-chevron-down"></i></span></div>
              <div id="collapseThree" class="card-body collapse" data-parent="#accordion0" ><p>Three</p></div>
              <div class="card-header collapsed" data-toggle="collapse" data-parent="#accordion" href="#collapseGauge"><a class="card-title">Gauge Stations</a><span class="right"><i class="fas fa-chevron-down"></i></span></div>
              <div id="collapseGauge" class="card-body collapse" data-parent="#accordion0" ><p>Three</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `.format(this.basemaphtml(),this.opacitylegendhtml('precip','RDPS.ETA_RN'),this.opacitylegendhtml('ice','icelegend'));
  },
  opacitylegendhtml:function(name,img){
    return `
    <div class="row">
      <div class="col-sm-5">
        <p>Opacity</p>
      </div>
      <div class="col-sm-7">
        <input type="range" min="1" max="100" value="25" class="slider" id="{0}_slider">
      </div>
      <div class="col-sm-12">
        <img src="img/{1}.png" id="{0}_img">
      </div>
    </div>
    `.format(name,img)
  }
   
};
Object.assign(Map.prototype,Base.prototype);
Map.prototype.constructor = Map;