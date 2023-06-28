import { z } from "zod";
import { Response } from "../../http";
import { HttpError, Log } from "../../shared";

// query
export const ConstellationInput = z.object({
  type: z.string(),
  shape: z.number().array(),
  value: z.number().array(),
});

export const ConstellationQuerySchema = z.object({
  input: z.array(ConstellationInput),
});
export type ConstellationQuery = z.infer<typeof ConstellationQuerySchema>;

// response
export interface ConstellationErrorResponse {
  error: string;
  success: false;
  served_by: string;
}

export interface ConstellationOutput {
  type: string;
  shape: number[];
  value: number[];
  name: string;
}

export interface ConstellationSuccessResponse {
  result: ConstellationOutput[];
}

const served_by = "miniflare.constellation";

function err(error: unknown): ConstellationErrorResponse {
  return {
    error: String(error),
    success: false,
    served_by,
  };
}

export class ConstellationError extends HttpError {
  constructor(cause: Error) {
    super(500, undefined, cause);
  }

  toResponse(): Response {
    return Response.json(err(this.cause));
  }
}

export class ConstellationGateway {
  constructor(private readonly log: Log) {}

  query(query: ConstellationQuery): ConstellationSuccessResponse {
    try {
      console.log("QUERY BINDING");
      console.log(query);
    } catch (e: any) {
      throw new ConstellationError(e);
    }

    throw new ConstellationError("unimplemented" as any);
  }
}
