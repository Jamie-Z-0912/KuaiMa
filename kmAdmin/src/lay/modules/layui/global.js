layui.define(['layer', 'form', 'element'], function(exports){
    var $ = layui.jquery
    ,layer = layui.layer
    ,form = layui.form() 
    ,device = layui.device();

    console.log(layui.v);
    //阻止IE7以下访问
    if(device.ie && device.ie < 8){
      layer.alert('Layui最低支持ie8，您当前使用的是古老的 IE'+ device.ie + '，你丫的肯定不是程序猿！');
    }

  
  //窗口scroll
  ;!function(){
    var main = $('.site-tree').parent(), scroll = function(){
      var stop = $(window).scrollTop();
      if($(window).width() <= 750) return;
      var bottom = $('.footer').offset().top - $(window).height();
      if(stop > 61 && stop < bottom){
        if(!main.hasClass('site-fix')){
          main.addClass('site-fix');
        }
        if(main.hasClass('site-fix-footer')){
          main.removeClass('site-fix-footer');
        }
      } else if(stop >= bottom) {
        if(!main.hasClass('site-fix-footer')){
          main.addClass('site-fix site-fix-footer');
        }
      } else {
        if(main.hasClass('site-fix')){
          main.removeClass('site-fix').removeClass('site-fix-footer');
        }
      }
      stop = null;
    };
    scroll();
    $(window).on('scroll', scroll);
  }();
  
  //手机设备的简单适配
  var treeMobile = $('.site-tree-mobile')
  ,shadeMobile = $('.site-mobile-shade')

  treeMobile.on('click', function(){
    $('body').addClass('site-mobile');
  });

  shadeMobile.on('click', function(){
    $('body').removeClass('site-mobile');
  });

  if(innerWidth < 860  && $('#queryForm').width() > innerWidth-40) $('#queryForm').width(innerWidth-40);

  exports('global', {});
});