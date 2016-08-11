define(function (require, exports, module) {
	require("../ext/google-code-prettify/prettify.css");
	require("../ext/google-code-prettify/prettify.js");
	var $=jQuery;

	$("[data-code]").each(function(){
		var that=$(this);
		var codes=$(this).find("[data-code-source]");
		codes.each(function(){
			var oprint=that.find("[data-code-print='"+($(this).attr("data-code-source")||"")+"']");
			if(oprint&&oprint.get(0))oprint.text($(this).html().replace(/(^\s|\s$)/gi,""));
		});
	});
	prettyPrint();

	var local={},self={

	};
	module.exports=self;
});