import { Response } from "../../http";
import { POST, RouteHandler, Router, decodePersist } from "../shared";
import { ConstellationGateway, ConstellationQuerySchema } from "./gateway";

export class ConstellationRouter extends Router<ConstellationGateway> {
  @POST("/run")
  query: RouteHandler = async (req) => {
    const persist = decodePersist(req.headers);
    const gateway = this.gatewayFactory.get("TODO", persist);
    const query = ConstellationQuerySchema.parse(await req.json());
    const results = gateway.query(query);
    return Response.json(results);
  };
}
