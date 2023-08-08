const inputSlider = document.querySelector("[deta-lengthSlider]");  //it is taken by costum Attribute

const lengthDisplay = document.querySelector("[deta-lengthNumber]");

const passwordDisplay= document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator= document.querySelector("[data-indicator]");
const generateBtn= document.querySelector(".generateButton");
const allCheckBox= document.querySelectorAll("input[type=checkbox]");
const symbols = '!@#$%^&*()-+_=^[]{}\|":;<>/?/';


let password="";
let passwordLength=10;  //by default
let checkCount= 0;

handleSlider();

//set indicator color
setIndicator("#ccc");


//set password lenght by slider
function handleSlider()
{
    inputSlider.value= passwordLength;
    lengthDisplay.innerText= passwordLength;

    //update color length of slider
    // const mi= inputSlider.min;
    // const ma= inputSlider.max;
    // inputSlider.style.backgroundSize = ( (passwordLength-mi)*100/(ma-mi) )+ "% 100" 
}

//set indicator

function setIndicator(color)
{  
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow =`0px 0px 12px 1px ${color}`
}

//get any random integer

function getRndInteger(min,max)
{
   return Math.floor(Math.random() * (max-min)) + min;  //1ST range is 0-1 then 0 to max-min ho gye  then min+ (max- min) ho gye
}

function generateRandomNumber(){
   return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));  //give ascii val of a ans z
    // String.fromCharCode() ---convert no to char
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));    //give ascii val of a ans z
}

function generateSymbol(){
   const rnd= getRndInteger(0,symbols.length);
   return symbols.charAt(rnd);
}

function calcStrength() 
{
    let hasupper=false;
    let haslower=false;
    let hasnum=false;
    let hassym=false;
    if(uppercaseCheck.checked) hasupper= true;
    if(lowercaseCheck.checked) haslower= true;
    if(numbersCheck.checked) hasnum= true;
    if(symbolsCheck.checked) hassym= true;

    if(hasupper && haslower && (hasnum||hassym) && passwordLength >=8) {
        setIndicator("#0f0");
    }
    else if((hasupper || haslower) && (hasnum || hassym)&& passwordLength >=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);  //it copy the password displayed onb screen & it return promise so we use async function
        copyMsg.innerText="Copied";   //await shows jb copy compleate hoga tbhi copied msg show hoga
    }
    catch(e){
        copyMsg.innerText="Failed";
    }

    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");     //2 sec bad invisible kr do copied msg ko
    }, 2000);
    
}

function sufflePassword(array) {
    //Fisher yates Method
    for(let i= array.length -1 ; i>0;i--){
        const j =Math.floor(Math.random() * (i+1));   // generate random num. b/w 0 to i+1(exclusive)
        const temp = array[i];
        array[i]= array[j];
        array[j]= temp;
    }
     
    let str= "";
    array.forEach((e) =>{
        str+=e;
    })
    return str;
}

function handleCheckBoxChange(){
    checkCount= 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.ckecked){
            checkCount++;
        }
    });
    if(passwordLength < checkCount){
        passwordLength= checkCount;
        console.log("nand33");
        handleSlider();
        console.log("nand44");
    }
}

allCheckBox.forEach((checkbox) =>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e)=>{
    passwordLength= e.target.value;   //e.target.value jha slider hoga whi value dega as e.target inner val ko show krta h
    handleSlider();
})

copyBtn.addEventListener('click' , ()=>{
    if(passwordDisplay.value)
       copyContent();
})

generateBtn.addEventListener('click' ,()=>{

    //none of the check box are selected-- no password generate

    // if(checkCount == 0) return;

    ////if password length is less than check count
    if(passwordLength < checkCount){
        passwordLength= checkCount;
        handleSlider();
    }

    // lets make new password

    //remove old password
    password="";

    //lets put the condition filled by user on checkboxes for password

    let funcArr=[];
    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

        //compulsory  Addition
    for(let i=0;i<funcArr.length;i++){
        password += funcArr[i]();
    }    

    //random Addition of remaining password
    for(let i=0; i< passwordLength-funcArr.length; i++)
    {
        let randomIndex = getRndInteger(0,funcArr.length);
        password += funcArr[randomIndex]();
    }

    //mix the password by rearranging its characters

    password = sufflePassword(Array.from(password));   //Array.from --- array me convert kr dega password ko

    //show password in UI
    passwordDisplay.value= password;

    //calculate strength of password
    calcStrength();
});

