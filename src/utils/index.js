const readline = require("readline");

const askQuestion = (question) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve, reject) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
};

const sortObject = (obj) => {
    let sortedObj = {};

    Object.keys(obj)
        .sort((a, b) => {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        })
        .forEach((key) => {
            sortedObj[key] = obj[key];
        });

    return sortedObj;
};

const getBooleanFromAnswer = (answer) => {
    const normalizedAnswer = answer.toLowerCase().trim();
    const truthyAnswers = ["y", "yes", "true"];
    const falsyAnswers = ["n", "no", "false"];

    if (truthyAnswers.some((x) => x === normalizedAnswer)) {
        return true;
    }
    if (falsyAnswers.some((x) => x === normalizedAnswer)) {
        return false;
    }

    throw new Error({
        code: "invalid-response",
        message: `Invalid response ${answer}`,
    });
};

module.exports = { askQuestion, sortObject, getBooleanFromAnswer };
