/* =========================================================
 *Write：金兴亨
 *Date: 2012-12-12
 *Description:formHandle 前端表单
 *版本2.0 支持异步验证 自动发起表单提交
 *优化绑定方式
 *u 2013-05-20 13:51
 * ========================================================= */

!function ($) {

    "use strict"; // jshint ;_;
    /* FORMHANDLE CLASS DEFINITION
    * ====================== */
    var formHandle = function (content, options) {
        this.document = $(content);
        this.options = options;
        this.init();
    }
    formHandle.prototype = {
        constructor: formHandle,
        init: function () {
            var that = this;
            that.verifykeys = {}; //验证规则集合
            that.forms = {}; //提交表单集合
            this.input=$("<div style='width:1px;height:1px;display:block;overflow:hidden;'><input type='text' /></div>");
            this.getEvent = (function () {
                if (document.all) return window.event; //如果是ie
                var func = getEvent.caller;
                while (func != null) {
                    var arg0 = func.arguments[0];
                    if (!arg0) func = func.caller;
                    if ((arg0.constructor == Event || arg0.constructor == MouseEvent) || (typeof (arg0) == "object" && arg0.preventDefault && arg0.stopPropagation))
                        return arg0;
                }
                return null;
            });
            this.srcElement = (function (e, obj) {
                var evt = e || that.getEvent();
                var type = evt.type;
                if (!obj) obj = $(evt.srcElement || evt.target);
                var isLines = obj.get(0).nodeName && obj.get(0).nodeName.toLowerCase() == "textarea"; //是否为多行
                var verifykey = obj.attr("verifykey");
                var isverify = obj.filter("[verifykey]").length > 0&&this.verifykeys[verifykey];
                return { target: obj, isLines: isLines, isverify: isverify, verifykey: verifykey, _v: "", eventType: type }; //_v为新增加字符
            });
            that.event(); //进行事件绑定
        },
        setData:function(data){
            var d=data||this.options.data||{};
            var that=this;
            var verifys=$("[verifykey]");
            for(var k in d){
                verifys.filter("[verifykey='"+k+"']").each(function(){
                    that.setValue($(this).get(0),d[k]);
                });
            }
        },
        event: function () {
            var that = this, doc = this.document, opt = this.options, vks = that.verifykeys;
            $(doc).off(".formhandle").on("keydown.formhandle", function (e) {
                var $inputs = $("input[type='text'],textarea,select");
                var srcData = that.srcElement(e);
                if (e.which == 13 && !srcData.isLines) {
                    var index = $inputs.index(srcData.target);
                    if (index < ($inputs.length - 1)) {
                        $inputs.eq(index + 1).focus();
                        return false;
                    }
                    //e.keyCode = 9;
                    return true;
                }
                return true;
            }).on("keypress.formhandle", function (e) {//keypress e.which 才是正常的
                var srcData = that.srcElement(e); //火狐会触发此事件 IE 以及 GOOGLE均不触发
                if (!srcData.isverify) return true;
                var vk = vks[srcData.verifykey];
                if (vk.isNum) {//格式化控制
                    if ($.browser.msie || true) {//ie下正常 非ie下 权宜之计
                        var k = that.numberCharCode(e); //返回空 就直接结束信息
                        if (k == opt.defaultPassWord) return true;
                        if (k == opt.defaultWord) return false;
                        var rex = new RegExp(vk.isNum == true ? "[0-9\\.\\+\\-]" : vk.isNum, "g");
                        if (!rex.test(k)) return false;
                        srcData._v = k; //新增加字符
                        //if (s.length == 1) is = true; //保证一个字符被验证通过
                        return vk.numVerify ? that.tryverify(srcData, vk).rex : true;
                    }
                    else {//非ie 无法判断输入法状态 所以都走步骤先
                        that.numVerifyReplace(srcData, vk);
                    }
                }
            }).on("dragenter.formhandle", function (e) {
                var srcData = that.srcElement(e); if (!srcData.isverify) return true;
                var vk = vks[srcData.verifykey];
                if (!vk.isNum) return true;
                return false;
            }).on("keyup.formhandle", function (e) {
                var srcData = that.srcElement(e); if (!srcData.isverify) return true;
                var vk = vks[srcData.verifykey];
                if (!(vk.isNum && vk.numVerify)) {//数字模式 则不触发这段代码
                    return that.tryverify(srcData, vk).rex; //内部集成日期判断
                }
                return true;
            }).on("mousedown.formhandle", function (e) {//已经这里初始化
                var srcData = that.srcElement(e); if (!srcData.isverify) return true;
                var vk = vks[srcData.verifykey];
                if (vk.isNum)
                    that.eventNumberBox($(srcData.target), vk);
                else
                    that.eventStringBox($(srcData.target), vk);
            })
            //form表单提交是否进行验证
            $("form", doc).off(".formhandle").on("submit.formhandle", function (e, t) {
                var returnV = true, opt = that.options, rex;
                if (t === true) {//立即发起表单提交
                    //alert("表单提交");
                    return true;
                }
                that.asyncsubmit($(this), e); //发起异步提交
                return false;
            });
        },
        beforeverifying: function (post_timer) {
            var that = this, opt = this.options, rex = true;
            var d = this.forms[post_timer]; if (!d) return;
            if (opt.beforesubmit) rex = opt.beforesubmit.call(that, d);
            if (opt.nextverify == false && rex == false) return;
            if (!opt.asyncbeforesubmit) return this.verifying(post_timer);
            opt.asyncbeforesubmit.call(that, d, function (r) {
                if (opt.nextverify == false && r == false) return;
                that.verifying(post_timer);
            });
        },
        afterverifying: function (post_timer) {
            var that = this, opt = this.options, rex;
            var d = this.forms[post_timer]; if (!d) return;
            if (opt.aftersubmit) rex = opt.aftersubmit.call(that, d);
            if (rex == false) return;
            if (!opt.asyncaftersubmit) return d.form.triggerHandler("submit", [true]);
            opt.asyncaftersubmit.call(that, d, function (r) {
                if (r == false) return;
                d.timer = false;
                d.from.triggerHandler("submit", [true]);
                setTimeout(function () { delete that.forms[post_timer]; }, 1);
            });
        },
        verifying: function (post_timer) {
            var that = this, opt = this.options, rex = true, vks = this.verifykeys;
            var d = this.forms[post_timer]; if (!d) return;
            var async = d.async;
            function _verifying() {
                if (async == null || async.length < 1) {
                    if (opt.nextverify || rex) that.afterverifying(post_timer);
                    return;
                }
                var srcData = async.shift();
                var vk = vks[srcData.verifykey];
                that.tryverify(srcData, vk, function (f) {
                    if (f == false && vk.nextverify == false) {
                        async.length = []; //清空
                        rex = false;
                    }
                    _verifying();
                });
            }
            _verifying();
        },
        asyncsubmit: function (form, e) {//表单提交
            var that = this; var _post_timer = (new Date()).getTime();
            for (var k in that.forms) {
                if (that.forms[k].form == form) that.forms[k].timer = false;
            }
            if (!that.forms[_post_timer]) that.forms[_post_timer] = { form: form, timer: true, async: null };
            var async = [],d={};
            $("[verifykey]", form).each(function () {
                var srcData = that.srcElement(e, $(this)); 
                if (srcData.isverify) async.push(srcData);
                var n=$(this).attr("name")||srcData.verifykey;
                var v=that.getValue(srcData.target);
                if(v!=null)d[n]=(d[n]!=null)?(d[n]+','+v):v;
            });
            that.forms[_post_timer].async = async;
            that.forms[_post_timer].data=d;
            that.beforeverifying(_post_timer);
        },
        addverifykey: function (controls, option) {//controls控件集合
            var that = this, opt = this.options, vks = that.verifykeys
        , defaultoption = $.extend({}, opt.paramsdefaults, option), isvk = {};
            return controls.each(function () {
                var vk = $(this).attr("verifykey") || "";
                if (!isvk[vk]) {//如果当前vk已经进行过赋值 则直接跳过
                    if (!vks[vk]) isvk[vk] = vks[vk] = defaultoption;
                    else isvk[vk] = vks[vk] = $.extend({}, vks[vk], option);
                }
                var vkopt = isvk[vk];
                if (vkopt.isNum) that.eventNumberBox($(this), vkopt);
                else that.eventStringBox($(this), vkopt);
            });
        },
        tryverify: function (srcData, verify, fn) {//尝试验证 看是否符合要求
            var that = this, opt = this.options;
            if(!verify){
                fn && fn(true);
                return {min:true,max:true,rex:true};//key值不存在 表示不需要进行验证
            }
            try {
                var v = that.insertValue(srcData, srcData._v); //增加字符
                srcData.value = v;
                var verifycache = $(srcData.target).data("__verifycache");
                var evt=srcData.eventType;//事件类型
                if (!verifycache) $(srcData.target).data("__verifycache", verifycache = {});
                var cache=verifycache[v];if(!cache)cache=verifycache[v]={test:{min:false,max:false,rex:false},loading:false,complete:false};
                if (verify.cache && cache.complete) {
                    srcData.test = cache.test;
                    //return srcData.test;
                }
                else srcData.test = that.testValue(v, verify); //true通过 false 截止

                //if(verify.rexRl=="email"){
                //  alert(v+"*"+srcData.test.rex);
                //}
                //if(srcData.eventType=="blur"||srcData.eventType=="submit")
                //alert(verify.cache);
                if (verify.reback) {
                    var rex = verify.reback.call(that, srcData);
                    srcData.test.rex = (rex == null ? srcData.test.rex : rex);
                }
                if (verify.asyncreback) {//异步 不大一样。异步当前值 只可能被触发一次 
                    verify.asyncreback.call(that, srcData, cache, function (flag) {
                        //srcData.test.rex 只是变量 如果已经complete之前的src.Data.test依然没变 所以一下必须采用verifycache[v]判断
                        if (verifycache[v] == null || (verifycache[v].complete&&verifycache[v].test.rex==flag)) {//如果为null 或则  已经有缓存并且对应的异步值相同 则停止这次处理
                            return; //第2次结果抛弃
                        }
                        //alert(verifycache[v].complete+"*"+srcData.test.rex+"*"+flag+"返回值");
                        srcData.test.rex=flag;//srcData 虽然发生在异步之前的值，但是能进入到这里 认定其值有意义
                        //完成
                        fn && fn(srcData.test.rex);
                        if (!verify.cache) {
                          delete verifycache[v];
                          return;
                        }
                        cache.test=srcData.test;cache.loading = false;cache.complete=true;
                    });
                    cache.loading = true;
                }
                else {
                  //完成
                  fn && fn(srcData.test.rex);
                  if (!verify.cache) {
                    delete verifycache[v];
                    return;
                  }
                  cache.test=srcData.test;cache.loading = false;cache.complete=true;
                }

                return srcData.test;
            }
            catch (e) {
                return {min:false,max:false,rex:false};
            }
        },
        getClipboardData:function(){
            if (window.clipboardData) return window.clipboardData.getData("Text");
            else if (window.netscape){
                try {netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");}
                catch (e) {return ""}
            }
            return "";
        },
        eventNumberBox: function (target, verify) {//数字字符串 黏贴等格式判断
            var that = this;
            if (!verify.isNum || target.data("hasBind")) return; //非数字 或已绑定 则直接跳出循环
            target.data("hasBind", true).css({ imeMode: "disabled" }).off(".formhandle").on($.browser.msie?"beforepaste.formhandle":"paste.formhandle", function (e) {
                var srcData = that.srcElement(e); if (!srcData.isverify) return false;
                var t=this;
                var ipd=$(t).data("data-input");
                if(!(ipd&&ipd.get(0)))$(t).data("data-input",(ipd=that.input.clone()));
                var ip=ipd.children().eq(0);
                $(this).parent().append(ipd);
                var pos=that.getCursortSelectPos(t);ip.val("").focus();ip.data("pos",pos);
                setTimeout(function(){
                    var v=that.getValue(t);if(!ipd)return;t.focus();
                    var _v=that.insertValue(srcData,ip.val(),ip.data("pos"));
                    ipd.remove();that.setValue(t,_v);srcData._v="";
                    //alert(_v+"*"+that.tryverify(srcData, verify).rex);
                    if(that.tryverify(srcData, verify).rex)that.setValue(t,_v);
                    else that.setValue(t,v);
                },10);
                //var pastev = that.getClipboardData();
                //srcData._v = pastev;
                //return that.tryverify(srcData, verify).rex;
            }).on("dragenter.formhandle", function (e) {
                return false;
            }).on("blur.formhandle", function (e) {
                var srcData = that.srcElement(e); if (!srcData.isverify) return false;
                srcData.eventType = "blur";
                that.triggerVerify(srcData,verify,"focus");
                //return that.tryverify(srcData,verify).rex;
            }).on("focus.formhandle", function (e) {
                var srcData = that.srcElement(e); if (!srcData.isverify) return false;
                srcData.eventType = "focus";
                that.triggerVerify(srcData,verify,"focus");
                //return that.tryverify(srcData,verify).rex;
            });;
        },
        numVerifyReplace: function (srcData, verify) {
            if (!verify.isNum) return true;
            var that = this;
            var target = srcData.target;
            setTimeout(function () {
                var v = that.getValue(target);
                var rex = new RegExp(verify.isNum == true ? "[^0-9.+-]" : verify.isNum.replace("[", "[^"), "g");
                var v1 = v.replace(rex, "");
                //alert(v1+"*"+v);
                if (v1 != v) that.setValue(target, v1);
            }, 100);
        },
        eventStringBox: function (target, verify) {//普通字符串 格式判定
            var that = this;
            if (verify.isNum || target.data("hasBind")) return; //数字 或已绑定 则直接跳出循环
            target.data("hasBind", true).off(".formhandle").on("blur.formhandle", function (e) {
                var srcData = that.srcElement(e); if (!srcData.isverify) return false;
                that.triggerVerify(srcData,verify,"blur");
            }).on("focus.formhandle", function (e) {
                var srcData = that.srcElement(e); if (!srcData.isverify) return false;
                that.triggerVerify(srcData,verify,"focus");
            })
        },
        numberCharCode: function (e) {//允许数字 字母
            var that = this, opt = this.options;
            //65-90 97-122
            if (e.which == 45 || e.which == 43)
                return String.fromCharCode(e.which);
            if (e.which == 46)
                return String.fromCharCode(e.which);
            else if (e.which == 0 || e.which == 8)
                return opt.defaultPassWord;
            else if ((
        (e.which >= 190 && e.which <= 190) ||
        (e.which >= 48 && e.which <= 57) || (e.which >= 65 && e.which <= 90) || (e.which >= 97 && e.which <= 122)) && e.ctrlKey == false && e.shiftKey == false)
                return String.fromCharCode(e.which);
            else if (e.ctrlKey == true && (e.which == 99 || e.which == 118))
                return String.fromCharCode(e.which);
            else return opt.defaultWord;
        },
        triggerVerify:function(sd,verify,type){
            var that=this,timer=$(sd.target).data("verifyTimer");
            if(timer)return;
            timer=setTimeout(function(){
                $(sd.target).data("verifyTimer",null);
            },10);
            $(sd.target).data("verifyTimer",timer);
            that.tryverify(sd, verify).rex;
        },
        getValue: function (target) {
            var _o=$(target);
            var s="",_t=_o.attr("type");
            if(/^(span|div|label)$/gi.test(_o.get(0).nodeName))s= _o.text();
            else if((_t=="radio"||_t=="checkbox"))return _o.attr("checked")?_o.val():null;
            else s=_o.val();
            return s&&s.replace(/^[\s]*|[\s]*$/, ""); //去除2边空格;
        },
        setValue: function (target, v) {
            var _o=$(target);
            var s="",_t=_o.attr("type");
            if(/^(span|div|label)$/gi.test(_o.get(0).nodeName))_o.text(v||"");
            else if(_t=="radio"||_t=="checkbox"){
                return (v!=null&&_o.val()==v)?_o.attr("checked",true):_o.attr("checked",false);
            }
            else _o.val(v||"");
        },
        testValue: function (v, verify) {//检查格式是否符合标准
            //内部集成日期判断
            var result = { min: false, max: false, rex: false }, that = this;
            var opt = this.options;
            if (v.length < verify.minLength) return result; //小于最小长度
            else if (v.length > verify.maxLength) return { min: true, max: false, rex: false }; //大于最大长度
            else if (v.length < 1) return { min: true, max: true, rex: true }; //当字符长度符合标准，同时又为空 则不需要进行正则表达判断
            if (!verify.rexRl) return true; //正则表达式为空值或则null 则不进行运算
            var rexRl = opt.rexRls[verify.rexRl];
            if (!rexRl)//如果内部不存在此正则表达式则认定 给定为正则表达式
                rexRl = verify.rexRl;
            var is = (new RegExp(rexRl, "gi")).test(v);
            if (is && (verify.rexRl == "date" || verify.rexRl == "datetime"))
                return { min: true, max: true, rex: that.isDateTime(v) };
            else if (is && verify.rexRl == "idcard")
                return { min: true, max: true, rex: that.isIDCard(v) };
            return { min: true, max: true, rex: is }; //返回结果集
        },
        insertValue: function (srcData,pastev,pos) {//给目标增加具体的值
            var target = srcData.target, v = this.getValue(target);
            if (!pastev) return v;
            var p = pos||this.getCursortSelectPos(target.get(0))||[v.length, v.length];
            return v.substring(0, p[0]) + pastev + v.substring(p[1]);
        },
        getCursortSelectPos: function (target) {
            var CaretPos = [0, 0]; // IE Support
            if (!target) return CaretPos;
            try {
                if (document.selection) {
                    var Sel = document.selection.createRange();
                    CaretPos[0] = Sel.text.length;
                    Sel.moveStart('character', -target.value.length); //往回进行选择，最后只会选择到0为止。那么总共的长度就是下标
                    CaretPos[1] = Sel.text.length;
                    CaretPos[0] = CaretPos[1] - CaretPos[0];
                }
                // Firefox support
                else if (target.selectionStart || target.selectionStart == '0') {//setSelectionRange
                    CaretPos[0] = target.selectionStart;
                    CaretPos[1] = target.selectionEnd;
                }
                return CaretPos;
            }
            catch (e) { return null; }
        },
        isDateTime: function (v) {
            v = $.trim(v);
            var vList = v.split(' ');
            var vDate = vList[0];
            var vTime = vList.length > 1 ? vList[1] : "";
            if (vDate != "") {
                var s = vDate.split('-');
                if (s.length < 3) return false;
                var y = parseInt(s[0], 10); var m = parseInt(s[1], 10); var d = parseInt(s[2], 10);
                if (isNaN(y) || isNaN(m) || isNaN(d)) return false;
                var i = (y % 400 == 0) || (y % 4 == 0 && y % 100 != 0) ? 1 : 0;
                if (y < 1900 || m < 1 || m > 12 || d < 1 || d > 31) return false;
                if (m == 2 && d > (28 + i)) return false;
            }
            if (vTime != "") {
                var s = vTime.split(':');
                var h = parseInt(s > 0 ? s[0] : "", 10); var m = parseInt(s > 1 ? s[1] : "", 10); var s = parseInt(s > 2 ? s[2] : "", 10);
                if (isNaN(y) || isNaN(m) || isNaN(d)) return false;
                if (h < 0 || h > 23 || m < 0 || m > 59 || s < 0 || s > 59) return false;
            }
            return true;
        },
        isIDCard: function (v) {
            var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
            var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X
            function IdCardValidate(idCard) {

                idCard = trim(idCard.replace(/ /g, ""));
                if (idCard.length == 15) {
                    return isValidityBrithBy15IdCard(idCard);
                } else if (idCard.length == 18) {
                    var a_idCard = idCard.split(""); // 得到身份证数组
                    if (isValidityBrithBy18IdCard(idCard) && isTrueValidateCodeBy18IdCard(a_idCard)) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            /**  
            * 判断身份证号码为18位时最后的验证位是否正确  
            * @param a_idCard 身份证号码数组  
            * @return  
            */
            function isTrueValidateCodeBy18IdCard(a_idCard) {
                var sum = 0; // 声明加权求和变量   
                if (a_idCard[17].toLowerCase() == 'x') {
                    a_idCard[17] = 10; // 将最后位为x的验证码替换为10方便后续操作   
                }
                for (var i = 0; i < 17; i++) {
                    sum += Wi[i] * a_idCard[i]; // 加权求和   
                }
                var valCodePosition = sum % 11; // 得到验证码所位置   
                if (a_idCard[17] == ValideCode[valCodePosition]) {
                    return true;
                } else {
                    return false;
                }
            }
            /**  
            * 通过身份证判断是男是女  
            * @param idCard 15/18位身份证号码   
            * @return 'female'-女、'male'-男  
            */
            function maleOrFemalByIdCard(idCard) {
                idCard = trim(idCard.replace(/ /g, "")); // 对身份证号码做处理。包括字符间有空格。   
                if (idCard.length == 15) {
                    if (idCard.substring(14, 15) % 2 == 0) {
                        return 'female';
                    } else {
                        return 'male';
                    }
                } else if (idCard.length == 18) {
                    if (idCard.substring(14, 17) % 2 == 0) {
                        return 'female';
                    } else {
                        return 'male';
                    }
                } else {
                    return null;
                }
            }
            /**  
            * 验证18位数身份证号码中的生日是否是有效生日  
            * @param idCard 18位书身份证字符串  
            * @return  
            */
            function isValidityBrithBy18IdCard(idCard18) {
                var year = idCard18.substring(6, 10);
                var month = idCard18.substring(10, 12);
                var day = idCard18.substring(12, 14);
                var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
                // 这里用getFullYear()获取年份，避免千年虫问题   
                if (temp_date.getFullYear() != parseFloat(year)
               || temp_date.getMonth() != parseFloat(month) - 1
               || temp_date.getDate() != parseFloat(day)) {
                    return false;
                } else {
                    return true;
                }
            }
            /**  
            * 验证15位数身份证号码中的生日是否是有效生日  
            * @param idCard15 15位书身份证字符串  
            * @return  
            */
            function isValidityBrithBy15IdCard(idCard15) {
                var year = idCard15.substring(6, 8);
                var month = idCard15.substring(8, 10);
                var day = idCard15.substring(10, 12);
                var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
                // 对于老身份证中的你年龄则不需考虑千年虫问题而使用getYear()方法   
                if (temp_date.getYear() != parseFloat(year)
                  || temp_date.getMonth() != parseFloat(month) - 1
                  || temp_date.getDate() != parseFloat(day)) {
                    return false;
                } else {
                    return true;
                }
            }
            //去掉字符串头尾空格   
            function trim(str) {
                return str.replace(/(^\s*)|(\s*$)/g, "");
            }

            return IdCardValidate(v);
        }
    }


    /* FORMHANDLE PRIVATE METHODS
    * ===================== */

    /* FORMHANDLE PLUGIN DEFINITION
    * 如果普通对象执行 则 进行判定绑定对象以及事件
    * ======================= */
    $.fn.formhandle = function (option, doc) {
        doc = $(doc || window.document);
        var $this = doc.data('formhandle'), options;
        if (!$this) doc.data('formhandle', ($this = new formHandle(this, $.fn.formhandle.defaults)));
        //var reg=/input|textarea/gi;
        if (this[0].nodeName == "#document") {
            $this.options = $.extend({}, $this.options, doc.data(), typeof option == 'object' && option);
            if($this.options.data)$this.setData();
            return $(this[0]);
        }
        return $this.addverifykey(this.filter("[verifykey]"), typeof option == 'object' && option);
    }
    $.fn.formhandle.defaults = {
        //isNum 是否为数字 字母等 numVerify当且仅当 在isNum 为有效值 才进行处理
        paramsdefaults: { isNum: false, numVerify: true, minLength: 0, maxLength: 100000, i: 0, rexRl: "char"
        , cache: true//针对异步引入新的参数 是否进行缓存 防止多次发起请求
    , nextverify: false//一旦发生验证失败，则立即终止下次验证，主要用于表单提交
            //first 参数主要用于 进行格式控制的时候 是否
        }//内部各项参数设置 numVerify 表示当前字母添加之后 于现有格式是否正确
    , rexRls: { "char": ".*"
, "+number(4)": "^[0-9]+[.]?[0-9]{0,4}$"//精度为4的正实数 包括0
, "date": "^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$"//日期格式
, "datetime": "^([0-9]{4}-[0-9]{1,2}-[0-9]{1,2})[\\s]*(([0-9]{1,2}:){0,2}[0-9]{1,2})?$"//时间格式
, "+int": "^[\\+]?[0-9]+$"//正整数 包括0
, "+int~0": "^[\\+]?[1-9][0-9]*$"//正整数 不包括0
, "-int~0": "^[\\-][1-9][0-9]*$"//负整数 不包括0
, "-int": "^[\\-][0-9]+$"//负整数包括0
, "int": "^[\\+|\\-]?[0-9]+$"//整数
, "number(2)": "^[0-9]+[.]?[0-9]{0,2}$"//精度为2实数
, "number": "^[\\+|\\-]?[0-9]+[.]?[0-9]*$"//任意实数
, "number(4)": "^[\\+|\\-]?[0-9]+[.]?[0-9]{0,4}$"//精度为4实数
, "image": "(\\.jpg|\\.gif|\\.png|\\.jepg)$"//图片
, "idcard": "^([^\\s]{18}|[^\\s]{15})$"//身份证
, "email": "^([0-9a-zA-Z_]+@[0-9a-zA-Z_]+)([\\.][0-9a-zA-Z_]+)+$"
, "tel": "^([0-9]{0,4}\\-)*[0-9]{5,}$"//包括 手机 或则电话方式
, "phone": "^[1-9][0-9]{10}$"//手机
    },
        beforesubmit: null,
        aftersubmit: null,
        nextverify: false,
        defaultWord: "TRANA",
        defaultPassWord: "ok"
    }

    $.fn.formhandle.Constructor = formHandle;
    /* DIALOG DATA-API
    * ============== */

    $(function () {

    });

} (window.jQuery);





//字符相加
function opAdd() {
    var taget = opAdd.arguments;
    var oper = function (a, b) { return a + b };
    return Operation(taget, oper);
}
//字符想乘
function opMultiply() {
    var taget = opMultiply.arguments;
    var oper = function (a, b) { return a * b };
    return Operation(taget, oper);
}
//字符相减
function opSubtract() {
    var taget = opSubtract.arguments;
    var oper = function (a, b) { return a - b };
    return Operation(taget, oper);
}
//字符运算
function Operation(taget, oper) {
    var argv = taget;
    var argc = taget.length;

    var val = 0;
    if (argc < 1)
        return NaN;
    val = parseFloat(argv[0] == "" ? "0" : argv[0]);
    if (isNaN(val)) return val;
    for (var i = 1; i < argc && !isNaN(val); i++) {
        var k = parseFloat(argv[i] == "" ? "0" : argv[i]);
        val = oper(val, k);
    }
    return val;
}
