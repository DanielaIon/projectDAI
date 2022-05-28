import { Badge, Button, Grid, Group, Stack } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Plus } from 'tabler-icons-react';
import { CreateTaskForm } from '../components/CreateTaskForm';
import { TaskItem } from '../components/TaskItem';
import { Task, TaskStatus } from '../models/task';
import { WithId } from '../models/with-id';
import { getTaskList, updateTask } from '../services/api-service';
import { getUser, isManager } from '../services/auth-service';


export function TaskList() {
  const user = getUser();

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

  const [tasks, setTasks] = useState<WithId<Task>[] | null>();

  const openCreateNewTaskModal = () => modals.openModal({
    title: 'Create new task',
    children: (
      <CreateTaskForm
        user={user!}
        projectId={projectId}
        somethingUpdated={refreshTaskList}
      />
    ),
  });

  const refreshTaskList = () => getTaskList(projectId)
    .then((result) => setTasks(result))
    .catch((error) => showNotification({
      color: 'danger',
      title: 'Error on retrieving tasks',
      message: error,
    }));

  const updateTaskStatus = (taskId: number, status: TaskStatus) => {
    updateTask(projectId, taskId, {
      status
    })
      .then((result) => refreshTaskList())
      .catch((error) => showNotification({
        color: 'danger',
        title: 'Error on updating task',
        message: error,
      }))
  }

  useEffect(() => {
    refreshTaskList();
  }, []);

  return (
    <Stack pt={50} align="center">
      <Group>
        <Button
          disabled={!isManager()}
          leftIcon={<Plus size={14} />}
          onClick={openCreateNewTaskModal}
        >
          Create task
        </Button>
      </Group>
      <Grid>
        <Grid.Col span={4}>
          <Stack align="center" >
            <Badge size="xl" variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>
              To do
            </Badge>

            {
              tasks !== null && tasks !== undefined &&
              tasks
                .filter((task) => task.status === TaskStatus.TO_DO)
                .map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    projectId={projectId}
                    somethingUpdated={() => refreshTaskList()}
                    actions={[
                      {
                        text: 'Move in progress',
                        onClick: () => updateTaskStatus(task.id, TaskStatus.IN_PROGRESS),
                        icon: <ArrowRight size={14} />
                      }
                    ]} />
                ))
            }
          </Stack>
        </Grid.Col>

        <Grid.Col span={4}>
          <Stack align="center" >
            <Badge size="xl" variant="gradient" gradient={{ from: 'orange', to: 'red' }}>
              In progess
            </Badge>

            {
              tasks !== null && tasks !== undefined &&
              tasks
                .filter((task) => task.status === TaskStatus.IN_PROGRESS)
                .map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    projectId={projectId}
                    somethingUpdated={() => refreshTaskList()}
                    actions={[
                      {
                        text: 'Move in to do',
                        onClick: () => updateTaskStatus(task.id, TaskStatus.TO_DO),
                        icon: <ArrowLeft size={14} />
                      }, {
                        text: 'Move in done',
                        onClick: () => updateTaskStatus(task.id, TaskStatus.DONE),
                        icon: <ArrowRight size={14} />
                      }
                    ]} />
                ))
            }
          </Stack>
        </Grid.Col>

        <Grid.Col span={4}>
          <Stack align="center" >
            <Badge size="xl" variant="gradient" gradient={{ from: 'teal', to: 'lime', deg: 105 }}>
              Done
            </Badge>

            {
              tasks !== null && tasks !== undefined &&
              tasks
                .filter((task) => task.status === TaskStatus.DONE)
                .map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    projectId={projectId}
                    somethingUpdated={() => refreshTaskList()}
                    actions={[
                      {
                        text: 'Move in progress',
                        onClick: () => updateTaskStatus(task.id, TaskStatus.IN_PROGRESS),
                        icon: <ArrowLeft size={14} />
                      }
                    ]} />
                ))
            }
          </Stack>
        </Grid.Col>
      </Grid>

    </Stack >
  );
}
