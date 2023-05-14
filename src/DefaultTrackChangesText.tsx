import React, {LegacyRef, useState} from "react";
import {Editor, Transforms, Node, Path, Element} from "slate";
import {ReactEditor, useSlateStatic} from "slate-react";

import {TrackChangesInfo, TRACK_CHANGES_OPERATION} from "./types";

type StylingFunction = (info: TrackChangesInfo) => React.CSSProperties;

interface ChangedTextProps {
  children: React.ReactNode;
  info: TrackChangesInfo;
  stylingFn?: StylingFunction;
}

const DefaultTrackChangesText = React.forwardRef(
  (
    {children, info, stylingFn}: ChangedTextProps,
    ref: LegacyRef<HTMLElement> | undefined
  ) => {
    let styling: React.CSSProperties;

    if (stylingFn) {
      styling = stylingFn(info);
    } else {
      styling = {
        color: "red",
        textDecorationLine:
          info.operation === TRACK_CHANGES_OPERATION.TEXT_DELETED
            ? "line-through"
            : "overline",
      };
    }

    return (
      <span style={styling} ref={ref}>
        {children}
      </span>
    );
  }
);

DefaultTrackChangesText.displayName = "ChangedText";
