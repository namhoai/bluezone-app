/*
 * @Project Bluezone
 * @Author Bluezone Global (contact@bluezone.ai)
 * @Createdate 04/26/2020, 16:36
 *
 * This file is part of Bluezone (https://bluezone.ai)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

import firebase from 'react-native-firebase';
import {setTokenFirebase} from './Configuration';
// Optional flow type
import type {RemoteMessage} from 'react-native-firebase';
import {open, writeNotifyDb} from './db/SqliteDb';
import {Platform} from 'react-native';

// https://rnfirebase.io/messaging/usage
async function registerAppWithFCM() {
  await firebase.messaging().registerDeviceForRemoteMessages();
}

async function requestUserPermission(callback) {
  const settings = await firebase.messaging().requestPermission();

  callback(settings);
  if (settings) {
    console.log('Permission settings:', settings);
  }
}

async function requestTokenFirebase() {
  if (Platform.OS === 'android') {
    const channel = new firebase.notifications.Android.Channel(
      'bluezone-channel',
      'Test Channel',
      firebase.notifications.Android.Importance.Max,
    ).setDescription('My apps test channel');

    // Create the channel
    firebase.notifications().android.createChannel(channel);
  }
  // Get the device token
  firebase
    .messaging()
    .getToken()
    .then(token => {
      return setTokenFirebase(token);
    });
  //
  // // Listen to whether the token changes
  // messaging().onTokenRefresh(token => {
  //   return setTokenFirebase(token);
  // });
}

async function registerBackgroundMessageHandler(message: RemoteMessage) {
  // console.log('registerBackgroundMessageHandler', message);
  open();
  writeNotifyDb(message);
  // Register background handler
  return Promise.resolve();
}

async function registerMessageHandler(callback) {
  return firebase.messaging().onMessage(callback);
}

function getTokenFirebase(callback) {
  firebase
    .messaging()
    .getToken()
    .then(callback);
}

function pushNotify(notifyObj) {
  if (Platform.OS === 'android') {
    const notification = new firebase.notifications.Notification()
      .setNotificationId(notifyObj.data.notifyId)
      .setTitle(notifyObj.data.title)
      .setBody(notifyObj.data.text)
      .android.setChannelId('bluezone-channel')
      .setData({
        group: notifyObj.data.group,
      })
      .android.setSmallIcon('icon_bluezone');
    firebase.notifications().displayNotification(notification);
  }
}

export {
  requestUserPermission,
  requestTokenFirebase,
  registerAppWithFCM,
  registerBackgroundMessageHandler,
  registerMessageHandler,
  getTokenFirebase,
  pushNotify,
};
