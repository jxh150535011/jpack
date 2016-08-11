/*
 * @Author:    xhjin
 * @CreateDate:  2013/11/12
 * @Desc: 下拉 
 * 初始化后 有则存在$head $body $item
 */
(function ($) {
    // ==========================
    function _ddl(element, options) {
        this.options = options;
        this.$elem = $(element);
        this.key="";
    }
    _ddl.prototype = {
        constructor: _ddl,
        init: function () {
            var that = this, opt = this.options,$target=this.$elem.attr("data-target")||opt.target;
            opt.type=opt.type||this.$elem.attr("data-type");
            if($target){//data-target 看成另外一种模式(暂定)
                that.$head = that.$elem;
                that.$body=$($target);
                that.$item=that.$body.children();
            }
            else{
                that.$head = that.$elem.find("[" + opt.core + "='" + opt.head + "']");
                if(!that.$head.length)that.$head=that.$elem.children().eq(0);

                that.$body = that.$elem.find("[" + opt.core + "='" + opt.body + "']");
                if(!that.$body.length)that.$body=that.$elem.children().eq(1);

                that.$item = that.$elem.find("[" + opt.core + "='" + opt.item + "']");
                if(!that.$item.length)that.$item=that.$body.children();
            }
            that.event();
        },
        change:function(key,isc){
            var opt=this.options;
            if(isc)opt.onchange&&opt.onchange.call(this,key,isc);
            if(key=="open")opt.onopen&&opt.onopen.call(this);
            else opt.onhide&&opt.onhide.call(this);
        },
        shut:function(){
            return this.change("shut",(this.key!="shut")&&(this.key="shut"));
        },
        docclick:function($target){//文档被点击 返回true 继续存在事件队列中 返回null 移除队列
            var that=this,opt=this.options;
            if((opt.onbodyclick&&opt.onbodyclick()) !== false){//hide bodyclick 返回false 则不关闭
                if(this.$head.get(0)==$target.get(0)||$.contains(this.$head.get(0),$target.get(0)))return this;
                that.$elem.triggerHandler("switch." + opt.core, ["shut"]);
                return null;
            }
            return this;
        },
        regdocclick:function(isadd){
            var that=this,opt=this.options;
            var elist=$.map(($(document).data(opt.core)||[]),function(n){
                return (n==that)?null:n;
            });
            isadd&&elist.push(that);
            $(document).off("click."+opt.core).data(opt.core,elist);
            if(!elist.length)return;

            $(document).on("click." + opt.core, function (event) {
                var _elist=$.map(($(document).data(opt.core)||[]),function(n){
                    return n.docclick($(event.target));
                });
                $(document).data(opt.core,_elist);
                if(!_elist.length)$(document).off("click."+opt.core);
            });
        },
        event: function () {
            var that = this, opt = this.options;
            that.$elem.off("." + opt.core).on("switch." + opt.core, function (event, key) {
                if (that.timer) clearTimeout(that.timer);
                if (that.key==key) return that.change(key,false);
                if (key == "open") { that.key = key; that.change(key,true); }
                else {
                    that.timer = setTimeout(function () {
                        that.key = key;
                        that.change(key,true);
                    }, 100);
                }
            });
            if (opt.type == "hover") {
                that.$body.add(that.$head).mouseenter(function () {
                    that.$elem.triggerHandler("switch." + opt.core, ["open"]);
                }).mouseleave(function () {
                    that.$elem.triggerHandler("switch." + opt.core, ["shut"]);
                });
            }
            else{
                that.$head.off("." + that.core).on("click." + that.core, function () {
                    that.$elem.triggerHandler("switch." + opt.core, ["open"]);
                    that.regdocclick(true);//注册doc 事件
                });
            }
            if(opt.key)that.$elem.triggerHandler("switch." + opt.core, [opt.key]);
        }
    }
    _ddl.options = {core: "data-plug-ddl", head: "head", body: "body", item: "item", type: "hover", key: "shut" };
    $.fn.ddl = function (options, cmd) {
        var _options = _ddl.options, _arguments = arguments;
        return this.each(function () {
            var $this = $(this), data = $this.data(_options.core);
            if (!data) $this.data(_options.core, (data = new _ddl(this, $.extend({}, _options))));
            if (typeof options == 'object') {
                $.extend(data.options, options);
                data["init"] && data.init();
            }
            if (typeof options == 'string' && data[options]) data[options].apply(data, [].slice.call(_arguments, 1));
            else if (typeof cmd == 'string' && data[cmd]) data[cmd].apply(data, [].slice.call(_arguments, 2));
        });
    }
})(jQuery);