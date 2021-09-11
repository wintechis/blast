# BLAST mobile version
This is a mobile website, used to load and execute block programs created with [BLAST](https://github.com/wintechis/blast).


## Run locally for development
1. From the root directory, run: 
```
npm install
npm start
```
> Note: This will use `webpack-dev-server` to run the project locally.
2. Point your browser to http://localhost:8080/

## Build for production
1. From the root directory, run: 
```
npm install
npm run-script build
```
> Note: This will update `bundle.js` and `bundle.css` in the `dist/` folder.
2. Open `index.html` in your browser

