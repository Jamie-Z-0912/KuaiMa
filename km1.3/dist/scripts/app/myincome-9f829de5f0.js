define("app/myincome",["../mod/pagelist","../plugs/version","../plugs/storageCache.js","../plugs/confirmTip.js"],function(require,exports,module){var e=require("../mod/pagelist"),t=require("../plugs/version");if(t.less("1.4.4")){require("../plugs/storageCache.js");var n=require("../plugs/confirmTip.js");({expire:function(){var e=new Date,t=e.toLocaleDateString(),n=Math.ceil(e.getTime()/1e3),a=new Date(t+" 23:50:00").getTime()/1e3;return a-n>0?a-n:null},yes:function(){return!Storage.getCache("updateTips")&&(this.expire()&&Storage.setCache("updateTips",1,this.expire()),!0)}}).yes()&&new n({title:'<p style="padding: .1rem 0; line-height:1.8">请升级至1.4.4版本<br>8月30日起低版本将不能提现！</p>',sureTxt:"去升级",cancelTxt:"知道了"},function(e){e&&(window.location="http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser")})}$("#nav").on("click","li",function(){var e=$(this).data("id");$(this).addClass("active").siblings().removeClass("active"),$("#"+e).show().siblings(".main-list").hide()}),"cash"==Tools.getQueryValue("type")&&$('#nav li[data-id="rmbListWrap"]').click(),Ajax.custom({url:"api/v1/coin/info"},function(e){var t=e.data;$("#YUE").text(t.yue),$("#TINCOME").text(t.totalIncome),$("#YEXCHANGE").text(t.yesterdayExchangeRate),$("#YRMB").text(t.yesterdayIncome)}),e.fun({url:"api/v1/coin/list",renderFor:"#goldList-tmpl",renderEle:"#goldList",pagingDom:"#goldPage",data:{page:1,page_size:20}},function(e){5==e.page&&$("#goldPage").html('<div class="laypage_main"><span>仅可查看最近100条数据</span></div>')}),e.fun({url:"api/v1/income/list",renderFor:"#rmbList-tmpl",renderEle:"#rmbList",pagingDom:"#rmbPage",data:{page:1,page_size:20}},function(e){for(var t=0;t<e.data.length;t++)e.data[t].amount=e.data[t].amount<0?""+e.data[t].amount:"+"+e.data[t].amount;5==e.page&&$("#rmbPage").html('<div class="laypage_main"><span>仅可查看最近100条数据</span></div>')}),t.less("1.4.1")?$(".b-fixed").remove():$(".b-fixed").show(),$("#exchangeTip").on("click",function(){Tools.alertDialog({text:"金币转换汇率会受每日广告收益影响，上下会有浮动",time:5e3})}),$("#duiba").on("click",function(){var e=(new Date).getHours();alert(e),e<7?Tools.alertDialog({text:"为了保证您昨日金币正常结算<br>请上午6点后再来提现",time:"0"}):window.location="kmb://openduiba"}),$("#progress").on("click",function(){/browser.kuaima/.test(location.hostname)?window.location="http://browser.kuaima.cn/myMoneyProgress.html?auth_token="+Tools.auth_token():window.location="http://t.kuaima.cn/browser/myMoneyProgress.html?auth_token="+Tools.auth_token()})}),define("mod/pagelist",["./base","../plugs/laypage"],function(require,exports,module){var e=require("./base"),t=require("../plugs/laypage");window.Ajax=e,exports.defaultListTmpl="#conList-tmpl",exports.defaultListEle="#conList",exports.pagingDom="#listPage",exports.fun=function(n,a,i){var r=(n.data.page,{renderFor:this.defaultListTmpl,renderEle:this.defaultListEle,pagingDom:this.pagingDom,showLoading:!0,hasNext:!0,logtype:"paging"});for(var o in r)n[o]=n[o]||r[o];t({cont:$(n.pagingDom),pages:100,groups:0,curr:1,prev:!1,next:"点击查看更多",skin:"flow",jump:function(t){var r=this;n.data.page=t.curr,e.baseAjax(n,function(o){1020==o.status?(o.data=null,e.render(n.renderEle,n.renderFor,o,void 0,!0),$(n.pagingDom).remove()):(r.pages=o.total,t.curr==o.total&&(n.hasNext=!1,$(n.pagingDom).find(".laypage_main").html("<span>没有更多数据</span>")),$.each(o.data,function(){this.added_time=e.formatDate(this.added_time)}),a&&$.isFunction(a)&&a(o),1!=o.page?e.render(n.renderEle,n.renderFor,o,void 0,!1):e.render(n.renderEle,n.renderFor,o,void 0,!0),i&&$.isFunction(i)&&i(),$(n.pagingDom).removeClass("hide"))},function(e,t,n){"function"==typeof callbackError&&callbackError(e,t,n)})}}),window.onscroll=function(){if(n.hasNext){var e=document.body.scrollTop,t=document.body.scrollHeight;e+window.screen.height*window.devicePixelRatio+100>t&&$("#laypage_0 a").click()}}}}),define("mod/base",["zepto","../plugs/doT.min","./tools"],function(require,exports,module){function e(e,t){var n=e,a={"M+":n.getMonth()+1,"d+":n.getDate(),"h+":n.getHours(),"m+":n.getMinutes(),"s+":n.getSeconds(),"q+":Math.floor((n.getMonth()+3)/3),S:n.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(n.getFullYear()+"").substr(4-RegExp.$1.length)));for(var i in a)new RegExp("("+i+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?a[i]:("00"+a[i]).substr((""+a[i]).length)));return t}function t(e){var t,n=function(){};if(!e.status)return void Tools.alertDialog({title:"出错了",text:"没有返回status"});if(/1001|1002|1003|1004|1008|1009|1015/.test(e.status))t={title:"提醒",text:e.desc};else if(/1006/.test(e.status)){var a=5;t={title:"提醒",text:"访问太过频繁，<span id='closeTimer'>"+a+"</span>s后自动刷新"};var i=setInterval(function(){a--,a<1&&(clearInterval(i),window.location.reload()),$("#closeTimer").text(a)},1e3)}else{if(1101!=e.status)return t=null,!0;t={title:"提醒",text:"请打开设置->通用->日期与时间校准您的系统时间"}}return null!=t?(Tools.alertDialog(t,n),!1):void 0}var $=require("zepto");var n=require("../plugs/doT.min"),a={key:"26817749",magic_key:"24817749",km_api:server+"km_task/"};require("./tools"),module.exports={formatDate:function(t,n){var a=n||"yyyy-MM-dd hh:mm";if(isNaN(t)||null==t)return t;if("object"==typeof t){var i=dd.getFullYear(),r=dd.getMonth()+1,o=dd.getDate();r<10&&(r="0"+r);var s=i+"-"+r+"-"+o,l=s.match(/(\d+)/g),u=new Date(l[0],l[1]-1,l[2]);return e(u,a)}var u=new Date(parseInt(t));return e(u,a)},baseAjax:function(e,n){var i=navigator.userAgent,r=a.key;/magic/.test(i)&&(r=a.magic_key);var o={name:"app_key",value:r};e.showLoading&&(0==$(".ui-loading-block").length?$("body").append('<div class="ui-loading-block km-dialog show"><div class="ui-loading-cnt"><i class="ui-loading-bright"></i><p>加载中……</p></div></div>'):$(".ui-loading-block").addClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).hide()),e.data||(e.data={}),$.isFunction(e.data.push)?e.data.push(o):e.data.app_key=r,$.isFunction(e.data.push)?e.data.push({name:"auth_token",value:Tools.auth_token()}):e.data.auth_token=Tools.auth_token(),$.ajax({url:a.km_api+e.url,data:e.data,type:"GET",dataType:"jsonp",xhrFields:{withCredentials:!0},jsonpCallback:"jsonp"+Math.ceil(1e3*Math.random()),success:function(a){e.showLoading&&($(".ui-loading-block").removeClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).show()),t(a)&&n(a)},error:function(t,n,a){console.log(t),e.showLoading&&$(".ui-loading-block").removeClass("show"),"paging"!=e.logtype&&$(e.renderEle).show()}})},render:function(e,t,a,i,r){if($(t).length>0&&a){var o=i||void 0,s=$(t).text(),l=n.template(s,void 0,o);r?$(e).html(l(a)):$(e).append(l(a))}},custom:function(e,t){var n=this;e=e||{},e.logtype="custom",n.baseAjax(e,t)}}}),define("plugs/doT.min",[],function(require,exports,module){function e(t,n,a){return("string"==typeof n?n:n.toString()).replace(t.define||o,function(e,n,i,r){return 0===n.indexOf("def.")&&(n=n.substring(4)),n in a||(":"===i?(t.defineParams&&r.replace(t.defineParams,function(e,t,i){a[n]={arg:t,text:i}}),n in a||(a[n]=r)):new Function("def","def['"+n+"']="+r)(a)),""}).replace(t.use||o,function(n,i){t.useParams&&(i=i.replace(t.useParams,function(e,t,n,i){if(a[n]&&a[n].arg&&i)return e=(n+":"+i).replace(/'|\\/g,"_"),a.__exp=a.__exp||{},a.__exp[e]=a[n].text.replace(new RegExp("(^|[^\\w$])"+a[n].arg+"([^\\w$])","g"),"$1"+i+"$2"),t+"def.__exp['"+e+"']"}));var r=new Function("def","return "+i)(a);return r?e(t,r,a):r})}function t(e){return e.replace(/\\('|\\)/g,"$1").replace(/[\r\t\n]/g," ")}var n,a={version:"1.0.3",templateSettings:{evaluate:/\{\{([\s\S]+?(\}?)+)\}\}/g,interpolate:/\{\{=([\s\S]+?)\}\}/g,encode:/\{\{!([\s\S]+?)\}\}/g,use:/\{\{#([\s\S]+?)\}\}/g,useParams:/(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,define:/\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,defineParams:/^\s*([\w$]+):([\s\S]+)/,conditional:/\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,iterate:/\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,varname:"it",strip:!0,append:!0,selfcontained:!1,doNotSkipEncoded:!1},template:void 0,compile:void 0};a.encodeHTMLSource=function(e){var t={"&":"&#38;","<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","/":"&#47;"},n=e?/[&<>"'\/]/g:/&(?!#?\w+;)|<|>|"|'|\//g;return function(e){return e?e.toString().replace(n,function(e){return t[e]||e}):""}},n=function(){return this||(0,eval)("this")}(),void 0!==module&&module.exports?module.exports=a:"function"==typeof define&&define.amd?define(function(){return a}):n.doT=a;var i={start:"'+(",end:")+'",startencode:"'+encodeHTML("},r={start:"';out+=(",end:");out+='",startencode:"';out+=encodeHTML("},o=/$^/;a.template=function(s,l,u){l=l||a.templateSettings;var c,p,g=l.append?i:r,d=0;s=l.use||l.define?e(l,s,u||{}):s,s=("var out='"+(l.strip?s.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""):s).replace(/'|\\/g,"\\$&").replace(l.interpolate||o,function(e,n){return g.start+t(n)+g.end}).replace(l.encode||o,function(e,n){return c=!0,g.startencode+t(n)+g.end}).replace(l.conditional||o,function(e,n,a){return n?a?"';}else if("+t(a)+"){out+='":"';}else{out+='":a?"';if("+t(a)+"){out+='":"';}out+='"}).replace(l.iterate||o,function(e,n,a,i){return n?(d+=1,p=i||"i"+d,n=t(n),"';var arr"+d+"="+n+";if(arr"+d+"){var "+a+","+p+"=-1,l"+d+"=arr"+d+".length-1;while("+p+"<l"+d+"){"+a+"=arr"+d+"["+p+"+=1];out+='"):"';} } out+='"}).replace(l.evaluate||o,function(e,n){return"';"+t(n)+"out+='"})+"';return out;").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/\r/g,"\\r").replace(/(\s|;|\}|^|\{)out\+='';/g,"$1").replace(/\+''/g,""),c&&(l.selfcontained||!n||n._encodeHTML||(n._encodeHTML=a.encodeHTMLSource(l.doNotSkipEncoded)),s="var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("+a.encodeHTMLSource.toString()+"("+(l.doNotSkipEncoded||"")+"));"+s);try{return new Function(l.varname,s)}catch(e){throw"undefined"!=typeof console&&console.log("Could not create a template function: "+s),e}},a.compile=function(e,t){return a.template(e,null,t)},module.exports=a}),define("mod/tools",[],function(require){var e={getQueryValue:function(e){var t=location.search,n=new Array;if(t.length>1){var a=t.indexOf("?");t=t.substring(a+1,t.length)}else t=null;if(t)for(var i=0;i<t.split("&").length;i++)n[i]=t.split("&")[i];for(var r=0;r<n.length;r++)if(n[r].split("=")[0]==e)return decodeURI(n[r].split("=")[1]);return""},uid:function(){return this.getQueryValue("uid")||"null"},auth_token:function(){return this.getQueryValue("auth_token")||"null"},alertDialog:function(e,t){var n={title:null,text:null,img:null,time:3e3};for(var a in n)e[a]=e[a]||n[a];var i="tips"+(new Date).getTime(),r='<div id="'+i+'" class="ui-popup-screen km-dialog"><div class="ui-overlay-shadow km-popup">';e.time<1&&(r+='<i class="iconfont icon-close" id="close"></i>'),r+='<div class="content">',null!=e.title&&""!=e.title&&(r+="<h1>"+e.title+"</h1>"),null!=e.text&&""!=e.text&&(r+="<p>"+e.text+"</p>"),null!=e.img&&""!=e.img&&(r+='<div class="pic"><img src="'+e.img+'"/></div>'),r+="</div> </div> </div>";var o=$(r).appendTo("body"),s=$("#"+i+" .km-popup").height(),l=$(window).height(),u=(l-s)/2;if($("#"+i+" .km-popup").css("top",u),o.addClass("show-dialog"),$("#close").click(function(){$("#"+i).remove(),$.isFunction(t)&&t()}),e.time>0){var c=e.time;setTimeout(function(){$("#"+i).remove(),$.isFunction(t)&&t()},c)}}};window.Tools=e}),function(){"use strict";function e(a){var i="laypagecss";e.dir="dir"in e?e.dir:r.getpath+"../css/skin/laypage.css",new r(a),e.dir&&!t[n](i)&&r.use(e.dir,i)}e.v="1.3";var t=document,n="getElementById",a="getElementsByTagName",i=0,r=function(e){var t=this;(t.config=e||{}).item=i++,t.render(!0)};r.on=function(e,t,n){return e.attachEvent?e.attachEvent("on"+t,function(){n.call(e,window.even)}):e.addEventListener(t,n,!1),r},r.getpath=function(){var e=document.scripts,t=e[e.length-1].src;return t.substring(0,t.lastIndexOf("/")+1)}(),r.use=function(e,t){},r.prototype.type=function(){var e=this.config;return"object"==typeof e.cont?void 0===e.cont.length?2:3:void 0},r.prototype.view=function(){var t=this,n=t.config,a=[],i={};if(n.pages=0|n.pages,n.curr=0|n.curr||1,n.groups="groups"in n?0|n.groups:5,n.first="first"in n?n.first:"&#x9996;&#x9875;",n.last="last"in n?n.last:"&#x5C3E;&#x9875;",n.prev="prev"in n?n.prev:"&#x4E0A;&#x4E00;&#x9875;",n.next="next"in n?n.next:"&#x4E0B;&#x4E00;&#x9875;",n.pages<=1)return"";for(n.groups>n.pages&&(n.groups=n.pages),i.index=Math.ceil((n.curr+(n.groups>1&&n.groups!==n.pages?1:0))/(0===n.groups?1:n.groups)),n.curr>1&&n.prev&&a.push('<a href="javascript:;" class="laypage_prev" data-page="'+(n.curr-1)+'">'+n.prev+"</a>"),i.index>1&&n.first&&0!==n.groups&&a.push('<a href="javascript:;" class="laypage_first" data-page="1"  title="&#x9996;&#x9875;">'+n.first+"</a><span>&#x2026;</span>"),i.poor=Math.floor((n.groups-1)/2),i.start=i.index>1?n.curr-i.poor:1,i.end=i.index>1?function(){var e=n.curr+(n.groups-i.poor-1);return e>n.pages?n.pages:e}():n.groups,i.end-i.start<n.groups-1&&(i.start=i.end-n.groups+1);i.start<=i.end;i.start++)i.start===n.curr?a.push('<span class="laypage_curr" '+(/^#/.test(n.skin)?'style="background-color:'+n.skin+'"':"")+">"+i.start+"</span>"):a.push('<a href="javascript:;" data-page="'+i.start+'">'+i.start+"</a>");return n.pages>n.groups&&i.end<n.pages&&n.last&&0!==n.groups&&a.push('<span>&#x2026;</span><a href="javascript:;" class="laypage_last" title="&#x5C3E;&#x9875;"  data-page="'+n.pages+'">'+n.last+"</a>"),i.flow=!n.prev&&0===n.groups,(n.curr!==n.pages&&n.next||i.flow)&&a.push(function(){return i.flow&&n.curr===n.pages?'<span class="page_nomore" title="&#x5DF2;&#x6CA1;&#x6709;&#x66F4;&#x591A;">'+n.next+"</span>":'<a href="javascript:;" class="laypage_next" data-page="'+(n.curr+1)+'">'+n.next+"</a>"}()),'<div name="laypage'+e.v+'" class="laypage_main laypageskin_'+(n.skin?function(e){return/^#/.test(e)?"molv":e}(n.skin):"default")+'" id="laypage_'+t.config.item+'">'+a.join("")+function(){return n.skip?'<span class="laypage_total"><label>&#x5230;&#x7B2C;</label><input type="number" min="1" onkeyup="this.value=this.value.replace(/\\D/, \'\');" class="laypage_skip"><label>&#x9875;</label><button type="button" class="laypage_btn">&#x786e;&#x5b9a;</button></span>':""}()+"</div>"},r.prototype.jump=function(e){if(e){for(var t=this,n=t.config,i=e.children,o=e[a]("button")[0],s=e[a]("input")[0],l=0,u=i.length;u>l;l++)"a"===i[l].nodeName.toLowerCase()&&r.on(i[l],"click",function(){var e=0|this.getAttribute("data-page");n.curr=e,t.render()});o&&r.on(o,"click",function(){var e=0|s.value.replace(/\s|\D/g,"");e&&e<=n.pages&&(n.curr=e,t.render())})}},r.prototype.render=function(e){var a=this,i=a.config,r=a.type(),o=a.view();2===r?i.cont.innerHTML=o:3===r?i.cont.html(o):t[n](i.cont).innerHTML=o,i.jump&&i.jump(i,e),a.jump(t[n]("laypage_"+i.item)),i.hash&&!e&&(location.hash="!"+i.hash+"="+i.curr)},"function"==typeof define?define("plugs/laypage",[],function(){return e}):"undefined"!=typeof exports?module.exports=e:window.laypage=e}(),define("plugs/version",[],function(require,exports,module){var e,t={},n=navigator.userAgent;if(t.isKM=/KuaiMa/.test(n),t.isKM){var a=n.split("ssy=")[1];e=/iOS|Android/.test(a.split(";")[0])?a.split(";")[2]:a.split(";")[1],t.version=e.replace("V","")}t.userAgent=n,t.equal=function(e){return!!t.isKM&&e==this.version},t.greater=function(e){if(t.isKM){for(var n=this.version.split("."),a=e.split("."),i=!1,r=0;r<n.length&&!(n[r]<a[r]);r++)n[r]>a[r]&&(i=!0);return i}return!1},t.less=function(e){if(t.isKM){for(var n=this.version.split("."),a=e.split("."),i=!1,r=0;r<n.length&&!(n[r]>a[r]);r++)n[r]<a[r]&&(i=!0);return i}return!1},t.gEq=function(e){return!(!this.equal(e)&&!this.greater(e))},t.lEq=function(e){return!(!this.equal(e)&&!this.less(e))},module.exports=t}),define("plugs/storageCache",[],function(){function e(e,t){var n=(new Date).getTime();this.c=n,t=t||i,this.e=n+1e3*t,this.v=e}function t(e){return"object"==typeof e&&!!(e&&"c"in e&&"e"in e&&"v"in e)}function n(e){return(new Date).getTime()<e.e}var a=new Date("Fri, 31 Dec 9999 23:59:59 UTC"),i=a.getTime(),r={serialize:function(e){return JSON.stringify(e)},deserialize:function(e){return e&&JSON.parse(e)}},o={AUTH:"KMAUTH",NAME:"MY-NAME",get:function(e,t){if(this.isLocalStorage()){var n=this.getStorage(t).getItem(e);return n?JSON.parse(n):void 0}},set:function(e,t,n){this.isLocalStorage()&&(t=JSON.stringify(t),this.getStorage(n).setItem(e,t))},remove:function(e,t){this.isLocalStorage()&&this.getStorage(t).removeItem(e)},setCache:function(t,n,a,i){if(this.isLocalStorage()){var o=new e(n,a);this.getStorage(i).setItem(t,r.serialize(o))}},getCache:function(e,a){var i=null;try{var o=this.getStorage(a).getItem(e);i=r.deserialize(o)}catch(e){return null}if(t(i)){if(n(i)){var o=i.v;return o}return this.remove(e),null}return null},getStorage:function(e){return e?sessionStorage:localStorage},isLocalStorage:function(){try{return!!window.localStorage||(console.log("不支持本地存储"),!1)}catch(e){return console.log("本地存储已关闭"),!1}}};window.Storage=o}),define("plugs/confirmTip",[],function(require,exports,module){var e=function(e,t){var n={title:"",text:"",sureTxt:"确定",cancelTxt:"取消"};this.option={};for(var a in n)this.option[a]=e[a]||n[a];this.id="pop_"+(new Date).getTime(),this.init(t)};e.prototype.init=function(e){var t=this,n=t.option,a=[],i=t.id;a.push('<div class="pop-mask km-dialog"></div>'),a.push('<div class="pop-screen km-dialog" id="'+i+'">'),a.push('<div class="box">'),""!=n.title&&a.push("<h2>"+n.title+"</h2>"),""!=n.text&&a.push('<div class="text">'+n.text+"</div>"),a.push('<div class="btnbox"><a class="cancelBtn">'+n.cancelTxt+'</a><a class="sureBtn">'+n.sureTxt+"</a></div>"),a.push("</div></div>"),$("body").append(a.join("")),$("#"+i).height($("#"+i+" .box").height()),$("#"+i+" .sureBtn").click(function(){$("#"+i).prev().remove(),$("#"+i).remove(),$.isFunction(e)&&e(!0)}),$("#"+i+" .cancelBtn").click(function(){$("#"+i).prev().remove(),$("#"+i).remove(),$.isFunction(e)&&e(!1)})},module.exports=e});