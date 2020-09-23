import {getContext} from "svelte";

export function getFirestoreFromContext() {
    const { getFirebase } = getContext('firebase');
    const firebase = getFirebase();
    if(!firebase){
        throw new Error("Missing Firebase app in context. Are you inside a 'FirebaseApp' component?");
    }
    return firebase.firestore();
}
