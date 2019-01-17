import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './User';

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
}
