import { PartialType } from '@nestjs/mapped-types';
import { CreateNoteDto } from './create-note.dto';

export class UpdateNoteDto extends PartialType(CreateNoteDto) {
  title: string;
  file: string;
  line: string;
  description: string;
  status: string;
  important: boolean;
}
