<<<<<<< HEAD
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

        } else {}

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


=======
const searchPrimeButton = document.getElementById('search-prime');

const numbersFound = document.getElementById('counter');
numbersFound.textContent = localStorage.getItem("numbersFound") || 0;

const status = document.getElementById('status');

const runCounters = document.getElementById('run-Counters');
runCounters.textContent = localStorage.getItem("runCounters") || 0;

const totalNumbersOperated = document.getElementById('total-Numbers');
totalNumbersOperated.textContent = localStorage.getItem("totalNumbersOperated") || 0;

let worker;

// create new worker
const prepareWorker = () => {
    worker = new Worker('worker.js');
    return worker;
}



// if number is prime - increment all needed counters
const handlePrime = (e) => {
    if (e.data.isPrime == true) {
        console.log(e.data.number)
        numbersFound.textContent++;
        localStorage.setItem('numbersFound', numbersFound.textContent);
        localStorage.setItem('lastNumberFound', e.data.number);
        totalNumbersOperated.textContent++;
        localStorage.setItem("totalNumbersOperated", totalNumbersOperated.textContent);
        worker.postMessage({ 'number': totalNumbersOperated.textContent });
        console.log(totalNumbersOperated.textContent)

    } else {
        console.log(e.data.number)
        totalNumbersOperated.textContent++;
        localStorage.setItem("totalNumbersOperated", totalNumbersOperated.textContent);
        worker.postMessage({ 'number': totalNumbersOperated.textContent });
    }

}

// create/connect to DB, add listener
let db, store; 
const prepareDB = () => {
    let request = indexedDB.open('numbers', 1);
    request.onerror = (eve) => console.log('error' + e.target.errorCode);

    request.onupgradeneeded = (eve) => {
        db = request.result;
        store = db.createObjectStore("primeNumbers", { keyPath: "number" });
        console.log('upgrade');
    }

    request.onsuccess = (eve) => {
        db = request.result;
        console.log(db)
        getAllNumbers();
    }
}

prepareDB();


startSearch = () => {
    currentTicks = 0;
    showNumbersButton.disabled = true;
    drawCanvasButton.disabled = true;
    timerTicks = setInterval(() => {timerTick(); currentTicks++; console.log(currentTicks);}, 1000);
    
    runCounters.textContent++;
    localStorage.setItem("runCounters", runCounters.textContent);
    status.textContent = 'Search Started';
    searchPrimeButton.innerHTML = 'Stop search';

    let worker = prepareWorker();
    worker.onmessage = (e) => handlePrime(e);
    console.log(worker)

    worker.postMessage({ 'number': parseInt(totalNumbersOperated.textContent)+1});

    clearPagination();
    clearCanvas();

    searchPrimeButton.removeEventListener('click', startSearch);
    searchPrimeButton.addEventListener('click', stopSearch);
}



stopSearch = () => {
    allNumbers = [];
    worker.terminate();
    stopTimer();
    getAllNumbers();
    status.textContent = 'Search Stopped';
    searchPrimeButton.innerHTML = 'Start search';
    searchPrimeButton.removeEventListener('click', stopSearch);
    searchPrimeButton.addEventListener('click', startSearch);
}


// TIMER ///


const totalHours = document.getElementById('total-hours');
totalHours.textContent = localStorage.getItem('TotalHours') || "00"
const totalMinutes = document.getElementById('total-mins');
totalMinutes.textContent = localStorage.getItem('totalMinutes') || "00"
const totalSeconds = document.getElementById('total-seconds');
totalSeconds.textContent = localStorage.getItem('totalSeconds') || "00"

let currentTicks = 0;

const maxTicks = document.getElementById('maxTicks');
maxTicks.textContent= convertTime(localStorage.getItem('maxTicks')) || "00"

const minTicks = document.getElementById('minTicks');
minTicks.textContent = convertTime(localStorage.getItem('minTicks')) || "00"


searchPrimeButton.addEventListener('click', startSearch)


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

stopTimer = () => {
    clearInterval(timerTicks);
    minHandler();
    maxHandler();
}

function convertTime(totalSeconds) {
    let hours   = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    let seconds = totalSeconds - (hours * 3600) - (minutes * 60);

    let result =''; 
    if (hours >= 10) {result += hours +"hr"}  
    else {result += "0" + hours + "hr " }

    if (minutes >= 10) {result += minutes +"min "}  
    else {result += "0" + minutes + "min " }

    if (seconds >= 10) {result += seconds +"sec "}  
    else {result += "0" + seconds + "sec " }

    return result
}



minHandler = () => {
    if (currentTicks<localStorage.getItem('minTicks')) {localStorage.setItem('minTicks', currentTicks); minTicks.textContent = convertTime(currentTicks);}
    else if (!localStorage.getItem('minTicks')) {localStorage.setItem('minTicks', currentTicks); minTicks.textContent = convertTime(currentTicks)}
}


maxHandler = () => {
    if (currentTicks > localStorage.getItem('maxTicks')) {localStorage.setItem('maxTicks', currentTicks); maxTicks.textContent = convertTime(currentTicks)}
}





// pagination.
// 1. Getting all numbers from Indexed DB with OpenCursor
// 2. Adding these numbers in allNumbers Array
// 3. Applying pagination to allNumbers Array



const paginationBlock = document.getElementById("pagination-block");
const numbersBlock = document.getElementById("numbers-block");
const showNumbersButton = document.getElementById("show-numbers-button")




