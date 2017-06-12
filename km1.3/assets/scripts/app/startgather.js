define('app/startgather', function(require, exports, module) {
    var submit = require('../mod/submit');
    var confirmTip = require('../plugs/confirmTip.js');

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
                    new confirmTip({
                        title: '提交成功',
                        text: '恭喜您提交申请成功！请耐心等待审核。你的申请审核进度将通过QQ告知您。请加客服QQ：3330107868。',
                        sureTxt: '去加QQ',
                        cancelTxt: '我知道了'
                    },function(a){
                        window.location = 'tencent://message/?uin=3330107868&Site=kuaima.cn&Menu=yes';
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