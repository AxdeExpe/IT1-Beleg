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
        const {shuffledQuestions, rightAnswers} = this.taskRandomizer(this.#Mathe);
        return { shuffledQuestions, rightAnswers };
    }

    getAllgemeinesTask() {
        const {shuffledQuestions, rightAnswers} = this.taskRandomizer(this.#Allgemeines);
        return { shuffledQuestions, rightAnswers };
    }

    getIT1Task() {
        const {shuffledQuestions, rightAnswers} = this.taskRandomizer(this.#IT1);
        return { shuffledQuestions, rightAnswers };
    }

    //------------------------------Warteschlange----------------------------
    //TODO Warteschlange implementieren
    #queue = [];
    
    queue(index){
        this.#queue.push(index);
        
        //randomizing
        for(let i = 0; i < this.#queue.length; i++){
            let j = Math.floor(Math.random()*(i+1));
            this.#queue[i] = this.#queue[j];
        }
    }

    getQueue(index){
        let task = this.#queue[index];
        this.#queue.slice(index, index); //slicing the queue at index
        console.log("Sliced: " + this.#queue);
        return task;
    }

    //-------------------------------Statistic------------------------------
    //TODO Statistik implementieren
    #tries = 0

    statistic(){

    }
}


//---------------------Presenter----------------------------------------------------------------
class Presenter{
    //Objects
    #m;
    #v;

    start(){
       // let a = this.#m.getTask();
    }

    setModelAndView(m, v){
        this.#m = m;
        this.#v = v;
    }

//---------------------------------Task---------------------------------
    #rightAnswers = []
    #shuffledQuestions

    Task(event){
        let topic = event.target.id;

        if(topic === "Mathe"){
                const {shuffledQuestions, rightAnswers} = this.#m.getMatheTask();
                this.#shuffledQuestions = shuffledQuestions;
                this.#rightAnswers = rightAnswers;

                return {shuffledQuestions, rightAnswers};

        }
        else if(topic === "IT 1"){
            const {shuffledQuestions, rightAnswers} = this.#m.getIT1Task();
            this.#shuffledQuestions = shuffledQuestions;
            this.#rightAnswers = rightAnswers;

            return {shuffledQuestions, rightAnswers};
        }
        else if(topic === "Allgemeines"){
            const {shuffledQuestions, rightAnswers} = this.#m.getAllgemeinesTask();
            this.#shuffledQuestions = shuffledQuestions;
            this.#rightAnswers = rightAnswers;

            return {shuffledQuestions, rightAnswers};
        }
        else{
            console.log("Topic is undefined!");
        }
    }

//--------------------------------Answer--------------------------------
    checkAnswer(event, j){
        let id = event.target.id;
        console.log(id);

        switch(id) {
            case "A":
                console.log("A pushed");
                let A = document.getElementById("answerA").textContent;
                console.log(A);
                console.log(this.#rightAnswers[j]);
                
                if(A.match(this.#rightAnswers[j])){
                    this.#v.rightAnswer(event);
                    break;
                }
                this.#v.wrongAnswer(event);
                break;
            case "B":
                console.log("B pushed");
                let B = document.getElementById("answerB").textContent;
                console.log(B);
                console.log(this.#rightAnswers[j]);
                
                if(B.match(this.#rightAnswers[j])){
                    this.#v.rightAnswer(event);
                    break;
                }
                this.#v.wrongAnswer(event);
                break;
            case "C":
                console.log("C pushed");
                let C = document.getElementById("answerC").textContent;
                console.log(C);
                console.log(this.#rightAnswers[j]);
                
                if(C.match(this.#rightAnswers[j])){
                    this.#v.rightAnswer(event);
                    break;
                }
                this.#v.wrongAnswer(event);
                break;
            case "D":
                console.log("D pushed");
                let D = document.getElementById("answerD").textContent;
                console.log(D);
                console.log(this.#rightAnswers[j]);
                
                if(D.match(this.#rightAnswers[j])){
                    this.#v.rightAnswer(event);
                    break;
                }
                this.#v.wrongAnswer(event);
                break;
            default:
                console.log("Wrong ID!");
                break;
        }
        
    }

//--------------------------------Queue--------------------------------
    #queue;
    
    setQueue(index){
        this.#m.queue(index);
    }
    
    getQueue(index){
        this.#queue = this.#m.getQueue(index);
        return this.#queue;
    }

    
    
    
    
    
}

//---------------------View---------------------------------------------------------------------
class View {
    //Objects
    #p;
    #hidden = false;
    #rightAnwsers;
    #Questions;
    #Progressbar = 0;
    #indexQueue = 0;
    
    
    #i;
    #j;

    constructor(p) {
        this.#p = p;
        this.setHandler();
        this.showStatistics();
    }

    setHandler() {

        //control button
        document.getElementById("sidebar").addEventListener("click", this.actSidebar.bind(this));

        //topic button
        document.getElementById("Mathe").addEventListener("click", this.callTask.bind(this));
        document.getElementById("IT 1").addEventListener("click", this.callTask.bind(this));
        document.getElementById("Allgemeines").addEventListener("click", this.callTask.bind(this));

        //answer button
        document.getElementById("A").addEventListener("click", this.callButtonAction.bind(this));
        document.getElementById("B").addEventListener("click", this.callButtonAction.bind(this));
        document.getElementById("C").addEventListener("click", this.callButtonAction.bind(this));
        document.getElementById("D").addEventListener("click", this.callButtonAction.bind(this));
        
    }
    
    
    //Tasks and answers
    callButtonAction(event){
        if(this.#i < this.#rightAnwsers.length) {
            this.#p.checkAnswer(event, this.#j);
        }
        else{
            this.#p.checkAnswer(event, this.#indexQueue);
        }
    }
    
    async wrongAnswer(event) {
        let button = document.getElementById(event.target.id);
        button.style.backgroundColor = "red";
        this.#i++;
        this.#j++;
        this.#p.setQueue(this.#i);

        if(this.#i >= this.#rightAnwsers.length) {

            let index = this.getQueueIndex();
            console.log(index);
            this.#indexQueue++;
            this.setQueueTask(index);
            this.setQueueAnswers(index);

            await new Promise(r => setTimeout(r, 200)); //sleep
            this.clearButtons(event);

            return;
        }
        
        
        //set new Task
        this.setNewTask();
        this.setNewAnswers();
        
        await new Promise(r => setTimeout(r, 200)); //sleep
        this.clearButtons(event);
    }
    
    async rightAnswer(event) {
        let button = document.getElementById(event.target.id); //sleep
        button.style.backgroundColor = "green";
        this.#j++;
        this.#i++;

        //set queue Tasks
        if(this.#i >= this.#rightAnwsers.length) {

            if(this.#Progressbar === 100){
                this.showStatistics();
                return;
            }
            
            let index = this.getQueueIndex();
            console.log(index);
            this.#indexQueue++;
            
            this.#Progressbar += 100 / this.#rightAnwsers.length;
            console.log(this.#Progressbar);
            this.setProgressBar();
            
            this.setQueueTask(index);
            this.setQueueAnswers(index);

            await new Promise(r => setTimeout(r, 200)); //sleep
            this.clearButtons(event);
            
            return;
        }
        
        //set new Task
        this.setNewTask();
        this.setNewAnswers();

        //Progressbar
        this.#Progressbar += 100 / this.#rightAnwsers.length;
        console.log(this.#Progressbar);
        this.setProgressBar();

        await new Promise(r => setTimeout(r, 200)); //sleep
        this.clearButtons(event);
        
        if(this.#Progressbar === 100){
            this.showStatistics();
        }
    }
    
    getQueueIndex(){
        return this.#p.getQueue(this.#indexQueue);
    }

    showStatistics(){
        //TODO Statistik centern
        console.log("STATISTIK");
        //parent
        const div = document.createElement("div");
        
        //Child
        const divChild = document.createElement("div");
        
        //child Tasks
        const divTasks = document.createElement("div");
        const contentTasks = document.createTextNode("Du hast " + this.#i + " Aufgaben beantwortet.");
        divTasks.appendChild(contentTasks);
        
        //child Wrong
        const divWrong = document.createElement("div");
        const contentWrong  = document.createTextNode("Du hast " + this.#indexQueue + " Fehler gemacht.");
        divWrong.appendChild(contentWrong);
        
        //child Aall
        let right = this.#i - this.#indexQueue;
        const divAll = document.createElement("div");
        const contentAll = document.createTextNode("Somit hast du " + right  + " Aufgaben richtig beantwortet");
        divAll.appendChild(contentAll);
        
        divChild.appendChild(divTasks);
        divChild.appendChild(divWrong);
        divChild.appendChild(divAll);
        div.appendChild(divChild);

        
        divChild.style.position = "relative";
        divChild.style.textAlign = "center";
        
        div.style.display = "flex";
        div.style.width = "fit-content";
        div.style.padding = "10px";
        div.style.paddingTop = "25vh";
        div.style.paddingBottom = "25vh";
        div.style.color = "whitesmoke";
        div.style.backgroundColor = "rgba(63, 63, 63,0.85)";
        div.style.borderRadius = "4px";

        const taskElement = document.getElementById("task");
        const parent = taskElement.parentNode;
        parent.insertBefore(div, taskElement);
        parent.removeChild(taskElement);
        
        //sets all to 0
        this.#Progressbar = 0;
        this.#i = 0;
        this.#j = 0;
        this.#indexQueue = 0;
        this.#rightAnwsers = null;
        this.#Questions = null;
    }
    
    setProgressBar(){
        let progress = document.getElementById("progressBar");
        progress.textContent = this.#Progressbar + "%";
        progress.style.width = this.#Progressbar + "%";
    }
    
    clearButtons(event){
        let button =  document.getElementById(event.target.id);
        button.style.backgroundColor = null;
    }
    
    setNewTask(){
        document.getElementById("question").textContent = this.#Questions[this.#i][0];
    }

    setQueueTask(index){
        document.getElementById("question").textContent = this.#Questions[index][0];
    }

    setNewAnswers(){
        document.getElementById("answerA").textContent = "A: " + this.#Questions[this.#i][1];
        document.getElementById("answerB").textContent = "B: " + this.#Questions[this.#i][2];
        document.getElementById("answerC").textContent = "C: " + this.#Questions[this.#i][3];
        document.getElementById("answerD").textContent = "D: " + this.#Questions[this.#i][4];
    }

    setQueueAnswers(index){
        document.getElementById("answerA").textContent = "A: " + this.#Questions[index][1];
        document.getElementById("answerB").textContent = "B: " + this.#Questions[index][2];
        document.getElementById("answerC").textContent = "C: " + this.#Questions[index][3];
        document.getElementById("answerD").textContent = "D: " + this.#Questions[index][4];
    }
    
    callTask(event){
        const {shuffledQuestions, rightAnswers} =this.#p.Task(event);
        this.#rightAnwsers = rightAnswers;
        this.#Questions = shuffledQuestions;
        this.#i = 0;
        this.#j = 0;
        
        this.setNewTask();
        this.setNewAnswers();
    }
    

    
    
    //Sidebar
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