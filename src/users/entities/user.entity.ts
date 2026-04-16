import { BeforeInsert, Column, Entity } from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { CoreEntity } from '@/common/entities';
import { ValidRoles } from '../enums';

@Entity('users')
export class User extends CoreEntity {
  @Column('text', { unique: true })
  email!: string;

  @Column('text')
  @Exclude()
  password!: string;

  @Column('text')
  fullName!: string;

  @Column({
    type: 'enum',
    enum: ValidRoles,
    array: true,
    default: [ValidRoles.USER],
  })
  roles!: ValidRoles[];

  @Column('boolean', { default: true })
  isActive!: boolean;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      const saltOrRounds = 10;
      this.password = await bcrypt.hash(this.password, saltOrRounds);
    }
  }
}
