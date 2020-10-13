# Project Title

the back-end of a mulu test project using Node.js

---
## Requirements

For development, you will only need Node.js and a node global packages installed in your environement.

## About the project

The project is using Node.js v12 to build a simple backend according to the provided requirements and specifications. It also uses MongoDB to fetch Agents and Contacts that stored there. "zipcode-city-distance" module is used to get location data and calculate the distance between 2 zip codes.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v12.11.1

    $ npm --version
    6.11.3

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g


    $ git clone https://github.com/gl-man/mulu_backend.git
    $ cd mulu_backend
    $ npm install

## Running the project

    $ node app.js
