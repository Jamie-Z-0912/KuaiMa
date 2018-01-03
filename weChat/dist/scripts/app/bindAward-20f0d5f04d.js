define("app/bindAward",["../mod/base","../plugs/popups.js"],function(require,exports,module){var t=require("../mod/base"),e=require("../plugs/popups.js");t.custom({url:"api/v1/business/wx_mp/bind_reward/status"},function(t){if(1e3==t.status){var e=t.data;e.received?($("#status,#bind").remove(),$("#km_wechat").show(),$("#msg").html("<p>您的微信号与"+e.phone+"绑定成功</p><p>已收入"+e.coin+"金币到快马小报账户了</p>"),$("#msg").parent().show()):($("#msg").html("<p>您的微信号与"+e.phone+"绑定成功</p><p>送您"+e.coin+"金币奖励！</p>"),$("#bind").html('<a class="get200" href="javascript:void(0)">立即领取</a>'),$("#msg").parent().show())}else Tools.alertDialog({text:t.desc})}),$("#bind").on("click",".get200",function(){t.custom({url:"api/v1/business/wx_mp/bind_reward/receive"},function(t){1e3==t.status?new e({title:"成功领取200金币",img:"../image/ok.png",sureTxt:"去快马小报查看"},function(t){t&&(window.location="http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser")}):Tools.alertDialog({text:t.desc})})})}),define("mod/base",["zepto","./tools","./storageCache"],function(require,exports,module){function t(t,e){var i=t,o={"M+":i.getMonth()+1,"d+":i.getDate(),"h+":i.getHours(),"m+":i.getMinutes(),"s+":i.getSeconds(),"q+":Math.floor((i.getMonth()+3)/3),S:i.getMilliseconds()};/(y+)/.test(e)&&(e=e.replace(RegExp.$1,(i.getFullYear()+"").substr(4-RegExp.$1.length)));for(var a in o)new RegExp("("+a+")").test(e)&&(e=e.replace(RegExp.$1,1==RegExp.$1.length?o[a]:("00"+o[a]).substr((""+o[a]).length)));return e}function e(){var t=window.location.pathname.split(".html")[0],e=t.split("/");$.ajax({url:o.km_api+"api/v1/wx/mp/oauth2/build_authorize_url",data:{app_key:o.key,auth_token:"",state:e[e.length-1]},type:"GET",dataType:"jsonp",xhrFields:{withCredentials:!0},jsonpCallback:"jsonp"+Math.ceil(1e3*Math.random()),success:function(t){window.location=t.data.url}})}function i(t){var i,o=function(){};if(!t.status)return void Tools.alertDialog({title:"出错了",text:"没有返回status"});if(/1001|1002|1003|1009|1101|1015/.test(t.status))i={title:"提醒",text:t.desc};else{if(!/1006/.test(t.status))return/1004|1013|10005/.test(t.status)?(e(),!1):(i=null,!0);var a=5;i={title:"提醒",text:"访问太过频繁，<span id='closeTimer'>"+a+"</span>s后自动刷新"};var n=setInterval(function(){a--,a<1&&(clearInterval(n),window.location.reload()),$("#closeTimer").text(a)},1e3)}return null!=i?(Tools.alertDialog(i,o),!1):void 0}var $=require("zepto");require("./tools"),require("./storageCache");var o={key:"29817749",km_api:server+"km_task/"};module.exports={formatDate:function(e,i){var o=i||"yyyy-MM-dd hh:mm";if(isNaN(e)||null==e)return e;if("object"==typeof e){var a=dd.getFullYear(),n=dd.getMonth()+1,s=dd.getDate();n<10&&(n="0"+n);var r=a+"-"+n+"-"+s,l=r.match(/(\d+)/g),c=new Date(l[0],l[1]-1,l[2]);return t(c,o)}var c=new Date(parseInt(e));return t(c,o)},baseAjax:function(t,e){var a=(navigator.userAgent,o.key),n=Storage.getCache(Storage.AUTH)||Tools.getQueryValue("auth_token"),s={name:"app_key",value:a};t.showLoading&&(0==$(".ui-loading-block").length?$("body").append('<div class="ui-loading-block km-dialog show"><div class="ui-loading-cnt"><i class="ui-loading-bright"></i><p>加载中……</p></div></div>'):$(".ui-loading-block").addClass("show")),t.data||(t.data={}),$.isFunction(t.data.push)?t.data.push(s):t.data.app_key=a,$.isFunction(t.data.push)?t.data.push({name:"auth_token",value:n}):t.data.auth_token=n,$.ajax({url:o.km_api+t.url,data:t.data,type:"GET",dataType:"jsonp",xhrFields:{withCredentials:!0},jsonpCallback:"jsonp"+Math.ceil(1e3*Math.random()),success:function(o){t.showLoading&&$(".ui-loading-block").removeClass("show"),i(o)&&e(o)},error:function(e,i,o){console.log(e),t.showLoading&&$(".ui-loading-block").removeClass("show")}})},custom:function(t,e){var i=this;t=t||{},i.baseAjax(t,e)}}}),define("mod/tools",[],function(require){var t={getQueryValue:function(t){var e=location.search,i=new Array;if(e.length>1){var o=e.indexOf("?");e=e.substring(o+1,e.length)}else e=null;if(e)for(var a=0;a<e.split("&").length;a++)i[a]=e.split("&")[a];for(var n=0;n<i.length;n++)if(i[n].split("=")[0]==t)return decodeURI(i[n].split("=")[1]);return""},auth_token:function(){return t.getQueryValue("auth_token")},alertDialog:function(t,e){var i={title:null,text:null,img:null,time:3e3};for(var o in i)t[o]=t[o]||i[o];var a="tips"+(new Date).getTime(),n='<div id="'+a+'" class="ui-popup-screen km-dialog"><div class="ui-overlay-shadow km-popup">';t.time<1&&(n+='<i class="iconfont icon-close" id="close"></i>'),n+='<div class="content">',null!=t.title&&""!=t.title&&(n+="<h1>"+t.title+"</h1>"),null!=t.text&&""!=t.text&&(n+="<p>"+t.text+"</p>"),null!=t.img&&""!=t.img&&(n+='<div class="pic"><img src="'+t.img+'"/></div>'),n+="</div> </div> </div>";var s=$(n).appendTo("body"),r=$("#"+a+" .km-popup").height(),l=$(window).height(),c=(l-r)/2;if($("#"+a+" .km-popup").css("top",c),s.addClass("show-dialog"),$("#close").click(function(){$("#"+a).remove(),$.isFunction(e)&&e()}),t.time>0){var u=t.time;setTimeout(function(){$("#"+a).remove(),$.isFunction(e)&&e()},u)}}};window.Tools=t}),define("mod/storageCache",[],function(){function t(t,e){var i=(new Date).getTime();this.c=i,e=e||a,this.e=i+1e3*e,this.v=t}function e(t){return"object"==typeof t&&!!(t&&"c"in t&&"e"in t&&"v"in t)}function i(t){return(new Date).getTime()<t.e}var o=new Date("Fri, 31 Dec 9999 23:59:59 UTC"),a=o.getTime(),n={serialize:function(t){return JSON.stringify(t)},deserialize:function(t){return t&&JSON.parse(t)}},s={AUTH:"KMAUTH",get:function(t,e){if(this.isLocalStorage()){var i=this.getStorage(e).getItem(t);return i?JSON.parse(i):void 0}},set:function(t,e,i){this.isLocalStorage()&&(e=JSON.stringify(e),this.getStorage(i).setItem(t,e))},remove:function(t,e){this.isLocalStorage()&&this.getStorage(e).removeItem(t)},setCache:function(e,i,o,a){if(this.isLocalStorage()){var s=new t(i,o);this.getStorage(a).setItem(e,n.serialize(s))}},getCache:function(t,o){var a=null;try{var s=this.getStorage(o).getItem(t);a=n.deserialize(s)}catch(t){return null}if(e(a)){if(i(a)){var s=a.v;return s}return this.remove(t),null}return null},getStorage:function(t){return t?sessionStorage:localStorage},isLocalStorage:function(){try{return!!window.localStorage||(console.log("不支持本地存储"),!1)}catch(t){return console.log("本地存储已关闭"),!1}}};window.Storage=s}),define("plugs/popups",[],function(require,exports,module){var t=function(t,e){var i={isClose:"",className:"",title:"",topTxt:"",img:"",botTxt:"",sureTxt:"",cancelTxt:""};this.option={};for(var o in i)this.option[o]=t[o]||i[o];this.id="pop_"+(new Date).getTime(),this.init(e)};t.prototype.init=function(t){var e=this,i=e.option,o=[];o.push('<div class="pop-screen km-dialog" id="'+e.id+'">'),o.push('<div class="pop-content '+i.className+'">'),"yes"==i.isClose&&o.push('<div class="pop-close">x</div>'),""!=i.title&&o.push('<div class="title">'+i.title+"</div>"),""!=i.topTxt&&o.push('<div class="top_txt">'+i.topTxt+"</div>"),""!=i.img&&o.push('<div class="pop-imgbox"><img src="'+i.img+'" /></div>'),""!=i.botTxt&&o.push('<div class="bot_txt">'+i.botTxt+"</div>"),o.push('<div class="pop-btn">'),""!=i.sureTxt&&o.push('<a class="yes">'+i.sureTxt+"</a>"),""!=i.cancelTxt&&o.push('<a class="no">'+i.cancelTxt+"</a>"),o.push("</div></div></div>"),$("body").append(o.join(""));var a="#"+e.id,n=$(a+" .pop-content");n.css("margin-top",parseInt((innerHeight-n.height())/3)),$(a+" .pop-close").on("click",function(){e.close()}),$(a+" .yes").click(function(){$(a).remove(),$.isFunction(t)&&t(!0)}),$(a+" .no").click(function(){$(a).remove(),$.isFunction(t)&&t(!1)})},t.prototype.close=function(){$("#"+this.id).remove()},module.exports=t});