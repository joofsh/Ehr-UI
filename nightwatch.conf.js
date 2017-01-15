require('babel-core/register');

var config = {
  "src_folders" : ["src/__tests__/e2e"],
  "output_folder" : "reports",
  "custom_commands_path" : "",
  "custom_assertions_path" : "",
  "page_objects_path" : "",
  "test_runner" : "mocha",
  "globals_path" : "",

  "selenium" : {
    "start_process" : true,
    "server_path" : "bin/selenium-server-standalone-3.0.1.jar",
    "log_path" : "",
    "host": "127.0.0.1",
    "port" : 4444,
    "cli_args" : {
      "webdriver.chrome.driver" : "bin/chromedriver",
      "webdriver.gecko.driver" : "",
      "webdriver.edge.driver" : ""
    }
  },

  "test_settings" : {
    "default" : {
      "launch_url" : "http://localhost:3001",
      "selenium_port"  : 4444,
      "selenium_host"  : "localhost",
      "silent": true,
      "screenshots" : {
        "enabled" : false,
        "path" : "reports"
      },
      "desiredCapabilities" : {
        "browserName" : "phantomjs",
        "javascriptEnabled" : true,
        "acceptSslCerts" : true,
        "phantomjs.binary.path" : "/usr/local/bin/phantomjs",
        "phantomjs.cli.args" : []
      }
    },
    "chrome": {
      "desiredCapabilities": {
        "browserName": "chrome",
        "javascriptEnabled": true,
        "acceptSslCerts": true
      }
    }
  }
}

module.exports = config;
