/*! For license information please see main.js.LICENSE.txt */
(() => {
    var t = {
            575: t => {
                t.exports = "precision highp float;\n\nuniform sampler2D grainTex;\nuniform sampler2D blurTex;\nuniform float time;\nuniform float seed;\nuniform vec3 back;\nuniform float style;\nuniform float param1;\nuniform float param2;\nuniform float param3;\n\nvarying vec2 vUv;\n\n#define PI 3.141592653589793\n\n//\n// Description : Array and textureless GLSL 2D simplex noise function.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : stegu\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//               https://github.com/stegu/webgl-noise\n//\n\nvec3 mod289(vec3 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\nvec2 mod289(vec2 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0;\n}\nvec3 permute(vec3 x) {\n  return mod289(((x * 34.0) + 10.0) * x);\n}\nfloat snoise(vec2 v) {\n  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);\n  vec2 i = floor(v + dot(v, C.yy));\n  vec2 x0 = v - i + dot(i, C.xx);\n  vec2 i1;\n  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\n  vec4 x12 = x0.xyxy + C.xxzz;\n  x12.xy -= i1;\n  i = mod289(i);\n  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));\n  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);\n  m = m * m;\n  m = m * m;\n  vec3 x = 2.0 * fract(p * C.www) - 1.0;\n  vec3 h = abs(x) - 0.5;\n  vec3 ox = floor(x + 0.5);\n  vec3 a0 = x - ox;\n  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);\n  vec3 g;\n  g.x = a0.x * x0.x + h.x * x0.y;\n  g.yz = a0.yz * x12.xz + h.yz * x12.yw;\n  return 130.0 * dot(m, g);\n}\n\nfloat snoise01(vec2 v) {\n  return (1.0 + snoise(v)) * 0.5;\n}\n\nfloat noise2d(vec2 st) {\n  return snoise01(vec2(st.x + time * 0.02, st.y - time * 0.04 + seed));\n}\n\nfloat pattern(vec2 p) {\n  vec2 q = vec2(noise2d(p + vec2(0.0, 0.0)), noise2d(p + vec2(5.2, 1.3)));\n  vec2 r = vec2(noise2d(p + 4.0 * q + vec2(1.7, 9.2)), noise2d(p + 4.0 * q + vec2(8.3, 2.8)));\n  return noise2d(p + 1.0 * r);\n}\n\nvoid main() {\n  vec2 uv = vUv;\n  vec2 p = gl_FragCoord.xy;\n\n  uv = style > 0.0 ? ceil(uv * 50.0) / 50.0 : uv;\n\n  // texture\n  vec3 grainColor = texture2D(grainTex, mod(p * param1 * 5.0, 1024.0) / 1024.0).rgb;\n  float blurAlpha = texture2D(blurTex, uv).a;\n\n  float gr = pow(grainColor.r * 1.0, 1.5) + 0.5 * (1.0 - blurAlpha);\n  float gg = grainColor.g;\n\n  float ax = param2 * gr * cos(gg * 2.0 * PI);\n  float ay = param2 * gr * sin(gg * 2.0 * PI);\n\n  // noise\n  float ndx = 1.0 * 1.0 * param3 + 0.1 * (1.0 - blurAlpha);\n  float ndy = 2.0 * 1.0 * param3 + 0.1 * (1.0 - blurAlpha);\n  float nx = uv.x * ndx + ax;\n  float ny = uv.y * ndy + ay;\n  float n = pattern(vec2(nx, ny));\n  n = pow(n * 1.05, 6.0);\n  n = smoothstep(0.0, 1.0, n);\n\n  vec3 front = vec3(0.5);\n  vec3 result = mix(back, front, n);\n\n  gl_FragColor = vec4(result, blurAlpha);\n  // gl_FragColor = vec4(vec3(blurAlpha), 1.0);\n}\n"
            },
            60: t => {
                t.exports = "uniform mat4 modelViewMatrix;\nuniform mat4 projectionMatrix;\n\nattribute vec3 position;\nattribute vec2 uv;\n\nvarying vec2 vUv;\n\nvoid main() {\n  vUv = uv;\n\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}\n"
            }
        },
        e = {};

    function n(i) {
        var r = e[i];
        if (void 0 !== r) return r.exports;
        var a = e[i] = {
            exports: {}
        };
        return t[i](a, a.exports, n), a.exports
    }
    n.n = t => {
        var e = t && t.__esModule ? () => t.default : () => t;
        return n.d(e, {
            a: e
        }), e
    }, n.d = (t, e) => {
        for (var i in e) n.o(e, i) && !n.o(t, i) && Object.defineProperty(t, i, {
            enumerable: !0,
            get: e[i]
        })
    }, n.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e), (() => {
        "use strict";

        function t(t) {
            if (void 0 === t) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return t
        }

        function e(t, e) {
            t.prototype = Object.create(e.prototype), t.prototype.constructor = t, t.__proto__ = e
        }
        var i, r, a, s, o, l, c, u, h, d, p, f, m, g, _, v = {
                autoSleep: 120,
                force3D: "auto",
                nullTargetWarn: 1,
                units: {
                    lineHeight: ""
                }
            },
            x = {
                duration: .5,
                overwrite: !1,
                delay: 0
            },
            y = 1e8,
            M = 1e-8,
            S = 2 * Math.PI,
            E = S / 4,
            T = 0,
            b = Math.sqrt,
            w = Math.cos,
            A = Math.sin,
            R = function(t) {
                return "string" == typeof t
            },
            C = function(t) {
                return "function" == typeof t
            },
            L = function(t) {
                return "number" == typeof t
            },
            P = function(t) {
                return void 0 === t
            },
            U = function(t) {
                return "object" == typeof t
            },
            D = function(t) {
                return !1 !== t
            },
            I = function() {
                return "undefined" != typeof window
            },
            O = function(t) {
                return C(t) || R(t)
            },
            N = "function" == typeof ArrayBuffer && ArrayBuffer.isView || function() {},
            F = Array.isArray,
            z = /(?:-?\.?\d|\.)+/gi,
            B = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,
            k = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g,
            H = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,
            G = /[+-]=-?[.\d]+/,
            V = /[^,'"\[\]\s]+/gi,
            W = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,
            X = {},
            j = {},
            q = function(t) {
                return (j = St(t, X)) && En
            },
            Y = function(t, e) {
                return console.warn("Invalid property", t, "set to", e, "Missing plugin? gsap.registerPlugin()")
            },
            K = function(t, e) {
                return !e && console.warn(t)
            },
            Z = function(t, e) {
                return t && (X[t] = e) && j && (j[t] = e) || X
            },
            $ = function() {
                return 0
            },
            J = {
                suppressEvents: !0,
                isStart: !0,
                kill: !1
            },
            Q = {
                suppressEvents: !0,
                kill: !1
            },
            tt = {
                suppressEvents: !0
            },
            et = {},
            nt = [],
            it = {},
            rt = {},
            at = {},
            st = 30,
            ot = [],
            lt = "",
            ct = function(t) {
                var e, n, i = t[0];
                if (U(i) || C(i) || (t = [t]), !(e = (i._gsap || {}).harness)) {
                    for (n = ot.length; n-- && !ot[n].targetTest(i););
                    e = ot[n]
                }
                for (n = t.length; n--;) t[n] && (t[n]._gsap || (t[n]._gsap = new Ne(t[n], e))) || t.splice(n, 1);
                return t
            },
            ut = function(t) {
                return t._gsap || ct(Qt(t))[0]._gsap
            },
            ht = function(t, e, n) {
                return (n = t[e]) && C(n) ? t[e]() : P(n) && t.getAttribute && t.getAttribute(e) || n
            },
            dt = function(t, e) {
                return (t = t.split(",")).forEach(e) || t
            },
            pt = function(t) {
                return Math.round(1e5 * t) / 1e5 || 0
            },
            ft = function(t) {
                return Math.round(1e7 * t) / 1e7 || 0
            },
            mt = function(t, e) {
                var n = e.charAt(0),
                    i = parseFloat(e.substr(2));
                return t = parseFloat(t), "+" === n ? t + i : "-" === n ? t - i : "*" === n ? t * i : t / i
            },
            gt = function(t, e) {
                for (var n = e.length, i = 0; t.indexOf(e[i]) < 0 && ++i < n;);
                return i < n
            },
            _t = function() {
                var t, e, n = nt.length,
                    i = nt.slice(0);
                for (it = {}, nt.length = 0, t = 0; t < n; t++)(e = i[t]) && e._lazy && (e.render(e._lazy[0], e._lazy[1], !0)._lazy = 0)
            },
            vt = function(t, e, n, i) {
                nt.length && !r && _t(), t.render(e, n, i || r && e < 0 && (t._initted || t._startAt)), nt.length && !r && _t()
            },
            xt = function(t) {
                var e = parseFloat(t);
                return (e || 0 === e) && (t + "").match(V).length < 2 ? e : R(t) ? t.trim() : t
            },
            yt = function(t) {
                return t
            },
            Mt = function(t, e) {
                for (var n in e) n in t || (t[n] = e[n]);
                return t
            },
            St = function(t, e) {
                for (var n in e) t[n] = e[n];
                return t
            },
            Et = function t(e, n) {
                for (var i in n) "__proto__" !== i && "constructor" !== i && "prototype" !== i && (e[i] = U(n[i]) ? t(e[i] || (e[i] = {}), n[i]) : n[i]);
                return e
            },
            Tt = function(t, e) {
                var n, i = {};
                for (n in t) n in e || (i[n] = t[n]);
                return i
            },
            bt = function(t) {
                var e, n = t.parent || s,
                    i = t.keyframes ? (e = F(t.keyframes), function(t, n) {
                        for (var i in n) i in t || "duration" === i && e || "ease" === i || (t[i] = n[i])
                    }) : Mt;
                if (D(t.inherit))
                    for (; n;) i(t, n.vars.defaults), n = n.parent || n._dp;
                return t
            },
            wt = function(t, e, n, i, r) {
                void 0 === n && (n = "_first"), void 0 === i && (i = "_last");
                var a, s = t[i];
                if (r)
                    for (a = e[r]; s && s[r] > a;) s = s._prev;
                return s ? (e._next = s._next, s._next = e) : (e._next = t[n], t[n] = e), e._next ? e._next._prev = e : t[i] = e, e._prev = s, e.parent = e._dp = t, e
            },
            At = function(t, e, n, i) {
                void 0 === n && (n = "_first"), void 0 === i && (i = "_last");
                var r = e._prev,
                    a = e._next;
                r ? r._next = a : t[n] === e && (t[n] = a), a ? a._prev = r : t[i] === e && (t[i] = r), e._next = e._prev = e.parent = null
            },
            Rt = function(t, e) {
                t.parent && (!e || t.parent.autoRemoveChildren) && t.parent.remove && t.parent.remove(t), t._act = 0
            },
            Ct = function(t, e) {
                if (t && (!e || e._end > t._dur || e._start < 0))
                    for (var n = t; n;) n._dirty = 1, n = n.parent;
                return t
            },
            Lt = function(t, e, n, i) {
                return t._startAt && (r ? t._startAt.revert(Q) : t.vars.immediateRender && !t.vars.autoRevert || t._startAt.render(e, !0, i))
            },
            Pt = function t(e) {
                return !e || e._ts && t(e.parent)
            },
            Ut = function(t) {
                return t._repeat ? Dt(t._tTime, t = t.duration() + t._rDelay) * t : 0
            },
            Dt = function(t, e) {
                var n = Math.floor(t /= e);
                return t && n === t ? n - 1 : n
            },
            It = function(t, e) {
                return (t - e._start) * e._ts + (e._ts >= 0 ? 0 : e._dirty ? e.totalDuration() : e._tDur)
            },
            Ot = function(t) {
                return t._end = ft(t._start + (t._tDur / Math.abs(t._ts || t._rts || M) || 0))
            },
            Nt = function(t, e) {
                var n = t._dp;
                return n && n.smoothChildTiming && t._ts && (t._start = ft(n._time - (t._ts > 0 ? e / t._ts : ((t._dirty ? t.totalDuration() : t._tDur) - e) / -t._ts)), Ot(t), n._dirty || Ct(n, t)), t
            },
            Ft = function(t, e) {
                var n;
                if ((e._time || !e._dur && e._initted || e._start < t._time && (e._dur || !e.add)) && (n = It(t.rawTime(), e), (!e._dur || Kt(0, e.totalDuration(), n) - e._tTime > M) && e.render(n, !0)), Ct(t, e)._dp && t._initted && t._time >= t._dur && t._ts) {
                    if (t._dur < t.duration())
                        for (n = t; n._dp;) n.rawTime() >= 0 && n.totalTime(n._tTime), n = n._dp;
                    t._zTime = -1e-8
                }
            },
            zt = function(t, e, n, i) {
                return e.parent && Rt(e), e._start = ft((L(n) ? n : n || t !== s ? jt(t, n, e) : t._time) + e._delay), e._end = ft(e._start + (e.totalDuration() / Math.abs(e.timeScale()) || 0)), wt(t, e, "_first", "_last", t._sort ? "_start" : 0), Gt(e) || (t._recent = e), i || Ft(t, e), t._ts < 0 && Nt(t, t._tTime), t
            },
            Bt = function(t, e) {
                return (X.ScrollTrigger || Y("scrollTrigger", e)) && X.ScrollTrigger.create(e, t)
            },
            kt = function(t, e, n, i, a) {
                return We(t, e, a), t._initted ? !n && t._pt && !r && (t._dur && !1 !== t.vars.lazy || !t._dur && t.vars.lazy) && h !== Ee.frame ? (nt.push(t), t._lazy = [a, i], 1) : void 0 : 1
            },
            Ht = function t(e) {
                var n = e.parent;
                return n && n._ts && n._initted && !n._lock && (n.rawTime() < 0 || t(n))
            },
            Gt = function(t) {
                var e = t.data;
                return "isFromStart" === e || "isStart" === e
            },
            Vt = function(t, e, n, i) {
                var r = t._repeat,
                    a = ft(e) || 0,
                    s = t._tTime / t._tDur;
                return s && !i && (t._time *= a / t._dur), t._dur = a, t._tDur = r ? r < 0 ? 1e10 : ft(a * (r + 1) + t._rDelay * r) : a, s > 0 && !i && Nt(t, t._tTime = t._tDur * s), t.parent && Ot(t), n || Ct(t.parent, t), t
            },
            Wt = function(t) {
                return t instanceof ze ? Ct(t) : Vt(t, t._dur)
            },
            Xt = {
                _start: 0,
                endTime: $,
                totalDuration: $
            },
            jt = function t(e, n, i) {
                var r, a, s, o = e.labels,
                    l = e._recent || Xt,
                    c = e.duration() >= y ? l.endTime(!1) : e._dur;
                return R(n) && (isNaN(n) || n in o) ? (a = n.charAt(0), s = "%" === n.substr(-1), r = n.indexOf("="), "<" === a || ">" === a ? (r >= 0 && (n = n.replace(/=/, "")), ("<" === a ? l._start : l.endTime(l._repeat >= 0)) + (parseFloat(n.substr(1)) || 0) * (s ? (r < 0 ? l : i).totalDuration() / 100 : 1)) : r < 0 ? (n in o || (o[n] = c), o[n]) : (a = parseFloat(n.charAt(r - 1) + n.substr(r + 1)), s && i && (a = a / 100 * (F(i) ? i[0] : i).totalDuration()), r > 1 ? t(e, n.substr(0, r - 1), i) + a : c + a)) : null == n ? c : +n
            },
            qt = function(t, e, n) {
                var i, r, a = L(e[1]),
                    s = (a ? 2 : 1) + (t < 2 ? 0 : 1),
                    o = e[s];
                if (a && (o.duration = e[1]), o.parent = n, t) {
                    for (i = o, r = n; r && !("immediateRender" in i);) i = r.vars.defaults || {}, r = D(r.vars.inherit) && r.parent;
                    o.immediateRender = D(i.immediateRender), t < 2 ? o.runBackwards = 1 : o.startAt = e[s - 1]
                }
                return new Ke(e[0], o, e[s + 1])
            },
            Yt = function(t, e) {
                return t || 0 === t ? e(t) : e
            },
            Kt = function(t, e, n) {
                return n < t ? t : n > e ? e : n
            },
            Zt = function(t, e) {
                return R(t) && (e = W.exec(t)) ? e[1] : ""
            },
            $t = [].slice,
            Jt = function(t, e) {
                return t && U(t) && "length" in t && (!e && !t.length || t.length - 1 in t && U(t[0])) && !t.nodeType && t !== o
            },
            Qt = function(t, e, n) {
                return a && !e && a.selector ? a.selector(t) : !R(t) || n || !l && Te() ? F(t) ? function(t, e, n) {
                    return void 0 === n && (n = []), t.forEach((function(t) {
                        var i;
                        return R(t) && !e || Jt(t, 1) ? (i = n).push.apply(i, Qt(t)) : n.push(t)
                    })) || n
                }(t, n) : Jt(t) ? $t.call(t, 0) : t ? [t] : [] : $t.call((e || c).querySelectorAll(t), 0)
            },
            te = function(t) {
                return t = Qt(t)[0] || K("Invalid scope") || {},
                    function(e) {
                        var n = t.current || t.nativeElement || t;
                        return Qt(e, n.querySelectorAll ? n : n === t ? K("Invalid scope") || c.createElement("div") : t)
                    }
            },
            ee = function(t) {
                return t.sort((function() {
                    return .5 - Math.random()
                }))
            },
            ne = function(t) {
                if (C(t)) return t;
                var e = U(t) ? t : {
                        each: t
                    },
                    n = Pe(e.ease),
                    i = e.from || 0,
                    r = parseFloat(e.base) || 0,
                    a = {},
                    s = i > 0 && i < 1,
                    o = isNaN(i) || s,
                    l = e.axis,
                    c = i,
                    u = i;
                return R(i) ? c = u = {
                        center: .5,
                        edges: .5,
                        end: 1
                    } [i] || 0 : !s && o && (c = i[0], u = i[1]),
                    function(t, s, h) {
                        var d, p, f, m, g, _, v, x, M, S = (h || e).length,
                            E = a[S];
                        if (!E) {
                            if (!(M = "auto" === e.grid ? 0 : (e.grid || [1, y])[1])) {
                                for (v = -y; v < (v = h[M++].getBoundingClientRect().left) && M < S;);
                                M--
                            }
                            for (E = a[S] = [], d = o ? Math.min(M, S) * c - .5 : i % M, p = M === y ? 0 : o ? S * u / M - .5 : i / M | 0, v = 0, x = y, _ = 0; _ < S; _++) f = _ % M - d, m = p - (_ / M | 0), E[_] = g = l ? Math.abs("y" === l ? m : f) : b(f * f + m * m), g > v && (v = g), g < x && (x = g);
                            "random" === i && ee(E), E.max = v - x, E.min = x, E.v = S = (parseFloat(e.amount) || parseFloat(e.each) * (M > S ? S - 1 : l ? "y" === l ? S / M : M : Math.max(M, S / M)) || 0) * ("edges" === i ? -1 : 1), E.b = S < 0 ? r - S : r, E.u = Zt(e.amount || e.each) || 0, n = n && S < 0 ? Ce(n) : n
                        }
                        return S = (E[t] - E.min) / E.max || 0, ft(E.b + (n ? n(S) : S) * E.v) + E.u
                    }
            },
            ie = function(t) {
                var e = Math.pow(10, ((t + "").split(".")[1] || "").length);
                return function(n) {
                    var i = ft(Math.round(parseFloat(n) / t) * t * e);
                    return (i - i % 1) / e + (L(n) ? 0 : Zt(n))
                }
            },
            re = function(t, e) {
                var n, i, r = F(t);
                return !r && U(t) && (n = r = t.radius || y, t.values ? (t = Qt(t.values), (i = !L(t[0])) && (n *= n)) : t = ie(t.increment)), Yt(e, r ? C(t) ? function(e) {
                    return i = t(e), Math.abs(i - e) <= n ? i : e
                } : function(e) {
                    for (var r, a, s = parseFloat(i ? e.x : e), o = parseFloat(i ? e.y : 0), l = y, c = 0, u = t.length; u--;)(r = i ? (r = t[u].x - s) * r + (a = t[u].y - o) * a : Math.abs(t[u] - s)) < l && (l = r, c = u);
                    return c = !n || l <= n ? t[c] : e, i || c === e || L(e) ? c : c + Zt(e)
                } : ie(t))
            },
            ae = function(t, e, n, i) {
                return Yt(F(t) ? !e : !0 === n ? !!(n = 0) : !i, (function() {
                    return F(t) ? t[~~(Math.random() * t.length)] : (n = n || 1e-5) && (i = n < 1 ? Math.pow(10, (n + "").length - 2) : 1) && Math.floor(Math.round((t - n / 2 + Math.random() * (e - t + .99 * n)) / n) * n * i) / i
                }))
            },
            se = function(t, e, n) {
                return Yt(n, (function(n) {
                    return t[~~e(n)]
                }))
            },
            oe = function(t) {
                for (var e, n, i, r, a = 0, s = ""; ~(e = t.indexOf("random(", a));) i = t.indexOf(")", e), r = "[" === t.charAt(e + 7), n = t.substr(e + 7, i - e - 7).match(r ? V : z), s += t.substr(a, e - a) + ae(r ? n : +n[0], r ? 0 : +n[1], +n[2] || 1e-5), a = i + 1;
                return s + t.substr(a, t.length - a)
            },
            le = function(t, e, n, i, r) {
                var a = e - t,
                    s = i - n;
                return Yt(r, (function(e) {
                    return n + ((e - t) / a * s || 0)
                }))
            },
            ce = function(t, e, n) {
                var i, r, a, s = t.labels,
                    o = y;
                for (i in s)(r = s[i] - e) < 0 == !!n && r && o > (r = Math.abs(r)) && (a = i, o = r);
                return a
            },
            ue = function(t, e, n) {
                var i, r, s, o = t.vars,
                    l = o[e],
                    c = a,
                    u = t._ctx;
                if (l) return i = o[e + "Params"], r = o.callbackScope || t, n && nt.length && _t(), u && (a = u), s = i ? l.apply(r, i) : l.call(r), a = c, s
            },
            he = function(t) {
                return Rt(t), t.scrollTrigger && t.scrollTrigger.kill(!!r), t.progress() < 1 && ue(t, "onInterrupt"), t
            },
            de = [],
            pe = function(t) {
                if (I() && t) {
                    var e = (t = !t.name && t.default || t).name,
                        n = C(t),
                        i = e && !n && t.init ? function() {
                            this._props = []
                        } : t,
                        r = {
                            init: $,
                            render: an,
                            add: Ge,
                            kill: on,
                            modifier: sn,
                            rawVars: 0
                        },
                        a = {
                            targetTest: 0,
                            get: 0,
                            getSetter: tn,
                            aliases: {},
                            register: 0
                        };
                    if (Te(), t !== i) {
                        if (rt[e]) return;
                        Mt(i, Mt(Tt(t, r), a)), St(i.prototype, St(r, Tt(t, a))), rt[i.prop = e] = i, t.targetTest && (ot.push(i), et[e] = 1), e = ("css" === e ? "CSS" : e.charAt(0).toUpperCase() + e.substr(1)) + "Plugin"
                    }
                    Z(e, i), t.register && t.register(En, i, un)
                } else t && de.push(t)
            },
            fe = 255,
            me = {
                aqua: [0, fe, fe],
                lime: [0, fe, 0],
                silver: [192, 192, 192],
                black: [0, 0, 0],
                maroon: [128, 0, 0],
                teal: [0, 128, 128],
                blue: [0, 0, fe],
                navy: [0, 0, 128],
                white: [fe, fe, fe],
                olive: [128, 128, 0],
                yellow: [fe, fe, 0],
                orange: [fe, 165, 0],
                gray: [128, 128, 128],
                purple: [128, 0, 128],
                green: [0, 128, 0],
                red: [fe, 0, 0],
                pink: [fe, 192, 203],
                cyan: [0, fe, fe],
                transparent: [fe, fe, fe, 0]
            },
            ge = function(t, e, n) {
                return (6 * (t += t < 0 ? 1 : t > 1 ? -1 : 0) < 1 ? e + (n - e) * t * 6 : t < .5 ? n : 3 * t < 2 ? e + (n - e) * (2 / 3 - t) * 6 : e) * fe + .5 | 0
            },
            _e = function(t, e, n) {
                var i, r, a, s, o, l, c, u, h, d, p = t ? L(t) ? [t >> 16, t >> 8 & fe, t & fe] : 0 : me.black;
                if (!p) {
                    if ("," === t.substr(-1) && (t = t.substr(0, t.length - 1)), me[t]) p = me[t];
                    else if ("#" === t.charAt(0)) {
                        if (t.length < 6 && (i = t.charAt(1), r = t.charAt(2), a = t.charAt(3), t = "#" + i + i + r + r + a + a + (5 === t.length ? t.charAt(4) + t.charAt(4) : "")), 9 === t.length) return [(p = parseInt(t.substr(1, 6), 16)) >> 16, p >> 8 & fe, p & fe, parseInt(t.substr(7), 16) / 255];
                        p = [(t = parseInt(t.substr(1), 16)) >> 16, t >> 8 & fe, t & fe]
                    } else if ("hsl" === t.substr(0, 3))
                        if (p = d = t.match(z), e) {
                            if (~t.indexOf("=")) return p = t.match(B), n && p.length < 4 && (p[3] = 1), p
                        } else s = +p[0] % 360 / 360, o = +p[1] / 100, i = 2 * (l = +p[2] / 100) - (r = l <= .5 ? l * (o + 1) : l + o - l * o), p.length > 3 && (p[3] *= 1), p[0] = ge(s + 1 / 3, i, r), p[1] = ge(s, i, r), p[2] = ge(s - 1 / 3, i, r);
                    else p = t.match(z) || me.transparent;
                    p = p.map(Number)
                }
                return e && !d && (i = p[0] / fe, r = p[1] / fe, a = p[2] / fe, l = ((c = Math.max(i, r, a)) + (u = Math.min(i, r, a))) / 2, c === u ? s = o = 0 : (h = c - u, o = l > .5 ? h / (2 - c - u) : h / (c + u), s = c === i ? (r - a) / h + (r < a ? 6 : 0) : c === r ? (a - i) / h + 2 : (i - r) / h + 4, s *= 60), p[0] = ~~(s + .5), p[1] = ~~(100 * o + .5), p[2] = ~~(100 * l + .5)), n && p.length < 4 && (p[3] = 1), p
            },
            ve = function(t) {
                var e = [],
                    n = [],
                    i = -1;
                return t.split(ye).forEach((function(t) {
                    var r = t.match(k) || [];
                    e.push.apply(e, r), n.push(i += r.length + 1)
                })), e.c = n, e
            },
            xe = function(t, e, n) {
                var i, r, a, s, o = "",
                    l = (t + o).match(ye),
                    c = e ? "hsla(" : "rgba(",
                    u = 0;
                if (!l) return t;
                if (l = l.map((function(t) {
                        return (t = _e(t, e, 1)) && c + (e ? t[0] + "," + t[1] + "%," + t[2] + "%," + t[3] : t.join(",")) + ")"
                    })), n && (a = ve(t), (i = n.c).join(o) !== a.c.join(o)))
                    for (s = (r = t.replace(ye, "1").split(k)).length - 1; u < s; u++) o += r[u] + (~i.indexOf(u) ? l.shift() || c + "0,0,0,0)" : (a.length ? a : l.length ? l : n).shift());
                if (!r)
                    for (s = (r = t.split(ye)).length - 1; u < s; u++) o += r[u] + l[u];
                return o + r[s]
            },
            ye = function() {
                var t, e = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b";
                for (t in me) e += "|" + t + "\\b";
                return new RegExp(e + ")", "gi")
            }(),
            Me = /hsl[a]?\(/,
            Se = function(t) {
                var e, n = t.join(" ");
                if (ye.lastIndex = 0, ye.test(n)) return e = Me.test(n), t[1] = xe(t[1], e), t[0] = xe(t[0], e, ve(t[1])), !0
            },
            Ee = function() {
                var t, e, n, i, r, a, s = Date.now,
                    h = 500,
                    d = 33,
                    f = s(),
                    m = f,
                    g = 1e3 / 240,
                    _ = g,
                    v = [],
                    x = function n(o) {
                        var l, c, u, p, x = s() - m,
                            y = !0 === o;
                        if (x > h && (f += x - d), ((l = (u = (m += x) - f) - _) > 0 || y) && (p = ++i.frame, r = u - 1e3 * i.time, i.time = u /= 1e3, _ += l + (l >= g ? 4 : g - l), c = 1), y || (t = e(n)), c)
                            for (a = 0; a < v.length; a++) v[a](u, r, p, o)
                    };
                return i = {
                    time: 0,
                    frame: 0,
                    tick: function() {
                        x(!0)
                    },
                    deltaRatio: function(t) {
                        return r / (1e3 / (t || 60))
                    },
                    wake: function() {
                        u && (!l && I() && (o = l = window, c = o.document || {}, X.gsap = En, (o.gsapVersions || (o.gsapVersions = [])).push(En.version), q(j || o.GreenSockGlobals || !o.gsap && o || {}), n = o.requestAnimationFrame, de.forEach(pe)), t && i.sleep(), e = n || function(t) {
                            return setTimeout(t, _ - 1e3 * i.time + 1 | 0)
                        }, p = 1, x(2))
                    },
                    sleep: function() {
                        (n ? o.cancelAnimationFrame : clearTimeout)(t), p = 0, e = $
                    },
                    lagSmoothing: function(t, e) {
                        h = t || 1 / 0, d = Math.min(e || 33, h)
                    },
                    fps: function(t) {
                        g = 1e3 / (t || 240), _ = 1e3 * i.time + g
                    },
                    add: function(t, e, n) {
                        var r = e ? function(e, n, a, s) {
                            t(e, n, a, s), i.remove(r)
                        } : t;
                        return i.remove(t), v[n ? "unshift" : "push"](r), Te(), r
                    },
                    remove: function(t, e) {
                        ~(e = v.indexOf(t)) && v.splice(e, 1) && a >= e && a--
                    },
                    _listeners: v
                }, i
            }(),
            Te = function() {
                return !p && Ee.wake()
            },
            be = {},
            we = /^[\d.\-M][\d.\-,\s]/,
            Ae = /["']/g,
            Re = function(t) {
                for (var e, n, i, r = {}, a = t.substr(1, t.length - 3).split(":"), s = a[0], o = 1, l = a.length; o < l; o++) n = a[o], e = o !== l - 1 ? n.lastIndexOf(",") : n.length, i = n.substr(0, e), r[s] = isNaN(i) ? i.replace(Ae, "").trim() : +i, s = n.substr(e + 1).trim();
                return r
            },
            Ce = function(t) {
                return function(e) {
                    return 1 - t(1 - e)
                }
            },
            Le = function t(e, n) {
                for (var i, r = e._first; r;) r instanceof ze ? t(r, n) : !r.vars.yoyoEase || r._yoyo && r._repeat || r._yoyo === n || (r.timeline ? t(r.timeline, n) : (i = r._ease, r._ease = r._yEase, r._yEase = i, r._yoyo = n)), r = r._next
            },
            Pe = function(t, e) {
                return t && (C(t) ? t : be[t] || function(t) {
                    var e, n, i, r, a = (t + "").split("("),
                        s = be[a[0]];
                    return s && a.length > 1 && s.config ? s.config.apply(null, ~t.indexOf("{") ? [Re(a[1])] : (e = t, n = e.indexOf("(") + 1, i = e.indexOf(")"), r = e.indexOf("(", n), e.substring(n, ~r && r < i ? e.indexOf(")", i + 1) : i)).split(",").map(xt)) : be._CE && we.test(t) ? be._CE("", t) : s
                }(t)) || e
            },
            Ue = function(t, e, n, i) {
                void 0 === n && (n = function(t) {
                    return 1 - e(1 - t)
                }), void 0 === i && (i = function(t) {
                    return t < .5 ? e(2 * t) / 2 : 1 - e(2 * (1 - t)) / 2
                });
                var r, a = {
                    easeIn: e,
                    easeOut: n,
                    easeInOut: i
                };
                return dt(t, (function(t) {
                    for (var e in be[t] = X[t] = a, be[r = t.toLowerCase()] = n, a) be[r + ("easeIn" === e ? ".in" : "easeOut" === e ? ".out" : ".inOut")] = be[t + "." + e] = a[e]
                })), a
            },
            De = function(t) {
                return function(e) {
                    return e < .5 ? (1 - t(1 - 2 * e)) / 2 : .5 + t(2 * (e - .5)) / 2
                }
            },
            Ie = function t(e, n, i) {
                var r = n >= 1 ? n : 1,
                    a = (i || (e ? .3 : .45)) / (n < 1 ? n : 1),
                    s = a / S * (Math.asin(1 / r) || 0),
                    o = function(t) {
                        return 1 === t ? 1 : r * Math.pow(2, -10 * t) * A((t - s) * a) + 1
                    },
                    l = "out" === e ? o : "in" === e ? function(t) {
                        return 1 - o(1 - t)
                    } : De(o);
                return a = S / a, l.config = function(n, i) {
                    return t(e, n, i)
                }, l
            },
            Oe = function t(e, n) {
                void 0 === n && (n = 1.70158);
                var i = function(t) {
                        return t ? --t * t * ((n + 1) * t + n) + 1 : 0
                    },
                    r = "out" === e ? i : "in" === e ? function(t) {
                        return 1 - i(1 - t)
                    } : De(i);
                return r.config = function(n) {
                    return t(e, n)
                }, r
            };
        dt("Linear,Quad,Cubic,Quart,Quint,Strong", (function(t, e) {
            var n = e < 5 ? e + 1 : e;
            Ue(t + ",Power" + (n - 1), e ? function(t) {
                return Math.pow(t, n)
            } : function(t) {
                return t
            }, (function(t) {
                return 1 - Math.pow(1 - t, n)
            }), (function(t) {
                return t < .5 ? Math.pow(2 * t, n) / 2 : 1 - Math.pow(2 * (1 - t), n) / 2
            }))
        })), be.Linear.easeNone = be.none = be.Linear.easeIn, Ue("Elastic", Ie("in"), Ie("out"), Ie()), f = 7.5625, g = 1 / (m = 2.75), Ue("Bounce", (function(t) {
            return 1 - _(1 - t)
        }), _ = function(t) {
            return t < g ? f * t * t : t < .7272727272727273 ? f * Math.pow(t - 1.5 / m, 2) + .75 : t < .9090909090909092 ? f * (t -= 2.25 / m) * t + .9375 : f * Math.pow(t - 2.625 / m, 2) + .984375
        }), Ue("Expo", (function(t) {
            return t ? Math.pow(2, 10 * (t - 1)) : 0
        })), Ue("Circ", (function(t) {
            return -(b(1 - t * t) - 1)
        })), Ue("Sine", (function(t) {
            return 1 === t ? 1 : 1 - w(t * E)
        })), Ue("Back", Oe("in"), Oe("out"), Oe()), be.SteppedEase = be.steps = X.SteppedEase = {
            config: function(t, e) {
                void 0 === t && (t = 1);
                var n = 1 / t,
                    i = t + (e ? 0 : 1),
                    r = e ? 1 : 0;
                return function(t) {
                    return ((i * Kt(0, .99999999, t) | 0) + r) * n
                }
            }
        }, x.ease = be["quad.out"], dt("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", (function(t) {
            return lt += t + "," + t + "Params,"
        }));
        var Ne = function(t, e) {
                this.id = T++, t._gsap = this, this.target = t, this.harness = e, this.get = e ? e.get : ht, this.set = e ? e.getSetter : tn
            },
            Fe = function() {
                function t(t) {
                    this.vars = t, this._delay = +t.delay || 0, (this._repeat = t.repeat === 1 / 0 ? -2 : t.repeat || 0) && (this._rDelay = t.repeatDelay || 0, this._yoyo = !!t.yoyo || !!t.yoyoEase), this._ts = 1, Vt(this, +t.duration, 1, 1), this.data = t.data, a && (this._ctx = a, a.data.push(this)), p || Ee.wake()
                }
                var e = t.prototype;
                return e.delay = function(t) {
                    return t || 0 === t ? (this.parent && this.parent.smoothChildTiming && this.startTime(this._start + t - this._delay), this._delay = t, this) : this._delay
                }, e.duration = function(t) {
                    return arguments.length ? this.totalDuration(this._repeat > 0 ? t + (t + this._rDelay) * this._repeat : t) : this.totalDuration() && this._dur
                }, e.totalDuration = function(t) {
                    return arguments.length ? (this._dirty = 0, Vt(this, this._repeat < 0 ? t : (t - this._repeat * this._rDelay) / (this._repeat + 1))) : this._tDur
                }, e.totalTime = function(t, e) {
                    if (Te(), !arguments.length) return this._tTime;
                    var n = this._dp;
                    if (n && n.smoothChildTiming && this._ts) {
                        for (Nt(this, t), !n._dp || n.parent || Ft(n, this); n && n.parent;) n.parent._time !== n._start + (n._ts >= 0 ? n._tTime / n._ts : (n.totalDuration() - n._tTime) / -n._ts) && n.totalTime(n._tTime, !0), n = n.parent;
                        !this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && t < this._tDur || this._ts < 0 && t > 0 || !this._tDur && !t) && zt(this._dp, this, this._start - this._delay)
                    }
                    return (this._tTime !== t || !this._dur && !e || this._initted && Math.abs(this._zTime) === M || !t && !this._initted && (this.add || this._ptLookup)) && (this._ts || (this._pTime = t), vt(this, t, e)), this
                }, e.time = function(t, e) {
                    return arguments.length ? this.totalTime(Math.min(this.totalDuration(), t + Ut(this)) % (this._dur + this._rDelay) || (t ? this._dur : 0), e) : this._time
                }, e.totalProgress = function(t, e) {
                    return arguments.length ? this.totalTime(this.totalDuration() * t, e) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.ratio
                }, e.progress = function(t, e) {
                    return arguments.length ? this.totalTime(this.duration() * (!this._yoyo || 1 & this.iteration() ? t : 1 - t) + Ut(this), e) : this.duration() ? Math.min(1, this._time / this._dur) : this.ratio
                }, e.iteration = function(t, e) {
                    var n = this.duration() + this._rDelay;
                    return arguments.length ? this.totalTime(this._time + (t - 1) * n, e) : this._repeat ? Dt(this._tTime, n) + 1 : 1
                }, e.timeScale = function(t) {
                    if (!arguments.length) return -1e-8 === this._rts ? 0 : this._rts;
                    if (this._rts === t) return this;
                    var e = this.parent && this._ts ? It(this.parent._time, this) : this._tTime;
                    return this._rts = +t || 0, this._ts = this._ps || -1e-8 === t ? 0 : this._rts, this.totalTime(Kt(-Math.abs(this._delay), this._tDur, e), !0), Ot(this),
                        function(t) {
                            for (var e = t.parent; e && e.parent;) e._dirty = 1, e.totalDuration(), e = e.parent;
                            return t
                        }(this)
                }, e.paused = function(t) {
                    return arguments.length ? (this._ps !== t && (this._ps = t, t ? (this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()), this._ts = this._act = 0) : (Te(), this._ts = this._rts, this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, 1 === this.progress() && Math.abs(this._zTime) !== M && (this._tTime -= M)))), this) : this._ps
                }, e.startTime = function(t) {
                    if (arguments.length) {
                        this._start = t;
                        var e = this.parent || this._dp;
                        return e && (e._sort || !this.parent) && zt(e, this, t - this._delay), this
                    }
                    return this._start
                }, e.endTime = function(t) {
                    return this._start + (D(t) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1)
                }, e.rawTime = function(t) {
                    var e = this.parent || this._dp;
                    return e ? t && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : this._ts ? It(e.rawTime(t), this) : this._tTime : this._tTime
                }, e.revert = function(t) {
                    void 0 === t && (t = tt);
                    var e = r;
                    return r = t, (this._initted || this._startAt) && (this.timeline && this.timeline.revert(t), this.totalTime(-.01, t.suppressEvents)), "nested" !== this.data && !1 !== t.kill && this.kill(), r = e, this
                }, e.globalTime = function(t) {
                    for (var e = this, n = arguments.length ? t : e.rawTime(); e;) n = e._start + n / (e._ts || 1), e = e._dp;
                    return !this.parent && this._sat ? this._sat.vars.immediateRender ? -1 / 0 : this._sat.globalTime(t) : n
                }, e.repeat = function(t) {
                    return arguments.length ? (this._repeat = t === 1 / 0 ? -2 : t, Wt(this)) : -2 === this._repeat ? 1 / 0 : this._repeat
                }, e.repeatDelay = function(t) {
                    if (arguments.length) {
                        var e = this._time;
                        return this._rDelay = t, Wt(this), e ? this.time(e) : this
                    }
                    return this._rDelay
                }, e.yoyo = function(t) {
                    return arguments.length ? (this._yoyo = t, this) : this._yoyo
                }, e.seek = function(t, e) {
                    return this.totalTime(jt(this, t), D(e))
                }, e.restart = function(t, e) {
                    return this.play().totalTime(t ? -this._delay : 0, D(e))
                }, e.play = function(t, e) {
                    return null != t && this.seek(t, e), this.reversed(!1).paused(!1)
                }, e.reverse = function(t, e) {
                    return null != t && this.seek(t || this.totalDuration(), e), this.reversed(!0).paused(!1)
                }, e.pause = function(t, e) {
                    return null != t && this.seek(t, e), this.paused(!0)
                }, e.resume = function() {
                    return this.paused(!1)
                }, e.reversed = function(t) {
                    return arguments.length ? (!!t !== this.reversed() && this.timeScale(-this._rts || (t ? -1e-8 : 0)), this) : this._rts < 0
                }, e.invalidate = function() {
                    return this._initted = this._act = 0, this._zTime = -1e-8, this
                }, e.isActive = function() {
                    var t, e = this.parent || this._dp,
                        n = this._start;
                    return !(e && !(this._ts && this._initted && e.isActive() && (t = e.rawTime(!0)) >= n && t < this.endTime(!0) - M))
                }, e.eventCallback = function(t, e, n) {
                    var i = this.vars;
                    return arguments.length > 1 ? (e ? (i[t] = e, n && (i[t + "Params"] = n), "onUpdate" === t && (this._onUpdate = e)) : delete i[t], this) : i[t]
                }, e.then = function(t) {
                    var e = this;
                    return new Promise((function(n) {
                        var i = C(t) ? t : yt,
                            r = function() {
                                var t = e.then;
                                e.then = null, C(i) && (i = i(e)) && (i.then || i === e) && (e.then = t), n(i), e.then = t
                            };
                        e._initted && 1 === e.totalProgress() && e._ts >= 0 || !e._tTime && e._ts < 0 ? r() : e._prom = r
                    }))
                }, e.kill = function() {
                    he(this)
                }, t
            }();
        Mt(Fe.prototype, {
            _time: 0,
            _start: 0,
            _end: 0,
            _tTime: 0,
            _tDur: 0,
            _dirty: 0,
            _repeat: 0,
            _yoyo: !1,
            parent: null,
            _initted: !1,
            _rDelay: 0,
            _ts: 1,
            _dp: 0,
            ratio: 0,
            _zTime: -1e-8,
            _prom: 0,
            _ps: !1,
            _rts: 1
        });
        var ze = function(n) {
            function i(e, i) {
                var r;
                return void 0 === e && (e = {}), (r = n.call(this, e) || this).labels = {}, r.smoothChildTiming = !!e.smoothChildTiming, r.autoRemoveChildren = !!e.autoRemoveChildren, r._sort = D(e.sortChildren), s && zt(e.parent || s, t(r), i), e.reversed && r.reverse(), e.paused && r.paused(!0), e.scrollTrigger && Bt(t(r), e.scrollTrigger), r
            }
            e(i, n);
            var a = i.prototype;
            return a.to = function(t, e, n) {
                return qt(0, arguments, this), this
            }, a.from = function(t, e, n) {
                return qt(1, arguments, this), this
            }, a.fromTo = function(t, e, n, i) {
                return qt(2, arguments, this), this
            }, a.set = function(t, e, n) {
                return e.duration = 0, e.parent = this, bt(e).repeatDelay || (e.repeat = 0), e.immediateRender = !!e.immediateRender, new Ke(t, e, jt(this, n), 1), this
            }, a.call = function(t, e, n) {
                return zt(this, Ke.delayedCall(0, t, e), n)
            }, a.staggerTo = function(t, e, n, i, r, a, s) {
                return n.duration = e, n.stagger = n.stagger || i, n.onComplete = a, n.onCompleteParams = s, n.parent = this, new Ke(t, n, jt(this, r)), this
            }, a.staggerFrom = function(t, e, n, i, r, a, s) {
                return n.runBackwards = 1, bt(n).immediateRender = D(n.immediateRender), this.staggerTo(t, e, n, i, r, a, s)
            }, a.staggerFromTo = function(t, e, n, i, r, a, s, o) {
                return i.startAt = n, bt(i).immediateRender = D(i.immediateRender), this.staggerTo(t, e, i, r, a, s, o)
            }, a.render = function(t, e, n) {
                var i, a, o, l, c, u, h, d, p, f, m, g, _ = this._time,
                    v = this._dirty ? this.totalDuration() : this._tDur,
                    x = this._dur,
                    y = t <= 0 ? 0 : ft(t),
                    S = this._zTime < 0 != t < 0 && (this._initted || !x);
                if (this !== s && y > v && t >= 0 && (y = v), y !== this._tTime || n || S) {
                    if (_ !== this._time && x && (y += this._time - _, t += this._time - _), i = y, p = this._start, u = !(d = this._ts), S && (x || (_ = this._zTime), (t || !e) && (this._zTime = t)), this._repeat) {
                        if (m = this._yoyo, c = x + this._rDelay, this._repeat < -1 && t < 0) return this.totalTime(100 * c + t, e, n);
                        if (i = ft(y % c), y === v ? (l = this._repeat, i = x) : ((l = ~~(y / c)) && l === y / c && (i = x, l--), i > x && (i = x)), f = Dt(this._tTime, c), !_ && this._tTime && f !== l && this._tTime - f * c - this._dur <= 0 && (f = l), m && 1 & l && (i = x - i, g = 1), l !== f && !this._lock) {
                            var E = m && 1 & f,
                                T = E === (m && 1 & l);
                            if (l < f && (E = !E), _ = E ? 0 : y % x ? x : y, this._lock = 1, this.render(_ || (g ? 0 : ft(l * c)), e, !x)._lock = 0, this._tTime = y, !e && this.parent && ue(this, "onRepeat"), this.vars.repeatRefresh && !g && (this.invalidate()._lock = 1), _ && _ !== this._time || u !== !this._ts || this.vars.onRepeat && !this.parent && !this._act) return this;
                            if (x = this._dur, v = this._tDur, T && (this._lock = 2, _ = E ? x : -1e-4, this.render(_, !0), this.vars.repeatRefresh && !g && this.invalidate()), this._lock = 0, !this._ts && !u) return this;
                            Le(this, g)
                        }
                    }
                    if (this._hasPause && !this._forcing && this._lock < 2 && (h = function(t, e, n) {
                            var i;
                            if (n > e)
                                for (i = t._first; i && i._start <= n;) {
                                    if ("isPause" === i.data && i._start > e) return i;
                                    i = i._next
                                } else
                                    for (i = t._last; i && i._start >= n;) {
                                        if ("isPause" === i.data && i._start < e) return i;
                                        i = i._prev
                                    }
                        }(this, ft(_), ft(i)), h && (y -= i - (i = h._start))), this._tTime = y, this._time = i, this._act = !d, this._initted || (this._onUpdate = this.vars.onUpdate, this._initted = 1, this._zTime = t, _ = 0), !_ && i && !e && !l && (ue(this, "onStart"), this._tTime !== y)) return this;
                    if (i >= _ && t >= 0)
                        for (a = this._first; a;) {
                            if (o = a._next, (a._act || i >= a._start) && a._ts && h !== a) {
                                if (a.parent !== this) return this.render(t, e, n);
                                if (a.render(a._ts > 0 ? (i - a._start) * a._ts : (a._dirty ? a.totalDuration() : a._tDur) + (i - a._start) * a._ts, e, n), i !== this._time || !this._ts && !u) {
                                    h = 0, o && (y += this._zTime = -1e-8);
                                    break
                                }
                            }
                            a = o
                        } else {
                            a = this._last;
                            for (var b = t < 0 ? t : i; a;) {
                                if (o = a._prev, (a._act || b <= a._end) && a._ts && h !== a) {
                                    if (a.parent !== this) return this.render(t, e, n);
                                    if (a.render(a._ts > 0 ? (b - a._start) * a._ts : (a._dirty ? a.totalDuration() : a._tDur) + (b - a._start) * a._ts, e, n || r && (a._initted || a._startAt)), i !== this._time || !this._ts && !u) {
                                        h = 0, o && (y += this._zTime = b ? -1e-8 : M);
                                        break
                                    }
                                }
                                a = o
                            }
                        }
                    if (h && !e && (this.pause(), h.render(i >= _ ? 0 : -1e-8)._zTime = i >= _ ? 1 : -1, this._ts)) return this._start = p, Ot(this), this.render(t, e, n);
                    this._onUpdate && !e && ue(this, "onUpdate", !0), (y === v && this._tTime >= this.totalDuration() || !y && _) && (p !== this._start && Math.abs(d) === Math.abs(this._ts) || this._lock || ((t || !x) && (y === v && this._ts > 0 || !y && this._ts < 0) && Rt(this, 1), e || t < 0 && !_ || !y && !_ && v || (ue(this, y === v && t >= 0 ? "onComplete" : "onReverseComplete", !0), this._prom && !(y < v && this.timeScale() > 0) && this._prom())))
                }
                return this
            }, a.add = function(t, e) {
                var n = this;
                if (L(e) || (e = jt(this, e, t)), !(t instanceof Fe)) {
                    if (F(t)) return t.forEach((function(t) {
                        return n.add(t, e)
                    })), this;
                    if (R(t)) return this.addLabel(t, e);
                    if (!C(t)) return this;
                    t = Ke.delayedCall(0, t)
                }
                return this !== t ? zt(this, t, e) : this
            }, a.getChildren = function(t, e, n, i) {
                void 0 === t && (t = !0), void 0 === e && (e = !0), void 0 === n && (n = !0), void 0 === i && (i = -y);
                for (var r = [], a = this._first; a;) a._start >= i && (a instanceof Ke ? e && r.push(a) : (n && r.push(a), t && r.push.apply(r, a.getChildren(!0, e, n)))), a = a._next;
                return r
            }, a.getById = function(t) {
                for (var e = this.getChildren(1, 1, 1), n = e.length; n--;)
                    if (e[n].vars.id === t) return e[n]
            }, a.remove = function(t) {
                return R(t) ? this.removeLabel(t) : C(t) ? this.killTweensOf(t) : (At(this, t), t === this._recent && (this._recent = this._last), Ct(this))
            }, a.totalTime = function(t, e) {
                return arguments.length ? (this._forcing = 1, !this._dp && this._ts && (this._start = ft(Ee.time - (this._ts > 0 ? t / this._ts : (this.totalDuration() - t) / -this._ts))), n.prototype.totalTime.call(this, t, e), this._forcing = 0, this) : this._tTime
            }, a.addLabel = function(t, e) {
                return this.labels[t] = jt(this, e), this
            }, a.removeLabel = function(t) {
                return delete this.labels[t], this
            }, a.addPause = function(t, e, n) {
                var i = Ke.delayedCall(0, e || $, n);
                return i.data = "isPause", this._hasPause = 1, zt(this, i, jt(this, t))
            }, a.removePause = function(t) {
                var e = this._first;
                for (t = jt(this, t); e;) e._start === t && "isPause" === e.data && Rt(e), e = e._next
            }, a.killTweensOf = function(t, e, n) {
                for (var i = this.getTweensOf(t, n), r = i.length; r--;) Be !== i[r] && i[r].kill(t, e);
                return this
            }, a.getTweensOf = function(t, e) {
                for (var n, i = [], r = Qt(t), a = this._first, s = L(e); a;) a instanceof Ke ? gt(a._targets, r) && (s ? (!Be || a._initted && a._ts) && a.globalTime(0) <= e && a.globalTime(a.totalDuration()) > e : !e || a.isActive()) && i.push(a) : (n = a.getTweensOf(r, e)).length && i.push.apply(i, n), a = a._next;
                return i
            }, a.tweenTo = function(t, e) {
                e = e || {};
                var n, i = this,
                    r = jt(i, t),
                    a = e,
                    s = a.startAt,
                    o = a.onStart,
                    l = a.onStartParams,
                    c = a.immediateRender,
                    u = Ke.to(i, Mt({
                        ease: e.ease || "none",
                        lazy: !1,
                        immediateRender: !1,
                        time: r,
                        overwrite: "auto",
                        duration: e.duration || Math.abs((r - (s && "time" in s ? s.time : i._time)) / i.timeScale()) || M,
                        onStart: function() {
                            if (i.pause(), !n) {
                                var t = e.duration || Math.abs((r - (s && "time" in s ? s.time : i._time)) / i.timeScale());
                                u._dur !== t && Vt(u, t, 0, 1).render(u._time, !0, !0), n = 1
                            }
                            o && o.apply(u, l || [])
                        }
                    }, e));
                return c ? u.render(0) : u
            }, a.tweenFromTo = function(t, e, n) {
                return this.tweenTo(e, Mt({
                    startAt: {
                        time: jt(this, t)
                    }
                }, n))
            }, a.recent = function() {
                return this._recent
            }, a.nextLabel = function(t) {
                return void 0 === t && (t = this._time), ce(this, jt(this, t))
            }, a.previousLabel = function(t) {
                return void 0 === t && (t = this._time), ce(this, jt(this, t), 1)
            }, a.currentLabel = function(t) {
                return arguments.length ? this.seek(t, !0) : this.previousLabel(this._time + M)
            }, a.shiftChildren = function(t, e, n) {
                void 0 === n && (n = 0);
                for (var i, r = this._first, a = this.labels; r;) r._start >= n && (r._start += t, r._end += t), r = r._next;
                if (e)
                    for (i in a) a[i] >= n && (a[i] += t);
                return Ct(this)
            }, a.invalidate = function(t) {
                var e = this._first;
                for (this._lock = 0; e;) e.invalidate(t), e = e._next;
                return n.prototype.invalidate.call(this, t)
            }, a.clear = function(t) {
                void 0 === t && (t = !0);
                for (var e, n = this._first; n;) e = n._next, this.remove(n), n = e;
                return this._dp && (this._time = this._tTime = this._pTime = 0), t && (this.labels = {}), Ct(this)
            }, a.totalDuration = function(t) {
                var e, n, i, r = 0,
                    a = this,
                    o = a._last,
                    l = y;
                if (arguments.length) return a.timeScale((a._repeat < 0 ? a.duration() : a.totalDuration()) / (a.reversed() ? -t : t));
                if (a._dirty) {
                    for (i = a.parent; o;) e = o._prev, o._dirty && o.totalDuration(), (n = o._start) > l && a._sort && o._ts && !a._lock ? (a._lock = 1, zt(a, o, n - o._delay, 1)._lock = 0) : l = n, n < 0 && o._ts && (r -= n, (!i && !a._dp || i && i.smoothChildTiming) && (a._start += n / a._ts, a._time -= n, a._tTime -= n), a.shiftChildren(-n, !1, -Infinity), l = 0), o._end > r && o._ts && (r = o._end), o = e;
                    Vt(a, a === s && a._time > r ? a._time : r, 1, 1), a._dirty = 0
                }
                return a._tDur
            }, i.updateRoot = function(t) {
                if (s._ts && (vt(s, It(t, s)), h = Ee.frame), Ee.frame >= st) {
                    st += v.autoSleep || 120;
                    var e = s._first;
                    if ((!e || !e._ts) && v.autoSleep && Ee._listeners.length < 2) {
                        for (; e && !e._ts;) e = e._next;
                        e || Ee.sleep()
                    }
                }
            }, i
        }(Fe);
        Mt(ze.prototype, {
            _lock: 0,
            _hasPause: 0,
            _forcing: 0
        });
        var Be, ke, He = function(t, e, n, i, r, a, s) {
                var o, l, c, u, h, d, p, f, m = new un(this._pt, t, e, 0, 1, rn, null, r),
                    g = 0,
                    _ = 0;
                for (m.b = n, m.e = i, n += "", (p = ~(i += "").indexOf("random(")) && (i = oe(i)), a && (a(f = [n, i], t, e), n = f[0], i = f[1]), l = n.match(H) || []; o = H.exec(i);) u = o[0], h = i.substring(g, o.index), c ? c = (c + 1) % 5 : "rgba(" === h.substr(-5) && (c = 1), u !== l[_++] && (d = parseFloat(l[_ - 1]) || 0, m._pt = {
                    _next: m._pt,
                    p: h || 1 === _ ? h : ",",
                    s: d,
                    c: "=" === u.charAt(1) ? mt(d, u) - d : parseFloat(u) - d,
                    m: c && c < 4 ? Math.round : 0
                }, g = H.lastIndex);
                return m.c = g < i.length ? i.substring(g, i.length) : "", m.fp = s, (G.test(i) || p) && (m.e = 0), this._pt = m, m
            },
            Ge = function(t, e, n, i, r, a, s, o, l, c) {
                C(i) && (i = i(r || 0, t, a));
                var u, h = t[e],
                    d = "get" !== n ? n : C(h) ? l ? t[e.indexOf("set") || !C(t["get" + e.substr(3)]) ? e : "get" + e.substr(3)](l) : t[e]() : h,
                    p = C(h) ? l ? Je : $e : Ze;
                if (R(i) && (~i.indexOf("random(") && (i = oe(i)), "=" === i.charAt(1) && ((u = mt(d, i) + (Zt(d) || 0)) || 0 === u) && (i = u)), !c || d !== i || ke) return isNaN(d * i) || "" === i ? (!h && !(e in t) && Y(e, i), He.call(this, t, e, d, i, p, o || v.stringFilter, l)) : (u = new un(this._pt, t, e, +d || 0, i - (d || 0), "boolean" == typeof h ? nn : en, 0, p), l && (u.fp = l), s && u.modifier(s, this, t), this._pt = u)
            },
            Ve = function(t, e, n, i, r, a) {
                var s, o, l, c;
                if (rt[t] && !1 !== (s = new rt[t]).init(r, s.rawVars ? e[t] : function(t, e, n, i, r) {
                        if (C(t) && (t = je(t, r, e, n, i)), !U(t) || t.style && t.nodeType || F(t) || N(t)) return R(t) ? je(t, r, e, n, i) : t;
                        var a, s = {};
                        for (a in t) s[a] = je(t[a], r, e, n, i);
                        return s
                    }(e[t], i, r, a, n), n, i, a) && (n._pt = o = new un(n._pt, r, t, 0, 1, s.render, s, 0, s.priority), n !== d))
                    for (l = n._ptLookup[n._targets.indexOf(r)], c = s._props.length; c--;) l[s._props[c]] = o;
                return s
            },
            We = function t(e, n, a) {
                var o, l, c, u, h, d, p, f, m, g, _, v, S, E = e.vars,
                    T = E.ease,
                    b = E.startAt,
                    w = E.immediateRender,
                    A = E.lazy,
                    R = E.onUpdate,
                    C = E.onUpdateParams,
                    L = E.callbackScope,
                    P = E.runBackwards,
                    U = E.yoyoEase,
                    I = E.keyframes,
                    O = E.autoRevert,
                    N = e._dur,
                    F = e._startAt,
                    z = e._targets,
                    B = e.parent,
                    k = B && "nested" === B.data ? B.vars.targets : z,
                    H = "auto" === e._overwrite && !i,
                    G = e.timeline;
                if (G && (!I || !T) && (T = "none"), e._ease = Pe(T, x.ease), e._yEase = U ? Ce(Pe(!0 === U ? T : U, x.ease)) : 0, U && e._yoyo && !e._repeat && (U = e._yEase, e._yEase = e._ease, e._ease = U), e._from = !G && !!E.runBackwards, !G || I && !E.stagger) {
                    if (v = (f = z[0] ? ut(z[0]).harness : 0) && E[f.prop], o = Tt(E, et), F && (F._zTime < 0 && F.progress(1), n < 0 && P && w && !O ? F.render(-1, !0) : F.revert(P && N ? Q : J), F._lazy = 0), b) {
                        if (Rt(e._startAt = Ke.set(z, Mt({
                                data: "isStart",
                                overwrite: !1,
                                parent: B,
                                immediateRender: !0,
                                lazy: !F && D(A),
                                startAt: null,
                                delay: 0,
                                onUpdate: R,
                                onUpdateParams: C,
                                callbackScope: L,
                                stagger: 0
                            }, b))), e._startAt._dp = 0, e._startAt._sat = e, n < 0 && (r || !w && !O) && e._startAt.revert(Q), w && N && n <= 0 && a <= 0) return void(n && (e._zTime = n))
                    } else if (P && N && !F)
                        if (n && (w = !1), c = Mt({
                                overwrite: !1,
                                data: "isFromStart",
                                lazy: w && !F && D(A),
                                immediateRender: w,
                                stagger: 0,
                                parent: B
                            }, o), v && (c[f.prop] = v), Rt(e._startAt = Ke.set(z, c)), e._startAt._dp = 0, e._startAt._sat = e, n < 0 && (r ? e._startAt.revert(Q) : e._startAt.render(-1, !0)), e._zTime = n, w) {
                            if (!n) return
                        } else t(e._startAt, M, M);
                    for (e._pt = e._ptCache = 0, A = N && D(A) || A && !N, l = 0; l < z.length; l++) {
                        if (p = (h = z[l])._gsap || ct(z)[l]._gsap, e._ptLookup[l] = g = {}, it[p.id] && nt.length && _t(), _ = k === z ? l : k.indexOf(h), f && !1 !== (m = new f).init(h, v || o, e, _, k) && (e._pt = u = new un(e._pt, h, m.name, 0, 1, m.render, m, 0, m.priority), m._props.forEach((function(t) {
                                g[t] = u
                            })), m.priority && (d = 1)), !f || v)
                            for (c in o) rt[c] && (m = Ve(c, o, e, _, h, k)) ? m.priority && (d = 1) : g[c] = u = Ge.call(e, h, c, "get", o[c], _, k, 0, E.stringFilter);
                        e._op && e._op[l] && e.kill(h, e._op[l]), H && e._pt && (Be = e, s.killTweensOf(h, g, e.globalTime(n)), S = !e.parent, Be = 0), e._pt && A && (it[p.id] = 1)
                    }
                    d && cn(e), e._onInit && e._onInit(e)
                }
                e._onUpdate = R, e._initted = (!e._op || e._pt) && !S, I && n <= 0 && G.render(y, !0, !0)
            },
            Xe = function(t, e, n, i) {
                var r, a, s = e.ease || i || "power1.inOut";
                if (F(e)) a = n[t] || (n[t] = []), e.forEach((function(t, n) {
                    return a.push({
                        t: n / (e.length - 1) * 100,
                        v: t,
                        e: s
                    })
                }));
                else
                    for (r in e) a = n[r] || (n[r] = []), "ease" === r || a.push({
                        t: parseFloat(t),
                        v: e[r],
                        e: s
                    })
            },
            je = function(t, e, n, i, r) {
                return C(t) ? t.call(e, n, i, r) : R(t) && ~t.indexOf("random(") ? oe(t) : t
            },
            qe = lt + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert",
            Ye = {};
        dt(qe + ",id,stagger,delay,duration,paused,scrollTrigger", (function(t) {
            return Ye[t] = 1
        }));
        var Ke = function(n) {
            function a(e, r, a, o) {
                var l;
                "number" == typeof r && (a.duration = r, r = a, a = null);
                var c, u, h, d, p, f, m, g, _ = (l = n.call(this, o ? r : bt(r)) || this).vars,
                    x = _.duration,
                    y = _.delay,
                    M = _.immediateRender,
                    S = _.stagger,
                    E = _.overwrite,
                    T = _.keyframes,
                    b = _.defaults,
                    w = _.scrollTrigger,
                    A = _.yoyoEase,
                    R = r.parent || s,
                    C = (F(e) || N(e) ? L(e[0]) : "length" in r) ? [e] : Qt(e);
                if (l._targets = C.length ? ct(C) : K("GSAP target " + e + " not found. https://greensock.com", !v.nullTargetWarn) || [], l._ptLookup = [], l._overwrite = E, T || S || O(x) || O(y)) {
                    if (r = l.vars, (c = l.timeline = new ze({
                            data: "nested",
                            defaults: b || {},
                            targets: R && "nested" === R.data ? R.vars.targets : C
                        })).kill(), c.parent = c._dp = t(l), c._start = 0, S || O(x) || O(y)) {
                        if (d = C.length, m = S && ne(S), U(S))
                            for (p in S) ~qe.indexOf(p) && (g || (g = {}), g[p] = S[p]);
                        for (u = 0; u < d; u++)(h = Tt(r, Ye)).stagger = 0, A && (h.yoyoEase = A), g && St(h, g), f = C[u], h.duration = +je(x, t(l), u, f, C), h.delay = (+je(y, t(l), u, f, C) || 0) - l._delay, !S && 1 === d && h.delay && (l._delay = y = h.delay, l._start += y, h.delay = 0), c.to(f, h, m ? m(u, f, C) : 0), c._ease = be.none;
                        c.duration() ? x = y = 0 : l.timeline = 0
                    } else if (T) {
                        bt(Mt(c.vars.defaults, {
                            ease: "none"
                        })), c._ease = Pe(T.ease || r.ease || "none");
                        var P, I, z, B = 0;
                        if (F(T)) T.forEach((function(t) {
                            return c.to(C, t, ">")
                        })), c.duration();
                        else {
                            for (p in h = {}, T) "ease" === p || "easeEach" === p || Xe(p, T[p], h, T.easeEach);
                            for (p in h)
                                for (P = h[p].sort((function(t, e) {
                                        return t.t - e.t
                                    })), B = 0, u = 0; u < P.length; u++)(z = {
                                    ease: (I = P[u]).e,
                                    duration: (I.t - (u ? P[u - 1].t : 0)) / 100 * x
                                })[p] = I.v, c.to(C, z, B), B += z.duration;
                            c.duration() < x && c.to({}, {
                                duration: x - c.duration()
                            })
                        }
                    }
                    x || l.duration(x = c.duration())
                } else l.timeline = 0;
                return !0 !== E || i || (Be = t(l), s.killTweensOf(C), Be = 0), zt(R, t(l), a), r.reversed && l.reverse(), r.paused && l.paused(!0), (M || !x && !T && l._start === ft(R._time) && D(M) && Pt(t(l)) && "nested" !== R.data) && (l._tTime = -1e-8, l.render(Math.max(0, -y) || 0)), w && Bt(t(l), w), l
            }
            e(a, n);
            var o = a.prototype;
            return o.render = function(t, e, n) {
                var i, a, s, o, l, c, u, h, d, p = this._time,
                    f = this._tDur,
                    m = this._dur,
                    g = t < 0,
                    _ = t > f - M && !g ? f : t < M ? 0 : t;
                if (m) {
                    if (_ !== this._tTime || !t || n || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== g) {
                        if (i = _, h = this.timeline, this._repeat) {
                            if (o = m + this._rDelay, this._repeat < -1 && g) return this.totalTime(100 * o + t, e, n);
                            if (i = ft(_ % o), _ === f ? (s = this._repeat, i = m) : ((s = ~~(_ / o)) && s === _ / o && (i = m, s--), i > m && (i = m)), (c = this._yoyo && 1 & s) && (d = this._yEase, i = m - i), l = Dt(this._tTime, o), i === p && !n && this._initted) return this._tTime = _, this;
                            s !== l && (h && this._yEase && Le(h, c), !this.vars.repeatRefresh || c || this._lock || (this._lock = n = 1, this.render(ft(o * s), !0).invalidate()._lock = 0))
                        }
                        if (!this._initted) {
                            if (kt(this, g ? t : i, n, e, _)) return this._tTime = 0, this;
                            if (p !== this._time) return this;
                            if (m !== this._dur) return this.render(t, e, n)
                        }
                        if (this._tTime = _, this._time = i, !this._act && this._ts && (this._act = 1, this._lazy = 0), this.ratio = u = (d || this._ease)(i / m), this._from && (this.ratio = u = 1 - u), i && !p && !e && !s && (ue(this, "onStart"), this._tTime !== _)) return this;
                        for (a = this._pt; a;) a.r(u, a.d), a = a._next;
                        h && h.render(t < 0 ? t : !i && c ? -1e-8 : h._dur * h._ease(i / this._dur), e, n) || this._startAt && (this._zTime = t), this._onUpdate && !e && (g && Lt(this, t, 0, n), ue(this, "onUpdate")), this._repeat && s !== l && this.vars.onRepeat && !e && this.parent && ue(this, "onRepeat"), _ !== this._tDur && _ || this._tTime !== _ || (g && !this._onUpdate && Lt(this, t, 0, !0), (t || !m) && (_ === this._tDur && this._ts > 0 || !_ && this._ts < 0) && Rt(this, 1), e || g && !p || !(_ || p || c) || (ue(this, _ === f ? "onComplete" : "onReverseComplete", !0), this._prom && !(_ < f && this.timeScale() > 0) && this._prom()))
                    }
                } else ! function(t, e, n, i) {
                    var a, s, o, l = t.ratio,
                        c = e < 0 || !e && (!t._start && Ht(t) && (t._initted || !Gt(t)) || (t._ts < 0 || t._dp._ts < 0) && !Gt(t)) ? 0 : 1,
                        u = t._rDelay,
                        h = 0;
                    if (u && t._repeat && (h = Kt(0, t._tDur, e), s = Dt(h, u), t._yoyo && 1 & s && (c = 1 - c), s !== Dt(t._tTime, u) && (l = 1 - c, t.vars.repeatRefresh && t._initted && t.invalidate())), c !== l || r || i || t._zTime === M || !e && t._zTime) {
                        if (!t._initted && kt(t, e, i, n, h)) return;
                        for (o = t._zTime, t._zTime = e || (n ? M : 0), n || (n = e && !o), t.ratio = c, t._from && (c = 1 - c), t._time = 0, t._tTime = h, a = t._pt; a;) a.r(c, a.d), a = a._next;
                        e < 0 && Lt(t, e, 0, !0), t._onUpdate && !n && ue(t, "onUpdate"), h && t._repeat && !n && t.parent && ue(t, "onRepeat"), (e >= t._tDur || e < 0) && t.ratio === c && (c && Rt(t, 1), n || r || (ue(t, c ? "onComplete" : "onReverseComplete", !0), t._prom && t._prom()))
                    } else t._zTime || (t._zTime = e)
                }(this, t, e, n);
                return this
            }, o.targets = function() {
                return this._targets
            }, o.invalidate = function(t) {
                return (!t || !this.vars.runBackwards) && (this._startAt = 0), this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0, this._ptLookup = [], this.timeline && this.timeline.invalidate(t), n.prototype.invalidate.call(this, t)
            }, o.resetTo = function(t, e, n, i) {
                p || Ee.wake(), this._ts || this.play();
                var r = Math.min(this._dur, (this._dp._time - this._start) * this._ts);
                return this._initted || We(this, r),
                    function(t, e, n, i, r, a, s) {
                        var o, l, c, u, h = (t._pt && t._ptCache || (t._ptCache = {}))[e];
                        if (!h)
                            for (h = t._ptCache[e] = [], c = t._ptLookup, u = t._targets.length; u--;) {
                                if ((o = c[u][e]) && o.d && o.d._pt)
                                    for (o = o.d._pt; o && o.p !== e && o.fp !== e;) o = o._next;
                                if (!o) return ke = 1, t.vars[e] = "+=0", We(t, s), ke = 0, 1;
                                h.push(o)
                            }
                        for (u = h.length; u--;)(o = (l = h[u])._pt || l).s = !i && 0 !== i || r ? o.s + (i || 0) + a * o.c : i, o.c = n - o.s, l.e && (l.e = pt(n) + Zt(l.e)), l.b && (l.b = o.s + Zt(l.b))
                    }(this, t, e, n, i, this._ease(r / this._dur), r) ? this.resetTo(t, e, n, i) : (Nt(this, 0), this.parent || wt(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0), this.render(0))
            }, o.kill = function(t, e) {
                if (void 0 === e && (e = "all"), !(t || e && "all" !== e)) return this._lazy = this._pt = 0, this.parent ? he(this) : this;
                if (this.timeline) {
                    var n = this.timeline.totalDuration();
                    return this.timeline.killTweensOf(t, e, Be && !0 !== Be.vars.overwrite)._first || he(this), this.parent && n !== this.timeline.totalDuration() && Vt(this, this._dur * this.timeline._tDur / n, 0, 1), this
                }
                var i, r, a, s, o, l, c, u = this._targets,
                    h = t ? Qt(t) : u,
                    d = this._ptLookup,
                    p = this._pt;
                if ((!e || "all" === e) && function(t, e) {
                        for (var n = t.length, i = n === e.length; i && n-- && t[n] === e[n];);
                        return n < 0
                    }(u, h)) return "all" === e && (this._pt = 0), he(this);
                for (i = this._op = this._op || [], "all" !== e && (R(e) && (o = {}, dt(e, (function(t) {
                        return o[t] = 1
                    })), e = o), e = function(t, e) {
                        var n, i, r, a, s = t[0] ? ut(t[0]).harness : 0,
                            o = s && s.aliases;
                        if (!o) return e;
                        for (i in n = St({}, e), o)
                            if (i in n)
                                for (r = (a = o[i].split(",")).length; r--;) n[a[r]] = n[i];
                        return n
                    }(u, e)), c = u.length; c--;)
                    if (~h.indexOf(u[c]))
                        for (o in r = d[c], "all" === e ? (i[c] = e, s = r, a = {}) : (a = i[c] = i[c] || {}, s = e), s)(l = r && r[o]) && ("kill" in l.d && !0 !== l.d.kill(o) || At(this, l, "_pt"), delete r[o]), "all" !== a && (a[o] = 1);
                return this._initted && !this._pt && p && he(this), this
            }, a.to = function(t, e) {
                return new a(t, e, arguments[2])
            }, a.from = function(t, e) {
                return qt(1, arguments)
            }, a.delayedCall = function(t, e, n, i) {
                return new a(e, 0, {
                    immediateRender: !1,
                    lazy: !1,
                    overwrite: !1,
                    delay: t,
                    onComplete: e,
                    onReverseComplete: e,
                    onCompleteParams: n,
                    onReverseCompleteParams: n,
                    callbackScope: i
                })
            }, a.fromTo = function(t, e, n) {
                return qt(2, arguments)
            }, a.set = function(t, e) {
                return e.duration = 0, e.repeatDelay || (e.repeat = 0), new a(t, e)
            }, a.killTweensOf = function(t, e, n) {
                return s.killTweensOf(t, e, n)
            }, a
        }(Fe);
        Mt(Ke.prototype, {
            _targets: [],
            _lazy: 0,
            _startAt: 0,
            _op: 0,
            _onInit: 0
        }), dt("staggerTo,staggerFrom,staggerFromTo", (function(t) {
            Ke[t] = function() {
                var e = new ze,
                    n = $t.call(arguments, 0);
                return n.splice("staggerFromTo" === t ? 5 : 4, 0, 0), e[t].apply(e, n)
            }
        }));
        var Ze = function(t, e, n) {
                return t[e] = n
            },
            $e = function(t, e, n) {
                return t[e](n)
            },
            Je = function(t, e, n, i) {
                return t[e](i.fp, n)
            },
            Qe = function(t, e, n) {
                return t.setAttribute(e, n)
            },
            tn = function(t, e) {
                return C(t[e]) ? $e : P(t[e]) && t.setAttribute ? Qe : Ze
            },
            en = function(t, e) {
                return e.set(e.t, e.p, Math.round(1e6 * (e.s + e.c * t)) / 1e6, e)
            },
            nn = function(t, e) {
                return e.set(e.t, e.p, !!(e.s + e.c * t), e)
            },
            rn = function(t, e) {
                var n = e._pt,
                    i = "";
                if (!t && e.b) i = e.b;
                else if (1 === t && e.e) i = e.e;
                else {
                    for (; n;) i = n.p + (n.m ? n.m(n.s + n.c * t) : Math.round(1e4 * (n.s + n.c * t)) / 1e4) + i, n = n._next;
                    i += e.c
                }
                e.set(e.t, e.p, i, e)
            },
            an = function(t, e) {
                for (var n = e._pt; n;) n.r(t, n.d), n = n._next
            },
            sn = function(t, e, n, i) {
                for (var r, a = this._pt; a;) r = a._next, a.p === i && a.modifier(t, e, n), a = r
            },
            on = function(t) {
                for (var e, n, i = this._pt; i;) n = i._next, i.p === t && !i.op || i.op === t ? At(this, i, "_pt") : i.dep || (e = 1), i = n;
                return !e
            },
            ln = function(t, e, n, i) {
                i.mSet(t, e, i.m.call(i.tween, n, i.mt), i)
            },
            cn = function(t) {
                for (var e, n, i, r, a = t._pt; a;) {
                    for (e = a._next, n = i; n && n.pr > a.pr;) n = n._next;
                    (a._prev = n ? n._prev : r) ? a._prev._next = a: i = a, (a._next = n) ? n._prev = a : r = a, a = e
                }
                t._pt = i
            },
            un = function() {
                function t(t, e, n, i, r, a, s, o, l) {
                    this.t = e, this.s = i, this.c = r, this.p = n, this.r = a || en, this.d = s || this, this.set = o || Ze, this.pr = l || 0, this._next = t, t && (t._prev = this)
                }
                return t.prototype.modifier = function(t, e, n) {
                    this.mSet = this.mSet || this.set, this.set = ln, this.m = t, this.mt = n, this.tween = e
                }, t
            }();
        dt(lt + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", (function(t) {
            return et[t] = 1
        })), X.TweenMax = X.TweenLite = Ke, X.TimelineLite = X.TimelineMax = ze, s = new ze({
            sortChildren: !1,
            defaults: x,
            autoRemoveChildren: !0,
            id: "root",
            smoothChildTiming: !0
        }), v.stringFilter = Se;
        var hn = [],
            dn = {},
            pn = [],
            fn = 0,
            mn = 0,
            gn = function(t) {
                return (dn[t] || pn).map((function(t) {
                    return t()
                }))
            },
            _n = function() {
                var t = Date.now(),
                    e = [];
                t - fn > 2 && (gn("matchMediaInit"), hn.forEach((function(t) {
                    var n, i, r, a, s = t.queries,
                        l = t.conditions;
                    for (i in s)(n = o.matchMedia(s[i]).matches) && (r = 1), n !== l[i] && (l[i] = n, a = 1);
                    a && (t.revert(), r && e.push(t))
                })), gn("matchMediaRevert"), e.forEach((function(t) {
                    return t.onMatch(t)
                })), fn = t, gn("matchMedia"))
            },
            vn = function() {
                function t(t, e) {
                    this.selector = e && te(e), this.data = [], this._r = [], this.isReverted = !1, this.id = mn++, t && this.add(t)
                }
                var e = t.prototype;
                return e.add = function(t, e, n) {
                    C(t) && (n = e, e = t, t = C);
                    var i = this,
                        r = function() {
                            var t, r = a,
                                s = i.selector;
                            return r && r !== i && r.data.push(i), n && (i.selector = te(n)), a = i, t = e.apply(i, arguments), C(t) && i._r.push(t), a = r, i.selector = s, i.isReverted = !1, t
                        };
                    return i.last = r, t === C ? r(i) : t ? i[t] = r : r
                }, e.ignore = function(t) {
                    var e = a;
                    a = null, t(this), a = e
                }, e.getTweens = function() {
                    var e = [];
                    return this.data.forEach((function(n) {
                        return n instanceof t ? e.push.apply(e, n.getTweens()) : n instanceof Ke && !(n.parent && "nested" === n.parent.data) && e.push(n)
                    })), e
                }, e.clear = function() {
                    this._r.length = this.data.length = 0
                }, e.kill = function(t, e) {
                    var n = this;
                    if (t) {
                        var i = this.getTweens();
                        this.data.forEach((function(t) {
                            "isFlip" === t.data && (t.revert(), t.getChildren(!0, !0, !1).forEach((function(t) {
                                return i.splice(i.indexOf(t), 1)
                            })))
                        })), i.map((function(t) {
                            return {
                                g: t.globalTime(0),
                                t
                            }
                        })).sort((function(t, e) {
                            return e.g - t.g || -1 / 0
                        })).forEach((function(e) {
                            return e.t.revert(t)
                        })), this.data.forEach((function(e) {
                            return !(e instanceof Ke) && e.revert && e.revert(t)
                        })), this._r.forEach((function(e) {
                            return e(t, n)
                        })), this.isReverted = !0
                    } else this.data.forEach((function(t) {
                        return t.kill && t.kill()
                    }));
                    if (this.clear(), e)
                        for (var r = hn.length; r--;) hn[r].id === this.id && hn.splice(r, 1)
                }, e.revert = function(t) {
                    this.kill(t || {})
                }, t
            }(),
            xn = function() {
                function t(t) {
                    this.contexts = [], this.scope = t
                }
                var e = t.prototype;
                return e.add = function(t, e, n) {
                    U(t) || (t = {
                        matches: t
                    });
                    var i, r, s, l = new vn(0, n || this.scope),
                        c = l.conditions = {};
                    for (r in a && !l.selector && (l.selector = a.selector), this.contexts.push(l), e = l.add("onMatch", e), l.queries = t, t) "all" === r ? s = 1 : (i = o.matchMedia(t[r])) && (hn.indexOf(l) < 0 && hn.push(l), (c[r] = i.matches) && (s = 1), i.addListener ? i.addListener(_n) : i.addEventListener("change", _n));
                    return s && e(l), this
                }, e.revert = function(t) {
                    this.kill(t || {})
                }, e.kill = function(t) {
                    this.contexts.forEach((function(e) {
                        return e.kill(t, !0)
                    }))
                }, t
            }(),
            yn = {
                registerPlugin: function() {
                    for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++) e[n] = arguments[n];
                    e.forEach((function(t) {
                        return pe(t)
                    }))
                },
                timeline: function(t) {
                    return new ze(t)
                },
                getTweensOf: function(t, e) {
                    return s.getTweensOf(t, e)
                },
                getProperty: function(t, e, n, i) {
                    R(t) && (t = Qt(t)[0]);
                    var r = ut(t || {}).get,
                        a = n ? yt : xt;
                    return "native" === n && (n = ""), t ? e ? a((rt[e] && rt[e].get || r)(t, e, n, i)) : function(e, n, i) {
                        return a((rt[e] && rt[e].get || r)(t, e, n, i))
                    } : t
                },
                quickSetter: function(t, e, n) {
                    if ((t = Qt(t)).length > 1) {
                        var i = t.map((function(t) {
                                return En.quickSetter(t, e, n)
                            })),
                            r = i.length;
                        return function(t) {
                            for (var e = r; e--;) i[e](t)
                        }
                    }
                    t = t[0] || {};
                    var a = rt[e],
                        s = ut(t),
                        o = s.harness && (s.harness.aliases || {})[e] || e,
                        l = a ? function(e) {
                            var i = new a;
                            d._pt = 0, i.init(t, n ? e + n : e, d, 0, [t]), i.render(1, i), d._pt && an(1, d)
                        } : s.set(t, o);
                    return a ? l : function(e) {
                        return l(t, o, n ? e + n : e, s, 1)
                    }
                },
                quickTo: function(t, e, n) {
                    var i, r = En.to(t, St(((i = {})[e] = "+=0.1", i.paused = !0, i), n || {})),
                        a = function(t, n, i) {
                            return r.resetTo(e, t, n, i)
                        };
                    return a.tween = r, a
                },
                isTweening: function(t) {
                    return s.getTweensOf(t, !0).length > 0
                },
                defaults: function(t) {
                    return t && t.ease && (t.ease = Pe(t.ease, x.ease)), Et(x, t || {})
                },
                config: function(t) {
                    return Et(v, t || {})
                },
                registerEffect: function(t) {
                    var e = t.name,
                        n = t.effect,
                        i = t.plugins,
                        r = t.defaults,
                        a = t.extendTimeline;
                    (i || "").split(",").forEach((function(t) {
                        return t && !rt[t] && !X[t] && K(e + " effect requires " + t + " plugin.")
                    })), at[e] = function(t, e, i) {
                        return n(Qt(t), Mt(e || {}, r), i)
                    }, a && (ze.prototype[e] = function(t, n, i) {
                        return this.add(at[e](t, U(n) ? n : (i = n) && {}, this), i)
                    })
                },
                registerEase: function(t, e) {
                    be[t] = Pe(e)
                },
                parseEase: function(t, e) {
                    return arguments.length ? Pe(t, e) : be
                },
                getById: function(t) {
                    return s.getById(t)
                },
                exportRoot: function(t, e) {
                    void 0 === t && (t = {});
                    var n, i, r = new ze(t);
                    for (r.smoothChildTiming = D(t.smoothChildTiming), s.remove(r), r._dp = 0, r._time = r._tTime = s._time, n = s._first; n;) i = n._next, !e && !n._dur && n instanceof Ke && n.vars.onComplete === n._targets[0] || zt(r, n, n._start - n._delay), n = i;
                    return zt(s, r, 0), r
                },
                context: function(t, e) {
                    return t ? new vn(t, e) : a
                },
                matchMedia: function(t) {
                    return new xn(t)
                },
                matchMediaRefresh: function() {
                    return hn.forEach((function(t) {
                        var e, n, i = t.conditions;
                        for (n in i) i[n] && (i[n] = !1, e = 1);
                        e && t.revert()
                    })) || _n()
                },
                addEventListener: function(t, e) {
                    var n = dn[t] || (dn[t] = []);
                    ~n.indexOf(e) || n.push(e)
                },
                removeEventListener: function(t, e) {
                    var n = dn[t],
                        i = n && n.indexOf(e);
                    i >= 0 && n.splice(i, 1)
                },
                utils: {
                    wrap: function t(e, n, i) {
                        var r = n - e;
                        return F(e) ? se(e, t(0, e.length), n) : Yt(i, (function(t) {
                            return (r + (t - e) % r) % r + e
                        }))
                    },
                    wrapYoyo: function t(e, n, i) {
                        var r = n - e,
                            a = 2 * r;
                        return F(e) ? se(e, t(0, e.length - 1), n) : Yt(i, (function(t) {
                            return e + ((t = (a + (t - e) % a) % a || 0) > r ? a - t : t)
                        }))
                    },
                    distribute: ne,
                    random: ae,
                    snap: re,
                    normalize: function(t, e, n) {
                        return le(t, e, 0, 1, n)
                    },
                    getUnit: Zt,
                    clamp: function(t, e, n) {
                        return Yt(n, (function(n) {
                            return Kt(t, e, n)
                        }))
                    },
                    splitColor: _e,
                    toArray: Qt,
                    selector: te,
                    mapRange: le,
                    pipe: function() {
                        for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++) e[n] = arguments[n];
                        return function(t) {
                            return e.reduce((function(t, e) {
                                return e(t)
                            }), t)
                        }
                    },
                    unitize: function(t, e) {
                        return function(n) {
                            return t(parseFloat(n)) + (e || Zt(n))
                        }
                    },
                    interpolate: function t(e, n, i, r) {
                        var a = isNaN(e + n) ? 0 : function(t) {
                            return (1 - t) * e + t * n
                        };
                        if (!a) {
                            var s, o, l, c, u, h = R(e),
                                d = {};
                            if (!0 === i && (r = 1) && (i = null), h) e = {
                                p: e
                            }, n = {
                                p: n
                            };
                            else if (F(e) && !F(n)) {
                                for (l = [], c = e.length, u = c - 2, o = 1; o < c; o++) l.push(t(e[o - 1], e[o]));
                                c--, a = function(t) {
                                    t *= c;
                                    var e = Math.min(u, ~~t);
                                    return l[e](t - e)
                                }, i = n
                            } else r || (e = St(F(e) ? [] : {}, e));
                            if (!l) {
                                for (s in n) Ge.call(d, e, s, "get", n[s]);
                                a = function(t) {
                                    return an(t, d) || (h ? e.p : e)
                                }
                            }
                        }
                        return Yt(i, a)
                    },
                    shuffle: ee
                },
                install: q,
                effects: at,
                ticker: Ee,
                updateRoot: ze.updateRoot,
                plugins: rt,
                globalTimeline: s,
                core: {
                    PropTween: un,
                    globals: Z,
                    Tween: Ke,
                    Timeline: ze,
                    Animation: Fe,
                    getCache: ut,
                    _removeLinkedListItem: At,
                    reverting: function() {
                        return r
                    },
                    context: function(t) {
                        return t && a && (a.data.push(t), t._ctx = a), a
                    },
                    suppressOverwrites: function(t) {
                        return i = t
                    }
                }
            };
        dt("to,from,fromTo,delayedCall,set,killTweensOf", (function(t) {
            return yn[t] = Ke[t]
        })), Ee.add(ze.updateRoot), d = yn.to({}, {
            duration: 0
        });
        var Mn = function(t, e) {
                for (var n = t._pt; n && n.p !== e && n.op !== e && n.fp !== e;) n = n._next;
                return n
            },
            Sn = function(t, e) {
                return {
                    name: t,
                    rawVars: 1,
                    init: function(t, n, i) {
                        i._onInit = function(t) {
                            var i, r;
                            if (R(n) && (i = {}, dt(n, (function(t) {
                                    return i[t] = 1
                                })), n = i), e) {
                                for (r in i = {}, n) i[r] = e(n[r]);
                                n = i
                            }! function(t, e) {
                                var n, i, r, a = t._targets;
                                for (n in e)
                                    for (i = a.length; i--;)(r = t._ptLookup[i][n]) && (r = r.d) && (r._pt && (r = Mn(r, n)), r && r.modifier && r.modifier(e[n], t, a[i], n))
                            }(t, n)
                        }
                    }
                }
            },
            En = yn.registerPlugin({
                name: "attr",
                init: function(t, e, n, i, r) {
                    var a, s, o;
                    for (a in this.tween = n, e) o = t.getAttribute(a) || "", (s = this.add(t, "setAttribute", (o || 0) + "", e[a], i, r, 0, 0, a)).op = a, s.b = o, this._props.push(a)
                },
                render: function(t, e) {
                    for (var n = e._pt; n;) r ? n.set(n.t, n.p, n.b, n) : n.r(t, n.d), n = n._next
                }
            }, {
                name: "endArray",
                init: function(t, e) {
                    for (var n = e.length; n--;) this.add(t, n, t[n] || 0, e[n], 0, 0, 0, 0, 0, 1)
                }
            }, Sn("roundProps", ie), Sn("modifiers"), Sn("snap", re)) || yn;
        Ke.version = ze.version = En.version = "3.12.2", u = 1, I() && Te(), be.Power0, be.Power1, be.Power2, be.Power3, be.Power4, be.Linear, be.Quad, be.Cubic, be.Quart, be.Quint, be.Strong, be.Elastic, be.Back, be.SteppedEase, be.Bounce, be.Sine, be.Expo, be.Circ;
        var Tn, bn, wn, An, Rn, Cn, Ln, Pn, Un = {},
            Dn = 180 / Math.PI,
            In = Math.PI / 180,
            On = Math.atan2,
            Nn = /([A-Z])/g,
            Fn = /(left|right|width|margin|padding|x)/i,
            zn = /[\s,\(]\S/,
            Bn = {
                autoAlpha: "opacity,visibility",
                scale: "scaleX,scaleY",
                alpha: "opacity"
            },
            kn = function(t, e) {
                return e.set(e.t, e.p, Math.round(1e4 * (e.s + e.c * t)) / 1e4 + e.u, e)
            },
            Hn = function(t, e) {
                return e.set(e.t, e.p, 1 === t ? e.e : Math.round(1e4 * (e.s + e.c * t)) / 1e4 + e.u, e)
            },
            Gn = function(t, e) {
                return e.set(e.t, e.p, t ? Math.round(1e4 * (e.s + e.c * t)) / 1e4 + e.u : e.b, e)
            },
            Vn = function(t, e) {
                var n = e.s + e.c * t;
                e.set(e.t, e.p, ~~(n + (n < 0 ? -.5 : .5)) + e.u, e)
            },
            Wn = function(t, e) {
                return e.set(e.t, e.p, t ? e.e : e.b, e)
            },
            Xn = function(t, e) {
                return e.set(e.t, e.p, 1 !== t ? e.b : e.e, e)
            },
            jn = function(t, e, n) {
                return t.style[e] = n
            },
            qn = function(t, e, n) {
                return t.style.setProperty(e, n)
            },
            Yn = function(t, e, n) {
                return t._gsap[e] = n
            },
            Kn = function(t, e, n) {
                return t._gsap.scaleX = t._gsap.scaleY = n
            },
            Zn = function(t, e, n, i, r) {
                var a = t._gsap;
                a.scaleX = a.scaleY = n, a.renderTransform(r, a)
            },
            $n = function(t, e, n, i, r) {
                var a = t._gsap;
                a[e] = n, a.renderTransform(r, a)
            },
            Jn = "transform",
            Qn = Jn + "Origin",
            ti = function t(e, n) {
                var i = this,
                    r = this.target,
                    a = r.style;
                if (e in Un && a) {
                    if (this.tfm = this.tfm || {}, "transform" === e) return Bn.transform.split(",").forEach((function(e) {
                        return t.call(i, e, n)
                    }));
                    if (~(e = Bn[e] || e).indexOf(",") ? e.split(",").forEach((function(t) {
                            return i.tfm[t] = vi(r, t)
                        })) : this.tfm[e] = r._gsap.x ? r._gsap[e] : vi(r, e), this.props.indexOf(Jn) >= 0) return;
                    r._gsap.svg && (this.svgo = r.getAttribute("data-svg-origin"), this.props.push(Qn, n, "")), e = Jn
                }(a || n) && this.props.push(e, n, a[e])
            },
            ei = function(t) {
                t.translate && (t.removeProperty("translate"), t.removeProperty("scale"), t.removeProperty("rotate"))
            },
            ni = function() {
                var t, e, n = this.props,
                    i = this.target,
                    r = i.style,
                    a = i._gsap;
                for (t = 0; t < n.length; t += 3) n[t + 1] ? i[n[t]] = n[t + 2] : n[t + 2] ? r[n[t]] = n[t + 2] : r.removeProperty("--" === n[t].substr(0, 2) ? n[t] : n[t].replace(Nn, "-$1").toLowerCase());
                if (this.tfm) {
                    for (e in this.tfm) a[e] = this.tfm[e];
                    a.svg && (a.renderTransform(), i.setAttribute("data-svg-origin", this.svgo || "")), (t = Ln()) && t.isStart || r[Jn] || (ei(r), a.uncache = 1)
                }
            },
            ii = function(t, e) {
                var n = {
                    target: t,
                    props: [],
                    revert: ni,
                    save: ti
                };
                return t._gsap || En.core.getCache(t), e && e.split(",").forEach((function(t) {
                    return n.save(t)
                })), n
            },
            ri = function(t, e) {
                var n = bn.createElementNS ? bn.createElementNS((e || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), t) : bn.createElement(t);
                return n.style ? n : bn.createElement(t)
            },
            ai = function t(e, n, i) {
                var r = getComputedStyle(e);
                return r[n] || r.getPropertyValue(n.replace(Nn, "-$1").toLowerCase()) || r.getPropertyValue(n) || !i && t(e, oi(n) || n, 1) || ""
            },
            si = "O,Moz,ms,Ms,Webkit".split(","),
            oi = function(t, e, n) {
                var i = (e || Rn).style,
                    r = 5;
                if (t in i && !n) return t;
                for (t = t.charAt(0).toUpperCase() + t.substr(1); r-- && !(si[r] + t in i););
                return r < 0 ? null : (3 === r ? "ms" : r >= 0 ? si[r] : "") + t
            },
            li = function() {
                "undefined" != typeof window && window.document && (Tn = window, bn = Tn.document, wn = bn.documentElement, Rn = ri("div") || {
                    style: {}
                }, ri("div"), Jn = oi(Jn), Qn = Jn + "Origin", Rn.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0", Pn = !!oi("perspective"), Ln = En.core.reverting, An = 1)
            },
            ci = function t(e) {
                var n, i = ri("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"),
                    r = this.parentNode,
                    a = this.nextSibling,
                    s = this.style.cssText;
                if (wn.appendChild(i), i.appendChild(this), this.style.display = "block", e) try {
                    n = this.getBBox(), this._gsapBBox = this.getBBox, this.getBBox = t
                } catch (t) {} else this._gsapBBox && (n = this._gsapBBox());
                return r && (a ? r.insertBefore(this, a) : r.appendChild(this)), wn.removeChild(i), this.style.cssText = s, n
            },
            ui = function(t, e) {
                for (var n = e.length; n--;)
                    if (t.hasAttribute(e[n])) return t.getAttribute(e[n])
            },
            hi = function(t) {
                var e;
                try {
                    e = t.getBBox()
                } catch (n) {
                    e = ci.call(t, !0)
                }
                return e && (e.width || e.height) || t.getBBox === ci || (e = ci.call(t, !0)), !e || e.width || e.x || e.y ? e : {
                    x: +ui(t, ["x", "cx", "x1"]) || 0,
                    y: +ui(t, ["y", "cy", "y1"]) || 0,
                    width: 0,
                    height: 0
                }
            },
            di = function(t) {
                return !(!t.getCTM || t.parentNode && !t.ownerSVGElement || !hi(t))
            },
            pi = function(t, e) {
                if (e) {
                    var n = t.style;
                    e in Un && e !== Qn && (e = Jn), n.removeProperty ? ("ms" !== e.substr(0, 2) && "webkit" !== e.substr(0, 6) || (e = "-" + e), n.removeProperty(e.replace(Nn, "-$1").toLowerCase())) : n.removeAttribute(e)
                }
            },
            fi = function(t, e, n, i, r, a) {
                var s = new un(t._pt, e, n, 0, 1, a ? Xn : Wn);
                return t._pt = s, s.b = i, s.e = r, t._props.push(n), s
            },
            mi = {
                deg: 1,
                rad: 1,
                turn: 1
            },
            gi = {
                grid: 1,
                flex: 1
            },
            _i = function t(e, n, i, r) {
                var a, s, o, l, c = parseFloat(i) || 0,
                    u = (i + "").trim().substr((c + "").length) || "px",
                    h = Rn.style,
                    d = Fn.test(n),
                    p = "svg" === e.tagName.toLowerCase(),
                    f = (p ? "client" : "offset") + (d ? "Width" : "Height"),
                    m = 100,
                    g = "px" === r,
                    _ = "%" === r;
                return r === u || !c || mi[r] || mi[u] ? c : ("px" !== u && !g && (c = t(e, n, i, "px")), l = e.getCTM && di(e), !_ && "%" !== u || !Un[n] && !~n.indexOf("adius") ? (h[d ? "width" : "height"] = m + (g ? u : r), s = ~n.indexOf("adius") || "em" === r && e.appendChild && !p ? e : e.parentNode, l && (s = (e.ownerSVGElement || {}).parentNode), s && s !== bn && s.appendChild || (s = bn.body), (o = s._gsap) && _ && o.width && d && o.time === Ee.time && !o.uncache ? pt(c / o.width * m) : ((_ || "%" === u) && !gi[ai(s, "display")] && (h.position = ai(e, "position")), s === e && (h.position = "static"), s.appendChild(Rn), a = Rn[f], s.removeChild(Rn), h.position = "absolute", d && _ && ((o = ut(s)).time = Ee.time, o.width = s[f]), pt(g ? a * c / m : a && c ? m / a * c : 0))) : (a = l ? e.getBBox()[d ? "width" : "height"] : e[f], pt(_ ? c / a * m : c / 100 * a)))
            },
            vi = function(t, e, n, i) {
                var r;
                return An || li(), e in Bn && "transform" !== e && ~(e = Bn[e]).indexOf(",") && (e = e.split(",")[0]), Un[e] && "transform" !== e ? (r = Ci(t, i), r = "transformOrigin" !== e ? r[e] : r.svg ? r.origin : Li(ai(t, Qn)) + " " + r.zOrigin + "px") : (!(r = t.style[e]) || "auto" === r || i || ~(r + "").indexOf("calc(")) && (r = Si[e] && Si[e](t, e, n) || ai(t, e) || ht(t, e) || ("opacity" === e ? 1 : 0)), n && !~(r + "").trim().indexOf(" ") ? _i(t, e, r, n) + n : r
            },
            xi = function(t, e, n, i) {
                if (!n || "none" === n) {
                    var r = oi(e, t, 1),
                        a = r && ai(t, r, 1);
                    a && a !== n ? (e = r, n = a) : "borderColor" === e && (n = ai(t, "borderTopColor"))
                }
                var s, o, l, c, u, h, d, p, f, m, g, _ = new un(this._pt, t.style, e, 0, 1, rn),
                    x = 0,
                    y = 0;
                if (_.b = n, _.e = i, n += "", "auto" == (i += "") && (t.style[e] = i, i = ai(t, e) || i, t.style[e] = n), Se(s = [n, i]), i = s[1], l = (n = s[0]).match(k) || [], (i.match(k) || []).length) {
                    for (; o = k.exec(i);) d = o[0], f = i.substring(x, o.index), u ? u = (u + 1) % 5 : "rgba(" !== f.substr(-5) && "hsla(" !== f.substr(-5) || (u = 1), d !== (h = l[y++] || "") && (c = parseFloat(h) || 0, g = h.substr((c + "").length), "=" === d.charAt(1) && (d = mt(c, d) + g), p = parseFloat(d), m = d.substr((p + "").length), x = k.lastIndex - m.length, m || (m = m || v.units[e] || g, x === i.length && (i += m, _.e += m)), g !== m && (c = _i(t, e, h, m) || 0), _._pt = {
                        _next: _._pt,
                        p: f || 1 === y ? f : ",",
                        s: c,
                        c: p - c,
                        m: u && u < 4 || "zIndex" === e ? Math.round : 0
                    });
                    _.c = x < i.length ? i.substring(x, i.length) : ""
                } else _.r = "display" === e && "none" === i ? Xn : Wn;
                return G.test(i) && (_.e = 0), this._pt = _, _
            },
            yi = {
                top: "0%",
                bottom: "100%",
                left: "0%",
                right: "100%",
                center: "50%"
            },
            Mi = function(t, e) {
                if (e.tween && e.tween._time === e.tween._dur) {
                    var n, i, r, a = e.t,
                        s = a.style,
                        o = e.u,
                        l = a._gsap;
                    if ("all" === o || !0 === o) s.cssText = "", i = 1;
                    else
                        for (r = (o = o.split(",")).length; --r > -1;) n = o[r], Un[n] && (i = 1, n = "transformOrigin" === n ? Qn : Jn), pi(a, n);
                    i && (pi(a, Jn), l && (l.svg && a.removeAttribute("transform"), Ci(a, 1), l.uncache = 1, ei(s)))
                }
            },
            Si = {
                clearProps: function(t, e, n, i, r) {
                    if ("isFromStart" !== r.data) {
                        var a = t._pt = new un(t._pt, e, n, 0, 0, Mi);
                        return a.u = i, a.pr = -10, a.tween = r, t._props.push(n), 1
                    }
                }
            },
            Ei = [1, 0, 0, 1, 0, 0],
            Ti = {},
            bi = function(t) {
                return "matrix(1, 0, 0, 1, 0, 0)" === t || "none" === t || !t
            },
            wi = function(t) {
                var e = ai(t, Jn);
                return bi(e) ? Ei : e.substr(7).match(B).map(pt)
            },
            Ai = function(t, e) {
                var n, i, r, a, s = t._gsap || ut(t),
                    o = t.style,
                    l = wi(t);
                return s.svg && t.getAttribute("transform") ? "1,0,0,1,0,0" === (l = [(r = t.transform.baseVal.consolidate().matrix).a, r.b, r.c, r.d, r.e, r.f]).join(",") ? Ei : l : (l !== Ei || t.offsetParent || t === wn || s.svg || (r = o.display, o.display = "block", (n = t.parentNode) && t.offsetParent || (a = 1, i = t.nextElementSibling, wn.appendChild(t)), l = wi(t), r ? o.display = r : pi(t, "display"), a && (i ? n.insertBefore(t, i) : n ? n.appendChild(t) : wn.removeChild(t))), e && l.length > 6 ? [l[0], l[1], l[4], l[5], l[12], l[13]] : l)
            },
            Ri = function(t, e, n, i, r, a) {
                var s, o, l, c = t._gsap,
                    u = r || Ai(t, !0),
                    h = c.xOrigin || 0,
                    d = c.yOrigin || 0,
                    p = c.xOffset || 0,
                    f = c.yOffset || 0,
                    m = u[0],
                    g = u[1],
                    _ = u[2],
                    v = u[3],
                    x = u[4],
                    y = u[5],
                    M = e.split(" "),
                    S = parseFloat(M[0]) || 0,
                    E = parseFloat(M[1]) || 0;
                n ? u !== Ei && (o = m * v - g * _) && (l = S * (-g / o) + E * (m / o) - (m * y - g * x) / o, S = S * (v / o) + E * (-_ / o) + (_ * y - v * x) / o, E = l) : (S = (s = hi(t)).x + (~M[0].indexOf("%") ? S / 100 * s.width : S), E = s.y + (~(M[1] || M[0]).indexOf("%") ? E / 100 * s.height : E)), i || !1 !== i && c.smooth ? (x = S - h, y = E - d, c.xOffset = p + (x * m + y * _) - x, c.yOffset = f + (x * g + y * v) - y) : c.xOffset = c.yOffset = 0, c.xOrigin = S, c.yOrigin = E, c.smooth = !!i, c.origin = e, c.originIsAbsolute = !!n, t.style[Qn] = "0px 0px", a && (fi(a, c, "xOrigin", h, S), fi(a, c, "yOrigin", d, E), fi(a, c, "xOffset", p, c.xOffset), fi(a, c, "yOffset", f, c.yOffset)), t.setAttribute("data-svg-origin", S + " " + E)
            },
            Ci = function(t, e) {
                var n = t._gsap || new Ne(t);
                if ("x" in n && !e && !n.uncache) return n;
                var i, r, a, s, o, l, c, u, h, d, p, f, m, g, _, x, y, M, S, E, T, b, w, A, R, C, L, P, U, D, I, O, N = t.style,
                    F = n.scaleX < 0,
                    z = "px",
                    B = "deg",
                    k = getComputedStyle(t),
                    H = ai(t, Qn) || "0";
                return i = r = a = l = c = u = h = d = p = 0, s = o = 1, n.svg = !(!t.getCTM || !di(t)), k.translate && ("none" === k.translate && "none" === k.scale && "none" === k.rotate || (N[Jn] = ("none" !== k.translate ? "translate3d(" + (k.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + ("none" !== k.rotate ? "rotate(" + k.rotate + ") " : "") + ("none" !== k.scale ? "scale(" + k.scale.split(" ").join(",") + ") " : "") + ("none" !== k[Jn] ? k[Jn] : "")), N.scale = N.rotate = N.translate = "none"), g = Ai(t, n.svg), n.svg && (n.uncache ? (R = t.getBBox(), H = n.xOrigin - R.x + "px " + (n.yOrigin - R.y) + "px", A = "") : A = !e && t.getAttribute("data-svg-origin"), Ri(t, A || H, !!A || n.originIsAbsolute, !1 !== n.smooth, g)), f = n.xOrigin || 0, m = n.yOrigin || 0, g !== Ei && (M = g[0], S = g[1], E = g[2], T = g[3], i = b = g[4], r = w = g[5], 6 === g.length ? (s = Math.sqrt(M * M + S * S), o = Math.sqrt(T * T + E * E), l = M || S ? On(S, M) * Dn : 0, (h = E || T ? On(E, T) * Dn + l : 0) && (o *= Math.abs(Math.cos(h * In))), n.svg && (i -= f - (f * M + m * E), r -= m - (f * S + m * T))) : (O = g[6], D = g[7], L = g[8], P = g[9], U = g[10], I = g[11], i = g[12], r = g[13], a = g[14], c = (_ = On(O, U)) * Dn, _ && (A = b * (x = Math.cos(-_)) + L * (y = Math.sin(-_)), R = w * x + P * y, C = O * x + U * y, L = b * -y + L * x, P = w * -y + P * x, U = O * -y + U * x, I = D * -y + I * x, b = A, w = R, O = C), u = (_ = On(-E, U)) * Dn, _ && (x = Math.cos(-_), I = T * (y = Math.sin(-_)) + I * x, M = A = M * x - L * y, S = R = S * x - P * y, E = C = E * x - U * y), l = (_ = On(S, M)) * Dn, _ && (A = M * (x = Math.cos(_)) + S * (y = Math.sin(_)), R = b * x + w * y, S = S * x - M * y, w = w * x - b * y, M = A, b = R), c && Math.abs(c) + Math.abs(l) > 359.9 && (c = l = 0, u = 180 - u), s = pt(Math.sqrt(M * M + S * S + E * E)), o = pt(Math.sqrt(w * w + O * O)), _ = On(b, w), h = Math.abs(_) > 2e-4 ? _ * Dn : 0, p = I ? 1 / (I < 0 ? -I : I) : 0), n.svg && (A = t.getAttribute("transform"), n.forceCSS = t.setAttribute("transform", "") || !bi(ai(t, Jn)), A && t.setAttribute("transform", A))), Math.abs(h) > 90 && Math.abs(h) < 270 && (F ? (s *= -1, h += l <= 0 ? 180 : -180, l += l <= 0 ? 180 : -180) : (o *= -1, h += h <= 0 ? 180 : -180)), e = e || n.uncache, n.x = i - ((n.xPercent = i && (!e && n.xPercent || (Math.round(t.offsetWidth / 2) === Math.round(-i) ? -50 : 0))) ? t.offsetWidth * n.xPercent / 100 : 0) + z, n.y = r - ((n.yPercent = r && (!e && n.yPercent || (Math.round(t.offsetHeight / 2) === Math.round(-r) ? -50 : 0))) ? t.offsetHeight * n.yPercent / 100 : 0) + z, n.z = a + z, n.scaleX = pt(s), n.scaleY = pt(o), n.rotation = pt(l) + B, n.rotationX = pt(c) + B, n.rotationY = pt(u) + B, n.skewX = h + B, n.skewY = d + B, n.transformPerspective = p + z, (n.zOrigin = parseFloat(H.split(" ")[2]) || 0) && (N[Qn] = Li(H)), n.xOffset = n.yOffset = 0, n.force3D = v.force3D, n.renderTransform = n.svg ? Fi : Pn ? Ni : Ui, n.uncache = 0, n
            },
            Li = function(t) {
                return (t = t.split(" "))[0] + " " + t[1]
            },
            Pi = function(t, e, n) {
                var i = Zt(e);
                return pt(parseFloat(e) + parseFloat(_i(t, "x", n + "px", i))) + i
            },
            Ui = function(t, e) {
                e.z = "0px", e.rotationY = e.rotationX = "0deg", e.force3D = 0, Ni(t, e)
            },
            Di = "0deg",
            Ii = "0px",
            Oi = ") ",
            Ni = function(t, e) {
                var n = e || this,
                    i = n.xPercent,
                    r = n.yPercent,
                    a = n.x,
                    s = n.y,
                    o = n.z,
                    l = n.rotation,
                    c = n.rotationY,
                    u = n.rotationX,
                    h = n.skewX,
                    d = n.skewY,
                    p = n.scaleX,
                    f = n.scaleY,
                    m = n.transformPerspective,
                    g = n.force3D,
                    _ = n.target,
                    v = n.zOrigin,
                    x = "",
                    y = "auto" === g && t && 1 !== t || !0 === g;
                if (v && (u !== Di || c !== Di)) {
                    var M, S = parseFloat(c) * In,
                        E = Math.sin(S),
                        T = Math.cos(S);
                    S = parseFloat(u) * In, M = Math.cos(S), a = Pi(_, a, E * M * -v), s = Pi(_, s, -Math.sin(S) * -v), o = Pi(_, o, T * M * -v + v)
                }
                m !== Ii && (x += "perspective(" + m + Oi), (i || r) && (x += "translate(" + i + "%, " + r + "%) "), (y || a !== Ii || s !== Ii || o !== Ii) && (x += o !== Ii || y ? "translate3d(" + a + ", " + s + ", " + o + ") " : "translate(" + a + ", " + s + Oi), l !== Di && (x += "rotate(" + l + Oi), c !== Di && (x += "rotateY(" + c + Oi), u !== Di && (x += "rotateX(" + u + Oi), h === Di && d === Di || (x += "skew(" + h + ", " + d + Oi), 1 === p && 1 === f || (x += "scale(" + p + ", " + f + Oi), _.style[Jn] = x || "translate(0, 0)"
            },
            Fi = function(t, e) {
                var n, i, r, a, s, o = e || this,
                    l = o.xPercent,
                    c = o.yPercent,
                    u = o.x,
                    h = o.y,
                    d = o.rotation,
                    p = o.skewX,
                    f = o.skewY,
                    m = o.scaleX,
                    g = o.scaleY,
                    _ = o.target,
                    v = o.xOrigin,
                    x = o.yOrigin,
                    y = o.xOffset,
                    M = o.yOffset,
                    S = o.forceCSS,
                    E = parseFloat(u),
                    T = parseFloat(h);
                d = parseFloat(d), p = parseFloat(p), (f = parseFloat(f)) && (p += f = parseFloat(f), d += f), d || p ? (d *= In, p *= In, n = Math.cos(d) * m, i = Math.sin(d) * m, r = Math.sin(d - p) * -g, a = Math.cos(d - p) * g, p && (f *= In, s = Math.tan(p - f), r *= s = Math.sqrt(1 + s * s), a *= s, f && (s = Math.tan(f), n *= s = Math.sqrt(1 + s * s), i *= s)), n = pt(n), i = pt(i), r = pt(r), a = pt(a)) : (n = m, a = g, i = r = 0), (E && !~(u + "").indexOf("px") || T && !~(h + "").indexOf("px")) && (E = _i(_, "x", u, "px"), T = _i(_, "y", h, "px")), (v || x || y || M) && (E = pt(E + v - (v * n + x * r) + y), T = pt(T + x - (v * i + x * a) + M)), (l || c) && (s = _.getBBox(), E = pt(E + l / 100 * s.width), T = pt(T + c / 100 * s.height)), s = "matrix(" + n + "," + i + "," + r + "," + a + "," + E + "," + T + ")", _.setAttribute("transform", s), S && (_.style[Jn] = s)
            },
            zi = function(t, e, n, i, r) {
                var a, s, o = 360,
                    l = R(r),
                    c = parseFloat(r) * (l && ~r.indexOf("rad") ? Dn : 1) - i,
                    u = i + c + "deg";
                return l && ("short" === (a = r.split("_")[1]) && (c %= o) != c % 180 && (c += c < 0 ? o : -360), "cw" === a && c < 0 ? c = (c + 36e9) % o - ~~(c / o) * o : "ccw" === a && c > 0 && (c = (c - 36e9) % o - ~~(c / o) * o)), t._pt = s = new un(t._pt, e, n, i, c, Hn), s.e = u, s.u = "deg", t._props.push(n), s
            },
            Bi = function(t, e) {
                for (var n in e) t[n] = e[n];
                return t
            },
            ki = function(t, e, n) {
                var i, r, a, s, o, l, c, u = Bi({}, n._gsap),
                    h = n.style;
                for (r in u.svg ? (a = n.getAttribute("transform"), n.setAttribute("transform", ""), h[Jn] = e, i = Ci(n, 1), pi(n, Jn), n.setAttribute("transform", a)) : (a = getComputedStyle(n)[Jn], h[Jn] = e, i = Ci(n, 1), h[Jn] = a), Un)(a = u[r]) !== (s = i[r]) && "perspective,force3D,transformOrigin,svgOrigin".indexOf(r) < 0 && (o = Zt(a) !== (c = Zt(s)) ? _i(n, r, a, c) : parseFloat(a), l = parseFloat(s), t._pt = new un(t._pt, i, r, o, l - o, kn), t._pt.u = c || 0, t._props.push(r));
                Bi(i, u)
            };
        dt("padding,margin,Width,Radius", (function(t, e) {
            var n = "Top",
                i = "Right",
                r = "Bottom",
                a = "Left",
                s = (e < 3 ? [n, i, r, a] : [n + a, n + i, r + i, r + a]).map((function(n) {
                    return e < 2 ? t + n : "border" + n + t
                }));
            Si[e > 1 ? "border" + t : t] = function(t, e, n, i, r) {
                var a, o;
                if (arguments.length < 4) return a = s.map((function(e) {
                    return vi(t, e, n)
                })), 5 === (o = a.join(" ")).split(a[0]).length ? a[0] : o;
                a = (i + "").split(" "), o = {}, s.forEach((function(t, e) {
                    return o[t] = a[e] = a[e] || a[(e - 1) / 2 | 0]
                })), t.init(e, o, r)
            }
        }));
        var Hi, Gi, Vi = {
            name: "css",
            register: li,
            targetTest: function(t) {
                return t.style && t.nodeType
            },
            init: function(t, e, n, i, r) {
                var a, s, o, l, c, u, h, d, p, f, m, g, _, x, y, M, S, E, T, b, w = this._props,
                    A = t.style,
                    C = n.vars.startAt;
                for (h in An || li(), this.styles = this.styles || ii(t), M = this.styles.props, this.tween = n, e)
                    if ("autoRound" !== h && (s = e[h], !rt[h] || !Ve(h, e, n, i, t, r)))
                        if (c = typeof s, u = Si[h], "function" === c && (c = typeof(s = s.call(n, i, t, r))), "string" === c && ~s.indexOf("random(") && (s = oe(s)), u) u(this, t, h, s, n) && (y = 1);
                        else if ("--" === h.substr(0, 2)) a = (getComputedStyle(t).getPropertyValue(h) + "").trim(), s += "", ye.lastIndex = 0, ye.test(a) || (d = Zt(a), p = Zt(s)), p ? d !== p && (a = _i(t, h, a, p) + p) : d && (s += d), this.add(A, "setProperty", a, s, i, r, 0, 0, h), w.push(h), M.push(h, 0, A[h]);
                else if ("undefined" !== c) {
                    if (C && h in C ? (a = "function" == typeof C[h] ? C[h].call(n, i, t, r) : C[h], R(a) && ~a.indexOf("random(") && (a = oe(a)), Zt(a + "") || (a += v.units[h] || Zt(vi(t, h)) || ""), "=" === (a + "").charAt(1) && (a = vi(t, h))) : a = vi(t, h), l = parseFloat(a), (f = "string" === c && "=" === s.charAt(1) && s.substr(0, 2)) && (s = s.substr(2)), o = parseFloat(s), h in Bn && ("autoAlpha" === h && (1 === l && "hidden" === vi(t, "visibility") && o && (l = 0), M.push("visibility", 0, A.visibility), fi(this, A, "visibility", l ? "inherit" : "hidden", o ? "inherit" : "hidden", !o)), "scale" !== h && "transform" !== h && ~(h = Bn[h]).indexOf(",") && (h = h.split(",")[0])), m = h in Un)
                        if (this.styles.save(h), g || ((_ = t._gsap).renderTransform && !e.parseTransform || Ci(t, e.parseTransform), x = !1 !== e.smoothOrigin && _.smooth, (g = this._pt = new un(this._pt, A, Jn, 0, 1, _.renderTransform, _, 0, -1)).dep = 1), "scale" === h) this._pt = new un(this._pt, _, "scaleY", _.scaleY, (f ? mt(_.scaleY, f + o) : o) - _.scaleY || 0, kn), this._pt.u = 0, w.push("scaleY", h), h += "X";
                        else {
                            if ("transformOrigin" === h) {
                                M.push(Qn, 0, A[Qn]), E = void 0, T = void 0, b = void 0, T = (E = (S = s).split(" "))[0], b = E[1] || "50%", "top" !== T && "bottom" !== T && "left" !== b && "right" !== b || (S = T, T = b, b = S), E[0] = yi[T] || T, E[1] = yi[b] || b, s = E.join(" "), _.svg ? Ri(t, s, 0, x, 0, this) : ((p = parseFloat(s.split(" ")[2]) || 0) !== _.zOrigin && fi(this, _, "zOrigin", _.zOrigin, p), fi(this, A, h, Li(a), Li(s)));
                                continue
                            }
                            if ("svgOrigin" === h) {
                                Ri(t, s, 1, x, 0, this);
                                continue
                            }
                            if (h in Ti) {
                                zi(this, _, h, l, f ? mt(l, f + s) : s);
                                continue
                            }
                            if ("smoothOrigin" === h) {
                                fi(this, _, "smooth", _.smooth, s);
                                continue
                            }
                            if ("force3D" === h) {
                                _[h] = s;
                                continue
                            }
                            if ("transform" === h) {
                                ki(this, s, t);
                                continue
                            }
                        }
                    else h in A || (h = oi(h) || h);
                    if (m || (o || 0 === o) && (l || 0 === l) && !zn.test(s) && h in A) o || (o = 0), (d = (a + "").substr((l + "").length)) !== (p = Zt(s) || (h in v.units ? v.units[h] : d)) && (l = _i(t, h, a, p)), this._pt = new un(this._pt, m ? _ : A, h, l, (f ? mt(l, f + o) : o) - l, m || "px" !== p && "zIndex" !== h || !1 === e.autoRound ? kn : Vn), this._pt.u = p || 0, d !== p && "%" !== p && (this._pt.b = a, this._pt.r = Gn);
                    else if (h in A) xi.call(this, t, h, a, f ? f + s : s);
                    else if (h in t) this.add(t, h, a || t[h], f ? f + s : s, i, r);
                    else if ("parseTransform" !== h) {
                        Y(h, s);
                        continue
                    }
                    m || (h in A ? M.push(h, 0, A[h]) : M.push(h, 1, a || t[h])), w.push(h)
                }
                y && cn(this)
            },
            render: function(t, e) {
                if (e.tween._time || !Ln())
                    for (var n = e._pt; n;) n.r(t, n.d), n = n._next;
                else e.styles.revert()
            },
            get: vi,
            aliases: Bn,
            getSetter: function(t, e, n) {
                var i = Bn[e];
                return i && i.indexOf(",") < 0 && (e = i), e in Un && e !== Qn && (t._gsap.x || vi(t, "x")) ? n && Cn === n ? "scale" === e ? Kn : Yn : (Cn = n || {}) && ("scale" === e ? Zn : $n) : t.style && !P(t.style[e]) ? jn : ~e.indexOf("-") ? qn : tn(t, e)
            },
            core: {
                _removeProperty: pi,
                _getMatrix: Ai
            }
        };
        En.utils.checkPrefix = oi, En.core.getStyleSaver = ii, Gi = dt("x,y,z,scale,scaleX,scaleY,xPercent,yPercent" + "," + (Hi = "rotation,rotationX,rotationY,skewX,skewY") + ",transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", (function(t) {
            Un[t] = 1
        })), dt(Hi, (function(t) {
            v.units[t] = "deg", Ti[t] = 1
        })), Bn[Gi[13]] = "x,y,z,scale,scaleX,scaleY,xPercent,yPercent," + Hi, dt("0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY", (function(t) {
            var e = t.split(":");
            Bn[e[1]] = Gi[e[0]]
        })), dt("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", (function(t) {
            v.units[t] = "px"
        })), En.registerPlugin(Vi);
        var Wi = En.registerPlugin(Vi) || En;
        Wi.core.Tween, Wi.defaults({
            ease: "power2.out",
            overwrite: "auto"
        });
        let Xi = null;
        class ji {
            constructor() {
                if (Xi) return Xi;
                this.baseFPS = 60, this.baseDeltaTime = 1 / this.baseFPS, this.lastUpdateTime = 0, this.updateFunctions = [], this.updateFunctionsLength = 0, Xi = this, this.init()
            }
            static getInstance() {
                return Xi || (Xi = new ji), Xi
            }
            static add(t) {
                ji.getInstance().add(t)
            }
            static remove(t) {
                ji.getInstance().remove(t)
            }
            static reset() {
                ji.getInstance().reset()
            }
            init() {
                this.lastUpdateTime = .001 * performance.now(), this.animFunction = this.update.bind(this), requestAnimationFrame(this.animFunction)
            }
            add(t) {
                this.updateFunctions.push(t), this.updateFunctionsLength = this.updateFunctions.length
            }
            remove(t) {
                let e;
                for (let n = 0; n < this.updateFunctionsLength; n++)
                    if (e = this.updateFunctions[n], e === t) {
                        this.updateFunctions.splice(n, 1);
                        break
                    } this.updateFunctionsLength = this.updateFunctions.length
            }
            update(t) {
                requestAnimationFrame(this.animFunction);
                const e = (t *= .001) - this.lastUpdateTime,
                    n = Math.max(Math.min(e / this.baseDeltaTime, 2), .5);
                let i;
                for (let r = 0; r < this.updateFunctionsLength; r++) i = this.updateFunctions[r], i({
                    time: t,
                    deltaTime: e,
                    timeScale: n
                });
                this.lastUpdateTime = t
            }
            reset() {
                for (let t = 0; t < this.updateFunctionsLength; t++) delete this.updateFunctions[t];
                this.updateFunctions = [], this.updateFunctions.length = 0, this.updateFunctionsLength = 0
            }
        }
        class qi {
            constructor() {
                this.prevSize = {
                    w: 0,
                    h: 0
                }, this.checkTime = 0, this.interval = 500, this.getSize = null
            }
            reset() {
                this.prevSize = {
                    w: 0,
                    h: 0
                }, this.checkTime = 0
            }
            setSizeFunc(t) {
                this.getSize = t, this.reset()
            }
            check() {
                const t = performance.now();
                if (t - this.checkTime < this.interval) return !1;
                this.checkTime = t;
                const {
                    width: e,
                    height: n
                } = this.getSize();
                return (e !== this.prevSize.w || n !== this.prevSize.h) && (this.prevSize.w = e, this.prevSize.h = n, !0)
            }
        }
        var Yi, Ki, Zi, $i, Ji = !1,
            Qi = !1,
            tr = [],
            er = -1;

        function nr(t) {
            let e = tr.indexOf(t); - 1 !== e && e > er && tr.splice(e, 1)
        }

        function ir() {
            Ji = !1, Qi = !0;
            for (let t = 0; t < tr.length; t++) tr[t](), er = t;
            tr.length = 0, er = -1, Qi = !1
        }
        var rr = !0;

        function ar(t) {
            Ki = t
        }

        function sr(t, e, n = {}) {
            t.dispatchEvent(new CustomEvent(e, {
                detail: n,
                bubbles: !0,
                composed: !0,
                cancelable: !0
            }))
        }

        function or(t, e) {
            if ("function" == typeof ShadowRoot && t instanceof ShadowRoot) return void Array.from(t.children).forEach((t => or(t, e)));
            let n = !1;
            if (e(t, (() => n = !0)), n) return;
            let i = t.firstElementChild;
            for (; i;) or(i, e), i = i.nextElementSibling
        }

        function lr(t, ...e) {
            console.warn(`Alpine Warning: ${t}`, ...e)
        }
        var cr = !1,
            ur = [],
            hr = [];

        function dr() {
            return ur.map((t => t()))
        }

        function pr() {
            return ur.concat(hr).map((t => t()))
        }

        function fr(t) {
            ur.push(t)
        }

        function mr(t) {
            hr.push(t)
        }

        function gr(t, e = !1) {
            return _r(t, (t => {
                if ((e ? pr() : dr()).some((e => t.matches(e)))) return !0
            }))
        }

        function _r(t, e) {
            if (t) {
                if (e(t)) return t;
                if (t._x_teleportBack && (t = t._x_teleportBack), t.parentElement) return _r(t.parentElement, e)
            }
        }
        var vr = [];

        function xr(t, e = or, n = (() => {})) {
            ! function(i) {
                ua = !0;
                let r = Symbol();
                da = r, ha.set(r, []);
                let a = () => {
                    for (; ha.get(r).length;) ha.get(r).shift()();
                    ha.delete(r)
                };
                e(t, ((t, e) => {
                    n(t, e), vr.forEach((n => n(t, e))), la(t, t.attributes).forEach((t => t())), t._x_ignore && e()
                })), ua = !1, a()
            }()
        }

        function yr(t) {
            or(t, (t => {
                Ar(t),
                    function(t) {
                        if (t._x_cleanups)
                            for (; t._x_cleanups.length;) t._x_cleanups.pop()()
                    }(t)
            }))
        }
        var Mr = [],
            Sr = [],
            Er = [];

        function Tr(t, e) {
            "function" == typeof e ? (t._x_cleanups || (t._x_cleanups = []), t._x_cleanups.push(e)) : (e = t, Sr.push(e))
        }

        function br(t) {
            Mr.push(t)
        }

        function wr(t, e, n) {
            t._x_attributeCleanups || (t._x_attributeCleanups = {}), t._x_attributeCleanups[e] || (t._x_attributeCleanups[e] = []), t._x_attributeCleanups[e].push(n)
        }

        function Ar(t, e) {
            t._x_attributeCleanups && Object.entries(t._x_attributeCleanups).forEach((([n, i]) => {
                (void 0 === e || e.includes(n)) && (i.forEach((t => t())), delete t._x_attributeCleanups[n])
            }))
        }
        var Rr = new MutationObserver(Fr),
            Cr = !1;

        function Lr() {
            Rr.observe(document, {
                subtree: !0,
                childList: !0,
                attributes: !0,
                attributeOldValue: !0
            }), Cr = !0
        }

        function Pr() {
            (Ur = Ur.concat(Rr.takeRecords())).length && !Dr && (Dr = !0, queueMicrotask((() => {
                Fr(Ur), Ur.length = 0, Dr = !1
            }))), Rr.disconnect(), Cr = !1
        }
        var Ur = [],
            Dr = !1;

        function Ir(t) {
            if (!Cr) return t();
            Pr();
            let e = t();
            return Lr(), e
        }
        var Or = !1,
            Nr = [];

        function Fr(t) {
            if (Or) return void(Nr = Nr.concat(t));
            let e = [],
                n = [],
                i = new Map,
                r = new Map;
            for (let a = 0; a < t.length; a++)
                if (!t[a].target._x_ignoreMutationObserver && ("childList" === t[a].type && (t[a].addedNodes.forEach((t => 1 === t.nodeType && e.push(t))), t[a].removedNodes.forEach((t => 1 === t.nodeType && n.push(t)))), "attributes" === t[a].type)) {
                    let e = t[a].target,
                        n = t[a].attributeName,
                        s = t[a].oldValue,
                        o = () => {
                            i.has(e) || i.set(e, []), i.get(e).push({
                                name: n,
                                value: e.getAttribute(n)
                            })
                        },
                        l = () => {
                            r.has(e) || r.set(e, []), r.get(e).push(n)
                        };
                    e.hasAttribute(n) && null === s ? o() : e.hasAttribute(n) ? (l(), o()) : l()
                } r.forEach(((t, e) => {
                Ar(e, t)
            })), i.forEach(((t, e) => {
                Mr.forEach((n => n(e, t)))
            }));
            for (let t of n) e.includes(t) || (Sr.forEach((e => e(t))), yr(t));
            e.forEach((t => {
                t._x_ignoreSelf = !0, t._x_ignore = !0
            }));
            for (let t of e) n.includes(t) || t.isConnected && (delete t._x_ignoreSelf, delete t._x_ignore, Er.forEach((e => e(t))), t._x_ignore = !0, t._x_ignoreSelf = !0);
            e.forEach((t => {
                delete t._x_ignoreSelf, delete t._x_ignore
            })), e = null, n = null, i = null, r = null
        }

        function zr(t) {
            return Hr(kr(t))
        }

        function Br(t, e, n) {
            return t._x_dataStack = [e, ...kr(n || t)], () => {
                t._x_dataStack = t._x_dataStack.filter((t => t !== e))
            }
        }

        function kr(t) {
            return t._x_dataStack ? t._x_dataStack : "function" == typeof ShadowRoot && t instanceof ShadowRoot ? kr(t.host) : t.parentNode ? kr(t.parentNode) : []
        }

        function Hr(t) {
            let e = new Proxy({}, {
                ownKeys: () => Array.from(new Set(t.flatMap((t => Object.keys(t))))),
                has: (e, n) => t.some((t => t.hasOwnProperty(n))),
                get: (n, i) => (t.find((t => {
                    if (t.hasOwnProperty(i)) {
                        let n = Object.getOwnPropertyDescriptor(t, i);
                        if (n.get && n.get._x_alreadyBound || n.set && n.set._x_alreadyBound) return !0;
                        if ((n.get || n.set) && n.enumerable) {
                            let r = n.get,
                                a = n.set,
                                s = n;
                            r = r && r.bind(e), a = a && a.bind(e), r && (r._x_alreadyBound = !0), a && (a._x_alreadyBound = !0), Object.defineProperty(t, i, {
                                ...s,
                                get: r,
                                set: a
                            })
                        }
                        return !0
                    }
                    return !1
                })) || {})[i],
                set: (e, n, i) => {
                    let r = t.find((t => t.hasOwnProperty(n)));
                    return r ? r[n] = i : t[t.length - 1][n] = i, !0
                }
            });
            return e
        }

        function Gr(t) {
            let e = (n, i = "") => {
                Object.entries(Object.getOwnPropertyDescriptors(n)).forEach((([r, {
                    value: a,
                    enumerable: s
                }]) => {
                    if (!1 === s || void 0 === a) return;
                    let o = "" === i ? r : `${i}.${r}`;
                    var l;
                    "object" == typeof a && null !== a && a._x_interceptor ? n[r] = a.initialize(t, o, r) : "object" != typeof(l = a) || Array.isArray(l) || null === l || a === n || a instanceof Element || e(a, o)
                }))
            };
            return e(t)
        }

        function Vr(t, e = (() => {})) {
            let n = {
                initialValue: void 0,
                _x_interceptor: !0,
                initialize(e, n, i) {
                    return t(this.initialValue, (() => function(t, e) {
                        return e.split(".").reduce(((t, e) => t[e]), t)
                    }(e, n)), (t => Wr(e, n, t)), n, i)
                }
            };
            return e(n), t => {
                if ("object" == typeof t && null !== t && t._x_interceptor) {
                    let e = n.initialize.bind(n);
                    n.initialize = (i, r, a) => {
                        let s = t.initialize(i, r, a);
                        return n.initialValue = s, e(i, r, a)
                    }
                } else n.initialValue = t;
                return n
            }
        }

        function Wr(t, e, n) {
            if ("string" == typeof e && (e = e.split(".")), 1 !== e.length) {
                if (0 === e.length) throw error;
                return t[e[0]] || (t[e[0]] = {}), Wr(t[e[0]], e.slice(1), n)
            }
            t[e[0]] = n
        }
        var Xr = {};

        function jr(t, e) {
            Xr[t] = e
        }

        function qr(t, e) {
            return Object.entries(Xr).forEach((([n, i]) => {
                let r = null;
                Object.defineProperty(t, `$${n}`, {
                    get: () => i(e, function() {
                        if (r) return r;
                        {
                            let [t, n] = pa(e);
                            return r = {
                                interceptor: Vr,
                                ...t
                            }, Tr(e, n), r
                        }
                    }()),
                    enumerable: !1
                })
            })), t
        }

        function Yr(t, e, n, ...i) {
            try {
                return n(...i)
            } catch (n) {
                Kr(n, t, e)
            }
        }

        function Kr(t, e, n = void 0) {
            Object.assign(t, {
                el: e,
                expression: n
            }), console.warn(`Alpine Expression Error: ${t.message}\n\n${n?'Expression: "'+n+'"\n\n':""}`, e), setTimeout((() => {
                throw t
            }), 0)
        }
        var Zr = !0;

        function $r(t) {
            let e = Zr;
            Zr = !1;
            let n = t();
            return Zr = e, n
        }

        function Jr(t, e, n = {}) {
            let i;
            return Qr(t, e)((t => i = t), n), i
        }

        function Qr(...t) {
            return ta(...t)
        }
        var ta = ea;

        function ea(t, e) {
            let n = {};
            qr(n, t);
            let i = [n, ...kr(t)],
                r = "function" == typeof e ? function(t, e) {
                    return (n = (() => {}), {
                        scope: i = {},
                        params: r = []
                    } = {}) => {
                        ia(n, e.apply(Hr([i, ...t]), r))
                    }
                }(i, e) : function(t, e, n) {
                    let i = function(t, e) {
                        if (na[t]) return na[t];
                        let n = Object.getPrototypeOf((async function() {})).constructor,
                            i = /^[\n\s]*if.*\(.*\)/.test(t.trim()) || /^(let|const)\s/.test(t.trim()) ? `(async()=>{ ${t} })()` : t;
                        let r = (() => {
                            try {
                                return new n(["__self", "scope"], `with (scope) { __self.result = ${i} }; __self.finished = true; return __self.result;`)
                            } catch (n) {
                                return Kr(n, e, t), Promise.resolve()
                            }
                        })();
                        return na[t] = r, r
                    }(e, n);
                    return (r = (() => {}), {
                        scope: a = {},
                        params: s = []
                    } = {}) => {
                        i.result = void 0, i.finished = !1;
                        let o = Hr([a, ...t]);
                        if ("function" == typeof i) {
                            let t = i(i, o).catch((t => Kr(t, n, e)));
                            i.finished ? (ia(r, i.result, o, s, n), i.result = void 0) : t.then((t => {
                                ia(r, t, o, s, n)
                            })).catch((t => Kr(t, n, e))).finally((() => i.result = void 0))
                        }
                    }
                }(i, e, t);
            return Yr.bind(null, t, e, r)
        }
        var na = {};

        function ia(t, e, n, i, r) {
            if (Zr && "function" == typeof e) {
                let a = e.apply(n, i);
                a instanceof Promise ? a.then((e => ia(t, e, n, i))).catch((t => Kr(t, r, e))) : t(a)
            } else "object" == typeof e && e instanceof Promise ? e.then((e => t(e))) : t(e)
        }
        var ra = "x-";

        function aa(t = "") {
            return ra + t
        }
        var sa = {};

        function oa(t, e) {
            return sa[t] = e, {
                before(e) {
                    if (!sa[e]) return void console.warn("Cannot find directive `${directive}`. `${name}` will use the default order of execution");
                    const n = Ma.indexOf(e);
                    Ma.splice(n >= 0 ? n : Ma.indexOf("DEFAULT"), 0, t)
                }
            }
        }

        function la(t, e, n) {
            if (e = Array.from(e), t._x_virtualDirectives) {
                let n = Object.entries(t._x_virtualDirectives).map((([t, e]) => ({
                        name: t,
                        value: e
                    }))),
                    i = ca(n);
                n = n.map((t => i.find((e => e.name === t.name)) ? {
                    name: `x-bind:${t.name}`,
                    value: `"${t.value}"`
                } : t)), e = e.concat(n)
            }
            let i = {},
                r = e.map(ma(((t, e) => i[t] = e))).filter(va).map(function(t, e) {
                    return ({
                        name: n,
                        value: i
                    }) => {
                        let r = n.match(xa()),
                            a = n.match(/:([a-zA-Z0-9\-:]+)/),
                            s = n.match(/\.[^.\]]+(?=[^\]]*$)/g) || [],
                            o = e || t[n] || n;
                        return {
                            type: r ? r[1] : null,
                            value: a ? a[1] : null,
                            modifiers: s.map((t => t.replace(".", ""))),
                            expression: i,
                            original: o
                        }
                    }
                }(i, n)).sort(Sa);
            return r.map((e => function(t, e) {
                let n = sa[e.type] || (() => {}),
                    [i, r] = pa(t);
                wr(t, e.original, r);
                let a = () => {
                    t._x_ignore || t._x_ignoreSelf || (n.inline && n.inline(t, e, i), n = n.bind(n, t, e, i), ua ? ha.get(da).push(n) : n())
                };
                return a.runCleanups = r, a
            }(t, e)))
        }

        function ca(t) {
            return Array.from(t).map(ma()).filter((t => !va(t)))
        }
        var ua = !1,
            ha = new Map,
            da = Symbol();

        function pa(t) {
            let e = [],
                [n, i] = function(t) {
                    let e = () => {};
                    return [n => {
                        let i = Ki(n);
                        return t._x_effects || (t._x_effects = new Set, t._x_runEffects = () => {
                            t._x_effects.forEach((t => t()))
                        }), t._x_effects.add(i), e = () => {
                            void 0 !== i && (t._x_effects.delete(i), Zi(i))
                        }, i
                    }, () => {
                        e()
                    }]
                }(t);
            return e.push(i), [{
                Alpine: Qa,
                effect: n,
                cleanup: t => e.push(t),
                evaluateLater: Qr.bind(Qr, t),
                evaluate: Jr.bind(Jr, t)
            }, () => e.forEach((t => t()))]
        }
        var fa = (t, e) => ({
            name: n,
            value: i
        }) => (n.startsWith(t) && (n = n.replace(t, e)), {
            name: n,
            value: i
        });

        function ma(t = (() => {})) {
            return ({
                name: e,
                value: n
            }) => {
                let {
                    name: i,
                    value: r
                } = ga.reduce(((t, e) => e(t)), {
                    name: e,
                    value: n
                });
                return i !== e && t(i, e), {
                    name: i,
                    value: r
                }
            }
        }
        var ga = [];

        function _a(t) {
            ga.push(t)
        }

        function va({
            name: t
        }) {
            return xa().test(t)
        }
        var xa = () => new RegExp(`^${ra}([^:^.]+)\\b`),
            ya = "DEFAULT",
            Ma = ["ignore", "ref", "data", "id", "bind", "init", "for", "model", "modelable", "transition", "show", "if", ya, "teleport"];

        function Sa(t, e) {
            let n = -1 === Ma.indexOf(t.type) ? ya : t.type,
                i = -1 === Ma.indexOf(e.type) ? ya : e.type;
            return Ma.indexOf(n) - Ma.indexOf(i)
        }
        var Ea = [],
            Ta = !1;

        function ba(t = (() => {})) {
            return queueMicrotask((() => {
                Ta || setTimeout((() => {
                    wa()
                }))
            })), new Promise((e => {
                Ea.push((() => {
                    t(), e()
                }))
            }))
        }

        function wa() {
            for (Ta = !1; Ea.length;) Ea.shift()()
        }

        function Aa(t, e) {
            return Array.isArray(e) ? Ra(t, e.join(" ")) : "object" == typeof e && null !== e ? function(t, e) {
                let n = t => t.split(" ").filter(Boolean),
                    i = Object.entries(e).flatMap((([t, e]) => !!e && n(t))).filter(Boolean),
                    r = Object.entries(e).flatMap((([t, e]) => !e && n(t))).filter(Boolean),
                    a = [],
                    s = [];
                return r.forEach((e => {
                    t.classList.contains(e) && (t.classList.remove(e), s.push(e))
                })), i.forEach((e => {
                    t.classList.contains(e) || (t.classList.add(e), a.push(e))
                })), () => {
                    s.forEach((e => t.classList.add(e))), a.forEach((e => t.classList.remove(e)))
                }
            }(t, e) : "function" == typeof e ? Aa(t, e()) : Ra(t, e)
        }

        function Ra(t, e) {
            return e = !0 === e ? e = "" : e || "", n = e.split(" ").filter((e => !t.classList.contains(e))).filter(Boolean), t.classList.add(...n), () => {
                t.classList.remove(...n)
            };
            var n
        }

        function Ca(t, e) {
            return "object" == typeof e && null !== e ? function(t, e) {
                let n = {};
                return Object.entries(e).forEach((([e, i]) => {
                    n[e] = t.style[e], e.startsWith("--") || (e = e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()), t.style.setProperty(e, i)
                })), setTimeout((() => {
                    0 === t.style.length && t.removeAttribute("style")
                })), () => {
                    Ca(t, n)
                }
            }(t, e) : function(t, e) {
                let n = t.getAttribute("style", e);
                return t.setAttribute("style", e), () => {
                    t.setAttribute("style", n || "")
                }
            }(t, e)
        }

        function La(t, e = (() => {})) {
            let n = !1;
            return function() {
                n ? e.apply(this, arguments) : (n = !0, t.apply(this, arguments))
            }
        }

        function Pa(t, e, n = {}) {
            t._x_transition || (t._x_transition = {
                enter: {
                    during: n,
                    start: n,
                    end: n
                },
                leave: {
                    during: n,
                    start: n,
                    end: n
                },
                in(n = (() => {}), i = (() => {})) {
                    Da(t, e, {
                        during: this.enter.during,
                        start: this.enter.start,
                        end: this.enter.end
                    }, n, i)
                },
                out(n = (() => {}), i = (() => {})) {
                    Da(t, e, {
                        during: this.leave.during,
                        start: this.leave.start,
                        end: this.leave.end
                    }, n, i)
                }
            })
        }

        function Ua(t) {
            let e = t.parentNode;
            if (e) return e._x_hidePromise ? e : Ua(e)
        }

        function Da(t, e, {
            during: n,
            start: i,
            end: r
        } = {}, a = (() => {}), s = (() => {})) {
            if (t._x_transitioning && t._x_transitioning.cancel(), 0 === Object.keys(n).length && 0 === Object.keys(i).length && 0 === Object.keys(r).length) return a(), void s();
            let o, l, c;
            ! function(t, e) {
                let n, i, r, a = La((() => {
                    Ir((() => {
                        n = !0, i || e.before(), r || (e.end(), wa()), e.after(), t.isConnected && e.cleanup(), delete t._x_transitioning
                    }))
                }));
                t._x_transitioning = {
                    beforeCancels: [],
                    beforeCancel(t) {
                        this.beforeCancels.push(t)
                    },
                    cancel: La((function() {
                        for (; this.beforeCancels.length;) this.beforeCancels.shift()();
                        a()
                    })),
                    finish: a
                }, Ir((() => {
                    e.start(), e.during()
                })), Ta = !0, requestAnimationFrame((() => {
                    if (n) return;
                    let a = 1e3 * Number(getComputedStyle(t).transitionDuration.replace(/,.*/, "").replace("s", "")),
                        s = 1e3 * Number(getComputedStyle(t).transitionDelay.replace(/,.*/, "").replace("s", ""));
                    0 === a && (a = 1e3 * Number(getComputedStyle(t).animationDuration.replace("s", ""))), Ir((() => {
                        e.before()
                    })), i = !0, requestAnimationFrame((() => {
                        n || (Ir((() => {
                            e.end()
                        })), wa(), setTimeout(t._x_transitioning.finish, a + s), r = !0)
                    }))
                }))
            }(t, {
                start() {
                    o = e(t, i)
                },
                during() {
                    l = e(t, n)
                },
                before: a,
                end() {
                    o(), c = e(t, r)
                },
                after: s,
                cleanup() {
                    l(), c()
                }
            })
        }

        function Ia(t, e, n) {
            if (-1 === t.indexOf(e)) return n;
            const i = t[t.indexOf(e) + 1];
            if (!i) return n;
            if ("scale" === e && isNaN(i)) return n;
            if ("duration" === e || "delay" === e) {
                let t = i.match(/([0-9]+)ms/);
                if (t) return t[1]
            }
            return "origin" === e && ["top", "right", "left", "center", "bottom"].includes(t[t.indexOf(e) + 2]) ? [i, t[t.indexOf(e) + 2]].join(" ") : i
        }
        oa("transition", ((t, {
            value: e,
            modifiers: n,
            expression: i
        }, {
            evaluate: r
        }) => {
            "function" == typeof i && (i = r(i)), !1 !== i && (i && "boolean" != typeof i ? function(t, e, n) {
                Pa(t, Aa, ""), {
                    enter: e => {
                        t._x_transition.enter.during = e
                    },
                    "enter-start": e => {
                        t._x_transition.enter.start = e
                    },
                    "enter-end": e => {
                        t._x_transition.enter.end = e
                    },
                    leave: e => {
                        t._x_transition.leave.during = e
                    },
                    "leave-start": e => {
                        t._x_transition.leave.start = e
                    },
                    "leave-end": e => {
                        t._x_transition.leave.end = e
                    }
                } [n](e)
            }(t, i, e) : function(t, e, n) {
                Pa(t, Ca);
                let i = !e.includes("in") && !e.includes("out") && !n,
                    r = i || e.includes("in") || ["enter"].includes(n),
                    a = i || e.includes("out") || ["leave"].includes(n);
                e.includes("in") && !i && (e = e.filter(((t, n) => n < e.indexOf("out")))), e.includes("out") && !i && (e = e.filter(((t, n) => n > e.indexOf("out"))));
                let s = !e.includes("opacity") && !e.includes("scale"),
                    o = s || e.includes("opacity") ? 0 : 1,
                    l = s || e.includes("scale") ? Ia(e, "scale", 95) / 100 : 1,
                    c = Ia(e, "delay", 0) / 1e3,
                    u = Ia(e, "origin", "center"),
                    h = "opacity, transform",
                    d = Ia(e, "duration", 150) / 1e3,
                    p = Ia(e, "duration", 75) / 1e3,
                    f = "cubic-bezier(0.4, 0.0, 0.2, 1)";
                r && (t._x_transition.enter.during = {
                    transformOrigin: u,
                    transitionDelay: `${c}s`,
                    transitionProperty: h,
                    transitionDuration: `${d}s`,
                    transitionTimingFunction: f
                }, t._x_transition.enter.start = {
                    opacity: o,
                    transform: `scale(${l})`
                }, t._x_transition.enter.end = {
                    opacity: 1,
                    transform: "scale(1)"
                }), a && (t._x_transition.leave.during = {
                    transformOrigin: u,
                    transitionDelay: `${c}s`,
                    transitionProperty: h,
                    transitionDuration: `${p}s`,
                    transitionTimingFunction: f
                }, t._x_transition.leave.start = {
                    opacity: 1,
                    transform: "scale(1)"
                }, t._x_transition.leave.end = {
                    opacity: o,
                    transform: `scale(${l})`
                })
            }(t, n, e))
        })), window.Element.prototype._x_toggleAndCascadeWithTransitions = function(t, e, n, i) {
            const r = "visible" === document.visibilityState ? requestAnimationFrame : setTimeout;
            let a = () => r(n);
            e ? t._x_transition && (t._x_transition.enter || t._x_transition.leave) ? t._x_transition.enter && (Object.entries(t._x_transition.enter.during).length || Object.entries(t._x_transition.enter.start).length || Object.entries(t._x_transition.enter.end).length) ? t._x_transition.in(n) : a() : t._x_transition ? t._x_transition.in(n) : a() : (t._x_hidePromise = t._x_transition ? new Promise(((e, n) => {
                t._x_transition.out((() => {}), (() => e(i))), t._x_transitioning.beforeCancel((() => n({
                    isFromCancelledTransition: !0
                })))
            })) : Promise.resolve(i), queueMicrotask((() => {
                let e = Ua(t);
                e ? (e._x_hideChildren || (e._x_hideChildren = []), e._x_hideChildren.push(t)) : r((() => {
                    let e = t => {
                        let n = Promise.all([t._x_hidePromise, ...(t._x_hideChildren || []).map(e)]).then((([t]) => t()));
                        return delete t._x_hidePromise, delete t._x_hideChildren, n
                    };
                    e(t).catch((t => {
                        if (!t.isFromCancelledTransition) throw t
                    }))
                }))
            })))
        };
        var Oa = !1;

        function Na(t, e = (() => {})) {
            return (...n) => Oa ? e(...n) : t(...n)
        }
        var Fa = !1;

        function za(t) {
            let e = Ki;
            ar(((t, n) => {
                let i = e(t);
                return Zi(i), () => {}
            })), t(), ar(e)
        }

        function Ba(t, e, n, i = []) {
            switch (t._x_bindings || (t._x_bindings = Yi({})), t._x_bindings[e] = n, e = i.includes("camel") ? e.toLowerCase().replace(/-(\w)/g, ((t, e) => e.toUpperCase())) : e) {
                case "value":
                    ! function(t, e) {
                        if ("radio" === t.type) void 0 === t.attributes.value && (t.value = e), window.fromModel && (t.checked = Ha(t.value, e));
                        else if ("checkbox" === t.type) Number.isInteger(e) ? t.value = e : Array.isArray(e) || "boolean" == typeof e || [null, void 0].includes(e) ? Array.isArray(e) ? t.checked = e.some((e => Ha(e, t.value))) : t.checked = !!e : t.value = String(e);
                        else if ("SELECT" === t.tagName) ! function(t, e) {
                            const n = [].concat(e).map((t => t + ""));
                            Array.from(t.options).forEach((t => {
                                t.selected = n.includes(t.value)
                            }))
                        }(t, e);
                        else {
                            if (t.value === e) return;
                            t.value = void 0 === e ? "" : e
                        }
                    }(t, n);
                    break;
                case "style":
                    ! function(t, e) {
                        t._x_undoAddedStyles && t._x_undoAddedStyles(), t._x_undoAddedStyles = Ca(t, e)
                    }(t, n);
                    break;
                case "class":
                    ! function(t, e) {
                        t._x_undoAddedClasses && t._x_undoAddedClasses(), t._x_undoAddedClasses = Aa(t, e)
                    }(t, n);
                    break;
                case "selected":
                case "checked":
                    ! function(t, e, n) {
                        ka(t, e, n),
                            function(t, e, n) {
                                t[e] !== n && (t[e] = n)
                            }(t, e, n)
                    }(t, e, n);
                    break;
                default:
                    ka(t, e, n)
            }
        }

        function ka(t, e, n) {
            [null, void 0, !1].includes(n) && function(t) {
                return !["aria-pressed", "aria-checked", "aria-expanded", "aria-selected"].includes(t)
            }(e) ? t.removeAttribute(e) : (Ga(e) && (n = e), function(t, e, n) {
                t.getAttribute(e) != n && t.setAttribute(e, n)
            }(t, e, n))
        }

        function Ha(t, e) {
            return t == e
        }

        function Ga(t) {
            return ["disabled", "checked", "required", "readonly", "hidden", "open", "selected", "autofocus", "itemscope", "multiple", "novalidate", "allowfullscreen", "allowpaymentrequest", "formnovalidate", "autoplay", "controls", "loop", "muted", "playsinline", "default", "ismap", "reversed", "async", "defer", "nomodule"].includes(t)
        }

        function Va(t, e, n) {
            let i = t.getAttribute(e);
            return null === i ? "function" == typeof n ? n() : n : "" === i || (Ga(e) ? !![e, "true"].includes(i) : i)
        }

        function Wa(t, e) {
            var n;
            return function() {
                var i = this,
                    r = arguments;
                clearTimeout(n), n = setTimeout((function() {
                    n = null, t.apply(i, r)
                }), e)
            }
        }

        function Xa(t, e) {
            let n;
            return function() {
                let i = arguments;
                n || (t.apply(this, i), n = !0, setTimeout((() => n = !1), e))
            }
        }

        function ja({
            get: t,
            set: e
        }, {
            get: n,
            set: i
        }) {
            let r, a, s, o, l = !0,
                c = Ki((() => {
                    let c, u;
                    l ? (c = t(), i(JSON.parse(JSON.stringify(c))), u = n(), l = !1) : (c = t(), u = n(), s = JSON.stringify(c), o = JSON.stringify(u), s !== r ? (u = n(), i(c), u = c) : (e(JSON.parse(o ?? null)), c = u)), r = JSON.stringify(c), a = JSON.stringify(u)
                }));
            return () => {
                Zi(c)
            }
        }
        var qa = {},
            Ya = !1,
            Ka = {};

        function Za(t, e, n) {
            let i = [];
            for (; i.length;) i.pop()();
            let r = Object.entries(e).map((([t, e]) => ({
                    name: t,
                    value: e
                }))),
                a = ca(r);
            return r = r.map((t => a.find((e => e.name === t.name)) ? {
                name: `x-bind:${t.name}`,
                value: `"${t.value}"`
            } : t)), la(t, r, n).map((t => {
                i.push(t.runCleanups), t()
            })), () => {
                for (; i.length;) i.pop()()
            }
        }
        var $a = {},
            Ja = {
                get reactive() {
                    return Yi
                },
                get release() {
                    return Zi
                },
                get effect() {
                    return Ki
                },
                get raw() {
                    return $i
                },
                version: "3.13.0",
                flushAndStopDeferringMutations: function() {
                    Or = !1, Fr(Nr), Nr = []
                },
                dontAutoEvaluateFunctions: $r,
                disableEffectScheduling: function(t) {
                    rr = !1, t(), rr = !0
                },
                startObservingMutations: Lr,
                stopObservingMutations: Pr,
                setReactivityEngine: function(t) {
                    Yi = t.reactive, Zi = t.release, Ki = e => t.effect(e, {
                        scheduler: t => {
                            rr ? function(t) {
                                var e;
                                e = t, tr.includes(e) || tr.push(e), Qi || Ji || (Ji = !0, queueMicrotask(ir))
                            }(t) : t()
                        }
                    }), $i = t.raw
                },
                onAttributeRemoved: wr,
                onAttributesAdded: br,
                closestDataStack: kr,
                skipDuringClone: Na,
                onlyDuringClone: function(t) {
                    return (...e) => Oa && t(...e)
                },
                addRootSelector: fr,
                addInitSelector: mr,
                addScopeToNode: Br,
                deferMutations: function() {
                    Or = !0
                },
                mapAttributes: _a,
                evaluateLater: Qr,
                interceptInit: function(t) {
                    vr.push(t)
                },
                setEvaluator: function(t) {
                    ta = t
                },
                mergeProxies: Hr,
                extractProp: function(t, e, n, i = !0) {
                    if (t._x_bindings && void 0 !== t._x_bindings[e]) return t._x_bindings[e];
                    if (t._x_inlineBindings && void 0 !== t._x_inlineBindings[e]) {
                        let n = t._x_inlineBindings[e];
                        return n.extract = i, $r((() => Jr(t, n.expression)))
                    }
                    return Va(t, e, n)
                },
                findClosest: _r,
                onElRemoved: Tr,
                closestRoot: gr,
                destroyTree: yr,
                interceptor: Vr,
                transition: Da,
                setStyles: Ca,
                mutateDom: Ir,
                directive: oa,
                entangle: ja,
                throttle: Xa,
                debounce: Wa,
                evaluate: Jr,
                initTree: xr,
                nextTick: ba,
                prefixed: aa,
                prefix: function(t) {
                    ra = t
                },
                plugin: function(t) {
                    (Array.isArray(t) ? t : [t]).forEach((t => t(Qa)))
                },
                magic: jr,
                store: function(t, e) {
                    if (Ya || (qa = Yi(qa), Ya = !0), void 0 === e) return qa[t];
                    qa[t] = e, "object" == typeof e && null !== e && e.hasOwnProperty("init") && "function" == typeof e.init && qa[t].init(), Gr(qa[t])
                },
                start: function() {
                    var t;
                    cr && lr("Alpine has already been initialized on this page. Calling Alpine.start() more than once can cause problems."), cr = !0, document.body || lr("Unable to initialize. Trying to load Alpine before `<body>` is available. Did you forget to add `defer` in Alpine's `<script>` tag?"), sr(document, "alpine:init"), sr(document, "alpine:initializing"), Lr(), t = t => xr(t, or), Er.push(t), Tr((t => yr(t))), br(((t, e) => {
                        la(t, e).forEach((t => t()))
                    })), Array.from(document.querySelectorAll(pr())).filter((t => !gr(t.parentElement, !0))).forEach((t => {
                        xr(t)
                    })), sr(document, "alpine:initialized")
                },
                clone: function(t, e) {
                    e._x_dataStack || (e._x_dataStack = t._x_dataStack), Oa = !0, Fa = !0, za((() => {
                        ! function(t) {
                            let e = !1;
                            xr(t, ((t, n) => {
                                or(t, ((t, i) => {
                                    if (e && function(t) {
                                            return dr().some((e => t.matches(e)))
                                        }(t)) return i();
                                    e = !0, n(t, i)
                                }))
                            }))
                        }(e)
                    })), Oa = !1, Fa = !1
                },
                cloneNode: function(t, e) {
                    t._x_dataStack && (e._x_dataStack = t._x_dataStack, e.setAttribute("data-has-alpine-state", !0)), Oa = !0, za((() => {
                        xr(e, ((t, e) => {
                            e(t, (() => {}))
                        }))
                    })), Oa = !1
                },
                bound: function(t, e, n) {
                    return t._x_bindings && void 0 !== t._x_bindings[e] ? t._x_bindings[e] : Va(t, e, n)
                },
                $data: zr,
                walk: or,
                data: function(t, e) {
                    $a[t] = e
                },
                bind: function(t, e) {
                    let n = "function" != typeof e ? () => e : e;
                    return t instanceof Element ? Za(t, n()) : (Ka[t] = n, () => {})
                }
            },
            Qa = Ja;

        function ts(t, e) {
            const n = Object.create(null),
                i = t.split(",");
            for (let t = 0; t < i.length; t++) n[i[t]] = !0;
            return e ? t => !!n[t.toLowerCase()] : t => !!n[t]
        }
        var es, ns = Object.freeze({}),
            is = (Object.freeze([]), Object.prototype.hasOwnProperty),
            rs = (t, e) => is.call(t, e),
            as = Array.isArray,
            ss = t => "[object Map]" === us(t),
            os = t => "symbol" == typeof t,
            ls = t => null !== t && "object" == typeof t,
            cs = Object.prototype.toString,
            us = t => cs.call(t),
            hs = t => us(t).slice(8, -1),
            ds = t => "string" == typeof t && "NaN" !== t && "-" !== t[0] && "" + parseInt(t, 10) === t,
            ps = t => {
                const e = Object.create(null);
                return n => e[n] || (e[n] = t(n))
            },
            fs = /-(\w)/g,
            ms = (ps((t => t.replace(fs, ((t, e) => e ? e.toUpperCase() : "")))), /\B([A-Z])/g),
            gs = (ps((t => t.replace(ms, "-$1").toLowerCase())), ps((t => t.charAt(0).toUpperCase() + t.slice(1)))),
            _s = (ps((t => t ? `on${gs(t)}` : "")), (t, e) => t !== e && (t == t || e == e)),
            vs = new WeakMap,
            xs = [],
            ys = Symbol("iterate"),
            Ms = Symbol("Map key iterate"),
            Ss = 0;

        function Es(t) {
            const {
                deps: e
            } = t;
            if (e.length) {
                for (let n = 0; n < e.length; n++) e[n].delete(t);
                e.length = 0
            }
        }
        var Ts = !0,
            bs = [];

        function ws() {
            const t = bs.pop();
            Ts = void 0 === t || t
        }

        function As(t, e, n) {
            if (!Ts || void 0 === es) return;
            let i = vs.get(t);
            i || vs.set(t, i = new Map);
            let r = i.get(n);
            r || i.set(n, r = new Set), r.has(es) || (r.add(es), es.deps.push(r), es.options.onTrack && es.options.onTrack({
                effect: es,
                target: t,
                type: e,
                key: n
            }))
        }

        function Rs(t, e, n, i, r, a) {
            const s = vs.get(t);
            if (!s) return;
            const o = new Set,
                l = t => {
                    t && t.forEach((t => {
                        (t !== es || t.allowRecurse) && o.add(t)
                    }))
                };
            if ("clear" === e) s.forEach(l);
            else if ("length" === n && as(t)) s.forEach(((t, e) => {
                ("length" === e || e >= i) && l(t)
            }));
            else switch (void 0 !== n && l(s.get(n)), e) {
                case "add":
                    as(t) ? ds(n) && l(s.get("length")) : (l(s.get(ys)), ss(t) && l(s.get(Ms)));
                    break;
                case "delete":
                    as(t) || (l(s.get(ys)), ss(t) && l(s.get(Ms)));
                    break;
                case "set":
                    ss(t) && l(s.get(ys))
            }
            o.forEach((s => {
                s.options.onTrigger && s.options.onTrigger({
                    effect: s,
                    target: t,
                    key: n,
                    type: e,
                    newValue: i,
                    oldValue: r,
                    oldTarget: a
                }), s.options.scheduler ? s.options.scheduler(s) : s()
            }))
        }
        var Cs = ts("__proto__,__v_isRef,__isVue"),
            Ls = new Set(Object.getOwnPropertyNames(Symbol).map((t => Symbol[t])).filter(os)),
            Ps = Os(),
            Us = Os(!0),
            Ds = Is();

        function Is() {
            const t = {};
            return ["includes", "indexOf", "lastIndexOf"].forEach((e => {
                t[e] = function(...t) {
                    const n = go(this);
                    for (let t = 0, e = this.length; t < e; t++) As(n, "get", t + "");
                    const i = n[e](...t);
                    return -1 === i || !1 === i ? n[e](...t.map(go)) : i
                }
            })), ["push", "pop", "shift", "unshift", "splice"].forEach((e => {
                t[e] = function(...t) {
                    bs.push(Ts), Ts = !1;
                    const n = go(this)[e].apply(this, t);
                    return ws(), n
                }
            })), t
        }

        function Os(t = !1, e = !1) {
            return function(n, i, r) {
                if ("__v_isReactive" === i) return !t;
                if ("__v_isReadonly" === i) return t;
                if ("__v_raw" === i && r === (t ? e ? ho : uo : e ? co : lo).get(n)) return n;
                const a = as(n);
                if (!t && a && rs(Ds, i)) return Reflect.get(Ds, i, r);
                const s = Reflect.get(n, i, r);
                return (os(i) ? Ls.has(i) : Cs(i)) ? s : (t || As(n, "get", i), e ? s : _o(s) ? a && ds(i) ? s : s.value : ls(s) ? t ? fo(s) : po(s) : s)
            }
        }

        function Ns(t = !1) {
            return function(e, n, i, r) {
                let a = e[n];
                if (!t && (i = go(i), a = go(a), !as(e) && _o(a) && !_o(i))) return a.value = i, !0;
                const s = as(e) && ds(n) ? Number(n) < e.length : rs(e, n),
                    o = Reflect.set(e, n, i, r);
                return e === go(r) && (s ? _s(i, a) && Rs(e, "set", n, i, a) : Rs(e, "add", n, i)), o
            }
        }
        var Fs = {
                get: Ps,
                set: Ns(),
                deleteProperty: function(t, e) {
                    const n = rs(t, e),
                        i = t[e],
                        r = Reflect.deleteProperty(t, e);
                    return r && n && Rs(t, "delete", e, void 0, i), r
                },
                has: function(t, e) {
                    const n = Reflect.has(t, e);
                    return os(e) && Ls.has(e) || As(t, "has", e), n
                },
                ownKeys: function(t) {
                    return As(t, "iterate", as(t) ? "length" : ys), Reflect.ownKeys(t)
                }
            },
            zs = {
                get: Us,
                set: (t, e) => (console.warn(`Set operation on key "${String(e)}" failed: target is readonly.`, t), !0),
                deleteProperty: (t, e) => (console.warn(`Delete operation on key "${String(e)}" failed: target is readonly.`, t), !0)
            },
            Bs = t => ls(t) ? po(t) : t,
            ks = t => ls(t) ? fo(t) : t,
            Hs = t => t,
            Gs = t => Reflect.getPrototypeOf(t);

        function Vs(t, e, n = !1, i = !1) {
            const r = go(t = t.__v_raw),
                a = go(e);
            e !== a && !n && As(r, "get", e), !n && As(r, "get", a);
            const {
                has: s
            } = Gs(r), o = i ? Hs : n ? ks : Bs;
            return s.call(r, e) ? o(t.get(e)) : s.call(r, a) ? o(t.get(a)) : void(t !== r && t.get(e))
        }

        function Ws(t, e = !1) {
            const n = this.__v_raw,
                i = go(n),
                r = go(t);
            return t !== r && !e && As(i, "has", t), !e && As(i, "has", r), t === r ? n.has(t) : n.has(t) || n.has(r)
        }

        function Xs(t, e = !1) {
            return t = t.__v_raw, !e && As(go(t), "iterate", ys), Reflect.get(t, "size", t)
        }

        function js(t) {
            t = go(t);
            const e = go(this);
            return Gs(e).has.call(e, t) || (e.add(t), Rs(e, "add", t, t)), this
        }

        function qs(t, e) {
            e = go(e);
            const n = go(this),
                {
                    has: i,
                    get: r
                } = Gs(n);
            let a = i.call(n, t);
            a ? oo(n, i, t) : (t = go(t), a = i.call(n, t));
            const s = r.call(n, t);
            return n.set(t, e), a ? _s(e, s) && Rs(n, "set", t, e, s) : Rs(n, "add", t, e), this
        }

        function Ys(t) {
            const e = go(this),
                {
                    has: n,
                    get: i
                } = Gs(e);
            let r = n.call(e, t);
            r ? oo(e, n, t) : (t = go(t), r = n.call(e, t));
            const a = i ? i.call(e, t) : void 0,
                s = e.delete(t);
            return r && Rs(e, "delete", t, void 0, a), s
        }

        function Ks() {
            const t = go(this),
                e = 0 !== t.size,
                n = ss(t) ? new Map(t) : new Set(t),
                i = t.clear();
            return e && Rs(t, "clear", void 0, void 0, n), i
        }

        function Zs(t, e) {
            return function(n, i) {
                const r = this,
                    a = r.__v_raw,
                    s = go(a),
                    o = e ? Hs : t ? ks : Bs;
                return !t && As(s, "iterate", ys), a.forEach(((t, e) => n.call(i, o(t), o(e), r)))
            }
        }

        function $s(t, e, n) {
            return function(...i) {
                const r = this.__v_raw,
                    a = go(r),
                    s = ss(a),
                    o = "entries" === t || t === Symbol.iterator && s,
                    l = "keys" === t && s,
                    c = r[t](...i),
                    u = n ? Hs : e ? ks : Bs;
                return !e && As(a, "iterate", l ? Ms : ys), {
                    next() {
                        const {
                            value: t,
                            done: e
                        } = c.next();
                        return e ? {
                            value: t,
                            done: e
                        } : {
                            value: o ? [u(t[0]), u(t[1])] : u(t),
                            done: e
                        }
                    },
                    [Symbol.iterator]() {
                        return this
                    }
                }
            }
        }

        function Js(t) {
            return function(...e) {
                {
                    const n = e[0] ? `on key "${e[0]}" ` : "";
                    console.warn(`${gs(t)} operation ${n}failed: target is readonly.`, go(this))
                }
                return "delete" !== t && this
            }
        }

        function Qs() {
            const t = {
                    get(t) {
                        return Vs(this, t)
                    },
                    get size() {
                        return Xs(this)
                    },
                    has: Ws,
                    add: js,
                    set: qs,
                    delete: Ys,
                    clear: Ks,
                    forEach: Zs(!1, !1)
                },
                e = {
                    get(t) {
                        return Vs(this, t, !1, !0)
                    },
                    get size() {
                        return Xs(this)
                    },
                    has: Ws,
                    add: js,
                    set: qs,
                    delete: Ys,
                    clear: Ks,
                    forEach: Zs(!1, !0)
                },
                n = {
                    get(t) {
                        return Vs(this, t, !0)
                    },
                    get size() {
                        return Xs(this, !0)
                    },
                    has(t) {
                        return Ws.call(this, t, !0)
                    },
                    add: Js("add"),
                    set: Js("set"),
                    delete: Js("delete"),
                    clear: Js("clear"),
                    forEach: Zs(!0, !1)
                },
                i = {
                    get(t) {
                        return Vs(this, t, !0, !0)
                    },
                    get size() {
                        return Xs(this, !0)
                    },
                    has(t) {
                        return Ws.call(this, t, !0)
                    },
                    add: Js("add"),
                    set: Js("set"),
                    delete: Js("delete"),
                    clear: Js("clear"),
                    forEach: Zs(!0, !0)
                };
            return ["keys", "values", "entries", Symbol.iterator].forEach((r => {
                t[r] = $s(r, !1, !1), n[r] = $s(r, !0, !1), e[r] = $s(r, !1, !0), i[r] = $s(r, !0, !0)
            })), [t, n, e, i]
        }
        var [to, eo, no, io] = Qs();

        function ro(t, e) {
            const n = e ? t ? io : no : t ? eo : to;
            return (e, i, r) => "__v_isReactive" === i ? !t : "__v_isReadonly" === i ? t : "__v_raw" === i ? e : Reflect.get(rs(n, i) && i in e ? n : e, i, r)
        }
        var ao = {
                get: ro(!1, !1)
            },
            so = {
                get: ro(!0, !1)
            };

        function oo(t, e, n) {
            const i = go(n);
            if (i !== n && e.call(t, i)) {
                const e = hs(t);
                console.warn(`Reactive ${e} contains both the raw and reactive versions of the same object${"Map"===e?" as keys":""}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`)
            }
        }
        var lo = new WeakMap,
            co = new WeakMap,
            uo = new WeakMap,
            ho = new WeakMap;

        function po(t) {
            return t && t.__v_isReadonly ? t : mo(t, !1, Fs, ao, lo)
        }

        function fo(t) {
            return mo(t, !0, zs, so, uo)
        }

        function mo(t, e, n, i, r) {
            if (!ls(t)) return console.warn(`value cannot be made reactive: ${String(t)}`), t;
            if (t.__v_raw && (!e || !t.__v_isReactive)) return t;
            const a = r.get(t);
            if (a) return a;
            const s = (o = t).__v_skip || !Object.isExtensible(o) ? 0 : function(t) {
                switch (t) {
                    case "Object":
                    case "Array":
                        return 1;
                    case "Map":
                    case "Set":
                    case "WeakMap":
                    case "WeakSet":
                        return 2;
                    default:
                        return 0
                }
            }(hs(o));
            var o;
            if (0 === s) return t;
            const l = new Proxy(t, 2 === s ? i : n);
            return r.set(t, l), l
        }

        function go(t) {
            return t && go(t.__v_raw) || t
        }

        function _o(t) {
            return Boolean(t && !0 === t.__v_isRef)
        }
        jr("nextTick", (() => ba)), jr("dispatch", (t => sr.bind(sr, t))), jr("watch", ((t, {
            evaluateLater: e,
            effect: n
        }) => (i, r) => {
            let a, s = e(i),
                o = !0,
                l = n((() => s((t => {
                    JSON.stringify(t), o ? a = t : queueMicrotask((() => {
                        r(t, a), a = t
                    })), o = !1
                }))));
            t._x_effects.delete(l)
        })), jr("store", (function() {
            return qa
        })), jr("data", (t => zr(t))), jr("root", (t => gr(t))), jr("refs", (t => (t._x_refs_proxy || (t._x_refs_proxy = Hr(function(t) {
            let e = [],
                n = t;
            for (; n;) n._x_refs && e.push(n._x_refs), n = n.parentNode;
            return e
        }(t))), t._x_refs_proxy)));
        var vo = {};

        function xo(t) {
            return vo[t] || (vo[t] = 0), ++vo[t]
        }

        function yo(t, e, n) {
            jr(e, (e => lr(`You can't use [$${directiveName}] without first installing the "${t}" plugin here: https://alpinejs.dev/plugins/${n}`, e)))
        }
        jr("id", (t => (e, n = null) => {
            let i = function(t, e) {
                    return _r(t, (t => {
                        if (t._x_ids && t._x_ids[e]) return !0
                    }))
                }(t, e),
                r = i ? i._x_ids[e] : xo(e);
            return n ? `${e}-${r}-${n}` : `${e}-${r}`
        })), jr("el", (t => t)), yo("Focus", "focus", "focus"), yo("Persist", "persist", "persist"), oa("modelable", ((t, {
            expression: e
        }, {
            effect: n,
            evaluateLater: i,
            cleanup: r
        }) => {
            let a = i(e),
                s = () => {
                    let t;
                    return a((e => t = e)), t
                },
                o = i(`${e} = __placeholder`),
                l = t => o((() => {}), {
                    scope: {
                        __placeholder: t
                    }
                }),
                c = s();
            l(c), queueMicrotask((() => {
                if (!t._x_model) return;
                t._x_removeModelListeners.default();
                let e = t._x_model.get,
                    n = t._x_model.set,
                    i = ja({
                        get: () => e(),
                        set(t) {
                            n(t)
                        }
                    }, {
                        get: () => s(),
                        set(t) {
                            l(t)
                        }
                    });
                r(i)
            }))
        }));
        var Mo = document.createElement("div");
        oa("teleport", ((t, {
            modifiers: e,
            expression: n
        }, {
            cleanup: i
        }) => {
            "template" !== t.tagName.toLowerCase() && lr("x-teleport can only be used on a <template> tag", t);
            let r = Na((() => document.querySelector(n)), (() => Mo))();
            r || lr(`Cannot find x-teleport element for selector: "${n}"`);
            let a = t.content.cloneNode(!0).firstElementChild;
            t._x_teleport = a, a._x_teleportBack = t, t._x_forwardEvents && t._x_forwardEvents.forEach((e => {
                a.addEventListener(e, (e => {
                    e.stopPropagation(), t.dispatchEvent(new e.constructor(e.type, e))
                }))
            })), Br(a, {}, t), Ir((() => {
                e.includes("prepend") ? r.parentNode.insertBefore(a, r) : e.includes("append") ? r.parentNode.insertBefore(a, r.nextSibling) : r.appendChild(a), xr(a), a._x_ignore = !0
            })), i((() => a.remove()))
        }));
        var So = () => {};

        function Eo(t, e, n, i) {
            let r = t,
                a = t => i(t),
                s = {},
                o = (t, e) => n => e(t, n);
            if (n.includes("dot") && (e = e.replace(/-/g, ".")), n.includes("camel") && (e = e.toLowerCase().replace(/-(\w)/g, ((t, e) => e.toUpperCase()))), n.includes("passive") && (s.passive = !0), n.includes("capture") && (s.capture = !0), n.includes("window") && (r = window), n.includes("document") && (r = document), n.includes("debounce")) {
                let t = n[n.indexOf("debounce") + 1] || "invalid-wait",
                    e = To(t.split("ms")[0]) ? Number(t.split("ms")[0]) : 250;
                a = Wa(a, e)
            }
            if (n.includes("throttle")) {
                let t = n[n.indexOf("throttle") + 1] || "invalid-wait",
                    e = To(t.split("ms")[0]) ? Number(t.split("ms")[0]) : 250;
                a = Xa(a, e)
            }
            return n.includes("prevent") && (a = o(a, ((t, e) => {
                e.preventDefault(), t(e)
            }))), n.includes("stop") && (a = o(a, ((t, e) => {
                e.stopPropagation(), t(e)
            }))), n.includes("self") && (a = o(a, ((e, n) => {
                n.target === t && e(n)
            }))), (n.includes("away") || n.includes("outside")) && (r = document, a = o(a, ((e, n) => {
                t.contains(n.target) || !1 !== n.target.isConnected && (t.offsetWidth < 1 && t.offsetHeight < 1 || !1 !== t._x_isShown && e(n))
            }))), n.includes("once") && (a = o(a, ((t, n) => {
                t(n), r.removeEventListener(e, a, s)
            }))), a = o(a, ((t, i) => {
                (function(t) {
                    return ["keydown", "keyup"].includes(t)
                })(e) && function(t, e) {
                    let n = e.filter((t => !["window", "document", "prevent", "stop", "once", "capture"].includes(t)));
                    if (n.includes("debounce")) {
                        let t = n.indexOf("debounce");
                        n.splice(t, To((n[t + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1)
                    }
                    if (n.includes("throttle")) {
                        let t = n.indexOf("throttle");
                        n.splice(t, To((n[t + 1] || "invalid-wait").split("ms")[0]) ? 2 : 1)
                    }
                    if (0 === n.length) return !1;
                    if (1 === n.length && bo(t.key).includes(n[0])) return !1;
                    const i = ["ctrl", "shift", "alt", "meta", "cmd", "super"].filter((t => n.includes(t)));
                    return n = n.filter((t => !i.includes(t))), !(i.length > 0 && i.filter((e => ("cmd" !== e && "super" !== e || (e = "meta"), t[`${e}Key`]))).length === i.length && bo(t.key).includes(n[0]))
                }(i, n) || t(i)
            })), r.addEventListener(e, a, s), () => {
                r.removeEventListener(e, a, s)
            }
        }

        function To(t) {
            return !Array.isArray(t) && !isNaN(t)
        }

        function bo(t) {
            if (!t) return [];
            var e;
            t = [" ", "_"].includes(e = t) ? e : e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/[_\s]/, "-").toLowerCase();
            let n = {
                ctrl: "control",
                slash: "/",
                space: " ",
                spacebar: " ",
                cmd: "meta",
                esc: "escape",
                up: "arrow-up",
                down: "arrow-down",
                left: "arrow-left",
                right: "arrow-right",
                period: ".",
                equal: "=",
                minus: "-",
                underscore: "_"
            };
            return n[t] = t, Object.keys(n).map((e => {
                if (n[e] === t) return e
            })).filter((t => t))
        }

        function wo(t) {
            let e = t ? parseFloat(t) : null;
            return n = e, Array.isArray(n) || isNaN(n) ? t : e;
            var n
        }

        function Ao(t) {
            return null !== t && "object" == typeof t && "function" == typeof t.get && "function" == typeof t.set
        }
        So.inline = (t, {
            modifiers: e
        }, {
            cleanup: n
        }) => {
            e.includes("self") ? t._x_ignoreSelf = !0 : t._x_ignore = !0, n((() => {
                e.includes("self") ? delete t._x_ignoreSelf : delete t._x_ignore
            }))
        }, oa("ignore", So), oa("effect", ((t, {
            expression: e
        }, {
            effect: n
        }) => n(Qr(t, e)))), oa("model", ((t, {
            modifiers: e,
            expression: n
        }, {
            effect: i,
            cleanup: r
        }) => {
            let a = t;
            e.includes("parent") && (a = t.parentNode);
            let s, o = Qr(a, n);
            s = "string" == typeof n ? Qr(a, `${n} = __placeholder`) : "function" == typeof n && "string" == typeof n() ? Qr(a, `${n()} = __placeholder`) : () => {};
            let l = () => {
                    let t;
                    return o((e => t = e)), Ao(t) ? t.get() : t
                },
                c = t => {
                    let e;
                    o((t => e = t)), Ao(e) ? e.set(t) : s((() => {}), {
                        scope: {
                            __placeholder: t
                        }
                    })
                };
            "string" == typeof n && "radio" === t.type && Ir((() => {
                t.hasAttribute("name") || t.setAttribute("name", n)
            }));
            var u = "select" === t.tagName.toLowerCase() || ["checkbox", "radio"].includes(t.type) || e.includes("lazy") ? "change" : "input";
            let h = Oa ? () => {} : Eo(t, u, e, (n => {
                c(function(t, e, n, i) {
                    return Ir((() => {
                        if (n instanceof CustomEvent && void 0 !== n.detail) return n.detail ?? n.target.value;
                        if ("checkbox" === t.type) {
                            if (Array.isArray(i)) {
                                let t = e.includes("number") ? wo(n.target.value) : n.target.value;
                                return n.target.checked ? i.concat([t]) : i.filter((e => !(e == t)))
                            }
                            return n.target.checked
                        }
                        if ("select" === t.tagName.toLowerCase() && t.multiple) return e.includes("number") ? Array.from(n.target.selectedOptions).map((t => wo(t.value || t.text))) : Array.from(n.target.selectedOptions).map((t => t.value || t.text));
                        {
                            let t = n.target.value;
                            return e.includes("number") ? wo(t) : e.includes("trim") ? t.trim() : t
                        }
                    }))
                }(t, e, n, l()))
            }));
            if (e.includes("fill") && ([null, ""].includes(l()) || "checkbox" === t.type && Array.isArray(l())) && t.dispatchEvent(new Event(u, {})), t._x_removeModelListeners || (t._x_removeModelListeners = {}), t._x_removeModelListeners.default = h, r((() => t._x_removeModelListeners.default())), t.form) {
                let e = Eo(t.form, "reset", [], (e => {
                    ba((() => t._x_model && t._x_model.set(t.value)))
                }));
                r((() => e()))
            }
            t._x_model = {
                get: () => l(),
                set(t) {
                    c(t)
                }
            }, t._x_forceModelUpdate = e => {
                void 0 === e && "string" == typeof n && n.match(/\./) && (e = ""), window.fromModel = !0, Ir((() => Ba(t, "value", e))), delete window.fromModel
            }, i((() => {
                let n = l();
                e.includes("unintrusive") && document.activeElement.isSameNode(t) || t._x_forceModelUpdate(n)
            }))
        })), oa("cloak", (t => queueMicrotask((() => Ir((() => t.removeAttribute(aa("cloak")))))))), mr((() => `[${aa("init")}]`)), oa("init", Na(((t, {
            expression: e
        }, {
            evaluate: n
        }) => "string" == typeof e ? !!e.trim() && n(e, {}, !1) : n(e, {}, !1)))), oa("text", ((t, {
            expression: e
        }, {
            effect: n,
            evaluateLater: i
        }) => {
            let r = i(e);
            n((() => {
                r((e => {
                    Ir((() => {
                        t.textContent = e
                    }))
                }))
            }))
        })), oa("html", ((t, {
            expression: e
        }, {
            effect: n,
            evaluateLater: i
        }) => {
            let r = i(e);
            n((() => {
                r((e => {
                    Ir((() => {
                        t.innerHTML = e, t._x_ignoreSelf = !0, xr(t), delete t._x_ignoreSelf
                    }))
                }))
            }))
        })), _a(fa(":", aa("bind:")));
        var Ro = (t, {
            value: e,
            modifiers: n,
            expression: i,
            original: r
        }, {
            effect: a
        }) => {
            if (!e) {
                let e = {};
                return s = e, Object.entries(Ka).forEach((([t, e]) => {
                    Object.defineProperty(s, t, {
                        get: () => (...t) => e(...t)
                    })
                })), void Qr(t, i)((e => {
                    Za(t, e, r)
                }), {
                    scope: e
                })
            }
            var s;
            if ("key" === e) return function(t, e) {
                t._x_keyExpression = e
            }(t, i);
            if (t._x_inlineBindings && t._x_inlineBindings[e] && t._x_inlineBindings[e].extract) return;
            let o = Qr(t, i);
            a((() => o((r => {
                void 0 === r && "string" == typeof i && i.match(/\./) && (r = ""), Ir((() => Ba(t, e, r, n)))
            }))))
        };

        function Co(t, e, n, i) {
            let r = {};
            return /^\[.*\]$/.test(t.item) && Array.isArray(e) ? t.item.replace("[", "").replace("]", "").split(",").map((t => t.trim())).forEach(((t, n) => {
                r[t] = e[n]
            })) : /^\{.*\}$/.test(t.item) && !Array.isArray(e) && "object" == typeof e ? t.item.replace("{", "").replace("}", "").split(",").map((t => t.trim())).forEach((t => {
                r[t] = e[t]
            })) : r[t.item] = e, t.index && (r[t.index] = n), t.collection && (r[t.collection] = i), r
        }

        function Lo() {}

        function Po(t, e, n) {
            oa(e, (i => lr(`You can't use [x-${e}] without first installing the "${t}" plugin here: https://alpinejs.dev/plugins/${n}`, i)))
        }
        Ro.inline = (t, {
            value: e,
            modifiers: n,
            expression: i
        }) => {
            e && (t._x_inlineBindings || (t._x_inlineBindings = {}), t._x_inlineBindings[e] = {
                expression: i,
                extract: !1
            })
        }, oa("bind", Ro), fr((() => `[${aa("data")}]`)), oa("data", ((t, {
            expression: e
        }, {
            cleanup: n
        }) => {
            if (function(t) {
                    return !!Oa && (!!Fa || t.hasAttribute("data-has-alpine-state"))
                }(t)) return;
            e = "" === e ? "{}" : e;
            let i = {};
            qr(i, t);
            let r = {};
            var a, s;
            a = r, s = i, Object.entries($a).forEach((([t, e]) => {
                Object.defineProperty(a, t, {
                    get: () => (...t) => e.bind(s)(...t),
                    enumerable: !1
                })
            }));
            let o = Jr(t, e, {
                scope: r
            });
            void 0 !== o && !0 !== o || (o = {}), qr(o, t);
            let l = Yi(o);
            Gr(l);
            let c = Br(t, l);
            l.init && Jr(t, l.init), n((() => {
                l.destroy && Jr(t, l.destroy), c()
            }))
        })), oa("show", ((t, {
            modifiers: e,
            expression: n
        }, {
            effect: i
        }) => {
            let r = Qr(t, n);
            t._x_doHide || (t._x_doHide = () => {
                Ir((() => {
                    t.style.setProperty("display", "none", e.includes("important") ? "important" : void 0)
                }))
            }), t._x_doShow || (t._x_doShow = () => {
                Ir((() => {
                    1 === t.style.length && "none" === t.style.display ? t.removeAttribute("style") : t.style.removeProperty("display")
                }))
            });
            let a, s = () => {
                    t._x_doHide(), t._x_isShown = !1
                },
                o = () => {
                    t._x_doShow(), t._x_isShown = !0
                },
                l = () => setTimeout(o),
                c = La((t => t ? o() : s()), (e => {
                    "function" == typeof t._x_toggleAndCascadeWithTransitions ? t._x_toggleAndCascadeWithTransitions(t, e, o, s) : e ? l() : s()
                })),
                u = !0;
            i((() => r((t => {
                (u || t !== a) && (e.includes("immediate") && (t ? l() : s()), c(t), a = t, u = !1)
            }))))
        })), oa("for", ((t, {
            expression: e
        }, {
            effect: n,
            cleanup: i
        }) => {
            let r = function(t) {
                    let e = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/,
                        n = t.match(/([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/);
                    if (!n) return;
                    let i = {};
                    i.items = n[2].trim();
                    let r = n[1].replace(/^\s*\(|\)\s*$/g, "").trim(),
                        a = r.match(e);
                    return a ? (i.item = r.replace(e, "").trim(), i.index = a[1].trim(), a[2] && (i.collection = a[2].trim())) : i.item = r, i
                }(e),
                a = Qr(t, r.items),
                s = Qr(t, t._x_keyExpression || "index");
            t._x_prevKeys = [], t._x_lookup = {}, n((() => function(t, e, n, i) {
                let r = t;
                n((n => {
                    var a;
                    a = n, !Array.isArray(a) && !isNaN(a) && n >= 0 && (n = Array.from(Array(n).keys(), (t => t + 1))), void 0 === n && (n = []);
                    let s = t._x_lookup,
                        o = t._x_prevKeys,
                        l = [],
                        c = [];
                    if ("object" != typeof(u = n) || Array.isArray(u))
                        for (let t = 0; t < n.length; t++) {
                            let r = Co(e, n[t], t, n);
                            i((t => c.push(t)), {
                                scope: {
                                    index: t,
                                    ...r
                                }
                            }), l.push(r)
                        } else n = Object.entries(n).map((([t, r]) => {
                            let a = Co(e, r, t, n);
                            i((t => c.push(t)), {
                                scope: {
                                    index: t,
                                    ...a
                                }
                            }), l.push(a)
                        }));
                    var u;
                    let h = [],
                        d = [],
                        p = [],
                        f = [];
                    for (let t = 0; t < o.length; t++) {
                        let e = o[t]; - 1 === c.indexOf(e) && p.push(e)
                    }
                    o = o.filter((t => !p.includes(t)));
                    let m = "template";
                    for (let t = 0; t < c.length; t++) {
                        let e = c[t],
                            n = o.indexOf(e);
                        if (-1 === n) o.splice(t, 0, e), h.push([m, t]);
                        else if (n !== t) {
                            let e = o.splice(t, 1)[0],
                                i = o.splice(n - 1, 1)[0];
                            o.splice(t, 0, i), o.splice(n, 0, e), d.push([e, i])
                        } else f.push(e);
                        m = e
                    }
                    for (let t = 0; t < p.length; t++) {
                        let e = p[t];
                        s[e]._x_effects && s[e]._x_effects.forEach(nr), s[e].remove(), s[e] = null, delete s[e]
                    }
                    for (let t = 0; t < d.length; t++) {
                        let [e, n] = d[t], i = s[e], a = s[n], o = document.createElement("div");
                        Ir((() => {
                            a || lr('x-for ":key" is undefined or invalid', r), a.after(o), i.after(a), a._x_currentIfEl && a.after(a._x_currentIfEl), o.before(i), i._x_currentIfEl && i.after(i._x_currentIfEl), o.remove()
                        })), a._x_refreshXForScope(l[c.indexOf(n)])
                    }
                    for (let t = 0; t < h.length; t++) {
                        let [e, n] = h[t], i = "template" === e ? r : s[e];
                        i._x_currentIfEl && (i = i._x_currentIfEl);
                        let a = l[n],
                            o = c[n],
                            u = document.importNode(r.content, !0).firstElementChild,
                            d = Yi(a);
                        Br(u, d, r), u._x_refreshXForScope = t => {
                            Object.entries(t).forEach((([t, e]) => {
                                d[t] = e
                            }))
                        }, Ir((() => {
                            i.after(u), xr(u)
                        })), "object" == typeof o && lr("x-for key cannot be an object, it must be a string or an integer", r), s[o] = u
                    }
                    for (let t = 0; t < f.length; t++) s[f[t]]._x_refreshXForScope(l[c.indexOf(f[t])]);
                    r._x_prevKeys = c
                }))
            }(t, r, a, s))), i((() => {
                Object.values(t._x_lookup).forEach((t => t.remove())), delete t._x_prevKeys, delete t._x_lookup
            }))
        })), Lo.inline = (t, {
            expression: e
        }, {
            cleanup: n
        }) => {
            let i = gr(t);
            i._x_refs || (i._x_refs = {}), i._x_refs[e] = t, n((() => delete i._x_refs[e]))
        }, oa("ref", Lo), oa("if", ((t, {
            expression: e
        }, {
            effect: n,
            cleanup: i
        }) => {
            let r = Qr(t, e);
            n((() => r((e => {
                e ? (() => {
                    if (t._x_currentIfEl) return t._x_currentIfEl;
                    let e = t.content.cloneNode(!0).firstElementChild;
                    Br(e, {}, t), Ir((() => {
                        t.after(e), xr(e)
                    })), t._x_currentIfEl = e, t._x_undoIf = () => {
                        or(e, (t => {
                            t._x_effects && t._x_effects.forEach(nr)
                        })), e.remove(), delete t._x_currentIfEl
                    }
                })() : t._x_undoIf && (t._x_undoIf(), delete t._x_undoIf)
            })))), i((() => t._x_undoIf && t._x_undoIf()))
        })), oa("id", ((t, {
            expression: e
        }, {
            evaluate: n
        }) => {
            n(e).forEach((e => function(t, e) {
                t._x_ids || (t._x_ids = {}), t._x_ids[e] || (t._x_ids[e] = xo(e))
            }(t, e)))
        })), _a(fa("@", aa("on:"))), oa("on", Na(((t, {
            value: e,
            modifiers: n,
            expression: i
        }, {
            cleanup: r
        }) => {
            let a = i ? Qr(t, i) : () => {};
            "template" === t.tagName.toLowerCase() && (t._x_forwardEvents || (t._x_forwardEvents = []), t._x_forwardEvents.includes(e) || t._x_forwardEvents.push(e));
            let s = Eo(t, e, n, (t => {
                a((() => {}), {
                    scope: {
                        $event: t
                    },
                    params: [t]
                })
            }));
            r((() => s()))
        }))), Po("Collapse", "collapse", "collapse"), Po("Intersect", "intersect", "intersect"), Po("Focus", "trap", "focus"), Po("Mask", "mask", "mask"), Qa.setEvaluator(ea), Qa.setReactivityEngine({
            reactive: po,
            effect: function(t, e = ns) {
                (function(t) {
                    return t && !0 === t._isEffect
                })(t) && (t = t.raw);
                const n = function(t, e) {
                    const n = function() {
                        if (!n.active) return t();
                        if (!xs.includes(n)) {
                            Es(n);
                            try {
                                return bs.push(Ts), Ts = !0, xs.push(n), es = n, t()
                            } finally {
                                xs.pop(), ws(), es = xs[xs.length - 1]
                            }
                        }
                    };
                    return n.id = Ss++, n.allowRecurse = !!e.allowRecurse, n._isEffect = !0, n.active = !0, n.raw = t, n.deps = [], n.options = e, n
                }(t, e);
                return e.lazy || n(), n
            },
            release: function(t) {
                t.active && (Es(t), t.options.onStop && t.options.onStop(), t.active = !1)
            },
            raw: go
        });
        var Uo = Qa;
        let Do = null;
        class Io {
            constructor() {
                if (Do) return Do;
                this.onWheelAvailable = "onwheel" in document, this.onKeydownAvailable = "onkeydown" in document, this.onTouchAvailable = "ontouchstart" in document, this.onContextmenuAvailable = "oncontextmenu" in document, this.events = {
                    pointerdown: this.onTouchAvailable ? "touchstart" : "pointerdown",
                    pointermove: this.onTouchAvailable ? "touchmove" : "pointermove",
                    pointerup: this.onTouchAvailable ? "touchend" : "pointerup"
                }, Do = this
            }
            static getInstance() {
                return Do || (Do = new Io), Do
            }
            static get onWheelAvailable() {
                return Io.getInstance().onWheelAvailable
            }
            static get onKeydownAvailable() {
                return Io.getInstance().onKeydownAvailable
            }
            static get onTouchAvailable() {
                return Io.getInstance().onTouchAvailable
            }
            static get isTouch() {
                return Io.getInstance().onTouchAvailable
            }
            static get onContextmenuAvailable() {
                return Io.getInstance().onContextmenuAvailable
            }
            static get pointerdownEvent() {
                return Io.getInstance().events.pointerdown
            }
            static get pointermoveEvent() {
                return Io.getInstance().events.pointermove
            }
            static get pointerupEvent() {
                return Io.getInstance().events.pointerup
            }
        }
        class Oo {
            static random(t, e) {
                return void 0 === t ? Math.random() : void 0 === e ? Math.random() * t : t + Math.random() * (e - t)
            }
            static randomInt(t, e) {
                return Math.floor(Oo.random(t, e))
            }
            static constrain(t, e, n) {
                return Math.max(Math.min(t, n), e)
            }
            static map(t, e, n, i, r) {
                return (t - e) / (n - e) * (r - i) + i
            }
            static radians(t) {
                return t * (2 * Math.PI / 360)
            }
            static dist(t, e, n, i) {
                return Math.sqrt((t - n) * (t - n) + (e - i) * (e - i))
            }
            static lerp(t, e, n) {
                return t + (e - t) * n
            }
            static calcViewportFov(t, e) {
                return 2 * Math.atan(t / e) * (180 / Math.PI)
            }
        }
        class No {
            constructor(t, e) {
                this.x = t, this.velocity = 0, this.omega = e
            }
            update(t, e) {
                const n = e,
                    i = this.velocity - (this.x - t) * (this.omega * this.omega * n),
                    r = 1 + this.omega * n;
                this.velocity = i / (r * r), this.x += this.velocity * n
            }
            reset() {
                this.x = 0, this.velocity = 0
            }
        }
        class Fo {
            constructor(t, e = {
                strictArea: !1,
                useTouch: !1
            }) {
                this.strictArea = e.strictArea, this.useTouch = e.useTouch, this.$area = null, this.$target = null, this.direction = t, this.downPos = 0, this.prevPos = 0, this.targetScroll = 0, this.scroll = 0, this.velocity = 0, this.acceleration = 0, this.k = .4, this.max = 0, this.progress = 0, this.isPointerDown = !1, this.isDragging = !1, this.isAutoScrolling = !1, this.tween = new No(0, 30), this.onWheelFunction = this.onWheel.bind(this), this.onKeyDownFunction = this.onKeyDown.bind(this), this.onDownFunction = this.onDown.bind(this), this.onMoveFunction = this.onMove.bind(this), this.onUpFunction = this.onUp.bind(this), this.onContextMenuFunc = this.onContextMenu.bind(this), this.listenerOption = {
                    capture: !0,
                    passive: !1
                }, this.canceller = () => !1, this.resizeMng = new qi
            }
            setTarget(t) {
                this.removeEvents(), this.$area = t, this.$target = this.$area.querySelector('[data-scroll="target"]'), this.setEvents(), this.reset(), this.resizeMng.setSizeFunc((() => {
                    const {
                        width: t,
                        height: e
                    } = this.$target.getBoundingClientRect();
                    return {
                        width: t + window.innerWidth,
                        height: e + window.innerHeight
                    }
                }))
            }
            setCanceller(t) {
                this.canceller = t
            }
            setEvents() {
                if (!this.$target) return;
                const t = this.strictArea ? this.$area : window;
                Io.onWheelAvailable && t.addEventListener("wheel", this.onWheelFunction, this.listenerOption), !this.strictArea && Io.onKeydownAvailable && window.addEventListener("keydown", this.onKeyDownFunction), (Io.isTouch || this.useTouch) && (this.$area.addEventListener(Io.pointerdownEvent, this.onDownFunction, this.listenerOption), this.$area.addEventListener(Io.pointermoveEvent, this.onMoveFunction, this.listenerOption), this.$area.addEventListener(Io.pointerupEvent, this.onUpFunction, this.listenerOption)), Io.onContextmenuAvailable && window.addEventListener("contextmenu", this.onContextMenuFunc)
            }
            removeEvents() {
                if (!this.$target) return;
                const t = this.strictArea ? this.$area : window;
                Io.onWheelAvailable && t.removeEventListener("wheel", this.onWheelFunction, this.listenerOption), !this.strictArea && Io.onKeydownAvailable && window.removeEventListener("keydown", this.onKeyDownFunction), (Io.isTouch || this.useTouch) && (this.$area.removeEventListener(Io.pointerdownEvent, this.onDownFunction, this.listenerOption), this.$area.removeEventListener(Io.pointermoveEvent, this.onMoveFunction, this.listenerOption), this.$area.removeEventListener(Io.pointerupEvent, this.onUpFunction, this.listenerOption)), Io.onContextmenuAvailable && window.removeEventListener("contextmenu", this.onContextMenuFunc)
            }
            getDownX(t) {
                return Io.isTouch ? t.changedTouches[0].pageX : t.pageX
            }
            getDownY(t) {
                return Io.isTouch ? t.changedTouches[0].pageY : t.pageY
            }
            getDownPos(t) {
                return "vertical" === this.direction ? this.getDownY(t) : this.getDownX(t)
            }
            onWheel(t) {
                if (this.canceller()) return;
                t.preventDefault();
                let e = 0;
                e = "horizontal" === this.direction ? Math.abs(t.deltaY) >= Math.abs(t.deltaX) ? t.deltaY : t.deltaX : t.deltaY;
                const n = e;
                this.addTargetScroll(n)
            }
            onKeyDown(t) {
                if (this.canceller()) return;
                const e = t.code;
                "ArrowUp" === e ? this.addTargetScroll(-500) : "ArrowDown" === e && this.addTargetScroll(500)
            }
            onDown(t) {
                if (this.canceller()) return;
                this.isPointerDown = !0;
                const e = this.getDownPos(t);
                this.downPos = e, this.prevPos = e
            }
            onMove(t) {
                if (this.canceller()) return;
                if (!this.isPointerDown) return;
                t.preventDefault();
                const e = this.getDownPos(t);
                this.prevPos = this.downPos, this.downPos = e;
                const n = this.prevPos - this.downPos;
                this.addTargetScroll(n), this.isDragging = !0
            }
            onUp() {
                this.canceller() || this.isPointerDown && (this.acceleration = -this.k * (this.scroll - this.targetScroll), this.downPos = 0, this.prevPos = 0, this.isPointerDown = !1, this.isDragging = !1)
            }
            onContextMenu() {
                this.isPointerDown = !1
            }
            addTargetScroll(t) {
                this.targetScroll = Oo.constrain(this.targetScroll + t, 0, this.max)
            }
            update(t) {
                this.canceller() || (this.resizeMng.check() && this.resize(), this.velocity += this.acceleration, this.targetScroll += this.velocity, this.velocity *= .9, this.acceleration = 0, this.targetScroll = Oo.constrain(this.targetScroll, 0, this.max), this.tween.update(this.targetScroll, t), Math.abs(this.tween.velocity) < .01 && (this.tween.x = this.targetScroll), this.isAutoScrolling && (this.tween.x = this.targetScroll), this.scroll = this.tween.x, this.max > 0 ? this.progress = Oo.constrain(this.scroll / this.max, 0, 1) : this.progress = 0, this.progress < 1e-4 && (this.progress = 0))
            }
            reset() {
                this.targetScroll = 0, this.scroll = 0, this.velocity = 0, this.acceleration = 0, this.max = 0, this.progress = 0, this.tween.reset()
            }
            scrollBy(t, e = 1) {
                this.isAutoScrolling = !0, Wi.to(this, {
                    targetScroll: this.targetScroll + t,
                    duration: e,
                    onComplete: () => {
                        this.isAutoScrolling = !1
                    }
                })
            }
            scrollTop({
                duration: t = 1
            }) {
                this.isAutoScrolling = !0, Wi.to(this, {
                    targetScroll: 0,
                    duration: t,
                    onComplete: () => {
                        this.isAutoScrolling = !1
                    }
                })
            }
        }
        class zo extends Fo {
            constructor(t) {
                super("vertical", t)
            }
            resize() {
                if (!this.$target) return;
                const {
                    height: t
                } = this.$target.getBoundingClientRect(), {
                    height: e
                } = this.$target.parentNode.getBoundingClientRect();
                this.max = Math.floor(t - e)
            }
            update(t) {
                super.update(t), this.$target.style.transform = `translate3d(0, ${-this.scroll}px, 0)`
            }
        }

        function Bo(t) {
            return new Promise((e => {
                setTimeout((() => {
                    e()
                }), 1e3 * t)
            }))
        }
        const ko = {
            enabled: !1,
            files: {},
            add: function(t, e) {
                !1 !== this.enabled && (this.files[t] = e)
            },
            get: function(t) {
                if (!1 !== this.enabled) return this.files[t]
            },
            remove: function(t) {
                delete this.files[t]
            },
            clear: function() {
                this.files = {}
            }
        };
        class Ho {
            constructor(t, e, n) {
                const i = this;
                let r, a = !1,
                    s = 0,
                    o = 0;
                const l = [];
                this.onStart = void 0, this.onLoad = t, this.onProgress = e, this.onError = n, this.itemStart = function(t) {
                    o++, !1 === a && void 0 !== i.onStart && i.onStart(t, s, o), a = !0
                }, this.itemEnd = function(t) {
                    s++, void 0 !== i.onProgress && i.onProgress(t, s, o), s === o && (a = !1, void 0 !== i.onLoad && i.onLoad())
                }, this.itemError = function(t) {
                    void 0 !== i.onError && i.onError(t)
                }, this.resolveURL = function(t) {
                    return r ? r(t) : t
                }, this.setURLModifier = function(t) {
                    return r = t, this
                }, this.addHandler = function(t, e) {
                    return l.push(t, e), this
                }, this.removeHandler = function(t) {
                    const e = l.indexOf(t);
                    return -1 !== e && l.splice(e, 2), this
                }, this.getHandler = function(t) {
                    for (let e = 0, n = l.length; e < n; e += 2) {
                        const n = l[e],
                            i = l[e + 1];
                        if (n.global && (n.lastIndex = 0), n.test(t)) return i
                    }
                    return null
                }
            }
        }
        const Go = new Ho;
        class Vo {
            constructor(t) {
                this.manager = void 0 !== t ? t : Go, this.crossOrigin = "anonymous", this.withCredentials = !1, this.path = "", this.resourcePath = "", this.requestHeader = {}
            }
            load() {}
            loadAsync(t, e) {
                const n = this;
                return new Promise((function(i, r) {
                    n.load(t, i, e, r)
                }))
            }
            parse() {}
            setCrossOrigin(t) {
                return this.crossOrigin = t, this
            }
            setWithCredentials(t) {
                return this.withCredentials = t, this
            }
            setPath(t) {
                return this.path = t, this
            }
            setResourcePath(t) {
                return this.resourcePath = t, this
            }
            setRequestHeader(t) {
                return this.requestHeader = t, this
            }
        }

        function Wo(t) {
            for (let e = t.length - 1; e >= 0; --e)
                if (t[e] >= 65535) return !0;
            return !1
        }

        function Xo(t) {
            return document.createElementNS("http://www.w3.org/1999/xhtml", t)
        }

        function jo() {
            const t = Xo("canvas");
            return t.style.display = "block", t
        }
        Vo.DEFAULT_MATERIAL_NAME = "__DEFAULT", Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array;
        const qo = {};

        function Yo(t) {
            t in qo || (qo[t] = !0, console.warn(t))
        }
        class Ko extends Vo {
            constructor(t) {
                super(t)
            }
            load(t, e, n, i) {
                void 0 !== this.path && (t = this.path + t), t = this.manager.resolveURL(t);
                const r = this,
                    a = ko.get(t);
                if (void 0 !== a) return r.manager.itemStart(t), setTimeout((function() {
                    e && e(a), r.manager.itemEnd(t)
                }), 0), a;
                const s = Xo("img");

                function o() {
                    c(), ko.add(t, this), e && e(this), r.manager.itemEnd(t)
                }

                function l(e) {
                    c(), i && i(e), r.manager.itemError(t), r.manager.itemEnd(t)
                }

                function c() {
                    s.removeEventListener("load", o, !1), s.removeEventListener("error", l, !1)
                }
                return s.addEventListener("load", o, !1), s.addEventListener("error", l, !1), "data:" !== t.slice(0, 5) && void 0 !== this.crossOrigin && (s.crossOrigin = this.crossOrigin), r.manager.itemStart(t), s.src = t, s
            }
        }
        class Zo {
            addEventListener(t, e) {
                void 0 === this._listeners && (this._listeners = {});
                const n = this._listeners;
                void 0 === n[t] && (n[t] = []), -1 === n[t].indexOf(e) && n[t].push(e)
            }
            hasEventListener(t, e) {
                if (void 0 === this._listeners) return !1;
                const n = this._listeners;
                return void 0 !== n[t] && -1 !== n[t].indexOf(e)
            }
            removeEventListener(t, e) {
                if (void 0 === this._listeners) return;
                const n = this._listeners[t];
                if (void 0 !== n) {
                    const t = n.indexOf(e); - 1 !== t && n.splice(t, 1)
                }
            }
            dispatchEvent(t) {
                if (void 0 === this._listeners) return;
                const e = this._listeners[t.type];
                if (void 0 !== e) {
                    t.target = this;
                    const n = e.slice(0);
                    for (let e = 0, i = n.length; e < i; e++) n[e].call(this, t);
                    t.target = null
                }
            }
        }
        const $o = 1,
            Jo = 2,
            Qo = 3,
            tl = 100,
            el = 0,
            nl = 1,
            il = 2,
            rl = 0,
            al = 1,
            sl = 2,
            ol = 3,
            ll = 4,
            cl = 5,
            ul = 301,
            hl = 302,
            dl = 306,
            pl = 1e3,
            fl = 1001,
            ml = 1002,
            gl = 1003,
            _l = 1005,
            vl = 1006,
            xl = 1008,
            yl = 1009,
            Ml = 1012,
            Sl = 1014,
            El = 1015,
            Tl = 1016,
            bl = 1020,
            wl = 1023,
            Al = 1026,
            Rl = 1027,
            Cl = 33776,
            Ll = 33777,
            Pl = 33778,
            Ul = 33779,
            Dl = 36492,
            Il = 3001,
            Ol = "srgb",
            Nl = "srgb-linear",
            Fl = "display-p3",
            zl = 7680,
            Bl = "300 es",
            kl = 1035,
            Hl = 2e3,
            Gl = 2001,
            Vl = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0a", "0b", "0c", "0d", "0e", "0f", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "1a", "1b", "1c", "1d", "1e", "1f", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2a", "2b", "2c", "2d", "2e", "2f", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "3a", "3b", "3c", "3d", "3e", "3f", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4a", "4b", "4c", "4d", "4e", "4f", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5a", "5b", "5c", "5d", "5e", "5f", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6a", "6b", "6c", "6d", "6e", "6f", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "7a", "7b", "7c", "7d", "7e", "7f", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "8a", "8b", "8c", "8d", "8e", "8f", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "9a", "9b", "9c", "9d", "9e", "9f", "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "aa", "ab", "ac", "ad", "ae", "af", "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "ba", "bb", "bc", "bd", "be", "bf", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "ca", "cb", "cc", "cd", "ce", "cf", "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "da", "db", "dc", "dd", "de", "df", "e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "ea", "eb", "ec", "ed", "ee", "ef", "f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "fa", "fb", "fc", "fd", "fe", "ff"],
            Wl = Math.PI / 180,
            Xl = 180 / Math.PI;

        function jl() {
            const t = 4294967295 * Math.random() | 0,
                e = 4294967295 * Math.random() | 0,
                n = 4294967295 * Math.random() | 0,
                i = 4294967295 * Math.random() | 0;
            return (Vl[255 & t] + Vl[t >> 8 & 255] + Vl[t >> 16 & 255] + Vl[t >> 24 & 255] + "-" + Vl[255 & e] + Vl[e >> 8 & 255] + "-" + Vl[e >> 16 & 15 | 64] + Vl[e >> 24 & 255] + "-" + Vl[63 & n | 128] + Vl[n >> 8 & 255] + "-" + Vl[n >> 16 & 255] + Vl[n >> 24 & 255] + Vl[255 & i] + Vl[i >> 8 & 255] + Vl[i >> 16 & 255] + Vl[i >> 24 & 255]).toLowerCase()
        }

        function ql(t, e, n) {
            return Math.max(e, Math.min(n, t))
        }

        function Yl(t, e, n) {
            return (1 - n) * t + n * e
        }

        function Kl(t) {
            return 0 == (t & t - 1) && 0 !== t
        }

        function Zl(t) {
            return Math.pow(2, Math.floor(Math.log(t) / Math.LN2))
        }

        function $l(t, e) {
            switch (e.constructor) {
                case Float32Array:
                    return t;
                case Uint32Array:
                    return t / 4294967295;
                case Uint16Array:
                    return t / 65535;
                case Uint8Array:
                    return t / 255;
                case Int32Array:
                    return Math.max(t / 2147483647, -1);
                case Int16Array:
                    return Math.max(t / 32767, -1);
                case Int8Array:
                    return Math.max(t / 127, -1);
                default:
                    throw new Error("Invalid component type.")
            }
        }

        function Jl(t, e) {
            switch (e.constructor) {
                case Float32Array:
                    return t;
                case Uint32Array:
                    return Math.round(4294967295 * t);
                case Uint16Array:
                    return Math.round(65535 * t);
                case Uint8Array:
                    return Math.round(255 * t);
                case Int32Array:
                    return Math.round(2147483647 * t);
                case Int16Array:
                    return Math.round(32767 * t);
                case Int8Array:
                    return Math.round(127 * t);
                default:
                    throw new Error("Invalid component type.")
            }
        }
        class Ql {
            constructor(t = 0, e = 0) {
                Ql.prototype.isVector2 = !0, this.x = t, this.y = e
            }
            get width() {
                return this.x
            }
            set width(t) {
                this.x = t
            }
            get height() {
                return this.y
            }
            set height(t) {
                this.y = t
            }
            set(t, e) {
                return this.x = t, this.y = e, this
            }
            setScalar(t) {
                return this.x = t, this.y = t, this
            }
            setX(t) {
                return this.x = t, this
            }
            setY(t) {
                return this.y = t, this
            }
            setComponent(t, e) {
                switch (t) {
                    case 0:
                        this.x = e;
                        break;
                    case 1:
                        this.y = e;
                        break;
                    default:
                        throw new Error("index is out of range: " + t)
                }
                return this
            }
            getComponent(t) {
                switch (t) {
                    case 0:
                        return this.x;
                    case 1:
                        return this.y;
                    default:
                        throw new Error("index is out of range: " + t)
                }
            }
            clone() {
                return new this.constructor(this.x, this.y)
            }
            copy(t) {
                return this.x = t.x, this.y = t.y, this
            }
            add(t) {
                return this.x += t.x, this.y += t.y, this
            }
            addScalar(t) {
                return this.x += t, this.y += t, this
            }
            addVectors(t, e) {
                return this.x = t.x + e.x, this.y = t.y + e.y, this
            }
            addScaledVector(t, e) {
                return this.x += t.x * e, this.y += t.y * e, this
            }
            sub(t) {
                return this.x -= t.x, this.y -= t.y, this
            }
            subScalar(t) {
                return this.x -= t, this.y -= t, this
            }
            subVectors(t, e) {
                return this.x = t.x - e.x, this.y = t.y - e.y, this
            }
            multiply(t) {
                return this.x *= t.x, this.y *= t.y, this
            }
            multiplyScalar(t) {
                return this.x *= t, this.y *= t, this
            }
            divide(t) {
                return this.x /= t.x, this.y /= t.y, this
            }
            divideScalar(t) {
                return this.multiplyScalar(1 / t)
            }
            applyMatrix3(t) {
                const e = this.x,
                    n = this.y,
                    i = t.elements;
                return this.x = i[0] * e + i[3] * n + i[6], this.y = i[1] * e + i[4] * n + i[7], this
            }
            min(t) {
                return this.x = Math.min(this.x, t.x), this.y = Math.min(this.y, t.y), this
            }
            max(t) {
                return this.x = Math.max(this.x, t.x), this.y = Math.max(this.y, t.y), this
            }
            clamp(t, e) {
                return this.x = Math.max(t.x, Math.min(e.x, this.x)), this.y = Math.max(t.y, Math.min(e.y, this.y)), this
            }
            clampScalar(t, e) {
                return this.x = Math.max(t, Math.min(e, this.x)), this.y = Math.max(t, Math.min(e, this.y)), this
            }
            clampLength(t, e) {
                const n = this.length();
                return this.divideScalar(n || 1).multiplyScalar(Math.max(t, Math.min(e, n)))
            }
            floor() {
                return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this
            }
            ceil() {
                return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this
            }
            round() {
                return this.x = Math.round(this.x), this.y = Math.round(this.y), this
            }
            roundToZero() {
                return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this
            }
            negate() {
                return this.x = -this.x, this.y = -this.y, this
            }
            dot(t) {
                return this.x * t.x + this.y * t.y
            }
            cross(t) {
                return this.x * t.y - this.y * t.x
            }
            lengthSq() {
                return this.x * this.x + this.y * this.y
            }
            length() {
                return Math.sqrt(this.x * this.x + this.y * this.y)
            }
            manhattanLength() {
                return Math.abs(this.x) + Math.abs(this.y)
            }
            normalize() {
                return this.divideScalar(this.length() || 1)
            }
            angle() {
                return Math.atan2(-this.y, -this.x) + Math.PI
            }
            angleTo(t) {
                const e = Math.sqrt(this.lengthSq() * t.lengthSq());
                if (0 === e) return Math.PI / 2;
                const n = this.dot(t) / e;
                return Math.acos(ql(n, -1, 1))
            }
            distanceTo(t) {
                return Math.sqrt(this.distanceToSquared(t))
            }
            distanceToSquared(t) {
                const e = this.x - t.x,
                    n = this.y - t.y;
                return e * e + n * n
            }
            manhattanDistanceTo(t) {
                return Math.abs(this.x - t.x) + Math.abs(this.y - t.y)
            }
            setLength(t) {
                return this.normalize().multiplyScalar(t)
            }
            lerp(t, e) {
                return this.x += (t.x - this.x) * e, this.y += (t.y - this.y) * e, this
            }
            lerpVectors(t, e, n) {
                return this.x = t.x + (e.x - t.x) * n, this.y = t.y + (e.y - t.y) * n, this
            }
            equals(t) {
                return t.x === this.x && t.y === this.y
            }
            fromArray(t, e = 0) {
                return this.x = t[e], this.y = t[e + 1], this
            }
            toArray(t = [], e = 0) {
                return t[e] = this.x, t[e + 1] = this.y, t
            }
            fromBufferAttribute(t, e) {
                return this.x = t.getX(e), this.y = t.getY(e), this
            }
            rotateAround(t, e) {
                const n = Math.cos(e),
                    i = Math.sin(e),
                    r = this.x - t.x,
                    a = this.y - t.y;
                return this.x = r * n - a * i + t.x, this.y = r * i + a * n + t.y, this
            }
            random() {
                return this.x = Math.random(), this.y = Math.random(), this
            }*[Symbol.iterator]() {
                yield this.x, yield this.y
            }
        }
        class tc {
            constructor(t, e, n, i, r, a, s, o, l) {
                tc.prototype.isMatrix3 = !0, this.elements = [1, 0, 0, 0, 1, 0, 0, 0, 1], void 0 !== t && this.set(t, e, n, i, r, a, s, o, l)
            }
            set(t, e, n, i, r, a, s, o, l) {
                const c = this.elements;
                return c[0] = t, c[1] = i, c[2] = s, c[3] = e, c[4] = r, c[5] = o, c[6] = n, c[7] = a, c[8] = l, this
            }
            identity() {
                return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1), this
            }
            copy(t) {
                const e = this.elements,
                    n = t.elements;
                return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e[4] = n[4], e[5] = n[5], e[6] = n[6], e[7] = n[7], e[8] = n[8], this
            }
            extractBasis(t, e, n) {
                return t.setFromMatrix3Column(this, 0), e.setFromMatrix3Column(this, 1), n.setFromMatrix3Column(this, 2), this
            }
            setFromMatrix4(t) {
                const e = t.elements;
                return this.set(e[0], e[4], e[8], e[1], e[5], e[9], e[2], e[6], e[10]), this
            }
            multiply(t) {
                return this.multiplyMatrices(this, t)
            }
            premultiply(t) {
                return this.multiplyMatrices(t, this)
            }
            multiplyMatrices(t, e) {
                const n = t.elements,
                    i = e.elements,
                    r = this.elements,
                    a = n[0],
                    s = n[3],
                    o = n[6],
                    l = n[1],
                    c = n[4],
                    u = n[7],
                    h = n[2],
                    d = n[5],
                    p = n[8],
                    f = i[0],
                    m = i[3],
                    g = i[6],
                    _ = i[1],
                    v = i[4],
                    x = i[7],
                    y = i[2],
                    M = i[5],
                    S = i[8];
                return r[0] = a * f + s * _ + o * y, r[3] = a * m + s * v + o * M, r[6] = a * g + s * x + o * S, r[1] = l * f + c * _ + u * y, r[4] = l * m + c * v + u * M, r[7] = l * g + c * x + u * S, r[2] = h * f + d * _ + p * y, r[5] = h * m + d * v + p * M, r[8] = h * g + d * x + p * S, this
            }
            multiplyScalar(t) {
                const e = this.elements;
                return e[0] *= t, e[3] *= t, e[6] *= t, e[1] *= t, e[4] *= t, e[7] *= t, e[2] *= t, e[5] *= t, e[8] *= t, this
            }
            determinant() {
                const t = this.elements,
                    e = t[0],
                    n = t[1],
                    i = t[2],
                    r = t[3],
                    a = t[4],
                    s = t[5],
                    o = t[6],
                    l = t[7],
                    c = t[8];
                return e * a * c - e * s * l - n * r * c + n * s * o + i * r * l - i * a * o
            }
            invert() {
                const t = this.elements,
                    e = t[0],
                    n = t[1],
                    i = t[2],
                    r = t[3],
                    a = t[4],
                    s = t[5],
                    o = t[6],
                    l = t[7],
                    c = t[8],
                    u = c * a - s * l,
                    h = s * o - c * r,
                    d = l * r - a * o,
                    p = e * u + n * h + i * d;
                if (0 === p) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
                const f = 1 / p;
                return t[0] = u * f, t[1] = (i * l - c * n) * f, t[2] = (s * n - i * a) * f, t[3] = h * f, t[4] = (c * e - i * o) * f, t[5] = (i * r - s * e) * f, t[6] = d * f, t[7] = (n * o - l * e) * f, t[8] = (a * e - n * r) * f, this
            }
            transpose() {
                let t;
                const e = this.elements;
                return t = e[1], e[1] = e[3], e[3] = t, t = e[2], e[2] = e[6], e[6] = t, t = e[5], e[5] = e[7], e[7] = t, this
            }
            getNormalMatrix(t) {
                return this.setFromMatrix4(t).invert().transpose()
            }
            transposeIntoArray(t) {
                const e = this.elements;
                return t[0] = e[0], t[1] = e[3], t[2] = e[6], t[3] = e[1], t[4] = e[4], t[5] = e[7], t[6] = e[2], t[7] = e[5], t[8] = e[8], this
            }
            setUvTransform(t, e, n, i, r, a, s) {
                const o = Math.cos(r),
                    l = Math.sin(r);
                return this.set(n * o, n * l, -n * (o * a + l * s) + a + t, -i * l, i * o, -i * (-l * a + o * s) + s + e, 0, 0, 1), this
            }
            scale(t, e) {
                return this.premultiply(ec.makeScale(t, e)), this
            }
            rotate(t) {
                return this.premultiply(ec.makeRotation(-t)), this
            }
            translate(t, e) {
                return this.premultiply(ec.makeTranslation(t, e)), this
            }
            makeTranslation(t, e) {
                return t.isVector2 ? this.set(1, 0, t.x, 0, 1, t.y, 0, 0, 1) : this.set(1, 0, t, 0, 1, e, 0, 0, 1), this
            }
            makeRotation(t) {
                const e = Math.cos(t),
                    n = Math.sin(t);
                return this.set(e, -n, 0, n, e, 0, 0, 0, 1), this
            }
            makeScale(t, e) {
                return this.set(t, 0, 0, 0, e, 0, 0, 0, 1), this
            }
            equals(t) {
                const e = this.elements,
                    n = t.elements;
                for (let t = 0; t < 9; t++)
                    if (e[t] !== n[t]) return !1;
                return !0
            }
            fromArray(t, e = 0) {
                for (let n = 0; n < 9; n++) this.elements[n] = t[n + e];
                return this
            }
            toArray(t = [], e = 0) {
                const n = this.elements;
                return t[e] = n[0], t[e + 1] = n[1], t[e + 2] = n[2], t[e + 3] = n[3], t[e + 4] = n[4], t[e + 5] = n[5], t[e + 6] = n[6], t[e + 7] = n[7], t[e + 8] = n[8], t
            }
            clone() {
                return (new this.constructor).fromArray(this.elements)
            }
        }
        const ec = new tc;

        function nc(t) {
            return t < .04045 ? .0773993808 * t : Math.pow(.9478672986 * t + .0521327014, 2.4)
        }

        function ic(t) {
            return t < .0031308 ? 12.92 * t : 1.055 * Math.pow(t, .41666) - .055
        }
        const rc = (new tc).fromArray([.8224621, .0331941, .0170827, .177538, .9668058, .0723974, -1e-7, 1e-7, .9105199]),
            ac = (new tc).fromArray([1.2249401, -.0420569, -.0196376, -.2249404, 1.0420571, -.0786361, 1e-7, 0, 1.0982735]),
            sc = {
                [Nl]: t => t,
                [Ol]: t => t.convertSRGBToLinear(),
                [Fl]: function(t) {
                    return t.convertSRGBToLinear().applyMatrix3(ac)
                }
            },
            oc = {
                [Nl]: t => t,
                [Ol]: t => t.convertLinearToSRGB(),
                [Fl]: function(t) {
                    return t.applyMatrix3(rc).convertLinearToSRGB()
                }
            },
            lc = {
                enabled: !0,
                get legacyMode() {
                    return console.warn("THREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150."), !this.enabled
                },
                set legacyMode(t) {
                    console.warn("THREE.ColorManagement: .legacyMode=false renamed to .enabled=true in r150."), this.enabled = !t
                },
                get workingColorSpace() {
                    return Nl
                },
                set workingColorSpace(t) {
                    console.warn("THREE.ColorManagement: .workingColorSpace is readonly.")
                },
                convert: function(t, e, n) {
                    if (!1 === this.enabled || e === n || !e || !n) return t;
                    const i = sc[e],
                        r = oc[n];
                    if (void 0 === i || void 0 === r) throw new Error(`Unsupported color space conversion, "${e}" to "${n}".`);
                    return r(i(t))
                },
                fromWorkingColorSpace: function(t, e) {
                    return this.convert(t, this.workingColorSpace, e)
                },
                toWorkingColorSpace: function(t, e) {
                    return this.convert(t, e, this.workingColorSpace)
                }
            };
        let cc;
        class uc {
            static getDataURL(t) {
                if (/^data:/i.test(t.src)) return t.src;
                if ("undefined" == typeof HTMLCanvasElement) return t.src;
                let e;
                if (t instanceof HTMLCanvasElement) e = t;
                else {
                    void 0 === cc && (cc = Xo("canvas")), cc.width = t.width, cc.height = t.height;
                    const n = cc.getContext("2d");
                    t instanceof ImageData ? n.putImageData(t, 0, 0) : n.drawImage(t, 0, 0, t.width, t.height), e = cc
                }
                return e.width > 2048 || e.height > 2048 ? (console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons", t), e.toDataURL("image/jpeg", .6)) : e.toDataURL("image/png")
            }
            static sRGBToLinear(t) {
                if ("undefined" != typeof HTMLImageElement && t instanceof HTMLImageElement || "undefined" != typeof HTMLCanvasElement && t instanceof HTMLCanvasElement || "undefined" != typeof ImageBitmap && t instanceof ImageBitmap) {
                    const e = Xo("canvas");
                    e.width = t.width, e.height = t.height;
                    const n = e.getContext("2d");
                    n.drawImage(t, 0, 0, t.width, t.height);
                    const i = n.getImageData(0, 0, t.width, t.height),
                        r = i.data;
                    for (let t = 0; t < r.length; t++) r[t] = 255 * nc(r[t] / 255);
                    return n.putImageData(i, 0, 0), e
                }
                if (t.data) {
                    const e = t.data.slice(0);
                    for (let t = 0; t < e.length; t++) e instanceof Uint8Array || e instanceof Uint8ClampedArray ? e[t] = Math.floor(255 * nc(e[t] / 255)) : e[t] = nc(e[t]);
                    return {
                        data: e,
                        width: t.width,
                        height: t.height
                    }
                }
                return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."), t
            }
        }
        let hc = 0;
        class dc {
            constructor(t = null) {
                this.isSource = !0, Object.defineProperty(this, "id", {
                    value: hc++
                }), this.uuid = jl(), this.data = t, this.version = 0
            }
            set needsUpdate(t) {
                !0 === t && this.version++
            }
            toJSON(t) {
                const e = void 0 === t || "string" == typeof t;
                if (!e && void 0 !== t.images[this.uuid]) return t.images[this.uuid];
                const n = {
                        uuid: this.uuid,
                        url: ""
                    },
                    i = this.data;
                if (null !== i) {
                    let t;
                    if (Array.isArray(i)) {
                        t = [];
                        for (let e = 0, n = i.length; e < n; e++) i[e].isDataTexture ? t.push(pc(i[e].image)) : t.push(pc(i[e]))
                    } else t = pc(i);
                    n.url = t
                }
                return e || (t.images[this.uuid] = n), n
            }
        }

        function pc(t) {
            return "undefined" != typeof HTMLImageElement && t instanceof HTMLImageElement || "undefined" != typeof HTMLCanvasElement && t instanceof HTMLCanvasElement || "undefined" != typeof ImageBitmap && t instanceof ImageBitmap ? uc.getDataURL(t) : t.data ? {
                data: Array.from(t.data),
                width: t.width,
                height: t.height,
                type: t.data.constructor.name
            } : (console.warn("THREE.Texture: Unable to serialize Texture."), {})
        }
        let fc = 0;
        class mc extends Zo {
            constructor(t = mc.DEFAULT_IMAGE, e = mc.DEFAULT_MAPPING, n = 1001, i = 1001, r = 1006, a = 1008, s = 1023, o = 1009, l = mc.DEFAULT_ANISOTROPY, c = "") {
                super(), this.isTexture = !0, Object.defineProperty(this, "id", {
                    value: fc++
                }), this.uuid = jl(), this.name = "", this.source = new dc(t), this.mipmaps = [], this.mapping = e, this.channel = 0, this.wrapS = n, this.wrapT = i, this.magFilter = r, this.minFilter = a, this.anisotropy = l, this.format = s, this.internalFormat = null, this.type = o, this.offset = new Ql(0, 0), this.repeat = new Ql(1, 1), this.center = new Ql(0, 0), this.rotation = 0, this.matrixAutoUpdate = !0, this.matrix = new tc, this.generateMipmaps = !0, this.premultiplyAlpha = !1, this.flipY = !0, this.unpackAlignment = 4, "string" == typeof c ? this.colorSpace = c : (Yo("THREE.Texture: Property .encoding has been replaced by .colorSpace."), this.colorSpace = c === Il ? Ol : ""), this.userData = {}, this.version = 0, this.onUpdate = null, this.isRenderTargetTexture = !1, this.needsPMREMUpdate = !1
            }
            get image() {
                return this.source.data
            }
            set image(t = null) {
                this.source.data = t
            }
            updateMatrix() {
                this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y)
            }
            clone() {
                return (new this.constructor).copy(this)
            }
            copy(t) {
                return this.name = t.name, this.source = t.source, this.mipmaps = t.mipmaps.slice(0), this.mapping = t.mapping, this.channel = t.channel, this.wrapS = t.wrapS, this.wrapT = t.wrapT, this.magFilter = t.magFilter, this.minFilter = t.minFilter, this.anisotropy = t.anisotropy, this.format = t.format, this.internalFormat = t.internalFormat, this.type = t.type, this.offset.copy(t.offset), this.repeat.copy(t.repeat), this.center.copy(t.center), this.rotation = t.rotation, this.matrixAutoUpdate = t.matrixAutoUpdate, this.matrix.copy(t.matrix), this.generateMipmaps = t.generateMipmaps, this.premultiplyAlpha = t.premultiplyAlpha, this.flipY = t.flipY, this.unpackAlignment = t.unpackAlignment, this.colorSpace = t.colorSpace, this.userData = JSON.parse(JSON.stringify(t.userData)), this.needsUpdate = !0, this
            }
            toJSON(t) {
                const e = void 0 === t || "string" == typeof t;
                if (!e && void 0 !== t.textures[this.uuid]) return t.textures[this.uuid];
                const n = {
                    metadata: {
                        version: 4.6,
                        type: "Texture",
                        generator: "Texture.toJSON"
                    },
                    uuid: this.uuid,
                    name: this.name,
                    image: this.source.toJSON(t).uuid,
                    mapping: this.mapping,
                    channel: this.channel,
                    repeat: [this.repeat.x, this.repeat.y],
                    offset: [this.offset.x, this.offset.y],
                    center: [this.center.x, this.center.y],
                    rotation: this.rotation,
                    wrap: [this.wrapS, this.wrapT],
                    format: this.format,
                    internalFormat: this.internalFormat,
                    type: this.type,
                    colorSpace: this.colorSpace,
                    minFilter: this.minFilter,
                    magFilter: this.magFilter,
                    anisotropy: this.anisotropy,
                    flipY: this.flipY,
                    generateMipmaps: this.generateMipmaps,
                    premultiplyAlpha: this.premultiplyAlpha,
                    unpackAlignment: this.unpackAlignment
                };
                return Object.keys(this.userData).length > 0 && (n.userData = this.userData), e || (t.textures[this.uuid] = n), n
            }
            dispose() {
                this.dispatchEvent({
                    type: "dispose"
                })
            }
            transformUv(t) {
                if (300 !== this.mapping) return t;
                if (t.applyMatrix3(this.matrix), t.x < 0 || t.x > 1) switch (this.wrapS) {
                    case pl:
                        t.x = t.x - Math.floor(t.x);
                        break;
                    case fl:
                        t.x = t.x < 0 ? 0 : 1;
                        break;
                    case ml:
                        1 === Math.abs(Math.floor(t.x) % 2) ? t.x = Math.ceil(t.x) - t.x : t.x = t.x - Math.floor(t.x)
                }
                if (t.y < 0 || t.y > 1) switch (this.wrapT) {
                    case pl:
                        t.y = t.y - Math.floor(t.y);
                        break;
                    case fl:
                        t.y = t.y < 0 ? 0 : 1;
                        break;
                    case ml:
                        1 === Math.abs(Math.floor(t.y) % 2) ? t.y = Math.ceil(t.y) - t.y : t.y = t.y - Math.floor(t.y)
                }
                return this.flipY && (t.y = 1 - t.y), t
            }
            set needsUpdate(t) {
                !0 === t && (this.version++, this.source.needsUpdate = !0)
            }
            get encoding() {
                return Yo("THREE.Texture: Property .encoding has been replaced by .colorSpace."), this.colorSpace === Ol ? Il : 3e3
            }
            set encoding(t) {
                Yo("THREE.Texture: Property .encoding has been replaced by .colorSpace."), this.colorSpace = t === Il ? Ol : ""
            }
        }
        mc.DEFAULT_IMAGE = null, mc.DEFAULT_MAPPING = 300, mc.DEFAULT_ANISOTROPY = 1;
        class gc extends Vo {
            constructor(t) {
                super(t)
            }
            load(t, e, n, i) {
                const r = new mc,
                    a = new Ko(this.manager);
                return a.setCrossOrigin(this.crossOrigin), a.setPath(this.path), a.load(t, (function(t) {
                    r.image = t, r.needsUpdate = !0, void 0 !== e && e(r)
                }), n, i), r
            }
        }
        const _c = {
                aliceblue: 15792383,
                antiquewhite: 16444375,
                aqua: 65535,
                aquamarine: 8388564,
                azure: 15794175,
                beige: 16119260,
                bisque: 16770244,
                black: 0,
                blanchedalmond: 16772045,
                blue: 255,
                blueviolet: 9055202,
                brown: 10824234,
                burlywood: 14596231,
                cadetblue: 6266528,
                chartreuse: 8388352,
                chocolate: 13789470,
                coral: 16744272,
                cornflowerblue: 6591981,
                cornsilk: 16775388,
                crimson: 14423100,
                cyan: 65535,
                darkblue: 139,
                darkcyan: 35723,
                darkgoldenrod: 12092939,
                darkgray: 11119017,
                darkgreen: 25600,
                darkgrey: 11119017,
                darkkhaki: 12433259,
                darkmagenta: 9109643,
                darkolivegreen: 5597999,
                darkorange: 16747520,
                darkorchid: 10040012,
                darkred: 9109504,
                darksalmon: 15308410,
                darkseagreen: 9419919,
                darkslateblue: 4734347,
                darkslategray: 3100495,
                darkslategrey: 3100495,
                darkturquoise: 52945,
                darkviolet: 9699539,
                deeppink: 16716947,
                deepskyblue: 49151,
                dimgray: 6908265,
                dimgrey: 6908265,
                dodgerblue: 2003199,
                firebrick: 11674146,
                floralwhite: 16775920,
                forestgreen: 2263842,
                fuchsia: 16711935,
                gainsboro: 14474460,
                ghostwhite: 16316671,
                gold: 16766720,
                goldenrod: 14329120,
                gray: 8421504,
                green: 32768,
                greenyellow: 11403055,
                grey: 8421504,
                honeydew: 15794160,
                hotpink: 16738740,
                indianred: 13458524,
                indigo: 4915330,
                ivory: 16777200,
                khaki: 15787660,
                lavender: 15132410,
                lavenderblush: 16773365,
                lawngreen: 8190976,
                lemonchiffon: 16775885,
                lightblue: 11393254,
                lightcoral: 15761536,
                lightcyan: 14745599,
                lightgoldenrodyellow: 16448210,
                lightgray: 13882323,
                lightgreen: 9498256,
                lightgrey: 13882323,
                lightpink: 16758465,
                lightsalmon: 16752762,
                lightseagreen: 2142890,
                lightskyblue: 8900346,
                lightslategray: 7833753,
                lightslategrey: 7833753,
                lightsteelblue: 11584734,
                lightyellow: 16777184,
                lime: 65280,
                limegreen: 3329330,
                linen: 16445670,
                magenta: 16711935,
                maroon: 8388608,
                mediumaquamarine: 6737322,
                mediumblue: 205,
                mediumorchid: 12211667,
                mediumpurple: 9662683,
                mediumseagreen: 3978097,
                mediumslateblue: 8087790,
                mediumspringgreen: 64154,
                mediumturquoise: 4772300,
                mediumvioletred: 13047173,
                midnightblue: 1644912,
                mintcream: 16121850,
                mistyrose: 16770273,
                moccasin: 16770229,
                navajowhite: 16768685,
                navy: 128,
                oldlace: 16643558,
                olive: 8421376,
                olivedrab: 7048739,
                orange: 16753920,
                orangered: 16729344,
                orchid: 14315734,
                palegoldenrod: 15657130,
                palegreen: 10025880,
                paleturquoise: 11529966,
                palevioletred: 14381203,
                papayawhip: 16773077,
                peachpuff: 16767673,
                peru: 13468991,
                pink: 16761035,
                plum: 14524637,
                powderblue: 11591910,
                purple: 8388736,
                rebeccapurple: 6697881,
                red: 16711680,
                rosybrown: 12357519,
                royalblue: 4286945,
                saddlebrown: 9127187,
                salmon: 16416882,
                sandybrown: 16032864,
                seagreen: 3050327,
                seashell: 16774638,
                sienna: 10506797,
                silver: 12632256,
                skyblue: 8900331,
                slateblue: 6970061,
                slategray: 7372944,
                slategrey: 7372944,
                snow: 16775930,
                springgreen: 65407,
                steelblue: 4620980,
                tan: 13808780,
                teal: 32896,
                thistle: 14204888,
                tomato: 16737095,
                turquoise: 4251856,
                violet: 15631086,
                wheat: 16113331,
                white: 16777215,
                whitesmoke: 16119285,
                yellow: 16776960,
                yellowgreen: 10145074
            },
            vc = {
                h: 0,
                s: 0,
                l: 0
            },
            xc = {
                h: 0,
                s: 0,
                l: 0
            };

        function yc(t, e, n) {
            return n < 0 && (n += 1), n > 1 && (n -= 1), n < 1 / 6 ? t + 6 * (e - t) * n : n < .5 ? e : n < 2 / 3 ? t + 6 * (e - t) * (2 / 3 - n) : t
        }
        class Mc {
            constructor(t, e, n) {
                return this.isColor = !0, this.r = 1, this.g = 1, this.b = 1, this.set(t, e, n)
            }
            set(t, e, n) {
                if (void 0 === e && void 0 === n) {
                    const e = t;
                    e && e.isColor ? this.copy(e) : "number" == typeof e ? this.setHex(e) : "string" == typeof e && this.setStyle(e)
                } else this.setRGB(t, e, n);
                return this
            }
            setScalar(t) {
                return this.r = t, this.g = t, this.b = t, this
            }
            setHex(t, e = Ol) {
                return t = Math.floor(t), this.r = (t >> 16 & 255) / 255, this.g = (t >> 8 & 255) / 255, this.b = (255 & t) / 255, lc.toWorkingColorSpace(this, e), this
            }
            setRGB(t, e, n, i = lc.workingColorSpace) {
                return this.r = t, this.g = e, this.b = n, lc.toWorkingColorSpace(this, i), this
            }
            setHSL(t, e, n, i = lc.workingColorSpace) {
                if (t = function(t, e) {
                        return (t % e + e) % e
                    }(t, 1), e = ql(e, 0, 1), n = ql(n, 0, 1), 0 === e) this.r = this.g = this.b = n;
                else {
                    const i = n <= .5 ? n * (1 + e) : n + e - n * e,
                        r = 2 * n - i;
                    this.r = yc(r, i, t + 1 / 3), this.g = yc(r, i, t), this.b = yc(r, i, t - 1 / 3)
                }
                return lc.toWorkingColorSpace(this, i), this
            }
            setStyle(t, e = Ol) {
                function n(e) {
                    void 0 !== e && parseFloat(e) < 1 && console.warn("THREE.Color: Alpha component of " + t + " will be ignored.")
                }
                let i;
                if (i = /^(\w+)\(([^\)]*)\)/.exec(t)) {
                    let r;
                    const a = i[1],
                        s = i[2];
                    switch (a) {
                        case "rgb":
                        case "rgba":
                            if (r = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(s)) return n(r[4]), this.setRGB(Math.min(255, parseInt(r[1], 10)) / 255, Math.min(255, parseInt(r[2], 10)) / 255, Math.min(255, parseInt(r[3], 10)) / 255, e);
                            if (r = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(s)) return n(r[4]), this.setRGB(Math.min(100, parseInt(r[1], 10)) / 100, Math.min(100, parseInt(r[2], 10)) / 100, Math.min(100, parseInt(r[3], 10)) / 100, e);
                            break;
                        case "hsl":
                        case "hsla":
                            if (r = /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(s)) return n(r[4]), this.setHSL(parseFloat(r[1]) / 360, parseFloat(r[2]) / 100, parseFloat(r[3]) / 100, e);
                            break;
                        default:
                            console.warn("THREE.Color: Unknown color model " + t)
                    }
                } else if (i = /^\#([A-Fa-f\d]+)$/.exec(t)) {
                    const n = i[1],
                        r = n.length;
                    if (3 === r) return this.setRGB(parseInt(n.charAt(0), 16) / 15, parseInt(n.charAt(1), 16) / 15, parseInt(n.charAt(2), 16) / 15, e);
                    if (6 === r) return this.setHex(parseInt(n, 16), e);
                    console.warn("THREE.Color: Invalid hex color " + t)
                } else if (t && t.length > 0) return this.setColorName(t, e);
                return this
            }
            setColorName(t, e = Ol) {
                const n = _c[t.toLowerCase()];
                return void 0 !== n ? this.setHex(n, e) : console.warn("THREE.Color: Unknown color " + t), this
            }
            clone() {
                return new this.constructor(this.r, this.g, this.b)
            }
            copy(t) {
                return this.r = t.r, this.g = t.g, this.b = t.b, this
            }
            copySRGBToLinear(t) {
                return this.r = nc(t.r), this.g = nc(t.g), this.b = nc(t.b), this
            }
            copyLinearToSRGB(t) {
                return this.r = ic(t.r), this.g = ic(t.g), this.b = ic(t.b), this
            }
            convertSRGBToLinear() {
                return this.copySRGBToLinear(this), this
            }
            convertLinearToSRGB() {
                return this.copyLinearToSRGB(this), this
            }
            getHex(t = Ol) {
                return lc.fromWorkingColorSpace(Sc.copy(this), t), 65536 * Math.round(ql(255 * Sc.r, 0, 255)) + 256 * Math.round(ql(255 * Sc.g, 0, 255)) + Math.round(ql(255 * Sc.b, 0, 255))
            }
            getHexString(t = Ol) {
                return ("000000" + this.getHex(t).toString(16)).slice(-6)
            }
            getHSL(t, e = lc.workingColorSpace) {
                lc.fromWorkingColorSpace(Sc.copy(this), e);
                const n = Sc.r,
                    i = Sc.g,
                    r = Sc.b,
                    a = Math.max(n, i, r),
                    s = Math.min(n, i, r);
                let o, l;
                const c = (s + a) / 2;
                if (s === a) o = 0, l = 0;
                else {
                    const t = a - s;
                    switch (l = c <= .5 ? t / (a + s) : t / (2 - a - s), a) {
                        case n:
                            o = (i - r) / t + (i < r ? 6 : 0);
                            break;
                        case i:
                            o = (r - n) / t + 2;
                            break;
                        case r:
                            o = (n - i) / t + 4
                    }
                    o /= 6
                }
                return t.h = o, t.s = l, t.l = c, t
            }
            getRGB(t, e = lc.workingColorSpace) {
                return lc.fromWorkingColorSpace(Sc.copy(this), e), t.r = Sc.r, t.g = Sc.g, t.b = Sc.b, t
            }
            getStyle(t = Ol) {
                lc.fromWorkingColorSpace(Sc.copy(this), t);
                const e = Sc.r,
                    n = Sc.g,
                    i = Sc.b;
                return t !== Ol ? `color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})` : `rgb(${Math.round(255*e)},${Math.round(255*n)},${Math.round(255*i)})`
            }
            offsetHSL(t, e, n) {
                return this.getHSL(vc), vc.h += t, vc.s += e, vc.l += n, this.setHSL(vc.h, vc.s, vc.l), this
            }
            add(t) {
                return this.r += t.r, this.g += t.g, this.b += t.b, this
            }
            addColors(t, e) {
                return this.r = t.r + e.r, this.g = t.g + e.g, this.b = t.b + e.b, this
            }
            addScalar(t) {
                return this.r += t, this.g += t, this.b += t, this
            }
            sub(t) {
                return this.r = Math.max(0, this.r - t.r), this.g = Math.max(0, this.g - t.g), this.b = Math.max(0, this.b - t.b), this
            }
            multiply(t) {
                return this.r *= t.r, this.g *= t.g, this.b *= t.b, this
            }
            multiplyScalar(t) {
                return this.r *= t, this.g *= t, this.b *= t, this
            }
            lerp(t, e) {
                return this.r += (t.r - this.r) * e, this.g += (t.g - this.g) * e, this.b += (t.b - this.b) * e, this
            }
            lerpColors(t, e, n) {
                return this.r = t.r + (e.r - t.r) * n, this.g = t.g + (e.g - t.g) * n, this.b = t.b + (e.b - t.b) * n, this
            }
            lerpHSL(t, e) {
                this.getHSL(vc), t.getHSL(xc);
                const n = Yl(vc.h, xc.h, e),
                    i = Yl(vc.s, xc.s, e),
                    r = Yl(vc.l, xc.l, e);
                return this.setHSL(n, i, r), this
            }
            setFromVector3(t) {
                return this.r = t.x, this.g = t.y, this.b = t.z, this
            }
            applyMatrix3(t) {
                const e = this.r,
                    n = this.g,
                    i = this.b,
                    r = t.elements;
                return this.r = r[0] * e + r[3] * n + r[6] * i, this.g = r[1] * e + r[4] * n + r[7] * i, this.b = r[2] * e + r[5] * n + r[8] * i, this
            }
            equals(t) {
                return t.r === this.r && t.g === this.g && t.b === this.b
            }
            fromArray(t, e = 0) {
                return this.r = t[e], this.g = t[e + 1], this.b = t[e + 2], this
            }
            toArray(t = [], e = 0) {
                return t[e] = this.r, t[e + 1] = this.g, t[e + 2] = this.b, t
            }
            fromBufferAttribute(t, e) {
                return this.r = t.getX(e), this.g = t.getY(e), this.b = t.getZ(e), this
            }
            toJSON() {
                return this.getHex()
            }*[Symbol.iterator]() {
                yield this.r, yield this.g, yield this.b
            }
        }
        const Sc = new Mc;
        Mc.NAMES = _c;
        const Ec = {
            width: 100,
            height: 100,
            halfWidth: 50,
            halfHeight: 50,
            sceneWidth: 2,
            sceneHeight: 2,
            dpr: 1,
            aspectRatio: 1
        };
        class Tc {
            constructor(t = 0, e = 0, n = 0, i = 1) {
                this.isQuaternion = !0, this._x = t, this._y = e, this._z = n, this._w = i
            }
            static slerpFlat(t, e, n, i, r, a, s) {
                let o = n[i + 0],
                    l = n[i + 1],
                    c = n[i + 2],
                    u = n[i + 3];
                const h = r[a + 0],
                    d = r[a + 1],
                    p = r[a + 2],
                    f = r[a + 3];
                if (0 === s) return t[e + 0] = o, t[e + 1] = l, t[e + 2] = c, void(t[e + 3] = u);
                if (1 === s) return t[e + 0] = h, t[e + 1] = d, t[e + 2] = p, void(t[e + 3] = f);
                if (u !== f || o !== h || l !== d || c !== p) {
                    let t = 1 - s;
                    const e = o * h + l * d + c * p + u * f,
                        n = e >= 0 ? 1 : -1,
                        i = 1 - e * e;
                    if (i > Number.EPSILON) {
                        const r = Math.sqrt(i),
                            a = Math.atan2(r, e * n);
                        t = Math.sin(t * a) / r, s = Math.sin(s * a) / r
                    }
                    const r = s * n;
                    if (o = o * t + h * r, l = l * t + d * r, c = c * t + p * r, u = u * t + f * r, t === 1 - s) {
                        const t = 1 / Math.sqrt(o * o + l * l + c * c + u * u);
                        o *= t, l *= t, c *= t, u *= t
                    }
                }
                t[e] = o, t[e + 1] = l, t[e + 2] = c, t[e + 3] = u
            }
            static multiplyQuaternionsFlat(t, e, n, i, r, a) {
                const s = n[i],
                    o = n[i + 1],
                    l = n[i + 2],
                    c = n[i + 3],
                    u = r[a],
                    h = r[a + 1],
                    d = r[a + 2],
                    p = r[a + 3];
                return t[e] = s * p + c * u + o * d - l * h, t[e + 1] = o * p + c * h + l * u - s * d, t[e + 2] = l * p + c * d + s * h - o * u, t[e + 3] = c * p - s * u - o * h - l * d, t
            }
            get x() {
                return this._x
            }
            set x(t) {
                this._x = t, this._onChangeCallback()
            }
            get y() {
                return this._y
            }
            set y(t) {
                this._y = t, this._onChangeCallback()
            }
            get z() {
                return this._z
            }
            set z(t) {
                this._z = t, this._onChangeCallback()
            }
            get w() {
                return this._w
            }
            set w(t) {
                this._w = t, this._onChangeCallback()
            }
            set(t, e, n, i) {
                return this._x = t, this._y = e, this._z = n, this._w = i, this._onChangeCallback(), this
            }
            clone() {
                return new this.constructor(this._x, this._y, this._z, this._w)
            }
            copy(t) {
                return this._x = t.x, this._y = t.y, this._z = t.z, this._w = t.w, this._onChangeCallback(), this
            }
            setFromEuler(t, e) {
                const n = t._x,
                    i = t._y,
                    r = t._z,
                    a = t._order,
                    s = Math.cos,
                    o = Math.sin,
                    l = s(n / 2),
                    c = s(i / 2),
                    u = s(r / 2),
                    h = o(n / 2),
                    d = o(i / 2),
                    p = o(r / 2);
                switch (a) {
                    case "XYZ":
                        this._x = h * c * u + l * d * p, this._y = l * d * u - h * c * p, this._z = l * c * p + h * d * u, this._w = l * c * u - h * d * p;
                        break;
                    case "YXZ":
                        this._x = h * c * u + l * d * p, this._y = l * d * u - h * c * p, this._z = l * c * p - h * d * u, this._w = l * c * u + h * d * p;
                        break;
                    case "ZXY":
                        this._x = h * c * u - l * d * p, this._y = l * d * u + h * c * p, this._z = l * c * p + h * d * u, this._w = l * c * u - h * d * p;
                        break;
                    case "ZYX":
                        this._x = h * c * u - l * d * p, this._y = l * d * u + h * c * p, this._z = l * c * p - h * d * u, this._w = l * c * u + h * d * p;
                        break;
                    case "YZX":
                        this._x = h * c * u + l * d * p, this._y = l * d * u + h * c * p, this._z = l * c * p - h * d * u, this._w = l * c * u - h * d * p;
                        break;
                    case "XZY":
                        this._x = h * c * u - l * d * p, this._y = l * d * u - h * c * p, this._z = l * c * p + h * d * u, this._w = l * c * u + h * d * p;
                        break;
                    default:
                        console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: " + a)
                }
                return !1 !== e && this._onChangeCallback(), this
            }
            setFromAxisAngle(t, e) {
                const n = e / 2,
                    i = Math.sin(n);
                return this._x = t.x * i, this._y = t.y * i, this._z = t.z * i, this._w = Math.cos(n), this._onChangeCallback(), this
            }
            setFromRotationMatrix(t) {
                const e = t.elements,
                    n = e[0],
                    i = e[4],
                    r = e[8],
                    a = e[1],
                    s = e[5],
                    o = e[9],
                    l = e[2],
                    c = e[6],
                    u = e[10],
                    h = n + s + u;
                if (h > 0) {
                    const t = .5 / Math.sqrt(h + 1);
                    this._w = .25 / t, this._x = (c - o) * t, this._y = (r - l) * t, this._z = (a - i) * t
                } else if (n > s && n > u) {
                    const t = 2 * Math.sqrt(1 + n - s - u);
                    this._w = (c - o) / t, this._x = .25 * t, this._y = (i + a) / t, this._z = (r + l) / t
                } else if (s > u) {
                    const t = 2 * Math.sqrt(1 + s - n - u);
                    this._w = (r - l) / t, this._x = (i + a) / t, this._y = .25 * t, this._z = (o + c) / t
                } else {
                    const t = 2 * Math.sqrt(1 + u - n - s);
                    this._w = (a - i) / t, this._x = (r + l) / t, this._y = (o + c) / t, this._z = .25 * t
                }
                return this._onChangeCallback(), this
            }
            setFromUnitVectors(t, e) {
                let n = t.dot(e) + 1;
                return n < Number.EPSILON ? (n = 0, Math.abs(t.x) > Math.abs(t.z) ? (this._x = -t.y, this._y = t.x, this._z = 0, this._w = n) : (this._x = 0, this._y = -t.z, this._z = t.y, this._w = n)) : (this._x = t.y * e.z - t.z * e.y, this._y = t.z * e.x - t.x * e.z, this._z = t.x * e.y - t.y * e.x, this._w = n), this.normalize()
            }
            angleTo(t) {
                return 2 * Math.acos(Math.abs(ql(this.dot(t), -1, 1)))
            }
            rotateTowards(t, e) {
                const n = this.angleTo(t);
                if (0 === n) return this;
                const i = Math.min(1, e / n);
                return this.slerp(t, i), this
            }
            identity() {
                return this.set(0, 0, 0, 1)
            }
            invert() {
                return this.conjugate()
            }
            conjugate() {
                return this._x *= -1, this._y *= -1, this._z *= -1, this._onChangeCallback(), this
            }
            dot(t) {
                return this._x * t._x + this._y * t._y + this._z * t._z + this._w * t._w
            }
            lengthSq() {
                return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w
            }
            length() {
                return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w)
            }
            normalize() {
                let t = this.length();
                return 0 === t ? (this._x = 0, this._y = 0, this._z = 0, this._w = 1) : (t = 1 / t, this._x = this._x * t, this._y = this._y * t, this._z = this._z * t, this._w = this._w * t), this._onChangeCallback(), this
            }
            multiply(t) {
                return this.multiplyQuaternions(this, t)
            }
            premultiply(t) {
                return this.multiplyQuaternions(t, this)
            }
            multiplyQuaternions(t, e) {
                const n = t._x,
                    i = t._y,
                    r = t._z,
                    a = t._w,
                    s = e._x,
                    o = e._y,
                    l = e._z,
                    c = e._w;
                return this._x = n * c + a * s + i * l - r * o, this._y = i * c + a * o + r * s - n * l, this._z = r * c + a * l + n * o - i * s, this._w = a * c - n * s - i * o - r * l, this._onChangeCallback(), this
            }
            slerp(t, e) {
                if (0 === e) return this;
                if (1 === e) return this.copy(t);
                const n = this._x,
                    i = this._y,
                    r = this._z,
                    a = this._w;
                let s = a * t._w + n * t._x + i * t._y + r * t._z;
                if (s < 0 ? (this._w = -t._w, this._x = -t._x, this._y = -t._y, this._z = -t._z, s = -s) : this.copy(t), s >= 1) return this._w = a, this._x = n, this._y = i, this._z = r, this;
                const o = 1 - s * s;
                if (o <= Number.EPSILON) {
                    const t = 1 - e;
                    return this._w = t * a + e * this._w, this._x = t * n + e * this._x, this._y = t * i + e * this._y, this._z = t * r + e * this._z, this.normalize(), this._onChangeCallback(), this
                }
                const l = Math.sqrt(o),
                    c = Math.atan2(l, s),
                    u = Math.sin((1 - e) * c) / l,
                    h = Math.sin(e * c) / l;
                return this._w = a * u + this._w * h, this._x = n * u + this._x * h, this._y = i * u + this._y * h, this._z = r * u + this._z * h, this._onChangeCallback(), this
            }
            slerpQuaternions(t, e, n) {
                return this.copy(t).slerp(e, n)
            }
            random() {
                const t = Math.random(),
                    e = Math.sqrt(1 - t),
                    n = Math.sqrt(t),
                    i = 2 * Math.PI * Math.random(),
                    r = 2 * Math.PI * Math.random();
                return this.set(e * Math.cos(i), n * Math.sin(r), n * Math.cos(r), e * Math.sin(i))
            }
            equals(t) {
                return t._x === this._x && t._y === this._y && t._z === this._z && t._w === this._w
            }
            fromArray(t, e = 0) {
                return this._x = t[e], this._y = t[e + 1], this._z = t[e + 2], this._w = t[e + 3], this._onChangeCallback(), this
            }
            toArray(t = [], e = 0) {
                return t[e] = this._x, t[e + 1] = this._y, t[e + 2] = this._z, t[e + 3] = this._w, t
            }
            fromBufferAttribute(t, e) {
                return this._x = t.getX(e), this._y = t.getY(e), this._z = t.getZ(e), this._w = t.getW(e), this
            }
            toJSON() {
                return this.toArray()
            }
            _onChange(t) {
                return this._onChangeCallback = t, this
            }
            _onChangeCallback() {}*[Symbol.iterator]() {
                yield this._x, yield this._y, yield this._z, yield this._w
            }
        }
        class bc {
            constructor(t = 0, e = 0, n = 0) {
                bc.prototype.isVector3 = !0, this.x = t, this.y = e, this.z = n
            }
            set(t, e, n) {
                return void 0 === n && (n = this.z), this.x = t, this.y = e, this.z = n, this
            }
            setScalar(t) {
                return this.x = t, this.y = t, this.z = t, this
            }
            setX(t) {
                return this.x = t, this
            }
            setY(t) {
                return this.y = t, this
            }
            setZ(t) {
                return this.z = t, this
            }
            setComponent(t, e) {
                switch (t) {
                    case 0:
                        this.x = e;
                        break;
                    case 1:
                        this.y = e;
                        break;
                    case 2:
                        this.z = e;
                        break;
                    default:
                        throw new Error("index is out of range: " + t)
                }
                return this
            }
            getComponent(t) {
                switch (t) {
                    case 0:
                        return this.x;
                    case 1:
                        return this.y;
                    case 2:
                        return this.z;
                    default:
                        throw new Error("index is out of range: " + t)
                }
            }
            clone() {
                return new this.constructor(this.x, this.y, this.z)
            }
            copy(t) {
                return this.x = t.x, this.y = t.y, this.z = t.z, this
            }
            add(t) {
                return this.x += t.x, this.y += t.y, this.z += t.z, this
            }
            addScalar(t) {
                return this.x += t, this.y += t, this.z += t, this
            }
            addVectors(t, e) {
                return this.x = t.x + e.x, this.y = t.y + e.y, this.z = t.z + e.z, this
            }
            addScaledVector(t, e) {
                return this.x += t.x * e, this.y += t.y * e, this.z += t.z * e, this
            }
            sub(t) {
                return this.x -= t.x, this.y -= t.y, this.z -= t.z, this
            }
            subScalar(t) {
                return this.x -= t, this.y -= t, this.z -= t, this
            }
            subVectors(t, e) {
                return this.x = t.x - e.x, this.y = t.y - e.y, this.z = t.z - e.z, this
            }
            multiply(t) {
                return this.x *= t.x, this.y *= t.y, this.z *= t.z, this
            }
            multiplyScalar(t) {
                return this.x *= t, this.y *= t, this.z *= t, this
            }
            multiplyVectors(t, e) {
                return this.x = t.x * e.x, this.y = t.y * e.y, this.z = t.z * e.z, this
            }
            applyEuler(t) {
                return this.applyQuaternion(Ac.setFromEuler(t))
            }
            applyAxisAngle(t, e) {
                return this.applyQuaternion(Ac.setFromAxisAngle(t, e))
            }
            applyMatrix3(t) {
                const e = this.x,
                    n = this.y,
                    i = this.z,
                    r = t.elements;
                return this.x = r[0] * e + r[3] * n + r[6] * i, this.y = r[1] * e + r[4] * n + r[7] * i, this.z = r[2] * e + r[5] * n + r[8] * i, this
            }
            applyNormalMatrix(t) {
                return this.applyMatrix3(t).normalize()
            }
            applyMatrix4(t) {
                const e = this.x,
                    n = this.y,
                    i = this.z,
                    r = t.elements,
                    a = 1 / (r[3] * e + r[7] * n + r[11] * i + r[15]);
                return this.x = (r[0] * e + r[4] * n + r[8] * i + r[12]) * a, this.y = (r[1] * e + r[5] * n + r[9] * i + r[13]) * a, this.z = (r[2] * e + r[6] * n + r[10] * i + r[14]) * a, this
            }
            applyQuaternion(t) {
                const e = this.x,
                    n = this.y,
                    i = this.z,
                    r = t.x,
                    a = t.y,
                    s = t.z,
                    o = t.w,
                    l = o * e + a * i - s * n,
                    c = o * n + s * e - r * i,
                    u = o * i + r * n - a * e,
                    h = -r * e - a * n - s * i;
                return this.x = l * o + h * -r + c * -s - u * -a, this.y = c * o + h * -a + u * -r - l * -s, this.z = u * o + h * -s + l * -a - c * -r, this
            }
            project(t) {
                return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)
            }
            unproject(t) {
                return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)
            }
            transformDirection(t) {
                const e = this.x,
                    n = this.y,
                    i = this.z,
                    r = t.elements;
                return this.x = r[0] * e + r[4] * n + r[8] * i, this.y = r[1] * e + r[5] * n + r[9] * i, this.z = r[2] * e + r[6] * n + r[10] * i, this.normalize()
            }
            divide(t) {
                return this.x /= t.x, this.y /= t.y, this.z /= t.z, this
            }
            divideScalar(t) {
                return this.multiplyScalar(1 / t)
            }
            min(t) {
                return this.x = Math.min(this.x, t.x), this.y = Math.min(this.y, t.y), this.z = Math.min(this.z, t.z), this
            }
            max(t) {
                return this.x = Math.max(this.x, t.x), this.y = Math.max(this.y, t.y), this.z = Math.max(this.z, t.z), this
            }
            clamp(t, e) {
                return this.x = Math.max(t.x, Math.min(e.x, this.x)), this.y = Math.max(t.y, Math.min(e.y, this.y)), this.z = Math.max(t.z, Math.min(e.z, this.z)), this
            }
            clampScalar(t, e) {
                return this.x = Math.max(t, Math.min(e, this.x)), this.y = Math.max(t, Math.min(e, this.y)), this.z = Math.max(t, Math.min(e, this.z)), this
            }
            clampLength(t, e) {
                const n = this.length();
                return this.divideScalar(n || 1).multiplyScalar(Math.max(t, Math.min(e, n)))
            }
            floor() {
                return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this
            }
            ceil() {
                return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this
            }
            round() {
                return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this
            }
            roundToZero() {
                return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this
            }
            negate() {
                return this.x = -this.x, this.y = -this.y, this.z = -this.z, this
            }
            dot(t) {
                return this.x * t.x + this.y * t.y + this.z * t.z
            }
            lengthSq() {
                return this.x * this.x + this.y * this.y + this.z * this.z
            }
            length() {
                return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
            }
            manhattanLength() {
                return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z)
            }
            normalize() {
                return this.divideScalar(this.length() || 1)
            }
            setLength(t) {
                return this.normalize().multiplyScalar(t)
            }
            lerp(t, e) {
                return this.x += (t.x - this.x) * e, this.y += (t.y - this.y) * e, this.z += (t.z - this.z) * e, this
            }
            lerpVectors(t, e, n) {
                return this.x = t.x + (e.x - t.x) * n, this.y = t.y + (e.y - t.y) * n, this.z = t.z + (e.z - t.z) * n, this
            }
            cross(t) {
                return this.crossVectors(this, t)
            }
            crossVectors(t, e) {
                const n = t.x,
                    i = t.y,
                    r = t.z,
                    a = e.x,
                    s = e.y,
                    o = e.z;
                return this.x = i * o - r * s, this.y = r * a - n * o, this.z = n * s - i * a, this
            }
            projectOnVector(t) {
                const e = t.lengthSq();
                if (0 === e) return this.set(0, 0, 0);
                const n = t.dot(this) / e;
                return this.copy(t).multiplyScalar(n)
            }
            projectOnPlane(t) {
                return wc.copy(this).projectOnVector(t), this.sub(wc)
            }
            reflect(t) {
                return this.sub(wc.copy(t).multiplyScalar(2 * this.dot(t)))
            }
            angleTo(t) {
                const e = Math.sqrt(this.lengthSq() * t.lengthSq());
                if (0 === e) return Math.PI / 2;
                const n = this.dot(t) / e;
                return Math.acos(ql(n, -1, 1))
            }
            distanceTo(t) {
                return Math.sqrt(this.distanceToSquared(t))
            }
            distanceToSquared(t) {
                const e = this.x - t.x,
                    n = this.y - t.y,
                    i = this.z - t.z;
                return e * e + n * n + i * i
            }
            manhattanDistanceTo(t) {
                return Math.abs(this.x - t.x) + Math.abs(this.y - t.y) + Math.abs(this.z - t.z)
            }
            setFromSpherical(t) {
                return this.setFromSphericalCoords(t.radius, t.phi, t.theta)
            }
            setFromSphericalCoords(t, e, n) {
                const i = Math.sin(e) * t;
                return this.x = i * Math.sin(n), this.y = Math.cos(e) * t, this.z = i * Math.cos(n), this
            }
            setFromCylindrical(t) {
                return this.setFromCylindricalCoords(t.radius, t.theta, t.y)
            }
            setFromCylindricalCoords(t, e, n) {
                return this.x = t * Math.sin(e), this.y = n, this.z = t * Math.cos(e), this
            }
            setFromMatrixPosition(t) {
                const e = t.elements;
                return this.x = e[12], this.y = e[13], this.z = e[14], this
            }
            setFromMatrixScale(t) {
                const e = this.setFromMatrixColumn(t, 0).length(),
                    n = this.setFromMatrixColumn(t, 1).length(),
                    i = this.setFromMatrixColumn(t, 2).length();
                return this.x = e, this.y = n, this.z = i, this
            }
            setFromMatrixColumn(t, e) {
                return this.fromArray(t.elements, 4 * e)
            }
            setFromMatrix3Column(t, e) {
                return this.fromArray(t.elements, 3 * e)
            }
            setFromEuler(t) {
                return this.x = t._x, this.y = t._y, this.z = t._z, this
            }
            setFromColor(t) {
                return this.x = t.r, this.y = t.g, this.z = t.b, this
            }
            equals(t) {
                return t.x === this.x && t.y === this.y && t.z === this.z
            }
            fromArray(t, e = 0) {
                return this.x = t[e], this.y = t[e + 1], this.z = t[e + 2], this
            }
            toArray(t = [], e = 0) {
                return t[e] = this.x, t[e + 1] = this.y, t[e + 2] = this.z, t
            }
            fromBufferAttribute(t, e) {
                return this.x = t.getX(e), this.y = t.getY(e), this.z = t.getZ(e), this
            }
            random() {
                return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this
            }
            randomDirection() {
                const t = 2 * (Math.random() - .5),
                    e = Math.random() * Math.PI * 2,
                    n = Math.sqrt(1 - t ** 2);
                return this.x = n * Math.cos(e), this.y = n * Math.sin(e), this.z = t, this
            }*[Symbol.iterator]() {
                yield this.x, yield this.y, yield this.z
            }
        }
        const wc = new bc,
            Ac = new Tc;
        class Rc {
            constructor(t, e, n, i, r, a, s, o, l, c, u, h, d, p, f, m) {
                Rc.prototype.isMatrix4 = !0, this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], void 0 !== t && this.set(t, e, n, i, r, a, s, o, l, c, u, h, d, p, f, m)
            }
            set(t, e, n, i, r, a, s, o, l, c, u, h, d, p, f, m) {
                const g = this.elements;
                return g[0] = t, g[4] = e, g[8] = n, g[12] = i, g[1] = r, g[5] = a, g[9] = s, g[13] = o, g[2] = l, g[6] = c, g[10] = u, g[14] = h, g[3] = d, g[7] = p, g[11] = f, g[15] = m, this
            }
            identity() {
                return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this
            }
            clone() {
                return (new Rc).fromArray(this.elements)
            }
            copy(t) {
                const e = this.elements,
                    n = t.elements;
                return e[0] = n[0], e[1] = n[1], e[2] = n[2], e[3] = n[3], e[4] = n[4], e[5] = n[5], e[6] = n[6], e[7] = n[7], e[8] = n[8], e[9] = n[9], e[10] = n[10], e[11] = n[11], e[12] = n[12], e[13] = n[13], e[14] = n[14], e[15] = n[15], this
            }
            copyPosition(t) {
                const e = this.elements,
                    n = t.elements;
                return e[12] = n[12], e[13] = n[13], e[14] = n[14], this
            }
            setFromMatrix3(t) {
                const e = t.elements;
                return this.set(e[0], e[3], e[6], 0, e[1], e[4], e[7], 0, e[2], e[5], e[8], 0, 0, 0, 0, 1), this
            }
            extractBasis(t, e, n) {
                return t.setFromMatrixColumn(this, 0), e.setFromMatrixColumn(this, 1), n.setFromMatrixColumn(this, 2), this
            }
            makeBasis(t, e, n) {
                return this.set(t.x, e.x, n.x, 0, t.y, e.y, n.y, 0, t.z, e.z, n.z, 0, 0, 0, 0, 1), this
            }
            extractRotation(t) {
                const e = this.elements,
                    n = t.elements,
                    i = 1 / Cc.setFromMatrixColumn(t, 0).length(),
                    r = 1 / Cc.setFromMatrixColumn(t, 1).length(),
                    a = 1 / Cc.setFromMatrixColumn(t, 2).length();
                return e[0] = n[0] * i, e[1] = n[1] * i, e[2] = n[2] * i, e[3] = 0, e[4] = n[4] * r, e[5] = n[5] * r, e[6] = n[6] * r, e[7] = 0, e[8] = n[8] * a, e[9] = n[9] * a, e[10] = n[10] * a, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, this
            }
            makeRotationFromEuler(t) {
                const e = this.elements,
                    n = t.x,
                    i = t.y,
                    r = t.z,
                    a = Math.cos(n),
                    s = Math.sin(n),
                    o = Math.cos(i),
                    l = Math.sin(i),
                    c = Math.cos(r),
                    u = Math.sin(r);
                if ("XYZ" === t.order) {
                    const t = a * c,
                        n = a * u,
                        i = s * c,
                        r = s * u;
                    e[0] = o * c, e[4] = -o * u, e[8] = l, e[1] = n + i * l, e[5] = t - r * l, e[9] = -s * o, e[2] = r - t * l, e[6] = i + n * l, e[10] = a * o
                } else if ("YXZ" === t.order) {
                    const t = o * c,
                        n = o * u,
                        i = l * c,
                        r = l * u;
                    e[0] = t + r * s, e[4] = i * s - n, e[8] = a * l, e[1] = a * u, e[5] = a * c, e[9] = -s, e[2] = n * s - i, e[6] = r + t * s, e[10] = a * o
                } else if ("ZXY" === t.order) {
                    const t = o * c,
                        n = o * u,
                        i = l * c,
                        r = l * u;
                    e[0] = t - r * s, e[4] = -a * u, e[8] = i + n * s, e[1] = n + i * s, e[5] = a * c, e[9] = r - t * s, e[2] = -a * l, e[6] = s, e[10] = a * o
                } else if ("ZYX" === t.order) {
                    const t = a * c,
                        n = a * u,
                        i = s * c,
                        r = s * u;
                    e[0] = o * c, e[4] = i * l - n, e[8] = t * l + r, e[1] = o * u, e[5] = r * l + t, e[9] = n * l - i, e[2] = -l, e[6] = s * o, e[10] = a * o
                } else if ("YZX" === t.order) {
                    const t = a * o,
                        n = a * l,
                        i = s * o,
                        r = s * l;
                    e[0] = o * c, e[4] = r - t * u, e[8] = i * u + n, e[1] = u, e[5] = a * c, e[9] = -s * c, e[2] = -l * c, e[6] = n * u + i, e[10] = t - r * u
                } else if ("XZY" === t.order) {
                    const t = a * o,
                        n = a * l,
                        i = s * o,
                        r = s * l;
                    e[0] = o * c, e[4] = -u, e[8] = l * c, e[1] = t * u + r, e[5] = a * c, e[9] = n * u - i, e[2] = i * u - n, e[6] = s * c, e[10] = r * u + t
                }
                return e[3] = 0, e[7] = 0, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, this
            }
            makeRotationFromQuaternion(t) {
                return this.compose(Pc, t, Uc)
            }
            lookAt(t, e, n) {
                const i = this.elements;
                return Oc.subVectors(t, e), 0 === Oc.lengthSq() && (Oc.z = 1), Oc.normalize(), Dc.crossVectors(n, Oc), 0 === Dc.lengthSq() && (1 === Math.abs(n.z) ? Oc.x += 1e-4 : Oc.z += 1e-4, Oc.normalize(), Dc.crossVectors(n, Oc)), Dc.normalize(), Ic.crossVectors(Oc, Dc), i[0] = Dc.x, i[4] = Ic.x, i[8] = Oc.x, i[1] = Dc.y, i[5] = Ic.y, i[9] = Oc.y, i[2] = Dc.z, i[6] = Ic.z, i[10] = Oc.z, this
            }
            multiply(t) {
                return this.multiplyMatrices(this, t)
            }
            premultiply(t) {
                return this.multiplyMatrices(t, this)
            }
            multiplyMatrices(t, e) {
                const n = t.elements,
                    i = e.elements,
                    r = this.elements,
                    a = n[0],
                    s = n[4],
                    o = n[8],
                    l = n[12],
                    c = n[1],
                    u = n[5],
                    h = n[9],
                    d = n[13],
                    p = n[2],
                    f = n[6],
                    m = n[10],
                    g = n[14],
                    _ = n[3],
                    v = n[7],
                    x = n[11],
                    y = n[15],
                    M = i[0],
                    S = i[4],
                    E = i[8],
                    T = i[12],
                    b = i[1],
                    w = i[5],
                    A = i[9],
                    R = i[13],
                    C = i[2],
                    L = i[6],
                    P = i[10],
                    U = i[14],
                    D = i[3],
                    I = i[7],
                    O = i[11],
                    N = i[15];
                return r[0] = a * M + s * b + o * C + l * D, r[4] = a * S + s * w + o * L + l * I, r[8] = a * E + s * A + o * P + l * O, r[12] = a * T + s * R + o * U + l * N, r[1] = c * M + u * b + h * C + d * D, r[5] = c * S + u * w + h * L + d * I, r[9] = c * E + u * A + h * P + d * O, r[13] = c * T + u * R + h * U + d * N, r[2] = p * M + f * b + m * C + g * D, r[6] = p * S + f * w + m * L + g * I, r[10] = p * E + f * A + m * P + g * O, r[14] = p * T + f * R + m * U + g * N, r[3] = _ * M + v * b + x * C + y * D, r[7] = _ * S + v * w + x * L + y * I, r[11] = _ * E + v * A + x * P + y * O, r[15] = _ * T + v * R + x * U + y * N, this
            }
            multiplyScalar(t) {
                const e = this.elements;
                return e[0] *= t, e[4] *= t, e[8] *= t, e[12] *= t, e[1] *= t, e[5] *= t, e[9] *= t, e[13] *= t, e[2] *= t, e[6] *= t, e[10] *= t, e[14] *= t, e[3] *= t, e[7] *= t, e[11] *= t, e[15] *= t, this
            }
            determinant() {
                const t = this.elements,
                    e = t[0],
                    n = t[4],
                    i = t[8],
                    r = t[12],
                    a = t[1],
                    s = t[5],
                    o = t[9],
                    l = t[13],
                    c = t[2],
                    u = t[6],
                    h = t[10],
                    d = t[14];
                return t[3] * (+r * o * u - i * l * u - r * s * h + n * l * h + i * s * d - n * o * d) + t[7] * (+e * o * d - e * l * h + r * a * h - i * a * d + i * l * c - r * o * c) + t[11] * (+e * l * u - e * s * d - r * a * u + n * a * d + r * s * c - n * l * c) + t[15] * (-i * s * c - e * o * u + e * s * h + i * a * u - n * a * h + n * o * c)
            }
            transpose() {
                const t = this.elements;
                let e;
                return e = t[1], t[1] = t[4], t[4] = e, e = t[2], t[2] = t[8], t[8] = e, e = t[6], t[6] = t[9], t[9] = e, e = t[3], t[3] = t[12], t[12] = e, e = t[7], t[7] = t[13], t[13] = e, e = t[11], t[11] = t[14], t[14] = e, this
            }
            setPosition(t, e, n) {
                const i = this.elements;
                return t.isVector3 ? (i[12] = t.x, i[13] = t.y, i[14] = t.z) : (i[12] = t, i[13] = e, i[14] = n), this
            }
            invert() {
                const t = this.elements,
                    e = t[0],
                    n = t[1],
                    i = t[2],
                    r = t[3],
                    a = t[4],
                    s = t[5],
                    o = t[6],
                    l = t[7],
                    c = t[8],
                    u = t[9],
                    h = t[10],
                    d = t[11],
                    p = t[12],
                    f = t[13],
                    m = t[14],
                    g = t[15],
                    _ = u * m * l - f * h * l + f * o * d - s * m * d - u * o * g + s * h * g,
                    v = p * h * l - c * m * l - p * o * d + a * m * d + c * o * g - a * h * g,
                    x = c * f * l - p * u * l + p * s * d - a * f * d - c * s * g + a * u * g,
                    y = p * u * o - c * f * o - p * s * h + a * f * h + c * s * m - a * u * m,
                    M = e * _ + n * v + i * x + r * y;
                if (0 === M) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
                const S = 1 / M;
                return t[0] = _ * S, t[1] = (f * h * r - u * m * r - f * i * d + n * m * d + u * i * g - n * h * g) * S, t[2] = (s * m * r - f * o * r + f * i * l - n * m * l - s * i * g + n * o * g) * S, t[3] = (u * o * r - s * h * r - u * i * l + n * h * l + s * i * d - n * o * d) * S, t[4] = v * S, t[5] = (c * m * r - p * h * r + p * i * d - e * m * d - c * i * g + e * h * g) * S, t[6] = (p * o * r - a * m * r - p * i * l + e * m * l + a * i * g - e * o * g) * S, t[7] = (a * h * r - c * o * r + c * i * l - e * h * l - a * i * d + e * o * d) * S, t[8] = x * S, t[9] = (p * u * r - c * f * r - p * n * d + e * f * d + c * n * g - e * u * g) * S, t[10] = (a * f * r - p * s * r + p * n * l - e * f * l - a * n * g + e * s * g) * S, t[11] = (c * s * r - a * u * r - c * n * l + e * u * l + a * n * d - e * s * d) * S, t[12] = y * S, t[13] = (c * f * i - p * u * i + p * n * h - e * f * h - c * n * m + e * u * m) * S, t[14] = (p * s * i - a * f * i - p * n * o + e * f * o + a * n * m - e * s * m) * S, t[15] = (a * u * i - c * s * i + c * n * o - e * u * o - a * n * h + e * s * h) * S, this
            }
            scale(t) {
                const e = this.elements,
                    n = t.x,
                    i = t.y,
                    r = t.z;
                return e[0] *= n, e[4] *= i, e[8] *= r, e[1] *= n, e[5] *= i, e[9] *= r, e[2] *= n, e[6] *= i, e[10] *= r, e[3] *= n, e[7] *= i, e[11] *= r, this
            }
            getMaxScaleOnAxis() {
                const t = this.elements,
                    e = t[0] * t[0] + t[1] * t[1] + t[2] * t[2],
                    n = t[4] * t[4] + t[5] * t[5] + t[6] * t[6],
                    i = t[8] * t[8] + t[9] * t[9] + t[10] * t[10];
                return Math.sqrt(Math.max(e, n, i))
            }
            makeTranslation(t, e, n) {
                return t.isVector3 ? this.set(1, 0, 0, t.x, 0, 1, 0, t.y, 0, 0, 1, t.z, 0, 0, 0, 1) : this.set(1, 0, 0, t, 0, 1, 0, e, 0, 0, 1, n, 0, 0, 0, 1), this
            }
            makeRotationX(t) {
                const e = Math.cos(t),
                    n = Math.sin(t);
                return this.set(1, 0, 0, 0, 0, e, -n, 0, 0, n, e, 0, 0, 0, 0, 1), this
            }
            makeRotationY(t) {
                const e = Math.cos(t),
                    n = Math.sin(t);
                return this.set(e, 0, n, 0, 0, 1, 0, 0, -n, 0, e, 0, 0, 0, 0, 1), this
            }
            makeRotationZ(t) {
                const e = Math.cos(t),
                    n = Math.sin(t);
                return this.set(e, -n, 0, 0, n, e, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this
            }
            makeRotationAxis(t, e) {
                const n = Math.cos(e),
                    i = Math.sin(e),
                    r = 1 - n,
                    a = t.x,
                    s = t.y,
                    o = t.z,
                    l = r * a,
                    c = r * s;
                return this.set(l * a + n, l * s - i * o, l * o + i * s, 0, l * s + i * o, c * s + n, c * o - i * a, 0, l * o - i * s, c * o + i * a, r * o * o + n, 0, 0, 0, 0, 1), this
            }
            makeScale(t, e, n) {
                return this.set(t, 0, 0, 0, 0, e, 0, 0, 0, 0, n, 0, 0, 0, 0, 1), this
            }
            makeShear(t, e, n, i, r, a) {
                return this.set(1, n, r, 0, t, 1, a, 0, e, i, 1, 0, 0, 0, 0, 1), this
            }
            compose(t, e, n) {
                const i = this.elements,
                    r = e._x,
                    a = e._y,
                    s = e._z,
                    o = e._w,
                    l = r + r,
                    c = a + a,
                    u = s + s,
                    h = r * l,
                    d = r * c,
                    p = r * u,
                    f = a * c,
                    m = a * u,
                    g = s * u,
                    _ = o * l,
                    v = o * c,
                    x = o * u,
                    y = n.x,
                    M = n.y,
                    S = n.z;
                return i[0] = (1 - (f + g)) * y, i[1] = (d + x) * y, i[2] = (p - v) * y, i[3] = 0, i[4] = (d - x) * M, i[5] = (1 - (h + g)) * M, i[6] = (m + _) * M, i[7] = 0, i[8] = (p + v) * S, i[9] = (m - _) * S, i[10] = (1 - (h + f)) * S, i[11] = 0, i[12] = t.x, i[13] = t.y, i[14] = t.z, i[15] = 1, this
            }
            decompose(t, e, n) {
                const i = this.elements;
                let r = Cc.set(i[0], i[1], i[2]).length();
                const a = Cc.set(i[4], i[5], i[6]).length(),
                    s = Cc.set(i[8], i[9], i[10]).length();
                this.determinant() < 0 && (r = -r), t.x = i[12], t.y = i[13], t.z = i[14], Lc.copy(this);
                const o = 1 / r,
                    l = 1 / a,
                    c = 1 / s;
                return Lc.elements[0] *= o, Lc.elements[1] *= o, Lc.elements[2] *= o, Lc.elements[4] *= l, Lc.elements[5] *= l, Lc.elements[6] *= l, Lc.elements[8] *= c, Lc.elements[9] *= c, Lc.elements[10] *= c, e.setFromRotationMatrix(Lc), n.x = r, n.y = a, n.z = s, this
            }
            makePerspective(t, e, n, i, r, a, s = 2e3) {
                const o = this.elements,
                    l = 2 * r / (e - t),
                    c = 2 * r / (n - i),
                    u = (e + t) / (e - t),
                    h = (n + i) / (n - i);
                let d, p;
                if (s === Hl) d = -(a + r) / (a - r), p = -2 * a * r / (a - r);
                else {
                    if (s !== Gl) throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: " + s);
                    d = -a / (a - r), p = -a * r / (a - r)
                }
                return o[0] = l, o[4] = 0, o[8] = u, o[12] = 0, o[1] = 0, o[5] = c, o[9] = h, o[13] = 0, o[2] = 0, o[6] = 0, o[10] = d, o[14] = p, o[3] = 0, o[7] = 0, o[11] = -1, o[15] = 0, this
            }
            makeOrthographic(t, e, n, i, r, a, s = 2e3) {
                const o = this.elements,
                    l = 1 / (e - t),
                    c = 1 / (n - i),
                    u = 1 / (a - r),
                    h = (e + t) * l,
                    d = (n + i) * c;
                let p, f;
                if (s === Hl) p = (a + r) * u, f = -2 * u;
                else {
                    if (s !== Gl) throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + s);
                    p = r * u, f = -1 * u
                }
                return o[0] = 2 * l, o[4] = 0, o[8] = 0, o[12] = -h, o[1] = 0, o[5] = 2 * c, o[9] = 0, o[13] = -d, o[2] = 0, o[6] = 0, o[10] = f, o[14] = -p, o[3] = 0, o[7] = 0, o[11] = 0, o[15] = 1, this
            }
            equals(t) {
                const e = this.elements,
                    n = t.elements;
                for (let t = 0; t < 16; t++)
                    if (e[t] !== n[t]) return !1;
                return !0
            }
            fromArray(t, e = 0) {
                for (let n = 0; n < 16; n++) this.elements[n] = t[n + e];
                return this
            }
            toArray(t = [], e = 0) {
                const n = this.elements;
                return t[e] = n[0], t[e + 1] = n[1], t[e + 2] = n[2], t[e + 3] = n[3], t[e + 4] = n[4], t[e + 5] = n[5], t[e + 6] = n[6], t[e + 7] = n[7], t[e + 8] = n[8], t[e + 9] = n[9], t[e + 10] = n[10], t[e + 11] = n[11], t[e + 12] = n[12], t[e + 13] = n[13], t[e + 14] = n[14], t[e + 15] = n[15], t
            }
        }
        const Cc = new bc,
            Lc = new Rc,
            Pc = new bc(0, 0, 0),
            Uc = new bc(1, 1, 1),
            Dc = new bc,
            Ic = new bc,
            Oc = new bc,
            Nc = new Rc,
            Fc = new Tc;
        class zc {
            constructor(t = 0, e = 0, n = 0, i = zc.DEFAULT_ORDER) {
                this.isEuler = !0, this._x = t, this._y = e, this._z = n, this._order = i
            }
            get x() {
                return this._x
            }
            set x(t) {
                this._x = t, this._onChangeCallback()
            }
            get y() {
                return this._y
            }
            set y(t) {
                this._y = t, this._onChangeCallback()
            }
            get z() {
                return this._z
            }
            set z(t) {
                this._z = t, this._onChangeCallback()
            }
            get order() {
                return this._order
            }
            set order(t) {
                this._order = t, this._onChangeCallback()
            }
            set(t, e, n, i = this._order) {
                return this._x = t, this._y = e, this._z = n, this._order = i, this._onChangeCallback(), this
            }
            clone() {
                return new this.constructor(this._x, this._y, this._z, this._order)
            }
            copy(t) {
                return this._x = t._x, this._y = t._y, this._z = t._z, this._order = t._order, this._onChangeCallback(), this
            }
            setFromRotationMatrix(t, e = this._order, n = !0) {
                const i = t.elements,
                    r = i[0],
                    a = i[4],
                    s = i[8],
                    o = i[1],
                    l = i[5],
                    c = i[9],
                    u = i[2],
                    h = i[6],
                    d = i[10];
                switch (e) {
                    case "XYZ":
                        this._y = Math.asin(ql(s, -1, 1)), Math.abs(s) < .9999999 ? (this._x = Math.atan2(-c, d), this._z = Math.atan2(-a, r)) : (this._x = Math.atan2(h, l), this._z = 0);
                        break;
                    case "YXZ":
                        this._x = Math.asin(-ql(c, -1, 1)), Math.abs(c) < .9999999 ? (this._y = Math.atan2(s, d), this._z = Math.atan2(o, l)) : (this._y = Math.atan2(-u, r), this._z = 0);
                        break;
                    case "ZXY":
                        this._x = Math.asin(ql(h, -1, 1)), Math.abs(h) < .9999999 ? (this._y = Math.atan2(-u, d), this._z = Math.atan2(-a, l)) : (this._y = 0, this._z = Math.atan2(o, r));
                        break;
                    case "ZYX":
                        this._y = Math.asin(-ql(u, -1, 1)), Math.abs(u) < .9999999 ? (this._x = Math.atan2(h, d), this._z = Math.atan2(o, r)) : (this._x = 0, this._z = Math.atan2(-a, l));
                        break;
                    case "YZX":
                        this._z = Math.asin(ql(o, -1, 1)), Math.abs(o) < .9999999 ? (this._x = Math.atan2(-c, l), this._y = Math.atan2(-u, r)) : (this._x = 0, this._y = Math.atan2(s, d));
                        break;
                    case "XZY":
                        this._z = Math.asin(-ql(a, -1, 1)), Math.abs(a) < .9999999 ? (this._x = Math.atan2(h, l), this._y = Math.atan2(s, r)) : (this._x = Math.atan2(-c, d), this._y = 0);
                        break;
                    default:
                        console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " + e)
                }
                return this._order = e, !0 === n && this._onChangeCallback(), this
            }
            setFromQuaternion(t, e, n) {
                return Nc.makeRotationFromQuaternion(t), this.setFromRotationMatrix(Nc, e, n)
            }
            setFromVector3(t, e = this._order) {
                return this.set(t.x, t.y, t.z, e)
            }
            reorder(t) {
                return Fc.setFromEuler(this), this.setFromQuaternion(Fc, t)
            }
            equals(t) {
                return t._x === this._x && t._y === this._y && t._z === this._z && t._order === this._order
            }
            fromArray(t) {
                return this._x = t[0], this._y = t[1], this._z = t[2], void 0 !== t[3] && (this._order = t[3]), this._onChangeCallback(), this
            }
            toArray(t = [], e = 0) {
                return t[e] = this._x, t[e + 1] = this._y, t[e + 2] = this._z, t[e + 3] = this._order, t
            }
            _onChange(t) {
                return this._onChangeCallback = t, this
            }
            _onChangeCallback() {}*[Symbol.iterator]() {
                yield this._x, yield this._y, yield this._z, yield this._order
            }
        }
        zc.DEFAULT_ORDER = "XYZ";
        class Bc {
            constructor() {
                this.mask = 1
            }
            set(t) {
                this.mask = (1 << t | 0) >>> 0
            }
            enable(t) {
                this.mask |= 1 << t | 0
            }
            enableAll() {
                this.mask = -1
            }
            toggle(t) {
                this.mask ^= 1 << t | 0
            }
            disable(t) {
                this.mask &= ~(1 << t | 0)
            }
            disableAll() {
                this.mask = 0
            }
            test(t) {
                return 0 != (this.mask & t.mask)
            }
            isEnabled(t) {
                return 0 != (this.mask & (1 << t | 0))
            }
        }
        let kc = 0;
        const Hc = new bc,
            Gc = new Tc,
            Vc = new Rc,
            Wc = new bc,
            Xc = new bc,
            jc = new bc,
            qc = new Tc,
            Yc = new bc(1, 0, 0),
            Kc = new bc(0, 1, 0),
            Zc = new bc(0, 0, 1),
            $c = {
                type: "added"
            },
            Jc = {
                type: "removed"
            };
        class Qc extends Zo {
            constructor() {
                super(), this.isObject3D = !0, Object.defineProperty(this, "id", {
                    value: kc++
                }), this.uuid = jl(), this.name = "", this.type = "Object3D", this.parent = null, this.children = [], this.up = Qc.DEFAULT_UP.clone();
                const t = new bc,
                    e = new zc,
                    n = new Tc,
                    i = new bc(1, 1, 1);
                e._onChange((function() {
                    n.setFromEuler(e, !1)
                })), n._onChange((function() {
                    e.setFromQuaternion(n, void 0, !1)
                })), Object.defineProperties(this, {
                    position: {
                        configurable: !0,
                        enumerable: !0,
                        value: t
                    },
                    rotation: {
                        configurable: !0,
                        enumerable: !0,
                        value: e
                    },
                    quaternion: {
                        configurable: !0,
                        enumerable: !0,
                        value: n
                    },
                    scale: {
                        configurable: !0,
                        enumerable: !0,
                        value: i
                    },
                    modelViewMatrix: {
                        value: new Rc
                    },
                    normalMatrix: {
                        value: new tc
                    }
                }), this.matrix = new Rc, this.matrixWorld = new Rc, this.matrixAutoUpdate = Qc.DEFAULT_MATRIX_AUTO_UPDATE, this.matrixWorldNeedsUpdate = !1, this.matrixWorldAutoUpdate = Qc.DEFAULT_MATRIX_WORLD_AUTO_UPDATE, this.layers = new Bc, this.visible = !0, this.castShadow = !1, this.receiveShadow = !1, this.frustumCulled = !0, this.renderOrder = 0, this.animations = [], this.userData = {}
            }
            onBeforeRender() {}
            onAfterRender() {}
            applyMatrix4(t) {
                this.matrixAutoUpdate && this.updateMatrix(), this.matrix.premultiply(t), this.matrix.decompose(this.position, this.quaternion, this.scale)
            }
            applyQuaternion(t) {
                return this.quaternion.premultiply(t), this
            }
            setRotationFromAxisAngle(t, e) {
                this.quaternion.setFromAxisAngle(t, e)
            }
            setRotationFromEuler(t) {
                this.quaternion.setFromEuler(t, !0)
            }
            setRotationFromMatrix(t) {
                this.quaternion.setFromRotationMatrix(t)
            }
            setRotationFromQuaternion(t) {
                this.quaternion.copy(t)
            }
            rotateOnAxis(t, e) {
                return Gc.setFromAxisAngle(t, e), this.quaternion.multiply(Gc), this
            }
            rotateOnWorldAxis(t, e) {
                return Gc.setFromAxisAngle(t, e), this.quaternion.premultiply(Gc), this
            }
            rotateX(t) {
                return this.rotateOnAxis(Yc, t)
            }
            rotateY(t) {
                return this.rotateOnAxis(Kc, t)
            }
            rotateZ(t) {
                return this.rotateOnAxis(Zc, t)
            }
            translateOnAxis(t, e) {
                return Hc.copy(t).applyQuaternion(this.quaternion), this.position.add(Hc.multiplyScalar(e)), this
            }
            translateX(t) {
                return this.translateOnAxis(Yc, t)
            }
            translateY(t) {
                return this.translateOnAxis(Kc, t)
            }
            translateZ(t) {
                return this.translateOnAxis(Zc, t)
            }
            localToWorld(t) {
                return this.updateWorldMatrix(!0, !1), t.applyMatrix4(this.matrixWorld)
            }
            worldToLocal(t) {
                return this.updateWorldMatrix(!0, !1), t.applyMatrix4(Vc.copy(this.matrixWorld).invert())
            }
            lookAt(t, e, n) {
                t.isVector3 ? Wc.copy(t) : Wc.set(t, e, n);
                const i = this.parent;
                this.updateWorldMatrix(!0, !1), Xc.setFromMatrixPosition(this.matrixWorld), this.isCamera || this.isLight ? Vc.lookAt(Xc, Wc, this.up) : Vc.lookAt(Wc, Xc, this.up), this.quaternion.setFromRotationMatrix(Vc), i && (Vc.extractRotation(i.matrixWorld), Gc.setFromRotationMatrix(Vc), this.quaternion.premultiply(Gc.invert()))
            }
            add(t) {
                if (arguments.length > 1) {
                    for (let t = 0; t < arguments.length; t++) this.add(arguments[t]);
                    return this
                }
                return t === this ? (console.error("THREE.Object3D.add: object can't be added as a child of itself.", t), this) : (t && t.isObject3D ? (null !== t.parent && t.parent.remove(t), t.parent = this, this.children.push(t), t.dispatchEvent($c)) : console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", t), this)
            }
            remove(t) {
                if (arguments.length > 1) {
                    for (let t = 0; t < arguments.length; t++) this.remove(arguments[t]);
                    return this
                }
                const e = this.children.indexOf(t);
                return -1 !== e && (t.parent = null, this.children.splice(e, 1), t.dispatchEvent(Jc)), this
            }
            removeFromParent() {
                const t = this.parent;
                return null !== t && t.remove(this), this
            }
            clear() {
                return this.remove(...this.children)
            }
            attach(t) {
                return this.updateWorldMatrix(!0, !1), Vc.copy(this.matrixWorld).invert(), null !== t.parent && (t.parent.updateWorldMatrix(!0, !1), Vc.multiply(t.parent.matrixWorld)), t.applyMatrix4(Vc), this.add(t), t.updateWorldMatrix(!1, !0), this
            }
            getObjectById(t) {
                return this.getObjectByProperty("id", t)
            }
            getObjectByName(t) {
                return this.getObjectByProperty("name", t)
            }
            getObjectByProperty(t, e) {
                if (this[t] === e) return this;
                for (let n = 0, i = this.children.length; n < i; n++) {
                    const i = this.children[n].getObjectByProperty(t, e);
                    if (void 0 !== i) return i
                }
            }
            getObjectsByProperty(t, e) {
                let n = [];
                this[t] === e && n.push(this);
                for (let i = 0, r = this.children.length; i < r; i++) {
                    const r = this.children[i].getObjectsByProperty(t, e);
                    r.length > 0 && (n = n.concat(r))
                }
                return n
            }
            getWorldPosition(t) {
                return this.updateWorldMatrix(!0, !1), t.setFromMatrixPosition(this.matrixWorld)
            }
            getWorldQuaternion(t) {
                return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(Xc, t, jc), t
            }
            getWorldScale(t) {
                return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(Xc, qc, t), t
            }
            getWorldDirection(t) {
                this.updateWorldMatrix(!0, !1);
                const e = this.matrixWorld.elements;
                return t.set(e[8], e[9], e[10]).normalize()
            }
            raycast() {}
            traverse(t) {
                t(this);
                const e = this.children;
                for (let n = 0, i = e.length; n < i; n++) e[n].traverse(t)
            }
            traverseVisible(t) {
                if (!1 === this.visible) return;
                t(this);
                const e = this.children;
                for (let n = 0, i = e.length; n < i; n++) e[n].traverseVisible(t)
            }
            traverseAncestors(t) {
                const e = this.parent;
                null !== e && (t(e), e.traverseAncestors(t))
            }
            updateMatrix() {
                this.matrix.compose(this.position, this.quaternion, this.scale), this.matrixWorldNeedsUpdate = !0
            }
            updateMatrixWorld(t) {
                this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || t) && (null === this.parent ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix), this.matrixWorldNeedsUpdate = !1, t = !0);
                const e = this.children;
                for (let n = 0, i = e.length; n < i; n++) {
                    const i = e[n];
                    !0 !== i.matrixWorldAutoUpdate && !0 !== t || i.updateMatrixWorld(t)
                }
            }
            updateWorldMatrix(t, e) {
                const n = this.parent;
                if (!0 === t && null !== n && !0 === n.matrixWorldAutoUpdate && n.updateWorldMatrix(!0, !1), this.matrixAutoUpdate && this.updateMatrix(), null === this.parent ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix), !0 === e) {
                    const t = this.children;
                    for (let e = 0, n = t.length; e < n; e++) {
                        const n = t[e];
                        !0 === n.matrixWorldAutoUpdate && n.updateWorldMatrix(!1, !0)
                    }
                }
            }
            toJSON(t) {
                const e = void 0 === t || "string" == typeof t,
                    n = {};
                e && (t = {
                    geometries: {},
                    materials: {},
                    textures: {},
                    images: {},
                    shapes: {},
                    skeletons: {},
                    animations: {},
                    nodes: {}
                }, n.metadata = {
                    version: 4.6,
                    type: "Object",
                    generator: "Object3D.toJSON"
                });
                const i = {};

                function r(e, n) {
                    return void 0 === e[n.uuid] && (e[n.uuid] = n.toJSON(t)), n.uuid
                }
                if (i.uuid = this.uuid, i.type = this.type, "" !== this.name && (i.name = this.name), !0 === this.castShadow && (i.castShadow = !0), !0 === this.receiveShadow && (i.receiveShadow = !0), !1 === this.visible && (i.visible = !1), !1 === this.frustumCulled && (i.frustumCulled = !1), 0 !== this.renderOrder && (i.renderOrder = this.renderOrder), Object.keys(this.userData).length > 0 && (i.userData = this.userData), i.layers = this.layers.mask, i.matrix = this.matrix.toArray(), i.up = this.up.toArray(), !1 === this.matrixAutoUpdate && (i.matrixAutoUpdate = !1), this.isInstancedMesh && (i.type = "InstancedMesh", i.count = this.count, i.instanceMatrix = this.instanceMatrix.toJSON(), null !== this.instanceColor && (i.instanceColor = this.instanceColor.toJSON())), this.isScene) this.background && (this.background.isColor ? i.background = this.background.toJSON() : this.background.isTexture && (i.background = this.background.toJSON(t).uuid)), this.environment && this.environment.isTexture && !0 !== this.environment.isRenderTargetTexture && (i.environment = this.environment.toJSON(t).uuid);
                else if (this.isMesh || this.isLine || this.isPoints) {
                    i.geometry = r(t.geometries, this.geometry);
                    const e = this.geometry.parameters;
                    if (void 0 !== e && void 0 !== e.shapes) {
                        const n = e.shapes;
                        if (Array.isArray(n))
                            for (let e = 0, i = n.length; e < i; e++) {
                                const i = n[e];
                                r(t.shapes, i)
                            } else r(t.shapes, n)
                    }
                }
                if (this.isSkinnedMesh && (i.bindMode = this.bindMode, i.bindMatrix = this.bindMatrix.toArray(), void 0 !== this.skeleton && (r(t.skeletons, this.skeleton), i.skeleton = this.skeleton.uuid)), void 0 !== this.material)
                    if (Array.isArray(this.material)) {
                        const e = [];
                        for (let n = 0, i = this.material.length; n < i; n++) e.push(r(t.materials, this.material[n]));
                        i.material = e
                    } else i.material = r(t.materials, this.material);
                if (this.children.length > 0) {
                    i.children = [];
                    for (let e = 0; e < this.children.length; e++) i.children.push(this.children[e].toJSON(t).object)
                }
                if (this.animations.length > 0) {
                    i.animations = [];
                    for (let e = 0; e < this.animations.length; e++) {
                        const n = this.animations[e];
                        i.animations.push(r(t.animations, n))
                    }
                }
                if (e) {
                    const e = a(t.geometries),
                        i = a(t.materials),
                        r = a(t.textures),
                        s = a(t.images),
                        o = a(t.shapes),
                        l = a(t.skeletons),
                        c = a(t.animations),
                        u = a(t.nodes);
                    e.length > 0 && (n.geometries = e), i.length > 0 && (n.materials = i), r.length > 0 && (n.textures = r), s.length > 0 && (n.images = s), o.length > 0 && (n.shapes = o), l.length > 0 && (n.skeletons = l), c.length > 0 && (n.animations = c), u.length > 0 && (n.nodes = u)
                }
                return n.object = i, n;

                function a(t) {
                    const e = [];
                    for (const n in t) {
                        const i = t[n];
                        delete i.metadata, e.push(i)
                    }
                    return e
                }
            }
            clone(t) {
                return (new this.constructor).copy(this, t)
            }
            copy(t, e = !0) {
                if (this.name = t.name, this.up.copy(t.up), this.position.copy(t.position), this.rotation.order = t.rotation.order, this.quaternion.copy(t.quaternion), this.scale.copy(t.scale), this.matrix.copy(t.matrix), this.matrixWorld.copy(t.matrixWorld), this.matrixAutoUpdate = t.matrixAutoUpdate, this.matrixWorldNeedsUpdate = t.matrixWorldNeedsUpdate, this.matrixWorldAutoUpdate = t.matrixWorldAutoUpdate, this.layers.mask = t.layers.mask, this.visible = t.visible, this.castShadow = t.castShadow, this.receiveShadow = t.receiveShadow, this.frustumCulled = t.frustumCulled, this.renderOrder = t.renderOrder, this.animations = t.animations.slice(), this.userData = JSON.parse(JSON.stringify(t.userData)), !0 === e)
                    for (let e = 0; e < t.children.length; e++) {
                        const n = t.children[e];
                        this.add(n.clone())
                    }
                return this
            }
        }
        Qc.DEFAULT_UP = new bc(0, 1, 0), Qc.DEFAULT_MATRIX_AUTO_UPDATE = !0, Qc.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = !0;
        class tu extends Qc {
            constructor() {
                super(), this.isScene = !0, this.type = "Scene", this.background = null, this.environment = null, this.fog = null, this.backgroundBlurriness = 0, this.backgroundIntensity = 1, this.overrideMaterial = null, "undefined" != typeof __THREE_DEVTOOLS__ && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", {
                    detail: this
                }))
            }
            copy(t, e) {
                return super.copy(t, e), null !== t.background && (this.background = t.background.clone()), null !== t.environment && (this.environment = t.environment.clone()), null !== t.fog && (this.fog = t.fog.clone()), this.backgroundBlurriness = t.backgroundBlurriness, this.backgroundIntensity = t.backgroundIntensity, null !== t.overrideMaterial && (this.overrideMaterial = t.overrideMaterial.clone()), this.matrixAutoUpdate = t.matrixAutoUpdate, this
            }
            toJSON(t) {
                const e = super.toJSON(t);
                return null !== this.fog && (e.object.fog = this.fog.toJSON()), this.backgroundBlurriness > 0 && (e.object.backgroundBlurriness = this.backgroundBlurriness), 1 !== this.backgroundIntensity && (e.object.backgroundIntensity = this.backgroundIntensity), e
            }
        }
        class eu extends Qc {
            constructor() {
                super(), this.isCamera = !0, this.type = "Camera", this.matrixWorldInverse = new Rc, this.projectionMatrix = new Rc, this.projectionMatrixInverse = new Rc, this.coordinateSystem = Hl
            }
            copy(t, e) {
                return super.copy(t, e), this.matrixWorldInverse.copy(t.matrixWorldInverse), this.projectionMatrix.copy(t.projectionMatrix), this.projectionMatrixInverse.copy(t.projectionMatrixInverse), this.coordinateSystem = t.coordinateSystem, this
            }
            getWorldDirection(t) {
                this.updateWorldMatrix(!0, !1);
                const e = this.matrixWorld.elements;
                return t.set(-e[8], -e[9], -e[10]).normalize()
            }
            updateMatrixWorld(t) {
                super.updateMatrixWorld(t), this.matrixWorldInverse.copy(this.matrixWorld).invert()
            }
            updateWorldMatrix(t, e) {
                super.updateWorldMatrix(t, e), this.matrixWorldInverse.copy(this.matrixWorld).invert()
            }
            clone() {
                return (new this.constructor).copy(this)
            }
        }
        class nu extends eu {
            constructor(t = -1, e = 1, n = 1, i = -1, r = .1, a = 2e3) {
                super(), this.isOrthographicCamera = !0, this.type = "OrthographicCamera", this.zoom = 1, this.view = null, this.left = t, this.right = e, this.top = n, this.bottom = i, this.near = r, this.far = a, this.updateProjectionMatrix()
            }
            copy(t, e) {
                return super.copy(t, e), this.left = t.left, this.right = t.right, this.top = t.top, this.bottom = t.bottom, this.near = t.near, this.far = t.far, this.zoom = t.zoom, this.view = null === t.view ? null : Object.assign({}, t.view), this
            }
            setViewOffset(t, e, n, i, r, a) {
                null === this.view && (this.view = {
                    enabled: !0,
                    fullWidth: 1,
                    fullHeight: 1,
                    offsetX: 0,
                    offsetY: 0,
                    width: 1,
                    height: 1
                }), this.view.enabled = !0, this.view.fullWidth = t, this.view.fullHeight = e, this.view.offsetX = n, this.view.offsetY = i, this.view.width = r, this.view.height = a, this.updateProjectionMatrix()
            }
            clearViewOffset() {
                null !== this.view && (this.view.enabled = !1), this.updateProjectionMatrix()
            }
            updateProjectionMatrix() {
                const t = (this.right - this.left) / (2 * this.zoom),
                    e = (this.top - this.bottom) / (2 * this.zoom),
                    n = (this.right + this.left) / 2,
                    i = (this.top + this.bottom) / 2;
                let r = n - t,
                    a = n + t,
                    s = i + e,
                    o = i - e;
                if (null !== this.view && this.view.enabled) {
                    const t = (this.right - this.left) / this.view.fullWidth / this.zoom,
                        e = (this.top - this.bottom) / this.view.fullHeight / this.zoom;
                    r += t * this.view.offsetX, a = r + t * this.view.width, s -= e * this.view.offsetY, o = s - e * this.view.height
                }
                this.projectionMatrix.makeOrthographic(r, a, s, o, this.near, this.far, this.coordinateSystem), this.projectionMatrixInverse.copy(this.projectionMatrix).invert()
            }
            toJSON(t) {
                const e = super.toJSON(t);
                return e.object.zoom = this.zoom, e.object.left = this.left, e.object.right = this.right, e.object.top = this.top, e.object.bottom = this.bottom, e.object.near = this.near, e.object.far = this.far, null !== this.view && (e.object.view = Object.assign({}, this.view)), e
            }
        }
        class iu {
            constructor(t = new bc(1 / 0, 1 / 0, 1 / 0), e = new bc(-1 / 0, -1 / 0, -1 / 0)) {
                this.isBox3 = !0, this.min = t, this.max = e
            }
            set(t, e) {
                return this.min.copy(t), this.max.copy(e), this
            }
            setFromArray(t) {
                this.makeEmpty();
                for (let e = 0, n = t.length; e < n; e += 3) this.expandByPoint(au.fromArray(t, e));
                return this
            }
            setFromBufferAttribute(t) {
                this.makeEmpty();
                for (let e = 0, n = t.count; e < n; e++) this.expandByPoint(au.fromBufferAttribute(t, e));
                return this
            }
            setFromPoints(t) {
                this.makeEmpty();
                for (let e = 0, n = t.length; e < n; e++) this.expandByPoint(t[e]);
                return this
            }
            setFromCenterAndSize(t, e) {
                const n = au.copy(e).multiplyScalar(.5);
                return this.min.copy(t).sub(n), this.max.copy(t).add(n), this
            }
            setFromObject(t, e = !1) {
                return this.makeEmpty(), this.expandByObject(t, e)
            }
            clone() {
                return (new this.constructor).copy(this)
            }
            copy(t) {
                return this.min.copy(t.min), this.max.copy(t.max), this
            }
            makeEmpty() {
                return this.min.x = this.min.y = this.min.z = 1 / 0, this.max.x = this.max.y = this.max.z = -1 / 0, this
            }
            isEmpty() {
                return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z
            }
            getCenter(t) {
                return this.isEmpty() ? t.set(0, 0, 0) : t.addVectors(this.min, this.max).multiplyScalar(.5)
            }
            getSize(t) {
                return this.isEmpty() ? t.set(0, 0, 0) : t.subVectors(this.max, this.min)
            }
            expandByPoint(t) {
                return this.min.min(t), this.max.max(t), this
            }
            expandByVector(t) {
                return this.min.sub(t), this.max.add(t), this
            }
            expandByScalar(t) {
                return this.min.addScalar(-t), this.max.addScalar(t), this
            }
            expandByObject(t, e = !1) {
                if (t.updateWorldMatrix(!1, !1), void 0 !== t.boundingBox) null === t.boundingBox && t.computeBoundingBox(), su.copy(t.boundingBox), su.applyMatrix4(t.matrixWorld), this.union(su);
                else {
                    const n = t.geometry;
                    if (void 0 !== n)
                        if (e && void 0 !== n.attributes && void 0 !== n.attributes.position) {
                            const e = n.attributes.position;
                            for (let n = 0, i = e.count; n < i; n++) au.fromBufferAttribute(e, n).applyMatrix4(t.matrixWorld), this.expandByPoint(au)
                        } else null === n.boundingBox && n.computeBoundingBox(), su.copy(n.boundingBox), su.applyMatrix4(t.matrixWorld), this.union(su)
                }
                const n = t.children;
                for (let t = 0, i = n.length; t < i; t++) this.expandByObject(n[t], e);
                return this
            }
            containsPoint(t) {
                return !(t.x < this.min.x || t.x > this.max.x || t.y < this.min.y || t.y > this.max.y || t.z < this.min.z || t.z > this.max.z)
            }
            containsBox(t) {
                return this.min.x <= t.min.x && t.max.x <= this.max.x && this.min.y <= t.min.y && t.max.y <= this.max.y && this.min.z <= t.min.z && t.max.z <= this.max.z
            }
            getParameter(t, e) {
                return e.set((t.x - this.min.x) / (this.max.x - this.min.x), (t.y - this.min.y) / (this.max.y - this.min.y), (t.z - this.min.z) / (this.max.z - this.min.z))
            }
            intersectsBox(t) {
                return !(t.max.x < this.min.x || t.min.x > this.max.x || t.max.y < this.min.y || t.min.y > this.max.y || t.max.z < this.min.z || t.min.z > this.max.z)
            }
            intersectsSphere(t) {
                return this.clampPoint(t.center, au), au.distanceToSquared(t.center) <= t.radius * t.radius
            }
            intersectsPlane(t) {
                let e, n;
                return t.normal.x > 0 ? (e = t.normal.x * this.min.x, n = t.normal.x * this.max.x) : (e = t.normal.x * this.max.x, n = t.normal.x * this.min.x), t.normal.y > 0 ? (e += t.normal.y * this.min.y, n += t.normal.y * this.max.y) : (e += t.normal.y * this.max.y, n += t.normal.y * this.min.y), t.normal.z > 0 ? (e += t.normal.z * this.min.z, n += t.normal.z * this.max.z) : (e += t.normal.z * this.max.z, n += t.normal.z * this.min.z), e <= -t.constant && n >= -t.constant
            }
            intersectsTriangle(t) {
                if (this.isEmpty()) return !1;
                this.getCenter(pu), fu.subVectors(this.max, pu), ou.subVectors(t.a, pu), lu.subVectors(t.b, pu), cu.subVectors(t.c, pu), uu.subVectors(lu, ou), hu.subVectors(cu, lu), du.subVectors(ou, cu);
                let e = [0, -uu.z, uu.y, 0, -hu.z, hu.y, 0, -du.z, du.y, uu.z, 0, -uu.x, hu.z, 0, -hu.x, du.z, 0, -du.x, -uu.y, uu.x, 0, -hu.y, hu.x, 0, -du.y, du.x, 0];
                return !!_u(e, ou, lu, cu, fu) && (e = [1, 0, 0, 0, 1, 0, 0, 0, 1], !!_u(e, ou, lu, cu, fu) && (mu.crossVectors(uu, hu), e = [mu.x, mu.y, mu.z], _u(e, ou, lu, cu, fu)))
            }
            clampPoint(t, e) {
                return e.copy(t).clamp(this.min, this.max)
            }
            distanceToPoint(t) {
                return this.clampPoint(t, au).distanceTo(t)
            }
            getBoundingSphere(t) {
                return this.isEmpty() ? t.makeEmpty() : (this.getCenter(t.center), t.radius = .5 * this.getSize(au).length()), t
            }
            intersect(t) {
                return this.min.max(t.min), this.max.min(t.max), this.isEmpty() && this.makeEmpty(), this
            }
            union(t) {
                return this.min.min(t.min), this.max.max(t.max), this
            }
            applyMatrix4(t) {
                return this.isEmpty() || (ru[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(t), ru[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(t), ru[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(t), ru[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(t), ru[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(t), ru[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(t), ru[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(t), ru[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(t), this.setFromPoints(ru)), this
            }
            translate(t) {
                return this.min.add(t), this.max.add(t), this
            }
            equals(t) {
                return t.min.equals(this.min) && t.max.equals(this.max)
            }
        }
        const ru = [new bc, new bc, new bc, new bc, new bc, new bc, new bc, new bc],
            au = new bc,
            su = new iu,
            ou = new bc,
            lu = new bc,
            cu = new bc,
            uu = new bc,
            hu = new bc,
            du = new bc,
            pu = new bc,
            fu = new bc,
            mu = new bc,
            gu = new bc;

        function _u(t, e, n, i, r) {
            for (let a = 0, s = t.length - 3; a <= s; a += 3) {
                gu.fromArray(t, a);
                const s = r.x * Math.abs(gu.x) + r.y * Math.abs(gu.y) + r.z * Math.abs(gu.z),
                    o = e.dot(gu),
                    l = n.dot(gu),
                    c = i.dot(gu);
                if (Math.max(-Math.max(o, l, c), Math.min(o, l, c)) > s) return !1
            }
            return !0
        }
        const vu = new iu,
            xu = new bc,
            yu = new bc;
        class Mu {
            constructor(t = new bc, e = -1) {
                this.center = t, this.radius = e
            }
            set(t, e) {
                return this.center.copy(t), this.radius = e, this
            }
            setFromPoints(t, e) {
                const n = this.center;
                void 0 !== e ? n.copy(e) : vu.setFromPoints(t).getCenter(n);
                let i = 0;
                for (let e = 0, r = t.length; e < r; e++) i = Math.max(i, n.distanceToSquared(t[e]));
                return this.radius = Math.sqrt(i), this
            }
            copy(t) {
                return this.center.copy(t.center), this.radius = t.radius, this
            }
            isEmpty() {
                return this.radius < 0
            }
            makeEmpty() {
                return this.center.set(0, 0, 0), this.radius = -1, this
            }
            containsPoint(t) {
                return t.distanceToSquared(this.center) <= this.radius * this.radius
            }
            distanceToPoint(t) {
                return t.distanceTo(this.center) - this.radius
            }
            intersectsSphere(t) {
                const e = this.radius + t.radius;
                return t.center.distanceToSquared(this.center) <= e * e
            }
            intersectsBox(t) {
                return t.intersectsSphere(this)
            }
            intersectsPlane(t) {
                return Math.abs(t.distanceToPoint(this.center)) <= this.radius
            }
            clampPoint(t, e) {
                const n = this.center.distanceToSquared(t);
                return e.copy(t), n > this.radius * this.radius && (e.sub(this.center).normalize(), e.multiplyScalar(this.radius).add(this.center)), e
            }
            getBoundingBox(t) {
                return this.isEmpty() ? (t.makeEmpty(), t) : (t.set(this.center, this.center), t.expandByScalar(this.radius), t)
            }
            applyMatrix4(t) {
                return this.center.applyMatrix4(t), this.radius = this.radius * t.getMaxScaleOnAxis(), this
            }
            translate(t) {
                return this.center.add(t), this
            }
            expandByPoint(t) {
                if (this.isEmpty()) return this.center.copy(t), this.radius = 0, this;
                xu.subVectors(t, this.center);
                const e = xu.lengthSq();
                if (e > this.radius * this.radius) {
                    const t = Math.sqrt(e),
                        n = .5 * (t - this.radius);
                    this.center.addScaledVector(xu, n / t), this.radius += n
                }
                return this
            }
            union(t) {
                return t.isEmpty() ? this : this.isEmpty() ? (this.copy(t), this) : (!0 === this.center.equals(t.center) ? this.radius = Math.max(this.radius, t.radius) : (yu.subVectors(t.center, this.center).setLength(t.radius), this.expandByPoint(xu.copy(t.center).add(yu)), this.expandByPoint(xu.copy(t.center).sub(yu))), this)
            }
            equals(t) {
                return t.center.equals(this.center) && t.radius === this.radius
            }
            clone() {
                return (new this.constructor).copy(this)
            }
        }
        const Su = new bc,
            Eu = new bc,
            Tu = new tc;
        class bu {
            constructor(t = new bc(1, 0, 0), e = 0) {
                this.isPlane = !0, this.normal = t, this.constant = e
            }
            set(t, e) {
                return this.normal.copy(t), this.constant = e, this
            }
            setComponents(t, e, n, i) {
                return this.normal.set(t, e, n), this.constant = i, this
            }
            setFromNormalAndCoplanarPoint(t, e) {
                return this.normal.copy(t), this.constant = -e.dot(this.normal), this
            }
            setFromCoplanarPoints(t, e, n) {
                const i = Su.subVectors(n, e).cross(Eu.subVectors(t, e)).normalize();
                return this.setFromNormalAndCoplanarPoint(i, t), this
            }
            copy(t) {
                return this.normal.copy(t.normal), this.constant = t.constant, this
            }
            normalize() {
                const t = 1 / this.normal.length();
                return this.normal.multiplyScalar(t), this.constant *= t, this
            }
            negate() {
                return this.constant *= -1, this.normal.negate(), this
            }
            distanceToPoint(t) {
                return this.normal.dot(t) + this.constant
            }
            distanceToSphere(t) {
                return this.distanceToPoint(t.center) - t.radius
            }
            projectPoint(t, e) {
                return e.copy(t).addScaledVector(this.normal, -this.distanceToPoint(t))
            }
            intersectLine(t, e) {
                const n = t.delta(Su),
                    i = this.normal.dot(n);
                if (0 === i) return 0 === this.distanceToPoint(t.start) ? e.copy(t.start) : null;
                const r = -(t.start.dot(this.normal) + this.constant) / i;
                return r < 0 || r > 1 ? null : e.copy(t.start).addScaledVector(n, r)
            }
            intersectsLine(t) {
                const e = this.distanceToPoint(t.start),
                    n = this.distanceToPoint(t.end);
                return e < 0 && n > 0 || n < 0 && e > 0
            }
            intersectsBox(t) {
                return t.intersectsPlane(this)
            }
            intersectsSphere(t) {
                return t.intersectsPlane(this)
            }
            coplanarPoint(t) {
                return t.copy(this.normal).multiplyScalar(-this.constant)
            }
            applyMatrix4(t, e) {
                const n = e || Tu.getNormalMatrix(t),
                    i = this.coplanarPoint(Su).applyMatrix4(t),
                    r = this.normal.applyMatrix3(n).normalize();
                return this.constant = -i.dot(r), this
            }
            translate(t) {
                return this.constant -= t.dot(this.normal), this
            }
            equals(t) {
                return t.normal.equals(this.normal) && t.constant === this.constant
            }
            clone() {
                return (new this.constructor).copy(this)
            }
        }
        const wu = new Mu,
            Au = new bc;
        class Ru {
            constructor(t = new bu, e = new bu, n = new bu, i = new bu, r = new bu, a = new bu) {
                this.planes = [t, e, n, i, r, a]
            }
            set(t, e, n, i, r, a) {
                const s = this.planes;
                return s[0].copy(t), s[1].copy(e), s[2].copy(n), s[3].copy(i), s[4].copy(r), s[5].copy(a), this
            }
            copy(t) {
                const e = this.planes;
                for (let n = 0; n < 6; n++) e[n].copy(t.planes[n]);
                return this
            }
            setFromProjectionMatrix(t, e = 2e3) {
                const n = this.planes,
                    i = t.elements,
                    r = i[0],
                    a = i[1],
                    s = i[2],
                    o = i[3],
                    l = i[4],
                    c = i[5],
                    u = i[6],
                    h = i[7],
                    d = i[8],
                    p = i[9],
                    f = i[10],
                    m = i[11],
                    g = i[12],
                    _ = i[13],
                    v = i[14],
                    x = i[15];
                if (n[0].setComponents(o - r, h - l, m - d, x - g).normalize(), n[1].setComponents(o + r, h + l, m + d, x + g).normalize(), n[2].setComponents(o + a, h + c, m + p, x + _).normalize(), n[3].setComponents(o - a, h - c, m - p, x - _).normalize(), n[4].setComponents(o - s, h - u, m - f, x - v).normalize(), e === Hl) n[5].setComponents(o + s, h + u, m + f, x + v).normalize();
                else {
                    if (e !== Gl) throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: " + e);
                    n[5].setComponents(s, u, f, v).normalize()
                }
                return this
            }
            intersectsObject(t) {
                if (void 0 !== t.boundingSphere) null === t.boundingSphere && t.computeBoundingSphere(), wu.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);
                else {
                    const e = t.geometry;
                    null === e.boundingSphere && e.computeBoundingSphere(), wu.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)
                }
                return this.intersectsSphere(wu)
            }
            intersectsSprite(t) {
                return wu.center.set(0, 0, 0), wu.radius = .7071067811865476, wu.applyMatrix4(t.matrixWorld), this.intersectsSphere(wu)
            }
            intersectsSphere(t) {
                const e = this.planes,
                    n = t.center,
                    i = -t.radius;
                for (let t = 0; t < 6; t++)
                    if (e[t].distanceToPoint(n) < i) return !1;
                return !0
            }
            intersectsBox(t) {
                const e = this.planes;
                for (let n = 0; n < 6; n++) {
                    const i = e[n];
                    if (Au.x = i.normal.x > 0 ? t.max.x : t.min.x, Au.y = i.normal.y > 0 ? t.max.y : t.min.y, Au.z = i.normal.z > 0 ? t.max.z : t.min.z, i.distanceToPoint(Au) < 0) return !1
                }
                return !0
            }
            containsPoint(t) {
                const e = this.planes;
                for (let n = 0; n < 6; n++)
                    if (e[n].distanceToPoint(t) < 0) return !1;
                return !0
            }
            clone() {
                return (new this.constructor).copy(this)
            }
        }
        class Cu {
            constructor(t = 0, e = 0, n = 0, i = 1) {
                Cu.prototype.isVector4 = !0, this.x = t, this.y = e, this.z = n, this.w = i
            }
            get width() {
                return this.z
            }
            set width(t) {
                this.z = t
            }
            get height() {
                return this.w
            }
            set height(t) {
                this.w = t
            }
            set(t, e, n, i) {
                return this.x = t, this.y = e, this.z = n, this.w = i, this
            }
            setScalar(t) {
                return this.x = t, this.y = t, this.z = t, this.w = t, this
            }
            setX(t) {
                return this.x = t, this
            }
            setY(t) {
                return this.y = t, this
            }
            setZ(t) {
                return this.z = t, this
            }
            setW(t) {
                return this.w = t, this
            }
            setComponent(t, e) {
                switch (t) {
                    case 0:
                        this.x = e;
                        break;
                    case 1:
                        this.y = e;
                        break;
                    case 2:
                        this.z = e;
                        break;
                    case 3:
                        this.w = e;
                        break;
                    default:
                        throw new Error("index is out of range: " + t)
                }
                return this
            }
            getComponent(t) {
                switch (t) {
                    case 0:
                        return this.x;
                    case 1:
                        return this.y;
                    case 2:
                        return this.z;
                    case 3:
                        return this.w;
                    default:
                        throw new Error("index is out of range: " + t)
                }
            }
            clone() {
                return new this.constructor(this.x, this.y, this.z, this.w)
            }
            copy(t) {
                return this.x = t.x, this.y = t.y, this.z = t.z, this.w = void 0 !== t.w ? t.w : 1, this
            }
            add(t) {
                return this.x += t.x, this.y += t.y, this.z += t.z, this.w += t.w, this
            }
            addScalar(t) {
                return this.x += t, this.y += t, this.z += t, this.w += t, this
            }
            addVectors(t, e) {
                return this.x = t.x + e.x, this.y = t.y + e.y, this.z = t.z + e.z, this.w = t.w + e.w, this
            }
            addScaledVector(t, e) {
                return this.x += t.x * e, this.y += t.y * e, this.z += t.z * e, this.w += t.w * e, this
            }
            sub(t) {
                return this.x -= t.x, this.y -= t.y, this.z -= t.z, this.w -= t.w, this
            }
            subScalar(t) {
                return this.x -= t, this.y -= t, this.z -= t, this.w -= t, this
            }
            subVectors(t, e) {
                return this.x = t.x - e.x, this.y = t.y - e.y, this.z = t.z - e.z, this.w = t.w - e.w, this
            }
            multiply(t) {
                return this.x *= t.x, this.y *= t.y, this.z *= t.z, this.w *= t.w, this
            }
            multiplyScalar(t) {
                return this.x *= t, this.y *= t, this.z *= t, this.w *= t, this
            }
            applyMatrix4(t) {
                const e = this.x,
                    n = this.y,
                    i = this.z,
                    r = this.w,
                    a = t.elements;
                return this.x = a[0] * e + a[4] * n + a[8] * i + a[12] * r, this.y = a[1] * e + a[5] * n + a[9] * i + a[13] * r, this.z = a[2] * e + a[6] * n + a[10] * i + a[14] * r, this.w = a[3] * e + a[7] * n + a[11] * i + a[15] * r, this
            }
            divideScalar(t) {
                return this.multiplyScalar(1 / t)
            }
            setAxisAngleFromQuaternion(t) {
                this.w = 2 * Math.acos(t.w);
                const e = Math.sqrt(1 - t.w * t.w);
                return e < 1e-4 ? (this.x = 1, this.y = 0, this.z = 0) : (this.x = t.x / e, this.y = t.y / e, this.z = t.z / e), this
            }
            setAxisAngleFromRotationMatrix(t) {
                let e, n, i, r;
                const a = .01,
                    s = .1,
                    o = t.elements,
                    l = o[0],
                    c = o[4],
                    u = o[8],
                    h = o[1],
                    d = o[5],
                    p = o[9],
                    f = o[2],
                    m = o[6],
                    g = o[10];
                if (Math.abs(c - h) < a && Math.abs(u - f) < a && Math.abs(p - m) < a) {
                    if (Math.abs(c + h) < s && Math.abs(u + f) < s && Math.abs(p + m) < s && Math.abs(l + d + g - 3) < s) return this.set(1, 0, 0, 0), this;
                    e = Math.PI;
                    const t = (l + 1) / 2,
                        o = (d + 1) / 2,
                        _ = (g + 1) / 2,
                        v = (c + h) / 4,
                        x = (u + f) / 4,
                        y = (p + m) / 4;
                    return t > o && t > _ ? t < a ? (n = 0, i = .707106781, r = .707106781) : (n = Math.sqrt(t), i = v / n, r = x / n) : o > _ ? o < a ? (n = .707106781, i = 0, r = .707106781) : (i = Math.sqrt(o), n = v / i, r = y / i) : _ < a ? (n = .707106781, i = .707106781, r = 0) : (r = Math.sqrt(_), n = x / r, i = y / r), this.set(n, i, r, e), this
                }
                let _ = Math.sqrt((m - p) * (m - p) + (u - f) * (u - f) + (h - c) * (h - c));
                return Math.abs(_) < .001 && (_ = 1), this.x = (m - p) / _, this.y = (u - f) / _, this.z = (h - c) / _, this.w = Math.acos((l + d + g - 1) / 2), this
            }
            min(t) {
                return this.x = Math.min(this.x, t.x), this.y = Math.min(this.y, t.y), this.z = Math.min(this.z, t.z), this.w = Math.min(this.w, t.w), this
            }
            max(t) {
                return this.x = Math.max(this.x, t.x), this.y = Math.max(this.y, t.y), this.z = Math.max(this.z, t.z), this.w = Math.max(this.w, t.w), this
            }
            clamp(t, e) {
                return this.x = Math.max(t.x, Math.min(e.x, this.x)), this.y = Math.max(t.y, Math.min(e.y, this.y)), this.z = Math.max(t.z, Math.min(e.z, this.z)), this.w = Math.max(t.w, Math.min(e.w, this.w)), this
            }
            clampScalar(t, e) {
                return this.x = Math.max(t, Math.min(e, this.x)), this.y = Math.max(t, Math.min(e, this.y)), this.z = Math.max(t, Math.min(e, this.z)), this.w = Math.max(t, Math.min(e, this.w)), this
            }
            clampLength(t, e) {
                const n = this.length();
                return this.divideScalar(n || 1).multiplyScalar(Math.max(t, Math.min(e, n)))
            }
            floor() {
                return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this.w = Math.floor(this.w), this
            }
            ceil() {
                return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this.w = Math.ceil(this.w), this
            }
            round() {
                return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this.w = Math.round(this.w), this
            }
            roundToZero() {
                return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this.w = Math.trunc(this.w), this
            }
            negate() {
                return this.x = -this.x, this.y = -this.y, this.z = -this.z, this.w = -this.w, this
            }
            dot(t) {
                return this.x * t.x + this.y * t.y + this.z * t.z + this.w * t.w
            }
            lengthSq() {
                return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
            }
            length() {
                return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)
            }
            manhattanLength() {
                return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w)
            }
            normalize() {
                return this.divideScalar(this.length() || 1)
            }
            setLength(t) {
                return this.normalize().multiplyScalar(t)
            }
            lerp(t, e) {
                return this.x += (t.x - this.x) * e, this.y += (t.y - this.y) * e, this.z += (t.z - this.z) * e, this.w += (t.w - this.w) * e, this
            }
            lerpVectors(t, e, n) {
                return this.x = t.x + (e.x - t.x) * n, this.y = t.y + (e.y - t.y) * n, this.z = t.z + (e.z - t.z) * n, this.w = t.w + (e.w - t.w) * n, this
            }
            equals(t) {
                return t.x === this.x && t.y === this.y && t.z === this.z && t.w === this.w
            }
            fromArray(t, e = 0) {
                return this.x = t[e], this.y = t[e + 1], this.z = t[e + 2], this.w = t[e + 3], this
            }
            toArray(t = [], e = 0) {
                return t[e] = this.x, t[e + 1] = this.y, t[e + 2] = this.z, t[e + 3] = this.w, t
            }
            fromBufferAttribute(t, e) {
                return this.x = t.getX(e), this.y = t.getY(e), this.z = t.getZ(e), this.w = t.getW(e), this
            }
            random() {
                return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this.w = Math.random(), this
            }*[Symbol.iterator]() {
                yield this.x, yield this.y, yield this.z, yield this.w
            }
        }

        function Lu() {
            let t = null,
                e = !1,
                n = null,
                i = null;

            function r(e, a) {
                n(e, a), i = t.requestAnimationFrame(r)
            }
            return {
                start: function() {
                    !0 !== e && null !== n && (i = t.requestAnimationFrame(r), e = !0)
                },
                stop: function() {
                    t.cancelAnimationFrame(i), e = !1
                },
                setAnimationLoop: function(t) {
                    n = t
                },
                setContext: function(e) {
                    t = e
                }
            }
        }

        function Pu(t, e) {
            const n = e.isWebGL2,
                i = new WeakMap;
            return {
                get: function(t) {
                    return t.isInterleavedBufferAttribute && (t = t.data), i.get(t)
                },
                remove: function(e) {
                    e.isInterleavedBufferAttribute && (e = e.data);
                    const n = i.get(e);
                    n && (t.deleteBuffer(n.buffer), i.delete(e))
                },
                update: function(e, r) {
                    if (e.isGLBufferAttribute) {
                        const t = i.get(e);
                        return void((!t || t.version < e.version) && i.set(e, {
                            buffer: e.buffer,
                            type: e.type,
                            bytesPerElement: e.elementSize,
                            version: e.version
                        }))
                    }
                    e.isInterleavedBufferAttribute && (e = e.data);
                    const a = i.get(e);
                    void 0 === a ? i.set(e, function(e, i) {
                        const r = e.array,
                            a = e.usage,
                            s = t.createBuffer();
                        let o;
                        if (t.bindBuffer(i, s), t.bufferData(i, r, a), e.onUploadCallback(), r instanceof Float32Array) o = t.FLOAT;
                        else if (r instanceof Uint16Array)
                            if (e.isFloat16BufferAttribute) {
                                if (!n) throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");
                                o = t.HALF_FLOAT
                            } else o = t.UNSIGNED_SHORT;
                        else if (r instanceof Int16Array) o = t.SHORT;
                        else if (r instanceof Uint32Array) o = t.UNSIGNED_INT;
                        else if (r instanceof Int32Array) o = t.INT;
                        else if (r instanceof Int8Array) o = t.BYTE;
                        else if (r instanceof Uint8Array) o = t.UNSIGNED_BYTE;
                        else {
                            if (!(r instanceof Uint8ClampedArray)) throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: " + r);
                            o = t.UNSIGNED_BYTE
                        }
                        return {
                            buffer: s,
                            type: o,
                            bytesPerElement: r.BYTES_PER_ELEMENT,
                            version: e.version
                        }
                    }(e, r)) : a.version < e.version && (function(e, i, r) {
                        const a = i.array,
                            s = i.updateRange;
                        t.bindBuffer(r, e), -1 === s.count ? t.bufferSubData(r, 0, a) : (n ? t.bufferSubData(r, s.offset * a.BYTES_PER_ELEMENT, a, s.offset, s.count) : t.bufferSubData(r, s.offset * a.BYTES_PER_ELEMENT, a.subarray(s.offset, s.offset + s.count)), s.count = -1), i.onUploadCallback()
                    }(a.buffer, e, r), a.version = e.version)
                }
            }
        }
        const Uu = new bc,
            Du = new Ql;
        class Iu {
            constructor(t, e, n = !1) {
                if (Array.isArray(t)) throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");
                this.isBufferAttribute = !0, this.name = "", this.array = t, this.itemSize = e, this.count = void 0 !== t ? t.length / e : 0, this.normalized = n, this.usage = 35044, this.updateRange = {
                    offset: 0,
                    count: -1
                }, this.gpuType = El, this.version = 0
            }
            onUploadCallback() {}
            set needsUpdate(t) {
                !0 === t && this.version++
            }
            setUsage(t) {
                return this.usage = t, this
            }
            copy(t) {
                return this.name = t.name, this.array = new t.array.constructor(t.array), this.itemSize = t.itemSize, this.count = t.count, this.normalized = t.normalized, this.usage = t.usage, this.gpuType = t.gpuType, this
            }
            copyAt(t, e, n) {
                t *= this.itemSize, n *= e.itemSize;
                for (let i = 0, r = this.itemSize; i < r; i++) this.array[t + i] = e.array[n + i];
                return this
            }
            copyArray(t) {
                return this.array.set(t), this
            }
            applyMatrix3(t) {
                if (2 === this.itemSize)
                    for (let e = 0, n = this.count; e < n; e++) Du.fromBufferAttribute(this, e), Du.applyMatrix3(t), this.setXY(e, Du.x, Du.y);
                else if (3 === this.itemSize)
                    for (let e = 0, n = this.count; e < n; e++) Uu.fromBufferAttribute(this, e), Uu.applyMatrix3(t), this.setXYZ(e, Uu.x, Uu.y, Uu.z);
                return this
            }
            applyMatrix4(t) {
                for (let e = 0, n = this.count; e < n; e++) Uu.fromBufferAttribute(this, e), Uu.applyMatrix4(t), this.setXYZ(e, Uu.x, Uu.y, Uu.z);
                return this
            }
            applyNormalMatrix(t) {
                for (let e = 0, n = this.count; e < n; e++) Uu.fromBufferAttribute(this, e), Uu.applyNormalMatrix(t), this.setXYZ(e, Uu.x, Uu.y, Uu.z);
                return this
            }
            transformDirection(t) {
                for (let e = 0, n = this.count; e < n; e++) Uu.fromBufferAttribute(this, e), Uu.transformDirection(t), this.setXYZ(e, Uu.x, Uu.y, Uu.z);
                return this
            }
            set(t, e = 0) {
                return this.array.set(t, e), this
            }
            getComponent(t, e) {
                let n = this.array[t * this.itemSize + e];
                return this.normalized && (n = $l(n, this.array)), n
            }
            setComponent(t, e, n) {
                return this.normalized && (n = Jl(n, this.array)), this.array[t * this.itemSize + e] = n, this
            }
            getX(t) {
                let e = this.array[t * this.itemSize];
                return this.normalized && (e = $l(e, this.array)), e
            }
            setX(t, e) {
                return this.normalized && (e = Jl(e, this.array)), this.array[t * this.itemSize] = e, this
            }
            getY(t) {
                let e = this.array[t * this.itemSize + 1];
                return this.normalized && (e = $l(e, this.array)), e
            }
            setY(t, e) {
                return this.normalized && (e = Jl(e, this.array)), this.array[t * this.itemSize + 1] = e, this
            }
            getZ(t) {
                let e = this.array[t * this.itemSize + 2];
                return this.normalized && (e = $l(e, this.array)), e
            }
            setZ(t, e) {
                return this.normalized && (e = Jl(e, this.array)), this.array[t * this.itemSize + 2] = e, this
            }
            getW(t) {
                let e = this.array[t * this.itemSize + 3];
                return this.normalized && (e = $l(e, this.array)), e
            }
            setW(t, e) {
                return this.normalized && (e = Jl(e, this.array)), this.array[t * this.itemSize + 3] = e, this
            }
            setXY(t, e, n) {
                return t *= this.itemSize, this.normalized && (e = Jl(e, this.array), n = Jl(n, this.array)), this.array[t + 0] = e, this.array[t + 1] = n, this
            }
            setXYZ(t, e, n, i) {
                return t *= this.itemSize, this.normalized && (e = Jl(e, this.array), n = Jl(n, this.array), i = Jl(i, this.array)), this.array[t + 0] = e, this.array[t + 1] = n, this.array[t + 2] = i, this
            }
            setXYZW(t, e, n, i, r) {
                return t *= this.itemSize, this.normalized && (e = Jl(e, this.array), n = Jl(n, this.array), i = Jl(i, this.array), r = Jl(r, this.array)), this.array[t + 0] = e, this.array[t + 1] = n, this.array[t + 2] = i, this.array[t + 3] = r, this
            }
            onUpload(t) {
                return this.onUploadCallback = t, this
            }
            clone() {
                return new this.constructor(this.array, this.itemSize).copy(this)
            }
            toJSON() {
                const t = {
                    itemSize: this.itemSize,
                    type: this.array.constructor.name,
                    array: Array.from(this.array),
                    normalized: this.normalized
                };
                return "" !== this.name && (t.name = this.name), 35044 !== this.usage && (t.usage = this.usage), 0 === this.updateRange.offset && -1 === this.updateRange.count || (t.updateRange = this.updateRange), t
            }
        }
        class Ou extends Iu {
            constructor(t, e, n) {
                super(new Uint16Array(t), e, n)
            }
        }
        class Nu extends Iu {
            constructor(t, e, n) {
                super(new Uint32Array(t), e, n)
            }
        }
        class Fu extends Iu {
            constructor(t, e, n) {
                super(new Float32Array(t), e, n)
            }
        }
        let zu = 0;
        const Bu = new Rc,
            ku = new Qc,
            Hu = new bc,
            Gu = new iu,
            Vu = new iu,
            Wu = new bc;
        class Xu extends Zo {
            constructor() {
                super(), this.isBufferGeometry = !0, Object.defineProperty(this, "id", {
                    value: zu++
                }), this.uuid = jl(), this.name = "", this.type = "BufferGeometry", this.index = null, this.attributes = {}, this.morphAttributes = {}, this.morphTargetsRelative = !1, this.groups = [], this.boundingBox = null, this.boundingSphere = null, this.drawRange = {
                    start: 0,
                    count: 1 / 0
                }, this.userData = {}
            }
            getIndex() {
                return this.index
            }
            setIndex(t) {
                return Array.isArray(t) ? this.index = new(Wo(t) ? Nu : Ou)(t, 1) : this.index = t, this
            }
            getAttribute(t) {
                return this.attributes[t]
            }
            setAttribute(t, e) {
                return this.attributes[t] = e, this
            }
            deleteAttribute(t) {
                return delete this.attributes[t], this
            }
            hasAttribute(t) {
                return void 0 !== this.attributes[t]
            }
            addGroup(t, e, n = 0) {
                this.groups.push({
                    start: t,
                    count: e,
                    materialIndex: n
                })
            }
            clearGroups() {
                this.groups = []
            }
            setDrawRange(t, e) {
                this.drawRange.start = t, this.drawRange.count = e
            }
            applyMatrix4(t) {
                const e = this.attributes.position;
                void 0 !== e && (e.applyMatrix4(t), e.needsUpdate = !0);
                const n = this.attributes.normal;
                if (void 0 !== n) {
                    const e = (new tc).getNormalMatrix(t);
                    n.applyNormalMatrix(e), n.needsUpdate = !0
                }
                const i = this.attributes.tangent;
                return void 0 !== i && (i.transformDirection(t), i.needsUpdate = !0), null !== this.boundingBox && this.computeBoundingBox(), null !== this.boundingSphere && this.computeBoundingSphere(), this
            }
            applyQuaternion(t) {
                return Bu.makeRotationFromQuaternion(t), this.applyMatrix4(Bu), this
            }
            rotateX(t) {
                return Bu.makeRotationX(t), this.applyMatrix4(Bu), this
            }
            rotateY(t) {
                return Bu.makeRotationY(t), this.applyMatrix4(Bu), this
            }
            rotateZ(t) {
                return Bu.makeRotationZ(t), this.applyMatrix4(Bu), this
            }
            translate(t, e, n) {
                return Bu.makeTranslation(t, e, n), this.applyMatrix4(Bu), this
            }
            scale(t, e, n) {
                return Bu.makeScale(t, e, n), this.applyMatrix4(Bu), this
            }
            lookAt(t) {
                return ku.lookAt(t), ku.updateMatrix(), this.applyMatrix4(ku.matrix), this
            }
            center() {
                return this.computeBoundingBox(), this.boundingBox.getCenter(Hu).negate(), this.translate(Hu.x, Hu.y, Hu.z), this
            }
            setFromPoints(t) {
                const e = [];
                for (let n = 0, i = t.length; n < i; n++) {
                    const i = t[n];
                    e.push(i.x, i.y, i.z || 0)
                }
                return this.setAttribute("position", new Fu(e, 3)), this
            }
            computeBoundingBox() {
                null === this.boundingBox && (this.boundingBox = new iu);
                const t = this.attributes.position,
                    e = this.morphAttributes.position;
                if (t && t.isGLBufferAttribute) return console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".', this), void this.boundingBox.set(new bc(-1 / 0, -1 / 0, -1 / 0), new bc(1 / 0, 1 / 0, 1 / 0));
                if (void 0 !== t) {
                    if (this.boundingBox.setFromBufferAttribute(t), e)
                        for (let t = 0, n = e.length; t < n; t++) {
                            const n = e[t];
                            Gu.setFromBufferAttribute(n), this.morphTargetsRelative ? (Wu.addVectors(this.boundingBox.min, Gu.min), this.boundingBox.expandByPoint(Wu), Wu.addVectors(this.boundingBox.max, Gu.max), this.boundingBox.expandByPoint(Wu)) : (this.boundingBox.expandByPoint(Gu.min), this.boundingBox.expandByPoint(Gu.max))
                        }
                } else this.boundingBox.makeEmpty();
                (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) && console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this)
            }
            computeBoundingSphere() {
                null === this.boundingSphere && (this.boundingSphere = new Mu);
                const t = this.attributes.position,
                    e = this.morphAttributes.position;
                if (t && t.isGLBufferAttribute) return console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".', this), void this.boundingSphere.set(new bc, 1 / 0);
                if (t) {
                    const n = this.boundingSphere.center;
                    if (Gu.setFromBufferAttribute(t), e)
                        for (let t = 0, n = e.length; t < n; t++) {
                            const n = e[t];
                            Vu.setFromBufferAttribute(n), this.morphTargetsRelative ? (Wu.addVectors(Gu.min, Vu.min), Gu.expandByPoint(Wu), Wu.addVectors(Gu.max, Vu.max), Gu.expandByPoint(Wu)) : (Gu.expandByPoint(Vu.min), Gu.expandByPoint(Vu.max))
                        }
                    Gu.getCenter(n);
                    let i = 0;
                    for (let e = 0, r = t.count; e < r; e++) Wu.fromBufferAttribute(t, e), i = Math.max(i, n.distanceToSquared(Wu));
                    if (e)
                        for (let r = 0, a = e.length; r < a; r++) {
                            const a = e[r],
                                s = this.morphTargetsRelative;
                            for (let e = 0, r = a.count; e < r; e++) Wu.fromBufferAttribute(a, e), s && (Hu.fromBufferAttribute(t, e), Wu.add(Hu)), i = Math.max(i, n.distanceToSquared(Wu))
                        }
                    this.boundingSphere.radius = Math.sqrt(i), isNaN(this.boundingSphere.radius) && console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this)
                }
            }
            computeTangents() {
                const t = this.index,
                    e = this.attributes;
                if (null === t || void 0 === e.position || void 0 === e.normal || void 0 === e.uv) return void console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");
                const n = t.array,
                    i = e.position.array,
                    r = e.normal.array,
                    a = e.uv.array,
                    s = i.length / 3;
                !1 === this.hasAttribute("tangent") && this.setAttribute("tangent", new Iu(new Float32Array(4 * s), 4));
                const o = this.getAttribute("tangent").array,
                    l = [],
                    c = [];
                for (let t = 0; t < s; t++) l[t] = new bc, c[t] = new bc;
                const u = new bc,
                    h = new bc,
                    d = new bc,
                    p = new Ql,
                    f = new Ql,
                    m = new Ql,
                    g = new bc,
                    _ = new bc;

                function v(t, e, n) {
                    u.fromArray(i, 3 * t), h.fromArray(i, 3 * e), d.fromArray(i, 3 * n), p.fromArray(a, 2 * t), f.fromArray(a, 2 * e), m.fromArray(a, 2 * n), h.sub(u), d.sub(u), f.sub(p), m.sub(p);
                    const r = 1 / (f.x * m.y - m.x * f.y);
                    isFinite(r) && (g.copy(h).multiplyScalar(m.y).addScaledVector(d, -f.y).multiplyScalar(r), _.copy(d).multiplyScalar(f.x).addScaledVector(h, -m.x).multiplyScalar(r), l[t].add(g), l[e].add(g), l[n].add(g), c[t].add(_), c[e].add(_), c[n].add(_))
                }
                let x = this.groups;
                0 === x.length && (x = [{
                    start: 0,
                    count: n.length
                }]);
                for (let t = 0, e = x.length; t < e; ++t) {
                    const e = x[t],
                        i = e.start;
                    for (let t = i, r = i + e.count; t < r; t += 3) v(n[t + 0], n[t + 1], n[t + 2])
                }
                const y = new bc,
                    M = new bc,
                    S = new bc,
                    E = new bc;

                function T(t) {
                    S.fromArray(r, 3 * t), E.copy(S);
                    const e = l[t];
                    y.copy(e), y.sub(S.multiplyScalar(S.dot(e))).normalize(), M.crossVectors(E, e);
                    const n = M.dot(c[t]) < 0 ? -1 : 1;
                    o[4 * t] = y.x, o[4 * t + 1] = y.y, o[4 * t + 2] = y.z, o[4 * t + 3] = n
                }
                for (let t = 0, e = x.length; t < e; ++t) {
                    const e = x[t],
                        i = e.start;
                    for (let t = i, r = i + e.count; t < r; t += 3) T(n[t + 0]), T(n[t + 1]), T(n[t + 2])
                }
            }
            computeVertexNormals() {
                const t = this.index,
                    e = this.getAttribute("position");
                if (void 0 !== e) {
                    let n = this.getAttribute("normal");
                    if (void 0 === n) n = new Iu(new Float32Array(3 * e.count), 3), this.setAttribute("normal", n);
                    else
                        for (let t = 0, e = n.count; t < e; t++) n.setXYZ(t, 0, 0, 0);
                    const i = new bc,
                        r = new bc,
                        a = new bc,
                        s = new bc,
                        o = new bc,
                        l = new bc,
                        c = new bc,
                        u = new bc;
                    if (t)
                        for (let h = 0, d = t.count; h < d; h += 3) {
                            const d = t.getX(h + 0),
                                p = t.getX(h + 1),
                                f = t.getX(h + 2);
                            i.fromBufferAttribute(e, d), r.fromBufferAttribute(e, p), a.fromBufferAttribute(e, f), c.subVectors(a, r), u.subVectors(i, r), c.cross(u), s.fromBufferAttribute(n, d), o.fromBufferAttribute(n, p), l.fromBufferAttribute(n, f), s.add(c), o.add(c), l.add(c), n.setXYZ(d, s.x, s.y, s.z), n.setXYZ(p, o.x, o.y, o.z), n.setXYZ(f, l.x, l.y, l.z)
                        } else
                            for (let t = 0, s = e.count; t < s; t += 3) i.fromBufferAttribute(e, t + 0), r.fromBufferAttribute(e, t + 1), a.fromBufferAttribute(e, t + 2), c.subVectors(a, r), u.subVectors(i, r), c.cross(u), n.setXYZ(t + 0, c.x, c.y, c.z), n.setXYZ(t + 1, c.x, c.y, c.z), n.setXYZ(t + 2, c.x, c.y, c.z);
                    this.normalizeNormals(), n.needsUpdate = !0
                }
            }
            normalizeNormals() {
                const t = this.attributes.normal;
                for (let e = 0, n = t.count; e < n; e++) Wu.fromBufferAttribute(t, e), Wu.normalize(), t.setXYZ(e, Wu.x, Wu.y, Wu.z)
            }
            toNonIndexed() {
                function t(t, e) {
                    const n = t.array,
                        i = t.itemSize,
                        r = t.normalized,
                        a = new n.constructor(e.length * i);
                    let s = 0,
                        o = 0;
                    for (let r = 0, l = e.length; r < l; r++) {
                        s = t.isInterleavedBufferAttribute ? e[r] * t.data.stride + t.offset : e[r] * i;
                        for (let t = 0; t < i; t++) a[o++] = n[s++]
                    }
                    return new Iu(a, i, r)
                }
                if (null === this.index) return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."), this;
                const e = new Xu,
                    n = this.index.array,
                    i = this.attributes;
                for (const r in i) {
                    const a = t(i[r], n);
                    e.setAttribute(r, a)
                }
                const r = this.morphAttributes;
                for (const i in r) {
                    const a = [],
                        s = r[i];
                    for (let e = 0, i = s.length; e < i; e++) {
                        const i = t(s[e], n);
                        a.push(i)
                    }
                    e.morphAttributes[i] = a
                }
                e.morphTargetsRelative = this.morphTargetsRelative;
                const a = this.groups;
                for (let t = 0, n = a.length; t < n; t++) {
                    const n = a[t];
                    e.addGroup(n.start, n.count, n.materialIndex)
                }
                return e
            }
            toJSON() {
                const t = {
                    metadata: {
                        version: 4.6,
                        type: "BufferGeometry",
                        generator: "BufferGeometry.toJSON"
                    }
                };
                if (t.uuid = this.uuid, t.type = this.type, "" !== this.name && (t.name = this.name), Object.keys(this.userData).length > 0 && (t.userData = this.userData), void 0 !== this.parameters) {
                    const e = this.parameters;
                    for (const n in e) void 0 !== e[n] && (t[n] = e[n]);
                    return t
                }
                t.data = {
                    attributes: {}
                };
                const e = this.index;
                null !== e && (t.data.index = {
                    type: e.array.constructor.name,
                    array: Array.prototype.slice.call(e.array)
                });
                const n = this.attributes;
                for (const e in n) {
                    const i = n[e];
                    t.data.attributes[e] = i.toJSON(t.data)
                }
                const i = {};
                let r = !1;
                for (const e in this.morphAttributes) {
                    const n = this.morphAttributes[e],
                        a = [];
                    for (let e = 0, i = n.length; e < i; e++) {
                        const i = n[e];
                        a.push(i.toJSON(t.data))
                    }
                    a.length > 0 && (i[e] = a, r = !0)
                }
                r && (t.data.morphAttributes = i, t.data.morphTargetsRelative = this.morphTargetsRelative);
                const a = this.groups;
                a.length > 0 && (t.data.groups = JSON.parse(JSON.stringify(a)));
                const s = this.boundingSphere;
                return null !== s && (t.data.boundingSphere = {
                    center: s.center.toArray(),
                    radius: s.radius
                }), t
            }
            clone() {
                return (new this.constructor).copy(this)
            }
            copy(t) {
                this.index = null, this.attributes = {}, this.morphAttributes = {}, this.groups = [], this.boundingBox = null, this.boundingSphere = null;
                const e = {};
                this.name = t.name;
                const n = t.index;
                null !== n && this.setIndex(n.clone(e));
                const i = t.attributes;
                for (const t in i) {
                    const n = i[t];
                    this.setAttribute(t, n.clone(e))
                }
                const r = t.morphAttributes;
                for (const t in r) {
                    const n = [],
                        i = r[t];
                    for (let t = 0, r = i.length; t < r; t++) n.push(i[t].clone(e));
                    this.morphAttributes[t] = n
                }
                this.morphTargetsRelative = t.morphTargetsRelative;
                const a = t.groups;
                for (let t = 0, e = a.length; t < e; t++) {
                    const e = a[t];
                    this.addGroup(e.start, e.count, e.materialIndex)
                }
                const s = t.boundingBox;
                null !== s && (this.boundingBox = s.clone());
                const o = t.boundingSphere;
                return null !== o && (this.boundingSphere = o.clone()), this.drawRange.start = t.drawRange.start, this.drawRange.count = t.drawRange.count, this.userData = t.userData, this
            }
            dispose() {
                this.dispatchEvent({
                    type: "dispose"
                })
            }
        }
        class ju extends Xu {
            constructor(t = 1, e = 1, n = 1, i = 1, r = 1, a = 1) {
                super(), this.type = "BoxGeometry", this.parameters = {
                    width: t,
                    height: e,
                    depth: n,
                    widthSegments: i,
                    heightSegments: r,
                    depthSegments: a
                };
                const s = this;
                i = Math.floor(i), r = Math.floor(r), a = Math.floor(a);
                const o = [],
                    l = [],
                    c = [],
                    u = [];
                let h = 0,
                    d = 0;

                function p(t, e, n, i, r, a, p, f, m, g, _) {
                    const v = a / m,
                        x = p / g,
                        y = a / 2,
                        M = p / 2,
                        S = f / 2,
                        E = m + 1,
                        T = g + 1;
                    let b = 0,
                        w = 0;
                    const A = new bc;
                    for (let a = 0; a < T; a++) {
                        const s = a * x - M;
                        for (let o = 0; o < E; o++) {
                            const h = o * v - y;
                            A[t] = h * i, A[e] = s * r, A[n] = S, l.push(A.x, A.y, A.z), A[t] = 0, A[e] = 0, A[n] = f > 0 ? 1 : -1, c.push(A.x, A.y, A.z), u.push(o / m), u.push(1 - a / g), b += 1
                        }
                    }
                    for (let t = 0; t < g; t++)
                        for (let e = 0; e < m; e++) {
                            const n = h + e + E * t,
                                i = h + e + E * (t + 1),
                                r = h + (e + 1) + E * (t + 1),
                                a = h + (e + 1) + E * t;
                            o.push(n, i, a), o.push(i, r, a), w += 6
                        }
                    s.addGroup(d, w, _), d += w, h += b
                }
                p("z", "y", "x", -1, -1, n, e, t, a, r, 0), p("z", "y", "x", 1, -1, n, e, -t, a, r, 1), p("x", "z", "y", 1, 1, t, n, e, i, a, 2), p("x", "z", "y", 1, -1, t, n, -e, i, a, 3), p("x", "y", "z", 1, -1, t, e, n, i, r, 4), p("x", "y", "z", -1, -1, t, e, -n, i, r, 5), this.setIndex(o), this.setAttribute("position", new Fu(l, 3)), this.setAttribute("normal", new Fu(c, 3)), this.setAttribute("uv", new Fu(u, 2))
            }
            copy(t) {
                return super.copy(t), this.parameters = Object.assign({}, t.parameters), this
            }
            static fromJSON(t) {
                return new ju(t.width, t.height, t.depth, t.widthSegments, t.heightSegments, t.depthSegments)
            }
        }
        class qu extends Xu {
            constructor(t = 1, e = 1, n = 1, i = 1) {
                super(), this.type = "PlaneGeometry", this.parameters = {
                    width: t,
                    height: e,
                    widthSegments: n,
                    heightSegments: i
                };
                const r = t / 2,
                    a = e / 2,
                    s = Math.floor(n),
                    o = Math.floor(i),
                    l = s + 1,
                    c = o + 1,
                    u = t / s,
                    h = e / o,
                    d = [],
                    p = [],
                    f = [],
                    m = [];
                for (let t = 0; t < c; t++) {
                    const e = t * h - a;
                    for (let n = 0; n < l; n++) {
                        const i = n * u - r;
                        p.push(i, -e, 0), f.push(0, 0, 1), m.push(n / s), m.push(1 - t / o)
                    }
                }
                for (let t = 0; t < o; t++)
                    for (let e = 0; e < s; e++) {
                        const n = e + l * t,
                            i = e + l * (t + 1),
                            r = e + 1 + l * (t + 1),
                            a = e + 1 + l * t;
                        d.push(n, i, a), d.push(i, r, a)
                    }
                this.setIndex(d), this.setAttribute("position", new Fu(p, 3)), this.setAttribute("normal", new Fu(f, 3)), this.setAttribute("uv", new Fu(m, 2))
            }
            copy(t) {
                return super.copy(t), this.parameters = Object.assign({}, t.parameters), this
            }
            static fromJSON(t) {
                return new qu(t.width, t.height, t.widthSegments, t.heightSegments)
            }
        }
        let Yu = 0;
        class Ku extends Zo {
            constructor() {
                super(), this.isMaterial = !0, Object.defineProperty(this, "id", {
                    value: Yu++
                }), this.uuid = jl(), this.name = "", this.type = "Material", this.blending = 1, this.side = 0, this.vertexColors = !1, this.opacity = 1, this.transparent = !1, this.alphaHash = !1, this.blendSrc = 204, this.blendDst = 205, this.blendEquation = tl, this.blendSrcAlpha = null, this.blendDstAlpha = null, this.blendEquationAlpha = null, this.depthFunc = 3, this.depthTest = !0, this.depthWrite = !0, this.stencilWriteMask = 255, this.stencilFunc = 519, this.stencilRef = 0, this.stencilFuncMask = 255, this.stencilFail = zl, this.stencilZFail = zl, this.stencilZPass = zl, this.stencilWrite = !1, this.clippingPlanes = null, this.clipIntersection = !1, this.clipShadows = !1, this.shadowSide = null, this.colorWrite = !0, this.precision = null, this.polygonOffset = !1, this.polygonOffsetFactor = 0, this.polygonOffsetUnits = 0, this.dithering = !1, this.alphaToCoverage = !1, this.premultipliedAlpha = !1, this.forceSinglePass = !1, this.visible = !0, this.toneMapped = !0, this.userData = {}, this.version = 0, this._alphaTest = 0
            }
            get alphaTest() {
                return this._alphaTest
            }
            set alphaTest(t) {
                this._alphaTest > 0 != t > 0 && this.version++, this._alphaTest = t
            }
            onBuild() {}
            onBeforeRender() {}
            onBeforeCompile() {}
            customProgramCacheKey() {
                return this.onBeforeCompile.toString()
            }
            setValues(t) {
                if (void 0 !== t)
                    for (const e in t) {
                        const n = t[e];
                        if (void 0 === n) {
                            console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);
                            continue
                        }
                        const i = this[e];
                        void 0 !== i ? i && i.isColor ? i.set(n) : i && i.isVector3 && n && n.isVector3 ? i.copy(n) : this[e] = n : console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`)
                    }
            }
            toJSON(t) {
                const e = void 0 === t || "string" == typeof t;
                e && (t = {
                    textures: {},
                    images: {}
                });
                const n = {
                    metadata: {
                        version: 4.6,
                        type: "Material",
                        generator: "Material.toJSON"
                    }
                };

                function i(t) {
                    const e = [];
                    for (const n in t) {
                        const i = t[n];
                        delete i.metadata, e.push(i)
                    }
                    return e
                }
                if (n.uuid = this.uuid, n.type = this.type, "" !== this.name && (n.name = this.name), this.color && this.color.isColor && (n.color = this.color.getHex()), void 0 !== this.roughness && (n.roughness = this.roughness), void 0 !== this.metalness && (n.metalness = this.metalness), void 0 !== this.sheen && (n.sheen = this.sheen), this.sheenColor && this.sheenColor.isColor && (n.sheenColor = this.sheenColor.getHex()), void 0 !== this.sheenRoughness && (n.sheenRoughness = this.sheenRoughness), this.emissive && this.emissive.isColor && (n.emissive = this.emissive.getHex()), this.emissiveIntensity && 1 !== this.emissiveIntensity && (n.emissiveIntensity = this.emissiveIntensity), this.specular && this.specular.isColor && (n.specular = this.specular.getHex()), void 0 !== this.specularIntensity && (n.specularIntensity = this.specularIntensity), this.specularColor && this.specularColor.isColor && (n.specularColor = this.specularColor.getHex()), void 0 !== this.shininess && (n.shininess = this.shininess), void 0 !== this.clearcoat && (n.clearcoat = this.clearcoat), void 0 !== this.clearcoatRoughness && (n.clearcoatRoughness = this.clearcoatRoughness), this.clearcoatMap && this.clearcoatMap.isTexture && (n.clearcoatMap = this.clearcoatMap.toJSON(t).uuid), this.clearcoatRoughnessMap && this.clearcoatRoughnessMap.isTexture && (n.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(t).uuid), this.clearcoatNormalMap && this.clearcoatNormalMap.isTexture && (n.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(t).uuid, n.clearcoatNormalScale = this.clearcoatNormalScale.toArray()), void 0 !== this.iridescence && (n.iridescence = this.iridescence), void 0 !== this.iridescenceIOR && (n.iridescenceIOR = this.iridescenceIOR), void 0 !== this.iridescenceThicknessRange && (n.iridescenceThicknessRange = this.iridescenceThicknessRange), this.iridescenceMap && this.iridescenceMap.isTexture && (n.iridescenceMap = this.iridescenceMap.toJSON(t).uuid), this.iridescenceThicknessMap && this.iridescenceThicknessMap.isTexture && (n.iridescenceThicknessMap = this.iridescenceThicknessMap.toJSON(t).uuid), void 0 !== this.anisotropy && (n.anisotropy = this.anisotropy), void 0 !== this.anisotropyRotation && (n.anisotropyRotation = this.anisotropyRotation), this.anisotropyMap && this.anisotropyMap.isTexture && (n.anisotropyMap = this.anisotropyMap.toJSON(t).uuid), this.map && this.map.isTexture && (n.map = this.map.toJSON(t).uuid), this.matcap && this.matcap.isTexture && (n.matcap = this.matcap.toJSON(t).uuid), this.alphaMap && this.alphaMap.isTexture && (n.alphaMap = this.alphaMap.toJSON(t).uuid), this.lightMap && this.lightMap.isTexture && (n.lightMap = this.lightMap.toJSON(t).uuid, n.lightMapIntensity = this.lightMapIntensity), this.aoMap && this.aoMap.isTexture && (n.aoMap = this.aoMap.toJSON(t).uuid, n.aoMapIntensity = this.aoMapIntensity), this.bumpMap && this.bumpMap.isTexture && (n.bumpMap = this.bumpMap.toJSON(t).uuid, n.bumpScale = this.bumpScale), this.normalMap && this.normalMap.isTexture && (n.normalMap = this.normalMap.toJSON(t).uuid, n.normalMapType = this.normalMapType, n.normalScale = this.normalScale.toArray()), this.displacementMap && this.displacementMap.isTexture && (n.displacementMap = this.displacementMap.toJSON(t).uuid, n.displacementScale = this.displacementScale, n.displacementBias = this.displacementBias), this.roughnessMap && this.roughnessMap.isTexture && (n.roughnessMap = this.roughnessMap.toJSON(t).uuid), this.metalnessMap && this.metalnessMap.isTexture && (n.metalnessMap = this.metalnessMap.toJSON(t).uuid), this.emissiveMap && this.emissiveMap.isTexture && (n.emissiveMap = this.emissiveMap.toJSON(t).uuid), this.specularMap && this.specularMap.isTexture && (n.specularMap = this.specularMap.toJSON(t).uuid), this.specularIntensityMap && this.specularIntensityMap.isTexture && (n.specularIntensityMap = this.specularIntensityMap.toJSON(t).uuid), this.specularColorMap && this.specularColorMap.isTexture && (n.specularColorMap = this.specularColorMap.toJSON(t).uuid), this.envMap && this.envMap.isTexture && (n.envMap = this.envMap.toJSON(t).uuid, void 0 !== this.combine && (n.combine = this.combine)), void 0 !== this.envMapIntensity && (n.envMapIntensity = this.envMapIntensity), void 0 !== this.reflectivity && (n.reflectivity = this.reflectivity), void 0 !== this.refractionRatio && (n.refractionRatio = this.refractionRatio), this.gradientMap && this.gradientMap.isTexture && (n.gradientMap = this.gradientMap.toJSON(t).uuid), void 0 !== this.transmission && (n.transmission = this.transmission), this.transmissionMap && this.transmissionMap.isTexture && (n.transmissionMap = this.transmissionMap.toJSON(t).uuid), void 0 !== this.thickness && (n.thickness = this.thickness), this.thicknessMap && this.thicknessMap.isTexture && (n.thicknessMap = this.thicknessMap.toJSON(t).uuid), void 0 !== this.attenuationDistance && this.attenuationDistance !== 1 / 0 && (n.attenuationDistance = this.attenuationDistance), void 0 !== this.attenuationColor && (n.attenuationColor = this.attenuationColor.getHex()), void 0 !== this.size && (n.size = this.size), null !== this.shadowSide && (n.shadowSide = this.shadowSide), void 0 !== this.sizeAttenuation && (n.sizeAttenuation = this.sizeAttenuation), 1 !== this.blending && (n.blending = this.blending), 0 !== this.side && (n.side = this.side), this.vertexColors && (n.vertexColors = !0), this.opacity < 1 && (n.opacity = this.opacity), !0 === this.transparent && (n.transparent = this.transparent), n.depthFunc = this.depthFunc, n.depthTest = this.depthTest, n.depthWrite = this.depthWrite, n.colorWrite = this.colorWrite, n.stencilWrite = this.stencilWrite, n.stencilWriteMask = this.stencilWriteMask, n.stencilFunc = this.stencilFunc, n.stencilRef = this.stencilRef, n.stencilFuncMask = this.stencilFuncMask, n.stencilFail = this.stencilFail, n.stencilZFail = this.stencilZFail, n.stencilZPass = this.stencilZPass, void 0 !== this.rotation && 0 !== this.rotation && (n.rotation = this.rotation), !0 === this.polygonOffset && (n.polygonOffset = !0), 0 !== this.polygonOffsetFactor && (n.polygonOffsetFactor = this.polygonOffsetFactor), 0 !== this.polygonOffsetUnits && (n.polygonOffsetUnits = this.polygonOffsetUnits), void 0 !== this.linewidth && 1 !== this.linewidth && (n.linewidth = this.linewidth), void 0 !== this.dashSize && (n.dashSize = this.dashSize), void 0 !== this.gapSize && (n.gapSize = this.gapSize), void 0 !== this.scale && (n.scale = this.scale), !0 === this.dithering && (n.dithering = !0), this.alphaTest > 0 && (n.alphaTest = this.alphaTest), !0 === this.alphaHash && (n.alphaHash = this.alphaHash), !0 === this.alphaToCoverage && (n.alphaToCoverage = this.alphaToCoverage), !0 === this.premultipliedAlpha && (n.premultipliedAlpha = this.premultipliedAlpha), !0 === this.forceSinglePass && (n.forceSinglePass = this.forceSinglePass), !0 === this.wireframe && (n.wireframe = this.wireframe), this.wireframeLinewidth > 1 && (n.wireframeLinewidth = this.wireframeLinewidth), "round" !== this.wireframeLinecap && (n.wireframeLinecap = this.wireframeLinecap), "round" !== this.wireframeLinejoin && (n.wireframeLinejoin = this.wireframeLinejoin), !0 === this.flatShading && (n.flatShading = this.flatShading), !1 === this.visible && (n.visible = !1), !1 === this.toneMapped && (n.toneMapped = !1), !1 === this.fog && (n.fog = !1), Object.keys(this.userData).length > 0 && (n.userData = this.userData), e) {
                    const e = i(t.textures),
                        r = i(t.images);
                    e.length > 0 && (n.textures = e), r.length > 0 && (n.images = r)
                }
                return n
            }
            clone() {
                return (new this.constructor).copy(this)
            }
            copy(t) {
                this.name = t.name, this.blending = t.blending, this.side = t.side, this.vertexColors = t.vertexColors, this.opacity = t.opacity, this.transparent = t.transparent, this.blendSrc = t.blendSrc, this.blendDst = t.blendDst, this.blendEquation = t.blendEquation, this.blendSrcAlpha = t.blendSrcAlpha, this.blendDstAlpha = t.blendDstAlpha, this.blendEquationAlpha = t.blendEquationAlpha, this.depthFunc = t.depthFunc, this.depthTest = t.depthTest, this.depthWrite = t.depthWrite, this.stencilWriteMask = t.stencilWriteMask, this.stencilFunc = t.stencilFunc, this.stencilRef = t.stencilRef, this.stencilFuncMask = t.stencilFuncMask, this.stencilFail = t.stencilFail, this.stencilZFail = t.stencilZFail, this.stencilZPass = t.stencilZPass, this.stencilWrite = t.stencilWrite;
                const e = t.clippingPlanes;
                let n = null;
                if (null !== e) {
                    const t = e.length;
                    n = new Array(t);
                    for (let i = 0; i !== t; ++i) n[i] = e[i].clone()
                }
                return this.clippingPlanes = n, this.clipIntersection = t.clipIntersection, this.clipShadows = t.clipShadows, this.shadowSide = t.shadowSide, this.colorWrite = t.colorWrite, this.precision = t.precision, this.polygonOffset = t.polygonOffset, this.polygonOffsetFactor = t.polygonOffsetFactor, this.polygonOffsetUnits = t.polygonOffsetUnits, this.dithering = t.dithering, this.alphaTest = t.alphaTest, this.alphaHash = t.alphaHash, this.alphaToCoverage = t.alphaToCoverage, this.premultipliedAlpha = t.premultipliedAlpha, this.forceSinglePass = t.forceSinglePass, this.visible = t.visible, this.toneMapped = t.toneMapped, this.userData = JSON.parse(JSON.stringify(t.userData)), this
            }
            dispose() {
                this.dispatchEvent({
                    type: "dispose"
                })
            }
            set needsUpdate(t) {
                !0 === t && this.version++
            }
        }

        function Zu(t) {
            const e = {};
            for (const n in t) {
                e[n] = {};
                for (const i in t[n]) {
                    const r = t[n][i];
                    r && (r.isColor || r.isMatrix3 || r.isMatrix4 || r.isVector2 || r.isVector3 || r.isVector4 || r.isTexture || r.isQuaternion) ? r.isRenderTargetTexture ? (console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."), e[n][i] = null) : e[n][i] = r.clone() : Array.isArray(r) ? e[n][i] = r.slice() : e[n][i] = r
                }
            }
            return e
        }

        function $u(t) {
            const e = {};
            for (let n = 0; n < t.length; n++) {
                const i = Zu(t[n]);
                for (const t in i) e[t] = i[t]
            }
            return e
        }

        function Ju(t) {
            return null === t.getRenderTarget() ? t.outputColorSpace : Nl
        }
        const Qu = {
            clone: Zu,
            merge: $u
        };
        class th extends Ku {
            constructor(t) {
                super(), this.isShaderMaterial = !0, this.type = "ShaderMaterial", this.defines = {}, this.uniforms = {}, this.uniformsGroups = [], this.vertexShader = "\nvoid main() {\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}\n", this.fragmentShader = "\nvoid main() {\n\tgl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}\n", this.linewidth = 1, this.wireframe = !1, this.wireframeLinewidth = 1, this.fog = !1, this.lights = !1, this.clipping = !1, this.forceSinglePass = !0, this.extensions = {
                    derivatives: !1,
                    fragDepth: !1,
                    drawBuffers: !1,
                    shaderTextureLOD: !1
                }, this.defaultAttributeValues = {
                    color: [1, 1, 1],
                    uv: [0, 0],
                    uv1: [0, 0]
                }, this.index0AttributeName = void 0, this.uniformsNeedUpdate = !1, this.glslVersion = null, void 0 !== t && this.setValues(t)
            }
            copy(t) {
                return super.copy(t), this.fragmentShader = t.fragmentShader, this.vertexShader = t.vertexShader, this.uniforms = Zu(t.uniforms), this.uniformsGroups = function(t) {
                    const e = [];
                    for (let n = 0; n < t.length; n++) e.push(t[n].clone());
                    return e
                }(t.uniformsGroups), this.defines = Object.assign({}, t.defines), this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.fog = t.fog, this.lights = t.lights, this.clipping = t.clipping, this.extensions = Object.assign({}, t.extensions), this.glslVersion = t.glslVersion, this
            }
            toJSON(t) {
                const e = super.toJSON(t);
                e.glslVersion = this.glslVersion, e.uniforms = {};
                for (const n in this.uniforms) {
                    const i = this.uniforms[n].value;
                    i && i.isTexture ? e.uniforms[n] = {
                        type: "t",
                        value: i.toJSON(t).uuid
                    } : i && i.isColor ? e.uniforms[n] = {
                        type: "c",
                        value: i.getHex()
                    } : i && i.isVector2 ? e.uniforms[n] = {
                        type: "v2",
                        value: i.toArray()
                    } : i && i.isVector3 ? e.uniforms[n] = {
                        type: "v3",
                        value: i.toArray()
                    } : i && i.isVector4 ? e.uniforms[n] = {
                        type: "v4",
                        value: i.toArray()
                    } : i && i.isMatrix3 ? e.uniforms[n] = {
                        type: "m3",
                        value: i.toArray()
                    } : i && i.isMatrix4 ? e.uniforms[n] = {
                        type: "m4",
                        value: i.toArray()
                    } : e.uniforms[n] = {
                        value: i
                    }
                }
                Object.keys(this.defines).length > 0 && (e.defines = this.defines), e.vertexShader = this.vertexShader, e.fragmentShader = this.fragmentShader, e.lights = this.lights, e.clipping = this.clipping;
                const n = {};
                for (const t in this.extensions) !0 === this.extensions[t] && (n[t] = !0);
                return Object.keys(n).length > 0 && (e.extensions = n), e
            }
        }
        const eh = new bc,
            nh = new bc,
            ih = new bc,
            rh = new bc,
            ah = new bc,
            sh = new bc,
            oh = new bc;
        class lh {
            constructor(t = new bc, e = new bc(0, 0, -1)) {
                this.origin = t, this.direction = e
            }
            set(t, e) {
                return this.origin.copy(t), this.direction.copy(e), this
            }
            copy(t) {
                return this.origin.copy(t.origin), this.direction.copy(t.direction), this
            }
            at(t, e) {
                return e.copy(this.origin).addScaledVector(this.direction, t)
            }
            lookAt(t) {
                return this.direction.copy(t).sub(this.origin).normalize(), this
            }
            recast(t) {
                return this.origin.copy(this.at(t, eh)), this
            }
            closestPointToPoint(t, e) {
                e.subVectors(t, this.origin);
                const n = e.dot(this.direction);
                return n < 0 ? e.copy(this.origin) : e.copy(this.origin).addScaledVector(this.direction, n)
            }
            distanceToPoint(t) {
                return Math.sqrt(this.distanceSqToPoint(t))
            }
            distanceSqToPoint(t) {
                const e = eh.subVectors(t, this.origin).dot(this.direction);
                return e < 0 ? this.origin.distanceToSquared(t) : (eh.copy(this.origin).addScaledVector(this.direction, e), eh.distanceToSquared(t))
            }
            distanceSqToSegment(t, e, n, i) {
                nh.copy(t).add(e).multiplyScalar(.5), ih.copy(e).sub(t).normalize(), rh.copy(this.origin).sub(nh);
                const r = .5 * t.distanceTo(e),
                    a = -this.direction.dot(ih),
                    s = rh.dot(this.direction),
                    o = -rh.dot(ih),
                    l = rh.lengthSq(),
                    c = Math.abs(1 - a * a);
                let u, h, d, p;
                if (c > 0)
                    if (u = a * o - s, h = a * s - o, p = r * c, u >= 0)
                        if (h >= -p)
                            if (h <= p) {
                                const t = 1 / c;
                                u *= t, h *= t, d = u * (u + a * h + 2 * s) + h * (a * u + h + 2 * o) + l
                            } else h = r, u = Math.max(0, -(a * h + s)), d = -u * u + h * (h + 2 * o) + l;
                else h = -r, u = Math.max(0, -(a * h + s)), d = -u * u + h * (h + 2 * o) + l;
                else h <= -p ? (u = Math.max(0, -(-a * r + s)), h = u > 0 ? -r : Math.min(Math.max(-r, -o), r), d = -u * u + h * (h + 2 * o) + l) : h <= p ? (u = 0, h = Math.min(Math.max(-r, -o), r), d = h * (h + 2 * o) + l) : (u = Math.max(0, -(a * r + s)), h = u > 0 ? r : Math.min(Math.max(-r, -o), r), d = -u * u + h * (h + 2 * o) + l);
                else h = a > 0 ? -r : r, u = Math.max(0, -(a * h + s)), d = -u * u + h * (h + 2 * o) + l;
                return n && n.copy(this.origin).addScaledVector(this.direction, u), i && i.copy(nh).addScaledVector(ih, h), d
            }
            intersectSphere(t, e) {
                eh.subVectors(t.center, this.origin);
                const n = eh.dot(this.direction),
                    i = eh.dot(eh) - n * n,
                    r = t.radius * t.radius;
                if (i > r) return null;
                const a = Math.sqrt(r - i),
                    s = n - a,
                    o = n + a;
                return o < 0 ? null : s < 0 ? this.at(o, e) : this.at(s, e)
            }
            intersectsSphere(t) {
                return this.distanceSqToPoint(t.center) <= t.radius * t.radius
            }
            distanceToPlane(t) {
                const e = t.normal.dot(this.direction);
                if (0 === e) return 0 === t.distanceToPoint(this.origin) ? 0 : null;
                const n = -(this.origin.dot(t.normal) + t.constant) / e;
                return n >= 0 ? n : null
            }
            intersectPlane(t, e) {
                const n = this.distanceToPlane(t);
                return null === n ? null : this.at(n, e)
            }
            intersectsPlane(t) {
                const e = t.distanceToPoint(this.origin);
                return 0 === e || t.normal.dot(this.direction) * e < 0
            }
            intersectBox(t, e) {
                let n, i, r, a, s, o;
                const l = 1 / this.direction.x,
                    c = 1 / this.direction.y,
                    u = 1 / this.direction.z,
                    h = this.origin;
                return l >= 0 ? (n = (t.min.x - h.x) * l, i = (t.max.x - h.x) * l) : (n = (t.max.x - h.x) * l, i = (t.min.x - h.x) * l), c >= 0 ? (r = (t.min.y - h.y) * c, a = (t.max.y - h.y) * c) : (r = (t.max.y - h.y) * c, a = (t.min.y - h.y) * c), n > a || r > i ? null : ((r > n || isNaN(n)) && (n = r), (a < i || isNaN(i)) && (i = a), u >= 0 ? (s = (t.min.z - h.z) * u, o = (t.max.z - h.z) * u) : (s = (t.max.z - h.z) * u, o = (t.min.z - h.z) * u), n > o || s > i ? null : ((s > n || n != n) && (n = s), (o < i || i != i) && (i = o), i < 0 ? null : this.at(n >= 0 ? n : i, e)))
            }
            intersectsBox(t) {
                return null !== this.intersectBox(t, eh)
            }
            intersectTriangle(t, e, n, i, r) {
                ah.subVectors(e, t), sh.subVectors(n, t), oh.crossVectors(ah, sh);
                let a, s = this.direction.dot(oh);
                if (s > 0) {
                    if (i) return null;
                    a = 1
                } else {
                    if (!(s < 0)) return null;
                    a = -1, s = -s
                }
                rh.subVectors(this.origin, t);
                const o = a * this.direction.dot(sh.crossVectors(rh, sh));
                if (o < 0) return null;
                const l = a * this.direction.dot(ah.cross(rh));
                if (l < 0) return null;
                if (o + l > s) return null;
                const c = -a * rh.dot(oh);
                return c < 0 ? null : this.at(c / s, r)
            }
            applyMatrix4(t) {
                return this.origin.applyMatrix4(t), this.direction.transformDirection(t), this
            }
            equals(t) {
                return t.origin.equals(this.origin) && t.direction.equals(this.direction)
            }
            clone() {
                return (new this.constructor).copy(this)
            }
        }
        const ch = new bc,
            uh = new bc,
            hh = new bc,
            dh = new bc,
            ph = new bc,
            fh = new bc,
            mh = new bc,
            gh = new bc,
            _h = new bc,
            vh = new bc;
        let xh = !1;
        class yh {
            constructor(t = new bc, e = new bc, n = new bc) {
                this.a = t, this.b = e, this.c = n
            }
            static getNormal(t, e, n, i) {
                i.subVectors(n, e), ch.subVectors(t, e), i.cross(ch);
                const r = i.lengthSq();
                return r > 0 ? i.multiplyScalar(1 / Math.sqrt(r)) : i.set(0, 0, 0)
            }
            static getBarycoord(t, e, n, i, r) {
                ch.subVectors(i, e), uh.subVectors(n, e), hh.subVectors(t, e);
                const a = ch.dot(ch),
                    s = ch.dot(uh),
                    o = ch.dot(hh),
                    l = uh.dot(uh),
                    c = uh.dot(hh),
                    u = a * l - s * s;
                if (0 === u) return r.set(-2, -1, -1);
                const h = 1 / u,
                    d = (l * o - s * c) * h,
                    p = (a * c - s * o) * h;
                return r.set(1 - d - p, p, d)
            }
            static containsPoint(t, e, n, i) {
                return this.getBarycoord(t, e, n, i, dh), dh.x >= 0 && dh.y >= 0 && dh.x + dh.y <= 1
            }
            static getUV(t, e, n, i, r, a, s, o) {
                return !1 === xh && (console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."), xh = !0), this.getInterpolation(t, e, n, i, r, a, s, o)
            }
            static getInterpolation(t, e, n, i, r, a, s, o) {
                return this.getBarycoord(t, e, n, i, dh), o.setScalar(0), o.addScaledVector(r, dh.x), o.addScaledVector(a, dh.y), o.addScaledVector(s, dh.z), o
            }
            static isFrontFacing(t, e, n, i) {
                return ch.subVectors(n, e), uh.subVectors(t, e), ch.cross(uh).dot(i) < 0
            }
            set(t, e, n) {
                return this.a.copy(t), this.b.copy(e), this.c.copy(n), this
            }
            setFromPointsAndIndices(t, e, n, i) {
                return this.a.copy(t[e]), this.b.copy(t[n]), this.c.copy(t[i]), this
            }
            setFromAttributeAndIndices(t, e, n, i) {
                return this.a.fromBufferAttribute(t, e), this.b.fromBufferAttribute(t, n), this.c.fromBufferAttribute(t, i), this
            }
            clone() {
                return (new this.constructor).copy(this)
            }
            copy(t) {
                return this.a.copy(t.a), this.b.copy(t.b), this.c.copy(t.c), this
            }
            getArea() {
                return ch.subVectors(this.c, this.b), uh.subVectors(this.a, this.b), .5 * ch.cross(uh).length()
            }
            getMidpoint(t) {
                return t.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3)
            }
            getNormal(t) {
                return yh.getNormal(this.a, this.b, this.c, t)
            }
            getPlane(t) {
                return t.setFromCoplanarPoints(this.a, this.b, this.c)
            }
            getBarycoord(t, e) {
                return yh.getBarycoord(t, this.a, this.b, this.c, e)
            }
            getUV(t, e, n, i, r) {
                return !1 === xh && (console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."), xh = !0), yh.getInterpolation(t, this.a, this.b, this.c, e, n, i, r)
            }
            getInterpolation(t, e, n, i, r) {
                return yh.getInterpolation(t, this.a, this.b, this.c, e, n, i, r)
            }
            containsPoint(t) {
                return yh.containsPoint(t, this.a, this.b, this.c)
            }
            isFrontFacing(t) {
                return yh.isFrontFacing(this.a, this.b, this.c, t)
            }
            intersectsBox(t) {
                return t.intersectsTriangle(this)
            }
            closestPointToPoint(t, e) {
                const n = this.a,
                    i = this.b,
                    r = this.c;
                let a, s;
                ph.subVectors(i, n), fh.subVectors(r, n), gh.subVectors(t, n);
                const o = ph.dot(gh),
                    l = fh.dot(gh);
                if (o <= 0 && l <= 0) return e.copy(n);
                _h.subVectors(t, i);
                const c = ph.dot(_h),
                    u = fh.dot(_h);
                if (c >= 0 && u <= c) return e.copy(i);
                const h = o * u - c * l;
                if (h <= 0 && o >= 0 && c <= 0) return a = o / (o - c), e.copy(n).addScaledVector(ph, a);
                vh.subVectors(t, r);
                const d = ph.dot(vh),
                    p = fh.dot(vh);
                if (p >= 0 && d <= p) return e.copy(r);
                const f = d * l - o * p;
                if (f <= 0 && l >= 0 && p <= 0) return s = l / (l - p), e.copy(n).addScaledVector(fh, s);
                const m = c * p - d * u;
                if (m <= 0 && u - c >= 0 && d - p >= 0) return mh.subVectors(r, i), s = (u - c) / (u - c + (d - p)), e.copy(i).addScaledVector(mh, s);
                const g = 1 / (m + f + h);
                return a = f * g, s = h * g, e.copy(n).addScaledVector(ph, a).addScaledVector(fh, s)
            }
            equals(t) {
                return t.a.equals(this.a) && t.b.equals(this.b) && t.c.equals(this.c)
            }
        }
        class Mh extends Ku {
            constructor(t) {
                super(), this.isMeshBasicMaterial = !0, this.type = "MeshBasicMaterial", this.color = new Mc(16777215), this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.combine = el, this.reflectivity = 1, this.refractionRatio = .98, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.fog = !0, this.setValues(t)
            }
            copy(t) {
                return super.copy(t), this.color.copy(t.color), this.map = t.map, this.lightMap = t.lightMap, this.lightMapIntensity = t.lightMapIntensity, this.aoMap = t.aoMap, this.aoMapIntensity = t.aoMapIntensity, this.specularMap = t.specularMap, this.alphaMap = t.alphaMap, this.envMap = t.envMap, this.combine = t.combine, this.reflectivity = t.reflectivity, this.refractionRatio = t.refractionRatio, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this.wireframeLinecap = t.wireframeLinecap, this.wireframeLinejoin = t.wireframeLinejoin, this.fog = t.fog, this
            }
        }
        const Sh = new Rc,
            Eh = new lh,
            Th = new Mu,
            bh = new bc,
            wh = new bc,
            Ah = new bc,
            Rh = new bc,
            Ch = new bc,
            Lh = new bc,
            Ph = new Ql,
            Uh = new Ql,
            Dh = new Ql,
            Ih = new bc,
            Oh = new bc,
            Nh = new bc,
            Fh = new bc,
            zh = new bc;
        class Bh extends Qc {
            constructor(t = new Xu, e = new Mh) {
                super(), this.isMesh = !0, this.type = "Mesh", this.geometry = t, this.material = e, this.updateMorphTargets()
            }
            copy(t, e) {
                return super.copy(t, e), void 0 !== t.morphTargetInfluences && (this.morphTargetInfluences = t.morphTargetInfluences.slice()), void 0 !== t.morphTargetDictionary && (this.morphTargetDictionary = Object.assign({}, t.morphTargetDictionary)), this.material = Array.isArray(t.material) ? t.material.slice() : t.material, this.geometry = t.geometry, this
            }
            updateMorphTargets() {
                const t = this.geometry.morphAttributes,
                    e = Object.keys(t);
                if (e.length > 0) {
                    const n = t[e[0]];
                    if (void 0 !== n) {
                        this.morphTargetInfluences = [], this.morphTargetDictionary = {};
                        for (let t = 0, e = n.length; t < e; t++) {
                            const e = n[t].name || String(t);
                            this.morphTargetInfluences.push(0), this.morphTargetDictionary[e] = t
                        }
                    }
                }
            }
            getVertexPosition(t, e) {
                const n = this.geometry,
                    i = n.attributes.position,
                    r = n.morphAttributes.position,
                    a = n.morphTargetsRelative;
                e.fromBufferAttribute(i, t);
                const s = this.morphTargetInfluences;
                if (r && s) {
                    Lh.set(0, 0, 0);
                    for (let n = 0, i = r.length; n < i; n++) {
                        const i = s[n],
                            o = r[n];
                        0 !== i && (Ch.fromBufferAttribute(o, t), a ? Lh.addScaledVector(Ch, i) : Lh.addScaledVector(Ch.sub(e), i))
                    }
                    e.add(Lh)
                }
                return e
            }
            raycast(t, e) {
                const n = this.geometry,
                    i = this.material,
                    r = this.matrixWorld;
                if (void 0 !== i) {
                    if (null === n.boundingSphere && n.computeBoundingSphere(), Th.copy(n.boundingSphere), Th.applyMatrix4(r), Eh.copy(t.ray).recast(t.near), !1 === Th.containsPoint(Eh.origin)) {
                        if (null === Eh.intersectSphere(Th, bh)) return;
                        if (Eh.origin.distanceToSquared(bh) > (t.far - t.near) ** 2) return
                    }
                    Sh.copy(r).invert(), Eh.copy(t.ray).applyMatrix4(Sh), null !== n.boundingBox && !1 === Eh.intersectsBox(n.boundingBox) || this._computeIntersections(t, e, Eh)
                }
            }
            _computeIntersections(t, e, n) {
                let i;
                const r = this.geometry,
                    a = this.material,
                    s = r.index,
                    o = r.attributes.position,
                    l = r.attributes.uv,
                    c = r.attributes.uv1,
                    u = r.attributes.normal,
                    h = r.groups,
                    d = r.drawRange;
                if (null !== s)
                    if (Array.isArray(a))
                        for (let r = 0, o = h.length; r < o; r++) {
                            const o = h[r],
                                p = a[o.materialIndex];
                            for (let r = Math.max(o.start, d.start), a = Math.min(s.count, Math.min(o.start + o.count, d.start + d.count)); r < a; r += 3) i = kh(this, p, t, n, l, c, u, s.getX(r), s.getX(r + 1), s.getX(r + 2)), i && (i.faceIndex = Math.floor(r / 3), i.face.materialIndex = o.materialIndex, e.push(i))
                        } else
                            for (let r = Math.max(0, d.start), o = Math.min(s.count, d.start + d.count); r < o; r += 3) i = kh(this, a, t, n, l, c, u, s.getX(r), s.getX(r + 1), s.getX(r + 2)), i && (i.faceIndex = Math.floor(r / 3), e.push(i));
                    else if (void 0 !== o)
                    if (Array.isArray(a))
                        for (let r = 0, s = h.length; r < s; r++) {
                            const s = h[r],
                                p = a[s.materialIndex];
                            for (let r = Math.max(s.start, d.start), a = Math.min(o.count, Math.min(s.start + s.count, d.start + d.count)); r < a; r += 3) i = kh(this, p, t, n, l, c, u, r, r + 1, r + 2), i && (i.faceIndex = Math.floor(r / 3), i.face.materialIndex = s.materialIndex, e.push(i))
                        } else
                            for (let r = Math.max(0, d.start), s = Math.min(o.count, d.start + d.count); r < s; r += 3) i = kh(this, a, t, n, l, c, u, r, r + 1, r + 2), i && (i.faceIndex = Math.floor(r / 3), e.push(i))
            }
        }

        function kh(t, e, n, i, r, a, s, o, l, c) {
            t.getVertexPosition(o, wh), t.getVertexPosition(l, Ah), t.getVertexPosition(c, Rh);
            const u = function(t, e, n, i, r, a, s, o) {
                let l;
                if (l = 1 === e.side ? i.intersectTriangle(s, a, r, !0, o) : i.intersectTriangle(r, a, s, 0 === e.side, o), null === l) return null;
                zh.copy(o), zh.applyMatrix4(t.matrixWorld);
                const c = n.ray.origin.distanceTo(zh);
                return c < n.near || c > n.far ? null : {
                    distance: c,
                    point: zh.clone(),
                    object: t
                }
            }(t, e, n, i, wh, Ah, Rh, Fh);
            if (u) {
                r && (Ph.fromBufferAttribute(r, o), Uh.fromBufferAttribute(r, l), Dh.fromBufferAttribute(r, c), u.uv = yh.getInterpolation(Fh, wh, Ah, Rh, Ph, Uh, Dh, new Ql)), a && (Ph.fromBufferAttribute(a, o), Uh.fromBufferAttribute(a, l), Dh.fromBufferAttribute(a, c), u.uv1 = yh.getInterpolation(Fh, wh, Ah, Rh, Ph, Uh, Dh, new Ql), u.uv2 = u.uv1), s && (Ih.fromBufferAttribute(s, o), Oh.fromBufferAttribute(s, l), Nh.fromBufferAttribute(s, c), u.normal = yh.getInterpolation(Fh, wh, Ah, Rh, Ih, Oh, Nh, new bc), u.normal.dot(i.direction) > 0 && u.normal.multiplyScalar(-1));
                const t = {
                    a: o,
                    b: l,
                    c,
                    normal: new bc,
                    materialIndex: 0
                };
                yh.getNormal(wh, Ah, Rh, t.normal), u.face = t
            }
            return u
        }
        const Hh = {
                alphahash_fragment: "\n#ifdef USE_ALPHAHASH\n\n\tif ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;\n\n#endif\n",
                alphahash_pars_fragment: "\n#ifdef USE_ALPHAHASH\n\n\t/**\n\t * See: https://casual-effects.com/research/Wyman2017Hashed/index.html\n\t */\n\n\tconst float ALPHA_HASH_SCALE = 0.05; // Derived from trials only, and may be changed.\n\n\tfloat hash2D( vec2 value ) {\n\n\t\treturn fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );\n\n\t}\n\n\tfloat hash3D( vec3 value ) {\n\n\t\treturn hash2D( vec2( hash2D( value.xy ), value.z ) );\n\n\t}\n\n\tfloat getAlphaHashThreshold( vec3 position ) {\n\n\t\t// Find the discretized derivatives of our coordinates\n\t\tfloat maxDeriv = max(\n\t\t\tlength( dFdx( position.xyz ) ),\n\t\t\tlength( dFdy( position.xyz ) )\n\t\t);\n\t\tfloat pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );\n\n\t\t// Find two nearest log-discretized noise scales\n\t\tvec2 pixScales = vec2(\n\t\t\texp2( floor( log2( pixScale ) ) ),\n\t\t\texp2( ceil( log2( pixScale ) ) )\n\t\t);\n\n\t\t// Compute alpha thresholds at our two noise scales\n\t\tvec2 alpha = vec2(\n\t\t\thash3D( floor( pixScales.x * position.xyz ) ),\n\t\t\thash3D( floor( pixScales.y * position.xyz ) )\n\t\t);\n\n\t\t// Factor to interpolate lerp with\n\t\tfloat lerpFactor = fract( log2( pixScale ) );\n\n\t\t// Interpolate alpha threshold from noise at two scales\n\t\tfloat x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;\n\n\t\t// Pass into CDF to compute uniformly distrib threshold\n\t\tfloat a = min( lerpFactor, 1.0 - lerpFactor );\n\t\tvec3 cases = vec3(\n\t\t\tx * x / ( 2.0 * a * ( 1.0 - a ) ),\n\t\t\t( x - 0.5 * a ) / ( 1.0 - a ),\n\t\t\t1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )\n\t\t);\n\n\t\t// Find our final, uniformly distributed alpha threshold (ατ)\n\t\tfloat threshold = ( x < ( 1.0 - a ) )\n\t\t\t? ( ( x < a ) ? cases.x : cases.y )\n\t\t\t: cases.z;\n\n\t\t// Avoids ατ == 0. Could also do ατ =1-ατ\n\t\treturn clamp( threshold , 1.0e-6, 1.0 );\n\n\t}\n\n#endif\n",
                alphamap_fragment: "\n#ifdef USE_ALPHAMAP\n\n\tdiffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;\n\n#endif\n",
                alphamap_pars_fragment: "\n#ifdef USE_ALPHAMAP\n\n\tuniform sampler2D alphaMap;\n\n#endif\n",
                alphatest_fragment: "\n#ifdef USE_ALPHATEST\n\n\tif ( diffuseColor.a < alphaTest ) discard;\n\n#endif\n",
                alphatest_pars_fragment: "\n#ifdef USE_ALPHATEST\n\tuniform float alphaTest;\n#endif\n",
                aomap_fragment: "\n#ifdef USE_AOMAP\n\n\t// reads channel R, compatible with a combined OcclusionRoughnessMetallic (RGB) texture\n\tfloat ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;\n\n\treflectedLight.indirectDiffuse *= ambientOcclusion;\n\n\t#if defined( USE_ENVMAP ) && defined( STANDARD )\n\n\t\tfloat dotNV = saturate( dot( geometry.normal, geometry.viewDir ) );\n\n\t\treflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );\n\n\t#endif\n\n#endif\n",
                aomap_pars_fragment: "\n#ifdef USE_AOMAP\n\n\tuniform sampler2D aoMap;\n\tuniform float aoMapIntensity;\n\n#endif\n",
                begin_vertex: "\nvec3 transformed = vec3( position );\n\n#ifdef USE_ALPHAHASH\n\n\tvPosition = vec3( position );\n\n#endif\n",
                beginnormal_vertex: "\nvec3 objectNormal = vec3( normal );\n\n#ifdef USE_TANGENT\n\n\tvec3 objectTangent = vec3( tangent.xyz );\n\n#endif\n",
                bsdfs: "\n\nfloat G_BlinnPhong_Implicit( /* const in float dotNL, const in float dotNV */ ) {\n\n\t// geometry term is (n dot l)(n dot v) / 4(n dot l)(n dot v)\n\treturn 0.25;\n\n}\n\nfloat D_BlinnPhong( const in float shininess, const in float dotNH ) {\n\n\treturn RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );\n\n}\n\nvec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {\n\n\tvec3 halfDir = normalize( lightDir + viewDir );\n\n\tfloat dotNH = saturate( dot( normal, halfDir ) );\n\tfloat dotVH = saturate( dot( viewDir, halfDir ) );\n\n\tvec3 F = F_Schlick( specularColor, 1.0, dotVH );\n\n\tfloat G = G_BlinnPhong_Implicit( /* dotNL, dotNV */ );\n\n\tfloat D = D_BlinnPhong( shininess, dotNH );\n\n\treturn F * ( G * D );\n\n} // validated\n\n",
                iridescence_fragment: "\n\n#ifdef USE_IRIDESCENCE\n\n\t// XYZ to linear-sRGB color space\n\tconst mat3 XYZ_TO_REC709 = mat3(\n\t\t 3.2404542, -0.9692660,  0.0556434,\n\t\t-1.5371385,  1.8760108, -0.2040259,\n\t\t-0.4985314,  0.0415560,  1.0572252\n\t);\n\n\t// Assume air interface for top\n\t// Note: We don't handle the case fresnel0 == 1\n\tvec3 Fresnel0ToIor( vec3 fresnel0 ) {\n\n\t\tvec3 sqrtF0 = sqrt( fresnel0 );\n\t\treturn ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );\n\n\t}\n\n\t// Conversion FO/IOR\n\tvec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {\n\n\t\treturn pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );\n\n\t}\n\n\t// ior is a value between 1.0 and 3.0. 1.0 is air interface\n\tfloat IorToFresnel0( float transmittedIor, float incidentIor ) {\n\n\t\treturn pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));\n\n\t}\n\n\t// Fresnel equations for dielectric/dielectric interfaces.\n\t// Ref: https://belcour.github.io/blog/research/2017/05/01/brdf-thin-film.html\n\t// Evaluation XYZ sensitivity curves in Fourier space\n\tvec3 evalSensitivity( float OPD, vec3 shift ) {\n\n\t\tfloat phase = 2.0 * PI * OPD * 1.0e-9;\n\t\tvec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );\n\t\tvec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );\n\t\tvec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );\n\n\t\tvec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );\n\t\txyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );\n\t\txyz /= 1.0685e-7;\n\n\t\tvec3 rgb = XYZ_TO_REC709 * xyz;\n\t\treturn rgb;\n\n\t}\n\n\tvec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {\n\n\t\tvec3 I;\n\n\t\t// Force iridescenceIOR -> outsideIOR when thinFilmThickness -> 0.0\n\t\tfloat iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );\n\t\t// Evaluate the cosTheta on the base layer (Snell law)\n\t\tfloat sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );\n\n\t\t// Handle TIR:\n\t\tfloat cosTheta2Sq = 1.0 - sinTheta2Sq;\n\t\tif ( cosTheta2Sq < 0.0 ) {\n\n\t\t\treturn vec3( 1.0 );\n\n\t\t}\n\n\t\tfloat cosTheta2 = sqrt( cosTheta2Sq );\n\n\t\t// First interface\n\t\tfloat R0 = IorToFresnel0( iridescenceIOR, outsideIOR );\n\t\tfloat R12 = F_Schlick( R0, 1.0, cosTheta1 );\n\t\tfloat T121 = 1.0 - R12;\n\t\tfloat phi12 = 0.0;\n\t\tif ( iridescenceIOR < outsideIOR ) phi12 = PI;\n\t\tfloat phi21 = PI - phi12;\n\n\t\t// Second interface\n\t\tvec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) ); // guard against 1.0\n\t\tvec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );\n\t\tvec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );\n\t\tvec3 phi23 = vec3( 0.0 );\n\t\tif ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;\n\t\tif ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;\n\t\tif ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;\n\n\t\t// Phase shift\n\t\tfloat OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;\n\t\tvec3 phi = vec3( phi21 ) + phi23;\n\n\t\t// Compound terms\n\t\tvec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );\n\t\tvec3 r123 = sqrt( R123 );\n\t\tvec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );\n\n\t\t// Reflectance term for m = 0 (DC term amplitude)\n\t\tvec3 C0 = R12 + Rs;\n\t\tI = C0;\n\n\t\t// Reflectance term for m > 0 (pairs of diracs)\n\t\tvec3 Cm = Rs - T121;\n\t\tfor ( int m = 1; m <= 2; ++ m ) {\n\n\t\t\tCm *= r123;\n\t\t\tvec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );\n\t\t\tI += Cm * Sm;\n\n\t\t}\n\n\t\t// Since out of gamut colors might be produced, negative color values are clamped to 0.\n\t\treturn max( I, vec3( 0.0 ) );\n\n\t}\n\n#endif\n\n",
                bumpmap_pars_fragment: "\n#ifdef USE_BUMPMAP\n\n\tuniform sampler2D bumpMap;\n\tuniform float bumpScale;\n\n\t// Bump Mapping Unparametrized Surfaces on the GPU by Morten S. Mikkelsen\n\t// https://mmikk.github.io/papers3d/mm_sfgrad_bump.pdf\n\n\t// Evaluate the derivative of the height w.r.t. screen-space using forward differencing (listing 2)\n\n\tvec2 dHdxy_fwd() {\n\n\t\tvec2 dSTdx = dFdx( vBumpMapUv );\n\t\tvec2 dSTdy = dFdy( vBumpMapUv );\n\n\t\tfloat Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;\n\t\tfloat dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;\n\t\tfloat dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;\n\n\t\treturn vec2( dBx, dBy );\n\n\t}\n\n\tvec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {\n\n\t\tvec3 vSigmaX = dFdx( surf_pos.xyz );\n\t\tvec3 vSigmaY = dFdy( surf_pos.xyz );\n\t\tvec3 vN = surf_norm; // normalized\n\n\t\tvec3 R1 = cross( vSigmaY, vN );\n\t\tvec3 R2 = cross( vN, vSigmaX );\n\n\t\tfloat fDet = dot( vSigmaX, R1 ) * faceDirection;\n\n\t\tvec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n\t\treturn normalize( abs( fDet ) * surf_norm - vGrad );\n\n\t}\n\n#endif\n",
                clipping_planes_fragment: "\n#if NUM_CLIPPING_PLANES > 0\n\n\tvec4 plane;\n\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {\n\n\t\tplane = clippingPlanes[ i ];\n\t\tif ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;\n\n\t}\n\t#pragma unroll_loop_end\n\n\t#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES\n\n\t\tbool clipped = true;\n\n\t\t#pragma unroll_loop_start\n\t\tfor ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {\n\n\t\t\tplane = clippingPlanes[ i ];\n\t\t\tclipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;\n\n\t\t}\n\t\t#pragma unroll_loop_end\n\n\t\tif ( clipped ) discard;\n\n\t#endif\n\n#endif\n",
                clipping_planes_pars_fragment: "\n#if NUM_CLIPPING_PLANES > 0\n\n\tvarying vec3 vClipPosition;\n\n\tuniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];\n\n#endif\n",
                clipping_planes_pars_vertex: "\n#if NUM_CLIPPING_PLANES > 0\n\n\tvarying vec3 vClipPosition;\n\n#endif\n",
                clipping_planes_vertex: "\n#if NUM_CLIPPING_PLANES > 0\n\n\tvClipPosition = - mvPosition.xyz;\n\n#endif\n",
                color_fragment: "\n#if defined( USE_COLOR_ALPHA )\n\n\tdiffuseColor *= vColor;\n\n#elif defined( USE_COLOR )\n\n\tdiffuseColor.rgb *= vColor;\n\n#endif\n",
                color_pars_fragment: "\n#if defined( USE_COLOR_ALPHA )\n\n\tvarying vec4 vColor;\n\n#elif defined( USE_COLOR )\n\n\tvarying vec3 vColor;\n\n#endif\n",
                color_pars_vertex: "\n#if defined( USE_COLOR_ALPHA )\n\n\tvarying vec4 vColor;\n\n#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )\n\n\tvarying vec3 vColor;\n\n#endif\n",
                color_vertex: "\n#if defined( USE_COLOR_ALPHA )\n\n\tvColor = vec4( 1.0 );\n\n#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )\n\n\tvColor = vec3( 1.0 );\n\n#endif\n\n#ifdef USE_COLOR\n\n\tvColor *= color;\n\n#endif\n\n#ifdef USE_INSTANCING_COLOR\n\n\tvColor.xyz *= instanceColor.xyz;\n\n#endif\n",
                common: "\n#define PI 3.141592653589793\n#define PI2 6.283185307179586\n#define PI_HALF 1.5707963267948966\n#define RECIPROCAL_PI 0.3183098861837907\n#define RECIPROCAL_PI2 0.15915494309189535\n#define EPSILON 1e-6\n\n#ifndef saturate\n// <tonemapping_pars_fragment> may have defined saturate() already\n#define saturate( a ) clamp( a, 0.0, 1.0 )\n#endif\n#define whiteComplement( a ) ( 1.0 - saturate( a ) )\n\nfloat pow2( const in float x ) { return x*x; }\nvec3 pow2( const in vec3 x ) { return x*x; }\nfloat pow3( const in float x ) { return x*x*x; }\nfloat pow4( const in float x ) { float x2 = x*x; return x2*x2; }\nfloat max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }\nfloat average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }\n\n// expects values in the range of [0,1]x[0,1], returns values in the [0,1] range.\n// do not collapse into a single function per: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/\nhighp float rand( const in vec2 uv ) {\n\n\tconst highp float a = 12.9898, b = 78.233, c = 43758.5453;\n\thighp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );\n\n\treturn fract( sin( sn ) * c );\n\n}\n\n#ifdef HIGH_PRECISION\n\tfloat precisionSafeLength( vec3 v ) { return length( v ); }\n#else\n\tfloat precisionSafeLength( vec3 v ) {\n\t\tfloat maxComponent = max3( abs( v ) );\n\t\treturn length( v / maxComponent ) * maxComponent;\n\t}\n#endif\n\nstruct IncidentLight {\n\tvec3 color;\n\tvec3 direction;\n\tbool visible;\n};\n\nstruct ReflectedLight {\n\tvec3 directDiffuse;\n\tvec3 directSpecular;\n\tvec3 indirectDiffuse;\n\tvec3 indirectSpecular;\n};\n\nstruct GeometricContext {\n\tvec3 position;\n\tvec3 normal;\n\tvec3 viewDir;\n#ifdef USE_CLEARCOAT\n\tvec3 clearcoatNormal;\n#endif\n};\n\n#ifdef USE_ALPHAHASH\n\n\tvarying vec3 vPosition;\n\n#endif\n\nvec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n\n\treturn normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n\n}\n\nvec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {\n\n\t// dir can be either a direction vector or a normal vector\n\t// upper-left 3x3 of matrix is assumed to be orthogonal\n\n\treturn normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );\n\n}\n\nmat3 transposeMat3( const in mat3 m ) {\n\n\tmat3 tmp;\n\n\ttmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );\n\ttmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );\n\ttmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );\n\n\treturn tmp;\n\n}\n\nfloat luminance( const in vec3 rgb ) {\n\n\t// assumes rgb is in linear color space with sRGB primaries and D65 white point\n\n\tconst vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );\n\n\treturn dot( weights, rgb );\n\n}\n\nbool isPerspectiveMatrix( mat4 m ) {\n\n\treturn m[ 2 ][ 3 ] == - 1.0;\n\n}\n\nvec2 equirectUv( in vec3 dir ) {\n\n\t// dir is assumed to be unit length\n\n\tfloat u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;\n\n\tfloat v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;\n\n\treturn vec2( u, v );\n\n}\n\nvec3 BRDF_Lambert( const in vec3 diffuseColor ) {\n\n\treturn RECIPROCAL_PI * diffuseColor;\n\n} // validated\n\nvec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {\n\n\t// Original approximation by Christophe Schlick '94\n\t// float fresnel = pow( 1.0 - dotVH, 5.0 );\n\n\t// Optimized variant (presented by Epic at SIGGRAPH '13)\n\t// https://cdn2.unrealengine.com/Resources/files/2013SiggraphPresentationsNotes-26915738.pdf\n\tfloat fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );\n\n\treturn f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );\n\n} // validated\n\nfloat F_Schlick( const in float f0, const in float f90, const in float dotVH ) {\n\n\t// Original approximation by Christophe Schlick '94\n\t// float fresnel = pow( 1.0 - dotVH, 5.0 );\n\n\t// Optimized variant (presented by Epic at SIGGRAPH '13)\n\t// https://cdn2.unrealengine.com/Resources/files/2013SiggraphPresentationsNotes-26915738.pdf\n\tfloat fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );\n\n\treturn f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );\n\n} // validated\n",
                cube_uv_reflection_fragment: "\n#ifdef ENVMAP_TYPE_CUBE_UV\n\n\t#define cubeUV_minMipLevel 4.0\n\t#define cubeUV_minTileSize 16.0\n\n\t// These shader functions convert between the UV coordinates of a single face of\n\t// a cubemap, the 0-5 integer index of a cube face, and the direction vector for\n\t// sampling a textureCube (not generally normalized ).\n\n\tfloat getFace( vec3 direction ) {\n\n\t\tvec3 absDirection = abs( direction );\n\n\t\tfloat face = - 1.0;\n\n\t\tif ( absDirection.x > absDirection.z ) {\n\n\t\t\tif ( absDirection.x > absDirection.y )\n\n\t\t\t\tface = direction.x > 0.0 ? 0.0 : 3.0;\n\n\t\t\telse\n\n\t\t\t\tface = direction.y > 0.0 ? 1.0 : 4.0;\n\n\t\t} else {\n\n\t\t\tif ( absDirection.z > absDirection.y )\n\n\t\t\t\tface = direction.z > 0.0 ? 2.0 : 5.0;\n\n\t\t\telse\n\n\t\t\t\tface = direction.y > 0.0 ? 1.0 : 4.0;\n\n\t\t}\n\n\t\treturn face;\n\n\t}\n\n\t// RH coordinate system; PMREM face-indexing convention\n\tvec2 getUV( vec3 direction, float face ) {\n\n\t\tvec2 uv;\n\n\t\tif ( face == 0.0 ) {\n\n\t\t\tuv = vec2( direction.z, direction.y ) / abs( direction.x ); // pos x\n\n\t\t} else if ( face == 1.0 ) {\n\n\t\t\tuv = vec2( - direction.x, - direction.z ) / abs( direction.y ); // pos y\n\n\t\t} else if ( face == 2.0 ) {\n\n\t\t\tuv = vec2( - direction.x, direction.y ) / abs( direction.z ); // pos z\n\n\t\t} else if ( face == 3.0 ) {\n\n\t\t\tuv = vec2( - direction.z, direction.y ) / abs( direction.x ); // neg x\n\n\t\t} else if ( face == 4.0 ) {\n\n\t\t\tuv = vec2( - direction.x, direction.z ) / abs( direction.y ); // neg y\n\n\t\t} else {\n\n\t\t\tuv = vec2( direction.x, direction.y ) / abs( direction.z ); // neg z\n\n\t\t}\n\n\t\treturn 0.5 * ( uv + 1.0 );\n\n\t}\n\n\tvec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {\n\n\t\tfloat face = getFace( direction );\n\n\t\tfloat filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );\n\n\t\tmipInt = max( mipInt, cubeUV_minMipLevel );\n\n\t\tfloat faceSize = exp2( mipInt );\n\n\t\thighp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0; // #25071\n\n\t\tif ( face > 2.0 ) {\n\n\t\t\tuv.y += faceSize;\n\n\t\t\tface -= 3.0;\n\n\t\t}\n\n\t\tuv.x += face * faceSize;\n\n\t\tuv.x += filterInt * 3.0 * cubeUV_minTileSize;\n\n\t\tuv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );\n\n\t\tuv.x *= CUBEUV_TEXEL_WIDTH;\n\t\tuv.y *= CUBEUV_TEXEL_HEIGHT;\n\n\t\t#ifdef texture2DGradEXT\n\n\t\t\treturn texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb; // disable anisotropic filtering\n\n\t\t#else\n\n\t\t\treturn texture2D( envMap, uv ).rgb;\n\n\t\t#endif\n\n\t}\n\n\t// These defines must match with PMREMGenerator\n\n\t#define cubeUV_r0 1.0\n\t#define cubeUV_v0 0.339\n\t#define cubeUV_m0 - 2.0\n\t#define cubeUV_r1 0.8\n\t#define cubeUV_v1 0.276\n\t#define cubeUV_m1 - 1.0\n\t#define cubeUV_r4 0.4\n\t#define cubeUV_v4 0.046\n\t#define cubeUV_m4 2.0\n\t#define cubeUV_r5 0.305\n\t#define cubeUV_v5 0.016\n\t#define cubeUV_m5 3.0\n\t#define cubeUV_r6 0.21\n\t#define cubeUV_v6 0.0038\n\t#define cubeUV_m6 4.0\n\n\tfloat roughnessToMip( float roughness ) {\n\n\t\tfloat mip = 0.0;\n\n\t\tif ( roughness >= cubeUV_r1 ) {\n\n\t\t\tmip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;\n\n\t\t} else if ( roughness >= cubeUV_r4 ) {\n\n\t\t\tmip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;\n\n\t\t} else if ( roughness >= cubeUV_r5 ) {\n\n\t\t\tmip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;\n\n\t\t} else if ( roughness >= cubeUV_r6 ) {\n\n\t\t\tmip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;\n\n\t\t} else {\n\n\t\t\tmip = - 2.0 * log2( 1.16 * roughness ); // 1.16 = 1.79^0.25\n\t\t}\n\n\t\treturn mip;\n\n\t}\n\n\tvec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {\n\n\t\tfloat mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );\n\n\t\tfloat mipF = fract( mip );\n\n\t\tfloat mipInt = floor( mip );\n\n\t\tvec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );\n\n\t\tif ( mipF == 0.0 ) {\n\n\t\t\treturn vec4( color0, 1.0 );\n\n\t\t} else {\n\n\t\t\tvec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );\n\n\t\t\treturn vec4( mix( color0, color1, mipF ), 1.0 );\n\n\t\t}\n\n\t}\n\n#endif\n",
                defaultnormal_vertex: "\nvec3 transformedNormal = objectNormal;\n\n#ifdef USE_INSTANCING\n\n\t// this is in lieu of a per-instance normal-matrix\n\t// shear transforms in the instance matrix are not supported\n\n\tmat3 m = mat3( instanceMatrix );\n\n\ttransformedNormal /= vec3( dot( m[ 0 ], m[ 0 ] ), dot( m[ 1 ], m[ 1 ] ), dot( m[ 2 ], m[ 2 ] ) );\n\n\ttransformedNormal = m * transformedNormal;\n\n#endif\n\ntransformedNormal = normalMatrix * transformedNormal;\n\n#ifdef FLIP_SIDED\n\n\ttransformedNormal = - transformedNormal;\n\n#endif\n\n#ifdef USE_TANGENT\n\n\tvec3 transformedTangent = ( modelViewMatrix * vec4( objectTangent, 0.0 ) ).xyz;\n\n\t#ifdef FLIP_SIDED\n\n\t\ttransformedTangent = - transformedTangent;\n\n\t#endif\n\n#endif\n",
                displacementmap_pars_vertex: "\n#ifdef USE_DISPLACEMENTMAP\n\n\tuniform sampler2D displacementMap;\n\tuniform float displacementScale;\n\tuniform float displacementBias;\n\n#endif\n",
                displacementmap_vertex: "\n#ifdef USE_DISPLACEMENTMAP\n\n\ttransformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );\n\n#endif\n",
                emissivemap_fragment: "\n#ifdef USE_EMISSIVEMAP\n\n\tvec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );\n\n\ttotalEmissiveRadiance *= emissiveColor.rgb;\n\n#endif\n",
                emissivemap_pars_fragment: "\n#ifdef USE_EMISSIVEMAP\n\n\tuniform sampler2D emissiveMap;\n\n#endif\n",
                colorspace_fragment: "\ngl_FragColor = linearToOutputTexel( gl_FragColor );\n",
                colorspace_pars_fragment: "\n\nvec4 LinearToLinear( in vec4 value ) {\n\treturn value;\n}\n\nvec4 LinearTosRGB( in vec4 value ) {\n\treturn vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );\n}\n\n",
                envmap_fragment: "\n#ifdef USE_ENVMAP\n\n\t#ifdef ENV_WORLDPOS\n\n\t\tvec3 cameraToFrag;\n\n\t\tif ( isOrthographic ) {\n\n\t\t\tcameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );\n\n\t\t} else {\n\n\t\t\tcameraToFrag = normalize( vWorldPosition - cameraPosition );\n\n\t\t}\n\n\t\t// Transforming Normal Vectors with the Inverse Transformation\n\t\tvec3 worldNormal = inverseTransformDirection( normal, viewMatrix );\n\n\t\t#ifdef ENVMAP_MODE_REFLECTION\n\n\t\t\tvec3 reflectVec = reflect( cameraToFrag, worldNormal );\n\n\t\t#else\n\n\t\t\tvec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );\n\n\t\t#endif\n\n\t#else\n\n\t\tvec3 reflectVec = vReflect;\n\n\t#endif\n\n\t#ifdef ENVMAP_TYPE_CUBE\n\n\t\tvec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );\n\n\t#else\n\n\t\tvec4 envColor = vec4( 0.0 );\n\n\t#endif\n\n\t#ifdef ENVMAP_BLENDING_MULTIPLY\n\n\t\toutgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );\n\n\t#elif defined( ENVMAP_BLENDING_MIX )\n\n\t\toutgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );\n\n\t#elif defined( ENVMAP_BLENDING_ADD )\n\n\t\toutgoingLight += envColor.xyz * specularStrength * reflectivity;\n\n\t#endif\n\n#endif\n",
                envmap_common_pars_fragment: "\n#ifdef USE_ENVMAP\n\n\tuniform float envMapIntensity;\n\tuniform float flipEnvMap;\n\n\t#ifdef ENVMAP_TYPE_CUBE\n\t\tuniform samplerCube envMap;\n\t#else\n\t\tuniform sampler2D envMap;\n\t#endif\n\t\n#endif\n",
                envmap_pars_fragment: "\n#ifdef USE_ENVMAP\n\n\tuniform float reflectivity;\n\n\t#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )\n\n\t\t#define ENV_WORLDPOS\n\n\t#endif\n\n\t#ifdef ENV_WORLDPOS\n\n\t\tvarying vec3 vWorldPosition;\n\t\tuniform float refractionRatio;\n\t#else\n\t\tvarying vec3 vReflect;\n\t#endif\n\n#endif\n",
                envmap_pars_vertex: "\n#ifdef USE_ENVMAP\n\n\t#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )\n\n\t\t#define ENV_WORLDPOS\n\n\t#endif\n\n\t#ifdef ENV_WORLDPOS\n\t\t\n\t\tvarying vec3 vWorldPosition;\n\n\t#else\n\n\t\tvarying vec3 vReflect;\n\t\tuniform float refractionRatio;\n\n\t#endif\n\n#endif\n",
                envmap_physical_pars_fragment: "\n#ifdef USE_ENVMAP\n\n\tvec3 getIBLIrradiance( const in vec3 normal ) {\n\n\t\t#ifdef ENVMAP_TYPE_CUBE_UV\n\n\t\t\tvec3 worldNormal = inverseTransformDirection( normal, viewMatrix );\n\n\t\t\tvec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );\n\n\t\t\treturn PI * envMapColor.rgb * envMapIntensity;\n\n\t\t#else\n\n\t\t\treturn vec3( 0.0 );\n\n\t\t#endif\n\n\t}\n\n\tvec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {\n\n\t\t#ifdef ENVMAP_TYPE_CUBE_UV\n\n\t\t\tvec3 reflectVec = reflect( - viewDir, normal );\n\n\t\t\t// Mixing the reflection with the normal is more accurate and keeps rough objects from gathering light from behind their tangent plane.\n\t\t\treflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );\n\n\t\t\treflectVec = inverseTransformDirection( reflectVec, viewMatrix );\n\n\t\t\tvec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );\n\n\t\t\treturn envMapColor.rgb * envMapIntensity;\n\n\t\t#else\n\n\t\t\treturn vec3( 0.0 );\n\n\t\t#endif\n\n\t}\n\n\t#ifdef USE_ANISOTROPY\n\n\t\tvec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {\n\n\t\t\t#ifdef ENVMAP_TYPE_CUBE_UV\n\n\t\t\t  // https://google.github.io/filament/Filament.md.html#lighting/imagebasedlights/anisotropy\n\t\t\t\tvec3 bentNormal = cross( bitangent, viewDir );\n\t\t\t\tbentNormal = normalize( cross( bentNormal, bitangent ) );\n\t\t\t\tbentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );\n\n\t\t\t\treturn getIBLRadiance( viewDir, bentNormal, roughness );\n\n\t\t\t#else\n\n\t\t\t\treturn vec3( 0.0 );\n\n\t\t\t#endif\n\n\t\t}\n\n\t#endif\n\n#endif\n",
                envmap_vertex: "\n#ifdef USE_ENVMAP\n\n\t#ifdef ENV_WORLDPOS\n\n\t\tvWorldPosition = worldPosition.xyz;\n\n\t#else\n\n\t\tvec3 cameraToVertex;\n\n\t\tif ( isOrthographic ) {\n\n\t\t\tcameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );\n\n\t\t} else {\n\n\t\t\tcameraToVertex = normalize( worldPosition.xyz - cameraPosition );\n\n\t\t}\n\n\t\tvec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );\n\n\t\t#ifdef ENVMAP_MODE_REFLECTION\n\n\t\t\tvReflect = reflect( cameraToVertex, worldNormal );\n\n\t\t#else\n\n\t\t\tvReflect = refract( cameraToVertex, worldNormal, refractionRatio );\n\n\t\t#endif\n\n\t#endif\n\n#endif\n",
                fog_vertex: "\n#ifdef USE_FOG\n\n\tvFogDepth = - mvPosition.z;\n\n#endif\n",
                fog_pars_vertex: "\n#ifdef USE_FOG\n\n\tvarying float vFogDepth;\n\n#endif\n",
                fog_fragment: "\n#ifdef USE_FOG\n\n\t#ifdef FOG_EXP2\n\n\t\tfloat fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );\n\n\t#else\n\n\t\tfloat fogFactor = smoothstep( fogNear, fogFar, vFogDepth );\n\n\t#endif\n\n\tgl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );\n\n#endif\n",
                fog_pars_fragment: "\n#ifdef USE_FOG\n\n\tuniform vec3 fogColor;\n\tvarying float vFogDepth;\n\n\t#ifdef FOG_EXP2\n\n\t\tuniform float fogDensity;\n\n\t#else\n\n\t\tuniform float fogNear;\n\t\tuniform float fogFar;\n\n\t#endif\n\n#endif\n",
                gradientmap_pars_fragment: "\n\n#ifdef USE_GRADIENTMAP\n\n\tuniform sampler2D gradientMap;\n\n#endif\n\nvec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {\n\n\t// dotNL will be from -1.0 to 1.0\n\tfloat dotNL = dot( normal, lightDirection );\n\tvec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );\n\n\t#ifdef USE_GRADIENTMAP\n\n\t\treturn vec3( texture2D( gradientMap, coord ).r );\n\n\t#else\n\n\t\tvec2 fw = fwidth( coord ) * 0.5;\n\t\treturn mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );\n\n\t#endif\n\n}\n",
                lightmap_fragment: "\n#ifdef USE_LIGHTMAP\n\n\tvec4 lightMapTexel = texture2D( lightMap, vLightMapUv );\n\tvec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;\n\n\treflectedLight.indirectDiffuse += lightMapIrradiance;\n\n#endif\n",
                lightmap_pars_fragment: "\n#ifdef USE_LIGHTMAP\n\n\tuniform sampler2D lightMap;\n\tuniform float lightMapIntensity;\n\n#endif\n",
                lights_lambert_fragment: "\nLambertMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;\nmaterial.specularStrength = specularStrength;\n",
                lights_lambert_pars_fragment: "\nvarying vec3 vViewPosition;\n\nstruct LambertMaterial {\n\n\tvec3 diffuseColor;\n\tfloat specularStrength;\n\n};\n\nvoid RE_Direct_Lambert( const in IncidentLight directLight, const in GeometricContext geometry, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {\n\n\tfloat dotNL = saturate( dot( geometry.normal, directLight.direction ) );\n\tvec3 irradiance = dotNL * directLight.color;\n\n\treflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n\n}\n\nvoid RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in GeometricContext geometry, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {\n\n\treflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n\n}\n\n#define RE_Direct\t\t\t\tRE_Direct_Lambert\n#define RE_IndirectDiffuse\t\tRE_IndirectDiffuse_Lambert\n",
                lights_pars_begin: "\nuniform bool receiveShadow;\nuniform vec3 ambientLightColor;\nuniform vec3 lightProbe[ 9 ];\n\n// get the irradiance (radiance convolved with cosine lobe) at the point 'normal' on the unit sphere\n// source: https://graphics.stanford.edu/papers/envmap/envmap.pdf\nvec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {\n\n\t// normal is assumed to have unit length\n\n\tfloat x = normal.x, y = normal.y, z = normal.z;\n\n\t// band 0\n\tvec3 result = shCoefficients[ 0 ] * 0.886227;\n\n\t// band 1\n\tresult += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;\n\tresult += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;\n\tresult += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;\n\n\t// band 2\n\tresult += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;\n\tresult += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;\n\tresult += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );\n\tresult += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;\n\tresult += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );\n\n\treturn result;\n\n}\n\nvec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {\n\n\tvec3 worldNormal = inverseTransformDirection( normal, viewMatrix );\n\n\tvec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );\n\n\treturn irradiance;\n\n}\n\nvec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {\n\n\tvec3 irradiance = ambientLightColor;\n\n\treturn irradiance;\n\n}\n\nfloat getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {\n\n\t#if defined ( LEGACY_LIGHTS )\n\n\t\tif ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {\n\n\t\t\treturn pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );\n\n\t\t}\n\n\t\treturn 1.0;\n\n\t#else\n\n\t\t// based upon Frostbite 3 Moving to Physically-based Rendering\n\t\t// page 32, equation 26: E[window1]\n\t\t// https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf\n\t\tfloat distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );\n\n\t\tif ( cutoffDistance > 0.0 ) {\n\n\t\t\tdistanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );\n\n\t\t}\n\n\t\treturn distanceFalloff;\n\n\t#endif\n\n}\n\nfloat getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {\n\n\treturn smoothstep( coneCosine, penumbraCosine, angleCosine );\n\n}\n\n#if NUM_DIR_LIGHTS > 0\n\n\tstruct DirectionalLight {\n\t\tvec3 direction;\n\t\tvec3 color;\n\t};\n\n\tuniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];\n\n\tvoid getDirectionalLightInfo( const in DirectionalLight directionalLight, const in GeometricContext geometry, out IncidentLight light ) {\n\n\t\tlight.color = directionalLight.color;\n\t\tlight.direction = directionalLight.direction;\n\t\tlight.visible = true;\n\n\t}\n\n#endif\n\n\n#if NUM_POINT_LIGHTS > 0\n\n\tstruct PointLight {\n\t\tvec3 position;\n\t\tvec3 color;\n\t\tfloat distance;\n\t\tfloat decay;\n\t};\n\n\tuniform PointLight pointLights[ NUM_POINT_LIGHTS ];\n\n\t// light is an out parameter as having it as a return value caused compiler errors on some devices\n\tvoid getPointLightInfo( const in PointLight pointLight, const in GeometricContext geometry, out IncidentLight light ) {\n\n\t\tvec3 lVector = pointLight.position - geometry.position;\n\n\t\tlight.direction = normalize( lVector );\n\n\t\tfloat lightDistance = length( lVector );\n\n\t\tlight.color = pointLight.color;\n\t\tlight.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );\n\t\tlight.visible = ( light.color != vec3( 0.0 ) );\n\n\t}\n\n#endif\n\n\n#if NUM_SPOT_LIGHTS > 0\n\n\tstruct SpotLight {\n\t\tvec3 position;\n\t\tvec3 direction;\n\t\tvec3 color;\n\t\tfloat distance;\n\t\tfloat decay;\n\t\tfloat coneCos;\n\t\tfloat penumbraCos;\n\t};\n\n\tuniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];\n\n\t// light is an out parameter as having it as a return value caused compiler errors on some devices\n\tvoid getSpotLightInfo( const in SpotLight spotLight, const in GeometricContext geometry, out IncidentLight light ) {\n\n\t\tvec3 lVector = spotLight.position - geometry.position;\n\n\t\tlight.direction = normalize( lVector );\n\n\t\tfloat angleCos = dot( light.direction, spotLight.direction );\n\n\t\tfloat spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );\n\n\t\tif ( spotAttenuation > 0.0 ) {\n\n\t\t\tfloat lightDistance = length( lVector );\n\n\t\t\tlight.color = spotLight.color * spotAttenuation;\n\t\t\tlight.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );\n\t\t\tlight.visible = ( light.color != vec3( 0.0 ) );\n\n\t\t} else {\n\n\t\t\tlight.color = vec3( 0.0 );\n\t\t\tlight.visible = false;\n\n\t\t}\n\n\t}\n\n#endif\n\n\n#if NUM_RECT_AREA_LIGHTS > 0\n\n\tstruct RectAreaLight {\n\t\tvec3 color;\n\t\tvec3 position;\n\t\tvec3 halfWidth;\n\t\tvec3 halfHeight;\n\t};\n\n\t// Pre-computed values of LinearTransformedCosine approximation of BRDF\n\t// BRDF approximation Texture is 64x64\n\tuniform sampler2D ltc_1; // RGBA Float\n\tuniform sampler2D ltc_2; // RGBA Float\n\n\tuniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];\n\n#endif\n\n\n#if NUM_HEMI_LIGHTS > 0\n\n\tstruct HemisphereLight {\n\t\tvec3 direction;\n\t\tvec3 skyColor;\n\t\tvec3 groundColor;\n\t};\n\n\tuniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];\n\n\tvec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {\n\n\t\tfloat dotNL = dot( normal, hemiLight.direction );\n\t\tfloat hemiDiffuseWeight = 0.5 * dotNL + 0.5;\n\n\t\tvec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );\n\n\t\treturn irradiance;\n\n\t}\n\n#endif\n",
                lights_toon_fragment: "\nToonMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;\n",
                lights_toon_pars_fragment: "\nvarying vec3 vViewPosition;\n\nstruct ToonMaterial {\n\n\tvec3 diffuseColor;\n\n};\n\nvoid RE_Direct_Toon( const in IncidentLight directLight, const in GeometricContext geometry, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {\n\n\tvec3 irradiance = getGradientIrradiance( geometry.normal, directLight.direction ) * directLight.color;\n\n\treflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n\n}\n\nvoid RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in GeometricContext geometry, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {\n\n\treflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n\n}\n\n#define RE_Direct\t\t\t\tRE_Direct_Toon\n#define RE_IndirectDiffuse\t\tRE_IndirectDiffuse_Toon\n",
                lights_phong_fragment: "\nBlinnPhongMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;\nmaterial.specularColor = specular;\nmaterial.specularShininess = shininess;\nmaterial.specularStrength = specularStrength;\n",
                lights_phong_pars_fragment: "\nvarying vec3 vViewPosition;\n\nstruct BlinnPhongMaterial {\n\n\tvec3 diffuseColor;\n\tvec3 specularColor;\n\tfloat specularShininess;\n\tfloat specularStrength;\n\n};\n\nvoid RE_Direct_BlinnPhong( const in IncidentLight directLight, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {\n\n\tfloat dotNL = saturate( dot( geometry.normal, directLight.direction ) );\n\tvec3 irradiance = dotNL * directLight.color;\n\n\treflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n\n\treflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometry.viewDir, geometry.normal, material.specularColor, material.specularShininess ) * material.specularStrength;\n\n}\n\nvoid RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in GeometricContext geometry, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {\n\n\treflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n\n}\n\n#define RE_Direct\t\t\t\tRE_Direct_BlinnPhong\n#define RE_IndirectDiffuse\t\tRE_IndirectDiffuse_BlinnPhong\n",
                lights_physical_fragment: "\nPhysicalMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );\n\nvec3 dxy = max( abs( dFdx( geometryNormal ) ), abs( dFdy( geometryNormal ) ) );\nfloat geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );\n\nmaterial.roughness = max( roughnessFactor, 0.0525 );// 0.0525 corresponds to the base mip of a 256 cubemap.\nmaterial.roughness += geometryRoughness;\nmaterial.roughness = min( material.roughness, 1.0 );\n\n#ifdef IOR\n\n\tmaterial.ior = ior;\n\n\t#ifdef USE_SPECULAR\n\n\t\tfloat specularIntensityFactor = specularIntensity;\n\t\tvec3 specularColorFactor = specularColor;\n\n\t\t#ifdef USE_SPECULAR_COLORMAP\n\n\t\t\tspecularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;\n\n\t\t#endif\n\n\t\t#ifdef USE_SPECULAR_INTENSITYMAP\n\n\t\t\tspecularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;\n\n\t\t#endif\n\n\t\tmaterial.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );\n\n\t#else\n\n\t\tfloat specularIntensityFactor = 1.0;\n\t\tvec3 specularColorFactor = vec3( 1.0 );\n\t\tmaterial.specularF90 = 1.0;\n\n\t#endif\n\n\tmaterial.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );\n\n#else\n\n\tmaterial.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );\n\tmaterial.specularF90 = 1.0;\n\n#endif\n\n#ifdef USE_CLEARCOAT\n\n\tmaterial.clearcoat = clearcoat;\n\tmaterial.clearcoatRoughness = clearcoatRoughness;\n\tmaterial.clearcoatF0 = vec3( 0.04 );\n\tmaterial.clearcoatF90 = 1.0;\n\n\t#ifdef USE_CLEARCOATMAP\n\n\t\tmaterial.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;\n\n\t#endif\n\n\t#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n\n\t\tmaterial.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;\n\n\t#endif\n\n\tmaterial.clearcoat = saturate( material.clearcoat ); // Burley clearcoat model\n\tmaterial.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );\n\tmaterial.clearcoatRoughness += geometryRoughness;\n\tmaterial.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );\n\n#endif\n\n#ifdef USE_IRIDESCENCE\n\n\tmaterial.iridescence = iridescence;\n\tmaterial.iridescenceIOR = iridescenceIOR;\n\n\t#ifdef USE_IRIDESCENCEMAP\n\n\t\tmaterial.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;\n\n\t#endif\n\n\t#ifdef USE_IRIDESCENCE_THICKNESSMAP\n\n\t\tmaterial.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;\n\n\t#else\n\n\t\tmaterial.iridescenceThickness = iridescenceThicknessMaximum;\n\n\t#endif\n\n#endif\n\n#ifdef USE_SHEEN\n\n\tmaterial.sheenColor = sheenColor;\n\n\t#ifdef USE_SHEEN_COLORMAP\n\n\t\tmaterial.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;\n\n\t#endif\n\n\tmaterial.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );\n\n\t#ifdef USE_SHEEN_ROUGHNESSMAP\n\n\t\tmaterial.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;\n\n\t#endif\n\n#endif\n\n#ifdef USE_ANISOTROPY\n\n\t#ifdef USE_ANISOTROPYMAP\n\n\t\tmat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );\n\t\tvec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;\n\t\tvec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;\n\n\t#else\n\n\t\tvec2 anisotropyV = anisotropyVector;\n\n\t#endif\n\n\tmaterial.anisotropy = length( anisotropyV );\n\tanisotropyV /= material.anisotropy;\n\tmaterial.anisotropy = saturate( material.anisotropy );\n\n\t// Roughness along the anisotropy bitangent is the material roughness, while the tangent roughness increases with anisotropy.\n\tmaterial.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );\n\n\tmaterial.anisotropyT = tbn[ 0 ] * anisotropyV.x - tbn[ 1 ] * anisotropyV.y;\n\tmaterial.anisotropyB = tbn[ 1 ] * anisotropyV.x + tbn[ 0 ] * anisotropyV.y;\n\n#endif\n",
                lights_physical_pars_fragment: '\n\nstruct PhysicalMaterial {\n\n\tvec3 diffuseColor;\n\tfloat roughness;\n\tvec3 specularColor;\n\tfloat specularF90;\n\n\t#ifdef USE_CLEARCOAT\n\t\tfloat clearcoat;\n\t\tfloat clearcoatRoughness;\n\t\tvec3 clearcoatF0;\n\t\tfloat clearcoatF90;\n\t#endif\n\n\t#ifdef USE_IRIDESCENCE\n\t\tfloat iridescence;\n\t\tfloat iridescenceIOR;\n\t\tfloat iridescenceThickness;\n\t\tvec3 iridescenceFresnel;\n\t\tvec3 iridescenceF0;\n\t#endif\n\n\t#ifdef USE_SHEEN\n\t\tvec3 sheenColor;\n\t\tfloat sheenRoughness;\n\t#endif\n\n\t#ifdef IOR\n\t\tfloat ior;\n\t#endif\n\n\t#ifdef USE_TRANSMISSION\n\t\tfloat transmission;\n\t\tfloat transmissionAlpha;\n\t\tfloat thickness;\n\t\tfloat attenuationDistance;\n\t\tvec3 attenuationColor;\n\t#endif\n\n\t#ifdef USE_ANISOTROPY\n\t\tfloat anisotropy;\n\t\tfloat alphaT;\n\t\tvec3 anisotropyT;\n\t\tvec3 anisotropyB;\n\t#endif\n\n};\n\n// temporary\nvec3 clearcoatSpecular = vec3( 0.0 );\nvec3 sheenSpecular = vec3( 0.0 );\n\nvec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {\n    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );\n    float x2 = x * x;\n    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );\n\n    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );\n}\n\n// Moving Frostbite to Physically Based Rendering 3.0 - page 12, listing 2\n// https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf\nfloat V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {\n\n\tfloat a2 = pow2( alpha );\n\n\tfloat gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\n\tfloat gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\n\n\treturn 0.5 / max( gv + gl, EPSILON );\n\n}\n\n// Microfacet Models for Refraction through Rough Surfaces - equation (33)\n// http://graphicrants.blogspot.com/2013/08/specular-brdf-reference.html\n// alpha is "roughness squared" in Disney’s reparameterization\nfloat D_GGX( const in float alpha, const in float dotNH ) {\n\n\tfloat a2 = pow2( alpha );\n\n\tfloat denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0; // avoid alpha = 0 with dotNH = 1\n\n\treturn RECIPROCAL_PI * a2 / pow2( denom );\n\n}\n\n// https://google.github.io/filament/Filament.md.html#materialsystem/anisotropicmodel/anisotropicspecularbrdf\n#ifdef USE_ANISOTROPY\n\n\tfloat V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {\n\n\t\tfloat gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );\n\t\tfloat gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );\n\t\tfloat v = 0.5 / ( gv + gl );\n\n\t\treturn saturate(v);\n\n\t}\n\n\tfloat D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {\n\n\t\tfloat a2 = alphaT * alphaB;\n\t\thighp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );\n\t\thighp float v2 = dot( v, v );\n\t\tfloat w2 = a2 / v2;\n\n\t\treturn RECIPROCAL_PI * a2 * pow2 ( w2 );\n\n\t}\n\n#endif\n\n#ifdef USE_CLEARCOAT\n\n\t// GGX Distribution, Schlick Fresnel, GGX_SmithCorrelated Visibility\n\tvec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {\n\n\t\tvec3 f0 = material.clearcoatF0;\n\t\tfloat f90 = material.clearcoatF90;\n\t\tfloat roughness = material.clearcoatRoughness;\n\n\t\tfloat alpha = pow2( roughness ); // UE4\'s roughness\n\n\t\tvec3 halfDir = normalize( lightDir + viewDir );\n\n\t\tfloat dotNL = saturate( dot( normal, lightDir ) );\n\t\tfloat dotNV = saturate( dot( normal, viewDir ) );\n\t\tfloat dotNH = saturate( dot( normal, halfDir ) );\n\t\tfloat dotVH = saturate( dot( viewDir, halfDir ) );\n\n\t\tvec3 F = F_Schlick( f0, f90, dotVH );\n\n\t\tfloat V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );\n\n\t\tfloat D = D_GGX( alpha, dotNH );\n\n\t\treturn F * ( V * D );\n\n\t}\n\n#endif\n\nvec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {\n\n\tvec3 f0 = material.specularColor;\n\tfloat f90 = material.specularF90;\n\tfloat roughness = material.roughness;\n\n\tfloat alpha = pow2( roughness ); // UE4\'s roughness\n\n\tvec3 halfDir = normalize( lightDir + viewDir );\n\n\tfloat dotNL = saturate( dot( normal, lightDir ) );\n\tfloat dotNV = saturate( dot( normal, viewDir ) );\n\tfloat dotNH = saturate( dot( normal, halfDir ) );\n\tfloat dotVH = saturate( dot( viewDir, halfDir ) );\n\n\tvec3 F = F_Schlick( f0, f90, dotVH );\n\n\t#ifdef USE_IRIDESCENCE\n\n\t\tF = mix( F, material.iridescenceFresnel, material.iridescence );\n\n\t#endif\n\n\t#ifdef USE_ANISOTROPY\n\n\t\tfloat dotTL = dot( material.anisotropyT, lightDir );\n\t\tfloat dotTV = dot( material.anisotropyT, viewDir );\n\t\tfloat dotTH = dot( material.anisotropyT, halfDir );\n\t\tfloat dotBL = dot( material.anisotropyB, lightDir );\n\t\tfloat dotBV = dot( material.anisotropyB, viewDir );\n\t\tfloat dotBH = dot( material.anisotropyB, halfDir );\n\n\t\tfloat V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );\n\n\t\tfloat D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );\n\n\t#else\n\n\t\tfloat V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );\n\n\t\tfloat D = D_GGX( alpha, dotNH );\n\n\t#endif\n\n\treturn F * ( V * D );\n\n}\n\n// Rect Area Light\n\n// Real-Time Polygonal-Light Shading with Linearly Transformed Cosines\n// by Eric Heitz, Jonathan Dupuy, Stephen Hill and David Neubelt\n// code: https://github.com/selfshadow/ltc_code/\n\nvec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {\n\n\tconst float LUT_SIZE = 64.0;\n\tconst float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;\n\tconst float LUT_BIAS = 0.5 / LUT_SIZE;\n\n\tfloat dotNV = saturate( dot( N, V ) );\n\n\t// texture parameterized by sqrt( GGX alpha ) and sqrt( 1 - cos( theta ) )\n\tvec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );\n\n\tuv = uv * LUT_SCALE + LUT_BIAS;\n\n\treturn uv;\n\n}\n\nfloat LTC_ClippedSphereFormFactor( const in vec3 f ) {\n\n\t// Real-Time Area Lighting: a Journey from Research to Production (p.102)\n\t// An approximation of the form factor of a horizon-clipped rectangle.\n\n\tfloat l = length( f );\n\n\treturn max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );\n\n}\n\nvec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {\n\n\tfloat x = dot( v1, v2 );\n\n\tfloat y = abs( x );\n\n\t// rational polynomial approximation to theta / sin( theta ) / 2PI\n\tfloat a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;\n\tfloat b = 3.4175940 + ( 4.1616724 + y ) * y;\n\tfloat v = a / b;\n\n\tfloat theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;\n\n\treturn cross( v1, v2 ) * theta_sintheta;\n\n}\n\nvec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {\n\n\t// bail if point is on back side of plane of light\n\t// assumes ccw winding order of light vertices\n\tvec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];\n\tvec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];\n\tvec3 lightNormal = cross( v1, v2 );\n\n\tif( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );\n\n\t// construct orthonormal basis around N\n\tvec3 T1, T2;\n\tT1 = normalize( V - N * dot( V, N ) );\n\tT2 = - cross( N, T1 ); // negated from paper; possibly due to a different handedness of world coordinate system\n\n\t// compute transform\n\tmat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );\n\n\t// transform rect\n\tvec3 coords[ 4 ];\n\tcoords[ 0 ] = mat * ( rectCoords[ 0 ] - P );\n\tcoords[ 1 ] = mat * ( rectCoords[ 1 ] - P );\n\tcoords[ 2 ] = mat * ( rectCoords[ 2 ] - P );\n\tcoords[ 3 ] = mat * ( rectCoords[ 3 ] - P );\n\n\t// project rect onto sphere\n\tcoords[ 0 ] = normalize( coords[ 0 ] );\n\tcoords[ 1 ] = normalize( coords[ 1 ] );\n\tcoords[ 2 ] = normalize( coords[ 2 ] );\n\tcoords[ 3 ] = normalize( coords[ 3 ] );\n\n\t// calculate vector form factor\n\tvec3 vectorFormFactor = vec3( 0.0 );\n\tvectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );\n\tvectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );\n\tvectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );\n\tvectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );\n\n\t// adjust for horizon clipping\n\tfloat result = LTC_ClippedSphereFormFactor( vectorFormFactor );\n\n/*\n\t// alternate method of adjusting for horizon clipping (see referece)\n\t// refactoring required\n\tfloat len = length( vectorFormFactor );\n\tfloat z = vectorFormFactor.z / len;\n\n\tconst float LUT_SIZE = 64.0;\n\tconst float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;\n\tconst float LUT_BIAS = 0.5 / LUT_SIZE;\n\n\t// tabulated horizon-clipped sphere, apparently...\n\tvec2 uv = vec2( z * 0.5 + 0.5, len );\n\tuv = uv * LUT_SCALE + LUT_BIAS;\n\n\tfloat scale = texture2D( ltc_2, uv ).w;\n\n\tfloat result = len * scale;\n*/\n\n\treturn vec3( result );\n\n}\n\n// End Rect Area Light\n\n#if defined( USE_SHEEN )\n\n// https://github.com/google/filament/blob/master/shaders/src/brdf.fs\nfloat D_Charlie( float roughness, float dotNH ) {\n\n\tfloat alpha = pow2( roughness );\n\n\t// Estevez and Kulla 2017, "Production Friendly Microfacet Sheen BRDF"\n\tfloat invAlpha = 1.0 / alpha;\n\tfloat cos2h = dotNH * dotNH;\n\tfloat sin2h = max( 1.0 - cos2h, 0.0078125 ); // 2^(-14/2), so sin2h^2 > 0 in fp16\n\n\treturn ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );\n\n}\n\n// https://github.com/google/filament/blob/master/shaders/src/brdf.fs\nfloat V_Neubelt( float dotNV, float dotNL ) {\n\n\t// Neubelt and Pettineo 2013, "Crafting a Next-gen Material Pipeline for The Order: 1886"\n\treturn saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );\n\n}\n\nvec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {\n\n\tvec3 halfDir = normalize( lightDir + viewDir );\n\n\tfloat dotNL = saturate( dot( normal, lightDir ) );\n\tfloat dotNV = saturate( dot( normal, viewDir ) );\n\tfloat dotNH = saturate( dot( normal, halfDir ) );\n\n\tfloat D = D_Charlie( sheenRoughness, dotNH );\n\tfloat V = V_Neubelt( dotNV, dotNL );\n\n\treturn sheenColor * ( D * V );\n\n}\n\n#endif\n\n// This is a curve-fit approxmation to the "Charlie sheen" BRDF integrated over the hemisphere from \n// Estevez and Kulla 2017, "Production Friendly Microfacet Sheen BRDF". The analysis can be found\n// in the Sheen section of https://drive.google.com/file/d/1T0D1VSyR4AllqIJTQAraEIzjlb5h4FKH/view?usp=sharing\nfloat IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {\n\n\tfloat dotNV = saturate( dot( normal, viewDir ) );\n\n\tfloat r2 = roughness * roughness;\n\n\tfloat a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;\n\n\tfloat b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;\n\n\tfloat DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );\n\n\treturn saturate( DG * RECIPROCAL_PI );\n\n}\n\n// Analytical approximation of the DFG LUT, one half of the\n// split-sum approximation used in indirect specular lighting.\n// via \'environmentBRDF\' from "Physically Based Shading on Mobile"\n// https://www.unrealengine.com/blog/physically-based-shading-on-mobile\nvec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {\n\n\tfloat dotNV = saturate( dot( normal, viewDir ) );\n\n\tconst vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );\n\n\tconst vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );\n\n\tvec4 r = roughness * c0 + c1;\n\n\tfloat a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;\n\n\tvec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;\n\n\treturn fab;\n\n}\n\nvec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {\n\n\tvec2 fab = DFGApprox( normal, viewDir, roughness );\n\n\treturn specularColor * fab.x + specularF90 * fab.y;\n\n}\n\n// Fdez-Agüera\'s "Multiple-Scattering Microfacet Model for Real-Time Image Based Lighting"\n// Approximates multiscattering in order to preserve energy.\n// http://www.jcgt.org/published/0008/01/03/\n#ifdef USE_IRIDESCENCE\nvoid computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {\n#else\nvoid computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {\n#endif\n\n\tvec2 fab = DFGApprox( normal, viewDir, roughness );\n\n\t#ifdef USE_IRIDESCENCE\n\n\t\tvec3 Fr = mix( specularColor, iridescenceF0, iridescence );\n\n\t#else\n\n\t\tvec3 Fr = specularColor;\n\n\t#endif\n\n\tvec3 FssEss = Fr * fab.x + specularF90 * fab.y;\n\n\tfloat Ess = fab.x + fab.y;\n\tfloat Ems = 1.0 - Ess;\n\n\tvec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619; // 1/21\n\tvec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );\n\n\tsingleScatter += FssEss;\n\tmultiScatter += Fms * Ems;\n\n}\n\n#if NUM_RECT_AREA_LIGHTS > 0\n\n\tvoid RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n\n\t\tvec3 normal = geometry.normal;\n\t\tvec3 viewDir = geometry.viewDir;\n\t\tvec3 position = geometry.position;\n\t\tvec3 lightPos = rectAreaLight.position;\n\t\tvec3 halfWidth = rectAreaLight.halfWidth;\n\t\tvec3 halfHeight = rectAreaLight.halfHeight;\n\t\tvec3 lightColor = rectAreaLight.color;\n\t\tfloat roughness = material.roughness;\n\n\t\tvec3 rectCoords[ 4 ];\n\t\trectCoords[ 0 ] = lightPos + halfWidth - halfHeight; // counterclockwise; light shines in local neg z direction\n\t\trectCoords[ 1 ] = lightPos - halfWidth - halfHeight;\n\t\trectCoords[ 2 ] = lightPos - halfWidth + halfHeight;\n\t\trectCoords[ 3 ] = lightPos + halfWidth + halfHeight;\n\n\t\tvec2 uv = LTC_Uv( normal, viewDir, roughness );\n\n\t\tvec4 t1 = texture2D( ltc_1, uv );\n\t\tvec4 t2 = texture2D( ltc_2, uv );\n\n\t\tmat3 mInv = mat3(\n\t\t\tvec3( t1.x, 0, t1.y ),\n\t\t\tvec3(    0, 1,    0 ),\n\t\t\tvec3( t1.z, 0, t1.w )\n\t\t);\n\n\t\t// LTC Fresnel Approximation by Stephen Hill\n\t\t// http://blog.selfshadow.com/publications/s2016-advances/s2016_ltc_fresnel.pdf\n\t\tvec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );\n\n\t\treflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );\n\n\t\treflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );\n\n\t}\n\n#endif\n\nvoid RE_Direct_Physical( const in IncidentLight directLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n\n\tfloat dotNL = saturate( dot( geometry.normal, directLight.direction ) );\n\n\tvec3 irradiance = dotNL * directLight.color;\n\n\t#ifdef USE_CLEARCOAT\n\n\t\tfloat dotNLcc = saturate( dot( geometry.clearcoatNormal, directLight.direction ) );\n\n\t\tvec3 ccIrradiance = dotNLcc * directLight.color;\n\n\t\tclearcoatSpecular += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometry.viewDir, geometry.clearcoatNormal, material );\n\n\t#endif\n\n\t#ifdef USE_SHEEN\n\n\t\tsheenSpecular += irradiance * BRDF_Sheen( directLight.direction, geometry.viewDir, geometry.normal, material.sheenColor, material.sheenRoughness );\n\n\t#endif\n\n\treflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometry.viewDir, geometry.normal, material );\n\n\treflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\n\nvoid RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n\n\treflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n\n}\n\nvoid RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {\n\n\t#ifdef USE_CLEARCOAT\n\n\t\tclearcoatSpecular += clearcoatRadiance * EnvironmentBRDF( geometry.clearcoatNormal, geometry.viewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );\n\n\t#endif\n\n\t#ifdef USE_SHEEN\n\n\t\tsheenSpecular += irradiance * material.sheenColor * IBLSheenBRDF( geometry.normal, geometry.viewDir, material.sheenRoughness );\n\n\t#endif\n\n\t// Both indirect specular and indirect diffuse light accumulate here\n\n\tvec3 singleScattering = vec3( 0.0 );\n\tvec3 multiScattering = vec3( 0.0 );\n\tvec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;\n\n\t#ifdef USE_IRIDESCENCE\n\n\t\tcomputeMultiscatteringIridescence( geometry.normal, geometry.viewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );\n\n\t#else\n\n\t\tcomputeMultiscattering( geometry.normal, geometry.viewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );\n\n\t#endif\n\n\tvec3 totalScattering = singleScattering + multiScattering;\n\tvec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );\n\n\treflectedLight.indirectSpecular += radiance * singleScattering;\n\treflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;\n\n\treflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;\n\n}\n\n#define RE_Direct\t\t\t\tRE_Direct_Physical\n#define RE_Direct_RectArea\t\tRE_Direct_RectArea_Physical\n#define RE_IndirectDiffuse\t\tRE_IndirectDiffuse_Physical\n#define RE_IndirectSpecular\t\tRE_IndirectSpecular_Physical\n\n// ref: https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf\nfloat computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {\n\n\treturn saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );\n\n}\n',
                lights_fragment_begin: "\n/**\n * This is a template that can be used to light a material, it uses pluggable\n * RenderEquations (RE)for specific lighting scenarios.\n *\n * Instructions for use:\n * - Ensure that both RE_Direct, RE_IndirectDiffuse and RE_IndirectSpecular are defined\n * - Create a material parameter that is to be passed as the third parameter to your lighting functions.\n *\n * TODO:\n * - Add area light support.\n * - Add sphere light support.\n * - Add diffuse light probe (irradiance cubemap) support.\n */\n\nGeometricContext geometry;\n\ngeometry.position = - vViewPosition;\ngeometry.normal = normal;\ngeometry.viewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );\n\n#ifdef USE_CLEARCOAT\n\n\tgeometry.clearcoatNormal = clearcoatNormal;\n\n#endif\n\n#ifdef USE_IRIDESCENCE\n\n\tfloat dotNVi = saturate( dot( normal, geometry.viewDir ) );\n\n\tif ( material.iridescenceThickness == 0.0 ) {\n\n\t\tmaterial.iridescence = 0.0;\n\n\t} else {\n\n\t\tmaterial.iridescence = saturate( material.iridescence );\n\n\t}\n\n\tif ( material.iridescence > 0.0 ) {\n\n\t\tmaterial.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );\n\n\t\t// Iridescence F0 approximation\n\t\tmaterial.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );\n\n\t}\n\n#endif\n\nIncidentLight directLight;\n\n#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )\n\n\tPointLight pointLight;\n\t#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0\n\tPointLightShadow pointLightShadow;\n\t#endif\n\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n\n\t\tpointLight = pointLights[ i ];\n\n\t\tgetPointLightInfo( pointLight, geometry, directLight );\n\n\t\t#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )\n\t\tpointLightShadow = pointLightShadows[ i ];\n\t\tdirectLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;\n\t\t#endif\n\n\t\tRE_Direct( directLight, geometry, material, reflectedLight );\n\n\t}\n\t#pragma unroll_loop_end\n\n#endif\n\n#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )\n\n\tSpotLight spotLight;\n\tvec4 spotColor;\n\tvec3 spotLightCoord;\n\tbool inSpotLightMap;\n\n\t#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0\n\tSpotLightShadow spotLightShadow;\n\t#endif\n\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n\n\t\tspotLight = spotLights[ i ];\n\n\t\tgetSpotLightInfo( spotLight, geometry, directLight );\n\n\t\t// spot lights are ordered [shadows with maps, shadows without maps, maps without shadows, none]\n\t\t#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )\n\t\t#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX\n\t\t#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )\n\t\t#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS\n\t\t#else\n\t\t#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )\n\t\t#endif\n\n\t\t#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )\n\t\t\tspotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;\n\t\t\tinSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );\n\t\t\tspotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );\n\t\t\tdirectLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;\n\t\t#endif\n\n\t\t#undef SPOT_LIGHT_MAP_INDEX\n\n\t\t#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )\n\t\tspotLightShadow = spotLightShadows[ i ];\n\t\tdirectLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;\n\t\t#endif\n\n\t\tRE_Direct( directLight, geometry, material, reflectedLight );\n\n\t}\n\t#pragma unroll_loop_end\n\n#endif\n\n#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )\n\n\tDirectionalLight directionalLight;\n\t#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0\n\tDirectionalLightShadow directionalLightShadow;\n\t#endif\n\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n\n\t\tdirectionalLight = directionalLights[ i ];\n\n\t\tgetDirectionalLightInfo( directionalLight, geometry, directLight );\n\n\t\t#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )\n\t\tdirectionalLightShadow = directionalLightShadows[ i ];\n\t\tdirectLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n\t\t#endif\n\n\t\tRE_Direct( directLight, geometry, material, reflectedLight );\n\n\t}\n\t#pragma unroll_loop_end\n\n#endif\n\n#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )\n\n\tRectAreaLight rectAreaLight;\n\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {\n\n\t\trectAreaLight = rectAreaLights[ i ];\n\t\tRE_Direct_RectArea( rectAreaLight, geometry, material, reflectedLight );\n\n\t}\n\t#pragma unroll_loop_end\n\n#endif\n\n#if defined( RE_IndirectDiffuse )\n\n\tvec3 iblIrradiance = vec3( 0.0 );\n\n\tvec3 irradiance = getAmbientLightIrradiance( ambientLightColor );\n\n\tirradiance += getLightProbeIrradiance( lightProbe, geometry.normal );\n\n\t#if ( NUM_HEMI_LIGHTS > 0 )\n\n\t\t#pragma unroll_loop_start\n\t\tfor ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {\n\n\t\t\tirradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometry.normal );\n\n\t\t}\n\t\t#pragma unroll_loop_end\n\n\t#endif\n\n#endif\n\n#if defined( RE_IndirectSpecular )\n\n\tvec3 radiance = vec3( 0.0 );\n\tvec3 clearcoatRadiance = vec3( 0.0 );\n\n#endif\n",
                lights_fragment_maps: "\n#if defined( RE_IndirectDiffuse )\n\n\t#ifdef USE_LIGHTMAP\n\n\t\tvec4 lightMapTexel = texture2D( lightMap, vLightMapUv );\n\t\tvec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;\n\n\t\tirradiance += lightMapIrradiance;\n\n\t#endif\n\n\t#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )\n\n\t\tiblIrradiance += getIBLIrradiance( geometry.normal );\n\n\t#endif\n\n#endif\n\n#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )\n\n\t#ifdef USE_ANISOTROPY\n\n\t\tradiance += getIBLAnisotropyRadiance( geometry.viewDir, geometry.normal, material.roughness, material.anisotropyB, material.anisotropy );\n\n\t#else\n\n\t\tradiance += getIBLRadiance( geometry.viewDir, geometry.normal, material.roughness );\n\n\t#endif\n\n\t#ifdef USE_CLEARCOAT\n\n\t\tclearcoatRadiance += getIBLRadiance( geometry.viewDir, geometry.clearcoatNormal, material.clearcoatRoughness );\n\n\t#endif\n\n#endif\n",
                lights_fragment_end: "\n#if defined( RE_IndirectDiffuse )\n\n\tRE_IndirectDiffuse( irradiance, geometry, material, reflectedLight );\n\n#endif\n\n#if defined( RE_IndirectSpecular )\n\n\tRE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometry, material, reflectedLight );\n\n#endif\n",
                logdepthbuf_fragment: "\n#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )\n\n\t// Doing a strict comparison with == 1.0 can cause noise artifacts\n\t// on some platforms. See issue #17623.\n\tgl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;\n\n#endif\n",
                logdepthbuf_pars_fragment: "\n#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )\n\n\tuniform float logDepthBufFC;\n\tvarying float vFragDepth;\n\tvarying float vIsPerspective;\n\n#endif\n",
                logdepthbuf_pars_vertex: "\n#ifdef USE_LOGDEPTHBUF\n\n\t#ifdef USE_LOGDEPTHBUF_EXT\n\n\t\tvarying float vFragDepth;\n\t\tvarying float vIsPerspective;\n\n\t#else\n\n\t\tuniform float logDepthBufFC;\n\n\t#endif\n\n#endif\n",
                logdepthbuf_vertex: "\n#ifdef USE_LOGDEPTHBUF\n\n\t#ifdef USE_LOGDEPTHBUF_EXT\n\n\t\tvFragDepth = 1.0 + gl_Position.w;\n\t\tvIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );\n\n\t#else\n\n\t\tif ( isPerspectiveMatrix( projectionMatrix ) ) {\n\n\t\t\tgl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;\n\n\t\t\tgl_Position.z *= gl_Position.w;\n\n\t\t}\n\n\t#endif\n\n#endif\n",
                map_fragment: "\n#ifdef USE_MAP\n\n\tvec4 sampledDiffuseColor = texture2D( map, vMapUv );\n\n\t#ifdef DECODE_VIDEO_TEXTURE\n\n\t\t// use inline sRGB decode until browsers properly support SRGB8_APLHA8 with video textures\n\n\t\tsampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );\n\t\n\t#endif\n\n\tdiffuseColor *= sampledDiffuseColor;\n\n#endif\n",
                map_pars_fragment: "\n#ifdef USE_MAP\n\n\tuniform sampler2D map;\n\n#endif\n",
                map_particle_fragment: "\n#if defined( USE_MAP ) || defined( USE_ALPHAMAP )\n\n\t#if defined( USE_POINTS_UV )\n\n\t\tvec2 uv = vUv;\n\n\t#else\n\n\t\tvec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;\n\n\t#endif\n\n#endif\n\n#ifdef USE_MAP\n\n\tdiffuseColor *= texture2D( map, uv );\n\n#endif\n\n#ifdef USE_ALPHAMAP\n\n\tdiffuseColor.a *= texture2D( alphaMap, uv ).g;\n\n#endif\n",
                map_particle_pars_fragment: "\n#if defined( USE_POINTS_UV )\n\n\tvarying vec2 vUv;\n\n#else\n\n\t#if defined( USE_MAP ) || defined( USE_ALPHAMAP )\n\n\t\tuniform mat3 uvTransform;\n\n\t#endif\n\n#endif\n\n#ifdef USE_MAP\n\n\tuniform sampler2D map;\n\n#endif\n\n#ifdef USE_ALPHAMAP\n\n\tuniform sampler2D alphaMap;\n\n#endif\n",
                metalnessmap_fragment: "\nfloat metalnessFactor = metalness;\n\n#ifdef USE_METALNESSMAP\n\n\tvec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );\n\n\t// reads channel B, compatible with a combined OcclusionRoughnessMetallic (RGB) texture\n\tmetalnessFactor *= texelMetalness.b;\n\n#endif\n",
                metalnessmap_pars_fragment: "\n#ifdef USE_METALNESSMAP\n\n\tuniform sampler2D metalnessMap;\n\n#endif\n",
                morphcolor_vertex: "\n#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )\n\n\t// morphTargetBaseInfluence is set based on BufferGeometry.morphTargetsRelative value:\n\t// When morphTargetsRelative is false, this is set to 1 - sum(influences); this results in normal = sum((target - base) * influence)\n\t// When morphTargetsRelative is true, this is set to 1; as a result, all morph targets are simply added to the base after weighting\n\tvColor *= morphTargetBaseInfluence;\n\n\tfor ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n\n\t\t#if defined( USE_COLOR_ALPHA )\n\n\t\t\tif ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];\n\n\t\t#elif defined( USE_COLOR )\n\n\t\t\tif ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];\n\n\t\t#endif\n\n\t}\n\n#endif\n",
                morphnormal_vertex: "\n#ifdef USE_MORPHNORMALS\n\n\t// morphTargetBaseInfluence is set based on BufferGeometry.morphTargetsRelative value:\n\t// When morphTargetsRelative is false, this is set to 1 - sum(influences); this results in normal = sum((target - base) * influence)\n\t// When morphTargetsRelative is true, this is set to 1; as a result, all morph targets are simply added to the base after weighting\n\tobjectNormal *= morphTargetBaseInfluence;\n\n\t#ifdef MORPHTARGETS_TEXTURE\n\n\t\tfor ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n\n\t\t\tif ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];\n\n\t\t}\n\n\t#else\n\n\t\tobjectNormal += morphNormal0 * morphTargetInfluences[ 0 ];\n\t\tobjectNormal += morphNormal1 * morphTargetInfluences[ 1 ];\n\t\tobjectNormal += morphNormal2 * morphTargetInfluences[ 2 ];\n\t\tobjectNormal += morphNormal3 * morphTargetInfluences[ 3 ];\n\n\t#endif\n\n#endif\n",
                morphtarget_pars_vertex: "\n#ifdef USE_MORPHTARGETS\n\n\tuniform float morphTargetBaseInfluence;\n\n\t#ifdef MORPHTARGETS_TEXTURE\n\n\t\tuniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];\n\t\tuniform sampler2DArray morphTargetsTexture;\n\t\tuniform ivec2 morphTargetsTextureSize;\n\n\t\tvec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {\n\n\t\t\tint texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;\n\t\t\tint y = texelIndex / morphTargetsTextureSize.x;\n\t\t\tint x = texelIndex - y * morphTargetsTextureSize.x;\n\n\t\t\tivec3 morphUV = ivec3( x, y, morphTargetIndex );\n\t\t\treturn texelFetch( morphTargetsTexture, morphUV, 0 );\n\n\t\t}\n\n\t#else\n\n\t\t#ifndef USE_MORPHNORMALS\n\n\t\t\tuniform float morphTargetInfluences[ 8 ];\n\n\t\t#else\n\n\t\t\tuniform float morphTargetInfluences[ 4 ];\n\n\t\t#endif\n\n\t#endif\n\n#endif\n",
                morphtarget_vertex: "\n#ifdef USE_MORPHTARGETS\n\n\t// morphTargetBaseInfluence is set based on BufferGeometry.morphTargetsRelative value:\n\t// When morphTargetsRelative is false, this is set to 1 - sum(influences); this results in position = sum((target - base) * influence)\n\t// When morphTargetsRelative is true, this is set to 1; as a result, all morph targets are simply added to the base after weighting\n\ttransformed *= morphTargetBaseInfluence;\n\n\t#ifdef MORPHTARGETS_TEXTURE\n\n\t\tfor ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n\n\t\t\tif ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];\n\n\t\t}\n\n\t#else\n\n\t\ttransformed += morphTarget0 * morphTargetInfluences[ 0 ];\n\t\ttransformed += morphTarget1 * morphTargetInfluences[ 1 ];\n\t\ttransformed += morphTarget2 * morphTargetInfluences[ 2 ];\n\t\ttransformed += morphTarget3 * morphTargetInfluences[ 3 ];\n\n\t\t#ifndef USE_MORPHNORMALS\n\n\t\t\ttransformed += morphTarget4 * morphTargetInfluences[ 4 ];\n\t\t\ttransformed += morphTarget5 * morphTargetInfluences[ 5 ];\n\t\t\ttransformed += morphTarget6 * morphTargetInfluences[ 6 ];\n\t\t\ttransformed += morphTarget7 * morphTargetInfluences[ 7 ];\n\n\t\t#endif\n\n\t#endif\n\n#endif\n",
                normal_fragment_begin: "\nfloat faceDirection = gl_FrontFacing ? 1.0 : - 1.0;\n\n#ifdef FLAT_SHADED\n\n\tvec3 fdx = dFdx( vViewPosition );\n\tvec3 fdy = dFdy( vViewPosition );\n\tvec3 normal = normalize( cross( fdx, fdy ) );\n\n#else\n\n\tvec3 normal = normalize( vNormal );\n\n\t#ifdef DOUBLE_SIDED\n\n\t\tnormal *= faceDirection;\n\n\t#endif\n\n#endif\n\n#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )\n\n\t#ifdef USE_TANGENT\n\n\t\tmat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );\n\n\t#else\n\n\t\tmat3 tbn = getTangentFrame( - vViewPosition, normal,\n\t\t#if defined( USE_NORMALMAP )\n\t\t\tvNormalMapUv\n\t\t#elif defined( USE_CLEARCOAT_NORMALMAP )\n\t\t\tvClearcoatNormalMapUv\n\t\t#else\n\t\t\tvUv\n\t\t#endif\n\t\t);\n\n\t#endif\n\n\t#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )\n\n\t\ttbn[0] *= faceDirection;\n\t\ttbn[1] *= faceDirection;\n\n\t#endif\n\n#endif\n\n#ifdef USE_CLEARCOAT_NORMALMAP\n\n\t#ifdef USE_TANGENT\n\n\t\tmat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );\n\n\t#else\n\n\t\tmat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );\n\n\t#endif\n\n\t#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )\n\n\t\ttbn2[0] *= faceDirection;\n\t\ttbn2[1] *= faceDirection;\n\n\t#endif\n\n#endif\n\n// non perturbed normal for clearcoat among others\n\nvec3 geometryNormal = normal;\n\n",
                normal_fragment_maps: "\n\n#ifdef USE_NORMALMAP_OBJECTSPACE\n\n\tnormal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0; // overrides both flatShading and attribute normals\n\n\t#ifdef FLIP_SIDED\n\n\t\tnormal = - normal;\n\n\t#endif\n\n\t#ifdef DOUBLE_SIDED\n\n\t\tnormal = normal * faceDirection;\n\n\t#endif\n\n\tnormal = normalize( normalMatrix * normal );\n\n#elif defined( USE_NORMALMAP_TANGENTSPACE )\n\n\tvec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;\n\tmapN.xy *= normalScale;\n\n\tnormal = normalize( tbn * mapN );\n\n#elif defined( USE_BUMPMAP )\n\n\tnormal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );\n\n#endif\n",
                normal_pars_fragment: "\n#ifndef FLAT_SHADED\n\n\tvarying vec3 vNormal;\n\n\t#ifdef USE_TANGENT\n\n\t\tvarying vec3 vTangent;\n\t\tvarying vec3 vBitangent;\n\n\t#endif\n\n#endif\n",
                normal_pars_vertex: "\n#ifndef FLAT_SHADED\n\n\tvarying vec3 vNormal;\n\n\t#ifdef USE_TANGENT\n\n\t\tvarying vec3 vTangent;\n\t\tvarying vec3 vBitangent;\n\n\t#endif\n\n#endif\n",
                normal_vertex: "\n#ifndef FLAT_SHADED // normal is computed with derivatives when FLAT_SHADED\n\n\tvNormal = normalize( transformedNormal );\n\n\t#ifdef USE_TANGENT\n\n\t\tvTangent = normalize( transformedTangent );\n\t\tvBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );\n\n\t#endif\n\n#endif\n",
                normalmap_pars_fragment: "\n#ifdef USE_NORMALMAP\n\n\tuniform sampler2D normalMap;\n\tuniform vec2 normalScale;\n\n#endif\n\n#ifdef USE_NORMALMAP_OBJECTSPACE\n\n\tuniform mat3 normalMatrix;\n\n#endif\n\n#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )\n\n\t// Normal Mapping Without Precomputed Tangents\n\t// http://www.thetenthplanet.de/archives/1180\n\n\tmat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {\n\n\t\tvec3 q0 = dFdx( eye_pos.xyz );\n\t\tvec3 q1 = dFdy( eye_pos.xyz );\n\t\tvec2 st0 = dFdx( uv.st );\n\t\tvec2 st1 = dFdy( uv.st );\n\n\t\tvec3 N = surf_norm; // normalized\n\n\t\tvec3 q1perp = cross( q1, N );\n\t\tvec3 q0perp = cross( N, q0 );\n\n\t\tvec3 T = q1perp * st0.x + q0perp * st1.x;\n\t\tvec3 B = q1perp * st0.y + q0perp * st1.y;\n\n\t\tfloat det = max( dot( T, T ), dot( B, B ) );\n\t\tfloat scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );\n\n\t\treturn mat3( T * scale, B * scale, N );\n\n\t}\n\n#endif\n",
                clearcoat_normal_fragment_begin: "\n#ifdef USE_CLEARCOAT\n\n\tvec3 clearcoatNormal = geometryNormal;\n\n#endif\n",
                clearcoat_normal_fragment_maps: "\n#ifdef USE_CLEARCOAT_NORMALMAP\n\n\tvec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;\n\tclearcoatMapN.xy *= clearcoatNormalScale;\n\n\tclearcoatNormal = normalize( tbn2 * clearcoatMapN );\n\n#endif\n",
                clearcoat_pars_fragment: "\n\n#ifdef USE_CLEARCOATMAP\n\n\tuniform sampler2D clearcoatMap;\n\n#endif\n\n#ifdef USE_CLEARCOAT_NORMALMAP\n\n\tuniform sampler2D clearcoatNormalMap;\n\tuniform vec2 clearcoatNormalScale;\n\n#endif\n\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n\n\tuniform sampler2D clearcoatRoughnessMap;\n\n#endif\n",
                iridescence_pars_fragment: "\n\n#ifdef USE_IRIDESCENCEMAP\n\n\tuniform sampler2D iridescenceMap;\n\n#endif\n\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n\n\tuniform sampler2D iridescenceThicknessMap;\n\n#endif\n",
                opaque_fragment: "\n#ifdef OPAQUE\ndiffuseColor.a = 1.0;\n#endif\n\n#ifdef USE_TRANSMISSION\ndiffuseColor.a *= material.transmissionAlpha;\n#endif\n\ngl_FragColor = vec4( outgoingLight, diffuseColor.a );\n",
                packing: "\nvec3 packNormalToRGB( const in vec3 normal ) {\n\treturn normalize( normal ) * 0.5 + 0.5;\n}\n\nvec3 unpackRGBToNormal( const in vec3 rgb ) {\n\treturn 2.0 * rgb.xyz - 1.0;\n}\n\nconst float PackUpscale = 256. / 255.; // fraction -> 0..1 (including 1)\nconst float UnpackDownscale = 255. / 256.; // 0..1 -> fraction (excluding 1)\n\nconst vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );\nconst vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );\n\nconst float ShiftRight8 = 1. / 256.;\n\nvec4 packDepthToRGBA( const in float v ) {\n\tvec4 r = vec4( fract( v * PackFactors ), v );\n\tr.yzw -= r.xyz * ShiftRight8; // tidy overflow\n\treturn r * PackUpscale;\n}\n\nfloat unpackRGBAToDepth( const in vec4 v ) {\n\treturn dot( v, UnpackFactors );\n}\n\nvec2 packDepthToRG( in highp float v ) {\n\treturn packDepthToRGBA( v ).yx;\n}\n\nfloat unpackRGToDepth( const in highp vec2 v ) {\n\treturn unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );\n}\n\nvec4 pack2HalfToRGBA( vec2 v ) {\n\tvec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );\n\treturn vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );\n}\n\nvec2 unpackRGBATo2Half( vec4 v ) {\n\treturn vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );\n}\n\n// NOTE: viewZ, the z-coordinate in camera space, is negative for points in front of the camera\n\nfloat viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {\n\t// -near maps to 0; -far maps to 1\n\treturn ( viewZ + near ) / ( near - far );\n}\n\nfloat orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {\n\t// maps orthographic depth in [ 0, 1 ] to viewZ\n\treturn depth * ( near - far ) - near;\n}\n\n// NOTE: https://twitter.com/gonnavis/status/1377183786949959682\n\nfloat viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {\n\t// -near maps to 0; -far maps to 1\n\treturn ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );\n}\n\nfloat perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {\n\t// maps perspective depth in [ 0, 1 ] to viewZ\n\treturn ( near * far ) / ( ( far - near ) * depth - far );\n}\n",
                premultiplied_alpha_fragment: "\n#ifdef PREMULTIPLIED_ALPHA\n\n\t// Get get normal blending with premultipled, use with CustomBlending, OneFactor, OneMinusSrcAlphaFactor, AddEquation.\n\tgl_FragColor.rgb *= gl_FragColor.a;\n\n#endif\n",
                project_vertex: "\nvec4 mvPosition = vec4( transformed, 1.0 );\n\n#ifdef USE_INSTANCING\n\n\tmvPosition = instanceMatrix * mvPosition;\n\n#endif\n\nmvPosition = modelViewMatrix * mvPosition;\n\ngl_Position = projectionMatrix * mvPosition;\n",
                dithering_fragment: "\n#ifdef DITHERING\n\n\tgl_FragColor.rgb = dithering( gl_FragColor.rgb );\n\n#endif\n",
                dithering_pars_fragment: "\n#ifdef DITHERING\n\n\t// based on https://www.shadertoy.com/view/MslGR8\n\tvec3 dithering( vec3 color ) {\n\t\t//Calculate grid position\n\t\tfloat grid_position = rand( gl_FragCoord.xy );\n\n\t\t//Shift the individual colors differently, thus making it even harder to see the dithering pattern\n\t\tvec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );\n\n\t\t//modify shift according to grid position.\n\t\tdither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );\n\n\t\t//shift the color by dither_shift\n\t\treturn color + dither_shift_RGB;\n\t}\n\n#endif\n",
                roughnessmap_fragment: "\nfloat roughnessFactor = roughness;\n\n#ifdef USE_ROUGHNESSMAP\n\n\tvec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );\n\n\t// reads channel G, compatible with a combined OcclusionRoughnessMetallic (RGB) texture\n\troughnessFactor *= texelRoughness.g;\n\n#endif\n",
                roughnessmap_pars_fragment: "\n#ifdef USE_ROUGHNESSMAP\n\n\tuniform sampler2D roughnessMap;\n\n#endif\n",
                shadowmap_pars_fragment: "\n#if NUM_SPOT_LIGHT_COORDS > 0\n\n\tvarying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];\n\n#endif\n\n#if NUM_SPOT_LIGHT_MAPS > 0\n\n\tuniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];\n\n#endif\n\n#ifdef USE_SHADOWMAP\n\n\t#if NUM_DIR_LIGHT_SHADOWS > 0\n\n\t\tuniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];\n\t\tvarying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];\n\n\t\tstruct DirectionalLightShadow {\n\t\t\tfloat shadowBias;\n\t\t\tfloat shadowNormalBias;\n\t\t\tfloat shadowRadius;\n\t\t\tvec2 shadowMapSize;\n\t\t};\n\n\t\tuniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];\n\n\t#endif\n\n\t#if NUM_SPOT_LIGHT_SHADOWS > 0\n\n\t\tuniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];\n\n\t\tstruct SpotLightShadow {\n\t\t\tfloat shadowBias;\n\t\t\tfloat shadowNormalBias;\n\t\t\tfloat shadowRadius;\n\t\t\tvec2 shadowMapSize;\n\t\t};\n\n\t\tuniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];\n\n\t#endif\n\n\t#if NUM_POINT_LIGHT_SHADOWS > 0\n\n\t\tuniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];\n\t\tvarying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];\n\n\t\tstruct PointLightShadow {\n\t\t\tfloat shadowBias;\n\t\t\tfloat shadowNormalBias;\n\t\t\tfloat shadowRadius;\n\t\t\tvec2 shadowMapSize;\n\t\t\tfloat shadowCameraNear;\n\t\t\tfloat shadowCameraFar;\n\t\t};\n\n\t\tuniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];\n\n\t#endif\n\n\t/*\n\t#if NUM_RECT_AREA_LIGHTS > 0\n\n\t\t// TODO (abelnation): create uniforms for area light shadows\n\n\t#endif\n\t*/\n\n\tfloat texture2DCompare( sampler2D depths, vec2 uv, float compare ) {\n\n\t\treturn step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );\n\n\t}\n\n\tvec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {\n\n\t\treturn unpackRGBATo2Half( texture2D( shadow, uv ) );\n\n\t}\n\n\tfloat VSMShadow (sampler2D shadow, vec2 uv, float compare ){\n\n\t\tfloat occlusion = 1.0;\n\n\t\tvec2 distribution = texture2DDistribution( shadow, uv );\n\n\t\tfloat hard_shadow = step( compare , distribution.x ); // Hard Shadow\n\n\t\tif (hard_shadow != 1.0 ) {\n\n\t\t\tfloat distance = compare - distribution.x ;\n\t\t\tfloat variance = max( 0.00000, distribution.y * distribution.y );\n\t\t\tfloat softness_probability = variance / (variance + distance * distance ); // Chebeyshevs inequality\n\t\t\tsoftness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 ); // 0.3 reduces light bleed\n\t\t\tocclusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );\n\n\t\t}\n\t\treturn occlusion;\n\n\t}\n\n\tfloat getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n\n\t\tfloat shadow = 1.0;\n\n\t\tshadowCoord.xyz /= shadowCoord.w;\n\t\tshadowCoord.z += shadowBias;\n\n\t\tbool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;\n\t\tbool frustumTest = inFrustum && shadowCoord.z <= 1.0;\n\n\t\tif ( frustumTest ) {\n\n\t\t#if defined( SHADOWMAP_TYPE_PCF )\n\n\t\t\tvec2 texelSize = vec2( 1.0 ) / shadowMapSize;\n\n\t\t\tfloat dx0 = - texelSize.x * shadowRadius;\n\t\t\tfloat dy0 = - texelSize.y * shadowRadius;\n\t\t\tfloat dx1 = + texelSize.x * shadowRadius;\n\t\t\tfloat dy1 = + texelSize.y * shadowRadius;\n\t\t\tfloat dx2 = dx0 / 2.0;\n\t\t\tfloat dy2 = dy0 / 2.0;\n\t\t\tfloat dx3 = dx1 / 2.0;\n\t\t\tfloat dy3 = dy1 / 2.0;\n\n\t\t\tshadow = (\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )\n\t\t\t) * ( 1.0 / 17.0 );\n\n\t\t#elif defined( SHADOWMAP_TYPE_PCF_SOFT )\n\n\t\t\tvec2 texelSize = vec2( 1.0 ) / shadowMapSize;\n\t\t\tfloat dx = texelSize.x;\n\t\t\tfloat dy = texelSize.y;\n\n\t\t\tvec2 uv = shadowCoord.xy;\n\t\t\tvec2 f = fract( uv * shadowMapSize + 0.5 );\n\t\t\tuv -= f * texelSize;\n\n\t\t\tshadow = (\n\t\t\t\ttexture2DCompare( shadowMap, uv, shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +\n\t\t\t\ttexture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +\n\t\t\t\tmix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),\n\t\t\t\t\t texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),\n\t\t\t\t\t f.x ) +\n\t\t\t\tmix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),\n\t\t\t\t\t texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),\n\t\t\t\t\t f.x ) +\n\t\t\t\tmix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),\n\t\t\t\t\t texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),\n\t\t\t\t\t f.y ) +\n\t\t\t\tmix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),\n\t\t\t\t\t texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),\n\t\t\t\t\t f.y ) +\n\t\t\t\tmix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),\n\t\t\t\t\t\t  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),\n\t\t\t\t\t\t  f.x ),\n\t\t\t\t\t mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),\n\t\t\t\t\t\t  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),\n\t\t\t\t\t\t  f.x ),\n\t\t\t\t\t f.y )\n\t\t\t) * ( 1.0 / 9.0 );\n\n\t\t#elif defined( SHADOWMAP_TYPE_VSM )\n\n\t\t\tshadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );\n\n\t\t#else // no percentage-closer filtering:\n\n\t\t\tshadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );\n\n\t\t#endif\n\n\t\t}\n\n\t\treturn shadow;\n\n\t}\n\n\t// cubeToUV() maps a 3D direction vector suitable for cube texture mapping to a 2D\n\t// vector suitable for 2D texture mapping. This code uses the following layout for the\n\t// 2D texture:\n\t//\n\t// xzXZ\n\t//  y Y\n\t//\n\t// Y - Positive y direction\n\t// y - Negative y direction\n\t// X - Positive x direction\n\t// x - Negative x direction\n\t// Z - Positive z direction\n\t// z - Negative z direction\n\t//\n\t// Source and test bed:\n\t// https://gist.github.com/tschw/da10c43c467ce8afd0c4\n\n\tvec2 cubeToUV( vec3 v, float texelSizeY ) {\n\n\t\t// Number of texels to avoid at the edge of each square\n\n\t\tvec3 absV = abs( v );\n\n\t\t// Intersect unit cube\n\n\t\tfloat scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );\n\t\tabsV *= scaleToCube;\n\n\t\t// Apply scale to avoid seams\n\n\t\t// two texels less per square (one texel will do for NEAREST)\n\t\tv *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );\n\n\t\t// Unwrap\n\n\t\t// space: -1 ... 1 range for each square\n\t\t//\n\t\t// #X##\t\tdim    := ( 4 , 2 )\n\t\t//  # #\t\tcenter := ( 1 , 1 )\n\n\t\tvec2 planar = v.xy;\n\n\t\tfloat almostATexel = 1.5 * texelSizeY;\n\t\tfloat almostOne = 1.0 - almostATexel;\n\n\t\tif ( absV.z >= almostOne ) {\n\n\t\t\tif ( v.z > 0.0 )\n\t\t\t\tplanar.x = 4.0 - v.x;\n\n\t\t} else if ( absV.x >= almostOne ) {\n\n\t\t\tfloat signX = sign( v.x );\n\t\t\tplanar.x = v.z * signX + 2.0 * signX;\n\n\t\t} else if ( absV.y >= almostOne ) {\n\n\t\t\tfloat signY = sign( v.y );\n\t\t\tplanar.x = v.x + 2.0 * signY + 2.0;\n\t\t\tplanar.y = v.z * signY - 2.0;\n\n\t\t}\n\n\t\t// Transform to UV space\n\n\t\t// scale := 0.5 / dim\n\t\t// translate := ( center + 0.5 ) / dim\n\t\treturn vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );\n\n\t}\n\n\tfloat getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {\n\n\t\tvec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );\n\n\t\t// for point lights, the uniform @vShadowCoord is re-purposed to hold\n\t\t// the vector from the light to the world-space position of the fragment.\n\t\tvec3 lightToPosition = shadowCoord.xyz;\n\n\t\t// dp = normalized distance from light to fragment position\n\t\tfloat dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear ); // need to clamp?\n\t\tdp += shadowBias;\n\n\t\t// bd3D = base direction 3D\n\t\tvec3 bd3D = normalize( lightToPosition );\n\n\t\t#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )\n\n\t\t\tvec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;\n\n\t\t\treturn (\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +\n\t\t\t\ttexture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )\n\t\t\t) * ( 1.0 / 9.0 );\n\n\t\t#else // no percentage-closer filtering\n\n\t\t\treturn texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );\n\n\t\t#endif\n\n\t}\n\n#endif\n",
                shadowmap_pars_vertex: "\n\n#if NUM_SPOT_LIGHT_COORDS > 0\n\n\tuniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];\n\tvarying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];\n\n#endif\n\n#ifdef USE_SHADOWMAP\n\n\t#if NUM_DIR_LIGHT_SHADOWS > 0\n\n\t\tuniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];\n\t\tvarying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];\n\n\t\tstruct DirectionalLightShadow {\n\t\t\tfloat shadowBias;\n\t\t\tfloat shadowNormalBias;\n\t\t\tfloat shadowRadius;\n\t\t\tvec2 shadowMapSize;\n\t\t};\n\n\t\tuniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];\n\n\t#endif\n\n\t#if NUM_SPOT_LIGHT_SHADOWS > 0\n\n\t\tstruct SpotLightShadow {\n\t\t\tfloat shadowBias;\n\t\t\tfloat shadowNormalBias;\n\t\t\tfloat shadowRadius;\n\t\t\tvec2 shadowMapSize;\n\t\t};\n\n\t\tuniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];\n\n\t#endif\n\n\t#if NUM_POINT_LIGHT_SHADOWS > 0\n\n\t\tuniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];\n\t\tvarying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];\n\n\t\tstruct PointLightShadow {\n\t\t\tfloat shadowBias;\n\t\t\tfloat shadowNormalBias;\n\t\t\tfloat shadowRadius;\n\t\t\tvec2 shadowMapSize;\n\t\t\tfloat shadowCameraNear;\n\t\t\tfloat shadowCameraFar;\n\t\t};\n\n\t\tuniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];\n\n\t#endif\n\n\t/*\n\t#if NUM_RECT_AREA_LIGHTS > 0\n\n\t\t// TODO (abelnation): uniforms for area light shadows\n\n\t#endif\n\t*/\n\n#endif\n",
                shadowmap_vertex: "\n\n#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )\n\n\t// Offsetting the position used for querying occlusion along the world normal can be used to reduce shadow acne.\n\tvec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );\n\tvec4 shadowWorldPosition;\n\n#endif\n\n#if defined( USE_SHADOWMAP )\n\n\t#if NUM_DIR_LIGHT_SHADOWS > 0\n\n\t\t#pragma unroll_loop_start\n\t\tfor ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {\n\n\t\t\tshadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );\n\t\t\tvDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;\n\n\t\t}\n\t\t#pragma unroll_loop_end\n\n\t#endif\n\n\t#if NUM_POINT_LIGHT_SHADOWS > 0\n\n\t\t#pragma unroll_loop_start\n\t\tfor ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {\n\n\t\t\tshadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );\n\t\t\tvPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;\n\n\t\t}\n\t\t#pragma unroll_loop_end\n\n\t#endif\n\n\t/*\n\t#if NUM_RECT_AREA_LIGHTS > 0\n\n\t\t// TODO (abelnation): update vAreaShadowCoord with area light info\n\n\t#endif\n\t*/\n\n#endif\n\n// spot lights can be evaluated without active shadow mapping (when SpotLight.map is used)\n\n#if NUM_SPOT_LIGHT_COORDS > 0\n\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {\n\n\t\tshadowWorldPosition = worldPosition;\n\t\t#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )\n\t\t\tshadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;\n\t\t#endif\n\t\tvSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;\n\n\t}\n\t#pragma unroll_loop_end\n\n#endif\n\n\n",
                shadowmask_pars_fragment: "\nfloat getShadowMask() {\n\n\tfloat shadow = 1.0;\n\n\t#ifdef USE_SHADOWMAP\n\n\t#if NUM_DIR_LIGHT_SHADOWS > 0\n\n\tDirectionalLightShadow directionalLight;\n\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {\n\n\t\tdirectionalLight = directionalLightShadows[ i ];\n\t\tshadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n\n\t}\n\t#pragma unroll_loop_end\n\n\t#endif\n\n\t#if NUM_SPOT_LIGHT_SHADOWS > 0\n\n\tSpotLightShadow spotLight;\n\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {\n\n\t\tspotLight = spotLightShadows[ i ];\n\t\tshadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;\n\n\t}\n\t#pragma unroll_loop_end\n\n\t#endif\n\n\t#if NUM_POINT_LIGHT_SHADOWS > 0\n\n\tPointLightShadow pointLight;\n\n\t#pragma unroll_loop_start\n\tfor ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {\n\n\t\tpointLight = pointLightShadows[ i ];\n\t\tshadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;\n\n\t}\n\t#pragma unroll_loop_end\n\n\t#endif\n\n\t/*\n\t#if NUM_RECT_AREA_LIGHTS > 0\n\n\t\t// TODO (abelnation): update shadow for Area light\n\n\t#endif\n\t*/\n\n\t#endif\n\n\treturn shadow;\n\n}\n",
                skinbase_vertex: "\n#ifdef USE_SKINNING\n\n\tmat4 boneMatX = getBoneMatrix( skinIndex.x );\n\tmat4 boneMatY = getBoneMatrix( skinIndex.y );\n\tmat4 boneMatZ = getBoneMatrix( skinIndex.z );\n\tmat4 boneMatW = getBoneMatrix( skinIndex.w );\n\n#endif\n",
                skinning_pars_vertex: "\n#ifdef USE_SKINNING\n\n\tuniform mat4 bindMatrix;\n\tuniform mat4 bindMatrixInverse;\n\n\tuniform highp sampler2D boneTexture;\n\tuniform int boneTextureSize;\n\n\tmat4 getBoneMatrix( const in float i ) {\n\n\t\tfloat j = i * 4.0;\n\t\tfloat x = mod( j, float( boneTextureSize ) );\n\t\tfloat y = floor( j / float( boneTextureSize ) );\n\n\t\tfloat dx = 1.0 / float( boneTextureSize );\n\t\tfloat dy = 1.0 / float( boneTextureSize );\n\n\t\ty = dy * ( y + 0.5 );\n\n\t\tvec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );\n\t\tvec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );\n\t\tvec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );\n\t\tvec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );\n\n\t\tmat4 bone = mat4( v1, v2, v3, v4 );\n\n\t\treturn bone;\n\n\t}\n\n#endif\n",
                skinning_vertex: "\n#ifdef USE_SKINNING\n\n\tvec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );\n\n\tvec4 skinned = vec4( 0.0 );\n\tskinned += boneMatX * skinVertex * skinWeight.x;\n\tskinned += boneMatY * skinVertex * skinWeight.y;\n\tskinned += boneMatZ * skinVertex * skinWeight.z;\n\tskinned += boneMatW * skinVertex * skinWeight.w;\n\n\ttransformed = ( bindMatrixInverse * skinned ).xyz;\n\n#endif\n",
                skinnormal_vertex: "\n#ifdef USE_SKINNING\n\n\tmat4 skinMatrix = mat4( 0.0 );\n\tskinMatrix += skinWeight.x * boneMatX;\n\tskinMatrix += skinWeight.y * boneMatY;\n\tskinMatrix += skinWeight.z * boneMatZ;\n\tskinMatrix += skinWeight.w * boneMatW;\n\tskinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;\n\n\tobjectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;\n\n\t#ifdef USE_TANGENT\n\n\t\tobjectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;\n\n\t#endif\n\n#endif\n",
                specularmap_fragment: "\nfloat specularStrength;\n\n#ifdef USE_SPECULARMAP\n\n\tvec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );\n\tspecularStrength = texelSpecular.r;\n\n#else\n\n\tspecularStrength = 1.0;\n\n#endif\n",
                specularmap_pars_fragment: "\n#ifdef USE_SPECULARMAP\n\n\tuniform sampler2D specularMap;\n\n#endif\n",
                tonemapping_fragment: "\n#if defined( TONE_MAPPING )\n\n\tgl_FragColor.rgb = toneMapping( gl_FragColor.rgb );\n\n#endif\n",
                tonemapping_pars_fragment: "\n#ifndef saturate\n// <common> may have defined saturate() already\n#define saturate( a ) clamp( a, 0.0, 1.0 )\n#endif\n\nuniform float toneMappingExposure;\n\n// exposure only\nvec3 LinearToneMapping( vec3 color ) {\n\n\treturn saturate( toneMappingExposure * color );\n\n}\n\n// source: https://www.cs.utah.edu/docs/techreports/2002/pdf/UUCS-02-001.pdf\nvec3 ReinhardToneMapping( vec3 color ) {\n\n\tcolor *= toneMappingExposure;\n\treturn saturate( color / ( vec3( 1.0 ) + color ) );\n\n}\n\n// source: http://filmicworlds.com/blog/filmic-tonemapping-operators/\nvec3 OptimizedCineonToneMapping( vec3 color ) {\n\n\t// optimized filmic operator by Jim Hejl and Richard Burgess-Dawson\n\tcolor *= toneMappingExposure;\n\tcolor = max( vec3( 0.0 ), color - 0.004 );\n\treturn pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );\n\n}\n\n// source: https://github.com/selfshadow/ltc_code/blob/master/webgl/shaders/ltc/ltc_blit.fs\nvec3 RRTAndODTFit( vec3 v ) {\n\n\tvec3 a = v * ( v + 0.0245786 ) - 0.000090537;\n\tvec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;\n\treturn a / b;\n\n}\n\n// this implementation of ACES is modified to accommodate a brighter viewing environment.\n// the scale factor of 1/0.6 is subjective. see discussion in #19621.\n\nvec3 ACESFilmicToneMapping( vec3 color ) {\n\n\t// sRGB => XYZ => D65_2_D60 => AP1 => RRT_SAT\n\tconst mat3 ACESInputMat = mat3(\n\t\tvec3( 0.59719, 0.07600, 0.02840 ), // transposed from source\n\t\tvec3( 0.35458, 0.90834, 0.13383 ),\n\t\tvec3( 0.04823, 0.01566, 0.83777 )\n\t);\n\n\t// ODT_SAT => XYZ => D60_2_D65 => sRGB\n\tconst mat3 ACESOutputMat = mat3(\n\t\tvec3(  1.60475, -0.10208, -0.00327 ), // transposed from source\n\t\tvec3( -0.53108,  1.10813, -0.07276 ),\n\t\tvec3( -0.07367, -0.00605,  1.07602 )\n\t);\n\n\tcolor *= toneMappingExposure / 0.6;\n\n\tcolor = ACESInputMat * color;\n\n\t// Apply RRT and ODT\n\tcolor = RRTAndODTFit( color );\n\n\tcolor = ACESOutputMat * color;\n\n\t// Clamp to [0, 1]\n\treturn saturate( color );\n\n}\n\nvec3 CustomToneMapping( vec3 color ) { return color; }\n",
                transmission_fragment: "\n#ifdef USE_TRANSMISSION\n\n\tmaterial.transmission = transmission;\n\tmaterial.transmissionAlpha = 1.0;\n\tmaterial.thickness = thickness;\n\tmaterial.attenuationDistance = attenuationDistance;\n\tmaterial.attenuationColor = attenuationColor;\n\n\t#ifdef USE_TRANSMISSIONMAP\n\n\t\tmaterial.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;\n\n\t#endif\n\n\t#ifdef USE_THICKNESSMAP\n\n\t\tmaterial.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;\n\n\t#endif\n\n\tvec3 pos = vWorldPosition;\n\tvec3 v = normalize( cameraPosition - pos );\n\tvec3 n = inverseTransformDirection( normal, viewMatrix );\n\n\tvec4 transmitted = getIBLVolumeRefraction(\n\t\tn, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,\n\t\tpos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,\n\t\tmaterial.attenuationColor, material.attenuationDistance );\n\n\tmaterial.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );\n\n\ttotalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );\n\n#endif\n",
                transmission_pars_fragment: "\n#ifdef USE_TRANSMISSION\n\n\t// Transmission code is based on glTF-Sampler-Viewer\n\t// https://github.com/KhronosGroup/glTF-Sample-Viewer\n\n\tuniform float transmission;\n\tuniform float thickness;\n\tuniform float attenuationDistance;\n\tuniform vec3 attenuationColor;\n\n\t#ifdef USE_TRANSMISSIONMAP\n\n\t\tuniform sampler2D transmissionMap;\n\n\t#endif\n\n\t#ifdef USE_THICKNESSMAP\n\n\t\tuniform sampler2D thicknessMap;\n\n\t#endif\n\n\tuniform vec2 transmissionSamplerSize;\n\tuniform sampler2D transmissionSamplerMap;\n\n\tuniform mat4 modelMatrix;\n\tuniform mat4 projectionMatrix;\n\n\tvarying vec3 vWorldPosition;\n\n\t// Mipped Bicubic Texture Filtering by N8\n\t// https://www.shadertoy.com/view/Dl2SDW\n\n\tfloat w0( float a ) {\n\n\t\treturn ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );\n\n\t}\n\n\tfloat w1( float a ) {\n\n\t\treturn ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );\n\n\t}\n\n\tfloat w2( float a ){\n\n\t\treturn ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );\n\n\t}\n\n\tfloat w3( float a ) {\n\n\t\treturn ( 1.0 / 6.0 ) * ( a * a * a );\n\n\t}\n\n\t// g0 and g1 are the two amplitude functions\n\tfloat g0( float a ) {\n\n\t\treturn w0( a ) + w1( a );\n\n\t}\n\n\tfloat g1( float a ) {\n\n\t\treturn w2( a ) + w3( a );\n\n\t}\n\n\t// h0 and h1 are the two offset functions\n\tfloat h0( float a ) {\n\n\t\treturn - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );\n\n\t}\n\n\tfloat h1( float a ) {\n\n\t\treturn 1.0 + w3( a ) / ( w2( a ) + w3( a ) );\n\n\t}\n\n\tvec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {\n\n\t\tuv = uv * texelSize.zw + 0.5;\n\n\t\tvec2 iuv = floor( uv );\n\t\tvec2 fuv = fract( uv );\n\n\t\tfloat g0x = g0( fuv.x );\n\t\tfloat g1x = g1( fuv.x );\n\t\tfloat h0x = h0( fuv.x );\n\t\tfloat h1x = h1( fuv.x );\n\t\tfloat h0y = h0( fuv.y );\n\t\tfloat h1y = h1( fuv.y );\n\n\t\tvec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;\n\t\tvec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;\n\t\tvec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;\n\t\tvec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;\n\n\t\treturn g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +\n\t\t\tg1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );\n\n\t}\n\n\tvec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {\n\n\t\tvec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );\n\t\tvec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );\n\t\tvec2 fLodSizeInv = 1.0 / fLodSize;\n\t\tvec2 cLodSizeInv = 1.0 / cLodSize;\n\t\tvec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );\n\t\tvec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );\n\t\treturn mix( fSample, cSample, fract( lod ) );\n\n\t}\n\n\tvec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {\n\n\t\t// Direction of refracted light.\n\t\tvec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );\n\n\t\t// Compute rotation-independant scaling of the model matrix.\n\t\tvec3 modelScale;\n\t\tmodelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );\n\t\tmodelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );\n\t\tmodelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );\n\n\t\t// The thickness is specified in local space.\n\t\treturn normalize( refractionVector ) * thickness * modelScale;\n\n\t}\n\n\tfloat applyIorToRoughness( const in float roughness, const in float ior ) {\n\n\t\t// Scale roughness with IOR so that an IOR of 1.0 results in no microfacet refraction and\n\t\t// an IOR of 1.5 results in the default amount of microfacet refraction.\n\t\treturn roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );\n\n\t}\n\n\tvec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {\n\n\t\tfloat lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );\n\t\treturn textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );\n\n\t}\n\n\tvec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {\n\n\t\tif ( isinf( attenuationDistance ) ) {\n\n\t\t\t// Attenuation distance is +∞, i.e. the transmitted color is not attenuated at all.\n\t\t\treturn vec3( 1.0 );\n\n\t\t} else {\n\n\t\t\t// Compute light attenuation using Beer's law.\n\t\t\tvec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;\n\t\t\tvec3 transmittance = exp( - attenuationCoefficient * transmissionDistance ); // Beer's law\n\t\t\treturn transmittance;\n\n\t\t}\n\n\t}\n\n\tvec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,\n\t\tconst in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,\n\t\tconst in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,\n\t\tconst in vec3 attenuationColor, const in float attenuationDistance ) {\n\n\t\tvec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );\n\t\tvec3 refractedRayExit = position + transmissionRay;\n\n\t\t// Project refracted vector on the framebuffer, while mapping to normalized device coordinates.\n\t\tvec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );\n\t\tvec2 refractionCoords = ndcPos.xy / ndcPos.w;\n\t\trefractionCoords += 1.0;\n\t\trefractionCoords /= 2.0;\n\n\t\t// Sample framebuffer to get pixel the refracted ray hits.\n\t\tvec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );\n\n\t\tvec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );\n\t\tvec3 attenuatedColor = transmittance * transmittedLight.rgb;\n\n\t\t// Get the specular component.\n\t\tvec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );\n\n\t\t// As less light is transmitted, the opacity should be increased. This simple approximation does a decent job \n\t\t// of modulating a CSS background, and has no effect when the buffer is opaque, due to a solid object or clear color.\n\t\tfloat transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;\n\n\t\treturn vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );\n\n\t}\n#endif\n",
                uv_pars_fragment: "\n#if defined( USE_UV ) || defined( USE_ANISOTROPY )\n\n\tvarying vec2 vUv;\n\n#endif\n#ifdef USE_MAP\n\n\tvarying vec2 vMapUv;\n\n#endif\n#ifdef USE_ALPHAMAP\n\n\tvarying vec2 vAlphaMapUv;\n\n#endif\n#ifdef USE_LIGHTMAP\n\n\tvarying vec2 vLightMapUv;\n\n#endif\n#ifdef USE_AOMAP\n\n\tvarying vec2 vAoMapUv;\n\n#endif\n#ifdef USE_BUMPMAP\n\n\tvarying vec2 vBumpMapUv;\n\n#endif\n#ifdef USE_NORMALMAP\n\n\tvarying vec2 vNormalMapUv;\n\n#endif\n#ifdef USE_EMISSIVEMAP\n\n\tvarying vec2 vEmissiveMapUv;\n\n#endif\n#ifdef USE_METALNESSMAP\n\n\tvarying vec2 vMetalnessMapUv;\n\n#endif\n#ifdef USE_ROUGHNESSMAP\n\n\tvarying vec2 vRoughnessMapUv;\n\n#endif\n#ifdef USE_ANISOTROPYMAP\n\n\tvarying vec2 vAnisotropyMapUv;\n\n#endif\n#ifdef USE_CLEARCOATMAP\n\n\tvarying vec2 vClearcoatMapUv;\n\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n\n\tvarying vec2 vClearcoatNormalMapUv;\n\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n\n\tvarying vec2 vClearcoatRoughnessMapUv;\n\n#endif\n#ifdef USE_IRIDESCENCEMAP\n\n\tvarying vec2 vIridescenceMapUv;\n\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n\n\tvarying vec2 vIridescenceThicknessMapUv;\n\n#endif\n#ifdef USE_SHEEN_COLORMAP\n\n\tvarying vec2 vSheenColorMapUv;\n\n#endif\n#ifdef USE_SHEEN_ROUGHNESSMAP\n\n\tvarying vec2 vSheenRoughnessMapUv;\n\n#endif\n#ifdef USE_SPECULARMAP\n\n\tvarying vec2 vSpecularMapUv;\n\n#endif\n#ifdef USE_SPECULAR_COLORMAP\n\n\tvarying vec2 vSpecularColorMapUv;\n\n#endif\n#ifdef USE_SPECULAR_INTENSITYMAP\n\n\tvarying vec2 vSpecularIntensityMapUv;\n\n#endif\n#ifdef USE_TRANSMISSIONMAP\n\n\tuniform mat3 transmissionMapTransform;\n\tvarying vec2 vTransmissionMapUv;\n\n#endif\n#ifdef USE_THICKNESSMAP\n\n\tuniform mat3 thicknessMapTransform;\n\tvarying vec2 vThicknessMapUv;\n\n#endif\n",
                uv_pars_vertex: "\n#if defined( USE_UV ) || defined( USE_ANISOTROPY )\n\n\tvarying vec2 vUv;\n\n#endif\n#ifdef USE_MAP\n\n\tuniform mat3 mapTransform;\n\tvarying vec2 vMapUv;\n\n#endif\n#ifdef USE_ALPHAMAP\n\n\tuniform mat3 alphaMapTransform;\n\tvarying vec2 vAlphaMapUv;\n\n#endif\n#ifdef USE_LIGHTMAP\n\n\tuniform mat3 lightMapTransform;\n\tvarying vec2 vLightMapUv;\n\n#endif\n#ifdef USE_AOMAP\n\n\tuniform mat3 aoMapTransform;\n\tvarying vec2 vAoMapUv;\n\n#endif\n#ifdef USE_BUMPMAP\n\n\tuniform mat3 bumpMapTransform;\n\tvarying vec2 vBumpMapUv;\n\n#endif\n#ifdef USE_NORMALMAP\n\n\tuniform mat3 normalMapTransform;\n\tvarying vec2 vNormalMapUv;\n\n#endif\n#ifdef USE_DISPLACEMENTMAP\n\n\tuniform mat3 displacementMapTransform;\n\tvarying vec2 vDisplacementMapUv;\n\n#endif\n#ifdef USE_EMISSIVEMAP\n\n\tuniform mat3 emissiveMapTransform;\n\tvarying vec2 vEmissiveMapUv;\n\n#endif\n#ifdef USE_METALNESSMAP\n\n\tuniform mat3 metalnessMapTransform;\n\tvarying vec2 vMetalnessMapUv;\n\n#endif\n#ifdef USE_ROUGHNESSMAP\n\n\tuniform mat3 roughnessMapTransform;\n\tvarying vec2 vRoughnessMapUv;\n\n#endif\n#ifdef USE_ANISOTROPYMAP\n\n\tuniform mat3 anisotropyMapTransform;\n\tvarying vec2 vAnisotropyMapUv;\n\n#endif\n#ifdef USE_CLEARCOATMAP\n\n\tuniform mat3 clearcoatMapTransform;\n\tvarying vec2 vClearcoatMapUv;\n\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n\n\tuniform mat3 clearcoatNormalMapTransform;\n\tvarying vec2 vClearcoatNormalMapUv;\n\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n\n\tuniform mat3 clearcoatRoughnessMapTransform;\n\tvarying vec2 vClearcoatRoughnessMapUv;\n\n#endif\n#ifdef USE_SHEEN_COLORMAP\n\n\tuniform mat3 sheenColorMapTransform;\n\tvarying vec2 vSheenColorMapUv;\n\n#endif\n#ifdef USE_SHEEN_ROUGHNESSMAP\n\n\tuniform mat3 sheenRoughnessMapTransform;\n\tvarying vec2 vSheenRoughnessMapUv;\n\n#endif\n#ifdef USE_IRIDESCENCEMAP\n\n\tuniform mat3 iridescenceMapTransform;\n\tvarying vec2 vIridescenceMapUv;\n\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n\n\tuniform mat3 iridescenceThicknessMapTransform;\n\tvarying vec2 vIridescenceThicknessMapUv;\n\n#endif\n#ifdef USE_SPECULARMAP\n\n\tuniform mat3 specularMapTransform;\n\tvarying vec2 vSpecularMapUv;\n\n#endif\n#ifdef USE_SPECULAR_COLORMAP\n\n\tuniform mat3 specularColorMapTransform;\n\tvarying vec2 vSpecularColorMapUv;\n\n#endif\n#ifdef USE_SPECULAR_INTENSITYMAP\n\n\tuniform mat3 specularIntensityMapTransform;\n\tvarying vec2 vSpecularIntensityMapUv;\n\n#endif\n#ifdef USE_TRANSMISSIONMAP\n\n\tuniform mat3 transmissionMapTransform;\n\tvarying vec2 vTransmissionMapUv;\n\n#endif\n#ifdef USE_THICKNESSMAP\n\n\tuniform mat3 thicknessMapTransform;\n\tvarying vec2 vThicknessMapUv;\n\n#endif\n",
                uv_vertex: "\n#if defined( USE_UV ) || defined( USE_ANISOTROPY )\n\n\tvUv = vec3( uv, 1 ).xy;\n\n#endif\n#ifdef USE_MAP\n\n\tvMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;\n\n#endif\n#ifdef USE_ALPHAMAP\n\n\tvAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;\n\n#endif\n#ifdef USE_LIGHTMAP\n\n\tvLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;\n\n#endif\n#ifdef USE_AOMAP\n\n\tvAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;\n\n#endif\n#ifdef USE_BUMPMAP\n\n\tvBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;\n\n#endif\n#ifdef USE_NORMALMAP\n\n\tvNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;\n\n#endif\n#ifdef USE_DISPLACEMENTMAP\n\n\tvDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;\n\n#endif\n#ifdef USE_EMISSIVEMAP\n\n\tvEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;\n\n#endif\n#ifdef USE_METALNESSMAP\n\n\tvMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;\n\n#endif\n#ifdef USE_ROUGHNESSMAP\n\n\tvRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;\n\n#endif\n#ifdef USE_ANISOTROPYMAP\n\n\tvAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;\n\n#endif\n#ifdef USE_CLEARCOATMAP\n\n\tvClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;\n\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n\n\tvClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;\n\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n\n\tvClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;\n\n#endif\n#ifdef USE_IRIDESCENCEMAP\n\n\tvIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;\n\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n\n\tvIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;\n\n#endif\n#ifdef USE_SHEEN_COLORMAP\n\n\tvSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;\n\n#endif\n#ifdef USE_SHEEN_ROUGHNESSMAP\n\n\tvSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;\n\n#endif\n#ifdef USE_SPECULARMAP\n\n\tvSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;\n\n#endif\n#ifdef USE_SPECULAR_COLORMAP\n\n\tvSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;\n\n#endif\n#ifdef USE_SPECULAR_INTENSITYMAP\n\n\tvSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;\n\n#endif\n#ifdef USE_TRANSMISSIONMAP\n\n\tvTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;\n\n#endif\n#ifdef USE_THICKNESSMAP\n\n\tvThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;\n\n#endif\n",
                worldpos_vertex: "\n#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0\n\n\tvec4 worldPosition = vec4( transformed, 1.0 );\n\n\t#ifdef USE_INSTANCING\n\n\t\tworldPosition = instanceMatrix * worldPosition;\n\n\t#endif\n\n\tworldPosition = modelMatrix * worldPosition;\n\n#endif\n",
                background_vert: "\nvarying vec2 vUv;\nuniform mat3 uvTransform;\n\nvoid main() {\n\n\tvUv = ( uvTransform * vec3( uv, 1 ) ).xy;\n\n\tgl_Position = vec4( position.xy, 1.0, 1.0 );\n\n}\n",
                background_frag: "\nuniform sampler2D t2D;\nuniform float backgroundIntensity;\n\nvarying vec2 vUv;\n\nvoid main() {\n\n\tvec4 texColor = texture2D( t2D, vUv );\n\n\t#ifdef DECODE_VIDEO_TEXTURE\n\n\t\t// use inline sRGB decode until browsers properly support SRGB8_APLHA8 with video textures\n\n\t\ttexColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );\n\n\t#endif\n\n\ttexColor.rgb *= backgroundIntensity;\n\n\tgl_FragColor = texColor;\n\n\t#include <tonemapping_fragment>\n\t#include <colorspace_fragment>\n\n}\n",
                backgroundCube_vert: "\nvarying vec3 vWorldDirection;\n\n#include <common>\n\nvoid main() {\n\n\tvWorldDirection = transformDirection( position, modelMatrix );\n\n\t#include <begin_vertex>\n\t#include <project_vertex>\n\n\tgl_Position.z = gl_Position.w; // set z to camera.far\n\n}\n",
                backgroundCube_frag: "\n\n#ifdef ENVMAP_TYPE_CUBE\n\n\tuniform samplerCube envMap;\n\n#elif defined( ENVMAP_TYPE_CUBE_UV )\n\n\tuniform sampler2D envMap;\n\n#endif\n\nuniform float flipEnvMap;\nuniform float backgroundBlurriness;\nuniform float backgroundIntensity;\n\nvarying vec3 vWorldDirection;\n\n#include <cube_uv_reflection_fragment>\n\nvoid main() {\n\n\t#ifdef ENVMAP_TYPE_CUBE\n\n\t\tvec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );\n\n\t#elif defined( ENVMAP_TYPE_CUBE_UV )\n\n\t\tvec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );\n\n\t#else\n\n\t\tvec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );\n\n\t#endif\n\n\ttexColor.rgb *= backgroundIntensity;\n\n\tgl_FragColor = texColor;\n\n\t#include <tonemapping_fragment>\n\t#include <colorspace_fragment>\n\n}\n",
                cube_vert: "\nvarying vec3 vWorldDirection;\n\n#include <common>\n\nvoid main() {\n\n\tvWorldDirection = transformDirection( position, modelMatrix );\n\n\t#include <begin_vertex>\n\t#include <project_vertex>\n\n\tgl_Position.z = gl_Position.w; // set z to camera.far\n\n}\n",
                cube_frag: "\nuniform samplerCube tCube;\nuniform float tFlip;\nuniform float opacity;\n\nvarying vec3 vWorldDirection;\n\nvoid main() {\n\n\tvec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );\n\n\tgl_FragColor = texColor;\n\tgl_FragColor.a *= opacity;\n\n\t#include <tonemapping_fragment>\n\t#include <colorspace_fragment>\n\n}\n",
                depth_vert: "\n#include <common>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\n\n// This is used for computing an equivalent of gl_FragCoord.z that is as high precision as possible.\n// Some platforms compute gl_FragCoord at a lower precision which makes the manually computed value better for\n// depth-based postprocessing effects. Reproduced on iPad with A10 processor / iPadOS 13.3.1.\nvarying vec2 vHighPrecisionZW;\n\nvoid main() {\n\n\t#include <uv_vertex>\n\n\t#include <skinbase_vertex>\n\n\t#ifdef USE_DISPLACEMENTMAP\n\n\t\t#include <beginnormal_vertex>\n\t\t#include <morphnormal_vertex>\n\t\t#include <skinnormal_vertex>\n\n\t#endif\n\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <displacementmap_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\n\tvHighPrecisionZW = gl_Position.zw;\n\n}\n",
                depth_frag: "\n#if DEPTH_PACKING == 3200\n\n\tuniform float opacity;\n\n#endif\n\n#include <common>\n#include <packing>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\n\nvarying vec2 vHighPrecisionZW;\n\nvoid main() {\n\n\t#include <clipping_planes_fragment>\n\n\tvec4 diffuseColor = vec4( 1.0 );\n\n\t#if DEPTH_PACKING == 3200\n\n\t\tdiffuseColor.a = opacity;\n\n\t#endif\n\n\t#include <map_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <alphahash_fragment>\n\n\t#include <logdepthbuf_fragment>\n\n\t// Higher precision equivalent of gl_FragCoord.z. This assumes depthRange has been left to its default values.\n\tfloat fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;\n\n\t#if DEPTH_PACKING == 3200\n\n\t\tgl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );\n\n\t#elif DEPTH_PACKING == 3201\n\n\t\tgl_FragColor = packDepthToRGBA( fragCoordZ );\n\n\t#endif\n\n}\n",
                distanceRGBA_vert: "\n#define DISTANCE\n\nvarying vec3 vWorldPosition;\n\n#include <common>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <clipping_planes_pars_vertex>\n\nvoid main() {\n\n\t#include <uv_vertex>\n\n\t#include <skinbase_vertex>\n\n\t#ifdef USE_DISPLACEMENTMAP\n\n\t\t#include <beginnormal_vertex>\n\t\t#include <morphnormal_vertex>\n\t\t#include <skinnormal_vertex>\n\n\t#endif\n\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <displacementmap_vertex>\n\t#include <project_vertex>\n\t#include <worldpos_vertex>\n\t#include <clipping_planes_vertex>\n\n\tvWorldPosition = worldPosition.xyz;\n\n}\n",
                distanceRGBA_frag: "\n#define DISTANCE\n\nuniform vec3 referencePosition;\nuniform float nearDistance;\nuniform float farDistance;\nvarying vec3 vWorldPosition;\n\n#include <common>\n#include <packing>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <clipping_planes_pars_fragment>\n\nvoid main () {\n\n\t#include <clipping_planes_fragment>\n\n\tvec4 diffuseColor = vec4( 1.0 );\n\n\t#include <map_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <alphahash_fragment>\n\n\tfloat dist = length( vWorldPosition - referencePosition );\n\tdist = ( dist - nearDistance ) / ( farDistance - nearDistance );\n\tdist = saturate( dist ); // clamp to [ 0, 1 ]\n\n\tgl_FragColor = packDepthToRGBA( dist );\n\n}\n",
                equirect_vert: "\nvarying vec3 vWorldDirection;\n\n#include <common>\n\nvoid main() {\n\n\tvWorldDirection = transformDirection( position, modelMatrix );\n\n\t#include <begin_vertex>\n\t#include <project_vertex>\n\n}\n",
                equirect_frag: "\nuniform sampler2D tEquirect;\n\nvarying vec3 vWorldDirection;\n\n#include <common>\n\nvoid main() {\n\n\tvec3 direction = normalize( vWorldDirection );\n\n\tvec2 sampleUV = equirectUv( direction );\n\n\tgl_FragColor = texture2D( tEquirect, sampleUV );\n\n\t#include <tonemapping_fragment>\n\t#include <colorspace_fragment>\n\n}\n",
                linedashed_vert: "\nuniform float scale;\nattribute float lineDistance;\n\nvarying float vLineDistance;\n\n#include <common>\n#include <uv_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\n\nvoid main() {\n\n\tvLineDistance = scale * lineDistance;\n\n\t#include <uv_vertex>\n\t#include <color_vertex>\n\t#include <morphcolor_vertex>\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\t#include <fog_vertex>\n\n}\n",
                linedashed_frag: "\nuniform vec3 diffuse;\nuniform float opacity;\n\nuniform float dashSize;\nuniform float totalSize;\n\nvarying float vLineDistance;\n\n#include <common>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <fog_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\n\nvoid main() {\n\n\t#include <clipping_planes_fragment>\n\n\tif ( mod( vLineDistance, totalSize ) > dashSize ) {\n\n\t\tdiscard;\n\n\t}\n\n\tvec3 outgoingLight = vec3( 0.0 );\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\n\t#include <logdepthbuf_fragment>\n\t#include <map_fragment>\n\t#include <color_fragment>\n\n\toutgoingLight = diffuseColor.rgb; // simple shader\n\n\t#include <opaque_fragment>\n\t#include <tonemapping_fragment>\n\t#include <colorspace_fragment>\n\t#include <fog_fragment>\n\t#include <premultiplied_alpha_fragment>\n\n}\n",
                meshbasic_vert: "\n#include <common>\n#include <uv_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\n\nvoid main() {\n\n\t#include <uv_vertex>\n\t#include <color_vertex>\n\t#include <morphcolor_vertex>\n\n\t#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )\n\n\t\t#include <beginnormal_vertex>\n\t\t#include <morphnormal_vertex>\n\t\t#include <skinbase_vertex>\n\t\t#include <skinnormal_vertex>\n\t\t#include <defaultnormal_vertex>\n\n\t#endif\n\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\n\t#include <worldpos_vertex>\n\t#include <envmap_vertex>\n\t#include <fog_vertex>\n\n}\n",
                meshbasic_frag: "\nuniform vec3 diffuse;\nuniform float opacity;\n\n#ifndef FLAT_SHADED\n\n\tvarying vec3 vNormal;\n\n#endif\n\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\n\nvoid main() {\n\n\t#include <clipping_planes_fragment>\n\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\n\t#include <logdepthbuf_fragment>\n\t#include <map_fragment>\n\t#include <color_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <alphahash_fragment>\n\t#include <specularmap_fragment>\n\n\tReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n\n\t// accumulation (baked indirect lighting only)\n\t#ifdef USE_LIGHTMAP\n\n\t\tvec4 lightMapTexel = texture2D( lightMap, vLightMapUv );\n\t\treflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;\n\n\t#else\n\n\t\treflectedLight.indirectDiffuse += vec3( 1.0 );\n\n\t#endif\n\n\t// modulation\n\t#include <aomap_fragment>\n\n\treflectedLight.indirectDiffuse *= diffuseColor.rgb;\n\n\tvec3 outgoingLight = reflectedLight.indirectDiffuse;\n\n\t#include <envmap_fragment>\n\n\t#include <opaque_fragment>\n\t#include <tonemapping_fragment>\n\t#include <colorspace_fragment>\n\t#include <fog_fragment>\n\t#include <premultiplied_alpha_fragment>\n\t#include <dithering_fragment>\n\n}\n",
                meshlambert_vert: "\n#define LAMBERT\n\nvarying vec3 vViewPosition;\n\n#include <common>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\n\nvoid main() {\n\n\t#include <uv_vertex>\n\t#include <color_vertex>\n\t#include <morphcolor_vertex>\n\n\t#include <beginnormal_vertex>\n\t#include <morphnormal_vertex>\n\t#include <skinbase_vertex>\n\t#include <skinnormal_vertex>\n\t#include <defaultnormal_vertex>\n\t#include <normal_vertex>\n\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <displacementmap_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\n\tvViewPosition = - mvPosition.xyz;\n\n\t#include <worldpos_vertex>\n\t#include <envmap_vertex>\n\t#include <shadowmap_vertex>\n\t#include <fog_vertex>\n\n}\n",
                meshlambert_frag: "\n#define LAMBERT\n\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float opacity;\n\n#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_lambert_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\n\nvoid main() {\n\n\t#include <clipping_planes_fragment>\n\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\tReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n\tvec3 totalEmissiveRadiance = emissive;\n\n\t#include <logdepthbuf_fragment>\n\t#include <map_fragment>\n\t#include <color_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <alphahash_fragment>\n\t#include <specularmap_fragment>\n\t#include <normal_fragment_begin>\n\t#include <normal_fragment_maps>\n\t#include <emissivemap_fragment>\n\n\t// accumulation\n\t#include <lights_lambert_fragment>\n\t#include <lights_fragment_begin>\n\t#include <lights_fragment_maps>\n\t#include <lights_fragment_end>\n\n\t// modulation\n\t#include <aomap_fragment>\n\n\tvec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;\n\n\t#include <envmap_fragment>\n\t#include <opaque_fragment>\n\t#include <tonemapping_fragment>\n\t#include <colorspace_fragment>\n\t#include <fog_fragment>\n\t#include <premultiplied_alpha_fragment>\n\t#include <dithering_fragment>\n\n}\n",
                meshmatcap_vert: "\n#define MATCAP\n\nvarying vec3 vViewPosition;\n\n#include <common>\n#include <uv_pars_vertex>\n#include <color_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\n\nvoid main() {\n\n\t#include <uv_vertex>\n\t#include <color_vertex>\n\t#include <morphcolor_vertex>\n\t#include <beginnormal_vertex>\n\t#include <morphnormal_vertex>\n\t#include <skinbase_vertex>\n\t#include <skinnormal_vertex>\n\t#include <defaultnormal_vertex>\n\t#include <normal_vertex>\n\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <displacementmap_vertex>\n\t#include <project_vertex>\n\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\t#include <fog_vertex>\n\n\tvViewPosition = - mvPosition.xyz;\n\n}\n",
                meshmatcap_frag: "\n#define MATCAP\n\nuniform vec3 diffuse;\nuniform float opacity;\nuniform sampler2D matcap;\n\nvarying vec3 vViewPosition;\n\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <fog_pars_fragment>\n#include <normal_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\n\nvoid main() {\n\n\t#include <clipping_planes_fragment>\n\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\n\t#include <logdepthbuf_fragment>\n\t#include <map_fragment>\n\t#include <color_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <alphahash_fragment>\n\t#include <normal_fragment_begin>\n\t#include <normal_fragment_maps>\n\n\tvec3 viewDir = normalize( vViewPosition );\n\tvec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );\n\tvec3 y = cross( viewDir, x );\n\tvec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5; // 0.495 to remove artifacts caused by undersized matcap disks\n\n\t#ifdef USE_MATCAP\n\n\t\tvec4 matcapColor = texture2D( matcap, uv );\n\n\t#else\n\n\t\tvec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 ); // default if matcap is missing\n\n\t#endif\n\n\tvec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;\n\n\t#include <opaque_fragment>\n\t#include <tonemapping_fragment>\n\t#include <colorspace_fragment>\n\t#include <fog_fragment>\n\t#include <premultiplied_alpha_fragment>\n\t#include <dithering_fragment>\n\n}\n",
                meshnormal_vert: "\n#define NORMAL\n\n#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )\n\n\tvarying vec3 vViewPosition;\n\n#endif\n\n#include <common>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\n\nvoid main() {\n\n\t#include <uv_vertex>\n\n\t#include <beginnormal_vertex>\n\t#include <morphnormal_vertex>\n\t#include <skinbase_vertex>\n\t#include <skinnormal_vertex>\n\t#include <defaultnormal_vertex>\n\t#include <normal_vertex>\n\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <displacementmap_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\n#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )\n\n\tvViewPosition = - mvPosition.xyz;\n\n#endif\n\n}\n",
                meshnormal_frag: "\n#define NORMAL\n\nuniform float opacity;\n\n#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )\n\n\tvarying vec3 vViewPosition;\n\n#endif\n\n#include <packing>\n#include <uv_pars_fragment>\n#include <normal_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\n\nvoid main() {\n\n\t#include <clipping_planes_fragment>\n\t#include <logdepthbuf_fragment>\n\t#include <normal_fragment_begin>\n\t#include <normal_fragment_maps>\n\n\tgl_FragColor = vec4( packNormalToRGB( normal ), opacity );\n\n\t#ifdef OPAQUE\n\n\t\tgl_FragColor.a = 1.0;\n\n\t#endif\n\n}\n",
                meshphong_vert: "\n#define PHONG\n\nvarying vec3 vViewPosition;\n\n#include <common>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\n\nvoid main() {\n\n\t#include <uv_vertex>\n\t#include <color_vertex>\n\t#include <morphcolor_vertex>\n\n\t#include <beginnormal_vertex>\n\t#include <morphnormal_vertex>\n\t#include <skinbase_vertex>\n\t#include <skinnormal_vertex>\n\t#include <defaultnormal_vertex>\n\t#include <normal_vertex>\n\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <displacementmap_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\n\tvViewPosition = - mvPosition.xyz;\n\n\t#include <worldpos_vertex>\n\t#include <envmap_vertex>\n\t#include <shadowmap_vertex>\n\t#include <fog_vertex>\n\n}\n",
                meshphong_frag: "\n#define PHONG\n\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform vec3 specular;\nuniform float shininess;\nuniform float opacity;\n\n#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_phong_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\n\nvoid main() {\n\n\t#include <clipping_planes_fragment>\n\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\tReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n\tvec3 totalEmissiveRadiance = emissive;\n\n\t#include <logdepthbuf_fragment>\n\t#include <map_fragment>\n\t#include <color_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <alphahash_fragment>\n\t#include <specularmap_fragment>\n\t#include <normal_fragment_begin>\n\t#include <normal_fragment_maps>\n\t#include <emissivemap_fragment>\n\n\t// accumulation\n\t#include <lights_phong_fragment>\n\t#include <lights_fragment_begin>\n\t#include <lights_fragment_maps>\n\t#include <lights_fragment_end>\n\n\t// modulation\n\t#include <aomap_fragment>\n\n\tvec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\n\n\t#include <envmap_fragment>\n\t#include <opaque_fragment>\n\t#include <tonemapping_fragment>\n\t#include <colorspace_fragment>\n\t#include <fog_fragment>\n\t#include <premultiplied_alpha_fragment>\n\t#include <dithering_fragment>\n\n}\n",
                meshphysical_vert: "\n#define STANDARD\n\nvarying vec3 vViewPosition;\n\n#ifdef USE_TRANSMISSION\n\n\tvarying vec3 vWorldPosition;\n\n#endif\n\n#include <common>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\n\nvoid main() {\n\n\t#include <uv_vertex>\n\t#include <color_vertex>\n\t#include <morphcolor_vertex>\n\n\t#include <beginnormal_vertex>\n\t#include <morphnormal_vertex>\n\t#include <skinbase_vertex>\n\t#include <skinnormal_vertex>\n\t#include <defaultnormal_vertex>\n\t#include <normal_vertex>\n\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <displacementmap_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\n\tvViewPosition = - mvPosition.xyz;\n\n\t#include <worldpos_vertex>\n\t#include <shadowmap_vertex>\n\t#include <fog_vertex>\n\n#ifdef USE_TRANSMISSION\n\n\tvWorldPosition = worldPosition.xyz;\n\n#endif\n}\n",
                meshphysical_frag: "\n#define STANDARD\n\n#ifdef PHYSICAL\n\t#define IOR\n\t#define USE_SPECULAR\n#endif\n\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float roughness;\nuniform float metalness;\nuniform float opacity;\n\n#ifdef IOR\n\tuniform float ior;\n#endif\n\n#ifdef USE_SPECULAR\n\tuniform float specularIntensity;\n\tuniform vec3 specularColor;\n\n\t#ifdef USE_SPECULAR_COLORMAP\n\t\tuniform sampler2D specularColorMap;\n\t#endif\n\n\t#ifdef USE_SPECULAR_INTENSITYMAP\n\t\tuniform sampler2D specularIntensityMap;\n\t#endif\n#endif\n\n#ifdef USE_CLEARCOAT\n\tuniform float clearcoat;\n\tuniform float clearcoatRoughness;\n#endif\n\n#ifdef USE_IRIDESCENCE\n\tuniform float iridescence;\n\tuniform float iridescenceIOR;\n\tuniform float iridescenceThicknessMinimum;\n\tuniform float iridescenceThicknessMaximum;\n#endif\n\n#ifdef USE_SHEEN\n\tuniform vec3 sheenColor;\n\tuniform float sheenRoughness;\n\n\t#ifdef USE_SHEEN_COLORMAP\n\t\tuniform sampler2D sheenColorMap;\n\t#endif\n\n\t#ifdef USE_SHEEN_ROUGHNESSMAP\n\t\tuniform sampler2D sheenRoughnessMap;\n\t#endif\n#endif\n\n#ifdef USE_ANISOTROPY\n\tuniform vec2 anisotropyVector;\n\n\t#ifdef USE_ANISOTROPYMAP\n\t\tuniform sampler2D anisotropyMap;\n\t#endif\n#endif\n\nvarying vec3 vViewPosition;\n\n#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <iridescence_fragment>\n#include <cube_uv_reflection_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_physical_pars_fragment>\n#include <fog_pars_fragment>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_physical_pars_fragment>\n#include <transmission_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <clearcoat_pars_fragment>\n#include <iridescence_pars_fragment>\n#include <roughnessmap_pars_fragment>\n#include <metalnessmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\n\nvoid main() {\n\n\t#include <clipping_planes_fragment>\n\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\tReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n\tvec3 totalEmissiveRadiance = emissive;\n\n\t#include <logdepthbuf_fragment>\n\t#include <map_fragment>\n\t#include <color_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <alphahash_fragment>\n\t#include <roughnessmap_fragment>\n\t#include <metalnessmap_fragment>\n\t#include <normal_fragment_begin>\n\t#include <normal_fragment_maps>\n\t#include <clearcoat_normal_fragment_begin>\n\t#include <clearcoat_normal_fragment_maps>\n\t#include <emissivemap_fragment>\n\n\t// accumulation\n\t#include <lights_physical_fragment>\n\t#include <lights_fragment_begin>\n\t#include <lights_fragment_maps>\n\t#include <lights_fragment_end>\n\n\t// modulation\n\t#include <aomap_fragment>\n\n\tvec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;\n\tvec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;\n\n\t#include <transmission_fragment>\n\n\tvec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;\n\n\t#ifdef USE_SHEEN\n\n\t\t// Sheen energy compensation approximation calculation can be found at the end of\n\t\t// https://drive.google.com/file/d/1T0D1VSyR4AllqIJTQAraEIzjlb5h4FKH/view?usp=sharing\n\t\tfloat sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );\n\n\t\toutgoingLight = outgoingLight * sheenEnergyComp + sheenSpecular;\n\n\t#endif\n\n\t#ifdef USE_CLEARCOAT\n\n\t\tfloat dotNVcc = saturate( dot( geometry.clearcoatNormal, geometry.viewDir ) );\n\n\t\tvec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );\n\n\t\toutgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + clearcoatSpecular * material.clearcoat;\n\n\t#endif\n\n\t#include <opaque_fragment>\n\t#include <tonemapping_fragment>\n\t#include <colorspace_fragment>\n\t#include <fog_fragment>\n\t#include <premultiplied_alpha_fragment>\n\t#include <dithering_fragment>\n\n}\n",
                meshtoon_vert: "\n#define TOON\n\nvarying vec3 vViewPosition;\n\n#include <common>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\n\nvoid main() {\n\n\t#include <uv_vertex>\n\t#include <color_vertex>\n\t#include <morphcolor_vertex>\n\n\t#include <beginnormal_vertex>\n\t#include <morphnormal_vertex>\n\t#include <skinbase_vertex>\n\t#include <skinnormal_vertex>\n\t#include <defaultnormal_vertex>\n\t#include <normal_vertex>\n\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <displacementmap_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\n\tvViewPosition = - mvPosition.xyz;\n\n\t#include <worldpos_vertex>\n\t#include <shadowmap_vertex>\n\t#include <fog_vertex>\n\n}\n",
                meshtoon_frag: "\n#define TOON\n\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float opacity;\n\n#include <common>\n#include <packing>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <gradientmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_toon_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\n\nvoid main() {\n\n\t#include <clipping_planes_fragment>\n\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\tReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n\tvec3 totalEmissiveRadiance = emissive;\n\n\t#include <logdepthbuf_fragment>\n\t#include <map_fragment>\n\t#include <color_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <alphahash_fragment>\n\t#include <normal_fragment_begin>\n\t#include <normal_fragment_maps>\n\t#include <emissivemap_fragment>\n\n\t// accumulation\n\t#include <lights_toon_fragment>\n\t#include <lights_fragment_begin>\n\t#include <lights_fragment_maps>\n\t#include <lights_fragment_end>\n\n\t// modulation\n\t#include <aomap_fragment>\n\n\tvec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;\n\n\t#include <opaque_fragment>\n\t#include <tonemapping_fragment>\n\t#include <colorspace_fragment>\n\t#include <fog_fragment>\n\t#include <premultiplied_alpha_fragment>\n\t#include <dithering_fragment>\n\n}\n",
                points_vert: "\nuniform float size;\nuniform float scale;\n\n#include <common>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\n\n#ifdef USE_POINTS_UV\n\n\tvarying vec2 vUv;\n\tuniform mat3 uvTransform;\n\n#endif\n\nvoid main() {\n\n\t#ifdef USE_POINTS_UV\n\n\t\tvUv = ( uvTransform * vec3( uv, 1 ) ).xy;\n\n\t#endif\n\n\t#include <color_vertex>\n\t#include <morphcolor_vertex>\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <project_vertex>\n\n\tgl_PointSize = size;\n\n\t#ifdef USE_SIZEATTENUATION\n\n\t\tbool isPerspective = isPerspectiveMatrix( projectionMatrix );\n\n\t\tif ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );\n\n\t#endif\n\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\t#include <worldpos_vertex>\n\t#include <fog_vertex>\n\n}\n",
                points_frag: "\nuniform vec3 diffuse;\nuniform float opacity;\n\n#include <common>\n#include <color_pars_fragment>\n#include <map_particle_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <fog_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\n\nvoid main() {\n\n\t#include <clipping_planes_fragment>\n\n\tvec3 outgoingLight = vec3( 0.0 );\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\n\t#include <logdepthbuf_fragment>\n\t#include <map_particle_fragment>\n\t#include <color_fragment>\n\t#include <alphatest_fragment>\n\t#include <alphahash_fragment>\n\n\toutgoingLight = diffuseColor.rgb;\n\n\t#include <opaque_fragment>\n\t#include <tonemapping_fragment>\n\t#include <colorspace_fragment>\n\t#include <fog_fragment>\n\t#include <premultiplied_alpha_fragment>\n\n}\n",
                shadow_vert: "\n#include <common>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <shadowmap_pars_vertex>\n\nvoid main() {\n\n\t#include <beginnormal_vertex>\n\t#include <morphnormal_vertex>\n\t#include <skinbase_vertex>\n\t#include <skinnormal_vertex>\n\t#include <defaultnormal_vertex>\n\n\t#include <begin_vertex>\n\t#include <morphtarget_vertex>\n\t#include <skinning_vertex>\n\t#include <project_vertex>\n\t#include <logdepthbuf_vertex>\n\n\t#include <worldpos_vertex>\n\t#include <shadowmap_vertex>\n\t#include <fog_vertex>\n\n}\n",
                shadow_frag: "\nuniform vec3 color;\nuniform float opacity;\n\n#include <common>\n#include <packing>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <logdepthbuf_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <shadowmask_pars_fragment>\n\nvoid main() {\n\n\t#include <logdepthbuf_fragment>\n\n\tgl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );\n\n\t#include <tonemapping_fragment>\n\t#include <colorspace_fragment>\n\t#include <fog_fragment>\n\n}\n",
                sprite_vert: "\nuniform float rotation;\nuniform vec2 center;\n\n#include <common>\n#include <uv_pars_vertex>\n#include <fog_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\n\nvoid main() {\n\n\t#include <uv_vertex>\n\n\tvec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );\n\n\tvec2 scale;\n\tscale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );\n\tscale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );\n\n\t#ifndef USE_SIZEATTENUATION\n\n\t\tbool isPerspective = isPerspectiveMatrix( projectionMatrix );\n\n\t\tif ( isPerspective ) scale *= - mvPosition.z;\n\n\t#endif\n\n\tvec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;\n\n\tvec2 rotatedPosition;\n\trotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;\n\trotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;\n\n\tmvPosition.xy += rotatedPosition;\n\n\tgl_Position = projectionMatrix * mvPosition;\n\n\t#include <logdepthbuf_vertex>\n\t#include <clipping_planes_vertex>\n\t#include <fog_vertex>\n\n}\n",
                sprite_frag: "\nuniform vec3 diffuse;\nuniform float opacity;\n\n#include <common>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <fog_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\n\nvoid main() {\n\n\t#include <clipping_planes_fragment>\n\n\tvec3 outgoingLight = vec3( 0.0 );\n\tvec4 diffuseColor = vec4( diffuse, opacity );\n\n\t#include <logdepthbuf_fragment>\n\t#include <map_fragment>\n\t#include <alphamap_fragment>\n\t#include <alphatest_fragment>\n\t#include <alphahash_fragment>\n\n\toutgoingLight = diffuseColor.rgb;\n\n\t#include <opaque_fragment>\n\t#include <tonemapping_fragment>\n\t#include <colorspace_fragment>\n\t#include <fog_fragment>\n\n}\n"
            },
            Gh = {
                common: {
                    diffuse: {
                        value: new Mc(16777215)
                    },
                    opacity: {
                        value: 1
                    },
                    map: {
                        value: null
                    },
                    mapTransform: {
                        value: new tc
                    },
                    alphaMap: {
                        value: null
                    },
                    alphaMapTransform: {
                        value: new tc
                    },
                    alphaTest: {
                        value: 0
                    }
                },
                specularmap: {
                    specularMap: {
                        value: null
                    },
                    specularMapTransform: {
                        value: new tc
                    }
                },
                envmap: {
                    envMap: {
                        value: null
                    },
                    flipEnvMap: {
                        value: -1
                    },
                    reflectivity: {
                        value: 1
                    },
                    ior: {
                        value: 1.5
                    },
                    refractionRatio: {
                        value: .98
                    }
                },
                aomap: {
                    aoMap: {
                        value: null
                    },
                    aoMapIntensity: {
                        value: 1
                    },
                    aoMapTransform: {
                        value: new tc
                    }
                },
                lightmap: {
                    lightMap: {
                        value: null
                    },
                    lightMapIntensity: {
                        value: 1
                    },
                    lightMapTransform: {
                        value: new tc
                    }
                },
                bumpmap: {
                    bumpMap: {
                        value: null
                    },
                    bumpMapTransform: {
                        value: new tc
                    },
                    bumpScale: {
                        value: 1
                    }
                },
                normalmap: {
                    normalMap: {
                        value: null
                    },
                    normalMapTransform: {
                        value: new tc
                    },
                    normalScale: {
                        value: new Ql(1, 1)
                    }
                },
                displacementmap: {
                    displacementMap: {
                        value: null
                    },
                    displacementMapTransform: {
                        value: new tc
                    },
                    displacementScale: {
                        value: 1
                    },
                    displacementBias: {
                        value: 0
                    }
                },
                emissivemap: {
                    emissiveMap: {
                        value: null
                    },
                    emissiveMapTransform: {
                        value: new tc
                    }
                },
                metalnessmap: {
                    metalnessMap: {
                        value: null
                    },
                    metalnessMapTransform: {
                        value: new tc
                    }
                },
                roughnessmap: {
                    roughnessMap: {
                        value: null
                    },
                    roughnessMapTransform: {
                        value: new tc
                    }
                },
                gradientmap: {
                    gradientMap: {
                        value: null
                    }
                },
                fog: {
                    fogDensity: {
                        value: 25e-5
                    },
                    fogNear: {
                        value: 1
                    },
                    fogFar: {
                        value: 2e3
                    },
                    fogColor: {
                        value: new Mc(16777215)
                    }
                },
                lights: {
                    ambientLightColor: {
                        value: []
                    },
                    lightProbe: {
                        value: []
                    },
                    directionalLights: {
                        value: [],
                        properties: {
                            direction: {},
                            color: {}
                        }
                    },
                    directionalLightShadows: {
                        value: [],
                        properties: {
                            shadowBias: {},
                            shadowNormalBias: {},
                            shadowRadius: {},
                            shadowMapSize: {}
                        }
                    },
                    directionalShadowMap: {
                        value: []
                    },
                    directionalShadowMatrix: {
                        value: []
                    },
                    spotLights: {
                        value: [],
                        properties: {
                            color: {},
                            position: {},
                            direction: {},
                            distance: {},
                            coneCos: {},
                            penumbraCos: {},
                            decay: {}
                        }
                    },
                    spotLightShadows: {
                        value: [],
                        properties: {
                            shadowBias: {},
                            shadowNormalBias: {},
                            shadowRadius: {},
                            shadowMapSize: {}
                        }
                    },
                    spotLightMap: {
                        value: []
                    },
                    spotShadowMap: {
                        value: []
                    },
                    spotLightMatrix: {
                        value: []
                    },
                    pointLights: {
                        value: [],
                        properties: {
                            color: {},
                            position: {},
                            decay: {},
                            distance: {}
                        }
                    },
                    pointLightShadows: {
                        value: [],
                        properties: {
                            shadowBias: {},
                            shadowNormalBias: {},
                            shadowRadius: {},
                            shadowMapSize: {},
                            shadowCameraNear: {},
                            shadowCameraFar: {}
                        }
                    },
                    pointShadowMap: {
                        value: []
                    },
                    pointShadowMatrix: {
                        value: []
                    },
                    hemisphereLights: {
                        value: [],
                        properties: {
                            direction: {},
                            skyColor: {},
                            groundColor: {}
                        }
                    },
                    rectAreaLights: {
                        value: [],
                        properties: {
                            color: {},
                            position: {},
                            width: {},
                            height: {}
                        }
                    },
                    ltc_1: {
                        value: null
                    },
                    ltc_2: {
                        value: null
                    }
                },
                points: {
                    diffuse: {
                        value: new Mc(16777215)
                    },
                    opacity: {
                        value: 1
                    },
                    size: {
                        value: 1
                    },
                    scale: {
                        value: 1
                    },
                    map: {
                        value: null
                    },
                    alphaMap: {
                        value: null
                    },
                    alphaMapTransform: {
                        value: new tc
                    },
                    alphaTest: {
                        value: 0
                    },
                    uvTransform: {
                        value: new tc
                    }
                },
                sprite: {
                    diffuse: {
                        value: new Mc(16777215)
                    },
                    opacity: {
                        value: 1
                    },
                    center: {
                        value: new Ql(.5, .5)
                    },
                    rotation: {
                        value: 0
                    },
                    map: {
                        value: null
                    },
                    mapTransform: {
                        value: new tc
                    },
                    alphaMap: {
                        value: null
                    },
                    alphaMapTransform: {
                        value: new tc
                    },
                    alphaTest: {
                        value: 0
                    }
                }
            },
            Vh = {
                basic: {
                    uniforms: $u([Gh.common, Gh.specularmap, Gh.envmap, Gh.aomap, Gh.lightmap, Gh.fog]),
                    vertexShader: Hh.meshbasic_vert,
                    fragmentShader: Hh.meshbasic_frag
                },
                lambert: {
                    uniforms: $u([Gh.common, Gh.specularmap, Gh.envmap, Gh.aomap, Gh.lightmap, Gh.emissivemap, Gh.bumpmap, Gh.normalmap, Gh.displacementmap, Gh.fog, Gh.lights, {
                        emissive: {
                            value: new Mc(0)
                        }
                    }]),
                    vertexShader: Hh.meshlambert_vert,
                    fragmentShader: Hh.meshlambert_frag
                },
                phong: {
                    uniforms: $u([Gh.common, Gh.specularmap, Gh.envmap, Gh.aomap, Gh.lightmap, Gh.emissivemap, Gh.bumpmap, Gh.normalmap, Gh.displacementmap, Gh.fog, Gh.lights, {
                        emissive: {
                            value: new Mc(0)
                        },
                        specular: {
                            value: new Mc(1118481)
                        },
                        shininess: {
                            value: 30
                        }
                    }]),
                    vertexShader: Hh.meshphong_vert,
                    fragmentShader: Hh.meshphong_frag
                },
                standard: {
                    uniforms: $u([Gh.common, Gh.envmap, Gh.aomap, Gh.lightmap, Gh.emissivemap, Gh.bumpmap, Gh.normalmap, Gh.displacementmap, Gh.roughnessmap, Gh.metalnessmap, Gh.fog, Gh.lights, {
                        emissive: {
                            value: new Mc(0)
                        },
                        roughness: {
                            value: 1
                        },
                        metalness: {
                            value: 0
                        },
                        envMapIntensity: {
                            value: 1
                        }
                    }]),
                    vertexShader: Hh.meshphysical_vert,
                    fragmentShader: Hh.meshphysical_frag
                },
                toon: {
                    uniforms: $u([Gh.common, Gh.aomap, Gh.lightmap, Gh.emissivemap, Gh.bumpmap, Gh.normalmap, Gh.displacementmap, Gh.gradientmap, Gh.fog, Gh.lights, {
                        emissive: {
                            value: new Mc(0)
                        }
                    }]),
                    vertexShader: Hh.meshtoon_vert,
                    fragmentShader: Hh.meshtoon_frag
                },
                matcap: {
                    uniforms: $u([Gh.common, Gh.bumpmap, Gh.normalmap, Gh.displacementmap, Gh.fog, {
                        matcap: {
                            value: null
                        }
                    }]),
                    vertexShader: Hh.meshmatcap_vert,
                    fragmentShader: Hh.meshmatcap_frag
                },
                points: {
                    uniforms: $u([Gh.points, Gh.fog]),
                    vertexShader: Hh.points_vert,
                    fragmentShader: Hh.points_frag
                },
                dashed: {
                    uniforms: $u([Gh.common, Gh.fog, {
                        scale: {
                            value: 1
                        },
                        dashSize: {
                            value: 1
                        },
                        totalSize: {
                            value: 2
                        }
                    }]),
                    vertexShader: Hh.linedashed_vert,
                    fragmentShader: Hh.linedashed_frag
                },
                depth: {
                    uniforms: $u([Gh.common, Gh.displacementmap]),
                    vertexShader: Hh.depth_vert,
                    fragmentShader: Hh.depth_frag
                },
                normal: {
                    uniforms: $u([Gh.common, Gh.bumpmap, Gh.normalmap, Gh.displacementmap, {
                        opacity: {
                            value: 1
                        }
                    }]),
                    vertexShader: Hh.meshnormal_vert,
                    fragmentShader: Hh.meshnormal_frag
                },
                sprite: {
                    uniforms: $u([Gh.sprite, Gh.fog]),
                    vertexShader: Hh.sprite_vert,
                    fragmentShader: Hh.sprite_frag
                },
                background: {
                    uniforms: {
                        uvTransform: {
                            value: new tc
                        },
                        t2D: {
                            value: null
                        },
                        backgroundIntensity: {
                            value: 1
                        }
                    },
                    vertexShader: Hh.background_vert,
                    fragmentShader: Hh.background_frag
                },
                backgroundCube: {
                    uniforms: {
                        envMap: {
                            value: null
                        },
                        flipEnvMap: {
                            value: -1
                        },
                        backgroundBlurriness: {
                            value: 0
                        },
                        backgroundIntensity: {
                            value: 1
                        }
                    },
                    vertexShader: Hh.backgroundCube_vert,
                    fragmentShader: Hh.backgroundCube_frag
                },
                cube: {
                    uniforms: {
                        tCube: {
                            value: null
                        },
                        tFlip: {
                            value: -1
                        },
                        opacity: {
                            value: 1
                        }
                    },
                    vertexShader: Hh.cube_vert,
                    fragmentShader: Hh.cube_frag
                },
                equirect: {
                    uniforms: {
                        tEquirect: {
                            value: null
                        }
                    },
                    vertexShader: Hh.equirect_vert,
                    fragmentShader: Hh.equirect_frag
                },
                distanceRGBA: {
                    uniforms: $u([Gh.common, Gh.displacementmap, {
                        referencePosition: {
                            value: new bc
                        },
                        nearDistance: {
                            value: 1
                        },
                        farDistance: {
                            value: 1e3
                        }
                    }]),
                    vertexShader: Hh.distanceRGBA_vert,
                    fragmentShader: Hh.distanceRGBA_frag
                },
                shadow: {
                    uniforms: $u([Gh.lights, Gh.fog, {
                        color: {
                            value: new Mc(0)
                        },
                        opacity: {
                            value: 1
                        }
                    }]),
                    vertexShader: Hh.shadow_vert,
                    fragmentShader: Hh.shadow_frag
                }
            };
        Vh.physical = {
            uniforms: $u([Vh.standard.uniforms, {
                clearcoat: {
                    value: 0
                },
                clearcoatMap: {
                    value: null
                },
                clearcoatMapTransform: {
                    value: new tc
                },
                clearcoatNormalMap: {
                    value: null
                },
                clearcoatNormalMapTransform: {
                    value: new tc
                },
                clearcoatNormalScale: {
                    value: new Ql(1, 1)
                },
                clearcoatRoughness: {
                    value: 0
                },
                clearcoatRoughnessMap: {
                    value: null
                },
                clearcoatRoughnessMapTransform: {
                    value: new tc
                },
                iridescence: {
                    value: 0
                },
                iridescenceMap: {
                    value: null
                },
                iridescenceMapTransform: {
                    value: new tc
                },
                iridescenceIOR: {
                    value: 1.3
                },
                iridescenceThicknessMinimum: {
                    value: 100
                },
                iridescenceThicknessMaximum: {
                    value: 400
                },
                iridescenceThicknessMap: {
                    value: null
                },
                iridescenceThicknessMapTransform: {
                    value: new tc
                },
                sheen: {
                    value: 0
                },
                sheenColor: {
                    value: new Mc(0)
                },
                sheenColorMap: {
                    value: null
                },
                sheenColorMapTransform: {
                    value: new tc
                },
                sheenRoughness: {
                    value: 1
                },
                sheenRoughnessMap: {
                    value: null
                },
                sheenRoughnessMapTransform: {
                    value: new tc
                },
                transmission: {
                    value: 0
                },
                transmissionMap: {
                    value: null
                },
                transmissionMapTransform: {
                    value: new tc
                },
                transmissionSamplerSize: {
                    value: new Ql
                },
                transmissionSamplerMap: {
                    value: null
                },
                thickness: {
                    value: 0
                },
                thicknessMap: {
                    value: null
                },
                thicknessMapTransform: {
                    value: new tc
                },
                attenuationDistance: {
                    value: 0
                },
                attenuationColor: {
                    value: new Mc(0)
                },
                specularColor: {
                    value: new Mc(1, 1, 1)
                },
                specularColorMap: {
                    value: null
                },
                specularColorMapTransform: {
                    value: new tc
                },
                specularIntensity: {
                    value: 1
                },
                specularIntensityMap: {
                    value: null
                },
                specularIntensityMapTransform: {
                    value: new tc
                },
                anisotropyVector: {
                    value: new Ql
                },
                anisotropyMap: {
                    value: null
                },
                anisotropyMapTransform: {
                    value: new tc
                }
            }]),
            vertexShader: Hh.meshphysical_vert,
            fragmentShader: Hh.meshphysical_frag
        };
        const Wh = {
            r: 0,
            b: 0,
            g: 0
        };

        function Xh(t, e, n, i, r, a, s) {
            const o = new Mc(0);
            let l, c, u = !0 === a ? 0 : 1,
                h = null,
                d = 0,
                p = null;

            function f(e, n) {
                e.getRGB(Wh, Ju(t)), i.buffers.color.setClear(Wh.r, Wh.g, Wh.b, n, s)
            }
            return {
                getClearColor: function() {
                    return o
                },
                setClearColor: function(t, e = 1) {
                    o.set(t), u = e, f(o, u)
                },
                getClearAlpha: function() {
                    return u
                },
                setClearAlpha: function(t) {
                    u = t, f(o, u)
                },
                render: function(a, m) {
                    let g = !1,
                        _ = !0 === m.isScene ? m.background : null;
                    _ && _.isTexture && (_ = (m.backgroundBlurriness > 0 ? n : e).get(_)), null === _ ? f(o, u) : _ && _.isColor && (f(_, 1), g = !0);
                    const v = t.xr.getEnvironmentBlendMode();
                    "additive" === v ? i.buffers.color.setClear(0, 0, 0, 1, s) : "alpha-blend" === v && i.buffers.color.setClear(0, 0, 0, 0, s), (t.autoClear || g) && t.clear(t.autoClearColor, t.autoClearDepth, t.autoClearStencil), _ && (_.isCubeTexture || _.mapping === dl) ? (void 0 === c && (c = new Bh(new ju(1, 1, 1), new th({
                        name: "BackgroundCubeMaterial",
                        uniforms: Zu(Vh.backgroundCube.uniforms),
                        vertexShader: Vh.backgroundCube.vertexShader,
                        fragmentShader: Vh.backgroundCube.fragmentShader,
                        side: 1,
                        depthTest: !1,
                        depthWrite: !1,
                        fog: !1
                    })), c.geometry.deleteAttribute("normal"), c.geometry.deleteAttribute("uv"), c.onBeforeRender = function(t, e, n) {
                        this.matrixWorld.copyPosition(n.matrixWorld)
                    }, Object.defineProperty(c.material, "envMap", {
                        get: function() {
                            return this.uniforms.envMap.value
                        }
                    }), r.update(c)), c.material.uniforms.envMap.value = _, c.material.uniforms.flipEnvMap.value = _.isCubeTexture && !1 === _.isRenderTargetTexture ? -1 : 1, c.material.uniforms.backgroundBlurriness.value = m.backgroundBlurriness, c.material.uniforms.backgroundIntensity.value = m.backgroundIntensity, c.material.toneMapped = _.colorSpace !== Ol, h === _ && d === _.version && p === t.toneMapping || (c.material.needsUpdate = !0, h = _, d = _.version, p = t.toneMapping), c.layers.enableAll(), a.unshift(c, c.geometry, c.material, 0, 0, null)) : _ && _.isTexture && (void 0 === l && (l = new Bh(new qu(2, 2), new th({
                        name: "BackgroundMaterial",
                        uniforms: Zu(Vh.background.uniforms),
                        vertexShader: Vh.background.vertexShader,
                        fragmentShader: Vh.background.fragmentShader,
                        side: 0,
                        depthTest: !1,
                        depthWrite: !1,
                        fog: !1
                    })), l.geometry.deleteAttribute("normal"), Object.defineProperty(l.material, "map", {
                        get: function() {
                            return this.uniforms.t2D.value
                        }
                    }), r.update(l)), l.material.uniforms.t2D.value = _, l.material.uniforms.backgroundIntensity.value = m.backgroundIntensity, l.material.toneMapped = _.colorSpace !== Ol, !0 === _.matrixAutoUpdate && _.updateMatrix(), l.material.uniforms.uvTransform.value.copy(_.matrix), h === _ && d === _.version && p === t.toneMapping || (l.material.needsUpdate = !0, h = _, d = _.version, p = t.toneMapping), l.layers.enableAll(), a.unshift(l, l.geometry, l.material, 0, 0, null))
                }
            }
        }

        function jh(t, e, n, i) {
            const r = t.getParameter(t.MAX_VERTEX_ATTRIBS),
                a = i.isWebGL2 ? null : e.get("OES_vertex_array_object"),
                s = i.isWebGL2 || null !== a,
                o = {},
                l = p(null);
            let c = l,
                u = !1;

            function h(e) {
                return i.isWebGL2 ? t.bindVertexArray(e) : a.bindVertexArrayOES(e)
            }

            function d(e) {
                return i.isWebGL2 ? t.deleteVertexArray(e) : a.deleteVertexArrayOES(e)
            }

            function p(t) {
                const e = [],
                    n = [],
                    i = [];
                for (let t = 0; t < r; t++) e[t] = 0, n[t] = 0, i[t] = 0;
                return {
                    geometry: null,
                    program: null,
                    wireframe: !1,
                    newAttributes: e,
                    enabledAttributes: n,
                    attributeDivisors: i,
                    object: t,
                    attributes: {},
                    index: null
                }
            }

            function f() {
                const t = c.newAttributes;
                for (let e = 0, n = t.length; e < n; e++) t[e] = 0
            }

            function m(t) {
                g(t, 0)
            }

            function g(n, r) {
                const a = c.newAttributes,
                    s = c.enabledAttributes,
                    o = c.attributeDivisors;
                a[n] = 1, 0 === s[n] && (t.enableVertexAttribArray(n), s[n] = 1), o[n] !== r && ((i.isWebGL2 ? t : e.get("ANGLE_instanced_arrays"))[i.isWebGL2 ? "vertexAttribDivisor" : "vertexAttribDivisorANGLE"](n, r), o[n] = r)
            }

            function _() {
                const e = c.newAttributes,
                    n = c.enabledAttributes;
                for (let i = 0, r = n.length; i < r; i++) n[i] !== e[i] && (t.disableVertexAttribArray(i), n[i] = 0)
            }

            function v(e, n, i, r, a, s, o) {
                !0 === o ? t.vertexAttribIPointer(e, n, i, a, s) : t.vertexAttribPointer(e, n, i, r, a, s)
            }

            function x() {
                y(), u = !0, c !== l && (c = l, h(c.object))
            }

            function y() {
                l.geometry = null, l.program = null, l.wireframe = !1
            }
            return {
                setup: function(r, l, d, x, y) {
                    let M = !1;
                    if (s) {
                        const e = function(e, n, r) {
                            const s = !0 === r.wireframe;
                            let l = o[e.id];
                            void 0 === l && (l = {}, o[e.id] = l);
                            let c = l[n.id];
                            void 0 === c && (c = {}, l[n.id] = c);
                            let u = c[s];
                            return void 0 === u && (u = p(i.isWebGL2 ? t.createVertexArray() : a.createVertexArrayOES()), c[s] = u), u
                        }(x, d, l);
                        c !== e && (c = e, h(c.object)), M = function(t, e, n, i) {
                            const r = c.attributes,
                                a = e.attributes;
                            let s = 0;
                            const o = n.getAttributes();
                            for (const e in o)
                                if (o[e].location >= 0) {
                                    const n = r[e];
                                    let i = a[e];
                                    if (void 0 === i && ("instanceMatrix" === e && t.instanceMatrix && (i = t.instanceMatrix), "instanceColor" === e && t.instanceColor && (i = t.instanceColor)), void 0 === n) return !0;
                                    if (n.attribute !== i) return !0;
                                    if (i && n.data !== i.data) return !0;
                                    s++
                                } return c.attributesNum !== s || c.index !== i
                        }(r, x, d, y), M && function(t, e, n, i) {
                            const r = {},
                                a = e.attributes;
                            let s = 0;
                            const o = n.getAttributes();
                            for (const e in o)
                                if (o[e].location >= 0) {
                                    let n = a[e];
                                    void 0 === n && ("instanceMatrix" === e && t.instanceMatrix && (n = t.instanceMatrix), "instanceColor" === e && t.instanceColor && (n = t.instanceColor));
                                    const i = {};
                                    i.attribute = n, n && n.data && (i.data = n.data), r[e] = i, s++
                                } c.attributes = r, c.attributesNum = s, c.index = i
                        }(r, x, d, y)
                    } else {
                        const t = !0 === l.wireframe;
                        c.geometry === x.id && c.program === d.id && c.wireframe === t || (c.geometry = x.id, c.program = d.id, c.wireframe = t, M = !0)
                    }
                    null !== y && n.update(y, t.ELEMENT_ARRAY_BUFFER), (M || u) && (u = !1, function(r, a, s, o) {
                        if (!1 === i.isWebGL2 && (r.isInstancedMesh || o.isInstancedBufferGeometry) && null === e.get("ANGLE_instanced_arrays")) return;
                        f();
                        const l = o.attributes,
                            c = s.getAttributes(),
                            u = a.defaultAttributeValues;
                        for (const e in c) {
                            const a = c[e];
                            if (a.location >= 0) {
                                let s = l[e];
                                if (void 0 === s && ("instanceMatrix" === e && r.instanceMatrix && (s = r.instanceMatrix), "instanceColor" === e && r.instanceColor && (s = r.instanceColor)), void 0 !== s) {
                                    const e = s.normalized,
                                        l = s.itemSize,
                                        c = n.get(s);
                                    if (void 0 === c) continue;
                                    const u = c.buffer,
                                        h = c.type,
                                        d = c.bytesPerElement,
                                        p = !0 === i.isWebGL2 && (h === t.INT || h === t.UNSIGNED_INT || 1013 === s.gpuType);
                                    if (s.isInterleavedBufferAttribute) {
                                        const n = s.data,
                                            i = n.stride,
                                            c = s.offset;
                                        if (n.isInstancedInterleavedBuffer) {
                                            for (let t = 0; t < a.locationSize; t++) g(a.location + t, n.meshPerAttribute);
                                            !0 !== r.isInstancedMesh && void 0 === o._maxInstanceCount && (o._maxInstanceCount = n.meshPerAttribute * n.count)
                                        } else
                                            for (let t = 0; t < a.locationSize; t++) m(a.location + t);
                                        t.bindBuffer(t.ARRAY_BUFFER, u);
                                        for (let t = 0; t < a.locationSize; t++) v(a.location + t, l / a.locationSize, h, e, i * d, (c + l / a.locationSize * t) * d, p)
                                    } else {
                                        if (s.isInstancedBufferAttribute) {
                                            for (let t = 0; t < a.locationSize; t++) g(a.location + t, s.meshPerAttribute);
                                            !0 !== r.isInstancedMesh && void 0 === o._maxInstanceCount && (o._maxInstanceCount = s.meshPerAttribute * s.count)
                                        } else
                                            for (let t = 0; t < a.locationSize; t++) m(a.location + t);
                                        t.bindBuffer(t.ARRAY_BUFFER, u);
                                        for (let t = 0; t < a.locationSize; t++) v(a.location + t, l / a.locationSize, h, e, l * d, l / a.locationSize * t * d, p)
                                    }
                                } else if (void 0 !== u) {
                                    const n = u[e];
                                    if (void 0 !== n) switch (n.length) {
                                        case 2:
                                            t.vertexAttrib2fv(a.location, n);
                                            break;
                                        case 3:
                                            t.vertexAttrib3fv(a.location, n);
                                            break;
                                        case 4:
                                            t.vertexAttrib4fv(a.location, n);
                                            break;
                                        default:
                                            t.vertexAttrib1fv(a.location, n)
                                    }
                                }
                            }
                        }
                        _()
                    }(r, l, d, x), null !== y && t.bindBuffer(t.ELEMENT_ARRAY_BUFFER, n.get(y).buffer))
                },
                reset: x,
                resetDefaultState: y,
                dispose: function() {
                    x();
                    for (const t in o) {
                        const e = o[t];
                        for (const t in e) {
                            const n = e[t];
                            for (const t in n) d(n[t].object), delete n[t];
                            delete e[t]
                        }
                        delete o[t]
                    }
                },
                releaseStatesOfGeometry: function(t) {
                    if (void 0 === o[t.id]) return;
                    const e = o[t.id];
                    for (const t in e) {
                        const n = e[t];
                        for (const t in n) d(n[t].object), delete n[t];
                        delete e[t]
                    }
                    delete o[t.id]
                },
                releaseStatesOfProgram: function(t) {
                    for (const e in o) {
                        const n = o[e];
                        if (void 0 === n[t.id]) continue;
                        const i = n[t.id];
                        for (const t in i) d(i[t].object), delete i[t];
                        delete n[t.id]
                    }
                },
                initAttributes: f,
                enableAttribute: m,
                disableUnusedAttributes: _
            }
        }

        function qh(t, e, n, i) {
            const r = i.isWebGL2;
            let a;
            this.setMode = function(t) {
                a = t
            }, this.render = function(e, i) {
                t.drawArrays(a, e, i), n.update(i, a, 1)
            }, this.renderInstances = function(i, s, o) {
                if (0 === o) return;
                let l, c;
                if (r) l = t, c = "drawArraysInstanced";
                else if (l = e.get("ANGLE_instanced_arrays"), c = "drawArraysInstancedANGLE", null === l) return void console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");
                l[c](a, i, s, o), n.update(s, a, o)
            }
        }

        function Yh(t, e, n) {
            let i;

            function r(e) {
                if ("highp" === e) {
                    if (t.getShaderPrecisionFormat(t.VERTEX_SHADER, t.HIGH_FLOAT).precision > 0 && t.getShaderPrecisionFormat(t.FRAGMENT_SHADER, t.HIGH_FLOAT).precision > 0) return "highp";
                    e = "mediump"
                }
                return "mediump" === e && t.getShaderPrecisionFormat(t.VERTEX_SHADER, t.MEDIUM_FLOAT).precision > 0 && t.getShaderPrecisionFormat(t.FRAGMENT_SHADER, t.MEDIUM_FLOAT).precision > 0 ? "mediump" : "lowp"
            }
            const a = "undefined" != typeof WebGL2RenderingContext && "WebGL2RenderingContext" === t.constructor.name;
            let s = void 0 !== n.precision ? n.precision : "highp";
            const o = r(s);
            o !== s && (console.warn("THREE.WebGLRenderer:", s, "not supported, using", o, "instead."), s = o);
            const l = a || e.has("WEBGL_draw_buffers"),
                c = !0 === n.logarithmicDepthBuffer,
                u = t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),
                h = t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
                d = t.getParameter(t.MAX_TEXTURE_SIZE),
                p = t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),
                f = t.getParameter(t.MAX_VERTEX_ATTRIBS),
                m = t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),
                g = t.getParameter(t.MAX_VARYING_VECTORS),
                _ = t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),
                v = h > 0,
                x = a || e.has("OES_texture_float");
            return {
                isWebGL2: a,
                drawBuffers: l,
                getMaxAnisotropy: function() {
                    if (void 0 !== i) return i;
                    if (!0 === e.has("EXT_texture_filter_anisotropic")) {
                        const n = e.get("EXT_texture_filter_anisotropic");
                        i = t.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT)
                    } else i = 0;
                    return i
                },
                getMaxPrecision: r,
                precision: s,
                logarithmicDepthBuffer: c,
                maxTextures: u,
                maxVertexTextures: h,
                maxTextureSize: d,
                maxCubemapSize: p,
                maxAttributes: f,
                maxVertexUniforms: m,
                maxVaryings: g,
                maxFragmentUniforms: _,
                vertexTextures: v,
                floatFragmentTextures: x,
                floatVertexTextures: v && x,
                maxSamples: a ? t.getParameter(t.MAX_SAMPLES) : 0
            }
        }

        function Kh(t) {
            const e = this;
            let n = null,
                i = 0,
                r = !1,
                a = !1;
            const s = new bu,
                o = new tc,
                l = {
                    value: null,
                    needsUpdate: !1
                };

            function c(t, n, i, r) {
                const a = null !== t ? t.length : 0;
                let c = null;
                if (0 !== a) {
                    if (c = l.value, !0 !== r || null === c) {
                        const e = i + 4 * a,
                            r = n.matrixWorldInverse;
                        o.getNormalMatrix(r), (null === c || c.length < e) && (c = new Float32Array(e));
                        for (let e = 0, n = i; e !== a; ++e, n += 4) s.copy(t[e]).applyMatrix4(r, o), s.normal.toArray(c, n), c[n + 3] = s.constant
                    }
                    l.value = c, l.needsUpdate = !0
                }
                return e.numPlanes = a, e.numIntersection = 0, c
            }
            this.uniform = l, this.numPlanes = 0, this.numIntersection = 0, this.init = function(t, e) {
                const n = 0 !== t.length || e || 0 !== i || r;
                return r = e, i = t.length, n
            }, this.beginShadows = function() {
                a = !0, c(null)
            }, this.endShadows = function() {
                a = !1
            }, this.setGlobalState = function(t, e) {
                n = c(t, e, 0)
            }, this.setState = function(s, o, u) {
                const h = s.clippingPlanes,
                    d = s.clipIntersection,
                    p = s.clipShadows,
                    f = t.get(s);
                if (!r || null === h || 0 === h.length || a && !p) a ? c(null) : (l.value !== n && (l.value = n, l.needsUpdate = i > 0), e.numPlanes = i, e.numIntersection = 0);
                else {
                    const t = a ? 0 : i,
                        e = 4 * t;
                    let r = f.clippingState || null;
                    l.value = r, r = c(h, o, e, u);
                    for (let t = 0; t !== e; ++t) r[t] = n[t];
                    f.clippingState = r, this.numIntersection = d ? this.numPlanes : 0, this.numPlanes += t
                }
            }
        }
        class Zh extends Zo {
            constructor(t = 1, e = 1, n = {}) {
                super(), this.isRenderTarget = !0, this.width = t, this.height = e, this.depth = 1, this.scissor = new Cu(0, 0, t, e), this.scissorTest = !1, this.viewport = new Cu(0, 0, t, e);
                const i = {
                    width: t,
                    height: e,
                    depth: 1
                };
                void 0 !== n.encoding && (Yo("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."), n.colorSpace = n.encoding === Il ? Ol : ""), this.texture = new mc(i, n.mapping, n.wrapS, n.wrapT, n.magFilter, n.minFilter, n.format, n.type, n.anisotropy, n.colorSpace), this.texture.isRenderTargetTexture = !0, this.texture.flipY = !1, this.texture.generateMipmaps = void 0 !== n.generateMipmaps && n.generateMipmaps, this.texture.internalFormat = void 0 !== n.internalFormat ? n.internalFormat : null, this.texture.minFilter = void 0 !== n.minFilter ? n.minFilter : vl, this.depthBuffer = void 0 === n.depthBuffer || n.depthBuffer, this.stencilBuffer = void 0 !== n.stencilBuffer && n.stencilBuffer, this.depthTexture = void 0 !== n.depthTexture ? n.depthTexture : null, this.samples = void 0 !== n.samples ? n.samples : 0
            }
            setSize(t, e, n = 1) {
                this.width === t && this.height === e && this.depth === n || (this.width = t, this.height = e, this.depth = n, this.texture.image.width = t, this.texture.image.height = e, this.texture.image.depth = n, this.dispose()), this.viewport.set(0, 0, t, e), this.scissor.set(0, 0, t, e)
            }
            clone() {
                return (new this.constructor).copy(this)
            }
            copy(t) {
                this.width = t.width, this.height = t.height, this.depth = t.depth, this.scissor.copy(t.scissor), this.scissorTest = t.scissorTest, this.viewport.copy(t.viewport), this.texture = t.texture.clone(), this.texture.isRenderTargetTexture = !0;
                const e = Object.assign({}, t.texture.image);
                return this.texture.source = new dc(e), this.depthBuffer = t.depthBuffer, this.stencilBuffer = t.stencilBuffer, null !== t.depthTexture && (this.depthTexture = t.depthTexture.clone()), this.samples = t.samples, this
            }
            dispose() {
                this.dispatchEvent({
                    type: "dispose"
                })
            }
        }
        class $h extends Zh {
            constructor(t = 1, e = 1, n = {}) {
                super(t, e, n), this.isWebGLRenderTarget = !0
            }
        }
        class Jh extends eu {
            constructor(t = 50, e = 1, n = .1, i = 2e3) {
                super(), this.isPerspectiveCamera = !0, this.type = "PerspectiveCamera", this.fov = t, this.zoom = 1, this.near = n, this.far = i, this.focus = 10, this.aspect = e, this.view = null, this.filmGauge = 35, this.filmOffset = 0, this.updateProjectionMatrix()
            }
            copy(t, e) {
                return super.copy(t, e), this.fov = t.fov, this.zoom = t.zoom, this.near = t.near, this.far = t.far, this.focus = t.focus, this.aspect = t.aspect, this.view = null === t.view ? null : Object.assign({}, t.view), this.filmGauge = t.filmGauge, this.filmOffset = t.filmOffset, this
            }
            setFocalLength(t) {
                const e = .5 * this.getFilmHeight() / t;
                this.fov = 2 * Xl * Math.atan(e), this.updateProjectionMatrix()
            }
            getFocalLength() {
                const t = Math.tan(.5 * Wl * this.fov);
                return .5 * this.getFilmHeight() / t
            }
            getEffectiveFOV() {
                return 2 * Xl * Math.atan(Math.tan(.5 * Wl * this.fov) / this.zoom)
            }
            getFilmWidth() {
                return this.filmGauge * Math.min(this.aspect, 1)
            }
            getFilmHeight() {
                return this.filmGauge / Math.max(this.aspect, 1)
            }
            setViewOffset(t, e, n, i, r, a) {
                this.aspect = t / e, null === this.view && (this.view = {
                    enabled: !0,
                    fullWidth: 1,
                    fullHeight: 1,
                    offsetX: 0,
                    offsetY: 0,
                    width: 1,
                    height: 1
                }), this.view.enabled = !0, this.view.fullWidth = t, this.view.fullHeight = e, this.view.offsetX = n, this.view.offsetY = i, this.view.width = r, this.view.height = a, this.updateProjectionMatrix()
            }
            clearViewOffset() {
                null !== this.view && (this.view.enabled = !1), this.updateProjectionMatrix()
            }
            updateProjectionMatrix() {
                const t = this.near;
                let e = t * Math.tan(.5 * Wl * this.fov) / this.zoom,
                    n = 2 * e,
                    i = this.aspect * n,
                    r = -.5 * i;
                const a = this.view;
                if (null !== this.view && this.view.enabled) {
                    const t = a.fullWidth,
                        s = a.fullHeight;
                    r += a.offsetX * i / t, e -= a.offsetY * n / s, i *= a.width / t, n *= a.height / s
                }
                const s = this.filmOffset;
                0 !== s && (r += t * s / this.getFilmWidth()), this.projectionMatrix.makePerspective(r, r + i, e, e - n, t, this.far, this.coordinateSystem), this.projectionMatrixInverse.copy(this.projectionMatrix).invert()
            }
            toJSON(t) {
                const e = super.toJSON(t);
                return e.object.fov = this.fov, e.object.zoom = this.zoom, e.object.near = this.near, e.object.far = this.far, e.object.focus = this.focus, e.object.aspect = this.aspect, null !== this.view && (e.object.view = Object.assign({}, this.view)), e.object.filmGauge = this.filmGauge, e.object.filmOffset = this.filmOffset, e
            }
        }
        const Qh = -90;
        class td extends Qc {
            constructor(t, e, n) {
                super(), this.type = "CubeCamera", this.renderTarget = n, this.coordinateSystem = null;
                const i = new Jh(Qh, 1, t, e);
                i.layers = this.layers, this.add(i);
                const r = new Jh(Qh, 1, t, e);
                r.layers = this.layers, this.add(r);
                const a = new Jh(Qh, 1, t, e);
                a.layers = this.layers, this.add(a);
                const s = new Jh(Qh, 1, t, e);
                s.layers = this.layers, this.add(s);
                const o = new Jh(Qh, 1, t, e);
                o.layers = this.layers, this.add(o);
                const l = new Jh(Qh, 1, t, e);
                l.layers = this.layers, this.add(l)
            }
            updateCoordinateSystem() {
                const t = this.coordinateSystem,
                    e = this.children.concat(),
                    [n, i, r, a, s, o] = e;
                for (const t of e) this.remove(t);
                if (t === Hl) n.up.set(0, 1, 0), n.lookAt(1, 0, 0), i.up.set(0, 1, 0), i.lookAt(-1, 0, 0), r.up.set(0, 0, -1), r.lookAt(0, 1, 0), a.up.set(0, 0, 1), a.lookAt(0, -1, 0), s.up.set(0, 1, 0), s.lookAt(0, 0, 1), o.up.set(0, 1, 0), o.lookAt(0, 0, -1);
                else {
                    if (t !== Gl) throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: " + t);
                    n.up.set(0, -1, 0), n.lookAt(-1, 0, 0), i.up.set(0, -1, 0), i.lookAt(1, 0, 0), r.up.set(0, 0, 1), r.lookAt(0, 1, 0), a.up.set(0, 0, -1), a.lookAt(0, -1, 0), s.up.set(0, -1, 0), s.lookAt(0, 0, 1), o.up.set(0, -1, 0), o.lookAt(0, 0, -1)
                }
                for (const t of e) this.add(t), t.updateMatrixWorld()
            }
            update(t, e) {
                null === this.parent && this.updateMatrixWorld();
                const n = this.renderTarget;
                this.coordinateSystem !== t.coordinateSystem && (this.coordinateSystem = t.coordinateSystem, this.updateCoordinateSystem());
                const [i, r, a, s, o, l] = this.children, c = t.getRenderTarget(), u = t.xr.enabled;
                t.xr.enabled = !1;
                const h = n.texture.generateMipmaps;
                n.texture.generateMipmaps = !1, t.setRenderTarget(n, 0), t.render(e, i), t.setRenderTarget(n, 1), t.render(e, r), t.setRenderTarget(n, 2), t.render(e, a), t.setRenderTarget(n, 3), t.render(e, s), t.setRenderTarget(n, 4), t.render(e, o), n.texture.generateMipmaps = h, t.setRenderTarget(n, 5), t.render(e, l), t.setRenderTarget(c), t.xr.enabled = u, n.texture.needsPMREMUpdate = !0
            }
        }
        class ed extends mc {
            constructor(t, e, n, i, r, a, s, o, l, c) {
                super(t = void 0 !== t ? t : [], e = void 0 !== e ? e : ul, n, i, r, a, s, o, l, c), this.isCubeTexture = !0, this.flipY = !1
            }
            get images() {
                return this.image
            }
            set images(t) {
                this.image = t
            }
        }
        class nd extends $h {
            constructor(t = 1, e = {}) {
                super(t, t, e), this.isWebGLCubeRenderTarget = !0;
                const n = {
                        width: t,
                        height: t,
                        depth: 1
                    },
                    i = [n, n, n, n, n, n];
                void 0 !== e.encoding && (Yo("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."), e.colorSpace = e.encoding === Il ? Ol : ""), this.texture = new ed(i, e.mapping, e.wrapS, e.wrapT, e.magFilter, e.minFilter, e.format, e.type, e.anisotropy, e.colorSpace), this.texture.isRenderTargetTexture = !0, this.texture.generateMipmaps = void 0 !== e.generateMipmaps && e.generateMipmaps, this.texture.minFilter = void 0 !== e.minFilter ? e.minFilter : vl
            }
            fromEquirectangularTexture(t, e) {
                this.texture.type = e.type, this.texture.colorSpace = e.colorSpace, this.texture.generateMipmaps = e.generateMipmaps, this.texture.minFilter = e.minFilter, this.texture.magFilter = e.magFilter;
                const n = {
                        tEquirect: {
                            value: null
                        }
                    },
                    i = "\n\n\t\t\t\tvarying vec3 vWorldDirection;\n\n\t\t\t\tvec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n\n\t\t\t\t\treturn normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n\n\t\t\t\t}\n\n\t\t\t\tvoid main() {\n\n\t\t\t\t\tvWorldDirection = transformDirection( position, modelMatrix );\n\n\t\t\t\t\t#include <begin_vertex>\n\t\t\t\t\t#include <project_vertex>\n\n\t\t\t\t}\n\t\t\t",
                    r = "\n\n\t\t\t\tuniform sampler2D tEquirect;\n\n\t\t\t\tvarying vec3 vWorldDirection;\n\n\t\t\t\t#include <common>\n\n\t\t\t\tvoid main() {\n\n\t\t\t\t\tvec3 direction = normalize( vWorldDirection );\n\n\t\t\t\t\tvec2 sampleUV = equirectUv( direction );\n\n\t\t\t\t\tgl_FragColor = texture2D( tEquirect, sampleUV );\n\n\t\t\t\t}\n\t\t\t",
                    a = new ju(5, 5, 5),
                    s = new th({
                        name: "CubemapFromEquirect",
                        uniforms: Zu(n),
                        vertexShader: i,
                        fragmentShader: r,
                        side: 1,
                        blending: 0
                    });
                s.uniforms.tEquirect.value = e;
                const o = new Bh(a, s),
                    l = e.minFilter;
                return e.minFilter === xl && (e.minFilter = vl), new td(1, 10, this).update(t, o), e.minFilter = l, o.geometry.dispose(), o.material.dispose(), this
            }
            clear(t, e, n, i) {
                const r = t.getRenderTarget();
                for (let r = 0; r < 6; r++) t.setRenderTarget(this, r), t.clear(e, n, i);
                t.setRenderTarget(r)
            }
        }

        function id(t) {
            let e = new WeakMap;

            function n(t, e) {
                return 303 === e ? t.mapping = ul : 304 === e && (t.mapping = hl), t
            }

            function i(t) {
                const n = t.target;
                n.removeEventListener("dispose", i);
                const r = e.get(n);
                void 0 !== r && (e.delete(n), r.dispose())
            }
            return {
                get: function(r) {
                    if (r && r.isTexture && !1 === r.isRenderTargetTexture) {
                        const a = r.mapping;
                        if (303 === a || 304 === a) {
                            if (e.has(r)) return n(e.get(r).texture, r.mapping);
                            {
                                const a = r.image;
                                if (a && a.height > 0) {
                                    const s = new nd(a.height / 2);
                                    return s.fromEquirectangularTexture(t, r), e.set(r, s), r.addEventListener("dispose", i), n(s.texture, r.mapping)
                                }
                                return null
                            }
                        }
                    }
                    return r
                },
                dispose: function() {
                    e = new WeakMap
                }
            }
        }
        const rd = [.125, .215, .35, .446, .526, .582],
            ad = new nu,
            sd = new Mc;
        let od = null;
        const ld = (1 + Math.sqrt(5)) / 2,
            cd = 1 / ld,
            ud = [new bc(1, 1, 1), new bc(-1, 1, 1), new bc(1, 1, -1), new bc(-1, 1, -1), new bc(0, ld, cd), new bc(0, ld, -cd), new bc(cd, 0, ld), new bc(-cd, 0, ld), new bc(ld, cd, 0), new bc(-ld, cd, 0)];
        class hd {
            constructor(t) {
                this._renderer = t, this._pingPongRenderTarget = null, this._lodMax = 0, this._cubeSize = 0, this._lodPlanes = [], this._sizeLods = [], this._sigmas = [], this._blurMaterial = null, this._cubemapMaterial = null, this._equirectMaterial = null, this._compileMaterial(this._blurMaterial)
            }
            fromScene(t, e = 0, n = .1, i = 100) {
                od = this._renderer.getRenderTarget(), this._setSize(256);
                const r = this._allocateTargets();
                return r.depthBuffer = !0, this._sceneToCubeUV(t, n, i, r), e > 0 && this._blur(r, 0, 0, e), this._applyPMREM(r), this._cleanup(r), r
            }
            fromEquirectangular(t, e = null) {
                return this._fromTexture(t, e)
            }
            fromCubemap(t, e = null) {
                return this._fromTexture(t, e)
            }
            compileCubemapShader() {
                null === this._cubemapMaterial && (this._cubemapMaterial = md(), this._compileMaterial(this._cubemapMaterial))
            }
            compileEquirectangularShader() {
                null === this._equirectMaterial && (this._equirectMaterial = fd(), this._compileMaterial(this._equirectMaterial))
            }
            dispose() {
                this._dispose(), null !== this._cubemapMaterial && this._cubemapMaterial.dispose(), null !== this._equirectMaterial && this._equirectMaterial.dispose()
            }
            _setSize(t) {
                this._lodMax = Math.floor(Math.log2(t)), this._cubeSize = Math.pow(2, this._lodMax)
            }
            _dispose() {
                null !== this._blurMaterial && this._blurMaterial.dispose(), null !== this._pingPongRenderTarget && this._pingPongRenderTarget.dispose();
                for (let t = 0; t < this._lodPlanes.length; t++) this._lodPlanes[t].dispose()
            }
            _cleanup(t) {
                this._renderer.setRenderTarget(od), t.scissorTest = !1, pd(t, 0, 0, t.width, t.height)
            }
            _fromTexture(t, e) {
                t.mapping === ul || t.mapping === hl ? this._setSize(0 === t.image.length ? 16 : t.image[0].width || t.image[0].image.width) : this._setSize(t.image.width / 4), od = this._renderer.getRenderTarget();
                const n = e || this._allocateTargets();
                return this._textureToCubeUV(t, n), this._applyPMREM(n), this._cleanup(n), n
            }
            _allocateTargets() {
                const t = 3 * Math.max(this._cubeSize, 112),
                    e = 4 * this._cubeSize,
                    n = {
                        magFilter: vl,
                        minFilter: vl,
                        generateMipmaps: !1,
                        type: Tl,
                        format: wl,
                        colorSpace: Nl,
                        depthBuffer: !1
                    },
                    i = dd(t, e, n);
                if (null === this._pingPongRenderTarget || this._pingPongRenderTarget.width !== t || this._pingPongRenderTarget.height !== e) {
                    null !== this._pingPongRenderTarget && this._dispose(), this._pingPongRenderTarget = dd(t, e, n);
                    const {
                        _lodMax: i
                    } = this;
                    ({
                        sizeLods: this._sizeLods,
                        lodPlanes: this._lodPlanes,
                        sigmas: this._sigmas
                    } = function(t) {
                        const e = [],
                            n = [],
                            i = [];
                        let r = t;
                        const a = t - 4 + 1 + rd.length;
                        for (let s = 0; s < a; s++) {
                            const a = Math.pow(2, r);
                            n.push(a);
                            let o = 1 / a;
                            s > t - 4 ? o = rd[s - t + 4 - 1] : 0 === s && (o = 0), i.push(o);
                            const l = 1 / (a - 2),
                                c = -l,
                                u = 1 + l,
                                h = [c, c, u, c, u, u, c, c, u, u, c, u],
                                d = 6,
                                p = 6,
                                f = 3,
                                m = 2,
                                g = 1,
                                _ = new Float32Array(f * p * d),
                                v = new Float32Array(m * p * d),
                                x = new Float32Array(g * p * d);
                            for (let t = 0; t < d; t++) {
                                const e = t % 3 * 2 / 3 - 1,
                                    n = t > 2 ? 0 : -1,
                                    i = [e, n, 0, e + 2 / 3, n, 0, e + 2 / 3, n + 1, 0, e, n, 0, e + 2 / 3, n + 1, 0, e, n + 1, 0];
                                _.set(i, f * p * t), v.set(h, m * p * t);
                                const r = [t, t, t, t, t, t];
                                x.set(r, g * p * t)
                            }
                            const y = new Xu;
                            y.setAttribute("position", new Iu(_, f)), y.setAttribute("uv", new Iu(v, m)), y.setAttribute("faceIndex", new Iu(x, g)), e.push(y), r > 4 && r--
                        }
                        return {
                            lodPlanes: e,
                            sizeLods: n,
                            sigmas: i
                        }
                    }(i)), this._blurMaterial = function(t, e, n) {
                        const i = new Float32Array(20),
                            r = new bc(0, 1, 0);
                        return new th({
                            name: "SphericalGaussianBlur",
                            defines: {
                                n: 20,
                                CUBEUV_TEXEL_WIDTH: 1 / e,
                                CUBEUV_TEXEL_HEIGHT: 1 / n,
                                CUBEUV_MAX_MIP: `${t}.0`
                            },
                            uniforms: {
                                envMap: {
                                    value: null
                                },
                                samples: {
                                    value: 1
                                },
                                weights: {
                                    value: i
                                },
                                latitudinal: {
                                    value: !1
                                },
                                dTheta: {
                                    value: 0
                                },
                                mipInt: {
                                    value: 0
                                },
                                poleAxis: {
                                    value: r
                                }
                            },
                            vertexShader: "\n\n\t\tprecision mediump float;\n\t\tprecision mediump int;\n\n\t\tattribute float faceIndex;\n\n\t\tvarying vec3 vOutputDirection;\n\n\t\t// RH coordinate system; PMREM face-indexing convention\n\t\tvec3 getDirection( vec2 uv, float face ) {\n\n\t\t\tuv = 2.0 * uv - 1.0;\n\n\t\t\tvec3 direction = vec3( uv, 1.0 );\n\n\t\t\tif ( face == 0.0 ) {\n\n\t\t\t\tdirection = direction.zyx; // ( 1, v, u ) pos x\n\n\t\t\t} else if ( face == 1.0 ) {\n\n\t\t\t\tdirection = direction.xzy;\n\t\t\t\tdirection.xz *= -1.0; // ( -u, 1, -v ) pos y\n\n\t\t\t} else if ( face == 2.0 ) {\n\n\t\t\t\tdirection.x *= -1.0; // ( -u, v, 1 ) pos z\n\n\t\t\t} else if ( face == 3.0 ) {\n\n\t\t\t\tdirection = direction.zyx;\n\t\t\t\tdirection.xz *= -1.0; // ( -1, v, -u ) neg x\n\n\t\t\t} else if ( face == 4.0 ) {\n\n\t\t\t\tdirection = direction.xzy;\n\t\t\t\tdirection.xy *= -1.0; // ( -u, -1, v ) neg y\n\n\t\t\t} else if ( face == 5.0 ) {\n\n\t\t\t\tdirection.z *= -1.0; // ( u, v, -1 ) neg z\n\n\t\t\t}\n\n\t\t\treturn direction;\n\n\t\t}\n\n\t\tvoid main() {\n\n\t\t\tvOutputDirection = getDirection( uv, faceIndex );\n\t\t\tgl_Position = vec4( position, 1.0 );\n\n\t\t}\n\t",
                            fragmentShader: "\n\n\t\t\tprecision mediump float;\n\t\t\tprecision mediump int;\n\n\t\t\tvarying vec3 vOutputDirection;\n\n\t\t\tuniform sampler2D envMap;\n\t\t\tuniform int samples;\n\t\t\tuniform float weights[ n ];\n\t\t\tuniform bool latitudinal;\n\t\t\tuniform float dTheta;\n\t\t\tuniform float mipInt;\n\t\t\tuniform vec3 poleAxis;\n\n\t\t\t#define ENVMAP_TYPE_CUBE_UV\n\t\t\t#include <cube_uv_reflection_fragment>\n\n\t\t\tvec3 getSample( float theta, vec3 axis ) {\n\n\t\t\t\tfloat cosTheta = cos( theta );\n\t\t\t\t// Rodrigues' axis-angle rotation\n\t\t\t\tvec3 sampleDirection = vOutputDirection * cosTheta\n\t\t\t\t\t+ cross( axis, vOutputDirection ) * sin( theta )\n\t\t\t\t\t+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );\n\n\t\t\t\treturn bilinearCubeUV( envMap, sampleDirection, mipInt );\n\n\t\t\t}\n\n\t\t\tvoid main() {\n\n\t\t\t\tvec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );\n\n\t\t\t\tif ( all( equal( axis, vec3( 0.0 ) ) ) ) {\n\n\t\t\t\t\taxis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );\n\n\t\t\t\t}\n\n\t\t\t\taxis = normalize( axis );\n\n\t\t\t\tgl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );\n\t\t\t\tgl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );\n\n\t\t\t\tfor ( int i = 1; i < n; i++ ) {\n\n\t\t\t\t\tif ( i >= samples ) {\n\n\t\t\t\t\t\tbreak;\n\n\t\t\t\t\t}\n\n\t\t\t\t\tfloat theta = dTheta * float( i );\n\t\t\t\t\tgl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );\n\t\t\t\t\tgl_FragColor.rgb += weights[ i ] * getSample( theta, axis );\n\n\t\t\t\t}\n\n\t\t\t}\n\t\t",
                            blending: 0,
                            depthTest: !1,
                            depthWrite: !1
                        })
                    }(i, t, e)
                }
                return i
            }
            _compileMaterial(t) {
                const e = new Bh(this._lodPlanes[0], t);
                this._renderer.compile(e, ad)
            }
            _sceneToCubeUV(t, e, n, i) {
                const r = new Jh(90, 1, e, n),
                    a = [1, -1, 1, 1, 1, 1],
                    s = [1, 1, 1, -1, -1, -1],
                    o = this._renderer,
                    l = o.autoClear,
                    c = o.toneMapping;
                o.getClearColor(sd), o.toneMapping = rl, o.autoClear = !1;
                const u = new Mh({
                        name: "PMREM.Background",
                        side: 1,
                        depthWrite: !1,
                        depthTest: !1
                    }),
                    h = new Bh(new ju, u);
                let d = !1;
                const p = t.background;
                p ? p.isColor && (u.color.copy(p), t.background = null, d = !0) : (u.color.copy(sd), d = !0);
                for (let e = 0; e < 6; e++) {
                    const n = e % 3;
                    0 === n ? (r.up.set(0, a[e], 0), r.lookAt(s[e], 0, 0)) : 1 === n ? (r.up.set(0, 0, a[e]), r.lookAt(0, s[e], 0)) : (r.up.set(0, a[e], 0), r.lookAt(0, 0, s[e]));
                    const l = this._cubeSize;
                    pd(i, n * l, e > 2 ? l : 0, l, l), o.setRenderTarget(i), d && o.render(h, r), o.render(t, r)
                }
                h.geometry.dispose(), h.material.dispose(), o.toneMapping = c, o.autoClear = l, t.background = p
            }
            _textureToCubeUV(t, e) {
                const n = this._renderer,
                    i = t.mapping === ul || t.mapping === hl;
                i ? (null === this._cubemapMaterial && (this._cubemapMaterial = md()), this._cubemapMaterial.uniforms.flipEnvMap.value = !1 === t.isRenderTargetTexture ? -1 : 1) : null === this._equirectMaterial && (this._equirectMaterial = fd());
                const r = i ? this._cubemapMaterial : this._equirectMaterial,
                    a = new Bh(this._lodPlanes[0], r);
                r.uniforms.envMap.value = t;
                const s = this._cubeSize;
                pd(e, 0, 0, 3 * s, 2 * s), n.setRenderTarget(e), n.render(a, ad)
            }
            _applyPMREM(t) {
                const e = this._renderer,
                    n = e.autoClear;
                e.autoClear = !1;
                for (let e = 1; e < this._lodPlanes.length; e++) {
                    const n = Math.sqrt(this._sigmas[e] * this._sigmas[e] - this._sigmas[e - 1] * this._sigmas[e - 1]),
                        i = ud[(e - 1) % ud.length];
                    this._blur(t, e - 1, e, n, i)
                }
                e.autoClear = n
            }
            _blur(t, e, n, i, r) {
                const a = this._pingPongRenderTarget;
                this._halfBlur(t, a, e, n, i, "latitudinal", r), this._halfBlur(a, t, n, n, i, "longitudinal", r)
            }
            _halfBlur(t, e, n, i, r, a, s) {
                const o = this._renderer,
                    l = this._blurMaterial;
                "latitudinal" !== a && "longitudinal" !== a && console.error("blur direction must be either latitudinal or longitudinal!");
                const c = new Bh(this._lodPlanes[i], l),
                    u = l.uniforms,
                    h = this._sizeLods[n] - 1,
                    d = isFinite(r) ? Math.PI / (2 * h) : 2 * Math.PI / 39,
                    p = r / d,
                    f = isFinite(r) ? 1 + Math.floor(3 * p) : 20;
                f > 20 && console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${f} samples when the maximum is set to 20`);
                const m = [];
                let g = 0;
                for (let t = 0; t < 20; ++t) {
                    const e = t / p,
                        n = Math.exp(-e * e / 2);
                    m.push(n), 0 === t ? g += n : t < f && (g += 2 * n)
                }
                for (let t = 0; t < m.length; t++) m[t] = m[t] / g;
                u.envMap.value = t.texture, u.samples.value = f, u.weights.value = m, u.latitudinal.value = "latitudinal" === a, s && (u.poleAxis.value = s);
                const {
                    _lodMax: _
                } = this;
                u.dTheta.value = d, u.mipInt.value = _ - n;
                const v = this._sizeLods[i];
                pd(e, 3 * v * (i > _ - 4 ? i - _ + 4 : 0), 4 * (this._cubeSize - v), 3 * v, 2 * v), o.setRenderTarget(e), o.render(c, ad)
            }
        }

        function dd(t, e, n) {
            const i = new $h(t, e, n);
            return i.texture.mapping = dl, i.texture.name = "PMREM.cubeUv", i.scissorTest = !0, i
        }

        function pd(t, e, n, i, r) {
            t.viewport.set(e, n, i, r), t.scissor.set(e, n, i, r)
        }

        function fd() {
            return new th({
                name: "EquirectangularToCubeUV",
                uniforms: {
                    envMap: {
                        value: null
                    }
                },
                vertexShader: "\n\n\t\tprecision mediump float;\n\t\tprecision mediump int;\n\n\t\tattribute float faceIndex;\n\n\t\tvarying vec3 vOutputDirection;\n\n\t\t// RH coordinate system; PMREM face-indexing convention\n\t\tvec3 getDirection( vec2 uv, float face ) {\n\n\t\t\tuv = 2.0 * uv - 1.0;\n\n\t\t\tvec3 direction = vec3( uv, 1.0 );\n\n\t\t\tif ( face == 0.0 ) {\n\n\t\t\t\tdirection = direction.zyx; // ( 1, v, u ) pos x\n\n\t\t\t} else if ( face == 1.0 ) {\n\n\t\t\t\tdirection = direction.xzy;\n\t\t\t\tdirection.xz *= -1.0; // ( -u, 1, -v ) pos y\n\n\t\t\t} else if ( face == 2.0 ) {\n\n\t\t\t\tdirection.x *= -1.0; // ( -u, v, 1 ) pos z\n\n\t\t\t} else if ( face == 3.0 ) {\n\n\t\t\t\tdirection = direction.zyx;\n\t\t\t\tdirection.xz *= -1.0; // ( -1, v, -u ) neg x\n\n\t\t\t} else if ( face == 4.0 ) {\n\n\t\t\t\tdirection = direction.xzy;\n\t\t\t\tdirection.xy *= -1.0; // ( -u, -1, v ) neg y\n\n\t\t\t} else if ( face == 5.0 ) {\n\n\t\t\t\tdirection.z *= -1.0; // ( u, v, -1 ) neg z\n\n\t\t\t}\n\n\t\t\treturn direction;\n\n\t\t}\n\n\t\tvoid main() {\n\n\t\t\tvOutputDirection = getDirection( uv, faceIndex );\n\t\t\tgl_Position = vec4( position, 1.0 );\n\n\t\t}\n\t",
                fragmentShader: "\n\n\t\t\tprecision mediump float;\n\t\t\tprecision mediump int;\n\n\t\t\tvarying vec3 vOutputDirection;\n\n\t\t\tuniform sampler2D envMap;\n\n\t\t\t#include <common>\n\n\t\t\tvoid main() {\n\n\t\t\t\tvec3 outputDirection = normalize( vOutputDirection );\n\t\t\t\tvec2 uv = equirectUv( outputDirection );\n\n\t\t\t\tgl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );\n\n\t\t\t}\n\t\t",
                blending: 0,
                depthTest: !1,
                depthWrite: !1
            })
        }

        function md() {
            return new th({
                name: "CubemapToCubeUV",
                uniforms: {
                    envMap: {
                        value: null
                    },
                    flipEnvMap: {
                        value: -1
                    }
                },
                vertexShader: "\n\n\t\tprecision mediump float;\n\t\tprecision mediump int;\n\n\t\tattribute float faceIndex;\n\n\t\tvarying vec3 vOutputDirection;\n\n\t\t// RH coordinate system; PMREM face-indexing convention\n\t\tvec3 getDirection( vec2 uv, float face ) {\n\n\t\t\tuv = 2.0 * uv - 1.0;\n\n\t\t\tvec3 direction = vec3( uv, 1.0 );\n\n\t\t\tif ( face == 0.0 ) {\n\n\t\t\t\tdirection = direction.zyx; // ( 1, v, u ) pos x\n\n\t\t\t} else if ( face == 1.0 ) {\n\n\t\t\t\tdirection = direction.xzy;\n\t\t\t\tdirection.xz *= -1.0; // ( -u, 1, -v ) pos y\n\n\t\t\t} else if ( face == 2.0 ) {\n\n\t\t\t\tdirection.x *= -1.0; // ( -u, v, 1 ) pos z\n\n\t\t\t} else if ( face == 3.0 ) {\n\n\t\t\t\tdirection = direction.zyx;\n\t\t\t\tdirection.xz *= -1.0; // ( -1, v, -u ) neg x\n\n\t\t\t} else if ( face == 4.0 ) {\n\n\t\t\t\tdirection = direction.xzy;\n\t\t\t\tdirection.xy *= -1.0; // ( -u, -1, v ) neg y\n\n\t\t\t} else if ( face == 5.0 ) {\n\n\t\t\t\tdirection.z *= -1.0; // ( u, v, -1 ) neg z\n\n\t\t\t}\n\n\t\t\treturn direction;\n\n\t\t}\n\n\t\tvoid main() {\n\n\t\t\tvOutputDirection = getDirection( uv, faceIndex );\n\t\t\tgl_Position = vec4( position, 1.0 );\n\n\t\t}\n\t",
                fragmentShader: "\n\n\t\t\tprecision mediump float;\n\t\t\tprecision mediump int;\n\n\t\t\tuniform float flipEnvMap;\n\n\t\t\tvarying vec3 vOutputDirection;\n\n\t\t\tuniform samplerCube envMap;\n\n\t\t\tvoid main() {\n\n\t\t\t\tgl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );\n\n\t\t\t}\n\t\t",
                blending: 0,
                depthTest: !1,
                depthWrite: !1
            })
        }

        function gd(t) {
            let e = new WeakMap,
                n = null;

            function i(t) {
                const n = t.target;
                n.removeEventListener("dispose", i);
                const r = e.get(n);
                void 0 !== r && (e.delete(n), r.dispose())
            }
            return {
                get: function(r) {
                    if (r && r.isTexture) {
                        const a = r.mapping,
                            s = 303 === a || 304 === a,
                            o = a === ul || a === hl;
                        if (s || o) {
                            if (r.isRenderTargetTexture && !0 === r.needsPMREMUpdate) {
                                r.needsPMREMUpdate = !1;
                                let i = e.get(r);
                                return null === n && (n = new hd(t)), i = s ? n.fromEquirectangular(r, i) : n.fromCubemap(r, i), e.set(r, i), i.texture
                            }
                            if (e.has(r)) return e.get(r).texture;
                            {
                                const a = r.image;
                                if (s && a && a.height > 0 || o && a && function(t) {
                                        let e = 0;
                                        for (let n = 0; n < 6; n++) void 0 !== t[n] && e++;
                                        return 6 === e
                                    }(a)) {
                                    null === n && (n = new hd(t));
                                    const a = s ? n.fromEquirectangular(r) : n.fromCubemap(r);
                                    return e.set(r, a), r.addEventListener("dispose", i), a.texture
                                }
                                return null
                            }
                        }
                    }
                    return r
                },
                dispose: function() {
                    e = new WeakMap, null !== n && (n.dispose(), n = null)
                }
            }
        }

        function _d(t) {
            const e = {};

            function n(n) {
                if (void 0 !== e[n]) return e[n];
                let i;
                switch (n) {
                    case "WEBGL_depth_texture":
                        i = t.getExtension("WEBGL_depth_texture") || t.getExtension("MOZ_WEBGL_depth_texture") || t.getExtension("WEBKIT_WEBGL_depth_texture");
                        break;
                    case "EXT_texture_filter_anisotropic":
                        i = t.getExtension("EXT_texture_filter_anisotropic") || t.getExtension("MOZ_EXT_texture_filter_anisotropic") || t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
                        break;
                    case "WEBGL_compressed_texture_s3tc":
                        i = t.getExtension("WEBGL_compressed_texture_s3tc") || t.getExtension("MOZ_WEBGL_compressed_texture_s3tc") || t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");
                        break;
                    case "WEBGL_compressed_texture_pvrtc":
                        i = t.getExtension("WEBGL_compressed_texture_pvrtc") || t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
                        break;
                    default:
                        i = t.getExtension(n)
                }
                return e[n] = i, i
            }
            return {
                has: function(t) {
                    return null !== n(t)
                },
                init: function(t) {
                    t.isWebGL2 ? n("EXT_color_buffer_float") : (n("WEBGL_depth_texture"), n("OES_texture_float"), n("OES_texture_half_float"), n("OES_texture_half_float_linear"), n("OES_standard_derivatives"), n("OES_element_index_uint"), n("OES_vertex_array_object"), n("ANGLE_instanced_arrays")), n("OES_texture_float_linear"), n("EXT_color_buffer_half_float"), n("WEBGL_multisampled_render_to_texture")
                },
                get: function(t) {
                    const e = n(t);
                    return null === e && console.warn("THREE.WebGLRenderer: " + t + " extension not supported."), e
                }
            }
        }

        function vd(t, e, n, i) {
            const r = {},
                a = new WeakMap;

            function s(t) {
                const o = t.target;
                null !== o.index && e.remove(o.index);
                for (const t in o.attributes) e.remove(o.attributes[t]);
                for (const t in o.morphAttributes) {
                    const n = o.morphAttributes[t];
                    for (let t = 0, i = n.length; t < i; t++) e.remove(n[t])
                }
                o.removeEventListener("dispose", s), delete r[o.id];
                const l = a.get(o);
                l && (e.remove(l), a.delete(o)), i.releaseStatesOfGeometry(o), !0 === o.isInstancedBufferGeometry && delete o._maxInstanceCount, n.memory.geometries--
            }

            function o(t) {
                const n = [],
                    i = t.index,
                    r = t.attributes.position;
                let s = 0;
                if (null !== i) {
                    const t = i.array;
                    s = i.version;
                    for (let e = 0, i = t.length; e < i; e += 3) {
                        const i = t[e + 0],
                            r = t[e + 1],
                            a = t[e + 2];
                        n.push(i, r, r, a, a, i)
                    }
                } else {
                    if (void 0 === r) return;
                    {
                        const t = r.array;
                        s = r.version;
                        for (let e = 0, i = t.length / 3 - 1; e < i; e += 3) {
                            const t = e + 0,
                                i = e + 1,
                                r = e + 2;
                            n.push(t, i, i, r, r, t)
                        }
                    }
                }
                const o = new(Wo(n) ? Nu : Ou)(n, 1);
                o.version = s;
                const l = a.get(t);
                l && e.remove(l), a.set(t, o)
            }
            return {
                get: function(t, e) {
                    return !0 === r[e.id] || (e.addEventListener("dispose", s), r[e.id] = !0, n.memory.geometries++), e
                },
                update: function(n) {
                    const i = n.attributes;
                    for (const n in i) e.update(i[n], t.ARRAY_BUFFER);
                    const r = n.morphAttributes;
                    for (const n in r) {
                        const i = r[n];
                        for (let n = 0, r = i.length; n < r; n++) e.update(i[n], t.ARRAY_BUFFER)
                    }
                },
                getWireframeAttribute: function(t) {
                    const e = a.get(t);
                    if (e) {
                        const n = t.index;
                        null !== n && e.version < n.version && o(t)
                    } else o(t);
                    return a.get(t)
                }
            }
        }

        function xd(t, e, n, i) {
            const r = i.isWebGL2;
            let a, s, o;
            this.setMode = function(t) {
                a = t
            }, this.setIndex = function(t) {
                s = t.type, o = t.bytesPerElement
            }, this.render = function(e, i) {
                t.drawElements(a, i, s, e * o), n.update(i, a, 1)
            }, this.renderInstances = function(i, l, c) {
                if (0 === c) return;
                let u, h;
                if (r) u = t, h = "drawElementsInstanced";
                else if (u = e.get("ANGLE_instanced_arrays"), h = "drawElementsInstancedANGLE", null === u) return void console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");
                u[h](a, l, s, i * o, c), n.update(l, a, c)
            }
        }

        function yd(t) {
            const e = {
                frame: 0,
                calls: 0,
                triangles: 0,
                points: 0,
                lines: 0
            };
            return {
                memory: {
                    geometries: 0,
                    textures: 0
                },
                render: e,
                programs: null,
                autoReset: !0,
                reset: function() {
                    e.calls = 0, e.triangles = 0, e.points = 0, e.lines = 0
                },
                update: function(n, i, r) {
                    switch (e.calls++, i) {
                        case t.TRIANGLES:
                            e.triangles += r * (n / 3);
                            break;
                        case t.LINES:
                            e.lines += r * (n / 2);
                            break;
                        case t.LINE_STRIP:
                            e.lines += r * (n - 1);
                            break;
                        case t.LINE_LOOP:
                            e.lines += r * n;
                            break;
                        case t.POINTS:
                            e.points += r * n;
                            break;
                        default:
                            console.error("THREE.WebGLInfo: Unknown draw mode:", i)
                    }
                }
            }
        }
        class Md extends mc {
            constructor(t = null, e = 1, n = 1, i = 1) {
                super(null), this.isDataArrayTexture = !0, this.image = {
                    data: t,
                    width: e,
                    height: n,
                    depth: i
                }, this.magFilter = gl, this.minFilter = gl, this.wrapR = fl, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1
            }
        }

        function Sd(t, e) {
            return t[0] - e[0]
        }

        function Ed(t, e) {
            return Math.abs(e[1]) - Math.abs(t[1])
        }

        function Td(t, e, n) {
            const i = {},
                r = new Float32Array(8),
                a = new WeakMap,
                s = new Cu,
                o = [];
            for (let t = 0; t < 8; t++) o[t] = [t, 0];
            return {
                update: function(l, c, u) {
                    const h = l.morphTargetInfluences;
                    if (!0 === e.isWebGL2) {
                        const d = c.morphAttributes.position || c.morphAttributes.normal || c.morphAttributes.color,
                            p = void 0 !== d ? d.length : 0;
                        let f = a.get(c);
                        if (void 0 === f || f.count !== p) {
                            void 0 !== f && f.texture.dispose();
                            const _ = void 0 !== c.morphAttributes.position,
                                v = void 0 !== c.morphAttributes.normal,
                                x = void 0 !== c.morphAttributes.color,
                                y = c.morphAttributes.position || [],
                                M = c.morphAttributes.normal || [],
                                S = c.morphAttributes.color || [];
                            let E = 0;
                            !0 === _ && (E = 1), !0 === v && (E = 2), !0 === x && (E = 3);
                            let T = c.attributes.position.count * E,
                                b = 1;
                            T > e.maxTextureSize && (b = Math.ceil(T / e.maxTextureSize), T = e.maxTextureSize);
                            const w = new Float32Array(T * b * 4 * p),
                                A = new Md(w, T, b, p);
                            A.type = El, A.needsUpdate = !0;
                            const R = 4 * E;
                            for (let L = 0; L < p; L++) {
                                const P = y[L],
                                    U = M[L],
                                    D = S[L],
                                    I = T * b * 4 * L;
                                for (let O = 0; O < P.count; O++) {
                                    const N = O * R;
                                    !0 === _ && (s.fromBufferAttribute(P, O), w[I + N + 0] = s.x, w[I + N + 1] = s.y, w[I + N + 2] = s.z, w[I + N + 3] = 0), !0 === v && (s.fromBufferAttribute(U, O), w[I + N + 4] = s.x, w[I + N + 5] = s.y, w[I + N + 6] = s.z, w[I + N + 7] = 0), !0 === x && (s.fromBufferAttribute(D, O), w[I + N + 8] = s.x, w[I + N + 9] = s.y, w[I + N + 10] = s.z, w[I + N + 11] = 4 === D.itemSize ? s.w : 1)
                                }
                            }

                            function C() {
                                A.dispose(), a.delete(c), c.removeEventListener("dispose", C)
                            }
                            f = {
                                count: p,
                                texture: A,
                                size: new Ql(T, b)
                            }, a.set(c, f), c.addEventListener("dispose", C)
                        }
                        let m = 0;
                        for (let F = 0; F < h.length; F++) m += h[F];
                        const g = c.morphTargetsRelative ? 1 : 1 - m;
                        u.getUniforms().setValue(t, "morphTargetBaseInfluence", g), u.getUniforms().setValue(t, "morphTargetInfluences", h), u.getUniforms().setValue(t, "morphTargetsTexture", f.texture, n), u.getUniforms().setValue(t, "morphTargetsTextureSize", f.size)
                    } else {
                        const z = void 0 === h ? 0 : h.length;
                        let B = i[c.id];
                        if (void 0 === B || B.length !== z) {
                            B = [];
                            for (let W = 0; W < z; W++) B[W] = [W, 0];
                            i[c.id] = B
                        }
                        for (let X = 0; X < z; X++) {
                            const j = B[X];
                            j[0] = X, j[1] = h[X]
                        }
                        B.sort(Ed);
                        for (let q = 0; q < 8; q++) q < z && B[q][1] ? (o[q][0] = B[q][0], o[q][1] = B[q][1]) : (o[q][0] = Number.MAX_SAFE_INTEGER, o[q][1] = 0);
                        o.sort(Sd);
                        const k = c.morphAttributes.position,
                            H = c.morphAttributes.normal;
                        let G = 0;
                        for (let Y = 0; Y < 8; Y++) {
                            const K = o[Y],
                                Z = K[0],
                                $ = K[1];
                            Z !== Number.MAX_SAFE_INTEGER && $ ? (k && c.getAttribute("morphTarget" + Y) !== k[Z] && c.setAttribute("morphTarget" + Y, k[Z]), H && c.getAttribute("morphNormal" + Y) !== H[Z] && c.setAttribute("morphNormal" + Y, H[Z]), r[Y] = $, G += $) : (k && !0 === c.hasAttribute("morphTarget" + Y) && c.deleteAttribute("morphTarget" + Y), H && !0 === c.hasAttribute("morphNormal" + Y) && c.deleteAttribute("morphNormal" + Y), r[Y] = 0)
                        }
                        const V = c.morphTargetsRelative ? 1 : 1 - G;
                        u.getUniforms().setValue(t, "morphTargetBaseInfluence", V), u.getUniforms().setValue(t, "morphTargetInfluences", r)
                    }
                }
            }
        }

        function bd(t, e, n, i) {
            let r = new WeakMap;

            function a(t) {
                const e = t.target;
                e.removeEventListener("dispose", a), n.remove(e.instanceMatrix), null !== e.instanceColor && n.remove(e.instanceColor)
            }
            return {
                update: function(s) {
                    const o = i.render.frame,
                        l = s.geometry,
                        c = e.get(s, l);
                    if (r.get(c) !== o && (e.update(c), r.set(c, o)), s.isInstancedMesh && (!1 === s.hasEventListener("dispose", a) && s.addEventListener("dispose", a), r.get(s) !== o && (n.update(s.instanceMatrix, t.ARRAY_BUFFER), null !== s.instanceColor && n.update(s.instanceColor, t.ARRAY_BUFFER), r.set(s, o))), s.isSkinnedMesh) {
                        const t = s.skeleton;
                        r.get(t) !== o && (t.update(), r.set(t, o))
                    }
                    return c
                },
                dispose: function() {
                    r = new WeakMap
                }
            }
        }
        class wd extends mc {
            constructor(t = null, e = 1, n = 1, i = 1) {
                super(null), this.isData3DTexture = !0, this.image = {
                    data: t,
                    width: e,
                    height: n,
                    depth: i
                }, this.magFilter = gl, this.minFilter = gl, this.wrapR = fl, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1
            }
        }
        const Ad = new mc,
            Rd = new Md,
            Cd = new wd,
            Ld = new ed,
            Pd = [],
            Ud = [],
            Dd = new Float32Array(16),
            Id = new Float32Array(9),
            Od = new Float32Array(4);

        function Nd(t, e, n) {
            const i = t[0];
            if (i <= 0 || i > 0) return t;
            const r = e * n;
            let a = Pd[r];
            if (void 0 === a && (a = new Float32Array(r), Pd[r] = a), 0 !== e) {
                i.toArray(a, 0);
                for (let i = 1, r = 0; i !== e; ++i) r += n, t[i].toArray(a, r)
            }
            return a
        }

        function Fd(t, e) {
            if (t.length !== e.length) return !1;
            for (let n = 0, i = t.length; n < i; n++)
                if (t[n] !== e[n]) return !1;
            return !0
        }

        function zd(t, e) {
            for (let n = 0, i = e.length; n < i; n++) t[n] = e[n]
        }

        function Bd(t, e) {
            let n = Ud[e];
            void 0 === n && (n = new Int32Array(e), Ud[e] = n);
            for (let i = 0; i !== e; ++i) n[i] = t.allocateTextureUnit();
            return n
        }

        function kd(t, e) {
            const n = this.cache;
            n[0] !== e && (t.uniform1f(this.addr, e), n[0] = e)
        }

        function Hd(t, e) {
            const n = this.cache;
            if (void 0 !== e.x) n[0] === e.x && n[1] === e.y || (t.uniform2f(this.addr, e.x, e.y), n[0] = e.x, n[1] = e.y);
            else {
                if (Fd(n, e)) return;
                t.uniform2fv(this.addr, e), zd(n, e)
            }
        }

        function Gd(t, e) {
            const n = this.cache;
            if (void 0 !== e.x) n[0] === e.x && n[1] === e.y && n[2] === e.z || (t.uniform3f(this.addr, e.x, e.y, e.z), n[0] = e.x, n[1] = e.y, n[2] = e.z);
            else if (void 0 !== e.r) n[0] === e.r && n[1] === e.g && n[2] === e.b || (t.uniform3f(this.addr, e.r, e.g, e.b), n[0] = e.r, n[1] = e.g, n[2] = e.b);
            else {
                if (Fd(n, e)) return;
                t.uniform3fv(this.addr, e), zd(n, e)
            }
        }

        function Vd(t, e) {
            const n = this.cache;
            if (void 0 !== e.x) n[0] === e.x && n[1] === e.y && n[2] === e.z && n[3] === e.w || (t.uniform4f(this.addr, e.x, e.y, e.z, e.w), n[0] = e.x, n[1] = e.y, n[2] = e.z, n[3] = e.w);
            else {
                if (Fd(n, e)) return;
                t.uniform4fv(this.addr, e), zd(n, e)
            }
        }

        function Wd(t, e) {
            const n = this.cache,
                i = e.elements;
            if (void 0 === i) {
                if (Fd(n, e)) return;
                t.uniformMatrix2fv(this.addr, !1, e), zd(n, e)
            } else {
                if (Fd(n, i)) return;
                Od.set(i), t.uniformMatrix2fv(this.addr, !1, Od), zd(n, i)
            }
        }

        function Xd(t, e) {
            const n = this.cache,
                i = e.elements;
            if (void 0 === i) {
                if (Fd(n, e)) return;
                t.uniformMatrix3fv(this.addr, !1, e), zd(n, e)
            } else {
                if (Fd(n, i)) return;
                Id.set(i), t.uniformMatrix3fv(this.addr, !1, Id), zd(n, i)
            }
        }

        function jd(t, e) {
            const n = this.cache,
                i = e.elements;
            if (void 0 === i) {
                if (Fd(n, e)) return;
                t.uniformMatrix4fv(this.addr, !1, e), zd(n, e)
            } else {
                if (Fd(n, i)) return;
                Dd.set(i), t.uniformMatrix4fv(this.addr, !1, Dd), zd(n, i)
            }
        }

        function qd(t, e) {
            const n = this.cache;
            n[0] !== e && (t.uniform1i(this.addr, e), n[0] = e)
        }

        function Yd(t, e) {
            const n = this.cache;
            if (void 0 !== e.x) n[0] === e.x && n[1] === e.y || (t.uniform2i(this.addr, e.x, e.y), n[0] = e.x, n[1] = e.y);
            else {
                if (Fd(n, e)) return;
                t.uniform2iv(this.addr, e), zd(n, e)
            }
        }

        function Kd(t, e) {
            const n = this.cache;
            if (void 0 !== e.x) n[0] === e.x && n[1] === e.y && n[2] === e.z || (t.uniform3i(this.addr, e.x, e.y, e.z), n[0] = e.x, n[1] = e.y, n[2] = e.z);
            else {
                if (Fd(n, e)) return;
                t.uniform3iv(this.addr, e), zd(n, e)
            }
        }

        function Zd(t, e) {
            const n = this.cache;
            if (void 0 !== e.x) n[0] === e.x && n[1] === e.y && n[2] === e.z && n[3] === e.w || (t.uniform4i(this.addr, e.x, e.y, e.z, e.w), n[0] = e.x, n[1] = e.y, n[2] = e.z, n[3] = e.w);
            else {
                if (Fd(n, e)) return;
                t.uniform4iv(this.addr, e), zd(n, e)
            }
        }

        function $d(t, e) {
            const n = this.cache;
            n[0] !== e && (t.uniform1ui(this.addr, e), n[0] = e)
        }

        function Jd(t, e) {
            const n = this.cache;
            if (void 0 !== e.x) n[0] === e.x && n[1] === e.y || (t.uniform2ui(this.addr, e.x, e.y), n[0] = e.x, n[1] = e.y);
            else {
                if (Fd(n, e)) return;
                t.uniform2uiv(this.addr, e), zd(n, e)
            }
        }

        function Qd(t, e) {
            const n = this.cache;
            if (void 0 !== e.x) n[0] === e.x && n[1] === e.y && n[2] === e.z || (t.uniform3ui(this.addr, e.x, e.y, e.z), n[0] = e.x, n[1] = e.y, n[2] = e.z);
            else {
                if (Fd(n, e)) return;
                t.uniform3uiv(this.addr, e), zd(n, e)
            }
        }

        function tp(t, e) {
            const n = this.cache;
            if (void 0 !== e.x) n[0] === e.x && n[1] === e.y && n[2] === e.z && n[3] === e.w || (t.uniform4ui(this.addr, e.x, e.y, e.z, e.w), n[0] = e.x, n[1] = e.y, n[2] = e.z, n[3] = e.w);
            else {
                if (Fd(n, e)) return;
                t.uniform4uiv(this.addr, e), zd(n, e)
            }
        }

        function ep(t, e, n) {
            const i = this.cache,
                r = n.allocateTextureUnit();
            i[0] !== r && (t.uniform1i(this.addr, r), i[0] = r), n.setTexture2D(e || Ad, r)
        }

        function np(t, e, n) {
            const i = this.cache,
                r = n.allocateTextureUnit();
            i[0] !== r && (t.uniform1i(this.addr, r), i[0] = r), n.setTexture3D(e || Cd, r)
        }

        function ip(t, e, n) {
            const i = this.cache,
                r = n.allocateTextureUnit();
            i[0] !== r && (t.uniform1i(this.addr, r), i[0] = r), n.setTextureCube(e || Ld, r)
        }

        function rp(t, e, n) {
            const i = this.cache,
                r = n.allocateTextureUnit();
            i[0] !== r && (t.uniform1i(this.addr, r), i[0] = r), n.setTexture2DArray(e || Rd, r)
        }

        function ap(t, e) {
            t.uniform1fv(this.addr, e)
        }

        function sp(t, e) {
            const n = Nd(e, this.size, 2);
            t.uniform2fv(this.addr, n)
        }

        function op(t, e) {
            const n = Nd(e, this.size, 3);
            t.uniform3fv(this.addr, n)
        }

        function lp(t, e) {
            const n = Nd(e, this.size, 4);
            t.uniform4fv(this.addr, n)
        }

        function cp(t, e) {
            const n = Nd(e, this.size, 4);
            t.uniformMatrix2fv(this.addr, !1, n)
        }

        function up(t, e) {
            const n = Nd(e, this.size, 9);
            t.uniformMatrix3fv(this.addr, !1, n)
        }

        function hp(t, e) {
            const n = Nd(e, this.size, 16);
            t.uniformMatrix4fv(this.addr, !1, n)
        }

        function dp(t, e) {
            t.uniform1iv(this.addr, e)
        }

        function pp(t, e) {
            t.uniform2iv(this.addr, e)
        }

        function fp(t, e) {
            t.uniform3iv(this.addr, e)
        }

        function mp(t, e) {
            t.uniform4iv(this.addr, e)
        }

        function gp(t, e) {
            t.uniform1uiv(this.addr, e)
        }

        function _p(t, e) {
            t.uniform2uiv(this.addr, e)
        }

        function vp(t, e) {
            t.uniform3uiv(this.addr, e)
        }

        function xp(t, e) {
            t.uniform4uiv(this.addr, e)
        }

        function yp(t, e, n) {
            const i = this.cache,
                r = e.length,
                a = Bd(n, r);
            Fd(i, a) || (t.uniform1iv(this.addr, a), zd(i, a));
            for (let t = 0; t !== r; ++t) n.setTexture2D(e[t] || Ad, a[t])
        }

        function Mp(t, e, n) {
            const i = this.cache,
                r = e.length,
                a = Bd(n, r);
            Fd(i, a) || (t.uniform1iv(this.addr, a), zd(i, a));
            for (let t = 0; t !== r; ++t) n.setTexture3D(e[t] || Cd, a[t])
        }

        function Sp(t, e, n) {
            const i = this.cache,
                r = e.length,
                a = Bd(n, r);
            Fd(i, a) || (t.uniform1iv(this.addr, a), zd(i, a));
            for (let t = 0; t !== r; ++t) n.setTextureCube(e[t] || Ld, a[t])
        }

        function Ep(t, e, n) {
            const i = this.cache,
                r = e.length,
                a = Bd(n, r);
            Fd(i, a) || (t.uniform1iv(this.addr, a), zd(i, a));
            for (let t = 0; t !== r; ++t) n.setTexture2DArray(e[t] || Rd, a[t])
        }
        class Tp {
            constructor(t, e, n) {
                this.id = t, this.addr = n, this.cache = [], this.setValue = function(t) {
                    switch (t) {
                        case 5126:
                            return kd;
                        case 35664:
                            return Hd;
                        case 35665:
                            return Gd;
                        case 35666:
                            return Vd;
                        case 35674:
                            return Wd;
                        case 35675:
                            return Xd;
                        case 35676:
                            return jd;
                        case 5124:
                        case 35670:
                            return qd;
                        case 35667:
                        case 35671:
                            return Yd;
                        case 35668:
                        case 35672:
                            return Kd;
                        case 35669:
                        case 35673:
                            return Zd;
                        case 5125:
                            return $d;
                        case 36294:
                            return Jd;
                        case 36295:
                            return Qd;
                        case 36296:
                            return tp;
                        case 35678:
                        case 36198:
                        case 36298:
                        case 36306:
                        case 35682:
                            return ep;
                        case 35679:
                        case 36299:
                        case 36307:
                            return np;
                        case 35680:
                        case 36300:
                        case 36308:
                        case 36293:
                            return ip;
                        case 36289:
                        case 36303:
                        case 36311:
                        case 36292:
                            return rp
                    }
                }(e.type)
            }
        }
        class bp {
            constructor(t, e, n) {
                this.id = t, this.addr = n, this.cache = [], this.size = e.size, this.setValue = function(t) {
                    switch (t) {
                        case 5126:
                            return ap;
                        case 35664:
                            return sp;
                        case 35665:
                            return op;
                        case 35666:
                            return lp;
                        case 35674:
                            return cp;
                        case 35675:
                            return up;
                        case 35676:
                            return hp;
                        case 5124:
                        case 35670:
                            return dp;
                        case 35667:
                        case 35671:
                            return pp;
                        case 35668:
                        case 35672:
                            return fp;
                        case 35669:
                        case 35673:
                            return mp;
                        case 5125:
                            return gp;
                        case 36294:
                            return _p;
                        case 36295:
                            return vp;
                        case 36296:
                            return xp;
                        case 35678:
                        case 36198:
                        case 36298:
                        case 36306:
                        case 35682:
                            return yp;
                        case 35679:
                        case 36299:
                        case 36307:
                            return Mp;
                        case 35680:
                        case 36300:
                        case 36308:
                        case 36293:
                            return Sp;
                        case 36289:
                        case 36303:
                        case 36311:
                        case 36292:
                            return Ep
                    }
                }(e.type)
            }
        }
        class wp {
            constructor(t) {
                this.id = t, this.seq = [], this.map = {}
            }
            setValue(t, e, n) {
                const i = this.seq;
                for (let r = 0, a = i.length; r !== a; ++r) {
                    const a = i[r];
                    a.setValue(t, e[a.id], n)
                }
            }
        }
        const Ap = /(\w+)(\])?(\[|\.)?/g;

        function Rp(t, e) {
            t.seq.push(e), t.map[e.id] = e
        }

        function Cp(t, e, n) {
            const i = t.name,
                r = i.length;
            for (Ap.lastIndex = 0;;) {
                const a = Ap.exec(i),
                    s = Ap.lastIndex;
                let o = a[1];
                const l = "]" === a[2],
                    c = a[3];
                if (l && (o |= 0), void 0 === c || "[" === c && s + 2 === r) {
                    Rp(n, void 0 === c ? new Tp(o, t, e) : new bp(o, t, e));
                    break
                } {
                    let t = n.map[o];
                    void 0 === t && (t = new wp(o), Rp(n, t)), n = t
                }
            }
        }
        class Lp {
            constructor(t, e) {
                this.seq = [], this.map = {};
                const n = t.getProgramParameter(e, t.ACTIVE_UNIFORMS);
                for (let i = 0; i < n; ++i) {
                    const n = t.getActiveUniform(e, i);
                    Cp(n, t.getUniformLocation(e, n.name), this)
                }
            }
            setValue(t, e, n, i) {
                const r = this.map[e];
                void 0 !== r && r.setValue(t, n, i)
            }
            setOptional(t, e, n) {
                const i = e[n];
                void 0 !== i && this.setValue(t, n, i)
            }
            static upload(t, e, n, i) {
                for (let r = 0, a = e.length; r !== a; ++r) {
                    const a = e[r],
                        s = n[a.id];
                    !1 !== s.needsUpdate && a.setValue(t, s.value, i)
                }
            }
            static seqWithValue(t, e) {
                const n = [];
                for (let i = 0, r = t.length; i !== r; ++i) {
                    const r = t[i];
                    r.id in e && n.push(r)
                }
                return n
            }
        }

        function Pp(t, e, n) {
            const i = t.createShader(e);
            return t.shaderSource(i, n), t.compileShader(i), i
        }
        let Up = 0;

        function Dp(t, e, n) {
            const i = t.getShaderParameter(e, t.COMPILE_STATUS),
                r = t.getShaderInfoLog(e).trim();
            if (i && "" === r) return "";
            const a = /ERROR: 0:(\d+)/.exec(r);
            if (a) {
                const i = parseInt(a[1]);
                return n.toUpperCase() + "\n\n" + r + "\n\n" + function(t, e) {
                    const n = t.split("\n"),
                        i = [],
                        r = Math.max(e - 6, 0),
                        a = Math.min(e + 6, n.length);
                    for (let t = r; t < a; t++) {
                        const r = t + 1;
                        i.push(`${r===e?">":" "} ${r}: ${n[t]}`)
                    }
                    return i.join("\n")
                }(t.getShaderSource(e), i)
            }
            return r
        }

        function Ip(t, e) {
            const n = function(t) {
                switch (t) {
                    case Nl:
                        return ["Linear", "( value )"];
                    case Ol:
                        return ["sRGB", "( value )"];
                    default:
                        return console.warn("THREE.WebGLProgram: Unsupported color space:", t), ["Linear", "( value )"]
                }
            }(e);
            return "vec4 " + t + "( vec4 value ) { return LinearTo" + n[0] + n[1] + "; }"
        }

        function Op(t, e) {
            let n;
            switch (e) {
                case al:
                    n = "Linear";
                    break;
                case sl:
                    n = "Reinhard";
                    break;
                case ol:
                    n = "OptimizedCineon";
                    break;
                case ll:
                    n = "ACESFilmic";
                    break;
                case cl:
                    n = "Custom";
                    break;
                default:
                    console.warn("THREE.WebGLProgram: Unsupported toneMapping:", e), n = "Linear"
            }
            return "vec3 " + t + "( vec3 color ) { return " + n + "ToneMapping( color ); }"
        }

        function Np(t) {
            return "" !== t
        }

        function Fp(t, e) {
            const n = e.numSpotLightShadows + e.numSpotLightMaps - e.numSpotLightShadowsWithMaps;
            return t.replace(/NUM_DIR_LIGHTS/g, e.numDirLights).replace(/NUM_SPOT_LIGHTS/g, e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g, e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g, n).replace(/NUM_RECT_AREA_LIGHTS/g, e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g, e.numPointLights).replace(/NUM_HEMI_LIGHTS/g, e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g, e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g, e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g, e.numPointLightShadows)
        }

        function zp(t, e) {
            return t.replace(/NUM_CLIPPING_PLANES/g, e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g, e.numClippingPlanes - e.numClipIntersection)
        }
        const Bp = /^[ \t]*#include +<([\w\d./]+)>/gm;

        function kp(t) {
            return t.replace(Bp, Gp)
        }
        const Hp = new Map([
            ["encodings_fragment", "colorspace_fragment"],
            ["encodings_pars_fragment", "colorspace_pars_fragment"],
            ["output_fragment", "opaque_fragment"]
        ]);

        function Gp(t, e) {
            let n = Hh[e];
            if (void 0 === n) {
                const t = Hp.get(e);
                if (void 0 === t) throw new Error("Can not resolve #include <" + e + ">");
                n = Hh[t], console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.', e, t)
            }
            return kp(n)
        }
        const Vp = /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;

        function Wp(t) {
            return t.replace(Vp, Xp)
        }

        function Xp(t, e, n, i) {
            let r = "";
            for (let t = parseInt(e); t < parseInt(n); t++) r += i.replace(/\[\s*i\s*\]/g, "[ " + t + " ]").replace(/UNROLLED_LOOP_INDEX/g, t);
            return r
        }

        function jp(t) {
            let e = "precision " + t.precision + " float;\nprecision " + t.precision + " int;";
            return "highp" === t.precision ? e += "\n#define HIGH_PRECISION" : "mediump" === t.precision ? e += "\n#define MEDIUM_PRECISION" : "lowp" === t.precision && (e += "\n#define LOW_PRECISION"), e
        }

        function qp(t, e, n, i) {
            const r = t.getContext(),
                a = n.defines;
            let s = n.vertexShader,
                o = n.fragmentShader;
            const l = function(t) {
                    let e = "SHADOWMAP_TYPE_BASIC";
                    return t.shadowMapType === $o ? e = "SHADOWMAP_TYPE_PCF" : t.shadowMapType === Jo ? e = "SHADOWMAP_TYPE_PCF_SOFT" : t.shadowMapType === Qo && (e = "SHADOWMAP_TYPE_VSM"), e
                }(n),
                c = function(t) {
                    let e = "ENVMAP_TYPE_CUBE";
                    if (t.envMap) switch (t.envMapMode) {
                        case ul:
                        case hl:
                            e = "ENVMAP_TYPE_CUBE";
                            break;
                        case dl:
                            e = "ENVMAP_TYPE_CUBE_UV"
                    }
                    return e
                }(n),
                u = function(t) {
                    let e = "ENVMAP_MODE_REFLECTION";
                    return t.envMap && t.envMapMode === hl && (e = "ENVMAP_MODE_REFRACTION"), e
                }(n),
                h = function(t) {
                    let e = "ENVMAP_BLENDING_NONE";
                    if (t.envMap) switch (t.combine) {
                        case el:
                            e = "ENVMAP_BLENDING_MULTIPLY";
                            break;
                        case nl:
                            e = "ENVMAP_BLENDING_MIX";
                            break;
                        case il:
                            e = "ENVMAP_BLENDING_ADD"
                    }
                    return e
                }(n),
                d = function(t) {
                    const e = t.envMapCubeUVHeight;
                    if (null === e) return null;
                    const n = Math.log2(e) - 2,
                        i = 1 / e;
                    return {
                        texelWidth: 1 / (3 * Math.max(Math.pow(2, n), 112)),
                        texelHeight: i,
                        maxMip: n
                    }
                }(n),
                p = n.isWebGL2 ? "" : function(t) {
                    return [t.extensionDerivatives || t.envMapCubeUVHeight || t.bumpMap || t.normalMapTangentSpace || t.clearcoatNormalMap || t.flatShading || "physical" === t.shaderID ? "#extension GL_OES_standard_derivatives : enable" : "", (t.extensionFragDepth || t.logarithmicDepthBuffer) && t.rendererExtensionFragDepth ? "#extension GL_EXT_frag_depth : enable" : "", t.extensionDrawBuffers && t.rendererExtensionDrawBuffers ? "#extension GL_EXT_draw_buffers : require" : "", (t.extensionShaderTextureLOD || t.envMap || t.transmission) && t.rendererExtensionShaderTextureLod ? "#extension GL_EXT_shader_texture_lod : enable" : ""].filter(Np).join("\n")
                }(n),
                f = function(t) {
                    const e = [];
                    for (const n in t) {
                        const i = t[n];
                        !1 !== i && e.push("#define " + n + " " + i)
                    }
                    return e.join("\n")
                }(a),
                m = r.createProgram();
            let g, _, v = n.glslVersion ? "#version " + n.glslVersion + "\n" : "";
            n.isRawShaderMaterial ? (g = ["#define SHADER_TYPE " + n.shaderType, "#define SHADER_NAME " + n.shaderName, f].filter(Np).join("\n"), g.length > 0 && (g += "\n"), _ = [p, "#define SHADER_TYPE " + n.shaderType, "#define SHADER_NAME " + n.shaderName, f].filter(Np).join("\n"), _.length > 0 && (_ += "\n")) : (g = [jp(n), "#define SHADER_TYPE " + n.shaderType, "#define SHADER_NAME " + n.shaderName, f, n.instancing ? "#define USE_INSTANCING" : "", n.instancingColor ? "#define USE_INSTANCING_COLOR" : "", n.useFog && n.fog ? "#define USE_FOG" : "", n.useFog && n.fogExp2 ? "#define FOG_EXP2" : "", n.map ? "#define USE_MAP" : "", n.envMap ? "#define USE_ENVMAP" : "", n.envMap ? "#define " + u : "", n.lightMap ? "#define USE_LIGHTMAP" : "", n.aoMap ? "#define USE_AOMAP" : "", n.bumpMap ? "#define USE_BUMPMAP" : "", n.normalMap ? "#define USE_NORMALMAP" : "", n.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "", n.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "", n.displacementMap ? "#define USE_DISPLACEMENTMAP" : "", n.emissiveMap ? "#define USE_EMISSIVEMAP" : "", n.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "", n.clearcoatMap ? "#define USE_CLEARCOATMAP" : "", n.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "", n.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "", n.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "", n.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "", n.specularMap ? "#define USE_SPECULARMAP" : "", n.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "", n.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "", n.roughnessMap ? "#define USE_ROUGHNESSMAP" : "", n.metalnessMap ? "#define USE_METALNESSMAP" : "", n.alphaMap ? "#define USE_ALPHAMAP" : "", n.alphaHash ? "#define USE_ALPHAHASH" : "", n.transmission ? "#define USE_TRANSMISSION" : "", n.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "", n.thicknessMap ? "#define USE_THICKNESSMAP" : "", n.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "", n.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "", n.mapUv ? "#define MAP_UV " + n.mapUv : "", n.alphaMapUv ? "#define ALPHAMAP_UV " + n.alphaMapUv : "", n.lightMapUv ? "#define LIGHTMAP_UV " + n.lightMapUv : "", n.aoMapUv ? "#define AOMAP_UV " + n.aoMapUv : "", n.emissiveMapUv ? "#define EMISSIVEMAP_UV " + n.emissiveMapUv : "", n.bumpMapUv ? "#define BUMPMAP_UV " + n.bumpMapUv : "", n.normalMapUv ? "#define NORMALMAP_UV " + n.normalMapUv : "", n.displacementMapUv ? "#define DISPLACEMENTMAP_UV " + n.displacementMapUv : "", n.metalnessMapUv ? "#define METALNESSMAP_UV " + n.metalnessMapUv : "", n.roughnessMapUv ? "#define ROUGHNESSMAP_UV " + n.roughnessMapUv : "", n.anisotropyMapUv ? "#define ANISOTROPYMAP_UV " + n.anisotropyMapUv : "", n.clearcoatMapUv ? "#define CLEARCOATMAP_UV " + n.clearcoatMapUv : "", n.clearcoatNormalMapUv ? "#define CLEARCOAT_NORMALMAP_UV " + n.clearcoatNormalMapUv : "", n.clearcoatRoughnessMapUv ? "#define CLEARCOAT_ROUGHNESSMAP_UV " + n.clearcoatRoughnessMapUv : "", n.iridescenceMapUv ? "#define IRIDESCENCEMAP_UV " + n.iridescenceMapUv : "", n.iridescenceThicknessMapUv ? "#define IRIDESCENCE_THICKNESSMAP_UV " + n.iridescenceThicknessMapUv : "", n.sheenColorMapUv ? "#define SHEEN_COLORMAP_UV " + n.sheenColorMapUv : "", n.sheenRoughnessMapUv ? "#define SHEEN_ROUGHNESSMAP_UV " + n.sheenRoughnessMapUv : "", n.specularMapUv ? "#define SPECULARMAP_UV " + n.specularMapUv : "", n.specularColorMapUv ? "#define SPECULAR_COLORMAP_UV " + n.specularColorMapUv : "", n.specularIntensityMapUv ? "#define SPECULAR_INTENSITYMAP_UV " + n.specularIntensityMapUv : "", n.transmissionMapUv ? "#define TRANSMISSIONMAP_UV " + n.transmissionMapUv : "", n.thicknessMapUv ? "#define THICKNESSMAP_UV " + n.thicknessMapUv : "", n.vertexTangents && !1 === n.flatShading ? "#define USE_TANGENT" : "", n.vertexColors ? "#define USE_COLOR" : "", n.vertexAlphas ? "#define USE_COLOR_ALPHA" : "", n.vertexUv1s ? "#define USE_UV1" : "", n.vertexUv2s ? "#define USE_UV2" : "", n.vertexUv3s ? "#define USE_UV3" : "", n.pointsUvs ? "#define USE_POINTS_UV" : "", n.flatShading ? "#define FLAT_SHADED" : "", n.skinning ? "#define USE_SKINNING" : "", n.morphTargets ? "#define USE_MORPHTARGETS" : "", n.morphNormals && !1 === n.flatShading ? "#define USE_MORPHNORMALS" : "", n.morphColors && n.isWebGL2 ? "#define USE_MORPHCOLORS" : "", n.morphTargetsCount > 0 && n.isWebGL2 ? "#define MORPHTARGETS_TEXTURE" : "", n.morphTargetsCount > 0 && n.isWebGL2 ? "#define MORPHTARGETS_TEXTURE_STRIDE " + n.morphTextureStride : "", n.morphTargetsCount > 0 && n.isWebGL2 ? "#define MORPHTARGETS_COUNT " + n.morphTargetsCount : "", n.doubleSided ? "#define DOUBLE_SIDED" : "", n.flipSided ? "#define FLIP_SIDED" : "", n.shadowMapEnabled ? "#define USE_SHADOWMAP" : "", n.shadowMapEnabled ? "#define " + l : "", n.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "", n.useLegacyLights ? "#define LEGACY_LIGHTS" : "", n.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "", n.logarithmicDepthBuffer && n.rendererExtensionFragDepth ? "#define USE_LOGDEPTHBUF_EXT" : "", "uniform mat4 modelMatrix;", "uniform mat4 modelViewMatrix;", "uniform mat4 projectionMatrix;", "uniform mat4 viewMatrix;", "uniform mat3 normalMatrix;", "uniform vec3 cameraPosition;", "uniform bool isOrthographic;", "#ifdef USE_INSTANCING", "\tattribute mat4 instanceMatrix;", "#endif", "#ifdef USE_INSTANCING_COLOR", "\tattribute vec3 instanceColor;", "#endif", "attribute vec3 position;", "attribute vec3 normal;", "attribute vec2 uv;", "#ifdef USE_UV1", "\tattribute vec2 uv1;", "#endif", "#ifdef USE_UV2", "\tattribute vec2 uv2;", "#endif", "#ifdef USE_UV3", "\tattribute vec2 uv3;", "#endif", "#ifdef USE_TANGENT", "\tattribute vec4 tangent;", "#endif", "#if defined( USE_COLOR_ALPHA )", "\tattribute vec4 color;", "#elif defined( USE_COLOR )", "\tattribute vec3 color;", "#endif", "#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )", "\tattribute vec3 morphTarget0;", "\tattribute vec3 morphTarget1;", "\tattribute vec3 morphTarget2;", "\tattribute vec3 morphTarget3;", "\t#ifdef USE_MORPHNORMALS", "\t\tattribute vec3 morphNormal0;", "\t\tattribute vec3 morphNormal1;", "\t\tattribute vec3 morphNormal2;", "\t\tattribute vec3 morphNormal3;", "\t#else", "\t\tattribute vec3 morphTarget4;", "\t\tattribute vec3 morphTarget5;", "\t\tattribute vec3 morphTarget6;", "\t\tattribute vec3 morphTarget7;", "\t#endif", "#endif", "#ifdef USE_SKINNING", "\tattribute vec4 skinIndex;", "\tattribute vec4 skinWeight;", "#endif", "\n"].filter(Np).join("\n"), _ = [p, jp(n), "#define SHADER_TYPE " + n.shaderType, "#define SHADER_NAME " + n.shaderName, f, n.useFog && n.fog ? "#define USE_FOG" : "", n.useFog && n.fogExp2 ? "#define FOG_EXP2" : "", n.map ? "#define USE_MAP" : "", n.matcap ? "#define USE_MATCAP" : "", n.envMap ? "#define USE_ENVMAP" : "", n.envMap ? "#define " + c : "", n.envMap ? "#define " + u : "", n.envMap ? "#define " + h : "", d ? "#define CUBEUV_TEXEL_WIDTH " + d.texelWidth : "", d ? "#define CUBEUV_TEXEL_HEIGHT " + d.texelHeight : "", d ? "#define CUBEUV_MAX_MIP " + d.maxMip + ".0" : "", n.lightMap ? "#define USE_LIGHTMAP" : "", n.aoMap ? "#define USE_AOMAP" : "", n.bumpMap ? "#define USE_BUMPMAP" : "", n.normalMap ? "#define USE_NORMALMAP" : "", n.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "", n.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "", n.emissiveMap ? "#define USE_EMISSIVEMAP" : "", n.anisotropy ? "#define USE_ANISOTROPY" : "", n.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "", n.clearcoat ? "#define USE_CLEARCOAT" : "", n.clearcoatMap ? "#define USE_CLEARCOATMAP" : "", n.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "", n.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "", n.iridescence ? "#define USE_IRIDESCENCE" : "", n.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "", n.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "", n.specularMap ? "#define USE_SPECULARMAP" : "", n.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "", n.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "", n.roughnessMap ? "#define USE_ROUGHNESSMAP" : "", n.metalnessMap ? "#define USE_METALNESSMAP" : "", n.alphaMap ? "#define USE_ALPHAMAP" : "", n.alphaTest ? "#define USE_ALPHATEST" : "", n.alphaHash ? "#define USE_ALPHAHASH" : "", n.sheen ? "#define USE_SHEEN" : "", n.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "", n.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "", n.transmission ? "#define USE_TRANSMISSION" : "", n.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "", n.thicknessMap ? "#define USE_THICKNESSMAP" : "", n.vertexTangents && !1 === n.flatShading ? "#define USE_TANGENT" : "", n.vertexColors || n.instancingColor ? "#define USE_COLOR" : "", n.vertexAlphas ? "#define USE_COLOR_ALPHA" : "", n.vertexUv1s ? "#define USE_UV1" : "", n.vertexUv2s ? "#define USE_UV2" : "", n.vertexUv3s ? "#define USE_UV3" : "", n.pointsUvs ? "#define USE_POINTS_UV" : "", n.gradientMap ? "#define USE_GRADIENTMAP" : "", n.flatShading ? "#define FLAT_SHADED" : "", n.doubleSided ? "#define DOUBLE_SIDED" : "", n.flipSided ? "#define FLIP_SIDED" : "", n.shadowMapEnabled ? "#define USE_SHADOWMAP" : "", n.shadowMapEnabled ? "#define " + l : "", n.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : "", n.useLegacyLights ? "#define LEGACY_LIGHTS" : "", n.decodeVideoTexture ? "#define DECODE_VIDEO_TEXTURE" : "", n.logarithmicDepthBuffer ? "#define USE_LOGDEPTHBUF" : "", n.logarithmicDepthBuffer && n.rendererExtensionFragDepth ? "#define USE_LOGDEPTHBUF_EXT" : "", "uniform mat4 viewMatrix;", "uniform vec3 cameraPosition;", "uniform bool isOrthographic;", n.toneMapping !== rl ? "#define TONE_MAPPING" : "", n.toneMapping !== rl ? Hh.tonemapping_pars_fragment : "", n.toneMapping !== rl ? Op("toneMapping", n.toneMapping) : "", n.dithering ? "#define DITHERING" : "", n.opaque ? "#define OPAQUE" : "", Hh.colorspace_pars_fragment, Ip("linearToOutputTexel", n.outputColorSpace), n.useDepthPacking ? "#define DEPTH_PACKING " + n.depthPacking : "", "\n"].filter(Np).join("\n")), s = kp(s), s = Fp(s, n), s = zp(s, n), o = kp(o), o = Fp(o, n), o = zp(o, n), s = Wp(s), o = Wp(o), n.isWebGL2 && !0 !== n.isRawShaderMaterial && (v = "#version 300 es\n", g = ["precision mediump sampler2DArray;", "#define attribute in", "#define varying out", "#define texture2D texture"].join("\n") + "\n" + g, _ = ["#define varying in", n.glslVersion === Bl ? "" : "layout(location = 0) out highp vec4 pc_fragColor;", n.glslVersion === Bl ? "" : "#define gl_FragColor pc_fragColor", "#define gl_FragDepthEXT gl_FragDepth", "#define texture2D texture", "#define textureCube texture", "#define texture2DProj textureProj", "#define texture2DLodEXT textureLod", "#define texture2DProjLodEXT textureProjLod", "#define textureCubeLodEXT textureLod", "#define texture2DGradEXT textureGrad", "#define texture2DProjGradEXT textureProjGrad", "#define textureCubeGradEXT textureGrad"].join("\n") + "\n" + _);
            const x = v + g + s,
                y = v + _ + o,
                M = Pp(r, r.VERTEX_SHADER, x),
                S = Pp(r, r.FRAGMENT_SHADER, y);
            if (r.attachShader(m, M), r.attachShader(m, S), void 0 !== n.index0AttributeName ? r.bindAttribLocation(m, 0, n.index0AttributeName) : !0 === n.morphTargets && r.bindAttribLocation(m, 0, "position"), r.linkProgram(m), t.debug.checkShaderErrors) {
                const e = r.getProgramInfoLog(m).trim(),
                    n = r.getShaderInfoLog(M).trim(),
                    i = r.getShaderInfoLog(S).trim();
                let a = !0,
                    s = !0;
                if (!1 === r.getProgramParameter(m, r.LINK_STATUS))
                    if (a = !1, "function" == typeof t.debug.onShaderError) t.debug.onShaderError(r, m, M, S);
                    else {
                        const t = Dp(r, M, "vertex"),
                            n = Dp(r, S, "fragment");
                        console.error("THREE.WebGLProgram: Shader Error " + r.getError() + " - VALIDATE_STATUS " + r.getProgramParameter(m, r.VALIDATE_STATUS) + "\n\nProgram Info Log: " + e + "\n" + t + "\n" + n)
                    }
                else "" !== e ? console.warn("THREE.WebGLProgram: Program Info Log:", e) : "" !== n && "" !== i || (s = !1);
                s && (this.diagnostics = {
                    runnable: a,
                    programLog: e,
                    vertexShader: {
                        log: n,
                        prefix: g
                    },
                    fragmentShader: {
                        log: i,
                        prefix: _
                    }
                })
            }
            let E, T;
            return r.deleteShader(M), r.deleteShader(S), this.getUniforms = function() {
                return void 0 === E && (E = new Lp(r, m)), E
            }, this.getAttributes = function() {
                return void 0 === T && (T = function(t, e) {
                    const n = {},
                        i = t.getProgramParameter(e, t.ACTIVE_ATTRIBUTES);
                    for (let r = 0; r < i; r++) {
                        const i = t.getActiveAttrib(e, r),
                            a = i.name;
                        let s = 1;
                        i.type === t.FLOAT_MAT2 && (s = 2), i.type === t.FLOAT_MAT3 && (s = 3), i.type === t.FLOAT_MAT4 && (s = 4), n[a] = {
                            type: i.type,
                            location: t.getAttribLocation(e, a),
                            locationSize: s
                        }
                    }
                    return n
                }(r, m)), T
            }, this.destroy = function() {
                i.releaseStatesOfProgram(this), r.deleteProgram(m), this.program = void 0
            }, this.type = n.shaderType, this.name = n.shaderName, this.id = Up++, this.cacheKey = e, this.usedTimes = 1, this.program = m, this.vertexShader = M, this.fragmentShader = S, this
        }
        let Yp = 0;
        class Kp {
            constructor() {
                this.shaderCache = new Map, this.materialCache = new Map
            }
            update(t) {
                const e = t.vertexShader,
                    n = t.fragmentShader,
                    i = this._getShaderStage(e),
                    r = this._getShaderStage(n),
                    a = this._getShaderCacheForMaterial(t);
                return !1 === a.has(i) && (a.add(i), i.usedTimes++), !1 === a.has(r) && (a.add(r), r.usedTimes++), this
            }
            remove(t) {
                const e = this.materialCache.get(t);
                for (const t of e) t.usedTimes--, 0 === t.usedTimes && this.shaderCache.delete(t.code);
                return this.materialCache.delete(t), this
            }
            getVertexShaderID(t) {
                return this._getShaderStage(t.vertexShader).id
            }
            getFragmentShaderID(t) {
                return this._getShaderStage(t.fragmentShader).id
            }
            dispose() {
                this.shaderCache.clear(), this.materialCache.clear()
            }
            _getShaderCacheForMaterial(t) {
                const e = this.materialCache;
                let n = e.get(t);
                return void 0 === n && (n = new Set, e.set(t, n)), n
            }
            _getShaderStage(t) {
                const e = this.shaderCache;
                let n = e.get(t);
                return void 0 === n && (n = new Zp(t), e.set(t, n)), n
            }
        }
        class Zp {
            constructor(t) {
                this.id = Yp++, this.code = t, this.usedTimes = 0
            }
        }

        function $p(t, e, n, i, r, a, s) {
            const o = new Bc,
                l = new Kp,
                c = [],
                u = r.isWebGL2,
                h = r.logarithmicDepthBuffer,
                d = r.vertexTextures;
            let p = r.precision;
            const f = {
                MeshDepthMaterial: "depth",
                MeshDistanceMaterial: "distanceRGBA",
                MeshNormalMaterial: "normal",
                MeshBasicMaterial: "basic",
                MeshLambertMaterial: "lambert",
                MeshPhongMaterial: "phong",
                MeshToonMaterial: "toon",
                MeshStandardMaterial: "physical",
                MeshPhysicalMaterial: "physical",
                MeshMatcapMaterial: "matcap",
                LineBasicMaterial: "basic",
                LineDashedMaterial: "dashed",
                PointsMaterial: "points",
                ShadowMaterial: "shadow",
                SpriteMaterial: "sprite"
            };

            function m(t) {
                return 0 === t ? "uv" : `uv${t}`
            }
            return {
                getParameters: function(a, o, c, g, _) {
                    const v = g.fog,
                        x = _.geometry,
                        y = a.isMeshStandardMaterial ? g.environment : null,
                        M = (a.isMeshStandardMaterial ? n : e).get(a.envMap || y),
                        S = M && M.mapping === dl ? M.image.height : null,
                        E = f[a.type];
                    null !== a.precision && (p = r.getMaxPrecision(a.precision), p !== a.precision && console.warn("THREE.WebGLProgram.getParameters:", a.precision, "not supported, using", p, "instead."));
                    const T = x.morphAttributes.position || x.morphAttributes.normal || x.morphAttributes.color,
                        b = void 0 !== T ? T.length : 0;
                    let w, A, R, C, L = 0;
                    if (void 0 !== x.morphAttributes.position && (L = 1), void 0 !== x.morphAttributes.normal && (L = 2), void 0 !== x.morphAttributes.color && (L = 3), E) {
                        const t = Vh[E];
                        w = t.vertexShader, A = t.fragmentShader
                    } else w = a.vertexShader, A = a.fragmentShader, l.update(a), R = l.getVertexShaderID(a), C = l.getFragmentShaderID(a);
                    const P = t.getRenderTarget(),
                        U = !0 === _.isInstancedMesh,
                        D = !!a.map,
                        I = !!a.matcap,
                        O = !!M,
                        N = !!a.aoMap,
                        F = !!a.lightMap,
                        z = !!a.bumpMap,
                        B = !!a.normalMap,
                        k = !!a.displacementMap,
                        H = !!a.emissiveMap,
                        G = !!a.metalnessMap,
                        V = !!a.roughnessMap,
                        W = a.anisotropy > 0,
                        X = a.clearcoat > 0,
                        j = a.iridescence > 0,
                        q = a.sheen > 0,
                        Y = a.transmission > 0,
                        K = W && !!a.anisotropyMap,
                        Z = X && !!a.clearcoatMap,
                        $ = X && !!a.clearcoatNormalMap,
                        J = X && !!a.clearcoatRoughnessMap,
                        Q = j && !!a.iridescenceMap,
                        tt = j && !!a.iridescenceThicknessMap,
                        et = q && !!a.sheenColorMap,
                        nt = q && !!a.sheenRoughnessMap,
                        it = !!a.specularMap,
                        rt = !!a.specularColorMap,
                        at = !!a.specularIntensityMap,
                        st = Y && !!a.transmissionMap,
                        ot = Y && !!a.thicknessMap,
                        lt = !!a.gradientMap,
                        ct = !!a.alphaMap,
                        ut = a.alphaTest > 0,
                        ht = !!a.alphaHash,
                        dt = !!a.extensions,
                        pt = !!x.attributes.uv1,
                        ft = !!x.attributes.uv2,
                        mt = !!x.attributes.uv3;
                    let gt = rl;
                    return a.toneMapped && (null !== P && !0 !== P.isXRRenderTarget || (gt = t.toneMapping)), {
                        isWebGL2: u,
                        shaderID: E,
                        shaderType: a.type,
                        shaderName: a.name,
                        vertexShader: w,
                        fragmentShader: A,
                        defines: a.defines,
                        customVertexShaderID: R,
                        customFragmentShaderID: C,
                        isRawShaderMaterial: !0 === a.isRawShaderMaterial,
                        glslVersion: a.glslVersion,
                        precision: p,
                        instancing: U,
                        instancingColor: U && null !== _.instanceColor,
                        supportsVertexTextures: d,
                        outputColorSpace: null === P ? t.outputColorSpace : !0 === P.isXRRenderTarget ? P.texture.colorSpace : Nl,
                        map: D,
                        matcap: I,
                        envMap: O,
                        envMapMode: O && M.mapping,
                        envMapCubeUVHeight: S,
                        aoMap: N,
                        lightMap: F,
                        bumpMap: z,
                        normalMap: B,
                        displacementMap: d && k,
                        emissiveMap: H,
                        normalMapObjectSpace: B && 1 === a.normalMapType,
                        normalMapTangentSpace: B && 0 === a.normalMapType,
                        metalnessMap: G,
                        roughnessMap: V,
                        anisotropy: W,
                        anisotropyMap: K,
                        clearcoat: X,
                        clearcoatMap: Z,
                        clearcoatNormalMap: $,
                        clearcoatRoughnessMap: J,
                        iridescence: j,
                        iridescenceMap: Q,
                        iridescenceThicknessMap: tt,
                        sheen: q,
                        sheenColorMap: et,
                        sheenRoughnessMap: nt,
                        specularMap: it,
                        specularColorMap: rt,
                        specularIntensityMap: at,
                        transmission: Y,
                        transmissionMap: st,
                        thicknessMap: ot,
                        gradientMap: lt,
                        opaque: !1 === a.transparent && 1 === a.blending,
                        alphaMap: ct,
                        alphaTest: ut,
                        alphaHash: ht,
                        combine: a.combine,
                        mapUv: D && m(a.map.channel),
                        aoMapUv: N && m(a.aoMap.channel),
                        lightMapUv: F && m(a.lightMap.channel),
                        bumpMapUv: z && m(a.bumpMap.channel),
                        normalMapUv: B && m(a.normalMap.channel),
                        displacementMapUv: k && m(a.displacementMap.channel),
                        emissiveMapUv: H && m(a.emissiveMap.channel),
                        metalnessMapUv: G && m(a.metalnessMap.channel),
                        roughnessMapUv: V && m(a.roughnessMap.channel),
                        anisotropyMapUv: K && m(a.anisotropyMap.channel),
                        clearcoatMapUv: Z && m(a.clearcoatMap.channel),
                        clearcoatNormalMapUv: $ && m(a.clearcoatNormalMap.channel),
                        clearcoatRoughnessMapUv: J && m(a.clearcoatRoughnessMap.channel),
                        iridescenceMapUv: Q && m(a.iridescenceMap.channel),
                        iridescenceThicknessMapUv: tt && m(a.iridescenceThicknessMap.channel),
                        sheenColorMapUv: et && m(a.sheenColorMap.channel),
                        sheenRoughnessMapUv: nt && m(a.sheenRoughnessMap.channel),
                        specularMapUv: it && m(a.specularMap.channel),
                        specularColorMapUv: rt && m(a.specularColorMap.channel),
                        specularIntensityMapUv: at && m(a.specularIntensityMap.channel),
                        transmissionMapUv: st && m(a.transmissionMap.channel),
                        thicknessMapUv: ot && m(a.thicknessMap.channel),
                        alphaMapUv: ct && m(a.alphaMap.channel),
                        vertexTangents: !!x.attributes.tangent && (B || W),
                        vertexColors: a.vertexColors,
                        vertexAlphas: !0 === a.vertexColors && !!x.attributes.color && 4 === x.attributes.color.itemSize,
                        vertexUv1s: pt,
                        vertexUv2s: ft,
                        vertexUv3s: mt,
                        pointsUvs: !0 === _.isPoints && !!x.attributes.uv && (D || ct),
                        fog: !!v,
                        useFog: !0 === a.fog,
                        fogExp2: v && v.isFogExp2,
                        flatShading: !0 === a.flatShading,
                        sizeAttenuation: !0 === a.sizeAttenuation,
                        logarithmicDepthBuffer: h,
                        skinning: !0 === _.isSkinnedMesh,
                        morphTargets: void 0 !== x.morphAttributes.position,
                        morphNormals: void 0 !== x.morphAttributes.normal,
                        morphColors: void 0 !== x.morphAttributes.color,
                        morphTargetsCount: b,
                        morphTextureStride: L,
                        numDirLights: o.directional.length,
                        numPointLights: o.point.length,
                        numSpotLights: o.spot.length,
                        numSpotLightMaps: o.spotLightMap.length,
                        numRectAreaLights: o.rectArea.length,
                        numHemiLights: o.hemi.length,
                        numDirLightShadows: o.directionalShadowMap.length,
                        numPointLightShadows: o.pointShadowMap.length,
                        numSpotLightShadows: o.spotShadowMap.length,
                        numSpotLightShadowsWithMaps: o.numSpotLightShadowsWithMaps,
                        numClippingPlanes: s.numPlanes,
                        numClipIntersection: s.numIntersection,
                        dithering: a.dithering,
                        shadowMapEnabled: t.shadowMap.enabled && c.length > 0,
                        shadowMapType: t.shadowMap.type,
                        toneMapping: gt,
                        useLegacyLights: t._useLegacyLights,
                        decodeVideoTexture: D && !0 === a.map.isVideoTexture && a.map.colorSpace === Ol,
                        premultipliedAlpha: a.premultipliedAlpha,
                        doubleSided: 2 === a.side,
                        flipSided: 1 === a.side,
                        useDepthPacking: a.depthPacking >= 0,
                        depthPacking: a.depthPacking || 0,
                        index0AttributeName: a.index0AttributeName,
                        extensionDerivatives: dt && !0 === a.extensions.derivatives,
                        extensionFragDepth: dt && !0 === a.extensions.fragDepth,
                        extensionDrawBuffers: dt && !0 === a.extensions.drawBuffers,
                        extensionShaderTextureLOD: dt && !0 === a.extensions.shaderTextureLOD,
                        rendererExtensionFragDepth: u || i.has("EXT_frag_depth"),
                        rendererExtensionDrawBuffers: u || i.has("WEBGL_draw_buffers"),
                        rendererExtensionShaderTextureLod: u || i.has("EXT_shader_texture_lod"),
                        customProgramCacheKey: a.customProgramCacheKey()
                    }
                },
                getProgramCacheKey: function(e) {
                    const n = [];
                    if (e.shaderID ? n.push(e.shaderID) : (n.push(e.customVertexShaderID), n.push(e.customFragmentShaderID)), void 0 !== e.defines)
                        for (const t in e.defines) n.push(t), n.push(e.defines[t]);
                    return !1 === e.isRawShaderMaterial && (function(t, e) {
                        t.push(e.precision), t.push(e.outputColorSpace), t.push(e.envMapMode), t.push(e.envMapCubeUVHeight), t.push(e.mapUv), t.push(e.alphaMapUv), t.push(e.lightMapUv), t.push(e.aoMapUv), t.push(e.bumpMapUv), t.push(e.normalMapUv), t.push(e.displacementMapUv), t.push(e.emissiveMapUv), t.push(e.metalnessMapUv), t.push(e.roughnessMapUv), t.push(e.anisotropyMapUv), t.push(e.clearcoatMapUv), t.push(e.clearcoatNormalMapUv), t.push(e.clearcoatRoughnessMapUv), t.push(e.iridescenceMapUv), t.push(e.iridescenceThicknessMapUv), t.push(e.sheenColorMapUv), t.push(e.sheenRoughnessMapUv), t.push(e.specularMapUv), t.push(e.specularColorMapUv), t.push(e.specularIntensityMapUv), t.push(e.transmissionMapUv), t.push(e.thicknessMapUv), t.push(e.combine), t.push(e.fogExp2), t.push(e.sizeAttenuation), t.push(e.morphTargetsCount), t.push(e.morphAttributeCount), t.push(e.numDirLights), t.push(e.numPointLights), t.push(e.numSpotLights), t.push(e.numSpotLightMaps), t.push(e.numHemiLights), t.push(e.numRectAreaLights), t.push(e.numDirLightShadows), t.push(e.numPointLightShadows), t.push(e.numSpotLightShadows), t.push(e.numSpotLightShadowsWithMaps), t.push(e.shadowMapType), t.push(e.toneMapping), t.push(e.numClippingPlanes), t.push(e.numClipIntersection), t.push(e.depthPacking)
                    }(n, e), function(t, e) {
                        o.disableAll(), e.isWebGL2 && o.enable(0), e.supportsVertexTextures && o.enable(1), e.instancing && o.enable(2), e.instancingColor && o.enable(3), e.matcap && o.enable(4), e.envMap && o.enable(5), e.normalMapObjectSpace && o.enable(6), e.normalMapTangentSpace && o.enable(7), e.clearcoat && o.enable(8), e.iridescence && o.enable(9), e.alphaTest && o.enable(10), e.vertexColors && o.enable(11), e.vertexAlphas && o.enable(12), e.vertexUv1s && o.enable(13), e.vertexUv2s && o.enable(14), e.vertexUv3s && o.enable(15), e.vertexTangents && o.enable(16), e.anisotropy && o.enable(17), t.push(o.mask), o.disableAll(), e.fog && o.enable(0), e.useFog && o.enable(1), e.flatShading && o.enable(2), e.logarithmicDepthBuffer && o.enable(3), e.skinning && o.enable(4), e.morphTargets && o.enable(5), e.morphNormals && o.enable(6), e.morphColors && o.enable(7), e.premultipliedAlpha && o.enable(8), e.shadowMapEnabled && o.enable(9), e.useLegacyLights && o.enable(10), e.doubleSided && o.enable(11), e.flipSided && o.enable(12), e.useDepthPacking && o.enable(13), e.dithering && o.enable(14), e.transmission && o.enable(15), e.sheen && o.enable(16), e.opaque && o.enable(17), e.pointsUvs && o.enable(18), e.decodeVideoTexture && o.enable(19), t.push(o.mask)
                    }(n, e), n.push(t.outputColorSpace)), n.push(e.customProgramCacheKey), n.join()
                },
                getUniforms: function(t) {
                    const e = f[t.type];
                    let n;
                    if (e) {
                        const t = Vh[e];
                        n = Qu.clone(t.uniforms)
                    } else n = t.uniforms;
                    return n
                },
                acquireProgram: function(e, n) {
                    let i;
                    for (let t = 0, e = c.length; t < e; t++) {
                        const e = c[t];
                        if (e.cacheKey === n) {
                            i = e, ++i.usedTimes;
                            break
                        }
                    }
                    return void 0 === i && (i = new qp(t, n, e, a), c.push(i)), i
                },
                releaseProgram: function(t) {
                    if (0 == --t.usedTimes) {
                        const e = c.indexOf(t);
                        c[e] = c[c.length - 1], c.pop(), t.destroy()
                    }
                },
                releaseShaderCache: function(t) {
                    l.remove(t)
                },
                programs: c,
                dispose: function() {
                    l.dispose()
                }
            }
        }

        function Jp() {
            let t = new WeakMap;
            return {
                get: function(e) {
                    let n = t.get(e);
                    return void 0 === n && (n = {}, t.set(e, n)), n
                },
                remove: function(e) {
                    t.delete(e)
                },
                update: function(e, n, i) {
                    t.get(e)[n] = i
                },
                dispose: function() {
                    t = new WeakMap
                }
            }
        }

        function Qp(t, e) {
            return t.groupOrder !== e.groupOrder ? t.groupOrder - e.groupOrder : t.renderOrder !== e.renderOrder ? t.renderOrder - e.renderOrder : t.material.id !== e.material.id ? t.material.id - e.material.id : t.z !== e.z ? t.z - e.z : t.id - e.id
        }

        function tf(t, e) {
            return t.groupOrder !== e.groupOrder ? t.groupOrder - e.groupOrder : t.renderOrder !== e.renderOrder ? t.renderOrder - e.renderOrder : t.z !== e.z ? e.z - t.z : t.id - e.id
        }

        function ef() {
            const t = [];
            let e = 0;
            const n = [],
                i = [],
                r = [];

            function a(n, i, r, a, s, o) {
                let l = t[e];
                return void 0 === l ? (l = {
                    id: n.id,
                    object: n,
                    geometry: i,
                    material: r,
                    groupOrder: a,
                    renderOrder: n.renderOrder,
                    z: s,
                    group: o
                }, t[e] = l) : (l.id = n.id, l.object = n, l.geometry = i, l.material = r, l.groupOrder = a, l.renderOrder = n.renderOrder, l.z = s, l.group = o), e++, l
            }
            return {
                opaque: n,
                transmissive: i,
                transparent: r,
                init: function() {
                    e = 0, n.length = 0, i.length = 0, r.length = 0
                },
                push: function(t, e, s, o, l, c) {
                    const u = a(t, e, s, o, l, c);
                    s.transmission > 0 ? i.push(u) : !0 === s.transparent ? r.push(u) : n.push(u)
                },
                unshift: function(t, e, s, o, l, c) {
                    const u = a(t, e, s, o, l, c);
                    s.transmission > 0 ? i.unshift(u) : !0 === s.transparent ? r.unshift(u) : n.unshift(u)
                },
                finish: function() {
                    for (let n = e, i = t.length; n < i; n++) {
                        const e = t[n];
                        if (null === e.id) break;
                        e.id = null, e.object = null, e.geometry = null, e.material = null, e.group = null
                    }
                },
                sort: function(t, e) {
                    n.length > 1 && n.sort(t || Qp), i.length > 1 && i.sort(e || tf), r.length > 1 && r.sort(e || tf)
                }
            }
        }

        function nf() {
            let t = new WeakMap;
            return {
                get: function(e, n) {
                    const i = t.get(e);
                    let r;
                    return void 0 === i ? (r = new ef, t.set(e, [r])) : n >= i.length ? (r = new ef, i.push(r)) : r = i[n], r
                },
                dispose: function() {
                    t = new WeakMap
                }
            }
        }

        function rf() {
            const t = {};
            return {
                get: function(e) {
                    if (void 0 !== t[e.id]) return t[e.id];
                    let n;
                    switch (e.type) {
                        case "DirectionalLight":
                            n = {
                                direction: new bc,
                                color: new Mc
                            };
                            break;
                        case "SpotLight":
                            n = {
                                position: new bc,
                                direction: new bc,
                                color: new Mc,
                                distance: 0,
                                coneCos: 0,
                                penumbraCos: 0,
                                decay: 0
                            };
                            break;
                        case "PointLight":
                            n = {
                                position: new bc,
                                color: new Mc,
                                distance: 0,
                                decay: 0
                            };
                            break;
                        case "HemisphereLight":
                            n = {
                                direction: new bc,
                                skyColor: new Mc,
                                groundColor: new Mc
                            };
                            break;
                        case "RectAreaLight":
                            n = {
                                color: new Mc,
                                position: new bc,
                                halfWidth: new bc,
                                halfHeight: new bc
                            }
                    }
                    return t[e.id] = n, n
                }
            }
        }
        let af = 0;

        function sf(t, e) {
            return (e.castShadow ? 2 : 0) - (t.castShadow ? 2 : 0) + (e.map ? 1 : 0) - (t.map ? 1 : 0)
        }

        function of(t, e) {
            const n = new rf,
                i = function() {
                    const t = {};
                    return {
                        get: function(e) {
                            if (void 0 !== t[e.id]) return t[e.id];
                            let n;
                            switch (e.type) {
                                case "DirectionalLight":
                                case "SpotLight":
                                    n = {
                                        shadowBias: 0,
                                        shadowNormalBias: 0,
                                        shadowRadius: 1,
                                        shadowMapSize: new Ql
                                    };
                                    break;
                                case "PointLight":
                                    n = {
                                        shadowBias: 0,
                                        shadowNormalBias: 0,
                                        shadowRadius: 1,
                                        shadowMapSize: new Ql,
                                        shadowCameraNear: 1,
                                        shadowCameraFar: 1e3
                                    }
                            }
                            return t[e.id] = n, n
                        }
                    }
                }(),
                r = {
                    version: 0,
                    hash: {
                        directionalLength: -1,
                        pointLength: -1,
                        spotLength: -1,
                        rectAreaLength: -1,
                        hemiLength: -1,
                        numDirectionalShadows: -1,
                        numPointShadows: -1,
                        numSpotShadows: -1,
                        numSpotMaps: -1
                    },
                    ambient: [0, 0, 0],
                    probe: [],
                    directional: [],
                    directionalShadow: [],
                    directionalShadowMap: [],
                    directionalShadowMatrix: [],
                    spot: [],
                    spotLightMap: [],
                    spotShadow: [],
                    spotShadowMap: [],
                    spotLightMatrix: [],
                    rectArea: [],
                    rectAreaLTC1: null,
                    rectAreaLTC2: null,
                    point: [],
                    pointShadow: [],
                    pointShadowMap: [],
                    pointShadowMatrix: [],
                    hemi: [],
                    numSpotLightShadowsWithMaps: 0
                };
            for (let t = 0; t < 9; t++) r.probe.push(new bc);
            const a = new bc,
                s = new Rc,
                o = new Rc;
            return {
                setup: function(a, s) {
                    let o = 0,
                        l = 0,
                        c = 0;
                    for (let t = 0; t < 9; t++) r.probe[t].set(0, 0, 0);
                    let u = 0,
                        h = 0,
                        d = 0,
                        p = 0,
                        f = 0,
                        m = 0,
                        g = 0,
                        _ = 0,
                        v = 0,
                        x = 0;
                    a.sort(sf);
                    const y = !0 === s ? Math.PI : 1;
                    for (let t = 0, e = a.length; t < e; t++) {
                        const e = a[t],
                            s = e.color,
                            M = e.intensity,
                            S = e.distance,
                            E = e.shadow && e.shadow.map ? e.shadow.map.texture : null;
                        if (e.isAmbientLight) o += s.r * M * y, l += s.g * M * y, c += s.b * M * y;
                        else if (e.isLightProbe)
                            for (let t = 0; t < 9; t++) r.probe[t].addScaledVector(e.sh.coefficients[t], M);
                        else if (e.isDirectionalLight) {
                            const t = n.get(e);
                            if (t.color.copy(e.color).multiplyScalar(e.intensity * y), e.castShadow) {
                                const t = e.shadow,
                                    n = i.get(e);
                                n.shadowBias = t.bias, n.shadowNormalBias = t.normalBias, n.shadowRadius = t.radius, n.shadowMapSize = t.mapSize, r.directionalShadow[u] = n, r.directionalShadowMap[u] = E, r.directionalShadowMatrix[u] = e.shadow.matrix, m++
                            }
                            r.directional[u] = t, u++
                        } else if (e.isSpotLight) {
                            const t = n.get(e);
                            t.position.setFromMatrixPosition(e.matrixWorld), t.color.copy(s).multiplyScalar(M * y), t.distance = S, t.coneCos = Math.cos(e.angle), t.penumbraCos = Math.cos(e.angle * (1 - e.penumbra)), t.decay = e.decay, r.spot[d] = t;
                            const a = e.shadow;
                            if (e.map && (r.spotLightMap[v] = e.map, v++, a.updateMatrices(e), e.castShadow && x++), r.spotLightMatrix[d] = a.matrix, e.castShadow) {
                                const t = i.get(e);
                                t.shadowBias = a.bias, t.shadowNormalBias = a.normalBias, t.shadowRadius = a.radius, t.shadowMapSize = a.mapSize, r.spotShadow[d] = t, r.spotShadowMap[d] = E, _++
                            }
                            d++
                        } else if (e.isRectAreaLight) {
                            const t = n.get(e);
                            t.color.copy(s).multiplyScalar(M), t.halfWidth.set(.5 * e.width, 0, 0), t.halfHeight.set(0, .5 * e.height, 0), r.rectArea[p] = t, p++
                        } else if (e.isPointLight) {
                            const t = n.get(e);
                            if (t.color.copy(e.color).multiplyScalar(e.intensity * y), t.distance = e.distance, t.decay = e.decay, e.castShadow) {
                                const t = e.shadow,
                                    n = i.get(e);
                                n.shadowBias = t.bias, n.shadowNormalBias = t.normalBias, n.shadowRadius = t.radius, n.shadowMapSize = t.mapSize, n.shadowCameraNear = t.camera.near, n.shadowCameraFar = t.camera.far, r.pointShadow[h] = n, r.pointShadowMap[h] = E, r.pointShadowMatrix[h] = e.shadow.matrix, g++
                            }
                            r.point[h] = t, h++
                        } else if (e.isHemisphereLight) {
                            const t = n.get(e);
                            t.skyColor.copy(e.color).multiplyScalar(M * y), t.groundColor.copy(e.groundColor).multiplyScalar(M * y), r.hemi[f] = t, f++
                        }
                    }
                    p > 0 && (e.isWebGL2 || !0 === t.has("OES_texture_float_linear") ? (r.rectAreaLTC1 = Gh.LTC_FLOAT_1, r.rectAreaLTC2 = Gh.LTC_FLOAT_2) : !0 === t.has("OES_texture_half_float_linear") ? (r.rectAreaLTC1 = Gh.LTC_HALF_1, r.rectAreaLTC2 = Gh.LTC_HALF_2) : console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")), r.ambient[0] = o, r.ambient[1] = l, r.ambient[2] = c;
                    const M = r.hash;
                    M.directionalLength === u && M.pointLength === h && M.spotLength === d && M.rectAreaLength === p && M.hemiLength === f && M.numDirectionalShadows === m && M.numPointShadows === g && M.numSpotShadows === _ && M.numSpotMaps === v || (r.directional.length = u, r.spot.length = d, r.rectArea.length = p, r.point.length = h, r.hemi.length = f, r.directionalShadow.length = m, r.directionalShadowMap.length = m, r.pointShadow.length = g, r.pointShadowMap.length = g, r.spotShadow.length = _, r.spotShadowMap.length = _, r.directionalShadowMatrix.length = m, r.pointShadowMatrix.length = g, r.spotLightMatrix.length = _ + v - x, r.spotLightMap.length = v, r.numSpotLightShadowsWithMaps = x, M.directionalLength = u, M.pointLength = h, M.spotLength = d, M.rectAreaLength = p, M.hemiLength = f, M.numDirectionalShadows = m, M.numPointShadows = g, M.numSpotShadows = _, M.numSpotMaps = v, r.version = af++)
                },
                setupView: function(t, e) {
                    let n = 0,
                        i = 0,
                        l = 0,
                        c = 0,
                        u = 0;
                    const h = e.matrixWorldInverse;
                    for (let e = 0, d = t.length; e < d; e++) {
                        const d = t[e];
                        if (d.isDirectionalLight) {
                            const t = r.directional[n];
                            t.direction.setFromMatrixPosition(d.matrixWorld), a.setFromMatrixPosition(d.target.matrixWorld), t.direction.sub(a), t.direction.transformDirection(h), n++
                        } else if (d.isSpotLight) {
                            const t = r.spot[l];
                            t.position.setFromMatrixPosition(d.matrixWorld), t.position.applyMatrix4(h), t.direction.setFromMatrixPosition(d.matrixWorld), a.setFromMatrixPosition(d.target.matrixWorld), t.direction.sub(a), t.direction.transformDirection(h), l++
                        } else if (d.isRectAreaLight) {
                            const t = r.rectArea[c];
                            t.position.setFromMatrixPosition(d.matrixWorld), t.position.applyMatrix4(h), o.identity(), s.copy(d.matrixWorld), s.premultiply(h), o.extractRotation(s), t.halfWidth.set(.5 * d.width, 0, 0), t.halfHeight.set(0, .5 * d.height, 0), t.halfWidth.applyMatrix4(o), t.halfHeight.applyMatrix4(o), c++
                        } else if (d.isPointLight) {
                            const t = r.point[i];
                            t.position.setFromMatrixPosition(d.matrixWorld), t.position.applyMatrix4(h), i++
                        } else if (d.isHemisphereLight) {
                            const t = r.hemi[u];
                            t.direction.setFromMatrixPosition(d.matrixWorld), t.direction.transformDirection(h), u++
                        }
                    }
                },
                state: r
            }
        }

        function lf(t, e) {
            const n = new of(t, e),
                i = [],
                r = [];
            return {
                init: function() {
                    i.length = 0, r.length = 0
                },
                state: {
                    lightsArray: i,
                    shadowsArray: r,
                    lights: n
                },
                setupLights: function(t) {
                    n.setup(i, t)
                },
                setupLightsView: function(t) {
                    n.setupView(i, t)
                },
                pushLight: function(t) {
                    i.push(t)
                },
                pushShadow: function(t) {
                    r.push(t)
                }
            }
        }

        function cf(t, e) {
            let n = new WeakMap;
            return {
                get: function(i, r = 0) {
                    const a = n.get(i);
                    let s;
                    return void 0 === a ? (s = new lf(t, e), n.set(i, [s])) : r >= a.length ? (s = new lf(t, e), a.push(s)) : s = a[r], s
                },
                dispose: function() {
                    n = new WeakMap
                }
            }
        }
        class uf extends Ku {
            constructor(t) {
                super(), this.isMeshDepthMaterial = !0, this.type = "MeshDepthMaterial", this.depthPacking = 3200, this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.wireframe = !1, this.wireframeLinewidth = 1, this.setValues(t)
            }
            copy(t) {
                return super.copy(t), this.depthPacking = t.depthPacking, this.map = t.map, this.alphaMap = t.alphaMap, this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this.wireframe = t.wireframe, this.wireframeLinewidth = t.wireframeLinewidth, this
            }
        }
        class hf extends Ku {
            constructor(t) {
                super(), this.isMeshDistanceMaterial = !0, this.type = "MeshDistanceMaterial", this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.setValues(t)
            }
            copy(t) {
                return super.copy(t), this.map = t.map, this.alphaMap = t.alphaMap, this.displacementMap = t.displacementMap, this.displacementScale = t.displacementScale, this.displacementBias = t.displacementBias, this
            }
        }

        function df(t, e, n) {
            let i = new Ru;
            const r = new Ql,
                a = new Ql,
                s = new Cu,
                o = new uf({
                    depthPacking: 3201
                }),
                l = new hf,
                c = {},
                u = n.maxTextureSize,
                h = {
                    0: 1,
                    1: 0,
                    2: 2
                },
                d = new th({
                    defines: {
                        VSM_SAMPLES: 8
                    },
                    uniforms: {
                        shadow_pass: {
                            value: null
                        },
                        resolution: {
                            value: new Ql
                        },
                        radius: {
                            value: 4
                        }
                    },
                    vertexShader: "\nvoid main() {\n\n\tgl_Position = vec4( position, 1.0 );\n\n}\n",
                    fragmentShader: "\nuniform sampler2D shadow_pass;\nuniform vec2 resolution;\nuniform float radius;\n\n#include <packing>\n\nvoid main() {\n\n\tconst float samples = float( VSM_SAMPLES );\n\n\tfloat mean = 0.0;\n\tfloat squared_mean = 0.0;\n\n\tfloat uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );\n\tfloat uvStart = samples <= 1.0 ? 0.0 : - 1.0;\n\tfor ( float i = 0.0; i < samples; i ++ ) {\n\n\t\tfloat uvOffset = uvStart + i * uvStride;\n\n\t\t#ifdef HORIZONTAL_PASS\n\n\t\t\tvec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );\n\t\t\tmean += distribution.x;\n\t\t\tsquared_mean += distribution.y * distribution.y + distribution.x * distribution.x;\n\n\t\t#else\n\n\t\t\tfloat depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );\n\t\t\tmean += depth;\n\t\t\tsquared_mean += depth * depth;\n\n\t\t#endif\n\n\t}\n\n\tmean = mean / samples;\n\tsquared_mean = squared_mean / samples;\n\n\tfloat std_dev = sqrt( squared_mean - mean * mean );\n\n\tgl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );\n\n}\n"
                }),
                p = d.clone();
            p.defines.HORIZONTAL_PASS = 1;
            const f = new Xu;
            f.setAttribute("position", new Iu(new Float32Array([-1, -1, .5, 3, -1, .5, -1, 3, .5]), 3));
            const m = new Bh(f, d),
                g = this;
            this.enabled = !1, this.autoUpdate = !0, this.needsUpdate = !1, this.type = $o;
            let _ = this.type;

            function v(n, i) {
                const a = e.update(m);
                d.defines.VSM_SAMPLES !== n.blurSamples && (d.defines.VSM_SAMPLES = n.blurSamples, p.defines.VSM_SAMPLES = n.blurSamples, d.needsUpdate = !0, p.needsUpdate = !0), null === n.mapPass && (n.mapPass = new $h(r.x, r.y)), d.uniforms.shadow_pass.value = n.map.texture, d.uniforms.resolution.value = n.mapSize, d.uniforms.radius.value = n.radius, t.setRenderTarget(n.mapPass), t.clear(), t.renderBufferDirect(i, null, a, d, m, null), p.uniforms.shadow_pass.value = n.mapPass.texture, p.uniforms.resolution.value = n.mapSize, p.uniforms.radius.value = n.radius, t.setRenderTarget(n.map), t.clear(), t.renderBufferDirect(i, null, a, p, m, null)
            }

            function x(e, n, i, r) {
                let a = null;
                const s = !0 === i.isPointLight ? e.customDistanceMaterial : e.customDepthMaterial;
                if (void 0 !== s) a = s;
                else if (a = !0 === i.isPointLight ? l : o, t.localClippingEnabled && !0 === n.clipShadows && Array.isArray(n.clippingPlanes) && 0 !== n.clippingPlanes.length || n.displacementMap && 0 !== n.displacementScale || n.alphaMap && n.alphaTest > 0 || n.map && n.alphaTest > 0) {
                    const t = a.uuid,
                        e = n.uuid;
                    let i = c[t];
                    void 0 === i && (i = {}, c[t] = i);
                    let r = i[e];
                    void 0 === r && (r = a.clone(), i[e] = r), a = r
                }
                return a.visible = n.visible, a.wireframe = n.wireframe, a.side = r === Qo ? null !== n.shadowSide ? n.shadowSide : n.side : null !== n.shadowSide ? n.shadowSide : h[n.side], a.alphaMap = n.alphaMap, a.alphaTest = n.alphaTest, a.map = n.map, a.clipShadows = n.clipShadows, a.clippingPlanes = n.clippingPlanes, a.clipIntersection = n.clipIntersection, a.displacementMap = n.displacementMap, a.displacementScale = n.displacementScale, a.displacementBias = n.displacementBias, a.wireframeLinewidth = n.wireframeLinewidth, a.linewidth = n.linewidth, !0 === i.isPointLight && !0 === a.isMeshDistanceMaterial && (t.properties.get(a).light = i), a
            }

            function y(n, r, a, s, o) {
                if (!1 === n.visible) return;
                if (n.layers.test(r.layers) && (n.isMesh || n.isLine || n.isPoints) && (n.castShadow || n.receiveShadow && o === Qo) && (!n.frustumCulled || i.intersectsObject(n))) {
                    n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse, n.matrixWorld);
                    const i = e.update(n),
                        r = n.material;
                    if (Array.isArray(r)) {
                        const e = i.groups;
                        for (let l = 0, c = e.length; l < c; l++) {
                            const c = e[l],
                                u = r[c.materialIndex];
                            if (u && u.visible) {
                                const e = x(n, u, s, o);
                                t.renderBufferDirect(a, null, i, e, n, c)
                            }
                        }
                    } else if (r.visible) {
                        const e = x(n, r, s, o);
                        t.renderBufferDirect(a, null, i, e, n, null)
                    }
                }
                const l = n.children;
                for (let t = 0, e = l.length; t < e; t++) y(l[t], r, a, s, o)
            }
            this.render = function(e, n, o) {
                if (!1 === g.enabled) return;
                if (!1 === g.autoUpdate && !1 === g.needsUpdate) return;
                if (0 === e.length) return;
                const l = t.getRenderTarget(),
                    c = t.getActiveCubeFace(),
                    h = t.getActiveMipmapLevel(),
                    d = t.state;
                d.setBlending(0), d.buffers.color.setClear(1, 1, 1, 1), d.buffers.depth.setTest(!0), d.setScissorTest(!1);
                const p = _ !== Qo && this.type === Qo,
                    f = _ === Qo && this.type !== Qo;
                for (let l = 0, c = e.length; l < c; l++) {
                    const c = e[l],
                        h = c.shadow;
                    if (void 0 === h) {
                        console.warn("THREE.WebGLShadowMap:", c, "has no shadow.");
                        continue
                    }
                    if (!1 === h.autoUpdate && !1 === h.needsUpdate) continue;
                    r.copy(h.mapSize);
                    const m = h.getFrameExtents();
                    if (r.multiply(m), a.copy(h.mapSize), (r.x > u || r.y > u) && (r.x > u && (a.x = Math.floor(u / m.x), r.x = a.x * m.x, h.mapSize.x = a.x), r.y > u && (a.y = Math.floor(u / m.y), r.y = a.y * m.y, h.mapSize.y = a.y)), null === h.map || !0 === p || !0 === f) {
                        const t = this.type !== Qo ? {
                            minFilter: gl,
                            magFilter: gl
                        } : {};
                        null !== h.map && h.map.dispose(), h.map = new $h(r.x, r.y, t), h.map.texture.name = c.name + ".shadowMap", h.camera.updateProjectionMatrix()
                    }
                    t.setRenderTarget(h.map), t.clear();
                    const g = h.getViewportCount();
                    for (let t = 0; t < g; t++) {
                        const e = h.getViewport(t);
                        s.set(a.x * e.x, a.y * e.y, a.x * e.z, a.y * e.w), d.viewport(s), h.updateMatrices(c, t), i = h.getFrustum(), y(n, o, h.camera, c, this.type)
                    }!0 !== h.isPointLightShadow && this.type === Qo && v(h, o), h.needsUpdate = !1
                }
                _ = this.type, g.needsUpdate = !1, t.setRenderTarget(l, c, h)
            }
        }

        function pf(t, e, n) {
            const i = n.isWebGL2,
                r = new function() {
                    let e = !1;
                    const n = new Cu;
                    let i = null;
                    const r = new Cu(0, 0, 0, 0);
                    return {
                        setMask: function(n) {
                            i === n || e || (t.colorMask(n, n, n, n), i = n)
                        },
                        setLocked: function(t) {
                            e = t
                        },
                        setClear: function(e, i, a, s, o) {
                            !0 === o && (e *= s, i *= s, a *= s), n.set(e, i, a, s), !1 === r.equals(n) && (t.clearColor(e, i, a, s), r.copy(n))
                        },
                        reset: function() {
                            e = !1, i = null, r.set(-1, 0, 0, 0)
                        }
                    }
                },
                a = new function() {
                    let e = !1,
                        n = null,
                        i = null,
                        r = null;
                    return {
                        setTest: function(e) {
                            e ? k(t.DEPTH_TEST) : H(t.DEPTH_TEST)
                        },
                        setMask: function(i) {
                            n === i || e || (t.depthMask(i), n = i)
                        },
                        setFunc: function(e) {
                            if (i !== e) {
                                switch (e) {
                                    case 0:
                                        t.depthFunc(t.NEVER);
                                        break;
                                    case 1:
                                        t.depthFunc(t.ALWAYS);
                                        break;
                                    case 2:
                                        t.depthFunc(t.LESS);
                                        break;
                                    case 3:
                                    default:
                                        t.depthFunc(t.LEQUAL);
                                        break;
                                    case 4:
                                        t.depthFunc(t.EQUAL);
                                        break;
                                    case 5:
                                        t.depthFunc(t.GEQUAL);
                                        break;
                                    case 6:
                                        t.depthFunc(t.GREATER);
                                        break;
                                    case 7:
                                        t.depthFunc(t.NOTEQUAL)
                                }
                                i = e
                            }
                        },
                        setLocked: function(t) {
                            e = t
                        },
                        setClear: function(e) {
                            r !== e && (t.clearDepth(e), r = e)
                        },
                        reset: function() {
                            e = !1, n = null, i = null, r = null
                        }
                    }
                },
                s = new function() {
                    let e = !1,
                        n = null,
                        i = null,
                        r = null,
                        a = null,
                        s = null,
                        o = null,
                        l = null,
                        c = null;
                    return {
                        setTest: function(n) {
                            e || (n ? k(t.STENCIL_TEST) : H(t.STENCIL_TEST))
                        },
                        setMask: function(i) {
                            n === i || e || (t.stencilMask(i), n = i)
                        },
                        setFunc: function(e, n, s) {
                            i === e && r === n && a === s || (t.stencilFunc(e, n, s), i = e, r = n, a = s)
                        },
                        setOp: function(e, n, i) {
                            s === e && o === n && l === i || (t.stencilOp(e, n, i), s = e, o = n, l = i)
                        },
                        setLocked: function(t) {
                            e = t
                        },
                        setClear: function(e) {
                            c !== e && (t.clearStencil(e), c = e)
                        },
                        reset: function() {
                            e = !1, n = null, i = null, r = null, a = null, s = null, o = null, l = null, c = null
                        }
                    }
                },
                o = new WeakMap,
                l = new WeakMap;
            let c = {},
                u = {},
                h = new WeakMap,
                d = [],
                p = null,
                f = !1,
                m = null,
                g = null,
                _ = null,
                v = null,
                x = null,
                y = null,
                M = null,
                S = !1,
                E = null,
                T = null,
                b = null,
                w = null,
                A = null;
            const R = t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
            let C = !1,
                L = 0;
            const P = t.getParameter(t.VERSION); - 1 !== P.indexOf("WebGL") ? (L = parseFloat(/^WebGL (\d)/.exec(P)[1]), C = L >= 1) : -1 !== P.indexOf("OpenGL ES") && (L = parseFloat(/^OpenGL ES (\d)/.exec(P)[1]), C = L >= 2);
            let U = null,
                D = {};
            const I = t.getParameter(t.SCISSOR_BOX),
                O = t.getParameter(t.VIEWPORT),
                N = (new Cu).fromArray(I),
                F = (new Cu).fromArray(O);

            function z(e, n, r, a) {
                const s = new Uint8Array(4),
                    o = t.createTexture();
                t.bindTexture(e, o), t.texParameteri(e, t.TEXTURE_MIN_FILTER, t.NEAREST), t.texParameteri(e, t.TEXTURE_MAG_FILTER, t.NEAREST);
                for (let o = 0; o < r; o++) !i || e !== t.TEXTURE_3D && e !== t.TEXTURE_2D_ARRAY ? t.texImage2D(n + o, 0, t.RGBA, 1, 1, 0, t.RGBA, t.UNSIGNED_BYTE, s) : t.texImage3D(n, 0, t.RGBA, 1, 1, a, 0, t.RGBA, t.UNSIGNED_BYTE, s);
                return o
            }
            const B = {};

            function k(e) {
                !0 !== c[e] && (t.enable(e), c[e] = !0)
            }

            function H(e) {
                !1 !== c[e] && (t.disable(e), c[e] = !1)
            }
            B[t.TEXTURE_2D] = z(t.TEXTURE_2D, t.TEXTURE_2D, 1), B[t.TEXTURE_CUBE_MAP] = z(t.TEXTURE_CUBE_MAP, t.TEXTURE_CUBE_MAP_POSITIVE_X, 6), i && (B[t.TEXTURE_2D_ARRAY] = z(t.TEXTURE_2D_ARRAY, t.TEXTURE_2D_ARRAY, 1, 1), B[t.TEXTURE_3D] = z(t.TEXTURE_3D, t.TEXTURE_3D, 1, 1)), r.setClear(0, 0, 0, 1), a.setClear(1), s.setClear(0), k(t.DEPTH_TEST), a.setFunc(3), X(!1), j(1), k(t.CULL_FACE), W(0);
            const G = {
                [tl]: t.FUNC_ADD,
                101: t.FUNC_SUBTRACT,
                102: t.FUNC_REVERSE_SUBTRACT
            };
            if (i) G[103] = t.MIN, G[104] = t.MAX;
            else {
                const t = e.get("EXT_blend_minmax");
                null !== t && (G[103] = t.MIN_EXT, G[104] = t.MAX_EXT)
            }
            const V = {
                200: t.ZERO,
                201: t.ONE,
                202: t.SRC_COLOR,
                204: t.SRC_ALPHA,
                210: t.SRC_ALPHA_SATURATE,
                208: t.DST_COLOR,
                206: t.DST_ALPHA,
                203: t.ONE_MINUS_SRC_COLOR,
                205: t.ONE_MINUS_SRC_ALPHA,
                209: t.ONE_MINUS_DST_COLOR,
                207: t.ONE_MINUS_DST_ALPHA
            };

            function W(e, n, i, r, a, s, o, l) {
                if (0 !== e) {
                    if (!1 === f && (k(t.BLEND), f = !0), 5 === e) a = a || n, s = s || i, o = o || r, n === g && a === x || (t.blendEquationSeparate(G[n], G[a]), g = n, x = a), i === _ && r === v && s === y && o === M || (t.blendFuncSeparate(V[i], V[r], V[s], V[o]), _ = i, v = r, y = s, M = o), m = e, S = !1;
                    else if (e !== m || l !== S) {
                        if (g === tl && x === tl || (t.blendEquation(t.FUNC_ADD), g = tl, x = tl), l) switch (e) {
                            case 1:
                                t.blendFuncSeparate(t.ONE, t.ONE_MINUS_SRC_ALPHA, t.ONE, t.ONE_MINUS_SRC_ALPHA);
                                break;
                            case 2:
                                t.blendFunc(t.ONE, t.ONE);
                                break;
                            case 3:
                                t.blendFuncSeparate(t.ZERO, t.ONE_MINUS_SRC_COLOR, t.ZERO, t.ONE);
                                break;
                            case 4:
                                t.blendFuncSeparate(t.ZERO, t.SRC_COLOR, t.ZERO, t.SRC_ALPHA);
                                break;
                            default:
                                console.error("THREE.WebGLState: Invalid blending: ", e)
                        } else switch (e) {
                            case 1:
                                t.blendFuncSeparate(t.SRC_ALPHA, t.ONE_MINUS_SRC_ALPHA, t.ONE, t.ONE_MINUS_SRC_ALPHA);
                                break;
                            case 2:
                                t.blendFunc(t.SRC_ALPHA, t.ONE);
                                break;
                            case 3:
                                t.blendFuncSeparate(t.ZERO, t.ONE_MINUS_SRC_COLOR, t.ZERO, t.ONE);
                                break;
                            case 4:
                                t.blendFunc(t.ZERO, t.SRC_COLOR);
                                break;
                            default:
                                console.error("THREE.WebGLState: Invalid blending: ", e)
                        }
                        _ = null, v = null, y = null, M = null, m = e, S = l
                    }
                } else !0 === f && (H(t.BLEND), f = !1)
            }

            function X(e) {
                E !== e && (e ? t.frontFace(t.CW) : t.frontFace(t.CCW), E = e)
            }

            function j(e) {
                0 !== e ? (k(t.CULL_FACE), e !== T && (1 === e ? t.cullFace(t.BACK) : 2 === e ? t.cullFace(t.FRONT) : t.cullFace(t.FRONT_AND_BACK))) : H(t.CULL_FACE), T = e
            }

            function q(e, n, i) {
                e ? (k(t.POLYGON_OFFSET_FILL), w === n && A === i || (t.polygonOffset(n, i), w = n, A = i)) : H(t.POLYGON_OFFSET_FILL)
            }
            return {
                buffers: {
                    color: r,
                    depth: a,
                    stencil: s
                },
                enable: k,
                disable: H,
                bindFramebuffer: function(e, n) {
                    return u[e] !== n && (t.bindFramebuffer(e, n), u[e] = n, i && (e === t.DRAW_FRAMEBUFFER && (u[t.FRAMEBUFFER] = n), e === t.FRAMEBUFFER && (u[t.DRAW_FRAMEBUFFER] = n)), !0)
                },
                drawBuffers: function(i, r) {
                    let a = d,
                        s = !1;
                    if (i)
                        if (a = h.get(r), void 0 === a && (a = [], h.set(r, a)), i.isWebGLMultipleRenderTargets) {
                            const e = i.texture;
                            if (a.length !== e.length || a[0] !== t.COLOR_ATTACHMENT0) {
                                for (let n = 0, i = e.length; n < i; n++) a[n] = t.COLOR_ATTACHMENT0 + n;
                                a.length = e.length, s = !0
                            }
                        } else a[0] !== t.COLOR_ATTACHMENT0 && (a[0] = t.COLOR_ATTACHMENT0, s = !0);
                    else a[0] !== t.BACK && (a[0] = t.BACK, s = !0);
                    s && (n.isWebGL2 ? t.drawBuffers(a) : e.get("WEBGL_draw_buffers").drawBuffersWEBGL(a))
                },
                useProgram: function(e) {
                    return p !== e && (t.useProgram(e), p = e, !0)
                },
                setBlending: W,
                setMaterial: function(e, n) {
                    2 === e.side ? H(t.CULL_FACE) : k(t.CULL_FACE);
                    let i = 1 === e.side;
                    n && (i = !i), X(i), 1 === e.blending && !1 === e.transparent ? W(0) : W(e.blending, e.blendEquation, e.blendSrc, e.blendDst, e.blendEquationAlpha, e.blendSrcAlpha, e.blendDstAlpha, e.premultipliedAlpha), a.setFunc(e.depthFunc), a.setTest(e.depthTest), a.setMask(e.depthWrite), r.setMask(e.colorWrite);
                    const o = e.stencilWrite;
                    s.setTest(o), o && (s.setMask(e.stencilWriteMask), s.setFunc(e.stencilFunc, e.stencilRef, e.stencilFuncMask), s.setOp(e.stencilFail, e.stencilZFail, e.stencilZPass)), q(e.polygonOffset, e.polygonOffsetFactor, e.polygonOffsetUnits), !0 === e.alphaToCoverage ? k(t.SAMPLE_ALPHA_TO_COVERAGE) : H(t.SAMPLE_ALPHA_TO_COVERAGE)
                },
                setFlipSided: X,
                setCullFace: j,
                setLineWidth: function(e) {
                    e !== b && (C && t.lineWidth(e), b = e)
                },
                setPolygonOffset: q,
                setScissorTest: function(e) {
                    e ? k(t.SCISSOR_TEST) : H(t.SCISSOR_TEST)
                },
                activeTexture: function(e) {
                    void 0 === e && (e = t.TEXTURE0 + R - 1), U !== e && (t.activeTexture(e), U = e)
                },
                bindTexture: function(e, n, i) {
                    void 0 === i && (i = null === U ? t.TEXTURE0 + R - 1 : U);
                    let r = D[i];
                    void 0 === r && (r = {
                        type: void 0,
                        texture: void 0
                    }, D[i] = r), r.type === e && r.texture === n || (U !== i && (t.activeTexture(i), U = i), t.bindTexture(e, n || B[e]), r.type = e, r.texture = n)
                },
                unbindTexture: function() {
                    const e = D[U];
                    void 0 !== e && void 0 !== e.type && (t.bindTexture(e.type, null), e.type = void 0, e.texture = void 0)
                },
                compressedTexImage2D: function() {
                    try {
                        t.compressedTexImage2D.apply(t, arguments)
                    } catch (t) {
                        console.error("THREE.WebGLState:", t)
                    }
                },
                compressedTexImage3D: function() {
                    try {
                        t.compressedTexImage3D.apply(t, arguments)
                    } catch (t) {
                        console.error("THREE.WebGLState:", t)
                    }
                },
                texImage2D: function() {
                    try {
                        t.texImage2D.apply(t, arguments)
                    } catch (t) {
                        console.error("THREE.WebGLState:", t)
                    }
                },
                texImage3D: function() {
                    try {
                        t.texImage3D.apply(t, arguments)
                    } catch (t) {
                        console.error("THREE.WebGLState:", t)
                    }
                },
                updateUBOMapping: function(e, n) {
                    let i = l.get(n);
                    void 0 === i && (i = new WeakMap, l.set(n, i));
                    let r = i.get(e);
                    void 0 === r && (r = t.getUniformBlockIndex(n, e.name), i.set(e, r))
                },
                uniformBlockBinding: function(e, n) {
                    const i = l.get(n).get(e);
                    o.get(n) !== i && (t.uniformBlockBinding(n, i, e.__bindingPointIndex), o.set(n, i))
                },
                texStorage2D: function() {
                    try {
                        t.texStorage2D.apply(t, arguments)
                    } catch (t) {
                        console.error("THREE.WebGLState:", t)
                    }
                },
                texStorage3D: function() {
                    try {
                        t.texStorage3D.apply(t, arguments)
                    } catch (t) {
                        console.error("THREE.WebGLState:", t)
                    }
                },
                texSubImage2D: function() {
                    try {
                        t.texSubImage2D.apply(t, arguments)
                    } catch (t) {
                        console.error("THREE.WebGLState:", t)
                    }
                },
                texSubImage3D: function() {
                    try {
                        t.texSubImage3D.apply(t, arguments)
                    } catch (t) {
                        console.error("THREE.WebGLState:", t)
                    }
                },
                compressedTexSubImage2D: function() {
                    try {
                        t.compressedTexSubImage2D.apply(t, arguments)
                    } catch (t) {
                        console.error("THREE.WebGLState:", t)
                    }
                },
                compressedTexSubImage3D: function() {
                    try {
                        t.compressedTexSubImage3D.apply(t, arguments)
                    } catch (t) {
                        console.error("THREE.WebGLState:", t)
                    }
                },
                scissor: function(e) {
                    !1 === N.equals(e) && (t.scissor(e.x, e.y, e.z, e.w), N.copy(e))
                },
                viewport: function(e) {
                    !1 === F.equals(e) && (t.viewport(e.x, e.y, e.z, e.w), F.copy(e))
                },
                reset: function() {
                    t.disable(t.BLEND), t.disable(t.CULL_FACE), t.disable(t.DEPTH_TEST), t.disable(t.POLYGON_OFFSET_FILL), t.disable(t.SCISSOR_TEST), t.disable(t.STENCIL_TEST), t.disable(t.SAMPLE_ALPHA_TO_COVERAGE), t.blendEquation(t.FUNC_ADD), t.blendFunc(t.ONE, t.ZERO), t.blendFuncSeparate(t.ONE, t.ZERO, t.ONE, t.ZERO), t.colorMask(!0, !0, !0, !0), t.clearColor(0, 0, 0, 0), t.depthMask(!0), t.depthFunc(t.LESS), t.clearDepth(1), t.stencilMask(4294967295), t.stencilFunc(t.ALWAYS, 0, 4294967295), t.stencilOp(t.KEEP, t.KEEP, t.KEEP), t.clearStencil(0), t.cullFace(t.BACK), t.frontFace(t.CCW), t.polygonOffset(0, 0), t.activeTexture(t.TEXTURE0), t.bindFramebuffer(t.FRAMEBUFFER, null), !0 === i && (t.bindFramebuffer(t.DRAW_FRAMEBUFFER, null), t.bindFramebuffer(t.READ_FRAMEBUFFER, null)), t.useProgram(null), t.lineWidth(1), t.scissor(0, 0, t.canvas.width, t.canvas.height), t.viewport(0, 0, t.canvas.width, t.canvas.height), c = {}, U = null, D = {}, u = {}, h = new WeakMap, d = [], p = null, f = !1, m = null, g = null, _ = null, v = null, x = null, y = null, M = null, S = !1, E = null, T = null, b = null, w = null, A = null, N.set(0, 0, t.canvas.width, t.canvas.height), F.set(0, 0, t.canvas.width, t.canvas.height), r.reset(), a.reset(), s.reset()
                }
            }
        }

        function ff(t, e, n, i, r, a, s) {
            const o = r.isWebGL2,
                l = r.maxTextures,
                c = r.maxCubemapSize,
                u = r.maxTextureSize,
                h = r.maxSamples,
                d = e.has("WEBGL_multisampled_render_to_texture") ? e.get("WEBGL_multisampled_render_to_texture") : null,
                p = "undefined" != typeof navigator && /OculusBrowser/g.test(navigator.userAgent),
                f = new WeakMap;
            let m;
            const g = new WeakMap;
            let _ = !1;
            try {
                _ = "undefined" != typeof OffscreenCanvas && null !== new OffscreenCanvas(1, 1).getContext("2d")
            } catch (t) {}

            function v(t, e) {
                return _ ? new OffscreenCanvas(t, e) : Xo("canvas")
            }

            function x(t, e, n, i) {
                let r = 1;
                if ((t.width > i || t.height > i) && (r = i / Math.max(t.width, t.height)), r < 1 || !0 === e) {
                    if ("undefined" != typeof HTMLImageElement && t instanceof HTMLImageElement || "undefined" != typeof HTMLCanvasElement && t instanceof HTMLCanvasElement || "undefined" != typeof ImageBitmap && t instanceof ImageBitmap) {
                        const i = e ? Zl : Math.floor,
                            a = i(r * t.width),
                            s = i(r * t.height);
                        void 0 === m && (m = v(a, s));
                        const o = n ? v(a, s) : m;
                        return o.width = a, o.height = s, o.getContext("2d").drawImage(t, 0, 0, a, s), console.warn("THREE.WebGLRenderer: Texture has been resized from (" + t.width + "x" + t.height + ") to (" + a + "x" + s + ")."), o
                    }
                    return "data" in t && console.warn("THREE.WebGLRenderer: Image in DataTexture is too big (" + t.width + "x" + t.height + ")."), t
                }
                return t
            }

            function y(t) {
                return Kl(t.width) && Kl(t.height)
            }

            function M(t, e) {
                return t.generateMipmaps && e && t.minFilter !== gl && t.minFilter !== vl
            }

            function S(e) {
                t.generateMipmap(e)
            }

            function E(n, i, r, a, s = !1) {
                if (!1 === o) return i;
                if (null !== n) {
                    if (void 0 !== t[n]) return t[n];
                    console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '" + n + "'")
                }
                let l = i;
                return i === t.RED && (r === t.FLOAT && (l = t.R32F), r === t.HALF_FLOAT && (l = t.R16F), r === t.UNSIGNED_BYTE && (l = t.R8)), i === t.RED_INTEGER && (r === t.UNSIGNED_BYTE && (l = t.R8UI), r === t.UNSIGNED_SHORT && (l = t.R16UI), r === t.UNSIGNED_INT && (l = t.R32UI), r === t.BYTE && (l = t.R8I), r === t.SHORT && (l = t.R16I), r === t.INT && (l = t.R32I)), i === t.RG && (r === t.FLOAT && (l = t.RG32F), r === t.HALF_FLOAT && (l = t.RG16F), r === t.UNSIGNED_BYTE && (l = t.RG8)), i === t.RGBA && (r === t.FLOAT && (l = t.RGBA32F), r === t.HALF_FLOAT && (l = t.RGBA16F), r === t.UNSIGNED_BYTE && (l = a === Ol && !1 === s ? t.SRGB8_ALPHA8 : t.RGBA8), r === t.UNSIGNED_SHORT_4_4_4_4 && (l = t.RGBA4), r === t.UNSIGNED_SHORT_5_5_5_1 && (l = t.RGB5_A1)), l !== t.R16F && l !== t.R32F && l !== t.RG16F && l !== t.RG32F && l !== t.RGBA16F && l !== t.RGBA32F || e.get("EXT_color_buffer_float"), l
            }

            function T(t, e, n) {
                return !0 === M(t, n) || t.isFramebufferTexture && t.minFilter !== gl && t.minFilter !== vl ? Math.log2(Math.max(e.width, e.height)) + 1 : void 0 !== t.mipmaps && t.mipmaps.length > 0 ? t.mipmaps.length : t.isCompressedTexture && Array.isArray(t.image) ? e.mipmaps.length : 1
            }

            function b(e) {
                return e === gl || 1004 === e || e === _l ? t.NEAREST : t.LINEAR
            }

            function w(t) {
                const e = t.target;
                e.removeEventListener("dispose", w),
                    function(t) {
                        const e = i.get(t);
                        if (void 0 === e.__webglInit) return;
                        const n = t.source,
                            r = g.get(n);
                        if (r) {
                            const i = r[e.__cacheKey];
                            i.usedTimes--, 0 === i.usedTimes && R(t), 0 === Object.keys(r).length && g.delete(n)
                        }
                        i.remove(t)
                    }(e), e.isVideoTexture && f.delete(e)
            }

            function A(e) {
                const n = e.target;
                n.removeEventListener("dispose", A),
                    function(e) {
                        const n = e.texture,
                            r = i.get(e),
                            a = i.get(n);
                        if (void 0 !== a.__webglTexture && (t.deleteTexture(a.__webglTexture), s.memory.textures--), e.depthTexture && e.depthTexture.dispose(), e.isWebGLCubeRenderTarget)
                            for (let e = 0; e < 6; e++) {
                                if (Array.isArray(r.__webglFramebuffer[e]))
                                    for (let n = 0; n < r.__webglFramebuffer[e].length; n++) t.deleteFramebuffer(r.__webglFramebuffer[e][n]);
                                else t.deleteFramebuffer(r.__webglFramebuffer[e]);
                                r.__webglDepthbuffer && t.deleteRenderbuffer(r.__webglDepthbuffer[e])
                            } else {
                                if (Array.isArray(r.__webglFramebuffer))
                                    for (let e = 0; e < r.__webglFramebuffer.length; e++) t.deleteFramebuffer(r.__webglFramebuffer[e]);
                                else t.deleteFramebuffer(r.__webglFramebuffer);
                                if (r.__webglDepthbuffer && t.deleteRenderbuffer(r.__webglDepthbuffer), r.__webglMultisampledFramebuffer && t.deleteFramebuffer(r.__webglMultisampledFramebuffer), r.__webglColorRenderbuffer)
                                    for (let e = 0; e < r.__webglColorRenderbuffer.length; e++) r.__webglColorRenderbuffer[e] && t.deleteRenderbuffer(r.__webglColorRenderbuffer[e]);
                                r.__webglDepthRenderbuffer && t.deleteRenderbuffer(r.__webglDepthRenderbuffer)
                            }
                        if (e.isWebGLMultipleRenderTargets)
                            for (let e = 0, r = n.length; e < r; e++) {
                                const r = i.get(n[e]);
                                r.__webglTexture && (t.deleteTexture(r.__webglTexture), s.memory.textures--), i.remove(n[e])
                            }
                        i.remove(n), i.remove(e)
                    }(n)
            }

            function R(e) {
                const n = i.get(e);
                t.deleteTexture(n.__webglTexture);
                const r = e.source;
                delete g.get(r)[n.__cacheKey], s.memory.textures--
            }
            let C = 0;

            function L(e, r) {
                const a = i.get(e);
                if (e.isVideoTexture && function(t) {
                        const e = s.render.frame;
                        f.get(t) !== e && (f.set(t, e), t.update())
                    }(e), !1 === e.isRenderTargetTexture && e.version > 0 && a.__version !== e.version) {
                    const t = e.image;
                    if (null === t) console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");
                    else {
                        if (!1 !== t.complete) return void N(a, e, r);
                        console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete")
                    }
                }
                n.bindTexture(t.TEXTURE_2D, a.__webglTexture, t.TEXTURE0 + r)
            }
            const P = {
                    [pl]: t.REPEAT,
                    [fl]: t.CLAMP_TO_EDGE,
                    [ml]: t.MIRRORED_REPEAT
                },
                U = {
                    [gl]: t.NEAREST,
                    1004: t.NEAREST_MIPMAP_NEAREST,
                    [_l]: t.NEAREST_MIPMAP_LINEAR,
                    [vl]: t.LINEAR,
                    1007: t.LINEAR_MIPMAP_NEAREST,
                    [xl]: t.LINEAR_MIPMAP_LINEAR
                },
                D = {
                    512: t.NEVER,
                    519: t.ALWAYS,
                    513: t.LESS,
                    515: t.LEQUAL,
                    514: t.EQUAL,
                    518: t.GEQUAL,
                    516: t.GREATER,
                    517: t.NOTEQUAL
                };

            function I(n, a, s) {
                if (s ? (t.texParameteri(n, t.TEXTURE_WRAP_S, P[a.wrapS]), t.texParameteri(n, t.TEXTURE_WRAP_T, P[a.wrapT]), n !== t.TEXTURE_3D && n !== t.TEXTURE_2D_ARRAY || t.texParameteri(n, t.TEXTURE_WRAP_R, P[a.wrapR]), t.texParameteri(n, t.TEXTURE_MAG_FILTER, U[a.magFilter]), t.texParameteri(n, t.TEXTURE_MIN_FILTER, U[a.minFilter])) : (t.texParameteri(n, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(n, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE), n !== t.TEXTURE_3D && n !== t.TEXTURE_2D_ARRAY || t.texParameteri(n, t.TEXTURE_WRAP_R, t.CLAMP_TO_EDGE), a.wrapS === fl && a.wrapT === fl || console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."), t.texParameteri(n, t.TEXTURE_MAG_FILTER, b(a.magFilter)), t.texParameteri(n, t.TEXTURE_MIN_FILTER, b(a.minFilter)), a.minFilter !== gl && a.minFilter !== vl && console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")), a.compareFunction && (t.texParameteri(n, t.TEXTURE_COMPARE_MODE, t.COMPARE_REF_TO_TEXTURE), t.texParameteri(n, t.TEXTURE_COMPARE_FUNC, D[a.compareFunction])), !0 === e.has("EXT_texture_filter_anisotropic")) {
                    const s = e.get("EXT_texture_filter_anisotropic");
                    if (a.magFilter === gl) return;
                    if (a.minFilter !== _l && a.minFilter !== xl) return;
                    if (a.type === El && !1 === e.has("OES_texture_float_linear")) return;
                    if (!1 === o && a.type === Tl && !1 === e.has("OES_texture_half_float_linear")) return;
                    (a.anisotropy > 1 || i.get(a).__currentAnisotropy) && (t.texParameterf(n, s.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(a.anisotropy, r.getMaxAnisotropy())), i.get(a).__currentAnisotropy = a.anisotropy)
                }
            }

            function O(e, n) {
                let i = !1;
                void 0 === e.__webglInit && (e.__webglInit = !0, n.addEventListener("dispose", w));
                const r = n.source;
                let a = g.get(r);
                void 0 === a && (a = {}, g.set(r, a));
                const o = function(t) {
                    const e = [];
                    return e.push(t.wrapS), e.push(t.wrapT), e.push(t.wrapR || 0), e.push(t.magFilter), e.push(t.minFilter), e.push(t.anisotropy), e.push(t.internalFormat), e.push(t.format), e.push(t.type), e.push(t.generateMipmaps), e.push(t.premultiplyAlpha), e.push(t.flipY), e.push(t.unpackAlignment), e.push(t.colorSpace), e.join()
                }(n);
                if (o !== e.__cacheKey) {
                    void 0 === a[o] && (a[o] = {
                        texture: t.createTexture(),
                        usedTimes: 0
                    }, s.memory.textures++, i = !0), a[o].usedTimes++;
                    const r = a[e.__cacheKey];
                    void 0 !== r && (a[e.__cacheKey].usedTimes--, 0 === r.usedTimes && R(n)), e.__cacheKey = o, e.__webglTexture = a[o].texture
                }
                return i
            }

            function N(e, r, s) {
                let l = t.TEXTURE_2D;
                (r.isDataArrayTexture || r.isCompressedArrayTexture) && (l = t.TEXTURE_2D_ARRAY), r.isData3DTexture && (l = t.TEXTURE_3D);
                const c = O(e, r),
                    h = r.source;
                n.bindTexture(l, e.__webglTexture, t.TEXTURE0 + s);
                const d = i.get(h);
                if (h.version !== d.__version || !0 === c) {
                    n.activeTexture(t.TEXTURE0 + s), t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL, r.flipY), t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, r.premultiplyAlpha), t.pixelStorei(t.UNPACK_ALIGNMENT, r.unpackAlignment), t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL, t.NONE);
                    const e = function(t) {
                        return !o && (t.wrapS !== fl || t.wrapT !== fl || t.minFilter !== gl && t.minFilter !== vl)
                    }(r) && !1 === y(r.image);
                    let i = x(r.image, e, !1, u);
                    i = G(r, i);
                    const p = y(i) || o,
                        f = a.convert(r.format, r.colorSpace);
                    let m, g = a.convert(r.type),
                        _ = E(r.internalFormat, f, g, r.colorSpace, r.isVideoTexture);
                    I(l, r, p);
                    const v = r.mipmaps,
                        b = o && !0 !== r.isVideoTexture,
                        w = void 0 === d.__version || !0 === c,
                        A = T(r, i, p);
                    if (r.isDepthTexture) _ = t.DEPTH_COMPONENT, o ? _ = r.type === El ? t.DEPTH_COMPONENT32F : r.type === Sl ? t.DEPTH_COMPONENT24 : r.type === bl ? t.DEPTH24_STENCIL8 : t.DEPTH_COMPONENT16 : r.type === El && console.error("WebGLRenderer: Floating point depth texture requires WebGL2."), r.format === Al && _ === t.DEPTH_COMPONENT && r.type !== Ml && r.type !== Sl && (console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."), r.type = Sl, g = a.convert(r.type)), r.format === Rl && _ === t.DEPTH_COMPONENT && (_ = t.DEPTH_STENCIL, r.type !== bl && (console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."), r.type = bl, g = a.convert(r.type))), w && (b ? n.texStorage2D(t.TEXTURE_2D, 1, _, i.width, i.height) : n.texImage2D(t.TEXTURE_2D, 0, _, i.width, i.height, 0, f, g, null));
                    else if (r.isDataTexture)
                        if (v.length > 0 && p) {
                            b && w && n.texStorage2D(t.TEXTURE_2D, A, _, v[0].width, v[0].height);
                            for (let e = 0, i = v.length; e < i; e++) m = v[e], b ? n.texSubImage2D(t.TEXTURE_2D, e, 0, 0, m.width, m.height, f, g, m.data) : n.texImage2D(t.TEXTURE_2D, e, _, m.width, m.height, 0, f, g, m.data);
                            r.generateMipmaps = !1
                        } else b ? (w && n.texStorage2D(t.TEXTURE_2D, A, _, i.width, i.height), n.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, i.width, i.height, f, g, i.data)) : n.texImage2D(t.TEXTURE_2D, 0, _, i.width, i.height, 0, f, g, i.data);
                    else if (r.isCompressedTexture)
                        if (r.isCompressedArrayTexture) {
                            b && w && n.texStorage3D(t.TEXTURE_2D_ARRAY, A, _, v[0].width, v[0].height, i.depth);
                            for (let e = 0, a = v.length; e < a; e++) m = v[e], r.format !== wl ? null !== f ? b ? n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY, e, 0, 0, 0, m.width, m.height, i.depth, f, m.data, 0, 0) : n.compressedTexImage3D(t.TEXTURE_2D_ARRAY, e, _, m.width, m.height, i.depth, 0, m.data, 0, 0) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : b ? n.texSubImage3D(t.TEXTURE_2D_ARRAY, e, 0, 0, 0, m.width, m.height, i.depth, f, g, m.data) : n.texImage3D(t.TEXTURE_2D_ARRAY, e, _, m.width, m.height, i.depth, 0, f, g, m.data)
                        } else {
                            b && w && n.texStorage2D(t.TEXTURE_2D, A, _, v[0].width, v[0].height);
                            for (let e = 0, i = v.length; e < i; e++) m = v[e], r.format !== wl ? null !== f ? b ? n.compressedTexSubImage2D(t.TEXTURE_2D, e, 0, 0, m.width, m.height, f, m.data) : n.compressedTexImage2D(t.TEXTURE_2D, e, _, m.width, m.height, 0, m.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : b ? n.texSubImage2D(t.TEXTURE_2D, e, 0, 0, m.width, m.height, f, g, m.data) : n.texImage2D(t.TEXTURE_2D, e, _, m.width, m.height, 0, f, g, m.data)
                        }
                    else if (r.isDataArrayTexture) b ? (w && n.texStorage3D(t.TEXTURE_2D_ARRAY, A, _, i.width, i.height, i.depth), n.texSubImage3D(t.TEXTURE_2D_ARRAY, 0, 0, 0, 0, i.width, i.height, i.depth, f, g, i.data)) : n.texImage3D(t.TEXTURE_2D_ARRAY, 0, _, i.width, i.height, i.depth, 0, f, g, i.data);
                    else if (r.isData3DTexture) b ? (w && n.texStorage3D(t.TEXTURE_3D, A, _, i.width, i.height, i.depth), n.texSubImage3D(t.TEXTURE_3D, 0, 0, 0, 0, i.width, i.height, i.depth, f, g, i.data)) : n.texImage3D(t.TEXTURE_3D, 0, _, i.width, i.height, i.depth, 0, f, g, i.data);
                    else if (r.isFramebufferTexture) {
                        if (w)
                            if (b) n.texStorage2D(t.TEXTURE_2D, A, _, i.width, i.height);
                            else {
                                let e = i.width,
                                    r = i.height;
                                for (let i = 0; i < A; i++) n.texImage2D(t.TEXTURE_2D, i, _, e, r, 0, f, g, null), e >>= 1, r >>= 1
                            }
                    } else if (v.length > 0 && p) {
                        b && w && n.texStorage2D(t.TEXTURE_2D, A, _, v[0].width, v[0].height);
                        for (let e = 0, i = v.length; e < i; e++) m = v[e], b ? n.texSubImage2D(t.TEXTURE_2D, e, 0, 0, f, g, m) : n.texImage2D(t.TEXTURE_2D, e, _, f, g, m);
                        r.generateMipmaps = !1
                    } else b ? (w && n.texStorage2D(t.TEXTURE_2D, A, _, i.width, i.height), n.texSubImage2D(t.TEXTURE_2D, 0, 0, 0, f, g, i)) : n.texImage2D(t.TEXTURE_2D, 0, _, f, g, i);
                    M(r, p) && S(l), d.__version = h.version, r.onUpdate && r.onUpdate(r)
                }
                e.__version = r.version
            }

            function F(e, r, s, o, l, c) {
                const u = a.convert(s.format, s.colorSpace),
                    h = a.convert(s.type),
                    p = E(s.internalFormat, u, h, s.colorSpace);
                if (!i.get(r).__hasExternalTextures) {
                    const e = Math.max(1, r.width >> c),
                        i = Math.max(1, r.height >> c);
                    l === t.TEXTURE_3D || l === t.TEXTURE_2D_ARRAY ? n.texImage3D(l, c, p, e, i, r.depth, 0, u, h, null) : n.texImage2D(l, c, p, e, i, 0, u, h, null)
                }
                n.bindFramebuffer(t.FRAMEBUFFER, e), H(r) ? d.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER, o, l, i.get(s).__webglTexture, 0, k(r)) : (l === t.TEXTURE_2D || l >= t.TEXTURE_CUBE_MAP_POSITIVE_X && l <= t.TEXTURE_CUBE_MAP_NEGATIVE_Z) && t.framebufferTexture2D(t.FRAMEBUFFER, o, l, i.get(s).__webglTexture, c), n.bindFramebuffer(t.FRAMEBUFFER, null)
            }

            function z(e, n, i) {
                if (t.bindRenderbuffer(t.RENDERBUFFER, e), n.depthBuffer && !n.stencilBuffer) {
                    let r = t.DEPTH_COMPONENT16;
                    if (i || H(n)) {
                        const e = n.depthTexture;
                        e && e.isDepthTexture && (e.type === El ? r = t.DEPTH_COMPONENT32F : e.type === Sl && (r = t.DEPTH_COMPONENT24));
                        const i = k(n);
                        H(n) ? d.renderbufferStorageMultisampleEXT(t.RENDERBUFFER, i, r, n.width, n.height) : t.renderbufferStorageMultisample(t.RENDERBUFFER, i, r, n.width, n.height)
                    } else t.renderbufferStorage(t.RENDERBUFFER, r, n.width, n.height);
                    t.framebufferRenderbuffer(t.FRAMEBUFFER, t.DEPTH_ATTACHMENT, t.RENDERBUFFER, e)
                } else if (n.depthBuffer && n.stencilBuffer) {
                    const r = k(n);
                    i && !1 === H(n) ? t.renderbufferStorageMultisample(t.RENDERBUFFER, r, t.DEPTH24_STENCIL8, n.width, n.height) : H(n) ? d.renderbufferStorageMultisampleEXT(t.RENDERBUFFER, r, t.DEPTH24_STENCIL8, n.width, n.height) : t.renderbufferStorage(t.RENDERBUFFER, t.DEPTH_STENCIL, n.width, n.height), t.framebufferRenderbuffer(t.FRAMEBUFFER, t.DEPTH_STENCIL_ATTACHMENT, t.RENDERBUFFER, e)
                } else {
                    const e = !0 === n.isWebGLMultipleRenderTargets ? n.texture : [n.texture];
                    for (let r = 0; r < e.length; r++) {
                        const s = e[r],
                            o = a.convert(s.format, s.colorSpace),
                            l = a.convert(s.type),
                            c = E(s.internalFormat, o, l, s.colorSpace),
                            u = k(n);
                        i && !1 === H(n) ? t.renderbufferStorageMultisample(t.RENDERBUFFER, u, c, n.width, n.height) : H(n) ? d.renderbufferStorageMultisampleEXT(t.RENDERBUFFER, u, c, n.width, n.height) : t.renderbufferStorage(t.RENDERBUFFER, c, n.width, n.height)
                    }
                }
                t.bindRenderbuffer(t.RENDERBUFFER, null)
            }

            function B(e) {
                const r = i.get(e),
                    a = !0 === e.isWebGLCubeRenderTarget;
                if (e.depthTexture && !r.__autoAllocateDepthBuffer) {
                    if (a) throw new Error("target.depthTexture not supported in Cube render targets");
                    ! function(e, r) {
                        if (r && r.isWebGLCubeRenderTarget) throw new Error("Depth Texture with cube render targets is not supported");
                        if (n.bindFramebuffer(t.FRAMEBUFFER, e), !r.depthTexture || !r.depthTexture.isDepthTexture) throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");
                        i.get(r.depthTexture).__webglTexture && r.depthTexture.image.width === r.width && r.depthTexture.image.height === r.height || (r.depthTexture.image.width = r.width, r.depthTexture.image.height = r.height, r.depthTexture.needsUpdate = !0), L(r.depthTexture, 0);
                        const a = i.get(r.depthTexture).__webglTexture,
                            s = k(r);
                        if (r.depthTexture.format === Al) H(r) ? d.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER, t.DEPTH_ATTACHMENT, t.TEXTURE_2D, a, 0, s) : t.framebufferTexture2D(t.FRAMEBUFFER, t.DEPTH_ATTACHMENT, t.TEXTURE_2D, a, 0);
                        else {
                            if (r.depthTexture.format !== Rl) throw new Error("Unknown depthTexture format");
                            H(r) ? d.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER, t.DEPTH_STENCIL_ATTACHMENT, t.TEXTURE_2D, a, 0, s) : t.framebufferTexture2D(t.FRAMEBUFFER, t.DEPTH_STENCIL_ATTACHMENT, t.TEXTURE_2D, a, 0)
                        }
                    }(r.__webglFramebuffer, e)
                } else if (a) {
                    r.__webglDepthbuffer = [];
                    for (let i = 0; i < 6; i++) n.bindFramebuffer(t.FRAMEBUFFER, r.__webglFramebuffer[i]), r.__webglDepthbuffer[i] = t.createRenderbuffer(), z(r.__webglDepthbuffer[i], e, !1)
                } else n.bindFramebuffer(t.FRAMEBUFFER, r.__webglFramebuffer), r.__webglDepthbuffer = t.createRenderbuffer(), z(r.__webglDepthbuffer, e, !1);
                n.bindFramebuffer(t.FRAMEBUFFER, null)
            }

            function k(t) {
                return Math.min(h, t.samples)
            }

            function H(t) {
                const n = i.get(t);
                return o && t.samples > 0 && !0 === e.has("WEBGL_multisampled_render_to_texture") && !1 !== n.__useRenderToTexture
            }

            function G(t, n) {
                const i = t.colorSpace,
                    r = t.format,
                    a = t.type;
                return !0 === t.isCompressedTexture || !0 === t.isVideoTexture || t.format === kl || i !== Nl && "" !== i && (i === Ol || i === Fl ? !1 === o ? !0 === e.has("EXT_sRGB") && r === wl ? (t.format = kl, t.minFilter = vl, t.generateMipmaps = !1) : n = uc.sRGBToLinear(n) : r === wl && a === yl || console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.") : console.error("THREE.WebGLTextures: Unsupported texture color space:", i)), n
            }
            this.allocateTextureUnit = function() {
                const t = C;
                return t >= l && console.warn("THREE.WebGLTextures: Trying to use " + t + " texture units while this GPU supports only " + l), C += 1, t
            }, this.resetTextureUnits = function() {
                C = 0
            }, this.setTexture2D = L, this.setTexture2DArray = function(e, r) {
                const a = i.get(e);
                e.version > 0 && a.__version !== e.version ? N(a, e, r) : n.bindTexture(t.TEXTURE_2D_ARRAY, a.__webglTexture, t.TEXTURE0 + r)
            }, this.setTexture3D = function(e, r) {
                const a = i.get(e);
                e.version > 0 && a.__version !== e.version ? N(a, e, r) : n.bindTexture(t.TEXTURE_3D, a.__webglTexture, t.TEXTURE0 + r)
            }, this.setTextureCube = function(e, r) {
                const s = i.get(e);
                e.version > 0 && s.__version !== e.version ? function(e, r, s) {
                    if (6 !== r.image.length) return;
                    const l = O(e, r),
                        u = r.source;
                    n.bindTexture(t.TEXTURE_CUBE_MAP, e.__webglTexture, t.TEXTURE0 + s);
                    const h = i.get(u);
                    if (u.version !== h.__version || !0 === l) {
                        n.activeTexture(t.TEXTURE0 + s), t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL, r.flipY), t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, r.premultiplyAlpha), t.pixelStorei(t.UNPACK_ALIGNMENT, r.unpackAlignment), t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL, t.NONE);
                        const e = r.isCompressedTexture || r.image[0].isCompressedTexture,
                            i = r.image[0] && r.image[0].isDataTexture,
                            d = [];
                        for (let t = 0; t < 6; t++) d[t] = e || i ? i ? r.image[t].image : r.image[t] : x(r.image[t], !1, !0, c), d[t] = G(r, d[t]);
                        const p = d[0],
                            f = y(p) || o,
                            m = a.convert(r.format, r.colorSpace),
                            g = a.convert(r.type),
                            _ = E(r.internalFormat, m, g, r.colorSpace),
                            v = o && !0 !== r.isVideoTexture,
                            b = void 0 === h.__version || !0 === l;
                        let w, A = T(r, p, f);
                        if (I(t.TEXTURE_CUBE_MAP, r, f), e) {
                            v && b && n.texStorage2D(t.TEXTURE_CUBE_MAP, A, _, p.width, p.height);
                            for (let e = 0; e < 6; e++) {
                                w = d[e].mipmaps;
                                for (let i = 0; i < w.length; i++) {
                                    const a = w[i];
                                    r.format !== wl ? null !== m ? v ? n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + e, i, 0, 0, a.width, a.height, m, a.data) : n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + e, i, _, a.width, a.height, 0, a.data) : console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()") : v ? n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + e, i, 0, 0, a.width, a.height, m, g, a.data) : n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + e, i, _, a.width, a.height, 0, m, g, a.data)
                                }
                            }
                        } else {
                            w = r.mipmaps, v && b && (w.length > 0 && A++, n.texStorage2D(t.TEXTURE_CUBE_MAP, A, _, d[0].width, d[0].height));
                            for (let e = 0; e < 6; e++)
                                if (i) {
                                    v ? n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + e, 0, 0, 0, d[e].width, d[e].height, m, g, d[e].data) : n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + e, 0, _, d[e].width, d[e].height, 0, m, g, d[e].data);
                                    for (let i = 0; i < w.length; i++) {
                                        const r = w[i].image[e].image;
                                        v ? n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + e, i + 1, 0, 0, r.width, r.height, m, g, r.data) : n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + e, i + 1, _, r.width, r.height, 0, m, g, r.data)
                                    }
                                } else {
                                    v ? n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + e, 0, 0, 0, m, g, d[e]) : n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + e, 0, _, m, g, d[e]);
                                    for (let i = 0; i < w.length; i++) {
                                        const r = w[i];
                                        v ? n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + e, i + 1, 0, 0, m, g, r.image[e]) : n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + e, i + 1, _, m, g, r.image[e])
                                    }
                                }
                        }
                        M(r, f) && S(t.TEXTURE_CUBE_MAP), h.__version = u.version, r.onUpdate && r.onUpdate(r)
                    }
                    e.__version = r.version
                }(s, e, r) : n.bindTexture(t.TEXTURE_CUBE_MAP, s.__webglTexture, t.TEXTURE0 + r)
            }, this.rebindTextures = function(e, n, r) {
                const a = i.get(e);
                void 0 !== n && F(a.__webglFramebuffer, e, e.texture, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, 0), void 0 !== r && B(e)
            }, this.setupRenderTarget = function(e) {
                const l = e.texture,
                    c = i.get(e),
                    u = i.get(l);
                e.addEventListener("dispose", A), !0 !== e.isWebGLMultipleRenderTargets && (void 0 === u.__webglTexture && (u.__webglTexture = t.createTexture()), u.__version = l.version, s.memory.textures++);
                const h = !0 === e.isWebGLCubeRenderTarget,
                    d = !0 === e.isWebGLMultipleRenderTargets,
                    p = y(e) || o;
                if (h) {
                    c.__webglFramebuffer = [];
                    for (let e = 0; e < 6; e++)
                        if (o && l.mipmaps && l.mipmaps.length > 0) {
                            c.__webglFramebuffer[e] = [];
                            for (let n = 0; n < l.mipmaps.length; n++) c.__webglFramebuffer[e][n] = t.createFramebuffer()
                        } else c.__webglFramebuffer[e] = t.createFramebuffer()
                } else {
                    if (o && l.mipmaps && l.mipmaps.length > 0) {
                        c.__webglFramebuffer = [];
                        for (let e = 0; e < l.mipmaps.length; e++) c.__webglFramebuffer[e] = t.createFramebuffer()
                    } else c.__webglFramebuffer = t.createFramebuffer();
                    if (d)
                        if (r.drawBuffers) {
                            const n = e.texture;
                            for (let e = 0, r = n.length; e < r; e++) {
                                const r = i.get(n[e]);
                                void 0 === r.__webglTexture && (r.__webglTexture = t.createTexture(), s.memory.textures++)
                            }
                        } else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");
                    if (o && e.samples > 0 && !1 === H(e)) {
                        const i = d ? l : [l];
                        c.__webglMultisampledFramebuffer = t.createFramebuffer(), c.__webglColorRenderbuffer = [], n.bindFramebuffer(t.FRAMEBUFFER, c.__webglMultisampledFramebuffer);
                        for (let n = 0; n < i.length; n++) {
                            const r = i[n];
                            c.__webglColorRenderbuffer[n] = t.createRenderbuffer(), t.bindRenderbuffer(t.RENDERBUFFER, c.__webglColorRenderbuffer[n]);
                            const s = a.convert(r.format, r.colorSpace),
                                o = a.convert(r.type),
                                l = E(r.internalFormat, s, o, r.colorSpace, !0 === e.isXRRenderTarget),
                                u = k(e);
                            t.renderbufferStorageMultisample(t.RENDERBUFFER, u, l, e.width, e.height), t.framebufferRenderbuffer(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0 + n, t.RENDERBUFFER, c.__webglColorRenderbuffer[n])
                        }
                        t.bindRenderbuffer(t.RENDERBUFFER, null), e.depthBuffer && (c.__webglDepthRenderbuffer = t.createRenderbuffer(), z(c.__webglDepthRenderbuffer, e, !0)), n.bindFramebuffer(t.FRAMEBUFFER, null)
                    }
                }
                if (h) {
                    n.bindTexture(t.TEXTURE_CUBE_MAP, u.__webglTexture), I(t.TEXTURE_CUBE_MAP, l, p);
                    for (let n = 0; n < 6; n++)
                        if (o && l.mipmaps && l.mipmaps.length > 0)
                            for (let i = 0; i < l.mipmaps.length; i++) F(c.__webglFramebuffer[n][i], e, l, t.COLOR_ATTACHMENT0, t.TEXTURE_CUBE_MAP_POSITIVE_X + n, i);
                        else F(c.__webglFramebuffer[n], e, l, t.COLOR_ATTACHMENT0, t.TEXTURE_CUBE_MAP_POSITIVE_X + n, 0);
                    M(l, p) && S(t.TEXTURE_CUBE_MAP), n.unbindTexture()
                } else if (d) {
                    const r = e.texture;
                    for (let a = 0, s = r.length; a < s; a++) {
                        const s = r[a],
                            o = i.get(s);
                        n.bindTexture(t.TEXTURE_2D, o.__webglTexture), I(t.TEXTURE_2D, s, p), F(c.__webglFramebuffer, e, s, t.COLOR_ATTACHMENT0 + a, t.TEXTURE_2D, 0), M(s, p) && S(t.TEXTURE_2D)
                    }
                    n.unbindTexture()
                } else {
                    let i = t.TEXTURE_2D;
                    if ((e.isWebGL3DRenderTarget || e.isWebGLArrayRenderTarget) && (o ? i = e.isWebGL3DRenderTarget ? t.TEXTURE_3D : t.TEXTURE_2D_ARRAY : console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")), n.bindTexture(i, u.__webglTexture), I(i, l, p), o && l.mipmaps && l.mipmaps.length > 0)
                        for (let n = 0; n < l.mipmaps.length; n++) F(c.__webglFramebuffer[n], e, l, t.COLOR_ATTACHMENT0, i, n);
                    else F(c.__webglFramebuffer, e, l, t.COLOR_ATTACHMENT0, i, 0);
                    M(l, p) && S(i), n.unbindTexture()
                }
                e.depthBuffer && B(e)
            }, this.updateRenderTargetMipmap = function(e) {
                const r = y(e) || o,
                    a = !0 === e.isWebGLMultipleRenderTargets ? e.texture : [e.texture];
                for (let s = 0, o = a.length; s < o; s++) {
                    const o = a[s];
                    if (M(o, r)) {
                        const r = e.isWebGLCubeRenderTarget ? t.TEXTURE_CUBE_MAP : t.TEXTURE_2D,
                            a = i.get(o).__webglTexture;
                        n.bindTexture(r, a), S(r), n.unbindTexture()
                    }
                }
            }, this.updateMultisampleRenderTarget = function(e) {
                if (o && e.samples > 0 && !1 === H(e)) {
                    const r = e.isWebGLMultipleRenderTargets ? e.texture : [e.texture],
                        a = e.width,
                        s = e.height;
                    let o = t.COLOR_BUFFER_BIT;
                    const l = [],
                        c = e.stencilBuffer ? t.DEPTH_STENCIL_ATTACHMENT : t.DEPTH_ATTACHMENT,
                        u = i.get(e),
                        h = !0 === e.isWebGLMultipleRenderTargets;
                    if (h)
                        for (let e = 0; e < r.length; e++) n.bindFramebuffer(t.FRAMEBUFFER, u.__webglMultisampledFramebuffer), t.framebufferRenderbuffer(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0 + e, t.RENDERBUFFER, null), n.bindFramebuffer(t.FRAMEBUFFER, u.__webglFramebuffer), t.framebufferTexture2D(t.DRAW_FRAMEBUFFER, t.COLOR_ATTACHMENT0 + e, t.TEXTURE_2D, null, 0);
                    n.bindFramebuffer(t.READ_FRAMEBUFFER, u.__webglMultisampledFramebuffer), n.bindFramebuffer(t.DRAW_FRAMEBUFFER, u.__webglFramebuffer);
                    for (let n = 0; n < r.length; n++) {
                        l.push(t.COLOR_ATTACHMENT0 + n), e.depthBuffer && l.push(c);
                        const d = void 0 !== u.__ignoreDepthValues && u.__ignoreDepthValues;
                        if (!1 === d && (e.depthBuffer && (o |= t.DEPTH_BUFFER_BIT), e.stencilBuffer && (o |= t.STENCIL_BUFFER_BIT)), h && t.framebufferRenderbuffer(t.READ_FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.RENDERBUFFER, u.__webglColorRenderbuffer[n]), !0 === d && (t.invalidateFramebuffer(t.READ_FRAMEBUFFER, [c]), t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER, [c])), h) {
                            const e = i.get(r[n]).__webglTexture;
                            t.framebufferTexture2D(t.DRAW_FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, e, 0)
                        }
                        t.blitFramebuffer(0, 0, a, s, 0, 0, a, s, o, t.NEAREST), p && t.invalidateFramebuffer(t.READ_FRAMEBUFFER, l)
                    }
                    if (n.bindFramebuffer(t.READ_FRAMEBUFFER, null), n.bindFramebuffer(t.DRAW_FRAMEBUFFER, null), h)
                        for (let e = 0; e < r.length; e++) {
                            n.bindFramebuffer(t.FRAMEBUFFER, u.__webglMultisampledFramebuffer), t.framebufferRenderbuffer(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0 + e, t.RENDERBUFFER, u.__webglColorRenderbuffer[e]);
                            const a = i.get(r[e]).__webglTexture;
                            n.bindFramebuffer(t.FRAMEBUFFER, u.__webglFramebuffer), t.framebufferTexture2D(t.DRAW_FRAMEBUFFER, t.COLOR_ATTACHMENT0 + e, t.TEXTURE_2D, a, 0)
                        }
                    n.bindFramebuffer(t.DRAW_FRAMEBUFFER, u.__webglMultisampledFramebuffer)
                }
            }, this.setupDepthRenderbuffer = B, this.setupFrameBufferTexture = F, this.useMultisampledRTT = H
        }

        function mf(t, e, n) {
            const i = n.isWebGL2;
            return {
                convert: function(n, r = "") {
                    let a;
                    const s = r === Ol || r === Fl ? 1 : 0;
                    if (n === yl) return t.UNSIGNED_BYTE;
                    if (1017 === n) return t.UNSIGNED_SHORT_4_4_4_4;
                    if (1018 === n) return t.UNSIGNED_SHORT_5_5_5_1;
                    if (1010 === n) return t.BYTE;
                    if (1011 === n) return t.SHORT;
                    if (n === Ml) return t.UNSIGNED_SHORT;
                    if (1013 === n) return t.INT;
                    if (n === Sl) return t.UNSIGNED_INT;
                    if (n === El) return t.FLOAT;
                    if (n === Tl) return i ? t.HALF_FLOAT : (a = e.get("OES_texture_half_float"), null !== a ? a.HALF_FLOAT_OES : null);
                    if (1021 === n) return t.ALPHA;
                    if (n === wl) return t.RGBA;
                    if (1024 === n) return t.LUMINANCE;
                    if (1025 === n) return t.LUMINANCE_ALPHA;
                    if (n === Al) return t.DEPTH_COMPONENT;
                    if (n === Rl) return t.DEPTH_STENCIL;
                    if (n === kl) return a = e.get("EXT_sRGB"), null !== a ? a.SRGB_ALPHA_EXT : null;
                    if (1028 === n) return t.RED;
                    if (1029 === n) return t.RED_INTEGER;
                    if (1030 === n) return t.RG;
                    if (1031 === n) return t.RG_INTEGER;
                    if (1033 === n) return t.RGBA_INTEGER;
                    if (n === Cl || n === Ll || n === Pl || n === Ul)
                        if (1 === s) {
                            if (a = e.get("WEBGL_compressed_texture_s3tc_srgb"), null === a) return null;
                            if (n === Cl) return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;
                            if (n === Ll) return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
                            if (n === Pl) return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
                            if (n === Ul) return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT
                        } else {
                            if (a = e.get("WEBGL_compressed_texture_s3tc"), null === a) return null;
                            if (n === Cl) return a.COMPRESSED_RGB_S3TC_DXT1_EXT;
                            if (n === Ll) return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;
                            if (n === Pl) return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;
                            if (n === Ul) return a.COMPRESSED_RGBA_S3TC_DXT5_EXT
                        } if (35840 === n || 35841 === n || 35842 === n || 35843 === n) {
                        if (a = e.get("WEBGL_compressed_texture_pvrtc"), null === a) return null;
                        if (35840 === n) return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
                        if (35841 === n) return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
                        if (35842 === n) return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
                        if (35843 === n) return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG
                    }
                    if (36196 === n) return a = e.get("WEBGL_compressed_texture_etc1"), null !== a ? a.COMPRESSED_RGB_ETC1_WEBGL : null;
                    if (37492 === n || 37496 === n) {
                        if (a = e.get("WEBGL_compressed_texture_etc"), null === a) return null;
                        if (37492 === n) return 1 === s ? a.COMPRESSED_SRGB8_ETC2 : a.COMPRESSED_RGB8_ETC2;
                        if (37496 === n) return 1 === s ? a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : a.COMPRESSED_RGBA8_ETC2_EAC
                    }
                    if (37808 === n || 37809 === n || 37810 === n || 37811 === n || 37812 === n || 37813 === n || 37814 === n || 37815 === n || 37816 === n || 37817 === n || 37818 === n || 37819 === n || 37820 === n || 37821 === n) {
                        if (a = e.get("WEBGL_compressed_texture_astc"), null === a) return null;
                        if (37808 === n) return 1 === s ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR : a.COMPRESSED_RGBA_ASTC_4x4_KHR;
                        if (37809 === n) return 1 === s ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR : a.COMPRESSED_RGBA_ASTC_5x4_KHR;
                        if (37810 === n) return 1 === s ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR : a.COMPRESSED_RGBA_ASTC_5x5_KHR;
                        if (37811 === n) return 1 === s ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR : a.COMPRESSED_RGBA_ASTC_6x5_KHR;
                        if (37812 === n) return 1 === s ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR : a.COMPRESSED_RGBA_ASTC_6x6_KHR;
                        if (37813 === n) return 1 === s ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR : a.COMPRESSED_RGBA_ASTC_8x5_KHR;
                        if (37814 === n) return 1 === s ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR : a.COMPRESSED_RGBA_ASTC_8x6_KHR;
                        if (37815 === n) return 1 === s ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR : a.COMPRESSED_RGBA_ASTC_8x8_KHR;
                        if (37816 === n) return 1 === s ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR : a.COMPRESSED_RGBA_ASTC_10x5_KHR;
                        if (37817 === n) return 1 === s ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR : a.COMPRESSED_RGBA_ASTC_10x6_KHR;
                        if (37818 === n) return 1 === s ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR : a.COMPRESSED_RGBA_ASTC_10x8_KHR;
                        if (37819 === n) return 1 === s ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR : a.COMPRESSED_RGBA_ASTC_10x10_KHR;
                        if (37820 === n) return 1 === s ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR : a.COMPRESSED_RGBA_ASTC_12x10_KHR;
                        if (37821 === n) return 1 === s ? a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR : a.COMPRESSED_RGBA_ASTC_12x12_KHR
                    }
                    if (n === Dl || 36494 === n || 36495 === n) {
                        if (a = e.get("EXT_texture_compression_bptc"), null === a) return null;
                        if (n === Dl) return 1 === s ? a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT : a.COMPRESSED_RGBA_BPTC_UNORM_EXT;
                        if (36494 === n) return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
                        if (36495 === n) return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT
                    }
                    if (36283 === n || 36284 === n || 36285 === n || 36286 === n) {
                        if (a = e.get("EXT_texture_compression_rgtc"), null === a) return null;
                        if (n === Dl) return a.COMPRESSED_RED_RGTC1_EXT;
                        if (36284 === n) return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;
                        if (36285 === n) return a.COMPRESSED_RED_GREEN_RGTC2_EXT;
                        if (36286 === n) return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT
                    }
                    return n === bl ? i ? t.UNSIGNED_INT_24_8 : (a = e.get("WEBGL_depth_texture"), null !== a ? a.UNSIGNED_INT_24_8_WEBGL : null) : void 0 !== t[n] ? t[n] : null
                }
            }
        }
        class gf extends Jh {
            constructor(t = []) {
                super(), this.isArrayCamera = !0, this.cameras = t
            }
        }
        class _f extends Qc {
            constructor() {
                super(), this.isGroup = !0, this.type = "Group"
            }
        }
        const vf = {
            type: "move"
        };
        class xf {
            constructor() {
                this._targetRay = null, this._grip = null, this._hand = null
            }
            getHandSpace() {
                return null === this._hand && (this._hand = new _f, this._hand.matrixAutoUpdate = !1, this._hand.visible = !1, this._hand.joints = {}, this._hand.inputState = {
                    pinching: !1
                }), this._hand
            }
            getTargetRaySpace() {
                return null === this._targetRay && (this._targetRay = new _f, this._targetRay.matrixAutoUpdate = !1, this._targetRay.visible = !1, this._targetRay.hasLinearVelocity = !1, this._targetRay.linearVelocity = new bc, this._targetRay.hasAngularVelocity = !1, this._targetRay.angularVelocity = new bc), this._targetRay
            }
            getGripSpace() {
                return null === this._grip && (this._grip = new _f, this._grip.matrixAutoUpdate = !1, this._grip.visible = !1, this._grip.hasLinearVelocity = !1, this._grip.linearVelocity = new bc, this._grip.hasAngularVelocity = !1, this._grip.angularVelocity = new bc), this._grip
            }
            dispatchEvent(t) {
                return null !== this._targetRay && this._targetRay.dispatchEvent(t), null !== this._grip && this._grip.dispatchEvent(t), null !== this._hand && this._hand.dispatchEvent(t), this
            }
            connect(t) {
                if (t && t.hand) {
                    const e = this._hand;
                    if (e)
                        for (const n of t.hand.values()) this._getHandJoint(e, n)
                }
                return this.dispatchEvent({
                    type: "connected",
                    data: t
                }), this
            }
            disconnect(t) {
                return this.dispatchEvent({
                    type: "disconnected",
                    data: t
                }), null !== this._targetRay && (this._targetRay.visible = !1), null !== this._grip && (this._grip.visible = !1), null !== this._hand && (this._hand.visible = !1), this
            }
            update(t, e, n) {
                let i = null,
                    r = null,
                    a = null;
                const s = this._targetRay,
                    o = this._grip,
                    l = this._hand;
                if (t && "visible-blurred" !== e.session.visibilityState) {
                    if (l && t.hand) {
                        a = !0;
                        for (const i of t.hand.values()) {
                            const t = e.getJointPose(i, n),
                                r = this._getHandJoint(l, i);
                            null !== t && (r.matrix.fromArray(t.transform.matrix), r.matrix.decompose(r.position, r.rotation, r.scale), r.matrixWorldNeedsUpdate = !0, r.jointRadius = t.radius), r.visible = null !== t
                        }
                        const i = l.joints["index-finger-tip"],
                            r = l.joints["thumb-tip"],
                            s = i.position.distanceTo(r.position),
                            o = .02,
                            c = .005;
                        l.inputState.pinching && s > o + c ? (l.inputState.pinching = !1, this.dispatchEvent({
                            type: "pinchend",
                            handedness: t.handedness,
                            target: this
                        })) : !l.inputState.pinching && s <= o - c && (l.inputState.pinching = !0, this.dispatchEvent({
                            type: "pinchstart",
                            handedness: t.handedness,
                            target: this
                        }))
                    } else null !== o && t.gripSpace && (r = e.getPose(t.gripSpace, n), null !== r && (o.matrix.fromArray(r.transform.matrix), o.matrix.decompose(o.position, o.rotation, o.scale), o.matrixWorldNeedsUpdate = !0, r.linearVelocity ? (o.hasLinearVelocity = !0, o.linearVelocity.copy(r.linearVelocity)) : o.hasLinearVelocity = !1, r.angularVelocity ? (o.hasAngularVelocity = !0, o.angularVelocity.copy(r.angularVelocity)) : o.hasAngularVelocity = !1));
                    null !== s && (i = e.getPose(t.targetRaySpace, n), null === i && null !== r && (i = r), null !== i && (s.matrix.fromArray(i.transform.matrix), s.matrix.decompose(s.position, s.rotation, s.scale), s.matrixWorldNeedsUpdate = !0, i.linearVelocity ? (s.hasLinearVelocity = !0, s.linearVelocity.copy(i.linearVelocity)) : s.hasLinearVelocity = !1, i.angularVelocity ? (s.hasAngularVelocity = !0, s.angularVelocity.copy(i.angularVelocity)) : s.hasAngularVelocity = !1, this.dispatchEvent(vf)))
                }
                return null !== s && (s.visible = null !== i), null !== o && (o.visible = null !== r), null !== l && (l.visible = null !== a), this
            }
            _getHandJoint(t, e) {
                if (void 0 === t.joints[e.jointName]) {
                    const n = new _f;
                    n.matrixAutoUpdate = !1, n.visible = !1, t.joints[e.jointName] = n, t.add(n)
                }
                return t.joints[e.jointName]
            }
        }
        class yf extends mc {
            constructor(t, e, n, i, r, a, s, o, l, c) {
                if ((c = void 0 !== c ? c : Al) !== Al && c !== Rl) throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");
                void 0 === n && c === Al && (n = Sl), void 0 === n && c === Rl && (n = bl), super(null, i, r, a, s, o, c, n, l), this.isDepthTexture = !0, this.image = {
                    width: t,
                    height: e
                }, this.magFilter = void 0 !== s ? s : gl, this.minFilter = void 0 !== o ? o : gl, this.flipY = !1, this.generateMipmaps = !1, this.compareFunction = null
            }
            copy(t) {
                return super.copy(t), this.compareFunction = t.compareFunction, this
            }
            toJSON(t) {
                const e = super.toJSON(t);
                return null !== this.compareFunction && (e.compareFunction = this.compareFunction), e
            }
        }
        class Mf extends Zo {
            constructor(t, e) {
                super();
                const n = this;
                let i = null,
                    r = 1,
                    a = null,
                    s = "local-floor",
                    o = 1,
                    l = null,
                    c = null,
                    u = null,
                    h = null,
                    d = null,
                    p = null;
                const f = e.getContextAttributes();
                let m = null,
                    g = null;
                const _ = [],
                    v = [],
                    x = new Jh;
                x.layers.enable(1), x.viewport = new Cu;
                const y = new Jh;
                y.layers.enable(2), y.viewport = new Cu;
                const M = [x, y],
                    S = new gf;
                S.layers.enable(1), S.layers.enable(2);
                let E = null,
                    T = null;

                function b(t) {
                    const e = v.indexOf(t.inputSource);
                    if (-1 === e) return;
                    const n = _[e];
                    void 0 !== n && (n.update(t.inputSource, t.frame, l || a), n.dispatchEvent({
                        type: t.type,
                        data: t.inputSource
                    }))
                }

                function w() {
                    i.removeEventListener("select", b), i.removeEventListener("selectstart", b), i.removeEventListener("selectend", b), i.removeEventListener("squeeze", b), i.removeEventListener("squeezestart", b), i.removeEventListener("squeezeend", b), i.removeEventListener("end", w), i.removeEventListener("inputsourceschange", A);
                    for (let t = 0; t < _.length; t++) {
                        const e = v[t];
                        null !== e && (v[t] = null, _[t].disconnect(e))
                    }
                    E = null, T = null, t.setRenderTarget(m), d = null, h = null, u = null, i = null, g = null, U.stop(), n.isPresenting = !1, n.dispatchEvent({
                        type: "sessionend"
                    })
                }

                function A(t) {
                    for (let e = 0; e < t.removed.length; e++) {
                        const n = t.removed[e],
                            i = v.indexOf(n);
                        i >= 0 && (v[i] = null, _[i].disconnect(n))
                    }
                    for (let e = 0; e < t.added.length; e++) {
                        const n = t.added[e];
                        let i = v.indexOf(n);
                        if (-1 === i) {
                            for (let t = 0; t < _.length; t++) {
                                if (t >= v.length) {
                                    v.push(n), i = t;
                                    break
                                }
                                if (null === v[t]) {
                                    v[t] = n, i = t;
                                    break
                                }
                            }
                            if (-1 === i) break
                        }
                        const r = _[i];
                        r && r.connect(n)
                    }
                }
                this.cameraAutoUpdate = !0, this.enabled = !1, this.isPresenting = !1, this.getController = function(t) {
                    let e = _[t];
                    return void 0 === e && (e = new xf, _[t] = e), e.getTargetRaySpace()
                }, this.getControllerGrip = function(t) {
                    let e = _[t];
                    return void 0 === e && (e = new xf, _[t] = e), e.getGripSpace()
                }, this.getHand = function(t) {
                    let e = _[t];
                    return void 0 === e && (e = new xf, _[t] = e), e.getHandSpace()
                }, this.setFramebufferScaleFactor = function(t) {
                    r = t, !0 === n.isPresenting && console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")
                }, this.setReferenceSpaceType = function(t) {
                    s = t, !0 === n.isPresenting && console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")
                }, this.getReferenceSpace = function() {
                    return l || a
                }, this.setReferenceSpace = function(t) {
                    l = t
                }, this.getBaseLayer = function() {
                    return null !== h ? h : d
                }, this.getBinding = function() {
                    return u
                }, this.getFrame = function() {
                    return p
                }, this.getSession = function() {
                    return i
                }, this.setSession = async function(c) {
                    if (i = c, null !== i) {
                        if (m = t.getRenderTarget(), i.addEventListener("select", b), i.addEventListener("selectstart", b), i.addEventListener("selectend", b), i.addEventListener("squeeze", b), i.addEventListener("squeezestart", b), i.addEventListener("squeezeend", b), i.addEventListener("end", w), i.addEventListener("inputsourceschange", A), !0 !== f.xrCompatible && await e.makeXRCompatible(), void 0 === i.renderState.layers || !1 === t.capabilities.isWebGL2) {
                            const n = {
                                antialias: void 0 !== i.renderState.layers || f.antialias,
                                alpha: !0,
                                depth: f.depth,
                                stencil: f.stencil,
                                framebufferScaleFactor: r
                            };
                            d = new XRWebGLLayer(i, e, n), i.updateRenderState({
                                baseLayer: d
                            }), g = new $h(d.framebufferWidth, d.framebufferHeight, {
                                format: wl,
                                type: yl,
                                colorSpace: t.outputColorSpace,
                                stencilBuffer: f.stencil
                            })
                        } else {
                            let n = null,
                                a = null,
                                s = null;
                            f.depth && (s = f.stencil ? e.DEPTH24_STENCIL8 : e.DEPTH_COMPONENT24, n = f.stencil ? Rl : Al, a = f.stencil ? bl : Sl);
                            const o = {
                                colorFormat: e.RGBA8,
                                depthFormat: s,
                                scaleFactor: r
                            };
                            u = new XRWebGLBinding(i, e), h = u.createProjectionLayer(o), i.updateRenderState({
                                layers: [h]
                            }), g = new $h(h.textureWidth, h.textureHeight, {
                                format: wl,
                                type: yl,
                                depthTexture: new yf(h.textureWidth, h.textureHeight, a, void 0, void 0, void 0, void 0, void 0, void 0, n),
                                stencilBuffer: f.stencil,
                                colorSpace: t.outputColorSpace,
                                samples: f.antialias ? 4 : 0
                            }), t.properties.get(g).__ignoreDepthValues = h.ignoreDepthValues
                        }
                        g.isXRRenderTarget = !0, this.setFoveation(o), l = null, a = await i.requestReferenceSpace(s), U.setContext(i), U.start(), n.isPresenting = !0, n.dispatchEvent({
                            type: "sessionstart"
                        })
                    }
                }, this.getEnvironmentBlendMode = function() {
                    if (null !== i) return i.environmentBlendMode
                };
                const R = new bc,
                    C = new bc;

                function L(t, e) {
                    null === e ? t.matrixWorld.copy(t.matrix) : t.matrixWorld.multiplyMatrices(e.matrixWorld, t.matrix), t.matrixWorldInverse.copy(t.matrixWorld).invert()
                }
                this.updateCamera = function(t) {
                    if (null === i) return;
                    S.near = y.near = x.near = t.near, S.far = y.far = x.far = t.far, E === S.near && T === S.far || (i.updateRenderState({
                        depthNear: S.near,
                        depthFar: S.far
                    }), E = S.near, T = S.far);
                    const e = t.parent,
                        n = S.cameras;
                    L(S, e);
                    for (let t = 0; t < n.length; t++) L(n[t], e);
                    2 === n.length ? function(t, e, n) {
                            R.setFromMatrixPosition(e.matrixWorld), C.setFromMatrixPosition(n.matrixWorld);
                            const i = R.distanceTo(C),
                                r = e.projectionMatrix.elements,
                                a = n.projectionMatrix.elements,
                                s = r[14] / (r[10] - 1),
                                o = r[14] / (r[10] + 1),
                                l = (r[9] + 1) / r[5],
                                c = (r[9] - 1) / r[5],
                                u = (r[8] - 1) / r[0],
                                h = (a[8] + 1) / a[0],
                                d = s * u,
                                p = s * h,
                                f = i / (-u + h),
                                m = f * -u;
                            e.matrixWorld.decompose(t.position, t.quaternion, t.scale), t.translateX(m), t.translateZ(f), t.matrixWorld.compose(t.position, t.quaternion, t.scale), t.matrixWorldInverse.copy(t.matrixWorld).invert();
                            const g = s + f,
                                _ = o + f,
                                v = d - m,
                                x = p + (i - m),
                                y = l * o / _ * g,
                                M = c * o / _ * g;
                            t.projectionMatrix.makePerspective(v, x, y, M, g, _), t.projectionMatrixInverse.copy(t.projectionMatrix).invert()
                        }(S, x, y) : S.projectionMatrix.copy(x.projectionMatrix),
                        function(t, e, n) {
                            null === n ? t.matrix.copy(e.matrixWorld) : (t.matrix.copy(n.matrixWorld), t.matrix.invert(), t.matrix.multiply(e.matrixWorld)), t.matrix.decompose(t.position, t.quaternion, t.scale), t.updateMatrixWorld(!0), t.projectionMatrix.copy(e.projectionMatrix), t.projectionMatrixInverse.copy(e.projectionMatrixInverse), t.isPerspectiveCamera && (t.fov = 2 * Xl * Math.atan(1 / t.projectionMatrix.elements[5]), t.zoom = 1)
                        }(t, S, e)
                }, this.getCamera = function() {
                    return S
                }, this.getFoveation = function() {
                    if (null !== h || null !== d) return o
                }, this.setFoveation = function(t) {
                    o = t, null !== h && (h.fixedFoveation = t), null !== d && void 0 !== d.fixedFoveation && (d.fixedFoveation = t)
                };
                let P = null;
                const U = new Lu;
                U.setAnimationLoop((function(e, i) {
                    if (c = i.getViewerPose(l || a), p = i, null !== c) {
                        const e = c.views;
                        null !== d && (t.setRenderTargetFramebuffer(g, d.framebuffer), t.setRenderTarget(g));
                        let n = !1;
                        e.length !== S.cameras.length && (S.cameras.length = 0, n = !0);
                        for (let i = 0; i < e.length; i++) {
                            const r = e[i];
                            let a = null;
                            if (null !== d) a = d.getViewport(r);
                            else {
                                const e = u.getViewSubImage(h, r);
                                a = e.viewport, 0 === i && (t.setRenderTargetTextures(g, e.colorTexture, h.ignoreDepthValues ? void 0 : e.depthStencilTexture), t.setRenderTarget(g))
                            }
                            let s = M[i];
                            void 0 === s && (s = new Jh, s.layers.enable(i), s.viewport = new Cu, M[i] = s), s.matrix.fromArray(r.transform.matrix), s.matrix.decompose(s.position, s.quaternion, s.scale), s.projectionMatrix.fromArray(r.projectionMatrix), s.projectionMatrixInverse.copy(s.projectionMatrix).invert(), s.viewport.set(a.x, a.y, a.width, a.height), 0 === i && (S.matrix.copy(s.matrix), S.matrix.decompose(S.position, S.quaternion, S.scale)), !0 === n && S.cameras.push(s)
                        }
                    }
                    for (let t = 0; t < _.length; t++) {
                        const e = v[t],
                            n = _[t];
                        null !== e && void 0 !== n && n.update(e, i, l || a)
                    }
                    P && P(e, i), i.detectedPlanes && n.dispatchEvent({
                        type: "planesdetected",
                        data: i
                    }), p = null
                })), this.setAnimationLoop = function(t) {
                    P = t
                }, this.dispose = function() {}
            }
        }

        function Sf(t, e) {
            function n(t, e) {
                !0 === t.matrixAutoUpdate && t.updateMatrix(), e.value.copy(t.matrix)
            }

            function i(i, r) {
                i.opacity.value = r.opacity, r.color && i.diffuse.value.copy(r.color), r.emissive && i.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity), r.map && (i.map.value = r.map, n(r.map, i.mapTransform)), r.alphaMap && (i.alphaMap.value = r.alphaMap, n(r.alphaMap, i.alphaMapTransform)), r.bumpMap && (i.bumpMap.value = r.bumpMap, n(r.bumpMap, i.bumpMapTransform), i.bumpScale.value = r.bumpScale, 1 === r.side && (i.bumpScale.value *= -1)), r.normalMap && (i.normalMap.value = r.normalMap, n(r.normalMap, i.normalMapTransform), i.normalScale.value.copy(r.normalScale), 1 === r.side && i.normalScale.value.negate()), r.displacementMap && (i.displacementMap.value = r.displacementMap, n(r.displacementMap, i.displacementMapTransform), i.displacementScale.value = r.displacementScale, i.displacementBias.value = r.displacementBias), r.emissiveMap && (i.emissiveMap.value = r.emissiveMap, n(r.emissiveMap, i.emissiveMapTransform)), r.specularMap && (i.specularMap.value = r.specularMap, n(r.specularMap, i.specularMapTransform)), r.alphaTest > 0 && (i.alphaTest.value = r.alphaTest);
                const a = e.get(r).envMap;
                if (a && (i.envMap.value = a, i.flipEnvMap.value = a.isCubeTexture && !1 === a.isRenderTargetTexture ? -1 : 1, i.reflectivity.value = r.reflectivity, i.ior.value = r.ior, i.refractionRatio.value = r.refractionRatio), r.lightMap) {
                    i.lightMap.value = r.lightMap;
                    const e = !0 === t._useLegacyLights ? Math.PI : 1;
                    i.lightMapIntensity.value = r.lightMapIntensity * e, n(r.lightMap, i.lightMapTransform)
                }
                r.aoMap && (i.aoMap.value = r.aoMap, i.aoMapIntensity.value = r.aoMapIntensity, n(r.aoMap, i.aoMapTransform))
            }
            return {
                refreshFogUniforms: function(e, n) {
                    n.color.getRGB(e.fogColor.value, Ju(t)), n.isFog ? (e.fogNear.value = n.near, e.fogFar.value = n.far) : n.isFogExp2 && (e.fogDensity.value = n.density)
                },
                refreshMaterialUniforms: function(t, r, a, s, o) {
                    r.isMeshBasicMaterial || r.isMeshLambertMaterial ? i(t, r) : r.isMeshToonMaterial ? (i(t, r), function(t, e) {
                        e.gradientMap && (t.gradientMap.value = e.gradientMap)
                    }(t, r)) : r.isMeshPhongMaterial ? (i(t, r), function(t, e) {
                        t.specular.value.copy(e.specular), t.shininess.value = Math.max(e.shininess, 1e-4)
                    }(t, r)) : r.isMeshStandardMaterial ? (i(t, r), function(t, i) {
                        t.metalness.value = i.metalness, i.metalnessMap && (t.metalnessMap.value = i.metalnessMap, n(i.metalnessMap, t.metalnessMapTransform)), t.roughness.value = i.roughness, i.roughnessMap && (t.roughnessMap.value = i.roughnessMap, n(i.roughnessMap, t.roughnessMapTransform));
                        e.get(i).envMap && (t.envMapIntensity.value = i.envMapIntensity)
                    }(t, r), r.isMeshPhysicalMaterial && function(t, e, i) {
                        t.ior.value = e.ior, e.sheen > 0 && (t.sheenColor.value.copy(e.sheenColor).multiplyScalar(e.sheen), t.sheenRoughness.value = e.sheenRoughness, e.sheenColorMap && (t.sheenColorMap.value = e.sheenColorMap, n(e.sheenColorMap, t.sheenColorMapTransform)), e.sheenRoughnessMap && (t.sheenRoughnessMap.value = e.sheenRoughnessMap, n(e.sheenRoughnessMap, t.sheenRoughnessMapTransform))), e.clearcoat > 0 && (t.clearcoat.value = e.clearcoat, t.clearcoatRoughness.value = e.clearcoatRoughness, e.clearcoatMap && (t.clearcoatMap.value = e.clearcoatMap, n(e.clearcoatMap, t.clearcoatMapTransform)), e.clearcoatRoughnessMap && (t.clearcoatRoughnessMap.value = e.clearcoatRoughnessMap, n(e.clearcoatRoughnessMap, t.clearcoatRoughnessMapTransform)), e.clearcoatNormalMap && (t.clearcoatNormalMap.value = e.clearcoatNormalMap, n(e.clearcoatNormalMap, t.clearcoatNormalMapTransform), t.clearcoatNormalScale.value.copy(e.clearcoatNormalScale), 1 === e.side && t.clearcoatNormalScale.value.negate())), e.iridescence > 0 && (t.iridescence.value = e.iridescence, t.iridescenceIOR.value = e.iridescenceIOR, t.iridescenceThicknessMinimum.value = e.iridescenceThicknessRange[0], t.iridescenceThicknessMaximum.value = e.iridescenceThicknessRange[1], e.iridescenceMap && (t.iridescenceMap.value = e.iridescenceMap, n(e.iridescenceMap, t.iridescenceMapTransform)), e.iridescenceThicknessMap && (t.iridescenceThicknessMap.value = e.iridescenceThicknessMap, n(e.iridescenceThicknessMap, t.iridescenceThicknessMapTransform))), e.transmission > 0 && (t.transmission.value = e.transmission, t.transmissionSamplerMap.value = i.texture, t.transmissionSamplerSize.value.set(i.width, i.height), e.transmissionMap && (t.transmissionMap.value = e.transmissionMap, n(e.transmissionMap, t.transmissionMapTransform)), t.thickness.value = e.thickness, e.thicknessMap && (t.thicknessMap.value = e.thicknessMap, n(e.thicknessMap, t.thicknessMapTransform)), t.attenuationDistance.value = e.attenuationDistance, t.attenuationColor.value.copy(e.attenuationColor)), e.anisotropy > 0 && (t.anisotropyVector.value.set(e.anisotropy * Math.cos(e.anisotropyRotation), e.anisotropy * Math.sin(e.anisotropyRotation)), e.anisotropyMap && (t.anisotropyMap.value = e.anisotropyMap, n(e.anisotropyMap, t.anisotropyMapTransform))), t.specularIntensity.value = e.specularIntensity, t.specularColor.value.copy(e.specularColor), e.specularColorMap && (t.specularColorMap.value = e.specularColorMap, n(e.specularColorMap, t.specularColorMapTransform)), e.specularIntensityMap && (t.specularIntensityMap.value = e.specularIntensityMap, n(e.specularIntensityMap, t.specularIntensityMapTransform))
                    }(t, r, o)) : r.isMeshMatcapMaterial ? (i(t, r), function(t, e) {
                        e.matcap && (t.matcap.value = e.matcap)
                    }(t, r)) : r.isMeshDepthMaterial ? i(t, r) : r.isMeshDistanceMaterial ? (i(t, r), function(t, n) {
                        const i = e.get(n).light;
                        t.referencePosition.value.setFromMatrixPosition(i.matrixWorld), t.nearDistance.value = i.shadow.camera.near, t.farDistance.value = i.shadow.camera.far
                    }(t, r)) : r.isMeshNormalMaterial ? i(t, r) : r.isLineBasicMaterial ? (function(t, e) {
                        t.diffuse.value.copy(e.color), t.opacity.value = e.opacity, e.map && (t.map.value = e.map, n(e.map, t.mapTransform))
                    }(t, r), r.isLineDashedMaterial && function(t, e) {
                        t.dashSize.value = e.dashSize, t.totalSize.value = e.dashSize + e.gapSize, t.scale.value = e.scale
                    }(t, r)) : r.isPointsMaterial ? function(t, e, i, r) {
                        t.diffuse.value.copy(e.color), t.opacity.value = e.opacity, t.size.value = e.size * i, t.scale.value = .5 * r, e.map && (t.map.value = e.map, n(e.map, t.uvTransform)), e.alphaMap && (t.alphaMap.value = e.alphaMap, n(e.alphaMap, t.alphaMapTransform)), e.alphaTest > 0 && (t.alphaTest.value = e.alphaTest)
                    }(t, r, a, s) : r.isSpriteMaterial ? function(t, e) {
                        t.diffuse.value.copy(e.color), t.opacity.value = e.opacity, t.rotation.value = e.rotation, e.map && (t.map.value = e.map, n(e.map, t.mapTransform)), e.alphaMap && (t.alphaMap.value = e.alphaMap, n(e.alphaMap, t.alphaMapTransform)), e.alphaTest > 0 && (t.alphaTest.value = e.alphaTest)
                    }(t, r) : r.isShadowMaterial ? (t.color.value.copy(r.color), t.opacity.value = r.opacity) : r.isShaderMaterial && (r.uniformsNeedUpdate = !1)
                }
            }
        }

        function Ef(t, e, n, i) {
            let r = {},
                a = {},
                s = [];
            const o = n.isWebGL2 ? t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS) : 0;

            function l(t, e, n) {
                const i = t.value;
                if (void 0 === n[e]) {
                    if ("number" == typeof i) n[e] = i;
                    else {
                        const t = Array.isArray(i) ? i : [i],
                            r = [];
                        for (let e = 0; e < t.length; e++) r.push(t[e].clone());
                        n[e] = r
                    }
                    return !0
                }
                if ("number" == typeof i) {
                    if (n[e] !== i) return n[e] = i, !0
                } else {
                    const t = Array.isArray(n[e]) ? n[e] : [n[e]],
                        r = Array.isArray(i) ? i : [i];
                    for (let e = 0; e < t.length; e++) {
                        const n = t[e];
                        if (!1 === n.equals(r[e])) return n.copy(r[e]), !0
                    }
                }
                return !1
            }

            function c(t) {
                const e = {
                    boundary: 0,
                    storage: 0
                };
                return "number" == typeof t ? (e.boundary = 4, e.storage = 4) : t.isVector2 ? (e.boundary = 8, e.storage = 8) : t.isVector3 || t.isColor ? (e.boundary = 16, e.storage = 12) : t.isVector4 ? (e.boundary = 16, e.storage = 16) : t.isMatrix3 ? (e.boundary = 48, e.storage = 48) : t.isMatrix4 ? (e.boundary = 64, e.storage = 64) : t.isTexture ? console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group.") : console.warn("THREE.WebGLRenderer: Unsupported uniform value type.", t), e
            }

            function u(e) {
                const n = e.target;
                n.removeEventListener("dispose", u);
                const i = s.indexOf(n.__bindingPointIndex);
                s.splice(i, 1), t.deleteBuffer(r[n.id]), delete r[n.id], delete a[n.id]
            }
            return {
                bind: function(t, e) {
                    const n = e.program;
                    i.uniformBlockBinding(t, n)
                },
                update: function(n, h) {
                    let d = r[n.id];
                    void 0 === d && (function(t) {
                        const e = t.uniforms;
                        let n = 0;
                        let i = 0;
                        for (let t = 0, r = e.length; t < r; t++) {
                            const r = e[t],
                                a = {
                                    boundary: 0,
                                    storage: 0
                                },
                                s = Array.isArray(r.value) ? r.value : [r.value];
                            for (let t = 0, e = s.length; t < e; t++) {
                                const e = c(s[t]);
                                a.boundary += e.boundary, a.storage += e.storage
                            }
                            r.__data = new Float32Array(a.storage / Float32Array.BYTES_PER_ELEMENT), r.__offset = n, t > 0 && (i = n % 16, 0 !== i && 16 - i - a.boundary < 0 && (n += 16 - i, r.__offset = n)), n += a.storage
                        }
                        i = n % 16, i > 0 && (n += 16 - i), t.__size = n, t.__cache = {}
                    }(n), d = function(e) {
                        const n = function() {
                            for (let t = 0; t < o; t++)
                                if (-1 === s.indexOf(t)) return s.push(t), t;
                            return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."), 0
                        }();
                        e.__bindingPointIndex = n;
                        const i = t.createBuffer(),
                            r = e.__size,
                            a = e.usage;
                        return t.bindBuffer(t.UNIFORM_BUFFER, i), t.bufferData(t.UNIFORM_BUFFER, r, a), t.bindBuffer(t.UNIFORM_BUFFER, null), t.bindBufferBase(t.UNIFORM_BUFFER, n, i), i
                    }(n), r[n.id] = d, n.addEventListener("dispose", u));
                    const p = h.program;
                    i.updateUBOMapping(n, p);
                    const f = e.render.frame;
                    a[n.id] !== f && (function(e) {
                        const n = r[e.id],
                            i = e.uniforms,
                            a = e.__cache;
                        t.bindBuffer(t.UNIFORM_BUFFER, n);
                        for (let e = 0, n = i.length; e < n; e++) {
                            const n = i[e];
                            if (!0 === l(n, e, a)) {
                                const e = n.__offset,
                                    i = Array.isArray(n.value) ? n.value : [n.value];
                                let r = 0;
                                for (let a = 0; a < i.length; a++) {
                                    const s = i[a],
                                        o = c(s);
                                    "number" == typeof s ? (n.__data[0] = s, t.bufferSubData(t.UNIFORM_BUFFER, e + r, n.__data)) : s.isMatrix3 ? (n.__data[0] = s.elements[0], n.__data[1] = s.elements[1], n.__data[2] = s.elements[2], n.__data[3] = s.elements[0], n.__data[4] = s.elements[3], n.__data[5] = s.elements[4], n.__data[6] = s.elements[5], n.__data[7] = s.elements[0], n.__data[8] = s.elements[6], n.__data[9] = s.elements[7], n.__data[10] = s.elements[8], n.__data[11] = s.elements[0]) : (s.toArray(n.__data, r), r += o.storage / Float32Array.BYTES_PER_ELEMENT)
                                }
                                t.bufferSubData(t.UNIFORM_BUFFER, e, n.__data)
                            }
                        }
                        t.bindBuffer(t.UNIFORM_BUFFER, null)
                    }(n), a[n.id] = f)
                },
                dispose: function() {
                    for (const e in r) t.deleteBuffer(r[e]);
                    s = [], r = {}, a = {}
                }
            }
        }
        class Tf {
            constructor(t = {}) {
                const {
                    canvas: e = jo(),
                    context: n = null,
                    depth: i = !0,
                    stencil: r = !0,
                    alpha: a = !1,
                    antialias: s = !1,
                    premultipliedAlpha: o = !0,
                    preserveDrawingBuffer: l = !1,
                    powerPreference: c = "default",
                    failIfMajorPerformanceCaveat: u = !1
                } = t;
                let h;
                this.isWebGLRenderer = !0, h = null !== n ? n.getContextAttributes().alpha : a;
                const d = new Uint32Array(4),
                    p = new Int32Array(4);
                let f = null,
                    m = null;
                const g = [],
                    _ = [];
                this.domElement = e, this.debug = {
                    checkShaderErrors: !0,
                    onShaderError: null
                }, this.autoClear = !0, this.autoClearColor = !0, this.autoClearDepth = !0, this.autoClearStencil = !0, this.sortObjects = !0, this.clippingPlanes = [], this.localClippingEnabled = !1, this.outputColorSpace = Ol, this._useLegacyLights = !1, this.toneMapping = rl, this.toneMappingExposure = 1;
                const v = this;
                let x = !1,
                    y = 0,
                    M = 0,
                    S = null,
                    E = -1,
                    T = null;
                const b = new Cu,
                    w = new Cu;
                let A = null;
                const R = new Mc(0);
                let C = 0,
                    L = e.width,
                    P = e.height,
                    U = 1,
                    D = null,
                    I = null;
                const O = new Cu(0, 0, L, P),
                    N = new Cu(0, 0, L, P);
                let F = !1;
                const z = new Ru;
                let B = !1,
                    k = !1,
                    H = null;
                const G = new Rc,
                    V = new Ql,
                    W = new bc,
                    X = {
                        background: null,
                        fog: null,
                        environment: null,
                        overrideMaterial: null,
                        isScene: !0
                    };

                function j() {
                    return null === S ? U : 1
                }
                let q, Y, K, Z, $, J, Q, tt, et, nt, it, rt, at, st, ot, lt, ct, ut, ht, dt, pt, ft, mt, gt, _t = n;

                function vt(t, n) {
                    for (let i = 0; i < t.length; i++) {
                        const r = t[i],
                            a = e.getContext(r, n);
                        if (null !== a) return a
                    }
                    return null
                }
                try {
                    const t = {
                        alpha: !0,
                        depth: i,
                        stencil: r,
                        antialias: s,
                        premultipliedAlpha: o,
                        preserveDrawingBuffer: l,
                        powerPreference: c,
                        failIfMajorPerformanceCaveat: u
                    };
                    if ("setAttribute" in e && e.setAttribute("data-engine", "three.js r156"), e.addEventListener("webglcontextlost", Mt, !1), e.addEventListener("webglcontextrestored", St, !1), e.addEventListener("webglcontextcreationerror", Et, !1), null === _t) {
                        const e = ["webgl2", "webgl", "experimental-webgl"];
                        if (!0 === v.isWebGL1Renderer && e.shift(), _t = vt(e, t), null === _t) throw vt(e) ? new Error("Error creating WebGL context with your selected attributes.") : new Error("Error creating WebGL context.")
                    }
                    "undefined" != typeof WebGLRenderingContext && _t instanceof WebGLRenderingContext && console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."), void 0 === _t.getShaderPrecisionFormat && (_t.getShaderPrecisionFormat = function() {
                        return {
                            rangeMin: 1,
                            rangeMax: 1,
                            precision: 1
                        }
                    })
                } catch (t) {
                    throw console.error("THREE.WebGLRenderer: " + t.message), t
                }

                function xt() {
                    q = new _d(_t), Y = new Yh(_t, q, t), q.init(Y), ft = new mf(_t, q, Y), K = new pf(_t, q, Y), Z = new yd(_t), $ = new Jp, J = new ff(_t, q, K, $, Y, ft, Z), Q = new id(v), tt = new gd(v), et = new Pu(_t, Y), mt = new jh(_t, q, et, Y), nt = new vd(_t, et, Z, mt), it = new bd(_t, nt, et, Z), ht = new Td(_t, Y, J), lt = new Kh($), rt = new $p(v, Q, tt, q, Y, mt, lt), at = new Sf(v, $), st = new nf, ot = new cf(q, Y), ut = new Xh(v, Q, tt, K, it, h, o), ct = new df(v, it, Y), gt = new Ef(_t, Z, Y, K), dt = new qh(_t, q, Z, Y), pt = new xd(_t, q, Z, Y), Z.programs = rt.programs, v.capabilities = Y, v.extensions = q, v.properties = $, v.renderLists = st, v.shadowMap = ct, v.state = K, v.info = Z
                }
                xt();
                const yt = new Mf(v, _t);

                function Mt(t) {
                    t.preventDefault(), console.log("THREE.WebGLRenderer: Context Lost."), x = !0
                }

                function St() {
                    console.log("THREE.WebGLRenderer: Context Restored."), x = !1;
                    const t = Z.autoReset,
                        e = ct.enabled,
                        n = ct.autoUpdate,
                        i = ct.needsUpdate,
                        r = ct.type;
                    xt(), Z.autoReset = t, ct.enabled = e, ct.autoUpdate = n, ct.needsUpdate = i, ct.type = r
                }

                function Et(t) {
                    console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ", t.statusMessage)
                }

                function Tt(t) {
                    const e = t.target;
                    e.removeEventListener("dispose", Tt),
                        function(t) {
                            (function(t) {
                                const e = $.get(t).programs;
                                void 0 !== e && (e.forEach((function(t) {
                                    rt.releaseProgram(t)
                                })), t.isShaderMaterial && rt.releaseShaderCache(t))
                            })(t), $.remove(t)
                        }(e)
                }
                this.xr = yt, this.getContext = function() {
                    return _t
                }, this.getContextAttributes = function() {
                    return _t.getContextAttributes()
                }, this.forceContextLoss = function() {
                    const t = q.get("WEBGL_lose_context");
                    t && t.loseContext()
                }, this.forceContextRestore = function() {
                    const t = q.get("WEBGL_lose_context");
                    t && t.restoreContext()
                }, this.getPixelRatio = function() {
                    return U
                }, this.setPixelRatio = function(t) {
                    void 0 !== t && (U = t, this.setSize(L, P, !1))
                }, this.getSize = function(t) {
                    return t.set(L, P)
                }, this.setSize = function(t, n, i = !0) {
                    yt.isPresenting ? console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.") : (L = t, P = n, e.width = Math.floor(t * U), e.height = Math.floor(n * U), !0 === i && (e.style.width = t + "px", e.style.height = n + "px"), this.setViewport(0, 0, t, n))
                }, this.getDrawingBufferSize = function(t) {
                    return t.set(L * U, P * U).floor()
                }, this.setDrawingBufferSize = function(t, n, i) {
                    L = t, P = n, U = i, e.width = Math.floor(t * i), e.height = Math.floor(n * i), this.setViewport(0, 0, t, n)
                }, this.getCurrentViewport = function(t) {
                    return t.copy(b)
                }, this.getViewport = function(t) {
                    return t.copy(O)
                }, this.setViewport = function(t, e, n, i) {
                    t.isVector4 ? O.set(t.x, t.y, t.z, t.w) : O.set(t, e, n, i), K.viewport(b.copy(O).multiplyScalar(U).floor())
                }, this.getScissor = function(t) {
                    return t.copy(N)
                }, this.setScissor = function(t, e, n, i) {
                    t.isVector4 ? N.set(t.x, t.y, t.z, t.w) : N.set(t, e, n, i), K.scissor(w.copy(N).multiplyScalar(U).floor())
                }, this.getScissorTest = function() {
                    return F
                }, this.setScissorTest = function(t) {
                    K.setScissorTest(F = t)
                }, this.setOpaqueSort = function(t) {
                    D = t
                }, this.setTransparentSort = function(t) {
                    I = t
                }, this.getClearColor = function(t) {
                    return t.copy(ut.getClearColor())
                }, this.setClearColor = function() {
                    ut.setClearColor.apply(ut, arguments)
                }, this.getClearAlpha = function() {
                    return ut.getClearAlpha()
                }, this.setClearAlpha = function() {
                    ut.setClearAlpha.apply(ut, arguments)
                }, this.clear = function(t = !0, e = !0, n = !0) {
                    let i = 0;
                    if (t) {
                        let t = !1;
                        if (null !== S) {
                            const e = S.texture.format;
                            t = 1033 === e || 1031 === e || 1029 === e
                        }
                        if (t) {
                            const t = S.texture.type,
                                e = t === yl || t === Sl || t === Ml || t === bl || 1017 === t || 1018 === t,
                                n = ut.getClearColor(),
                                i = ut.getClearAlpha(),
                                r = n.r,
                                a = n.g,
                                s = n.b;
                            e ? (d[0] = r, d[1] = a, d[2] = s, d[3] = i, _t.clearBufferuiv(_t.COLOR, 0, d)) : (p[0] = r, p[1] = a, p[2] = s, p[3] = i, _t.clearBufferiv(_t.COLOR, 0, p))
                        } else i |= _t.COLOR_BUFFER_BIT
                    }
                    e && (i |= _t.DEPTH_BUFFER_BIT), n && (i |= _t.STENCIL_BUFFER_BIT), _t.clear(i)
                }, this.clearColor = function() {
                    this.clear(!0, !1, !1)
                }, this.clearDepth = function() {
                    this.clear(!1, !0, !1)
                }, this.clearStencil = function() {
                    this.clear(!1, !1, !0)
                }, this.dispose = function() {
                    e.removeEventListener("webglcontextlost", Mt, !1), e.removeEventListener("webglcontextrestored", St, !1), e.removeEventListener("webglcontextcreationerror", Et, !1), st.dispose(), ot.dispose(), $.dispose(), Q.dispose(), tt.dispose(), it.dispose(), mt.dispose(), gt.dispose(), rt.dispose(), yt.dispose(), yt.removeEventListener("sessionstart", wt), yt.removeEventListener("sessionend", At), H && (H.dispose(), H = null), Rt.stop()
                }, this.renderBufferDirect = function(t, e, n, i, r, a) {
                    null === e && (e = X);
                    const s = r.isMesh && r.matrixWorld.determinant() < 0,
                        o = function(t, e, n, i, r) {
                            !0 !== e.isScene && (e = X), J.resetTextureUnits();
                            const a = e.fog,
                                s = i.isMeshStandardMaterial ? e.environment : null,
                                o = null === S ? v.outputColorSpace : !0 === S.isXRRenderTarget ? S.texture.colorSpace : Nl,
                                l = (i.isMeshStandardMaterial ? tt : Q).get(i.envMap || s),
                                c = !0 === i.vertexColors && !!n.attributes.color && 4 === n.attributes.color.itemSize,
                                u = !!n.attributes.tangent && (!!i.normalMap || i.anisotropy > 0),
                                h = !!n.morphAttributes.position,
                                d = !!n.morphAttributes.normal,
                                p = !!n.morphAttributes.color;
                            let f = rl;
                            i.toneMapped && (null !== S && !0 !== S.isXRRenderTarget || (f = v.toneMapping));
                            const g = n.morphAttributes.position || n.morphAttributes.normal || n.morphAttributes.color,
                                _ = void 0 !== g ? g.length : 0,
                                x = $.get(i),
                                y = m.state.lights;
                            if (!0 === B && (!0 === k || t !== T)) {
                                const e = t === T && i.id === E;
                                lt.setState(i, t, e)
                            }
                            let M = !1;
                            i.version === x.__version ? x.needsLights && x.lightsStateVersion !== y.state.version || x.outputColorSpace !== o || r.isInstancedMesh && !1 === x.instancing ? M = !0 : r.isInstancedMesh || !0 !== x.instancing ? r.isSkinnedMesh && !1 === x.skinning ? M = !0 : r.isSkinnedMesh || !0 !== x.skinning ? r.isInstancedMesh && !0 === x.instancingColor && null === r.instanceColor || r.isInstancedMesh && !1 === x.instancingColor && null !== r.instanceColor || x.envMap !== l || !0 === i.fog && x.fog !== a ? M = !0 : void 0 === x.numClippingPlanes || x.numClippingPlanes === lt.numPlanes && x.numIntersection === lt.numIntersection ? (x.vertexAlphas !== c || x.vertexTangents !== u || x.morphTargets !== h || x.morphNormals !== d || x.morphColors !== p || x.toneMapping !== f || !0 === Y.isWebGL2 && x.morphTargetsCount !== _) && (M = !0) : M = !0 : M = !0 : M = !0 : (M = !0, x.__version = i.version);
                            let b = x.currentProgram;
                            !0 === M && (b = Dt(i, e, r));
                            let w = !1,
                                A = !1,
                                R = !1;
                            const C = b.getUniforms(),
                                L = x.uniforms;
                            if (K.useProgram(b.program) && (w = !0, A = !0, R = !0), i.id !== E && (E = i.id, A = !0), w || T !== t) {
                                C.setValue(_t, "projectionMatrix", t.projectionMatrix), C.setValue(_t, "viewMatrix", t.matrixWorldInverse);
                                const e = C.map.cameraPosition;
                                void 0 !== e && e.setValue(_t, W.setFromMatrixPosition(t.matrixWorld)), Y.logarithmicDepthBuffer && C.setValue(_t, "logDepthBufFC", 2 / (Math.log(t.far + 1) / Math.LN2)), (i.isMeshPhongMaterial || i.isMeshToonMaterial || i.isMeshLambertMaterial || i.isMeshBasicMaterial || i.isMeshStandardMaterial || i.isShaderMaterial) && C.setValue(_t, "isOrthographic", !0 === t.isOrthographicCamera), T !== t && (T = t, A = !0, R = !0)
                            }
                            if (r.isSkinnedMesh) {
                                C.setOptional(_t, r, "bindMatrix"), C.setOptional(_t, r, "bindMatrixInverse");
                                const t = r.skeleton;
                                t && (Y.floatVertexTextures ? (null === t.boneTexture && t.computeBoneTexture(), C.setValue(_t, "boneTexture", t.boneTexture, J), C.setValue(_t, "boneTextureSize", t.boneTextureSize)) : console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))
                            }
                            const D = n.morphAttributes;
                            var I, O;
                            if ((void 0 !== D.position || void 0 !== D.normal || void 0 !== D.color && !0 === Y.isWebGL2) && ht.update(r, n, b), (A || x.receiveShadow !== r.receiveShadow) && (x.receiveShadow = r.receiveShadow, C.setValue(_t, "receiveShadow", r.receiveShadow)), i.isMeshGouraudMaterial && null !== i.envMap && (L.envMap.value = l, L.flipEnvMap.value = l.isCubeTexture && !1 === l.isRenderTargetTexture ? -1 : 1), A && (C.setValue(_t, "toneMappingExposure", v.toneMappingExposure), x.needsLights && (O = R, (I = L).ambientLightColor.needsUpdate = O, I.lightProbe.needsUpdate = O, I.directionalLights.needsUpdate = O, I.directionalLightShadows.needsUpdate = O, I.pointLights.needsUpdate = O, I.pointLightShadows.needsUpdate = O, I.spotLights.needsUpdate = O, I.spotLightShadows.needsUpdate = O, I.rectAreaLights.needsUpdate = O, I.hemisphereLights.needsUpdate = O), a && !0 === i.fog && at.refreshFogUniforms(L, a), at.refreshMaterialUniforms(L, i, U, P, H), Lp.upload(_t, x.uniformsList, L, J)), i.isShaderMaterial && !0 === i.uniformsNeedUpdate && (Lp.upload(_t, x.uniformsList, L, J), i.uniformsNeedUpdate = !1), i.isSpriteMaterial && C.setValue(_t, "center", r.center), C.setValue(_t, "modelViewMatrix", r.modelViewMatrix), C.setValue(_t, "normalMatrix", r.normalMatrix), C.setValue(_t, "modelMatrix", r.matrixWorld), i.isShaderMaterial || i.isRawShaderMaterial) {
                                const t = i.uniformsGroups;
                                for (let e = 0, n = t.length; e < n; e++)
                                    if (Y.isWebGL2) {
                                        const n = t[e];
                                        gt.update(n, b), gt.bind(n, b)
                                    } else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")
                            }
                            return b
                        }(t, e, n, i, r);
                    K.setMaterial(i, s);
                    let l = n.index,
                        c = 1;
                    if (!0 === i.wireframe) {
                        if (l = nt.getWireframeAttribute(n), void 0 === l) return;
                        c = 2
                    }
                    const u = n.drawRange,
                        h = n.attributes.position;
                    let d = u.start * c,
                        p = (u.start + u.count) * c;
                    null !== a && (d = Math.max(d, a.start * c), p = Math.min(p, (a.start + a.count) * c)), null !== l ? (d = Math.max(d, 0), p = Math.min(p, l.count)) : null != h && (d = Math.max(d, 0), p = Math.min(p, h.count));
                    const f = p - d;
                    if (f < 0 || f === 1 / 0) return;
                    let g;
                    mt.setup(r, i, o, n, l);
                    let _ = dt;
                    if (null !== l && (g = et.get(l), _ = pt, _.setIndex(g)), r.isMesh) !0 === i.wireframe ? (K.setLineWidth(i.wireframeLinewidth * j()), _.setMode(_t.LINES)) : _.setMode(_t.TRIANGLES);
                    else if (r.isLine) {
                        let t = i.linewidth;
                        void 0 === t && (t = 1), K.setLineWidth(t * j()), r.isLineSegments ? _.setMode(_t.LINES) : r.isLineLoop ? _.setMode(_t.LINE_LOOP) : _.setMode(_t.LINE_STRIP)
                    } else r.isPoints ? _.setMode(_t.POINTS) : r.isSprite && _.setMode(_t.TRIANGLES);
                    if (r.isInstancedMesh) _.renderInstances(d, f, r.count);
                    else if (n.isInstancedBufferGeometry) {
                        const t = void 0 !== n._maxInstanceCount ? n._maxInstanceCount : 1 / 0,
                            e = Math.min(n.instanceCount, t);
                        _.renderInstances(d, f, e)
                    } else _.render(d, f)
                }, this.compile = function(t, e) {
                    function n(t, e, n) {
                        !0 === t.transparent && 2 === t.side && !1 === t.forceSinglePass ? (t.side = 1, t.needsUpdate = !0, Dt(t, e, n), t.side = 0, t.needsUpdate = !0, Dt(t, e, n), t.side = 2) : Dt(t, e, n)
                    }
                    m = ot.get(t), m.init(), _.push(m), t.traverseVisible((function(t) {
                        t.isLight && t.layers.test(e.layers) && (m.pushLight(t), t.castShadow && m.pushShadow(t))
                    })), m.setupLights(v._useLegacyLights), t.traverse((function(e) {
                        const i = e.material;
                        if (i)
                            if (Array.isArray(i))
                                for (let r = 0; r < i.length; r++) n(i[r], t, e);
                            else n(i, t, e)
                    })), _.pop(), m = null
                };
                let bt = null;

                function wt() {
                    Rt.stop()
                }

                function At() {
                    Rt.start()
                }
                const Rt = new Lu;

                function Ct(t, e, n, i) {
                    if (!1 === t.visible) return;
                    if (t.layers.test(e.layers))
                        if (t.isGroup) n = t.renderOrder;
                        else if (t.isLOD) !0 === t.autoUpdate && t.update(e);
                    else if (t.isLight) m.pushLight(t), t.castShadow && m.pushShadow(t);
                    else if (t.isSprite) {
                        if (!t.frustumCulled || z.intersectsSprite(t)) {
                            i && W.setFromMatrixPosition(t.matrixWorld).applyMatrix4(G);
                            const e = it.update(t),
                                r = t.material;
                            r.visible && f.push(t, e, r, n, W.z, null)
                        }
                    } else if ((t.isMesh || t.isLine || t.isPoints) && (!t.frustumCulled || z.intersectsObject(t))) {
                        const e = it.update(t),
                            r = t.material;
                        if (i && (void 0 !== t.boundingSphere ? (null === t.boundingSphere && t.computeBoundingSphere(), W.copy(t.boundingSphere.center)) : (null === e.boundingSphere && e.computeBoundingSphere(), W.copy(e.boundingSphere.center)), W.applyMatrix4(t.matrixWorld).applyMatrix4(G)), Array.isArray(r)) {
                            const i = e.groups;
                            for (let a = 0, s = i.length; a < s; a++) {
                                const s = i[a],
                                    o = r[s.materialIndex];
                                o && o.visible && f.push(t, e, o, n, W.z, s)
                            }
                        } else r.visible && f.push(t, e, r, n, W.z, null)
                    }
                    const r = t.children;
                    for (let t = 0, a = r.length; t < a; t++) Ct(r[t], e, n, i)
                }

                function Lt(t, e, n, i) {
                    const r = t.opaque,
                        a = t.transmissive,
                        s = t.transparent;
                    m.setupLightsView(n), !0 === B && lt.setGlobalState(v.clippingPlanes, n), a.length > 0 && function(t, e, n, i) {
                        const r = Y.isWebGL2;
                        null === H && (H = new $h(1, 1, {
                            generateMipmaps: !0,
                            type: q.has("EXT_color_buffer_half_float") ? Tl : yl,
                            minFilter: xl,
                            samples: r ? 4 : 0
                        })), v.getDrawingBufferSize(V), r ? H.setSize(V.x, V.y) : H.setSize(Zl(V.x), Zl(V.y));
                        const a = v.getRenderTarget();
                        v.setRenderTarget(H), v.getClearColor(R), C = v.getClearAlpha(), C < 1 && v.setClearColor(16777215, .5), v.clear();
                        const s = v.toneMapping;
                        v.toneMapping = rl, Pt(t, n, i), J.updateMultisampleRenderTarget(H), J.updateRenderTargetMipmap(H);
                        let o = !1;
                        for (let t = 0, r = e.length; t < r; t++) {
                            const r = e[t],
                                a = r.object,
                                s = r.geometry,
                                l = r.material,
                                c = r.group;
                            if (2 === l.side && a.layers.test(i.layers)) {
                                const t = l.side;
                                l.side = 1, l.needsUpdate = !0, Ut(a, n, i, s, l, c), l.side = t, l.needsUpdate = !0, o = !0
                            }
                        }!0 === o && (J.updateMultisampleRenderTarget(H), J.updateRenderTargetMipmap(H)), v.setRenderTarget(a), v.setClearColor(R, C), v.toneMapping = s
                    }(r, a, e, n), i && K.viewport(b.copy(i)), r.length > 0 && Pt(r, e, n), a.length > 0 && Pt(a, e, n), s.length > 0 && Pt(s, e, n), K.buffers.depth.setTest(!0), K.buffers.depth.setMask(!0), K.buffers.color.setMask(!0), K.setPolygonOffset(!1)
                }

                function Pt(t, e, n) {
                    const i = !0 === e.isScene ? e.overrideMaterial : null;
                    for (let r = 0, a = t.length; r < a; r++) {
                        const a = t[r],
                            s = a.object,
                            o = a.geometry,
                            l = null === i ? a.material : i,
                            c = a.group;
                        s.layers.test(n.layers) && Ut(s, e, n, o, l, c)
                    }
                }

                function Ut(t, e, n, i, r, a) {
                    t.onBeforeRender(v, e, n, i, r, a), t.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse, t.matrixWorld), t.normalMatrix.getNormalMatrix(t.modelViewMatrix), r.onBeforeRender(v, e, n, i, t, a), !0 === r.transparent && 2 === r.side && !1 === r.forceSinglePass ? (r.side = 1, r.needsUpdate = !0, v.renderBufferDirect(n, e, i, r, t, a), r.side = 0, r.needsUpdate = !0, v.renderBufferDirect(n, e, i, r, t, a), r.side = 2) : v.renderBufferDirect(n, e, i, r, t, a), t.onAfterRender(v, e, n, i, r, a)
                }

                function Dt(t, e, n) {
                    !0 !== e.isScene && (e = X);
                    const i = $.get(t),
                        r = m.state.lights,
                        a = m.state.shadowsArray,
                        s = r.state.version,
                        o = rt.getParameters(t, r.state, a, e, n),
                        l = rt.getProgramCacheKey(o);
                    let c = i.programs;
                    i.environment = t.isMeshStandardMaterial ? e.environment : null, i.fog = e.fog, i.envMap = (t.isMeshStandardMaterial ? tt : Q).get(t.envMap || i.environment), void 0 === c && (t.addEventListener("dispose", Tt), c = new Map, i.programs = c);
                    let u = c.get(l);
                    if (void 0 !== u) {
                        if (i.currentProgram === u && i.lightsStateVersion === s) return It(t, o), u
                    } else o.uniforms = rt.getUniforms(t), t.onBuild(n, o, v), t.onBeforeCompile(o, v), u = rt.acquireProgram(o, l), c.set(l, u), i.uniforms = o.uniforms;
                    const h = i.uniforms;
                    (t.isShaderMaterial || t.isRawShaderMaterial) && !0 !== t.clipping || (h.clippingPlanes = lt.uniform), It(t, o), i.needsLights = function(t) {
                        return t.isMeshLambertMaterial || t.isMeshToonMaterial || t.isMeshPhongMaterial || t.isMeshStandardMaterial || t.isShadowMaterial || t.isShaderMaterial && !0 === t.lights
                    }(t), i.lightsStateVersion = s, i.needsLights && (h.ambientLightColor.value = r.state.ambient, h.lightProbe.value = r.state.probe, h.directionalLights.value = r.state.directional, h.directionalLightShadows.value = r.state.directionalShadow, h.spotLights.value = r.state.spot, h.spotLightShadows.value = r.state.spotShadow, h.rectAreaLights.value = r.state.rectArea, h.ltc_1.value = r.state.rectAreaLTC1, h.ltc_2.value = r.state.rectAreaLTC2, h.pointLights.value = r.state.point, h.pointLightShadows.value = r.state.pointShadow, h.hemisphereLights.value = r.state.hemi, h.directionalShadowMap.value = r.state.directionalShadowMap, h.directionalShadowMatrix.value = r.state.directionalShadowMatrix, h.spotShadowMap.value = r.state.spotShadowMap, h.spotLightMatrix.value = r.state.spotLightMatrix, h.spotLightMap.value = r.state.spotLightMap, h.pointShadowMap.value = r.state.pointShadowMap, h.pointShadowMatrix.value = r.state.pointShadowMatrix);
                    const d = u.getUniforms(),
                        p = Lp.seqWithValue(d.seq, h);
                    return i.currentProgram = u, i.uniformsList = p, u
                }

                function It(t, e) {
                    const n = $.get(t);
                    n.outputColorSpace = e.outputColorSpace, n.instancing = e.instancing, n.instancingColor = e.instancingColor, n.skinning = e.skinning, n.morphTargets = e.morphTargets, n.morphNormals = e.morphNormals, n.morphColors = e.morphColors, n.morphTargetsCount = e.morphTargetsCount, n.numClippingPlanes = e.numClippingPlanes, n.numIntersection = e.numClipIntersection, n.vertexAlphas = e.vertexAlphas, n.vertexTangents = e.vertexTangents, n.toneMapping = e.toneMapping
                }
                Rt.setAnimationLoop((function(t) {
                    bt && bt(t)
                })), "undefined" != typeof self && Rt.setContext(self), this.setAnimationLoop = function(t) {
                    bt = t, yt.setAnimationLoop(t), null === t ? Rt.stop() : Rt.start()
                }, yt.addEventListener("sessionstart", wt), yt.addEventListener("sessionend", At), this.render = function(t, e) {
                    if (void 0 !== e && !0 !== e.isCamera) return void console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");
                    if (!0 === x) return;
                    !0 === t.matrixWorldAutoUpdate && t.updateMatrixWorld(), null === e.parent && !0 === e.matrixWorldAutoUpdate && e.updateMatrixWorld(), !0 === yt.enabled && !0 === yt.isPresenting && (!0 === yt.cameraAutoUpdate && yt.updateCamera(e), e = yt.getCamera()), !0 === t.isScene && t.onBeforeRender(v, t, e, S), m = ot.get(t, _.length), m.init(), _.push(m), G.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse), z.setFromProjectionMatrix(G), k = this.localClippingEnabled, B = lt.init(this.clippingPlanes, k), f = st.get(t, g.length), f.init(), g.push(f), Ct(t, e, 0, v.sortObjects), f.finish(), !0 === v.sortObjects && f.sort(D, I), this.info.render.frame++, !0 === B && lt.beginShadows();
                    const n = m.state.shadowsArray;
                    if (ct.render(n, t, e), !0 === B && lt.endShadows(), !0 === this.info.autoReset && this.info.reset(), ut.render(f, t), m.setupLights(v._useLegacyLights), e.isArrayCamera) {
                        const n = e.cameras;
                        for (let e = 0, i = n.length; e < i; e++) {
                            const i = n[e];
                            Lt(f, t, i, i.viewport)
                        }
                    } else Lt(f, t, e);
                    null !== S && (J.updateMultisampleRenderTarget(S), J.updateRenderTargetMipmap(S)), !0 === t.isScene && t.onAfterRender(v, t, e), mt.resetDefaultState(), E = -1, T = null, _.pop(), m = _.length > 0 ? _[_.length - 1] : null, g.pop(), f = g.length > 0 ? g[g.length - 1] : null
                }, this.getActiveCubeFace = function() {
                    return y
                }, this.getActiveMipmapLevel = function() {
                    return M
                }, this.getRenderTarget = function() {
                    return S
                }, this.setRenderTargetTextures = function(t, e, n) {
                    $.get(t.texture).__webglTexture = e, $.get(t.depthTexture).__webglTexture = n;
                    const i = $.get(t);
                    i.__hasExternalTextures = !0, i.__hasExternalTextures && (i.__autoAllocateDepthBuffer = void 0 === n, i.__autoAllocateDepthBuffer || !0 === q.has("WEBGL_multisampled_render_to_texture") && (console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"), i.__useRenderToTexture = !1))
                }, this.setRenderTargetFramebuffer = function(t, e) {
                    const n = $.get(t);
                    n.__webglFramebuffer = e, n.__useDefaultFramebuffer = void 0 === e
                }, this.setRenderTarget = function(t, e = 0, n = 0) {
                    S = t, y = e, M = n;
                    let i = !0,
                        r = null,
                        a = !1,
                        s = !1;
                    if (t) {
                        const o = $.get(t);
                        void 0 !== o.__useDefaultFramebuffer ? (K.bindFramebuffer(_t.FRAMEBUFFER, null), i = !1) : void 0 === o.__webglFramebuffer ? J.setupRenderTarget(t) : o.__hasExternalTextures && J.rebindTextures(t, $.get(t.texture).__webglTexture, $.get(t.depthTexture).__webglTexture);
                        const l = t.texture;
                        (l.isData3DTexture || l.isDataArrayTexture || l.isCompressedArrayTexture) && (s = !0);
                        const c = $.get(t).__webglFramebuffer;
                        t.isWebGLCubeRenderTarget ? (r = Array.isArray(c[e]) ? c[e][n] : c[e], a = !0) : r = Y.isWebGL2 && t.samples > 0 && !1 === J.useMultisampledRTT(t) ? $.get(t).__webglMultisampledFramebuffer : Array.isArray(c) ? c[n] : c, b.copy(t.viewport), w.copy(t.scissor), A = t.scissorTest
                    } else b.copy(O).multiplyScalar(U).floor(), w.copy(N).multiplyScalar(U).floor(), A = F;
                    if (K.bindFramebuffer(_t.FRAMEBUFFER, r) && Y.drawBuffers && i && K.drawBuffers(t, r), K.viewport(b), K.scissor(w), K.setScissorTest(A), a) {
                        const i = $.get(t.texture);
                        _t.framebufferTexture2D(_t.FRAMEBUFFER, _t.COLOR_ATTACHMENT0, _t.TEXTURE_CUBE_MAP_POSITIVE_X + e, i.__webglTexture, n)
                    } else if (s) {
                        const i = $.get(t.texture),
                            r = e || 0;
                        _t.framebufferTextureLayer(_t.FRAMEBUFFER, _t.COLOR_ATTACHMENT0, i.__webglTexture, n || 0, r)
                    }
                    E = -1
                }, this.readRenderTargetPixels = function(t, e, n, i, r, a, s) {
                    if (!t || !t.isWebGLRenderTarget) return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
                    let o = $.get(t).__webglFramebuffer;
                    if (t.isWebGLCubeRenderTarget && void 0 !== s && (o = o[s]), o) {
                        K.bindFramebuffer(_t.FRAMEBUFFER, o);
                        try {
                            const s = t.texture,
                                o = s.format,
                                l = s.type;
                            if (o !== wl && ft.convert(o) !== _t.getParameter(_t.IMPLEMENTATION_COLOR_READ_FORMAT)) return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");
                            const c = l === Tl && (q.has("EXT_color_buffer_half_float") || Y.isWebGL2 && q.has("EXT_color_buffer_float"));
                            if (!(l === yl || ft.convert(l) === _t.getParameter(_t.IMPLEMENTATION_COLOR_READ_TYPE) || l === El && (Y.isWebGL2 || q.has("OES_texture_float") || q.has("WEBGL_color_buffer_float")) || c)) return void console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");
                            e >= 0 && e <= t.width - i && n >= 0 && n <= t.height - r && _t.readPixels(e, n, i, r, ft.convert(o), ft.convert(l), a)
                        } finally {
                            const t = null !== S ? $.get(S).__webglFramebuffer : null;
                            K.bindFramebuffer(_t.FRAMEBUFFER, t)
                        }
                    }
                }, this.copyFramebufferToTexture = function(t, e, n = 0) {
                    const i = Math.pow(2, -n),
                        r = Math.floor(e.image.width * i),
                        a = Math.floor(e.image.height * i);
                    J.setTexture2D(e, 0), _t.copyTexSubImage2D(_t.TEXTURE_2D, n, 0, 0, t.x, t.y, r, a), K.unbindTexture()
                }, this.copyTextureToTexture = function(t, e, n, i = 0) {
                    const r = e.image.width,
                        a = e.image.height,
                        s = ft.convert(n.format),
                        o = ft.convert(n.type);
                    J.setTexture2D(n, 0), _t.pixelStorei(_t.UNPACK_FLIP_Y_WEBGL, n.flipY), _t.pixelStorei(_t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, n.premultiplyAlpha), _t.pixelStorei(_t.UNPACK_ALIGNMENT, n.unpackAlignment), e.isDataTexture ? _t.texSubImage2D(_t.TEXTURE_2D, i, t.x, t.y, r, a, s, o, e.image.data) : e.isCompressedTexture ? _t.compressedTexSubImage2D(_t.TEXTURE_2D, i, t.x, t.y, e.mipmaps[0].width, e.mipmaps[0].height, s, e.mipmaps[0].data) : _t.texSubImage2D(_t.TEXTURE_2D, i, t.x, t.y, s, o, e.image), 0 === i && n.generateMipmaps && _t.generateMipmap(_t.TEXTURE_2D), K.unbindTexture()
                }, this.copyTextureToTexture3D = function(t, e, n, i, r = 0) {
                    if (v.isWebGL1Renderer) return void console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");
                    const a = t.max.x - t.min.x + 1,
                        s = t.max.y - t.min.y + 1,
                        o = t.max.z - t.min.z + 1,
                        l = ft.convert(i.format),
                        c = ft.convert(i.type);
                    let u;
                    if (i.isData3DTexture) J.setTexture3D(i, 0), u = _t.TEXTURE_3D;
                    else {
                        if (!i.isDataArrayTexture) return void console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");
                        J.setTexture2DArray(i, 0), u = _t.TEXTURE_2D_ARRAY
                    }
                    _t.pixelStorei(_t.UNPACK_FLIP_Y_WEBGL, i.flipY), _t.pixelStorei(_t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, i.premultiplyAlpha), _t.pixelStorei(_t.UNPACK_ALIGNMENT, i.unpackAlignment);
                    const h = _t.getParameter(_t.UNPACK_ROW_LENGTH),
                        d = _t.getParameter(_t.UNPACK_IMAGE_HEIGHT),
                        p = _t.getParameter(_t.UNPACK_SKIP_PIXELS),
                        f = _t.getParameter(_t.UNPACK_SKIP_ROWS),
                        m = _t.getParameter(_t.UNPACK_SKIP_IMAGES),
                        g = n.isCompressedTexture ? n.mipmaps[0] : n.image;
                    _t.pixelStorei(_t.UNPACK_ROW_LENGTH, g.width), _t.pixelStorei(_t.UNPACK_IMAGE_HEIGHT, g.height), _t.pixelStorei(_t.UNPACK_SKIP_PIXELS, t.min.x), _t.pixelStorei(_t.UNPACK_SKIP_ROWS, t.min.y), _t.pixelStorei(_t.UNPACK_SKIP_IMAGES, t.min.z), n.isDataTexture || n.isData3DTexture ? _t.texSubImage3D(u, r, e.x, e.y, e.z, a, s, o, l, c, g.data) : n.isCompressedArrayTexture ? (console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."), _t.compressedTexSubImage3D(u, r, e.x, e.y, e.z, a, s, o, l, g.data)) : _t.texSubImage3D(u, r, e.x, e.y, e.z, a, s, o, l, c, g), _t.pixelStorei(_t.UNPACK_ROW_LENGTH, h), _t.pixelStorei(_t.UNPACK_IMAGE_HEIGHT, d), _t.pixelStorei(_t.UNPACK_SKIP_PIXELS, p), _t.pixelStorei(_t.UNPACK_SKIP_ROWS, f), _t.pixelStorei(_t.UNPACK_SKIP_IMAGES, m), 0 === r && i.generateMipmaps && _t.generateMipmap(u), K.unbindTexture()
                }, this.initTexture = function(t) {
                    t.isCubeTexture ? J.setTextureCube(t, 0) : t.isData3DTexture ? J.setTexture3D(t, 0) : t.isDataArrayTexture || t.isCompressedArrayTexture ? J.setTexture2DArray(t, 0) : J.setTexture2D(t, 0), K.unbindTexture()
                }, this.resetState = function() {
                    y = 0, M = 0, S = null, K.reset(), mt.reset()
                }, "undefined" != typeof __THREE_DEVTOOLS__ && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", {
                    detail: this
                }))
            }
            get coordinateSystem() {
                return Hl
            }
            get physicallyCorrectLights() {
                return console.warn("THREE.WebGLRenderer: The property .physicallyCorrectLights has been removed. Set renderer.useLegacyLights instead."), !this.useLegacyLights
            }
            set physicallyCorrectLights(t) {
                console.warn("THREE.WebGLRenderer: The property .physicallyCorrectLights has been removed. Set renderer.useLegacyLights instead."), this.useLegacyLights = !t
            }
            get outputEncoding() {
                return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."), this.outputColorSpace === Ol ? Il : 3e3
            }
            set outputEncoding(t) {
                console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."), this.outputColorSpace = t === Il ? Ol : Nl
            }
            get useLegacyLights() {
                return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."), this._useLegacyLights
            }
            set useLegacyLights(t) {
                console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."), this._useLegacyLights = t
            }
        }
        class bf {
            constructor() {
                this.$container = document.getElementById("Background"), this.setConfig(), this.scene = new tu, this.camera = new nu(-1, 1, 1, -1, .1, 1e4), this.camera.position.set(0, 0, 10), this.renderer = new Tf({
                    canvas: this.$container.querySelector("canvas"),
                    alpha: !0
                }), this.renderer.setSize(Ec.width, Ec.height), this.renderer.setPixelRatio(Ec.dpr)
            }
            setConfig() {
                const {
                    width: t,
                    height: e
                } = this.$container.getBoundingClientRect();
                Ec.dpr = Math.min(window.devicePixelRatio, 1.5), Ec.width = t, Ec.height = e, Ec.halfWidth = Ec.width / 2, Ec.halfHeight = Ec.height / 2, Ec.aspectRatio = Ec.width / Ec.height
            }
            resizeScene() {
                window.innerWidth >= window.innerHeight ? (this.camera.left = -1, this.camera.right = 1, this.camera.top = 1 / Ec.aspectRatio, this.camera.bottom = -1 / Ec.aspectRatio, Ec.sceneWidth = 2, Ec.sceneHeight = 2 / Ec.aspectRatio) : (this.camera.left = -1 * Ec.aspectRatio, this.camera.right = 1 * Ec.aspectRatio, this.camera.top = 1, this.camera.bottom = -1, Ec.sceneWidth = 2 * Ec.aspectRatio, Ec.sceneHeight = 2), this.camera.aspect = Ec.aspectRatio, this.camera.updateProjectionMatrix(), this.renderer.setSize(Ec.width, Ec.height)
            }
        }
        class wf extends th {
            constructor(t) {
                super(t), this.isRawShaderMaterial = !0, this.type = "RawShaderMaterial"
            }
        }
        var Af = n(60),
            Rf = n.n(Af),
            Cf = n(575),
            Lf = n.n(Cf);
        class Pf extends Bh {
            constructor({
                grain: t,
                blur: e
            }) {
                super(), this.geometry = new qu(3, 3), this.material = new wf({
                    uniforms: {
                        grainTex: {
                            value: t
                        },
                        blurTex: {
                            value: e
                        },
                        time: {
                            value: 0
                        },
                        seed: {
                            value: 100 * Math.random()
                        },
                        back: {
                            value: new bc(.05, .05, .05)
                        },
                        style: {
                            value: 0
                        },
                        param1: {
                            value: 0
                        },
                        param2: {
                            value: 0
                        },
                        param3: {
                            value: 0
                        }
                    },
                    vertexShader: Rf(),
                    fragmentShader: Lf(),
                    transparent: !0
                }), this.position.x = -.8, this.position.y = -.5, this.position.z = 1
            }
            changeStyle(t) {
                this.material.uniforms.style.value = t
            }
            update(t) {
                this.material.uniforms.time.value = t, this.material.uniforms.back.value.x = Ec.backColor.r, this.material.uniforms.back.value.y = Ec.backColor.g, this.material.uniforms.back.value.z = Ec.backColor.b, this.material.uniforms.param1.value = Ec.params.param1, this.material.uniforms.param2.value = Ec.params.param2, this.material.uniforms.param3.value = Ec.params.param3
            }
        }
        const Uf = new class extends bf {
                constructor() {
                    super(), this.rect = null, this.circle = null, this.isReady = !1, Ec.backColor = new Mc(.05, .05, .05), Ec.params = {
                        param1: 1,
                        param2: .05,
                        param3: .2
                    }
                }
                async init() {
                    const t = new gc,
                        e = [t.loadAsync("/assets/texture/grain.webp"), t.loadAsync("/assets/texture/blur.webp")],
                        n = await Promise.all(e);
                    n[0].minFilter = gl, n[0].magFilter = gl, n[0].generateMipmaps = !1, n[1].minFilter = gl, n[1].magFilter = gl, n[1].generateMipmaps = !1, this.circle = new Pf({
                        grain: n[0],
                        blur: n[1]
                    }), this.scene.add(this.circle), this.resize(), this.isReady = !0
                }
                changeTheme(t) {
                    "dark" === t ? Wi.to(Ec.backColor, {
                        r: .05,
                        g: .05,
                        b: .05,
                        duration: 1.6
                    }) : Wi.to(Ec.backColor, {
                        r: .9,
                        g: .9,
                        b: .9,
                        duration: 1.6
                    })
                }
                changeStyle(t) {
                    this.circle.changeStyle("mono" === t ? 1 : 0)
                }
                resize() {
                    this.setConfig(), this.resizeScene()
                }
                update({
                    time: t
                }) {
                    this.isReady && (this.circle.update(t), this.renderer.render(this.scene, this.camera))
                }
            },
            Df = {
                theme: "dark",
                fontStyle: "sans-serif",
                isTransitioning: !1,
                pagePaths: ["/", "/projects/", "/info/", "/contact/"],
                currentPath: null,
                init() {
                    this.$page = document.getElementById("Page"), this.pages = {
                        "/": document.querySelector('[data-page="home"]'),
                        "/projects/": document.querySelector('[data-page="projects"]'),
                        "/info/": document.querySelector('[data-page="info"]'),
                        "/contact/": document.querySelector('[data-page="contact"]')
                    };
                    const t = window.matchMedia("(prefers-color-scheme: dark)");
                    this.theme = t.matches ? "dark" : "light", this.scroll = new zo, this.scroll.setTarget(document.getElementById("Content")), this.changeTheme(this.theme), this.updateView(), this.enter(), document.querySelectorAll("a").forEach((t => {
                        "_blank" !== t.getAttribute("target") && (t.onclick = e => {
                            e.preventDefault(), window.history.pushState(null, "", t.href), this.updateView()
                        })
                    })), window.addEventListener("popstate", (() => {
                        this.updateView()
                    }))
                },
                resize() {
                    this.scroll.resize()
                },
                update(t) {
                    this.isTransitioning || this.scroll.update(t.deltaTime)
                },
                toggleTheme() {
                    "dark" === this.theme ? this.changeTheme("light") : this.changeTheme("dark")
                },
                changeTheme(t) {
                    "dark" === t ? (this.$page.classList.add("is-dark"), document.documentElement.style.setProperty("--c-bg", "hsl(0, 0%, 5%)"), document.documentElement.style.setProperty("--c-text", "hsl(0, 0%, 95%)")) : (this.$page.classList.remove("is-dark"), document.documentElement.style.setProperty("--c-bg", "hsl(0, 0%, 90%)"), document.documentElement.style.setProperty("--c-text", "hsl(0, 0%, 10%)")), this.theme = t, Uf.changeTheme(t)
                },
                toggleFontStyle() {
                    "sans-serif" === this.fontStyle ? (this.fontStyle = "mono", document.body.classList.add("is-monospaced")) : (this.fontStyle = "sans-serif", document.body.classList.remove("is-monospaced")), Uf.changeStyle(this.fontStyle)
                },
                async enter() {
                    const t = document.getElementById("EnterView"),
                        e = t.querySelector("._t1"),
                        n = t.querySelector("._t2");
                    await Bo(1), Wi.to(e, {
                        opacity: 0,
                        duration: .6
                    }), Wi.to(n, {
                        opacity: 0,
                        duration: .6,
                        delay: .15
                    }), await Bo(.6), Wi.to(t, {
                        opacity: 0,
                        duration: 1.6,
                        onComplete: () => {
                            t.remove()
                        }
                    })
                },
                updateView() {
                    const t = window.location.pathname;
                    this.pagePaths.includes(t) ? this.switchPage(t) : this.switchPage("/")
                },
                async switchPage(t) {
                    this.isTransitioning = !0, this.currentPath && (this.hidePage(this.pages[this.currentPath]), await Bo(.3)), this.scroll.reset(), this.isTransitioning = !1, this.showPage(this.pages[t]), this.currentPath = t
                },
                showPage(t) {
                    t.style.display = "block", t.classList.remove("is-leaving"), Wi.fromTo(t, {
                        opacity: 0
                    }, {
                        opacity: 1,
                        duration: .9
                    })
                },
                hidePage(t) {
                    t.classList.add("is-leaving"), Wi.to(t, {
                        opacity: 0,
                        duration: .3,
                        onComplete: () => {
                            t.style.display = "none", t.classList.remove("is-leaving")
                        }
                    })
                }
            },
            If = new class {
                constructor() {}
                init() {
                    window.Alpine = Uo, Uo.store("app", Df), Uo.start(), Uf.init(), this.resizeMng = new qi, this.resizeMng.setSizeFunc((() => ({
                        width: window.innerWidth,
                        height: window.innerHeight
                    }))), this.resize(), ji.add(this.update.bind(this))
                }
                resize() {
                    const t = document.documentElement,
                        e = .01 * t.clientWidth,
                        n = .01 * t.clientHeight;
                    document.documentElement.style.setProperty("--vw", `${e}px`), document.documentElement.style.setProperty("--vh", `${n}px`), document.documentElement.style.setProperty("--vmax", `${Math.max(e,n)}px`), document.documentElement.style.setProperty("--vmin", `${Math.min(e,n)}px`), Uf.resize(), Uo.store("app").resize()
                }
                update(t) {
                    this.resizeMng.check() && this.resize(), Uo.store("app").update(t), Uf.update(t)
                }
            };
        document.addEventListener("DOMContentLoaded", (() => {
            ! function() {
                const t = document.querySelector('meta[name="viewport"]');

                function e() {
                    const e = window.outerWidth > 375 ? "width=device-width,initial-scale=1" : "width=375";
                    t.getAttribute("content") !== e && t.setAttribute("content", e)
                }
                window.addEventListener("resize", e), e()
            }(), If.init()
        }))
    })()
})();