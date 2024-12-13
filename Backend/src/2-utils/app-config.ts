class AppConfig {

    // Database
    public host = "localhost" // Computer name/address of our database
    public user = "root" // Database user
    public password = "" // Database password
    public database = "customersdb" // Database name  check v/V

    // Server port
    public port = 3002
}

const appConfig = new AppConfig()

export default appConfig


