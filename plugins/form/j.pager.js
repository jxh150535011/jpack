/* =========================================================
 *Write：{金兴亨}
 *Date: {2012-09-05}
 *Description:{页码}
 *update 2012-02-19 将页码更改为下 下标索引取值
 * ========================================================= */
!function ($) {
	"use strict";
	"jPage"; 
	var jPage = function (content, options) {
		this.options = options
		this.$element = $(content);
		this.init();
	}
	jPage.prototype = {
		constructor: jPage,
		init:function(){
			var that=this,opt=this.options;
			opt.pageSize=this.define(opt.pageSize,0);
			opt.pageCount=(opt.recordCount<1||opt.pageSize<1)?0:Math.ceil(opt.recordCount/opt.pageSize);
			if(opt.currentPageIndex>opt.pageCount-1)opt.currentPageIndex=opt.pageCount-1; 
			opt.currentPageIndex=this.define(opt.currentPageIndex,0);//保证currentPageIndex最小值为0
			
			if(typeof opt.currentPageIndex=="string")opt.currentPageIndex=parseInt(opt.currentPageIndex,10);
			var list=that.list=[];//页码列表
			var count=0,flag=1,index,start,end;
			index=start=end=opt.currentPageIndex;
			if(index>opt.pageCount-1){
				that.$element.html("");
				return;
			}
			while(list.length<opt.showPageCount&&(start>=0||end<opt.pageCount)){
			  if(index>=0&&index<opt.pageCount){
				list.push(index);
			  }
			  flag=0-flag;
			  index+=++count*flag;
			  if(flag>0)end=index;//当flag<0 往左移动
			  else start=index;
			}
			that.list.sort(function(a,b){return a-b;});//默认升序排序
			that.write();
		},
	  define:function(v,defaultv){
		return (v&&v>0)?v:defaultv;
	  },
	  write:function(){
		var that=this,opt=this.options;
		var format="<"+opt.tagformat+" class=@class pageIndex=@pageIndex @data >@text</"+opt.tagformat+">";
		function _format(i,text,className){
		  var data=opt.dataformat.replace("@pageIndex",i);
		  return format.replace("@class",className).replace("@text",text).replace("@data",data)
		  .replace("@pageIndex",i);
		}
		var list=that.list,l=list.length,html="";
		var index,start,end,pageCount=opt.pageCount;
		index=start=end=opt.currentPageIndex;
		that.$element.html("");

		if(opt.textformat){
		  for(var i=0;i<l;i++){
			var text=opt.textformat.replace("@pageIndex",(list[i]+1));
			html+=_format(list[i],text,(list[i]!=index?opt.skin[0]:opt.skin[2]));
		  }
		}
		if(list.length>0){
		  start=list[0];
		  end=list[list.length-1];
		}
		if(opt.itemMore&&start>0){//存在更多
		  html=_format((start-1),opt.itemMore,opt.skin[0])+html;
		}
		if(opt.prev){
		  html=_format((index-1),opt.prev,index>0?opt.skin[0]:opt.skin[3])+html;
		}
		if(opt.first){
		  html=_format(0,opt.first,index>0?opt.skin[0]:opt.skin[3])+html;
		}
	   if(opt.itemMore&&end<pageCount-1){//存在更多
		  html+=_format((end+1),opt.itemMore,opt.skin[0]);
		}
		if(opt.next){
		  html+=_format((index+1),opt.next,index<pageCount-1?opt.skin[0]:opt.skin[3]);
		}
		if(opt.last){
		  html+=_format(pageCount-1,opt.last,index<pageCount-1?opt.skin[0]:opt.skin[3]);
		}
		if(opt.dropdownlist){
		  var dropdownstr="";
		  for(var i=0;i<opt.pageCount;i++){
			dropdownstr+="<option value="+i+" "+(i==opt.currentPageIndex?"selected":"")+">"+(i+1)+"/"+opt.pageCount+"</option>";
		  }
		  if(dropdownstr!="")dropdownstr="<select>"+dropdownstr+"</select>";
		  html+=dropdownstr;
		}
		if(opt.pageSizeItems){
		  var str="";
		  str+="<select data-value='pagesize' >";
		  var items=opt.pageSizeItems;
		  for(var i=0,len=items.length;i<len;i++){
			str+="<option value="+items[i]+" "+(items[i]==opt.pageSize?"selected":"")+">"+items[i]+"</option>";
		  }
		  str+="</select>";
		  html=str+html;
		}
		html="<p>"+html+"</p>";
		if(opt.info){
			html=opt.info.replace(/@pageIndex/,(opt.currentPageIndex+1)).replace(/@recordCount/,opt.recordCount)
			.replace(/@pageSize/,opt.pageSize).replace(/@pageCount/,opt.pageCount)+html;
		}
		that.$element.html(html);
		that.$element.find("select[data-value='pagesize']").change(function(){
			opt.pageSizeChange&&opt.pageSizeChange($(this).val());
		});
		that.event();
	  },
	  event:function(){
		var that=this,opt=this.options;
		var clist=that.$element.find(opt.tagformat);
		
		clist.filter("."+opt.skin[0]+",."+opt.skin[1]).hover(function(){
		  $(this).addClass(opt.skin[1]).removeClass(opt.skin[0]);
		},function(){
		  $(this).addClass(opt.skin[0]).removeClass(opt.skin[1]);
		});
		clist.click(function(){
		  var pageIndex=$(this).attr("pageIndex");
		  if($(this).hasClass(opt.skin[0])||$(this).hasClass(opt.skin[1])){
			if(opt.click)opt.click($(this));
			if(pageIndex!=that.currentPageIndex){
			  if(opt.change)opt.change(pageIndex,that.currentPageIndex);
			  that.prevItem=$(this);
			}
		  }
		});
		if(opt.dropdownlist){
			that.$element.find("select").change(function(){
			  if($(this).attr("value")!=that.currentPageIndex)
				if(opt.change)opt.change($(this).attr("value"),that.currentPageIndex);
			});
		}
	  }
	}
	$.fn.jpage = function (option,params) {
		var opt=$.fn.jpage.defaults;
		return this.each(function () {
		  var $this = $(this), data = $this.data(opt.core);
		  var options= $.extend({}, data?data.options:opt, typeof option == 'object' && option)
		  if (!data) $this.data(opt.core, (data = new jPage(this, options)));
		  else data.options=options;
		  if(typeof option=="string"){
				data[option].apply(data,params);
		  }
		  else data.init();
		});
	}
	$.fn.jpage.defaults = {
	core:"data-plug-pager",
	currentPageIndex:0,
	pageSize:10,
	pageSizeItems:null,
	pageSizeChange:null,
	recordCount:1001,
	click:null,
	change:null,
	dataformat:"",
	textformat:"@pageIndex",
	tagformat:"a",
	dropdownlist:false,
	itemMore:"...",
	first:"首页",
	last:"末页",
	prev:"上一页",
	next:"下一页",
	skin:["normal","hover","select","disabled"],
	//默认 鼠标悬停 选中 禁用
	showPageCount:10,
	pageCount:0,
	startIndex:0,
	endIndex:0
	}
	  $.fn.jpage.Constructor = jPage
}(window.jQuery);