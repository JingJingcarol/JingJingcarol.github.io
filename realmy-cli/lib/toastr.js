const chalk = require('chalk')

module.exports = {
    warning(msg){
        console.log(chalk.blue('[warning]') + chalk.yellow(msg) + '\n')
    
    },
    success(msg){
        console.log(chalk.blue('[success]') + chalk.green(msg)+ '\n')
    },
    error(msg){
        console.log(chalk.blue('[error]') + chalk.red(msg)+ '\n')
    },
    info(msg){
        console.log(chalk.blue('[info]') + chalk.blue(msg)+ '\n')
    }
}