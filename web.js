// web.js
var express = require("express");
var logfmt = require("logfmt");
var mnemonic = require("./public/mnemonic.js");
var app = express();

// Config
var bugurl = "https://bugzilla.mozilla.org/show_bug.cgi?id=";
var prefix = "http://bugwd.com/";

app.use(logfmt.requestLogger());

app.use('/static', express.static(__dirname + '/public'));

app.get("/", function(req, res) {
  res.render("form.jade", {
    q: "",
    words: "",
    link: "",
    title: "bugwd",
  });
});

app.get("/:q", function(req, res) {
  var q = req.params.q;
  try {
    if (/^[0-9]+$/.test(q)) {
      var words = mnemonic.encode_int32(+q);
      res.render("form.jade", {
        q: q,
        words: words,
        link: prefix + words,
        title: "Bug " + q + " (" + words + ")"
      });
    } else {
      var id = mnemonic.decode_int32(q);
      res.redirect(301, bugurl + id);
    }
  } catch (e) {
    res.send("Decoding error: " + e);
  }
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
