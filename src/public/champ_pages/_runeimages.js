
test = {
    "current": true,
    "name": "Test Submit",
    "primaryStyleId": 8000,
    "selectedPerkIds": [8005, 9111, 9104, 8017, 8306, 8352, 5007, 5008, 5002],
    "subStyleId": 8300,
}

// collapsible input
const coll = document.getElementsByClassName("collapsible");
for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        const content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
}

function openNav() {
    document.getElementById("sidebar").style.width = "150px";
    document.getElementById("main").style.marginLeft = "150px";
}
function closeNav() {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}


/*
const saverunes = document.getElementById('saverunes');
saverunes.addEventListener('click', async event => {
    test.champion = document.getElementById('champname').textContent;
    rune = test;
    api.data.saverunes(rune);
})
*/

window.onload = async event => {
    document.addEventListener('auxclick', event => event.preventDefault());
    let num = 0;
    let champ = document.getElementById('champname').textContent;
    api.data.newpage(champ, num);
    await new Promise(r => setTimeout(r, 50));
    api.data.getrunes(champ, num);
    api.data.runepage();
    await new Promise(r => setTimeout(r, 50));
    let runenum = document.getElementById('runenum').textContent;
    api.data.deleteRune(runenum);
    api.data.newpage(champ, num);
}

let page1 = document.getElementById('page1').addEventListener('click', async event => {
    let num = 0;
    let champ = document.getElementById('champname').textContent;
    api.data.newpage(champ, num);
    await new Promise(r => setTimeout(r, 50));
    api.data.getrunes(champ, num);
    api.data.runepage();
    await new Promise(r => setTimeout(r, 50));
    let runenum = document.getElementById('runenum').textContent;
    api.data.deleteRune(runenum);
    api.data.newpage(champ, num);
})

let page2 = document.getElementById('page2').addEventListener('click', async event => {
    let num = 1;
    let champ = document.getElementById('champname').textContent;
    api.data.newpage(champ, num);
    await new Promise(r => setTimeout(r, 50));
    api.data.getrunes(champ, num);
    api.data.runepage();
    await new Promise(r => setTimeout(r, 50));
    let runenum = document.getElementById('runenum').textContent;
    api.data.deleteRune(runenum);
    api.data.newpage(champ, num);
})
let page3 = document.getElementById('page3').addEventListener('click', async event => {
    let num = 2;
    let champ = document.getElementById('champname').textContent;
    api.data.newpage(champ, num);
    await new Promise(r => setTimeout(r, 50));
    api.data.getrunes(champ, num);
    api.data.runepage();
    await new Promise(r => setTimeout(r, 50));
    let runenum = document.getElementById('runenum').textContent;
    api.data.deleteRune(runenum);
    api.data.newpage(champ, num);
})
let page4 = document.getElementById('page4').addEventListener('click', async event => {
    let num = 3;
    let champ = document.getElementById('champname').textContent;
    api.data.newpage(champ, num);
    await new Promise(r => setTimeout(r, 50));
    api.data.getrunes(champ, num);
    api.data.runepage();
    await new Promise(r => setTimeout(r, 50));
    let runenum = document.getElementById('runenum').textContent;
    api.data.deleteRune(runenum);
    api.data.newpage(champ, num);
})
let page5 = document.getElementById('page5').addEventListener('click', async event => {
    let num = 4;
    let champ = document.getElementById('champname').textContent;
    api.data.newpage(champ, num);
    await new Promise(r => setTimeout(r, 50));
    api.data.getrunes(champ, num);
    api.data.runepage();
    await new Promise(r => setTimeout(r, 50));
    let runenum = document.getElementById('runenum').textContent;
    api.data.deleteRune(runenum);
    api.data.newpage(champ, num);
})

// Saves rune from client to database
const saveclient = document.getElementById('saveclient');
saveclient.addEventListener('click', async event => {
    let champ = document.getElementById('champname').textContent;
    api.data.saveclient(champ);
})
// Deletes page from database
const deletepage = document.getElementById('deletepage');
deletepage.addEventListener('click', async event => {
    let champ = document.getElementById('champname').textContent;
    let runenumber = document.getElementById('currentnum').textContent;
    api.data.deletepage(champ, runenumber);})