

var __f=function($J){
!function ($) {
	  "use strict";
          "滚动显示方法"; 
	  var Marquee = function (content, options) {
	    this.options = options;
	    this.$element = $(content);
        this.elementid=this.options.CODENAME+new Date().getTime();
	  }
	  Marquee.prototype = {
	    constructor: Marquee
	  }
	  Marquee.prototype.init=function(){
            var that=this,opt=this.options;
            if(this.$element.children().length<2)return;
            this.$element.append(this.$element.html());
            that.event();
	  }
	  Marquee.prototype.run=function(){
		  var that=this,opt=this.options;
		  var _run=function(){
	      		if(that.top+that.height<=that.height/2){
	      			that.top=0;
	      			that.c.css({"marginTop":that.top+"px"});
	      		}
	      		that.top-=that.step;
	      		that.c.animate({"marginTop":that.top+"px"},1200,function(){
	      			if(that.timer)clearTimeout(that.timer);
	      			if(that.isrun)that.timer=setTimeout(function(){_run();},1500);
	      		});
	      };
	      _run();
	 }
	  Marquee.prototype.start=function(){
		  var that=this;
		 this.stop();
		 if(!this.c)this.c= this.$element.children().eq(0);
		 if(!this.step)this.step= this.c.height();
		 if(!this.top)this.top=0;
		 this.height= this.$element.height();
		 this.isrun=true;
		 this.run();
	  }
	  Marquee.prototype.stop=function(){
		  if(this.timer)clearTimeout(this.timer);
		  this.isrun=false;
	  }
	  Marquee.prototype.event=function(){
          var that=this,opt=this.options;
      	this.$element.mouseenter(function(){
      		that.stop();
      	}).mouseleave(function(){
      		that.start();
      	});
      	that.start();
	  }
	  $.fn.marquee = function (option) {
            var opt=$.fn.marquee.defaults;
	    return this.each(function () {
	      var $this = $(this), data = $this.data(opt.CODENAME);
	      var options= $.extend({}, data?data.options:opt, typeof option == 'object' && option)
	      if (!data) $this.data(opt.CODENAME, (data = new Marquee(this, options)));
	      else data.options=options;
	      if(typeof option=="string")data[option]();
	      else data.init();
	    });
	  }
	  $.fn.marquee.defaults = {
	      CODENAME:"marquee"
	  }
}(window.jQuery);




!function ($) {
	  "use strict";
          "下拉绑定通用方法"; 
	  var DropDownList = function (content, options) {
	    this.options = options;
	    this.$element = $(content);
            this.elementid=this.options.CODENAME+new Date().getTime();
	  }
	  DropDownList.prototype = {
	    constructor: DropDownList
	  }
	  DropDownList.prototype.open=function(){
		  var that=this,opt=this.options;
		  that.$element.triggerHandler("switch."+opt.CODENAME,["open"]);
	  }
	  DropDownList.prototype.shut=function(){
		  var that=this,opt=this.options;
		  that.$element.triggerHandler("switch."+opt.CODENAME,["shut"]);
	  }
	  DropDownList.prototype.init=function(){
            var that=this,opt=this.options;
            that.content=this.$element;
            that.head=that.$element.find("["+opt.CODENAME+"='"+opt.headName+"']");
            that.body=that.$element.find("["+opt.CODENAME+"='"+opt.bodyName+"']");
            that.item=that.$element.find("["+opt.CODENAME+"='"+opt.itemName+"']");
            that.event();
	  }
          //可以优化提供外部 隐藏ui的方法 不需要让用户调用
          //that.$element.triggerHandler 提高耦合度
          DropDownList.prototype.event=function(){
            var that=this,opt=this.options;
            var $body=that.body,$head=that.head;
            
            if(opt.type=="hover"){
                    that.$element.off("."+opt.CODENAME).on("switch."+opt.CODENAME,function(event,key){//列表隐藏显示
                    if(that.timer)clearTimeout(that.timer);
                    if($body.is(":animated")||((opt.key!="shut")^(key=="shut")))return opt.func&&opt.func.call(that,key,false);//异或 为true为执行
                    if(key=="open"){opt.key=key;opt.func&&opt.func.call(that,key,true);}
                    else{
                            that.timer=setTimeout(function(){
                                    opt.key=key;
                                    return opt.func&&opt.func.call(that,key,true);
                            },100);
                    }
                    });
                    that.item.off("."+opt.CODENAME).on("click."+opt.CODENAME,function(){
                        opt.clickfunc&&opt.clickfunc.call(that,$(this));return false;
                    });
                    $body.add($head).mouseenter(function(){
                            that.$element.triggerHandler("switch."+opt.CODENAME,["open"]);
                    }).mouseleave(function(){
                            that.$element.triggerHandler("switch."+opt.CODENAME,["shut"]);
                    });
            }
            else{
                    var _bindDoc=function(){
                              $(document).off("click."+that.elementid).on("click."+that.elementid,function(){
                                        $(document).off("click."+that.elementid);
                                        opt.key="shut";
                                        opt.func&&opt.func.call(that,opt.key,true);
                              });
                    }
                    _bindDoc();
                    that.item.off("."+opt.CODENAME).on("click."+opt.CODENAME,function(){
                              opt.clickfunc&&opt.clickfunc.call(that,$(this));
                    });
                    that.head.off("."+that.CODENAME).on("click."+that.CODENAME,function(){
                              var isn=$body.is(":animated")||(opt.key=="open");
                              opt.key="open";
                              opt.func&&opt.func.call(that,opt.key,!isn);
                              _bindDoc();
                              return false;
                    });
            }
            
	  }
	  $.fn.dropdownlist = function (option) {
            var opt=$.fn.dropdownlist.defaults;
	    return this.each(function () {
	      var $this = $(this), data = $this.data(opt.CODENAME);
	      var options= $.extend({}, data?data.options:opt, typeof option == 'object' && option)
	      if (!data) $this.data(opt.CODENAME, (data = new DropDownList(this, options)));
	      else data.options=options;
	      if(typeof option=="string")data[option]();
	      else data.init();
	    });
	  }
	  $.fn.dropdownlist.defaults = {
	      CODENAME:"data-plug-ddl",
              headName:"head",
              bodyName:"body",
              itemName:"item",
              type:"hover",
              key:"shut",
              clickfunc:null,
              func:null
	  }
	  $.fn.dropdownlist.Constructor = DropDownList
}(window.jQuery);


!function ($) {
"use strict"; 
var imageClip = function (content, options) {
  this.options = options
  this.$element = $(content);
  this.$content=$("<div style='display:block;margin-left: 0;margin-bottom: 0; margin-right: 0; margin-top: 0;padding-left: 0; padding-bottom: 0; padding-right: 0; padding-top: 0;overflow:hidden;'></div>");
  this.$element.append(this.$content);
}
imageClip.prototype = {
    constructor: imageClip
}
imageClip.prototype.init=function(){
  var that=this,opt=this.options;
  this.maxSize=opt.maxSize,this.minSize=opt.minSize||{},this.wh_slope={k1:1,k2:1,k3:1};//宽高比
  
  if(!(this.maxSize.width||this.maxSize.height))return;
  if(!(this.minSize.width<=this.maxSize.width))this.minSize.width=this.maxSize.width;
  if(!(this.minSize.height<=this.maxSize.height))this.minSize.height=this.maxSize.height;
  this.wh_slope.k1=this.minSize.width/this.maxSize.height;
  this.wh_slope.k2=this.maxSize.width/this.maxSize.height;
  this.wh_slope.k3=this.maxSize.width/this.minSize.height;
}
imageClip.prototype.loaded=function(){
  var that=this,opt=this.options;
  var rect=that.getrect(that.size);
  var img=$("<img />");
  var wrap=$(opt.wrap||"<span></span>");
  this.$content.empty().attr({width:rect.outwidth,height:rect.outheight}).append(wrap);
  wrap.append(img);
  img.css({marginLeft:rect.left,marginTop:rect.top}).attr({width:rect.width,height:rect.height,src:that.src});
};
imageClip.prototype.getrect=function(size){
  var that=this,opt=this.options;
  var rect={width:size.width,height:size.height,left:0,top:0};
  var k=size.width/size.height;
  var min=that.minSize;var max=that.maxSize;
  var worh=true;
  if(k<that.wh_slope.k1&&opt.cliptype=="filler")worh=false;
  else if(k<that.wh_slope.k1)worh=true;
  
  else if(k<that.wh_slope.k2&&opt.cliptype=="cut")worh=true;
  else if(k<that.wh_slope.k2)worh=false;
  
  else if(k<that.wh_slope.k3&&opt.cliptype=="cut")worh=false;
  else if(k<that.wh_slope.k3)worh=true;
  else if(opt.cliptype=="filler")worh=true;
  else worh=false;
  
  
  if(worh&&size.width>max.width){
      rect.width=max.width;
      rect.height=rect.width/k;
  }
  else if(worh==false&&size.height>max.height){
      rect.height=max.height;
      rect.width=rect.height*k;
  }
  
  rect.outwidth=rect.width;
  if(rect.width<min.width){rect.left=min.width-rect.width;rect.outwidth=min.width;}
  else if(rect.width>max.width){rect.left=max.width-rect.width;rect.outwidth=max.width;}
  rect.left/=2;
  rect.outheight=rect.height;
  if(rect.height<min.height){rect.top=min.height-rect.height;rect.outheight=min.height}
  else if(rect.height>max.height){rect.top=max.height-rect.height;rect.outheight=max.height}
  rect.top/=2;
  return rect;
};
imageClip.prototype.load=function(){
  var that=this,opt=this.options;
  this.$content.css(that.maxSize);
  if(opt.src==that.src)that.loaded();
  else{
      that.imgloading(opt.src,function(size,flag){
          if(!flag)return;
          that.size=size;
          that.src=opt.src;
          that.loaded();
      });
  }
}
imageClip.prototype.imgloading=function(src,fn){
  var img=new Image();var size={width:0,height:0}
  img.onload = img.onreadystatechange=function(){
      if (img && img.readyState && img.readyState != 'loaded' && img.readyState != 'complete') return fn&&fn(size,false);
      img.onload = img.onreadystatechange = img.onerror = null;
      size={width:img.width,height:img.height};
      return fn&&fn(size,true);
  }
  img.onerror=function(){
      img.onload = img.onreadystatechange = img.onerror = null;
      return fn&&fn(size,false);
  };
 img.src=src;
}

$.fn.imageclip = function (option,cmd) {
  return this.each(function () {
    var $this = $(this), data = $this.data('imageclip');
    var options= $.extend({}, data?data.options:$.fn.imageclip.defaults, typeof option == 'object' && option)
    if (!data) $this.data('imageclip', (data = new imageClip(this, options)));
    else data.options=options;
    if(typeof option=="string")cmd=option;
    data.init();
    if(cmd)data[cmd]();
  });
}
$.fn.imageclip.defaults = {
    src:0,maxSize:{},minSize:{},cliptype:"auto"
}
$.fn.imageclip.Constructor = imageClip;
}(window.jQuery);





/**
update 2013-05-21 
**/
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
  /*that.$item.off("."+opt.core).on("click."+opt.core,function(){
    return that.trigger("bodyClick",[]);
  });*/

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
ddl.getObject=function(content,options){//获取绝对定位对象
  return $(content).ddl(options).data(ddl.defaults.core);
}
$J.fn.ddl=ddl;

var img={};//定义基本容器
img.defaults = {core:"data-plug-img",head:"head",body:"body",item:"item",type:"hover",key:"shut"
,trigger:{ready:null,change:null,hover:null,click:null}
}
function __img(element,options){
  __img.base.constructor.call(this);
  this.options=options;
  this.$elem = $(element);
  this.init();
}
img.constructor=__img;
$J.__extend($J.fn.core,img);
__img.prototype.loaded=function(src,fn){
  var _img=new Image();var size={width:0,height:0}
  _img.onload = _img.onreadystatechange=function(){
      if (_img && _img.readyState && _img.readyState != 'loaded' && _img.readyState != 'complete') return fn&&fn(size,false);
      _img.onload = _img.onreadystatechange = _img.onerror = null;
      size={width:_img.width,height:_img.height};
      return fn&&fn(size,true);
  };
  _img.onerror=function(){
      _img.onload = _img.onreadystatechange = _img.onerror = null;
      return fn&&fn(size,false);
  };
  _img.src=src;
}

$.fn.img = function (option) {
  return this.__init(img,option);
};
$.fn.img.Constructor = __img;


img.getObject=function(content,options){//获取绝对定位对象
  return $(content).img(options).data(img.defaults.core);
}
$J.fn.img=img;


var lazy={};//定义基本容器
lazy.defaults = {core:"data-plug-lazy",head:"head",body:"body",item:"item",type:"hover",key:"shut"
,trigger:{ready:null,change:null,hover:null,click:null}
}
function __lazy(element,options){
  __lazy.base.constructor.call(this);
  this.options=options;
  this.$elem = $(element);
  this.init();
}
lazy.constructor=__lazy;
$J.__extend($J.fn.core,lazy);

$.fn.lazy = function (option) {
  return this.__init(lazy,option);
};
$.fn.lazy.Constructor = __lazy;
$J.fn.lazy=lazy;






};
J.require("jquery");
J.define(__f);