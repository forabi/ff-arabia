const ARABIA = require("./const");

var self = require("sdk/self");
var { PageMod } = require("sdk/page-mod");
var buttons = require("sdk/ui/button/action");
var tabs = require("sdk/tabs");

// Add action button to UI
var button = buttons.ActionButton({
    id: "mozilla-link",
    label: "توجّه إلى موقع Arabia I/O",
    icon: ARABIA.ICON,
    onClick: function handleClick(state) {
        tabs.open(ARABIA.HOME_URL);
    }
});

PageMod({
    include: ARABIA.PATTERN_POST,
    contentStyleFile: [self.data.url("packages/highlight/styles/github.css"), self.data.url('style.css')],
    contentScriptFile: [
        self.data.url("packages/highlight/highlight.pack.js"),
        self.data.url("post.js")
    ],
    contentScriptWhen: "start"
});