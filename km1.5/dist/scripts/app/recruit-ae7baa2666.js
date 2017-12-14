define("app/recruit",["../mod/base","../plugs/version.js","../plugs/cookieStorage.js","../plugs/confirmTip.js"],function(require,exports,module){var e=require("../mod/base");window.jQuery=window.Zepto;var t=require("../plugs/version.js");require("../plugs/cookieStorage.js");var n=require("../plugs/confirmTip.js");if($("body,#bg").height(innerHeight),t.less("1.5.0"))return void Tools.alertDialog({text:'<span style="font-size:16px;width:86%;display:inline-block;">更新至最新版，加入团队拿分红！</span><br><a href="http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser" class="ui-btn minbtn">马上赚钱</a>',time:"9999999999"});var i;i=/browser.kuaima.cn/.test(location.hostname)?"http://share.51xiaoli.cn/joinUs.html":"http://t.kuaima.cn/browser/joinUs.html";var o={channel:function(){var e="",n=t.userAgent;if(2==n.split("ssy=").length){var i=n.split("ssy=")[1];e=/iOS|Android/.test(i.split(";")[0])?i.split(";")[3]:i.split(";")[2]}return e}(),qr_base64:Storage.get("qr"),makeQrImg:function(e){var t=$("#canvasQR")[0],n=t.getContext("2d");n.fillStyle="#fff",n.fillRect(0,0,530,530),n.fill(),n.drawImage(e,30,30,470,470),$("#userQrTab").html('<img src="'+t.toDataURL("image/png")+'"/>'),n.clearRect(0,0,530,530)},make_qr:function(e){var n=this;if(i=i+"?code="+e,/Android/.test(t.userAgent)&&n.qr_base64&&n.qr_base64[0]==e){$("#userQrCode").append('<img src="'+n.qr_base64[1]+'"/>');var o=$("#userQrCode img")[0];n.makeQrImg(o)}else{var a=i+"&from=saoma";seajs.use("./scripts/lib/jquery.qrcode.min",function(){$("#userQrCode").qrcode({logo:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKAQMAAAC3/F3+AAAAA1BMVEUAAACnej3aAAAAAXRSTlMAQObYZgAAAApJREFUCNdjwAsAAB4AAdpxxYoAAAAASUVORK5CYII=",width:190,height:190,correctLevel:2,text:a})});var r=setInterval(function(){if($("#userQrCode img").length>0){clearInterval(r);var t=$("#userQrCode img")[0],i=[e,$("#userQrCode img").attr("src")];Storage.set("qr",i),n.makeQrImg(t)}},100)}$("#shareBtn3").on("click",function(){t.less("1.5.5")?window.location='kmb://share?param={"shareurl":"'+i+'","desc":"我在快马建立了小团，团队任务奖励翻倍，分红多多!"}':window.location='kmb://share?param={"shareurl":"'+i+'","title":"快马新玩法，奖励+分红，双重金币乐翻天","desc":"团队合作钱多多","icon":"http://static.etouch.cn/imgs/upload/1512982629.8319.png"}'})}};e.custom({url:"api/v1/teams/myTeam"},function(e){if(1e3==e.status){var t=e.data;$("#teamCode").text(t.invite_code),o.make_qr(t.web_share_code)}else{if(9916==e.status)return void Tools.alertDialog({title:"",text:'<span style="font-size:.16rem;">您暂时还没有团队，团队分红等你赚</span><br><a href="kmb://team_myself" class="ui-btn minbtn">快去组团</a>',time:"9999999999"});Tools.alertDialog({title:"提醒",text:e.desc,time:"0"})}}),$("#nav").on("click","li",function(){var e=$(this).data("id");if($(this).addClass("active").siblings().removeClass("active"),$("#"+e).show().siblings(".content").hide(),"gexing"==e&&2==$("#qrImgsWrap div").length){var t=$("#qrImgs").width();$("#qrImgs, #qrImgsWrap").height(736*t/528);new Swiper("#qrImgs",{pagination:".pagination",loop:!0,autoplay:5e3,paginationClickable:!0,onSlideChangeStart:function(){}})}}),$("#copyCode").on("click",function(){var e="组团赚零钱，奖励成倍拿！现在需要你！快来加入我的团队吧！点击下载：http://s.ssy.im/UdQBpp，团队邀请码："+$("#teamCode").text();window.location="kmb://QQ="+encodeURIComponent(e),new n({text:'<p style="color:#333;">赶快去呼朋唤友吧！</p>',sureTxt:"QQ拉人",cancelTxt:"微信拉人"},function(e){window.location=e?"mqqwpa://im/chat?chat_type=wpa&version=1":"weixin://"})})}),define("mod/base",["zepto","../plugs/doT.min","./tools"],function(require,exports,module){function e(e,t){var n=e,i={"M+":n.getMonth()+1,"d+":n.getDate(),"h+":n.getHours(),"m+":n.getMinutes(),"s+":n.getSeconds(),"q+":Math.floor((n.getMonth()+3)/3),S:n.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(n.getFullYear()+"").substr(4-RegExp.$1.length)));for(var o in i)new RegExp("("+o+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[o]:("00"+i[o]).substr((""+i[o]).length)));return t}function t(e){var t,n=function(){};if(!e.status)return void Tools.alertDialog({title:"出错了",text:"没有返回status"});if(/1001|1002|1003|1004|1009|1015/.test(e.status))t={title:"提醒",text:e.desc};else if(/1006/.test(e.status)){var i=5;t={title:"提醒",text:"访问太过频繁，<span id='closeTimer'>"+i+"</span>s后自动刷新"};var o=setInterval(function(){i--,i<1&&(clearInterval(o),window.location.reload()),$("#closeTimer").text(i)},1e3)}else{if(1101!=e.status)return t=null,!0;t={title:"提醒",text:"请打开设置->通用->日期与时间校准您的系统时间"}}return null!=t?(Tools.alertDialog(t,n),!1):void 0}var $=require("zepto");var n=require("../plugs/doT.min"),i={key:"26817749",magic_key:"24817749",km_api:server+"km_task/"};require("./tools"),module.exports={formatDate:function(t,n){var i=n||"yyyy-MM-dd hh:mm";if(isNaN(t)||null==t)return t;if("object"==typeof t){var o=dd.getFullYear(),a=dd.getMonth()+1,r=dd.getDate();a<10&&(a="0"+a);var s=o+"-"+a+"-"+r,l=s.match(/(\d+)/g),u=new Date(l[0],l[1]-1,l[2]);return e(u,i)}var u=new Date(parseInt(t));return e(u,i)},baseAjax:function(e,n){var o=navigator.userAgent,a=i.key;/magic/.test(o)&&(a=i.magic_key);var r={name:"app_key",value:a};e.showLoading&&(0==$(".ui-loading-block").length?$("body").append('<div class="ui-loading-block km-dialog show"><div class="ui-loading-cnt"><i class="ui-loading-bright"></i><p>加载中……</p></div></div>'):$(".ui-loading-block").addClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).hide()),e.data||(e.data={}),$.isFunction(e.data.push)?e.data.push(r):e.data.app_key=a,$.isFunction(e.data.push)?e.data.push({name:"auth_token",value:Tools.auth_token()}):e.data.auth_token=Tools.auth_token(),$.ajax({url:i.km_api+e.url,data:e.data,type:"GET",dataType:"jsonp",xhrFields:{withCredentials:!0},jsonpCallback:"jsonp"+Math.ceil(1e3*Math.random()),success:function(i){e.showLoading&&($(".ui-loading-block").removeClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).show()),t(i)&&n(i)},error:function(t,n,i){console.log(t),e.showLoading&&$(".ui-loading-block").removeClass("show"),"paging"!=e.logtype&&$(e.renderEle).show()}})},render:function(e,t,i,o,a){if($(t).length>0&&i){var r=o||void 0,s=$(t).text(),l=n.template(s,void 0,r);a?$(e).html(l(i)):$(e).append(l(i))}},custom:function(e,t){var n=this;e=e||{},e.logtype="custom",n.baseAjax(e,t)}}}),define("plugs/doT.min",[],function(require,exports,module){function e(t,n,i){return("string"==typeof n?n:n.toString()).replace(t.define||r,function(e,n,o,a){return 0===n.indexOf("def.")&&(n=n.substring(4)),n in i||(":"===o?(t.defineParams&&a.replace(t.defineParams,function(e,t,o){i[n]={arg:t,text:o}}),n in i||(i[n]=a)):new Function("def","def['"+n+"']="+a)(i)),""}).replace(t.use||r,function(n,o){t.useParams&&(o=o.replace(t.useParams,function(e,t,n,o){if(i[n]&&i[n].arg&&o)return e=(n+":"+o).replace(/'|\\/g,"_"),i.__exp=i.__exp||{},i.__exp[e]=i[n].text.replace(new RegExp("(^|[^\\w$])"+i[n].arg+"([^\\w$])","g"),"$1"+o+"$2"),t+"def.__exp['"+e+"']"}));var a=new Function("def","return "+o)(i);return a?e(t,a,i):a})}function t(e){return e.replace(/\\('|\\)/g,"$1").replace(/[\r\t\n]/g," ")}var n,i={version:"1.0.3",templateSettings:{evaluate:/\{\{([\s\S]+?(\}?)+)\}\}/g,interpolate:/\{\{=([\s\S]+?)\}\}/g,encode:/\{\{!([\s\S]+?)\}\}/g,use:/\{\{#([\s\S]+?)\}\}/g,useParams:/(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,define:/\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,defineParams:/^\s*([\w$]+):([\s\S]+)/,conditional:/\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,iterate:/\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,varname:"it",strip:!0,append:!0,selfcontained:!1,doNotSkipEncoded:!1},template:void 0,compile:void 0};i.encodeHTMLSource=function(e){var t={"&":"&#38;","<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","/":"&#47;"},n=e?/[&<>"'\/]/g:/&(?!#?\w+;)|<|>|"|'|\//g;return function(e){return e?e.toString().replace(n,function(e){return t[e]||e}):""}},n=function(){return this||(0,eval)("this")}(),void 0!==module&&module.exports?module.exports=i:"function"==typeof define&&define.amd?define(function(){return i}):n.doT=i;var o={start:"'+(",end:")+'",startencode:"'+encodeHTML("},a={start:"';out+=(",end:");out+='",startencode:"';out+=encodeHTML("},r=/$^/;i.template=function(s,l,u){l=l||i.templateSettings;var c,p,d=l.append?o:a,g=0;s=l.use||l.define?e(l,s,u||{}):s,s=("var out='"+(l.strip?s.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""):s).replace(/'|\\/g,"\\$&").replace(l.interpolate||r,function(e,n){return d.start+t(n)+d.end}).replace(l.encode||r,function(e,n){return c=!0,d.startencode+t(n)+d.end}).replace(l.conditional||r,function(e,n,i){return n?i?"';}else if("+t(i)+"){out+='":"';}else{out+='":i?"';if("+t(i)+"){out+='":"';}out+='"}).replace(l.iterate||r,function(e,n,i,o){return n?(g+=1,p=o||"i"+g,n=t(n),"';var arr"+g+"="+n+";if(arr"+g+"){var "+i+","+p+"=-1,l"+g+"=arr"+g+".length-1;while("+p+"<l"+g+"){"+i+"=arr"+g+"["+p+"+=1];out+='"):"';} } out+='"}).replace(l.evaluate||r,function(e,n){return"';"+t(n)+"out+='"})+"';return out;").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/\r/g,"\\r").replace(/(\s|;|\}|^|\{)out\+='';/g,"$1").replace(/\+''/g,""),c&&(l.selfcontained||!n||n._encodeHTML||(n._encodeHTML=i.encodeHTMLSource(l.doNotSkipEncoded)),s="var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("+i.encodeHTMLSource.toString()+"("+(l.doNotSkipEncoded||"")+"));"+s);try{return new Function(l.varname,s)}catch(e){throw"undefined"!=typeof console&&console.log("Could not create a template function: "+s),e}},i.compile=function(e,t){return i.template(e,null,t)},module.exports=i}),define("mod/tools",[],function(require){var e={getQueryValue:function(e){var t=location.search,n=new Array;if(t.length>1){var i=t.indexOf("?");t=t.substring(i+1,t.length)}else t=null;if(t)for(var o=0;o<t.split("&").length;o++)n[o]=t.split("&")[o];for(var a=0;a<n.length;a++)if(n[a].split("=")[0]==e)return decodeURI(n[a].split("=")[1]);return""},uid:function(){return this.getQueryValue("uid")||"null"},auth_token:function(){return this.getQueryValue("auth_token")||"null"},alertDialog:function(e,t){var n={title:null,text:null,img:null,time:3e3};for(var i in n)e[i]=e[i]||n[i];var o="tips"+(new Date).getTime(),a='<div id="'+o+'" class="ui-popup-screen km-dialog"><div class="ui-overlay-shadow km-popup">';e.time<1&&(a+='<i class="iconfont icon-close" id="close"></i>'),a+='<div class="content">',null!=e.title&&""!=e.title&&(a+="<h1>"+e.title+"</h1>"),null!=e.text&&""!=e.text&&(a+="<p>"+e.text+"</p>"),null!=e.img&&""!=e.img&&(a+='<div class="pic"><img src="'+e.img+'"/></div>'),a+="</div> </div> </div>";var r=$(a).appendTo("body"),s=$("#"+o+" .km-popup").height(),l=$(window).height(),u=(l-s)/2;if($("#"+o+" .km-popup").css("top",u),r.addClass("show-dialog"),$("#close").click(function(){$("#"+o).remove(),$.isFunction(t)&&t()}),e.time>0){var c=e.time;setTimeout(function(){$("#"+o).remove(),$.isFunction(t)&&t()},c)}}};window.Tools=e}),define("plugs/version",[],function(require,exports,module){var e,t={},n=navigator.userAgent;if(t.isKM=/KuaiMa/.test(n),t.isKM){var i=n.split("ssy=")[1];e=/iOS|Android/.test(i.split(";")[0])?i.split(";")[2]:i.split(";")[1],t.version=e.replace("V","")}t.userAgent=n,t.equal=function(e){return!!t.isKM&&e==this.version},t.greater=function(e){if(t.isKM){for(var n=this.version.split("."),i=e.split("."),o=!1,a=0;a<n.length&&!(n[a]<i[a]);a++)n[a]>i[a]&&(o=!0);return o}return!1},t.less=function(e){if(t.isKM){for(var n=this.version.split("."),i=e.split("."),o=!1,a=0;a<n.length&&!(n[a]>i[a]);a++)n[a]<i[a]&&(o=!0);return o}return!1},t.gEq=function(e){return!(!this.equal(e)&&!this.greater(e))},t.lEq=function(e){return!(!this.equal(e)&&!this.less(e))},module.exports=t}),define("plugs/cookieStorage",[],function(){var e={get:function(e){var t="(?:;)?"+e+"=([^;]*);?";if(!new RegExp(t).test(document.cookie))return null;try{return unescape(RegExp.$1)}catch(e){return null}},set:function(e,t,n){n=n||this.getExpDate(7,0,0),"number"==typeof n&&(n=this.getExpDate(n,0,0)),document.cookie=e+"="+escape(t)+(null==n?"":";expires="+n)+"; path=/"},remove:function(e){this.set(e,"",-1)},getExpDate:function(e,t,n){var i=new Date;if("number"==typeof e&&"number"==typeof t&&"number"==typeof t)return i.setDate(i.getDate()+parseInt(e)),i.setHours(i.getHours()+parseInt(t)),i.setMinutes(i.getMinutes()+parseInt(n)),i.toGMTString()}};window.Cookie=e;var t={AUTH:"KMAUTH",LNAME:"MY-LNAME",ACCOUNT:"MY-NAME",HEADIMG:"MY-HEADIMG",get:function(e,t){if(this.isLocalStorage()){var n=this.getStorage(t).getItem(e);return n?JSON.parse(n):void 0}},set:function(e,t,n){this.isLocalStorage()&&(t=JSON.stringify(t),this.getStorage(n).setItem(e,t))},remove:function(e,t){this.isLocalStorage()&&this.getStorage(t).removeItem(e)},getStorage:function(e){return e?sessionStorage:localStorage},isLocalStorage:function(){try{return!!window.localStorage||(console.log("不支持本地存储"),!1)}catch(e){return console.log("本地存储已关闭"),!1}}};window.Storage=t}),define("plugs/confirmTip",[],function(require,exports,module){var e=function(e,t){var n={title:"",text:"",sureTxt:"确定",cancelTxt:"取消"};this.option={};for(var i in n)this.option[i]=e[i]||n[i];this.id="pop_"+(new Date).getTime(),this.init(t)};e.prototype.init=function(e){var t=this,n=t.option,i=[],o=t.id;i.push('<div class="pop-mask km-dialog"></div>'),i.push('<div class="pop-screen km-dialog" id="'+o+'">'),i.push('<div class="box">'),""!=n.title&&i.push("<h2>"+n.title+"</h2>"),""!=n.text&&i.push('<div class="text">'+n.text+"</div>"),i.push('<div class="btnbox"><a class="cancelBtn">'+n.cancelTxt+'</a><a class="sureBtn">'+n.sureTxt+"</a></div>"),i.push("</div></div>"),$("body").append(i.join("")),$("#"+o).height($("#"+o+" .box").height()),$("#"+o+" .sureBtn").click(function(){$("#"+o).prev().remove(),$("#"+o).remove(),$.isFunction(e)&&e(!0)}),$("#"+o+" .cancelBtn").click(function(){$("#"+o).prev().remove(),$("#"+o).remove(),$.isFunction(e)&&e(!1)})},module.exports=e});