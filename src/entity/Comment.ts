import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { Photo } from './Photo';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @ManyToOne(type => User, user => user.comments, { eager: true })
  user: User;

  @ManyToOne(type => Photo, photo => photo.comments)
  photo: Photo;

  @Column('timestamp')
  timestamp: Date = new Date();

  @Column('text')
  comment: string = '';
}
