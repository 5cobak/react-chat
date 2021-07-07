import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCKriESX0SbpcfO0cU1xcVW0rDs2RWkZNA",
  authDomain: "react-chat-cef1d.firebaseapp.com",
  databaseURL: "https://react-chat-cef1d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "react-chat-cef1d",
  storageBucket: "react-chat-cef1d.appspot.com",
  messagingSenderId: "823272940286",
  appId: "1:823272940286:web:d503c20d96a8e9494ebbaf",
  measurementId: "G-SWMD9G2QCG"
};

type RoomData = {
  users: string[] | [];
  messages: string[] | [];
}

class FirebaseApi {
  db: firebase.firestore.Firestore;
  app?: firebase.app.App;
  _config: typeof firebaseConfig;
  user?: string;
  constructor(config: typeof firebaseConfig) {
    this._config = config;
    this.init();
    this.db = firebase.firestore();
  }

  public async getMessages(room: string, callback: (data: any)=> any) {
    await this.db.collection('rooms').doc(room)
    .onSnapshot((doc) => {
        if (doc.data()?.messages) {
          callback(doc.data()?.messages)
        }
    });
  }

  public setMessages(room: string, user: string, message: string) {
    this.db.collection('rooms')
			.doc(room)
			.get()
			.then( (doc)=>{
				
				if ( doc.exists && doc.data()?.messages) {
          
					this.db.collection('rooms').doc(room).set({
              messages: [...doc.data()?.messages, {
                user,
                message,
              }]
					})
				}
				else {
          
					this.db.collection('rooms').doc(room).set({
						messages: [{
              user,
              message
            }]
					})
				}
			});
  }

  public async getRoomData(room: string, callback?: any) {

    await this.db.collection('rooms').doc(room).get().then(async (doc)=>{
      if(doc.exists) return;
      
      await this.db.collection('rooms').doc(room).set({});
    });
    await this.db.collection("rooms").doc(room)
      .onSnapshot((doc) => {
          callback(doc.data())
      });
  }

  private init() {
    try {
      if (!firebase.apps.length) {
        this.app = firebase.initializeApp(this._config);
      } else this.app = firebase.app();
    } catch (err) {
      console.error(err.message, err.stack);
    }
  }
}

const fb = new FirebaseApi(firebaseConfig);
export type { RoomData }
export { fb };