import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { Board } from 'src/models/board.model';
import { Task } from 'src/models/task.model';
import { List } from 'src/models/list.model';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';

@Module({
  imports: [TypegooseModule.forFeature([Board, List, Task])],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
