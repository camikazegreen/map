/* Load this script using conditional IE comments if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'UofA-icons\'">' + entity + '</span>' + html;
	}
	var icons = {
			'ico-mobile' : '&#xe000;',
			'ico-ua-social' : '&#xe001;',
			'ico-ua-housing' : '&#xe002;',
			'ico-ua-move-out' : '&#xe003;',
			'ico-ua-move-in' : '&#xe004;',
			'ico-ua-printer' : '&#xe006;',
			'ico-ua-link' : '&#xe007;',
			'ico-ua-libary' : '&#xe008;',
			'ico-ua-transportation' : '&#xe009;',
			'ico-ua-safety' : '&#xe00a;',
			'ico-ua-parking' : '&#xe00b;',
			'ico-ua-museum' : '&#xe00c;',
			'ico-ua-landmarks' : '&#xe00d;',
			'ico-ua-info' : '&#xe00e;',
			'ico-ua-athletics' : '&#xe010;',
			'ico-ua-accessibility' : '&#xe011;',
			'ico-key' : '&#xe013;',
			'ico-user' : '&#xe014;',
			'ico-ua-xbox' : '&#xe005;',
			'ico-ua-x' : '&#xe012;',
			'ico-ua_trolley' : '&#xe015;',
			'ico-ua_safe-ride' : '&#xe016;',
			'ico-ua_fitness' : '&#xe017;',
			'ico-ua_unisex' : '&#xe018;',
			'ico-ua-eat' : '&#xe019;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; i < els.length; i += 1) {
		el = els[i];
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/ico-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
};