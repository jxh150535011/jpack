/* =========================================================
 *Write：jxh
 *Date: 2012-07-26
 * ========================================================= */
/*
update 2012-08-22
update 2012-08-27 Increase the positioning floating layer
update 2012-09-03 Increase the basic pop-up pop-up box
update 2013-04-01 全新改版
*/

J.require("jquery");
J.define(function(){

function Fixed(){

}
Fixed.prototype.constructor=Fixed;
$.fn.fixedmodal = function (option) {
  return this.each(function () {
    var $this = $(this)
      , data = $this.data('fixedmodal'), options;
    if(typeof option == 'object'){//null values ​​is also the object
      options= $.extend({}, data?data.options:$.fn.fixedmodal.defaults, option);
      if(data)data.options=options;
    }
    if (!data) $this.data('fixedmodal', (data = new fixedModal(this, options)))
    if(typeof option =='string')data[option]();
    
  })
}
J.fn.fixed=Fixed;
$.fn.fixedmodal.defaults = {CODENAME:"data-plug-fixed",backdrop: false,animate:true,xalign: "auto",yalign: "auto",zindex:10000,left:0,top:0,mark:"fixed:div"}
$.fn.fixedmodal.Constructor = Fixed;



function Dialog(content, options) {
  var that=this;
  this.options = options
  this.$elem = $(content).appendTo($(document.body)).hide();
  this.$elem.css("position","fixed");
  if($.browser.msie&&$.browser.version=="6.0"){
    this.$elem.css("position","absolute");
  }
  this._isshow=false;
  this._size={left:0,top:0,width:0,height:0};
  this._scrollTimer=null;
  this._scrollPos=null;
  this._plugid=this.options.CODENAME+Math.round(Math.random()*100000);
}
Dialog.prototype.constructor=Dialog;
Dialog.prototype.fixed_absolute=function(e){
  var that = this,opt=this.options;if(!this._isshow)return;
  if(this._scrollTimer)clearTimeout(this._scrollTimer);
  else this._scrollPos=this.getScrollPos();
  this._scrollTimer=setTimeout(function(){
    if(!that._scrollPos)return;
    var pos=that.getScrollPos();
    var offset={left:that.left,top:that.top};
    that.setsize(offset,function(){that._scrollPos=pos;});
  },100);
};
Dialog.prototype.toggle=function(key){
  var that = this,opt=this.options;
  if(this._isshow^key!="open")return;
  this._isshow=(key=="open");
};
Dialog.prototype.getScrollPos=function(){

};


});
!function ($) {
  

  Dialog.prototype = {
      constructor: Dialog
    ,getpadding:function(){//计算边距
      var that = this,opt=this.options;
      if(!that.padding){//先计算四边距
          var modal_body=that.$element.find("[data-handler='body']");
          var v=that.$element.is(":visible");
          if(!v)that.$element.show();
          var modal_header=that.$element.find("[data-handler='header']")
          ,modal_footer=that.$element.find("[data-handler='footer']");
          that.padding=[modal_header.outerHeight(),0,modal_footer.outerHeight(),0];
          modal_body.css({"padding":"0px"});
          if(!opt.header){modal_header.hide();that.padding[0]=0;};
          if(!opt.footer){modal_footer.hide();that.padding[2]=0;};
          if(!v)that.$element.hide();
          for(var i=0;i<that.padding.length;i++){
            that.padding[i]=that.padding[i]||opt.padding[i];
          }
      }
      return that.padding;
    }
    ,setsize:function(size,isanimate,fn){
      if(!size)return;
      var that = this,opt=this.options;
      var css={};
      if(!opt.move){
        delete size.left;
        delete size.top;
      }
      for(var k in size){
        if(size[k]&&that.size[k]!=size[k]){
          that.size[k]=css[k]=size[k];
        }
      }
      var padding=that.getpadding();
      var bodycss={};
      if(css.height){
        bodycss.height=css.height-padding[0]-padding[2];
      };
      if(css.width)bodycss.width=css.width-padding[1]-padding[3];
      
      if(css.top!=null||css.left!=null){
        if(that.$element.css("position")=="absolute"){
          var pos=that.getScrollPos();
          if(css.top!=null)css.top+=pos.top;
          if(css.left!=null)css.left+=pos.left;
        }
      }
      var m=that.$element.find("[data-handler='body']").css(bodycss);
      m.find("iframe").css(bodycss);
      if(opt.animate&&isanimate!=false)that.$element.stop().animate(css,"slow",function(){fn&&fn();});
      else that.$element.css(css)&&fn&&fn();
    }
    ,getsize:function(size){//可以带入新的宽度与高度
        var that = this,opt=this.options;
        var modal_body=that.$element.find("[data-handler='body']");
        if(!size)size={};
        if(!size.width)size.width=modal_body.width();
        if(!size.height)size.height=modal_body.height();
         var padding=that.getpadding();
        var reswh=null,resxy=null,res={};
        function _getsizerect(){
          var _res={width:0,height:0,xauto:0,yauto:0,xfill:0,yfill:0};
          _res.width=$(window).width();
          _res.height=$(window).height();
          _res.xauto=size.width+padding[1]+padding[3];
          _res.yauto=size.height+padding[0]+padding[2];
          _res.xfill=_res.width;
          _res.yfill=_res.height;
          return _res;
        }
        function _getrect(){
          if(!reswh)reswh=_getsizerect();
          var _res={xleft:0,xcenter:0,xright:0,ytop:0,ycenter:0,ybottom:0,xauto:0,yauto:0};
          _res.xauto=that.size.left;
          _res.yauto=that.size.top;
          _res.xright=reswh.width-(res.width||0);//res.width保证计算宽度之前有数值
          _res.xcenter=_res.xright/2;
          _res.ybottom=reswh.height-(res.height||0);
          _res.ycenter=_res.ybottom/2;
          return _res;
        }
        function _wformat(str){
          if(typeof str=="number")return str+padding[1]+padding[3];
          if(!reswh)reswh=_getsizerect();
          var width=reswh.width,fill=reswh.xfill,auto=reswh.xauto;
          return eval(str);
        }
        function _hformat(str){
          if(typeof str=="number")return str+padding[0]+padding[2];
          if(!reswh)reswh=_getsizerect();
          var height=reswh.height,fill=reswh.yfill,auto=reswh.yauto;
          return eval(str);
        }
        function _xformat(str){
          if(!resxy)resxy=_getrect();
          var auto=resxy.xauto,center=resxy.xcenter,left=resxy.xleft,right=resxy.xright;
          return eval(str);
        }
        function _yformat(str){
          if(!resxy)resxy=_getrect();
          var auto=resxy.yauto,center=resxy.ycenter,top=resxy.ytop,bottom=resxy.ybottom;
          return eval(str);
        }
        res.width=_wformat(opt.width);
        res.height=_hformat(opt.height);
        res.left=_xformat(opt.xalign);
        res.top=_yformat(opt.yalign);
        return res;
    }
    ,resize:function (size){//调整大小
      var that = this,opt=this.options;
      var w=$(document).width(),h=$(document).height();
      if(opt.backdrop&&that.$backdrop)that.$backdrop.width(w).height(h);
      if(that.resizeTimer)clearTimeout(that.resizeTimer);
      that.resizeTimer=setTimeout(function(){
        that.setsize(size);
      },50);
    }
    , hide: function (e) {
        var that = this;
        if (!this.isShown) return;
        this.isShown = false
        escape.call(this);
        hideModal.call(this);
      }
      ,remove:function(e,srcElement){/*Add New Function Remove This,This Function not animate*/
        var that = this;
        if(srcElement)
        {
            var data_btn=$(srcElement).attr("data-btn"),flag=-1;
            if(data_btn=="yes")flag=1;
            else if(data_btn=="no")flag=0;
            if(flag>-1&&that.options.confirm){
              var d=that.options.confirm.call(that,flag,that.targetWin);
              if(d==false)return;//Does not close
            }
        }
        if(that.options.junload)that.options.junload.call(that,that);
        //$('body').removeClass('modal-open');
        this.isShown=false;escape.call(this);
        this.$element.remove();this.$element=null;
        backdrop.call(that);
        var t=$(document).scrollTop();
        try{
          var $input=$("<input type='text' />").appendTo($(window.document.body));
          $input.focus();
          $input.remove();
        }catch(e){};
        $(document).scrollTop(t);
        return false;
      }
      ,load:function(content){
        var that = this,opt=this.options;
        var btn_key=["btn_yes","btn_no","btn_close"];
        $.each(btn_key,function(k,v){//remove btns
          if(!opt[v])$('[data-dismiss="dialog"][data-btn="'+v.replace("btn_","")+'"]',that.$element).remove();
        });
        $.each(btn_key,function(k,v){
          if(opt[v+"_text"])$('[data-dismiss="dialog"][data-btn="'+v.replace("btn_","")+'"]',that.$element).text(opt[v+"_text"]);
        });
        var modal_body=that.$element.find("[data-handler='body']");
        this.setsize(this.getsize({width:200,height:50}),that.isShown);
        if(!that.isShown){
          this.show();
        }
        var $content=content||that.options.content||"";
        var $contentType = $content.substring(0,$content.indexOf(":"));
        var $content = $content.substring($content.indexOf(":")+1,$content.length);
        switch($contentType){
          case "html":{modal_body.html($content);break;}
          case "iframe":{
            modal_body.css({"overflow":"hidden"});
            //return;
            var iframe=$("<iframe scrolling=\"auto\"  frameborder=\"0\" style='border: none;  width: "+modal_body.width()+"px; height: "+modal_body.height()+"px;' ></iframe>");
            modal_body.html(iframe);
            that.iframe=iframe;
            iframe.load(function(){
              var t="",w,size={width:0,height:0};
              try{w=$(this).get(0).contentWindow;w.focus();
              var doc=$(this).get(0).contentWindow.document;
              t=doc.title;
              size.width=$(doc).width(),size.height=$(doc).height();
            }catch(e){};
              that.targetWin=w;
              if(!opt.title)that.$element.find("[data-self='title']").eq(0).text(t==""?"加载完成":t);
              if(opt.jload)opt.jload.apply(that,[w]);
              that.setsize(that.getsize(size));
            });
            iframe.attr("src",$content);

            break;}
          default:{}
        }
      }
      ,dragend:function(){
        var that=this,opt=this.options;
        that.isMouseDown=false;opt.x=0,opt.y=0,opt.offx=0,opt.offy=0;
        escape.call(that);
        var modal_body=that.$element.find("[data-handler='body']");
        modal_body.children("div").remove();
      }
      ,draging:function(e){
        var that=this,opt=this.options;
        if(!that.isMouseDown)return;
        //if(that.moveingTimer)clearTimeout(that.moveingTimer);
        var _x=e.pageX-opt.x,_y=e.pageY-opt.y;
        var l=_x+opt.offx,t=_y+opt.offy;
        that.setsize({left:l,top:t},false);
      }
      ,dragstart:function(e){
        var that=this,opt=this.options;
        opt.x=e.pageX;opt.y=e.pageY;
        //var pos={left:0,top:0};
        //if(that.$element.css("position")=="absolute")//IE6 using absolute positioning does not need to read the scroll offset
          //pos=that.getScrollPos();
        opt.offx=that.size.left;opt.offy=that.size.top;
        that.isMouseDown=true;
        escape.call(that);
        var modal_body=that.$element.find("[data-handler='body']");
        var _d=$("<div />").css({ "background-color": "#ffffff",  opacity:0,"position": "absolute"
        ,"display":"block",width:that.$element.width(),height:that.$element.height(),left:0,"z-index":10000,"top":0});
        modal_body.append(_d);
      }
      ,getScrollPos:function(){
        return {left:$(document).scrollLeft(),top:$(document).scrollTop()};
      }
      ,showMoveTip:function(){
        
      }
      ,showLoad:function(){
        
      }
      ,closeLoad:function(){
        
      }
  }


 /* DIALOG PRIVATE METHODS
  * ===================== */
  function hideModal(that) {
    this.$element
      .hide();
    backdrop.call(this)
  }

  function backdrop(callback) {
    var that = this;
    if (this.isShown && this.options.backdrop) {
      this.$backdrop = this.$backdrop||$('<div class="win-bg" />').appendTo(document.body);  
      if (this.options.backdrop != 'static') {
        this.$backdrop.dblclick($.proxy(this.remove, this))
      }
      //if (doAnimate) this.$backdrop[0].offsetWidth // force reflow
      this.$backdrop.addClass('in').fadeIn("fast",function(){
        callback();
      });
    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in');
      removeBackdrop.call(this);
    }
  }

  function removeBackdrop() {
    this.$backdrop.fadeOut("fast",function(){
      $(this).remove();
    })
    this.$backdrop = null
  }
  function escape() {
    var that = this,opt=this.options;
    if (this.isShown) {
      $(window).off('.dialog').on("resize.dialog",function(){
        that.resize();
      })
      if(that.$element.css("position")=="absolute"){//Binding scroll bar incident
        $(window).on("scroll.dialog",function(e){
          that.fixed_absolute(e);//Absolute positioning
        });
      }
      if(opt.keyboard){
        $(document).off('keyup.dismiss.dialog').on('keyup.dismiss.dialog', function ( e ) {
          var data;
          e.which == 27 && (data=$("[data-self='dialog']").last().data("dialog"))&&data.remove();
        })
      }
      if(opt.move&&that.isMouseDown){
        $(document).off('.move.dialog').on('mousemove.move.dialog', function ( e ) {
         that.draging(e)
        }).on('mouseup.move.dialog', function ( e ) {
         that.dragend(e)
        }).on('mouseleave.move.dialog', function ( e ) {
         that.dragend(e)
        })
      }
      else if(!that.isMouseDown)$(document).off('.move.dialog');
    }
    else {
      if( $("[data-self='dialog']").length<1)$(document).off('keyup.dismiss.dialog').off('.move.dialog');
      $(window).off('.dialog');
    }
    
  }


 /* DIALOG PLUGIN DEFINITION
  * ======================= */

  $.fn.dialog = function (option) {
    
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dialog')
        , options = $.extend({}, data?data.options:$.fn.dialog.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('dialog', (data = new Dialog(this, options)));
      else data.options=options;
      //if (typeof option == 'string') data[option]()
      //else if (options.show) data.show()
    })
  }

  $.fn.dialog.defaults = {
      backdrop: true
    , keyboard: true
    , animate:true
    ,xalign: "center"
    ,yalign: "center"
    ,padding:[0,0,0,0]
    , show: true
    , jload:null
    , footer:true
    , header:true
    , junload:null
    , content:null
    , btn_close:true
    , btn_yes:true
    ,btn_yes_text:"确定"
    ,btn_no_text:"取消"
    , btn_no:true
  }

  $.fn.dialog.Constructor = Dialog


 /* DIALOG DATA-API
  * ============== */

  $(function () {return;
    $('body').on('click.dialog.data-api', '[data-toggle="dialog"]', function ( e ) {
      var $this = $(this), href
        , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
        , option = $target.data('dialog') ? 'toggle' : $.extend({}, $target.data(), $this.data())
      e.preventDefault()
      $target.dialog(option)
    })
  })

}(window.jQuery);


