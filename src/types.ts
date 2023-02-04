import { BaseEditor, Descendant, BaseText } from "slate";
import { ReactEditor, RenderElementProps, RenderLeafProps } from "slate-react";

export enum TRACK_CHANGES_OPERATION {
    TEXT_ADDED = 0,
    TEXT_DELETED = 1,
    RESTYLED = 2,
};

export type TrackChangesInfo = {
    operation: TRACK_CHANGES_OPERATION;
    changes?: any[]; //arbitrary information describing changes, meant for the consuming codebase to take action upon
};

export type EditorMode = "TrackChanges"; //should this concept be kept, or just made a normal boolean field of TrackChangesEditor?
export type Modes = { [key in EditorMode]?: boolean };

export type TrackChangesEditor = BaseEditor &
    ReactEditor & {
        modes: Modes;
    };

export type TrackChangesText = BaseText & {
    trackChanges?: TrackChangesInfo;
}
