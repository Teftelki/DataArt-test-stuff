
addEventListener('message', (event) => {
let db, store;

let request = indexedDB.open('numbers', 1);
request.onerror = (eve) => console.log('error' + e.target.errorCode);

request.onupgradeneeded = (eve) => {
        db = request.result;
        store = db.createObjectStore("primeNumbers", { keyPath: "number" });
        console.log('upgrade');
}

request.onsuccess = (eve) => {
        db = request.result;
        workerTalk(db, event)
 }

});

workerTalk = (db, e) => {
        if (checkIfPrime(e.data.number)) {
            tx = db.transaction('primeNumbers', "readwrite");
            store = tx.objectStore('primeNumbers');
            store.add({ 'number': parseInt(e.data.number)});
            postMessage({ 'number':  e.data.number, "isPrime": true })
        } else {
            postMessage({ 'number': e.data.number, "isPrime": false });
        }
    }





checkIfPrime = (number) => {
        if (number <=1) {return false} 
        else {

        for (var i = 2; i < Math.round(Math.sqrt(number))+1; i++) {
            if (number % i === 0) return false;
        }
        return true;}
}

// addEventListener('message', (event) => {
//     console.log(event.data);
//         if (checkIfPrime(event.data.number)) {
//              postMessage({ 'number': event.data.number, "isPrime": true });
//         } else { 
//             postMessage({ 'number': event.data.number, "isPrime": false });
//         }
     
// });


