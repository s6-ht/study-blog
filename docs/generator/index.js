const fs = require('fs')

const readFileThunk = (filename) => {
  return (callback) => {
    return fs.readFile(filename, callback)
  }
}

// console.log(g.next().value.toString())
// g.next().value((err, data1) => {
//   g.next(data1).value((err, data2) => {
//     g.next(data2)
//   })
// })

function run(gen) {
  const next = (err, data) => {
    let res = gen.next(data)
    if (res.done) return
    res.value(next)
  }
  next()
}

const gen = function*() {
  console.log('enter')
  const data1 = yield readFileThunk('./001.txt')
  console.log(data1.toString())
  const data2 = yield readFileThunk('./002.txt')
  console.log(data2.toString())
}

let g = gen()

const readFilePromise = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  }).then((res) => res)
}

const gen1 = function*() {
  console.log('enter')
  const data1 = yield readFilePromise('./001.txt')
  console.log(data1.toString())
  const data2 = yield readFilePromise('./002.txt')
  console.log(data2.toString())
}

const g1 = gen1()

// getGenPromise(g1).then(data1 => {
//   return getGenPromise(g1, data1);
// }).then(data2 => {
//   return getGenPromise(g1, data2)
// })

function runPromise(gen) {
  const next = (data) => {
    let res = g.next();
    if(res.done) return;
    res.value.then(data => {
      next(data);
    })
  }
  next()
}
runPromise(g1)
