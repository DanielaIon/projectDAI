
import React from 'react';
import { ListSearch, Logout, Users } from 'tabler-icons-react';
import { ThemeIcon, UnstyledButton, Group, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/api-service';

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  link: string;
  onClick?: () => void;
}

function MainLink({ icon, color, label, link, onClick }: MainLinkProps) {
  const navigate = useNavigate();
  return (
    <UnstyledButton
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
      })}
      onClick={() => onClick ? onClick() : navigate(link)}
    >
      <Group>
        <ThemeIcon color={color} variant="light">
          {icon}
        </ThemeIcon>

        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  );
}

const data = [
  { icon: <ListSearch size={16} />, color: 'blue', label: 'Project List', link: "/" },
  { icon: <Users size={16} />, color: 'green', label: 'Users', link: "/users" },
  { icon: <Logout size={16} />, color: 'red', label: 'Logout', link:"/auth", onClick: () => logout() },
];

export function ProjectsLinks() {
  const links = data.map((link) => <MainLink {...link} key={link.label} />);
  return <div>{links}</div>;
}