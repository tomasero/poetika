var socket = io.connect('http://localhost:3000');

// when a "sensorReading" message comes through, show its value by
// writing the text of the div with id=showValue
socket.on('sensorReading', function (data) {
    $("#x-val").text(data.x);
    $("#y-val").text(data.y);
    $("#z-val").text(data.z);
    move(data);
});

function move(data) {
    var pos = $("#yo").position();
    var y = pos.top + data.x * 100;
    var z = (data.z - 1) * 100;
    var x = pos.left + data.y * 100;
    var yLimit = $(window).height() - $("#yo").height(),
        xLimit = $(window).width() - $("#yo").width()
    console.log(x, y);
    if (x < 0) {
        x = 0;
    } else if (x > xLimit) {
        x = xLimit;
    }
    if (y < 0) {
        y = 0;
    } else if (y > yLimit) {
        y = yLimit; 
    }
    $('#yo').css({
        "left": x + "px",
        "top": y + "px"
    });   
}

// when the user clicks one of the buttons, they call toggle()
// toggle emits a message to the socket with the new LED state
function toggle(theState) {
    console.log("toggle: "+theState);
    socket.emit('toggle',theState);
}
