define('app/static_qmInvite', function(require, exports, module) {
	var Ajax = require('../mod/base');
	var km = require('../plugs/version');
	var Timer = function(el,t,callback){
		this.el = el;
		this.remaining = parseInt(t);
		this.zeroize = function(n){
			return n < 10 ? '0'+n : ''+n;
		}
		this.callback = callback;
		this.init();
	};
	Timer.prototype.init = function(){
		var  _self = this, h, m, s;
		h = parseInt(_self.remaining/(60*60));
		m = parseInt(_self.remaining%(60*60)/(60));
		s = parseInt(_self.remaining%(60*60)%(60));
		$(_self.el).html('<em class="h">'+_self.zeroize(h)+'</em><span>时</span><em class="m">'+_self.zeroize(m)+'</em><span>分</span><em class="s">'+_self.zeroize(s)+'</em><span>秒</span>');
		_self.count();
	};
	Timer.prototype.count = function(){
		var  _self = this, h, m, s;
		var ss, mm, hh;
		s = parseInt($(_self.el+' .s').text());
		m = parseInt($(_self.el+' .m').text());
		h = parseInt($(_self.el+' .h').text());

		ss = s > 0 ? s-1 : ( m==0 && h==0 ? 0 : 59 );
		$(_self.el+' .s').text(_self.zeroize(ss));

		if(s==0){
			mm = m > 0 ? m-1 : ( h==0 ? 0 : 59); 
			$(_self.el+' .m').text(_self.zeroize(mm));
		}
		if(s==0&&m==0){
			hh = h > 0 ? h-1 : 0; 
			$(_self.el+' .h').text(_self.zeroize(hh));
		}

		if(ss==0&&m==0&&h==0){
			$.isFunction(_self.callback)&&_self.callback();
			return;
		}
		setTimeout(function(){_self.count()}, 1000);
	};
	function rewardTable(d_arr){
    	var arr = [];
    	arr.push('<div id="popBg" class="pop-mask km-dialog hide"></div>');
    	arr.push('<div id="rewardTable" class="pop-screen km-dialog reward_table">');
    	arr.push('<div id="closeRewardTable" class="rt_close"><i class="iconfont icon-close"></i></div>')
    	arr.push('<div class="con">');
    	arr.push('<h4>奖励对照表</h4>');
    	arr.push('<div class="th"><span>累计赏金徒弟数</span><span>奖励现金（元）</span></div>')
    	arr.push('<ul class="list">');
    	for (var i = 0; i < d_arr.length; i++) {
    		var d = d_arr[i].split(':');
    		if(d.length==2) arr.push('<li><span>'+d[0]+'</span><span>'+d[1]+'</span></li>');
    	};
    	arr.push('</ul>')
    	arr.push('</div>')
    	arr.push('</div>');
    	$('body').append(arr.join(''));
    	$('#closeRewardTable').on('click', function(){
    		$('#rewardTable, #popBg').hide();
    	})
	}
	function schedule(d, jiangli){
		var find = true, curArr, nextArr, leftNum, sch='0%';
    	for (var i = 0; i < jiangli.length; i++) {
    		if(find)
	    		for (var j = 0; j < 2; j++) {
	    			if(d < jiangli[i][0]){
	    				if(i==0){
		    				curArr = ['0','0'];
		    				nextArr = jiangli[i];
		    				leftNum = jiangli[i][0] - d;
	    					sch = d/jiangli[i][0]*100 + '%';
	    				}else{
		    				curArr = jiangli[i-1];
		    				nextArr = jiangli[i];
		    				leftNum = jiangli[i][0] - d;
	    					sch = ( d - jiangli[i-1][0] )/( jiangli[i][0] - jiangli[i-1][0] )*100 + '%';
	    				}
	    				find = false;
	    			}
	    			if(d == jiangli[i][0]){
	    				rmb = jiangli[i][1];
	    				curArr = jiangli[i];
	    				nextArr = jiangli[i+1];
	    				leftNum = jiangli[i+1][0] - d;
	    				find = false;
	    			}
	    		};
    	};
    	return {
    		'tudi': d,
    		'curArr': curArr, 
    		'nextArr': nextArr, 
    		'leftNum': leftNum, 
    		'sch': sch
    	}
	}
	function gameOver(d,jiangli){
		$('#tudi').text(d);
		var rmb, find = true;
		if(d==0){
			rmb = 0;
		}else{
	    	for (var i = 0; i < jiangli.length; i++) {
	    		if(find)
		    		for (var j = 0; j < 2; j++) {
		    			if(d < jiangli[i][0]){
		    				rmb = i<1?0:jiangli[i-1][1];
		    				find = false;
		    			}
		    			if(d == jiangli[i][0]){
		    				rmb = jiangli[i][1];
		    				find = false;
		    			}
		    		};
	    	};
		}
    	$('#rmb').text(rmb);
		$('#over').removeClass('hide'); //活动结束
		$('#activity').remove();
	}
	function gameing(leftSeconds,validSonNum,jiangli_arr,tSonNum){
		var t_24h = 24*60*60;
		if(leftSeconds > t_24h){
			var left_h = parseInt(leftSeconds/3600);
			$('#timer').html('<em>'+ parseInt(left_h/24) +'</em><span>天</span><span></span><em>'+ (left_h%24) +'</em><span>小时</span>');
		}else{
			new Timer('#timer', leftSeconds, function(){
				gameOver(validSonNum, jiangli_arr)
			});
		}
		var schData = schedule(validSonNum, jiangli_arr);
		console.log(schData)
		schData.tTudi = tSonNum;
		Ajax.render('#main', '#main-tmpl', schData, undefined, true);
		$('#activity').removeClass('hide');
	}

    Ajax.custom({
        url:'api/v1/activity/info',
        data:{
        	activityId:3
        }
    }, function(data){
    	if(data.status==1000){
	    	var d = data.data;
	    	/* 描述 */
	    	var desc_arr =  d.activity.desc.split(';'), desc='';
	    	for (var i = 0; i < desc_arr.length; i++) {
	    		desc += '<li>'+ desc_arr[i] +'</li>';
	    	};
	    	$('.rule ol').html(desc);
	    	/* 规则对照表 */
			var _d = d.activity.rule, d_arr = _d.split(';'),jiangli_arr = [];
	    	rewardTable(d_arr); //生成对照表
	    	for (var i = 0; i < d_arr.length; i++) {
	    		var dd = d_arr[i].split(':');
	    		if(dd.length==2){
	    			jiangli_arr.push(dd);
	    		};
	    	};
	    	if(d.isJoin){
	    		if(d.isEnd){    		
	    			gameOver(d.validSonNum, jiangli_arr)
	    		}else{ //活动进行中
					gameing(d.leftSeconds, d.validSonNum, jiangli_arr, d.totalSonNum)
	    		}
	    		$('#yuRe').remove();
	    	}else{
	    		if(d.isEnd){
	    			gameOver(0, jiangli_arr)
	    		}else{
		    		if(!d.isStart){
		    			$('#baoMing').addClass('gray').find('a').text('活动即将开始');
		    		}
		    		$('#yuRe').removeClass('hide');
	    		}
	    	}
    	}else{
	    	if(data.status==1013){
	    		Tools.alertDialog({
	    			title:'提醒',
	    			text:'收徒异常，请联系客服！<br>客服QQ：251843709',
	    			time:'999999999'
	    		})
	    		return;
	    	}
	    	if(data.status==1007){
	    		Tools.alertDialog({
	    			title:'提醒',
	    			text:'报名失败，请稍后重试',
	    			time:'999999999'
	    		})
	    		return;
	    	}

    		Tools.alertDialog({
    			title:'提醒',
    			text: data.desc,
    			time:'0'
    		});
    	}
    });
	$('#toFriend').on('click', function(){
		window.location = '../myfriend.html?auth_token='+Tools.auth_token();
	})
    $('#baoMing').on('click', function(){
    	if(!$(this).hasClass('gray')){
	    	Ajax.custom({
	    		url:'api/v1/activity/join',
		        data:{
		        	activityId:3
		        }
	    	},function(d){
	    		if(d.status == 1000){
					var arr = [];
					arr.push('<div id="popBg" class="pop-mask km-dialog"></div>');
					arr.push('<div id="success" class="pop-screen km-dialog success">');
					arr.push('<div class="box">');
					arr.push('<h2>恭喜你报名成功</h2>');
					arr.push('<p>活动日期为9月11号-10月10号，快去拿3.6万现金大奖吧！</p>');
					arr.push('<div class="btnbox"><a href="kmb://invite">马上收徒</a></div>')
					arr.push('</div>')
					arr.push('</div>');
					$('body').append(arr.join(''));
					$('#success').height($('#success .box').height());
	    		}else{
			    	if(data.status==1013){
			    		Tools.alertDialog({
			    			title:'报名失败',
			    			text:'收徒异常，请联系客服！<br>客服QQ：251843709',
			    			time:'999999999'
			    		})
			    		return;
			    	}

			    	if(data.status==1007){
			    		Tools.alertDialog({
			    			title:'提醒',
			    			text:'报名失败，请稍后重试',
			    			time:'999999999'
			    		})
			    		return;
			    	}

	    			Tools.alertDialog({
	    				title: '报名失败',
	    				text: d.desc
	    			});
	    		}
	    	})
    	}
    });
    
	$('.showRewardTable').on('click', function(){ 
		$('#rewardTable, #popBg').show();
		$('#rewardTable').height($('#rewardTable .con').height());
    })

});