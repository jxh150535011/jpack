/*
 * @Author xhjin
 * @CreateDate  2013/12/13
 * @Desc  简易的上传按钮 seajs 模型
 * update 2014-01-07 采用require 方式引入jquery
 */
define(function(require, exports, module) {
	/*	SWFObject v2.2 <http://code.google.com/p/swfobject/> 
		is released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
	*/
	var swfobject = function(){var D="undefined",r="object",S="Shockwave Flash",W="ShockwaveFlash.ShockwaveFlash",q="application/x-shockwave-flash",R="SWFObjectExprInst",x="onreadystatechange",O=window,j=document,t=navigator,T=false,U=[h],o=[],N=[],I=[],l,Q,E,B,J=false,a=false,n,G,m=true,M=function(){var aa=typeof j.getElementById!=D&&typeof j.getElementsByTagName!=D&&typeof j.createElement!=D,ah=t.userAgent.toLowerCase(),Y=t.platform.toLowerCase(),ae=Y?/win/.test(Y):/win/.test(ah),ac=Y?/mac/.test(Y):/mac/.test(ah),af=/webkit/.test(ah)?parseFloat(ah.replace(/^.*webkit\/(\d+(\.\d+)?).*$/,"$1")):false,X=!+"\v1",ag=[0,0,0],ab=null;if(typeof t.plugins!=D&&typeof t.plugins[S]==r){ab=t.plugins[S].description;if(ab&&!(typeof t.mimeTypes!=D&&t.mimeTypes[q]&&!t.mimeTypes[q].enabledPlugin)){T=true;X=false;ab=ab.replace(/^.*\s+(\S+\s+\S+$)/,"$1");ag[0]=parseInt(ab.replace(/^(.*)\..*$/,"$1"),10);ag[1]=parseInt(ab.replace(/^.*\.(.*)\s.*$/,"$1"),10);ag[2]=/[a-zA-Z]/.test(ab)?parseInt(ab.replace(/^.*[a-zA-Z]+(.*)$/,"$1"),10):0}}else{if(typeof O.ActiveXObject!=D){try{var ad=new ActiveXObject(W);if(ad){ab=ad.GetVariable("$version");if(ab){X=true;ab=ab.split(" ")[1].split(",");ag=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}}catch(Z){}}}return{w3:aa,pv:ag,wk:af,ie:X,win:ae,mac:ac}}(),k=function(){if(!M.w3){return}if((typeof j.readyState!=D&&j.readyState=="complete")||(typeof j.readyState==D&&(j.getElementsByTagName("body")[0]||j.body))){f()}if(!J){if(typeof j.addEventListener!=D){j.addEventListener("DOMContentLoaded",f,false)}if(M.ie&&M.win){j.attachEvent(x,function(){if(j.readyState=="complete"){j.detachEvent(x,arguments.callee);f()}});if(O==top){(function(){if(J){return}try{j.documentElement.doScroll("left")}catch(X){setTimeout(arguments.callee,0);return}f()})()}}if(M.wk){(function(){if(J){return}if(!/loaded|complete/.test(j.readyState)){setTimeout(arguments.callee,0);return}f()})()}s(f)}}();function f(){if(J){return}try{var Z=j.getElementsByTagName("body")[0].appendChild(C("span"));Z.parentNode.removeChild(Z)}catch(aa){return}J=true;var X=U.length;for(var Y=0;Y<X;Y++){U[Y]()}}function K(X){if(J){X()}else{U[U.length]=X}}function s(Y){if(typeof O.addEventListener!=D){O.addEventListener("load",Y,false)}else{if(typeof j.addEventListener!=D){j.addEventListener("load",Y,false)}else{if(typeof O.attachEvent!=D){i(O,"onload",Y)}else{if(typeof O.onload=="function"){var X=O.onload;O.onload=function(){X();Y()}}else{O.onload=Y}}}}}function h(){if(T){V()}else{H()}}function V(){var X=j.getElementsByTagName("body")[0];var aa=C(r);aa.setAttribute("type",q);var Z=X.appendChild(aa);if(Z){var Y=0;(function(){if(typeof Z.GetVariable!=D){var ab=Z.GetVariable("$version");if(ab){ab=ab.split(" ")[1].split(",");M.pv=[parseInt(ab[0],10),parseInt(ab[1],10),parseInt(ab[2],10)]}}else{if(Y<10){Y++;setTimeout(arguments.callee,10);return}}X.removeChild(aa);Z=null;H()})()}else{H()}}function H(){var ag=o.length;if(ag>0){for(var af=0;af<ag;af++){var Y=o[af].id;var ab=o[af].callbackFn;var aa={success:false,id:Y};if(M.pv[0]>0){var ae=c(Y);if(ae){if(F(o[af].swfVersion)&&!(M.wk&&M.wk<312)){w(Y,true);if(ab){aa.success=true;aa.ref=z(Y);ab(aa)}}else{if(o[af].expressInstall&&A()){var ai={};ai.data=o[af].expressInstall;ai.width=ae.getAttribute("width")||"0";ai.height=ae.getAttribute("height")||"0";if(ae.getAttribute("class")){ai.styleclass=ae.getAttribute("class")}if(ae.getAttribute("align")){ai.align=ae.getAttribute("align")}var ah={};var X=ae.getElementsByTagName("param");var ac=X.length;for(var ad=0;ad<ac;ad++){if(X[ad].getAttribute("name").toLowerCase()!="movie"){ah[X[ad].getAttribute("name")]=X[ad].getAttribute("value")}}P(ai,ah,Y,ab)}else{p(ae);if(ab){ab(aa)}}}}}else{w(Y,true);if(ab){var Z=z(Y);if(Z&&typeof Z.SetVariable!=D){aa.success=true;aa.ref=Z}ab(aa)}}}}}function z(aa){var X=null;var Y=c(aa);if(Y&&Y.nodeName=="OBJECT"){if(typeof Y.SetVariable!=D){X=Y}else{var Z=Y.getElementsByTagName(r)[0];if(Z){X=Z}}}return X}function A(){return !a&&F("6.0.65")&&(M.win||M.mac)&&!(M.wk&&M.wk<312)}function P(aa,ab,X,Z){a=true;E=Z||null;B={success:false,id:X};var ae=c(X);if(ae){if(ae.nodeName=="OBJECT"){l=g(ae);Q=null}else{l=ae;Q=X}aa.id=R;if(typeof aa.width==D||(!/%$/.test(aa.width)&&parseInt(aa.width,10)<310)){aa.width="310"}if(typeof aa.height==D||(!/%$/.test(aa.height)&&parseInt(aa.height,10)<137)){aa.height="137"}j.title=j.title.slice(0,47)+" - Flash Player Installation";var ad=M.ie&&M.win?"ActiveX":"PlugIn",ac="MMredirectURL="+O.location.toString().replace(/&/g,"%26")+"&MMplayerType="+ad+"&MMdoctitle="+j.title;if(typeof ab.flashvars!=D){ab.flashvars+="&"+ac}else{ab.flashvars=ac}if(M.ie&&M.win&&ae.readyState!=4){var Y=C("div");X+="SWFObjectNew";Y.setAttribute("id",X);ae.parentNode.insertBefore(Y,ae);ae.style.display="none";(function(){if(ae.readyState==4){ae.parentNode.removeChild(ae)}else{setTimeout(arguments.callee,10)}})()}u(aa,ab,X)}}function p(Y){if(M.ie&&M.win&&Y.readyState!=4){var X=C("div");Y.parentNode.insertBefore(X,Y);X.parentNode.replaceChild(g(Y),X);Y.style.display="none";(function(){if(Y.readyState==4){Y.parentNode.removeChild(Y)}else{setTimeout(arguments.callee,10)}})()}else{Y.parentNode.replaceChild(g(Y),Y)}}function g(ab){var aa=C("div");if(M.win&&M.ie){aa.innerHTML=ab.innerHTML}else{var Y=ab.getElementsByTagName(r)[0];if(Y){var ad=Y.childNodes;if(ad){var X=ad.length;for(var Z=0;Z<X;Z++){if(!(ad[Z].nodeType==1&&ad[Z].nodeName=="PARAM")&&!(ad[Z].nodeType==8)){aa.appendChild(ad[Z].cloneNode(true))}}}}}return aa}function u(ai,ag,Y){var X,aa=c(Y);if(M.wk&&M.wk<312){return X}if(aa){if(typeof ai.id==D){ai.id=Y}if(M.ie&&M.win){var ah="";for(var ae in ai){if(ai[ae]!=Object.prototype[ae]){if(ae.toLowerCase()=="data"){ag.movie=ai[ae]}else{if(ae.toLowerCase()=="styleclass"){ah+=' class="'+ai[ae]+'"'}else{if(ae.toLowerCase()!="classid"){ah+=" "+ae+'="'+ai[ae]+'"'}}}}}var af="";for(var ad in ag){if(ag[ad]!=Object.prototype[ad]){af+='<param name="'+ad+'" value="'+ag[ad]+'" />'}}aa.outerHTML='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"'+ah+">"+af+"</object>";N[N.length]=ai.id;X=c(ai.id)}else{var Z=C(r);Z.setAttribute("type",q);for(var ac in ai){if(ai[ac]!=Object.prototype[ac]){if(ac.toLowerCase()=="styleclass"){Z.setAttribute("class",ai[ac])}else{if(ac.toLowerCase()!="classid"){Z.setAttribute(ac,ai[ac])}}}}for(var ab in ag){if(ag[ab]!=Object.prototype[ab]&&ab.toLowerCase()!="movie"){e(Z,ab,ag[ab])}}aa.parentNode.replaceChild(Z,aa);X=Z}}return X}function e(Z,X,Y){var aa=C("param");aa.setAttribute("name",X);aa.setAttribute("value",Y);Z.appendChild(aa)}function y(Y){var X=c(Y);if(X&&X.nodeName=="OBJECT"){if(M.ie&&M.win){X.style.display="none";(function(){if(X.readyState==4){b(Y)}else{setTimeout(arguments.callee,10)}})()}else{X.parentNode.removeChild(X)}}}function b(Z){var Y=c(Z);if(Y){for(var X in Y){if(typeof Y[X]=="function"){Y[X]=null}}Y.parentNode.removeChild(Y)}}function c(Z){var X=null;try{X=j.getElementById(Z)}catch(Y){}return X}function C(X){return j.createElement(X)}function i(Z,X,Y){Z.attachEvent(X,Y);I[I.length]=[Z,X,Y]}function F(Z){var Y=M.pv,X=Z.split(".");X[0]=parseInt(X[0],10);X[1]=parseInt(X[1],10)||0;X[2]=parseInt(X[2],10)||0;return(Y[0]>X[0]||(Y[0]==X[0]&&Y[1]>X[1])||(Y[0]==X[0]&&Y[1]==X[1]&&Y[2]>=X[2]))?true:false}function v(ac,Y,ad,ab){if(M.ie&&M.mac){return}var aa=j.getElementsByTagName("head")[0];if(!aa){return}var X=(ad&&typeof ad=="string")?ad:"screen";if(ab){n=null;G=null}if(!n||G!=X){var Z=C("style");Z.setAttribute("type","text/css");Z.setAttribute("media",X);n=aa.appendChild(Z);if(M.ie&&M.win&&typeof j.styleSheets!=D&&j.styleSheets.length>0){n=j.styleSheets[j.styleSheets.length-1]}G=X}if(M.ie&&M.win){if(n&&typeof n.addRule==r){n.addRule(ac,Y)}}else{if(n&&typeof j.createTextNode!=D){n.appendChild(j.createTextNode(ac+" {"+Y+"}"))}}}function w(Z,X){if(!m){return}var Y=X?"visible":"hidden";if(J&&c(Z)){c(Z).style.visibility=Y}else{v("#"+Z,"visibility:"+Y)}}function L(Y){var Z=/[\\\"<>\.;]/;var X=Z.exec(Y)!=null;return X&&typeof encodeURIComponent!=D?encodeURIComponent(Y):Y}var d=function(){if(M.ie&&M.win){window.attachEvent("onunload",function(){var ac=I.length;for(var ab=0;ab<ac;ab++){I[ab][0].detachEvent(I[ab][1],I[ab][2])}var Z=N.length;for(var aa=0;aa<Z;aa++){y(N[aa])}for(var Y in M){M[Y]=null}M=null;for(var X in swfobject){swfobject[X]=null}swfobject=null})}}();return{registerObject:function(ab,X,aa,Z){if(M.w3&&ab&&X){var Y={};Y.id=ab;Y.swfVersion=X;Y.expressInstall=aa;Y.callbackFn=Z;o[o.length]=Y;w(ab,false)}else{if(Z){Z({success:false,id:ab})}}},getObjectById:function(X){if(M.w3){return z(X)}},embedSWF:function(ab,ah,ae,ag,Y,aa,Z,ad,af,ac){var X={success:false,id:ah};if(M.w3&&!(M.wk&&M.wk<312)&&ab&&ah&&ae&&ag&&Y){w(ah,false);K(function(){ae+="";ag+="";var aj={};if(af&&typeof af===r){for(var al in af){aj[al]=af[al]}}aj.data=ab;aj.width=ae;aj.height=ag;var am={};if(ad&&typeof ad===r){for(var ak in ad){am[ak]=ad[ak]}}if(Z&&typeof Z===r){for(var ai in Z){if(typeof am.flashvars!=D){am.flashvars+="&"+ai+"="+Z[ai]}else{am.flashvars=ai+"="+Z[ai]}}}if(F(Y)){var an=u(aj,am,ah);if(aj.id==ah){w(ah,true)}X.success=true;X.ref=an}else{if(aa&&A()){aj.data=aa;P(aj,am,ah,ac);return}else{w(ah,true)}}if(ac){ac(X)}})}else{if(ac){ac(X)}}},switchOffAutoHideShow:function(){m=false},ua:M,getFlashPlayerVersion:function(){return{major:M.pv[0],minor:M.pv[1],release:M.pv[2]}},hasFlashPlayerVersion:F,createSWF:function(Z,Y,X){if(M.w3){return u(Z,Y,X)}else{return undefined}},showExpressInstall:function(Z,aa,X,Y){if(M.w3&&A()){P(Z,aa,X,Y)}},removeSWF:function(X){if(M.w3){y(X)}},createCSS:function(aa,Z,Y,X){if(M.w3){v(aa,Z,Y,X)}},addDomLoadEvent:K,addLoadEvent:s,getQueryParamValue:function(aa){var Z=j.location.search||j.location.hash;if(Z){if(/\?/.test(Z)){Z=Z.split("?")[1]}if(aa==null){return L(Z)}var Y=Z.split("&");for(var X=0;X<Y.length;X++){if(Y[X].substring(0,Y[X].indexOf("="))==aa){return L(Y[X].substring((Y[X].indexOf("=")+1)))}}}return""},expressInstallCallback:function(){if(a){var X=c(R);if(X&&l){X.parentNode.replaceChild(l,X);if(Q){w(Q,true);if(M.ie&&M.win){l.style.display="block"}}if(E){E(B)}}a=false}}}}();

	var $=require("jquery"),base=module.uri.replace(/\/[^\/]*$/gi,""),u=window.navigator.userAgent
	,isSupportFlash=swfobject.hasFlashPlayerVersion("9.0.28")
	,isSupportFormData=(typeof window["FormData"]=="function")
	,isSupportTouch=("ontouchend" in document)
	,isMobile=isSupportTouch&&u.indexOf("Mobile")>-1//是否为手机终端
	,isiPhone=(!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/))||( u.indexOf('iPad') > -1)||(u.indexOf('iPhone') > -1 ) || (u.indexOf('Mac') > -1);

	function _flash_uploader(handler,options){
		this.handler=handler;
		this.options=$.extend({},_flash_uploader.options,options);
		this.state=0;
		this.flash=true;
		this.render();
		this.files=[];
	}
	_flash_uploader.options={//flash上传默认配置
		upload_url:"",
		file_size_limit:1073741824,//设置为1TB
		file_queue_limit:100,
		post_params:{},
		file_post_name:"upfile",
		file_upload_limit:100,
		file_types_description:"请选择文件",
		file_types:"*.*",
		flash_url:base+"/swfupload.swf",//STUpload3.swf
		//button_image_url:base+"/default.png",
		button_width: 100,//按钮大小
		button_height: 25,
		multiple:true
	};
	_flash_uploader.prototype={
		constructor: _flash_uploader,
		start:function(){
			var that=this;
			this.stop();
			this.timer=setTimeout(function(){
				that.oflash&&that.oflash.startUpload();
				(that.state!=1)&&that.handler.fire("onstart");
				that.state=1;
			},10);
		},
		open:function(){//这个方法 不可靠 建议不用
			if(!this.oflash)return;
			if(this.options.multiple)this.oflash.selectFiles();
			else this.oflash.selectFile();
		},
		stop:function(){
			if(this.timer)clearTimeout(this.timer);
			(this.state!=0)&&this.handler.fire("onend");
			this.state=0;
		},
		abort:function(id){
			this.oflash&&this.oflash.cancelUpload(id);
			this.handler.fire("onabort",id);
		},
		remove:function(id){
			this.oflash&&this.oflash.cancelUpload(id,false);
		},
		wrapfile:function(file){//将对象外包
			return this.handler.wrapfile({name:file.name,size:file.size,id:file.id,index:file.index});
		},
		render:function(){
			var handler=this.handler,opt=this.options,$content=handler.$content,that=this;
			if(this.oflash)this.oflash.destroy();
			$content.empty().append("<div></div>");
			//var render=this.options.render;
			//var ohtml="点击上传";
			//ohtml=((typeof render=="function")?render(true):render)||ohtml;

			/*$content.html("\
	<div style='position:relative;'>\
	<div data-button='1'></div>\
	<div data-button='flash' style='position:absolute;z-index:998;left:0px;top:0px;'><div></div></div>\
	</div>\
	");*/
			//<div data-button='0' style='position:absolute;z-index:999;display:none;'></div>\
			//$content.find("[data-button='1']").eq(0).html(ohtml);

			var button_window_mode=SWFUpload.WINDOW_MODE.WINDOW;
			if(opt.mode=="opaque")button_window_mode=SWFUpload.WINDOW_MODE.OPAQUE;
			else if(opt.mode=="transparent")button_window_mode=SWFUpload.WINDOW_MODE.TRANSPARENT;

			$.extend(this.options,{
				button_placeholder:$content.children("div").eq(0).get(0),
				button_cursor:SWFUpload.CURSOR.HAND,
				button_window_mode:button_window_mode,//OPAQUE  WINDOW
				//flash_url:opt.flash_url,
				//button_image_url:opt.button_image_url,
				button_action:opt.multiple?SWFUpload.BUTTON_ACTION.SELECT_FILES:SWFUpload.BUTTON_ACTION.SELECT_FILE,

				swfupload_loaded_handler:function(){
					handler.fire("oninit",handler);
				},
				//自定义的事件集合
				file_dialog_complete_handler:function(files,queued,total){//选择文件数量 当前队列数量 总数
		    		if(files>queued){
		    			return handler.fire("onerror","选择文件发生异常！");
		    		}
		    		handler.fire("onfiles",that.files);
				},
		    	file_dialog_start_handler:function(){
		    		that.files=[];
		    	},
				file_queued_handler:function(file){
					that.files.push(that.wrapfile(file));//返回name size
				},
				upload_success_handler: function(file, data,received){
					var f=that.wrapfile(file);
					handler.fire("onsuccess",f,data,received);
					handler.fire("onloadend",f,data,true,received);
		        },
		    	upload_progress_handler: function(file,completeBytes,totalBytes){
					var f=that.wrapfile(file);
					f.total=totalBytes||0;
					f.buffer=completeBytes||0;
					f.percent=file.total<1?100:Math.round(f.buffer * 100 / f.total);
					handler.fire("onloadprogress",f);
		    	},
		        upload_error_handler: function(file,errorCode, message){
		        	var f=that.wrapfile(file);
		        	handler.fire("onerror",f,message,errorCode);
		        	handler.fire("onloadend",f,message,false,errorCode);
		        	this.setButtonDisabled(false);
		    	},
				upload_start_handler:function(file){
					this.setButtonDisabled(true);
					handler.fire("onloadstart",that.wrapfile(file));
				},
				upload_complete_handler:function(){//都会被执行
					this.setButtonDisabled(false);
				},
				queue_complete_handler:function(){//队列
					that.stop();
				}
			});
		    this.oflash = new SWFUpload(this.options);
		}
	}
	/*
	function _simple_flash_uploader_handler($content,options){
		this.$content=$content;
		this.options=options;
		this.ObjectId="Simple_Flash_Upload_"+(_simple_flash_uploader_handler._object_id++);
		this.FlashId=this.ObjectId+"_Flash_Object";
		this.index=0;
		
		this.files={};
		this.queued=[];
		this.total=0;
		this.oreq=null;

		this.$content.html("\
		<div style='position:relative;'>\
		<div data-button='1'></div>\
		<div data-button='flash' style='position:absolute;z-index:998;left:0px;top:0px;'></div>\
		<div data-button='0' style='position:absolute;z-index:999;display:none;'></div>\
		</div>\
		");
		this.$button=this.$content.find("div[data-button='1']:eq(0)");
		this.$buttonOver=this.$content.find("div[data-button='0']:eq(0)");
		this.$buttonContent=this.$content.find("div[data-button='flash']:eq(0)");
		this.render();
		//this.bind();
	}

	_simple_flash_uploader_handler.prototype={
		constructor:_simple_flash_uploader_handler,
		swfobject:swfobject,//使用swfobject 创建对象
		destroy:function(){
			this.$content.empty();
		},
		render:function(){
			var that=this,opt=this.options,oswf=this.swfobject,supportSwf=oswf.hasFlashPlayerVersion("9.0.28"),render=opt.render;
			var ohtml=(supportSwf?"<div style='width:100px;height:50px;background-color:blue;display:block;'>上传按钮</div>":"当前无法支持flash!");
			ohtml=((typeof render=="function")?render():render)||ohtml;
			this.$button.html(ohtml);
			if(!supportSwf)return;
			var params={
				width:this.$content.width(),height:this.$content.height(),align:"top",
				"vmode":"transparent",
				"url":opt.flash_url,
				//flashvars:"uploadurl%3D%252Fi%253Frt%253D0%2526rn%253D10%2526stt%253D0%2526ct%253D0%2526tn%253Dshituresult%2526fr%253Dflash%26amp%3Blogurl%3D%252F5.gif%253Fclass%253Dstu%2526fr%253Dflash%2526t%253D%26amp%3Bcompress%3D1"
				flashvars:encodeURIComponent("uploadurl="+(opt.upload_url||"")+"&logurl=abc")
			}
			this.$buttonContent.html(this.createHTML(this.FlashId,params));
			var w=window;
			w[this.FlashId+"_onInit"]=function(){
			    var o = $("#"+that.FlashId).get(0);
			    o.setUploadFileType("文本文件(*.txt)|*.txt|图片文件(*.jpg,*.bmp,*.png)|*.jpg;*.bmp;*.png|所有文件(*.*)|*.*");
			    o.setUploadFileUrl(opt.upload_url);
			}
		},
		createHTML:function(id,params){
			return '\
			<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" \
			id="'+id+'"  width="'+params.width+'" height="'+params.height+'" align="'+params.align+'">\
			'+(params.wmode?('<param name="wmode" value="'+params.wmode+'">'):'')+'\
			'+(params.url?('<param name="movie" value="'+params.url+'">'):'')+'\
			<param name="flashvars" value="'+(params.flashvars||'')+'">\
			<embed width="'+params.width+'" height="'+params.height+'" align="'+params.align+'" wmode="'+(params.wmode||"transparent")+'" ver="9.0.28" \
			flashvars="'+(params.flashvars||'')+'" src="'+(params.url||'')+'" name="'+id+'"  type="application/x-shockwave-flash" \
			pluginspage="http://www.macromedia.com/go/getflashplayer" /></object>\
			';
		}
	}
	_simple_flash_uploader_handler._object_id=0;

	function _simple_flash_uploader(handler,options){
		this.handler=handler;
		this.options=$.extend({},_simple_flash_uploader.options,options);
		this.state=0;
		this.flash=true;
		this.render();
		this.files=[];
	}
	_simple_flash_uploader.options={//flash上传默认配置
		upload_url:"",
		file_size_limit:1073741824,//设置为1TB
		file_queue_limit:100,
		post_params:{},
		file_post_name:"upfile",
		file_upload_limit:100,
		//file_types_description:"请选择文件",
		//file_types:"*.*",
		flash_url:base+"/FileUploader.swf",
		button_width: 100,//按钮大小
		button_height: 25,
		multiple:true
	};
	_simple_flash_uploader.prototype={
		constructor: _simple_flash_uploader,
		start:function(){
			var that=this;
			this.stop();
			this.timer=setTimeout(function(){
				that.oflash&&that.oflash.startUpload();
				(that.state!=1)&&that.handler.fire("onstart");
				that.state=1;
			},10);
		},
		stop:function(){
			if(this.timer)clearTimeout(this.timer);
			(this.state!=0)&&this.handler.fire("onend");
			this.state=0;
		},
		abort:function(id){
			this.oflash&&this.oflash.cancelUpload(id);
			this.handler.fire("onabort",id);
		},
		remove:function(id){
			this.oflash&&this.oflash.cancelUpload(id,false);
		},
		wrapfile:function(file){//将对象外包
			return this.handler.wrapfile({name:file.name,size:file.size,id:file.id,index:file.index});
		},
		unrender:function(){
			this.$content.html("你的版本暂不支持flash,请更新程序！");
		},
		render:function(){
			var handler=this.handler,opt=this.options,$content=handler.$content,that=this;
			if(this.oflash)this.oflash.destroy();
			//$content.empty().append("<div />");
			$.extend(this.options,{
				file_dialog_start_handler:function(){
					that.files=[];
				},
				file_dialog_complete_handler:function(files){//(html5 返回选中的文件数组)
					for(var i=0,len=files.length;i<len;i++){
						that.files.push(that.wrapfile(files[i]));
					}
					handler.fire("onfiles",that.files);
				},
				upload_success_handler: function(file, data,received){
					var f=that.wrapfile(file);
					handler.fire("onsuccess",f,data,received);
					handler.fire("onloadend",f,data,true,received);
		        },
		    	upload_progress_handler: function(file,completeBytes,totalBytes){
					var f=that.wrapfile(file);
					f.total=totalBytes||0;
					f.buffer=completeBytes||0;
					f.percent=file.total<1?100:Math.round(f.buffer * 100 / f.total);
					handler.fire("onloadprogress",f);
		    	},
		        upload_error_handler: function(file,errorCode, message){
		        	var f=that.wrapfile(file);
		        	handler.fire("onerror",f,message,errorCode);
		        	handler.fire("onloadend",f,message,false,errorCode);
		        	this.setButtonDisabled(false);
		    	},
				upload_start_handler:function(file){
					this.setButtonDisabled(true);
					handler.fire("onloadstart",that.wrapfile(file));
				},
				upload_complete_handler:function(){
					this.setButtonDisabled(false);
				},
				queue_complete_handler:function(){//队列
					that.stop();
				}
			});
			this.oflash=new _simple_flash_uploader_handler($content,this.options);
		}
	}
	*/
	

	function _html5_uploader_handler($content,options){
		this.$content=$content;
		this.options=options;
		this.ObjectId="Html5_Upload_"+(_html5_uploader_handler._object_id++);
		this.index=0;
		this.$content.html("\
<div style='position:relative;'>\
<div data-button='1' style='cursor:pointer'></div>\
<div data-button='0' style='position:absolute;z-index:999;display:none;'></div>\
</div>\
");
		if(this.options.button_width)this.$content.width(this.options.button_width);
		if(this.options.button_height)this.$content.height(this.options.button_height);

		//this.$file=this.$content.find("input:eq(0)");
		this.$button=this.$content.find("div[data-button='1']:eq(0)");
		this.$buttonOver=this.$content.find("div[data-button='0']:eq(0)");

		this.$button.width(this.$content.width()).height(this.$content.height());
		//var render=this.options.render;
		//var ohtml="<input type='button' value='Select File'></input>";
		//ohtml=((typeof render=="function")?render():render)||ohtml;
		//this.$button.html(ohtml);


		this.files={};
		this.queued=[];
		this.total=0;
		this.oreq=null;
		this.bind();
	}
	_html5_uploader_handler._object_id=0;

	_html5_uploader_handler.prototype={
		constructor: _html5_uploader_handler,
		setButtonDisabled:function(flag){
			if(!flag)this.$buttonOver.hide();
			else{
				this.$buttonOver.show().css(this.$button.position()).width(this.$button.width()).height(this.$button.height());
			}
		},
		_upload_end:function(){
			var that=this;
			this.loading=false;
			this.trigger("upload_complete_handler");
			if(this.queued.length<1)this.trigger("queue_complete_handler");
			that._upload_start();
		},
		_upload_success:function(data,received){
			if(this.ret++)return;
			this.trigger("upload_success_handler",this.post_file,data,received);
			this._upload_end();
		},
		_upload_error:function(message,code){
			if(this.ret++)return;
			this.trigger("upload_error_handler",this.post_file,message,code);
			this._upload_end();
		},
		_upload_start:function(){
			if(this.loading||this.queued.length<1)return;
			this.loading=true;
			this.post_file=this.queued.shift();
			this._upload_runing();
		},
		startUpload:function(){
			this._upload_start();
		},
		cancelUpload:function(id,triggerErrorEvent){
			if(this.post_file&&(this.post_file.id==id||!id)){
				this.oxhr&&this.oxhr.abort();
			}
			if(!id)return (this.queued=[]);
			var i=this.queued.length-1;
			while(i>-1){
				if(this.queued[i].id==id)this.queued.splice(i,1);
				i--;
			}
		},

        trigger:function(type){
        	var opt=this.options;
            return opt[type]&&opt[type].apply(this,[].slice.call(arguments,1));
        },
		destroy:function(){
			this.$content.empty();
		}
	}

	if(isSupportFormData){
		_html5_uploader_handler.prototype.bind=function(){//支持FromData方式
			var that=this,opt=this.options;
			var selectfile=function(domfile){
				var ofiles=domfile.files,files=[];
				for(var i=0,len=ofiles.length;i<len;i++){
					var id=that.ObjectId+"_"+(that.index),ofile=ofiles[i],file;
					file=that.files[id]={id:id,index:that.index,name:ofile.name,size:ofile.size,target:ofile};
					that.trigger("file_queued_handler",file);
					that.index++;
					files.push(file);
					that.queued.push(file);
				}
				that.trigger("file_dialog_complete_handler",files);
			}
			if(!this.$file){
				this.$file=$("<input type='file' "+(this.options.multiple?" multiple='multiple' ":"")+" "+(this.options.accept?" accept='"+this.options.accept+"' ":"")+"></input>");
				this.$content.append("<form style='display:none;'></form>").find("form").append(this.$file);
				//this.$content.append("<form ><input type='file' "+(this.options.multiple?" multiple='multiple' ":"")+"></input></form>");
				//this.$file=this.$content.find("input");
			}
			this.$button.click(function(){
				that.trigger("file_dialog_start_handler");
				that.$file.trigger("click");
			});
			this.$file.off("change").change(function(){
				selectfile(this);
			});
		};


		_html5_uploader_handler.prototype._upload_runing=function(){
			if(this.oxhr)this.oxhr.abort();
			var that=this,oxhr=this.oxhr;
			this.ret=0;
			if(!this.oxhr){
				var _response_end=function(o){//执行结果却不知道
					if(o.readyState==4){
						if((o.status >= 200 && o.status < 300 ) || o.status == 304 )
							that._upload_success(o.responseText,o.status);
						else
							that._upload_error(o.responseText||o.statusText,o.status);
					}
				}
				oxhr=this.oxhr = new XMLHttpRequest();
				oxhr.upload.addEventListener("progress", function(evt){
					if(!evt.lengthComputable)return;
					that.trigger("upload_progress_handler",that.post_file,evt.loaded,evt.total);
				}, false);
				oxhr.addEventListener("loadstart", function(evt){
					that.trigger("upload_start_handler",that.post_file);
				}, false);
				//成功加载 在无法获得有效值的情况 无法判定为成功 还是失败
				oxhr.addEventListener("load", function(evt){
					_response_end(evt.currentTarget||evt.srcElement||evt.target);
				}, false);
				//loadend 表示文件上传完毕 但是 未必是在最后会触发，所以一个文件的完整结束 在succeed 以及 error 方法内执行
				//oxhr.addEventListener("loadend",function(evt){}, false);
				oxhr.addEventListener("error", function(evt){//请求严重错误抛出 例如404之类 不会抛出
					that._upload_error("error",0);
				}, false);
				oxhr.addEventListener("abort", function(evt){
					that._upload_error("abort",-280);
				}, false);
				oxhr.onreadystatechange = function(){
					_response_end(oxhr);
				}
			}
			var file=this.post_file,fd=new FormData(),data=this.options.post_params;
			if(!(file&&file.target))return this._upload_end();
			fd.append(this.options.file_post_name||"upfile",file.target);
			//oxhr.setRequestHeader("Content-type", "multipart/form-data;");
			for(var k in data){
				data.hasOwnProperty(k)&&(fd.append(k,data[k]));
			}
			oxhr.open("POST",this.options.upload_url);
			oxhr.send(fd);
		};

	}
	else{
		_html5_uploader_handler.prototype.bind=function(){//手机采用方式
			var that=this,opt=this.options;
			var selectfile=function(domfile){
				var ofiles=domfile.files,files=[];
				if(ofiles.length<1)return;
				var id=that.ObjectId+"_"+(that.index),i=0,ofile=ofiles[i],file;
				file=that.files[id]={id:id,index:that.index,name:ofile.name,size:ofile.size,target:domfile,win:that.win,doc:that.doc,$iframe:that.$iframe};
				that.trigger("file_queued_handler",file);
				that.index++;
				files.push(file);
				that.queued.push(file);
				that.trigger("file_dialog_complete_handler",files);
				that.$file=null;
			};
			this.$button.click(function(){
				that.trigger("file_dialog_start_handler");
				if(!that.$file){
					that.$file=$("<input type='file' name='"+(that.options.file_post_name||"upfile")+"'></input>");
					this.$file=$("<input type='file' "+(that.options.multiple?" multiple='multiple' ":"")+" "+(that.options.accept?" accept='"+that.options.accept+"' ":"")+"></input>");
					that.$iframe=$("<iframe src='javascript:false;' style='display:none;'></iframe>");//style='position:absolute;left:-1000px;' style='position:absolute;left:-1000px;'
					that.win=that.$iframe.appendTo(that.$content).get(0).contentWindow;
					that.doc=that.win.document;
					that.$body=$(that.doc.body);
					that.$body.html("<form enctype='multipart/form-data' method='post' action='"+opt.upload_url+"'><input type='submit' value='提交'></input></form>").children(":eq(0)").append(that.$file);
					that.$file.change(function(){
						selectfile(this);
					});
				}
				setTimeout(function(){
					that.$file.trigger("click");
				},1);
				
			});
		};
		_html5_uploader_handler.prototype._upload_runing=function(){
			if(this.oxhr)this.oxhr.abort();
			var that=this,file=this.post_file,$file=$(file.target),$form=$file.parent();//form
			this.ret=0;
			that.trigger("upload_start_handler",file);
			file.$iframe.load(function(evt){
				$(this).off("load");
				var iframe=this;
				if (// For Safari 
                    iframe.src == "javascript:'%3Chtml%3E%3C/html%3E';" ||
                    // For FF, IE
                    iframe.src == "javascript:'<html></html>';"){     
                        return;
                }
				var doc = iframe.contentDocument ? iframe.contentDocument : iframe.contentWindow.document;
                if (doc.body && doc.body.innerHTML == "false") {
                    return;
                }
				
				that._upload_success(doc.body.innerHTML);
			});
			$form.submit();
		};
	}


	function _html5_uploader(handler,options){
		this.handler=handler;
		this.options=$.extend({},_html5_uploader.options,options);
		this.html5=true;
		this.ohtml5=null;
		this.files=[];
		this.render();
	}
	_html5_uploader.options={//这里的参数 会全部传递给 _html5_uploader_handler 在render方法内 在临时额外扩展一些对象
		render:null,
		post_params:null,
		file_post_name:"upfile",
		upload_url:""
	}
	_html5_uploader.prototype={
		constructor: _html5_uploader,
		start:function(){
			var that=this;
			this.stop();
			this.timer=setTimeout(function(){
				that.ohtml5&&that.ohtml5.startUpload();
				(that.state!=1)&&that.handler.fire("onstart");
				that.state=1;
			},10);
		},
		stop:function(){
			if(this.timer)clearTimeout(this.timer);
			(this.state!=0)&&this.handler.fire("onend");
			this.state=0;
		},
		abort:function(id){
			this.ohtml5&&this.ohtml5.cancelUpload(id);
			this.handler.fire("onabort",id);
		},
		remove:function(id){
			this.oflash&&this.oflash.cancelUpload(id);
		},
		wrapfile:function(file){//将对象外包
			return this.handler.wrapfile({name:file.name,size:file.size,id:file.id,index:file.index});
		},
		render:function(){
			var handler=this.handler,opt=this.options,$content=handler.$content,that=this;
			if(this.ohtml5)this.ohtml5.destroy();
			//$content.empty().append("<div />");
			$.extend(this.options,{
				file_dialog_start_handler:function(){
					that.files=[];
				},
				file_dialog_complete_handler:function(files){//(html5 返回选中的文件数组)
					for(var i=0,len=files.length;i<len;i++){
						that.files.push(that.wrapfile(files[i]));
					}
					handler.fire("onfiles",that.files);
				},
				upload_success_handler: function(file, data,received){
					var f=that.wrapfile(file);
					handler.fire("onsuccess",f,data,received);
					handler.fire("onloadend",f,data,true,received);
		        },
		    	upload_progress_handler: function(file,completeBytes,totalBytes){
					var f=that.wrapfile(file);
					f.total=totalBytes||0;
					f.buffer=completeBytes||0;
					f.percent=file.total<1?100:Math.round(f.buffer * 100 / f.total);
					handler.fire("onloadprogress",f);
		    	},
		        upload_error_handler: function(file,errorCode, message){
		        	var f=that.wrapfile(file);
		        	handler.fire("onerror",f,message,errorCode);
		        	handler.fire("onloadend",f,message,false,errorCode);
		        	this.setButtonDisabled(false);
		    	},
				upload_start_handler:function(file){
					this.setButtonDisabled(true);
					handler.fire("onloadstart",that.wrapfile(file));
				},
				upload_complete_handler:function(){
					this.setButtonDisabled(false);
				},
				queue_complete_handler:function(){//队列
					that.stop();
				}
			});
			this.ohtml5=new _html5_uploader_handler($content,this.options);
		}
	}
	//内部 唯一使用了加载对象require 用于临时加载swfupload.js
	function _uploader(element,options){//上传按钮
        this.$target=this.$elem= $(element);
        this.$content=$("<div></div>").appendTo(this.$elem);
        this.options=options;
        this.ouploader=null;//上传按钮对象
        this.files={};
	}
	_uploader.prototype={
		constructor: _uploader,
		init:function(){
			var that=this,opt=this.options,render=this.options.render;
			this.filetypes=this.get_file_typs(opt.file_types);
			//this.filetypes=this._init_filetyps();//初始化
			/*if((this.html5===false||opt.primary=="flash")){
				this.flash(function(f){
					f?that.render_flash():that.render_html5();
				});
			}
			else that.render_html5();*/
			_uploader.init(opt.primary,function(_init_type,_support){//将对象初始化 准备一些环境 返回初始化环境

				var ohtml=that.trigger("failed",_init_type,_support);
				if(ohtml)return that.$content.html(ohtml);
				else that.$content.empty();

				if(_init_type=="html5")that.render_html5(_support);
				else if(_init_type=="flash") that.render_flash(_support);
				//else if(_init_type=="simpleflash")that.render_simpleflash();
				else that.render_error(_support);
			});
		},
		render_error:function(){
			this.$content.html("无法初始化对象！");
		},
		render_html5:function(){
			var that=this,opt=this.options;
			if(this.ouploader&&this.ouploader.html5)return;



			this.ouploader=new _html5_uploader(this,{
				multiple:opt.multiple,
				accept:this.filetypes.accept,
				button_width:opt.width,
				button_height:opt.height,
				upload_url:opt.url,//传递上传路径(都按照flash参数标准传递 参数名)
				file_post_name:opt.file_post_name,
				post_params:opt.file_post_data
			});
		},
		render_flash:function(){
			var that=this,opt=this.options;
			if(this.ouploader&&this.ouploader.flash)return;
			this.ouploader=new _flash_uploader(this,{
				file_types:opt.file_types,
				button_width:opt.width,
				button_height:opt.height,
				mode:opt.mode,
				multiple:opt.multiple,
				upload_url:opt.url,//传递上传路径(都按照flash参数标准传递 参数名)
				file_post_name:opt.file_post_name,
				post_params:opt.file_post_data,
			});
		},
		/*
		render_simpleflash:function(){
			var that=this,opt=this.options;
			if(this.ouploader&&this.ouploader.flash)return;
			this.ouploader=new _simple_flash_uploader(this,{
				file_types:opt.file_types,
				multiple:opt.multiple,
				upload_url:opt.url,//传递上传路径(都按照flash参数标准传递 参数名)
				file_post_name:opt.file_post_name,
				post_params:opt.file_post_data,
			});
		},*/
		wrapfileTest:function(file){
			var reg=this.filetypes.reg,opt=this.options;
			reg.lastIndex=0;
			file.errorExt=!reg.test(file.filename);//正则判断
			file.errorMin=file.size<opt.file_min_size;//
			file.errorMax=file.size>opt.file_max_size;//
			file.error=(file.errorExt||file.errorMin||file.errorMax)?true:false;
		},
		wrapfile:function(file){
			var _file=this.files[file.id];
			if(!_file){
				var filesize="",gb=1024*1024*1024,mb=1024*1024,kb=1024;
				file.filename=file.name.replace(/[\/\\]?([^\/\\.]*)?$/,function($0,$1){return $1;});
				file.filename.replace(/[.](.+)$/,function($0,$1){return file.filetype=$1;});
				if(file.size>gb)filesize=(Math.round(file.size * 100 / gb) / 100)+ 'GB';
				else if(file.size>mb)filesize=(Math.round(file.size * 100 / mb) / 100)+ 'MB';
				else if(file.size>kb)filesize=(Math.round(file.size * 100 / kb) / 100)+ 'KB';
				else filesize=(Math.round(file.size * 100) / 100)+ 'B';
				file.filesize=filesize;
				_file=this.files[file.id]=$.extend({},file);
			}
			else $.extend(_file,file);
			return _file;
		},
		onfiles:function(files){
			files=files||[];
			var f=true;
			for(var i=0,len=files.length;i<len;i++){
				this.wrapfileTest(files[i]);
				if(this.trigger("onfile",files[i])===false){
					f=false;
					this.ouploader.remove(files.id);
				}
			}
			if(this.trigger("onfiles",files)===false){
				this.ouploader.remove();
				f=false;
			}
			if(f&&this.options.auto&&files&&files.length)this.ouploader.start();//开始上传
		},
        fire:function(type){//执行fire 的时候 如果发现没有拦截方法 则直接执行options方法
        	var f=this[type]||this.options[type];
            return f&&f.apply(this,[].slice.call(arguments,1));
        },
        trigger:function(type){
        	var opt=this.options;
            return opt[type]&&opt[type].apply(this,[].slice.call(arguments,1));
        },
        start:function(){
        	this.ouploader&&this.ouploader.start();
        },
        abort:function(id){
        	this.ouploader&&this.ouploader.abort(id);
        },
        open:function(){
        	this.ouploader&&this.ouploader.open();
        },
        stop:function(){
        	this.ouploader&&this.ouploader.stop();
        },
		get_file_typs:function(file_types){
			var that=this,opt=this.options,res={},list=[];
			res.accept=(file_types||"").toLowerCase().replace(/([*])[.]([0-9a-z_]+)/gi,function($0,$1,$2){
				list.push($2);
				return that.accepts[$2]||"";
			}).replace(/;/g,',');
			res.reg=new RegExp(".*[.]("+(list.length?list.join("|"):".*")+")$","g");
			return res;
		},
		accepts:{
			"*":"",
			"xls":"application/msexcel",
			"xlsx":"application/msexcel",
			"doc":"application/msword",
			"pdf":"application/msword",
			"pdf":"application/pdf",
			"poscript":"application/poscript",
			"rtf":"application/rtf",
			"zip":"application/x-zip-compressed",
			"basic":"audio/basic",
			"aiff":"audio/x-aiff",
			"mpeg":"audio/x-mpeg",
			"realaudio":"audio/x-pn/realaudio",
			"waw":"audio/x-waw",
			"gif":"image/gif",
			"jpeg":"image/jpeg",
			"png":"image/png",
			"jpg":"image/jpg",
			"bmp":"image/x-ms-bmp,image/x-ms-bmp",
			"tiff":"image/tiff",
			"html":"text/html",
			"plain":"text/plain",
			"video":"video/quicktime",
			"video":"video/x-mpeg2",
			"video":"video/x-msvideo"
		}
	}
    _uploader.options = { core: "data-plug-uploader"
    ,url:""
    ,file_max_size:1073741824//单位为b 默认1GB
    ,file_min_size:1//至少为1b
    ,file_types:"*.gif;*.jpeg;*.png;*.jpg"
    ,file_post_name:"upfile"
    ,file_post_data:{}
    ,html5render:null
    ,mode:"window"//transparent  window  opaque
    ,auto:true
    ,primary:"html5"//默认预先执行html5 如果html5支持不了 采用flash
    //规范化参数
    ,oninit:null//初始化完成
    //因为脚本上传 没有涉及断点内容  因此对于progress 也没有所谓的加载进度 上传进度 等操作
    ,onfile:null//选择单文件
    ,onfiles:null//选择文件
    ,onstart:null//开始
    ,onloadstart:null//上传开始
    ,onloadprogress:null//上传进程
    ,onloadend:null//上传结束
    ,onsuccess:null//上传成功
    ,onabort:null//上传终止
    ,onerror:null//上传错误

    ,onend:null//结束 (成功失败 都会执行)
	};
	_uploader.list=[];
	_uploader.html5=isSupportFormData;

	_uploader.init=function(primary,fn){//初始化
		var self=this;
		if(isiPhone)return fn&&fn("html5",isSupportFormData);
		var def="";
		if(primary=="flash"){//flash优先
			if(isMobile)def="flash";
			else def=isSupportFlash?"flash":(isSupportFormData?"html5":"flash");
		}
		else{
			if(isMobile)def="html5";
			else def=isSupportFormData?"html5":(isSupportFlash?"flash":"html5");
		}
		if(def=="flash"){
			self.list.push(fn);
			if(self.async_callback!=null)return self.async_callback();
			if(self.loading)return;self.loading=true;//.async 方法内部应该对于一些重复请求 有处理 不过在外面也加一层过滤
			require.async(["./swfupload.js","./swfupload.queue.js"],function(){
				self.async_callback=function(){
					var p,self=this;
					while((p=self.list.shift())){
						p&&p("flash",isSupportFlash);
					}
				}
				self.async_callback();
			});
		}
		else  return fn&&fn("html5",isSupportFormData);//是否支持html5 FormData
	}
	//插件初始化 代码快
    $.fn.uploader = function (options, cmd) {
        var _options = _uploader.options,_arguments=arguments;
        return this.each(function () {
            var $this = $(this), data = $this.data(_options.core);
            if (!data) $this.data(_options.core, (data = new _uploader(this, $.extend({},_options))));
            if (typeof options == 'object') {
				$.extend(data.options,options);
				data["init"]&&data.init();
            }
            if (typeof options == 'string' && data[options]) data[options].apply(data,[].slice.call( _arguments ,1));
            else if (typeof cmd == 'string' && data[cmd]) data[cmd].apply(data,[].slice.call( _arguments ,2));
        });
    }
	exports.init=function (content, options) {
        $(content).uploader(options);
        return $(content).data(_uploader.options.core);
    }

    exports._debug=function(){
    	return exports.debug&&exports.debug.apply(this,[].slice.call(arguments ,0));
    };
});