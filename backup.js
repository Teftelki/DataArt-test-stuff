const workBtn = document.getElementById('startWorkerButton');
const counter = document.getElementById('counter');
const stopButton = document.getElementById('stop');
stopButton.disabled = true;

let testWorker;



workBtn.addEventListener('click', () => {

    testWorker = new Worker('worker.js');
    workBtn.disabled = true;
    stopButton.disabled = false;



    testWorker.onmessage = (e) => {
        console.log(e.data);
        console.log(e.data[number], e.data[isPrime]);
        counter.textContent = parseInt(counter.textContent) + 1;
        localStorage.setItem('lastNumberFound', e.data);


        


        let request = window.indexedDB.open('numbers', 1);
        let db, store;

        request.onerror = (eve) => console.log('error' + e.target.errorCode);

        request.onsuccess = (eve) => {
            console.log('success');
            db = request.result;
            tx = db.transaction('primeNumbers', "readwrite");
            store = tx.objectStore('primeNumbers');
            store.put({ 'number': e.data, 'value': e.data })


        }

        request.onupgradeneeded = (eve) => {
            db = request.result;
            store = db.createObjectStore("primeNumbers", { keyPath: "number" });
            console.log('upgrade');

        }




    }

    if (!(localStorage.getItem('lastNumberFound'))) {
        let lastNumberFound = 0;
        testWorker.postMessage({ 'number': lastNumberFound });
    } else {
        testWorker.postMessage({ 'number': localStorage.getItem('lastNumberFound') });
    }
})






stopButton.addEventListener('click', () => {
    if (testWorker != undefined) {
        testWorker.terminate();
        workBtn.disabled = false;
        stopButton.disabled = true;

    }
    else {
        console.log("nothing is started atm")
    }

})




// let request = window.indexedDB.open('numbers', 1);
// let db, store;

// request.onerror = (e) => console.log('error' + e.target.errorCode);

// request.onsuccess = (e) => {
//     console.log('success');
//     db = request.result;
//     tx = db.transaction('primeNumbers', "readwrite");
//     store = tx.objectStore('primeNumbers');
// }

// request.onupgradeneeded = (e) => {
//     db = request.result;
//     store = db.createObjectStore("primeNumbers", { keyPath: "number" });
//     console.log('upgrade');
//     store.put({ 'number': 1, 'value': 1 })

// }


