import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ProjectList } from './features/ProjectList';
import { ProjectsAppShell } from './components/AppShell';
import { ProjectView } from './features/ProjectView';
import { NotificationsProvider } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { TaskList } from './features/TaskList';
import { getUser } from './services/auth-service';
import { AuthCheck } from './auth/AuthCheck';
import { TeamList } from './features/TeamList';
import { UserList } from './features/UserList';

function App() {
  const user = getUser();

  return (
    <NotificationsProvider>
      <ModalsProvider>
        <BrowserRouter>
          <ProjectsAppShell>
            <>
              <div className="background"></div>
              <AuthCheck user={user}/>
              <Routes>
                <Route path="/" element={<ProjectList />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/:projectId/task" element={<TaskList />} />
                <Route path="/:projectId/task/:taskId" element={<ProjectList />} />
                <Route path="/:projectId/planning" element={<ProjectView />} />
                <Route path="/:projectId/releases" element={<ProjectList />} />
                <Route path="/:projectId/team" element={<TeamList />} />
                <Route path="/:projectId/settings" element={<ProjectList />} />
              </Routes>
            </>
          </ProjectsAppShell>
        </BrowserRouter>
      </ModalsProvider>
    </NotificationsProvider>
  );
}

export default App;
