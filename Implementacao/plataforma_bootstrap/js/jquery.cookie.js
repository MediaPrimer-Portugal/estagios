/**
 * jQuery Cookie plugin
 *
 * Copyright (c) 2010 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
jQuery.cookie = function (key, value, options) {

    // key and at least value given, set cookie...
    if (arguments.length > 1 && String(value) !== "[object Object]") {
        options = jQuery.extend({}, options);

        if (value === null || value === undefined) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
			var minutes = options.expires, t = options.expires = new Date();
            t.setTime(t.getTime() + (minutes*60*1000));
        }
		
        value = String(value);
		var cookieValue;
		
		//se for o IE
		if (window.navigator.userAgent.indexOf("MSIE ") >= 0)
		{
			cookieValue = encodeURIComponent(key) + '=' + encodeURIComponent(value);
			cookieValue += (options.expires ? '; expires=' + options.expires.toUTCString() : ''); // use expires attribute, max-age is not supported by IE
			cookieValue += (options.path ? '; path=/' + options.path : '');
			cookieValue += (options.domain ? '; domain=' + options.domain : '');
			cookieValue += (options.secure ? '; secure' : '');
		}
        else
		{
			cookieValue = [
				encodeURIComponent(key), '=',
				options.raw ? value : encodeURIComponent(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '',
				options.path ? '; path=' + options.path : '',
				options.domain ? '; domain=' + options.domain : '',
				options.secure ? '; secure' : ''
			].join('');
		}
		
		document.cookie = cookieValue;
		return document.cookie;
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var decode = options.raw ? function (s) { return s; } : decodeURIComponent;
	
	//se for o IE
	if (window.navigator.userAgent.indexOf("MSIE ") >= 0)
	{
		//vou descodificar o cookie
		var result = decode(document.cookie);
		
		//verifico se tenho alguma coisa
		if (result)
		{
			//vou ler o intervalo dos dados
			var searchInicio = escape(key) + '=';
			var inicioIndex = result.indexOf(searchInicio);
			var fimIndex = result.indexOf('}', inicioIndex);
			result = result.substring(inicioIndex + searchInicio.length, fimIndex + 1);
			
			//vou devolver os dados
			return result;
		}
		
		return null;
	}
	else
	{
		//vou ler os dados do cookie
		var result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie);
		
		//vou descodificar e devolvo o resultado
		return (result ? decode(result[1]) : null);
	}
};