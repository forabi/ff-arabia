console.debug("[arabion] Addon initialized.");

function highlightCode(){
    
    hljs.configure({
        tabReplace: "    "
    });

    console.debug("[arabion] Highlighting code...");
    
    var codeBlocks = document.querySelectorAll(".post_content pre code, .post_comment pre code");
    for (var codeBlock of codeBlocks) {
        hljs.highlightBlock(codeBlock);
    }
}

function embedMedia() {
    console.log("Embedding media...");

    var links = document.querySelectorAll(".post_content a[href]");
    var urls = [];

    for (let el of links) {
        // console.log(el, el.attributes, el.attributes.href);
        let url = el.attributes.href.value;
        urls.push(url);
    }

    console.log("Found embeddable content", urls);

    if (!urls.length) return;

    var reqUrl = "https://api.embed.ly/1/oembed?urls=" + urls.slice(0, 19).join(",") + "&format=json";

    console.log(reqUrl);
    var req = new XMLHttpRequest();
    
    req.onload = function() {
        try {
            // console.log("Embed OK", req.response, req.responseText);
            if (req.response instanceof Array) {
                req.response.forEach(function(embed, index) {
                    // console.log(embed);
                    var html = '';
                    if (embed.html) {
                        links[index].outerHTML = "<div class='embed'>" + embed.html + "</div>";
                    } else if (embed.type === 'photo') {
                        html = "\
                            <img class='embed' src='" + embed.url + "'/>\
                        ";
                        links[index].outerHTML = "<div>" + html + "</div>";
                    }
                });
            }
        } catch (e) {
            // @TODO: Stuff
            console.log("Request error", e);
            throw new Error(req);
        }
    }

    req.onerror = function() {
        console.log("Request error", e);
        throw new Error(req);
    };

    req.open("GET", reqUrl);
    req.responseType = "json";
    req.send();
}



// window.onload = function() {
embedMedia();
highlightCode();
// });
// document.addEventListener("DOMContentLoaded", embedMedia);