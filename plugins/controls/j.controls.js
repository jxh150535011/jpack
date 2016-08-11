var __func=function () {

	var $=jQuery;

	$.fn.__init=function($object,option,cmd,params){
		var _defaults=$object.defaults;
		return this.each(function () {
		var $this = $(this), data = $this.data(_defaults.core), options;

		options= $.extend({}, data?data.options:_defaults, typeof option == 'object'?option:{});
		if (!data) $this.data(_defaults.core, (data = new $object.constructor(this, options)));
		else data.options=options;

		if(typeof option =='string'&&data[option])data[option].apply(data,cmd||[]);
		else if(typeof cmd =='string'&&data[cmd])data[cmd].apply(data,params||[]);
		});
	};
	var $J=J;
	var ddl={};//定义基本容器
	ddl.defaults = {core:"data-plug-ddl",head:"head",body:"body",item:"item",type:"hover",key:"shut"
	,trigger:{ready:null,change:null,hover:null,click:null}
	}
	function __ddl(element,options){
		__ddl.base.constructor.call(this);
		this.options=options;
		this.$elem = $(element);
		this.init();
	}
	ddl.constructor=__ddl;
	$J.__extend($J.fn.core,ddl);

	__ddl.prototype.open=function(){
		var that=this,opt=this.options;
		that.$elem.triggerHandler("switch."+opt.core,["open"]);
	}

	__ddl.prototype.shut=function(){
		var that=this,opt=this.options;
		that.$elem.triggerHandler("switch."+opt.core,["shut"]);
	}

	__ddl.prototype.init=function(){
		var that=this,opt=this.options;
		that.$head=that.$elem.find("["+opt.core+"='"+opt.head+"']");
		that.$body=that.$elem.find("["+opt.core+"='"+opt.body+"']");
		that.$item=that.$elem.find("["+opt.core+"='"+opt.item+"']");
		that.event();
	}
	__ddl.prototype.event=function(){
		var that=this,opt=this.options;
		that.$elem.off("."+opt.core).on("switch."+opt.core,function(event,key){//列表隐藏显示
			if(that.timer)clearTimeout(that.timer);
			if(that.$body.is(":animated")||((opt.key!="shut")^(key=="shut")))return that.trigger("change",[opt.key],false);//异或 为true为执行
			if(key=="open"){opt.key=key;that.trigger("change",[opt.key,true]);}
			else{
				that.timer=setTimeout(function(){
					opt.key=key;
					return that.trigger("change",[opt.key]);
				},100);
			}
		});
		var bodyClick=false;
		var hideDocClick=false;
		if(opt.type=="hover"){
			that.$body.add(that.$head).mouseenter(function(){
			that.$elem.triggerHandler("switch."+opt.core,["open"]);
			}).mouseleave(function(){
			that.$elem.triggerHandler("switch."+opt.core,["shut"]);
			});
		}
		else{
			that.$body.off("."+that.core).on("click."+that.core,function(){
				bodyClick=true;
				hideDocClick=that.trigger("bodyClick",[])!==false;
			});
			var _bindDoc=function(){
				$(document).off("click."+that.plugid).on("click."+that.plugid,function(){
					if(bodyClick&&!hideDocClick){
					bodyClick=false;
					return;
				}
				bodyClick=false;
				$(document).off("click."+that.plugid);
				opt.key="shut";
				that.$elem.triggerHandler("switch."+opt.core,["shut"]);
				//return that.trigger("change",[opt.key]);
			});
			}
			_bindDoc();
			that.$head.off("."+that.core).on("click."+that.core,function(){
				var isn=that.$body.is(":animated")||(opt.key=="open");
				opt.key="open";
				that.trigger("change",[opt.key,!isn]);
				_bindDoc();
				return false;
			});
		}
	}
	$.fn.ddl = function (option) {
	  return this.__init(ddl,option);
	};
	$.fn.ddl.Constructor = __ddl;
	$J.fn.ddl=ddl;

	var input={};//定义基本容器
	input.defaults = {core:"data-plug-input",words:""
	,trigger:{ready:null,change:null,hover:null,click:null}
	}
	function __input(element,options){
		__ddl.base.constructor.call(this);
		this.options=options;
		this.$elem = $(element);
		this.init();
	}
	input.constructor=__input;
	$J.__extend($J.fn.core,input);

	__input.prototype.init=function(){
		var that=this,opt=this.options;
		that.event();
	}
	__input.prototype.event=function(){
		var that=this,opt=this.options;
		this.$elem.off("."+opt.core).on("focus."+opt.core,function(){
			var words=opt.words||$(this).attr(opt.core+"-words");
			if($.trim($(this).val())==words)$(this).val("");
		}).on("blur."+opt.core,function(){
			var words=opt.words||$(this).attr(opt.core+"-words");
			if($.trim($(this).val())=="")$(this).val(words);
		}).blur();
	}
	$.fn.input = function (option) {
	  return this.__init(input,option);
	};
	$.fn.input.Constructor = __input;
	$J.fn.input=input;


	var jbind={};
	jbind.defaults={core:"data-plug-jbind"
	,url:"",post:{},displayName:"text",displayValue:"value",value:"",space:true
	,dataformat:{data:"d"}
	};
	function __jbind(element,options){
		__jbind.base.constructor.call(this);
		this.options=options;
		this.$elem = $(element);
		this._data={};
		this.init();
	}
	jbind.constructor=__jbind;
	$J.__extend($J.fn.core,jbind);

	__jbind.prototype.init=function(){
		var that=this,opt=this.options;

		if(!this.$elem.is("select"))return;
		this.$elem.empty();
		if(typeof opt.data=="string"){
			$.ajax({url:opt.data,type:"post", data:opt.post, dataType:"json", success: function(data){
				if(!(typeof data=="object"&&data))return;
				if(data instanceof Array)that._data=data;
				else if(opt.dataformat.data in data)that._data=data[opt.dataformat.data];
				that.bind();
		  	}
		  	});
		}
		else {
			this._data=opt.data;
			this.bind();
		}
	}
	__jbind.prototype.bind=function(){
		var that=this,opt=this.options,rows=[];
		if(this._data instanceof Array)rows=this._data;
		else if(this._data["rows"])rows=this._data["rows"];
		var t=opt.displayName||"name",v=opt.displayValue||"value";
		var _s=[];

		if(opt.space===true){
			_s.push("<option></option>");
		}
		for(var i=0,l=rows.length;i<l;i++){
			var row=rows[i];
			_s.push("<option "+((t in row)?("value='"+row[v]+"'"):"")+">"+row[t]+"</option>");
		}
		this.$elem.html(_s.join(""));
		setTimeout(function(){that.$elem.val(opt.value||"");},1);
	}

	$.fn.jbind = function (option) {
		return this.__init(jbind,option);
	};
	$.fn.jbind.Constructor = __jbind;
	$J.fn.jbind=jbind;

};
if(!window["jQuery"]){
	J.require("jquery");
	J.define(__func);
}
else __func();