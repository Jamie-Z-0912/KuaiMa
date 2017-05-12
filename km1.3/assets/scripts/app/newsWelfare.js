define('app/newsWelfare', function(require, exports, module) {
    var $ = require('zepto');
	var km = require('../plugs/version');
    var SecondPage = require('../plugs/secondPage.js');

    var openWXPage = new SecondPage('#openWX');
    $('#business').on('click', function(){
        var qq = $(this).text();
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
});