export const dva = {
  config: {
    onError(e) {
      console.error(e, 'err');
      e.preventDefault();
    },
  },
};
