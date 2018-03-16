/*global $,Base,extend*/
function Table(options){
  this.properties ={
    // id:'',
    // columns:{key:{title:'',className:'',orderable:false,data:[],render:()=>{}}},
    // data:'',
  };
  this.properties=extend(this.properties,options);
  Base.call(this,this.properties);
}
Table.prototype = {
  htmltable:function(id){
    return `<div class="mycontent"> 
              <table id="{0}" class="table table-striped table-bordered" cellspacing="0" width="100%"></table>
            </div>`.format(id);    
  },  
  htmlheader:function(columns){
    let ths='';
    for(let key in columns){ths+='<th>{0}</th>'.format(columns[key].title);}
    return '<thead><tr>{0}</tr></thead>'.format(ths);
  },
  getKeys:function(){
    const columns = this.columns,
          array=[];
    for(let key in columns){
      const obj=columns[key];
      array.push({"className":(obj.className) ? obj.className:null,
                  "orderable":(obj.orderable) ? obj.orderable:null,
                  "data":(obj.data) ? key:null,
                  "render":(obj.render) ? function (data,type,full,meta){return obj.render(full)}:key,
                 });
    }
    return array;
  },
  addTableFunc:function(){
    $('#{0} tbody'.format(this.id)).off(); // Remove all event listeners, if not duplicates will exist
    const columns = this.columns;
    for(let key in columns){
      const obj=columns[key];
      if(obj.action)obj.action(this.id,obj.className);
    }
    // if(this.parent.options.actionbuttons)this.parent.options.actionbuttons(this.id);
    // this.parent.addUploadButton();
  },
  create:function(){
    const self=this;
    const id = this.id;
    // console.log(this.data)
    
    $("{0}".format(this.container)).append(this.htmltable(id));
    $("#{0}".format(id)).append(this.htmlheader(this.columns));
    this.datatable = $("#{0}".format(id)).DataTable( {
                    dom:"<'row'<'col-sm-4 refreshcontainer'><'col-sm-2'><'col-sm-6'f>>".format(id) + 
                          "<'row'<'col-sm-12'tr>>" + 
                          "<'row'<'col-sm-4 uploadcontainer'><'col-sm-4'i><'col-sm-4'p>>",
                    // "scrollX": true,
                    // scrollY:'70vh',
                    autoWidth: true,
                    pageLength: 5,
                    order: [[ 1, 'asc' ]],
                    // scrollCollapse: true,
                    data: this.data,
                    columns: this.getKeys(),
                    drawCallback: function( row, data, index ) {self.addTableFunc();},
                });
    
  },
  
};
Object.assign(Table.prototype,Base.prototype);
Table.prototype.constructor = Table;