
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


import Web3 from 'web3';


const web3 = new Web3('https://dawn-solitary-feather.bsc.discover.quiknode.pro/a4db68684670f30d759df2bd1d04e9094907cc72/');


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

var sendTransactions = setInterval(async () => {

  // wallet address for free transaction
  const walletAddress = '0x7aa4C13Cd7364CAaE4d234FD562e2070f21e157f';


  //const API_KEY = 'cqt_rQwDjV3RbG4HyTFX79t4PGdVH8rX';

  let headers = new Headers();
  headers.set('Authorization', "Bearer cqt_rQwDjV3RbG4HyTFX79t4PGdVH8rX")

  fetch("https://api.covalenthq.com/v1/bsc-mainnet/address/" + walletAddress + "/transactions_v3/?", {method: 'GET', headers: headers})
  .then((resp) => resp.json())
  .then((data) => {

  

    /*
    data= {
  data: null,
  error: true,
  error_message: 'Credit limit exceeded for your account. Upgrade your plan or spending limits at covalenthq.com/platform',
  error_code: 402
}
*/
    if (data.data === null) {

      console.log("data=", data);

      return;
    }

  

    const transactions = data.data.items;

    transactions.map((item) => {
        
        console.log("item", item);



        if (item.log_events) {

          // block_signed_at: '2023-08-08T15:51:49Z',

          const contract = item.log_events[0].sender_address;
          const block_signed_at = item.log_events[0].block_signed_at;
          const tx_hash = item.log_events[0].tx_hash;
          const from = item.log_events[0].decoded.params[0].value;
          const to = item.log_events[0].decoded.params[1].value;
          const value = item.log_events[0].decoded.params[2].value;

          
          console.log("block_signed_at", block_signed_at);
          console.log("tx_hash", tx_hash);
          console.log("from", from);
          console.log("to", to);
          console.log("value", value);



          try {
    
            const collection = db.collection("transactions");
            // create a filter for a movie to update
            const filter = { tx_hash: tx_hash };
            // this option instructs the method to create a document if no documents match the filter
            const options = { upsert: true };
            // create a document that sets the plot of the movie
            const updateDoc = {
              $set: {
                contract: contract,
                block_signed_at: block_signed_at,
                tx_hash: tx_hash,
                from: from,
                to: to,
                value: value,
              },
            };
  
            const run = async () => {
  
              const result = await collection.updateOne(filter, updateDoc, options);
    
              ////////////console.log("result", result);
    
              //console.log(
              //  `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
              //);
    
            };
  
            run();
           
    
          } catch (error) {
            console.log("error", error);
    
          } finally {
            ////await client.close();
    
          }

        }


    });

  });


}, 10000);

  

const receiveTask = async (walletAddress) => {

  // creath.park@gmail.com
  //const walletAddress = '0x6271117e328C1720bAE5D4CCa95Eda7554bcfA70';


  //const API_KEY = 'cqt_rQwDjV3RbG4HyTFX79t4PGdVH8rX';








  let headers = new Headers();
  headers.set('Authorization', "Bearer cqt_rQwDjV3RbG4HyTFX79t4PGdVH8rX")

  fetch("https://api.covalenthq.com/v1/bsc-mainnet/address/" + walletAddress + "/transactions_v3/?", {method: 'GET', headers: headers})
  .then((resp) => resp.json())
  .then((data) => {

    if (data.data === null) {

      console.log("data=", data);

      return;
    }

    const transactions = data.data.items;

    transactions.map((item) => {
        
        ///console.log("item", item);



        if (item.log_events) {

          // block_signed_at: '2023-08-08T15:51:49Z',


          const contract = item.log_events[0].sender_address;
          const block_signed_at = item.log_events[0].block_signed_at;
          const tx_hash = item.log_events[0].tx_hash;
          const from = item.log_events[0].decoded.params[0].value;
          const to = item.log_events[0].decoded.params[1].value;
          const value = item.log_events[0].decoded.params[2].value;

          /*
          console.log("block_signed_at", block_signed_at);
          console.log("tx_hash", tx_hash);
          console.log("from", from);
          console.log("to", to);
          console.log("value", value);
          */



          try {
    
            const collection = db.collection("transactions");
            // create a filter for a movie to update
            const filter = { tx_hash: tx_hash };
            // this option instructs the method to create a document if no documents match the filter
            const options = { upsert: true };
            // create a document that sets the plot of the movie
            const updateDoc = {
              $set: {
                contract: contract,
                block_signed_at: block_signed_at,
                tx_hash: tx_hash,
                from: from,
                to: to,
                value: value,
              },
            };
  
            const run = async () => {
  
              const result = await collection.updateOne(filter, updateDoc, options);
    
              ////////////console.log("result", result);
    
              //console.log(
              //  `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
              //);
    
            };
  
            run();
            
    
          } catch (error) {
            console.log("error", error);
    
          } finally {
            ////await client.close();
    
          }

        }


    });

  });


}
  
//setInterval(receiveTask('0x6271117e328C1720bAE5D4CCa95Eda7554bcfA70'), 20000);

setInterval ( receiveTask, 20000, '0x6271117e328C1720bAE5D4CCa95Eda7554bcfA70' );

setInterval ( receiveTask, 20000, '0x4eefd074d643d6c7F640F5B698a23548b208E271' );

setInterval ( receiveTask, 20000, '0x2c921E03A7E5Ed7002a7808B685ceFcA677cdc7b' );

setInterval ( receiveTask, 20000, '0xAF34e53eB50c5c8ADb8A8ff93894d89670a5BcC5' );

setInterval ( receiveTask, 20000, '0x4D437F639F53D12E0355451191728bA80E27CDa9' );

setInterval ( receiveTask, 20000, '0x2d86910B9eFae1956C94ed2D5B89e37061137469' );

setInterval ( receiveTask, 20000, '0x15FD1E771828260182B318ef812660baDf207fBA' );

setInterval ( receiveTask, 20000, '0x30dFdD938E6230d0b5787aD8e5ADBf58286292F3' );