let allNumbers = []
getAllNumbers = () => {
    showNumbersButton.disabled = true;
    let transaction = db.transaction('primeNumbers', "readonly");
    let objectStore = transaction.objectStore('primeNumbers');
    let getRequest = objectStore.openCursor();
    getRequest.onsuccess = () => {
        let cursor = getRequest.result;
        if (cursor) {
          let key = cursor.primaryKey; 
          allNumbers.push(key);  
          cursor.continue();
        } else {
          console.log("All numbers loaded");
          showNumbersButton.disabled= false;
          drawCanvasButton.disabled = false;

        }
    }
}


pagination = (numbersArray) => {
    paginationBlock.textContent ='';
    let pages = Math.floor(numbersArray.length/100)+1;
    for (let i =1; i<=pages; i++ ) {
    createLink(i);
    }
    renderNumbers(document.querySelector('[data-id="1"]'));
    prevButton.classList.remove('hidden');
    nextButton.classList.remove('hidden');
}




createLink = (pageNumber) => {
   let link = document.createElement('a');
   link.textContent = pageNumber;
   link.href = "#"
   link.classList.add('pagination-link')
   link.dataset.id = link.textContent;
   link.addEventListener('click', (e)=> { e.preventDefault(); renderNumbers(link)})
   paginationBlock.appendChild(link); 
}

renderNumbers = (element) =>  {
   if (document.querySelector('.active')) {document.querySelector('.active').classList.remove('active');}
    element.classList.add("active");
    numbersBlock.textContent = '';
        for (let i=(element.textContent-1)*100; i<parseInt((element.textContent-1)*100)+100; i++) {
            if (allNumbers[i]){
            numbersBlock.textContent = numbersBlock.textContent + allNumbers[i] + " " ;}
        }
    prevHandler();
    nextHandler();
}

showNumbersButton.addEventListener('click', (e) => {
    pagination(allNumbers)})

clearPagination = ()=> { 
    numbersBlock.textContent = '';
    paginationBlock.textContent ='';
    prevButton.classList.add('hidden');
    nextButton.classList.add('hidden');
 }


//
// NEXT/PREVIOUS KOLHOZ
//

let nextButton = document.getElementById("pagination-next-button") 
let prevButton = document.getElementById("pagination-previous-button") 

paginationNext = () => {
    let currentPage = document.querySelector('.active');
    console.log(currentPage.getAttribute('data-id'));
    let temp = parseInt(currentPage.getAttribute('data-id'));
    let requestString = '[data-id="'
    requestString+= parseInt(temp)+parseInt(1);
    requestString+= '"]'
    console.log(requestString);
    if (document.querySelector(requestString)) {
        renderNumbers(document.querySelector(requestString))
    }
}

paginationPrev = () => {
    let currentPage = document.querySelector('.active');
    console.log(currentPage.getAttribute('data-id'));
    let temp = parseInt(currentPage.getAttribute('data-id'));
    let requestString = '[data-id="'
    requestString+= parseInt(temp)-1;
    requestString+= '"]'
    console.log(requestString);
    if (document.querySelector(requestString)) {
        renderNumbers(document.querySelector(requestString))
    }
}

nextButton.addEventListener("click", paginationNext)
prevButton.addEventListener("click", paginationPrev)


prevHandler = () => {    
    if (document.querySelector('.active').textContent == 1) {prevButton.disabled = true;}
    else {prevButton.disabled = false}
}

nextHandler = () => {    
    let currentPage = document.querySelector('.active');
    console.log(currentPage.getAttribute('data-id'));
    let temp = parseInt(currentPage.getAttribute('data-id'));
    let requestString = '[data-id="'
    requestString+= parseInt(temp)+1;
    requestString+= '"]'
    if (!document.querySelector(requestString)) {nextButton.disabled=true}
    else {nextButton.disabled = false}
}


// canvas.
const drawCanvasButton = document.getElementById('draw-canvas-button');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');




drawCanvas = (array) => {
    canvas.width = (( Math.sqrt(localStorage.getItem('lastNumberFound')))+1)*15;
    canvas.height = (( Math.sqrt(localStorage.getItem('lastNumberFound')))+1)*15;

    let canvaswidth = Math.floor( Math.sqrt(localStorage.getItem('lastNumberFound')))+1;
    console.log(canvaswidth);
    let canvasheight = canvaswidth;
    let offsetX = 15;
    let offsetY = 15;
    numberDrawn = 1;

    for (i=0; i<canvasheight; i++) {
        for (j=0; j<canvaswidth; j++) {
        if (numberDrawn > localStorage.getItem('lastNumberFound')) {break}
        else {
            if (array.includes(numberDrawn))    {
                console.log(numberDrawn, allNumbers.includes(numberDrawn));
                ctx.fillStyle = 'black';
                ctx.fillRect(10+offsetX*j, 10+offsetY*i, 10, 10);
                numberDrawn++;}
            else {
                console.log(numberDrawn, allNumbers.includes(numberDrawn));
                ctx.fillStyle = 'red';
                ctx.strokeRect(10+offsetX*j, 10+offsetY*i, 10, 10);
                numberDrawn++}
        }     
    }
        }

}

clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = 50;
    canvas.height = 50;
}

drawCanvasButton.addEventListener('click', () => (drawCanvas(allNumbers)));
>>>>>>> development
