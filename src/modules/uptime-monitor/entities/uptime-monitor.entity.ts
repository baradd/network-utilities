import { UptimeStatus } from 'src/common/consts/uptime-status.enum';
import { BaseEntity } from 'src/common/crud/base.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class UptimeMonitor extends BaseEntity {
  @Column()
  name: string;

  @Column()
  url: string;

  @Column({ default: 5 })
  intervalMinutes: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'text', default: UptimeStatus.UNKNOWN })
  lastStatus: UptimeStatus;

  @Column({ nullable: true })
  lastResponseTime?: number;

  @Column({ nullable: true })
  lastStatusCode?: number;

  @Column({ nullable: true })
  lastCheckedAt?: Date;

  @Column({ default: 0 })
  consecutiveFailures: number;

  @ManyToOne(() => User, (user) => user.upTimeMonitors)
  @JoinColumn()
  user: User;
}
