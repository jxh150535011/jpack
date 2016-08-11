(function($){
	//LOAD_COMPLETE=__upload__LOAD_COMPLETE
	var upload={global:"__upload__"};//定义基本容器
	upload.defaults = {core:"data-plug-upload"
	,flash_url:""
	,flashvars:""
	,params:{
        quality : "high",
        allowscriptaccess : "always",//sameDomain
        allowfullscreen : "true",
        wmode:"window"
        //bgcolor : "#333333",
	}
	,trigger:{
		"LOAD_COMPLETE":function(){
			
		}
	}
	}
	function __upload(element,options){
		this.options=options;
		this.$elem = $(element);
		this.id=(this.$elem.attr("id")||"upload_box")+new Date().getTime();
		this.$flash=$("<div />").appendTo(this.$elem);
		this.$process=$("<div />").appendTo(this.$elem);
	};
	__upload.prototype.init=function(){
		var that=this,opt=this.options;
		this.triggers=this.getFlashTrigger();
		this.$flash.html(this.getFlashHTML());
	};
	__upload.prototype.getFlashHTML = function () {//兼容性写法 暂不写百度处理方式
		// Flash Satay object syntax: http://www.alistapart.com/articles/flashsatay
		var that=this,opt=this.options;
		//WINDOW       : "window",
		//TRANSPARENT  : "transparent",
		//OPAQUE       : "opaque"
		var url=opt.flash_url+"?"+this.triggers;
		return ['<object ',
		'id="', this.id,'" ',
		'type="application/x-shockwave-flash"  pluginspage="http://www.macromedia.com/go/getflashplayer" ',
		'data="', url,'" ',
		'class="swfupload" >',
		//'<param name="LOAD_COMPLETE" value="' + upload.global + 'LOAD_COMPLETE" />',
		'<param name="movie" value="',url, '" />',
		'<param name="flashvars" value="' + opt.flashvars + '" />',
		this.getFlashParams(),
		'<embed ',
		this.getFlashParams(true),
		'align="middle" ver="10.0.0" ',
		//'LOAD_COMPLETE="'+ upload.global+'LOAD_COMPLETE"',
		'errormessage="Flash插件初始化失败，请更新您的FlashPlayer版本之后重试！" ',
		'flashvars="' +  opt.flashvars + '" ',
		'src="', url, '" ',
		'>',
		'</object>'].join("");
	};
	__upload.prototype.getFlashTrigger=function(){
		var params=this.options.trigger;
		var _u=upload;
		var l=[];
		for(var k in params){
			var eventN=this.id+"_"+k;
			_u[eventN]=params[k];
			l.push(k+'='+_u.global+'.'+eventN+'&');
			alert(typeof __upload__[eventN]);
		}
		return l.join('');
	}
	__upload.prototype.getFlashParams=function(embed){
		var params=this.options.params;
		var l=[];
		for(var k in params){
			if(embed)
				l.push(k+'="'+params[k]+'" ');
			else
				l.push('<param name="'+k+'" value="'+params[k]+'" />');
		}
		return l.join('');
	}
	
	$.fn.upload=function(option,cmd,params){
		var $this=$(this).data(upload.defaults.core);
		if(!$this){
			$this=new __upload($(this),$.extend({},upload.defaults,option));
			$(this).data(upload.defaults.core,$this);
		}
		else
			$this.options=$.extend({},$this.options,option);
		$this.init();
	};
	window[upload.global]=upload;
})(jQuery);