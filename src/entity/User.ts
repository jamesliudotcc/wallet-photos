import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
