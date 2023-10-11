import {FastifyReply, FastifyRequest} from "fastify";
import {UserService} from "../../ghost/user/service";
import {controller, get} from "../../common/http";

@controller()
export class UserController {
  constructor(public service: UserService) {}

  @get("/:id")
  async read(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await this.service.getOne((request.params as any).id);
      reply.code(200);
      reply.send({
        entities: [result],
      });
    } catch (err) {
      reply.code(500);
      reply.send({
        error: err,
      });
    }
  }

  @get("/")
  async browse(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await this.service.getAll();
      reply.code(200);
      reply.send({
        entities: result,
      });
    } catch (err) {
      reply.code(500);
      reply.send({
        error: err,
      });
    }
  }
}
