
var __root=J.SCRIPTPATH+"/plugins/tree/";
var __jroot=J._get_run_script_url();
var __style=J.getParam("style",__jroot);
var __plug=J.getParam("plug",__jroot)||"ztree";
if(__plug=="jstree"){
	J.require("jquery");
	__root+=__plug+"/";
	J.require(__root+"jquery.jstree.js");
	//__style=__style||"default"
	//J.require(__root+__style+"/style.css");
}
else if(__plug=="ztree"){
	J.require("jquery");
	__root+=__plug+"/";
	J.require(__root+"jquery.ztree.all-3.5.min.js");
	__style=__style||"default"
	J.require(__root+"theme/"+__style+".css");
}
var __f=function($J){


}
J.define(__f);