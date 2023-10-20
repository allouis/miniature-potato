import {FastifyReply, FastifyRequest} from "fastify";
import {container} from "tsyringe";

export function handler(name: string) {
  const [Controller, method] = name.split(".");
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const controller = container.resolve(Controller) as any;
    await controller[method](request, reply);
  };
}