(() => {
  "use strict";
  var e = {
      492: function (e, t, r) {
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, r, o) {
                  void 0 === o && (o = r),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[r];
                      },
                    });
                }
              : function (e, t, r, o) {
                  void 0 === o && (o = r), (e[o] = t[r]);
                }),
          n =
            (this && this.__setModuleDefault) ||
            (Object.create
              ? function (e, t) {
                  Object.defineProperty(e, "default", { enumerable: !0, value: t });
                }
              : function (e, t) {
                  e.default = t;
                }),
          s =
            (this && this.__importStar) ||
            function (e) {
              if (e && e.__esModule) return e;
              var t = {};
              if (null != e)
                for (var r in e) "default" !== r && Object.prototype.hasOwnProperty.call(e, r) && o(t, e, r);
              return n(t, e), t;
            },
          i =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e };
            };
        Object.defineProperty(t, "__esModule", { value: !0 });
        const c = i(r(127)),
          u = i(r(479)),
          a = s(r(619)),
          l = c.default();
        l.use(u.default()),
          a.default.connect(
            "mongodb+srv://perfect_pitch_user:HitThatTone@cluster0.pupdp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
            { useNewUrlParser: !0 }
          );
        const d = a.default.connection,
          f = new a.Schema({ name: { type: String, required: !0 }, score: { type: Number, required: !0 }, date: Date }),
          p = a.default.model("Score", f);
        d.on("error", () => {
          console.log("db conection error");
        }),
          d.once("open", () => {
            console.log("db connection established");
          });
        const _ = process.env.PORT || 3e3;
        l.get("/api/test", (e, t) => {
          const r = new p({ name: "Test", date: Date.now(), score: 230 });
          console.log("score created", r), t.send({ test: JSON.stringify(r) });
        }),
          l.listen(_, () => {
            console.log(`listening on port ${_}`);
          });
      },
      479: (e) => {
        e.exports = require("cors");
      },
      127: (e) => {
        e.exports = require("express");
      },
      619: (e) => {
        e.exports = require("mongoose");
      },
    },
    t = {};
  !(function r(o) {
    var n = t[o];
    if (void 0 !== n) return n.exports;
    var s = (t[o] = { exports: {} });
    return e[o].call(s.exports, s, s.exports, r), s.exports;
  })(492);
})();
