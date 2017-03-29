function update_data() {
    $.getJSON(
        "http://localhost:8000/getinfo",
        function(data) {
            console.log(data)
            $("#version").html(data.getinfo.result["version"]);
            $("#version").removeClass();
            $("#balance").html(data.getinfo.result["balance"]);
            $("#blocks").html(data.getinfo.result["blocks"]);
            $("#connections").html(data.getinfo.result["connections"]);
            $("#unlocked_until").html(format_timestamp(data.getinfo.result["unlocked_until"]));

        }
    ) .fail(function() {
        $("#version").html("ERROR");
        $("#version").removeClass();
        $("#version").addClass("ERROR");
        $("#balance").html("");
        $("#blocks").html("");
        $("#connections").html("");
        $("#unlocked_until").html("");
    });
    setTimeout(update_data,5000);
}

function format_timestamp(timestamp) {
    var tsdate = new Date(timestamp*1000);
    var year = tsdate.getFullYear();
    var month = tsdate.getMonth();
    var date = tsdate.getDate();
    var hour = tsdate.getHours();
    var min = tsdate.getMinutes();
    var sec = tsdate.getSeconds();
    return year + "-" + pad(month,2) + "-" + pad(date,2) + " " + pad(hour,2) + ":" + pad(min,2) + ":" + pad(sec,2);
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

$(document).ready(function() {
  update_data();
});
