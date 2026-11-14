import { memo } from 'react';
import { Group, Paper, SimpleGrid, Text, ThemeIcon } from '@mantine/core';
import { FiCheck, FiMinus } from 'react-icons/fi';
import { FieldCoverage } from '@/components/home/columnDetails.helpers';

const FieldCoverageGrid = ({ coverage }: { coverage: FieldCoverage[] }) => (
  <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} spacing="xs">
    {coverage.map(({ key, label, sources }) => {
      const found = sources.length > 0;
      return (
        <Paper key={key} withBorder radius="md" p="xs">
          <Group gap="xs" wrap="nowrap" align="flex-start">
            <ThemeIcon size="sm" radius="xl" variant="light" color={found ? 'green' : 'gray'}>
              {found ? <FiCheck size={12} /> : <FiMinus size={12} />}
            </ThemeIcon>
            <div style={{ minWidth: 0 }}>
              <Text size="sm" fw={600}>
                {label}
              </Text>
              <Text size="xs" c="dimmed" truncate title={sources.join(', ')}>
                {found ? sources.join(', ') : 'Not found'}
              </Text>
            </div>
          </Group>
        </Paper>
      );
    })}
  </SimpleGrid>
);

export default memo(FieldCoverageGrid);
