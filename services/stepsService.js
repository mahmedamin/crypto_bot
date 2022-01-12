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

const stepPercentage = _8stepsPercentage;

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
