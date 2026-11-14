import { lazy, Suspense } from 'react';
import HomeSkeleton from '@/components/home/home-skeleton';

const HomeIndex = lazy(() => import('@/components/home'));

const HomePage = () => (
  <Suspense fallback={<HomeSkeleton />}>
    <HomeIndex />
  </Suspense>
);

export default HomePage;
