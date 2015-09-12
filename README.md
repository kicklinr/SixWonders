# Bootstrapping Bootstrap / Bower / Jade
## Access
1. Clone the github remote: `git clone git@github.com:kicklinr/SixWonders.git`
## Heroku
1. Install heroku toolbelt: `https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up`
2. Make sure you do all the heroku setup stuff, like logging in via the cli
3. Add heroku as a remote: `heroku git:remote -a infinite-meadow-7322`
4. In order to push to heroku, do `git push heroku master`
5. View heroku app here: `https://infinite-meadow-7322.herokuapp.com/`
## Installation:
* Note: If you're using Mac OSX, many of these installs will be easier with [Homebrew]().
1. You're going to need [nodejs](https://nodejs.org/en/download/) installed.
    * Installing with Homebrew: `brew install node`
2. Make sure you have [ruby](https://www.ruby-lang.org/en/documentation/installation/) installed. `ruby -v` will tell you if you have it installed or not.
    * Installing with Homebrew: `brew install ruby`
3. In the project root, run `npm install`
    * This will install gulp and all its dependencies
4. In the project root, run `bower install`
    * This will install Bootstrap and Font Awesome
5. Run the app: `node ./bin/www`
6. If doing frontend stuff, do `gulp` to process sass and js files, `gulp watch` to start a process that will watch for any changes and then run everything.

