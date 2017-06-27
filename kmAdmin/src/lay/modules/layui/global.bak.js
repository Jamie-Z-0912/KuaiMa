layui.define(['layer', 'code', 'form', 'element', 'util'], function(exports){
  var $ = layui.jquery
  ,layer = layui.layer
  ,form = layui.form() 
  ,util = layui.util
  ,device = layui.device();

  console.log(layui.v);
  //阻止IE7以下访问
  if(device.ie && device.ie < 8){
    layer.alert('Layui最低支持ie8，您当前使用的是古老的 IE'+ device.ie + '，你丫的肯定不是程序猿！');
  }


  //搜索组件
  form.on('select(component)', function(data){
    var value = data.value;
    location.href = '/doc/'+ value;
  });
  

  //首页banner
  setTimeout(function(){
    $('.site-zfj').addClass('site-zfj-anim');
    setTimeout(function(){
      $('.site-desc').addClass('site-desc-anim')
    }, 5000)
  }, 100);
  
  //固定Bar
  util.fixbar({
    bar1: true
    ,click: function(type){
      if(type === 'bar1'){
        location.href = '//www.kuaima.cn/';
      }
    }
  });
  
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
  
  /****
  
<ul class="site-dir">
  <li><a href="#before"><cite>预先加载</cite></a></li>
  <li><a href="#trigger"><cite>按需加载</cite></a></li>
  <li><a href="#space"><cite>模块命名空间</cite></a></li>
  <li><a href="#extend"><cite>扩展一个Layui模块</cite></a></li>
</ul>
  */
  //目录
  var siteDir = $('.site-dir');
  if(siteDir[0] && $(window).width() > 750){
    layer.open({
      type: 1
      ,content: siteDir
      ,skin: 'layui-layer-dir'
      ,area: 'auto'
      ,title: '目录'
      ,offset: 'r'
      ,shade: false
      ,success: function(layero, index){
        layer.style(index, {
          marginLeft: -15
        })
      }
    });
    siteDir.find('li').on('click', function(){
      var othis = $(this);
      othis.find('a').addClass('layui-this');
      othis.siblings().find('a').removeClass('layui-this');
    });
  }

  //手机设备的简单适配
  var treeMobile = $('.site-tree-mobile')
  ,shadeMobile = $('.site-mobile-shade')

  treeMobile.on('click', function(){
    $('body').addClass('site-mobile');
  });

  shadeMobile.on('click', function(){
    $('body').removeClass('site-mobile');
  });

  exports('global', {});
});