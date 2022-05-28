
import { TabsProps, Tabs, Stack, Tab } from '@mantine/core';
import { MessageCircle, Settings } from 'tabler-icons-react';
import { Login } from './Login';
import { Register } from './Register';

export function Auth() {
  const StyledTabs = (props: TabsProps) => {
    return (
      <Tabs
        variant="unstyled"
        styles={(theme) => ({
          tabControl: {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
            color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[9],
            border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[4]}`,
            fontSize: theme.fontSizes.md,
            padding: `${theme.spacing.lg}px ${theme.spacing.xl}px`,

            '&:not(:first-of-type)': {
              borderLeft: 0,
            },

            '&:first-of-type': {
              borderTopLeftRadius: theme.radius.md,
              borderBottomLeftRadius: theme.radius.md,
            },

            '&:last-of-type': {
              borderTopRightRadius: theme.radius.md,
              borderBottomRightRadius: theme.radius.md,
            },
          },

          tabActive: {
            backgroundColor: theme.colors.blue[7],
            borderColor: theme.colors.blue[7],
            color: theme.white,
          },
        })}
        {...props}
      />
    );
  }

  return (
    <Stack pt={50} align="center">
      <StyledTabs>
        <Tab label="Log In" icon={<Settings size={16} />} >
          <Login />
        </Tab>
        <Tab label="Register" icon={<MessageCircle size={16} />}>
          <Register />
        </Tab>
      </StyledTabs>
    </Stack>
  );
}
