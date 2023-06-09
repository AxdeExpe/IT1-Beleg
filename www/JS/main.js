"use strict"

//start of program
document.addEventListener('DOMContentLoaded', function (){
    let m, p, v;
    
    m = new Model();
    p = new Presenter();
    v = new View(p);
    p.setModelAndView(m,v);

    //service worker
    if('serviceWorker' in navigator){
        navigator.serviceWorker.register("./sw.js")
            .then((reg) => console.log("service worker registered!", reg))
            .catch((err) => console.log("service worker not registered", err));
    }
})

//---------------------Model--------------------------------------------------------------------
class Model {
    //Var's
    #xhr;
    #FileLength = 10; //Anzahl Aufgaben
    #FileWidth = 4; //Anzahl Lösungen pro Aufgabe

    //AJAX
    #Task;
    #answer = new Array(this.#FileWidth);
    #solve;

    //Offline
    #Allgemeines = Array.from(Array(this.#FileLength), () => new Array(this.#FileWidth + 1));
    #Mathe = Array.from(Array(this.#FileLength), () => new Array(this.#FileWidth + 1));
    #IT1 = Array.from(Array(this.#FileLength), () => new Array(this.#FileWidth + 1));

    constructor() {
        if (window.XMLHttpRequest) {
            this.#xhr = new XMLHttpRequest();
        }
        this.loadMathe();
        this.loadAllgemeines();
        this.loadIT1();
    }

//-------------------------------AJAX----------------------------------

    sendXHR(index) {
        var self = this;

        this.#xhr.onreadystatechange = function () {
            if (this.readyState !== 4) {
                return;
            }
            if (this.status === 200) {
                var json = JSON.parse(this.responseText);
                //console.log(json.options);
                self.setTaskAnswer(json);
            }
        }

        //get a quiz
        this.#xhr.open('GET', 'https://irene.informatik.htw-dresden.de:8888/api/quizzes/' + index, false);
        this.#xhr.setRequestHeader("Authorization", "Basic " + btoa("test@gmail.com:secret"));
        this.#xhr.send(null);
    }

    Solve(index, data) {
        var self = this;

        this.#xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {

                var json = JSON.parse(this.responseText);
                var bool = json.success;

                //console.log("JSON: " + bool);

                self.setSolve(bool);
            }
        };

        //get answer (true, false)
        this.#xhr.open('POST', 'https://irene.informatik.htw-dresden.de:8888/api/quizzes/' + index + '/solve', false);
        this.#xhr.setRequestHeader("Authorization", "Basic " + btoa("test@gmail.com:secret"));
        this.#xhr.setRequestHeader("Content-Type", "application/json");
        this.#xhr.send('[' + data + ']');
    }

    setTaskAnswer(json) {
        this.#Task = json.text;
        //console.log("TASK: " + this.#Task);

        for (let i = 0; i < json.options.length; i++) {
            this.#answer[i] = json.options[i];
        }
    }

    //task
    getTask(){
        return this.#Task;
    }

    //answer for task
    getAnswer(){
        return this.#answer;
    }

    initializeTask(index) {
        this.sendXHR(index);
    }

    //solution
    setSolve(bool) {
        this.#solve = bool;
    }

    getSolve(index, data) {
        this.Solve(index, data);
        return this.#solve;
    }


