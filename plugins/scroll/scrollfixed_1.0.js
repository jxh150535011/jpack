/*
 * @Author:    xhjin
 * @CreateDate:  2013/11/12
 * @Desc: 页面滚动 定格处理 默认参照物为body
 * 参数 x y为定位fixed坐标 无可不设
 * left top right bottom 为移动范围
 */
(function ($) {
    function _scrollfixed(element, options) {
        this.options = options;
        this.$elem = $(element);
        var offset = this.$elem.offset();
        this.prevState = { "position": (this.$elem.css("position") || "static"), "left": offset.left, "top": offset.top, marginLeft: this.$elem.css("marginLeft"), marginTop: this.$elem.css("marginTop") };
        this.position = this.prevState.position;
        this.offsetLeft = offset.left;
        this.offsetTop = offset.top;

        this.state = 0; 
        this.init();
        this.bind();
    }
    _scrollfixed.prototype = {
        constructor: _scrollfixed,
        isIE6: !$.support.html5Clone,//ie 6 返回false
        init: function () {
            var that = this, opt = this.options;
            var list = this.remove();
            if (opt.top < opt.bottom) this.y = opt.y;
            if (opt.left < opt.right) this.x = opt.x;
            if (this.x != null || this.y != null) this.state = 1;
            this.state && list.push(this);
            $(document).data(opt.core, list);
        },
        compare: function () {
            var opt = this.options;
            var list = $(document).data(opt.core) || [];
            var scrollLeft = $(document).scrollLeft(), scrollTop = $(document).scrollTop();
            for (var i = 0, len = list.length; i < len; i++) {
                var $this = list[i];
                $this.state ? $this.fixed(scrollLeft, scrollTop) : $this.remove();
            }
        },
        remove: function () {
            var that = this, opt = this.options;
            this.$elem.css(this.prevState);
            var list = $(document).data(opt.core) || [];
            list = $.map(list, function (n) { return (n == that) ? null : n; });
            $(document).data(opt.core, list);
            return list;
        },
        fixed: function (sleft, stop) {
            //,position=$this.position
            var that = this, opt = this.options, xposition, yposition, offsetLeft = sleft, offsetTop = stop, css = { left: this.x, top: this.y, marginLeft: 0, marginTop: 0 };
            if (this.x != null) {
                if (sleft > opt.left && sleft <= opt.right) xposition = "fixed";
                else if (sleft > opt.right) {
                    xposition = "absolute";
                    css.left = opt.right;
                }
            }

            if (this.y != null) {
                if (stop > opt.top && stop <= opt.bottom) yposition = "fixed";
                else if (stop > opt.bottom) {
                    yposition = "absolute";
                    css.top = opt.bottom;
                }
            }
            if (this.x == null) {
                xposition = yposition;
                css.left = this.offsetLeft - sleft;
            }
            else if (!xposition) css.left = this.offsetLeft;

            if (this.y == null) {
                yposition = xposition;
                css.top = this.offsetTop - stop;
            }
            else if (!yposition) css.top = this.offsetTop;

            if (xposition == "fixed" && yposition == "fixed" && !this.isIE6) {
                css.position = "fixed";
                this.$elem.css(css);
            }
            else if (xposition || yposition) {
                css.position = "absolute";
                if (xposition == "fixed") css.left += offsetLeft;
                //else if(xposition!="absolute")css.left=this.offsetLeft;
                if (yposition == "fixed") css.top += offsetTop;
                //else if(yposition!="absolute")css.top=this.offsetTop;
                if (this.timer) clearTimeout(this.timer);
                this.timer = setTimeout(function () {
                    //that.$elem.css("position",css.position);
                    that.$elem.css(css, 100);
                }, 200);
            }
            else {
                this.$elem.css(this.prevState);
                return;
            }
        },
        bind: function () {
            var opt = this.options;
            var that = this, scroll = function () {
                that.compare();
            }
            $(window).off("." + opt.core, scroll);
            $(window).on("scroll." + opt.core, scroll);
        }
    }
    _scrollfixed.options = { core: "data-plug-scrollfixed", x: null, y: null, left: 0, right: 10000000, top: 0, bottom: 10000000 };
    $.fn.scrollfixed = function (opts, cmd, params) {
        var _options = _scrollfixed.options, opts = opts || {};
        return this.each(function () {
            var $this = $(this), data = $this.data(_options.core), options;
            if (typeof opts == 'object') {
                options = $.extend({}, data ? data.options : _options, opts);
                if (data) data.options = options;
            }
            if (!data) $this.data(_options.core, (data = new _scrollfixed(this, options)));
            if (typeof opts == 'string' && data[opts]) data[opts].apply(data, cmd || []);
            else if (typeof cmd == 'string' && data[cmd]) data[cmd].apply(data, params || []);
        });
    }

    
})(jQuery);