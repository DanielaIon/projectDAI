import { Button, Divider, Group, Menu, Paper, Select, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useModals } from '@mantine/modals';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChartBar, Checklist, Edit, List, Trash, Users } from 'tabler-icons-react';
import { Project } from '../models/project';
import { User } from '../models/user';
import { Id, WithId } from '../models/with-id';
import { deleteProject, deleteTask, getTeam, updateProject, updateTask } from '../services/api-service';
import { isAdmin, isManager } from '../services/auth-service';
import { DateWrapper } from './DateWrapper';

export type ProjectItemProps = {
  project: WithId<Project>;
  somethingUpdated: () => void;
}

export function ProjectItem(props: ProjectItemProps) {
  const project = props.project;

  const modals = useModals();
  const navigate = useNavigate();

  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [teamMembers, setTeamMembers] = useState<WithId<User>[]>([]);

  const form = useForm({
    initialValues: {
      title: project.title,
      description: project.description,
      responsableUser: String(project.responsableUser)
    },
  });

  useEffect(() => {
    getTeam(project.id).then((result) => {
      setTeamMembers(result)
    });
  }, []);

  const openDeleteProjectModal = () =>
    modals.openConfirmModal({
      title: `Delete project "${project.title}"`,
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this project? This action is destructive and
          you will not be able to restore it.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteProject(project.id),
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
                updateProject(
                  project.id,
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
            <Text>{project.title}</Text>
            <Text>{project.responsableUser.name}</Text>
            <DateWrapper timestamp={project.deadlineTimestamp} />
            <Text>{project.description}</Text>
            <Menu>
              <Menu.Item
                icon={<List size={14} />}
                onClick={() => navigate(`/${project.id}/task`)}
              >
                Tasks
              </Menu.Item>
              <Menu.Item
                icon={<Users size={14} />}
                onClick={() => navigate(`/${project.id}/team`)}
              >
                Team
              </Menu.Item>

              <Menu.Item
                icon={<ChartBar size={14} />}
                onClick={() => navigate(`/${project.id}/planning`)}
              >
                Planning
              </Menu.Item>

              <Divider />
              <Menu.Item
                disabled={!isManager()}
                icon={<Edit size={14} />}
                onClick={() => setIsEditable(true)}
              >
                Edit
              </Menu.Item>
              <Menu.Item color="red"
                disabled={!isAdmin()}
                icon={<Trash size={14} />}
                onClick={openDeleteProjectModal}
              >
                Delete
              </Menu.Item>
            </Menu>
          </>)
        }

      </Group>
    </Paper>
  );

}