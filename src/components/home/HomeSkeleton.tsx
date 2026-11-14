import { Card, Group, SimpleGrid, Skeleton, Stack } from '@mantine/core';

const HeroSkeleton = () => (
  <Stack gap="md" align="center" maw={760} mx="auto" w="100%">
    <Skeleton h={30} w={210} radius="xl" />
    <Skeleton h={36} w="90%" radius="md" />
    <Skeleton h={36} w="60%" radius="md" />
    <Stack gap={8} w="100%" mt={4}>
      <Skeleton h={14} radius="sm" />
      <Skeleton h={14} radius="sm" />
      <Skeleton h={14} w="70%" mx="auto" radius="sm" />
    </Stack>
    <Group gap="xs" justify="center">
      {Array.from({ length: 8 }, (_, i) => (
        <Skeleton key={i} h={24} w={80 + (i % 3) * 14} radius="xl" />
      ))}
    </Group>
  </Stack>
);

const DropzoneSkeleton = () => (
  <Card withBorder radius="xl" p={{ base: 'lg', sm: 'xl' }}>
    <Stack align="center" gap="md" mih={180} justify="center">
      <Skeleton circle h={72} w={72} />
      <Skeleton h={22} w="min(420px, 80%)" radius="md" />
      <Skeleton h={14} w="min(220px, 50%)" radius="sm" />
      <Group gap="xs" justify="center">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} h={22} w={48} radius="sm" />
        ))}
      </Group>
    </Stack>
  </Card>
);

const HowItWorksSkeleton = () => (
  <Stack gap="lg">
    <Stack gap={8} align="center">
      <Skeleton h={30} w={200} radius="md" />
      <Skeleton h={14} w="min(420px, 80%)" radius="sm" />
    </Stack>
    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
      {Array.from({ length: 3 }, (_, i) => (
        <Card key={i} withBorder radius="lg" p="md">
          <Skeleton h={180} radius="md" />
          <Skeleton h={20} w="70%" radius="sm" mt="md" />
          <Skeleton h={12} radius="sm" mt={10} />
          <Skeleton h={12} radius="sm" mt={8} />
          <Skeleton h={12} w="60%" radius="sm" mt={8} />
        </Card>
      ))}
    </SimpleGrid>
  </Stack>
);

const HighlightsSkeleton = () => (
  <Stack gap="lg">
    {Array.from({ length: 2 }, (_, i) => (
      <Card key={i} withBorder radius="lg" p={{ base: 'md', sm: 'xl' }}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" style={{ alignItems: 'center' }}>
          <Skeleton h={260} radius="md" />
          <Stack gap="sm">
            <Skeleton h={26} w="80%" radius="md" />
            <Skeleton h={14} radius="sm" />
            <Skeleton h={14} w="85%" radius="sm" />
            <Stack gap={10} mt="xs">
              {Array.from({ length: 4 }, (_, k) => (
                <Group key={k} gap="xs" wrap="nowrap">
                  <Skeleton circle h={20} w={20} />
                  <Skeleton h={12} w={`${90 - k * 10}%`} radius="sm" />
                </Group>
              ))}
            </Stack>
          </Stack>
        </SimpleGrid>
      </Card>
    ))}
  </Stack>
);

const HomeSkeleton = () => (
  <Stack gap={64} aria-busy="true" aria-label="Loading">
    <Stack gap="xl">
      <HeroSkeleton />
      <DropzoneSkeleton />
    </Stack>
    <HowItWorksSkeleton />
    <HighlightsSkeleton />
  </Stack>
);

export default HomeSkeleton;
