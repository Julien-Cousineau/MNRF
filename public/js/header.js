/*global $,Base,extend,About*/
function Header(options){
  this.properties ={
    container:'body',
    language:'language',
    titles:'titles',
    titlel:'titlel',
    titlec:'titlec',
    toplogo:'img/ontario@2x-print.png',
  };
  this.properties=extend(this.properties,options);
  Base.call(this,this.properties);
  $(this.container).append(this.html());
  const about=this.about=new About({parent:options.parent});
  const self=this;
  $('#togglelanguague').on('click',()=>self.parent.changeLanguageToggle());
}    
Header.prototype = {
    html:function(){
      const lang=this.parent.language;
      const keywords=this.parent.keywords;
      return `
        <div class="header">        
          <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <span class="navbar-brand">
              <img src='{0}'class="toplogo invert">
            </span>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
              <ul class="nav navbar-nav ml-auto">
                <li class="nav-item">
                  <a id="togglelanguague" class="nav-link" href="#" keyword="language" keywordtype="text">{4}</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#" data-toggle="modal" data-target="#AboutModal" keyword="about" keywordtype="text">About</a>
                </li>
              </ul>
            </div>
          </nav>
          <div class="jumbotroncontainer">
            <input id="radio-1" type="checkbox">
            <div class="jumbotron jumbotron-fluid">
              <div class="container-fluid">
                <div class="row" style="min-height: 60px;">
                  <div class="col-sm-12 col-md-4 d-none d-md-block">
                    <div class="centerContainer">
                      <span style="text-align: right;"><h1 class="bannerTitle small" keyword="titles" keywordtype="text">{1}</h1><h1 class="bannerTitle large" keyword="titlel" keywordtype="text">{2}</h1></span>
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-4">
                    <div class="centerContainer">
                      <h1 class="bannerTitle center" keyword="titlec" keywordtype="text">{3}</h1>
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-4 d-none d-md-block">
                    <div class="centerContainer">
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
            <label for="radio-1" class="noselect"></label>
          </div>
        </div>
        `.format(this.toplogo,keywords[this.titles][lang],keywords[this.titlel][lang],keywords[this.titlec][lang],keywords[this.language][lang])
    },
    homebtnclick:function(){
      
    }
}
Object.assign(Header.prototype,Base.prototype);
Header.prototype.constructor = Header;
