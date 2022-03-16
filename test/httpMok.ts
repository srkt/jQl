import { JqlOptions } from '../src/jQl';
import { clients } from './clients';
import { users } from './users';

export const httpMok = <T>(data: T) => {
  return (url: string) => {
    const promise = new Promise<T>((resolve) => {
      setTimeout(() => {
        resolve(data);
      }, 1000);
    });
    return promise;
  };
};
const userRequest = httpMok(users);
const clientRequest = httpMok(clients);

export function HttpService(
  url: string
): ((url: string) => Promise<any>) | any {
  switch (url) {
    case 'users':
      return userRequest(url);
      break;
    case 'clients':
      return clientRequest(url);
    default:
      break;
  }
}

const options = new JqlOptions();
options.httpService = HttpService;

export const TestJqlOptions = options;
