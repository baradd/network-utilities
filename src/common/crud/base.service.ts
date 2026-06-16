// core/database/services/base.service.ts
import { NotFoundException } from '@nestjs/common';
import { DeepPartial, FindOptionsRelations, FindOptionsWhere } from 'typeorm';
import { BaseRepository } from './base.repository';
import { BaseEntity } from './base.entity';

export abstract class BaseService<T extends BaseEntity> {
  constructor(protected readonly repository: BaseRepository<T>) {}

  findAll(): Promise<T[]> {
    return this.repository.findAll();
  }

  async findOne(id: number): Promise<T> {
    const entity = await this.repository.findOneById(id);
    if (!entity) throw new NotFoundException(`Entity with id ${id} not found`);
    return entity;
  }

  findBy(where: FindOptionsWhere<T>): Promise<T[]> {
    return this.repository.findBy(where);
  }

  findOneBy(where: FindOptionsWhere<T>): Promise<T | null> {
    return this.repository.findOneBy(where);
  }

  create(data: DeepPartial<T>): Promise<T> {
    return this.repository.create(data);
  }

  update(id: number, data: DeepPartial<T>): Promise<T | null> {
    return this.repository.update(id, data);
  }

  upsert(where: FindOptionsWhere<T>, data: DeepPartial<T>): Promise<T> {
    return this.repository.upsert(where, data);
  }

  upsertNested(
    where: FindOptionsWhere<T>,
    data: DeepPartial<T>,
    relations?: FindOptionsRelations<T>,
  ): Promise<T> {
    return this.repository.upsertNested(where, data, relations);
  }

  softDelete(id: number): Promise<void> {
    return this.repository.softDelete(id);
  }

  hardDelete(id: number): Promise<void> {
    return this.repository.hardDelete(id);
  }

  count(where?: FindOptionsWhere<T>): Promise<number> {
    return this.repository.count(where);
  }
}
