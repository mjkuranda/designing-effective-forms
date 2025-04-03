let clickCount = 0;

const countryInput = document.getElementById('country');
const myForm = document.getElementById('form');
const modal = document.getElementById('form-feedback-modal');
const clicksInfo = document.getElementById('click-count');
let choices = null;

function handleClick() {
    clickCount++;
    clicksInfo.innerText = clickCount;
}

function handleClickVAT() {
    document.getElementById('vat-section').style.display = this.checked ? 'block' : 'none';
}

async function fetchAndFillCountries() {
    choices = new Choices(countryInput, {
        searchEnabled: true,
        shouldSort: false, // Zachowuje kolejność
        placeholder: true,
        placeholderValue: "Wybierz kraj"
    });

    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        const data = await response.json();
        const countries = data.map(country => country.name.common);
        // countryInput.innerHTML = countries.map(country => `<option value="${country}">${country}</option>`).join('');

        choices.setChoices(
            countries.map(country => ({
                value: country,
                label: country
            })),
            'value',
            'label',
            true // Wymusza odświeżenie
        );
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
}

function getCountryByIP() {
    fetch('https://get.geojs.io/v1/ip/geo.json')
        .then(response => response.json())
        .then(data => {
            const countryName = data.country;
            
            // document.getElementById('country').value = countryName;
            choices.setChoiceByValue(countryName);
            getCountryCode(countryName);
        })
        .catch(error => {
            console.error('Błąd pobierania danych z serwera GeoJS:', error);
        });
}

function getCountryCode(countryName) {
    const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Błąd pobierania danych');
        }
        return response.json();
    })
    .then(data => {        
        const countryCode = data[0].idd.root + data[0].idd.suffixes.join("")

        document.getElementById('countryCode').value = countryCode;
    })
    .catch(error => {
        console.error('Wystąpił błąd:', error);
    });
}


(() => {
    // nasłuchiwania na zdarzenie kliknięcia myszką
    document.addEventListener('click', handleClick);
    document.getElementById('vatUE').addEventListener('change', handleClickVAT);

    document.addEventListener('DOMContentLoaded', function () {
        new Choices('#country', { searchEnabled: true, removeItemButton: false });
    });   

    getCountryByIP();
    fetchAndFillCountries();
})()
