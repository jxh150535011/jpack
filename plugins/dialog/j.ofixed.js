    var core={},__func={};
    Function.prototype.extend=function(parent, overrides){
        if (typeof parent != 'function') return this;//保存对父类的引用
        this.base = parent.prototype;
        this.base.constructor = parent;//继承
        var f = function () { };
        f.prototype = parent.prototype;
        this.prototype = new f();
        this.prototype.constructor = this;//附加属性方法
        if (overrides) $.extend(this.prototype, overrides);
    };
    __func.__extend=function (parent,child){
        var cf=child.constructor;
        cf.extend(parent.constructor,{});
        child.defaults=this.extend(parent.defaults,child.defaults);
    };
    function __core(){
        this._plugid=this.options.core+Math.round(Math.random()*100000);
    }
    __core.prototype.trigger=function(name,argv){
        var opt=this.options;
        //arguments
        return opt.trigger&&opt.trigger[name]&&opt.trigger[name].apply(this,argv||[]);
    }
    __core.prototype.options=core.__defaults = {core:"data-plug-core"};
    core.constructor=__core;
    __func.extend=function (parent, overrides){
        if(!overrides)return parent;
        parent=parent||{};
        for (var k in overrides) {
            parent[k]=overrides[k];
        }
        return parent;
    };
var __f=function(){
$.fn.__init=function($object,option){
	var _defaults=$object.defaults;
	return this.each(function () {
	var $this = $(this), data = $this.data(_defaults.core), options;
	if(typeof option == 'object'){
		options= $.extend({}, data?data.options:_defaults, option);
		if(data)data.options=options;
	}
	if (!data) $this.data(_defaults.core, (data = new $object.constructor(this, options)));
	if(typeof option =='string')data[option]();
	});
}
var fixed={};
fixed.defaults = {core:"data-plug-fixed",backdrop: false,backdropTemp:"",move:false,animate:true,left: "auto",top: 

"auto",width:"auto",height:"auto",zindex:10000,left:0,top:0
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
    this._rect={left:this.options.left,top:this.options.top,width:this.options.width,height:this.options.height};
};
fixed.constructor=__fixed;
__func.__extend(core,fixed);//继承父类方法

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
	var fwidth=crect.width,fheight=crect.height;
	for (var k in _vs) {
		if(k!="width"&&k!="height")continue;
		var auto=(k=="width")?(this.$body.width()||this.$elem.width()):(this.$body.height()||this.$elem.height());
		crect["_"+k]=(typeof _vs[k]=="string"?eval(_vs[k]):_vs[k]);
		delete _vs[k];
	}
	var width=crect.width=crect["_width"]||this._rect.width,height=crect.height=crect["_height"]||this._rect.height;
	var left=0,right=fwidth-width,xcenter=right/2;
	var top=0,bottom=fheight-height,ycenter=bottom/2;
	for (var k in _vs) {
		var center=xcenter,auto=left;
		if(k=="top"){center=ycenter;auto=right;}
		crect[k]=(typeof _vs[k]=="string"?eval(_vs[k]):_vs[k]);
	}
	crect.fwidth=fwidth;crect.fheight=fheight;
	return crect;
};
__fixed.prototype.resize=function(_rect,animate,fn){
	var that = this,opt=this.options;
	if(!this._isshow)return;
	_rect=_rect||this._rect;
	var rect=this._get_rect(_rect);
    if(this.$backdrop)this.$backdrop.width(rect.fwidth).height(rect.fheight);
    this.fixedTo(rect,animate,fn);
    return _rect;
};
__fixed.prototype.remove=function(){
	this.trigger("berforeclose");
	this.$body.remove();
	this.$backdrop&&this.$backdrop.remove();
	this._isshow=false;
	this.trigger("close");
	delete this;
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
	var doc=this.$parent;
	return  {left:doc.scrollLeft(),top:doc.scrollTop()};
};
__fixed.prototype._get_client_rect=function(){
	if(this.options.parent!=window){
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
		var wh=that.$parent.data("wh"+that._plugid),w=that.$parent.width(),h=that.$parent.height();
		if((!wh)||wh.width!=w||wh.height!=h){
		wh={width:w,height:h};
		that.$parent.data("wh"+that._plugid);
		if(fn)fn.call(that);
		}
		that.resizeStart(fn);
	},40);
};
__fixed.prototype.fixedTo=function(_rect,animate,fn){
	_rect=$.extend({},this._rect,_rect);
	var s={left:0,top:0};
	if(this.$body.css("position")=="absolute")s=this._get_scroll_pos();
	if(_rect==this._rect)return;
	this._rect=_rect;
	_rect.left+=s.left;_rect.top+=s.top;
	if(animate)this.$body.stop().animate(_rect,500,fn);
	else {this.$body.css(_rect);fn&&fn()};
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
		that.resize(null,true);
		that._move_config=null;
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
			that.resize();
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
__f();