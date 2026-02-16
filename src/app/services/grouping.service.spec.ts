import { flattenGroups, UserGroup, ListRow } from './grouping.service';
import { User } from '../models/user.model';

describe('flattenGroups', () => {
  const user1 = new User({ firstname: 'Alice', lastname: 'Smith', nat: 'US' });
  const user2 = new User({ firstname: 'Bob', lastname: 'Jones', nat: 'US' });
  const user3 = new User({ firstname: 'Clara', lastname: 'Muller', nat: 'DE' });

  const groups: UserGroup[] = [
    { name: 'US', users: [user1, user2] },
    { name: 'DE', users: [user3] },
  ];

  it('should return only headers when no groups are expanded', () => {
    const rows = flattenGroups(groups, new Set());

    expect(rows.length).toBe(2);
    expect(rows[0]).toEqual({ type: 'header', name: 'US', count: 2, expanded: false });
    expect(rows[1]).toEqual({ type: 'header', name: 'DE', count: 1, expanded: false });
  });

  it('should include column-header and user rows for expanded groups', () => {
    const rows = flattenGroups(groups, new Set(['US']));

    expect(rows.length).toBe(5);
    expect(rows[0]).toEqual({ type: 'header', name: 'US', count: 2, expanded: true });
    expect(rows[1]).toEqual({ type: 'column-header' });
    expect(rows[2]).toEqual({ type: 'user', user: user1 });
    expect(rows[3]).toEqual({ type: 'user', user: user2 });
    expect(rows[4]).toEqual({ type: 'header', name: 'DE', count: 1, expanded: false });
  });

  it('should expand multiple groups', () => {
    const rows = flattenGroups(groups, new Set(['US', 'DE']));

    expect(rows.length).toBe(7);
    // US: header + column-header + 2 users
    expect(rows[0].type).toBe('header');
    expect(rows[1].type).toBe('column-header');
    expect(rows[2].type).toBe('user');
    expect(rows[3].type).toBe('user');
    // DE: header + column-header + 1 user
    expect(rows[4]).toEqual({ type: 'header', name: 'DE', count: 1, expanded: true });
    expect(rows[5]).toEqual({ type: 'column-header' });
    expect(rows[6]).toEqual({ type: 'user', user: user3 });
  });

  it('should return empty array for empty groups', () => {
    const rows = flattenGroups([], new Set());
    expect(rows).toEqual([]);
  });

  it('should handle expanded set with non-existent group name', () => {
    const rows = flattenGroups(groups, new Set(['FR']));

    expect(rows.length).toBe(2);
    expect(rows.every(r => r.type === 'header')).toBeTrue();
  });
});
