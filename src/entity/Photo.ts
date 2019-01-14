import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column()
  userId: number = 0;

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
}
