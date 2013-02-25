/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(p, parent, orig){
  var path = require.resolve(p)
    , mod = require.modules[path];

  // lookup failed
  if (null == path) {
    orig = orig || p;
    parent = parent || 'root';
    throw new Error('failed to require "' + orig + '" from "' + parent + '"');
  }

  // perform real require()
  // by invoking the module's
  // registered function
  if (!mod.exports) {
    mod.exports = {};
    mod.client = mod.component = true;
    mod.call(this, mod, mod.exports, require.relative(path));
  }

  return mod.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path){
  var orig = path
    , reg = path + '.js'
    , regJSON = path + '.json'
    , index = path + '/index.js'
    , indexJSON = path + '/index.json';

  return require.modules[reg] && reg
    || require.modules[regJSON] && regJSON
    || require.modules[index] && index
    || require.modules[indexJSON] && indexJSON
    || require.modules[orig] && orig
    || require.aliases[index];
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `fn`.
 *
 * @param {String} path
 * @param {Function} fn
 * @api private
 */

require.register = function(path, fn){
  require.modules[path] = fn;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to){
  var fn = require.modules[from];
  if (!fn) throw new Error('failed to alias "' + from + '", it does not exist');
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj){
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function fn(path){
    var orig = path;
    path = fn.resolve(path);
    return require(path, parent, orig);
  }

  /**
   * Resolve relative to the parent.
   */

  fn.resolve = function(path){
    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    if ('.' != path.charAt(0)) {
      var segs = parent.split('/');
      var i = lastIndexOf(segs, 'deps') + 1;
      if (!i) i = 0;
      path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
      return path;
    }
    return require.normalize(p, path);
  };

  /**
   * Check if module is defined at `path`.
   */

  fn.exists = function(path){
    return !! require.modules[fn.resolve(path)];
  };

  return fn;
};require.register("component-event/index.js", function(module, exports, require){

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  if (el.addEventListener) {
    el.addEventListener(type, fn, capture);
  } else {
    el.attachEvent('on' + type, fn);
  }
  return fn;
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  if (el.removeEventListener) {
    el.removeEventListener(type, fn, capture);
  } else {
    el.detachEvent('on' + type, fn);
  }
  return fn;
};

});
require.register("wysiwyg/index.js", function(module, exports, require){
var ELEMENT_NODE = document.ELEMENT_NODE;

var commands = {
  bold:       makeCommand("bold"),
  italic:     makeCommand("italic"),
  strike:     makeCommand("strikethrough"),
  underline:  makeCommand("underline"),
  sub:        makeCommand("subscript"),
  sup:        makeCommand("superscript"),
  
  h1:         makeCommand("formatblock","h1"),
  h2:         makeCommand("formatblock","h2"),
  h3:         makeCommand("formatblock","h3"),
  h4:         makeCommand("formatblock","h4"),
  h5:         makeCommand("formatblock","h5"),
  h6:         makeCommand("formatblock","h6"),
  p:          makeCommand("formatblock","p"),
  div:        makeCommand("formatblock","div"),
  blockquote: makeCommand("formatblock","blockquote"),
  
  ol:         makeCommand("insertorderedlist"),
  ul:         makeCommand("insertunorderedlist"),
  
  indent:     makeCommand("indent"),
  outdent:    makeCommand("outdent"),
  clear:      makeCommand("removeformat"),
  
  hr:         makeCommand("inserthorizontalrule"),
  img:        makeCommand("insertimage"),
  br:         makeCommand("inserthtml", "<br>"),
  
  html:       makeCommand("inserthtml")
};

var state = {
  bold:       makeQuery("bold"),
  italic:     makeQuery("italic"),
  strike:     makeQuery("strikethrough"),
  underline:  makeQuery("underline"),
  sub:        makeQuery("subscript"),
  sup:        makeQuery("superscript"),
  
  h1:         checkParent("h1"),
  h2:         checkParent("h2"),
  h3:         checkParent("h3"),
  h4:         checkParent("h4"),
  h5:         checkParent("h5"),
  h6:         checkParent("h6"),
  p:          checkParent("p"),
  div:        checkParent("div"),
  blockquote: checkParent("blockquote"),
  
  ol:         checkParent("ol"),
  ul:         checkParent("ul")  
}; 

function makeCommand(command, param){
  return function(userParam){
    return document.execCommand(command, false, param || userParam);
  };
}

function makeQuery(command){
  return function(){
    var value = document.queryCommandValue(command);
    // Webkit/Firefox return values are the strings: "true", "false", and ""
    // IE returns booleans
    return value === "true" || value === true;
  };
}

function checkParent(name){
  return function(){
    var el, blockEl;
    el = nearestElement(getRangeStartNode());
    
    if (el) {
      blockEl = getBlockElement(el);
      return blockEl && blockEl.tagName.toLowerCase() === name;
    }
  };
}

function getBlockElement(el){
  var style   = getStyle(el);
  var display = style.display;
  
  if (display == "block" || display == "table"){
    return el;
  } else {
    return getBlockElement(el.parentElement);
  }
}

function nearestElement(node){
  return node.nodeType == ELEMENT_NODE ? node : node.parentElement;
}

function getStyle(el){
  if (window.getComputedStyle) {
    return window.getComputedStyle(el);
  } else {
    return el.currentStyle;
  }
}

function getRangeStartNode(){
  var selection;
  var node;
  
  if (document.getSelection){
    selection = document.getSelection();
    if (selection.rangeCount){
      node = selection.getRangeAt(0).startContainer;
    } else {
      node = document.body;
    }
  } else {
    node = document.selection.createRange().parentElement();
  }
  
  return node;
}

module.exports = {
  commands: commands,
  state: state
};
});
require.alias("component-event/index.js", "wysiwyg/deps/event/index.js");
