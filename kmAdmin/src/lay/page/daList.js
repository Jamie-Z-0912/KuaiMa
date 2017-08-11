layui.define(['global', 'form', 'laydate', 'upload'], function(exports){
	var $ = layui.jquery, 
		layer = layui.layer ,
		form = layui.form(), 
		laydate = layui.laydate;
    $('#side').load('../include/side.html', function(a,b){
    	$('#0_1').addClass('layui-this')
    		.parents('li').addClass('layui-nav-itemed')
    			.siblings().removeClass('layui-nav-itemed');
    	layui.use('element', function(){
	  		var element = layui.element();
		});
    });
    $('#siteTop').load('../include/top.html', function(a,b){
        $('#cur').text('汇总统计');
    });
    /* 增加和操作处的点击 s */
    var operation = {
    	edit: function() {
    		$('#addBtn').remove();
			layer.open({
				title:'修改',
				type: 1,
				skin: 'layui-layer-rim', 
				area: ['280px', '224px'], 
				content: $('#formPane'),
				cancel: function(){ 
					$('#reset').click()
				}
			});
    	},
    	derived: function(){
    		console.log('导出表格')
    	}
    }
	$('.js-operation').on('click', function(){
	    var type = $(this).data('type');
	    operation[type].call(this);
	});
	/* 增加和操作处的点击 e */
	/* 查询的 开始和结束时间 */
	var query = {
		start:{
			min: laydate.now(),
			max: '2099-06-16 23:59:59',
			start: '2014-6-15 23:00:00',
			istime: true,
			format: 'YYYY-MM-DD hh:mm:ss',
			choose: function(datas){
				query.end.min = datas; //开始日选好后，重置结束日的最小日期
				query.end.start = datas //将结束日的初始值设定为开始日
			}
		},
		end:{
	    	min: laydate.now(),
	    	max: '2099-06-16 23:59:59',
			istime: true,
			format: 'YYYY-MM-DD hh:mm:ss',
	    	choose: function(datas){
	      		query.start.max = datas; //结束日选好后，重置开始日的最大日期
	    	}
  		}
	}
	$('#q_startTime').on('click', function(){
		query.start.elem = this;
	    laydate(query.start);
	})
	$('#q_endTime').on('click', function(){
		query.end.elem = this;
	    laydate(query.end);
	});
	/* 查询的 开始和结束时间 e */

	//监听提交
	form.on('submit(check)', function(data){
	    console.log(data)
	    return false;
	});
	
	form.on('submit(update)', function(data){
	    console.log(data)
	    return false;
	});
		
	exports('daList', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});    