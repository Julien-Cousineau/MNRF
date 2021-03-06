/*global $,Base,extend,Card*/
function Dashboard(options){
  this.properties ={
    container:'body',
  };
  this.properties=extend(this.properties,options);
  Base.call(this,this.properties);
  $(this.container).append(this.html());
  this.createSlider();
}
Dashboard.prototype = {
  createSlider:function(){
    let dragElement = $('.handle');
    const self = this;
    dragElement.on('mousedown touchstart', function(e) {
      // e.preventDefault();
      dragElement.addClass('draggable');
      dragElement.parent().addClass('draggable');
      let height = dragElement.parent().height();
      let startY = (e.pageY) ? e.pageY : e.originalEvent.touches[0].pageY;
      self.deltaY = $(document).height()-startY-height;
      self.active= true;      
    });
    dragElement.parents().on("mousemove touchmove", function(e) {
      // e.preventDefault();
    	if(self.active){
        // e.preventDefault();
        let moveY = (e.pageY) ? e.pageY : e.originalEvent.touches[0].pageY;
        let height = $(document).height()-moveY-self.deltaY;
        let maxH = $(document).height()-200;
        height = (height<40)?40:height;
        height = (height> maxH)?maxH:height;
        dragElement.parent().css('height', height + "px");
        
      }
    });
    dragElement.parents().on("mouseup touchend touchcancel", function(e) {
    	if(self.active){
        dragElement.removeClass('draggable');
        dragElement.parent().removeClass('draggable');
        self.active=false;
      }
    });
  },
  
  html:function(){
    return `
    <div class="dashboard">
      <div class="handle noselect"></div>
      <ul class="nav nav-tabs" id="tabrivers" role="tablist">
        {0}
      </ul>
      <div class="contentContainer">
        <div class="tab-content" id="tabriverscontent">
          {1}
        </div>
      </div>
    </div>
    `.format(
      this.rivers.map(river=>`<li class="nav-item"><a class="nav-link {2}" id="{0}-tab" data-toggle="tab" role="tab" aria-controls="{0}" aria-selected="true" href="#{0}">{1}</a></li>`.format(river.id,river.title,river.active?'active':'')).join(""),
      this.rivers.map(river=>`<div class="tab-pane fade {1}" id="{0}" role="tabpanel" aria-labelledby="{0}-tab" _riverid="{0}">{2}</div>`.format(river.id,river.active ?'show active':'',this.content(river)),this).join(""),
      );
  },
  content:function(river){
    return `
    <div class="container-fluid">
      {0}
    </div>
    `.format(
      river.stations.map(station=>this.station(river,station),this).join(""),
      );
  },
  station:function(river,station){
    return `
     <div class="row">
      <div class="col-sm-12">
        <h5 class="stationtitle">{0}</h5>
      </div>
     </div>
      <div class="row" _stationid="{1}">
        {2}
      </div>
    `.format(station.title,station.id,station.cards.map(_card=>_card.html(),this).join(""),);
  },
  addRiver:function(){
    
  },
  // card:function(river,station,card,i,ncards){
  //   // const cols=(i==0)?4:8/(ncards-1);
  //   // const _card=new Card({riverid:river.id,stationid:station.id,type:card.type,title:card.title,cols:cols});
  //   // this.parent.cards.push(_card);
  //   return _card.html();
  // }
};
Object.assign(Dashboard.prototype,Base.prototype);
Dashboard.prototype.constructor = Dashboard;