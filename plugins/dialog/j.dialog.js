/* =========================================================
 *Write：金兴亨
 *Date: 2013-04-01 改版
 *Update 2013-04-08
 * ========================================================= */

var __f=function($J){
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
}

var odiv={};//定义基本容器
odiv.defaults = {core:"data-plug-odiv",left: "auto",top: "auto",width:"auto",height:"auto",zindex:10000
,trigger:{ready:null}
}
function __odiv(element,options){
	__odiv.base.constructor.call(this);
	this.options=options;
	this.$elem = $(element);
	this.$parent=$(options&&options.parent?options.parent:document.body);
	this.$body=$("<div style='position:absolute;display:block;overflow: visible;z-index:"+(this.options.zindex||1)+";' />");
	this._isshow=false;
}
odiv.constructor=__odiv;
$J.__extend($J.fn.core,odiv);

$.fn.odiv = function (option) {
	return this.__init(odiv,option);
};
$.fn.odiv.Constructor = __odiv;
odiv.getObject=function(content,options){//获取绝对定位对象
	return $(content).odiv(options).data(odiv.defaults.core);
}
$J.fn.odiv=odiv;



var tip={};
tip.defaults = {core:"data-plug-tip",zindex:10000
,trigger:{ready:null}
}
function __tip(element,options){
	__tip.base.constructor.call(this,element,options);
	this.options=options;
	this.crect={};
	if(!this.options.left)this.options.left="left";
	if(!this.options.top)this.options.top="top";
	this.event();
}
tip.constructor=__tip;
$J.__extend(odiv,tip);
__tip.prototype.toggle=function(key,fn){
	var that=this,opt=this.options;
	this._hold();
	if(this._isshow^key!="open")return;
	if(key=="open"){
		this._isshow=true;
		if(this.$body)this.$body.remove();
		this.$body=$("<div style='position:absolute;display:block;overflow: visible;z-index:"+(this.options.zindex||1)+";' />").appendTo(this.$parent);
		this.$body.append(opt.tipTemp).off("."+opt.core).on("mouseenter."+opt.core,function(){
			that._hold();
		}).on("mouseleave."+opt.core,function(){
			that._continue();
		});
		this._set_size();
		if(opt.timeout)this._close(opt.timeout);
	}
	else {
		this._close(200);
	}

}
__tip.prototype.show=function(){
	this.toggle("open");
}
__tip.prototype.close=function(){
	this.toggle("close");
}
__tip.prototype._continue=function(){
	if(this._timer)clearTimeout(this._timer);
	this._stop_timer=new Date().getTime();
	if(this._timeout){
		var _time=this._timeout-this._stop_timer+this._start_timer;
		this._close(Math.max(_time,200));
	}
}
__tip.prototype._hold=function(){
	if(this._timer)clearTimeout(this._timer);
	this._start_timer=new Date().getTime();
}
__tip.prototype._close=function(timer){
	var that=this;
	timer=timer||200;
	this._timeout=timer;
	if(this._timer)clearTimeout(this._timer);
	this._timer=setTimeout(function(){
		that._isshow=false;that.$body.remove();
	},timer);
}

__tip.prototype.event=function(){
	var that=this,opt=this.options;
}
__tip.prototype._set_size=function(){
	var that=this,opt=this.options;
	//先写默认判定位置
	if(!this.$body)return;
	var css=this.$elem.offset();
	var owidth=this.$elem.width();var oheight=this.$elem.height();
	var c=this.$body.children().eq(0);if(!(c&&c.get(0)))c=this.$body;
	css.width=this.$body.width()||c.width(),css.height=this.$body.height()||c.height();
	//css.left+=css.width;
	//css.left+=css.height;
    function _format(v){
      if(v&&typeof v=="string")return eval(v);
      else if(v)return v;
      return null;
    }
    var width=css.width,height=css.height,auto=0;
    var left=css.left,top=css.top,right=left+owidth,bottom=top+oheight;

    auto=right;
    css.left=_format(opt.left)||0;


    auto=top;
    css.top=_format(opt.top)||0;

    auto=css.width;
    css.width=_format(opt.width)||0;

    auto=css.height;
    css.height=_format(opt.height)||0;

	if(opt.resize)for (var k in css)css[k]+=opt.resize[k]||0;
	this.crect=css;
	this.$body.css(this.crect);
}

