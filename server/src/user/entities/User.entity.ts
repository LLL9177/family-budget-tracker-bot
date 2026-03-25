import { Roles } from 'src/auth/enums/Roles.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: JSON.stringify([Roles.USER]) })
  roles: string; // json list

  @Column({ nullable: true })
  family?: string;

  @Column({ nullable: true })
  family_owned?: string;

  @Column({ nullable: true })
  googleId?: string;
}
