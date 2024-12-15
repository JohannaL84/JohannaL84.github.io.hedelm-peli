// Määritellään muttujat
const slotImages = ["IMG/apple.png", "IMG/cherry.png", "IMG/watermelon.png", "IMG/pear.png", "IMG/seven.png"];
const reels = document.querySelectorAll(".rulla img");
let firstRound = true; 
let locked = [false, false, false, false]; 
let money = parseInt(document.getElementsByName("money")[0].value);
let bet = parseInt(document.getElementsByName("bet")[0].value);
let currentMoney = document.getElementById("money");
document.getElementById("viesti").innerText = "Käynnistä painamalla pyöritä!";

// Tehdään toiminto, jolla voidaan rullat lukita/vapauttaa
reels.forEach((rulla, i) => {
    rulla.addEventListener("click", () => {
        if (!firstRound) { 
            locked[i] = !locked[i]; 
            rulla.parentElement.style.border = locked[i] ? '2px solid red' : '';
        } else {
            document.getElementById("viesti").innerText = "Tällä kierroksella rullia ei voi lukita!";
        }
    });
});

// Funktio pyörittää rullia
function DoSpin() {
    money = parseInt(document.getElementsByName("money")[0].value);
    if (firstRound) {
        bet = parseInt(document.getElementsByName("bet")[0].value);
    }

    // Toiminnolla tarkistetaan panoksen suuruus. Mikäli se on suurempi, kuin pelaajan raha, ilmoitetaan siitä
    if (bet > money) {
        document.getElementById("viesti").innerText = "Rahaa ei ole tarpeeksi.";
        return;
    }
    
    // Ensimmäillä kierroksella päivitetään rahat
    if (firstRound) {
        money -= bet;
        currentMoney.value = money;
    }

    document.getElementById("viesti").innerText = '';

    // Kuvien arvonta rullille
    reels.forEach((rulla, i) => {
        if (!locked[i]) {
            let randomIndex = Math.floor(Math.random() * slotImages.length);
            rulla.src = slotImages[randomIndex];
        }
    })


   let voitto = tarkistaVoitto(bet);
   if (voitto > 0 || !firstRound) {
       locked = [false, false, false, false]; 
       reels.forEach(rulla => rulla.parentElement.style.border = ''); // Avataan rullat seuraavalle pelikierrokselle
       firstRound = true; // Ensimmäisen kierroksen nollaus
   } else {
       firstRound = false; // Jos ei ole ensimmäinen kierros, voi lukita rullat
       document.getElementById("viesti").innerText = "Lukitse valitsemasi rullat ja pyöritä.";
   }
}

// Funktio tarkastaa voiton ja antaa kuville kertoimet
function tarkistaVoitto(bet) {
    const tulokset = Array.from(reels).map(rulla => rulla.src);
    const factor = {
        "seven": 10,
        "pear": 4,
        "watermelon": 5,
        "cherry": 3,
        "apple": 6
    };

    let voitto = 0;

    // Kertoimet, jossa kuvia on neljä samaa
    if (tulokset.every(src => src === tulokset[0])) {
        let hedelma = tulokset[0].split('/').pop().split('.')[0]; 
        voitto = factor[hedelma] * bet;
    }
    // Kertoimet, jossa on kolme 7
    else if (tulokset.filter(src => src.includes("seven")).length === 3) {
        voitto = 5 * bet;
    }

    // Vointon ilmoitus ja rahan päivitys
    if (voitto > 0) {
        document.getElementById("viesti").innerText = `Voitit ${voitto}€!`;
        money += voitto;    
        currentMoney.value = money;
    } else {
        document.getElementById("viesti").innerText = "Et voittanut tällä kertaa.";
    }

    return voitto;
}
