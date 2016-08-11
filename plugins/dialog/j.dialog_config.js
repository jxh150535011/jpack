
var _root=J.SCRIPTPATH+"/plugins/dialog/";
J.require("jquery");
J.require(_root+"j.dialog.js");
var jroot=J._get_run_script_url();
var style=J.getParam("style",jroot);
style=style||"default";
J.loadStyle(_root+"theme/"+style+".css");
//var _temp="",_temp_path=_root+"theme/gray.html";
/*J.require(_temp_path,function($J,ref){
	var doc=ref.data[_temp_path].content;
	_temp=doc.body.innerHTML;
});*/

var _temp='<div><div class="dialog-shadow-top"><span class="round-left"></span><p class="repeat-top"></p><span class="round-right"></span>';
_temp+='</div><div class="dialog-shadow-left"><div class="dialog-shadow-right"><div class="dialog"><!--高度可自适应-->';
_temp+='<div class="hd" @headerstyle data-plug-dialog="move"><h6 data-plug-dialog="title" class="title">新的窗口</h6><div class="more">';          
_temp+='<a href="javascript:void(0);" title="还原" data-plug-dialog="normal" class="revert"></a>'; 
_temp+='<a href="javascript:void(0);" title="最大化" data-plug-dialog="maximize" class="maximize"></a>'; 
_temp+='<a href="javascript:void(0);" title="最小化" data-plug-dialog="minimize" class="minimize"></a>'; 
_temp+='<a href="javascript:void(0);" title="关闭" data-plug-dialog="close" class="shut"></a>'; 
_temp+='</div></div><div class="bd" data-plug-dialog="body"></div>'; 
_temp+='<div class="ft" @footerstyle ><div class="form"><p style="text-align:right;"><!--向右对齐-->'; 
_temp+='<input type="button" class="btn-blue" value="确定" data-plug-dialog-button="ok" /><input type="button" class="btn-gray" value="取消" data-plug-dialog-button="cancel" style="margin-right:12px;" />';      
_temp+='</p></div></div></div><!--End/dialog--></div></div>';                   
_temp+='<div class="dialog-shadow-bottom"><span class="round-left"></span><p class="repeat-bottom"></p> <span class="round-right"></span></div><!--End/shadow-bottom--></div>';                   

var tipTemp="";

var __f=function($J){
	if(!_temp)return;
	$.fn.dialog.jopen=$J.fn.dialog.jopen=function(option){
		option=option||{};
		option.padding=[51,8,60,8];
		var footerstyle="",headerstyle="";
		if(option.footer===false){
			footerstyle="style='display:none;'";
			option.padding[2]=10;
		}
		if(option.header===false){
			headerstyle="style='display:none;'";
			option.padding[0]=10;
		}
		//option.width="fwidth";
		//option.height="fheight";
		//option.left="center";
		//MinimizeBox
		//option.top="center";
		// //按钮属性
		option.maximizeBox=option.maximizeBox||false;
		option.minimizeBox=option.minimizeBox||false;
		option.waitTemp="<div class='dialog-loading'><div>&nbsp;Loading...</div></div>";//background:green;
		option.contentTemp=_temp.replace("@footerstyle",footerstyle).replace("@headerstyle",headerstyle);
		return $J.fn.dialog.open(option);
	}
	$.fn.jtip=function(option){
		//<h3 class="popover-title"></h3>
		if(arguments.length>0&&typeof arguments[0]=="object"){
			var dir=(arguments[0].dir||"right");
			if(!arguments[0].top){
				arguments[0].top=(dir=="right"||dir=="left")?"top":"bottom";
				if(dir=="top")arguments[0].top="top-width";
			}
			if(!arguments[0].left){
				arguments[0].left=(dir=="top"||dir=="bottom")?"left":"right";
				if(dir=="left")arguments[0].left="left-width";
			}
			arguments[0].dir=dir;
			var tipTemp='<div class="popover '+dir+'"><div class="point"></div>';
			tipTemp+='<div class="popover-content">'+(arguments[0].tipTemp||"")+'</div></div>'
			arguments[0].tipTemp=tipTemp;
		}
		this.tip.apply(this,arguments);
	}
}
J.define(__f);
/*
var temp="";
temp='<div class="modal"><div style="height:50px;width:300px;background-color:#fff;" data-plug-dialog="move">';
temp+='<span type="button" class="close" style="">×</span><h3 ></h3>';
temp+='</div><div class="modal-body" style="background-color:#fff;" data-plug-dialog="body"></div>';
temp+='<div class="modal-footer"><a href="javascript:void(0);" class="btn">取消</a><a href="javascript:void(0);" class="btn btn-primary">确定</a></div>';
temp+='</div>';
J.fn.dialog.open({name:"home",content:"url:test2.html",waitTemp:"<div style=' display:block;background:green;'></div>"
,contentTemp:temp,move:true});*/