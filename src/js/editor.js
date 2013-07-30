/*!
Custom interactive code editor and preview slide plugin for reveal.js
Written by: [John Yanarella](http://twitter.com/johnyanarella)
Copyright (c) 2012-2103 [CodeCatalyst, LLC](http://www.codecatalyst.com/).
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/

// Generated by CoffeeScript 1.3.3
(function() {
  var $preview, creatorEditor, loadTemplate, showPreview;

  $preview = $("<div class=\"preview\" style=\"width: 373px; height: 730px;\">\n	<iframe></iframe>\n</div>");

  showPreview = function(editor) {
    var preview, previewFrame;
    Reveal.keyboardEnabled = false;
    $preview.bPopup({
      positionStyle: 'fixed',
      onClose: function() {
        Reveal.keyboardEnabled = true;
      }
    });
    previewFrame = $preview.children('iframe').get(0);
    preview = previewFrame.contentDocument || previewFrame.contentWindow.document;
    preview.write(editor.getValue());
    preview.close();
  };

  creatorEditor = function($targetSlide) {
    var url;
    url = $targetSlide.data('source');
    $.ajax({
      url: url,
      dataType: 'json'
    }).done(function(data) {
      var $loadingIndicator, $textArea, editor, loadingIndicator, options, section, step, textArea, _i, _j, _len, _len1, _ref, _ref1;
      options = "";
      _ref = data.sections;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        section = _ref[_i];
        options += "<optgroup label=\"" + section.title + "\">";
        _ref1 = section.steps;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          step = _ref1[_j];
          options += "<option value=\"" + step.url + "\">" + step.title + "</option>";
        }
        options += "</optgroup>";
      }
      $targetSlide.append("<h2>" + data.title + "</h2>\n<textarea></textarea>\n<div style=\"display: inline-table; width: 820px;\">\n	<div style=\"display: table-cell; width: 410px; text-align: left;\">\n		<select class=\"editor-combo-box\">\n			" + options + "\n		</select>\n	</div>\n	<div style=\"display: table-cell; width: 410px; text-align: right;\">\n		<button class=\"editor-preview-button\">Preview</button>\n	</div>\n</div>\n<img class=\"editor-loading-indicator\" src=\"resource/image/LoadingIndicator.gif\" width=\"32\" height=\"32\">");
      textArea = $targetSlide.find('textarea')[0];
      $textArea = $(textArea);
      editor = CodeMirror.fromTextArea(textArea, {
        mode: 'text/html',
        tabMode: 'indent',
        indentUnit: 4,
        indentWithTabs: true,
        lineNumbers: true,
        extraKeys: {
          "'>'": function(editor) {
            return editor.closeTag(editor, '>');
          },
          "'/'": function(editor) {
            return editor.closeTag(editor, '/');
          }
        }
      });
      editor.setSize($textArea.width(), $textArea.height());
      editor.refresh();
      loadingIndicator = $targetSlide.find('img.editor-loading-indicator')[0];
      $loadingIndicator = $(loadingIndicator);
      $targetSlide.find('select.editor-combo-box').on('change', function(event) {
        return loadTemplate(editor, $loadingIndicator, $(event.target).val());
      });
      $targetSlide.find("button.editor-preview-button").on('click', function(event) {
        return showPreview(editor);
      });
      Reveal.addEventListener('slidechanged', function(event) {
        return editor.refresh();
      });
      loadTemplate(editor, $loadingIndicator, data.sections[0].steps[0].url);
    }).fail(function(promise, type, message) {
      alert(message);
    });
  };

  loadTemplate = function(editor, $loadingIndicator, url) {
    $loadingIndicator.addClass('loading');
    $.ajax({
      url: url,
      dataType: 'text'
    }).done(function(template) {
      editor.setValue(template);
    }).fail(function(promise, type, message) {
      alert(message);
    }).always($loadingIndicator.removeClass('loading'));
  };

  $('section.editor').each(function(index, element) {
    var $slide;
    $slide = $(element);
    return creatorEditor($slide);
  });

}).call(this);
