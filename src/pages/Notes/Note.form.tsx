import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { LoaderButton } from '../../components/ButtonLoader/ButtonLoader';
import { ICreateNote, Note, NotesContainer, schemaNote } from '../../containers/Notes.container';
import { onError } from '../../libs/errorLib';

const formatFilename = (str: string) => str.replace(/^\w+-/, '');


export const NoteForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const history = useHistory();
  const [note, setNote] = useState<Note>();
  const { createNote, updateNote, deleteNote, loadNote } = NotesContainer.useContainer();

  useEffect(() => {
    if (!id || id === 'new') return setLoading(false);
    loadNote(id).then(n => {
      setNote(n);
      setLoading(false);
    });
  }, [id]);


  const { handleSubmit, register, errors } = useForm<{ content: string, attachment: FileList }>({
    resolver: yupResolver(schemaNote)
  });


  const onSubmit = handleSubmit(async fields => {
    setSubmitting(true);

    const upsertNote: ICreateNote = {
      content: fields.content,
      attachment: fields.attachment.length ? fields.attachment[0] : note?.attachment
    };

    try {
      if (!note) {
        const res = await createNote(upsertNote);
        history.push(`/notes/${res.noteId}`);

      } else setNote(await updateNote({ ...upsertNote, noteId: id! }));

    } catch (e) { onError(e); }

    setSubmitting(false);
  });


  const remove = async () => {
    if (!id) return;
    setDeleting(true);
    await deleteNote(id);
    setDeleting(false);
    history.replace('/');
  };

  if (loading) return <Spinner animation="border" />;

  return <Form onSubmit={onSubmit}>

    <Form.Group controlId="content">
      <Form.Control name="content" as="textarea" ref={register} defaultValue={note?.content} />
    </Form.Group>

    <Form.Group controlId="file">
      <Form.Label>Attachment</Form.Label>

      {note?.attachment && <p>
        <a target="_blank" rel="noopener noreferrer" href={note!.attachmentURL}>
          {formatFilename(note.attachment)}
        </a>
      </p>
      }

      <Form.Control
        name="attachment"
        type="file"
        ref={register}
        isInvalid={Boolean(errors.attachment)}
      />
      <Form.Control.Feedback type="invalid">{(errors.attachment as unknown as Error)?.message}</Form.Control.Feedback>
    </Form.Group>

    <LoaderButton
      block
      type="submit"
      size="lg"
      variant="primary"
      isLoading={submitting}
    > {note ? 'Save' : 'Create'} </LoaderButton>

    {note && <LoaderButton
      block
      size="lg"
      variant="danger"
      isLoading={deleting}
      onClick={remove}
    > Delete </LoaderButton>}

  </Form>;
};
