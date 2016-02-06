export default {
  titleize(string) {
    return string.split('_').map(_string => {
      this.capitalize(_string);
    }).join(' ');
  },
  capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
};
