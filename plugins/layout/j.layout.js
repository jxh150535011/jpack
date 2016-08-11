/* =========================================================
 *Write：金兴亨 Q150535011
 *Date: 2013-01-29
 *文档内容操作类
 *设置一个doc文档。其本身以及内部长宽是可以改变以及自适应的
 *只所以在文档内部增加容器layout选项
 *，其目的1为了减少复杂度，其目的2增加可靠性,方便自定义
 *结构按照table结构 不越级嵌套
 *对于最后一级column子集，再次支持data-width,data-height 属性
 *使用请转自出处
 * ========================================================= */
!function ($) {
	"use strict";
	"doc"; 
	var Layout = function (content, options) {
		this.options = options;
		this.$element = $(content);
		this.elementid=this.options.CODENAME+new Date().getTime();
		this.$parent=$(options.parent||window);

	}
	Layout.prototype = {
		constructor: Layout
	}
	Layout.prototype.init=function(){
		var that=this,opt=this.options;
		this.$element.wrap("<div style='position:relative;display:block;'></div>");
		that.$body=this.$element.parent();
		that.bars=$();//merge函数很方便
		this.childList({obj:this.$element},function(data){
			var t=data.obj.attr(opt.CODENAME),isbar=data.obj.attr(opt.attrBarName)?true:false;
			if(t==opt.columnName){//列名
				data.obj.css({"margin-left":"0px","margin-bottom":"0px","margin-right":"0px","margin-top":"0px","display":"block","float":"left"});
				if(isbar)that.bars=$.merge(that.bars,data.obj.css({"cursor":"e-resize"}));
			}
			else if(t==opt.rowName){
				data.obj.css({"margin-left":"0px","margin-bottom":"0px","margin-right":"0px","margin-top":"0px","display":"block"});
				if(isbar)that.bars=$.merge(that.bars,data.obj.css({"cursor":"n-resize"}));
			}
			return {};
		});
		//if(!this.$element.attr(opt.attrWidthName))this.$element.attr(opt.attrWidthName,"width");
		//if(!this.$element.attr(opt.attrHeightName))this.$element.attr(opt.attrHeightName,"height");

		
		//if(opt.parent)this.$parent.css({"position":"relative"});
		that.event();
		if(opt.ready)opt.ready.call(this);
		this.$body.css({"overflow":"hidden"});//,width:this.$parent.width(),height:this.$parent.height()
		
	}
    Layout.prototype.dragend=function(){
        var that=this,opt=this.options;
		if(this.sbar){//结束处理
			this.sbar=null;
			$(document).off('.'+opt.CODENAME);
			if(that.div)that.div.remove();
			if(that.dragDiv)that.dragDiv.remove();
			var sizewh=this.sizewh;
			if(!sizewh)return;
			
			var w=sizewh.width2||sizewh.width1;
			var h=sizewh.height2||sizewh.height1;
			var rw=false,rh=false;
			//暂且只是把其值修改 不影响其配置值 当整体发生变动 则 需要重新进行计算
			if(this.xoy){
				rh=true;
				//注意及时情况 避免各种乱七八糟情况
				if(this.prev&&this.prev.get(0))this.prev.height(h);//.data("p_layout_h",-1).data("layout_h",-1);
				if(this.next&&this.next.get(0))this.next.height(sizewh.height-h);//.data("p_layout_h",-1).data("layout_h",-1);
			}
			else {
				rw=true;
				if(this.prev&&this.prev.get(0))this.prev.width(w);//.data("p_layout_w",-1).data("layout_w",-1);
				if(this.next&&this.next.get(0))this.next.width(sizewh.width-w);//.data("p_layout_w",-1).data("layout_w",-1);
			}
			this.sizewh=null;
			if(this.prev&&this.prev.get(0))this._resize(this.prev,rw,rh);
			if(this.next&&this.next.get(0))this._resize(this.next,rw,rh);
			
			//alert(this.next.width());
		}
    };
    Layout.prototype.draging=function(e){
        var that=this,opt=this.options; e && e.preventDefault();
		if(!that.sbar)return false;
		var posxy=this.posxy;
		var offxy=this.offxy;
		var sizewh=this.sizewh;
        var _x=e.pageX-posxy.x,_y=e.pageY-posxy.y;
        var l=_x+offxy.left,t=_y+offxy.top;
		if(this.xoy){
			t=Math.max(Math.min(t,sizewh.bottom),0,sizewh.top);
			sizewh.height2=t-offxy.top+sizewh.height1;
			this.div.css({top:t});
		}
		else {
			l=Math.max(Math.min(l,sizewh.right),0,sizewh.left);
			sizewh.width2=l-offxy.left+sizewh.width1;
			this.div.css({left:l});
		}

    };
    Layout.prototype.dragstart=function(obj,e){
		var that=this,opt=this.options; e && e.preventDefault();
		this.dragend();
		that.sbar=obj;
		var posxy={},offxy=obj.position();
		posxy.x=e.pageX;posxy.y=e.pageY;
		that.offxy=offxy;
		that.posxy=posxy;
		
		that.xoy=obj.attr(opt.CODENAME)==opt.columnName?0:1;//0表示x轴运行 1表示y轴运行
		that.prev=obj.prev("["+opt.CODENAME+"='"+(that.xoy?opt.rowName:opt.columnName)+"']:not(["+opt.attrBarName+"='1'])");
		that.next=obj.next("["+opt.CODENAME+"='"+(that.xoy?opt.rowName:opt.columnName)+"']:not(["+opt.attrBarName+"='1'])");
		that.sizewh=that.getRect(that.prev,that.next,obj);
		
		//if(that.$element.css("position")=="absolute")//IE6 采用绝对定位 不需要读取滚动条偏移量
		//pos=that.getScrollPos();

		if(this.div)this.div.remove();
		this.div=$("<div />").css({ "background-color": "gray",  opacity:0.2,"position": "absolute"
		,"display":"block",width:obj.width(),height:obj.height(),left:offxy.left,"z-index":9998,"top":offxy.top}).appendTo(this.$body);
		
		if(this.dragDiv)this.dragDiv.remove();
		this.dragDiv=$("<div />").css({ "background-color": "green",  opacity:0.2,"position": "absolute"
		,"display":"block",width:this.$parent.width(),height:this.$parent.height(),left:0,"z-index":9999,"top":0}).appendTo(this.$body).html(opt.dragHtml);

    };
	Layout.prototype.getRect=function(prev,next,obj){//计算出当中的bar可移动范围
		var that=this,opt=this.options;
		var width=obj.width(),height=obj.height();
		var p=obj.parent();
		var sizewh=prev&&prev.get(0)&&prev.position()||p.position();
		var left=0,top=0;//求最小上限偏移量
		var right=10000,bottom=10000;//求最多下限偏移量
		sizewh.width=0;sizewh.height=0;
		sizewh.width1=0;sizewh.height1=0;
		if(prev&&prev.get(0)){
			var isv=prev.is(":visible");
			if(isv){
				sizewh.width1=prev.width();
				sizewh.height1=prev.height();
				left=Math.max(that.format(width,height,prev.attr(opt.attrMinWidthName)||0),left);//至少偏移左边距
				top=Math.max(that.format(width,height,prev.attr(opt.attrMinHeightName)||0),top);//至少偏移上边距
				
				right=Math.min(that.format(width,height,prev.attr(opt.attrMaxWidthName)||10000),right);//至多偏移左边距
				bottom=Math.min(that.format(width,height,prev.attr(opt.attrMaxHeightName)||10000),bottom);//至多偏移上边距
			}
			else{
				right=0;
				bottom=0;
			}
		}
		if(next&&next.get(0)){
			var isv=next.is(":visible");
			if(isv){
				sizewh.width=sizewh.width1+next.width();
				sizewh.height=sizewh.height1+next.height();
				left=Math.max(sizewh.width-(that.format(width,height,next.attr(opt.attrMaxWidthName)||10000)),left);//至少偏移左边距
				top=Math.max(sizewh.height-(that.format(width,height,next.attr(opt.attrMaxHeightName)||10000)),top);//至少偏移上边距
				
				right=Math.min(sizewh.width-(that.format(width,height,next.attr(opt.attrMinWidthName)||0)),right);//至多偏移左边距
				bottom=Math.min(sizewh.height-(that.format(width,height,next.attr(opt.attrMinHeightName)||0)),bottom);//至多偏移上边距
			}
			else{
				left=10000;
				top=10000;
			}
		}
		right=Math.min(sizewh.width,right);//至多偏移左边距
		bottom=Math.min(sizewh.height,bottom);//至多偏移上边距
		
		sizewh.right=sizewh.left+right;
		sizewh.bottom=sizewh.top+bottom;
		sizewh.left+=left;
		sizewh.top+=top;
		
		return sizewh;
	}
	
	//可以优化提供外部 隐藏ui的方法 不需要让用户调用
	//that.$element.triggerHandler 提高耦合度
	Layout.prototype.event=function(){
		var that=this,opt=this.options;
		that.bars.off('.'+opt.CODENAME).on("mousedown."+opt.CODENAME,function(e){
			that.dragstart($(this),e);
			$(document).off('.'+opt.CODENAME).on("mousemove."+opt.CODENAME,function(e){
				that.draging(e);
			}).on("mouseup."+opt.CODENAME,function(e){
				that.dragend(e);
			});
		});
        if($.browser.msie){//If IE can bind resize event
			that.$parent.off('.'+opt.CODENAME).on("resize."+opt.CODENAME,function(){
				if(that.resizeTimer)that.timer=clearTimeout(that.resizeTimer);
				that.resizeTimer=setTimeout(function(){
					that.resize();
				},10);
			});
			setTimeout(function(){that.$parent.triggerHandler("resize");},10);
        }
        else
        {
            that.resizeStart(function(){
              that.resize();
            });
        }
		
	};
	Layout.prototype.resizeStart=function(fn){//Automatically determine whether the size change occurs
		var that = this,opt=this.options;
		if(that.resizeTimer)clearTimeout(that.resizeTimer);
		that.resizeTimer=setTimeout(function(){
			var wh=that.$parent.data("wh"),w=that.$parent.width(),h=that.$parent.height();
			if((!wh)||wh.width!=w||wh.height!=h){
			wh={width:w,height:h};
			that.$parent.data("wh",wh);
			if(fn)fn.call(that);
			}
			that.resizeStart(fn);
		},40);
	};
	Layout.prototype.childList=function(data,fn){//遍历 data表示上层返回值
		var that=this,opt=this.options;
		var d=fn&&fn(data);
		if(d===false)return;
		var childs=data.obj.children("["+opt.CODENAME+"='"+opt.rowName+"'],["+opt.CODENAME+"='"+opt.columnName+"'],["+opt.CODENAME+"='"+opt.ceilName+"']");
		if(childs.length<1)return;
		childs.each(function(){
			d.obj=$(this);
			that.childList(d,fn);
		});
	}
	//对于每个节点进行遍历 data 为父级节点
	Layout.prototype.resizec=function(obj,data,fn){//遍历 data表示上层返回值 {width,height,wchange,hchange}
		if(!(data.wchange||data.hchange))return;//父级任意值发生变化 才处理
		var that=this,opt=this.options;
		var childs=obj.children("["+opt.CODENAME+"='"+opt.rowName+"'],["+opt.CODENAME+"='"+opt.columnName+"'],["+opt.CODENAME+"='"+opt.ceilName+"']");
		if(childs.length<1)return;
		var rchilds=[];
		var w=data.width,h=data.height,wc=0,hc=0;
		//if(data.wchange)childs.data({"p_layout_w":-1,"layout_w":-1});
		//if(data.hchange)childs.data({"p_layout_h":-1,"layout_h":-1});
		childs.each(function(){
			var c={rw:data.wchange,rh:data.hchange,obj:$(this)};
			var attrType=$(this).attr(opt.CODENAME);
			var isBar=!!$(this).attr(opt.attrBarName);
			var isRowType=attrType==opt.rowName;
			var isColumnType=attrType==opt.columnName;
			var isautow=false,isautoh=false;
			if(isBar){
				if(!attrWidth)$(this).attr(opt.attrWidthName,(isColumnType)?"5":"width");
				if(!attrHeight)$(this).attr(opt.attrHeightName,(isRowType)?"5":"height");
			}
			else{
				if(data.wchange){//父级宽度改变
					var attrWidth=$(this).attr(opt.attrWidthName);
					if(!attrWidth){//不存在宽度
						if(isRowType)$(this).attr(opt.attrWidthName,"width");
						else{
							wc++;
							isautow=true;
							c.rw=false;
						}
					};
				}
				if(data.hchange){
					var attrHeight=$(this).attr(opt.attrHeightName);
					if(!attrHeight){//不存在高度
						if(isColumnType)$(this).attr(opt.attrHeightName,"height");
						else{
							hc++;
							isautoh=true;
							c.rh=false;
						}
					}
				}
			}
			if(isautow||isautoh){
				rchilds.push(c);
				if(isautow&&isautoh)return true;//都要自适应计算
			}
			var d=fn&&fn(c,data);//对于当前节点进行运算
			//console.log(c.obj.attr("test-id"));
			//console.log(data);
			//console.log(c.obj.attr(opt.attrBarName));
			//console.log(attrType);console.log(attrWidth);console.log(attrHeight);
			//console.log(c);
			//console.log(d);
			//rw rh这里表示 是否可以进行运算 如果高宽都有值 并且高度宽度 其中之1 发生了改变 则对子节点进行运算
			if(!(isautow^isautoh))that.resizec(c.obj,d,fn);//都为true的情况上面已经return 当都为false的时候 意味着可以进入后面运算
			c.dc=d.dc;
			if(c.rw)w-=d.width;//计算剩余宽度
			if(c.rh)h-=d.height;
			
		});
		//console.log(obj.attr("test-id")+"剩余节点平摊开始");

		for(var i=0;i<rchilds.length;i++){//全部减去自身最小值
			var c=rchilds[i];
			c.__test="rw rh已经被取反";//进入到平摊位置 rw rh最终计算一定是false 而并非rw为false 一定会进入到这里
			c.rw=!c.rw;c.rh=!c.rh;
			if(c.rw){
				w-=c.dc.minw;
			}
			if(c.rh){
				h-=c.dc.minh;
			}
			
		}
		var attrWidthName=wc>0?Math.floor(w/wc):0;
		var attrHeightName=hc>0?Math.floor(h/hc):0;
		var lastw=attrWidthName+wc;
		var lasth=attrHeightName+hc;
		
		for(var i=0;i<rchilds.length;i++){
			var c=rchilds[i];
			if(c.rw){
				c.attrWidthName=(w<lastw?w:attrWidthName)+c.dc.minw;
			}
			if(c.rh){
				c.attrHeightName=(h<lasth?h:attrHeightName)+c.dc.minh;
			}
			//if(c.obj.attr("key")=="c3") alert("c3开始");
			var d=fn&&fn(c,data);//返回当前节点信息
			//console.log(c.obj.attr("test-id"));
			//console.log(c);
			//console.log(d);
			if(c.rw)w-=d.width;
			if(c.rh)h-=d.height;
			that.resizec(c.obj,d,fn);//在这里 肯定是高宽都已计算完毕 resizec方法内部已经进行处理d.wchange 是否发生变换
		}
		//console.log("剩余节点平摊结束");
	}
	Layout.prototype.resize=function(root,rw,rh){
		var that=this;
		if(this.resizeInitTimer)clearTimeout(this.resizeInitTimer);
		this.resizeInitTimer=setTimeout(function(){
			that._resize(root,rw,rh);
		},10);
	};
	Layout.prototype._resize=function(root,rw,rh){
		var that=this,opt=this.options,rw=(rw!==false),rh=(rh!==false);
		var pdata={};
		if(!root){//节点不存在默认为父节点
			var width=this.$parent.width(),height=this.$parent.height();
			pdata=that.resizeSet({obj:this.$element,rw:rw,rh:rh},{width:width,height:height});
			if(!(pdata.wchange||pdata.hchange))return;
			opt.resize&&opt.resize.call(that,width,height);
			root=this.$element;
		}
		else pdata={width:root.width(),height:root.height(),wchange:rw,hchange:rh};
		this.resizec(root,pdata,function(cd,pd){//cd 代表子节点信息 pd 代表父节点信息
			return that.resizeSet(cd,pd);
		});
	};

	Layout.prototype.format=function(width,height,str){
			if(typeof str=="number")return str;
			var v=parseFloat(str);if(!isNaN(v))return Math.round(v);
			return eval(str);
	}
	//计算并且返回节点 新的size
	//data 当前节点的信息 rw 是否进行宽度变换 wchange 表示最终宽度是否变换  attrWidthName 表示当前节点要求设置的宽度
	//pdata 父节点 wchange 表示是否宽度发生变化 width 表示父节点宽度
	//返回自身节点信息 wchange 表示宽度是否发生改变
	Layout.prototype.resizeSet=function(data,pdata){
		var that=this,opt=this.options;	
		var obj=data.obj;
		var wh=pdata.wh,width=pdata.width,height=pdata.height;
		var MAX_VALUE=100000;

		//是否进行宽度变换
		var wchange=data.rw&&(!(obj.data("p_layout_w")==width)||pdata.wchange||false);//rw 如果为false 则不进行计算
		var hchange=data.rh&&(!(obj.data("p_layout_h")==height)||pdata.hchange||false);
		var owidth=obj.width(),oheight=obj.height();
		var d_c=obj.data("layout_c")//配置信息
		if(!d_c){
			d_c={};
			d_c.maxw=that.format(width,height,obj.attr(opt.attrMaxWidthName)||MAX_VALUE);
			d_c.minw=that.format(width,height,obj.attr(opt.attrMinWidthName)||0,0);
			d_c.maxh=that.format(width,height,obj.attr(opt.attrMaxHeightName)||MAX_VALUE);
			d_c.minh=that.format(width,height,obj.attr(opt.attrMinHeightName)||0,0);
			d_c.initw=false;
			d_c.inith=false;
			obj.data("layout_c",d_c);
		}
		//if(data.obj.attr("key")=="c3") alert("c3过程1"+(data.rw+"_"+data.rh));
		if(!(wchange||hchange))return {wchange:false,hchange:false,width:owidth,height:oheight,wh:(owidth+"_"+oheight),dc:d_c};//当前不需要执行
		
		var isv=obj.is(":visible");
		var w=owidth,isw=obj.attr(opt.attrWidthName);
		var h=oheight,ish=obj.attr(opt.attrHeightName);
		var layout_w=false,layout_h=false;
		if(wchange){
			obj.data("p_layout_w",width);
			if(isv){
				if(wchange) w=that.format(width,height,data.attrWidthName||isw||obj.width());
				else w=obj.width();
				w=Math.max(Math.min(d_c.maxw,w),d_c.minw);
			}
			if(!d_c.initw){
				layout_w=true;
				d_c.initw=true;
			}
			else layout_w=(owidth!=w);
			layout_w&&obj.width(w);

			//layout_w&&obj.width(w);//宽度可能判断失效 因为有时候div 即便没设置宽度 可能会取默认值 ，创建一个初始化变量
		
		}


		if(hchange){
			obj.data("p_layout_h",height);
			if(isv){
				if(hchange) h=that.format(width,height,data.attrHeightName||ish||obj.height());
				else h=obj.height();
				h=Math.max(Math.min(d_c.maxh,h),d_c.minh);
			}
			if(!d_c.inith){
				layout_h=true;
				d_c.inith=true;
			}
			else layout_h=(oheight!=h);
			layout_h&&obj.height(h);
		}

		//console.log(obj.attr("test-id")+"输出3对象");
		//console.log(data);
		//console.log(pdata);
		return {width:w,height:h,wchange:layout_w,hchange:layout_h,dc:d_c};//可见状态下 才允许更改
	}
	$.fn.layout = function (option,params) {
		var opt=$.fn.layout.defaults;
		return this.each(function () {
			var $this = $(this), data = $this.data(opt.CODENAME);
			var options= $.extend({}, data?data.options:opt, typeof option == 'object' && option)
			if (!data) $this.data(opt.CODENAME, (data = new Layout(this, options)));
			else data.options=options;
			if(typeof option=="string")data[option].apply(data,params?params:[]);
			else data.init();
		});
	}
	$.fn.layout.defaults = {
		CODENAME:"data-plug-layout",
		dragHtml:"",
		waitingHtml:"",
		rowName:"row",
		columnName:"column",
		ceilName:"ceil",
		attrBarName:"data-bar",
		attrMinWidthName:"data-minwidth",
		attrMinHeightName:"data-minheight",
		attrMaxWidthName:"data-maxwidth",
		attrMaxHeightName:"data-maxheight",
		attrWidthName:"data-width",
		attrHeightName:"data-height",
		resize:null,
		ready:null
	}
	$.fn.layout.Constructor = Layout
}(window.jQuery);