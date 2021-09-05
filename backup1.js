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
        if (e.data.isPrime == true) {
            console.log(e.data.number)
            console.log(e.data.isPrime)

            counter.textContent = parseInt(counter.textContent) + 1;
            localStorage.setItem('lastNumberFound', e.data.number);


            let request = window.indexedDB.open('numbers', 1);
            let db, store;

            request.onerror = (eve) => console.log('error' + e.target.errorCode);

            request.onsuccess = (eve) => {
                console.log('success');
                db = request.result;
                tx = db.transaction('primeNumbers', "readwrite");
                store = tx.objectStore('primeNumbers');
                store.put({ 'number': e.data.number, 'value': e.data.number })
            }

            request.onupgradeneeded = (eve) => {
                db = request.result;
                store = db.createObjectStore("primeNumbers", { keyPath: "number" });
                console.log('upgrade');
            }

        } else { }

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



// let localdb  = window.indexedDB.open('numbers');

// const request = window.indexedDB.open('numbers');
// console.log(indexedDB);




// const tx = localdb.transaction('primeNumbersFound', 'readwrite');
// const numbers = tx.objectStore('primeNumbersFound');
// numbers.add(5)



// request.onupgradeneeded = (e) => {
//     localdb = e.target.result;
//     let objectStore = db.createObjectStore("primeNumbersFound", { keyPath: "Value" });
// }


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
