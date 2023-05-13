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

import {withTrackChanges} from "../src/withTrackChanges";

// type CustomText = {text: string};
// type CustomElement = {type: "paragraph"; children: CustomText[]};

// declare module "slate" {
//   interface CustomTypes {
//     Editor: TrackChangesEditor & HistoryEditor;
//     Element: CustomElement;
//     Text: CustomText;
//   }
// }

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

const initialValue = [{type: "paragraph", children: [{text: ""}]}];

function handleKeyDown(e, editor) {
  if (!e.ctrlKey) {
    return;
  }

  e.preventDefault();

  switch (e.key) {
    case "b": {
      Transforms.setNodes(
        editor,
        {bold: true},
        {
          match: (n) => Text.isText(n),
          split: true,
        }
      );
      break;
    }

    case "i": {
    }

    case "t": {
    }
  }
}

const TrackChangesExample = () => {
  const editor = useMemo(
    () => withTrackChanges(withHistory(withReact(createEditor()))),
    []
  );

  const renderElement = useCallback(
    (props) => <p {...props.attributes}>{props.children}</p>,
    []
  );

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
