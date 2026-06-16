import { Repository } from 'typeorm';
import { BaseRepository } from 'src/common/crud/base.repository';
import { User } from '../entities/user.entity';

export class UsersRepository extends BaseRepository<User> {
  constructor(repository: Repository<User>) {
    super(repository);
  }
}
