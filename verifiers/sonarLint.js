#!/usr/bin/env node
// NOTE: this file may need to be made executable, e.g.
// `chmod +x sonarLintVerifier.js`


// required for command line operations 
const fs = require('fs')
const path = require('path')
const shell = require('shelljs')

// For bash's `exit`
const PASS = 0
const FAIL = 1

// For bash's output
const foregroundMagenta = '\x1b[35m'
const foregroundRed = '\x1b[31m'
const foregroundGreen = '\x1b[32m'
const foregroundWhite = '\x1b[37m'

// The default sonarlint issue types that will trigger a fail
const defaultFailOnArr = ['major', 'critical']

// The default commandLineArgs passed into each sonarlint call
// can be set up multiple runs to explicitely test specific directories
// or _using glob pattern matching_ be used to exclude specific directories
// REFACTOR: currently _ONLY_ these default lintConfigs are used,
//           add a way that additional/alternative configs could be passed in
const defaultLintConfigs = [
  // '--src "src/**"',
  // '--src "src/**" --tests "{test/**,**.test.js}"', 
  '--exclude "{*-disregard,node_modules}/**"  --tests "{test/**,**.test.js}"'
]

/*
    Note the following script can be used in one of three ways.
    
    wasInvocatedBy() OR selfInvocation:
    Called from the command line without parameters, or via the `selfInvocation`
    function, this script will:
      1. create an empty log file 
      2. run sonarlint against the calling directory's 'test/**' files
      3. verify with the results pass or fail, based on the failOnArr
      4. report the results
      5. delete the log file
      6. repeat the previous steps for the 'src/**' directory
    
    wasInvocatedBy(reportFile, evaluationDir):
    Called from the command line with 2 parameters, this script will:
      1. verify whether the reportFile passes or fails, based on the failOnArr
      2. report the results
      3. delete the log file
      
    verify({params obj}):
    When imported and the `verify` function called, this script will:
      1. verify whether the reportFile passes or fails, based on the failOnArr
      
 */
function main (argv) {
  // determine if the node file explicitely called to run is this script file
  // return if it was not explicitly called with this script's filename
  const scriptFileName = path.basename(__filename)
  let result = false
  

  // determine if there are two parameters were passed into the node call
  // TECH DEBT
  // was based on process.argv, when switch to standard params, 
  // the first two argv params aren't passed
  // needs to be cleaned up and tested accordingly
  if (argv !== undefined && argv.length === 4) {
    
    console.log('\n\n\n-----evaluateLogReport STARTING-----', result)
    // if so, use them to evaluate the existing log report
    // set reportFile name
    const reportFile = argv[2]
    // set the directory that was actually evaluated by sonarlint
    const evaluationDir = argv[3]
    // if there were additional parameters, then *_ASSUME_* 
    // it was called with reportFile & evaluation directory parameters
    result = evaluateLogReport(reportFile, evaluationDir)
  }
  else {
    // if not, this script is in charge of determining them
    result = selfInvocation(argv)
  }
  return (result === true ? process.exit(PASS) : process.exit(FAIL) )
}
  
function selfInvocation (lintConfigs = defaultLintConfigs) {
  const logFile = mkLogFile()
  // TECH DEBT?
  // if a str is passed in, convert it to an array
  if (!Array.isArray(lintConfigs)) {
    lintConfigs = [lintConfigs]
  }
  return lintConfigs.every( args => {
    runSonarLint({logFile, commandLineArgs:args})
    return evaluateLogReport(logFile, args)
  })
}

function mkLogFile () {
  const now = new Date().valueOf()
  const logPath = 'logs/sonarlint'
  const logFile = logPath + '/' + now + '.txt'
  
  shell.mkdir('-p', logPath)
  
  return logFile
}

function runSonarLint ({ logFile, commandLineArgs }) {
  const cmd = `sonarLint ${commandLineArgs} > ${logFile}`
  shell.exec(cmd)
}

function evaluateLogReport (reportFile, evaluationDir) {
  // save the report text contents to reportData
  const reportData = fs.readFileSync(reportFile, 'utf8')
  // delete the report's sonarlintlog file
  fs.unlink(reportFile)
  // run the verification check, returning its results
  return verify({report: reportData, evaluationDir})
}

function verify ({report, failOnArr, evaluationDir}) {
  // should be able to use default parameter for failOnArr, e.g.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters
  // alas it isn't working, therefore falling back to a ternary assignment
  failOnArr = failOnArr ? failOnArr : defaultFailOnArr
  console.log(foregroundMagenta, '\nSonarLint Verifing:', evaluationDir)
  
  // fail if an actual SonarLint Evaluation was not completed
  if (!report.includes('SonarLint Report')) {
    return fail(report)
  }
  // iterate through each issue type and see if it's in the report
  let checks = failOnArr.length - 1
  while (checks) {
    if (report.includes(failOnArr[checks])) {
      return fail(report)
    }
    checks--
  }
  return pass()
}

function pass() {
  // construct really dry SonarLint pass message
  console.log(foregroundGreen, '\npassed sonarlint verification\n')
  console.log(foregroundWhite)
  // return something to bash script that doesn't trigger a fail
  return true
}

function fail(report) {
  // construct really obvious SonarLint fail message
  const border = '\n‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️‼️\n'
  const padding = '‼️                                    ‼️'
  const txt = '\n‼️    FAILED SonarLint verification   ‼️\n'
  console.log(foregroundRed, border + padding + txt + padding + border)
  console.log(foregroundWhite, '\n' + report)
  // return trigger to halt bash script
  return false
}


// export to allow testing of what can be tested
/* TECH DEBT
   - make sure exported functions can be called 
   - document testing methods
*/
module.exports = { verify, selfInvocation, main }
