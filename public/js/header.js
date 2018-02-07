function Header(options){
  this.properties ={
    container:'',
    title:'',
    toplogo:'ontario@2x-print.png',
    leaf:'',
    banner:'',
  } 
  
  this.properties=extend(this.properties,options);
  Base.call(this,oppropertiestions);
}    
Header.prototype = {
    html:function(){
      return `
        <div class="header">        
          <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <span class="navbar-brand">
              <img src=''>
            </span>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNavDropdown">
              <ul class="nav navbar-nav ml-auto">
                <li class="nav-item">
                  <a id="homebtn" class="nav-link" href="#">Home <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Features</a>
                </li>
                <li class="nav-item">
                  <a class="nav-link" href="#">Pricing</a>
                </li>
                <li class="nav-item dropdown">
                  <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Dropdown link
                  </a>
                  <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdownMenuLink">
                    <a class="dropdown-item" href="#">Action</a>
                    <a class="dropdown-item" href="#">Another action</a>
                    <a class="dropdown-item" href="#">Something else here</a>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
          <div class="jumbotroncontainer">
            <input id="radio-1" type="checkbox" checked>
            <div class="jumbotron jumbotron-fluid">
              <div class="container-fluid">
                <div class="row">
                  <div class="col-sm-12 col-md-5">
                    <div class="centerContainer">
                      <h1 class="display-5">{0}</h1>
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-2 d-none d-md-block">
                    <div class="centerContainer">
                      <img class="leaf" src='{1}'>
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-5 d-none d-md-block">
                    <div class="centerContainer">
                      <img class="nrc" src='{2}'>
                    </div>
                  </div>
                </div>
              </div>
              <label for="radio-1"></label>
            </div>
          </div>
        </div>
        `.format(this.title,leaf,nrc)
    }
}
Object.assign(Header.prototype,Base.prototype);
Header.prototype.constructor = Header;

    
    super(extend(_options, options));
    this.defineProperties();
    this.render();
    this.postrender();
  }
  render(){$(this.container).append(this.html)}
  postrender(){
    const self=this;
    $('#homebtn').on('click',()=>self.homebtnclick());
    
  }
  homebtnclick(){
    this.parent.crossfilter.addpoint("M6013459");
  }
  defineProperties(){
      Object.defineProperty(this, 'debug',{  
           configurable: true,
           get:()=>{return this.options['debug'];},
           set:(value)=>{this.options['debug']=value;console.log("here")}
           });      
    
  }
  print(){  
    this.debug="myname";
    console.log(this.debug);
  }
  
  
}