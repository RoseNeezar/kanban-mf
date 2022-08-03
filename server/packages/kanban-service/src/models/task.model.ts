import { modelOptions, prop, Ref } from '@typegoose/typegoose';
import { List } from './list.model';

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class Task {
  @prop({ required: [true, 'missing title!'] })
  title: string;

  @prop()
  descriptions: string;

  @prop({
    ref: 'List',
    index: true,
  })
  list: Ref<List>;
}
