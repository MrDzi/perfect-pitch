(() => {
  "use strict";
  var e = {
    n: (t) => {
      var r = t && t.__esModule ? () => t.default : () => t;
      return e.d(r, { a: r }), r;
    },
    d: (t, r) => {
      for (var o in r) e.o(r, o) && !e.o(t, o) && Object.defineProperty(t, o, { enumerable: !0, get: r[o] });
    },
    o: (e, t) => Object.prototype.hasOwnProperty.call(e, t),
  };
  const t = require("express"),
    r = e.n(t)()(),
    o = process.env.PORT || 3e3;
  r.get("/api/test", (e, t) => {
    t.send({ test: "test!" });
  }),
    r.listen(o, () => {
      console.log("listening on port 3000");
    });
})();
