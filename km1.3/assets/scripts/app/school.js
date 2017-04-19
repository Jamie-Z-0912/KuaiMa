define('app/school', function(require, exports, module) {
    var Ajax = require('../mod/base');
    var SecondPage = require('../plugs/secondPage.js');
    var km = require('../plugs/version.js');

    var btnPos = function(){
        var conH = $('#qustionList').height() + $('#qqJoinBtn').height() + 40;
        if(conH < innerHeight){
            $('#qqJoinBtn').css({
                'position': 'absolute',
                'bottom': '15px'
            });
        }else{
            $('#qqJoinBtn').css({
                'position': 'relative',
                'margin-top': '40px'
            });
        }
    }
    btnPos();
    $('#qustionList').on('click', 'li', function(){
        var that = $(this);
        if(that.hasClass('active')){
            that.removeClass('active');
        }else{
            that.addClass('active').siblings().removeClass('active');
        }
        btnPos();
    });

    var openWXPage = new SecondPage('#openWX');
    $('#business').on('click', function(){
        var qq = $(this).text();
        if(/Android/.test(navigator.userAgent) && km.less('1.2.3')){
            console.log(km)
            $('#openWX h2').html('长按 <a style="color:#fa0">快马浏览器NJ</a> 复制')
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