let copartData = {};
let iaaiData = {};
let usdRate = 0;
let euroRate = 0;
let euroToUsd = 0;

function changeEngineType() {
  const engineType = document.getElementById('engineType').value;
  const batteryElement = document.getElementById('battery');
  const engineVolumeElement = document.getElementById('engine-volume');

  if (engineType === 'electro') {
    batteryElement.disabled = false;
    engineVolumeElement.disabled = true;
    engineVolumeElement.style.display = 'none';
    batteryElement.style.display = 'block';
  } else {
    batteryElement.disabled = true;
    engineVolumeElement.disabled = false;
    batteryElement.style.display = 'none';
    engineVolumeElement.style.display = 'block';
  }
}

function calculateFee(price, auctionType = "copart") {
  
  const copartFees = [
    { max: 199.99, fee: 205 },
    { max: 299.99, fee: 240 },
    { max: 349.99, fee: 265 },
    { max: 399.99, fee: 280 },
    { max: 449.99, fee: 305 },
    { max: 499.99, fee: 315 },
    { max: 549.99, fee: 340 },
    { max: 599.99, fee: 350 },
    { max: 699.99, fee: 365 },
    { max: 799.99, fee: 390 },
    { max: 899.99, fee: 410 },
    { max: 999.99, fee: 425 },
    { max: 1199.99, fee: 465 },
    { max: 1299.99, fee: 485 },
    { max: 1399.99, fee: 500 },
    { max: 1499.99, fee: 515 },
    { max: 1599.99, fee: 530 },
    { max: 1699.99, fee: 555 },
    { max: 1799.99, fee: 575 },
    { max: 1999.99, fee: 595 },
    { max: 2399.99, fee: 630 },
    { max: 2499.99, fee: 665 },
    { max: 2999.99, fee: 700 },
    { max: 3499.99, fee: 745 },
    { max: 3999.99, fee: 810 },
    { max: 4499.99, fee: 855 },
    { max: 4999.99, fee: 880 },
    { max: 5499.99, fee: 905 },
    { max: 5999.99, fee: 930 },
    { max: 6499.99, fee: 975 },
    { max: 6999.99, fee: 995 },
    { max: 7499.99, fee: 1030 },
    { max: 7999.99, fee: 1050 },
    { max: 8499.99, fee: 1090 },
    { max: 9999.99, fee: 1110 },
    { max: 10499.99, fee: 1140 },
    { max: 10999.99, fee: 1140 },
    { max: 11499.99, fee: 1140 },
    { max: 11999.99, fee: 1150 },
    { max: 12499.99, fee: 1165 },
    { max: 14999.99, fee: 1180 },
    { max: Infinity, fee: (price) => 0.06 * price + 290 } // $15,000+
  ];
  
  const iaaiFees = [
    { max: 199.99, fee: 230 },
    { max: 299.99, fee: 265 },
    { max: 349.99, fee: 290 },
    { max: 399.99, fee: 305 },
    { max: 449.99, fee: 330 },
    { max: 499.99, fee: 340 },
    { max: 549.99, fee: 365 },
    { max: 599.99, fee: 375 },
    { max: 699.99, fee: 390 },
    { max: 799.99, fee: 415 },
    { max: 899.99, fee: 435 },
    { max: 999.99, fee: 450 },
    { max: 1199.99, fee: 490 },
    { max: 1299.99, fee: 510 },
    { max: 1399.99, fee: 525 },
    { max: 1499.99, fee: 540 },
    { max: 1599.99, fee: 565 },
    { max: 1699.99, fee: 580 },
    { max: 1799.99, fee: 600 },
    { max: 1999.99, fee: 620 },
    { max: 2399.99, fee: 655 },
    { max: 2499.99, fee: 690 },
    { max: 2999.99, fee: 725 },
    { max: 3499.99, fee: 770 },
    { max: 3999.99, fee: 820 },
    { max: 4499.99, fee: 885 },
    { max: 4999.99, fee: 910 },
    { max: 5499.99, fee: 935 },
    { max: 5999.99, fee: 965 },
    { max: 6499.99, fee: 1010 },
    { max: 6999.99, fee: 1030 },
    { max: 7499.99, fee: 1065 },
    { max: 7999.99, fee: 1085 },
    { max: 8499.99, fee: 1125 },
    { max: 9999.99, fee: 1145 },
    { max: 11499.99, fee: 1175 },
    { max: 11999.99, fee: 1185 },
    { max: 12499.99, fee: 1200 },
    { max: 14999.99, fee: 1215 },
    { max: Infinity, fee: (price) => 0.06 * price + 325 } // $15,000+
  ];

  const fees = auctionType === "iaai" ? iaaiFees : copartFees;
  for (const range of fees) {
    if (price <= range.max) {
      return typeof range.fee === "function" ? range.fee(price) : range.fee;
    }
  }
  throw new Error("Invalid price");
}

