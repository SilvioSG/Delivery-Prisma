import { prisma } from "../../../database/prismaClient";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

interface IAuthenticateClient {
  username: string;
  password: string;
}

export class AuthenticateClientUseCase {
  // Receber user name, password,
  async execute({ username, password }: IAuthenticateClient) {
    // Verificar se username cadastrado
    const client = await prisma.clients.findFirst({
      where: {
        username,
      },
    });

    if (!client) {
      throw new Error("Username or Password invalid! ");
    }

    // verificar se senha corresponde ao username
    const passwordMatch = await compare(password, client.password);

    if (!passwordMatch) {
      throw new Error("Username or Password invalid!");
    }

    // Gerar o token
    const token = sign({ username }, "6eef7dd0e1a682b50917f35e98b7ba91", {
      subject: client.id,
      expiresIn: "1d",
    });

    return token;
  }
}
