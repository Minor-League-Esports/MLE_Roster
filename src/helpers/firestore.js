import {getContext} from "svelte";

export function getFirestoreFromContext() {
    const { getFirebase } = getContext('firebase');
    const firebase = getFirebase();
    if(!firebase){
        throw new Error("Missing Firebase app in context. Are you inside a 'FirebaseApp' component?");
    }
    return firebase.firestore();
}
export function attachId(documentRef) {
    return Object.assign(
        {},
        {id: documentRef.id},
        documentRef.data()
    );
}
export function unclean(title){
    const words = title.split(/[_ ]/g);
    return words.map(word => {
        return word.charAt(0) + word.slice(1).toLowerCase()
    }).join(" ");

}