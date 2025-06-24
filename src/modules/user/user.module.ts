import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Address, AddressSchema } from './schemas/address.schema';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtGlobalModule } from 'src/common/jwt/jwt.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      {
        name: Address.name,
        schema: AddressSchema,
      },
    ]),
    JwtGlobalModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [],
})
export class UserModule {}
