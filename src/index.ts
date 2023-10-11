import 'reflect-metadata';
import fastify, {FastifyReply, FastifyRequest} from "fastify";
import { inject, injectable, container } from "tsyringe";

/* Decorators */

const controllers: any[] = [];

function controller() {
  return function (target: any) {
    injectable()(target);
    controllers.push(target);
  };
}

const routes: { path: string; method: string; target: any }[] = [];

function get(path: string) {
  return function (target: any, method: any) {
    routes.push({
      path,
      method,
      target: target.constructor,
    });
  };
}

/* App */

class Entity {
    constructor(public readonly id: string, public name: string) {}
}

interface Repository {
    save(entity: Entity): Promise<void>
    getOne(id: string): Promise<Entity | null>
    getAll(): Promise<Entity[]>
    // getSome(): Promise<Entity[]>
}

@injectable()
class RepositoryImpl implements Repository {
    store: Map<string, Entity> = new Map()
    constructor() {
        const alice = new Entity('1', 'alice');
        const bob = new Entity('2', 'bob');
        this.save(alice);
        this.save(bob);
    }
    async save(entity: Entity) {
        this.store.set(entity.id, entity);
    }
    async getOne(id: string) {
        return this.store.get(id) || null;
    }
    async getAll() {
        return [...this.store.values()];
    }
}

type DTO = {
    id: string;
    name: string;
}

@injectable()
class Service {
    constructor(@inject('Repository') private readonly repository: Repository) {}

    async getAll(): Promise<DTO[]> {
        const entities = await this.repository.getAll(); 
        return entities.map(entity => ({
            id: entity.id,
            name: entity.name
        }));
    }

    async getOne(id: string): Promise<DTO> {
        const entity = await this.repository.getOne(id); 
        if (!entity) {
            throw new Error('Not Found');
        }
        return {
            id: entity.id,
            name: entity.name
        };
    }
}


@controller()
class Controller {
    constructor(public service: Service) {}

    @get('/:id')
    async read(request: FastifyRequest, reply: FastifyReply) {
        try {
            const result = await this.service.getOne((request.params as any).id);
            reply.code(200);
            reply.send({
                entities: [result]
            });
        } catch (err) {
            reply.code(500);
            reply.send({
                error: err 
            });
        }
    }

    @get('/')
    async browse(request: FastifyRequest, reply: FastifyReply) {
        try {
            const result = await this.service.getAll();
            reply.code(200);
            reply.send({
                entities: result
            });
        } catch (err) {
            reply.code(500);
            reply.send({
                error: err 
            });
        }
    }
}

/** Framework */

const app = fastify();

container.register('Repository', {
    useClass: RepositoryImpl
})

for (const route of routes) {
    app.route({
        method: 'GET',
        url: route.path,
        handler(request, reply) {
            const svc = container.resolve(route.target);
            (svc as any)[route.method](request, reply);
        }
    })
}

app.listen({
  port: 3001,
});