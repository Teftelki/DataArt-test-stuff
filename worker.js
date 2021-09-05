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

    for (i = parseInt(e.data.number) + 1; i < 2500000; i++) {
        if (checkPrime(i)) {
            postMessage({ 'number': i, "isPrime": true });
        }
        else postMessage({ 'number': i, "isPrime": false });

    }
}
