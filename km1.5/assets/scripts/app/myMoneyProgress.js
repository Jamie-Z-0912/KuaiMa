define('app/myMoneyProgress', function(require, exports, module) {
    var Ajax = require('../mod/base');
    var km =  require('../plugs/version.js');
    var SecondPage = require('../plugs/secondPage.js');

    Ajax.custom({
        url:'api/v1/withdraw/progress'
    }, function(data){
        // console.log(data);
        Ajax.render('#content', '#content-tmpl', data, undefined, true);
    });

    var openWXPage = new SecondPage('#openWX');
    $('#business').on('click', function(){
        if(/Android/.test(navigator.userAgent) && km.less('1.2.3')){
            $('#openWX h2').html('长按 <a style="color:#fa0">快马小报</a> 复制')
        }else{
            window.location = 'kmb://QQ='+encodeURIComponent('快马小报');
        }
        openWXPage.openSidebar();
        return false;
    });
    $('#sidebar-bg').on('touchstart', function(){
        openWXPage.closeSidebar();
        return false;
    });

    Ajax.custom({
        url: 'api/v1/ads',
        data: {
            'location': 'withdraw_progress_announcement'
        }
    }, function(d){
        if(d.status == 1000){
            var txt = $('.tips').text();
            $('.tips').html('<div style="color:red;">'+d.data[0].title+'</div>'+txt);
        }
    })

});