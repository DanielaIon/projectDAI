import React from 'react';
import { useForm } from '@mantine/form';
import { PasswordInput, Group, Button, Box, Input } from '@mantine/core';

import { TabsProps, Tabs, Stack, Tab } from '@mantine/core';
import { Photo, MessageCircle, Settings, At } from 'tabler-icons-react';
import { login } from '../services/api-service';

export function Login() {
  const form = useForm({
    initialValues: {
      password: '',
      email: '',

    },
  });

  return (
    <Box pt={20} sx={{ maxWidth: 340 }} mx="auto">
      <form
        onSubmit={form.onSubmit((values: any) => login(values.email, values.password))}
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


        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
}
