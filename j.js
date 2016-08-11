/*
         ___             ___     ___     ___                      |
       / \  \          / \  \  / \__\  / \  \  hello world!       |
       \  \  \         \  \  \/  /  /  \  \  \                    |
        \  \  \         \  \ /  /  /    \  \  \                   |
         \  \  \         \  \  /  /      \  \  \                  |
          \  \  \         \  \/__/        \  \  \________         |
           \  \  \        /\  \  \         \  \  \_____  \        |
       ___  \  \  \      /  \  \  \         \  \  \  \ \  \       |
      /\  \  \  \  \    /  / \  \  \         \  \  \  \ \  \      |
      \ \  \__\__\  \  /  /  /\  \  \         \  \  \  \ \  \     |
       \ \___________\ \ /__/  \  \__\         \  \__\  \ \__\    |
        \____________/          \/___/          \/__ /   \/__/    |
                                       my name is jxh!q:150535011 |

*/
/*类包方法 
提供唯一路口
金兴亨 2012-02-01
最后更新时间 2013-04-17 14:48
*/
var J_LOADED=true;
var J_NAME="J";
var J_SCRIPT="j([.]min)?.js";
if(typeof window[J_NAME]== "undefined") J_LOADED=false;
//内部方法 统一前面+ _  私有变量+_ 普通外部对象引用+$ 其余为基本变量名
(function(){
    if(J_LOADED)return;
    var BASICPATH="";
    function jpack(){
        this.index=0;
        this.elems={};//已加载标签
        this.plugins={};//key:{urls:purls,fn:fn,complete:false}
        this.urls=[];
        this._require_urls=[];//建立依赖队列
        this._ref={};//依赖关系数组
        this._config={plugins:{}};
        this._init_require_list=[];
        this._code="";
        this._self_url=null;//自身 url 对象
        this._main_url=null;//主方法url 对象
        this.fn={};//方法类库
        this.SCRIPTPATH="";//当前js路径
        this._init_ready_fns=[];//加载成功回调函数
        this.WEBNAME="";//站点名称 (虚拟目录)
        this.page={
            domain:(window.location.protocol + '//' + window.location.host),//http://192.168.1.1:81
            path:window.location.href.replace(/[\/][^\/]*$/gi,"/")//http://192.168.1.1:81/abc/
        };
        //种子
        this._chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
        this.init();
    };
    Function.prototype.extend=function(parent, overrides){
        if (typeof parent != 'function') {
            parent=parent||{};
            for (var k in overrides) {
                parent[k]=overrides[k];
            }
            return this;//保存对父类的引用
        }
        this.base = parent.prototype;
        this.base.constructor = parent;//继承
        var f = function () { };
        f.prototype = parent.prototype;
        this.prototype = new f();
        this.prototype.constructor = this;//附加属性方法
        if (overrides)this.extend(this.prototype, overrides);
    };
    jpack.prototype.__extend=function(parent,child){
        var cf=child.constructor;
        
        cf.extend(parent.constructor,cf.prototype);
        child.defaults=this.extend(parent.defaults,child.defaults);
    };
    jpack.prototype.extend = function (parent, overrides){
        if(!overrides)return parent;
        parent=parent||{};
        for (var k in overrides) {
            parent[k]=overrides[k];
        }
        return parent;
    };
    jpack.prototype.parse_relative_url=function(path){//根据url路径处理../
        //计算内部的../将其替换或则晋级
        var url_list=[];
        var u=this.url_params(path);
        u.path.replace(/([\/][^\/]*)/gi,function($1){
            if($1=="/..")url_list.pop();
            else url_list.push($1);
        });
        return u.head+url_list.join('');
    };
    jpack.prototype.url_params=function(url){//拆分url
        var u={head:"",path:""};
        // abc/a.html  截取头部abc 
        // ~abc/a.html  截取头部abc
        if(!url)return u;
        u.path=url.replace(/^(((http:\/\/)|(~))?[^.\/][^\/]*)/gi,function($1){
            u.head=$1;//获取头部地址 去除开头任意多个点
            return "";
        });
        if(u.head.charAt(0)=='~')u.head="/"+u.head.substr(1);
        return u;
    };
    jpack.prototype.format=function(url,relative,params){//格式化标签 relative表示是否处理为相对路径
        // url 斜杠开头 表示绝对路径开始
        var u=this.url_params(url);
        if(!u.head){
            u.head=this.getBasicPath();
            var p=window.location.pathname.replace(/([\/][^\/]*)$/gi,"");//去除最后 /**
            if(u.path.indexOf("..")==0)u.path=p+"/"+u.path;
        }
        rurl=this.parse_relative_url(u.path);
        if(!relative){
            rurl=u.head+rurl;
        }
        return params==false?rurl.replace(/[?].*$/gi,""):rurl;
    };
    // name.ext
    jpack.prototype.getPath=function(name){//获取某个插件前缀路径
        var url="",that=this;
        //this._init();// 禁止运行 _init (里面使用了format方法 ) 
        //因为在ie 6下，获取的src路径 无http(/abc) 可能前面已经获取了 虚拟目录 abc; 导致最后路径错误
        //var rex=new RegExp(""+name+"([?].*)?$","gi"); 上面与下面等价
        this._get_domain_scripts(function ($obj) {
            url=$obj.getAttribute("src");if((!url)||url=="undefined")return;
            that.elems[url]=true;
        });
        var rex=new RegExp("[/]"+name+"(?:([?].*)|)$","gi");
        url="";
        for(var k in this.elems){
            if(rex.test(k)){
                url=k.replace(rex,"");
                break;
            }
        }
        return url;
    }
    jpack.prototype.getPluginsPath=function(name){
        var r=this._config.plugins[name]||[];
        return r&&r.length>0?r[0]:"";
    }

    jpack.prototype.getBasicPath=function(){//后面不带/ 例如192.168.0.1
        if(this.BASICPATH)return this.BASICPATH;
        this.BASICPATH=window.location.protocol + '//' + window.location.host;
        var u=this.url_params(this._main_url||this._self_url);
        if(u.head==this.BASICPATH||!u.head)//如果为同一个域名 (两个都已默认带端口) //或则u.head 为空 意味着 同一个域名
        {
            //url=this._self_url.replace(BASICPATH,"");//格式化后
            //alert(BASICPATH);
            //取第一个前缀为 虚拟目录 通常js所在目录 跟其他html目录 应为不同文件夹节点
            //如果相同 认定为第一集虚拟目录
            var pathName= window.location.pathname;
            var webName = pathName == '' ? '' : pathName.replace(/^[\/]?([^\/]+)[\/](.*)$/gi,"$1");//取第一个集合
            if(webName&&u.path.indexOf("/"+webName)==0)//url是含有前缀格式
                this.BASICPATH+="/"+webName;
            this.WEBNAME=webName;
        }
        else this.BASICPATH;
        
        //else BASICPATH=u.head;
        return this.BASICPATH;
    }


    //当前函数在js 文件中运行 最好同域下执行 以正确获取虚拟目录 否则可能导致虚拟目录缺失
    jpack.prototype.main=function(){//设置主函数 路口 每次调用 将会切换站点路径 直接影响根目录
        if(!this._main_url){
            BASICPATH="";//清空根目录 进行重新计算
            this._main_url=this._get_cross_domain_url();//得到必然为绝对路径
            if(!this._main_url){
                throw new Error("J.main() error");//页面上必须有同域下的任何参照物 例如css 以及 js等 或则 img
                return;
            }
            this.getBasicPath();//计算根目录
        }
    }
    jpack.prototype.get_relative_path=function(path){//返回绝对路径http打头
        var page=this.page;
        if(path.indexOf("http://")==0) return path;
        else if(path.indexOf("/")==0)return page.domain+path;
        else if(path)return this.parse_relative_url(page.path+path);//处理成绝对路径
        return "";
    }
    jpack.prototype._check_cross_domain=function(path){//如果同域 则返回绝对路径http打头
        var page=this.page,domain=page.domain;
        path=this.get_relative_path(path);if(!path)return "";
        if(this.SCRIPTPATH&&path.indexOf(this.SCRIPTPATH)==0)return "";//与脚本路径同域则排除
        return (path.indexOf(domain)==0)?path:"";//并且排除js库相关的所有路径
    }

    jpack.prototype._get_cross_domain_url=function(fn){
        var url="",that=this;
        this._get_domain_scripts(function($obj) {
            url=$obj.getAttribute("src");if(!(url&&(url=that._check_cross_domain(url))))return;
            return false;
        });
        if(url)return url;
        this._get_domain_links(function($obj) {
            url=$obj.getAttribute("href");if(!(url&&(url=that._check_cross_domain(url))))return;
            return false;
        });
        if(url)return url;
        this._get_domain_images(function($obj) {
            url=$obj.getAttribute("src");if(!(url&&(url=that._check_cross_domain(url))))return;
            return false;
        });
        return url;
    }
    jpack.prototype._get_run_script_url=function(){
        var url;
        this._get_domain_scripts(function($obj) {
            url=$obj.getAttribute("src");if(url)return false;
        });
        return url;
    }

    jpack.prototype._get_domain_scripts=function(fn){
        var head = document.getElementsByTagName('head')[0];if(!head)return "";
        var scripts = head.getElementsByTagName('script');
        for(var i=scripts.length-1;i>-1;i--){
            if(!scripts[i])continue;
            if(fn&&fn(scripts[i])===false)break;
        }
    }
    jpack.prototype._get_domain_links=function(fn){
        var head = document.getElementsByTagName('head')[0];if(!head)return "";
        var links = head.getElementsByTagName('link');
        for(var i=links.length-1;i>-1;i--){
            if(!links[i])continue;
            if(fn&&fn(links[i])===false)break;
        }
    }
    jpack.prototype._get_domain_images=function(fn){
        var images = document.getElementsByTagName('img');
        for(var i=images.length-1;i>-1;i--){
            if(!images[i])continue;
            if(fn&&fn(images[i])===false)break;
        }
    }
    jpack.prototype._init=function(css){
        var scripts = document.getElementsByTagName('script');
        var urls=[];
        if(css!==false){// 不处理css
            this._get_domain_links(function($link) {
                if($link.getAttribute("complete"))return;
                urls.push($link.href);
                $link.getAttribute("complete",1);
            });
        }
        this._get_domain_scripts(function($script) {
            urls.push($script.src);
            $script.parentNode.removeChild($script);
        });
        var url="";
        while((url=urls.pop())!=null){
            if((!url)||url=="undefined"||!(url=this.format(url)))continue;//计算出绝对路径
            this.elems[url]=true;
        }
    }
    jpack.prototype.init=function(){//获取 初始化路径
        if(this._self_url)return;
        var scripts = document.getElementsByTagName('script');
        for(var i=scripts.length-1;i>-1;i--){
            var url=scripts[i].src;
            if((new RegExp("[\\|/]"+J_SCRIPT+"([?].*)*$","gi")).test(url)){
                this._core=scripts[i].getAttribute("core");
                this._auto=scripts[i].getAttribute("auto");
                this._self_url=url;
                this.SCRIPTPATH=this.get_relative_path(this.getPath(J_SCRIPT));//返回绝对路径形式的SCRIPTPATH
                break;
            }
         }
    };
    jpack.prototype.getParam=function(name,src){
        src=src||this._self_url;
        if(src.indexOf('?')<0)return "";
        src=src.substr(src.indexOf('?')+1);
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r =src.match(reg);
        if (r != null) return unescape(r[2]);
        return "";
    };
    jpack.prototype.getQueryString=function(name,un){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return un?decodeURIComponent(r[2]):r[2];
        return "";
    };
    jpack.prototype.setQueryString = function(url, key, value,un,del) {
        value=un?encodeURIComponent(value):value;
        var parts = url.split('?');
        var path = parts[0].replace(/#*$/gi,"");
        var query = parts[1]||"";
        var kvp = query.split('&');
        var i=kvp.length; var x,index=i; 
        while(i--) {
          x = kvp[i].split('=');
          if (x[0]==key) {
            index=i;
            x[1] = value;
            kvp[i] = x.join('=');
            break;
          }
        }
        if(i<0) kvp[kvp.length] = [key,value].join('=');
        if(del&&(value=="undefined"||!value))kvp.splice(index,1);
        url = path +'?'+ kvp.join('&').replace(/^[&]*/gi,""); 
        return url;
    };
    jpack.prototype.setCookie=function(name,value,expires,path,domain){
        var str=name+"="+escape(value);
        if(expires){
         var date=new Date();
         date.setTime(date.getTime()+expires*60*1000);//expires单位为分
         str+=";expires="+date.toGMTString();
        }
        str+=path?(";path="+path):"";//指定可访问cookie的目录
        str+=domain?(";domain="+domain):"";//指定可访问cookie的域
        document.cookie=str;
    };
    jpack.prototype.getCookie=function(name){
        var str=document.cookie.split(";");
        for(var i=0;i<str.length;i++){
            var str2=str[i].split("=");
            var s=str2[0].replace(/^[\s]*|[\s]*$/gi,"");
            if(s==name&&str2.length>1)return unescape(str2[1]);
        }
    };
    jpack.prototype.toStr=function(object){
        var str="";
        if(typeof object=="object"){
            var isa=(object instanceof Array);
            for(var k in object){
            str+=","+(!isa?"\""+k+"\":":"")+this.toStr(object[k]);
            }
            if(str.length>0)str=str.substr(1);
            return isa?"["+str+"]":"{"+str+"}";
        }
        else if(typeof object=="string")return "\""+object+"\"";
        else if(typeof object=="number")return ""+object;
        else if(typeof object=="boolean")return ""+object;
        return "";
    };
    jpack.prototype.loadScript=function(url,charset,fn){
        var head = document.getElementsByTagName('head')[0]; 
        var script = document.createElement('script'); 
        script.type = 'text/javascript'; 
        script.src = url; 
        script.defer="true";
        script.charset = charset || 'utf-8';

        script.onerror=function(){
            return fn&&fn(url,false);
        }
        script.onload = script.onreadystatechange=function(){
            if(!script||script.readyState == 'loading')return;
            if (script && script.readyState && script.readyState != 'loaded' && script.readyState != 'complete') return fn&&fn(url,{flag:false});
            script.onload = script.onreadystatechange = script.onerror = null;
            script.parentNode.removeChild(script);
            script=null;
            return fn&&fn(url,{flag:true});
        }
        head.appendChild(script);
    };
    jpack.prototype.loadElems=function(url,charset,fn){
        if(/(js|php)([?]|$)/gi.test(url))this.loadScript(url,charset,fn);
        else if(/css([?]|$)/gi.test(url))this.loadStyle(url,charset,fn);
        else this.loadHtml(url,charset,fn);
    }
    jpack.prototype.loadStyle=function(url,charset,fn){
        var head = document.getElementsByTagName('head')[0]; 
        var elem = document.createElement('link'); 
        elem.type = 'text/css'; 
        elem.href = url; 
        elem.rel="stylesheet";
        elem.charset = charset || 'utf-8';
        elem.onload = elem.onreadystatechange=function(){
            if(!elem||elem.readyState == 'loading')return;
            if (elem && elem.readyState && elem.readyState != 'loaded' && elem.readyState != 'complete') return fn&&fn(url,{flag:false});
            elem.onload = elem.onreadystatechange = elem.onerror = null;
            //elem.parentNode.removeChild(elem);
            elem=null;

            return fn&&fn(url,{flag:true});
        }
        head.appendChild(elem);
    };
    jpack.prototype.loadHtml=function(url,charset,fn){
        var body = document.getElementsByTagName('body')[0]; 
        var elem = document.createElement('iframe'); 
        elem.style.display="none";
        elem.src = url; 
        elem.charset = charset || 'utf-8';
        elem.onload = elem.onreadystatechange=function(){
            if(!elem||elem.readyState == 'loading')return;
            if (elem && elem.readyState &&  elem.readyState != 'interactive' && elem.readyState != 'loaded' && elem.readyState != 'complete')  return fn&&fn(url,{flag:false});
            elem.onload = elem.onreadystatechange = elem.onerror = null;
            var doc=null;
            try{doc=this.contentWindow.document;}catch(e){};
            elem.parentNode.removeChild(elem);
            elem=null;
            return fn&&fn(url,{flag:true,content:doc});
        }
        body.appendChild(elem);
    };
    jpack.prototype.loadFiles=function(urls,fn) {
        return this._loadPlugins({urls:urls,fn:fn});
    };
   jpack.prototype._loadPlugins=function(data){
        data=data||{};
        var urls=data.urls||[];
        data.key="plugin"+(this.index++);
        var purls=[],l=urls.length;
        for(var i=0;i<l;i++){
            var url=this.format(urls[i]);
            purls.push(url);
        }
        if(data.append===false){//往前插入 purls 内部为有序数组
            this.urls=purls.concat(this.urls);
        }
        else this.urls=this.urls.concat(purls);
        data.urls=purls;
        data.complete=false;
        this.plugins[data.key]=data;
        this.loadStart();
        return data.key;
    };

    jpack.prototype.loadPlugins=function(urls,fn,efn){//fn 全部完成 efn 每个循环 return false 终止加载
        return this._loadPlugins({urls:urls,fn:fn,efn:efn});
    };
    jpack.prototype.loadStart=function(){
        if(this.timer)clearTimeout(this.timer);
        var that=this;
        this.timer=setTimeout(function(){that.load();},10);
    }
    jpack.prototype.load=function(){
        var that=this;
        if(this.loading)return true;
        if(this.urls.length<1)return this._load_require();//处理依赖
        this.loading=true;
        var url=this.urls[0];
        //alert("load:"+url+"*"+this.elems[url]);
        this._get_require_url(url);
        this.urls.splice(0,1);
        if(!this.elems[url]){
            //这里只判断js目录名是否一致 不同网站相同js名 也认为同一个
            //同时不考虑参数
            this.loadElems(url,null,function(u,data){
                that.complete(u,data);
            });
        }
        else this.complete(url,{flag:true});
        return true;
    };


    jpack.prototype.del=function(urls){//删除url放弃加载
        if(typeof urls=="array"){
            for (var i = urls.length-1; i>-1; i--) {
                this._del(urls[i]);
            }
        }
        else if(typeof urls=="string")this._del(urls);
    }
    jpack.prototype._del=function(url){//删除url放弃加载
        var l=this.urls.length;
        for (var i = 0; i < l; i++) {
            if(this.urls[i]==url){
                this.urls.splice(i,1);
                break;
            }
        };
    }
    jpack.prototype.complete=function(url,data){//格式化url
        var rflag=this.elems[url]=this.elems[url]||data.flag;//设置是否加载完成
        this.loading=false;
        //alert("loaded:"+url+"*"+flag);
        this._url_complete(url,data);//that.require_loading=false 不需要禁止 有依赖关系 自然会进入_load_require 方法
        //this.load();
    }
    jpack.prototype._load_require=function(){//加载需要结束的依赖
        if(this.require_loading)return true;
        var that=this;this.require_loading=true;//告知正在运行
        if(this._require_urls.length<1){
            this.require_loading=false;
            return true;
        }
        this._url_complete(this._require_urls[0],{flag:true},function(){//that.require_loading=false 因为只有这里才触发进行查询 其他_url_complete 不需要触发
            that.require_loading=false;
        });
    }
    jpack.prototype._url_complete=function(url,data,fn){//检查当前url是否完成 以及补足相关url
        var that=this;
        this._require_run(url,function(refkey){//进行递归循环 依次完成依赖url加载 内部会执行load函数
            that._plugins_compelet(url,data);//告知插件当前url已经完结
            fn&&fn(url,data);
            that.load();
        });
        //if(flag===false) that.__require_run_end(url,data,fn);
        //因为可能url 没有依赖关系，需要人为处理其结束关系 告知对应的plug compelet
        //insertBefore
    }
    jpack.prototype.__require_run_end=function(url){
        //在回调方法之前 清除 自身的_require_run 不然里面可能存在继续_require 会依赖到当前的_require_urls，导致不执行
        this._require_urls=this.map(this._require_urls,function(u){//移除依赖
            if(u==url)return null;
            return u;
        });
        this._require_compelet(url);
    }
    //_require_run -> _loadPlugins -> _url_complete->_require_run
    //_require_run 结束应该调用 __require_run_end(这个里面排除_plugins_compelet)
    jpack.prototype._require_run=function(refkey,fn){
        var that=this;
        var ref=this._get_ref_object(refkey,false);//根据refkey 获取指定的refobject
        //console.log("start:"+refkey);
        //console.log(ref);
        if(!ref) {
            this.__require_run_end(refkey);
            fn&&fn(refkey);
            return;//当前ref 对象不存在 直接结束
        }
        if(ref.urls.length<1){
            this.__require_run_end(refkey);
            fn&&fn(refkey);
            return;
        }
        if(ref.loading)return;ref.loading=true;
        var d=ref.urls[0];ref.urls.splice(0,1);
        //typeof d=="function"//不存在
        //alert("loadP_start:"+d.value);
        if((!d)||d.value.length<1){
            ref.loading=false;that._require_run(refkey,fn);
            return;
        }
        var refkeyi=d.key,urlsi=d.value;
        if(/[.]css([?][^\/]*)?$/g.test(urlsi[0])){//css处理 直接加载 不触发回调，因为有些平板不支持
            this.loadStyle(urlsi[0],null,null);
            ref.loading=false;that._require_run(refkey,fn);
            return;
        }
        this._loadPlugins({
            urls:urlsi,
            append:false,
            fn:function(u,flag){//会自动 进入 that._require_run 对象 结束后回调 fn方法 这边只需要 处理 _require_compelet
                that._require_run(refkeyi,function(){//开始进行子节点遍历
                    that.__require_run_end(refkeyi);
                    ref.loading=false;
                    that._require_run(refkey,fn);
                });
            },
            efn:function(u,data,pc){return !data.flag;},//ref.data[u]=data;
            use:null
        });
    }
    jpack.prototype._plugins_compelet=function(url,data,fn){
        for(var k in this.plugins){
            var p=this.plugins[k];
            if((!p)||p.complete){//如果已经加载完成 或对象不存在直接结束
                delete this.plugins[k];//删除这个引入对象
                continue;
            }
            var c=p.readyc||0;//完成记录数
            var l=p.urls.length,has=false;
            for(var i=0;i<l;i++){
                if(p.urls[i]==url){
                    has=true;
                }
            }
            if(!has)continue;
            c++;
            var ef=p.efn&&p.efn(url,data,p.urls.length?(c/p.urls.length):1);
            if(ef===false)this.del(p.urls);//停止重复js 只删除第一个相同项
            if(c>=p.urls.length||ef===false){//如果全部加载 或则终止 都触发全部加载完成
                //存在use 告知对应的use 当前插件组 完成
                //if(p.use)this._plugins_compelet(p.use);
                p.fn&&p.fn(url,true,k);
                delete this.plugins[k];//删除这个引入对象
            }
            else p.readyc=c;
        }
        fn&&fn();
    }
    //当前url 内部关系处理结束 告知相关插件此url成功完结
    //url 并非严格意义上url 需要将目标url转换为当时对应的关键字 例如"jquery" 而非 http://***/jquery.js等字符
    jpack.prototype._require_compelet=function(refkey){
        var ref=this._ref[refkey];
        if(ref){
            ref.complete=true;
            var p;
            while((p=ref.funcs.shift())){
                try{
                    p&&(typeof p=="function")&&p.call(this,this,ref);
                }catch(e){}
            }
            //ref["data"]={};
        }
    }
    jpack.prototype.getParents=function(w){//获取父级win 
        w=w||window;
        var p=w.parent,ws=[];
        while(p!=w&&p){
            ws.push(p);
            w=p;p=p.parent;
        }
        return ws;
    }
    jpack.prototype.random=function(l){
        var r=[];
        if(!l)l=32;
        for(var i=0;i<l;i++){
            r.push(this._chars[Math.ceil(Math.random()*35)]);
        }
        return r.join('');
    }
    jpack.prototype.map=function(a,fn){
        if(!a)return [];
        var r=[],l=a.length;
        for(var i=0;i<l;i++){
            var f=fn&&fn(a[i]);
            if(f)r.push(f);
        }
        return r;
    }
    jpack.prototype.require=function(name,fn){//用于建立依赖关系 name 统一为字符型
        //alert(name+"*"+fn);
        return this._require(name,"",fn);
    }
    jpack.prototype.define=function(_url,_ref_url,fn){//用于建立依赖关系 name 必须是字符型
        if(typeof _url=="function") this._require(_url,"",null);//指定当前加载url的依赖关系
        else this._require(_ref_url,_url,fn);
    }
    jpack.prototype._get_require_url=function(url){//获取当前执行依赖url(并不是严格意义上的url)
        if(this._require_urls.length<1){
            this._require_urls.push((this.random(8)+""+new Date().getTime()));
        }
        if(url&&typeof url=="string"&&url!=this._require_urls[0])this._require_urls.unshift(url);
        return this._require_urls[0];
    }
    jpack.prototype._get_ref_object=function(rurl,iscreate){//获取当前执行依赖url
        var ref=this._ref[rurl];//当前对象 加载需要引用对象保存
        if(iscreate&&!ref)ref=this._ref[rurl]={urls:[],data:{},funcs:[],keys:{}};
        return ref;
    }
    //doit表示当前需要加载的url或执行方法   relyurl是当前完成后 去回调 之前的_ref_url
    //fn 是跟随doit 完成后执行的方法 当且仅当doit 是url 且 存在
    jpack.prototype._require=function(doit,relyurl,fn){
        var _pass=false;
        if(doit&&(typeof doit=="string")&&/^#/.test(doit)){
            doit=doit.substr(1);
            _pass=true;
        }
        if(!_pass&&!this._isready){
             this._init_require_list.push([doit,relyurl,fn]);
             return;
        }
        var refkey=this._get_require_url(relyurl);//获取当年执行依赖url 并返回
        var ref=this._get_ref_object(refkey,true);//将这个key值 作为url
        if(doit){
            if(typeof doit=="string"){
                if(!ref.keys[doit]){
                    ref.keys[doit]=true;
                }
                //一个doit 可能 附带多个脚本需要加载 每个脚本路径 都以数组形式 ，目的是为了加载任何一个只要成功即可
                var urls=this._get_urls(doit,[]);
                for(var i=0,l=urls.length;i<l;i++){
                    ref.urls.push({key:doit,value:urls[i]});
                }
                fn&&this._get_ref_object(doit,true).funcs.push(fn);
            }
            else if(typeof doit=="function")ref.funcs.push(doit);
        }
        if(ref.complete){//已经加载完成
            this._require_compelet(refkey);
        }
        this.loadStart();//开始加载
        //this._url_complete(typeof _url=="string"?_url:null);
    }

    jpack.prototype._get_urls=function(name,turls){//返回数组格式
        //对name值做解析 将后面的值全部带入 var reg = new RegExp("([^?=&.]+=[^?=&.]*)", "gi"); var r = name.match(reg); r.join('&')
        var __format_urls=function(str,sp){
            if(typeof str=="string")return [str+((sp!="")?((str.indexOf('?')>-1?"&":"?")+sp):"")];
            else if(typeof str=="object"){
                var rstr=[];
                var l=str.length;
                for(var i=0;i<l;i++)rstr[i]=str[i]+((sp!="")?((str[i].indexOf('?')>-1?"&":"?")+sp):"");
                return rstr;
            }
            return [];
        }
        var _i=name.indexOf('?');var strp=_i>-1?name.substr(_i):"?";
        var sname=name.replace(strp,"");strp=strp.substr(1);
        if(!turls)turls=[];
        var urls=this._config.plugins[sname];
        if(!urls)turls.push([name]);
        else if(typeof urls=="string"||urls instanceof Array)turls.push(__format_urls(urls,strp));
        else{
            for(var k in urls){
                turls.push(__format_urls(urls[k],strp));
            }
        }
        return turls;
    }
    jpack.prototype.addPluginsConfig=function(options){
        this.extend(this._config.plugins,options);
    }
    jpack.prototype.ready=function(fn){
        this._init_ready_fns.push(fn);
        this._ready_compelet();
    }
    jpack.prototype._ready_compelet=function(){
        if(!(this._page_ready_state&&this._init_ready_state))return;
        this._isready=true;
        var p;
        while((p=this._init_require_list.shift())){
            this._require.apply(this,p);
        }
        while((p=this._init_ready_fns.shift())){
            this.define(p);
        }
    }
    jpack.prototype._init_ready_start=function(){
        var that=this;
        if(this._isready)return that._ready_compelet();
        this._isready=true;
        //因为有可能SCRIPTPATH 为/abc 路径 意味着 /abc可能是虚拟目录部分 因为加~ 表示绝对 处理为 ~abc
        var head=this.SCRIPTPATH.indexOf("/")===0?("~"+this.SCRIPTPATH.substr(1)):this.SCRIPTPATH;
        this.require("#"+head+"/j.config.js");
        this.define(function(){
            that._init_ready_state=true;
            that._ready_compelet();
        });
        this._isready=false;

    }
    jpack.prototype._page_ready_start=function(){
        var that=this;
        if (document.readyState === "complete"|| this._isready) {
            this._page_ready_state=true;
            if(this._ready_wait){
                this._ready_wait=false;
                if(document.addEventListener){
                    document.removeEventListener( "DOMContentLoaded", this.DOMContentLoaded, false );
                    window.removeEventListener("load", this.DOMContentLoaded, false);
                }
                else if ( document.attachEvent ){
                    document.detachEvent( "onreadystatechange", this.DOMContentLoaded );
                    window.detachEvent("onload", this.DOMContentLoaded);
                }
            }
            return this._ready_compelet();
        }
        if(this._ready_wait)return;
        this._ready_wait=true;
        this.DOMContentLoaded = function() {
            that._page_ready_start();
        };
        if (document.addEventListener ) {
            document.addEventListener( "DOMContentLoaded", this.DOMContentLoaded, false );
            window.addEventListener("load", this.DOMContentLoaded, false);
        } else if ( document.attachEvent ) {
            document.attachEvent( "onreadystatechange", this.DOMContentLoaded );
            window.attachEvent("onload", this.DOMContentLoaded);
        }
        //DOMContentLoaded=null;
    }

    jpack.prototype.autoload=function(){
        this._page_ready_start();
        this._init_ready_start();
    }
    var JLB=window[J_NAME];
    if(!JLB)window[J_NAME]=JLB=new jpack();
    var core={};
    function __core(){
        this._plugid=this.options.core+Math.round(Math.random()*100000);
    }
    __core.prototype.trigger=function(name,argv){
        var opt=this.options;
        //arguments
        try{return opt.trigger&&opt.trigger[name]&&opt.trigger[name].apply(this,argv||[]);}catch(e){return null};
    }
    __core.prototype.options=core.__defaults = {core:"data-plug-core"};
    core.constructor=__core;
    JLB.fn.core=core;

})(window);
//循环 进行计算
J.autoload();

/*
style 同理
script src显示的路径信息 script.getAttribute 用attr表示 script.src 用src表示 
例子1(谷歌,ie8)
实际：../**.js 无效路径同理
attr:../**.js
src:http:****.js

例子2(ie8 兼容模式,ie7 )
实际：../**.js 无效路径同理
attr:../**.js
src:../**.js

*/