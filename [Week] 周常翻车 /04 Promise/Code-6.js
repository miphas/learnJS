//
// Promise-Code 6
//
// 1. resolve填入promise情况
// 2. 执行出错，会走入reject逻辑
function Promise(executor) {
  this.promiseStatus = 'pending';
  this.promiseValue = undefined;
  this.isPending = () => this.promiseStatus === 'pending';
  // new code-4 
  this.resolveFuncs = [];
  this.rejectFuncs = [];
  this.execCachedFuncs = arr => {
    arr.forEach(fun => fun(this.promiseValue));
    arr.splice(0, arr.length);
  }
  const resolve = (resolvedValue) => {
    // if (resolvedValue instanceof Promise) {
    //   return resolvedValue.then(resolve, reject);
    // }
    if (this.isPending()) {
      this.promiseStatus = 'resolved';
      this.promiseValue = resolvedValue;
      this.execCachedFuncs(this.resolveFuncs);
    }
  }
  const reject = (rejectedValue) => {
    if (this.isPending()) {
      this.promiseStatus = 'rejected';
      this.promiseValue = rejectedValue;
      this.execCachedFuncs(this.rejectFuncs);
    }
  }
  try {
    executor(resolve, reject);
  } catch(e) {
    reject(e);
  }
}
Promise.prototype.then = function(onfulfilled = data => data, onrejected = error => {throw error}) {
  if (this.promiseStatus === 'pending') {
    this.resolveFuncs.push(onfulfilled);
    this.rejectFuncs.push(onrejected);
    return;
  }
  if (this.promiseStatus === 'resolved') {
    setTimeout(() => onfulfilled(this.promiseValue));
  } else {
    setTimeout(() => onrejected(this.promiseValue));
  }
}

// test
let promise = new Promise((resolve, reject) => {
  setTout(() => {
    resolve('data')
  }, 2000)
})

promise.then(data => {
  console.log(data)
}, error => {
  console.log('got error from promise', error)
})