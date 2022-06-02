

$('#matchsearch').on('click', () => {
    let tier = document.getElementById('tier').textContent;
    let div = document.getElementById('division').textContent;
    api.data.matchsearch(tier, div);
})

function setTier(tier) {
    $('.tierbtn').removeClass('active');
    document.getElementById('tier').textContent = tier;
    console.log(document.getElementById('tier').textContent)
    document.getElementById(tier.toUpperCase()).classList.add("active");
}
function setDiv(div) {
    $('.divbtn').removeClass('active');
    document.getElementById('division').textContent = div;
    console.log(document.getElementById('division').textContent)
    document.getElementById(div.toUpperCase()).classList.add("active");
}