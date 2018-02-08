/*global $,Base,extend*/
function About(options){
  this.properties ={
    container:'body',
    abouttitle:'abouttitle',
    
  };
  this.properties=extend(this.properties,options);
  Base.call(this,this.properties);
  $(this.container).append(this.html());
  
}
About.prototype = {
  html:function(){
    return `
    <div class="modal fade" id="AboutModal" tabindex="-1" role="dialog" aria-labelledby="AboutModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="AboutModalLabel" keyword="abouttitle" keywordtype="text">{0}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            ...
          </div>
          <!--<div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>-->
        </div>
      </div>
    </div>
    `.format(this.parent.keywords[this.abouttitle][this.parent.language])
  }
};
Object.assign(About.prototype,Base.prototype);
About.prototype.constructor = About;