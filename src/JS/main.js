"use strict"
//import loadFile from './loadFile.js';

document.addEventListener('DOMContentLoaded', function (){
    let m, p, v;
    m = new Model();

    p = new Presenter();
    v = new View(p);
    p.setModelAndView(m,v);
    p.start();

})

//---------------------Model--------------------------------------------------------------------
class Model {
    //Var's
    #FileLength = 10; //Anzahl Aufgaben
    #FileWidth = 4; //Anzahl Lösungen pro Aufgabe


    #AllgemeinesLösung = Array.from(Array(this.#FileLength), () => new Array(this.#FileWidth));
    #MatheLösung = Array.from(Array(this.#FileLength), () => new Array(this.#FileWidth));
    #IT1Lösung = Array.from(Array(this.#FileLength), () => new Array(this.#FileWidth));

    #AllgemeinesAufgaben = [this.#FileLength];
    #MatheAufgaben = [this.#FileLength];
    #IT1Aufgaben = [this.#FileLength];

    constructor() {
        // this.loadFile("Allgemeines");

        this.loadMathe();
        this.loadAllgemeines();
        this.loadIT1();

    }


    loadMathe() {
        fetch("../JSON/Mathe.json")
            .then(response => response.json())
            .then(data => {
               // console.log("Mathe");

                for (let i = 0; i < this.#FileLength; i++) {

                    //Aufgaben
                    this.#MatheAufgaben[i] = data.Mathe[i].a;
                  //  console.log("Task: " + this.#MatheAufgaben[i]);

                    for (let j = 0; j < this.#FileWidth; j++) {

                        //Lösungen
                        this.#MatheLösung[i][j] = data.Mathe[i].l[j];
                    }
                }
            });
    }

    loadAllgemeines() {
        fetch("../JSON/Allgemeines.json")
            .then(response => response.json())
            .then(data => {
               // console.log("Allgemeines");

                for (let i = 0; i < this.#FileLength; i++) {

                    //Aufgaben
                    this.#AllgemeinesAufgaben[i] = data.Allgemeines[i].a;
                   // console.log("Task: " + this.#AllgemeinesAufgaben[i]);

                    for (let j = 0; j < this.#FileWidth; j++) {

                        //Lösungen
                        this.#AllgemeinesLösung[i][j] = data.Allgemeines[i].l[j];
                    }
                }
            });
    }

    loadIT1() {
        fetch("../JSON/IT 1.json")
            .then(response => response.json())
            .then(data => {
               // console.log("IT1");

                for (let i = 0; i < this.#FileLength; i++) {

                    //Aufagben
                    this.#IT1Aufgaben[i] = data.IT1[i].a;
                   // console.log("Task: " + this.#IT1Aufgaben[i]);

                    for (let j = 0; j < this.#FileWidth; j++) {

                        //Lösungen
                        this.#IT1Lösung[i][j] = data.IT1[i].l[j];
                    }
                }
            });
    }



    //question = [Aufgabe 1, Antwort 1, Antwort 2, Antwort 3, Antwort 4, Aufgabe 2, Antwort 1, Antwort 2, Antwort 3, Antwort 4, ...]
    //Anzahl = 5, Verhältnis = 1 : 5, ==> Counter = 5

    #questionBuffer = [];
    #questionBufferCount = 0;
    #question = [this.#FileWidth+1];

    randomizer(){
        return Math.floor(Math.random() * 10);
    }

    taskRandomizer(){
        let task = this.randomizer();
        this.#question[0] = this.#MatheAufgaben[task];

        this.#questionBufferCount++;
        this.#questionBuffer[this.#questionBufferCount] = task;

        for(let i = 0; i < this.#questionBufferCount; i++){

            if(task === this.#questionBuffer[i]){

            }
        }

        for(let i = 1; i < this.#FileWidth; i++){
            let answer = Math.floor(Math.random() * 5);
            buffer[]

            if(answer){

            }

            question[i] = this.#MatheLösung[task][answer];
        }
    }










