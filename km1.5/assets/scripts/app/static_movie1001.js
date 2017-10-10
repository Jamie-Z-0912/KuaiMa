define('app/movie1001', function(require, exports, module) {
	var Ajax = require('../mod/base');
    var km =  require('../plugs/version.js');
    var confirmTip = require('../plugs/confirmTip.js');

    function updateApp(){
        new confirmTip({
            text: '<p style="color:#333;">升级到最新版本，共享海量资源，收益更多多</p>',
            sureTxt: '马上更新',
            cancelTxt: '我知道了'
        },function(a){
            if(a){
                window.location = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser'
            }
        });
    }
    function loadData(date){
        Ajax.custom({
            url:'api/v1/aggregation/list',
            data:{
                actId:'7',
                needDetails:1,
                date: date||''
            }
        }, function(data){
            console.log(data);
            Ajax.render('#content', '#content-tmpl', data, undefined, true);
            if(!km.isKM){
                seajs.use('https://static.mlinks.cc/scripts/dist/mlink.min.js', function(){
                    if(data.status == 1020){
                        var options = new Object();
                        options["mlink"] = 'https://ax9wdh.mlinks.cc/AaBW';
                        options["button"] = document.querySelectorAll("a#go");
                        options["params"] = {};
                        new Mlink(options);
                    }
                    if(data.status == 1000){
                        var linkLength = $('#content .con_list li').length;
                        for (var i = 0; i < linkLength; i++) {
                            var id = '#resouse_' + i;
                            var options = new Object();
                            options["mlink"] = 'https://ax9wdh.mlinks.cc/AaBW';
                            options["button"] = document.querySelectorAll('a'+id);
                            options["params"] = {};
                            new Mlink(options);
                        }
                    }
                })
            }
        });
    }
    var date = Tools.getQueryValue('date');
    if(date !='' && date.length==8 && /^[0-9]+$/.test(date)){
        loadData(date);
    }else{
        loadData();
    }
    var isPC = function(){
        var userAgentInfo = navigator.userAgent;  
        var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
        var flag = true;  
        for (var v = 0; v < Agents.length; v++) {  
            if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }  
        }  
        return flag; 
    };
    clicktype = isPC()?'click':'touchstart';
    $('#content').on(clicktype, '#tuijian, #next, #prev', function(){
        var date = $(this).data('id');
        loadData(date);
    });
    if(km.isKM){
        $('body').on('click','#go', function(){
            if(km.less('1.4.0')){
                updateApp();
            }else{
                window.location = 'kmb://worthreadingtab';
            }
        })
        $('#content').on('click', '.btn', function(){
            if(km.less('1.4.0')){
                updateApp();
            }else{
                window.location = 'kmb://worthreadingresource?id='+$(this).data('id');
            }
        });
        $('#fenxiang').on('click', function(){
            var link = location.href;
            window.location = 'kmb://share?param={"shareurl":"'+ link +'","desc":"8天放假，大片放送，旅途宅家，快马相伴~"}';
        })
    }else{
        $('#fenxiang').remove();
    }
    /********** wei xin *************/
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
        window.shareData = {
            "link": location.href,
            "title": "十一电影分享",
            "desc": "8天放假，大片放送，旅途宅家，快马相伴~",
        };
        // 发送给好友
        WeixinJSBridge.on('menu:share:appmessage', function (argv) {
            WeixinJSBridge.invoke('sendAppMessage', {
                "img_url": "img/logo_white.png",
                "img_width": "401",
                "img_height": "275",
                "link": window.shareData.link,
                "desc": window.shareData.desc,
                "title": window.shareData.title
            }, function (res) {
                _report('send_msg', res.err_msg);
            })
        });
        // 分享到朋友圈
        WeixinJSBridge.on('menu:share:timeline', function (argv) {
            WeixinJSBridge.invoke('shareTimeline', {
                "img_url": "img/logo_white.png",
                "img_width": "401",
                "img_height": "275",
                "link": window.shareData.link,
                "desc": window.shareData.desc,
                "title": window.shareData.title
            }, function (res) {
                _report('timeline', res.err_msg);
            });
        });
 
    }, false)
});