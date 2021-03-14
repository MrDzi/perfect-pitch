(() => {
  "use strict";
  var e = {
      975: function (e, t, r) {
        var s =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e };
          };
        Object.defineProperty(t, "__esModule", { value: !0 });
        const o = s(r(127)),
          n = s(r(479)),
          u = o.default();
        u.use(n.default());
        const i = process.env.PORT || 3e3;
        u.get("/api/test", (e, t) => {
          t.send({ test: "test!" });
        }),
          u.listen(i, () => {
            console.log("listening on port 3000");
          });
      },
      479: (e) => {
        e.exports = require("cors");
      },
      127: (e) => {
        e.exports = require("express");
      },
    },
    t = {};
  !(function r(s) {
    if (t[s]) return t[s].exports;
    var o = (t[s] = { exports: {} });
    return e[s].call(o.exports, o, o.exports, r), o.exports;
  })(975);
})();
