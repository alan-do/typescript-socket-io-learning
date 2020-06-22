var Client = /** @class */ (function () {
    function Client() {
        this.socket = io();
    }
    return Client;
}());
var client = new Client();
