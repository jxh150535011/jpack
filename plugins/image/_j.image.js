/* =========================================================
**此版本弃用 创建jquery 版本
 *Write：{金兴亨}
 *Date: {2013-03-23}
 *Description:{延迟加载}
 *update 2013-03-23 延迟加载 
 * ========================================================= */
function lazyImg(container,option){
    this.CTYPE={INVISIBLE:0,OUTVISIBLE:1,INHIDDLEN:2,OUTHIDDLEN:3};
    this.option={loadState:"queue"};//加载默认队列加载 
    this.container=container||window;
    var doc = document,isWindow = this.container == window || this.container == doc|| !this.container.tagName || (/^(?:body|html)$/i).test( this.container.tagName );
    if ( isWindow ) 
        this.container = doc.compatMode == 'CSS1Compat' ? doc.documentElement : doc.body;
    this.isWindow=isWindow;
    this.option=this.option||{};
    for(var k in (option||{}))this.option[k]=option[k];
    this.option.lazyurl=this.option.lazyurl||"about:blank";
    this.loadimglist=[];//正在加载中的img队列
    this.index=0;
    this.maxcount=3;
    this.data={};
}
lazyImg.prototype.add=function(imgList){
    var that=this,opt=this.option;if(!imgList)return;
    if(typeof imgList.length=="undefined"){
       imgList=[imgList];
    }
    var list=this.list=this.list||[],p,iList=imgList||[];
    for(var i=iList.length-1;i>-1;i--){
        var img=iList[i],lazyid="lazy"+(that.index++);
        img.setAttribute("lazy-src",img.src);
        img.setAttribute("lazy-id",lazyid);
        var size=that.getSize(img);
        img.setAttribute("lazy-width",size.width);
        img.setAttribute("lazy-height",size.height);
        img.setAttribute("lazy-class",img.getAttribute("class"));
        img.setAttribute("class","lazy-loading");
        //delete img.Attribute["width"];delete img.Attribute["height"];
        img.src=opt.lazyurl;
        list.push(img);
    }
}
lazyImg.prototype.check=function(off,pos){
    if((pos.top>off.top&&pos.top<off.bottom)||(pos.bottom>off.top&&pos.bottom<off.bottom)){
        return pos.visible?this.CTYPE.INVISIBLE:this.CTYPE.INHIDDLEN;
    }
    return pos.visible?this.CTYPE.OUTVISIBLE:this.CTYPE.OUTHIDDLEN;;
};
lazyImg.prototype.getContainerOffsetRect=function(){
    var off=this.getContainerRect();
    var scrollTop=this.getScrollTop(),scrollLeft=this.getScrollLeft();
    off.top+=scrollTop,off.bottom+=scrollTop,off.left+=scrollLeft,off.right+=scrollLeft;
    return off;
}

