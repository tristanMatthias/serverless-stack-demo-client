import { API, Storage } from 'aws-amplify';
import React, { ChangeEventHandler, FormEventHandler, MouseEventHandler, useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useHistory, useParams } from 'react-router-dom';
import { LoaderButton } from '../components/LoaderButton';
import config from '../config';
import { s3Upload } from '../libs/awsLib';
import { onError } from '../libs/errorLib';
import './Notes.css';


export interface Note {
  noteId: string;
  content: string,
  // attachment?: File;
  attachment?: string;
  attachmentURL?: string;
  createdAt: Date;
}

export default function Notes() {
  const [file, setFile] = useState<File>();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [note, setNote] = useState<Note>();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    function loadNote() {
      return API.get('notes', `/notes/${id}`, {});
    }

    async function onLoad() {
      try {
        const n = await loadNote();

        if (n.attachment) {
          n.attachmentURL = await Storage.vault.get(n.attachment);
        }

        setContent(n.content);
        setNote(n);
      } catch (e) {
        onError(e);
      }
    }

    onLoad();
  }, [id]);

  const validateForm = () => content.length > 0;

  const formatFilename = (str: string) => str.replace(/^\w+-/, '');

  const handleFileChange: ChangeEventHandler = event => {
    setFile((event.target as HTMLInputElement).files![0]);
  };

  const saveNote = (n: Partial<Note>) => API.put('notes', `/notes/${id}`, {
    body: n
  });

  const handleSubmit: FormEventHandler = async event => {

    event.preventDefault();

    if (file && file.size > config.MAX_ATTACHMENT_SIZE) {
      // eslint-disable-next-line no-alert
      alert(
        `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    setIsLoading(true);

    try {
      const attachment = file ? await s3Upload(file) : note?.attachment;
      await saveNote({ content, attachment });
      history.push('/');

    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  };

  function deleteNote() {
    return API.del('notes', `/notes/${id}`, {});
  }

  const handleDelete: MouseEventHandler = async event => {
    event.preventDefault();

    // eslint-disable-next-line no-alert
    const confirmed = window.confirm(
      'Are you sure you want to delete this note?'
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteNote();
      history.push('/');
    } catch (e) {
      onError(e);
      setIsDeleting(false);
    }
  };

  return (
    <div className="Notes">
      {note && (
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="content">
            <Form.Control
              as="textarea"
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="file">
            <Form.Label>Attachment</Form.Label>
            {note!.attachment && (
              <p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={note!.attachmentURL}
                >
                  {formatFilename(note!.attachment!)}
                </a>
              </p>
            )}
            <Form.Control onChange={handleFileChange} type="file" />
          </Form.Group>
          <LoaderButton
            block
            size="lg"
            type="submit"
            isLoading={isLoading}
            disabled={!validateForm()}
          >
            Save
          </LoaderButton>
          <LoaderButton
            block
            size="lg"
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete
          </LoaderButton>
        </Form>
      )}
    </div>
  );
}
