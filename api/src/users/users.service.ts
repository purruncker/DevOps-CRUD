import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) { }

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto)

  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    return await this.userRepository.findOne({ where: { id: id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    return await this.userRepository.update(id,
      {
        age: updateUserDto.age,
        firstName: updateUserDto.firstName,
        lastName: updateUserDto.lastName,
        enabled: updateUserDto.enabled
      }
    )
    /*
    return this.userRepository.createQueryBuilder()
      .update()
      .set(updateUserDto)
      .where("id = :id", { id: id })
      .execute().then(x => { console.log(x) })
    */
  }

  async remove(id: string) {
    return (await this.userRepository.delete(id)).affected > 0 ? true : false;
  }
}
