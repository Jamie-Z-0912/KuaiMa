define('app/recallUser', function(require, exports, module) {
	var Ajax = require('../mod/base');
	var confirmTip = require('../plugs/confirmTip.js');
	Ajax.custom({
		url: 'api/v1/recall/receiveReward',
	},function(data){
		if(data.status!=1000){
			$('#receiveAward').addClass('gray').text('召回用户专享')
		}
	});
	$('#receiveAward').on('click', function(){
		var _self = $(this);
		if(!_self.hasClass('gray')){
		    Ajax.custom({
		        url:'api/v1/recall/receiveReward'
		    }, function(d){
		    	if(d.status != 1000){
					Tools.alertDialog({
						title: '领取失败',
			            text: d.desc
			        });
					_self.addClass('gray').text('召回用户专享')
		    	}else{
		    		new confirmTip({
		    			title:'领取成功',
			            text: '<p style="padding:0 .15rem;">恭喜您获得3天加速卡，明日生效，先去任务大厅看看更多新玩法吧！</p>',
						sureTxt: '查看奖励',
						cancelTxt: '去任务大厅'
			        },function(a){
			            if(a){
			            	if(/browser.kuaima/.test(location.hostname)){
			            		window.location = 'http://browser.kuaima.cn/myCard.html?auth_token='+Tools.auth_token();
			            	}else{
			            		window.location = 'http://t.kuaima.cn/browser/myCard.html?auth_token='+Tools.auth_token();
			            	}
			            }else{
			            	if(/browser.kuaima/.test(location.hostname)){
			            		window.location = 'http://browser.kuaima.cn/taskCenter.html?auth_token='+Tools.auth_token();
			            	}else{
			            		window.location = 'http://t.kuaima.cn/browser/taskCenter.html?auth_token='+Tools.auth_token();
			            	}
			            }
			        });
		    	}
			})
		}
	})
	$('#toTaskCenter').on('click', function(){
    	if(/browser.kuaima/.test(location.hostname)){
    		window.location = 'http://browser.kuaima.cn/taskCenter.html?auth_token='+Tools.auth_token();
    	}else{
    		window.location = 'http://t.kuaima.cn/browser/taskCenter.html?auth_token='+Tools.auth_token();
    	}
	})
	$('#hotSearch').on('click', function(){
		window.location = 'kmb://hotsearch';
	})
	$('#readMesA').on('click', function(){
		Tools.alertDialog({
			text:'阅读每日推送文章<br>可获得额外金币奖励'
		})
	});

	$('#welfare').on('click', function(){
		var _self = $(this);
		if($('#welfare .over').length > 0){
			window.location = 'http://activity.yuyiya.com/activity/index?id=1919&slotId=2953&login=normal&appKey=2cMgpedEXq4tgEy5Y6f4g963ZTkr&tenter=SOW';
		}else{
	    	Ajax.custom({ 
		        url: 'api/v1/task/receiveReward',
		        data: {'eventType':'join_fuli_act'}
		    },function(data){
		    	if(data.status!=1000){
		    		if(data.status==1005){
		    			$('#welfare .right').text('已完成').addClass('over');
		    		}
		    		Tools.alertDialog({
		    			text: data.desc,
		    			time: 1000
		    		},function(){
						window.location = 'http://activity.yuyiya.com/activity/index?id=1919&slotId=2953&login=normal&appKey=2cMgpedEXq4tgEy5Y6f4g963ZTkr&tenter=SOW';
		    		})
		    	}else{
					Tools.alertDialog({
						text:'获得'+ _self.data('num') +'金币'
					})
					setTimeout(function(){
						$('#welfare .right').text('已完成').addClass('over');
						window.location = 'http://activity.yuyiya.com/activity/index?id=1919&slotId=2953&login=normal&appKey=2cMgpedEXq4tgEy5Y6f4g963ZTkr&tenter=SOW';
					},800);
		    	}
		    });
		}
	});
	$('#gatherA').on('click', function(){
		window.location = 'kmb://worthreadingtab';
	})

});