import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('longblob')
  file: Buffer;

  @Column()
  accessToken: string;

  @Column()
  qrCode: string;

  @Column()
  fileName: string;
}
