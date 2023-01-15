import {Editor} from "slate";
import {TrackChangesEditor} from "types";

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
}
