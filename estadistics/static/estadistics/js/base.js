(function() {
    (function() {
        if (!this.ovi || !this.ovi.win) {
            var e = {},
                k = k || this.oviConfig || {},
                k = {
                    win: k.win || this,
                    doc: k.doc || this.document,
                    modulePaths: k.modulePaths || {},
                    version: "1.0.0.$REPOSITORY_REVISION$",
                    buildNS: function(d) {
                        var a;
                        for (var d = d.split("."), c = 0, g = ovi.win, b; b = d[c++];) a = g[b] = g[b] || {
                            isNs: !0
                        }, g = a;
                        return g
                    },
                    provide: function(d) {
                        e[d] = 1;
                        return ovi.buildNS(d)
                    },
                    isLoaded: function(d) {
                        return e[d]
                    },
                    require: function(d, c) {
                        if (e[d]) return this;
                        var g = ovi.getLoadPath(d);
                        try {
                            ovi.Dt(g)
                        } catch (b) {
                            throw Error("Could not load " +
                                d + ", reason: " + b.message);
                        }
                        if (!e[d]) {
                            if (c !== !1) throw Error("Namespace " + d + " was not provided by " + g);
                            e[d] = 1
                        }
                        return this
                    },
                    Ik: function() {
                        return ovi.win.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest
                    },
                    $xhr: function() {
                        return this.Ik()
                    },
                    wj: function(d) {
                        d = d.status;
                        try {
                            return !d && location.protocol === "file:" || d >= 200 && d < 300 || d === 304 || d === 1223 || d === 0
                        } catch (c) {}
                        return !1
                    },
                    $isXHRSuccess: function(d) {
                        return this.wj(d)
                    },
                    Dt: function(d) {
                        var c = ovi.Ik();
                        c.open("GET", d, !1);
                        c.send(null);
                        if (!ovi.wj(c)) throw Error("Unable to load " +
                            d + " status: " + c.status);
                        return ovi.win.eval(c.responseText + "\n//@ sourceURL=" + d + "\n")
                    },
                    getLoadPath: function(d, c) {
                        var g = ovi.modulePaths[d];
                        if (!g)
                            for (var b = d.split("."), f = b.pop(), q = []; b.length;) {
                                g = b.join(".");
                                if (g = ovi.modulePaths[g]) {
                                    g += q.join("/");
                                    g += g.charAt(g.length - 1) !== "/" ? "/" + f : f;
                                    break
                                }
                                q.splice(0, 0, b.pop())
                            }
                        g += "." + (c || "js");
                        return g
                    }
                };
            if (this.ovi)
                for (var h in k) k.hasOwnProperty(h) && (this.ovi[h] = k[h]);
            else this.ovi = ovi = k;
            ovi.modulePaths.ovi = ovi.modulePaths.ovi || function() {
                for (var d = document.getElementsByTagName("script"),
                        c = 0, g = /(^|\/|\\)ovi[\.\w]*?\.js$/i, b = "", f, q, a; f = d[c++];)
                    if (f = f.ie8_src || f.src || "", q = f.match(g)) {
                        if (f.indexOf("://") === -1) {
                            b = ovi.win.location.href;
                            a = b.indexOf("#");
                            var r = b.indexOf("?");
                            a = a > r && r > -1 ? r : a;
                            b = a > -1 ? b.substring(0, a) : b;
                            b = b.substring(0, b.lastIndexOf("/") + 1)
                        }
                        a = b + f.substring(0, q.index);
                        a = a.charAt(a.length - 1) === "/" ? a : a + "/"
                    }
                return a
            }();
            ovi.basePath = ""
        }
    }).call(this);
    ovi.provide("ovi.browser");
    var Qa = ovi,
        Za = navigator,
        Db = Za.userAgent.toLowerCase(),
        Sb = Za.appVersion;
    Qa.platform = {
        windows: /Windows/.test(Sb),
        mac: /MacIntel/.test(Za.platform),
        linux: /X11/.test(Sb) && !/tablet/.test(Db) && !/armv7/.test(Db),
        maemo: /apple/.test(Db) && /linux/.test(Db) && /armv7/.test(Za.platform),
        s60_v3: /Series60\/3/.test(Sb),
        s60_v5_touch: /Nokia5800|NokiaN97/.test(Sb) || /browserng/.test(Db)
    };
    var Tb = Qa.platform;
    Qa.browser = {
        version: (Db.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
        chrome: /chrome/.test(Db),
        safari: /Apple/.test(navigator.vendor) && !/browserng/.test(Db),
        opera: /opera/.test(Db),
        mozilla: /firefox/.test(Db) && !/Apple/.test(navigator.vendor),
        s60: /series60/.test(Db),
        cp: /browserng/.test(Db),
        s60_v3: Tb.s60_v3,
        snc: Tb.s60_v3 || Tb.s60_v5_snc,
        touch: Tb.maemo || Tb.s60_v5_touch,
        web: !(Tb.s60_v3 || Tb.s60_v5_snc || Tb.maemo || Tb.s60_v5_touch),
        language: Za.language || Za.userLanguage
    };
    ovi.browser.msie = eval("/*@cc_on!@*/!1");
    ovi.provide("ovi.lang");
    (function(e) {
        e.bind = function(a, f) {
            if (arguments.length > 2) {
                var b = [].slice.call(arguments, 2);
                return function() {
                    return f.apply(a, b.concat(e.splat(arguments)))
                }
            } else return function() {
                return f.apply(a, arguments)
            }
        };
        e.each = function(a, f) {
            if (a) {
                var b = 0,
                    c = a.length,
                    p;
                if (typeof c !== "number" || Object.prototype.toString.call(a) === "[object Object]" && !(c - 1 in a))
                    for (p in a) {
                        if (a.hasOwnProperty(p) && f.call(a, a[p], p, a) === !1) break
                    } else
                        for (p = a[0]; b < c && f.call(a, p, b, a) !== !1; p = a[++b]);
            }
        };
        e.extend = function() {
            var a = "constructor toString valueOf toLocaleString isPrototypeOf propertyIsEnumerable hasOwnProperty unique".split(" "),
                f, b = {
                    constructor: function() {}
                },
                c;
            for (f in b) c = null;
            c === void 0 && (c = function(f, b) {
                for (var c = a.length, l; c--;)
                    if (b.hasOwnProperty(l = a[c])) f[l] = b[l]
            });
            e.extend = function(a, f) {
                for (var b = Array.prototype.slice.call(arguments, 1), l = 0, r = b.length; l < r; l++) {
                    var f = b[l],
                        q;
                    for (q in f) f.hasOwnProperty(q) && (a[q] = f[q]);
                    c && f && c(a, f, 1)
                }
                return a
            };
            return e.extend.apply(null, arguments)
        };
        e.splat = function(a) {
            var f = e.type(a);
            return f === "undefined" ? [] : f === "arguments" ? Array.prototype.slice.call(a) : f === "array" ? a : [a]
        };
        for (var k =
                Object.prototype.toString, h = {}, d = {
                    1: "element",
                    3: "textnode",
                    9: "document",
                    11: "fragment"
                }, c = "Arguments Array Boolean Date Document Element Error Fragment Function NodeList Null Number Object RegExp String TextNode Undefined Window".split(" "), g = 0, b, f; b = c[g++];)
            if (f = e.win[b]) try {
                h[k.call(new f)] = b.toLowerCase()
            } catch (q) {}
        e.type = function(a) {
            return a === null && "null" || a === void 0 && "undefined" || a.nodeType && d[a.nodeType] || a.length !== void 0 && (typeof a.length == "number" || a.length.tagName) && (a.callee && "arguments" ||
                a.alert && "window" || a.item && "nodelist") || h[k.call(a)]
        }
    })(ovi);
    ovi.provide("ovi.Class");
    (function(e) {
        function k(c) {
            function d() {
                var b = this.zk;
                this.zk = d;
                var f;
                try {
                    f = this instanceof d ? new c(arguments) : c.apply(this, arguments)
                } finally {
                    this.zk = b
                }
                return f
            }
            return d
        }

        function h() {
            var c = this.zk;
            delete this.zk;
            return c.Xn.apply(this, arguments)
        }

        function d() {}
        e.Class = function(c) {
            function g() {
                this.mj && this.mj();
                return this.initialize ? this.initialize.apply(this, arguments) : this
            }
            c = c || {};
            if (!(this instanceof e.Class)) return new e.Class(c);
            var b;
            if (c.Mixins) {
                var f = [].concat(c.Mixins),
                    q = [],
                    a = 0,
                    r;
                for (delete c.Mixins; r =
                    f[a++];)
                    for (b in r = r.prototype || r) typeof r[b] === "function" && (b !== "initialize" ? c[b] || (c[b] = r[b]) : q.push(r.initialize));
                if (q.length > 0) c.mj = function() {
                    l.mj.Xn && l.mj.Xn.call(this);
                    for (var a = 0, f; f = q[a++];) f.call(this)
                }
            }
            f = c.Extends;
            delete c.Extends;
            a = c.Statics;
            delete c.Statics;
            var l;
            if (typeof f === "function") {
                d.prototype = f.prototype;
                l = new d;
                for (b in c)
                    if (c.hasOwnProperty(b)) {
                        if (typeof l[b] === "function" && typeof c[b] === "function") c[b] = k(c[b]), c[b].Xn = l[b];
                        l[b] = c[b]
                    }
                l._super = h;
                l.Hw = f
            } else l = c;
            if (c.Name) l.className =
                c.Name, g.Name = l.className;
            delete l.Name;
            g.constructor = e.Class;
            g.prototype = l;
            g.prototype.constructor = g;
            a && e.extend(g, a);
            return g
        }
    })(ovi);
    ovi.provide("ovi.Array");
    (function(e) {
        var k = "forEach indexOf lastIndexOf map filter every some reduce reduceRight".split(" "),
            h = /^\s*function\s+\w+\s*\(\s*\)\s*\{\s*\[\s*native\s+code\s*\]\s*\}\s*$/,
            d = {
                forEach: function(f, b, a) {
                    for (var c = f.length >>> 0, l = 0; l < c; l++) l in f && b.call(a, f[l], l, f)
                },
                map: function(f, b, a) {
                    var c, l, m, p;
                    if (f == null) throw new TypeError(" array is null or not defined");
                    l = Object(f);
                    m = l.length >>> 0;
                    if ({}.toString.call(b) != "[object Function]") throw new TypeError(b + " is not a function");
                    f = Array(m);
                    for (c = 0; c < m;) c in
                        l && (p = l[c], p = b.call(a, p, c, l), f[c] = p), c++;
                    return f
                },
                lastIndexOf: function(f, b, a) {
                    return this.Mp(f, b, a, -1)
                },
                Mp: function(f, b, a, c) {
                    var c = c || 1,
                        l = f.length >>> 0;
                    isNaN(a) ? a = c > 0 ? 0 : l - 1 : (a = Math[a < 0 ? "ceil" : "floor"](a), a < 0 ? a += l : c < 0 && a >= l && (a = l - 1));
                    for (; a > -1 && a < l; a += c)
                        if (a in f && f[a] === b) return a;
                    return -1
                }
            },
            c = {
                isOviArray: 1
            },
            g = k.length;
        for (d.indexOf = d.Mp; g--;) {
            var b = k[g];
            typeof k[b] === "function" && h.test(k[b]) && (!k[b].toString || h.test(k[b].toString)) ? (k.splice(g, 1), d[b] = Array[b] || new Function("var ap = Array.prototype; return ap." +
                b + ".apply(arguments[0], ap.slice.call(arguments, 1));")) : c[b] = new Function("return ovi.Array." + b + ".apply(ovi.Array, [this].concat(ovi.splat(arguments)));")
        }
        e.Array = k.length ? function(f) {
            return (f = arguments.length ? f : []).isOviArray ? f : e.extend(f, c)
        } : function(f) {
            return arguments.length ? f : []
        };
        e.extend(e.Array, d)
    })(ovi);
    ovi.provide("nokia.maps.capturing._packaging.base");
    ovi.provide("nokia.maps.clustering._packaging.base");
    ovi.provide("nokia.maps.heatmap._packaging.base");
    ovi.provide("nokia.maps.util.ResourceLoader");
    (function(e) {
        var k = nokia.maps.util.d,
            h = {
                css: function(d) {
                    /###RESOURCE_START###/im.test(d) && (d = d.replace(/[\s\S]*###RESOURCE_START###\*\//im, ""), d = d.replace(/\/\*###RESOURCE_END###[\s\S]*/im, ""));
                    return d
                },
                html: function(d) {
                    /###RESOURCE_START###/im.test(d) && (d = d.replace(/[\s\S]*###RESOURCE_START###--\>/im, ""), d = d.replace(/<\!--###RESOURCE_END###[\s\S]*/im, ""));
                    return d
                }
            };
        e.requireString = function(d) {
            var c = d.split("."),
                d = c.pop(),
                g = c.join("."),
                b = ovi.getLoadPath(g, d),
                c = ovi.Ik();
            c.open("GET", b, !1);
            c.send(null);
            ovi.wj(c) ? (g = ovi.provide("" + g), c = c.responseText, c.replace(/\n/g, ""), h[d] && (c = h[d](c)), g[d] = c) : k("Unable to load " + this.Qt + " status: " + c.status)
        };
        e.requireI18n = function(d) {
            for (var c = e.config.packages.language, g = c.length, b = d || "nokia.maps"; g--;) d = c[g].split("-"), e.requireString(b + ".resources.ui.i18n." + (d.length === 2 ? d[0] + "." + d[1] : d[0]) + ".translation.json")
        }
    })(nokia.maps);
    ovi.provide("nokia.maps.util");
    (function(e) {
        function k(a) {
            return function(f) {
                return m.call(f) === a
            }
        }

        function h(a) {
            return this[a]
        }

        function d(a) {
            this.message = a;
            this.name = "ParserError"
        }
        var c = {},
            g = Math,
            b = g.min,
            f = g.max,
            q = Function(),
            g = document,
            a = g.createElement("p"),
            r = a.appendChild(g.createTextNode("")),
            l, g = function() {
                for (var a = window, f, b, c, p = "moz webkit ms o ".split(" "), m = 5; m-- && !f;) f = p[m], f = (b = a[f + (f ? "R" : "r") + "equestAnimationFrame"]) && !isNaN(b.call(window, q)) && (c = a[f + (f ? "C" : "c") + "ancelAnimationFrame"]);
                l = f ? function(f) {
                    return b.call(a,
                        f)
                } : function(f) {
                    return a.setTimeout(f, 25)
                };
                return f ? function(f) {
                    return c.call(a, f)
                } : function(f) {
                    return a.clearTimeout(f)
                }
            }(),
            m = {}.toString,
            p = "Array Boolean Date Error Function Number Object RegExp String".split(" "),
            z = p.length;
        for (e.isArguments = k(m.call(arguments)); z--;) e["is" + p[z]] = k(m.call(new this[p[z]]));
        ovi.extend(e, {
            ic: function(a, f) {
                var b;
                arguments.length > 1 && f !== c ? (b = Error(a + ": " + f), b.type = a) : b = Error(a);
                throw b;
            },
            d: function(a) {
                e.ic("IllegalArgument", arguments.length ? a : c)
            },
            Nf: function(a) {
                e.ic("IllegalState",
                    arguments.length ? a : c)
            },
            co: function(a) {
                e.ic("UnsupportedOperation", arguments.length ? a : c)
            },
            Ov: function(a) {
                e.ic("InternalError", arguments.length ? a : c)
            },
            requestAnimationFrame: l,
            cancelAnimationFrame: g,
            xn: function(a, f) {
                var a = ("" + a).split("."),
                    b = a.length,
                    c = 0;
                for (arguments.length < 2 && (f = window); c < b && f !== void 0 && f !== null; c++) f = f[a[c]];
                return f
            },
            now: Date.now || function() {
                return +new Date
            },
            flatMerge: function(a, f, b, c) {
                var l, p;
                for (l in f)
                    if (p = f[l], f.hasOwnProperty(l) && (b || !a.hasOwnProperty(l)) && (!c || c(l, p))) a[l] =
                        p;
                return a
            },
            Eg: function(a) {
                return e.om(a).map(h, a).join("")
            },
            om: Object.keys || function() {
                var a = Object.prototype.hasOwnProperty,
                    f = !{
                        toString: 0
                    }.propertyIsEnumerable("toString"),
                    b = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"],
                    c = b.length;
                return function(l) {
                    var p = typeof l,
                        m;
                    (p !== "object" && p !== "function" || l === null) && e.d();
                    p = ovi.Array([]);
                    for (m in l) a.call(l, m) && p.push(m);
                    if (f)
                        for (m = 0; m < c; m++) a.call(l, b[m]) && p.push(b[m]);
                    return p
                }
            }(),
            getRootNameSpace: function(a) {
                return ovi.win[a.split(".")[0]]
            },
            A: q,
            is: function() {
                e.ic("Unimplemented abstract method.", c)
            },
            vf: function(a, f) {
                return (a % f + f) % f
            },
            Ja: function(a, c, l) {
                return b(f(+a, +c), +l)
            },
            Lk: function(a) {
                return function(f) {
                    return a && a[f] || null
                }
            },
            mt: self.XPathResult ? function(a, f, b) {
                a = (a.ownerDocument || a).evaluate(f, a, new nokia.maps.util.Lk(b), XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
                for (f = []; b = a.iterateNext();) f.push(b);
                return f || []
            } : function(a, f, b) {
                var c = a.ownerDocument || a,
                    l = c.getProperty("SelectionLanguage"),
                    p = c.getProperty("SelectionNamespaces"),
                    m, r = "";
                for (m in b) b.hasOwnProperty(m) && (r += "xmlns:" + m + '="' + b[m] + '" ');
                c.setProperty("SelectionLanguage", "XPath");
                c.setProperty("SelectionNamespaces", r);
                a = a.selectNodes(f);
                c.setProperty("SelectionLanguage", l);
                c.setProperty("SelectionNamespaces", p);
                return a
            },
            Af: function(a) {
                var f, b;
                if (window.ActiveXObject) f = new ActiveXObject("Microsoft.XMLDOM"), f.async = !1, f.resolveExternals = !1, f.validateOnParse = !1, f.loadXML(a), f.parseError.errorCode && (b = "error on line ".concat(f.parseError.line, ": ", f.parseError.reason));
                else if (self.DOMParser && (f = new DOMParser, f = f.parseFromString(a, "text/xml"), ovi.Array.indexOf([f.documentElement.nodeName, (f.documentElement.firstChild || {}).nodeName], "parsererror") >= 0)) a = f.getElementsByTagName("parsererror")[0], b = (a.childNodes[0].nodeType === 3 ? a.childNodes[0].nodeValue + "\n" : "") + a.childNodes[1].firstChild.nodeValue;
                if (b) throw new d(b);
                return f || null
            },
            getConstructor: function(a) {
                try {
                    return !a.isNs ? a : null
                } catch (f) {
                    return null
                }
            },
            sanitizeText: function(f) {
                r.nodeValue = f;
                return a.innerHTML
            },
            Ds: function() {
                var a = document.createElement("div"),
                    f = "";
                a.innerHTML = "<svg></svg>";
                if (!a.firstChild) return !0;
                f = a.firstChild.toString();
                return this.ll || (this.ll = !(!window.SVGSVGElement || !(f === "[object HTMLElement]" || f === "[object SVGSVGElement]")))
            },
            $c: function(a, f) {
                for (var b = (a = a.split(" ")).length, c = {}; b--;) c[a[b]] = f;
                return c
            },
            isWebGl: function() {
                var a = null,
                    f = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
                    b = document.createElement("canvas"),
                    c = f.length,
                    l;
                try {
                    for (l = 0; l < c && window.WebGLRenderingContext &&
                        !(a = b.getContext(f[l])); l++);
                } catch (p) {
                    return !1
                }
                return a !== null
            }
        })
    })(nokia.maps.util);
    ovi.provide("nokia.maps.util.services");
    (function(e) {
        function k(a) {
            this.jo = a || 1 / 0;
            for (var a = [], f = 36, b; f--;) b = Math.floor(Math.random() * 16), a[f] = "0123456789ABCDEF" [f === 14 ? 4 : f === 19 ? b & 3 | 8 : b];
            a[8] = a[13] = a[18] = a[23] = "-";
            this.id = a.join("");
            this.init()
        }
        var e = nokia.maps,
            h = e.config,
            d = e.util,
            e = d.services,
            c = d.now,
            g = encodeURIComponent,
            b, f = d.getRootNameSpace("nokia.maps").Settings,
            q;
        k.prototype = {
            isAlive: function() {
                return c() < this.fm + this.jo
            },
            init: function() {
                this.fm = c()
            }
        };
        k.getSessionId = function() {
            if (!b || !b.isAlive()) b = new k(h.sessionTTL);
            b.init();
            return b.id
        };
        q = "&xnlp=CL_JSMv" + g("2.5.4");
        ovi.extend(e, {
            getBaseURL: function(a, f, b, c) {
                var p = a.get("secureConnection"),
                    q = h && h.isChina,
                    d = null,
                    g = null,
                    e = c && q ? ".china" : "",
                    k = a.get(f + "." + b + e + ".baseUrl") || a.get(f + e + ".baseUrl"),
                    e = a.get(f + "." + b + e + ".secure.baseUrl") || a.get(f + e + ".secure.baseUrl"),
                    w = a.get(f + "." + b + ".secure.interface") || y,
                    y = a.get(f + "." + b + ".interface") || a.get(f + ".interface");
                if (p == "force") return e && (d = e, g = w || y, d += g ? g + "?" : ""), d;
                p == "prefer" && (d = e, g = w);
                d || (d = k);
                g || (g = y || "");
                g != "" && (g += "?");
                d += g;
                c && !q && (d += "int=true&");
                return d
            },
            addNlpParams: function(a, b) {
                return a.concat(/[\?&]$/.test(a) ? "" : /[\?&]/.test(a) ? "&" : "?", "app_id=", g(f.app_id), b ? "&token=" : "&app_code=", g(f.app_code), q, f.noSID ? "" : ",SID_" + g(k.getSessionId()))
            }
        });
        d.Session = k
    })();
    ovi.provide("nokia.maps.util.animation.easeFunctions");
    (function(e) {
        e.animation.easeFunctions = {
            LINEAR: function(e) {
                return e
            },
            EASE_IN_QUAD: function(e) {
                return e * e
            },
            EASE_OUT_QUAD: function(e) {
                return -e * (e - 2)
            },
            EASE_IN_OUT_QUINT: function(e) {
                e *= 2;
                if (e < 1) return e * e * e * e * e / 2;
                e -= 2;
                return e * e * e * e * e / 2 + 1
            },
            EASE_OUT_CIRC: function(e) {
                return Math.sqrt(2 * e - e * e)
            }
        }
    })(nokia.maps.util);
    ovi && ovi.provide("nokia.maps.Detector");
    nokia.maps = nokia.maps || {};
    (function(e) {
        function k(e, d) {
            for (var c = d.length, g = null; c--;)
                if (d[c][0] === e) {
                    g = d[c];
                    break
                }
            return g
        }
        e.Detector = function(e, d) {
            this.definitions = e;
            this.omitted = d
        };
        e.Detector.prototype = {
            detect: function(e) {
                switch (e) {
                    case void 0:
                        return this.detect(this.omitted);
                    case "auto":
                        return this.autoDetect();
                    case "none":
                        return null;
                    default:
                        return k(e, this.definitions) === null ? null : e
                }
            },
            autoDetect: function() {
                for (var e = this.definitions, d = e.length, c = 0; c < d; c++)
                    if (this.isCapable(e[c][0])) return e[c][0]
            },
            isCapable: function(e) {
                return (e =
                    k(e, this.definitions)) && e[1]()
            }
        }
    })(nokia.maps);
    ovi.provide("nokia.maps.util.LinkedList");
    (function(e) {
        var k = nokia.maps.util.d,
            h = !h,
            d = !h,
            k = nokia.maps.util.d,
            c = e.LinkedList = Function(),
            g = e.LinkedList.Element = function(b) {
                this.data = b
            };
        ovi.extend(c.prototype, {
            k: null,
            l: null,
            length: 0,
            first: function() {
                return this.k
            },
            last: function() {
                return this.l
            },
            elementOf: function(b, f) {
                for (var c = f || this.k; c && c.data !== b;) c = c.next;
                return c || null
            },
            lastElementOf: function(b, f) {
                for (var c = f || this.l; c && c.data !== b;) c = c.prev;
                return c || null
            },
            toArray: function(b) {
                for (var f = this.k, c = []; f;) b ? c.push(f) : c.push(f.data), f = f.next;
                return c
            },
            indexOf: function(b) {
                var f = b instanceof g,
                    c = 0,
                    a = this.k;
                if (this.length > 0)
                    for (; a;) {
                        if (f) {
                            if (a === b) return c
                        } else if (a.data === b) return c;
                        c++;
                        a = a.next
                    }
                return -1
            },
            lastIndexOf: function(b) {
                var f = b instanceof g,
                    c = this.length - 1,
                    a = this.l;
                if (this.length > 0)
                    for (; a;) {
                        if (f) {
                            if (a === b) return c
                        } else if (a.data === b) return c;
                        c--;
                        a = a.prev
                    }
                return -1
            },
            get: function(b) {
                var f = this.k;
                if (b instanceof g) return b;
                if ((b = +b) < 0)
                    for (f = this.l; f && ++b;) f = f.prev;
                else
                    for (; f && b--;) f = f.next;
                return f
            },
            set: function(b, f) {
                var c = this.k;
                if (b instanceof g) c = b, c.list !== this && k("Invalid index!");
                else if ((b = +b) < 0) {
                    for (c = this.l; c && ++b;) c = c.prev;
                    if (!c) return this.unshift(f)
                } else if (b !== b) k("Invalid index!");
                else {
                    for (; c && b--;) c = c.next;
                    if (!c) return this.push(f)
                }
                if (f instanceof g) return this.splice(b, 1, f) && this;
                c.data = f;
                return this
            },
            remove: function(b) {
                var f, c;
                b instanceof g || (b = this.elementOf(b));
                if (!b || b.list !== this) return d;
                if (--this.length === 0) this.k = this.l = null;
                else if (this.k === b) {
                    if (this.k = b.next) this.k.prev = null
                } else if (this.l === b) {
                    if (this.l =
                        b.prev) this.l.next = null
                } else f = b.prev, c = b.next, f.next = c, c.prev = f;
                b.list = b.prev = b.next = null;
                return h
            },
            sort: function(b, f) {
                var c = this.k,
                    a;
                if (!c) return this;
                this.k = this.l = null;
                for (this.length = 0; c;) a = c.next, c.list = c.prev = c.next = null, this.addSorted(b, f, c), c = a;
                return this
            },
            addSorted: function(b, f) {
                for (var c = arguments, a = c.length, f = f || this, r = 1, l, m, p; ++r < a;)
                    if (m = c[r], m instanceof g ? m.list && m.list.remove(m) : m = new g(m), m.list = this, p = this.k, ++this.length === 1) this.k = this.l = m;
                    else {
                        for (; p;) {
                            l = b.call(f, m.data, p.data,
                                m, p);
                            if (l <= 0) {
                                m.next = p;
                                p === this.k ? this.k = p.prev = m : (m.prev = p.prev, m.prev.next = m, p.prev = m);
                                break
                            }
                            p = p.next
                        }
                        if (l > 0) m.prev = this.l, this.l = this.l.next = m
                    }
                return this
            },
            shift: function() {
                var b;
                if (this.length <= 0) return null;
                this.length--;
                b = this.k;
                if (this.k.next) {
                    if (this.k = this.k.next) this.k.prev = null
                } else this.k = this.l = null;
                b.list = b.prev = b.next = null;
                return b
            },
            unshift: function() {
                for (var b = arguments, f = b.length, c, a = -1; ++a < f;) c = b[a], c instanceof g ? c.list && c.list.remove(c) : c = new g(c), c.list = this, ++this.length === 1 ?
                    this.k = this.l = c : (this.k.prev = c, c.next = this.k, this.k = c);
                return this.length
            },
            next: function(b) {
                b !== void 0 && b !== null && !(b instanceof g) && (b = this.elementOf(b));
                if (!b) return this.k;
                return b.next
            },
            prev: function(b) {
                b !== void 0 && b !== null && !(b instanceof g) && (b = this.elementOf(b));
                if (!b) return this.l;
                return b.prev
            },
            push: function() {
                for (var b = arguments, f = b.length, c, a = -1; ++a < f;) c = b[a], c instanceof g ? c.list && c.list.remove(c) : c = new g(c), c.list = this, ++this.length === 1 ? this.k = this.l = c : (this.l.next = c, c.prev = this.l, this.l =
                    c);
                return this.length
            },
            pop: function() {
                var b = this.l;
                if (!b) return null;
                --this.length === 0 ? this.k = this.l = null : (this.l = this.l.prev, this.l.next = null);
                b.list = b.prev = b.list = null;
                return b
            },
            splice: function(b, f) {
                var c = arguments,
                    a = c.length,
                    r = 1,
                    l = this.k,
                    m, p = [],
                    d;
                if (ovi.type(b) !== "number") b instanceof g ? (l = b, !l.list === this && k("Invalid index given to LinkedList.splice!")) : (l = this.elementOf(b)) || k("Invalid index given to LinkedList.splice!");
                else if (b >= 0)
                    for (; --b >= 0 && l;) l = l.next;
                else {
                    for (l = this.l; ++b < 0 && l;) l = l.prev;
                    if (!l) l = this.k
                }
                if (l)
                    for (; --f >= 0 && l;) {
                        m = l.next;
                        p[p.length] = l;
                        if (--this.length === 0) this.k = this.l = l.list = null;
                        else if (l === this.k) {
                            if (this.k = l.next) this.k.prev = null;
                            l.next = l.list = null
                        } else l === this.l ? (this.l = l.prev, this.l.next = l.prev = l.list = null) : (d = l.prev, d.next = l.next, d.next.prev = d, l.prev = l.next = l.list = null);
                        l = m
                    } else l = this.l;
                if (!l) l = this.l;
                for (; ++r < a;)(d = c[r]) instanceof g ? d.list && d.list.remove(d) : d = new g(d), ++this.length === 1 ? l = this.k = this.l = d : l === this.l ? (l.next = d, d.prev = l, l = this.l = d) : (d.next = l.next,
                    d.next.prev = d, d.prev = l, l = l.next = d);
                return p
            }
        });
        ovi.extend(g.prototype, {
            list: null,
            next: null,
            prev: null
        })
    })(nokia.maps.util);
    ovi.provide("nokia.maps.util.OList");
    (function(e) {
        var k = e.d;
        e.OList = new ovi.Class({
            initialize: function(e) {
                this.ha = ovi.Array(e || [])
            },
            M: function(h, d, c) {
                this.ha.splice(d, 0, h);
                if (h = this.xa("add", h, d, c)) return c && e.Nf(), this.cc(d, h), h
            },
            add: function(e, d) {
                if (arguments.length < 2) d = this.ha.length;
                d !== +d && k();
                this.M(e, d);
                return this
            },
            addAll: function(e, d) {
                var c = e.length,
                    g = this.ha.length,
                    b = 0,
                    f = Math;
                arguments.length < 2 && (d = g);
                d !== +d && k();
                for (g = d < 0 ? f.max(0, g + d) : f.min(g, d); b < c; b++) this.M(e[b], g + b);
                return this
            },
            remove: function(e) {
                e = this.indexOf(e);
                return e <
                    0 ? null : this.removeAt(e)
            },
            removeAll: function(e) {
                for (var d = e.length, c = 0; c < d; c++) this.remove(e[c]);
                return this
            },
            cc: function(h, d) {
                var c = this.ha.splice(h, 1)[0],
                    g;
                if (g = this.xa("remove", c, h, d)) return d && e.Nf(), this.M(c, h, g), g
            },
            removeAt: function(e) {
                var d = this.get(e);
                return this.cc(e) ? null : d
            },
            clear: function() {
                for (var e = this.ha.length; e--;) this.cc(e)
            },
            set: function(e, d) {
                var c;
                c = this.get(d);
                if (!this.cc(d))
                    if (this.M(e, d)) this.M(c, d);
                    else return c
            },
            indexOf: function(e) {
                return this.ha.indexOf(e)
            },
            get: function(e) {
                var d =
                    this.ha;
                (e !== +e >>> 0 || e >= d.length) && k();
                return d[e]
            },
            getLength: function() {
                return this.ha.length
            },
            asArray: function() {
                return [].concat(this.ha)
            },
            xa: function(e, d, c, g) {
                var b = this.oa,
                    f, q;
                g || (g = 1 / 0);
                if (b)
                    for (q = 0; q in b && q < g;)
                        if (b[q++].call(b[q++], this, e, d, c)) {
                            f = q;
                            break
                        }
                return f
            },
            addObserver: function(h, d) {
                !e.isFunction(h) && k("callback");
                var c = this.oa || (this.oa = []),
                    g = c.length;
                c[g++] = h;
                d && (c[g] = d);
                c.length = ++g
            },
            removeObserver: function(e, d) {
                var c, g = 0,
                    b;
                if (c = this.oa)
                    for (b = c.length; g < b;) c[g] === e && c[g + 1] === d && (c.splice(g,
                        2), b === 2 && delete this.oa), g += 2;
                return this
            }
        })
    })(nokia.maps.util);
    ovi.provide("nokia.maps.util.OObject");
    (function(e) {
        var k = {},
            h = 0;
        e.OObject = new ovi.Class({
            initialize: function(d) {
                for (var c in d) this.set(c, d[c])
            },
            set: function(d, c, g) {
                var b;
                if (c === void 0 && g === void 0 && typeof d !== "string")
                    for (b in d) this.If(b, d[b]);
                else this.If(d, c, g);
                return this
            },
            If: function(d, c, g) {
                if (d != "__proto__") {
                    var b = this[d],
                        f = this[k[d] || ++h && (k[d] = d + "Setter")];
                    h > 5E3 && (k = {}, h = 0);
                    if (g || c !== b) f && (c = f.call(this, c)), b !== c && this.gd(d, this[d] = c, b)
                }
            },
            get: function(d) {
                return this[d]
            },
            remove: function(d) {
                var c = this[d];
                this.hasOwnProperty(d) &&
                    (delete this[d], c !== this[d] && this.gd(d, this[d], c))
            },
            gd: function(d, c, g) {
                var b = this.ve,
                    f, q, a = 1,
                    r;
                if (b) {
                    r = b["*"];
                    do
                        if (r) {
                            r = r.slice(0);
                            f = r.length;
                            for (q = 0; q < f;)
                                if (r[q++].call(r[q++], this, d, c, g), this[d] !== c) return
                        }
                    while (a-- && (r = b[d]))
                }
            },
            addObserver: function(d, c, g) {
                var b = this.ve || (this.ve = {});
                (b[d] || (b[d] = [])).push(c, g);
                return this
            },
            removeObserver: function(d, c, g) {
                var b = this.ve,
                    f, q, a = 0;
                if (b && (f = b[d]))
                    for (q = f.length; a < q;) f[a] === c && f[a + 1] === g && (f.splice(a, 2), q === 2 && delete b[d]), a += 2;
                return this
            },
            observersSetter: function(d) {
                for (var c in d) this.addObserver(c,
                    d[c])
            }
        })
    })(nokia.maps.util);
    ovi.provide("nokia.maps.util.Point");
    (function(e) {
        function k(a, f, b, c) {
            c || (c = 0);
            return f - c <= a && b + c >= a || f + c >= a && b - c <= a
        }
        var h = Math,
            d = h.abs,
            c = h.sqrt,
            g = h.pow,
            b = h.round,
            f = h.floor,
            q = h.ceil,
            a = h.min,
            r = h.max,
            l = e.d,
            m = e.Point = function(a, f) {
                this.x = +a;
                this.y = +f
            };
        ovi.extend(m.prototype, {
            validate: function() {
                return this.x === +this.x && this.y === +this.y
            },
            equals: function(a) {
                return a ? this === a || this.x === a.x && this.y === a.y : !1
            },
            clone: function() {
                return new m(this.x, this.y)
            },
            toString: function() {
                return this.x + ", " + this.y
            },
            add: function(a) {
                return new m(this.x + a.x,
                    this.y + a.y)
            },
            sub: function(a) {
                return new m(this.x - a.x, this.y - a.y)
            },
            multiply: function(a) {
                return new m(this.x * a, this.y * a)
            },
            divide: function(a) {
                a === 0 && l("divisor can not be Zero");
                return new m(this.x / a, this.y / a)
            },
            modulo: function(a) {
                a === 0 && l("divisor can not be Zero");
                return new m(this.x % a, this.y % a)
            },
            round: function() {
                return new m(b(this.x), b(this.y))
            },
            floor: function() {
                return new m(f(this.x), f(this.y))
            },
            ceil: function() {
                return new m(q(this.x), q(this.y))
            },
            len: function() {
                return c(this.x * this.x + this.y * this.y)
            },
            min: function(f) {
                return new m(a(this.x, f.x), a(this.y, f.y))
            },
            max: function(a) {
                return new m(r(this.x, a.x), r(this.y, a.y))
            },
            span: function(a) {
                return new m(d(this.x - a.x), d(this.y - a.y))
            },
            distance: function(a) {
                return c(g(this.x - a.x, 2) + g(this.y - a.y, 2))
            },
            getNearest: function(a, f) {
                var b = f.x - a.x,
                    c = f.y - a.y,
                    l;
                l = a;
                if (b || c) l = ((this.x - a.x) * b + (this.y - a.y) * c) / (b * b + c * c), l = l <= 0 ? a : l >= 1 ? f : new m(a.x + l * b, a.y + l * c);
                return l
            },
            isCoveredBy: function(a, f, b) {
                return m.isCoveredBy(this.x, this.y, a, f, b)
            }
        });
        m.fromObject = function(a) {
            var f,
                b;
            return a instanceof m ? a : a && ("x" in a && "y" in a && (f = a.x, b = a.y, 1) || a.length === 2 && (f = a[0], b = a[1], 1)) ? new m(f, b) : null
        };
        m.isCoveredBy = function(a, f, b, l, m) {
            for (var r = b.length, q = r, d, e, h, A = b[0], C, E = 0, M = 0, H = l / 2 || 0, K = m ? 1 : 3; C != "V" && q > K;) {
                d = b[--q];
                l = b[--q];
                h = b[q ? q - 1 : (r + (q - 1)) % r];
                e = b[q ? q - 2 : (r + (q - 2)) % r];
                if (l >= a - H && l <= a + H && d >= f - H && d <= f + H || e >= a - H && e <= a + H && h >= f - H && h <= f + H) C = "V";
                else if (!C && l === a) e === a && (d < f && h > f || d > f && h < f) || (A <= a && e > a || A >= a && e < a) && (d >= f ? ++E : ++M), C = k(f, d, h, H) && c(g((a - e) * (d - h) - (f - h) * (l - e), 2) / (g(l - e, 2) +
                    g(d - h, 2))) <= H && "E";
                else if (!C && k(a, l, e, H)) {
                    if (l < a && e > a || l > a && e < a) A = d + (h - d) * ((a - l) / (e - l)), E += A > f, M += A < f;
                    C = k(f, d, h, H) && c(g((a - e) * (d - h) - (f - h) * (l - e), 2) / (g(l - e, 2) + g(d - h, 2))) <= H && "E"
                }
                A = l
            }
            return m && C === "S" && C || C || m && M && E % 2 && "S" || !1
        };
        m.prototype.toString = function() {
            return this.x + ", " + this.y
        }
    })(nokia.maps.util);
    ovi.provide("nokia.maps.util.Rectangle");
    (function(e) {
        var k = Math.max,
            h = e.Point,
            d = e.Rectangle = function(c) {
                for (var d = c.length, b = this.topLeft = c[0].clone(), f = this.bottomRight = b.clone(), q, a; --d >= 0;) {
                    a = (q = c[d]).x;
                    q = q.y;
                    if (a < b.x) b.x = a;
                    else if (a > f.x) f.x = a;
                    if (q < b.y) b.y = q;
                    else if (q > f.y) f.y = q
                }
                return this
            };
        ovi.extend(d.prototype, {
            equals: function(c) {
                var d, b, f, q;
                return !!c && (d = this.topLeft).x === (f = c.topLeft).x && d.y === f.y && (b = this.bottomRight).x === (q = c.bottomRight).x && b.y === q.y
            },
            addPoint: function(c) {
                return new d([this.topLeft, this.bottomRight, c])
            },
            addPoints: function(c) {
                return c.length ?
                    new d(c.concat(this.topLeft, this.bottomRight)) : this
            },
            getCenter: function() {
                var c = this.topLeft,
                    d = this.bottomRight;
                return new h((c.x + d.x) / 2, (c.y + d.y) / 2)
            },
            centerTo: function(c) {
                var g = this.bottomRight,
                    b = c.span(this.topLeft),
                    f = c.span(g),
                    g = k(b.x, f.x),
                    b = k(b.y, f.y);
                return new d([new h(c.x - g, c.y - b), new h(c.x + g, c.y + b)])
            },
            intersection: function(c) {
                var g, b;
                return c && (g = this.topLeft.max(c.topLeft || c)).x <= (b = this.bottomRight.min(c.bottomRight || c)).x && g.y <= b.y ? new d([g, b]) : null
            },
            merge: function(c) {
                return c ? new d([this.topLeft.min(c.topLeft ||
                    c), this.bottomRight.max(c.bottomRight || c)]) : this.clone()
            },
            pad: function(c) {
                return c ? new d([this.topLeft.sub(new h(c, c)), this.bottomRight.add(new h(c, c))]) : this.clone()
            },
            getWidth: function() {
                return this.bottomRight.x - this.topLeft.x
            },
            getHeight: function() {
                return this.bottomRight.y - this.topLeft.y
            },
            toString: function() {
                return "{ " + this.topLeft + ", " + this.bottomRight + " }"
            },
            contains: function(c) {
                if (c) var d = this.topLeft,
                    b = this.bottomRight,
                    f = f = c.topLeft || c,
                    q = c.bottomRight || c;
                return !!c && d.x <= f.x && d.y <= f.y && b.x >=
                    q.x && b.y >= q.y
            },
            clone: function() {
                return new d([this.topLeft, this.bottomRight])
            },
            initialize: d
        });
        d.prototype.toString = function() {
            return "{ " + this.topLeft + ", " + this.bottomRight + " }"
        }
    })(nokia.maps.util);
    ovi.provide("nokia.maps.util.RTreeNode");
    (function(e) {
        var k = Math.max,
            h = Math.min;
        e.RTreeNode = new ovi.Class({
            initialize: function(d, c) {
                this.Leaf = d;
                this.ParentNode = c || null;
                this.Entries = []
            },
            Leaf: null,
            Root: null,
            ParentNode: null,
            ParentEntry: null,
            Entries: null,
            X1: 0,
            X2: 0,
            Y1: 0,
            Y2: 0,
            Volume: null,
            addChild: function(d) {
                this.Entries.push(d);
                this.Leaf = !1;
                d.ParentNode = this;
                d.ParentEntry = this.Entries.length - 1;
                this.updateBoundingBox(d.X1, d.X2, d.Y1, d.Y2)
            },
            removeChild: function(d, c) {
                for (var g = this.Entries, b = g.splice(d, 1)[0], f = d, q = g.length; f < q; f++) g[f].ParentEntry--;
                c && this.calculateBoundingBox();
                return b
            },
            calculateBoundingBox: function() {
                var d = this.Entries,
                    c = d.length;
                this.X1 = Infinity;
                this.X2 = -Infinity;
                this.Y1 = Infinity;
                for (this.Y2 = -Infinity; entry = d[--c];) {
                    if (entry.X1 < this.X1) this.X1 = entry.X1;
                    if (entry.Y1 < this.Y1) this.Y1 = entry.Y1;
                    if (entry.X2 > this.X2) this.X2 = entry.X2;
                    if (entry.Y2 > this.Y2) this.Y2 = entry.Y2
                }
                this.Volume = (this.X2 - this.X1) * (this.Y2 - this.Y1)
            },
            updateBoundingBox: function(d, c, g, b) {
                this.Volume === null ? (this.X1 = d, this.X2 = c, this.Y1 = g, this.Y2 = b) : (this.X1 = h(d, this.X1),
                    this.X2 = k(c, this.X2), this.Y1 = h(g, this.Y1), this.Y2 = k(b, this.Y2));
                this.Volume = (this.X2 - this.X1) * (this.Y2 - this.Y1)
            },
            getEnlargement: function(d, c, g, b) {
                return (k(this.X2, c) - h(this.X1, d)) * (k(this.Y2, b) - h(this.Y1, g)) - this.Volume
            },
            overlaps: function(d, c, g, b) {
                return d < this.X2 && c > this.X1 && g < this.Y2 && b > this.Y1
            }
        })
    })(nokia.maps.util);
    ovi.provide("nokia.maps.util.RTreeRecord");
    (function(e) {
        var k = Math.max,
            h = Math.min;
        e.RTreeRecord = new ovi.Class({
            initialize: function(d, c, g, b) {
                var f;
                d > g && (f = d, d = g, g = f);
                c > b && (f = c, c = b, b = f);
                this.X1 = d || 0;
                this.Y1 = c || 0;
                this.X2 = g || 0;
                this.Y2 = b || 0;
                this.Leaf = !0
            },
            Id: null,
            X1: 0,
            X2: 0,
            Y1: 0,
            Y2: 0,
            Volume: null,
            Priority: 32,
            getEnlargement: function(d, c, g, b) {
                return (k(this.X2, c) - h(this.X1, d)) * (k(this.Y2, b) - h(this.Y1, g)) - this.Volume
            },
            overlaps: function(d, c, g, b) {
                return d < this.X2 && c > this.X1 && g < this.Y2 && b > this.Y1
            }
        })
    })(nokia.maps.util);
    ovi.provide("ovi.Logger");
    (function(e) {
        function k(c, g) {
            for (var b = d.length - 1; b > -1; --b) try {
                d[b][c].apply(d[b], g)
            } catch (f) {}
        }
        var h = !0,
            d = [];
        e.Logger = {
            addLogger: function(c) {
                if (c === null || typeof c !== "object" || typeof c.debug !== "function" || typeof c.info !== "function" || typeof c.warn !== "function" || typeof c.error !== "function") throw new TypeError("Illegal logger object");
                for (var g = d.length - 1; g > -1; --g)
                    if (d[g] === c) return k("warn", ["The logger is already attached"]), !1;
                typeof c.initLogger === "function" && c.initLogger();
                d.push(c);
                return !0
            },
            removeLogger: function(c) {
                for (var g =
                        d.length - 1; g > -1; --g)
                    if (d[g] === c) return d.splice(g, 1), typeof c.cleanupLogger === "function" && c.cleanupLogger(), !0;
                k("warn", ["The passed logger wasn't attached"]);
                return !1
            },
            removeAllLoggers: function() {
                var c = d;
                d = [];
                for (var g = c.length - 1; g > -1; --g)
                    if (typeof c[g].cleanupLogger === "function") try {
                        c[g].cleanupLogger()
                    } catch (b) {}
            },
            isEnabled: function() {
                return h
            },
            enable: function() {
                h = !0
            },
            disable: function() {
                h = !1
            },
            debug: function() {
                h && k("debug", arguments)
            },
            info: function() {
                h && k("info", arguments)
            },
            warn: function() {
                h && k("warn",
                    arguments)
            },
            error: function() {
                h && k("error", arguments)
            }
        };
        e.debug = function() {
            e.Logger.debug.apply(this, arguments)
        };
        e.info = function() {
            e.Logger.info.apply(this, arguments)
        };
        e.warn = function() {
            e.Logger.warn.apply(this, arguments)
        };
        e.error = function() {
            e.Logger.error.apply(this, arguments)
        }
    })(ovi);
    ovi.provide("nokia.maps.util.Vector3D");
    (function(e) {
        var k = Math,
            h = e.d,
            d = k.sqrt,
            c = k.acos,
            g = 180 / Math.PI,
            b;
        e.Vector3D = b = function(f, b, a) {
            this.x = +f;
            this.y = +b;
            this.z = +a
        };
        ovi.extend(b.prototype, {
            add: function(f) {
                return new b(this.x + f.x, this.y + f.y, this.z + f.z)
            },
            subtract: function(f) {
                return new b(this.x - f.x, this.y - f.y, this.z - f.z)
            },
            multiply: function(f) {
                f instanceof b || h("Parameter should be an instanceof nokia.maps.util.Vector3D");
                return new b(this.x * f.x, this.y * f.y, this.z * f.z)
            },
            divide: function(f) {
                (f.x === 0 || f.y === 0 || f.z === 0) && h("Vectors should not be divided by zero");
                return new b(this.x / f.x, this.y / f.y, this.z / f.z)
            },
            angle: function(f, b, a, r) {
                f = +f || 0;
                a = a ? f - this.x : this.x - f;
                f = r ? f - this.y : this.y - (+b || 0);
                f = !a && !f ? 0 : c(f / d(a * a + f * f)) * g;
                a < 0 && (f = 360 - f);
                return f
            },
            dot: function(f) {
                f = this.multiply(f);
                return f.x + f.y + f.z
            },
            magnitude: function() {
                return d(this.dot(this))
            },
            normal: function(f) {
                var c = this.x,
                    a = this.y,
                    r = this.z,
                    l = f.x,
                    m = f.y,
                    f = f.z;
                return new b(a * f - r * m, -(c * f - r * l), c * m - a * l)
            },
            normalize: function() {
                var f = this.magnitude();
                return new b(this.x / f, this.y / f, this.z / f)
            }
        })
    })(nokia.maps.util);
    ovi.provide("nokia.maps.util.Matrix3D");
    (function(e) {
        var k = Math,
            h = k.sqrt,
            d = k.sin,
            c = k.cos,
            g = k.tan,
            b = e.Point,
            f = e.Vector3D,
            q = e.Matrix3D = function(a) {
                this.rows = a || [
                    [1, 0, 0, 0],
                    [0, 1, 0, 0],
                    [0, 0, 1, 0]
                ]
            };
        ovi.extend(q.prototype, {
            ta: function(a) {
                for (var f = this.rows, b, c, p, d = a[0], g = a[1], e = a[2], h = [
                        [],
                        [],
                        []
                    ], k, w = 3; w--;) k = h[w], a = f[w], b = a[0], c = a[1], p = a[2], k[0] = b * d[0] + c * g[0] + p * e[0], k[1] = b * d[1] + c * g[1] + p * e[1], k[2] = b * d[2] + c * g[2] + p * e[2], k[3] = b * d[3] + c * g[3] + p * e[3] + a[3];
                return new q(h)
            },
            concat: function(a) {
                return this.ta(a.rows)
            },
            scale: function(a, f, b) {
                return this.ta([
                    [a,
                        0, 0, 0
                    ],
                    [0, f, 0, 0],
                    [0, 0, b, 0]
                ])
            },
            getScale: function() {
                var a = this.rows,
                    b;
                return new f(h((b = a[0])[0] * b[0] + b[1] * b[1] + b[2] * b[2]), h((b = a[1])[0] * b[0] + b[1] * b[1] + b[2] * b[2]), h((b = a[2])[0] * b[0] + b[1] * b[1] + b[2] * b[2]))
            },
            translate: function(a, f, b) {
                return this.ta([
                    [1, 0, 0, a],
                    [0, 1, 0, f],
                    [0, 0, 1, b]
                ])
            },
            getTranslate: function() {
                return new f(this.rows[0][3], this.rows[1][3], this.rows[2][3])
            },
            rotateX: function(a) {
                var f = d(a),
                    a = c(a);
                return this.ta([
                    [1, 0, 0, 0],
                    [0, a, -f, 0],
                    [0, f, a, 0]
                ])
            },
            rotateY: function(a) {
                var f = d(a),
                    a = c(a);
                return this.ta([
                    [a,
                        0, f, 0
                    ],
                    [0, 1, 0, 0],
                    [-f, 0, a, 0]
                ])
            },
            rotateZ: function(a) {
                var f = d(a),
                    a = c(a);
                return this.ta([
                    [a, -f, 0, 0],
                    [f, a, 0, 0],
                    [0, 0, 1, 0]
                ])
            },
            skewX: function(a) {
                return this.ta([
                    [1, g(a), 0, 0],
                    [0, 1, 0, 0],
                    [0, 0, 1, 0]
                ])
            },
            skewY: function(a) {
                return this.ta([
                    [1, 0, 0, 0],
                    [g(a), 1, 0, 0],
                    [0, 0, 1, 0]
                ])
            },
            transformVector: function(a) {
                var b = this.rows,
                    c, m = a.x,
                    p = a.y,
                    a = a.z;
                return new f((c = b[0])[0] * m + c[1] * p + c[2] * a + c[3], (c = b[1])[0] * m + c[1] * p + c[2] * a + c[3], (c = b[2])[0] * m + c[1] * p + c[2] * a + c[3])
            },
            transformPoint: function(a) {
                var f = this.rows,
                    c, m = a.x,
                    a = a.y;
                return new b((c =
                    f[0])[0] * m + c[1] * a + c[3], (c = f[1])[0] * m + c[1] * a + c[3])
            },
            transformVectors: function(a, f) {
                var b = this.rows,
                    c, p, q, d, g, e = a.length;
                for (g = 0; g < e;) p = +a[g++], q = +a[g++], d = +a[g++], f.push((c = b[0])[0] * p + c[1] * q + c[2] * d + c[3], (c = b[1])[0] * p + c[1] * q + c[2] * d + c[3], (c = b[2])[0] * p + c[1] * q + c[2] * d + c[3])
            },
            transformPoints: function(a, f) {
                var b = this.rows,
                    c, p, q, d, g = a.length;
                for (d = 0; d < g;) p = +a[d++], q = +a[d++], f.push((c = b[0])[0] * p + c[1] * q + c[3], (c = b[1])[0] * p + c[1] * q + c[3])
            },
            clone: function() {
                for (var a = this.rows, f = Array(3), b = 3; b--;) f[b] = a[b].slice();
                return new q(f)
            },
            inverse: function() {
                var a = this.rows,
                    f = a[0],
                    b = a[1],
                    a = a[2],
                    c = f[0],
                    p = f[1],
                    d = f[2],
                    g = b[0],
                    e = b[1],
                    h = b[2],
                    k = a[0],
                    w = a[1],
                    y = a[2],
                    B = c * (e * y - h * w) - p * (y * g - h * k) + d * (g * w - e * k);
                return B === 0 ? null : new q([
                    [(e * y - h * w) / B, (d * w - p * y) / B, (p * h - d * e) / B, -f[3]],
                    [(h * k - g * y) / B, (c * y - d * k) / B, (d * g - c * h) / B, -b[3]],
                    [(g * w - e * k) / B, (k * p - c * w) / B, (c * e - p * g) / B, -a[3]]
                ])
            }
        })
    })(nokia.maps.util);
    ovi.provide("nokia.maps.util.math.clipping");
    (function(e) {
        function k(a) {
            for (var f, b, c = 0, m = a.length; c < m; c++) {
                f = l(a[c].x, a[c].y, b, null, 0, 0);
                if (f.next = b) b.prev = f;
                b = f
            }
            return b
        }

        function h(a, f, b) {
            for (; f != b && f.alpha < a.alpha;) f = f.next;
            a.next = f;
            a.prev = f.prev;
            a.next.prev = a;
            a.prev.next = a
        }

        function d(a, f) {
            var b, m, p = 0,
                r;
            l(0, a.y, null, null, 0, 0);
            m = l(-2147483648, a.y, null, null, 0, 0);
            for (b = f; b.next; b = b.next)(r = c(m, a, b, b.next, {})) && p++;
            return p % 2
        }

        function c(a, f, b, c, l) {
            var m, p;
            p = (f.x - a.x) * (c.y - b.y) - (f.y - a.y) * (c.x - b.x);
            var r;
            if (!p && (a.origx = a.x, a.origy = a.y, a.x += (z() -
                    0.5) / 1E4, a.y += (z() - 0.5) / 1E4, p = (f.x - a.x) * (c.y - b.y) - (f.y - a.y) * (c.x - b.x), !p)) return 0;
            m = ((b.x - a.x) * (c.y - b.y) - (b.y - a.y) * (c.x - b.x)) / p;
            p = ((f.y - a.y) * (b.x - a.x) - (f.x - a.x) * (b.y - a.y)) / p;
            if (m < 0 || m > 1 || p < 0 || p > 1) return 0;
            g(a, f, b, c, l, m);
            if (l.alpha_p === 0 && (r = l.alpha_q) >= 0 && r <= 1) {
                if (!a.origx) a.origx = a.x, a.origy = a.y;
                a.x += (z() - 0.5) / 1E4;
                a.y += (z() - 0.5) / 1E4;
                g(a, f, b, c, l, m)
            }
            return 1
        }

        function g(a, f, c, l, m, p) {
            var r = a.x + p * (f.x - a.x),
                p = a.y + p * (f.y - a.y);
            m.alpha_p = b(a.x, a.y, r, p) / b(a.x, a.y, f.x, f.y);
            m.alpha_q = b(c.x, c.y, r, p) / b(c.x, c.y,
                l.x, l.y);
            m.xi = 1 * r;
            m.yi = 1 * p
        }

        function b(a, f, b, c) {
            return p((a - b) * (a - b) + (f - c) * (f - c))
        }

        function f(f) {
            var b = a(f);
            b.prev.next = f;
            f.prev = b.prev
        }

        function q(a) {
            var f = a;
            if (f) {
                do f = f.next; while (f != a && (!f.intersect || f.intersect && f.visited))
            }
            return f
        }

        function a(a) {
            if (a)
                for (; a.next;) a = a.next;
            return a
        }

        function r(a) {
            for (; a && a.intersect;) a = a.next;
            return a
        }

        function l(a, f, b, c, l, m) {
            var p = {};
            p.x = a;
            p.y = f;
            p.next = b;
            if (p.prev = c) p.prev.next = p;
            if (b) p.next.prev = p;
            p.nextPoly = null;
            p.neighbor = null;
            p.intersect = l;
            p.entry = 0;
            p.visited =
                0;
            p.alpha = m;
            return p
        }
        var e = e.util,
            m = e.Point,
            p = Math.sqrt,
            z = Math.random,
            s;
        e.math.clipping = {
            Is: s = function(a, f, b, c, l, p) {
                var r = a.x,
                    a = -a.y,
                    q = f.x,
                    f = -f.y,
                    d, g, s, b = -b,
                    p = -p;
                if (r > q) {
                    if (q > l || r < c) return;
                    s = r;
                    g = a;
                    r = q;
                    a = f;
                    q = s;
                    f = g;
                    s = 1
                } else if (r > l || q < c) return;
                if (a > f) {
                    if (f > b || a < p) return;
                    d = 1;
                    a = -a;
                    f = -f;
                    g = p;
                    p = -b;
                    b = -g
                } else if (a > b || f < p) return;
                if (r < c) {
                    if ((a += (c - r) * (f - a) / (q - r)) > b) return;
                    r = c
                }
                if (a < p) {
                    if ((r += (p - a) * (q - r) / (f - a)) > l) return;
                    a = p
                }
                q > l && (f = a + (l - r) * (f - a) / (q - r), q = l);
                f > b && (q = r + (b - a) * (q - r) / (f - a), f = b);
                d && (a = -a, f = -f);
                return s ? [new m(q, -f), new m(r, -a)] : [new m(r, -a), new m(q, -f)]
            },
            clipStrips: function(a, f, b, c, l) {
                var p, m, r = a.length,
                    q, d, g, e, h, z, k;
                if (r) {
                    for (p = []; r--;) {
                        z = a[r];
                        e = z.length;
                        h = 0;
                        for (q = 1; q < e; q++)
                            if (k = s(z[q - 1], z[q], f, b, c, l)) d = k[0], g = k[1], h && h.equals(d) ? m.push(g) : p.push(m = k), h = g
                    }
                    e = p.length;
                    e > 1 && p[0][0].equals(p[e - 1][p[e - 1].length - 1]) && p[0].splice.apply(p[0], [0, 1].concat(p.splice(e - 1, 1)[0]))
                } else p = a;
                return p
            },
            INTERSECTION: 0,
            UNION: 1,
            COMPONENT_SHAPE: 2,
            COMPONENT_WINDOW: 3,
            clip: function(b, p, m) {
                var b = k(b),
                    p = k(p),
                    g, s, e, z, A,
                    C, E;
                C = {};
                s = g = 1;
                switch (~~(1 * m)) {
                    case 1:
                        s = g = 0;
                        break;
                    case 2:
                        g = 0;
                        s = 1;
                        break;
                    case 3:
                        g = 1, s = 0
                }
                g = {
                    pS: g,
                    pC: s
                };
                var m = g.pS,
                    M = g.pC,
                    H, K, P;
                if (p && b) {
                    g = a(p);
                    l(p.x, p.y, null, g, 0, 0);
                    s = a(b);
                    l(b.x, b.y, null, s, 0, 0);
                    for (g = p; g.next; g = g.next)
                        if (!g.intersect)
                            for (s = b; s.next; s = s.next)
                                if (!s.intersect && (H = r(g.next), K = r(s.next), e = c(g, H, s, K, C))) e = C.alpha_p, E = C.alpha_q, z = C.xi, A = C.yi, e = l(z, A, null, null, 1, e), z = l(z, A, null, null, 1, E), e.neighbor = z, z.neighbor = e, h(e, g, H), h(z, s, K);
                    C = d(p, b);
                    m && (C = 1 - C);
                    for (g = p; g.next; g = g.next)
                        if (g.intersect) g.entry =
                            C, C = 1 - C;
                    C = d(b, p);
                    M && (C = 1 - C);
                    for (s = b; s.next; s = s.next)
                        if (s.intersect) s.entry = C, C = 1 - C;
                    f(p);
                    for (f(b);
                        (b = q(p)) != p;) {
                        for (m = null; !b.visited; b = b.neighbor)
                            for (C = b.entry;;)
                                if (m = l(b.x, b.y, m, null, 0, 0), b.visited = 1, b = C ? b.next : b.prev, b.intersect) {
                                    b.visited = 1;
                                    break
                                }
                        m.nextPoly = P;
                        P = m
                    }
                    return P
                }
            }
        }
    })(nokia.maps);
    ovi.provide("nokia.maps.util.IBox");
    ovi.provide("nokia.maps.gfx.Color");
    (function() {
        var e = Math.round,
            k = RegExp("^\\s*(maroon|red|orange|yellow|olive|purple|fuchsia|white|lime|green|navy|blue|aqua|teal|black|silver|gray|grey|pink)\\s*$|^\\s*[#]?([0-9a-f]{8,8})\\s*$|^\\s*[#]?([0-9a-f]{6,6})\\s*$|^\\s*[#]?([0-9a-f]{4,4})\\s*$|^\\s*[#]?([0-9a-f]{3,3})\\s*$|^\\s*(rgb[a]?)\\(\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\s*,?\\s*(\\d*[.]{0,1}\\d*)?\\s*\\)\\s*$", "i"),
            h = {
                maroon: "800000",
                red: "ff0000",
                orange: "ffa500",
                yellow: "ffff00",
                olive: "808000",
                purple: "800080",
                fuchsia: "ff00ff",
                white: "ffffff",
                lime: "00ff00",
                green: "008000",
                navy: "000080",
                blue: "0000ff",
                aqua: "00ffff",
                teal: "008080",
                black: "000000",
                silver: "c0c0c0",
                gray: "808080",
                grey: "808080",
                pink: "ffc0cb"
            },
            d = nokia.maps.gfx.Color = new ovi.Class({
                Statics: {
                    byteOf: function(c) {
                        return e(c * 255) & 255
                    },
                    percentOf: function(c) {
                        return c > 255 ? 1 : c < 0 ? 0 : c / 255
                    },
                    compress: function(c, d, b, f) {
                        return (c & 255) << 24 >>> 0 | (d & 255) << 16 | (b & 255) << 8 | f & 255
                    },
                    red: function(c) {
                        return c >>> 24
                    },
                    green: function(c) {
                        return c >>> 16 & 255
                    },
                    blue: function(c) {
                        return c >>> 8 & 255
                    },
                    alpha: function(c) {
                        return c &
                            255
                    },
                    parseCss: function(c, g) {
                        var b, f, q, a = k.exec(c),
                            r, l;
                        if (a && a.length > 1) {
                            b = isNaN(g) ? 255 : g * 255 & 255;
                            f = b.toString(16).toLowerCase();
                            f.length < 2 && (f = "0" + f);
                            if (a[1]) q = h[a[1]] + f;
                            else if (a[2]) q = a[2];
                            else if (a[3]) q = a[3] + f;
                            else if (r = a[4] || a[5]) q = r.replace(/(.)/g, "$1$1"), r.length === 3 && (q += f);
                            else if (a[6]) return d.compress(a[7], a[8], a[9], (l = +a[10], isNaN(l) ? b : e((l < 0 ? 0 : l) * 255)));
                            if (q && q.length === 8) return parseInt(q, 16) >>> 0
                        }
                        return null
                    },
                    getCssRGBA: function(c) {
                        return d.getCssRGB(c, !0)
                    },
                    getCssRGB: function(c, d) {
                        return "rgb" +
                            (d ? "a(" : "(") + (c >>> 24) + ", " + (c >>> 16 & 255) + ", " + (c >>> 8 & 255) + (d ? (", " + (c & 255) / 255).substr(0, 7) + ")" : ")")
                    },
                    getCssHex: function(c, d, b) {
                        c = (c >>> (d ? 0 : 8)).toString(16);
                        d = (d ? 8 : 6) - c.length;
                        return (b || "#") + (d > 0 ? "0000000".substr(-d) + c : c)
                    }
                }
            })
    })();
    ovi.provide("nokia.maps.util.Brush");
    (function(e) {
        var k = nokia.maps.gfx.Color;
        e.Brush = new ovi.Class({
            color: "#05A6",
            fill: "solid",
            initialize: function(h, d) {
                var c, g, b = e.d;
                h && ("color" in h && (c = k.parseCss(h.color), c === null && b("Invalid color set!")), "fill" in h && h.fill !== "solid" && h.fill !== "none" && b("Invalid fill set!"));
                if (d instanceof nokia.maps.util.Brush)
                    for (g in d) this[g] = d[g];
                for (g in h) this[g] = h[g]
            },
            ea: function() {
                return this.c || (this.c = e.Eg(this))
            }
        })
    })(nokia.maps.util);
    ovi.provide("ovi.dom.common");
    ovi.dom.addEvent = function(e, k, h, d) {
        e.addEventListener ? e.addEventListener(k, h, d !== void 0 ? d : !1) : e.attachEvent && e.attachEvent("on" + k, h)
    };
    ovi.dom.removeEvent = function(e, k, h, d) {
        e.removeEventListener ? e.removeEventListener(k, h, d !== void 0 ? d : !1) : e.detachEvent && e.detachEvent("on" + k, h)
    };
    ovi.dom.addClass = function(e) {
        for (var k = Array.prototype.slice.call(arguments, 1), h = e.className, d = " " + h + " ", c = 0, g; g = k[c++];) d.indexOf(" " + g + " ") === -1 && (h += (h ? " " : "") + g);
        return e.className = h
    };
    ovi.dom.removeClass = function(e) {
        for (var k = Array.prototype.slice.call(arguments, 1), h = e.className.split(" "), d = 0, c = 0, g = h.length, b; b = k[d++];)
            for (c = g; c--;) b === h[c] && h.splice(c, 1);
        return e.className = h.join(" ")
    };
    ovi.dom.hasClass = function(e) {
        for (var k = Array.prototype.slice.call(arguments, 1), h = " " + e.className + " ", d = k.length, c = 0, g; d && (g = k[c++]);) d = h.indexOf(" " + g + " ") > -1;
        return d
    };
    ovi.dom.toggleClass = function(e) {
        for (var k = Array.prototype.slice.call(arguments, 1), h = " " + e.className + " ", d, c = 0, g = k.length; c < g; c++) d = k[c], (h.indexOf(" " + d + " ") > -1 ? ovi.dom.removeClass : ovi.dom.addClass)(e, d)
    };
    ovi.dom.offset = function(e, k) {
        var h = e.getBoundingClientRect(),
            d = e.ownerDocument,
            c = d.documentElement,
            g = d.body,
            d = h.top + (c.scrollTop || g.scrollTop) - c.clientTop,
            h = h.left + (c.scrollLeft || g.scrollLeft) - c.clientLeft;
        k && (c = ovi.dom.offset(k), d -= c.top, h -= c.left);
        return {
            top: d,
            left: h
        }
    };
    ovi.dom.dimensions = function(e) {
        if ("scrollTo" in e && e.document) return e = e.document.documentElement, {
            width: e.clientWidth,
            height: e.clientHeight
        };
        return {
            width: e.offsetWidth,
            height: e.offsetHeight
        }
    };
    ovi.dom.getStyle = function() {
        if (window.getComputedStyle) {
            var e = ["moz", "ms", "webkit"];
            ovi.dom.getStyle = function(d, c) {
                var g = d.ownerDocument.defaultView;
                if (!g) return null;
                var g = g.getComputedStyle(d, null),
                    b = g.getPropertyValue(c);
                if (b) return b;
                for (var f = 0, q = e.length; f < q; f++)
                    if (b = g.getPropertyValue("-" + e[f] + "-" + c)) return b;
                return null
            }
        } else {
            var k = /-([a-z])/ig,
                h = function(d, c) {
                    return c.toUpperCase()
                };
            ovi.dom.getStyle = function(d, c) {
                c = c === "float" ? "styleFloat" : c.replace(k, h);
                return d.currentStyle[c] || d.currentStyle["Ms" +
                    c.charAt(0).toUpperCase() + c.slice(1)] || null
            }
        }
        return ovi.dom.getStyle.apply(null, arguments)
    };
    ovi.provide("nokia.maps.map.component.Component");
    (function(e) {
        var k = nokia.maps.util.d,
            h = {
                "2d": "MAP_2D",
                "3d": "GLOBE",
                panorama: "PANORAMA"
            },
            d = e.Component = new ovi.Class({
                Extends: nokia.maps.util.OObject,
                getId: function() {
                    if (window) return this.c
                },
                getVersion: function() {
                    return this.n
                },
                queryReference: function() {
                    this.He++;
                    return this
                },
                releaseReference: function() {
                    return this.He !== 0 ? --this.He : 0
                },
                attach: function(c) {
                    this.mapDisplay && k("Error: A component can only be attached to one display!");
                    this.mapDisplay = c
                },
                detach: function() {
                    delete this.mapDisplay
                },
                destroy: nokia.maps.util.A,
                isCompatible: function(c) {
                    return this.s & this[h[c]]
                },
                capture: nokia.maps.util.A,
                MAP_2D: 1,
                PANORAMA: 2,
                GLOBE: 4,
                He: 1,
                s: 0
            });
        ovi.Array("Overview TypeSelector DistanceMeasurement InfoBubbles ScaleBar ViewControl ZoomBar ZoomRectangle OverlaysSelector ContextMenu Traffic TrafficIncidents Panorama PublicTransport".split(" ")).forEach(function(c) {
            e[c] = function() {
                ovi.warn("There is no UI defined for the display. Are you missing the UI package?");
                return new d({
                    c: c + "Dummy",
                    n: "0"
                })
            }
        })
    })(nokia.maps.map.component);
    ovi.provide("nokia.maps.positioning._packaging.base");
    ovi.provide("ovi.json");
    (function() {
        function e(e, d) {
            if (typeof d === "string") {
                var c = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.(\d{3}))?Z$/.exec(d);
                if (c) return new Date(Date.UTC(+c[1], +c[2] - 1, +c[3], +c[4], +c[5], +c[6], +c[8] || 0))
            }
            return d
        }
        var k = window.JSON || {};
        window.JSON || function() {
            function e(a) {
                return a < 10 ? "0" + a : a
            }

            function d(f) {
                b.lastIndex = 0;
                return b.test(f) ? '"' + f.replace(b, function(f) {
                    var b = a[f];
                    return typeof b === "string" ? b : "\\u" + ("0000" + f.charCodeAt(0).toString(16)).slice(-4)
                }) + '"' : '"' + f + '"'
            }

            function c(a, b) {
                var g,
                    s, v, k, x = f,
                    w, y = b[a];
                y && typeof y === "object" && (g = Object.prototype.toString.apply(y), g === "[object Date]" ? y = y.getUTCFullYear() + "-" + e(y.getUTCMonth() + 1) + "-" + e(y.getUTCDate()) + "T" + e(y.getUTCHours()) + ":" + e(y.getUTCMinutes()) + ":" + e(y.getUTCSeconds()) + "Z" : l.test(g) && (y = y.valueOf()));
                typeof r === "function" && (y = r.call(b, a, y));
                switch (typeof y) {
                    case "string":
                        return d(y);
                    case "number":
                        return isFinite(y) ? String(y) : "null";
                    case "boolean":
                    case "null":
                        return String(y);
                    case "object":
                        if (!y) return "null";
                        f += q;
                        w = [];
                        if (Object.prototype.toString.apply(y) ===
                            "[object Array]") {
                            k = y.length;
                            for (g = 0; g < k; g += 1) w[g] = c(g, y) || "null";
                            v = w.length === 0 ? "[]" : f ? "[\n" + f + w.join(",\n" + f) + "\n" + x + "]" : "[" + w.join(",") + "]";
                            f = x;
                            return v
                        }
                        if (r && typeof r === "object") {
                            k = r.length;
                            for (g = 0; g < k; g += 1) s = r[g], typeof s === "string" && (v = c(s, y)) && w.push(d(s) + (f ? ": " : ":") + v)
                        } else
                            for (s in y) Object.hasOwnProperty.call(y, s) && (v = c(s, y)) && w.push(d(s) + (f ? ": " : ":") + v);
                        v = w.length === 0 ? "{}" : f ? "{\n" + f + w.join(",\n" + f) + "\n" + x + "}" : "{" + w.join(",") + "}";
                        f = x;
                        return v
                }
            }
            var g = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                b = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                f, q, a = {
                    "\u0008": "\\b",
                    "\t": "\\t",
                    "\n": "\\n",
                    "\u000c": "\\f",
                    "\r": "\\r",
                    '"': '\\"',
                    "\\": "\\\\"
                },
                r, l = /\[object (String|Number|Boolean)\]/;
            if (typeof k.stringify !== "function") k.stringify = function(a, b, l) {
                var d;
                q = f = "";
                if (typeof l === "number")
                    for (d = 0; d < l; d += 1) q += " ";
                else typeof l === "string" && (q = l);
                if ((r = b) && typeof b !== "function" && (typeof b !== "object" || typeof b.length !== "number")) throw Error("JSON.stringify");
                return c("", {
                    "": a
                })
            };
            if (typeof k.parse !== "function") k.parse = function(a, f) {
                function b(a, c) {
                    var l, m, r = a[c];
                    if (r && typeof r === "object")
                        for (l in r) Object.hasOwnProperty.call(r, l) && (m = b(r, l), m !== void 0 ? r[l] = m : delete r[l]);
                    return f.call(a, c, r)
                }
                var c;
                g.lastIndex = 0;
                g.test(a) && (a = a.replace(g, function(a) {
                    return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                }));
                if (/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                        "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return c = eval("(" + a + ")"), typeof f === "function" ? b({
                    "": c
                }, "") : c;
                throw new SyntaxError("JSON.parse");
            }
        }();
        ovi.json = {
            parse: function(h, d) {
                return k.parse(h, d === void 0 ? e : d)
            },
            stringify: k.stringify
        }
    })();
    ovi.provide("nokia.maps.net.IResult");
    ovi.provide("nokia.maps.behavior._packaging.base");
    ovi.provide("nokia.maps.map._packaging.base");
    ovi.provide("nokia.maps.dom.Touch");
    ovi.provide("nokia.maps.dom");
    (function(e) {
        function k(f, b) {
            var a = b.width,
                c = b.height,
                l = f.getContext("2d");
            l.globalCompositeOperation = "copy";
            l.drawImage(b, 0, 0, a, c, 0, 0, a, c)
        }

        function h(f, b) {
            if ("$n$opacity" in b) f.$n$opacity = b.$n$opacity, f.$n$width = b.$n$width, f.$n$height = b.$n$height
        }
        var d = null,
            c = function() {
                var f = new Image;
                f.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
                return f.width !== f.cloneNode(!1).width
            }(),
            g = function() {
                var f = document.createElement("script");
                f.text = "//";
                return !f.cloneNode(!0).text
            }(),
            b = ovi.browser.msie;
        ovi.extend(e, {
            contains: b ? function(f, b) {
                var a = ovi.type(f),
                    c = ovi.type(b);
                return (a == "document" || a == "element") && (c == "element" || c == "textnode") ? f.contains(b) : !1
            } : function(f, b) {
                for (; b;) {
                    if (b === f) return !0;
                    b = b.parentNode
                }
                return !1
            },
            cloneNode: function(f, b) {
                var a, r = f.nodeName;
                if (r === "IMG") c ? (a = f.ownerDocument.createElement("img"), a.src = f.src) : a = f.cloneNode(!1);
                else if (a = f.cloneNode(!!b), r === "CANVAS") k(a, f);
                else if (g && (nodeScripts = f.getElementsByTagName("script"), i = nodeScripts.length))
                    for (cloneScripts =
                        a.getElementsByTagName("script"); i--;) cloneScripts[i].text = nodeScripts[i].text;
                h(a, f);
                return a
            },
            importNode: document.importNode && document.importNode.toString().indexOf("[native code]") > 0 && !b ? function(f, b, a) {
                f = f.importNode(b, !!a);
                b.nodeName === "CANVAS" && k(f, b);
                h(f, b);
                return f
            } : function(f, b, a) {
                var c, l, m, p, d;
                if (f !== b.ownerDocument) {
                    m = b.attributes;
                    c = f.createElement(b.nodeName);
                    for (l = m.length; l--;)
                        if ((p = m[l]).specified)(d = p.name) === "style" ? c.style.cssText = b.style.cssText : d === "class" ? c.className = b.className :
                            c.setAttribute(d, p.value);
                    if (a)
                        for (l = b.firstChild; l;) c.appendChild(e.importNode(f, l, a)), l = l.nextSibling
                } else c = e.cloneNode(b, a);
                b.nodeName === "CANVAS" && k(c, b);
                h(c, b);
                return c
            },
            isQuirksMode: function(f) {
                ovi.type(f) !== "document" && (f = document);
                if (!f || typeof f.compatMode !== "string") return !0;
                return f.compatMode === "BackCompat" || f.compatMode === "QuirksMode"
            },
            supportsCanvas: function() {
                var f = document.createElement("CANVAS"),
                    b;
                return f && f.getContext && (b = f.getContext("2d")) && typeof b.fillText === "function"
            }(),
            getWindowSize: function(f) {
                if (ovi.type(f) !==
                    "window" && (f = window, ovi.type(f) !== "window")) return null;
                var b = document.images && document.compatMode && document.compatMode.indexOf("CSS1") >= 0,
                    a = f.document;
                if (f.innerWidth) return {
                    width: f.innerWidth,
                    height: f.innerHeight
                };
                if (b) return f = a.body.parentElement, {
                    width: f.clientWidth,
                    height: f.clientHeight
                };
                if (a.body && a.body.clientWidth) return {
                    width: a.body.clientWidth,
                    height: a.body.clientHeight
                };
                return null
            },
            setStyle: function(f, b) {
                var a = {
                    constructor: !0,
                    prototype: !0
                };
                if (b && f && f.style)
                    for (var c in b) !a[c] && c in f.style &&
                        (f.style[c] = b[c]);
                return f
            },
            getStyle: function(f, b) {
                if (document.defaultView && document.defaultView.getComputedStyle) {
                    var a = f.ownerDocument.defaultView.getComputedStyle(f, "");
                    if (!a) return !1;
                    return a[b]
                } else return f.currentStyle[b]
            },
            ownerWindow: function(f) {
                var b = ovi.type(f),
                    a = null;
                if (!f) return null;
                if (b === "window") return f;
                if (b === "document") a = f;
                else if (f.ownerDocument) a = f.ownerDocument;
                else return null;
                return a.parentWindow || a.defaultView
            },
            getScrollBarSize: function() {
                if (d) return d;
                var f = document,
                    b = 0,
                    a = 0,
                    c = 0,
                    l = 0,
                    m = 0,
                    p = 0,
                    g = f.createElement("P"),
                    s = f.createElement("P"),
                    e, h;
                try {
                    e = g.style;
                    h = s.style;
                    e.height = "200px";
                    e.width = "200px";
                    h.position = "absolute";
                    h.top = 0;
                    h.left = 0;
                    h.visibility = "hidden";
                    h.width = "100px";
                    h.height = "100px";
                    h.overflow = "hidden";
                    s.appendChild(g);
                    f.body.appendChild(s);
                    a = s.offsetWidth;
                    m = s.offsetHeight;
                    h.overflow = "scroll";
                    c = s.offsetWidth;
                    p = s.offsetHeight;
                    if (a === c) c = s.clientWidth;
                    if (m === p) p = s.clientHeight;
                    f.body.removeChild(s);
                    b = a - c;
                    l = m - p
                } catch (k) {
                    l = b = 0
                }
                return l !== l || b !== b || l <= 0 || b <= 0 ? d = {
                    width: 17,
                    height: 17
                } : d = {
                    width: b,
                    height: l
                }
            },
            hb: function(f, b, a, c) {
                b = f.ownerDocument.createElement(b);
                if (a) b.className = a;
                if (c) b.style.cssText = c;
                f.appendChild(b);
                return b
            },
            Qk: function(f, b) {
                var a = f.styleSheets,
                    c = a.length,
                    l, m, p = f.createElement("style");
                p.setAttribute("type", "text/css");
                f.getElementsByTagName("head")[0].appendChild(p);
                l = a[a.length - 1];
                a.length > c ? b(l) : m = setInterval(function() {
                    for (var f = a.length, c; f--;) c = a[f], c.ownerNode === p && (b(c), e.Fg.push(c), clearInterval(m))
                }, 50)
            },
            Fg: [],
            zp: function(f, c) {
                for (var a =
                        e.Fg, r = a.length; r--;)
                    if (b && a[r].owningElement.ownerDocument === f || a[r].ownerNode.ownerDocument === f) break;
                r < 0 ? e.Qk(f, c) : c(a[r])
            },
            Ao: b ? function(f, b, a) {
                return f.rules[f.addRule(b, a)]
            } : function(f, b, a) {
                b = f.insertRule(b.concat("{", a, "}"), f.cssRules.length);
                return f.cssRules[b]
            },
            Vq: b ? function(f, b) {
                for (var a = f.rules, c = a.length; c--;)
                    if (a[c] === b) {
                        f.removeRule(c);
                        break
                    }
            } : function(f, b) {
                for (var a = f.cssRules, c = a.length; c--;)
                    if (a[c] === b) {
                        f.deleteRule(c);
                        break
                    }
            },
            Hd: b && document.createElement("p").style.opacity === void 0 ?
                function(f, b) {
                    var a = f.style,
                        c = Math.round(b * 100);
                    a.MsFilter = '"progid:DXImageTransform.Microsoft.Alpha(opacity=' + c + ')"';
                    a.filter = "alpha(opacity=" + c + ")"
                } : function(f, b) {
                    f.style.opacity = b
                },
            St: b ? function(f) {
                var b = this.Wl(f),
                    a = b.getPropertyValue("background-image"),
                    c, l, m, p = f.ownerDocument,
                    d;
                if (a.toLowerCase().indexOf(".png") != -1) c = b.getPropertyValue("background-position-x"), b = b.getPropertyValue("background-position-y"), d = p.createElement("img"), m = p.createElement("div"), m.style.position = "absolute", m.style.left =
                    c, m.style.top = b, l = p.createElement("div"), m.appendChild(l), l.style.position = "absolute", f.style.overflow = "hidden", d.onload = function() {
                        l.style.filter = ["progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, src='", a, "', sizingMethod='scale')"].join("");
                        l.style.width = this.width + "px";
                        l.style.height = this.height + "px";
                        m.style.width = this.width + "px";
                        m.style.height = this.height + "px"
                    }, a = a.substr(5, a.length - 7), d.src = a, f.insertBefore(m, f.firstChild), f.style.background = "", f.opacityWrapper = m
            } : function() {},
            Wl: b && !window.getComputedStyle ? function(f) {
                return new function(f) {
                    this.el = f;
                    this.getPropertyValue = function(a) {
                        var f = /(\-([a-z]){1})/g;
                        a == "float" && (a = "styleFloat");
                        f.test(a) && (a = a.replace(f, function(a, f, b) {
                            return b.toUpperCase()
                        }));
                        return this.el.currentStyle[a] ? this.el.currentStyle[a] : null
                    }
                }(f)
            } : window.getComputedStyle,
            findElement: function(f, b) {
                if (b.querySelectorAll) {
                    var a = b.querySelectorAll("." + f);
                    return a.length ? a[a.length - 1] : null
                }
                for (var c = RegExp("(^|\\s)" + f + "($|\\s)"), a = b.getElementsByTagName("*"),
                        l = a.length; l--;)
                    if (c.test(a[l].className)) return a[l];
                return null
            },
            bc: function(f) {
                for (var b; b = f.firstChild;) f.removeChild(b)
            }
        })
    })(nokia.maps.dom);
    ovi.provide("nokia.maps.dom.TouchList");
    window.navigator.msPointerEnabled && function(e) {
        function k(e) {
            ovi.extend(e, {
                Tg: function(d) {
                    for (var c = this.length, g = -1; c--;)
                        if (this[c].pointerId === d.pointerId) {
                            g = c;
                            break
                        }
                    return g
                },
                Ok: function(d) {
                    for (var c = 0, g = d.length; c < g; c++) this.M(d[c])
                },
                M: function(d) {
                    var c = this.Tg(d);
                    if (c === -1) c = this.length;
                    d.type = "MSPointerMove";
                    d.identifier = d.pointerId;
                    d.force = d.pressure;
                    d.radiusX = d.radiusY = 1;
                    d.rotationAngle = 0;
                    this[c] = d
                },
                R: function(d) {
                    d = this.Tg(d);
                    d >= 0 && this.splice(d, 1)
                },
                identifiedTouch: function(d) {
                    for (var c = this.length; c--;)
                        if (this[c].identifier ===
                            d) return this[c];
                    return null
                },
                item: function(d) {
                    return this[d]
                }
            })
        }
        e.TouchList = function() {
            function e() {
                var d = Object.create(Array.prototype),
                    d = Array.apply(d, arguments) || d;
                k(d);
                return d
            }
            ovi.extend(e, {
                fromArray: function(d) {
                    return e.apply(null, d)
                },
                isArray: function(d) {
                    return Object.prototype.toString.call(d).toLowerCase() === "[object array]"
                }
            });
            return e
        }()
    }(nokia.maps.dom);
    ovi.provide("nokia.maps.gfx.Image");
    (function() {
        var e = nokia.maps.gfx.Image = new ovi.Class({
            Statics: {
                c: 0,
                fromObjectListener: [],
                fromObject: function(k, h) {
                    for (var d = e.fromObjectListener, c, g = d.length, h = h || document; g--;)
                        if (c = d[g](k, h)) return c
                }
            },
            width: 0,
            height: 0,
            opacity: 1
        })
    })();
    ovi.provide("nokia.maps.gfx.Painter");
    nokia.maps.gfx.Painter = new ovi.Class({
        Statics: {
            defaultPainter: null,
            Ki: function(e) {
                return (e = +e) !== e || e < 0 || e > 1 ? 1 : e
            }
        }
    });
    ovi.provide("nokia.maps.util.FontHelper");
    (function(e) {
        function k(c, d) {
            return c = c.replace(RegExp("(?:((?:x*-)?small(?:er)?(?![-])|medium|(?:x*-)?large(?:r)?|[0-9]*\\.?[0-9]+(?:px|pt|em|ex|%)))(?:/((?:[0-9]*\\.?[0-9]+(?:px|pt|em|ex|%)|normal)))?", "gi"), function(b, f, c) {
                if (f && f !== "") d.size = f;
                if (c && c !== "") d.lineHeight = c;
                return ""
            })
        }

        function h(c, d) {
            var b = [],
                c = c.replace(RegExp("(?:(italic|oblique)|(small-caps)|(bold(?:er)?|lighter|[1-9]00)|(inherit|normal))+", "gi"), function(f, c, a, r, l) {
                    c && c !== "" ? d.style = c : a && a !== "" ? d.variant = a : r && r !== "" ? d.weight =
                        r : l && l !== "" && b.push(l);
                    return ""
                });
            !d.style && b.length && (d.style = b.shift());
            !d.variant && b.length && (d.variant = b.shift());
            !d.weight && b.length && (d.weight = b.shift());
            return c
        }
        var d = e.d;
        e.FontHelper = {
            parse: function(c) {
                var d = {},
                    b = 0,
                    f = [],
                    q, c = c.replace(RegExp("'.*'|\".*\"", "gi"), function(a) {
                        q = "_s_" + b;
                        f[b] = a;
                        b++;
                        return q
                    }),
                    c = k(c, d),
                    c = h(c, d),
                    c = c.replace(/_s_([\d]+)/, function(a, b) {
                        return f[b]
                    }),
                    c = c.replace(/^[\s]+/, "");
                if (c !== "") d.family = c;
                if (typeof d.size === "string") d.size = e.FontHelper.uh(d.size);
                return d
            },
            uh: function(c) {
                var g =
                    /([0-9]*(\.[0-9]*){0,1}(e[\+\-]{1}[0-9]*){0,1})\s*([a-zA-Z]+)/g,
                    b = g.exec(c);
                g.exec("");
                if (b) {
                    c = parseFloat(b[1]);
                    switch (b = b[4].toLowerCase()) {
                        case "pt":
                            c = c * 96 / 72;
                            break;
                        case "pc":
                            c = c * 96 / 72 * 12;
                            break;
                        case "mm":
                            c = c * 96 / 25.4;
                            break;
                        case "cm":
                            c = c * 96 / 25.4 * 10;
                            break;
                        case "in":
                            c *= 96;
                            break;
                        case "px":
                            break;
                        case "em":
                        case "ex":
                            d("Unsupported font size unit: " + b);
                            break;
                        default:
                            d("Unknown font size unit: " + b)
                    }
                    return c + "px"
                }
                return parseFloat(c) + "px"
            },
            toString: function(c) {
                var d = [];
                c.style && d.push(c.style);
                c.variant &&
                    d.push(c.variant);
                c.weight && d.push(c.weight);
                c.size && (c.lineHeight ? d.push(c.size + "/" + c.lineHeight) : d.push(c.size));
                c.family && d.push(c.family);
                return d.join(" ")
            }
        }
    })(nokia.maps.util);
    ovi.provide("nokia.maps.geo.Coordinate");
    (function(e) {
        var k = e.util,
            h = Math,
            d = h.abs,
            c = h.floor,
            g = h.round,
            b = h.min,
            f = h.log,
            q = h.tan,
            a = h.sqrt,
            r = h.pow,
            l = h.sin,
            m = h.cos,
            p = h.asin,
            z = h.atan2,
            s = h.PI,
            v = s / 180,
            u = s / 4,
            x = s / 2,
            w = s * 2,
            y = s * 3,
            B = 180 / s,
            D = k.Vector3D,
            A = e.geo.Coordinate = function(a, f, b, c, l) {
                c || A.isValid(a, f, b, l) || k.d("Coordinate: lat:" + a + ", lng:" + f + (b ? ", alt:" + b : "") + (l ? ", altMode:" + l : ""));
                this.longitude = +f;
                this.latitude = +a;
                b !== void 0 && (this.altitude = +b);
                if (l !== void 0) this.altMode = l
            };
        ovi.extend(A.prototype, {
            altitude: void 0,
            distance: function(f, c) {
                if (c) return this.Gl(f);
                var d = this.latitude * v,
                    q = f.latitude * v;
                return 12742E3 * p(b(1, a(r(l((d - q) / 2), 2) + m(d) * m(q) * r(l((this.longitude * v - f.longitude * v) / 2), 2))))
            },
            ri: function() {
                var a = (this.latitude + 90) * v,
                    f = this.longitude * v,
                    b = 6371E3 + (this.altitude || 0),
                    c = l(a);
                return new D(b * c * m(f), b * c * l(f), b * m(a))
            },
            Gl: function(f) {
                var b = this.ri(),
                    f = f.ri();
                return a(r(b.x - f.x, 2) + r(b.y - f.y, 2) + r(b.z - f.z, 2))
            },
            uo: function(a, f) {
                if (f /= 6371E3) {
                    a *= v;
                    var b = v * this.latitude,
                        c = l(b),
                        r = l(f),
                        d = m(f),
                        q = v * this.longitude,
                        g = m(b),
                        b = p(g * m(a) * r + c * d),
                        c = z(l(a) * g * r, d - c * l(b)),
                        q = ((q + c + s) % (2 * s) - s) * B
                }
                return f ? new A(b * B, (q + 540) % 360 - 180) : this
            },
            walk: function(a, b, c) {
                var p, r, g, e, h;
                if (c) return this.uo(a, b);
                a = (a % 360 + 360) % 360;
                if (!((a + 90) % 180)) return a = this.longitude + b / (w * m(this.latitude * v) * 6371E3) * (a === 270 ? -360 : 360), new A(this.latitude, (a + 540) % 360 - 180);
                if (b /= 6371E3) a *= v, p = this.latitude * v, r = this.longitude * v, g = p + b * m(a), e = g - p, c = f(q(g / 2 + u) / q(p / 2 + u)), c = !isNaN(e / c) ? e / c : m(p), h = b * l(a) / c, d(g) > x && (g = g > 0 ? s - g : -(s - g));
                return b ? new A(g * B, ((r + h + y + (d(p + e) > x ? s : 0)) % w - s) * B) : this
            },
            equals: function(a) {
                return a &&
                    this.latitude === a.latitude && this.longitude === a.longitude || !1
            }
        });
        ovi.extend(A, {
            isValid: function(a, f, b, c) {
                return a != null && a === +a && a >= -90 && a <= 90 && f != null && f === +f && f >= -180 && f <= 180 && (b === void 0 || b === +b && d(b) !== Infinity) && (c === void 0 || A.altModes.indexOf(c) > -1)
            },
            altModes: ovi.Array(["GL", "OL", "SL", "SB", "WE", "WG"]),
            fromObject: function() {
                var a, f, b, c, l;
                a = arguments;
                var p = a[0];
                l = a.length;
                if (p instanceof A) return p;
                if (l > 1) p = a;
                else if (p) l = p.length;
                else return null;
                a = p[0];
                f = p[1];
                b = p[2];
                c = p[3];
                if (l === 2 && a === +a && f ===
                    +f) return new A(a, f);
                if (l === 3 && a === +a && f === +f && b === +b) return new A(a, f, b);
                if (l === 4 && a === +a && f === +f && b === +b && (c === void 0 || A.altModes.indexOf(c) > -1)) return new A(a, f, b, !1, c);
                l = p.lat;
                a = p.lng;
                if (l !== void 0 && a !== void 0) {
                    if (l === +l && a === +a) return new A(+l, +a);
                    return null
                }
                l = p.latitude;
                a = p.longitude;
                if (l !== void 0 && a !== void 0 && l === +l && a === +a) return new A(+l, +a);
                return null
            },
            gg: function(a, f, b) {
                var l = g(d(a) * 3600) / 3600,
                    p = c(l),
                    l = (l - p) * 3600,
                    m = c(l / 60);
                return p + "\u00b0 " + m + "' " + g(l - m * 60) + '" ' + (a < 0 ? b : f)
            },
            asString: function(a) {
                return A.gg(a.latitude,
                    "N", "S") + ", " + A.gg(a.longitude, "E", "W")
            }
        });
        A.prototype.toString = function() {
            return A.asString(this)
        }
    })(nokia.maps);
    ovi.provide("nokia.maps.util.QuadTree");
    (function(e) {
        function k(f, b) {
            for (var a, c, l, m, p, d, g, e = 0, h, x, w = 4, y; w--;) {
                y = w + 4;
                p = [];
                a = +!(w % 3);
                d = b[w];
                for (h = (c = f[w]).length; h--;) {
                    l = c[h];
                    if (m = l.q)
                        for (x = m.length; x--;)
                            if (((g = m[x][y]) > d) - a) d = g;
                    for (x = 4; x--;)
                        if (m = l[x]) a ? m[y] < d && p.push(m) : m[y] > d && p.push(m)
                }
                e += p.length;
                b[w] = d;
                f[w] = p
            }
            e && (b = k(f, b));
            return b
        }

        function h() {
            e.d("Entry out of tree bounds")
        }
        var d = 1,
            c = e.QuadTree = new ovi.Class({
                initialize: function(f, b, a, c, l) {
                    this.Jg = f || 10;
                    this.Uh = b || 1;
                    this.Vh = a || 1;
                    this.og = c || 0;
                    this.pg = l || 0;
                    this.flush()
                },
                Statics: {
                    MIN_X: "7",
                    MIN_Y: "4",
                    MAX_X: "5",
                    MAX_Y: "6",
                    MID_X: "8",
                    MID_Y: "9",
                    TL: "0",
                    TR: "1",
                    BL: "2",
                    BR: "3"
                },
                getExtremes: function() {
                    var f, b;
                    if (!(b = this.Jb))
                        if (f = this.Pc, f.q || f["0"] || f["1"] || f["2"] || f["3"]) b = [f], f = k([b, b, b, b], [f["6"], f["7"], f["4"], f["5"]]), this.Jb = b = {}, b["4"] = f[0], b["5"] = f[1], b["6"] = f[2], b["7"] = f[3];
                    return b || void 0
                },
                flush: function() {
                    this.Pc = this.dc = new g(0, 0, this.og - this.Uh, this.pg - this.Vh, this.og + this.Uh, this.pg + this.Vh);
                    this.Jb = 0
                },
                remove: function(b) {
                    b.ka.R(b, this);
                    this.Jb = 0
                },
                insert: function(b, c, a, d) {
                    var l, m =
                        this.dc;
                    b < a ? l = b : (l = a, a = b);
                    c < d ? (b = c, c = d) : b = d;
                    (l < m["7"] || b < m["4"] || a > m["5"] || c > m["6"]) && h();
                    this.Jb = 0;
                    return this.ge(this.dc, l, b, a, c, this.Jg)
                },
                insertSorted: function(b, c, a, d) {
                    var l = this.dc;
                    (b < l["7"] || c < l["4"] || a > l["5"] || d > l["6"]) && h();
                    this.Jb = 0;
                    return this.ge(this.dc, b, c, a, d, this.Jg)
                },
                ge: function(b, c, a, d, l, m) {
                    var p = b["8"],
                        g = b["9"];
                    return m && (d < p || d < b["5"] && c >= p) && (l < g || l < b["6"] && a >= g) ? this.ge(b.Ml((a >= g ? 2 : 0) | c >= p), c, a, d, l, m - 1) : b.M(c, a, d, l)
                },
                intersect: function(b, c, a, d, l) {
                    var m = [];
                    this.Nb(this.Pc, m, b,
                        c, a, d, l);
                    return m
                },
                Nb: function(b, c, a, d, l, m, p) {
                    var g, e, h = b.q;
                    e = b["7"];
                    var k = b["8"],
                        x = b["5"],
                        w = b["4"],
                        y = b["9"],
                        B = b["6"],
                        D;
                    if (h)
                        if (g = h.length, a > e || l < x || d > w || m < B)
                            for (; g--;) e = h[g], x = e["7"], w = e["4"], B = e["5"], D = e["6"], x > l || B < a || w > m || D < d || (p || x >= a && B <= l && w <= m && D >= d) && c.push(e);
                        else
                            for (; g--;) c.push(h[g]);
                    l >= k && (d <= y && b["1"] && this.Nb(b["1"], c, a, d, l, m, p), m >= y && b["3"] && this.Nb(b["3"], c, a, d, l, m, p));
                    a <= k && (d <= y && b["0"] && this.Nb(b["0"], c, a, d, l, m, p), m >= y && b["2"] && this.Nb(b["2"], c, a, d, l, m, p))
                }
            }),
            g = c.Quad = function(b,
                c, a, d, l, m) {
                if (b) this.ka = b, this.c = c, c & 1 ? (a = b["8"], l = b["5"]) : (a = b["7"], l = b["8"]), c & 2 ? (d = b["9"], m = b["6"]) : (d = b["4"], m = b["9"]);
                this["7"] = a;
                this["4"] = d;
                this["5"] = l;
                this["6"] = m;
                this["8"] = (a + l) / 2;
                this["9"] = (d + m) / 2
            },
            b = c.Entry = function(b, c, a, r, l) {
                this.id = d++;
                this.ka = b;
                this["7"] = c;
                this["4"] = a;
                this["5"] = r;
                this["6"] = l
            };
        ovi.extend(g.prototype, {
            c: "",
            ka: null,
            Ml: function(b) {
                return this[b] || (this[b] = new g(this, b))
            },
            M: function(f, c, a, d) {
                f = new b(this, f, c, a, d);
                (this.q || (this.q = [])).push(f);
                return f
            },
            R: function(b, c) {
                var a =
                    this.q,
                    d;
                if (a) {
                    for (d = a.length; d--;)
                        if (a[d] === b) {
                            a.splice(d, 1);
                            delete b.ka;
                            break
                        }
                    a.length || (delete this.q, this.rg(c))
                }
            },
            rg: function(b) {
                if (this.ka && !this.q && !this[0] && !this[1] && !this[2] && !this[3]) {
                    delete this.ka[this.c];
                    if (this === b.Pc) b.Pc = this.ka;
                    this.ka.rg(b)
                }
            }
        })
    })(nokia.maps.util);
    ovi.provide("nokia.maps.util.Strip");
    (function() {
        var e = nokia.maps.util.Strip = function(e, h) {
            var d = (this.names = e || []).length,
                c = this.offsets = {};
            for (this.data = h || []; d--;) c[e[d]] = d
        };
        ovi.extend(e, {
            stencil: function(k, h) {
                var d = new e(1, h);
                d.offsets = k.offsets;
                d.names = k.names;
                return d
            },
            X_Y: new e(["x", "y"]),
            LAT_LNG: new e(["latitude", "longitude"])
        })
    })();
    ovi.provide("nokia.maps.util.Uint32Array");
    (function() {
        var e = typeof Uint32Array !== "undefined",
            k = ovi.browser.msie ? function(e) {
                for (var d = Array(e); e--;) d[e] = 0;
                return d
            } : e ? function(e) {
                return new Uint32Array(e)
            } : function(e) {
                for (var d = []; d.length < e;) d.push(0);
                return d
            };
        nokia.maps.util.Uint32Array = function(h) {
            var d;
            if (ovi.type(h) === "array")
                if (e) {
                    d = new Uint32Array(h.length);
                    length = h.length;
                    for (i = 0; i < length; i++) d[i] = h[i]
                } else d = h;
            else d = e && typeof h === "object" ? new Uint32Array(h) : k(arguments.length ? +h : 0);
            return d
        }
    })();
    ovi.provide("nokia.maps.geo");
    (function(e) {
        function k(c, b, f, d, a, r) {
            var l = 0;
            c < f ? l |= 1 : c > a && (l |= 2);
            b < d ? l |= 4 : b > r && (l |= 8);
            return l
        }
        var h = 0,
            d = Number.POSITIVE_INFINITY,
            c;
        ovi.extend(e.geo, {
            newProjectionId: function() {
                return h++
            },
            clipLineVsRect: function(c, b, f, d, a, r, l, m, p) {
                p ? p.length = 0 : p = [];
                for (var e = !1, s, h = k(c, b, a, r, l, m), u = k(f, d, a, r, l, m), e = !1, x, w;;)
                    if (h | u)
                        if (h & u) break;
                        else s = h ? h : u, s & 8 ? (x = c + (f - c) * (m - b) / (d - b), w = m) : s & 4 ? (x = c + (f - c) * (r - b) / (d - b), w = r) : s & 2 ? (w = b + (d - b) * (a - c) / (f - c), x = a) : s & 1 && (w = b + (d - b) * (l - c) / (f - c), x = l), s == h ? (c = x, b = w, h = k(c, b, a, r, l,
                            m)) : (f = x, d = w, u = k(f, d, a, r, l, m));
                else {
                    e = !0;
                    break
                }
                e && p.push(c, b, f, d);
                return p
            },
            intersectLine: c = function(c, b, f, q) {
                if (!b || b.length < 4 || !c || c.length < 4) {
                    if (f) f.length = 0;
                    return 0
                }
                var q = !q,
                    a = 0,
                    r = 0,
                    l = 0,
                    m = c.length,
                    p, e, s, h, k, x = b[0],
                    w = b[1],
                    y = b[2],
                    B = b[3],
                    D = c[r++],
                    A = c[r++];
                y < x && (x ^= y, y ^= x, x ^= y);
                B < w && (w ^= B, B ^= w, w ^= B);
                for (; r < m;) {
                    var C = c[r++],
                        E = c[r++],
                        M = (E - A) * (y - x) - (C - D) * (B - w),
                        H = (C - D) * (w - A) - (E - A) * (x - D),
                        K = (E - A) * (y - x) - (C - D) * (B - w),
                        P = H / M,
                        F = K / M,
                        b = x + P * (y - x);
                    p = w + P * (B - w);
                    F = F >= 0 && F <= 1;
                    q && (D < C ? (e = D, k = C) : (e = C, k = D), A < E && (s = A, h =
                        E));
                    M === 0 && H === 0 && K === 0 ? (b = p = d, F = q ? (D >= x && D <= y || C >= x && C <= y) && (A >= w && A <= B || E >= w && E <= B) : !0) : F && q && (F = P >= 0 && P <= 1 && b >= e && b <= k && p >= s && p <= h);
                    F ? (a++, f && (f[l++] = b, f[l++] = p)) : f && (f[l++] = f[l++] = NaN);
                    D = C;
                    A = E
                }
                if (f) f.length = l;
                return a
            },
            clipPolygonVsRect: function(g, b, f, q, a, r) {
                if (!g || g.length <= 4) return r && ((r.length = 0) || r) || [];
                for (var r = r || [], l = r.length = 0, m = -1, p, e = g.length, s = 0, h, k, x = !1, w, y, B = !1, D = [], A = [], C = !1, E, M; ++m < 4;) {
                    h = g[e - 2];
                    k = g[e - 1];
                    m === 0 ? (x = k >= f, p = [b, f, q, f]) : m === 1 ? (x = h <= q, p = [q, f, q, a]) : m === 2 ? (x = k <= a, p = [b,
                        a, q, a
                    ]) : m === 3 && (x = h >= b, p = [b, f, b, a]);
                    for (; s < e;) w = g[s++], y = g[s++], m === 0 ? B = y >= f : m === 1 ? B = w <= q : m === 2 ? B = y <= a : m === 3 && (B = w >= b), B ? (x || (D[0] = h, D[1] = k, D[2] = w, D[3] = y, c(p, D, A, !0), h = A[0], k = A[1], h === d && (m === 0 ? (h = w, k = f) : m === 1 ? (h = q, k = y) : m === 2 ? (h = w, k = a) : m === 3 && (h = b, k = y)), s !== 2 ? (r[l++] = h, r[l++] = k) : (C = !0, E = h, M = k)), r[l++] = w, r[l++] = y) : x && (D[0] = h, D[1] = k, D[2] = w, D[3] = y, c(p, D, A, !0), h = A[0], k = A[1], h === d && (m === 0 ? (h = w, k = f) : m === 1 ? (h = q, k = y) : m === 2 ? (h = w, k = a) : m === 3 && (h = b, k = y)), r[l++] = h, r[l++] = k), h = w, k = y, x = B;
                    C && (r[l++] = E, r[l++] = M);
                    C = !1;
                    g = r;
                    r.length = e = l;
                    l = s = 0
                }
                return r
            }
        })
    })(nokia.maps);
    ovi.provide("nokia.maps.geo.Corridor");
    ovi.provide("nokia.maps.geo.IProjection");
    ovi.provide("nokia.maps.geo.Proximity");
    ovi.provide("nokia.maps.kml._packaging.base");
    ovi.provide("ovi._kernel");
    ovi.provide("nokia.maps.language._packaging.base");
    ovi.provide("nokia.maps.Config");
    (function(e) {
        function k(b, f) {
            return (typeof f === "string" ? f.replace(d, "$1.") : "") + b
        }
        var h = {},
            d = /([^.])$/,
            c = e.util.getRootNameSpace("nokia.maps").Settings,
            g = e.Config = new ovi.Class({
                initialize: function() {
                    this.za = {}
                },
                Statics: {
                    setDefault: function(b, f, c) {
                        if (!c || !h[b]) f === void 0 || f === null ? delete h[b] : h[b] = f
                    },
                    setDefaultNS: function(b, f, c, a) {
                        g.setDefault(k(f, b), c, a)
                    },
                    setDefaults: function(b, f) {
                        var c, a;
                        for (c in b)
                            if (!f || !h[c]) a = b[c], a === void 0 || a === null ? delete h[c] : h[c] = a
                    },
                    setDefaultsNS: function(b, f, c) {
                        var a, d,
                            l;
                        for (a in f)
                            if (l = k(a, b), !c || !h[l]) d = f[a], d === void 0 || d === null ? delete h[l] : h[l] = d
                    },
                    getDefault: function(b) {
                        return h[b]
                    },
                    getDefaultNS: function(b, f) {
                        return h[k(f, b)]
                    }
                },
                get: function(b) {
                    return b in this.za ? this.za[b] : h[b]
                },
                getNS: function(b, f) {
                    f = k(f, b);
                    return f in this.za ? this.za[f] : h[f]
                },
                set: function(b, f) {
                    this.za[b] = f;
                    return this
                },
                setNS: function(b, f, c) {
                    this.za[k(f, b)] = c;
                    return this
                },
                reset: function(b) {
                    delete this.za[b];
                    return this
                },
                resetNS: function(b, f) {
                    f = k(f, b);
                    delete this.za[f];
                    return this
                }
            });
        c && (c.secureConnection &&
            g.setDefault("secureConnection", c.secureConnection), c.addObserver("secureConnection", function() {
                g.setDefault("secureConnection", c.secureConnection)
            }))
    })(nokia.maps);
    ovi.provide("nokia.maps.util.RTree");
    (function(e) {
        var k = Math,
            h = k.abs,
            d = k.min,
            c = k.max,
            g = k.sqrt,
            b = e.RTreeRecord,
            f = e.d,
            q = e.RTree = new ovi.Class({
                initialize: function(a, b, c) {
                    (typeof b != "number" || b < 2) && f("The given parameter 'max' is not a number, or less than 2! max is " + b);
                    (typeof c != "number" || c > b / 2) && f("The given parameter 'min' is not a number, or is not at least 2 times smaller than max! min is " + c);
                    this.MaxEntriesPerNode = b;
                    this.MinEntriesPerNode = c;
                    switch (a) {
                        case e.RTree.QUADRATIC_PARTITIONING:
                            this.splitNode = this.Un;
                            break;
                        case e.RTree.LINEAR_PARTITIONING:
                            this.splitNode =
                                this.Sn;
                            break;
                        case e.RTree.LINEAR_MOD_PARTITIONING:
                            this.splitNode = this.Tn;
                            break;
                        case e.RTree.DUMMY_PARTITIONING:
                            this.splitNode = this.Rn;
                            break;
                        default:
                            f("The given parameter 'partitioningAlgorithm' is not a valid option!")
                    }
                    this.Root = new e.RTreeNode(!0)
                },
                Statics: {
                    QUADRATIC_PARTITIONING: 0,
                    LINEAR_PARTITIONING: 1,
                    LINEAR_MOD_PARTITIONING: 2,
                    DUMMY_PARTITIONING: 3,
                    Nd: Infinity
                },
                MaxEntriesPerNode: null,
                MinEntriesPerNode: null,
                Root: null,
                Gb: 1,
                add: function(a) {
                    var b = this.Root,
                        f = 1,
                        m = 0,
                        p = null,
                        q = null,
                        s = Infinity,
                        h, k;
                    for (a.Volume =
                        (a.X2 - a.X1) * (a.Y2 - a.Y1); f < this.Gb;) {
                        q = p = null;
                        s = Infinity;
                        m = b.Entries;
                        for (m = m.length; h = b.Entries[--m];)
                            if (k = a.X2 == a.X1 && a.Y2 == a.Y1 ? g((h.X1 - a.X1) * (h.X1 - a.X1) + (h.Y1 - a.Y1) * (h.Y1 - a.Y1)) : (c(h.X2, a.X2) - d(h.X1, a.X1)) * (c(h.Y2, a.Y2) - d(h.Y1, a.Y1)) - h.Volume, k < s || k == s && h.BoundingBox < q) p = m, s = k, q = h.Volume;
                        b = b.Entries[p];
                        f++
                    }
                    b.addChild(a, f == 1);
                    for (a = b.Entries.length > this.MaxEntriesPerNode ? this.splitNode(b) : []; b.ParentNode;) f = b.ParentNode, a.length != 2 ? f.updateBoundingBox(b.X1, b.X2, b.Y1, b.Y2) : (f.removeChild(b.ParentEntry),
                        f.addChild(a[0], !1), f.addChild(a[1], !1), a = f.Entries.length > this.MaxEntriesPerNode ? this.splitNode(f) : []), b = b.ParentNode;
                    if (a.length == 2) this.Root = new e.RTreeNode(!1), this.Root.addChild(a[0], !0), this.Root.addChild(a[1], !0), this.Gb++
                },
                remove: function(a) {
                    var c, l = [],
                        m, p = this.MinEntriesPerNode;
                    this.Root || f("Can't remove anything fro already empty tree");
                    (!a || !(a instanceof b) || !a.Leaf || !a.ParentNode) && f("Invalid node");
                    m = a.ParentNode.Entries;
                    c = m.indexOf(a);
                    if (c != -1) {
                        m.splice(c, 1);
                        m.length < p && (l = m);
                        do a =
                            a.ParentNode, a.Entries.length < p && a.ParentNode && a.ParentNode.removeChild(a.ParentEntry), a.ParentNode && a.ParentNode.calculateBoundingBox(); while (a.ParentNode);
                        for (c = l.length; c--;) this.hm(l[c]);
                        if (this.Root.Entries.length == 1 && !(this.Root.Entries[0] instanceof b)) this.Gb--, this.Root = this.Root.Entries[0], this.Root.ParentNode = null;
                        return !0
                    }
                },
                removeAll: function() {
                    this.Root = new e.RTreeNode(!0);
                    this.Gb = 1
                },
                searchByPriority: function(a, b, f, c) {
                    var p, d = {},
                        g = [
                            [null, null]
                        ],
                        q = this.Root,
                        e = 0;
                    p = 0;
                    var h;
                    a > b && (p = a, a = b,
                        b = p);
                    f > c && (p = f, f = c, c = p);
                    for (; q != null;) {
                        if (q.Leaf)
                            for (p = 0; p < q.Entries.length; p++) q.Entries[p].overlaps(a, b, f, c) && (typeof d[q.Entries[p].Priority] == "undefined" && (d[q.Entries[p].Priority] = []), d[q.Entries[p].Priority][d[q.Entries[p].Priority].length++] = q.Entries[p]);
                        else {
                            if (q.Entries.length > e + 1)
                                for (p = e + 1; p < q.Entries.length; p++)
                                    if (q.Entries[p].overlaps(a, b, f, c)) {
                                        g[g.length++] = [q, p];
                                        break
                                    }
                            for (p = h = 0; p < q.Entries[e].Entries.length; p++)
                                if (q.Entries[e].Entries[p].overlaps(a, b, f, c)) {
                                    q = q.Entries[e];
                                    e = p;
                                    h = 1;
                                    break
                                }
                            if (h) continue
                        }
                        q =
                            g[g.length - 1][0];
                        e = g[g.length - 1][1];
                        g.length--
                    }
                    return d
                },
                search: function(a, b, f, c, p) {
                    var d = [],
                        p = p || this.Root,
                        g, q = 0,
                        e, h = [p];
                    a > b && (t = a, a = b, b = t);
                    f > c && (t = f, f = c, c = t);
                    if (!p.overlaps(a, b, f, c)) return d;
                    for (; q < h.length;) {
                        curNode = h[q];
                        g = curNode.Entries;
                        for (e = g.length; p = g[--e];) p.overlaps(a, b, f, c) && (p.Leaf ? d.push(p) : h.push(p));
                        q++
                    }
                    return d
                },
                hm: function(a, b) {
                    var f = this.Root,
                        m = 0,
                        p = 1,
                        g, q, h, k;
                    if (a) {
                        for (; p < b;) {
                            q = g = null;
                            h = Infinity;
                            for (m = 0; m < f.Entries.length; m++)
                                if (k = f.Entries[m], k = (c(k.X2, a.X2) - d(k.X1, a.X1)) * (c(k.Y2,
                                        a.Y2) - d(k.Y1, a.Y1)) - k.Volume, k < h || k == h && f.Entries[m].BoundingBox < q) g = m, h = k, q = f.Entries[m].Volume;
                            f = f.Entries[g];
                            p++
                        }
                        f.addChild(a);
                        for (m = f.Entries.length > this.MaxEntriesPerNode ? this.splitNode(f) : []; f.ParentNode != null;) m.length != 2 ? f.ParentNode.updateBoundingBox(f.X1, f.X2, f.Y1, f.Y2) : (f.ParentNode.removeChild(f.ParentEntry), f.ParentNode.addChild(m[0], !1), f.ParentNode.addChild(m[1], !1), m = f.ParentNode.Entries.length > this.MaxEntriesPerNode ? this.splitNode(f.ParentNode) : []), f = f.ParentNode;
                        if (m.length == 2) this.Root =
                            new e.RTreeNode(!1), this.Root.addChild(m[0]), this.Root.addChild(m[1]), this.Gb++
                    }
                },
                splitNode: null,
                Un: function(a) {
                    var b = new e.RTreeNode(a.Leaf, a.ParentNode),
                        f = new e.RTreeNode(a.Leaf, a.ParentNode),
                        m = null,
                        p = null,
                        g = -1 * q.Nd,
                        s = null,
                        v = null,
                        k, x = a.Entries,
                        w = x.length,
                        y = k = 0;
                    for (k = 0; k < w; k++) {
                        s = x[k];
                        for (y = k + 1; y < w; y++) v = x[y], v = (c(s.X2, v.X2) - d(s.X1, v.X1)) * (c(s.Y2, v.Y2) - d(s.Y1, v.Y1)) - s.Volume - v.Volume, v > g && (m = k, p = y, g = v)
                    }
                    b.addChild(x.splice(m, 1)[0]);
                    for (f.addChild(x.splice(p - 1, 1)[0]); x.length > 0;) {
                        w = x.length;
                        if (this.MinEntriesPerNode -
                            b.Entries.length == w) {
                            for (; entry = x[--w];) b.addChild(entry);
                            a.Entries = [];
                            break
                        } else if (this.MinEntriesPerNode - f.Entries.length == w) {
                            for (; entry = x[--w];) f.addChild(entry);
                            a.Entries = [];
                            break
                        }
                        m = null;
                        p = -1;
                        for (k = 0; k < a.Entries.length; k++) g = a.Entries[k], g = h((c(b.X2, g.X2) - d(b.X1, g.X1)) * (c(b.Y2, g.Y2) - d(b.Y1, g.Y1)) * b.Volume - (c(f.X2, g.X2) - d(f.X1, g.X1)) * (c(f.Y2, g.Y2) - d(f.Y1, g.Y1)) * f.Volume), g > p && (m = k, p = g);
                        k = a.Entries[m];
                        b.getEnlargement(k.X1, k.X2, k.Y1, k.Y2) < f.getEnlargement(k.X1, k.X2, k.Y1, k.Y2) ? b.addChild(a.Entries.splice(m,
                            1)[0]) : f.addChild(a.Entries.splice(m, 1)[0])
                    }
                    return [b, f]
                },
                Sn: function(a) {
                    for (var b = new e.RTreeNode(a.Leaf, a.ParentNode), f = new e.RTreeNode(a.Leaf, a.ParentNode), m = null, p = null, d = -1 * q.Nd, g = 0, v = 0, k = null, x = null, w = a.Entries.length; g < w; g++) {
                        k = a.Entries[g];
                        for (v = g + 1; v < w; v++) x = a.Entries[v], x = c(c(h(k.X1 - x.X1), h(k.X2 - x.X2)), c(c(h(k.Y1 - x.Y1), h(k.Y2 - x.Y2)))), x > d && (m = g, p = v, d = x)
                    }
                    b.addChild(a.Entries.splice(m, 1)[0]);
                    for (f.addChild(a.Entries.splice(p - 1, 1)[0]); a.Entries.length > 0;) {
                        if (this.MinEntriesPerNode - b.Entries.length ==
                            a.Entries.length) {
                            for (; a.Entries.length > 0;) b.addChild(a.Entries.splice(0, 1)[0]);
                            break
                        } else if (this.MinEntriesPerNode - f.Entries.length == a.Entries.length) {
                            for (; a.Entries.length > 0;) f.addChild(a.Entries.splice(0, 1)[0]);
                            break
                        }
                        m = a.Entries[0];
                        b.getEnlargement(m.X1, m.X2, m.Y1, m.Y2) - f.getEnlargement(m.X1, m.X2, m.Y1, m.Y2) < 0 ? b.addChild(a.Entries.splice(0, 1)[0]) : f.addChild(a.Entries.splice(0, 1)[0])
                    }
                    return [b, f]
                },
                Tn: function(a) {
                    for (var b = new e.RTreeNode(a.Leaf, a.ParentNode), f = new e.RTreeNode(a.Leaf, a.ParentNode),
                            c = null, p = null, d = -1 * q.Nd, s = 0, h = 0, k = null, x = null, w = a.Entries.length; s < w; s++) {
                        k = a.Entries[s];
                        for (h = s + 1; h < w; h++) x = a.Entries[h], x = g((k.X1 - x.X1) * (k.X1 - x.X1) + (k.Y1 - x.Y1) * (k.Y1 - x.Y1)), x > d && (c = s, p = h, d = x)
                    }
                    b.addChild(a.Entries.splice(c, 1)[0]);
                    for (f.addChild(a.Entries.splice(p - 1, 1)[0]); a.Entries.length > 0;) {
                        if (this.MinEntriesPerNode - b.Entries.length == a.Entries.length) {
                            for (; a.Entries.length > 0;) b.addChild(a.Entries.splice(0, 1)[0]);
                            break
                        } else if (this.MinEntriesPerNode - f.Entries.length == a.Entries.length) {
                            for (; a.Entries.length >
                                0;) f.addChild(a.Entries.splice(0, 1)[0]);
                            break
                        }
                        c = a.Entries[0];
                        b.getEnlargement(c.X1, c.X2, c.Y1, c.Y2) - f.getEnlargement(c.X1, c.X2, c.Y1, c.Y2) < 0 ? b.addChild(a.Entries.splice(0, 1)[0]) : f.addChild(a.Entries.splice(0, 1)[0])
                    }
                    return [b, f]
                },
                Rn: function(a) {
                    for (var b = new e.RTreeNode(a.Leaf, a.ParentNode), f = new e.RTreeNode(a.Leaf, a.ParentNode), c = a.Entries.length / 2, p = 0, p = 0; p <= c; p++) b.addChild(a.Entries.splice(0, 1)[0], !0);
                    for (; a.Entries.length > 0;) f.addChild(a.Entries.splice(0, 1)[0], !0);
                    return [b, f]
                }
            })
    })(nokia.maps.util);
    ovi.provide("ovi.ConsoleLogger");
    (function() {
        try {
            typeof window.loadFirebugConsole === "function" && window.loadFirebugConsole()
        } catch (e) {}
        var k = null;
        ovi.ConsoleLogger = function() {
            if (k !== null) return k;
            if (window && window.console && /function/.test(window.console.log + ""))
                for (var e = function(b) {
                        b = /function/.test(window.console[b] + "") ? b : "log";
                        return typeof window.console[b] === "function" ? function() {
                            window.console[b].apply(window.console, arguments)
                        } : function(f, c, a, d, l, m, p, g, e, h, k) {
                            window.console[b](f || "", c || "", a || "", d || "", l || "", m || "", p || "", g || "",
                                e || "", h || "", k ? "..." : "")
                        }
                    }, d = ["info", "debug", "warn", "error"], c = 0, g; g = d[c]; c++) this[g] = e(g);
            else this.debug = this.info = this.warn = this.error = function() {};
            return k = this
        };
        ovi.Logger && window && window.console && /function/.test(window.console.log + "") && ovi.Logger.addLogger(new ovi.ConsoleLogger)
    })(ovi);
    ovi.provide("nokia.maps.util.Pen");
    (function(e) {
        var k = nokia.maps.gfx.Color.parseCss;
        e.Pen = new ovi.Class({
            strokeColor: "#05A",
            lineWidth: 1,
            lineCap: "round",
            lineJoin: "miter",
            miterLimit: 10,
            stroke: "solid",
            initialize: function(h, d) {
                var c, g, b = e.d;
                if (h) {
                    if ("lineWidth" in h) !e.isNumber(h.lineWidth) && b("width must be in range [0..100]"), h.lineWidth = e.Ja(h.lineWidth, 0, 100);
                    "stroke" in h && h.stroke !== "solid" && b("cannot set anything else than stroke=solid");
                    "strokeColor" in h && (g = k(h.strokeColor), g === null && b("Invalid color set!"));
                    if ("lineJoin" in h) g =
                        h.lineJoin, g !== "miter" && g !== "round" && g !== "bevel" && b("Invalid lineJoin set!");
                    if ("lineCap" in h) g = h.lineCap, g !== "butt" && g !== "round" && g !== "square" && b("Invalid lineCap set!");
                    "miterLimit" in h && !e.isNumber(h.miterLimit) && b("miterLimit must be a number")
                }
                if (d instanceof nokia.maps.util.Pen)
                    for (c in d) this[c] = d[c];
                for (c in h) this[c] = h[c]
            },
            ea: function() {
                return this.c || (this.c = e.Eg(this))
            }
        })
    })(nokia.maps.util);
    ovi.provide("ovi.dom");
    ovi.provide("nokia.maps.routing._packaging.base");
    ovi.provide("nokia.maps.net.Request");
    (function(e) {
        if (!e.util.getConstructor(e.net.Request)) var k = e.net,
            h = e.util,
            d = h.d,
            c = h.A,
            g = h.isArray,
            b = h.isObject,
            f = h.isString,
            q = 0,
            a = function() {
                return window.ActiveXObject ? function() {
                    return new ActiveXObject("Microsoft.XMLHTTP")
                } : window.XMLHttpRequest
            }(),
            r = "withCredentials" in new a ? a : typeof XDomainRequest != "undefined" ? XDomainRequest : null,
            l = function(a) {
                a.parentNode && a.parentNode.removeChild(a)
            },
            m = k.Request = new ovi.Class({
                Extends: e.util.OObject,
                initialize: function(a, b) {
                    var f = this;
                    f.F = {};
                    f.Ci = {};
                    f.le =
                        ++q;
                    m.managerCounter++;
                    f.u = a === m.JSONP || a === m.XHR ? a : m.JSONP;
                    f.qi = 3E4;
                    f.Rd = !1;
                    f.Sd = "jsoncallback";
                    f.pa = !1;
                    f.c = null;
                    b && b.timeout && (f.qi = b.timeout);
                    b && b.callbackKey && (f.Sd = b.callbackKey);
                    b && b.standardJSONP && (f.pa = b.standardJSONP);
                    b && b.autoSkip && (f.Rd = b.autoSkip);
                    a == m.XHR && b && b.xDomain && (f.vo = b.xDomain);
                    f.u == m.JSONP && f.pa == !1 && (k.Request.callbacks[f.le] = function(a, b) {
                        f.ng(a, b)
                    });
                    if (f.u == m.XHR && (f.oc = {}, f.Ei = b || {}, window.execScript && window.ActiveXObject)) {
                        var c = "BinaryToArray" + (new Date).getTime();
                        window.execScript("Function " +
                            c + "(Binary)\nDim i\nReDim byteArray(LenB(Binary))\nFor i = 1 To LenB(Binary)\n  byteArray(i-1) = ChrW(AscB(MidB(Binary, i, 1)))\nNext\n" + c + " = byteArray\nEnd Function\n", "vbscript")
                    }
                },
                Statics: {
                    JSONP: 1,
                    XHR: 2,
                    requestCounter: 1,
                    managerCounter: 0,
                    callbacks: {},
                    requestParams: {},
                    timeoutCallbacks: {},
                    canceledRequests: {}
                },
                destroy: function() {
                    this.cancelAll();
                    this.pa == !1 && (k.Request.callbacks[that.le] = c)
                },
                send: function(a, b, f) {
                    this.c = ++q;
                    m.requestCounter++;
                    this.F[this.c] = f != void 0 ? f : this.c;
                    this.Ci[this.F[this.c]] =
                        this.c;
                    this.u == m.JSONP ? this.Bn(a, b, this.c) : this.Dn(a, b, this.c);
                    return f != void 0 ? f : this.c
                },
                cancel: function(a) {
                    a = a == void 0 ? this.c : this.Ci[a];
                    m.canceledRequests[a] = !0;
                    this.u == m.JSONP ? this.zi(a) : this.Ie(a);
                    this.ob(a)
                },
                cancelAll: function() {
                    for (var a in this.F) this.cancel(this.F[a])
                },
                Sk: function(a) {
                    var b = this;
                    k.Request.callbacks[a] = function() {
                        b.ng(a, arguments)
                    }
                },
                Bn: function(a, b, f) {
                    var c = document.createElement("script"),
                        l = document.getElementsByTagName("head")[0];
                    this.pa && this.Sk(f);
                    m.requestParams[f] = [a,
                        b
                    ];
                    this.Mn(c, a, b, f);
                    l.insertBefore(c, l.firstChild);
                    this.ji(a, b, f)
                },
                Dn: function(a, b, f) {
                    var c = this.Ei.method || "GET",
                        l, d = this.Ei;
                    d.uri = a;
                    this.Tk(a, b, f);
                    this.ji(a, b, f);
                    try {
                        if (this.oc[f] = l = this.wl(f, d), l.open(c, this.ro(c, d, this.kd), !d.sync, d.username, d.password), this.Cn(l, c, d, this.kd), d.sync && ovi.browser.mozilla && parseFloat(ovi.browser.version) < 2) this.onreadystatechange()
                    } catch (g) {
                        if (f in this.F) this.kd.error = !0, delete this.F[f], m.callbacks[f](this.kd)
                    }
                },
                ng: function(a, b) {
                    if (!m.canceledRequests[a]) {
                        var f =
                            m.requestParams[a],
                            c = f[1];
                        this.ob(a);
                        if (!this.Rd || a == this.c) c({
                            response: b.length <= 1 ? b[0] : b,
                            status: 200,
                            id: this.F[a],
                            url: f[0],
                            error: !1,
                            timeout: !1
                        });
                        delete this.F[a];
                        delete m.requestParams[a];
                        this.pa && delete k.Request.callbacks[a]
                    }
                },
                Tk: function(a, b, f) {
                    var c = this;
                    k.Request.callbacks[f] = function(a) {
                        c.ob(f);
                        (!c.Rd || f == c.c) && b(a);
                        c.Ie(f)
                    }
                },
                Ie: function(a) {
                    this.oc[a] && (this.oc[a].abort(), this.oc[a] = null, delete this.oc[a], delete k.Request.callbacks[a])
                },
                Mn: function(a, b, f, c) {
                    var d = this,
                        g = b.indexOf("?") < 0 ? "?" :
                        "&";
                    b += d.pa ? g + d.Sd + "=nokia.maps.net.Request.callbacks[" + c + "]" : g + d.Sd + encodeURI("=(function(){nokia.maps.net.Request.callbacks[" + d.le + "](" + c + ",arguments);})");
                    a.setAttribute("src", b);
                    a.setAttribute("charset", "UTF-8");
                    a.setAttribute("defer", "defer");
                    a.id = c;
                    a.onload = a.onreadystatechange = function() {
                        if (!this.readyState || this.readyState === "complete" || this.readyState === "loaded") d.ob(c), delete m.requestParams[c], d.pa && delete k.Request.callbacks[c], l(this)
                    };
                    a.onerror = function() {
                        m.canceledRequests[c] || (d.ob(c),
                            m.requestParams[c] && (f = m.requestParams[c][1], f({
                                id: d.F[c],
                                url: m.requestParams[c][0],
                                error: !0,
                                timeout: !1
                            })), delete d.F[c], delete m.requestParams[c], d.pa && delete k.Request.callbacks[c], l(this))
                    }
                },
                ji: function(a, b, f) {
                    m.timeoutCallbacks[f] = setTimeout(this.vl(a, b, f), this.qi)
                },
                vl: function(a, b, f) {
                    var c = this;
                    return function() {
                        m.canceledRequests[f] = !0;
                        c.u == m.JSONP ? (b = m.requestParams[f][1], a = m.requestParams[f][0], c.zi(f)) : c.Ie(f);
                        b({
                            status: 408,
                            id: c.F[f],
                            url: a,
                            error: !1,
                            timeout: !0
                        });
                        delete c.F[f];
                        c.ob(f)
                    }
                },
                zi: function(a) {
                    var b =
                        document.getElementById(a);
                    if (b) b.onload = b.onreadystatechange = c, b.onerror = c, b.src = "", l(b);
                    delete m.requestParams[a];
                    this.pa && (k.Request.callbacks[a] = c)
                },
                ob: function(a) {
                    clearTimeout(m.timeoutCallbacks[a]);
                    delete m.timeoutCallbacks[a]
                },
                Cn: function(a, b, f) {
                    var c = "text/plain",
                        l = "",
                        m;
                    if (b !== "GET" && b !== "DELETE") f.json ? (c = "application/json", l = ovi.json.stringify(f.json)) : f.xml ? (c = "text/xml", XMLSerializer ? l = (new XMLSerializer).serializeToString(f.xml) : f.xml.xml ? l = f.xml.xml : d("error")) : f.content && b !== "GET" ?
                        (c = "application/x-www-form-urlencoded", l = this.Lh(f.content)) : l = f.body || "";
                    c = f.mimeType || c;
                    f.charset && (c += "; charset=" + f.charset);
                    c = {
                        "content-type": c
                    };
                    b = f.headers || {};
                    for (m in b) b.hasOwnProperty(m) && (c[m.toString().toLowerCase()] = b[m]);
                    if (f.preventCache === "headers" || f.preventCache === "both") c.pragma = c["cache-control"] = "no-cache";
                    for (m in c) c.hasOwnProperty(m) && (m !== "content-type" || f.handleAs === "arraybuffer") && a.setRequestHeader(m, c[m]);
                    f.handleAs === "binary" && a.overrideMimeType && (a.overrideMimeType(c["content-type"] =
                        "text/text; charset=x-user-defined"), l = "", delete c["content-length"]);
                    if (f.handleAs === "arraybuffer") a.responseType = "arraybuffer";
                    a.send(l)
                },
                ro: function(a, b, f) {
                    a = b.uri;
                    b.preventCache && b.preventCache !== "headers" && (a += (a.indexOf("?") === -1 ? "?" : "&") + "preventCache=" + (new Date).getTime());
                    (b = b.uriParameters) && (a += (a.indexOf("?") === -1 ? "?" : "&") + this.Lh(b));
                    return f.url = a
                },
                Lh: function(a, f) {
                    var c = [],
                        l, m;
                    if (b(a)) {
                        for (l in a) m = f ? f + "." + l : l, c.push(this.params(a[l], m));
                        return c.join("&")
                    } else if (g(a)) {
                        for (l = 0; l <
                            a.length; l++) a[l] = this.params(a[l], f);
                        return a.join("&")
                    } else if (!a) return "";
                    return f ? this.fi(f) + "=" + this.fi(a) : "" + a
                },
                fi: function(a) {
                    return encodeURIComponent(a).replace(/\!/g, "%21").replace(/\*/g, "%2A").replace(/\'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29")
                },
                yn: function(a, b) {
                    function f(a) {
                        this.message = a;
                        this.name = "ParserError"
                    }
                    var c = b.handleAs || "text";
                    c === "autodetect" && (c = a.getResponseHeader("content-type") || "", c = c.match(/[+\/]json/) ? "json" : c.match(/[+\/]xml/) ? "xml" : "text");
                    switch (c) {
                        case "json":
                            c =
                                ovi.json.parse(a.responseText);
                            break;
                        case "xml":
                            if (a.responseXML)
                                if ((c = a.responseXML.getElementsByTagName("parsererror")) && c.length > 0) throw new f(c.item(0).textContent);
                                else c = a.responseXML;
                            else c = h.Af(a.responseText);
                            break;
                        case "arraybuffer":
                            c = a.response;
                            break;
                        default:
                            c = a.responseText
                    }
                    return c
                },
                wl: function(b, c) {
                    var l = this,
                        d, g, q = {
                            status: 417
                        };
                    l.kd = q;
                    c = f(c) ? {
                        uri: c
                    } : c;
                    d = c.window || window;
                    try {
                        g = c.xhr || l.vo ? new r : new a, l.onreadystatechange = g.onreadystatechange = function() {
                            q.id = l.F[b];
                            q.timeout = !1;
                            q.error = !1;
                            if (!m.canceledRequests[b] && g.readyState === 4)
                                if (ovi.browser.msie && (g.status === 2 || g.status === 3)) q.status = 401;
                                else {
                                    q.status = g.status >= 300 && g.status !== 1223 || g.status === 0 && !(g.responseType === "arraybuffer" || g.responseType === "blob" ? g.response : g.responseText) && ("file:" === d.location.protocol || "widget:" === d.location.protocol) ? g.status || 404 : g.status || 200;
                                    try {
                                        q.response = l.yn(g, c)
                                    } catch (a) {
                                        if (b in l.F) q.error = !0, delete l.F[b], m.callbacks[b](q)
                                    }
                                    ovi.browser.msie && (g = null);
                                    if (!(q.status >= 200 && q.status < 300 && !q.error)) q.error = !0;
                                    delete l.F[b];
                                    m.callbacks[b](q)
                                }
                        }, d.location.protocol === "file:" && d.netscape && d.netscape.security && d.netscape.security.PrivilegeManager && d.netscape.security.PrivilegeManager.enablePrivilege && d.netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead")
                    } catch (e) {
                        if (b in l.F) q.error = !0, delete l.F[b], m.callbacks[b](q)
                    }
                    return g
                }
            })
    })(nokia.maps);
    ovi.provide("nokia.maps.dom.EventTarget");
    (function(e) {
        if (!nokia.maps.util.getConstructor(nokia.maps.dom.EventTarget)) {
            var k = !k,
                h = !k,
                d = k,
                c = e.EventTarget = function(b) {
                    var b = b || this,
                        f;
                    if (!b.isEventTarget) {
                        for (f in g) f in b || (b[f] = g[f]);
                        b.isDraggable ? b.enableDrag() : b.disableDrag();
                        if (ovi.type(b) === "element" && (window.navigator.pointerEnabled || window.navigator.msPointerEnabled)) b.style.touchAction = "none", b.style.msTouchAction = "none"
                    }
                    return b
                },
                g = {
                    isEventTarget: k,
                    isDraggable: h,
                    enableUserSelect: function() {
                        var b = this.style;
                        if (ovi.type(this) === "element") b.KhtmlUserSelect =
                            "auto", b.MozUserSelect = "auto", b.OUserSelect = "auto", b.WebkitUserSelect = "auto", b.WebkitTouchCallout = "auto", b.msUserSelect = "none";
                        return this
                    },
                    disableUserSelect: function() {
                        var b = this.style;
                        if (ovi.type(this) === "element") b.KhtmlUserSelect = "none", b.MozUserSelect = "none", b.OUserSelect = "none", b.WebkitUserSelect = "none", b.WebkitTouchCallout = "none", b.msUserSelect = "none";
                        return this
                    },
                    enableDrag: function() {
                        var b = this.style;
                        this.disableUserSelect();
                        if (ovi.type(this) === "element") b.WebkitUserDrag = "element", b.KhtmlUserDrag =
                            "element";
                        this.isDraggable = k;
                        return this
                    },
                    disableDrag: function() {
                        var b = this.style;
                        if (this.isDraggable && ovi.type(this) === "element") b.KhtmlUserDrag = "auto", b.WebkitUserDrag = "auto";
                        this.isDraggable = h;
                        return this
                    },
                    insertListener: function(b, f, c) {
                        return this.addListenerNS(null, b, f, c, k)
                    },
                    addListener: function(b, f, c) {
                        return this.addListenerNS(null, b, f, c)
                    },
                    addListeners: function(b) {
                        for (var f in b) b.hasOwnProperty(f) && this.addListenerNS(null, f, b[f][0], b[f][1])
                    },
                    insertListenerNS: function(b, f, c, a) {
                        return this.addListenerNS(b,
                            f, c, a, k)
                    },
                    addListenerNS: function(b, f, c, a, d) {
                        var l = this.eventListener || (this.eventListener = {}),
                            l = l[f] || (l[f] = []),
                            a = a || !1,
                            m, p;
                        if (f === "beforeunload")(p = e.Page.hg)[p.length] = c;
                        else if (f === "resize")
                            if ((p = e.Page.Ke)[p.length] = m = {
                                    node: this
                                }, (f = ovi.type(this)) === "window") m.layoutWidth = (f = e.Page(this)).layoutWidth, m.layoutHeight = f.layoutHeight;
                            else if (f === "element") m.offsetWidth = this.offsetWidth, m.offsetHeight = this.offsetHeight;
                        d ? l.unshift(c, a, b) : l.push(c, a, b);
                        return this
                    },
                    removeListener: function(b, f, c) {
                        return this.removeListenerNS(null,
                            b, f, c)
                    },
                    removeListenerNS: function(b, f, c, a) {
                        var d = this.eventListener,
                            l, m, p, a = a || !1;
                        if (f === "beforeunload") {
                            p = (l = e.Page.hg).length;
                            for (m = -1; ++m < p;)
                                if (l[m] === c) {
                                    l.splice(m, 1);
                                    break
                                }
                        } else if (f === "resize") {
                            p = (l = e.Page.Ke).length;
                            for (m = -1; ++m < p;)
                                if (l[m].node === this) {
                                    l.splice(m, 1);
                                    break
                                }
                        }
                        if (d && d[f]) {
                            l = d[f];
                            p = l.length;
                            for (m = 0; m < p; m += 3)
                                if (l[m] === c && l[m + 1] === a && l[m + 2] === b) {
                                    l.splice(m, 3);
                                    m <= l.Ba && (l.Ba -= 3);
                                    l.Xc -= 3;
                                    break
                                }
                            l.length === 0 && delete d[f]
                        }
                        return this
                    },
                    removeAllListeners: function() {
                        var b, f, c;
                        if (b = this.eventListener)
                            for (f in b)
                                for (; b[f] &&
                                    b[f].length > 0;) c = b[f], this.removeListenerNS(c[2], f, c[0], c[1])
                    },
                    dispatch: function(b) {
                        return c.dispatchEvent(this, b)
                    },
                    hitTest: function(b, f) {
                        var c;
                        if (this.parentNode && this.ownerDocument && (c = e.Page(this.ownerDocument).getClientRect(this)) && b >= c.left && b <= c.right && f >= c.top && f <= c.bottom) return k;
                        return h
                    }
                };
            ovi.extend(c.prototype, g);
            c.getDispatchPath = function(b, f, c) {
                for (var a, d = [], l = c && c.u === "display"; b;) f ? (a = b.eventListener) && (a = a[f]) && a.length && d.push(b) : d.push(b), b = l && b.u && b.getParent ? b.t : f && b.parentNodes &&
                    c && b.parentNodes[c] ? b.parentNodes[c] : b.parentNode;
                return d
            };
            c.catchException = function(b) {
                d = b === k
            };
            c.dispatchEvent = function(b, f, g) {
                var f = f instanceof e.Event ? f : e.Page.parseEvent(f),
                    a = f.type,
                    r = f.namespaceURI,
                    g = g || c.getDispatchPath(b, a, f.display || r),
                    l = g.length,
                    m, p, h, s;
                if (!a || l === 0) return k;
                f.target = f.target || b;
                f.eventPhase = 1;
                for (b = f.canSicker ? l - 1 : 0; b >= 0; b--)
                    if (b === 0 && f.eventPhase++, p = g[b], f.currentTarget = p, (s = p.eventListener && p.eventListener[a]) && (h = s.length)) {
                        s.Xc = h;
                        for (m = 0; m < h; m += 3)
                            if ((s[m + 1] || b ===
                                    0) && !(s[m + 2] !== null && s[m + 2] !== r)) {
                                try {
                                    s.Ba = m, s[m].call(p, f)
                                } catch (v) {
                                    if (d) ovi.warn("Exception in event listener #" + m / 3 + ", capturing phase for event " + a), ovi.error(String(v) === "[object Error]" ? v.message : v);
                                    else throw v;
                                } finally {
                                    m = s.Ba, h = s.Xc
                                }
                                if (f.propagation === 2) return !f.defaultPrevented
                            }
                        if (f.propagation === 1) return !f.defaultPrevented
                    }
                f.eventPhase++;
                if (f.canBubble)
                    for (b = 1; b < l; b++)
                        if (p = g[b], f.currentTarget = p, (s = p.eventListener && p.eventListener[a]) && (h = s.length)) {
                            s.Xc = h;
                            for (m = 0; m < h; m += 3)
                                if (!s[m + 1] && !(s[m +
                                        2] !== null && s[m + 2] !== r)) {
                                    try {
                                        s.Ba = m, s[m].call(p, f)
                                    } catch (u) {
                                        if (d) ovi.warn("Exception in event listener #" + m / 3 + ", bubbling phase for event " + a), ovi.error(String(u) === "[object Error]" ? u.message : u);
                                        else throw u;
                                    } finally {
                                        m = s.Ba, h = s.Xc
                                    }
                                    if (f.propagation === 2) return !f.defaultPrevented
                                }
                            if (f.propagation === 1) break
                        }
                return !f.defaultPrevented
            }
        }
    })(nokia.maps.dom);
    ovi.provide("nokia.maps.dom.DataTransfer");
    (function() {
        if (!nokia.maps.util.getConstructor(nokia.maps.dom.DataTransfer)) {
            var e = !e,
                k = {
                    text: "text/plain",
                    url: "text/uri-list"
                },
                h = {
                    string: e,
                    number: e,
                    "boolean": e
                },
                d = {
                    uninitialized: {
                        copy: e,
                        move: e,
                        link: e
                    },
                    none: {},
                    copy: {
                        copy: e
                    },
                    copyLink: {
                        copy: e,
                        link: e
                    },
                    copyMove: {
                        copy: e,
                        move: e
                    },
                    all: {
                        copy: e,
                        move: e,
                        link: e
                    },
                    link: {
                        link: e
                    },
                    linkMove: {
                        move: e,
                        link: e
                    },
                    move: {
                        move: e
                    }
                },
                c = ovi.Array.indexOf,
                g = nokia.maps.util.d,
                b = nokia.maps.dom.DataTransfer = function(b) {
                    var c = -1,
                        a, d;
                    this.types = [];
                    this.data = {};
                    this.ndt = b || null;
                    if (b && (d =
                            b.types) && (a = b.types.length))
                        for (; ++c < a;) this.types = d[c];
                    this.files = b && b.files || []
                };
            ovi.extend(b.prototype, {
                lift: e,
                realTime: !e,
                cursor: "pointer",
                dropEffect: "none",
                effectAllowed: "uninitialized",
                clearData: function(b) {
                    var d = this.ndt,
                        a, r = ovi.type(b),
                        l = this.types;
                    if (b === void 0) return d && d.clearData(), this.types = {}, this.data = {}, this;
                    h[r] || g("Invalid format supplied!");
                    b = k[b = ("" + b).toLowerCase()] || b;
                    d && d.clearData(b);
                    delete this.data[b];
                    (a = c(l, b)) >= 0 && l.splice(a, 1);
                    return this
                },
                setData: function(b, d) {
                    var a =
                        this.ndt,
                        r = ovi.type(b),
                        l = ovi.type(d),
                        m = this.types;
                    h[r] || g("Invalid format supplied!");
                    b = k[b = ("" + b).toLowerCase()] || b;
                    a && (l === "string" ? a.setData(b, d) : a.clearData(b));
                    this.data[b] = d;
                    c(m, b) < 0 && (m[m.length] = b);
                    return this
                },
                getData: function(b) {
                    var c, a = this.ndt,
                        d = ovi.type(b);
                    h[d] || g("Invalid format supplied!");
                    b = k[b = ("" + b).toLowerCase()] || b;
                    if (a && (c = a.getData(b))) return c;
                    return this.data[b]
                },
                hasData: function(b) {
                    var c = this.ndt,
                        a = ovi.type(b);
                    h[a] || g("Invalid format supplied!");
                    b = k[b = ("" + b).toLowerCase()] ||
                        b;
                    if (c && c.getData(b)) return e;
                    return b in this.data
                },
                setDragImage: function() {},
                addElement: function() {},
                allows: function(b) {
                    return d[this.effectAllowed][b]
                }
            })
        }
    })(nokia.maps);
    ovi.provide("nokia.maps.geo.mercator");
    (function(e) {
        var k = e.util,
            h = k.Point,
            d = k.Strip,
            c = k.Uint32Array,
            g = k.vf,
            b = e.geo.Coordinate,
            k = Math,
            f = k.min,
            q = k.max,
            a = k.log,
            r = k.tan,
            l = k.atan,
            m = k.exp,
            p = k.floor,
            z = k.pow,
            s = k.PI,
            v = s / 4,
            u = s / 2,
            x = 180 / s,
            w = function() {
                for (var a = 31, b = {}; a--;) b[z(2, a)] = a;
                return b
            }();
        e.geo.mercator = {
            id: 0,
            pointToGeo: function(a) {
                var f = a.x,
                    a = a.y;
                return new b(a <= 0 ? 90 : a >= 1 ? -90 : x * (2 * l(m(s * (1 - 2 * a))) - u), (f === 1 ? 1 : g(f, 1)) * 360 - 180, void 0, 1)
            },
            xyToGeo: function(a, f) {
                return new b(f <= 0 ? 90 : f >= 1 ? -90 : x * (2 * l(m(s * (1 - 2 * f))) - u), (a === 1 ? 1 : g(a, 1)) * 360 - 180, void 0,
                    1)
            },
            mapXYToGeo: function(a, f) {
                return new b(f <= 0 ? 90 : f >= 1073741823 ? -90 : x * (2 * l(m(s * (1 - 2 * f / 1073741823))) - u), (a === 1073741823 ? 1 : g(a / 1073741823, 1)) * 360 - 180)
            },
            mapPointsToGeo: function(a, b) {
                for (var b = b || d.stencil(d.LAT_LNG), f = b.data, c = a.length, p = 0, r = 0, q = b.names.length, e = b.offsets.latitude, h = b.offsets.longitude, k, z; p < c;) f[r + h] = ((k = a[p++]) === 1073741823 ? 1 : g(k / 1073741823, 1)) * 360 - 180, f[r + e] = (z = a[p++]) <= 0 ? 90 : z >= 1073741823 ? -90 : x * (2 * l(m(s * (1 - 2 * z / 1073741823))) - u), r += q;
                return b
            },
            geoToPoint: function(b) {
                return new h(b.longitude /
                    360 + 0.5, f(1, q(0, 0.5 - a(r(v + u * b.latitude / 180)) / s / 2)))
            },
            latLngToPoint: function(b, c) {
                return new h(c / 360 + 0.5, f(1, q(0, 0.5 - a(r(v + u * b / 180)) / s / 2)))
            },
            latLngToMapPoint: function(b, c) {
                return new h(p((c / 360 + 0.5) * 1073741823), p(f(1, q(0, 0.5 - a(r(v + u * b / 180)) / s / 2)) * 1073741823))
            },
            geoToMapPoints: function(b, l) {
                var d = b.data,
                    m = d.length,
                    g = 0,
                    e = 0,
                    h = b.names.length,
                    k = b.offsets.latitude,
                    z = b.offsets.longitude;
                for (l || (l = new c(m / h * 2)); e < m;) l[g++] = p((d[e + z] / 360 + 0.5) * 1073741823), l[g++] = p(f(1, q(0, 0.5 - a(r(v + u * d[e + k] / 180)) / s / 2)) * 1073741823),
                    e += h;
                return l
            },
            scaleMapXY: function(a, b, f, c) {
                var l = 30 - w[f];
                return c ? new h(a >> l, b >> l) : (c = (f -= 1) >> 1, new h((a >> l) + ((a & f) > c), (b >> l) + ((b & f) > c)))
            },
            scaleMapPoints: function(a, b, f, l, d) {
                var m = a.length,
                    p = 0,
                    g = 0,
                    r = 0,
                    q = 30 - w[b],
                    e, h, s, k;
                f || (f = new c(m));
                d = !!d;
                if (l)
                    if (d)
                        for (; p < m;) f[p] = a[p++] >> q;
                    else {
                        for (; g < m;)
                            if (p = a[g++] >> q, h = a[g++] >> q, s !== p || k !== h) f[r++] = s = p, f[r++] = k = h;
                        f.length = r
                    }
                else {
                    for (l = (b -= 1) >> 1; g < m;)
                        if (p = ((e = a[g++]) >> q) + ((e & b) > l), h = ((e = a[g++]) >> q) + ((e & b) > l), d || s !== p || k !== h) f[r++] = s = p, f[r++] = k = h;
                    if (!d) f.length =
                        r
                }
                return f
            }
        }
    })(nokia.maps);
    ovi.provide("nokia.maps.util.Coroutine");
    (function() {
        function e() {
            var b = m(),
                f = b;
            U = 0;
            h();
            if (aa)
                for (var c = m(), b = c + G.AF_MAX_EXEC_TIME; E.length && c < b;) c = E.shift().data, c = c.run(), h();
            else {
                c = m();
                for (b = c + G.MAX_EXEC_TIME; C.length && c < b;) L ? (c = M.shift(), c || (c = M, M = H, H = c, ea++, c = M.shift()), c = c.data) : c = C.shift().data, c = c.run(), h(), L = !L
            }
            d(b = m());
            ba && a.clearTimeout(ba);
            ba = a.setTimeout(k, U + 75);
            F += b - f
        }

        function k() {
            ba && a.clearTimeout(ba);
            ba = setTimeout(k, 500);
            m() > U && e()
        }

        function h() {
            var a, b, f;
            for (a = a || m();
                (b = A.k) && b && (f = b.data).mc <= a;) G.resume(f)
        }

        function d(a) {
            var b;
            E.length && la();
            C.length ? J(0) : (b = A.k) ? (a = b.data.mc - (a || m()), J(a < 0 ? 0 : a)) : J()
        }

        function c(a, b) {
            return b.nice(!0) - a.nice(!0)
        }

        function g(a, b) {
            return a.mc - b.mc
        }

        function b(a, b) {
            s.call(this);
            q.prototype = B && B.scope || y && y.scope || {};
            var f = -1,
                c, l = a && a.al,
                d = new q(b);
            if (a && a.defaults)
                for (c in a.defaults) this[c] = a.defaults[c];
            this.id = "ctx#" + x++;
            this.parent = B || y || null;
            this.name = (this.coroutine = a) && a.re;
            this.Q = {
                length: 0
            };
            this.N = {
                length: 0
            };
            if (b && b.length)
                for (; ++f < b.length && f < l.length;) d[l[f]] = b[f];
            this.scope = d;
            this.ed =
                new z(this);
            this.ld = new z(this);
            this.od = new z(this)
        }

        function f(a, b) {
            var f = this,
                c = f.context;
            do
                if (f.has(a)) return f[a] = b, this; while ((c = c.parent) && (f = c.scope));
            y.scope[a] = b;
            return this
        }

        function q(a) {
            this.arguments = a;
            this.has = this.hasOwn = this.hasOwnProperty;
            this.set = f
        }
        var a = window,
            r = nokia.maps.util,
            l = {
                0: {
                    status: "terminated"
                },
                1: {
                    status: "running"
                },
                2: {
                    status: "blocking"
                }
            },
            m = r.now,
            p = r.LinkedList,
            z = p.Element,
            s = r.OObject,
            v = Array.prototype.slice,
            u = ovi.type,
            x = 1,
            w = !0;
        b.prototype = new s({
            status: 2,
            aa: 0,
            Qb: 0,
            An: 0,
            gh: -1,
            sl: 0,
            priority: 50,
            prioritySetter: function(a) {
                if (u(a) !== "number") return this.priority;
                a < 0 && (a = 0);
                a > 100 && (a = 100);
                return a
            },
            useAnimationFrame: !1,
            Zc: 0,
            nice: function(a) {
                if (a && this.Qb < this.timeStamp) {
                    this.aa -= (this.timeStamp - this.Qb) / G.SLICE_SIZE / D.length;
                    if (this.aa < 0) this.aa = 0;
                    if (this.aa > 300) this.aa = 300;
                    this.Zc = this.priority - this.aa;
                    this.Qb = this.timeStamp;
                    this.realtime && (this.Zc += 1E3)
                }
                return this.Zc
            },
            realtime: !1,
            precede: function(a) {
                a instanceof b && (this.Q[a.id] = a, this.Q.length++, a.N[this.id] = this,
                    a.N.length++, a.Q[this.id] && (delete a.Q[this.id], a.Q.length--, delete this.N[a.id], this.N.length--));
                return this
            },
            postpone: function(a) {
                a instanceof b && (this.N[a.id] = a, this.N.length++, a.Q[this.id] = this, a.Q.length++, a.N[this.id] && (delete a.N[this.id], a.N.length--, delete this.Q[a.id], this.Q.length--));
                return this
            },
            clearPrecedence: function() {
                if (!this.Q.length) return null;
                for (var a = [], b = this.Q, f; void 0 in b;) f = b[void 0], delete f.N[this.id], f.N.length--, a.push(f);
                this.Q = {
                    length: 0
                };
                return a
            },
            clearPostponement: function() {
                if (!this.N.length) return null;
                for (var a = [], b = this.N, f; void 0 in precedeList;) f = b[void 0], delete f.Q[this.id], f.Q.length--, a.push(f);
                this.N = {
                    length: 0
                };
                return a
            },
            run: function(b, f) {
                if (!f && !this.useAnimationFrame && this.N.length) return m();
                if (!f && this.useAnimationFrame && !aa) return m();
                var c = this.od,
                    d = this.ed,
                    p = this.ld,
                    g = this.coroutine,
                    r = B,
                    q = this.scope,
                    e, h, s, k = s = m();
                this.nice(!0);
                c.list && c.list.remove(c);
                d.list && d.list.remove(d);
                p.list && p.list.remove(p);
                B = this;
                this.An++;
                this.wo = b ? 1.0E20 : s + (aa ? G.AF_SLICE_SIZE : G.SLICE_SIZE);
                this.gh = ea;
                this.set("status", 1);
                this.timeStamp = this.callTime = s;
                this.Zd = !0;
                if (w) try {
                    h = g.Kb.call(q.that, q, this)
                } catch (z) {
                    e = z
                } else h = g.Kb.call(q.that, q, this);
                B = r;
                s = m();
                this.aa += (c = s - k) / G.SLICE_SIZE;
                if (this.aa < 0) this.aa = 0;
                if (this.aa > 300) this.aa = 300;
                this.Zc = this.priority - this.aa;
                this.sl += c;
                this.Qb = s;
                K += c;
                F -= c;
                this.clearPrecedence();
                if (e && this.onError) try {
                    e = this.onError(q, this, e)
                } catch (v) {}
                if (e || this.Zd) {
                    this.Zd = !1;
                    this.set("returnValue", h);
                    G.kill(this);
                    if (this.onTerminated) this.onTerminated(q, this);
                    e && (ovi.warn("Coroutine '" +
                        g.re + "' aborted abnormally with exception"), ovi.info((e.name ? e.name + ": " : "") + e.message))
                } else if (l[this.status] !== h && !this.$l && a.console && a.console.warn) this.$l = !0, console.warn("The coroutine with the name '" + this.coroutine.re + "' returned in a blocked state, but didn't return the Coroutine.BLOCK object.\nThe reason may be a bug that the developer of the coroutine forgot a return, which can lead to errors!");
                return s
            }
        });
        var y = new b,
            B = null,
            D = {
                length: 0
            },
            A = new p,
            C = new p,
            E = new p,
            M = new p,
            H = new p,
            K = 0,
            P =
            m(),
            F = 0,
            L = !0,
            ea = 0,
            U = 0,
            aa = !1,
            la = function() {
                function b() {
                    f = !1;
                    aa = !0;
                    if (w) try {
                        e()
                    } catch (c) {
                        a && a.console && a.console.log && a.console.log(c)
                    } else e();
                    aa = !1
                }
                var f = !1;
                return function() {
                    f || (f = !0, r.requestAnimationFrame(b))
                }
            }(),
            J = function() {
                function b() {
                    k = null;
                    e()
                }

                function f(b) {
                    b.source !== a && b.data === "nm.util.Coroutine#postMessageHack" && e();
                    if (b.source === a && b.data === "nm.util.Coroutine#postMessageHack") return b.stopImmediatePropagation ? b.stopImmediatePropagation() : b.stopPropagation ? b.stopPropagation() : b.cancelBubble = !0, !r && g ? (r = g = !1, e()) : r = g = !1, !1
                }

                function c() {
                    l = null;
                    e()
                }
                var l = null,
                    d = a.setImmediate || a.webkitSetImmediate || a.mozSetImmediate || a.oSetImmediate || a.msSetImmediate || function(a) {
                        return setTimeout(a, 0)
                    },
                    p = a.clearImmediate || a.webkitClearImmediate || a.mozClearImmediate || a.oClearImmediate || a.msClearImmediate || function(a) {
                        return clearTimeout(a)
                    },
                    g = !1,
                    r = !1,
                    q, h = function() {
                        var b = navigator,
                            f = b.userAgent.toLowerCase(),
                            c = !1;
                        if (q = b.appName === "Microsoft Internet Explorer") + ((((f.match(/(?:version|chrome|firefox|msie)[\/ ]([\d.]+)/) || [])[1] || "").match(/([\d]+(?:[.][\d]+){0,1})/) || [])[1] || 0) >= 9 && +a.document.documentMode >= 9 && (c = !0);
                        return c
                    }(),
                    s = q && !h ? !1 : a.postMessage && (a.addEventListener || a.attachEvent),
                    k = null;
                s && (a.addEventListener ? a.addEventListener("message", f, !1) : a.attachEvent("onmessage", f));
                return function(f, q) {
                    var q = q || m(),
                        f = +f,
                        e = q + f;
                    if (e !== e || e < U || !U) k && (a.clearTimeout(k), k = null), l && (p(l), l = null), r = !0, U = 0;
                    if (e === e && !U)
                        if (U = e, f < 16)
                            if (s) {
                                if (!g || r) g = !0, r = !1, a.postMessage("nm.util.Coroutine#postMessageHack", "*")
                            } else l || (l =
                                d(c));
                    else k || (k = a.setTimeout(b, f))
                }
            }(),
            ba, G = nokia.maps.util.Coroutine = {
                TERMINATED: 0,
                RUNNING: 1,
                BLOCKING: 2,
                YIELDED: l[1],
                BLOCKED: l[2],
                KILLED: l[0],
                create: function(a, f) {
                    function c() {
                        var a = arguments,
                            f, l = new b(c, f = v.call(a, 0));
                        D[l.id] = l;
                        D.length++;
                        l.scope.that = this;
                        l.scope.context = l;
                        f.callee = a.callee;
                        f.caller = a.callee.caller;
                        l.Qb = l.createTime = l.timeStamp = l.callTime = m();
                        G.resume(l);
                        return l
                    }
                    c.al = v.call(arguments, 2);
                    c.re = a;
                    c.Kb = f;
                    return c
                },
                createEx: function(a, b, f) {
                    var c = v.call(arguments, 0),
                        c = c.splice(2, 1) &&
                        this.create.apply(this, c);
                    f && (c.defaults = f);
                    return c
                },
                forName: function(a) {
                    var b, f, c = [];
                    for (b in D)
                        if ((f = D[b]).name && f.name.match(a)) c[c.length] = f;
                    return c
                },
                all: function() {
                    var a, b = [];
                    for (a in D) b.push(D[a]);
                    return b
                },
                forId: function(a) {
                    return D[a]
                },
                wait: function(a, b, f) {
                    var c = a.$blocking || (a.$blocking = {});
                    if (f = f || B) return c[f.id] = f, f.Cc = a, G.suspend(f, b)
                },
                signal: function(a) {
                    var b;
                    if (a = a && a.$blocking)
                        for (b in a) return G.resume(b = a[b]), b
                },
                broadcast: function(a) {
                    var b, f = a && a.$blocking;
                    if (f) {
                        for (b in f) G.resume(f[b]);
                        delete a.$blocking
                    }
                },
                shallYield: function() {
                    var a = B;
                    return a && (a.timeStamp = m()) && a.timeStamp >= a.wo
                },
                yield: function(a) {
                    if (a = a || B) return G.suspend(a, 0)
                },
                sleep: function(a, b) {
                    if (b = b || B) return b.Cc = null, G.suspend(b, a)
                },
                kill: function(a) {
                    arguments.length === 1 ? a instanceof b || (a = B) : a = a || B;
                    if (a) {
                        if (a.status === 0) return G.KILLED;
                        var f = a.ed,
                            c = a.od,
                            l = a.ld;
                        f.list && f.list.remove(f);
                        c.list && c.list.remove(c);
                        l.list && l.list.remove(l);
                        delete D[a.id];
                        D.length--;
                        G.broadcast(a);
                        a.set("status", 0);
                        return G.KILLED
                    }
                },
                suspend: function(a,
                    b) {
                    if ((a = a || B) && a.status !== 0) {
                        if (b === null) b = Number.NaN;
                        b = +b;
                        a.Zd = !1;
                        var f = a.ed,
                            l = a.od,
                            d = a.ld;
                        f.list && f.list.remove(f);
                        l.list && l.list.remove(l);
                        d.list && d.list.remove(d);
                        a.set("timeStamp", m());
                        if (b <= 0) return a.set("status", 1), a.useAnimationFrame ? (a.nice(!0), E.addSorted(c, null, f)) : (H.push(d), a.nice(!0), C.addSorted(c, null, f)), G.YIELDED;
                        if (b > 0) a.mc = a.timeStamp + b, A.addSorted(g, null, l);
                        a.set("status", 2);
                        return G.BLOCKED
                    }
                },
                resume: function(a) {
                    if (a && a.status === 2) {
                        var b = a.ed,
                            f = a.od,
                            l = a.ld,
                            p = m();
                        if (a.Cc) delete a.Cc.$blocking[a.id],
                            a.Cc = a.mc = null;
                        f.list && A.remove(f);
                        a.set("timeStamp", p);
                        a.nice(!0);
                        a.useAnimationFrame ? E.addSorted(c, null, b) : (C.addSorted(c, null, b), a.realtime ? M.unshift(l) : a.gh < ea ? M.push(l) : H.push(l));
                        a.set("status", 1);
                        d(p)
                    }
                },
                MAX_EXEC_TIME: 30,
                AF_MAX_EXEC_TIME: 10,
                SLICE_SIZE: 10,
                AF_SLICE_SIZE: 10,
                count: function() {
                    return D.length
                },
                taskCpuTime: function() {
                    return K
                },
                schedulerCpuTime: function() {
                    return F
                },
                totalCpuTime: function() {
                    return m() - P
                },
                current: function() {
                    return B
                },
                scheduler: function() {
                    e()
                },
                schedulerNextRuntime: function() {
                    return U
                },
                killAll: function() {
                    for (var a in D) G.kill(D[a], "killAll called!")
                },
                scope: function(a) {
                    eval("fn = " + a.toString());
                    return a
                },
                catchException: function(a) {
                    w = !!a
                }
            };
        G.ExecutionContext = b;
        G.Scope = q;
        y.scope.global = y.scope;
        e()
    })();
    ovi.provide("nokia.maps.ui._packaging.base");
    ovi.provide("nokia.maps.net._packaging.base");
    ovi.provide("nokia.maps.dom.Page");
    (function(e) {
        if (!nokia.maps.util.getConstructor(nokia.maps.dom.Page)) {
            var k = nokia.maps.util,
                h = k.Coroutine,
                d = k.now,
                c = Math.pow,
                g = Math.sqrt,
                b = ovi.type,
                f = e.TouchList,
                q = function(a, b) {
                    return b ? a === b ? !0 : q(a, b.parentNode) : !1
                },
                a = navigator,
                r = a.userAgent.toLowerCase(),
                l = a.appVersion,
                m = {
                    windows: /Windows/.test(l),
                    mac: /MacIntel/.test(a.platform),
                    linux: /X11/.test(l) && !/tablet/.test(r) && !/armv7/.test(r),
                    maemo: /apple/.test(r) && /linux/.test(r) && /armv7/.test(a.platform),
                    iphone: /iphone/.test(r),
                    ipod: /ipod/.test(r),
                    ipad: /ipad/.test(r),
                    android: /android/.test(r),
                    meego: /meego/.test(r),
                    windowsphone: /windows\ phone/.test(r)
                },
                p, z, s = {
                    msie: z = a.appName === "Microsoft Internet Explorer" || /Trident/.test(l),
                    chrome: /chrome/.test(r),
                    safari: /apple/i.test(navigator.vendor) && !/browserng/.test(r),
                    opera: /opera/.test(r),
                    mozilla: /firefox|fennec/.test(r) && !/apple/.test(navigator.vendor),
                    konqueror: /konqueror/.test(r),
                    camino: /camino/.test(r),
                    cp: /browserng/.test(r),
                    fullVersion: p = (r.match(/(?:version|chrome|firefox|msie|\brv)[\/: ]([\d.]+)/) || [])[1] || "",
                    version: +((p.match(/([\d]+(?:[.][\d]+){0,1})/) || [])[1] || 0),
                    touch: m.android || m.iphone || m.ipad || m.meego || m.maemo,
                    mobile: /android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|lge |maemo|midp|mmp|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(r || a.vendor || window.opera) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test((r ||
                        a.vendor || window.opera).substr(0, 4)),
                    web: !this.mobile,
                    language: a.language || a.userLanguage,
                    webkit: /webkit/.test(r),
                    gecko: /gecko\//.test(r),
                    engineVersion: (r.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
                    realVersion: z && r.match(/msie/) && (window.matchMedia && 10 || self.console && console.profile && 9 || document.documentMode != void 0 && 8) || Math.floor(p),
                    dnd: !1
                },
                v = "onwheel" in document ? "wheel" : document.onmousewheel !== void 0 ? "mousewheel" : "DOMMouseScroll",
                u = window.navigator && (navigator.pointerEnabled || navigator.msPointerEnabled) &&
                (navigator.msMaxTouchPoints || navigator.maxTouchPoints),
                x = window.MSPointerEvent && MSPointerEvent.MSPOINTER_TYPE_TOUCH || "touch",
                w = navigator.pointerEnabled ? "pointerdown" : "MSPointerDown",
                y = navigator.pointerEnabled ? "pointermove" : "MSPointerMove",
                B = navigator.pointerEnabled ? "pointerup" : "MSPointerUp",
                D = navigator.pointerEnabled ? "pointercancel" : "MSPointerCancel",
                A = s.webkit && !s.touch ? "offsetX" : "layerX",
                C = s.webkit && !s.touch ? "offsetY" : "layerY",
                E = {},
                M, H = function(a) {
                    function l(a) {
                        var b;
                        a.pointerType === x ? (b = a.type,
                            b === w ? J($(a)) : b === y ? H($(a)) : b === B ? z($(a)) : b === D ? r($(a)) : fa(a)) : fa(a)
                    }

                    function p(a) {
                        a && I($(a))
                    }

                    function r(a) {
                        a && (z.call(this, a), na = [], Ra = Sa = 0)
                    }

                    function z(b) {
                        if (b) {
                            pb = void 0;
                            for (var f = $(b), c = -1, l, m = f.changedTouches, p, g; ++c < m.length;) {
                                g = new Ta(m[c]);
                                for (l = 0; l < na.length; l++)
                                    if (g.id === na[l].id) {
                                        p = na[l];
                                        na.splice(l--, 1);
                                        break
                                    }
                                if (p) {
                                    p.up = g;
                                    p.pressed = !1;
                                    if (ha) Y.style.display = "none", g.target = a.elementFromPoint(g.pageX, g.pageY), Y.style.display = "block";
                                    f.target = g.target;
                                    f.pageX = g.pageX;
                                    f.pageY = g.pageY;
                                    f.targetX =
                                        g[A];
                                    f.targetY = g[C];
                                    I(f);
                                    if (!ha && !f.defaultPrevented && na.length === 0 && p.down.target === g.target && !p.tapFired) p.tapFired = !0, I(new ja({
                                        type: "tap",
                                        target: g.target,
                                        pageX: g.pageX,
                                        pageY: g.pageY,
                                        targetX: g.pageX + b[A],
                                        targetY: g.pageY + b[C]
                                    })), l = d(), bb > 0 && l < bb ? (bb = 0, I(new ja({
                                        type: "dbltap",
                                        target: g.target,
                                        pageX: g.pageX,
                                        pageY: g.pageY
                                    }))) : bb = l + K.DOUBLE_TAP_TIME
                                }
                            }
                            ha && b.preventDefault();
                            h.resume(pa)
                        }
                    }

                    function H(b) {
                        if (b) {
                            for (var f = $(b), c = -1, l, m = f.changedTouches, p = d(), g, r; ++c < m.length;) {
                                r = new Ta(m[c]);
                                r.timeStamp = p;
                                for (l = 0; l < na.length; l++)
                                    if (g = na[l], g.id === r.id) {
                                        g.current = r;
                                        if (ha) Y.style.display = "none", r.target = a.elementFromPoint(r.pageX, r.pageY), Y.style.display = "block";
                                        g.preventMoveDefault && b.preventDefault()
                                    }
                                if (!ha) f.target = r.target, f.pageX = r.pageX, f.pageY = r.pageY, f.targetX = r[A], f.targetY = r[C], I(f)
                            }
                            ha ? (Y.style.left = ca.current.pageX + "px", Y.style.top = ca.current.pageY + "px", (N.realTime || !za) && pa.run()) : pa.run();
                            h.schedulerNextRuntime() < p - 10 && h.scheduler();
                            (ha || Da) && b.preventDefault()
                        }
                    }

                    function J(a) {
                        if (a && a.changedTouches[0].identifier !==
                            pb) {
                            pb = a.changedTouches[0].identifier;
                            for (var a = $(a), b = -1, f = a.changedTouches, c = a.timeStamp, l, d, m; ++b < f.length;) {
                                m = new Gb;
                                m.id = (l = new Ta(f[b])).id;
                                m.down = l;
                                m.current = l;
                                m.pressed = !0;
                                if (Da) m.longpressSent = m.tapFired = m.preventDrag = !0;
                                l.timeStamp = c;
                                na.some(function(a) {
                                    return m.id === a.id
                                }) || na.push(m);
                                d = m.down.target;
                                try {
                                    for (; d;) {
                                        if (d && d.isEventTarget && d.isDraggable) {
                                            m.preventMoveDefault = !0;
                                            break
                                        }
                                        d = d.parentNode
                                    }
                                } catch (p) {}
                                a.target = l.target;
                                a.pageX = l.pageX;
                                a.pageY = l.pageY;
                                a.targetX = l[A];
                                a.targetY = l[C];
                                I(a)
                            }
                            h.resume(pa)
                        }
                    }

                    function ba(a) {
                        var b = $(a),
                            f, c;
                        ga(a);
                        if (!s.msie && (f = a.relatedTarget) && f.nodeName === "IFRAME")
                            for (c in ka)
                                if (ka[c].pressed) a = b.clone(), a.target = ua, a.type = "mouseup", a.button = c, I(a);
                        h.resume(cb)
                    }

                    function G(a) {
                        ga(a)
                    }

                    function R(a) {
                        var b, f, c, l = -1,
                            m = d();
                        ga(a);
                        b = $(a);
                        b.target = ua;
                        ha ? (Y.style.left = va + "px", Y.style.top = wa + "px", (N.realTime || !za) && pa.run()) : (Ua = b, h.resume(cb), pa.run());
                        if (Aa <= 8) {
                            for (; ++l < ka.length;)
                                if (c = ka[l], c.pressed && !(a.button & qb[l]) && (c = c.down.target, f = b.clone(), f.type = "mouseup", f.button = l,
                                        I(f), !ha && !f.defaultPrevented)) f = b.clone(), f.type = "click", f.button = l, f.target = c, I(f);
                            h.schedulerNextRuntime() < m - 10 && h.scheduler()
                        }
                    }

                    function Ba(a) {
                        var b = $(a),
                            f, c = ka[b.button];
                        if (!s.opera || !(s.version < 11 && a.button === 2)) {
                            ga(a);
                            b.target = ua;
                            if (Aa <= 8 && !c.pressed) Ha = !0, f = b.clone(), f.type = "mousedown", I(f);
                            if (c.pressed) {
                                !ha && !Da && pa.run();
                                I(b);
                                if (f && Ha) a = b.clone(), a.type = "click", I(a), f.button !== 2 && (Ha = !1);
                                h.resume(pa)
                            }
                        }
                    }

                    function S(a) {
                        var b = $(a),
                            f;
                        f = b.target;
                        var c = b.pageX,
                            l = b.pageY,
                            m, p;
                        ga(a);
                        b.target = ua;
                        if (Aa <=
                            8 && b.button === 0 && f && f.style && (f.style.overflow === "auto" || f.style.overlfow === "scroll"))
                            if (a = Hb(f), m = a.right - db.width, p = a.bottom - db.height, f.clientHeight < f.scrollHeight && c >= m && c <= a.right || f.clientWidth < f.scrollWidth && l >= p && l <= a.bottom) return;
                        eb = b.button === 2 ? !0 : !1;
                        I(b);
                        if (s.opera && s.version < 11 && b.button === 2) eb = !1, b = b.clone(), b.type = "mouseup", I(b), f = b.clone(), f.type = "click", I(f), (b = d()) - Ia < K.DOUBLE_CLICK_TIME ? (b = f.clone(), b.type = "dblclick", I(b), Ia = 0) : Ia = b;
                        h.resume(pa)
                    }

                    function ta(a) {
                        var b;
                        ga(a);
                        b = $(a);
                        if (!(s.opera && a.button === 2)) {
                            if (s.opera && a.button === 2)(time = d()) - Ia < K.DOUBLE_CLICK_TIME ? (doubleClickEvent = b.clone(), doubleClickEvent.type = "dblclick", I(doubleClickEvent), Ia = 0) : Ia = time;
                            I(b)
                        }
                    }

                    function fa(a) {
                        ga(a);
                        I($(a))
                    }

                    function I(a) {
                        if (a) {
                            var b = a.type,
                                f = a.button,
                                l = a.touches,
                                d = ka[f],
                                p, r = !1;
                            if (m.android) {
                                if (b === "gesturechange") return;
                                if (b === "touchstart" && (Sa++, Ra++, Sa > 2)) return;
                                b === "touchend" && (Sa--, Ra--)
                            }
                            if (b === "resizestart" || b === "resize" || b === "resizeend") return Ja(a.target, a);
                            if (d && (!M || M !== x))
                                if (b ===
                                    "mousedown" && d) d.down = a.clone(), d.up = null, d.pressed = !0, d.preventClick = d.clickFired = d.longpressSent = !1, rb |= 1 << f;
                                else if (b === "mouseup" && d) d.up = a.clone(), d.pressed = !1, rb &= ~(1 << f);
                            else if (b === "click") {
                                if (d.clickFired || d.preventClick) r = !0, d.preventClick && a.preventDefault();
                                d.clickFired = !0
                            } else if (b === "longpress") d.longpressSent = !0;
                            if (!Va && (b === "gesturestart" || Sa >= 2)) {
                                Da = !0;
                                for (p in na) f = na[p], f.tapFired = f.preventDrag = f.longpressSent = !0;
                                if (m.android && l && l.length === 2) a.type = "gesturestart", a.scale = 1, sb = g(c(l[0].screenX -
                                    l[0].screenY, 2) + c(l[1].screenX - l[1].screenY, 2)), tb = a.scale, Ja(a.target, a, !1), Va = r = !0;
                                h.resume(pa)
                            } else if (Ra > 1 && Va) {
                                if (m.android && l && l.length === 2) Ja(a.target, a, !1), a.type = "gesturechange", a.scale = g(c(l[0].screenX - l[0].screenY, 2) + c(l[1].screenX - l[1].screenY, 2)) / sb, tb = a.scale, Ja(a.target, a, !1), r = !0
                            } else if (b === "gestureend" || Ra === 1 && Va) {
                                Da = !1;
                                if (m.android) a.type = "gestureend", a.scale = l && l.length === 2 ? Math.sqrt(c(l[0].screenX - l[0].screenY, 2) + c(l[1].screenX - l[1].screenY, 2)) / sb : tb, Ja(a.target, a, !1), r = !0, Va = !1;
                                h.resume(pa)
                            }
                            ha && !Ib[b] && (r = !0);
                            if (!r && (a.shiftKey = ub, a.ctrlKey = fb, a.altKey = vb, a.metaKey = wb, a.buttonState = rb, Ja(a.target, a, b === "mouseout" || b == "mouseleave" ? a.Ng : !1), b === "click" && a.defaultPrevented)) d.preventClick = !0
                        }
                    }

                    function ga(b) {
                        if (b) {
                            var f = b.target || b.srcElement || null,
                                c = b.type,
                                l = "toElement" in b ? b.toElement : b.relatedTarget;
                            if (Wb[c]) ub = b.shiftKey, fb = b.ctrlKey, vb = b.altKey, wb = b.metaKey || !1;
                            if (Jb[c]) {
                                if ("pageX" in b && b.pageX !== void 0 && b.pageX !== null && b.pageX === b.pageX) va = b.pageX, wa = b.pageY, Ka = b.clientX,
                                    La = b.clientY;
                                else if ("clientX" in b && "scrollLeft" in da && b.clientX !== void 0 && b.clientX !== null && b.clientX == b.clientX) va = b.clientX + (a.documentElement.scrollLeft ? a.documentElement.scrollLeft : da.scrollLeft), wa = b.clientY + (a.documentElement.scrollTop ? a.documentElement.scrollTop : da.scrollTop), Ka = b.clientX, La = b.clientY;
                                else return;
                                if (ha && za) Y.style.display = "none", f = a.elementFromPoint(b.clientX, b.clientY), Y.style.display = "block";
                                if (f && f.nodeType === 3) f = f.parentNode;
                                ua = f || null;
                                c === "mouseout" && !l && (ua = null)
                            }
                        }
                    }

                    function X(a) {
                        b(a) === "element" && Y.appendChild(a)
                    }

                    function ia(a, f, c) {
                        for (var l = b(a); xa.childNodes.length;) xa.removeChild(xa.childNodes[0]);
                        if (l === "element") f = b(f) === "number" ? f === f ? f : 0 : 0, c = b(c) === "number" ? c === c ? c : 0 : 0, xa.style.left = f + "px", xa.style.top = c + "px", xa.appendChild(a)
                    }

                    function V() {
                        xb[N.effectAllowed] ? ya = N.effectAllowed : N.effectAllowed = ya
                    }

                    function $a() {
                        xb[ya] && xb[ya][N.dropEffect] ? oa = N.dropEffect : oa = N.dropEffect = "none"
                    }

                    function Eb() {
                        if (Y) {
                            for (Y.parentNode && Y.parentNode.removeChild(Y); Y.childNodes.length;) Y.removeChild(Y.childNodes[0]);
                            for (; xa.childNodes.length;) xa.removeChild(xa.childNodes[0])
                        }
                    }

                    function Fb() {
                        Ea = qa.orientation;
                        yb = a.body.clientWidth;
                        Wa = a.body.clientHeight;
                        Xa = qa.innerWidth;
                        gb = qa.innerHeight;
                        zb = qa.outerWidth;
                        Ab = qa.outerHeight;
                        if (!m.iphone) {
                            if (!s.webkit) yb = null, Xa ? Wa || (Wa = a.documentElement.offsetHeight || null) : (Xa = a.body.clientWidth, gb = a.body.clientHeight, Wa = null);
                            zb = Xa;
                            Ab = gb
                        }
                        Ea ? Ea === -90 ? Ea = 90 : Ea === 90 && (Ea = 270) : Ea = screen.width > screen.height ? 90 : 0;
                        W.width = yb;
                        W.height = Wa;
                        W.layoutWidth = Xa;
                        W.layoutHeight = gb;
                        W.viewportWidth =
                            zb;
                        W.viewportHeight = Ab;
                        W.orientation = Ea
                    }

                    function $(b) {
                        if (b instanceof ja) return b;
                        var c, l, d, m, p, g;
                        d = (b = b || window.event) && (b.target || b.srcElement) || null;
                        if ((c = hb) && hb.nativeEvent === b) return c.currentTarget = b.currentTarget, c.bubbles = b.bubbles, c.eventPhase = b.eventPhase, c.defaultPrevented = b.defaultPrevented, c;
                        c = new ja;
                        (c.nativeEvent = b) || k.d("Invalid or no event object supplied!");
                        (!(c.type = b.type) || !c.type.length) && k.d("Invalid or no type in event!");
                        c.bubbles = b.bubbles === !0 || b.bubbles === !1 ? b.bubbles :
                            !1;
                        c.cancelable = b.cancelable === !0 || b.cancelable === !1 ? b.cancelable : !0;
                        c.currentTarget = b.currentTarget;
                        c.defaultPrevented = b.defaultPrevented === !0 || b.defaultPrevented === !1 ? b.defaultPrevented : !1;
                        if (c.eventPhase) c.eventPhase = b.eventPhase;
                        c.namespaceURI = b.namespaceURI;
                        c.page = W;
                        l = c.type;
                        if (l === "DOMMouseScroll" || l === "mousewheel" || l === "MozMousePixelScroll") c.type = l = "wheel";
                        if (c.target = d) {
                            if (c.target.nodeType === 3) c.target = c.target.parentNode
                        } else return hb = c;
                        if (Xb[c.type] && u && (M = b.pointerType, c.pointerId = b.pointerId,
                                c.hwTimestamp = b.hwTimestamp, c.isPrimary = b.isPrimary, c.pointerType = b.pointerType, c.pressure = b.pressure, c.rotation = b.rotation, c.tiltX = b.tiltX, c.tiltY = b.tiltY, g = new Ta(b), m = b.pointerId, b.pointerType === x)) {
                            if (!ra.identifiedTouch(m) && c.type !== w) return null;
                            if (c.type === w && (ra.M(b), Ga[c.pointerId] = c.target, c.type = ib[c.type], ra.length > 1 && !E[m])) d = new MSGesture, d.target = c.target, d.addPointer(m), E[m] = d;
                            c.target = d = g.target = Ga[c.pointerId];
                            if (c.type === y && ra.identifiedTouch(c.pointerId)) ra.M(b), c.type = ib[c.type];
                            if (c.type === B) ra.R(b), Ga[c.pointerId] = null, delete Ga[c.pointerId], c.type = ib[c.type], ab(c.pointerId), ra.length === 1 && ab(ra[0].pointerId);
                            if (c.type === D) ra.R(b), Ga[c.pointerId] = null, delete Ga[c.pointerId], c.type = ib[c.type], ab(c.pointerId), ra.length === 1 && ab(ra[0].pointerId);
                            b.touches = new f;
                            b.touches.Ok(ra);
                            b.changedTouches = new f;
                            b.changedTouches.M(g);
                            b.targetTouches = new f;
                            for (g = 0; g < ra.length; g++) q(d, Ga[ra[g].identifier]) && b.targetTouches.M(ra[g])
                        }
                        if (Yb[c.type]) c.touches = b.touches, c.targetTouches = b.targetTouches,
                            c.changedTouches = b.changedTouches;
                        if (Zb[l] || Kb[l]) {
                            if (Kb[l]) c.type = $b[l];
                            c.pageX = b.pageX;
                            c.pageY = b.pageY;
                            c.targetX = b[A];
                            c.targetY = b[C];
                            c.scale = b.scale;
                            c.rotation = b.rotation
                        }
                        c.view = void 0;
                        c.relatedTarget = "relatedTarget" in b ? b.relatedTarget : b.fromElement === d ? b.toElement : b.fromElement;
                        c.detail = b.detail;
                        if (b.display) c.display = b.display, c.displayX = b.displayX, c.displayY = b.displayY;
                        if (Jb[l]) {
                            c.shiftKey = b.shiftKey;
                            c.altKey = b.altKey;
                            c.ctrlKey = b.ctrlKey;
                            c.metaKey = b.metaKey || !1;
                            c.screenX = b.screenX;
                            c.screenY =
                                b.screenY;
                            c.clientX = b.clientX;
                            c.clientY = b.clientY;
                            "pageX" in b ? (c.pageX = b.pageX, c.pageY = b.pageY, "layerX" in b ? (c.targetX = s.msie && s.version == 9 ? b.offsetX : b[A], c.targetY = s.msie && s.version == 9 ? b.offsetY : b[C]) : (c.targetX = b.offsetX, c.targetY = b.offsetY)) : (c.pageX = b.clientX + (a.documentElement.scrollLeft || da.scrollLeft), c.pageY = b.clientY + (a.documentElement.scrollTop || da.scrollTop), c.targetX = b.offsetX, c.targetY = b.offsetY);
                            if (ac[l]) {
                                l === "mousedown" && (jb = !1);
                                d = b.button;
                                if (Aa <= 8 && l === "mousedown")
                                    for (g = 0; g < ka.length; g++) ka[g].pressed &&
                                        (d &= ~qb[g]);
                                else if (Aa <= 8 && (l === "click" || l === "contextmenu") && d === 0)
                                    for (g = p = d = 0; g < ka.length; g++)
                                        if (m = ka[g], !m.pressed && m.up && m.up.timeStamp > p) d = qb[g], p = m.up.timeStamp;
                                c.button = Aa <= 8 || s.konqueror ? bc[d] : d
                            }
                            if (cc[l])
                                if (v === "wheel") c.deltaX = b.deltaX, c.deltaY = b.deltaY, c.deltaZ = b.deltaZ, c.deltaMode = b.deltaMode;
                                else if (c.deltaMode = b.type === "MozMousePixelScroll" ? 0 : 1, c.deltaX = 0, c.deltaZ = 0, v === "mousewheel") {
                                if (c.deltaY = b.wheelDelta / -40, b.wheelDeltaX) c.deltaX = b.wheelDeltaX / -40
                            } else c.deltaY = b.detail
                        }
                        if (dc[l]) c.data =
                            b.data, c.inputMode = c.inputMode;
                        if (ec[l]) c.keyIdentifier = b.keyIdentifier, c.keyLocation = b.location === +b.location ? b.location : b.keyLocation, c.repeat = b.v, c.ctrlKey = b.ctrlKey, c.shiftKey = b.shiftKey, c.altKey = b.altKey, c.metaKey = b.metaKey || !1;
                        return hb = c
                    }

                    function ab(a) {
                        var b = E[a];
                        if (b) b.stop(), b.target = null, delete E[a]
                    }

                    function Hb(b) {
                        if (!b || !b.ownerDocument || !b.parentNode || b.parentNode === b) return null;
                        var f, c = s.gecko && a.getBoxObjectFor && b.style.position === "absolute" && (b.style.top === "" || b.style.left === "");
                        f =
                            b.offsetParent;
                        var l = b.offsetLeft,
                            d = b.offsetTop,
                            m, p;
                        if (b.getBoundingClientRect) f = a.documentElement, l = f.pageXOffset ? f.pageXOffset : a.body.pageXOffset ? a.body.pageXOffset : qa.pageXOffset ? qa.pageXOffset : f.scrollLeft, d = f.pageYOffset ? f.pageYOffset : a.body.pageYOffset ? a.body.pageYOffset : qa.pageYOffset ? qa.pageYOffset : f.scrollTop, c = b.getBoundingClientRect(), c = {
                            left: c.left + l - f.clientLeft,
                            top: c.top + d - f.clientTop,
                            right: c.right + l - f.clientLeft,
                            bottom: c.bottom + l - f.clientTop,
                            width: c.width,
                            height: c.height
                        };
                        else if (a.getBoxObjectFor &&
                            !c) c = a.getBoxObjectFor(b), f = a.getBoxObjectFor(viewport), c = {
                            left: c.screenX - f.screenX,
                            top: c.screenY - f.screenY
                        }, c.right = c.left + b.offsetWidth - 1, c.bottom = c.top + b.offsetHeight - 1;
                        else {
                            for (; f;) {
                                if ((m = f.offsetLeft) && m === m) l += m;
                                if ((p = f.offsetTop) && p === p) d += p;
                                if ((m = f.clientLeft) && m === m) l += m;
                                if ((p = f.clientTop) && p === p) d += p;
                                l -= f.scrollLeft;
                                if (!s.opera || f.tagName !== "TR") d -= f.scrollTop;
                                f = f.offsetParent
                            }
                            if (s.safari && b.style.position === "absolute" || s.opera) d -= da.offsetTop;
                            c = {
                                left: l,
                                top: d,
                                right: l + b.offsetWidth - 1,
                                bottom: d +
                                    b.offsetHeight - 1
                            }
                        }
                        if (!c.width) c.width = c.right - c.left + 1, c.height = c.bottom - c.top + 1;
                        return c
                    }

                    function Ma(f, c) {
                        if (b(f) === "string") return Bb(a.createElement(f), c);
                        f.tagName || k.d("tagName must be string or object with property 'tagName'");
                        var l = a.createElement(f.tagName),
                            d;
                        for (d in f) fc[d] || l.setAttribute(d, f[d]);
                        (c || (c = f.style)) && Bb(l, c);
                        return l
                    }

                    function Bb(a, b) {
                        if (b && a && a.style)
                            for (var f in b) !gc[f] && f in a.style && (a.style[f] = b[f]);
                        return a
                    }

                    function Gb() {}

                    function Ta(a) {
                        if (a)
                            for (var b in a) this[b] = a[b];
                        this.id = this.identifier
                    }

                    function Ya() {
                        this.pressed = this.longpressSent = this.clickFired = this.preventClick = !1;
                        this.down = this.up = null
                    }
                    var qa = a.parentWindow || a.defaultView,
                        Lb = a.documentElement,
                        da = a.getElementsByTagName("BODY")[0],
                        hc = a.getElementsByTagName("HEAD")[0],
                        W = this,
                        jb = !1,
                        ic = m.mac && s.webkit,
                        Aa = function() {
                            var b;
                            if (s.msie) b = 5, a.documentMode ? b = a.documentMode : a.compatMode && a.compatMode === "CSS1Compat" && (b = 7);
                            return b
                        }(),
                        ja = e.Event,
                        kb = e.EventTarget,
                        jc = e.DataTransfer,
                        Mb = kb.getDispatchPath,
                        Ja = kb.dispatchEvent,
                        O = ovi.dom.addEvent,
                        Nb = ovi.Array.indexOf;
                    Ta.prototype = {
                        id: null,
                        identifier: null,
                        target: null,
                        timeStamp: 0,
                        pageX: 0,
                        pageY: 0,
                        screenX: 0,
                        screenY: 0,
                        clientX: 0,
                        clientY: 0
                    };
                    Gb.prototype = {
                        preventMoveDefault: !1,
                        preventDrag: !1,
                        pressed: !1,
                        longpressSent: !1,
                        tapFired: !1,
                        id: null,
                        down: null,
                        current: null,
                        up: null
                    };
                    var gc = {
                            constructor: !0,
                            prototype: !0
                        },
                        fc = {
                            constructor: !0,
                            prototype: !0,
                            tagName: !0,
                            style: !0
                        },
                        Fa = Math.abs,
                        hb = null,
                        ib = {
                            MSPointerDown: "touchstart",
                            MSPointerMove: "touchmove",
                            MSPointerUp: "touchend",
                            MSPointerCancel: "touchcancel",
                            pointerdown: "touchstart",
                            pointermove: "touchmove",
                            pointerup: "touchend",
                            pointercancel: "touchcancel"
                        },
                        ra = u ? new f : null,
                        Ga = {},
                        Xb = {
                            MSPointerDown: !0,
                            MSPointerMove: !0,
                            MSPointerUp: !0,
                            MSPointerCancel: !0,
                            pointerup: !0,
                            pointermove: !0,
                            pointerdown: !0,
                            pointercancel: !0
                        },
                        Kb = {
                            MSGestureStart: !0,
                            MSGestureChange: !0,
                            MSGestureEnd: !0
                        },
                        $b = {
                            MSGestureStart: "gesturestart",
                            MSGestureChange: "gesturechange",
                            MSGestureEnd: "gestureend"
                        },
                        Yb = {
                            touchstart: !0,
                            touchmove: !0,
                            touchend: !0,
                            touchcancel: !0
                        },
                        Zb = {
                            gesturestart: !0,
                            gesturechange: !0,
                            gestureend: !0
                        },
                        Ib = {
                            dragstart: !0,
                            drag: !0,
                            dragenter: !0,
                            dragleave: !0,
                            dragover: !0,
                            drop: !0,
                            dragend: !0
                        },
                        Jb = ovi.extend(ovi.extend({}, Ib), {
                            mousemove: !0,
                            mouseup: !0,
                            mousedown: !0,
                            mouseover: !0,
                            mouseout: !0,
                            mouseenter: !0,
                            mouseleave: !0,
                            click: !0,
                            dblclick: !0,
                            contextmenu: !0,
                            wheel: !0
                        }),
                        ac = {
                            mousedown: !0,
                            mouseup: !0,
                            contextmenu: !0,
                            click: !0,
                            dblclick: !0
                        },
                        cc = {
                            wheel: !0
                        },
                        dc = {},
                        ec = {
                            keydown: !0,
                            keypress: !0,
                            keyup: !0
                        },
                        qb = {
                            0: 1,
                            1: 4,
                            2: 2,
                            3: 8,
                            4: 16
                        },
                        bc = {
                            1: 0,
                            4: 1,
                            2: 2,
                            8: 3,
                            16: 4
                        },
                        kc = a.compatMode !== "CSS1Compat",
                        yb = 0,
                        Wa = 0,
                        Xa = 0,
                        gb = 0,
                        zb = 0,
                        Ab =
                        0,
                        Ea = 0,
                        db = function() {
                            var a = 0,
                                b = 0,
                                f = 0,
                                c = 0,
                                l = 0,
                                d = 0,
                                m = Ma("P", {
                                    height: "200px",
                                    width: "200px"
                                }),
                                p = Ma("P", {
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    visibility: "hidden",
                                    width: "100px",
                                    height: "100px",
                                    overflow: "hidden"
                                });
                            try {
                                p.appendChild(m);
                                da.appendChild(p);
                                b = p.offsetWidth;
                                l = p.offsetHeight;
                                p.style.overflow = "scroll";
                                f = p.offsetWidth;
                                d = p.offsetHeight;
                                if (b === f) f = p.clientWidth;
                                if (l === d) d = p.clientHeight;
                                da.removeChild(p);
                                a = b - f;
                                c = l - d
                            } catch (g) {
                                c = a = 0
                            }
                            return c !== c || a !== a || c <= 0 || a <= 0 ? {
                                width: 17,
                                height: 17
                            } : {
                                width: a,
                                height: c
                            }
                        }(),
                        va = 0,
                        wa = 0,
                        Ka = 0,
                        La = 0,
                        ua = null,
                        ma = null,
                        Na = [],
                        ka = [new Ya, new Ya, new Ya, new Ya, new Ya],
                        rb = 0,
                        na = [],
                        bb = 0,
                        ha = !1,
                        Da = !1,
                        xb = {
                            uninitialized: {
                                copy: !0,
                                move: !0,
                                link: !0
                            },
                            none: {},
                            copy: {
                                copy: !0
                            },
                            copyLink: {
                                copy: !0,
                                link: !0
                            },
                            copyMove: {
                                copy: !0,
                                move: !0
                            },
                            all: {
                                copy: !0,
                                move: !0,
                                link: !0
                            },
                            link: {
                                link: !0
                            },
                            linkMove: {
                                move: !0,
                                link: !0
                            },
                            move: {
                                move: !0
                            }
                        },
                        lb = !1,
                        mb = 0,
                        nb = 0,
                        sa = null,
                        ca = null,
                        ya = null,
                        za = !0,
                        oa = null,
                        Ob = {
                            none: s.msie ? "not-allowed" : "no-drop",
                            link: s.msie || s.safari ? "default" : "alias",
                            move: s.msie ? "hand" : "pointer",
                            copy: s.msie || s.safari ?
                                "default" : "copy"
                        },
                        Ca = null,
                        Z = null,
                        Oa = !1,
                        N = null,
                        Y = null,
                        Pa = null,
                        Pb = null,
                        xa = null,
                        ub = !1,
                        fb = !1,
                        vb = !1,
                        wb = !1,
                        Wb = {
                            keydown: !0,
                            keyup: !0,
                            mousedown: !0,
                            mouseup: !0
                        },
                        T = K.browser.mobile,
                        Qb = T ? 5 : 150,
                        lc = T ? 1 : 25,
                        pa = h.create("nokia.maps.dom.Page#queueCo", function(f, c) {
                            var l, d, m = c.callTime,
                                p = m - K.LONGPRESS_INTERVAL,
                                g = !1,
                                r = m + Qb,
                                q, e, k, z = -1,
                                v, x, y, u, w, C;
                            if (ha) {
                                if (ca ? (w = (q = ca.current.pageX) - mb, C = (u = ca.current.pageY) - nb, l = ca) : (w = (q = va) - mb, C = (u = wa) - nb, l = ka[sa]), mb = q, nb = u, Y.style.left = q + "px", Y.style.top = u + "px", !l.pressed && l.up ||
                                    Da || lb) {
                                    if (za && !Da && !lb && Z && oa !== "none") l = new ja({
                                        type: "drop",
                                        target: Z,
                                        relatedTarget: Ca,
                                        button: sa,
                                        pageX: q,
                                        pageY: u,
                                        deltaX: w,
                                        deltaY: C,
                                        dataTransfer: N
                                    }), I(l), $a(), l.defaultPrevented || (l = N.getData("text/plain"), b(Z) === "element" && (Z.nodeName === "TEXTAREA" || Z.nodeName === "INPUT" && Z.type.toLowerCase() === "text") ? oa === "copy" || oa === "move" ? l && l.length && (Z.value += l) : oa = "none" : oa = "none");
                                    else if (!za) N.dropEffect = oa = "none", l = new ja({
                                        type: "dragleave",
                                        target: Z,
                                        relatedTarget: Ca,
                                        button: sa,
                                        cancelable: !1,
                                        pageX: q,
                                        pageY: u,
                                        deltaX: 0,
                                        deltaY: 0,
                                        dataTransfer: N
                                    }), I(l);
                                    N.dropEffect = oa;
                                    N.effectAllowed = ya;
                                    l = new ja({
                                        type: "dragend",
                                        target: Ca,
                                        relatedTarget: Z,
                                        button: sa,
                                        pageX: q,
                                        pageY: u,
                                        deltaX: 0,
                                        deltaY: 0,
                                        dataTransfer: N
                                    });
                                    I(l);
                                    pa.realtime = !1;
                                    if (s.msie) da.releaseCapture && da.releaseCapture(), da.style.cursor = Pb;
                                    Eb();
                                    ha = lb = !1;
                                    N = ca = sa = null
                                }
                            } else if (!Da) {
                                if (na.length === 1 && (l = na[0]) && l.current)
                                    if (w = l.current.pageX - l.down.pageX, C = l.current.pageY - l.down.pageY, l.pressed && !l.preventDrag && Fa(w) + Fa(C) > 8) ca = l, q = l.current.pageX, u = l.current.pageY;
                                if (!ca)
                                    for (z in ka)
                                        if (l = ka[z], l.down && (w = va - l.down.pageX, C = wa - l.down.pageY, l.pressed && Fa(w) + Fa(C) > 1)) {
                                            sa = +z;
                                            q = va;
                                            u = wa;
                                            break
                                        }
                                if ((ca || sa !== null) && l) {
                                    jb = !0;
                                    e = l.down.target;
                                    try {
                                        for (; e;) {
                                            if (e.isEventTarget && e.isDraggable) break;
                                            e = e.parentNode
                                        }
                                    } catch (A) {
                                        e = null
                                    }
                                    if (e) {
                                        ca ? (w = (q = ca.current.pageX) - ca.down.pageX, C = (u = ca.current.pageY) - ca.down.pageY, l = ca) : (w = (q = va) - l.down.pageX, C = (u = wa) - l.down.pageY, l = ka[sa]);
                                        mb = q;
                                        nb = u;
                                        if (!Y) Y = Ma("DIV", {
                                            position: "absolute",
                                            top: l.down.pageX + "px",
                                            left: l.down.pageY + "px",
                                            zIndex: 65535,
                                            overflow: "visible",
                                            width: 0,
                                            height: 0
                                        }), xa = Ma("DIV", {
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            zIndex: 255,
                                            overflow: "visible",
                                            width: 0,
                                            height: 0
                                        }), Pa = Ma("DIV", {
                                            position: "absolute",
                                            top: "-25px",
                                            left: "-25px",
                                            zIndex: 65535,
                                            overflow: "visible",
                                            width: "50px",
                                            height: "50px"
                                        }), Pa.innerHTML = "&nbsp;";
                                        Y.appendChild(xa);
                                        !s.msie && !ca && Y.appendChild(Pa);
                                        Y.style.left = q + "px";
                                        Y.style.top = u + "px";
                                        Pa.style.cursor = "default";
                                        da.appendChild(Y);
                                        N = new jc;
                                        N.setDragImage = ia;
                                        N.addElement = X;
                                        k = new ja({
                                            type: "dragstart",
                                            target: e,
                                            relatedTarget: null,
                                            button: sa,
                                            pageX: l.down.pageX,
                                            pageY: l.down.pageY,
                                            targetX: l.down.targetX,
                                            targetY: l.down.targetY,
                                            deltaX: 0,
                                            deltaY: 0,
                                            dataTransfer: N
                                        });
                                        I(k);
                                        if (k.defaultPrevented) Eb(), l.preventDrag = !0, ha = !1, N = ca = sa = null;
                                        else if (pa.realtime = N.realtime, Ca = l.down.target = e, ha = !0, za = N.lift !== !1, Z = null, l.longpressSent = l.tapFired = l.preventClick = !0, Oa = !1, V(), N.effectAllowed = ya, N.dropEffect = oa, da.setCapture && da.setCapture(), s.msie) Pb = da.style.cursor || "auto", da.style.cursor = "default"
                                    } else sa = ca = null
                                }
                            }
                            if (ha) {
                                d = ca ? ca.current.target :
                                    ua;
                                if (za && Z && Z !== d) {
                                    e = d;
                                    try {
                                        for (; e;) {
                                            if (e === Z) break;
                                            e = e.parentNode
                                        }
                                    } catch (B) {
                                        e = null
                                    }
                                    if (!e || e === qa || e === a || e === da) l = new ja({
                                        type: "dragleave",
                                        target: Z,
                                        relatedTarget: Ca,
                                        button: sa,
                                        pageX: q,
                                        pageY: u,
                                        dataTransfer: N
                                    }), I(l), N.effectAllowed = ya, N.dropEffect = oa = "none", Z = null, Oa = !1
                                }
                                if (za && !Z && d) {
                                    e = d;
                                    try {
                                        for (; e;) {
                                            if (e.isEventTarget) break;
                                            e = e.parentNode
                                        }
                                    } catch (D) {
                                        e = null
                                    }
                                    if (e) d = new ja({
                                        type: "dragenter",
                                        target: Z = e,
                                        relatedTarget: Ca,
                                        button: sa,
                                        pageX: q,
                                        pageY: u,
                                        dataTransfer: N
                                    }), I(d), d.defaultPrevented ? (Oa = !0, $a(), N.effectAllowed =
                                        ya) : (Oa = !1, N.effectAllowed = ya, N.dropEffect = oa = "none")
                                }
                                if (za && Z && Oa) d = new ja({
                                    type: "dragover",
                                    target: Z,
                                    relatedTarget: Ca,
                                    button: sa,
                                    pageX: q,
                                    pageY: u,
                                    deltaX: w,
                                    deltaY: C,
                                    dataTransfer: N
                                }), I(d), d.defaultPrevented ? ($a(), N.effectAllowed = ya) : (Oa = !1, N.effectAllowed = ya, N.dropEffect = oa = "none");
                                q = new ja({
                                    type: "drag",
                                    target: Ca,
                                    relatedTarget: Z,
                                    button: sa,
                                    pageX: q,
                                    pageY: u,
                                    deltaX: w,
                                    deltaY: C,
                                    dataTransfer: N
                                });
                                I(q);
                                q.defaultPrevented && (lb = !0);
                                if (N)
                                    if (V(), N.dropEffect = oa, za) {
                                        if (Pa.style.cursor = Ob[oa], s.msie) da.style.cursor =
                                            Ob[oa]
                                    } else s.msie ? da.style.cursor = N.cursor === "pointer" ? "hand" : N.cursor || "hand" : Pa.style.cursor = N.cursor === "hand" ? "pointer" : N.cursor || "pointer";
                                return h.sleep(lc)
                            }
                            for (z in ka)
                                if (l = ka[z], l.pressed && (d = l.down))
                                    if (g = !0, !l.longpressSent && d.target && Fa(va - d.pageX) + Fa(wa - d.pageY) <= 1 && d.timeStamp <= p) {
                                        if (l.longpressSent = !0, q = d.clone(), q.type = "longpress", q.nativeEvent = null, I(q), q.defaultPrevented) l.preventClick = !0
                                    } else !l.longpressSent && r > d.timeStamp + K.LONGPRESS_INTERVAL && (r = d.timeStamp + K.LONGPRESS_INTERVAL);
                            for (x in na)
                                if (l = na[x], l.pressed && (v = l.down))
                                    if (g = !0, !l.longpressSent && (y = l.current) && v.target && Fa(y.pageX - v.pageX) + Fa(y.pageY - y.pageY) <= 8 && v.timeStamp <= p) {
                                        if (l.longpressSent = !0, q = new ja(ovi.extend({
                                                type: "longpress"
                                            }, v)), I(q), q.defaultPrevented) l.tapFired = !0
                                    } else !l.longpressSent && r > v.timeStamp + K.LONGPRESS_INTERVAL && (r = v.timeStamp + K.LONGPRESS_INTERVAL);
                            if (ha) return h.sleep(Qb);
                            if (g) {
                                if ((q = r - m) < 0) q = 1;
                                return h.sleep(q)
                            }
                            return h.sleep()
                        })(),
                        Sa = 0,
                        Ra = 0,
                        tb, sb, Va = !1,
                        eb = !1,
                        Ia = 0,
                        Ha = !1,
                        Cb = 0,
                        Ua = null,
                        ob = 0,
                        cb =
                        h.create("nokia.maps.dom.Page#mouseMoveCo", function(b, f) {
                            var c, l, d, m;
                            m = ma;
                            var p = f.callTime;
                            p >= ob && (Ua && I(Ua), Ua = null, ob = p + K.MOUSEMOVE_THRESHOLD);
                            if (ma && ma !== ua) d = new ja({
                                type: "mouseout",
                                target: ma,
                                relatedTarget: ua,
                                pageX: va,
                                pageY: wa,
                                clientX: Ka,
                                clientY: La,
                                Ng: f.mouseCurrentOverDispatchPath
                            }), f.mouseCurrentOverDispatchPath = null, I(d), ma = null;
                            for (d = -1; ++d < Na.length;)
                                if (l = Na[d], (c = Nb(Na, l)) >= 0 && (!l.hitTest || !l.hitTest(va, wa))) Na.splice(c, 1), c = new ja({
                                    type: "mouseleave",
                                    target: l,
                                    pageX: va,
                                    pageY: wa,
                                    clientX: Ka,
                                    clientY: La,
                                    Ng: f.mouseCurrentEnterDispatchPath
                                }), f.mouseCurrentEnterDispatchPath = null, I(c), d--;
                            if (ua && !ma) {
                                ma = ua;
                                if (ma !== qa && ma !== a && ma !== da && ma !== Lb && Nb(Na, ma) < 0) d = new ja({
                                    type: "mouseenter",
                                    target: ma,
                                    pageX: va,
                                    pageY: wa,
                                    clientX: Ka,
                                    clientY: La
                                }), Na.push(ma), d = $(d), f.mouseCurrentEnterDispatchPath = kb.getDispatchPath(ma, d.type, d.display), I(d);
                                m = new ja({
                                    type: "mouseover",
                                    target: ma,
                                    relatedTarget: m,
                                    pageX: va,
                                    pageY: wa,
                                    clientX: Ka,
                                    clientY: La
                                });
                                m = $(m);
                                f.mouseCurrentOverDispatchPath = kb.getDispatchPath(ma, m.type, m.display);
                                I(m)
                            }
                            if (!Ua || ob <= p) return h.sleep();
                            return h.sleep(ob - p)
                        })(),
                        pb, Rb = !1,
                        T = Aa <= 8 ? a : qa,
                        Q = Aa <= 8 ? !1 : !0;
                    pa.onError = cb.onError = function() {};
                    O(a, "touchstart", J, Q);
                    O(a, "touchmove", H, Q);
                    O(a, "touchend", z, Q);
                    O(a, "touchcancel", r, Q);
                    O(T, "gesturestart", p, Q);
                    O(T, "gesturechange", p, Q);
                    O(T, "gestureend", p, Q);
                    O(T, "orientationchange", function() {
                        I($(event));
                        I(new ja({
                            type: "resize",
                            target: qa
                        }))
                    }, Q);
                    O(T, "MSPointerDown", l, Q);
                    O(T, "MSPointerMove", l, Q);
                    O(T, "MSPointerUp", l, Q);
                    O(T, "MSPointerCancel", l, Q);
                    O(T, "pointerdown", l, Q);
                    O(T,
                        "pointermove", l, Q);
                    O(T, "pointerup", l, Q);
                    O(T, "pointercancel", l, Q);
                    O(T, "MSGestureStart", p, Q);
                    O(T, "MSGestureChange", p, Q);
                    O(T, "MSGestureEnd", p, Q);
                    O(T, "resize", function() {
                        h.resume(P)
                    }, Q);
                    !m.android && O(T, "mouseover", G, Q);
                    !m.android && O(T, "mouseout", ba, Q);
                    !m.android && O(T, "click", ta, Q);
                    !m.android && O(T, v, fa, Q);
                    v === "DOMMouseScroll" && O(T, "MozMousePixelScroll", fa, Q);
                    !m.android && O(T, "dblclick", fa, Q);
                    !m.android && O(T, "mousedown", S, Q);
                    !m.android && O(T, "mouseup", Ba, Q);
                    !m.android && O(T, "mousemove", R, Q);
                    O(T, "contextmenu",
                        function(a) {
                            var b = $(a),
                                f;
                            ga(a);
                            if (ha) b.preventDefault();
                            else {
                                if (eb && !s.gecko && !Ha && (a = b.clone(), a.type = "click", I(a), a.button === 2 && (s.chrome || s.safari || s.opera || Aa >= 9)))(f = d()) - Cb < K.DOUBLE_CLICK_TIME ? (a = a.clone(), a.type = "dblclick", I(a), Cb = 0) : Cb = f;
                                if (Ha) a = b.clone(), a.type = "dblclick", I(a);
                                b.target.isEventTarget && (ka[2].pressed || ka[0].pressed && fb && ic) ? (setTimeout(function() {
                                    if (!jb) b.defaultPrevented = !1, I(b)
                                }, 250), b.preventDefault()) : jb ? b.preventDefault() : I(b);
                                eb = Ha = !1
                            }
                        }, Q);
                    O(T, "keydown", fa, Q);
                    O(T, "keypress",
                        fa, Q);
                    O(T, "keyup", fa, Q);
                    O(T, "focus", fa, Q);
                    O(T, "blur", fa, Q);
                    O(a, "selectstart", function(a) {
                        for (var a = $(a), b = Mb(a.target), f = -1, c = b.length; ++f < c;)
                            if (b[f].isDraggable) return a.preventDefault(), !1
                    }, Q);
                    O(a, "dragstart", function(a) {
                        if (!s.dnd)
                            for (var b = Mb(a.target), f = b.length, c = -1; ++c < f;)
                                if (b[c].isEventTarget && b[c].isDraggable) return a.preventDefault ? a.preventDefault() : a.returnValue = !1, !1
                    }, Q);
                    O(a, "drag", function(a) {
                        var b = ua;
                        ga(a);
                        ua = b || null
                    }, Q);
                    O(a, "dragover", function(a) {
                        if (a && a.target && a.target.droppable) a.preventDefault ?
                            a.preventDefault() : a.returnValue = !1
                    }, Q);
                    O(a, "dragenter", function(a) {
                        var a = $(a),
                            b;
                        if (Z) b = a.target, a.target = Z, a.type = "dragleave", I(a), a.type = "dragenter", a.target = b;
                        I(a)
                    }, Q);
                    O(a, "drop", function(a) {
                        I(a = $(a));
                        if (a.defaultPrevented) a.type = "dragleave", a.target = Z, I(a);
                        if (Rb) a.type = "dragend", a.target = Ca, I(a)
                    }, Q);
                    O(a, "dragend", function(a) {
                        Rb = !0;
                        !Z && I($(a))
                    }, Q);
                    O(qa, "beforeunload", fa, !1);
                    Fb();
                    a.$jslPage = W;
                    W.window = qa;
                    W.document = a;
                    W.html = Lb;
                    W.head = hc;
                    W.body = da;
                    W.documentMode = Aa;
                    W.quirksMode = kc;
                    W.scrollbarsWidth =
                        db.width;
                    W.scrollbarsHeight = db.height;
                    W.parseEvent = $;
                    W.update = Fb;
                    W.processEvent = I;
                    W.$ = function(a) {
                        return this.document.getElementById(a)
                    };
                    W.setStyle = Bb;
                    W.createElement = Ma;
                    W.getClientRect = Hb;
                    W.destroy = function() {
                        h.kill(P);
                        h.kill(pa);
                        h.kill(cb)
                    };
                    W.fw = function(a) {
                        eval("fn = " + a.toString());
                        return a
                    };
                    W.ctrlKeyDown = function() {
                        return fb
                    };
                    W.shiftKeyDown = function() {
                        return ub
                    };
                    W.altKeyDown = function() {
                        return vb
                    };
                    W.metaKeyDown = function() {
                        return wb
                    }
                },
                K = e.Page = function(a) {
                    var f = document,
                        c;
                    if (!a) {
                        if (f.$jslPage) return f.$jslPage;
                        return new H(f)
                    }
                    if (a.$jslPage) return a.$jslPage;
                    if ((c = b(a)) !== "document") {
                        if (c === "window") f = a.document;
                        else if (a.ownerDocument) f = a.ownerDocument;
                        else if (a.parentNode)
                            for (f = null; a && a.parentNode;) {
                                if ((c = b(a)) === "document") {
                                    f = a;
                                    break
                                }
                                if (c === "window") {
                                    f = a.document;
                                    break
                                }
                                if (a.ownerDocument) {
                                    f = a.ownerDocument;
                                    break
                                }
                                a = a.parentNode
                            }
                        f || k.d("Invalid node given!")
                    } else f = a;
                    if (f.$jslPage) return f.$jslPage;
                    return new H(f)
                },
                a = {
                    parseEvent: function(a) {
                        if (a instanceof e.Event) return event;
                        var b = (a = a || window.event) &&
                            (a.target || a.srcElement) || null,
                            b = b && b.ownerDocument || document;
                        if (!b) return K().parseEvent(a);
                        if (b.$jslPage) return b.$jslPage.parseEvent(a);
                        return (new H(b)).parseEvent(a)
                    },
                    LONGPRESS_INTERVAL: 500,
                    MOUSEMOVE_THRESHOLD: 0,
                    DOUBLE_TAP_TIME: 500,
                    DOUBLE_CLICK_TIME: 300,
                    RESIZE_IDL_TIME: 1E3,
                    RESIZE_SLEEP_MIN_TIME: 125,
                    RESIZE_SLEEP_MAX_TIME: 500,
                    platform: m,
                    browser: s,
                    hg: [],
                    Ke: []
                },
                P = h.create("nokia.maps.dom.Page#resizeCo", function(a, f) {
                    var c = e.Event,
                        l = K.Ke,
                        d = l.length,
                        m = f.callTime,
                        p, g, r;
                    switch (a.ip) {
                        default: a.ip = 0;
                        case 0:
                                a.resizeData = [],
                            a.ip++;
                        case 1:
                                a.i = -1,
                            a.resizesRunning = 0,
                            a.ip++;
                        case 2:
                                for (; ++a.i < d;) {
                                d = l[a.i];
                                r = d.node;
                                l = !1;
                                d.mode = d.mode || 0;
                                if ((p = b(r)) === "window") {
                                    if (g = K(r), g.update(), g.layoutWidth !== d.layoutWidth || g.layoutHeight !== d.layoutHeight) d.layoutWidth = g.layoutWidth, d.layoutHeight = g.layoutHeight, l = !0
                                } else if (p === "element" && (g = K(r), d.offsetWidth !== r.offsetWidth || d.offsetHeight !== r.offsetHeight)) d.offsetWidth = r.offsetWidth, d.offsetHeight = r.offsetHeight, l = !0;
                                if (l) {
                                    if (d.mode === 0) d.mode = 1, g.processEvent(new c({
                                        type: "resizestart",
                                        target: r
                                    }));
                                    d.lastResizeTime = m;
                                    g.processEvent(new c({
                                        type: "resize",
                                        target: r
                                    }));
                                    a.resizesRunning++
                                } else if (d.mode === 1) m > d.lastResizeTime + K.RESIZE_IDL_TIME ? (d.mode = 0, g.processEvent(new c({
                                    type: "resizeend",
                                    target: r
                                }))) : a.resizesRunning++;
                                return h.yield()
                            }
                            a.ip++;
                        case 3:
                                if (a.ip = 1, a.resizesRunning) return h.sleep(K.RESIZE_SLEEP_MIN_TIME)
                    }
                    return h.sleep(K.RESIZE_SLEEP_MAX_TIME)
                })();
            ovi.extend(K, a);
            P.onError = function() {};
            if (m.ipad || m.iphone) h.MAX_EXEC_TIME = 10, h.AF_MAX_EXEC_TIME = 10, h.SLICE_SIZE = 5, h.AF_SLICE_SIZE =
                5
        }
    })(nokia.maps.dom);
    ovi.provide("nokia.maps.gfx.IDL");
    (function() {
        var e = nokia.maps.dom.Page.browser,
            k = e.mozilla && !e.fullVersion.indexOf("3.6"),
            h = nokia.maps.util.d,
            d = {},
            c = function() {
                var a = {
                        BEGIN_2D_IMAGE: ["-", "begin2dImage"],
                        BEGIN_PATH: ["@", "beginPath"],
                        MOVE_TO: ["M", "moveTo"],
                        LINE_TO: ["L", "lineTo"],
                        BEZIER_CURVE_TO: ["C", "bezierCurveTo"],
                        STROKE_TEXT: ["t", "strokeText"],
                        FILL_TEXT: ["T", "fillText"],
                        CLOSE_PATH: ["x", "closePath"],
                        FILL: ["f", "fill"],
                        STROKE: ["s", "stroke"],
                        SAVE: [">", "save"],
                        RESTORE: ["<", "restore"],
                        SET: ["#", "set"],
                        DRAW_IMAGE: ["I", "drawImage"],
                        DRAW_IDL: ["i",
                            "drawIDL"
                        ],
                        END: ["X", "end"]
                    },
                    b;
                for (b in a) a[b] = a[b][0].charCodeAt(0), d[a[b]] = b;
                return a
            }(),
            g = [
                ["strokeColor", 255, 1],
                ["fillColor", 255, 2],
                ["lineWidth", 1, 3],
                ["lineCap", "round", 4],
                ["lineJoin", "miter", 5],
                ["miterLimit", 10, 6],
                ["font", "10px sans-serif", 7],
                ["textAlign", "start", 8],
                ["textBaseline", "middle", 9],
                ["opacity", 1, 10]
            ],
            b = nokia.maps.util.Matrix3D,
            f = function() {
                for (var a = -1, b = g.length, f = []; ++a < b;) f.push(g[a][0]);
                return f
            }(),
            q = nokia.maps.gfx.IDL = new ovi.Class({
                initialize: function(a) {
                    this.data = a && a.length >
                        3 ? a : a = [];
                    this.width = a[1];
                    this.height = a[2];
                    this.description = a[3];
                    this.resetState()
                },
                Statics: {
                    attributeToIdentifier: {},
                    identifierToAttribute: {},
                    opcodes: c
                },
                resetState: function() {
                    var a = g.length;
                    this.qb = [];
                    for (this.matrix = new b; a--;) this[g[a][0]] = g[a][1]
                },
                saveState: function(a) {
                    var b = this.qb,
                        c = f.length,
                        d = 0;
                    b.push(a);
                    for (b.push(this.matrix.clone()); d < c;) b.push(this[f[d++]])
                },
                restoreState: function() {
                    var a = this.qb,
                        b = f.length;
                    if (!a.length) return this.resetState();
                    for (; b--;) this[f[b]] = a.pop();
                    this.matrix = a.pop();
                    return a.pop()
                },
                push: function() {
                    for (var a = this.data, b = this.matrix.rows, f = b[0], b = b[1], m, p, g, q, e, u, x, w = -1, y = arguments, B = y.length; ++w < B;) m = y[w], m === c.BEGIN_2D_IMAGE ? a.push(m, this.width = +y[++w], this.height = +y[++w], this.description = "" + y[++w]) : m === c.MOVE_TO || m === c.LINE_TO ? (u = +y[++w], x = +y[++w], a.push(m, f[0] * u + f[1] * x + f[3], b[0] * u + b[1] * x + b[3])) : m === c.STROKE_TEXT || m === c.FILL_TEXT ? (p = y[++w], u = +y[++w], x = +y[++w], g = +y[++w], q = +y[++w], a.push(m, p, f[0] * u + f[1] * x + f[3], b[0] * u + b[1] * x + b[3], f[0] * g + f[1] * q + f[3], b[0] * g + b[1] *
                        q + b[3])) : m === c.BEZIER_CURVE_TO ? (p = +y[++w], g = +y[++w], q = +y[++w], e = +y[++w], u = +y[++w], x = +y[++w], a.push(m, f[0] * p + f[1] * g + f[3], b[0] * p + b[1] * g + b[3], f[0] * q + f[1] * e + f[3], b[0] * q + b[1] * e + b[3], f[0] * u + f[1] * x + f[3], b[0] * u + b[1] * x + b[3])) : m === c.SET ? a.push(m, y[++w], y[++w]) : m === c.DRAW_IMAGE || m === c.DRAW_IDL ? a.push(m, y[++w], y[++w], y[++w], y[++w], y[++w], y[++w], y[++w], y[++w], y[++w], this.matrix.clone()) : d[m] ? (m === c.CLOSE_PATH && k && a.push(m), a.push(m)) : h('Invalid opcode "' + m + '" found in IDL')
                },
                concat: function(a) {
                    var b = new q,
                        f;
                    for (f in this) b[f] =
                        this[f];
                    b.data = this.data.concat(a.data.slice(4));
                    b.qb = this.qb.slice();
                    return b
                },
                append: function(a) {
                    this.data = this.data.concat(a.data.slice(4));
                    return this
                },
                clone: function() {
                    var a = new q,
                        b;
                    for (b in this) a[b] = this[b];
                    a.data = this.data.slice();
                    a.qb = this.qb.slice();
                    return a
                }
            });
        (function() {
            for (var a = -1, b = g.length, f, c; ++a < b;) f = g[a], c = f[0], f = f[2], q.attributeToIdentifier[c] = f, q.identifierToAttribute[f] = c
        })()
    })();
    ovi.provide("nokia.maps.dom.imgLoader");
    (function() {
        function e(a, b, f, c, l, d, p) {
            m.push(l);
            delete c.mi;
            c.removeAttribute("src");
            delete f.Sh;
            a && a.call(b, f, d, p)
        }

        function k() {
            l = h(self, !0);
            k = !1
        }

        function h(a, b) {
            a = g.hb(a.document.body, "iframe", !1, b ? "visibility:hidden;position:absolute;left:-9999px;" : !1).contentWindow;
            g.hb(a.document.head, "base").href = document.baseURI;
            return a
        }

        function d(a) {
            a.onerror ? a.onerror.call(a, r, !0) : a.onload = a.onerror = null;
            a.removeAttribute("src")
        }

        function c(b, c, l, d) {
            var m, p = !0;
            b || (b = document.createElemenet("img"));
            b.onload =
                b.onerror = function(a, f) {
                    b.onload = b.onerror = null;
                    m = (a || b.ownerDocument.parentWindow.event).type === "load";
                    l && l.call(d, b, f ? void 0 : m, f || p)
                };
            b.src = c;
            m === void 0 && (b.complete && q && b.onload.call(b, b.naturalWidth !== 0 || f ? a : r), p = !1);
            return m
        }
        var g = nokia.maps.dom,
            b = g.Page.browser,
            f = b.msie,
            q = b.webkit,
            a = {
                type: "load"
            },
            r = {
                type: "error"
            },
            l, m = [],
            p = g.loadImg = q ? function(a, b, f, d) {
                var p, g;
                k && k();
                p = m.pop() || h(l);
                g = a.Sh = new p.Image;
                g.mi = p;
                a.Me = c(g, b, function(l, m, g) {
                    m ? a.Me = c(a, b, function(a, b, c) {
                        e(f, d, a, l, p, b, c && g)
                    }) : e(f, d,
                        a, l, p, m, g)
                });
                g = a.Me;
                delete a.Me;
                return g
            } : c,
            z = g.cancelImg = q ? function(a) {
                if (a = a.Sh) a.mi.stop(), d(a)
            } : d,
            s = g.imgLoader = {
                maxRequests: b.mobile ? 6 : 34,
                db: [],
                Fa: 0,
                request: function(a, b, f, c) {
                    s.db.push([a, b, f, c]);
                    return s.Ph(!1)
                },
                cancel: function(a) {
                    for (var b, f = s.db, c, l = 0, d = s.db.length; l < d; l++)
                        if (f[l][0] === a) {
                            b = f.splice(l, 1)[0];
                            break
                        }
                    b ? (c = b[2]) && c.call(b[3], a, void 0, !0) : z(a)
                },
                Ge: function() {
                    s.Ph(!0)
                },
                Ph: function(a) {
                    var b = s.maxRequests,
                        c, l = s.db,
                        d = l.splice(0, b - s.Fa),
                        m = d.length,
                        g;
                    for (g = 0; g < m; g++) c = d[g], ++s.Fa, c = p(c[0],
                        c[1],
                        function(c, d) {
                            return function(m, p, g) {
                                --s.Fa < b && l.length && (g && !a ? setTimeout(s.Ge, 0) : f ? setTimeout(s.Ge, 0) : s.Ge());
                                c && c.call(d, m, p, g)
                            }
                        }(c[2], c[3]), s);
                    return !a ? c : void 0
                }
            }
    })();
    ovi.provide("nokia.maps.gfx.Graphics");
    (function() {
        var e = ovi.type,
            k = Math.PI / 180,
            e = ovi.type,
            h = nokia.maps.gfx,
            d = nokia.maps.util,
            c = h.Color.parseCss,
            g = h.IDL,
            b = g.opcodes,
            f = g.attributeToIdentifier;
        nokia.maps.gfx.Graphics = new ovi.Class({
            initialize: function(b) {
                if (b instanceof g) this.j = b
            },
            beginImage: function(f, a, c) {
                (this.j = new g).push(b.BEGIN_2D_IMAGE, f, a, "" + c);
                return this
            },
            getIDL: function() {
                return this.j
            },
            setIDL: function(b) {
                this.j = b instanceof g ? b : d.d("idl must be an instance of nokia.maps.gfx.IDL");
                return this
            },
            getWidth: function() {
                return this.j.width
            },
            getHeight: function() {
                return this.j.height
            },
            getMatrix: function() {
                return this.j.matrix
            },
            getDescription: function() {
                return this.j.description
            },
            save: function() {
                this.j && (this.j.push(b.SAVE), this.j.saveState());
                return this
            },
            restore: function() {
                this.j && (this.j.push(b.RESTORE), this.j.restoreState());
                return this
            },
            set: function(d, a) {
                var g = this.j;
                if (d === "width" || d === "height") {
                    if ((a = +a) < 0) a = 0;
                    g[d] = a;
                    this.beginImage(g.width, g.height, g.description)
                } else if (d === "description") g.data[3] = g.description = a;
                else {
                    d === "fillStyle" &&
                        (d = "fillColor");
                    d === "strokeStyle" && (d = "strokeColor");
                    if ((d === "fillColor" || d === "strokeColor") && e(a) === "string") a = c(a);
                    g[d] = a;
                    f[d] && g.data.push(b.SET, f[d], a)
                }
                return this
            },
            fill: function() {
                this.j.data.push(b.FILL);
                return this
            },
            stroke: function() {
                this.j.data.push(b.STROKE);
                return this
            },
            scale: function(b, a) {
                this.j.matrix = this.j.matrix.scale(b, a, 1);
                return this
            },
            rotate: function(b) {
                this.j.matrix = this.j.matrix.rotateZ(b * k);
                return this
            },
            translate: function(b, a) {
                this.j.matrix = this.j.matrix.translate(b, a, 0);
                return this
            },
            drawRect: function(f, a, c, l, d, p) {
                var g = this.j,
                    e, h, d = +d || 0,
                    p = +p || d;
                d === 0 && p === 0 ? g.push(b.BEGIN_PATH, b.MOVE_TO, f, a, b.LINE_TO, e = f + c, a, b.LINE_TO, e, h = a + l, b.LINE_TO, f, h, b.CLOSE_PATH) : (e = 0.5522847498 * d, h = 0.5522847498 * p, c = f + c, l = a + l, g.push(b.BEGIN_PATH, b.MOVE_TO, f + d, a, b.LINE_TO, c - d, a, b.BEZIER_CURVE_TO, c - d + e, a, c, a + p - h, c, a + p, b.LINE_TO, c, l - p, b.BEZIER_CURVE_TO, c, l - p + h, c - d + e, l, c - d, l, b.LINE_TO, f + d, l, b.BEZIER_CURVE_TO, f + e, l, f, l - p + h, f, l - p, b.LINE_TO, f, a + p, b.BEZIER_CURVE_TO, f, a + p - h, f + e, a, f + d, a, b.CLOSE_PATH));
                return this
            },
            drawImage: function(f, a, c, l, d, p, g, e, h) {
                this.j.push(b.DRAW_IMAGE, f, a, c, l, d, p, g, e, h);
                return this
            },
            drawGraphics: function(f, a, c, l, d, p, g, e, h) {
                this.j.push(b.DRAW_IDL, f.getIDL(), a, c, l, d, p, g, e, h);
                return this
            },
            drawEllipse: function(f, a, c, l) {
                var d = this.j,
                    p = f,
                    g = f + c,
                    e = a,
                    h = a + l;
                c /= 2;
                var k = l / 2,
                    x = 0.5522847498 * c,
                    l = 0.5522847498 * k;
                f += c;
                a += k;
                c = f - x;
                x = f + x;
                k = a - l;
                l = a + l;
                d.push(b.BEGIN_PATH, b.MOVE_TO, f, h, b.BEZIER_CURVE_TO, x, h, g, l, g, a, b.BEZIER_CURVE_TO, g, k, x, e, f, e, b.BEZIER_CURVE_TO, c, e, p, k, p, a, b.BEZIER_CURVE_TO, p, l, c, h, f, h, b.CLOSE_PATH)
            },
            beginPath: function() {
                this.j.push(b.BEGIN_PATH);
                return this
            },
            moveTo: function(f, a) {
                this.j.push(b.MOVE_TO, f, a);
                return this
            },
            closePath: function() {
                this.j.push(b.CLOSE_PATH);
                return this
            },
            lineTo: function(f, a) {
                this.j.push(b.LINE_TO, f, a);
                return this
            },
            polylineTo: function(f) {
                for (var a = f.length, c = 0, l = []; c < a;) l.push(b.LINE_TO, f[c++], f[c++]);
                this.j.push.apply(this.j, l);
                return this
            },
            quadraticCurveTo: function(b, a, f, c) {
                return this.bezierCurveTo(b, a, b, a, f, c)
            },
            bezierCurveTo: function(f, a, c, l, d, p) {
                this.j.push(b.BEZIER_CURVE_TO,
                    f, a, c, l, d, p);
                return this
            },
            fillText: function(f, a, c, l, d) {
                var p = this.j,
                    l = e(l) === "number" ? l : a + 1,
                    d = e(d) === "number" ? d : c;
                p.push(b.FILL_TEXT, f, a, c, l, d);
                return this
            },
            strokeText: function(f, a, c, l, d) {
                var p = this.j,
                    l = e(l) === "number" ? l : a + 1,
                    d = e(d) === "number" ? d : c;
                p.push(b.STROKE_TEXT, f, a, c, l, d);
                return this
            }
        })
    })();
    ovi.provide("nokia.maps.gfx.SvgParser");
    (function() {
        function e(a) {
            for (var a = a.replace(/[\,]/g, " ").replace(/\s+/g, " ").replace(/([0-9])(\-|\+)([0-9])/g, "$1 $2$3").replace(/^\s+/g, "").replace(/\s+$/g, "").split(" "), b = 0, f = a.length; b < f; b++) a[b] = +a[b];
            return a
        }

        function k(a) {
            a = b.FontHelper.uh(a);
            return +a.substr(0, a.length - 2)
        }

        function h(a, b) {
            var f = a.getAttribute(b);
            return f ? k(f) : 0
        }

        function d(a, b, f) {
            for (; a && a.nodeType === 1;) {
                if (a.getAttribute(b)) return a.getAttribute(b);
                a = a.parentNode
            }
            return f
        }
        var c = Math.PI,
            g = nokia.maps,
            b = g.util,
            f = b.Matrix3D,
            q =
            b.FontHelper.toString,
            a = nokia.maps.gfx,
            r = a.Graphics,
            l = a.Color.parseCss,
            m = a.IDL.opcodes,
            a = document.documentElement,
            p = g.dom.getStyle(a, "fontFamily"),
            z = g.dom.getStyle(a, "fontSize");
        nokia.maps.gfx.SvgParser = new ovi.Class({
            svg: function(a) {
                var b = this.L,
                    c = b && b.getIDL(),
                    l = c ? b.getWidth() : h(a, "width"),
                    d = c ? b.getHeight() : h(a, "height"),
                    m = a.getAttribute("viewBox"),
                    p = m ? m.split(" ") : [0, 0, l, d],
                    m = l / p[2],
                    g = d / p[3],
                    r = -p[0] * m,
                    p = -p[1] * g;
                c || b.beginImage(l + 0, d + 0);
                b.getIDL().matrix = b.getIDL().matrix.concat(new f([
                    [m, 0, 0, r],
                    [0, g, 0, p],
                    [0, 0, 1, 0]
                ]));
                this.Qh(a)
            },
            rect: function(a) {
                var b = h(a, "x"),
                    f = h(a, "y"),
                    c = h(a, "width"),
                    l = h(a, "height"),
                    d = h(a, "rx"),
                    m = h(a, "ry") || d;
                this.L.drawRect(b, f, c, l, d, m);
                this.ya(a, !0)
            },
            circle: function(a) {
                var b = h(a, "cx"),
                    f = h(a, "cy"),
                    c = h(a, "r");
                this.L.drawEllipse(b - c, f - c, 2 * c, 2 * c);
                this.ya(a, !0)
            },
            ellipse: function(a) {
                var b = h(a, "cx"),
                    f = h(a, "cy"),
                    c = h(a, "rx"),
                    l = h(a, "ry");
                this.L.drawEllipse(b - c, f - l, 2 * c, 2 * l);
                this.ya(a, !0)
            },
            line: function(a) {
                var b = this.L,
                    f = h(a, "x1"),
                    c = h(a, "y1"),
                    l = h(a, "x2"),
                    d = h(a, "y2");
                b.beginPath();
                b.moveTo(f, c);
                b.lineTo(l, d);
                this.ya(a, !0)
            },
            polyline: function(a) {
                var b = this.L,
                    f = e(a.getAttribute("points")),
                    c = f.length,
                    l = 2;
                b.beginPath();
                for (b.moveTo(f[0], f[1]); l < c; l += 2) b.lineTo(f[l], f[l + 1]);
                this.ya(a, !0)
            },
            polygon: function(a) {
                var b = this.L,
                    f = e(a.getAttribute("points")),
                    c = f.length,
                    l = 2;
                b.beginPath();
                for (b.moveTo(f[0], f[1]); l < c; l += 2) b.lineTo(f[l], f[l + 1]);
                b.closePath();
                this.ya(a, !0)
            },
            path: function(a) {
                var b = this.L,
                    f = b.getIDL(),
                    c;
                c = a.getAttribute("d").replace(/[\,]/g, " ").replace(/\s+/g, " ").replace(/([0-9])\-/g,
                    "$1 -").replace(/([0-9])\+/g, "$1 ").replace(/([a-zA-Z])([a-zA-Z])/g, "$1 $2").replace(/([a-df-zA-DF-Z])([0-9]|\.|\-|\+)/g, "$1 $2").replace(/([0-9])([a-df-zA-DF-Z])/g, "$1 $2").replace(/^\s+/g, "").replace(/\s+$/g, "").split(" ");
                c = c.length === 1 && c[0] === "" ? [] : c;
                var l = this.ya(a, !1),
                    a = l & 1;
                l &= 2;
                var d = 0,
                    p = 0,
                    g = -1,
                    r, q, e, h, k, z, P, F, L, ea, U, aa;
                for (f.push(m.BEGIN_PATH);;) {
                    if (!L) {
                        F = c[++g];
                        if (!F) break;
                        L = F.toLowerCase();
                        F = F.toUpperCase() === F
                    }
                    ea = L;
                    if (L === "m") U = d = r = +c[++g] + (F ? 0 : d), aa = p = q = +c[++g] + (F ? 0 : p), f.push(m.MOVE_TO,
                        r, q), L = (P = +c[g + 1]) === P ? "l" : null;
                    else if (L === "l") d = r = +c[++g] + (F ? 0 : d), p = q = +c[++g] + (F ? 0 : p), f.push(m.LINE_TO, r, q), L = (P = +c[g + 1]) === P ? L : null;
                    else if (L === "h") d = r = +c[++g] + (F ? 0 : d), q = p, f.push(m.LINE_TO, r, q), L = (P = +c[g + 1]) === P ? L : null;
                    else if (L === "v") r = d, p = q = +c[++g] + (F ? 0 : p), f.push(m.LINE_TO, r, q), L = (P = +c[g + 1]) === P ? L : null;
                    else if (L === "z") f.push(m.CLOSE_PATH), L = null, d = U, p = aa;
                    else if (L === "c" || L === "q") e = +c[++g] + (F ? 0 : d), h = +c[++g] + (F ? 0 : p), L === "q" ? (k = e, z = h) : (k = +c[++g] + (F ? 0 : d), z = +c[++g] + (F ? 0 : p)), d = r = +c[++g] + (F ? 0 : d), p =
                        q = +c[++g] + (F ? 0 : p), f.push(m.BEZIER_CURVE_TO, e, h, k, z, r, q), L = (P = +c[g + 1]) === P ? L : null;
                    else if (L === "s" || L === "t") e === "c" || e === "q" || e === "s" || e === "t" ? (k = d - k, z = p - z, e = d + k, h = p + z) : (e = d, h = p), L === "t" ? (k = e, z = h) : (k = +c[++g] + (F ? 0 : d), z = +c[++g] + (F ? 0 : p)), d = r = +c[++g] + (F ? 0 : d), p = q = +c[++g] + (F ? 0 : p), f.push(m.BEZIER_CURVE_TO, e, h, k, z, r, q), L = (P = +c[g + 1]) === P ? L : null;
                    else {
                        ovi.warn("SvgParser hit unknown command '" + L + "' at path element!");
                        break
                    }
                    e = ea
                }
                a && b.stroke();
                l && b.fill()
            },
            text: function(a) {
                var b = this.L;
                b.getIDL();
                var f = this.ya(a, !1),
                    c = d(a, "font", null),
                    l, c = c ? this.$m(c) : {};
                c.style = d(a, "font-style", null) || c.style;
                c.variant = d(a, "font-variant", null) || c.variant;
                c.weight = d(a, "font-weight", null) || c.weight;
                c.size = k(d(a, "font-size", null) || c.size || z) + "px";
                c.family = d(a, "font-family", null) || c.family || p;
                b.set("font", q(c));
                b.set("textAlign", d(a, "text-anchor", "start").replace("middle", "center"));
                if (f && (l = a.textContent || a.text)) c = h(a, "x"), a = h(a, "y"), f & 1 && b.strokeText(l, c, a), f & 2 && b.fillText(l, c, a)
            },
            image: function() {},
            linearGradient: function() {},
            radialGradient: function() {},
            use: function() {},
            g: function(a) {
                this.Qh(a)
            },
            $m: function(a) {
                var f = b.FontHelper.parse;
                this.ae || (this.ae = {});
                var c = this.ae[a];
                c || (c = this.ae[a] = f(a));
                return c
            },
            Be: function(a, f) {
                var c, l = ovi.type(a),
                    d;
                if (l === "string") c = (d = nokia.maps.util.Af(a)).documentElement;
                else if (l === "document" && a.documentElement) c = (d = a).documentElement;
                ovi.type(c) !== "element" && b.d("svgMarkup needs to be a valid SVG string or XML document!");
                this.L = f || new r;
                this.Rh(c);
                return d
            },
            parseSvg: function(a) {
                this.Be(a);
                return this.L.getIDL()
            },
            parseSvgInfo: function(a) {
                return (a = this.Be(a)) ? {
                    width: this.L.getWidth(),
                    height: this.L.getHeight(),
                    document: a
                } : null
            },
            parseSvgToGraphics: function(a, b) {
                this.Be(a, b);
                return this.L
            },
            Rh: function(a) {
                var b, f, c;
                if (c = this[a.nodeName])(b = this.L).save(), this.rl(a), (f = a.getAttribute("transform")) && this.$k(f), c.call(this, a), b.restore()
            },
            Qh: function(a) {
                for (a = a.firstChild; a; a = a.nextSibling) a.nodeType === 1 && this.Rh(a)
            },
            rl: function(a) {
                var b = a.getAttribute("style"),
                    f, c = /([^:\s*]+)\s*:\s*([^;]+?)\s*(;|$)/g;
                if (b) {
                    for (; f = c.exec(b);) a.setAttribute(f[1], f[2]);
                    a.removeAttribute("style")
                }
            },
            $k: function(a) {
                for (var b, l = /([a-zA-Z]*)\s*\(([^\)]*)\)/g, d, p = this.L.getIDL(), m = p.matrix; b = l.exec(a);) switch (d = e(b[2]), b[1].toLowerCase()) {
                    case "matrix":
                        m = m.concat(new f([
                            [d[0], d[2], 0, d[4]],
                            [d[1], d[3], 0, d[5]],
                            [0, 0, 1, 0]
                        ]));
                        break;
                    case "translate":
                        m = m.translate(d[0], d.length > 1 ? d[1] : 0, 0);
                        break;
                    case "scale":
                        m = m.scale(d[0], d.length > 1 ? d[1] : d[0], 0);
                        break;
                    case "rotate":
                        d.length > 1 && (m = m.translate(d[1], d[2], 0));
                        m = m.rotateZ(-(d[0] /
                            180) * c);
                        d.length > 1 && (m = m.translate(-d[1], -d[2], 0));
                        break;
                    case "skewx":
                        m = m.skewX(d[0]);
                        break;
                    case "skewy":
                        m = m.skewY(d[0])
                }
                p.matrix = m
            },
            ya: function(a, b) {
                var f = this.L,
                    c = f.getIDL().matrix,
                    m = 0,
                    p = d(a, "fill", "#000"),
                    g = d(a, "stroke", "none");
                f.set("opacity", +d(a, "opacity", "1"));
                p !== "none" && (m |= 2, f.set("fillColor", l(p, +d(a, "fill-opacity", "1"))), b && f.fill());
                if (g !== "none") {
                    m |= 1;
                    var r, c = c.getScale();
                    f.set("strokeColor", l(g, +d(a, "stroke-opacity", "1")));
                    (r = d(a, "stroke-width", 0)) && f.set("lineWidth", k(r) * 0.5 * (c.x +
                        c.y));
                    f.set("lineCap", d(a, "stroke-linecap", "flat").replace("flat", "butt"));
                    f.set("lineJoin", d(a, "stroke-linejoin", "miter"));
                    f.set("miterLimit", +d(a, "stroke-miterlimit", 4));
                    b && f.stroke()
                }
                return m
            }
        })
    })();
    ovi.provide("nokia.maps.geo.Strip");
    (function(e) {
        var k = e.geo.Coordinate,
            h = e.util,
            d = h.Coroutine,
            c = h.d,
            g = e.geo.Strip = new ovi.Class({
                initialize: function(b, f) {
                    this.internalArray = [];
                    this.addAll(b, 0, f)
                },
                destroy: function() {
                    this.gb && d.kill(this.gb)
                },
                internalArray: null,
                gb: null,
                Statics: {
                    fromObject: function(b) {
                        if (b instanceof g) return b;
                        if (ovi.type(b) !== "array") return new g;
                        return new g(b.length && ovi.type(b[0]) === "string" ? g.convertToArray(b.slice(1), b[0]) : g.convertToArray(b, "auto"), "values lat lng alt")
                    },
                    convertToArray: function(b, f) {
                        if (!b) return [];
                        if (b.length === 0 || f === "unsafe values lat lng alt") return b;
                        if (b instanceof g) return b.asArray();
                        var d = f ? f.split(" ") : ["auto"],
                            a = [],
                            r = !1,
                            l, m, p = d.length,
                            e = 0;
                        d[0] === "unsafe" && (r = !0, d.splice(0, 1), p--);
                        for (p > 4 && c("convertToArray: i > 4"); p--;) l = d[p], (l = this.$n[l]) ? (d[p] = l[0], e += l[1]) : c("convertToArray: no member found");
                        (e !== 100 || !d.length) && c("convertToArray: counter does not match 100");
                        (m = this.Vd[d[0]]) ? m.call(this, r, b, a, d.slice(1)): c("convertToArray: function expected");
                        return a
                    },
                    $n: {
                        lat: ["latitude",
                            1
                        ],
                        lng: ["longitude", 2],
                        alt: ["altitude", 0],
                        unsafe: ["unsafe", 0],
                        coords: ["coords", 100],
                        auto: ["auto", 100],
                        arrays: ["arrays", 97],
                        values: ["values", 97]
                    },
                    ql: {
                        latitude: 0,
                        longitude: 1,
                        altitude: 2
                    },
                    Vd: {
                        auto: function(b, f, c) {
                            h.isNumber(f[0]) ? g.Vd.values(b, f, c, ["latitude", "longitude"]) : g.Vd.coords(b, f, c)
                        },
                        coords: function(b, f, d) {
                            var a = f.length,
                                g, l;
                            for (g = 0; g < a; g++) b ? l = f[g] : (l = k.fromObject(f[g])) || c("coords: expected geo.Coordinate"), d.splice(d.length, 0, l.latitude, l.longitude, l.altitude)
                        },
                        values: function(b, f, c, a) {
                            g.Bg(!1,
                                b, f, c, a)
                        },
                        arrays: function(b, f, c, a) {
                            g.Bg(!0, b, f, c, a)
                        }
                    },
                    Bg: function(b, f, d, a, r) {
                        var l = b ? d[0].length : d.length,
                            m = r.length,
                            p = b ? d.length : 0,
                            e, h;
                        if (b)
                            for (; p--;) d[p].length !== l && c("_convertValues index out of bound");
                        else l % m && c("_convertValues members length is incorrect"), l /= m;
                        for (p = 0; p < l; p++) {
                            h = [p * 3, 0, void 0, void 0, void 0];
                            for (e = 0; e < m; e++) h[g.ql[r[e]] + 2] = b ? d[e][p] : d[p * m + e];
                            f || k.isValid.apply(this, h.slice(2)) ? a.splice.apply(a, h) : c("_convertValues: expected coords")
                        }
                    }
                },
                add: function(b, f) {
                    var d = this.getLength(),
                        b = k.fromObject(b),
                        f = ~~(f === 0 || f > 0 ? f : d);
                    f > d && c("add: index out of bound");
                    b && this.xa(this, f, 1, this.internalArray.splice(f * 3, 0, b.latitude, b.longitude, b.altitude))
                },
                addAll: function(b, f, d) {
                    var a = this.getLength(),
                        f = ~~(f === 0 || f > 0 ? f : a);
                    f > a ? c("addAll: index out of bound") : this.splice(f, 0, b, d)
                },
                addAllAsync: function(b, f, g, a) {
                    var r = this,
                        l = r.getLength(),
                        m, p = b[0] instanceof k ? 1 : g ? g.match("alt") ? 3 : 2 : 2,
                        f = ~~(f === 0 || f > 0 ? f : l);
                    f > l ? c("addAll: index out of bound") : m = d.create("nokia.maps.geo.Strip#addAllAsyncCo", function(a) {
                        for (var b,
                                f, c = a.idx, l = a.coords, m = a.multiplier;
                            (b = l.length) > 0;)
                            if (b = l.splice(0, (f = 300 * m) < b ? f : b), r.splice(c, 0, b, a.mode), c = a.idx = c + 300, d.shallYield()) return d.yield();
                        a.callback && a.callback()
                    }, "coords", "idx", "mode", "multiplier", "callback");
                    r.gb = m(b, f, g, p, a);
                    r.gb.onTerminated = function() {
                        r.gb = null
                    };
                    r.gb.run()
                },
                set: function(b, f) {
                    b = +b;
                    (b < 0 || b > this.getLength() || isNaN(b)) && c("geo.Strip#set: index out of bounds");
                    (f = k.fromObject(f)) && this.xa(this, b = ~~b, 1, this.internalArray.splice(b * 3, 3, f.latitude, f.longitude, f.altitude))
                },
                remove: function(b) {
                    b = +b;
                    b < 0 || b >= this.getLength() || isNaN(b) ? c("geo.Strip#remove: index out of bound") : this.xa(this, b = ~~b, 0, this.internalArray.splice(b * 3, 3))
                },
                splice: function(b, f, d, a) {
                    (b = +b) >= 0 && b <= this.getLength() && (f = +f) >= 0 || c("splice: arguments out of bound, idx=" + b + ", remove=" + f);
                    d = g.convertToArray(d, a);
                    if (f || d.length) this.xa(this, b = ~~b, d.length / 3, this.internalArray.splice.apply(this.internalArray, [b * 3, ~~f * 3].concat(d)))
                },
                get: function(b) {
                    var f = this.internalArray;
                    !(b >= 0 && b < f.length / 3) && c("get: index out of bound");
                    b = ~~b * 3;
                    return new k(f[b], f[b + 1], f[b + 2], 1)
                },
                getLatLng: function(b, f) {
                    var d = [],
                        a, g = 0;
                    a = this.getLength();
                    var l, b = +b;
                    l = f < 0 ? a + f : f ? f + b > a ? a : f + b : b + 1;
                    (isNaN(b) || b < 0 || (l = ~~l) < b) && c("getLatLng: index and count combination out of bounds");
                    for (a = ~~b; a < l; a++) d[g++] = this.internalArray[a * 3], d[g++] = this.internalArray[a * 3 + 1];
                    return d
                },
                getLength: function() {
                    return this.internalArray.length / 3 >>> 0
                },
                asArray: function() {
                    return [].concat(this.internalArray)
                },
                xa: function() {
                    var b = this.oa,
                        f;
                    if (b)
                        for (f = 0; f in b;) b[f++].apply(b[f++],
                            arguments)
                },
                addObserver: function(b, f) {
                    typeof b !== "function" && h.d("addObserver: callback is not a function");
                    var c = this.oa || (this.oa = []),
                        a = c.length;
                    c[a++] = b;
                    f && (c[a] = f);
                    c.length = ++a
                },
                removeObserver: function(b, f) {
                    var c, a, d = 0;
                    if (c = this.oa)
                        for (a = c.length; d < a;) c[d] === b && c[d + 1] === f && (c.splice(d, 2), a === 2 && delete this.oa), d += 2;
                    return this
                }
            })
    })(nokia.maps);
    ovi.provide("nokia.maps.util._packaging.base");
    ovi.provide("nokia.maps.dom.Event");
    (function(e) {
        if (!nokia.maps.util.getConstructor(nokia.maps.dom.Event)) {
            var k = !k,
                h = !k,
                d = nokia.maps.util.now,
                c = nokia.maps.util.d,
                g = e.Event = function(b) {
                    if (b)
                        for (var f in b) this[f] = b[f];
                    if (!this.timeStamp) this.timeStamp = d()
                };
            ovi.extend(g.prototype, {
                CAPTURING_PHASE: 1,
                AT_TARGET: 2,
                BUBBLING_PHASE: 3,
                bubbles: k,
                canBubble: k,
                canSicker: k,
                cancelable: k,
                defaultPrevented: h,
                PROPAGATION_OK: 0,
                PROPAGATION_STOP: 1,
                PROPAGATION_STOP_IMMEDIATE: 2,
                propagation: 0,
                stopPropagation: function() {
                    var b = this.nativeEvent;
                    if (this.propagation ===
                        0 && (this.propagation = 1, b)) try {
                        b.stopPropagation ? b.stopPropagation() : b.cancelBubble = k
                    } catch (f) {}
                    return this
                },
                cancel: function() {
                    return this.stopImmediatePropagation().preventDefault()
                },
                stopImmediatePropagation: function() {
                    var b = this.nativeEvent;
                    if (this.propagation !== 2 && (this.propagation = 2, b)) try {
                        b.stopImmediatePropagation ? b.stopImmediatePropagation() : b.cancelBubble = k
                    } catch (f) {}
                    return this
                },
                preventDefault: function() {
                    var b = this.nativeEvent;
                    if (!this.defaultPrevented && (this.defaultPrevented = k, b)) try {
                        b.preventDefault ?
                            b.preventDefault() : b.returnValue = h
                    } catch (f) {}
                    return this
                },
                DOM_INPUT_METHOD_UNKNOWN: 0,
                DOM_INPUT_METHOD_KEYBOARD: 1,
                DOM_INPUT_METHOD_PASTE: 2,
                DOM_INPUT_METHOD_DROP: 3,
                DOM_INPUT_METHOD_IME: 4,
                DOM_INPUT_METHOD_OPTION: 5,
                DOM_INPUT_METHOD_HANDWRITING: 6,
                DOM_INPUT_METHOD_VOICE: 7,
                DOM_INPUT_METHOD_MULTIMODAL: 8,
                DOM_INPUT_METHOD_SCRIPT: 9,
                DOM_KEY_LOCATION_STANDARD: 0,
                DOM_KEY_LOCATION_LEFT: 1,
                DOM_KEY_LOCATION_RIGHT: 2,
                DOM_KEY_LOCATION_NUMPAD: 3,
                DOM_KEY_LOCATION_MOBILE: 4,
                DOM_KEY_LOCATION_JOYSTICK: 5,
                getModifierState: function() {
                    c("NOT IMPLEMENTED!")
                },
                DOM_DELTA_PIXEL: 0,
                DOM_DELTA_LINE: 1,
                DOM_DELTA_PAGE: 2,
                deltaMode: 0,
                preventUnload: function(b) {
                    if (this.type === "beforeunload") this.nativeEvent.returnValue = b;
                    return this
                },
                clone: function() {
                    return new g(this)
                }
            })
        }
    })(nokia.maps.dom);
    ovi.provide("nokia.maps.gfx.BitmapImage");
    (function() {
        function e(a, b) {
            return typeof a === "number" ? a : b
        }
        var k = Math.min,
            h = Math.max,
            d = ovi.browser.msie && ovi.browser.version < 10,
            c = ovi.browser.version >= 8,
            g = nokia.maps.gfx,
            b = nokia.maps.dom,
            f = b.Page.browser,
            f = b.Page.browser,
            q = b.setStyle,
            a = g.Image,
            r = nokia.maps.util.d,
            l = nokia.maps.gfx.BitmapImage = new ovi.Class({
                Extends: nokia.maps.gfx.Image,
                Statics: {
                    utilizeCanvas: f.mobile ? f.safari : f.chrome || f.mozilla || f.opera
                },
                initialize: function(b, f, c, l, d, g) {
                    this.c = a.c++;
                    this.width = c || 0;
                    this.height = l || 0;
                    this.offsetX = e(d);
                    this.offsetY = e(g);
                    typeof b === "string" ? this.src = b : b && img.nodeName === "IMG" ? (this.src = b.src, f || (f = b.ownerDocument)) : r("image");
                    this.C = f || document
                },
                isBitmap: 1,
                getDocument: function() {
                    return this.C
                },
                vh: function() {
                    var a = -1,
                        b = this.Sb,
                        f = b && b.length || 0,
                        c;
                    for (this.Sb = null; ++a < f;) {
                        c = b[a];
                        try {
                            c[0].apply(c[1], c[2])
                        } catch (l) {
                            ovi.warn("Exception in user defined callback within gfx.BitmapImage!"), ovi.debug(l)
                        }
                    }
                },
                hi: function(a) {
                    this.naturalWidth = a.naturalWidth || a.width;
                    this.naturalHeight = a.naturalHeight || a.height;
                    this.width = this.width || a.naturalWidth || a.width;
                    this.height = this.height || a.naturalHeight || a.height
                },
                Sm: function(a, b) {
                    var c = -1,
                        l = this.De,
                        d = l && l.length || 0;
                    this.state = b ? 1 : -1;
                    if (b) {
                        this.hi(a);
                        f.msie && this.width === 0 && (a.ownerDocument.body.appendChild(a), this.hi(a), a.ownerDocument.body.removeChild(a));
                        for (; ++c < d;) this.ca(l[c]);
                        this.De = null
                    }
                    this.vh()
                },
                prepare: function(a, f) {
                    var c, l, d = !1,
                        g, f = f || this;
                    if (typeof a === "function") {
                        c = this.Sb || (this.Sb = []);
                        g = [].concat(arguments);
                        g.splice(0, 2, this);
                        for (l = c.length; l--;)
                            if (c[l][0] ===
                                a && c[l][1] === f) {
                                d = !0;
                                break
                            }
                        d || c.push([a, f, g])
                    }
                    if (this.state === 1) this.vh();
                    else if (this.state !== 0) this.state = 0, this.Ab = this.Ab || this.C.createElement("IMG"), b.imgLoader.request(this.Ab, this.src, this.Sm, this)
                },
                ca: function(a) {
                    var b = this.width && this.height,
                        f, c, g, r, e, w;
                    if (typeof this.state !== "number" || this.state <= 0)
                        if (this.prepare(), this.state <= 0) return a = a || this.C.createElement("DIV"), q(a, {
                            position: "absolute",
                            overflow: "hidden",
                            width: b ? this.width + "px" : "0",
                            height: b ? this.height + "px" : "0"
                        }), (this.De || (this.De = [])).push(a), a;
                    b = this.offsetX !== void 0;
                    if (l.utilizeCanvas) b && (g = h(0, k(this.offsetX, this.naturalWidth)), r = h(0, k(this.offsetY, this.naturalHeight)), e = k(this.width + this.offsetX - g, this.naturalWidth - g), w = k(this.height + this.offsetY - r, this.naturalHeight - r)), f = this.C.createElement("CANVAS"), f.width = this.width, f.height = this.height, c = f.getContext("2d"), b ? e && w && c.drawImage(this.Ab, g, r, e, w, 0, 0, e, w) : c.drawImage(this.Ab, 0, 0, this.width, this.height), this.o = f;
                    else {
                        try {
                            f = this.Ab.cloneNode(!1)
                        } catch (y) {
                            f = this.C.createElement("IMG"),
                                f.src = this.src
                        }
                        b && q(f, {
                            position: "absolute",
                            left: -this.offsetX + "px",
                            top: -this.offsetY + "px"
                        });
                        if (b || d) {
                            a = a || this.C.createElement("DIV");
                            q(a, {
                                position: "absolute",
                                overflow: "hidden",
                                width: this.width + "px",
                                height: this.height + "px"
                            });
                            if (d && (f.style.position = "absolute", !b)) f.style.width = this.width + "px", f.style.height = this.height + "px";
                            a.appendChild(f);
                            return a
                        }
                        f.style.width = this.width + "px";
                        f.style.height = this.height + "px"
                    }
                    if (a) return a.style.width = this.width + "px", a.style.height = this.height + "px", a.appendChild(f),
                        a;
                    return f
                },
                createElement: function(a) {
                    var b = this.ca();
                    this.setOpacity(b, a);
                    return b
                },
                setOpacity: function(a, b) {
                    var f = typeof b === "number" && b >= 0 && b <= 1 ? b : this.opacity,
                        l = a.ownerDocument,
                        g, e = Math.round(f * 100);
                    ((f = +f) !== f || f < 0 || f > 1) && r("opacity!");
                    a.$n$opacity = f;
                    if (d) {
                        if (f < 1 && !a.$n$opacityHack) {
                            for (a.$n$opacityHack = !0; a.firstChild;) a.removeChild(a.firstChild);
                            g = l.createElement("DIV");
                            if (!c) g.style.filter = "alpha(opacity=" + e + ")";
                            q(g, {
                                position: "relative",
                                width: this.width + "px",
                                height: this.height + "px",
                                overflow: "hidden"
                            });
                            a.$n$alphaImageLoader = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod='scale', src='" + this.src + "')";
                            l = l.createElement("DIV");
                            l.style.filter = a.$n$alphaImageLoader + (c ? "progid:DXImageTransform.Microsoft.Alpha(opacity=" + e + ")" : "");
                            q(l, {
                                position: "absolute",
                                top: (this.offsetX || 0) + "px",
                                left: (this.offsetY || 0) + "px",
                                width: this.width + "px",
                                height: this.height + "px"
                            });
                            g.appendChild(l);
                            a.appendChild(g)
                        }
                        if (f < 1 || a.$n$opacityHack)
                            if (a.firstChild.firstChild.style.filter = a.$n$alphaImageLoader +
                                (c ? "progid:DXImageTransform.Microsoft.Alpha(opacity=" + e + ")" : ""), !c) a.firstChild.style.filter = "alpha(opacity=" + e + ")"
                    } else a.style.opacity = f;
                    return this
                },
                clone: function(a, b, f, c, d) {
                    return new l(this.src, a || this.C, b || this.width, f || this.height, e(c, this.offsetX), e(d, this.offsetY))
                }
            });
        a.fromObjectListener.push(function(a, b) {
            return a instanceof l ? a : typeof a === "string" && a.indexOf("<svg") === -1 || a && a.nodeName === "IMG" ? new l(a, b) : void 0
        })
    })();
    ovi.provide("nokia.maps.gfx.GraphicsImage");
    (function() {
        var e = Array.prototype.slice,
            k = nokia.maps.gfx,
            h = nokia.maps.util,
            d = h.d,
            c = ovi.type,
            g = k.IDL,
            b = k.Painter,
            f = k.Image,
            q = k.Graphics,
            a = new k.SvgParser,
            d = nokia.maps.util.d,
            r = nokia.maps.gfx.GraphicsImage = new ovi.Class({
                Extends: nokia.maps.gfx.Image,
                initialize: function(a, m, p, r) {
                    var k = e.call(arguments, 0),
                        v = a,
                        u = a;
                    this.c = f.c++;
                    if (c(a) !== "function") u instanceof q && (v = u.getIDL()), v instanceof g ? (this.j = v, this.width = v.width, this.height = v.height, this.state = 1, a = h.A) : d("GraphicsImage: Illegal render function or IDL!");
                    this.C = p || document;
                    this.Kb = a;
                    this.xl = m || this;
                    this.opacity = 1;
                    k.splice(0, 4, null);
                    this.bl = k;
                    this.Ae = r instanceof b ? r : new b.defaultPainter
                },
                isGraphics: 1,
                getDocument: function() {
                    return this.C
                },
                getIDL: function() {
                    return this.j
                },
                prepare: function(a, b) {
                    var f, d;
                    if (!this.state) f = new q, d = this.bl, d[0] = f, this.Kb.apply(this.xl, d), this.j = f.getIDL(), this.width = this.j.width, this.height = this.j.height, this.state = 1;
                    if (c(a) === "function") this.Sb || (this.Sb = []), d = [].concat(arguments), d.splice(0, 2, this), a.apply(b || this, d)
                },
                createElement: function(a) {
                    this.state || this.prepare();
                    return this.Ae.createElement(this.j, this.C, typeof a === "number" ? a : this.opacity)
                },
                setOpacity: function(a, b) {
                    this.Ae.setOpacity(a, b);
                    return this
                },
                clone: function(a) {
                    var b, f;
                    b = new r(this.Kb);
                    for (f in this) b[f] = this[f];
                    if (a) b.C = a;
                    return b
                }
            });
        f.fromObjectListener.unshift(function(b) {
            if (b instanceof r) return b;
            if (b instanceof g) return new r(g);
            if (typeof b === "string" && b.indexOf("<svg") >= 0) return new r(a.parseSvg(b))
        })
    })();
    ovi.provide("nokia.maps.geo.BoundingBox");
    (function(e) {
        function k(a, b) {
            var f = a + b / 2;
            f -= f > 180 ? 360 : 0;
            return f
        }

        function h(a, b) {
            var f = b - a;
            f += f < 0 ? 360 : 0;
            return f
        }
        var d = Math,
            c = d.min,
            g = d.max,
            b = d.abs,
            f = e.geo,
            q = e.util.d,
            a = f.Coordinate,
            r = f.BoundingBox = function(b, f, c) {
                var b = a.fromObject(b),
                    d;
                if (!b || f && !(d = a.fromObject(f))) q(b ? "bottomRight" : "topLeft");
                this.topLeft = b;
                d ? c || b.latitude < d.latitude && q("BoundingBox top latitude < bottom latitude") : d = b;
                if ((this.bottomRight = d) && b.longitude > d.longitude) this.isCDB = !0
            };
        ovi.extend(r.prototype, {
            isCDB: !1,
            Uf: void 0,
            nf: void 0,
            Ec: void 0,
            equals: function(a) {
                return a && this.topLeft.equals(a.topLeft) && this.bottomRight.equals(a.bottomRight)
            },
            contains: function(b) {
                var f, c;
                b instanceof a && (b = new r(b, b));
                b = this.merge(b);
                c = b.getCenter();
                f = this.getCenter();
                return c.latitude === f.latitude && c.longitude === f.longitude && this.getHeight() === b.getHeight() && this.getWidth() === b.getWidth()
            },
            intersects: function(a) {
                var b = this.topLeft,
                    f = this.bottomRight,
                    c = a.topLeft,
                    a = a.bottomRight,
                    d = b.longitude <= f.longitude,
                    g = c.longitude <= a.longitude,
                    r = b.longitude <
                    a.longitude,
                    e = c.longitude < f.longitude;
                return f.latitude <= c.latitude && a.latitude <= b.latitude && (!d && (!g || r || e) || !g && (r || e) || r && e)
            },
            isEmpty: function() {
                return this.topLeft.longitude === this.bottomRight.longitude && this.topLeft.latitude === this.bottomRight.latitude
            },
            getCenter: function() {
                var b = this.Ec;
                if (b === void 0) var b = this.topLeft.longitude,
                    f = this.bottomRight.latitude,
                    b = new a(f + (this.topLeft.latitude - f) / 2, k(b, h(b, this.bottomRight.longitude)));
                return b
            },
            getWidth: function() {
                var a = this.Uf;
                a === void 0 && (a = h(this.topLeft.longitude,
                    this.bottomRight.longitude));
                return a
            },
            getHeight: function() {
                var a = this.nf;
                a === void 0 && (a = this.topLeft.latitude - this.bottomRight.latitude);
                return a
            },
            resizeToCenter: function(b) {
                b instanceof a || q("Parameter center must be an instance of nokia.maps.geo.Coordinate");
                var f = this.topLeft.longitude,
                    c = this.topLeft.latitude,
                    d = this.bottomRight.longitude,
                    g = this.bottomRight.latitude,
                    e = k(f, h(f, d)),
                    u = b.latitude - g - (c - g) / 2,
                    x = b.longitude - e,
                    x = x > 180 || x < -180 ? -(e + b.longitude) : x,
                    b = f + (x < 0 ? 2 * x : 0);
                d += x > 0 ? 2 * x : 0;
                d = d > 180 ? d - 360 :
                    d;
                c = u > 0 ? c + 2 * u : c;
                c >= 90 && (c = 90);
                g = u < 0 ? g + 2 * u : g;
                g <= -90 && (g = -90);
                return new r(new a(c, b < -180 ? 360 + b : b), new a(g, d))
            },
            merge: function(a) {
                a && a.push ? a.push(this) : a = [this, a];
                return r.merge(a)
            }
        });
        ovi.extend(r, {
            fromObject: function(b, f) {
                var c;
                if (b && (c = b.length) !== void 0) {
                    if (c === 2 && b[0] instanceof a && b[1] instanceof a) return new r(b[0], b[1], f);
                    if (c === 4) return new r(new a(b[0], b[1], void 0, f), new a(b[2], b[3], void 0, f), f)
                }
                return b instanceof r ? b : null
            },
            coverAll: function(a) {
                (!a || a.length === void 0) && q("no argument was given, array is expected");
                !a.length && q("empty array was given");
                for (var b = a[0], f = b.latitude, c = b.longitude, d = [f, c, f, c], g = a.length; --g;) b = a[g], d = r.wc(d, [f = b.latitude, c = b.longitude, f, c]);
                return r.fromObject(d)
            },
            fromPath: function(a, b) {
                !a && q("no argument was given, geo strip is expected");
                !(a instanceof f.Strip) && q("geo strip is expected");
                var c = null,
                    d, g, e = a.getLength(),
                    h;
                if (e)
                    if (e === 1) d = a.get(0), c = [d.latitude, d.longitude, d.latitude, d.longitude];
                    else if (e === 2) d = a.getLatLng(0), d.push(d[0]), d.push(d[1]), g = a.getLatLng(1), g.push(g[0]),
                    g.push(g[1]), c = r.fromObject(r.wc(d, g), b);
                else {
                    d = a.getLatLng(0);
                    g = a.getLatLng(1);
                    r.Ug(d = [d[0], d[1], g[0], g[1]]);
                    c = d;
                    for (h = 2; h < e; h++) d = a.getLatLng(h - 1), g = a.getLatLng(h), r.Ug(d = [d[0], d[1], g[0], g[1]]), c = r.wc(c, d)
                }
                return r.fromObject(c, b)
            },
            merge: function(a) {
                (!a || !a.length || !(a[0] instanceof r)) && q("array of bounding boxes is expected");
                for (var b = a[0], f = b.topLeft, c = b.bottomRight, d = [f.latitude, f.longitude, c.latitude, c.longitude], g = a.length; --g;)(b = a[g]) instanceof r ? d = r.wc(d, [(f = b.topLeft).latitude, f.longitude,
                    (c = b.bottomRight).latitude, c.longitude
                ]) : q("it is possible to merge bounding boxes only");
                return r.fromObject(d)
            },
            wc: function(a, b) {
                var f, d, r = a[1],
                    e = a[3],
                    q = b[1],
                    x = b[3],
                    w, y, B, D, A;
                f = c(a[2], b[2]);
                d = g(a[0], b[0]);
                w = h(r, e);
                y = k(r, w);
                B = h(q, x);
                A = k(q, B) - y;
                A += A - 1.0E-6 < 0 ? 360 : 0;
                A - 1.0E-6 < 180 ? (y = r, D = x) : (A = 360 - A, y = q, D = e);
                A = A + w / 2 + B / 2;
                A + 5.0E-7 >= 360 ? (y = -180, D = 180) : A - 5.0E-7 < w ? (y = r, D = e) : A - 5.0E-7 < B && (y = q, D = x);
                return [d, y, f, D]
            },
            Ug: function(a) {
                var f = a[1],
                    c = a[3],
                    d = a[0],
                    g = a[2];
                if (f > c && c - f > 180 || f < c && f - c < -180 || c < f && b(c - f) < 180) a[1] =
                    c, a[3] = f;
                d < g && (a[0] = g, a[2] = d)
            }
        })
    })(nokia.maps);
    ovi.provide("nokia.maps.geo.QuadTree");
    (function(e) {
        function k(b, f) {
            var c, a, d, l;
            if (a = f.length) {
                c = b.length;
                for (d = {}; c--;) d[b[c].id] = 1;
                for (; a--;)(l = f[a]).id in d || b.push(l)
            }
        }
        var h = e.geo,
            d = e.util,
            c = h.BoundingBox,
            e = d.QuadTree,
            g = e.Entry,
            e = h.QuadTree = new ovi.Class({
                initialize: function(b) {
                    this.K = new d.QuadTree(b, 180, 90, 0, 0);
                    this.Dc = ovi.Array()
                },
                isCDB: !1,
                getBoundingBox: function() {
                    var b;
                    if (!this.ba && !this.isCDB && (b = this.K.getExtremes())) this.ba = new c([-b["4"], b["7"]], [-b["6"], b["5"]]);
                    return this.ba || null
                },
                insertBoundingBox: function(b) {
                    var f = b.topLeft,
                        c = b.bottomRight,
                        a = f.longitude,
                        d = c.longitude,
                        l;
                    this.ba = null;
                    if (b.isCDB) this.Dc.push(l = new g(null, a, -f.latitude, d + 360, -c.latitude)), this.isCDB = !0;
                    return l || this.K.insertSorted(a, -f.latitude, d, -c.latitude)
                },
                insertCoordinate: function(b) {
                    var f = b.longitude,
                        b = -b.latitude;
                    this.ba = null;
                    return this.K.insertSorted(f, b, f, b)
                },
                insertLine: function(b, f, c, a) {
                    var d, l;
                    this.ba = null;
                    f < a ? d = f : (d = a, a = f);
                    b < c ? (f = -c, b = -b) : (f = -b, b = -c);
                    if (a - d > 180) this.Dc.push(l = new g(null, a, f, d + 360, b)), this.isCDB = !0;
                    return l || this.K.insertSorted(d,
                        f, a, b)
                },
                insertLineAlt: function(b, f, c, a, d) {
                    return this.insertLine(b, f, a, d)
                },
                remove: function(b) {
                    var f;
                    if (b.ka) this.K.remove(b);
                    else if ((b = (f = this.Dc).indexOf(b)) >= 0) f.splice(b, 1), this.isCDB = f.length > 0;
                    this.ba = null
                },
                he: function(b, f, c, a, d) {
                    for (var l = this.Dc, g = l.length, p, e = [], h = b + 360, k = c + 360; g--;) p = l[g], this.fh(p, b, f, c, a, d) ? e.push(p) : this.fh(p, h, f, k, a, d) && e.push(p);
                    return e
                },
                fh: function(b, f, c, a, d, l) {
                    var g = b[7],
                        p = b[4],
                        e = b[5],
                        b = b[6];
                    return !(g > a || e < f || p > d || b < c) && (l || g >= f && e <= a && p <= d && b >= c)
                },
                intersectBoundingBox: function(b,
                    f) {
                    var c = this.K,
                        a = b.topLeft,
                        d = b.bottomRight,
                        l = -a.latitude,
                        a = a.longitude,
                        g = -d.latitude,
                        d = d.longitude,
                        p;
                    b.isCDB ? (p = c.intersect(-180, l, d, g, f), k(p, c.intersect(a, l, 180, g, f)), k(p, this.he(d, l, a + 360, g, f))) : (p = c.intersect(a, l, d, g, f), k(p, this.he(a, l, d, g, f)));
                    return p
                },
                intersectCoordinate: function(b) {
                    var f = -b.latitude,
                        b = b.longitude,
                        c = this.K.intersect(b, f, b, f, 1);
                    k(c, this.he(b, f, b, f, 1));
                    return c
                }
            })
    })(nokia.maps);
    ovi.provide("nokia.maps.geo.Shape");
    (function(e) {
        function k(a, b) {
            return a / b < 0 && g(b - a) > 180
        }
        var h = Math,
            d = h.min,
            c = h.max,
            g = h.abs,
            b = h.pow,
            f = h.sqrt,
            q = h.round,
            a = e.geo,
            r = e.util,
            l = r.Point,
            m = r.math.clipping.clipStrips,
            p = r.math.clipping.clip,
            z = a.Coordinate,
            s = a.BoundingBox,
            v = r.Coroutine,
            u = [],
            x = !x,
            w = !x;
        a.Shape = new ovi.Class({
            Extends: a.Strip,
            initialize: function(b, f) {
                this.K = new a.QuadTree(+f || 10);
                this._super(u);
                this.xb = !!b;
                this.vi = [];
                this.yb = 0;
                this.addObserver(this.Ul, this)
            },
            Statics: {
                zo: u,
                Vg: function(b, f) {
                    var c = 0,
                        d = b.arr,
                        l, g, p, m, r, e, q, h, s = d.length;
                    b.shape ? (m = +d[b.i - 2], h = +d[b.i - 1]) : (b.shape = new a.Shape(b.closed), b.i = 0, s > 2 && (m = +d[b.i++], h = +d[b.i++], b.shape.internalArray.push(m, h, 0)));
                    g = b.shape;
                    p = g.K;
                    r = g.vi;
                    for (l = g.internalArray; b.i < s;)
                        if (e = +d[b.i++], q = +d[b.i++], l.push(e, q, 0), (m = p.insertLine(m, h, e, q)).fb = r.length, r.push(m), g.yb += k(q, h), m = e, h = q, !(++c & 15) && v.shallYield()) return v.yield();
                    if (g.closed && d.length >= 2) e = +d[0], q = +d[1], l.push(e, q, 0), (m = p.insertLine(m, h, e, q)).fb = r.length, m.$closing = 1, r.push(enty), g.yb += k(q, h);
                    if (f && b.callback) return v.kill(f),
                        b.callback.call(b.ctx, g);
                    return g
                },
                fromLatLngArray: function(a, b, f, c) {
                    var d;
                    if (r.isFunction(f)) return d = v.create("nokia.maps.geo.Shape#fromLatLngArrayCo", this.Vg, "arr", "closed", "callback", "ctx"), this.Wg = d(a, b, f, c || void 0), null;
                    return this.Vg({
                        arr: a,
                        closed: b
                    }, null)
                }
            },
            destroy: function() {
                this.Wg && v.kill(this.Wg);
                this._super()
            },
            getBoundingBox: function() {
                var a, b, f = this.ba;
                if (!f) f = this.K.getBoundingBox() || s.fromPath(this), this.xb && this.yb && (a = this.get(0), b = this.get(this.getLength() - 1), f = f.merge(s.coverAll([a,
                    b
                ]))), this.ba = f;
                return this.ba
            },
            tp: function(a) {
                var b = this.internalArray;
                this.internalArray = a.internalArray;
                this.xa(this, 0, a.internalArray.length / 3, b)
            },
            Ul: function(a, b, f, l) {
                var a = this.xb,
                    g = this.K,
                    p = this.vi,
                    m = p.length,
                    r = l.length / 3,
                    l = c(b - 1, 0),
                    e;
                this.ba = null;
                a && m && g.remove(p.splice(--m, 1)[0]);
                if (r) {
                    m = d(b - 1 + r, m - 1);
                    for (e = l; e <= m; e++) g.remove(p[e]);
                    r = [l, m - l + 1]
                } else m > 0 && b <= m && b > 0 ? (g.remove(p[l]), r = [l, 1]) : r = [l, 0];
                l = c(b - 1, 0);
                m = d(b - 1 + f, this.getLength() - 2);
                for (e = l; e <= m; e++) r.push(g.insertLineAlt.apply(g, this.internalArray.slice(e *
                    3, e * 3 + 6)));
                p.splice.apply(p, r);
                m = p.length;
                a && m && ((p[m++] = g.insertLine.apply(g, this.getLatLng(this.getLength() - 1).concat(this.getLatLng(0)))).$closing = 1);
                for (e = m; e--;) p[e].fb = e;
                this.yb = this.Cg(this.internalArray, 3)
            },
            Dg: function(a, b, f) {
                if (!this.xb) return !1;
                for (var l = b.length, g = 1, p = 0, m = b[0], r, e; g < l; g++) r = b[g], e = m.y + (r.y - m.y) * ((a.x - m.x) / (r.x - m.x)), d(m.x, r.x) <= a.x && c(m.x, r.x) >= a.x && (f ? e > a.y : e < a.y) && p++, m = r;
                return !!(p % 2)
            },
            Cg: function(a, b) {
                var f = this.xb ? 0 : b,
                    c = 0,
                    d = a.length,
                    l = a[f ? 1 : d - b + 1],
                    g;
                for (++f; f < d; f +=
                    b) c += k(g = a[f], l), l = g;
                return c
            },
            em: function(a, b) {
                return a.fb - b.fb
            },
            Oc: function(a, b, f, c) {
                function d(a, b) {
                    p && g(p - b) > 180 && (b += p < 0 ? -360 : 360);
                    p = b;
                    return f.latLngToPixel(a, b + (c ? c : 0))
                }
                var l = [],
                    p, m = a.length,
                    r, e = 0;
                for (r = 0; r < m; r += 2) l[e++] = d(a[r], a[r + 1]);
                b && (l[e] = d(a[0], a[1]));
                return l
            },
            ci: function(a, b) {
                for (var f = [], c = Infinity, d = -1, l, f = 0; f < a.length; f += 2) l = g(a[f + 1] - b), l += l > 180 ? 360 - l : l, l < c && (c = l, d = f);
                if (f > 0) return f = a.splice(d, a.length - d), f.concat(a);
                return a
            },
            Rk: function(a) {
                var b = a.length,
                    f, c = 0,
                    d, l, p, m = [],
                    r;
                l =
                    w;
                for (f = 0; f < b; f += 2) m[c++] = a[f], m[c++] = a[f + 1], p = new z(a[f], a[f + 1], void 0, x), d = a[f + 2] !== void 0 ? new z(a[f + 2], a[f + 3], void 0, x) : new z(a[0], a[1], void 0, x), p = s.coverAll([p, d]), !l && g(a[f + 1]) !== 180 && g(d.longitude) !== 180 && p.contains(new z(p.topLeft.latitude, 180, void 0, x)) && (l = g(d.latitude - a[f]), p = g(d.longitude - a[f + 1]), p += p > 180 ? -360 : 0, r = g(180 - d.longitude), r += r > 180 ? -360 : 0, l /= g(p) / g(r), d = d.latitude + (d.latitude > a[f] ? -l : l), l = a[f + 1] > 0 ? 180 : -180, m[c++] = d, m[c++] = l, m[c++] = d, m[c++] = -l, l = x);
                return m.length ? m : a
            },
            Ql: function(a,
                b, f, c) {
                var d = [],
                    l = a.length,
                    p, m, r, e, q, h, k = w;
                for (p = 0; p < l; p += c)
                    if (m = a[p], r = a[p + 1], p == 0 || ((h = g(q - r)) > 180 ? 360 - h : h) > f || g(e - m) > b) !k && g(r) == 180 && (d.push(m), d.push(r), d.push(m), d.push(-r), k = x), d.push(m), d.push(r), e = m, q = r;
                return d
            },
            $g: function(a) {
                var c = [],
                    d, g = a,
                    p, m;
                do {
                    p = q((g.origx ? g.origx : g.x) * 100) / 100;
                    m = q((g.origy ? g.origy : g.y) * 100) / 100;
                    if (!d || f(b(d.x - p, 2) + b(d.y - m, 2)) > 0.01) d = new l(p, m), c.push(d);
                    g = g.next
                } while (g && g != a);
                return c
            },
            clip: function(b, f, c, d, r, e, q) {
                var h = this.xb,
                    v = this.internalArray,
                    w = f.topLeft,
                    F =
                    f.bottomRight,
                    L = w.y,
                    ea = F.y,
                    U = w.x,
                    aa = F.x,
                    la = f.getCenter(),
                    f = new l(aa, L),
                    J = new l(U, ea),
                    f = [w, f, F, J],
                    J = b.pixelToGeo(w),
                    F = b.pixelToGeo(F),
                    ba = b.pixelToGeo(la),
                    F = s.fromPath(new a.Strip([J.latitude, J.longitude, J.latitude, ba.longitude, J.latitude, F.longitude, F.latitude, F.longitude, F.latitude, ba.longitude, F.latitude, J.longitude], "unsafe values lat lng")),
                    ba = !1,
                    G = 0,
                    R, Ba = -2,
                    J = [],
                    S, G = [],
                    ta, fa, I = 0,
                    ga = 0,
                    X;
                R = [];
                var ia = [],
                    V;
                if (c) c /= 2, ga = la.x, I = la.y, G = b.xyToGeo(ga - c, I - c), R = b.xyToGeo(ga + c, I + c), I = g(G.latitude - R.latitude),
                    ga = g(G.longitude - R.longitude);
                if (h) {
                    J = [
                        []
                    ];
                    R = this.Ql(v, I, ga, 3);
                    V = s.fromPath(new nokia.maps.geo.Strip(R, "unsafe values lat lng"), x);
                    V = V.merge((new s(new z(R[R.length - 2], R[R.length - 1], void 0, x), void 0, x)).merge(new s(new z(R[0], R[1], void 0, x), void 0, x)));
                    if ((G = V.getWidth()) < 360 && V.topLeft.longitude == -180) V = new s(new z(V.topLeft.latitude, 180, void 0, x), V.bottomRight, x);
                    G < 360 && V.bottomRight.longitude == 180 && (V = new s(V.topLeft, new z(V.bottomRight.latitude, -180, void 0, x), x));
                    S = F;
                    if (G < 360 && e > 0) S = V.getCenter().longitude,
                        X = b.geoToPixel(V.topLeft), X.x -= q, X.y -= q, X = b.pixelToGeo(X), e = b.geoToPixel(V.bottomRight), e.x += q, X.y += q, e = b.pixelToGeo(e), S = s.fromPath(new a.Strip([X.latitude, X.longitude, X.latitude, S, X.latitude, e.longitude, e.latitude, e.longitude, e.latitude, S, e.latitude, X.longitude], "unsafe values lat lng"), x);
                    R = this.ci(this.Rk(R), V.topLeft.longitude);
                    J[0] = this.Oc(R, h, b);
                    if (V.getWidth() == 360 && this.Cg(R, 2) % 2 == 1) {
                        J[0][1].x > J[0][J[0].length - 1].x && (J[0] = J[0].reverse());
                        ia = [];
                        G = J[0].length - 1;
                        for (c = 0; c < G; c++) v = J[0][c], ia[c] =
                            new l(v.x - 2 * b.w, v.y), ia[c + G] = new l(v.x - b.w, v.y), ia[c + 2 * G] = new l(v.x, v.y), ia[c + 3 * G] = new l(v.x + b.w, v.y), ia[c + 4 * G] = new l(v.x + 2 * b.w, v.y);
                        J[0] = ia;
                        X = b.latLngToPixel(d ? 90 : -90, 0);
                        X.y = d ? X.y - 51 : X.y + 51;
                        e = X.clone();
                        X.x = J[0][J[0].length - 1].x + 1;
                        e.x = J[0][0].x - 1;
                        J[0].push(X, e)
                    }
                    ba = this.Dg(w, J[0], d);
                    ia = m(J, L, U, aa, ea);
                    X = ia.length;
                    G = J;
                    V.getWidth() < 360 && V.contains(new z(V.topLeft.latitude, 180, void 0, x)) && (J = [], R = this.ci(R, V.bottomRight.longitude), J[0] = this.Oc(R, h, b), ba = !!(ba ^ this.Dg(w, J[0], d)), ia = m(J, L, U, aa, ea), X += ia.length,
                        G = G.concat(J));
                    V.getWidth() < 360 && !V.contains(new z(V.topLeft.latitude, 180, void 0, x)) && S.contains(new z(V.topLeft.latitude, 180, void 0, x)) && (e = V.getCenter().longitude > 0 ? -360 : 360, S = this.Oc(R, h, b, e), J = [S], ia = m(J, L, U, aa, ea), X += ia.length, G.push(S))
                } else {
                    q = this.K.intersectBoundingBox(F, x).sort(this.em);
                    G = q.length;
                    for (d = 0; d < G; d++)
                        if (la = q[d], w = la.fb, R = w * 3, Ba + 1 !== w && J.push(S = [ta = v[R], fa = v[R + 1]]), Ba = w, R = la.$closing ? 0 : R + 3, la = v[R], R = v[R + 1], !c || d === G - 1 || q[d + 1].fb !== w + 1 || g(fa - R) > ga || g(ta - la) > I) S.push(ta = la, fa = R);
                    if (this.yb) {
                        w = [];
                        for (d = 0; d < J.length; d++)
                            if (S = J[d], G = S.length) {
                                v = [];
                                for (c = 0; c < G; c += 2) c == 0 || c > 0 && !k(S[c + 1], S[c - 1]) ? v.push(S[c], S[c + 1]) : (v.push(S[c], S[c + 1]), w.push(v), v = [], S[c - 1] += S[c - 1] < 0 ? 360 : -360, v.push(S[c - 2], S[c - 1], S[c], S[c + 1]));
                                w.push(v)
                            }
                        J = w
                    }
                    R = [];
                    d = v = 0;
                    for (G = J.length; d < G; d++) S = J[d], S.length && (R[v++] = this.Oc(S, h, b));
                    G = e ? m(R, L, U, aa, ea) : R
                }
                if (!h || !X)
                    if (h)
                        if (ba) {
                            if (r) return G = [f], G.fullfilled = 1, G;
                            return u
                        } else return [];
                else return G;
                if (F.contains(V)) return G;
                J = [];
                for (d = G.length; d--;)
                    if (b = p(f, G[d])) {
                        S =
                            this.$g(b);
                        for (J.push(S); b.nextPoly;) b = b.nextPoly, S = this.$g(b), J.push(S)
                    }
                return J
            }
        })
    })(nokia.maps);
    ovi.provide("nokia.maps.dom._packaging.base");
    ovi.provide("nokia.maps.gfx._packaging.base");
    ovi.provide("nokia.maps.geo._packaging.base");
    var Ub = nokia.maps;
    delete Ub.config.params;
    Ub.loadPath = Ub.config.baseUrl;
    Ub.Config.setDefaults(nokia.maps.config);
    window.nokia.maps = nokia.maps;
})();