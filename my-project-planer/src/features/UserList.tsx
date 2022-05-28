import { Stack } from '@mantine/core';
import { useEffect, useState } from 'react';
import { UserItem } from '../components/UserItem';
import { User } from '../models/user';
import { WithId } from '../models/with-id';
import { getUserList } from '../services/api-service';


export function UserList() {

  const [users, setUsers] = useState<WithId<User>[] | null>();

  const refreshData = () => getUserList().then((result) => setUsers(result));
  useEffect(() => {
    refreshData()
  }, []);

  return (
    <Stack pt={50} align="center">
      {
        users !== null && users !== undefined &&
        users.map((user) => (
          <UserItem
            key={user.id}
            user={user}
            somethingUpdated={refreshData}
          />
        ))
      }
    </Stack>
  );
}
