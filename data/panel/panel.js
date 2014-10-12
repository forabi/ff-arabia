const STATES = {
    IDLE: 0,
    UPDATING: 1,
    ERROR: 2
}

var currentState = STATES.IDLE;

const xmlParser = new DOMParser();

function visitHome() {
    // Stuff
}

function triggerUpdate() {
    if (currentState != STATES.UPDATING) {
        currentState = STATES.UPDATING;
        self.port.emit("updateRequested");
    }
}

function renderUpdate(xmlString) {
    var items = [];
    xmlDoc = xmlParser.parseFromString(xmlString, "text/xml");
    for (item of xmlDoc.querySelectorAll("item")) {
        items.push({
            title: item.querySelector('title').textContent,
            description: item.querySelector('description').textContent
        });
    }

    var fragment = document.createDocumentFragment("div");
    items.forEach(function(item) {
        var div = document.createElement("div");
        div.innerHTML = "<h1>" + item.title + "</h1><span>"+ item.description +"</span>";
        fragment.appendChild(div);
    });

    document.body.appendChild(fragment);
    currentState = STATES.IDLE;
}

function showError(error) {
    // @TODO: show error message
}

self.port.on("updateComplete", renderUpdate);
self.port.on("updateError", showError);