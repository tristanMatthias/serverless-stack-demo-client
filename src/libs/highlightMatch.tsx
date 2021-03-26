import Fuse from 'fuse.js';
import React from 'react';
import { Note } from '../containers/Notes.container';

/**
 * Get a highlighted JSX result from a search result
 * @param result Fuse result to extract highlight matches from
 * @param replace Potential replace string
 * @returns Array of JSX spans
 */
export const highlightMatch = (result: Fuse.FuseResult<Note>, replace?: string) => {
  const content: JSX.Element[] = [];

  let i = 0;
  result.matches?.forEach(match => {
    match.indices.forEach(([start, end]) => {
      const className = replace ? 'text-danger strike' : 'text-primary';
      const before = result.item.content.slice(i, start);
      const highlight = result.item.content.slice(start, end + 1);
      if (before) content.push(<span className="text-muted">{before}</span>);
      if (highlight) content.push(<span className={className}>{highlight}</span>);
      if (replace) content.push(<span className="text-primary">{replace}</span>);
      i = end + 1;
    });
  });

  const last = result.item.content.slice(i);
  if (last) content.push(<span className="text-muted">{last}</span>);

  return content;
};