!function ($) {

  "use strict"; // jshint ;
 /* FIXEDModal CLASS DEFINITION
  * ====================== */
  var fixedModal = function (content, options) {
    var that=this;
    this.options = options
    this.$element = $(content);
    this.incontains=$.contains($(document.body),this.$element);//Whether to include the current container
    this.$parent=$(options.parent?options.parent:document.body);
    this.$body=$("<div style='position:fixed;display:block;overflow: visible;' />").hide();//background-color:red;
    this.$body.css({"z-index":options.zindex}).appendTo(this.$parent);
    if(options.backdrop){
    this.$backdrop=$("<div style='position:fixed;display:block;right: 0;bottom: 0; left:0;top:0;background-color: #000;' />").hide();
    this.$backdrop.css({"opacity":0.6}).appendTo(this.$parent);
    }
    this.getscrollPos=function(){
        //var doc=document.documentElement && document.documentElement.scrollTop?document.documentElement:document.body;
        var doc=$(document);
        if(options.parent)doc=$(options.parent);
        return function(){ return {left:doc.scrollLeft(),top:doc.scrollTop()}};
    }();
    
    this.getclientRect=function(){
      var target=$(options.parent?options.parent:window);
      if(options.parent){
        return function(){
          var doc=target.get(0);
          var wh={width:target.width(),height:target.height()};
          var overflow=target.css("overflow");
          var overflow_x=target.css("overflow-x")||overflow;
          var overflow_y=target.css("overflow-y")||overflow;
          var scrollpos={width:doc.scrollWidth,height:doc.scrollHeight};
          var xscroll=overflow_x=="hidden"?false:((scrollpos.width!=wh.width)||(scrollpos.height<wh.height));
          var yscroll=overflow_y=="hidden"?false:((scrollpos.height!=wh.height)||(scrollpos.width<wh.width));
          wh.width-=yscroll?17:0;
          wh.height-=xscroll?17:0;
          return wh;
        };
      }
      else{
        return function(){
        return {width:$(window).width(),height:$(window).height()};
        };
      }
    }();
    /*this.getParentRect=function(){
        var doc=$(window);
        if(options.parent){
          var doc=$(options.parent),position=doc.css("position");
          if(position=="fixed")
          return function(){
            if(doc.css(""))
            var offset=doc.offset();
            return {left:offset.left,top:offset.top}
          
          };
        }
        return function(){ return {left:0,top:0,width:$(window).width(),height:$(window).height()}};
        
      
    }();*/
    
    if($.browser.msie&&$.browser.version=="6.0"){
      this.$body.css("position","absolute");
      this.$backdrop.css("position","absolute");
    }
    if(options.parent){
      if(!this.$parent.css("position"))this.$parent.css("position","relative");
      this.$body.css("position","absolute");
      this.$backdrop.css("position","absolute");
    }
    //this.$element.appendTo(this.$body);

    this.init();
  }
  fixedModal.prototype = {
      constructor: fixedModal,
      fixed:function(e){
             var that = this,opt=this.options;
             if(that.positionTimer)clearTimeout(that.positionTimer);
             that.positionTimer=setTimeout(function(){
              var pos=that.getscrollPos();
              that.$body.animate({left:that.left+pos.left,top:that.top+pos.top},200,
              function(){
              });
             },100);
      },
      show:function(isanimate){
        var that=this;
        that.isshow=true;
        that.addMark();
        that.$element.appendTo(this.$body);
        that.resize();
        if(isanimate){
          var $type=$.type(isanimate);
          if($type=="boolean")
            that.$body.fadeIn("fast");
          else if($type=="function")isanimate.call(that,that.$body);
        }
        else that.$body.show();
        if(that.$backdrop)that.$backdrop.show();
        that.event();
      },
      addMark:function(){
        var that=this,opt=that.options;
        if(that.mark)return;
        if(!that.incontains)return;
        that.mark=$("<"+opt.mark+" />");
        that.$element.after(that.mark);
      },
      removeMark:function(){
        var that=this,opt=that.options;
        if(!that.incontains)return;
        if(that.mark)that.mark.remove();
        that.mark=null;
      },
      restore:function(isanimate){//To release reserves the elements of the basic characteristics of
        var that=this;
        that.isshow=false;
        function _restore(){
          if(that.mark){
        	  that.mark.after(that.$element);
          };
          that.removeMark();
          that.$body.hide();
          if(that.$backdrop)that.$backdrop.remove();
        }
       if(isanimate){
          var $type=$.type(isanimate);
          if($type=="boolean")that.$body.fadeOut("fast",function(){_restore();});
          else if($type=="function")isanimate.call(that,that.$body,function(){_restore();});
        }
        else _restore();
      },
      remove:function(isanimate){
        var that=this;
        that.isshow=false;
        that.removeMark();
        function _remove(){
          that.$body.remove();
          if(that.$backdrop)that.$backdrop.remove();
        }
        if(isanimate)that.$body.fadeOut("fast",function(){
          _remove();
        });
        else _remove();
      },
      resizeStart:function(fn){//Automatically determine whether the size change occurs
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
      },
      resize:function(){
        var that = this,opt=this.options,wh={width:0,height:0};
        if(!that.isshow)return;
        if(that.$backdrop){
          var w=$(window).width(),h=$(document).height();
          that.$backdrop.width(w).height(h);
        }
        var res=null;
        function _getrect(){
          var _res={xleft:0,xcenter:0,xright:0,ytop:0,ycenter:0,ybottom:0};
          var wh=that.getclientRect();
          _res.xright=wh.width-that.$body.width();
          _res.xcenter=_res.xright/2;
          _res.ybottom=wh.height-that.$body.height();
          _res.ycenter=_res.ybottom/2;
          return _res;
        }
        //if(opt.xalign=="right"||opt.yalign=="bottom"||opt.xalign=="center"||opt.yalign=="center"){
          //wh=this.getclientRect();
          //scrollpos=this.getscrollPos();
          //var xscroll=(scrollpos.width!=wh.width)||(scrollpos.height<wh.height);
          //var yscroll=(scrollpos.height!=wh.height)||(scrollpos.width<wh.width);
          //wh.width-=yscroll?17:0;
          //wh.height-=xscroll?18:0;
        //}
        function _xformat(str){
          if(!res)res=_getrect();
          var auto=opt.left,center=res.xcenter,left=res.xleft,right=res.xright;
          return eval(str);
        }
        function _yformat(str){
          if(!res)res=_getrect();
          var auto=opt.top,center=res.ycenter,top=res.ytop,bottom=res.ybottom;
          return eval(str);
        }
        if(typeof opt.xalign=="string") opt.left=_xformat(opt.xalign);
        if(typeof opt.yalign=="string") opt.top=_yformat(opt.yalign);
        that.fixedTo({left:opt.left,top:opt.top});
      },
      fixedTo:function(pos){//Fixed positioning scroll bars automatically superimposed relative to the parent
        var that = this,opt=this.options;
        var scrollPx={left:0,top:0};
        if(this.$body.css("position")=="absolute")
          scrollPx=that.getscrollPos();
        that.left=pos.left,that.top=pos.top;
        that.$body.css({left:that.left+scrollPx.left,top:that.top+scrollPx.top});
      },
      init:function(){
        var that=this,opt=this.options;
      },
      event:function(){
        var that=this,opt=this.options;
        var $parent=opt.parent?opt.parent:window;//The parent needs to bind the event
        $($parent).off(".fixedmodal");
        if(that.resizeTimer)clearTimeout(that.resizeTimer);
        if(!that.isshow)return;
        if(that.$body.css("position")=="absolute"){//If absolute positioning need to add scroll event
          $($parent).on("scroll.fixedmodal",function(e){
            that.fixed(e);
          });
        }
        //window non-IE is $ parent non-window effect can not take effect TBD
        if($.browser.msie){//If IE can bind resize event
          $($parent).on("resize.fixedmodal",function(){
              that.resize();
          });
        }
        else
        {
            that.resizeStart(function(){
              that.resize();
            });
        }
      }
  }
 /* FIXEDModal PLUGIN DEFINITION
  * ======================= */
  $.fn.fixedmodal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('fixedmodal'), options;
      if(typeof option == 'object'){//null values ​​is also the object
        options= $.extend({}, data?data.options:$.fn.fixedmodal.defaults, option);
        if(data)data.options=options;
      }
      if (!data) $this.data('fixedmodal', (data = new fixedModal(this, options)))
      if(typeof option =='string')data[option]();
      
    })
  }

  $.fn.fixedmodal.defaults = {
    i:0
    ,backdrop: false
    ,animate:true
    ,xalign: "auto"
    ,yalign: "auto"
    ,zindex:10000
    ,left:0
    ,top:0
    ,mark:"fixed:div"
  }

  $.fn.fixedmodal.Constructor = fixedModal


 /* FIXEDModal DATA-API
  * ============== */

  $(function () {
  });

}(window.jQuery);

