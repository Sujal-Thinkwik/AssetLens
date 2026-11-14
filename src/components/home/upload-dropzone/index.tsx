import { Badge, Group, Stack, Text, ThemeIcon } from '@mantine/core';
import { Dropzone, FileRejection } from '@mantine/dropzone';
import { FiCheckCircle, FiUploadCloud, FiX } from 'react-icons/fi';
import styles from '@/components/home/Home.module.css';

const ACCEPT = {
  'text/csv': ['.csv'],
  'text/tab-separated-values': ['.tsv'],
  'application/vnd.ms-excel': ['.xls', '.csv'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/vnd.ms-excel.sheet.macroEnabled.12': ['.xlsm']
};

const MAX_SIZE_MB = 20;
const FORMATS = ['.xlsx', '.xls', '.csv', '.tsv'];

interface Props {
  loading: boolean;
  fileName: string;
  onDrop: (files: File[]) => void;
  onReject: (rejections: FileRejection[]) => void;
}

const UploadDropzone = ({ loading, fileName, onDrop, onReject }: Props) => (
  <Dropzone
    onDrop={onDrop}
    onReject={onReject}
    accept={ACCEPT}
    maxSize={MAX_SIZE_MB * 1024 * 1024}
    multiple={false}
    loading={loading}
    className={styles.dropzone}
    radius="xl"
    p={{ base: 'lg', sm: 'xl' }}
  >
    <Stack align="center" gap="md" mih={180} justify="center" ta="center" style={{ pointerEvents: 'none' }}>
      <ThemeIcon
        size={72}
        radius="xl"
        variant="gradient"
        gradient={{ from: 'primary.4', to: 'primary.7', deg: 135 }}
        style={{ boxShadow: '0 0 0 8px light-dark(var(--mantine-color-primary-1), rgb(124 92 250 / 20%))' }}
      >
        <Dropzone.Accept>
          <FiCheckCircle size={34} />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <FiX size={34} />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <FiUploadCloud size={34} />
        </Dropzone.Idle>
      </ThemeIcon>

      <div>
        <Text fw={700} fz={{ base: 'lg', sm: 'xl' }}>
          <Dropzone.Accept>Drop the file to import it</Dropzone.Accept>
          <Dropzone.Reject>This file type is not supported</Dropzone.Reject>
          <Dropzone.Idle>Drag your spreadsheet here, or click to browse</Dropzone.Idle>
        </Text>
        <Text c="dimmed" size="sm" mt={4}>
          Up to {MAX_SIZE_MB} MB. Multiple sheets are supported.
        </Text>
      </div>

      <Group gap="xs" justify="center">
        {FORMATS.map(format => (
          <Badge key={format} variant="light" radius="sm">
            {format}
          </Badge>
        ))}
      </Group>

      {fileName && (
        <Text size="sm" c="dimmed" maw='100%' truncate='end'>
          Last imported: <Text span fw={600} c="var(--mantine-color-text)">{fileName}</Text>
        </Text>
      )}
    </Stack>
  </Dropzone>
);

export default UploadDropzone;
