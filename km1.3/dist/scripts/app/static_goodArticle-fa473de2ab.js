define("app/static_goodArticle",["../mod/base"],function(require,exports,module){function e(e){t.custom({url:"api/v1/post/topList",renderEle:"#conList_read",data:{type:e}},function(n){var o=.3*$(".view_3 .imgbox").width();1==e&&t.render("#conList_read","#conList-tmpl",n,void 0,!0),2==e&&t.render("#conList_comment","#conList-tmpl",n,void 0,!0),$(".view_3 .imgbox").height(74*o/113)})}var t=require("../mod/base");"comment"==Tools.getQueryValue("type")?($("#conList_read").hide(),e(2),setTimeout(function(){e(1),$("#comment").parent().addClass("second").show()},300)):($("#conList_comment").hide(),e(1),setTimeout(function(){e(2),$("#read").parent().show()},300)),$("#read").on("click",function(){$(this).parent().removeClass("second"),$("#conList_read").show(),$("#conList_comment").hide()}),$("#comment").on("click",function(){$(this).parent().addClass("second"),$("#conList_comment").show(),$("#conList_read").hide()}),$("#conList_read,#conList_comment").on("click",".item",function(){var e=$(this).data("id"),t=$(this).data("type");console.log(t),"post"==t&&(window.location="kmb://worthreading?id="+e),"photo"==t&&(window.location="kmb://worthreadingimg?id="+e)})}),define("mod/base",["zepto","../plugs/doT.min","./tools"],function(require,exports,module){function e(e,t){var n=e,o={"M+":n.getMonth()+1,"d+":n.getDate(),"h+":n.getHours(),"m+":n.getMinutes(),"s+":n.getSeconds(),"q+":Math.floor((n.getMonth()+3)/3),S:n.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(n.getFullYear()+"").substr(4-RegExp.$1.length)));for(var i in o)new RegExp("("+i+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?o[i]:("00"+o[i]).substr((""+o[i]).length)));return t}function t(e){var t,n=function(){};if(!e.status)return void Tools.alertDialog({title:"出错了",text:"没有返回status"});if(/1001|1002|1003|1004|1008|1009|1013|1015/.test(e.status))t={title:"提醒",text:e.desc};else if(/1006|1007/.test(e.status)){var o=5;t={title:"提醒",text:"访问太过频繁，<span id='closeTimer'>"+o+"</span>s后自动刷新"};var i=setInterval(function(){o--,o<1&&(clearInterval(i),window.location.reload()),$("#closeTimer").text(o)},1e3)}else{if(1101!=e.status)return t=null,!0;t={title:"提醒",text:"请打开设置->通用->日期与时间校准您的系统时间"}}return null!=t?(Tools.alertDialog(t,n),!1):void 0}var $=require("zepto");var n=require("../plugs/doT.min"),o={key:"26817749",km_api:server+"km_task/"};require("./tools"),module.exports={formatDate:function(t,n){var o=n||"yyyy-MM-dd hh:mm";if(isNaN(t)||null==t)return t;if("object"==typeof t){var i=dd.getFullYear(),a=dd.getMonth()+1,r=dd.getDate();a<10&&(a="0"+a);var s=i+"-"+a+"-"+r,l=s.match(/(\d+)/g),d=new Date(l[0],l[1]-1,l[2]);return e(d,o)}var d=new Date(parseInt(t));return e(d,o)},baseAjax:function(e,n){var i={name:"app_key",value:o.key};e.showLoading&&(0==$(".ui-loading-block").length?$("body").append('<div class="ui-loading-block km-dialog show"><div class="ui-loading-cnt"><i class="ui-loading-bright"></i><p>加载中……</p></div></div>'):$(".ui-loading-block").addClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).hide()),e.data||(e.data={}),$.isFunction(e.data.push)?e.data.push(i):e.data.app_key=o.key,$.isFunction(e.data.push)?e.data.push({name:"auth_token",value:Tools.auth_token()}):e.data.auth_token=Tools.auth_token(),$.ajax({url:o.km_api+e.url,data:e.data,type:"GET",dataType:"jsonp",xhrFields:{withCredentials:!0},jsonpCallback:"jsonp"+Math.ceil(1e3*Math.random()),success:function(o){e.showLoading&&($(".ui-loading-block").removeClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).show()),t(o)&&n(o)},error:function(t,n,o){console.log(t),e.showLoading&&$(".ui-loading-block").removeClass("show"),"paging"!=e.logtype&&$(e.renderEle).show()}})},render:function(e,t,o,i,a){if($(t).length>0&&o){var r=i||void 0,s=$(t).text(),l=n.template(s,void 0,r);a?$(e).html(l(o)):$(e).append(l(o))}},custom:function(e,t){var n=this;e=e||{},e.logtype="custom",n.baseAjax(e,t)}}}),define("plugs/doT.min",[],function(require,exports,module){function e(t,n,o){return("string"==typeof n?n:n.toString()).replace(t.define||r,function(e,n,i,a){return 0===n.indexOf("def.")&&(n=n.substring(4)),n in o||(":"===i?(t.defineParams&&a.replace(t.defineParams,function(e,t,i){o[n]={arg:t,text:i}}),n in o||(o[n]=a)):new Function("def","def['"+n+"']="+a)(o)),""}).replace(t.use||r,function(n,i){t.useParams&&(i=i.replace(t.useParams,function(e,t,n,i){if(o[n]&&o[n].arg&&i)return e=(n+":"+i).replace(/'|\\/g,"_"),o.__exp=o.__exp||{},o.__exp[e]=o[n].text.replace(new RegExp("(^|[^\\w$])"+o[n].arg+"([^\\w$])","g"),"$1"+i+"$2"),t+"def.__exp['"+e+"']"}));var a=new Function("def","return "+i)(o);return a?e(t,a,o):a})}function t(e){return e.replace(/\\('|\\)/g,"$1").replace(/[\r\t\n]/g," ")}var n,o={version:"1.0.3",templateSettings:{evaluate:/\{\{([\s\S]+?(\}?)+)\}\}/g,interpolate:/\{\{=([\s\S]+?)\}\}/g,encode:/\{\{!([\s\S]+?)\}\}/g,use:/\{\{#([\s\S]+?)\}\}/g,useParams:/(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,define:/\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,defineParams:/^\s*([\w$]+):([\s\S]+)/,conditional:/\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,iterate:/\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,varname:"it",strip:!0,append:!0,selfcontained:!1,doNotSkipEncoded:!1},template:void 0,compile:void 0};o.encodeHTMLSource=function(e){var t={"&":"&#38;","<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","/":"&#47;"},n=e?/[&<>"'\/]/g:/&(?!#?\w+;)|<|>|"|'|\//g;return function(e){return e?e.toString().replace(n,function(e){return t[e]||e}):""}},n=function(){return this||(0,eval)("this")}(),void 0!==module&&module.exports?module.exports=o:"function"==typeof define&&define.amd?define(function(){return o}):n.doT=o;var i={start:"'+(",end:")+'",startencode:"'+encodeHTML("},a={start:"';out+=(",end:");out+='",startencode:"';out+=encodeHTML("},r=/$^/;o.template=function(s,l,d){l=l||o.templateSettings;var c,u,p=l.append?i:a,g=0;s=l.use||l.define?e(l,s,d||{}):s,s=("var out='"+(l.strip?s.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""):s).replace(/'|\\/g,"\\$&").replace(l.interpolate||r,function(e,n){return p.start+t(n)+p.end}).replace(l.encode||r,function(e,n){return c=!0,p.startencode+t(n)+p.end}).replace(l.conditional||r,function(e,n,o){return n?o?"';}else if("+t(o)+"){out+='":"';}else{out+='":o?"';if("+t(o)+"){out+='":"';}out+='"}).replace(l.iterate||r,function(e,n,o,i){return n?(g+=1,u=i||"i"+g,n=t(n),"';var arr"+g+"="+n+";if(arr"+g+"){var "+o+","+u+"=-1,l"+g+"=arr"+g+".length-1;while("+u+"<l"+g+"){"+o+"=arr"+g+"["+u+"+=1];out+='"):"';} } out+='"}).replace(l.evaluate||r,function(e,n){return"';"+t(n)+"out+='"})+"';return out;").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/\r/g,"\\r").replace(/(\s|;|\}|^|\{)out\+='';/g,"$1").replace(/\+''/g,""),c&&(l.selfcontained||!n||n._encodeHTML||(n._encodeHTML=o.encodeHTMLSource(l.doNotSkipEncoded)),s="var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("+o.encodeHTMLSource.toString()+"("+(l.doNotSkipEncoded||"")+"));"+s);try{return new Function(l.varname,s)}catch(e){throw"undefined"!=typeof console&&console.log("Could not create a template function: "+s),e}},o.compile=function(e,t){return o.template(e,null,t)},module.exports=o}),define("mod/tools",[],function(require){var e={getQueryValue:function(e){var t=location.search,n=new Array;if(t.length>1){var o=t.indexOf("?");t=t.substring(o+1,t.length)}else t=null;if(t)for(var i=0;i<t.split("&").length;i++)n[i]=t.split("&")[i];for(var a=0;a<n.length;a++)if(n[a].split("=")[0]==e)return decodeURI(n[a].split("=")[1]);return""},uid:function(){return this.getQueryValue("uid")||"null"},auth_token:function(){return this.getQueryValue("auth_token")||"null"},alertDialog:function(e,t){var n={title:null,text:null,img:null,time:3e3};for(var o in n)e[o]=e[o]||n[o];var i="tips"+(new Date).getTime(),a='<div id="'+i+'" class="ui-popup-screen km-dialog"><div class="ui-overlay-shadow km-popup">';e.time<1&&(a+='<i class="iconfont icon-close" id="close"></i>'),a+='<div class="content">',null!=e.title&&""!=e.title&&(a+="<h1>"+e.title+"</h1>"),null!=e.text&&""!=e.text&&(a+="<p>"+e.text+"</p>"),null!=e.img&&""!=e.img&&(a+='<div class="pic"><img src="'+e.img+'"/></div>'),a+="</div> </div> </div>";var r=$(a).appendTo("body"),s=$("#"+i+" .km-popup").height(),l=$(window).height(),d=(l-s)/2;if($("#"+i+" .km-popup").css("top",d),r.addClass("show-dialog"),$("#close").click(function(){$("#"+i).remove(),$.isFunction(t)&&t()}),e.time>0){var c=e.time;setTimeout(function(){$("#"+i).remove(),$.isFunction(t)&&t()},c)}}};window.Tools=e});