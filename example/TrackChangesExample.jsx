import React, {useCallback, useMemo, useState, useCallback} from "react";
// import isHotkey from "is-hotkey";
import {Editable, withReact, useSlate, Slate, ReactEditor} from "slate-react";
import {
  BaseEditor,
  createEditor,
  Descendant,
  Element as SlateElement,
  Editor,
  Transforms,
  Text,
} from "slate";
import {HistoryEditor, withHistory} from "slate-history";

import {withTrackChanges, toggleEditorMode} from "../src/withTrackChanges";

function getMarks(editor) {
  return Editor.marks(editor) || {};
}

function toggleMark(editor, m) {
  let editorMarks = getMarks(editor);

  if (!(m in editorMarks)) {
    editor.addMark(m, true);
  } else {
    editor.addMark(m, !editorMarks[m]);
  }

  console.log(`Mark ${m} is now ${getMarks(editor)[m]}`);
}

const initialValue = [{type: "paragraph", children: [{text: ""}]}];

function handleKeyDown(e, editor) {
  if (!e.ctrlKey) {
    return;
  }

  e.preventDefault();

  switch (e.key) {
    case "b": {
      toggleMark(editor, "bold");
      break;
    }

    case "i": {
      break;
    }

    case "1": {
      toggleEditorMode(editor, "TrackChanges");
      break;
    }
  }
}

const TrackChangesExample = () => {
  const editor = useMemo(
    () => withTrackChanges(withHistory(withReact(createEditor()))),
    []
  );

  const renderElement = useCallback((props) => {
    return <p>{props.children}</p>;
  }, []);

  const Leaf = (props) => {
    return (
      <span
        {...props.attributes}
        style={{fontWeight: props.leaf.bold ? "bold" : "normal"}}
      >
        {props.children}
      </span>
    );
  };

  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);

  return (
    <Slate editor={editor} value={initialValue}>
      <Editable
        placeholder="hi"
        autoFocus={true}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={(e) => {
          handleKeyDown(e, editor);
        }}
      />
    </Slate>
  );
};

export default TrackChangesExample;
