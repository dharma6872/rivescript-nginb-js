var stringutil = {};

stringutil.isEmail = function isEmail(string)
{
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
    return re.test(string);
}

stringutil.replacePath = function replacePath(string, config)
{
    var regex = /\{\$(.*?)_path\}/g;
    var return_string = string;

    while ((matches = regex.exec(string)) != null)
    {
        if(matches!=null)
        {
            var replaceable = matches[0];
            var key = matches[1];

            if(config[key+'_path']!=undefined)
                return_string = stringutil.replaceAll(return_string, replaceable, config[key+'_path']);
        }
    }

    return return_string;
}

stringutil.makeKey = function makeKey(string)
{
    var newstring = "";
    if(string)
    {
        newstring = stringutil.normalize(string);
        newstring = stringutil.replaceAll(newstring, '+', ' ');
        newstring = stringutil.replaceAll(newstring, ' ', '_');
    }

    return  newstring;
}

stringutil.getStringFromArray = function getStringFromArray(string)
{
	if(string.indexOf('[')==-1)
		return string;
	else
	{
		try
		{
			var obj = safeEval(string);
			if(obj.length!=undefined)
			{
				var kick = Math.floor(Math.random() * obj.length);
				return obj[kick];
			}
			else
				return '';
		}
		catch(err)
		{
			return '';
		}
	}
}

stringutil.getStringValue = function getStringValue(value)
{
    var return_value = '';
    switch(typeof(value))
    {
        case 'string':
            return_value = "'" + value + "'";
            break;

        case 'number':
            return_value = value;
            break;

        case 'object':

            if(value==null)
                return_value = value;
            else
            {
                var valuestring = JSON.stringify(value);
                return_value = "'" + valuestring + "'";
            }
            break;

        default:
            return_value = "'" + value + "'";
            break;
    }

    return return_value;
}

stringutil.replaceAll = function replaceAll(string, target, replacement)
{
    return string.split(target).join(replacement);
};

stringutil.normalize = function normalize(string)
{
    var newstring = "";
    if(string)
    {
        string = string.toString();
        newstring = string.toLowerCase();
        newstring = newstring.trim();
        newstring = stringutil.accentFold(newstring);
    }

    return  newstring;
}

stringutil.makeSlug = function makeSlug(string)
{
    var newstring = "";
    if(string)
    {
        newstring = stringutil.normalize(string);
        newstring = stringutil.replaceAll(newstring, '+', ' ');
        newstring = stringutil.replaceAll(newstring, ' ', '-');
        newstring = stringutil.replaceAll(newstring, '//', '/');
    }

    return  newstring;
}

stringutil.accentFold = function accentFold(string, percentage)
{
    percentage = percentage || 1;

    var ret = '';
    var accent_map =
    {
        'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a', // a
        'ç': 'c',                                                   // c
        'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',                     // e
        'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',                     // i
        'ñ': 'n',                                                   // n
        'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o', 'ø': 'o', // o
        'ß': 's',                                                   // s
        'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',                     // u
        'ÿ': 'y'                                                    // y
    };

    if (!string) { return ''; }

    if(percentage<1)
    {
        ret = string;
        var toreplace = [];
        for (var i = 0; i < string.length; i++)
        {
            if(accent_map[string.charAt(i)])
                toreplace.push({char:string.charAt(i), replace:accent_map[string.charAt(i)]});
        }

        var charlength = toreplace.length;
        var vlr = (charlength * percentage) + (percentage * 1.5 * Math.random());
        var charcount = Math.floor(vlr);
        charcount = (charcount>charlength) ? charlength : charcount;

        for (var i = 0; i < charcount; i++)
        {
            var index = Math.floor(Math.random() * charlength);
            var char = toreplace[index].char;
            var repalce = toreplace[index].replace;

            ret = ret.replace(char, repalce);
        }
    }
    else
    {
        for (var i = 0; i < string.length; i++)
            ret += accent_map[string.charAt(i)] || string.charAt(i);
    }

    return ret;
}

stringutil.isURL = function isURL(str)
{
    var pattern = new RegExp('^(https?:\\/\\/)?'+
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+
    '((\\d{1,3}\\.){3}\\d{1,3}))'+
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
    '(\\?[;&a-z\\d%_.~+=-]*)?'+
    '(\\#[-a-z\\d_]*)?$','i');

    return pattern.test(str);
}

stringutil.tcEncode = function tcEncode(string)
{
    response = '';

    var encode_map =
    {
        '1': 'c',
        '2': 'G',
        '3': 'A',
        '4': 's',
        '5': 'J',
        '6': 'k',
        '7': 'l',
        '8': 'U',
        '9': 'f',
        '0': 'H'
    };

    for (var i = 0; i < string.length; i++)
        response += encode_map[string.charAt(i)] || string.charAt(i);

    return response;
}

stringutil.tcDecode = function tcDecode(string)
{
    response = '';

    var decode_map =
    {
        'c': '1',
        'G': '2',
        'A': '3',
        's': '4',
        'J': '5',
        'k': '6',
        'l': '7',
        'U': '8',
        'f': '9',
        'H': '0'
    };

    for (var i = 0; i < string.length; i++)
        response += decode_map[string.charAt(i)] || string.charAt(i);

    return response;
}

module.exports = stringutil