    getMatheTask() {
        for (let i = 0; i < this.#FileLength; i++) {

            console.log("Aufgabe: " + this.#MatheAufgaben[i]);

            for (let j = 0; j < this.#FileWidth; j++) {
                console.log("Lösungen: " + this.#MatheLösung[i][j]);
            }
        }
    }

    getAllgemeinesTask(i) {
        for (let i = 0; i < this.#FileLength; i++) {

            console.log("Aufgabe: " + this.#AllgemeinesAufgaben[i]);
            array[i] = this.#AllgemeinesAufgaben[i];

            for (let j = 0; j < this.#FileWidth; j++) {
                console.log("Lösungen: " + this.#AllgemeinesLösung[i][j]);
            }
        }
    }

    getIT1Task() {
        for (let i = 0; i < this.#FileLength; i++) {

            console.log("Aufgabe: " + this.#IT1Aufgaben[i]);

            for (let j = 0; j < this.#FileWidth; j++) {
                console.log("Lösungen: " + this.#IT1Lösung[i][j]);
            }
        }
    }
}


//---------------------Presenter----------------------------------------------------------------
class Presenter{
    //Objects
    #m;
    #v;

    //Var's
    #File;

    start(){
       // let a = this.#m.getTask();
    }

    setModelAndView(m, v){
        this.#m = m;
        this.#v = v;
    }

//---------------------------------Task---------------------------------

    Task(event){
        let topic = event.target.id;

        if(topic === "Mathe"){
            console.log("Topic: " + topic);
            this.#m.getMatheTask();
        }
        else if(topic === "IT 1"){
            console.log("Topic: " + topic);
            this.#m.getIT1Task();
        }
        else if(topic === "Allgemeines"){
            console.log("Topic: " + topic);
            this.#m.getAllgemeinesTask();
        }
        else{
            console.log("Topic is undefined!");
        }


    }

//--------------------------------Answer--------------------------------
    buttonAction(event){

        let id = event.target.id;

        switch(id) {
            case "A":
                console.log("A pushed");
                Presenter.checkAnswer(event);
                break;
            case "B":
                console.log("B pushed");
                Presenter.checkAnswer(event);
                break;
            case "C":
                console.log("C pushed");
                Presenter.checkAnswer(event);
                break;
            case "D":
                console.log("D pushed");
                Presenter.checkAnswer.bind(event);
                break;
            default:
                console.log("Wrong ID!");
                break;
        }
    }

    static checkAnswer(event){
        let topic = document.getElementById("topic").innerHTML;
        if(topic === "Mathe"){
            this.#File = "../JSON/Mathe.json";
        }
        if(topic === "IT 1"){
            this.#File = "../JSON/IT.json";

        }
        if(topic === "Allgemeines"){
            this.#File = "../JSON/Allgemeines.json";
        }
    }
}

//---------------------View---------------------------------------------------------------------
class View {
    //Objects
    #p;
    #hidden = false;

    constructor(p) {
        this.#p = p;
        this.setHandler();
    }

    setHandler() {

        //control button
        document.getElementById("sidebar").addEventListener("click", this.actSidebar.bind(this));

        //topic button
        document.getElementById("Mathe").addEventListener("click", this.callTask.bind(this));
        document.getElementById("IT 1").addEventListener("click", this.callTask.bind(this));
        document.getElementById("Allgemeines").addEventListener("click", this.callTask.bind(this));

        //answer button
        
        if(document.getElementById("topic").innerHTML !== "IT1 - Beleg"){
            document.getElementById("A").addEventListener("click", this.callButtonAction.bind(this));
            document.getElementById("B").addEventListener("click", this.callButtonAction.bind(this));
            document.getElementById("C").addEventListener("click", this.callButtonAction.bind(this));
            document.getElementById("D").addEventListener("click", this.callButtonAction.bind(this));
        }
    }

    callButtonAction(event){
        this.#p.buttonAction(event);
    }

    callTask(event){
        this.#p.Task(event);
    }

    actSidebar(event) {

        if (event.target.nodeName.toLowerCase() === "button") {

            if (event.target.id === "handler") {

                if (this.#hidden === false) {
                    this.#hidden = true;
                    let sidebar = document.getElementById("sidebar");
                    sidebar.style.marginLeft = "-30vw";

                    let handler = document.getElementById("handler");
                    handler.style.marginLeft = "0px";
                    handler.style.transform = "scaleX(-1)";
                    handler.style.borderRadius = "5px 0px 0px 5px";
                    handler.style.backgroundColor = "gray";
                    handler.style.border = "none";

                    console.log("Sidebar is hidden!");
                }
                else {
                    this.#hidden = false;
                    let sidebar = document.getElementById("sidebar");
                    sidebar.style.marginLeft = "0px";

                    let handler = document.getElementById("handler");
                    handler.style.marginLeft = "null";
                    handler.style.backgroundColor = "gray";
                    handler.style.borderRadius = "0px 5px 5px 0px";
                    handler.style.removeProperty('borderColor');
                    handler.style.removeProperty('transform');

                    console.log("Sidebar is shown!");
                }
            }
        }
    }
}