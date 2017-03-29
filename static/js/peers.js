function update_data() {
    $.getJSON(
        "http://localhost:8000/getpeers",
        function(data) {
            var tablehtml="";
            var peers=data.getpeerinfo.result;
            //var now=(new Date).getTime()/1000;
            for (var row=0; row < peers.length; row++) {
                if (peers[row].inbound === true) {
                    var dir = 'inbound';
                } else {
                    var dir = 'outbound';
                }
                var verdel1=peers[row].subver.indexOf(":");
                var verdel2=peers[row].subver.indexOf(")/");
                var ver=peers[row].subver.substring(verdel1+1,verdel2+1);
                //var lastrecv=now-peers[row].lastrecv;
                //var lastsend=now-peers[row].lastsend;
                tablehtml += "<tr>";
                tablehtml += "<td>" + dir + "</td>";
                tablehtml += "<td>" + ver + "</td>";
                tablehtml += "<td>" + peers[row].addr + "</td>";
                tablehtml += "<td>" + peers[row].pingtime.toFixed(3) + "</td>";
                tablehtml += "<td>" + format_timestamp(peers[row].conntime) + "</td>";
                //tablehtml += "<td>" + lastrecv + "</td>";
                //tablehtml += "<td>" + lastsend + "</td>";
                //tablehtml += "<td>" + format_timestamp(peers[row].lastrecv) + "</td>";
                //tablehtml += "<td>" + format_timestamp(peers[row].lastsend) + "</td>";
                tablehtml += "</tr>";
            }
            $("#peerstable").html(tablehtml);
            $("#peerstable").removeClass();
        }
    ) .fail(function() {
        $("#peerstable").html("ERROR");
        $("#peerstable").removeClass();
        $("#peerstable").addClass("ERROR");
    });
    setTimeout(update_data,5000);
}

function format_timestamp(timestamp) {
    var tsdate = new Date(timestamp*1000);
    var year = tsdate.getFullYear();
    var month = tsdate.getMonth();
    var date = tsdate.getDate();
    var hour = tsdate.getHours();
    var min = tsdate.getMinutes(); var sec = tsdate.getSeconds();
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
