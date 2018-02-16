/*global $,Base,extend,mapboxgl,MapboxGeocoder*/
function Map(options){
  this.properties ={
      id:'map',
      accessToken:'pk.eyJ1Ijoic2ZlcmciLCJhIjoiY2l6OHF4eG85MDBwcTMybXB5dTY0MzlhNCJ9.Mt1hpCCddMlSvDiCtOQiUA',
      center:[-85.00,50.0],
      zoom:5,
      style:'mapbox://styles/mapbox/light-v9',
      container:'body',
      navigationcontrol:true,
      geocoder:true,
      style:'mapbox://styles/mapbox/light-v9',
      paint:{ // Default paint values for Mapbox
        station:{
    		  'circle-color': 'blue',
        },
      },
      sources:[//All data sources
        {id:"stations",options:{type:"geojson",data:'data/stations.geojson'}},
      ],
      layers:{//All layers - paint and filter are default values. This can change depending on the developer and client selection
        stations:{id: 'stations',type: 'circle',source: 'stations'}, 
      },
    
  };
  this.properties=extend(this.properties,options);
  Base.call(this,this.properties);
  
  this.layers.stations.paint=this.paint.station; // Set paint
  
  $(this.container).append(this.html());
  this.createMap();
}
Map.prototype = {
  html:function(){
    return `
        <div id="{0}"></div>
    `.format(this.id);
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
    if(this.geocoder)map.addControl(new MapboxGeocoder({accessToken: mapboxgl.accessToken}));
    map.on('load', function() {self.loadMap()});
   },
  loadMap:function(){
    const map = this.map;
    this.sources.forEach(function(source){map.addSource(source.id, source.options);});
    for(let i in this.layers){
      map.addLayer(this.layers[i]);
    }
   },
   
};
Object.assign(Map.prototype,Base.prototype);
Map.prototype.constructor = Map;