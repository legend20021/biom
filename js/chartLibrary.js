/*!
 * Chart.js v3.9.1
 * https://www.chartjs.org
 * (c) 2022 Chart.js Contributors
 * Released under the MIT License
 */
! function(t, e) { "object" == typeof exports && "undefined" != typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).Chart = e() }(this, (function() {
    "use strict";

    function t() {}
    const e = function() { let t = 0; return function() { return t++ } }();

    function i(t) { return null == t }

    function s(t) { if (Array.isArray && Array.isArray(t)) return !0; const e = Object.prototype.toString.call(t); return "[object" === e.slice(0, 7) && "Array]" === e.slice(-6) }

    function n(t) { return null !== t && "[object Object]" === Object.prototype.toString.call(t) }
    const o = t => ("number" == typeof t || t instanceof Number) && isFinite(+t);

    function a(t, e) { return o(t) ? t : e }

    function r(t, e) { return void 0 === t ? e : t }
    const l = (t, e) => "string" == typeof t && t.endsWith("%") ? parseFloat(t) / 100 : t / e,
        h = (t, e) => "string" == typeof t && t.endsWith("%") ? parseFloat(t) / 100 * e : +t;

    function c(t, e, i) { if (t && "function" == typeof t.call) return t.apply(i, e) }

    function d(t, e, i, o) {
        let a, r, l;
        if (s(t))
            if (r = t.length, o)
                for (a = r - 1; a >= 0; a--) e.call(i, t[a], a);
            else
                for (a = 0; a < r; a++) e.call(i, t[a], a);
        else if (n(t))
            for (l = Object.keys(t), r = l.length, a = 0; a < r; a++) e.call(i, t[l[a]], l[a])
    }

    function u(t, e) {
        let i, s, n, o;
        if (!t || !e || t.length !== e.length) return !1;
        for (i = 0, s = t.length; i < s; ++i)
            if (n = t[i], o = e[i], n.datasetIndex !== o.datasetIndex || n.index !== o.index) return !1;
        return !0
    }

    function f(t) {
        if (s(t)) return t.map(f);
        if (n(t)) {
            const e = Object.create(null),
                i = Object.keys(t),
                s = i.length;
            let n = 0;
            for (; n < s; ++n) e[i[n]] = f(t[i[n]]);
            return e
        }
        return t
    }

    function g(t) { return -1 === ["__proto__", "prototype", "constructor"].indexOf(t) }

    function p(t, e, i, s) {
        if (!g(t)) return;
        const o = e[t],
            a = i[t];
        n(o) && n(a) ? m(o, a, s) : e[t] = f(a)
    }

    function m(t, e, i) {
        const o = s(e) ? e : [e],
            a = o.length;
        if (!n(t)) return t;
        const r = (i = i || {}).merger || p;
        for (let s = 0; s < a; ++s) { if (!n(e = o[s])) continue; const a = Object.keys(e); for (let s = 0, n = a.length; s < n; ++s) r(a[s], t, e, i) }
        return t
    }

    function b(t, e) { return m(t, e, { merger: x }) }

    function x(t, e, i) {
        if (!g(t)) return;
        const s = e[t],
            o = i[t];
        n(s) && n(o) ? b(s, o) : Object.prototype.hasOwnProperty.call(e, t) || (e[t] = f(o))
    }
    const _ = { "": t => t, x: t => t.x, y: t => t.y };

    function y(t, e) {
        const i = _[e] || (_[e] = function(t) {
            const e = v(t);
            return t => {
                for (const i of e) {
                    if ("" === i) break;
                    t = t && t[i]
                }
                return t
            }
        }(e));
        return i(t)
    }

    function v(t) {
        const e = t.split("."),
            i = [];
        let s = "";
        for (const t of e) s += t, s.endsWith("\\") ? s = s.slice(0, -1) + "." : (i.push(s), s = "");
        return i
    }

    function w(t) { return t.charAt(0).toUpperCase() + t.slice(1) }
    const M = t => void 0 !== t,
        k = t => "function" == typeof t,
        S = (t, e) => {
            if (t.size !== e.size) return !1;
            for (const i of t)
                if (!e.has(i)) return !1;
            return !0
        };

    function P(t) { return "mouseup" === t.type || "click" === t.type || "contextmenu" === t.type }
    const D = Math.PI,
        O = 2 * D,
        C = O + D,
        A = Number.POSITIVE_INFINITY,
        T = D / 180,
        L = D / 2,
        E = D / 4,
        R = 2 * D / 3,
        I = Math.log10,
        z = Math.sign;

    function F(t) {
        const e = Math.round(t);
        t = N(t, e, t / 1e3) ? e : t;
        const i = Math.pow(10, Math.floor(I(t))),
            s = t / i;
        return (s <= 1 ? 1 : s <= 2 ? 2 : s <= 5 ? 5 : 10) * i
    }

    function V(t) {
        const e = [],
            i = Math.sqrt(t);
        let s;
        for (s = 1; s < i; s++) t % s == 0 && (e.push(s), e.push(t / s));
        return i === (0 | i) && e.push(i), e.sort(((t, e) => t - e)).pop(), e
    }

    function B(t) { return !isNaN(parseFloat(t)) && isFinite(t) }

    function N(t, e, i) { return Math.abs(t - e) < i }

    function W(t, e) { const i = Math.round(t); return i - e <= t && i + e >= t }

    function j(t, e, i) { let s, n, o; for (s = 0, n = t.length; s < n; s++) o = t[s][i], isNaN(o) || (e.min = Math.min(e.min, o), e.max = Math.max(e.max, o)) }

    function H(t) { return t * (D / 180) }

    function $(t) { return t * (180 / D) }

    function Y(t) {
        if (!o(t)) return;
        let e = 1,
            i = 0;
        for (; Math.round(t * e) / e !== t;) e *= 10, i++;
        return i
    }

    function U(t, e) {
        const i = e.x - t.x,
            s = e.y - t.y,
            n = Math.sqrt(i * i + s * s);
        let o = Math.atan2(s, i);
        return o < -.5 * D && (o += O), { angle: o, distance: n }
    }

    function X(t, e) { return Math.sqrt(Math.pow(e.x - t.x, 2) + Math.pow(e.y - t.y, 2)) }

    function q(t, e) { return (t - e + C) % O - D }

    function K(t) { return (t % O + O) % O }

    function G(t, e, i, s) {
        const n = K(t),
            o = K(e),
            a = K(i),
            r = K(o - n),
            l = K(a - n),
            h = K(n - o),
            c = K(n - a);
        return n === o || n === a || s && o === a || r > l && h < c
    }

    function Z(t, e, i) { return Math.max(e, Math.min(i, t)) }

    function J(t) { return Z(t, -32768, 32767) }

    function Q(t, e, i, s = 1e-6) { return t >= Math.min(e, i) - s && t <= Math.max(e, i) + s }

    function tt(t, e, i) {
        i = i || (i => t[i] < e);
        let s, n = t.length - 1,
            o = 0;
        for (; n - o > 1;) s = o + n >> 1, i(s) ? o = s : n = s;
        return { lo: o, hi: n }
    }
    const et = (t, e, i, s) => tt(t, i, s ? s => t[s][e] <= i : s => t[s][e] < i),
        it = (t, e, i) => tt(t, i, (s => t[s][e] >= i));

    function st(t, e, i) {
        let s = 0,
            n = t.length;
        for (; s < n && t[s] < e;) s++;
        for (; n > s && t[n - 1] > i;) n--;
        return s > 0 || n < t.length ? t.slice(s, n) : t
    }
    const nt = ["push", "pop", "shift", "splice", "unshift"];

    function ot(t, e) {
        t._chartjs ? t._chartjs.listeners.push(e) : (Object.defineProperty(t, "_chartjs", { configurable: !0, enumerable: !1, value: { listeners: [e] } }), nt.forEach((e => {
            const i = "_onData" + w(e),
                s = t[e];
            Object.defineProperty(t, e, { configurable: !0, enumerable: !1, value(...e) { const n = s.apply(this, e); return t._chartjs.listeners.forEach((t => { "function" == typeof t[i] && t[i](...e) })), n } })
        })))
    }

    function at(t, e) {
        const i = t._chartjs;
        if (!i) return;
        const s = i.listeners,
            n = s.indexOf(e); - 1 !== n && s.splice(n, 1), s.length > 0 || (nt.forEach((e => { delete t[e] })), delete t._chartjs)
    }

    function rt(t) { const e = new Set; let i, s; for (i = 0, s = t.length; i < s; ++i) e.add(t[i]); return e.size === s ? t : Array.from(e) }
    const lt = "undefined" == typeof window ? function(t) { return t() } : window.requestAnimationFrame;

    function ht(t, e, i) {
        const s = i || (t => Array.prototype.slice.call(t));
        let n = !1,
            o = [];
        return function(...i) { o = s(i), n || (n = !0, lt.call(window, (() => { n = !1, t.apply(e, o) }))) }
    }

    function ct(t, e) { let i; return function(...s) { return e ? (clearTimeout(i), i = setTimeout(t, e, s)) : t.apply(this, s), e } }
    const dt = t => "start" === t ? "left" : "end" === t ? "right" : "center",
        ut = (t, e, i) => "start" === t ? e : "end" === t ? i : (e + i) / 2,
        ft = (t, e, i, s) => t === (s ? "left" : "right") ? i : "center" === t ? (e + i) / 2 : e;

    function gt(t, e, i) {
        const s = e.length;
        let n = 0,
            o = s;
        if (t._sorted) {
            const { iScale: a, _parsed: r } = t, l = a.axis, { min: h, max: c, minDefined: d, maxDefined: u } = a.getUserBounds();
            d && (n = Z(Math.min(et(r, a.axis, h).lo, i ? s : et(e, l, a.getPixelForValue(h)).lo), 0, s - 1)), o = u ? Z(Math.max(et(r, a.axis, c, !0).hi + 1, i ? 0 : et(e, l, a.getPixelForValue(c), !0).hi + 1), n, s) - n : s - n
        }
        return { start: n, count: o }
    }

    function pt(t) { const { xScale: e, yScale: i, _scaleRanges: s } = t, n = { xmin: e.min, xmax: e.max, ymin: i.min, ymax: i.max }; if (!s) return t._scaleRanges = n, !0; const o = s.xmin !== e.min || s.xmax !== e.max || s.ymin !== i.min || s.ymax !== i.max; return Object.assign(s, n), o }
    var mt = new class {
        constructor() { this._request = null, this._charts = new Map, this._running = !1, this._lastDate = void 0 }
        _notify(t, e, i, s) {
            const n = e.listeners[s],
                o = e.duration;
            n.forEach((s => s({ chart: t, initial: e.initial, numSteps: o, currentStep: Math.min(i - e.start, o) })))
        }
        _refresh() { this._request || (this._running = !0, this._request = lt.call(window, (() => { this._update(), this._request = null, this._running && this._refresh() }))) }
        _update(t = Date.now()) {
            let e = 0;
            this._charts.forEach(((i, s) => {
                if (!i.running || !i.items.length) return;
                const n = i.items;
                let o, a = n.length - 1,
                    r = !1;
                for (; a >= 0; --a) o = n[a], o._active ? (o._total > i.duration && (i.duration = o._total), o.tick(t), r = !0) : (n[a] = n[n.length - 1], n.pop());
                r && (s.draw(), this._notify(s, i, t, "progress")), n.length || (i.running = !1, this._notify(s, i, t, "complete"), i.initial = !1), e += n.length
            })), this._lastDate = t, 0 === e && (this._running = !1)
        }
        _getAnims(t) { const e = this._charts; let i = e.get(t); return i || (i = { running: !1, initial: !0, items: [], listeners: { complete: [], progress: [] } }, e.set(t, i)), i }
        listen(t, e, i) { this._getAnims(t).listeners[e].push(i) }
        add(t, e) { e && e.length && this._getAnims(t).items.push(...e) }
        has(t) { return this._getAnims(t).items.length > 0 }
        start(t) {
            const e = this._charts.get(t);
            e && (e.running = !0, e.start = Date.now(), e.duration = e.items.reduce(((t, e) => Math.max(t, e._duration)), 0), this._refresh())
        }
        running(t) { if (!this._running) return !1; const e = this._charts.get(t); return !!(e && e.running && e.items.length) }
        stop(t) {
            const e = this._charts.get(t);
            if (!e || !e.items.length) return;
            const i = e.items;
            let s = i.length - 1;
            for (; s >= 0; --s) i[s].cancel();
            e.items = [], this._notify(t, e, Date.now(), "complete")
        }
        remove(t) { return this._charts.delete(t) }
    };
    /*!
     * @kurkle/color v0.2.1
     * https://github.com/kurkle/color#readme
     * (c) 2022 Jukka Kurkela
     * Released under the MIT License
     */
    function bt(t) { return t + .5 | 0 }
    const xt = (t, e, i) => Math.max(Math.min(t, i), e);

    function _t(t) { return xt(bt(2.55 * t), 0, 255) }

    function yt(t) { return xt(bt(255 * t), 0, 255) }

    function vt(t) { return xt(bt(t / 2.55) / 100, 0, 1) }

    function wt(t) { return xt(bt(100 * t), 0, 100) }
    const Mt = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, a: 10, b: 11, c: 12, d: 13, e: 14, f: 15 },
        kt = [...
            "0123456789ABCDEF"
        ],
        St = t => kt[15 & t],
        Pt = t => kt[(240 & t) >> 4] + kt[15 & t],
        Dt = t => (240 & t) >> 4 == (15 & t);

    function Ot(t) { var e = (t => Dt(t.r) && Dt(t.g) && Dt(t.b) && Dt(t.a))(t) ? St : Pt; return t ? "#" + e(t.r) + e(t.g) + e(t.b) + ((t, e) => t < 255 ? e(t) : "")(t.a, e) : void 0 }
    const Ct = /^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;

    function At(t, e, i) {
        const s = e * Math.min(i, 1 - i),
            n = (e, n = (e + t / 30) % 12) => i - s * Math.max(Math.min(n - 3, 9 - n, 1), -1);
        return [n(0), n(8), n(4)]
    }

    function Tt(t, e, i) { const s = (s, n = (s + t / 60) % 6) => i - i * e * Math.max(Math.min(n, 4 - n, 1), 0); return [s(5), s(3), s(1)] }

    function Lt(t, e, i) { const s = At(t, 1, .5); let n; for (e + i > 1 && (n = 1 / (e + i), e *= n, i *= n), n = 0; n < 3; n++) s[n] *= 1 - e - i, s[n] += e; return s }

    function Et(t) {
        const e = t.r / 255,
            i = t.g / 255,
            s = t.b / 255,
            n = Math.max(e, i, s),
            o = Math.min(e, i, s),
            a = (n + o) / 2;
        let r, l, h;
        return n !== o && (h = n - o, l = a > .5 ? h / (2 - n - o) : h / (n + o), r = function(t, e, i, s, n) { return t === n ? (e - i) / s + (e < i ? 6 : 0) : e === n ? (i - t) / s + 2 : (t - e) / s + 4 }(e, i, s, h, n), r = 60 * r + .5), [0 | r, l || 0, a]
    }

    function Rt(t, e, i, s) { return (Array.isArray(e) ? t(e[0], e[1], e[2]) : t(e, i, s)).map(yt) }

    function It(t, e, i) { return Rt(At, t, e, i) }

    function zt(t) { return (t % 360 + 360) % 360 }

    function Ft(t) {
        const e = Ct.exec(t);
        let i, s = 255;
        if (!e) return;
        e[5] !== i && (s = e[6] ? _t(+e[5]) : yt(+e[5]));
        const n = zt(+e[2]),
            o = +e[3] / 100,
            a = +e[4] / 100;
        return i = "hwb" === e[1] ? function(t, e, i) { return Rt(Lt, t, e, i) }(n, o, a) : "hsv" === e[1] ? function(t, e, i) { return Rt(Tt, t, e, i) }(n, o, a) : It(n, o, a), { r: i[0], g: i[1], b: i[2], a: s }
    }
    const Vt = { x: "dark", Z: "light", Y: "re", X: "blu", W: "gr", V: "medium", U: "slate", A: "ee", T: "ol", S: "or", B: "ra", C: "lateg", D: "ights", R: "in", Q: "turquois", E: "hi", P: "ro", O: "al", N: "le", M: "de", L: "yello", F: "en", K: "ch", G: "arks", H: "ea", I: "ightg", J: "wh" },
        Bt = { OiceXe: "f0f8ff", antiquewEte: "faebd7", aqua: "ffff", aquamarRe: "7fffd4", azuY: "f0ffff", beige: "f5f5dc", bisque: "ffe4c4", black: "0", blanKedOmond: "ffebcd", Xe: "ff", XeviTet: "8a2be2", bPwn: "a52a2a", burlywood: "deb887", caMtXe: "5f9ea0", KartYuse: "7fff00", KocTate: "d2691e", cSO: "ff7f50", cSnflowerXe: "6495ed", cSnsilk: "fff8dc", crimson: "dc143c", cyan: "ffff", xXe: "8b", xcyan: "8b8b", xgTMnPd: "b8860b", xWay: "a9a9a9", xgYF: "6400", xgYy: "a9a9a9", xkhaki: "bdb76b", xmagFta: "8b008b", xTivegYF: "556b2f", xSange: "ff8c00", xScEd: "9932cc", xYd: "8b0000", xsOmon: "e9967a", xsHgYF: "8fbc8f", xUXe: "483d8b", xUWay: "2f4f4f", xUgYy: "2f4f4f", xQe: "ced1", xviTet: "9400d3", dAppRk: "ff1493", dApskyXe: "bfff", dimWay: "696969", dimgYy: "696969", dodgerXe: "1e90ff", fiYbrick: "b22222", flSOwEte: "fffaf0", foYstWAn: "228b22", fuKsia: "ff00ff", gaRsbSo: "dcdcdc", ghostwEte: "f8f8ff", gTd: "ffd700", gTMnPd: "daa520", Way: "808080", gYF: "8000", gYFLw: "adff2f", gYy: "808080", honeyMw: "f0fff0", hotpRk: "ff69b4", RdianYd: "cd5c5c", Rdigo: "4b0082", ivSy: "fffff0", khaki: "f0e68c", lavFMr: "e6e6fa", lavFMrXsh: "fff0f5", lawngYF: "7cfc00", NmoncEffon: "fffacd", ZXe: "add8e6", ZcSO: "f08080", Zcyan: "e0ffff", ZgTMnPdLw: "fafad2", ZWay: "d3d3d3", ZgYF: "90ee90", ZgYy: "d3d3d3", ZpRk: "ffb6c1", ZsOmon: "ffa07a", ZsHgYF: "20b2aa", ZskyXe: "87cefa", ZUWay: "778899", ZUgYy: "778899", ZstAlXe: "b0c4de", ZLw: "ffffe0", lime: "ff00", limegYF: "32cd32", lRF: "faf0e6", magFta: "ff00ff", maPon: "800000", VaquamarRe: "66cdaa", VXe: "cd", VScEd: "ba55d3", VpurpN: "9370db", VsHgYF: "3cb371", VUXe: "7b68ee", VsprRggYF: "fa9a", VQe: "48d1cc", VviTetYd: "c71585", midnightXe: "191970", mRtcYam: "f5fffa", mistyPse: "ffe4e1", moccasR: "ffe4b5", navajowEte: "ffdead", navy: "80", Tdlace: "fdf5e6", Tive: "808000", TivedBb: "6b8e23", Sange: "ffa500", SangeYd: "ff4500", ScEd: "da70d6", pOegTMnPd: "eee8aa", pOegYF: "98fb98", pOeQe: "afeeee", pOeviTetYd: "db7093", papayawEp: "ffefd5", pHKpuff: "ffdab9", peru: "cd853f", pRk: "ffc0cb", plum: "dda0dd", powMrXe: "b0e0e6", purpN: "800080", YbeccapurpN: "663399", Yd: "ff0000", Psybrown: "bc8f8f", PyOXe: "4169e1", saddNbPwn: "8b4513", sOmon: "fa8072", sandybPwn: "f4a460", sHgYF: "2e8b57", sHshell: "fff5ee", siFna: "a0522d", silver: "c0c0c0", skyXe: "87ceeb", UXe: "6a5acd", UWay: "708090", UgYy: "708090", snow: "fffafa", sprRggYF: "ff7f", stAlXe: "4682b4", tan: "d2b48c", teO: "8080", tEstN: "d8bfd8", tomato: "ff6347", Qe: "40e0d0", viTet: "ee82ee", JHt: "f5deb3", wEte: "ffffff", wEtesmoke: "f5f5f5", Lw: "ffff00", LwgYF: "9acd32" };
    let Nt;

    function Wt(t) {
        Nt || (Nt = function() {
            const t = {},
                e = Object.keys(Bt),
                i = Object.keys(Vt);
            let s, n, o, a, r;
            for (s = 0; s < e.length; s++) {
                for (a = r = e[s], n = 0; n < i.length; n++) o = i[n], r = r.replace(o, Vt[o]);
                o = parseInt(Bt[a], 16), t[r] = [o >> 16 & 255, o >> 8 & 255, 255 & o]
            }
            return t
        }(), Nt.transparent = [0, 0, 0, 0]);
        const e = Nt[t.toLowerCase()];
        return e && { r: e[0], g: e[1], b: e[2], a: 4 === e.length ? e[3] : 255 }
    }
    const jt = /^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;
    const Ht = t => t <= .0031308 ? 12.92 * t : 1.055 * Math.pow(t, 1 / 2.4) - .055,
        $t = t => t <= .04045 ? t / 12.92 : Math.pow((t + .055) / 1.055, 2.4);

    function Yt(t, e, i) {
        if (t) {
            let s = Et(t);
            s[e] = Math.max(0, Math.min(s[e] + s[e] * i, 0 === e ? 360 : 1)), s = It(s), t.r = s[0], t.g = s[1], t.b = s[2]
        }
    }

    function Ut(t, e) { return t ? Object.assign(e || {}, t) : t }

    function Xt(t) { var e = { r: 0, g: 0, b: 0, a: 255 }; return Array.isArray(t) ? t.length >= 3 && (e = { r: t[0], g: t[1], b: t[2], a: 255 }, t.length > 3 && (e.a = yt(t[3]))) : (e = Ut(t, { r: 0, g: 0, b: 0, a: 1 })).a = yt(e.a), e }

    function qt(t) {
        return "r" === t.charAt(0) ? function(t) {
            const e = jt.exec(t);
            let i, s, n, o = 255;
            if (e) {
                if (e[7] !== i) {
                    const t = +e[7];
                    o = e[8] ? _t(t) : xt(255 * t, 0, 255)
                }
                return i = +e[1], s = +e[3], n = +e[5], i = 255 & (e[2] ? _t(i) : xt(i, 0, 255)), s = 255 & (e[4] ? _t(s) : xt(s, 0, 255)), n = 255 & (e[6] ? _t(n) : xt(n, 0, 255)), { r: i, g: s, b: n, a: o }
            }
        }(t) : Ft(t)
    }
    class Kt {
        constructor(t) { if (t instanceof Kt) return t; const e = typeof t; let i; var s, n, o; "object" === e ? i = Xt(t) : "string" === e && (o = (s = t).length, "#" === s[0] && (4 === o || 5 === o ? n = { r: 255 & 17 * Mt[s[1]], g: 255 & 17 * Mt[s[2]], b: 255 & 17 * Mt[s[3]], a: 5 === o ? 17 * Mt[s[4]] : 255 } : 7 !== o && 9 !== o || (n = { r: Mt[s[1]] << 4 | Mt[s[2]], g: Mt[s[3]] << 4 | Mt[s[4]], b: Mt[s[5]] << 4 | Mt[s[6]], a: 9 === o ? Mt[s[7]] << 4 | Mt[s[8]] : 255 })), i = n || Wt(t) || qt(t)), this._rgb = i, this._valid = !!i }
        get valid() { return this._valid }
        get rgb() { var t = Ut(this._rgb); return t && (t.a = vt(t.a)), t }
        set rgb(t) { this._rgb = Xt(t) }
        rgbString() { return this._valid ? (t = this._rgb) && (t.a < 255 ? `rgba(${t.r}, ${t.g}, ${t.b}, ${vt(t.a)})` : `rgb(${t.r}, ${t.g}, ${t.b})`) : void 0; var t }
        hexString() { return this._valid ? Ot(this._rgb) : void 0 }
        hslString() {
            return this._valid ? function(t) {
                if (!t) return;
                const e = Et(t),
                    i = e[0],
                    s = wt(e[1]),
                    n = wt(e[2]);
                return t.a < 255 ? `hsla(${i}, ${s}%, ${n}%, ${vt(t.a)})` : `hsl(${i}, ${s}%, ${n}%)`
            }(this._rgb) : void 0
        }
        mix(t, e) {
            if (t) {
                const i = this.rgb,
                    s = t.rgb;
                let n;
                const o = e === n ? .5 : e,
                    a = 2 * o - 1,
                    r = i.a - s.a,
                    l = ((a * r == -1 ? a : (a + r) / (1 + a * r)) + 1) / 2;
                n = 1 - l, i.r = 255 & l * i.r + n * s.r + .5, i.g = 255 & l * i.g + n * s.g + .5, i.b = 255 & l * i.b + n * s.b + .5, i.a = o * i.a + (1 - o) * s.a, this.rgb = i
            }
            return this
        }
        interpolate(t, e) {
            return t && (this._rgb = function(t, e, i) {
                const s = $t(vt(t.r)),
                    n = $t(vt(t.g)),
                    o = $t(vt(t.b));
                return { r: yt(Ht(s + i * ($t(vt(e.r)) - s))), g: yt(Ht(n + i * ($t(vt(e.g)) - n))), b: yt(Ht(o + i * ($t(vt(e.b)) - o))), a: t.a + i * (e.a - t.a) }
            }(this._rgb, t._rgb, e)), this
        }
        clone() { return new Kt(this.rgb) }
        alpha(t) { return this._rgb.a = yt(t), this }
        clearer(t) { return this._rgb.a *= 1 - t, this }
        greyscale() {
            const t = this._rgb,
                e = bt(.3 * t.r + .59 * t.g + .11 * t.b);
            return t.r = t.g = t.b = e, this
        }
        opaquer(t) { return this._rgb.a *= 1 + t, this }
        negate() { const t = this._rgb; return t.r = 255 - t.r, t.g = 255 - t.g, t.b = 255 - t.b, this }
        lighten(t) { return Yt(this._rgb, 2, t), this }
        darken(t) { return Yt(this._rgb, 2, -t), this }
        saturate(t) { return Yt(this._rgb, 1, t), this }
        desaturate(t) { return Yt(this._rgb, 1, -t), this }
        rotate(t) {
            return function(t, e) {
                var i = Et(t);
                i[0] = zt(i[0] + e), i = It(i), t.r = i[0], t.g = i[1], t.b = i[2]
            }(this._rgb, t), this
        }
    }

    function Gt(t) { return new Kt(t) }

    function Zt(t) { if (t && "object" == typeof t) { const e = t.toString(); return "[object CanvasPattern]" === e || "[object CanvasGradient]" === e } return !1 }

    function Jt(t) { return Zt(t) ? t : Gt(t) }

    function Qt(t) { return Zt(t) ? t : Gt(t).saturate(.5).darken(.1).hexString() }
    const te = Object.create(null),
        ee = Object.create(null);

    function ie(t, e) {
        if (!e) return t;
        const i = e.split(".");
        for (let e = 0, s = i.length; e < s; ++e) {
            const s = i[e];
            t = t[s] || (t[s] = Object.create(null))
        }
        return t
    }

    function se(t, e, i) { return "string" == typeof e ? m(ie(t, e), i) : m(ie(t, ""), e) }
    var ne = new class {
        constructor(t) { this.animation = void 0, this.backgroundColor = "rgba(0,0,0,0.1)", this.borderColor = "rgba(0,0,0,0.1)", this.color = "#666", this.datasets = {}, this.devicePixelRatio = t => t.chart.platform.getDevicePixelRatio(), this.elements = {}, this.events = ["mousemove", "mouseout", "click", "touchstart", "touchmove"], this.font = { family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif", size: 12, style: "normal", lineHeight: 1.2, weight: null }, this.hover = {}, this.hoverBackgroundColor = (t, e) => Qt(e.backgroundColor), this.hoverBorderColor = (t, e) => Qt(e.borderColor), this.hoverColor = (t, e) => Qt(e.color), this.indexAxis = "x", this.interaction = { mode: "nearest", intersect: !0, includeInvisible: !1 }, this.maintainAspectRatio = !0, this.onHover = null, this.onClick = null, this.parsing = !0, this.plugins = {}, this.responsive = !0, this.scale = void 0, this.scales = {}, this.showLine = !0, this.drawActiveElementsOnTop = !0, this.describe(t) }
        set(t, e) { return se(this, t, e) }
        get(t) { return ie(this, t) }
        describe(t, e) { return se(ee, t, e) }
        override(t, e) { return se(te, t, e) }
        route(t, e, i, s) {
            const o = ie(this, t),
                a = ie(this, i),
                l = "_" + e;
            Object.defineProperties(o, {
                [l]: { value: o[e], writable: !0 },
                [e]: {
                    enumerable: !0,
                    get() {
                        const t = this[l],
                            e = a[s];
                        return n(t) ? Object.assign({}, e, t) : r(t, e)
                    },
                    set(t) { this[l] = t }
                }
            })
        }
    }({ _scriptable: t => !t.startsWith("on"), _indexable: t => "events" !== t, hover: { _fallback: "interaction" }, interaction: { _scriptable: !1, _indexable: !1 } });

    function oe() { return "undefined" != typeof window && "undefined" != typeof document }

    function ae(t) { let e = t.parentNode; return e && "[object ShadowRoot]" === e.toString() && (e = e.host), e }

    function re(t, e, i) { let s; return "string" == typeof t ? (s = parseInt(t, 10), -1 !== t.indexOf("%") && (s = s / 100 * e.parentNode[i])) : s = t, s }
    const le = t => window.getComputedStyle(t, null);

    function he(t, e) { return le(t).getPropertyValue(e) }
    const ce = ["top", "right", "bottom", "left"];

    function de(t, e, i) {
        const s = {};
        i = i ? "-" + i : "";
        for (let n = 0; n < 4; n++) {
            const o = ce[n];
            s[o] = parseFloat(t[e + "-" + o + i]) || 0
        }
        return s.width = s.left + s.right, s.height = s.top + s.bottom, s
    }

    function ue(t, e) {
        if ("native" in t) return t;
        const { canvas: i, currentDevicePixelRatio: s } = e, n = le(i), o = "border-box" === n.boxSizing, a = de(n, "padding"), r = de(n, "border", "width"), { x: l, y: h, box: c } = function(t, e) {
            const i = t.touches,
                s = i && i.length ? i[0] : t,
                { offsetX: n, offsetY: o } = s;
            let a, r, l = !1;
            if (((t, e, i) => (t > 0 || e > 0) && (!i || !i.shadowRoot))(n, o, t.target)) a = n, r = o;
            else {
                const t = e.getBoundingClientRect();
                a = s.clientX - t.left, r = s.clientY - t.top, l = !0
            }
            return { x: a, y: r, box: l }
        }(t, i), d = a.left + (c && r.left), u = a.top + (c && r.top);
        let { width: f, height: g } = e;
        return o && (f -= a.width + r.width, g -= a.height + r.height), { x: Math.round((l - d) / f * i.width / s), y: Math.round((h - u) / g * i.height / s) }
    }
    const fe = t => Math.round(10 * t) / 10;

    function ge(t, e, i, s) {
        const n = le(t),
            o = de(n, "margin"),
            a = re(n.maxWidth, t, "clientWidth") || A,
            r = re(n.maxHeight, t, "clientHeight") || A,
            l = function(t, e, i) {
                let s, n;
                if (void 0 === e || void 0 === i) {
                    const o = ae(t);
                    if (o) {
                        const t = o.getBoundingClientRect(),
                            a = le(o),
                            r = de(a, "border", "width"),
                            l = de(a, "padding");
                        e = t.width - l.width - r.width, i = t.height - l.height - r.height, s = re(a.maxWidth, o, "clientWidth"), n = re(a.maxHeight, o, "clientHeight")
                    } else e = t.clientWidth, i = t.clientHeight
                }
                return { width: e, height: i, maxWidth: s || A, maxHeight: n || A }
            }(t, e, i);
        let { width: h, height: c } = l;
        if ("content-box" === n.boxSizing) {
            const t = de(n, "border", "width"),
                e = de(n, "padding");
            h -= e.width + t.width, c -= e.height + t.height
        }
        return h = Math.max(0, h - o.width), c = Math.max(0, s ? Math.floor(h / s) : c - o.height), h = fe(Math.min(h, a, l.maxWidth)), c = fe(Math.min(c, r, l.maxHeight)), h && !c && (c = fe(h / 2)), { width: h, height: c }
    }

    function pe(t, e, i) {
        const s = e || 1,
            n = Math.floor(t.height * s),
            o = Math.floor(t.width * s);
        t.height = n / s, t.width = o / s;
        const a = t.canvas;
        return a.style && (i || !a.style.height && !a.style.width) && (a.style.height = `${t.height}px`, a.style.width = `${t.width}px`), (t.currentDevicePixelRatio !== s || a.height !== n || a.width !== o) && (t.currentDevicePixelRatio = s, a.height = n, a.width = o, t.ctx.setTransform(s, 0, 0, s, 0, 0), !0)
    }
    const me = function() {
        let t = !1;
        try {
            const e = {get passive() { return t = !0, !1 } };
            window.addEventListener("test", null, e), window.removeEventListener("test", null, e)
        } catch (t) {}
        return t
    }();

    function be(t, e) {
        const i = he(t, e),
            s = i && i.match(/^(\d+)(\.\d+)?px$/);
        return s ? +s[1] : void 0
    }

    function xe(t) { return !t || i(t.size) || i(t.family) ? null : (t.style ? t.style + " " : "") + (t.weight ? t.weight + " " : "") + t.size + "px " + t.family }

    function _e(t, e, i, s, n) { let o = e[n]; return o || (o = e[n] = t.measureText(n).width, i.push(n)), o > s && (s = o), s }

    function ye(t, e, i, n) {
        let o = (n = n || {}).data = n.data || {},
            a = n.garbageCollect = n.garbageCollect || [];
        n.font !== e && (o = n.data = {}, a = n.garbageCollect = [], n.font = e), t.save(), t.font = e;
        let r = 0;
        const l = i.length;
        let h, c, d, u, f;
        for (h = 0; h < l; h++)
            if (u = i[h], null != u && !0 !== s(u)) r = _e(t, o, a, r, u);
            else if (s(u))
            for (c = 0, d = u.length; c < d; c++) f = u[c], null == f || s(f) || (r = _e(t, o, a, r, f));
        t.restore();
        const g = a.length / 2;
        if (g > i.length) {
            for (h = 0; h < g; h++) delete o[a[h]];
            a.splice(0, g)
        }
        return r
    }

    function ve(t, e, i) {
        const s = t.currentDevicePixelRatio,
            n = 0 !== i ? Math.max(i / 2, .5) : 0;
        return Math.round((e - n) * s) / s + n
    }

    function we(t, e) {
        (e = e || t.getContext("2d")).save(), e.resetTransform(), e.clearRect(0, 0, t.width, t.height), e.restore()
    }

    function Me(t, e, i, s) { ke(t, e, i, s, null) }

    function ke(t, e, i, s, n) {
        let o, a, r, l, h, c;
        const d = e.pointStyle,
            u = e.rotation,
            f = e.radius;
        let g = (u || 0) * T;
        if (d && "object" == typeof d && (o = d.toString(), "[object HTMLImageElement]" === o || "[object HTMLCanvasElement]" === o)) return t.save(), t.translate(i, s), t.rotate(g), t.drawImage(d, -d.width / 2, -d.height / 2, d.width, d.height), void t.restore();
        if (!(isNaN(f) || f <= 0)) {
            switch (t.beginPath(), d) {
                default: n ? t.ellipse(i, s, n / 2, f, 0, 0, O) : t.arc(i, s, f, 0, O),
                t.closePath();
                break;
                case "triangle":
                        t.moveTo(i + Math.sin(g) * f, s - Math.cos(g) * f),
                    g += R,
                    t.lineTo(i + Math.sin(g) * f, s - Math.cos(g) * f),
                    g += R,
                    t.lineTo(i + Math.sin(g) * f, s - Math.cos(g) * f),
                    t.closePath();
                    break;
                case "rectRounded":
                        h = .516 * f,
                    l = f - h,
                    a = Math.cos(g + E) * l,
                    r = Math.sin(g + E) * l,
                    t.arc(i - a, s - r, h, g - D, g - L),
                    t.arc(i + r, s - a, h, g - L, g),
                    t.arc(i + a, s + r, h, g, g + L),
                    t.arc(i - r, s + a, h, g + L, g + D),
                    t.closePath();
                    break;
                case "rect":
                        if (!u) { l = Math.SQRT1_2 * f, c = n ? n / 2 : l, t.rect(i - c, s - l, 2 * c, 2 * l); break }g += E;
                case "rectRot":
                        a = Math.cos(g) * f,
                    r = Math.sin(g) * f,
                    t.moveTo(i - a, s - r),
                    t.lineTo(i + r, s - a),
                    t.lineTo(i + a, s + r),
                    t.lineTo(i - r, s + a),
                    t.closePath();
                    break;
                case "crossRot":
                        g += E;
                case "cross":
                        a = Math.cos(g) * f,
                    r = Math.sin(g) * f,
                    t.moveTo(i - a, s - r),
                    t.lineTo(i + a, s + r),
                    t.moveTo(i + r, s - a),
                    t.lineTo(i - r, s + a);
                    break;
                case "star":
                        a = Math.cos(g) * f,
                    r = Math.sin(g) * f,
                    t.moveTo(i - a, s - r),
                    t.lineTo(i + a, s + r),
                    t.moveTo(i + r, s - a),
                    t.lineTo(i - r, s + a),
                    g += E,
                    a = Math.cos(g) * f,
                    r = Math.sin(g) * f,
                    t.moveTo(i - a, s - r),
                    t.lineTo(i + a, s + r),
                    t.moveTo(i + r, s - a),
                    t.lineTo(i - r, s + a);
                    break;
                case "line":
                        a = n ? n / 2 : Math.cos(g) * f,
                    r = Math.sin(g) * f,
                    t.moveTo(i - a, s - r),
                    t.lineTo(i + a, s + r);
                    break;
                case "dash":
                        t.moveTo(i, s),
                    t.lineTo(i + Math.cos(g) * f, s + Math.sin(g) * f)
            }
            t.fill(), e.borderWidth > 0 && t.stroke()
        }
    }

    function Se(t, e, i) { return i = i || .5, !e || t && t.x > e.left - i && t.x < e.right + i && t.y > e.top - i && t.y < e.bottom + i }

    function Pe(t, e) { t.save(), t.beginPath(), t.rect(e.left, e.top, e.right - e.left, e.bottom - e.top), t.clip() }

    function De(t) { t.restore() }

    function Oe(t, e, i, s, n) {
        if (!e) return t.lineTo(i.x, i.y);
        if ("middle" === n) {
            const s = (e.x + i.x) / 2;
            t.lineTo(s, e.y), t.lineTo(s, i.y)
        } else "after" === n != !!s ? t.lineTo(e.x, i.y) : t.lineTo(i.x, e.y);
        t.lineTo(i.x, i.y)
    }

    function Ce(t, e, i, s) {
        if (!e) return t.lineTo(i.x, i.y);
        t.bezierCurveTo(s ? e.cp1x : e.cp2x, s ? e.cp1y : e.cp2y, s ? i.cp2x : i.cp1x, s ? i.cp2y : i.cp1y, i.x, i.y)
    }

    function Ae(t, e, n, o, a, r = {}) {
        const l = s(e) ? e : [e],
            h = r.strokeWidth > 0 && "" !== r.strokeColor;
        let c, d;
        for (t.save(), t.font = a.string, function(t, e) {
                e.translation && t.translate(e.translation[0], e.translation[1]);
                i(e.rotation) || t.rotate(e.rotation);
                e.color && (t.fillStyle = e.color);
                e.textAlign && (t.textAlign = e.textAlign);
                e.textBaseline && (t.textBaseline = e.textBaseline)
            }(t, r), c = 0; c < l.length; ++c) d = l[c], h && (r.strokeColor && (t.strokeStyle = r.strokeColor), i(r.strokeWidth) || (t.lineWidth = r.strokeWidth), t.strokeText(d, n, o, r.maxWidth)), t.fillText(d, n, o, r.maxWidth), Te(t, n, o, d, r), o += a.lineHeight;
        t.restore()
    }

    function Te(t, e, i, s, n) {
        if (n.strikethrough || n.underline) {
            const o = t.measureText(s),
                a = e - o.actualBoundingBoxLeft,
                r = e + o.actualBoundingBoxRight,
                l = i - o.actualBoundingBoxAscent,
                h = i + o.actualBoundingBoxDescent,
                c = n.strikethrough ? (l + h) / 2 : h;
            t.strokeStyle = t.fillStyle, t.beginPath(), t.lineWidth = n.decorationWidth || 2, t.moveTo(a, c), t.lineTo(r, c), t.stroke()
        }
    }

    function Le(t, e) {
        const { x: i, y: s, w: n, h: o, radius: a } = e;
        t.arc(i + a.topLeft, s + a.topLeft, a.topLeft, -L, D, !0), t.lineTo(i, s + o - a.bottomLeft), t.arc(i + a.bottomLeft, s + o - a.bottomLeft, a.bottomLeft, D, L, !0), t.lineTo(i + n - a.bottomRight, s + o), t.arc(i + n - a.bottomRight, s + o - a.bottomRight, a.bottomRight, L, 0, !0), t.lineTo(i + n, s + a.topRight), t.arc(i + n - a.topRight, s + a.topRight, a.topRight, 0, -L, !0), t.lineTo(i + a.topLeft, s)
    }

    function Ee(t, e = [""], i = t, s, n = (() => t[0])) {
        M(s) || (s = $e("_fallback", t));
        const o = {
            [Symbol.toStringTag]: "Object",
            _cacheable: !0,
            _scopes: t,
            _rootScopes: i,
            _fallback: s,
            _getTarget: n,
            override: n => Ee([n, ...t], e, i, s)
        };
        return new Proxy(o, {
            deleteProperty: (e, i) => (delete e[i], delete e._keys, delete t[0][i], !0),
            get: (i, s) => Ve(i, s, (() => function(t, e, i, s) {
                let n;
                for (const o of e)
                    if (n = $e(ze(o, t), i), M(n)) return Fe(t, n) ? je(i, s, t, n) : n
            }(s, e, t, i))),
            getOwnPropertyDescriptor: (t, e) => Reflect.getOwnPropertyDescriptor(t._scopes[0], e),
            getPrototypeOf: () => Reflect.getPrototypeOf(t[0]),
            has: (t, e) => Ye(t).includes(e),
            ownKeys: t => Ye(t),
            set(t, e, i) { const s = t._storage || (t._storage = n()); return t[e] = s[e] = i, delete t._keys, !0 }
        })
    }

    function Re(t, e, i, o) {
        const a = { _cacheable: !1, _proxy: t, _context: e, _subProxy: i, _stack: new Set, _descriptors: Ie(t, o), setContext: e => Re(t, e, i, o), override: s => Re(t.override(s), e, i, o) };
        return new Proxy(a, {
            deleteProperty: (e, i) => (delete e[i], delete t[i], !0),
            get: (t, e, i) => Ve(t, e, (() => function(t, e, i) {
                const { _proxy: o, _context: a, _subProxy: r, _descriptors: l } = t;
                let h = o[e];
                k(h) && l.isScriptable(e) && (h = function(t, e, i, s) {
                    const { _proxy: n, _context: o, _subProxy: a, _stack: r } = i;
                    if (r.has(t)) throw new Error("Recursion detected: " + Array.from(r).join("->") + "->" + t);
                    r.add(t), e = e(o, a || s), r.delete(t), Fe(t, e) && (e = je(n._scopes, n, t, e));
                    return e
                }(e, h, t, i));
                s(h) && h.length && (h = function(t, e, i, s) {
                    const { _proxy: o, _context: a, _subProxy: r, _descriptors: l } = i;
                    if (M(a.index) && s(t)) e = e[a.index % e.length];
                    else if (n(e[0])) {
                        const i = e,
                            s = o._scopes.filter((t => t !== i));
                        e = [];
                        for (const n of i) {
                            const i = je(s, o, t, n);
                            e.push(Re(i, a, r && r[t], l))
                        }
                    }
                    return e
                }(e, h, t, l.isIndexable));
                Fe(e, h) && (h = Re(h, a, r && r[e], l));
                return h
            }(t, e, i))),
            getOwnPropertyDescriptor: (e, i) => e._descriptors.allKeys ? Reflect.has(t, i) ? { enumerable: !0, configurable: !0 } : void 0 : Reflect.getOwnPropertyDescriptor(t, i),
            getPrototypeOf: () => Reflect.getPrototypeOf(t),
            has: (e, i) => Reflect.has(t, i),
            ownKeys: () => Reflect.ownKeys(t),
            set: (e, i, s) => (t[i] = s, delete e[i], !0)
        })
    }

    function Ie(t, e = { scriptable: !0, indexable: !0 }) { const { _scriptable: i = e.scriptable, _indexable: s = e.indexable, _allKeys: n = e.allKeys } = t; return { allKeys: n, scriptable: i, indexable: s, isScriptable: k(i) ? i : () => i, isIndexable: k(s) ? s : () => s } }
    const ze = (t, e) => t ? t + w(e) : e,
        Fe = (t, e) => n(e) && "adapters" !== t && (null === Object.getPrototypeOf(e) || e.constructor === Object);

    function Ve(t, e, i) { if (Object.prototype.hasOwnProperty.call(t, e)) return t[e]; const s = i(); return t[e] = s, s }

    function Be(t, e, i) { return k(t) ? t(e, i) : t }
    const Ne = (t, e) => !0 === t ? e : "string" == typeof t ? y(e, t) : void 0;

    function We(t, e, i, s, n) { for (const o of e) { const e = Ne(i, o); if (e) { t.add(e); const o = Be(e._fallback, i, n); if (M(o) && o !== i && o !== s) return o } else if (!1 === e && M(s) && i !== s) return null } return !1 }

    function je(t, e, i, o) {
        const a = e._rootScopes,
            r = Be(e._fallback, i, o),
            l = [...t, ...a],
            h = new Set;
        h.add(o);
        let c = He(h, l, i, r || i, o);
        return null !== c && ((!M(r) || r === i || (c = He(h, l, r, c, o), null !== c)) && Ee(Array.from(h), [""], a, r, (() => function(t, e, i) {
            const o = t._getTarget();
            e in o || (o[e] = {});
            const a = o[e];
            if (s(a) && n(i)) return i;
            return a
        }(e, i, o))))
    }

    function He(t, e, i, s, n) { for (; i;) i = We(t, e, i, s, n); return i }

    function $e(t, e) { for (const i of e) { if (!i) continue; const e = i[t]; if (M(e)) return e } }

    function Ye(t) {
        let e = t._keys;
        return e || (e = t._keys = function(t) {
            const e = new Set;
            for (const i of t)
                for (const t of Object.keys(i).filter((t => !t.startsWith("_")))) e.add(t);
            return Array.from(e)
        }(t._scopes)), e
    }

    function Ue(t, e, i, s) { const { iScale: n } = t, { key: o = "r" } = this._parsing, a = new Array(s); let r, l, h, c; for (r = 0, l = s; r < l; ++r) h = r + i, c = e[h], a[r] = { r: n.parse(y(c, o), h) }; return a }
    const Xe = Number.EPSILON || 1e-14,
        qe = (t, e) => e < t.length && !t[e].skip && t[e],
        Ke = t => "x" === t ? "y" : "x";

    function Ge(t, e, i, s) {
        const n = t.skip ? e : t,
            o = e,
            a = i.skip ? e : i,
            r = X(o, n),
            l = X(a, o);
        let h = r / (r + l),
            c = l / (r + l);
        h = isNaN(h) ? 0 : h, c = isNaN(c) ? 0 : c;
        const d = s * h,
            u = s * c;
        return { previous: { x: o.x - d * (a.x - n.x), y: o.y - d * (a.y - n.y) }, next: { x: o.x + u * (a.x - n.x), y: o.y + u * (a.y - n.y) } }
    }

    function Ze(t, e = "x") {
        const i = Ke(e),
            s = t.length,
            n = Array(s).fill(0),
            o = Array(s);
        let a, r, l, h = qe(t, 0);
        for (a = 0; a < s; ++a)
            if (r = l, l = h, h = qe(t, a + 1), l) {
                if (h) {
                    const t = h[e] - l[e];
                    n[a] = 0 !== t ? (h[i] - l[i]) / t : 0
                }
                o[a] = r ? h ? z(n[a - 1]) !== z(n[a]) ? 0 : (n[a - 1] + n[a]) / 2 : n[a - 1] : n[a]
            }! function(t, e, i) { const s = t.length; let n, o, a, r, l, h = qe(t, 0); for (let c = 0; c < s - 1; ++c) l = h, h = qe(t, c + 1), l && h && (N(e[c], 0, Xe) ? i[c] = i[c + 1] = 0 : (n = i[c] / e[c], o = i[c + 1] / e[c], r = Math.pow(n, 2) + Math.pow(o, 2), r <= 9 || (a = 3 / Math.sqrt(r), i[c] = n * a * e[c], i[c + 1] = o * a * e[c]))) }(t, n, o),
        function(t, e, i = "x") {
            const s = Ke(i),
                n = t.length;
            let o, a, r, l = qe(t, 0);
            for (let h = 0; h < n; ++h) {
                if (a = r, r = l, l = qe(t, h + 1), !r) continue;
                const n = r[i],
                    c = r[s];
                a && (o = (n - a[i]) / 3, r[`cp1${i}`] = n - o, r[`cp1${s}`] = c - o * e[h]), l && (o = (l[i] - n) / 3, r[`cp2${i}`] = n + o, r[`cp2${s}`] = c + o * e[h])
            }
        }(t, o, e)
    }

    function Je(t, e, i) { return Math.max(Math.min(t, i), e) }

    function Qe(t, e, i, s, n) {
        let o, a, r, l;
        if (e.spanGaps && (t = t.filter((t => !t.skip))), "monotone" === e.cubicInterpolationMode) Ze(t, n);
        else { let i = s ? t[t.length - 1] : t[0]; for (o = 0, a = t.length; o < a; ++o) r = t[o], l = Ge(i, r, t[Math.min(o + 1, a - (s ? 0 : 1)) % a], e.tension), r.cp1x = l.previous.x, r.cp1y = l.previous.y, r.cp2x = l.next.x, r.cp2y = l.next.y, i = r }
        e.capBezierPoints && function(t, e) { let i, s, n, o, a, r = Se(t[0], e); for (i = 0, s = t.length; i < s; ++i) a = o, o = r, r = i < s - 1 && Se(t[i + 1], e), o && (n = t[i], a && (n.cp1x = Je(n.cp1x, e.left, e.right), n.cp1y = Je(n.cp1y, e.top, e.bottom)), r && (n.cp2x = Je(n.cp2x, e.left, e.right), n.cp2y = Je(n.cp2y, e.top, e.bottom))) }(t, i)
    }
    const ti = t => 0 === t || 1 === t,
        ei = (t, e, i) => -Math.pow(2, 10 * (t -= 1)) * Math.sin((t - e) * O / i),
        ii = (t, e, i) => Math.pow(2, -10 * t) * Math.sin((t - e) * O / i) + 1,
        si = {
            linear: t => t,
            easeInQuad: t => t * t,
            easeOutQuad: t => -t * (t - 2),
            easeInOutQuad: t => (t /= .5) < 1 ? .5 * t * t : -.5 * (--t * (t - 2) - 1),
            easeInCubic: t => t * t * t,
            easeOutCubic: t => (t -= 1) * t * t + 1,
            easeInOutCubic: t => (t /= .5) < 1 ? .5 * t * t * t : .5 * ((t -= 2) * t * t + 2),
            easeInQuart: t => t * t * t * t,
            easeOutQuart: t => -((t -= 1) * t * t * t - 1),
            easeInOutQuart: t => (t /= .5) < 1 ? .5 * t * t * t * t : -.5 * ((t -= 2) * t * t * t - 2),
            easeInQuint: t => t * t * t * t * t,
            easeOutQuint: t => (t -= 1) * t * t * t * t + 1,
            easeInOutQuint: t => (t /= .5) < 1 ? .5 * t * t * t * t * t : .5 * ((t -= 2) * t * t * t * t + 2),
            easeInSine: t => 1 - Math.cos(t * L),
            easeOutSine: t => Math.sin(t * L),
            easeInOutSine: t => -.5 * (Math.cos(D * t) - 1),
            easeInExpo: t => 0 === t ? 0 : Math.pow(2, 10 * (t - 1)),
            easeOutExpo: t => 1 === t ? 1 : 1 - Math.pow(2, -10 * t),
            easeInOutExpo: t => ti(t) ? t : t < .5 ? .5 * Math.pow(2, 10 * (2 * t - 1)) : .5 * (2 - Math.pow(2, -10 * (2 * t - 1))),
            easeInCirc: t => t >= 1 ? t : -(Math.sqrt(1 - t * t) - 1),
            easeOutCirc: t => Math.sqrt(1 - (t -= 1) * t),
            easeInOutCirc: t => (t /= .5) < 1 ? -.5 * (Math.sqrt(1 - t * t) - 1) : .5 * (Math.sqrt(1 - (t -= 2) * t) + 1),
            easeInElastic: t => ti(t) ? t : ei(t, .075, .3),
            easeOutElastic: t => ti(t) ? t : ii(t, .075, .3),
            easeInOutElastic(t) { const e = .1125; return ti(t) ? t : t < .5 ? .5 * ei(2 * t, e, .45) : .5 + .5 * ii(2 * t - 1, e, .45) },
            easeInBack(t) { const e = 1.70158; return t * t * ((e + 1) * t - e) },
            easeOutBack(t) { const e = 1.70158; return (t -= 1) * t * ((e + 1) * t + e) + 1 },
            easeInOutBack(t) { let e = 1.70158; return (t /= .5) < 1 ? t * t * ((1 + (e *= 1.525)) * t - e) * .5 : .5 * ((t -= 2) * t * ((1 + (e *= 1.525)) * t + e) + 2) },
            easeInBounce: t => 1 - si.easeOutBounce(1 - t),
            easeOutBounce(t) {
                const e = 7.5625,
                    i = 2.75;
                return t < 1 / i ? e * t * t : t < 2 / i ? e * (t -= 1.5 / i) * t + .75 : t < 2.5 / i ? e * (t -= 2.25 / i) * t + .9375 : e * (t -= 2.625 / i) * t + .984375
            },
            easeInOutBounce: t => t < .5 ? .5 * si.easeInBounce(2 * t) : .5 * si.easeOutBounce(2 * t - 1) + .5
        };

    function ni(t, e, i, s) { return { x: t.x + i * (e.x - t.x), y: t.y + i * (e.y - t.y) } }

    function oi(t, e, i, s) { return { x: t.x + i * (e.x - t.x), y: "middle" === s ? i < .5 ? t.y : e.y : "after" === s ? i < 1 ? t.y : e.y : i > 0 ? e.y : t.y } }

    function ai(t, e, i, s) {
        const n = { x: t.cp2x, y: t.cp2y },
            o = { x: e.cp1x, y: e.cp1y },
            a = ni(t, n, i),
            r = ni(n, o, i),
            l = ni(o, e, i),
            h = ni(a, r, i),
            c = ni(r, l, i);
        return ni(h, c, i)
    }
    const ri = new Map;

    function li(t, e, i) { return function(t, e) { e = e || {}; const i = t + JSON.stringify(e); let s = ri.get(i); return s || (s = new Intl.NumberFormat(t, e), ri.set(i, s)), s }(e, i).format(t) }
    const hi = new RegExp(/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/),
        ci = new RegExp(/^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/);

    function di(t, e) {
        const i = ("" + t).match(hi);
        if (!i || "normal" === i[1]) return 1.2 * e;
        switch (t = +i[2], i[3]) {
            case "px":
                return t;
            case "%":
                t /= 100
        }
        return e * t
    }

    function ui(t, e) {
        const i = {},
            s = n(e),
            o = s ? Object.keys(e) : e,
            a = n(t) ? s ? i => r(t[i], t[e[i]]) : e => t[e] : () => t;
        for (const t of o) i[t] = +a(t) || 0;
        return i
    }

    function fi(t) { return ui(t, { top: "y", right: "x", bottom: "y", left: "x" }) }

    function gi(t) { return ui(t, ["topLeft", "topRight", "bottomLeft", "bottomRight"]) }

    function pi(t) { const e = fi(t); return e.width = e.left + e.right, e.height = e.top + e.bottom, e }

    function mi(t, e) {
        t = t || {}, e = e || ne.font;
        let i = r(t.size, e.size);
        "string" == typeof i && (i = parseInt(i, 10));
        let s = r(t.style, e.style);
        s && !("" + s).match(ci) && (console.warn('Invalid font style specified: "' + s + '"'), s = "");
        const n = { family: r(t.family, e.family), lineHeight: di(r(t.lineHeight, e.lineHeight), i), size: i, style: s, weight: r(t.weight, e.weight), string: "" };
        return n.string = xe(n), n
    }

    function bi(t, e, i, n) {
        let o, a, r, l = !0;
        for (o = 0, a = t.length; o < a; ++o)
            if (r = t[o], void 0 !== r && (void 0 !== e && "function" == typeof r && (r = r(e), l = !1), void 0 !== i && s(r) && (r = r[i % r.length], l = !1), void 0 !== r)) return n && !l && (n.cacheable = !1), r
    }

    function xi(t, e, i) { const { min: s, max: n } = t, o = h(e, (n - s) / 2), a = (t, e) => i && 0 === t ? 0 : t + e; return { min: a(s, -Math.abs(o)), max: a(n, o) } }

    function _i(t, e) { return Object.assign(Object.create(t), e) }

    function yi(t, e, i) { return t ? function(t, e) { return { x: i => t + t + e - i, setWidth(t) { e = t }, textAlign: t => "center" === t ? t : "right" === t ? "left" : "right", xPlus: (t, e) => t - e, leftForLtr: (t, e) => t - e } }(e, i) : { x: t => t, setWidth(t) {}, textAlign: t => t, xPlus: (t, e) => t + e, leftForLtr: (t, e) => t } }

    function vi(t, e) { let i, s; "ltr" !== e && "rtl" !== e || (i = t.canvas.style, s = [i.getPropertyValue("direction"), i.getPropertyPriority("direction")], i.setProperty("direction", e, "important"), t.prevTextDirection = s) }

    function wi(t, e) { void 0 !== e && (delete t.prevTextDirection, t.canvas.style.setProperty("direction", e[0], e[1])) }

    function Mi(t) { return "angle" === t ? { between: G, compare: q, normalize: K } : { between: Q, compare: (t, e) => t - e, normalize: t => t } }

    function ki({ start: t, end: e, count: i, loop: s, style: n }) { return { start: t % i, end: e % i, loop: s && (e - t + 1) % i == 0, style: n } }

    function Si(t, e, i) {
        if (!i) return [t];
        const { property: s, start: n, end: o } = i, a = e.length, { compare: r, between: l, normalize: h } = Mi(s), { start: c, end: d, loop: u, style: f } = function(t, e, i) {
            const { property: s, start: n, end: o } = i, { between: a, normalize: r } = Mi(s), l = e.length;
            let h, c, { start: d, end: u, loop: f } = t;
            if (f) {
                for (d += l, u += l, h = 0, c = l; h < c && a(r(e[d % l][s]), n, o); ++h) d--, u--;
                d %= l, u %= l
            }
            return u < d && (u += l), { start: d, end: u, loop: f, style: t.style }
        }(t, e, i), g = [];
        let p, m, b, x = !1,
            _ = null;
        const y = () => x || l(n, b, p) && 0 !== r(n, b),
            v = () => !x || 0 === r(o, p) || l(o, b, p);
        for (let t = c, i = c; t <= d; ++t) m = e[t % a], m.skip || (p = h(m[s]), p !== b && (x = l(p, n, o), null === _ && y() && (_ = 0 === r(p, n) ? t : i), null !== _ && v() && (g.push(ki({ start: _, end: t, loop: u, count: a, style: f })), _ = null), i = t, b = p));
        return null !== _ && g.push(ki({ start: _, end: d, loop: u, count: a, style: f })), g
    }

    function Pi(t, e) {
        const i = [],
            s = t.segments;
        for (let n = 0; n < s.length; n++) {
            const o = Si(s[n], t.points, e);
            o.length && i.push(...o)
        }
        return i
    }

    function Di(t, e) {
        const i = t.points,
            s = t.options.spanGaps,
            n = i.length;
        if (!n) return [];
        const o = !!t._loop,
            { start: a, end: r } = function(t, e, i, s) {
                let n = 0,
                    o = e - 1;
                if (i && !s)
                    for (; n < e && !t[n].skip;) n++;
                for (; n < e && t[n].skip;) n++;
                for (n %= e, i && (o += n); o > n && t[o % e].skip;) o--;
                return o %= e, { start: n, end: o }
            }(i, n, o, s);
        if (!0 === s) return Oi(t, [{ start: a, end: r, loop: o }], i, e);
        return Oi(t, function(t, e, i, s) {
            const n = t.length,
                o = [];
            let a, r = e,
                l = t[e];
            for (a = e + 1; a <= i; ++a) {
                const i = t[a % n];
                i.skip || i.stop ? l.skip || (s = !1, o.push({ start: e % n, end: (a - 1) % n, loop: s }), e = r = i.stop ? a : null) : (r = a, l.skip && (e = a)), l = i
            }
            return null !== r && o.push({ start: e % n, end: r % n, loop: s }), o
        }(i, a, r < a ? r + n : r, !!t._fullLoop && 0 === a && r === n - 1), i, e)
    }

    function Oi(t, e, i, s) {
        return s && s.setContext && i ? function(t, e, i, s) {
            const n = t._chart.getContext(),
                o = Ci(t.options),
                { _datasetIndex: a, options: { spanGaps: r } } = t,
                l = i.length,
                h = [];
            let c = o,
                d = e[0].start,
                u = d;

            function f(t, e, s, n) {
                const o = r ? -1 : 1;
                if (t !== e) {
                    for (t += l; i[t % l].skip;) t -= o;
                    for (; i[e % l].skip;) e += o;
                    t % l != e % l && (h.push({ start: t % l, end: e % l, loop: s, style: n }), c = n, d = e % l)
                }
            }
            for (const t of e) {
                d = r ? d : t.start;
                let e, o = i[d % l];
                for (u = d + 1; u <= t.end; u++) {
                    const r = i[u % l];
                    e = Ci(s.setContext(_i(n, { type: "segment", p0: o, p1: r, p0DataIndex: (u - 1) % l, p1DataIndex: u % l, datasetIndex: a }))), Ai(e, c) && f(d, u - 1, t.loop, c), o = r, c = e
                }
                d < u - 1 && f(d, u - 1, t.loop, c)
            }
            return h
        }(t, e, i, s) : e
    }

    function Ci(t) { return { backgroundColor: t.backgroundColor, borderCapStyle: t.borderCapStyle, borderDash: t.borderDash, borderDashOffset: t.borderDashOffset, borderJoinStyle: t.borderJoinStyle, borderWidth: t.borderWidth, borderColor: t.borderColor } }

    function Ai(t, e) { return e && JSON.stringify(t) !== JSON.stringify(e) }
    var Ti = Object.freeze({ __proto__: null, easingEffects: si, isPatternOrGradient: Zt, color: Jt, getHoverColor: Qt, noop: t, uid: e, isNullOrUndef: i, isArray: s, isObject: n, isFinite: o, finiteOrDefault: a, valueOrDefault: r, toPercentage: l, toDimension: h, callback: c, each: d, _elementsEqual: u, clone: f, _merger: p, merge: m, mergeIf: b, _mergerIf: x, _deprecated: function(t, e, i, s) { void 0 !== e && console.warn(t + ': "' + i + '" is deprecated. Please use "' + s + '" instead') }, resolveObjectKey: y, _splitKey: v, _capitalize: w, defined: M, isFunction: k, setsEqual: S, _isClickEvent: P, toFontString: xe, _measureText: _e, _longestText: ye, _alignPixel: ve, clearCanvas: we, drawPoint: Me, drawPointLegend: ke, _isPointInArea: Se, clipArea: Pe, unclipArea: De, _steppedLineTo: Oe, _bezierCurveTo: Ce, renderText: Ae, addRoundedRectPath: Le, _lookup: tt, _lookupByKey: et, _rlookupByKey: it, _filterBetween: st, listenArrayEvents: ot, unlistenArrayEvents: at, _arrayUnique: rt, _createResolver: Ee, _attachContext: Re, _descriptors: Ie, _parseObjectDataRadialScale: Ue, splineCurve: Ge, splineCurveMonotone: Ze, _updateBezierControlPoints: Qe, _isDomSupported: oe, _getParentNode: ae, getStyle: he, getRelativePosition: ue, getMaximumSize: ge, retinaScale: pe, supportsEventListenerOptions: me, readUsedSize: be, fontString: function(t, e, i) { return e + " " + t + "px " + i }, requestAnimFrame: lt, throttled: ht, debounce: ct, _toLeftRightCenter: dt, _alignStartEnd: ut, _textX: ft, _getStartAndCountOfVisiblePoints: gt, _scaleRangesChanged: pt, _pointInLine: ni, _steppedInterpolation: oi, _bezierInterpolation: ai, formatNumber: li, toLineHeight: di, _readValueToProps: ui, toTRBL: fi, toTRBLCorners: gi, toPadding: pi, toFont: mi, resolve: bi, _addGrace: xi, createContext: _i, PI: D, TAU: O, PITAU: C, INFINITY: A, RAD_PER_DEG: T, HALF_PI: L, QUARTER_PI: E, TWO_THIRDS_PI: R, log10: I, sign: z, niceNum: F, _factorize: V, isNumber: B, almostEquals: N, almostWhole: W, _setMinAndMaxByKey: j, toRadians: H, toDegrees: $, _decimalPlaces: Y, getAngleFromPoint: U, distanceBetweenPoints: X, _angleDiff: q, _normalizeAngle: K, _angleBetween: G, _limitValue: Z, _int16Range: J, _isBetween: Q, getRtlAdapter: yi, overrideTextDirection: vi, restoreTextDirection: wi, _boundSegment: Si, _boundSegments: Pi, _computeSegments: Di });

    function Li(t, e, i, s) {
        const { controller: n, data: o, _sorted: a } = t, r = n._cachedMeta.iScale;
        if (r && e === r.axis && "r" !== e && a && o.length) {
            const t = r._reversePixels ? it : et;
            if (!s) return t(o, e, i);
            if (n._sharedOptions) {
                const s = o[0],
                    n = "function" == typeof s.getRange && s.getRange(e);
                if (n) {
                    const s = t(o, e, i - n),
                        a = t(o, e, i + n);
                    return { lo: s.lo, hi: a.hi }
                }
            }
        }
        return { lo: 0, hi: o.length - 1 }
    }

    function Ei(t, e, i, s, n) {
        const o = t.getSortedVisibleDatasetMetas(),
            a = i[e];
        for (let t = 0, i = o.length; t < i; ++t) {
            const { index: i, data: r } = o[t], { lo: l, hi: h } = Li(o[t], e, a, n);
            for (let t = l; t <= h; ++t) {
                const e = r[t];
                e.skip || s(e, i, t)
            }
        }
    }

    function Ri(t, e, i, s, n) {
        const o = [];
        if (!n && !t.isPointInArea(e)) return o;
        return Ei(t, i, e, (function(i, a, r) {
            (n || Se(i, t.chartArea, 0)) && i.inRange(e.x, e.y, s) && o.push({ element: i, datasetIndex: a, index: r })
        }), !0), o
    }

    function Ii(t, e, i, s, n, o) {
        let a = [];
        const r = function(t) {
            const e = -1 !== t.indexOf("x"),
                i = -1 !== t.indexOf("y");
            return function(t, s) {
                const n = e ? Math.abs(t.x - s.x) : 0,
                    o = i ? Math.abs(t.y - s.y) : 0;
                return Math.sqrt(Math.pow(n, 2) + Math.pow(o, 2))
            }
        }(i);
        let l = Number.POSITIVE_INFINITY;
        return Ei(t, i, e, (function(i, h, c) {
            const d = i.inRange(e.x, e.y, n);
            if (s && !d) return;
            const u = i.getCenterPoint(n);
            if (!(!!o || t.isPointInArea(u)) && !d) return;
            const f = r(e, u);
            f < l ? (a = [{ element: i, datasetIndex: h, index: c }], l = f) : f === l && a.push({ element: i, datasetIndex: h, index: c })
        })), a
    }

    function zi(t, e, i, s, n, o) {
        return o || t.isPointInArea(e) ? "r" !== i || s ? Ii(t, e, i, s, n, o) : function(t, e, i, s) {
            let n = [];
            return Ei(t, i, e, (function(t, i, o) {
                const { startAngle: a, endAngle: r } = t.getProps(["startAngle", "endAngle"], s), { angle: l } = U(t, { x: e.x, y: e.y });
                G(l, a, r) && n.push({ element: t, datasetIndex: i, index: o })
            })), n
        }(t, e, i, n) : []
    }

    function Fi(t, e, i, s, n) {
        const o = [],
            a = "x" === i ? "inXRange" : "inYRange";
        let r = !1;
        return Ei(t, i, e, ((t, s, l) => { t[a](e[i], n) && (o.push({ element: t, datasetIndex: s, index: l }), r = r || t.inRange(e.x, e.y, n)) })), s && !r ? [] : o
    }
    var Vi = {
        evaluateInteractionItems: Ei,
        modes: {
            index(t, e, i, s) {
                const n = ue(e, t),
                    o = i.axis || "x",
                    a = i.includeInvisible || !1,
                    r = i.intersect ? Ri(t, n, o, s, a) : zi(t, n, o, !1, s, a),
                    l = [];
                return r.length ? (t.getSortedVisibleDatasetMetas().forEach((t => {
                    const e = r[0].index,
                        i = t.data[e];
                    i && !i.skip && l.push({ element: i, datasetIndex: t.index, index: e })
                })), l) : []
            },
            dataset(t, e, i, s) {
                const n = ue(e, t),
                    o = i.axis || "xy",
                    a = i.includeInvisible || !1;
                let r = i.intersect ? Ri(t, n, o, s, a) : zi(t, n, o, !1, s, a);
                if (r.length > 0) {
                    const e = r[0].datasetIndex,
                        i = t.getDatasetMeta(e).data;
                    r = [];
                    for (let t = 0; t < i.length; ++t) r.push({ element: i[t], datasetIndex: e, index: t })
                }
                return r
            },
            point: (t, e, i, s) => Ri(t, ue(e, t), i.axis || "xy", s, i.includeInvisible || !1),
            nearest(t, e, i, s) {
                const n = ue(e, t),
                    o = i.axis || "xy",
                    a = i.includeInvisible || !1;
                return zi(t, n, o, i.intersect, s, a)
            },
            x: (t, e, i, s) => Fi(t, ue(e, t), "x", i.intersect, s),
            y: (t, e, i, s) => Fi(t, ue(e, t), "y", i.intersect, s)
        }
    };
    const Bi = ["left", "top", "right", "bottom"];

    function Ni(t, e) { return t.filter((t => t.pos === e)) }

    function Wi(t, e) { return t.filter((t => -1 === Bi.indexOf(t.pos) && t.box.axis === e)) }

    function ji(t, e) {
        return t.sort(((t, i) => {
            const s = e ? i : t,
                n = e ? t : i;
            return s.weight === n.weight ? s.index - n.index : s.weight - n.weight
        }))
    }

    function Hi(t, e) {
        const i = function(t) {
                const e = {};
                for (const i of t) {
                    const { stack: t, pos: s, stackWeight: n } = i;
                    if (!t || !Bi.includes(s)) continue;
                    const o = e[t] || (e[t] = { count: 0, placed: 0, weight: 0, size: 0 });
                    o.count++, o.weight += n
                }
                return e
            }(t),
            { vBoxMaxWidth: s, hBoxMaxHeight: n } = e;
        let o, a, r;
        for (o = 0, a = t.length; o < a; ++o) {
            r = t[o];
            const { fullSize: a } = r.box, l = i[r.stack], h = l && r.stackWeight / l.weight;
            r.horizontal ? (r.width = h ? h * s : a && e.availableWidth, r.height = n) : (r.width = s, r.height = h ? h * n : a && e.availableHeight)
        }
        return i
    }

    function $i(t, e, i, s) { return Math.max(t[i], e[i]) + Math.max(t[s], e[s]) }

    function Yi(t, e) { t.top = Math.max(t.top, e.top), t.left = Math.max(t.left, e.left), t.bottom = Math.max(t.bottom, e.bottom), t.right = Math.max(t.right, e.right) }

    function Ui(t, e, i, s) {
        const { pos: o, box: a } = i, r = t.maxPadding;
        if (!n(o)) {
            i.size && (t[o] -= i.size);
            const e = s[i.stack] || { size: 0, count: 1 };
            e.size = Math.max(e.size, i.horizontal ? a.height : a.width), i.size = e.size / e.count, t[o] += i.size
        }
        a.getPadding && Yi(r, a.getPadding());
        const l = Math.max(0, e.outerWidth - $i(r, t, "left", "right")),
            h = Math.max(0, e.outerHeight - $i(r, t, "top", "bottom")),
            c = l !== t.w,
            d = h !== t.h;
        return t.w = l, t.h = h, i.horizontal ? { same: c, other: d } : { same: d, other: c }
    }

    function Xi(t, e) {
        const i = e.maxPadding;

        function s(t) { const s = { left: 0, top: 0, right: 0, bottom: 0 }; return t.forEach((t => { s[t] = Math.max(e[t], i[t]) })), s }
        return s(t ? ["left", "right"] : ["top", "bottom"])
    }

    function qi(t, e, i, s) {
        const n = [];
        let o, a, r, l, h, c;
        for (o = 0, a = t.length, h = 0; o < a; ++o) {
            r = t[o], l = r.box, l.update(r.width || e.w, r.height || e.h, Xi(r.horizontal, e));
            const { same: a, other: d } = Ui(e, i, r, s);
            h |= a && n.length, c = c || d, l.fullSize || n.push(r)
        }
        return h && qi(n, e, i, s) || c
    }

    function Ki(t, e, i, s, n) { t.top = i, t.left = e, t.right = e + s, t.bottom = i + n, t.width = s, t.height = n }

    function Gi(t, e, i, s) {
        const n = i.padding;
        let { x: o, y: a } = e;
        for (const r of t) {
            const t = r.box,
                l = s[r.stack] || { count: 1, placed: 0, weight: 1 },
                h = r.stackWeight / l.weight || 1;
            if (r.horizontal) {
                const s = e.w * h,
                    o = l.size || t.height;
                M(l.start) && (a = l.start), t.fullSize ? Ki(t, n.left, a, i.outerWidth - n.right - n.left, o) : Ki(t, e.left + l.placed, a, s, o), l.start = a, l.placed += s, a = t.bottom
            } else {
                const s = e.h * h,
                    a = l.size || t.width;
                M(l.start) && (o = l.start), t.fullSize ? Ki(t, o, n.top, a, i.outerHeight - n.bottom - n.top) : Ki(t, o, e.top + l.placed, a, s), l.start = o, l.placed += s, o = t.right
            }
        }
        e.x = o, e.y = a
    }
    ne.set("layout", { autoPadding: !0, padding: { top: 0, right: 0, bottom: 0, left: 0 } });
    var Zi = {
        addBox(t, e) { t.boxes || (t.boxes = []), e.fullSize = e.fullSize || !1, e.position = e.position || "top", e.weight = e.weight || 0, e._layers = e._layers || function() { return [{ z: 0, draw(t) { e.draw(t) } }] }, t.boxes.push(e) },
        removeBox(t, e) { const i = t.boxes ? t.boxes.indexOf(e) : -1; - 1 !== i && t.boxes.splice(i, 1) },
        configure(t, e, i) { e.fullSize = i.fullSize, e.position = i.position, e.weight = i.weight },
        update(t, e, i, s) {
            if (!t) return;
            const n = pi(t.options.layout.padding),
                o = Math.max(e - n.width, 0),
                a = Math.max(i - n.height, 0),
                r = function(t) {
                    const e = function(t) { const e = []; let i, s, n, o, a, r; for (i = 0, s = (t || []).length; i < s; ++i) n = t[i], ({ position: o, options: { stack: a, stackWeight: r = 1 } } = n), e.push({ index: i, box: n, pos: o, horizontal: n.isHorizontal(), weight: n.weight, stack: a && o + a, stackWeight: r }); return e }(t),
                        i = ji(e.filter((t => t.box.fullSize)), !0),
                        s = ji(Ni(e, "left"), !0),
                        n = ji(Ni(e, "right")),
                        o = ji(Ni(e, "top"), !0),
                        a = ji(Ni(e, "bottom")),
                        r = Wi(e, "x"),
                        l = Wi(e, "y");
                    return { fullSize: i, leftAndTop: s.concat(o), rightAndBottom: n.concat(l).concat(a).concat(r), chartArea: Ni(e, "chartArea"), vertical: s.concat(n).concat(l), horizontal: o.concat(a).concat(r) }
                }(t.boxes),
                l = r.vertical,
                h = r.horizontal;
            d(t.boxes, (t => { "function" == typeof t.beforeLayout && t.beforeLayout() }));
            const c = l.reduce(((t, e) => e.box.options && !1 === e.box.options.display ? t : t + 1), 0) || 1,
                u = Object.freeze({ outerWidth: e, outerHeight: i, padding: n, availableWidth: o, availableHeight: a, vBoxMaxWidth: o / 2 / c, hBoxMaxHeight: a / 2 }),
                f = Object.assign({}, n);
            Yi(f, pi(s));
            const g = Object.assign({ maxPadding: f, w: o, h: a, x: n.left, y: n.top }, n),
                p = Hi(l.concat(h), u);
            qi(r.fullSize, g, u, p), qi(l, g, u, p), qi(h, g, u, p) && qi(l, g, u, p),
                function(t) {
                    const e = t.maxPadding;

                    function i(i) { const s = Math.max(e[i] - t[i], 0); return t[i] += s, s }
                    t.y += i("top"), t.x += i("left"), i("right"), i("bottom")
                }(g), Gi(r.leftAndTop, g, u, p), g.x += g.w, g.y += g.h, Gi(r.rightAndBottom, g, u, p), t.chartArea = { left: g.left, top: g.top, right: g.left + g.w, bottom: g.top + g.h, height: g.h, width: g.w }, d(r.chartArea, (e => {
                    const i = e.box;
                    Object.assign(i, t.chartArea), i.update(g.w, g.h, { left: 0, top: 0, right: 0, bottom: 0 })
                }))
        }
    };
    class Ji {
        acquireContext(t, e) {}
        releaseContext(t) { return !1 }
        addEventListener(t, e, i) {}
        removeEventListener(t, e, i) {}
        getDevicePixelRatio() { return 1 }
        getMaximumSize(t, e, i, s) { return e = Math.max(0, e || t.width), i = i || t.height, { width: e, height: Math.max(0, s ? Math.floor(e / s) : i) } }
        isAttached(t) { return !0 }
        updateConfig(t) {}
    }
    class Qi extends Ji {
        acquireContext(t) { return t && t.getContext && t.getContext("2d") || null }
        updateConfig(t) { t.options.animation = !1 }
    }
    const ts = { touchstart: "mousedown", touchmove: "mousemove", touchend: "mouseup", pointerenter: "mouseenter", pointerdown: "mousedown", pointermove: "mousemove", pointerup: "mouseup", pointerleave: "mouseout", pointerout: "mouseout" },
        es = t => null === t || "" === t;
    const is = !!me && { passive: !0 };

    function ss(t, e, i) { t.canvas.removeEventListener(e, i, is) }

    function ns(t, e) {
        for (const i of t)
            if (i === e || i.contains(e)) return !0
    }

    function os(t, e, i) {
        const s = t.canvas,
            n = new MutationObserver((t => {
                let e = !1;
                for (const i of t) e = e || ns(i.addedNodes, s), e = e && !ns(i.removedNodes, s);
                e && i()
            }));
        return n.observe(document, { childList: !0, subtree: !0 }), n
    }

    function as(t, e, i) {
        const s = t.canvas,
            n = new MutationObserver((t => {
                let e = !1;
                for (const i of t) e = e || ns(i.removedNodes, s), e = e && !ns(i.addedNodes, s);
                e && i()
            }));
        return n.observe(document, { childList: !0, subtree: !0 }), n
    }
    const rs = new Map;
    let ls = 0;

    function hs() {
        const t = window.devicePixelRatio;
        t !== ls && (ls = t, rs.forEach(((e, i) => { i.currentDevicePixelRatio !== t && e() })))
    }

    function cs(t, e, i) {
        const s = t.canvas,
            n = s && ae(s);
        if (!n) return;
        const o = ht(((t, e) => {
                const s = n.clientWidth;
                i(t, e), s < n.clientWidth && i()
            }), window),
            a = new ResizeObserver((t => {
                const e = t[0],
                    i = e.contentRect.width,
                    s = e.contentRect.height;
                0 === i && 0 === s || o(i, s)
            }));
        return a.observe(n),
            function(t, e) { rs.size || window.addEventListener("resize", hs), rs.set(t, e) }(t, o), a
    }

    function ds(t, e, i) { i && i.disconnect(), "resize" === e && function(t) { rs.delete(t), rs.size || window.removeEventListener("resize", hs) }(t) }

    function us(t, e, i) {
        const s = t.canvas,
            n = ht((e => {
                null !== t.ctx && i(function(t, e) {
                    const i = ts[t.type] || t.type,
                        { x: s, y: n } = ue(t, e);
                    return { type: i, chart: e, native: t, x: void 0 !== s ? s : null, y: void 0 !== n ? n : null }
                }(e, t))
            }), t, (t => { const e = t[0]; return [e, e.offsetX, e.offsetY] }));
        return function(t, e, i) { t.addEventListener(e, i, is) }(s, e, n), n
    }
    class fs extends Ji {
        acquireContext(t, e) {
            const i = t && t.getContext && t.getContext("2d");
            return i && i.canvas === t ? (function(t, e) {
                const i = t.style,
                    s = t.getAttribute("height"),
                    n = t.getAttribute("width");
                if (t.$chartjs = { initial: { height: s, width: n, style: { display: i.display, height: i.height, width: i.width } } }, i.display = i.display || "block", i.boxSizing = i.boxSizing || "border-box", es(n)) {
                    const e = be(t, "width");
                    void 0 !== e && (t.width = e)
                }
                if (es(s))
                    if ("" === t.style.height) t.height = t.width / (e || 2);
                    else {
                        const e = be(t, "height");
                        void 0 !== e && (t.height = e)
                    }
            }(t, e), i) : null
        }
        releaseContext(t) {
            const e = t.canvas;
            if (!e.$chartjs) return !1;
            const s = e.$chartjs.initial;
            ["height", "width"].forEach((t => {
                const n = s[t];
                i(n) ? e.removeAttribute(t) : e.setAttribute(t, n)
            }));
            const n = s.style || {};
            return Object.keys(n).forEach((t => { e.style[t] = n[t] })), e.width = e.width, delete e.$chartjs, !0
        }
        addEventListener(t, e, i) {
            this.removeEventListener(t, e);
            const s = t.$proxies || (t.$proxies = {}),
                n = { attach: os, detach: as, resize: cs }[e] || us;
            s[e] = n(t, e, i)
        }
        removeEventListener(t, e) {
            const i = t.$proxies || (t.$proxies = {}),
                s = i[e];
            if (!s) return;
            ({ attach: ds, detach: ds, resize: ds }[e] || ss)(t, e, s), i[e] = void 0
        }
        getDevicePixelRatio() { return window.devicePixelRatio }
        getMaximumSize(t, e, i, s) { return ge(t, e, i, s) }
        isAttached(t) { const e = ae(t); return !(!e || !e.isConnected) }
    }

    function gs(t) { return !oe() || "undefined" != typeof OffscreenCanvas && t instanceof OffscreenCanvas ? Qi : fs }
    var ps = Object.freeze({ __proto__: null, _detectPlatform: gs, BasePlatform: Ji, BasicPlatform: Qi, DomPlatform: fs });
    const ms = "transparent",
        bs = {
            boolean: (t, e, i) => i > .5 ? e : t,
            color(t, e, i) {
                const s = Jt(t || ms),
                    n = s.valid && Jt(e || ms);
                return n && n.valid ? n.mix(s, i).hexString() : e
            },
            number: (t, e, i) => t + (e - t) * i
        };
    class xs {
        constructor(t, e, i, s) {
            const n = e[i];
            s = bi([t.to, s, n, t.from]);
            const o = bi([t.from, n, s]);
            this._active = !0, this._fn = t.fn || bs[t.type || typeof o], this._easing = si[t.easing] || si.linear, this._start = Math.floor(Date.now() + (t.delay || 0)), this._duration = this._total = Math.floor(t.duration), this._loop = !!t.loop, this._target = e, this._prop = i, this._from = o, this._to = s, this._promises = void 0
        }
        active() { return this._active }
        update(t, e, i) {
            if (this._active) {
                this._notify(!1);
                const s = this._target[this._prop],
                    n = i - this._start,
                    o = this._duration - n;
                this._start = i, this._duration = Math.floor(Math.max(o, t.duration)), this._total += n, this._loop = !!t.loop, this._to = bi([t.to, e, s, t.from]), this._from = bi([t.from, s, e])
            }
        }
        cancel() { this._active && (this.tick(Date.now()), this._active = !1, this._notify(!1)) }
        tick(t) {
            const e = t - this._start,
                i = this._duration,
                s = this._prop,
                n = this._from,
                o = this._loop,
                a = this._to;
            let r;
            if (this._active = n !== a && (o || e < i), !this._active) return this._target[s] = a, void this._notify(!0);
            e < 0 ? this._target[s] = n : (r = e / i % 2, r = o && r > 1 ? 2 - r : r, r = this._easing(Math.min(1, Math.max(0, r))), this._target[s] = this._fn(n, a, r))
        }
        wait() { const t = this._promises || (this._promises = []); return new Promise(((e, i) => { t.push({ res: e, rej: i }) })) }
        _notify(t) {
            const e = t ? "res" : "rej",
                i = this._promises || [];
            for (let t = 0; t < i.length; t++) i[t][e]()
        }
    }
    ne.set("animation", { delay: void 0, duration: 1e3, easing: "easeOutQuart", fn: void 0, from: void 0, loop: void 0, to: void 0, type: void 0 });
    const _s = Object.keys(ne.animation);
    ne.describe("animation", { _fallback: !1, _indexable: !1, _scriptable: t => "onProgress" !== t && "onComplete" !== t && "fn" !== t }), ne.set("animations", { colors: { type: "color", properties: ["color", "borderColor", "backgroundColor"] }, numbers: { type: "number", properties: ["x", "y", "borderWidth", "radius", "tension"] } }), ne.describe("animations", { _fallback: "animation" }), ne.set("transitions", { active: { animation: { duration: 400 } }, resize: { animation: { duration: 0 } }, show: { animations: { colors: { from: "transparent" }, visible: { type: "boolean", duration: 0 } } }, hide: { animations: { colors: { to: "transparent" }, visible: { type: "boolean", easing: "linear", fn: t => 0 | t } } } });
    class ys {
        constructor(t, e) { this._chart = t, this._properties = new Map, this.configure(e) }
        configure(t) {
            if (!n(t)) return;
            const e = this._properties;
            Object.getOwnPropertyNames(t).forEach((i => {
                const o = t[i];
                if (!n(o)) return;
                const a = {};
                for (const t of _s) a[t] = o[t];
                (s(o.properties) && o.properties || [i]).forEach((t => { t !== i && e.has(t) || e.set(t, a) }))
            }))
        }
        _animateOptions(t, e) {
            const i = e.options,
                s = function(t, e) {
                    if (!e) return;
                    let i = t.options;
                    if (!i) return void(t.options = e);
                    i.$shared && (t.options = i = Object.assign({}, i, { $shared: !1, $animations: {} }));
                    return i
                }(t, i);
            if (!s) return [];
            const n = this._createAnimations(s, i);
            return i.$shared && function(t, e) {
                const i = [],
                    s = Object.keys(e);
                for (let e = 0; e < s.length; e++) {
                    const n = t[s[e]];
                    n && n.active() && i.push(n.wait())
                }
                return Promise.all(i)
            }(t.options.$animations, i).then((() => { t.options = i }), (() => {})), n
        }
        _createAnimations(t, e) {
            const i = this._properties,
                s = [],
                n = t.$animations || (t.$animations = {}),
                o = Object.keys(e),
                a = Date.now();
            let r;
            for (r = o.length - 1; r >= 0; --r) {
                const l = o[r];
                if ("$" === l.charAt(0)) continue;
                if ("options" === l) { s.push(...this._animateOptions(t, e)); continue }
                const h = e[l];
                let c = n[l];
                const d = i.get(l);
                if (c) {
                    if (d && c.active()) { c.update(d, h, a); continue }
                    c.cancel()
                }
                d && d.duration ? (n[l] = c = new xs(d, t, l, h), s.push(c)) : t[l] = h
            }
            return s
        }
        update(t, e) { if (0 === this._properties.size) return void Object.assign(t, e); const i = this._createAnimations(t, e); return i.length ? (mt.add(this._chart, i), !0) : void 0 }
    }

    function vs(t, e) {
        const i = t && t.options || {},
            s = i.reverse,
            n = void 0 === i.min ? e : 0,
            o = void 0 === i.max ? e : 0;
        return { start: s ? o : n, end: s ? n : o }
    }

    function ws(t, e) {
        const i = [],
            s = t._getSortedDatasetMetas(e);
        let n, o;
        for (n = 0, o = s.length; n < o; ++n) i.push(s[n].index);
        return i
    }

    function Ms(t, e, i, s = {}) {
        const n = t.keys,
            a = "single" === s.mode;
        let r, l, h, c;
        if (null !== e) {
            for (r = 0, l = n.length; r < l; ++r) {
                if (h = +n[r], h === i) { if (s.all) continue; break }
                c = t.values[h], o(c) && (a || 0 === e || z(e) === z(c)) && (e += c)
            }
            return e
        }
    }

    function ks(t, e) { const i = t && t.options.stacked; return i || void 0 === i && void 0 !== e.stack }

    function Ss(t, e, i) { const s = t[e] || (t[e] = {}); return s[i] || (s[i] = {}) }

    function Ps(t, e, i, s) { for (const n of e.getMatchingVisibleMetas(s).reverse()) { const e = t[n.index]; if (i && e > 0 || !i && e < 0) return n.index } return null }

    function Ds(t, e) {
        const { chart: i, _cachedMeta: s } = t, n = i._stacks || (i._stacks = {}), { iScale: o, vScale: a, index: r } = s, l = o.axis, h = a.axis, c = function(t, e, i) { return `${t.id}.${e.id}.${i.stack||i.type}` }(o, a, s), d = e.length;
        let u;
        for (let t = 0; t < d; ++t) {
            const i = e[t],
                {
                    [l]: o,
                    [h]: d
                } = i;
            u = (i._stacks || (i._stacks = {}))[h] = Ss(n, c, o), u[r] = d, u._top = Ps(u, a, !0, s.type), u._bottom = Ps(u, a, !1, s.type)
        }
    }

    function Os(t, e) { const i = t.scales; return Object.keys(i).filter((t => i[t].axis === e)).shift() }

    function Cs(t, e) {
        const i = t.controller.index,
            s = t.vScale && t.vScale.axis;
        if (s) {
            e = e || t._parsed;
            for (const t of e) {
                const e = t._stacks;
                if (!e || void 0 === e[s] || void 0 === e[s][i]) return;
                delete e[s][i]
            }
        }
    }
    const As = t => "reset" === t || "none" === t,
        Ts = (t, e) => e ? t : Object.assign({}, t);
    class Ls {
        constructor(t, e) { this.chart = t, this._ctx = t.ctx, this.index = e, this._cachedDataOpts = {}, this._cachedMeta = this.getMeta(), this._type = this._cachedMeta.type, this.options = void 0, this._parsing = !1, this._data = void 0, this._objectData = void 0, this._sharedOptions = void 0, this._drawStart = void 0, this._drawCount = void 0, this.enableOptionSharing = !1, this.supportsDecimation = !1, this.$context = void 0, this._syncList = [], this.initialize() }
        initialize() {
            const t = this._cachedMeta;
            this.configure(), this.linkScales(), t._stacked = ks(t.vScale, t), this.addElements()
        }
        updateIndex(t) { this.index !== t && Cs(this._cachedMeta), this.index = t }
        linkScales() {
            const t = this.chart,
                e = this._cachedMeta,
                i = this.getDataset(),
                s = (t, e, i, s) => "x" === t ? e : "r" === t ? s : i,
                n = e.xAxisID = r(i.xAxisID, Os(t, "x")),
                o = e.yAxisID = r(i.yAxisID, Os(t, "y")),
                a = e.rAxisID = r(i.rAxisID, Os(t, "r")),
                l = e.indexAxis,
                h = e.iAxisID = s(l, n, o, a),
                c = e.vAxisID = s(l, o, n, a);
            e.xScale = this.getScaleForId(n), e.yScale = this.getScaleForId(o), e.rScale = this.getScaleForId(a), e.iScale = this.getScaleForId(h), e.vScale = this.getScaleForId(c)
        }
        getDataset() { return this.chart.data.datasets[this.index] }
        getMeta() { return this.chart.getDatasetMeta(this.index) }
        getScaleForId(t) { return this.chart.scales[t] }
        _getOtherScale(t) { const e = this._cachedMeta; return t === e.iScale ? e.vScale : e.iScale }
        reset() { this._update("reset") }
        _destroy() {
            const t = this._cachedMeta;
            this._data && at(this._data, this), t._stacked && Cs(t)
        }
        _dataCheck() {
            const t = this.getDataset(),
                e = t.data || (t.data = []),
                i = this._data;
            if (n(e)) this._data = function(t) {
                const e = Object.keys(t),
                    i = new Array(e.length);
                let s, n, o;
                for (s = 0, n = e.length; s < n; ++s) o = e[s], i[s] = { x: o, y: t[o] };
                return i
            }(e);
            else if (i !== e) {
                if (i) {
                    at(i, this);
                    const t = this._cachedMeta;
                    Cs(t), t._parsed = []
                }
                e && Object.isExtensible(e) && ot(e, this), this._syncList = [], this._data = e
            }
        }
        addElements() {
            const t = this._cachedMeta;
            this._dataCheck(), this.datasetElementType && (t.dataset = new this.datasetElementType)
        }
        buildOrUpdateElements(t) {
            const e = this._cachedMeta,
                i = this.getDataset();
            let s = !1;
            this._dataCheck();
            const n = e._stacked;
            e._stacked = ks(e.vScale, e), e.stack !== i.stack && (s = !0, Cs(e), e.stack = i.stack), this._resyncElements(t), (s || n !== e._stacked) && Ds(this, e._parsed)
        }
        configure() {
            const t = this.chart.config,
                e = t.datasetScopeKeys(this._type),
                i = t.getOptionScopes(this.getDataset(), e, !0);
            this.options = t.createResolver(i, this.getContext()), this._parsing = this.options.parsing, this._cachedDataOpts = {}
        }
        parse(t, e) {
            const { _cachedMeta: i, _data: o } = this, { iScale: a, _stacked: r } = i, l = a.axis;
            let h, c, d, u = 0 === t && e === o.length || i._sorted,
                f = t > 0 && i._parsed[t - 1];
            if (!1 === this._parsing) i._parsed = o, i._sorted = !0, d = o;
            else {
                d = s(o[t]) ? this.parseArrayData(i, o, t, e) : n(o[t]) ? this.parseObjectData(i, o, t, e) : this.parsePrimitiveData(i, o, t, e);
                const a = () => null === c[l] || f && c[l] < f[l];
                for (h = 0; h < e; ++h) i._parsed[h + t] = c = d[h], u && (a() && (u = !1), f = c);
                i._sorted = u
            }
            r && Ds(this, d)
        }
        parsePrimitiveData(t, e, i, s) {
            const { iScale: n, vScale: o } = t, a = n.axis, r = o.axis, l = n.getLabels(), h = n === o, c = new Array(s);
            let d, u, f;
            for (d = 0, u = s; d < u; ++d) f = d + i, c[d] = {
                [a]: h || n.parse(l[f], f),
                [r]: o.parse(e[f], f)
            };
            return c
        }
        parseArrayData(t, e, i, s) { const { xScale: n, yScale: o } = t, a = new Array(s); let r, l, h, c; for (r = 0, l = s; r < l; ++r) h = r + i, c = e[h], a[r] = { x: n.parse(c[0], h), y: o.parse(c[1], h) }; return a }
        parseObjectData(t, e, i, s) { const { xScale: n, yScale: o } = t, { xAxisKey: a = "x", yAxisKey: r = "y" } = this._parsing, l = new Array(s); let h, c, d, u; for (h = 0, c = s; h < c; ++h) d = h + i, u = e[d], l[h] = { x: n.parse(y(u, a), d), y: o.parse(y(u, r), d) }; return l }
        getParsed(t) { return this._cachedMeta._parsed[t] }
        getDataElement(t) { return this._cachedMeta.data[t] }
        applyStack(t, e, i) {
            const s = this.chart,
                n = this._cachedMeta,
                o = e[t.axis];
            return Ms({ keys: ws(s, !0), values: e._stacks[t.axis] }, o, n.index, { mode: i })
        }
        updateRangeFromParsed(t, e, i, s) {
            const n = i[e.axis];
            let o = null === n ? NaN : n;
            const a = s && i._stacks[e.axis];
            s && a && (s.values = a, o = Ms(s, n, this._cachedMeta.index)), t.min = Math.min(t.min, o), t.max = Math.max(t.max, o)
        }
        getMinMax(t, e) {
            const i = this._cachedMeta,
                s = i._parsed,
                n = i._sorted && t === i.iScale,
                a = s.length,
                r = this._getOtherScale(t),
                l = ((t, e, i) => t && !e.hidden && e._stacked && { keys: ws(i, !0), values: null })(e, i, this.chart),
                h = { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY },
                { min: c, max: d } = function(t) { const { min: e, max: i, minDefined: s, maxDefined: n } = t.getUserBounds(); return { min: s ? e : Number.NEGATIVE_INFINITY, max: n ? i : Number.POSITIVE_INFINITY } }(r);
            let u, f;

            function g() { f = s[u]; const e = f[r.axis]; return !o(f[t.axis]) || c > e || d < e }
            for (u = 0; u < a && (g() || (this.updateRangeFromParsed(h, t, f, l), !n)); ++u);
            if (n)
                for (u = a - 1; u >= 0; --u)
                    if (!g()) { this.updateRangeFromParsed(h, t, f, l); break }
            return h
        }
        getAllParsedValues(t) {
            const e = this._cachedMeta._parsed,
                i = [];
            let s, n, a;
            for (s = 0, n = e.length; s < n; ++s) a = e[s][t.axis], o(a) && i.push(a);
            return i
        }
        getMaxOverflow() { return !1 }
        getLabelAndValue(t) {
            const e = this._cachedMeta,
                i = e.iScale,
                s = e.vScale,
                n = this.getParsed(t);
            return { label: i ? "" + i.getLabelForValue(n[i.axis]) : "", value: s ? "" + s.getLabelForValue(n[s.axis]) : "" }
        }
        _update(t) {
            const e = this._cachedMeta;
            this.update(t || "default"), e._clip = function(t) { let e, i, s, o; return n(t) ? (e = t.top, i = t.right, s = t.bottom, o = t.left) : e = i = s = o = t, { top: e, right: i, bottom: s, left: o, disabled: !1 === t } }(r(this.options.clip, function(t, e, i) {
                if (!1 === i) return !1;
                const s = vs(t, i),
                    n = vs(e, i);
                return { top: n.end, right: s.end, bottom: n.start, left: s.start }
            }(e.xScale, e.yScale, this.getMaxOverflow())))
        }
        update(t) {}
        draw() {
            const t = this._ctx,
                e = this.chart,
                i = this._cachedMeta,
                s = i.data || [],
                n = e.chartArea,
                o = [],
                a = this._drawStart || 0,
                r = this._drawCount || s.length - a,
                l = this.options.drawActiveElementsOnTop;
            let h;
            for (i.dataset && i.dataset.draw(t, n, a, r), h = a; h < a + r; ++h) {
                const e = s[h];
                e.hidden || (e.active && l ? o.push(e) : e.draw(t, n))
            }
            for (h = 0; h < o.length; ++h) o[h].draw(t, n)
        }
        getStyle(t, e) { const i = e ? "active" : "default"; return void 0 === t && this._cachedMeta.dataset ? this.resolveDatasetElementOptions(i) : this.resolveDataElementOptions(t || 0, i) }
        getContext(t, e, i) {
            const s = this.getDataset();
            let n;
            if (t >= 0 && t < this._cachedMeta.data.length) {
                const e = this._cachedMeta.data[t];
                n = e.$context || (e.$context = function(t, e, i) { return _i(t, { active: !1, dataIndex: e, parsed: void 0, raw: void 0, element: i, index: e, mode: "default", type: "data" }) }(this.getContext(), t, e)), n.parsed = this.getParsed(t), n.raw = s.data[t], n.index = n.dataIndex = t
            } else n = this.$context || (this.$context = function(t, e) { return _i(t, { active: !1, dataset: void 0, datasetIndex: e, index: e, mode: "default", type: "dataset" }) }(this.chart.getContext(), this.index)), n.dataset = s, n.index = n.datasetIndex = this.index;
            return n.active = !!e, n.mode = i, n
        }
        resolveDatasetElementOptions(t) { return this._resolveElementOptions(this.datasetElementType.id, t) }
        resolveDataElementOptions(t, e) { return this._resolveElementOptions(this.dataElementType.id, e, t) }
        _resolveElementOptions(t, e = "default", i) {
            const s = "active" === e,
                n = this._cachedDataOpts,
                o = t + "-" + e,
                a = n[o],
                r = this.enableOptionSharing && M(i);
            if (a) return Ts(a, r);
            const l = this.chart.config,
                h = l.datasetElementScopeKeys(this._type, t),
                c = s ? [`${t}Hover`, "hover", t, ""] : [t, ""],
                d = l.getOptionScopes(this.getDataset(), h),
                u = Object.keys(ne.elements[t]),
                f = l.resolveNamedOptions(d, u, (() => this.getContext(i, s)), c);
            return f.$shared && (f.$shared = r, n[o] = Object.freeze(Ts(f, r))), f
        }
        _resolveAnimations(t, e, i) {
            const s = this.chart,
                n = this._cachedDataOpts,
                o = `animation-${e}`,
                a = n[o];
            if (a) return a;
            let r;
            if (!1 !== s.options.animation) {
                const s = this.chart.config,
                    n = s.datasetAnimationScopeKeys(this._type, e),
                    o = s.getOptionScopes(this.getDataset(), n);
                r = s.createResolver(o, this.getContext(t, i, e))
            }
            const l = new ys(s, r && r.animations);
            return r && r._cacheable && (n[o] = Object.freeze(l)), l
        }
        getSharedOptions(t) { if (t.$shared) return this._sharedOptions || (this._sharedOptions = Object.assign({}, t)) }
        includeOptions(t, e) { return !e || As(t) || this.chart._animationsDisabled }
        _getSharedOptions(t, e) {
            const i = this.resolveDataElementOptions(t, e),
                s = this._sharedOptions,
                n = this.getSharedOptions(i),
                o = this.includeOptions(e, n) || n !== s;
            return this.updateSharedOptions(n, e, i), { sharedOptions: n, includeOptions: o }
        }
        updateElement(t, e, i, s) { As(s) ? Object.assign(t, i) : this._resolveAnimations(e, s).update(t, i) }
        updateSharedOptions(t, e, i) { t && !As(e) && this._resolveAnimations(void 0, e).update(t, i) }
        _setStyle(t, e, i, s) {
            t.active = s;
            const n = this.getStyle(e, s);
            this._resolveAnimations(e, i, s).update(t, { options: !s && this.getSharedOptions(n) || n })
        }
        removeHoverStyle(t, e, i) { this._setStyle(t, i, "active", !1) }
        setHoverStyle(t, e, i) { this._setStyle(t, i, "active", !0) }
        _removeDatasetHoverStyle() {
            const t = this._cachedMeta.dataset;
            t && this._setStyle(t, void 0, "active", !1)
        }
        _setDatasetHoverStyle() {
            const t = this._cachedMeta.dataset;
            t && this._setStyle(t, void 0, "active", !0)
        }
        _resyncElements(t) {
            const e = this._data,
                i = this._cachedMeta.data;
            for (const [t, e, i] of this._syncList) this[t](e, i);
            this._syncList = [];
            const s = i.length,
                n = e.length,
                o = Math.min(n, s);
            o && this.parse(0, o), n > s ? this._insertElements(s, n - s, t) : n < s && this._removeElements(n, s - n)
        }
        _insertElements(t, e, i = !0) {
            const s = this._cachedMeta,
                n = s.data,
                o = t + e;
            let a;
            const r = t => { for (t.length += e, a = t.length - 1; a >= o; a--) t[a] = t[a - e] };
            for (r(n), a = t; a < o; ++a) n[a] = new this.dataElementType;
            this._parsing && r(s._parsed), this.parse(t, e), i && this.updateElements(n, t, e, "reset")
        }
        updateElements(t, e, i, s) {}
        _removeElements(t, e) {
            const i = this._cachedMeta;
            if (this._parsing) {
                const s = i._parsed.splice(t, e);
                i._stacked && Cs(i, s)
            }
            i.data.splice(t, e)
        }
        _sync(t) {
            if (this._parsing) this._syncList.push(t);
            else {
                const [e, i, s] = t;
                this[e](i, s)
            }
            this.chart._dataChanges.push([this.index, ...t])
        }
        _onDataPush() {
            const t = arguments.length;
            this._sync(["_insertElements", this.getDataset().data.length - t, t])
        }
        _onDataPop() { this._sync(["_removeElements", this._cachedMeta.data.length - 1, 1]) }
        _onDataShift() { this._sync(["_removeElements", 0, 1]) }
        _onDataSplice(t, e) {
            e && this._sync(["_removeElements", t, e]);
            const i = arguments.length - 2;
            i && this._sync(["_insertElements", t, i])
        }
        _onDataUnshift() { this._sync(["_insertElements", 0, arguments.length]) }
    }
    Ls.defaults = {}, Ls.prototype.datasetElementType = null, Ls.prototype.dataElementType = null;
    class Es {
        constructor() { this.x = void 0, this.y = void 0, this.active = !1, this.options = void 0, this.$animations = void 0 }
        tooltipPosition(t) { const { x: e, y: i } = this.getProps(["x", "y"], t); return { x: e, y: i } }
        hasValue() { return B(this.x) && B(this.y) }
        getProps(t, e) { const i = this.$animations; if (!e || !i) return this; const s = {}; return t.forEach((t => { s[t] = i[t] && i[t].active() ? i[t]._to : this[t] })), s }
    }
    Es.defaults = {}, Es.defaultRoutes = void 0;
    const Rs = {
        values: t => s(t) ? t : "" + t,
        numeric(t, e, i) {
            if (0 === t) return "0";
            const s = this.chart.options.locale;
            let n, o = t;
            if (i.length > 1) {
                const e = Math.max(Math.abs(i[0].value), Math.abs(i[i.length - 1].value));
                (e < 1e-4 || e > 1e15) && (n = "scientific"), o = function(t, e) {
                    let i = e.length > 3 ? e[2].value - e[1].value : e[1].value - e[0].value;
                    Math.abs(i) >= 1 && t !== Math.floor(t) && (i = t - Math.floor(t));
                    return i
                }(t, i)
            }
            const a = I(Math.abs(o)),
                r = Math.max(Math.min(-1 * Math.floor(a), 20), 0),
                l = { notation: n, minimumFractionDigits: r, maximumFractionDigits: r };
            return Object.assign(l, this.options.ticks.format), li(t, s, l)
        },
        logarithmic(t, e, i) { if (0 === t) return "0"; const s = t / Math.pow(10, Math.floor(I(t))); return 1 === s || 2 === s || 5 === s ? Rs.numeric.call(this, t, e, i) : "" }
    };
    var Is = { formatters: Rs };

    function zs(t, e) {
        const s = t.options.ticks,
            n = s.maxTicksLimit || function(t) {
                const e = t.options.offset,
                    i = t._tickSize(),
                    s = t._length / i + (e ? 0 : 1),
                    n = t._maxLength / i;
                return Math.floor(Math.min(s, n))
            }(t),
            o = s.major.enabled ? function(t) { const e = []; let i, s; for (i = 0, s = t.length; i < s; i++) t[i].major && e.push(i); return e }(e) : [],
            a = o.length,
            r = o[0],
            l = o[a - 1],
            h = [];
        if (a > n) return function(t, e, i, s) {
            let n, o = 0,
                a = i[0];
            for (s = Math.ceil(s), n = 0; n < t.length; n++) n === a && (e.push(t[n]), o++, a = i[o * s])
        }(e, h, o, a / n), h;
        const c = function(t, e, i) {
            const s = function(t) {
                    const e = t.length;
                    let i, s;
                    if (e < 2) return !1;
                    for (s = t[0], i = 1; i < e; ++i)
                        if (t[i] - t[i - 1] !== s) return !1;
                    return s
                }(t),
                n = e.length / i;
            if (!s) return Math.max(n, 1);
            const o = V(s);
            for (let t = 0, e = o.length - 1; t < e; t++) { const e = o[t]; if (e > n) return e }
            return Math.max(n, 1)
        }(o, e, n);
        if (a > 0) { let t, s; const n = a > 1 ? Math.round((l - r) / (a - 1)) : null; for (Fs(e, h, c, i(n) ? 0 : r - n, r), t = 0, s = a - 1; t < s; t++) Fs(e, h, c, o[t], o[t + 1]); return Fs(e, h, c, l, i(n) ? e.length : l + n), h }
        return Fs(e, h, c), h
    }

    function Fs(t, e, i, s, n) {
        const o = r(s, 0),
            a = Math.min(r(n, t.length), t.length);
        let l, h, c, d = 0;
        for (i = Math.ceil(i), n && (l = n - s, i = l / Math.floor(l / i)), c = o; c < 0;) d++, c = Math.round(o + d * i);
        for (h = Math.max(o, 0); h < a; h++) h === c && (e.push(t[h]), d++, c = Math.round(o + d * i))
    }
    ne.set("scale", { display: !0, offset: !1, reverse: !1, beginAtZero: !1, bounds: "ticks", grace: 0, grid: { display: !0, lineWidth: 1, drawBorder: !0, drawOnChartArea: !0, drawTicks: !0, tickLength: 8, tickWidth: (t, e) => e.lineWidth, tickColor: (t, e) => e.color, offset: !1, borderDash: [], borderDashOffset: 0, borderWidth: 1 }, title: { display: !1, text: "", padding: { top: 4, bottom: 4 } }, ticks: { minRotation: 0, maxRotation: 50, mirror: !1, textStrokeWidth: 0, textStrokeColor: "", padding: 3, display: !0, autoSkip: !0, autoSkipPadding: 3, labelOffset: 0, callback: Is.formatters.values, minor: {}, major: {}, align: "center", crossAlign: "near", showLabelBackdrop: !1, backdropColor: "rgba(255, 255, 255, 0.75)", backdropPadding: 2 } }), ne.route("scale.ticks", "color", "", "color"), ne.route("scale.grid", "color", "", "borderColor"), ne.route("scale.grid", "borderColor", "", "borderColor"), ne.route("scale.title", "color", "", "color"), ne.describe("scale", { _fallback: !1, _scriptable: t => !t.startsWith("before") && !t.startsWith("after") && "callback" !== t && "parser" !== t, _indexable: t => "borderDash" !== t && "tickBorderDash" !== t }), ne.describe("scales", { _fallback: "scale" }), ne.describe("scale.ticks", { _scriptable: t => "backdropPadding" !== t && "callback" !== t, _indexable: t => "backdropPadding" !== t });
    const Vs = (t, e, i) => "top" === e || "left" === e ? t[e] + i : t[e] - i;

    function Bs(t, e) {
        const i = [],
            s = t.length / e,
            n = t.length;
        let o = 0;
        for (; o < n; o += s) i.push(t[Math.floor(o)]);
        return i
    }

    function Ns(t, e, i) {
        const s = t.ticks.length,
            n = Math.min(e, s - 1),
            o = t._startPixel,
            a = t._endPixel,
            r = 1e-6;
        let l, h = t.getPixelForTick(n);
        if (!(i && (l = 1 === s ? Math.max(h - o, a - h) : 0 === e ? (t.getPixelForTick(1) - h) / 2 : (h - t.getPixelForTick(n - 1)) / 2, h += n < e ? l : -l, h < o - r || h > a + r))) return h
    }

    function Ws(t) { return t.drawTicks ? t.tickLength : 0 }

    function js(t, e) {
        if (!t.display) return 0;
        const i = mi(t.font, e),
            n = pi(t.padding);
        return (s(t.text) ? t.text.length : 1) * i.lineHeight + n.height
    }

    function Hs(t, e, i) { let s = dt(t); return (i && "right" !== e || !i && "right" === e) && (s = (t => "left" === t ? "right" : "right" === t ? "left" : t)(s)), s }
    class $s extends Es {
        constructor(t) { super(), this.id = t.id, this.type = t.type, this.options = void 0, this.ctx = t.ctx, this.chart = t.chart, this.top = void 0, this.bottom = void 0, this.left = void 0, this.right = void 0, this.width = void 0, this.height = void 0, this._margins = { left: 0, right: 0, top: 0, bottom: 0 }, this.maxWidth = void 0, this.maxHeight = void 0, this.paddingTop = void 0, this.paddingBottom = void 0, this.paddingLeft = void 0, this.paddingRight = void 0, this.axis = void 0, this.labelRotation = void 0, this.min = void 0, this.max = void 0, this._range = void 0, this.ticks = [], this._gridLineItems = null, this._labelItems = null, this._labelSizes = null, this._length = 0, this._maxLength = 0, this._longestTextCache = {}, this._startPixel = void 0, this._endPixel = void 0, this._reversePixels = !1, this._userMax = void 0, this._userMin = void 0, this._suggestedMax = void 0, this._suggestedMin = void 0, this._ticksLength = 0, this._borderValue = 0, this._cache = {}, this._dataLimitsCached = !1, this.$context = void 0 }
        init(t) { this.options = t.setContext(this.getContext()), this.axis = t.axis, this._userMin = this.parse(t.min), this._userMax = this.parse(t.max), this._suggestedMin = this.parse(t.suggestedMin), this._suggestedMax = this.parse(t.suggestedMax) }
        parse(t, e) { return t }
        getUserBounds() { let { _userMin: t, _userMax: e, _suggestedMin: i, _suggestedMax: s } = this; return t = a(t, Number.POSITIVE_INFINITY), e = a(e, Number.NEGATIVE_INFINITY), i = a(i, Number.POSITIVE_INFINITY), s = a(s, Number.NEGATIVE_INFINITY), { min: a(t, i), max: a(e, s), minDefined: o(t), maxDefined: o(e) } }
        getMinMax(t) { let e, { min: i, max: s, minDefined: n, maxDefined: o } = this.getUserBounds(); if (n && o) return { min: i, max: s }; const r = this.getMatchingVisibleMetas(); for (let a = 0, l = r.length; a < l; ++a) e = r[a].controller.getMinMax(this, t), n || (i = Math.min(i, e.min)), o || (s = Math.max(s, e.max)); return i = o && i > s ? s : i, s = n && i > s ? i : s, { min: a(i, a(s, i)), max: a(s, a(i, s)) } }
        getPadding() { return { left: this.paddingLeft || 0, top: this.paddingTop || 0, right: this.paddingRight || 0, bottom: this.paddingBottom || 0 } }
        getTicks() { return this.ticks }
        getLabels() { const t = this.chart.data; return this.options.labels || (this.isHorizontal() ? t.xLabels : t.yLabels) || t.labels || [] }
        beforeLayout() { this._cache = {}, this._dataLimitsCached = !1 }
        beforeUpdate() { c(this.options.beforeUpdate, [this]) }
        update(t, e, i) {
            const { beginAtZero: s, grace: n, ticks: o } = this.options, a = o.sampleSize;
            this.beforeUpdate(), this.maxWidth = t, this.maxHeight = e, this._margins = i = Object.assign({ left: 0, right: 0, top: 0, bottom: 0 }, i), this.ticks = null, this._labelSizes = null, this._gridLineItems = null, this._labelItems = null, this.beforeSetDimensions(), this.setDimensions(), this.afterSetDimensions(), this._maxLength = this.isHorizontal() ? this.width + i.left + i.right : this.height + i.top + i.bottom, this._dataLimitsCached || (this.beforeDataLimits(), this.determineDataLimits(), this.afterDataLimits(), this._range = xi(this, n, s), this._dataLimitsCached = !0), this.beforeBuildTicks(), this.ticks = this.buildTicks() || [], this.afterBuildTicks();
            const r = a < this.ticks.length;
            this._convertTicksToLabels(r ? Bs(this.ticks, a) : this.ticks), this.configure(), this.beforeCalculateLabelRotation(), this.calculateLabelRotation(), this.afterCalculateLabelRotation(), o.display && (o.autoSkip || "auto" === o.source) && (this.ticks = zs(this, this.ticks), this._labelSizes = null, this.afterAutoSkip()), r && this._convertTicksToLabels(this.ticks), this.beforeFit(), this.fit(), this.afterFit(), this.afterUpdate()
        }
        configure() {
            let t, e, i = this.options.reverse;
            this.isHorizontal() ? (t = this.left, e = this.right) : (t = this.top, e = this.bottom, i = !i), this._startPixel = t, this._endPixel = e, this._reversePixels = i, this._length = e - t, this._alignToPixels = this.options.alignToPixels
        }
        afterUpdate() { c(this.options.afterUpdate, [this]) }
        beforeSetDimensions() { c(this.options.beforeSetDimensions, [this]) }
        setDimensions() { this.isHorizontal() ? (this.width = this.maxWidth, this.left = 0, this.right = this.width) : (this.height = this.maxHeight, this.top = 0, this.bottom = this.height), this.paddingLeft = 0, this.paddingTop = 0, this.paddingRight = 0, this.paddingBottom = 0 }
        afterSetDimensions() { c(this.options.afterSetDimensions, [this]) }
        _callHooks(t) { this.chart.notifyPlugins(t, this.getContext()), c(this.options[t], [this]) }
        beforeDataLimits() { this._callHooks("beforeDataLimits") }
        determineDataLimits() {}
        afterDataLimits() { this._callHooks("afterDataLimits") }
        beforeBuildTicks() { this._callHooks("beforeBuildTicks") }
        buildTicks() { return [] }
        afterBuildTicks() { this._callHooks("afterBuildTicks") }
        beforeTickToLabelConversion() { c(this.options.beforeTickToLabelConversion, [this]) }
        generateTickLabels(t) { const e = this.options.ticks; let i, s, n; for (i = 0, s = t.length; i < s; i++) n = t[i], n.label = c(e.callback, [n.value, i, t], this) }
        afterTickToLabelConversion() { c(this.options.afterTickToLabelConversion, [this]) }
        beforeCalculateLabelRotation() { c(this.options.beforeCalculateLabelRotation, [this]) }
        calculateLabelRotation() {
            const t = this.options,
                e = t.ticks,
                i = this.ticks.length,
                s = e.minRotation || 0,
                n = e.maxRotation;
            let o, a, r, l = s;
            if (!this._isVisible() || !e.display || s >= n || i <= 1 || !this.isHorizontal()) return void(this.labelRotation = s);
            const h = this._getLabelSizes(),
                c = h.widest.width,
                d = h.highest.height,
                u = Z(this.chart.width - c, 0, this.maxWidth);
            o = t.offset ? this.maxWidth / i : u / (i - 1), c + 6 > o && (o = u / (i - (t.offset ? .5 : 1)), a = this.maxHeight - Ws(t.grid) - e.padding - js(t.title, this.chart.options.font), r = Math.sqrt(c * c + d * d), l = $(Math.min(Math.asin(Z((h.highest.height + 6) / o, -1, 1)), Math.asin(Z(a / r, -1, 1)) - Math.asin(Z(d / r, -1, 1)))), l = Math.max(s, Math.min(n, l))), this.labelRotation = l
        }
        afterCalculateLabelRotation() { c(this.options.afterCalculateLabelRotation, [this]) }
        afterAutoSkip() {}
        beforeFit() { c(this.options.beforeFit, [this]) }
        fit() {
            const t = { width: 0, height: 0 },
                { chart: e, options: { ticks: i, title: s, grid: n } } = this,
                o = this._isVisible(),
                a = this.isHorizontal();
            if (o) {
                const o = js(s, e.options.font);
                if (a ? (t.width = this.maxWidth, t.height = Ws(n) + o) : (t.height = this.maxHeight, t.width = Ws(n) + o), i.display && this.ticks.length) {
                    const { first: e, last: s, widest: n, highest: o } = this._getLabelSizes(), r = 2 * i.padding, l = H(this.labelRotation), h = Math.cos(l), c = Math.sin(l);
                    if (a) {
                        const e = i.mirror ? 0 : c * n.width + h * o.height;
                        t.height = Math.min(this.maxHeight, t.height + e + r)
                    } else {
                        const e = i.mirror ? 0 : h * n.width + c * o.height;
                        t.width = Math.min(this.maxWidth, t.width + e + r)
                    }
                    this._calculatePadding(e, s, c, h)
                }
            }
            this._handleMargins(), a ? (this.width = this._length = e.width - this._margins.left - this._margins.right, this.height = t.height) : (this.width = t.width, this.height = this._length = e.height - this._margins.top - this._margins.bottom)
        }
        _calculatePadding(t, e, i, s) {
            const { ticks: { align: n, padding: o }, position: a } = this.options, r = 0 !== this.labelRotation, l = "top" !== a && "x" === this.axis;
            if (this.isHorizontal()) {
                const a = this.getPixelForTick(0) - this.left,
                    h = this.right - this.getPixelForTick(this.ticks.length - 1);
                let c = 0,
                    d = 0;
                r ? l ? (c = s * t.width, d = i * e.height) : (c = i * t.height, d = s * e.width) : "start" === n ? d = e.width : "end" === n ? c = t.width : "inner" !== n && (c = t.width / 2, d = e.width / 2), this.paddingLeft = Math.max((c - a + o) * this.width / (this.width - a), 0), this.paddingRight = Math.max((d - h + o) * this.width / (this.width - h), 0)
            } else {
                let i = e.height / 2,
                    s = t.height / 2;
                "start" === n ? (i = 0, s = t.height) : "end" === n && (i = e.height, s = 0), this.paddingTop = i + o, this.paddingBottom = s + o
            }
        }
        _handleMargins() { this._margins && (this._margins.left = Math.max(this.paddingLeft, this._margins.left), this._margins.top = Math.max(this.paddingTop, this._margins.top), this._margins.right = Math.max(this.paddingRight, this._margins.right), this._margins.bottom = Math.max(this.paddingBottom, this._margins.bottom)) }
        afterFit() { c(this.options.afterFit, [this]) }
        isHorizontal() { const { axis: t, position: e } = this.options; return "top" === e || "bottom" === e || "x" === t }
        isFullSize() { return this.options.fullSize }
        _convertTicksToLabels(t) {
            let e, s;
            for (this.beforeTickToLabelConversion(), this.generateTickLabels(t), e = 0, s = t.length; e < s; e++) i(t[e].label) && (t.splice(e, 1), s--, e--);
            this.afterTickToLabelConversion()
        }
        _getLabelSizes() {
            let t = this._labelSizes;
            if (!t) {
                const e = this.options.ticks.sampleSize;
                let i = this.ticks;
                e < i.length && (i = Bs(i, e)), this._labelSizes = t = this._computeLabelSizes(i, i.length)
            }
            return t
        }
        _computeLabelSizes(t, e) {
            const { ctx: n, _longestTextCache: o } = this, a = [], r = [];
            let l, h, c, u, f, g, p, m, b, x, _, y = 0,
                v = 0;
            for (l = 0; l < e; ++l) {
                if (u = t[l].label, f = this._resolveTickFontOptions(l), n.font = g = f.string, p = o[g] = o[g] || { data: {}, gc: [] }, m = f.lineHeight, b = x = 0, i(u) || s(u)) {
                    if (s(u))
                        for (h = 0, c = u.length; h < c; ++h) _ = u[h], i(_) || s(_) || (b = _e(n, p.data, p.gc, b, _), x += m)
                } else b = _e(n, p.data, p.gc, b, u), x = m;
                a.push(b), r.push(x), y = Math.max(b, y), v = Math.max(x, v)
            }! function(t, e) {
                d(t, (t => {
                    const i = t.gc,
                        s = i.length / 2;
                    let n;
                    if (s > e) {
                        for (n = 0; n < s; ++n) delete t.data[i[n]];
                        i.splice(0, s)
                    }
                }))
            }(o, e);
            const w = a.indexOf(y),
                M = r.indexOf(v),
                k = t => ({ width: a[t] || 0, height: r[t] || 0 });
            return { first: k(0), last: k(e - 1), widest: k(w), highest: k(M), widths: a, heights: r }
        }
        getLabelForValue(t) { return t }
        getPixelForValue(t, e) { return NaN }
        getValueForPixel(t) {}
        getPixelForTick(t) { const e = this.ticks; return t < 0 || t > e.length - 1 ? null : this.getPixelForValue(e[t].value) }
        getPixelForDecimal(t) { this._reversePixels && (t = 1 - t); const e = this._startPixel + t * this._length; return J(this._alignToPixels ? ve(this.chart, e, 0) : e) }
        getDecimalForPixel(t) { const e = (t - this._startPixel) / this._length; return this._reversePixels ? 1 - e : e }
        getBasePixel() { return this.getPixelForValue(this.getBaseValue()) }
        getBaseValue() { const { min: t, max: e } = this; return t < 0 && e < 0 ? e : t > 0 && e > 0 ? t : 0 }
        getContext(t) { const e = this.ticks || []; if (t >= 0 && t < e.length) { const i = e[t]; return i.$context || (i.$context = function(t, e, i) { return _i(t, { tick: i, index: e, type: "tick" }) }(this.getContext(), t, i)) } return this.$context || (this.$context = _i(this.chart.getContext(), { scale: this, type: "scale" })) }
        _tickSize() {
            const t = this.options.ticks,
                e = H(this.labelRotation),
                i = Math.abs(Math.cos(e)),
                s = Math.abs(Math.sin(e)),
                n = this._getLabelSizes(),
                o = t.autoSkipPadding || 0,
                a = n ? n.widest.width + o : 0,
                r = n ? n.highest.height + o : 0;
            return this.isHorizontal() ? r * i > a * s ? a / i : r / s : r * s < a * i ? r / i : a / s
        }
        _isVisible() { const t = this.options.display; return "auto" !== t ? !!t : this.getMatchingVisibleMetas().length > 0 }
        _computeGridLineItems(t) {
            const e = this.axis,
                i = this.chart,
                s = this.options,
                { grid: o, position: a } = s,
                l = o.offset,
                h = this.isHorizontal(),
                c = this.ticks.length + (l ? 1 : 0),
                d = Ws(o),
                u = [],
                f = o.setContext(this.getContext()),
                g = f.drawBorder ? f.borderWidth : 0,
                p = g / 2,
                m = function(t) { return ve(i, t, g) };
            let b, x, _, y, v, w, M, k, S, P, D, O;
            if ("top" === a) b = m(this.bottom), w = this.bottom - d, k = b - p, P = m(t.top) + p, O = t.bottom;
            else if ("bottom" === a) b = m(this.top), P = t.top, O = m(t.bottom) - p, w = b + p, k = this.top + d;
            else if ("left" === a) b = m(this.right), v = this.right - d, M = b - p, S = m(t.left) + p, D = t.right;
            else if ("right" === a) b = m(this.left), S = t.left, D = m(t.right) - p, v = b + p, M = this.left + d;
            else if ("x" === e) {
                if ("center" === a) b = m((t.top + t.bottom) / 2 + .5);
                else if (n(a)) {
                    const t = Object.keys(a)[0],
                        e = a[t];
                    b = m(this.chart.scales[t].getPixelForValue(e))
                }
                P = t.top, O = t.bottom, w = b + p, k = w + d
            } else if ("y" === e) {
                if ("center" === a) b = m((t.left + t.right) / 2);
                else if (n(a)) {
                    const t = Object.keys(a)[0],
                        e = a[t];
                    b = m(this.chart.scales[t].getPixelForValue(e))
                }
                v = b - p, M = v - d, S = t.left, D = t.right
            }
            const C = r(s.ticks.maxTicksLimit, c),
                A = Math.max(1, Math.ceil(c / C));
            for (x = 0; x < c; x += A) {
                const t = o.setContext(this.getContext(x)),
                    e = t.lineWidth,
                    s = t.color,
                    n = t.borderDash || [],
                    a = t.borderDashOffset,
                    r = t.tickWidth,
                    c = t.tickColor,
                    d = t.tickBorderDash || [],
                    f = t.tickBorderDashOffset;
                _ = Ns(this, x, l), void 0 !== _ && (y = ve(i, _, e), h ? v = M = S = D = y : w = k = P = O = y, u.push({ tx1: v, ty1: w, tx2: M, ty2: k, x1: S, y1: P, x2: D, y2: O, width: e, color: s, borderDash: n, borderDashOffset: a, tickWidth: r, tickColor: c, tickBorderDash: d, tickBorderDashOffset: f }))
            }
            return this._ticksLength = c, this._borderValue = b, u
        }
        _computeLabelItems(t) {
            const e = this.axis,
                i = this.options,
                { position: o, ticks: a } = i,
                r = this.isHorizontal(),
                l = this.ticks,
                { align: h, crossAlign: c, padding: d, mirror: u } = a,
                f = Ws(i.grid),
                g = f + d,
                p = u ? -d : g,
                m = -H(this.labelRotation),
                b = [];
            let x, _, y, v, w, M, k, S, P, D, O, C, A = "middle";
            if ("top" === o) M = this.bottom - p, k = this._getXAxisLabelAlignment();
            else if ("bottom" === o) M = this.top + p, k = this._getXAxisLabelAlignment();
            else if ("left" === o) {
                const t = this._getYAxisLabelAlignment(f);
                k = t.textAlign, w = t.x
            } else if ("right" === o) {
                const t = this._getYAxisLabelAlignment(f);
                k = t.textAlign, w = t.x
            } else if ("x" === e) {
                if ("center" === o) M = (t.top + t.bottom) / 2 + g;
                else if (n(o)) {
                    const t = Object.keys(o)[0],
                        e = o[t];
                    M = this.chart.scales[t].getPixelForValue(e) + g
                }
                k = this._getXAxisLabelAlignment()
            } else if ("y" === e) {
                if ("center" === o) w = (t.left + t.right) / 2 - g;
                else if (n(o)) {
                    const t = Object.keys(o)[0],
                        e = o[t];
                    w = this.chart.scales[t].getPixelForValue(e)
                }
                k = this._getYAxisLabelAlignment(f).textAlign
            }
            "y" === e && ("start" === h ? A = "top" : "end" === h && (A = "bottom"));
            const T = this._getLabelSizes();
            for (x = 0, _ = l.length; x < _; ++x) {
                y = l[x], v = y.label;
                const t = a.setContext(this.getContext(x));
                S = this.getPixelForTick(x) + a.labelOffset, P = this._resolveTickFontOptions(x), D = P.lineHeight, O = s(v) ? v.length : 1;
                const e = O / 2,
                    i = t.color,
                    n = t.textStrokeColor,
                    h = t.textStrokeWidth;
                let d, f = k;
                if (r ? (w = S, "inner" === k && (f = x === _ - 1 ? this.options.reverse ? "left" : "right" : 0 === x ? this.options.reverse ? "right" : "left" : "center"), C = "top" === o ? "near" === c || 0 !== m ? -O * D + D / 2 : "center" === c ? -T.highest.height / 2 - e * D + D : -T.highest.height + D / 2 : "near" === c || 0 !== m ? D / 2 : "center" === c ? T.highest.height / 2 - e * D : T.highest.height - O * D, u && (C *= -1)) : (M = S, C = (1 - O) * D / 2), t.showLabelBackdrop) {
                    const e = pi(t.backdropPadding),
                        i = T.heights[x],
                        s = T.widths[x];
                    let n = M + C - e.top,
                        o = w - e.left;
                    switch (A) {
                        case "middle":
                            n -= i / 2;
                            break;
                        case "bottom":
                            n -= i
                    }
                    switch (k) {
                        case "center":
                            o -= s / 2;
                            break;
                        case "right":
                            o -= s
                    }
                    d = { left: o, top: n, width: s + e.width, height: i + e.height, color: t.backdropColor }
                }
                b.push({ rotation: m, label: v, font: P, color: i, strokeColor: n, strokeWidth: h, textOffset: C, textAlign: f, textBaseline: A, translation: [w, M], backdrop: d })
            }
            return b
        }
        _getXAxisLabelAlignment() { const { position: t, ticks: e } = this.options; if (-H(this.labelRotation)) return "top" === t ? "left" : "right"; let i = "center"; return "start" === e.align ? i = "left" : "end" === e.align ? i = "right" : "inner" === e.align && (i = "inner"), i }
        _getYAxisLabelAlignment(t) { const { position: e, ticks: { crossAlign: i, mirror: s, padding: n } } = this.options, o = t + n, a = this._getLabelSizes().widest.width; let r, l; return "left" === e ? s ? (l = this.right + n, "near" === i ? r = "left" : "center" === i ? (r = "center", l += a / 2) : (r = "right", l += a)) : (l = this.right - o, "near" === i ? r = "right" : "center" === i ? (r = "center", l -= a / 2) : (r = "left", l = this.left)) : "right" === e ? s ? (l = this.left + n, "near" === i ? r = "right" : "center" === i ? (r = "center", l -= a / 2) : (r = "left", l -= a)) : (l = this.left + o, "near" === i ? r = "left" : "center" === i ? (r = "center", l += a / 2) : (r = "right", l = this.right)) : r = "right", { textAlign: r, x: l } }
        _computeLabelArea() {
            if (this.options.ticks.mirror) return;
            const t = this.chart,
                e = this.options.position;
            return "left" === e || "right" === e ? { top: 0, left: this.left, bottom: t.height, right: this.right } : "top" === e || "bottom" === e ? { top: this.top, left: 0, bottom: this.bottom, right: t.width } : void 0
        }
        drawBackground() {
            const { ctx: t, options: { backgroundColor: e }, left: i, top: s, width: n, height: o } = this;
            e && (t.save(), t.fillStyle = e, t.fillRect(i, s, n, o), t.restore())
        }
        getLineWidthForValue(t) { const e = this.options.grid; if (!this._isVisible() || !e.display) return 0; const i = this.ticks.findIndex((e => e.value === t)); if (i >= 0) { return e.setContext(this.getContext(i)).lineWidth } return 0 }
        drawGrid(t) {
            const e = this.options.grid,
                i = this.ctx,
                s = this._gridLineItems || (this._gridLineItems = this._computeGridLineItems(t));
            let n, o;
            const a = (t, e, s) => { s.width && s.color && (i.save(), i.lineWidth = s.width, i.strokeStyle = s.color, i.setLineDash(s.borderDash || []), i.lineDashOffset = s.borderDashOffset, i.beginPath(), i.moveTo(t.x, t.y), i.lineTo(e.x, e.y), i.stroke(), i.restore()) };
            if (e.display)
                for (n = 0, o = s.length; n < o; ++n) {
                    const t = s[n];
                    e.drawOnChartArea && a({ x: t.x1, y: t.y1 }, { x: t.x2, y: t.y2 }, t), e.drawTicks && a({ x: t.tx1, y: t.ty1 }, { x: t.tx2, y: t.ty2 }, { color: t.tickColor, width: t.tickWidth, borderDash: t.tickBorderDash, borderDashOffset: t.tickBorderDashOffset })
                }
        }
        drawBorder() {
            const { chart: t, ctx: e, options: { grid: i } } = this, s = i.setContext(this.getContext()), n = i.drawBorder ? s.borderWidth : 0;
            if (!n) return;
            const o = i.setContext(this.getContext(0)).lineWidth,
                a = this._borderValue;
            let r, l, h, c;
            this.isHorizontal() ? (r = ve(t, this.left, n) - n / 2, l = ve(t, this.right, o) + o / 2, h = c = a) : (h = ve(t, this.top, n) - n / 2, c = ve(t, this.bottom, o) + o / 2, r = l = a), e.save(), e.lineWidth = s.borderWidth, e.strokeStyle = s.borderColor, e.beginPath(), e.moveTo(r, h), e.lineTo(l, c), e.stroke(), e.restore()
        }
        drawLabels(t) {
            if (!this.options.ticks.display) return;
            const e = this.ctx,
                i = this._computeLabelArea();
            i && Pe(e, i);
            const s = this._labelItems || (this._labelItems = this._computeLabelItems(t));
            let n, o;
            for (n = 0, o = s.length; n < o; ++n) {
                const t = s[n],
                    i = t.font,
                    o = t.label;
                t.backdrop && (e.fillStyle = t.backdrop.color, e.fillRect(t.backdrop.left, t.backdrop.top, t.backdrop.width, t.backdrop.height)), Ae(e, o, 0, t.textOffset, i, t)
            }
            i && De(e)
        }
        drawTitle() {
            const { ctx: t, options: { position: e, title: i, reverse: o } } = this;
            if (!i.display) return;
            const a = mi(i.font),
                r = pi(i.padding),
                l = i.align;
            let h = a.lineHeight / 2;
            "bottom" === e || "center" === e || n(e) ? (h += r.bottom, s(i.text) && (h += a.lineHeight * (i.text.length - 1))) : h += r.top;
            const { titleX: c, titleY: d, maxWidth: u, rotation: f } = function(t, e, i, s) {
                const { top: o, left: a, bottom: r, right: l, chart: h } = t, { chartArea: c, scales: d } = h;
                let u, f, g, p = 0;
                const m = r - o,
                    b = l - a;
                if (t.isHorizontal()) {
                    if (f = ut(s, a, l), n(i)) {
                        const t = Object.keys(i)[0],
                            s = i[t];
                        g = d[t].getPixelForValue(s) + m - e
                    } else g = "center" === i ? (c.bottom + c.top) / 2 + m - e : Vs(t, i, e);
                    u = l - a
                } else {
                    if (n(i)) {
                        const t = Object.keys(i)[0],
                            s = i[t];
                        f = d[t].getPixelForValue(s) - b + e
                    } else f = "center" === i ? (c.left + c.right) / 2 - b + e : Vs(t, i, e);
                    g = ut(s, r, o), p = "left" === i ? -L : L
                }
                return { titleX: f, titleY: g, maxWidth: u, rotation: p }
            }(this, h, e, l);
            Ae(t, i.text, 0, 0, a, { color: i.color, maxWidth: u, rotation: f, textAlign: Hs(l, e, o), textBaseline: "middle", translation: [c, d] })
        }
        draw(t) { this._isVisible() && (this.drawBackground(), this.drawGrid(t), this.drawBorder(), this.drawTitle(), this.drawLabels(t)) }
        _layers() {
            const t = this.options,
                e = t.ticks && t.ticks.z || 0,
                i = r(t.grid && t.grid.z, -1);
            return this._isVisible() && this.draw === $s.prototype.draw ? [{ z: i, draw: t => { this.drawBackground(), this.drawGrid(t), this.drawTitle() } }, { z: i + 1, draw: () => { this.drawBorder() } }, { z: e, draw: t => { this.drawLabels(t) } }] : [{ z: e, draw: t => { this.draw(t) } }]
        }
        getMatchingVisibleMetas(t) {
            const e = this.chart.getSortedVisibleDatasetMetas(),
                i = this.axis + "AxisID",
                s = [];
            let n, o;
            for (n = 0, o = e.length; n < o; ++n) {
                const o = e[n];
                o[i] !== this.id || t && o.type !== t || s.push(o)
            }
            return s
        }
        _resolveTickFontOptions(t) { return mi(this.options.ticks.setContext(this.getContext(t)).font) }
        _maxDigits() { const t = this._resolveTickFontOptions(0).lineHeight; return (this.isHorizontal() ? this.width : this.height) / t }
    }
    class Ys {
        constructor(t, e, i) { this.type = t, this.scope = e, this.override = i, this.items = Object.create(null) }
        isForType(t) { return Object.prototype.isPrototypeOf.call(this.type.prototype, t.prototype) }
        register(t) {
            const e = Object.getPrototypeOf(t);
            let i;
            (function(t) { return "id" in t && "defaults" in t })(e) && (i = this.register(e));
            const s = this.items,
                n = t.id,
                o = this.scope + "." + n;
            if (!n) throw new Error("class does not have id: " + t);
            return n in s || (s[n] = t, function(t, e, i) {
                const s = m(Object.create(null), [i ? ne.get(i) : {}, ne.get(e), t.defaults]);
                ne.set(e, s), t.defaultRoutes && function(t, e) {
                    Object.keys(e).forEach((i => {
                        const s = i.split("."),
                            n = s.pop(),
                            o = [t].concat(s).join("."),
                            a = e[i].split("."),
                            r = a.pop(),
                            l = a.join(".");
                        ne.route(o, n, l, r)
                    }))
                }(e, t.defaultRoutes);
                t.descriptors && ne.describe(e, t.descriptors)
            }(t, o, i), this.override && ne.override(t.id, t.overrides)), o
        }
        get(t) { return this.items[t] }
        unregister(t) {
            const e = this.items,
                i = t.id,
                s = this.scope;
            i in e && delete e[i], s && i in ne[s] && (delete ne[s][i], this.override && delete te[i])
        }
    }
    var Us = new class {
        constructor() { this.controllers = new Ys(Ls, "datasets", !0), this.elements = new Ys(Es, "elements"), this.plugins = new Ys(Object, "plugins"), this.scales = new Ys($s, "scales"), this._typedRegistries = [this.controllers, this.scales, this.elements] }
        add(...t) { this._each("register", t) }
        remove(...t) { this._each("unregister", t) }
        addControllers(...t) { this._each("register", t, this.controllers) }
        addElements(...t) { this._each("register", t, this.elements) }
        addPlugins(...t) { this._each("register", t, this.plugins) }
        addScales(...t) { this._each("register", t, this.scales) }
        getController(t) { return this._get(t, this.controllers, "controller") }
        getElement(t) { return this._get(t, this.elements, "element") }
        getPlugin(t) { return this._get(t, this.plugins, "plugin") }
        getScale(t) { return this._get(t, this.scales, "scale") }
        removeControllers(...t) { this._each("unregister", t, this.controllers) }
        removeElements(...t) { this._each("unregister", t, this.elements) }
        removePlugins(...t) { this._each("unregister", t, this.plugins) }
        removeScales(...t) { this._each("unregister", t, this.scales) }
        _each(t, e, i) {
            [...e].forEach((e => {
                const s = i || this._getRegistryForType(e);
                i || s.isForType(e) || s === this.plugins && e.id ? this._exec(t, s, e) : d(e, (e => {
                    const s = i || this._getRegistryForType(e);
                    this._exec(t, s, e)
                }))
            }))
        }
        _exec(t, e, i) {
            const s = w(t);
            c(i["before" + s], [], i), e[t](i), c(i["after" + s], [], i)
        }
        _getRegistryForType(t) { for (let e = 0; e < this._typedRegistries.length; e++) { const i = this._typedRegistries[e]; if (i.isForType(t)) return i } return this.plugins }
        _get(t, e, i) { const s = e.get(t); if (void 0 === s) throw new Error('"' + t + '" is not a registered ' + i + "."); return s }
    };
    class Xs {
        constructor() { this._init = [] }
        notify(t, e, i, s) {
            "beforeInit" === e && (this._init = this._createDescriptors(t, !0), this._notify(this._init, t, "install"));
            const n = s ? this._descriptors(t).filter(s) : this._descriptors(t),
                o = this._notify(n, t, e, i);
            return "afterDestroy" === e && (this._notify(n, t, "stop"), this._notify(this._init, t, "uninstall")), o
        }
        _notify(t, e, i, s) { s = s || {}; for (const n of t) { const t = n.plugin; if (!1 === c(t[i], [e, s, n.options], t) && s.cancelable) return !1 } return !0 }
        invalidate() { i(this._cache) || (this._oldCache = this._cache, this._cache = void 0) }
        _descriptors(t) { if (this._cache) return this._cache; const e = this._cache = this._createDescriptors(t); return this._notifyStateChanges(t), e }
        _createDescriptors(t, e) {
            const i = t && t.config,
                s = r(i.options && i.options.plugins, {}),
                n = function(t) {
                    const e = {},
                        i = [],
                        s = Object.keys(Us.plugins.items);
                    for (let t = 0; t < s.length; t++) i.push(Us.getPlugin(s[t]));
                    const n = t.plugins || [];
                    for (let t = 0; t < n.length; t++) { const s = n[t]; - 1 === i.indexOf(s) && (i.push(s), e[s.id] = !0) }
                    return { plugins: i, localIds: e }
                }(i);
            return !1 !== s || e ? function(t, { plugins: e, localIds: i }, s, n) {
                const o = [],
                    a = t.getContext();
                for (const r of e) {
                    const e = r.id,
                        l = qs(s[e], n);
                    null !== l && o.push({ plugin: r, options: Ks(t.config, { plugin: r, local: i[e] }, l, a) })
                }
                return o
            }(t, n, s, e) : []
        }
        _notifyStateChanges(t) {
            const e = this._oldCache || [],
                i = this._cache,
                s = (t, e) => t.filter((t => !e.some((e => t.plugin.id === e.plugin.id))));
            this._notify(s(e, i), t, "stop"), this._notify(s(i, e), t, "start")
        }
    }

    function qs(t, e) { return e || !1 !== t ? !0 === t ? {} : t : null }

    function Ks(t, { plugin: e, local: i }, s, n) {
        const o = t.pluginScopeKeys(e),
            a = t.getOptionScopes(s, o);
        return i && e.defaults && a.push(e.defaults), t.createResolver(a, n, [""], { scriptable: !1, indexable: !1, allKeys: !0 })
    }

    function Gs(t, e) { const i = ne.datasets[t] || {}; return ((e.datasets || {})[t] || {}).indexAxis || e.indexAxis || i.indexAxis || "x" }

    function Zs(t, e) { return "x" === t || "y" === t ? t : e.axis || ("top" === (i = e.position) || "bottom" === i ? "x" : "left" === i || "right" === i ? "y" : void 0) || t.charAt(0).toLowerCase(); var i }

    function Js(t) {
        const e = t.options || (t.options = {});
        e.plugins = r(e.plugins, {}), e.scales = function(t, e) {
            const i = te[t.type] || { scales: {} },
                s = e.scales || {},
                o = Gs(t.type, e),
                a = Object.create(null),
                r = Object.create(null);
            return Object.keys(s).forEach((t => {
                const e = s[t];
                if (!n(e)) return console.error(`Invalid scale configuration for scale: ${t}`);
                if (e._proxy) return console.warn(`Ignoring resolver passed as options for scale: ${t}`);
                const l = Zs(t, e),
                    h = function(t, e) { return t === e ? "_index_" : "_value_" }(l, o),
                    c = i.scales || {};
                a[l] = a[l] || t, r[t] = b(Object.create(null), [{ axis: l }, e, c[l], c[h]])
            })), t.data.datasets.forEach((i => {
                const n = i.type || t.type,
                    o = i.indexAxis || Gs(n, e),
                    l = (te[n] || {}).scales || {};
                Object.keys(l).forEach((t => {
                    const e = function(t, e) { let i = t; return "_index_" === t ? i = e : "_value_" === t && (i = "x" === e ? "y" : "x"), i }(t, o),
                        n = i[e + "AxisID"] || a[e] || e;
                    r[n] = r[n] || Object.create(null), b(r[n], [{ axis: e }, s[n], l[t]])
                }))
            })), Object.keys(r).forEach((t => {
                const e = r[t];
                b(e, [ne.scales[e.type], ne.scale])
            })), r
        }(t, e)
    }

    function Qs(t) { return (t = t || {}).datasets = t.datasets || [], t.labels = t.labels || [], t }
    const tn = new Map,
        en = new Set;

    function sn(t, e) { let i = tn.get(t); return i || (i = e(), tn.set(t, i), en.add(i)), i }
    const nn = (t, e, i) => {
        const s = y(e, i);
        void 0 !== s && t.add(s)
    };
    class on {
        constructor(t) { this._config = function(t) { return (t = t || {}).data = Qs(t.data), Js(t), t }(t), this._scopeCache = new Map, this._resolverCache = new Map }
        get platform() { return this._config.platform }
        get type() { return this._config.type }
        set type(t) { this._config.type = t }
        get data() { return this._config.data }
        set data(t) { this._config.data = Qs(t) }
        get options() { return this._config.options }
        set options(t) { this._config.options = t }
        get plugins() { return this._config.plugins }
        update() {
            const t = this._config;
            this.clearCache(), Js(t)
        }
        clearCache() { this._scopeCache.clear(), this._resolverCache.clear() }
        datasetScopeKeys(t) {
            return sn(t, (() => [
                [`datasets.${t}`, ""]
            ]))
        }
        datasetAnimationScopeKeys(t, e) {
            return sn(`${t}.transition.${e}`, (() => [
                [`datasets.${t}.transitions.${e}`, `transitions.${e}`],
                [`datasets.${t}`, ""]
            ]))
        }
        datasetElementScopeKeys(t, e) {
            return sn(`${t}-${e}`, (() => [
                [`datasets.${t}.elements.${e}`, `datasets.${t}`, `elements.${e}`, ""]
            ]))
        }
        pluginScopeKeys(t) {
            const e = t.id;
            return sn(`${this.type}-plugin-${e}`, (() => [
                [`plugins.${e}`, ...t.additionalOptionScopes || []]
            ]))
        }
        _cachedScopes(t, e) { const i = this._scopeCache; let s = i.get(t); return s && !e || (s = new Map, i.set(t, s)), s }
        getOptionScopes(t, e, i) {
            const { options: s, type: n } = this, o = this._cachedScopes(t, i), a = o.get(e);
            if (a) return a;
            const r = new Set;
            e.forEach((e => { t && (r.add(t), e.forEach((e => nn(r, t, e)))), e.forEach((t => nn(r, s, t))), e.forEach((t => nn(r, te[n] || {}, t))), e.forEach((t => nn(r, ne, t))), e.forEach((t => nn(r, ee, t))) }));
            const l = Array.from(r);
            return 0 === l.length && l.push(Object.create(null)), en.has(e) && o.set(e, l), l
        }
        chartOptionScopes() { const { options: t, type: e } = this; return [t, te[e] || {}, ne.datasets[e] || {}, { type: e }, ne, ee] }
        resolveNamedOptions(t, e, i, n = [""]) {
            const o = { $shared: !0 },
                { resolver: a, subPrefixes: r } = an(this._resolverCache, t, n);
            let l = a;
            if (function(t, e) {
                    const { isScriptable: i, isIndexable: n } = Ie(t);
                    for (const o of e) {
                        const e = i(o),
                            a = n(o),
                            r = (a || e) && t[o];
                        if (e && (k(r) || rn(r)) || a && s(r)) return !0
                    }
                    return !1
                }(a, e)) {
                o.$shared = !1;
                l = Re(a, i = k(i) ? i() : i, this.createResolver(t, i, r))
            }
            for (const t of e) o[t] = l[t];
            return o
        }
        createResolver(t, e, i = [""], s) { const { resolver: o } = an(this._resolverCache, t, i); return n(e) ? Re(o, e, void 0, s) : o }
    }

    function an(t, e, i) {
        let s = t.get(e);
        s || (s = new Map, t.set(e, s));
        const n = i.join();
        let o = s.get(n);
        if (!o) { o = { resolver: Ee(e, i), subPrefixes: i.filter((t => !t.toLowerCase().includes("hover"))) }, s.set(n, o) }
        return o
    }
    const rn = t => n(t) && Object.getOwnPropertyNames(t).reduce(((e, i) => e || k(t[i])), !1);
    const ln = ["top", "bottom", "left", "right", "chartArea"];

    function hn(t, e) { return "top" === t || "bottom" === t || -1 === ln.indexOf(t) && "x" === e }

    function cn(t, e) { return function(i, s) { return i[t] === s[t] ? i[e] - s[e] : i[t] - s[t] } }

    function dn(t) {
        const e = t.chart,
            i = e.options.animation;
        e.notifyPlugins("afterRender"), c(i && i.onComplete, [t], e)
    }

    function un(t) {
        const e = t.chart,
            i = e.options.animation;
        c(i && i.onProgress, [t], e)
    }

    function fn(t) { return oe() && "string" == typeof t ? t = document.getElementById(t) : t && t.length && (t = t[0]), t && t.canvas && (t = t.canvas), t }
    const gn = {},
        pn = t => { const e = fn(t); return Object.values(gn).filter((t => t.canvas === e)).pop() };

    function mn(t, e, i) {
        const s = Object.keys(t);
        for (const n of s) {
            const s = +n;
            if (s >= e) {
                const o = t[n];
                delete t[n], (i > 0 || s > e) && (t[s + i] = o)
            }
        }
    }
    class bn {
        constructor(t, i) {
            const s = this.config = new on(i),
                n = fn(t),
                o = pn(n);
            if (o) throw new Error("Canvas is already in use. Chart with ID '" + o.id + "' must be destroyed before the canvas with ID '" + o.canvas.id + "' can be reused.");
            const a = s.createResolver(s.chartOptionScopes(), this.getContext());
            this.platform = new(s.platform || gs(n)), this.platform.updateConfig(s);
            const r = this.platform.acquireContext(n, a.aspectRatio),
                l = r && r.canvas,
                h = l && l.height,
                c = l && l.width;
            this.id = e(), this.ctx = r, this.canvas = l, this.width = c, this.height = h, this._options = a, this._aspectRatio = this.aspectRatio, this._layers = [], this._metasets = [], this._stacks = void 0, this.boxes = [], this.currentDevicePixelRatio = void 0, this.chartArea = void 0, this._active = [], this._lastEvent = void 0, this._listeners = {}, this._responsiveListeners = void 0, this._sortedMetasets = [], this.scales = {}, this._plugins = new Xs, this.$proxies = {}, this._hiddenIndices = {}, this.attached = !1, this._animationsDisabled = void 0, this.$context = void 0, this._doResize = ct((t => this.update(t)), a.resizeDelay || 0), this._dataChanges = [], gn[this.id] = this, r && l ? (mt.listen(this, "complete", dn), mt.listen(this, "progress", un), this._initialize(), this.attached && this.update()) : console.error("Failed to create chart: can't acquire context from the given item")
        }
        get aspectRatio() { const { options: { aspectRatio: t, maintainAspectRatio: e }, width: s, height: n, _aspectRatio: o } = this; return i(t) ? e && o ? o : n ? s / n : null : t }
        get data() { return this.config.data }
        set data(t) { this.config.data = t }
        get options() { return this._options }
        set options(t) { this.config.options = t }
        _initialize() { return this.notifyPlugins("beforeInit"), this.options.responsive ? this.resize() : pe(this, this.options.devicePixelRatio), this.bindEvents(), this.notifyPlugins("afterInit"), this }
        clear() { return we(this.canvas, this.ctx), this }
        stop() { return mt.stop(this), this }
        resize(t, e) { mt.running(this) ? this._resizeBeforeDraw = { width: t, height: e } : this._resize(t, e) }
        _resize(t, e) {
            const i = this.options,
                s = this.canvas,
                n = i.maintainAspectRatio && this.aspectRatio,
                o = this.platform.getMaximumSize(s, t, e, n),
                a = i.devicePixelRatio || this.platform.getDevicePixelRatio(),
                r = this.width ? "resize" : "attach";
            this.width = o.width, this.height = o.height, this._aspectRatio = this.aspectRatio, pe(this, a, !0) && (this.notifyPlugins("resize", { size: o }), c(i.onResize, [this, o], this), this.attached && this._doResize(r) && this.render())
        }
        ensureScalesHaveIDs() { d(this.options.scales || {}, ((t, e) => { t.id = e })) }
        buildOrUpdateScales() {
            const t = this.options,
                e = t.scales,
                i = this.scales,
                s = Object.keys(i).reduce(((t, e) => (t[e] = !1, t)), {});
            let n = [];
            e && (n = n.concat(Object.keys(e).map((t => {
                const i = e[t],
                    s = Zs(t, i),
                    n = "r" === s,
                    o = "x" === s;
                return { options: i, dposition: n ? "chartArea" : o ? "bottom" : "left", dtype: n ? "radialLinear" : o ? "category" : "linear" }
            })))), d(n, (e => {
                const n = e.options,
                    o = n.id,
                    a = Zs(o, n),
                    l = r(n.type, e.dtype);
                void 0 !== n.position && hn(n.position, a) === hn(e.dposition) || (n.position = e.dposition), s[o] = !0;
                let h = null;
                if (o in i && i[o].type === l) h = i[o];
                else { h = new(Us.getScale(l))({ id: o, type: l, ctx: this.ctx, chart: this }), i[h.id] = h }
                h.init(n, t)
            })), d(s, ((t, e) => { t || delete i[e] })), d(i, (t => { Zi.configure(this, t, t.options), Zi.addBox(this, t) }))
        }
        _updateMetasets() {
            const t = this._metasets,
                e = this.data.datasets.length,
                i = t.length;
            if (t.sort(((t, e) => t.index - e.index)), i > e) {
                for (let t = e; t < i; ++t) this._destroyDatasetMeta(t);
                t.splice(e, i - e)
            }
            this._sortedMetasets = t.slice(0).sort(cn("order", "index"))
        }
        _removeUnreferencedMetasets() {
            const { _metasets: t, data: { datasets: e } } = this;
            t.length > e.length && delete this._stacks, t.forEach(((t, i) => { 0 === e.filter((e => e === t._dataset)).length && this._destroyDatasetMeta(i) }))
        }
        buildOrUpdateControllers() {
            const t = [],
                e = this.data.datasets;
            let i, s;
            for (this._removeUnreferencedMetasets(), i = 0, s = e.length; i < s; i++) {
                const s = e[i];
                let n = this.getDatasetMeta(i);
                const o = s.type || this.config.type;
                if (n.type && n.type !== o && (this._destroyDatasetMeta(i), n = this.getDatasetMeta(i)), n.type = o, n.indexAxis = s.indexAxis || Gs(o, this.options), n.order = s.order || 0, n.index = i, n.label = "" + s.label, n.visible = this.isDatasetVisible(i), n.controller) n.controller.updateIndex(i), n.controller.linkScales();
                else {
                    const e = Us.getController(o),
                        { datasetElementType: s, dataElementType: a } = ne.datasets[o];
                    Object.assign(e.prototype, { dataElementType: Us.getElement(a), datasetElementType: s && Us.getElement(s) }), n.controller = new e(this, i), t.push(n.controller)
                }
            }
            return this._updateMetasets(), t
        }
        _resetElements() { d(this.data.datasets, ((t, e) => { this.getDatasetMeta(e).controller.reset() }), this) }
        reset() { this._resetElements(), this.notifyPlugins("reset") }
        update(t) {
            const e = this.config;
            e.update();
            const i = this._options = e.createResolver(e.chartOptionScopes(), this.getContext()),
                s = this._animationsDisabled = !i.animation;
            if (this._updateScales(), this._checkEventBindings(), this._updateHiddenIndices(), this._plugins.invalidate(), !1 === this.notifyPlugins("beforeUpdate", { mode: t, cancelable: !0 })) return;
            const n = this.buildOrUpdateControllers();
            this.notifyPlugins("beforeElementsUpdate");
            let o = 0;
            for (let t = 0, e = this.data.datasets.length; t < e; t++) {
                const { controller: e } = this.getDatasetMeta(t), i = !s && -1 === n.indexOf(e);
                e.buildOrUpdateElements(i), o = Math.max(+e.getMaxOverflow(), o)
            }
            o = this._minPadding = i.layout.autoPadding ? o : 0, this._updateLayout(o), s || d(n, (t => { t.reset() })), this._updateDatasets(t), this.notifyPlugins("afterUpdate", { mode: t }), this._layers.sort(cn("z", "_idx"));
            const { _active: a, _lastEvent: r } = this;
            r ? this._eventHandler(r, !0) : a.length && this._updateHoverStyles(a, a, !0), this.render()
        }
        _updateScales() { d(this.scales, (t => { Zi.removeBox(this, t) })), this.ensureScalesHaveIDs(), this.buildOrUpdateScales() }
        _checkEventBindings() {
            const t = this.options,
                e = new Set(Object.keys(this._listeners)),
                i = new Set(t.events);
            S(e, i) && !!this._responsiveListeners === t.responsive || (this.unbindEvents(), this.bindEvents())
        }
        _updateHiddenIndices() {
            const { _hiddenIndices: t } = this, e = this._getUniformDataChanges() || [];
            for (const { method: i, start: s, count: n }
                of e) { mn(t, s, "_removeElements" === i ? -n : n) }
        }
        _getUniformDataChanges() {
            const t = this._dataChanges;
            if (!t || !t.length) return;
            this._dataChanges = [];
            const e = this.data.datasets.length,
                i = e => new Set(t.filter((t => t[0] === e)).map(((t, e) => e + "," + t.splice(1).join(",")))),
                s = i(0);
            for (let t = 1; t < e; t++)
                if (!S(s, i(t))) return;
            return Array.from(s).map((t => t.split(","))).map((t => ({ method: t[1], start: +t[2], count: +t[3] })))
        }
        _updateLayout(t) {
            if (!1 === this.notifyPlugins("beforeLayout", { cancelable: !0 })) return;
            Zi.update(this, this.width, this.height, t);
            const e = this.chartArea,
                i = e.width <= 0 || e.height <= 0;
            this._layers = [], d(this.boxes, (t => { i && "chartArea" === t.position || (t.configure && t.configure(), this._layers.push(...t._layers())) }), this), this._layers.forEach(((t, e) => { t._idx = e })), this.notifyPlugins("afterLayout")
        }
        _updateDatasets(t) {
            if (!1 !== this.notifyPlugins("beforeDatasetsUpdate", { mode: t, cancelable: !0 })) {
                for (let t = 0, e = this.data.datasets.length; t < e; ++t) this.getDatasetMeta(t).controller.configure();
                for (let e = 0, i = this.data.datasets.length; e < i; ++e) this._updateDataset(e, k(t) ? t({ datasetIndex: e }) : t);
                this.notifyPlugins("afterDatasetsUpdate", { mode: t })
            }
        }
        _updateDataset(t, e) {
            const i = this.getDatasetMeta(t),
                s = { meta: i, index: t, mode: e, cancelable: !0 };
            !1 !== this.notifyPlugins("beforeDatasetUpdate", s) && (i.controller._update(e), s.cancelable = !1, this.notifyPlugins("afterDatasetUpdate", s))
        }
        render() {!1 !== this.notifyPlugins("beforeRender", { cancelable: !0 }) && (mt.has(this) ? this.attached && !mt.running(this) && mt.start(this) : (this.draw(), dn({ chart: this }))) }
        draw() {
            let t;
            if (this._resizeBeforeDraw) {
                const { width: t, height: e } = this._resizeBeforeDraw;
                this._resize(t, e), this._resizeBeforeDraw = null
            }
            if (this.clear(), this.width <= 0 || this.height <= 0) return;
            if (!1 === this.notifyPlugins("beforeDraw", { cancelable: !0 })) return;
            const e = this._layers;
            for (t = 0; t < e.length && e[t].z <= 0; ++t) e[t].draw(this.chartArea);
            for (this._drawDatasets(); t < e.length; ++t) e[t].draw(this.chartArea);
            this.notifyPlugins("afterDraw")
        }
        _getSortedDatasetMetas(t) {
            const e = this._sortedMetasets,
                i = [];
            let s, n;
            for (s = 0, n = e.length; s < n; ++s) {
                const n = e[s];
                t && !n.visible || i.push(n)
            }
            return i
        }
        getSortedVisibleDatasetMetas() { return this._getSortedDatasetMetas(!0) }
        _drawDatasets() {
            if (!1 === this.notifyPlugins("beforeDatasetsDraw", { cancelable: !0 })) return;
            const t = this.getSortedVisibleDatasetMetas();
            for (let e = t.length - 1; e >= 0; --e) this._drawDataset(t[e]);
            this.notifyPlugins("afterDatasetsDraw")
        }
        _drawDataset(t) {
            const e = this.ctx,
                i = t._clip,
                s = !i.disabled,
                n = this.chartArea,
                o = { meta: t, index: t.index, cancelable: !0 };
            !1 !== this.notifyPlugins("beforeDatasetDraw", o) && (s && Pe(e, { left: !1 === i.left ? 0 : n.left - i.left, right: !1 === i.right ? this.width : n.right + i.right, top: !1 === i.top ? 0 : n.top - i.top, bottom: !1 === i.bottom ? this.height : n.bottom + i.bottom }), t.controller.draw(), s && De(e), o.cancelable = !1, this.notifyPlugins("afterDatasetDraw", o))
        }
        isPointInArea(t) { return Se(t, this.chartArea, this._minPadding) }
        getElementsAtEventForMode(t, e, i, s) { const n = Vi.modes[e]; return "function" == typeof n ? n(this, t, i, s) : [] }
        getDatasetMeta(t) {
            const e = this.data.datasets[t],
                i = this._metasets;
            let s = i.filter((t => t && t._dataset === e)).pop();
            return s || (s = { type: null, data: [], dataset: null, controller: null, hidden: null, xAxisID: null, yAxisID: null, order: e && e.order || 0, index: t, _dataset: e, _parsed: [], _sorted: !1 }, i.push(s)), s
        }
        getContext() { return this.$context || (this.$context = _i(null, { chart: this, type: "chart" })) }
        getVisibleDatasetCount() { return this.getSortedVisibleDatasetMetas().length }
        isDatasetVisible(t) { const e = this.data.datasets[t]; if (!e) return !1; const i = this.getDatasetMeta(t); return "boolean" == typeof i.hidden ? !i.hidden : !e.hidden }
        setDatasetVisibility(t, e) { this.getDatasetMeta(t).hidden = !e }
        toggleDataVisibility(t) { this._hiddenIndices[t] = !this._hiddenIndices[t] }
        getDataVisibility(t) { return !this._hiddenIndices[t] }
        _updateVisibility(t, e, i) {
            const s = i ? "show" : "hide",
                n = this.getDatasetMeta(t),
                o = n.controller._resolveAnimations(void 0, s);
            M(e) ? (n.data[e].hidden = !i, this.update()) : (this.setDatasetVisibility(t, i), o.update(n, { visible: i }), this.update((e => e.datasetIndex === t ? s : void 0)))
        }
        hide(t, e) { this._updateVisibility(t, e, !1) }
        show(t, e) { this._updateVisibility(t, e, !0) }
        _destroyDatasetMeta(t) {
            const e = this._metasets[t];
            e && e.controller && e.controller._destroy(), delete this._metasets[t]
        }
        _stop() { let t, e; for (this.stop(), mt.remove(this), t = 0, e = this.data.datasets.length; t < e; ++t) this._destroyDatasetMeta(t) }
        destroy() {
            this.notifyPlugins("beforeDestroy");
            const { canvas: t, ctx: e } = this;
            this._stop(), this.config.clearCache(), t && (this.unbindEvents(), we(t, e), this.platform.releaseContext(e), this.canvas = null, this.ctx = null), this.notifyPlugins("destroy"), delete gn[this.id], this.notifyPlugins("afterDestroy")
        }
        toBase64Image(...t) { return this.canvas.toDataURL(...t) }
        bindEvents() { this.bindUserEvents(), this.options.responsive ? this.bindResponsiveEvents() : this.attached = !0 }
        bindUserEvents() {
            const t = this._listeners,
                e = this.platform,
                i = (i, s) => { e.addEventListener(this, i, s), t[i] = s },
                s = (t, e, i) => { t.offsetX = e, t.offsetY = i, this._eventHandler(t) };
            d(this.options.events, (t => i(t, s)))
        }
        bindResponsiveEvents() {
            this._responsiveListeners || (this._responsiveListeners = {});
            const t = this._responsiveListeners,
                e = this.platform,
                i = (i, s) => { e.addEventListener(this, i, s), t[i] = s },
                s = (i, s) => { t[i] && (e.removeEventListener(this, i, s), delete t[i]) },
                n = (t, e) => { this.canvas && this.resize(t, e) };
            let o;
            const a = () => { s("attach", a), this.attached = !0, this.resize(), i("resize", n), i("detach", o) };
            o = () => { this.attached = !1, s("resize", n), this._stop(), this._resize(0, 0), i("attach", a) }, e.isAttached(this.canvas) ? a() : o()
        }
        unbindEvents() { d(this._listeners, ((t, e) => { this.platform.removeEventListener(this, e, t) })), this._listeners = {}, d(this._responsiveListeners, ((t, e) => { this.platform.removeEventListener(this, e, t) })), this._responsiveListeners = void 0 }
        updateHoverStyle(t, e, i) {
            const s = i ? "set" : "remove";
            let n, o, a, r;
            for ("dataset" === e && (n = this.getDatasetMeta(t[0].datasetIndex), n.controller["_" + s + "DatasetHoverStyle"]()), a = 0, r = t.length; a < r; ++a) {
                o = t[a];
                const e = o && this.getDatasetMeta(o.datasetIndex).controller;
                e && e[s + "HoverStyle"](o.element, o.datasetIndex, o.index)
            }
        }
        getActiveElements() { return this._active || [] }
        setActiveElements(t) {
            const e = this._active || [],
                i = t.map((({ datasetIndex: t, index: e }) => { const i = this.getDatasetMeta(t); if (!i) throw new Error("No dataset found at index " + t); return { datasetIndex: t, element: i.data[e], index: e } }));
            !u(i, e) && (this._active = i, this._lastEvent = null, this._updateHoverStyles(i, e))
        }
        notifyPlugins(t, e, i) { return this._plugins.notify(this, t, e, i) }
        _updateHoverStyles(t, e, i) {
            const s = this.options.hover,
                n = (t, e) => t.filter((t => !e.some((e => t.datasetIndex === e.datasetIndex && t.index === e.index)))),
                o = n(e, t),
                a = i ? t : n(t, e);
            o.length && this.updateHoverStyle(o, s.mode, !1), a.length && s.mode && this.updateHoverStyle(a, s.mode, !0)
        }
        _eventHandler(t, e) {
            const i = { event: t, replay: e, cancelable: !0, inChartArea: this.isPointInArea(t) },
                s = e => (e.options.events || this.options.events).includes(t.native.type);
            if (!1 === this.notifyPlugins("beforeEvent", i, s)) return;
            const n = this._handleEvent(t, e, i.inChartArea);
            return i.cancelable = !1, this.notifyPlugins("afterEvent", i, s), (n || i.changed) && this.render(), this
        }
        _handleEvent(t, e, i) {
            const { _active: s = [], options: n } = this, o = e, a = this._getActiveElements(t, s, i, o), r = P(t), l = function(t, e, i, s) { return i && "mouseout" !== t.type ? s ? e : t : null }(t, this._lastEvent, i, r);
            i && (this._lastEvent = null, c(n.onHover, [t, a, this], this), r && c(n.onClick, [t, a, this], this));
            const h = !u(a, s);
            return (h || e) && (this._active = a, this._updateHoverStyles(a, s, e)), this._lastEvent = l, h
        }
        _getActiveElements(t, e, i, s) { if ("mouseout" === t.type) return []; if (!i) return e; const n = this.options.hover; return this.getElementsAtEventForMode(t, n.mode, n, s) }
    }
    const xn = () => d(bn.instances, (t => t._plugins.invalidate())),
        _n = !0;

    function yn() { throw new Error("This method is not implemented: Check that a complete date adapter is provided.") }
    Object.defineProperties(bn, { defaults: { enumerable: _n, value: ne }, instances: { enumerable: _n, value: gn }, overrides: { enumerable: _n, value: te }, registry: { enumerable: _n, value: Us }, version: { enumerable: _n, value: "3.9.1" }, getChart: { enumerable: _n, value: pn }, register: { enumerable: _n, value: (...t) => { Us.add(...t), xn() } }, unregister: { enumerable: _n, value: (...t) => { Us.remove(...t), xn() } } });
    class vn {
        constructor(t) { this.options = t || {} }
        init(t) {}
        formats() { return yn() }
        parse(t, e) { return yn() }
        format(t, e) { return yn() }
        add(t, e, i) { return yn() }
        diff(t, e, i) { return yn() }
        startOf(t, e, i) { return yn() }
        endOf(t, e) { return yn() }
    }
    vn.override = function(t) { Object.assign(vn.prototype, t) };
    var wn = { _date: vn };

    function Mn(t) {
        const e = t.iScale,
            i = function(t, e) {
                if (!t._cache.$bar) {
                    const i = t.getMatchingVisibleMetas(e);
                    let s = [];
                    for (let e = 0, n = i.length; e < n; e++) s = s.concat(i[e].controller.getAllParsedValues(t));
                    t._cache.$bar = rt(s.sort(((t, e) => t - e)))
                }
                return t._cache.$bar
            }(e, t.type);
        let s, n, o, a, r = e._length;
        const l = () => { 32767 !== o && -32768 !== o && (M(a) && (r = Math.min(r, Math.abs(o - a) || r)), a = o) };
        for (s = 0, n = i.length; s < n; ++s) o = e.getPixelForValue(i[s]), l();
        for (a = void 0, s = 0, n = e.ticks.length; s < n; ++s) o = e.getPixelForTick(s), l();
        return r
    }

    function kn(t, e, i, n) {
        return s(t) ? function(t, e, i, s) {
            const n = i.parse(t[0], s),
                o = i.parse(t[1], s),
                a = Math.min(n, o),
                r = Math.max(n, o);
            let l = a,
                h = r;
            Math.abs(a) > Math.abs(r) && (l = r, h = a), e[i.axis] = h, e._custom = { barStart: l, barEnd: h, start: n, end: o, min: a, max: r }
        }(t, e, i, n) : e[i.axis] = i.parse(t, n), e
    }

    function Sn(t, e, i, s) {
        const n = t.iScale,
            o = t.vScale,
            a = n.getLabels(),
            r = n === o,
            l = [];
        let h, c, d, u;
        for (h = i, c = i + s; h < c; ++h) u = e[h], d = {}, d[n.axis] = r || n.parse(a[h], h), l.push(kn(u, d, o, h));
        return l
    }

    function Pn(t) { return t && void 0 !== t.barStart && void 0 !== t.barEnd }

    function Dn(t, e, i, s) { let n = e.borderSkipped; const o = {}; if (!n) return void(t.borderSkipped = o); if (!0 === n) return void(t.borderSkipped = { top: !0, right: !0, bottom: !0, left: !0 }); const { start: a, end: r, reverse: l, top: h, bottom: c } = function(t) { let e, i, s, n, o; return t.horizontal ? (e = t.base > t.x, i = "left", s = "right") : (e = t.base < t.y, i = "bottom", s = "top"), e ? (n = "end", o = "start") : (n = "start", o = "end"), { start: i, end: s, reverse: e, top: n, bottom: o } }(t); "middle" === n && i && (t.enableBorderRadius = !0, (i._top || 0) === s ? n = h : (i._bottom || 0) === s ? n = c : (o[On(c, a, r, l)] = !0, n = h)), o[On(n, a, r, l)] = !0, t.borderSkipped = o }

    function On(t, e, i, s) { var n, o, a; return s ? (a = i, t = Cn(t = (n = t) === (o = e) ? a : n === a ? o : n, i, e)) : t = Cn(t, e, i), t }

    function Cn(t, e, i) { return "start" === t ? e : "end" === t ? i : t }

    function An(t, { inflateAmount: e }, i) { t.inflateAmount = "auto" === e ? 1 === i ? .33 : 0 : e }
    class Tn extends Ls {
        parsePrimitiveData(t, e, i, s) { return Sn(t, e, i, s) }
        parseArrayData(t, e, i, s) { return Sn(t, e, i, s) }
        parseObjectData(t, e, i, s) { const { iScale: n, vScale: o } = t, { xAxisKey: a = "x", yAxisKey: r = "y" } = this._parsing, l = "x" === n.axis ? a : r, h = "x" === o.axis ? a : r, c = []; let d, u, f, g; for (d = i, u = i + s; d < u; ++d) g = e[d], f = {}, f[n.axis] = n.parse(y(g, l), d), c.push(kn(y(g, h), f, o, d)); return c }
        updateRangeFromParsed(t, e, i, s) {
            super.updateRangeFromParsed(t, e, i, s);
            const n = i._custom;
            n && e === this._cachedMeta.vScale && (t.min = Math.min(t.min, n.min), t.max = Math.max(t.max, n.max))
        }
        getMaxOverflow() { return 0 }
        getLabelAndValue(t) {
            const e = this._cachedMeta,
                { iScale: i, vScale: s } = e,
                n = this.getParsed(t),
                o = n._custom,
                a = Pn(o) ? "[" + o.start + ", " + o.end + "]" : "" + s.getLabelForValue(n[s.axis]);
            return { label: "" + i.getLabelForValue(n[i.axis]), value: a }
        }
        initialize() {
            this.enableOptionSharing = !0, super.initialize();
            this._cachedMeta.stack = this.getDataset().stack
        }
        update(t) {
            const e = this._cachedMeta;
            this.updateElements(e.data, 0, e.data.length, t)
        }
        updateElements(t, e, s, n) {
            const o = "reset" === n,
                { index: a, _cachedMeta: { vScale: r } } = this,
                l = r.getBasePixel(),
                h = r.isHorizontal(),
                c = this._getRuler(),
                { sharedOptions: d, includeOptions: u } = this._getSharedOptions(e, n);
            for (let f = e; f < e + s; f++) {
                const e = this.getParsed(f),
                    s = o || i(e[r.axis]) ? { base: l, head: l } : this._calculateBarValuePixels(f),
                    g = this._calculateBarIndexPixels(f, c),
                    p = (e._stacks || {})[r.axis],
                    m = { horizontal: h, base: s.base, enableBorderRadius: !p || Pn(e._custom) || a === p._top || a === p._bottom, x: h ? s.head : g.center, y: h ? g.center : s.head, height: h ? g.size : Math.abs(s.size), width: h ? Math.abs(s.size) : g.size };
                u && (m.options = d || this.resolveDataElementOptions(f, t[f].active ? "active" : n));
                const b = m.options || t[f].options;
                Dn(m, b, p, a), An(m, b, c.ratio), this.updateElement(t[f], f, m, n)
            }
        }
        _getStacks(t, e) {
            const { iScale: s } = this._cachedMeta, n = s.getMatchingVisibleMetas(this._type).filter((t => t.controller.options.grouped)), o = s.options.stacked, a = [], r = t => {
                const s = t.controller.getParsed(e),
                    n = s && s[t.vScale.axis];
                if (i(n) || isNaN(n)) return !0
            };
            for (const i of n)
                if ((void 0 === e || !r(i)) && ((!1 === o || -1 === a.indexOf(i.stack) || void 0 === o && void 0 === i.stack) && a.push(i.stack), i.index === t)) break;
            return a.length || a.push(void 0), a
        }
        _getStackCount(t) { return this._getStacks(void 0, t).length }
        _getStackIndex(t, e, i) {
            const s = this._getStacks(t, i),
                n = void 0 !== e ? s.indexOf(e) : -1;
            return -1 === n ? s.length - 1 : n
        }
        _getRuler() {
            const t = this.options,
                e = this._cachedMeta,
                i = e.iScale,
                s = [];
            let n, o;
            for (n = 0, o = e.data.length; n < o; ++n) s.push(i.getPixelForValue(this.getParsed(n)[i.axis], n));
            const a = t.barThickness;
            return { min: a || Mn(e), pixels: s, start: i._startPixel, end: i._endPixel, stackCount: this._getStackCount(), scale: i, grouped: t.grouped, ratio: a ? 1 : t.categoryPercentage * t.barPercentage }
        }
        _calculateBarValuePixels(t) {
            const { _cachedMeta: { vScale: e, _stacked: s }, options: { base: n, minBarLength: o } } = this, a = n || 0, r = this.getParsed(t), l = r._custom, h = Pn(l);
            let c, d, u = r[e.axis],
                f = 0,
                g = s ? this.applyStack(e, r, s) : u;
            g !== u && (f = g - u, g = u), h && (u = l.barStart, g = l.barEnd - l.barStart, 0 !== u && z(u) !== z(l.barEnd) && (f = 0), f += u);
            const p = i(n) || h ? f : n;
            let m = e.getPixelForValue(p);
            if (c = this.chart.getDataVisibility(t) ? e.getPixelForValue(f + g) : m, d = c - m, Math.abs(d) < o) {
                d = function(t, e, i) { return 0 !== t ? z(t) : (e.isHorizontal() ? 1 : -1) * (e.min >= i ? 1 : -1) }(d, e, a) * o, u === a && (m -= d / 2);
                const t = e.getPixelForDecimal(0),
                    i = e.getPixelForDecimal(1),
                    s = Math.min(t, i),
                    n = Math.max(t, i);
                m = Math.max(Math.min(m, n), s), c = m + d
            }
            if (m === e.getPixelForValue(a)) {
                const t = z(d) * e.getLineWidthForValue(a) / 2;
                m += t, d -= t
            }
            return { size: d, base: m, head: c, center: c + d / 2 }
        }
        _calculateBarIndexPixels(t, e) {
            const s = e.scale,
                n = this.options,
                o = n.skipNull,
                a = r(n.maxBarThickness, 1 / 0);
            let l, h;
            if (e.grouped) {
                const s = o ? this._getStackCount(t) : e.stackCount,
                    r = "flex" === n.barThickness ? function(t, e, i, s) {
                        const n = e.pixels,
                            o = n[t];
                        let a = t > 0 ? n[t - 1] : null,
                            r = t < n.length - 1 ? n[t + 1] : null;
                        const l = i.categoryPercentage;
                        null === a && (a = o - (null === r ? e.end - e.start : r - o)), null === r && (r = o + o - a);
                        const h = o - (o - Math.min(a, r)) / 2 * l;
                        return { chunk: Math.abs(r - a) / 2 * l / s, ratio: i.barPercentage, start: h }
                    }(t, e, n, s) : function(t, e, s, n) { const o = s.barThickness; let a, r; return i(o) ? (a = e.min * s.categoryPercentage, r = s.barPercentage) : (a = o * n, r = 1), { chunk: a / n, ratio: r, start: e.pixels[t] - a / 2 } }(t, e, n, s),
                    c = this._getStackIndex(this.index, this._cachedMeta.stack, o ? t : void 0);
                l = r.start + r.chunk * c + r.chunk / 2, h = Math.min(a, r.chunk * r.ratio)
            } else l = s.getPixelForValue(this.getParsed(t)[s.axis], t), h = Math.min(a, e.min * e.ratio);
            return { base: l - h / 2, head: l + h / 2, center: l, size: h }
        }
        draw() {
            const t = this._cachedMeta,
                e = t.vScale,
                i = t.data,
                s = i.length;
            let n = 0;
            for (; n < s; ++n) null !== this.getParsed(n)[e.axis] && i[n].draw(this._ctx)
        }
    }
    Tn.id = "bar", Tn.defaults = { datasetElementType: !1, dataElementType: "bar", categoryPercentage: .8, barPercentage: .9, grouped: !0, animations: { numbers: { type: "number", properties: ["x", "y", "base", "width", "height"] } } }, Tn.overrides = { scales: { _index_: { type: "category", offset: !0, grid: { offset: !0 } }, _value_: { type: "linear", beginAtZero: !0 } } };
    class Ln extends Ls {
        initialize() { this.enableOptionSharing = !0, super.initialize() }
        parsePrimitiveData(t, e, i, s) { const n = super.parsePrimitiveData(t, e, i, s); for (let t = 0; t < n.length; t++) n[t]._custom = this.resolveDataElementOptions(t + i).radius; return n }
        parseArrayData(t, e, i, s) {
            const n = super.parseArrayData(t, e, i, s);
            for (let t = 0; t < n.length; t++) {
                const s = e[i + t];
                n[t]._custom = r(s[2], this.resolveDataElementOptions(t + i).radius)
            }
            return n
        }
        parseObjectData(t, e, i, s) {
            const n = super.parseObjectData(t, e, i, s);
            for (let t = 0; t < n.length; t++) {
                const s = e[i + t];
                n[t]._custom = r(s && s.r && +s.r, this.resolveDataElementOptions(t + i).radius)
            }
            return n
        }
        getMaxOverflow() { const t = this._cachedMeta.data; let e = 0; for (let i = t.length - 1; i >= 0; --i) e = Math.max(e, t[i].size(this.resolveDataElementOptions(i)) / 2); return e > 0 && e }
        getLabelAndValue(t) {
            const e = this._cachedMeta,
                { xScale: i, yScale: s } = e,
                n = this.getParsed(t),
                o = i.getLabelForValue(n.x),
                a = s.getLabelForValue(n.y),
                r = n._custom;
            return { label: e.label, value: "(" + o + ", " + a + (r ? ", " + r : "") + ")" }
        }
        update(t) {
            const e = this._cachedMeta.data;
            this.updateElements(e, 0, e.length, t)
        }
        updateElements(t, e, i, s) {
            const n = "reset" === s,
                { iScale: o, vScale: a } = this._cachedMeta,
                { sharedOptions: r, includeOptions: l } = this._getSharedOptions(e, s),
                h = o.axis,
                c = a.axis;
            for (let d = e; d < e + i; d++) {
                const e = t[d],
                    i = !n && this.getParsed(d),
                    u = {},
                    f = u[h] = n ? o.getPixelForDecimal(.5) : o.getPixelForValue(i[h]),
                    g = u[c] = n ? a.getBasePixel() : a.getPixelForValue(i[c]);
                u.skip = isNaN(f) || isNaN(g), l && (u.options = r || this.resolveDataElementOptions(d, e.active ? "active" : s), n && (u.options.radius = 0)), this.updateElement(e, d, u, s)
            }
        }
        resolveDataElementOptions(t, e) {
            const i = this.getParsed(t);
            let s = super.resolveDataElementOptions(t, e);
            s.$shared && (s = Object.assign({}, s, { $shared: !1 }));
            const n = s.radius;
            return "active" !== e && (s.radius = 0), s.radius += r(i && i._custom, n), s
        }
    }
    Ln.id = "bubble", Ln.defaults = { datasetElementType: !1, dataElementType: "point", animations: { numbers: { type: "number", properties: ["x", "y", "borderWidth", "radius"] } } }, Ln.overrides = { scales: { x: { type: "linear" }, y: { type: "linear" } }, plugins: { tooltip: { callbacks: { title: () => "" } } } };
    class En extends Ls {
        constructor(t, e) { super(t, e), this.enableOptionSharing = !0, this.innerRadius = void 0, this.outerRadius = void 0, this.offsetX = void 0, this.offsetY = void 0 }
        linkScales() {}
        parse(t, e) {
            const i = this.getDataset().data,
                s = this._cachedMeta;
            if (!1 === this._parsing) s._parsed = i;
            else {
                let o, a, r = t => +i[t];
                if (n(i[t])) {
                    const { key: t = "value" } = this._parsing;
                    r = e => +y(i[e], t)
                }
                for (o = t, a = t + e; o < a; ++o) s._parsed[o] = r(o)
            }
        }
        _getRotation() { return H(this.options.rotation - 90) }
        _getCircumference() { return H(this.options.circumference) }
        _getRotationExtents() {
            let t = O,
                e = -O;
            for (let i = 0; i < this.chart.data.datasets.length; ++i)
                if (this.chart.isDatasetVisible(i)) {
                    const s = this.chart.getDatasetMeta(i).controller,
                        n = s._getRotation(),
                        o = s._getCircumference();
                    t = Math.min(t, n), e = Math.max(e, n + o)
                }
            return { rotation: t, circumference: e - t }
        }
        update(t) {
            const e = this.chart,
                { chartArea: i } = e,
                s = this._cachedMeta,
                n = s.data,
                o = this.getMaxBorderWidth() + this.getMaxOffset(n) + this.options.spacing,
                a = Math.max((Math.min(i.width, i.height) - o) / 2, 0),
                r = Math.min(l(this.options.cutout, a), 1),
                c = this._getRingWeight(this.index),
                { circumference: d, rotation: u } = this._getRotationExtents(),
                { ratioX: f, ratioY: g, offsetX: p, offsetY: m } = function(t, e, i) {
                    let s = 1,
                        n = 1,
                        o = 0,
                        a = 0;
                    if (e < O) {
                        const r = t,
                            l = r + e,
                            h = Math.cos(r),
                            c = Math.sin(r),
                            d = Math.cos(l),
                            u = Math.sin(l),
                            f = (t, e, s) => G(t, r, l, !0) ? 1 : Math.max(e, e * i, s, s * i),
                            g = (t, e, s) => G(t, r, l, !0) ? -1 : Math.min(e, e * i, s, s * i),
                            p = f(0, h, d),
                            m = f(L, c, u),
                            b = g(D, h, d),
                            x = g(D + L, c, u);
                        s = (p - b) / 2, n = (m - x) / 2, o = -(p + b) / 2, a = -(m + x) / 2
                    }
                    return { ratioX: s, ratioY: n, offsetX: o, offsetY: a }
                }(u, d, r),
                b = (i.width - o) / f,
                x = (i.height - o) / g,
                _ = Math.max(Math.min(b, x) / 2, 0),
                y = h(this.options.radius, _),
                v = (y - Math.max(y * r, 0)) / this._getVisibleDatasetWeightTotal();
            this.offsetX = p * y, this.offsetY = m * y, s.total = this.calculateTotal(), this.outerRadius = y - v * this._getRingWeightOffset(this.index), this.innerRadius = Math.max(this.outerRadius - v * c, 0), this.updateElements(n, 0, n.length, t)
        }
        _circumference(t, e) {
            const i = this.options,
                s = this._cachedMeta,
                n = this._getCircumference();
            return e && i.animation.animateRotate || !this.chart.getDataVisibility(t) || null === s._parsed[t] || s.data[t].hidden ? 0 : this.calculateCircumference(s._parsed[t] * n / O)
        }
        updateElements(t, e, i, s) {
            const n = "reset" === s,
                o = this.chart,
                a = o.chartArea,
                r = o.options.animation,
                l = (a.left + a.right) / 2,
                h = (a.top + a.bottom) / 2,
                c = n && r.animateScale,
                d = c ? 0 : this.innerRadius,
                u = c ? 0 : this.outerRadius,
                { sharedOptions: f, includeOptions: g } = this._getSharedOptions(e, s);
            let p, m = this._getRotation();
            for (p = 0; p < e; ++p) m += this._circumference(p, n);
            for (p = e; p < e + i; ++p) {
                const e = this._circumference(p, n),
                    i = t[p],
                    o = { x: l + this.offsetX, y: h + this.offsetY, startAngle: m, endAngle: m + e, circumference: e, outerRadius: u, innerRadius: d };
                g && (o.options = f || this.resolveDataElementOptions(p, i.active ? "active" : s)), m += e, this.updateElement(i, p, o, s)
            }
        }
        calculateTotal() {
            const t = this._cachedMeta,
                e = t.data;
            let i, s = 0;
            for (i = 0; i < e.length; i++) {
                const n = t._parsed[i];
                null === n || isNaN(n) || !this.chart.getDataVisibility(i) || e[i].hidden || (s += Math.abs(n))
            }
            return s
        }
        calculateCircumference(t) { const e = this._cachedMeta.total; return e > 0 && !isNaN(t) ? O * (Math.abs(t) / e) : 0 }
        getLabelAndValue(t) {
            const e = this._cachedMeta,
                i = this.chart,
                s = i.data.labels || [],
                n = li(e._parsed[t], i.options.locale);
            return { label: s[t] || "", value: n }
        }
        getMaxBorderWidth(t) {
            let e = 0;
            const i = this.chart;
            let s, n, o, a, r;
            if (!t)
                for (s = 0, n = i.data.datasets.length; s < n; ++s)
                    if (i.isDatasetVisible(s)) { o = i.getDatasetMeta(s), t = o.data, a = o.controller; break }
            if (!t) return 0;
            for (s = 0, n = t.length; s < n; ++s) r = a.resolveDataElementOptions(s), "inner" !== r.borderAlign && (e = Math.max(e, r.borderWidth || 0, r.hoverBorderWidth || 0));
            return e
        }
        getMaxOffset(t) {
            let e = 0;
            for (let i = 0, s = t.length; i < s; ++i) {
                const t = this.resolveDataElementOptions(i);
                e = Math.max(e, t.offset || 0, t.hoverOffset || 0)
            }
            return e
        }
        _getRingWeightOffset(t) { let e = 0; for (let i = 0; i < t; ++i) this.chart.isDatasetVisible(i) && (e += this._getRingWeight(i)); return e }
        _getRingWeight(t) { return Math.max(r(this.chart.data.datasets[t].weight, 1), 0) }
        _getVisibleDatasetWeightTotal() { return this._getRingWeightOffset(this.chart.data.datasets.length) || 1 }
    }
    En.id = "doughnut", En.defaults = { datasetElementType: !1, dataElementType: "arc", animation: { animateRotate: !0, animateScale: !1 }, animations: { numbers: { type: "number", properties: ["circumference", "endAngle", "innerRadius", "outerRadius", "startAngle", "x", "y", "offset", "borderWidth", "spacing"] } }, cutout: "50%", rotation: 0, circumference: 360, radius: "100%", spacing: 0, indexAxis: "r" }, En.descriptors = { _scriptable: t => "spacing" !== t, _indexable: t => "spacing" !== t }, En.overrides = { aspectRatio: 1, plugins: { legend: { labels: { generateLabels(t) { const e = t.data; if (e.labels.length && e.datasets.length) { const { labels: { pointStyle: i } } = t.legend.options; return e.labels.map(((e, s) => { const n = t.getDatasetMeta(0).controller.getStyle(s); return { text: e, fillStyle: n.backgroundColor, strokeStyle: n.borderColor, lineWidth: n.borderWidth, pointStyle: i, hidden: !t.getDataVisibility(s), index: s } })) } return [] } }, onClick(t, e, i) { i.chart.toggleDataVisibility(e.index), i.chart.update() } }, tooltip: { callbacks: { title: () => "", label(t) { let e = t.label; const i = ": " + t.formattedValue; return s(e) ? (e = e.slice(), e[0] += i) : e += i, e } } } } };
    class Rn extends Ls {
        initialize() { this.enableOptionSharing = !0, this.supportsDecimation = !0, super.initialize() }
        update(t) {
            const e = this._cachedMeta,
                { dataset: i, data: s = [], _dataset: n } = e,
                o = this.chart._animationsDisabled;
            let { start: a, count: r } = gt(e, s, o);
            this._drawStart = a, this._drawCount = r, pt(e) && (a = 0, r = s.length), i._chart = this.chart, i._datasetIndex = this.index, i._decimated = !!n._decimated, i.points = s;
            const l = this.resolveDatasetElementOptions(t);
            this.options.showLine || (l.borderWidth = 0), l.segment = this.options.segment, this.updateElement(i, void 0, { animated: !o, options: l }, t), this.updateElements(s, a, r, t)
        }
        updateElements(t, e, s, n) {
            const o = "reset" === n,
                { iScale: a, vScale: r, _stacked: l, _dataset: h } = this._cachedMeta,
                { sharedOptions: c, includeOptions: d } = this._getSharedOptions(e, n),
                u = a.axis,
                f = r.axis,
                { spanGaps: g, segment: p } = this.options,
                m = B(g) ? g : Number.POSITIVE_INFINITY,
                b = this.chart._animationsDisabled || o || "none" === n;
            let x = e > 0 && this.getParsed(e - 1);
            for (let g = e; g < e + s; ++g) {
                const e = t[g],
                    s = this.getParsed(g),
                    _ = b ? e : {},
                    y = i(s[f]),
                    v = _[u] = a.getPixelForValue(s[u], g),
                    w = _[f] = o || y ? r.getBasePixel() : r.getPixelForValue(l ? this.applyStack(r, s, l) : s[f], g);
                _.skip = isNaN(v) || isNaN(w) || y, _.stop = g > 0 && Math.abs(s[u] - x[u]) > m, p && (_.parsed = s, _.raw = h.data[g]), d && (_.options = c || this.resolveDataElementOptions(g, e.active ? "active" : n)), b || this.updateElement(e, g, _, n), x = s
            }
        }
        getMaxOverflow() {
            const t = this._cachedMeta,
                e = t.dataset,
                i = e.options && e.options.borderWidth || 0,
                s = t.data || [];
            if (!s.length) return i;
            const n = s[0].size(this.resolveDataElementOptions(0)),
                o = s[s.length - 1].size(this.resolveDataElementOptions(s.length - 1));
            return Math.max(i, n, o) / 2
        }
        draw() {
            const t = this._cachedMeta;
            t.dataset.updateControlPoints(this.chart.chartArea, t.iScale.axis), super.draw()
        }
    }
    Rn.id = "line", Rn.defaults = { datasetElementType: "line", dataElementType: "point", showLine: !0, spanGaps: !1 }, Rn.overrides = { scales: { _index_: { type: "category" }, _value_: { type: "linear" } } };
    class In extends Ls {
        constructor(t, e) { super(t, e), this.innerRadius = void 0, this.outerRadius = void 0 }
        getLabelAndValue(t) {
            const e = this._cachedMeta,
                i = this.chart,
                s = i.data.labels || [],
                n = li(e._parsed[t].r, i.options.locale);
            return { label: s[t] || "", value: n }
        }
        parseObjectData(t, e, i, s) { return Ue.bind(this)(t, e, i, s) }
        update(t) {
            const e = this._cachedMeta.data;
            this._updateRadius(), this.updateElements(e, 0, e.length, t)
        }
        getMinMax() {
            const t = this._cachedMeta,
                e = { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY };
            return t.data.forEach(((t, i) => { const s = this.getParsed(i).r;!isNaN(s) && this.chart.getDataVisibility(i) && (s < e.min && (e.min = s), s > e.max && (e.max = s)) })), e
        }
        _updateRadius() {
            const t = this.chart,
                e = t.chartArea,
                i = t.options,
                s = Math.min(e.right - e.left, e.bottom - e.top),
                n = Math.max(s / 2, 0),
                o = (n - Math.max(i.cutoutPercentage ? n / 100 * i.cutoutPercentage : 1, 0)) / t.getVisibleDatasetCount();
            this.outerRadius = n - o * this.index, this.innerRadius = this.outerRadius - o
        }
        updateElements(t, e, i, s) {
            const n = "reset" === s,
                o = this.chart,
                a = o.options.animation,
                r = this._cachedMeta.rScale,
                l = r.xCenter,
                h = r.yCenter,
                c = r.getIndexAngle(0) - .5 * D;
            let d, u = c;
            const f = 360 / this.countVisibleElements();
            for (d = 0; d < e; ++d) u += this._computeAngle(d, s, f);
            for (d = e; d < e + i; d++) {
                const e = t[d];
                let i = u,
                    g = u + this._computeAngle(d, s, f),
                    p = o.getDataVisibility(d) ? r.getDistanceFromCenterForValue(this.getParsed(d).r) : 0;
                u = g, n && (a.animateScale && (p = 0), a.animateRotate && (i = g = c));
                const m = { x: l, y: h, innerRadius: 0, outerRadius: p, startAngle: i, endAngle: g, options: this.resolveDataElementOptions(d, e.active ? "active" : s) };
                this.updateElement(e, d, m, s)
            }
        }
        countVisibleElements() { const t = this._cachedMeta; let e = 0; return t.data.forEach(((t, i) => {!isNaN(this.getParsed(i).r) && this.chart.getDataVisibility(i) && e++ })), e }
        _computeAngle(t, e, i) { return this.chart.getDataVisibility(t) ? H(this.resolveDataElementOptions(t, e).angle || i) : 0 }
    }
    In.id = "polarArea", In.defaults = { dataElementType: "arc", animation: { animateRotate: !0, animateScale: !0 }, animations: { numbers: { type: "number", properties: ["x", "y", "startAngle", "endAngle", "innerRadius", "outerRadius"] } }, indexAxis: "r", startAngle: 0 }, In.overrides = { aspectRatio: 1, plugins: { legend: { labels: { generateLabels(t) { const e = t.data; if (e.labels.length && e.datasets.length) { const { labels: { pointStyle: i } } = t.legend.options; return e.labels.map(((e, s) => { const n = t.getDatasetMeta(0).controller.getStyle(s); return { text: e, fillStyle: n.backgroundColor, strokeStyle: n.borderColor, lineWidth: n.borderWidth, pointStyle: i, hidden: !t.getDataVisibility(s), index: s } })) } return [] } }, onClick(t, e, i) { i.chart.toggleDataVisibility(e.index), i.chart.update() } }, tooltip: { callbacks: { title: () => "", label: t => t.chart.data.labels[t.dataIndex] + ": " + t.formattedValue } } }, scales: { r: { type: "radialLinear", angleLines: { display: !1 }, beginAtZero: !0, grid: { circular: !0 }, pointLabels: { display: !1 }, startAngle: 0 } } };
    class zn extends En {}
    zn.id = "pie", zn.defaults = { cutout: 0, rotation: 0, circumference: 360, radius: "100%" };
    class Fn extends Ls {
        getLabelAndValue(t) {
            const e = this._cachedMeta.vScale,
                i = this.getParsed(t);
            return { label: e.getLabels()[t], value: "" + e.getLabelForValue(i[e.axis]) }
        }
        parseObjectData(t, e, i, s) { return Ue.bind(this)(t, e, i, s) }
        update(t) {
            const e = this._cachedMeta,
                i = e.dataset,
                s = e.data || [],
                n = e.iScale.getLabels();
            if (i.points = s, "resize" !== t) {
                const e = this.resolveDatasetElementOptions(t);
                this.options.showLine || (e.borderWidth = 0);
                const o = { _loop: !0, _fullLoop: n.length === s.length, options: e };
                this.updateElement(i, void 0, o, t)
            }
            this.updateElements(s, 0, s.length, t)
        }
        updateElements(t, e, i, s) {
            const n = this._cachedMeta.rScale,
                o = "reset" === s;
            for (let a = e; a < e + i; a++) {
                const e = t[a],
                    i = this.resolveDataElementOptions(a, e.active ? "active" : s),
                    r = n.getPointPositionForValue(a, this.getParsed(a).r),
                    l = o ? n.xCenter : r.x,
                    h = o ? n.yCenter : r.y,
                    c = { x: l, y: h, angle: r.angle, skip: isNaN(l) || isNaN(h), options: i };
                this.updateElement(e, a, c, s)
            }
        }
    }
    Fn.id = "radar", Fn.defaults = { datasetElementType: "line", dataElementType: "point", indexAxis: "r", showLine: !0, elements: { line: { fill: "start" } } }, Fn.overrides = { aspectRatio: 1, scales: { r: { type: "radialLinear" } } };
    class Vn extends Ls {
        update(t) {
            const e = this._cachedMeta,
                { data: i = [] } = e,
                s = this.chart._animationsDisabled;
            let { start: n, count: o } = gt(e, i, s);
            if (this._drawStart = n, this._drawCount = o, pt(e) && (n = 0, o = i.length), this.options.showLine) {
                const { dataset: n, _dataset: o } = e;
                n._chart = this.chart, n._datasetIndex = this.index, n._decimated = !!o._decimated, n.points = i;
                const a = this.resolveDatasetElementOptions(t);
                a.segment = this.options.segment, this.updateElement(n, void 0, { animated: !s, options: a }, t)
            }
            this.updateElements(i, n, o, t)
        }
        addElements() { const { showLine: t } = this.options;!this.datasetElementType && t && (this.datasetElementType = Us.getElement("line")), super.addElements() }
        updateElements(t, e, s, n) {
            const o = "reset" === n,
                { iScale: a, vScale: r, _stacked: l, _dataset: h } = this._cachedMeta,
                c = this.resolveDataElementOptions(e, n),
                d = this.getSharedOptions(c),
                u = this.includeOptions(n, d),
                f = a.axis,
                g = r.axis,
                { spanGaps: p, segment: m } = this.options,
                b = B(p) ? p : Number.POSITIVE_INFINITY,
                x = this.chart._animationsDisabled || o || "none" === n;
            let _ = e > 0 && this.getParsed(e - 1);
            for (let c = e; c < e + s; ++c) {
                const e = t[c],
                    s = this.getParsed(c),
                    p = x ? e : {},
                    y = i(s[g]),
                    v = p[f] = a.getPixelForValue(s[f], c),
                    w = p[g] = o || y ? r.getBasePixel() : r.getPixelForValue(l ? this.applyStack(r, s, l) : s[g], c);
                p.skip = isNaN(v) || isNaN(w) || y, p.stop = c > 0 && Math.abs(s[f] - _[f]) > b, m && (p.parsed = s, p.raw = h.data[c]), u && (p.options = d || this.resolveDataElementOptions(c, e.active ? "active" : n)), x || this.updateElement(e, c, p, n), _ = s
            }
            this.updateSharedOptions(d, n, c)
        }
        getMaxOverflow() {
            const t = this._cachedMeta,
                e = t.data || [];
            if (!this.options.showLine) { let t = 0; for (let i = e.length - 1; i >= 0; --i) t = Math.max(t, e[i].size(this.resolveDataElementOptions(i)) / 2); return t > 0 && t }
            const i = t.dataset,
                s = i.options && i.options.borderWidth || 0;
            if (!e.length) return s;
            const n = e[0].size(this.resolveDataElementOptions(0)),
                o = e[e.length - 1].size(this.resolveDataElementOptions(e.length - 1));
            return Math.max(s, n, o) / 2
        }
    }
    Vn.id = "scatter", Vn.defaults = { datasetElementType: !1, dataElementType: "point", showLine: !1, fill: !1 }, Vn.overrides = { interaction: { mode: "point" }, plugins: { tooltip: { callbacks: { title: () => "", label: t => "(" + t.label + ", " + t.formattedValue + ")" } } }, scales: { x: { type: "linear" }, y: { type: "linear" } } };
    var Bn = Object.freeze({ __proto__: null, BarController: Tn, BubbleController: Ln, DoughnutController: En, LineController: Rn, PolarAreaController: In, PieController: zn, RadarController: Fn, ScatterController: Vn });

    function Nn(t, e, i) {
        const { startAngle: s, pixelMargin: n, x: o, y: a, outerRadius: r, innerRadius: l } = e;
        let h = n / r;
        t.beginPath(), t.arc(o, a, r, s - h, i + h), l > n ? (h = n / l, t.arc(o, a, l, i + h, s - h, !0)) : t.arc(o, a, n, i + L, s - L), t.closePath(), t.clip()
    }

    function Wn(t, e, i, s) {
        const n = ui(t.options.borderRadius, ["outerStart", "outerEnd", "innerStart", "innerEnd"]);
        const o = (i - e) / 2,
            a = Math.min(o, s * e / 2),
            r = t => { const e = (i - Math.min(o, t)) * s / 2; return Z(t, 0, Math.min(o, e)) };
        return { outerStart: r(n.outerStart), outerEnd: r(n.outerEnd), innerStart: Z(n.innerStart, 0, a), innerEnd: Z(n.innerEnd, 0, a) }
    }

    function jn(t, e, i, s) { return { x: i + t * Math.cos(e), y: s + t * Math.sin(e) } }

    function Hn(t, e, i, s, n, o) {
        const { x: a, y: r, startAngle: l, pixelMargin: h, innerRadius: c } = e, d = Math.max(e.outerRadius + s + i - h, 0), u = c > 0 ? c + s + i + h : 0;
        let f = 0;
        const g = n - l;
        if (s) {
            const t = ((c > 0 ? c - s : 0) + (d > 0 ? d - s : 0)) / 2;
            f = (g - (0 !== t ? g * t / (t + s) : g)) / 2
        }
        const p = (g - Math.max(.001, g * d - i / D) / d) / 2,
            m = l + p + f,
            b = n - p - f,
            { outerStart: x, outerEnd: _, innerStart: y, innerEnd: v } = Wn(e, u, d, b - m),
            w = d - x,
            M = d - _,
            k = m + x / w,
            S = b - _ / M,
            P = u + y,
            O = u + v,
            C = m + y / P,
            A = b - v / O;
        if (t.beginPath(), o) {
            if (t.arc(a, r, d, k, S), _ > 0) {
                const e = jn(M, S, a, r);
                t.arc(e.x, e.y, _, S, b + L)
            }
            const e = jn(O, b, a, r);
            if (t.lineTo(e.x, e.y), v > 0) {
                const e = jn(O, A, a, r);
                t.arc(e.x, e.y, v, b + L, A + Math.PI)
            }
            if (t.arc(a, r, u, b - v / u, m + y / u, !0), y > 0) {
                const e = jn(P, C, a, r);
                t.arc(e.x, e.y, y, C + Math.PI, m - L)
            }
            const i = jn(w, m, a, r);
            if (t.lineTo(i.x, i.y), x > 0) {
                const e = jn(w, k, a, r);
                t.arc(e.x, e.y, x, m - L, k)
            }
        } else {
            t.moveTo(a, r);
            const e = Math.cos(k) * d + a,
                i = Math.sin(k) * d + r;
            t.lineTo(e, i);
            const s = Math.cos(S) * d + a,
                n = Math.sin(S) * d + r;
            t.lineTo(s, n)
        }
        t.closePath()
    }

    function $n(t, e, i, s, n, o) {
        const { options: a } = e, { borderWidth: r, borderJoinStyle: l } = a, h = "inner" === a.borderAlign;
        r && (h ? (t.lineWidth = 2 * r, t.lineJoin = l || "round") : (t.lineWidth = r, t.lineJoin = l || "bevel"), e.fullCircles && function(t, e, i) { const { x: s, y: n, startAngle: o, pixelMargin: a, fullCircles: r } = e, l = Math.max(e.outerRadius - a, 0), h = e.innerRadius + a; let c; for (i && Nn(t, e, o + O), t.beginPath(), t.arc(s, n, h, o + O, o, !0), c = 0; c < r; ++c) t.stroke(); for (t.beginPath(), t.arc(s, n, l, o, o + O), c = 0; c < r; ++c) t.stroke() }(t, e, h), h && Nn(t, e, n), Hn(t, e, i, s, n, o), t.stroke())
    }
    class Yn extends Es {
        constructor(t) { super(), this.options = void 0, this.circumference = void 0, this.startAngle = void 0, this.endAngle = void 0, this.innerRadius = void 0, this.outerRadius = void 0, this.pixelMargin = 0, this.fullCircles = 0, t && Object.assign(this, t) }
        inRange(t, e, i) {
            const s = this.getProps(["x", "y"], i),
                { angle: n, distance: o } = U(s, { x: t, y: e }),
                { startAngle: a, endAngle: l, innerRadius: h, outerRadius: c, circumference: d } = this.getProps(["startAngle", "endAngle", "innerRadius", "outerRadius", "circumference"], i),
                u = this.options.spacing / 2,
                f = r(d, l - a) >= O || G(n, a, l),
                g = Q(o, h + u, c + u);
            return f && g
        }
        getCenterPoint(t) { const { x: e, y: i, startAngle: s, endAngle: n, innerRadius: o, outerRadius: a } = this.getProps(["x", "y", "startAngle", "endAngle", "innerRadius", "outerRadius", "circumference"], t), { offset: r, spacing: l } = this.options, h = (s + n) / 2, c = (o + a + l + r) / 2; return { x: e + Math.cos(h) * c, y: i + Math.sin(h) * c } }
        tooltipPosition(t) { return this.getCenterPoint(t) }
        draw(t) {
            const { options: e, circumference: i } = this, s = (e.offset || 0) / 2, n = (e.spacing || 0) / 2, o = e.circular;
            if (this.pixelMargin = "inner" === e.borderAlign ? .33 : 0, this.fullCircles = i > O ? Math.floor(i / O) : 0, 0 === i || this.innerRadius < 0 || this.outerRadius < 0) return;
            t.save();
            let a = 0;
            if (s) {
                a = s / 2;
                const e = (this.startAngle + this.endAngle) / 2;
                t.translate(Math.cos(e) * a, Math.sin(e) * a), this.circumference >= D && (a = s)
            }
            t.fillStyle = e.backgroundColor, t.strokeStyle = e.borderColor;
            const r = function(t, e, i, s, n) {
                const { fullCircles: o, startAngle: a, circumference: r } = e;
                let l = e.endAngle;
                if (o) {
                    Hn(t, e, i, s, a + O, n);
                    for (let e = 0; e < o; ++e) t.fill();
                    isNaN(r) || (l = a + r % O, r % O == 0 && (l += O))
                }
                return Hn(t, e, i, s, l, n), t.fill(), l
            }(t, this, a, n, o);
            $n(t, this, a, n, r, o), t.restore()
        }
    }

    function Un(t, e, i = e) { t.lineCap = r(i.borderCapStyle, e.borderCapStyle), t.setLineDash(r(i.borderDash, e.borderDash)), t.lineDashOffset = r(i.borderDashOffset, e.borderDashOffset), t.lineJoin = r(i.borderJoinStyle, e.borderJoinStyle), t.lineWidth = r(i.borderWidth, e.borderWidth), t.strokeStyle = r(i.borderColor, e.borderColor) }

    function Xn(t, e, i) { t.lineTo(i.x, i.y) }

    function qn(t, e, i = {}) {
        const s = t.length,
            { start: n = 0, end: o = s - 1 } = i,
            { start: a, end: r } = e,
            l = Math.max(n, a),
            h = Math.min(o, r),
            c = n < a && o < a || n > r && o > r;
        return { count: s, start: l, loop: e.loop, ilen: h < l && !c ? s + h - l : h - l }
    }

    function Kn(t, e, i, s) { const { points: n, options: o } = e, { count: a, start: r, loop: l, ilen: h } = qn(n, i, s), c = function(t) { return t.stepped ? Oe : t.tension || "monotone" === t.cubicInterpolationMode ? Ce : Xn }(o); let d, u, f, { move: g = !0, reverse: p } = s || {}; for (d = 0; d <= h; ++d) u = n[(r + (p ? h - d : d)) % a], u.skip || (g ? (t.moveTo(u.x, u.y), g = !1) : c(t, f, u, p, o.stepped), f = u); return l && (u = n[(r + (p ? h : 0)) % a], c(t, f, u, p, o.stepped)), !!l }

    function Gn(t, e, i, s) {
        const n = e.points,
            { count: o, start: a, ilen: r } = qn(n, i, s),
            { move: l = !0, reverse: h } = s || {};
        let c, d, u, f, g, p, m = 0,
            b = 0;
        const x = t => (a + (h ? r - t : t)) % o,
            _ = () => { f !== g && (t.lineTo(m, g), t.lineTo(m, f), t.lineTo(m, p)) };
        for (l && (d = n[x(0)], t.moveTo(d.x, d.y)), c = 0; c <= r; ++c) {
            if (d = n[x(c)], d.skip) continue;
            const e = d.x,
                i = d.y,
                s = 0 | e;
            s === u ? (i < f ? f = i : i > g && (g = i), m = (b * m + e) / ++b) : (_(), t.lineTo(e, i), u = s, b = 0, f = g = i), p = i
        }
        _()
    }

    function Zn(t) {
        const e = t.options,
            i = e.borderDash && e.borderDash.length;
        return !(t._decimated || t._loop || e.tension || "monotone" === e.cubicInterpolationMode || e.stepped || i) ? Gn : Kn
    }
    Yn.id = "arc", Yn.defaults = { borderAlign: "center", borderColor: "#fff", borderJoinStyle: void 0, borderRadius: 0, borderWidth: 2, offset: 0, spacing: 0, angle: void 0, circular: !0 }, Yn.defaultRoutes = { backgroundColor: "backgroundColor" };
    const Jn = "function" == typeof Path2D;

    function Qn(t, e, i, s) {
        Jn && !e.options.segment ? function(t, e, i, s) {
            let n = e._path;
            n || (n = e._path = new Path2D, e.path(n, i, s) && n.closePath()), Un(t, e.options), t.stroke(n)
        }(t, e, i, s) : function(t, e, i, s) { const { segments: n, options: o } = e, a = Zn(e); for (const r of n) Un(t, o, r.style), t.beginPath(), a(t, e, r, { start: i, end: i + s - 1 }) && t.closePath(), t.stroke() }(t, e, i, s)
    }
    class to extends Es {
        constructor(t) { super(), this.animated = !0, this.options = void 0, this._chart = void 0, this._loop = void 0, this._fullLoop = void 0, this._path = void 0, this._points = void 0, this._segments = void 0, this._decimated = !1, this._pointsUpdated = !1, this._datasetIndex = void 0, t && Object.assign(this, t) }
        updateControlPoints(t, e) {
            const i = this.options;
            if ((i.tension || "monotone" === i.cubicInterpolationMode) && !i.stepped && !this._pointsUpdated) {
                const s = i.spanGaps ? this._loop : this._fullLoop;
                Qe(this._points, i, t, s, e), this._pointsUpdated = !0
            }
        }
        set points(t) { this._points = t, delete this._segments, delete this._path, this._pointsUpdated = !1 }
        get points() { return this._points }
        get segments() { return this._segments || (this._segments = Di(this, this.options.segment)) }
        first() {
            const t = this.segments,
                e = this.points;
            return t.length && e[t[0].start]
        }
        last() {
            const t = this.segments,
                e = this.points,
                i = t.length;
            return i && e[t[i - 1].end]
        }
        interpolate(t, e) {
            const i = this.options,
                s = t[e],
                n = this.points,
                o = Pi(this, { property: e, start: s, end: s });
            if (!o.length) return;
            const a = [],
                r = function(t) { return t.stepped ? oi : t.tension || "monotone" === t.cubicInterpolationMode ? ai : ni }(i);
            let l, h;
            for (l = 0, h = o.length; l < h; ++l) {
                const { start: h, end: c } = o[l], d = n[h], u = n[c];
                if (d === u) { a.push(d); continue }
                const f = r(d, u, Math.abs((s - d[e]) / (u[e] - d[e])), i.stepped);
                f[e] = t[e], a.push(f)
            }
            return 1 === a.length ? a[0] : a
        }
        pathSegment(t, e, i) { return Zn(this)(t, this, e, i) }
        path(t, e, i) {
            const s = this.segments,
                n = Zn(this);
            let o = this._loop;
            e = e || 0, i = i || this.points.length - e;
            for (const a of s) o &= n(t, this, a, { start: e, end: e + i - 1 });
            return !!o
        }
        draw(t, e, i, s) {
            const n = this.options || {};
            (this.points || []).length && n.borderWidth && (t.save(), Qn(t, this, i, s), t.restore()), this.animated && (this._pointsUpdated = !1, this._path = void 0)
        }
    }

    function eo(t, e, i, s) {
        const n = t.options,
            {
                [i]: o
            } = t.getProps([i], s);
        return Math.abs(e - o) < n.radius + n.hitRadius
    }
    to.id = "line", to.defaults = { borderCapStyle: "butt", borderDash: [], borderDashOffset: 0, borderJoinStyle: "miter", borderWidth: 3, capBezierPoints: !0, cubicInterpolationMode: "default", fill: !1, spanGaps: !1, stepped: !1, tension: 0 }, to.defaultRoutes = { backgroundColor: "backgroundColor", borderColor: "borderColor" }, to.descriptors = { _scriptable: !0, _indexable: t => "borderDash" !== t && "fill" !== t };
    class io extends Es {
        constructor(t) { super(), this.options = void 0, this.parsed = void 0, this.skip = void 0, this.stop = void 0, t && Object.assign(this, t) }
        inRange(t, e, i) {
            const s = this.options,
                { x: n, y: o } = this.getProps(["x", "y"], i);
            return Math.pow(t - n, 2) + Math.pow(e - o, 2) < Math.pow(s.hitRadius + s.radius, 2)
        }
        inXRange(t, e) { return eo(this, t, "x", e) }
        inYRange(t, e) { return eo(this, t, "y", e) }
        getCenterPoint(t) { const { x: e, y: i } = this.getProps(["x", "y"], t); return { x: e, y: i } }
        size(t) {
            let e = (t = t || this.options || {}).radius || 0;
            e = Math.max(e, e && t.hoverRadius || 0);
            return 2 * (e + (e && t.borderWidth || 0))
        }
        draw(t, e) {
            const i = this.options;
            this.skip || i.radius < .1 || !Se(this, e, this.size(i) / 2) || (t.strokeStyle = i.borderColor, t.lineWidth = i.borderWidth, t.fillStyle = i.backgroundColor, Me(t, i, this.x, this.y))
        }
        getRange() { const t = this.options || {}; return t.radius + t.hitRadius }
    }

    function so(t, e) { const { x: i, y: s, base: n, width: o, height: a } = t.getProps(["x", "y", "base", "width", "height"], e); let r, l, h, c, d; return t.horizontal ? (d = a / 2, r = Math.min(i, n), l = Math.max(i, n), h = s - d, c = s + d) : (d = o / 2, r = i - d, l = i + d, h = Math.min(s, n), c = Math.max(s, n)), { left: r, top: h, right: l, bottom: c } }

    function no(t, e, i, s) { return t ? 0 : Z(e, i, s) }

    function oo(t) {
        const e = so(t),
            i = e.right - e.left,
            s = e.bottom - e.top,
            o = function(t, e, i) {
                const s = t.options.borderWidth,
                    n = t.borderSkipped,
                    o = fi(s);
                return { t: no(n.top, o.top, 0, i), r: no(n.right, o.right, 0, e), b: no(n.bottom, o.bottom, 0, i), l: no(n.left, o.left, 0, e) }
            }(t, i / 2, s / 2),
            a = function(t, e, i) { const { enableBorderRadius: s } = t.getProps(["enableBorderRadius"]), o = t.options.borderRadius, a = gi(o), r = Math.min(e, i), l = t.borderSkipped, h = s || n(o); return { topLeft: no(!h || l.top || l.left, a.topLeft, 0, r), topRight: no(!h || l.top || l.right, a.topRight, 0, r), bottomLeft: no(!h || l.bottom || l.left, a.bottomLeft, 0, r), bottomRight: no(!h || l.bottom || l.right, a.bottomRight, 0, r) } }(t, i / 2, s / 2);
        return { outer: { x: e.left, y: e.top, w: i, h: s, radius: a }, inner: { x: e.left + o.l, y: e.top + o.t, w: i - o.l - o.r, h: s - o.t - o.b, radius: { topLeft: Math.max(0, a.topLeft - Math.max(o.t, o.l)), topRight: Math.max(0, a.topRight - Math.max(o.t, o.r)), bottomLeft: Math.max(0, a.bottomLeft - Math.max(o.b, o.l)), bottomRight: Math.max(0, a.bottomRight - Math.max(o.b, o.r)) } } }
    }

    function ao(t, e, i, s) {
        const n = null === e,
            o = null === i,
            a = t && !(n && o) && so(t, s);
        return a && (n || Q(e, a.left, a.right)) && (o || Q(i, a.top, a.bottom))
    }

    function ro(t, e) { t.rect(e.x, e.y, e.w, e.h) }

    function lo(t, e, i = {}) {
        const s = t.x !== i.x ? -e : 0,
            n = t.y !== i.y ? -e : 0,
            o = (t.x + t.w !== i.x + i.w ? e : 0) - s,
            a = (t.y + t.h !== i.y + i.h ? e : 0) - n;
        return { x: t.x + s, y: t.y + n, w: t.w + o, h: t.h + a, radius: t.radius }
    }
    io.id = "point", io.defaults = { borderWidth: 1, hitRadius: 1, hoverBorderWidth: 1, hoverRadius: 4, pointStyle: "circle", radius: 3, rotation: 0 }, io.defaultRoutes = { backgroundColor: "backgroundColor", borderColor: "borderColor" };
    class ho extends Es {
        constructor(t) { super(), this.options = void 0, this.horizontal = void 0, this.base = void 0, this.width = void 0, this.height = void 0, this.inflateAmount = void 0, t && Object.assign(this, t) }
        draw(t) {
            const { inflateAmount: e, options: { borderColor: i, backgroundColor: s } } = this, { inner: n, outer: o } = oo(this), a = (r = o.radius).topLeft || r.topRight || r.bottomLeft || r.bottomRight ? Le : ro;
            var r;
            t.save(), o.w === n.w && o.h === n.h || (t.beginPath(), a(t, lo(o, e, n)), t.clip(), a(t, lo(n, -e, o)), t.fillStyle = i, t.fill("evenodd")), t.beginPath(), a(t, lo(n, e)), t.fillStyle = s, t.fill(), t.restore()
        }
        inRange(t, e, i) { return ao(this, t, e, i) }
        inXRange(t, e) { return ao(this, t, null, e) }
        inYRange(t, e) { return ao(this, null, t, e) }
        getCenterPoint(t) { const { x: e, y: i, base: s, horizontal: n } = this.getProps(["x", "y", "base", "horizontal"], t); return { x: n ? (e + s) / 2 : e, y: n ? i : (i + s) / 2 } }
        getRange(t) { return "x" === t ? this.width / 2 : this.height / 2 }
    }
    ho.id = "bar", ho.defaults = { borderSkipped: "start", borderWidth: 0, borderRadius: 0, inflateAmount: "auto", pointStyle: void 0 }, ho.defaultRoutes = { backgroundColor: "backgroundColor", borderColor: "borderColor" };
    var co = Object.freeze({ __proto__: null, ArcElement: Yn, LineElement: to, PointElement: io, BarElement: ho });

    function uo(t) {
        if (t._decimated) {
            const e = t._data;
            delete t._decimated, delete t._data, Object.defineProperty(t, "data", { value: e })
        }
    }

    function fo(t) { t.data.datasets.forEach((t => { uo(t) })) }
    var go = {
        id: "decimation",
        defaults: { algorithm: "min-max", enabled: !1 },
        beforeElementsUpdate: (t, e, s) => {
            if (!s.enabled) return void fo(t);
            const n = t.width;
            t.data.datasets.forEach(((e, o) => {
                const { _data: a, indexAxis: r } = e, l = t.getDatasetMeta(o), h = a || e.data;
                if ("y" === bi([r, t.options.indexAxis])) return;
                if (!l.controller.supportsDecimation) return;
                const c = t.scales[l.xAxisID];
                if ("linear" !== c.type && "time" !== c.type) return;
                if (t.options.parsing) return;
                let { start: d, count: u } = function(t, e) { const i = e.length; let s, n = 0; const { iScale: o } = t, { min: a, max: r, minDefined: l, maxDefined: h } = o.getUserBounds(); return l && (n = Z(et(e, o.axis, a).lo, 0, i - 1)), s = h ? Z(et(e, o.axis, r).hi + 1, n, i) - n : i - n, { start: n, count: s } }(l, h);
                if (u <= (s.threshold || 4 * n)) return void uo(e);
                let f;
                switch (i(a) && (e._data = h, delete e.data, Object.defineProperty(e, "data", { configurable: !0, enumerable: !0, get: function() { return this._decimated }, set: function(t) { this._data = t } })), s.algorithm) {
                    case "lttb":
                        f = function(t, e, i, s, n) {
                            const o = n.samples || s;
                            if (o >= i) return t.slice(e, e + i);
                            const a = [],
                                r = (i - 2) / (o - 2);
                            let l = 0;
                            const h = e + i - 1;
                            let c, d, u, f, g, p = e;
                            for (a[l++] = t[p], c = 0; c < o - 2; c++) {
                                let s, n = 0,
                                    o = 0;
                                const h = Math.floor((c + 1) * r) + 1 + e,
                                    m = Math.min(Math.floor((c + 2) * r) + 1, i) + e,
                                    b = m - h;
                                for (s = h; s < m; s++) n += t[s].x, o += t[s].y;
                                n /= b, o /= b;
                                const x = Math.floor(c * r) + 1 + e,
                                    _ = Math.min(Math.floor((c + 1) * r) + 1, i) + e,
                                    { x: y, y: v } = t[p];
                                for (u = f = -1, s = x; s < _; s++) f = .5 * Math.abs((y - n) * (t[s].y - v) - (y - t[s].x) * (o - v)), f > u && (u = f, d = t[s], g = s);
                                a[l++] = d, p = g
                            }
                            return a[l++] = t[h], a
                        }(h, d, u, n, s);
                        break;
                    case "min-max":
                        f = function(t, e, s, n) {
                            let o, a, r, l, h, c, d, u, f, g, p = 0,
                                m = 0;
                            const b = [],
                                x = e + s - 1,
                                _ = t[e].x,
                                y = t[x].x - _;
                            for (o = e; o < e + s; ++o) {
                                a = t[o], r = (a.x - _) / y * n, l = a.y;
                                const e = 0 | r;
                                if (e === h) l < f ? (f = l, c = o) : l > g && (g = l, d = o), p = (m * p + a.x) / ++m;
                                else {
                                    const s = o - 1;
                                    if (!i(c) && !i(d)) {
                                        const e = Math.min(c, d),
                                            i = Math.max(c, d);
                                        e !== u && e !== s && b.push({...t[e], x: p }), i !== u && i !== s && b.push({...t[i], x: p })
                                    }
                                    o > 0 && s !== u && b.push(t[s]), b.push(a), h = e, m = 0, f = g = l, c = d = u = o
                                }
                            }
                            return b
                        }(h, d, u, n);
                        break;
                    default:
                        throw new Error(`Unsupported decimation algorithm '${s.algorithm}'`)
                }
                e._decimated = f
            }))
        },
        destroy(t) { fo(t) }
    };

    function po(t, e, i, s) {
        if (s) return;
        let n = e[t],
            o = i[t];
        return "angle" === t && (n = K(n), o = K(o)), { property: t, start: n, end: o }
    }

    function mo(t, e, i) { for (; e > t; e--) { const t = i[e]; if (!isNaN(t.x) && !isNaN(t.y)) break } return e }

    function bo(t, e, i, s) { return t && e ? s(t[i], e[i]) : t ? t[i] : e ? e[i] : 0 }

    function xo(t, e) {
        let i = [],
            n = !1;
        return s(t) ? (n = !0, i = t) : i = function(t, e) {
            const { x: i = null, y: s = null } = t || {}, n = e.points, o = [];
            return e.segments.forEach((({ start: t, end: e }) => {
                e = mo(t, e, n);
                const a = n[t],
                    r = n[e];
                null !== s ? (o.push({ x: a.x, y: s }), o.push({ x: r.x, y: s })) : null !== i && (o.push({ x: i, y: a.y }), o.push({ x: i, y: r.y }))
            })), o
        }(t, e), i.length ? new to({ points: i, options: { tension: 0 }, _loop: n, _fullLoop: n }) : null
    }

    function _o(t) { return t && !1 !== t.fill }

    function yo(t, e, i) {
        let s = t[e].fill;
        const n = [e];
        let a;
        if (!i) return s;
        for (; !1 !== s && -1 === n.indexOf(s);) {
            if (!o(s)) return s;
            if (a = t[s], !a) return !1;
            if (a.visible) return s;
            n.push(s), s = a.fill
        }
        return !1
    }

    function vo(t, e, i) {
        const s = function(t) {
            const e = t.options,
                i = e.fill;
            let s = r(i && i.target, i);
            void 0 === s && (s = !!e.backgroundColor);
            if (!1 === s || null === s) return !1;
            if (!0 === s) return "origin";
            return s
        }(t);
        if (n(s)) return !isNaN(s.value) && s;
        let a = parseFloat(s);
        return o(a) && Math.floor(a) === a ? function(t, e, i, s) { "-" !== t && "+" !== t || (i = e + i); if (i === e || i < 0 || i >= s) return !1; return i }(s[0], e, a, i) : ["origin", "start", "end", "stack", "shape"].indexOf(s) >= 0 && s
    }

    function wo(t, e, i) {
        const s = [];
        for (let n = 0; n < i.length; n++) {
            const o = i[n],
                { first: a, last: r, point: l } = Mo(o, e, "x");
            if (!(!l || a && r))
                if (a) s.unshift(l);
                else if (t.push(l), !r) break
        }
        t.push(...s)
    }

    function Mo(t, e, i) {
        const s = t.interpolate(e, i);
        if (!s) return {};
        const n = s[i],
            o = t.segments,
            a = t.points;
        let r = !1,
            l = !1;
        for (let t = 0; t < o.length; t++) {
            const e = o[t],
                s = a[e.start][i],
                h = a[e.end][i];
            if (Q(n, s, h)) { r = n === s, l = n === h; break }
        }
        return { first: r, last: l, point: s }
    }
    class ko {
        constructor(t) { this.x = t.x, this.y = t.y, this.radius = t.radius }
        pathSegment(t, e, i) { const { x: s, y: n, radius: o } = this; return e = e || { start: 0, end: O }, t.arc(s, n, o, e.end, e.start, !0), !i.bounds }
        interpolate(t) { const { x: e, y: i, radius: s } = this, n = t.angle; return { x: e + Math.cos(n) * s, y: i + Math.sin(n) * s, angle: n } }
    }

    function So(t) {
        const { chart: e, fill: i, line: s } = t;
        if (o(i)) return function(t, e) { const i = t.getDatasetMeta(e); return i && t.isDatasetVisible(e) ? i.dataset : null }(e, i);
        if ("stack" === i) return function(t) {
            const { scale: e, index: i, line: s } = t, n = [], o = s.segments, a = s.points, r = function(t, e) {
                const i = [],
                    s = t.getMatchingVisibleMetas("line");
                for (let t = 0; t < s.length; t++) {
                    const n = s[t];
                    if (n.index === e) break;
                    n.hidden || i.unshift(n.dataset)
                }
                return i
            }(e, i);
            r.push(xo({ x: null, y: e.bottom }, s));
            for (let t = 0; t < o.length; t++) { const e = o[t]; for (let t = e.start; t <= e.end; t++) wo(n, a[t], r) }
            return new to({ points: n, options: {} })
        }(t);
        if ("shape" === i) return !0;
        const a = function(t) { if ((t.scale || {}).getPointPositionForValue) return function(t) { const { scale: e, fill: i } = t, s = e.options, o = e.getLabels().length, a = s.reverse ? e.max : e.min, r = function(t, e, i) { let s; return s = "start" === t ? i : "end" === t ? e.options.reverse ? e.min : e.max : n(t) ? t.value : e.getBaseValue(), s }(i, e, a), l = []; if (s.grid.circular) { const t = e.getPointPositionForValue(0, a); return new ko({ x: t.x, y: t.y, radius: e.getDistanceFromCenterForValue(r) }) } for (let t = 0; t < o; ++t) l.push(e.getPointPositionForValue(t, r)); return l }(t); return function(t) { const { scale: e = {}, fill: i } = t, s = function(t, e) { let i = null; return "start" === t ? i = e.bottom : "end" === t ? i = e.top : n(t) ? i = e.getPixelForValue(t.value) : e.getBasePixel && (i = e.getBasePixel()), i }(i, e); if (o(s)) { const t = e.isHorizontal(); return { x: t ? s : null, y: t ? null : s } } return null }(t) }(t);
        return a instanceof ko ? a : xo(a, s)
    }

    function Po(t, e, i) {
        const s = So(e),
            { line: n, scale: o, axis: a } = e,
            r = n.options,
            l = r.fill,
            h = r.backgroundColor,
            { above: c = h, below: d = h } = l || {};
        s && n.points.length && (Pe(t, i), function(t, e) {
            const { line: i, target: s, above: n, below: o, area: a, scale: r } = e, l = i._loop ? "angle" : e.axis;
            t.save(), "x" === l && o !== n && (Do(t, s, a.top), Oo(t, { line: i, target: s, color: n, scale: r, property: l }), t.restore(), t.save(), Do(t, s, a.bottom));
            Oo(t, { line: i, target: s, color: o, scale: r, property: l }), t.restore()
        }(t, { line: n, target: s, above: c, below: d, area: i, scale: o, axis: a }), De(t))
    }

    function Do(t, e, i) {
        const { segments: s, points: n } = e;
        let o = !0,
            a = !1;
        t.beginPath();
        for (const r of s) {
            const { start: s, end: l } = r, h = n[s], c = n[mo(s, l, n)];
            o ? (t.moveTo(h.x, h.y), o = !1) : (t.lineTo(h.x, i), t.lineTo(h.x, h.y)), a = !!e.pathSegment(t, r, { move: a }), a ? t.closePath() : t.lineTo(c.x, i)
        }
        t.lineTo(e.first().x, i), t.closePath(), t.clip()
    }

    function Oo(t, e) {
        const { line: i, target: s, property: n, color: o, scale: a } = e, r = function(t, e, i) {
            const s = t.segments,
                n = t.points,
                o = e.points,
                a = [];
            for (const t of s) {
                let { start: s, end: r } = t;
                r = mo(s, r, n);
                const l = po(i, n[s], n[r], t.loop);
                if (!e.segments) { a.push({ source: t, target: l, start: n[s], end: n[r] }); continue }
                const h = Pi(e, l);
                for (const e of h) {
                    const s = po(i, o[e.start], o[e.end], e.loop),
                        r = Si(t, n, s);
                    for (const t of r) a.push({
                        source: t,
                        target: e,
                        start: {
                            [i]: bo(l, s, "start", Math.max)
                        },
                        end: {
                            [i]: bo(l, s, "end", Math.min)
                        }
                    })
                }
            }
            return a
        }(i, s, n);
        for (const { source: e, target: l, start: h, end: c }
            of r) {
            const { style: { backgroundColor: r = o } = {} } = e, d = !0 !== s;
            t.save(), t.fillStyle = r, Co(t, a, d && po(n, h, c)), t.beginPath();
            const u = !!i.pathSegment(t, e);
            let f;
            if (d) {
                u ? t.closePath() : Ao(t, s, c, n);
                const e = !!s.pathSegment(t, l, { move: u, reverse: !0 });
                f = u && e, f || Ao(t, s, h, n)
            }
            t.closePath(), t.fill(f ? "evenodd" : "nonzero"), t.restore()
        }
    }

    function Co(t, e, i) { const { top: s, bottom: n } = e.chart.chartArea, { property: o, start: a, end: r } = i || {}; "x" === o && (t.beginPath(), t.rect(a, s, r - a, n - s), t.clip()) }

    function Ao(t, e, i, s) {
        const n = e.interpolate(i, s);
        n && t.lineTo(n.x, n.y)
    }
    var To = {
        id: "filler",
        afterDatasetsUpdate(t, e, i) {
            const s = (t.data.datasets || []).length,
                n = [];
            let o, a, r, l;
            for (a = 0; a < s; ++a) o = t.getDatasetMeta(a), r = o.dataset, l = null, r && r.options && r instanceof to && (l = { visible: t.isDatasetVisible(a), index: a, fill: vo(r, a, s), chart: t, axis: o.controller.options.indexAxis, scale: o.vScale, line: r }), o.$filler = l, n.push(l);
            for (a = 0; a < s; ++a) l = n[a], l && !1 !== l.fill && (l.fill = yo(n, a, i.propagate))
        },
        beforeDraw(t, e, i) {
            const s = "beforeDraw" === i.drawTime,
                n = t.getSortedVisibleDatasetMetas(),
                o = t.chartArea;
            for (let e = n.length - 1; e >= 0; --e) {
                const i = n[e].$filler;
                i && (i.line.updateControlPoints(o, i.axis), s && i.fill && Po(t.ctx, i, o))
            }
        },
        beforeDatasetsDraw(t, e, i) {
            if ("beforeDatasetsDraw" !== i.drawTime) return;
            const s = t.getSortedVisibleDatasetMetas();
            for (let e = s.length - 1; e >= 0; --e) {
                const i = s[e].$filler;
                _o(i) && Po(t.ctx, i, t.chartArea)
            }
        },
        beforeDatasetDraw(t, e, i) {
            const s = e.meta.$filler;
            _o(s) && "beforeDatasetDraw" === i.drawTime && Po(t.ctx, s, t.chartArea)
        },
        defaults: { propagate: !0, drawTime: "beforeDatasetDraw" }
    };
    const Lo = (t, e) => { let { boxHeight: i = e, boxWidth: s = e } = t; return t.usePointStyle && (i = Math.min(i, e), s = t.pointStyleWidth || Math.min(s, e)), { boxWidth: s, boxHeight: i, itemHeight: Math.max(e, i) } };
    class Eo extends Es {
        constructor(t) { super(), this._added = !1, this.legendHitBoxes = [], this._hoveredItem = null, this.doughnutMode = !1, this.chart = t.chart, this.options = t.options, this.ctx = t.ctx, this.legendItems = void 0, this.columnSizes = void 0, this.lineWidths = void 0, this.maxHeight = void 0, this.maxWidth = void 0, this.top = void 0, this.bottom = void 0, this.left = void 0, this.right = void 0, this.height = void 0, this.width = void 0, this._margins = void 0, this.position = void 0, this.weight = void 0, this.fullSize = void 0 }
        update(t, e, i) { this.maxWidth = t, this.maxHeight = e, this._margins = i, this.setDimensions(), this.buildLabels(), this.fit() }
        setDimensions() { this.isHorizontal() ? (this.width = this.maxWidth, this.left = this._margins.left, this.right = this.width) : (this.height = this.maxHeight, this.top = this._margins.top, this.bottom = this.height) }
        buildLabels() {
            const t = this.options.labels || {};
            let e = c(t.generateLabels, [this.chart], this) || [];
            t.filter && (e = e.filter((e => t.filter(e, this.chart.data)))), t.sort && (e = e.sort(((e, i) => t.sort(e, i, this.chart.data)))), this.options.reverse && e.reverse(), this.legendItems = e
        }
        fit() {
            const { options: t, ctx: e } = this;
            if (!t.display) return void(this.width = this.height = 0);
            const i = t.labels,
                s = mi(i.font),
                n = s.size,
                o = this._computeTitleHeight(),
                { boxWidth: a, itemHeight: r } = Lo(i, n);
            let l, h;
            e.font = s.string, this.isHorizontal() ? (l = this.maxWidth, h = this._fitRows(o, n, a, r) + 10) : (h = this.maxHeight, l = this._fitCols(o, n, a, r) + 10), this.width = Math.min(l, t.maxWidth || this.maxWidth), this.height = Math.min(h, t.maxHeight || this.maxHeight)
        }
        _fitRows(t, e, i, s) {
            const { ctx: n, maxWidth: o, options: { labels: { padding: a } } } = this, r = this.legendHitBoxes = [], l = this.lineWidths = [0], h = s + a;
            let c = t;
            n.textAlign = "left", n.textBaseline = "middle";
            let d = -1,
                u = -h;
            return this.legendItems.forEach(((t, f) => {
                const g = i + e / 2 + n.measureText(t.text).width;
                (0 === f || l[l.length - 1] + g + 2 * a > o) && (c += h, l[l.length - (f > 0 ? 0 : 1)] = 0, u += h, d++), r[f] = { left: 0, top: u, row: d, width: g, height: s }, l[l.length - 1] += g + a
            })), c
        }
        _fitCols(t, e, i, s) {
            const { ctx: n, maxHeight: o, options: { labels: { padding: a } } } = this, r = this.legendHitBoxes = [], l = this.columnSizes = [], h = o - t;
            let c = a,
                d = 0,
                u = 0,
                f = 0,
                g = 0;
            return this.legendItems.forEach(((t, o) => {
                const p = i + e / 2 + n.measureText(t.text).width;
                o > 0 && u + s + 2 * a > h && (c += d + a, l.push({ width: d, height: u }), f += d + a, g++, d = u = 0), r[o] = { left: f, top: u, col: g, width: p, height: s }, d = Math.max(d, p), u += s + a
            })), c += d, l.push({ width: d, height: u }), c
        }
        adjustHitBoxes() {
            if (!this.options.display) return;
            const t = this._computeTitleHeight(),
                { legendHitBoxes: e, options: { align: i, labels: { padding: s }, rtl: n } } = this,
                o = yi(n, this.left, this.width);
            if (this.isHorizontal()) {
                let n = 0,
                    a = ut(i, this.left + s, this.right - this.lineWidths[n]);
                for (const r of e) n !== r.row && (n = r.row, a = ut(i, this.left + s, this.right - this.lineWidths[n])), r.top += this.top + t + s, r.left = o.leftForLtr(o.x(a), r.width), a += r.width + s
            } else {
                let n = 0,
                    a = ut(i, this.top + t + s, this.bottom - this.columnSizes[n].height);
                for (const r of e) r.col !== n && (n = r.col, a = ut(i, this.top + t + s, this.bottom - this.columnSizes[n].height)), r.top = a, r.left += this.left + s, r.left = o.leftForLtr(o.x(r.left), r.width), a += r.height + s
            }
        }
        isHorizontal() { return "top" === this.options.position || "bottom" === this.options.position }
        draw() {
            if (this.options.display) {
                const t = this.ctx;
                Pe(t, this), this._draw(), De(t)
            }
        }
        _draw() {
            const { options: t, columnSizes: e, lineWidths: i, ctx: s } = this, { align: n, labels: o } = t, a = ne.color, l = yi(t.rtl, this.left, this.width), h = mi(o.font), { color: c, padding: d } = o, u = h.size, f = u / 2;
            let g;
            this.drawTitle(), s.textAlign = l.textAlign("left"), s.textBaseline = "middle", s.lineWidth = .5, s.font = h.string;
            const { boxWidth: p, boxHeight: m, itemHeight: b } = Lo(o, u), x = this.isHorizontal(), _ = this._computeTitleHeight();
            g = x ? { x: ut(n, this.left + d, this.right - i[0]), y: this.top + d + _, line: 0 } : { x: this.left + d, y: ut(n, this.top + _ + d, this.bottom - e[0].height), line: 0 }, vi(this.ctx, t.textDirection);
            const y = b + d;
            this.legendItems.forEach(((v, w) => {
                s.strokeStyle = v.fontColor || c, s.fillStyle = v.fontColor || c;
                const M = s.measureText(v.text).width,
                    k = l.textAlign(v.textAlign || (v.textAlign = o.textAlign)),
                    S = p + f + M;
                let P = g.x,
                    D = g.y;
                l.setWidth(this.width), x ? w > 0 && P + S + d > this.right && (D = g.y += y, g.line++, P = g.x = ut(n, this.left + d, this.right - i[g.line])) : w > 0 && D + y > this.bottom && (P = g.x = P + e[g.line].width + d, g.line++, D = g.y = ut(n, this.top + _ + d, this.bottom - e[g.line].height));
                ! function(t, e, i) {
                    if (isNaN(p) || p <= 0 || isNaN(m) || m < 0) return;
                    s.save();
                    const n = r(i.lineWidth, 1);
                    if (s.fillStyle = r(i.fillStyle, a), s.lineCap = r(i.lineCap, "butt"), s.lineDashOffset = r(i.lineDashOffset, 0), s.lineJoin = r(i.lineJoin, "miter"), s.lineWidth = n, s.strokeStyle = r(i.strokeStyle, a), s.setLineDash(r(i.lineDash, [])), o.usePointStyle) {
                        const a = { radius: m * Math.SQRT2 / 2, pointStyle: i.pointStyle, rotation: i.rotation, borderWidth: n },
                            r = l.xPlus(t, p / 2);
                        ke(s, a, r, e + f, o.pointStyleWidth && p)
                    } else {
                        const o = e + Math.max((u - m) / 2, 0),
                            a = l.leftForLtr(t, p),
                            r = gi(i.borderRadius);
                        s.beginPath(), Object.values(r).some((t => 0 !== t)) ? Le(s, { x: a, y: o, w: p, h: m, radius: r }) : s.rect(a, o, p, m), s.fill(), 0 !== n && s.stroke()
                    }
                    s.restore()
                }(l.x(P), D, v), P = ft(k, P + p + f, x ? P + S : this.right, t.rtl),
                    function(t, e, i) { Ae(s, i.text, t, e + b / 2, h, { strikethrough: i.hidden, textAlign: l.textAlign(i.textAlign) }) }(l.x(P), D, v), x ? g.x += S + d : g.y += y
            })), wi(this.ctx, t.textDirection)
        }
        drawTitle() {
            const t = this.options,
                e = t.title,
                i = mi(e.font),
                s = pi(e.padding);
            if (!e.display) return;
            const n = yi(t.rtl, this.left, this.width),
                o = this.ctx,
                a = e.position,
                r = i.size / 2,
                l = s.top + r;
            let h, c = this.left,
                d = this.width;
            if (this.isHorizontal()) d = Math.max(...this.lineWidths), h = this.top + l, c = ut(t.align, c, this.right - d);
            else {
                const e = this.columnSizes.reduce(((t, e) => Math.max(t, e.height)), 0);
                h = l + ut(t.align, this.top, this.bottom - e - t.labels.padding - this._computeTitleHeight())
            }
            const u = ut(a, c, c + d);
            o.textAlign = n.textAlign(dt(a)), o.textBaseline = "middle", o.strokeStyle = e.color, o.fillStyle = e.color, o.font = i.string, Ae(o, e.text, u, h, i)
        }
        _computeTitleHeight() {
            const t = this.options.title,
                e = mi(t.font),
                i = pi(t.padding);
            return t.display ? e.lineHeight + i.height : 0
        }
        _getLegendItemAt(t, e) {
            let i, s, n;
            if (Q(t, this.left, this.right) && Q(e, this.top, this.bottom))
                for (n = this.legendHitBoxes, i = 0; i < n.length; ++i)
                    if (s = n[i], Q(t, s.left, s.left + s.width) && Q(e, s.top, s.top + s.height)) return this.legendItems[i];
            return null
        }
        handleEvent(t) {
            const e = this.options;
            if (! function(t, e) { if (("mousemove" === t || "mouseout" === t) && (e.onHover || e.onLeave)) return !0; if (e.onClick && ("click" === t || "mouseup" === t)) return !0; return !1 }(t.type, e)) return;
            const i = this._getLegendItemAt(t.x, t.y);
            if ("mousemove" === t.type || "mouseout" === t.type) {
                const o = this._hoveredItem,
                    a = (n = i, null !== (s = o) && null !== n && s.datasetIndex === n.datasetIndex && s.index === n.index);
                o && !a && c(e.onLeave, [t, o, this], this), this._hoveredItem = i, i && !a && c(e.onHover, [t, i, this], this)
            } else i && c(e.onClick, [t, i, this], this);
            var s, n
        }
    }
    var Ro = {
        id: "legend",
        _element: Eo,
        start(t, e, i) {
            const s = t.legend = new Eo({ ctx: t.ctx, options: i, chart: t });
            Zi.configure(t, s, i), Zi.addBox(t, s)
        },
        stop(t) { Zi.removeBox(t, t.legend), delete t.legend },
        beforeUpdate(t, e, i) {
            const s = t.legend;
            Zi.configure(t, s, i), s.options = i
        },
        afterUpdate(t) {
            const e = t.legend;
            e.buildLabels(), e.adjustHitBoxes()
        },
        afterEvent(t, e) { e.replay || t.legend.handleEvent(e.event) },
        defaults: {
            display: !0,
            position: "top",
            align: "center",
            fullSize: !0,
            reverse: !1,
            weight: 1e3,
            onClick(t, e, i) {
                const s = e.datasetIndex,
                    n = i.chart;
                n.isDatasetVisible(s) ? (n.hide(s), e.hidden = !0) : (n.show(s), e.hidden = !1)
            },
            onHover: null,
            onLeave: null,
            labels: {
                color: t => t.chart.options.color,
                boxWidth: 40,
                padding: 10,
                generateLabels(t) {
                    const e = t.data.datasets,
                        { labels: { usePointStyle: i, pointStyle: s, textAlign: n, color: o } } = t.legend.options;
                    return t._getSortedDatasetMetas().map((t => {
                        const a = t.controller.getStyle(i ? 0 : void 0),
                            r = pi(a.borderWidth);
                        return { text: e[t.index].label, fillStyle: a.backgroundColor, fontColor: o, hidden: !t.visible, lineCap: a.borderCapStyle, lineDash: a.borderDash, lineDashOffset: a.borderDashOffset, lineJoin: a.borderJoinStyle, lineWidth: (r.width + r.height) / 4, strokeStyle: a.borderColor, pointStyle: s || a.pointStyle, rotation: a.rotation, textAlign: n || a.textAlign, borderRadius: 0, datasetIndex: t.index }
                    }), this)
                }
            },
            title: { color: t => t.chart.options.color, display: !1, position: "center", text: "" }
        },
        descriptors: { _scriptable: t => !t.startsWith("on"), labels: { _scriptable: t => !["generateLabels", "filter", "sort"].includes(t) } }
    };
    class Io extends Es {
        constructor(t) { super(), this.chart = t.chart, this.options = t.options, this.ctx = t.ctx, this._padding = void 0, this.top = void 0, this.bottom = void 0, this.left = void 0, this.right = void 0, this.width = void 0, this.height = void 0, this.position = void 0, this.weight = void 0, this.fullSize = void 0 }
        update(t, e) {
            const i = this.options;
            if (this.left = 0, this.top = 0, !i.display) return void(this.width = this.height = this.right = this.bottom = 0);
            this.width = this.right = t, this.height = this.bottom = e;
            const n = s(i.text) ? i.text.length : 1;
            this._padding = pi(i.padding);
            const o = n * mi(i.font).lineHeight + this._padding.height;
            this.isHorizontal() ? this.height = o : this.width = o
        }
        isHorizontal() { const t = this.options.position; return "top" === t || "bottom" === t }
        _drawArgs(t) { const { top: e, left: i, bottom: s, right: n, options: o } = this, a = o.align; let r, l, h, c = 0; return this.isHorizontal() ? (l = ut(a, i, n), h = e + t, r = n - i) : ("left" === o.position ? (l = i + t, h = ut(a, s, e), c = -.5 * D) : (l = n - t, h = ut(a, e, s), c = .5 * D), r = s - e), { titleX: l, titleY: h, maxWidth: r, rotation: c } }
        draw() {
            const t = this.ctx,
                e = this.options;
            if (!e.display) return;
            const i = mi(e.font),
                s = i.lineHeight / 2 + this._padding.top,
                { titleX: n, titleY: o, maxWidth: a, rotation: r } = this._drawArgs(s);
            Ae(t, e.text, 0, 0, i, { color: e.color, maxWidth: a, rotation: r, textAlign: dt(e.align), textBaseline: "middle", translation: [n, o] })
        }
    }
    var zo = {
        id: "title",
        _element: Io,
        start(t, e, i) {
            ! function(t, e) {
                const i = new Io({ ctx: t.ctx, options: e, chart: t });
                Zi.configure(t, i, e), Zi.addBox(t, i), t.titleBlock = i
            }(t, i)
        },
        stop(t) {
            const e = t.titleBlock;
            Zi.removeBox(t, e), delete t.titleBlock
        },
        beforeUpdate(t, e, i) {
            const s = t.titleBlock;
            Zi.configure(t, s, i), s.options = i
        },
        defaults: { align: "center", display: !1, font: { weight: "bold" }, fullSize: !0, padding: 10, position: "top", text: "", weight: 2e3 },
        defaultRoutes: { color: "color" },
        descriptors: { _scriptable: !0, _indexable: !1 }
    };
    const Fo = new WeakMap;
    var Vo = {
        id: "subtitle",
        start(t, e, i) {
            const s = new Io({ ctx: t.ctx, options: i, chart: t });
            Zi.configure(t, s, i), Zi.addBox(t, s), Fo.set(t, s)
        },
        stop(t) { Zi.removeBox(t, Fo.get(t)), Fo.delete(t) },
        beforeUpdate(t, e, i) {
            const s = Fo.get(t);
            Zi.configure(t, s, i), s.options = i
        },
        defaults: { align: "center", display: !1, font: { weight: "normal" }, fullSize: !0, padding: 0, position: "top", text: "", weight: 1500 },
        defaultRoutes: { color: "color" },
        descriptors: { _scriptable: !0, _indexable: !1 }
    };
    const Bo = {
        average(t) {
            if (!t.length) return !1;
            let e, i, s = 0,
                n = 0,
                o = 0;
            for (e = 0, i = t.length; e < i; ++e) {
                const i = t[e].element;
                if (i && i.hasValue()) {
                    const t = i.tooltipPosition();
                    s += t.x, n += t.y, ++o
                }
            }
            return { x: s / o, y: n / o }
        },
        nearest(t, e) {
            if (!t.length) return !1;
            let i, s, n, o = e.x,
                a = e.y,
                r = Number.POSITIVE_INFINITY;
            for (i = 0, s = t.length; i < s; ++i) {
                const s = t[i].element;
                if (s && s.hasValue()) {
                    const t = X(e, s.getCenterPoint());
                    t < r && (r = t, n = s)
                }
            }
            if (n) {
                const t = n.tooltipPosition();
                o = t.x, a = t.y
            }
            return { x: o, y: a }
        }
    };

    function No(t, e) { return e && (s(e) ? Array.prototype.push.apply(t, e) : t.push(e)), t }

    function Wo(t) { return ("string" == typeof t || t instanceof String) && t.indexOf("\n") > -1 ? t.split("\n") : t }

    function jo(t, e) { const { element: i, datasetIndex: s, index: n } = e, o = t.getDatasetMeta(s).controller, { label: a, value: r } = o.getLabelAndValue(n); return { chart: t, label: a, parsed: o.getParsed(n), raw: t.data.datasets[s].data[n], formattedValue: r, dataset: o.getDataset(), dataIndex: n, datasetIndex: s, element: i } }

    function Ho(t, e) {
        const i = t.chart.ctx,
            { body: s, footer: n, title: o } = t,
            { boxWidth: a, boxHeight: r } = e,
            l = mi(e.bodyFont),
            h = mi(e.titleFont),
            c = mi(e.footerFont),
            u = o.length,
            f = n.length,
            g = s.length,
            p = pi(e.padding);
        let m = p.height,
            b = 0,
            x = s.reduce(((t, e) => t + e.before.length + e.lines.length + e.after.length), 0);
        if (x += t.beforeBody.length + t.afterBody.length, u && (m += u * h.lineHeight + (u - 1) * e.titleSpacing + e.titleMarginBottom), x) { m += g * (e.displayColors ? Math.max(r, l.lineHeight) : l.lineHeight) + (x - g) * l.lineHeight + (x - 1) * e.bodySpacing }
        f && (m += e.footerMarginTop + f * c.lineHeight + (f - 1) * e.footerSpacing);
        let _ = 0;
        const y = function(t) { b = Math.max(b, i.measureText(t).width + _) };
        return i.save(), i.font = h.string, d(t.title, y), i.font = l.string, d(t.beforeBody.concat(t.afterBody), y), _ = e.displayColors ? a + 2 + e.boxPadding : 0, d(s, (t => { d(t.before, y), d(t.lines, y), d(t.after, y) })), _ = 0, i.font = c.string, d(t.footer, y), i.restore(), b += p.width, { width: b, height: m }
    }

    function $o(t, e, i, s) {
        const { x: n, width: o } = i, { width: a, chartArea: { left: r, right: l } } = t;
        let h = "center";
        return "center" === s ? h = n <= (r + l) / 2 ? "left" : "right" : n <= o / 2 ? h = "left" : n >= a - o / 2 && (h = "right"),
            function(t, e, i, s) { const { x: n, width: o } = s, a = i.caretSize + i.caretPadding; return "left" === t && n + o + a > e.width || "right" === t && n - o - a < 0 || void 0 }(h, t, e, i) && (h = "center"), h
    }

    function Yo(t, e, i) { const s = i.yAlign || e.yAlign || function(t, e) { const { y: i, height: s } = e; return i < s / 2 ? "top" : i > t.height - s / 2 ? "bottom" : "center" }(t, i); return { xAlign: i.xAlign || e.xAlign || $o(t, e, i, s), yAlign: s } }

    function Uo(t, e, i, s) { const { caretSize: n, caretPadding: o, cornerRadius: a } = t, { xAlign: r, yAlign: l } = i, h = n + o, { topLeft: c, topRight: d, bottomLeft: u, bottomRight: f } = gi(a); let g = function(t, e) { let { x: i, width: s } = t; return "right" === e ? i -= s : "center" === e && (i -= s / 2), i }(e, r); const p = function(t, e, i) { let { y: s, height: n } = t; return "top" === e ? s += i : s -= "bottom" === e ? n + i : n / 2, s }(e, l, h); return "center" === l ? "left" === r ? g += h : "right" === r && (g -= h) : "left" === r ? g -= Math.max(c, u) + n : "right" === r && (g += Math.max(d, f) + n), { x: Z(g, 0, s.width - e.width), y: Z(p, 0, s.height - e.height) } }

    function Xo(t, e, i) { const s = pi(i.padding); return "center" === e ? t.x + t.width / 2 : "right" === e ? t.x + t.width - s.right : t.x + s.left }

    function qo(t) { return No([], Wo(t)) }

    function Ko(t, e) { const i = e && e.dataset && e.dataset.tooltip && e.dataset.tooltip.callbacks; return i ? t.override(i) : t }
    class Go extends Es {
        constructor(t) { super(), this.opacity = 0, this._active = [], this._eventPosition = void 0, this._size = void 0, this._cachedAnimations = void 0, this._tooltipItems = [], this.$animations = void 0, this.$context = void 0, this.chart = t.chart || t._chart, this._chart = this.chart, this.options = t.options, this.dataPoints = void 0, this.title = void 0, this.beforeBody = void 0, this.body = void 0, this.afterBody = void 0, this.footer = void 0, this.xAlign = void 0, this.yAlign = void 0, this.x = void 0, this.y = void 0, this.height = void 0, this.width = void 0, this.caretX = void 0, this.caretY = void 0, this.labelColors = void 0, this.labelPointStyles = void 0, this.labelTextColors = void 0 }
        initialize(t) { this.options = t, this._cachedAnimations = void 0, this.$context = void 0 }
        _resolveAnimations() {
            const t = this._cachedAnimations;
            if (t) return t;
            const e = this.chart,
                i = this.options.setContext(this.getContext()),
                s = i.enabled && e.options.animation && i.animations,
                n = new ys(this.chart, s);
            return s._cacheable && (this._cachedAnimations = Object.freeze(n)), n
        }
        getContext() { return this.$context || (this.$context = (t = this.chart.getContext(), e = this, i = this._tooltipItems, _i(t, { tooltip: e, tooltipItems: i, type: "tooltip" }))); var t, e, i }
        getTitle(t, e) { const { callbacks: i } = e, s = i.beforeTitle.apply(this, [t]), n = i.title.apply(this, [t]), o = i.afterTitle.apply(this, [t]); let a = []; return a = No(a, Wo(s)), a = No(a, Wo(n)), a = No(a, Wo(o)), a }
        getBeforeBody(t, e) { return qo(e.callbacks.beforeBody.apply(this, [t])) }
        getBody(t, e) {
            const { callbacks: i } = e, s = [];
            return d(t, (t => {
                const e = { before: [], lines: [], after: [] },
                    n = Ko(i, t);
                No(e.before, Wo(n.beforeLabel.call(this, t))), No(e.lines, n.label.call(this, t)), No(e.after, Wo(n.afterLabel.call(this, t))), s.push(e)
            })), s
        }
        getAfterBody(t, e) { return qo(e.callbacks.afterBody.apply(this, [t])) }
        getFooter(t, e) { const { callbacks: i } = e, s = i.beforeFooter.apply(this, [t]), n = i.footer.apply(this, [t]), o = i.afterFooter.apply(this, [t]); let a = []; return a = No(a, Wo(s)), a = No(a, Wo(n)), a = No(a, Wo(o)), a }
        _createItems(t) {
            const e = this._active,
                i = this.chart.data,
                s = [],
                n = [],
                o = [];
            let a, r, l = [];
            for (a = 0, r = e.length; a < r; ++a) l.push(jo(this.chart, e[a]));
            return t.filter && (l = l.filter(((e, s, n) => t.filter(e, s, n, i)))), t.itemSort && (l = l.sort(((e, s) => t.itemSort(e, s, i)))), d(l, (e => {
                const i = Ko(t.callbacks, e);
                s.push(i.labelColor.call(this, e)), n.push(i.labelPointStyle.call(this, e)), o.push(i.labelTextColor.call(this, e))
            })), this.labelColors = s, this.labelPointStyles = n, this.labelTextColors = o, this.dataPoints = l, l
        }
        update(t, e) {
            const i = this.options.setContext(this.getContext()),
                s = this._active;
            let n, o = [];
            if (s.length) {
                const t = Bo[i.position].call(this, s, this._eventPosition);
                o = this._createItems(i), this.title = this.getTitle(o, i), this.beforeBody = this.getBeforeBody(o, i), this.body = this.getBody(o, i), this.afterBody = this.getAfterBody(o, i), this.footer = this.getFooter(o, i);
                const e = this._size = Ho(this, i),
                    a = Object.assign({}, t, e),
                    r = Yo(this.chart, i, a),
                    l = Uo(i, a, r, this.chart);
                this.xAlign = r.xAlign, this.yAlign = r.yAlign, n = { opacity: 1, x: l.x, y: l.y, width: e.width, height: e.height, caretX: t.x, caretY: t.y }
            } else 0 !== this.opacity && (n = { opacity: 0 });
            this._tooltipItems = o, this.$context = void 0, n && this._resolveAnimations().update(this, n), t && i.external && i.external.call(this, { chart: this.chart, tooltip: this, replay: e })
        }
        drawCaret(t, e, i, s) {
            const n = this.getCaretPosition(t, i, s);
            e.lineTo(n.x1, n.y1), e.lineTo(n.x2, n.y2), e.lineTo(n.x3, n.y3)
        }
        getCaretPosition(t, e, i) { const { xAlign: s, yAlign: n } = this, { caretSize: o, cornerRadius: a } = i, { topLeft: r, topRight: l, bottomLeft: h, bottomRight: c } = gi(a), { x: d, y: u } = t, { width: f, height: g } = e; let p, m, b, x, _, y; return "center" === n ? (_ = u + g / 2, "left" === s ? (p = d, m = p - o, x = _ + o, y = _ - o) : (p = d + f, m = p + o, x = _ - o, y = _ + o), b = p) : (m = "left" === s ? d + Math.max(r, h) + o : "right" === s ? d + f - Math.max(l, c) - o : this.caretX, "top" === n ? (x = u, _ = x - o, p = m - o, b = m + o) : (x = u + g, _ = x + o, p = m + o, b = m - o), y = x), { x1: p, x2: m, x3: b, y1: x, y2: _, y3: y } }
        drawTitle(t, e, i) {
            const s = this.title,
                n = s.length;
            let o, a, r;
            if (n) { const l = yi(i.rtl, this.x, this.width); for (t.x = Xo(this, i.titleAlign, i), e.textAlign = l.textAlign(i.titleAlign), e.textBaseline = "middle", o = mi(i.titleFont), a = i.titleSpacing, e.fillStyle = i.titleColor, e.font = o.string, r = 0; r < n; ++r) e.fillText(s[r], l.x(t.x), t.y + o.lineHeight / 2), t.y += o.lineHeight + a, r + 1 === n && (t.y += i.titleMarginBottom - a) }
        }
        _drawColorBox(t, e, i, s, o) {
            const a = this.labelColors[i],
                r = this.labelPointStyles[i],
                { boxHeight: l, boxWidth: h, boxPadding: c } = o,
                d = mi(o.bodyFont),
                u = Xo(this, "left", o),
                f = s.x(u),
                g = l < d.lineHeight ? (d.lineHeight - l) / 2 : 0,
                p = e.y + g;
            if (o.usePointStyle) {
                const e = { radius: Math.min(h, l) / 2, pointStyle: r.pointStyle, rotation: r.rotation, borderWidth: 1 },
                    i = s.leftForLtr(f, h) + h / 2,
                    n = p + l / 2;
                t.strokeStyle = o.multiKeyBackground, t.fillStyle = o.multiKeyBackground, Me(t, e, i, n), t.strokeStyle = a.borderColor, t.fillStyle = a.backgroundColor, Me(t, e, i, n)
            } else {
                t.lineWidth = n(a.borderWidth) ? Math.max(...Object.values(a.borderWidth)) : a.borderWidth || 1, t.strokeStyle = a.borderColor, t.setLineDash(a.borderDash || []), t.lineDashOffset = a.borderDashOffset || 0;
                const e = s.leftForLtr(f, h - c),
                    i = s.leftForLtr(s.xPlus(f, 1), h - c - 2),
                    r = gi(a.borderRadius);
                Object.values(r).some((t => 0 !== t)) ? (t.beginPath(), t.fillStyle = o.multiKeyBackground, Le(t, { x: e, y: p, w: h, h: l, radius: r }), t.fill(), t.stroke(), t.fillStyle = a.backgroundColor, t.beginPath(), Le(t, { x: i, y: p + 1, w: h - 2, h: l - 2, radius: r }), t.fill()) : (t.fillStyle = o.multiKeyBackground, t.fillRect(e, p, h, l), t.strokeRect(e, p, h, l), t.fillStyle = a.backgroundColor, t.fillRect(i, p + 1, h - 2, l - 2))
            }
            t.fillStyle = this.labelTextColors[i]
        }
        drawBody(t, e, i) {
            const { body: s } = this, { bodySpacing: n, bodyAlign: o, displayColors: a, boxHeight: r, boxWidth: l, boxPadding: h } = i, c = mi(i.bodyFont);
            let u = c.lineHeight,
                f = 0;
            const g = yi(i.rtl, this.x, this.width),
                p = function(i) { e.fillText(i, g.x(t.x + f), t.y + u / 2), t.y += u + n },
                m = g.textAlign(o);
            let b, x, _, y, v, w, M;
            for (e.textAlign = o, e.textBaseline = "middle", e.font = c.string, t.x = Xo(this, m, i), e.fillStyle = i.bodyColor, d(this.beforeBody, p), f = a && "right" !== m ? "center" === o ? l / 2 + h : l + 2 + h : 0, y = 0, w = s.length; y < w; ++y) {
                for (b = s[y], x = this.labelTextColors[y], e.fillStyle = x, d(b.before, p), _ = b.lines, a && _.length && (this._drawColorBox(e, t, y, g, i), u = Math.max(c.lineHeight, r)), v = 0, M = _.length; v < M; ++v) p(_[v]), u = c.lineHeight;
                d(b.after, p)
            }
            f = 0, u = c.lineHeight, d(this.afterBody, p), t.y -= n
        }
        drawFooter(t, e, i) {
            const s = this.footer,
                n = s.length;
            let o, a;
            if (n) { const r = yi(i.rtl, this.x, this.width); for (t.x = Xo(this, i.footerAlign, i), t.y += i.footerMarginTop, e.textAlign = r.textAlign(i.footerAlign), e.textBaseline = "middle", o = mi(i.footerFont), e.fillStyle = i.footerColor, e.font = o.string, a = 0; a < n; ++a) e.fillText(s[a], r.x(t.x), t.y + o.lineHeight / 2), t.y += o.lineHeight + i.footerSpacing }
        }
        drawBackground(t, e, i, s) {
            const { xAlign: n, yAlign: o } = this, { x: a, y: r } = t, { width: l, height: h } = i, { topLeft: c, topRight: d, bottomLeft: u, bottomRight: f } = gi(s.cornerRadius);
            e.fillStyle = s.backgroundColor, e.strokeStyle = s.borderColor, e.lineWidth = s.borderWidth, e.beginPath(), e.moveTo(a + c, r), "top" === o && this.drawCaret(t, e, i, s), e.lineTo(a + l - d, r), e.quadraticCurveTo(a + l, r, a + l, r + d), "center" === o && "right" === n && this.drawCaret(t, e, i, s), e.lineTo(a + l, r + h - f), e.quadraticCurveTo(a + l, r + h, a + l - f, r + h), "bottom" === o && this.drawCaret(t, e, i, s), e.lineTo(a + u, r + h), e.quadraticCurveTo(a, r + h, a, r + h - u), "center" === o && "left" === n && this.drawCaret(t, e, i, s), e.lineTo(a, r + c), e.quadraticCurveTo(a, r, a + c, r), e.closePath(), e.fill(), s.borderWidth > 0 && e.stroke()
        }
        _updateAnimationTarget(t) {
            const e = this.chart,
                i = this.$animations,
                s = i && i.x,
                n = i && i.y;
            if (s || n) {
                const i = Bo[t.position].call(this, this._active, this._eventPosition);
                if (!i) return;
                const o = this._size = Ho(this, t),
                    a = Object.assign({}, i, this._size),
                    r = Yo(e, t, a),
                    l = Uo(t, a, r, e);
                s._to === l.x && n._to === l.y || (this.xAlign = r.xAlign, this.yAlign = r.yAlign, this.width = o.width, this.height = o.height, this.caretX = i.x, this.caretY = i.y, this._resolveAnimations().update(this, l))
            }
        }
        _willRender() { return !!this.opacity }
        draw(t) {
            const e = this.options.setContext(this.getContext());
            let i = this.opacity;
            if (!i) return;
            this._updateAnimationTarget(e);
            const s = { width: this.width, height: this.height },
                n = { x: this.x, y: this.y };
            i = Math.abs(i) < .001 ? 0 : i;
            const o = pi(e.padding),
                a = this.title.length || this.beforeBody.length || this.body.length || this.afterBody.length || this.footer.length;
            e.enabled && a && (t.save(), t.globalAlpha = i, this.drawBackground(n, t, s, e), vi(t, e.textDirection), n.y += o.top, this.drawTitle(n, t, e), this.drawBody(n, t, e), this.drawFooter(n, t, e), wi(t, e.textDirection), t.restore())
        }
        getActiveElements() { return this._active || [] }
        setActiveElements(t, e) {
            const i = this._active,
                s = t.map((({ datasetIndex: t, index: e }) => { const i = this.chart.getDatasetMeta(t); if (!i) throw new Error("Cannot find a dataset at index " + t); return { datasetIndex: t, element: i.data[e], index: e } })),
                n = !u(i, s),
                o = this._positionChanged(s, e);
            (n || o) && (this._active = s, this._eventPosition = e, this._ignoreReplayEvents = !0, this.update(!0))
        }
        handleEvent(t, e, i = !0) {
            if (e && this._ignoreReplayEvents) return !1;
            this._ignoreReplayEvents = !1;
            const s = this.options,
                n = this._active || [],
                o = this._getActiveElements(t, n, e, i),
                a = this._positionChanged(o, t),
                r = e || !u(o, n) || a;
            return r && (this._active = o, (s.enabled || s.external) && (this._eventPosition = { x: t.x, y: t.y }, this.update(!0, e))), r
        }
        _getActiveElements(t, e, i, s) { const n = this.options; if ("mouseout" === t.type) return []; if (!s) return e; const o = this.chart.getElementsAtEventForMode(t, n.mode, n, i); return n.reverse && o.reverse(), o }
        _positionChanged(t, e) { const { caretX: i, caretY: s, options: n } = this, o = Bo[n.position].call(this, t, e); return !1 !== o && (i !== o.x || s !== o.y) }
    }
    Go.positioners = Bo;
    var Zo = {
            id: "tooltip",
            _element: Go,
            positioners: Bo,
            afterInit(t, e, i) { i && (t.tooltip = new Go({ chart: t, options: i })) },
            beforeUpdate(t, e, i) { t.tooltip && t.tooltip.initialize(i) },
            reset(t, e, i) { t.tooltip && t.tooltip.initialize(i) },
            afterDraw(t) {
                const e = t.tooltip;
                if (e && e._willRender()) {
                    const i = { tooltip: e };
                    if (!1 === t.notifyPlugins("beforeTooltipDraw", i)) return;
                    e.draw(t.ctx), t.notifyPlugins("afterTooltipDraw", i)
                }
            },
            afterEvent(t, e) {
                if (t.tooltip) {
                    const i = e.replay;
                    t.tooltip.handleEvent(e.event, i, e.inChartArea) && (e.changed = !0)
                }
            },
            defaults: {
                enabled: !0,
                external: null,
                position: "average",
                backgroundColor: "rgba(0,0,0,0.8)",
                titleColor: "#fff",
                titleFont: { weight: "bold" },
                titleSpacing: 2,
                titleMarginBottom: 6,
                titleAlign: "left",
                bodyColor: "#fff",
                bodySpacing: 2,
                bodyFont: {},
                bodyAlign: "left",
                footerColor: "#fff",
                footerSpacing: 2,
                footerMarginTop: 6,
                footerFont: { weight: "bold" },
                footerAlign: "left",
                padding: 6,
                caretPadding: 2,
                caretSize: 5,
                cornerRadius: 6,
                boxHeight: (t, e) => e.bodyFont.size,
                boxWidth: (t, e) => e.bodyFont.size,
                multiKeyBackground: "#fff",
                displayColors: !0,
                boxPadding: 0,
                borderColor: "rgba(0,0,0,0)",
                borderWidth: 0,
                animation: { duration: 400, easing: "easeOutQuart" },
                animations: { numbers: { type: "number", properties: ["x", "y", "width", "height", "caretX", "caretY"] }, opacity: { easing: "linear", duration: 200 } },
                callbacks: {
                    beforeTitle: t,
                    title(t) {
                        if (t.length > 0) {
                            const e = t[0],
                                i = e.chart.data.labels,
                                s = i ? i.length : 0;
                            if (this && this.options && "dataset" === this.options.mode) return e.dataset.label || "";
                            if (e.label) return e.label;
                            if (s > 0 && e.dataIndex < s) return i[e.dataIndex]
                        }
                        return ""
                    },
                    afterTitle: t,
                    beforeBody: t,
                    beforeLabel: t,
                    label(t) {
                        if (this && this.options && "dataset" === this.options.mode) return t.label + ": " + t.formattedValue || t.formattedValue;
                        let e = t.dataset.label || "";
                        e && (e += ": ");
                        const s = t.formattedValue;
                        return i(s) || (e += s), e
                    },
                    labelColor(t) { const e = t.chart.getDatasetMeta(t.datasetIndex).controller.getStyle(t.dataIndex); return { borderColor: e.borderColor, backgroundColor: e.backgroundColor, borderWidth: e.borderWidth, borderDash: e.borderDash, borderDashOffset: e.borderDashOffset, borderRadius: 0 } },
                    labelTextColor() { return this.options.bodyColor },
                    labelPointStyle(t) { const e = t.chart.getDatasetMeta(t.datasetIndex).controller.getStyle(t.dataIndex); return { pointStyle: e.pointStyle, rotation: e.rotation } },
                    afterLabel: t,
                    afterBody: t,
                    beforeFooter: t,
                    footer: t,
                    afterFooter: t
                }
            },
            defaultRoutes: { bodyFont: "font", footerFont: "font", titleFont: "font" },
            descriptors: { _scriptable: t => "filter" !== t && "itemSort" !== t && "external" !== t, _indexable: !1, callbacks: { _scriptable: !1, _indexable: !1 }, animation: { _fallback: !1 }, animations: { _fallback: "animation" } },
            additionalOptionScopes: ["interaction"]
        },
        Jo = Object.freeze({ __proto__: null, Decimation: go, Filler: To, Legend: Ro, SubTitle: Vo, Title: zo, Tooltip: Zo });

    function Qo(t, e, i, s) { const n = t.indexOf(e); if (-1 === n) return ((t, e, i, s) => ("string" == typeof e ? (i = t.push(e) - 1, s.unshift({ index: i, label: e })) : isNaN(e) && (i = null), i))(t, e, i, s); return n !== t.lastIndexOf(e) ? i : n }
    class ta extends $s {
        constructor(t) { super(t), this._startValue = void 0, this._valueRange = 0, this._addedLabels = [] }
        init(t) {
            const e = this._addedLabels;
            if (e.length) {
                const t = this.getLabels();
                for (const { index: i, label: s }
                    of e) t[i] === s && t.splice(i, 1);
                this._addedLabels = []
            }
            super.init(t)
        }
        parse(t, e) { if (i(t)) return null; const s = this.getLabels(); return ((t, e) => null === t ? null : Z(Math.round(t), 0, e))(e = isFinite(e) && s[e] === t ? e : Qo(s, t, r(e, t), this._addedLabels), s.length - 1) }
        determineDataLimits() { const { minDefined: t, maxDefined: e } = this.getUserBounds(); let { min: i, max: s } = this.getMinMax(!0); "ticks" === this.options.bounds && (t || (i = 0), e || (s = this.getLabels().length - 1)), this.min = i, this.max = s }
        buildTicks() {
            const t = this.min,
                e = this.max,
                i = this.options.offset,
                s = [];
            let n = this.getLabels();
            n = 0 === t && e === n.length - 1 ? n : n.slice(t, e + 1), this._valueRange = Math.max(n.length - (i ? 0 : 1), 1), this._startValue = this.min - (i ? .5 : 0);
            for (let i = t; i <= e; i++) s.push({ value: i });
            return s
        }
        getLabelForValue(t) { const e = this.getLabels(); return t >= 0 && t < e.length ? e[t] : t }
        configure() { super.configure(), this.isHorizontal() || (this._reversePixels = !this._reversePixels) }
        getPixelForValue(t) { return "number" != typeof t && (t = this.parse(t)), null === t ? NaN : this.getPixelForDecimal((t - this._startValue) / this._valueRange) }
        getPixelForTick(t) { const e = this.ticks; return t < 0 || t > e.length - 1 ? null : this.getPixelForValue(e[t].value) }
        getValueForPixel(t) { return Math.round(this._startValue + this.getDecimalForPixel(t) * this._valueRange) }
        getBasePixel() { return this.bottom }
    }

    function ea(t, e, { horizontal: i, minRotation: s }) {
        const n = H(s),
            o = (i ? Math.sin(n) : Math.cos(n)) || .001,
            a = .75 * e * ("" + t).length;
        return Math.min(e / o, a)
    }
    ta.id = "category", ta.defaults = { ticks: { callback: ta.prototype.getLabelForValue } };
    class ia extends $s {
        constructor(t) { super(t), this.start = void 0, this.end = void 0, this._startValue = void 0, this._endValue = void 0, this._valueRange = 0 }
        parse(t, e) { return i(t) || ("number" == typeof t || t instanceof Number) && !isFinite(+t) ? null : +t }
        handleTickRangeOptions() {
            const { beginAtZero: t } = this.options, { minDefined: e, maxDefined: i } = this.getUserBounds();
            let { min: s, max: n } = this;
            const o = t => s = e ? s : t,
                a = t => n = i ? n : t;
            if (t) {
                const t = z(s),
                    e = z(n);
                t < 0 && e < 0 ? a(0) : t > 0 && e > 0 && o(0)
            }
            if (s === n) {
                let e = 1;
                (n >= Number.MAX_SAFE_INTEGER || s <= Number.MIN_SAFE_INTEGER) && (e = Math.abs(.05 * n)), a(n + e), t || o(s - e)
            }
            this.min = s, this.max = n
        }
        getTickLimit() { const t = this.options.ticks; let e, { maxTicksLimit: i, stepSize: s } = t; return s ? (e = Math.ceil(this.max / s) - Math.floor(this.min / s) + 1, e > 1e3 && (console.warn(`scales.${this.id}.ticks.stepSize: ${s} would result generating up to ${e} ticks. Limiting to 1000.`), e = 1e3)) : (e = this.computeTickLimit(), i = i || 11), i && (e = Math.min(i, e)), e }
        computeTickLimit() { return Number.POSITIVE_INFINITY }
        buildTicks() {
            const t = this.options,
                e = t.ticks;
            let s = this.getTickLimit();
            s = Math.max(2, s);
            const n = function(t, e) {
                const s = [],
                    { bounds: n, step: o, min: a, max: r, precision: l, count: h, maxTicks: c, maxDigits: d, includeBounds: u } = t,
                    f = o || 1,
                    g = c - 1,
                    { min: p, max: m } = e,
                    b = !i(a),
                    x = !i(r),
                    _ = !i(h),
                    y = (m - p) / (d + 1);
                let v, w, M, k, S = F((m - p) / g / f) * f;
                if (S < 1e-14 && !b && !x) return [{ value: p }, { value: m }];
                k = Math.ceil(m / S) - Math.floor(p / S), k > g && (S = F(k * S / g / f) * f), i(l) || (v = Math.pow(10, l), S = Math.ceil(S * v) / v), "ticks" === n ? (w = Math.floor(p / S) * S, M = Math.ceil(m / S) * S) : (w = p, M = m), b && x && o && W((r - a) / o, S / 1e3) ? (k = Math.round(Math.min((r - a) / S, c)), S = (r - a) / k, w = a, M = r) : _ ? (w = b ? a : w, M = x ? r : M, k = h - 1, S = (M - w) / k) : (k = (M - w) / S, k = N(k, Math.round(k), S / 1e3) ? Math.round(k) : Math.ceil(k));
                const P = Math.max(Y(S), Y(w));
                v = Math.pow(10, i(l) ? P : l), w = Math.round(w * v) / v, M = Math.round(M * v) / v;
                let D = 0;
                for (b && (u && w !== a ? (s.push({ value: a }), w < a && D++, N(Math.round((w + D * S) * v) / v, a, ea(a, y, t)) && D++) : w < a && D++); D < k; ++D) s.push({ value: Math.round((w + D * S) * v) / v });
                return x && u && M !== r ? s.length && N(s[s.length - 1].value, r, ea(r, y, t)) ? s[s.length - 1].value = r : s.push({ value: r }) : x && M !== r || s.push({ value: M }), s
            }({ maxTicks: s, bounds: t.bounds, min: t.min, max: t.max, precision: e.precision, step: e.stepSize, count: e.count, maxDigits: this._maxDigits(), horizontal: this.isHorizontal(), minRotation: e.minRotation || 0, includeBounds: !1 !== e.includeBounds }, this._range || this);
            return "ticks" === t.bounds && j(n, this, "value"), t.reverse ? (n.reverse(), this.start = this.max, this.end = this.min) : (this.start = this.min, this.end = this.max), n
        }
        configure() {
            const t = this.ticks;
            let e = this.min,
                i = this.max;
            if (super.configure(), this.options.offset && t.length) {
                const s = (i - e) / Math.max(t.length - 1, 1) / 2;
                e -= s, i += s
            }
            this._startValue = e, this._endValue = i, this._valueRange = i - e
        }
        getLabelForValue(t) { return li(t, this.chart.options.locale, this.options.ticks.format) }
    }
    class sa extends ia {
        determineDataLimits() {
            const { min: t, max: e } = this.getMinMax(!0);
            this.min = o(t) ? t : 0, this.max = o(e) ? e : 1, this.handleTickRangeOptions()
        }
        computeTickLimit() {
            const t = this.isHorizontal(),
                e = t ? this.width : this.height,
                i = H(this.options.ticks.minRotation),
                s = (t ? Math.sin(i) : Math.cos(i)) || .001,
                n = this._resolveTickFontOptions(0);
            return Math.ceil(e / Math.min(40, n.lineHeight / s))
        }
        getPixelForValue(t) { return null === t ? NaN : this.getPixelForDecimal((t - this._startValue) / this._valueRange) }
        getValueForPixel(t) { return this._startValue + this.getDecimalForPixel(t) * this._valueRange }
    }

    function na(t) { return 1 === t / Math.pow(10, Math.floor(I(t))) }
    sa.id = "linear", sa.defaults = { ticks: { callback: Is.formatters.numeric } };
    class oa extends $s {
        constructor(t) { super(t), this.start = void 0, this.end = void 0, this._startValue = void 0, this._valueRange = 0 }
        parse(t, e) {
            const i = ia.prototype.parse.apply(this, [t, e]);
            if (0 !== i) return o(i) && i > 0 ? i : null;
            this._zero = !0
        }
        determineDataLimits() {
            const { min: t, max: e } = this.getMinMax(!0);
            this.min = o(t) ? Math.max(0, t) : null, this.max = o(e) ? Math.max(0, e) : null, this.options.beginAtZero && (this._zero = !0), this.handleTickRangeOptions()
        }
        handleTickRangeOptions() {
            const { minDefined: t, maxDefined: e } = this.getUserBounds();
            let i = this.min,
                s = this.max;
            const n = e => i = t ? i : e,
                o = t => s = e ? s : t,
                a = (t, e) => Math.pow(10, Math.floor(I(t)) + e);
            i === s && (i <= 0 ? (n(1), o(10)) : (n(a(i, -1)), o(a(s, 1)))), i <= 0 && n(a(s, -1)), s <= 0 && o(a(i, 1)), this._zero && this.min !== this._suggestedMin && i === a(this.min, 0) && n(a(i, -1)), this.min = i, this.max = s
        }
        buildTicks() {
            const t = this.options,
                e = function(t, e) {
                    const i = Math.floor(I(e.max)),
                        s = Math.ceil(e.max / Math.pow(10, i)),
                        n = [];
                    let o = a(t.min, Math.pow(10, Math.floor(I(e.min)))),
                        r = Math.floor(I(o)),
                        l = Math.floor(o / Math.pow(10, r)),
                        h = r < 0 ? Math.pow(10, Math.abs(r)) : 1;
                    do { n.push({ value: o, major: na(o) }), ++l, 10 === l && (l = 1, ++r, h = r >= 0 ? 1 : h), o = Math.round(l * Math.pow(10, r) * h) / h } while (r < i || r === i && l < s);
                    const c = a(t.max, o);
                    return n.push({ value: c, major: na(o) }), n
                }({ min: this._userMin, max: this._userMax }, this);
            return "ticks" === t.bounds && j(e, this, "value"), t.reverse ? (e.reverse(), this.start = this.max, this.end = this.min) : (this.start = this.min, this.end = this.max), e
        }
        getLabelForValue(t) { return void 0 === t ? "0" : li(t, this.chart.options.locale, this.options.ticks.format) }
        configure() {
            const t = this.min;
            super.configure(), this._startValue = I(t), this._valueRange = I(this.max) - I(t)
        }
        getPixelForValue(t) { return void 0 !== t && 0 !== t || (t = this.min), null === t || isNaN(t) ? NaN : this.getPixelForDecimal(t === this.min ? 0 : (I(t) - this._startValue) / this._valueRange) }
        getValueForPixel(t) { const e = this.getDecimalForPixel(t); return Math.pow(10, this._startValue + e * this._valueRange) }
    }

    function aa(t) { const e = t.ticks; if (e.display && t.display) { const t = pi(e.backdropPadding); return r(e.font && e.font.size, ne.font.size) + t.height } return 0 }

    function ra(t, e, i, s, n) { return t === s || t === n ? { start: e - i / 2, end: e + i / 2 } : t < s || t > n ? { start: e - i, end: e } : { start: e, end: e + i } }

    function la(t) {
        const e = { l: t.left + t._padding.left, r: t.right - t._padding.right, t: t.top + t._padding.top, b: t.bottom - t._padding.bottom },
            i = Object.assign({}, e),
            n = [],
            o = [],
            a = t._pointLabels.length,
            r = t.options.pointLabels,
            l = r.centerPointLabels ? D / a : 0;
        for (let u = 0; u < a; u++) {
            const a = r.setContext(t.getPointLabelContext(u));
            o[u] = a.padding;
            const f = t.getPointPosition(u, t.drawingArea + o[u], l),
                g = mi(a.font),
                p = (h = t.ctx, c = g, d = s(d = t._pointLabels[u]) ? d : [d], { w: ye(h, c.string, d), h: d.length * c.lineHeight });
            n[u] = p;
            const m = K(t.getIndexAngle(u) + l),
                b = Math.round($(m));
            ha(i, e, m, ra(b, f.x, p.w, 0, 180), ra(b, f.y, p.h, 90, 270))
        }
        var h, c, d;
        t.setCenterPoint(e.l - i.l, i.r - e.r, e.t - i.t, i.b - e.b), t._pointLabelItems = function(t, e, i) {
            const s = [],
                n = t._pointLabels.length,
                o = t.options,
                a = aa(o) / 2,
                r = t.drawingArea,
                l = o.pointLabels.centerPointLabels ? D / n : 0;
            for (let o = 0; o < n; o++) {
                const n = t.getPointPosition(o, r + a + i[o], l),
                    h = Math.round($(K(n.angle + L))),
                    c = e[o],
                    d = ua(n.y, c.h, h),
                    u = ca(h),
                    f = da(n.x, c.w, u);
                s.push({ x: n.x, y: d, textAlign: u, left: f, top: d, right: f + c.w, bottom: d + c.h })
            }
            return s
        }(t, n, o)
    }

    function ha(t, e, i, s, n) {
        const o = Math.abs(Math.sin(i)),
            a = Math.abs(Math.cos(i));
        let r = 0,
            l = 0;
        s.start < e.l ? (r = (e.l - s.start) / o, t.l = Math.min(t.l, e.l - r)) : s.end > e.r && (r = (s.end - e.r) / o, t.r = Math.max(t.r, e.r + r)), n.start < e.t ? (l = (e.t - n.start) / a, t.t = Math.min(t.t, e.t - l)) : n.end > e.b && (l = (n.end - e.b) / a, t.b = Math.max(t.b, e.b + l))
    }

    function ca(t) { return 0 === t || 180 === t ? "center" : t < 180 ? "left" : "right" }

    function da(t, e, i) { return "right" === i ? t -= e : "center" === i && (t -= e / 2), t }

    function ua(t, e, i) { return 90 === i || 270 === i ? t -= e / 2 : (i > 270 || i < 90) && (t -= e), t }

    function fa(t, e, i, s) {
        const { ctx: n } = t;
        if (i) n.arc(t.xCenter, t.yCenter, e, 0, O);
        else {
            let i = t.getPointPosition(0, e);
            n.moveTo(i.x, i.y);
            for (let o = 1; o < s; o++) i = t.getPointPosition(o, e), n.lineTo(i.x, i.y)
        }
    }
    oa.id = "logarithmic", oa.defaults = { ticks: { callback: Is.formatters.logarithmic, major: { enabled: !0 } } };
    class ga extends ia {
        constructor(t) { super(t), this.xCenter = void 0, this.yCenter = void 0, this.drawingArea = void 0, this._pointLabels = [], this._pointLabelItems = [] }
        setDimensions() {
            const t = this._padding = pi(aa(this.options) / 2),
                e = this.width = this.maxWidth - t.width,
                i = this.height = this.maxHeight - t.height;
            this.xCenter = Math.floor(this.left + e / 2 + t.left), this.yCenter = Math.floor(this.top + i / 2 + t.top), this.drawingArea = Math.floor(Math.min(e, i) / 2)
        }
        determineDataLimits() {
            const { min: t, max: e } = this.getMinMax(!1);
            this.min = o(t) && !isNaN(t) ? t : 0, this.max = o(e) && !isNaN(e) ? e : 0, this.handleTickRangeOptions()
        }
        computeTickLimit() { return Math.ceil(this.drawingArea / aa(this.options)) }
        generateTickLabels(t) { ia.prototype.generateTickLabels.call(this, t), this._pointLabels = this.getLabels().map(((t, e) => { const i = c(this.options.pointLabels.callback, [t, e], this); return i || 0 === i ? i : "" })).filter(((t, e) => this.chart.getDataVisibility(e))) }
        fit() {
            const t = this.options;
            t.display && t.pointLabels.display ? la(this) : this.setCenterPoint(0, 0, 0, 0)
        }
        setCenterPoint(t, e, i, s) { this.xCenter += Math.floor((t - e) / 2), this.yCenter += Math.floor((i - s) / 2), this.drawingArea -= Math.min(this.drawingArea / 2, Math.max(t, e, i, s)) }
        getIndexAngle(t) { return K(t * (O / (this._pointLabels.length || 1)) + H(this.options.startAngle || 0)) }
        getDistanceFromCenterForValue(t) { if (i(t)) return NaN; const e = this.drawingArea / (this.max - this.min); return this.options.reverse ? (this.max - t) * e : (t - this.min) * e }
        getValueForDistanceFromCenter(t) { if (i(t)) return NaN; const e = t / (this.drawingArea / (this.max - this.min)); return this.options.reverse ? this.max - e : this.min + e }
        getPointLabelContext(t) { const e = this._pointLabels || []; if (t >= 0 && t < e.length) { const i = e[t]; return function(t, e, i) { return _i(t, { label: i, index: e, type: "pointLabel" }) }(this.getContext(), t, i) } }
        getPointPosition(t, e, i = 0) { const s = this.getIndexAngle(t) - L + i; return { x: Math.cos(s) * e + this.xCenter, y: Math.sin(s) * e + this.yCenter, angle: s } }
        getPointPositionForValue(t, e) { return this.getPointPosition(t, this.getDistanceFromCenterForValue(e)) }
        getBasePosition(t) { return this.getPointPositionForValue(t || 0, this.getBaseValue()) }
        getPointLabelPosition(t) { const { left: e, top: i, right: s, bottom: n } = this._pointLabelItems[t]; return { left: e, top: i, right: s, bottom: n } }
        drawBackground() {
            const { backgroundColor: t, grid: { circular: e } } = this.options;
            if (t) {
                const i = this.ctx;
                i.save(), i.beginPath(), fa(this, this.getDistanceFromCenterForValue(this._endValue), e, this._pointLabels.length), i.closePath(), i.fillStyle = t, i.fill(), i.restore()
            }
        }
        drawGrid() {
            const t = this.ctx,
                e = this.options,
                { angleLines: s, grid: n } = e,
                o = this._pointLabels.length;
            let a, r, l;
            if (e.pointLabels.display && function(t, e) {
                    const { ctx: s, options: { pointLabels: n } } = t;
                    for (let o = e - 1; o >= 0; o--) {
                        const e = n.setContext(t.getPointLabelContext(o)),
                            a = mi(e.font),
                            { x: r, y: l, textAlign: h, left: c, top: d, right: u, bottom: f } = t._pointLabelItems[o],
                            { backdropColor: g } = e;
                        if (!i(g)) {
                            const t = gi(e.borderRadius),
                                i = pi(e.backdropPadding);
                            s.fillStyle = g;
                            const n = c - i.left,
                                o = d - i.top,
                                a = u - c + i.width,
                                r = f - d + i.height;
                            Object.values(t).some((t => 0 !== t)) ? (s.beginPath(), Le(s, { x: n, y: o, w: a, h: r, radius: t }), s.fill()) : s.fillRect(n, o, a, r)
                        }
                        Ae(s, t._pointLabels[o], r, l + a.lineHeight / 2, a, { color: e.color, textAlign: h, textBaseline: "middle" })
                    }
                }(this, o), n.display && this.ticks.forEach(((t, e) => {
                    if (0 !== e) {
                        r = this.getDistanceFromCenterForValue(t.value);
                        ! function(t, e, i, s) {
                            const n = t.ctx,
                                o = e.circular,
                                { color: a, lineWidth: r } = e;
                            !o && !s || !a || !r || i < 0 || (n.save(), n.strokeStyle = a, n.lineWidth = r, n.setLineDash(e.borderDash), n.lineDashOffset = e.borderDashOffset, n.beginPath(), fa(t, i, o, s), n.closePath(), n.stroke(), n.restore())
                        }(this, n.setContext(this.getContext(e - 1)), r, o)
                    }
                })), s.display) {
                for (t.save(), a = o - 1; a >= 0; a--) {
                    const i = s.setContext(this.getPointLabelContext(a)),
                        { color: n, lineWidth: o } = i;
                    o && n && (t.lineWidth = o, t.strokeStyle = n, t.setLineDash(i.borderDash), t.lineDashOffset = i.borderDashOffset, r = this.getDistanceFromCenterForValue(e.ticks.reverse ? this.min : this.max), l = this.getPointPosition(a, r), t.beginPath(), t.moveTo(this.xCenter, this.yCenter), t.lineTo(l.x, l.y), t.stroke())
                }
                t.restore()
            }
        }
        drawBorder() {}
        drawLabels() {
            const t = this.ctx,
                e = this.options,
                i = e.ticks;
            if (!i.display) return;
            const s = this.getIndexAngle(0);
            let n, o;
            t.save(), t.translate(this.xCenter, this.yCenter), t.rotate(s), t.textAlign = "center", t.textBaseline = "middle", this.ticks.forEach(((s, a) => {
                if (0 === a && !e.reverse) return;
                const r = i.setContext(this.getContext(a)),
                    l = mi(r.font);
                if (n = this.getDistanceFromCenterForValue(this.ticks[a].value), r.showLabelBackdrop) {
                    t.font = l.string, o = t.measureText(s.label).width, t.fillStyle = r.backdropColor;
                    const e = pi(r.backdropPadding);
                    t.fillRect(-o / 2 - e.left, -n - l.size / 2 - e.top, o + e.width, l.size + e.height)
                }
                Ae(t, s.label, 0, -n, l, { color: r.color })
            })), t.restore()
        }
        drawTitle() {}
    }
    ga.id = "radialLinear", ga.defaults = { display: !0, animate: !0, position: "chartArea", angleLines: { display: !0, lineWidth: 1, borderDash: [], borderDashOffset: 0 }, grid: { circular: !1 }, startAngle: 0, ticks: { showLabelBackdrop: !0, callback: Is.formatters.numeric }, pointLabels: { backdropColor: void 0, backdropPadding: 2, display: !0, font: { size: 10 }, callback: t => t, padding: 5, centerPointLabels: !1 } }, ga.defaultRoutes = { "angleLines.color": "borderColor", "pointLabels.color": "color", "ticks.color": "color" }, ga.descriptors = { angleLines: { _fallback: "grid" } };
    const pa = { millisecond: { common: !0, size: 1, steps: 1e3 }, second: { common: !0, size: 1e3, steps: 60 }, minute: { common: !0, size: 6e4, steps: 60 }, hour: { common: !0, size: 36e5, steps: 24 }, day: { common: !0, size: 864e5, steps: 30 }, week: { common: !1, size: 6048e5, steps: 4 }, month: { common: !0, size: 2628e6, steps: 12 }, quarter: { common: !1, size: 7884e6, steps: 4 }, year: { common: !0, size: 3154e7 } },
        ma = Object.keys(pa);

    function ba(t, e) { return t - e }

    function xa(t, e) {
        if (i(e)) return null;
        const s = t._adapter,
            { parser: n, round: a, isoWeekday: r } = t._parseOpts;
        let l = e;
        return "function" == typeof n && (l = n(l)), o(l) || (l = "string" == typeof n ? s.parse(l, n) : s.parse(l)), null === l ? null : (a && (l = "week" !== a || !B(r) && !0 !== r ? s.startOf(l, a) : s.startOf(l, "isoWeek", r)), +l)
    }

    function _a(t, e, i, s) {
        const n = ma.length;
        for (let o = ma.indexOf(t); o < n - 1; ++o) {
            const t = pa[ma[o]],
                n = t.steps ? t.steps : Number.MAX_SAFE_INTEGER;
            if (t.common && Math.ceil((i - e) / (n * t.size)) <= s) return ma[o]
        }
        return ma[n - 1]
    }

    function ya(t, e, i) {
        if (i) {
            if (i.length) {
                const { lo: s, hi: n } = tt(i, e);
                t[i[s] >= e ? i[s] : i[n]] = !0
            }
        } else t[e] = !0
    }

    function va(t, e, i) {
        const s = [],
            n = {},
            o = e.length;
        let a, r;
        for (a = 0; a < o; ++a) r = e[a], n[r] = a, s.push({ value: r, major: !1 });
        return 0 !== o && i ? function(t, e, i, s) {
            const n = t._adapter,
                o = +n.startOf(e[0].value, s),
                a = e[e.length - 1].value;
            let r, l;
            for (r = o; r <= a; r = +n.add(r, 1, s)) l = i[r], l >= 0 && (e[l].major = !0);
            return e
        }(t, s, n, i) : s
    }
    class wa extends $s {
        constructor(t) { super(t), this._cache = { data: [], labels: [], all: [] }, this._unit = "day", this._majorUnit = void 0, this._offsets = {}, this._normalized = !1, this._parseOpts = void 0 }
        init(t, e) {
            const i = t.time || (t.time = {}),
                s = this._adapter = new wn._date(t.adapters.date);
            s.init(e), b(i.displayFormats, s.formats()), this._parseOpts = { parser: i.parser, round: i.round, isoWeekday: i.isoWeekday }, super.init(t), this._normalized = e.normalized
        }
        parse(t, e) { return void 0 === t ? null : xa(this, t) }
        beforeLayout() { super.beforeLayout(), this._cache = { data: [], labels: [], all: [] } }
        determineDataLimits() {
            const t = this.options,
                e = this._adapter,
                i = t.time.unit || "day";
            let { min: s, max: n, minDefined: a, maxDefined: r } = this.getUserBounds();

            function l(t) { a || isNaN(t.min) || (s = Math.min(s, t.min)), r || isNaN(t.max) || (n = Math.max(n, t.max)) }
            a && r || (l(this._getLabelBounds()), "ticks" === t.bounds && "labels" === t.ticks.source || l(this.getMinMax(!1))), s = o(s) && !isNaN(s) ? s : +e.startOf(Date.now(), i), n = o(n) && !isNaN(n) ? n : +e.endOf(Date.now(), i) + 1, this.min = Math.min(s, n - 1), this.max = Math.max(s + 1, n)
        }
        _getLabelBounds() {
            const t = this.getLabelTimestamps();
            let e = Number.POSITIVE_INFINITY,
                i = Number.NEGATIVE_INFINITY;
            return t.length && (e = t[0], i = t[t.length - 1]), { min: e, max: i }
        }
        buildTicks() {
            const t = this.options,
                e = t.time,
                i = t.ticks,
                s = "labels" === i.source ? this.getLabelTimestamps() : this._generate();
            "ticks" === t.bounds && s.length && (this.min = this._userMin || s[0], this.max = this._userMax || s[s.length - 1]);
            const n = this.min,
                o = st(s, n, this.max);
            return this._unit = e.unit || (i.autoSkip ? _a(e.minUnit, this.min, this.max, this._getLabelCapacity(n)) : function(t, e, i, s, n) { for (let o = ma.length - 1; o >= ma.indexOf(i); o--) { const i = ma[o]; if (pa[i].common && t._adapter.diff(n, s, i) >= e - 1) return i } return ma[i ? ma.indexOf(i) : 0] }(this, o.length, e.minUnit, this.min, this.max)), this._majorUnit = i.major.enabled && "year" !== this._unit ? function(t) {
                for (let e = ma.indexOf(t) + 1, i = ma.length; e < i; ++e)
                    if (pa[ma[e]].common) return ma[e]
            }(this._unit) : void 0, this.initOffsets(s), t.reverse && o.reverse(), va(this, o, this._majorUnit)
        }
        afterAutoSkip() { this.options.offsetAfterAutoskip && this.initOffsets(this.ticks.map((t => +t.value))) }
        initOffsets(t) {
            let e, i, s = 0,
                n = 0;
            this.options.offset && t.length && (e = this.getDecimalForValue(t[0]), s = 1 === t.length ? 1 - e : (this.getDecimalForValue(t[1]) - e) / 2, i = this.getDecimalForValue(t[t.length - 1]), n = 1 === t.length ? i : (i - this.getDecimalForValue(t[t.length - 2])) / 2);
            const o = t.length < 3 ? .5 : .25;
            s = Z(s, 0, o), n = Z(n, 0, o), this._offsets = { start: s, end: n, factor: 1 / (s + 1 + n) }
        }
        _generate() {
            const t = this._adapter,
                e = this.min,
                i = this.max,
                s = this.options,
                n = s.time,
                o = n.unit || _a(n.minUnit, e, i, this._getLabelCapacity(e)),
                a = r(n.stepSize, 1),
                l = "week" === o && n.isoWeekday,
                h = B(l) || !0 === l,
                c = {};
            let d, u, f = e;
            if (h && (f = +t.startOf(f, "isoWeek", l)), f = +t.startOf(f, h ? "day" : o), t.diff(i, e, o) > 1e5 * a) throw new Error(e + " and " + i + " are too far apart with stepSize of " + a + " " + o);
            const g = "data" === s.ticks.source && this.getDataTimestamps();
            for (d = f, u = 0; d < i; d = +t.add(d, a, o), u++) ya(c, d, g);
            return d !== i && "ticks" !== s.bounds && 1 !== u || ya(c, d, g), Object.keys(c).sort(((t, e) => t - e)).map((t => +t))
        }
        getLabelForValue(t) {
            const e = this._adapter,
                i = this.options.time;
            return i.tooltipFormat ? e.format(t, i.tooltipFormat) : e.format(t, i.displayFormats.datetime)
        }
        _tickFormatFunction(t, e, i, s) {
            const n = this.options,
                o = n.time.displayFormats,
                a = this._unit,
                r = this._majorUnit,
                l = a && o[a],
                h = r && o[r],
                d = i[e],
                u = r && h && d && d.major,
                f = this._adapter.format(t, s || (u ? h : l)),
                g = n.ticks.callback;
            return g ? c(g, [f, e, i], this) : f
        }
        generateTickLabels(t) { let e, i, s; for (e = 0, i = t.length; e < i; ++e) s = t[e], s.label = this._tickFormatFunction(s.value, e, t) }
        getDecimalForValue(t) { return null === t ? NaN : (t - this.min) / (this.max - this.min) }
        getPixelForValue(t) {
            const e = this._offsets,
                i = this.getDecimalForValue(t);
            return this.getPixelForDecimal((e.start + i) * e.factor)
        }
        getValueForPixel(t) {
            const e = this._offsets,
                i = this.getDecimalForPixel(t) / e.factor - e.end;
            return this.min + i * (this.max - this.min)
        }
        _getLabelSize(t) {
            const e = this.options.ticks,
                i = this.ctx.measureText(t).width,
                s = H(this.isHorizontal() ? e.maxRotation : e.minRotation),
                n = Math.cos(s),
                o = Math.sin(s),
                a = this._resolveTickFontOptions(0).size;
            return { w: i * n + a * o, h: i * o + a * n }
        }
        _getLabelCapacity(t) {
            const e = this.options.time,
                i = e.displayFormats,
                s = i[e.unit] || i.millisecond,
                n = this._tickFormatFunction(t, 0, va(this, [t], this._majorUnit), s),
                o = this._getLabelSize(n),
                a = Math.floor(this.isHorizontal() ? this.width / o.w : this.height / o.h) - 1;
            return a > 0 ? a : 1
        }
        getDataTimestamps() { let t, e, i = this._cache.data || []; if (i.length) return i; const s = this.getMatchingVisibleMetas(); if (this._normalized && s.length) return this._cache.data = s[0].controller.getAllParsedValues(this); for (t = 0, e = s.length; t < e; ++t) i = i.concat(s[t].controller.getAllParsedValues(this)); return this._cache.data = this.normalize(i) }
        getLabelTimestamps() { const t = this._cache.labels || []; let e, i; if (t.length) return t; const s = this.getLabels(); for (e = 0, i = s.length; e < i; ++e) t.push(xa(this, s[e])); return this._cache.labels = this._normalized ? t : this.normalize(t) }
        normalize(t) { return rt(t.sort(ba)) }
    }

    function Ma(t, e, i) {
        let s, n, o, a, r = 0,
            l = t.length - 1;
        i ? (e >= t[r].pos && e <= t[l].pos && ({ lo: r, hi: l } = et(t, "pos", e)), ({ pos: s, time: o } = t[r]), ({ pos: n, time: a } = t[l])) : (e >= t[r].time && e <= t[l].time && ({ lo: r, hi: l } = et(t, "time", e)), ({ time: s, pos: o } = t[r]), ({ time: n, pos: a } = t[l]));
        const h = n - s;
        return h ? o + (a - o) * (e - s) / h : o
    }
    wa.id = "time", wa.defaults = { bounds: "data", adapters: {}, time: { parser: !1, unit: !1, round: !1, isoWeekday: !1, minUnit: "millisecond", displayFormats: {} }, ticks: { source: "auto", major: { enabled: !1 } } };
    class ka extends wa {
        constructor(t) { super(t), this._table = [], this._minPos = void 0, this._tableRange = void 0 }
        initOffsets() {
            const t = this._getTimestampsForTable(),
                e = this._table = this.buildLookupTable(t);
            this._minPos = Ma(e, this.min), this._tableRange = Ma(e, this.max) - this._minPos, super.initOffsets(t)
        }
        buildLookupTable(t) { const { min: e, max: i } = this, s = [], n = []; let o, a, r, l, h; for (o = 0, a = t.length; o < a; ++o) l = t[o], l >= e && l <= i && s.push(l); if (s.length < 2) return [{ time: e, pos: 0 }, { time: i, pos: 1 }]; for (o = 0, a = s.length; o < a; ++o) h = s[o + 1], r = s[o - 1], l = s[o], Math.round((h + r) / 2) !== l && n.push({ time: l, pos: o / (a - 1) }); return n }
        _getTimestampsForTable() {
            let t = this._cache.all || [];
            if (t.length) return t;
            const e = this.getDataTimestamps(),
                i = this.getLabelTimestamps();
            return t = e.length && i.length ? this.normalize(e.concat(i)) : e.length ? e : i, t = this._cache.all = t, t
        }
        getDecimalForValue(t) { return (Ma(this._table, t) - this._minPos) / this._tableRange }
        getValueForPixel(t) {
            const e = this._offsets,
                i = this.getDecimalForPixel(t) / e.factor - e.end;
            return Ma(this._table, i * this._tableRange + this._minPos, !0)
        }
    }
    ka.id = "timeseries", ka.defaults = wa.defaults;
    var Sa = Object.freeze({ __proto__: null, CategoryScale: ta, LinearScale: sa, LogarithmicScale: oa, RadialLinearScale: ga, TimeScale: wa, TimeSeriesScale: ka });
    return bn.register(Bn, Sa, co, Jo), bn.helpers = {...Ti }, bn._adapters = wn, bn.Animation = xs, bn.Animations = ys, bn.animator = mt, bn.controllers = Us.controllers.items, bn.DatasetController = Ls, bn.Element = Es, bn.elements = co, bn.Interaction = Vi, bn.layouts = Zi, bn.platforms = ps, bn.Scale = $s, bn.Ticks = Is, Object.assign(bn, Bn, Sa, co, Jo, ps), bn.Chart = bn, "undefined" != typeof window && (window.Chart = bn), bn
}));