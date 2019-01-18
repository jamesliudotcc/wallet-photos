import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './User';
import { Comment } from './Comment';
import { Heart } from './Heart';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @ManyToOne(type => User, user => user.photos)
  user: User;

  @Column()
  name: string = '';

  @Column()
  origUrl: string = '';

  @Column()
  smUrl: string = '';

  @Column()
  mdUrl: string = '';

  @Column()
  lgUrl: string = '';

  @Column('timestamp')
  timestamp: Date = new Date();

  @OneToMany(type => Comment, comment => comment.photo, { eager: true })
  comments: Comment[];

  @OneToMany(type => Heart, heart => heart.photo, { eager: true })
  hearts: Heart[];
}
