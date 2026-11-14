import { useEffect } from 'react';
import { ActionIcon, Affix, Transition } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import { FiArrowUp } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

const SHOW_AFTER_PX = 300;

const scrollToTop = (): void => window.scrollTo({ top: 0, behavior: 'smooth' });

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [scroll] = useWindowScroll();

  useEffect(() => {
    scrollToTop();
  }, [pathname]);

  return (
    <Affix position={{ bottom: 24, right: 24 }}>
      <Transition transition="slide-up" mounted={scroll.y > SHOW_AFTER_PX}>
        {transitionStyles => (
          <ActionIcon
            size="xl"
            radius="xl"
            variant="filled"
            style={transitionStyles}
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            title="Back to top"
          >
            <FiArrowUp size={20} />
          </ActionIcon>
        )}
      </Transition>
    </Affix>
  );
};

export default ScrollToTop;
