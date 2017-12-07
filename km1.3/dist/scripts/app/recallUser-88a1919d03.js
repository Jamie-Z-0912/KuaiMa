define("app/recallUser",["../mod/base","../plugs/confirmTip.js"],function(require,exports,module){var e=require("../mod/base"),t=require("../plugs/confirmTip.js");e.custom({url:"api/v1/recall/canReceiveReward"},function(e){1e3!=e.status&&(9820==e.status?$("#receiveAward").addClass("gray").text("召回用户专享"):$("#receiveAward").addClass("gray").text("已领取奖励"))}),$("#receiveAward").on("click",function(){var n=$(this);n.hasClass("gray")||e.custom({url:"api/v1/recall/receiveReward"},function(e){1e3!=e.status?(Tools.alertDialog({title:"领取失败",text:e.desc}),n.addClass("gray").text("召回用户专享")):new t({title:"领取成功",text:'<p style="padding:0 .15rem;">恭喜您获得3天加速卡，明日生效，先去任务大厅看看更多新玩法吧！</p>',sureTxt:"查看奖励",cancelTxt:"去任务大厅"},function(e){e?/browser.kuaima/.test(location.hostname)?window.location="http://browser.kuaima.cn/myCard.html?auth_token="+Tools.auth_token():window.location="http://t.kuaima.cn/browser/myCard.html?auth_token="+Tools.auth_token():/browser.kuaima/.test(location.hostname)?window.location="http://browser.kuaima.cn/taskCenter.html?auth_token="+Tools.auth_token():window.location="http://t.kuaima.cn/browser/taskCenter.html?auth_token="+Tools.auth_token()})})}),$("#toTaskCenter").on("click",function(){/browser.kuaima/.test(location.hostname)?window.location="http://browser.kuaima.cn/taskCenter.html?auth_token="+Tools.auth_token():window.location="http://t.kuaima.cn/browser/taskCenter.html?auth_token="+Tools.auth_token()}),$("#hotSearch").on("click",function(){window.location="kmb://hotsearch"}),$("#readMesA").on("click",function(){Tools.alertDialog({text:"阅读每日推送文章<br>可获得额外金币奖励"})}),$("#welfare").on("click",function(){var t=$(this);$("#welfare .over").length>0?window.location="http://activity.yuyiya.com/activity/index?id=1919&slotId=2953&login=normal&appKey=2cMgpedEXq4tgEy5Y6f4g963ZTkr&tenter=SOW":e.custom({url:"api/v1/task/receiveReward",data:{eventType:"join_fuli_act"}},function(e){1e3!=e.status?(1005==e.status&&$("#welfare .right").text("已完成").addClass("over"),Tools.alertDialog({text:e.desc,time:1e3},function(){window.location="http://activity.yuyiya.com/activity/index?id=1919&slotId=2953&login=normal&appKey=2cMgpedEXq4tgEy5Y6f4g963ZTkr&tenter=SOW"})):(Tools.alertDialog({text:"获得"+t.data("num")+"金币"}),setTimeout(function(){$("#welfare .right").text("已完成").addClass("over"),window.location="http://activity.yuyiya.com/activity/index?id=1919&slotId=2953&login=normal&appKey=2cMgpedEXq4tgEy5Y6f4g963ZTkr&tenter=SOW"},800))})}),$("#gatherA").on("click",function(){window.location="kmb://worthreadingtab"})}),define("mod/base",["zepto","../plugs/doT.min","./tools"],function(require,exports,module){function e(e,t){var n=e,o={"M+":n.getMonth()+1,"d+":n.getDate(),"h+":n.getHours(),"m+":n.getMinutes(),"s+":n.getSeconds(),"q+":Math.floor((n.getMonth()+3)/3),S:n.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(n.getFullYear()+"").substr(4-RegExp.$1.length)));for(var a in o)new RegExp("("+a+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?o[a]:("00"+o[a]).substr((""+o[a]).length)));return t}function t(e){var t,n=function(){};if(!e.status)return void Tools.alertDialog({title:"出错了",text:"没有返回status"});if(/1001|1002|1003|1004|1008|1009|1015/.test(e.status))t={title:"提醒",text:e.desc};else if(/1006/.test(e.status)){var o=5;t={title:"提醒",text:"访问太过频繁，<span id='closeTimer'>"+o+"</span>s后自动刷新"};var a=setInterval(function(){o--,o<1&&(clearInterval(a),window.location.reload()),$("#closeTimer").text(o)},1e3)}else{if(1101!=e.status)return t=null,!0;t={title:"提醒",text:"请打开设置->通用->日期与时间校准您的系统时间"}}return null!=t?(Tools.alertDialog(t,n),!1):void 0}var $=require("zepto");var n=require("../plugs/doT.min"),o={key:"26817749",magic_key:"24817749",km_api:server+"km_task/"};require("./tools"),module.exports={formatDate:function(t,n){var o=n||"yyyy-MM-dd hh:mm";if(isNaN(t)||null==t)return t;if("object"==typeof t){var a=dd.getFullYear(),i=dd.getMonth()+1,r=dd.getDate();i<10&&(i="0"+i);var s=a+"-"+i+"-"+r,l=s.match(/(\d+)/g),c=new Date(l[0],l[1]-1,l[2]);return e(c,o)}var c=new Date(parseInt(t));return e(c,o)},baseAjax:function(e,n){var a=navigator.userAgent,i=o.key;/magic/.test(a)&&(i=o.magic_key);var r={name:"app_key",value:i};e.showLoading&&(0==$(".ui-loading-block").length?$("body").append('<div class="ui-loading-block km-dialog show"><div class="ui-loading-cnt"><i class="ui-loading-bright"></i><p>加载中……</p></div></div>'):$(".ui-loading-block").addClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).hide()),e.data||(e.data={}),$.isFunction(e.data.push)?e.data.push(r):e.data.app_key=i,$.isFunction(e.data.push)?e.data.push({name:"auth_token",value:Tools.auth_token()}):e.data.auth_token=Tools.auth_token(),$.ajax({url:o.km_api+e.url,data:e.data,type:"GET",dataType:"jsonp",xhrFields:{withCredentials:!0},jsonpCallback:"jsonp"+Math.ceil(1e3*Math.random()),success:function(o){e.showLoading&&($(".ui-loading-block").removeClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).show()),t(o)&&n(o)},error:function(t,n,o){console.log(t),e.showLoading&&$(".ui-loading-block").removeClass("show"),"paging"!=e.logtype&&$(e.renderEle).show()}})},render:function(e,t,o,a,i){if($(t).length>0&&o){var r=a||void 0,s=$(t).text(),l=n.template(s,void 0,r);i?$(e).html(l(o)):$(e).append(l(o))}},custom:function(e,t){var n=this;e=e||{},e.logtype="custom",n.baseAjax(e,t)}}}),define("plugs/doT.min",[],function(require,exports,module){function e(t,n,o){return("string"==typeof n?n:n.toString()).replace(t.define||r,function(e,n,a,i){return 0===n.indexOf("def.")&&(n=n.substring(4)),n in o||(":"===a?(t.defineParams&&i.replace(t.defineParams,function(e,t,a){o[n]={arg:t,text:a}}),n in o||(o[n]=i)):new Function("def","def['"+n+"']="+i)(o)),""}).replace(t.use||r,function(n,a){t.useParams&&(a=a.replace(t.useParams,function(e,t,n,a){if(o[n]&&o[n].arg&&a)return e=(n+":"+a).replace(/'|\\/g,"_"),o.__exp=o.__exp||{},o.__exp[e]=o[n].text.replace(new RegExp("(^|[^\\w$])"+o[n].arg+"([^\\w$])","g"),"$1"+a+"$2"),t+"def.__exp['"+e+"']"}));var i=new Function("def","return "+a)(o);return i?e(t,i,o):i})}function t(e){return e.replace(/\\('|\\)/g,"$1").replace(/[\r\t\n]/g," ")}var n,o={version:"1.0.3",templateSettings:{evaluate:/\{\{([\s\S]+?(\}?)+)\}\}/g,interpolate:/\{\{=([\s\S]+?)\}\}/g,encode:/\{\{!([\s\S]+?)\}\}/g,use:/\{\{#([\s\S]+?)\}\}/g,useParams:/(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,define:/\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,defineParams:/^\s*([\w$]+):([\s\S]+)/,conditional:/\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,iterate:/\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,varname:"it",strip:!0,append:!0,selfcontained:!1,doNotSkipEncoded:!1},template:void 0,compile:void 0};o.encodeHTMLSource=function(e){var t={"&":"&#38;","<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","/":"&#47;"},n=e?/[&<>"'\/]/g:/&(?!#?\w+;)|<|>|"|'|\//g;return function(e){return e?e.toString().replace(n,function(e){return t[e]||e}):""}},n=function(){return this||(0,eval)("this")}(),void 0!==module&&module.exports?module.exports=o:"function"==typeof define&&define.amd?define(function(){return o}):n.doT=o;var a={start:"'+(",end:")+'",startencode:"'+encodeHTML("},i={start:"';out+=(",end:");out+='",startencode:"';out+=encodeHTML("},r=/$^/;o.template=function(s,l,c){l=l||o.templateSettings;var u,d,p=l.append?a:i,g=0;s=l.use||l.define?e(l,s,c||{}):s,s=("var out='"+(l.strip?s.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""):s).replace(/'|\\/g,"\\$&").replace(l.interpolate||r,function(e,n){return p.start+t(n)+p.end}).replace(l.encode||r,function(e,n){return u=!0,p.startencode+t(n)+p.end}).replace(l.conditional||r,function(e,n,o){return n?o?"';}else if("+t(o)+"){out+='":"';}else{out+='":o?"';if("+t(o)+"){out+='":"';}out+='"}).replace(l.iterate||r,function(e,n,o,a){return n?(g+=1,d=a||"i"+g,n=t(n),"';var arr"+g+"="+n+";if(arr"+g+"){var "+o+","+d+"=-1,l"+g+"=arr"+g+".length-1;while("+d+"<l"+g+"){"+o+"=arr"+g+"["+d+"+=1];out+='"):"';} } out+='"}).replace(l.evaluate||r,function(e,n){return"';"+t(n)+"out+='"})+"';return out;").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/\r/g,"\\r").replace(/(\s|;|\}|^|\{)out\+='';/g,"$1").replace(/\+''/g,""),u&&(l.selfcontained||!n||n._encodeHTML||(n._encodeHTML=o.encodeHTMLSource(l.doNotSkipEncoded)),s="var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("+o.encodeHTMLSource.toString()+"("+(l.doNotSkipEncoded||"")+"));"+s);try{return new Function(l.varname,s)}catch(e){throw"undefined"!=typeof console&&console.log("Could not create a template function: "+s),e}},o.compile=function(e,t){return o.template(e,null,t)},module.exports=o}),define("mod/tools",[],function(require){var e={getQueryValue:function(e){var t=location.search,n=new Array;if(t.length>1){var o=t.indexOf("?");t=t.substring(o+1,t.length)}else t=null;if(t)for(var a=0;a<t.split("&").length;a++)n[a]=t.split("&")[a];for(var i=0;i<n.length;i++)if(n[i].split("=")[0]==e)return decodeURI(n[i].split("=")[1]);return""},uid:function(){return this.getQueryValue("uid")||"null"},auth_token:function(){return this.getQueryValue("auth_token")||"null"},alertDialog:function(e,t){var n={title:null,text:null,img:null,time:3e3};for(var o in n)e[o]=e[o]||n[o];var a="tips"+(new Date).getTime(),i='<div id="'+a+'" class="ui-popup-screen km-dialog"><div class="ui-overlay-shadow km-popup">';e.time<1&&(i+='<i class="iconfont icon-close" id="close"></i>'),i+='<div class="content">',null!=e.title&&""!=e.title&&(i+="<h1>"+e.title+"</h1>"),null!=e.text&&""!=e.text&&(i+="<p>"+e.text+"</p>"),null!=e.img&&""!=e.img&&(i+='<div class="pic"><img src="'+e.img+'"/></div>'),i+="</div> </div> </div>";var r=$(i).appendTo("body"),s=$("#"+a+" .km-popup").height(),l=$(window).height(),c=(l-s)/2;if($("#"+a+" .km-popup").css("top",c),r.addClass("show-dialog"),$("#close").click(function(){$("#"+a).remove(),$.isFunction(t)&&t()}),e.time>0){var u=e.time;setTimeout(function(){$("#"+a).remove(),$.isFunction(t)&&t()},u)}}};window.Tools=e}),define("plugs/confirmTip",[],function(require,exports,module){var e=function(e,t){var n={title:"",text:"",sureTxt:"确定",cancelTxt:"取消"};this.option={};for(var o in n)this.option[o]=e[o]||n[o];this.id="pop_"+(new Date).getTime(),this.init(t)};e.prototype.init=function(e){var t=this,n=t.option,o=[],a=t.id;o.push('<div class="pop-mask km-dialog"></div>'),o.push('<div class="pop-screen km-dialog" id="'+a+'">'),o.push('<div class="box">'),""!=n.title&&o.push("<h2>"+n.title+"</h2>"),""!=n.text&&o.push('<div class="text">'+n.text+"</div>"),o.push('<div class="btnbox"><a class="cancelBtn">'+n.cancelTxt+'</a><a class="sureBtn">'+n.sureTxt+"</a></div>"),o.push("</div></div>"),$("body").append(o.join("")),$("#"+a).height($("#"+a+" .box").height()),$("#"+a+" .sureBtn").click(function(){$("#"+a).prev().remove(),$("#"+a).remove(),$.isFunction(e)&&e(!0)}),$("#"+a+" .cancelBtn").click(function(){$("#"+a).prev().remove(),$("#"+a).remove(),$.isFunction(e)&&e(!1)})},module.exports=e});