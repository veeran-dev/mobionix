import { hash } from 'bcryptjs';
import { CreateUserDto } from '@/module/user/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@/module/user/users.interface';
import userModel from '@/module/user/users.model';
import { isEmpty } from '@utils/util';

class UserService {
  public users = userModel;

  public async findAllUser(): Promise<User[]> {
    const Allusers: any = this.users.find();
    return Allusers;
  }

  public async findUserById(userId: number): Promise<User> {
    const findUser: any = this.users.find({_id:userId});
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    const findUser: any = this.users.find({_id:userData.email});
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const user:any = this.users.create({email:userData.email, password:hashedPassword})
    return user;
  }

  public async updateUser(userId: number, userData: CreateUserDto): Promise<User[]> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    const findUser: any = this.users.find({_id:userId});
    if (!findUser) throw new HttpException(409, "User doesn't exist");
    
    const user:any =this.users.updateOne(
        {_id: userId},
        {$set:{email:userData.email}});
    return user;
    };
  }
export default UserService;
