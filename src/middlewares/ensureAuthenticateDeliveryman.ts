import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticateDeliveryman(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return response.status(401).json({
      message: "Token Missing",
    });
  }

  const [, token] = authHeader.split(" ");

  try {
    const { sub } = verify(
      token,
      "6eef7dd0e1a682b50917f35e98b7ba92"
    ) as IPayload;

    request.id_deliveryman = sub;

    return next();
  } catch (err) {
    return response.status(401).json({
      message: "Invalid token!",
    });
  }
}