$.fn.tip = function (option,cmd,params) {
	//var obj=$(this).data(tip.defaults.core);if(!obj)$(this).data(tip.defaults.core,(obj=$(option.tipTemp||"<div />")));
	return this.__init(tip,option,cmd,params);
};
$.fn.tip.Constructor = __tip;
tip.getObject=function(content,options){//获取绝对定位对象
	return $(content).tip(options).data(tip.defaults.core);
}
$J.fn.tip=tip;


var fixed={};
fixed.defaults = {core:"data-plug-fixed",backdrop: false,backdropTemp:"",move:false,animate:true,left: "auto",top: "auto",width:"auto",height:"auto",zindex:10000,left:0,top:0
,trigger:{ready:null,change:null,open:null,close:null,restore:null,berforerestore:null}
,mark:"fixed:div"};
function __fixed(element, options){
	__fixed.base.constructor.call(this);
	this.options=options;
	this.$elem = $(element);
	this.$parent=$(options.parent?options.parent:document.body);
	this._mark=null;//标记
	this._isshow=false;
	this._in=$.contains($(document.body),this.$elem);//初始化对象是否来自容器内
	this.$body=$(options.bodyTemp||"<div style='position:fixed;display:block;overflow: visible;' />").hide();
	this.$body.css({"z-index":options.zindex}).appendTo(this.$parent);
	if(options.backdrop){
    	this.$backdrop=$(options.backdropTemp||"<div style='position:fixed;display:block;right: 0;bottom: 0; left:0;top:0;background-color: #000;' />").hide();
    	this.$backdrop.css({"opacity":0.6,"z-index":options.zindex-1}).appendTo(this.$parent);
    }
    if($.browser.msie&&$.browser.version=="6.0"){
      this.$body.css("position","absolute");
      if(this.$backdrop)this.$backdrop.css("position","absolute");
    }
    if(options.parent&&options.parent!=window){
      if(!this.$parent.css("position"))this.$parent.css("position","relative");
      this.$body.css("position","absolute");
      if(this.$backdrop)this.$backdrop.css("position","absolute");
    }
    this.$move=this.$elem.find("["+this.options.core+"='move']");
    if(this.options.move)
    this.$cmove=this.$body.clone().css({"z-index":options.zindex+2,"background-color": "blue","opacity":1});
	
	this._overflow=this.$parent.css("overflow");
	this._crect={left:this.options.left,top:this.options.top,width:this.options.width,height:this.options.height};//配置值
    this._rect={};//实际值
    this._ie6=$.browser.msie&&$.browser.version=="6.0";
};
fixed.constructor=__fixed;
$J.__extend($J.fn.core,fixed);//继承父类方法

