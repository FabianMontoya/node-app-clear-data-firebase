import { initializeApp } from 'firebase/app';
import { getDatabase, ref, update, set, onValue, get, child } from 'firebase/database';
import fs from 'node:fs';
import csv from 'csv-parser';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

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

const __dirname = new URL('.', import.meta.url).pathname;

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

const createRecord = async (key, records) => {
  try {
    const database = getDatabase();

    const newRecordRef = ref(database, '1/' + key);
    const newRecordRef2 = ref(database, key + '/');

    // generar un numero de telefono que tenga 10 digitos y empiece por 3
    // const celular = faker.number.int({ min: 3000000000, max: 3999999999 }).toString();

    const data = records[Math.floor(Math.random() * records.length)];
    const celular = data.number;

    const record = {
      celular: celular,
      clave: Math.random().toString(36).substring(2, 6), // Genera una clave aleatoria
      clienteid: key,
      color: faker.helpers.arrayElement(['intermitente', 'entrando', 'verde']), // Status
      corro: faker.internet.email(), // Correo aleatorio
      sectionVisible: faker.helpers.arrayElement(['espera', 'Dinamica_APP', 'Terminado']), // Sección visible aleatoria
      tera: faker.helpers.arrayElement(['NEQUI', 'TRICOLOR', 'Tarjeta']), // Servicio aleatorio
      usuario: celular // Usa el celular como parte del usuario
    };

    const record2 = {
      celular: record.celular,
      clave: record.clave, // Genera una clave aleatoria
      corro: record.corro, // Correo aleatorio
      dinamican: Math.random().toString(36).substring(2, 6),
      sectionVisible: record.sectionVisible, // Sección visible aleatoria
      usuario: record.usuario // Usa el celular como parte del usuario
    };

    // console.log(`creando registro ${key}`, { record });

    await update(newRecordRef, record);
    await set(newRecordRef, record);

    await update(newRecordRef2, record2);
    await set(newRecordRef2, record2);
  } catch (error) {
    console.log('error when create record: ', error);
  }
};

const clearDB = async (hour, minute, records) => {
  console.log(`clearing data at: ${hour}:${minute}`);

  for (let hora = hour; hora <= hour; hora++) {
    for (let minuto = minute; minuto < minute + 2; minuto++) {
      for (let segundo = 0; segundo < 60; segundo++) {
        const key = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}:${segundo
          .toString()
          .padStart(2, '0')}`;
        createRecord(key, records);
      }
    }
  }
};

const clearDataHour = async (records) => {
  const idRequest = uuidv4();
  // get actual hour number
  const d = new Date();
  const h = d.getHours();
  const m = d.getMinutes();
  const s = d.getSeconds();
  console.log('-----------------');
  console.log(`id: ${idRequest} - init clear at: ${h}:${m}:${s}`);

  Promise.all([clearDB(h, m, records)]).then(() => {
    const d2 = new Date();
    const h2 = d2.getHours();
    const m2 = d2.getMinutes();
    const s2 = d2.getSeconds();
    console.log(`id: ${idRequest} Done at: ${h2}:${m2}:${s2}`);
    console.log('-----------------');
  });
};

const main = async () => {
  try {
    const records = await processFile();
    setInterval(() => {
      clearDataHour(records);
    }, 2000);
  } catch (error) {
    console.error('Ocurrió un error:', error);
  }
};
main();
