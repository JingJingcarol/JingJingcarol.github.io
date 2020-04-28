const path = require("path");
module.exports = {
    devServer: {
        contentBase: path.join(__dirname, "./dist"),
        historyApiFallback:true,
        port: 9001
    }
}