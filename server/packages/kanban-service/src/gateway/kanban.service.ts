import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { Board } from 'src/models/board.model';
import { List } from 'src/models/list.model';
import { Task } from 'src/models/task.model';

type socketClient = {
  client: Socket;
};

@Injectable()
export class KanbanService {
  public socket: Server = null;

  constructor(
    @InjectModel(List)
    private readonly listModel: ReturnModelType<typeof List>,
    @InjectModel(Board)
    private readonly boardModel: ReturnModelType<typeof Board>,
    @InjectModel(Task)
    private readonly taskModel: ReturnModelType<typeof Task>,
  ) {}
}
