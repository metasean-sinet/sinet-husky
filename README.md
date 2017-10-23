# Sinet-Husky

This is a repo for any git hook related scripts that uses [Husky](https://github.com/typicode/husky) to trigger the appropriate hook based on the parent repo's scripts (e.g. the `precommit` script will be triggered when `git commit` is called on the repo).

## Basic Usage

### Local Machine Set-up
1. Ensure [SonarLint for Command Line](http://www.sonarlint.org/commandline/) is installed and running.

### Repository Set-up
1. npm/yarn install this project as a `"dependency"`, e.g.:  
   `npm install @sinet/sinet-husky --save`
2. npm/yarn install the "husky" module as a `"dependency"`, e.g.:  
   `npm install husky --save`
3. In the main repo's package.json `"scripts"` section add a precommit command:
    - to use the default SonarLint flags, add
      ```
      "precommit": "node ./node_modules/sinet-husky/index.js"
      ```
    - to pass in an alternate SonarLint flag(s), add a precommit with the desired SonarLint flag(s) in single quotes and any embedded double-quotes escaped:
      ```
      "precommit": "node ./node_modules/sinet-husky/index.js '--exclude \"{*-disregard,node_modules}/**\"  --tests \"{test/**,**.test.js}\"'"
      ```
4. In the main repo's `.gitignore` file, ensure there are the following two entries:
  ```
  .sonarlint/*
  logs
  ```
  
### Git Actions
1. Use your standard git cli commands.  
2. Review all console feedback.
3. Correct any verification failures.

---  

#### IMPORTANT NOTES:  

- If you receive an error to the effect of:   
  >  WARNING: An illegal reflective access operation has occurred  
  >  WARNING: Illegal reflective access by net.sf.cglib.core.ReflectUtils$2 (file:/Users/sean/.sonarlint/plugins/6aaf90cf227aaadd21b1aed535c8ada7/sonar-javascript-plugin-2.18.0.3454.jar) to method java.lang.ClassLoader.defineClass(java.lang.String,byte[],int,int,java.security.ProtectionDomain)  
  >WARNING: Please consider reporting this to the maintainers of net.sf.cglib.core.ReflectUtils$2  
  > WARNING: Use --illegal-access=warn to enable warnings of further illegal reflective   
  > WARNING: All illegal access operations will be denied in a future release  

  Ignore it.  This is a [known Java 9 issue](https://github.com/jqno/equalsverifier/issues/172).
  
  
  ---