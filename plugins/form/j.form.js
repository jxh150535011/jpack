/* =========================================================
 *Write：金兴亨
 *Date: 2013-05-09
 *Description:前端表单 操作
 *延续版本 from_v3
 *支持异步验证 自动发起表单提交 格式化输出显示
 *优化代码
 * ========================================================= */
 var __f=(function (){

 	var $=jQuery;

 	var instance;
 	var _extents_datatime=function(v){
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
 	}
 	var _extents_idcard=function(v){
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
 	function __handler(option){//单例
 		__handler=function(_option) {
 			if(instance&&_option)$.extend(instance.options,_option);
 			return instance;
 		}
		__handler.prototype = this;//后期处理原型属性
		instance=new __handler(option);
		instance.constructor=__handler;//理应不改父级原型 构造函数 应该改子级
		instance.options=$.extend({},option);
        //instance.definitions=$.extend({},$.fn.form.definitions);
        //instance.verifykeys={};//验证码 key 值集合
        instance.init();//初始化
		return instance;
 	}
    __handler.prototype.init=function(){
        var opt=this.options;
        this.$doc=$(document);
        this.$input=$("<div style='width:1px;height:1px;display:block;overflow:hidden;'><input type='text' /></div>");
        this.core="data-plug-form-handler";
        this.cachename="data-plug-form-handler-cache";
        this._extents_func={};
        //注册两个方法
        this._extents_("datatime",_extents_datatime);
        this._extents_("data",_extents_datatime);
        this._extents_("idcard",_extents_idcard);
        this._forms={};
        this._verifykeys={};
        this._event();
        this._verify_defaults=$.fn.form.verify_defaults;
        this._definitions=$.fn.form.definitions;
        this._words=$.fn.form.words;
        this._rules=$.fn.form.rules;
    }
    __handler.prototype._event=function(){
        var that = this, opt = this.options;
        this.$doc.off("."+opt.core).on("mousedown."+opt.core,function(e){
            return that.eventHandler(e,"mousedownHandler");
        }).on("keydown."+opt.core, function (e) {
            return that.eventHandler(e,"keydownHandler");
        }).on("keypress."+opt.core, function (e) {
            return that.eventHandler(e,"keypressHandler");
        }).on("drop."+opt.core, function (e) {
             return that.eventHandler(e,"dropHandler");
        }).on(($.browser.msie?"beforepaste.":"paste.")+opt.core, function (e) {
            return that.eventHandler(e,"pasteHandler");
        });
        //.on("dragenter."+opt.core, function (e) {
        //    return that.eventHandler(e,"dragenterHandler");
        //})

    }
    __handler.prototype._init_verify=function(option){
        if(!option)return;
        var that = this, opt = this.options, vks = that._verifykeys,definitions=this._definitions;
        var key=option["key"]||option["verifykey"];if(!key)return;
        var vk=vks[key]= $.extend({}, vks[key], $.extend({}, this._verify_defaults, option));
        if(vk.word===true)vk.word="number";
        var _w=(vk.word&&this._words[vk.word])||this._words[vk.rule];
        if(_w){
            vk.word=_w.word;
            vk.filter=_w.filter;
        }
        vk.irule=this._rules[vk.rule]||vk.rule;
        if(typeof opt.filter=="boolean")vk.filter=opt.filter;
        if(vk.mask){
            vk.omask=this._get_mask_reg(vk.mask,vk.placeholder);
        }
    }
    __handler.prototype._test_verify=function(value,verify){
        //内部集成日期判断
        var result = { min: false, max: false, rex: false }, that = this;
        var opt = this.options,v=value;
        if (v.length < verify.min) return result; //小于最小长度
        else if (v.length > verify.max) return { min: true, max: false, rex: false }; //大于最大长度
        else if (v.length < 1) return { min: true, max: true, rex: true }; //当字符长度符合标准，同时又为空 则不需要进行正则表达判断
        if (!verify.irule) return { min: true, max: true, rex: true }; //正则表达式为空值或则null 则不进行运算
        var is = (new RegExp(verify.irule, "gi")).test(v);
        return { min: true, max: true, rex: is&&this._extents_call(verify.rule,v) }; //返回结果集
    }
    __handler.prototype.src=function(e){
        var evt=e||window.event;
        var type = evt.type,target=$(evt.target);
        var cache=this._get_verify_data(target,true);
        cache.type=evt.type;
        return cache;
    }
    //verifyName 存在于父级form配置中 因此增加很多不必要的麻烦
    __handler.prototype._get_verify_data=function(target,hform){//获取表单数据
        var cache=target.data(this.cachename),that=this,verifyName,formid,oform;
        var __init_form=function(){
            formid=target.parents("form:first").attr("id")||"";
            oform=that._forms[formid]||null;
            verifyName=oform&&oform.options.verifyName;
            cache.oform=oform;
            cache.formid=formid;
            cache.verifyName=verifyName;
            cache.f=true;
        }
        if(!cache){
            var nodeType=target.attr("type");
            var nodeName= target.get(0).nodeName && target.get(0).nodeName.toLowerCase();
            cache={ target: target, nodeType: nodeType,nodeName:nodeName};
            if(hform){
                __init_form();
                if(cache.verifyName){
                    var verifykey = target.attr(verifyName)||"";
                    cache.verify=this._verifykeys[verifykey];
                    cache.key=verifykey;
                }
            }
            target.data(this.cachename,cache);
        }
        else if(hform&&!cache.f)__init_form();
        return cache;
    }

    __handler.prototype.eventHandler=function(e,type){
        var src=this.src(e),oform=src.oform;
        if(oform)return oform[type].call(oform,src,e);
    }
    __handler.prototype._extents_=function(key,fn){
        if(!key)return;
        if(!this._extents_func[key])this._extents_func[key]=[];
        if(!fn)this._extents_func[key].push(fn);
    }
    __handler.prototype._extents_call=function(key,value){
        var fns=key&&this._extents_func[key];
        if(!fns)return true;
        var p,b=true;
        while((p=fns.pop())){
            b=p.call(this,value);//返回false 则直接结束
            if(!b)return false;
        }
        return true;
    }

    __handler.prototype._set_value=function(target,v){
        var _o=$(target);
        var s="",_t=_o.attr("type");
        if(/^(span|div|label)$/gi.test(_o.get(0).nodeName))_o.text(v||"");
        else if(_t=="radio"||_t=="checkbox"){
            return (v!=null&&_o.val()==v)?_o.attr("checked",true):_o.attr("checked",false);
        }
        else _o.val(v||"");
    }
    __handler.prototype._get_value=function(target){
        var _o=$(target);
        var s="",_t=_o.attr("type");
        if(/^(span|div|label)$/gi.test(_o.get(0).nodeName))s= _o.text();
        else if((_t=="radio"||_t=="checkbox"))return _o.attr("checked")?_o.val():null;
        else s=_o.val();
        return s&&s.replace(/^[\s]*|[\s]*$/, ""); //去除2边空格;
    }
    __handler.prototype._get_clear_value=function(src){
       var v=this._get_value(src.target),omask=src.verify&&src.verify.omask;
       if(omask)return this._remove_mask_value({value:v||""},omask,true).value;
       return v;
    }
    __handler.prototype._set_clear_value=function(src){
       var v=src.value,omask=src.verify&&src.verify.omask;
       if(omask)v=this._add_mask_value({value:v||""},omask,true).value;
       this._set_value(src.target,v);
       return v;
    }

    __handler.prototype.numberCharCode=function (e) {//允许数字 字母
        var that = this, opt = this.options;
        if (e.which == 45 || e.which == 43)//65-90 97-122
            return String.fromCharCode(e.which);
        if (e.which == 46)
            return String.fromCharCode(e.which);
        else if (e.which == 0 || e.which == 8)
            return true;
        else if ((
    (e.which >= 190 && e.which <= 190) ||
    (e.which >= 48 && e.which <= 57) || (e.which >= 65 && e.which <= 90) || (e.which >= 97 && e.which <= 122)) && e.ctrlKey == false && e.shiftKey == false)
            return String.fromCharCode(e.which);
        else if (e.ctrlKey == true && (e.which == 99 || e.which == 118))
            return String.fromCharCode(e.which);
        else return false;
    }
    __handler.prototype._set_pos=function(target,pos){
        if (!target&&!pos) return;
        target=target.get(0);
        try {
            //var rng = this.txtBox.createTextRange();
            //var rng = document.selection.createRange();
            if (target.createTextRange) {
                var rng = target.createTextRange();
                setTimeout(function(){
                    rng.moveStart('character', -target.value.length);
                    rng.moveEnd('character', -target.value.length);
                    rng.collapse(true);
                    rng.moveEnd('character', pos[1]);
                    rng.moveStart('character', pos[0]);
                    rng.select();
                     //往回进行选择，最后只会选择到0为止。那么总共的长度就是下标
                },1);
            }
            // Firefox support
            else if (target.setSelectionRange) {
                setTimeout(function(){
                    target.setSelectionRange(pos[0],pos[1]);
                },1);
                //target.selectionStart=1;
                //target.selectionEnd=1;
                //CaretPos[1] = target.selectionEnd;
            }
        }
        catch (e) { return null; }
    }

    __handler.prototype._get_pos=function(target){
        var pos = [0, 0]; // IE Support
        if (!target) return pos;
        target=target.get(0);
        try {
            if (document.selection) {
                var Sel = document.selection.createRange();
                pos[0] = Sel.text.length;
                Sel.moveStart('character', -target.value.length); //往回进行选择，最后只会选择到0为止。那么总共的长度就是下标
                pos[1] = Sel.text.length;
                pos[0] = pos[1] - pos[0];
            }
            // Firefox support
            else if (target.selectionStart || target.selectionStart == '0') {//setSelectionRange
                pos[0] = target.selectionStart;
                pos[1] = target.selectionEnd;
            }
            return pos;
        }
        catch (e) { return null; }
    }
    __handler.prototype._get_mask_reg=function(text,holder){
        if(!text)return null;
        var definitions=this._definitions;
        var a=[],b=[],disabled={},start=-1;
        var k=/[\[\]]/.test(holder);
        disabled[holder]=holder;
        var h=definitions[holder]="["+(k?"\\":"")+holder+"]";
        //[ &#91;  \ &#92;  ] &#93;  & &#38;  * &#42;
        var s=text;
        s=s.replace(/[&]/g,"&#38;");
        s=s.replace(/[*]/g,"[*]");
        s=s.replace(/(\\\[)/g,"&#91;");
        s=s.replace(/(\\\])/g,"&#93;");
        var list=[];
        s=s.replace(/(\[[^\[\]]*\])/gi,function($0,$1,$2){
            list.push($0);
            return "*"
        });//提取出正则表达式
        for(var i=0,l=list.length;i<l;i++){
            list[i]=list[i].replace(/&#91;/g,"\\[").replace(/&#93;/g,"\\]").replace(/&#38;/g,"&");
        }
        s=s.replace(/&#91;/g,"\\[").replace(/&#93;/g,"\\]").replace(/&#38;/g,"&");
        var data=[];
        for (var i = 0,l=s.length; i<l; i++) {//提取出裸值判断 正则
            var c=s.charAt(i),p={holder:true,rex:null,c:c};
            data.push(p);
            if(c=='*')c=list[k++];//属于正则字符
            else if(definitions[c]&&c!=holder)c=definitions[c];//如果是定义好的字符 并且部位
            else if(!disabled[c]){
                p.holder=false;
                //disabled[c]=c;//固定字符 不可改
                continue;
            }
            else p.holder=false;
            if(start<0)start=i;
            if(p.holder)p.rex=new RegExp("("+(c||"")+"|"+h+")");
        }
        return {len:data.length,disabled:disabled,holder:holder,data:data,source:text,start:start};//len 为输入长度
    }
    __handler.prototype._remove_mask_value=function(rv,omask,rholder){
    //正常情况下 提取值 只是去掉固定字符 保留holder字符 
    //rholder 为true 则意味着去掉 holder
        //var definitions=this.definitions;
        var value=rv.value;
        var pos=rv.pos||[0,0];
        var a=[],sj=0,ej=0,data=omask.data;
        for(var i=0,j=0,dl=data.length,l=value.length;j<l;i++){
            var c=value.charAt(j++);
            if(i<dl){
                var p=data[i],srm=false;
                if(!p.holder){
                    if(c===p.c)srm=true;
                    else {
                        j--;
                        continue;
                    }
                }
                else if(rholder&&c===omask.holder)srm=true;
                if(srm){//减去这个值
                    if(j<pos[0])sj++;//如果是相等 也不操作 当前位置移除照样保持位置不变
                    if(j<pos[1])ej++;
                    continue;
                }
            }
            a.push(c);
        }
        pos[0]-=sj;
        pos[1]-=ej;
        return {value:((omask.len<a.length)?a.slice(0,omask.len):a).join(""),pos:pos};
    }
    __handler.prototype._add_mask_value=function(rv,omask){//结合mask生成的值
        //var definitions=this.definitions;
        //console.log(i+">>"+c+""+srm);
        var data=omask.data,pos=rv.pos||[0,0];
        var a=[],sj=0,ej=0,len=data.length,value=rv.value;
        for(var i=0,j=0,l=value.length; i<len;i++){//跟 _innert_value 方法类似 暂时
            var p=data[i];
            if(p.holder){
                var c=j<l?value.charAt(j++):omask.holder;
                a.push(c);
            }
            else{
                if(j<pos[0])sj++;//如果是相等 也不操作 当前位置增加照样保持位置不变
                if(j<pos[1])ej++;
                a.push(p.c);
            }
        }
        //console.log(a);
        pos[0]+=sj;
        pos[1]+=ej;
        return {value:a.join(""),pos:pos};
    }
    __handler.prototype._get_mask_format=function(rv,omask){
        return this._add_mask_value(this._remove_mask_value(rv,omask),omask);
    }
    __handler.prototype._test_mask_value=function(value,omask){//对于最终值进行处理
        var data=omask.data,len=value.length;
        for(var i=0,j=0,l=data.length;i<l;i++){
            var p=data[i];
            if(p.holder){
                if(j>=len)return 0;
                var c=value.charAt(j++);
                p.rex.lastIndex=0;
                if(!p.rex.test(c))return -1;
            }
        }
        return 1;
    }
    //返回-1 完全错误  0 不完整 返回1  完全正确
    __handler.prototype._test_mask_format=function(value,omask){//格式化验证
        var rv=this._remove_mask_value(value,omask);
        return this._test_mask_value(rv.value,omask);
    }
    __handler.prototype._innert_value=function(value,avalue,pos,omask){
        //if(!avalue)return {value:(value.slice(0, pos[0]) + avalue + value.slice(pos[1])),pos:[pos[0],pos[0]]};
        avalue=avalue||"";
        if(omask){
            var data=omask.data,av=[];
            var len=data.length;//以后可以深化 当pos[1]-pos[0]为0的时候 则自动覆盖后面 否则只对范围内进行处理
            for(var i=pos[0],j=0,l=avalue.length; i<len&&(i<pos[1]||j<l);i++){
                var p=data[i],c=j<l?avalue.charAt(j):omask.holder;
                if(p.holder||p.c==c){//优化处理 如果当前是固定字符 且恰好输入的也是同等固定字符 则继续下一个字符
                    j++;
                    av.push(c);
                }
                else{
                    av.push(p.c);//补充了限定符 则考虑
                }
            }
            pos[1]=i;
            avalue=av.join("");
        }
        return {value:(value.slice(0, pos[0]) + avalue + value.slice(pos[1])),pos:[pos[0],pos[0]+avalue.length]};//pos[0]+avalue.length
    }
    __handler.prototype._get_next_value=function(target,avalue,pos,omask,select){//格式化处理
        var v = this._get_value(target);
        var p = pos||this._get_pos(target)||[v.length, v.length];
        return this._innert_value(v,avalue,p,omask);
    }
    __handler.prototype._mask_format=function(src,v,pos,offi){//格式化处理
        var omask=src.verify.omask;
        if(!omask)return true;
        else if(v&&omask.disabled[v])return false;
        var that = this, opt = this.options;
        if(offi==null)offi=1;
        var rv=this._get_next_value(src.target,v,pos,omask);
        rv=this._remove_mask_value(rv,omask);
        var f=this._test_mask_value(rv.value,omask);
        if(f>=0){
            rv=this._add_mask_value(rv,omask);
            pos=pos||rv.pos;
            src.target.val(rv.value);
            this._set_pos(src.target,[pos[offi],pos[offi]]);
        }
        return false;
    }
    __handler.prototype._paste_format=function(src,e,v,pos,offi){//格式化处理 一定是input 进入
        var that = this, opt = this.options;
        var verify=src.verify;
        if(verify.omask){
            return this._mask_format(src,v,pos,offi);
        }
        else{
            if(offi==null)offi=0;
            var rv=this._get_next_value(src.target,v,pos);
            var pos=pos||rv.pos;src.value=rv.value;
            var rex=src.oform&&src.oform.tryverify(src).rex;
            if(verify.word&&verify.filter&&!rex) src.target.focus();
            else {
                src.target.val(rv.value);
                this._set_pos(src.target,[pos[offi],pos[offi]]);
            }
        }
    }
    

    function __forms(content,options,handler){//内部可能是多表单集合
        this.options = options;
        this.$elem = $(content);
        this.$forms=(this.$elem.is("form")?this.$elem:this.$elem.find("form"));
        this.handler=handler;
        this.verifykeys={};
        this._ajax_forms={};//发起表单提交
        this.init();
    }
    __forms.prototype.init=function(){
        var that=this,handler=this.handler;
        this.$forms.each(function(){
            var id=$(this).attr("id")||"";if(!id)return true;
            handler._forms[id]=that;
        });
    }
    __forms.prototype.mousedownHandler=function(src,e){
        var that=this,verify=src.verify,target=src.target;
        if(src.nodeName == "input"&&src.nodeType=="submit"){
            if(target.attr("data-plug-form")=="disabled")return true;
            that.submit(src.formid,src.target);
            return false;
        }
        if(!src.verify)return true;
        this._init_style(src);
    }
    __forms.prototype.focusHandler=function(src,e){
        var that=this,verify=src.verify;
        if(!src.verify)return true;
        this._init_style(src);
        var omask=verify.omask,handler=this.handler;
        if(omask){
            var v=handler._get_value(src.target);
            var rv={value:v,pos:[omask.start,omask.start]};
            var f=handler._test_mask_format(rv,omask);
            if(f<1){
                rv.value="";
                var rv=handler._get_mask_format(rv,omask);
                v=rv.value;
            }
            handler._set_value(src.target,v);
            if(f<1)handler._set_pos(src.target,[omask.start,omask.start]);
        }
        else{
            src.value=handler._get_clear_value(src);
            src.type = "focus";
            that.tryverify(src);
        }
    }
    __forms.prototype.blurHandler=function(src,e){
        var that=this,verify=src.verify,handler=this.handler;
        if(!src.verify)return true;
        src.value=handler._get_clear_value(src);
        src.type = "blur";
        that.tryverify(src);
    }
    __forms.prototype.keydownHandler=function(src,e){
        var that=this,verify=src.verify,target=src.target,handler=this.handler;
        if (e.which == 13) {
            if(src.nodeName == "textarea")return true;
            else if(src.nodeName == "input"&&src.nodeType=="submit"){
                if(target.attr("data-plug-form")=="disabled")return true;
                //不能立即触发 可能会直接导致后面的click 事件 或则 采用 disabled 
                that.submit(src.formid,src.target);
                //setTimeout(function(){that.submit();},1);
                return false;
            }
            var $inputs = $("input,textarea,select");
            var index = $inputs.index(src.target);
            if (index < ($inputs.length - 1)) {
                $inputs.eq(index + 1).focus();
                return false;
            }
            return true;
        }
        else if(e.which==8&&verify){//做一步验证 在keypress中 不做任何处理
            var pos=handler._get_pos(src.target);if(pos[1]==pos[0]&&pos[0]>0)pos[0]--;
            handler._paste_format(src,e,"",pos,0);
            return false;
        }
        else if(e.ctrlKey&&e.which==88&&verify){//剪贴
            var pos=handler._get_pos(src.target);if(pos[1]==pos[0])return false;
            handler._paste_format(src,e,"",pos,0);
            return false;
        }
        return true;
    }
    __forms.prototype.keypressHandler=function(src,e){
        var that=this,verify=src.verify,target=src.target,handler=this.handler;
        if (!src.verify) return true;
        if(verify.mask||verify.word){
            var k = handler.numberCharCode(e); //true 或则 false 或则字符
            if(typeof k=="boolean")return k;
            var rv=handler._get_next_value(src.target,k);
            src.value=rv.value;
            if(verify.word){
                if(!new RegExp(verify.word, "g").test(k))return false;
                var f=!(that.tryverify(src).rex);
                if(verify.filter&&f)return false;
            }
            if(verify.mask){
                handler._mask_format(src,k);
                return false;
            }
        }
        return true;
    }
    __forms.prototype.dropHandler=function(src,e){
        var that=this,verify=src.verify,handler=this.handler;if (!src.verify) return true;
        if(verify.mask||verify.word)return false;
    }
    __forms.prototype.pasteHandler=function(src,e){
        var that=this,verify=src.verify,handler=this.handler;
        if (!src.verify) return true;
        if((src.nodeName=="input"&&src.nodeType=="text")||src.nodeName=="textarea"){//严格的输入对象 才能出发黏贴事件
            var $o=src.target,$ipd=$o.data(handler.core+"-input");
            if(!($ipd&&$ipd.get(0)))$o.data(handler.core+"-input",($ipd=handler.$input.clone()));
            $o.parent().append($ipd);
            var $ip=$ipd.children().eq(0);
            $ip.val("").focus();
            setTimeout(function(){
                if(!$ipd)return;
                handler._paste_format(src,e,$ip.val());
                $ipd.remove();
            },10);
        }
    }

    __forms.prototype._init_style=function(src){//初始化状态
        if(!src.verify)return;
        var verify=src.verify,handler=this.handler;
        var hb=src.target.data(handler.core+"-init-style");if(hb)return;
        src.target.data(handler.core+"-init-style",true);
        if(verify.mask||verify.word) src.target.css({imeMode: "disabled","ime-mode":"disabled" });

        src.target.on("blur."+handler.core, function (e) {
            return handler.eventHandler(e,"blurHandler");
        }).on("focus."+handler.core, function (e) {
            return handler.eventHandler(e,"focusHandler");
        });
    }
    __forms.prototype.tryverify=function(src,fn){
        var that = this, opt = this.options,handler=this.handler;
        var verify=src.verify; 
        if(!verify){
            fn && fn(true);
            return {min:true,max:true,rex:true};//key值不存在 表示不需要进行验证
        }
        try {
            //if(==null)src.value=handler._get_value(src.target);
            var v=src.value||"";
            //if(!this._test_mask(src))return {min:true,max:true,rex:false};
            var verifycache = src.target.data("__verify_cache__");
            var type=src.type;//事件类型
            if (!verifycache) src.target.data("__verify_cache__", verifycache = {});
            var cache=verifycache[v];if(!cache)cache=verifycache[v]={test:{min:false,max:false,rex:false},loading:false,complete:false};
            if (verify.cache && cache.complete) {
                src.test = cache.test;
            }
            else src.test = handler._test_verify(v,src.verify); //true通过 false 截止

            
            var backfunc=verify.back||opt.back;
            var asyncbackfunc=verify.asyncback||opt.asyncback;
            if (backfunc) {
                var rex = backfunc.call(that, src);
                src.test.rex = (rex == null ? src.test.rex : rex);
            }

            if (asyncbackfunc) {//异步 不大一样。异步当前值 只可能被触发一次 
                src.cache=cache;
                asyncbackfunc.call(that, src, function (flag) {
                    //srcData.test.rex 只是变量 如果已经complete之前的src.Data.test依然没变 所以一下必须采用verifycache[v]判断
                    if (verifycache[v] == null || (verifycache[v].complete&&verifycache[v].test.rex==flag)) {//如果为null 或则  已经有缓存并且对应的异步值相同 则停止这次处理
                        return; //第2次结果抛弃
                    }
                    //alert(verifycache[v].complete+"*"+srcData.test.rex+"*"+flag+"返回值");
                    src.test.rex=flag;//srcData 虽然发生在异步之前的值，但是能进入到这里 认定其值有意义
                    //完成
                    fn && fn(src.test.rex);
                    if (!verify.cache) {
                      delete verifycache[v];
                      return;
                    }
                    cache.test=src.test;cache.loading = false;cache.complete=true;
                });
                cache.loading = true;
            }
            else {
              //完成
              fn && fn(src.test.rex);
              if (!verify.cache) {
                delete verifycache[v];
                return src.test;
              }
              cache.test=src.test;cache.loading = false;cache.complete=true;
            }
            return src.test;
        }
        catch(e){
            fn && fn(false);
            return {min:false,max:false,rex:false};
        }
    }
    __forms.prototype.submitStart=function(formid){//当前forms集合 提交开始
        var that=this,opt=this.options,handler=this.handler;
        var d = this._ajax_forms[formid]; if (!d) return;
        d.state=1;
        d.form.find("input[type='submit']").each(function(){
            $(this).data("disabled"+opt.core,$(this).attr("disabled"));
            $(this).attr("disabled",true);
        });

    }
    __forms.prototype.submitEnd=function(formid,flag){//当前forms集合 准备正式提交
        var that=this,opt=this.options,handler=this.handler;
        var d = this._ajax_forms[formid]; if (!d) return;
        d.state=0;
        d.form.find("input[type='submit']").each(function(){
            $(this).attr("disabled",$(this).data("disabled"+opt.core)||false);
        });
        if(flag) d.target&&d.target.click();
    }
    __forms.prototype.submit=function(formid,target){//初始化状态
        var that=this,opt=this.options;
        (formid?this.$forms.filter("[id='"+formid+"']"):this.$forms).each(function(){
            that.asyncsubmit($(this),formid,target);
        });
        return false;
    }
    __forms.prototype.asyncsubmit=function(iform,formid,target){
        var that=this,opt=this.options,handler=this.handler,verifyName=opt.verifyName;
        formid=formid||iform.attr("id");
        var $$ = jQuery;//.noConflict()
        var d = this._ajax_forms[formid],asynctimer=new Date().getTime();//暂时不考虑 时间戳 于 超时时间
        if(!d) this._ajax_forms[formid]=d={form: iform, timer: new Date().getTime(), async: null,asynctimer:0,state:0 };
        if(d.state==1)return;//当前已经正在提交中 终止
        
        var async = [];
        var data=that.getFormValues(iform,function(src){
            async.push(src);
            src.type="submit";
        });
        d.async = async;
        d.data=data;
        d.target=target;
        //d.asynctimer=asynctimer;
        this.submitStart(formid);
        this.beforeverifying(formid);
        return false;
    }

    __forms.prototype.getFormValues=function(iform,fn){
        var that=this,opt=this.options,handler=this.handler,verifyName=opt.verifyName;
        var $$ = jQuery,data={};
        $$("["+verifyName+"],[name]", iform).each(function () {
            var target=$$(this),src=handler._get_verify_data(target,false),v;
            if(!src.verify){
                src.key=target.attr(verifyName);
                src.verify=handler._verifykeys[src.key]||null;
            }
            fn&&fn.call(that,src);
            var n=target.attr("name")||src.key;
            src.value=v=handler._get_clear_value(src);
            if(v!=null)data[n]=(data[n]!=null)?(data[n]+','+v):v;
        });
        return data;
    }
    __forms.prototype.setFormValues=function(iform,data,fn){
        var that=this,opt=this.options,handler=this.handler,verifyName=opt.verifyName;
        var $$ = jQuery;
        $$("["+verifyName+"],[name]", iform).each(function () {
            var target=$$(this),src=handler._get_verify_data(target,false),v;
            if(!src.verify){
                src.key=target.attr(verifyName);
                src.verify=handler._verifykeys[src.key]||null;
            }
            fn&&fn.call(that,src);
            var n=target.attr("name")||src.key;
            src.value=(data[n]!=null)?(data[n]+""):"";
            handler._set_clear_value(src);
        });
    }
    __forms.prototype.beforeverifying=function(formid){
        var that=this,opt=this.options,handler=this.handler,rex;
        var d = this._ajax_forms[formid]; if (!d) return;
        if (opt.beforeback) rex = opt.beforeback.call(that, d);
        if (rex === false) return this.submitEnd(formid,false);
        if (!opt.asyncbeforeback) return this.verifying(formid);
        opt.asyncbeforeback.call(that, d, function (r) {
            if (r === false) return that.submitEnd(formid,false);
            that.verifying(formid);
        });
    }
    __forms.prototype.afterverifying=function(formid){
        var that=this,opt=this.options,handler=this.handler,rex;
        var d = this._ajax_forms[formid]; if (!d) return;
        if (opt.afterback) rex = opt.afterback.call(that, d);
        if (rex === false) return this.submitEnd(formid,r===false?false:true);
        if (!opt.asyncafterback) return this.submitEnd();
        opt.asyncafterback.call(that, d, function (r) {
            return that.submitEnd(formid,r===false?false:true);
        });
    }
    __forms.prototype.verifying=function(formid){
        var that = this, opt = this.options,handler=this.handler,rex;
        var d = this._ajax_forms[formid]; if (!d) return;
        var async = d.async;
        function _verifying() {
            if (async == null || async.length < 1) {
                if (rex!==false) return that.afterverifying(formid);
                return that.submitEnd(formid,false);
            }
            var src = async.shift();
            that.tryverify(src, function (f) {
                if (f === false) {
                    async.length = []; //清空
                    rex = false;
                }
                _verifying();
            });
        }
        _verifying();
    }
    __forms.prototype.getValues=function(formid){
        var that=this,handler=this.handler,d={};
        var $$ = jQuery,data={};
        this.$forms.each(function(){
            var id=$(this).attr("id")||"";if(!id)return true;
            if((!formid)||id==formid){
                d[id]=that.getFormValues($(this));
            }
        });
        for(var k in d) $$.extend(data,(data[k]=d[k]));
        return data;
    }
    __forms.prototype.setValues=function(data){
        var that=this,handler=this.handler,d={};
        var $$ = jQuery,data=data||{};
        this.$forms.each(function(){
            var id=$(this).attr("id")||"";if(!id)return true;
            d[id]=that.setFormValues($(this),data);
        });
    }


    $.fn.formObject=function(option,params){
        var opt=$.fn.form.defaults;
        var $this=$(this).form().data(opt.core);
        if(!$this)return null;
        if(typeof option !="string")return null;
        return $this[option].apply($this,params||[]);
    }
 	$.fn.form=function(option,params){
        var opt=$.fn.form.defaults,handler=new __handler();
        ((this.get(0)||this.selector)?this:$(document)).each(function () {//对于每个form进行绑定
            var $this = $(this), data = $this.data(opt.core);
            var options= $.extend({}, data?data.options:opt, typeof option == 'object' && option)
            if (!data) $this.data(opt.core, (data = new __forms(this,options,handler)));
            else data.options=options;
            if(typeof option=="string")data[option]&&data[option].apply(data,params?params:[]);
        });
        return this;
 	}
    $.fn.form.verify=function(option){
        new __handler()._init_verify(option);
    }
    $.fn.form.gets=function(target){
        if(!target&&target.get(0))target=$(document);
        return target.is("form")?target:target.find("form");
    }
    $.fn.form.verify_defaults={key:"",placeholder:"_",rule:"char",core:"data-plug-verify",word:false
    ,max:100000,min:0
    };//word 单词正则表达控制
    //"*":"[^\\s]" * 为正则表达式子 不进行处理
    $.fn.form.definitions={
        "~":"[+\\-]",
        "n":"[0-9]",
        "c":"[a-zA-Z]",
        "s":"[^\\s]",
        "*":"."
    };
    $.fn.form.words={//过滤单字配置
        "number":{word:"[0-9\\.\\+\\-]",filter:true},
        "idcard":{word:"[0-9xX]",filter:false}
    };
    $.fn.form.rules={ "char": ".*"
, "+number(4)": "^[0-9]+[.]?[0-9]{0,4}$"//精度为4的正实数 包括0
, "date": "^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$"//日期格式
, "datetime": "^([0-9]{4}-[0-9]{1,2}-[0-9]{1,2})[\\s]*(([0-9]{1,2}:){0,2}[0-9]{1,2})?$"//时间格式
, "+int": "^[\\+]?[0-9]+$"//正整数 包括0
, "+int~0": "^[\\+]?[1-9][0-9]+$"//正整数 不包括0
, "-int~0": "^[\\-][1-9][0-9]+$"//负整数 不包括0
, "-int": "^[\\-][0-9]+$"//负整数包括0
, "int": "^[\\+|\\-]?[0-9]+$"//整数
, "+number(2)": "^[0-9]+[.]?[0-9]{0,2}$"//精度为2实数
, "number": "^[\\+|\\-]?[0-9]+[.]?[0-9]*$"//任意实数
, "number(4)": "^[\\+|\\-]?[0-9]+[.]?[0-9]{0,4}$"//精度为4实数
, "image": "(\\.jpg|\\.gif|\\.png|\\.jepg)$"//图片
, "idcard": "^([^\\s]{18}|[^\\s]{15})$"//身份证
, "email": "^([0-9a-zA-Z_]+@[0-9a-zA-Z_]+)([\\.][0-9a-zA-Z_]+)+$"
, "tel": "^([0-9]{0,4}\\-)*[0-9]{5,}$"//包括 手机 或则电话方式
, "phone": "^[1-9][0-9]{10}$"//手机
    };
 	$.fn.form.defaults={core:"data-plug-form",verifyName:"verifykey"};
 });

if("jQuery" in window){
  __f(jQuery);
}
else{
  J.require("jquery");
  J.define(__f);
}
//var lines = target.get(0).nodeName && target.get(0).nodeName.toLowerCase() == "textarea"; //是否为多行