J.require("dialog");
J.require("ui");
J.define(function(){
	//绑定对象为隐藏域 动态生成 span
	var defaults={core:"data-plug-self-dialog",
		displayName:"text",
		displayValue:"value",
		multi:false,
		columns:[
		{text:"名"},
		{text:"值"}
		]
	};
	function __odialog(element,options){
		this.options=options;
		this.value="";
		this.text="";
		this.$elem = $(element);
		var _td_core=J.fn.gridview.defaults._td_core;
		this.$input=$("<input type='hidden' "+_td_core+"='"+(this.options.field||this.options.displayValue)+"'></input>").appendTo(this.$elem).val(this.value||"");
		this.$span=$("<span></span>").appendTo(this.$elem).text(this.text||"请选择").css({"cursor":"pointer"});
		this.id=(this.$elem.attr("id")||"select_box")+new Date().getTime();
		this.event();
	}
	__odialog.prototype.init=function(){
		var that=this;
		//(","+that.value+",").indexOf(","+that.value+",")
		this.options.columns.push({text:"选择",render:function(row){
			var ischeck=false;
			var a=$("<a href='javascript:void(0);'>选择</a>").click(function(){
				that.select(row);
			});
			return a;
		}});
	}
	__odialog.prototype.event=function(){
		var that=this;
		this.$span.off("click").on("click",function(){
			that.open();
		});
	}
	__odialog.prototype.select=function(row){
		var that=this,opt=this.options;
		this.$input.val(row[opt.displayValue]||"");
		this.$span.text(row[opt.displayName]||"");
		this.close();
	}
	__odialog.prototype.open=function(){
		var that=this,opt=this.options;
		if(!opt.data)return;
		if(opt.data instanceof Array)this._init_dialog(opt.data,null);
		else{
		   	$.ajax({url:opt.data,type:"post", data:{}, dataType:"json", success: function(data){
		        if(data.s!=1){
		          alert(data.d);
		          return;
		        }
		        var rows=data.d;
		        if(rows instanceof Array)that._init_dialog(rows);
		        else if(rows["rows"])that._init_dialog(rows["rows"],rows["total"]);
		  	}});
		}
	}
	__odialog.prototype.close=function(){
		J.fn.dialog.close(this.id);
	}
	
	__odialog.prototype._init_dialog=function(rows,total){
		var that=this,opt=this.options;
		var $div=$("<div />");
		var pager=(total!=null)?{info:false,pagesizeitems:false,pagesize:10,item_first:"",item_last:"",showpagecount:0,item_more:"",recordcount:total}:false;
		$div.gridview({
			columns:opt.columns,
			autonumber:true,
			pager:pager,
			data:rows
		});
		$div.gridview("datasource");
		J.fn.dialog.jopen({name:this.id,content:$div,footer:false,title:(opt.title||"请选择")});
	}
	$.fn.odialog=function(option){
		var $this=$(this).data(defaults.core);
		if(!$this){
			$this=new __odialog($(this),$.extend({},defaults,option));
			$(this).data(defaults.core,$this);
		}
		else
			$this.options=$.extend({},$this.options,option);
		$this.init();
	}
});
