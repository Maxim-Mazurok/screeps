import { Towers } from './towers';
import { Market } from './market';

export class Rooms {
  constructor(game: Game = Game) {
    for (const roomCoordinates of Object.keys(game.rooms)) {
      const room = game.rooms[roomCoordinates];
      this._rooms.push(room);
    }
  }

  private _rooms: Room[] = [];

  get rooms(): Room[] {
    return this._rooms;
  }

  run() {
    this.rooms.forEach((room: Room) => {
      let maxHits;
      if (room.name === 'E48N17') {
        maxHits = 10000;
      }
      new Towers(room).run(maxHits);
      new Market(room).run();
    });
  }
}
