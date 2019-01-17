import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column()
  userId: number = 0;

  @Column()
  photoId: number = 0;

  @Column('datetime')
  datetime: Date = new Date();

  @Column('text')
  comment: string = '';
}
