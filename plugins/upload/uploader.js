(function($){
	function _file_handler(form,options){
		this.$form=$(form);
		var that=this,opt=this.options=options||{index:0};
		this.index=opt.index||0;
	}
	_file_handler.prototype={
		constructor: _file_handler,
		start:function(options){
			var that=this,opt=$.extend(this.options,options);
			if(!(this.$form&&this.$form.get(0)))return;
			if(!("FormData" in window))return;
			this.loaded=false;
			var oxhr = new XMLHttpRequest();
			var fd=new FormData(this.$form.get(0));
			//oxhr.setRequestHeader("Content-type", "multipart/form-data;");
			var data=opt.data;
			for(var k in data){
				data.hasOwnProperty(k)&&(fd.append(k,data[k]));
			}
			//fd.append(this.$file.attr("name"),this.$file.get(0));
			oxhr.upload.addEventListener("progress", function(evt){
				that.onprogress(this,evt);
			}, false);
			oxhr.addEventListener("loadstart", function(evt){
				that.onloadstart(this,evt);
			}, false);
			oxhr.addEventListener("load", function(evt){}, false);
			oxhr.addEventListener("loadend", function(evt){}, false);
			oxhr.addEventListener("error", function(evt){console.log("error");
				that.that.onerror(this,evt);
			}, false);
			oxhr.addEventListener("abort", function(evt){console.log("abort");
				that.onabort(this,evt);
			}, false);
			oxhr.onreadystatechange = function(){  
				if(oxhr.readyState==4){
					if((oxhr.status >= 200 && oxhr.status < 300 ) || oxhr.status == 304 )
						that.oncomplete(this,oxhr.responseText);
				}
			}
			oxhr.open("POST", opt.url);
			oxhr.send(fd);
			this.oxhr=oxhr;
		},
		stop:function(){
			if(this.oxhr)this.oxhr.abort();
		},
		onprogress:function(target,evt){
			var that=this,opt=this.options;
			opt.onprogress&&opt.onprogress.call(this,evt.lengthComputable?100:Math.round(evt.loaded * 100 / evt.total),evt.loaded,evt.total);
		},
		onloadstart:function(target,evt){
			var that=this,opt=this.options;
			opt.onloadstart&&opt.onloadstart(evt);
		},
		oncomplete:function(target,evt){
			if(this.loaded)return;
			this.loaded=true;
			var that=this,opt=this.options;
			opt.oncomplete&&opt.oncomplete(evt);
			that.onend(evt);
		},
		onabort:function(target,evt){
			var that=this,opt=this.options;
			opt.onabort&&opt.onabort(evt);
			that.onend(evt);
		},
		onerror:function(target,evt){
			var that=this,opt=this.options;
			opt.onerror&&opt.onerror(evt);
			that.onend();
		},
		onend:function(target,evt){
			var that=this,opt=this.options;
			opt.onend&&opt.onend(evt);
		}
	};
	function _uploader(element,options){
        this.$elem= $(element);
        this.$wait=$("<div></div>").appendTo(this.$elem).hide();
        this.$body=$("<div></div>").appendTo(this.$elem);
        this.options=options;
        this.index=0;
	}
	_uploader.prototype={
		constructor: _uploader,
		_file_handler:_file_handler,
		init:function(){
			var that=this,opt=this.options;
			this.filetypes=this._init_filetyps();//初始化
			if(!("FormData" in window)){
				return;
				//var $iframe=$('<iframe  style="display:none;"></iframe>');
				//this.$elem.html($iframe);
				//this.$body=$('<form action="'+opt.url+'" method="post" enctype="multipart/form-data">');
				//$iframe.html(this.$body);
			}
		},
		add:function(){
			var that=this,opt=this.options;
			var $form=$("<form></form>");
			$form.html(opt.render&&opt.render()||opt.templete);
			this.$body.append($form);
			$form.find("input:file").attr("name",opt.file_post_name).off("change").on("change",function(){
				var r=that.onselectfile($(this));
				if(opt.auto&&r!==false)that.startUploadFile($(this));//上传
			});
		},
		remove:function($form){
			if(!$form.is("form"))$form=$($form).parents("form:eq(0)");
			if($form.length<1)return;
			this.stop($form);
			$form.remove();
		},
		getRequest:function($form){
			var req=$form.data("request");
			if(!req) $form.data("request",(req=new _file_handler($form)));
			return req;
		},
		wait:function(f){
			var that=this,opt=this.options;
			if(f){
				this.$body.hide();
				this.$wait.show();
				var html=typeof opt.wait=="function"?opt.wait():opt.wait;
				html&&this.$wait.html(html);
			}
			else{
				this.$body.show();
				this.$wait.hide();
			}
		},
		start:function($form,callback){
			var oreq=this.getRequest($form);
			oreq.start(callback);
		},
		stop:function($form){
			var oreq=this.getRequest($form);
			oreq.stop();
		},
		startUploadFile:function($file){
			var that=this,opt=this.options,$form=$file.parents("form:eq(0)");
			this.start($form,{
				url:opt.url,
				onloadstart:function(){
					that.wait(true);
				},
				onprogress:function(percent){
					opt.onuploadprogress&&opt.onuploadprogress(percent);//this.index
				},
				oncomplete:function(evt){
					opt.oncomplete&&opt.oncomplete(evt);
				},
				onabort:function(evt){
					opt.onabort&&opt.onabort(evt);
				},
				onerror:function(evt){
					opt.onerror&&opt.onerror(evt);
				},
				onend:function(evt){
					that.wait(false);
				}
			});
		},
		onselectfile:function($file){
			var that=this,opt=this.options,file=$file.get(0);//获取当前file对象
			var filesize=file.size,filename=file.value,gb=1024*1024*1024,mb=1024*1024,kb=1024;
			if(file.size>gb)filesize=(Math.round(file.size * 100 / gb) / 100)+ 'GB';
			else if(file.size>mb)filesize=(Math.round(file.size * 100 / mb) / 100)+ 'MB';
			else if(file.size>kb)filesize=(Math.round(file.size * 100 / kb) / 100)+ 'KB';
			else filesize=(Math.round(file.size * 100) / 100)+ 'B';
			var reg=this.filetypes.reg;reg.lastIndex=0;
			filename.replace(/[.](.+)$/,function($0,$1){return filetype=$1;});
			return opt.onselectfile&&opt.onselectfile({filename:filename,filesize:filesize,error:!reg.test(filename),filetype:filetype,size:file.size});
		},
		_init_filetyps:function(){
			var that=this,opt=this.options;
			var reg=[],ofiletypes={};
			ofiletypes.accept=(opt.file_types||"").toLowerCase().replace(/([*])[.]([0-9a-z_]+)/gi,function($0,$1,$2){
				reg.push($2);
				return that.accepts[$2]||"";
			}).replace(/;/g,',');
			ofiletypes.reg=new RegExp(".*[.]("+(reg.length?reg.join("|"):".*")+")$","g");
			return ofiletypes;
		},
		accepts:{
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
	};
    _uploader.options = { core: "data-plug-uploader",templete:'<input type="file" />'
    ,file_types:"*.gif;*.jpeg;*.png;*.jpg"
    ,file_post_name:"filedata"
    ,file_post_data:{}
    ,auto:true 
	};
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
})(jQuery);