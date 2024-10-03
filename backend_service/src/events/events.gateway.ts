import {
  MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(3001, {
  cors: {
    origin: '*',
  },
  path: '/'})
// @WebSocketGateway(29998)
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect{

  client_map:Map<string, any> = new Map<string, any>();

  @WebSocketServer()
  server: Server;

  afterInit(server: any): any {
    console.log('websocket initialized. ' + server.path());

  }

  handleConnection(client: any, ...args): any {
    console.log('client ' + client.id + ' connected.');
    // this.client_map.set(client.id, client);
  }

  handleDisconnect(client:any){
    // if(this.client_map.has(client.id)){
    //   client.disconnect();
    //   //remove disconnected client
    //   this.client_map.delete(client.id);
    // }
  }
  // @SubscribeMessage('events')
  // handleMessage(client: any, data: any){
  //
  //   console.log('client id:' + client.id + '\nreceived message from ws client-->' + data.toString());
  //   client.send('OK');
  // }

  @SubscribeMessage('message')
  handleMessage(client: any, data: any){

    console.log('client id:' + client.id + '\nreceived message from ws client-->' + data.toString());
    let msg = JSON.parse(data);
    if(msg.type === 'register'){
      this.client_map.set(msg.id, client);
    }
    // client.send('OK');
  }

  sendMessage(id:string, message:string):void {
    console.log('sending message to ' + id);
    let client = this.client_map.get(id);

    client.send(message);
  }

}


