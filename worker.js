function checkPrime(number) {
    if (number <= 1) {
        return false;
    } else {
        for (let i = 2; i <= Math.sqrt(Math.floor(number)); i++) {
            if (number % i == 0) {
                return false;
            }
        }
        return true;
    }
}




self.onmessage = (e) => {

    console.log(e.data);
    if (checkPrime(e.data.number)) {
        console.log(e.data.number);
        postMessage({ 'number': e.data.number, "isPrime": true });
    }
    else postMessage({ 'number': e.data.number, "isPrime": false });
}





