const STATES = {
    IDLE: 0,
    UPDATING: 1,
    ERROR: 2
}

var currentState = STATES.IDLE;

const xmlParser = new DOMParser();
const content = document.getElementById("content");
const refreshButton = document.getElementById("refresh");

function visitHome() {
    self.port.emit("homePageRequested");
}

function triggerUpdate() {
    if (currentState != STATES.UPDATING) {
        refreshButton.classList.add('spinning');
        currentState = STATES.UPDATING;
        self.port.emit("updateRequested");
    }
}

function renderUpdate(xmlString) {
    var items = [];
    xmlDoc = xmlParser.parseFromString(xmlString, "text/xml");
    for (var item of xmlDoc.querySelectorAll("item")) {
        items.push({
            title: item.querySelector('title').textContent,
            description: item.querySelector('description').textContent,
            link: item.querySelector('link').textContent,
            date: new Date(item.querySelector('pubDate').textContent)
        });
    }

    var fragment = document.createDocumentFragment("div");
    items.forEach(function(item) {
        var div = document.createElement("div");
        div.innerHTML = 
            "<div class='post'>\
                <h2 class='post-title'><a href='" + item.link + "'>" + item.title + "</a></h2>\
                <span class='post-date'>" + item.date.toLocaleString() + "</span>\
                <span class='post-description'>"+ item.description + "</span>\
            </div>";
        fragment.appendChild(div);
    });

    content.insertBefore(fragment, content.childNodes[0]);
    refreshButton.classList.remove('spinning');
    currentState = STATES.IDLE;
}

function showError(error) {
    // @TODO: show error message
}

self.port.on("updateComplete", renderUpdate);
self.port.on("updateError", showError);