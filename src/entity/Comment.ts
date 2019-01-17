import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { Photo } from './Photo';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column()
  userId: number = 0;

  @Column()
  photoId: number = 0;

  @Column('timestamp')
  timestamp: Date = new Date();

  @Column('text')
  comment: string = '';
}
