import { BaseEntity } from 'src/common/crud/base.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class TelegramProfile extends BaseEntity {
  @Column({ unique: true })
  chatId: number;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  username?: string;

  @Column({ nullable: true })
  languageCode?: string;

  @Column({ nullable: true })
  chatType?: string;

  @Column({ default: false })
  isBot: boolean;

  @OneToOne(() => User, (user) => user.telegram)
  @JoinColumn()
  user: User;
}
