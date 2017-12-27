define('app/sign', function(require, exports, module) {
	var Ajax = require('../mod/base'),
        popups = require('../plugs/popups.js');

	Ajax.custom({
		url:'api/v1/business/wx_mp/daily_sign/status'
	},function(data){
		if(data.status==1000){
			var d = data.data,$days = $('#days li');
			var r_n = d.sign_num>6?6:d.sign_num;
			if(r_n>0){
				for (var i = 0; i < r_n; i++) {
					$days.eq(i).addClass('has_get')
				};
				if(!d.today) $days.eq(r_n).addClass('cur');
			}else{
				if(d.today) $days.eq(0).addClass('has_get');
				else $days.eq(0).addClass('cur');
			}
			if(d.today) $('#signBtn').addClass('hasget').text('今日已签');

			for (var i = 0; i < d.rules.length; i++) {
				$days.eq(i).find('.num').text(d.rules[i]+'个');
			};
			var tips;
			if(d.sign_num>2) tips = '恭喜您，已连续签到'+d.sign_num+'天，';
			else tips = '已经连续签到'+d.sign_num+'天，';

			if(d.today){
				tips+='明天可领取'+d.rules[r_n]+'个宝箱';
			}else {
				tips+='今天可领取'+d.rules[r_n]+'个宝箱';
			}

			$('#tips').text(tips);
		}else{
            Tools.alertDialog({
                text: data.desc
            })
		}
	});

	
    $('#signBtn').on('click', function(){
    	var self = $(this);
    	if(!self.hasClass('hasget')){
    		//请求签到接口
    		Ajax.custom({
    			url:'api/v1/business/wx_mp/daily_sign/sign'
    		},function(data){
    			if(data.status==1000){
    				self.addClass('hasget').text('今日已签');
    				var d = data.data;
	                new popups({
	                	className:'sign_pop',
	                	topTxt: '<div class="box_n"><span>'+d.box_num+'个</span></div>',
	                    title:'<img src="../image/sign/sign_a_t.png"/>',
	                    img:'../image/sign/sign_box.png',
	                    botTxt:'你已连续签到'+d.sign_num+'天，明日签到可获得'+d.next_box_num+'个宝箱哦~'
	                });
    				$('#days li.cur').addClass('has_get').removeClass('cur');
    			}else{
		            Tools.alertDialog({
		                text: data.desc
		            })
    			}
    		})
    	}
    })
})