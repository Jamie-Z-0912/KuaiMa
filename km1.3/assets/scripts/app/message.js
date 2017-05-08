define('app/message', function(require, exports, module) {
	var pagelist = require('../mod/pagelist');
    pagelist.fun({ 
        url: 'api/v1/msgs',
        data:{page: 1, page_size: 20}
    });
    $('#conList').on('click', 'li', function(){
        var that = $(this);
        var action = that.data('action');
        if(action.length > 6){
            window.location = action;
        }else{
            if(that.data('type') == '3'){
                window.location = 'kmb://main';
            }else{
                var f_id = $(this).data('fatherid');
                window.location = 'kmb://comment?fatherid='+f_id;
            }
        }
    })
})