var xmlHttpObject = null;
var server = window.location.protocol + '//' + window.location.host;

var getXmlHttp = function()
{
    if (xmlHttpObject)
        return xmlHttpObject;

    try {
        xmlHttpObject = new ActiveXObject('Msxml2.XMLHTTP');
    }
    catch (e0) {
        try {
            xmlHttpObject = new ActiveXObject('Microsoft.XMLHTTP');
        }
        catch (e1) {
            xmlHttpObject = false;
        }
    }
    if (!xmlHttpObject && typeof XMLHttpRequest!='undefined')
        xmlHttpObject = new XMLHttpRequest();
    return xmlHttpObject;
};

var sendRequest = function(query, callback) {
    var req = getXmlHttp();
    var queryString = "";
    var count = 0;
    for (var key in query) {
        if (count)
            queryString += "&";
        count++;
        queryString += key + '=' + encodeURIComponent(query[key]);
    }
    req.open('GET', server + '?' + queryString, true);
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            if(req.status == 200) {
                callback(req.responseText);
            }
        }
    };
    req.send(null);
};

var sendRequestWithDataAndFile = function(action, data, file, callback)
{
    var req = getXmlHttp();
    var form = new FormData();
    form.append("action", action);
    form.append("data", JSON.stringify(data));
    form.append("file", file);

    req.open('POST', server, true);
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            if(req.status == 200) {
                if (callback)
                    callback(req.responseText);
            }
        }
    };
    req.send(form);
};

var addEvent = function(object, type, callback)
{
    if (typeof(object) == "string")
        object = document.getElementById(object);
    if (object == null || typeof(object) == "undefined")
        return;

    if (object.addEventListener)
        object.addEventListener(type, callback, false);
    else if (object.attachEvent)
        object.attachEvent("on" + type, callback);
    else
        object["on" + type] = callback;
};

var urlParameters = null;

var getUrlParameters = function() {
    if (urlParameters)
        return urlParameters;

    urlParameters = { };
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    var i;
    for (i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        var key = decodeURIComponent(pair[0]);
        var value = decodeURIComponent(pair[1]);
        urlParameters[key] = value;
    }
    return urlParameters;
};

var formatString = function(format) {
    var result = format;
    for (var i = 1; i < arguments.length; i++)
    {
        result = result.replace('{' + (i - 1) + '}', arguments[i]);
    }
    return result;
};

var escapeHtml = function(unsafe)
{
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

var generateUid = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};
