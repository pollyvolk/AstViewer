function destroyPreviousSplits() {
    if (horizontalSplit) {
        horizontalSplit.destroy();
    }
    if (verticalSplit) {
        verticalSplit.destroy();
    }
}

function addTwoCodeBlocks() {
    destroyPreviousSplits();
    var codeArea = document.getElementById("code");
    codeArea.innerHTML = twoCodeBlocks;
    horizontalSplit = Split(['#code', '#tree'], {
        gutterSize: 5,
        minSize: [300, 500],
        sizes: [50,50],
        cursor: 'col-resize'
    });
    verticalSplit = Split(['#source', '#target'], {
        direction: 'vertical',
        gutterSize: 5,
        cursor: 'row-resize'
    });
    srcCode = new CodeMirror.fromTextArea(document.getElementById("source-view"), {
        lineNumbers: true,
        scrollbarStyle: null,
        readOnly: true,
        viewportMargin: Infinity
    });
    tgtCode = new CodeMirror.fromTextArea(document.getElementById("target-view"), {
        lineNumbers: true,
        scrollbarStyle: null,
        readOnly: true,
        viewportMargin: Infinity
    });
}

function addSingleCodeBlock() {
    destroyPreviousSplits();
    var codeArea = document.getElementById("code");
    codeArea.innerHTML = oneCodeBlock;
    horizontalSplit = Split(['#code', '#tree'], {
        gutterSize: 5,
        minSize: [300, 500],
        sizes: [50,50],
        cursor: 'col-resize'
    });
    verticalSplit = null;
    srcCode = new CodeMirror.fromTextArea(document.getElementById("source-view"), {
        lineNumbers: true,
        scrollbarStyle: null,
        readOnly: true,
        viewportMargin: Infinity
    });
}

function markCode(item, colour, changeInTargetCode) {
    let fragment = item.querySelector('.json__value--type-object').innerText;
    if (fragment != null) {
        var regexp = new RegExp("\\[(\\d*?), (\\d*?)\\] - \\[(\\d*?), (\\d*?)\\]", "g");
        const indexes = regexp.exec(fragment);
        if (indexes) {
            var code = srcCode;
            if (changeInTargetCode) {
                code = tgtCode;
            }
            code.markText({line: indexes[1] - 1, ch: indexes[2] - 1},
                {line: indexes[3] - 1, ch: indexes[4] - 1}, {readOnly: true, css: "background-color: " + colour});
            code.scrollIntoView({line: indexes[1] - 1, ch: indexes[2] - 1}, 200);
        }
    }
}