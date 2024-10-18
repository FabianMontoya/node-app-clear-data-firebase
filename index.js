import { initializeApp } from 'firebase/app';
import { getDatabase, ref, update, onValue, get, child } from 'firebase/database';
import fs from 'node:fs';
import csv from 'csv-parser';
import { faker } from '@faker-js/faker';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: 'AIzaSyB9Om1iWlUumN0yhpozAwffi6rUyWVw23w',
  authDomain: 'rojorojorojo-c7d03.firebaseapp.com',
  projectId: 'rojorojorojo-c7d03',
  storageBucket: 'rojorojorojo-c7d03.appspot.com',
  messagingSenderId: '964166530518',
  appId: '1:964166530518:web:47171b3c0c34eed95c2077'
};

initializeApp(firebaseConfig);

/* const __dirname = new URL('.', import.meta.url).pathname;

const processFile = async () => {
  const records = [];
  const parser = fs
    .createReadStream(`${__dirname}/numeros.csv`)
    .pipe(csv({ headers: ['number', 'value'], skipLines: 0 }));
  for await (const record of parser) {
    // Work with each record
    records.push(record);
  }
  return records;
};

const records = await processFile(); */

const getRecord = async (key) => {
  const database = getDatabase();
  const keyInternalRef = ref(database, `1/${key}`);
  const keyGlobalRef = ref(database, `${key}/`);

  console.log(key);

  const internalRef = await get(keyInternalRef);
  if (internalRef.exists()) {
    console.log('keyInternalRef', internalRef.val());
  } else {
    console.log('No data available for keyInternalRef' + `1/${key}`);
  }

  const globalRef = await get(keyGlobalRef);

  if (globalRef.exists()) {
    console.log('keyGlobalRef', globalRef.val());
  } else {
    console.log('No data available for keyGlobalRef' + `${key}/`);
  }
};

const main = async () => {
  try {
    await getRecord('23:13:59');
  } catch (error) {
    console.error('Ocurrió un error:', error);
  } finally {
    process.exit(); // Cierra el proceso cuando termina
  }
};
main();
