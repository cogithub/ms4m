const axios = require('axios');

let config = {
  method: 'get',
  maxBodyLength: Infinity,
  url: 'http://10.1.64.119:6060/api/v1/cube/get/dimension/?f=equipment',
  headers: { 
    'Cookie': 'sails.sid=s%3Ad27b-uvWROMXQrOlJl1Y2_GE08jpp6TN.ldr9fu0%2BuWz87yHxu8cFWM6WC9lK9aRIMSbJZ%2FYzc3o'
  }
};

axios.request(config)
.then((response) => {
  console.log((response.data));
})
.catch((error) => {
  console.log(error);
});
