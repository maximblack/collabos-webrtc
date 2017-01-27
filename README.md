# collabos-webrtc

How to start the project:

 * Install dependencies using ``` yarn  ``` or ``` npm install ```
 * Edit ``` config/index.js ``` to set default host and port
 * Start the api server using: ``` yarn server ```
 * Start the development frontend using webpack: ``` yarn dev  ```
 * Access page through your browser ``` http://host:port```

How to use it:

* Login in 2 different tabs or browsers, or pc's with different login names
* All participants will appear in list
* Call, Answer, Reject, Destroy  each other requests

Gotchas:

 * The login is fake, so just write in dummy login and password
 * The tests are absent, cause basically, entire application is browser dependent and the global ``` navigator.getUserMedia ``` is not availble on node

Future plans:

* Add nightwatch (selenium) tests
* Add MongoDB or other database, and do the login part using JWT or sessions
* Try different WebRTC library
* Add support for building and minifying all source code

Libraries, features used:

* React
* peer.js
* isomorphic-fetch
* Webpack 
* styled-components
* express
