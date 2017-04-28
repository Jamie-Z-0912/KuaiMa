define('app/51activity', function(require, exports, module) {
    var Ajax = require('../mod/base');
	var tipsAd = require('../plugs/tipsAd.js');
	var act_id = 1;

	Ajax.custom({ url:'api/v1/activity/info',data:{activityId:act_id}}, function(d){
		if(d.status == 9500 || d.status == 9502){
			new tipsAd({
				type: 'activityOver',
				title: '活动结束啦',
				text: '<p class="rec_over">感谢您对我们的支持，请您继续关注我们其他的活动。</p>',
				hasAd: '0',
				isClose: 'no',
				btnType: '1'
			});
			return;
		}
		if(d.status == 9501){
			new tipsAd({
				type: 'activityOver',
				title: '活动即将开始',
				text: '<p class="rec_over">感谢您对我们的支持，请您继续关注我们的活动。</p>',
				hasAd: '0',
				isClose: 'no',
				btnType: '1'
			});
			return;
		}
		if(d.status == 1013){
			Tools.alertDialog({
                text: '账号异常，请联系客服',
                time: '0'
            });
            return;
		}
		if(d.status == 1000){
			var data = d.data, act = data.activity;
			console.log(data)
			$('#activityImg').html('<img src="'+ act.image +'" />');
			var todayNum = data.todayReadArticleNum || 0;
			// if(!Tools.getQueryValue('isLogin') || Tools.getQueryValue('isLogin')!=1){
			// 	$('#todayBtn').attr('href','kmb://alertlogin').text('去登录');
			// }
			todayNum = todayNum > data.everyDayNeedReadArticleNum ? data.everyDayNeedReadArticleNum : todayNum;
			$('#cur').text(todayNum+'/'+ data.everyDayNeedReadArticleNum);
			if(todayNum == data.everyDayNeedReadArticleNum){
				$('#todayStatus').html('<div class="tip">今日活跃已完成</div>');
			}
			$('#desc').text(act.desc);
			$('#ruleCon').text(act.rule);

			var sch = data.readArticleDayNum / data.activityTotalDayNum *100;
				sch = sch.toFixed(5) +'%';
			$('#schCur').width(sch);
			// $('#schCurDay').text(data.readArticleDayNum+'天').css('left', sch);

			var rewards = [];
			for (var i = 0; i < act.rewards.length; i++) {
				var obj = {};
				obj.id = act.rewards[i].id;
				obj.reward_name = act.rewards[i].reward_name;
				obj.reward_num = act.rewards[i].reward_num;
				obj.day = parseInt(act.rewards[i].reward_name.split('天')[0]);
				obj.percent = (obj.day/data.activityTotalDayNum *100).toFixed(5) +'%'; 
				obj.can_receive = act.rewards[i].can_receive;
				obj.had_receive = act.rewards[i].had_receive;
				rewards.push(obj);
			};
			console.log(rewards)
        	Ajax.render('#treasureBox', '#treasureBox-tmpl', rewards, undefined, true);
        	Ajax.render('#reward', '#reward-tmpl', rewards, undefined, true);
		}
	});
	var uid = Tools.uid();
	$('#treasureBox').on('click', '.btn', function(){
		var that = $(this), rew_id = that.data('id'),rew_num = that.data('num');
		if($(this).hasClass('ok')){
			Ajax.custom({ 
				url:'api/v1/activity/receiveReward',
				data:{activityId:act_id, rewardId:rew_id}
			}, function(d){
				if(d.status == 9500 || d.status == 9502){
					new tipsAd({
						type: 'activityOver',
						title: '活动结束啦',
						text: '<p class="rec_over">感谢您对我们的支持，请您继续关注我们其他的活动。</p>',
						hasAd: '0',
						isClose: 'no',
						btnType: '1'
					});
					return;
				}
				if(d.status == 9501){
					new tipsAd({
						type: 'activityOver',
						title: '活动即将开始',
						text: '<p class="rec_over">感谢您对我们的支持，请您继续关注我们的活动。</p>',
						hasAd: '0',
						isClose: 'no',
						btnType: '1'
					});
					return;
				}				
				if(d.status == 1013){
					Tools.alertDialog({
		                text: '账号异常，请联系客服',
		                time: '0'
		            });
		            return;
				}		
				if(d.status == 9601){
					Tools.alertDialog({
		                text: '奖励已领取'
		            });
		            that.text('已领取').removeClass('ok');
		            return;
				}
				if(d.status == 9602){
					Tools.alertDialog({
		                text: '未达到活动奖励条件'
		            });
		            that.text('未达成').removeClass('ok');
		            return;
				}
				if(d.status == 1000){
					new tipsAd({
						type: 'receive',
						title: '恭喜您获得奖励',
						text: '<img src="./image/mycard.png" class="rec_img" />'
								+'<p class="rec_red">'+rew_num+'天阅读加速卡一张</p>'
								+'<p class="rec_gray">奖励已经发送至您的账户</p>',
						hasAd: '0',
						isClose: 'no',
						btnType: '1'
					});
		            that.text('已领取').removeClass('ok');
				}
			});
		}

	});
});