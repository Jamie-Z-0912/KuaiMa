define("app/static_adList",["../mod/pagelist"],function(require,exports,module){require("../mod/pagelist").fun({url:"api/v1/top_news",data:{page:1,page_size:20}},function(){var e=.3*$(".view_3 .imgbox").width();$(".view_3 .imgbox").height(74*e/113)},!0),$("#conList").on("click","li",function(){var e=$(this).data("url");window.location.href=e})}),define("mod/pagelist",["./base","../plugs/laypage"],function(require,exports,module){var e=require("./base"),t=require("../plugs/laypage");window.Ajax=e,exports.defaultListTmpl="#conList-tmpl",exports.defaultListEle="#conList",exports.pagingDom="#listPage",exports.fun=function(n,a,r){var o=(n.data.page,{renderFor:this.defaultListTmpl,renderEle:this.defaultListEle,pagingDom:this.pagingDom,showLoading:!0,hasNext:!0,logtype:"paging"});for(var i in o)n[i]=n[i]||o[i];t({cont:$(n.pagingDom),pages:100,groups:0,curr:1,prev:!1,next:"点击查看更多",skin:"flow",jump:function(t){var o=this;n.data.page=t.curr,e.baseAjax(n,function(i){1020==i.status?(i.data=null,e.render(n.renderEle,n.renderFor,i,void 0,!0),$(n.pagingDom).remove()):(o.pages=i.total,t.curr==i.total&&(n.hasNext=!1,$(n.pagingDom).find(".laypage_main").html("<span>没有更多数据</span>")),$.each(i.data,function(){this.added_time=e.formatDate(this.added_time)}),r||$.isFunction(a)&&a(i),1!=i.page?e.render(n.renderEle,n.renderFor,i,void 0,!1):e.render(n.renderEle,n.renderFor,i,void 0,!0),r&&$.isFunction(a)&&a(),$(n.pagingDom).removeClass("hide"))},function(e,t,n){"function"==typeof callbackError&&callbackError(e,t,n)})}}),window.onscroll=function(){if(n.hasNext){var e=document.body.scrollTop,t=document.body.scrollHeight;e+window.screen.height*window.devicePixelRatio+100>t&&$("#laypage_0 a").click()}}}}),define("mod/base",["zepto","../plugs/doT.min","./tools"],function(require,exports,module){function e(e,t){var n=e,a={"M+":n.getMonth()+1,"d+":n.getDate(),"h+":n.getHours(),"m+":n.getMinutes(),"s+":n.getSeconds(),"q+":Math.floor((n.getMonth()+3)/3),S:n.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(n.getFullYear()+"").substr(4-RegExp.$1.length)));for(var r in a)new RegExp("("+r+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?a[r]:("00"+a[r]).substr((""+a[r]).length)));return t}function t(e){var t,n=function(){};if(!e.status)return void Tools.alertDialog({title:"提醒",text:"系统错误，请稍后重试！"});switch(e.status){case 1101:t={title:"提醒",text:"请打开设置->通用->日期与时间校准您的系统时间"};break;case 1004:t={title:"提醒",text:"请在快马小报中登录再访问！"};break;case 1002:t={title:"提醒",text:"请在快马小报中访问！"};break;case 1006:var a=5;t={title:"提醒",text:"访问太过频繁，<span id='closeTimer'>"+a+"</span>s后自动刷新"};var r=setInterval(function(){a--,a<1&&(clearInterval(r),window.location.reload()),$("#closeTimer").text(a)},1e3);break;default:return t=null,!0}return null!=t?(Tools.alertDialog(t,n),!1):void 0}var $=require("zepto");var n=require("../plugs/doT.min"),a={key:"26817749",km_api:server+"km_task/"};require("./tools"),module.exports={formatDate:function(t,n){var a=n||"yyyy-MM-dd hh:mm";if(isNaN(t)||null==t)return t;if("object"==typeof t){var r=dd.getFullYear(),o=dd.getMonth()+1,i=dd.getDate();o<10&&(o="0"+o);var s=r+"-"+o+"-"+i,l=s.match(/(\d+)/g),u=new Date(l[0],l[1]-1,l[2]);return e(u,a)}var u=new Date(parseInt(t));return e(u,a)},baseAjax:function(e,n){var r={name:"app_key",value:a.key};e.showLoading&&(0==$(".ui-loading-block").length?$("body").append('<div class="ui-loading-block km-dialog show"><div class="ui-loading-cnt"><i class="ui-loading-bright"></i><p>加载中……</p></div></div>'):$(".ui-loading-block").addClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).hide()),e.data||(e.data={}),$.isFunction(e.data.push)?e.data.push(r):e.data.app_key=a.key,$.isFunction(e.data.push)?e.data.push({name:"auth_token",value:Tools.auth_token()}):e.data.auth_token=Tools.auth_token(),$.ajax({url:a.km_api+e.url,data:e.data,type:"GET",dataType:"jsonp",xhrFields:{withCredentials:!0},jsonpCallback:"jsonp"+Math.ceil(1e3*Math.random()),success:function(a){e.showLoading&&($(".ui-loading-block").removeClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).show()),t(a)&&n(a)},error:function(t,n,a){console.log(t),e.showLoading&&$(".ui-loading-block").removeClass("show"),"paging"!=e.logtype&&$(e.renderEle).show()}})},render:function(e,t,a,r,o){if($(t).length>0&&a){var i=r||void 0,s=$(t).text(),l=n.template(s,void 0,i);o?$(e).html(l(a)):$(e).append(l(a))}},custom:function(e,t){var n=this;e=e||{},e.logtype="custom",n.baseAjax(e,t)}}}),define("plugs/doT.min",[],function(require,exports,module){function e(t,n,a){return("string"==typeof n?n:n.toString()).replace(t.define||i,function(e,n,r,o){return 0===n.indexOf("def.")&&(n=n.substring(4)),n in a||(":"===r?(t.defineParams&&o.replace(t.defineParams,function(e,t,r){a[n]={arg:t,text:r}}),n in a||(a[n]=o)):new Function("def","def['"+n+"']="+o)(a)),""}).replace(t.use||i,function(n,r){t.useParams&&(r=r.replace(t.useParams,function(e,t,n,r){if(a[n]&&a[n].arg&&r)return e=(n+":"+r).replace(/'|\\/g,"_"),a.__exp=a.__exp||{},a.__exp[e]=a[n].text.replace(new RegExp("(^|[^\\w$])"+a[n].arg+"([^\\w$])","g"),"$1"+r+"$2"),t+"def.__exp['"+e+"']"}));var o=new Function("def","return "+r)(a);return o?e(t,o,a):o})}function t(e){return e.replace(/\\('|\\)/g,"$1").replace(/[\r\t\n]/g," ")}var n,a={version:"1.0.3",templateSettings:{evaluate:/\{\{([\s\S]+?(\}?)+)\}\}/g,interpolate:/\{\{=([\s\S]+?)\}\}/g,encode:/\{\{!([\s\S]+?)\}\}/g,use:/\{\{#([\s\S]+?)\}\}/g,useParams:/(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,define:/\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,defineParams:/^\s*([\w$]+):([\s\S]+)/,conditional:/\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,iterate:/\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,varname:"it",strip:!0,append:!0,selfcontained:!1,doNotSkipEncoded:!1},template:void 0,compile:void 0};a.encodeHTMLSource=function(e){var t={"&":"&#38;","<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","/":"&#47;"},n=e?/[&<>"'\/]/g:/&(?!#?\w+;)|<|>|"|'|\//g;return function(e){return e?e.toString().replace(n,function(e){return t[e]||e}):""}},n=function(){return this||(0,eval)("this")}(),void 0!==module&&module.exports?module.exports=a:"function"==typeof define&&define.amd?define(function(){return a}):n.doT=a;var r={start:"'+(",end:")+'",startencode:"'+encodeHTML("},o={start:"';out+=(",end:");out+='",startencode:"';out+=encodeHTML("},i=/$^/;a.template=function(s,l,u){l=l||a.templateSettings;var p,c,d=l.append?r:o,g=0;s=l.use||l.define?e(l,s,u||{}):s,s=("var out='"+(l.strip?s.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""):s).replace(/'|\\/g,"\\$&").replace(l.interpolate||i,function(e,n){return d.start+t(n)+d.end}).replace(l.encode||i,function(e,n){return p=!0,d.startencode+t(n)+d.end}).replace(l.conditional||i,function(e,n,a){return n?a?"';}else if("+t(a)+"){out+='":"';}else{out+='":a?"';if("+t(a)+"){out+='":"';}out+='"}).replace(l.iterate||i,function(e,n,a,r){return n?(g+=1,c=r||"i"+g,n=t(n),"';var arr"+g+"="+n+";if(arr"+g+"){var "+a+","+c+"=-1,l"+g+"=arr"+g+".length-1;while("+c+"<l"+g+"){"+a+"=arr"+g+"["+c+"+=1];out+='"):"';} } out+='"}).replace(l.evaluate||i,function(e,n){return"';"+t(n)+"out+='"})+"';return out;").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/\r/g,"\\r").replace(/(\s|;|\}|^|\{)out\+='';/g,"$1").replace(/\+''/g,""),p&&(l.selfcontained||!n||n._encodeHTML||(n._encodeHTML=a.encodeHTMLSource(l.doNotSkipEncoded)),s="var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("+a.encodeHTMLSource.toString()+"("+(l.doNotSkipEncoded||"")+"));"+s);try{return new Function(l.varname,s)}catch(e){throw"undefined"!=typeof console&&console.log("Could not create a template function: "+s),e}},a.compile=function(e,t){return a.template(e,null,t)},module.exports=a}),define("mod/tools",[],function(require){var e={getQueryValue:function(e){var t=location.search,n=new Array;if(t.length>1){var a=t.indexOf("?");t=t.substring(a+1,t.length)}else t=null;if(t)for(var r=0;r<t.split("&").length;r++)n[r]=t.split("&")[r];for(var o=0;o<n.length;o++)if(n[o].split("=")[0]==e)return decodeURI(n[o].split("=")[1]);return""},uid:function(){return this.getQueryValue("uid")||"null"},auth_token:function(){return this.getQueryValue("auth_token")||"null"},alertDialog:function(e,t){var n={title:null,text:null,img:null,time:3e3};for(var a in n)e[a]=e[a]||n[a];var r="tips"+(new Date).getTime(),o='<div id="'+r+'" class="ui-popup-screen km-dialog"><div class="ui-overlay-shadow km-popup">';e.time<1&&(o+='<i class="iconfont icon-close" id="close"></i>'),o+='<div class="content">',null!=e.title&&""!=e.title&&(o+="<h1>"+e.title+"</h1>"),null!=e.text&&""!=e.text&&(o+="<p>"+e.text+"</p>"),null!=e.img&&""!=e.img&&(o+='<div class="pic"><img src="'+e.img+'"/></div>'),o+="</div> </div> </div>";var i=$(o).appendTo("body"),s=$("#"+r+" .km-popup").height(),l=$(window).height(),u=(l-s)/2;if($("#"+r+" .km-popup").css("top",u),i.addClass("show-dialog"),$("#close").click(function(){$("#"+r).remove(),$.isFunction(t)&&t()}),e.time>0){var p=e.time;setTimeout(function(){$("#"+r).remove(),$.isFunction(t)&&t()},p)}}};window.Tools=e}),function(){"use strict";function e(a){var r="laypagecss";e.dir="dir"in e?e.dir:o.getpath+"../css/skin/laypage.css",new o(a),e.dir&&!t[n](r)&&o.use(e.dir,r)}e.v="1.3";var t=document,n="getElementById",a="getElementsByTagName",r=0,o=function(e){var t=this;(t.config=e||{}).item=r++,t.render(!0)};o.on=function(e,t,n){return e.attachEvent?e.attachEvent("on"+t,function(){n.call(e,window.even)}):e.addEventListener(t,n,!1),o},o.getpath=function(){var e=document.scripts,t=e[e.length-1].src;return t.substring(0,t.lastIndexOf("/")+1)}(),o.use=function(e,t){},o.prototype.type=function(){var e=this.config;return"object"==typeof e.cont?void 0===e.cont.length?2:3:void 0},o.prototype.view=function(){var t=this,n=t.config,a=[],r={};if(n.pages=0|n.pages,n.curr=0|n.curr||1,n.groups="groups"in n?0|n.groups:5,n.first="first"in n?n.first:"&#x9996;&#x9875;",n.last="last"in n?n.last:"&#x5C3E;&#x9875;",n.prev="prev"in n?n.prev:"&#x4E0A;&#x4E00;&#x9875;",n.next="next"in n?n.next:"&#x4E0B;&#x4E00;&#x9875;",n.pages<=1)return"";for(n.groups>n.pages&&(n.groups=n.pages),r.index=Math.ceil((n.curr+(n.groups>1&&n.groups!==n.pages?1:0))/(0===n.groups?1:n.groups)),n.curr>1&&n.prev&&a.push('<a href="javascript:;" class="laypage_prev" data-page="'+(n.curr-1)+'">'+n.prev+"</a>"),r.index>1&&n.first&&0!==n.groups&&a.push('<a href="javascript:;" class="laypage_first" data-page="1"  title="&#x9996;&#x9875;">'+n.first+"</a><span>&#x2026;</span>"),r.poor=Math.floor((n.groups-1)/2),r.start=r.index>1?n.curr-r.poor:1,r.end=r.index>1?function(){var e=n.curr+(n.groups-r.poor-1);return e>n.pages?n.pages:e}():n.groups,r.end-r.start<n.groups-1&&(r.start=r.end-n.groups+1);r.start<=r.end;r.start++)r.start===n.curr?a.push('<span class="laypage_curr" '+(/^#/.test(n.skin)?'style="background-color:'+n.skin+'"':"")+">"+r.start+"</span>"):a.push('<a href="javascript:;" data-page="'+r.start+'">'+r.start+"</a>");return n.pages>n.groups&&r.end<n.pages&&n.last&&0!==n.groups&&a.push('<span>&#x2026;</span><a href="javascript:;" class="laypage_last" title="&#x5C3E;&#x9875;"  data-page="'+n.pages+'">'+n.last+"</a>"),r.flow=!n.prev&&0===n.groups,(n.curr!==n.pages&&n.next||r.flow)&&a.push(function(){return r.flow&&n.curr===n.pages?'<span class="page_nomore" title="&#x5DF2;&#x6CA1;&#x6709;&#x66F4;&#x591A;">'+n.next+"</span>":'<a href="javascript:;" class="laypage_next" data-page="'+(n.curr+1)+'">'+n.next+"</a>"}()),'<div name="laypage'+e.v+'" class="laypage_main laypageskin_'+(n.skin?function(e){return/^#/.test(e)?"molv":e}(n.skin):"default")+'" id="laypage_'+t.config.item+'">'+a.join("")+function(){return n.skip?'<span class="laypage_total"><label>&#x5230;&#x7B2C;</label><input type="number" min="1" onkeyup="this.value=this.value.replace(/\\D/, \'\');" class="laypage_skip"><label>&#x9875;</label><button type="button" class="laypage_btn">&#x786e;&#x5b9a;</button></span>':""}()+"</div>"},o.prototype.jump=function(e){if(e){for(var t=this,n=t.config,r=e.children,i=e[a]("button")[0],s=e[a]("input")[0],l=0,u=r.length;u>l;l++)"a"===r[l].nodeName.toLowerCase()&&o.on(r[l],"click",function(){var e=0|this.getAttribute("data-page");n.curr=e,t.render()});i&&o.on(i,"click",function(){var e=0|s.value.replace(/\s|\D/g,"");e&&e<=n.pages&&(n.curr=e,t.render())})}},o.prototype.render=function(e){var a=this,r=a.config,o=a.type(),i=a.view();2===o?r.cont.innerHTML=i:3===o?r.cont.html(i):t[n](r.cont).innerHTML=i,r.jump&&r.jump(r,e),a.jump(t[n]("laypage_"+r.item)),r.hash&&!e&&(location.hash="!"+r.hash+"="+r.curr)},"function"==typeof define?define("plugs/laypage",[],function(){return e}):"undefined"!=typeof exports?module.exports=e:window.laypage=e}();