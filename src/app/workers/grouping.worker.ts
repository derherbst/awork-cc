/// <reference lib="webworker" />

import { User } from '../models/user.model';

addEventListener(
  'message',
  ({ data }: { data: { users: User[]; criterion: string } }) => {
    const { users, criterion } = data;
    const groups = new Map<string, User[]>();

    for (const user of users) {
      let key: string;
      switch (criterion) {
        case 'nationality':
          key = user.nat || 'Unknown';
          break;
        case 'alphabetical':
          key = (user.lastname?.[0] ?? '#').toUpperCase();
          break;
        case 'age':
          const age = user.age ?? 0;
          if (age < 26) key = '18-25';
          else if (age < 36) key = '26-35';
          else if (age < 46) key = '36-45';
          else if (age < 56) key = '46-55';
          else key = '56+';
          break;
        case 'gender':
          key = user.gender ?? 'Unknown';
          break;
        default:
          key = user.nat || 'Unknown';
      }

      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(user);
    }

    const result = Array.from(groups.entries())
      .map(([name, users]) => ({ name, users }))
      .sort((a, b) => a.name.localeCompare(b.name));

    postMessage(result);
  },
);
