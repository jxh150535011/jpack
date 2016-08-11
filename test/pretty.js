var path=J.SCRIPTPATH;
J.require("jquery");
J.require(path+"/ext/google-code-prettify/prettify.css");
J.require(path+"/ext/google-code-prettify/prettify.js");
//J.require(path+"/ext/google-code-prettify/lang-basic.js");
//J.require(path+"/ext/google-code-prettify/lang-css.js");

J.ready(function (argument) {
	$("[data-code]").each(function(){
		var that=$(this);
		var codes=$(this).find("[data-code-source]");
		codes.each(function(){
			var oprint=that.find("[data-code-print='"+($(this).attr("data-code-source")||"")+"']");
			if(oprint&&oprint.get(0))oprint.text($(this).html().replace(/(^\s|\s$)/gi,""));
		});
	});
	prettyPrint();
});