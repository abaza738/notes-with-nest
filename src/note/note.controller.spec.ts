/* eslint-disable @typescript-eslint/no-empty-function */
import { Test, TestingModule } from '@nestjs/testing';
import { CreateNoteDto } from './dto/create-note.dto';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';

describe('NoteController', () => {
  let controller: NoteController;
  let service: NoteService;

  beforeEach(async () => {
    const ApiServiceProvider = {
      provide: NoteService,
      useFactory: () => ({
        create: jest.fn(() => []),
        findAll: jest.fn(() => []),
        findOne: jest.fn(() => {}),
        updateNote: jest.fn(() => {}),
        deleteNote: jest.fn(() => {}),
      }),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoteController],
      providers: [NoteService, ApiServiceProvider],
    }).compile();

    controller = module.get<NoteController>(NoteController);
    service = module.get<NoteService>(NoteService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new note', () => {
    const dto = new CreateNoteDto();
    expect(controller.create(dto)).not.toEqual(null);
  });

  it('should create a new note', () => {
    const dto = new CreateNoteDto();
    controller.create(dto);
    expect(service.create).toHaveBeenCalled();
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should retrieve all notes', () => {
    controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });
});
