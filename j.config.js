//注册方法
(function(){
var head=J.SCRIPTPATH;
head=head.indexOf("/")===0?("~"+head.substr(1)):head;
var _b_path=head;
var _p_bath=_b_path+"/plugins";
J.addPluginsConfig({//可配置多个地址
        "jquery":[_b_path+"/jquery-1.8.3.min.js"],
        "jquery1.8":[_b_path+"/jquery-1.8.3.min.js"],
        "tmp":[_p_bath+"/tmp/jquery.tmpl.js"],
        "resource":[_p_bath+"/resource/j.resource.js"],
        "dialog":[_p_bath+"/dialog/j.dialog_config.js"],
        "swf":[_p_bath+"/swf/j.swf.js"],
        "basic":[_p_bath+"/basic/j.basic.js"],
        "ddl":[_p_bath+"/basic/j.ddl.js"],
        "docs":[_p_bath+"/docs/j.docs.js"],
        "content":[_p_bath+"/content/j.content.js"],
        "form":[_p_bath+"/form/jquery.formbasic_v2.js"],
        "formv3":[_p_bath+"/form/j.form.js"],
        "my97date":{"js":[_b_path+"/ext/My97DatePicker/WdatePicker.js"],css:[_b_path+"/ext/My97DatePicker/skin/default/datepicker.css"]},
        "pager":[_p_bath+"/form/j.pager.js"],
        "ui":[_p_bath+"/ui/j.ui.js"],
        "image":[_p_bath+"/image/j.image.js"],
        "jquery.imgareaselect":{"js":[_p_bath+"/image/jquery.imgareaselect.min.js"],css:[_p_bath+"/image/imgareaselect-default.css"]},
        "controls":[_p_bath+"/controls/j.controls.js"],
        "tree":[_p_bath+"/tree/j.tree_config.js"],
        "layout":[_p_bath+"/layout/j.layout.js"],
        "handlebars":[_b_path+"/handlebars.js"],
        "scrollspy":[_p_bath+"/scroll/scrollspy.js"],
        "test1":[_b_path+"/test1.js"],
        "test2":[_b_path+"/test2.js"]
    }
);
})(window);