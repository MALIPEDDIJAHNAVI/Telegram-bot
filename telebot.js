const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore} = require('firebase-admin/firestore');
const TelegramBot = require('node-telegram-bot-api');
const token = '5811602081:AAHqmkgRjgkf-M8fRzj3GoWH2yBIO3ytCSE';
const bot = new TelegramBot(token, {polling: true});
var serviceAccount = require("./key.json");
initializeApp({
  credential: cert(serviceAccount)
});
const db = getFirestore();
const request=require('request');
bot.on('message',function(movie){
    bot.onText(/\/start/, (msg) => {
        bot.sendMessage(msg.chat.id, "Welcome here you can explore about movies to check your history text #history"); 
        });
    request('http://www.omdbapi.com/?t='+movie.text+'&apikey=5e181f78',function(error,response,body){
        console.log(JSON.parse(body).Response);
        let details=JSON.parse(body)
        if(JSON.parse(body).Response=='True'){
            let t=details.Title;
            let y=details.Year;
            let d=details.Director;
            let a=details.Awards;
            db.collection('mahesh1').add({
                title:t,
                year:y,
                director:d,
                Awards:a,
                userID:movie.from.id
            })
            bot.sendMessage(movie.chat.id,"title : "+t+"\n"+"year "+y+"\n"+"director :"+d+"\n"+"Awards : "+a);
            }
    });
    if(movie.text == "#history"){
        bot.sendMessage(movie.chat.id,"Your Search History");
        db.collection('mahesh1').where('userID', '==', movie.from.id).get().then((docs)=>{
                  docs.forEach((doc) => {
                        bot.sendMessage(movie.chat.id,"title : " +doc.data().title+ "\n" +"year : "+ doc.data().year+"\n"+"director : "+doc.data().director+ "\n" +"Awards : "+doc.data().Awards)
                      });
                })
    }
})
