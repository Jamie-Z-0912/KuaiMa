define('app/taskCenter', function(require, exports, module) {
	var pagelist = require('../mod/pagelist');
	require('../plugs/cookieStorage.js');
	var km = require('../plugs/version');
	var Timer = require('../plugs/timer.js');
	var tipsAd = require('../plugs/tipsAd.js');
    var SecondPage = require('../plugs/secondPage.js');

	if(Tools.auth_token() == 'null'){
    	var opt = { title: "提醒", text: "请在#ProjectName#中登录再访问！", time: 5000};
    	Tools.alertDialog(opt, function(){
    		window.location = 'kmb://alertlogin';
    	});
    	return;
    }
    if(km.less('1.1.0')){
		Tools.alertDialog({
			title: '重大更新',
            text: '#ProjectName#全新改版<br>签到每次得0.5元<br></br><a style="background-color:#fa0;color:#fff;display:inline-block;padding: 5px 10px;" href="http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser">马上更新</a>',
            time: '0'
        });
        $('#close').remove();
        return;
    }
    var checkinStatus = {
    	over: function(){
			$('#checkin').hide();
			$('#signinNormal').text('已签到');
			$('#norCheckin').show();
    	},
    	normal: function(){
			$('#checkin').hide();
			$('#signinNormal').addClass('checkin');
			$('#norCheckin').show();
    	}
    }
    var fun = {
    	updateApp: function(){
			var str = '<div class="pop-mask km-dialog"></div>'
				+'<div class="pop-screen km-dialog update_pop">'
				+'<div class="box">'
					+'<h2>升级新版本</h2>'
					+'<div class="text">'
						+'<img src="image/tc-update.png" style="width:100%">'
						+'<p>开启新任务，快来赚更多！</p>'
					+'</div>'
					+'<div class="btnbox">'
						+'<a href="http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser">去升级</a>'
					+'</div>'
				+'</div>'
			+'</div>';
			$('body').append(str);
    	},
    	getCoin: function(type, callback){
	    	Ajax.custom({ 
		        url: 'api/v1/task/receiveReward',
		        data: {'eventType':type}
		    },function(data){
		    	if(data.status!=1000){
		    		Tools.alertDialog({
		    			text: data.desc
		    		})
		    	}else{
		    		$.isFunction(callback) && callback();
		    	}
		    })
    	}
    }

	var checkin_jinbi = 700, showNormal=false;
    Ajax.custom({ 
        url: 'api/v1/checkin/setting'
    },function(data){
		var d = data.data;
		if(d.checkin_type == 'common_checkin'){
			showNormal = true;
		}
		checkin_jinbi = d.commission || 700;
		if(d.is_checkin){ //已经签到
			Storage.set('hasCheckin', '1', true);
			checkinStatus.over();
		}else{  

			//倒计时显示
			if(d.left_num > 0){
				$('#leftNum').text('今日剩余 '+d.left_num+'/'+d.total_num);
				$('#timer').prev().text('距离开始还有');
				// d.left_seconds = 3667;
				new Timer('#timer', d.left_seconds, d.is_start, function(){
					$('#signin').addClass('checkin');
					if(Storage.get('hasCheckin', true) && Storage.get('hasCheckin', true) == 1){
						// $('#signin').removeClass('checkin').addClass('hasCheckin');
						checkinStatus.over();
					}
				});
				$('#timer').show();
			}else{ 
				//根据类型控制是否显示普通签到
				if(showNormal){
					checkinStatus.normal();
				}
				$('#signin').text('已抢光').addClass('over');
			}
		}
    });

    /*去掉不耻下问*/
    // console.log(km)
    if(km.less('1.3.2')){
    	$('#hotSearch').hide();
    }else{
		$('#hotSearch').show();
		$('#hotSearch').on('click', function(){
			if(km.less('1.3.2')){
				fun.updateApp();
			}else{
				window.location = 'kmb://hotsearch';
			}
		});
    }
	if(km.less('1.2.0')){
		$('#replyC, #likeC').remove();
	}else{
		//取消跳转
		// $('#replyC, #likeC').on('click', function(){
		// 	if(km.less('1.2.0')){
		// 		fun.updateApp();
		// 	}else{
		// 		window.location = 'kmb://main';
		// 	}
		// });
	}
    /*新手任务*/
	Ajax.custom({
		url:'api/v1/task/junior'
	}, function(d){
		var data = d.data;
		// data = {
		// 	"show_junior_task":true, // 是否要显示新手任务, 返回false, 任务页面不展示新手任务区
		//     "receive_junior_reward_day_num":2,  // 已领取奖励的天数
		//     "can_receive_junior_reward_day_num":3,  // 可以领取新人奖励天数, 为0表示当前没有可以领取的奖励
		//     "has_read_tutorial": false, // 是否已阅读新手教程
		//     "has_first_read_article": false, // 是否已首次有效阅读文章
		//     "has_first_search": false,  // 是否已首次搜索
		// }

		if(data.show_junior_task){
		    if(/iPhone|iPad|iPod/.test(km.userAgent) && km.less('1.4.2')){
				$('#newbie_school').hide();
		    }else{
				$('#newbie_school').on('click', function(){
					var _self = $(this);
					if(km.less('1.4.2')){
						fun.updateApp();
					}else{
						if($('#newbie_school .over').length > 0){
							window.location = 'kmb://newbie';
						}else{
							fun.getCoin('read_tutorial',function(){
								Tools.alertDialog({
									text:'获得'+ _self.data('num') +'金币'
								})
								setTimeout(function(){
									$('#newbie_school .right').text('已完成').addClass('over');
									window.location = 'kmb://newbie';
								},1000);
							})
						}
					}
				});
		    }
		    if(/iPhone|iPad|iPod/.test(km.userAgent) && km.less('1.3.2')){
				$('#newbie_search').hide();
		    }else{
				$('#newbie_search').show();
				$('#newbie_search').on('click', function(){
					if(km.less('1.3.2')){
						fun.updateApp();
					}else{
						window.location = 'kmb://hotsearch';
					}
				});
		    }
			$('#newbie_read').on('click', function(){
				window.location = 'kmb://main';
			});
			$('#newbieTask').show();
			/* 新手每天的奖励 */
			var n_day_len = $('#newbieDays li').length;
			var n_can_day = data.can_receive_junior_reward_day_num;
			var n_has_day = data.receive_junior_reward_day_num;
			if(n_can_day!=0){
				$('#newbieDays li').eq(n_can_day-1).addClass('can_get');
			}
			for (var i = 0; i < n_has_day; i++) {
				$('#newbieDays li').eq(i).addClass('has_get');
			};

		    if(data.has_read_tutorial){
		    	$('#newbie_school .right').text('已完成').addClass('over');
		    }
		    if(data.has_first_read_article){
		    	$('#newbie_read .right').text('已完成').addClass('over');
		    }
		    if(data.has_first_search){
		    	$('#newbie_search .right').text('已完成').addClass('over');
		    }
		    var days_wel = [
		    	'junior_first_day_reward', 'junior_second_day_reward', 'junior_third_day_reward',
		    	'junior_fourth_day_reward', 'junior_fifth_day_reward', 'junior_sixth_day_reward',
		    	'junior_seventh_day_reward'
		    ];
		    $('#newbieDays').on('click', 'li', function(){
		    	var _self = $(this), i = _self.index();
		    	var coin = _self.data('num');
		    	var tt = '成功领取'+coin+'金币';
		    	if(_self.hasClass('card')){
		    		tt = '获得一张'+coin+'天加速卡'
		    	}
		    	if(_self.hasClass('can_get')){
		    		fun.getCoin(days_wel[i],function(){
		    			new tipsAd({
							type: 'ok',
							subtit: tt,
							text: '得到第'+(i+1)+ '天奖励',
							hasAd: '0'
						});
		    			_self.removeClass('can_get').addClass('has_get');
		    		})
		    	}else if(_self.hasClass('has_get')){
		    		Tools.alertDialog({
		    			text:'你已领过第'+(i+1)+'天的奖励'
		    		})
		    	}else{
		    		Tools.alertDialog({
		    			text:'第'+(i+1)+'天领取时间未到！'
		    		})
		    	}
		    })
		}else{
			$('#newbieTask').remove();
		}
	});

	/* 每日任务 */
	Ajax.custom({
		url:'api/v1/task/daily'
	}, function(d){
		var data = d.data;
		if(data.show_daily_fuli){
			$('#welfare').show();
			if(data.has_join_fuli_act){
				$('#welfare h6').text('已完成').addClass('over');
			}
			$('#welfare').on('click', function(){
				var _self = $(this);
				if($('#welfare .over').length > 0){
					window.location = data.daily_fuli_task.origin_url;
				}else{
					fun.getCoin('join_fuli_act',function(){
						Tools.alertDialog({
							text:'获得'+ _self.data('num') +'金币'
						})
						setTimeout(function(){
							$('#welfare h6').text('已完成').addClass('over');
							window.location = data.daily_fuli_task.origin_url;
						},1000);
					});
				}
			})
		}
	    if(/iPhone|iPad|iPod/.test(km.userAgent) && km.less('1.4.2')){
	    	$('#readMesA, #gatherA').remove();
	    }else{
			$('#hotSearch h6').text(data.search_task_status);
			$('#readMesA, #gatherA').show();
			if(Tools.getQueryValue('notice')!='open' ){
				$('#readMesA').on('click', function(){
					if(km.less('1.4.2')){
						fun.updateApp();
					}else{
						window.location = 'kmb://sysnotificationsetting';
					}
				});
			}else{
				$('#readMesA h6').text(data.read_push_status);
				$('#readMesA').addClass('tips');
				$('#readMesA').on('click', function(){
					Tools.alertDialog({
						text:'阅读每日推送文章<br>可获得额外金币奖励'
					})
				})
			}
			$('#gatherA').on('click', function(){
				if(data.has_caiji_permission){
					if(km.less('1.4.0')){
						fun.updateApp();
					}else{
						window.location = 'kmb://worthreadingtab';
					}
				}else{
					if(km.less('1.4.2')){
						fun.updateApp();
					}else{
						window.location = 'kmb://applyworthreading';
					}
				}
			});
    	}
	});
	/** 广告 **/
	var runAD = [];
	Ajax.custom({
		url:'api/v1/ads',
		data:{
			location:'checkin_alert'
		}
	}, function(d){
		for (var i = 0; i < d.data.length; i++) {
			var ad = {img:'',link:''};
			ad.img = d.data[i].images[0];
			ad.link = d.data[i].origin_url;
			runAD.push(ad);
		};

	})

    $('#rule').on('click', function(){
		new tipsAd({
			type: 'rule',
			subtit: '每天上午10点准时开抢',
			text: '开启提醒，快人一步！<br>数量有限，先到先得！',
			hasAd: '0',
			isClose: 'no',
			btnType: '1'
		});
    });
	$('#signin').on('click', function(){
		var btn = $(this);
		if(btn.hasClass('checkin')){
			btn.removeClass('checkin');
			var showad = Math.floor(Math.random()*runAD.length);
			var waiting = new tipsAd({
				type: 'waiting',
				subtit: '拼命疯抢中…',
				isClose: 'no',
				adImg: runAD[showad].img,
				adLink: runAD[showad].link
			});
			setTimeout(function(){
				Ajax.custom({
					url: 'api/v1/checkin'
				},function(data){
					waiting.close();
					if(data.status == 1000){
						checkinStatus.over();
						Storage.set('hasCheckin',1,true);
						var showad = Math.floor(Math.random()*runAD.length);
						new tipsAd({
							type: 'ok',
							title: '签到成功',
							text: '恭喜你获得'+ data.data.commission + '金币',
							adImg: runAD[showad].img,
							adLink: runAD[showad].link
						});
						// $('#leftNum').text('签到获得 '+data.data.commission+'金币');
						// $('#signin').removeClass('checkin').addClass('hasCheckin').text('已签到');
						// $('#timer').parent().html('开抢时间：每日10点');
			    		var iframe = document.createElement('iframe');
			    		iframe.src = 'kmb://refreshgold';
			    		iframe.style.display = 'none';
			    		$('body').append(iframe);
			    		$(iframe).remove();
					}
					if(data.status == 9001){
						Storage.set('hasCheckin',1,true);
						checkinStatus.over();
						Tools.alertDialog({
			                text: '今天已签到，明天再来吧'
			            });
					}
					//3001签到未开始;3004数量不足;
					if(data.status == 3001 || data.status == 3004){
						var showad = Math.floor(Math.random()*runAD.length);
						if(showNormal){
							checkinStatus.normal();
							new tipsAd({
								type: 'over',
								title: '太遗憾没抢到',
								text: '还有 普通签到 等你参加',
								adImg: runAD[showad].img,
								adLink: runAD[showad].link
							});
						}else{
							new tipsAd({
								type: 'over',
								title: '签到失败',
								text: '明天10点准时再来哦~',
								adImg: runAD[showad].img,
								adLink: runAD[showad].link
							});
						}
					}
				});
			}, 1000);
		}else{
			if($(this).hasClass('over')){
				var showad = Math.floor(Math.random()*runAD.length);
				new tipsAd({
					type: 'over',
					title: '手慢了',
					text: '今日已抢光，明天10点再来吧',
					adImg: runAD[showad].img,
					adLink: runAD[showad].link
				});
				return;
			}
			// if(btn.hasClass('hasCheckin')){
			// 	var showad = Math.floor(Math.random()*runAD.length);
			// 	new tipsAd({
			// 		type: '',
			// 		title: '恭喜你',
			// 		text: '今日签到成功，明天继续哦~',
			// 		adImg: runAD[showad].img,
			// 		adLink: runAD[showad].link
			// 	});
			// 	return;
			// }
			Tools.alertDialog({
                text: '签到未开始，稍后再试',
                time: '0'
            });
		}
	});

	$('#signinNormal').on('click', function(){
		var btn = $(this);
		if(btn.hasClass('checkin')){
			btn.removeClass('checkin');
			setTimeout(function(){
				Ajax.custom({
					url: 'api/v1/checkin/common'
				},function(data){
					if(data.status == 1000){
						checkinStatus.over();
						Storage.set('hasCheckin',1,true);
						var showad = Math.floor(Math.random()*runAD.length);
						var nor_sign_ad = new tipsAd({
							type: 'ok',
							isClose: 'no',
							title: '获得'+data.data.commission + '金币',
							text: '提示：每日前5000名可获得700金币',
							adImg: runAD[showad].img,
							adLink: runAD[showad].link
						});
						// console.log(nor_sign_ad);
						$('#'+nor_sign_ad.id+' .ad a').on('click', function(){
							$('#'+nor_sign_ad.id).remove();
						})
			    		var iframe = document.createElement('iframe');
			    		iframe.src = 'kmb://refreshgold';
			    		iframe.style.display = 'none';
			    		$('body').append(iframe);
			    		$(iframe).remove();
					}
					if(data.status == 9001){
						Storage.set('hasCheckin',1,true);
						checkinStatus.over();
						Tools.alertDialog({
			                text: '今天已签到，明天再来吧'
			            });
					}
					//普通签到人人有份不会有未开始的状态
					// if(data.status == 3001){
					// 	new tipsAd({
					// 		type: 'over',
					// 		title: '签到未开始',
					// 		text: '前5000名可获得700金币',
					// 		adImg: runAD[showad].img,
					// 		adLink: runAD[showad].link
					// 	});
					// }
				});
			}, 1000);
		}
	});

	$('#readA').on('click', function(){
		window.location = 'kmb://main';
	});
	$('#inviteF').on('click', function(){
		window.location = 'kmb://invite';
	});
	$('#shareA').on('click', function(){
		window.location = 'kmb://back';
	});

    var signListPage = new SecondPage('#signList');
    var $btn = $('#signList .btn');
	$('#viewList').on('click', function(){
		var that = $(this);
		if(that.hasClass('shaodeng')){
			Tools.alertDialog({
				text:'5s内限查看一次，请稍后再试~'
			});
			return;
		}
		that.addClass('shaodeng');
		setTimeout(function(){
			that.removeClass('shaodeng');
		},5000);
		pagelist.fun({
			url: 'api/v1/checkin/logs',
            data:{page: 1, page_size: 20}
		});
		$('#listPage').hide();
		signListPage.openSidebar();
		$('#conList').height(innerHeight - $btn.height());
	});
	$btn.on('click', function(){
		signListPage.closeSidebar();
	});

});