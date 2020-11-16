//FIRST IMPORT THE db FOR FIRESTORE
import {db} from "./add-tour.js";


//to make the class index dynamic
let indexOfClass = 0;

//GENERATE DOM AND DELETE FUNCTIONALITY
const generateDOMandDeleteFunctionality = function (querySnapshot) {

    querySnapshot.forEach(function(doc) {
            
        /*START*/
        //I will put the DOM here. For each data DOM will be rendered. 
        //1.tour-container div will be in  the HTML

        //2.add a div namely tour-img-title-container
        let tourImgTitleContainer = document.createElement("div");
        /*******VERY SPECIAL********/
        //this is for deletion. Using data-id
        tourImgTitleContainer.setAttribute("data-id", doc.id); 
        /*******VERY SPECIAL********/

        tourImgTitleContainer.classList.add("tour-img-title-container");
        //THIS IS VERY VERY IMPORTANT. WE WANTED TO INSERT THE TOUR DETAILS BEFORE THE "ADD-TOUR" BUTTON.
        //THAT'S WHY WE CAN'T USE APPENDCHILD(); WE GOTTA USE INSERTBEFORE()
        // document.querySelector(".tour-container").insertBefore(tourImgTitleContainer, document.querySelector(".add-tour"));
        //NEW THING FOR TEST
        
        document.getElementById("test").appendChild(tourImgTitleContainer); //OK

        //3a.add img src under the tour-img-title-container
        let jakImg = document.createElement("img");
        // jakImg.src="./styles/img/jakarta.jpg";
        jakImg.src=doc.data().tourImg;
        //append it to the tour-img-title-container
        // document.querySelector(".tour-img-title-container").appendChild(jakImg); --causes problem
        //To solve the issue of multiple class DOM confusion around tour-img-title-container
        //we gonna use getElementsByClassName which returns an array like object        
        document.getElementsByClassName("tour-img-title-container")[indexOfClass].appendChild(jakImg); 

        //3b.add a div namely text-content under the tour-img-title-container
        let textContentContainer = document.createElement("div");
        textContentContainer.classList.add("text-content");
        //append it to the tour-img-title-container
        // document.querySelector(".tour-img-title-container").appendChild(textContentContainer); --causes problem
        //To solve the issue of multiple class DOM confusion around tour-img-title-container
        //we gonna use getElementsByClassName which returns an array like object
        document.getElementsByClassName("tour-img-title-container")[indexOfClass].appendChild(textContentContainer);

        //3b.1 add a div namely title under the text-content
        let titleContainer = document.createElement("div");
        titleContainer.classList.add("title");
        //append it to the text-container
        // document.querySelector(".text-content").appendChild(titleContainer);
        document.getElementsByClassName("text-content")[indexOfClass].appendChild(titleContainer);

        //3b.1.1 add a h2 element namely tour-title
        let h2Element = document.createElement("h2");
        h2Element.classList.add("tour-title");
        //append it to the title
        // document.querySelector(".title").appendChild(h2Element);
        document.getElementsByClassName("title")[indexOfClass].appendChild(h2Element);



        //3b.1.1.1 add a anchor element namely under the h2 element
        let anchorElement = document.createElement("a");
        anchorElement.setAttribute("href", "#");
        anchorElement.innerText = doc.data().tourName;
        //append it to the h2
        // document.querySelector(".tour-title").appendChild(anchorElement);
        document.getElementsByClassName("tour-title")[indexOfClass].appendChild(anchorElement);


        //AFTER REVISING IT WE WILL MOVE TO THE SUBTITLE


        //3b.2 add a div namely subtitle under the text-content
        let substitleContainer = document.createElement("div");
        substitleContainer.classList.add("subtitle");
        //append it to the text-container
        // document.querySelector(".text-content").appendChild(substitleContainer);
        document.getElementsByClassName("text-content")[indexOfClass].appendChild(substitleContainer);

        //3b.2.1 add a paragraph tag with class name tour-duration
        let tourDurationPara = document.createElement("p");
        tourDurationPara.classList.add("tour-duration");
        tourDurationPara.innerText = `${doc.data().tourStartDate} - ${doc.data().tourEndDate}`;
        //append it to the subtitle
        document.querySelector(".subtitle").appendChild(tourDurationPara);
        document.getElementsByClassName("subtitle")[indexOfClass].appendChild(tourDurationPara);

        //3b.2.2 add a <ul> with a class name actions
        let tourActionsList = document.createElement("ul");
        tourActionsList.classList.add("actions");
        //append it to the subtitle
        // document.querySelector(".subtitle").appendChild(tourActionsList);
        document.getElementsByClassName("subtitle")[indexOfClass].appendChild(tourActionsList);
        //create list and append it to the ul
        let addPlanList = document.createElement("li");
        // document.querySelector(".actions").appendChild(addPlanList);
        document.getElementsByClassName("actions")[indexOfClass].appendChild(addPlanList);

        let planAnchor = document.createElement("a");
        planAnchor.setAttribute("href", `./plan.html#${doc.id}`);
        planAnchor.innerText = "Add a Plan";
        addPlanList.appendChild(planAnchor);

        let generatePDFList = document.createElement("li");
        // document.querySelector(".actions").appendChild(generatePDFList);
        document.getElementsByClassName("actions")[indexOfClass].appendChild(generatePDFList);

        let pdfAnchor = document.createElement("a");
        pdfAnchor.setAttribute("href", `./printDetails.html#${doc.id}`);
        pdfAnchor.innerText = "Detail Tour Report";
        generatePDFList.appendChild(pdfAnchor);

        let deleteTourList = document.createElement("li");
        // document.querySelector(".actions").appendChild(deleteTourList);
        document.getElementsByClassName("actions")[indexOfClass].appendChild(deleteTourList);


        let deleteAnchor = document.createElement("a");
        deleteAnchor.setAttribute("href", "#");
        deleteAnchor.innerText = "Delete Tour";
        deleteTourList.appendChild(deleteAnchor);
        /*END*/

        //DELETE functionality
        /*START*/            
        //Hooking up event listener when they are rendering
        //this will make life lot easier
        deleteAnchor.addEventListener("click", (e) => {
            e.stopPropagation();

            let id = e.target.parentElement.parentElement.parentElement.parentElement.parentElement.getAttribute('data-id');
            db.collection('tours').doc(id).delete().then(() => {
                location.reload();
            });
        });
        /*END*/
        //It must be inside the foreach block
        indexOfClass++;
    });  
}

