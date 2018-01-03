define("app/sign",["../mod/base","../plugs/popups.js"],function(require,exports,module){var t=require("../mod/base"),e=require("../plugs/popups.js");t.custom({url:"api/v1/business/wx_mp/daily_sign/status"},function(t){if(1e3==t.status){var e=t.data,i=$("#days li"),s=e.sign_num>6?6:e.sign_num;if(s>0){for(var a=0;a<s;a++)i.eq(a).addClass("has_get");e.today||i.eq(s).addClass("cur")}else e.today?i.eq(0).addClass("has_get"):i.eq(0).addClass("cur");e.today&&$("#signBtn").addClass("hasget").text("今日已签");for(var a=0;a<e.rules.length;a++)i.eq(a).find(".num").text(e.rules[a]+"个");var n;n=e.sign_num>2?"恭喜您，已连续签到"+e.sign_num+"天，":"已经连续签到"+e.sign_num+"天，",e.today?n+="明天可领取"+e.rules[s]+"个宝箱":n+="今天可领取"+e.rules[s]+"个宝箱",$("#tips").text(n)}else Tools.alertDialog({text:t.desc})}),$("#signBtn").on("click",function(){var i=$(this);i.hasClass("hasget")||t.custom({url:"api/v1/business/wx_mp/daily_sign/sign"},function(t){if(1e3==t.status){i.addClass("hasget").text("今日已签");var s=t.data;new e({className:"sign_pop",topTxt:'<div class="box_n"><span>'+s.box_num+"个</span></div>",title:'<img src="../image/sign/sign_a_t.png"/>',img:"../image/sign/sign_box.png",botTxt:"你已连续签到"+s.sign_num+"天，明日签到可获得"+s.next_box_num+"个宝箱哦~"}),$("#days li.cur").addClass("has_get").removeClass("cur")}else Tools.alertDialog({text:t.desc})})})}),define("mod/base",["zepto","./tools","./storageCache"],function(require,exports,module){function t(t,e){var i=t,s={"M+":i.getMonth()+1,"d+":i.getDate(),"h+":i.getHours(),"m+":i.getMinutes(),"s+":i.getSeconds(),"q+":Math.floor((i.getMonth()+3)/3),S:i.getMilliseconds()};/(y+)/.test(e)&&(e=e.replace(RegExp.$1,(i.getFullYear()+"").substr(4-RegExp.$1.length)));for(var a in s)new RegExp("("+a+")").test(e)&&(e=e.replace(RegExp.$1,1==RegExp.$1.length?s[a]:("00"+s[a]).substr((""+s[a]).length)));return e}function e(){var t=window.location.pathname.split(".html")[0],e=t.split("/");$.ajax({url:s.km_api+"api/v1/wx/mp/oauth2/build_authorize_url",data:{app_key:s.key,auth_token:"",state:e[e.length-1]},type:"GET",dataType:"jsonp",xhrFields:{withCredentials:!0},jsonpCallback:"jsonp"+Math.ceil(1e3*Math.random()),success:function(t){window.location=t.data.url}})}function i(t){var i,s=function(){};if(!t.status)return void Tools.alertDialog({title:"出错了",text:"没有返回status"});if(/1001|1002|1003|1009|1101|1015/.test(t.status))i={title:"提醒",text:t.desc};else{if(!/1006/.test(t.status))return/1004|1013|10005/.test(t.status)?(e(),!1):(i=null,!0);var a=5;i={title:"提醒",text:"访问太过频繁，<span id='closeTimer'>"+a+"</span>s后自动刷新"};var n=setInterval(function(){a--,a<1&&(clearInterval(n),window.location.reload()),$("#closeTimer").text(a)},1e3)}return null!=i?(Tools.alertDialog(i,s),!1):void 0}var $=require("zepto");require("./tools"),require("./storageCache");var s={key:"29817749",km_api:server+"km_task/"};module.exports={formatDate:function(e,i){var s=i||"yyyy-MM-dd hh:mm";if(isNaN(e)||null==e)return e;if("object"==typeof e){var a=dd.getFullYear(),n=dd.getMonth()+1,o=dd.getDate();n<10&&(n="0"+n);var l=a+"-"+n+"-"+o,r=l.match(/(\d+)/g),u=new Date(r[0],r[1]-1,r[2]);return t(u,s)}var u=new Date(parseInt(e));return t(u,s)},baseAjax:function(t,e){var a=(navigator.userAgent,s.key),n=Storage.getCache(Storage.AUTH)||Tools.getQueryValue("auth_token"),o={name:"app_key",value:a};t.showLoading&&(0==$(".ui-loading-block").length?$("body").append('<div class="ui-loading-block km-dialog show"><div class="ui-loading-cnt"><i class="ui-loading-bright"></i><p>加载中……</p></div></div>'):$(".ui-loading-block").addClass("show")),t.data||(t.data={}),$.isFunction(t.data.push)?t.data.push(o):t.data.app_key=a,$.isFunction(t.data.push)?t.data.push({name:"auth_token",value:n}):t.data.auth_token=n,$.ajax({url:s.km_api+t.url,data:t.data,type:"GET",dataType:"jsonp",xhrFields:{withCredentials:!0},jsonpCallback:"jsonp"+Math.ceil(1e3*Math.random()),success:function(s){t.showLoading&&$(".ui-loading-block").removeClass("show"),i(s)&&e(s)},error:function(e,i,s){console.log(e),t.showLoading&&$(".ui-loading-block").removeClass("show")}})},custom:function(t,e){var i=this;t=t||{},i.baseAjax(t,e)}}}),define("mod/tools",[],function(require){var t={getQueryValue:function(t){var e=location.search,i=new Array;if(e.length>1){var s=e.indexOf("?");e=e.substring(s+1,e.length)}else e=null;if(e)for(var a=0;a<e.split("&").length;a++)i[a]=e.split("&")[a];for(var n=0;n<i.length;n++)if(i[n].split("=")[0]==t)return decodeURI(i[n].split("=")[1]);return""},auth_token:function(){return t.getQueryValue("auth_token")},alertDialog:function(t,e){var i={title:null,text:null,img:null,time:3e3};for(var s in i)t[s]=t[s]||i[s];var a="tips"+(new Date).getTime(),n='<div id="'+a+'" class="ui-popup-screen km-dialog"><div class="ui-overlay-shadow km-popup">';t.time<1&&(n+='<i class="iconfont icon-close" id="close"></i>'),n+='<div class="content">',null!=t.title&&""!=t.title&&(n+="<h1>"+t.title+"</h1>"),null!=t.text&&""!=t.text&&(n+="<p>"+t.text+"</p>"),null!=t.img&&""!=t.img&&(n+='<div class="pic"><img src="'+t.img+'"/></div>'),n+="</div> </div> </div>";var o=$(n).appendTo("body"),l=$("#"+a+" .km-popup").height(),r=$(window).height(),u=(r-l)/2;if($("#"+a+" .km-popup").css("top",u),o.addClass("show-dialog"),$("#close").click(function(){$("#"+a).remove(),$.isFunction(e)&&e()}),t.time>0){var c=t.time;setTimeout(function(){$("#"+a).remove(),$.isFunction(e)&&e()},c)}}};window.Tools=t}),define("mod/storageCache",[],function(){function t(t,e){var i=(new Date).getTime();this.c=i,e=e||a,this.e=i+1e3*e,this.v=t}function e(t){return"object"==typeof t&&!!(t&&"c"in t&&"e"in t&&"v"in t)}function i(t){return(new Date).getTime()<t.e}var s=new Date("Fri, 31 Dec 9999 23:59:59 UTC"),a=s.getTime(),n={serialize:function(t){return JSON.stringify(t)},deserialize:function(t){return t&&JSON.parse(t)}},o={AUTH:"KMAUTH",get:function(t,e){if(this.isLocalStorage()){var i=this.getStorage(e).getItem(t);return i?JSON.parse(i):void 0}},set:function(t,e,i){this.isLocalStorage()&&(e=JSON.stringify(e),this.getStorage(i).setItem(t,e))},remove:function(t,e){this.isLocalStorage()&&this.getStorage(e).removeItem(t)},setCache:function(e,i,s,a){if(this.isLocalStorage()){var o=new t(i,s);this.getStorage(a).setItem(e,n.serialize(o))}},getCache:function(t,s){var a=null;try{var o=this.getStorage(s).getItem(t);a=n.deserialize(o)}catch(t){return null}if(e(a)){if(i(a)){var o=a.v;return o}return this.remove(t),null}return null},getStorage:function(t){return t?sessionStorage:localStorage},isLocalStorage:function(){try{return!!window.localStorage||(console.log("不支持本地存储"),!1)}catch(t){return console.log("本地存储已关闭"),!1}}};window.Storage=o}),define("plugs/popups",[],function(require,exports,module){var t=function(t,e){var i={isClose:"",className:"",title:"",topTxt:"",img:"",botTxt:"",sureTxt:"",cancelTxt:""};this.option={};for(var s in i)this.option[s]=t[s]||i[s];this.id="pop_"+(new Date).getTime(),this.init(e)};t.prototype.init=function(t){var e=this,i=e.option,s=[];s.push('<div class="pop-screen km-dialog" id="'+e.id+'">'),s.push('<div class="pop-content '+i.className+'">'),"yes"==i.isClose&&s.push('<div class="pop-close">x</div>'),""!=i.title&&s.push('<div class="title">'+i.title+"</div>"),""!=i.topTxt&&s.push('<div class="top_txt">'+i.topTxt+"</div>"),""!=i.img&&s.push('<div class="pop-imgbox"><img src="'+i.img+'" /></div>'),""!=i.botTxt&&s.push('<div class="bot_txt">'+i.botTxt+"</div>"),s.push('<div class="pop-btn">'),""!=i.sureTxt&&s.push('<a class="yes">'+i.sureTxt+"</a>"),""!=i.cancelTxt&&s.push('<a class="no">'+i.cancelTxt+"</a>"),s.push("</div></div></div>"),$("body").append(s.join(""));var a="#"+e.id,n=$(a+" .pop-content");n.css("margin-top",parseInt((innerHeight-n.height())/3)),$(a+" .pop-close").on("click",function(){e.close()}),$(a+" .yes").click(function(){$(a).remove(),$.isFunction(t)&&t(!0)}),$(a+" .no").click(function(){$(a).remove(),$.isFunction(t)&&t(!1)})},t.prototype.close=function(){$("#"+this.id).remove()},module.exports=t});