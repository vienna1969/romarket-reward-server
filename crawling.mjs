
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
          <td>${horse.line}</td>
          <td>#${horse.nft.tokenId}</td>
          <td>${horse.bet}</td>
        </tr>`;
      });
      placements += `</table>`;

      var nftImage = "";

      if (item.nft) {
        //nftImage = `<img src="${item.nft.media[0].thumbail}" width="80" />`;
      }

      var nftOwner = "";
      if (item.nftOwner) {
        nftOwner = `<a href="https://polygonscan.com/address/${item.nftOwner}#tokentxns" target="_blank"> ${item.nftOwner} </a>`;
      } else {
        ///nftOwner = "NFT not claimed yet";
      }


      list += `<tr>
        <td style="border:1px solid red;">${item.date}</td>
        <td style="border:1px solid red;">${placements}</td>
        <td style="border:1px solid red; text-align: right;">${item.totalBet}</td>
        <td style="border:1px solid red;">
          ${item.winnerNft.contract}<br>
          #${item.winnerNft.tokenId}<br>
          ${nftImage}
        </td>
        <td style="border:1px solid red;">${item.winnerHorse}</td>
        <td style="border:1px solid red; text-align: right;">${item.winPrize}</td>
        <td style="border:1px solid red;">
          ${nftOwner}
        </td>
      </tr>`;
    });



    const html = `<html>
      <head>
        <title>Grandderby</title>
      </head>
      <body>

     
        <img src="https://granderby.io/images/logo.png" width="100" />

        <h1>Latest winner horse</h1>

        <table style="border:1px solid black;border-collapse:collapse;" >
          <tr>
            <th style="border:1px solid black;">Date</th>
            <th style="border:1px solid black;">Placements</th>
            <th style="border:1px solid black;">Total Bet</th>
            <th style="border:1px solid black;">NFT</th>
            <th style="border:1px solid black;">Name</th>
            <th style="border:1px solid black;">Win Prize(Total Bet x 0.001)</th>
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

  apiKey: '8YyZWFtcbLkYveYaB9sjOC3KPWInNu07', // Replace with your Alchemy API Key.

  network: Network.MATIC_MAINNET, // Replace with your network.
};

const alchemy = new Alchemy(settings);







const privatekey = process.env.PRIVATE_KEY;


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


const sdk = ThirdwebSDK.fromPrivateKey(privatekey, "polygon", {
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


// official GRD Token contract
const tokenContract = await sdk.getContract("0xe426D2410f20B0434FE2ce56299a1543d3fDe450"); // Granderby Token Contract






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


  let collection = await db.collection("horsehistories");
  let results = await collection.aggregate([
    //{"$project": {"author": 1, "title": 1, "tags": 1, "date": 1}},
    {"$match": {"nftOwner": {"$exists": false}}},
    {"$sort": {"date": -1}},
    {"$limit": 1}
  ]).toArray();

  ////console.log(results);


  console.log("_id", results[0]._id);
  console.log("winnerHorse", results[0].winnerHorse);

  console.log("winnerNft", results[0].winnerNft);

  console.log("totalBet", results[0].totalBet);
  console.log("winPrize", results[0].winPrize);
  console.log("nftOwner", results[0].nftOwner);


  const tokenId = results[0].winnerNft.tokenId;


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



  var nft = {};

  await alchemy.nft.getNftMetadata(
    results[0].winnerNft.contract,
    results[0].winnerNft.tokenId
  ).then((response) => {
    console.log("response", response);
    nft = response;
  }).catch((error) => {
    console.log("error", error);
  });


  if (nft == null) {
    error("nft is empty");
    return;
  }



  await alchemy.nft.getOwnersForNft(
    results[0].winnerNft.contract,
    results[0].winnerNft.tokenId
  ).then((response) => {

    ///console.log("response", response);
    nft.owner = response.owners[0];

  }).catch((error) => {
    console.log("error", error);
  });



  const toAddress = nft.owner;


  const amount = results[0].winPrize;

  try {
    const transaction = await tokenContract.erc20.transfer(
      toAddress,
      amount
    );


    ///console.log("transaction", transaction);


  /*
 try {
    const database = client.db("sample_mflix");
    const movies = database.collection("movies");
    // create a filter for a movie to update
    const filter = { title: "Random Harvest" };
    // this option instructs the method to create a document if no documents match the filter
    const options = { upsert: true };
    // create a document that sets the plot of the movie
    const updateDoc = {
      $set: {
        plot: `A harvest of random numbers, such as: ${Math.random()}`
      },
    };
    const result = await movies.updateOne(filter, updateDoc, options);
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    );
  } finally {
    await client.close();
  }
  */




    const horsehistories = db.collection("horsehistories");
    const filter = { _id: results[0]._id };
    const updateNftOwner = {
      $set: {
        nftOwner: nft.owner,
        nft: nft,
      },
    };
    const options = { upsert: false };

    horsehistories.updateOne( filter, updateNftOwner, options, (err, collection) => {

      if(err) throw err;

      console.log("Record updated successfully");
      console.log(collection);
      
    });







  } catch (error) {
    console.error(error);
  }
  


}, 50000000);




let collection = await db.collection("horsehistories");
let results = await collection.aggregate([
  //{"$project": {"author": 1, "title": 1, "tags": 1, "date": 1}},
  {$match: {"nftOwner": {$exists: false}}},
  {$sort: {"date": -1}},
  {$limit: 1}
]).toArray();

////console.log(results);


console.log("_id", results[0]._id);
console.log("winnerHorse", results[0].winnerHorse);

console.log("winnerNft", results[0].winnerNft);

console.log("totalBet", results[0].totalBet);
console.log("winPrize", results[0].winPrize);
console.log("nftOwner", results[0].nftOwner);