/*__fixed.prototype._get_global_value=function(){
	var d=$(this.$parent).data(this.options.core);
	if(!d)$(this.$parent).data(this.options.core,(d={count:0}));
	return d;
}
__fixed.prototype._add_global_value=function(){
}
__fixed.prototype._remove_global_value=function(){
	
}*/
__fixed.prototype._add_mark=function(){
	if(this._mark||!this._in)return;
    this.$elem.after((this._mark=$("<"+this.options.mark+" />")));
};
__fixed.prototype._remove_mark=function(){
	if(!this._in)return;if(this._mark)this._mark.remove();
	this._mark=null;
};
__fixed.prototype._get_rect=function(_vs){
	_vs=_vs||{};
	var crect=this._get_client_rect();
    function _format(v){
      if(v&&typeof v=="string")return eval(v);
      else if(v)return v;
      return null;
    }
	var fwidth=crect.width,fheight=crect.height;
    var width=crect.width=_format(_vs["width"])||this.$body.width()||this.$elem.width();
    var height=crect.height=_format(_vs["height"])||this.$body.height()||this.$elem.height();
    var left=0,top=0,center=0,right=fwidth-width,bottom=fheight-height;
    center=(right-left)/2;
    crect.left=_format(_vs["left"])||0;
    center=(bottom-top)/2;
    crect.top=_format(_vs["top"])||0;
	crect.fwidth=fwidth;crect.fheight=fheight;
	return crect;
};
__fixed.prototype.resize=function(_rect,animate,fn,bfn){
	var that = this,opt=this.options;
	if(!this._isshow)return;
	var rect=$.extend({},this._crect,_rect);
	//console.log(this._crect);
	rect=this._get_rect(rect);
	var w=rect.fwidth,h=rect.fheight;
	if($.browser.msie&&$.browser.version=="6.0"){
		w=Math.max(w,$(document).width());
		h=Math.max(h,$(document).height());
	}
    if(this.$backdrop)this.$backdrop.width(w).height(h);
    //fn&&fn.call(this,rect);
    this.fixedTo(rect,animate,fn,bfn);
    return _rect;
};
__fixed.prototype.remove=function(){
	this.trigger("berforeclose");
	this.$body.remove();
	this.$backdrop&&this.$backdrop.remove();
	this._isshow=false;
	this.trigger("close");
	//try{delete this;}catch(e){}
}
__fixed.prototype.toggle=function(key,fn){
	var that=this,opt=this.options;
	if(this._isshow^key!="open")return;
	if(key=="open"){
		this._isshow=true;this._add_mark();
		this.$elem.appendTo(this.$body);
		this.resize();
		if(fn)fn.call(this);
		else{
			this.$body.show();
			this.$backdrop&&this.$backdrop.show();
		}
		this.trigger("open");
	}
	else this.restore(fn);
	this.event();
}
__fixed.prototype.restore=function(fn){//自定义关闭动画效果
	var that=this;
	this._isshow=false;
	this.trigger("berforerestore");
    function _restore(){
    	that._mark&&that._mark.after(that.$elem);
    	that._remove_mark();
      	that.$body&&that.$body.hide();
        that.$backdrop&&that.$backdrop.hide();
        that.trigger("restore");
    }
    fn?fn.call(this,_restore):_restore();
};
__fixed.prototype._get_scroll_pos=function(){
	var doc=this._ie6?$(document):this.$parent;
	return  {left:doc.scrollLeft(),top:doc.scrollTop()};
};
__fixed.prototype._get_client_rect=function(){
	if(this.options.parent&&this.options.parent!=window){
		var doc=this.$parent.get(0);
		var target=this.$parent;
		var r={width:target.width(),height:target.height()};
		var overflow=target.css("overflow");
		var overflow_x=target.css("overflow-x")||overflow;
		var overflow_y=target.css("overflow-y")||overflow;
		var s={width:doc.scrollWidth,height:doc.scrollHeight};
		var xscroll=overflow_x=="hidden"?false:((s.width!=r.width)||(s.height<r.height));
		var yscroll=overflow_y=="hidden"?false:((s.height!=r.height)||(s.width<r.width));
		r.width-=yscroll?17:0;
		r.height-=xscroll?17:0;
		return r;
	}
	else{
		return {width:$(window).width(),height:$(window).height()};
	}
};
__fixed.prototype.resizeStart=function(fn){
	var that = this,opt=this.options;
	if(that._resizeTimer)clearTimeout(that._resizeTimer);
	that._resizeTimer=setTimeout(function(){
		var wh=that.$parent.data("wh"+that._plugid);
		var _rect=that._get_client_rect();
		if((!wh)||wh!=_rect){
		//wh={width:_rect.fwidth,height:_rect.fheight};
		that.$parent.data("wh"+that._plugid,_rect);
		if(fn)fn.call(that);
		}
		that.resizeStart(fn);
	},40);
};
__fixed.prototype.fixedTo=function(_rect,animate,fn,bfn){
	_rect=$.extend({},this._rect,_rect);
	var s={left:0,top:0};
	if(this.$body.css("position")=="absolute")s=this._get_scroll_pos();
	if(_rect==this._rect)return;
	this._rect=_rect;
	var css={};
	for(var k in _rect)css[k]=_rect[k];
	css.left+=s.left;css.top+=s.top;
	bfn&&bfn(css);
	if(animate)this.$body.stop().animate(css,400,function(){fn&&fn(css);});
	else {this.$body.css(css);fn&&fn(css)};
};

