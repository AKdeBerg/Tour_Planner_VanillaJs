//Momentjs 
import moment from 'moment';

//FIRST IMPORT THE db FOR FIRESTORE
import {db} from "./add-tour.js";

//Getting the document ID from URL
 const tourId = location.hash.substring(1);

/*START*/
//I first need to create data structure 
//to hold the plan information
//This is what I am doing here
const planObj = {
    planDate: '',
    planTitle: '',
    planActivity: ''
};
/*END*/

//Date related
let startDate = document.querySelector("#start-date");

//Submitting forms
/*START*/
//When you submit the form this way,
//the submit event fires right before the request is sent to the server.
let form = document.getElementById('add-Plan-id');
if(form) {
    form.addEventListener('submit', (event) => {
        //you can prevent default behaviour
        event.preventDefault();

        /*****Relevant Code******/
        let parsedFirstDate = moment(startDate.value);

        //Plan Description
        const planTitleField = document.querySelector("#plan").value;

        //Plan Activity Related
        const planActivityField = document.querySelector("#activity").value;

        //Now add these values to object
        planObj.planDate = parsedFirstDate.format('LL'); //moment().format("MMM Do YYYY"); 
        planObj.planTitle = planTitleField;
        planObj.planActivity = planActivityField;

        //adding to firestore
        db.collection("tours").doc(tourId).collection("plans").add(planObj)
        .then(function(docRef) {
            //After the document is sent to firestore
            //and saved; I wanna reload
            location.reload();            
        })
        .catch(function(error) {
            //Subject to change
            console.error("Error adding document: ", error);
        });

        //Reset the Form
        document.getElementById("add-Plan-id").reset();
        /*****Relevant Code******/
    });
    
       
}
/*END*/


//CSS class index
let indexOfClass = 0;


//Get the subcollection of PLANs under a doc
//Link: https://medium.com/firebase-tips-tricks/how-to-list-all-subcollections-of-a-cloud-firestore-document-17f2bb80a166
db.collection("tours").doc(tourId).collection("plans").get()
.then(querySnapshot => {
    querySnapshot.forEach(doc => {
        //Now render the DOM according to the data
        //Creating DOM and Rendering
        /*START*/
        //box class and timeline class will be in HTML
        //The DOM will start from <li>
        const listElement = document.createElement("li");
        listElement.classList.add("classForParentListElement");
        document.querySelector(".timeline").appendChild(listElement);

        //Create a div with class name item 
        //and append it to the <li>
        const divElement = document.createElement("div");
        divElement.classList.add("item");
        document.getElementsByClassName("classForParentListElement")[indexOfClass].appendChild(divElement);

        //Create a span element with class name time
        //and append it to the item div
        const spanElement = document.createElement("span");
        spanElement.innerText = doc.data().planDate;
        document.getElementsByClassName("item")[indexOfClass].appendChild(spanElement);

        //Create a h3 element 
        //and append it to the item div
        const h3Element = document.createElement("h3");
        h3Element.innerText = doc.data().planTitle;
        document.getElementsByClassName("item")[indexOfClass].appendChild(h3Element);

        //Create a p element 
        //and append it to the item div
        const paraElement = document.createElement("p");
        paraElement.innerText = doc.data().planActivity;
        document.getElementsByClassName("item")[indexOfClass].appendChild(paraElement);
        /*END*/

        //increase it
        indexOfClass++;
    });
});


//-----------------------------------------Start of Packings------------------

