const functions = require("firebase-functions");
// Instantiates a intent client

// Instantiates a session client

const {
  FB_PATH,
  matchLowerBound,
  end
} = require("./data/config");

//line bot sdk
const line = require('@line/bot-sdk');
// create LINE SDK config from env variables
const config = {
  channelAccessToken: "yscZT+17DpeXOUQTlsmVFwNU+WLeLFTb57sxpiCwTCz23ZjaVKcuTH0NsXUPIiQ1WNVNabdcSKmKt8o1rCwdSO5Ju1bU7OzR08/3zTjzZYhMEDRW72ZR4n76LXBtIkwe0hajy+Ezyf7oZDj6EKS9BQdB04t89/1O/w1cDnyilFU=", //process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: "1546e9f97607dd0e67321ee52c52c0de" //process.env.CHANNEL_SECRET,
};

// console.log(process.env);
// create LINE SDK client
const client = new line.Client(config);

//line notify

const admin = require('firebase-admin');
const saCredentials = require('./airsandbox-32146-firebase-adminsdk-ugmzx-b87556f24d.json')
const express = require('express');
const cors = require('cors');
const os = require('os');
const luxon = require("luxon")
luxon.Settings.defaultLocale = 'th';
luxon.Settings.defaultOutputCalendar = 'buddhist';

//firebase project setting
const PROJECT_ID = saCredentials.project_id
const { KEY } = require("./constants");
const firebaseLocal = os.hostname() != 'localhost'; // it's localhost on Firebase
console.log(`probably recheck if os.hostname() != 'localhost' (${os.hostname()}) and webhook URL https://7ee7-27-55-92-106.ap.ngrok.io/screener-de5c7/us-central1/api/fulfullments or https://us-central1-research-thai-rtaf.cloudfunctions.net/api/fulfullments`);
if (firebaseLocal) {
    const adminServiceAccountPrivatekey = saCredentials.private_key;
    const adminServiceAccountClientEmail = saCredentials.client_email;

    //local
    admin.initializeApp({
        databaseURL: `http://localhost:9000/?ns=${PROJECT_ID}-default-rtdb`, //http://localhost:9000/?ns=tamniyombot65-eafd4-default-rtdb
        credential: admin.credential.cert({
            projectId: PROJECT_ID,
            clientEmail: adminServiceAccountClientEmail,
            privateKey: adminServiceAccountPrivatekey
        })
    });
    // // END
} else {
    //server
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        databaseURL: `https://screener-de5c7-default-rtdb.firebaseio.com`
    });
    //END
}

const ROOT_REF = admin.database().ref('line-bot');

// researchuser
//nibceg-0pebxi-roDjug
const app = express();
app.use(cors({ origin: true }));

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.all('/', (req, res, next) => {
    console.log('checking auth');
    next()
})

app.post('/webhook', async (req, res) => {

    Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result));
})


app.post('/upsertProfile', (req, res) => {
    let { profile } = req.body.data
    console.log(profile);
    register(profile).then(success => {
        if (success) res.send({
            data: 'ok'
        })
    })
})

async function handleEvent(event) {
    // if (event.type !== 'message' || event.message.type !== 'text') {
    //   return Promise.resolve(null);
    // }

    let userId = event.source.userId;
    let replyToken = event.replyToken

    if (event.type === KEY.UNFOLLOW) {
        let displayName = (await ROOT_REF.child(FB_PATH.users).child(userId).child('displayName').once('value')).val()
        register({
            displayName: displayName,
            userId, userId,
            [KEY.UNFOLLOW]: Date.now()
        })
        return end
    }

    let profile = await client.getProfile(userId)
    console.log('====================================');
    console.log(profile);
    console.log('====================================');
    register(profile)

    switch (event.type) {
        case KEY.FOLLOW:
            register({
                ...profile,
                [KEY.FOLLOW]: Date.now()
            })
            break
        case KEY.MEMBER_JOINED:
          break
        case KEY.JOIN:
            break
        case KEY.MESSAGE:

        switch (event.message.text)  {
            case 'menu':
            case 'เมนู':
            default:
                break;
        }

            break;
        case KEY.POSTBACK:
            let data = new URLSearchParams(event.postback.data)            
            break;
        default:
            break;
    }
    
  }

  async function register(profile) {

    console.log('====================================');
    console.log('registering');
    console.log('====================================');
    if (!profile) return end
    if (!profile[KEY.UNFOLLOW]) {
        let { displayName, pictureUrl } = profile
        ROOT_REF.child(FB_PATH.activities).child(profile.userId).update({
            displayName,
            pictureUrl: pictureUrl || ''
        })
    }

    return Promise.all([
        ROOT_REF.child(FB_PATH.users).child(profile.userId).update({
            ...profile,
            lastLoggedin: Date.now()
        }),
        ...['follow', 'unfollow', 'login', 'weblogin'].map(node => {
            if (profile[node]){
                ROOT_REF.child(FB_PATH.activities).child(profile.userId).child(node).update({
                [Date.now()] : true
                })

                let { userId, ...others} = profile
                ROOT_REF.child(FB_PATH.weblog).child(FB_PATH.activities).push().set({
                    ...others,
                    date : Date.now(),
                    type: node
                })
            }
        })
    ])


  }

exports.demoapi = functions.https.onRequest(app);