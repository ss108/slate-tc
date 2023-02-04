import { TrackChangesEditor, EditorMode } from "./types";

export function editorHasMode(editor: TrackChangesEditor, mode: EditorMode): boolean {
    return (editor.modes && editor.modes[mode]) || false;
}