/**
 * DOM based HTML sanitizer
 * License: Mozilla Public License 2.0 or later version
 * (c) Vitaliy Filippov 2015+
 * Version 2015-08-11
 */

(function() {

window.getSanitizeCfg = function(nest, attr)
{
    // Default configuration is for sanitizing pasted html
    if (!nest)
    {
        var inline = 'a b i strong em strike code tt sub sup br table span font';
        nest = {
            'hr br': '/',
            'p': '#text '+inline,
            'ul': 'li',
            'ol': 'li',
            'dl': 'dt dd',
            'table': 'tr thead tbody',
            'thead tbody': 'tr',
            'tr': 'td th',
            '* h1 h2 h3 h4 h5 h6 blockquote li dt dd pre td th': 'h1 h2 h3 h4 h5 h6 blockquote p ul ol dl pre hr #text '+inline,
            'td th': '/'
        };
        nest[inline] = '#text '+inline;
    }
    if (!attr)
    {
        attr = {
            'p': 'align',
            'a': 'href name target',
            'td': 'colspan rowspan',
            'th': 'colspan rowspan'
        };
    }
    var r = { nest: {}, attr: {} };
    for (var k in nest)
    {
        var v = nest[k];
        k = k.toUpperCase().split(' ');
        v = v.toUpperCase().split(' ');
        for (var i = 0; i < k.length; i++)
        {
            for (var j = 0; j < v.length; j++)
            {
                r.nest[k[i]] = r.nest[k[i]] || {};
                r.nest[k[i]][v[j]] = true;
            }
        }
    }
    for (var k in attr)
    {
        var v = attr[k].split(' ');
        k = k.toUpperCase();
        r.attr[k] = {};
        for (var i = 0; i < v.length; i++)
            r.attr[k][v[i]] = true;
    }
    return r;
};

window.sanitizeHtml = function(html, cfg)
{
    var r = document.createElement('div');
    r.innerHTML = html;
    sanitize(r, true, cfg);
    return r.innerHTML.replace(/[ \t]*(\n[ \t]*)+/g, '\n').replace(/[ \t]{2,}/g, ' ').replace(/^\s*/, '');
};

function sanitize(el, is_root, cfg)
{
    var n = is_root ? '*' : el.nodeName;
    for (var i = 0; i < el.childNodes.length; i++)
    {
        var c = el.childNodes[i];
        if (c.nodeType != 1 && c.nodeType != 3 ||
            !cfg.nest[n][c.nodeType == 1 ? c.nodeName : '#TEXT'] ||
            c.nodeType == 1 && !sanitize(c, false, cfg))
        {
            // Keep contents of generally allowed tags which are just not in place
            if (c.nodeType == 1 && cfg.nest[c.nodeName])
                while (c.childNodes.length)
                    el.insertBefore(c.childNodes[0], c);
            el.removeChild(c);
            i--;
        }
    }
    if (!is_root)
    {
        for (var i = el.attributes.length-1; i >= 0; i--)
            if (!cfg.attr[n] || !cfg.attr[n][el.attributes[i].nodeName])
                el.removeAttribute(el.attributes[i].nodeName);
        if (el.nodeName == 'A' && !(el.getAttribute('href') || '').match(/^https?:\/\/|^mailto:/i))
            el.removeAttribute('href');
        if ((el.nodeName == 'A' || el.nodeName == 'SPAN' || el.nodeName == 'FONT') && !el.attributes.length ||
            el.innerHTML.match(/^\s*$/) && !cfg.nest[n]['/'])
            return false;
    }
    return true;
}

})();
