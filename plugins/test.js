!function ($) {
  "use strict"; // jshint ;
  var fixedModal = function (content, options) {
    var that=this;
    this.options = options
    this.$element = $(content);
    this._plugid=this.options.CODENAME+Math.round(Math.random()*100000);
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
    
    if($.browser.msie&&$.browser.version=="6.0"){
      this.$body.css("position","absolute");
      if(this.$backdrop)this.$backdrop.css("position","absolute");
    }
    if(options.parent&&options.parent!=window){
      if(!this.$parent.css("position"))this.$parent.css("position","relative");
      this.$body.css("position","absolute");
      if(this.$backdrop)this.$backdrop.css("position","absolute");
    }
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
          var wh=that.$parent.data("wh"+that._plugid),w=that.$parent.width(),h=that.$parent.height();
          if((!wh)||wh.width!=w||wh.height!=h){
            wh={width:w,height:h};
            that.$parent.data("wh"+that._plugid);
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
          _res.fwidth=wh.width;
          _res.fheight=wh.height;
          return _res;
        }
        function _xformat(str){
          if(!res)res=_getrect();
          var auto=opt.left,center=res.xcenter,left=res.xleft,right=res.xright;
          var fwidth=res.fwidth,fheight=res.fheight;
          return eval(str);
        }
        function _yformat(str){
          if(!res)res=_getrect();
          var auto=opt.top,center=res.ycenter,top=res.ytop,bottom=res.ybottom;
          var fwidth=res.fwidth,fheight=res.fheight;
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
        var eventN=opt.CODENAME+this._plugid;
        $($parent).off("."+eventN);

        if(that.resizeTimer)clearTimeout(that.resizeTimer);
        if(!that.isshow)return;
        if(that.$body.css("position")=="absolute"){//If absolute positioning need to add scroll event
          $($parent).on("scroll."+eventN,function(e){
            that.fixed(e);
          });
        }
        //window non-IE is $ parent non-window effect can not take effect TBD
        if($.browser.msie||$parent==window){//If IE can bind resize event 
          $($parent).on("resize."+eventN,function(){
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
    CODENAME:"data-plug-fixed"
    ,backdrop: false
    ,animate:true
    ,xalign: "auto"
    ,yalign: "auto"
    ,zindex:10000
    ,left:0
    ,top:0
    ,mark:"fixed:div"
  }

  $.fn.fixedmodal.Constructor = fixedModal;
}(window.jQuery);