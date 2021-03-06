import { prisma } from "../../../database/prismaClient";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

interface IAuthenticateDeliveryman {
  username: string;
  password: string;
}

export class AuthenticateDeliverymanUseCase {
  // Receber user name, password,
  async execute({ username, password }: IAuthenticateDeliveryman) {
    // Verificar se username cadastrado
    const deliveryman = await prisma.deliveryman.findFirst({
      where: {
        username,
      },
    });

    if (!deliveryman) {
      throw new Error("Username or Password invalid! ");
    }

    // verificar se senha corresponde ao username
    const passwordMatch = await compare(password, deliveryman.password);

    if (!passwordMatch) {
      throw new Error("Username or Password invalid!");
    }

    // Gerar o token
    const token = sign({ username }, "6eef7dd0e1a682b50917f35e98b7ba92", {
      subject: deliveryman.id,
      expiresIn: "1d",
    });

    return token;
  }
}
