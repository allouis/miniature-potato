console.log('Loaded UserController from disk');
import {FastifyReply, FastifyRequest} from "fastify";
import UserService from "../../ghost/user/service";
import {inject, injectable} from "tsyringe";

@injectable()
export default class UserController {
  constructor(public service: UserService) {}

  async read(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await this.service.getOne((request.params as any).id);
      reply.code(200);
      return reply.send({
        entities: [result],
      });
    } catch (err) {
      console.log(err);
      reply.code(500);
      return reply.send({
        error: err,
      });
    }
  }

  async browse(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await this.service.getAll();
      console.log(result);
      reply.code(200);
      return reply.send({
        entities: result,
      });
    } catch (err) {
      console.log(err);
      reply.code(500);
      return reply.send({
        error: err,
      });
    }
  }
}
