//FIRST IMPORT THE db FOR FIRESTORE
import {db} from "./add-tour.js";

//Getting the document ID from URL
 const tourId = location.hash.substring(1);




//select the tbody
const tbody = document.querySelector("#tbody");

//Get data from firestore
var docRef = db.collection("tours").doc(tourId);

docRef.get().then(function(doc) {
    if (doc.exists) {
        //Render the table here      
        // Create an empty <tr> element and add it to the first position of <tbody>:
        var tr1 = tbody.insertRow(0);  
        // Insert a new <td> at the first position of the "new" <tbody> element:
        var tr1td1 = tr1.insertCell(0);
        var tr1td2 = tr1.insertCell(1);
        // Add text in the new td:
        tr1td1.innerHTML = "Tour Name";
        tr1td2.innerHTML = doc.data().tourName;
        // Create an empty <tr> element and add it to the second position of <tbody>:
        var tr2 = tbody.insertRow(1);  
        // Insert a new <td> at the second position of the "new" <tbody> element:
        var tr2td1 = tr2.insertCell(0);
        var tr2td2 = tr2.insertCell(1);
        // Add text in the new td:
        tr2td1.innerHTML = "Tour Description";
        tr2td2.innerHTML = doc.data().tourDescription;

        // Create an empty <tr> element and add it to the third position of <tbody>
        var tr3 = tbody.insertRow(2);  
        // Insert a new <td> at the second position of the "new" <tbody> element
        var tr3td1 = tr3.insertCell(0);
        var tr3td2 = tr3.insertCell(1);
        // Add text in the new td:
        tr3td1.innerHTML = "Start Date";
        tr3td2.innerHTML = doc.data().tourStartDate;

        // Create an empty <tr> element and add it to the third position of <tbody>
        var tr4 = tbody.insertRow(3);  
        // Insert a new <td> at the second position of the "new" <tbody> element
        var tr4td1 = tr4.insertCell(0);
        var tr4td2 = tr4.insertCell(1);
        // Add text in the new td:
        tr4td1.innerHTML = "End Date";
        tr4td2.innerHTML = doc.data().tourEndDate;

    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
});


//Make the plan html work
//CSS class index
let indexOfClass = 0;

const dbResult = db.collection("tours").doc(tourId).collection("plans").get();
if (dbResult) {
    /*Founding block of timeline*/
    const containerDiv = document.createElement("div");
    containerDiv.classList.add("container-h2");
    document.querySelector(".column").appendChild(containerDiv);

    //h2
    const planh2 = document.createElement("h2");
    planh2.innerText = "Plan Timeline";
    document.querySelector(".container-h2").appendChild(planh2);

    //timeline begins here
    const boxDiv = document.createElement("div");
    boxDiv.classList.add("box");
    document.querySelector(".column").appendChild(boxDiv);

    //ul
    const timelineUL = document.createElement("ul");
    timelineUL.classList.add("timeline");
    document.querySelector(".box").appendChild(timelineUL);

    //Get the subcollection of PLANs under a doc
    //Link: https://medium.com/firebase-tips-tricks/how-to-list-all-subcollections-of-a-cloud-firestore-document-17f2bb80a166
    dbResult
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

}


//Code for pdf generator
 window.onload = function () {
    document.querySelector("#pdfButton").addEventListener("click", (e) => {
        //select the element
        // let body = document.getElementsByTagName("body")[0];
        // html2pdf().from(body).save();   
        //select the element
        let body = document.getElementsByTagName("body")[0];
        var opt = {
        margin:       1,
        filename:     'details.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'p' }
        };

        //New Promise-based usage
        html2pdf().set(opt).from(body).save();
    });
}