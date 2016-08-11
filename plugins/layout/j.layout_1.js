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
		that.content=this.$element;

		
		
		
		/*that.$element.css({"margin-left":"0px","margin-bottom":"0px","margin-right":"0px","margin-top":"0px","display":"block"});
		var rows=this.$element.children("["+opt.CODENAME+"='"+opt.rowName+"']");
		that.bars=$();//merge函数很方便
		rows.each(function(){
			var cols=$(this).children("["+opt.CODENAME+"='"+opt.columnName+"']");
			cols.css({"margin-left":"0px","margin-bottom":"0px","margin-right":"0px","margin-top":"0px","display":"block","float":"left"});
			//$(this).children("["+opt.CODENAME+"='"+opt.columnBarName+"']").css({"display":"block","clear":"botn","float":"left"});
			var colbars=cols.filter("["+opt.attrBarName+"='1']").css({"cursor":"e-resize"});
			//if(colbars.length>0)bars.push(colbars);
			that.bars=$.merge(that.bars,colbars);
			//that.bars.add(colbars);
			
		}).css({"margin-left":"0px","margin-bottom":"0px","margin-right":"0px","margin-top":"0px","display":"block"});
		var rowbars=rows.filter("["+opt.attrBarName+"='1']").css({"cursor":"n-resize"});
		//if(rowbars.length>0)bars.push(rowbars);
		that.bars=$.merge(that.bars,rowbars);
		//that.bars.add(rowbars);
		*/
		/*that.rowbars=this.$element.children("["+opt.CODENAME+"='"+opt.rowBarName+"']").each(function(){
			if(!$(this).attr(opt.attrWidthName))$(this).attr(opt.attrWidthName,"width");
		}).css({"display":"block","clear":"botn"})*/
		
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
		
		var div=$("<div />").css({ "background-color": "#ffffff",  opacity:1,"position": "absolute"
		,"display":"block",width:this.$parent.width(),height:this.$parent.height(),left:0,"z-index":9999,"top":0}).appendTo(that.content).html(opt.waitingHtml);
		that.event();
		if(opt.ready)opt.ready.call(this);
		div.fadeOut("fast",function(){
			div.remove();
		});
		$(document.body).css({"overflow":"hidden"});
		
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
			//暂且只是把其值修改 不影响其配置值 当整体发生变动 则 需要重新进行计算
			if(this.xoy){
				//注意及时情况 避免各种乱七八糟情况
				if(this.prev&&this.prev.get(0))this.prev.height(h).data("p_layout_h",-1).data("layout_h",-1);
				if(this.next&&this.next.get(0))this.next.height(sizewh.height-h).data("p_layout_h",-1).data("layout_h",-1);
			}
			else {
				if(this.prev&&this.prev.get(0))this.prev.width(w).data("p_layout_w",-1).data("layout_w",-1);
				if(this.next&&this.next.get(0))this.next.width(sizewh.width-w).data("p_layout_w",-1).data("layout_w",-1);
			}
			this.sizewh=null;
			
			if(this.prev&&this.prev.get(0))this.resize(this.prev);
			if(this.next&&this.next.get(0))this.resize(this.next);
			
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
		var posxy={};
		posxy.x=e.pageX;posxy.y=e.pageY;
		var offxy=obj.offset();
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
		,"display":"block",width:obj.width(),height:obj.height(),left:offxy.left,"z-index":9998,"top":offxy.top}).appendTo(obj.parent());
		if(this.dragDiv)this.dragDiv.remove();
		this.dragDiv=$("<div />").css({ "background-color": "blue",  opacity:0,"position": "absolute"
		,"display":"block",width:this.$parent.width(),height:this.$parent.height(),left:0,"z-index":9999,"top":0}).appendTo(obj.parent()).html(opt.dragHtml);

    };
	Layout.prototype.getRect=function(prev,next,obj){//计算出当中的bar可移动范围
		var that=this,opt=this.options;
		var width=obj.width(),height=obj.height();
		var p=obj.parent();
		var sizewh=prev&&prev.get(0)&&prev.offset()||p.offset();
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
	Layout.prototype.resizec=function(obj,data,fn){//遍历 data表示上层返回值
		var that=this,opt=this.options;
		//data 已携带父级信息
		//if(obj.attr("key")=="abc")alert(3);
		var childs=obj.children("["+opt.CODENAME+"='"+opt.rowName+"'],["+opt.CODENAME+"='"+opt.columnName+"'],["+opt.CODENAME+"='"+opt.ceilName+"']");
		if(childs.length<1)return;
		var rchilds=[];
		var w=data.width,h=data.height,wc=0,hc=0;

		if(data.change){//如果父级改动 则把p_layout_w 清空
			childs.data({"p_layout_w":-1,"p_layout_h":-1,"layout_w":-1,"layout_h":-1});
		}
		childs.each(function(){
			var c={rw:true,rh:true,obj:$(this)};
			//var isv=$(this).is(":visible");
			if(!$(this).attr(opt.attrBarName)){//非bar值
				if(!$(this).attr(opt.attrWidthName)){
					wc++;
					c.rw=false
				};
				if(!$(this).attr(opt.attrHeightName)){
					hc++;
					c.rh=false
				}
				if(!(c.rw&&c.rh))rchilds.push(c);//只要有一个值不存在
				if(!(c.rw||c.rh))return true;//两个属性值都不存在 直接结束
			}
			var d=fn&&fn(c,data);//返回当前节点信息 rw rh 如果被限制 例如 min or max 影响 返回true 并更改之
			c.rw=c.rw||d.rw;
			c.rh=c.rh||d.rh;
			c.dc=d.dc;
			c.change=d.change;
			if(c.rw)w-=d.width;
			if(c.rh)h-=d.height;
			if(c.rw&&c.rh&&d.change)that.resizec(c.obj,d,fn);//两边都计算完成后 在对后续节点处理
		});
		//if(obj.attr("key")=="c")alert(childs.length);
		//if(obj.attr("key")=="c3")alert(childs.length);
		for(var i=0;i<rchilds.length;i++){//全部减去自身最小值
			var c=rchilds[i];
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
			if(c.rw)w-=d.width;
			if(c.rh)h-=d.height;
			//if(c.obj.attr("key")=="c3")alert("c3运行:"+(d.change||c.change)+"预测值:"+c.attrWidthName+"宽："+d.width+",实际宽"+c.obj.width()+"_"+c.rw);
			if(d.change||c.change)that.resizec(c.obj,d,fn);//两边都计算完成后 在对后续节点处理
			
		}
	}
	Layout.prototype.update=function(){
		this.resize(null,true);
	}
	Layout.prototype.resize=function(root,change){
		var that=this,opt=this.options;
		var pdata={};
		if(!root){//节点不存在默认为父节点
			//obj:this.$parent
			var width=this.$parent.width(),height=this.$parent.height();
			pdata=that.resizeSet({obj:this.$element},{width:width,height:height});
			if(pdata.change===false&&!change)return;
			opt.resize&&opt.resize.call(that,width,height);
			pdata.change=true;//pdata.rw=true;pdata.rh=true;//rw 对于宽度 重新进行计算
			root=this.$element;
		}
		else pdata={width:root.width(),height:root.height()};
		this.resizec(root,pdata,function(cd,pd){//cd 代表子节点信息 pd 代表父节点信息
			return that.resizeSet(cd,pd);
		});
	};
	Layout.prototype.format=function(width,height,str){
			if(typeof str=="number")return str;
			var v=parseFloat(str);if(!isNaN(v))return Math.round(v);
			return eval(str);
	}
	Layout.prototype.resizeSet=function(data,pdata){//pdata {width,height},data{obj 还有附带参数attrWidthName arrtHeightName rw rh}
		var that=this,opt=this.options;	
		var obj=data.obj;
		var wh=pdata.wh,width=pdata.width,height=pdata.height;
		var MAX_VALUE=100000;
		//rw 为 宽度调整 rh为高度调整 哪部分需要调整 就取哪部分进行整合
		var p_layout_w=true;
		var p_layout_h=true;
		
		if(data.rw!==false){
			p_layout_w=(obj.data("p_layout_w")==width);
			obj.data("p_layout_w",width);
		}
		if(data.rh!==false){
			p_layout_h=(obj.data("p_layout_h")==height);
			obj.data("p_layout_h",height);
		}
		
		var d_c=obj.data("layout_c")//配置信息
		if(!d_c){
			d_c={};
			d_c.maxw=that.format(width,height,obj.attr(opt.attrMaxWidthName)||MAX_VALUE);
			d_c.minw=that.format(width,height,obj.attr(opt.attrMinWidthName)||0,0);
			
			d_c.maxh=that.format(width,height,obj.attr(opt.attrMaxHeightName)||MAX_VALUE);
			d_c.minh=that.format(width,height,obj.attr(opt.attrMinHeightName)||0,0);
			obj.data("layout_c",d_c);
		}
		//if(data.obj.attr("key")=="c3") alert("c3过程1"+(data.rw+"_"+data.rh));
		if(p_layout_w&&p_layout_h)return {change:false,width:obj.width(),height:obj.height(),wh:(obj.width()+"_"+obj.height()),dc:d_c};//当前不需要执行
		
		var d_wh=obj.data("layout_wh")//宽高值
		if(!d_wh){
			d_wh=(obj.width()+"_"+obj.height());
			obj.data("layout_wh",d_wh);
		}
		var isv=obj.is(":visible");
		var w=0,isw=obj.attr(opt.attrWidthName);
		if(isv){
			//if(obj.attr("id")=="left1")
			if(data.rw!==false){
				w=that.format(width,height,data.attrWidthName||isw||obj.width());
			}
			else w=obj.width();
			w=Math.max(Math.min(d_c.maxw,w),d_c.minw);
		}

		var h=0,ish=obj.attr(opt.attrHeightName);
		if(isv){
			if(data.rh!==false){
				h=that.format(width,height,data.attrHeightName||ish||obj.height());
			}
			else h=obj.height();
			h=Math.max(Math.min(d_c.maxh,h),d_c.minh);
		}
		/*if(h>maxh){
			h=maxh;
			data.rh=true;//表示 限制
		}
		if(h<minh){
			h=minh;
			data.rh=true;//表示 限制
		}*/
		var layout_w=true,layout_h=true;
		if(data.rw!==false){
			layout_w=(obj.data("layout_w")==w);
			obj.data("layout_w",w);
		}
		if(data.rh!==false){
			layout_h=(obj.data("layout_h")==h);
			obj.data("layout_h",h);
		}
		//if(data.obj.attr("key")=="c3") alert("c3过程2"+(layout_w&&layout_h));
		if(layout_w&&layout_h)return {width:w,height:h,change:false,rw:data.rw,rh:data.rh,dc:d_c};

		if(isv){//只允许在显示状态更改size
			if(ish)obj.height(h);
			if(isw)obj.width(w);
		}
		//if(obj.attr("key")=="c3")alert("c3_"+(layout_w&&layout_h));
		//if(obj.attr("key")=="c4")alert("c4_"+(layout_w&&layout_h));
		return {width:w,height:h,change:true&&isv,rw:data.rw,rh:data.rh,dc:d_c};//可见状态下 才允许更改
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