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

    constructor() {
        this.loadMathe();
        this.loadAllgemeines();
        this.loadIT1();
    }

//-------------------------------LoadFiles--------------------------------
    loadMathe() {
        fetch("../JSON/Mathe.json")
            .then(response => response.json())
            .then(data => {
               // console.log("Mathe");

                for (let i = 0; i < this.#FileLength; i++) {

                    //Aufgaben
                    this.#Mathe[i][0] = data.Mathe[i].a;
                    //console.log("Aufgabe: " + this.#Mathe[i][0]);

                    for (let j = 1; j <= this.#FileWidth; j++) {

                        //Lösungen
                        this.#Mathe[i][j] = data.Mathe[i].l[j-1];
                        //console.log("Antwort: " + this.#Mathe[i][j]);
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
                    //console.log("Aufgabe: " + this.#Allgemeines[i]);

                    for (let j = 1; j <= this.#FileWidth; j++) {

                        //Lösungen
                        this.#Allgemeines[i][j] = data.Allgemeines[i].l[j-1];
                       //console.log("Antwort: " + this.#Allgemeines[i][j]);
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
                    //console.log("Aufgaben: " + this.#IT1[i]);

                    for (let j = 1; j <= this.#FileWidth; j++) {

                        //Lösungen
                        this.#IT1[i][j] = data.IT1[i].l[j-1];
                        //console.log("Antwort: " + this.#IT1[i][j]);
                    }
                }
            });
    }

//------------------------------Randomizing-------------------------------

    //question = [Aufgabe 1, Antwort 1, Antwort 2, Antwort 3, Antwort 4, Aufgabe 2, Antwort 1, Antwort 2, Antwort 3, Antwort 4, ...]
    //Anzahl = 5, Verhältnis = 1 : 5
    taskRandomizer(questions){

        const shuffledQuestions = questions.slice();
        const rightAnswers = [];

        // Mische die Aufgaben zufällig
        for (let i = shuffledQuestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
        }

        // Mische die Antworten zu jeder Aufgabe zufällig
        for (let i = 0; i < shuffledQuestions.length; i++) {
            const answers = shuffledQuestions[i].slice(1); // Kopiere die Antworten, um das ursprüngliche Array nicht zu ändern
            const rightAnswer = answers[0]; // Die richtige Antwort ist immer an der ersten Stelle
            for (let j = answers.length - 1; j > 0; j--) {
                const k = Math.floor(Math.random() * (j + 1));
                [answers[j], answers[k]] = [answers[k], answers[j]]; // Mische die Antworten zufällig
            }
            shuffledQuestions[i] = [shuffledQuestions[i][0], ...answers]; // Setze die Antworten in die aufgemischte Frage ein
            rightAnswers.push(rightAnswer); // Füge die richtige Antwort zum rightAnswers-Array hinzu
        }

        return { shuffledQuestions, rightAnswers };
    }


    getMatheTask() {
        return this.taskRandomizer(this.#Mathe);
    }

    getAllgemeinesTask(i) {
        return this.taskRandomizer(this.#Allgemeines);
    }

    getIT1Task() {
        return this.taskRandomizer(this.#IT1);
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
    #rightAnswers
    #shuffledQuestions

    Task(event){
        let topic = event.target.id;

        if(topic === "Mathe"){
                const {shuffledQuestions, rigthAnswers} = this.#m.getMatheTask();
                this.#shuffledQuestions = shuffledQuestions;
                this.#rightAnswers = rigthAnswers;

                return {shuffledQuestions, rigthAnswers};

        }
        else if(topic === "IT 1"){
            console.log("Topic: " + topic);
            const {shuffledQuestions, rightAnswers} = this.#m.getIT1Task();
            this.#shuffledQuestions = shuffledQuestions;
            this.#rightAnswers = rightAnswers;
        }
        else if(topic === "Allgemeines"){
            console.log("Topic: " + topic);
            const {shuffledQuestions, rightAnswers} = this.#m.getAllgemeinesTask();
            this.#shuffledQuestions = shuffledQuestions;
            this.#rightAnswers = rightAnswers;
        }
        else{
            console.log("Topic is undefined!");
        }
    }

//--------------------------------Answer--------------------------------
    static checkAnswer(event){
        let topic = document.getElementById("topic").innerHTML;
        console.log(topic);
        if(topic === "Mathe"){

        }
        if(topic === "IT 1"){


        }
        if(topic === "Allgemeines"){

        }
    }


    buttonAction(event){

        let id = event.target.id;

        switch(id) {
            case "A":
                console.log("A pushed");
                this.checkAnswer(event);
                break;
            case "B":
                console.log("B pushed");
                this.checkAnswer(event);
                break;
            case "C":
                console.log("C pushed");
                this.checkAnswer(event);
                break;
            case "D":
                console.log("D pushed");
                this.checkAnswer(event);
                break;
            default:
                console.log("Wrong ID!");
                break;
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
        const {shuffledQuestions, rightAnswers} = this.#p.Task(event);
        document.getElementById("question").textContent = shuffledQuestions[0][0];
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