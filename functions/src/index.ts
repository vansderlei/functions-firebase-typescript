import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore()
db.settings({timestampsInSnapshots: true})

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

export const getGame = functions.https.onRequest(async(req, res) => {
    try {
        const gameSnapshot = await db.collection('games').doc('game1').get() //db.doc('games/game1').get()
        res.send(gameSnapshot.data())
    } catch (error) {
        console.error(error) //Log no erro no back
        res.status(500).send('Pane na nave') // resposta com erro pro user   
    }
});

export const getVitaoGames = functions.https.onRequest(async(req, res) => {
    try {
        const playerSnapshot = await db.doc('players/player1').get()
        const gamesPromise = []
        const vitaoGames = playerSnapshot.data().games
    
        for (const gameId in vitaoGames){
            const game = db.doc(`games/${gameId}`).get()
            gamesPromise.push(game)
        }

        const gameSnapshot = await Promise.all(gamesPromise)
        const gamesData = []
        
        gameSnapshot.forEach(game => {
            const gameData = game.data()
            gameData.gameId = game.id
            gamesData.push(gameData)
        });
    
        res.send(gamesData)
    
    } catch (error) {
        console.log(error)
        res.status(500).send('Pane na nave do Interestelar')
    }

});

export const onVitaoUpdate = functions.firestore.document('players/player1').onUpdate(change => {
    return admin.messaging().sendToTopic('Data: ', change.after.data())
})
