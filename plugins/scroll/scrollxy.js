/*
 * @Author:    xhjin
 * @CreateDate:  2014/01/04
 * @Desc: xy值滚动监听
 * 参数 
 */
(function ($) {
    //默认参考系以window为准
    function _scrollxy(element, options) {
        var that=this,opt=this.options = options;
        this.$elem = $(element);
        this.$parent = options.parent&&($(options.parent).get(0)!=window)?$(options.parent):$(window);
        //var offset = this.$elem.offset();
        //this.prevState = { "position": (this.$elem.css("position") || "static"), "left": offset.left, "top": offset.top, marginLeft: this.$elem.css("marginLeft"), marginTop: this.$elem.css("marginTop") };
        //this.position = this.prevState.position;
        _scrollxy.add(this);
    }
    _scrollxy.prototype = {
        constructor: _scrollxy,
        init:function(){

        },
        change: function (rect) {
            rect=rect||_scrollxy.get_rect(this.$parent);
        }
    }
    _scrollxy.get_rect=function($parent){
        var $body=$("body");
        return {
            left:$parent.scrollLeft(),top:$parent.scrollTop(),
            width:$parent.width(),height:$parent.height(),
            scrollHeight:$parent[0].scrollHeight||(($parent[0]==window)&&$body[0].scrollHeight)||0,
            scrollWidth:$parent[0].scrollWidth||(($parent[0]==window)&&$body[0].scrollWidth)||0
        }
    }
    _scrollxy.add=function(obj){
        //var scrollTop = this.$scrollElement.scrollTop()+this.options.offsetY;
        //var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight;
        var $parent=obj.$parent,list=$parent.data(opt.core+"-list")||[],self=this,$body=$("body");
        $.map(list,function(n){return (n==obj)?1:null;}).length||list.push(this);
        $parent.data(opt.core+"-list",list).off("."+opt.core);
        var process=function(that){//self
            var rect=self.get_rect($parent);
            if(that)return that.change.call(that,rect);
            for(var i=0,len=list.length;i<len;i++){
                list[i].change.call(list[i],rect);
            }
        };
        list.length&&$parent.on("scroll."+opt.core,process).on("resize."+opt.core,process);
        process(obj);//立即执行
    };
    //horizontal  vertical
    _scrollxy.options = {direction: "", core: "data-plug-scrollxy",parent:null};
    $.fn.scrollxy = function (options, cmd) {
        var _options = _scrollxy.options, _arguments = arguments;
        return this.each(function () {
            var $this = $(this), data = $this.data(_options.core);
            if (!data) $this.data(_options.core, (data = new _scrollxy(this, $.extend({}, _options))));
            if (typeof options == 'object') {
                $.extend(data.options, options);
                data["init"] && data.init();
            }
            if (typeof options == 'string' && data[options]) data[options].apply(data, [].slice.call(_arguments, 1));
            else if (typeof cmd == 'string' && data[cmd]) data[cmd].apply(data, [].slice.call(_arguments, 2));
        });
    }
    
})(jQuery);