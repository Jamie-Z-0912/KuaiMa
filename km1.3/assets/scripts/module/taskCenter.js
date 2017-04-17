define(function(require, exports, module) {
	var Ajax = require('../libs/base');
	var km = require('../plugs/version');
	var Timer = require('../plugs/timer.js');
	require('../plugs/cookieStorage.js');
	if(Tools.auth_token() == 'null'){
    	var opt = { title: "提醒", text: "请在快马浏览器中登录再访问！", time: 5000};
    	Tools.alertDialog(opt, function(){
    		window.location = 'kmb://alertlogin';
    	});
    	return;
    }
    if(km.less('1.1.0')){
		Tools.alertDialog({
			title: '重大更新',
            text: '快马浏览器全新改版<br>签到每次得0.5元<br></br><a style="background-color:#fa0;color:#fff;display:inline-block;padding: 5px 10px;" href="http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser">马上更新</a>',
            time: '0'
        });
        $('#close').remove();
        return;
    }
    if(km.less('1.3.0')){
    	$('#hotSearch').remove();
    }else{
		$('#hotSearch').show();
		$('#hotSearch').on('click', function(){
			window.location = 'kmb://hotsearch';
		});
    }
	if(km.less('1.2.0')){
		$('#replyC, #likeC').remove();
	}else{
		$('#replyC, #likeC').show();
		$('#replyC, #likeC').on('click', function(){
			window.location = 'kmb://main';
		});
	}

	var checkin_jinbi = 700;
    Ajax.custom({ 
        url: 'api/v1/checkin/setting'
    },function(data){
		var d = data.data;
		checkin_jinbi = d.commission || 700;
		if(d.is_checkin){
			Storage.set('hasCheckin', '1', true);
			$('#signin').removeClass('checkin').addClass('hasCheckin').text('已签到');
			$('#leftNum').text('签到获得 '+ checkin_jinbi +'金币');
			$('#timer').parent().html('开抢时间：每日10点');
		}else{
			if(d.left_num > 0){
				$('#leftNum').text('今日剩余 '+d.left_num+'/'+d.total_num);
				new Timer('#timer', d.left_seconds, d.is_start, function(){
					$('#signin').addClass('checkin');
					if(Storage.get('hasCheckin', true) && Storage.get('hasCheckin', true) == 1){
						$('#signin').removeClass('checkin').addClass('hasCheckin');
					}
				});
				$('#timer').parent().show();
			}else{
				$('#leftNum').text('今日剩余 0'+'/'+d.total_num);
				$('#timer').parent().html('开抢时间：每日10点').show();
				$('#signin').addClass('over').text('已抢光');;
				if(Storage.get('hasCheckin', true)){
					Storage.remove('hasCheckin', true);
				}
			}
		}
    });
	var runAD = [
		{'img': './assets/img/runAD/run9.png', 'link': 'http://browser.kuaima.cn/tongji/4qianDao.html?url=https://engine.tuia.cn/index/activity?appKey=2cMgpedEXq4tgEy5Y6f4g963ZTkr&adslotId=495'}
	];
	seajs.use('./assets/scripts/plugs/tipsAd.js',function(a){
		$('#signin').on('click', function(){
			var btn = $(this);
			if(btn.hasClass('checkin')){
				btn.removeClass('checkin');
				var showad = Math.floor(Math.random()*runAD.length);
				var waiting = new a({
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
							btn.addClass('hasCheckin');
							Storage.set('hasCheckin',1,true);
							var showad = Math.floor(Math.random()*runAD.length);
							new a({
								type: 'ok',
								title: '签到成功',
								text: '恭喜你获得'+ data.data.commission + '金币',
								adImg: runAD[showad].img,
								adLink: runAD[showad].link
							});
							$('#leftNum').text('签到获得 '+data.data.commission+'金币');
							$('#signin').removeClass('checkin').addClass('hasCheckin').text('已签到');
							$('#timer').parent().html('开抢时间：每日10点');
				    		var iframe = document.createElement('iframe');
				    		iframe.src = 'kmb://refreshgold';
				    		iframe.style.display = 'none';
				    		$('body').append(iframe);
				    		$(iframe).remove();
						}
						if(data.status == 9001){
							btn.addClass('hasCheckin');
							Storage.set('hasCheckin',1,true)
							Tools.alertDialog({
				                text: '今天已签到，明天再来吧'
				            });
						}
						if(data.status == 3001 || data.status == 3004){
							btn.addClass('over').text('已抢光');
							$('#leftNum').text('今日剩余 0/5000');
							var showad = Math.floor(Math.random()*runAD.length);
							new a({
								type: 'over',
								title: '签到失败',
								text: '今日份额已抢完，明天再来吧',
								adImg: runAD[showad].img,
								adLink: runAD[showad].link
							});
						}
					});
				}, 1000);
			}else{
				if($(this).hasClass('over')){
					var showad = Math.floor(Math.random()*runAD.length);
					new a({
						type: 'over',
						title: '手慢了',
						text: '今日已抢，明天10点准时再来',
						adImg: runAD[showad].img,
						adLink: runAD[showad].link
					});
					return;
				}
				if(btn.hasClass('hasCheckin')){
					var showad = Math.floor(Math.random()*runAD.length);
					new a({
						type: '',
						title: '恭喜你',
						text: '今日签到成功，明天继续哦~',
						adImg: runAD[showad].img,
						adLink: runAD[showad].link
					});
					return;
				}
				Tools.alertDialog({
	                text: '签到未开始，稍后再试',
	                time: '0'
	            });
			}
		});
	    $('#rule').on('click', function(){
			new a({
				type: 'rule',
				subtit: '每天上午10点准时开抢',
				text: '开启提醒，快人一步！<br>数量有限，先到先得！',
				hasAd: '0',
				isClose: 'no',
				btnType: '1'
			});
	    });
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

	seajs.use(['./assets/scripts/plugs/secondPage.js', './assets/scripts/libs/pagelist.js'],function(SecondPage,pagelist){
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
		signList
	})
});