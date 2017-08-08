define("app/wnl_article",["../mod/base","../plugs/cookieStorage"],function(require,exports,module){function e(){var e=$("#MainCon").width();$("#MainCon img").each(function(){var t=$(this),n=t.data("gif-url")||t.data("original")||t.data("src"),i=t.data("w")||t.data("width"),o=t.data("h")||t.data("height");i&&t.css("width",i),o&&(e<i?t.css("height",o*e/i):t.css("height",o)),t.data("gif-url")&&t.css({width:"auto","max-width":"100%"}),t.parent().attr("href")&&t.parent().attr("href","javascript:void(0)"),n&&(a.removeData(t),a.isEmpty(n)||t.attr("src",n))}),1==$("#conIframe").length&&$("#conIframe").height(innerHeight).width(innerWidth),$("#MainCon .video_iframe").each(function(){var t=$(this).data("src");if($(this).width(e).height(2*e/3),t&&!a.isEmpty(t))if(/v.qq.com\/iframe\/preview.html/.test(t)){var n=t.split("preview.html?vid="),i=n[1].split("&")[0];$(this).attr("src",n[0]+"player.html?auto=0&vid="+i)}else $(this).attr("src",t)}),$("#MainCon .iframe_video").each(function(){var e=parseInt($(this).width());$(this).css("height",.6*e+"px")}),$("qqmusic").length>0&&($("qqmusic").remove(),$("#qqmusic_play_").remove()),$("#Cnt-Main-Article-QQ").length>0&&($("#Cnt-Main-Article-QQ script").remove(),$("#Cnt-Main-Article-QQ iframe").remove(),$("#Cnt-Main-Article-QQ .rv-js-root").remove());var t,n=$("#MainCon").height(),i=Tools.getQueryValue("mh")/100;t=i?(i*n).toFixed(2)+"px":n>innerHeight+80?innerHeight+80+"px":n>250?n-50+"px":n+40+"px",$("#article").height(t)}var t=require("../mod/base");require("../plugs/cookieStorage");var n=Tools.getQueryValue("id")||"";if(""==n||!/^[0-9]+$/.test(n))return void(window.location="http://news.kuaima.cn/404.html");var a={user_agent:navigator.userAgent.toLocaleLowerCase(),isAndroid:function(){return/android/.test(this.user_agent)},isIos:function(){return/iphone|ipod|ipad/.test(this.user_agent)},isEmpty:function(e){return/^\s*$/.test(e)},removeData:function(e){$.each(e.data(),function(t){e.removeAttr("data-"+t)})}};t.custom({url:"api/v1/article/"+n},function(n){var a=n.data,i=a.article;document.title=i.title;try{t.render("#MainCon","#MainCon-tmpl",i)}catch(e){console.log(e)}e(),t.render("#recommend","#recommend-tmpl",a.recomArticles),$(".recommend-wrap").show(),seajs.use("https://static.mlinks.cc/scripts/dist/mlink.min.js",function(){$(".unfold").show();var e=new Object;e.mlink="https://ax9wdh.mlinks.cc/AaiE",e.button=document.querySelectorAll("a#unfold"),e.params={detailid:i.id,detailurl:i.url},new Mlink(e);for(var t=$("#recommend li").length,n=0;n<t;n++){var a="#rec_"+n,e=new Object;e.mlink="https://ax9wdh.mlinks.cc/AaiE",e.button=document.querySelectorAll("a"+a),e.params={detailid:$(a).data("id"),detailurl:$(a).data("url")},new Mlink(e)}})}),$("#num").text(Math.ceil(93*Math.random())+7),$("#photos li").each(function(){var e=Math.ceil(1e3*Math.random());$(this).css("background-image","url(image/photos/"+e+".png)")})}),define("mod/base",["zepto","../plugs/doT.min","./tools"],function(require,exports,module){function e(e,t){var n=e,a={"M+":n.getMonth()+1,"d+":n.getDate(),"h+":n.getHours(),"m+":n.getMinutes(),"s+":n.getSeconds(),"q+":Math.floor((n.getMonth()+3)/3),S:n.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(n.getFullYear()+"").substr(4-RegExp.$1.length)));for(var i in a)new RegExp("("+i+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?a[i]:("00"+a[i]).substr((""+a[i]).length)));return t}function t(e){var t,n=function(){};if(!e.status)return void Tools.alertDialog({title:"提醒",text:"系统错误，请稍后重试！"});switch(e.status){case 1101:t={title:"提醒",text:"请打开设置->通用->日期与时间校准您的系统时间"};break;case 1004:t={title:"提醒",text:"请在快马浏览器中登录再访问！"};break;case 1002:t={title:"提醒",text:"请在快马浏览器中访问！"};break;case 1006:var a=5;t={title:"提醒",text:"访问太过频繁，<span id='closeTimer'>"+a+"</span>s后自动刷新"};var i=setInterval(function(){a--,a<1&&(clearInterval(i),window.location.reload()),$("#closeTimer").text(a)},1e3);break;default:return t=null,!0}return null!=t?(Tools.alertDialog(t,n),!1):void 0}var $=require("zepto");var n=require("../plugs/doT.min"),a={key:"26817749",km_api:server+"km_task/"};require("./tools"),module.exports={formatDate:function(t,n){var a=n||"yyyy-MM-dd hh:mm";if(isNaN(t)||null==t)return t;if("object"==typeof t){var i=dd.getFullYear(),o=dd.getMonth()+1,r=dd.getDate();o<10&&(o="0"+o);var s=i+"-"+o+"-"+r,l=s.match(/(\d+)/g),u=new Date(l[0],l[1]-1,l[2]);return e(u,a)}var u=new Date(parseInt(t));return e(u,a)},baseAjax:function(e,n){var i={name:"app_key",value:a.key};e.showLoading&&(0==$(".ui-loading-block").length?$("body").append('<div class="ui-loading-block km-dialog show"><div class="ui-loading-cnt"><i class="ui-loading-bright"></i><p>加载中……</p></div></div>'):$(".ui-loading-block").addClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).hide()),e.data||(e.data={}),$.isFunction(e.data.push)?e.data.push(i):e.data.app_key=a.key,$.isFunction(e.data.push)?e.data.push({name:"auth_token",value:Tools.auth_token()}):e.data.auth_token=Tools.auth_token(),$.ajax({url:a.km_api+e.url,data:e.data,type:"GET",dataType:"jsonp",xhrFields:{withCredentials:!0},jsonpCallback:"jsonp"+Math.ceil(1e3*Math.random()),success:function(a){e.showLoading&&($(".ui-loading-block").removeClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).show()),t(a)&&n(a)},error:function(t,n,a){console.log(t),e.showLoading&&$(".ui-loading-block").removeClass("show"),"paging"!=e.logtype&&$(e.renderEle).show()}})},render:function(e,t,a,i,o){if($(t).length>0&&a){var r=i||void 0,s=$(t).text(),l=n.template(s,void 0,r);o?$(e).html(l(a)):$(e).append(l(a))}},custom:function(e,t){var n=this;e=e||{},e.logtype="custom",n.baseAjax(e,t)}}}),define("plugs/doT.min",[],function(require,exports,module){function e(t,n,a){return("string"==typeof n?n:n.toString()).replace(t.define||r,function(e,n,i,o){return 0===n.indexOf("def.")&&(n=n.substring(4)),n in a||(":"===i?(t.defineParams&&o.replace(t.defineParams,function(e,t,i){a[n]={arg:t,text:i}}),n in a||(a[n]=o)):new Function("def","def['"+n+"']="+o)(a)),""}).replace(t.use||r,function(n,i){t.useParams&&(i=i.replace(t.useParams,function(e,t,n,i){if(a[n]&&a[n].arg&&i)return e=(n+":"+i).replace(/'|\\/g,"_"),a.__exp=a.__exp||{},a.__exp[e]=a[n].text.replace(new RegExp("(^|[^\\w$])"+a[n].arg+"([^\\w$])","g"),"$1"+i+"$2"),t+"def.__exp['"+e+"']"}));var o=new Function("def","return "+i)(a);return o?e(t,o,a):o})}function t(e){return e.replace(/\\('|\\)/g,"$1").replace(/[\r\t\n]/g," ")}var n,a={version:"1.0.3",templateSettings:{evaluate:/\{\{([\s\S]+?(\}?)+)\}\}/g,interpolate:/\{\{=([\s\S]+?)\}\}/g,encode:/\{\{!([\s\S]+?)\}\}/g,use:/\{\{#([\s\S]+?)\}\}/g,useParams:/(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,define:/\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,defineParams:/^\s*([\w$]+):([\s\S]+)/,conditional:/\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,iterate:/\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,varname:"it",strip:!0,append:!0,selfcontained:!1,doNotSkipEncoded:!1},template:void 0,compile:void 0};a.encodeHTMLSource=function(e){var t={"&":"&#38;","<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","/":"&#47;"},n=e?/[&<>"'\/]/g:/&(?!#?\w+;)|<|>|"|'|\//g;return function(e){return e?e.toString().replace(n,function(e){return t[e]||e}):""}},n=function(){return this||(0,eval)("this")}(),void 0!==module&&module.exports?module.exports=a:"function"==typeof define&&define.amd?define(function(){return a}):n.doT=a;var i={start:"'+(",end:")+'",startencode:"'+encodeHTML("},o={start:"';out+=(",end:");out+='",startencode:"';out+=encodeHTML("},r=/$^/;a.template=function(s,l,u){l=l||a.templateSettings;var c,d,p=l.append?i:o,g=0;s=l.use||l.define?e(l,s,u||{}):s,s=("var out='"+(l.strip?s.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""):s).replace(/'|\\/g,"\\$&").replace(l.interpolate||r,function(e,n){return p.start+t(n)+p.end}).replace(l.encode||r,function(e,n){return c=!0,p.startencode+t(n)+p.end}).replace(l.conditional||r,function(e,n,a){return n?a?"';}else if("+t(a)+"){out+='":"';}else{out+='":a?"';if("+t(a)+"){out+='":"';}out+='"}).replace(l.iterate||r,function(e,n,a,i){return n?(g+=1,d=i||"i"+g,n=t(n),"';var arr"+g+"="+n+";if(arr"+g+"){var "+a+","+d+"=-1,l"+g+"=arr"+g+".length-1;while("+d+"<l"+g+"){"+a+"=arr"+g+"["+d+"+=1];out+='"):"';} } out+='"}).replace(l.evaluate||r,function(e,n){return"';"+t(n)+"out+='"})+"';return out;").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/\r/g,"\\r").replace(/(\s|;|\}|^|\{)out\+='';/g,"$1").replace(/\+''/g,""),c&&(l.selfcontained||!n||n._encodeHTML||(n._encodeHTML=a.encodeHTMLSource(l.doNotSkipEncoded)),s="var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("+a.encodeHTMLSource.toString()+"("+(l.doNotSkipEncoded||"")+"));"+s);try{return new Function(l.varname,s)}catch(e){throw"undefined"!=typeof console&&console.log("Could not create a template function: "+s),e}},a.compile=function(e,t){return a.template(e,null,t)},module.exports=a}),define("mod/tools",[],function(require){var e={getQueryValue:function(e){var t=location.search,n=new Array;if(t.length>1){var a=t.indexOf("?");t=t.substring(a+1,t.length)}else t=null;if(t)for(var i=0;i<t.split("&").length;i++)n[i]=t.split("&")[i];for(var o=0;o<n.length;o++)if(n[o].split("=")[0]==e)return decodeURI(n[o].split("=")[1]);return""},uid:function(){return this.getQueryValue("uid")||"null"},auth_token:function(){return this.getQueryValue("auth_token")||"null"},isKM:function(){return/KuaiMa/.test(navigator.userAgent)},notPC:function(){for(var e=navigator.userAgent,t=new Array("Android","iPhone","SymbianOS","Windows Phone","iPad","iPod"),n=!1,a=0;a<t.length;a++)if(e.indexOf(t[a])>0){n=t[a];break}return n},alertDialog:function(e,t){var n={title:null,text:null,img:null,time:3e3};for(var a in n)e[a]=e[a]||n[a];var i="tips"+(new Date).getTime(),o='<div id="'+i+'" class="ui-popup-screen km-dialog"><div class="ui-overlay-shadow km-popup">';e.time<1&&(o+='<i class="iconfont icon-close" id="close"></i>'),o+='<div class="content">',null!=e.title&&""!=e.title&&(o+="<h1>"+e.title+"</h1>"),null!=e.text&&""!=e.text&&(o+="<p>"+e.text+"</p>"),null!=e.img&&""!=e.img&&(o+='<div class="pic"><img src="'+e.img+'"/></div>'),o+="</div> </div> </div>";var r=$(o).appendTo("body"),s=$("#"+i+" .km-popup").height(),l=$(window).height(),u=(l-s)/2;if($("#"+i+" .km-popup").css("top",u),r.addClass("show-dialog"),$("#close").click(function(){$("#"+i).remove(),$.isFunction(t)&&t()}),e.time>0){var c=e.time;setTimeout(function(){$("#"+i).remove(),$.isFunction(t)&&t()},c)}}};window.Tools=e}),define("plugs/cookieStorage",[],function(){var e={get:function(e){var t="(?:;)?"+e+"=([^;]*);?";if(!new RegExp(t).test(document.cookie))return null;try{return unescape(RegExp.$1)}catch(e){return null}},set:function(e,t,n){n=n||this.getExpDate(7,0,0),"number"==typeof n&&(n=this.getExpDate(n,0,0)),document.cookie=e+"="+escape(t)+(null==n?"":";expires="+n)+"; path=/"},remove:function(e){this.set(e,"",-1)},getExpDate:function(e,t,n){var a=new Date;if("number"==typeof e&&"number"==typeof t&&"number"==typeof t)return a.setDate(a.getDate()+parseInt(e)),a.setHours(a.getHours()+parseInt(t)),a.setMinutes(a.getMinutes()+parseInt(n)),a.toGMTString()}};window.Cookie=e;var t={AUTH:"KMAUTH",LNAME:"MY-LNAME",ACCOUNT:"MY-NAME",HEADIMG:"MY-HEADIMG",get:function(e,t){if(this.isLocalStorage()){var n=this.getStorage(t).getItem(e);return n?JSON.parse(n):void 0}},set:function(e,t,n){this.isLocalStorage()&&(t=JSON.stringify(t),this.getStorage(n).setItem(e,t))},remove:function(e,t){this.isLocalStorage()&&this.getStorage(t).removeItem(e)},getStorage:function(e){return e?sessionStorage:localStorage},isLocalStorage:function(){try{return!!window.localStorage||(console.log("不支持本地存储"),!1)}catch(e){return console.log("本地存储已关闭"),!1}}};window.Storage=t});