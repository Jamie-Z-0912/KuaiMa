layui.define(['global', 'form', 'laypage', 'laydate'], function(exports){
	var $ = layui.jquery, 
		layer = layui.layer,
        laypage = layui.laypage,
		form = layui.form(), 
		laydate = layui.laydate;
		
    /*分页*/
	laypage({
		cont: 'page', pages: 100, groups: 5, skip: true, curr: 1,
        jump: function(obj){
        	var that = this;
            console.log(obj.curr) //当前查询的页数
            //数据查询
	            //查询结果中的总页数是total
	            var total=100;
	            that.pages = total;
        }
    });
    
    /* 增加和操作处的点击 s */
    var operation = {
    	add: function() {
    		$('#updateBtn').remove();
			layer.open({
				title:'添加',
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
				title:'修改',
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
		
	exports('adLocationConfig', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});    