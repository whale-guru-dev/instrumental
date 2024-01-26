export const handleErr = async (
  f: () => Promise<any>,
  retryCount?: number,
): Promise<any> => {
  if (!retryCount) {
    retryCount = 0;
  }
  try {
    const ret = await f();
    return ret;
  } catch (error) {
    retryCount++;
    if (retryCount < 5) {
      return handleErr(f, retryCount);
    } else {
      throw error;
    }
  }
};
