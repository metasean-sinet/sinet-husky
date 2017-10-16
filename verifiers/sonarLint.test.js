var sonarLint = require('./sonarLint.js')


const cleanReport = `-------------  SonarLint Report  -------------

  No issues to display (1 file analyzed)

-------------------------------------------`
// {report, failOnArr, evaluationDir}
console.assert(sonarLint.verify({report: cleanReport}) == true)


const criticalAndMajor = `-------------  SonarLint Report  -------------

         67 issues (218 files analyzed)

         39 critical
          20 major
          2 minor
          6 info

-------------------------------------------`
console.assert(sonarLint.verify({report: criticalAndMajor}) == false)

const major = `-------------  SonarLint Report  -------------

         67 issues (218 files analyzed)
         
          20 major
          2 minor
          6 info

-------------------------------------------`
console.assert(sonarLint.verify({report: major, failOnArr: ['critical']}) == true)