const responseWrapper = (_req, res, next) => {
  const originalJson = res.json.bind(res);

  res.json = (body) => {
    // If it's already wrapped, don't wrap it again
    if (body && typeof body === 'object' && Object.prototype.hasOwnProperty.call(body, 'success')) {
      return originalJson(body);
    }

    const isSuccess = res.statusCode < 400;

    // Default message
    let message = isSuccess ? 'OK' : 'Error';

    // Extract message from body if it exists
    if (body && typeof body === 'object' && body.message) {
      message = body.message;
    }

    const response = {
      success: isSuccess,
      message
    };

    if (isSuccess) {
      // For success responses
      let data = body;

      // If body has a 'data' property, use it as the source
      if (body && typeof body === 'object' && Object.prototype.hasOwnProperty.call(body, 'data')) {
        data = body.data;
      }

      // Clean up data if it's an object (remove redundant message)
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        const cleanData = { ...data };
        delete cleanData.message;

        // If there are other properties, use them as data, otherwise null
        response.data = Object.keys(cleanData).length > 0 ? cleanData : null;
      } else {
        response.data = data === undefined ? null : data;
      }
    }

    return originalJson(response);
  };

  next();
};

module.exports = responseWrapper;