function calc() {
  const searchValue = document.getElementById('search').value.trim();
  const fixPrice = parseFloat(document.getElementById('fixPrice').value);
  const priceCar = parseFloat(document.getElementById('pokupka').value);
  const auctionType = getSelectedAuctionType();
  const selectedCity = getSelectedCity();
  const engineType = document.getElementById('engineType').value;
  const volume = parseFloat(document.getElementById('volume').value) / 1000;
  const batteryVolume = parseFloat(document.getElementById('battery-input').value);
  const yearKlaipeda = document.getElementById('year').value;
  if (isNaN(fixPrice) || !searchValue || isNaN(priceCar) || !auctionType || !selectedCity || !(isNaN(volume) ^ isNaN(batteryVolume)) || isNaN(yearKlaipeda)) {
    return;
  }

  if (priceCar < 0) {
    alert('Будь ласка, введіть коректну вартість покупки автомобіля.');
    return;
  }
  
  if (fixPrice < 0) {
    alert('Будь ласка, введіть коректну вартість ремонту автомобіля.');
    return;
  }
  
  const service = 500;
  const BEP = 550;

  const data = auctionType === 'iaai' ? iaaiData : copartData;

  const cityPrices = data[searchValue];

  if (cityPrices !== undefined) {
    let kompleksValue, kompleksDisplay;
    if (selectedCity === 'kyiv') {
        kompleksValue = 1250;
        kompleksDisplay = 'Клайпеда-Київ $1250';
    } else if (selectedCity === 'lviv') {
        kompleksValue = 1050;
        kompleksDisplay = 'Клайпеда-Львів $1050';
    } else {
        kompleksValue = 0;
        kompleksDisplay = '-';
    }

    let zbir;
    try {
      zbir = calculateFee(priceCar, auctionType);
    } catch (error) {
      alert('Помилка при розрахунку аукційного збору.');
      console.error(error);
      return;
    }
    
    const carpriceandzbir = priceCar + zbir;
    const strahuvanya = carpriceandzbir * 0.01;
    let swift = (priceCar + zbir) * 0.026 + 100;

    let acciseSum = 0;
    let mitoValue = 0;
    let pdvValue = 0;
    let hazardous = 0;

    if (engineType === "diesel") {
        acciseSum = 75 * volume;
        acciseSum *= volume > 3.5 ? 2 : 1;
        acciseSum *= (parseFloat(yearKlaipeda));
    } else if (engineType === "petrol") {
        acciseSum = 50 * volume;
        acciseSum *= volume > 3 ? 2 : 1;
        acciseSum *= (parseFloat(yearKlaipeda));
    } else if (engineType === "electro") {
        acciseSum = batteryVolume;
    }
    acciseSum *= euroToUsd;

    if (engineType !== "electro") {
      mitoValue = (carpriceandzbir + 1600) * 0.1;
      pdvValue = (carpriceandzbir + mitoValue + acciseSum + 1600) * 0.2 + 10;
    }
    else {
      hazardous = 100;
    }

    document.getElementById('mito').textContent = `$${mitoValue.toFixed(2)}`;
    document.getElementById('pdv').textContent = `$${pdvValue.toFixed(2)}`;
    document.getElementById('accise').textContent = `$${acciseSum.toFixed(2)}`;
    
    document.getElementById('us-delivery').textContent = `$${cityPrices.toFixed(2)}`;
    document.getElementById('service').textContent = `$${service.toFixed(2)}`;
    document.getElementById('kompleks').textContent = `${kompleksDisplay}`;
    document.getElementById('strahuvanya').textContent = `$${strahuvanya.toFixed(2)}`;
    document.getElementById('hazardous').textContent = `$${hazardous.toFixed(2)}`;
    document.getElementById('swift').textContent = `$${swift.toFixed(2)}`;
    document.getElementById('zbir').textContent = `$${zbir.toFixed(2)}`;
    document.getElementById('BEP').textContent = `$${BEP.toFixed(2)}`;

    // Розрахувати загальну ціну
    const totalPrice = cityPrices + service + kompleksValue + priceCar + strahuvanya + zbir + fixPrice + BEP + swift + mitoValue + pdvValue + acciseSum + hazardous;
    document.getElementById('total-price').textContent = `$${totalPrice.toFixed(2)}`;

    // Additional calculations
    
  } else {
    // Якщо місто не знайдено
    alert('Місто не знайдено. Будь ласка, перевірте введення.');
  }
}

