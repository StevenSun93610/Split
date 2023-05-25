const socket = io();


function addFriend(){
    const another = document.querySelector('.selectFriend').cloneNode(true);
    document.querySelector('.selectFriendDiv').appendChild(another);
}

function submitPaid(){
    const h = document.querySelector('.userName');
    const userName = h.textContent.slice(6);

    const remark = document.querySelector('.remark').value;

    const startPoint = document.querySelector('.selectedYes');
    const total = parseInt(startPoint.children[0].children[1].value);

    const people = [];
    let i = 0;
    while (startPoint.children[2].children[i]){
        const person = startPoint.children[2].children[i].value;
        if (person !== "Select Friend"){
            people.push(person);
        }
        i++;
    }

    const data = {userName, remark, total, people};
    console.log(data);
    socket.emit('startBillPaid', data);
}

function submitNotPaid(){
    const h = document.querySelector('.userName');
    const userName = h.textContent.slice(6);

    const remark = document.querySelector('.remark').value;

    const startPoint = document.querySelector('.selectedNo');
    const payer = startPoint.children[0].children[0].value;
    const total = parseInt(startPoint.children[0].children[2].value);
    const numOfPeople = parseInt(startPoint.children[1].children[1].value)

    const data = {userName, remark, payer, total, numOfPeople};
    console.log(data);
    socket.emit('startBillNotPaid', data);
}


function payOrNot(evt){
    const selected = document.querySelector('.payOrNot').value;
    // console.log(evt);
    if (selected === 'yes'){
        //display the interface for bill that you paid
        document.querySelector('.selectedNo').classList.add('hidden');
        document.querySelector('.selectedYes').classList.remove('hidden');

        //make an add friend button
        const addFriendBtn = document.querySelector('.addFriend');
        addFriendBtn.addEventListener('click', addFriend);

        //the btn to submit the content entered
        const submitPaidBtn = document.querySelector('.submitBillPaid');
        submitPaidBtn.addEventListener("click", submitPaid);
    }else if (selected === 'no'){
        document.querySelector('.selectedNo').classList.remove('hidden');
        document.querySelector('.selectedYes').classList.add('hidden');
        
        //the btn to submit the content entered
        const submitPaidBtn = document.querySelector('.submitBillNotPaid');
        submitPaidBtn.addEventListener("click", submitNotPaid);
    }
}

function main(){
    const select = document.querySelector('.payOrNot');
    if (select){
        select.addEventListener('change', payOrNot);
    }

}

socket.on('submitSuccess', () =>{
    document.querySelector('.startBillRoot').remove();
    const h = document.createElement('h1');
    h.textContent = "Success!";
    h.id = "success";
    document.querySelector('.body').appendChild(h);
});

socket.on('submitFail', () =>{
    window.alert("Something wrong with value entered, try again!");
})

document.addEventListener('DOMContentLoaded', main);