import { Button, Group, Menu, Paper, Select, Stack, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Trash } from 'tabler-icons-react';
import { User } from '../models/user';
import { Id, WithId } from '../models/with-id';
import { addUserToTeam, getTeam, getUserList, removeUserFromTeam } from '../services/api-service';
import { isManager } from '../services/auth-service';


export function TeamList() {

  const navigate = useNavigate();
  const modals = useModals();
  const params = useParams();

  if (!params.projectId) {
    showNotification({
      color: 'orange',
      title: 'Malformed path',
      message: 'No projectId has been provided'
    });
    navigate('/project');
  }
  const projectId = parseInt(params.projectId!);

  const [teamMembers, setTeamMembers] = useState<WithId<User>[] | null>();
  const [userToAddId, setUserToAddId] = useState<Id | null>();
  const [usersOutsideTheTeam, setUsersOutsideTheTeam] = useState<WithId<User>[] | null>();

  const openAddUserToTeamModal = () =>
    modals.openConfirmModal({
      title: `Expand this project's team`,
      centered: true,
      children: (
        <>
          {usersOutsideTheTeam &&
            <Select
              value={String(userToAddId)}
              data={usersOutsideTheTeam.map((user) => ({
                value: String(user.id),
                label: `${user.name} (${user.email})`
              }))}
              onChange={(userId) => setUserToAddId(parseInt(userId!))}
            />
          }
        </>
      ),
      labels: { confirm: 'Add', cancel: "Cancel" },
      confirmProps: { color: 'green' },
      onConfirm: () => userToAddId && addUserToTeam(projectId, userToAddId),
      onClose: () => setUserToAddId(null)
    });

  const openRemoveUserFromTeamModal = (user: WithId<User>) => () =>
    modals.openConfirmModal({
      title: `Remove ${user.name} from the team`,
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to remove {user.name} from the team?
          You won't be able too collaborate with him/her anymore.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: "Cancel" },
      confirmProps: { color: 'red' },
      onConfirm: () => removeUserFromTeam(projectId, user.id),
    });

  const refreshData = () => getTeam(projectId).then((result) => setTeamMembers(result));
  useEffect(() => {
    refreshData()
  }, []);
  useEffect(() => {
    const teamMembersIds = (teamMembers ?? []).map((teamMember) => teamMember.id);
    getUserList().then((users) =>
      setUsersOutsideTheTeam(
        users.filter(user => !teamMembersIds.includes(user.id))
      )
    );
  }, [teamMembers])

  return (
    <Stack pt={50} align="center">
      <Group>
        <Button
          disabled={!isManager()}
          onClick={openAddUserToTeamModal}
        >
          Add user to project
        </Button>
      </Group>
      {
        teamMembers !== null && teamMembers !== undefined &&
        teamMembers.map((teamMember) => (
          <Paper shadow="xs" p="sm">
            <Group key={teamMember.id}>
              <Text>{teamMember.name}</Text>
              <Text>{teamMember.email}</Text>
              <Text>{teamMember.role}</Text>
              <Menu>
                <Menu.Item color="red"
                  disabled={!isManager()}
                  icon={<Trash size={14} />}
                  onClick={openRemoveUserFromTeamModal(teamMember)}
                >
                  Remove
                </Menu.Item>
              </Menu>
            </Group>
          </Paper>
        ))
      }
    </Stack>
  );
}
