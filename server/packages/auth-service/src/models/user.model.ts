import { modelOptions, prop, pre, DocumentType } from '@typegoose/typegoose';
import * as validator from 'validator';
import * as bcrypt from 'bcryptjs';

@pre<User>('save', async function (this: DocumentType<User>, next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 6);
  next();
})
@modelOptions({
  schemaOptions: {},
})
export class User {
  @prop({
    required: [true, 'Please tell use your name!'],
    unique: true,
  })
  username: string;

  @prop({
    required: [true, 'Please tell use your email!'],
    unique: true,
    lowercase: true,
    index: true,
    validate: {
      validator: validator.default.isEmail,
      message: 'Please provide a valid email',
    },
  })
  email: string;

  @prop({
    required: true,
    unique: true,
  })
  password: string;
}
