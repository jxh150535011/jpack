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

 	function _from(option){//单例
 		_from=function(_option) {
 			if(instance&&_option)$.extend(instance.options,_option);
 			return instance;
 		}
		_from.prototype = this;//后期处理原型属性
		instance=new _from(option);
		instance.constructor=_from;//理应不改父级原型 构造函数 应该改子级
		instance.options=$.extend({},$.fn.form.defaults,option);
        instance.definitions=$.extend({},$.fn.form.definitions);
        instance.verifykeys={};//验证码 key 值集合
        //instance._event();
		setTimeout(function(){instance.init();},100);//初始化
		return instance;
 	}

 	_from.prototype.reg=function(option){
        if(!option)return;
        var that = this, opt = this.options, vks = that.verifykeys;
        var key=option["key"]||option[opt.verifyName];if(!key)return;
        vks[key]= $.extend({}, vks[key], $.extend({}, opt._verify_defaults, option));
        var definitions=this.definitions;
        if(vks[key].placeholder){
            vks[key].mask=this._get_mask_reg(vks[key].text,vks[key].placeholder);
        }
        //that.eventNumberBox($(this), vkopt);
        //that.eventStringBox($(this), vkopt);
 	}
 	_from.prototype.init=function(){
        var opt=this.options;
        this.$doc=$(document);
 		this.$input=$("<div style='width:1px;height:1px;display:block;overflow:hidden;'><input type='text' /></div>");
 		this._extents_func={};
 		//注册两个方法
 		this._extents_("datatime",_extents_datatime);
 		this._extents_("idcard",_extents_idcard);
        //form表单提交是否进行验证
        $("form", this.$doc).off("."+opt.core).on("submit."+opt.core, function (e, t) {
            var returnV = true, opt = that.options, rex;
            if (t === true) {//立即发起表单提交
                alert("表单提交");
                return true;
            }
            //that.asyncsubmit($(this), e); //发起异步提交
            return false;
        });
        this._event();
 	}
    _from.prototype._event=function(){
        var that = this, opt = this.options, vks = that.verifykeys;
        this.$doc.off("."+opt.core).on("mousedown."+opt.core,function(e){
            var src=that.src(e);if(!src.verify)return true;
            that._bind(src);
            var mask=src.verify.mask;
            if(mask){
                var v=that._get_value(src.target);
                var rv={value:v,pos:[mask.start,mask.start]};
                var f=that._test_mask_format(rv,mask);
                if(f<1){
                    rv.value="";
                    var rv=that._get_mask_format(rv,mask);
                    v=rv.value;
                }
                that._set_value(src.target,v);
                if(f<1)that._set_pos(src.target,[mask.start,mask.start]);
            }
        }).on("focus."+opt.core, function (e) {
            

        })
        .on("keydown."+opt.core, function (e) {//keydown 不区分大小写
            var $inputs = $("input[type='text'],textarea,select");
            var src=that.src(e);
            var vk=src.verify;
            if (e.which == 13 && !src.lines) {
                var index = $inputs.index(src.target);
                if (index < ($inputs.length - 1)) {
                    $inputs.eq(index + 1).focus();
                    return false;
                }
                return true;
            }
            else if(e.which==8){
                if(vk.mask){
                    setTimeout(function(){
                        that._mask_format(src,"");
                    },1)
                }
                return true;
            }
            return true;
        }).on("keypress."+opt.core, function (e) {//keypress 操作命令 例如backspace 不会进入 大小写会进行区分
                var src=that.src(e);
                if (!src.verify) return true;
                var vk=src.verify;
                //var pos=that._get_pos(src.target)||[0,0];
                if (vk.mask) {// 存在mask 要求进行 mask验证
                    var k = that.numberCharCode(e);
                    if(typeof k=="boolean")return k;
                    that._mask_format(src,k);
                    return false;
                }
                return true;
        }).on(($.browser.msie?"beforepaste.":"paste.")+opt.core, function (e) {
            var src=that.src(e);if (!src.verify) return true;
            var mask=src.verify.mask;
            if((src.nodeName=="input"&&src.nodeType=="text")||src.nodeName=="textarea"){//严格的输入对象 才能出发黏贴事件
                var $o=src.target;
                var $ipd=$o.data(opt.core+"-input");
                if(!($ipd&&$ipd.get(0)))$o.data(opt.core+"-input",($ipd=that.$input.clone()));
                $o.parent().append($ipd);
                var $ip=$ipd.children().eq(0);
                //var pos=that._get_pos($o);
                $ip.val("").focus();
                setTimeout(function(){
                    if(!$ipd)return;
                    that._mask_format(src,$ip.val());
                    $ipd.remove();
                    /*var value=$o.focus().val();$ipd.remove();
                    var rv=that._get_next_value(src.target,$ip.val(),mask&&mask.holder,$ip.data("pos"));
                    src.value=rv.value;
                    var f=that.tryverify(src).rex;
                    if(f)pos=[rv.pos[1],rv.pos[1]];
                    that._set_value($o,f?rv.value:value,pos);
                    that._set_pos($o,pos);*/
                },10);
            }
                //var pastev = that.getClipboardData();
                //srcData._v = pastev;
                //return that.tryverify(srcData, verify).rex;
        });
        /*
            .on("keypress.formhandle", function (e) {//keypress e.which 才是正常的
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
            })*/
    }
    _from.prototype.backValue=function(src,pos){
        var target = src.target, v = this._get_value(target);
        if(!src.avalue)return v;
        var p = pos||this._get_pos(target)||[v.length, v.length];
        return v.substring(0, p[0]) + src.avalue + v.substring(p[1]);
    }
    _from.prototype._get_pos=function(target){
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
    _from.prototype._get_mask_reg=function(text,holder){
        if(!text)return null;
        var definitions=this.definitions;
        //definitions[holder]=".";
        var a=[],b=[],disabled={},start=-1;
        var k=/[\[\]]/.test(holder);
        disabled[holder]=holder;
        var h=definitions[holder]="["+(k?"\\":"")+holder+"]";
//[ &#91;
//\ &#92;
//] &#93;
//& &#38;
//* &#42;
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
        var rexs=[],k=0,str=[],data=[];
        for (var i = 0,l=s.length; i<l; i++) {//提取出裸值判断 正则
            var c=s.charAt(i),p={holder:true,rex:null,c:c};
            data.push(p);
            if(c=='*')c=list[k++];//属于正则字符
            else if(definitions[c]&&c!=holder)c=definitions[c];//如果是定义好的字符 并且部位
            else if(!disabled[c]){
                p.holder=false;
                disabled[c]=c;//固定字符 不可改
                str.push(c);
                continue;
            }
            else p.holder=false;
            if(start<0)start=i;
            if(p.holder)p.rex=new RegExp("("+(c||"")+"|"+h+")");

            rexs.push("("+(c||"")+"|"+h+")");
            str.push(holder);
        }

        console.log(str.join(""));
        console.log(s);
        console.log(rexs);

        //rexs 为解析text 而生成的 对于每个元素验证的正则表达数组
        return {len:str.length,disabled:disabled,holder:holder,data:data,source:text,text:s,rexs:rexs,start:start};//len 为输入长度
    }
    _from.prototype._remove_mask_value=function(rv,mask){//提取里面的值 ,holder
        var definitions=this.definitions;
        var value=rv.value;
        var pos=rv.pos||[0,0];
        var a=[],sj=0,ej=0,data=mask.data;
        //console.log(value);
        for(var i=0,j=0,dl=data.length,l=value.length;j<l;i++){
            var c=value.charAt(j++);
            if(i<dl){
                var p=data[i];
                if(!p.holder){//||(mask.disabled[c]&&c!=mask.holder
                    if(c===p.c){
                        if(j<pos[0])sj++;
                        if(j<pos[1])ej++;
                    }
                    else j--;
                    continue;//剔除holder &&(c!=mask.holder||!holder)
                }
            }
            a.push(c);
        }
        pos[0]-=sj;
        pos[1]-=ej;
        return {value:((mask.len<a.length)?a.slice(0,mask.len):a).join(""),pos:pos};
    }
    _from.prototype._add_mask_value=function(rv,mask){//结合mask生成的值
        //var definitions=this.definitions;
        var data=mask.data,pos=rv.pos||[0,0];
        var a=[],sj=0,ej=0,len=data.length,avalue=rv.value;
        for(var i=0,j=0,l=avalue.length; i<len;i++){//跟 _innert_value 方法类似 暂时
            var p=data[i];

            if(p.holder){
                var c=j<l?avalue.charAt(j++):mask.holder;
                a.push(c);
            }
            else{
                if(i<pos[0])sj++;
                if(i<pos[1])ej++;
                a.push(p.c);
            }
        }
        console.log(a);
        /*
        var len=value.length;
        if(mask.len<len){
            value=value.substr(0,mask.len);
            len=value.length;
        }
        var text=mask.text;
        
        for (var i = 0,j=0,l=mask.len; i<l; i++) {//提取出裸值判断 正则
            var c=text.charAt(i);
            if(mask.disabled[c]){
                if(j<pos[0])sj++;
                if(j<pos[1])ej++;
                c=mask.disabled[c];//holder 计入在内
            }
            else if(j<len){
                c=value.substr(j,1);
                j++;
            }
            else c=mask.holder;
            a.push(c);
        }

        */
        pos[0]+=sj;
        pos[1]+=ej;
        return {value:a.join(""),pos:pos};
    }
    _from.prototype._get_mask_format=function(rv,mask){
        return this._add_mask_value(this._remove_mask_value(rv,mask),mask);
    }
    /*暂时无意义*/
    _from.prototype._test_mask=function(src){//进入时 必要求为_mask
        var that = this, opt = this.options;
        var mask=src.verify.mask;
        if(!src.avalue)return false;
        else if(mask.disabled[src.avalue])return false;
        src.value=this.backValue(src);
        return this._test_mask_value(src.value,mask);
    }
    _from.prototype._test_mask_value=function(value,mask){//对于最终值进行处理
        var rexs=mask.rexs,len=value.length;
        for(var i=0,l=rexs.length;i<l;i++){
            if(i>=len)return 0;
            if(!new RegExp(rexs[i]).test(value.charAt(i)))return -1;
        }
        return 1;
    }
    //返回-1 完全错误  0 不完整 返回1  完全正确
    _from.prototype._test_mask_format=function(value,mask){//格式化验证
        var rv=this._remove_mask_value(value,mask);
        return this._test_mask_value(rv.value,mask);
    }
    _from.prototype._mask_format=function(src,v,pos){//格式化处理
        var mask=src.verify.mask;
        if(!mask)return true;
        else if(mask.disabled[v])return false;
        var that = this, opt = this.options;
        var rv=this._get_next_value(src.target,v,mask);
        console.log(rv);
        rv=this._remove_mask_value(rv,mask);
        console.log(rv);
        var f=this._test_mask_value(rv.value,mask);
        if(f>0){
            rv=this._add_mask_value(rv,mask);
            pos=pos||rv.pos;
            src.target.val(rv.value);
            this._set_pos(src.target,[pos[1],pos[1]]);
        }
        return false;
    }
    _from.prototype._innert_value=function(value,avalue,pos,mask){
        if(!avalue)return {value:(value.slice(0, pos[0]) + avalue + value.slice(pos[1])),pos:[pos[0],pos[0]]};
        if(mask){
            var data=mask.data,av=[];
            var len=data.length;//以后可以深化 当pos[1]-pos[0]为0的时候 则自动覆盖后面 否则只对范围内进行处理
            for(var i=pos[0],j=0,l=avalue.length; i<len&&(i<pos[1]||j<l);i++){
                var p=data[i];
                if(p.holder){
                    var c=j<l?avalue.charAt(j++):mask.holder;
                    av.push(c);
                }
                else av.push(p.c);
            }
            pos[1]=i;
            avalue=av.join("");
            //for(var i=pos[0],j=0,l=value.length,al=(pos[0]+avalue.length),dl=data.length;i<l&&i<al&&i<dl;i++){
            //    if(data[i].holder)j++;
            //}
            //pos[1]+=j;
        }
        return {value:(value.slice(0, pos[0]) + avalue + value.slice(pos[1])),pos:[pos[0],pos[1]]};//pos[0]+avalue.length
    }

    _from.prototype._get_next_value=function(target,avalue,mask,pos,select){//格式化处理
        var v = this._get_value(target);
        var p = pos||this._get_pos(target)||[v.length, v.length];
        return this._innert_value(v,avalue,p,mask);
    }
    _from.prototype._get_mask_format1111=function(src){//格式化读取
        var vk=src.verify;
        if(!vk.mask)return null;
        if(src.nodeName=="input"&&src.nodeType=="text"){
            var v=src.value||src.target.val();
            var s=this._remove_mask_value(v,vk.mask);
            return this._add_mask_value(s,vk.mask);
        }
        return null;
        //src.target.value
    }

    _from.prototype.tryverify=function(src,fn){
        return {min:true,max:true,rex:true};
        //vk._mask.reg.lastIndex=0;
        var that = this, opt = this.options;
        var verify=src.verify;
        if(!verify){
            fn && fn(true);
            return {min:true,max:true,rex:true};//key值不存在 表示不需要进行验证
        }
        try {
            var v = that.backValue(src);
            src.value=v;

            //if(!this._test_mask(src))return {min:true,max:true,rex:false};

            var verifycache = src.target.data("__verify_cache__");
            var type=src.type;//事件类型
            if (!verifycache) src.target.data("__verify_cache__", verifycache = {});
            var cache=verifycache[v];if(!cache)cache=verifycache[v]={test:{min:false,max:false,rex:false},loading:false,complete:false};
            if (verify.cache && cache.complete) {
                src.test = cache.test;
            }
            else src.test = that.test(src); //true通过 false 截止
            if (verify.back) {
                var rex = verify.back.call(that, src);
                src.test.rex = (rex == null ? src.test.rex : rex);
            }
            if (verify.asyncreback) {//异步 不大一样。异步当前值 只可能被触发一次 
                verify.asyncreback.call(that, src, cache, function (flag) {
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
                return;
              }
              cache.test=src.test;cache.loading = false;cache.complete=true;
            }
            return src.test;
        }
        catch(e){
            return {min:false,max:false,rex:false};
        }
    }

    _from.prototype.test=function(src){
        var verify=src.verify;
        return false;
    }

    _from.prototype.numberCharCode=function (e) {//允许数字 字母
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
  	_from.prototype.src=function(e){
        var evt=e||window.event;
	    var type = evt.type,target=$(evt.target);
        var nodeType=target.attr("type");
        var nodeName= target.get(0).nodeName && target.get(0).nodeName.toLowerCase();

        //var lines = target.get(0).nodeName && target.get(0).nodeName.toLowerCase() == "textarea"; //是否为多行
	    //var lines = target.get(0).nodeName && target.get(0).nodeName.toLowerCase() == "textarea"; //是否为多行
	    var verifykey = target.attr("verifykey");
	    var verify = target.filter("[verifykey]").length > 0&&this.verifykeys[verifykey];



	    return { target: target, nodeType: nodeType,nodeName:nodeName, verify: verify, verifykey: verifykey, value: "",avalue:"", type: type }; 
 	}
    _from.prototype._set_pos=function(target,pos){
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
 	_from.prototype._set_value=function(target,v){
        var _o=$(target);
        var s="",_t=_o.attr("type");
        if(/^(span|div|label)$/gi.test(_o.get(0).nodeName))_o.text(v||"");
        else if(_t=="radio"||_t=="checkbox"){
            return (v!=null&&_o.val()==v)?_o.attr("checked",true):_o.attr("checked",false);
        }
        else _o.val(v||"");
 	}
 	_from.prototype._get_value=function(target){
        var _o=$(target);
        var s="",_t=_o.attr("type");
        if(/^(span|div|label)$/gi.test(_o.get(0).nodeName))s= _o.text();
        else if((_t=="radio"||_t=="checkbox"))return _o.attr("checked")?_o.val():null;
        else s=_o.val();
        return s&&s.replace(/^[\s]*|[\s]*$/, ""); //去除2边空格;
 	}
 	_from.prototype._bind=function(src){
        if(!src.verify)return;
        var opt=src.verify;
        var hb=src.target.data(opt.core+"-bind");if(hb)return;
        src.target.data(opt.core+"-bind",true);
 		if(opt.placeholder) src.target.css({ imeMode: "disabled","ime-mode":"disabled" });
 	}
 	_from.prototype._extents_=function(key,fn){
 		if(!key)return;
 		if(!this._extents_func[key])this._extents_func[key]=[];
 		if(!fn)this._extents_func[key].push(fn);
 	}
 	_from.prototype._extents_call=function(key,v){
 		var fns=key&&this._extents_func[key];
 		if(!fns)return true;
 		var p,b=true;
 		while((p=fns.pop())){
 			b=p.call(this,v);//返回false 则直接结束
 			if(!b)return false;
 		}
 		return true;
 	}
 	$.fn.form=function(option){
 		new _from(option);
 		return this;
 	}
 	$.fn.form.verify=function(option){
 		var that=new _from();
        that.reg(option);
 		/*this.filter("["+that.options.verifyName+"]").each(function(){
 			that._bind();
 		});*/
 	}
 	$.fn.form.defaults={core:"data-plug-form",verifyName:"verifykey"
    ,_verify_defaults:{placeholder:"",core:"data-plug-verify"}
    ,rexs:
{ "char": ".*"
, "+number(4)": "^[0-9]+[.]?[0-9]{0,4}$"//精度为4的正实数 包括0
, "date": "^[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}$"//日期格式
, "datetime": "^([0-9]{4}-[0-9]{1,2}-[0-9]{1,2})[\\s]*(([0-9]{1,2}:){0,2}[0-9]{1,2})?$"//时间格式
, "+int": "^[\\+]?[0-9]+$"//正整数 包括0
, "+int~0": "^[\\+]?[1-9][0-9]+$"//正整数 不包括0
, "-int~0": "^[\\-][1-9][0-9]+$"//负整数 不包括0
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
    }
    };
    //"*":"[^\\s]" * 为正则表达式子 不进行处理
    $.fn.form.definitions={
        "~":"[+\\-]",
        "n":"[0-9]",
        "c":"[a-zA-Z]",
        "s":"[^\\s]",
        "*":".",
    };
 });

if("jQuery" in window){
  __f(jQuery);
}
else{
  J.require("jquery");
  J.define(__f);
}
