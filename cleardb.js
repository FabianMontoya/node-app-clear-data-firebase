import { initializeApp } from 'firebase/app';
import { getDatabase, ref, update, set, get } from 'firebase/database';
import fs from 'node:fs';
import csv from 'csv-parser';
import { faker } from '@faker-js/faker';

const firebaseConfig = {
  apiKey: 'AIzaSyDz4ot71jpBlHaXOyRgR80beeTmfHnPspI',
  authDomain: 'prueba20-cb785.firebaseapp.com',
  databaseURL: 'https://prueba20-cb785-default-rtdb.firebaseio.com',
  projectId: 'prueba20-cb785',
  storageBucket: 'prueba20-cb785.appspot.com',
  messagingSenderId: '90195131038',
  appId: '1:90195131038:web:66bee7597a02f959b9598f'
};

/* const firebaseConfig = {
  apiKey: 'AIzaSyAKPWuYCPFdZi0aWuKWE5C0LzWq7uWiQyw',
  authDomain: 'elduodelahistoria-22317.firebaseapp.com',
  projectId: 'elduodelahistoria-22317',
  storageBucket: 'elduodelahistoria-22317.appspot.com',
  messagingSenderId: '448304966485',
  appId: '1:448304966485:web:514e1bf4843dc257469ddc',
  measurementId: 'G-PH26C7MY8H'
}; */

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

// const records = await processFile();

const createSecondRecord = async (key, record) => {
  const database = getDatabase();
  const newRecordRef2 = ref(database, `${key}/`);

  const record2 = {
    celular: record.celular,
    clave: record.clave, // Genera una clave aleatoria
    corro: record.corro, // Correo aleatorio
    dinamican: Math.random().toString(36).substring(2, 6),
    sectionVisible: record.sectionVisible, // Sección visible aleatoria
    usuario: record.usuario // Usa el celular como parte del usuario
  };

  await set(newRecordRef2, record2);
};

const createRecord = async (key, records) => {
  try {
    const database = getDatabase();

    const newRecordRef = ref(database, `1/${key}`);
    const newRecordRef2 = ref(database, `${key}/`);

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

    // console.log(`creando registro ${key}`, { record, record2 });

    await set(newRecordRef, record);
    // await update(newRecordRef, record);

    await set(newRecordRef2, record2);
    // await update(newRecordRef2, record2);
  } catch (error) {
    console.log('error when create record: ', error);
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const clearDB = async (from, to, records) => {
  for (let hora = from; hora <= to; hora++) {
    for (let minuto = 0; minuto < 14; minuto++) {
      for (let segundo = 0; segundo < 60; segundo++) {
        const key = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}:${segundo
          .toString()
          .padStart(2, '0')}`;

        console.log(`clearing data at: ${key}`);
        await createRecord(key, records);
        // await sleep(500);
      }
    }
  }
};

const main = async () => {
  try {
    const records = await processFile();

    // await createRecord('23:07:54', records);
    await clearDB(0, 23, records);

    //await Promise.allSettled([clearDB(17, 15, records), clearDB(16, 17, records)]);

    console.log('Proceso completado');
  } catch (error) {
    console.error('Ocurrió un error:', error);
  } finally {
    process.exit(); // Cierra el proceso cuando termina
  }
};

// Ejecutar la función principal
main();
