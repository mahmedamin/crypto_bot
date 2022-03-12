const constants = require('../config/constants');

const _7stepsPercentage = [
    0.6, // Step 1
    1.2, // Step 2
    2.6, // Step 3
    5.6, // Step 4
    12, // Step 5
    25, // Step 6
    53, // Step 7
];

const _8stepsPercentage = [
    0.3, // Step 1
    0.6, // Step 2
    1.3, // Step 3
    2.8, // Step 4
    5.8, // Step 5
    12, // Step 6
    25, // Step 7
    52.19999, // Step 8
];

const _9stepsPercentageNoProfitOnLast = [
    0.15, // Step 1
    0.31, // Step 2
    0.643, // Step 3
    1.334, // Step 4
    2.82, // Step 5
    5.83, // Step 6
    12.3, // Step 7
    25.2, // Step 8
    51.2, // Step 9
];

const stepPercentageMappings = {
    7: _7stepsPercentage,
    8: _8stepsPercentage,
    9: _9stepsPercentageNoProfitOnLast
}

const stepPercentage = stepPercentageMappings[constants.STEPS_TO_FOLLOW];

exports.getStepAmount = (requiredStep, balance) => {
    let stepTotal = 0,
        currentStep = 0,
        requiredStepAmount = 0;
    stepPercentage.forEach(percentage => {
        currentStep++;
        const currentStepAmount = parseFloat(balance * (percentage / 100)),
            winAmount = currentStepAmount * 1.95;

        stepTotal += currentStepAmount;
        netProfit = winAmount - stepTotal;

        if (requiredStep === currentStep)
            requiredStepAmount = currentStepAmount;
    });

    return requiredStepAmount;
}

exports.testStep = (req, res) => {
    console.clear();
    console.log('\033[2J');
    const balance = 70;
    let stepTotal = 0,
        currentStep = 0,
        totalAmount = 0,
        totalPercentage = 0;
    stepPercentage.forEach(percentage => {
        currentStep++;
        const currentStepAmount = parseFloat(balance * (percentage / 100)),
            winAmount = currentStepAmount * 1.95;

        stepTotal += currentStepAmount;
        netProfit = winAmount - stepTotal;

        totalPercentage += percentage;
        totalAmount += currentStepAmount;

        console.log('#' + currentStep, 'c', currentStepAmount.toFixed(4), 'p', netProfit.toFixed(4), 'w', winAmount.toFixed(4));
    });
    console.log('-----------------------------------');
    console.log('p', totalPercentage, 't', totalAmount)

    res.send("OK");
}
