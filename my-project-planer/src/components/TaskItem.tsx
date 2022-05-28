import { Button, Divider, Group, Menu, Paper, Select, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useModals } from '@mantine/modals';
import { useEffect, useState } from 'react';
import { Edit, Trash } from 'tabler-icons-react';
import { Task } from '../models/task'
import { User } from '../models/user';
import { Id, WithId } from '../models/with-id';
import { deleteTask, getTeam, updateTask } from '../services/api-service';
import { isManager } from '../services/auth-service';
import { DateWrapper } from './DateWrapper';

export type TaskItemProps = {
  projectId: Id;
  task: WithId<Task>;
  actions: TaskActions[];
  somethingUpdated: () => void;
}

export type TaskActions = {
  text: string;
  onClick: () => void;
  icon: React.ReactNode;
}

export function TaskItem(props: TaskItemProps) {
  const task = props.task;

  const modals = useModals();

  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [teamMembers, setTeamMembers] = useState<WithId<User>[]>([]);

  const form = useForm({
    initialValues: {
      title: task.title,
      description: task.description,
      responsableUser: String(task.responsableUser)
    },
  });

  useEffect(() => {
    getTeam(props.projectId).then((result) => {
      setTeamMembers(result)
    });
  }, []);

  const openDeleteTaskModal = () =>
    modals.openConfirmModal({
      title: `Delete task "${task.title}"`,
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this task? This action is destructive and
          you will not be able to restore it.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: "Cancel" },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteTask(props.projectId, task.id),
    });

  const getUserById = (userId: Id): WithId<User> => {
    return teamMembers.filter(user => user.id === userId)[0];
  }

  return (
    <Paper shadow="xs" p="sm">
      <Group>
        {isEditable
          ? (<>
            <form onSubmit={
              form.onSubmit((values) =>
                updateTask(
                  props.projectId,
                  task.id,
                  {
                    title: values.title,
                    description: values.description,
                    responsableUser: getUserById(parseInt(values.responsableUser)),
                  }
                ).then(() => {
                  setIsEditable(false);
                  props.somethingUpdated();
                })
              )
            }>
              <TextInput
                placeholder="Title"
                {...form.getInputProps('title')}
              />
              <TextInput
                placeholder="Description"
                {...form.getInputProps('description')}
              />
              <Select
                placeholder="Responsible user"
                data={teamMembers.map((member) => ({
                  value: String(member.id),
                  label: `${member.name} (${member.email})`
                }))}
                {...form.getInputProps('responsableUser')}
              />
              <Group position="right" mt="md">
                <Button color="red" onClick={() => setIsEditable(false)}>Cancel</Button>
                <Button type="submit">Update</Button>
              </Group>
            </form>
          </>)
          : (<>
            <Text>{task.title}</Text>
            <Text>{task.responsableUser.name}</Text>
            <DateWrapper timestamp={task.beginningTimestamp}/>
            <DateWrapper timestamp={task.endingTimestamp}/>
            <Text>{task.description}</Text>
            <Menu>
              {
                props.actions.map((action) => (
                  <Menu.Item
                    key={action.text}
                    icon={action.icon}
                    onClick={action.onClick}
                  >
                    {action.text}
                  </Menu.Item>
                ))
              }

              {
                props.actions.length > 0 && <Divider />
              }

              <Menu.Item
                disabled={!isManager()}
                icon={<Edit size={14} />}
                onClick={() => setIsEditable(true)}
              >
                Edit
              </Menu.Item>
              <Menu.Item color="red"
                disabled={!isManager()}
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