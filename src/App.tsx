import { MantineProvider } from '@mantine/core';
import { RouterProvider } from 'react-router-dom';
import { routes } from '@/routes/routes';
import { theme } from '@/theme';

const App = () => (
  <MantineProvider theme={theme}>
    <RouterProvider router={routes} />
  </MantineProvider>
);

export default App;
