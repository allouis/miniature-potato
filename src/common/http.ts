import { FastifyInstance } from "fastify";
import { container, injectable } from "tsyringe";

const controllers: any[] = [];

export function controller() {
  return function (target: any) {
    injectable()(target);
    controllers.push(target);
  };
}

const routes: { path: string; method: string; target: any }[] = [];

export function get(path: string) {
  return function (target: any, method: any) {
    routes.push({
      path,
      method,
      target: target.constructor,
    });
  };
}

export function registerRoutes(app: FastifyInstance) {
  for (const route of routes) {
    app.route({
      method: "GET",
      url: route.path,
      handler(request, reply) {
        const svc = container.resolve(route.target);
        (svc as any)[route.method](request, reply);
      },
    });
  }
}
