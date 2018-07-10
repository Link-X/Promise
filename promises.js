'use strict'
class Promises {
  constructor(fun) {
    this.value = null
    this.loding = null
    this.status = 'loding'
    this.resolveArr = []
    this.rejectArr = []
    this.resolve = (success) => {
      // 将任务tick进任务队列，让他比then晚执行
      setTimeout(() => {
        this.value = success
        this.status = 'success'
        // this.successFunc(this.success)
        // 执行then接受的函数
        this.resolveArr.forEach(fn => fn(this.value))
      })
    }
    this.reject = (error) => {
      setTimeout(() => {
        this.value = error
        this.status = 'error'
        this.rejectArr.forEach(fn => fn(this.value))
      })
    }
    try {
      fun(this.resolve, this.reject)
    } catch (err) {
      this.reject(err)
    }
  }
  then (success, error) {
    console.log(this.status)
    if (this.status === 'loding') {
      // 将then接受的函数push进队列 等待执行
      if (typeof success === 'function') {
        this.resolveArr.push((val) => {
          success(val)
        })
      }
      if (typeof error === 'function') {
        this.rejectArr.push((val) => {
          error(val)
        })
      }
    } else if (this.status === 'success') {
      success(this.success)
    } else if (this.status = 'error') {
      // error(this.error)
    }
    return this
  }
  catch (error) {
    // 此时 catch只是订阅者，并没有执行任何方法
    if (typeof error === 'function') {
      this.rejectArr.push((val) => {
        error(val)
      })
    }
    return this
  }
}
