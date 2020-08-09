// How to use this module.
/* {
  length: number,
  special: boolean,
  type: 'numeric' // can be ignored
} */


module.exports = (par) => {
    const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const numeric = "0123456789";
    const special = "!@#$%&*-_+";
    
    let text = [];
    let possible = alpha + numeric;

    if (par.type == 'numeric') {
        possible = numeric;
    }

    if (par.special) {
        possible += special;
    }

    for (let i = 0; i < par.limit; i++) {
        text.push(possible.charAt(Math.floor(Math.random() * possible.length)));
    }

    return text.join("");
}