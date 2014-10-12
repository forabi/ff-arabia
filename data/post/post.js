console.debug("[arabion] Addon initialized.");

var highlightCode = function() {
    
    hljs.configure({
        tabReplace: '    '
    });

    console.debug("[arabion] Highlighting code...");
    
    var codeBlocks = document.querySelectorAll(".post_content pre code, .post_comment pre code");
    for (var codeBlock of codeBlocks) {
        hljs.highlightBlock(codeBlock);
    }
}

document.addEventListener("DOMContentLoaded", highlightCode);