__fixed.prototype.moveStart=function(e){
	var that=this;
	var of=this.$body.offset();
	var _mc=this._move_config={x:e.pageX,_x:0,y:e.pageY,_y:0,left:of.left,top:of.top,width:this.$body.width(),height:this.$body.height()};
	_mc.drag=this.$cmove.clone().appendTo(this.$parent);
	_mc.over=$("<div style='position:absolute;display:block;right: 0;bottom: 0; left:0;top:0;' />").appendTo(this.$parent);//background-color: #000;
	var crect=this._get_client_rect();
	_mc.maxx=(crect.width-_mc.width);
	_mc.maxy=(crect.height-_mc.height);

	_mc.over.css({width:crect.width,height:crect.height,"z-index":this.options.zindex+1});
	_mc.drag.css({left:_mc.left,top:_mc.top,width:_mc.width,height:_mc.height,opacity:0.6}).show();
	$(document).off("."+this._plugid).on("mousemove."+this._plugid,function(e){
		var __mc=that._move_config;if(!__mc)return;
		var l=__mc.left+e.pageX-__mc.x;var t=__mc.top+e.pageY-__mc.y;
		l=Math.min(_mc.maxx,l);l=Math.max(l,0);
		t=Math.min(_mc.maxy,t);t=Math.max(t,0);
		__mc._x=l-__mc.left;__mc._y=t-__mc.top;
		__mc.drag.css({left:l,top:t});

	}).on("mouseup."+this._plugid,function(e){
		$(document).off("."+that._plugid);
		var __mc=that._move_config;if(!__mc)return;
		__mc.drag&&__mc.drag.remove();__mc.over&&__mc.over.remove();
		that._rect.left+=("+"+__mc._x);that._rect.top+=("+"+__mc._y);
		$.extend(that._crect,that._rect);

		that.resize(that._rect,true);
		that._move_config=null;
		that.moveEnd();
	});
}
__fixed.prototype.moveEnd=function(e){
	
}
__fixed.prototype.event=function(pos){
	var that=this,opt=this.options;
	var $parent=opt.parent?opt.parent:window;
	$($parent).off("."+this._plugid);
	if(this._resizeTimer)clearTimeout(this._resizeTimer);
	this.$move.off("."+this._plugid);
	if(!this._isshow)return;
	if(this.options.move){
		this.$move.on("mousedown."+this._plugid,function(e){
			that.moveStart(e);
		});
	}
	if(this.$body.css("position")=="absolute"){
		$($parent).on("scroll."+this._plugid,function(e){that.fixedTo();});
	}
	if($.browser.msie||$parent==window){//If IE can bind resize event 
		$($parent).on("resize."+this._plugid,function(){
			if(that._resizeTimer)clearTimeout(that._resizeTimer);
			that._resizeTimer=setTimeout(function(){that.resize();},10);
		});
	}
	else
	{
		that.resizeStart(function(){
			that.resize();
		});
	}
};
__fixed.prototype.constructor=__fixed;

$.fn.fixed = function (option) {
	return this.__init(fixed,option);
};
$.fn.fixed.Constructor = __fixed;
fixed.getObject=function(content,options){//获取绝对定位对象
	return $(content).fixed(options).data(fixed.defaults.core);
}
$J.fn.fixed=fixed;


/*dialog code*/
var dialog={};
dialog.defaults = {core:"data-plug-dialog",padding:[],waitTemp:"",wait:true,padding:[0,0,0,0]//padding 上 右 下 左 wait是否进行等待加载
,trigger:{ready:null}
,buttons:{"ok":{show:true,text:"",click:null},"cancel":{show:true,text:"",click:null}}
}; 
function __dialog(element, options){
	__dialog.base.constructor.call(this,element, options);
	var that=this,opt=this.options;
	this.$dbody=this.$elem.find("["+this.options.core+"='body']");//.css({"overflow":"auto"});
	this.$body.css({overflow:"hidden"});
	this.$overlay=$("<div />").css({position:"absolute","z-index":(this.options.zindex+1)}).appendTo(this.$body);
	this._crect=$.extend({},{left:opt.left,top:opt.top,width:opt.width,height:opt.height},{left:"center",top:"center",width:200,height:50
});
	this._parent_overflow={overflow:this.$parent.css("overflow"),"overflow-x":this.$parent.css("overflow-x"),"overflow-y":this.$parent.css("overflow-y")};
	
	this.$btns=this.$elem.find("["+this.options.core+"='maximize'],["+this.options.core+"='minimize'],["+this.options.core+"='normal']").hide();
	if(options.maximizeBox==false)this.$btns.filter("["+this.options.core+"='maximize']").remove();
	if(options.minimizeBox==false)this.$btns.filter("["+this.options.core+"='minimize']").remove();
	this.$elem.find("["+this.options.core+"-button]").hide().each(function(){
		var t=$(this).attr(that.options.core+"-button"),v=opt.buttons[t];
		if(v&&v.show!==false){
			$(this).show();
			if(v.text)$(this).val(v.text);
		}
	});
	this.$title=this.$elem.find("["+this.options.core+"='title']");
	this.$title.html(options.title||"");
	that.$window=null;//子窗体对象
	this._add_reg();
	//if(options.waitTemp)this.$wait=$(options.waitTemp);
	//this.div=$("<div />").css({ "background-color": "gray",  opacity:0.2,"position": "absolute"
	//,"display":"block",width:obj.width(),height:obj.height(),left:offxy.left,"z-index":9998,"top":offxy.top}).appendTo(obj.parent());
}
dialog.constructor=__dialog;
$J.__extend(fixed,dialog);


