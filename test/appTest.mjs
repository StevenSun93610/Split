import assert from 'assert';
import * as helperFn from "../helperFn.mjs";
import {Builder, By, Key, Select} from 'selenium-webdriver';
// import org.openqa.selenium.support.ui.Select;




describe("Split", function(){
    it("function should return a updated version of the friendObjArr", function(){
        const foundFriend = [
            {friendName: "steven", balance: 0},
            {friendName: "Jack", balance:100}
        ];
        const people = ["steven"];
        const total = 30;
        const output = helperFn.split(foundFriend, people, total);
        assert.equal(output[0].balance, 15);
    })
    it("function should return a updated version of the friendObjArr for all friends", function(){
        const foundFriend = [
            {friendName: "steven", balance: 0},
            {friendName: "Jack", balance:100}
        ];
        const people = ["steven", "Jack"];
        const total = 30;
        const output = helperFn.split(foundFriend, people, total);
        assert.equal(output[0].balance, 10);
    })
})

describe('inOrNot', function(){
    it('Should not add friend when the friend already exists', function(){
        const foundFriend = [
            {friendName: "steven", balance: 0},
            {friendName: "Jack", balance:100}
        ]
        const length = foundFriend.length;
        const output = helperFn.inOrNot(foundFriend, "steven", 200);
        assert.equal(output.length, length);
    })

    it('Should add friend when the friend does not exist', function(){
        const foundFriend = [
            {friendName: "steven", balance: 0},
            {friendName: "Jack", balance: 100}
        ]
        const length = foundFriend.length;
        const output = helperFn.inOrNot(foundFriend, "Alex", 200);
        assert.equal(output.length, length + 1);
    })
})

describe('generatePeopleArr', function(){
    it('Mimic case when everything works fine', function(){
        const people = ['steven', 'Alex', 'Jack'];
        const output = helperFn.generatePeopleArr(0, people);
        assert.equal(output.length, people.length);
    });

    it('When there are duplicated names', function(){
        const people = ['steven', 'steven', 'Jack'];
        const output = helperFn.generatePeopleArr(0, people);
        assert.equal(output.length, people.length - 1);
    })
})

describe('Add a friend', async function(){
    it('Adding a new friend', async function(){
        let driver = await new Builder().forBrowser('firefox').build();
        let url = "http://localhost:3000/";
        //login
        await driver.get(url); 
        await driver.findElement(By.id('username')).sendKeys("Joker93610");
        await driver.findElement(By.id('password')).sendKeys('00000000');
        await driver.findElement(By.id('login')).click();

        //index
        await driver.findElement(By.id('friends')).click();
        //friends
        await driver.findElement(By.id('addFriend')).click();
        //addFriend
        await driver.findElement(By.id('addFriendForm')).sendKeys("newFriend");
        await driver.findElement(By.id('addFriendBtn')).click();
        

        //friends
        const compareText = await driver.findElement(By.xpath('//li[last()]')).getText().then(function(value){
            return value;
        })


        assert.equal(compareText.split(' ')[0], "newFriend");
        // await driver.quit();
    });

    it('Adding a existing friend', async function(){
        let driver = await new Builder().forBrowser('firefox').build();
        let url = "http://localhost:3000/";
        //login
        await driver.get(url); 
        await driver.findElement(By.id('username')).sendKeys("Joker93610");
        await driver.findElement(By.id('password')).sendKeys('00000000');
        await driver.findElement(By.id('login')).click();

        //index
        await driver.findElement(By.id('friends')).click();
        //friends
        await driver.findElement(By.id('addFriend')).click();
        //addFriend
        await driver.findElement(By.id('addFriendForm')).sendKeys("Steven");
        await driver.findElement(By.id('addFriendBtn')).click();
        //friends
        const compareText = await driver.findElement(By.xpath('//li[last()]')).getText().then(function(value){
            return value;
        })
        assert.equal(compareText.split(' ')[0] !== "Steven", true);
        // await driver.quit();
    })

    describe('Add bill', async function(){
        it('Adding with bad input', async function(){
            let driver = await new Builder().forBrowser('firefox').build();
            let url = "http://localhost:3000/";
            //login
            await driver.get(url); 
            await driver.findElement(By.id('username')).sendKeys("Joker93610");
            await driver.findElement(By.id('password')).sendKeys('00000000');
            await driver.findElement(By.id('login')).click();
    
            //index
            await driver.findElement(By.id('startBill')).click();
            //startBill
            await driver.findElement(By.id('payOrNot')).sendKeys('Yes');
            await driver.findElement(By.id('submitBillPaid')).click();
        
            //should get alert
            try{
                await driver.findElement(By.id('success'));
                assert.equal(1,0);
            }catch (err){
                assert.equal(1,1);
            }
            // await driver.quit();
        });

        it('Adding with valid input', async function(){
            let driver = await new Builder().forBrowser('firefox').build();
            let url = "http://localhost:3000/";
            //login
            await driver.get(url); 
            await driver.findElement(By.id('username')).sendKeys("Joker93610");
            await driver.findElement(By.id('password')).sendKeys('00000000');
            await driver.findElement(By.id('login')).click();
    
            //index
            await driver.findElement(By.id('startBill')).click();
            //startBill
            await driver.findElement(By.id('payOrNot')).sendKeys('Yes');
            await driver.findElement(By.id('remark')).sendKeys('newBill');
            await driver.findElement(By.id('total')).sendKeys('200');
            await driver.findElement(By.id('submitBillPaid')).click();
            //should get a message of success
            try{
                await driver.findElement(By.id('success'));
                assert.equal(1,1);
            }catch (err){
                assert.equal(1,0);
            }
            // await driver.quit();
        });
    })


    
    

})
