"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var ws_1 = __importDefault(require("ws"));
var cors_1 = __importDefault(require("cors"));
var path = require("path");
var fs = require("fs");
var url = require("url");
var uuidv4 = require("uuid").v4;
var PORT = 8000;
var CLIENT_ID =
  "54565130306-rtqs8i7h7ml06p4sq0tvgnk87i01dkaj.apps.googleusercontent.com";
var OAuth2Client = require("google-auth-library").OAuth2Client;
var client = new OAuth2Client(CLIENT_ID);
var wss = new ws_1["default"].Server({ noServer: true });
var messages = {};
var agents = {};
var clientShare = {};
var mapTokenToLink = {};
var mapLinkToJSON = {};
var socketClients = {};
var app = express_1["default"]();
var server = app.listen(PORT, function () {
  return console.log("Server running on Port " + PORT);
});
app.use(express_1["default"].static(path.join(__dirname, "build")));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
server.on("upgrade", function upgrade(request, socket, head) {
  console.log("Web Socket");
  var reqURL = url.parse(request.url, true);
  console.log(reqURL);
  if (reqURL.pathname === "/shareSocket") {
    wss.handleUpgrade(request, socket, head, onSocketConnect);
  }
});
// Middleware
app.use(function (req, res, next) {
  console.log(req.method + " " + req.url);
  next();
});
app.use(cors_1["default"]());
app.use(express_1["default"].json());
app.use(express_1["default"].urlencoded({ extended: true }));
function onSocketConnect(ws) {
  // socketClients.add(ws);
  console.log("on socket connect");
  ws.on("message", function (message) {
    var parsedMessage = JSON.parse(message.toString());
    console.log(parsedMessage);
    socketClients[parsedMessage["hash"]].add(ws);
    var userTodo = mapLinkToJSON[parsedMessage["hash"]];
    console.log("message on socket");
    // ws.header('Access-Control-Allow-Origin','*');
    if (parsedMessage["json"] === undefined) {
      var pathname = path.join(__dirname, userTodo);
      fs.readFile(pathname, function (err, data) {
        if (err) {
          //TODO
        } else {
          var jsonData = JSON.parse(data);
          console.log(JSON.stringify(jsonData));
          ws.send(JSON.stringify(jsonData));
        }
      });
    }
    // else{
    //     const data = parsedMessage['json'];
    //     console.log(JSON.parse(data));
    //     fs.writeFile(userTodo, data, 'utf-8', err => {
    //         if(err){
    //             // TODO
    //             console.log("Error writing JSON file");
    //             return;
    //         }
    //         console.log("Successfully saved JSON file");
    //     })
    //     for(let client of socketClients[parsedMessage['hash']]){
    //         client.send(data);
    //     }
    // }
  });
}
// Static folder
app.use(express_1["default"].static(path.join(__dirname, "public")));
app.post("/getdata", function (req, res) {
  // console.log(req.body);
  var token = req.body["id_token"];
  var listNum = req.body["listNum"];
  // res.header('Access-Control-Allow-Origin','*');
  // console.log(token);
  function verify() {
    return __awaiter(this, void 0, void 0, function () {
      var ticket, payload, email, userTodo, pathname;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID,
              }),
            ];
          case 1:
            ticket = _a.sent();
            payload = ticket.getPayload();
            email = payload.email;
            console.log(email);
            userTodo = email + "_" + listNum + ".json";
            pathname = path.join(__dirname, userTodo);
            fs.readFile(pathname, function (err, data) {
              if (err) {
                //TODO
                var empty = [];
                fs.writeFile(
                  userTodo,
                  JSON.stringify(empty),
                  "utf-8",
                  function (err) {
                    if (err) {
                      // TODO
                      console.log("Error writing JSON file");
                      return;
                    }
                    console.log("Successfully saved JSON file");
                  }
                );
                res.status(404).json({ msg: "Empty JSON file" });
              } else {
                var files = fs.readdirSync(__dirname).filter(function (fn) {
                  return fn.startsWith(email);
                });
                var postJSON = {
                  listNum: files.length,
                  json: JSON.stringify(JSON.parse(data)),
                };
                console.log(JSON.parse(data));
                console.log(files.length);
                res.json(postJSON);
              }
            });
            return [2 /*return*/];
        }
      });
    });
  }
  verify()["catch"](console.error);
});
app.post("/postdata", function (req, res) {
  var token = req.body["token"];
  var data = req.body["json"];
  var listNum = req.body["listNum"];
  console.log(listNum);
  console.log(data);
  // res.header('Access-Control-Allow-Origin','*');
  function verify() {
    return __awaiter(this, void 0, void 0, function () {
      var ticket, payload, email, userTodo;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID,
              }),
            ];
          case 1:
            ticket = _a.sent();
            payload = ticket.getPayload();
            email = payload.email;
            console.log(email);
            userTodo = email + "_" + listNum + ".json";
            fs.writeFile(userTodo, data, "utf-8", function (err) {
              if (err) {
                // TODO
                console.log("Error writing JSON file");
                return;
              }
              console.log("Successfully saved JSON file");
            });
            return [2 /*return*/];
        }
      });
    });
  }
  verify()["catch"](console.error);
});
app.post("/loginToken", function (req, res) {
  var token = req.body["id_token"];
  // console.log(token);
  // res.header('Access-Control-Allow-Origin','*');
  function verify() {
    return __awaiter(this, void 0, void 0, function () {
      var ticket, payload, email, name;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID,
              }),
            ];
          case 1:
            ticket = _a.sent();
            payload = ticket.getPayload();
            email = payload.email;
            name = payload.name;
            console.log(email);
            res.send(name);
            return [2 /*return*/];
        }
      });
    });
  }
  verify()["catch"](console.error);
});
// Need to make changes for multiple lists
app.post("/shareLink", function (req, res) {
  console.log("here");
  var token = req.body["id_token"];
  var listNum = req.body["listNum"];
  var PORT = 8000;
  // console.log(token);
  // res.header('Access-Control-Allow-Origin','*');
  function verify() {
    return __awaiter(this, void 0, void 0, function () {
      var ticket, payload, email, userTodo, emptySet, link;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID,
              }),
            ];
          case 1:
            ticket = _a.sent();
            payload = ticket.getPayload();
            email = payload.email;
            userTodo = email + "_" + listNum + ".json";
            mapTokenToLink[token] = uuidv4();
            if (mapLinkToJSON[mapTokenToLink[token]] === undefined) {
              mapLinkToJSON[mapTokenToLink[token]] = userTodo;
            }
            emptySet = new Set();
            socketClients[mapTokenToLink[token]] = emptySet;
            link =
              "http://localhost:" +
              PORT +
              "/share?hash=" +
              mapTokenToLink[token];
            res.send(link);
            return [2 /*return*/];
        }
      });
    });
  }
  verify()["catch"](console.error);
});
app.post("/sharePOST", function (req, res) {
  var hash = req.body["hash"];
  var userTodo = mapLinkToJSON[hash];
  var data = req.body["json"];
  console.log(JSON.parse(data));
  console.log(socketClients[hash]);
  // res.header('Access-Control-Allow-Origin','*');
  fs.writeFile(userTodo, data, "utf-8", function (err) {
    if (err) {
      // TODO
      console.log("Error writing JSON file");
      return;
    }
    console.log("Successfully saved JSON file");
  });
  socketClients[hash].forEach(function (client) {
    console.log(client);
    client.send(data);
  });
});
//Todo : Add support for mulitple clients using hashes
app.post("/screenShare", function (req, res) {
  var randomHash = Math.floor(Math.random() * (999999 - 100000)) + 100000;
  // Todo : Add in Client
  console.log(randomHash);
  // clientShare[randomHash.toString()] = ;
  var emptyArr = [];
  var emptyArr1 = [];
  agents[randomHash.toString()] = emptyArr;
  messages[randomHash.toString()] = emptyArr1;
  res.send(randomHash.toString());
});
