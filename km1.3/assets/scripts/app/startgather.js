define('app/startgather', function(require, exports, module) {
    var submit = require('../mod/submit');
    var confirmTip = require('../plugs/confirmTip.js');
    Ajax.custom({
        url: 'api/v1/post/checkAuthority'
    }, function(data){
        if(data.status==1000){
            $('#opengather .answer').html('您已拥有值得看模块采集权限啦，更多问题请加<a href="mqqwpa://im/chat?chat_type=wpa&uin=2518437090&version=1&src_type=web&web_src=b.qq.com">客服QQ：2518437090</a>')
        }
        if(data.status==9706){
            $('#opengather .answer').html('您已提交申请，请耐心等待，咨询加<a href="mqqwpa://im/chat?chat_type=wpa&uin=2518437090&version=1&src_type=web&web_src=b.qq.com">客服QQ：2518437090</a>')
        }
        if(data.status==9707){
            $('#opengather .answer').html('登录后才可以申请哦~')
        }
    });
    $('#qustionList').on('click', 'li', function(){
        var that = $(this);
        if(!that.hasClass('active')){
            that.addClass('active').siblings().removeClass('active');
        }
    });
    var arr = [],arr1=[];
    $.each($('#applyfor dt'),function(){
        arr.push($(this).find('span').text())
        arr1.push(' ');
    });
    $('#applyfor').on('click', '.dd', function(){
        var that = $(this);
        if(!that.hasClass('selected')){
            that.addClass('selected').siblings().removeClass('selected');
            var index = that.parent().data('id');
            arr1[index] = that.text().replace('<i></i>','');
        }
    });
    $('#gatherForm').submit(function(e){
        e.preventDefault();
        var hasOk = true;
        for (var i = 0; i < arr1.length; i++) {
            if(arr1[i]==' '){
                Tools.alertDialog({
                    text: '第'+(i+1)+'题还没有回答！'
                });
                hasOk = false;
                break;
            }
        };
        if(hasOk){
            var str = '';
            for (var i = 0; i < arr.length; i++) {
                str+=arr[i]+':'+arr1[i]+';';
            };
            $('input[name="question"]').val(str);
            submit.fun({
                url: 'api/v1/zhdk/initialUsers',
                data: $(this)
            }, function(data){
                if(data.status == 1000){
                    $('#opengather .answer').html('您已提交申请，请耐心等待，咨询加<a href="mqqwpa://im/chat?chat_type=wpa&uin=2518437090&version=1&src_type=web&web_src=b.qq.com">客服QQ：2518437090</a>');
                    new confirmTip({
                        title: '提交成功',
                        text: '<p style="padding:0 .16rem;text-align:left;margin-bottom:-.14rem">申请审核进度查询，请加客服QQ：2518437090。</p>',
                        sureTxt: '去加QQ',
                        cancelTxt: '我知道了'
                    },function(a){
                        if(a)
                            window.location = 'mqqwpa://im/chat?chat_type=wpa&uin=2518437090&version=1&src_type=web&web_src=b.qq.com';
                        else
                            window.location = 'kmb://worthreadingtab';
                    });
                }else{
                    Tools.alertDialog({
                        text: data.desc
                    });
                }
            }) 
        }
    })
        
});