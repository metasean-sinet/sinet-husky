var sonarLint = require('./verifiers/sonarLint.js')

/* 
  TECH DEBT: 

   The first process.argv param is assumed to be SonarLint flags.
   This is a bad assumption to make!
   Add yarg? and then can pass as a flagged param?
   Maybe set-up a sinet-husky config file and pull it from there?
   Review and implement best option.
*/
   

/* Explicitely pass SonarLint flags through */
// sonarLint.main(['--exclude "{*-disregard,node_modules}/**" --tests "{test/**,**.test.js}"'])

/* Implicitely pass SonarLint flags through from a previous call, 
   i.e.package.json */
sonarLint.main(process.argv[2])