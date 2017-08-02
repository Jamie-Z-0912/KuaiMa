define('app/recallUser', function(require, exports, module) {
	var Ajax = require('../mod/base');
	var confirmTip = require('../plugs/confirmTip.js');
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
			            text: '恭喜您获得3天加速卡，明日生效，先去任务大厅看看更多新玩法吧！',
						sureTxt: '查看奖励',
						cancelTxt: '去任务大厅'
			        },function(a){
			            if(a){
			            	alert('查看奖励')
			            }else{
			            	alert('去任务大厅')
			            }
			        });
		    	}
			})
		}
	})

});