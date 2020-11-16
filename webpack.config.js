const path = require('path'); //to use the path.resolve() we need this
//path.resolve() resolves the issue of windows and mac directory issues

// webpack.config.js
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports = {
    // entry: "./src/add-tour.js", //relative path
    
    //to add multiple entry point
    entry: {
        index: "./src/index.js",
        addTour: "./src/add-tour.js",
        plan: "./src/plan-tour.js",
        printDetails: "./src/printDetails.js",
    },

    output: {
        path: path.resolve(__dirname, "public/scripts"), //absolute path
        // __dirname gives the path till the project folder

        filename: "public/scripts/[name]-bundle.js" //output file name
        //this should be exact match with the HTML js reference
        //<script src="/public/scripts/bundle.js"></script>
    },   

    devServer: {
        //Tell the server where to serve content from
        contentBase: path.join(__dirname, 'public'),

        //Tell dev-server to watch the files served by
        //the devServer.contentBase option.
        watchContentBase: true,

        //A set of options used to customize watch mode
        watchOptions: {
            poll: 1000, // Check for changes every second
            ignored: /node_modules/ //ignores the node_modules directory as it's heavy
        }       
    },

    //It has performance issue so don't use it for production
    devtool: 'source-map',

    //for optimized momentjs
    plugins: [
        // To strip all locales except “en”
        new MomentLocalesPlugin(),
 
        // Or: To strip all locales except “en”, “es-us” and “ru”
        // (“en” is built into Moment and can’t be removed)
        new MomentLocalesPlugin({
            localesToKeep: ['es-us'],
        }),
    ]
}