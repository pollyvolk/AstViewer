addEvent("file", "change", function() {
    var file = this.files[0];
    if (validFileType(file)) {
        document.getElementById("fileStatus").innerHTML = file.name;
        let reader = new FileReader();
        reader.onerror = errorHandler;
        reader.onabort = function () {
            alert('File read cancelled');
        };
        reader.onload = function () {
            const text = reader.result;
            document.getElementById("languageItem").style.display = "inline-block";
            //document.getElementById("astSelector").style.display = "inline-block";
            parseJson(text);
        };
        reader.readAsText(file);
    } else {
        document.getElementById("languageItem").style.display = "none";
        document.getElementById("fileStatus").innerHTML = "Недопустимый тип файла. Измените свой выбор!";
    }
});

function addJsonEvents() {
    var checkboxes = document.getElementsByClassName("json__toggle");
    var i;
    for (i = 0; i < checkboxes.length; i++) {
        addEvent(checkboxes[i], "change", function() {
            var collapsible = this.parentNode;
            collapsible.style.content = '+';
            if (collapsible.classList.contains("json__item--collapsible--closed")) {
                collapsible.classList.replace("json__item--collapsible--closed", "json__item--collapsible");
            } else {
                collapsible.classList.replace("json__item--collapsible", "json__item--collapsible--closed");
            }
        });
    }
}

addEvent("json", "mouseover", function() {
    let target = event.target;
    let item = target.closest(".collapsible");
    if (!item) return;
    let json = document.getElementById("json");
    if (!json.contains(item)) return;
    let actionBlocks = document.getElementsByClassName("actions");
    var changeInTargetCode = false;
    if (actionBlocks != null) {
        for (let block of actionBlocks) {
            if (block.contains(item)) {
                changeInTargetCode = true;
                break;
            }
        }
    }
    item.style.background = '#FFFFD0';
    markCode(item, '#ffff84', changeInTargetCode);
});

addEvent("json", "mouseout", function() {
    let target = event.target;
    let item = target.closest(".collapsible");
    if (!item) return;
    let json = document.getElementById("json");
    if (!json.contains(item)) return;
    let actionBlocks = document.getElementsByClassName("actions");
    var changeInTargetCode = false;
    if (actionBlocks != null) {
        for (let block of actionBlocks) {
            if (block.contains(item)) {
                changeInTargetCode = true;
                break;
            }
        }
    }
    item.style.background = '';
    markCode(item, 'transparent', changeInTargetCode);
});


addEvent("selectorInput", "input", function() {
    var inputValue = this.value;
    var dataId = inputValue.substring(0, inputValue.indexOf(':'));
    handleAst(dataId);
    addJsonEvents();
});

addEvent("selectorInput", "click", function() {
    this.value = '';
});
