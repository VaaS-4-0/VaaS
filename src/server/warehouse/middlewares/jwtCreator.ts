import { NextFunction, Request, Response } from 'express';
import { encodeSession } from '../../services/jwt';
import { IPartialSession } from '../../interfaces/IToken';
import { terminal } from '../../services/terminal';

export default (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  terminal(`Received ${req.method} request at 'jwtCreator' middleware`);
  const { username } = req.body,
    { userId } = res.locals;
  const partialSession: IPartialSession = {
    id: userId,
    username: username,
  };
  // ENCODE USER DETAILS AND STORE ON LOCALS
  res.locals.jwt = encodeSession(process.env.JWT_ACCESS_SECRET, partialSession);
  terminal(`Success: JWT created: ${res.locals.jwt} for ${username}`);
  return next();
};
