import { Alert, Card, Group, Stack, Text, Title } from '@mantine/core';
import { FiAlertCircle } from 'react-icons/fi';
import AssetTable from '@/components/home/asset-table';
import ColumnDetails from '@/components/home/column-details';
import CornerRings from '@/components/home/corner-rings';
import HeroSection from '@/components/home/hero-section';
import Highlights from '@/components/home/highlights';
import HowItWorks from '@/components/home/how-it-works';
import UploadDropzone from '@/components/home/upload-dropzone';
import { useAssetImport } from '@/components/home/useAssetImport';
import styles from '@/components/home/Home.module.css';

const HomeIndex = () => {
  const { loading, error, fileName, result, handleDrop, handleReject, clearError } = useAssetImport();
  const hasRows = !!result && result.rows.length > 0;

  return (
    <>
      <CornerRings />
      <Stack gap={64} className={styles.content}>
        <Stack gap="xl">
          <HeroSection />
          <UploadDropzone loading={loading} fileName={fileName} onDrop={handleDrop} onReject={handleReject} />
          {error && (
            <Alert color="red" icon={<FiAlertCircle />} withCloseButton onClose={clearError}>
              {error}
            </Alert>
          )}
        </Stack>

        {hasRows && (
          <Stack gap="lg">
            <Card withBorder p="xl" radius="lg">
              <Group justify="space-between" mb="sm">
                <Title order={3}>Extracted assets</Title>
                <Text c="dimmed" size="sm" truncate='end'>
                  {fileName} · {result.rows.length} rows · {result.sheets.length} sheet
                  {result.sheets.length === 1 ? '' : 's'}
                </Text>
              </Group>
              <AssetTable
                rows={result.rows}
                extraColumns={result.extraColumns}
                multipleSheets={result.sheets.length > 1}
              />
            </Card>

            <Card withBorder p='xl' radius="lg">
              <Title order={3} mb="sm">
                Column details
              </Title>
              <Stack gap="lg">
                {result.sheets.map(sheet => (
                  <ColumnDetails key={sheet.name} sheet={sheet} />
                ))}
              </Stack>
            </Card>
          </Stack>
        )}

        <HowItWorks />
        <Highlights />
      </Stack>
    </>
  );
};

export default HomeIndex;