lazyImg.prototype.load=function(){
    var that=this,opt=this.option;
    if(that.timer)clearTimeout(that.timer);
    that.timer=setTimeout(function(){
        var list=that.list||[];
        var l=list.length,i=0,j=0;if(l<1)return;
        var off=that.getContainerOffsetRect();//获取容器可见范围
        var ishide=false;
        while((i+j)<l){
            var img=list[i],lazyid=img.getAttribute("lazy-id");
            var data=that.data[lazyid];
            if(!(data&&data.visible)){
                data=that.data[lazyid]={target:img,pos:that.getRect(img)};
            }
            var pos=data.pos,flag=that.check(off,data.pos);
            if(flag==that.CTYPE.INVISIBLE){//范围内可见
                //img.src=img.getAttribute("lazy-src");
                that.loadimglist.push(img);
                list.splice(i,1);
                i--;j++
                delete that.data[lazyid];
            }
            else if(flag==that.CTYPE.INHIDDLEN||flag==that.CTYPE.OUTHIDDLEN){//范围 但不可见
                 ishide=true;
            }
            i++;
        }
        that.loadstart();
        if(ishide){
            if(that.hidetimer)clearTimeout(that.hidetimer);//隐藏定期触发事件
            //就是隐藏对象 一直判断 直到加载后没有任何隐藏对象
            that.hidetimer=setTimeout(function(){that.load();},500);
        }
    },20);//延迟触发事件
};
lazyImg.prototype.getRect=function(node) {
    var that=this;
    var old={},visible=true;
    /*var ddd=node.currentStyle;
    var str="";
    for(var k in ddd)str+=k+":"+ddd[k];
    alert(str);*/
    var _size=that.getSize(node);
    var n = node, left = 0, top = 0;
    if(_size.width&&_size.height){
        while (n) { left += n.offsetLeft; top += n.offsetTop; n = n.offsetParent; };
    }
    else  visible=false;
    var res ={
        "left": left, "right": left + _size.width,
        "top": top, "bottom": top + _size.height,visible:visible
    };
    return res;
}
lazyImg.prototype.getContainerRect = function(){
        if(this.isWindow&&("innerHeight" in window)){
            return {"left": 0,"right":window.innerWidth,"top": 0,"bottom":window.innerHeight}
        }
        else return this.getRect(this.container);
}
lazyImg.prototype.getScrollTop=function(node) {
    if(this.isWindow){
        var doc = node ? node.ownerDocument : document;
        return doc.documentElement.scrollTop || doc.body.scrollTop;
    }
    return this.container.scrollTop;
}
lazyImg.prototype.getScrollLeft=function(node) {
    if(this.isWindow){
        var doc = node ? node.ownerDocument : document;
        return doc.documentElement.scrollLeft || doc.body.scrollLeft;
    }
    return this.container.scrollLeft;
};
lazyImg.prototype.getStyle=function(elem,name){
    if(elem.style[name])return elem.style[name];
    else if(elem.currentStyle)return elem.currentStyle[name];
    else if(document.defaultView && document.defaultView.getComputedStyle){ 
        name = name.replace(/([A-Z])/g,"-$1"); 
        name = name.toLowerCase(); 
        var s = document.defaultView.getComputedStyle(elem,""); 
        return s && s.getPropertyValue(name); 
    }
    return null; 
};
lazyImg.prototype.restoreCSS=function(elem,prop){ 
    for(var i in prop){
        elem.style[i] = prop[i]; 
    }
}
lazyImg.prototype.contains=document.defaultView
? function (a, b) { return !!( a.compareDocumentPosition(b) & 16 ); }
: function (a, b) { return a != b && a.contains(b); };
lazyImg.prototype.getSize=function(elem) {
        var that=this;
        var width = elem.offsetWidth, height = elem.offsetHeight;
        if ( !width && !height ) {
            var repair = !that.contains( document.body, elem ), parent;
            if ( repair ) {//如果元素不在body上
                    parent = elem.parentNode;
                    document.body.insertBefore(elem, document.body.childNodes[0]);
            }
            var style = elem.style,
            cssShow = { position: "absolute", visibility: "hidden", display: "block", left: "-9999px", top: "-9999px" },
            cssBack = { position: style.position, visibility: style.visibility, display: style.display, left: style.left, top: style.top };
            that.restoreCSS( elem, cssShow );
            width = elem.offsetWidth; height = elem.offsetHeight;
            that.restoreCSS( elem, cssBack );
            if ( repair ) {
                    parent ? parent.appendChild(elem) : document.body.removeChild(elem);
            }
        }
        return { "width": width, "height": height };
}
lazyImg.prototype.loadstart=function(){//开始加载内容
    var that=this,opt=this.option;
    //img.src=img.getAttribute("lazy-src");
    if(this.loading)return;//正在加载 则直接结束
    this.loading=true;
    if(this.loadimglist.length<1){
        this.loading=false;
        return;
    }
    if(opt.loadState=="queue")//如果是队列
    {
        that.loadqueue(function(){
            that.loading=false;//加载结束
        });
    }
    else{
        for(var i=0,l=this.loadimglist.length;i<l;i++)
            this.loadingimg(this.loadimglist[i]);
        this.loadimglist=[];
        this.loading=false;//加载结束
    }
}
lazyImg.prototype.loadqueue=function(fn){
    var that=this,opt=this.option;
    if(this.loadimglist.length<1)return fn&&fn();
    var img=this.loadimglist[0];this.loadimglist.splice(0,1);
    this.loadingimg(img,function(elem,flag){
        if(flag==false&&elem)that.loadimglist.push(elem);
        that.loadqueue(fn);
    });
}
lazyImg.prototype.loadingimg=function(elem,fn){
    var that=this;
    var img=new Image();
    var error=elem.getAttribute("lazy-index")||0;
    if(typeof error=="string")error=parseInt(error,10);
    error++;
    elem.setAttribute("lazy-index",error);
    if(error>that.maxcount)return fn&&fn(null,false);
    
    img.onload = img.onreadystatechange=function(){
        if (img && img.readyState && img.readyState != 'loaded' && img.readyState != 'complete') 
            return fn&&fn(elem,false);
        img.onload = img.onreadystatechange = img.onerror = null;
        elem.src=img.src;
        if(elem.getAttribute("lazy-tune")){//如果需要调整
          var tune=elem.getAttribute("lazy-tune");
           var size={width:img.width,height:img.height};//实际大小
           var _size={width:elem.getAttribute("lazy-width"),height:elem.getAttribute("lazy-height")};
           _size.width=_size.width?parseInt(_size.width,10):0;_size.height=_size.height?parseInt(_size.height,10):0;
           if(_size.width>0&&_size.height>0){
             
                var wh=size.width/size.height,_wh=_size.width/_size.height;
                if(tune=="w"||(tune=="1"&&wh>_wh&&size.width>_size.width)){
                    size.height=size.height/size.width*_size.width;
                    size.width=_size.width;
                    //img.setAttribute("width",_size.width);
                }
                else if(tune=="h"||(tune=="1"&&wh<=_wh&&size.height>_size.height)){
                    size.width=size.width/size.height*_size.height;
                    size.height=_size.height;
                    //img.setAttribute("height",_size.height);
                }
                var l=(_size.width-size.width)/2,t=(_size.height-size.height)/2;
                elem.style.marginLeft=l+"px";
                elem.style.marginTop=t+"px";
                elem.style.marginBottom=t+"px";
                elem.setAttribute("width",size.width);
                elem.setAttribute("height",size.height);
                elem.setAttribute("class",elem.getAttribute("lazy-class"));
                elem.removeAttribute("lazy-class");
           }
        }
        return fn&&fn(elem,true);
    }
    img.onerror=function(){
       img.onload = img.onreadystatechange = img.onerror = null;
      return fn&&fn(elem,false);
    };
    setTimeout(function(){
        img.src=elem.getAttribute("lazy-src");
    },10);
}


/* =========================================================
 *Write：{金兴亨}
 *Date: {2013-03-23}
 *Description:{延迟加载}
 *jquery 版本结合 图片切割方程
 * ========================================================= */
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
