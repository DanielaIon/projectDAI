import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import moment from 'moment';
import { showNotification } from '@mantine/notifications';
import { useNavigate, useParams } from 'react-router-dom';
import { Task } from '../models/task';
import { WithId } from '../models/with-id';
import { getTaskList } from '../services/api-service';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

export const options = {
  indexAxis: 'y' as const,
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  type: 'bar',
  scales: {
    x: {
      stacked: true,
      beginAtZero: false,
      afterTickToLabelConversion: function (value: any) {
        for (var tick in value.ticks) {
          console.log(value.ticks[tick].value)
          value.ticks[tick].label = moment.unix(value.ticks[tick].value).format("DD-MM-YYYY");
        }
      }
    },
    y: {
    }
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'right' as const,
    },
    title: {
      display: true,
      text: 'Project planning',
    },
  },
};


export function ProjectView() {
  const params = useParams();
  const navigate = useNavigate();

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

  const refreshTaskList = () => getTaskList(projectId)
    .then((result) => setTasks(result))
    .catch((error) => showNotification({
      color: 'danger',
      title: 'Error on retrieving tasks',
      message: error,
    }));

  useEffect(() => {
    refreshTaskList();
  }, []);

  if (!tasks) {
    return (<></>);
  }

  return (<Bar options={options} data={{
    labels: tasks.map((task) => task.title),
    datasets: [
      {
        label: 'Progress',
        data: tasks.map((task) => {
          return [task.beginningTimestamp, task.endingTimestamp]
        }),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: ['rgba(255, 99, 132, 0.5)'],
      },
    ],
  }} />);
}
