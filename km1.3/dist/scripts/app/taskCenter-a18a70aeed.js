define("app/taskCenter",["../mod/pagelist","../plugs/cookieStorage.js","../plugs/version","../plugs/timer.js","../plugs/tipsAd.js","../plugs/secondPage.js"],function(require,exports,module){var e=require("../mod/pagelist");require("../plugs/cookieStorage.js");var t=require("../plugs/version"),n=require("../plugs/timer.js"),i=require("../plugs/tipsAd.js"),a=require("../plugs/secondPage.js");if("null"==Tools.auth_token()){var o={title:"提醒",text:"请在快马浏览器中登录再访问！",time:5e3};return void Tools.alertDialog(o,function(){window.location="kmb://alertlogin"})}if(t.less("1.1.0"))return Tools.alertDialog({title:"重大更新",text:'快马浏览器全新改版<br>签到每次得0.5元<br></br><a style="background-color:#fa0;color:#fff;display:inline-block;padding: 5px 10px;" href="http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser">马上更新</a>',time:"0"}),void $("#close").remove();t.less("1.3.0")?$("#hotSearch").remove():($("#hotSearch").show(),$("#hotSearch").on("click",function(){window.location="kmb://hotsearch"})),t.less("1.2.0")?$("#replyC, #likeC").remove():($("#replyC, #likeC").show(),$("#replyC, #likeC").on("click",function(){window.location="kmb://main"}));var s=700;Ajax.custom({url:"api/v1/checkin/setting"},function(e){var t=e.data;s=t.commission||700,t.is_checkin?(Storage.set("hasCheckin","1",!0),$("#signin").removeClass("checkin").addClass("hasCheckin").text("已签到"),$("#leftNum").text("签到获得 "+s+"金币"),$("#timer").parent().html("开抢时间：每日10点")):t.left_num>0?($("#leftNum").text("今日剩余 "+t.left_num+"/"+t.total_num),new n("#timer",t.left_seconds,t.is_start,function(){$("#signin").addClass("checkin"),Storage.get("hasCheckin",!0)&&1==Storage.get("hasCheckin",!0)&&$("#signin").removeClass("checkin").addClass("hasCheckin")}),$("#timer").parent().show()):($("#leftNum").text("今日剩余 0/"+t.total_num),$("#timer").parent().html("开抢时间：每日10点").show(),$("#signin").addClass("over").text("已抢光"),Storage.get("hasCheckin",!0)&&Storage.remove("hasCheckin",!0))});var r=[{img:"./image/runAD/run9.png",link:"http://browser.kuaima.cn/tongji/4qianDao.html?url=https://engine.tuia.cn/index/activity?appKey=2cMgpedEXq4tgEy5Y6f4g963ZTkr&adslotId=495"}];$("#signin").on("click",function(){var e=$(this);if(e.hasClass("checkin")){e.removeClass("checkin");var t=Math.floor(Math.random()*r.length),n=new i({type:"waiting",subtit:"拼命疯抢中…",isClose:"no",adImg:r[t].img,adLink:r[t].link});setTimeout(function(){Ajax.custom({url:"api/v1/checkin"},function(t){if(n.close(),1e3==t.status){e.addClass("hasCheckin"),Storage.set("hasCheckin",1,!0);var a=Math.floor(Math.random()*r.length);new i({type:"ok",title:"签到成功",text:"恭喜你获得"+t.data.commission+"金币",adImg:r[a].img,adLink:r[a].link}),$("#leftNum").text("签到获得 "+t.data.commission+"金币"),$("#signin").removeClass("checkin").addClass("hasCheckin").text("已签到"),$("#timer").parent().html("开抢时间：每日10点");var o=document.createElement("iframe");o.src="kmb://refreshgold",o.style.display="none",$("body").append(o),$(o).remove()}if(9001==t.status&&(e.addClass("hasCheckin"),Storage.set("hasCheckin",1,!0),Tools.alertDialog({text:"今天已签到，明天再来吧"})),3001==t.status||3004==t.status){e.addClass("over").text("已抢光"),$("#leftNum").text("今日剩余 0/5000");var a=Math.floor(Math.random()*r.length);new i({type:"over",title:"签到失败",text:"今日份额已抢完，明天再来吧",adImg:r[a].img,adLink:r[a].link})}})},1e3)}else{if($(this).hasClass("over")){var t=Math.floor(Math.random()*r.length);return void new i({type:"over",title:"手慢了",text:"今日已抢，明天10点准时再来",adImg:r[t].img,adLink:r[t].link})}if(e.hasClass("hasCheckin")){var t=Math.floor(Math.random()*r.length);return void new i({type:"",title:"恭喜你",text:"今日签到成功，明天继续哦~",adImg:r[t].img,adLink:r[t].link})}Tools.alertDialog({text:"签到未开始，稍后再试",time:"0"})}}),$("#rule").on("click",function(){new i({type:"rule",subtit:"每天上午10点准时开抢",text:"开启提醒，快人一步！<br>数量有限，先到先得！",hasAd:"0",isClose:"no",btnType:"1"})}),$("#readA").on("click",function(){window.location="kmb://main"}),$("#inviteF").on("click",function(){window.location="kmb://invite"}),$("#shareA").on("click",function(){window.location="kmb://back"});var l=new a("#signList"),c=$("#signList .btn");$("#viewList").on("click",function(){var t=$(this);if(t.hasClass("shaodeng"))return void Tools.alertDialog({text:"5s内限查看一次，请稍后再试~"});t.addClass("shaodeng"),setTimeout(function(){t.removeClass("shaodeng")},5e3),e.fun({url:"api/v1/checkin/logs",data:{page:1,page_size:20}}),$("#listPage").hide(),l.openSidebar(),$("#conList").height(innerHeight-c.height())}),c.on("click",function(){l.closeSidebar()})}),define("mod/pagelist",["./base","../plugs/laypage"],function(require,exports,module){var e=require("./base"),t=require("../plugs/laypage");window.Ajax=e,exports.defaultListTmpl="#conList-tmpl",exports.defaultListEle="#conList",exports.pagingDom="#listPage",exports.fun=function(n,i,a){var o=(n.data.page,{renderFor:this.defaultListTmpl,renderEle:this.defaultListEle,pagingDom:this.pagingDom,showLoading:!0,hasNext:!0,logtype:"paging"});for(var s in o)n[s]=n[s]||o[s];t({cont:$(n.pagingDom),pages:100,groups:0,curr:1,prev:!1,next:"点击查看更多",skin:"flow",jump:function(t){var o=this;n.data.page=t.curr,e.baseAjax(n,function(s){1020==s.status?(s.data=null,e.render(n.renderEle,n.renderFor,s,void 0,!0),$(n.pagingDom).remove()):(o.pages=s.total,t.curr==s.total&&(n.hasNext=!1,$(n.pagingDom).find(".laypage_main").html("<span>没有更多数据</span>")),$.each(s.data,function(){this.added_time=e.formatDate(this.added_time)}),a||$.isFunction(i)&&i(s),1!=s.page?e.render(n.renderEle,n.renderFor,s,void 0,!1):e.render(n.renderEle,n.renderFor,s,void 0,!0),a&&$.isFunction(i)&&i(),$(n.pagingDom).removeClass("hide"))},function(e,t,n){"function"==typeof callbackError&&callbackError(e,t,n)})}}),window.onscroll=function(){if(n.hasNext){var e=document.body.scrollTop,t=document.body.scrollHeight;e+window.screen.height*window.devicePixelRatio+100>t&&$("#laypage_0 a").click()}}}}),define("mod/base",["zepto","../plugs/doT.min","./tools"],function(require,exports,module){function e(e,t){var n=e,i={"M+":n.getMonth()+1,"d+":n.getDate(),"h+":n.getHours(),"m+":n.getMinutes(),"s+":n.getSeconds(),"q+":Math.floor((n.getMonth()+3)/3),S:n.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(n.getFullYear()+"").substr(4-RegExp.$1.length)));for(var a in i)new RegExp("("+a+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[a]:("00"+i[a]).substr((""+i[a]).length)));return t}function t(e){var t,n=function(){};if(!e.status)return void Tools.alertDialog({title:"提醒",text:"系统错误，请稍后重试！"});switch(e.status){case 1101:t={title:"提醒",text:"请打开设置->通用->日期与时间校准您的系统时间"};break;case 1004:t={title:"提醒",text:"请在快马浏览器中登录再访问！"};break;case 1002:t={title:"提醒",text:"请在快马浏览器中访问！"};break;case 1006:var i=5;t={title:"提醒",text:"访问太过频繁，<span id='closeTimer'>"+i+"</span>s后自动刷新"};var a=setInterval(function(){i--,i<1&&(clearInterval(a),window.location.reload()),$("#closeTimer").text(i)},1e3);break;default:return t=null,!0}return null!=t?(Tools.alertDialog(t,n),!1):void 0}var $=require("zepto");var n=require("../plugs/doT.min"),i={key:"26817749",km_api:"http://test.kuaima.cn/km_task/"};require("./tools"),module.exports={formatDate:function(t,n){var i=n||"yyyy-MM-dd hh:mm";if(isNaN(t)||null==t)return t;if("object"==typeof t){var a=dd.getFullYear(),o=dd.getMonth()+1,s=dd.getDate();o<10&&(o="0"+o);var r=a+"-"+o+"-"+s,l=r.match(/(\d+)/g),c=new Date(l[0],l[1]-1,l[2]);return e(c,i)}var c=new Date(parseInt(t));return e(c,i)},baseAjax:function(e,n){var a={name:"app_key",value:i.key};e.showLoading&&(0==$(".ui-loading-block").length?$("body").append('<div class="ui-loading-block km-dialog show"><div class="ui-loading-cnt"><i class="ui-loading-bright"></i><p>加载中……</p></div></div>'):$(".ui-loading-block").addClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).hide()),e.data||(e.data={}),$.isFunction(e.data.push)?e.data.push(a):e.data.app_key=i.key,$.isFunction(e.data.push)?e.data.push({name:"auth_token",value:Tools.auth_token()}):e.data.auth_token=Tools.auth_token(),$.ajax({url:i.km_api+e.url,data:e.data,type:"GET",dataType:"jsonp",xhrFields:{withCredentials:!0},jsonpCallback:"jsonp"+Math.ceil(1e3*Math.random()),success:function(i){e.showLoading&&($(".ui-loading-block").removeClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).show()),t(i)&&n(i)},error:function(t,n,i){console.log(t),e.showLoading&&$(".ui-loading-block").removeClass("show"),"paging"!=e.logtype&&$(e.renderEle).show()}})},render:function(e,t,i,a,o){if($(t).length>0&&i){var s=a||void 0,r=$(t).text(),l=n.template(r,void 0,s);o?$(e).html(l(i)):$(e).append(l(i))}},custom:function(e,t){var n=this;e=e||{},e.logtype="custom",n.baseAjax(e,t)}}}),define("plugs/doT.min",[],function(require,exports,module){function e(t,n,i){return("string"==typeof n?n:n.toString()).replace(t.define||s,function(e,n,a,o){return 0===n.indexOf("def.")&&(n=n.substring(4)),n in i||(":"===a?(t.defineParams&&o.replace(t.defineParams,function(e,t,a){i[n]={arg:t,text:a}}),n in i||(i[n]=o)):new Function("def","def['"+n+"']="+o)(i)),""}).replace(t.use||s,function(n,a){t.useParams&&(a=a.replace(t.useParams,function(e,t,n,a){if(i[n]&&i[n].arg&&a)return e=(n+":"+a).replace(/'|\\/g,"_"),i.__exp=i.__exp||{},i.__exp[e]=i[n].text.replace(new RegExp("(^|[^\\w$])"+i[n].arg+"([^\\w$])","g"),"$1"+a+"$2"),t+"def.__exp['"+e+"']"}));var o=new Function("def","return "+a)(i);return o?e(t,o,i):o})}function t(e){return e.replace(/\\('|\\)/g,"$1").replace(/[\r\t\n]/g," ")}var n,i={version:"1.0.3",templateSettings:{evaluate:/\{\{([\s\S]+?(\}?)+)\}\}/g,interpolate:/\{\{=([\s\S]+?)\}\}/g,encode:/\{\{!([\s\S]+?)\}\}/g,use:/\{\{#([\s\S]+?)\}\}/g,useParams:/(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,define:/\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,defineParams:/^\s*([\w$]+):([\s\S]+)/,conditional:/\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,iterate:/\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,varname:"it",strip:!0,append:!0,selfcontained:!1,doNotSkipEncoded:!1},template:void 0,compile:void 0};i.encodeHTMLSource=function(e){var t={"&":"&#38;","<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","/":"&#47;"},n=e?/[&<>"'\/]/g:/&(?!#?\w+;)|<|>|"|'|\//g;return function(e){return e?e.toString().replace(n,function(e){return t[e]||e}):""}},n=function(){return this||(0,eval)("this")}(),void 0!==module&&module.exports?module.exports=i:"function"==typeof define&&define.amd?define(function(){return i}):n.doT=i;var a={start:"'+(",end:")+'",startencode:"'+encodeHTML("},o={start:"';out+=(",end:");out+='",startencode:"';out+=encodeHTML("},s=/$^/;i.template=function(r,l,c){l=l||i.templateSettings;var u,p,d=l.append?a:o,g=0;r=l.use||l.define?e(l,r,c||{}):r,r=("var out='"+(l.strip?r.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""):r).replace(/'|\\/g,"\\$&").replace(l.interpolate||s,function(e,n){return d.start+t(n)+d.end}).replace(l.encode||s,function(e,n){return u=!0,d.startencode+t(n)+d.end}).replace(l.conditional||s,function(e,n,i){return n?i?"';}else if("+t(i)+"){out+='":"';}else{out+='":i?"';if("+t(i)+"){out+='":"';}out+='"}).replace(l.iterate||s,function(e,n,i,a){return n?(g+=1,p=a||"i"+g,n=t(n),"';var arr"+g+"="+n+";if(arr"+g+"){var "+i+","+p+"=-1,l"+g+"=arr"+g+".length-1;while("+p+"<l"+g+"){"+i+"=arr"+g+"["+p+"+=1];out+='"):"';} } out+='"}).replace(l.evaluate||s,function(e,n){return"';"+t(n)+"out+='"})+"';return out;").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/\r/g,"\\r").replace(/(\s|;|\}|^|\{)out\+='';/g,"$1").replace(/\+''/g,""),u&&(l.selfcontained||!n||n._encodeHTML||(n._encodeHTML=i.encodeHTMLSource(l.doNotSkipEncoded)),r="var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("+i.encodeHTMLSource.toString()+"("+(l.doNotSkipEncoded||"")+"));"+r);try{return new Function(l.varname,r)}catch(e){throw"undefined"!=typeof console&&console.log("Could not create a template function: "+r),e}},i.compile=function(e,t){return i.template(e,null,t)},module.exports=i}),define("mod/tools",[],function(require){var e={getQueryValue:function(e){var t=location.search,n=new Array;if(t.length>1){var i=t.indexOf("?");t=t.substring(i+1,t.length)}else t=null;if(t)for(var a=0;a<t.split("&").length;a++)n[a]=t.split("&")[a];for(var o=0;o<n.length;o++)if(n[o].split("=")[0]==e)return decodeURI(n[o].split("=")[1]);return""},uid:function(){return this.getQueryValue("uid")||"null"},auth_token:function(){return this.getQueryValue("auth_token")||"null"},alertDialog:function(e,t){var n={title:null,text:null,img:null,time:3e3};for(var i in n)e[i]=e[i]||n[i];var a="tips"+(new Date).getTime(),o='<div id="'+a+'" class="ui-popup-screen km-dialog"><div class="ui-overlay-shadow km-popup">';e.time<1&&(o+='<i class="iconfont icon-close" id="close"></i>'),o+='<div class="content">',null!=e.title&&""!=e.title&&(o+="<h1>"+e.title+"</h1>"),null!=e.text&&""!=e.text&&(o+="<p>"+e.text+"</p>"),null!=e.img&&""!=e.img&&(o+='<div class="pic"><img src="'+e.img+'"/></div>'),o+="</div> </div> </div>";var s=$(o).appendTo("body"),r=$("#"+a+" .km-popup").height(),l=$(window).height(),c=(l-r)/2;if($("#"+a+" .km-popup").css("top",c),s.addClass("show-dialog"),$("#close").click(function(){$("#"+a).remove(),$.isFunction(t)&&t()}),e.time>0){var u=e.time;setTimeout(function(){$("#"+a).remove(),$.isFunction(t)&&t()},u)}}};window.Tools=e}),function(){"use strict";function e(i){var a="laypagecss";e.dir="dir"in e?e.dir:o.getpath+"../css/skin/laypage.css",new o(i),e.dir&&!t[n](a)&&o.use(e.dir,a)}e.v="1.3";var t=document,n="getElementById",i="getElementsByTagName",a=0,o=function(e){var t=this;(t.config=e||{}).item=a++,t.render(!0)};o.on=function(e,t,n){return e.attachEvent?e.attachEvent("on"+t,function(){n.call(e,window.even)}):e.addEventListener(t,n,!1),o},o.getpath=function(){var e=document.scripts,t=e[e.length-1].src;return t.substring(0,t.lastIndexOf("/")+1)}(),o.use=function(e,t){},o.prototype.type=function(){var e=this.config;return"object"==typeof e.cont?void 0===e.cont.length?2:3:void 0},o.prototype.view=function(){var t=this,n=t.config,i=[],a={};if(n.pages=0|n.pages,n.curr=0|n.curr||1,n.groups="groups"in n?0|n.groups:5,n.first="first"in n?n.first:"&#x9996;&#x9875;",n.last="last"in n?n.last:"&#x5C3E;&#x9875;",n.prev="prev"in n?n.prev:"&#x4E0A;&#x4E00;&#x9875;",n.next="next"in n?n.next:"&#x4E0B;&#x4E00;&#x9875;",n.pages<=1)return"";for(n.groups>n.pages&&(n.groups=n.pages),a.index=Math.ceil((n.curr+(n.groups>1&&n.groups!==n.pages?1:0))/(0===n.groups?1:n.groups)),n.curr>1&&n.prev&&i.push('<a href="javascript:;" class="laypage_prev" data-page="'+(n.curr-1)+'">'+n.prev+"</a>"),a.index>1&&n.first&&0!==n.groups&&i.push('<a href="javascript:;" class="laypage_first" data-page="1"  title="&#x9996;&#x9875;">'+n.first+"</a><span>&#x2026;</span>"),a.poor=Math.floor((n.groups-1)/2),a.start=a.index>1?n.curr-a.poor:1,a.end=a.index>1?function(){var e=n.curr+(n.groups-a.poor-1);return e>n.pages?n.pages:e}():n.groups,a.end-a.start<n.groups-1&&(a.start=a.end-n.groups+1);a.start<=a.end;a.start++)a.start===n.curr?i.push('<span class="laypage_curr" '+(/^#/.test(n.skin)?'style="background-color:'+n.skin+'"':"")+">"+a.start+"</span>"):i.push('<a href="javascript:;" data-page="'+a.start+'">'+a.start+"</a>");return n.pages>n.groups&&a.end<n.pages&&n.last&&0!==n.groups&&i.push('<span>&#x2026;</span><a href="javascript:;" class="laypage_last" title="&#x5C3E;&#x9875;"  data-page="'+n.pages+'">'+n.last+"</a>"),a.flow=!n.prev&&0===n.groups,(n.curr!==n.pages&&n.next||a.flow)&&i.push(function(){return a.flow&&n.curr===n.pages?'<span class="page_nomore" title="&#x5DF2;&#x6CA1;&#x6709;&#x66F4;&#x591A;">'+n.next+"</span>":'<a href="javascript:;" class="laypage_next" data-page="'+(n.curr+1)+'">'+n.next+"</a>"}()),'<div name="laypage'+e.v+'" class="laypage_main laypageskin_'+(n.skin?function(e){return/^#/.test(e)?"molv":e}(n.skin):"default")+'" id="laypage_'+t.config.item+'">'+i.join("")+function(){return n.skip?'<span class="laypage_total"><label>&#x5230;&#x7B2C;</label><input type="number" min="1" onkeyup="this.value=this.value.replace(/\\D/, \'\');" class="laypage_skip"><label>&#x9875;</label><button type="button" class="laypage_btn">&#x786e;&#x5b9a;</button></span>':""}()+"</div>"},o.prototype.jump=function(e){if(e){for(var t=this,n=t.config,a=e.children,s=e[i]("button")[0],r=e[i]("input")[0],l=0,c=a.length;c>l;l++)"a"===a[l].nodeName.toLowerCase()&&o.on(a[l],"click",function(){var e=0|this.getAttribute("data-page");n.curr=e,t.render()});s&&o.on(s,"click",function(){var e=0|r.value.replace(/\s|\D/g,"");e&&e<=n.pages&&(n.curr=e,t.render())})}},o.prototype.render=function(e){var i=this,a=i.config,o=i.type(),s=i.view();2===o?a.cont.innerHTML=s:3===o?a.cont.html(s):t[n](a.cont).innerHTML=s,a.jump&&a.jump(a,e),i.jump(t[n]("laypage_"+a.item)),a.hash&&!e&&(location.hash="!"+a.hash+"="+a.curr)},"function"==typeof define?define("plugs/laypage",[],function(){return e}):"undefined"!=typeof exports?module.exports=e:window.laypage=e}(),define("plugs/cookieStorage",[],function(){var e={get:function(e){var t="(?:;)?"+e+"=([^;]*);?";if(!new RegExp(t).test(document.cookie))return null;try{return unescape(RegExp.$1)}catch(e){return null}},set:function(e,t,n){n=n||this.getExpDate(7,0,0),"number"==typeof n&&(n=this.getExpDate(n,0,0)),document.cookie=e+"="+escape(t)+(null==n?"":";expires="+n)+"; path=/"},remove:function(e){this.set(e,"",-1)},getExpDate:function(e,t,n){var i=new Date;if("number"==typeof e&&"number"==typeof t&&"number"==typeof t)return i.setDate(i.getDate()+parseInt(e)),i.setHours(i.getHours()+parseInt(t)),i.setMinutes(i.getMinutes()+parseInt(n)),i.toGMTString()}};window.Cookie=e;var t={AUTH:"KMAUTH",LNAME:"MY-LNAME",ACCOUNT:"MY-NAME",HEADIMG:"MY-HEADIMG",get:function(e,t){if(this.isLocalStorage()){var n=this.getStorage(t).getItem(e);return n?JSON.parse(n):void 0}},set:function(e,t,n){this.isLocalStorage()&&(t=JSON.stringify(t),this.getStorage(n).setItem(e,t))},remove:function(e,t){this.isLocalStorage()&&this.getStorage(t).removeItem(e)},getStorage:function(e){return e?sessionStorage:localStorage},isLocalStorage:function(){try{return!!window.localStorage||(console.log("不支持本地存储"),!1)}catch(e){return console.log("本地存储已关闭"),!1}}};window.Storage=t}),define("plugs/version",[],function(require,exports,module){var e,t={},n=navigator.userAgent;if(t.isKM=/KuaiMa/.test(n),t.isKM){var i=n.split("ssy=")[1];e=/iOS|Android/.test(i.split(";")[0])?i.split(";")[2]:i.split(";")[1],t.version=e.replace("V","")}t.equal=function(e){return!!t.isKM&&e==this.version},t.greater=function(e){if(t.isKM){for(var n=this.version.split("."),i=e.split("."),a=!1,o=0;o<n.length&&!(n[o]<i[o]);o++)n[o]>i[o]&&(a=!0);return a}return!1},t.less=function(e){if(t.isKM){for(var n=this.version.split("."),i=e.split("."),a=!1,o=0;o<n.length&&!(n[o]>i[o]);o++)n[o]<i[o]&&(a=!0);return a}return!1},t.gEq=function(e){return!(!this.equal(e)&&!this.greater(e))},t.lEq=function(e){return!(!this.equal(e)&&!this.less(e))},module.exports=t}),define("plugs/timer",[],function(require,exports,module){var e=function(e,t,n,i){this.el=e,this.remaining=t,this.isFirst=!0,this.isStart=n||!1,this.zeroize=function(e){return e<10?"0"+e:""+e},this.callback=i,this.init()};e.prototype.init=function(){var e,t,n,i=this;if(i.isStart){if(0==i.remaining)return $(i.el).html('<em class="h">00</em>:<em class="m">00</em>:<em class="s">00</em>').show().prev().show(),void($.isFunction(i.callback)&&i.callback());$(i.el).html("开抢时间：每日10点").show(),$("#signin").addClass("over")}else i.remaining>7200?$(i.el).html("今日10点开抢").show():(e=parseInt(i.remaining/3600),t=parseInt(i.remaining%3600/60),n=parseInt(i.remaining%3600%60),$(i.el).html('<em class="h">'+i.zeroize(e)+'</em>:<em class="m">'+i.zeroize(t)+'</em>:<em class="s">'+i.zeroize(n)+"</em>").show().prev().show(),i.count())},e.prototype.count=function(){var e,t,n,i,a,o,s=this;if(n=parseInt($(s.el+" .s").text()),t=parseInt($(s.el+" .m").text()),e=parseInt($(s.el+" .h").text()),i=n>0?n-1:0==t&&0==e?0:59,$(s.el+" .s").text(s.zeroize(i)),0==n&&(a=t>0?t-1:0==e?0:59,$(s.el+" .m").text(s.zeroize(a))),0==t&&(o=e>0?e-1:0,$(s.el+" .h").text(s.zeroize(o))),0==i&&0==t&&0==e)return void($.isFunction(s.callback)&&s.callback());setTimeout(function(){s.count()},1e3)},module.exports=e}),define("plugs/tipsAd",[],function(require,exports,module){var e=function(e){var t={isClose:"yes",type:"",title:"",subtit:"",text:"",btnType:"0",hasAd:"1",adImg:"image/ad.png",adLink:"school_invite_0.html"};this.option={};for(var n in t)this.option[n]=e[n]||t[n];this.id="pop_"+(new Date).getTime(),this.init()};e.prototype.init=function(e){var t=this,n=t.option,i=[];i.push('<div class="pop-mask km-dialog"></div>'),i.push('<div class="pop-screen km-dialog" id="'+t.id+'">'),i.push('<div class="box">'),"yes"==n.isClose&&i.push('<i class="iconfont icon-close"></i>'),i.push('<div class="hd-img '+n.type+'"></div>'),""!=n.title&&i.push("<h1>"+n.title+"</h1>"),""!=n.subtit&&i.push("<h3>"+n.subtit+"</h3>"),""!=n.text&&i.push('<div class="text">'+n.text+"</div>"),"1"==n.hasAd&&i.push('<div class="ad"><a href="'+n.adLink+'"><img src="'+n.adImg+'" /></a></div>'),"1"==n.btnType&&i.push('<div class="btnbox"><a class="close">我知道了</a></div>'),i.push("</div></div>"),$("body").append(i.join("")),$("#"+t.id).height($("#"+t.id+" .box").height()),$("#"+t.id+" .icon-close, #"+t.id+" .close").on("click",function(){t.close()})},e.prototype.close=function(){var e=$("#"+this.id);e.prev().remove(),e.remove()},module.exports=e}),define("plugs/secondPage",[],function(require,exports,module){var e=0,t=function(e){var t=this;t.targetPage=$(e),$(e+" .ui-icon-return").click(function(e){e.preventDefault(),t.closeSidebar()})};t.prototype={targetPage:void 0,openPage:function(t){var n=$(window),i=n.width(),a=n.height();this.targetPage.addClass("open").css({width:i,height:a}).show(),e++,$("body").hasClass("move")||$("body").addClass("move"),$("#sidebar-bg").show(),t&&t()},openSidebar:function(t){var n=$(window),i=n.width(),a=n.height(),o=this;this.targetPage.show().css({width:i,height:a}),setTimeout(function(){o.targetPage.addClass("open")},100),$("#sidebar-bg").show(),e++,$("body").hasClass("move")||$("body").addClass("move"),t&&t()},closeSidebar:function(t){var n=this;n.targetPage.removeClass("open"),e--,setTimeout(function(){n.targetPage.hide(),hasOpend=!1,e<=0&&$("body").removeClass("move"),t&&t()},220),$("#sidebar-bg").hide(),window.location.hash=""}},module.exports=t});