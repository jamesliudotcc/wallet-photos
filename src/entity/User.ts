import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Photo } from './Photo';
import { Comment } from './Comment';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column()
  name: string = '';

  @Column()
  email: string = '';

  @Column()
  password: string = '';

  @Column()
  admin: boolean = false;

  @Column()
  contrib: boolean = false;

  @Column()
  family: boolean = false;

  @Column()
  approved: boolean = false;

  @Column()
  getEmails: boolean = false;

  @OneToMany(type => Photo, photo => photo.user)
  photos: Photo[];

  @OneToMany(type => Comment, comment => comment.user)
  comments: Comment[];

  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 12);
  }

  async validPassword(plainTextPassword: string) {
    return await bcrypt.compare(plainTextPassword, this.password + '');
  }
}
