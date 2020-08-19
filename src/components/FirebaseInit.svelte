<script>
    import { FirebaseApp, User, Doc, Collection } from 'sveltefire';
    import {firebaseConfig} from "../../firebase.conf";
    // Import the Firebase Services you want bundled and call initializeApp
    import firebase from "firebase/app";
    import 'firebase/firestore';
    import 'firebase/auth';
    import 'firebase/performance';
    import 'firebase/analytics';

    firebase.initializeApp(firebaseConfig);
    firebase.performance();
    firebase.analytics();
    if(window.location.hostname === "localhost"){
        console.log("localhost detected");
        firebase.firestore().settings({
            host: "localhost:8080",
            ssl:false
        })
    }
    if(window.location.hostname === "192.168.0.22"){
        console.log("LAN detected");
        firebase.firestore().settings({
            host: "192.168.0.22:8080",
            ssl:false
        })
    }
</script>

<FirebaseApp {firebase}>
    <slot/>
</FirebaseApp>