define("app/video",["../mod/base","../plugs/version","../plugs/cookieStorage","../plugs/validread"],function(require,exports,module){function e(){if($("#videoplayer")[0].addEventListener("play",function(){_hmt.push(["_trackEvent","video","play"]);var e=document.createElement("iframe");n.isNews&&(e.src="kmxb://article?height="+innerHeight),n.isBrowser&&(e.src="kmb://article?height="+innerHeight),e.style.display="none",$("body").append(e),$(e).remove()}),n.gEq("1.2.2")){var e=document.createElement("iframe");n.isNews&&(e.src="kmxb://article?refreshheight="+$("#MainCon").parent().height()),n.isBrowser&&(e.src="kmb://article?refreshheight="+$("#MainCon").parent().height()),e.style.display="none",$("body").append(e),$(e).remove()}}var t=require("../mod/base"),n=require("../plugs/version");require("../plugs/cookieStorage"),n.less("1.2.2")&&(Storage.get("HASWARNING_")||(Storage.set("HASWARNING_",1),alertDialog({title:"升级通知",text:'请升级至新版本1.3.0，活动多多奖励多多，提现立即到账！现有版本近期将停止提现功能！<br><br><a style="background-color:#fa0;color:#fff;display:inline-block;padding: 5px 10px;" href="http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser">马上更新</a>',time:"0"})));var o=Tools.getQueryValue("id")||"";if(""==o||!/^[0-9]+$/.test(o))return void(window.location="http://news.kuaima.cn/404.html");n.less("1.2.0")?function(){var n=require("../plugs/validread");t.custom({url:"api/v1/article/"+o},function(i){var r=i.data,a=r.article;document.title=a.title,""!=a.origin_url&&$("#originUrl").attr("href",a.origin_url);try{t.render("#MainCon","#MainCon-tmpl",a)}catch(e){console.log(e)}e();var s={tags:'<span class="tag red-tag">热门</span>'};t.render("#recommend","#recommend-tmpl",r.recomArticles,s),$(".recommend-wrap").show(),"1"==Tools.getQueryValue("login")&&r.idx&&r.seconds&&"null"!=Tools.auth_token()&&n(o,r.idx,r.seconds),"0"==Tools.getQueryValue("login")&&("Android"==Tools.notPC?alertDialog({text:'登录之后看文章有奖励哦~<br><br><a style="background-color:#fa0;color:#fff;display:inline-block;padding: 5px 10px;" href="kmb://alertlogin">马上登录</a>'}):window.location="kmb://alertlogin"),$("#recommend").on("click","a",function(){var e=$(this).data("url"),t=$(this).data("id");window.location.href="kmb://recommend?url="+e+"&id="+t})})}():($(".recommend-wrap").remove(),t.custom({url:"api/v2/article/details/"+o},function(n){var o=n.data.article;document.title=o.title,""!=o.origin_url&&$("#originUrl").attr("href",o.origin_url);try{t.render("#MainCon","#MainCon-tmpl",o)}catch(e){console.log(e)}e()}))}),define("mod/base",["zepto","../plugs/doT.min","./tools"],function(require,exports,module){function e(e,t){var n=e,o={"M+":n.getMonth()+1,"d+":n.getDate(),"h+":n.getHours(),"m+":n.getMinutes(),"s+":n.getSeconds(),"q+":Math.floor((n.getMonth()+3)/3),S:n.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(n.getFullYear()+"").substr(4-RegExp.$1.length)));for(var i in o)new RegExp("("+i+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?o[i]:("00"+o[i]).substr((""+o[i]).length)));return t}function t(e){var t,n=function(){};if(!e.status)return void Tools.alertDialog({title:"提醒",text:"系统错误，请稍后重试！"});switch(e.status){case 1101:t={title:"提醒",text:"请打开设置->通用->日期与时间校准您的系统时间"};break;case 1004:t={title:"提醒",text:"请在快马浏览器中登录再访问！"};break;case 1002:t={title:"提醒",text:"请在快马浏览器中访问！"};break;case 1006:var o=5;t={title:"提醒",text:"访问太过频繁，<span id='closeTimer'>"+o+"</span>s后自动刷新"};var i=setInterval(function(){o--,o<1&&(clearInterval(i),window.location.reload()),$("#closeTimer").text(o)},1e3);break;default:return t=null,!0}return null!=t?(Tools.alertDialog(t,n),!1):void 0}var $=require("zepto");var n=require("../plugs/doT.min"),o={key:"26817749",km_api:server+"km_task/"};require("./tools"),module.exports={formatDate:function(t,n){var o=n||"yyyy-MM-dd hh:mm";if(isNaN(t)||null==t)return t;if("object"==typeof t){var i=dd.getFullYear(),r=dd.getMonth()+1,a=dd.getDate();r<10&&(r="0"+r);var s=i+"-"+r+"-"+a,l=s.match(/(\d+)/g),u=new Date(l[0],l[1]-1,l[2]);return e(u,o)}var u=new Date(parseInt(t));return e(u,o)},baseAjax:function(e,n){var i={name:"app_key",value:o.key};e.showLoading&&(0==$(".ui-loading-block").length?$("body").append('<div class="ui-loading-block km-dialog show"><div class="ui-loading-cnt"><i class="ui-loading-bright"></i><p>加载中……</p></div></div>'):$(".ui-loading-block").addClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).hide()),e.data||(e.data={}),$.isFunction(e.data.push)?e.data.push(i):e.data.app_key=o.key,$.isFunction(e.data.push)?e.data.push({name:"auth_token",value:Tools.auth_token()}):e.data.auth_token=Tools.auth_token(),$.ajax({url:o.km_api+e.url,data:e.data,type:"GET",dataType:"jsonp",xhrFields:{withCredentials:!0},jsonpCallback:"jsonp"+Math.ceil(1e3*Math.random()),success:function(o){e.showLoading&&($(".ui-loading-block").removeClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).show()),t(o)&&n(o)},error:function(t,n,o){console.log(t),e.showLoading&&$(".ui-loading-block").removeClass("show"),"paging"!=e.logtype&&$(e.renderEle).show()}})},render:function(e,t,o,i,r){if($(t).length>0&&o){var a=i||void 0,s=$(t).text(),l=n.template(s,void 0,a);r?$(e).html(l(o)):$(e).append(l(o))}},custom:function(e,t){var n=this;e=e||{},e.logtype="custom",n.baseAjax(e,t)}}}),define("plugs/doT.min",[],function(require,exports,module){function e(t,n,o){return("string"==typeof n?n:n.toString()).replace(t.define||a,function(e,n,i,r){return 0===n.indexOf("def.")&&(n=n.substring(4)),n in o||(":"===i?(t.defineParams&&r.replace(t.defineParams,function(e,t,i){o[n]={arg:t,text:i}}),n in o||(o[n]=r)):new Function("def","def['"+n+"']="+r)(o)),""}).replace(t.use||a,function(n,i){t.useParams&&(i=i.replace(t.useParams,function(e,t,n,i){if(o[n]&&o[n].arg&&i)return e=(n+":"+i).replace(/'|\\/g,"_"),o.__exp=o.__exp||{},o.__exp[e]=o[n].text.replace(new RegExp("(^|[^\\w$])"+o[n].arg+"([^\\w$])","g"),"$1"+i+"$2"),t+"def.__exp['"+e+"']"}));var r=new Function("def","return "+i)(o);return r?e(t,r,o):r})}function t(e){return e.replace(/\\('|\\)/g,"$1").replace(/[\r\t\n]/g," ")}var n,o={version:"1.0.3",templateSettings:{evaluate:/\{\{([\s\S]+?(\}?)+)\}\}/g,interpolate:/\{\{=([\s\S]+?)\}\}/g,encode:/\{\{!([\s\S]+?)\}\}/g,use:/\{\{#([\s\S]+?)\}\}/g,useParams:/(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,define:/\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,defineParams:/^\s*([\w$]+):([\s\S]+)/,conditional:/\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,iterate:/\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,varname:"it",strip:!0,append:!0,selfcontained:!1,doNotSkipEncoded:!1},template:void 0,compile:void 0};o.encodeHTMLSource=function(e){var t={"&":"&#38;","<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","/":"&#47;"},n=e?/[&<>"'\/]/g:/&(?!#?\w+;)|<|>|"|'|\//g;return function(e){return e?e.toString().replace(n,function(e){return t[e]||e}):""}},n=function(){return this||(0,eval)("this")}(),void 0!==module&&module.exports?module.exports=o:"function"==typeof define&&define.amd?define(function(){return o}):n.doT=o;var i={start:"'+(",end:")+'",startencode:"'+encodeHTML("},r={start:"';out+=(",end:");out+='",startencode:"';out+=encodeHTML("},a=/$^/;o.template=function(s,l,u){l=l||o.templateSettings;var c,d,p=l.append?i:r,g=0;s=l.use||l.define?e(l,s,u||{}):s,s=("var out='"+(l.strip?s.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""):s).replace(/'|\\/g,"\\$&").replace(l.interpolate||a,function(e,n){return p.start+t(n)+p.end}).replace(l.encode||a,function(e,n){return c=!0,p.startencode+t(n)+p.end}).replace(l.conditional||a,function(e,n,o){return n?o?"';}else if("+t(o)+"){out+='":"';}else{out+='":o?"';if("+t(o)+"){out+='":"';}out+='"}).replace(l.iterate||a,function(e,n,o,i){return n?(g+=1,d=i||"i"+g,n=t(n),"';var arr"+g+"="+n+";if(arr"+g+"){var "+o+","+d+"=-1,l"+g+"=arr"+g+".length-1;while("+d+"<l"+g+"){"+o+"=arr"+g+"["+d+"+=1];out+='"):"';} } out+='"}).replace(l.evaluate||a,function(e,n){return"';"+t(n)+"out+='"})+"';return out;").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/\r/g,"\\r").replace(/(\s|;|\}|^|\{)out\+='';/g,"$1").replace(/\+''/g,""),c&&(l.selfcontained||!n||n._encodeHTML||(n._encodeHTML=o.encodeHTMLSource(l.doNotSkipEncoded)),s="var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("+o.encodeHTMLSource.toString()+"("+(l.doNotSkipEncoded||"")+"));"+s);try{return new Function(l.varname,s)}catch(e){throw"undefined"!=typeof console&&console.log("Could not create a template function: "+s),e}},o.compile=function(e,t){return o.template(e,null,t)},module.exports=o}),define("mod/tools",[],function(require){var e={getQueryValue:function(e){var t=location.search,n=new Array;if(t.length>1){var o=t.indexOf("?");t=t.substring(o+1,t.length)}else t=null;if(t)for(var i=0;i<t.split("&").length;i++)n[i]=t.split("&")[i];for(var r=0;r<n.length;r++)if(n[r].split("=")[0]==e)return decodeURI(n[r].split("=")[1]);return""},uid:function(){return this.getQueryValue("uid")||"null"},auth_token:function(){return this.getQueryValue("auth_token")||"null"},isKM:function(){return/KuaiMa/.test(navigator.userAgent)},notPC:function(){for(var e=navigator.userAgent,t=new Array("Android","iPhone","SymbianOS","Windows Phone","iPad","iPod"),n=!1,o=0;o<t.length;o++)if(e.indexOf(t[o])>0){n=t[o];break}return n},alertDialog:function(e,t){var n={title:null,text:null,img:null,time:3e3};for(var o in n)e[o]=e[o]||n[o];var i="tips"+(new Date).getTime(),r='<div id="'+i+'" class="ui-popup-screen km-dialog"><div class="ui-overlay-shadow km-popup">';e.time<1&&(r+='<i class="iconfont icon-close" id="close"></i>'),r+='<div class="content">',null!=e.title&&""!=e.title&&(r+="<h1>"+e.title+"</h1>"),null!=e.text&&""!=e.text&&(r+="<p>"+e.text+"</p>"),null!=e.img&&""!=e.img&&(r+='<div class="pic"><img src="'+e.img+'"/></div>'),r+="</div> </div> </div>";var a=$(r).appendTo("body"),s=$("#"+i+" .km-popup").height(),l=$(window).height(),u=(l-s)/2;if($("#"+i+" .km-popup").css("top",u),a.addClass("show-dialog"),$("#close").click(function(){$("#"+i).remove(),$.isFunction(t)&&t()}),e.time>0){var c=e.time;setTimeout(function(){$("#"+i).remove(),$.isFunction(t)&&t()},c)}}};window.Tools=e}),define("plugs/version",[],function(require,exports,module){var e,t={},n=navigator.userAgent;if(t.userAgent=n,t.isKM=/KuaiMa/.test(n),t.isNews=/KuaiMaNews/.test(n),t.isBrowser=/KuaiMaBrowser/.test(n),t.isKM){var o=n.split("ssy=")[1];e=/iOS|Android/.test(o.split(";")[0])?o.split(";")[2]:o.split(";")[1],t.version=e.replace("V","")}console.log(t.version),t.equal=function(e){return!!t.isKM&&e==this.version},t.greater=function(e){if(t.isKM){for(var n=this.version.split("."),o=e.split("."),i=!1,r=0;r<n.length&&!(n[r]<o[r]);r++)n[r]>o[r]&&(i=!0);return i}return!1},t.less=function(e){if(t.isKM){for(var n=this.version.split("."),o=e.split("."),i=!1,r=0;r<n.length&&!(n[r]>o[r]);r++)n[r]<o[r]&&(i=!0);return i}return!1},t.gEq=function(e){return!(!this.equal(e)&&!this.greater(e))},t.lEq=function(e){return!(!this.equal(e)&&!this.less(e))},module.exports=t}),define("plugs/cookieStorage",[],function(){var e={get:function(e){var t="(?:;)?"+e+"=([^;]*);?";if(!new RegExp(t).test(document.cookie))return null;try{return unescape(RegExp.$1)}catch(e){return null}},set:function(e,t,n){n=n||this.getExpDate(7,0,0),"number"==typeof n&&(n=this.getExpDate(n,0,0)),document.cookie=e+"="+escape(t)+(null==n?"":";expires="+n)+"; path=/"},remove:function(e){this.set(e,"",-1)},getExpDate:function(e,t,n){var o=new Date;if("number"==typeof e&&"number"==typeof t&&"number"==typeof t)return o.setDate(o.getDate()+parseInt(e)),o.setHours(o.getHours()+parseInt(t)),o.setMinutes(o.getMinutes()+parseInt(n)),o.toGMTString()}};window.Cookie=e;var t={AUTH:"KMAUTH",LNAME:"MY-LNAME",ACCOUNT:"MY-NAME",HEADIMG:"MY-HEADIMG",get:function(e,t){if(this.isLocalStorage()){var n=this.getStorage(t).getItem(e);return n?JSON.parse(n):void 0}},set:function(e,t,n){this.isLocalStorage()&&(t=JSON.stringify(t),this.getStorage(n).setItem(e,t))},remove:function(e,t){this.isLocalStorage()&&this.getStorage(t).removeItem(e)},getStorage:function(e){return e?sessionStorage:localStorage},isLocalStorage:function(){try{return!!window.localStorage||(console.log("不支持本地存储"),!1)}catch(e){return console.log("本地存储已关闭"),!1}}};window.Storage=t}),define("plugs/validread",["../mod/base"],function(require,exports,module){var e=require("../mod/base"),t=function(t,n,o){var i=this;this.open=!1,this.listH=!1,this.isTime=!1,this.hasRecord=!1,this.idx=n,this.rid=$("#rec_"+n).data("id"),this._ajax=function(){i.open&&i.listH&&i.isTime&&!i.hasRecord&&(i.hasRecord=!0,e.custom({url:"api/v1/article/view",data:{articleId:t,rid:i.rid}},function(e){if(1e3==e.status){0!=e.data.coin_num&&Tools.alertDialog({text:"获得"+e.data.coin_num+"金币",img:"image/coin.png",time:1800}),i.hasRecord=!0;var t=document.createElement("iframe");t.src="kmb://refreshgold",t.style.display="none",$("body").append(t),$(t).remove()}else i.hasRecord=!1}))},setTimeout(function(){i.isTime=!0,i._ajax()},1e3*o),$(window).scroll(function(){$("#rec_"+i.idx).offset().top-innerHeight<(document.documentElement.scrollTop||document.body.scrollTop)&&(i.listH=!0,i._ajax())}),$("#videoplayer").length>0?$("#videoplayer")[0].addEventListener("play",function(){i.open=!0,i._ajax()}):$("#unfold").on("click",function(){i.open=!0,i._ajax()})};module.exports=t});