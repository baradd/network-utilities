import { Repository } from 'typeorm';
import { BaseRepository } from 'src/common/crud/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TelegramProfile } from '../entities/telegram-profile.entity';

@Injectable()
export class TelegramRepository extends BaseRepository<TelegramProfile> {
  constructor(
    @InjectRepository(TelegramProfile)
    repository: Repository<TelegramProfile>,
  ) {
    super(repository);
  }
}
