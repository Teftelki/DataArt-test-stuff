const searchPrimeButton = document.getElementById('search-prime');

const counter = document.getElementById('counter');
counter.textContent = localStorage.getItem("numbersFound") || 0;

const status = document.getElementById('status');

const runCounters = document.getElementById('run-Counters');
runCounters.textContent = localStorage.getItem("runCounters") || 0;

const totalNumbersOperated = document.getElementById('total-Numbers');
totalNumbersOperated.textContent = localStorage.getItem("totalNumbersOperated") || 0;

let testWorker;


let request = indexedDB.open('numbers', 1);
let db, store;

request.onerror = (eve) => console.log('error' + e.target.errorCode);

request.onsuccess = (eve) => {
    console.log('success');
    db = request.result;
}

request.onupgradeneeded = (eve) => {
    db = request.result;
    store = db.createObjectStore("primeNumbers", { keyPath: "number" });
    console.log('upgrade');
}


startSearch = () => {
    testWorker = new Worker('worker.js');
    while (testWorker!=undefined || testWorker!=null) {
    runCounters.textContent++;
    localStorage.setItem("runCounters", runCounters.textContent);


    status.textContent = 'Search Started'
    searchPrimeButton.innerHTML = 'Stop search';

    console.log('Search Started')

    testWorker.onmessage = (e) => {
        if (e.data.isPrime == true) {
            console.log(e.data.number, e.data.isPrime);


            counter.textContent = parseInt(counter.textContent) + 1;
            localStorage.setItem('lastNumberFound', e.data.number);
            localStorage.setItem('numbersFound', counter.textContent);

            tx = db.transaction('primeNumbers', "readwrite");
            store = tx.objectStore('primeNumbers');
            store.add({ 'number': e.data.number, 'value': e.data.number })

            totalNumbersOperated.textContent++;
            localStorage.setItem("totalNumbersOperated", totalNumbersOperated.textContent);
        } else {
            totalNumbersOperated.textContent++;
            localStorage.setItem("totalNumbersOperated", totalNumbersOperated.textContent);
        }
    }

    if (!(localStorage.getItem('totalNumbersOperated'))) {
        testWorker.postMessage({ 'number': 0 });
    } else {
        testWorker.postMessage({ 'number': localStorage.getItem('totalNumbersOperated') });
    }



    searchPrimeButton.removeEventListener('click', startSearch);
    searchPrimeButton.addEventListener('click', stopSearch);
}
}







stopSearch = () => {
    if (testWorker != undefined) {
        testWorker.terminate();
        status.textContent = 'Search Stopped';
        searchPrimeButton.innerHTML = 'Start search';
        searchPrimeButton.removeEventListener('click', stopSearch);
        searchPrimeButton.addEventListener('click', startSearch);
    }
    else {
        console.log("nothing is started atm")
    }
}


// TIMER ///


const totalHours = document.getElementById('total-hours');
totalHours.textContent = localStorage.getItem('TotalHours') || "00"
const totalMinutes = document.getElementById('total-mins');
totalMinutes.textContent = localStorage.getItem('totalMinutes') || "00"
const totalSeconds = document.getElementById('total-seconds');
totalSeconds.textContent = localStorage.getItem('totalSeconds') || "00"


timerTick = () => {
    totalSeconds.textContent++;
    localStorage.setItem('totalSeconds', totalSeconds.textContent);
    if (totalSeconds.textContent > 59) {
        totalSeconds.textContent = 0; totalMinutes.textContent++;
        localStorage.setItem('totalSeconds', totalSeconds.textContent);
        localStorage.setItem('totalMinutes', totalMinutes.textContent);

        if (totalSeconds.textContent > 59) {
            totalSeconds.textContent = 0;
            totalHours.textContent++;
            localStorage.setItem('totalSeconds', totalSeconds.textContent);
            localStorage.setItem('totalMinutes', totalMinutes.textContent);
            localStorage.setItem('totalHours', totalHours.textContent);
        }
    }

}


//startTimer = setInterval(timerTick, 1000);

stopTimer = () => {
    clearInterval(timerTick);
}













searchPrimeButton.addEventListener('click', startSearch);
