let y = 42 // never changed, should be const

const x = y
while (x === 42) {
  // always true condition
  console.log('round and round we go')
  if (x > 42) {
    // always false condition
    console.log('should error')
  }
}

// https://github.com/SonarSource/SonarJS/blob/master/javascript-checks/src/test/resources/checks/AlertUse.js
// should fail
alert('blah')

function doubleReturn() {
  return true
  // return false // unreachable code
}
doubleReturn()
