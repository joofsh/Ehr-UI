export default {
  titleize(string) {
    if (!string) {
      return;
    }

    return string.split('_').map(_string => {
      return this.capitalize(_string);
    }).join(' ');
  },
  capitalize(string) {
    if (!string) {
      return;
    }

    return string.charAt(0).toUpperCase() + string.slice(1);
  }
};
