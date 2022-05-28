import React from 'react';
import { useForm } from '@mantine/form';
import { PasswordInput, Group, Button, Box, Input } from '@mantine/core';

import { At } from 'tabler-icons-react';
import { register } from '../services/api-service';

export function Register() {
  const form = useForm({
    initialValues: {
      password: '',
      confirmPassword: '',
      email:'',
    },

    validate: {
      confirmPassword: (value:any, values:any) =>
        value !== values.password ? 'Passwords did not match' : null,
    },
  
  });

  return (
    <Box pt={20} sx={{ maxWidth: 340 }} mx="auto">
      <form
        onSubmit={form.onSubmit((values: any) => register(values.email, values.password))}
      >
        <Input
          pb={10}
          icon={<At />}
          placeholder="Your email"
          {...form.getInputProps('email')}
        />

        <PasswordInput
          placeholder="Password"
          {...form.getInputProps('password')}
        />

        <PasswordInput
          mt="sm"
          placeholder="Confirm password"
          {...form.getInputProps('confirmPassword')}
        />

        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
}