!function ($) {

  "use strict"; // jshint ;
 /* JALERT CLASS DEFINITION
  * ====================== */
  var jalertModal = function (content, options) {

  }
  jalertModal.prototype = {
      constructor: jalertModal
  }
 /* JALERT PLUGIN DEFINITION
  * ======================= */
  $.fn.jalertmodal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('jalertmodal'), options;
      if(typeof option == 'object'){//null values ​​is also the object
        options= $.extend({}, data?data.options:$.fn.jalertmodal.defaults, option);
        if(data)data.options=options;
      }
      if (!data) $this.data('jalertmodal', (data = new jalertModal(this, options)))
      if(typeof option =='string')data[option]();
    })
  }

  $.fn.jalertmodal.defaults = {
  }

  $.fn.jalertmodal.Constructor = jalertModal


 /* JALERT DATA-API
  * ============== */
  $(function () {
  });

}(window.jQuery);
 /* DIALOG DATA-API
  * Add Flag data-self="dialog"
  * ============== */
function jopen_create(options,dialog){
        options.width=options.width?options.width:300,options.height=options.height?options.height:300;
        var style="";
        var s="";
        if(options.modalType=="view"){
              options.footer=false;
              options.header=false;
              style="border-width:0px;";
              s='<div class="modal hide" style="overflow:hidden; '+style+'"  data-self="dialog"><div data-handler="header" class="modal-header" style="">';
              s+='<span type="button"  class="close" data-dismiss="dialog" data-btn="close" style="">×</span><h3 data-self="title" class="yahei" style="font-size:18px;"  >'+(options.title?options.title:"加载中")+'</h3>';
              s+='</div><div class="modal-body" style="" data-handler="body"></div>';
              s+='<div class="modal-footer form"  data-handler="footer"><a href="javascript:void(0);" class="btn" data-dismiss="dialog" data-btn="no">取消</a><a href="javascript:void(0);" class="btn btn-primary" data-dismiss="dialog" data-btn="yes">确定</a>';
              s+='</div></div>';
        }
        else{
              options.padding=[0,9,0,9];
              options.animate=false;
              options.move=false;
              s='<div class="win-page" style="" data-self="dialog"><div class="win-center">';
              s+='<p class="round-top">';
              s+='<b class="round-left"></b><b class="round-repeat"></b><b class="round-right"></b>';
              s+='</p>';
              s+='<div class="shadow-left">';
              s+='<div class="shadow-right">';
              s+='<div class="win-hd" data-handler="header" ><p class="title" data-self="title"></p><p class="shut" data-dismiss="dialog" data-btn="close"></p></div>';
              s+='<div class="win-bd" data-handler="body"></div>';
              s+='<div class="win-ft" data-handler="footer">';
              s+='<a href="javascript:void(0);" title="" class="btn" data-dismiss="dialog" data-btn="no">取消</a>';
              s+='<a href="javascript:void(0);" title="" class="btn" data-dismiss="dialog" data-btn="yes">确定</a>';
              s+='</div>';
              s+='</div>';
              s+='</div>';
              s+='<p class="round-bottom">';
              s+='<b class="round-left"></b><b class="round-repeat"></b><b class="round-right"></b>';
              s+='</p>';
              s+='</div></div>';
        }
        
        $this=dialog||$(s).appendTo($(document.body));
        $this.dialog(options);
        var data=$this.data("dialog");
        data.load();//load and show
        return $this;
}

