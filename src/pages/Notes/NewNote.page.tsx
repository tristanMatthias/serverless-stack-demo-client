import React from 'react';
import './NewNote.page.css';
import { NoteForm } from './Note.form';


export const NewNote: React.FC = () =>
  <div className="NewNote">
    <NoteForm />
  </div>;
