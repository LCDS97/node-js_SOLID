import { User } from "../../entities/User";
import { IUsersRepository } from "../../repositories/IUserRepository";
import { ICreateUserRequestDTO } from "./CreateUserDTO";
import { IMailProvider } from "../../providers/IMailProvider";

export class CreateUserUseCase {

    constructor(
       private usersRepository: IUsersRepository,
       private mailProvider: IMailProvider,
       
    ) {}

    async execute(data: ICreateUserRequestDTO){
        const userAlreadyExists = await this.usersRepository.findByEmail(data.email);

        if (userAlreadyExists) {
            throw new Error('User already exists')
        }

        const user = new User(data);

        await this.usersRepository.save(user);

        await this.mailProvider.sendMail({
            to: {
                name: data.name,
                email: data.email,
            },
            from: {
                name: 'Equipe do meu App',
                email: 'equipe@app.com',
            },
            subject: 'Seja bem vindo!',
            body: '<p>Você pode fazer login em nossa plataforma</p>'
        })
    }
}