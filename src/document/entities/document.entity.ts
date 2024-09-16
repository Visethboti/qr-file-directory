import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Document {
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
