import { API } from 'aws-amplify';
import React, { ChangeEventHandler, FormEventHandler, useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useHistory } from 'react-router-dom';
import { LoaderButton } from '../components/LoaderButton';
import config from '../config';
import { s3Upload } from '../libs/awsLib';
import { onError } from '../libs/errorLib';
import './NewNote.css';
import { Note } from './Notes';


export const NewNote: React.FC = () => {
  const [file, setFile] = useState<File>();
  const history = useHistory();
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => content.length > 0;

  const handleFileChange: ChangeEventHandler = event => {
    setFile((event.target as HTMLInputElement).files![0]);
  };


  const createNote = (note: Partial<Note>) =>
    API.post('notes', '/notes', {
      body: note
    });


  const handleSubmit: FormEventHandler = async event => {
    event.preventDefault();

    if (file && file.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    setIsLoading(true);

    try {
      const attachment = file ? await s3Upload(file) : undefined;
      await createNote({ content, attachment });
      history.push('/');

    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  };

  return (
    <div className="NewNote">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="content">
          <Form.Control
            value={content}
            as="textarea"
            onChange={e => setContent(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="file">
          <Form.Label>Attachment</Form.Label>
          <Form.Control onChange={handleFileChange} type="file" />
        </Form.Group>
        <LoaderButton
          block
          type="submit"
          size="lg"
          variant="primary"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Create
        </LoaderButton>
      </Form>
    </div>
  );
};
