define('app/bindAward', function(require, exports, module) {
	var Ajax = require('../mod/base'),
        popups = require('../plugs/popups.js');

    function getStatus(){
		Ajax.custom({
			url:'api/v1/business/wx_mp/bind_reward/status'
		},function(data){
			if(data.status==1000){
				var d = data.data;
				if(d.received){
					$('#status,#bind').remove();
					$('#km_wechat').show();
					$('#msg').html('<p>您的微信号与'+d.phone+'绑定成功</p><p>已收入'+d.coin+'金币到快马小报账户了</p>')
				}else{
					$('#msg').html('<p>您的微信号与'+d.phone+'绑定成功</p><p>送您'+d.coin+'金币奖励！</p>')
					$('#bind').html('<a class="get200" href="javascript:void(0)">立即领取</a>');
				}
			}else{
	            Tools.alertDialog({
	                text: data.desc
	            })
			}
		});
    }

    if(Tools.auth_token()==''){
    	if(Storage.get('kmBindReward')){
    		if(Storage.get('kmBindReward')) Storage.remove('kmBindReward');
			getStatus();
    	}else{
			Storage.set('kmBindReward',1);
    	}
    }else{
    	if(Storage.get('kmBindReward')) Storage.remove('kmBindReward');
    	getStatus();
    }


	$('#bind').on('click','.get200', function(){
		Ajax.custom({
			url:'api/v1/business/wx_mp/bind_reward/receive'
		}, function(data){
			if(data.status==1000){
                new popups({
                    title:'成功领取200金币',
                    img:'../image/ok.png',
                    sureTxt:'去快马小报查看'
                },function(a){
                	if(a){
                		window.location = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser';
                	}
                });
			}else{
	            Tools.alertDialog({
	                text: data.desc
	            })
			}
		})
	})
})