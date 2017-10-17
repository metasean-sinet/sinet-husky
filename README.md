# Sinet-Husky

This is a repo for any git hook related scripts.

## Basic Usage

### Local Machine Set-up
1. Ensure [SonarLint for Command Line](http://www.sonarlint.org/commandline/) is installed and running.

### Repository Set-up
1. npm/yarn install this project.
2. In the main repo's package.json `"scripts"` section add:
  ```
  "precommit": "node ./node_modules/sinet-husky/index.js"
  ```
3. In the main repo's `.gitignore` file, ensure there are the following two entries:
  ```
  .sonarlint/*
  logs
  ```
  
### Git Actions
1. Use your standard git cli commands.  
2. Correct any verification failures as indicated via the command line feedback.