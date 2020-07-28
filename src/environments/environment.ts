// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyChaQIAgA92GuOvkUydvSciTTQFEzXAByw",
    authDomain: "enjo-authen.firebaseapp.com",
    databaseURL: "https://enjo-authen.firebaseio.com",
    projectId: "enjo-authen",
    storageBucket: "enjo-authen.appspot.com",
    messagingSenderId: "840464359399",
    appId: "1:840464359399:web:ccef4c14c4fe12d65d2742",
    measurementId: "G-Y8HDRC709W"
  },
  apiUrl: 'https://enjo-iot.xyz/',
  control: {
    get: 'get/control/',
    update: 'update/control/'
  },
  log: {
    get: {
      date: 'get/log/',
      all: 'get/log/',
      recent: 'get/recent/log/'
    }
  },
  device: {
    get: {
      control: 'control/get/devices',
      log: 'log/get/devices'
    }
  },
  user: {
    register: {
      control: 'register/control/',
      log: 'register/log/'
    },
    list: {
      control: 'control/list/devices/',
      log: 'log/list/devices/'
    },
    remove: {
      control: 'remove/',
    },
    edit: {
      control: 'change/image',
    },
    history: {
      control: 'get/history',
    },
  },
  rule: {
    add: 'add/rule',
    get: 'get/all/rules',
    remove: 'remove/rule'
  },
  library: {
    register: 'register/api/library',
    device: 'get/info/device',
    token: 'get/all/tokens'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
