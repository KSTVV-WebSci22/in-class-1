$(document).ready(function(){

    console.log("running")
    $("#dial").hide();

    $("#select").click(function() {
        
        // Variable Save
        sessionStorage.setItem("nickname", $('#nickname').val());

        // Login hide, show dial up screen.
        $("#login").hide();
        $('#dial').show();

        var dialing = document.getElementById("dialing");
        dialing.play();
        var buddyin = document.getElementById("buddy-in");
        var message = document.getElementById("message");

        setTimeout(() => {
           $("#dial-status").html("Dialing 555-867-5309")
        }, 2000);

        setTimeout(() => {
            $("#dial-status").html("Connecting through TCHSHC");
            $("#connecting-img").show()
         }, 6000);

         setTimeout(() => {
            $("#dial-status").html("Connected!!!");
            $("#connected-img").show()
         }, 26000);

        setTimeout(() => {
            // Hide Dial up screen
            $('#dial').hide();  
            // Show Chat Screen
            $('#chat').css('display', 'flex');
            dialing.pause()
            buddyin.play()
        }, 26000);
    });
    
    var nick = sessionStorage.getItem("nickname");

    $("#message").on('input', function () {
        if($("#message").val() != "" && nick != null && nick != "") {
            $("#send").prop("disabled",false);
        }
        else {
            $("#send").prop("disabled",false);
        }
    });
});
    
// load socket.io-client
var socket = io();




function checkInput( str ) {
    let inputs = (str.trim()).split(' ');
    console.log("in: " + inputs[0])

    if (inputs[0] === '!weather') {
        console.log("valid")
        let zipcode = parseInt(inputs[1]);

        if(Number.isInteger(zipcode) && inputs[1].length === 5){
        console.log("zipcode")
        getWeatherByZip( inputs[1] );
        } 
    }
}
    
    // weather call
    function getWeatherByZip( zip ) {
        var url = `http://localhost:3000/getByZip/${zip}`
            $.ajax({
            type: "GET",
            url: url,
            dataType: "json",
            success: function(data) {
                console.log(data);
                $('#messages').append($('<li>').text(`Weather: ${data.main.temp}°F - ${data.weather[0].description}`));
                $('#messages li').last().css("color", "green");
            socket.emit('message', `Weather: ${data.main.temp}°F - ${data.weather[0].description}`);
            },
            error: function(msg) {
                // there was a problem
                alert("There was a problem: " + msg.status + " " + msg.statusText);
            }
        });
    }
    
    // on chat form submit, send msg to server
    $('#chat-form').submit(function(){
        
        // get nickname from session storage
        var nick = sessionStorage.getItem("nickname");
            
        // append and emit message
        $('#messages').append($('<li>').text(nick + ': ' + $('#message').val()));
            $('#messages li').last().css("color", "blue");
        socket.emit('message', nick + ': ' + $('#message').val());

        // Message Sound
        message.play();


        // Checking our text
        checkInput(document.getElementById("message").value);

        // Erasing our text
        $('#message').val('');

        // Button Disable if empty
        $("#send").prop("disabled",true);

        // Scroll to bottom of the page
        document.getElementById('messages').scrollTo(0,document.getElementById("messages").scrollHeight);
        return false;
    });
    
    // on msg received, append to list
    


//Make the DIV element draggagle:
dragElement(document.getElementById("login"));
dragElement(document.getElementById("chat"));


function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}