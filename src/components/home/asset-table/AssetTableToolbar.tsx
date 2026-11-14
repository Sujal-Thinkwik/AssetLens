import { memo } from 'react';
import { Group, Switch, TextInput } from '@mantine/core';
import { FiSearch } from 'react-icons/fi';

interface Props {
  query: string;
  onQueryChange: (value: string) => void;
  extraCount: number;
  showExtras: boolean;
  onShowExtrasChange: (value: boolean) => void;
}

const AssetTableToolbar = ({ query, onQueryChange, extraCount, showExtras, onShowExtrasChange }: Props) => (
  <Group justify="space-between" mb="sm" wrap="wrap">
    <TextInput
      placeholder="Search all columns"
      aria-label="Search all columns"
      leftSection={<FiSearch size={16} />}
      value={query}
      onChange={event => onQueryChange(event.currentTarget.value)}
      w={{ base: '100%', sm: 280 }}
    />
    {extraCount > 0 && (
      <Switch
        label={`Show ${extraCount} other columns`}
        checked={showExtras}
        onChange={event => onShowExtrasChange(event.currentTarget.checked)}
      />
    )}
  </Group>
);

export default memo(AssetTableToolbar);
