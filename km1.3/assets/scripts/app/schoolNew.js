define('app/schoolNew', function(require, exports, module) {
    var Ajax = require('../mod/base');
    var SecondPage = require('../plugs/secondPage.js');
    var km = require('../plugs/version.js');

    $('#qustionList').on('click', 'li', function(){
        var that = $(this);
        if(that.hasClass('active')){
            that.removeClass('active');
        }else{
            that.addClass('active').siblings().removeClass('active');
        }
    });

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