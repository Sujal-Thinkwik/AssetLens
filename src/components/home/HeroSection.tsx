import { Badge, Group, Stack, Text, Title } from '@mantine/core';
import { ASSET_FIELDS } from '@/utils/assetParser';
import { HERO } from '@/components/home/content';

const HeroSection = () => (
  <Stack gap="md" align="center" ta="center" maw={760} mx="auto">
    <Badge size="lg" variant="light" radius="xl">
      Asset spreadsheet import
    </Badge>
    <Title order={1} fz={{ base: 28, sm: 40 }} lh={1.15}>
      {HERO.title}
    </Title>
    <Text c="dimmed" fz={{ base: 'md', sm: 'lg' }}>
      {HERO.text}
    </Text>
    <Group gap="xs" justify="center">
      {ASSET_FIELDS.map(({ key, label }) => (
        <Badge key={key} variant="outline" color="gray" radius="xl">
          {label}
        </Badge>
      ))}
    </Group>
  </Stack>
);

export default HeroSection;
