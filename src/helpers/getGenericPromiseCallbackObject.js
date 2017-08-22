export default function getGenericPromiseCallbackObject(resolve, reject) {
  return {
    onSuccess(data) {
      resolve(data);
    },
    onFailure(err) {
      reject(err);
    },
  };
}
