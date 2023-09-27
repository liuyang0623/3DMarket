const localforage = window.parent.localforage;
function setCache(key, value) {
  localforage
    .setItem(key, value)
    .then(function () {
      console.log(key, "cache 缓存成功");
    })
    .catch(function (err) {
      // 当出错时，此处代码运行
      console.log(err);
    });
}
function getCache(key) {
  return localforage
    .getItem(key)
    .then(function (value) {
      // 当离线仓库中的值被载入时，此处代码运行
      return value;
    })
    .catch(function (err) {
      // 当出错时，此处代码运行
      console.log(err);
    });
}
function removeCache(key) {
  localforage
    .removeItem(key)
    .then(function () {
      // 当值被移除后，此处代码运行
      console.log(key, "cache is cleared!");
    })
    .catch(function (err) {
      // 当出错时，此处代码运行
      console.log(err);
    });
}
