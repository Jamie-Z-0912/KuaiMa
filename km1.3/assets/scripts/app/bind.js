define('app/bind', function(require, exports, module) {
	var submit = require('../mod/submit');
	var tipsAd = require('../plugs/tipsAd.js');
	if(Tools.auth_token() == 'null'){
    	var opt = { title: "提醒", text: "请在快马浏览器中登录再访问！", time: 5000};
    	Tools.alertDialog(opt, function(){
    		window.location = 'kmb://alertlogin';
    	});
    	return;
    }

    var notPass = function(opt){
        Tools.alertDialog(opt, function(){
            $('input[type="submit"]').removeAttr('disabled');
        });
    }

    $('#bindFrom').submit(function(e){
        e.preventDefault();
        $('input[type="submit"]').attr('disabled','disabled');

        var name = $('input[name="account_name"]').val();
        var card = $('input[name="bank_card"]').val();
        var branch_name = $('input[name="bank_branch_name"]').val();

        if(name.isEmpty()){
            var opt = {text: '真实姓名不能为空'};
            notPass(opt);
            return;
        }
        if(!name.isChinese()){
            var opt = {text: '真实姓名必须为中文名'};
            notPass(opt);
            return;
        }
        if(card.isEmpty()){
            var opt = {text: '支付宝号不能为空'};
            notPass(opt);
            return;
        }

       	submit.fun({
            url: 'api/v1/withdraw/account/bind',
            data: $(this)
        },function(data){
            if(data.status != 1000){
                var opt = {title: "绑定失败",text: data.desc};
                notPass(opt);
            }else{
				new tipsAd({
					type: 'rule',
					subtit: '绑定成功！',
					hasAd: '0',
					isClose: 'no',
					btnType: '1'
				});
            }
        })
    });

});