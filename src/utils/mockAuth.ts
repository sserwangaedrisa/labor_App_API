import type { User, UserRole } from '../types/auth.types';

export const mockCredentials: {
  username: string;
  password: string;
  role: UserRole;
}[] = [
  { username: 'labor1', password: '123456', role: 'laborer' },
  { username: 'foreman1', password: '123456', role: 'foreman' },
  { username: 'owner1', password: '123456', role: 'owner' }
];

export const authenticateUser = (
  username: string,
  password: string,
  role: UserRole
): User | null => {
  const user = mockCredentials.find(
    (c) =>
      c.username === username &&
      c.password === password &&
      c.role === role
  );

  return user ? { username: user.username, role: user.role } : null;
};

export const saveUser = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
};
