import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { readFile, writeFile } from 'fs';
import { Note } from './entities/note.entity';

const notesPath = 'assets/notes.json';

@Injectable()
export class NoteService {
  notes: Note[];

  constructor() {
    this.readNotes().then((data) => {
      this.notes = data;
    });
  }

  create = async (createNoteDto: CreateNoteDto) => {
    const id = this.notes.length;
    const note = {
      id: id,
      ...createNoteDto,
      important: false,
      time: new Date().toISOString(),
    };
    this.notes.push(note);
    try {
      await this.reorderNotes();
      await this.writerNotes(this.notes);
      await this.readNotes();
    } catch (e: any) {
      throw new InternalServerErrorException(e);
    }
    return id;
  };

  findAll = async () => {
    this.notes = await this.readNotes();
    return this.notes;
  };

  findOne = async (id: number) => {
    const result = this.notes.find((n) => n.id == id);
    if (!result) {
      throw new NotFoundException('Sorry, could not find that note, mate.');
    }
    return result;
  };

  update = async (id: number, updateNoteDto: UpdateNoteDto) => {
    const oldNote = this.notes.find((n) => n.id == id);
    const note = {
      id: id,
      ...updateNoteDto,
      important: oldNote.important,
      time: new Date().toISOString(),
    };
    try {
      this.notes.splice(this.notes.indexOf(oldNote), 1, note);
      await this.writerNotes(this.notes);
      await this.readNotes();
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
    return id;
  };

  remove = async (id: number) => {
    const target = this.notes.find((n) => n.id == id);
    if (target) {
      this.notes.splice(this.notes.indexOf(target), 1);
      await this.writerNotes(this.notes);
      await this.reorderNotes();
      return 1;
    } else throw new InternalServerErrorException();
  };

  readNotes = async () => {
    console.log('Reading notes...');
    return new Promise<Note[]>((resolve, reject) => {
      readFile(notesPath, 'utf8', (error, data: any) => {
        if (error) {
          console.error(error);
          reject(error);
        } else if (data) {
          resolve(JSON.parse(data));
        }
      });
    });
  };

  writerNotes = async (notes: Note[]) => {
    console.log('Writing notes...');
    return new Promise((resolve, reject) => {
      writeFile(notesPath, JSON.stringify(notes), (error) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          resolve(true);
        }
      });
    });
  };

  reorderNotes = async () => {
    console.log('Re-ordering notes...');
    const notes = (await this.readNotes()) as Note[];
    notes.forEach((n, i) => {
      n.id = i;
    });
    await this.writerNotes(notes);
  };
}
