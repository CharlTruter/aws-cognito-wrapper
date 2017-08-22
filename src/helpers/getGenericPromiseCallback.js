export default function getGenericPromiseCallback(resolve, reject) {
  return (error, result) => {
    if (error) {
      return reject(error);
    }

    return resolve(result);
  };
}
