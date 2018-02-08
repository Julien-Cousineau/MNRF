/*global $,Base,Header,Dashboard*/
$(document).ready( function () {
  new App();
});
function App(){
  this.properties ={
    language:'en',
    keywords:{
      titles:{'en':"Ministry of",'fr':"Ministère des"},
      titlel:{'en':" Natural Resources and Forestry",'fr':" Richesses naturelles et des Forêts"},
      titlec:{'en':"Far North Dashboard",'fr':"Tableau de bord du Grand Nord"},
      language:{'en':"Français",'fr':"English"},
      about:{'en':"About",fr:"Info"},
      abouttitle:{'en':"About the Far North Dashboard",fr:"À propos du tableau de bord du Grand Nord"},
    }
  };
  Base.call(this,this.properties);
  const self=this;
  const pointer = function(){return self;}
  const header=this.header=new Header({parent:pointer});
  const dashboard=this.dashboard=new Dashboard({parent:pointer});
}
App.prototype = {
  changeLanguageToggle:function() {
    if(this.debug)console.log('Change Language Toggle');
    this.language= (this.language==='en') ? 'fr':'en';
    this.changeLabels();
  },
  changeLabels:function() {
    const self=this;
    $("*[keyword]").each(function(){
      const keyword=$(this).attr("keyword");
      const keywordType=$(this).attr("keywordtype");
      if(keywordType==="text")return $(this).text(self.keywords[keyword][self.language]);
    });
  },    
};
Object.assign(App.prototype,Base.prototype);
App.prototype.constructor = App;
