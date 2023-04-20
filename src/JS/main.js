"use strict"
document.addEventListener('DOMContentLoaded', function (){
    let m, p, v;
    m = new Model();
    p = new Presenter();
    v = new View(p);
    p.setModelAndView(m,v);
    p.start();
})

//---------------------Model--------------------------------------------------------------------
class Model{
    constructor(){

    }

      getTask(event, topic){


        return "1";
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

    loadTask(event){
        let topic = event.target.id;

        if(topic === "Mathe"){
            console.log("Topic: " + topic);
            this.#m.getTask(event, topic);
        }
        else if(topic === "IT 1"){
            console.log("Topic: " + topic);
            this.#m.getTask(event, topic);
        }
        else if(topic === "Allgemeines"){
            console.log("Topic: " + topic);
            this.#m.getTask(event, topic);
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
            this.File = "../JSON/Allgemeines.json";
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
        document.getElementById("Mathe").addEventListener("click", this.callLoadTask.bind(this));
        document.getElementById("IT 1").addEventListener("click", this.callLoadTask.bind(this));
        document.getElementById("Allgemeines").addEventListener("click", this.callLoadTask.bind(this));

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

    callLoadTask(event){
        this.#p.loadTask(event);
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