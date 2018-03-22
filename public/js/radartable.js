/*global $,Table,extend*/
function RadarTable(options){
  const self=this;
  this.properties ={
      container:'#radartablecontainer',
      id:'radartable',
      columns:{ 
        // id:{title:'File Name',className:'col_filename',orderable:true,data:'id',render:()=>{}},
        // name:{title:'Name',className:'col_filename',orderable:true,},
        river:{title:'River',className:'col_river',orderable:true,},
        date:{title:'Date',className:'col_date',orderable:true,render:(full)=>{return `{0}`.format(full.date.yyyymmdd())}},
        select:{title:'',className:'col_select',orderable:false,action:(id,className)=>{self.showlayer(id,className)},render:(full)=>{return `<button class="btn btn-secondary">Show</button>`}}
        
      },
    // data:[
    //   {id:'Julien Cousineau',select:false},
    //   {id:'Melanie Cousineau',select:false},
    //   ],
    // change:()=>{},
  };
  this.properties=extend(this.properties,options);
  Table.call(this,this.properties);
  $('body').append(this.html());
  this.create();
  // $('#RadarModal').modal('show');
}
RadarTable.prototype = {
    showlayer:function(id,className){
      const self = this;
      $('#{0} tbody'.format(id)).on('click', 'td.{0} button'.format(className), function () {
        const tr = $(this).closest('tr');      
        const row = self.datatable.row( tr );
        const obj = row.data();
        self.change(obj);
        $('#RadarModal').modal('hide');
        $('#radarlabel').text(obj.name);
      });
      
    },
    html:function(){
      return`
      <div class="modal fade" id="RadarModal" tabindex="-1" role="dialog" aria-labelledby="RadarModelLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="RadarModelLabel" keyword="radarsat" keywordtype="text">{0}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div id="radartablecontainer"></div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary"  data-dismiss="modal"  keyword="close" keywordtype="text">{1}</button>
          </div>
        </div>
      </div>
    </div>
    `.format(this.parent.keywords['radarsat'][this.parent.language],this.parent.keywords['close'][this.parent.language])  
    },
};
Object.assign(RadarTable.prototype,Table.prototype);
RadarTable.prototype.constructor = RadarTable;


// new RadarTable({
//     container:'#radartablecontainer',
//     id:'radartable',
//     columns:{
//         id:{className:'',orderable:true,data:[],render:(full)=>{}},
//         show:{className:'',orderable:false,data:[],render:()=>{}},
//     }
// })