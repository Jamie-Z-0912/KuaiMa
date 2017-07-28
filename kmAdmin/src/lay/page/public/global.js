layui.define(['layer'], function(exports){
    var $ = layui.jquery,
        layer = layui.layer,
        device = layui.device();
    //阻止IE7以下访问
    if(device.ie && device.ie < 8){
        layer.alert('Layui最低支持ie8，您当前使用的是古老的 IE'+ device.ie + '，你丫的肯定不是程序猿！');
    }
    $('.layui-body').height(innerHeight - 60)
    $(window).resize(function(){
        $('.layui-body').height(innerHeight - 60)
    })
  
  //手机设备的简单适配
    var treeMobile = $('.site-tree-mobile'),shadeMobile = $('.site-mobile-shade')
    treeMobile.on('click', function(){
        $('body').addClass('site-mobile');
    });
    shadeMobile.on('click', function(){
        $('body').removeClass('site-mobile');
    });

    if(innerWidth < 860  && $('#queryForm').width() > innerWidth-40){
        $('#queryForm').width(innerWidth-40);
        $('#queryForm .layui-input-inline').width('300px');
    }

    exports('global', {});
});