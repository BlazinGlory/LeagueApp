try {
    $('#submit').on('click', () => {
        api.data.name(document.getElementById('name').value);
    })
} catch (error) {
    console.log('error with api call')
}

$('#directory').on('click', () => {
    api.selectFolder()
})



// Pull LCU values on load
window.onload = async event => {
    api.lcu();
    hidegrid();
    document.addEventListener('auxclick', event => event.preventDefault());
}
// Manually pull LCU values
$('#lcupull').on('click', () => {
    let lcuValues = api.lcu();
})

function openNav() {
    try {
        document.getElementById("sidebar").style.width = "150px";
        document.getElementById("main").style.marginLeft = "150px";
    } catch {
        console.log('error opening sidebar')
    }

}
function closeNav() {
    try {
        document.getElementById("sidebar").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
    } catch {
        console.log('error closing sidebar')
    }
}

/*
async function hidegrid() {
    $('#choosechamp').on('change textInput input', async function () {
        search = document.getElementById('choosechamp').value;
        api.data.searchchamps(search);
    })
}
*/

function setfilter(role) {
    $('.filterbtn').removeClass('active');
    document.getElementById('rolefilter').value = role;
    console.log(document.getElementById('rolefilter').value)
    document.getElementById(role.toLowerCase()).classList.add("active");

    let search = document.getElementById('choosechamp').value;
    api.data.searchchamps(search, role);
}

async function hidegrid() {
    $('#choosechamp').on('change textInput input', async function () {
        let search = document.getElementById('choosechamp').value;
        let role = document.getElementById('rolefilter').value;
        api.data.searchchamps(search, role);
    })
    $('#searchchamp').on('click', async function () {
        let search = document.getElementById('choosechamp').value;
        let role = document.getElementById('rolefilter').value;
        api.data.searchchamps(search, role);
    })

}