define('app/school_xiaoma', function(require, exports, module) {
    var Ajax = require('../mod/base');
    var SecondPage = require('../plugs/secondPage.js');
    var km =  require('../plugs/version.js');
    var confirmTip = require('../plugs/confirmTip.js');
    
    var swiper = new Swiper('.swiper-container', {
        hashNavigation: { watchState: true },
        pagination: { el: '.swiper-pagination', clickable: true}
    });

    var openWXPage = new SecondPage('#openWX');
    $('#business').on('click', function(){
        var qq = '快马小报';
        if(/Android/.test(navigator.userAgent) && km.less('1.2.3')){
            $('#openWX h2').html('长按 <a style="color:#fa0">快马小报</a> 复制')
        }else{
            window.location = 'kmb://QQ='+encodeURIComponent(qq);
        }
        openWXPage.openSidebar();
        return false;
    });
    $('#sidebar-bg').on('touchstart', function(){
        openWXPage.closeSidebar();
        return false;
    });

    function updateApp(type){
        var txt = '升级到最新版本，更多任务要你收益涨涨涨！';
        new confirmTip({
            text: '<p style="color:#333;padding-left:.15rem;padding-right:.15rem;">'+txt+'</p>',
            sureTxt: '马上更新',
            cancelTxt: '我知道了'
        },function(a){
            if(a){
                window.location = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser'
            }
        });
    }

    $('.p_alipay').on('click', function(){
        window.location = 'kmb://bindalipay';
    });
    $('.p_tixian').on('click', function(){
        window.location = 'kmb://openduiba';
    });
    $('.p_caiji').on('click', function(){
        if(km.less('1.4.0')){
            updateApp();
        }else{
            window.location = 'kmb://worthreadingtab';
        }
    });
    $('.p_jinbi').on('click', function(){
        if(km.less('1.5.5')){
            updateApp();
        }else{
            window.location = 'kmb://myincome';
        }
    })
    $('.p_hongbao').on('click', function(){
        window.location = 'kmb://mine';
    })
    $('.p_tuandui').on('click', function(){
        if(km.less('1.5.0')){
            updateApp();
        }else{
            window.location = 'kmb://team_myself';
        }
    })
    $('.p_tuisong').on('click', function(){
        Tools.alertDialog({
            text: '等待快马小报的推送吧~每天都有很多次的哦~',
            time: '0'
        })
    })
    $('.p_qiandao').on('click', function(){
        if(km.less('1.5.5')){
            updateApp();
        }else{
            window.location = 'kmb://taskcenter';
        }
    })
    $('.p_zhuanfa').on('click', function(){
        window.location = 'kmb://mine';
    })
    $('.p_sousuo').on('click', function(){
        if(km.less('1.3.2')){
            updateApp();
        }else{
            window.location = 'kmb://hotsearch';
        }
    })
    $('.p_yuedu').on('click', function(){
        var w = ['3468884','3480962','3471953','3478140','3465790','3484966','3469260','3484989','3483847','3472143'];
        var cur = parseInt(w.length*Math.random());
        window.location = 'kmb://recommend?url=http://news.zhwnl.cn/article2.html?id='+w[cur]+'&id='+w[cur];  
    })

});