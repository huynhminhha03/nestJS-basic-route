import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Types } from 'mongoose';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    console.log('payload', payload);
    const { _id, email, username, role } = payload;
    
    const objectId =
      typeof _id === 'string'
        ? new Types.ObjectId(_id)
        : Types.ObjectId.createFromTime(_id);

    return {
      _id: objectId,
      email,
      username,
      role,
    };
  }
}