function jopen(options,dialog){
   if(typeof TRANA=="undefined")return;
   TRANA.loadStyle("http://127.0.0.1/art/TranaHtml/trana.cn/jsp/styles/win_box.css",null,function(){
        jopen_create(options,dialog);
   });
  //style"right:0px;display:none;background-color: red;margin-top: 0px; padding-top: 0px; float:right;position: absolute;"
  
}
function jclosed(dialog){
  if(!dialog)dialog=$("[data-self='dialog']");
  dialog.each(function(){
    var data=$(this).data("dialog")||$(this).data("jalert");
    if(data)data.remove();
  });
}
function jdialogModal(options){//Prompted Model
  var defaults={title:"系统提示",html:"", btn_close:true
    , btn_yes:true,btn_yes_text:"确定",btn_no_text:"取消", btn_no:true,width:300,height:300};//relative
  var opt= $.extend({}, defaults, options);
  var style="style=' $width;$height;'".replace("$width",(options.width?("width:"+options.width+"px"):""))
  .replace("$height",(options.height?("height:"+options.height+"px"):""));
  var s='<div class="modal" style="overflow:hidden;position:static; width:'+opt.width+'px;margin:0 0 0 0;" data-self="dialog">';
  s+='<div class="modal-header" >';//style="width:'+opt.width+'px"
  s+='<span type="button"  class="close" data-dismiss="dialog" data-btn="close" style="">×</span><h3 data-self="title" class="yahei" style="font-size:18px;"  >'+opt.title+'</h3>';
  s+='</div><div class="modal-body" style="">';
  s+=opt.html;
  s+='</div><div class="modal-footer form" style="width:'+(opt.width-30)+'px"><a href="javascript:void(0);" class="btn" data-dismiss="dialog" data-btn="no">取消</a><a href="javascript:void(0);" class="btn btn-primary" data-dismiss="dialog" data-btn="yes">确定</a>';
  s+='</div></div>';
  var $this=$(s);
  var btn_close=$this.find("[data-btn='close']")
  ,btn_no=$this.find("[data-btn='no']").text(opt.btn_no_text)
  ,btn_yes=$this.find("[data-btn='yes']").text(opt.btn_yes_text);
  if(!opt.btn_close)btn_close.remove();
  if(!opt.btn_yes)btn_yes.remove();
  if(!opt.btn_no)btn_no.remove();
  return $this;
}