//-------------------------------LoadFiles--------------------------------

    //loads math tasks into an array
    loadMathe() {
        fetch("JSON/Mathe.json")
            .then(response => response.json())
            .then(data => {
                // console.log("Mathe");

                for (let i = 0; i < this.#FileLength; i++) {

                    //Aufgaben
                    this.#Mathe[i][0] = data.Mathe[i].a;
                    //console.log("Aufgabe: " + this.#Mathe[i][0]);

                    for (let j = 1; j <= this.#FileWidth; j++) {

                        //Lösungen
                        this.#Mathe[i][j] = data.Mathe[i].l[j - 1];
                        //console.log("Antwort: " + this.#Mathe[i][j]);
                    }
                }
            });
    }


    //laods Allgemeine tasks into a array
    loadAllgemeines() {
        fetch("JSON/Allgemeines.json")
            .then(response => response.json())
            .then(data => {
                // console.log("Allgemeines");

                for (let i = 0; i < this.#FileLength; i++) {

                    //Aufgaben
                    this.#Allgemeines[i][0] = data.Allgemeines[i].a;
                    //console.log("Aufgabe: " + this.#Allgemeines[i]);

                    for (let j = 1; j <= this.#FileWidth; j++) {

                        //Lösungen
                        this.#Allgemeines[i][j] = data.Allgemeines[i].l[j - 1];
                        //console.log("Antwort: " + this.#Allgemeines[i][j]);
                    }
                }
            });
    }

    //load IT1 int a array
    loadIT1() {
        fetch("JSON/IT 1.json")
            .then(response => response.json())
            .then(data => {
                // console.log("IT1");

                for (let i = 0; i < this.#FileLength; i++) {

                    //Aufagben
                    this.#IT1[i][0] = data.IT1[i].a;
                    //console.log("Aufgaben: " + this.#IT1[i]);

                    for (let j = 1; j <= this.#FileWidth; j++) {

                        //Lösungen
                        this.#IT1[i][j] = data.IT1[i].l[j - 1];
                        //console.log("Antwort: " + this.#IT1[i][j]);
                    }
                }
            });
    }


