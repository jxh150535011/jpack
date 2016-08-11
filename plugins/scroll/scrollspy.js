/*
 * @Author xhjin
 * @CreateDate  2013/11/11
 * @Desc  邮轮公共页面 插件等集合 seajs方式和$插件方法调用
 */
(function ($) {
    // SCROLLSPY CLASS DEFINITION
    // ==========================

    function _scrollspy(element, options) {
        var href,opt = this.options = options,that=this;
        this.$element = $(element);
        this.fn = function () { that.process(); };
        this.$body = $('body');
        this.$target = $(opt.target || this.$element.attr("data-target")||this.$element);
        this.$scrollElement = ((this.$target[0]==this.$element[0])?$(window):this.$element).on("scroll." + opt.core, $.proxy(this.process, this));

        this.selector = "a[href],a[data-target]";
        this.offsets = $([]);
        this.targets = $([]);
        this.activeTarget = null;
    }

    _scrollspy.prototype = {
        constructor: _scrollspy,
        init: function () {
            var offsetMethod = this.$scrollElement[0] == window ? 'offset' : 'position';
            this.offsets = $([]);
            this.targets = $([]);
            this.hrefs = this.$target.find(this.selector);
            var self = this;
            this.hrefs.map(function () {
                var $el = $(this);
                var href = $el.data('target') || $el.attr('href');
                var $href = /^#\w/.test(href) && $(href);
                return ($href
            && $href.length
            && [[$href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), $href]]) || null
            }).sort(function (a, b) {
                return a[0] - b[0];
            }).each(function () {
                self.offsets.push(this[0]);
                self.targets.push(this[1]);
            });

            this.process();
        },
        process: function () {
            //if(this.enable)return;
            var scrollTop = this.$scrollElement.scrollTop()+this.options.offsetY;
            var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight;
            var maxScroll = scrollHeight - this.$scrollElement.height();
            var offsets = this.offsets;
            var targets = this.targets;
            var activeTarget = this.activeTarget;
            var i;
            //if (scrollTop >= maxScroll) {
                //return activeTarget != (i = targets.last()[0]) && targets.length && this.activate(targets.length - 1);
            //}
            for (i = offsets.length; i--; ) {
                (activeTarget != targets[i].get(0)) && (scrollTop >= offsets[i]) && (!offsets[i + 1] || scrollTop <= offsets[i + 1]) && this.activate(targets[i].attr("id"));
            }
        },
        to: function (id,f) {
            if(!id)return;
            var that=this,opt=this.options,id="#"+id.replace(/^#/g,""),i=-1;
            //this.enable=true;
            this.hrefs.each(function(index){
                if($(this).attr("href")==id){i=index;return false;}
            });
            if(i>-1){
                this.$scrollElement.off("scroll." + opt.core, this.fn);
                setTimeout(function(){
                    that.activate(id.replace(/^#/g,""));
                    //that.enable=false;
                    f&&that.offsets[i]&&that.$scrollElement.scrollTop(that.offsets[i]);
                    that.$scrollElement.on("scroll." + opt.core, that.fn);
                },10);
            }
        },
        activate: function (id) {
            var opt = this.options;
            id=(id||"").replace(/^#/g,"");
            this.activeTarget = this.targets.filter("[id='"+id+"']").get(0);
            opt.onchange && opt.onchange.call(this, id, this.hrefs, this.targets);
            //$(this.selector).parents('.active').removeClass('active')
            //var selector = this.selector+ '[data-target="' + target + '"],'+ this.selector + '[href="' + target + '"]'
            //var active = $(selector).parents('li').addClass('active')
            //active.trigger('activate')
        }
    }
    _scrollspy.options = { core: "data-plug-scrollspy", offsetY: 10 };
    $.fn.scrollspy = function (opts, cmd) {
        var _options = _scrollspy.options, opts = opts || {},_arguments=arguments;
        return this.each(function () {
            var $this = $(this), data = $this.data(_options.core), options;
            if (typeof opts == 'object') {
                options = $.extend({}, data ? data.options : _options, opts);
                if (data) data.options = options;
            }
            if (!data) $this.data(_options.core, (data = new _scrollspy(this, options)));

            (typeof opts == 'object')&&data.init()

            if (typeof opts == 'string' && data[opts]) data[opts].apply(data, [].slice.call(_arguments, 1));
            else if (typeof cmd == 'string' && data[cmd]) data[cmd].apply(data, [].slice.call(_arguments, 2));
        });
    }
})(jQuery);
