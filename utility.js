module.exports = {
  createShortcode: (shortcode, url) => {
    const date = new Date();
    const createdAt = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} ${date.getHours()}:${
      date.getMinutes() < 10 ? "0" : ""
    }${date.getMinutes()}`;

    return {
      shortcode,
      url,
      createdAt,
      lastAccess: "",
      counter: 0,
    };
  },
  updateShortcode: (shortcode) => {
    const date = new Date();
    const lastAccess = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()} ${date.getHours()}:${
      date.getMinutes() < 10 ? "0" : ""
    }${date.getMinutes()}`;

    return {
      ...shortcode,
      lastAccess: lastAccess,
      counter: shortcode.counter + 1,
    };
  },
};
