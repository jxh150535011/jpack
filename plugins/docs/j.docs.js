/* =========================================================
 *Write：jxh
 *Date: 2013-03-05
 *多文档操作类
 *只有一个body对象
 * ========================================================= */

var __f=function($J){
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
var docs={};
docs.defaults = {core:"data-plug-docs",
resize:null,
maxCount:10,
zindex:10,
itemOption:{}
,trigger:{change:null}
};
function __docs(element, options){
  __docs.base.constructor.call(this);
  this.options = options;
  this.$elem = $(element).css({"position": "relative"});
  this._haswindow=!(options.parent&&options.parent!=window);
  this.$parent=$((!this._haswindow)?options.parent:document.body);
  
  //this.$wait=$(options.wait||"<div style='display:block;'></div>");
  this.$overlay=$("<div />").css({position:"absolute","z-index":(this.options.zindex+1),top:0}).appendTo(this.$elem);
  this._items=[];
  this._history=[];
  this.init();
  this._rect={width:this.$elem.width(),height:this.$elem.height()};
};
docs.constructor=__docs;
$J.__extend($J.fn.core,docs);//继承父类方法
__docs.prototype.init=function(){
  var that=this,opt=this.options;
  that.$head=that.$elem.find("["+opt.core+"='head']");
  that.$body=that.$elem.find("["+opt.core+"='body']");
  that.event();
};
__docs.prototype._get_client_rect=function(){//不考虑滚动条
  if(this.options.parent!=window){
    var doc=this.$parent;
    return {width:doc.width(),height:doc.height()};
  }
  else{
    return {width:$(window).width(),height:$(window).height()};
  }
};
__docs.prototype.waitend=function(){
  this.$overlay.hide();
  this.$wait&&this.$wait.remove();
};
__docs.prototype.waiting=function(){
  var css={width:this._rect.width,height:this._rect.height};
  this.$overlay.css(css).show();
  if(!this.options.waitTemp)return;
  this.$wait=$(this.options.waitTemp).appendTo(this.$overlay).css(css);
};
__docs.prototype.resizeStart=function(fn){//Automatically determine whether the size change occurs
  var that = this,opt=this.options;
  if(that.resizeTimer)clearTimeout(that.resizeTimer);
  that.resizeTimer=setTimeout(function(){
  that.resize(fn);
  that.resizeStart(fn);
  },40);
};
__docs.prototype.resize=function(fn){
  var that=this,opt=this.options;
  if(!that.$body)return;
  var _wh=this._get_client_rect();
  var wh=that.$parent.data(opt.core+"-wh");
  if((!wh)||wh.width!=_wh.width||wh.height!=_wh.height){
    that.$parent.data(opt.core+"-wh",_wh);
    this._rect=_wh;
    that.$elem.css(_wh);
    that.trigger("resize");
  }
  that.sitem&&that.sitem._resize&&that.sitem&&that.sitem._resize();//执行自带的重整函数
};
__docs.prototype._push_history=function(item){
  this._history.push(item);
}
__docs.prototype._pop_history=function(){
  var p=this._history.pop();
  while((p=this._history.pop())){
    var i=this.find_item_index(p);
    if(i>-1)return this._items[i];
  }
  return null;
}
__docs.prototype._update=function(item,change){
  if(change!=true&&(!item.selected||(this.sitem&&item==this.sitem))){
    return false;//未选中 或则是当前对象
  }
  var pre=this.sitem,now=item;
  if(this.sitem){
    if(this.sitem.$html)this.sitem.$html.hide();
  }
  this.sitem=item;
  this._push_history(this.sitem.name);
  this.trigger("change",[pre,now]);
  return true;
};
__docs.prototype.loadStart=function(){
  var that=this;
  if(that.loadTimer)clearTimeout(that.loadTimer);
  that.loadTimer=setTimeout(function(){
  that.load();
  },40);
}
__docs.prototype.load=function(){
  var that=this,opt=this.options;
  var loadKey=new Date().getTime();//获取执行时间戳
  if(!that.sitem)return;
  that.sitem.loadKey=loadKey;
  var $content=that.sitem.content||"";
  var $contentType = $content.substring(0,$content.indexOf(":"));
  var $content = $content.substring($content.indexOf(":")+1,$content.length);
  if($contentType=="iframe"){
  that.loadIframe(that.sitem,$content,loadKey);
  }
  else if($contentType=="url"){
  that.loadUrl(that.sitem,$content,loadKey);
  }
  else{
  that.loadHtml(item,$content);
  }
};
__docs.prototype.loadUrl=function(item,url,loadKey){
  var that=this,opt=this.options;
  item.url=url;
  this.waiting();
  $.get(url,function(d){
    item.content="html:"+d;
    if(that.sitem&&that.sitem.loadKey==loadKey){
    that.loadHtml(item,d);
    this.waitend();
  }
  });
};
__docs.prototype.loadIframe=function(item,url,loadKey){
  var that=this,opt=this.options;
  that.waiting();
  if(!(item.$iframe&&item.$iframe.get(0))){
    item.$iframe=$("<iframe scrolling=\"yes\"  frameborder=\"0\" style='border: none;  width: 100px; height: 100px;' ></iframe>");
    that.loadHtml(item,item.$iframe);
  }
  that.loadHtml(item);
  item.$iframe.off("."+opt.core);
  if(item.url!=url){
    item.$iframe.data("loadKey",loadKey).on("load."+opt.core,function(){
      if(that.sitem&&that.sitem.loadKey==$(this).data("loadKey")){//当前选中iframe加载完成
      $(this).off("."+opt.core);
      var t="",w;
      try{
        item.window=w=$(this).get(0).contentWindow;w.focus();t=$(this).get(0).contentWindow.document.title;
        var $input=$("<input type='text' />").prependTo($(w.document.body));
        $input.focus();$input.remove();
      }catch(e){};
      $(this).width(that.$body.width()).height(that.$body.height());
      that.waitend();
      }
    });
    item.$iframe.attr("src",url);
    item.url=url;
  }
  else that.waitend();
  item._resize=function(){
    item.$iframe.width(that.$body.width()).height(that.$body.height());
  };
  item._resize();
};
__docs.prototype.loadHtml=function(item,html){
  var that=this,opt=this.options;
  if(!this.$body)return;
  if(!item.$html){
    item.$html=$("<div "+opt.core+"-body='"+item.name+"'/>").appendTo(this.$body).hide();
  }
  item.$html.show();
  if(html)item.$html.html(html);
};
__docs.prototype._update_head=function(item){
  var that=this,opt=this.options;
  if(!this.$head)return;
  if(!item.$head){
    item.$head=$("<span "+opt.core+"-head='"+item.name+"'/>").html(item.title||"").appendTo(this.$head);
    item.$head.off("."+this.options.core).on("click."+this.options.core,function(){
      item.selected=true;
      if(that._update(item,false))that.loadStart();
    });
  }
  else item.$head.html(item.title||"");
}
__docs.prototype.open=function(sitem){
  var that=this,opt=this.options;
  var item = sitem;
  if (!item.name) item.name = opt.core +$J.random(5)+ new Date().getTime();
  var index = this.find_item_index(item.name);
  var change=true;
  if (index < 0) {
    item = $.extend({}, opt.itemOption, item);
    if (this._items.length > this.maxCount) {
      alert("不能再打开新窗口了！"); return false;
    }
    index = this._items.length; 
    this._items.push(item);
  }
  else {
    change=(sitem.title==this._items[index].title&&sitem.content==this._items[index].content)?false:true;
    item=this._items[index] = $.extend(this._items[index], item);
  };
  item.selected=true;
  if(change)this._update_head(item);
  this._update(item,change);
  this.loadStart();
  return item;
};
__docs.prototype.close=function(name){
  var opt=this.options;
  if(!name){
      name=$("["+opt.core+"-body]:visible").eq(0).attr(opt.core+"-body");
      if(!name)return;
  }
  if(typeof name=="object"){
      name=$(name).parents("["+opt.core+"-head]").eq(0).attr(opt.core+"-head");
      if(!name)return;
  }
  var index = this.find_item_index(name),item=null;
  if(index>-1){
    item=this._items[index];
    //if(this.sitem&&this.sitem.name==item.name)this.$body.empty();
    item.$head&&item.$head.remove();
    item.$iframe&&item.$iframe.remove();
    this._items.splice(index,1);
  }
  var item=this._pop_history();
  if(item&&this._update(item))this.loadStart();
};
__docs.prototype.find_item_index=function(name){
  var l = this._items.length;
  for (var i = 0; i < l; i++) {
  if (this._items[i].name == name)
  return i;
  }
  return -1;
};
__docs.prototype.event=function(){
  var that=this,opt=this.options;
  if(this._haswindow||($.browser.msie&&$.browser.version!="9.0")){//If IE can bind resize event
    that.$parent.off('.'+opt.core).on("resize."+opt.ore,function(){
    if(that.resizeTimer)that.timer=clearTimeout(that.resizeTimer);
    that.resizeTimer=setTimeout(function(){
    that.resize();
    },10);
    });
    setTimeout(function(){that.$parent.triggerHandler("resize");},10);
  }
  else{
    that.resizeStart(function(){that.resize();});
  }
}
$.fn.docs = function (option) {
  return this.__init(docs,option);
};
$.fn.docs.Constructor = __docs;
docs.getObject=function(content,options){//获取绝对定位对象
  return $(content).docs(options).data(docs.defaults.core);
}
$J.fn.docs=docs;

};
if(jQuery){
  __f(window[J_NAME]);
}
else{
  J.require("jquery");
  J.define(__f);
}

