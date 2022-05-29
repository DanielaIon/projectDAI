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
    tooltip: {
     
          backgroundColor: '#543453',
          callbacks: {
            label: function(context:any) {
              let status    = "Status: " +  getStatus(context.dataset.data[context.dataIndex][2].status);

              let beggining = "";
              let ending = "";
              if(status.includes("TO DO"))
                beggining = "Estimated starting day: " +  moment.unix(context.dataset.data[context.dataIndex][0]).format("DD-MM");
              else 
                beggining = "Starting day: " +  moment.unix(context.dataset.data[context.dataIndex][0]).format("DD-MM");


              if(status.includes("DONE"))
                ending = "Ending day: " +  moment.unix(context.dataset.data[context.dataIndex][1]).format("DD-MM");
              else 
                ending = "Estimated ending day: " +  moment.unix(context.dataset.data[context.dataIndex][1]).format("DD-MM");

              let description    = "Description: " +  context.dataset.data[context.dataIndex][2].description;
              let responsableUser    = "Responsable User: " +  context.dataset.data[context.dataIndex][2].responsableUser.name;
              return [status, beggining, ending, responsableUser, description];
            }
        }
  },
  },
};

function getStatus(status:string){
  switch(status){
    case "to_do":
          return "TO DO"
    case "in_progress":
          return "IN PROGRESS"
    case "done":
          return "DONE"
  }
}

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
          return [task.beginningTimestamp, task.endingTimestamp, task]
        }),
        backgroundColor: ['#8074a8', '#c6c1f0', '#c46487', '#ffbed1', '#9c9290', '#c5bfbe', '#9b93c9', '#ddb5d5', '#7c7270', '#f498b6', '#b173a0', '#c799bc'],
      },
    ],
  }} />);
}
