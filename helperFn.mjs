
const split = function(friendObjArr, peopleArr, total){

    const unique = peopleArr.reduce((arr, person) =>{
        if (!arr.includes(person)){
            arr.push(person);
        }
        return arr;
    }, []);

    const splited = total / (unique.length + 1);
    friendObjArr.forEach(friendObj =>{
        if (unique.includes(friendObj.friendName)){
            friendObj.balance += splited;
        }
    })
    

    return friendObjArr;
};

const inOrNot = function(foundFriend, friendName, balance){
    const nameArr = foundFriend.map(friendObj => friendObj.friendName);
    if (!nameArr.includes(friendName)){
        const newFriendObj = {friendName, balance};
        foundFriend.push(newFriendObj);
    }
    return foundFriend;
}


const generatePeopleArr = function(total, people){
    const unique = [];
    people.forEach(person =>{
        if (!unique.includes(person)){
            unique.push(person);
        }
    })
    // const output = [];
    return unique.reduce((output, person)=>{
        const personObj = {
            userName: person,
            amount: 0,
        };
        output.push(personObj);
        return output;
    }, []);
    // unique.forEach(person =>{
    //     const personObj = {
    //         userName: person,
    //         amount: 0,
    //     };
    //     output.push(personObj);
    // })
    // return output;
}


export {
    split,
    inOrNot,
    generatePeopleArr
};
