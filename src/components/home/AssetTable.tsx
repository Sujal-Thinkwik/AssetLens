import { useCallback, useMemo, useState } from 'react';
import { Text } from '@mantine/core';
import {
  DataTable,
  DataTableColumn,
  DataTableSortStatus
} from 'mantine-datatable';
import { ASSET_FIELDS, AssetRow } from '@/utils/assetParser';
import AssetTableToolbar from '@/components/home/AssetTableToolbar';
import {
  DEFAULT_PAGE_SIZE,
  PAGE_SIZES,
  TableRecord,
  buildRecords,
  extraKey,
  filterRecords,
  sortRecords
} from '@/components/home/assetTable.helpers';

interface Props {
  rows: AssetRow[];
  extraColumns: string[];
  multipleSheets: boolean;
}

const dash = (value: string | number | undefined) =>
  value === undefined || value === '' ? (
    <Text span c="dimmed">
      —
    </Text>
  ) : (
    String(value)
  );

const AssetTable = ({ rows, extraColumns, multipleSheets }: Props) => {
  const [query, setQuery] = useState('');
  const [showExtras, setShowExtras] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortStatus, setSortStatus] = useState<
    DataTableSortStatus<TableRecord>
  >({
    columnAccessor: 'rowNumber',
    direction: 'asc'
  });

  const records = useMemo(
    () => buildRecords(rows, extraColumns),
    [rows, extraColumns]
  );

  const visible = useMemo(
    () =>
      sortRecords(
        filterRecords(records, query),
        String(sortStatus.columnAccessor),
        sortStatus.direction
      ),
    [records, query, sortStatus]
  );

  const pageRecords = useMemo(
    () => visible.slice((page - 1) * pageSize, page * pageSize),
    [visible, page, pageSize]
  );

  const columns = useMemo<DataTableColumn<TableRecord>[]>(
    () => [
      ...(multipleSheets
        ? [
            {
              accessor: 'sheet',
              title: 'Sheet',
              sortable: true,
              textAlign: 'center',
              width: 150,
            } as DataTableColumn<TableRecord>
          ]
        : []),
      {
        accessor: 'rowNumber',
        title: 'Row',
        sortable: true,
        width: 100,
        textAlign: 'center'
      },
      ...ASSET_FIELDS.map<DataTableColumn<TableRecord>>(({ key, label }) => ({
        accessor: key,
        title: label,
        sortable: true,
        width: 200,
        render: record => dash(record[key])
      })),
      ...(showExtras
        ? extraColumns.map<DataTableColumn<TableRecord>>((name, i) => ({
            accessor: extraKey(i),
            title: name,
            sortable: true,
            render: record => dash(record[extraKey(i)])
          }))
        : [])
    ],
    [multipleSheets, showExtras, extraColumns]
  );

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    setPage(1);
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(1);
  }, []);

  const handleSortChange = useCallback(
    (status: DataTableSortStatus<TableRecord>) => {
      setSortStatus(status);
      setPage(1);
    },
    []
  );

  return (
    <>
      <AssetTableToolbar
        query={query}
        onQueryChange={handleQueryChange}
        extraCount={extraColumns.length}
        showExtras={showExtras}
        onShowExtrasChange={setShowExtras}
      />

      <DataTable<TableRecord>
        withTableBorder
        striped
        verticalSpacing="md"
        borderRadius="md"
        horizontalSpacing="md"
        highlightOnHover
        minHeight={180}
        records={pageRecords}
        columns={columns}
        totalRecords={visible.length}
        recordsPerPage={pageSize}
        recordsPerPageOptions={PAGE_SIZES}
        onRecordsPerPageChange={handlePageSizeChange}
        recordsPerPageLabel="Records per page"
        paginationText={({ from, to, totalRecords }) => `${from} - ${to} / ${totalRecords}`}
        page={page}
        onPageChange={setPage}
        sortStatus={sortStatus}
        onSortStatusChange={handleSortChange}
        noRecordsText="No matching assets"
      />
    </>
  );
};

export default AssetTable;
