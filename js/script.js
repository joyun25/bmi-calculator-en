const button = document.querySelector('.button');
const heightInput = document.querySelector('.height');
const weightInput = document.querySelector('.weight');
const tbody = document.querySelector('tbody');

// Set Up LocalStorage
let bmiData;
if(localStorage.getItem('bmiData') === null){
    bmiData = [];
}else{
    bmiData = JSON.parse(localStorage.getItem('bmiData'));
}
renderData();

// Press Key Enter
heightInput.addEventListener('keypress', e => {
    if(e.key == 'Enter') {
        calculate();
    }
});
weightInput.addEventListener('keypress', e => {
    if(e.key == 'Enter') {
        calculate();
    }
});

// Button Event Listener
button.addEventListener('click', calculate);

// Round to the second decimal place
function roundTo( num, decimal ) {
    return Math.round( ( num + Number.EPSILON ) * Math.pow( 10, decimal ) ) / Math.pow( 10, decimal );
}

function calculate() {
    const height = parseInt(heightInput.value.trim());
    const weight = parseInt(weightInput.value.trim());
    let date = new Date().toISOString().slice(0, 10);
    if (height <= 0 || weight <= 0 || heightInput.value == '' || weightInput.value == '') {
        alert('Please enter a number greater than 0');
        return
    }else{
        let bmi = roundTo(weight / ((height * 0.01) ** 2), 2);
        let color;
        let state;
        if (bmi <= 18.5) {
            color = "blue";
            state = "Underweight";
        }else if(bmi > 18.5 && bmi <= 25){
            color = "green";
            state = "Normal weight";
        }else if(bmi > 25 && bmi <= 30){
            color = "lightOrange";
            state = "Overweight";
        }else if(bmi > 30 && bmi <= 35){
            color = "strongOrange";
            state = "Obesity class I";
        }else if(bmi > 35 && bmi <= 40){
            color = "strongOrange";
            state = "Obesity class II";
        }else if(bmi > 40){
            color = "red";
            state = "Obesity class III";
        }else{
            alert('Numerical calculation error');
            return
        }
        button.innerHTML = `
            <a href="#" class="result btn_${color}"><span>${bmi}</span>BMI</a>
            <p class="${color}">${state}</p>
        `;
        let data = {
            "height": height,
            "weight": weight,
            "bmi": bmi,
            "color": color,
            "state": state,
            "date": date
        };
        bmiData.push(data);
        if (bmiData.length > 10) {
            bmiData.shift();
        }
        localStorage.setItem('bmiData', JSON.stringify(bmiData));
        renderData();
    }
}

function renderData(){
    let str = '';
    bmiData.slice().reverse().forEach(element => {
        str +=`
            <tr>
                <td class="state-${element.color}"></td>
                <td>${element.state}</td>
                <td><span>BMI</span> ${element.bmi}</td>
                <td><span>weight</span> ${element.weight}kg</td>
                <td><span>height</span> ${element.height}cm</td>
                <td><span>${element.date}</span></td>
            </tr>
        `;
    });
    tbody.innerHTML = str;
}