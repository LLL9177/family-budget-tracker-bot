import * as bcrypt from 'bcrypt';

interface IHashService {
  hash(data: string): string;
  compare(data: string, hashedData: string): boolean;
}

export class HashService implements IHashService {
  hash(data: string): string {
    return bcrypt.hashSync(data, 10);
  }

  compare(data: string, hashedData: string): boolean {
    return bcrypt.compareSync(data, hashedData);
  }
}
