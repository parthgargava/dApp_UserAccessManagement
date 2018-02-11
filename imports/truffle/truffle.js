module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 9545,
      network_id: 5777
    },
    rinkeby: {
      host: 'localhost',
      port: 8545,
      network_id: 4,
      from: '0x0d6eafe9ca0258b97839b07230a7ea8fa61b632a'
    }
  }
}
