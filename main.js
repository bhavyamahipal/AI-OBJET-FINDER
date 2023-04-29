status="";
objects=[];

function setup(){
    canvas = createCanvas(480, 380);
    canvas.center();

    video = createCapture(VIDEO);
    video.size(480, 380);
    video.hide();
}

function modelLoaded(){
    status = true;
    console.log("Model is Loaded!");
}

function start(){
    objectDetector = ml5.objectDetector('cocossd', modelLoaded);
    document.getElementById("status_detect").innerHTML = "Status: Detecting Objects";
    object_to_be_deteted = document.getElementById("object_name").value;
}

function gotResult(error, results){
    if(error){
        console.error(error);
    }
        console.log(results);
        objects = results;
}

function draw(){
    image(video, 0, 0, 480, 380);

    if(status!=""){
        for(i=0; i < objects.length; i++){
            fill("#FF0000");
            percent = floor(objects[i].confidence * 100);
            text(objects[i].label + " " + percent + "%", objects[i].x + 15, objects[i].y + 15);
            noFill();
            stroke("#FF0000");
            rect(objects[i].x, objects[i].y, objects[i].width, objects[i].height);

            if(objects[i].label == object_to_be_deteted){
                video.stop();
                objectDetector.detect(gotResult);
                document.getElementById("status_found").innerHTML = object_to_be_deteted + " Found";

                synth = window.speechSynthesis;
                utterThis = new SpeechSynthesisUtterance(object_to_be_deteted/"found");
                synth.speak(utterThis);
            }
            else{
                document.getElementById("status_found").innerHTML = object_to_be_deteted + " Not Found";
            }
        }
    }
}
