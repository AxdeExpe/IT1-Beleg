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


    #Allgemeines = Array.from(Array(this.#FileLength), () => new Array(this.#FileWidth+1));
    #Mathe = Array.from(Array(this.#FileLength), () => new Array(this.#FileWidth+1));
    #IT1 = Array.from(Array(this.#FileLength), () => new Array(this.#FileWidth+1));

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
                    this.#Mathe[i][0] = data.Mathe[i].a;
                    console.log("Aufgabe: " + this.#Mathe[i][0]);

                    for (let j = 1; j <= this.#FileWidth; j++) {

                        //Lösungen
                        this.#Mathe[i][j] = data.Mathe[i].l[j-1];
                        console.log("Antwort: " + this.#Mathe[i][j]);
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
                    this.#Allgemeines[i][0] = data.Allgemeines[i].a;
                    console.log("Aufgabe: " + this.#Allgemeines[i]);

                    for (let j = 1; j <= this.#FileWidth; j++) {

                        //Lösungen
                        this.#Allgemeines[i][j] = data.Allgemeines[i].l[j-1];
                        console.log("Antwort: " + this.#Allgemeines[i][j]);
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
                    this.#IT1[i][0] = data.IT1[i].a;
                    console.log("Aufgaben: " + this.#IT1[i]);

                    for (let j = 1; j <= this.#FileWidth; j++) {

                        //Lösungen
                        this.#IT1[i][j] = data.IT1[i].l[j-1];
                        console.log("Antwort: " + this.#IT1[i][j]);
                    }
                }
            });
    }



    //question = [Aufgabe 1, Antwort 1, Antwort 2, Antwort 3, Antwort 4, Aufgabe 2, Antwort 1, Antwort 2, Antwort 3, Antwort 4, ...]
    //Anzahl = 5, Verhältnis = 1 : 5, ==> Counter = 5
    #groupOfTasks;
    #task = Array.from(Array(this.#FileLength), () => new Array(this.#FileWidth+1));
    #rightAnwser = [];

    #questionBuffer = [];
    #questionBufferCount = 0;

    #answerBuffer = [];
    #answerBufferCount = [];


    checkAwnser(answer){
        for(let j = 0; j<this.#task.length; j++) {
            if (answer === this.#answerBuffer[j]) {
                return false;
            }
        }
        return true;
    }

    checkQuestion(question){
        for(let j = 0; j<this.#FileLength; j++) {
            if (question === this.#questionBuffer[j]) {
                return false;
            }
        }
        return true;
    }

    taskRandomizer(){

        let answer, checkAwnser, question, checkQuestion;
        question = Math.floor(Math.random() * 10);

        this.#task[this.#questionBufferCount][0] = this.#Mathe[question][0];
        //this.#questionBuffer[this.#questionBufferCount] = question;
        this.#questionBufferCount++;

        this.#rightAnwser[this.#answerBufferCount] = this.#Mathe[question][1];
        this.#answerBufferCount++;

        //randomize answer per question
        for(let i = 1; i <= this.#FileWidth; i++){
            answer = Math.floor(Math.random() * 5);
            this.#answerBuffer[i-1] = answer;

            checkAwnser = this.checkAwnser(answer);
            while(checkAwnser === false) {
                answer = Math.floor(Math.random() * 5);
                checkAwnser = this.checkAwnser(answer);
            }

            this.#task[this.#questionBufferCount][i] = this.#Mathe[question][answer];
        }

        //randomize questions
        for(let i = 1; i <= this.#FileLength; i++){
            question = Math.floor(Math.random() * 10);
            this.#questionBuffer[i-1] = question;

            checkQuestion = this.checkQuestion(question);
            while(checkQuestion === false){
                question = Math.floor(Math.random() * 10);
                checkQuestion = this.checkQuestion(question);
            }
            this.#task[this.#questionBufferCount][]
        }

    }










    getMatheTask() {
        for (let i = 0; i < this.#FileLength; i++) {

            console.log("Aufgabe: " + this.#Mathe[i][0]);

            for (let j = 1; j <= this.#FileWidth; j++) {
                console.log("Lösungen: " + this.#Mathe[i][j]);
            }
        }
    }

    getAllgemeinesTask(i) {
        for (let i = 0; i < this.#FileLength; i++) {

            console.log("Aufgabe: " + this.#Allgemeines[i][0]);

            for (let j = 1; j <= this.#FileWidth; j++) {
                console.log("Lösungen: " + this.#Allgemeines[i][j]);
            }
        }
    }

    getIT1Task() {
        for (let i = 0; i < this.#FileLength; i++) {

            console.log("Lösungen: " + this.#IT1[i][0]);

            for (let j = 1; j <= this.#FileWidth; j++) {
                console.log("Lösungen: " + this.#IT1[i][j]);
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