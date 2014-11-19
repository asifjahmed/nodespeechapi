#nodespeechapi

This is a sample app to explore the Web Speech API. Passes speech results to node server via Socket.IO for processing, then results sent back to browser to display text.

Usage
-----

```
npm install
node server.js

browse to https://localhost:8000
```

Notes:
-The Web Speech API requires the user to grant permission every time the speech api is enabled, UNLESS you are connecting via SSL. Therefore, for this sample app I am emulating SSL, and as such there are some SSL files in the './ssl' directory.

If these SSL certs aren't working for you, you can delete them, go the the './ssl' folder in the command line, and then follow the instructions on this site to generate your own:

http://greengeckodesign.com/blog/2013/06/15/creating-an-ssl-certificate-for-node-dot-js/

Web Speech API Docs: https://dvcs.w3.org/hg/speech-api/raw-file/tip/speechapi.html

Jamie Ahmed
asifjahmed@gmail.com
