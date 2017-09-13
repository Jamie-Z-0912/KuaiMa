define('app/joinUs', function(require, exports, module) {
    var submit = require('../mod/submit');
    const code = Tools.getQueryValue('code'), from =  Tools.getQueryValue('from');
    $('body').css('min-height',innerHeight);
    /************/
    if(code == ''){
        Tools.alertDialog({
            text:'该链接无效！',
            time: '99999999'
        })
    }else{
        $('input[name="web_share_code"]').val(code)
    }
    /***********/
    seajs.use('./scripts/lib/jquery.base64', function(){
        $('#repeatSend,#yuyin').on('click', function(){
            var phone = $('input[name="phone"]').val();
            var type = $(this).data('type');
            if(phone.isEmpty()){
                Tools.alertDialog({ text: "手机号不能为空" });
                return;
            }
            if(!phone.isMobile()){
                Tools.alertDialog({ text: "手机号格式不正确" });
                return;
            }
            if(!$(this).hasClass('disabled')){
                $('#yuyin').addClass('disabled');
                setTimeout(function(){
                    $('#yuyin').removeClass('disabled');
                }, 60000);
                submit.sendSms($('#repeatSend'),{
                    phone: base64.encode(phone),
                    useto: 'joinTeam',
                    type: type
                }, function(data){
                    if(data.status==9902){
                        $('#hasTeam').show().siblings().remove();
                    }
                });
            }
        })
    });
    /****************/
    var gvCode = (Math.random().toFixed(4)).substring(2);
    $('#gvCodeInput, #gvCode').text(gvCode);
    $('#gvCodeInput').bind('input propertychange', function(e) {
        var that = $(this), gv = that.val();
        if(gv.length > 3){
            if(gv==gvCode){
                that.attr('disabled','disabled');
                that.parent().next().show();
                $('#yuyin').css('display','block');
                return;
            }else{
                that.val('');
                return
            }
        }
    });
    /***********/
    if(from=='saoma'){
        $('input[name="join_type"]').val('3')
    }else{
        $('input[name="join_type"]').val('6')
    }
    $('#joinUsForm').submit(function(e){
        e.preventDefault();
        var curEl = $(this);
        var phone = $('input[name="phone"]').val();
        var code = $('input[name="verify_code"]').val();
        if(phone.isEmpty()){
            Tools.alertDialog({
                text: "手机号不能为空"
            })
            return;
        }
        if(!phone.isMobile()){
            Tools.alertDialog({
                text: "手机号格式不正确"
            })
            return;
        }
        if(code.isEmpty()){
            Tools.alertDialog({
                text: "验证码不能为空"
            })
            return;
        }
        if(!code.isVerifyCode()){
            Tools.alertDialog({
                text: "请正确输入收到的验证码"
            })
            return;
        };
        submit.fun({
            url: 'api/v1/teams/webJoin',
            data: $(this)
        }, function(data){
            if(data.status == 2001){
                Tools.alertDialog({
                    text: '验证码错误，请新获取'
                })
            }else{
                if(data.status==1000){
                    var d = data.data;
                    if(d.isNewUser){
                        $('#newUser').show().siblings().remove();
                    }else{
                        if(d.isJoinTeam){
                            $('#joinTeam').show().siblings().remove();
                        }else{
                            $('#hasTeam').show().siblings().remove();
                        }
                    }
                }
            }
        })
    });
});