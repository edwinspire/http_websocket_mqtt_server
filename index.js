import aedesMod from "aedes";
import http from "http";
import websocket from "websocket-stream";
import express from "express";

const port = 3001;
const aedes = new aedesMod();
const app = express();
const httpServer = http.createServer(app);

const wsServer = websocket.createServer(
  {
    server: httpServer,
    verifyClient: (info, cb) => {
      console.log("<<< verifyClient >>>", info.req.url, info.req.headers, info.req.headers['sec-websocket-protocol']);


      cb(true);
    },
  },
  aedes.handle
);

// Manejar eventos generados por aedes

// Evento cuando el servidor MQTT se inicia
aedes.on("client", (client) => {
  console.log("Cliente MQTT conectado: " + client.id);
});

// Evento cuando se publica un mensaje en el servidor MQTT
aedes.on("publish", (packet, client) => {
  console.log(
    "Mensaje publicado en el tópico: " +
      packet.topic +
      " - " +
      packet.payload.toString() +
      " del cliente: " +
      (client ? client.id : "Desconocido")
  );
});

// Evento cuando un cliente MQTT se suscribe a un tópico
aedes.on("subscribe", (subscriptions, client) => {
  console.log(
    "Cliente MQTT se ha suscrito a los tópicos: " +
      subscriptions.map((s) => s.topic) +
      " del cliente: " +
      (client ? client.id : "Desconocido")
  );
});

// Evento cuando un cliente MQTT se desconecta
aedes.on("clientDisconnect", (client) => {
  console.log("Cliente MQTT desconectado: " + client.id);
});

// Definir una ruta para el servidor HTTP con Express
app.get("/", (req, res) => {
  res.send("¡Bienvenido al servidor HTTP!");
});


wsServer.on("connection", (c) => {
   console.log('Se a realizado una conexión');
});


// Iniciar el servidor en el puerto especificado
httpServer.listen(port, () => {
  console.log("Servidor escuchando en el puerto " + port);
});
