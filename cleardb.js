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

// const starCountRef = ref(database, '1/11:59:59');

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

/* onValue(starCountRef, (snapshot) => {
  const data = snapshot.val();
  console.log({ snapshot, data });
  // updateStarCount(postElement, data);
}); */

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

const createRecord = async (key) => {
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

  console.log(`creando registro ${key}`, { record, record2 });

  await update(newRecordRef, record);
  await set(newRecordRef, record);

  await update(newRecordRef2, record2);
  await set(newRecordRef2, record2);
};

const clearDB = async (from, to) => {
  for (let hora = from; hora <= to; hora++) {
    for (let minuto = 0; minuto < 60; minuto++) {
      for (let segundo = 0; segundo < 60; segundo++) {
        const key = `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}:${segundo
          .toString()
          .padStart(2, '0')}`;
        createRecord(key);
        // updateRecord(key);
      }
    }
  }
};

// createRecord('23:20:03');

Promise.allSettled([
  clearDB(0, 1),
  clearDB(2, 3),
  clearDB(4, 5),
  clearDB(6, 7),
  clearDB(8, 9),
  clearDB(10, 11),
  clearDB(12, 13),
  clearDB(14, 15),
  clearDB(16, 17),
  clearDB(18, 19),
  clearDB(20, 21),
  clearDB(22, 23)
]).then((values) => {
  console.log('done');
  console.info(values);
});
