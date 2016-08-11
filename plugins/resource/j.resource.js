/*
资源管理器 用于加载各类资源
金兴亨 2013-03-29
最后更新时间 2013-04-01
*/
J.require("jquery");
J.define(function() {
	var resource={};
	function __func(i){
		this.files=[];
		this.elems={};
		this._readyc=0;
		this._errorc=0;
		this._elems_len=0;
		this._delay=10;
	}
	__func.prototype.loadAjax=function(url,timer,fn,option){
		option=option||{};
		var p=J.url_params(url);var that=this;
	    $.ajax({
	        url:url,
	        type:"POST",
	        dataType:(option.dataType||"json"),
	        crossDomain:(J.getBasicPath().indexOf(p.head)!=0&&!p.head),//是否跨域
	        data:{},
	        success:function(data){
	        	if(timer==that.ajaxTimer)fn&&fn(url,data,true);
	        },
	        error:function(XMLHttpRequest, textStatus, errorThrown){
	        	//alert(XMLHttpRequest.responseText);
	        	//response
	            fn&&fn(url,null,false);
	        }
	    });
	}
	__func.prototype.loadScript=J.loadScript;
	__func.prototype.loadStyle=J.loadStyle;
	__func.prototype.loadImage=function(url,fn){
		var img=new Image();var size={width:0,height:0}
		img.onload = img.onreadystatechange=function(){
		if (img && img.readyState && img.readyState != 'loaded' && img.readyState != 'complete') return fn&&fn(url,size,false);
		img.onload = img.onreadystatechange = img.onerror = null;
		size={width:img.width,height:img.height};
		return fn&&fn(url,size,true);
		}
		img.onerror=function(){
		img.onload = img.onreadystatechange = img.onerror = null;
		return fn&&fn(url,size,false);
		};
		img.src=url;
	};
	__func.prototype.loadElems=function(file,fn){
		var url=file.url;
		var t=this._check_type(url);this.ajaxTimer=new Date().getTime();
		if(t=="img")this.loadImage(url,function(_u,_size,_flag){
			fn&&fn(_u,{flag:_flag,size:_size});
		});
		else if(t=="js")this.loadScript(url,null,function(_u,_data){
			fn&&fn(_u,_data);
		});
		else if(t=="css")this.loadStyle(url,null,function(_u,_data){
			fn&&fn(_u,_data);
		});
		else this.loadAjax(url,this.ajaxTimer,function(_u,_data,_flag){
			fn&&fn(_u,{flag:_flag,text:_data});
		},file);
		return;
	};
	__func.prototype._check_type=function(url){
		if(!url)return "";
		url=url.replace(/[?].*$/gi,"");
		var t="";
		url.replace(/[.]((jpg|gif|png|jepg|bmp)|(js)|(css))$/gi,function($0,$_0,$1,$2,$3){
			//alert("$0:"+$0+",$1:"+$1+",$2:"+$2+",$3:"+$3+"");
			if($1)t="img";else if($2)t="js";else if($3)t="css";
			return;
		});
		return t;
	}
	__func.prototype.proess = function(files,fn,delay) {
		if(!files)files=[];
		this._elems_len+=files.length;
		this.files=files.reverse().concat(this.files);
		this._fn=fn;
		this._delay=delay||10;
		this.start();
	};
	__func.prototype.getData = function(url) {
		var d=this.elems[url];
		return d&&d.data;
	};
	__func.prototype.start = function() {
        if(this.timer)clearTimeout(this.timer);
        var that=this;
        this.timer=setTimeout(function(){that._runing();},this._delay);
	};
	__func.prototype._runing = function() {
	    var that=this;
        if(this.loading)return true;
        if(this.files.length<1)return true;//处理依赖
        this.loading=true;
        var file=this.files.pop();
        var elem=this.elems[file.url];
        if(!elem||!elem.flag){
        	this.loadElems(file,function(u,data){
            	that.complete(u,data);
            	that.start();
        	});
        }
        else {
        	that.complete(u,{flag:true});
        	this._runing();
        }
        return true;
	};
	__func.prototype.complete=function(url,data){
		var elem=this.elems[url];
		if(!this.elems[url])elem=this.elems[url]={};
		var rflag=elem.flag=elem.flag||data.flag;//设置是否加载完成
		elem.data=data;
		if(rflag)this._readyc++;
		else this._errorc++;
		this.loading=false;
		var percent=(this._readyc+this._errorc)/this._elems_len;
		this._fn&&this._fn(url,percent);
		//this._runing();
	}
	resource.getObject=function(){
		var args=arguments;
		return new __func();
	};
	resource.constructor=__func;
	J.fn.resource=resource;
});

