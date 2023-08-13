//const axios = require("axios");
//const HorsesModel = require('./gameModel');

import axios from "axios";


//import HorsesModel from "./gameModel.mjs";

import HorseGame from "./gameModel.mjs";





async function addBotUser(betAmount,site){
    // axios.get("https://randomuser.me/api/").then((res) => {
    //     const user = res.data.results[0];
    //     const username = user.login.username;
    //     const img = user.picture.thumbnail;
    // const game = new Game({
    //     userObject: {
    //         id: 0,
    //         username: username,
    //         img: img,
    //     },
    //     bet: betAmount,
    //     site: site,
    // });
    // console.log(game);
    // const data = game;
    // game.save();
    // return data;
    // })
    const data = await axios.get("https://randomuser.me/api/")
    const user = data.data.results[0];
    const username = user.login.username;
    const userimg = user.picture.thumbnail;

    ////const game = new HorsesModel({
    const game = new HorseGame({
        userId: "bot",
        username: username,
        img: userimg,
        betAmount: betAmount,
        selectedSide: site,
    });
    const dataa = game;
    game.save();
    
    return dataa;

}

////module.exports = addBotUser;

export default addBotUser;