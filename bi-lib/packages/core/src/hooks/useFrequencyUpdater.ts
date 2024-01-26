import { useCallback, useEffect, useState } from "react";

import { defaultEmptyFunction } from "../utils";

export const useFrequencyUpdater = (frequency: number | undefined): boolean => {
  const [renderState, rerenderState] = useState<boolean>(true);
  const forceRerender = useCallback(
    () => rerenderState(value => !value),
    []
  );

  useEffect(
    () => {
      if (frequency !== undefined) {
        const rerenderInterval = setInterval(
          () => forceRerender(),
          frequency
        );

        return () => clearInterval(rerenderInterval);
      } else {
        return defaultEmptyFunction();
      }
    },
    [forceRerender, frequency]
  );

  return renderState;
};