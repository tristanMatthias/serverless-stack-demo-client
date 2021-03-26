import API from '@aws-amplify/api';
import { Storage } from 'aws-amplify';
import Fuse from 'fuse.js';
import { useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';
import * as yup from 'yup';
import config from '../config';
import { s3Upload } from '../libs/awsLib';
import { onError } from '../libs/errorLib';


export interface Note {
  noteId: string;
  content: string,
  // attachment?: File;
  attachment?: string;
  attachmentURL?: string;
  createdAt: Date;
}

export interface ICreateNote {
  content: string;
  attachment?: File | string;
}

export interface IUpdateNote extends ICreateNote {
  noteId: string;
}


export const schemaNote = yup.object().shape({
  content: yup.string().required(),
  attachment: yup.mixed()
    .test('fileSize', 'The file is too large', value => {
      if (!value || !value.length) return true;
      return value[0].size < config.MAX_ATTACHMENT_SIZE;
    })
});


export const NotesContainer = createContainer(() => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [fuse, setFuse] = useState<Fuse<Note>>();


  const FUSE_OPTIONS = { keys: ['content'], includeMatches: true, threshold: 0 };
  useEffect(() => {
    setFuse(new Fuse(notes, FUSE_OPTIONS));
  }, [notes]);


  const load = async (bustCache = false) => {

    if (notes.length > 1 && !bustCache) return;
    setLoading(true);

    try {
      setNotes(await API.get('notes', '/notes', {}));
    } catch (e) {
      setError(e);
      onError(e);
    }
    setLoading(false);
  };


  const uploadAttachment = async (n: ICreateNote) => {
    let attachment;

    if (typeof n.attachment === 'string') attachment = n.attachment;
    else attachment = n.attachment ? await s3Upload(n.attachment) : undefined;

    return attachment;
  };


  const createNote = async (note: ICreateNote) => {

    const attachment = await uploadAttachment(note);
    const response = await API.post('notes', '/notes', {
      body: { content: note.content, attachment }
    }) as Note;

    if (attachment) {
      response.attachmentURL = await Storage.vault.get(attachment) as string;
    }

    setNotes(n => [...n, response]);
    return response;
  };


  const upsertNoteInStore = (note: Note) => {
    // Upsert new note into notes
    setNotes(_notes => {
      const newNotes = _notes;
      const existing = _notes.findIndex(_n => _n.noteId === note.noteId);
      if (existing >= 0) newNotes[existing] = { ...newNotes[existing], ...note } as Note;
      else newNotes.push(note);
      return newNotes;
    });
  };


  const loadNote = async (id: string, forceLoad = false) => {
    const index = notes.findIndex(n => n.noteId === id);
    let note: Note;

    if (index < 0 || forceLoad) {
      note = await API.get('notes', `/notes/${id}`, {});
      if (!note) throw new Error('Could not find note');

      upsertNoteInStore(note);
    } else note = notes[index];

    if (note.attachment && !note.attachmentURL) {
      note.attachmentURL = await Storage.vault.get(note.attachment) as string;
    }

    return note;
  };


  const updateNote = async (note: IUpdateNote) => {
    const attachment = await uploadAttachment(note);
    await API.put('notes', `/notes/${note.noteId!}`, {
      body: { content: note.content, attachment }
    });
    // Refetch the note data because amplify does not return data
    return loadNote(note.noteId!, true);
  };


  const deleteNote = async (noteId: string) => {
    await API.del('notes', `/notes/${noteId}`, {});
    setNotes(n => n.filter(_n => _n.noteId !== noteId));
  };


  const searchNotes = (term: string) => fuse?.search(term) ?? [];


  const replaceInNotes = async (search: string, replace: string) => {
    const toReplace = searchNotes(search).map(r => r.item);

    await Promise.all(toReplace
      .map(async n => {
        const r = new RegExp(search, 'gi');
        await updateNote({ ...n, content: n.content.replace(r, replace) });
      }));

    setFuse(new Fuse(notes, FUSE_OPTIONS));
  };


  return {
    notes,
    error,
    load,
    loading,
    loadNote,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
    replaceInNotes
  };
});
