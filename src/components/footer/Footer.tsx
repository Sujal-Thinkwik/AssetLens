import { Box, Container, Divider, Group, SimpleGrid, Stack, Text } from '@mantine/core';
import Logo from '@/common/Logo';
import { APP_NAME, APP_TAGLINE, FOOTER_COLUMNS } from '@/constants/app';

const Footer = () => (
  <Box
    component="footer"
    py="xl"
    pos="relative"
    style={{ zIndex: 1, borderTop: '1px solid var(--mantine-color-default-border)' }}
  >
    <Container size="xl">
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl">
        <Stack gap="sm">
          <Logo />
          <Text c="dimmed" size="sm">
            {APP_TAGLINE}
          </Text>
        </Stack>

        {FOOTER_COLUMNS.map(column => (
          <Stack key={column.title} gap="xs">
            <Text fw={600} size="sm">
              {column.title}
            </Text>
            {column.items.map(item => (
              <Text key={item} c="dimmed" size="sm">
                {item}
              </Text>
            ))}
          </Stack>
        ))}
      </SimpleGrid>

      <Divider my="lg" />
      <Group justify="space-between" gap="xs">
        <Text c="dimmed" size="xs">
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </Text>
        <Text c="dimmed" size="xs">
          Files are processed in your browser and never uploaded.
        </Text>
      </Group>
    </Container>
  </Box>
);

export default Footer;
