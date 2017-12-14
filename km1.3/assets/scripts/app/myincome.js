define('app/myincome', function(require, exports, module) {
	var pagelist = require('../mod/pagelist');
	var km = require('../plugs/version');
    if( km.less('1.4.4') ){
		require('../plugs/storageCache.js');
		var confirmTip = require('../plugs/confirmTip.js');
		var updateTips = {
	    	expire: function(){
	    		var mydate = new Date(),
	    			today = mydate.toLocaleDateString(),
	    			now = Math.ceil(mydate.getTime()/1000);
	    		var expTime = new Date(today +' 23:50:00').getTime()/1000;
				return (expTime-now) > 0 ? expTime-now : null;
	    	},
	    	yes: function(){
	    		if(Storage.getCache('updateTips')){
	    			return false;
	    		}else{
		    		if(this.expire()){
		    			Storage.setCache('updateTips',1,this.expire());
		    		}
	    			return true;
	    		}
	    	}
	    };
	    if(updateTips.yes()){
		    new confirmTip({
		        title: '<p style="padding: .1rem 0; line-height:1.8">请升级至1.4.4版本<br>8月30日起低版本将不能提现！</p>',
		        sureTxt: '去升级',
		        cancelTxt: '知道了'
		    },function(a){
		        if(a){
		        	window.location = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser';
		        }
		    });
	    }
	}
	$('#nav').on('click', 'li', function(){
		var id = $(this).data('id');
		$(this).addClass('active').siblings().removeClass('active');
		$('#'+id).show().siblings('.main-list').hide();
	});
	var p = Tools.getQueryValue('type');
	if(p == 'cash'){
		$('#nav li[data-id="rmbListWrap"]').click();
	}
	var  canQuery = true, cutTime = 5;
	//金币汇总
	Ajax.custom({
		url: 'api/v1/coin/info'
	}, function(data){
		var d = data.data;
		$('#YUE').text(d.yue);
		$('#TINCOME').text(d.totalIncome);
		$('#YEXCHANGE').text(d.yesterdayExchangeRate);
		$('#YRMB').text(d.yesterdayIncome);
		if(d.serverHour<cutTime) canQuery = false;
	})
	//金币明细
	pagelist.fun({
		url: 'api/v1/coin/list',
		renderFor: '#goldList-tmpl',
        renderEle: '#goldList',
		pagingDom: '#goldPage',
		data:{ 
			page: 1, page_size: 20
		}
	}, function(d){
		if(d.page == 5){
			$('#goldPage').html('<div class="laypage_main"><span>仅可查看最近100条数据</span></div>')
		}
	});
	//零钱收益明细
	pagelist.fun({
		url: 'api/v1/income/list',
		renderFor: '#rmbList-tmpl',
        renderEle: '#rmbList',
		pagingDom: '#rmbPage',
		data:{ 
			page: 1, page_size: 20
		}
	}, function(d){
		for (var i = 0; i < d.data.length; i++) {
			d.data[i].amount = d.data[i].amount < 0 ? ''+d.data[i].amount : '+'+d.data[i].amount;
		};
		if(d.page == 5){
			$('#rmbPage').html('<div class="laypage_main"><span>仅可查看最近100条数据</span></div>')
		}
	});
	if(km.less('1.4.1')){
		$('.b-fixed').remove();
	}else{
		$('.b-fixed').show();
	}
	$('#exchangeTip').on('click', function(){
		Tools.alertDialog({
			text:'金币转换汇率会受每日广告收益影响，上下会有浮动',
			time:5000
		})
	});
	$('#duiba').on('click', function(){
		if(canQuery){
			window.location = 'kmb://openduiba';
		}else{
			Tools.alertDialog({
				text: '为了保证您昨日金币正常结算<br>请上午'+cutTime+'点后再来提现',
				time: '0'
			})
		}
	});
	$('#progress').on('click',function(){
		if(/browser.kuaima/.test(location.hostname)){
			window.location = 'http://browser.kuaima.cn/myMoneyProgress.html?auth_token='+Tools.auth_token();
		}else{
			window.location = 'http://t.kuaima.cn/browser/myMoneyProgress.html?auth_token='+Tools.auth_token();
		}
	})
});