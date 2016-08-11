var __func=function () {
	$.fn.__init__image=function($object,option,cmd,params){
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
	var image={};
	image.defaults = {core:"data-plug-image"
	,width:0,height:0,minWidth:1000000,minHeight:1000000,cliptype:null,link:false,compress:true,stretch:false
	,trigger:{loaded:null}
	}; 
	function __image(element,options){
		__image.base.constructor.call(this);
		var opt=this.options=options;
		this.$elem = $(element);
		var _is_image=this.$elem.is('img');
		this.$image=_is_image?this.$elem:$("<img border='0'></img>").appendTo(this.$elem.empty());
		this.link=opt.link||this.$elem.data("link");
		if(this.link) {
			this.$image.wrap("<a href='javascript:void(0);' target='"+(this.$elem.attr("target")||"_blank")+"'></a>");
			this.$a=this.$image.parent();
		}
		this._slope=null;
		if(opt.cliptype){
			opt.width=opt.width||this.$elem.width();
			opt.height=opt.height||this.$elem.height();
			if(_is_image){
				this.$body=$("<div style='display:block;overflow:hidden;'/>").css({width:opt.width,height:opt.height});
				if(this.$a){
					this.$a.wrap(this.$body);
					this.$body=this.$a.parent();
				}
				else {
					this.$elem.wrap(this.$body);
					this.$body=this.$elem.parent();
				}
			}
			else{
				this.$body=this.$elem.css({"display":"block","overflow":"hidden"});
			}
			if(!(opt.width||opt.height))return;
			if(!(opt.minWidth<=opt.width))opt.minWidth=opt.width;
			if(!(opt.minHeight<=opt.height))opt.minHeight=opt.height;
			if(!opt.slope)this._slope={k1:opt.minWidth/opt.height,k2:opt.width/opt.height,k3:opt.width/opt.minHeight};
			else this._slope=opt.slope;
			//this.$body.css();
		}

		//this._write_css(this._plugid,"#"+this._plugid+" td{display:none;}");
	}
	__image.prototype.show=function(){
		var that=this,opt=this.options;
		var src=opt.src||this.$elem.attr("src")||this.$elem.attr("lazy-src");
		if(src!=this._src){
			this.$elem.data("loaded",false);
			this._src=src;
			if(this.link)this.$a.attr("href",(this.link===true?this._src:this.link));
		}
		if(this.$elem.data("loaded"))return;
		this.loaded(this._src,function(r){
			if(!r.flag){
				that.trigger("loaded",[r.flag,{}]);
				return;
			}
			that.$elem.data("loaded",true);
			that._set_size(r.width,r.height);
		});
	}
	__image.prototype._set_size=function(width,height){
		var opt=this.options;
		var rect=this._get_rect(width,height);
		var css={width:rect.width,height:rect.height,marginLeft:rect.left,marginTop:rect.top};
		this.$image.css(css).attr("src",this._src);
		if(opt.cliptype){
			this.$body.width(rect.bodyWidth).height(rect.bodyHeight);
		}
		rect.path=this._src;
		this.trigger("loaded",[true,rect]);
		this._dispose();//自动销毁
	}
	__image.prototype._get_rect=function(width,height){
		var that=this,opt=this.options;
		if(opt.cliptype&&this._slope){//切割模式
			//记录切割样式
			var rect={width:width,height:height,left:0,top:0,imageWidth:width,imageHeight:height};
			var k=width/height;
			var worh=true;//true 宽度为基准
			if(k<this._slope.k1&&opt.cliptype=="filler")worh=false;
			else if(k<this._slope.k1)worh=true;

			else if(k<this._slope.k2&&opt.cliptype=="cut")worh=true;
			else if(k<this._slope.k2)worh=false;

			else if(k<this._slope.k3&&opt.cliptype=="cut")worh=false;
			else if(k<this._slope.k3)worh=true;
			else if(opt.cliptype=="filler")worh=true;
			else worh=false;

			if(worh){
				if(width>opt.width&&opt.compress){
					rect.width=opt.width;
					rect.height=rect.width/k;
				}
				else if(width<opt.minWidth&&opt.stretch){
					rect.width=opt.minWidth;
					rect.height=rect.width/k;
				}
			}
			else{
				if(height>opt.height&&opt.compress){
					rect.height=opt.height;
					rect.width=rect.height*k;
				}
				else if(height<opt.minHeight&&opt.stretch){
					rect.height=opt.minHeight;
					rect.width=rect.height*k;
				}
			}

			rect.scale=rect.width/width;//压缩比

			//stretch  是否拉伸 compress 是否压缩

			rect.bodyWidth=rect.width;
			if(rect.width<opt.minWidth){rect.left=opt.minWidth-rect.width;rect.bodyWidth=opt.minWidth;}
			else if(rect.width>opt.width){rect.left=opt.width-rect.width;rect.bodyWidth=opt.width;}
			rect.left/=2;


			rect.bodyHeight=rect.height;
			if(rect.height<opt.minHeight){rect.top=opt.minHeight-rect.height;rect.bodyHeight=opt.minHeight;}
			else if(rect.height>opt.height){rect.top=opt.height-rect.height;rect.bodyHeight=opt.height;}

			rect.top/=2;
			return rect;
		}
		return {width:width,height:height,left:0,top:0,bodyWidth:width,bodyHeight:height,scale:1,imageWidth:width,imageHeight:height};
	}
	__image.prototype._dispose=function(){
		this.$elem.data(this.options.core,null);
	}

	__image.prototype.loaded=function(src,fn){
		var that=this,opt=this.options;
		//this._errors++;
		//if(this._errors>opt.errors)return fn&&fn(null,{width:0,height:0,flag:false});
		var _img=new Image();
		_img.onload = _img.onreadystatechange=function(){
		    if (_img && _img.readyState && _img.readyState != 'loaded' && _img.readyState != 'complete') return fn&&fn({width:0,height:0,flag:false});
		    _img.onload = _img.onreadystatechange = _img.onerror = null;
		    return fn&&fn({width:_img.width,height:_img.height,flag:true});
		}
		_img.src=src;
	}
	//$.fn.gridview = function (option,cmd,params) {
	//  return this.__init(gridview,option,cmd,params);
	//};
	//$.fn.gridview.Constructor = __gridview;
	image.constructor=__image;
	$J.__extend($J.fn.core,image);
	J.fn.image=image;

	$.fn.image=function(option,cmd,params){
		this.__init__image(image,option,cmd,params);
	}
	$.fn.jimage=function(option){
		//var $o=this.__init(image,option,cmd,params);
	}
	var lazyimages={};
	lazyimages.defaults = {core:"data-plug-lazyimages",errors:3
	,trigger:{max:null}
	}; 
	function __lazyimages(element,options){
		__lazyimages.base.constructor.call(this);
		this.options=options;
		this.$elem = $(element);
		this.list=[];
		this._list=[];
		this._index=0;
		this.event();

		var list=$(window).data("data-lazyimages-list")||[];
		list.push(this);
		$(window).data("data-lazyimages-list",list);

	}
	__lazyimages.prototype.init=function(){
		
		var that=this;
		this.list.length=0;
		this.add($("[data-plug='image'],[lazy-src][lazy-src!='']",this.$elem));
		setTimeout(function(){
			that.start();
		},100);
	}
	__lazyimages.prototype.add=function(jimages){
		if(!jimages)return;
		var that=this,opt=this.options;
		var oimages=$.map(jimages,function(o){
			var img=$(o);
			var src=img.attr("src")||img.attr("lazy-src");if(!src)return null;
			var d={target:img,src:src,errors:0,check:false,width:(img.attr("data-width")*1||img.width()),height:(img.attr("data-height")*1||img.height())};
			img.attr("lazy-src","").attr("src","").data(opt.core,d);
			return d;
		});
		this.list=this.list.concat(oimages);
	}

	__lazyimages.prototype.getContainerOffsetRect=function(){
		//var b=$(document.body);
	    var b=$(document);
	    var t=b.scrollTop(),l=b.scrollLeft();
	    return {top:t,left:l,right:(l+$(window).width()),bottom:(t+$(window).height())};
	};

	__lazyimages.prototype.load=function(){
	    var that=this,opt=this.option;
	    if(that.timer)clearTimeout(that.timer);
	    that.timer=setTimeout(function(){
	    	that.start();
	    },20);//延迟触发事件
	};

	__lazyimages.prototype._get_img_rect=function(img){
		var off=img.offset();
		return {left:off.left,top:off.top,right:(off.left+img.width()),bottom:(off.top+img.height())}
	};
	__lazyimages.prototype._check=function(pos,posc){
	    if((pos.top>posc.top&&pos.top<posc.bottom)||(pos.bottom>posc.top&&pos.bottom<posc.bottom)){
	        return true;
	    }
	    return false;
	};
	__lazyimages.prototype.start=function(){
		if(this.list.length<1)return;
		var opt=this.options;
	    var off=this.getContainerOffsetRect();//获取容器可见范围
	    for (var i = this.list.length-1; i>-1; i--) {
	    	var data=this.list[i];
	    	var img=data.target;
	    	if(!data.rect)data.rect=this._get_img_rect(img);
	    	data.check=data.check||this._check(data.rect,off);
	    	if(data.check){
	    		this.list.splice(i,1);
	    		this._list.push(data);
	    	}
	    };
	    this.loadstart();
	};
	__lazyimages.prototype.loadstart=function(){//开始加载内容
	    var that=this,opt=this.options;
	    if(this.loading)return;//正在加载 则直接结束
	    this.loading=true;
	    if(this._list.length<1){
	    	that.loadend();
	        return;
	    }
	    if(opt.loadState=="queue")//如果是队列
	    {
	        that.loadqueue(function(){
	            that.loadend();
	        });
	    }
	    else{
	        for(var i=0,l=this._list.length;i<l;i++)
	            this.loaded(this._list[i]);
	        this._list=[];
	        this.loadend();
	    }
	}
	__lazyimages.prototype.loadqueue=function(fn){
	    var that=this,opt=this.option;
	    if(this._list.length<1)return fn&&fn();
	    var data=this._list.pop();if(!data)return;
	    this.loaded(data,function(elem,flag){
	        //if(flag==false&&elem)that._list.push(elem);
	        that.loadqueue(fn);
	    });
	};
	__lazyimages.prototype.loadend=function(){
		this.loading=false;
		this.event();
	}

	__lazyimages.prototype._dispose=function(){//释放资源

	};
	__lazyimages.prototype.loaded=function(data,fn){
		if(data.errors>3)return;
		var that=this;
		data.target.image({
			src:data.src,
			cliptype:"cut",
			width:data.width,
			height:data.height,
			trigger:{loaded:function(f){
				if(!f){
					data.errors++;
					that._list.push(data);
				}
				//else this._dispose();
				fn&&fn(f);
			}
			}
		},"show");
	}

	__lazyimages.prototype.event=function(jimages){
		var that=this,opt=this.options;
		$(window).off("."+opt.core);
		if(this.list.length<1)return;
		$(window).on("scroll."+this.core,function(){
			var list=$(this).data("data-lazyimages-list")||[];
			for(var i=0,l=list.length;i<l;i++)
				list[i].load();
		});
	}

	lazyimages.constructor=__lazyimages;
	$J.__extend($J.fn.core,lazyimages);
	J.fn.lazyimages=lazyimages;

	$.fn.lazyimages=function(option,cmd,params){
		if(typeof option=="object")cmd=cmd||"init";
		this.__init__image(lazyimages,option,cmd,params);
	}
};
if(!window["jQuery"]){
	J.require("jquery");
	J.define(__func);
}
else __func();