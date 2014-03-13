// web.js
var express = require("express");
var logfmt = require("logfmt");
var mnemonic = require("./mnemonic.js");
var app = express();

app.use(logfmt.requestLogger());

app.get("/", function(req, res) {
  res.send("Hello");
});

app.get("/:words", function(req, res) {
  var words = req.params.words;
  try {
    if (/^[0-9]+$/.test(words)) {
      res.send("http://bugwd.com/" + mnemonic.encode_int32(words));
    } else {
      var prefix = "https://bugzilla.mozilla.org/show_bug.cgi?id=";
      var id = mnemonic.decode_int32(words);
      res.redirect(301, prefix + id);
    }
  } catch (e) {
    res.send("Decoding error: " + e);
  }
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});
