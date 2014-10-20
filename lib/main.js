const ARABIA = require("./const");

var self = require("sdk/self");
var { PageMod } = require("sdk/page-mod");

PageMod({
    include: ARABIA.PATTERN_POST,
    contentStyleFile: [self.data.url("packages/highlight/styles/github.css"), self.data.url("post/post.css")],
    contentScriptFile: [
        self.data.url("packages/highlight/highlight.pack.js"),
        self.data.url("post/post.js")
    ]
});

// var { User } = require('./people');

// PageMod({
//     include: ARABIA.PATTER_USER_PROFILE,
//     contentScriptFile: self.data.url("user/user.js"),
//     onAttach: function(worker) {
//         worker.port.on('subscribeRequested', function(username) {
//             var user = new User(username);
//             user.subscribe().then(function() {
//                 console.log('Subsribed to ', username);
//                 worker.port.emit('subscribed', username);
//             }).catch(function(e) {
//                 console.log('Subscription error', e);
//                 worker.port.emit('subscribeFailed', e);
//             })
//         })
//     }
// });

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
    height: 300,
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
        console.info("[ff-arabia] Got response (%d).", xmlString.length);
        panel.port.emit("updateComplete", xmlString);
    }).catch(function(response) {
        console.error("[ff-arabia] Unable to get feed.")
    })
});

var tabs = require("sdk/tabs");

function openOrActivateTab(link, pattern) {
    // Try finding an open tab first
    for (var tab of tabs) {
        if (pattern && tab.url.match(pattern || link)) {
            return tab.activate();
        }
    }
    tabs.open(link);
}

panel.port.on("homePageRequested", function() {
    openOrActivateTab(ARABIA.HOME_URL, ARABIA.PATTERN_HOME_URL);
})


panel.port.on("tabRequested", function(link) {
    openOrActivateTab(link);
})
