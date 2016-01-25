export default {
  titleize: function(string) {
    return string.split('_').map(_string => {
      return this.capitalize(_string);
    }).join(' ');
  },
  capitalize: function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

