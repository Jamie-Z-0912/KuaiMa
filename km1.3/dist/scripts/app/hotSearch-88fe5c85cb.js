define("app/hotSearch",["../mod/base","../plugs/version","../plugs/storageCache.js","../plugs/confirmTip.js"],function(require,exports,module){function e(e){var t=[];t.push('<div class="ui-popup-screen search_tip km-dialog">'),t.push('<a href="kmb://search?keyword='+encodeURIComponent(e)+'" class="iconfont icon-close"></a>'),t.push('<div class="hot-tips">'),t.push('<div class="text">点选搜索结果，阅读一段时间<span>重复搜索无奖励</span></div>'),t.push('<img src="image/hotSearch_tip.png" />'),t.push('<a href="kmb://search?keyword='+encodeURIComponent(e)+'" class="btn">去点击</a>'),t.push("</div></div>"),$("body").append(t.join(""))}var t=require("../mod/base"),n=require("../plugs/version");if(n.less("1.4.4")){require("../plugs/storageCache.js");var i=require("../plugs/confirmTip.js");({expire:function(){var e=new Date,t=e.toLocaleDateString(),n=Math.ceil(e.getTime()/1e3),i=new Date(t+" 23:50:00").getTime()/1e3;return i-n>0?i-n:null},yes:function(){return!Storage.getCache("updateTipsH")&&(this.expire()&&Storage.setCache("updateTipsH",1,this.expire()),!0)}}).yes()&&new i({title:'<p style="padding: .1rem 0; line-height:1.8">请升级至1.4.4版本<br>8月30日起低版本将不能提现！</p>',sureTxt:"去升级",cancelTxt:"知道了"},function(e){e&&(window.location="http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser")})}t.custom({url:"api/v1/search/task"},function(e){var n=e.data,i=n.todaySearchKeywordNum,o=[];if($.each(n.isReceiveRewardFlags,function(e,t){var n={};n.key=e,n.isover=t,n.cur_num=i,n.width=i>e?"100%":i/e*100+"%",n.coin=80+2*(e-10),n.isok=i>e-1&&!t,o.push(n)}),t.render("#schedule","#schedule-tmpl",o,void 0,!0),n.searchHotKeywords.length>0){for(var a=[],r=0;r<n.searchHotKeywords.length;r++)a.push('<div class="keyword">'+n.searchHotKeywords[r]+"</div>");$("#keywords").html(a.join(""))}else $("#keywords").html('<a href="kmb://search" class="ui-btn">自己去搜索</a>')}),n.less("1.3.2")?($("#upgradeTip").removeClass("hide"),Tools.alertDialog({text:"本活动仅在1.3.2版本才有效<br/>快快更新升级吧~",time:"9999999"})):$("#upgradeTip").remove(),$("#keywords").on("click",".keyword",function(){e($(this).text())}),$("#schedule").on("click",".btn",function(){var e=$(this);if(e.hasClass("ok")){var n=e.data("goal");t.custom({url:"api/v1/searchReward/receive",data:{searchKeywordNum:n}},function(t){switch(t.status){case 1e3:Tools.alertDialog({text:"奖励领取成功"}),e.removeClass("ok").text("已经领取");break;case 9400:Tools.alertDialog({text:"搜索任务奖励已领取"}),e.removeClass("ok").text("已经领取");break;case 9401:Tools.alertDialog({text:"您还未达到搜索次数"});break;case 1007:Tools.alertDialog({text:"服务器异常，请退出稍后再试"});break;default:Tools.alertDialog({title:"领取失败",text:t.desc})}})}else window.location="kmb://search"})}),define("mod/base",["zepto","../plugs/doT.min","./tools"],function(require,exports,module){function e(e,t){var n=e,i={"M+":n.getMonth()+1,"d+":n.getDate(),"h+":n.getHours(),"m+":n.getMinutes(),"s+":n.getSeconds(),"q+":Math.floor((n.getMonth()+3)/3),S:n.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(n.getFullYear()+"").substr(4-RegExp.$1.length)));for(var o in i)new RegExp("("+o+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[o]:("00"+i[o]).substr((""+i[o]).length)));return t}function t(e){var t,n=function(){};if(!e.status)return void Tools.alertDialog({title:"出错了",text:"没有返回status"});if(/1001|1002|1003|1004|1008|1009|1015/.test(e.status))t={title:"提醒",text:e.desc};else if(/1006/.test(e.status)){var i=5;t={title:"提醒",text:"访问太过频繁，<span id='closeTimer'>"+i+"</span>s后自动刷新"};var o=setInterval(function(){i--,i<1&&(clearInterval(o),window.location.reload()),$("#closeTimer").text(i)},1e3)}else{if(1101!=e.status)return t=null,!0;t={title:"提醒",text:"请打开设置->通用->日期与时间校准您的系统时间"}}return null!=t?(Tools.alertDialog(t,n),!1):void 0}var $=require("zepto");var n=require("../plugs/doT.min"),i={key:"26817749",km_api:server+"km_task/"};require("./tools"),module.exports={formatDate:function(t,n){var i=n||"yyyy-MM-dd hh:mm";if(isNaN(t)||null==t)return t;if("object"==typeof t){var o=dd.getFullYear(),a=dd.getMonth()+1,r=dd.getDate();a<10&&(a="0"+a);var s=o+"-"+a+"-"+r,l=s.match(/(\d+)/g),u=new Date(l[0],l[1]-1,l[2]);return e(u,i)}var u=new Date(parseInt(t));return e(u,i)},baseAjax:function(e,n){var o={name:"app_key",value:i.key};e.showLoading&&(0==$(".ui-loading-block").length?$("body").append('<div class="ui-loading-block km-dialog show"><div class="ui-loading-cnt"><i class="ui-loading-bright"></i><p>加载中……</p></div></div>'):$(".ui-loading-block").addClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).hide()),e.data||(e.data={}),$.isFunction(e.data.push)?e.data.push(o):e.data.app_key=i.key,$.isFunction(e.data.push)?e.data.push({name:"auth_token",value:Tools.auth_token()}):e.data.auth_token=Tools.auth_token(),$.ajax({url:i.km_api+e.url,data:e.data,type:"GET",dataType:"jsonp",xhrFields:{withCredentials:!0},jsonpCallback:"jsonp"+Math.ceil(1e3*Math.random()),success:function(i){e.showLoading&&($(".ui-loading-block").removeClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).show()),t(i)&&n(i)},error:function(t,n,i){console.log(t),e.showLoading&&$(".ui-loading-block").removeClass("show"),"paging"!=e.logtype&&$(e.renderEle).show()}})},render:function(e,t,i,o,a){if($(t).length>0&&i){var r=o||void 0,s=$(t).text(),l=n.template(s,void 0,r);a?$(e).html(l(i)):$(e).append(l(i))}},custom:function(e,t){var n=this;e=e||{},e.logtype="custom",n.baseAjax(e,t)}}}),define("plugs/doT.min",[],function(require,exports,module){function e(t,n,i){return("string"==typeof n?n:n.toString()).replace(t.define||r,function(e,n,o,a){return 0===n.indexOf("def.")&&(n=n.substring(4)),n in i||(":"===o?(t.defineParams&&a.replace(t.defineParams,function(e,t,o){i[n]={arg:t,text:o}}),n in i||(i[n]=a)):new Function("def","def['"+n+"']="+a)(i)),""}).replace(t.use||r,function(n,o){t.useParams&&(o=o.replace(t.useParams,function(e,t,n,o){if(i[n]&&i[n].arg&&o)return e=(n+":"+o).replace(/'|\\/g,"_"),i.__exp=i.__exp||{},i.__exp[e]=i[n].text.replace(new RegExp("(^|[^\\w$])"+i[n].arg+"([^\\w$])","g"),"$1"+o+"$2"),t+"def.__exp['"+e+"']"}));var a=new Function("def","return "+o)(i);return a?e(t,a,i):a})}function t(e){return e.replace(/\\('|\\)/g,"$1").replace(/[\r\t\n]/g," ")}var n,i={version:"1.0.3",templateSettings:{evaluate:/\{\{([\s\S]+?(\}?)+)\}\}/g,interpolate:/\{\{=([\s\S]+?)\}\}/g,encode:/\{\{!([\s\S]+?)\}\}/g,use:/\{\{#([\s\S]+?)\}\}/g,useParams:/(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,define:/\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,defineParams:/^\s*([\w$]+):([\s\S]+)/,conditional:/\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,iterate:/\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,varname:"it",strip:!0,append:!0,selfcontained:!1,doNotSkipEncoded:!1},template:void 0,compile:void 0};i.encodeHTMLSource=function(e){var t={"&":"&#38;","<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","/":"&#47;"},n=e?/[&<>"'\/]/g:/&(?!#?\w+;)|<|>|"|'|\//g;return function(e){return e?e.toString().replace(n,function(e){return t[e]||e}):""}},n=function(){return this||(0,eval)("this")}(),void 0!==module&&module.exports?module.exports=i:"function"==typeof define&&define.amd?define(function(){return i}):n.doT=i;var o={start:"'+(",end:")+'",startencode:"'+encodeHTML("},a={start:"';out+=(",end:");out+='",startencode:"';out+=encodeHTML("},r=/$^/;i.template=function(s,l,u){l=l||i.templateSettings;var c,d,p=l.append?o:a,g=0;s=l.use||l.define?e(l,s,u||{}):s,s=("var out='"+(l.strip?s.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""):s).replace(/'|\\/g,"\\$&").replace(l.interpolate||r,function(e,n){return p.start+t(n)+p.end}).replace(l.encode||r,function(e,n){return c=!0,p.startencode+t(n)+p.end}).replace(l.conditional||r,function(e,n,i){return n?i?"';}else if("+t(i)+"){out+='":"';}else{out+='":i?"';if("+t(i)+"){out+='":"';}out+='"}).replace(l.iterate||r,function(e,n,i,o){return n?(g+=1,d=o||"i"+g,n=t(n),"';var arr"+g+"="+n+";if(arr"+g+"){var "+i+","+d+"=-1,l"+g+"=arr"+g+".length-1;while("+d+"<l"+g+"){"+i+"=arr"+g+"["+d+"+=1];out+='"):"';} } out+='"}).replace(l.evaluate||r,function(e,n){return"';"+t(n)+"out+='"})+"';return out;").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/\r/g,"\\r").replace(/(\s|;|\}|^|\{)out\+='';/g,"$1").replace(/\+''/g,""),c&&(l.selfcontained||!n||n._encodeHTML||(n._encodeHTML=i.encodeHTMLSource(l.doNotSkipEncoded)),s="var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("+i.encodeHTMLSource.toString()+"("+(l.doNotSkipEncoded||"")+"));"+s);try{return new Function(l.varname,s)}catch(e){throw"undefined"!=typeof console&&console.log("Could not create a template function: "+s),e}},i.compile=function(e,t){return i.template(e,null,t)},module.exports=i}),define("mod/tools",[],function(require){var e={getQueryValue:function(e){var t=location.search,n=new Array;if(t.length>1){var i=t.indexOf("?");t=t.substring(i+1,t.length)}else t=null;if(t)for(var o=0;o<t.split("&").length;o++)n[o]=t.split("&")[o];for(var a=0;a<n.length;a++)if(n[a].split("=")[0]==e)return decodeURI(n[a].split("=")[1]);return""},uid:function(){return this.getQueryValue("uid")||"null"},auth_token:function(){return this.getQueryValue("auth_token")||"null"},alertDialog:function(e,t){var n={title:null,text:null,img:null,time:3e3};for(var i in n)e[i]=e[i]||n[i];var o="tips"+(new Date).getTime(),a='<div id="'+o+'" class="ui-popup-screen km-dialog"><div class="ui-overlay-shadow km-popup">';e.time<1&&(a+='<i class="iconfont icon-close" id="close"></i>'),a+='<div class="content">',null!=e.title&&""!=e.title&&(a+="<h1>"+e.title+"</h1>"),null!=e.text&&""!=e.text&&(a+="<p>"+e.text+"</p>"),null!=e.img&&""!=e.img&&(a+='<div class="pic"><img src="'+e.img+'"/></div>'),a+="</div> </div> </div>";var r=$(a).appendTo("body"),s=$("#"+o+" .km-popup").height(),l=$(window).height(),u=(l-s)/2;if($("#"+o+" .km-popup").css("top",u),r.addClass("show-dialog"),$("#close").click(function(){$("#"+o).remove(),$.isFunction(t)&&t()}),e.time>0){var c=e.time;setTimeout(function(){$("#"+o).remove(),$.isFunction(t)&&t()},c)}}};window.Tools=e}),define("plugs/version",[],function(require,exports,module){var e,t={},n=navigator.userAgent;if(t.isKM=/KuaiMa/.test(n),t.isKM){var i=n.split("ssy=")[1];e=/iOS|Android/.test(i.split(";")[0])?i.split(";")[2]:i.split(";")[1],t.version=e.replace("V","")}t.userAgent=n,t.equal=function(e){return!!t.isKM&&e==this.version},t.greater=function(e){if(t.isKM){for(var n=this.version.split("."),i=e.split("."),o=!1,a=0;a<n.length&&!(n[a]<i[a]);a++)n[a]>i[a]&&(o=!0);return o}return!1},t.less=function(e){if(t.isKM){for(var n=this.version.split("."),i=e.split("."),o=!1,a=0;a<n.length&&!(n[a]>i[a]);a++)n[a]<i[a]&&(o=!0);return o}return!1},t.gEq=function(e){return!(!this.equal(e)&&!this.greater(e))},t.lEq=function(e){return!(!this.equal(e)&&!this.less(e))},module.exports=t}),define("plugs/storageCache",[],function(){function e(e,t){var n=(new Date).getTime();this.c=n,t=t||o,this.e=n+1e3*t,this.v=e}function t(e){return"object"==typeof e&&!!(e&&"c"in e&&"e"in e&&"v"in e)}function n(e){return(new Date).getTime()<e.e}var i=new Date("Fri, 31 Dec 9999 23:59:59 UTC"),o=i.getTime(),a={serialize:function(e){return JSON.stringify(e)},deserialize:function(e){return e&&JSON.parse(e)}},r={AUTH:"KMAUTH",NAME:"MY-NAME",get:function(e,t){if(this.isLocalStorage()){var n=this.getStorage(t).getItem(e);return n?JSON.parse(n):void 0}},set:function(e,t,n){this.isLocalStorage()&&(t=JSON.stringify(t),this.getStorage(n).setItem(e,t))},remove:function(e,t){this.isLocalStorage()&&this.getStorage(t).removeItem(e)},setCache:function(t,n,i,o){if(this.isLocalStorage()){var r=new e(n,i);this.getStorage(o).setItem(t,a.serialize(r))}},getCache:function(e,i){var o=null;try{var r=this.getStorage(i).getItem(e);o=a.deserialize(r)}catch(e){return null}if(t(o)){if(n(o)){var r=o.v;return r}return this.remove(e),null}return null},getStorage:function(e){return e?sessionStorage:localStorage},isLocalStorage:function(){try{return!!window.localStorage||(console.log("不支持本地存储"),!1)}catch(e){return console.log("本地存储已关闭"),!1}}};window.Storage=r}),define("plugs/confirmTip",[],function(require,exports,module){var e=function(e,t){var n={title:"",text:"",sureTxt:"确定",cancelTxt:"取消"};this.option={};for(var i in n)this.option[i]=e[i]||n[i];this.id="pop_"+(new Date).getTime(),this.init(t)};e.prototype.init=function(e){var t=this,n=t.option,i=[],o=t.id;i.push('<div class="pop-mask km-dialog"></div>'),i.push('<div class="pop-screen km-dialog" id="'+o+'">'),i.push('<div class="box">'),""!=n.title&&i.push("<h2>"+n.title+"</h2>"),""!=n.text&&i.push('<div class="text">'+n.text+"</div>"),i.push('<div class="btnbox"><a class="cancelBtn">'+n.cancelTxt+'</a><a class="sureBtn">'+n.sureTxt+"</a></div>"),i.push("</div></div>"),$("body").append(i.join("")),$("#"+o).height($("#"+o+" .box").height()),$("#"+o+" .sureBtn").click(function(){$("#"+o).prev().remove(),$("#"+o).remove(),$.isFunction(e)&&e(!0)}),$("#"+o+" .cancelBtn").click(function(){$("#"+o).prev().remove(),$("#"+o).remove(),$.isFunction(e)&&e(!1)})},module.exports=e});