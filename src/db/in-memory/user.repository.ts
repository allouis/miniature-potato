import {injectable} from "tsyringe";
import {UserEntity} from "../../ghost/user/entity";
import {UserRepository} from "../../ghost/user/repository";

@injectable()
export class UserRepositoryImpl implements UserRepository {
  store: Map<string, UserEntity> = new Map();
  constructor() {
    const alice = new UserEntity("1", "alice");
    const bob = new UserEntity("2", "bob");
    this.save(alice);
    this.save(bob);
  }
  async save(entity: UserEntity) {
    this.store.set(entity.id, entity);
  }
  async getOne(id: string) {
    return this.store.get(id) || null;
  }
  async getAll() {
    return [...this.store.values()];
  }
}
