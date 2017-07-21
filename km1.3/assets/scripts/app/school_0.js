define('app/school0', function(require, exports, module) {
    var $ = require('zepto');
    var km = require('../plugs/version.js');
    if(km.less('1.4.2')){
    	if(/Android/.test(km.userAgent)){
	    	$('.v142').show()
	    	$('.v142 h2').append('<a class="download_link" href="http://a.app.qq.com/o/simple.jsp?pkgname=com.kuaima.browser">下载新版本 &gt;</a>')
	    }
    }else{
    	$('.v142').show()
    }
});