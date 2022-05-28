import { Button, Group, Menu, Paper, Select, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useModals } from '@mantine/modals';
import { useState } from 'react';
import { Edit, Trash } from 'tabler-icons-react';
import { User, UserRole } from '../models/user';
import { WithId } from '../models/with-id';
import { deleteUser, updateUser } from '../services/api-service';
import { isAdmin } from '../services/auth-service';

export type UserItemProps = {
  user: WithId<User>;
  somethingUpdated: () => void;
}

export function UserItem(props: UserItemProps) {
  const user = props.user;

  const modals = useModals();

  const [isEditable, setIsEditable] = useState<boolean>(false);

  const form = useForm({
    initialValues: {
      name: user.name,
      role: user.role
    },
  });

  const openDeleteTaskModal = () =>
    modals.openConfirmModal({
      title: `Delete ${user.name} (${user.email})'s account`,
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this user? This action is destructive and
          you will not be able to restore it.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: "Cancel" },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteUser(user.id),
    });

  return (
    <Paper shadow="xs" p="sm">
      <Group>
        {isEditable
          ? (<>
            <form onSubmit={
              form.onSubmit((values) =>
                updateUser(
                  user.id,
                  {
                    name: values.name,
                    role: values.role,
                  }
                ).then(() => {
                  setIsEditable(false);
                  props.somethingUpdated();
                })
              )
            }>
              <TextInput
                placeholder="Name"
                {...form.getInputProps('name')}
              />
              <Select
                placeholder="Responsible user"
                data={[{
                  label: 'User', value: UserRole.USER
                }, {
                  label: 'Manager', value: UserRole.MANAGER
                }, {
                  label: 'Admin', value: UserRole.ADMIN
                }]}
                {...form.getInputProps('role')}
              />
              <Group position="right" mt="md">
                <Button color="red" onClick={() => setIsEditable(false)}>Cancel</Button>
                <Button type="submit">Update</Button>
              </Group>
            </form>
          </>)
          : (<>
            <Text>{user.name}</Text>
            <Text>{user.email}</Text>
            <Text>{user.role}</Text>
            <Menu>
              <Menu.Item
                disabled={!isAdmin()}
                icon={<Edit size={14} />}
                onClick={() => setIsEditable(true)}
              >
                Edit
              </Menu.Item>
              <Menu.Item color="red"
                disabled={!isAdmin()}
                icon={<Trash size={14} />}
                onClick={openDeleteTaskModal}
              >
                Archive
              </Menu.Item>
            </Menu>
          </>)
        }

      </Group>
    </Paper>
  );

}