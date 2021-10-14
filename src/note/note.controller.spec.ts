/* eslint-disable @typescript-eslint/no-empty-function */
import { Test, TestingModule } from '@nestjs/testing';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
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
        update: jest.fn(() => {}),
        remove: jest.fn(() => {}),
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

  it('should should call the create function', () => {
    const dto = new CreateNoteDto();
    expect(controller.create(dto)).not.toEqual(null);
  });

  it('should call the create function with the desired parameters', () => {
    const dto = new CreateNoteDto();
    controller.create(dto);
    expect(service.create).toHaveBeenCalled();
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should retrieve all notes', () => {
    controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should call the getter by ID', () => {
    const id = '0';
    controller.findOne(id);
    expect(service.findOne).toHaveBeenCalled();
    expect(service.findOne).toHaveBeenCalledWith(+id);
  });

  it('should call the update function', () => {
    const id = '1';
    const dto = new UpdateNoteDto();
    expect(service.update(+id, dto)).not.toEqual(null);
  });

  it('should call the update function with the desired parameters', () => {
    const id = '1';
    const dto = new UpdateNoteDto();
    service.update(+id, dto);
    expect(service.update).toHaveBeenCalled();
    expect(service.update).toHaveBeenCalledWith(+id, dto);
  });
});
