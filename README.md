# electron-window-service

The Electron Window Service, which runs in the main process, facilitates creating, managing, and communicating between Electron windows, including sharing state. Please note that while I intend to now use this service within Angular Electron applications, this example usage of the service is bare bones for simplicity.

This is my first public repo. I look forward to any and all input from the community.


## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/electron/electron-quick-start
# Go into the repository
cd electron-quick-start
# Install dependencies
npm install
```
## Note for VS Code users
To build this project, after running npm install, please run the copy task (gulp copy) to create and copy the html file to the dist directory. Then, select launch to build and run the project. I'm sure there is a way to make this all one step in VS Code, any input would be appreciated.

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## Resources for Learning Electron

- [electron.atom.io/docs](http://electron.atom.io/docs) - all of Electron's documentation
- [electron.atom.io/community/#boilerplates](http://electron.atom.io/community/#boilerplates) - sample starter apps created by the community
- [electron/electron-quick-start](https://github.com/electron/electron-quick-start) - a very basic starter Electron app
- [electron/simple-samples](https://github.com/electron/simple-samples) - small applications with ideas for taking them further
- [electron/electron-api-demos](https://github.com/electron/electron-api-demos) - an Electron app that teaches you how to use Electron
- [hokein/electron-sample-apps](https://github.com/hokein/electron-sample-apps) - small demo apps for the various Electron APIs

## License

[MIT](LICENSE.md)

## Work in Progress
This code is raw, just written and pushed. I intend to use it within Electron Angular applications. It was inspired by electron-windows-manager but bypasses ipcMain/ipcRenderer communication. Communication between windows is instead managed by the WindowService, which runs in the main process, and manages an array of instantiated windows. Each window is repressented by a model class with observables for messages, state, and shared state. Any window may be addressed, and it's state subscribed to, from any other window and the main process. Each window model also contains the original BrowserWindow created by Electron. 

This demo is purposely simple in terms of the app's implementation. I use no other frameworks like Angular for the UI. This is prurely to test the service. I will post an example app that uses Angular within Electron, and this service, as soon as I have on together.

This is my first public repo. I look forward to and welcome any an all feed back. Thanks!  
