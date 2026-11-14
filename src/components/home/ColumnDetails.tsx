import { memo, useMemo } from 'react';
import { Badge, Group, Paper, Stack, Text, Tooltip } from '@mantine/core';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { FiAlertTriangle, FiMinus, FiType, FiZap } from 'react-icons/fi';
import { ColumnDetail, SheetResult } from '@/utils/assetParser';
import FieldCoverageGrid from '@/components/home/FieldCoverageGrid';
import { METHOD_META, buildCoverage, fieldLabel } from '@/components/home/columnDetails.helpers';

const METHOD_ICON = {
  header: <FiType size={12} />,
  content: <FiZap size={12} />,
  none: <FiMinus size={12} />
} as const;

const COLUMNS: DataTableColumn<ColumnDetail>[] = [
  {
    accessor: 'letter',
    title: 'Col',
    width: 70,
    render: col => (
      <Badge variant="outline" color="gray" radius="sm">
        {col.letter}
      </Badge>
    )
  },
  { accessor: 'name', title: 'Source column', render: col => <Text size="sm">{col.name}</Text> },
  {
    accessor: 'field',
    title: 'Mapped to',
    render: col =>
      col.field ? (
        <Badge variant="filled">{fieldLabel(col.field)}</Badge>
      ) : (
        <Text c="dimmed" size="sm">
          —
        </Text>
      )
  },
  {
    accessor: 'method',
    title: 'Detection',
    render: col => {
      const { text, color, hint } = METHOD_META[col.method];
      return (
        <Tooltip label={hint} withArrow>
          <Badge color={color} variant="light" leftSection={METHOD_ICON[col.method]}>
            {text}
          </Badge>
        </Tooltip>
      );
    }
  },
  {
    accessor: 'samples',
    title: 'Sample values',
    render: col => (
      <Text size="sm" c="dimmed" lineClamp={1} title={col.samples.join(' · ')}>
        {col.samples.join(' · ') || '—'}
      </Text>
    )
  }
];

const ColumnDetails = ({ sheet }: { sheet: SheetResult }) => {
  const coverage = useMemo(() => buildCoverage(sheet.columns), [sheet.columns]);

  return (
    <Paper withBorder radius="md" p="md">
      <Stack gap="md">
        <Group gap="xs">
          <Text fw={600}>{sheet.name}</Text>
          <Badge variant="light">{sheet.rowCount} assets</Badge>
          <Badge variant="light" color="gray">
            {sheet.headerRow ? `Header on row ${sheet.headerRow}` : 'No header row detected'}
          </Badge>
          {sheet.note && (
            <Badge color="orange" variant="light" leftSection={<FiAlertTriangle size={12} />}>
              {sheet.note}
            </Badge>
          )}
        </Group>

        {sheet.columns.length > 0 && (
          <>
            <FieldCoverageGrid coverage={coverage} />
            <DataTable<ColumnDetail>
              withTableBorder
              striped
              records={sheet.columns}
              idAccessor="index"
              columns={COLUMNS}
            />
          </>
        )}
      </Stack>
    </Paper>
  );
};

export default memo(ColumnDetails);
