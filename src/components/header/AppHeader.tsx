import { Container, Group } from '@mantine/core';
import Logo from '@/common/Logo';
import ToggleTheme from '@/components/toggle-theme/ToggleTheme';

const AppHeader = () => (
  <Container size="xl" h="100%">
    <Group h="100%" justify="space-between" wrap="nowrap">
      <Logo />
      <Group gap="sm" wrap="nowrap">
        <ToggleTheme />
      </Group>
    </Group>
  </Container>
);

export default AppHeader;
