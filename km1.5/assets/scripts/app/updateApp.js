define('app/updateApp', function(require, exports, module) {
    var km =  require('../plugs/version.js');
    require('../mod/tools');
    // if(km.gEq('1.5.0')){ 
    	document.getElementById('con').innerHTML = '<p class="cur_v">加入团队<br>多拿一份团队分红<br>这样的好事儿<br>当然要参与进来啦<br>要挣就挣双份儿吧！</p>';
        var k = Tools.getQueryValue('k');
        if(k!='') window.location = 'kmb://'+k;
    // }
});