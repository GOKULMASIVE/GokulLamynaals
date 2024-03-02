export const OPEN_LOADER = 'OPEN_LOADER';
export const CLOSE_LOADER = 'CLOSE_LOADER';

export const openLoader = () => ({
  type: OPEN_LOADER,
});

export const closeLoader = () => ({
  type: CLOSE_LOADER,
});
