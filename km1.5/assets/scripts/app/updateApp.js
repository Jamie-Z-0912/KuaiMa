define('app/updateApp', function(require, exports, module) {
    var km =  require('../plugs/version.js');
    require('../mod/tools');
    if(km.gEq('1.5.0')){ 
        var k = Tools.getQueryValue('k');
        if(k!='') window.location = 'kmb://'+k;
    }
});