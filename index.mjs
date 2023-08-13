
import express from "express";

import cors from "cors";
import "./loadEnvironment.mjs";
import "express-async-errors";
import posts from "./routes/posts.mjs";

import path from 'path';

import db from "./db/conn.mjs";
import { ObjectId } from "mongodb";

import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";

import { Network, Alchemy } from 'alchemy-sdk';
import { error } from "console";


//const addBotUser = require("./mongo/horseRace/addBotUser");

import addBotUser from "./mongo/horseRace/addBotUser.mjs";


const __dirname = path.resolve();

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());




// Load the /posts routes
app.use("/posts", posts);

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Uh oh! An unexpected error occured.")
})

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});


app.get("/", (req, res) => {

  ////res.sendFile(__dirname + "/index.html");

  

  var list = "";

  const result = latestWinnerHorse();

  result.then((data) => {
    ////console.log("data", data);

    data.map((item) => {
      //return `<tr>
      //  <td>${item.date}</td><td>${item.winnerHorse}</td><td>${item.winnerNft}</td>
      //</tr>`;




      var placements = `<table  >`;
      item.placements.map((horse) => {
        placements += `<tr>
          <td style="padding-left:5px; line-height: 50px; overflow: hidden">${horse.line}</td>
          <td>
            <img src="https://granderby.io/horseRace/${horse.nft.contract}.png" width="20" />
            #${horse.nft.tokenId}
          </td>
        </tr>`;
      });
      placements += `</table>`;

      var rates = `<table  >`;
      item.placements.map((horse) => {
        rates += `<tr>
          <td style="padding-left:5px; line-height: 50px; text-align: center; overflow: hidden">${horse.rate}</td>
        </tr>`;
      });
      rates += `</table>`;


      var bets = `<table  >`;
      item.placements.map((horse) => {
        bets += `<tr>
          <td style="padding-right:5px; line-height: 50px; text-align: right; overflow: hidden">$${horse.bet}</td>
        </tr>`;
      });
      bets += `</table>`;





      var nftImage = `<img src="https://granderby.io/horseRace/${item.winnerNft.contract}.png" width="120" />`;

      ///console.log("item.nft", item.nft);

      
      if (item.nft && item.nft.media[0] && item.nft.media[0].thumbnail) {

        nftImage = `<img src="${item.nft.media[0].thumbnail}" width="120" />`;
        
      }

      var external_url = "";
      if (item.nft && item.nft.rawMetadata.external_url) {
        external_url = item.nft.rawMetadata.external_url;
      }



      
      var nftOwner = "";

      if (item.nftOwner) {
        nftOwner = `<a href="https://polygonscan.com/address/${item.nftOwner}#tokentxns" target="_blank">
            ${item.nftOwner.substring(0, 5)}
          </a>`;
      } else {
        ///nftOwner = "NFT not claimed yet";
        nftOwner = `<img src="https://granderby.io/horseRace/rewarding.gif" width="120" />`;
      }
      


      list += `<tr>
        <td style="border:1px solid red; padding-left:5px; ">${item.date}</td>
        
        <td style="border:1px solid red; vertical-align: top;">${placements}</td>

        <td style="border:1px solid red; vertical-align: top;">${rates}</td>

        <td style="border:1px solid red; text-align: right; vertical-align: top;">
          ${bets}
        </td>

        <td style="border:1px solid red; text-align: right; padding-right: 5px">
          $${item.totalBet}
        </td>
        <td style="border:1px solid red; text-align: center; ">

          ${nftImage}<br>

          #${item.winnerNft.tokenId}<br>

          ${item.winnerHorse}
          
          <br>

          
          <a href="${external_url}" target="_blank">
            Home
          </a>          
          &nbsp;&nbsp;<a href="https://opensea.io/assets/matic/${item.winnerNft.contract}/${item.winnerNft.tokenId}" target="_blank">
            OpenSea
          </a>

        </td>

        <td style="border:1px solid red; text-align: right; padding-right: 10px">
          $${Number.parseFloat(item.winPrize).toFixed(2)}
        </td>

        <td style="border:1px solid red; text-align: center;">
          ${nftOwner}
        </td>
      </tr>`;
    });



    const html = `<!DOCTYPE html>
    <html>
      <head>
        <title>Grandderby</title>

        <meta http-equiv="refresh" content="30">

        <style>
          html * {
            font-size: 23px;
            line-height: 1.625;
            color: #2020131;
            font-family: Nunito, sans-serif;
          }
        </style>

      </head>
      <body style="padding: 10px;" >


        <h1>Latest winner horse</h1>
     
        <img src="https://granderby.io/horseRace/0x41FBA0bd9f4DC9a968a10aEBb792af6A09969F60.png" width="38" />
        vs<img src="https://granderby.io/horseRace/0x9d3aCa725a289c6E798355592Cd3dd5E43fA14A5.png" width="38" />
        vs<img src="https://granderby.io/horseRace/0x67F4732266C7300cca593C814d46bee72e40659F.png" width="38" />

        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

        <a href="https://granderby.io/widget/horseRace" target="_blank">Go Live</a>

        &nbsp;&nbsp;

        <img src="https://granderby.io/horseRace/at1.gif" width="48" />

        <table style="width: 100%; border:1px solid black;border-collapse:collapse;" >
          <tr>
            <th style="border:1px solid black; width:7%">Date</th>
            <th style="border:1px solid black;">Ranks</th>
            <th style="border:1px solid black;">Rates</th>
            <th style="border:1px solid black;">Bets</th>
            <th style="border:1px solid black;">Total</th>

            <th style="border:1px solid black;">Winner</th>

            <th style="border:1px solid black;">Win Prize</th>
            <th style="border:1px solid black;">NFT Owner</th>
          </tr>
          ${list}
        </table>
      </body>
    </html>`;



    res.send(html).status(200);
  });


});




