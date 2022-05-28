import { Button, Group, Stack } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { useEffect, useState } from 'react';
import { Plus } from 'tabler-icons-react';
import { CreateProjectForm } from '../components/CreateProjectForm';
import { ProjectItem } from '../components/ProjectItem';
import { Project } from '../models/project';
import { WithId } from '../models/with-id';
import { getProjectList } from '../services/api-service';
import { getUser, isManager } from '../services/auth-service';


export function ProjectList() {
  const user = getUser();

  const [projects, setProjects] = useState<WithId<Project>[] | null>();

  const modals = useModals();

  const openCreateNewProjectModal = () => modals.openModal({
    title: 'Create new project',
    children: (
      <CreateProjectForm
        user={user!}
        somethingUpdated={refreshData}
      />
    ),
  });

  const refreshData = () => getProjectList().then((result) => {
    setProjects(result)
  });
  useEffect(() => { refreshData() }, []);

  return (
    <Stack pt={50} align="center">
      {<Group>
        <Button
          disabled={!isManager()}
          leftIcon={<Plus size={14} />}
          onClick={openCreateNewProjectModal}
        >
          Create project
        </Button>
      </Group>}
      {
        projects !== null && projects !== undefined &&
        projects.map((project) => (
          <ProjectItem
            key={project.id}
            project={project}
            somethingUpdated={refreshData}
          />
        ))
      }
    </Stack>
  );
}
