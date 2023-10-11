import 'reflect-metadata';
import fastify from "fastify";
import { container } from "tsyringe";

import {UserRepositoryImpl} from './db/in-memory/user.repository';
import {registerRoutes} from './common/http';

const app = fastify();

container.register('Repository', {
    useClass: UserRepositoryImpl
});

/** We need to import the UserController so that the app knows about its routes */
import { UserController } from './http/controllers/user.controller';
container.register(UserController, {
    useClass: UserController
});

registerRoutes(app);

app.listen({
  port: 3001,
});