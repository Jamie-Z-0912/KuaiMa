define(function(require, exports, module) {
	var Ajax = require('../libs/base');
    var Timer = function(el,t,callback){
		this.el = el;
		this.remaining = t/1000;
		this.isFirst = true;
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
		$(_self.el).html('<em class="h">'+_self.zeroize(h)+'</em>:<em class="m">'+_self.zeroize(m)+'</em>:<em class="s">'+_self.zeroize(s)+'</em>').show().prev().show();
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
	Ajax.custom({
    	url: 'api/v1/coin/queryActivity'
    },function(data){
    	if(data.data.countDown==0 || !data.data.activity_status){
    		$('.header-timer').remove();
    	}else{
    		$('#nav').removeClass('no_act').addClass('act');
	    	var beginTime = Ajax.formatDate(data.data.activity.begin_time,'yyyy-MM-dd');
	    	var EndTime = Ajax.formatDate(data.data.activity.ent_time,'yyyy-MM-dd');
	    	$('#periods').text(data.data.periods+'期');
	    	var reward_desc = data.data.activity.reward_desc;
	    	reward_desc = reward_desc.replace(/奖金/,'奖金<i>');
	    	reward_desc = reward_desc.replace(/元/,'</i>元');
	    	$('#rewardDesc').html(reward_desc);

    		new Timer('#timer', data.data.countDown);
    		$('.header-timer').show();
    		seajs.use('./assets/scripts/plugs/tipsAd.js',function(a){
		    	$('#rule').on('click', function(){
					new a({
						type: '',
						subtit: '<span style="line-height:1.5;"></span>活动时间：<br>'+beginTime+'至'+EndTime,
						text: '<p style="text-align: left;padding: 0 .2rem;">'
							+'<i style="color:#fa3719">活动规则</i>：根据每日收益排名，今日榜单实时更新。每日前十名可获得相应额外奖励。奖励名单以当日最终榜单为准。'
							+'<br><i style="color:#fa3719">奖励发放</i>：当日奖励会在次日凌晨结算期间自动发放到获奖账户。可在收入明细中查看奖励到账情况。</p>',
						hasAd: '0',
						isClose: 'no',
						btnType: '1'
					});
		    	})
    		})
    	}
    });
    
    var todayData = function(){
	    Ajax.custom({
	    	url: 'api/v1/coin/rank/today'
	    },function(data){
    		var contpl={day:true, rmbtmpl:'' };
	    	if(data.data.activity_status){
	    		$('#today').css('padding-top', '2.2rem');
	    		contpl.rmbtmpl = $('#rmbtmpl').text();
	    	}else{
    			// $('#todayList').eq(3).remove();
	    	}
	        Ajax.render('#todayList', '#conList-tmpl', data.data, contpl, true);
	    });
	    var tt = window.setTimeout(function(){
	    	window.clearTimeout(tt);
	    	todayData();
	    },10000);
    };
    todayData();

    Ajax.custom({
    	url: 'api/v1/coin/rank/yesterday'
    },function(data){
    	var issue = data.data.yes_date.substr(5);
    	// $('#nav li[data-id="lastIssue"]').text(issue);
    	var contpl={day:null, rmbtmpl:'' };
    	if(data.data.activity_status){
    		$('#today').css('padding-top', '2.2rem');
    		contpl.rmbtmpl = $('#rmbtmpl').text();
    	}else{
			// $('#yesterdayList th').eq(3).remove();
    	}
        Ajax.render('#yesterdayList', '#conList-tmpl', data.data, contpl, true);
    });

    Ajax.custom({
    	url: 'api/v1/coin/rank/all'
    },function(data){
    	var contpl={day:null, rmbtmpl:'' };
        Ajax.render('#totalList', '#conList-tmpl', data.data, contpl, true);
    });

	$('#nav').on('click', 'li', function(){
		var curEl = $(this);
		var id = curEl.data('id');
		$(this).addClass('active').siblings().removeClass('active');
		$('#'+id).show().siblings('.main-list').hide();
	});
});