__dialog.prototype._add_reg=function(){//注册自己
	var name=this.options.name;
	var _list=$(document).data(dialog.defaults.core+"-list");
	if(!_list){
		$(document).data(dialog.defaults.core+"-list",(_list={}));
	}
	if(!_list[name])_list[name]={left:"center",top:"center",name:name};
	$.extend(_list[name],this.options);
	_list[name].object=this;
}
__dialog.prototype._remove_reg=function(){//取消注册
	var _list=$(document).data(dialog.defaults.core+"-list");
	if(!(_list&&_list[this.options.name])) return;
	delete _list[this.options.name];
}
__dialog.prototype.toggle=function(key,fn){//对于fixed 方法 重新定义
	var that=this;
	if(this._isshow^key!="open")return;
	if(key=="open"){this._isshow=true;
		this.trigger("berforeopen");
		this.$elem.appendTo(this.$body);
		this.$body.show();
		this._selects=$("select:visible").hide();

		if(this.$backdrop){
			this.$backdrop.show();
			this.$parent.css({"overflow":"hidden","overflow-x":"hidden","overflow-y":"hidden"});
		}
		this.resize(this._crect);
		this.load();
	}
	else {
		if(this._selects)this._selects.show();
		if(this._parent_overflow)this.$parent.css(this._parent_overflow);
		this.restore(fn);
	}
	this.event();

}
__dialog.prototype.close=function(){//关闭对象
	if(this._selects)this._selects.show();
	if(this._parent_overflow)this.$parent.css(this._parent_overflow);
	this.remove();
	this._remove_reg();
}
__dialog.prototype.getRect=function(){//获取对象
	return this._rect;
}