//------------------------------Randomizing-------------------------------

    //question = [Aufgabe 1, Antwort 1, Antwort 2, Antwort 3, Antwort 4, Aufgabe 2, Antwort 1, Antwort 2, Antwort 3, Antwort 4, ...]
    //Anzahl = 5, Verhältnis = 1 : 5
    taskRandomizer(questions) {

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

        return {shuffledQuestions, rightAnswers};
    }


    getMatheTask() {
        const {shuffledQuestions, rightAnswers} = this.taskRandomizer(this.#Mathe);
        return {shuffledQuestions, rightAnswers};
    }

    getAllgemeinesTask() {
        const {shuffledQuestions, rightAnswers} = this.taskRandomizer(this.#Allgemeines);
        return {shuffledQuestions, rightAnswers};
    }

    getIT1Task() {
        const {shuffledQuestions, rightAnswers} = this.taskRandomizer(this.#IT1);
        return {shuffledQuestions, rightAnswers};
    }
}
//---------------------Presenter----------------------------------------------------------------
class Presenter{
    //Objects
    #xhr;
    #m;
    #v;

    setModelAndView(m, v){
        this.#m = m;
        this.#v = v;
    }
    
//---------------------------------Task---------------------------------
    #rightAnswers = []
    #shuffledQuestions

    //return the chosen tasks
    Task(event){
        let topic = event.target.id;
        this.#shuffledQuestions = null;
        this.#rightAnswers = null;
        //console.log("NEU: " + this.#shuffledQuestions)

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
            //console.log("Topic is undefined!");
        }
    }

//--------------------------------Ajax----------------------------------   
    initializeAjaxTask(index){
        return this.#m.initializeTask(index);
    }
    
    getTask(){
        return this.#m.getTask();
    }
    
    getAnswer(){
        return this.#m.getAnswer();
    }
    
    getAjaxSolve(index, data){
        return this.#m.getSolve(index, data);
    }

//--------------------------------Answer--------------------------------
    checkAnswer(event, j){
        let id = event.target.id;

        //check the answers
        switch(id) {
            case "A":
                let A = document.getElementById("answerA").textContent;
                
                if (A.match(this.#rightAnswers[j])) {
                    this.#v.rightAnswer(event);
                    break;
                }
                this.#v.wrongAnswer(event);
                break;
            case "B":
                let B = document.getElementById("answerB").textContent;

                if (B.match(this.#rightAnswers[j])) {
                    this.#v.rightAnswer(event);
                    break;
                }
                this.#v.wrongAnswer(event);
                break;
            case "C":
                let C = document.getElementById("answerC").textContent;

                if (C.match(this.#rightAnswers[j])) {
                    this.#v.rightAnswer(event);
                    break;
                }
                this.#v.wrongAnswer(event);
                break;
            case "D":
                let D = document.getElementById("answerD").textContent;

                if (D.match(this.#rightAnswers[j])) {
                    this.#v.rightAnswer(event);
                    break;
                }
                this.#v.wrongAnswer(event);
                break;
            default:
                //console.log("Wrong ID!");
                break;
        }
    }

    //only for math
    checkAnswerMath(event, j, i, Questions) {
        let id = event.target.id;
        
        switch (id) {
            case "A":
                if (Questions[i][1] === this.#rightAnswers[j]) {
                    this.#v.rightAnswer(event);
                    break;
                }
                this.#v.wrongAnswer(event);
                break;
            case "B":
                if (Questions[i][2] === this.#rightAnswers[j]) {
                    this.#v.rightAnswer(event);
                    break;
                }
                this.#v.wrongAnswer(event);
                break;
            case "C":
                if (Questions[i][3] === this.#rightAnswers[j]) {
                    this.#v.rightAnswer(event);
                    break;
                }
                this.#v.wrongAnswer(event);
                break;
            case "D":
                if (Questions[i][4] === this.#rightAnswers[j]) {
                    this.#v.rightAnswer(event);
                    break;
                }
                this.#v.wrongAnswer(event);
                break;
            default:
                //console.log("Wrong ID!");
                break;

        }
    }
}

//---------------------View---------------------------------------------------------------------
class View {
    //Objects
    #p;
    #hidden = false;
    #rightAnswers = null;
    #wrong = 0;
    #Questions = null;
    #Progressbar = 0;
    #showStatistics = false;
    #showTask = false;
    
    #answerHandle = 0;
    #i = 0; //index
    #j = 0; //index
    
    //Ajax
    #Task;
    #answer;

    constructor(p) {
        this.#p = p;
        
        this.setHandler();
    }

    //handler
    setHandler() {

        //control button
        document.getElementById("sidebar").addEventListener("click", this.actSidebar.bind(this));

        //topic button
        document.getElementById("Mathe").addEventListener("click", this.callTask.bind(this));
        document.getElementById("IT 1").addEventListener("click", this.callTask.bind(this));
        document.getElementById("Allgemeines").addEventListener("click", this.callTask.bind(this));
        document.getElementById("Online").addEventListener("click",  this.callAjaxTask.bind(this));
    }
    
    setAnswerHandler(){
        //answer button
        document.getElementById("A").addEventListener("click", this.callButtonAction.bind(this));
        document.getElementById("B").addEventListener("click", this.callButtonAction.bind(this));
        document.getElementById("C").addEventListener("click", this.callButtonAction.bind(this));
        document.getElementById("D").addEventListener("click", this.callButtonAction.bind(this));
    }
    
    
    //Tasks and answers
    callButtonAction(event){
        
        //Ajax / Online
        if(document.getElementById("topic").textContent === "Online"){
        switch (event.target.id){
            case "A": this.#j = 0; break;
            case "B": this.#j = 1; break;
            case "C": this.#j = 2; break;
            case "D": this.#j = 3; break;
        }
            var bool = this.getAjaxSolve(this.#i, this.#j);
            
            this.#i++;
            if(bool){
                this.rightAnswer(event);
                return;
            }
            this.wrongAnswer(event);
            return;
        }

        //Mathe
        if(document.getElementById("topic").textContent === "Mathe"){
            this.#p.checkAnswerMath(event,this.#j, this.#i, this.#Questions);
            return;
        }
        
        //Offline
        this.#p.checkAnswer(event, this.#j);
        
    }
    
     async wrongAnswer(event) {
        let button = document.getElementById(event.target.id);
        button.style.backgroundColor = "red";


        //Ajax
        if(document.getElementById("topic").textContent === "Online"){

            this.#wrong++;

            if(this.#i >= 12){
                this.showStatistics();
                return;
            }

            this.getAjaxTask(this.#i);

            //set new Task
            this.setNewTask();
            this.setNewAnswers();

           await new Promise(r => setTimeout(r, 200)); //sleep
            this.clearButtons(event);
            
            if(this.#Progressbar === 100){
                this.showStatistics();
            }
            return;
        }
        
        
         //shows the correct answer
        if(document.getElementById("answerA").textContent.includes(this.#rightAnswers[this.#i])){
            document.getElementById("answerA").style.backgroundColor = "green";
            await new Promise(r => setTimeout(r, 1000)); //sleep
            document.getElementById("answerA").style.backgroundColor = null;
        }
        
         if(document.getElementById("answerB").textContent.includes(this.#rightAnswers[this.#i])){
             document.getElementById("answerB").style.backgroundColor = "green";
             await new Promise(r => setTimeout(r, 1000)); //sleep
             document.getElementById("answerB").style.backgroundColor = null;
         }
         
         if(document.getElementById("answerC").textContent.includes(this.#rightAnswers[this.#i])){
             document.getElementById("answerC").style.backgroundColor = "green";
             await new Promise(r => setTimeout(r, 1000)); //sleep
             document.getElementById("answerC").style.backgroundColor = null;
         }

         if(document.getElementById("answerD").textContent.includes(this.#rightAnswers[this.#i])){
             document.getElementById("answerD").style.backgroundColor = "green";
             await new Promise(r => setTimeout(r, 1000)); //sleep
             document.getElementById("answerD").style.backgroundColor = null;
         }
         
         
         this.#i++;
         this.#j++;
         this.#wrong++;
        
        if(this.#i >= this.#rightAnswers.length) {
            
            this.showStatistics();
            return;
        }
        
        //set new Task
        this.setNewTask();
        this.setNewAnswers();
        
        this.clearButtons(event);
    }

    async rightAnswer(event) {
        let button = document.getElementById(event.target.id);
        button.style.backgroundColor = "green";

        this.#j++;
        this.#i++;
        

        //Ajax
        if(document.getElementById("topic").textContent === "Online"){
            
            this.#i--;
            if(this.#i >= 12){
                this.showStatistics();
                return;
            }

            this.getAjaxTask(this.#i);

            await new Promise(r => setTimeout(r, 900)); //sleep
            //set new Task
            this.setNewTask();
            this.setNewAnswers();

            //Progressbar
            this.#Progressbar += 100 / 10; // 10 is the amount of tasks
            this.setProgressBar();

            await new Promise(r => setTimeout(r, 200)); //sleep
            this.clearButtons(event);

            if(this.#Progressbar === 100){
                await new Promise(r => setTimeout(r, 1000)); //sleep
                this.showStatistics();
            }
            return;
        }
        
        
        //set queue Tasks
        if(this.#i >= this.#rightAnswers.length && document.getElementById("topic").textContent !== "Online") {
            //const newLength = this.#i - this.#rightAnswers.length;
            await new Promise(r => setTimeout(r, 1000)); //sleep
            this.showStatistics();
            return;
                
        }

        await new Promise(r => setTimeout(r, 1000)); //sleep
        
        //set new Task
        this.setNewTask();
        this.setNewAnswers();

        //Progressbar
        this.#Progressbar += 100 / this.#rightAnswers.length;
        this.setProgressBar();

        await new Promise(r => setTimeout(r, 200)); //sleep
        this.clearButtons(event);
        
        
        if(this.#Progressbar === 100){
            this.showStatistics();
            return;
        }
    }

    showStatistics(){
        if(this.#showStatistics === false) {
            this.#showStatistics = true;
            this.#showTask = false;
            //parent
            const div = document.createElement("div");
            div.id = "statistic";

            //Child
            const divChild = document.createElement("div");

            //child Tasks
            if(document.getElementById("topic").textContent !== "Online") {
                const divTasks = document.createElement("div");
                const contentTasks = document.createTextNode("Insgesamt beantwortet: " + this.#i);
                divTasks.appendChild(contentTasks);

                //child Wrong
                const divWrong = document.createElement("div");
                const contentWrong = document.createTextNode("Falsch beantwortet: " + this.#wrong);
                divWrong.appendChild(contentWrong);

                //child all
                let right = this.#i - this.#wrong;
                const divAll = document.createElement("div");
                const contentAll = document.createTextNode("Richtig beantwortet: " + right);
                divAll.appendChild(contentAll);

                divChild.appendChild(divTasks);
                divChild.appendChild(divWrong);
                divChild.appendChild(divAll);
                div.appendChild(divChild);

                divChild.className = "statistic";
                div.className = "statisticPlaceholder";

                const taskElement = document.getElementById("task");
                const parent = taskElement.parentNode;
                parent.insertBefore(div, taskElement);
                parent.removeChild(taskElement);

                //sets all to 0
                this.setNull();
            }
            else{
                const divTasks = document.createElement("div");
                let all = this.#i-2;
                const contentTasks = document.createTextNode("Insgesamt beantwortet: " + all); //anfangs Task
                divTasks.appendChild(contentTasks);

                //child Wrong
                const divWrong = document.createElement("div");
                const contentWrong = document.createTextNode("Falsch beantwortet: " + this.#wrong);
                divWrong.appendChild(contentWrong);

                //child all
                let right = all - this.#wrong;
                const divAll = document.createElement("div");
                const contentAll = document.createTextNode("Richtig beantwortet: " + right);
                divAll.appendChild(contentAll);

                divChild.appendChild(divTasks);
                divChild.appendChild(divWrong);
                divChild.appendChild(divAll);
                div.appendChild(divChild);

                divChild.className = "statistic";
                div.className = "statisticPlaceholder";

                const taskElement = document.getElementById("task");
                const parent = taskElement.parentNode;
                parent.insertBefore(div, taskElement);
                parent.removeChild(taskElement);

                //sets all to 0
                this.setNull();
            }
        }
    }

    //sets everything to null or 0
    setNull(){
        this.#Progressbar = 0;
        this.#i = 0;
        this.#j = 0;
        this.#rightAnswers = null;
        this.#Questions = null;
        this.#answerHandle = 0;
        this.#wrong = 0;
    }

    //progressbar progress
    setProgressBar(){
        let progress = document.getElementById("progressBar");
        progress.textContent = this.#Progressbar + "%";
        progress.style.width = this.#Progressbar + "%";
    }

    //clears the pushed button
    clearButtons(event){
        let button =  document.getElementById(event.target.id);
        button.style.backgroundColor = null;
    }

    //sets new task
    setNewTask(){
        
        if(document.getElementById("topic").textContent === "Mathe"){
            //render Katex
            katex.render(this.#Questions[this.#i][0], document.getElementById("question"));
            window.renderMathInElement(document.getElementById("question"), {delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "$", right: "$", display: false}]});
            return;
        }
        
        if(document.getElementById("topic").textContent === "Online"){
            
            document.getElementById("question").textContent = this.#Task;
            //console.log(this.#Task);
            return;
        }
        
        document.getElementById("question").textContent = this.#Questions[this.#i][0];
    }

    //sets new answers
    setNewAnswers(){

        if(document.getElementById("topic").textContent === "Mathe"){
            //render Katex

            katex.render("A: " + this.#Questions[this.#i][1],  document.getElementById("answerA"));
            katex.render("B: " + this.#Questions[this.#i][2],  document.getElementById("answerB"));
            katex.render("C: " + this.#Questions[this.#i][3],  document.getElementById("answerC"));
            katex.render("D: " + this.#Questions[this.#i][4],  document.getElementById("answerD"));
            return;
        }
        
        if(document.getElementById("topic").textContent === "Online"){
            
            document.getElementById("answerA").textContent = "A: " + this.#answer[0];
            document.getElementById("answerB").textContent = "B: " + this.#answer[1];
            document.getElementById("answerC").textContent = "C: " + this.#answer[2];
            document.getElementById("answerD").textContent = "D: " + this.#answer[3];
            
            return;
        }
        
        document.getElementById("answerA").textContent = "A: " + this.#Questions[this.#i][1];
        document.getElementById("answerB").textContent = "B: " + this.#Questions[this.#i][2];
        document.getElementById("answerC").textContent = "C: " + this.#Questions[this.#i][3];
        document.getElementById("answerD").textContent = "D: " + this.#Questions[this.#i][4];
    }

    //checks if your device has an internet connection
    checkOnline(){
        if(!(navigator.onLine)){
            document.getElementById("topic").textContent = "Sie haben keinen Zugang zum Internet!";
            return;
        }
    }
    
    //Online
    callAjaxTask(event){
        
        this.checkOnline();

        this.#rightAnswers = 0;
        this.#Questions = 0;
        this.#j = 0;
        this.#i = 2;
        this.#Progressbar = 0;

        this.getAjaxTask(this.#i);
        //console.log("THIS I: " + this.#i);
        
        document.getElementById("topic").textContent = "Online";

        if(document.getElementById("progressBar")) {
            this.setProgressBar();
        }

        this.showTask();
        
        if(this.#answerHandle === 0) {
            this.setAnswerHandler();
        }
        this.#answerHandle++;
        
        this.setNewTask();
        this.setNewAnswers();
        this.actSidebar(event);
    }
    
    getAjaxTask(index){
        this.#p.initializeAjaxTask(index);
        this.#Task =this.#p.getTask();
        //console.log("TASK 3: "+ this.#Task)
        this.#answer =this.#p.getAnswer();
    }
    
    getAjaxSolve(index, data){
        const bool = this.#p.getAjaxSolve(index, data);
        return bool;
    }
    
    //Offline
    callTask(event){
        this.#rightAnswers = null;
        this.#Questions = null;
        const {shuffledQuestions, rightAnswers} =this.#p.Task(event);
        this.#rightAnswers = rightAnswers;
        this.#Questions = shuffledQuestions;
        this.#i = 0;
        this.#j = 0;
        this.#Progressbar = 0;
        this.#wrong = 0;
        
        if(event.target.id === "Mathe"){
            document.getElementById("topic").textContent = "Mathe";
        }
        if(event.target.id === "Allgemeines"){
            document.getElementById("topic").textContent = "Allgemeines";
        }
        if(event.target.id === "IT 1"){
            document.getElementById("topic").textContent = "IT 1";
        }
        
        if(document.getElementById("progressBar")) {
            this.setProgressBar();
        }
        this.showTask();
        
        //wenn ich während der Aufgaben die topics wechsel, buggt ansonsten
        if(this.#answerHandle === 0) {
            this.setAnswerHandler();
        }
        this.#answerHandle++;
        
        this.setNewTask();
        this.setNewAnswers();
        this.actSidebar(event);
    }

    //shows the task with the possible answers
    showTask(){
        if(this.#showStatistics === true){
           document.getElementById("statistic").remove();
           this.#showStatistics = false;
        }
        
        if(this.#showTask === false) {
            this.#showTask = true;
            //create <div's>
            const task = document.createElement("div");
            task.id = "task";
            task.className = "task";

            const questionPlaceholder = document.createElement("div");
            questionPlaceholder.className = "questionPlaceholder";

            const possibilitiesPlaceholder = document.createElement("div");
            possibilitiesPlaceholder.className = "possibilitiesPlaceholder";

            const progressBarPlaceholder = document.createElement("div");
            progressBarPlaceholder.className = "progressBarPlaceholder";

            const progressBar = document.createElement("div");
            progressBar.id = "progressBar";
            progressBar.className = "progressBar";
            progressBar.innerHTML = "0%";

            const selection = document.createElement("div");
            selection.className = "selection";

            const top = document.createElement("div");
            top.className = "top";

            const bottom = document.createElement("div");
            bottom.className = "bottom"


            //create <p>'s
            const question = document.createElement("p");
            question.id = "question";
            //question.innerHTML = "Aufgabe";

            const answerA = document.createElement("p");
            answerA.id = "answerA";
            answerA.className = "possibilities";
            answerA.innerHTML = "A: ";

            const answerB = document.createElement("p");
            answerB.id = "answerB";
            answerB.className = "possibilities";
            answerB.innerHTML = "B: ";

            const answerC = document.createElement("p");
            answerC.id = "answerC";
            answerC.className = "possibilities";
            answerC.innerHTML = "C: ";

            const answerD = document.createElement("p");
            answerD.id = "answerD";
            answerD.className = "possibilities";
            answerD.innerHTML = "D: ";


            //create <buttons>
            const A = document.createElement("button");
            A.className = "answer";
            A.id = "A";
            A.innerHTML = "A";

            const B = document.createElement("button");
            B.className = "answer";
            B.id = "B";
            B.innerHTML = "B";

            const C = document.createElement("button");
            C.className = "answer";
            C.id = "C";
            C.innerHTML = "C";

            const D = document.createElement("button");
            D.className = "answer";
            D.id = "D";
            D.innerHTML = "D";


            //put it all together
            possibilitiesPlaceholder.appendChild(answerA);
            possibilitiesPlaceholder.appendChild(answerB);
            possibilitiesPlaceholder.appendChild(answerC);
            possibilitiesPlaceholder.appendChild(answerD);

            questionPlaceholder.appendChild(question);
            questionPlaceholder.appendChild(possibilitiesPlaceholder);

            task.appendChild(questionPlaceholder);


            progressBarPlaceholder.appendChild(progressBar);

            task.appendChild(progressBarPlaceholder);


            top.appendChild(A);
            top.appendChild(B);

            bottom.appendChild(C);
            bottom.appendChild(D);

            selection.appendChild(top);
            selection.appendChild(bottom);

            task.appendChild(selection);


            const main = document.getElementById("main");
            document.body.appendChild(task);
        }
    }
    

    //Sidebar
    actSidebar(event) {

        if (event.target.nodeName.toLowerCase() === "button") {

            if (event.target.id === "handler") {

                //is shown
                if (this.#hidden === false) {
                    this.#hidden = true;
                    let sidebar = document.getElementById("sidebar");
                    sidebar.style.marginLeft = "-30vw";

                    let handler = document.getElementById("handler");
                    handler.style.marginLeft = "0px";
                    handler.style.transform = "scaleX(-1)";
                    handler.style.borderRadius = "5px 0px 0px 5px";
                    handler.style.backgroundColor = "rgb(26, 26, 26)";
                    handler.style.border = "none";

                    //console.log("Sidebar is hidden!");
                }
                //is hidden
                else {
                    this.#hidden = false;
                    let sidebar = document.getElementById("sidebar");
                    sidebar.style.marginLeft = "0px";

                    let handler = document.getElementById("handler");
                    handler.style.marginLeft = "null";
                    handler.style.backgroundColor = "rgb(26, 26, 26)";
                    handler.style.borderRadius = "0px 5px 5px 0px";
                    handler.style.removeProperty('borderColor');
                    handler.style.removeProperty('transform');

                    //console.log("Sidebar is shown!");
                }
            }
            else if(event.target.id === "IT 1" || event.target.id === "Allgemeines" || event.target.id === "Mathe" || event.target.id === "Online"){
                this.#hidden = true;
                let sidebar = document.getElementById("sidebar");
                sidebar.style.marginLeft = "-30vw";

                let handler = document.getElementById("handler");
                handler.style.marginLeft = "0px";
                handler.style.transform = "scaleX(-1)";
                handler.style.borderRadius = "5px 0px 0px 5px";
                handler.style.backgroundColor = "rgb(26, 26, 26)";
                handler.style.border = "none";

                //console.log("Sidebar is hidden!");
            }
        }
    }
}