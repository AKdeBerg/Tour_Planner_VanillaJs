//Momentjs 
import moment from 'moment';

//FireStore related things
/*START*/
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/firestore";

//litepicker
// import Litepicker from 'litepicker';


// TODO: Replace the following with your app's Firebase project configuration
// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBO7K5c9TreKlZCSsLWu6cLYAQRzrTYmL8",
    authDomain: "tour-planner-vanillajs.firebaseapp.com",
    databaseURL: "https://tour-planner-vanillajs.firebaseio.com",
    projectId: "tour-planner-vanillajs",
    storageBucket: "tour-planner-vanillajs.appspot.com",
    messagingSenderId: "804917545267",
    appId: "1:804917545267:web:ccb668971d4fdecfb99646",
    measurementId: "G-L6PVWPWJTF"
};
  
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let db = firebase.firestore();
/*END*/


/*START*/
//I first need to create data structure 
//to hold the tour information
//This is what I am doing here
const tourObj = {
    // id: '',
    tourName: '',
    tourDescription: '',
    tourImg: '',
    tourStartDate: '',
    tourEndDate: ''
};
/*END*/


//When an image is dragged, I must preview it. So add that feature
/*I will do with the dcode video*/
/*For that I need to start re-design the image upload part.*/
/*https://codepen.io/dcode-software/pen/xxwpLQo*/

//this variable is to hold the img
//later it will be used to 
//pass to the obj
let img = '';
document.querySelectorAll(".drop-zone__input").forEach(inputElement => {

    // select the drop zone container
    const dropZoneElement = inputElement.closest(".drop-zone");

    //add handler to the container for the click event
    dropZoneElement.addEventListener("click", e => {
        //pass this click to the input element
        inputElement.click();
    });
    //any changes made due to the click
    //listen to it
    inputElement.addEventListener("change", e => {
        if (inputElement.files.length === 1) {
            updateThumbnail(dropZoneElement, inputElement.files[0]);
        }
    });


    // add handler to the container for dragover event
    dropZoneElement.addEventListener("dragover", e => {
        e.preventDefault();
        //add the drop-zone--over class
        dropZoneElement.classList.add("drop-zone--over");
    });

    //when the img is out of drag area
    //we gonna put it to begining style
    ['dragleave', 'dragend'].forEach(type => {
        dropZoneElement.addEventListener(type, e => {
            dropZoneElement.classList.remove("drop-zone--over");
        });
    });


    //main part
    //handling the drop event
    dropZoneElement.addEventListener('drop', e => {
        e.preventDefault();

        //when the datatransfer.files contains files.
        //we only gonna do it for one file
        if (e.dataTransfer.files.length === 1) {
            const imageType = /image.*/;
            //check if the file is image
            if (e.dataTransfer.files[0].type.match(imageType)) {
                //assign the files to the input element
                inputElement.files = e.dataTransfer.files;
                //update the thumbnail
                updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
            }
        }
        dropZoneElement.classList.remove("drop-zone--over");
    })
});

function updateThumbnail(dropZoneElement, file) {
    //grab the thumbnail 
    //[Note: thumbnail doesn't exist in first time]
    let thumbnailElement = dropZoneElement.querySelector(".drop-zone__thumb");

    //first time remove the prompt
    if (dropZoneElement.querySelector(".drop-zone__promt")) {
        dropZoneElement.querySelector(".drop-zone__promt").remove();
    }
    //but for the first time around
    //we got to create a thumbnail element
    if (!thumbnailElement) {
        thumbnailElement = document.createElement("div");
        thumbnailElement.classList.add("drop-zone__thumb");
        dropZoneElement.appendChild(thumbnailElement);
    }

    //setting the label value as the file name 
    thumbnailElement.dataset.label = file.name; 

    //show thumbnail for the image file
    if (file.type.startsWith("image/")) {
        //read the img file from the user's computer
        //I mean, FileReader is used to read
        //the files that aren't native to the web app
        const reader = new FileReader();

        //read it as data URL and return base 64
        reader.readAsDataURL(file);

        //when the reader is done reading the img file
        reader.onload = () => {
            //use the img as background
            thumbnailElement.style.backgroundImage = `url('${reader.result}')`;

            //do something the image is stored in reader.result variable
            // console.log(reader.result);
            //this is gonna be assigned to the tourImag variable
            img = reader.result;
        }
    }
}
/**END**/



//Date related
let startDate = document.querySelector("#start-date");

let endDate = document.querySelector("#end-date");

//Submitting forms
//When you submit the form this way,
//the submit event fires right before the request is sent to the server.
let form = document.getElementById('add-tour');
if(form) {
    form.addEventListener('submit', (event) => {
        //you can prevent default behaviour
        event.preventDefault();
        const tourNameInputField = document.querySelector("#tour_name").value;
        const tourDescriptionInputField = document.querySelector("#tour_description").value;    
       
        let parsedFirstDate = moment(startDate.value);
        let parsedSecondDate = moment(endDate.value);

        // tourObj.id = uuidv4();
        tourObj.tourName = tourNameInputField;
        tourObj.tourDescription = tourDescriptionInputField;
        tourObj.tourImg = img;
        tourObj.tourStartDate = parsedFirstDate.format('LL');  //moment().format("MMM Do YYYY");      
        tourObj.tourEndDate = parsedSecondDate.format('LL');
      
    
        //checking if we got the object right
        // console.log(tourObj);
    
    
        //adding to firestore
        db.collection("tours").add(tourObj)
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
            location.assign(`/index.html`);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });        
    });
}


//Export the firestore db
export {db};


//Finally when the submit button is pressed save all the necessary info to firestore