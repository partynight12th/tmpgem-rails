var djs = {};//Default setting JavaScript

djs.w = window;
djs.d = djs.w.document;

//IEでconsole未定義エラーを出さないようにする。
if(!window.console){
	(function(win){
		var names = [ 'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'profile', 'profileEnd', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn' ];
		var consoleMock = {};
		for(var i = 0, len = names.length; i < len; i++){
			consoleMock[names[i]] = function(){};
		}
		win.console = consoleMock;
	})(djs.w);
}


djs.b = function(browser){
	djs.b.value = browser;
	djs.b["is"+browser] = true;
	djs.b.modern = !/^ie/i.test(browser);
}

if(typeof djs.d.documentElement.style.maxHeight !== "undefined"){
	if(!/*@cc_on!@*/false){
		if(typeof djs.w.mozAnimationStartTime !== "undefined"){
			djs.b("firefox");
		}else if(typeof djs.w.opera !== "undefined"){
			djs.b("opera");
		}else{
			if(typeof djs.w.Image === "function"){
				djs.b("chrome");
			}else if(typeof djs.w.Image === "object"){
				djs.b("safari");
			}else{
				djs.b("other");
			}
		}
	}else if(typeof djs.d.documentMode !== "undefined"){
		djs.b("ie"+djs.d.documentMode);
	}else{
		djs.b("ie7");
	}
}else{
	djs.b("ie6");
}

if(typeof jQuery !== "undefined"){

	console.info("jQuery version : " + jQuery().jquery);

	djs.parentid = function(t){
		var t$ = jQuery(t);
		var pid = t$.attr("id");
		if(pid && pid.length > 0){
		}else if(t$.get(0).tagName.match(/body/i)){
			pid = "_body";
		}else{
			pid = djs.parentid(t$.parent());
		}
		return pid;
	}


	djs.unloader = function(){
		jQuery(djs.d).off("click", "a, area");
	}

	djs.anchortrace = function(){
		jQuery(djs.d).on("click", "a, area", function(){
			var href = jQuery(this).attr("href");
			var pathname = location.pathname;
			if(href && !href.match("^http")){
				href = pathname.replace(/[^\/]*$/,"") + href;
				while(href.match(/\.\.\//)){
			href = href.replace(/[^\/]*\/\.\.\//, "");	
			}
			href = href.replace(/\.\//,"").replace(/\/\//, "/");
			}
			pathname += location.search;

			//console.debug("_trackEvent", pathname, "#" + djs.parentid(this), href);

			_gaq.push(["_trackEvent", pathname, "#" + djs.parentid(this), href ]);
		});

		jQuery(djs.w).unload(this.unloader);
	}

	jQuery(function(){
		if("_gaq" in djs.w){
			djs.anchortrace();
		}
	});

}
