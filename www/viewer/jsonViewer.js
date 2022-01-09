
function jsonViewer(json, collapsible=false) {
    var TEMPLATES = {
        item: '<div class="json__item"><div class="json__key">%KEY%</div><div class="json__value json__value--%TYPE%">%VALUE%</div></div>',
        itemCollapsible: '<label class="json__item  collapsible json__item--collapsible%CLASS%"><input type="checkbox" class="json__toggle"/><div class="json__key">%KEY%</div><div class="json__value json__value--type-%TYPE%">%VALUE%</div>%CHILDREN%</label>',
        itemCollapsibleOpen: '<label class="json__item collapsible json__item--collapsible%CLASS%"><input type="checkbox" checked class="json__toggle"/><div class="json__key">%KEY%</div><div class="json__value json__value--type-%TYPE%">%VALUE%</div>%CHILDREN%</label>'
    };

    function createItem(key, value, type){
        var element = TEMPLATES.item.replace('%KEY%', key);
        if (type === 'string') {
            element = element.replace('%VALUE%', '"' + value + '"');
        } else {
            element = element.replace('%VALUE%', value);
        }
        element = element.replace('%TYPE%', type);
        return element;
    }

    function createCollapsibleItem(key, value, type, children){
        var tpl = 'itemCollapsible';

        if (collapsible) {
            tpl = 'itemCollapsibleOpen';
        }

        var element = TEMPLATES[tpl].replace('%KEY%', key);
        if (type === 'object') {
            element = element.replace('%VALUE%', value);
        } else {
            element = element.replace('%VALUE%', type);
        }
        if (key === 'actions') {
            element = element.replace('%CLASS%', " actions");
        } else {
            element = element.replace('%CLASS%', "");
        }
        element = element.replace('%TYPE%', type);
        element = element.replace('%CHILDREN%', children);

        return element;
    }

    function handleChildren(key, value, type) {
        var html = '';
        var fragment = '';
        for (var item in value) {
            var _key = item,
                _val = value[item];
            if (_key === 'fragment') {
                fragment = formatFragment(_val);
            } else {
                html += handleItem(_key, _val);
            }
        }

        return createCollapsibleItem(key, fragment, type, html);
    }

    function formatFragment(fragment) {
        var template = '[%S_ROW%, %S_COL%] - [%T_ROW%, %T_COL%] (%S_IDX%, %T_IDX%)';
        for (var item in fragment) {
            if (item === 'start') {
                var sInfo = fragment[item];
                template = template.replace('%S_ROW%', sInfo["row"]);
                template = template.replace('%S_COL%', sInfo["column"]);
                template = template.replace('%S_IDX%', sInfo["index"]);
            } else if (item === 'end') {
                var tInfo = fragment[item];
                template = template.replace('%T_ROW%', tInfo["row"]);
                template = template.replace('%T_COL%', tInfo["column"]);
                template = template.replace('%T_IDX%', tInfo["index"]);
            }
        }
        if ('[1, 1] - [1, 1] (0, 0)' === template) {
            return "metadata";
        }
        return template;
    }

    function handleItem(key, value) {
        var type = typeof value;

        if (type === 'object') {
            return handleChildren(key, value, type);
        }

        return createItem(key, value, type);
    }

    function parseObject(obj) {
        result = '<div class="json">';
        for (var item in obj) {
            var key = item,
                value = obj[item];
            if (key !== 'sources') {
                result += handleItem(key, value);
            }
        }
        result += '</div>';
        return result;
    }
    return parseObject(json);
}