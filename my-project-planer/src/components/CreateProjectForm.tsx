import { Button, Group, Textarea, TextInput, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { createProject } from '../services/api-service';
import { Calendar } from '@mantine/dates';
import { User } from '../models/user';
import { WithId } from '../models/with-id';


export type CreateProjectFormProps = {
   user: WithId<User>;
   somethingUpdated: () => void;
}

export function CreateProjectForm(props: CreateProjectFormProps) {
   const form = useForm({
      initialValues: {
         title: '',
         description: '',
         deadlineTimestamp: (new Date()).getTime() / 1000,
      }
   });
   return (
      <form onSubmit={
         form.onSubmit((values) =>
            createProject(
               {
                  title: values.title,
                  description: values.description,
                  deadlineTimestamp: new Date(values.deadlineTimestamp).getTime() / 1000,
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
            Deadline
         </Text>
         <Calendar
            {...form.getInputProps('deadlineTimestamp')}
         />

         <Group position="right" mt="md">
            <Button type="submit">Update</Button>
         </Group>
      </form>
   );
}