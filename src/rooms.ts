import Towers from "./towers";

export default class Rooms {
    get rooms(): Array<Room> {
        return this._rooms;
    }

    private _rooms: Array<Room> = [];

    constructor(game: Game = Game) {
        for (const roomCoordinates in game.rooms) {
            const room = game.rooms[roomCoordinates];
            this._rooms.push(room);
        }
    }

    public run() {
        this.runTowers();
    }

    private runTowers() {
        this.rooms.forEach((room: Room) => {
            const towers = new Towers(room);
            towers.run();
        })
    }
}
