import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { Board } from 'src/models/board.model';
import { Task } from 'src/models/task.model';
import { List } from 'src/models/list.model';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { KanbanService } from 'src/gateway/kanban.service';

@Module({
  imports: [TypegooseModule.forFeature([List, Board, Task])],
  controllers: [ListController],
  providers: [ListService, KanbanService],
})
export class ListModule {}
