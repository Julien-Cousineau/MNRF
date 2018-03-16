/*global $,Base,extend,extendExtra,Plotly*/
function Chart(options){
  this.properties ={
    charted:false,
    isprecip:false,
    isprecipon:false,
    isUnderRelayout:false,
  };
  this.properties=extend(this.properties,options);
  Base.call(this,this.properties);
  this[this.charttype](); //create chart
  
}
Chart.prototype = {
  get activeatt(){
    if(!(this._activeatt))this._activeatt='LVL';
    return this._activeatt
  },
  set activeatt(value){
    this._activeatt=value;
  },  
  get minmaxX(){
    const ts = this.data.find(ts=>ts.ts_name=='LVL.15.P' || ts.ts_name=='LVL.15.O'|| ts.ts_name=='LVL.1.O');
    if(!(ts))return console.log('Chart does not contain LVL');
    
    const _att= ts.ts_name;
    const dates=this.data.find(ts=>ts.ts_name==_att).data[0].data.map(row=>row[0]);
    const min = dates.reduce(function (a, b) { return a < b ? a : b; }); 
    const max = dates.reduce(function (a, b) { return a > b ? a : b; });
    return [min,max]
    
  },
  
  getData:function(att){
    if(att=='LVL')return this.getLVL();
    if(att=='Q')return this.getQ();
    if(att=='Precip')return this.getPrecip();
  },
  getTitle:function(att){
    let ts=null;
    ts = (att=='LVL')?this.data.find(ts=>ts.ts_name=='LVL.15.P' || ts.ts_name=='LVL.15.O'|| ts.ts_name=='LVL.1.O'):ts;
    ts = (att=='Q')? this.data.find(ts=>ts.ts_name=='Q.P' || ts.ts_name=='Q.1.O' || ts.ts_name=='Q.15'):ts;
    ts = (att=='Precip')?this.data.find(ts=>ts.ts_name=='Precip.1.P' || ts.ts_name=='Precip.1.O' || ts.ts_name=='Precip.PGL.O' || ts.ts_name=='Precip.24hr.P'|| ts.ts_name=='Precip.24hr.O'):ts;
    if(ts==null)return console.log('Error in getTitle - Units');
    
    let units = this.getLabel(ts.data[0].ts_unitname);
    let label=null;
    label= (att=='LVL')?'Water Level/Niveau d\'eau ({0})'.format(units):label;
    label= (att=='Q')?'Discharge/Débit ({0})'.format(units):label;
    label= (att=='Precip')?'Precipitation/Précipitation ({0})'.format(units):label;
    
    return label;
    // if(att=='LVL')return this.getLVL();
    // if(att=='Q')return this.getQ();
    // if(att=='Precip')return this.getPrecip();
    // console.log()
    // if(this.data[0].data[0].ts_unitname)
    // if(att=='LVL')return 'Water Level (m)';
    // if(att=='Q')return 'Discharge (???)';
    // if(att=='Precip')return 'Precip (???)';
  },
  getLabel:function(text){
    switch(text) {
      case 'meter':
          return 'm';
      case 'cubic meter per second':
          return 'm<sup>3</sup>/s';
      case 'millimeter':
          return 'mm';          
      default:
          return text;
    }
  },
  getPrecipData:function(){
    const ts = this.data.find(ts=>ts.ts_name=='Precip.1.P' || ts.ts_name=='Precip.1.O' || ts.ts_name=='Precip.PGL.O' || ts.ts_name=='Precip.24hr.P'|| ts.ts_name=='Precip.24hr.O');
    if(!(ts))return console.log('Chart does not contain {0}'.format(ts.ts_name));
    return ts;
  },
  getPrecip:function(){
    // console.log(this.data)
    const ts = this.getPrecipData();
    const _att= ts.ts_name;
    if(this.data.find(ts=>ts.ts_name==_att).data[0].data.length==0)console.log('{0} does not contain values'.format(ts.ts_name));
    return {
      x: this.data.find(ts=>ts.ts_name==_att).data[0].data.map(row=>row[0]),
      y: this.data.find(ts=>ts.ts_name==_att).data[0].data.map(row=>row[1]),
      yaxis: 'y2',
      type: 'bar',
      name:_att,
      showlegend: false,
      marker:{
            color	:	'#ff9800',
      }
    };
  },
  getQ:function(){
     const ts = this.data.find(ts=>ts.ts_name=='Q.P' || ts.ts_name=='Q.1.O' || ts.ts_name=='Q.15');
     if(!(ts))return console.log('Chart does not contain Q.P');
      const _att= ts.ts_name;
      return {
        x: this.data.find(ts=>ts.ts_name==_att).data[0].data.map(row=>row[0]),
        y: this.data.find(ts=>ts.ts_name==_att).data[0].data.map(row=>row[1]),
        yaxis: 'y1',
        type: 'scatter',
        line: {
                color	:	'rgb(31, 119, 180)',
                width	:	1.5,
                dash	:	'solid',
                shape	:	'linear',
                simplify	:		true,
                connectgaps	:		true,
              },        
        name:_att
      };

  },
  getLVL:function(){
    const ts = this.data.find(ts=>ts.ts_name=='LVL.15.P' || ts.ts_name=='LVL.15.O'|| ts.ts_name=='LVL.1.O');
    if(!(ts))return console.log('Chart does not contain LVL');
    const _att= ts.ts_name;
    return {
      x: this.data.find(ts=>ts.ts_name==_att).data[0].data.map(row=>row[0]),
      y: this.data.find(ts=>ts.ts_name==_att).data[0].data.map(row=>row[1]),
      yaxis: 'y1',
      type: 'scatter',
      line: {
        color	:	'rgb(31, 119, 180)',
        width	:	1.5,
        dash	:	'solid',
        shape	:	'linear',
        simplify	:		true,
        connectgaps	:		true,
      },
      name:_att
    };
  },
  getPrecipAxis:function(){
    const ts=this.getPrecipData();
    const _att= ts.ts_name;
    const y = this.data.find(ts=>ts.ts_name==_att).data[0].data.map(row=>row[1]);
    const max = Math.max.apply(null, y);
    return   {
        // domain: [0.75, 1],
        range:[max,0],
        side: 'right',
        showline:true,
        mirror:true,
        title:'Precip (???)',
        overlaying: 'y',
      };
  },
  getTsLayout:function(options,properties){
    const height = $('#ts_{0}'.format(this.stationid)).parent().height();
    const width = $('#ts_{0}'.format(this.stationid)).parent().width();
    const label=new Date().toString().match(/([A-Z]+[\+-][0-9]+.*)/)[1];
    let layout =  {
      annotations:[
        {
          xref: 'paper',
          yref: 'paper',
          x: 0,
          xanchor: 'left',
          y: 1,
          yanchor: 'top',
          text: label,
          showarrow: false
        }
      ],
      autosize:true,
      width	:	width,
      height: height,
      margin: {
        l:60,
        r:60,
        t:60,
        b:10,
        pad:0,
        // autoexpand:true,
      },
      xaxis:{
        type	:	'date',
        tickfont: {
          family:	'Roboto',
          size:	10,
          color:'#444',
        },
        showline:true,
        showgrid	:		true,
        zerolinecolor	:	'#444',
        zerolinewidth	:	1,
        zeroline	:		true,
        mirror	:		true,
      },
      yaxis: {
        // domain: [0, 0.75],
        // range:[0,20],
        tickfont: {
          family:	'Roboto',
          size:	10,
          color:'#444',
        },
        showline:true,
        zerolinecolor	:	'#444',
        zerolinewidth	:	1,
        zeroline	:		true,
        mirror	:		true,
        title:'Water Level (m)'
        // nticks:12,
      },
      showlegend:true,	
      legend: {
        orientation: "h",
        x	:	1,
        xanchor	:	'right',
        y	:	1,
        yanchor	:	'bottom',
        bgcolor: 'rgba(0,0,0,0)',
      }
    };
    
    
    const rangeslider={
      xaxis :{
        rangeslider:{
          visible	:		true,
          bgcolor	:	'#fff',
          bordercolor	:	'#444',
          borderwidth	:	1,
          thickness	:	0.15,
          autorange	:		true,
  	      range:this.minmaxX,	

  	    },
	      rangeselector: {
	        buttons: [
            {step: 'all',label: '6m'},
            // {count: 6,label: '6m',step: 'month',stepmode: 'backward'},
            {count: 1,label: '1m',step: 'month',stepmode: 'backward'}, 
            {count: 7,label: '1w',step: 'day',stepmode: 'backward'}, 
          ]}, 
      }
    };
   
    
    
    if(options.rangeslider)layout=extendExtra(layout,rangeslider);
    if(this.isprecip)layout.yaxis2=this.getPrecipAxis();
    
    
    
    return extendExtra(layout,properties);

  },
  changeYaxis:function(relayoutData){ //Temporary Solution
    if(this.isUnderRelayout){this.isUnderRelayout=false;return;}
    if(relayoutData['xaxis.autorange']===true){this.isUnderRelayout=true;Plotly.relayout(this.gd, {'yaxis.autorange': true});return;}
    
    const startstr = relayoutData['xaxis.range[0]'];
    const endstr = relayoutData['xaxis.range[1]'];
    const start = new Date(startstr);
    const end = new Date(endstr);
    const data = this.getData(this.activeatt);
    const y=[];
    data.x.forEach((item,i)=>{if(item>=start && item<=end){y.push(data.y[i]);}});
    // const y=data.y[index];
    const max = Math.max.apply(null, y);
    const min = Math.min.apply(null, y);
    var update = {'yaxis.range': [min,max]};
    this.isUnderRelayout=true;
    Plotly.relayout(this.gd, update);
    return;
  },
  createPlot:function(data, layout){
    const self=this;
    if(!(this.gd)){
      const d3 = this.d3 = Plotly.d3;
      const gd3 = d3.select('#ts_{0}'.format(this.stationid))
      this.gd = gd3.node();  
    }
    
    if(this.charted){
      Plotly.newPlot(this.gd, data,layout);}
    else{
      
      Plotly.newPlot(this.gd, data,layout);
      this.createbtns();
      window.onresize = function() {Plotly.Plots.resize(this.gd);};
      this.charted=true;
    }
    this.gd.on('plotly_relayout',function(relayoutData){self.changeYaxis(relayoutData)}); // Temporary Solution
    
    $('[_riverid="{0}"] [_stationid="{1}"] [_type="{2}"]'.format(this.riverid, this.stationid,'ts')).removeClass("chart-loading-overlay");
    $('[_riverid="{0}"] [_stationid="{1}"] [_type="{2}"] .loading-widget-dc'.format(this.riverid, this.stationid,'ts')).remove();
  },
  // style="stroke:rgb(68,68,68);stroke-opacity:1;fill:rgb(238,238,238);fill-opacity:1;stroke-width:0px;"
  // style="font-family:&quot;Open Sans&quot;,verdana,arial,sans-serif;font-size:12px;fill:rgb(68,68,68);fill-opacity:1;white-space:pre;"
  
  createbtns:function(){
    const self=this;
    const html=`<div class="btn-container">
                  <button class="btn btn-chart active" _btn="LVL_{0}">LVL</button>
                  <button class="btn btn-chart" _btn="Q_{0}">Q</button>
                  <span class="preciplabel" keyword="precipitation" keywordtype="text">Precip. :</span>
                  <div class="material-switch pull-right">
                    <input id="switch_precip_{0}" type="checkbox">
                    <label for="switch_precip_{0}" class="switch-color"></label>
                  </div>
                </div>`.format(this.stationid);
     $('#ts_{0}'.format(this.stationid)).parent().prepend(html);
     $('[_btn="LVL_{0}"]'.format(this.stationid)).on("click",()=>{self.changeData('LVL')})
     $('[_btn="Q_{0}"]'.format(this.stationid)).on("click",()=>{self.changeData('Q')})
     $('#switch_precip_{0}'.format(this.stationid)).on("click",()=>{self.changeData()})
  },
  changeData:function(att){
    // $('.card-body').addClass("chart-loading-overlay");
    // $('.card-body').append(`<div class="loading-widget-dc"><div class="main-loading-icon"></div></div>`);
    if(att=='LVL'){
      $('[_btn="LVL_{0}"]'.format(this.stationid)).addClass('active');
      $('[_btn="Q_{0}"]'.format(this.stationid)).removeClass('active');
    }
    if(att=='Q'){
      $('[_btn="Q_{0}"]'.format(this.stationid)).addClass('active');
      $('[_btn="LVL_{0}"]'.format(this.stationid)).removeClass('active');
    } 
    this.isprecipon = $('#switch_precip_{0}'.format(this.stationid)).prop("checked");
    this.ts_2(att);
    
  },
  getThresholds:function(att){
    const station = this.parent.stations.find(station=>station.id==this.stationid);
    // console.log(station,this.stationid)
    if(!(station.thresholds) || station.thresholds.length==0)return [];
    let array=[];
    for(let i=0,n=station.thresholds.length;i<n;i++){
      const threshmin= station.thresholds[i];
      // const threshmax= this.thresholds[i+1];
      const min = this.minmaxX[0];
      const max = this.minmaxX[1];
      array.push( 
        {
          x: [min,  max],
          y: [threshmin[att], threshmin[att]],
          type: 'scatter',
          mode: 'lines',
          line:{
            color	:	threshmin.color,
            width	:	1.0,
            dash	:	'dash',
          },
          showlegend: false,
        },
        
        // {
        //   x: [min,  max],
        //   y: [threshmax[att],threshmax[att]],
        //   // yaxis: 'y2',
        //   mode: 'none',
        //   type: 'scatter',
        //   fill	:	'tonexty',
        //   showlegend: false,
        //   fillcolor:threshmin.color,
        //   name:threshmin.name
        // }
      );
    }
    
    return array;
  },
 

  ts_2:function(_att){
    if(_att)this.activeatt=_att;
    const att = this.activeatt;
    let data = this.getThresholds(att);
    data = (this.isprecip && this.isprecipon) ? data.concat([this.getData('Precip')]):data;
    data = data.concat([this.getData(att)]);
                                  
    const layout = (this.isprecip && this.isprecipon)? this.getTsLayout({rangeslider:true},{yaxis2:{title:this.getTitle('Precip')},yaxis:{title:this.getTitle(att)}}):
                                    this.getTsLayout({rangeslider:true},{yaxis:{title:this.getTitle(att)}})
  
   
    this.createPlot(data,layout);
    
    
  },
  // ts_1:function(_att){
  //   const att = _att || 'LVL'
  //   const data = [this.getData(att)];
  //   const layout = this.getTsLayout({rangeslider:true},{yaxis:{title:this.getTitle(att)}});
  //   this.createPlot(data,layout);
  // },
};
Object.assign(Chart.prototype,Base.prototype);
Chart.prototype.constructor = Chart;


  // _createbtns:function(i,label){
  //     const d3 = this.d3;
  //     const x=175+i*35,y=0;
  //     const container = d3.select(".rangeselector").append('g')
  //                         .attr("class", "button")
  //                         .attr("transform", "translate(" + x + "," + y + ")");
  //     container.append("rect")
  //       .attr("class", "selector-rect")
  //       .attr("shape-rendering", "crispEdges")
  //       .attr("stroke", "rgb(68, 68, 68)")
  //       .attr("stroke-opacity", 1)
  //       .attr("fill", "rgb(238, 238, 238)")
  //       .attr("fill-opacity", 1)
  //       .attr("stroke-width", "0px")
  //       .attr("rx",3)
  //       .attr("ry",3)
  //       .attr("x", 0)
  //       .attr("y", 0)
  //       .attr("width", 30)
  //       .attr("height", 19);
  //     container.append("text")
  //       .attr("class", "selector-rect user-select-none")
  //       .attr("text-anchor", "middle")
  //       .attr("data-unformatted",'Julien')
  //       .attr("data-math",'N')
  //       .attr("x", 15)
  //       .attr("y", 12.5)
  //       .attr("font-size","12px")
  //       .text(label)
  // },