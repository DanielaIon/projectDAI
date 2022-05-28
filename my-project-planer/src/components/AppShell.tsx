import { AppShell, Navbar, Header, Box } from '@mantine/core';
import { JsxAttributeLike } from 'typescript';
import { ProjectsLinks } from './ProjectsLinks';

export type ProjectsAppShellProps = { children: JSX.Element }

export function ProjectsAppShell(props: ProjectsAppShellProps) {
  return (
    <AppShell
      padding="md"
      navbar={<Navbar width={{ base: 300 }} height={"100vh"} p="xs">
        <ProjectsLinks />
      </Navbar>}
    >
      {props.children}
    </AppShell>
  );
}