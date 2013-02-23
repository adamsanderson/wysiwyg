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

var states = {
  bold:       makeQuery("bold"),
  italic:     makeQuery("italic"),
  strike:     makeQuery("strikethrough"),
  underline:  makeQuery("underline"),
  sub:        makeQuery("subscript"),
  sup:        makeQuery("superscript")
} 

function makeCommand(command, param){
  return function(userParam){
    return document.execCommand(command, null, param || userParam);
  }
}

function makeQuery(command){
  return function(){
    var value = document.queryCommandValue(command);
    // Possible return values are the strings: "true", "false", and ""
    return value === "true";
  }
}

module.exports = {
  commands: commands,
  is: states
};