//FETCH DATA FROM FIRE AND RENDER IT
/*START*/


async function getFireDataAndRender() {    
    try {
        const querySnapshot = await db.collection("tours").get();

        generateDOMandDeleteFunctionality(querySnapshot);
          
    } catch (error) {
        console.log("Something went wrong........")
    }
}

getFireDataAndRender();

/*END*/

//MAKE THE ADD TOUR BUTTON WORK
/*START*/

//select the button first
document.querySelector(".add-tour").addEventListener("click", () => {
    location.assign("./add-tour.html");
})
/*END*/

//MAKE THE SEARCH WORK
/*START*/

//fetch doc with tourName with async await
async function performQueryAndGetData(tourName) {
    try {
        const querySnapshot = await db.collection("tours").where("tourName", "==", tourName).get();           
        
        generateDOMandDeleteFunctionality(querySnapshot);        
    } catch (error) {
        console.log("Wrong is: " + error);
    }
}

//Filtering functionalities starts here
document.querySelector(".searchBox").addEventListener("change", (e) => {

    /*TO REMOVE THE BUG*/

    //identify the first doc
    let flagForFirstDoc = true;


    //Clear the prev loaded DOM b4 we proceed further
    document.getElementById("test").innerHTML = "";

    //Counter to count matched tourName
    let tourNameCounter = 0;

    //Get the tours
    db.collection("tours").get().then(function(querySnapshot) {       

        //Loop through each tour
        querySnapshot.forEach(function(doc) {
            //get the tourName
            let tourName = doc.data().tourName;

            //check if any tourName matches the searchText
            if (tourName.toLowerCase().includes(e.target.value.toLowerCase())) {     

                //For the first document 
                //change the indexOfClass
                if (flagForFirstDoc) {
                    indexOfClass = 0;
                    flagForFirstDoc = false;
                }    
                
                //just do the query for this one                      
                performQueryAndGetData(tourName);  

                //Increase the counter when matched
                tourNameCounter++; 
            }

        });
        
        //After the end of forEach
        //if the counter remains zero
        //then show the empty message
        if (!tourNameCounter) {
            const testEl = document.getElementById("test");
            const emptyMessage = document.createElement('div');
            emptyMessage.classList.add('empty-message');
            testEl.appendChild(emptyMessage);
        }
    });
    /*TO REMOVE THE BUG*/    
});

/*END*/