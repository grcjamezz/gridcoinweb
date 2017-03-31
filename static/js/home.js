function update_data() {
    $.getJSON(
        "http://localhost:8000/getinfo",
        function(data) {
            $("#balance").html(data.getinfo.result.balance);
            $("#balance").removeClass();
            $("#stake").html(data.getinfo.result.stake);
            $("#newmint").html(data.getinfo.result.newmint);
            $("#magnitude").html(data.listrsa.result[1]["Magnitude (Last Superblock)"]);
            $("#lastblockpaid").html(data.listrsa.result[1]["Last Block Paid"]);
            $("#dailyearnings").html(data.listrsa.result[1]["Expected Earnings (Daily)"]);
            $("#txfee").html(data.getinfo.result.paytxfee);
            $("#cpid").html(data.listrsa.result[1].CPID);
            $("#unlocked_until").html(format_timestamp(data.getinfo.result.unlocked_until));
            $("#version").html(data.getinfo.result.version);
            $("#connections").html(data.getinfo.result.connections);
            $("#blocks").html(data.getinfo.result.blocks);
            $("#posdifficulty").html(data.getinfo.result.difficulty["proof-of-stake"].toFixed(2));
            $("#powdifficulty").html(data.getinfo.result.difficulty["proof-of-work"].toFixed(2));
        }
    ) .fail(function() {
        $("#balance").html("ERROR");
        $("#balance").removeClass();
        $("#balance").addClass("ERROR");
        $("#stake").html("");
        $("#newmint").html("");
        $("#unlocked_until").html("");
        $("#version").html("ERROR");
    });

    $.getJSON(
        "http://localhost:8000/gettransactions",
        function(data) {
            var tablehtml="";
            var trans=data.listtransactions.result
            for (var row=trans.length-1; row >= 0; row--) {
                var account = trans[row].account;
                if (account == "") {
                    account = "(stake)";
                }
                tablehtml += "<tr>";
                tablehtml += "<td>" + "<a href=\"/txid/" +
                    trans[row].txid + "\"</a>" +
                    trans[row].txid.substring(0,6) + "</td>";
                tablehtml += "<td>" + "<a href=\"/account/" +
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
    var month = tsdate.getMonth()+1;
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
