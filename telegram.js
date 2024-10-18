import fs from 'node:fs';
import csv from 'csv-parser';
import { faker } from '@faker-js/faker';

const botId = '8192518544:AAGwA2ygimKzeyv7y9_rK6OVbn-_6js4UNM';
const chatId = '7254276066'; // 7254276066

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

function generarFechaExpiracion() {
  // Genera un año aleatorio entre 2026 y 2029
  const anio = faker.number.int({ min: 2026, max: 2029 });

  // Genera un mes aleatorio entre 1 y 12
  const mes = faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0');

  // Devuelve la fecha en formato MM/YYYY
  return `${mes}/${anio}`;
}

function generarHora() {
  const horas = faker.number.int({ min: 0, max: 23 }).toString().padStart(2, '0');
  const minutos = faker.number.int({ min: 0, max: 59 }).toString().padStart(2, '0');
  const segundos = faker.number.int({ min: 0, max: 59 }).toString().padStart(2, '0');

  // Retorna la hora en formato HH:mm:ss
  return `${horas}:${minutos}:${segundos}`;
}

const generateFeikMessage = (records) => {
  const data = records[Math.floor(Math.random() * records.length)];
  const celular = data.number;

  const clienteid = generarHora();

  const tcFeik = {
    nombre: faker.person.fullName(), // Nombre del titular
    documento: faker.number.int({ min: 1000000000, max: 9999999999 }), // Número de documento
    numero: faker.finance.creditCardNumber({ issuer: 'visa' }), // Número de tarjeta
    fechaExpiracion: generarFechaExpiracion(), // Fecha de expiración (un año en el futuro)
    cvv: faker.finance.creditCardCVV() // CVV
  };

  const message = `
        Cliente #: ${clienteid}
        T: ${tcFeik.numero}
        F: ${tcFeik.fechaExpiracion}
        CV: ${tcFeik.cvv}
        ...................
        N: ${tcFeik.nombre}
        TLF: ${celular}
        C: ${tcFeik.documento}
        B: de Bogota
      `;

  return message;
};

const sendMessage = async (records) => {
  const message = generateFeikMessage(records);
  // console.log({ message });

  const url = `https://api.telegram.org/bot${botId}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

  const response = await fetch(url);

  const rData = await response.json();

  // console.log(rData);

  return rData;
};

const updateMessage = async (records, messageId) => {
  const newMessage = generateFeikMessage(records);
  // console.log({ newMessage });

  const url = `https://api.telegram.org/bot${botId}/editMessageText`;
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text: newMessage
      })
    });

    const data = await response.json();

    if (response.ok) {
      // console.log(`Mensaje ${messageId} editado:`, data);
      return true;
    } else {
      console.error(`Error al editar el mensaje ${messageId}:`, data);
    }
  } catch (error) {
    console.error(`Error al actualizar el mensaje ${messageId}:`, error);
  }

  return false;
};

const main = async () => {
  try {
    const records = await processFile();

    let lastMessageId = 544; // Default for not begin from 0

    // Enviamos un mensaje al atacante para saber el ultimo ID que tiene y poder hacer el fot editando los mensajes anteriores que haya generado
    /* const lastMessage = await sendMessage(records);

    if (lastMessage.ok) {
      lastMessageId = lastMessage.result.message_id;
      console.log('Mensaje enviado con éxito:', lastMessageId);
    } else {
      throw new Error('No se pudo enviar el mensaje al bot.');
    } */

    while (true) {
      const updated = await updateMessage(records, lastMessageId);
      if (updated) {
        console.log('Mensaje actualizado con éxito:', lastMessageId);
        // Buscamos el siguiente mensaje a actualizar
        lastMessageId++;
        await new Promise((resolve) => setTimeout(resolve, 500));
      } else {
        console.log(
          `MessageId ${lastMessageId} not found - No hay mensajes nuevos para editar, esperando 10 segundos...`
        );
        await new Promise((resolve) => setTimeout(resolve, 10000));
      }

      // Este for es para poder actualizar mensajes anteriores, como ya los enviamos a editar, pues no lo ejecutamos de neuvo y solo verificamos los nuevos
      /* for (let i = 0; i <= lastMessageId; i++) {
        await updateMessage(records, i);
        await new Promise((resolve) => setTimeout(resolve, 500));
      } */
    }
  } catch (error) {
    console.error('Ocurrió un error:', error);
  } finally {
    process.exit(); // Cierra el proceso cuando termina
  }
};

// Ejecutar la función principal
main();
