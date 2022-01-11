const jsonViewer = require('./jsonViewer.js');

test('test creation of DOM from pattern', () => {
    var testString = "{" +
        "\"kind\": \"ACTION_TREE\",\n" +
        "\"tree\": {\n" +
        "\"type\": \"VariableDeclarator\",\n" +
        "  \"fragment\": {\n" +
        "\"source\": \"source\",\n" +
        "\"start\": {\n" +
        "  \"index\": 392,\n" +
        "  \"row\": 18,\n" +
        "  \"column\": 19\n" +
        " },\n" +
        "\"end\": {\n" +
        "  \"index\": 399,\n" +
        "  \"row\": 18,\n" +
        "  \"column\": 26\n" +
        "   }\n" +
        "  }\n" +
        " }\n" +
        "}";
    var testJson = JSON.parse(testString);
    var resultDOM = "<div class=\"json\">" +
        "<div class=\"json__item\">" +
            "<div class=\"json__key\">kind</div>" +
            "<div class=\"json__value json__value--string\">\"ACTION_TREE\"</div>" +
        "</div>" +
        "<label class=\"json__item collapsible json__item--collapsible\">" +
            "<input type=\"checkbox\" checked class=\"json__toggle\"/>" +
            "<div class=\"json__key\">tree</div>" +
            "<div class=\"json__value json__value--type-object\">[18, 19] - [18, 26] (392, 399)</div>" +
            "<div class=\"json__item\">" +
                "<div class=\"json__key\">type</div>" +
                "<div class=\"json__value json__value--string\">\"VariableDeclarator\"</div>" +
            "</div>" +
        "</label>" +
        "</div>";
    expect(jsonViewer(testJson, true)).toBe(resultDOM);
});

test('test creation of DOM from simple AST', () => {
    var testString = "{" +
        "\"kind\": \"AST\",\n" +
        "\"tree\": {\n" +
        "\"type\": \"CompilationUnit\",\n" +
        "\"fragment\": {\n" +
        "  \"source\": \"source\",\n" +
        "  \"start\": {\n" +
        "     \"index\": 0,\n" +
        "     \"row\": 1,\n" +
        "     \"column\": 1\n" +
        "   },\n" +
        "   \"end\": {\n" +
        "     \"index\": 174,\n" +
        "     \"row\": 11,\n" +
        "     \"column\": 1\n" +
        "   }\n" +
        "},\n" +
        "\"children\": [\n" +
        "  {\n" +
        "    \"type\": \"PropertyName\",\n" +
        "    \"data\": \"imports\",\n" +
        "    \"fragment\": {\n" +
        "    \"start\": {\n" +
        "      \"index\": 0,\n" +
        "      \"row\": 1,\n" +
        "      \"column\": 1\n" +
        "    },\n" +
        "    \"end\": {\n" +
        "      \"index\": 0,\n" +
        "      \"row\": 1,\n" +
        "      \"column\": 1\n" +
        "    }\n" +
        "   }\n" +
        "  }\n" +
        "  ]\n" +
        " }\n" +
        "}";
    var testJson = JSON.parse(testString);
    var resultDOM = "<div class=\"json\">" +
        "<div class=\"json__item\">" +
            "<div class=\"json__key\">kind</div>" +
            "<div class=\"json__value json__value--string\">\"AST\"</div>" +
        "</div>" +
        "<label class=\"json__item collapsible json__item--collapsible\">" +
            "<input type=\"checkbox\" checked class=\"json__toggle\"/>" +
            "<div class=\"json__key\">tree</div>" +
            "<div class=\"json__value json__value--type-object\">[1, 1] - [11, 1] (0, 174)</div>" +
            "<div class=\"json__item\">" +
                "<div class=\"json__key\">type</div>" +
                "<div class=\"json__value json__value--string\">\"CompilationUnit\"</div>" +
            "</div>" +
            "<label class=\"json__item collapsible json__item--collapsible\">" +
                "<input type=\"checkbox\" checked class=\"json__toggle\"/>" +
                "<div class=\"json__key\">children</div>" +
                "<div class=\"json__value json__value--type-object\"></div>" +
                "<label class=\"json__item collapsible json__item--collapsible\">" +
                    "<input type=\"checkbox\" checked class=\"json__toggle\"/>" +
                    "<div class=\"json__key\">0</div>" +
                    "<div class=\"json__value json__value--type-object\">metadata</div>" +
                    "<div class=\"json__item\">" +
                        "<div class=\"json__key\">type</div>" +
                        "<div class=\"json__value json__value--string\">\"PropertyName\"</div>" +
                    "</div>" +
                    "<div class=\"json__item\">" +
                        "<div class=\"json__key\">data</div>" +
                    "<div class=\"json__value json__value--string\">\"imports\"</div>" +
                    "</div>" +
                "</label>" +
            "</label>" +
        "</label>" +
        "</div>";
    expect(jsonViewer(testJson, true)).toBe(resultDOM);
});