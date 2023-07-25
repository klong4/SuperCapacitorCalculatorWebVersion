document.addEventListener('DOMContentLoaded', () => {
  const addCapacitorButton = document.querySelector('.add-button');
  const removeCapacitorButton = document.querySelector('.remove-button');
  const parallelSetsInput = document.querySelector('#parallel-sets');
  const calculateButton = document.querySelector('#calculate-button');
  const capacitanceContainer = document.querySelector('#capacitors-container');

  let storedValues = {};

  addCapacitorButton.addEventListener('click', addCapacitor);
  removeCapacitorButton.addEventListener('click', removeCapacitor);
  calculateButton.addEventListener('click', calculate);

  // Event listener for static row value changes
  const staticCapacitanceInput = document.querySelector('.capacitance');
  const staticVoltageInput = document.querySelector('.voltage');
  const staticEnergyCapacityInput = document.querySelector('.energy-capacity');

  staticCapacitanceInput.addEventListener('input', updateStoredValues);
  staticVoltageInput.addEventListener('input', updateStoredValues);
  staticEnergyCapacityInput.addEventListener('input', updateStoredValues);

  function addCapacitor() {
    const rows = document.querySelectorAll('.capacitor-row');
    const newRowNumber = rows.length;

    const newRow = document.createElement('div');
    newRow.classList.add('capacitor-row');

    if (newRowNumber === 0) {
      newRow.innerHTML = getFirstRowHTML();
      setNewRowValues(newRow);
    } else {
      newRow.innerHTML = getNewRowHTML();
      setNewRowValues(newRow);
    }

    const rowNumber = document.createElement('span');
    rowNumber.classList.add('row-number');
    rowNumber.textContent = newRowNumber;
    newRow.insertBefore(rowNumber, newRow.firstChild);

    capacitanceContainer.appendChild(newRow);
  }

  function removeCapacitor() {
    const rows = document.querySelectorAll('.capacitor-row');
    if (rows.length > 1) {
      const lastRow = rows[rows.length - 1];
      lastRow.remove();
    }
  }

  function calculate() {
    const capacitanceInputs = document.querySelectorAll('.capacitance');
    const capacitanceUnitInputs = document.querySelectorAll('.capacitance-unit');
    const voltageInputs = document.querySelectorAll('.voltage');
    const voltageUnitInputs = document.querySelectorAll('.voltage-unit');
    const energyCapacityInputs = document.querySelectorAll('.energy-capacity');
    const energyCapacityUnitInputs = document.querySelectorAll('.energy-capacity-unit');
    const totalCapacitanceElement = document.querySelector('#total-capacitance');
    const totalVoltageElement = document.querySelector('#total-voltage');
    const totalEnergyCapacityElement = document.querySelector('#total-energy-capacity');
    const totalEnergyCapacityJoulesElement = document.querySelector('#total-energy-capacity-joules');
    const totalEnergyCapacityAhElement = document.querySelector('#total-energy-capacity-ah');

    // Check if elements exist
    if (
      !totalCapacitanceElement ||
      !totalVoltageElement ||
      !totalEnergyCapacityElement ||
      !totalEnergyCapacityJoulesElement ||
      !totalEnergyCapacityAhElement
    ) {
      console.error('One or more elements not found.');
      return;
    }

    let totalCapacitanceSeries = 0;
    let totalVoltageSeries = 0;
    let totalEnergyCapacitySeries = 0;

    for (let i = 1; i < capacitanceInputs.length; i++) {
      const capacitance = parseFloat(capacitanceInputs[i].value) || 0;
      const capacitanceUnit = capacitanceUnitInputs[i].value;
      const voltage = parseFloat(voltageInputs[i].value) || 0;
      const voltageUnit = voltageUnitInputs[i].value;
      const energyCapacity = parseFloat(energyCapacityInputs[i].value) || 0;
      const energyCapacityUnit = energyCapacityUnitInputs[i].value;

      const capacitanceInSeries = convertToFarad(capacitance, capacitanceUnit);
      totalCapacitanceSeries += 1 / capacitanceInSeries;
      totalVoltageSeries += convertToVolt(voltage, voltageUnit);
      totalEnergyCapacitySeries += energyCapacity;
    }

    const totalCapacitanceParallel = 1 / totalCapacitanceSeries;
    const totalVoltageParallel = totalVoltageSeries;
    const totalEnergyCapacityParallel = totalEnergyCapacitySeries;

    const parallelSets = parseInt(parallelSetsInput.value) || 1;
    const totalCapacitance = totalCapacitanceParallel * parallelSets;
    const totalVoltage = totalVoltageParallel;
    const totalEnergyCapacity = totalEnergyCapacityParallel * parallelSets;

    totalCapacitanceElement.textContent = `Total Capacitance: ${totalCapacitance.toFixed(2)} F`;
    totalVoltageElement.textContent = `Total Voltage: ${totalVoltage.toFixed(2)} V`;
    totalEnergyCapacityElement.textContent = `Total Energy Capacity: ${totalEnergyCapacity.toFixed(2)} Wh`;
    totalEnergyCapacityJoulesElement.textContent = `Total Energy Capacity (Joules): ${convertToJoules(totalEnergyCapacity).toFixed(2)} J`;
    totalEnergyCapacityAhElement.textContent = `Total Energy Capacity (Ah): ${convertToAh(totalEnergyCapacity, totalVoltage).toFixed(2)} Ah`;
  }

  function convertToFarad(value, unit) {
    switch (unit) {
      case 'µF':
        return value * 1e-6;
      case 'nF':
        return value * 1e-9;
      default:
        return value;
    }
  }

  function convertToVolt(value, unit) {
    return unit === 'mV' ? value * 1e-3 : value;
  }

  function convertToJoules(value) {
    return value * 3600; // Convert Wh to Joules
  }

  function convertToAh(energyCapacity, voltage) {
    return (energyCapacity / voltage) * 2; // Divide Wh by V to get Ah
  }

  function getFirstRowValues() {
    const capacitanceInput = document.querySelector('.capacitance');
    const capacitanceUnitInput = document.querySelector('.capacitance-unit');
    const voltageInput = document.querySelector('.voltage');
    const voltageUnitInput = document.querySelector('.voltage-unit');
    const energyCapacityInput = document.querySelector('.energy-capacity');
    const energyCapacityUnitInput = document.querySelector('.energy-capacity-unit');

    return {
      capacitance: capacitanceInput.value,
      capacitanceUnit: capacitanceUnitInput.value,
      voltage: voltageInput.value,
      voltageUnit: voltageUnitInput.value,
      energyCapacity: energyCapacityInput.value,
      energyCapacityUnit: energyCapacityUnitInput.value,
    };
  }

  function setNewRowValues(row) {
    const capacitanceInput = row.querySelector('.capacitance');
    const capacitanceUnitInput = row.querySelector('.capacitance-unit');
    const voltageInput = row.querySelector('.voltage');
    const voltageUnitInput = row.querySelector('.voltage-unit');
    const energyCapacityInput = row.querySelector('.energy-capacity');
    const energyCapacityUnitInput = row.querySelector('.energy-capacity-unit');

    capacitanceInput.value = storedValues.capacitance || '';
    capacitanceUnitInput.value = storedValues.capacitanceUnit || 'F';
    voltageInput.value = storedValues.voltage || '';
    voltageUnitInput.value = storedValues.voltageUnit || 'V';
    energyCapacityInput.value = storedValues.energyCapacity || '';
    energyCapacityUnitInput.value = storedValues.energyCapacityUnit || 'Wh';
  }

  function updateStoredValues() {
    storedValues = getFirstRowValues();
  }

  function getFirstRowHTML() {
    return `
      <label>Capacitance:</label>
      <input type="number" class="capacitance" placeholder="Capacitance" value="">
      <select class="capacitance-unit">
        <option value="F">F</option>
        <option value="µF">µF</option>
        <option value="nF">nF</option>
      </select>
      <label>Voltage:</label>
      <input type="number" class="voltage" placeholder="Voltage" value="">
      <select class="voltage-unit">
        <option value="V">V</option>
        <option value="mV">mV</option>
      </select>
      <label>Energy Capacity:</label>
      <input type="number" class="energy-capacity" placeholder="Energy Capacity" value="">
      <select class="energy-capacity-unit">
        <option value="Wh">Wh</option>
        <option value="mWh">mWh</option>
      </select>
    `;
  }

  function getNewRowHTML() {
    return `
      <label>Capacitance:</label>
      <input type="number" class="capacitance" placeholder="Capacitance" value="">
      <select class="capacitance-unit">
        <option value="F">F</option>
        <option value="µF">µF</option>
        <option value="nF">nF</option>
      </select>
      <label>Voltage:</label>
      <input type="number" class="voltage" placeholder="Voltage" value="">
      <select class="voltage-unit">
        <option value="V">V</option>
        <option value="mV">mV</option>
      </select>
      <label>Energy Capacity:</label>
      <input type="number" class="energy-capacity" placeholder="Energy Capacity" value="">
      <select class="energy-capacity-unit">
        <option value="Wh">Wh</option>
        <option value="mWh">mWh</option>
      </select>
    `;
  }
});
