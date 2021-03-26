import Fuse from 'fuse.js';
import React, { ChangeEventHandler, useEffect, useMemo, useState } from 'react';
import { Button, Col, Container, Form, ListGroup, Row, Spinner } from 'react-bootstrap';
import { BsArrowLeftRight, BsPencilSquare, BsX } from 'react-icons/bs';
import { LinkContainer } from 'react-router-bootstrap';
import { Note, NotesContainer } from '../../containers/Notes.container';
import { highlightMatch } from '../../libs/highlightMatch';
import { LoaderButton } from '../ButtonLoader/ButtonLoader';
import './NotesList.scss';


export const NotesList: React.FC = () => {
  const { load, loading, notes: allNotes, searchNotes, replaceInNotes } = NotesContainer.useContainer();
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [notes, setNotes] = useState<(Note | Fuse.FuseResult<Note>)[]>([]);
  const [replacing, setReplacing] = useState(false);
  const [replaceLoading, setReplaceLoading] = useState(false);

  useEffect(() => { load(); }, []);

  useMemo(() => {
    if (searchTerm) setNotes(searchNotes(searchTerm));
    else setNotes(allNotes);
  }, [searchTerm, allNotes]);

  const onSearch: ChangeEventHandler<HTMLInputElement> = e =>
    setSearchTerm(e.currentTarget.value);

  const onReplace: ChangeEventHandler<HTMLInputElement> = e =>
    setReplaceTerm(e.currentTarget.value);

  const replace = async () => {
    setReplaceLoading(true);
    await replaceInNotes(searchTerm, replaceTerm);
    setReplaceTerm('');
    setSearchTerm('');
    setReplacing(false);
    searchNotes(searchTerm);
    setReplaceLoading(false);
  };


  const notesList = useMemo(
    () => notes.map(resultOrNote => {
      let note: Note;
      let content: JSX.Element[] = [];

      if ((resultOrNote as Fuse.FuseResult<Note>).item) {
        const r = resultOrNote as Fuse.FuseResult<Note>;
        note = r.item;
        content = highlightMatch(r, searchTerm, replacing ? replaceTerm : undefined);
      } else {
        note = resultOrNote as Note;
        content = [<span>{note.content}</span>];
      }


      const { noteId, createdAt } = note;

      return <LinkContainer key={noteId} to={`/notes/${noteId}`}>
        <ListGroup.Item action>
          <span className="font-weight-bold">
            {content}
          </span>
          <br />
          <span className="text-muted">
          Created: {new Date(createdAt).toLocaleString()}
          </span>
        </ListGroup.Item>
      </LinkContainer>;
    }),
    [notes, replaceTerm, searchTerm]
  );

  return <div className="notes">
    <Container className="pb-3 mt-4 mb-3 border-bottom">
      <Row className="align-items-center">
        <Col>
          <h2>Your Notes</h2>
        </Col>

        <Col className="search-replace">
          <Form.Control type="text" placeholder="Search…" onChange={onSearch} className="bg-light border-0" />
          <Button onClick={() => setReplacing(!replacing)} variant={replacing ? 'dark' : 'primary'}>
            {replacing ? <BsX /> : <BsArrowLeftRight />}
          </Button>

          {replacing && <>
            <Form.Control
              type="text"
              placeholder="Replace with…"
              onChange={onReplace}
              className="bg-light border-0"
            />
            <LoaderButton onClick={replace} isLoading={replaceLoading} >
              {!replaceLoading && <BsArrowLeftRight />}
            </LoaderButton>
          </>}

        </Col>
      </Row>
    </Container>


    {loading
      ? <Spinner animation="border" role="status" />

      : <ListGroup>
        {!searchTerm && <LinkContainer to="/notes/new">
          <ListGroup.Item action className="py-3 text-nowrap text-truncate">
            <BsPencilSquare size={17} />
            <span className="ml-2 font-weight-bold">Create a new note</span>
          </ListGroup.Item>
        </LinkContainer>}

        {notesList.length
          ? notesList
          : <ListGroup.Item className="text-muted text-center"> No notes found </ListGroup.Item>
        }
      </ListGroup>
    }
  </div>;
};
