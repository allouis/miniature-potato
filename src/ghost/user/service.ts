console.log('Loaded UserService from disk');
import {inject, injectable} from "tsyringe";
import {UserRepository} from "./repository";

@injectable()
export default class UserService {
  constructor(@inject("Repository") private readonly repository: UserRepository) {}

  async getAll(): Promise<DTO[]> {
    const entities = await this.repository.getAll();
    return entities.map((entity) => ({
      id: entity.id,
      name: entity.name,
    }));
  }

  async getOne(id: string): Promise<DTO> {
    const entity = await this.repository.getOne(id);
    if (!entity) {
      throw new Error("Not Found");
    }
    return {
      id: entity.id,
      name: entity.name,
    };
  }
}

export type DTO = {
  id: string;
  name: string;
};