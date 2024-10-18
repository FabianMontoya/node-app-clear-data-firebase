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

const database = getDatabase();

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

const records = await processFile();
console.log(records.length);

const starCountRef = ref(database, '23:20:03/');

/* const dbRef = ref(getDatabase());
get(child(dbRef, `1/`))
  .then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
    } else {
      console.log('No data available');
    }
  })
  .catch((error) => {
    console.error(error);
  });
 */

onValue(starCountRef, (snapshot) => {
  const data = snapshot.val();
  console.log({ snapshot, data });
  // updateStarCount(postElement, data);
});

const createRecord = async (key) => {
  const newRecordRef = ref(database, '1/' + key);

  const celular = faker.phone.phoneNumber('3#########');
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

  await set(newRecordRef, record);
};

const updateRecord = async (key) => {
  const recordRef = ref(database, '1/' + key);

  // get random record from file

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

  console.log(`actualizando registro ${key}`, { record });

  await update(recordRef, record);
};

const clearDB = async () => {
  for (let hora = 6; hora < 12; hora++) {
    for (let minuto = 0; minuto < 60; minuto++) {
      for (let segundo = 0; segundo < 60; segundo++) {
        const key = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}:${segundo
          .toString()
          .padStart(2, '0')}`;
        updateRecord(key);
      }
    }
  }
};

// clearDB();
