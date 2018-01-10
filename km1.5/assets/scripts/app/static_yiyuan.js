define('app/yiyuan', function(require, exports, module) {
	var Ajax = require('../mod/base');
    var km =  require('../plugs/version.js');

    document.getElementById('share').addEventListener("click", function(){
        _hmt.push(['_trackEvent', 'yiyuan0111', 'click', 'share']);
    })
    document.getElementById('tixian').addEventListener("click", function(){
        _hmt.push(['_trackEvent', 'yiyuan0111', 'click', 'tixian']);
    });

    if(km.isKM){
        $('#share').parent().removeClass('hide');
        $('#share').on('click',function(){
            var mylink = location.href;
            var share_kmb = 'kmb://share?param={"shareurl":"'+mylink+'","desc":"一元就能提现"}';
            if (!km.less('1.5.5')) {
                share_kmb = 'kmb://share?param={"shareurl":"'+mylink+'","desc":"低门槛，高效率，就是牛","title":"一元就能提现","icon":"http://static.etouch.cn/imgs/upload/1515568992.2714.jpg"}';
            };
            window.location = share_kmb;
        });
        $('#tixian').on('click',function(){
            window.location = 'kmb://openduiba';
        })
    }else{
        $('#share').parent().addClass('single').removeClass('hide');
        $('#tixian').on('click',function(){
            window.location = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser';
        })
    }

});