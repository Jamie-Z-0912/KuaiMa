define("app/bind",["../mod/submit","../plugs/popups.js","../plugs/cookie.js"],function(require,exports,module){var t=require("../mod/submit"),e=require("../plugs/popups.js");require("../plugs/cookie.js");var i={user:Storage.getCache(Storage.AUTH),setAuth:function(t){Storage.setCache(Storage.AUTH,t,259200)},removeAuth:function(){Storage.remove(Storage.AUTH)}};if(""==Tools.getQueryValue("code")){Ajax.checkAccredit()&&new e({topTxt:"您已经绑定过账号了！一个微信号只能绑定一次哦！",img:"../image/no.png"})}else i.user&&i.removeAuth(),$('input[name="code"]').val(Tools.getQueryValue("code"));var o=Math.random().toFixed(4).substring(2);$("#gvCodeInput, #gvCode").text(o),$("#gvCodeInput").bind("input propertychange",function(t){var e=$(this),i=e.val();if(i.length>3)return i==o?(e.attr("disabled","disabled"),$("#subForm").removeClass("disabled"),e.parent().next().show(),void $("#yuyin").css("display","block")):void e.val("")}),seajs.use("../scripts/lib/jquery.base64",function(){$("#repeatSend,#yuyin").on("click",function(){var e=$('input[name="phone"]').val(),i=$(this).data("type");return e.isEmpty()?void Tools.alertDialog({text:"手机号不能为空"}):e.isMobile()?void($(this).hasClass("disabled")||($("#yuyin").addClass("disabled"),setTimeout(function(){$("#yuyin").removeClass("disabled")},6e4),Cookie.set("_KKMMMMMCMMM",Ajax.formatDate((new Date).getTime(),"yyyyMMdd")),t.sendSms($("#repeatSend"),{phone:base64.encode(e),useto:"bindAccount",type:i}))):void Tools.alertDialog({text:"手机号格式不正确"})})}),$("#subForm").on("click",function(){$(this).hasClass("disabled")||$("#bindUser").submit()}),$("#bindUser").submit(function(o){o.preventDefault();var n=($(this),$('input[name="phone"]').val()),a=$('input[name="verify_code"]').val();return n.isEmpty()?void Tools.alertDialog({text:"手机号不能为空"}):n.isMobile()?a.isEmpty()?void Tools.alertDialog({text:"验证码不能为空"}):a.isVerifyCode()?void t.fun({url:"api/v1/register/bind_wx",no_auth:!0,data:$(this)},function(t){1e3==t.status?(i.setAuth(t.data.auth_token),Storage.get("kmBindReward")&&Storage.remove("kmBindReward"),new e({title:'<img src="../image/bind_suc.png"/>',img:"../image/ok.png",botTxt:"3秒后为您自动跳转……"}),setTimeout(function(){window.location="bindAward.html"},3e3)):Tools.alertDialog({text:t.desc})}):void Tools.alertDialog({text:"请正确输入收到的验证码"}):void Tools.alertDialog({text:"手机号格式不正确"})})}),define("mod/submit",["./base"],function(require,exports,module){var t=require("./base");window.Ajax=t,String.prototype.isEmail=function(){return new RegExp(/^([a-zA-Z0-9]+[_|\_|\.|-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/).test(this)},String.prototype.isMobile=function(){return new RegExp(/^1[3|4|5|7|8]\d{9}$/).test(this)},String.prototype.isChinese=function(){return/^[\u4E00-\uFA29]*$/.test(this)&&!/^[\uE7C7-\uE7F3]*$/.test(this)},String.prototype.isEmpty=function(){return/^\s*$/.test(this)},String.prototype.isVerifyCode=function(){return new RegExp(/^\d*$/).test(this)},String.prototype.isNum=function(){return/^[0-9]+$/.test(this)},exports.fun=function(e,i){var o,n,a="string"!=typeof e.data&&!!e.data.length;a?(o=e.data.serializeArray(),n=e.data.find('[type="submit"]'),n.attr("disabled",!0)):o=e.data,$.each(o,function(){this.value=this.value.replace(/\s/gi,"")}),e.data=o,e.type=e.type||"GET",e.logtype="submit",t.baseAjax(e,function(t,e,o){a&&n.removeAttr("disabled"),"function"==typeof i&&i(t)},function(t,e,i){console.log(t.statusText),a&&n.removeAttr("disabled"),"function"==typeof callbackError&&callbackError(t,e,i)})},exports.sendSms=function(e,i,o,n){var a={phone:"",uid:"",type:"SMS",useto:""};for(var s in a)a[s]=i[s]||a[s];var r,l=60;r&&clearInterval(r),e.addClass("disabled").text("发送中···"),t.custom({url:"api/v1/verify_code/web",no_auth:o||!0,data:a},function(t){1e3==t.status?r=setInterval(function(){if(0==--l)return clearInterval(r),void e.removeClass("disabled").text("重发验证码");e.text("还剩"+l+"秒")},1e3):2003==t.status?Tools.alertDialog({title:"获取失败",text:"获取验证码太频繁，请明日再试"},function(){e.text("明日再获取")}):Tools.alertDialog({title:t.status,text:t.desc}),$.isFunction(n)&&n(t)})}}),define("mod/base",["zepto","./tools","./storageCache"],function(require,exports,module){function t(t,e){var i=t,o={"M+":i.getMonth()+1,"d+":i.getDate(),"h+":i.getHours(),"m+":i.getMinutes(),"s+":i.getSeconds(),"q+":Math.floor((i.getMonth()+3)/3),S:i.getMilliseconds()};/(y+)/.test(e)&&(e=e.replace(RegExp.$1,(i.getFullYear()+"").substr(4-RegExp.$1.length)));for(var n in o)new RegExp("("+n+")").test(e)&&(e=e.replace(RegExp.$1,1==RegExp.$1.length?o[n]:("00"+o[n]).substr((""+o[n]).length)));return e}function e(){var t=window.location.pathname.split(".html")[0],e=t.split("/");$.ajax({url:n.km_api+"api/v1/wx/mp/oauth2/build_authorize_url",data:{app_key:n.key,auth_token:Tools.auth_token(),state:e[e.length-1]},type:"GET",dataType:"jsonp",xhrFields:{withCredentials:!0},jsonpCallback:"jsonp"+Math.ceil(1e3*Math.random()),success:function(t){window.location=t.data.url}})}function i(){return a.user?a.user:Tools.auth_token()?(a.setAuth(Tools.auth_token()),Tools.auth_token()):void e()}function o(t){var i,o=function(){};if(!t.status)return void Tools.alertDialog({title:"出错了",text:"没有返回status"});if(/1001|1002|1003|1009|1101|1015/.test(t.status))i={title:"提醒",text:t.desc};else{if(!/1006/.test(t.status))return/1004|1013|10005/.test(t.status)?(e(),!1):(i=null,!0);var n=5;i={title:"提醒",text:"访问太过频繁，<span id='closeTimer'>"+n+"</span>s后自动刷新"};var a=setInterval(function(){n--,n<1&&(clearInterval(a),window.location.reload()),$("#closeTimer").text(n)},1e3)}return null!=i?(Tools.alertDialog(i,o),!1):void 0}var $=require("zepto");require("./tools"),require("./storageCache");var n={key:"29817749",km_api:server+"km_task/"},a={user:Storage.getCache(Storage.AUTH),setAuth:function(t){Storage.setCache(Storage.AUTH,t,259200)}};module.exports={checkAccredit:i,formatDate:function(e,i){var o=i||"yyyy-MM-dd hh:mm";if(isNaN(e)||null==e)return e;if("object"==typeof e){var n=dd.getFullYear(),a=dd.getMonth()+1,s=dd.getDate();a<10&&(a="0"+a);var r=n+"-"+a+"-"+s,l=r.match(/(\d+)/g),u=new Date(l[0],l[1]-1,l[2]);return t(u,o)}var u=new Date(parseInt(e));return t(u,o)},baseAjax:function(t,e){var a,s=(navigator.userAgent,n.key);a=t.no_auth?"":i();var r={name:"app_key",value:s};t.showLoading&&(0==$(".ui-loading-block").length?$("body").append('<div class="ui-loading-block km-dialog show"><div class="ui-loading-cnt"><i class="ui-loading-bright"></i><p>加载中……</p></div></div>'):$(".ui-loading-block").addClass("show")),t.data||(t.data={}),$.isFunction(t.data.push)?t.data.push(r):t.data.app_key=s,$.isFunction(t.data.push)?t.data.push({name:"auth_token",value:a}):t.data.auth_token=a,$.ajax({url:n.km_api+t.url,data:t.data,type:"GET",dataType:"jsonp",xhrFields:{withCredentials:!0},jsonpCallback:"jsonp"+Math.ceil(1e3*Math.random()),success:function(i){t.showLoading&&$(".ui-loading-block").removeClass("show"),o(i)&&e(i)},error:function(e,i,o){console.log(e),t.showLoading&&$(".ui-loading-block").removeClass("show")}})},custom:function(t,e){var i=this;t=t||{},i.baseAjax(t,e)}}}),define("mod/tools",[],function(require){var t={getQueryValue:function(t){var e=location.search,i=new Array;if(e.length>1){var o=e.indexOf("?");e=e.substring(o+1,e.length)}else e=null;if(e)for(var n=0;n<e.split("&").length;n++)i[n]=e.split("&")[n];for(var a=0;a<i.length;a++)if(i[a].split("=")[0]==t)return decodeURI(i[a].split("=")[1]);return""},auth_token:function(){return t.getQueryValue("auth_token")},alertDialog:function(t,e){var i={title:null,text:null,img:null,time:3e3};for(var o in i)t[o]=t[o]||i[o];var n="tips"+(new Date).getTime(),a='<div id="'+n+'" class="ui-popup-screen km-dialog"><div class="ui-overlay-shadow km-popup">';t.time<1&&(a+='<i class="iconfont icon-close" id="close"></i>'),a+='<div class="content">',null!=t.title&&""!=t.title&&(a+="<h1>"+t.title+"</h1>"),null!=t.text&&""!=t.text&&(a+="<p>"+t.text+"</p>"),null!=t.img&&""!=t.img&&(a+='<div class="pic"><img src="'+t.img+'"/></div>'),a+="</div> </div> </div>";var s=$(a).appendTo("body"),r=$("#"+n+" .km-popup").height(),l=$(window).height(),u=(l-r)/2;if($("#"+n+" .km-popup").css("top",u),s.addClass("show-dialog"),$("#close").click(function(){$("#"+n).remove(),$.isFunction(e)&&e()}),t.time>0){var c=t.time;setTimeout(function(){$("#"+n).remove(),$.isFunction(e)&&e()},c)}}};window.Tools=t}),define("mod/storageCache",[],function(){function t(t,e){var i=(new Date).getTime();this.c=i,e=e||n,this.e=i+1e3*e,this.v=t}function e(t){return"object"==typeof t&&!!(t&&"c"in t&&"e"in t&&"v"in t)}function i(t){return(new Date).getTime()<t.e}var o=new Date("Fri, 31 Dec 9999 23:59:59 UTC"),n=o.getTime(),a={serialize:function(t){return JSON.stringify(t)},deserialize:function(t){return t&&JSON.parse(t)}},s={AUTH:"KMAUTH",get:function(t,e){if(this.isLocalStorage()){var i=this.getStorage(e).getItem(t);return i?JSON.parse(i):void 0}},set:function(t,e,i){this.isLocalStorage()&&(e=JSON.stringify(e),this.getStorage(i).setItem(t,e))},remove:function(t,e){this.isLocalStorage()&&this.getStorage(e).removeItem(t)},setCache:function(e,i,o,n){if(this.isLocalStorage()){var s=new t(i,o);this.getStorage(n).setItem(e,a.serialize(s))}},getCache:function(t,o){var n=null;try{var s=this.getStorage(o).getItem(t);n=a.deserialize(s)}catch(t){return null}if(e(n)){if(i(n)){var s=n.v;return s}return this.remove(t),null}return null},getStorage:function(t){return t?sessionStorage:localStorage},isLocalStorage:function(){try{return!!window.localStorage||(console.log("不支持本地存储"),!1)}catch(t){return console.log("本地存储已关闭"),!1}}};window.Storage=s}),define("plugs/popups",[],function(require,exports,module){var t=function(t,e){var i={isClose:"",className:"",title:"",topTxt:"",img:"",botTxt:"",sureTxt:"",cancelTxt:""};this.option={};for(var o in i)this.option[o]=t[o]||i[o];this.id="pop_"+(new Date).getTime(),this.init(e)};t.prototype.init=function(t){var e=this,i=e.option,o=[];o.push('<div class="pop-screen km-dialog" id="'+e.id+'">'),o.push('<div class="pop-content '+i.className+'">'),"yes"==i.isClose&&o.push('<div class="pop-close">x</div>'),""!=i.title&&o.push('<div class="title">'+i.title+"</div>"),""!=i.topTxt&&o.push('<div class="top_txt">'+i.topTxt+"</div>"),""!=i.img&&o.push('<div class="pop-imgbox"><img src="'+i.img+'" /></div>'),""!=i.botTxt&&o.push('<div class="bot_txt">'+i.botTxt+"</div>"),o.push('<div class="pop-btn">'),""!=i.sureTxt&&o.push('<a class="yes">'+i.sureTxt+"</a>"),""!=i.cancelTxt&&o.push('<a class="no">'+i.cancelTxt+"</a>"),o.push("</div></div></div>"),$("body").append(o.join(""));var n="#"+e.id,a=$(n+" .pop-content");a.css("margin-top",parseInt((innerHeight-a.height())/3)),$(n+" .pop-close").on("click",function(){e.close()}),$(n+" .yes").click(function(){$(n).remove(),$.isFunction(t)&&t(!0)}),$(n+" .no").click(function(){$(n).remove(),$.isFunction(t)&&t(!1)})},t.prototype.close=function(){$("#"+this.id).remove()},module.exports=t}),define("plugs/cookie",[],function(){var t={get:function(t){var e="(?:;)?"+t+"=([^;]*);?";if(!new RegExp(e).test(document.cookie))return null;try{return unescape(RegExp.$1)}catch(t){return null}},set:function(t,e,i){i=i||this.getExpDate(7,0,0),"number"==typeof i&&(i=this.getExpDate(i,0,0)),document.cookie=t+"="+escape(e)+(null==i?"":";expires="+i)+"; path=/"},remove:function(t){this.set(t,"",-1)},getExpDate:function(t,e,i){var o=new Date;if("number"==typeof t&&"number"==typeof e&&"number"==typeof e)return o.setDate(o.getDate()+parseInt(t)),o.setHours(o.getHours()+parseInt(e)),o.setMinutes(o.getMinutes()+parseInt(i)),o.toGMTString()}};window.Cookie=t});