define("app/startgather",["../mod/submit","../plugs/confirmTip.js"],function(require,exports,module){var e=require("../mod/submit"),t=require("../plugs/confirmTip.js");Ajax.custom({url:"api/v1/post/checkAuthority"},function(e){1e3==e.status&&$("#opengather .answer").html('您已拥有值得看模块采集权限啦，更多问题请加<a target="_blank" href="//shang.qq.com/wpa/qunwpa?idkey=673978716695c4178e1fdabf1d0a395d6e4f48cd5b2a1e1e9871d9778405a562">小报用户qq群：347382327</a>'),9706==e.status&&$("#opengather .answer").html('您已提交申请，请耐心等待，咨询加<a target="_blank" href="//shang.qq.com/wpa/qunwpa?idkey=673978716695c4178e1fdabf1d0a395d6e4f48cd5b2a1e1e9871d9778405a562">小报用户qq群：347382327</a>'),9707==e.status&&$("#opengather .answer").html("登录后才可以申请哦~")}),$("#qustionList").on("click","li",function(){var e=$(this);e.hasClass("active")||e.addClass("active").siblings().removeClass("active")});var n=[],a=[];$.each($("#applyfor dt"),function(){n.push($(this).find("span").text()),a.push(" ")}),$("#applyfor").on("click",".dd",function(){var e=$(this);if(!e.hasClass("selected")){e.addClass("selected").siblings().removeClass("selected");var t=e.parent().data("id");a[t]=e.text().replace("<i></i>","")}}),$("#gatherForm").submit(function(i){i.preventDefault();for(var o=!0,r=0;r<a.length;r++)if(" "==a[r]){Tools.alertDialog({text:"第"+(r+1)+"题还没有回答！"}),o=!1;break}if(o){for(var s="",r=0;r<n.length;r++)s+=n[r]+":"+a[r]+";";$('input[name="question"]').val(s),e.fun({url:"api/v1/zhdk/initialUsers",data:$(this)},function(e){1e3==e.status?($("#opengather .answer").html('您已提交申请，请耐心等待，咨询加<a target="_blank" href="//shang.qq.com/wpa/qunwpa?idkey=673978716695c4178e1fdabf1d0a395d6e4f48cd5b2a1e1e9871d9778405a562">小报用户qq群：347382327</a>'),new t({title:"提交成功",text:'<p style="padding:0 .16rem;text-align:left;margin-bottom:-.14rem">申请审核进度查询，请加客服QQ：2518437090。</p>',sureTxt:"去加QQ",cancelTxt:"我知道了"},function(e){window.location=e?"//shang.qq.com/wpa/qunwpa?idkey=673978716695c4178e1fdabf1d0a395d6e4f48cd5b2a1e1e9871d9778405a562":"kmb://worthreadingtab"})):Tools.alertDialog({text:e.desc})})}})}),define("mod/submit",["./base"],function(require,exports,module){var e=require("./base");window.Ajax=e,String.prototype.isEmail=function(){return new RegExp(/^([a-zA-Z0-9]+[_|\_|\.|-]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/).test(this)},String.prototype.isMobile=function(){return new RegExp(/^1[3|4|5|7|8]\d{9}$/).test(this)},String.prototype.isChinese=function(){return/^[\u4E00-\uFA29]*$/.test(this)&&!/^[\uE7C7-\uE7F3]*$/.test(this)},String.prototype.isEmpty=function(){return/^\s*$/.test(this)},String.prototype.isVerifyCode=function(){return new RegExp(/^\d*$/).test(this)},String.prototype.isNum=function(){return/^[0-9]+$/.test(this)},exports.fun=function(t,n){var a,i,o="string"!=typeof t.data&&!!t.data.length;o?(a=t.data.serializeArray(),i=t.data.find('[type="submit"]'),i.attr("disabled",!0)):a=t.data,$.each(a,function(){this.value=this.value.replace(/\s/gi,"")}),t.data=a,t.type=t.type||"GET",t.logtype="submit",e.baseAjax(t,function(e,t,a){o&&i.removeAttr("disabled"),"function"==typeof n&&n(e)},function(e,t,n){console.log(e.statusText),o&&i.removeAttr("disabled"),"function"==typeof callbackError&&callbackError(e,t,n)})},exports.sendSms=function(t,n){var a={phone:"",uid:"",type:"SMS",useto:""};for(var i in a)a[i]=n[i]||a[i];var o,r=60;o&&clearInterval(o),t.addClass("disabled").text("发送中···"),e.custom({url:"api/v1/verify_code/web",data:a},function(e){return 1e3==e.status?void(o=setInterval(function(){if(0==--r)return clearInterval(o),void t.removeClass("disabled").text("重发验证码");t.text("还剩"+r+"秒")},1e3)):2003==e.status?void Tools.alertDialog({title:"获取失败",text:"获取验证码太频繁，请明日再试"},function(){t.text("明日再获取")}):1008==e.status?void Tools.alertDialog({text:"您已经注册过啦"}):2002==e.status?void Tools.alertDialog({text:"用户不存在"}):void 0})}}),define("mod/base",["zepto","../plugs/doT.min","./tools"],function(require,exports,module){function e(e,t){var n=e,a={"M+":n.getMonth()+1,"d+":n.getDate(),"h+":n.getHours(),"m+":n.getMinutes(),"s+":n.getSeconds(),"q+":Math.floor((n.getMonth()+3)/3),S:n.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(n.getFullYear()+"").substr(4-RegExp.$1.length)));for(var i in a)new RegExp("("+i+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?a[i]:("00"+a[i]).substr((""+a[i]).length)));return t}function t(e){var t,n=function(){};if(!e.status)return void Tools.alertDialog({title:"提醒",text:"系统错误，请稍后重试！"});switch(e.status){case 1101:t={title:"提醒",text:"请打开设置->通用->日期与时间校准您的系统时间"};break;case 1004:t={title:"提醒",text:"请在快马小报中登录再访问！"};break;case 1002:t={title:"提醒",text:"请在快马小报中访问！"};break;case 1006:var a=5;t={title:"提醒",text:"访问太过频繁，<span id='closeTimer'>"+a+"</span>s后自动刷新"};var i=setInterval(function(){a--,a<1&&(clearInterval(i),window.location.reload()),$("#closeTimer").text(a)},1e3);break;default:return t=null,!0}return null!=t?(Tools.alertDialog(t,n),!1):void 0}var $=require("zepto");var n=require("../plugs/doT.min"),a={key:"26817749",km_api:server+"km_task/"};require("./tools"),module.exports={formatDate:function(t,n){var a=n||"yyyy-MM-dd hh:mm";if(isNaN(t)||null==t)return t;if("object"==typeof t){var i=dd.getFullYear(),o=dd.getMonth()+1,r=dd.getDate();o<10&&(o="0"+o);var s=i+"-"+o+"-"+r,l=s.match(/(\d+)/g),u=new Date(l[0],l[1]-1,l[2]);return e(u,a)}var u=new Date(parseInt(t));return e(u,a)},baseAjax:function(e,n){var i={name:"app_key",value:a.key};e.showLoading&&(0==$(".ui-loading-block").length?$("body").append('<div class="ui-loading-block km-dialog show"><div class="ui-loading-cnt"><i class="ui-loading-bright"></i><p>加载中……</p></div></div>'):$(".ui-loading-block").addClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).hide()),e.data||(e.data={}),$.isFunction(e.data.push)?e.data.push(i):e.data.app_key=a.key,$.isFunction(e.data.push)?e.data.push({name:"auth_token",value:Tools.auth_token()}):e.data.auth_token=Tools.auth_token(),$.ajax({url:a.km_api+e.url,data:e.data,type:"GET",dataType:"jsonp",xhrFields:{withCredentials:!0},jsonpCallback:"jsonp"+Math.ceil(1e3*Math.random()),success:function(a){e.showLoading&&($(".ui-loading-block").removeClass("show"),"paging"==e.logtype&&0!=e.data.skip||$(e.renderEle).show()),t(a)&&n(a)},error:function(t,n,a){console.log(t),e.showLoading&&$(".ui-loading-block").removeClass("show"),"paging"!=e.logtype&&$(e.renderEle).show()}})},render:function(e,t,a,i,o){if($(t).length>0&&a){var r=i||void 0,s=$(t).text(),l=n.template(s,void 0,r);o?$(e).html(l(a)):$(e).append(l(a))}},custom:function(e,t){var n=this;e=e||{},e.logtype="custom",n.baseAjax(e,t)}}}),define("plugs/doT.min",[],function(require,exports,module){function e(t,n,a){return("string"==typeof n?n:n.toString()).replace(t.define||r,function(e,n,i,o){return 0===n.indexOf("def.")&&(n=n.substring(4)),n in a||(":"===i?(t.defineParams&&o.replace(t.defineParams,function(e,t,i){a[n]={arg:t,text:i}}),n in a||(a[n]=o)):new Function("def","def['"+n+"']="+o)(a)),""}).replace(t.use||r,function(n,i){t.useParams&&(i=i.replace(t.useParams,function(e,t,n,i){if(a[n]&&a[n].arg&&i)return e=(n+":"+i).replace(/'|\\/g,"_"),a.__exp=a.__exp||{},a.__exp[e]=a[n].text.replace(new RegExp("(^|[^\\w$])"+a[n].arg+"([^\\w$])","g"),"$1"+i+"$2"),t+"def.__exp['"+e+"']"}));var o=new Function("def","return "+i)(a);return o?e(t,o,a):o})}function t(e){return e.replace(/\\('|\\)/g,"$1").replace(/[\r\t\n]/g," ")}var n,a={version:"1.0.3",templateSettings:{evaluate:/\{\{([\s\S]+?(\}?)+)\}\}/g,interpolate:/\{\{=([\s\S]+?)\}\}/g,encode:/\{\{!([\s\S]+?)\}\}/g,use:/\{\{#([\s\S]+?)\}\}/g,useParams:/(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,define:/\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,defineParams:/^\s*([\w$]+):([\s\S]+)/,conditional:/\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,iterate:/\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,varname:"it",strip:!0,append:!0,selfcontained:!1,doNotSkipEncoded:!1},template:void 0,compile:void 0};a.encodeHTMLSource=function(e){var t={"&":"&#38;","<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","/":"&#47;"},n=e?/[&<>"'\/]/g:/&(?!#?\w+;)|<|>|"|'|\//g;return function(e){return e?e.toString().replace(n,function(e){return t[e]||e}):""}},n=function(){return this||(0,eval)("this")}(),void 0!==module&&module.exports?module.exports=a:"function"==typeof define&&define.amd?define(function(){return a}):n.doT=a;var i={start:"'+(",end:")+'",startencode:"'+encodeHTML("},o={start:"';out+=(",end:");out+='",startencode:"';out+=encodeHTML("},r=/$^/;a.template=function(s,l,u){l=l||a.templateSettings;var d,c,p=l.append?i:o,f=0;s=l.use||l.define?e(l,s,u||{}):s,s=("var out='"+(l.strip?s.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""):s).replace(/'|\\/g,"\\$&").replace(l.interpolate||r,function(e,n){return p.start+t(n)+p.end}).replace(l.encode||r,function(e,n){return d=!0,p.startencode+t(n)+p.end}).replace(l.conditional||r,function(e,n,a){return n?a?"';}else if("+t(a)+"){out+='":"';}else{out+='":a?"';if("+t(a)+"){out+='":"';}out+='"}).replace(l.iterate||r,function(e,n,a,i){return n?(f+=1,c=i||"i"+f,n=t(n),"';var arr"+f+"="+n+";if(arr"+f+"){var "+a+","+c+"=-1,l"+f+"=arr"+f+".length-1;while("+c+"<l"+f+"){"+a+"=arr"+f+"["+c+"+=1];out+='"):"';} } out+='"}).replace(l.evaluate||r,function(e,n){return"';"+t(n)+"out+='"})+"';return out;").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/\r/g,"\\r").replace(/(\s|;|\}|^|\{)out\+='';/g,"$1").replace(/\+''/g,""),d&&(l.selfcontained||!n||n._encodeHTML||(n._encodeHTML=a.encodeHTMLSource(l.doNotSkipEncoded)),s="var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("+a.encodeHTMLSource.toString()+"("+(l.doNotSkipEncoded||"")+"));"+s);try{return new Function(l.varname,s)}catch(e){throw"undefined"!=typeof console&&console.log("Could not create a template function: "+s),e}},a.compile=function(e,t){return a.template(e,null,t)},module.exports=a}),define("mod/tools",[],function(require){var e={getQueryValue:function(e){var t=location.search,n=new Array;if(t.length>1){var a=t.indexOf("?");t=t.substring(a+1,t.length)}else t=null;if(t)for(var i=0;i<t.split("&").length;i++)n[i]=t.split("&")[i];for(var o=0;o<n.length;o++)if(n[o].split("=")[0]==e)return decodeURI(n[o].split("=")[1]);return""},uid:function(){return this.getQueryValue("uid")||"null"},auth_token:function(){return this.getQueryValue("auth_token")||"null"},alertDialog:function(e,t){var n={title:null,text:null,img:null,time:3e3};for(var a in n)e[a]=e[a]||n[a];var i="tips"+(new Date).getTime(),o='<div id="'+i+'" class="ui-popup-screen km-dialog"><div class="ui-overlay-shadow km-popup">';e.time<1&&(o+='<i class="iconfont icon-close" id="close"></i>'),o+='<div class="content">',null!=e.title&&""!=e.title&&(o+="<h1>"+e.title+"</h1>"),null!=e.text&&""!=e.text&&(o+="<p>"+e.text+"</p>"),null!=e.img&&""!=e.img&&(o+='<div class="pic"><img src="'+e.img+'"/></div>'),o+="</div> </div> </div>";var r=$(o).appendTo("body"),s=$("#"+i+" .km-popup").height(),l=$(window).height(),u=(l-s)/2;if($("#"+i+" .km-popup").css("top",u),r.addClass("show-dialog"),$("#close").click(function(){$("#"+i).remove(),$.isFunction(t)&&t()}),e.time>0){var d=e.time;setTimeout(function(){$("#"+i).remove(),$.isFunction(t)&&t()},d)}}};window.Tools=e}),define("plugs/confirmTip",[],function(require,exports,module){var e=function(e,t){var n={title:"",text:"",sureTxt:"确定",cancelTxt:"取消"};this.option={};for(var a in n)this.option[a]=e[a]||n[a];this.id="pop_"+(new Date).getTime(),this.init(t)};e.prototype.init=function(e){var t=this,n=t.option,a=[],i=t.id;a.push('<div class="pop-mask km-dialog"></div>'),a.push('<div class="pop-screen km-dialog" id="'+i+'">'),a.push('<div class="box">'),""!=n.title&&a.push("<h2>"+n.title+"</h2>"),""!=n.text&&a.push('<div class="text">'+n.text+"</div>"),a.push('<div class="btnbox"><a class="cancelBtn">'+n.cancelTxt+'</a><a class="sureBtn">'+n.sureTxt+"</a></div>"),a.push("</div></div>"),$("body").append(a.join("")),$("#"+i).height($("#"+i+" .box").height()),$("#"+i+" .sureBtn").click(function(){$("#"+i).prev().remove(),$("#"+i).remove(),$.isFunction(e)&&e(!0)}),$("#"+i+" .cancelBtn").click(function(){$("#"+i).prev().remove(),$("#"+i).remove(),$.isFunction(e)&&e(!1)})},module.exports=e});