var __jroot=J._get_run_script_url();
var __func=(function(J,jroot){
	var __image=(J.getParam("i",jroot)||"default")+".png";
	return function () {
		var Swf = function (content, options) {
			this.options = options;
			this.$element = $(content);
			this.elementid=this.options.CODENAME+new Date().getTime();
		}
		Swf.prototype = {
		  constructor: Swf
		}
		Swf.prototype.init=function(){
			var that=this;
			this.bpath=J.SCRIPTPATH;
			this.third_party({ready:function(){
				that.event();
			}});
		}
		Swf.prototype.event=function(){
			var that=this,opt=this.options,target=this.$element;
			var bpath=this.bpath;
			var flasho=target.data(opt.flash_object_name);
			if(flasho)flasho.destroy();
			target.empty().append("<div />");
			var option={};
			option.button_placeholder=target.children("div").eq(0).get(0);
			option.button_cursor=SWFUpload.CURSOR.HAND;
			//option.button_window_mode=SWFUpload.WINDOW_MODE.OPAQUE;
			option.button_window_mode=SWFUpload.WINDOW_MODE.WINDOW;
			//option.flash_url=bpath+"/plugins/swf/swfupload.swf";
			if(opt.flash_options.button_image_url=="none")option.button_image_url="";
			else option.button_image_url=bpath+"/plugins/swf/"+__image;
			option.button_action=SWFUpload.BUTTON_ACTION.SELECT_FILE;
			if(opt.flash_options.multiple){
				option.button_action=SWFUpload.BUTTON_ACTION.SELECT_FILES;
			}
		    var options = $.extend( {},flash_set_options, flash_set_event,opt.flash_options,option);
		    flasho = new SWFUpload( options );
			target.data(opt.flash_object_name,flasho);
			options.ready&&options.ready(flasho);
		}
		Swf.prototype.third_party=function(options){
			var that=this;
			var bpath=this.bpath,opt=this.options.flash_options;
			var plugs=[bpath+"/plugins/swf/swfupload.js"];
			if(opt.multiple)plugs.push(bpath+"/plugins/swf/swfupload.queue.js");
			J.loadPlugins(plugs,function(){
				options.ready&&options.ready();
			});
		}
		$.fn.swf = function (option,params) {
			var opt=$.fn.swf.defaults;
			return this.each(function () {
			var $this = $(this), data = $this.data(opt.CODENAME);
			var options= $.extend({}, data?data.options:opt, typeof option == 'object' && option)
			if (!data) $this.data(opt.CODENAME, (data = new Swf(this, options)));
			else data.options=options;
			if(typeof option=="string"){
			data[option].apply(data,params);
			}
			else data.init();
			});
		}
		var flash_set_options={
				upload_url:"",
				file_size_limit:"2 MB",
				file_queue_limit:100,

				post_params:{},
				file_post_name:"Filedata",
				file_types_description:"图片",
				file_upload_limit:100,
				file_types:"*.gif;*.jpeg;*.png;*.jpg",
				button_width: 100,//按钮大小
				button_height: 25,
				button_text:"",
				button_text_style:'.upload{kerning:28px; color:#404040; display:block; text-align:center;}',
				button_text_top_padding:0,
				button_text_left_padding:0,
				//button_cursor:SWFUpload.CURSOR.HAND,//CURSOR ARROW : -1 HAND : -2
				//button_window_mode:SWFUpload.WINDOW_MODE.OPAQUE,//WINDOW : "window",TRANSPARENT : "transparent",OPAQUE : "opaque"
				flash_url:"",//上传用的flash组件地址
				//flash_url:'../../tools/ueditor/dialogs/image/imageUploader.swf',//上传用的flash组件地址
				button_image_url:""
		};
		var flash_set_event={
		    	swfupload_preload_handler: function(){//初始化
		    		if(!this.support.loading){
		    			alert("您的Flash版本过低(支撑9.028及更高版本)");//请<a href=""http://www.adobe.com"" target=""_blank"">点击此处</a>下载最新版Flash."
		    			return false;
		    		}
		    		return true;
		    	},
		    	swfupload_loaded_handler:function(){//加载成功
		    		//this.settings["_button_text"]=this.settings["button_text"];
		    	},
		    	swfupload_load_failed_handler:function(){
		    	},
		    	mouse_click_handler:function(){},
		    	mouse_over_handler:function(){
		    		//var t=this.settings["_button_text"]||this.settings["button_text"];
		    		//this.setButtonText(t);
		    		//this.setButtonTextStyle(".upload{kerning:28px; color:#ffffff; display:block; text-align:center;}");
		    	},
		    	mouse_out_handler:function(){
		    		//var t=this.settings["_button_text"]||this.settings["button_text"];
		    		//this.setButtonText(t);
		    		//this.setButtonTextStyle(".upload{kerning:28px; color:#404040; display:block; text-align:center;}");
		    	},
		    	file_dialog_start_handler:function(){

		    	},
		    	file_queued_handler:function(){
		    	},
		    	file_queue_error_handler:function(){},
		    	file_dialog_complete_handler:function(fileSelectedCount, numberOfFilesQueued,totalNumberOfFilesInTheQueued){
		    		if(fileSelectedCount>numberOfFilesQueued){
		    			alert("error!");
		    			return;
		    		}
		    		if(fileSelectedCount>0)this.startUpload();
		    	},
		    	upload_start_handler:function(){
		    		this.setButtonDisabled(true);
		    		//var t="";//<span class='upload'>上传中...</span>
		    		//this.settings["_button_text"]=this.settings["button_text"];
		    		//this.setButtonText(t);
		    		//this.setButtonTextStyle(".upload{kerning:28px; color:#99999; display:block; text-align:center;}");
		    	},
		    	upload_progress_handler: function(file,completeBytes,totalBytes){
		    	},
		        upload_error_handler: function(file,errorCode, message){
		    	},
		        upload_success_handler: function(file, data,received){
		    		alert(data);
		        },
		    	upload_complete_handler: function() {
		    		this.setButtonDisabled(false);
		    		//alert(this.settings[])
		    		//this.startUpload()
		    		//var t=this.settings["_button_text"]||this.settings["button_text"];
		    		//this.setButtonText(t);
		    		//this.setButtonTextStyle(".upload{kerning:28px; color:#404040; display:block; text-align:center;}");
		    	},
		    	debug_handler: function(file) {
		    	}
		}
		$.fn.swf.defaults = {
		    CODENAME:"data-plug-swf",
		    flash_object_name:"data-plug-flash-swf",
		    flash_options:{}
			
		}
	};
})(J,__jroot);
//引用第三方支持
J.require("jquery");
J.define(__func);

/*flashObj.WINDOW_MODE = {
	WINDOW : "window",
	TRANSPARENT : "transparent",
	OPAQUE : "opaque"
};*/