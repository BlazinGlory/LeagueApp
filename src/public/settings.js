$('#directory').on('click', () => {
    api.selectFolder()
})


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