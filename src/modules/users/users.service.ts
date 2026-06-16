import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { BaseService } from 'src/common/crud/base.service';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(private readonly usersRepo: UsersRepository) {
    super(usersRepo);
  }
}
