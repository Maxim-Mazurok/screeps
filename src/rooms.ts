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
      new Towers(room).run();
      new Market(room).run();
    });
  }
}
