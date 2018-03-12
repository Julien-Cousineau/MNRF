/*global $,Base,extend*/
function About(options){
  this.properties ={
    container:'body',
    abouttitle:'abouttitle',
    aboutcontent:'aboutcontent',
    accept:'accept',
    
  };
  this.properties=extend(this.properties,options);
  Base.call(this,this.properties);
  $(this.container).append(this.html());
  // $('#AboutModal').modal('show')
}
About.prototype = {
  html:function(){
    return `
    <div class="modal fade" id="AboutModal" tabindex="-1" role="dialog" aria-labelledby="AboutModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="AboutModalLabel" keyword="abouttitle" keywordtype="text">{0}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body" keyword="aboutcontent" keywordtype="html">
            {1}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary"  data-dismiss="modal"  keyword="accept" keywordtype="text">{2}</button>
          </div>
        </div>
      </div>
    </div>
    `.format(this.parent.keywords[this.abouttitle][this.parent.language],this.parent.keywords[this.aboutcontent][this.parent.language],this.parent.keywords[this.accept][this.parent.language])
  }
};
Object.assign(About.prototype,Base.prototype);
About.prototype.constructor = About;