const settings = {
  //apiKey: 'XBY-aoD3cF_vjy6le186jtpbWDIqSvrH', // Replace with your Alchemy API Key.

  //apiKey: '8YyZWFtcbLkYveYaB9sjOC3KPWInNu07', // Replace with your Alchemy API Key.

  apiKey: process.env.ALCHEMY_API_KEY,

  network: Network.MATIC_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);







const privatekey = process.env.WALLET_PRIVATE_KEY;


/*
const sdk = ThirdwebSDK.fromPrivateKey(
  privatekey,
  "polygon",
  {
    clientId: "79125a56ef0c1629d4863b6df0a43cce", // Use client id if using on the client side, get it from dashboard settings
    ///secretKey: "YOUR_SECRET_KEY", // Use secret key if using on the server, get it from dashboard settings
  },
)
*/


const sdk = ThirdwebSDK.fromPrivateKey(privatekey, "binance", {
  clientId: process.env.THIRDWEB_CLIENT_ID, // Use client id if using on the client side, get it from dashboard settings
  secretKey: process.env.THIRDWEB_SECRET_KEY, // Use secret key if using on the server, get it from dashboard settings

  gasless: {
    // By specifying a gasless configuration - all transactions will get forwarded to enable gasless transactions
    openzeppelin: {
      relayerUrl: process.env.OPENZEPPELIN_URL, // your OZ Defender relayer URL
      //////relayerForwarderAddress: "<open-zeppelin-forwarder-address>", // the OZ defender relayer address (defaults to the standard one)
    },
    /*
    biconomy: {
      apiId: "biconomy-api-id", // your Biconomy API Id
      apiKey: "biconomy-api-key", // your Biconomy API Key
      deadlineSeconds: 123, // your Biconomy timeout preference
    },
    */
  },

});




// Token contract
const tokenContract = await sdk.getContract(process.env.TOKEN_ADDRESS);



const latestWinnerHorse = async () => {

  let collection = await db.collection("horsehistories");
  let results = await collection.aggregate([
    //{"$project": {"author": 1, "title": 1, "tags": 1, "date": 1}},
    {"$sort": {"date": -1}},
    {"$limit": 50}
  ]).toArray();

  return results;

}


////console.log("Hello world");

/*
//let collection = await db.collection("horses");
let collection = await db.collection("horsehistories");

////console.log("collection: ", collection);


//let results = await collection.find({})
//  .limit(50)
//  .toArray();


let results = await collection.aggregate([
  //{"$project": {"author": 1, "title": 1, "tags": 1, "date": 1}},
  {"$sort": {"date": -1}},
  {"$limit": 3}
]).toArray();

////console.log(results);


console.log("_id", results[0]._id);
console.log("winnerHorse", results[0].winnerHorse);
console.log("winnerNft", results[0].winnerNft);



///res.send(results).status(200);
*/



