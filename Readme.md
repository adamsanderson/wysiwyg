WYSIWYG
=======

wysiwyg is a set of editor commands that can be used to build a full wysiwyg editor.

Check the [demo](http://adamsanderson.github.com/wysiwyg/) to see these commands in action.

Installation
------------
To use as a [component](https://github.com/component/component):

    $ component install adamsanderson/wysiwyg

Example
-------

Assuming you have an element on the page being edited with `contenteditable`:

    var el = document.getElementById('content');
    el.setAttribute('contenteditable', true);

You can use the functions exposed by `wysiwyg` to modify the state of the edited text:

    var wysiwyg = require('wysiwyg');
    wysiwyg.commands.bold();    // Make the text at the cursor bold
    wysiwyg.commands.h1();      // Convert the block element to a header
    wysiwyg.commands.ul();      // Now convert it to an unordered list
    wysiwyg.commands.indent();  // Indent the list

You can also query the state of the edited content:

    wysiwyg.state.bold();       // Returns true if the cursor is in bold text
    wysiwyg.state.h1();         // Returns true if the block is a header

API
---

**Commands**

Commands modify the content being edited.

`bold`, `italic`, `strike`, `underline`, `sub`, and `sup` will format text.  Meanwhile, `clear` will remove all formatting from the current selection.

`h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`, `div`, and `blockquote` with change the current block.  So if you have the following markup:

    <p>This is just <b>great</b></p>
    
Then calling `wysiwyg.commands.h1()` will result in:

    <h1>This is just <b>great</b></h1>


`ol` and `ul` will turn a line into a list with that line being the first list item.  If the line is already a list item, it will revert the line.

`indent` and `outdent` will indent or outdent lists.  When used on other elements, it will typically indent using blockquote elements.


`hr`, `br`, `img`, and `html` will insert their respective elements.  `img` should be called with the url of the image.  `html` can be used to insert arbitrary html at the cursor.

**States**

States let you determine how the text being edited is styled.  These are useful for styling toolbar buttons.

`bold`, `italic`, `strike`, `underline`, `sub`, and `sup` can all be called to determine the formatting the text at the cursor.  Each one will return `true` or `false` depending on if the style applies to the text.

`h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`, `div`, and `blockquote` will return true if the current block of text is of that type.  These are mutually exclusive.

Caveats
-------
Much of this depends on the browser's implementation of the `contenteditable` commands, different browsers may mark up content differently.  For more details see Mozilla's documentation on [Rich Text Editing](https://developer.mozilla.org/en-US/docs/Rich-Text_Editing_in_Mozilla)

Tips
----
For the best results, wrap the content you want to edit in a `div`.  If you edit paragraphs directly, some browsers will not allow you to insert lists.

If possible, style the element being edited with `white-space: pre-wrap`.  This allows browsers to preserve white space while editing, and avoids some odd behavior around inserting &nbsp; all over the place.

License
-------

MIT
