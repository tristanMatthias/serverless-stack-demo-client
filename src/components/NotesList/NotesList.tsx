import React, { useEffect } from 'react';
import { ListGroup, Spinner } from 'react-bootstrap';
import { BsPencilSquare } from 'react-icons/bs';
import { LinkContainer } from 'react-router-bootstrap';
import { NotesContainer } from '../../containers/Notes.container';

export const NotesList: React.FC = () => {
  const { load, loading, notes } = NotesContainer.useContainer();

  useEffect(() => { load(); }, []);

  return <div className="notes">
    <h2 className="pb-3 mt-4 mb-3 border-bottom">Your Notes</h2>

    {loading
      ? <Spinner animation="border" role="status" />

      : <ListGroup>
        <LinkContainer to="/notes/new">
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsPencilSquare size={17} />
            <span className="ml-2 font-weight-bold">Create a new note</span>
          </ListGroup.Item>
        </LinkContainer>

        {notes.map(({ noteId, content, createdAt }) =>
          <LinkContainer key={noteId} to={`/notes/${noteId}`}>
            <ListGroup.Item action>
              <span className="font-weight-bold">
                {content.trim().split('\n')[0]}
              </span>
              <br />
              <span className="text-muted">
                Created: {new Date(createdAt).toLocaleString()}
              </span>
            </ListGroup.Item>
          </LinkContainer>)}
      </ListGroup>
    }
  </div>;
};
