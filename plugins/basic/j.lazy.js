/*
* @Author:    xhjin
* @CreateDate:  2014/01/17
* @Desc:延迟加载 整合图片 以及 延迟加载class
*/
(function ($) {
    function _image(element, options) {
        var opt = this.options = options;
        this.$elem = $(element);
        this.isimage = this.$elem.is('img');
        this.$image = this.isimage ? this.$elem : $("<img border='0'></img>").appendTo(this.$elem.empty());
        this.link = opt.link || this.$elem.data("link");
        if (this.link) {
            this.$image.wrap("<a href='javascript:;' target='" + (this.$elem.attr("target") || "_blank") + "'></a>");
            this.$a = this.$image.parent();
        }
        this._slope = null;
        if (opt.cliptype) {
            opt.width = opt.width || this.$elem.width();
            opt.height = opt.height || this.$elem.height();
            if (this.isimage) {
                this.$body = $("<div style='display:block;overflow:hidden;'/>").css({ width: opt.width, height: opt.height });
                if (this.$a) {
                    this.$a.wrap(this.$body);
                    this.$body = this.$a.parent();
                }
                else {
                    this.$elem.wrap(this.$body);
                    this.$body = this.$elem.parent();
                }
            }
            else {
                this.$body = this.$elem.css({ "display": "block", "overflow": "hidden" });
            }
            if (!(opt.width || opt.height)) return;
            if (!(opt.minWidth <= opt.width)) opt.minWidth = opt.width;
            if (!(opt.minHeight <= opt.height)) opt.minHeight = opt.height;
            if (!opt.slope) this._slope = { k1: opt.minWidth / opt.height, k2: opt.width / opt.height, k3: opt.width / opt.minHeight };
            else this._slope = opt.slope;
        }
    }
    _image.prototype = {
        constructor: _image,
        init: function () {
            var that = this, opt = this.options;
            this.complete = true;
            this.src = opt.src || this.$elem.attr("lazy-src") || this.$elem.attr("data-src") || this.$elem.attr("src");
            if (this.src != this._src) {
                this.complete = false;
                this._src = this.src;
                if (this.link) this.$a.attr("href", (this.link === true ? this._src : this.link));
            }
            this.load();
        },
        load: function () {
            var that = this, opt = this.options;
            if (this.complete) return;
            this.loaded(this._src, function (width, height, f) {
                if (!f) that._src = "";
                else that.show(width, height);
                return opt.onloaded && opt.onloaded.call(that, width, height, f);
            });
        },
        loaded: function (src, fn) {
            var that = this, opt = this.options;
            if(!opt.cliptype){//非剪裁模式 则直接采用$Image加载
                this.$image.on("load."+opt.core,function(){
                    $(this).off("."+opt.core);fn && fn(this.width, this.height, true);
                }).on("error."+opt.core,function(){
                    $(this).off("."+opt.core);fn && fn(this.width, this.height, false);
                });
                this.$image.attr("src",src);
            }
            else{
                var _img = new Image();
                _img.onload = _img.onreadystatechange = function () {
                    if (_img && _img.readyState && _img.readyState != 'loaded' && _img.readyState != 'complete') return fn && fn(0, 0, false);
                    _img.onload = _img.onreadystatechange = _img.onerror = null;
                    return fn && fn(_img.width, _img.height, true);
                }
                _img.onerror = function () {
                    _img.onload = _img.onreadystatechange = _img.onerror = null;
                    return fn && fn(0, 0, false);
                }
                _img.src = src;
            }

        },
        rect: function (width, height) {
            var that = this, opt = this.options;
            if (opt.cliptype && this._slope) {//切割模式
                var rect = { width: width, height: height, left: 0, top: 0, imageWidth: width, imageHeight: height }; //记录切割样式
                var k = width / height;
                var worh = true; //true 宽度为基准
                if (k < this._slope.k1 && opt.cliptype == "filler") worh = false;
                else if (k < this._slope.k1) worh = true;

                else if (k < this._slope.k2 && opt.cliptype == "cut") worh = true;
                else if (k < this._slope.k2) worh = false;

                else if (k < this._slope.k3 && opt.cliptype == "cut") worh = false;
                else if (k < this._slope.k3) worh = true;
                else if (opt.cliptype == "filler") worh = true;
                else worh = false;
                if (worh) {
                    if (width > opt.width && opt.compress) {
                        rect.width = opt.width;
                        rect.height = rect.width / k;
                    }
                    else if (width < opt.minWidth && opt.stretch) {
                        rect.width = opt.minWidth;
                        rect.height = rect.width / k;
                    }
                }
                else {
                    if (height > opt.height && opt.compress) {
                        rect.height = opt.height;
                        rect.width = rect.height * k;
                    }
                    else if (height < opt.minHeight && opt.stretch) {
                        rect.height = opt.minHeight;
                        rect.width = rect.height * k;
                    }
                }
                rect.scale = rect.width / width; //压缩比
                //stretch  是否拉伸 compress 是否压缩
                rect.bodyWidth = rect.width;
                if (rect.width < opt.minWidth) { rect.left = opt.minWidth - rect.width; rect.bodyWidth = opt.minWidth; }
                else if (rect.width > opt.width) { rect.left = opt.width - rect.width; rect.bodyWidth = opt.width; }
                rect.left /= 2;
                rect.bodyHeight = rect.height;
                if (rect.height < opt.minHeight) { rect.top = opt.minHeight - rect.height; rect.bodyHeight = opt.minHeight; }
                else if (rect.height > opt.height) { rect.top = opt.height - rect.height; rect.bodyHeight = opt.height; }
                rect.top /= 2;
                return rect;
            }
            return { width: width, height: height, left: 0, top: 0, bodyWidth: width, bodyHeight: height, scale: 1, imageWidth: width, imageHeight: height };
        },
        show: function (width, height) {
            var opt = this.options;
            if (opt.cliptype) {
                this.$image.attr("src", this._src);
                var rect = this.rect(width, height);
                this.$image.css({ width: rect.width, height: rect.height, marginLeft: rect.left, marginTop: rect.top });
                this.$body.width(rect.bodyWidth).height(rect.bodyHeight);
            }
            this.$elem.data(opt.core, null);
        }
    }
    _image.options = { core: "data-plug-image", width: 0, height: 0, minWidth: 1000000, minHeight: 1000000, cliptype: null, link: false, compress: true, stretch: false };
    $.fn.image = function (options, cmd) {
        var _options = _image.options, _arguments = arguments;
        return this.each(function () {
            var $this = $(this), data = $this.data(_options.core);
            if (!data) $this.data(_options.core, (data = new _image(this, $.extend({}, _options))));
            if (typeof options == 'object') {
                $.extend(data.options, options);
                data["init"] && data.init();
            }
            if (typeof options == 'string' && data[options]) data[options].apply(data, [].slice.call(_arguments, 1));
            else if (typeof cmd == 'string' && data[cmd]) data[cmd].apply(data, [].slice.call(_arguments, 2));
        });
    }
    function _lazy(element, options) {
        var opt = this.options = options;
        this.$elem = $(element);
        this.list = []; //target
        this.worklist = [];
    }
    _lazy.add = function (that) {
        var opt = that.options, $parent = that.$parent, list = $parent.data(opt.core + "-list") || [], self = this;
        $.map(list, function (n) { return (n == that) ? 1 : null; }).length || list.push(that);
        $parent.data(opt.core + "-list", list).off("." + opt.core);
        var process = function () {//self
            for (var i = 0, len = list.length; i < len; i++) {
                list[i].refresh.call(list[i], false);
            }
        };
        list.length && $parent.on("scroll." + opt.core, process).on("resize." + opt.core, process);
    };
    _lazy.remove = function (that) {
        var opt = that.options, $parent = that.$parent, list = $parent.data(opt.core + "-list") || [], self = this;
        if (!$.map(list, function (n) { return (n == that) ? null : 1; }).length)
            $parent.data(opt.core + "-list", list).off("." + opt.core);
    },
    _lazy.prototype = {
        constructor: _lazy,
        init: function () {
            var that = this, opt = this.options;
            this.$elem.find("[" + opt.imageName + "],[" + opt.className + "]").each(function () {
                var $this = $(this);
                if ($this.attr("data-lazy-disabled")) return true;
                $this.attr("data-lazy-disabled", true); //已经读取
                that.list.push({ target: $this, errors: 0, className: $this.attr(opt.className), imageName: $this.attr(opt.imageName) });
            });
            this.$parent = $(opt.parent || window);
            this.offsetMethod = this.$parent[0] == window ? 'offset' : 'position';
            this.queue = 0;
            this.refresh();
            if (this.list.length) _lazy.add(this);
            else this.dispose();
        },
        dispose: function () {
            _lazy.remove(this);
        },
        refresh: function (update) {//重新计算坐标值 并且更新
            var that = this, opt = this.options;
            if (update !== false) {
                for (var i = 0, len = this.list.length; i < len; i++) {
                    var data = this.list[i], pos = data.target[this.offsetMethod]();
                    data.left = pos.left; data.top = pos.top;
                    data.right = pos.left + data.target.width(); data.bottom = pos.top + data.target.height();
                };
            }
            if (this._refresh_timer) clearTimeout(this._refresh_timer);
            this._refresh_timer = setTimeout(function () {
                that.process();
            }, 150);
        },
        check: function (data, rect) {
            return (((data.top > rect.top && data.top < rect.bottom) || (data.bottom > rect.top && data.bottom < rect.bottom))
            && ((data.left > rect.left && data.left < rect.right) || (data.right > rect.left && data.right < rect.right)));
        },
        process: function () {
            //队列不清零处理 this.queue=0;防止上次正在进行中加载完成后将队列扩大 
            this.list = this.list.concat(this.worklist); //将上次未进入的加载队列 重新拼接到容器
            if (!this.list.length) return this.dispose();
            this.worklist = [];
            var rect = this.containerRect();
            for (var i = this.list.length - 1; i > -1; i--) {
                if (this.check(this.list[i], rect)) {//根据当前计算的值进行加载 有可能目标元素在加载中位置发生变化，但是已经计入加载过程
                    this.worklist.unshift(this.list[i]);
                    this.list.splice(i, 1);
                }
            };
            this.load();
        },
        load: function () {
            var opt = this.options;
            var p;
            while ((this.queue < opt.queue) && (p = this.worklist.shift())) {
                this.loading(p);
            }
        },
        loading: function (data) {
            this.queue++;
            var that = this;
            if (data.className) data.target.addClass(data.className);
            data.className = null;
            if (data.imageName) {
                data.target.image({ src: data.imageName, onloaded: function (width, height, f) {
                    if (f) data.imageName = null; //加载成功 去掉imageName
                    that.loaded(data, f);
                } 
                });
            }
            else that.loaded(data, true);
        },
        loaded: function (data, f) {
            var that = this;
            this.queue--; //加载完成队列减1
            if (!f && (data.errors++) <= this.options.errors)//发生错误
                this.worklist.push(data); //回炉重新加载
            setTimeout(function () {
                that.load();
            }, 1);
            //return this.load();
        },
        containerRect: function () {
            var t = this.$parent.scrollTop(), l = this.$parent.scrollLeft();
            return { top: t, left: l, right: (l + this.$parent.width()), bottom: (t + this.$parent.height()) };
        }
    }
    _lazy.options = { parent: null, imageName: "data-src", className: "data-class", core: "data-plug-lazy", errors: 1, queue: 1 }; //errors 允许错误次数
    $.fn.lazy = function (options, cmd) {
        var _options = _lazy.options, _arguments = arguments;
        return this.each(function () {
            var $this = $(this), data = $this.data(_options.core);
            if (!data) $this.data(_options.core, (data = new _lazy(this, $.extend({}, _options))));
            if (typeof options == 'object') {
                $.extend(data.options, options);
                data["init"] && data.init();
            }
            if (typeof options == 'string' && data[options]) data[options].apply(data, [].slice.call(_arguments, 1));
            else if (typeof cmd == 'string' && data[cmd]) data[cmd].apply(data, [].slice.call(_arguments, 2));
        });
    }
    $.lazy = function (options, cmd) { $(window).lazy(options, cmd) };

})(jQuery);