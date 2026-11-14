import { AppShell, Container } from '@mantine/core';
import { Outlet } from 'react-router-dom';

import ScrollToTop from '@/common/ScrollToTop';
import AppHeader from '@/components/header/AppHeader';
import Footer from '@/components/footer/Footer';

const MasterLayout = () => (
  <>
    <ScrollToTop />
    <AppShell header={{ height: 68 }} padding={0}>
      <AppShell.Header
        withBorder
        bg="color-mix(in srgb, var(--mantine-color-body) 55%, transparent)"
        style={{ backdropFilter: 'blur(14px) saturate(160%)', WebkitBackdropFilter: 'blur(14px) saturate(160%)' }}
      >
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
