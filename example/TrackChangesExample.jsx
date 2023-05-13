import React, {useCallback, useMemo, useState} from "react";
import isHotkey from "is-hotkey";
import {Editable, withReact, useSlate, Slate, ReactEditor} from "slate-react";
import {
  BaseEditor,
  createEditor,
  Descendant,
  Element as SlateElement,
  Editor,
} from "slate";
import {HistoryEditor, withHistory} from "slate-history";

import {TrackChangesEditor} from "../src/types";
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

const initialValue = [
  {type: "paragraph", children: [{text: ""}]},
];

const TrackChangesExample = () => {
  const editor = useMemo(
    () => withTrackChanges(withHistory(withReact(createEditor()))),
    []
  );

  return (
    <Slate editor={editor} value={initialValue}>
      <Editable placeholder="hi" autoFocus={true} />
    </Slate>
  );
};

export default TrackChangesExample;
