define("app/publicBox",["../mod/base","../plugs/tipsAd"],function(require,exports,module){var e=require("../mod/base"),t=require("../plugs/tipsAd"),o=$("#ruleCon").html();$("#rule").on("click",function(){new t({title:"活动规则",text:o,hasAd:"0"})}),$("#go").on("click",function(){window.location="openBox.html?auth_token="+Tools.auth_token()}),e.custom({url:"api/v1/box/user"},function(e){if(console.log(e),1e3==e.status){var t=e.data.leftBoxNum;$("#boxNum").text(t),0==t?$("#getCoin").addClass("nobox"):$("#getCoin").addClass("bounce")}else Tools.alertDialog({text:e.desc,time:"999999999"})}),$("#getCoin").on("click",function(){var t=$(this);t.hasClass("nobox")?Tools.alertDialog({title:'<p style="font-size:.16rem;font-weight: normal;line-height:1.8;">当前还没有宝箱可开启哦<br>速速参与活动<br>邀请好友点击赢取宝箱吧</p>',text:'<a href="openBox.html?auth_token='+Tools.auth_token()+'" class="ui-btn minbtn">马上行动</a>',time:"0"}):t.hasClass("disabled")?(Tools.alertDialog({text:"开启太频繁，3秒后再开吧~",time:"0"}),setTimeout(function(){t.removeClass("disabled")},3e3)):(t.addClass("disabled"),e.custom({url:"api/v1/box/open"},function(e){if(1e3==e.status)var o=parseInt($("#boxNum").text()),n=setInterval(function(){t.find(".o1").length>0?($("#getCoin .top").addClass("o2"),o>0&&$("#boxNum").text(o-1),$("#getCoin .coin").text("+"+e.data.coin).show().addClass("opa"),Tools.alertDialog({text:"恭喜您获得"+e.data.coin+"金币",time:"1200"},function(){t.removeClass("disabled"),$("#getCoin .coin").text("").hide().removeClass("opa"),$("#getCoin .top").removeClass("o2").removeClass("o1")}),clearInterval(n)):$("#getCoin .top").addClass("o1")},80);else{if(9940!=e.status)return void Tools.alertDialog({title:"开启失败",text:e.desc,time:"9999999999"});Tools.alertDialog({title:'<p style="font-size:.16rem;font-weight: normal;line-height:1.8;">宝箱开完啦<br>继续参与活动 邀请好友点击<br>赢取更多宝箱吧</p>',text:'<a href="openBox.html?auth_token='+Tools.auth_token()+'" class="ui-btn minbtn">马上行动</a>',time:"0"})}}))})}),define("mod/base",["zepto","../plugs/doT.min","./tools"],function(require,exports,module){function e(e,t){var o=e,n={"M+":o.getMonth()+1,"d+":o.getDate(),"h+":o.getHours(),"m+":o.getMinutes(),"s+":o.getSeconds(),"q+":Math.floor((o.getMonth()+3)/3),S:o.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(o.getFullYear()+"").substr(4-RegExp.$1.length)));for(var i in n)new RegExp("("+i+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?n[i]:("00"+n[i]).substr((""+n[i]).length)));return t}function t(e){var t,o=function(){};if(!e.status)return void Tools.alertDialog({title:"出错了",text:"没有返回status"});if(/1001|1002|1003|1004|1008|1009|1015/.test(e.status))t={title:"提醒",text:e.desc};else if(/1006/.test(e.status)){var n=5;t={title:"提醒",text:"访问太过频繁，<span id='closeTimer'>"+n+"</span>s后自动刷新"};var i=setInterval(function(){n--,n<1&&(clearInterval(i),window.location.reload()),$("#closeTimer").text(n)},1e3)}else{if(1101!=e.status)return t=null,!0;t={title:"提醒",text:"请打开设置->通用->日期与时间校准您的系统时间"}}return null!=t?(Tools.alertDialog(t,o),!1):void 0}var $=require("zepto");var o=require("../plugs/doT.min"),n={key:"26817749",km_api:server+"km_task/"};require("./tools"),module.exports={formatDate:function(t,o){var n=o||"yyyy-MM-dd hh:mm";if(isNaN(t)||null==t)return t;if("object"==typeof t){var i=dd.getFullYear(),a=dd.getMonth()+1,s=dd.getDate();a<10&&(a="0"+a);var l=i+"-"+a+"-"+s,r=l.match(/(\d+)/g),u=new Date(r[0],r[1]-1,r[2]);return e(u,n)}var u=new Date(parseInt(t));return e(u,n)},baseAjax:function(e,o){var i={name:"app_key",value:n.key};e.showLoading&&(0==$(".ui-loading-block").length?$("body").append('<div class="ui-loading-block km-dialog show"><div class="ui-loading-cnt"><i class="ui-loading-bright"></i><p>加载中……</p></div></div>'):$(".ui-loading-block").addClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).hide()),e.data||(e.data={}),$.isFunction(e.data.push)?e.data.push(i):e.data.app_key=n.key,$.isFunction(e.data.push)?e.data.push({name:"auth_token",value:Tools.auth_token()}):e.data.auth_token=Tools.auth_token(),$.ajax({url:n.km_api+e.url,data:e.data,type:"GET",dataType:"jsonp",xhrFields:{withCredentials:!0},jsonpCallback:"jsonp"+Math.ceil(1e3*Math.random()),success:function(n){e.showLoading&&($(".ui-loading-block").removeClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).show()),t(n)&&o(n)},error:function(t,o,n){console.log(t),e.showLoading&&$(".ui-loading-block").removeClass("show"),"paging"!=e.logtype&&$(e.renderEle).show()}})},render:function(e,t,n,i,a){if($(t).length>0&&n){var s=i||void 0,l=$(t).text(),r=o.template(l,void 0,s);a?$(e).html(r(n)):$(e).append(r(n))}},custom:function(e,t){var o=this;e=e||{},e.logtype="custom",o.baseAjax(e,t)}}}),define("plugs/doT.min",[],function(require,exports,module){function e(t,o,n){return("string"==typeof o?o:o.toString()).replace(t.define||s,function(e,o,i,a){return 0===o.indexOf("def.")&&(o=o.substring(4)),o in n||(":"===i?(t.defineParams&&a.replace(t.defineParams,function(e,t,i){n[o]={arg:t,text:i}}),o in n||(n[o]=a)):new Function("def","def['"+o+"']="+a)(n)),""}).replace(t.use||s,function(o,i){t.useParams&&(i=i.replace(t.useParams,function(e,t,o,i){if(n[o]&&n[o].arg&&i)return e=(o+":"+i).replace(/'|\\/g,"_"),n.__exp=n.__exp||{},n.__exp[e]=n[o].text.replace(new RegExp("(^|[^\\w$])"+n[o].arg+"([^\\w$])","g"),"$1"+i+"$2"),t+"def.__exp['"+e+"']"}));var a=new Function("def","return "+i)(n);return a?e(t,a,n):a})}function t(e){return e.replace(/\\('|\\)/g,"$1").replace(/[\r\t\n]/g," ")}var o,n={version:"1.0.3",templateSettings:{evaluate:/\{\{([\s\S]+?(\}?)+)\}\}/g,interpolate:/\{\{=([\s\S]+?)\}\}/g,encode:/\{\{!([\s\S]+?)\}\}/g,use:/\{\{#([\s\S]+?)\}\}/g,useParams:/(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,define:/\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,defineParams:/^\s*([\w$]+):([\s\S]+)/,conditional:/\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,iterate:/\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,varname:"it",strip:!0,append:!0,selfcontained:!1,doNotSkipEncoded:!1},template:void 0,compile:void 0};n.encodeHTMLSource=function(e){var t={"&":"&#38;","<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","/":"&#47;"},o=e?/[&<>"'\/]/g:/&(?!#?\w+;)|<|>|"|'|\//g;return function(e){return e?e.toString().replace(o,function(e){return t[e]||e}):""}},o=function(){return this||(0,eval)("this")}(),void 0!==module&&module.exports?module.exports=n:"function"==typeof define&&define.amd?define(function(){return n}):o.doT=n;var i={start:"'+(",end:")+'",startencode:"'+encodeHTML("},a={start:"';out+=(",end:");out+='",startencode:"';out+=encodeHTML("},s=/$^/;n.template=function(l,r,u){r=r||n.templateSettings;var d,c,p=r.append?i:a,g=0;l=r.use||r.define?e(r,l,u||{}):l,l=("var out='"+(r.strip?l.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""):l).replace(/'|\\/g,"\\$&").replace(r.interpolate||s,function(e,o){return p.start+t(o)+p.end}).replace(r.encode||s,function(e,o){return d=!0,p.startencode+t(o)+p.end}).replace(r.conditional||s,function(e,o,n){return o?n?"';}else if("+t(n)+"){out+='":"';}else{out+='":n?"';if("+t(n)+"){out+='":"';}out+='"}).replace(r.iterate||s,function(e,o,n,i){return o?(g+=1,c=i||"i"+g,o=t(o),"';var arr"+g+"="+o+";if(arr"+g+"){var "+n+","+c+"=-1,l"+g+"=arr"+g+".length-1;while("+c+"<l"+g+"){"+n+"=arr"+g+"["+c+"+=1];out+='"):"';} } out+='"}).replace(r.evaluate||s,function(e,o){return"';"+t(o)+"out+='"})+"';return out;").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/\r/g,"\\r").replace(/(\s|;|\}|^|\{)out\+='';/g,"$1").replace(/\+''/g,""),d&&(r.selfcontained||!o||o._encodeHTML||(o._encodeHTML=n.encodeHTMLSource(r.doNotSkipEncoded)),l="var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("+n.encodeHTMLSource.toString()+"("+(r.doNotSkipEncoded||"")+"));"+l);try{return new Function(r.varname,l)}catch(e){throw"undefined"!=typeof console&&console.log("Could not create a template function: "+l),e}},n.compile=function(e,t){return n.template(e,null,t)},module.exports=n}),define("mod/tools",[],function(require){var e={getQueryValue:function(e){var t=location.search,o=new Array;if(t.length>1){var n=t.indexOf("?");t=t.substring(n+1,t.length)}else t=null;if(t)for(var i=0;i<t.split("&").length;i++)o[i]=t.split("&")[i];for(var a=0;a<o.length;a++)if(o[a].split("=")[0]==e)return decodeURI(o[a].split("=")[1]);return""},uid:function(){return this.getQueryValue("uid")||"null"},auth_token:function(){return this.getQueryValue("auth_token")||"null"},alertDialog:function(e,t){var o={title:null,text:null,img:null,time:3e3};for(var n in o)e[n]=e[n]||o[n];var i="tips"+(new Date).getTime(),a='<div id="'+i+'" class="ui-popup-screen km-dialog"><div class="ui-overlay-shadow km-popup">';e.time<1&&(a+='<i class="iconfont icon-close" id="close"></i>'),a+='<div class="content">',null!=e.title&&""!=e.title&&(a+="<h1>"+e.title+"</h1>"),null!=e.text&&""!=e.text&&(a+="<p>"+e.text+"</p>"),null!=e.img&&""!=e.img&&(a+='<div class="pic"><img src="'+e.img+'"/></div>'),a+="</div> </div> </div>";var s=$(a).appendTo("body"),l=$("#"+i+" .km-popup").height(),r=$(window).height(),u=(r-l)/2;if($("#"+i+" .km-popup").css("top",u),s.addClass("show-dialog"),$("#close").click(function(){$("#"+i).remove(),$.isFunction(t)&&t()}),e.time>0){var d=e.time;setTimeout(function(){$("#"+i).remove(),$.isFunction(t)&&t()},d)}}};window.Tools=e}),define("plugs/tipsAd",[],function(require,exports,module){var e=function(e){var t={isClose:"yes",type:"",title:"",subtit:"",text:"",btnType:"0",hasAd:"1",adImg:"image/ad.png",adLink:"school_invite_0.html"};this.option={};for(var o in t)this.option[o]=e[o]||t[o];this.id="pop_"+(new Date).getTime(),this.init()};e.prototype.init=function(e){var t=this,o=t.option,n=[];n.push('<div class="pop-mask km-dialog"></div>'),n.push('<div class="pop-screen km-dialog" id="'+t.id+'">'),n.push('<div class="box">'),"yes"==o.isClose&&n.push('<i class="iconfont icon-close"></i>'),n.push('<div class="hd-img '+o.type+'"></div>'),""!=o.title&&n.push("<h1>"+o.title+"</h1>"),""!=o.subtit&&n.push("<h3>"+o.subtit+"</h3>"),""!=o.text&&n.push('<div class="text">'+o.text+"</div>"),"1"==o.hasAd&&n.push('<div class="ad"><a href="'+o.adLink+'"><img src="'+o.adImg+'" /></a></div>'),"1"==o.btnType&&n.push('<div class="btnbox"><a class="close">我知道了</a></div>'),n.push("</div></div>"),$("body").append(n.join("")),$("#"+t.id).height($("#"+t.id+" .box").height()),$("#"+t.id+" .icon-close, #"+t.id+" .close").on("click",function(){t.close()})},e.prototype.close=function(){var e=$("#"+this.id);e.prev().remove(),e.remove()},module.exports=e});