import { BaseEntity } from 'src/common/crud/base.entity';
import { TelegramProfile } from 'src/modules/telegram/entities/telegram-profile.entity';
import { UptimeMonitor } from 'src/modules/uptime-monitor/entities/uptime-monitor.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ unique: true, nullable: true })
  username?: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToOne(() => TelegramProfile, (profile) => profile.user, { cascade: true })
  telegram?: TelegramProfile;

  @OneToMany(() => UptimeMonitor, (uptimeMonitor) => uptimeMonitor.user)
  upTimeMonitors?: UptimeMonitor[];
}
