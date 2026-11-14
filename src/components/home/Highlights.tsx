import { Card, Image, List, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { FiCheck } from 'react-icons/fi';
import { HIGHLIGHTS } from '@/components/home/content';
import styles from '@/components/home/Home.module.css';

const Highlights = () => (
  <Stack gap="lg">
    {HIGHLIGHTS.map((item, index) => (
      <Card key={item.title} withBorder radius="lg" p={{ base: 'md', sm: 'xl' }} className={styles.card}>
        <SimpleGrid
          cols={{ base: 1, md: 2 }}
          spacing="xl"
          className={index % 2 === 1 ? styles.reverse : undefined}
          style={{ alignItems: 'center' }}
        >
          <Image src={item.image} alt="" radius="md" />
          <Stack gap="sm">
            <Title order={3}>{item.title}</Title>
            <Text c="dimmed">{item.text}</Text>
            <List
              spacing="xs"
              size="sm"
              icon={
                <ThemeIcon size={20} radius="xl" variant="light">
                  <FiCheck size={12} />
                </ThemeIcon>
              }
            >
              {item.points.map(point => (
                <List.Item key={point}>{point}</List.Item>
              ))}
            </List>
          </Stack>
        </SimpleGrid>
      </Card>
    ))}
  </Stack>
);

export default Highlights;
