import React, {useCallback, useMemo} from "react";
import isHotkey from "is-hotkey";
import { Editable, withReact, useSlate, Slate } from "slate-react";
import {Editor, createEditor, Element as SlateElement} from "slate";

import {withTrackChanges} from "../src/withTrackChanges";
import { withHistory } from "slate-history";

export default TrackChangesExample = () => {
    const editor = useMemo(() => withTrackChanges(withHistory(withReact(createEditor()))), []);

    return (
        <Slate editor={editor}>
            <Editable placeholder="hi" autoFocus={true} />
        </Slate>
    )
}