import { Router } from 'express';
import {
  GetUserByIdController,
  UserLogOutController,
  UserRefreshTokenController,
  UserSignInController,
  UserSignUpController,
} from '../src/controllers/auth';
import { AuthenticateUserMiddleware } from '../src/middlewares';

function nestedRoutes(path: string, configure: (router: Router) => void) {
  const router = Router({mergeParams: true});
  router.use(path, router);
  configure(router);
  return router;
}

export const AuthRoutes = nestedRoutes('/user', user => {
  user.post('/signup', UserSignUpController);
  user.post('/signin', UserSignInController);

  user.use(AuthenticateUserMiddleware)

  user.post('/signin/new_token', UserRefreshTokenController);
  user.get('/logout', UserLogOutController);
  user.get('/info', GetUserByIdController);
});
