import {UserEntity} from "./entity";

export interface UserRepository {
  save(entity: UserEntity): Promise<void>;
  getOne(id: string): Promise<UserEntity | null>;
  getAll(): Promise<UserEntity[]>;
  // getSome(): Promise<Entity[]>
}
