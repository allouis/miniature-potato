import 'reflect-metadata';
import fastify from "fastify";
import { container, delay } from "tsyringe";
import { register } from './common/register';
import path from 'path';
import {handler} from './common/handler';

const app = fastify();

register('Repository', path.resolve(__dirname, './db/in-memory/user.repository'));
register('UserService', path.resolve(__dirname, './ghost/user/service'));
register('UserController', path.resolve(__dirname, './http/controllers/user.controller'));

app.route({
  method: "GET",
  url: "/:id",
  handler: handler('UserController.read')
});

app.route({
  method: "GET",
  url: "/",
  handler: handler('UserController.browse')
});

app.listen({
  port: 3001,
});