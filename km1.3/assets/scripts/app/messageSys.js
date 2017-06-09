define('app/messageSys', function(require, exports, module) {
	var pagelist = require('../mod/pagelist');
    
    function isToday(t){
        var curY = new Date().getFullYear(), 
            curM = new Date().getMonth() + 1, 
            curD = new Date().getDate();
        var day = t.split(' ')[0], time = t.split(' ')[1];
        day = day.split('-');
        if(day[0] == curY && day[1] == curM && day[2] == curD){
            return '今天 ' + time;
        }else{
            return t;
        }
    }
    pagelist.fun({ 
        url: 'api/v1/systemMsgs',
        data:{ page: 1, page_size: 20} 
    },function(d){
        if(d.page == 1){
            for (var i = 0; i < d.data.length; i++) {
                var data = d.data[i];
                if(isToday(d.data[i].added_time) == data.added_time){
                    break;
                }else{
                    d.data[i].added_time = isToday(data.added_time);
                }
                if(d.data[i].need_login==1){
                    d.data[i].action = data.action + '?auth_token=' + Tools.auth_token();
                }
            }
        }
    });
})