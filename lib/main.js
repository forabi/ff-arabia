const ARABIA = require("./const");

var self = require("sdk/self");
var { PageMod } = require("sdk/page-mod");

PageMod({
    include: ARABIA.PATTERN_POST,
    contentStyleFile: [self.data.url("packages/highlight/styles/github.css"), self.data.url("post/post.css")],
    contentScriptFile: [
        self.data.url("packages/highlight/highlight.pack.js"),
        self.data.url("post/post.js")
    ],
    contentScriptWhen: "start"
});


var { ToggleButton } = require("sdk/ui/button/toggle");
var { Panel } = require("sdk/panel");

var handleChange = function(state) {
    if (state.checked) {
        panel.show({ position: button })
    }
}
var handleHide = function() {
  button.state("window", { checked: false });
}

// Add action button to UI
var button = ToggleButton({
    id: "arabia-action-button",
    label: "توجّه إلى موقع Arabia I/O",
    icon: ARABIA.ICON,
    onChange: handleChange
});

var panel = Panel({
    contentURL: self.data.url("panel/panel.html"),
    onHide: handleHide,
    contentScriptFile: [
        self.data.url("panel/panel.js"),
        self.data.url("panel/panel.ui.js")
    ],
    contentStyleFile: self.data.url("panel/panel.css")
});

var Feed = require("./feed");
panel.port.on("updateRequested", function() {
    new Feed("https://arabia.io/rss.xml").get().then(function(xmlString) {
        console.info("[ff-arabia] Got response");
        panel.port.emit("updateComplete", xmlString);
    }).catch(function(response) {
        console.error("[ff-arabia] Unable to get feed.")
    })
});

var tabs = require("sdk/tabs");
panel.port.on("homePageRequested", function() {
    // Try finding an open tab first
    for (var tab of tabs) {
        if (tab.url.match(ARABIA.PATTERN_HOME_URL)) {
            return tab.activate();
        }
    }
    tabs.open(ARABIA.HOME_URL);
})
