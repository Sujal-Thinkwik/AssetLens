import { Group, Image, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import { images } from '@/assets';
import { APP_NAME } from '@/constants/app';

const Logo = () => (
  <Group renderRoot={props => <Link to="/" {...props} />} gap="xs" wrap="nowrap" td="none" aria-label={`${APP_NAME} home`}>
    <Image src={images.logoMark} alt="" w={34} h={34} radius="md" />
    <Text fw={800} fz="xl" lh={1} c="var(--mantine-color-text)" style={{ letterSpacing: '-0.02em' }}>
      {APP_NAME}
    </Text>
  </Group>
);

export default Logo;