__dialog.prototype.load=function(){//判断是否进行 加载 还是直接显示
	var that=this,opt=this.options;
	if(this._content_loaded)return;//加载过 就不进行加载处理
	this._content_loaded=true;
	var ajaxTimer=new Date().getTime();//获取执行时间戳
	that.ajaxTimer=ajaxTimer;
	var $content=opt.content||"";
	var $contentType="";
	if(typeof $content=="string"){
		$contentType=$content.substring(0,$content.indexOf(":"));
		$content = $content.substring($content.indexOf(":")+1,$content.length);
	}
	if($contentType=="iframe"){
		that.loadIframe($content,ajaxTimer);
	}
	else if($contentType=="url"){
		that.loadUrl($content,ajaxTimer,{dataType:"text"});
	}
	else if($contentType=="html"){
		that.loadContent($content);
	}
	else{
		that.loadObject($content);
	}
};
__dialog.prototype.waiting=function(){
	this.$overlay.show();
	var css={width:this._rect.width,height:this._rect.height};
	if(this.options.waitTemp){
		this.$wait=$(this.options.waitTemp).appendTo(this.$overlay);
		css.width=Math.max(this.$wait.width(),css.width);
		css.height=Math.max(this.$wait.height(),css.height);
		this.$wait.css(css);
	}
	this.$overlay.css(css);
	this.resize($.extend(this._rect,css),false);
	//this.$wait.appendTo(this.$overlay).show();
};
__dialog.prototype.resize=function(rect,animate,fn){
	var that=this,opt=this.options;
	var _p=opt.padding;
	__dialog.base.resize.call(this,rect,animate,function(_rect){
		that.$dbody.css({width:_rect.width-_p[1]-_p[3],height:_rect.height-_p[0]-_p[2]});
		fn&&fn();
	},function(_rect){//提前事件 如果是要动画 则对dbody 也要执行一个动画
		if(animate)that.$dbody.css({width:_rect.width-_p[1]-_p[3],height:_rect.height-_p[0]-_p[2]},400);
	});

}
__dialog.prototype.toggleWindows=function(t){
	var that=this;
	var key=(that._normal_data&&that._normal_data.key)||"normal"
	if(key==t)return;
	var _rect={width:"fwidth",height:"fheight",left:0,top:0};
	if(t=="maximize"){
		that._normal_data={rect:null,move:that.options.move,key:t};
		that._normal_data.rect=$.extend({},that._crect);
		that.options.move=false;
		that.options.lock=true;
		that.trigger("maximize");
	}
	else{
		_rect=$.extend({},that._normal_data.rect);
		that.trigger("normal");
		that.options.move=that._normal_data.move;
		that.options.lock=false;
		that._normal_data=null;
	}
	var _p=this.options.padding;
	$.extend(that._crect,_rect);//保存状态值
	that.resize(_rect,true);
	console.log(that._crect);
	__dialog.base.event.call(that);
	return false;
}
__dialog.prototype.event=function(){
	__dialog.base.event.call(this);
	var that=this,opt=this.options;
	var $btn=this.$btns.off("."+this._plugid).hide();
	var $cbtn=this.$elem.find("["+this.options.core+"='close']").off("."+this._plugid);
	var $buttons=this.$elem.find("["+this.options.core+"-button]").off("."+this._plugid);
	if(!this._isshow)return;
	var that=this,opt=this.options;
	$btn.filter("["+this.options.core+"!='normal']").show();
	$btn.on("mousedown."+this._plugid,function(){
		var t=$(this).attr(that.options.core);
		$btn.hide().filter("["+that.options.core+"!='"+t+"']").show();
		that.toggleWindows(t);
		return false;
	});
	$cbtn.on("mousedown."+this._plugid,function(){
		that.close(this);
		return false;
	});
	$buttons.each(function(){
		var t=$(this).attr(that.options.core+"-button"),v=opt.buttons[t];
		if(!(v&&v.show!==false))return true;
		$(this).on("click."+that._plugid,function(){
			var b=v&&v.click&&v.click.call(that,that.$window);
			if(b!==false)that.close();
			return false;
		});
	});
}
__dialog.prototype.setBodySize=function(rect,fn){
	if(!this.$dbody)return;if(!this._isshow)return;
	var _p=this.options.padding,_lock=this.options.lock;
	if(_lock)return;
	rect=rect||{};
	if(rect.width&&this.options.width=="auto")rect.width=(rect.width+"+"+_p[1]+"+"+_p[3])||this._rect.width;
	else rect.width=this.options.width;

	if(rect.height&&this.options.height=="auto")rect.height=(rect.height+"+"+_p[0]+"+"+_p[2])||this._rect.height;
	else rect.height=this.options.height;
	/*if(this.options.left=="auto")rect.left=rect.left||(this._rect.left+this._rect.width/2+"-width/2");
	else rect.left=this.options.left;
	if(this.options.top=="auto")rect.top=rect.top||(this._rect.top+this._rect.height/2+"-height/2");
	else rect.top=this.options.top;*/
	$.extend(this._crect,rect);//保存状态值


	this.resize(rect,true,fn);
	/*rect=this._get_rect(this._crect);
    if(this.$backdrop)this.$backdrop.width(rect.fwidth).height(rect.fheight);
    this.$dbody.css({width:rect.width-_padding[1]-_padding[3],height:rect.height-_padding[0]-_padding[2]});
    console.log("width:"+(rect.width-_padding[1]-_padding[3])+"px,height:"+(rect.height-_padding[0]-_padding[2])+"px");
	rect.left=Math.max(rect.left,0);
	rect.top=Math.max(rect.top,0);
    this.fixedTo(rect,true);*/
    return rect;
}
__dialog.prototype.waitend=function(){
	this.$overlay.hide();
	this.$wait&&this.$wait.remove();
};

