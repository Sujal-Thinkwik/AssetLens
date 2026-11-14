import { memo } from 'react';
import { Box } from '@mantine/core';
import type { MantineStyleProps } from '@mantine/core';
import styles from '@/components/home/Home.module.css';

type RingGroup = {
  position: Pick<MantineStyleProps, 'top' | 'left' | 'right'>;
  size: number;
  duration: number;
  delay: number;
};

// Different durations and delays keep the corners from pulsing in sync.
const RING_GROUPS: RingGroup[] = [
  { position: { top: -150, left: -150 }, size: 360, duration: 7, delay: 0 },
  { position: { top: -110, right: -110 }, size: 300, duration: 9, delay: 1.5 },
  { position: { top: '44%', left: -130 }, size: 280, duration: 8, delay: 3 },
  { position: { top: '62%', right: -150 }, size: 340, duration: 10, delay: 4.5 }
];

const RING_COUNT = 4;

const CornerRings = () => (
  <Box pos="absolute" inset={0} aria-hidden="true" style={{ zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
    {RING_GROUPS.map(({ position, size, duration, delay }) => (
      <Box
        key={`${String(position.top)}-${String(position.left ?? position.right)}`}
        pos="absolute"
        w={size}
        h={size}
        maw="70vw"
        mah="70vw"
        {...position}
        style={{ '--duration': `${duration}s`, '--delay': `${delay}s` }}
      >
        {Array.from({ length: RING_COUNT }, (_, i) => (
          <Box
            key={i}
            component="span"
            pos="absolute"
            inset={`${i * 13}%`}
            bd="2px solid primary.5"
            bdrs="50%"
            opacity={0.16}
            className={styles.ring}
            style={{ '--i': i }}
          />
        ))}
      </Box>
    ))}
  </Box>
);

export default memo(CornerRings);
