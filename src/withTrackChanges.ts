import {
  Range,
  Transforms,
  Node,
  Editor,
  Text,
  Element,
  NodeEntry,
  BasePoint,
} from "slate";

import {editorHasMode} from "./utils";
import {
  TrackChangesEditor,
  EditorMode,
  TRACK_CHANGES_OPERATION,
  TrackChangesText,
  TrackChangesInfo,
} from "./types";

export function toggleEditorMode(
  editor: TrackChangesEditor,
  mode: EditorMode
): void {
  const current = editor.modes[mode];
  editor.modes[mode] = !current;
  console.log(`Changed mode ${mode} from ${current} to ${editor.modes[mode]}`);
  editor.onChange();
}

function _getTrackChangesInfo(editor: TrackChangesEditor): TrackChangesInfo {
  const marks = Editor.marks(editor);
  //@ts-ignore
  return marks.trackChanges || null;
}

const tcDeleteFragment = (editor: TrackChangesEditor, selection: Range) => {
  const selectionRef = Editor.rangeRef(editor, selection);
  Transforms.removeNodes(editor, {
    match: (e) =>
      //@ts-ignore
      Text.isText(e) &&
      e.trackChanges?.operation === TRACK_CHANGES_OPERATION.TEXT_ADDED,
  });

  const newSelection = selectionRef.unref();
  if (newSelection !== null) {
    Transforms.select(editor, newSelection);
  }

  Editor.addMark(editor, "trackChanges", {
    operation: TRACK_CHANGES_OPERATION.TEXT_DELETED,
  });
};

export function withTrackChanges<T extends Editor>(e: T): TrackChangesEditor {
  const {
    deleteBackward,
    deleteForward,
    insertText,
    deleteFragment,
    insertFragment,
  } = e;
  const editor = e as T & TrackChangesEditor;

  if (!editor.modes) {
    editor.modes = {TrackChanges: false};
    console.log("Initialized editor modes");
  }

  editor.insertText = (text) => {
    if (editorHasMode(editor, "TrackChanges")) {
      editor.addMark("trackChanges", {
        operation: TRACK_CHANGES_OPERATION.TEXT_ADDED,
      });
    }

    insertText(text);
  };

  // editor.insertFragment = (fragment: Node[]) => {
  //     if (!editorHasMode(editor, "TrackChanges") || !editor.selection) {
  //         return insertFragment(fragment);
  //     }

  //     tcDeleteFragment(editor, editor.selection);

  //     const after = Editor.after(editor, Editor.end(editor, editor.selection), { unit: "character" });
  //     const selectionAfterRef = Editor.pointRef(editor, after || editor.selection.focus);

  //     Transforms.insertNodes(
  //         editor,
  //         fragment.flatMap((node) => {
  //             if (Text.isText(node)) {
  //                 return [
  //                     {
  //                         ...node,
  //                         trackChanges: { operation: TRACK_CHANGES_OPERATION.TEXT_ADDED },
  //                     },
  //                 ];
  //                 //@ts-ignore
  //             } else if (Element.isElement(node) && node.type === "paragraph") {
  //                 // note that we're losing paragraph styling here
  //                 const updatedChildren: Node[] = node.children.map((child) => {
  //                     if (Text.isText(child)) {
  //                         return {
  //                             ...child,
  //                             trackChanges: { operation: TRACK_CHANGES_OPERATION.TEXT_ADDED },
  //                         };
  //                     } else {
  //                         return child;
  //                     }
  //                 });
  //                 return updatedChildren;
  //             } else {
  //                 // TODO handle other types of node
  //                 return [node];
  //             }
  //         }),
  //         { at: Range.end(editor.selection) }
  //     );
  // }

  editor.deleteBackward = (unit) => {
    if (!editorHasMode(editor, "TrackChanges") || !editor.selection) {
      return deleteBackward(unit);
    } else {
      if (Range.isCollapsed(editor.selection)) {
        const [node, path] = Editor.parent(editor, editor.selection);

        const back1 = Editor.before(editor, editor.selection.anchor, {
          distance: 1,
          unit: "character",
        });

        if (!back1) {
          // probably only when we're at the beginning of the document
          return;
        }

        const back1Ref = Editor.pointRef(editor, back1);
        Transforms.select(e, {
          anchor: editor.selection.anchor,
          focus: back1,
        });

        const currentTrackChangesInfo = _getTrackChangesInfo(editor);

        if (
          currentTrackChangesInfo.operation ===
          TRACK_CHANGES_OPERATION.TEXT_ADDED
        ) {
          // actually delete it
          Transforms.delete(editor, {
            at: editor.selection.anchor,
            unit: "character",
            reverse: true,
          });
        } else {
          editor.addMark("trackChanges", {
            operation: TRACK_CHANGES_OPERATION.TEXT_DELETED,
          });
          const newSelection = back1Ref.unref();
          if (newSelection) {
            // should probably always be true, not sure when newSelection would be null
            Transforms.select(e, newSelection);
          }
        }
      } else {
        tcDeleteFragment(editor, editor.selection);
      }
    }
  };

  //TODO
  editor.deleteForward = (unit) => {
    if (editorHasMode(editor, "TrackChanges")) {
      return;
    } else {
      deleteForward(unit);
    }
  };

  return editor;
}
