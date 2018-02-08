/*global $,Base,extend*/
function Dashboard(options){
  this.properties ={
    container:'body',
    
  };
  this.properties=extend(this.properties,options);
  Base.call(this,this.properties);
  $(this.container).append(this.html());
}
Dashboard.prototype = {
  html:function(){
    return `
    <div class="dashboard container-fluid">
      <div class="row">
        <div class="col-sm-12">
          <ul class="nav nav-pills nav-fill">
            <li class="nav-item">
              <a class="nav-link active" href="#">Active</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Longer nav link</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">Link</a>
            </li>
            <li class="nav-item">
              <a class="nav-link disabled" href="#">Disabled</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    `
  },
};
Object.assign(Dashboard.prototype,Base.prototype);
Dashboard.prototype.constructor = Dashboard;