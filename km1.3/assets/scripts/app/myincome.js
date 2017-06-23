define('app/myincome', function(require, exports, module) {
	var pagelist = require('../mod/pagelist');
	var km = require('../plugs/version');
	
	$('#nav').on('click', 'li', function(){
		var id = $(this).data('id');
		$(this).addClass('active').siblings().removeClass('active');
		$('#'+id).show().siblings('.main-list').hide();
	});
	var p = Tools.getQueryValue('type');
	if(p == 'cash'){
		$('#nav li[data-id="rmbListWrap"]').click();
	}
	//金币汇总
	Ajax.custom({
		url: 'api/v1/coin/info'
	}, function(data){
		var d = data.data;
		$('#YUE').text(d.yue);
		$('#TINCOME').text(d.totalIncome);
		$('#YEXCHANGE').text(d.yesterdayExchangeRate);
		$('#YRMB').text(d.yesterdayIncome);
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
	})
});