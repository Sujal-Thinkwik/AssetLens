import { AppShell, Container } from '@mantine/core';
import { Outlet } from 'react-router-dom';

import ScrollToTop from '@/common/ScrollToTop';
import AppHeader from '@/components/header/AppHeader';
import Footer from '@/components/footer/Footer';

const MasterLayout = () => (
  <>
    <ScrollToTop />
    <AppShell header={{ height: 68 }} padding={0}>
      <AppShell.Header withBorder bg="light-dark(rgba(255, 255, 255, 0.94), rgba(26, 27, 30, 0.94))">
        <AppHeader />
      </AppShell.Header>

      <AppShell.Main pos="relative" style={{ overflow: 'clip' }}>
        <Container size="xl" py={{ base: 24, sm: 48 }}>
          <Outlet />
        </Container>
        <Footer />
      </AppShell.Main>
    </AppShell>
  </>
);

export default MasterLayout;
