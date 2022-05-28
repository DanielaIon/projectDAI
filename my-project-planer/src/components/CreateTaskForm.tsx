import { Button, Group, Stack, Textarea, TextInput, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { TaskStatus } from '../models/task';
import { createTask } from '../services/api-service';
import { Calendar } from '@mantine/dates';
import { User } from '../models/user';
import { Id, WithId } from '../models/with-id';


export type CreateTaskFormProps = {
   user: WithId<User>;
   projectId: Id;
   somethingUpdated: () => void;
}

export function CreateTaskForm(props: CreateTaskFormProps) {
   const form = useForm({
      initialValues: {
         title: '',
         description: '',
         beginningTimestamp: (new Date()).getTime() / 1000,
         endingTimestamp: (new Date()).getTime() / 1000,
      }
   });
   return (
      <form onSubmit={
         form.onSubmit((values) =>
            createTask(
               props.projectId,
               {
                  title: values.title,
                  description: values.description,
                  endingTimestamp: new Date(values.endingTimestamp).getTime() /1000,
                  beginningTimestamp: new Date(values.beginningTimestamp).getTime() / 1000,
                  status: TaskStatus.TO_DO,
                  responsableUser: props.user
               }
            ).then(props.somethingUpdated)
         )
      }>
         <TextInput
            placeholder="Title"
            required
            {...form.getInputProps('title')}
         />

         <Textarea
            placeholder="Description"
            required
            {...form.getInputProps('description')}
         />

         <Text>
            Beginning
         </Text>
         <Calendar
            {...form.getInputProps('beginningTimestamp')}
         />

         <Text>
            Ending
         </Text>
         <Calendar
            {...form.getInputProps('endingTimestamp')}
         />

         <Group position="right" mt="md">
            <Button type="submit">Update</Button>
         </Group>
      </form>
   );
}