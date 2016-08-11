/*
ui 组件 gridview
金兴亨 2013-05-29
*/
var _root=J.SCRIPTPATH+"/plugins/ui/";
var jroot=J._get_run_script_url();
var style=J.getParam("style",jroot);
if(style=="green")
	J.loadStyle(_root+"theme/green.css");
else if(style!="none")
	J.loadStyle(_root+"theme/default.css");

var __func=function(){
	$.fn.__init=function($object,option,cmd,params){
		var _defaults=$object.defaults;
		return this.each(function () {
		var $this = $(this), data = $this.data(_defaults.core), options;

		if(typeof option == 'object'){
			options= $.extend({}, data?data.options:_defaults, option);
			if(data)data.options=options;
		}
		else if(!data)return;
		if (!data) $this.data(_defaults.core, (data = new $object.constructor(this, options)));
		if(typeof option =='string'&&data[option])data[option].apply(data,cmd||[]);
		else if(typeof cmd =='string'&&data[cmd])data[cmd].apply(data,params||[]);
		});
	};
	$J=J;
	var gridview={};
	gridview.global="__gridview__";
	gridview.defaults = {core:"data-plug-gridview"
	,columns:[]
	,_default_columns:{text:"&nbsp;",visible:true,type:"bound",field:"",content:"",render:null,id:"",click:null}
	,_default_rows:{"_edit_":false,"_new_":false,"_bind_":true}
	,autonumber:false
	,multiple:false
	,pager:{pagesize:10}
	,footer:{pager:true}
	,header:{title:true}
	,data:null
	,filter:null
	,callback:function(data){
		if("s" in data)return data["d"]||"";
		return true;
	}
	,dataformat:{data:"d",rows:"rows",total:"total"}
	,trigger:{callback:null,pagechange:null,pagesizechange:null}
	,valign:""
	,align:""
	,_tr_core:"_tr_gridview_"
	,_td_core:"_td_gridview_"
	}; 
	window[gridview.global]=gridview;

	gridview._get_object=function(plugid,target,rowi){
		var $grid=$("#"+plugid);
		if(!($grid&&$grid.get(0)))return;
		return $grid.data(gridview.defaults.core);
	}

	gridview._set_edit=function(plugid,target,rowi){
		var that=this._get_object(plugid);if(!that)return;
		that.setEditIndex(rowi,true);
	}
	gridview._set_update=function(plugid,target,rowi,isnew){
		var that=this._get_object(plugid);if(!that)return;
		that.setUpdateIndex(rowi);
	}
	gridview._set_cancel=function(plugid,target,rowi){
		var that=this._get_object(plugid);if(!that)return;
		that.setCancelIndex(rowi);
	}

	function __gridview(element,options){
		var opt=this.options=options;
		__gridview.base.constructor.call(this);

		this.$elem = $(element);
		this.$grid=$("<div "+opt.core+"='grid' />").appendTo(this.$elem).attr("id",this._plugid).data(opt.core,this);
		
		this.$body=$("<div "+opt.core+"='body' />").appendTo(this.$grid);
		this.$footer=$("<div "+opt.core+"='footer' />").appendTo(this.$grid);
		this._tr_core=opt._tr_core;
		this._td_core=opt._td_core;

		this._edit_row_index=-1;
		this._field_index=0;
		this._data={};//rows  total
		this._pager=$.extend({pagesize:10},opt.pager);//参数存储
		this._sindexs={};//选中索引

		opt.filter=opt.filter||{};
		opt.filter.pagesize=this._pager.pagesize;
		opt.filter.offset=0;
		//this._pager_config=$.extend({},{pageindex:0,pagesize:15},opt.pager)
		//this.datasource();
		this.init();
		//this._write_css(this._plugid,"#"+this._plugid+" td{display:none;}");
	}

	__gridview.prototype.init=function(){
		var that=this,opt=this.options;
		this.$footer.empty();
		if(opt.pager) this.$footer.append("<div data-plug='pager' />");
		var offi=opt.autonumber===true?1:-1;
		offi=(opt.autonumber!==false&&typeof opt.autonumber=="number")?opt.autonumber:offi;
		var columns=this.columns=[{text:"&nbsp;序号",width:(opt.autonumberwidth||opt.width),render:function(row,index){return offi+index;},visible:offi>-1}].concat(opt.columns);
		for(var i=0,len=columns.length;i<len;i++){
			if(!columns[i]){
				columns.splice(i,1);
				i--;
				len=columns.length;
				continue;
			}
			if(!columns[i].id){
				columns[i].id=this._plugid+"_"+this._field_index++;
			}
			if(columns[i].type=="select"){
				var items=columns[i].items||[];
				columns[i].select=$("<select></select>");
				var s="";
				var vn=columns[i].displayValue||"value";
				var tn=columns[i].displayName||"text";
				for(var j=0,l=items.length;j<l;j++){
					s+=("<option value='"+(items[j][vn]||"")+"'>"+(items[j][tn]||"")+"</option>");
				}
				columns[i].select.html(s);
			}
			columns[i]=$.extend({},opt._default_columns,columns[i]);
		}
	};


	__gridview.prototype.bind=function(fn){
		var that=this;
		if(this._bind_timer)clearTimeout(this._bind_timer);
		this._bind_timer=setTimeout(function(){
			that._bind(fn);
		},10);
	};
	__gridview.prototype._bind=function(fn){
		var that=this,opt=this.options;
		this.__bind(fn);
		this.event();
		var d=this._data,p=this._pager;
		p.trigger={
			change:function(index,j){
				that._pagechange(index,null,this);
			},
			sizechange:function(size){
				that._pagechange(null,size,this);
			}
		}
		p.recordcount=(d.total!=null?d.total:p.recordcount);
		if(opt.footer&&opt.footer.pager)$("[data-plug='pager']",this.$footer).show().pager(p);
		else $("[data-plug='pager']",this.$footer).hide();
	};

	__gridview.prototype.__bind=function(fn){
		this.$body.html(this._table(this.columns)); 
	}

	__gridview.prototype._pagechange=function(pageindex,pagesize,opager){
		var that=this,opt=this.options;
		var optp=opager.options;//,pager=opt.pager
		//$.extend(this._pager,pager.options);//拷贝部分
		if(pageindex!=null){
			that.trigger("pagechange",[pageindex,optp.pageindex]);
			this._pager.pageindex=pageindex;
		}
		if(pagesize!=null){
			that.trigger("pagesizechange",[pagesize]);
			this._pager.pagesize=pagesize;
		}
		if(pagesize!=null){
			this._pager.pageindex=0;//数目转换后 页码清零 
		}
		opt.filter.pagesize=this._pager.pagesize;
		opt.filter.offset=pageindex*(optp.pagesize||0);
		that.datasource();//opt.data 传入 可能会覆盖 filter值
	}

	__gridview.prototype.event=function(){
		//jQuery.noConflict();

		/*var tbody=this.$elem.find("table").eq(0).children("tbody");
    	tbody.find("tr").hover(function(){
    		$(this).addClass("hover");
    	},function(){
    		$(this).removeClass("hover");
    	}).filter("tr:even").attr("class","even");*/
		var that=this;
		function _event(e){
			var t=e&&e.target;
			var tr=$(t).parents("tr").eq(0);if(!(tr&&tr.get(0)))return;
			if(!that.$elem.find(tr).length)return;
			if(tr.hasClass("hover"))return;
			if(that._s_tr)that._s_tr.removeClass("hover");
			that._s_tr=tr.addClass("hover");
		}
		that._mouse_move_timer=null;
		this.$elem.off("."+this._plugid).on("mousemove",function(e){
			if(that._mouse_move_timer)clearTimeout(that._mouse_move_timer);
			that._mouse_move_timer=setTimeout(function(){
				_event(e);
			},10);
		});

	};
	__gridview.prototype._error=function(){
		var that=this,opt=this.options;
		return $("<tr><td colspan='"+opt.columns.length+"'><div class='error'>"+this._data.error+"</div></td></tr>");
	}
	__gridview.prototype._loading=function(){
		var that=this,opt=this.options;
		return $("<tr><td colspan='"+opt.columns.length+"'><div class='loading'></div></td></tr>");
	}
	__gridview.prototype._table=function(columns){
		var d=$("<div class='grid'></div>");
		var table=$("<table></table>").appendTo(d);
		table.append(this._thead(columns)).append(this._tbody(columns)).append(this._tfoot(columns));
		return d;
	}
	__gridview.prototype._thead=function(columns){
		var opt=this.options;
		var out=[];

		if(opt.header&&opt.header.title===false)
			out.push("<tr style='display:none;'>");
		else
			out.push("<tr>");
		//var css="#"+this._plugid+" td{display:none;}\r\n";

		var opt=this.options;
		var css="";
		//css+="#"+this._plugid+" input{width:10%;}\t\n";

		for(var i=0,len=columns.length;i<len;i++){
			var col=columns[i];
			out.push("<th class='c-"+col.id+"'>"+col.text+"</th>");
			var _td_css=[],_th_css=[],_css=[];

			var wrap=col.wrap||opt.wrap;
			if(wrap===false)_css.push("white-space:nowrap;");
			else if(wrap===true)_css.push("word-wrap: break-word; word-break: normal;");
			if(!col.visible)_css.push("display:none;");
			var width=(col.width||opt.width)+"";
			if(width)_css.push("width:"+width+(/(px|%)$/g.test(width)?"":"px").replace(/;$/,'')+"");

			var align=col.align||opt.align;
			if(align)_td_css.push("text-align:"+align+";");

			css+="#"+this._plugid+" .c-"+col.id+"{"+_css.join("")+"}\t\n";
			if(_th_css.length)
				css+="#"+this._plugid+" th.c-"+col.id+"{"+_th_css.join("")+"}\t\n";
			if(_td_css.length)
				css+="#"+this._plugid+" td.c-"+col.id+"{"+_td_css.join("")+"}\t\n";
			//display:table-cell;_display:block;
		}
		out.push("</tr>");
		this._write_css(this._plugid+"-style",css);
		return $("<thead/>").html(out.join(""));
	}
	__gridview.prototype._tbody=function(columns){
		var tbody=$("<tbody/>"),opt=this.options;
		var d=this._data.rows||[];

		if(this._data.loading){
			tbody.append(this._loading());
		}
		else if(this._data.error){
			tbody.append(this._error());
		}
		else{
			for(var i=0,len=d.length;i<len;i++){
				if(!d[i]["_bind_"]){
					d[i]=$.extend({},opt._default_rows,d[i]);
				}
				tbody.append(this._tr(d[i],i,columns));
			}
		}
		return tbody;
	}
	__gridview.prototype._tfoot=function(columns){
		return null;
	}
	__gridview.prototype._tr=function(row,index,columns){
		var tr=$("<tr "+this._tr_core+"='"+index+"' class='"+((index%2)?"":"even")+"'/>"),rowstate=this._get_row_state(row);
		for(var i=0,len=columns.length;i<len;i++){
			tr.append(this._td(row,index,columns[i],i,rowstate));
		}
		return tr;
	}

	__gridview.prototype._get_row_state=function(row){
		if(row["_new_"])return 2;
		else if(row["_edit_"])return 1;
		return 0;
	}
	__gridview.prototype._td=function(row,rowi,column,coli,rowstate){
		var o=null;
		var td=$("<td "+this._td_core+"='' class='c-"+column.id+"'></td>");
		var cell=$("<div class='cell'></div>").appendTo(td);
		if(column.render)o=column.render.call(this,row,rowi,column,rowstate);
		else{
			o=this._get_cells(row,rowi,column,coli,rowstate);
		}
		if(o==null)o="&nbsp;";
		cell.html(o);
		if(column.click)cell.click(function(){
			column.click(row,rowi,column,coli,rowstate);
		});
		return td;
	}
	__gridview.prototype._get_cells=function(row,rowi,column,coli,rowstate){
		var s="",type=column["type"],that=this;
		var css=""

		var checked=this._sindexs[rowi];
		if(column.width)css="width:"+column.width+"px";
		if(rowstate==1||rowstate==2||column.editState){
			if(type=="command"){
				if(rowstate==1)
					s+="<a href='javascript:void(0);' onclick='"+gridview.global+"._set_update(\""+this._plugid+"\",this,"+rowi+");'>"+(column.update===true?"update":column.update)+"</a>";
				else
					s+="<a href='javascript:void(0);' onclick='"+gridview.global+"._set_update(\""+this._plugid+"\",this,"+rowi+",true);'>"+(column.add===true?"add":column.add)+"</a>";
				
				s+="&nbsp;&nbsp;<a href='javascript:void(0);' onclick='"+gridview.global+"._set_cancel(\""+this._plugid+"\",this,"+rowi+");'>"+(column.cancel===true?"cancel":column.cancel)+"</a>";
			}
			else if(type=="select"){
				var select=column.select.clone().attr(this._td_core,column.field+"|"+coli);
				if(rowstate==1&&column.readonly)select.attr("disabled","disabled");

				if(column.change)select.change(function(){
					column.change.call(that,$(this).val(),row,rowi,column,coli);
				});
				
				setTimeout(function(){
					select.val(column.content||row[column.field]);
				},10);
				return select;
			}
			else{

				return $("<input "+this._td_core+"='"+column.field+"|"+coli+"' "+(rowstate==1&&column.readonly?" readonly='readonly' ":"")+" style='"+css+"' type='text'/>").val(column.content||row[column.field]);
			}
		}
		else{
			if(type=="command"){
				s+="<a href='javascript:void(0);' onclick='"+gridview.global+"._set_edit(\""+this._plugid+"\",this,"+rowi+");'>"+(column.edit===true?"edit":column.edit)+"</a>";
			}
			else if(type=="select"){
				var v=(column.content||row[column.field])||"";
				return column.select.find("option[value='"+v+"']").eq(0).text()||"";
			}
			else if(type=="radio"){
				var radio=$("<input "+this._td_core+"='"+column.field+"|"+coli+"' "+(checked?"checked='checked'":"")+" type='radio'/>");
				radio.click(function() {
					if($(this).attr("checked"))that.setSelectIndex(rowi);
				});
				return radio;
			}
			else{
				return (column.content||row[column.field]);
			}
		}
		return s;
	}
	__gridview.prototype._get_row_value=function(index){
		var that=this;
		var tr=this.$elem.find("["+this._tr_core+"]").eq(index);
		if(!(tr&&tr.get(0)))return null;
		var vals={};//proto remove
		tr.find("input["+this._td_core+"],select["+this._td_core+"]").each(function(){
			var k=$(this).attr(that._td_core);
			k=(k||"").split('|');k=k[0]||k[1]||k[2]||k[3]||0;
			var v=$(this).val();
			if(v!=null)vals[k]=(vals[k]!=null)?(vals[k]+','+v):v;
			if($(this).is("select")){
				k="_text_"+k;
				v=$(this).children("[value='"+v+"']").eq(0).text();
				vals[k]=(vals[k]!=null&&v!=null)?(vals[k]+','+v):v;
			}
		});
		return $.extend({},this._data.rows[index],vals);
	}
	__gridview.prototype.getRowValue=function(index){
		return this._get_row_value(index);
	}
	__gridview.prototype._set_row_value=function(index,nrow){
		var that=this;if(!nrow)return;
		var row=this._data.rows[index];if(!row)return;
		for(var k in this.options.columns){
			var field=this.options.columns[k]["field"];
			if(field in nrow)row[field]=nrow[field];
		}
	}

	__gridview.prototype._write_css=function(id,css){
		css+=" ";
    	var styleE=document.getElementById(id),styleSheet;//node 元素 chorm 支持
    	var styleSheets=document.styleSheets;
    	for(var i=styleSheets.length-1;i>-1;i--){
    		var st=styleSheets[i];
    		if((st.ownerNode&&st.ownerNode.id==id)||st.id==id)styleSheet=styleSheets[i];
    	}
    	if(!(styleE||styleSheet)){
    		var head=document.getElementsByTagName("head")[0];
			styleE=document.createElement("style");
			styleE.setAttribute("type","text/css");
			styleE.setAttribute("id",id);
			styleE.setAttribute("media","screen");
			head.appendChild(styleE);
			styleSheet=document.styleSheets[document.styleSheets.length-1];

    		/* IE 效果不好 重新处理
    		if(document.createStyleSheet&&false){
    			styleSheet=document.createStyleSheet();
    			//document.styleSheets[document.styleSheets.length]=style;
    		}*/
    	}
		if(styleSheet&&document.createStyleSheet)styleSheet.cssText=css;
		else if(styleE&&document.getBoxObjectFor)styleE.innerHTML=css;
		else {
			var cns=styleE.childNodes;
			for(var i=cns.length-1;i>-1;i--){
				cns[i].parentNode.removeChild(cns[i]);
			}
			styleE.appendChild(document.createTextNode(css));
		}
		/*
		规则插入
		styleSheet.insertRule(rule,i++);
		styleSheet.addRule(key,value,i++);
		*/
	};
	__gridview.prototype.datasource=function(d){//不是是一个非正常数据对象
		var that=this,opt=this.options;
		if(d){
			opt.data=d.data||opt.data;
			opt.filter=$.extend({},opt.filter,d.filter);
			this._sindexs=$.extend({},this._sindexs,d.select);
			this._callback_data=d.callback;
		}
		this._ajax_timer=new Date().getTime();
		this._datasource(this._ajax_timer);
	}
	__gridview.prototype._datasource=function(timer){//数组对象
		var that=this,opt=this.options;
		if(!opt.data)return;
		var e=function(data){
			var r=opt.callback(data);
			that._data.error="";
			if(r&&typeof r=="string")that._data.error=r;
			var d=data;
			if(!data)return;
			if(opt.dataformat.data in data)d=data[opt.dataformat.data];

			var rows1=d[opt.dataformat.rows];
			if(!(rows1&& rows1 instanceof Array)){
				if(d instanceof Array)rows1=d;
			}
			var rows2=[];
			if(rows1){//存在数据源 进行拷贝
				for(var i=0,l=rows1.length;i<l;i++)
					rows2.push(rows1[i]);
			}
			that._data.rows=rows2;
			if(d[opt.dataformat.total]!=null)that._data[opt.dataformat.total]=d[opt.dataformat.total];

			for(var k in that._sindexs){
				var row=that._data.rows[k];if(!row)continue;
				that.trigger("select",[row,k,that._sindexs[k]!==false?true:false]);
			}
			that.bind();
		}
		if(typeof opt.data=="string"){
			this._data.loading=true;
			this.__bind();
			$.ajax({url:opt.data,type:"post",data:opt.filter, dataType:"json", success: function(data){
				that._data.loading=false;
				if(timer!=that._ajax_timer)return;
				var f=that._callback(data);
				if(f===false)return;
				e(data);
			}});
		}
		else e(opt.data);
	}
	__gridview.prototype.setEditIndex=function(index,isEdit){
		this._set_edit_index(index,isEdit);
		if(isEdit!==false&&this._edit_row_index!=index&&this._edit_row_index>-1){
			this._set_edit_index(this._edit_row_index,false);
		}
		this._edit_row_index=(isEdit!==false?index:-1);
		this.bind();
	}
	__gridview.prototype.setCancelIndex=function(index){
		var row=this._data.rows[index];if(!row)return;
		var rowstate=this._get_row_state(row);
		if(rowstate==2)this._data.rows.splice(index,1);
		else if(rowstate==1)this._set_edit_index(index,false);
		this.bind();
	}
	__gridview.prototype.setSelectIndex=function(index,selected){
		var that=this,opt=this.options;
		var row=that._data.rows[index];if(!row)return;
		this._sindexs=opt.multiple?(this._sindexs||{}):{};
		selected=selected!==false?true:false;
		this._sindexs[index]=selected;
		that.trigger("select",[row,index,selected]);
		this.bind();
	}
	__gridview.prototype.setUpdateIndex=function(index){
		var row=this._data.rows[index];
		var vals=this._get_row_value(index);
		var result=this.trigger("rowupdate",[(row||[])[index],vals,index,row&&row["_new_"]]);
		if(result!==false){
			if(result){//update row
				vals=(typeof result=="object")?result:vals;
				this._set_row_value(index,vals);
			}
			if(typeof result=="object"){
				row["_new_"]=false;
				row["_edit_"]=false;
				this.bind();
			}
			else this.datasource();
		}
	}
	__gridview.prototype.getData=function(){
		return this._data;
	}
	__gridview.prototype.deleteIndex=function(index){
		var row=this._data.rows[index];
		var vals=this._get_row_value(index);
		var result=this.trigger("rowdelete",[(row||[])[index],vals,index,row&&row["_new_"]]);
		if(result!==false){
			this._set_delete_index(index);
		}
	}
	__gridview.prototype.addRow=function(row,index){
		if(!row)row=0;
		if(typeof row=="number"){
			if(index==null&&typeof index !="number")index=row;
			row={};
		}
		var rows=this._data.rows;
		if((index==null)||index>=rows.length)index=rows.length;
		if(index<0)index=0;
		row=row||{};
		row["_new_"]=true;
		row["_edit_"]=true;
		rows.splice(index,0,row);
		this.setEditIndex(-1,true);
	}

	__gridview.prototype._set_edit_index=function(index,edit){
		if(!this._data)return;
		var rows=this._data.rows;if(!rows)return;
		if(rows[index]){
			rows[index]["_edit_"]=edit;
			this.__bind();
		}
	}
	__gridview.prototype._set_delete_index=function(index){
		if(!this._data)return;
		var rows=this._data.rows;if(!rows)return;
		rows.splice(index,1);
		this.__bind();
	}
	__gridview.prototype._get_row=function(index){
		if(!this._data)return;
		return this._data.rows[index];
	}


	__gridview.prototype._callback=function(data){
		var that=this,opt=this.options;
		var f1=this._callback_data&&this._callback_data(data);
		var f2=this.trigger("callback",[data]);
		if(f1===false||f2===false)return false;
		return true;
	}
	$.fn.gridview = function (option,cmd,params) {
	  return this.__init(gridview,option,cmd,params);
	};
	$.fn.gridview.Constructor = __gridview;
	$.fn.gridview.cell={
		"edite":1
	}
	gridview.getObject=function(target){
		if(typeof target=="object"&&target)
			return target.data(gridview.defaults.core);
		return null;
	};
	gridview.constructor=__gridview;
	$J.__extend($J.fn.core,gridview);
	J.fn.gridview=gridview;

	var pager={};
	pager.defaults = {core:"data-plug-pager"
	,recordcount:0
	,pagesize:0
	,pagesizeitems:[10,25,50]
	,pageindex:0
	,showpagecount:10
	,empty:""
	,style:"none"
	,item:"<a href='javascript:void(0);' class=@class>@text</a>"//模板对象
	,item_more:"..."
	,item_first:"首页"
	,item_last:"末页"
	,item_prev:"上一页"
	,item_next:"下一页"
	//,item_class:["normal","hover","select","disabled"]
	,item_class:["normal","normal1","on","gray"]
	,info:'当前第<b>@pageindex/@pagecount</b>页 总共<b>@recordcount</b>条'
	,content:'<div class="pager-default"><div class="pager" ><div class="info" data-plug-pager="info"></div><p data-plug-pager="body"></p></div></div>'
	,trigger:{max:null}
	};
	function __pager(element,options){
		__pager.base.constructor.call(this);
		this.options=options;
		this.$elem = $(element);

		//this.pageindex=0;
		//this.pagesize=10;

		//this.init();
		//this._write_css(this._plugid,"#"+this._plugid+" td{display:none;}");
	}
	__pager.prototype.init=function(){
		var that=this,opt=this.options;
		this.pagesize=opt.pagesize=this.define(opt.pagesize,1);
		opt.pagecount=(opt.recordcount<1||opt.pagesize<1)?0:Math.ceil(opt.recordcount/opt.pagesize);
		this.pageindex=opt.pageindex=this.define(opt.pageindex,0);

		if(opt.pageindex>opt.pagecount-1)opt.pageindex=opt.pagecount-1;
		opt.pageindex=Math.max(opt.pageindex,0);
		var list=this.list=[];//页码列表
		var count=0,flag=1,index,start,end;
		index=start=end=opt.pageindex;

		if(opt.empty&&index>opt.pagecount-1){
			that.empty();
			return;
		}
		this.$elem.html($(this.options.content||"<div></div>"));
		this.$body=this.$elem.find("["+this.options.core+"='body']").eq(0);
		this.$info=this.$elem.find("["+this.options.core+"='info']").eq(0);

		while(list.length<opt.showpagecount&&(start>=0||end<opt.pagecount)){
		  if(index>=0&&index<opt.pagecount)list.push(index);
		  flag=0-flag;
		  index+=++count*flag;
		  if(flag>0)end=index;//当flag<0 往左移动
		  else start=index;
		}
		this.list.sort(function(a,b){return a-b;});//默认升序排序

		opt.item_tag=this._get_item({pageindex:0,classn:opt.item_class[0],text:"-"});
		opt.item_tag=opt.item_tag&&opt.item_tag.get(0).nodeName;
		this.write();


	};
	__pager.prototype.empty=function(){
		var that=this,opt=this.options;
		if(opt.empty)that.$elem.html(opt.empty);
	}

	__pager.prototype._get_item=function(data){
		//data pageindex,class,text data
		var opt=this.options;
		data=data||{};
		var item=opt.item;
		var $o=null;
		if(typeof item=="function")$o=item.apply(this,[data]);
		else if(typeof item=="string"){
			item=item.replace("@class",data.classn||"");
			item=item.replace("@text",data.text||"");
			$o=$(item);
		}
		if(!$o)return;
		var d=data.data||{};
		for(var k in d)$o.attr(k,d[k]);
		$o.attr(opt.core+"-pageindex",data.pageindex||0);
		//$o.attr(opt.core+"-pageindex",data.pageindex||0);
		return $o;
	}
	__pager.prototype.write=function(){
		var that=this,opt=this.options;
		var list=this.list,l=list.length,html="";
		var index,start,end,pagecount=opt.pagecount;
		index=start=end=opt.pageindex;
		that.$body.html("");
		var dlist=[];
		var dc=opt.item_class||[4];

		if(opt.info){
			var str=opt.info.replace("@pageindex",(opt.pageindex+1))
			.replace("@pagecount",(opt.pagecount))
			.replace("@pagesize",(opt.pagesize))
			.replace("@recordcount",(opt.recordcount));
			this.$info.html(str);
		}

		for(var i=0;i<l;i++){
			var j=list[i];
			dlist.push(this._get_item({pageindex:j,text:(j+1),classn:(j!=index?dc[0]:dc[2])}));
		}
		if(list.length>0){
			start=list[0];
			end=list[list.length-1];
		}
		if(opt.item_more&&start>0){//存在更多
			dlist.unshift(this._get_item({pageindex:start-1,text:opt.item_more,classn:dc[0]}));
		}
		if(opt.item_prev){
			dlist.unshift(this._get_item({pageindex:index-1,text:opt.item_prev,classn:(index>0?dc[0]:dc[3])}));
		}
		if(opt.item_first){
			dlist.unshift(this._get_item({pageindex:0,text:opt.item_first,classn:(index>0?dc[0]:dc[3])}));
		}
	   	if(opt.item_more&&end<(pagecount-1)){//存在更多
		 	dlist.push(this._get_item({pageindex:(end+1),text:opt.item_more,classn:dc[0]}));
		}
		if(opt.item_next){
			dlist.push(this._get_item({pageindex:(index+1),text:opt.item_next,classn:(index<(pagecount-1)?dc[0]:dc[3])}));
		}
		if(opt.item_last){
			dlist.push(this._get_item({pageindex:(pagecount-1),text:opt.item_last,classn:(index<(pagecount-1)?dc[0]:dc[3])}));
		}
		if(opt.dropdownlist){
			var dropdownstr="";
			for(var i=0;i<opt.pagecount;i++){
				dropdownstr+="<option value="+i+" "+(i==opt.pageindex?"selected":"")+">"+(i+1)+"/"+opt.pagecount+"</option>";
			}
			if(dropdownstr!="")dropdownstr="<select "+opt.core+"='dropdownlist'>"+dropdownstr+"</select>";
			dlist.push($(dropdownstr));
		}
		if(opt.pagesizeitems){
			var str="";
			str+="<select "+opt.core+"='pagesizeitems'>";
			var items=opt.pagesizeitems;
			for(var i=0,len=items.length;i<len;i++){
			str+="<option value="+items[i]+" "+(items[i]==opt.pagesize?"selected":"")+">"+items[i]+"</option>";
			}
			str+="</select>";
			dlist.unshift($(str));
		}
		for (var p = dlist.shift(); p;p=dlist.shift()) {
			that.$body.append(p);
		};
		//if(opt.info){
		//	html=opt.info.replace(/@pageindex/,(opt.pageindex+1)).replace(/@recordCount/,opt.recordCount)
		//	.replace(/@pagesize/,opt.pagesize).replace(/@pagecount/,opt.pagecount)+html;
		//}
		that.event();
	},
	__pager.prototype.event=function(){
		var that=this,opt=this.options;
		var clist=that.$body.children(opt.item_tag);
		var dc=opt.item_class;

		clist.filter("."+dc[0]+",."+dc[1]).hover(function(){
			$(this).addClass(dc[1]).removeClass(dc[0]);
		},function(){
			$(this).addClass(dc[0]).removeClass(dc[1]);
		});
		clist.click(function(){
			var pageindex=$(this).attr(opt.core+"-pageindex");
			pageindex=that.define(pageindex,that.pageindex);
			if($(this).hasClass(dc[0])||$(this).hasClass(dc[1])){
				that.trigger("click",[pageindex]);
				that._to(pageindex);
			}
		});
		clist=that.$body.children("select["+opt.core+"='dropdownlist']");
		if(clist.length>0){
			clist.off("change").on("change",function(){
				that._to($(this).val());
			});
		}
		clist=that.$body.children("select["+opt.core+"='pagesizeitems']");
		if(clist.length>0){
			clist.off("change").on("change",function(){
				that._to(that.pageindex,$(this).val());
			});
		}
	},
	__pager.prototype._to=function(pageindex,pagesize){
		pageindex=this.define(pageindex,this.pageindex);
		pagesize=this.define(pagesize,this.pagesize);
		if(pageindex!=this.pageindex)this.trigger("change",[pageindex,this.pageindex]);
		if(pagesize!=this.pagesize)this.trigger("sizechange",[pagesize]);
		this.pageindex=pageindex;
		this.pagesize=pagesize;
	}

	__pager.prototype.define=function(v,dv){
		v=typeof v=="string"?parseFloat(v):v;
		if(isNaN(v)||!(v>-1))v=dv;
		return v;
	},

	$.fn.pager = function (option,cmd,params) {
	  return this.__init(pager,option,cmd||"init",params);
	};
	$.fn.pager.Constructor = __pager;

	pager.constructor=__pager;
	$J.__extend($J.fn.core,pager);
	J.fn.pager=pager;

};

if(!window["jQuery"]){
	J.require("jquery");
	J.define(__func);
}
else __func();