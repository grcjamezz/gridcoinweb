function update_data() {
    $.getJSON(
        "http://localhost:8000/listtransactions",
        function(data) {
            console.log(data)

            tablehtml="";
            trans=data.listtransactions.result
            for (var row=trans.length-1; row >= 0; row--) {
                var account = trans[row].account;
                if (account == "") {
                    account = "(stake)";
                }
                tablehtml += "<tr>";
                tablehtml += "<td>" + "<a href=\"/txid.html/" +
                    trans[row].txid + "\"</a>" +
                    trans[row].txid.substring(0,6) + "</td>";
                tablehtml += "<td>" + "<a href=\"/account.html/" +
                    trans[row].account + "\"</a>" + account + "</td>";
                tablehtml += "<td>" + trans[row].amount + "</td>";
                tablehtml += "<td>" + trans[row].category + "</td>";
                tablehtml += "<td>" + trans[row].confirmations + "</td>";
                tablehtml += "<td>" + format_timestamp(trans[row].time) + "</td>";
                tablehtml += "<td>" + format_timestamp(trans[row].timereceived) + "</td>";
                tablehtml += "</tr>";
            }
            $("#transtable").html(tablehtml);
            $("#transtable").removeClass();
        }
    ) .fail(function() {
        $("#transtable").html("ERROR");
        $("#transtable").removeClass();
        $("#transtable").addClass("ERROR");
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