__dialog.prototype.loadUrl=function(url,timer,option){
	var p=$J.url_params(url);var that=this;
   	if(this._url==url)return;
    this._url=url;
	this.waiting();
    $.ajax({
        url:url,
        type:"POST",
        dataType:(option.dataType||"json"),
        crossDomain:($J.getBasicPath().indexOf(p.head)!=0&&!p.head),//是否跨域
        data:{},
        success:function(data){
        	if(timer==that.ajaxTimer){
        		if(!that.$dbody)return;
        		var doc=$(data);
        		var _rect={width:doc.width(),height:doc.height()};
        		that.loadHtml(doc);
        		that.waitend();
        		that.setBodySize(_rect);
        	}
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
        	//alert(XMLHttpRequest.responseText);
            //fn&&fn(url,null,false);
        }
    });

};
__dialog.prototype.loadIframe=function(url,timer){
    var that=this,opt=this.options;
    if(opt.wait)this.waiting();
    else this.waitend();
    
    if(!(this.$iframe&&this.$iframe.get(0))){
      this.$iframe=$("<iframe scrolling=\"auto\"  frameborder=\"0\" width='100%' height='100%' ></iframe>");
    }
    that.loadHtml(this.$iframe);
    this.$iframe.data("timer",timer).off("."+opt.core).on("load."+opt.core,function(){
    	if(!$(this).attr("src"))return;
        if(that.ajaxTimer==$(this).data("timer")){//当前选中iframe加载完成
        	that.waitend();
            var t="",_rect={width:1,height:1};
            try{w=$(this).get(0).contentWindow;w.focus();t=w.document.title;
            var doc=$(w.document);t=doc.get(0).title;
            that.$title.html(opt.title||t);
            that.$window=w;
            _rect={width:doc.width(),height:doc.height()};
            }catch(e){};

            if(opt.wait){
            	that.setBodySize(_rect);
            }
            that.trigger("ready",[that.$window]);

        }
    });
    var _redirect=function(){
    	setTimeout(function(){
		    if(that._url!=url)that.$iframe.attr("src",url);
		    that._url=url;
    	},100);
    }
    if(opt.wait){
    	_redirect();
    }
    else{
	    that.setBodySize({},function(){
	    	_redirect();
	    });//尝试获取
    }
}
__dialog.prototype.loadObject=function(key){
	if(!key)return;
	var $o=typeof key=="object"?key:$(key);
	this.loadHtml($o);
	this.setBodySize({width:$o.width(),height:$o.height()});
}
__dialog.prototype.loadContent=function(html){
  this.loadHtml(html);
  var $o=this.$dbody.children().eq(0);
  this.setBodySize({width:$o.width()||0,height:$o.height()||0});
}

__dialog.prototype.loadHtml=function(html){
  var that=this,opt=this.options;
  if(!this.$dbody)return;
  this.$dbody.empty().append(html||"");
  this.resize();
};
__dialog.prototype.getBody=function(){
  return this.$dbody;
};
__dialog.prototype.constructor=__dialog;
$.fn.dialog = function (option) {
	return this.__init(dialog,option);
};
$.fn.dialog.Constructor = __dialog;
dialog.getObject=function(name){
	var $object=dialog._get_object(name);
	return $object&&$object.object;
}

dialog.open=function(options){//content:iframe html url ;name 没有就随机生成一个
	options=options||{};
	var name=options.name=options.name||($J.random(5)+""+new Date().getTime());
	var opt=options;
	if(!(opt._target&&opt._target.get(0))){
		opt._target=$("<div />").append($(options.contentTemp||"<div />")).attr(dialog.defaults.core+"-name",name);
		$(document.body).append(opt._target);
	}
	var $o=opt._target.dialog(opt).data(dialog.defaults.core);
	$o.toggle("open");
	return $o;
};
dialog._get_object=function(name){
	if(name&&typeof name=="object"){
		name=$(name).parents("["+dialog.defaults.core+"-name"+"]").eq(0).attr(dialog.defaults.core+"-name");
		if(!name)return null;
	}
	var _list=$(document).data(dialog.defaults.core+"-list");
	if(!name){
		for(var k in _list){name=k;if(name)break;}
	}
	return _list[name];
}
dialog.close=function(name){
	var _l=dialog._get_object(name);
	_l&&_l.object&&_l.object.close();//内部会取消注册
	delete _l;
}
dialog.restore=function(name){
	var _l=dialog._get_object(name);
	_l.object&&_l.object.restore();
	delete _l;
}
$J.fn.dialog=dialog;



};

if(jQuery){
  __f(window[J_NAME]);
}
else{
  J.require("jquery");
  J.define(__f);
};