function jalert(msg,fn,options){//Prompt object
  var $jalert=$(document).data("jalert");
  if($jalert)jclosed($jalert);//Remove objects
  var defaults={tipType:"winTip",width:300,btn_no:false,xalign:"center",yalign:"center"};//winRight/winError/
  var opt=$.extend({}, defaults, options);
  var s="";
  s+='<table><tr>';
  s+='<td width="40"><span class="'+opt.tipType+'"></span></td>';
  s+='<td width="260"><p class="winCon">'+msg+'</p></td>';	
  s+='</tr></table>';
  opt.html=s;
  var $jdialog=jdialogModal(opt);
  $jalert=$jdialog.fixedmodal(opt);
  $(document).data("jalert",$jalert);
  $this=$jalert.data("fixedmodal");
  $jalert.data("jalert",$this);
  $jalert.find("[data-btn='close'],[data-btn='no']").click(function(){
    $this.remove();if(fn)fn.call(this,0);
    
  });
  $jalert.find("[data-btn='yes']").click(function(){
    $this.remove();if(fn)fn.call(this,1);
  });
  $this.show();
}
function jconfirm(msg,fn,options){
  var $jalert=$(document).data("jalert");
  if($jalert)jclosed($jalert);//Remove objects
  var defaults={tipType:"winTip",width:300,xalign:"center",yalign:"center"};//winRight/winError/
  var opt=$.extend({}, defaults, options);
  var s="";
  s+='<table><tr>';
  s+='<td width="40"><span class="'+opt.tipType+'"></span></td>';
  s+='<td width="260"><p class="winCon">'+msg+'</p></td>';	
  s+='</tr></table>';
  opt.html=s;
  var $jdialog=jdialogModal(opt);
  $jalert=$jdialog.fixedmodal(opt);
  $(document).data("jalert",$jalert);
  $this=$jalert.data("fixedmodal");
  $jalert.data("jalert",$this);
  $jalert.find("[data-btn='close'],[data-btn='no']").click(function(){
    $this.remove();if(fn)fn.call(this,0,opt.data);
  });
  $jalert.find("[data-btn='yes']").click(function(){
    $this.remove();if(fn)fn.call(this,1,opt.data);
  });
  $this.show();
}
function jTip(msg,closetime,fn){//Pop-up comment published success
	jClosedTip();
        var jtiptimer=$(document).data("jtiptimer"),jtiplist=$(document).data("jtiplist")||[];
	msg=msg||"发表留言成功！";
	var tipBox=$('<div  class="showmsgBox" style=" width: 170px; "><span class="blogdetailCommentbg"></span>'+msg+'</div>');
	if(tipBox.data("timer"))clearTimeout(tipBox.data("timer"));
	var $tip=tipBox.fixedmodal({xalign:"center",yalign:"center",zindex:10000});
	var $this=$tip.data("fixedmodal");
	var v=$(document.body).css("overflow");
	$(document.body).css("overflow","hidden");//Prevent the scroll bar
	$this.show(true);
	$(document.body).css("overflow",v);
	jtiplist.push($this);
	if(closetime>0)jtiptimer=setTimeout(function(){jClosedTip();fn&&fn();},closetime);
        $(document).data("jtiptimer",jtiptimer);
        $(document).data("jtiplist",jtiplist);
	
}
function jClosedTip(){
        var jtiptimer=$(document).data("jtiptimer"),jtiplist=$(document).data("jtiplist")||[];
	if(jtiptimer)clearTimeout(jtiptimer);
	var p=null;
	while(p=jtiplist.pop()){
		p.remove();
	}
        $(document).data("jtiptimer",null);
        $(document).data("jtiplist",null);
}



