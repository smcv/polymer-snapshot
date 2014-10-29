/*
 * Copyright 2013 The Polymer Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function() {

var thisFile = 'platform.js';
var scopeName = 'Platform';

function processFlags(flags) {

  if (flags.build) {

    // use the minified build
    this.modules = ['platform.min.js'];

  } else {

    // If any of these flags match 'native', then force native ShadowDOM; any
    // other truthy value, or failure to detect native
    // ShadowDOM, results in polyfill 

    flags.shadow = (flags.shadow || flags.shadowdom || flags.polyfill);
    if (flags.shadow === 'native') {
      flags.shadow = false;
    } else {
      flags.shadow = flags.shadow || !HTMLElement.prototype.createShadowRoot;
    }

    var ShadowDOMNative = [
      'src/patches-shadowdom-native.js'
    ];

    var ShadowDOMPolyfill = [
      '../ShadowDOM/shadowdom.js',
      'src/patches-shadowdom-polyfill.js',
      'src/ShadowCSS.js'
    ];

    // select ShadowDOM impl

    var ShadowDOM = flags.shadow ? ShadowDOMPolyfill : ShadowDOMNative;

    // construct full dependency list

    this.modules = [].concat(
      ShadowDOM,
      [
        '../URL/url.js',
        'src/lang.js',
        '../HTMLImports/html-imports.js',
        '../CustomElements/custom-elements.js',
        'src/patches-custom-elements.js',
        'src/dom.js',
        // these scripts are loaded in platform.js due to polyfill timing issues
        'src/unresolved.js',
        'src/module.js'
      ]
    );

  }

}

//CustomElements = {useNative: true};

// export

window[scopeName] = {
  entryPointName: thisFile,
  processFlags: processFlags
};

// bootstrap

var script;
if (document.currentScript) {
  script = document.currentScript;
} else {
  script = document.querySelector('script[src*="' + thisFile + '"]');
}
var src = script.attributes.src.value;
var basePath = src.slice(0, src.indexOf(thisFile));

if (!window.PolymerLoader) {
  var path = basePath + '../tools/loader/loader.js';
  document.write('<script src="' + path + '"></script>');
}
document.write('<script>PolymerLoader.load("' + scopeName + '")</script>');

})();
