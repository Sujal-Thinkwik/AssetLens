import { Stack } from '@mantine/core';
import CornerRings from '@/components/home/CornerRings';
import HeroSection from '@/components/home/HeroSection';
import UploadDropzone from '@/components/home/UploadDropzone';
import styles from '@/components/home/Home.module.css';
import HowItWorks from './HowItWorks';
import Highlights from './Highlights';

const noop = () => undefined;

const HomeIndex = () => (
  <>
    <CornerRings />
    <Stack gap="xl" className={styles.content}>
      <HeroSection />
      <UploadDropzone loading={false} fileName="" onDrop={noop} onReject={noop} />
      <HowItWorks />
      <Highlights />
    </Stack>
  </>
);

export default HomeIndex;
