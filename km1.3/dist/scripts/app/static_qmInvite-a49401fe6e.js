define("app/static_qmInvite",["../mod/base","../plugs/version"],function(require,exports,module){function e(e){var t=[];t.push('<div id="popBg" class="pop-mask km-dialog hide"></div>'),t.push('<div id="rewardTable" class="pop-screen km-dialog reward_table">'),t.push('<div id="closeRewardTable" class="rt_close"><i class="iconfont icon-close"></i></div>'),t.push('<div class="con">'),t.push("<h4>奖励对照表</h4>"),t.push('<div class="th"><span>累计有效徒弟数</span><span>奖励现金（元）</span></div>'),t.push('<ul class="list">');for(var n=0;n<e.length;n++){var i=e[n].split(":");2==i.length&&t.push("<li><span>"+i[0]+"</span><span>"+i[1]+"</span></li>")}t.push("</ul>"),t.push("</div>"),t.push("</div>"),$("body").append(t.join("")),$("#closeRewardTable").on("click",function(){$("#rewardTable, #popBg").hide()})}function t(e,t){for(var n,i,a,s=!0,o="0%",r=0;r<t.length;r++)if(s)for(var l=0;l<2;l++)e<t[r][0]&&(0==r?(n=["0","0"],i=t[r],a=t[r][0]-e,o=e/t[r][0]*100+"%"):(n=t[r-1],i=t[r],a=t[r][0]-e,o=(e-t[r-1][0])/(t[r][0]-t[r-1][0])*100+"%"),s=!1),e==t[r][0]&&(rmb=t[r][1],n=t[r],i=t[r+1],a=t[r+1][0]-e,s=!1);return{tudi:e,curArr:n,nextArr:i,leftNum:a,sch:o}}function n(e,t){$("#tudi").text(e);for(var n,i=!0,a=0;a<t.length;a++)if(i)for(var s=0;s<2;s++)e<t[a][0]&&(n=t[a-1][1],i=!1),e==t[a][0]&&(n=t[a][1],i=!1);$("#rmb").text(n),$("#over").removeClass("hide"),$("#activity").remove()}function i(e,i,o){if(e>86400){var r=parseInt(e/3600);$("#timer").html("<em>"+parseInt(r/24)+"</em><span>天</span><span></span><em>"+r%24+"</em><span>小时</span>")}else new s("#timer",e,function(){n(i,o)});var l=t(i,o);console.log(l),a.render("#main","#main-tmpl",l,void 0,!0),$("#activity").removeClass("hide")}var a=require("../mod/base"),s=(require("../plugs/version"),function(e,t,n){this.el=e,this.remaining=parseInt(t),this.zeroize=function(e){return e<10?"0"+e:""+e},this.callback=n,this.init()});s.prototype.init=function(){var e,t,n,i=this;e=parseInt(i.remaining/3600),t=parseInt(i.remaining%3600/60),n=parseInt(i.remaining%3600%60),$(i.el).html('<em class="h">'+i.zeroize(e)+'</em><span>时</span><em class="m">'+i.zeroize(t)+'</em><span>分</span><em class="s">'+i.zeroize(n)+"</em><span>秒</span>"),i.count()},s.prototype.count=function(){var e,t,n,i,a,s,o=this;if(n=parseInt($(o.el+" .s").text()),t=parseInt($(o.el+" .m").text()),e=parseInt($(o.el+" .h").text()),i=n>0?n-1:0==t&&0==e?0:59,$(o.el+" .s").text(o.zeroize(i)),0==n&&(a=t>0?t-1:0==e?0:59,$(o.el+" .m").text(o.zeroize(a))),0==n&&0==t&&(s=e>0?e-1:0,$(o.el+" .h").text(o.zeroize(s))),0==i&&0==t&&0==e)return void($.isFunction(o.callback)&&o.callback());setTimeout(function(){o.count()},1e3)},a.custom({url:"api/v1/activity/info",data:{activityId:3}},function(t){if(1e3==t.status){for(var a=t.data,s=a.activity.desc.split(";"),o="",r=0;r<s.length;r++)o+="<li>"+s[r]+"</li>";$(".rule ol").html(o);var l=a.activity.rule,u=l.split(";"),c=[];e(u);for(var r=0;r<u.length;r++){var d=u[r].split(":");2==d.length&&c.push(d)}a.isJoin?(a.isEnd?n(a.validSonNum,c):i(a.leftSeconds,a.validSonNum,c),$("#yuRe").remove()):(a.isStart||$("#baoMing").addClass("gray").find("a").text("活动即将开始"),$("#yuRe").removeClass("hide"))}else{if(1013==t.status)return void Tools.alertDialog({title:"提醒",text:"收徒异常，请联系客服！<br>客服QQ：251843709",time:"999999999"});Tools.alertDialog({title:"提醒",text:t.desc,time:"0"})}}),$("#toFriend").on("click",function(){window.location="../myfriend.html?auth_token="+Tools.auth_token()}),$("#baoMing").on("click",function(){$(this).hasClass("gray")||a.custom({url:"api/v1/activity/join",data:{activityId:3}},function(e){if(1e3==e.status){var t=[];t.push('<div id="popBg" class="pop-mask km-dialog"></div>'),t.push('<div id="success" class="pop-screen km-dialog success">'),t.push('<div class="box">'),t.push("<h2>恭喜你报名成功</h2>"),t.push("<p>活动日期为9月11号-10月10号，快去拿3.6万现金大奖吧！</p>"),t.push('<div class="btnbox"><a href="kmb://invite">马上收徒</a></div>'),t.push("</div>"),t.push("</div>"),$("body").append(t.join("")),$("#success").height($("#success .box").height())}else{if(1013==data.status)return void Tools.alertDialog({title:"报名失败",text:"收徒异常，请联系客服！<br>客服QQ：251843709",time:"999999999"});Tools.alertDialog({title:"报名失败",text:e.desc})}})}),$(".showRewardTable").on("click",function(){$("#rewardTable, #popBg").show(),$("#rewardTable").height($("#rewardTable .con").height())})}),define("mod/base",["zepto","../plugs/doT.min","./tools"],function(require,exports,module){function e(e,t){var n=e,i={"M+":n.getMonth()+1,"d+":n.getDate(),"h+":n.getHours(),"m+":n.getMinutes(),"s+":n.getSeconds(),"q+":Math.floor((n.getMonth()+3)/3),S:n.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(n.getFullYear()+"").substr(4-RegExp.$1.length)));for(var a in i)new RegExp("("+a+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[a]:("00"+i[a]).substr((""+i[a]).length)));return t}function t(e){var t,n=function(){};if(!e.status)return void Tools.alertDialog({title:"出错了",text:"没有返回status"});if(/1001|1002|1003|1004|1008|1009|1015/.test(e.status))t={title:"提醒",text:e.desc};else if(/1006|1007/.test(e.status)){var i=5;t={title:"提醒",text:"访问太过频繁，<span id='closeTimer'>"+i+"</span>s后自动刷新"};var a=setInterval(function(){i--,i<1&&(clearInterval(a),window.location.reload()),$("#closeTimer").text(i)},1e3)}else{if(1101!=e.status)return t=null,!0;t={title:"提醒",text:"请打开设置->通用->日期与时间校准您的系统时间"}}return null!=t?(Tools.alertDialog(t,n),!1):void 0}var $=require("zepto");var n=require("../plugs/doT.min"),i={key:"26817749",km_api:server+"km_task/"};require("./tools"),module.exports={formatDate:function(t,n){var i=n||"yyyy-MM-dd hh:mm";if(isNaN(t)||null==t)return t;if("object"==typeof t){var a=dd.getFullYear(),s=dd.getMonth()+1,o=dd.getDate();s<10&&(s="0"+s);var r=a+"-"+s+"-"+o,l=r.match(/(\d+)/g),u=new Date(l[0],l[1]-1,l[2]);return e(u,i)}var u=new Date(parseInt(t));return e(u,i)},baseAjax:function(e,n){var a={name:"app_key",value:i.key};e.showLoading&&(0==$(".ui-loading-block").length?$("body").append('<div class="ui-loading-block km-dialog show"><div class="ui-loading-cnt"><i class="ui-loading-bright"></i><p>加载中……</p></div></div>'):$(".ui-loading-block").addClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).hide()),e.data||(e.data={}),$.isFunction(e.data.push)?e.data.push(a):e.data.app_key=i.key,$.isFunction(e.data.push)?e.data.push({name:"auth_token",value:Tools.auth_token()}):e.data.auth_token=Tools.auth_token(),$.ajax({url:i.km_api+e.url,data:e.data,type:"GET",dataType:"jsonp",xhrFields:{withCredentials:!0},jsonpCallback:"jsonp"+Math.ceil(1e3*Math.random()),success:function(i){e.showLoading&&($(".ui-loading-block").removeClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).show()),t(i)&&n(i)},error:function(t,n,i){console.log(t),e.showLoading&&$(".ui-loading-block").removeClass("show"),"paging"!=e.logtype&&$(e.renderEle).show()}})},render:function(e,t,i,a,s){if($(t).length>0&&i){var o=a||void 0,r=$(t).text(),l=n.template(r,void 0,o);s?$(e).html(l(i)):$(e).append(l(i))}},custom:function(e,t){var n=this;e=e||{},e.logtype="custom",n.baseAjax(e,t)}}}),define("plugs/doT.min",[],function(require,exports,module){function e(t,n,i){return("string"==typeof n?n:n.toString()).replace(t.define||o,function(e,n,a,s){return 0===n.indexOf("def.")&&(n=n.substring(4)),n in i||(":"===a?(t.defineParams&&s.replace(t.defineParams,function(e,t,a){i[n]={arg:t,text:a}}),n in i||(i[n]=s)):new Function("def","def['"+n+"']="+s)(i)),""}).replace(t.use||o,function(n,a){t.useParams&&(a=a.replace(t.useParams,function(e,t,n,a){if(i[n]&&i[n].arg&&a)return e=(n+":"+a).replace(/'|\\/g,"_"),i.__exp=i.__exp||{},i.__exp[e]=i[n].text.replace(new RegExp("(^|[^\\w$])"+i[n].arg+"([^\\w$])","g"),"$1"+a+"$2"),t+"def.__exp['"+e+"']"}));var s=new Function("def","return "+a)(i);return s?e(t,s,i):s})}function t(e){return e.replace(/\\('|\\)/g,"$1").replace(/[\r\t\n]/g," ")}var n,i={version:"1.0.3",templateSettings:{evaluate:/\{\{([\s\S]+?(\}?)+)\}\}/g,interpolate:/\{\{=([\s\S]+?)\}\}/g,encode:/\{\{!([\s\S]+?)\}\}/g,use:/\{\{#([\s\S]+?)\}\}/g,useParams:/(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,define:/\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,defineParams:/^\s*([\w$]+):([\s\S]+)/,conditional:/\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,iterate:/\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,varname:"it",strip:!0,append:!0,selfcontained:!1,doNotSkipEncoded:!1},template:void 0,compile:void 0};i.encodeHTMLSource=function(e){var t={"&":"&#38;","<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","/":"&#47;"},n=e?/[&<>"'\/]/g:/&(?!#?\w+;)|<|>|"|'|\//g;return function(e){return e?e.toString().replace(n,function(e){return t[e]||e}):""}},n=function(){return this||(0,eval)("this")}(),void 0!==module&&module.exports?module.exports=i:"function"==typeof define&&define.amd?define(function(){return i}):n.doT=i;var a={start:"'+(",end:")+'",startencode:"'+encodeHTML("},s={start:"';out+=(",end:");out+='",startencode:"';out+=encodeHTML("},o=/$^/;i.template=function(r,l,u){l=l||i.templateSettings;var c,d,p=l.append?a:s,g=0;r=l.use||l.define?e(l,r,u||{}):r,r=("var out='"+(l.strip?r.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""):r).replace(/'|\\/g,"\\$&").replace(l.interpolate||o,function(e,n){return p.start+t(n)+p.end}).replace(l.encode||o,function(e,n){return c=!0,p.startencode+t(n)+p.end}).replace(l.conditional||o,function(e,n,i){return n?i?"';}else if("+t(i)+"){out+='":"';}else{out+='":i?"';if("+t(i)+"){out+='":"';}out+='"}).replace(l.iterate||o,function(e,n,i,a){return n?(g+=1,d=a||"i"+g,n=t(n),"';var arr"+g+"="+n+";if(arr"+g+"){var "+i+","+d+"=-1,l"+g+"=arr"+g+".length-1;while("+d+"<l"+g+"){"+i+"=arr"+g+"["+d+"+=1];out+='"):"';} } out+='"}).replace(l.evaluate||o,function(e,n){return"';"+t(n)+"out+='"})+"';return out;").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/\r/g,"\\r").replace(/(\s|;|\}|^|\{)out\+='';/g,"$1").replace(/\+''/g,""),c&&(l.selfcontained||!n||n._encodeHTML||(n._encodeHTML=i.encodeHTMLSource(l.doNotSkipEncoded)),r="var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("+i.encodeHTMLSource.toString()+"("+(l.doNotSkipEncoded||"")+"));"+r);try{return new Function(l.varname,r)}catch(e){throw"undefined"!=typeof console&&console.log("Could not create a template function: "+r),e}},i.compile=function(e,t){return i.template(e,null,t)},module.exports=i}),define("mod/tools",[],function(require){var e={getQueryValue:function(e){var t=location.search,n=new Array;if(t.length>1){var i=t.indexOf("?");t=t.substring(i+1,t.length)}else t=null;if(t)for(var a=0;a<t.split("&").length;a++)n[a]=t.split("&")[a];for(var s=0;s<n.length;s++)if(n[s].split("=")[0]==e)return decodeURI(n[s].split("=")[1]);return""},uid:function(){return this.getQueryValue("uid")||"null"},auth_token:function(){return this.getQueryValue("auth_token")||"null"},alertDialog:function(e,t){var n={title:null,text:null,img:null,time:3e3};for(var i in n)e[i]=e[i]||n[i];var a="tips"+(new Date).getTime(),s='<div id="'+a+'" class="ui-popup-screen km-dialog"><div class="ui-overlay-shadow km-popup">';e.time<1&&(s+='<i class="iconfont icon-close" id="close"></i>'),s+='<div class="content">',null!=e.title&&""!=e.title&&(s+="<h1>"+e.title+"</h1>"),null!=e.text&&""!=e.text&&(s+="<p>"+e.text+"</p>"),null!=e.img&&""!=e.img&&(s+='<div class="pic"><img src="'+e.img+'"/></div>'),s+="</div> </div> </div>";var o=$(s).appendTo("body"),r=$("#"+a+" .km-popup").height(),l=$(window).height(),u=(l-r)/2;if($("#"+a+" .km-popup").css("top",u),o.addClass("show-dialog"),$("#close").click(function(){$("#"+a).remove(),$.isFunction(t)&&t()}),e.time>0){var c=e.time;setTimeout(function(){$("#"+a).remove(),$.isFunction(t)&&t()},c)}}};window.Tools=e}),define("plugs/version",[],function(require,exports,module){var e,t={},n=navigator.userAgent;if(t.isKM=/KuaiMa/.test(n),t.isKM){var i=n.split("ssy=")[1];e=/iOS|Android/.test(i.split(";")[0])?i.split(";")[2]:i.split(";")[1],t.version=e.replace("V","")}t.userAgent=n,t.equal=function(e){return!!t.isKM&&e==this.version},t.greater=function(e){if(t.isKM){for(var n=this.version.split("."),i=e.split("."),a=!1,s=0;s<n.length&&!(n[s]<i[s]);s++)n[s]>i[s]&&(a=!0);return a}return!1},t.less=function(e){if(t.isKM){for(var n=this.version.split("."),i=e.split("."),a=!1,s=0;s<n.length&&!(n[s]>i[s]);s++)n[s]<i[s]&&(a=!0);return a}return!1},t.gEq=function(e){return!(!this.equal(e)&&!this.greater(e))},t.lEq=function(e){return!(!this.equal(e)&&!this.less(e))},module.exports=t});