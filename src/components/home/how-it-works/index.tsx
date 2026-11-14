import { Badge, Card, Image, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { STEPS } from '@/components/home/content';
import styles from '@/components/home/Home.module.css';

const HowItWorks = () => (
  <Stack gap="lg">
    <Stack gap={4} ta="center" align="center">
      <Title order={2}>How it works</Title>
      <Text c="dimmed" maw={560}>
        From a raw spreadsheet to a searchable asset list in three steps.
      </Text>
    </Stack>

    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
      {STEPS.map((step, index) => (
        <Card key={step.title} withBorder radius="lg" p="md" className={styles.card}>
          <div style={{ position: 'relative' }}>
            <Image src={step.image} alt="" radius="md" />
            <Badge className={styles.stepNumber} size="lg" circle>
              {index + 1}
            </Badge>
          </div>
          <Title order={4} mt="md">
            {step.title}
          </Title>
          <Text c="dimmed" size="sm" mt={6}>
            {step.text}
          </Text>
        </Card>
      ))}
    </SimpleGrid>
  </Stack>
);

export default HowItWorks;
