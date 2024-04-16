
function randomInt(min, max){
    if (!max){
        max = min
        min = 0
    }
    return Math.random() * (max - min) + min;
}

export {randomInt}
