layui.define(['global', 'form', 'laydate'], function(exports){
	var $ = layui.jquery, 
		layer = layui.layer ,
		form = layui.form(), 
		laydate = layui.laydate;
    $('#side').load('../include/side.html', function(a,b){
    	$('#1_1').addClass('layui-this');
    	layui.use('element', function(){
	  		var element = layui.element();
		});
    });
    $('#siteTop').load('../include/top.html', function(a,b){
        $('#cur').text('应用版本');
    });
    /* 增加和操作处的点击 s */
    var operation = {
    	add: function() {
    		$('#updateBtn').remove();
			layer.open({
				title:'广告位开关添加',
				type: 1,
				skin: 'layui-layer-rim', 
				area: ['390px', '616px'], 
				content: $('#formPane'),
				cancel: function(){ 
					$('#reset').click()
				}
			});
    	},
    	edit: function() {
    		$('#addBtn').remove();
			layer.open({
				title:'广告位开关修改',
				type: 1,
				skin: 'layui-layer-rim', 
				area: ['390px', '616px'], 
				content: $('#formPane'),
				cancel: function(){ 
					$('#reset').click()
				}
			});
    	}
    }
	$('.js-operation').on('click', function(){
	    var type = $(this).data('type');
	    operation[type].call(this);
	});
	/* 增加和操作处的点击 e */
	
	//事件监听
	form.on('select', function(data){
	    console.log(data);
	});

	//监听提交
	form.on('submit(check)', function(data){
	    console.log('check：'+data)
	    return false;
	});
	form.on('submit(add)', function(data){
	    console.log('add：'+data)
	    return false;
	});
	form.on('submit(update)', function(data){
	    console.log('update：'+data)
	    return false;
	});
		
	exports('appVersion', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});    