const normalizeId = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (value.id) {
    return value.id.toString();
  }

  if (value._id) {
    return value._id.toString();
  }

  return value.toString();
};

module.exports = {
  normalizeId
};
