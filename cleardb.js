import { initializeApp } from 'firebase/app';
import { getDatabase, ref, update, set, onValue, get, child } from 'firebase/database';
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

const createRecord = async (key, records) => {
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

  console.log(`creando registro ${key}`, { record, record2 });

  await update(newRecordRef, record);
  await set(newRecordRef, record);

  await update(newRecordRef2, record2);
  await set(newRecordRef2, record2);
};

const clearDB = async (from, to, records) => {
  for (let hora = from; hora <= to; hora++) {
    for (let minuto = 0; minuto < 60; minuto++) {
      for (let segundo = 0; segundo < 60; segundo++) {
        const key = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}:${segundo
          .toString()
          .padStart(2, '0')}`;
        createRecord(key, records);
        // updateRecord(key);
      }
    }
  }
};

const main = async () => {
  try {
    const records = await processFile();
    await createRecord('23:59:09', records);

    /* await Promise.allSettled([
      clearDB(0, 1, records),
      clearDB(2, 3, records),
      clearDB(4, 5, records),
      clearDB(6, 7, records),
      clearDB(8, 9, records),
      clearDB(10, 11, records),
      clearDB(12, 13, records),
      clearDB(14, 15, records),
      clearDB(16, 17, records),
      clearDB(18, 19, records),
      clearDB(20, 21, records),
      clearDB(22, 23, records)
    ]); */

    console.log('Proceso completado');
  } catch (error) {
    console.error('Ocurrió un error:', error);
  } finally {
    process.exit(); // Cierra el proceso cuando termina
  }
};

// Ejecutar la función principal
main();
