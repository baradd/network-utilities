// core/database/repositories/base.repository.ts
import { Repository, DeepPartial, FindOptionsWhere } from 'typeorm';
import { BaseEntity } from './base.entity';

export abstract class BaseRepository<T extends BaseEntity> {
  constructor(protected readonly repo: Repository<T>) {}

  findAll(): Promise<T[]> {
    return this.repo.find();
  }

  findOneById(id: number): Promise<T | null> {
    return this.repo.findOneBy({ id } as FindOptionsWhere<T>);
  }

  findBy(where: FindOptionsWhere<T>): Promise<T[]> {
    return this.repo.findBy(where);
  }

  findOneBy(where: FindOptionsWhere<T>): Promise<T | null> {
    return this.repo.findOneBy(where);
  }

  create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: DeepPartial<T>): Promise<T | null> {
    await this.repo.update(id, data as any);
    return this.findOneById(id);
  }

  async upsert(where: FindOptionsWhere<T>, data: DeepPartial<T>): Promise<T> {
    const existing = await this.repo.findOneBy(where);
    if (existing) {
      Object.assign(existing, data);
      return this.repo.save(existing);
    }
    return this.create(data);
  }

  softDelete(id: number): Promise<void> {
    return this.repo.softDelete(id).then();
  }

  hardDelete(id: number): Promise<void> {
    return this.repo.delete(id).then();
  }

  count(where?: FindOptionsWhere<T>): Promise<number> {
    return this.repo.count({ where });
  }
}
