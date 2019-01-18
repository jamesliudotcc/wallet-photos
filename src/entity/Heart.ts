import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';
import { Photo } from './Photo';

@Entity()
export class Heart {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @ManyToOne(type => User, user => user.hearts, { eager: true })
  user: User;

  @ManyToOne(type => Photo, photo => photo.hearts)
  photo: Photo;

  @Column('timestamp')
  timestamp: Date = new Date();
}
