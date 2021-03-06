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
    
    /* 增加和操作处的点击 s */
    var operation = {
    	lostAll: function(){
    		console.log('全部忽略')
    	},
    	passAll: function(){
    		console.log('全部通过')
    	},
    	lose: function() {
    		console.log('忽略')
    	},
    	pass: function(){
    		console.log('通过')
    	}
    }
	$('.js-operation').on('click', function(){
	    var type = $(this).data('type');
	    operation[type].call(this);
	});
	/* 增加和操作处的点击 e */

    /* 复选框方法 */
	function checkbox_val(plat, cruVal, isCheck){
		var value = $('input[name="'+ plat +'"]').val();
	    if(isCheck){
	    	if(value==''){
				$('input[name="'+ plat +'"]').val(cruVal)
	    	}else{ 
	    		$('input[name="'+ plat +'"]').val(value+','+cruVal)
	    	}
	    }else{
	    	var _v = value.split(','),v=[];
	    	if(_v.length==1) $('input[name="'+ plat +'"]').val('');
	    	else{
	    		for (var i = 0; i < _v.length; i++) {
	    			if(_v[i] != cruVal){
	    				v.push(_v[i]);
	    			}
	    		};
	    		$('input[name="'+ plat +'"]').val(v.join(','));
	    	}
	    }
	    console.log($('input[name="'+ plat +'"]').val());
	}

	form.on('checkbox(chkItem)', function(data){
	    checkbox_val('chkItem',data.value,data.elem.checked)
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

	exports('initialUserApply', {}); //注意，这里是模块输出的核心，模块名必须和use时的模块名一致
});    