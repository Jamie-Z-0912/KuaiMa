define("app/messageSys",["../mod/pagelist"],function(require,exports,module){function e(e){var t=(new Date).getFullYear(),a=(new Date).getMonth()+1,n=(new Date).getDate(),r=e.split(" ")[0],o=e.split(" ")[1];return r=r.split("-"),r[0]==t&&r[1]==a&&r[2]==n?"今天 "+o:e}require("../mod/pagelist").fun({url:"api/v1/systemMsgs",data:{page:1,page_size:20}},function(t){if(1==t.page)for(var a=0;a<t.data.length;a++){var n=t.data[a];if(e(t.data[a].added_time)==n.added_time)break;t.data[a].added_time=e(n.added_time),1==t.data[a].need_login&&(t.data[a].action=n.action+"?auth_token="+Tools.auth_token())}})}),define("mod/pagelist",["./base","../plugs/laypage"],function(require,exports,module){var e=require("./base"),t=require("../plugs/laypage");window.Ajax=e,exports.defaultListTmpl="#conList-tmpl",exports.defaultListEle="#conList",exports.pagingDom="#listPage",exports.fun=function(a,n,r){var o=(a.data.page,{renderFor:this.defaultListTmpl,renderEle:this.defaultListEle,pagingDom:this.pagingDom,showLoading:!0,hasNext:!0,logtype:"paging"});for(var i in o)a[i]=a[i]||o[i];t({cont:$(a.pagingDom),pages:100,groups:0,curr:1,prev:!1,next:"点击查看更多",skin:"flow",jump:function(t){var o=this;a.data.page=t.curr,e.baseAjax(a,function(i){1020==i.status?(i.data=null,e.render(a.renderEle,a.renderFor,i,void 0,!0),$(a.pagingDom).remove()):(o.pages=i.total,t.curr==i.total&&(a.hasNext=!1,$(a.pagingDom).find(".laypage_main").html("<span>没有更多数据</span>")),$.each(i.data,function(){this.added_time=e.formatDate(this.added_time)}),r||$.isFunction(n)&&n(i),1!=i.page?e.render(a.renderEle,a.renderFor,i,void 0,!1):e.render(a.renderEle,a.renderFor,i,void 0,!0),r&&$.isFunction(n)&&n(),$(a.pagingDom).removeClass("hide"))},function(e,t,a){"function"==typeof callbackError&&callbackError(e,t,a)})}}),window.onscroll=function(){if(a.hasNext){var e=document.body.scrollTop,t=document.body.scrollHeight;e+window.screen.height*window.devicePixelRatio+100>t&&$("#laypage_0 a").click()}}}}),define("mod/base",["zepto","../plugs/doT.min","./tools"],function(require,exports,module){function e(e,t){var a=e,n={"M+":a.getMonth()+1,"d+":a.getDate(),"h+":a.getHours(),"m+":a.getMinutes(),"s+":a.getSeconds(),"q+":Math.floor((a.getMonth()+3)/3),S:a.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(a.getFullYear()+"").substr(4-RegExp.$1.length)));for(var r in n)new RegExp("("+r+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?n[r]:("00"+n[r]).substr((""+n[r]).length)));return t}function t(e){var t,a=function(){};if(!e.status)return void Tools.alertDialog({title:"提醒",text:"系统错误，请稍后重试！"});switch(e.status){case 1101:t={title:"提醒",text:"请打开设置->通用->日期与时间校准您的系统时间"};break;case 1004:t={title:"提醒",text:"请在快马小报中登录再访问！"};break;case 1002:t={title:"提醒",text:"请在快马小报中访问！"};break;case 1006:var n=5;t={title:"提醒",text:"访问太过频繁，<span id='closeTimer'>"+n+"</span>s后自动刷新"};var r=setInterval(function(){n--,n<1&&(clearInterval(r),window.location.reload()),$("#closeTimer").text(n)},1e3);break;default:return t=null,!0}return null!=t?(Tools.alertDialog(t,a),!1):void 0}var $=require("zepto");var a=require("../plugs/doT.min"),n={key:"26817749",km_api:server+"km_task/"};require("./tools"),module.exports={formatDate:function(t,a){var n=a||"yyyy-MM-dd hh:mm";if(isNaN(t)||null==t)return t;if("object"==typeof t){var r=dd.getFullYear(),o=dd.getMonth()+1,i=dd.getDate();o<10&&(o="0"+o);var s=r+"-"+o+"-"+i,l=s.match(/(\d+)/g),u=new Date(l[0],l[1]-1,l[2]);return e(u,n)}var u=new Date(parseInt(t));return e(u,n)},baseAjax:function(e,a){var r={name:"app_key",value:n.key};e.showLoading&&(0==$(".ui-loading-block").length?$("body").append('<div class="ui-loading-block km-dialog show"><div class="ui-loading-cnt"><i class="ui-loading-bright"></i><p>加载中……</p></div></div>'):$(".ui-loading-block").addClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).hide()),e.data||(e.data={}),$.isFunction(e.data.push)?e.data.push(r):e.data.app_key=n.key,$.isFunction(e.data.push)?e.data.push({name:"auth_token",value:Tools.auth_token()}):e.data.auth_token=Tools.auth_token(),$.ajax({url:n.km_api+e.url,data:e.data,type:"GET",dataType:"jsonp",xhrFields:{withCredentials:!0},jsonpCallback:"jsonp"+Math.ceil(1e3*Math.random()),success:function(n){e.showLoading&&($(".ui-loading-block").removeClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).show()),t(n)&&a(n)},error:function(t,a,n){console.log(t),e.showLoading&&$(".ui-loading-block").removeClass("show"),"paging"!=e.logtype&&$(e.renderEle).show()}})},render:function(e,t,n,r,o){if($(t).length>0&&n){var i=r||void 0,s=$(t).text(),l=a.template(s,void 0,i);o?$(e).html(l(n)):$(e).append(l(n))}},custom:function(e,t){var a=this;e=e||{},e.logtype="custom",a.baseAjax(e,t)}}}),define("plugs/doT.min",[],function(require,exports,module){function e(t,a,n){return("string"==typeof a?a:a.toString()).replace(t.define||i,function(e,a,r,o){return 0===a.indexOf("def.")&&(a=a.substring(4)),a in n||(":"===r?(t.defineParams&&o.replace(t.defineParams,function(e,t,r){n[a]={arg:t,text:r}}),a in n||(n[a]=o)):new Function("def","def['"+a+"']="+o)(n)),""}).replace(t.use||i,function(a,r){t.useParams&&(r=r.replace(t.useParams,function(e,t,a,r){if(n[a]&&n[a].arg&&r)return e=(a+":"+r).replace(/'|\\/g,"_"),n.__exp=n.__exp||{},n.__exp[e]=n[a].text.replace(new RegExp("(^|[^\\w$])"+n[a].arg+"([^\\w$])","g"),"$1"+r+"$2"),t+"def.__exp['"+e+"']"}));var o=new Function("def","return "+r)(n);return o?e(t,o,n):o})}function t(e){return e.replace(/\\('|\\)/g,"$1").replace(/[\r\t\n]/g," ")}var a,n={version:"1.0.3",templateSettings:{evaluate:/\{\{([\s\S]+?(\}?)+)\}\}/g,interpolate:/\{\{=([\s\S]+?)\}\}/g,encode:/\{\{!([\s\S]+?)\}\}/g,use:/\{\{#([\s\S]+?)\}\}/g,useParams:/(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,define:/\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,defineParams:/^\s*([\w$]+):([\s\S]+)/,conditional:/\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,iterate:/\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,varname:"it",strip:!0,append:!0,selfcontained:!1,doNotSkipEncoded:!1},template:void 0,compile:void 0};n.encodeHTMLSource=function(e){var t={"&":"&#38;","<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","/":"&#47;"},a=e?/[&<>"'\/]/g:/&(?!#?\w+;)|<|>|"|'|\//g;return function(e){return e?e.toString().replace(a,function(e){return t[e]||e}):""}},a=function(){return this||(0,eval)("this")}(),void 0!==module&&module.exports?module.exports=n:"function"==typeof define&&define.amd?define(function(){return n}):a.doT=n;var r={start:"'+(",end:")+'",startencode:"'+encodeHTML("},o={start:"';out+=(",end:");out+='",startencode:"';out+=encodeHTML("},i=/$^/;n.template=function(s,l,u){l=l||n.templateSettings;var p,c,d=l.append?r:o,g=0;s=l.use||l.define?e(l,s,u||{}):s,s=("var out='"+(l.strip?s.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""):s).replace(/'|\\/g,"\\$&").replace(l.interpolate||i,function(e,a){return d.start+t(a)+d.end}).replace(l.encode||i,function(e,a){return p=!0,d.startencode+t(a)+d.end}).replace(l.conditional||i,function(e,a,n){return a?n?"';}else if("+t(n)+"){out+='":"';}else{out+='":n?"';if("+t(n)+"){out+='":"';}out+='"}).replace(l.iterate||i,function(e,a,n,r){return a?(g+=1,c=r||"i"+g,a=t(a),"';var arr"+g+"="+a+";if(arr"+g+"){var "+n+","+c+"=-1,l"+g+"=arr"+g+".length-1;while("+c+"<l"+g+"){"+n+"=arr"+g+"["+c+"+=1];out+='"):"';} } out+='"}).replace(l.evaluate||i,function(e,a){return"';"+t(a)+"out+='"})+"';return out;").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/\r/g,"\\r").replace(/(\s|;|\}|^|\{)out\+='';/g,"$1").replace(/\+''/g,""),p&&(l.selfcontained||!a||a._encodeHTML||(a._encodeHTML=n.encodeHTMLSource(l.doNotSkipEncoded)),s="var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("+n.encodeHTMLSource.toString()+"("+(l.doNotSkipEncoded||"")+"));"+s);try{return new Function(l.varname,s)}catch(e){throw"undefined"!=typeof console&&console.log("Could not create a template function: "+s),e}},n.compile=function(e,t){return n.template(e,null,t)},module.exports=n}),define("mod/tools",[],function(require){var e={getQueryValue:function(e){var t=location.search,a=new Array;if(t.length>1){var n=t.indexOf("?");t=t.substring(n+1,t.length)}else t=null;if(t)for(var r=0;r<t.split("&").length;r++)a[r]=t.split("&")[r];for(var o=0;o<a.length;o++)if(a[o].split("=")[0]==e)return decodeURI(a[o].split("=")[1]);return""},uid:function(){return this.getQueryValue("uid")||"null"},auth_token:function(){return this.getQueryValue("auth_token")||"null"},alertDialog:function(e,t){var a={title:null,text:null,img:null,time:3e3};for(var n in a)e[n]=e[n]||a[n];var r="tips"+(new Date).getTime(),o='<div id="'+r+'" class="ui-popup-screen km-dialog"><div class="ui-overlay-shadow km-popup">';e.time<1&&(o+='<i class="iconfont icon-close" id="close"></i>'),o+='<div class="content">',null!=e.title&&""!=e.title&&(o+="<h1>"+e.title+"</h1>"),null!=e.text&&""!=e.text&&(o+="<p>"+e.text+"</p>"),null!=e.img&&""!=e.img&&(o+='<div class="pic"><img src="'+e.img+'"/></div>'),o+="</div> </div> </div>";var i=$(o).appendTo("body"),s=$("#"+r+" .km-popup").height(),l=$(window).height(),u=(l-s)/2;if($("#"+r+" .km-popup").css("top",u),i.addClass("show-dialog"),$("#close").click(function(){$("#"+r).remove(),$.isFunction(t)&&t()}),e.time>0){var p=e.time;setTimeout(function(){$("#"+r).remove(),$.isFunction(t)&&t()},p)}}};window.Tools=e}),function(){"use strict";function e(n){var r="laypagecss";e.dir="dir"in e?e.dir:o.getpath+"../css/skin/laypage.css",new o(n),e.dir&&!t[a](r)&&o.use(e.dir,r)}e.v="1.3";var t=document,a="getElementById",n="getElementsByTagName",r=0,o=function(e){var t=this;(t.config=e||{}).item=r++,t.render(!0)};o.on=function(e,t,a){return e.attachEvent?e.attachEvent("on"+t,function(){a.call(e,window.even)}):e.addEventListener(t,a,!1),o},o.getpath=function(){var e=document.scripts,t=e[e.length-1].src;return t.substring(0,t.lastIndexOf("/")+1)}(),o.use=function(e,t){},o.prototype.type=function(){var e=this.config;return"object"==typeof e.cont?void 0===e.cont.length?2:3:void 0},o.prototype.view=function(){var t=this,a=t.config,n=[],r={};if(a.pages=0|a.pages,a.curr=0|a.curr||1,a.groups="groups"in a?0|a.groups:5,a.first="first"in a?a.first:"&#x9996;&#x9875;",a.last="last"in a?a.last:"&#x5C3E;&#x9875;",a.prev="prev"in a?a.prev:"&#x4E0A;&#x4E00;&#x9875;",a.next="next"in a?a.next:"&#x4E0B;&#x4E00;&#x9875;",a.pages<=1)return"";for(a.groups>a.pages&&(a.groups=a.pages),r.index=Math.ceil((a.curr+(a.groups>1&&a.groups!==a.pages?1:0))/(0===a.groups?1:a.groups)),a.curr>1&&a.prev&&n.push('<a href="javascript:;" class="laypage_prev" data-page="'+(a.curr-1)+'">'+a.prev+"</a>"),r.index>1&&a.first&&0!==a.groups&&n.push('<a href="javascript:;" class="laypage_first" data-page="1"  title="&#x9996;&#x9875;">'+a.first+"</a><span>&#x2026;</span>"),r.poor=Math.floor((a.groups-1)/2),r.start=r.index>1?a.curr-r.poor:1,r.end=r.index>1?function(){var e=a.curr+(a.groups-r.poor-1);return e>a.pages?a.pages:e}():a.groups,r.end-r.start<a.groups-1&&(r.start=r.end-a.groups+1);r.start<=r.end;r.start++)r.start===a.curr?n.push('<span class="laypage_curr" '+(/^#/.test(a.skin)?'style="background-color:'+a.skin+'"':"")+">"+r.start+"</span>"):n.push('<a href="javascript:;" data-page="'+r.start+'">'+r.start+"</a>");return a.pages>a.groups&&r.end<a.pages&&a.last&&0!==a.groups&&n.push('<span>&#x2026;</span><a href="javascript:;" class="laypage_last" title="&#x5C3E;&#x9875;"  data-page="'+a.pages+'">'+a.last+"</a>"),r.flow=!a.prev&&0===a.groups,(a.curr!==a.pages&&a.next||r.flow)&&n.push(function(){return r.flow&&a.curr===a.pages?'<span class="page_nomore" title="&#x5DF2;&#x6CA1;&#x6709;&#x66F4;&#x591A;">'+a.next+"</span>":'<a href="javascript:;" class="laypage_next" data-page="'+(a.curr+1)+'">'+a.next+"</a>"}()),'<div name="laypage'+e.v+'" class="laypage_main laypageskin_'+(a.skin?function(e){return/^#/.test(e)?"molv":e}(a.skin):"default")+'" id="laypage_'+t.config.item+'">'+n.join("")+function(){return a.skip?'<span class="laypage_total"><label>&#x5230;&#x7B2C;</label><input type="number" min="1" onkeyup="this.value=this.value.replace(/\\D/, \'\');" class="laypage_skip"><label>&#x9875;</label><button type="button" class="laypage_btn">&#x786e;&#x5b9a;</button></span>':""}()+"</div>"},o.prototype.jump=function(e){if(e){for(var t=this,a=t.config,r=e.children,i=e[n]("button")[0],s=e[n]("input")[0],l=0,u=r.length;u>l;l++)"a"===r[l].nodeName.toLowerCase()&&o.on(r[l],"click",function(){var e=0|this.getAttribute("data-page");a.curr=e,t.render()});i&&o.on(i,"click",function(){var e=0|s.value.replace(/\s|\D/g,"");e&&e<=a.pages&&(a.curr=e,t.render())})}},o.prototype.render=function(e){var n=this,r=n.config,o=n.type(),i=n.view();2===o?r.cont.innerHTML=i:3===o?r.cont.html(i):t[a](r.cont).innerHTML=i,r.jump&&r.jump(r,e),n.jump(t[a]("laypage_"+r.item)),r.hash&&!e&&(location.hash="!"+r.hash+"="+r.curr)},"function"==typeof define?define("plugs/laypage",[],function(){return e}):"undefined"!=typeof exports?module.exports=e:window.laypage=e}();