import { useEffect } from 'react';

export const useTrackOpen = (tracker: () => void) => {
  useEffect(() => {
    tracker();
    // only run once, deps array is intentionally empty
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
