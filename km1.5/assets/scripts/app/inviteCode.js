define('app/inviteCode', function(require, exports, module) {
    var Ajax = require('../mod/base');
    var code = Tools.getQueryValue('code');
    $('#code').text(code);
    
});