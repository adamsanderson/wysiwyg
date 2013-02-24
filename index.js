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
  ul:         checkParent("ul"),
  
} 

function makeCommand(command, param){
  return function(userParam){
    return document.execCommand(command, false, param || userParam);
  }
}

function makeQuery(command){
  return function(){
    var value = document.queryCommandValue(command);
    // Webkit/Firefox return values are the strings: "true", "false", and ""
    // IE returns booleans
    return value === "true" || value === true;
  }
}

function checkParent(name){
  return function(){
    var node, block;
    
    node = getRangeStartElement();
    
    if (node) {
      block = getBlockParent(node);
      return block && block.tagName.toLowerCase() === name;
    }
    
  }
}

function getBlockParent(el){
  var display = getStyle(el).display;
  if (display == "block" || display == "table"){
    return el;
  } else {
    return getBlockParent(el.parentElement);
  }
}

function getStyle(el){
  if (window.getComputedStyle) {
    return window.getComputedStyle(el);
  } else {
    return el.currentStyle;
  }
}

function getRangeStartElement(){
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
  
  if (node.nodeType == 1){
    return node;
  } else {
    return node.parentElement;
  }
}

module.exports = {
  commands: commands,
  state: state
};