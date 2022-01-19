function errorHandler(evt) {
    switch(evt.target.error.code) {
        case evt.target.error.NOT_FOUND_ERR:
            alert('File Not Found!');
            break;
        case evt.target.error.NOT_READABLE_ERR:
            alert('File is not readable');
            break;
        case evt.target.error.ABORT_ERR:
            break;
        default:
            alert('An error occurred reading this file.');
    }
}

function validFileType(file) {
    return file.type === "application/json";
}

function parseJson(jsonData) {
    const json = JSON.parse(jsonData);
    var languageLabel = document.getElementById('language');
    if (json.patterns != null) {
        document.getElementById("astSelector").style.display = "inline-block";
        document.getElementById("selectorInput").value = "";
        addTwoCodeBlocks();
        var languages = Object.keys(json.patterns);
        var blockAllLang = json["patterns"];
        for (language in blockAllLang) {
            if (blockAllLang.hasOwnProperty(language)) {
                var blockByLang = blockAllLang[language];
                dataByLang = blockByLang["data"];
                addPatternOptions();
            }
        }
        handleAst(0);
        addJsonEvents();
        languageLabel.innerText = languages.toString();
    } else if (json.ast != null) {
        document.getElementById("astSelector").style.display = "none";
        addSingleCodeBlock();
        var allAstInfo = json["ast"];
        astData =  allAstInfo["data"];
        astLanguage = allAstInfo["language"];
        //addAstOptions();
        handleAst(-1);
        addJsonEvents();
        languageLabel.innerText = astLanguage;
    } else {
        alert('Impossible to read JSON!');
        return;
    }
}

function addPatternOptions() {
    var template = '';
    var selectorList = document.getElementById("ASTs");
    var id = 0;
    var optionList = '';
    for (var data of dataByLang) {
        template = '<option id="%ID%" value="%VALUE%"></option>';
        var treeData = data["tree"];
        var tree = treeData["tree"];
        var type = tree["type"];
        var value = id + ": " + type;
        template = template.replace('%ID%', id);
        template = template.replace('%VALUE%', value);
        optionList += template;
        id++;
    }
    selectorList.innerHTML = optionList;
    document.getElementById("selectorInput").value = document.getElementById("0").value;
}

function handleAst(dataId) {
    if (dataId === -1) {
        var treeData = astData["tree"];
        kind = astData["kind"];
        var sources = astData["sources"];
        var sourceCode = sources["source"];

        document.getElementById("json").innerHTML = jsonViewer(treeData, true); //JSON.stringify(tree);
        srcCode.setOption("mode", "text/x-" + astLanguage.toLowerCase()); // E.g: text/x-java
        srcCode.getDoc().setValue(sourceCode["data"]);
    } else {
        var data = dataByLang[dataId];
        var treeData = data["tree"];
        kind = treeData["kind"];
        var sources = treeData["sources"];
        var sourceCode = sources["source"];
        var targetCode = sources["target"];

        document.getElementById("json").innerHTML = jsonViewer(treeData, true); //JSON.stringify(tree);
        srcCode.setOption("mode", "text/x-" + language.toLowerCase()); // E.g: text/x-java
        srcCode.getDoc().setValue(sourceCode["data"]);
        tgtCode.setOption("mode", "text/x-" + language.toLowerCase());
        tgtCode.getDoc().setValue(targetCode["data"]);
    }
}