function getSelectedAuctionType() {
  const auctionModeSwitch = document.getElementById('auction_mode');
  return auctionModeSwitch.checked ? 'iaai' : 'copart';
}

function getSelectedCity() {
  const cityModeSwitch = document.getElementById('city_mode');
  return cityModeSwitch.checked ? 'kyiv' : 'lviv';
}

function updateDatalist() {
  const auctionType = getSelectedAuctionType();
  const selectedCity = getSelectedCity();
  const cityList = document.getElementById('city-list');
  cityList.innerHTML = '';

  const data = auctionType === 'iaai' ? iaaiData : copartData;
  const cities = Object.keys(data);

  cities.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    cityList.appendChild(option);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await axios.get('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
        const usdObject = response.data.find(obj => obj.txt === "Долар США");
        const euroObject = response.data.find(obj => obj.txt === "Євро");
        
        usdRate = usdObject.rate;
        euroRate = euroObject.rate;
        euroToUsd = euroRate / usdRate;
        
        console.log('USD Rate:', usdRate);
        console.log('Euro Rate:', euroRate);
        console.log('Euro to USD Rate:', euroToUsd);
    } catch (error) {
        console.error('Error fetching currency rates:', error);
        alert('Помилка отримання курсів валют. Використовуються значення за замовчуванням.');
        usdRate = 37.5;
        euroRate = 40.5;
        euroToUsd = 1.04;
    }

    const yearSelect = document.getElementById('year');
    const volumeSelect = document.getElementById('volume');
      
    for (let i = 1; i <= 15; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i;
      yearSelect.appendChild(option);
    }

    // Populate volume options dynamically
    for (let i = 100; i <= 10000; i += 100) {
      const option = document.createElement('option');
      option.value = i / 100;
      option.textContent = (i / 100).toFixed(1);
      volumeSelect.appendChild(option);
    }

    Promise.all([
      fetch('./copart.json').then(response => response.json()),
      fetch('./iaai.json').then(response => response.json())
    ])
    .then(([copart, iaai]) => {
      copartData = copart;
      iaaiData = iaai;
      updateDatalist();
    })
    .catch(error => {
      console.error('Помилка завантаження JSON файлів:', error);
      alert('Не вдалося завантажити дані. Будь ласка, спробуйте пізніше.');
    });

    const auctionRadios = document.getElementsByName('auction');
    auctionRadios.forEach(radio => {
      radio.addEventListener('change', updateDatalist);
    });
  
    document.getElementById('calculate-btn').addEventListener('click', calc);
});