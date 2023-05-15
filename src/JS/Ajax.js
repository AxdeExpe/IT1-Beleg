export function getTask(){

    let xhr = getXHR();
    sendXHR(xhr);


    function xhrHandler(){
        console.log("Status: " + xhr.readyState);

        if(xhr.readyState != 4){
            return;
        }

        console.log("Sattus: " + xhr.readyState + " " + xhr.status);

        if(xhr.status == 200){
            console.log("Hier sollte das Doument erneuert werden mit den Infos (AJAX)!");
            return;
        }
        console.log("Irgendetwas lief schief :(");
    }

    function getXHR(){

        if(window.XMLHttpRequest){
            return new XMLHttpRequest();
        }
        return false;
    }


    function sendXHR(xhr){
        xhr.onreadystatechange = xhrHandler;
        xhr.open('GET', 'https://irene.informatik.htw-dresden.de:8888/api/quizzes/2');
        xhr.send(null);
    }
}