/*
setTimeout(async () => {
  if (start) {
    clearInterval(sayar);
    return;
  }

  const data = await addBotUser(randomNumber, horsesa[randomSite]);

  console.log("bot data", data);

  io.emit("game", data);

}, randomTime);
*/

var race = setInterval(async () => {


  /*
  let collection = await db.collection("horsehistories");
  let results = await collection.aggregate([
    //{"$project": {"author": 1, "title": 1, "tags": 1, "date": 1}},
    
    {"$match": {"nftOwner": {"$exists": false}}},

    ///{"$match": {"nft": {"$exists": false}}},

    {"$sort": {"date": -1}},
    {"$limit": 1}
  ]).toArray();
  */

  //console.log(results);

  /*
  if (results.length > 0) {


    const tokenId = results[0].winnerNft.tokenId;
  }
  */

  /*
  console.log("_id", results[0]._id);
  console.log("winnerHorse", results[0].winnerHorse);

  console.log("winnerNft", results[0].winnerNft);

  console.log("totalBet", results[0].totalBet);
  console.log("winPrize", results[0].winPrize);
  ///console.log("nftOwner", results[0].nftOwner);


  const tokenId = results[0].winnerNft.tokenId;
  */

  /*
  const contract = await sdk.getContract(results[0].winnerNft.contract); // Granderby Horse Contract

  const nft = await contract.erc721.get(tokenId);

  console.log("nft.owner", nft.owner);
  
  const toAddress = nft.owner;
  */

  /*
  await alchemy.nft
  .getNftMetadata(npcNames[0].nft1.contract, npcNames[0].nft1.tokenId)
  .then((response) => {
    resNpcNames[0].media1 = response.media[0];
  });  
  */





  /*
  var nft = {};

  await alchemy.nft.getNftMetadata(
    results[0].winnerNft.contract,
    results[0].winnerNft.tokenId
  ).then((response) => {
    ///console.log("response", response);
    nft = response;
  }).catch((error) => {
    console.log("error", error);
  });


  if (nft == null) {
    error("nft is empty");
    return;
  }


  console.log("contract", results[0].winnerNft.contract);
  console.log("tokenId", results[0].winnerNft.tokenId);

  await alchemy.nft.getOwnersForNft(
    results[0].winnerNft.contract,
    results[0].winnerNft.tokenId
  ).then((response) => {

    ///console.log("response", response);

    
    nft.owner = response.owners[0];

  }).catch((error) => {
    console.log("error", error);
  });

  console.log("nft.owner", nft.owner);



  const toAddress = nft.owner;


  const amount = results[0].winPrize;

  */





  /*
  const data = await alchemy.core.getAssetTransfers({
    ///fromBlock: "0x0",
    
    //fromAddress: "0x5c43B1eD97e52d009611D89b74fA829FE4ac56b1",

    contractAddresses: ["0x0501aeB35866F4527CdB73CB0Fc2795FD568e0B1"],

    category: ["external", "internal", "erc20", "erc721", "erc1155"],
    //category: ["erc20"],
  });
  

  console.log("data", data);
  */


  const query = `
  query{
  bitcoin{
    blocks{
      count
    }
   }
  }
  `;
  const url = "https://graphql.bitquery.io/";
  const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": "BQY9wqOR80lD1q4x2hT9fwyxPCYpqZoh"
      },
      body: JSON.stringify({
        query
      })
  };
  fetch(url, opts)
    .then((response) => response.json())
    .then((data) => {

      console.log(data);

    })
    .catch(console.error);

  
    const horsesa = [
      "0x41FBA0bd9f4DC9a968a10aEBb792af6A09969F60",
      "0x9d3aCa725a289c6E798355592Cd3dd5E43fA14A5",
      "0x67F4732266C7300cca593C814d46bee72e40659F",
    ]

    const randomBetAmount = Math.floor(Math.random() * 100) + 1;
    const randomSite = Math.floor(Math.random() * 3) + 1;

    const data = await addBotUser(randomBetAmount, horsesa[randomSite]);

    console.log("bot data", data);



}, 10000); 

